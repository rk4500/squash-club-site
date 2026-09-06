# Handoff — FLAME Squash Club site

Last updated: 2026-09-06

## What this doc is
Fast context for the next person editing the site. Focuses on the parts that are
**data-driven** now (year + designations) so nobody hardcodes a value that goes stale.

---

## Roster data is now derived, not hardcoded

### Academic year — auto-calculated
- **Single source of truth:** `data/admissions.json` → `admissions` map of
  `"Full Name": <admissionYear>`.
  - Value is a 4-digit year (e.g. `2024`), or the string `"graduated"`, or `null`
    (unknown → shows no year).
- The displayed year (Team, Ladder, Home) is computed by
  `academicYear(name)` in `lib/roster.ts`.
- **Rule:** the academic year increments every **August**. Admission `2024` →
  1st year Aug 2024, 2nd year Aug 2025, 3rd year Aug 2026 … No cap — 4th/5th year
  are valid. `"graduated"` renders a `Graduated` badge.
- Formula: `year = currentYear − admissionYear + (month >= August ? 1 : 0)`.
- **To bump everyone a year:** do nothing — it rolls over automatically each August.
  To fix one person, edit only `data/admissions.json`.
- Caveat: on a static build the year is fixed at **build time**. A redeploy after
  August 1 picks up the new year. Force dynamic rendering if you ever want true
  live rollover without a redeploy.

### Designations / roles — pulled from committee data
- **Source of truth:** `data/committee.json` (`executive` + `heads`).
- `lib/roster.ts` exposes:
  - `roleFor(name)` → committee role or `null`.
  - `teamRole(name)` → `"<role> & Team Player"`, else `"Team Player"` (used on Team page).
  - `previewRole(name)` → committee role, else `"Team Player"` (used on Home ladder preview).
- Consequence: change a role in `committee.json` and it updates everywhere. A player
  who holds no committee role automatically shows just "Team Player" — no stale titles.

### Name matching
Names must match **exactly** across `admissions.json`, `team.json`, `ladder.json`,
`committee.json`. A typo means the year/role lookup silently returns empty.

---

## Files & where things live
- `data/admissions.json` — admission year per player (edit this for years).
- `data/committee.json` — roles/designations (edit this for titles).
- `data/team.json` — squad members. No longer stores `role`/`year` (derived).
- `data/ladder.json` — rankings. No longer stores `year` (derived by name).
- `lib/roster.ts` — `academicYear`, `roleFor`, `teamRole`, `previewRole`.
- `app/team/page.tsx`, `app/ladder/page.tsx`, `app/page.tsx` — consume the lib.

## Photos / cutouts
- Sources: `public/images/committee/<name>.jpeg`; cutouts:
  `public/images/committee/cutouts/cc_<name>.webp`.
- Do **NOT** run `scripts/make_cutouts.sh` wholesale — it globs every photo and
  clobbers hand-tuned cutouts (Gazal, Shyamlee). Process only the file you changed.
- The standalone `rembg` binary is broken (`No module named 'pkg_resources'`).
  Run it via an ephemeral uv env instead:
  ```
  uv run --python 3.9 --with "rembg[cli]" --with onnxruntime --with setuptools \
    rembg i SRC.jpeg /tmp/cut.png
  magick /tmp/cut.png -trim -background none -gravity South -extent 800x1200 /tmp/norm.png
  magick /tmp/norm.png -quality 82 cutouts/cc_<name>.webp
  ```

## Season label
Season string is `2026–27` (en-dash). Lives in `components/Footer.tsx` (×3) and
6 page section-labels (home ×2, team, committee, events, gallery). Search
`2026–27` to find them all.

---

