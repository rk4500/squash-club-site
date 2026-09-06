-- The draw itself, moved out of the code so the committee can fix a misspelled
-- name or a moved court time from the site rather than waiting on a deploy.
--
-- Structure -- the a_/b_ reference columns -- is seeded here and nothing in the
-- UI writes it. Editing who feeds whom needs validation that the graph stays
-- acyclic and that no recorded result is silently orphaned, which is a larger
-- job than this table; the columns exist so that work will not need a
-- migration of its own.
--
-- data/ladder/draw.ts is the file this was generated from and stays in version
-- control, so a mangled table can be regenerated from a reviewable source.

create table if not exists public.ladder_matches (
  draw     text not null default 'ladder-v2',
  match_id text not null,

  -- Editable, and shown on every box. Non-empty because a blank here would
  -- erase a player from the bracket, and these edits reach the live site with
  -- no code review in between.
  label    text not null check (length(trim(label))   > 0),
  display  text not null check (length(trim(display)) > 0),
  route    text not null check (length(trim(route))   > 0),

  -- Structure. A side is a literal name, the winner or loser of another match,
  -- or a bye. Only a bye may carry an empty reference.
  a_type   text not null check (a_type in ('name', 'W', 'L', 'bye')),
  a_ref    text not null check (a_type = 'bye' or length(trim(a_ref)) > 0),
  b_type   text not null check (b_type in ('name', 'W', 'L', 'bye')),
  b_ref    text not null check (b_type = 'bye' or length(trim(b_ref)) > 0),

  -- When and where. Nullable as a group: an unscheduled match is legitimate,
  -- a half-scheduled one is not.
  day      text check (day in ('Saturday', 'Sunday')),
  "time"   text check ("time" is null or length(trim("time")) > 0),
  court    text check (court is null or length(trim(court)) > 0),
  src      text check (src in ('printed', 'fixed', 'planned')),
  constraint ladder_matches_slot_complete check (
    (day is null and "time" is null and court is null and src is null) or
    (day is not null and "time" is not null and court is not null and src is not null)
  ),

  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,

  primary key (draw, match_id)
);

comment on table public.ladder_matches is
  'The ladder draw: who plays whom, and when. Public read, authenticated write.';

-- Same trigger as ladder_results: stamps the editor server-side so a client
-- cannot claim someone else made the change.
create trigger ladder_matches_touch
  before insert or update on public.ladder_matches
  for each row execute function public.ladder_results_touch();

alter table public.ladder_matches enable row level security;

create policy "Ladder matches are publicly readable"
  on public.ladder_matches for select to anon, authenticated using (true);

create policy "Signed-in admins can edit ladder matches"
  on public.ladder_matches for all to authenticated using (true) with check (true);

alter publication supabase_realtime add table public.ladder_matches;

insert into public.ladder_matches
  (draw, match_id, label, display, route, a_type, a_ref, b_type, b_ref, day, "time", court, src)
