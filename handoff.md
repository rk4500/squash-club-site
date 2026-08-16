# Handoff — FLAME Squash Club site

Last updated: 2026-08-16

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
