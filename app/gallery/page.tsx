import gallery from '@/data/gallery.json'
import GalleryMosaic from './GalleryMosaic'

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
            Moments from the court — tournaments, auctions, carnivals, and everything in between. Tap any frame to open it full-screen.
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

        <GalleryMosaic photos={gallery} />
      </section>

      <div className="pb-8" />
    </div>
  )
}