values
  ('ladder-v2', 'M1', 'Round of 32', 'R32-1', 'Winner → R16-1 · Loser → 17–20 Q1', 'name', 'Priyaan Thakker', 'name', 'Bhagya Patel', 'Saturday', '4:00 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M2', 'Round of 32', 'R32-2', 'Winner → R16-1 · Loser → 17–20 Q1', 'name', 'Aman', 'name', 'Aum Parikh', 'Saturday', '4:00 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M3', 'Round of 32', 'R32-3', 'Winner → R16-2 · Loser → 17–20 Q2', 'name', 'Pragya', 'name', 'Siraj Singh', 'Saturday', '4:20 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M4', 'Round of 32', 'R32-4', 'Winner → R16-2 · Loser → 17–20 Q2', 'name', 'Shaurya Mahtani', 'name', 'Shahaan', 'Saturday', '4:20 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M5', 'Round of 32', 'R32-5', 'Winner → R16-3 · Loser → 17–20 Q3', 'name', 'Japmann', 'name', 'Vihaan Kakkar', 'Saturday', '4:40 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M6', 'Round of 32', 'R32-6', 'Winner → R16-3 · Loser → 17–20 Q3', 'name', 'Atharva', 'name', 'Jiah', 'Saturday', '4:40 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M7', 'Round of 32', 'R32-7', 'Winner → R16-4 · Loser → 17–20 Q4', 'name', 'Neev K Shah', 'name', 'Nikita', 'Saturday', '5:00 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M8', 'Round of 32', 'R32-8', 'Winner → R16-4 · Loser → 17–20 Q4', 'name', 'Reyaan', 'name', 'Maanvir', 'Saturday', '5:00 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M9', 'Round of 32', 'R32-9', 'Winner → R16-5 · Loser → 17–20 Q5', 'name', 'Moksh', 'name', 'Idhant Katoch', 'Saturday', '5:20 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M10', 'Round of 32', 'R32-10', 'Winner → R16-5 · Loser → 17–20 Q5', 'name', 'Hriday', 'name', 'Aliqyaan', 'Saturday', '5:20 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M11', 'Round of 32', 'R32-11', 'Winner → R16-6 · Loser → 17–20 Q6', 'name', 'Hunar Bedi', 'name', 'Adhya', 'Saturday', '5:40 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M12', 'Round of 32', 'R32-12', 'Winner → R16-6 · Loser → 17–20 Q6', 'name', 'Om Muslunkar', 'name', 'Dhwani', 'Saturday', '5:40 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M13', 'Round of 32', 'R32-13', 'Winner → R16-7 · Loser → 17–20 Q7', 'name', 'Rudra Krishna', 'name', 'Darsh Agarwal', 'Saturday', '2:00 PM', 'Court 1', 'fixed'),
  ('ladder-v2', 'M14', 'Round of 32', 'R32-14', 'Winner → R16-7 · Loser → 17–20 Q7', 'name', 'Riya', 'name', 'Bhagya Popat', 'Saturday', '2:00 PM', 'Court 2', 'fixed'),
  ('ladder-v2', 'M15', 'Round of 32', 'R32-15', 'Winner → R16-8 · Loser → 17–20 Q8', 'name', 'M.S.S Vasista', 'name', 'Rushil', 'Saturday', '2:30 PM', 'Court 1', 'fixed'),
  ('ladder-v2', 'M16', 'Round of 32', 'R32-16', 'Winner → R16-8 · Loser → 17–20 Q8', 'name', 'Virat Shah', 'name', 'Huzaifa', 'Saturday', '3:00 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M17', 'Round of 16', 'R16-1', 'Winner → QF-1 · Loser → 9–16 Qualifier-1', 'W', 'M1', 'W', 'M2', 'Saturday', '6:00 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M18', 'Round of 16', 'R16-2', 'Winner → QF-1 · Loser → 9–16 Qualifier-2', 'W', 'M3', 'W', 'M4', 'Saturday', '6:00 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M19', 'Round of 16', 'R16-3', 'Winner → QF-2 · Loser → 9–16 Qualifier-3', 'W', 'M5', 'W', 'M6', 'Saturday', '6:20 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M20', 'Round of 16', 'R16-4', 'Winner → QF-2 · Loser → 9–16 Qualifier-4', 'W', 'M7', 'W', 'M8', 'Saturday', '6:20 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M21', 'Round of 16', 'R16-5', 'Winner → QF-3 · Loser → 9–16 Qualifier-4', 'W', 'M9', 'W', 'M10', 'Saturday', '6:40 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'M22', 'Round of 16', 'R16-6', 'Winner → QF-3 · Loser → 9–16 Qualifier-3', 'W', 'M11', 'W', 'M12', 'Saturday', '6:40 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'M23', 'Round of 16', 'R16-7', 'Winner → QF-4 · Loser → 9–16 Qualifier-2', 'W', 'M13', 'W', 'M14', 'Saturday', '2:30 PM', 'Court 2', 'fixed'),
  ('ladder-v2', 'M24', 'Round of 16', 'R16-8', 'Winner → QF-4 · Loser → 9–16 Qualifier-1', 'W', 'M15', 'W', 'M16', 'Saturday', '3:40 PM', 'Court 1', 'fixed'),
  ('ladder-v2', 'QF1', 'Quarterfinal', 'QF-1', 'Winner → SF-1 · Loser → 5–8 SF-1', 'W', 'M17', 'W', 'M18', 'Saturday', '8:20 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'QF2', 'Quarterfinal', 'QF-2', 'Winner → SF-1 · Loser → 5–8 SF-1', 'W', 'M19', 'W', 'M20', 'Saturday', '8:20 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'QF3', 'Quarterfinal', 'QF-3', 'Winner → SF-2 · Loser → 5–8 SF-2', 'W', 'M21', 'W', 'M22', 'Saturday', '8:35 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'QF4', 'Quarterfinal', 'QF-4', 'Winner → SF-2 · Loser → 5–8 SF-2', 'W', 'M23', 'W', 'M24', 'Saturday', '8:35 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'SF1', 'Semifinal', 'SF-1', 'Winner → FINAL · Loser → 3rd Place', 'W', 'QF1', 'W', 'QF2', 'Sunday', '6:30 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'SF2', 'Semifinal', 'SF-2', 'Winner → FINAL · Loser → 3rd Place', 'W', 'QF3', 'W', 'QF4', 'Sunday', '6:30 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'F', 'Final', 'FINAL', 'Decides 1st / 2nd', 'W', 'SF1', 'W', 'SF2', 'Sunday', '7:45 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P34', '3rd/4th Playoff', '3rd Place', 'Decides 3rd / 4th', 'L', 'SF1', 'L', 'SF2', 'Sunday', '7:45 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P5_1', 'Ranks 5–8', '5–8 SF-1', 'Winner → 5–6 Final · Loser → 7–8 Match', 'L', 'QF1', 'L', 'QF2', 'Sunday', '6:45 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P5_2', 'Ranks 5–8', '5–8 SF-2', 'Winner → 5–6 Final · Loser → 7–8 Match', 'L', 'QF3', 'L', 'QF4', 'Sunday', '6:45 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P5F', 'Ranks 5–6', '5–6 Final', 'Decides 5th / 6th', 'W', 'P5_1', 'W', 'P5_2', 'Sunday', '8:00 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P5_34', 'Ranks 7–8', '7–8 Match', 'Decides 7th / 8th', 'L', 'P5_1', 'L', 'P5_2', 'Sunday', '8:00 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P9_1', 'Ranks 9–16', '9–16 Qualifier-1', 'Winner → 9–12 SF-1 · Loser → 13–16 SF-1', 'L', 'M17', 'L', 'M24', 'Saturday', '8:50 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P9_2', 'Ranks 9–16', '9–16 Qualifier-2', 'Winner → 9–12 SF-2 · Loser → 13–16 SF-2', 'L', 'M18', 'L', 'M23', 'Saturday', '8:50 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P9_3', 'Ranks 9–16', '9–16 Qualifier-3', 'Winner → 9–12 SF-2 · Loser → 13–16 SF-2', 'L', 'M19', 'L', 'M22', 'Saturday', '9:05 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P9_4', 'Ranks 9–16', '9–16 Qualifier-4', 'Winner → 9–12 SF-1 · Loser → 13–16 SF-1', 'L', 'M20', 'L', 'M21', 'Saturday', '9:05 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P9SF1', 'Ranks 9–12', '9–12 SF-1', 'Winner → 9–10 Final · Loser → 11–12 Match', 'W', 'P9_1', 'W', 'P9_4', 'Sunday', '7:00 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P9SF2', 'Ranks 9–12', '9–12 SF-2', 'Winner → 9–10 Final · Loser → 11–12 Match', 'W', 'P9_2', 'W', 'P9_3', 'Sunday', '7:00 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P9F', 'Ranks 9–10', '9–10 Final', 'Decides 9th / 10th', 'W', 'P9SF1', 'W', 'P9SF2', 'Sunday', '8:15 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P9_34', 'Ranks 11–12', '11–12 Match', 'Decides 11th / 12th', 'L', 'P9SF1', 'L', 'P9SF2', 'Sunday', '8:15 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P13_1', 'Ranks 13–16', '13–16 SF-1', 'Winner → 13–14 Final · Loser → 15–16 Match', 'L', 'P9_1', 'L', 'P9_4', 'Sunday', '7:15 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P13_2', 'Ranks 13–16', '13–16 SF-2', 'Winner → 13–14 Final · Loser → 15–16 Match', 'L', 'P9_2', 'L', 'P9_3', 'Sunday', '7:15 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'P13F', 'Ranks 13–14', '13–14 Final', 'Decides 13th / 14th', 'W', 'P13_1', 'W', 'P13_2', 'Sunday', '8:30 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'P13_34', 'Ranks 15–16', '15–16 Match', 'Decides 15th / 16th', 'L', 'P13_1', 'L', 'P13_2', 'Sunday', '8:30 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'Q1', '17–20 Qualifier R1', '17–20 Q1', 'Winner → 17–20 R2-1 · Loser → unordered 21–32 pool', 'L', 'M1', 'L', 'M2', 'Saturday', '7:00 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'Q2', '17–20 Qualifier R1', '17–20 Q2', 'Winner → 17–20 R2-1 · Loser → unordered 21–32 pool', 'L', 'M3', 'L', 'M4', 'Saturday', '7:00 PM', 'Court 2', 'fixed'),
  ('ladder-v2', 'Q3', '17–20 Qualifier R1', '17–20 Q3', 'Winner → 17–20 R2-2 · Loser → unordered 21–32 pool', 'L', 'M5', 'L', 'M6', 'Saturday', '7:20 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'Q4', '17–20 Qualifier R1', '17–20 Q4', 'Winner → 17–20 R2-2 · Loser → unordered 21–32 pool', 'L', 'M7', 'L', 'M8', 'Saturday', '7:20 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'Q5', '17–20 Qualifier R1', '17–20 Q5', 'Winner → 17–20 R2-3 · Loser → unordered 21–32 pool', 'L', 'M9', 'L', 'M10', 'Saturday', '7:40 PM', 'Court 1', 'fixed'),
  ('ladder-v2', 'Q6', '17–20 Qualifier R1', '17–20 Q6', 'Winner → 17–20 R2-3 · Loser → unordered 21–32 pool', 'L', 'M11', 'L', 'M12', 'Saturday', '7:40 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'Q7', '17–20 Qualifier R1', '17–20 Q7', 'Winner → 17–20 R2-4 · Loser → unordered 21–32 pool', 'L', 'M13', 'L', 'M14', 'Saturday', '8:00 PM', 'Court 2', 'printed'),
  ('ladder-v2', 'Q8', '17–20 Qualifier R1', '17–20 Q8', 'Winner → 17–20 R2-4 · Loser → unordered 21–32 pool', 'L', 'M15', 'L', 'M16', 'Saturday', '8:00 PM', 'Court 1', 'printed'),
  ('ladder-v2', 'Q9', '17–20 Qualifier R2', '17–20 R2-1', 'Winner → 17–20 SF-1 · Loser → unordered 21–32 pool', 'W', 'Q1', 'W', 'Q2', 'Saturday', '9:20 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'Q10', '17–20 Qualifier R2', '17–20 R2-2', 'Winner → 17–20 SF-1 · Loser → unordered 21–32 pool', 'W', 'Q3', 'W', 'Q4', 'Saturday', '9:20 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'Q11', '17–20 Qualifier R2', '17–20 R2-3', 'Winner → 17–20 SF-2 · Loser → unordered 21–32 pool', 'W', 'Q5', 'W', 'Q6', 'Sunday', '6:15 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'Q12', '17–20 Qualifier R2', '17–20 R2-4', 'Winner → 17–20 SF-2 · Loser → unordered 21–32 pool', 'W', 'Q7', 'W', 'Q8', 'Sunday', '6:15 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'Q13', '17–20 Semifinal', '17–20 SF-1', 'Winner → 17–18 Final · Loser → 19–20 Match', 'W', 'Q9', 'W', 'Q10', 'Sunday', '7:30 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'Q14', '17–20 Semifinal', '17–20 SF-2', 'Winner → 17–18 Final · Loser → 19–20 Match', 'W', 'Q11', 'W', 'Q12', 'Sunday', '7:30 PM', 'Court 2', 'planned'),
  ('ladder-v2', 'QFIN', 'Ranks 17–18', '17–18 Final', 'Decides 17th / 18th', 'W', 'Q13', 'W', 'Q14', 'Sunday', '8:45 PM', 'Court 1', 'planned'),
  ('ladder-v2', 'Q34', 'Ranks 19–20', '19–20 Match', 'Decides 19th / 20th', 'L', 'Q13', 'L', 'Q14', 'Sunday', '8:45 PM', 'Court 2', 'planned')
on conflict (draw, match_id) do nothing;
