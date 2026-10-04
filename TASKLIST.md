# ðŸ“ SerboLingo â€” Active Task Tracker

> [!IMPORTANT]
> This file tracks **what we're actively working on RIGHT NOW**.  
> For the full 22-priority roadmap, see [`reminders.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/reminders.md).  
> For the categorized file index, see [`manifest.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/manifest.md).

**Last Updated**: September 27, 2026

---

## ðŸ—ï¸ Infrastructure Setup

- [x] Create `.antigravity/` directory with README
- [x] Create `manifest.md` â€” categorized source file index
- [x] Create `TASKLIST.md` â€” this file

---

## âœ… Completed Features (Verified on Disk)

### Core Architecture
- [x] Pure Vanilla SPA (`index.html` â€” 12 views toggled via classList)
- [x] Core engine (`app.js` â€” state, auth, nav, Omni-Bar, gamification)
- [x] IndexedDB dictionary (`db.js` + `seed-data.js` â€” ~3,500 entries)
- [x] Tailwind CSS + custom animations (`styles.css`)
- [x] Dark mode support (Tailwind `dark:` classes)

### Learning Modules
- [x] Skill Tree â€” 15 tiers, 5-crown system, prerequisite logic (`skill-tree.js`)
- [x] Question Engine â€” 12+ formats incl. speech, canvas, drag-drop (`question-engine.js`)
- [x] Alphabet data â€” 30-letter matrix, Latin + Cyrillic (`alphabet-data.js`)
- [x] Cloze fill-in-the-blank trainer (`cloze.js`)
- [x] Serbian slang module â€” Belgrade/Southern/Kafana (`slang.js`)
- [x] Pitch-accent trainer â€” 4 accents + Web Audio detection (`pitch-accent.js`)
- [x] Interactive branching stories (`stories.js`)

### Entertainment & Media
- [x] Arcade â€” 22+ minigames + Bot opponent mode (`arcade.js`)
- [x] AI Roleplay â€” 50+ scenarios, free chat, grammar correction (`roleplay.js`)
- [x] Explore Hub â€” 4-tab media browser + YouTube API (`explore-hub.js`)
- [x] Karaoke â€” bilingual reader + speech word-tracking (`karaoke.js`)
- [x] Rhythm â€” music lyrics + YouTube sync scoring (`rhythm.js`)

### AI & Audio
- [x] Gemini API integration â€” model cascading (2.5-flash â†’ 1.5-flash)
- [x] Multi-tier TTS cascade (Cloud AI â†’ Native â†’ Google Translate)
- [x] Speech recognition (pronunciation, karaoke, spelling)
- [x] Graceful degradation when offline / no API keys

### Gamification & Stats
- [x] XP / Streak / Hearts / Crowns system
- [x] Daily quests container
- [x] Stats view â€” Chart.js bar + 6-axis radar
- [x] Confetti celebrations + toast notifications
- [x] Badge/achievement system
- [x] Bidirectional learning toggle (SR â†” EN)
- [x] Add-to-Flashcards from Omni-Bar (â˜… star button)

---

## ðŸ“‹ Upcoming Work Queue

> [!NOTE]
> Items are ordered by priority from `reminders.md`.  
> Many "TODO" items below already have **engines built** â€” they need **content expansion**, not fresh code.  
> Items marked ðŸ”§ = engine exists, needs content. Items marked ðŸ†• = needs new code.

### ðŸ”´ High Priority â€” Content & Curriculum Expansion

| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P1.1 | Expand vocabulary to 5,000+ words | ðŸ”§ Content | `seed-data.js` | â¬œ TODO |
| P1.2 | Add phonetic helpers + gender flags to all entries | ðŸ”§ Content | `seed-data.js` | â¬œ TODO |
| P1.3 | Add bilingual example sentences to all entries | ðŸ”§ Content | `seed-data.js` | â¬œ TODO |
| P2.1 | Expand skill tree to 60+ nodes | ðŸ”§ Content | `skill-tree.js` | â¬œ TODO |
| P2.2 | Add Travel, Business, Dating, Tenses, Cases branches | ðŸ”§ Content | `skill-tree.js` | â¬œ TODO |
| P5.1 | Add "Cheat Sheet" grammar guides to each skill node | ðŸ”§ Content | `skill-tree.js` | â¬œ TODO |
| P13.1 | Expand cloze sentences to 5,000+ | ðŸ”§ Content | `cloze.js` | â¬œ TODO |
| P14.1 | Add dozens more AI roleplay scenarios | ðŸ”§ Content | `roleplay.js` | â¬œ TODO |

### ðŸŸ¡ Medium Priority â€” New Features

| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P3.1 | Å tampana/Pisana script display toggle in Settings | ðŸ†• New | `app.js`, `index.html` | â¬œ TODO |
| P3.2 | Dedicated printed vs. cursive letter lessons | ðŸ†• New | `skill-tree.js`, `question-engine.js` | â¬œ TODO |
| P4.1 | Canvas finger-tracing engine for Cyrillic | ðŸ†• New | New file or `app.js` | â¬œ TODO |
| P6.1 | Smart error review with SRS prioritization | ðŸ”§ Enhance | `app.js` (mistake logic) | â¬œ TODO |
| P7.1 | Streak Freeze (Å tit za Niz) purchase/earn | ðŸ†• New | `app.js` | â¬œ TODO |
| P7.2 | Daily Quests shop with gem/XP rewards | ðŸ†• New | `app.js`, `index.html` | â¬œ TODO |
| P17.1 | Hands-free commute audio mode (Pimsleur-style) | ðŸ†• New | New file | â¬œ TODO |

### ðŸŸ¢ Lower Priority â€” Advanced & Deployment

| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P18.1 | AI Visual Lens â€” camera snap & translate | ðŸ†• New | New file | â¬œ TODO |
| P19.1 | Create `manifest.json` (PWA) | ðŸ†• New | `manifest.json` | â¬œ TODO |
| P19.2 | Create `sw.js` (Service Worker) | ðŸ†• New | `sw.js` | â¬œ TODO |
| P19.3 | Enable "Add to Home Screen" | ðŸ†• New | `index.html` | â¬œ TODO |
| P20.1 | Capacitor init + Android platform | ðŸ†• New | New config | â¬œ TODO |
| P20.2 | Google Play Store submission | ðŸ†• New | â€” | â¬œ TODO |

### âšª Future / Moonshot

| # | Task | Type | Status |
|:--|:-----|:-----|:-------|
| P21.1 | Global leaderboards | ðŸ†• New | â¬œ FUTURE |
| P21.2 | Real-time PvP duels | ðŸ†• New | â¬œ FUTURE |
| P22.1 | Smartwatch companion | ðŸ†• New | â¬œ FUTURE |
| P22.2 | AR object tagging | ðŸ†• New | â¬œ FUTURE |
| P22.3 | Home screen widgets | ðŸ†• New | â¬œ FUTURE |

---

## ðŸ“Š Progress Summary

| Category | Done | Remaining |
|:---------|-----:|----------:|
| Infrastructure | 3/3 | 0 |
| Core Architecture | 5/5 | 0 |
| Learning Modules | 7/7 | 0 |
| Entertainment & Media | 5/5 | 0 |
| AI & Audio | 4/4 | 0 |
| Gamification & Stats | 7/7 | 0 |
| Content Expansion (P1-P5, P13-P14) | 0/8 | 8 |
| New Features (P3-P7, P17) | 0/7 | 7 |
| Deployment (P18-P20) | 0/6 | 6 |
| Moonshots (P21-P22) | 0/5 | 5 |
| **TOTAL** | **31/57** | **26** |

---

> [!TIP]
> **Session Start Checklist:**
> 1. Read this file to see where we left off
> 2. Check `manifest.md` to find the right file to edit
> 3. Follow the Constitution in `GEMINI.md` (scan before coding)
> 4. Update this file after completing tasks
