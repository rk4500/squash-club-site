import { DRAW_ID, type DrawData, type Match, type ScheduleSrc, type SideRef, type Slot } from '@/data/ladder/draw'
import type { SupabaseClient } from '@supabase/supabase-js'

export const MATCHES_TABLE = 'ladder_matches'

export const MATCH_COLUMNS =
  'match_id, label, display, route, a_type, a_ref, b_type, b_ref, day, time, court, src'

export type MatchRow = {
  match_id: string
  label: string
  display: string
  route: string
  a_type: SideRef[0]
  a_ref: string
  b_type: SideRef[0]
  b_ref: string
  day: Slot['day'] | null
  time: string | null
  court: string | null
  src: ScheduleSrc | null
}

/** What the edit form may change. Structure and identity are not in here. */
export type MatchEdit = {
  a_ref?: string
  b_ref?: string
  day?: Slot['day'] | null
  time?: string | null
  court?: string | null
  src?: ScheduleSrc | null
}

export function rowsToDraw(rows: MatchRow[]): DrawData {
  const matches: Record<string, Match> = {}
  const schedule: Record<string, Slot> = {}

  for (const r of rows) {
    matches[r.match_id] = {
      label: r.label,
      display: r.display,
      route: r.route,
      a: [r.a_type, r.a_ref] as SideRef,
      b: [r.b_type, r.b_ref] as SideRef,
    }
    // The table constrains these four to be all set or all null, so testing
    // one is enough to know the match is scheduled.
    if (r.day && r.time && r.court && r.src) {
      schedule[r.match_id] = { day: r.day, time: r.time, court: r.court, src: r.src }
    }
  }
  return { matches, schedule }
}

/**
 * Load the draw. Works with either the server or the browser client — reading
 * is open to everyone, so no session is needed.
 */
export async function loadDraw(supabase: SupabaseClient): Promise<DrawData> {
  const { data, error } = await supabase
    .from(MATCHES_TABLE)
    .select(MATCH_COLUMNS)
    .eq('draw', DRAW_ID)

  if (error) throw new Error(`Could not load the draw: ${error.message}`)
  return rowsToDraw((data ?? []) as MatchRow[])
}

/**
 * Save edits to one match. Only the columns present are written, so a caller
 * that changed a court time cannot accidentally blank a player name.
 */
export async function saveMatch(supabase: SupabaseClient, mid: string, edit: MatchEdit) {
  const { error } = await supabase
    .from(MATCHES_TABLE)
    .update(edit)
    .eq('draw', DRAW_ID)
    .eq('match_id', mid)

  if (error) throw new Error(`Could not save ${mid}: ${error.message}`)
}
