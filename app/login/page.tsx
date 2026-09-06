import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabase/server'
import LoginForm from './LoginForm'

/**
 * Unlisted by request: nothing on the site links here. That keeps the sign-in
 * out of the way of visitors, but it is not what protects the data — row level
 * security on ladder_results is. Anyone may find this page; only an account
 * that exists can sign in, and only a signed-in user can write.
 */
export const metadata: Metadata = {
  title: 'Sign in · FLAME Squash Club',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  if (await getUser()) redirect('/ladder/bracket')
  return <LoginForm />
}
