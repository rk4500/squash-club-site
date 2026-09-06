# FLAME Squash Club Website

Next.js 14 (App Router) + Tailwind, deployed on Vercel. Content lives in `data/*.json`.
Supabase project `Website` (`fwaomkrkvlgjjmfnghxt`) backs the ladder bracket.

## Command policy

**Never run `git` or `supabase` commands unless the user asks for them in that
same turn.** This covers `git commit`, `git push`, `git checkout`,
`supabase db push`, `supabase link`, `supabase migration up`, and everything
else under those two binaries — reads included. Permission granted in an
earlier turn does not carry forward; ask again, or wait to be asked.

Writing a migration file is not running one. Write the SQL, then stop and say
it is ready to push.

## Database

Schema changes go in `supabase/migrations/` as timestamped SQL files. Never
apply schema changes through the Supabase dashboard SQL editor — the migration
file is the source of truth, and dashboard edits drift away from it silently.

Row Level Security is the authorization boundary for the ladder. Hiding a
button in the UI is presentation, not protection; every table that a browser
client can reach must have RLS enabled and explicit policies.

Public signups must stay disabled in Supabase Auth. The ladder write policy
grants access to the `authenticated` role, so an open signup form would let
anyone register and edit results.

## Secrets

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public by
design and ship in the browser bundle. The `service_role` key never belongs in
this repo, in a `NEXT_PUBLIC_` variable, or in chat — it bypasses RLS.
