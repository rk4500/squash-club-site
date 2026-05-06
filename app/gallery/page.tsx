import { ImageIcon } from 'lucide-react'

const albums = [
  { title: 'FLAME Squash Championship', count: 12, tag: 'Dec 2025' },
  { title: 'AIU Tournament', count: 8, tag: 'Mar 2026' },
  { title: 'FLAME Racketlon 2026', count: 10, tag: 'Mar 2026' },
  { title: 'Ladder Tournaments', count: 6, tag: 'Sep–Mar' },
  { title: 'Team & Training', count: 8, tag: 'Season' },
  { title: 'Events & Collabs', count: 9, tag: 'Season' },
]

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
          <p className="section-label mb-8">Season 2025–26</p>
          <h1 className="font-bebas text-[12vw] md:text-8xl tracking-wider leading-none mb-5">
            <span className="gold-text">GALLERY</span>
          </h1>
          <p className="font-barlow text-white/40 text-base max-w-xl leading-relaxed font-light">
            Moments from the court — championships, training, tournaments, and everything in between.
          </p>
        </div>
      </section>

      {/* ── ALBUMS ── */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-10">

        {/* Upload instruction */}
        <div className="border border-dashed border-[#f5a800]/15 bg-[#f5a800]/3 p-8 mb-12 flex items-start gap-5">
          <ImageIcon size={20} className="text-[#f5a800]/30 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-condensed text-sm tracking-wider text-white/40 uppercase mb-1">To populate this section</p>
            <p className="font-barlow text-white/25 text-sm">
              Drop images into <code className="text-[#f5a800]/50 bg-[#f5a800]/8 px-1.5 py-0.5 text-xs rounded">public/gallery/</code> and update <code className="text-[#f5a800]/50 bg-[#f5a800]/8 px-1.5 py-0.5 text-xs rounded">data/gallery.json</code>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {albums.map((a) => (
            <div key={a.title} className="card group cursor-pointer overflow-hidden">
              {/* Placeholder image area */}
              <div className="aspect-[4/3] bg-[#080d17] relative flex items-center justify-center border-b border-white/5">
                <ImageIcon size={24} className="text-white/8" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-transparent to-transparent opacity-80" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bebas tracking-wider text-white text-base group-hover:text-[#f5a800] transition-colors leading-none">{a.title}</h3>
                  <p className="font-condensed text-[10px] tracking-wider text-white/20 mt-1 uppercase">{a.count} photos · {a.tag}</p>
                </div>
                <span className="font-condensed text-[10px] tracking-wider text-[#f5a800]/30 uppercase border border-[#f5a800]/10 px-2 py-1">
                  Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="pb-20" />
    </div>
  )
}
