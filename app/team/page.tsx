import team from '@/data/team.json'
import { Trophy } from 'lucide-react'

function Monogram({ name }: { name: string }) {
  const initials = name.split(' ').slice(0,2).map((n: string) => n[0]).join('')
  return (
    <div className="w-16 h-16 border border-[#f5a800]/20 bg-[#f5a800]/5 flex items-center justify-center font-bebas text-[#f5a800] text-2xl tracking-wider flex-shrink-0">
      {initials}
    </div>
  )
}

export default function TeamPage() {
  const men = team.filter(p => p.gender === 'male')
  const women = team.filter(p => p.gender === 'female')

  const squads = [
    { label: "Men's Team", players: men },
    { label: "Women's Team", players: women },
  ]

  return (
    <div className="pt-[68px] bg-[#05080f]">

      {/* ── PAGE HERO ── */}
      <section className="relative py-28 overflow-hidden scanlines">
        <div className="absolute inset-0 hero-lines opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_0%_50%,rgba(245,168,0,0.05),transparent)]" />
        <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden leading-none">
          <span className="font-bebas text-[18vw] opacity-[0.06]" style={{WebkitTextStroke:'1px rgba(245,168,0,0.2)', color:'transparent'}}>TEAM</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-8">FLAME University · 2025–26</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="text-white">THE</span><br />
            <span className="gold-text">SQUAD</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light mb-8">
            FLAME's competitive squash team — representing the university from on-campus tournaments to national AIU competition.
          </p>
          <div className="flex items-center gap-8">
            {[['AIU', 'National Level'], ['Pre-QF', 'AIU Result'], ['NMIMS', 'Category Winner']].map(([v,l]) => (
              <div key={l}>
                <div className="font-bebas text-2xl text-[#f5a800]">{v}</div>
                <div className="font-condensed text-[9px] tracking-[0.2em] text-white/25 uppercase">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SQUADS ── */}
      {squads.map(({ label, players }) => (
        <section key={label} className="py-12 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-5 mb-10">
            <h2 className="font-bebas text-2xl tracking-[0.2em] text-white/50">{label.toUpperCase()}</h2>
            <div className="flex-1 h-px bg-white/5" />
            <span className="font-condensed text-xs tracking-wider text-white/15">{players.length} players</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {players.map((p) => (
              <div key={p.name} className="card bar-left p-7 group">
                <div className="flex items-start gap-5">
                  <Monogram name={p.name} />
                  <div className="flex-1 min-w-0">
                    <p className="font-condensed text-[10px] tracking-[0.2em] text-[#f5a800]/60 uppercase mb-1">{p.role}</p>
                    <h3 className="font-bebas text-2xl tracking-wider text-white leading-none mb-1 group-hover:text-[#f5a800] transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="font-condensed text-xs tracking-wider text-white/20 mb-4">{p.year}</p>
                    <p className="font-barlow text-white/35 text-sm leading-relaxed font-light">{p.bio}</p>
                    {p.achievements.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {p.achievements.map((a) => (
                          <span key={a} className="inline-flex items-center gap-1.5 font-condensed text-[10px] tracking-[0.1em] uppercase border border-[#f5a800]/15 text-[#f5a800]/60 bg-[#f5a800]/4 px-2.5 py-1">
                            <Trophy size={8} />
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="pb-20" />
    </div>
  )
}
