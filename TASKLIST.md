# 📝 SerboLingo — Active Task Tracker

> [!IMPORTANT]
> This file tracks **what we're actively working on RIGHT NOW**.  
> For the full 22-priority roadmap, see [`reminders.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/reminders.md).  
> For the categorized file index, see [`manifest.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/manifest.md).

**Last Updated**: September 27, 2026

---

## 🏗️ Infrastructure Setup

- [x] Create `.antigravity/` directory with README
- [x] Create `manifest.md` — categorized source file index
- [x] Create `TASKLIST.md` — this file

---

## ✅ Completed Features (Verified on Disk)

### Core Architecture
- [x] Pure Vanilla SPA (`index.html` — 12 views toggled via classList)
- [x] Core engine (`app.js` — state, auth, nav, Omni-Bar, gamification)
- [x] IndexedDB dictionary (`db.js` + `seed-data.js` — ~3,500 entries)
- [x] Tailwind CSS + custom animations (`styles.css`)
- [x] Dark mode support (Tailwind `dark:` classes)

### Learning Modules
- [x] Skill Tree — 15 tiers, 5-crown system, prerequisite logic (`skill-tree.js`)
- [x] Question Engine — 12+ formats incl. speech, canvas, drag-drop (`question-engine.js`)
- [x] Alphabet data — 30-letter matrix, Latin + Cyrillic (`alphabet-data.js`)
- [x] Cloze fill-in-the-blank trainer (`cloze.js`)
- [x] Serbian slang module — Belgrade/Southern/Kafana (`slang.js`)
- [x] Pitch-accent trainer — 4 accents + Web Audio detection (`pitch-accent.js`)
- [x] Interactive branching stories (`stories.js`)

### Entertainment & Media
- [x] Arcade — 22+ minigames + Bot opponent mode (`arcade.js`)
- [x] AI Roleplay — 50+ scenarios, free chat, grammar correction (`roleplay.js`)
- [x] Explore Hub — 4-tab media browser + YouTube API (`explore-hub.js`)
- [x] Karaoke — bilingual reader + speech word-tracking (`karaoke.js`)
- [x] Rhythm — music lyrics + YouTube sync scoring (`rhythm.js`)

### AI & Audio
- [x] Gemini API integration — model cascading (2.5-flash → 1.5-flash)
- [x] Multi-tier TTS cascade (Cloud AI → Native → Google Translate)
- [x] Speech recognition (pronunciation, karaoke, spelling)
- [x] Graceful degradation when offline / no API keys

### Gamification & Stats
- [x] XP / Streak / Hearts / Crowns system
- [x] Daily quests container
- [x] Stats view — Chart.js bar + 6-axis radar
- [x] Confetti celebrations + toast notifications
- [x] Badge/achievement system
- [x] Bidirectional learning toggle (SR ↔ EN)
- [x] Add-to-Flashcards from Omni-Bar (★ star button)

---

## 📋 Upcoming Work Queue

> [!NOTE]
> Items are ordered by priority from `reminders.md`.  
> Many "TODO" items below already have **engines built** — they need **content expansion**, not fresh code.  
> Items marked 🔧 = engine exists, needs content. Items marked 🆕 = needs new code.

### 🔴 High Priority — Content & Curriculum Expansion

| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P1.1 | Expand vocabulary to 5,000+ words | 🔧 Content | `seed-data.js` | ⬜ TODO |
| P1.2 | Add phonetic helpers + gender flags to all entries | 🔧 Content | `seed-data.js` | ⬜ TODO |
| P1.3 | Add bilingual example sentences to all entries | 🔧 Content | `seed-data.js` | ⬜ TODO |
| P1.4 | Omni-Bar Levenshtein Fuzzy Search & Did You Mean | 🆕 New | `app.js` | ✅ DONE |
| P2.1 | Expand skill tree to 60+ nodes | 🔧 Content | `skill-tree.js` | ⬜ TODO |
| P2.2 | Add Travel, Business, Dating, Tenses, Cases branches | 🔧 Content | `skill-tree.js` | ⬜ TODO |
| P5.1 | Add "Cheat Sheet" grammar guides to each skill node | 🔧 Content | `skill-tree.js` | ⬜ TODO |
| P13.1 | Expand cloze sentences to 5,000+ | 🔧 Content | `cloze.js` | ⬜ TODO |
| P14.1 | Add dozens more AI roleplay scenarios | 🔧 Content | `roleplay.js` | ⬜ TODO |

