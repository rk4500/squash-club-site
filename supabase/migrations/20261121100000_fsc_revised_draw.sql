-- FSC 2.0: apply the revised draw sheet (21 Nov 2026) to the live fsc-2026 draw.
--
-- Generated from data/fsc/fsc-2026.json (scripts/fsc_seed.py) diffed against
-- the live rows. Targeted per-row updates, not a reseed: results are being
-- recorded while this goes in.
--
-- Changes:
--   Men's: R32-1 bye -> Priyaan Thakker v Nirmal Singh (R16-1 now fed by it);
--          Devyansh Bhansali and Pranav Pravin Bhosale swap (R32-2 / R32-6);
--          new qualifier MO-Q3 Sagar Patankar v Anand Rao feeds R32-8;
--          Riaan Garud replaces Deerav Moolani; Lakshya Motial replaces
--          Deepak Moolani; afternoon slots moved to clear the sheet's clashes.
--   Mixed: Deepak/Devki out (Ruhi/Shantanu bye); Deerav/Kiara and
--          Drishti/Khuman swap; M24 to 2:30 PM Court 1.
--   All:   match numbers renumbered chronologically (day, time, court), since
--          the sheet reused M04, M08, M09, M15.

begin;

-- Results recorded against pairings that no longer exist. R32-2 (Devyansh's
-- walkover over Rohit) and R32-6 (Rudra's walkover over Pranav) are voided by
-- the swap; the rest are guards in case one was recorded on the old pairing
-- before this ran. A result already matching the new names is kept.
delete from public.ladder_results r
  using (values
    ('MO-R32-2',  'Rohit Hardikar',      'Pranav Pravin Bhosale'),
    ('MO-R32-6',  'Rudra Krishna',       'Devyansh Bhansali'),
    ('MO-R32-1',  'Priyaan Thakker',     'Nirmal Singh'),
    ('MO-R32-9',  'Riaan Garud',         'Karan Sandhu'),
    ('MO-R32-12', 'Varun Sahasrabuddhe', 'Lakshya Motial'),
    ('XD-R16-4',  'Jiah/Reyaan',         'Deerav/Kiara')
  ) as n(match_id, a, b)
  where r.draw = 'fsc-2026' and r.match_id = n.match_id
    and (r.snap_a, r.snap_b) is distinct from (n.a, n.b);

-- Sides fed by a changed or new match; nothing can be legitimately recorded
-- on these yet.
delete from public.ladder_results
  where draw = 'fsc-2026'
    and match_id in ('MO-R32-8', 'MO-R16-1', 'XD-R16-3', 'XD-R16-5', 'XD-QF2', 'XD-QF3');

insert into public.ladder_matches
  (draw, match_id, label, display, route, a_type, a_ref, b_type, b_ref, day, "time", court, src)
values
  ('fsc-2026', 'MO-Q3', 'Men''s Open · Qualifying', 'M16', 'Winner → M22', 'name', 'Sagar Patankar', 'name', 'Anand Rao', 'Saturday', '12:00 PM', 'Court 1', 'fixed');

update public.ladder_matches
  set display = 'M51',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'GU-3P';

update public.ladder_matches
  set display = 'M50',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'GU-F';

update public.ladder_matches
  set display = 'M47',
      route = 'Winner → M49',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'GU-R1-2';

update public.ladder_matches
  set display = 'M49',
      route = 'Winner → M50 · Loser → M51',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'GU-SF1';

update public.ladder_matches
  set display = 'M48',
      route = 'Winner → M50 · Loser → M51',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'GU-SF2';

update public.ladder_matches
  set display = 'M67',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-3P';

update public.ladder_matches
  set display = 'M68',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-F';

update public.ladder_matches
  set route = 'Winner → M06',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-Q2';

update public.ladder_matches
  set display = 'M58',
      route = 'Winner → M64',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-QF1';

update public.ladder_matches
  set display = 'M59',
      route = 'Winner → M64',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-QF2';

update public.ladder_matches
  set display = 'M61',
      route = 'Winner → M65',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-QF3';

update public.ladder_matches
  set display = 'M60',
      route = 'Winner → M65',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-QF4';

update public.ladder_matches
  set display = 'M18',
      route = 'Winner → M58',
      a_type = 'W',
      a_ref = 'MO-R32-1',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-1';

update public.ladder_matches
  set display = 'M19',
      route = 'Winner → M58',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-2';

update public.ladder_matches
  set display = 'M20',
      route = 'Winner → M59',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-3';

update public.ladder_matches
  set display = 'M24',
      route = 'Winner → M59',
      "time" = '1:30 PM',
      court = 'Court 1',
      src = 'fixed',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-4';

update public.ladder_matches
  set display = 'M21',
      route = 'Winner → M61',
      "time" = '1:00 PM',
      court = 'Court 2',
      src = 'fixed',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-5';

update public.ladder_matches
  set display = 'M25',
      route = 'Winner → M61',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-6';

update public.ladder_matches
  set display = 'M26',
      route = 'Winner → M60',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-7';

update public.ladder_matches
  set display = 'M27',
      route = 'Winner → M60',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R16-8';

update public.ladder_matches
  set display = 'M08',
      route = 'Winner → M18',
      b_type = 'name',
      b_ref = 'Nirmal Singh',
      day = 'Saturday',
      "time" = '10:00 AM',
      court = 'Court 1',
      src = 'printed',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-1';

update public.ladder_matches
  set display = 'M10',
      route = 'Winner → M21',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-10';

update public.ladder_matches
  set display = 'M13',
      route = 'Winner → M25',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-11';

update public.ladder_matches
  set display = 'M12',
      route = 'Winner → M25',
      b_ref = 'Lakshya Motial',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-12';

update public.ladder_matches
  set display = 'M15',
      route = 'Winner → M26',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-13';

update public.ladder_matches
  set display = 'M14',
      route = 'Winner → M26',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-14';

update public.ladder_matches
  set display = 'M17',
      route = 'Winner → M27',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-15';

update public.ladder_matches
  set display = 'M23',
      route = 'Winner → M27',
      "time" = '1:15 PM',
      court = 'Court 2',
      src = 'fixed',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-16';

update public.ladder_matches
  set route = 'Winner → M18',
      b_ref = 'Pranav Pravin Bhosale',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-2';

update public.ladder_matches
  set route = 'Winner → M19',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-3';

update public.ladder_matches
  set display = 'M06',
      route = 'Winner → M19',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-4';

update public.ladder_matches
  set display = 'M05',
      route = 'Winner → M20',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-5';

update public.ladder_matches
  set route = 'Winner → M20',
      b_ref = 'Devyansh Bhansali',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-6';

update public.ladder_matches
  set display = 'M09',
      route = 'Winner → M24',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-7';

update public.ladder_matches
  set display = 'M22',
      route = 'Winner → M24',
      a_type = 'W',
      a_ref = 'MO-Q3',
      "time" = '1:15 PM',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-8';

update public.ladder_matches
  set display = 'M11',
      route = 'Winner → M21',
      a_ref = 'Riaan Garud',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-R32-9';

update public.ladder_matches
  set display = 'M64',
      route = 'Winner → M68 · Loser → M67',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-SF1';

update public.ladder_matches
  set display = 'M65',
      route = 'Winner → M68 · Loser → M67',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'MO-SF2';

update public.ladder_matches
  set display = 'M69',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-3P';

update public.ladder_matches
  set display = 'M66',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-F';

update public.ladder_matches
  set display = 'M36',
      route = 'Winner → M38',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-Q1';

update public.ladder_matches
  set display = 'M38',
      route = 'Winner → M46',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-Q2';

update public.ladder_matches
  set display = 'M41',
      route = 'Winner → M44',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-Q3';

update public.ladder_matches
  set display = 'M52',
      route = 'Winner → M62',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-QF1';

update public.ladder_matches
  set display = 'M53',
      route = 'Winner → M62',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-QF2';

update public.ladder_matches
  set display = 'M54',
      route = 'Winner → M63',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-QF3';

update public.ladder_matches
  set display = 'M55',
      route = 'Winner → M63',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-QF4';

update public.ladder_matches
  set display = 'M46',
      route = 'Winner → M52',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-1';

update public.ladder_matches
  set display = 'M37',
      route = 'Winner → M52',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-2';

update public.ladder_matches
  set display = 'M39',
      route = 'Winner → M53',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-3';

update public.ladder_matches
  set display = 'M40',
      route = 'Winner → M53',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-4';

update public.ladder_matches
  set display = 'M42',
      route = 'Winner → M54',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-5';

update public.ladder_matches
  set display = 'M43',
      route = 'Winner → M54',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-6';

update public.ladder_matches
  set display = 'M45',
      route = 'Winner → M55',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-7';

update public.ladder_matches
  set display = 'M44',
      route = 'Winner → M55',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-R16-8';

update public.ladder_matches
  set display = 'M62',
      route = 'Winner → M66 · Loser → M69',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-SF1';

update public.ladder_matches
  set display = 'M63',
      route = 'Winner → M66 · Loser → M69',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'WO-SF2';

update public.ladder_matches
  set display = 'M70',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-3P';

update public.ladder_matches
  set display = 'M71',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-F';

update public.ladder_matches
  set display = 'M32',
      route = 'Winner → M56',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-QF1';

update public.ladder_matches
  set display = 'M33',
      route = 'Winner → M56',
      a_type = 'name',
      a_ref = 'Ruhi/Shantanu',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-QF2';

update public.ladder_matches
  set display = 'M34',
      route = 'Winner → M57',
      a_ref = 'Drishti/Khuman',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-QF3';

update public.ladder_matches
  set display = 'M35',
      route = 'Winner → M57',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-QF4';

update public.ladder_matches
  set display = 'M28',
      route = 'Winner → M32',
      "time" = '2:30 PM',
      src = 'fixed',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-R16-2';

update public.ladder_matches
  set display = 'Bye',
      route = 'Bye: Ruhi/Shantanu advances',
      a_type = 'bye',
      a_ref = '',
      day = null,
      "time" = null,
      court = null,
      src = null,
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-R16-3';

update public.ladder_matches
  set display = 'M29',
      route = 'Winner → M33',
      b_ref = 'Deerav/Kiara',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-R16-4';

update public.ladder_matches
  set route = 'Bye: Drishti/Khuman advances',
      a_ref = 'Drishti/Khuman',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-R16-5';

update public.ladder_matches
  set display = 'M30',
      route = 'Winner → M34',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-R16-6';

update public.ladder_matches
  set display = 'M31',
      route = 'Winner → M35',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-R16-7';

update public.ladder_matches
  set display = 'M56',
      route = 'Winner → M71 · Loser → M70',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-SF1';

update public.ladder_matches
  set display = 'M57',
      route = 'Winner → M71 · Loser → M70',
      updated_at = now()
  where draw = 'fsc-2026' and match_id = 'XD-SF2';


commit;
