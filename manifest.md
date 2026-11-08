# 📋 SerboLingo — Categorized Source Manifest

> [!IMPORTANT]
> This manifest is the **ANTI-DUPLICATION SHIELD** (Constitution Section 3).  
> Before creating ANY new file or feature, scan this index first.  
> **FILE-AS-TRUTH**: If this manifest seems incomplete, scan the actual source code on disk.

**Last Updated**: September 27, 2026  
**Total Source Files**: 18 · **Total Lines**: ~16,000+ · **Total Size**: ~1.2 MB

---

## [01_CORE_ENGINE] — Application Core, Database & Config

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`index.html`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/index.html) | 2,274 | 145 KB | Main SPA shell — all 12 views, modals, nav, SVG icons, CDN imports |
| [`app.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/app.js) | 4,098 | 215 KB | Core controller — state management, auth, navigation, Omni-Bar search, daily reset, XP/streak/hearts, Chart.js stats, Canvas whiteboard, TTS pipeline, Gemini AI handlers, UI_STRINGS localization, Mistake Vault 2.0 with SM-2 |
| [`db.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/db.js) | 422 | 15 KB | IndexedDB engine & migration manager (`SerboLingoDB` v7) — non-destructive schema upgrades, versioned background upserts, 60 FPS chunked batches, dictionary search/indexing |
| [`styles.css`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/styles.css) | 607 | 14 KB | Tailwind extensions — custom animations (confetti, arcade-fall/flip/pulse), 3D squishy buttons, progress ring, radar chart, dark mode theme |
| [`sw.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/sw.js) | 164 | 6 KB | PWA Service Worker (v13) — Pre-caches app shell, stale-while-revalidate for CDN libraries, 100% offline fallback |
| [`manifest.json`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/manifest.json) | 48 | 1.2 KB | Web App Manifest — Standalone display mode, theme colors, responsive app icons |
| [`icon.svg`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/icon.svg) | 57 | 3 KB | SerboLingo master vector brand icon — Serbian flag tricolor squircle, SL monogram & gold XP lightning badge |

## [02_VOCAB_SRS] — Vocabulary Database & Spaced Repetition

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`seed-data.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/seed-data.js) | 3,532 | 700 KB | Master offline dictionary (v2.0) — ~3,500 entries with EN/SR translations, gender, part of speech, phonetics, difficulty tiers, bilingual example sentences, SEED_DATA_VERSION governance |
| [`seed-data.json`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/seed-data.json) | — | — | Backup/alternate JSON format of the dictionary |

> **SRS Logic Lives In**: `app.js` (mistake tracking via `state.mistakeLog`, star/favorites system, review lesson generation)

## [03_GRAMMAR] — Grammar Engine, Skill Tree & Question Generation

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`skill-tree.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/skill-tree.js) | 675 | 68 KB | 15-tier curriculum (Foundation → C1/C2 Nuances), 5-crown progression (3 lessons/crown), prerequisite logic, bilingual grammar guides per node |
| [`question-engine.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/question-engine.js) | 662 | 28 KB | 12+ question type generator — MCQ, speech recognition, picture/emoji, listening, fill-blank, scrambled word order, canvas whiteboard, hangman, matching pairs, letter-by-letter spelling, drag-drop punctuation, SM-2 prioritized mistake review lessons |
| [`alphabet-data.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/alphabet-data.js) | 73 | 7 KB | Complete 30-letter Serbian alphabet matrix — Latin + Cyrillic with anchor words, emojis, phonetics |
| [`grammar-tooltips.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/grammar-tooltips.js) | 1,280 | 70 KB | Smart Grammar Tooltips & Interactive Word Inspector — Deep linguistic engine (SR_CORE_GRAMMAR, EN_CORE_GRAMMAR, SEED_DATA indexing), gender/tense/case badges, collocations, syntax notes, bilingual audio & examples |
| [`grammar-sandbox.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/grammar-sandbox.js) | 570 | 28 KB | Interactive Grammar Sandbox & 2-in-1 Sentence Hub (Priority 41) — Word-by-word sentence trainer (50+ curated sentences) + Color-coded Lego SVO grammar blocks (blue/red/green/purple) |

## [04_AUDIO] — TTS, Speech Recognition & Pitch Analysis

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`pitch-accent.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/pitch-accent.js) | 414 | 18 KB | Serbian 4-accent pitch guide — Web Audio autocorrelation pitch detection, visual pitch curve matching, intonation trainer |

