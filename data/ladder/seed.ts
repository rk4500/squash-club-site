/**
 * SEED ONLY — the running site does not read this file.
 *
 * The draw lives in the ladder_matches table so the committee can correct a
 * name or a court time without a deploy. This is the source the seeding
 * migration was generated from, kept in version control so a mangled table can
 * be rebuilt from something reviewable.
 *
 * Editing this changes nothing on the site. To change the live draw, edit it
 * on the bracket page while signed in, or write a migration.
 */

import type { Match, Slot } from './draw'

export const MATCHES: Record<string, Match> = {
    "M1": {
      "label": "Round of 32",
      "a": [
        "name",
        "Priyaan Thakker"
      ],
      "b": [
        "name",
        "Bhagya Patel"
      ],
      "display": "R32-1",
      "route": "Winner → R16-1 · Loser → 17–20 Q1"
    },
    "M2": {
      "label": "Round of 32",
      "a": [
        "name",
        "Aman"
      ],
      "b": [
        "name",
        "Aum Parikh"
      ],
      "display": "R32-2",
      "route": "Winner → R16-1 · Loser → 17–20 Q1"
    },
    "M3": {
      "label": "Round of 32",
      "a": [
        "name",
        "Pragya"
      ],
      "b": [
        "name",
        "Siraj Singh"
      ],
      "display": "R32-3",
      "route": "Winner → R16-2 · Loser → 17–20 Q2"
    },
    "M4": {
      "label": "Round of 32",
      "a": [
        "name",
        "Shaurya Mahtani"
      ],
      "b": [
        "name",
        "Shahaan"
      ],
      "display": "R32-4",
      "route": "Winner → R16-2 · Loser → 17–20 Q2"
    },
    "M5": {
      "label": "Round of 32",
      "a": [
        "name",
        "Japmann"
      ],
      "b": [
        "name",
        "Vihaan Kakkar"
      ],
      "display": "R32-5",
      "route": "Winner → R16-3 · Loser → 17–20 Q3"
    },
    "M6": {
      "label": "Round of 32",
      "a": [
        "name",
        "Atharva"
      ],
      "b": [
        "name",
        "Jiah"
      ],
      "display": "R32-6",
      "route": "Winner → R16-3 · Loser → 17–20 Q3"
    },
    "M7": {
      "label": "Round of 32",
      "a": [
        "name",
        "Neev K Shah"
      ],
      "b": [
        "name",
        "Nikita"
      ],
      "display": "R32-7",
      "route": "Winner → R16-4 · Loser → 17–20 Q4"
    },
    "M8": {
      "label": "Round of 32",
      "a": [
        "name",
        "Reyaan"
      ],
      "b": [
        "name",
        "Maanvir"
      ],
      "display": "R32-8",
      "route": "Winner → R16-4 · Loser → 17–20 Q4"
    },
    "M9": {
      "label": "Round of 32",
      "a": [
        "name",
        "Moksh"
      ],
      "b": [
        "name",
        "Idhant Katoch"
      ],
      "display": "R32-9",
      "route": "Winner → R16-5 · Loser → 17–20 Q5"
    },
    "M10": {
      "label": "Round of 32",
      "a": [
        "name",
        "Hriday"
      ],
      "b": [
        "name",
        "Aliqyaan"
      ],
      "display": "R32-10",
      "route": "Winner → R16-5 · Loser → 17–20 Q5"
    },
    "M11": {
      "label": "Round of 32",
      "a": [
        "name",
        "Hunar Bedi"
      ],
      "b": [
        "name",
        "Adhya"
      ],
      "display": "R32-11",
      "route": "Winner → R16-6 · Loser → 17–20 Q6"
    },
    "M12": {
      "label": "Round of 32",
      "a": [
        "name",
        "Om Muslunkar"
      ],
      "b": [
        "name",
        "Dhwani"
      ],
      "display": "R32-12",
      "route": "Winner → R16-6 · Loser → 17–20 Q6"
    },
    "M13": {
      "label": "Round of 32",
      "a": [
        "name",
        "Rudra Krishna"
      ],
      "b": [
        "name",
        "Darsh Agarwal"
      ],
      "display": "R32-13",
      "route": "Winner → R16-7 · Loser → 17–20 Q7"
    },
    "M14": {
      "label": "Round of 32",
      "a": [
        "name",
        "Riya"
      ],
      "b": [
        "name",
        "Bhagya Popat"
      ],
      "display": "R32-14",
      "route": "Winner → R16-7 · Loser → 17–20 Q7"
    },
    "M15": {
      "label": "Round of 32",
      "a": [
        "name",
        "M.S.S Vasista"
      ],
      "b": [
        "name",
        "Rushil"
      ],
      "display": "R32-15",
      "route": "Winner → R16-8 · Loser → 17–20 Q8"
    },
    "M16": {
      "label": "Round of 32",
      "a": [
        "name",
        "Virat Shah"
      ],
      "b": [
        "name",
        "Huzaifa"
      ],
      "display": "R32-16",
      "route": "Winner → R16-8 · Loser → 17–20 Q8"
    },
    "M17": {
      "label": "Round of 16",
      "a": [
        "W",
        "M1"
      ],
      "b": [
        "W",
        "M2"
      ],
      "display": "R16-1",
      "route": "Winner → QF-1 · Loser → 9–16 Qualifier-1"
    },
    "M18": {
      "label": "Round of 16",
      "a": [
        "W",
        "M3"
      ],
      "b": [
        "W",
        "M4"
      ],
      "display": "R16-2",
      "route": "Winner → QF-1 · Loser → 9–16 Qualifier-2"
    },
    "M19": {
      "label": "Round of 16",
      "a": [
        "W",
        "M5"
      ],
      "b": [
        "W",
        "M6"
      ],
      "display": "R16-3",
      "route": "Winner → QF-2 · Loser → 9–16 Qualifier-3"
    },
    "M20": {
      "label": "Round of 16",
      "a": [
        "W",
        "M7"
      ],
      "b": [
        "W",
        "M8"
      ],
      "display": "R16-4",
      "route": "Winner → QF-2 · Loser → 9–16 Qualifier-4"
    },
    "M21": {
      "label": "Round of 16",
      "a": [
        "W",
        "M9"
      ],
      "b": [
        "W",
        "M10"
      ],
      "display": "R16-5",
      "route": "Winner → QF-3 · Loser → 9–16 Qualifier-4"
    },
    "M22": {
      "label": "Round of 16",
      "a": [
        "W",
        "M11"
      ],
      "b": [
        "W",
        "M12"
      ],
      "display": "R16-6",
      "route": "Winner → QF-3 · Loser → 9–16 Qualifier-3"
    },
    "M23": {
      "label": "Round of 16",
      "a": [
        "W",
        "M13"
      ],
      "b": [
        "W",
        "M14"
      ],
      "display": "R16-7",
      "route": "Winner → QF-4 · Loser → 9–16 Qualifier-2"
    },
    "M24": {
      "label": "Round of 16",
      "a": [
        "W",
        "M15"
      ],
      "b": [
        "W",
        "M16"
      ],
      "display": "R16-8",
      "route": "Winner → QF-4 · Loser → 9–16 Qualifier-1"
    },
    "QF1": {
      "label": "Quarterfinal",
      "a": [
        "W",
        "M17"
      ],
      "b": [
        "W",
        "M18"
      ],
      "display": "QF-1",
      "route": "Winner → SF-1 · Loser → 5–8 SF-1"
    },
    "QF2": {
      "label": "Quarterfinal",
      "a": [
        "W",
        "M19"
      ],
      "b": [
        "W",
        "M20"
      ],
      "display": "QF-2",
      "route": "Winner → SF-1 · Loser → 5–8 SF-1"
    },
    "QF3": {
      "label": "Quarterfinal",
      "a": [
        "W",
        "M21"
      ],
      "b": [
        "W",
        "M22"
      ],
      "display": "QF-3",
      "route": "Winner → SF-2 · Loser → 5–8 SF-2"
    },
    "QF4": {
      "label": "Quarterfinal",
      "a": [
        "W",
        "M23"
      ],
      "b": [
        "W",
        "M24"
      ],
      "display": "QF-4",
      "route": "Winner → SF-2 · Loser → 5–8 SF-2"
    },
    "SF1": {
      "label": "Semifinal",
      "a": [
        "W",
        "QF1"
      ],
      "b": [
        "W",
        "QF2"
      ],
      "display": "SF-1",
      "route": "Winner → FINAL · Loser → 3rd Place"
    },
    "SF2": {
      "label": "Semifinal",
      "a": [
        "W",
        "QF3"
      ],
      "b": [
        "W",
        "QF4"
      ],
      "display": "SF-2",
      "route": "Winner → FINAL · Loser → 3rd Place"
    },
    "F": {
      "label": "Final",
      "a": [
        "W",
        "SF1"
      ],
      "b": [
        "W",
        "SF2"
      ],
      "display": "FINAL",
      "route": "Decides 1st / 2nd"
    },
    "P34": {
      "label": "3rd/4th Playoff",
      "a": [
        "L",
        "SF1"
      ],
      "b": [
        "L",
        "SF2"
      ],
      "display": "3rd Place",
      "route": "Decides 3rd / 4th"
    },
    "P5_1": {
      "label": "Ranks 5–8",
      "a": [
        "L",
        "QF1"
      ],
      "b": [
        "L",
        "QF2"
      ],
      "display": "5–8 SF-1",
      "route": "Winner → 5–6 Final · Loser → 7–8 Match"
    },
    "P5_2": {
      "label": "Ranks 5–8",
      "a": [
        "L",
        "QF3"
      ],
      "b": [
        "L",
        "QF4"
      ],
      "display": "5–8 SF-2",
      "route": "Winner → 5–6 Final · Loser → 7–8 Match"
    },
    "P5F": {
      "label": "Ranks 5–6",
      "a": [
        "W",
        "P5_1"
      ],
      "b": [
        "W",
        "P5_2"
      ],
      "display": "5–6 Final",
      "route": "Decides 5th / 6th"
    },
    "P5_34": {
      "label": "Ranks 7–8",
      "a": [
        "L",
        "P5_1"
      ],
      "b": [
        "L",
        "P5_2"
      ],
      "display": "7–8 Match",
      "route": "Decides 7th / 8th"
    },
    "P9_1": {
      "label": "Ranks 9–16",
      "a": [
        "L",
        "M17"
      ],
      "b": [
        "L",
        "M24"
      ],
      "display": "9–16 Qualifier-1",
      "route": "Winner → 9–12 SF-1 · Loser → 13–16 SF-1"
    },
    "P9_2": {
      "label": "Ranks 9–16",
      "a": [
        "L",
        "M18"
      ],
      "b": [
        "L",
        "M23"
      ],
      "display": "9–16 Qualifier-2",
      "route": "Winner → 9–12 SF-2 · Loser → 13–16 SF-2"
    },
    "P9_3": {
      "label": "Ranks 9–16",
      "a": [
        "L",
        "M19"
      ],
      "b": [
        "L",
        "M22"
      ],
      "display": "9–16 Qualifier-3",
      "route": "Winner → 9–12 SF-2 · Loser → 13–16 SF-2"
    },
    "P9_4": {
      "label": "Ranks 9–16",
      "a": [
        "L",
        "M20"
      ],
      "b": [
        "L",
        "M21"
      ],
      "display": "9–16 Qualifier-4",
      "route": "Winner → 9–12 SF-1 · Loser → 13–16 SF-1"
    },
    "P9SF1": {
      "label": "Ranks 9–12",
      "a": [
        "W",
        "P9_1"
      ],
      "b": [
        "W",
        "P9_4"
      ],
      "display": "9–12 SF-1",
      "route": "Winner → 9–10 Final · Loser → 11–12 Match"
    },
    "P9SF2": {
      "label": "Ranks 9–12",
      "a": [
        "W",
        "P9_2"
      ],
      "b": [
        "W",
        "P9_3"
      ],
      "display": "9–12 SF-2",
      "route": "Winner → 9–10 Final · Loser → 11–12 Match"
    },
    "P9F": {
      "label": "Ranks 9–10",
      "a": [
        "W",
        "P9SF1"
      ],
      "b": [
        "W",
        "P9SF2"
      ],
      "display": "9–10 Final",
      "route": "Decides 9th / 10th"
    },
    "P9_34": {
      "label": "Ranks 11–12",
      "a": [
        "L",
        "P9SF1"
      ],
      "b": [
        "L",
        "P9SF2"
      ],
      "display": "11–12 Match",
      "route": "Decides 11th / 12th"
    },
    "P13_1": {
      "label": "Ranks 13–16",
      "a": [
        "L",
        "P9_1"
      ],
      "b": [
        "L",
        "P9_4"
      ],
      "display": "13–16 SF-1",
      "route": "Winner → 13–14 Final · Loser → 15–16 Match"
    },
    "P13_2": {
      "label": "Ranks 13–16",
      "a": [
        "L",
        "P9_2"
      ],
      "b": [
        "L",
        "P9_3"
      ],
      "display": "13–16 SF-2",
      "route": "Winner → 13–14 Final · Loser → 15–16 Match"
    },
    "P13F": {
      "label": "Ranks 13–14",
      "a": [
        "W",
        "P13_1"
      ],
      "b": [
        "W",
        "P13_2"
      ],
      "display": "13–14 Final",
      "route": "Decides 13th / 14th"
    },
    "P13_34": {
      "label": "Ranks 15–16",
      "a": [
        "L",
        "P13_1"
      ],
      "b": [
        "L",
        "P13_2"
      ],
      "display": "15–16 Match",
      "route": "Decides 15th / 16th"
    },
    "Q1": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M1"
      ],
      "b": [
        "L",
        "M2"
      ],
      "display": "17–20 Q1",
      "route": "Winner → 17–20 R2-1 · Loser → unordered 21–32 pool"
    },
    "Q2": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M3"
      ],
      "b": [
        "L",
        "M4"
      ],
      "display": "17–20 Q2",
      "route": "Winner → 17–20 R2-1 · Loser → unordered 21–32 pool"
    },
    "Q3": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M5"
      ],
      "b": [
        "L",
        "M6"
      ],
      "display": "17–20 Q3",
      "route": "Winner → 17–20 R2-2 · Loser → unordered 21–32 pool"
    },
    "Q4": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M7"
      ],
      "b": [
        "L",
        "M8"
      ],
      "display": "17–20 Q4",
      "route": "Winner → 17–20 R2-2 · Loser → unordered 21–32 pool"
    },
    "Q5": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M9"
      ],
      "b": [
        "L",
        "M10"
      ],
      "display": "17–20 Q5",
      "route": "Winner → 17–20 R2-3 · Loser → unordered 21–32 pool"
    },
    "Q6": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M11"
      ],
      "b": [
        "L",
        "M12"
      ],
      "display": "17–20 Q6",
      "route": "Winner → 17–20 R2-3 · Loser → unordered 21–32 pool"
    },
    "Q7": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M13"
      ],
      "b": [
        "L",
        "M14"
      ],
      "display": "17–20 Q7",
      "route": "Winner → 17–20 R2-4 · Loser → unordered 21–32 pool"
    },
    "Q8": {
      "label": "17–20 Qualifier R1",
      "a": [
        "L",
        "M15"
      ],
      "b": [
        "L",
        "M16"
      ],
      "display": "17–20 Q8",
      "route": "Winner → 17–20 R2-4 · Loser → unordered 21–32 pool"
    },
    "Q9": {
      "label": "17–20 Qualifier R2",
      "a": [
        "W",
        "Q1"
      ],
      "b": [
        "W",
        "Q2"
      ],
      "display": "17–20 R2-1",
      "route": "Winner → 17–20 SF-1 · Loser → unordered 21–32 pool"
    },
    "Q10": {
      "label": "17–20 Qualifier R2",
      "a": [
        "W",
        "Q3"
      ],
      "b": [
        "W",
        "Q4"
      ],
      "display": "17–20 R2-2",
      "route": "Winner → 17–20 SF-1 · Loser → unordered 21–32 pool"
    },
    "Q11": {
      "label": "17–20 Qualifier R2",
      "a": [
        "W",
        "Q5"
      ],
      "b": [
        "W",
        "Q6"
      ],
      "display": "17–20 R2-3",
      "route": "Winner → 17–20 SF-2 · Loser → unordered 21–32 pool"
    },
    "Q12": {
      "label": "17–20 Qualifier R2",
      "a": [
        "W",
        "Q7"
      ],
      "b": [
        "W",
        "Q8"
      ],
      "display": "17–20 R2-4",
      "route": "Winner → 17–20 SF-2 · Loser → unordered 21–32 pool"
    },
    "Q13": {
      "label": "17–20 Semifinal",
      "a": [
        "W",
        "Q9"
      ],
      "b": [
        "W",
        "Q10"
      ],
      "display": "17–20 SF-1",
      "route": "Winner → 17–18 Final · Loser → 19–20 Match"
    },
    "Q14": {
      "label": "17–20 Semifinal",
      "a": [
        "W",
        "Q11"
      ],
      "b": [
        "W",
        "Q12"
      ],
      "display": "17–20 SF-2",
      "route": "Winner → 17–18 Final · Loser → 19–20 Match"
    },
    "QFIN": {
      "label": "Ranks 17–18",
      "a": [
        "W",
        "Q13"
      ],
      "b": [
        "W",
        "Q14"
      ],
      "display": "17–18 Final",
      "route": "Decides 17th / 18th"
    },
    "Q34": {
      "label": "Ranks 19–20",
      "a": [
        "L",
        "Q13"
      ],
      "b": [
        "L",
        "Q14"
      ],
      "display": "19–20 Match",
      "route": "Decides 19th / 20th"
    }
  }

