import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

/**
 * Refreshes the auth session on every request and writes the rotated cookies
 * onto the response. Without this an admin gets signed out whenever their
 * access token expires mid-tournament, which is exactly when it would hurt.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // This runs on every route. If the environment is not configured, pass the
  // request through untouched rather than throwing: a missing variable should
  // cost sign-in, not take the whole site down.
  if (!url || !key) return response

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(toSet) {
          for (const { name, value } of toSet) request.cookies.set(name, value)
          response = NextResponse.next({ request })
          for (const { name, value, options } of toSet) response.cookies.set(name, value, options)
        },
      },
    },
  )

  // Touching getUser() is what triggers the refresh. Do not remove it.
  await supabase.auth.getUser()

  return response
}