## Recent change (2026-08-16 session)
- New cutouts for Shyamlee + Kanav.
- Year + designations made data-driven (this doc's top half).
- Riya's bio no longer names a "Social Media Head" title (she holds no committee role).
- Home ladder preview now pulls top-3 + roles from data (fixed swapped
  President/VP labels and the "Thakkar" typo).
- Season bumped 2025–26 → 2026–27 site-wide.
- Open item: `Bhagya Patel` / `Samya Arora` admission years — confirm in
  `admissions.json` (were the two not supplied initially).

---

## Ladder bracket (`/ladder/bracket`) — Supabase-backed

The tournament draw, ported from the standalone `ladder-v2.html`. Separate from
`/ladder`, which is the season rankings table out of `data/ladder.json` and is
unrelated.

### Where the data lives

Two tables in the Supabase project `Website` (`fwaomkrkvlgjjmfnghxt`):

- `ladder_results` — one row per decided match: `winner` (`a`/`b`) plus
  `snap_a`/`snap_b`, the two player names **at the moment the result was
  recorded**.
- `ladder_matches` — the draw itself: who plays whom, and when.

Both are keyed `(draw, match_id)` so next season can coexist without match IDs
colliding, both are public-read and authenticated-write, and both stream over
realtime so a recorded result reaches every open page without a refresh.

### Authorization

**Row level security is the boundary — not the interface.** The publishable key
ships in the browser bundle and grants nothing; Postgres decides who may write.
Hiding admin controls is only a matter of not showing people buttons that would
fail. Verified against the live project: anonymous read 200, anonymous write
`42501`, public signup `signup_disabled`.

Sign-in is at **`/login`** — unlisted and `noindex`, with no link to it anywhere
on the site. That is convenience, not protection; anyone may find it. Once
signed in, the nav's *Join* becomes *Log out*.

Two settings must stay as they are:

- `[auth] enable_signup = false` — self-registration would land a stranger in
  the `authenticated` role, which the write policy accepts.
- `[auth.email] enable_signup = **true**` — despite the name, the CLI maps this
  onto the email provider itself. Setting it false disables password login
  entirely (`email_provider_disabled`). It is not a second signup switch.

Auth settings live in `supabase/config.toml` and are applied with
`supabase config push`, **not** `db push`. `config push` sends the whole auth
block, so check the diff it prints — it will happily overwrite `site_url` with
the scaffold's localhost value.

### Editing the draw from the site

Signed-in users get an **Edit players and times** panel on the bracket page
(`components/ladder/DrawEditor.tsx`). Editable: player names, and day / time /
court / source per match. Not editable: who feeds whom. Changing the structure
needs validation that the graph stays acyclic and that no recorded result is
orphaned, which is a bigger job; the columns are already in the table for it.

Renaming a player flags every recorded match they appear in — the stored
snapshot no longer matches. That is correct behaviour, and re-picking the same
winner clears the flags without changing any result.

`data/ladder/seed.ts` is **seed only**; the running site does not read it. It is
the source the seeding migration was generated from, kept in git so a mangled
table can be rebuilt from something reviewable. Editing it changes nothing.

### Code layout

- `data/ladder/draw.ts` — types, `BRACKETS` (column layout), `RANK_PAIRS`,
  `SRC_LABEL`. Structural, does not change during a season.
- `data/ladder/seed.ts` — the seed copy of the draw. See above.
- `lib/ladder/engine.ts` — all bracket logic. **Pure**: takes the draw and the
  results as arguments, imports neither. Keep it that way; it is what makes the
  differential tests possible.
- `lib/ladder/store.ts` / `supabaseStore.ts` — results, row per match, so two
  people can record different matches without clobbering each other.
- `lib/ladder/drawStore.ts` — loads and saves the draw.
- `lib/ladder/useLadder.ts` — state, optimistic with rollback: a refused write
  restores the previous board rather than showing a result that never saved.
- `components/ladder/` — `Bracket.tsx` (boxes, tree, standings, schedule),
  `BracketBoard.tsx` (controls, zoom, import/export), `DrawEditor.tsx`.
- `app/ladder/bracket/ladder.css` — plain CSS on purpose. The connectors depend
  on every cell being `flex: 1 1 0` so a pair's midpoint lands on the next
  round's cell centre. Tailwind does not express this well; changing the flex
  basis takes the tree apart.

### Result states

`matchState` returns `open` / `done` / `orphan` / `conflict`, and `computeTaint`
walks W/L edges to a fixpoint marking everything downstream of a broken match as
provisional. Clearing one match never deletes later results — it restyles them.
This is the single most load-bearing idea in the page; read the function before
changing it.

### Testing

No test runner in the repo. The engine was verified differentially against the
original `ladder-v2.html` implementation — 10,304 comparisons over 4,000 random
pick/clear sequences, plus a full playthrough and an export round-trip. Those
scripts lived in a session scratchpad. If the engine changes materially, it is
worth rebuilding that harness: extract the old `<script>`, stub `localStorage`,
and mirror every mutation into both implementations.

### Middleware

`middleware.ts` refreshes the auth session and runs **only** on
`/ladder/bracket/*`, `/login`, `/auth/*` — the routes whose *server* code reads
the session. The nav looks session-aware everywhere but is a client component
and refreshes its own tokens. Add a route that calls `getUser()` server-side and
you must add it to the matcher, or it will read a stale cookie and report the
visitor as signed out. Widening back to a catch-all is always safe.

---

## Gallery (branch `gallery-redesign`)
- Current gallery = dense spanning **mosaic** (`app/gallery/page.tsx`, data in
  `data/gallery.json` — `label` + `span` per photo). Photos are webp under
  `public/images/gallery/`; original loosely-named jpegs left untracked.
- Old album-based gallery preserved at `backups/gallery-page.legacy.tsx`.

### PINNED — deferred layout redesign (revisit with more photos)
The mosaic reads a bit flat vs. the rest of the site. Three concepts explored
via `/impeccable bolder`, parked for later. All keep the FSC dark/gold/Bebas
world + hover labels bottom-left:
1. **Editorial contact-sheet** — asymmetric staggered columns (like the ladder
   podium offsets) + huge outlined index numerals behind frames. Static, fast,
   most on-brand.
2. **Horizontal film reels** — auto-scrolling sideways rows reusing the marquee
   motif, sprocket-hole edges, pause+caption on hover. Kinetic; less scannable.
3. **Spotlight dossier** — one big feature frame + numbered index list; hovering
   a row swaps the hero with a Bebas caption. Interactive "archive terminal".
