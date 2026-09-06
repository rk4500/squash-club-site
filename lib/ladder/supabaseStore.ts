'use client'

import { DRAW_ID } from '@/data/ladder/draw'
import { createClient } from '@/lib/supabase/client'
import type { Results, Snapshots, Winner } from './engine'
import type { LadderStore } from './store'

const TABLE = 'ladder_results'

type Row = {
  draw: string
  match_id: string
  winner: Winner
  snap_a: string | null
  snap_b: string | null
}

/**
 * Results in Supabase, one row per decided match.
 *
 * Reads are open to everyone and writes require a signed-in user — that is
 * enforced by row level security on the table, not here. A visitor's client
 * can call every method on this object; the ones that write will simply be
 * refused. Hiding the controls in the UI is a matter of not showing people
 * buttons that would fail.
 */
export function createSupabaseStore(): LadderStore {
  const supabase = createClient()

  return {
    async load() {
      const { data, error } = await supabase
        .from(TABLE)
        .select('draw, match_id, winner, snap_a, snap_b')
        .eq('draw', DRAW_ID)

      if (error) throw new Error(`Could not load results: ${error.message}`)

      const results: Results = {}
      const snaps: Snapshots = {}
      for (const row of (data ?? []) as Row[]) {
        results[row.match_id] = row.winner
        if (row.snap_a !== null && row.snap_b !== null) {
          snaps[row.match_id] = { a: row.snap_a, b: row.snap_b }
        }
      }
      return { results, snaps }
    },

    async setWinner(mid, side, snap) {
      const { error } = await supabase
        .from(TABLE)
        .upsert(
          {
            draw: DRAW_ID,
            match_id: mid,
            winner: side,
            snap_a: snap?.a ?? null,
            snap_b: snap?.b ?? null,
          },
          { onConflict: 'draw,match_id' },
        )
      if (error) throw new Error(`Could not save ${mid}: ${error.message}`)
    },

    async clearMatch(mid) {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq('draw', DRAW_ID)
        .eq('match_id', mid)
      if (error) throw new Error(`Could not clear ${mid}: ${error.message}`)
    },

    async replaceAll(results, snaps) {
      // Import and reset are the only wholesale operations, and both are
      // already behind a confirmation. Delete then insert rather than
      // diffing: it is one clear intent, and a partial import that left
      // stale rows behind would be worse than a brief empty table.
      const { error: delErr } = await supabase.from(TABLE).delete().eq('draw', DRAW_ID)
      if (delErr) throw new Error(`Could not clear results: ${delErr.message}`)

      const rows: Row[] = Object.entries(results).map(([mid, winner]) => ({
        draw: DRAW_ID,
        match_id: mid,
        winner,
        snap_a: snaps[mid]?.a ?? null,
        snap_b: snaps[mid]?.b ?? null,
      }))
      if (!rows.length) return

      const { error: insErr } = await supabase.from(TABLE).insert(rows)
      if (insErr) throw new Error(`Could not write results: ${insErr.message}`)
    },

    subscribe(onChange) {
      const channel = supabase
        .channel('ladder-results')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: TABLE, filter: `draw=eq.${DRAW_ID}` },
          () => onChange(),
        )
        .subscribe()

      return () => { void supabase.removeChannel(channel) }
    },
  }
}
