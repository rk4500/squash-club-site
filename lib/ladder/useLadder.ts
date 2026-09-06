'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DRAW_ID } from '@/data/ladder/draw'
import {
  backfillSnapshots, champion, computeTaint, exportPayload, parseImport,
  snapshotOf, standings,
  type Matches, type Results, type Snapshots, type Winner,
} from './engine'
import { localStore, type LadderStore } from './store'

export type LadderState = ReturnType<typeof useLadder>

export function useLadder(matches: Matches, store: LadderStore = localStore) {
  const [results, setResults] = useState<Results>({})
  const [snaps, setSnaps] = useState<Snapshots>({})
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{ text: string; bad: boolean } | null>(null)

  // Reading state inside callbacks without making them change identity on
  // every keystroke of the bracket.
  const latest = useRef({ results, snaps })
  latest.current = { results, snaps }

  const reload = useCallback(async () => {
    try {
      const loaded = await store.load()
      const fixed = backfillSnapshots(loaded.results, loaded.snaps, matches)
      setResults(loaded.results)
      setSnaps(fixed.snaps)
      // A hand-written import can arrive without snapshots; persist the ones
      // we were able to infer. Only a signed-in user may write, so a refusal
      // here is expected for visitors and must not break the page.
      if (fixed.changed) await store.replaceAll(loaded.results, fixed.snaps).catch(() => {})
    } catch (e) {
      setStatus({ text: `Could not load results: ${(e as Error).message}`, bad: true })
    } finally {
      setLoading(false)
    }
  }, [store, matches])

  useEffect(() => { void reload() }, [reload])

  // Live updates from other editors, when the store supports them.
  useEffect(() => store.subscribe?.(() => { void reload() }), [store, reload])

  const say = useCallback((text: string, bad = false) => setStatus({ text, bad }), [])

  /**
   * Apply a change locally so the board responds immediately, then persist.
   * If the write is refused — an expired session, a lost connection — put the
   * previous state back rather than leaving the screen showing a result that
   * was never saved.
   */
  const commit = useCallback(async (
    nextResults: Results,
    nextSnaps: Snapshots,
    persist: () => Promise<void>,
  ): Promise<boolean> => {
    const prev = latest.current
    setResults(nextResults)
    setSnaps(nextSnaps)
    try {
      await persist()
      return true
    } catch (e) {
      setResults(prev.results)
      setSnaps(prev.snaps)
      setStatus({ text: `Not saved — ${(e as Error).message}`, bad: true })
      return false
    }
  }, [])

  const pick = useCallback(async (mid: string, side: Winner) => {
    const next = { ...latest.current.results, [mid]: side }
    const snap = snapshotOf(mid, next, matches)
    const nextSnaps = { ...latest.current.snaps }
    if (snap) nextSnaps[mid] = snap
    else delete nextSnaps[mid]

    await commit(next, nextSnaps, () => store.setWinner(mid, side, snap))
  }, [store, commit, matches])

  const clear = useCallback(async (mid: string) => {
    const next = { ...latest.current.results }
    const nextSnaps = { ...latest.current.snaps }
    delete next[mid]
    delete nextSnaps[mid]

    await commit(next, nextSnaps, () => store.clearMatch(mid))
  }, [store, commit])

  const resetAll = useCallback(async () => {
    if (await commit({}, {}, () => store.replaceAll({}, {}))) say('All results cleared.')
  }, [store, commit, say])

  /**
   * Load an exported file or a hand-written map. `confirmForeign` and
   * `confirmOverwrite` let the caller put the two destructive questions in
   * front of the user; returning false abandons the import.
   */
  const importFrom = useCallback(async (
    raw: string,
    label: string,
    confirmForeign: (draw: string) => boolean,
    confirmOverwrite: (existing: number, incoming: number) => boolean,
  ) => {
    let parsed
    try {
      parsed = parseImport(raw, matches)
    } catch (e) {
      say(`Could not read ${label}: ${(e as Error).message}`, true)
      return
    }

    if (parsed.foreignDraw && parsed.foreignDraw !== DRAW_ID && !confirmForeign(parsed.foreignDraw)) return

    const incoming = Object.keys(parsed.results).length
    if (!incoming) {
      say(`Nothing usable in ${label} — no recognised match results.`, true)
      return
    }

    const existing = Object.keys(latest.current.results).length
    if (existing && !confirmOverwrite(existing, incoming)) return

    const fixed = backfillSnapshots(parsed.results, parsed.snapshots, matches)
    // On failure commit() has already restored the previous results and said why.
    const ok = await commit(parsed.results, fixed.snaps, () =>
      store.replaceAll(parsed.results, fixed.snaps))
    if (!ok) return

    const broken = computeTaint(parsed.results, fixed.snaps, matches).broken
    let msg = `Imported ${incoming} result${incoming === 1 ? '' : 's'} from ${label}.`
    if (parsed.skipped.length) {
      const shown = parsed.skipped.slice(0, 4).join(', ')
      msg += ` Skipped ${parsed.skipped.length} unrecognised entr${parsed.skipped.length === 1 ? 'y' : 'ies'}`
        + ` (${shown}${parsed.skipped.length > 4 ? '…' : ''}).`
    }
    if (broken.size) {
      msg += ` ${broken.size} match${broken.size === 1 ? ' needs' : 'es need'} re-checking — see the flagged boxes.`
    }
    say(msg)
  }, [store, say, matches])

  const payload = useCallback(
    () => exportPayload(latest.current.results, latest.current.snaps, DRAW_ID, matches),
    [matches],
  )

  const derived = useMemo(() => {
    const { broken, taint } = computeTaint(results, snaps, matches)
    return {
      broken,
      taint,
      placings: standings(results, snaps, taint, matches),
      champ: champion(results, snaps, matches),
      decided: Object.keys(results).length,
      total: Object.keys(matches).length,
    }
  }, [results, snaps, matches])

  return {
    results, snaps, loading, status, say,
    pick, clear, resetAll, importFrom, payload,
    ...derived,
  }
}
