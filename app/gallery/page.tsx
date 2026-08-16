import Image from 'next/image'
import gallery from '@/data/gallery.json'

export default function GalleryPage() {
  return (
    <div className="pt-[68px] bg-[#05080f]">

      {/* ── PAGE HERO ── */}
      <section className="relative py-28 overflow-hidden scanlines">
        <div className="absolute inset-0 hero-lines opacity-50" />
        <div className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden leading-none">
          <span className="font-bebas text-[18vw] opacity-[0.06]" style={{WebkitTextStroke:'1px rgba(245,168,0,0.2)', color:'transparent'}}>SHOTS</span>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="section-label mb-8">Season 2026–27</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="gold-text">GALLERY</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light">
            Moments from the court — tournaments, auctions, carnivals, and everything in between. Hover a frame to read it.
          </p>
        </div>
      </section>

      {/* ── MOSAIC ── */}
      <section className="pb-24 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-5 mb-8">
          <span className="font-condensed text-xs tracking-[0.25em] text-white/30 uppercase">{gallery.length} Frames</span>
          <div className="flex-1 h-px bg-white/5" />
          <span className="font-condensed text-xs tracking-[0.25em] text-[#f5a800]/40 uppercase">FSC · 2026–27</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[42vw] sm:auto-rows-[190px] lg:auto-rows-[210px] grid-flow-dense gap-3">
          {gallery.map((g, i) => (
            <figure
              key={g.src}
              className={`group relative overflow-hidden border border-white/5 bg-[#080d17] cursor-default ${g.span}`}
            >
              <Image
                src={g.src}
                alt={g.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-75 grayscale-[0.15] group-hover:grayscale-0 group-hover:opacity-100 scale-100 group-hover:scale-[1.05] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />

              {/* Court gridline texture */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(45deg, transparent 49%, white 49%, white 51%, transparent 51%)', backgroundSize: '14px 14px' }} />

              {/* Top gold reveal line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#f5a800] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-20" />

              {/* Corner index tick */}
              <span className="absolute top-2.5 right-3 z-20 font-condensed text-[9px] tracking-[0.2em] text-white/25 group-hover:text-[#f5a800]/70 transition-colors duration-500">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Darken + label */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
              <figcaption className="absolute bottom-0 left-0 p-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                <span className="block w-6 h-px bg-[#f5a800] mb-2" />
                <h3 className="font-bebas text-lg tracking-wider text-white leading-none">{g.label}</h3>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="pb-8" />
    </div>
  )
}
