'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DRAW_ID, MATCHES } from '@/data/ladder/draw'
import {
  backfillSnapshots, champion, computeTaint, exportPayload, parseImport,
  snapshotOf, standings,
  type Results, type Snapshots, type Winner,
} from './engine'
import { localStore, type LadderStore } from './store'

export type LadderState = ReturnType<typeof useLadder>

export function useLadder(store: LadderStore = localStore) {
  const [results, setResults] = useState<Results>({})
  const [snaps, setSnaps] = useState<Snapshots>({})
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<{ text: string; bad: boolean } | null>(null)

  // Reading state inside callbacks without making them change identity on
  // every keystroke of the bracket.
  const latest = useRef({ results, snaps })
  latest.current = { results, snaps }

  const reload = useCallback(async () => {
    const loaded = await store.load()
    const fixed = backfillSnapshots(loaded.results, loaded.snaps)
    setResults(loaded.results)
    setSnaps(fixed.snaps)
    // A hand-written import can arrive without snapshots; persist the ones we
    // were able to infer so the next load does not have to redo it.
    if (fixed.changed) await store.replaceAll(loaded.results, fixed.snaps)
    setLoading(false)
  }, [store])

  useEffect(() => { void reload() }, [reload])

  // Live updates from other editors, when the store supports them.
  useEffect(() => store.subscribe?.(() => { void reload() }), [store, reload])

  const say = useCallback((text: string, bad = false) => setStatus({ text, bad }), [])

  const pick = useCallback(async (mid: string, side: Winner) => {
    const next = { ...latest.current.results, [mid]: side }
    const snap = snapshotOf(mid, next)
    const nextSnaps = { ...latest.current.snaps }
    if (snap) nextSnaps[mid] = snap
    else delete nextSnaps[mid]

    setResults(next)
    setSnaps(nextSnaps)
    await store.setWinner(mid, side, snap)
  }, [store])

  const clear = useCallback(async (mid: string) => {
    const next = { ...latest.current.results }
    const nextSnaps = { ...latest.current.snaps }
    delete next[mid]
    delete nextSnaps[mid]

    setResults(next)
    setSnaps(nextSnaps)
    await store.clearMatch(mid)
  }, [store])

  const resetAll = useCallback(async () => {
    setResults({})
    setSnaps({})
    await store.replaceAll({}, {})
    say('All results cleared.')
  }, [store, say])

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
      parsed = parseImport(raw)
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

    const fixed = backfillSnapshots(parsed.results, parsed.snapshots)
    setResults(parsed.results)
    setSnaps(fixed.snaps)
    await store.replaceAll(parsed.results, fixed.snaps)

    const broken = computeTaint(parsed.results, fixed.snaps).broken
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
  }, [store, say])

  const payload = useCallback(
    () => exportPayload(latest.current.results, latest.current.snaps, DRAW_ID),
    [],
  )

  const derived = useMemo(() => {
    const { broken, taint } = computeTaint(results, snaps)
    return {
      broken,
      taint,
      placings: standings(results, snaps, taint),
      champ: champion(results, snaps),
      decided: Object.keys(results).length,
      total: Object.keys(MATCHES).length,
    }
  }, [results, snaps])

  return {
    results, snaps, loading, status, say,
    pick, clear, resetAll, importFrom, payload,
    ...derived,
  }
}
