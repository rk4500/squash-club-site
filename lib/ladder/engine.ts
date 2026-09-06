/**
 * Bracket logic. Pure — no DOM, no React, no Supabase. Every function takes
 * both the draw and the recorded results explicitly, so the whole page is a
 * function of its inputs and this module can be tested against a fixed draw.
 */

import { RANK_PAIRS, type Match, type SideRef } from '@/data/ladder/draw'

/**
 * The draw these functions operate on, passed in rather than imported: it is
 * loaded from the database at runtime, and keeping it a parameter is what lets
 * this module stay pure.
 */
export type Matches = Record<string, Match>

/** Which side of a match box won. 'a' is the top player, 'b' the bottom. */
export type Winner = 'a' | 'b'

/** The two players' names at the moment a result was recorded. */
export type Snapshot = { a: string; b: string }

export type Results = Record<string, Winner>
export type Snapshots = Record<string, Snapshot>

export type ResolvedPlayer = {
  name: string
  /** False when this slot is still "Winner of QF-1" rather than a person. */
  known: boolean
  bye?: boolean
}

/**
 * Walk a side reference down to an actual player.
 *
 * Recursive: ["W","M17"] asks who won M17, which may itself depend on M1 and
 * M2. Unrecorded matches stop the walk and yield a placeholder.
 */
export function resolveRef(side: SideRef, results: Results, matches: Matches): ResolvedPlayer {
  const [type, val] = side
  if (type === 'name') return { name: val, known: true }
  if (type === 'bye') return { name: 'BYE', known: true, bye: true }

  const winner = results[val]
  if (!winner) {
    return { name: `${type === 'W' ? 'Winner' : 'Loser'} of ${matches[val].display}`, known: false }
  }
  const a = resolveSide(val, 'a', results, matches)
  const b = resolveSide(val, 'b', results, matches)
  const won = winner === 'a' ? a : b
  const lost = winner === 'a' ? b : a
  return type === 'W' ? won : lost
}

export function resolveSide(mid: string, key: Winner, results: Results, matches: Matches): ResolvedPlayer {
  return resolveRef(matches[mid][key], results, matches)
}

/** Both players in a match, resolved. */
export function participants(mid: string, results: Results, matches: Matches): [ResolvedPlayer, ResolvedPlayer] {
  return [resolveSide(mid, 'a', results, matches), resolveSide(mid, 'b', results, matches)]
}

/**
 * Snapshot the current participants, or null if either is still unknown.
 * Recorded alongside a result so that clearing an upstream match can be
 * detected later rather than silently rewriting who played.
 */
export function snapshotOf(mid: string, results: Results, matches: Matches): Snapshot | null {
  const [a, b] = participants(mid, results, matches)
  return a.known && b.known ? { a: a.name, b: b.name } : null
}

/**
 * - `open`     nothing recorded
 * - `done`     recorded, participants still match the snapshot
 * - `orphan`   recorded, but a feeder was cleared so participants are unknown
 * - `conflict` recorded, participants known but no longer who actually played
 */
export type MatchState = 'open' | 'done' | 'orphan' | 'conflict'

export function matchState(mid: string, results: Results, snaps: Snapshots, matches: Matches): MatchState {
  if (!results[mid]) return 'open'
  const [a, b] = participants(mid, results, matches)
  if (!a.known || !b.known) return 'orphan'
  const snap = snaps[mid]
  if (snap && (snap.a !== a.name || snap.b !== b.name)) return 'conflict'
  return 'done'
}

/**
 * Everything downstream of a broken match, to a fixpoint.
 *
 * Clearing one match never deletes later results — it marks them provisional.
 * Re-picking the same winner clears the whole cascade; picking a different one
 * moves the conflict exactly one level downstream.
 */
export function computeTaint(results: Results, snaps: Snapshots, matches: Matches) {
  const broken = new Set<string>()
  for (const mid of Object.keys(matches)) {
    const st = matchState(mid, results, snaps, matches)
    if (st === 'orphan' || st === 'conflict') broken.add(mid)
  }

  const taint = new Set<string>()
  let changed = true
  while (changed) {
    changed = false
    for (const [mid, m] of Object.entries(matches)) {
      if (taint.has(mid)) continue
      for (const key of ['a', 'b'] as const) {
        const [type, ref] = m[key]
        if ((type === 'W' || type === 'L') && (broken.has(ref) || taint.has(ref))) {
          taint.add(mid)
          changed = true
          break
        }
      }
    }
  }
  return { broken, taint }
}

/**
 * A match can be picked when both players are known and it is not already
 * settled. A recorded match reopens only when the players under it changed.
 */
