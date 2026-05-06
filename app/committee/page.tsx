import committee from '@/data/committee.json'

const teamColor: Record<string, string> = {
  'Logistics':        'text-sky-400   border-sky-400/20   bg-sky-400/5',
  'Ladder':           'text-[#f5a800] border-[#f5a800]/20 bg-[#f5a800]/5',
  'Data & IT':        'text-emerald-400 border-emerald-400/20 bg-emerald-400/5',
  'Social Media':     'text-pink-400  border-pink-400/20  bg-pink-400/5',
  'Documentation':    'text-violet-400 border-violet-400/20 bg-violet-400/5',
  'Events & Planning':'text-orange-400 border-orange-400/20 bg-orange-400/5',
  'Outreach':         'text-cyan-400  border-cyan-400/20  bg-cyan-400/5',
  'Public Relations': 'text-rose-400  border-rose-400/20  bg-rose-400/5',
  'Design':           'text-fuchsia-400 border-fuchsia-400/20 bg-fuchsia-400/5',
}

function Monogram({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const initials = name.split(' ').slice(0, 2).map((n: string) => n[0]).join('')
  const sz = { sm: 'w-9 h-9 text-sm', md: 'w-12 h-12 text-base', lg: 'w-16 h-16 text-xl', xl: 'w-20 h-20 text-2xl' }[size]
  return (
    <div className={`${sz} rounded-none border border-[#f5a800]/20 bg-[#f5a800]/5 flex items-center justify-center font-bebas text-[#f5a800] flex-shrink-0 tracking-wider`}>
      {initials}
    </div>
  )
}

export default function CommitteePage() {
  const membersByTeam = committee.members.reduce((acc, m) => {
    if (!acc[m.committee]) acc[m.committee] = []
    acc[m.committee].push(m)
    return acc
  }, {} as Record<string, typeof committee.members>)

  return (
    <div className="pt-[68px] bg-[#05080f]">

      {/* ── PAGE HERO ── */}
      <section className="relative py-28 overflow-hidden scanlines">
        <div className="absolute inset-0 hero-lines opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_50%,rgba(245,168,0,0.04),transparent)]" />
        <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden leading-none">
          <span className="font-bebas text-[18vw] opacity-10" style={{WebkitTextStroke:'1px rgba(245,168,0,0.15)', color:'transparent'}}>CC</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-8">Leadership 2025–26</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="text-white">THE</span><br />
            <span className="gold-text">COMMITTEE</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light">
            From executive vision to ground-level execution — the people building FLAME Squash Club.
          </p>
        </div>
      </section>

      {/* ── EXECUTIVE ── */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-5 mb-12">
          <h2 className="font-bebas text-2xl tracking-[0.2em] text-white/50">EXECUTIVE COMMITTEE</h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        {/* President — hero card */}
        <div className="border border-[#f5a800]/25 bg-[#f5a800]/4 p-8 md:p-10 mb-5 group hover:border-[#f5a800]/50 transition-all duration-300">
          <div className="flex items-center gap-7">
            <Monogram name={committee.executive[0].name} size="xl" />
            <div>
              <p className="section-label mb-2">President · FLAME Squash Club</p>
              <h3 className="font-bebas text-4xl md:text-5xl tracking-wider text-white group-hover:text-[#f5a800] transition-colors">
                {committee.executive[0].name}
              </h3>
            </div>
          </div>
        </div>

        {/* Other exec */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {committee.executive.slice(1).map((m) => (
            <div key={m.name} className="card bar-left p-6 group">
              <Monogram name={m.name} size="md" />
              <div className="mt-5">
                <p className="font-condensed text-[10px] tracking-[0.25em] text-[#f5a800]/60 uppercase mb-1">{m.role}</p>
                <h3 className="font-bebas text-lg tracking-wider text-white leading-tight group-hover:text-[#f5a800] transition-colors">{m.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CC HEADS ── */}
      <section className="py-8 pb-16 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-5 mb-12">
          <h2 className="font-bebas text-2xl tracking-[0.2em] text-white/50">CORE COMMITTEE HEADS</h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {committee.heads.map((h) => (
            <div key={h.name} className="card bar-left p-6 group">
              <div className="flex items-start justify-between mb-5">
                <Monogram name={h.name} size="md" />
                <span className={`font-condensed text-[9px] tracking-[0.15em] uppercase px-2 py-1 border ${teamColor[h.team] ?? 'text-gray-400 border-gray-400/20 bg-gray-400/5'}`}>
                  {h.team}
                </span>
              </div>
              <p className="font-condensed text-[10px] tracking-[0.2em] text-white/30 uppercase mb-1">{h.role}</p>
              <h3 className="font-bebas text-base tracking-wider text-white leading-tight group-hover:text-[#f5a800] transition-colors">{h.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ── CC MEMBERS ── */}
      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-5 mb-12">
          <h2 className="font-bebas text-2xl tracking-[0.2em] text-white/50">CORE COMMITTEE MEMBERS</h2>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(membersByTeam).map(([team, members]) => (
            <div key={team} className="card p-6">
              <span className={`inline-flex font-condensed text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 border mb-5 ${teamColor[team] ?? 'text-gray-400 border-gray-400/20 bg-gray-400/5'}`}>
                {team}
              </span>
              <div className="flex flex-col gap-3">
                {members.map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <Monogram name={m.name} size="sm" />
                    <span className="font-condensed text-sm tracking-wider text-white/60">{m.name}</span>
                    <span className="ml-auto font-condensed text-[10px] text-white/20 tracking-wider">{m.studentId}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
