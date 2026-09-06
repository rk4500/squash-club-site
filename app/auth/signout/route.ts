import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST-only: a GET would let any page or prefetch sign the user out by
 * pointing an image or a link at this URL.
 */
export async function POST(request: Request) {
  const supabase = createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', request.url), { status: 303 })
}
