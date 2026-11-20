# 📝 SerboLingo — Active Task Tracker

> [!IMPORTANT]
> This file tracks **what we're actively working on RIGHT NOW**.  
> For the full 22-priority roadmap, see [`reminders.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/reminders.md).  
> For the categorized file index, see [`manifest.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/manifest.md).

**Last Updated**: November 19, 2026

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
| P1.1 | Expand vocabulary to 5,000+ words (Milestone 2: 5,031 words reached) | 🔧 Content | `seed-data.js` | ✅ DONE |
| P1.2 | Add phonetic helpers + gender flags to all entries | 🔧 Content | `seed-data.js` | ✅ DONE |
| P1.3 | Add bilingual example sentences to all entries | 🔧 Content | `seed-data.js` | ✅ DONE |
| P1.4 | Omni-Bar Levenshtein Fuzzy Search & Did You Mean (Solid Banner & Unified Lesson Typo Tolerance) | 🆕 New | `app.js` | ✅ DONE |
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
| P6.1 | Smart error review with SuperMemo-2 SRS prioritization | 🔧 Enhance | `srs-engine.js`, `app.js`, `question-engine.js`, `index.html` | ✅ DONE |
| P7.1 | Streak Freeze (Štit za Niz) purchase/earn | 🆕 New | `shop-engine.js`, `app.js` | ✅ DONE |
| P7.2 | Daily Quests shop & Mystery Chests | 🆕 New | `shop-engine.js`, `index.html` | ✅ DONE |
| P17.1 | Hands-free commute audio mode (Pimsleur-style) | 🆕 New | `commute.js`, `index.html` | ✅ DONE |
| P30.1 | Authentic Cultural Idioms & Slang ("Untranslatable" Cultural Notes, Skill Tree "Ulični srpski" & Arcade Quiz + SRS Sync) | 🔧 Content/Enhance | `seed-data.js`, `slang.js`, `skill-tree.js`, `db.js`, `index.html` | ✅ DONE |
| P31.1 | Gentle Typo Warning for Bald Latin, Phonetic Typos & Mobile Auto-Caps | 🆕 New | `app.js` | ✅ DONE |

### 🟢 Lower Priority — Advanced & Deployment
| # | Task | Type | Target File(s) | Status |
|:--|:-----|:-----|:----------------|:-------|
| P18.1 | AI Visual Lens — camera snap & translate | 🆕 New | visual-lens.js, index.html | ✅ DONE |
| P19.1 | Create `manifest.json` (PWA) | 🆕 New | `manifest.json` | ✅ DONE |
| P19.2 | Create `sw.js` (Service Worker) | 🆕 New | `sw.js` | ✅ DONE |
| P19.3 | Enable "Add to Home Screen" & In-App Install Prompt | 🆕 New | `index.html`, `app.js` | ✅ DONE |
| P20.1 | Capacitor Android Packaging & Polite Google Play / PWA Download Hub | 🆕 New | `capacitor.config.json`, `sync_android.py`, `android/`, `app.js`, `index.html` | ✅ DONE |
| P20.2 | Google Play Store submission (AAB generation & store listing) | 🆕 New | — | ⬜ TODO |
| P24.1 | Local Save Data Export & Import (JSON) | 🆕 New | `app.js`, `index.html` | ✅ DONE |
| P28.1 | Adaptive 3-Minute Placement Test & Skill Tree Unlocks | 🆕 New | `placement-test.js`, `index.html` | ✅ DONE |
| P44.1 | Smart Grammar Tooltips & Word Inspector in Lessons | 🆕 New | `grammar-tooltips.js`, `app.js`, `index.html` | ✅ DONE |
| P25.1 | Native Touch Swipes & Pull-Down Modal Dismiss Physics | 🆕 New | `touch-haptics.js`, `index.html`, `styles.css` | ✅ DONE |
| P35.1 | Punchy Haptic Vibrations & Responsive Tablet Layout | 🆕 New | `touch-haptics.js`, `app.js`, `index.html`, `styles.css` | ✅ DONE |
| P27.1 | Tinder-Style Flashcard Swipes & Memory Retention Heatmap | 🆕 New | `srs-engine.js`, `app.js`, `index.html`, `styles.css` | ✅ DONE |
| P32.1 | Ranked Leagues Table Polish & Diamond Shop Expansion | 🆕 New | `league-system.js`, `index.html` | ✅ DONE |
| P34.1 | Hardcore Immersion Mode (100% Serbian UI) & Native Speaker Clips Hub | 🆕 New | `immersion-clips.js`, `app.js`, `index.html` | ✅ DONE |
| P37.1 | Ultimate Streak Retention & Duolingo Addiction Engine | 🆕 New | `streak-retention.js`, `app.js`, `index.html` | ✅ DONE |
| P45.1 | SerboReels — TikTok-Style Video Immersion (Zero-Clipping Responsive Subtitle Card, Cough-Aware Accurate Dialogue Timing, Natural Karaoke Sync, Middle-Centered Action Rail, 1-Tap Word Seek & Inspector, Profile Direction Sync, Bottom Scrubber & ⏪ -5s Rewind, Pure Latinica, Auto-Loop) | 🆕 New | `serbo-reels.js`, `index.html` | ✅ DONE |
| P36.1 | Database Migration Engine (Versioned Non-Destructive IndexedDB Upsert) | 🆕 New | `db.js`, `seed-data.js` | ✅ DONE |
| P6.1 | True SuperMemo-2 SRS Algorithm & Mistake Vault 2.0 | 🆕 New | `srs-engine.js`, `app.js`, `index.html` | ✅ DONE |
| P38.1 | Smart Paced Story Mode (AI + Offline Procedural Weak Words Weaver) | 🆕 New | `smart-story.js`, `index.html`, `stories.js` | ✅ DONE |
| P12.1 | Local Trophy Cabinet & Achievement Medals ("Vitrina sa Trofejima") | 🆕 New | `trophy-cabinet.js`, `arcade.js`, `index.html` | ✅ DONE |
| P41.1 | Interactive Grammar Sandbox & 2-in-1 Sentence Builder Hub | 🆕 New | `grammar-sandbox.js`, `arcade.js`, `index.html` | ✅ DONE |
| P46.1 | In-App Bug & Feedback Reporting System ("Prijavi Problem") | 🆕 New | `bug-report.js`, `index.html`, `sw.js` | ✅ DONE |
| P47.1 | Global Community Forum & Discussion Hub ("Forum Zajednice") | 🆕 New | `community-forum.js`, `index.html`, `sw.js` | ✅ DONE |
| P43.1 | Omegle-Style Language Exchange Hub ("Slučajni Sagovornik") | 🆕 New | `language-exchange.js`, `index.html`, `sw.js` | ✅ DONE |
| P43.2 | Ultra-Safe Video/Voice Roulette & Match Filters (Phase 2 Upgrade) | 🆕 New | `language-exchange.js`, `index.html`, `sw.js` | ✅ DONE |
| P43.3 | Community Moderation Escalation, Dual-Button Safety & Appeals (Client-Side) | 🆕 New | `language-exchange.js`, `index.html`, `sw.js` | ✅ DONE |
| P39.1 | Optical Character Recognition & Live AI Visual Lens (Live camera, unified scanner, touch-scroll) | 🆕 New | `visual-lens.js`, `index.html` | ✅ DONE |
| P40.1 | Custom Community Decks & Personal Word Folders (Create decks, JSON export/import, swipe review) | 🆕 New | `srs-engine.js`, `index.html` | ✅ DONE |

