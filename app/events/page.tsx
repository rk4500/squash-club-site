import events from '@/data/events.json'
import { ArrowRight, Calendar } from 'lucide-react'

const categoryStyle: Record<string, string> = {
  'Intra-College':  'border-blue-500/20 text-blue-400/80 bg-blue-500/5',
  'Inter-College':  'border-[#f5a800]/20 text-[#f5a800]/80 bg-[#f5a800]/5',
  'Collaboration':  'border-purple-500/20 text-purple-400/80 bg-purple-500/5',
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const cats = ['Intra-College', 'Inter-College', 'Collaboration'] as const

export default function EventsPage() {
  return (
    <div className="pt-[68px] bg-[#05080f]">

      {/* ── PAGE HERO ── */}
      <section className="relative py-28 overflow-hidden scanlines">
        <div className="absolute inset-0 hero-lines opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(245,168,0,0.05),transparent)]" />
        <div className="absolute right-6 lg:right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#f5a800]/10 to-transparent" />

        {/* BG word */}
        <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden leading-none">
          <span className="font-bebas text-[18vw] text-outline opacity-10" style={{WebkitTextStroke:'1px rgba(245,168,0,0.15)'}}>EVENTS</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-8">Academic Year 2025–26</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl lg:text-9xl tracking-wider leading-none mb-6">
            <span className="text-white">EVENTS &</span><br />
            <span className="gold-text">TOURNAMENTS</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light mb-10">
            A full year of competition, collaboration, and community — from intra-college rivalries to national representation.
          </p>
          {/* Counts */}
          <div className="flex items-center gap-8">
            {[['20', 'Total Events'], ['3', 'Inter-College'], ['7', 'Collaborations'], ['5', 'Intra-College']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-bebas text-3xl text-[#f5a800]">{n}</div>
                <div className="font-condensed text-[10px] tracking-[0.2em] text-white/30 uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS BY CATEGORY ── */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-10">
        {cats.map((cat) => {
          const list = events.filter(e => e.category === cat)
          if (!list.length) return null
          return (
            <div key={cat} className="mb-20">
              {/* Category header */}
              <div className="flex items-center gap-5 mb-8">
                <h2 className="font-bebas text-2xl tracking-[0.2em] text-white/50">{cat.toUpperCase()}</h2>
                <div className="flex-1 h-px bg-white/5" />
                <span className="font-condensed text-xs tracking-wider text-white/20">{list.length} events</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {list.map((ev) => (
                  <div key={ev.id} className="card bar-left p-7 group cursor-default">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <span className={`font-condensed text-xs tracking-[0.15em] uppercase px-2.5 py-1 border ${categoryStyle[ev.category]}`}>
                        {ev.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-white/20">
                        <Calendar size={11} />
                        <span className="font-condensed text-xs tracking-wider">{fmt(ev.date)}</span>
                      </div>
                    </div>

                    <h3 className="font-bebas text-xl md:text-2xl tracking-wider text-white mb-3 group-hover:text-[#f5a800] transition-colors duration-300 leading-tight">
                      {ev.name}
                    </h3>

                    <p className="font-barlow text-white/35 text-sm leading-relaxed mb-5 font-light">
                      {ev.description}
                    </p>

                    {ev.highlight && (
                      <div className="flex items-center gap-2 border-t border-white/5 pt-4">
                        <span className="w-1 h-1 rounded-full bg-[#f5a800] flex-shrink-0" />
                        <span className="font-condensed text-xs tracking-wider text-[#f5a800]/70">{ev.highlight}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
