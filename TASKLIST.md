# 📝 SerboLingo — Active Task Tracker

> [!IMPORTANT]
> This file tracks **what we're actively working on RIGHT NOW**.  
> For the full 22-priority roadmap, see [`reminders.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/reminders.md).  
> For the categorized file index, see [`manifest.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/manifest.md).

**Last Updated**: November 27, 2026

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
- [x] Multi-tier TTS cascade (Cloud AI → Native → Google Translate) with resilient mobile native voice fallback
- [x] Speech recognition (pronunciation, karaoke, spelling)
- [x] Graceful degradation when offline / no API keys

### Mobile Hardening & Lesson Engine Fixes
- [x] Text-level distractor deduplication across MCQ, picture choice, listening, and matching pairs (`question-engine.js`)
- [x] Resilient mobile audio stream: switched to unauthenticated `tw-ob` client and set `no-referrer` meta policy in `index.html` to eliminate GitHub hotlink blocks
- [x] Pre-cached `window._cachedVoices` on load to fix async empty-voice list on mobile browsers (`app.js`)
- [x] Option B Rich Variety Curriculum: Standard lessons feature balanced distribution (20% fill-blank, 20% word-order, 14% speaking, 14% listening, 14% picture-choice, 12% hangman, MCQ) with 1-tap "Ne mogu sada da pričam (Preskoči)" / "Ne mogu da slušam (Prikaži tekst)" Quiet Mode safety valves (`question-engine.js`, `app.js`)
- [x] Dedicated Section Companion Workouts & Full-Tier Vocabulary Pooling: 🎧 Slušanje & 🎙️ Govor companion workout buttons per Skill Tree tier, pooling all 130–400+ words across each tier without alphabet modal collision (`app.js`)
- [x] Fresh 10 Batching & Pagination System: `⬅️ Prethodnih 10 lekcija`, `➡️ Sledećih 10 lekcija`, `🔁 Ponovi ovih 10`, and `🏠 Završi i vrati se na stablo` with live progress bars (`Deo X od Y • Reči A–B od N`) and persistent progress memory (`app.js`)
- [x] Hangman Punctuation Stripping Fix: Stripped punctuation marks (`?`, `!`, `.`, `,`) from target words so only valid spellable letters get blank slots, preventing impossible question-mark fails (`question-engine.js`, `app.js`)
- [x] Enhanced `_phoneticNormalize` with Cyrillic-to-Latin transliteration and `dž` digraph support (`app.js`)
- [x] Disabled auto-capitalization on fill-blank mobile input (`app.js`)
- [x] CORS Audio Blob Stream & Native Fallback Fix: Integrated `lingva.ml` CORS-enabled proxy with in-memory MP3 `Blob` playback to bypass mobile browser Referer hotlink blocks on GitHub Pages; eliminated premature `speechSynthesis` silence trap (`app.js`)
- [x] PWA Instant Auto-Update & Cache Purge (v18): Added `self.skipWaiting()` + `clients.claim()` + `reg.update()` and `controllerchange` auto-reload so regular tabs immediately update and purge stale cache without requiring Incognito mode or manual cache clears (`sw.js`, `app.js`, `index.html`)
- [x] Option 2 Dual-Action Audio Architecture (v19): Implemented automatic question audio playback paired with graceful `NotAllowedError` catch and animated tactile 🔊 speaker button fallback (`👆 Dodirni zvučnik da čuješ` / `🔊 Reprodukovanje...` / `🔄 Dodirni za ponovno slušanje`), ensuring 100% audio reliability on restricted PC/mobile browsers and offline Android APK (`app.js`, `sw.js`, `index.html`)
- [x] Version-Gated Code Cache Purge & Settings Refresh Button (v20): Added pre-flight automated CacheStorage purger in `index.html` that wipes only legacy code caches upon version bump while keeping 100% of user XP, streaks, and progress safe; added 1-click `app.purgeCodeCacheAndReload()` rescue button in Settings UI (`index.html`, `sw.js`, `app.js`)
- [x] Web Audio API AudioContext Decoder & In-Memory Rolling Cache (v21): Eliminated mobile browser user gesture expiry issues across async CORS fetch boundaries by pre-unlocking AudioContext on first touch/speaker tap and decoding raw MP3 byte buffers directly via `AudioContext.decodeAudioData()`; added 100-item in-memory LRU audio cache for instant 0ms replays (`app.js`, `sw.js`, `index.html`)
- [x] Automated Pre-Flight URL Cache-Buster & Hard Timestamped Rescue Reloader (v22): Completely bypassed aggressive Mobile Chrome V8 bytecode and HTTP disk cache locking. Pre-flight in `index.html` automatically detects version upgrades, purges stale caches, unregisters old SW, and executes a clean `?_v=22` URL replacement. Upgraded `app.purgeCodeCacheAndReload()` in Settings with `sessionStorage` wipe and `?_hard=` timestamped redirect that guarantees fresh code without manual browser menu navigation, while keeping 100% of user XP, streaks, and progress safe (`index.html`, `app.js`, `sw.js`)
- [x] 3-Stage Lesson Difficulty Ladder & Expanded Beginner Lexicon (Priority 53.1 — v23): Created 250-item master dataset across 25 levels × 10 items per level with 1-to-1 spotlight mapping (250 Core Words ➔ 250 Spotlight Phrases ➔ 250 Spotlight Sentences). Built 3-in-1 Stage Hub bottom sheet modal (`#basics-hub-modal`) inside the Osnove bubble with live level and item counters, dedicated `QuestionEngine.generateBasicsLesson` generator for Recognition, Assembly, and Production stages, and Fresh 10 completion screen navigation (`basics-data.js`, `index.html`, `question-engine.js`, `app.js`, `touch-haptics.js`, `sw.js`)
- [x] Picture Choice 4-Card 2×2 Grid & Scoped Word Inspector Tooltips (v24): Fixed stale `www/` sync and added global emoji distractor fallback in `QuestionEngine.generatePictureChoice` so every category/tier guarantees 4 emoji cards (2×2 grid) with clean quote rendering; restricted `GrammarEngine.wrapInteractiveWords` so only target vocabulary/phrases become clickable after answering while prompt prefixes (`Translate:`, `Prevedi:`, `Kako se kaže`, etc.) stay static (`question-engine.js`, `grammar-tooltips.js`, `app.js`, `index.html`, `sw.js`)
- [x] Full Option B Exercise Variety Across All 3 Basics Stages (v25): Restored 🎙️ Mic Speaking (`generateSpeaking` & `generateSpeakingSentence`), 🎯 Hangman (words & concise phrases ≤18 chars), 🎧 Listening across Stages 2–3, 🔗 Matching Pairs (4 pairs in Stages 1–2, compact 3 sentence pairs in Stage 3 with mobile-friendly button sizing), and 💬 Mini-Dialogues in `QuestionEngine.generateBasicsLesson`, plus Hard mode speaking recall (`question-engine.js`, `app.js`, `index.html`, `sw.js`)
- [x] Tactical Diamond Hint Engine (Priority 52 — v26): Added `💡 Pomoć (-5 💎)` footer lifeline (`hint-engine.js`) with atomic `LeagueEngine.spendGems(5)` deduction, 350ms double-tap debounce + single-use lock, zero XP/heart/streak penalty, 50/50 option elimination preserving 1 correct + ≥1 distractor across MCQ/picture/listening/dialogue/alphabet, Unicode-safe first-letter scaffolding (Latin diacritics + Cyrillic) for typing/speaking/cloze (`cloze.js`), sequential next-word highlight for `word_order`, and free-of-mistake letter reveal for `hangman` (`hint-engine.js`, `app.js`, `cloze.js`, `index.html`, `sw.js`)
- [x] "Učionica" Virtual School Syllabus & Homeroom Academy (Priority 54 — v27): Added Dual-Track Home switcher (`🌳 Stablo Veština` vs `🏫 Učionica`), 2-semester × 4-week × 5-day structured curriculum (40 periods), Profesorka Ana homeroom persona, 5-part daily period flow (Roll Call with yesterday recap ➔ Whiteboard cards with `1.0x`/`0.75x` audio speed toggle + grammar callout ➔ Guided Practice ➔ Hint-free Pop Quiz / Friday Cumulative Exam ➔ 3-card Evening Homework Pack), Dnevnik & Svedočanstvo report cards (5/A–1/F across Vocab, Grammar, Pronunciation), shareable/downloadable Semester Diploma certificates (offline PNG Canvas & Web Share), and automatic Dopunska Nastava (Office Hours) review gate on `<60%` Friday exams (`classroom.js`, `index.html`, `app.js`, `hint-engine.js`, `touch-haptics.js`, `sw.js`)

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
| P1.5 | Phase 2 Multi-Answer Grading, Context Hints & Polysemy Patch (116 seed-data entries + 41 basics-data entries with accepted alternates & context hints, unified evaluateAcceptedAnswer pipeline across all 12 question types) | 🆕 New | `app.js`, `question-engine.js`, `seed-data.js`, `basics-data.js` | ✅ DONE |
| P2.1 | Expand skill tree to 60+ nodes | 🔧 Content | `skill-tree.js` | ⬜ TODO |
| P2.2 | Add Travel, Business, Dating, Tenses, Cases branches | 🔧 Content | `skill-tree.js` | ⬜ TODO |
| P5.1 | Add "Cheat Sheet" grammar guides to each skill node | 🔧 Content | `skill-tree.js` | ⬜ TODO |
| P13.1 | Expand cloze sentences to 4,400+ dynamic sentences (14 thematic channels, Latinica/Ćirilica script parity, SR ↔ EN direction toggle, stem matching, typo tolerance & endless mode) | 🔧 Content/Enhance | `cloze.js`, `question-engine.js`, `app.js` | ✅ DONE |
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
| P48.1 | The Global Polyglot Ecosystem — Multi-Language Engine ("Svet Jezika" & The 15 MB Audio Rule) | 🆕 New | ⬜ FUTURE |
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
| P52.1 | Tactical Diamond Hint Engine (Scaffolded Lifelines & Word Discovery) | 🆕 New | `hint-engine.js`, `app.js`, `cloze.js`, `index.html`, `sw.js` | ✅ DONE |
| P53.1 | 3-Stage Lesson Difficulty Ladder & Expanded Beginner Lexicon (250 Core Words, Phrases & Sentences Hub) | 🆕 New | `basics-data.js`, `index.html`, `question-engine.js`, `app.js` | ✅ DONE |
| P54.1 | "Učionica" Virtual School Syllabus & Homeroom Academy (Standalone Mode) | 🆕 New | `index.html`, `app.js`, `classroom.js`, `hint-engine.js`, `touch-haptics.js`, `sw.js` | ✅ DONE |
| P55.1 | Spoken Voice-to-Voice AI Language Tutor (Native Walkie-Talkie Loop) | 🆕 New | `app.js`, `voice-tutor.js`, `index.html` | ⬜ TODO |
| P56.1 | 3-Day Streak ➔ 30-Minute VIP "God Mode" All-Access Pass | 🆕 New | `app.js`, `index.html`, `streak-retention.js` | ⬜ TODO |

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
| Content Expansion (P1-P5, P13-P14, P53) | 3/9 | 6 |
| New Features (P3-P7, P17, P52, P54-P56) | 9/11 | 2 |
| Deployment (P18-P20, P39, P40) | 5/8 | 3 |
| Moonshots (P12.2, P21-P22, P24.2, P43.3, P48-P51) | 10/20 | 10 |
| **TOTAL** | **53/80** | **27** |

---

> [!TIP]
> **Session Start Checklist:**
> 1. Read this file to see where we left off
> 2. Check `manifest.md` to find the right file to edit
> 3. Follow the Constitution in `GEMINI.md` (scan before coding)
> 4. Update this file after completing tasks
