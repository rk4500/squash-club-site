-- Ladder bracket results.
--
-- One row per decided match. `winner` names the side of the match box that
-- won, matching the `a` / `b` keys in data/ladder/draw.ts. `snap_a` / `snap_b`
-- record the two players' names at the moment the result was entered; that
-- snapshot is what lets a single match be cleared without destroying the
-- results downstream of it (they get flagged for re-check instead).
--
-- `draw` is part of the key so a future season's bracket can live alongside
-- this one without its match IDs colliding.

create table if not exists public.ladder_results (
  draw       text        not null default 'ladder-v2',
  match_id   text        not null,
  winner     text        not null check (winner in ('a', 'b')),
  snap_a     text,
  snap_b     text,
  updated_at timestamptz not null default now(),
  updated_by uuid        references auth.users (id) on delete set null,
  primary key (draw, match_id)
);

comment on table public.ladder_results is
  'Decided matches in the squash ladder bracket. Public read, authenticated write.';

-- Keep updated_at honest and stamp the editor server-side, so a client cannot
-- claim someone else made the change.
create or replace function public.ladder_results_touch()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

create trigger ladder_results_touch
  before insert or update on public.ladder_results
  for each row execute function public.ladder_results_touch();

-- Authorization boundary. Anyone may read the bracket; only a signed-in user
-- may change it. Public signups must stay disabled in Supabase Auth, or this
-- policy would admit anyone who registers.
alter table public.ladder_results enable row level security;

create policy "Ladder results are publicly readable"
  on public.ladder_results
  for select
  to anon, authenticated
  using (true);

create policy "Signed-in admins can write ladder results"
  on public.ladder_results
  for all
  to authenticated
  using (true)
  with check (true);

-- Lets the public bracket page stream results as they are entered.
alter publication supabase_realtime add table public.ladder_results;
