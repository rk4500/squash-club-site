# Handoff — FLAME Squash Club site

Last updated: 2026-11-20

## What this doc is
Fast context for the next person editing the site. Focuses on the parts that are
**data-driven** now (year + designations) so nobody hardcodes a value that goes stale.

## Writing style
No em dashes in anything user-visible: page copy, JSON labels/descriptions,
UI strings, metadata titles/descriptions. Use a comma, colon, semicolon, or
period instead. Code comments are exempt (not shown to visitors).

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
  Holds the final 1–20 of the 2026–27 ladder (edition label `Ladder 2026–27`).
  `Bhagya Patel` and `Bhagya Popat` are two different people; don't merge them.
- `data/ladder/final-2026-27.json` — frozen 2026–27 ladder draw + results.
- `data/fsc/fsc-2026.json` — FSC 2.0 draw (generated, see FSC section).
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
- Per-member `scale` / `dropY` / `anchor` in `committee.json` reframe a cutout
  inside its card (crop legs out of a full-body shot, nudge a tight headshot
  down, etc.) — see Moksh (full body → head/shoulders, `scale: 2.6, dropY:
  240`) and Akeysha (`scale: 1.85, dropY: 150`) for the extreme end of it.
  `CCHeadCard`/`ECCard` in `app/committee/page.tsx` counter-scale the hover
  micro-shift by `member.scale` (`hoverY = 8 - 8/s` for heads, `16 - 12/s` for
  execs) so a card with `scale: 2.6` doesn't jump several times further on
  hover than one at `scale: 1` — the raw hover translate was inside the same
  scaled wrapper as the photo, so it got amplified along with it. Don't hand-
  tune the hover translate-y classes per member; adjust the formula if the
  base (`scale: 1`) hover distance ever needs to change.

## SEO
- Live URL is `flamesquashclub.vercel.app` (`flamesquash.vercel.app` redirects
  to it). `SITE_URL` in `app/layout.tsx` must match if the domain ever changes
  — it also drives `app/robots.ts` and `app/sitemap.ts`, so update all three
  together.
- `app/layout.tsx` sets `metadataBase`, the default OG/Twitter card
  (`public/og-image.jpg`, 1200×630) and a `SportsClub` JSON-LD block
  (address, Instagram, email). Titles are templated `%s | FLAME Squash Club`.
- **Link-preview cards:** every page has its own branded card in
  `public/og-*.jpg` (logo, gold eyebrow, two-tone Bebas title, detail line).
  All of them, `og-image.jpg` included, come from `scripts/og_cards.py`: edit
  the `CARDS` list at its top and run `python3 scripts/og_cards.py` (needs
  ImageMagick 7). Fonts are vendored in `scripts/og-fonts/` (SIL OFL). Don't
  hand-edit the JPGs; regenerate.
- **Every page's metadata goes through `pageMetadata()` in `lib/seo.ts`.**
  Next inherits the layout's `openGraph`, `twitter` and `alternates` whole, so
  a bare `title`/`description` left link previews showing the homepage card
  and every page declaring `/` as its canonical. Pass `image` for a
  page-specific card (FSC uses `public/og-fsc.jpg`). WhatsApp caches previews
  per URL; add `?v=2` to test a change.
- `/login` and `/auth/*` are excluded from `app/robots.ts` and left out of
  `app/sitemap.ts` — they're unlisted by design, see the Ladder bracket
  section below.
- Getting picked up over the old abandoned deploy is mostly outside the repo:
  Search Console verification + a sitemap submission, then requesting
  indexing on the key URLs, is what actually moves it. See chat history
  (2026-09-26) for the walkthrough if this needs redoing.

## Season label
Season string is `2026–27` (en-dash). Lives in `components/Footer.tsx` (×3) and
6 page section-labels (home ×2, team, committee, events, gallery). Search
`2026–27` to find them all.

---

## Recent change (2026-11-20 session)
- 2026–27 ladder finished: final rankings into `data/ladder.json`, bracket
  frozen into code, `/ladder` button now reads *Previous Tournament Bracket*.
- New `tournaments` table + lock-aware RLS; FSC 2.0 live at `/fsc`, featured
  in the nav, the home hero and as the latest event.
- Per-page link previews and canonicals (`lib/seo.ts`) and branded preview
  cards (`scripts/og_cards.py`).
- Mobile: bracket and schedule scale down instead of the old zoom buttons.
- Deprecated `[auth.email]` / `[auth.sms]` `enable_signup` keys in
  `supabase/config.toml` renamed to `enabled` (same meaning).
