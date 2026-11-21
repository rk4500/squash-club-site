"""
Generate data/fsc/fsc-2026.json from the FSC 2.0 draw sheet (data/FSC2.0.pdf).

The sheet is the source; this script is the reviewable transcription of it.
Match IDs are positional (MO-R32-5, WO-QF2) because the printed numbers
collide across events (M08, M09, M15, M34, M58, M59, M64 each appear twice);
the printed number is kept as `display`.

Run: python3 scripts/fsc_seed.py
"""
import json, re
from pathlib import Path

DRAW_ID = 'fsc-2026'
SAT, SUN = 'Saturday', 'Sunday'

def t(s):
    m = re.fullmatch(r'\s*(\d{1,2}):(\d{2})\s*([AaPp][Mm])\s*', s)
    assert m, s
    return f"{int(m[1])}:{m[2]} {m[3].upper()}"

matches, schedule, brackets = {}, {}, []

def N(x): return ['name', x]
def W(x): return ['W', x]
def L(x): return ['L', x]
BYE = ['bye', '']

def add(mid, label, display, a, b, slot=None):
    assert mid not in matches, mid
    matches[mid] = {'label': label, 'display': display, 'route': '', 'a': a, 'b': b}
    if slot:
        day, time, court = slot[:3]
        src = slot[3] if len(slot) > 3 else 'printed'
        schedule[mid] = {'day': day, 'time': t(time), 'court': f'Court {court}', 'src': src}

# Slots moved off the revised sheet (21 Nov) to clear double bookings it printed.
FIXED = 'fixed'

# ── Men's Open ────────────────────────────────────────────────────────────
E = "Men's Open"
add('MO-Q1', f'{E} · Qualifying', 'M01', N('Rahul Dharra'), N('Ayan'), (SAT, '8:00 AM', 1))
add('MO-Q2', f'{E} · Qualifying', 'M04', N('Bonnie Tharayil'), W('MO-Q1'), (SAT, '8:30 AM', 2))
# Revised sheet prints this as M04 12:00 PM Court 2, clashing with M14; Mixed M24
# moved to 2:30 to free Court 1.
add('MO-Q3', f'{E} · Qualifying', 'M04', N('Sagar Patankar'), N('Anand Rao'), (SAT, '12:00 PM', 1, FIXED))
r32 = [
    ('M15', N('Priyaan Thakker'), N('Nirmal Singh'), '10:00 AM', 1),
    ('M02', N('Rohit Hardikar'), N('Pranav Pravin Bhosale'), '8:00 AM', 2),
    ('M03', N('Sachin Chauhan'), N('Pradeep Thori'), '8:30 AM', 1),
    ('M05', W('MO-Q2'), N('Maanvir'), '9:00 AM', 2),
    ('M06', N('Huzaifa'), N('Pradeep Narayan'), '9:00 AM', 1),
    ('M07', N('Rudra Krishna'), N('Devyansh Bhansali'), '9:30 AM', 2),
    ('M08', N('Shivang'), N('Bhushan Wavikar'), '10:00 AM', 2),
    ('M09', W('MO-Q3'), N('Tanay Kadam'), '1:15 PM', 1),
    ('M08', N('Riaan Garud'), N('Karan Sandhu'), '10:30 AM', 2),
    ('M09', N('Nirmal Paul'), N('Yugant Gupta'), '10:30 AM', 1),
    ('M10', N('Japmann'), N('Aahan Joshi'), '11:00 AM', 2),
    ('M11', N('Varun Sahasrabuddhe'), N('Lakshya Motial'), '11:00 AM', 1),
    ('M12', N('Moksh Sanghvi'), N('Vivek'), '11:30 AM', 2),
    ('M13', N('Dev Agarwal'), N('Nitin Deshmukh'), '11:30 AM', 1),
    ('M14', N('Anil Balu'), N('Shantanu'), '12:00 PM', 2),
    # Printed 1:15 PM Court 1, same slot as M09.
    ('M15', N('Simranjit Singh'), N('Dishant Murjani'), '1:15 PM', 2, FIXED),
]
for i, row in enumerate(r32, 1):
    disp, a, b = row[:3]
    add(f'MO-R32-{i}', f'{E} · Round of 32', disp, a, b, (SAT, *row[3:]) if row[3] else None)