export function isReady(mid: string, results: Results, snaps: Snapshots, matches: Matches): boolean {
  const [a, b] = participants(mid, results, matches)
  if (!a.known || !b.known || a.bye || b.bye) return false
  return !results[mid] || matchState(mid, results, snaps, matches) === 'conflict'
}

/**
 * Fill in snapshots for results that arrived without one (hand-written
 * imports, older saves) and drop snapshots whose result is gone. Returns new
 * objects only when something actually changed, so callers can skip a write.
 */
export function backfillSnapshots(results: Results, snaps: Snapshots, matches: Matches): { snaps: Snapshots; changed: boolean } {
  const next: Snapshots = { ...snaps }
  let changed = false

  for (const mid of Object.keys(results)) {
    if (next[mid]) continue
    const snap = snapshotOf(mid, results, matches)
    if (snap) {
      next[mid] = snap
      changed = true
    }
  }
  for (const mid of Object.keys(next)) {
    if (!results[mid]) {
      delete next[mid]
      changed = true
    }
  }
  return { snaps: changed ? next : snaps, changed }
}

/** Final placings decided so far, in rank order. */
export type Placing = { rank: number; name: string; provisional: boolean }

export function standings(results: Results, snaps: Snapshots, taint: Set<string>, matches: Matches): Placing[] {
  const out: Placing[] = []
  for (const [mid, rank] of RANK_PAIRS) {
    if (!matches[mid] || matchState(mid, results, snaps, matches) !== 'done') continue
    const [a, b] = participants(mid, results, matches)
    const won = results[mid] === 'a' ? a : b
    const lost = results[mid] === 'a' ? b : a
    const provisional = taint.has(mid)
    out.push({ rank, name: won.name, provisional })
    out.push({ rank: rank + 1, name: lost.name, provisional })
  }
  return out
}

/** The champion, once the final is settled. */
export function champion(results: Results, snaps: Snapshots, matches: Matches): ResolvedPlayer | null {
  if (!matches.F || matchState('F', results, snaps, matches) !== 'done') return null
  return resolveSide('F', results.F, results, matches)
}

/* ── export / import ─────────────────────────────────────────────────────── */

export const IO_FORMAT = 'flame-ladder-results'
export const IO_VERSION = 1

export type ExportPayload = {
  format: string
  version: number
  draw: string
  savedAt: string
  decided: number
  total: number
  results: Results
  snapshots: Snapshots
}

export function exportPayload(results: Results, snaps: Snapshots, draw: string, matches: Matches): ExportPayload {
  return {
    format: IO_FORMAT,
    version: IO_VERSION,
    draw,
    savedAt: new Date().toISOString(),
    decided: Object.keys(results).length,
    total: Object.keys(matches).length,
    results: { ...results },
    snapshots: { ...snaps },
  }
}

export type ParsedImport = {
  results: Results
  snapshots: Snapshots
  /** Match IDs that were not recognised, or whose value was not a/b. */
  skipped: string[]
  /** Set when the file names a different draw, so the caller can confirm. */
  foreignDraw: string | null
}

/**
 * Accepts a full export, or a bare `{"M1":"a"}` map so a partly finished set
 * can be typed by hand. Throws on anything that is not readable JSON — the
 * caller reports that to the user.
 */
export function parseImport(raw: string, matches: Matches): ParsedImport {
  let obj: unknown
  try {
    obj = JSON.parse(raw)
  } catch (e) {
    throw new Error(`could not read it: ${(e as Error).message}`)
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    throw new Error('expected a JSON object.')
  }

  const doc = obj as Record<string, unknown>
  const rawResults = (doc.results && typeof doc.results === 'object' ? doc.results : doc) as Record<string, unknown>
  const rawSnaps = (doc.snapshots && typeof doc.snapshots === 'object' ? doc.snapshots : {}) as Record<string, unknown>

  const results: Results = {}
  const skipped: string[] = []
  for (const [mid, v] of Object.entries(rawResults)) {
    if (matches[mid] && (v === 'a' || v === 'b')) results[mid] = v
    else skipped.push(mid)
  }

  const snapshots: Snapshots = {}
  for (const [mid, sn] of Object.entries(rawSnaps)) {
    const s = sn as Record<string, unknown>
    if (results[mid] && s && typeof s.a === 'string' && typeof s.b === 'string') {
      snapshots[mid] = { a: s.a, b: s.b }
    }
  }

  const draw = typeof doc.draw === 'string' ? doc.draw : null
  return { results, snapshots, skipped, foreignDraw: draw }
}
