import { DRAW_ID } from '@/data/ladder/draw'
import type { Results, Snapshot, Snapshots } from './engine'

/**
 * Where bracket results live.
 *
 * Deliberately row-per-match rather than one blob: it is what the
 * ladder_results table looks like, it lets two people record different
 * matches at the same time without clobbering each other, and it keeps a
 * single pick from rewriting the whole season.
 *
 * The Supabase implementation lands on top of this interface — nothing above
 * it needs to change.
 */
export type LadderStore = {
  load(): Promise<{ results: Results; snaps: Snapshots }>
  setWinner(mid: string, side: 'a' | 'b', snap: Snapshot | null): Promise<void>
  clearMatch(mid: string): Promise<void>
  /** Wholesale replace, for import and reset. */
  replaceAll(results: Results, snaps: Snapshots): Promise<void>
  /** Live updates from other editors. Returns an unsubscribe. */
  subscribe?(onChange: () => void): () => void
}

const RESULTS_KEY = `${DRAW_ID}-results`
const SNAPS_KEY = `${DRAW_ID}-snapshots`

/**
 * Browser-local store. Same localStorage keys the standalone ladder-v2.html
 * used, so results recorded there carry over. Stands in until the Supabase
 * store is wired, and remains the offline fallback.
 */
export const localStore: LadderStore = {
  async load() {
    return { results: read<Results>(RESULTS_KEY), snaps: read<Snapshots>(SNAPS_KEY) }
  },

  async setWinner(mid, side, snap) {
    const results = read<Results>(RESULTS_KEY)
    const snaps = read<Snapshots>(SNAPS_KEY)
    results[mid] = side
    if (snap) snaps[mid] = snap
    else delete snaps[mid]
    write(RESULTS_KEY, results)
    write(SNAPS_KEY, snaps)
  },

  async clearMatch(mid) {
    const results = read<Results>(RESULTS_KEY)
    const snaps = read<Snapshots>(SNAPS_KEY)
    delete results[mid]
    delete snaps[mid]
    write(RESULTS_KEY, results)
    write(SNAPS_KEY, snaps)
  },

  async replaceAll(results, snaps) {
    write(RESULTS_KEY, results)
    write(SNAPS_KEY, snaps)
  },
}

function read<T>(key: string): T {
  if (typeof window === 'undefined') return {} as T
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '{}') as T
  } catch {
    // Corrupt or unreadable (private mode, cleared storage) — start empty
    // rather than taking the page down.
    return {} as T
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota or a browser blocking site data. The in-memory state is still
    // correct for this session; export is the escape hatch.
  }
}
