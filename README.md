# FLAME Squash Club Website

Official website for FLAME Squash Club, FLAME University Pune.

Built with **Next.js 14 + Tailwind CSS**, deployed on **Vercel**.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd /Users/dhwanibalchandani/Developer/squash_website
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
squash_website/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home page
│   ├── events/page.tsx     # Events & Tournaments
│   ├── committee/page.tsx  # Executive + Core Committee
│   ├── ladder/page.tsx     # Squash Ladder Rankings
│   ├── team/page.tsx       # Team Players & Bios
│   ├── gallery/page.tsx    # Photo Gallery
│   └── contact/page.tsx    # Contact & Join
├── components/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── data/                   # ← Edit these to update content
│   ├── committee.json      # Exec + CC heads + CC members
│   ├── events.json         # All events with details
│   ├── ladder.json         # Top 20 ladder rankings
│   └── team.json           # Team player bios
└── public/
    └── logo.png            # ← Drop your logo here
```

---

## 🖼️ Adding the Logo

Copy your logo file to:
```
public/logo.png
```

---

## ✏️ Updating Content

All content lives in `data/` as JSON files — no code changes needed.

### Update Ladder Rankings → `data/ladder.json`
```json
{
  "lastUpdated": "March 2026",
  "edition": "Edition 3",
  "rankings": [
    { "rank": 1, "name": "Player Name", "year": "2nd Year", "wins": 10, "losses": 2, "trend": "up" }
  ]
}
```
`trend` can be `"up"`, `"down"`, or `"stable"`

### Add a New Event → `data/events.json`
```json
{
  "id": 21,
  "name": "New Event Name",
  "category": "Intra-College",
  "date": "2026-09-01",
  "description": "Event description here.",
  "budget": "₹500",
  "highlight": "Key highlight text"
}
```
Categories: `"Intra-College"`, `"Inter-College"`, `"Collaboration"`

### Add a Team Player → `data/team.json`
```json
{
  "name": "Player Name",
  "role": "Team Player",
  "year": "1st Year",
  "gender": "male",
  "bio": "Short bio here.",
  "achievements": ["Achievement 1", "Achievement 2"],
  "photo": ""
}
```

### Update Committee → `data/committee.json`
Three sections: `executive`, `heads`, `members`

---

## 🖼️ Gallery

1. Create folder: `public/gallery/`
2. Drop images there
3. Update `data/gallery.json` (create this file):
```json
[
  { "src": "/gallery/photo1.jpg", "caption": "FSC Championship 2025", "category": "FLAME Squash Championship" }
]
```

---

## 🌐 Deploying to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm i -g vercel
vercel
```
Follow the prompts. Your site will be live in ~2 minutes.

### Option B — GitHub + Vercel Dashboard
1. Push to GitHub: `git init && git add . && git commit -m "init" && git remote add origin YOUR_REPO_URL && git push`
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Vercel auto-detects Next.js — just click **Deploy**

---

## 🎨 Brand Colours

| Name | Hex |
|------|-----|
| Navy Dark | `#040d18` |
| Navy Mid | `#0a1628` |
| Gold | `#f5a800` |
| Gold Light | `#ffc233` |

---

## 📞 Contact Links to Update

In `components/Footer.tsx` and `app/contact/page.tsx`:
- Instagram handle: `@flamesquashclub`
- Email: `squashclub@flame.edu.in`  
- WhatsApp: Replace `919999999999` with the actual number

---

Built with ❤️ for FLAME Squash Club · 2025–26