> **TTS Pipeline Lives In**: `app.js` (multi-tier cascade: Gemini Audio → OpenAI TTS → Google Cloud TTS → Native SpeechSynthesis → Google Translate `client=gtx`)  
> **Speech Recognition Lives In**: `app.js`, `karaoke.js`, `rhythm.js` (webkitSpeechRecognition for pronunciation validation, word tracking, spelling)

## [05_UI_VIEWS] — Screens, Modals & Interactive Modules

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`arcade.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/arcade.js) | 2,449 | 118 KB | 22+ minigames engine — Milioner, Spojnice, Kucanje, Udari Reč, Vešala, Slagalica, Slepi Miš, Memorija, Zmijica, Sudden Death, Rečko, Baloni, Gender Sorter, Bot mode (Marko_Bot), and more |
| [`roleplay.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/roleplay.js) | 291 | 13 KB | AI roleplay chatbot — 50+ real-world scenario prompts, free chat, auto grammar correction in brackets, model cascading, voice output |
| [`explore-hub.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/explore-hub.js) | 470 | 39 KB | Media hub — curated video/article/infographic feeds, YouTube Data API v3 live search, AI-generated custom lessons, 4 tabs (Video/Pictures/Articles/Extra) |
| [`commute.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/commute.js) | 134 | 4 KB | Hands-Free / Commute Audio Mode — Screen-locked Pimsleur-style audio loop |
| [`visual-lens.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/visual-lens.js) | 480 | 20 KB | AI Visual Lens — multimodal camera snap & translate, Object & OCR modes, Gemini Vision cascade, 1-click Flashcard save |
| [`ghost-arena.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/ghost-arena.js) | 330 | 14 KB | Ghost Arena — offline multiplayer ghost bot engine, Friend Code generator/importer, dynamic duel simulation |
| [`shop-engine.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/shop-engine.js) | 275 | 11 KB | Gamification Economy & Shop — Streak Freeze protection, XP shop, Mystery Chest rolls, daily quest pool |
| [`placement-test.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/placement-test.js) | 330 | 14 KB | Adaptive Placement Test — 10-question CEFR diagnostic quiz (A1-B2), auto-unlocks skill tree tiers with XP bonus |
| [`touch-haptics.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/touch-haptics.js) | 390 | 18 KB | Native Touch Gestures & Haptics (Priority 25 & 35) — 20-modal swipe-to-dismiss with spring physics, bi-directional horizontal swipe between bottom nav tabs with 60 FPS slide transitions, mobile gesture shield (Cloudflare web vs. Google Play wrapper), tactile button vibrations |
| [`srs-engine.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/srs-engine.js) | 766 | 32 KB | Universal SuperMemo-2 Spaced Repetition engine & Flashcards — mathematical SM-2 interval scheduling, Tinder-style card swipe reviews, 3D flip physics, dynamic retention decay, due date queue, Stats tab Brain Health Heatmap |
| [`league-system.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/league-system.js) | 560 | 25 KB | Ranked Leagues (Bronze to Obsidian), Timed Early Bird Boosts & Animated Avatars/Titles Locker |
| [`streak-retention.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/streak-retention.js) | 560 | 25 KB | Streak Retention & Addiction Engine (Priority 37) — Streak-at-risk pulsating alarm & countdown, Spasi Svoj Niz (Streak Repair via 150 Gems or 5-question recovery challenge), Društvo Niza (Streak Society VIP tiers), shareable milestone bragging cards (Instagram/WhatsApp), and Web Notifications API |
| [`immersion-clips.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/immersion-clips.js) | 700 | 33 KB | Native Speaker Immersion & Audio Loops (Priority 34) — 16 curated native speech clips (Č/Ć, Dž/Đ, R, street slang, culture), 2.5s continuous loop mode, speed toggle (1.0x / 0.75x), script modes (Latinica / Ćirilica / Hidden blind ear test), voice shadowing, and 1-click SRS Flashcard synchronization |
| [`serbo-reels.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/serbo-reels.js) | 550 | 26 KB | SerboReels Video Immersion (Priority 45) — TikTok/Reels/Kiku-style vertical short video player with synchronized dual subtitles, 1-tap word inspector with case/grammar tags, and 1-tap Tinder-style SRS Flashcard deck export |
| [`smart-story.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/smart-story.js) | 510 | 24 KB | Smart Paced Story Mode (Priority 38) — Dynamic cultural stories woven from learner's weakest/due words, dual AI (Gemini cascade) + 100% offline procedural weaver, highlighted golden pills, comprehension checkpoint, and SuperMemo-2 SRS progress synchronizer |
| [`trophy-cabinet.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/trophy-cabinet.js) | 440 | 21 KB | Local Trophy Cabinet & Achievements (Priority 12) — High score tracking across 40 minigames, Bot win streaks, 20 tiered medals (Bronze to Diamond), automated game-over evaluation, and 3D showcase shelf |
| [`bug-report.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/bug-report.js) | 360 | 17 KB | In-App Bug & Feedback Reporting System (Priority 46) — In-app report modal, category selector, automatic diagnostic snapshot (device tier, screen, view, errors), Discord webhook delivery, Bug Hunter XP rewards, and local report history |
| [`community-forum.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/community-forum.js) | 590 | 32 KB | Global Community Forum & Discussion Hub (Priority 47) — 4 discussion channels (Gramatika, Kultura, Partner, Predlozi), 10 pre-populated seed discussions, thread/reply CRUD, upvoting with tactile haptics, reputation & XP rewards, AI Tutor instant analysis, and moderation |
| [`language-exchange.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/language-exchange.js) | 2314 | 131 KB | Ultra-Safe Video/Voice Roulette, Match Filters, Moderation Escalation & Dual-Button Safety (Priority 43, 43.2 & 43.3) — Unified 1v1 & group rooms, live mic/camera toggles with PiP self-view, 2s safe-connect frosted blur, 18+ safety pledge, NSFW panic shield, pre-match filters (country, gender, medium), study buddy saving, 12 authentic personas, separate 🚩 Report (4-report strike ladder) vs 🚫 Block (permanent exclusion) buttons, blocked users management modal, "Warning First" formal community warning modal, progressive ban ladder (1h, 4h, 24h, 7d, permaban) with locked lobby & live countdown, and in-app appeals system (Podnesi Žalbu) |

| [`karaoke.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/karaoke.js) | 572 | 28 KB | Bilingual speech-recognition reader — levels A1-B2, live word tracking, word translations, TTS replay |
| [`rhythm.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/rhythm.js) | 567 | 26 KB | Music lyrics synchronizer — YouTube IFrame API playback + SpeechRecognition singing/recitation scoring |
| [`cloze.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/cloze.js) | 224 | 15 KB | Fill-in-the-blank context trainer — sentence bank, scoring, streaks |
| [`slang.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/slang.js) | 350 | 22 KB | Authentic Cultural Idioms & Slang (Priority 30) — Belgrade/Izreke/Nežnost/Kafana/Južni database, cultural context notes, quiz engine, mistakeLog & SRS Flashcards sync |
| [`stories.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/stories.js) | 352 | 18 KB | Branching RPG-style interactive dialogue stories — multiple conversation paths |

