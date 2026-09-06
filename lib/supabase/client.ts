import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase client for browser code.
 *
 * The URL and publishable key are public by design — they ship in the bundle
 * and identify the project, they do not grant anything. What a caller may
 * actually read or write is decided by row level security on the server, so
 * the page can talk to the database directly.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
