"""
Link-preview cards (Open Graph, 1200x630) for every page, in one style:
club logo, gold eyebrow, two-tone Bebas title, one line of detail, and a
faint outlined word behind. Output: public/og-*.jpg.

Fonts are the site's own (Bebas Neue, Barlow Condensed; both SIL OFL) and
live in scripts/og-fonts so this runs without anything installed.

Run: python3 scripts/og_cards.py      (needs ImageMagick 7: `magick`)
After changing a card, share the link with ?v=2 to see it: chat apps cache
previews per URL.
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'scripts/og-fonts'
BEBAS = FONTS / 'BebasNeue-Regular.ttf'
BARLOW = FONTS / 'BarlowCondensed-Medium.ttf'
LOGO = ROOT / 'public/logo.webp'
GOLD, INK = '#f5a800', '#05080f'

# file, eyebrow, title (white, gold), detail line, background word
CARDS = [
    ('og-image.jpg', 'FLAME University · Pune · Est. 2024', ('FLAME SQUASH', 'CLUB'),
     'Ladder · Team · Events · Season 2026–27', 'FSC'),
    ('og-fsc.jpg', 'FLAME Squash Championship', ('FSC', '2.0'),
     '21–22 NOV 2026  ·  LIVE DRAWS, RESULTS & COURT TIMES', 'FSC'),
    ('og-ladder.jpg', 'Squash Ladder 2026–27', ('LADDER', 'RANKINGS'),
     'The top 20 · Season standings', 'RANK'),
    ('og-bracket.jpg', 'Squash Ladder 2026–27 · Final', ('LADDER', 'BRACKET'),
     '32 players · 64 matches · Final results', '32'),
    ('og-events.jpg', 'Season 2026–27', ('CLUB', 'EVENTS'),
     'Tournaments · Tryouts · Collaborations', 'EVENTS'),
    ('og-team.jpg', 'FLAME University', ('SQUASH', 'TEAM'),
     "Meet the club's roster", 'TEAM'),
    ('og-committee.jpg', 'Season 2026–27', ('THE', 'COMMITTEE'),
     'Executive committee and core heads', 'EC'),
    ('og-gallery.jpg', 'FLAME Squash Club', ('PHOTO', 'GALLERY'),
     'Events, tournaments and tryouts', 'PHOTOS'),
    ('og-contact.jpg', 'FLAME Squash Club', ('JOIN', 'THE CLUB'),
     'Tryouts, Instagram and how to reach us', 'JOIN'),
]

TITLE_PT, TITLE_MAX_W, LEFT, BASELINE, GAP = 210, 1040, 80, 482, 40

def run(*args):
    subprocess.run(['magick', *map(str, args)], check=True)

def width(text, pt):
    r = subprocess.run(['magick', '-font', str(BEBAS), '-pointsize', str(pt), '-kerning', '4',
                        f'label:{text}', '-format', '%w', 'info:'],
                       check=True, capture_output=True, text=True)
    return int(r.stdout)

def card(out, eyebrow, title, detail, bg):
    # Shrink the title to fit, then draw both words on one fixed baseline
    # (+gravity: -annotate y is the baseline), so descenders like the Q in
    # SQUASH cannot lift a title into the eyebrow.
    w0, w1 = width(title[0], TITLE_PT), width(title[1], TITLE_PT)
    pt = min(TITLE_PT, TITLE_PT * TITLE_MAX_W / (w0 + GAP + w1))
    x1 = LEFT + w0 * pt / TITLE_PT + GAP * pt / TITLE_PT
    run('-size', '1200x630', f'xc:{INK}',
        '(', '-size', '1200x630', 'radial-gradient:rgba(245,168,0,0.22)-rgba(5,8,15,0)', ')',
        '-compose', 'screen', '-composite', '-compose', 'over',
        '-fill', 'rgba(245,168,0,0.10)', '-draw', 'rectangle 0,0 1200,6',
        # Outlined background word, bleeding off the right edge.
        '-font', BEBAS, '-fill', 'none', '-stroke', 'rgba(245,168,0,0.10)', '-strokewidth', 2,
        '-pointsize', 520, '-gravity', 'east', '-annotate', '+-30+40', bg, '-stroke', 'none',
        '(', LOGO, '-resize', 'x170', ')', '-gravity', 'northwest', '-geometry', f'+{LEFT}+56', '-composite',
        '-font', BARLOW, '-fill', GOLD, '-pointsize', 30, '-kerning', 6,
        '-annotate', f'+{LEFT}+262', eyebrow.upper(),
        '+gravity', '-font', BEBAS, '-kerning', 4, '-pointsize', f'{pt:.1f}',
        '-fill', 'white', '-annotate', f'+{LEFT - 6}+{BASELINE}', title[0],
        '-fill', GOLD, '-annotate', f'+{x1 - 6:.0f}+{BASELINE}', title[1],
        '-gravity', 'northwest',
        '-fill', GOLD, '-draw', f'rectangle {LEFT},520 {LEFT + 60},523',
        '-font', BARLOW, '-kerning', 3, '-pointsize', 34, '-fill', 'rgba(255,255,255,0.75)',
        '-annotate', f'+{LEFT}+540', detail.upper(),
        '-quality', 86, ROOT / 'public' / out)

for c in CARDS:
    card(*c)
    print('wrote public/' + c[0])
