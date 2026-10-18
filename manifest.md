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
| [`index.html`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/index.html) | 1,077 | 86 KB | Main SPA shell — all 12 views, modals, nav, SVG icons, CDN imports |
| [`app.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/app.js) | 3,251 | 185 KB | Core controller — state management, auth, navigation, Omni-Bar search, daily reset, XP/streak/hearts, Chart.js stats, Canvas whiteboard, TTS pipeline, Gemini AI handlers, UI_STRINGS localization |
| [`db.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/db.js) | 227 | 9 KB | IndexedDB wrapper (`SerboLingoDB` v5) — dictionary store, seeding, category queries, search, chunk injection |
| [`styles.css`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/styles.css) | 451 | 9 KB | Tailwind extensions — custom animations (confetti, arcade-fall/flip/pulse), 3D squishy buttons, progress ring, radar chart, dark mode theme |

## [02_VOCAB_SRS] — Vocabulary Database & Spaced Repetition

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`seed-data.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/seed-data.js) | 3,458 | 698 KB | Master offline dictionary — ~3,500 entries with EN/SR translations, gender, part of speech, phonetics, difficulty tiers, bilingual example sentences |
| [`seed-data.json`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/seed-data.json) | — | — | Backup/alternate JSON format of the dictionary |

> **SRS Logic Lives In**: `app.js` (mistake tracking via `state.mistakeLog`, star/favorites system, review lesson generation)

## [03_GRAMMAR] — Grammar Engine, Skill Tree & Question Generation

| File | Lines | Size | Description |
|:-----|------:|-----:|:------------|
| [`skill-tree.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/skill-tree.js) | 675 | 68 KB | 15-tier curriculum (Foundation → C1/C2 Nuances), 5-crown progression (3 lessons/crown), prerequisite logic, bilingual grammar guides per node |
| [`question-engine.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/question-engine.js) | 637 | 27 KB | 12+ question type generator — MCQ, speech recognition, picture/emoji, listening, fill-blank, scrambled word order, canvas whiteboard, hangman, matching pairs, letter-by-letter spelling, drag-drop punctuation |
| [`alphabet-data.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/alphabet-data.js) | 73 | 7 KB | Complete 30-letter Serbian alphabet matrix — Latin + Cyrillic with anchor words, emojis, phonetics |
| [`grammar-tooltips.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/grammar-tooltips.js) | 1,280 | 70 KB | Smart Grammar Tooltips & Interactive Word Inspector — Deep linguistic engine (SR_CORE_GRAMMAR, EN_CORE_GRAMMAR, SEED_DATA indexing), gender/tense/case badges, collocations, syntax notes, bilingual audio & examples |

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
| [`touch-haptics.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/touch-haptics.js) | 260 | 11 KB | Native Touch Gestures & Haptics — Swipe-to-dismiss modals with spring physics, left edge swipe back to Home, punchy haptic vibrations |

| [`karaoke.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/karaoke.js) | 572 | 28 KB | Bilingual speech-recognition reader — levels A1-B2, live word tracking, word translations, TTS replay |
| [`rhythm.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/rhythm.js) | 567 | 26 KB | Music lyrics synchronizer — YouTube IFrame API playback + SpeechRecognition singing/recitation scoring |
| [`cloze.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/cloze.js) | 224 | 15 KB | Fill-in-the-blank context trainer — sentence bank, scoring, streaks |
| [`slang.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/slang.js) | 200 | 12 KB | Belgrade/Southern/Kafana slang database — pronunciation, literal vs actual meanings, usage examples, slang quiz |
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