## [06_UTILITIES] — Scripts, Tests & Dev Tools

| File | Lines | Description |
|:-----|------:|:------------|
| [`start.bat`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/start.bat) | — | Launch script |
| [`node.exe`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/node.exe) | — | Local Node.js binary (for utility scripts only, NOT runtime) |
| [`check.ps1`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/check.ps1) | — | PowerShell utility script |
| [`convert.ps1`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/convert.ps1) | — | PowerShell data conversion script |
| [`convert2.ps1`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/convert2.ps1) | — | PowerShell data conversion script (v2) |
| [`check_seed.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/check_seed.js) | — | Seed data validation script |
| [`add_stories.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/add_stories.js) | — | Story content injection script |
| [`data/chunk-test.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/data/chunk-test.js) | — | DB chunking test script |
| [`test.html`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/test.html) | 904 | Earlier test/staging HTML page |

## [07_PROJECT_META] — Documentation & Governance

| File | Lines | Description |
|:-----|------:|:------------|
| [`GEMINI.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/GEMINI.md) | 159 | Technical Constitution v3.0 — Shield Daemon Protocol, 11 governance sections |
| [`reminders.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/reminders.md) | 230 | Master roadmap — 22 priorities, competitor benchmarks, CEFR goals |
| [`manifest.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/manifest.md) | — | This file — categorized source index |
| [`TASKLIST.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/TASKLIST.md) | — | Active work tracker |
| [`.antigravity/README.md`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/.antigravity/README.md) | — | Infrastructure directory readme |

---

> [!TIP]
> **Quick Lookup Guide:**
> - Need to add a word? → `seed-data.js` [02_VOCAB_SRS]
> - Need a new question type? → `question-engine.js` [03_GRAMMAR]
> - Need a new minigame? → `arcade.js` [05_UI_VIEWS]
> - Need a new view/screen? → `index.html` + `app.js` [01_CORE_ENGINE]
> - Need a new AI scenario? → `roleplay.js` [05_UI_VIEWS]
> - Need a new skill tree node? → `skill-tree.js` [03_GRAMMAR]
> - Need to change styling? → `styles.css` [01_CORE_ENGINE]