export const SCHEDULE: Record<string, Slot> = {
    "M13": {
      "day": "Saturday",
      "time": "2:00 PM",
      "court": "Court 1",
      "src": "fixed"
    },
    "M14": {
      "day": "Saturday",
      "time": "2:00 PM",
      "court": "Court 2",
      "src": "fixed"
    },
    "M15": {
      "day": "Saturday",
      "time": "2:30 PM",
      "court": "Court 1",
      "src": "fixed"
    },
    "M23": {
      "day": "Saturday",
      "time": "2:30 PM",
      "court": "Court 2",
      "src": "fixed"
    },
    "M16": {
      "day": "Saturday",
      "time": "3:00 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M24": {
      "day": "Saturday",
      "time": "3:40 PM",
      "court": "Court 1",
      "src": "fixed"
    },
    "M1": {
      "day": "Saturday",
      "time": "4:00 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M2": {
      "day": "Saturday",
      "time": "4:00 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M3": {
      "day": "Saturday",
      "time": "4:20 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M4": {
      "day": "Saturday",
      "time": "4:20 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M5": {
      "day": "Saturday",
      "time": "4:40 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M6": {
      "day": "Saturday",
      "time": "4:40 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M7": {
      "day": "Saturday",
      "time": "5:00 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M8": {
      "day": "Saturday",
      "time": "5:00 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M9": {
      "day": "Saturday",
      "time": "5:20 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M10": {
      "day": "Saturday",
      "time": "5:20 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M11": {
      "day": "Saturday",
      "time": "5:40 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M12": {
      "day": "Saturday",
      "time": "5:40 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M17": {
      "day": "Saturday",
      "time": "6:00 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M18": {
      "day": "Saturday",
      "time": "6:00 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M20": {
      "day": "Saturday",
      "time": "6:20 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M19": {
      "day": "Saturday",
      "time": "6:20 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "M21": {
      "day": "Saturday",
      "time": "6:40 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "M22": {
      "day": "Saturday",
      "time": "6:40 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "Q1": {
      "day": "Saturday",
      "time": "7:00 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "Q2": {
      "day": "Saturday",
      "time": "7:00 PM",
      "court": "Court 2",
      "src": "fixed"
    },
    "Q3": {
      "day": "Saturday",
      "time": "7:20 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "Q4": {
      "day": "Saturday",
      "time": "7:20 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "Q5": {
      "day": "Saturday",
      "time": "7:40 PM",
      "court": "Court 1",
      "src": "fixed"
    },
    "Q6": {
      "day": "Saturday",
      "time": "7:40 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "Q8": {
      "day": "Saturday",
      "time": "8:00 PM",
      "court": "Court 1",
      "src": "printed"
    },
    "Q7": {
      "day": "Saturday",
      "time": "8:00 PM",
      "court": "Court 2",
      "src": "printed"
    },
    "QF1": {
      "day": "Saturday",
      "time": "8:20 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "QF2": {
      "day": "Saturday",
      "time": "8:20 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "QF3": {
      "day": "Saturday",
      "time": "8:35 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "QF4": {
      "day": "Saturday",
      "time": "8:35 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P9_1": {
      "day": "Saturday",
      "time": "8:50 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P9_2": {
      "day": "Saturday",
      "time": "8:50 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P9_3": {
      "day": "Saturday",
      "time": "9:05 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P9_4": {
      "day": "Saturday",
      "time": "9:05 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "Q9": {
      "day": "Saturday",
      "time": "9:20 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "Q10": {
      "day": "Saturday",
      "time": "9:20 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "Q11": {
      "day": "Sunday",
      "time": "6:15 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "Q12": {
      "day": "Sunday",
      "time": "6:15 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "SF1": {
      "day": "Sunday",
      "time": "6:30 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "SF2": {
      "day": "Sunday",
      "time": "6:30 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P5_1": {
      "day": "Sunday",
      "time": "6:45 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P5_2": {
      "day": "Sunday",
      "time": "6:45 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P9SF1": {
      "day": "Sunday",
      "time": "7:00 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P9SF2": {
      "day": "Sunday",
      "time": "7:00 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P13_1": {
      "day": "Sunday",
      "time": "7:15 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P13_2": {
      "day": "Sunday",
      "time": "7:15 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "Q13": {
      "day": "Sunday",
      "time": "7:30 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "Q14": {
      "day": "Sunday",
      "time": "7:30 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "F": {
      "day": "Sunday",
      "time": "7:45 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P34": {
      "day": "Sunday",
      "time": "7:45 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P5F": {
      "day": "Sunday",
      "time": "8:00 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P5_34": {
      "day": "Sunday",
      "time": "8:00 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P9F": {
      "day": "Sunday",
      "time": "8:15 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P9_34": {
      "day": "Sunday",
      "time": "8:15 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "P13F": {
      "day": "Sunday",
      "time": "8:30 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "P13_34": {
      "day": "Sunday",
      "time": "8:30 PM",
      "court": "Court 2",
      "src": "planned"
    },
    "QFIN": {
      "day": "Sunday",
      "time": "8:45 PM",
      "court": "Court 1",
      "src": "planned"
    },
    "Q34": {
      "day": "Sunday",
      "time": "8:45 PM",
      "court": "Court 2",
      "src": "planned"
    }
  }