### ⚪ Future / Moonshot

| # | Task | Type | Status |
|:--|:-----|:-----|:-------|
| P21.0 | Offline Ghost Bots & Friend Codes (Part 1) | 🆕 New | ✅ DONE |
| P21.1 | Global leaderboards (Cloud / Part 2) | 🆕 New | ⬜ FUTURE |
| P21.2 | Real-time PvP duels (Cloud / Part 2) | 🆕 New | ⬜ FUTURE |
| P22.1 | Smartwatch companion | 🆕 New | ⬜ FUTURE |
| P22.2 | AR object tagging | 🆕 New | ⬜ FUTURE |
| P22.3 | Home screen widgets & PWA Mobile App Shortcuts | 🆕 New | ✅ DONE |
| P24.2 | Cross-Device Cloud Save Sync (Account link) | 🆕 New | ⬜ FUTURE |
| P48.1 | The Global Polyglot Ecosystem — Multi-Language Engine ("Svet Jezika") | 🆕 New | ⬜ FUTURE |
| P49.1 | AI Accent Coach & Waveform Pitch Matcher | 🆕 New | ✅ DONE |
| P50.1 | Authentic Serbian Customs, Cultural Etiquette & Gastronomy | 🆕 New | ✅ DONE |
| P12.2 | "Monty Winner" Complete Victory Studio & Multimedia Flex (5s Video, Photo Editor, Bilingual Safety Shield, 7-Day Frequency Cap & Social Share Grid) | 🆕 New | `monty-winner.js`, `app.js`, `league-system.js`, `trophy-cabinet.js`, `index.html` | ✅ DONE |
| P20.3 | Mobile Analytics & Attribution Stack (Firebase + RevenueCat) | 🆕 New | ⬜ FUTURE |
| P20.4 | Pricing Architecture & Churn Recovery (Pause vs Cancel + 50% Win-Backs) | 🆕 New | ⬜ FUTURE |
| P21.3 | Self-Evolving Community Dictionary (Reddit-Style Voting Pipeline) | 🆕 New | ⬜ FUTURE |
| P21.4 | Built-In Viral Referral Engine (Give 1 Month, Get 1 Month) | 🆕 New | ⬜ FUTURE |
| P22.4 | Native Mobile Home Screen Widgets (Android Glance & iOS WidgetKit) | 🆕 New | ⬜ FUTURE |
| P32.2 | "Podeli Profil" Share Profile Bragging Card | 🆕 New | ✅ DONE |
| P32.3 | Time-Based Variable Dopamine Badges ("Night Owl" & "Accuracy Bonus") | 🆕 New | ✅ DONE |
| P40.2 | 1-Tap Messaging App Deck Sharing (WhatsApp/Viber) | 🆕 New | ✅ DONE |
| P51.1 | Zero-Dollar Organic Marketing, ASO & Community Launch Playbook | 🆕 New | ⬜ FUTURE |

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
| New Features (P3-P7, P17) | 7/7 | 0 |
| Deployment (P18-P20, P39, P40) | 5/8 | 3 |
| Moonshots (P12.2, P21-P22, P24.2, P43.3, P48-P51) | 10/20 | 10 |
| **TOTAL** | **48/75** | **27** |

---

> [!TIP]
> **Session Start Checklist:**
> 1. Read this file to see where we left off
> 2. Check `manifest.md` to find the right file to edit
> 3. Follow the Constitution in `GEMINI.md` (scan before coding)
> 4. Update this file after completing tasks
