import Link from 'next/link'
import Image from 'next/image'
import { Trophy, ArrowRight } from 'lucide-react'

const stats = [
  { value: '20+', label: 'Events', sub: 'This season' },
  { value: '70+', label: 'Athletes', sub: 'Competed' },
  { value: '688K', label: 'Reach', sub: 'Instagram views' },
  { value: '92%', label: 'Growth', sub: 'Follower increase' },
]

const ladder = [
  { rank: 1, name: 'Priyaan Thakkar', detail: 'NMIMS Winner · Ladder #1' },
  { rank: 2, name: 'Maanvir Kamani', detail: 'Vice President · AIU Rep' },
  { rank: 3, name: 'Dhwani Balchandani', detail: 'President · AIU Rep' },
]

const highlights = [
  { tag: 'Inter-College', title: 'NMIMS Fury Tournament', result: 'Priyaan Thakkar — Category Winner', date: 'Mar 2026' },
  { tag: 'National', title: 'AIU Squash Tournament', result: 'Both teams — Pre-Quarterfinals', date: 'Mar 2026' },
  { tag: 'Marquee Event', title: 'FSC Championship', result: '70+ athletes · Maharashtra-wide', date: 'Dec 2025' },
  { tag: 'Multi-Sport', title: 'FLAME Racketlon 2026', result: 'Neon Knights — Champions', date: 'Mar 2026' },
]

