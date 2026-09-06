'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Supabase already declines to say whether it was the address or the
      // password that was wrong. Pass that through rather than guessing.
      setError(error.message)
      setBusy(false)
      return
    }

    // refresh() so server components pick up the new session cookie.
    router.replace('/ladder/bracket')
    router.refresh()
  }

  return (
    <div className="pt-[68px] min-h-screen bg-[#05080f] flex items-center justify-center px-6">
      <div className="w-full max-w-sm py-24">
        <p className="font-condensed text-[11px] tracking-[0.25em] uppercase text-[#f5a800] flex items-center gap-2.5 mb-6 before:content-[''] before:w-8 before:h-px before:bg-[#f5a800]">
          Committee access
        </p>
        <h1 className="font-bebas text-6xl tracking-wider leading-none mb-3">
          <span className="text-white">SIGN</span> <span className="gold-text">IN</span>
        </h1>
        <p className="font-barlow text-white/35 text-sm leading-relaxed mb-8">
          For recording ladder results. Accounts are created by the club — there is no sign-up.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-condensed text-[11px] tracking-[0.2em] uppercase text-white/40">Email</span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              className="bg-[#080d17] border border-white/10 px-3 py-2.5 text-white font-barlow text-sm
                         focus:outline-none focus:border-[#f5a800] transition-colors"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-condensed text-[11px] tracking-[0.2em] uppercase text-white/40">Password</span>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-[#080d17] border border-white/10 px-3 py-2.5 text-white font-barlow text-sm
                         focus:outline-none focus:border-[#f5a800] transition-colors"
            />
          </label>

          {error && (
            <p role="alert" className="font-condensed text-xs tracking-wider uppercase text-[#ff6b4a]
                                       border border-[#ff6b4a] bg-[#ff6b4a]/10 px-3 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 font-condensed text-xs tracking-[0.2em] uppercase px-5 py-3 bg-[#f5a800]
                       text-[#05080f] font-semibold hover:bg-[#ffbe33] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