# Printed M19 1:30 C2 (clashes M21) and M20 1:00 C1 (clashes M18).
r16 = [('M16','12:30 PM',1),('M17','12:30 PM',2),('M18','1:00 PM',1),('M19','1:30 PM',1,FIXED),
       ('M20','1:00 PM',2,FIXED),('M21','1:30 PM',2),('M22','2:00 PM',1),('M23','2:00 PM',2)]
for i, (disp, *slot) in enumerate(r16, 1):
    add(f'MO-R16-{i}', f'{E} · Round of 16', disp, W(f'MO-R32-{2*i-1}'), W(f'MO-R32-{2*i}'), (SAT, *slot))
for i, (disp, tm, c) in enumerate([('M54','3:30 PM',1),('M55','3:30 PM',2),('M56','4:00 PM',2),('M57','4:00 PM',1)], 1):
    add(f'MO-QF{i}', f'{E} · Quarterfinal', disp, W(f'MO-R16-{2*i-1}'), W(f'MO-R16-{2*i}'), (SUN, tm, c))
for i, (disp, tm, c) in enumerate([('M58','5:00 PM',1),('M59','5:00 PM',2)], 1):
    add(f'MO-SF{i}', f'{E} · Semifinal', disp, W(f'MO-QF{2*i-1}'), W(f'MO-QF{2*i}'), (SUN, tm, c))
add('MO-F', f'{E} · Final', 'M61', W('MO-SF1'), W('MO-SF2'), (SUN, '6:30 PM', 1))
add('MO-3P', f'{E} · 3rd Place', 'M63', L('MO-SF1'), L('MO-SF2'), (SUN, '6:00 PM', 2))
brackets += [
    {'id': 'mo-q', 'title': f"{E}: Qualifying", 'columns': [['MO-Q1', 'MO-Q2', 'MO-Q3']], 'headings': ['Qualifying'], 'playoffs': []},
    {'id': 'mo', 'title': E,
     'columns': [[f'MO-R32-{i}' for i in range(1, 17)], [f'MO-R16-{i}' for i in range(1, 9)],
                 [f'MO-QF{i}' for i in range(1, 5)], ['MO-SF1', 'MO-SF2'], ['MO-F']],
     'headings': ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'],
     'playoffs': ['MO-3P'], 'places': [['MO-F', 1], ['MO-3P', 3]]},
]

# ── Women's Open ──────────────────────────────────────────────────────────
E = "Women's Open"
add('WO-Q1', f'{E} · Qualifying', 'M34', N('Mahika Patwardhan'), N('Priyadarshini Sanyal'), (SAT, '5:30 PM', 1))
add('WO-Q2', f'{E} · Qualifying', 'M36', W('WO-Q1'), N('Anshu Priya'), (SAT, '6:00 PM', 1))
add('WO-Q3', f'{E} · Qualifying', 'M38', N('Jiah'), N('Srushti Deshmukh'), (SAT, '6:30 PM', 2))
w16 = [
    ('M43', N('Drishti Pawar'), W('WO-Q2'), '8:00 PM', 1),
    ('M34', N('Shruti Pravin'), N('Tisha Dakalia'), '5:30 PM', 2),
    ('M35', N('Miss Asshroya Ashok Kkumor'), N('Smriti'), '6:00 PM', 2),
    ('M37', N('Suchita Chandrakant Tangade'), N('Ruhi Lodha'), '6:30 PM', 1),
    ('M39', N('Dhwani'), N('Saloni Bhardwaj'), '7:00 PM', 1),
    ('M40', N('Reshma Parkeria'), N('Aashka Sojatia'), '7:00 PM', 2),
    ('M41', N('Pragya Jindal'), N('Ritika'), '7:30 PM', 2),
    ('M42', W('WO-Q3'), N('Kuhu Parakh'), '7:30 PM', 1),
]
for i, (disp, a, b, tm, c) in enumerate(w16, 1):
    add(f'WO-R16-{i}', f'{E} · Round of 16', disp, a, b, (SAT, tm, c))
for i, (disp, tm, c) in enumerate([('M48','2:00 PM',1),('M49','2:00 PM',2),('M50','2:30 PM',1),('M51','2:30 PM',2)], 1):
    add(f'WO-QF{i}', f'{E} · Quarterfinal', disp, W(f'WO-R16-{2*i-1}'), W(f'WO-R16-{2*i}'), (SUN, tm, c))
