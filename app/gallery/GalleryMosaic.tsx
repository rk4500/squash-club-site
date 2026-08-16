'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type Photo = { src: string; label: string; span: string }

const pad = (n: number) => String(n).padStart(2, '0')

export default function GalleryMosaic({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null)
  const open = active !== null
  const touchX = useRef<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const go = useCallback(
    (dir: number) => setActive((i) => (i === null ? i : (i + dir + photos.length) % photos.length)),
    [photos.length],
  )

  // Keyboard nav + scroll lock while the viewer is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close, go])

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const current = open ? photos[active as number] : null

  return (
    <>
      {/* ── MOSAIC ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[42vw] sm:auto-rows-[190px] lg:auto-rows-[210px] grid-flow-dense gap-3">
        {photos.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Open ${g.label}`}
            className={`group relative overflow-hidden border border-white/5 bg-[#080d17] text-left focus:outline-none focus-visible:border-[#f5a800]/60 ${g.span}`}
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
              {pad(i + 1)}
            </span>

            {/* Darken + label */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080f] via-[#05080f]/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />
            <span className="absolute bottom-0 left-0 p-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <span className="block w-6 h-px bg-[#f5a800] mb-2" />
              <span className="block font-bebas text-lg tracking-wider text-white leading-none">{g.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* ── LIGHTBOX ── */}
      {open && current && (
        <div
          className="lb-backdrop fixed inset-0 z-[60] flex flex-col bg-[#05080f]/95 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={current.label}
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4" onClick={(e) => e.stopPropagation()}>
            <span className="font-condensed text-xs tracking-[0.3em] text-[#f5a800]/60 uppercase">
              {pad(active! + 1)} <span className="text-white/20">/ {pad(photos.length)}</span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="w-11 h-11 -mr-2 flex items-center justify-center text-white/50 hover:text-[#f5a800] transition-colors"
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Image stage */}
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-20" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div key={current.src} className="lb-figure relative w-full h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <Image src={current.src} alt={current.label} fill priority sizes="100vw" className="object-contain" />
            </div>

            {/* Desktop prev / next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(-1) }}
              aria-label="Previous"
              className="hidden sm:flex absolute left-4 lg:left-6 w-12 h-12 items-center justify-center border border-white/10 bg-[#080d17]/60 text-white/60 hover:text-[#f5a800] hover:border-[#f5a800]/40 transition-colors"
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); go(1) }}
              aria-label="Next"
              className="hidden sm:flex absolute right-4 lg:right-6 w-12 h-12 items-center justify-center border border-white/10 bg-[#080d17]/60 text-white/60 hover:text-[#f5a800] hover:border-[#f5a800]/40 transition-colors"
            >
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Caption + mobile nav */}
          <div className="flex items-end justify-between gap-4 px-5 sm:px-8 py-5 sm:py-6" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0">
              <span className="block w-8 h-px bg-[#f5a800] mb-2.5" />
              <h2 className="font-bebas text-2xl sm:text-4xl tracking-wider text-white leading-none truncate">{current.label}</h2>
            </div>
            <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(-1) }}
                aria-label="Previous"
                className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/60 active:text-[#f5a800] active:border-[#f5a800]/40 transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); go(1) }}
                aria-label="Next"
                className="w-11 h-11 flex items-center justify-center border border-white/10 text-white/60 active:text-[#f5a800] active:border-[#f5a800]/40 transition-colors"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
