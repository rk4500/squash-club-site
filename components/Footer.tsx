import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05080f]">
      {/* Marquee strip */}
      <div className="border-b border-white/5 overflow-hidden py-3 bg-[#f5a800]/5">
        <div className="marquee-inner">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="font-bebas text-sm tracking-[0.4em] text-[#f5a800]/40 mx-8 whitespace-nowrap">
              FLAME SQUASH CLUB &nbsp;·&nbsp; DOMINATE THE COURT &nbsp;·&nbsp; PUNE &nbsp;·&nbsp; FSC 2026–27 &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand col */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="w-12 h-14 relative">
                <Image src="/logo.webp" alt="FSC" fill className="object-contain" />
              </div>
              <span className="font-bebas text-xl tracking-[0.2em]">FLAME SQUASH CLUB</span>
            </Link>
            <p className="font-barlow text-white/35 text-sm leading-relaxed max-w-xs">
              FLAME University's premier squash community. Building champions, one rally at a time.
            </p>
            <div className="flex items-center gap-5 mt-8">
              <a href="https://instagram.com/flamesquashclub" target="_blank" rel="noopener noreferrer"
                className="font-condensed text-xs tracking-[0.2em] uppercase text-white/30 hover:text-[#f5a800] transition-colors link-underline">
                Instagram
              </a>
              <a href="mailto:squashclub@flame.edu.in"
                className="font-condensed text-xs tracking-[0.2em] uppercase text-white/30 hover:text-[#f5a800] transition-colors link-underline">
                Email
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer"
                className="font-condensed text-xs tracking-[0.2em] uppercase text-white/30 hover:text-[#f5a800] transition-colors link-underline">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Spacer */}
          <div className="md:col-span-2" />

          {/* Nav */}
          <div className="md:col-span-3">
            <p className="section-label mb-6">Navigate</p>
            <div className="flex flex-col gap-3">
              {[['Events', '/events'], ['Committee', '/committee'], ['Squash Ladder', '/ladder'], ['Team', '/team'], ['Gallery', '/gallery']].map(([l, h]) => (
                <Link key={h} href={h} className="font-condensed text-sm tracking-wider text-white/35 hover:text-white transition-colors uppercase link-underline w-fit">
                  {l}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="md:col-span-3">
            <p className="section-label mb-6">Location</p>
            <p className="font-barlow text-white/35 text-sm leading-relaxed">
              Arjuna Squash Courts<br />
              FLAME University, Lavale<br />
              Pune, Maharashtra 412115
            </p>
            <div className="mt-6 inline-flex items-center gap-2 border border-[#f5a800]/20 px-4 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f5a800] animate-pulse" />
              <span className="font-condensed text-xs tracking-[0.2em] text-[#f5a800]/70 uppercase">Season 2026–27 Active</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-condensed text-xs tracking-wider text-white/20 uppercase">© 2026–27 FLAME Squash Club</p>
          <p className="font-condensed text-xs tracking-wider text-white/20 uppercase">Made with passion · FLAME University</p>
        </div>
      </div>
    </footer>
  )
}