for i, (disp, tm, c) in enumerate([('M58','4:30 PM',1),('M59','4:30 PM',2)], 1):
    add(f'WO-SF{i}', f'{E} · Semifinal', disp, W(f'WO-QF{2*i-1}'), W(f'WO-QF{2*i}'), (SUN, tm, c))
add('WO-F', f'{E} · Final', 'M60', W('WO-SF1'), W('WO-SF2'), (SUN, '5:30 PM', 1))
add('WO-3P', f'{E} · 3rd Place', 'M64', L('WO-SF1'), L('WO-SF2'), (SUN, '6:30 PM', 2))
brackets += [
    {'id': 'wo-q', 'title': f"{E}: Qualifying", 'columns': [['WO-Q1', 'WO-Q2', 'WO-Q3']], 'headings': ['Qualifying'], 'playoffs': []},
    {'id': 'wo', 'title': E,
     'columns': [[f'WO-R16-{i}' for i in range(1, 9)], [f'WO-QF{i}' for i in range(1, 5)], ['WO-SF1', 'WO-SF2'], ['WO-F']],
     'headings': ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final'],
     'playoffs': ['WO-3P'], 'places': [['WO-F', 1], ['WO-3P', 3]]},
]

# ── Girls U-17 (Sunday only) ──────────────────────────────────────────────
E = 'Girls U-17'
g1 = [
    ('Bye', N('Drishti Pawar'), BYE, None, None),
    ('M44', N('Mahika Patwardhan'), N('Aumshi Paul'), '12:00 PM', 1),
    ('Bye', N('Ruhi Lodha'), BYE, None, None),
    ('Bye', BYE, N('Miss Asshroya Ashok Kkumor'), None, None),
]
for i, (disp, a, b, tm, c) in enumerate(g1, 1):
    add(f'GU-R1-{i}', f'{E} · Quarterfinal', disp, a, b, (SUN, tm, c) if tm else None)
add('GU-SF1', f'{E} · Semifinal', 'M45', N('Drishti Pawar'), W('GU-R1-2'), (SUN, '12:30 PM', 1))
add('GU-SF2', f'{E} · Semifinal', 'M46', N('Ruhi Lodha'), N('Miss Asshroya Ashok Kkumor'), (SUN, '12:00 PM', 2))
add('GU-F', f'{E} · Final', 'M47', W('GU-SF1'), W('GU-SF2'), (SUN, '1:00 PM', 1))
add('GU-3P', f'{E} · 3rd Place', 'M64', L('GU-SF1'), L('GU-SF2'), (SUN, '1:00 PM', 2))
brackets.append({'id': 'gu', 'title': E,
    'columns': [[f'GU-R1-{i}' for i in range(1, 5)], ['GU-SF1', 'GU-SF2'], ['GU-F']],
    'headings': ['Quarterfinals', 'Semifinals', 'Final'],
    'playoffs': ['GU-3P'], 'places': [['GU-F', 1], ['GU-3P', 3]]})

# ── Mixed Doubles ─────────────────────────────────────────────────────────
E = 'Mixed Doubles'
x16 = [
    ('Bye', N('Dishant/Kuhu'), BYE, None, None),
    # Revised sheet prints 12:00 PM Court 1; moved to 2:30 to free 12:00 for the men's qualifier.
    ('M24', N('Pranav Bhosale'), N('Pradeep/Yashvani'), '2:30 PM', 1),
    ('Bye', BYE, N('Ruhi/Shantanu'), None, None),
    ('M26', N('Jiah/Reyaan'), N('Deerav/Kiara'), '3:30 PM', 1),
    # Printed as M27 3:30 PM Court 1, which clashes with M26; it is a bye, so no slot.
    ('Bye', N('Drishti/Khuman'), BYE, None, None),
    ('M28', N('Priyadarshini/Nirmal'), N('Devankit/Sanya'), '4:00 PM', 1),
    ('M29', N('Shivang/Ritika'), N('Sagar/Reshma'), '4:00 PM', 2),
    ('Bye', BYE, N('Dhwani/Priyaan'), None, None),
]
for i, (disp, a, b, tm, c) in enumerate(x16, 1):
    add(f'XD-R16-{i}', f'{E} · Round of 16', disp, a, b, (SAT, tm, c, FIXED if i == 2 else 'printed') if tm else None)