### 🟡 Medium Priority — New Features

| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P3.1 | Štampana/Pisana script display toggle in Settings | 🆕 New | `app.js`, `index.html` | ✅ DONE |
| P3.2 | Dedicated printed vs. cursive letter lessons | 🆕 New | `skill-tree.js`, `question-engine.js` | ✅ DONE |
| P4.1 | Canvas finger-tracing engine for Cyrillic | 🆕 New | New file or `app.js` | ✅ DONE |
| P6.1 | Smart error review with SRS prioritization | 🔧 Enhance | `app.js` (mistake logic) | ⬜ TODO |
| P7.1 | Streak Freeze (Štit za Niz) purchase/earn | 🆕 New | `shop-engine.js`, `app.js` | ✅ DONE |
| P7.2 | Daily Quests shop & Mystery Chests | 🆕 New | `shop-engine.js`, `index.html` | ✅ DONE |
| P17.1 | Hands-free commute audio mode (Pimsleur-style) | 🆕 New | New file | ⬜ TODO |
| P30.1 | Authentic Cultural Idioms & Slang ("Untranslatable" Cultural Notes, Skill Tree "Ulični srpski" & Arcade Quiz + SRS Sync) | 🔧 Content/Enhance | `seed-data.js`, `slang.js`, `skill-tree.js`, `db.js`, `index.html` | ✅ DONE |
| P31.1 | Gentle Typo Warning for Bald Latin & Minor Typos | 🆕 New | `app.js` | ✅ DONE |

### 🟢 Lower Priority — Advanced & Deployment

| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P18.1 | AI Visual Lens — camera snap & translate | 🆕 New | visual-lens.js, index.html | ✅ DONE |
| P19.1 | Create `manifest.json` (PWA) | 🆕 New | `manifest.json` | ⬜ TODO |
| P19.2 | Create `sw.js` (Service Worker) | 🆕 New | `sw.js` | ⬜ TODO |
| P19.3 | Enable "Add to Home Screen" | 🆕 New | `index.html` | ⬜ TODO |
| P20.1 | Capacitor init + Android platform | 🆕 New | New config | ⬜ TODO |
| P20.2 | Google Play Store submission | 🆕 New | — | ⬜ TODO |
| P24.1 | Local Save Data Export & Import (JSON) | 🆕 New | `app.js`, `index.html` | ✅ DONE |
| P28.1 | Adaptive 3-Minute Placement Test & Skill Tree Unlocks | 🆕 New | `placement-test.js`, `index.html` | ✅ DONE |
| P44.1 | Smart Grammar Tooltips & Word Inspector in Lessons | 🆕 New | `grammar-tooltips.js`, `app.js`, `index.html` | ✅ DONE |
| P25.1 | Native Touch Swipes & Pull-Down Modal Dismiss Physics | 🆕 New | `touch-haptics.js`, `index.html`, `styles.css` | 🔄 REVISIT |
| P35.1 | Punchy Haptic Vibrations & Responsive Tablet Layout | 🆕 New | `touch-haptics.js`, `app.js`, `index.html`, `styles.css` | ✅ DONE |
| P27.1 | Tinder-Style Flashcard Swipes & Memory Retention Heatmap | 🆕 New | `srs-engine.js`, `app.js`, `index.html`, `styles.css` | ✅ DONE |
| P32.1 | Ranked Leagues (Bronze to Obsidian), Timed XP Boosts & Profile Locker | 🆕 New | `league-system.js`, `app.js`, `index.html`, `styles.css` | 🔄 REVISIT |
| P34.1 | Hardcore Immersion Mode (100% Serbian UI) & Native Speaker Clips Hub | 🆕 New | `immersion-clips.js`, `app.js`, `index.html` | ✅ TESTING |

### ⚪ Future / Moonshot

| # | Task | Type | Status |
|:--|:-----|:-----|:-------|
| P21.0 | Offline Ghost Bots & Friend Codes (Part 1) | 🆕 New | ✅ DONE |
| P21.1 | Global leaderboards (Cloud / Part 2) | 🆕 New | ⬜ FUTURE |
| P21.2 | Real-time PvP duels (Cloud / Part 2) | 🆕 New | ⬜ FUTURE |
| P22.1 | Smartwatch companion | 🆕 New | ⬜ FUTURE |
| P22.2 | AR object tagging | 🆕 New | ⬜ FUTURE |
| P22.3 | Home screen widgets | 🆕 New | ⬜ FUTURE |

---

## 📊 Progress Summary

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
