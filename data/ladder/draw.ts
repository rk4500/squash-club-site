/**
 * Shapes for the 2026-27 ladder draw, and the parts of it that are structural
 * rather than editable.
 *
 * The draw's contents -- who plays whom, and when -- live in the
 * ladder_matches table; see data/ladder/seed.ts. What stays here is how the
 * tree is laid out and which matches decide which placings, neither of which
 * changes during a season.
 *
 * A side is one of:
 *   ["name", "Priyaan Thakker"]  a real entrant, known up front
 *   ["W", "M1"]                  whoever wins M1
 *   ["L", "M1"]                  whoever loses M1
 *   ["bye", ""]                  no opponent (unused in this draw, still handled)
 */

export type SideRef =
  | readonly ['name', string]
  | readonly ['W', string]
  | readonly ['L', string]
  | readonly ['bye', string]

export type Match = {
  /** Round name, e.g. "Quarterfinal". */
  label: string
  /** Short name shown on the box and in the schedule, e.g. "QF-1". */
  display: string
  /** Where the winner and loser go next, in words. */
  route: string
  a: SideRef
  b: SideRef
}

/** Where a slot's time and court came from. */
export type ScheduleSrc = 'printed' | 'fixed' | 'planned'

export type Slot = {
  day: 'Saturday' | 'Sunday'
  time: string
  court: string
  src: ScheduleSrc
}

export const DRAW_ID = 'ladder-v2'

/**
 * Column layout, one array per round. Drives the drawing: each round is a flex
 * column of equal height, so adjacent match centres sit exactly one cell apart
 * and a pair's midpoint lands on the next round's cell centre.
 */
export type BracketSpec = {
  /** Anchor for the heading and the URL hash. */
  id: string
  title: string
  columns: readonly (readonly string[])[]
  headings: readonly string[]
  /** Consolation matches, drawn in a trailing "Playoff" column. */
  playoffs: readonly string[]
}

export const BRACKETS: readonly BracketSpec[] = [
  {
    id: 'main',
    title: 'Main Draw — Ranks 1–4',
    columns: [
      ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12','M13','M14','M15','M16'],
      ['M17','M18','M19','M20','M21','M22','M23','M24'],
      ['QF1','QF2','QF3','QF4'],
      ['SF1','SF2'],
      ['F'],
    ],
    headings: ['Round of 32','Round of 16','Quarterfinals','Semifinals','Final'],
    playoffs: ['P34'],
  },
  {
    id: 'p5',
    title: 'Ranks 5–8',
    columns: [['P5_1','P5_2'], ['P5F']],
    headings: ['5–8 Semifinals','5–6 Final'],
    playoffs: ['P5_34'],
  },
  {
    // 1,4,2,3 rather than 1,2,3,4 — this is the order the qualifiers feed the
    // semifinals in, so drawing it this way keeps the connectors straight.
    id: 'p9',
    title: 'Ranks 9–12',
    columns: [['P9_1','P9_4','P9_2','P9_3'], ['P9SF1','P9SF2'], ['P9F']],
    headings: ['9–16 Qualifiers','9–12 Semifinals','9–10 Final'],
    playoffs: ['P9_34'],
  },
  {
    id: 'p13',
    title: 'Ranks 13–16',
    columns: [['P13_1','P13_2'], ['P13F']],
    headings: ['13–16 Semifinals','13–14 Final'],
    playoffs: ['P13_34'],
  },
  {
    id: 'q',
    title: 'Ranks 17–20',
    columns: [
      ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8'],
      ['Q9','Q10','Q11','Q12'],
      ['Q13','Q14'],
      ['QFIN'],
    ],
    headings: ['17–20 Round 1','17–20 Round 2','17–20 Semifinals','17–18 Final'],
    playoffs: ['Q34'],
  },
]

/**
 * Matches that decide a final placing, and the rank their winner takes. The
 * loser takes the rank below.
 */
export const RANK_PAIRS: readonly (readonly [string, number])[] = [
  ['F', 1], ['P34', 3], ['P5F', 5], ['P5_34', 7], ['P9F', 9],
  ['P9_34', 11], ['P13F', 13], ['P13_34', 15], ['QFIN', 17], ['Q34', 19],
]

/** How a schedule slot's provenance reads on the page. */
export const SRC_LABEL: Record<ScheduleSrc, string> = {
  printed: 'printed',
  fixed: 'adjusted',
  planned: 'planned',
}

/** The draw as the page consumes it, however it was loaded. */
export type DrawData = {
  matches: Record<string, Match>
  schedule: Record<string, Slot>
}
