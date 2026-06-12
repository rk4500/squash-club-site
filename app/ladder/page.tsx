import ladderData from '@/data/ladder.json'
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react'

function Trend({ t }: { t: string }) {
  if (t === 'up')   return <TrendingUp size={12} className="text-emerald-400" />
  if (t === 'down') return <TrendingDown size={12} className="text-red-400" />
  return <Minus size={12} className="text-white/20" />
}

export default function LadderPage() {
  const { rankings, lastUpdated, edition } = ladderData
  const top3 = rankings.slice(0, 3)
  const rest = rankings.slice(3)

  return (
    <div className="pt-[68px] bg-[#05080f]">

      {/* ── PAGE HERO ── */}
      <section className="relative py-28 overflow-hidden scanlines">
        <div className="absolute inset-0 hero-lines opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_30%,rgba(245,168,0,0.06),transparent)]" />
        <div className="absolute right-0 bottom-[-2vw] pointer-events-none select-none overflow-hidden leading-none">
          <span className="font-bebas text-[18vw] opacity-[0.07]" style={{WebkitTextStroke:'1px rgba(245,168,0,0.3)', color:'transparent'}}>RANK</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-8">Official FLAME University Rankings</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="text-white">SQUASH</span><br />
            <span className="gold-text">LADDER</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light mb-8">
            Top 20 active players ranked across three editions per semester. Challenge the player above you. Climb the board.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-condensed text-xs tracking-[0.2em] uppercase border border-[#f5a800]/20 px-3 py-1.5 text-[#f5a800]/70 bg-[#f5a800]/5">
              {edition}
            </span>
            <span className="font-condensed text-xs tracking-wider text-white/20">Updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* ── TOP 3 PODIUM ── */}
      <section className="py-12 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-2">
          {/* 2nd */}
          <div className="border border-white/8 bg-white/2 p-6 text-center flex flex-col items-center justify-end mt-8">
            <div className="font-bebas text-5xl text-white/20 mb-4">2</div>
            <div className="w-14 h-14 border border-white/10 bg-white/3 flex items-center justify-center font-bebas text-white/50 text-xl mb-3">
              {top3[1].name.split(' ').slice(0,2).map(n => n[0]).join('')}
            </div>
            <div className="font-bebas text-sm tracking-wider text-white/60 leading-tight text-center">{top3[1].name}</div>
            <div className="font-condensed text-[9px] tracking-wider text-white/20 mt-1">{top3[1].year}</div>
          </div>

          {/* 1st — tallest */}
          <div className="border border-[#f5a800]/30 bg-[#f5a800]/6 p-6 text-center flex flex-col items-center justify-end relative">
            <Trophy size={14} className="text-[#f5a800] absolute top-4 left-1/2 -translate-x-1/2" />
            <div className="font-bebas text-6xl text-[#f5a800] mb-4 gold-glow-text">1</div>
            <div className="w-16 h-16 border border-[#f5a800]/30 bg-[#f5a800]/10 flex items-center justify-center font-bebas text-[#f5a800] text-2xl mb-3">
              {top3[0].name.split(' ').slice(0,2).map(n => n[0]).join('')}
            </div>
            <div className="font-bebas text-base tracking-wider text-white leading-tight text-center">{top3[0].name}</div>
            <div className="font-condensed text-[9px] tracking-wider text-[#f5a800]/50 mt-1">{top3[0].year}</div>
          </div>

          {/* 3rd */}
          <div className="border border-white/8 bg-white/2 p-6 text-center flex flex-col items-center justify-end mt-14">
            <div className="font-bebas text-4xl text-white/10 mb-4">3</div>
            <div className="w-12 h-12 border border-white/8 bg-white/2 flex items-center justify-center font-bebas text-white/30 text-lg mb-3">
              {top3[2].name.split(' ').slice(0,2).map(n => n[0]).join('')}
            </div>
            <div className="font-bebas text-xs tracking-wider text-white/40 leading-tight text-center">{top3[2].name}</div>
            <div className="font-condensed text-[9px] tracking-wider text-white/15 mt-1">{top3[2].year}</div>
          </div>
        </div>
      </section>

      {/* ── FULL TABLE ── */}
      <section className="pb-24 max-w-4xl mx-auto px-6 lg:px-10">
        <div className="border border-white/5 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[3rem_1fr_5rem_2rem] gap-4 px-6 py-3 bg-[#080d17] border-b border-white/5">
            <span className="font-condensed text-[9px] tracking-[0.25em] text-white/20 uppercase">#</span>
            <span className="font-condensed text-[9px] tracking-[0.25em] text-white/20 uppercase">Player</span>
            <span className="font-condensed text-[9px] tracking-[0.25em] text-white/20 uppercase text-center">Record</span>
            <span className="font-condensed text-[9px] tracking-[0.25em] text-white/20 uppercase text-center">↑</span>
          </div>

          {rankings.map((p, i) => {
            const record = (p.wins === 0 && p.losses === 0) ? '—' : `${p.wins}–${p.losses}`
            return (
              <div
                key={p.rank}
                className={`grid grid-cols-[3rem_1fr_5rem_2rem] gap-4 px-6 py-4 items-center border-b border-white/3 hover:bg-white/2 transition-colors group
                  ${i === 0 ? 'bg-[#f5a800]/4 border-b border-[#f5a800]/10' : ''}`}
              >
                <span className={`font-bebas text-xl leading-none ${
                  i === 0 ? 'text-[#f5a800]' : i === 1 ? 'text-white/30' : i === 2 ? 'text-white/15' : 'text-white/10'
                }`}>{p.rank}</span>
                <div>
                  <div className="font-bebas tracking-wider text-white group-hover:text-[#f5a800] transition-colors text-base leading-none">{p.name}</div>
                  <div className="font-condensed text-[9px] tracking-wider text-white/20 mt-1">{p.year}</div>
                </div>
                <span className={`font-condensed text-sm text-center ${record === '—' ? 'text-white/15' : 'text-white/50'}`}>{record}</span>
                <div className="flex justify-center"><Trend t={p.trend} /></div>
              </div>
            )
          })}
        </div>

        {/* Rules */}
        <div className="mt-6 border border-white/5 p-5 bg-[#080d17]">
          <p className="font-condensed text-[10px] tracking-[0.15em] text-[#f5a800]/60 uppercase mb-2">How it works</p>
          <p className="font-barlow text-white/30 text-xs leading-relaxed">
            Players ranked 1–20 can be challenged by anyone ranked immediately below them. Qualification rounds are best-of-3 (PAR 11). Main draw is best-of-5. Players outside the ladder may challenge ranks 19–20 to enter. Rankings update after each edition.
          </p>
        </div>
      </section>
    </div>
  )
}
