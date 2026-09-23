import timeline from '@/data/season-timeline.json'
import { Check } from 'lucide-react'

const events = timeline.flatMap((group) =>
  group.events.map((ev) => ({ ...ev, month: group.month }))
)

export default function SeasonTimeline() {
  return (
    <section className="relative py-16 max-w-7xl mx-auto px-6 lg:px-10">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
        <div>
          <p className="section-label mb-5">Season At A Glance</p>
          <h2 className="font-bebas text-5xl md:text-6xl tracking-wider leading-none">
            THE <span className="gold-text">SCHEDULE</span>
          </h2>
        </div>
        <div className="flex items-center gap-6 font-condensed text-[11px] tracking-[0.2em] uppercase text-white/30">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rotate-45 bg-gold shadow-[0_0_10px_rgba(245,168,0,0.6)]" />
            Confirmed
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rotate-45 border border-white/25" />
            Tentative
          </span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6 lg:-mx-10 lg:px-10">
        <div className="relative flex min-w-max py-10">
          {/* constant line */}
          <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />

          {events.map((ev, i) => {
            const above = i % 2 === 0
            return (
              <div key={ev.month + ev.name} className="group relative w-[104px] h-28 shrink-0 flex justify-center">
                {/* connector */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-px h-3 ${
                    above ? 'top-[calc(50%-12px)]' : 'top-1/2'
                  } ${ev.confirmed ? 'bg-[#f5a800]/30' : 'bg-white/10'}`}
                />

                {/* label */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-[120px] text-center ${
                    above ? 'bottom-[calc(50%+12px)]' : 'top-[calc(50%+12px)]'
                  }`}
                >
                  <div
                    className={`font-condensed text-[9px] tracking-[0.15em] uppercase mb-1 ${
                      ev.confirmed ? 'text-[#f5a800]/60' : 'text-white/25'
                    }`}
                  >
                    {ev.month.slice(0, 3)} {ev.dates}
                  </div>
                  <div
                    className={`font-bebas text-sm tracking-wide leading-tight ${
                      ev.confirmed ? 'text-white/80' : 'text-white/35'
                    }`}
                  >
                    {ev.name}
                  </div>
                </div>

                {/* node */}
                <span
                  className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border flex items-center justify-center ${
                    ev.confirmed
                      ? 'bg-gold border-gold shadow-[0_0_10px_rgba(245,168,0,0.55)]'
                      : 'bg-[#05080f] border-white/25 cursor-help'
                  }`}
                >
                  {ev.confirmed && <Check size={7} strokeWidth={3.5} className="-rotate-45 text-[#05080f]" />}
                </span>

                {/* tentative tooltip, opposite side from the label */}
                {!ev.confirmed && (
                  <div
                    className={`pointer-events-none absolute left-1/2 -translate-x-1/2 z-20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
                      above ? 'top-[calc(50%+12px)]' : 'bottom-[calc(50%+12px)]'
                    }`}
                  >
                    <div className="font-condensed text-[9px] tracking-[0.15em] uppercase text-white/60 bg-[#0c1220] border border-white/10 px-2 py-1">
                      Date not locked in yet
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
