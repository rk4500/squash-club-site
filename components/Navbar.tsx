'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Events', href: '/events' },
  { label: 'Committee', href: '/committee' },
  { label: 'Ladder', href: '/ladder' },
  { label: 'Team', href: '/team' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#05080f]/90 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative opacity-90 group-hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="FSC" fill className="object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bebas text-[17px] tracking-[0.18em] text-white group-hover:text-[#f5a800] transition-colors duration-300">FLAME SQUASH</span>
              <span className="font-condensed text-[9px] tracking-[0.4em] text-[#f5a800]/60 uppercase">Club · Pune</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-condensed text-xs tracking-[0.2em] uppercase px-4 py-2 transition-all duration-200 relative
                    ${active
                      ? 'text-[#f5a800]'
                      : 'text-white/50 hover:text-white'
                    }`}
                >
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-[#f5a800]" />
                  )}
                  {link.label}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="ml-4 font-condensed text-xs tracking-[0.2em] uppercase px-5 py-2 bg-[#f5a800] text-[#05080f] hover:bg-[#ffbe33] transition-colors duration-200"
            >
              Join
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center text-white/70 hover:text-[#f5a800] transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 z-40 bg-[#05080f]/98 backdrop-blur-xl flex flex-col justify-center px-10 transition-all duration-500 md:hidden ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-bebas text-5xl tracking-wider text-white/30 hover:text-[#f5a800] transition-colors duration-200"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="font-condensed text-xs tracking-[0.3em] text-white/30 uppercase">FLAME University · Pune</p>
        </div>
      </div>
    </>
  )
}
