-- Tournaments: one registry row per draw, so several brackets can share the
-- ladder_matches / ladder_results tables and a finished one can be locked.
--
-- Both tables were already keyed (draw, match_id); this makes `draw` a real
-- reference instead of free text, so a typo in a draw id is refused rather
-- than silently starting a new, empty bracket. New events add a row here and
-- seed their matches; they never need tables of their own.
--
-- Locking is enforced here, in RLS, not in the UI: a locked tournament
-- refuses every write from the browser even for a signed-in committee member.

create table public.tournaments (
  id         text primary key check (length(trim(id)) > 0),
  name       text not null check (length(trim(name)) > 0),
  starts_on  date,
  locked     boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.tournaments is
  'One row per bracket draw. locked = true freezes its matches and results. Public read; no browser writes.';

-- Reachable from the browser, so RLS on with an explicit policy. There is no
-- write policy on purpose: creating or locking a tournament is a migration.
alter table public.tournaments enable row level security;

create policy "Tournaments are publicly readable"
  on public.tournaments for select to anon, authenticated using (true);

insert into public.tournaments (id, name, starts_on, locked) values
  ('ladder-v2', 'Squash Ladder 2026-27', '2026-09-06', true),
  ('fsc-2026',  'FSC 2.0: FLAME Squash Open', '2026-11-21', false);

-- `draw` no longer defaults to the ladder: every write must say which draw.
alter table public.ladder_matches alter column draw drop default;
alter table public.ladder_results alter column draw drop default;

alter table public.ladder_matches
  add constraint ladder_matches_draw_fkey
  foreign key (draw) references public.tournaments (id) on update cascade;
alter table public.ladder_results
  add constraint ladder_results_draw_fkey
  foreign key (draw) references public.tournaments (id) on update cascade;

-- True when a draw is open for editing. security definer + empty search_path
-- so the policies below can call it without granting anything on the table
-- and without being steered by a caller's search_path.
create or replace function public.tournament_is_open(draw_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.tournaments t where t.id = draw_id and not t.locked
  );
$$;

-- Same authenticated-only rule as before, now also refusing a locked draw.
-- Public signups must stay disabled, or anyone could register into this role.
drop policy "Signed-in admins can write ladder results" on public.ladder_results;
create policy "Signed-in admins can write open ladder results"
  on public.ladder_results
  for all
  to authenticated
  using (public.tournament_is_open(draw))
  with check (public.tournament_is_open(draw));

drop policy "Signed-in admins can edit ladder matches" on public.ladder_matches;
create policy "Signed-in admins can edit open ladder matches"
  on public.ladder_matches
  for all
  to authenticated
  using (public.tournament_is_open(draw))
  with check (public.tournament_is_open(draw));

-- FSC 2.0 draw, generated from data/fsc/fsc-2026.json (scripts/fsc_seed.py,
-- transcribed from the printed draw sheet).
insert into public.ladder_matches
  (draw, match_id, label, display, route, a_type, a_ref, b_type, b_ref, day, "time", court, src)
values
  ('fsc-2026', 'MO-Q1', 'Men''s Open · Qualifying', 'M01', 'Winner → M04', 'name', 'Rahul Dharra', 'name', 'Ayan', 'Saturday', '8:00 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-Q2', 'Men''s Open · Qualifying', 'M04', 'Winner → M05', 'name', 'Bonnie Tharayil', 'W', 'MO-Q1', 'Saturday', '8:30 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-1', 'Men''s Open · Round of 32', 'Bye', 'Bye: Priyaan Thakker advances', 'name', 'Priyaan Thakker', 'bye', '', null, null, null, null),
  ('fsc-2026', 'MO-R32-2', 'Men''s Open · Round of 32', 'M02', 'Winner → M16', 'name', 'Rohit Hardikar', 'name', 'Devyansh Bhansali', 'Saturday', '8:00 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-3', 'Men''s Open · Round of 32', 'M03', 'Winner → M17', 'name', 'Sachin Chauhan', 'name', 'Pradeep Thori', 'Saturday', '8:30 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R32-4', 'Men''s Open · Round of 32', 'M05', 'Winner → M17', 'W', 'MO-Q2', 'name', 'Maanvir', 'Saturday', '9:00 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-5', 'Men''s Open · Round of 32', 'M06', 'Winner → M18', 'name', 'Huzaifa', 'name', 'Pradeep Narayan', 'Saturday', '9:00 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R32-6', 'Men''s Open · Round of 32', 'M07', 'Winner → M18', 'name', 'Rudra Krishna', 'name', 'Pranav Pravin Bhosale', 'Saturday', '9:30 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-7', 'Men''s Open · Round of 32', 'M08', 'Winner → M19', 'name', 'Shivang', 'name', 'Bhushan Wavikar', 'Saturday', '10:00 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-8', 'Men''s Open · Round of 32', 'M09', 'Winner → M19', 'name', 'Sagar Patankar', 'name', 'Tanay Kadam', 'Saturday', '10:00 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R32-9', 'Men''s Open · Round of 32', 'M08', 'Winner → M20', 'name', 'Deerav Moolani', 'name', 'Karan Sandhu', 'Saturday', '10:30 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-10', 'Men''s Open · Round of 32', 'M09', 'Winner → M20', 'name', 'Nirmal Paul', 'name', 'Yugant Gupta', 'Saturday', '10:30 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R32-11', 'Men''s Open · Round of 32', 'M10', 'Winner → M21', 'name', 'Japmann', 'name', 'Aahan Joshi', 'Saturday', '11:00 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-12', 'Men''s Open · Round of 32', 'M11', 'Winner → M21', 'name', 'Varun Sahasrabuddhe', 'name', 'Deepak Moolani', 'Saturday', '11:00 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R32-13', 'Men''s Open · Round of 32', 'M12', 'Winner → M22', 'name', 'Moksh Sanghvi', 'name', 'Vivek', 'Saturday', '11:30 AM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-14', 'Men''s Open · Round of 32', 'M13', 'Winner → M22', 'name', 'Dev Agarwal', 'name', 'Nitin Deshmukh', 'Saturday', '11:30 AM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R32-15', 'Men''s Open · Round of 32', 'M14', 'Winner → M23', 'name', 'Anil Balu', 'name', 'Shantanu', 'Saturday', '12:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R32-16', 'Men''s Open · Round of 32', 'M15', 'Winner → M23', 'name', 'Simranjit Singh', 'name', 'Dishant Murjani', 'Saturday', '12:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R16-1', 'Men''s Open · Round of 16', 'M16', 'Winner → M54', 'name', 'Priyaan Thakker', 'W', 'MO-R32-2', 'Saturday', '12:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R16-2', 'Men''s Open · Round of 16', 'M17', 'Winner → M54', 'W', 'MO-R32-3', 'W', 'MO-R32-4', 'Saturday', '12:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R16-3', 'Men''s Open · Round of 16', 'M18', 'Winner → M55', 'W', 'MO-R32-5', 'W', 'MO-R32-6', 'Saturday', '1:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R16-4', 'Men''s Open · Round of 16', 'M19', 'Winner → M55', 'W', 'MO-R32-7', 'W', 'MO-R32-8', 'Saturday', '1:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R16-5', 'Men''s Open · Round of 16', 'M20', 'Winner → M56', 'W', 'MO-R32-9', 'W', 'MO-R32-10', 'Saturday', '1:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R16-6', 'Men''s Open · Round of 16', 'M21', 'Winner → M56', 'W', 'MO-R32-11', 'W', 'MO-R32-12', 'Saturday', '1:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-R16-7', 'Men''s Open · Round of 16', 'M22', 'Winner → M57', 'W', 'MO-R32-13', 'W', 'MO-R32-14', 'Saturday', '2:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-R16-8', 'Men''s Open · Round of 16', 'M23', 'Winner → M57', 'W', 'MO-R32-15', 'W', 'MO-R32-16', 'Saturday', '2:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-QF1', 'Men''s Open · Quarterfinal', 'M54', 'Winner → M58', 'W', 'MO-R16-1', 'W', 'MO-R16-2', 'Sunday', '3:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-QF2', 'Men''s Open · Quarterfinal', 'M55', 'Winner → M58', 'W', 'MO-R16-3', 'W', 'MO-R16-4', 'Sunday', '3:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-QF3', 'Men''s Open · Quarterfinal', 'M56', 'Winner → M59', 'W', 'MO-R16-5', 'W', 'MO-R16-6', 'Sunday', '4:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-QF4', 'Men''s Open · Quarterfinal', 'M57', 'Winner → M59', 'W', 'MO-R16-7', 'W', 'MO-R16-8', 'Sunday', '4:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-SF1', 'Men''s Open · Semifinal', 'M58', 'Winner → M61 · Loser → M63', 'W', 'MO-QF1', 'W', 'MO-QF2', 'Sunday', '5:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-SF2', 'Men''s Open · Semifinal', 'M59', 'Winner → M61 · Loser → M63', 'W', 'MO-QF3', 'W', 'MO-QF4', 'Sunday', '5:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'MO-F', 'Men''s Open · Final', 'M61', 'Decides Men''s Open 1st and 2nd', 'W', 'MO-SF1', 'W', 'MO-SF2', 'Sunday', '6:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'MO-3P', 'Men''s Open · 3rd Place', 'M63', 'Decides Men''s Open 3rd and 4th', 'L', 'MO-SF1', 'L', 'MO-SF2', 'Sunday', '6:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-Q1', 'Women''s Open · Qualifying', 'M34', 'Winner → M36', 'name', 'Mahika Patwardhan', 'name', 'Priyadarshini Sanyal', 'Saturday', '5:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-Q2', 'Women''s Open · Qualifying', 'M36', 'Winner → M43', 'W', 'WO-Q1', 'name', 'Anshu Priya', 'Saturday', '6:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-Q3', 'Women''s Open · Qualifying', 'M38', 'Winner → M42', 'name', 'Jiah', 'name', 'Srushti Deshmukh', 'Saturday', '6:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-R16-1', 'Women''s Open · Round of 16', 'M43', 'Winner → M48', 'name', 'Drishti Pawar', 'W', 'WO-Q2', 'Saturday', '8:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-R16-2', 'Women''s Open · Round of 16', 'M34', 'Winner → M48', 'name', 'Shruti Pravin', 'name', 'Tisha Dakalia', 'Saturday', '5:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-R16-3', 'Women''s Open · Round of 16', 'M35', 'Winner → M49', 'name', 'Miss Asshroya Ashok Kkumor', 'name', 'Smriti', 'Saturday', '6:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-R16-4', 'Women''s Open · Round of 16', 'M37', 'Winner → M49', 'name', 'Suchita Chandrakant Tangade', 'name', 'Ruhi Lodha', 'Saturday', '6:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-R16-5', 'Women''s Open · Round of 16', 'M39', 'Winner → M50', 'name', 'Dhwani', 'name', 'Saloni Bhardwaj', 'Saturday', '7:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-R16-6', 'Women''s Open · Round of 16', 'M40', 'Winner → M50', 'name', 'Reshma Parkeria', 'name', 'Aashka Sojatia', 'Saturday', '7:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-R16-7', 'Women''s Open · Round of 16', 'M41', 'Winner → M51', 'name', 'Pragya Jindal', 'name', 'Ritika', 'Saturday', '7:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-R16-8', 'Women''s Open · Round of 16', 'M42', 'Winner → M51', 'W', 'WO-Q3', 'name', 'Kuhu Parakh', 'Saturday', '7:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-QF1', 'Women''s Open · Quarterfinal', 'M48', 'Winner → M58', 'W', 'WO-R16-1', 'W', 'WO-R16-2', 'Sunday', '2:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-QF2', 'Women''s Open · Quarterfinal', 'M49', 'Winner → M58', 'W', 'WO-R16-3', 'W', 'WO-R16-4', 'Sunday', '2:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-QF3', 'Women''s Open · Quarterfinal', 'M50', 'Winner → M59', 'W', 'WO-R16-5', 'W', 'WO-R16-6', 'Sunday', '2:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-QF4', 'Women''s Open · Quarterfinal', 'M51', 'Winner → M59', 'W', 'WO-R16-7', 'W', 'WO-R16-8', 'Sunday', '2:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-SF1', 'Women''s Open · Semifinal', 'M58', 'Winner → M60 · Loser → M64', 'W', 'WO-QF1', 'W', 'WO-QF2', 'Sunday', '4:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-SF2', 'Women''s Open · Semifinal', 'M59', 'Winner → M60 · Loser → M64', 'W', 'WO-QF3', 'W', 'WO-QF4', 'Sunday', '4:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'WO-F', 'Women''s Open · Final', 'M60', 'Decides Women''s Open 1st and 2nd', 'W', 'WO-SF1', 'W', 'WO-SF2', 'Sunday', '5:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'WO-3P', 'Women''s Open · 3rd Place', 'M64', 'Decides Women''s Open 3rd and 4th', 'L', 'WO-SF1', 'L', 'WO-SF2', 'Sunday', '6:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'GU-R1-1', 'Girls U-17 · Quarterfinal', 'Bye', 'Bye: Drishti Pawar advances', 'name', 'Drishti Pawar', 'bye', '', null, null, null, null),
  ('fsc-2026', 'GU-R1-2', 'Girls U-17 · Quarterfinal', 'M44', 'Winner → M45', 'name', 'Mahika Patwardhan', 'name', 'Aumshi Paul', 'Sunday', '12:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'GU-R1-3', 'Girls U-17 · Quarterfinal', 'Bye', 'Bye: Ruhi Lodha advances', 'name', 'Ruhi Lodha', 'bye', '', null, null, null, null),
  ('fsc-2026', 'GU-R1-4', 'Girls U-17 · Quarterfinal', 'Bye', 'Bye: Miss Asshroya Ashok Kkumor advances', 'bye', '', 'name', 'Miss Asshroya Ashok Kkumor', null, null, null, null),
  ('fsc-2026', 'GU-SF1', 'Girls U-17 · Semifinal', 'M45', 'Winner → M47 · Loser → M64', 'name', 'Drishti Pawar', 'W', 'GU-R1-2', 'Sunday', '12:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'GU-SF2', 'Girls U-17 · Semifinal', 'M46', 'Winner → M47 · Loser → M64', 'name', 'Ruhi Lodha', 'name', 'Miss Asshroya Ashok Kkumor', 'Sunday', '12:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'GU-F', 'Girls U-17 · Final', 'M47', 'Decides Girls U-17 1st and 2nd', 'W', 'GU-SF1', 'W', 'GU-SF2', 'Sunday', '1:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'GU-3P', 'Girls U-17 · 3rd Place', 'M64', 'Decides Girls U-17 3rd and 4th', 'L', 'GU-SF1', 'L', 'GU-SF2', 'Sunday', '1:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'XD-R16-1', 'Mixed Doubles · Round of 16', 'Bye', 'Bye: Dishant/Kuhu advances', 'name', 'Dishant/Kuhu', 'bye', '', null, null, null, null),
  ('fsc-2026', 'XD-R16-2', 'Mixed Doubles · Round of 16', 'M24', 'Winner → M30', 'name', 'Pranav Bhosale', 'name', 'Pradeep/Yashvani', 'Saturday', '3:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-R16-3', 'Mixed Doubles · Round of 16', 'M25', 'Winner → M31', 'name', 'Deepak/Devki', 'name', 'Ruhi/Shantanu', 'Saturday', '3:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'XD-R16-4', 'Mixed Doubles · Round of 16', 'M26', 'Winner → M31', 'name', 'Jiah/Reyaan', 'name', 'Drishti/Khuman', 'Saturday', '3:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-R16-5', 'Mixed Doubles · Round of 16', 'Bye', 'Bye: Deerav/Kiara advances', 'name', 'Deerav/Kiara', 'bye', '', null, null, null, null),
  ('fsc-2026', 'XD-R16-6', 'Mixed Doubles · Round of 16', 'M28', 'Winner → M32', 'name', 'Priyadarshini/Nirmal', 'name', 'Devankit/Sanya', 'Saturday', '4:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-R16-7', 'Mixed Doubles · Round of 16', 'M29', 'Winner → M33', 'name', 'Shivang/Ritika', 'name', 'Sagar/Reshma', 'Saturday', '4:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'XD-R16-8', 'Mixed Doubles · Round of 16', 'Bye', 'Bye: Dhwani/Priyaan advances', 'bye', '', 'name', 'Dhwani/Priyaan', null, null, null, null),
  ('fsc-2026', 'XD-QF1', 'Mixed Doubles · Quarterfinal', 'M30', 'Winner → M52', 'name', 'Dishant/Kuhu', 'W', 'XD-R16-2', 'Saturday', '4:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-QF2', 'Mixed Doubles · Quarterfinal', 'M31', 'Winner → M52', 'W', 'XD-R16-3', 'W', 'XD-R16-4', 'Saturday', '4:30 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'XD-QF3', 'Mixed Doubles · Quarterfinal', 'M32', 'Winner → M53', 'name', 'Deerav/Kiara', 'W', 'XD-R16-6', 'Saturday', '5:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-QF4', 'Mixed Doubles · Quarterfinal', 'M33', 'Winner → M53', 'W', 'XD-R16-7', 'name', 'Dhwani/Priyaan', 'Saturday', '5:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'XD-SF1', 'Mixed Doubles · Semifinal', 'M52', 'Winner → M62 · Loser → M65', 'W', 'XD-QF1', 'W', 'XD-QF2', 'Sunday', '3:00 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-SF2', 'Mixed Doubles · Semifinal', 'M53', 'Winner → M62 · Loser → M65', 'W', 'XD-QF3', 'W', 'XD-QF4', 'Sunday', '3:00 PM', 'Court 2', 'printed'),
  ('fsc-2026', 'XD-F', 'Mixed Doubles · Final', 'M62', 'Decides Mixed Doubles 1st and 2nd', 'W', 'XD-SF1', 'W', 'XD-SF2', 'Sunday', '7:30 PM', 'Court 1', 'printed'),
  ('fsc-2026', 'XD-3P', 'Mixed Doubles · 3rd Place', 'M65', 'Decides Mixed Doubles 3rd and 4th', 'L', 'XD-SF1', 'L', 'XD-SF2', 'Sunday', '7:00 PM', 'Court 2', 'printed')
on conflict (draw, match_id) do nothing;