export default function Home() {
  return (
    <div>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-end pb-20 overflow-hidden scanlines">

        {/* Deep background */}
        <div className="absolute inset-0 bg-[#05080f]" />

        {/* Grid */}
        <div className="absolute inset-0 hero-lines opacity-60" />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(245,168,0,0.06)_0%,transparent_70%)]" />

        {/* Left edge gold line */}
        <div className="absolute left-6 lg:left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#f5a800]/20 to-transparent" />

        {/* Right edge gold line */}
        <div className="absolute right-6 lg:right-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#f5a800]/10 to-transparent" />

        {/* Giant background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-bebas text-[22vw] leading-none text-outline opacity-30 tracking-tight">
            FSC
          </span>
        </div>

        {/* Logo + content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-end">

            {/* Left — Main headline */}
            <div>
              {/* Location badge */}
              <div className="section-label mb-8 slide-up">
                FLAME University · Pune · Est. 2024
              </div>

              {/* Logo inline */}
              <div className="w-28 h-32 relative mb-6 slide-up delay-1">
                <Image src="/logo.png" alt="FSC" fill className="object-contain drop-shadow-2xl" priority />
              </div>

              {/* Giant type */}
              <h1 className="font-bebas leading-[0.88] tracking-wider mb-8 slide-up delay-2">
                <span className="block text-[13vw] md:text-[11vw] lg:text-[8.5vw] text-white gold-glow-text">FLAME</span>
                <span className="block text-[13vw] md:text-[11vw] lg:text-[8.5vw] gold-text" style={{WebkitTextStroke: '0px'}}>SQUASH</span>
                <span className="block text-[13vw] md:text-[11vw] lg:text-[8.5vw] text-white/20 text-outline" style={{WebkitTextStroke: '1px rgba(255,255,255,0.2)'}}>CLUB</span>
              </h1>

              {/* Tagline */}
              <p className="font-condensed text-lg md:text-xl tracking-[0.35em] text-[#f5a800] uppercase mb-10 slide-up delay-3">
                Dominate the Court.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-5 slide-up delay-4">
                <Link
                  href="/events"
                  className="group flex items-center gap-3 bg-[#f5a800] text-[#05080f] font-condensed tracking-[0.15em] text-sm uppercase px-7 py-3.5 hover:bg-[#ffbe33] transition-colors duration-200"
                >
                  View Events
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/ladder"
                  className="font-condensed tracking-[0.15em] text-sm uppercase text-white/50 hover:text-[#f5a800] transition-colors link-underline"
                >
                  See Rankings
                </Link>
              </div>
            </div>

            {/* Right — Stats panel */}
            <div className="hidden lg:flex flex-col items-end gap-1 pb-2">
              <div className="w-full max-w-xs">
                <p className="section-label justify-end mb-6">Season 2025–26</p>
                <div className="grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="border border-white/8 bg-white/3 backdrop-blur-sm p-5">
                      <div className="font-bebas text-4xl text-[#f5a800] leading-none mb-1">{s.value}</div>
                      <div className="font-condensed text-xs tracking-wider text-white uppercase">{s.label}</div>
                      <div className="font-barlow text-[10px] text-white/30 mt-0.5">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-12 bg-gradient-to-b from-[#f5a800] to-transparent" />
          <span className="font-condensed text-[9px] tracking-[0.3em] text-white uppercase">Scroll</span>
        </div>
      </section>

      {/* ═══════════════════════ MARQUEE ═══════════════════════ */}
      <div className="border-y border-white/5 bg-[#f5a800]/4 overflow-hidden py-4">
        <div className="marquee-inner">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="font-bebas text-sm tracking-[0.5em] text-[#f5a800]/50 mx-10 whitespace-nowrap">
              FSC &nbsp;·&nbsp; FLAME SQUASH &nbsp;·&nbsp; DOMINATE &nbsp;·&nbsp; PUNE &nbsp;·&nbsp; 2025–26 &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════ ABOUT ═══════════════════════ */}
      <section className="py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#05080f]" />

        {/* Giant number BG */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="font-bebas text-[18vw] text-outline leading-none opacity-10" style={{WebkitTextStroke: '1px rgba(245,168,0,0.2)'}}>01</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="section-label mb-8">About the Club</p>
            <h2 className="font-bebas text-[11vw] md:text-7xl lg:text-8xl tracking-wider leading-none text-white mb-8">
              MORE THAN<br />
              <span className="gold-text">A SPORT.</span>
            </h2>
            <p className="font-barlow text-white/50 text-lg leading-relaxed mb-6 max-w-2xl font-light">
              The FLAME Squash Club brings together students who share a passion for squash — from dedicated competitors to those just discovering the game. We create space to explore, compete, and grow.
            </p>
            <p className="font-barlow text-white/30 text-sm leading-relaxed mb-10 max-w-xl font-light">
              Through structured practice, competitive ladder tournaments, inter-college championships, and community initiatives, we ensure every player finds their place on court. Squash here is a shared experience built on passion, discipline, and relentless drive.
            </p>
            <Link href="/committee" className="group inline-flex items-center gap-3 font-condensed text-sm tracking-[0.2em] uppercase text-[#f5a800] hover:gap-5 transition-all duration-300">
              Meet the committee <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ SEASON HIGHLIGHTS ═══════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#080d17]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="section-label mb-4">2025 – 2026</p>
              <h2 className="font-bebas text-5xl md:text-6xl tracking-wider text-white leading-none">
                SEASON<br /><span className="gold-text">HIGHLIGHTS</span>
              </h2>
            </div>
            <Link href="/events" className="hidden md:flex items-center gap-2 font-condensed text-xs tracking-[0.2em] uppercase text-white/30 hover:text-[#f5a800] transition-colors link-underline">
              All 20 Events <ArrowRight size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highlights.map((h, i) => (
              <div key={h.title} className="card bar-left p-7 group cursor-default">
                <div className="flex items-start justify-between mb-5">
                  <span className="font-condensed text-xs tracking-[0.2em] uppercase px-2.5 py-1 border border-[#f5a800]/20 text-[#f5a800]/70 bg-[#f5a800]/5">
                    {h.tag}
                  </span>
                  <span className="font-condensed text-xs tracking-wider text-white/20">{h.date}</span>
                </div>
                <h3 className="font-bebas text-2xl tracking-wider text-white mb-2 group-hover:text-[#f5a800] transition-colors duration-300">
                  {h.title}
                </h3>
                <p className="font-barlow text-white/40 text-sm leading-relaxed">{h.result}</p>
                <div className="mt-5 w-8 h-px bg-[#f5a800]/30 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ LADDER TEASER ═══════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#05080f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_0%_50%,rgba(245,168,0,0.04),transparent)]" />

        {/* Giant BG */}
        <div className="absolute right-[-5vw] top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="font-bebas text-[20vw] leading-none" style={{WebkitTextStroke:'1px rgba(245,168,0,0.06)', color:'transparent'}}>TOP 20</span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-label mb-6">Official FLAME Rankings</p>
              <h2 className="font-bebas text-6xl md:text-7xl tracking-wider text-white leading-none mb-6">
                SQUASH<br /><span className="gold-text">LADDER</span>
              </h2>
              <p className="font-barlow text-white/40 text-sm leading-relaxed mb-8 font-light">
                Three editions per semester. Top 20 players ranked. Challenge those above you to climb. The most competitive squash format on campus — built and run entirely by FSC.
              </p>
              <Link
                href="/ladder"
                className="group inline-flex items-center gap-3 bg-[#f5a800] text-[#05080f] font-condensed tracking-[0.15em] text-sm uppercase px-7 py-3.5 hover:bg-[#ffbe33] transition-colors"
              >
                Full Rankings <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Podium */}
            <div className="flex flex-col gap-2">
              {ladder.map((p, i) => (
                <div
                  key={p.rank}
                  className={`flex items-center gap-5 px-6 py-5 border transition-all duration-300 hover:border-[#f5a800]/30 cursor-default
                    ${i === 0
                      ? 'border-[#f5a800]/30 bg-[#f5a800]/5'
                      : 'border-white/5 bg-white/2'
                    }`}
                >
                  <span className={`font-bebas text-5xl leading-none w-12 text-right flex-shrink-0
                    ${i === 0 ? 'text-[#f5a800]' : i === 1 ? 'text-white/30' : 'text-white/15'}`}>
                    {p.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bebas text-xl tracking-wider text-white truncate">{p.name}</div>
                    <div className="font-condensed text-xs tracking-wider text-white/25 mt-0.5">{p.detail}</div>
                  </div>
                  {i === 0 && <Trophy size={16} className="text-[#f5a800] flex-shrink-0" />}
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/ladder" className="font-condensed text-xs tracking-[0.2em] uppercase text-white/20 hover:text-[#f5a800] transition-colors">
                  + 17 more players →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ MOBILE STATS ═══════════════════════ */}
      <div className="lg:hidden grid grid-cols-2 gap-px bg-white/5 border-y border-white/5">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#05080f] p-7">
            <div className="font-bebas text-4xl text-[#f5a800]">{s.value}</div>
            <div className="font-condensed text-xs tracking-wider text-white/50 uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════ CTA ═══════════════════════ */}
      <section className="relative overflow-hidden py-32 md:py-40">
        <div className="absolute inset-0 bg-[#080d17]" />
        <div className="absolute inset-0 hero-lines opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(245,168,0,0.07),transparent)]" />

        {/* Left vertical text */}
        <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 rotate-[-90deg] origin-left pointer-events-none">
          <span className="font-condensed text-[10px] tracking-[0.5em] uppercase text-white/10 whitespace-nowrap">FSC · Flame Squash Club · Pune</span>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <p className="section-label justify-center mb-6">Ready to play?</p>
          <h2 className="font-bebas text-[13vw] md:text-9xl tracking-wider leading-none mb-6">
            <span className="text-white">JOIN</span><br />
            <span className="gold-text">THE CLUB</span>
          </h2>
          <p className="font-barlow text-white/35 text-base leading-relaxed mb-12 font-light">
            Competitive player or complete beginner — there's a court waiting for you.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 bg-[#f5a800] text-[#05080f] font-condensed tracking-[0.2em] text-sm uppercase px-10 py-4 hover:bg-[#ffbe33] transition-colors duration-200"
          >
            Get In Touch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

    </div>
  )
}
