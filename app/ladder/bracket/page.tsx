import type { Metadata } from 'next'
import Link from 'next/link'
import BracketBoard from '@/components/ladder/BracketBoard'
import './ladder.css'

export const metadata: Metadata = {
  title: 'Ladder Bracket · FLAME Squash Club',
  description: 'The 2026–27 squash ladder draw: 32 players, live results, full schedule.',
}

const LEGEND: [string, string][] = [
  ['R32', 'Round of 32'],
  ['R16', 'Round of 16'],
  ['QF', 'Quarterfinal'],
  ['SF', 'Semifinal'],
  ['5–8 SF', 'Playoff semifinal for ranks 5–8'],
  ['9–16 Qualifier', 'Separates 9–12 from 13–16'],
  ['17–20 Q1…Q8', 'Qualification tree among the 16 R32 losers; losing anywhere before the semifinals sends the player to the unordered 21–32 pool'],
  ['Printed', 'Time and court exactly as the draw sheets show them'],
  ['Adjusted', 'Printed match whose court was blank or whose slot clashed; moved as little as possible'],
  ['Planned', 'Time and court generated here; the sheets stop after the 17–20 qualifiers'],
  ['Gold-outlined matches', 'Directly decide final ranking positions'],
  ['Dashed red box', 'Result kept but its players are unknown again, or they changed; re-check it'],
  ['Dotted red-striped box', 'Provisional: sits downstream of a match that needs re-checking'],
]

export default function BracketPage() {
  return (
    <div className="pt-[68px] bg-[#05080f]">
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_30%,rgba(245,168,0,0.06),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="font-condensed text-[11px] tracking-[0.25em] uppercase text-[#f5a800] flex items-center gap-2.5 mb-6 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800]">
            FLAME Squash Club · Ladder 2026–27
          </p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="text-white">LADDER</span>{' '}
            <span className="gold-text">BRACKET</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-2xl leading-relaxed font-light">
            32 players, no bye. Two courts, Saturday 2:00–9:35 PM and Sunday 6:15–9:00 PM. Rounds 1–2
            and the 17–20 qualifiers use the printed 20-minute slots; the generated tail runs at 15
            minutes, matching the club&apos;s usual cadence.
          </p>
          <p className="font-barlow text-white/30 text-sm mt-4">
            Looking for the season rankings?{' '}
            <Link href="/ladder" className="text-[#f5a800]/70 hover:text-[#f5a800] underline underline-offset-4">
              The ladder table is here
            </Link>.
          </p>
        </div>
      </section>

      <div className="ladder max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <h2 className="font-bebas text-4xl md:text-5xl tracking-wider uppercase mb-3">Legend</h2>
        <div className="lc-legend">
          {LEGEND.map(([term, meaning]) => (
            <div key={term}><b>{term}</b> — {meaning}</div>
          ))}
        </div>

        <h2 className="font-bebas text-4xl md:text-5xl tracking-wider uppercase mt-14 mb-2">Bracket</h2>
        <p className="font-barlow text-white/40 text-sm max-w-[78ch] leading-relaxed mb-2">
          Results are read-only here and update live as they are recorded.
        </p>

        <BracketBoard admin={false} />
      </div>
    </div>
  )
}
