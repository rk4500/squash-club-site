import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  /*
   * Only the routes whose *server* code reads the session.
   *
   * The nav looks session-aware on every page, but it is a client component
   * and supabase-js refreshes its own tokens in the browser without help from
   * here. What needs the refresh is server-side getUser(), which happens on
   * the bracket, on /login, and in the sign-out handler.
   *
   * If you add another route that calls getUser() in a server component, add
   * it here too — otherwise it will read a stale cookie and report the visitor
   * as signed out. Widening this back to a catch-all is always safe; it just
   * runs the middleware on requests that have no use for it.
   */
  matcher: ['/ladder/bracket/:path*', '/login', '/auth/:path*'],
}
