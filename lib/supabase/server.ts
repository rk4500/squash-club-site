import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

/**
 * Supabase client for server components, route handlers and server actions.
 * Reads the session from the request cookies so the server knows who is
 * asking without a round trip to the browser.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(toSet) {
          try {
            for (const { name, value, options } of toSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // Server components cannot set cookies. Harmless: the middleware
            // refreshes the session on every request, so the write it is
            // trying to make here has already happened there.
          }
        },
      },
    },
  )
}

/**
 * The signed-in user, or null.
 *
 * Uses getUser() rather than getSession(): getSession only decodes the cookie,
 * which the browser controls, while getUser verifies it against the auth
 * server. Anything that gates on identity has to use this one.
 */
export async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return null
  }
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()
  return error ? null : data.user
}
