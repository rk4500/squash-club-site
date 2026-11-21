import type { Metadata } from 'next'
import { ogCard, pageMetadata } from '@/lib/seo'
import BracketBoard from '@/components/ladder/BracketBoard'
import { getUser, createClient } from '@/lib/supabase/server'
import { loadDraw } from '@/lib/ladder/drawStore'
import type { BracketSpec, DrawData } from '@/data/ladder/draw'
import seed from '@/data/fsc/fsc-2026.json'
import '../ladder/bracket/ladder.css'

const TITLE = 'FSC 2.0 Draws'
const DESCRIPTION = 'FSC 2.0, the FLAME Squash Championship: live draws, results and court schedule for Men’s Open, Women’s Open, Girls U-17 and Mixed Doubles, 21 to 22 November 2026.'
const OG_IMAGE = ogCard('og-fsc.jpg', 'FSC 2.0, FLAME Squash Championship, 21–22 Nov 2026')

export const metadata: Metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/fsc', image: OG_IMAGE })

const DRAW_ID = seed.drawId
const BRACKETS = seed.brackets as unknown as BracketSpec[]
const SEED_DRAW = seed.draw as unknown as DrawData

// Nothing about a live draw is static: results and edits must show on reload.
export const dynamic = 'force-dynamic'

const EVENTS: [string, string][] = [
  ['mo', "Men's Open"],
  ['wo', "Women's Open"],
  ['gu', 'Girls U-17'],
  ['xd', 'Mixed Doubles'],
]

const LEGEND: [string, string][] = [
  ['M01, M02…', 'Match numbers in playing order, by day, time and court'],
  ['Qualifying', 'Played first; the winner takes the open slot in the main draw'],
  ['Bye', 'No opponent; the player goes straight through to the next round'],
  ['Gold-outlined matches', 'Finals and 3rd-place matches, which decide the podium'],
  ['Dashed red box', 'Result kept but its players changed; re-check it'],
  ['Dotted red-striped box', 'Provisional: sits downstream of a match that needs re-checking'],
]

/**
 * Loads the live draw, or null if the database does not have it yet (the
 * migration that seeds fsc-2026 has not been pushed, or Supabase is down).
 */
async function liveDraw(): Promise<DrawData | null> {
  try {
    const draw = await loadDraw(createClient(), DRAW_ID)
    return Object.keys(draw.matches).length ? draw : null
  } catch {
    return null
  }
}

export default async function FscPage() {
  const live = await liveDraw()
  // Signed in means committee. The database enforces the same rule on its
  // own; this only decides whether the controls are worth showing.
  const admin = !!live && !!(await getUser())

  return (
    <div className="pt-[68px] bg-[#05080f]">
      <section className="relative py-20 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_30%,rgba(245,168,0,0.08),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="font-condensed text-[11px] tracking-[0.25em] uppercase text-[#f5a800] flex items-center gap-2.5 mb-6 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800]">
            FLAME Squash Championship · 21–22 November 2026
          </p>
          <h1 className="font-bebas text-[16vw] md:text-9xl tracking-wider leading-none mb-5">
            <span className="text-white">FSC</span>{' '}
            <span className="gold-text">2.0</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-2xl leading-relaxed font-light">
            Four events, two courts, two days. Saturday runs from 8:00 AM to 8:00 PM; Sunday from
            12:00 PM through the finals.
          </p>
          <nav aria-label="Events" className="flex flex-wrap gap-2 mt-8">
            {EVENTS.map(([id, name]) => (
              <a
                key={id}
                href={`#${id}`}
                className="font-condensed text-xs tracking-[0.2em] uppercase border border-[#f5a800]/25 text-[#f5a800]/80 px-4 py-2 hover:bg-[#f5a800] hover:text-[#05080f] transition-colors"
              >
                {name}
              </a>
            ))}
            <a
              href="#schedule"
              className="font-condensed text-xs tracking-[0.2em] uppercase border border-white/10 text-white/50 px-4 py-2 hover:border-white/30 hover:text-white transition-colors"
            >
              Schedule
            </a>
          </nav>
        </div>
      </section>

      <div className="ladder max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <h2 className="font-bebas text-4xl md:text-5xl tracking-wider uppercase mb-3">Draws</h2>
        <p className="font-barlow text-white/40 text-sm max-w-[78ch] leading-relaxed mb-2">
          {!live
            ? 'The printed draw. Live results will appear here once play begins.'
            : admin
              ? 'Click a player inside a match box to set the winner. Later rounds fill in automatically, and everyone watching sees the result immediately. Switch to Edit draw to correct a name, time or court in the box itself.'
              : 'Results update live as they are recorded.'}
        </p>

        <BracketBoard
          draw={live ?? SEED_DRAW}
          drawId={DRAW_ID}
          brackets={BRACKETS}
          admin={admin}
          frozen={live ? undefined : { results: {}, snaps: {} }}
        />

        <details className="lc-io mt-14">
          <summary>Legend</summary>
          <div className="lc-legend mt-3">
            {LEGEND.map(([term, meaning]) => (
              <div key={term}><b>{term}</b>: {meaning}</div>
            ))}
          </div>
        </details>
      </div>
    </div>
  )
}
