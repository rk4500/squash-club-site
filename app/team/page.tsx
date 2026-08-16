import team from '@/data/team.json'
import Image from 'next/image'
import { Trophy } from 'lucide-react'
import { teamRole, academicYear } from '@/lib/roster'


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
          <p className="section-label mb-8">FLAME Squash Club · 2026–27</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((p) => {
              const hasPhoto = !!p.photo
              const achievementsText = p.achievements.join('   ·   ')
              const duration = Math.max(8, achievementsText.length * 0.25)
              
              if (process.env.NODE_ENV === 'development' && p.bio.length > 90) {
                console.warn(`[DEV WARNING] Player "${p.name}" bio is too long (${p.bio.length} chars, limit is 90) and may exceed 2 lines! Please shorten in team.json.`)
              }

              return (
                <div key={p.name} className="group relative flex flex-col bg-[#080d17] border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:border-[#f5a800]/30 overflow-hidden cursor-default">
                  {/* Top Gold Border Highlight */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f5a800] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20" />
                  
                  {/* Sliding Achievements Banner at the Top of Card */}
                  {p.achievements.length > 0 && (
                    <div className="w-full overflow-hidden bg-[#f5a800]/5 py-2 border-b border-white/5 relative z-20">
                      <div className="marquee-inner" style={{ animationDuration: `${duration}s` }}>
                        <span className="font-condensed text-[9px] tracking-[0.15em] text-[#f5a800] uppercase mx-4 flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                          {p.achievements.map((ach, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 mr-6">
                              <Trophy size={8} />
                              {ach}
                            </span>
                          ))}
                        </span>
                        <span className="font-condensed text-[9px] tracking-[0.15em] text-[#f5a800] uppercase mx-4 flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                          {p.achievements.map((ach, idx) => (
                            <span key={idx} className="flex items-center gap-1.5 mr-6">
                              <Trophy size={8} />
                              {ach}
                            </span>
                          ))}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* The Visual Showcase (Top Section) */}
                  <div className="relative w-full aspect-square bg-[#0c1220] flex items-end justify-center overflow-hidden border-b border-white/5">
                    {hasPhoto ? (
                      <>
                        {/* Court Gridlines Background */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.15]" style={{ backgroundImage: 'linear-gradient(45deg, transparent 49%, white 49%, white 51%, transparent 51%)', backgroundSize: '16px 16px' }} />
                        {/* Victory Gold Halo */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,168,0,0.15)_0%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <Image
                          src={p.photo}
                          alt={p.name}
                          fill
                          className="object-contain object-bottom opacity-90 scale-[0.88] translate-y-4 group-hover:scale-[0.96] group-hover:translate-y-1 group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 origin-bottom"
                          sizes="(max-w-768px) 100vw, 33vw"
                        />
                      </>
                    ) : (
                      <>
                        {/* Locked Athlete Fallback */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] group-hover:opacity-100 group-hover:text-[#f5a800]/10 transition-all duration-700">
                          <span className="font-bebas text-[140px] leading-none select-none">
                            {p.name.split(' ').slice(0,2).map((n) => n[0]).join('')}
                          </span>
                        </div>
                        {/* Fallback Court Gridlines */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, transparent 49%, white 49%, white 51%, transparent 51%)', backgroundSize: '16px 16px' }} />
                      </>
                    )}
                    {/* Bottom gradient fade for the image into the panel */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#080d17] to-transparent z-10 pointer-events-none" />
                  </div>

                  {/* The Details Footer (Bottom Section) */}
                  <div className="p-6 flex flex-col items-center text-center relative z-20 bg-[#080d17] flex-1">
                    <p className="font-condensed text-[10px] tracking-[0.25em] text-[#f5a800] uppercase mb-2">{teamRole(p.name)}</p>
                    <h3 className="font-bebas text-2xl tracking-wider text-white leading-none mb-1 group-hover:text-[#f5a800] transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="font-condensed text-xs tracking-wider text-white/30 mb-4">{academicYear(p.name)}</p>
                    
                    <p className="font-barlow text-white/35 text-[11px] leading-relaxed max-w-xs mt-1 font-light">
                      {p.bio}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <div className="pb-20" />
    </div>
  )
}