xqf = [
    ('M30', N('Dishant/Kuhu'), W('XD-R16-2'), '4:30 PM', 1),
    ('M31', N('Ruhi/Shantanu'), W('XD-R16-4'), '4:30 PM', 2),
    ('M32', N('Drishti/Khuman'), W('XD-R16-6'), '5:00 PM', 1),
    ('M33', W('XD-R16-7'), N('Dhwani/Priyaan'), '5:00 PM', 2),
]
for i, (disp, a, b, tm, c) in enumerate(xqf, 1):
    add(f'XD-QF{i}', f'{E} · Quarterfinal', disp, a, b, (SAT, tm, c))
for i, (disp, tm, c) in enumerate([('M52','3:00 PM',1),('M53','3:00 PM',2)], 1):
    add(f'XD-SF{i}', f'{E} · Semifinal', disp, W(f'XD-QF{2*i-1}'), W(f'XD-QF{2*i}'), (SUN, tm, c))
add('XD-F', f'{E} · Final', 'M62', W('XD-SF1'), W('XD-SF2'), (SUN, '7:30 PM', 1))
add('XD-3P', f'{E} · 3rd Place', 'M65', L('XD-SF1'), L('XD-SF2'), (SUN, '7:00 PM', 2))
brackets.append({'id': 'xd', 'title': E,
    'columns': [[f'XD-R16-{i}' for i in range(1, 9)], [f'XD-QF{i}' for i in range(1, 5)], ['XD-SF1', 'XD-SF2'], ['XD-F']],
    'headings': ['Round of 16', 'Quarterfinals', 'Semifinals', 'Final'],
    'playoffs': ['XD-3P'], 'places': [['XD-F', 1], ['XD-3P', 3]]})

# ── Match numbers: chronological (day, time, court) across all events ────
# The revised sheet reused M04, M08, M09 and M15; numbering in playing order
# makes every number unique. Byes keep 'Bye'.
def _key(mid):
    s = schedule[mid]
    h, m = map(int, s['time'][:-3].split(':'))
    h = h % 12 + (12 if s['time'].endswith('PM') else 0)
    return ([SAT, SUN].index(s['day']), h * 60 + m, s['court'])
for n, mid in enumerate(sorted(schedule, key=_key), 1):
    matches[mid]['display'] = f'M{n:02d}'

# ── Routes, derived from who consumes each match ──────────────────────────
event_of = {'MO': "Men's Open", 'WO': "Women's Open", 'GU': 'Girls U-17', 'XD': 'Mixed Doubles'}
place = {p[0]: p[1] for b in brackets for p in b.get('places', [])}
def ordinal(n): return {1: '1st', 2: '2nd', 3: '3rd', 4: '4th'}[n]
for mid, m in matches.items():
    ev = event_of[mid[:2]]
    if mid in place:
        r = place[mid]
        m['route'] = f'Decides {ev} {ordinal(r)} and {ordinal(r + 1)}'
        continue
    sides = [m['a'], m['b']]
    if BYE in sides:
        who = next(s[1] for s in sides if s != BYE)
        m['route'] = f'Bye: {who} advances'
        continue
    def dest(kind):
        for k, n in matches.items():
            if [kind, mid] in (n['a'], n['b']):
                return n['display']
        return None
    w, l = dest('W'), dest('L')
    m['route'] = f'Winner → {w}' + (f' · Loser → {l}' if l else '')

out = {
    '__note': 'FSC 2.0 (FLAME Squash Open) draw, generated by scripts/fsc_seed.py from data/FSC2.0.pdf (revised sheet, 21 Nov; match numbers renumbered chronologically). Seeds the fsc-2026 draw in Supabase and is the read-only fallback for /fsc until that migration is pushed. Once live, edit the draw on the page, not here.',
    'drawId': DRAW_ID,
    'brackets': brackets,
    'draw': {'matches': matches, 'schedule': schedule},
}
p = Path(__file__).resolve().parent.parent / 'data/fsc/fsc-2026.json'
p.write_text(json.dumps(out, indent=2, ensure_ascii=False) + '\n')
print(f'{len(matches)} matches, {len(schedule)} scheduled -> {p}')
