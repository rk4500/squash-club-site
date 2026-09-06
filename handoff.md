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

## Grain overlay

`.grain` on `<body>` (`app/globals.css`) is an `feTurbulence` noise SVG painted
`position: fixed` at `z-index: 9999` over the whole site. It is **static on
purpose**. It used to drift on an 8s `steps(2)` loop across a 400% x 400% layer;
the motion was the only thing that made it perceptible — at `0.35 x 0.04` the
noise is about 1.4% and reads as texture, but moving it read as the screen
crawling. Removing the animation let the layer shrink to the viewport, which is
also 16x fewer filtered pixels on a layer that composites above everything.

If someone asks to "bring the grain back", they mean the motion; the texture
never left. Don't re-add the keyframes.

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

Signed-in users get a segmented control above the board: **Record results** or
**Edit draw**. A name slot is already the button that records a winner, so a
click cannot also mean "edit this name" — the mode decides, and nothing per-box
is added to the board at rest. Result controls (export / import / reset / paste)
hide while editing, since they act on results rather than on the draw.

In edit mode a box becomes its own form. Names are inputs styled identically to
the read state, so nothing shifts when you enter one; the affordance is the
hover and focus chrome. A side fed by an earlier match renders as
*Winner of R32-1* and is not focusable — changing who feeds whom is structural,
needs the graph re-validated for cycles and orphaned results, and is not in
scope here. The columns are already in the table for that work.

**A box commits when focus leaves it**, so a name and a court time go in one
write. Enter commits, Esc reverts, and the box shows *Unsaved* / *Saving* in its
header with a gold pulse on success.

Editable per box:

- **Names** — free text, non-empty.
- **Day** — click cycles unset → Saturday → Sunday → unset.
- **Time** — three segments behaving as one field. Two digits max each, focus
  advances as soon as a segment cannot take another digit (2–9 for the hour,
  6–9 for minutes), and values clamp into range as typed rather than being
  rejected after. AM/PM is a button that also answers `a`/`p` and the arrows;
  starting an hour on an unscheduled match defaults it to PM, since every slot
  in this draw is afternoon or evening.
- **Court** — click toggles Court 1 / Court 2. There is no third court, and the
  schedule table hardcodes the same two, so it is picked and never typed.

Two rules worth knowing before changing this code:

- **A slot hangs on its day and time, not its court.** `resolveSlot` returns
  null unless both are set, and the court falls back to Court 1. That is what
  lets a court toggle have no blank state while a match can still be taken off
  the schedule (clear the day or the time). The table's grouped constraint wants
  all four columns set or all four null; this is how the UI guarantees it.
- **`src` is derived, never asked for.** "Adjusted" already means a printed
  match that had to move, so moving one is exactly what earns the label; a slot
  filled in from nothing is *planned*; an unchanged slot keeps what it had. This
  removed a control and the whole class of "set all four together" errors.

Renaming a player flags every recorded match they appear in — the stored
snapshot no longer matches. That is correct behaviour, and re-picking the same
winner clears the flags without changing any result.

**Gotcha, already paid for once:** the time segments auto-advance by calling
`focus()` *during* the keystroke that changed the value, before React
re-renders. Any handler that fires on that blur must read
`e.currentTarget.value`, not the captured `draft` — the draft is one keystroke
stale, and reading it wrote the pre-keystroke hour back, which looked exactly
like the field refusing two-digit hours.

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
- `lib/ladder/useLadder.ts` — results state, optimistic with rollback: a refused
  write restores the previous board rather than showing a result that never
  saved.
- `lib/ladder/useDrawEdit.ts` — draft state for edit mode, validation, and the
  commit. Holds the time as `hh`/`mm`/`mer` rather than `"4:00 PM"`, because a
  half-typed time has no valid single-string form and round-tripping it through
  a parser fights the person typing. `composeTime` puts it back together on the
  way out. A draft deliberately outlives its own save: `router.refresh()` is
  async, so dropping it when the write returns flashes the old value back — each
  draft is retired once the draw coming down agrees with it.
- `components/ladder/` — `Bracket.tsx` (boxes, tree, standings, schedule, and
  the `TimeField` segments), `BracketBoard.tsx` (mode toggle, controls, zoom,
  import/export).
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