- Open items: Moksh Sanghvi (#2) has no ladder photo; mixed doubles slot 3
  partner; delete `data/FSC2.0.pdf` (never committed; `scripts/fsc_seed.py`
  is the reviewable transcription); FSC naming (see FSC section).

## Earlier change (2026-08-16 session)
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

## Ladder bracket (`/ladder/bracket`): FROZEN since 2026-11-20

The 2026–27 ladder finished (64/64 decided, nothing flagged). Its final draw
and results were exported from Supabase into
`data/ladder/final-2026-27.json`, and the page now reads **only that file**:
no `getUser()`, no `loadDraw`, no realtime, no admin controls. It prerenders
as a static page. `BracketBoard` takes a `frozen={{ results, snaps }}` prop for
this; it forces `admin` off and uses `frozenStore` (`lib/ladder/store.ts`),
which refuses every write. `useLadder` takes the same object as `initial` so
the first render is already complete.

Don't "tidy" the short names in that JSON (Moksh, Japmann…): the snapshots
were recorded with them, and changing a draw name without its snapshots makes
the engine flag the match as a conflict. Full names live in `data/ladder.json`,
which now holds the final 1–20 from this draw.

Everything below still describes the live editing machinery (Supabase store,
edit mode, `/login`). This page no longer uses it; `/fsc` does. `/login`
lands on `/fsc` now. Repoint it (`app/login/page.tsx` and `LoginForm.tsx`)
when the next live draw replaces FSC.

## FSC 2.0 draws (`/fsc`), live, 21–22 Nov 2026

One draw, `fsc-2026`, holding all four events (Men's Open, Women's Open,
Girls U-17, Mixed Doubles) because they share two courts and one schedule.
Same tables, same board, same edit mode as the ladder.

- **Source:** `data/FSC2.0.pdf` → `scripts/fsc_seed.py` →
  `data/fsc/fsc-2026.json` → the seed block in
  `supabase/migrations/20261120180000_tournaments.sql`. Match IDs are
  positional (`MO-R32-9`, `WO-QF2`) because the sheet reuses printed numbers
  across events; the printed number is `display`.
- **Byes:** the bye box stays for layout but has no slot, and the next round
  names the player directly, as the sheet does. Byes are left out of
  "decided of total".
- **Fallback:** if the database has no `fsc-2026` rows, `/fsc` renders the seed
  JSON read-only. The migration was pushed on 2026-11-20 and the page is live
  against the database; the fallback only matters if Supabase is unreachable.
- **Draw edits happen on the page, not in the JSON.** After the push the seed
  JSON and the migration are history: changing them changes nothing live.
  A bye winner's name appears twice (bye box and next-round box), and someone
  in two events is a separate string in each, so fix a name in the box the
  player actually plays in.
- **Sheet discrepancies, resolved in the transcription** (overrule on the
  page if wrong): "22nd Jan" read as 22 Nov (Sunday); duplicate printed
  numbers (M08, M09, M15, M34, M58, M59, M64) kept as printed; bye slots that
  had times (men's M15 12:15, mixed M27 3:30, which also clashed with M26)
  left unscheduled; "Dhrishti Pawar" normalised to Drishti Pawar; "Miss
  Asshroya Ashok Kkumor" kept as printed; lowercase names capitalised; "6:00"
  and "1:00" with no AM/PM taken as PM. Mixed doubles slot 3, "Pranav
  Bhosale", has no partner on the sheet.
- **Revised sheet (21 Nov, mid-event):** applied by
  `supabase/migrations/20261121100000_fsc_revised_draw.sql`, targeted
  per-row updates generated by diffing the regenerated seed JSON against the
  live rows (results were being recorded at the time, so no reseed). Men's:
  Priyaan's bye became a match v Nirmal Singh; Devyansh and Pranav swapped
  (R32-2 / R32-6), voiding two recorded walkovers; new qualifier `MO-Q3`
  (Sagar Patankar v Anand Rao) feeds R32-8; Riaan Garud and Lakshya Motial
  replaced Deerav and Deepak Moolani. Mixed: Deepak/Devki out (Ruhi/Shantanu
  bye), Deerav/Kiara and Drishti/Khuman swapped. The sheet double-booked
  four slots; the moved ones are `src: fixed` and commented in
  `fsc_seed.py`. Match numbers are now **chronological** (day, time, court,
  M01–M71) across all events, since the sheet reused M04/M08/M09/M15; they
  no longer match the printed sheet. A new match id in `brackets` must reach
  the database **before** the deploy: the layout comes from the JSON, and a
  box with no row crashes `/fsc` (`resolveSide` on undefined).
- **Naming:** the site calls it *FLAME Squash Championship* (matching last
  year's FSC event in `events.json`); the sheet's own title is *FLAME Squash
  Open*. Not decided; if it changes, update `app/fsc/page.tsx`, the home
  banner, `events.json` and `og_cards.py` together.
- **Tournaments table:** `tournaments(id, name, starts_on, locked)`. Both
  tables FK `draw` to it, and the write policies call
  `tournament_is_open(draw)`, so a locked draw refuses writes in Postgres.
  `ladder-v2` is seeded locked. To lock FSC when it is over, write a
  migration setting `locked = true`, then freeze it into JSON the way the
  ladder was.
- **Bracket code is draw-agnostic now:** `drawId` and `brackets` are props on
  `BracketBoard`; `createSupabaseStore`, `loadDraw`, `saveMatch` and
  `useDrawEdit` take the id. `saveMatch` selects back the row it updated, since
  an update that matches nothing (wrong id, or a locked draw filtered out by
  RLS) otherwise reports success. `BracketSpec.places` gives each event its own
  podium.
- `/fsc` is in the middleware matcher (it calls `getUser()` server-side) and
  `/login` now lands there.
- Featured slot: `featured` in `components/Navbar.tsx`, the hero banner in
  `app/page.tsx`, and `"featured": true` in `data/events.json`. Retire all
  three after the event.
- **After the event:** a migration setting `locked = true` on `fsc-2026`, then
  freeze it like the ladder (export `ladder_matches` + `ladder_results` for
  the draw into JSON, render with `frozen`), retire the featured slot, and
  swap the "Live draws" wording on the FSC card for results.
- **Supabase CLI v3 gotcha:** `supabase db push` now targets a *local* stack
  by default and fails with `ECONNREFUSED 127.0.0.1:54322`. Use
  `npx supabase db push --remote --dry-run` first, then without `--dry-run`.

### Mobile scaling (`ladder.css`, shared by `/fsc` and `/ladder/bracket`)

There is no zoom control any more. It only stretched column width, so text
and boxes stayed full size and a phone still scrolled through screens of
empty later-round space. Instead, under 1024px / 640px the CSS `zoom`s:

- the bracket trees (`.lc-scroll > *`): 0.85 / 0.66, but **not** in edit mode
  (`.ladder.is-editing`), where fields must stay 16px or iOS zooms the page
  on focus;
- the schedule tables (`.lc-tablewrap > table`): 0.9 / 0.8, always. They
  scroll on a phone regardless and are read row by row, so they get the
  roomier scale; 0.66 was tried and was too small.

`zoom` rather than `transform: scale` because it shrinks the layout box too,
so the scroll width shrinks with it.

## Ladder bracket: live editing machinery (was Supabase-backed)

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
- `[auth.email] enabled = **true**` (was `enable_signup = true` before CLI v3) — the CLI maps this
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

**Double-clicking a box is the shortcut in**, from either mode: it turns edit
mode on and puts the caret in the part that was double-clicked — a name, or the
time in the header. `openAt(mid, field)` sets a one-shot focus request that the
named box claims after its fields render and then clears, so a later re-render
cannot steal the caret back. A box with no name field of its own falls back to
whatever field it does offer.

The cost of that is a **220ms delay on recording a winner** (`DOUBLE_MS` in
`Bracket.tsx`): a single click on a slot is held long enough to see whether it
is half of a double-click, because recording a result is a write and doing one
every time somebody double-clicks their way into edit mode is worse than the
pause. A visitor has no `onEditAt`, and their clicks go in undelayed. The slots
also use `aria-disabled` rather than `disabled` — a disabled button is dropped
from the event path, and a decided box still has to hear the double-click.

**Esc leaves edit mode**, but only when the caret is not in a field: inside a
box Esc still reverts that box and blurs it, so the press that closes the mode
is the second one (or the first, if you never entered a field). The listener is
on `document`, lives in `useDrawEdit`, and checks `document.activeElement`
against `[data-field]`. Leaving the mode drops any drafts still in hand, which
is only ever a rejected edit — every box commits on the way out of its focus.

In edit mode a box becomes its own form. Names are inputs styled identically to
the read state, so nothing shifts when you enter one; the affordance is the
hover and focus chrome. A side fed by an earlier match is not focusable —
changing who feeds whom is structural, needs the graph re-validated for cycles
and orphaned results, and is not in scope here. The columns are already in the
table for that work. Such a side reads as *Winner of R32-1* until that match is
decided, and after it the player's name leads with the feeder as a caption
beside it (`.lc-static.resolved` / `.lc-from`) — editing the rest of the box is
much easier when you can see who is actually in it.

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

**Second gotcha, same shape:** Esc reverts a box and then blurs it, and the
blur that commits the box is dispatched inside that same keystroke — before
React has applied the revert. A commit reading `drafts` there sees the draft
that was just thrown away and saves it, i.e. Esc writes the edit it was meant
to cancel. `useDrawEdit` parks the mid in a `reverted` ref that `commit` checks
and clears; `set` clears it too, so typing again after a revert still commits.

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
- `lib/ladder/useDrawEdit.ts` — draft state for edit mode, validation, the
  commit, the `openAt` focus request and the Esc-to-leave listener. Holds the time as `hh`/`mm`/`mer` rather than `"4:00 PM"`, because a
  half-typed time has no valid single-string form and round-tripping it through
  a parser fights the person typing. `composeTime` puts it back together on the
  way out. A draft deliberately outlives its own save: `router.refresh()` is
  async, so dropping it when the write returns flashes the old value back — each
  draft is retired once the draw coming down agrees with it.
- `components/ladder/` — `Bracket.tsx` (boxes, tree, standings, schedule, and
  the `TimeField` segments), `BracketBoard.tsx` (mode toggle, controls,
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
