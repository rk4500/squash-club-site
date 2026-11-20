'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

/*
 * The current headline event, pinned ahead of the regular links and styled
 * apart from them. Point it at the next one when this is over, or set it to
 * null to drop the slot.
 */
const featured: { label: string; href: string } | null = { label: 'FSC 2.0', href: '/fsc' }

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

  /*
   * Committee sign-in is unlisted — /login is not linked from anywhere. Once
   * someone is signed in, the Join call-to-action becomes their way out, so
   * they are never stuck with no visible sign of being logged in.
   */
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

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
              <Image src="/logo.webp" alt="FSC" fill className="object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bebas text-[17px] tracking-[0.18em] text-white group-hover:text-[#f5a800] transition-colors duration-300">FLAME SQUASH</span>
              <span className="font-condensed text-[9px] tracking-[0.4em] text-[#f5a800]/60 uppercase">Club · Pune</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {featured && (
              <Link
                href={featured.href}
                aria-current={pathname === featured.href ? 'page' : undefined}
                className={`mr-2 inline-flex items-center gap-2 font-condensed text-xs tracking-[0.2em] uppercase px-3.5 py-1.5 border transition-colors duration-200
                  ${pathname === featured.href
                    ? 'border-[#f5a800] bg-[#f5a800]/10 text-[#f5a800]'
                    : 'border-[#f5a800]/40 text-[#f5a800] hover:bg-[#f5a800] hover:text-[#05080f]'
                  }`}
              >
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-current opacity-60 animate-ping motion-reduce:hidden" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-current" />
                </span>
                {featured.label}
              </Link>
            )}
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
            {signedIn ? (
              <form action="/auth/signout" method="post" className="ml-4">
                <button
                  type="submit"
                  className="font-condensed text-xs tracking-[0.2em] uppercase px-5 py-2 border border-[#f5a800]/40 text-[#f5a800] hover:bg-[#f5a800] hover:text-[#05080f] transition-colors duration-200"
                >
                  Log out
                </button>
              </form>
            ) : (
              <Link
                href="/contact"
                className="ml-4 font-condensed text-xs tracking-[0.2em] uppercase px-5 py-2 bg-[#f5a800] text-[#05080f] hover:bg-[#ffbe33] transition-colors duration-200"
              >
                Join
              </Link>
            )}
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
          {featured && (
            <Link
              href={featured.href}
              className="mb-4 self-start inline-flex items-center gap-3 font-bebas text-5xl tracking-wider text-[#f5a800] border-b border-[#f5a800]/40 hover:border-[#f5a800] transition-colors duration-200"
            >
              <span className="w-2 h-2 rounded-full bg-[#f5a800] animate-pulse motion-reduce:animate-none" />
              {featured.label}
            </Link>
          )}
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
        {signedIn && (
          <form action="/auth/signout" method="post" className="mt-10">
            <button
              type="submit"
              className="font-bebas text-3xl tracking-wider text-[#f5a800]/70 hover:text-[#f5a800] transition-colors duration-200"
            >
              Log out
            </button>
          </form>
        )}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="font-condensed text-xs tracking-[0.3em] text-white/30 uppercase">FLAME University · Pune</p>
        </div>
      </div>
    </>
  )
}
