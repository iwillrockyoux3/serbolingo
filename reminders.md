# 📌 SerboLingo — Master Upcoming Tasks & Reminders

> [!IMPORTANT]
> This document tracks all agreed upcoming features, content expansions, and deployment steps ready to be built in our next sessions.

## 📊 🏆 Industry Benchmark & Curriculum Scale Goals
**Objective**: Match or surpass the world's leading language apps in vocabulary count, lesson depth, and real-world practical phrases specifically for the **Serbian ↔ English** pair.

**Competitor Curriculum Benchmarks:**
- **Duolingo**: 
  - *Scale*: 2,000 to 3,000 unique words per full language track.
  - *Depth*: Hundreds of bite-sized levels taking users up to CEFR A2 level.
- **Babbel**:
  - *Scale*: 3,000 to 6,300 words and phrases across 30 to 80 units.
  - *Depth*: Structured grammar lessons taking learners to solid B1/B2 intermediate fluency.
- **Rosetta Stone**:
  - *Scale*: 20 units with 4 core lessons + immersive audio companion and storytelling.
  - *Depth*: Heavy focus on intuitive sentence context rather than raw memorization.
- **Memrise**:
  - *Scale*: 70+ lessons with 8,000+ words/phrases (and expanded flashcard decks over 15,000+ entries).
- **LingoDeer & Busuu**:
  - *Scale*: Comprehensive grammar guidebooks, stroke order / script tracing, and native dialogue review.
- **FluentU & LingQ**:
  - *Scale*: Real-world internet media immersion (videos, news, blogs, and infographics).

## 🎯 SerboLingo Target Standards (Beginner to Professional):
- [ ] **Full Bidirectional Fluency**:
  - 🇷🇸 ➡️ 🇬🇧 **Serbian to English Track**: Complete course taking native Serbian speakers from zero English to fluent/professional business & technical English.
  - 🇬🇧 ➡️ 🇷🇸 **English to Serbian Track**: Complete course taking English speakers from zero Serbian to fluent/professional Serbian (mastering Cyrillic, Latin, and all 7 cases).
- [ ] **CEFR Spectrum Coverage (Beginner to Professional)**:
  - **A1/A2 (Beginner & Elementary)**: Basics, alphabet, numbers, everyday survival vocabulary, simple present tense.
  - **B1/B2 (Intermediate & Independent)**: Past & future tenses, all 7 cases (Padeži), travel, culture, social life, conversational fluency.
  - **C1/C2 (Advanced & Professional)**: Business terminology, professional writing, formal speech, idioms, legal & medical vocabulary, advanced nuance and debates.
- [ ] **Massive Vocabulary Database Pool**: 5,000 to 10,000+ rich bilingual entries with audio, gender, phonetic guides, and contextual sentences.
- [ ] **Comprehensive Lesson Path**: 60 to 100+ Skill Tree modules ensuring users have more than enough content to reach true mastery without hitting a wall.

---

## ✅ Completed Core Infrastructure (DONE)
- [x] **Massive Dictionary Engine (IndexedDB / SQLite):** ✅ DONE
  - IndexedDB implemented in `db.js`. Dictionary loads from `seed-data.js`.
- [x] **⭐ Add to Flashcards from Omni-Bar:** ✅ DONE
  - Star button on search results saves words to SRS deck via `state.mistakeLog`.

---

## 🎮 Priority 1: Arcade Expansion (Reach 20 Total Minigames + Solo/Bot Mode)
We currently have 13 standalone minigames. We will add the 7 new minigames plus the mode selector:
- [ ] **Solo vs. AI Bot Mode Selector**:
  - Add a pre-game toggle when launching any minigame:
    - 👤 **Solo Mode**: Relaxed progression through Levels 1-10.
    - 🤖 **Vs. AI Bot Mode**: Race against simulated bot opponents (e.g. Marko_Bot, Ana_Bot) with live race progress bars.
- [ ] **Game #14: ⚡ Tačno/Netačno (Speed True/False)** — High-speed flash verification with 1.5s timer.
- [ ] **Game #15: 🖼️ Pogodi Sliku (Picture Match)** — Match Serbian/English words to emoji/icon grid visual options.
- [ ] **Game #16: 🔍 Osmosmerka (Word Search)** — Dynamic letter grid finding hidden vocabulary words.
- [ ] **Game #17: 📰 Ukrštenica (Mini Crossword)** — 4x4 / 5x5 crossword grid solving vocabulary clues letter-by-letter.
- [ ] **Game #18: 🟩 Rečko (Serbian Wordle / 5-Letter Guess)** — 5-guess deductive vocabulary puzzle with color-coded hints.
- [ ] **Game #19: 🎈 Baloni (Bubble Pop / Floating Words)** — Tap floating bubbles with correct translations before they float away.
- [ ] **Game #20: 🧺 Razvrstaj (Gender & Case Sorter)** — Rapidly categorize falling words into grammatical baskets (Muški, Ženski, Srednji / Cases).

## 🌐 Priority 2: Istraži / Web & Media Learning Hub (Pop Culture & 3-Tab Explorer)
- [ ] **Dedicated External Learning Search Engine**:
  - Search any Serbian/English topic (e.g., "Ordering food in Belgrade", "Serbian past tense", "Top slang").
  - Categorized into 3 Interactive Tabs:
    - 🎬 **Video Tab**: Embedded educational YouTube video lessons and authentic dialogues playable right in the app.
    - 🖼️ **Pictures / Infographics Tab**: Visual grammar charts, case tables, and vocabulary infographic posters.
    - 📄 **Text & Articles Tab**: Real Serbian news snippets, cultural blog posts, and reading passages with built-in tap-to-translate.
- [ ] **🍿 Pop Culture & Entertainment Immersion**:
  - 🎨 **Crtaći & Anime (Serbian Dubbed Cartoons & Anime)**: Learn with clear cartoon voice acting (SpongeBob, Disney, anime in Serbian).
  - 🍿 **Kultne Scene (Iconic Yugoslav & Serbian Cinema)**: Clips from “Ko to tamo peva”, “Maratonci”, “Munje”, and “Južni vetar” with dual-language subtitles.
  - 📖 **Stripovi & Comics**: Interactive Balkan comic panels (e.g., Alan Ford, Zagor, webcomics) with tap-to-translate dialogue bubbles.
  - 🎬 **Serijske Drame (TV Show Clips)**: Real conversational drama and comedic dialogue clips.

## 📸 Priority 3: AI Visual Lens ("Snap & Translate" / Camera Learning)
- [ ] **Camera / Image Recognition (Gemini Vision API)**:
  - Add a Camera icon button in the Omni-Bar / Home View.
  - Allows the user to take a photo or upload an image using their phone camera.
  - **Object Mode**: Identifies objects in real life (e.g. snap a photo of an apple -> gives Jabuka / Apple, gender, pronunciation audio, example sentence).
  - **Text / OCR Mode**: Reads real-world signs, restaurant menus, book pages, or labels and provides instant Serbian ↔ English translation.
  - **1-Click Save**: Add any scanned object or translated text directly into user's Flashcards & Spaced Repetition deck.

## ✍️ Priority 4: Cyrillic Script Handwriting / Finger Tracing (Azbuka Tracing)
- [ ] **Interactive Letter Tracing (LingoDeer-Style)**:
  - Canvas-based or SVG touch-tracing engine for all 30 Serbian Cyrillic letters (А, Б, В, Г, Д, Ђ, Ж, З, И, Ј, К, Л, Љ, М, Н, Њ, О, П, Р, С, Т, Ћ, У, Ф, Х, Ц, Ч, Џ, Ш).
  - Stroke-order guidance, glowing trace path, and instant haptic/audio confirmation upon perfect letter formation.

## 📑 Priority 5: Unit "Cheat Sheet" Grammar Notes (LingoDeer-Style)
- [ ] **Bite-Sized Grammar Guides**:
  - A quick "Guidebook / Tips" tab attached to each Skill Tree node.
  - Visual charts breaking down why grammatical shifts happen (e.g., Kuća ➡️ U kući, Prijatelj ➡️ Prijatelji) in simple 1-minute visual explanations before lessons start.

## 🎶 Priority 6: Bilingual Karaoke Reader (Karaoke Mode #1: Dual-Text & Audio)
- [ ] **LingQ & Beelinguapp Style Dual Reader**:
  - Serbian folk tales, short modern stories, and cultural news with synchronized side-by-side English translations.
  - Karaoke text highlighting matching the spoken audio. Tap any individual word to see definition, case, gender, and save to flashcards.

## 🧩 Priority 7: Cloze Mastery (Fill-in-the-Blank Context Engine)
- [ ] **Busuu / Clozemaster Context Trainer**:
  - 5,000+ real conversational Serbian sentences with 1 key missing word.
  - Rapid-fire contextual fill-in-the-blank practice to build natural language instincts.

## 🎵 Priority 8: Muzika & Tekstovi (Karaoke Modes #2 & #3: Music & Live Singing)
- [ ] **Karaoke Mode #2: Song Lyrics Rhythm Trainer**:
  - Learn language through classic Serbian rock (Bajaga, Riblja Čorba, Bijelo Dugme), pop (Zdravko Čolić), and traditional folk classics (Tamo Daleko).
  - Interactive lyrics trainer: fill in missing lyric blocks in real-time as the song plays.
- [ ] **Karaoke Mode #3: Live Sing-Along Microphone Scoring (Karaoke Bar Mode)**:
  - Full sing-along mode: hold the phone, sing the Serbian song lyrics into the microphone as the backing track plays.
  - Uses the Web Speech API and Web Audio analyzer to grade your Serbian pronunciation, pitch accuracy, and rhythm, awarding stars and XP!

## 📖 Priority 9: Interactive Stories Mode ("Serbian Stories / Priče")
- [ ] **Voiced Cultural Mini-Stories**:
  - Immersive dialogues and cultural tales (e.g., “A Night Out in Skadarlija”, “Buying at Kalenić Pijaca”, “The Lost Passport”).
  - Native TTS audio narration with animated character bubbles.
  - Interactive mid-story comprehension checkpoints (tap to continue, choose what happens next).

## 🚗 Priority 10: Hands-Free / Commute Audio Mode
- [ ] **Screen-Locked Audio Trainer (Pimsleur-Style)**:
  - Audio-only lesson flow designed for driving, walking, or working out.
  - Prompts the user with English/Serbian audio cue → gives a 3-second thinking pause → plays native response audio.
  - Background audio playback support.

## 🛡️ Priority 11: Streak Freeze & Daily Quests Shop
- [ ] **Gamification Expansion**:
  - **Streak Freeze (Štit za Niz)**: Purchase or earn shields that protect streak if the user misses a day.
  - **Daily Quests (Dnevne Misije)**: 3 daily missions (e.g., "Earn 60 XP", "Score 90% in Speed Typer", "Learn 5 New Words") awarding bonus gems and XP boosts.

## 🧠 Priority 12: The Mistake Vault ("Moje Greške" / Smart Error Review)
- [ ] **1-Click Mistake Clearing**:
  - Automatically captures any question or word answered incorrectly in lessons, skill tree, or minigames.
  - Dedicated "Mistakes" review screen with SRS prioritization to clear weaknesses permanently.

## 🇷🇸 Priority 13: Authentic Serbian Slang & Žargon Module
- [ ] **Real Street Serbian & Dialects**:
  - Dedicated modules for Belgrade slang (“Brate”, “Bleja”, “Šta ima”), coffee culture expressions, and Balkan idioms.
  - Dialect toggle notes: Belgrade (Šumadijsko-vojvođanski) vs. Niš / Southern Serbian vs. Western / Diaspora expressions.

## 📈 Priority 14: Serbian Pitch-Accent & Melodic Pronunciation Guide
- [ ] **Visual Pitch Waveform & Intonation**:
  - Educational guide and audio trainer for the 4 Serbian vowel accents (Kratkosilazni, Dugo-silazni, Kratkouzlazni, Dugouzlazni).
  - Visual intonation curves showing native speaker melody vs. flat robotic speech.
  - **Voice Pitch-Waveform Visualizer (Moonshot Integration):** When doing pronunciation/karaoke, show a visual sound-wave of the user's voice layered directly on top of a native speaker's sound-wave, so they can visually see if their pitch went up when it should have gone down.

## 📚 Priority 15: Massive Vocabulary Database Expansion
- [ ] **Thousands of Categorized Words (seed-data.js & IndexedDB)**:
  - Expand to match Babbel/Duolingo scale (5,000+ words/phrases).
  - Comprehensive parts of speech: Nouns, Verbs, Adjectives, Adverbs, Common Phrases & Idioms.
  - Include phonetic pronunciation helpers, grammatical gender flags, and usage examples.

## 🌳 Priority 16: Giant Skill Tree Expansion
- [ ] **Sprawling Tree Structure (skill-tree.js)**:
  - Expand from the initial 8 starter nodes to a full multi-unit tree covering Beginner to Advanced mastery.
  - New Major Units & Branches:
    - ✈️ Travel & Directions (Airport, Transport, Navigation)
    - 💼 Business & Work (Office, Tech, Formal register)
    - ❤️ Dating & Social Life (Small talk, Slang, Dating)
    - ⏳ Grammar Mastery: Tenses (Past Tense / Perfekat, Future Tense / Futur I & II, Present)
    - 🏛️ Grammar Mastery: The 7 Serbian Cases (Nominativ, Genitiv, Dativ, Akuzativ, Vokativ, Instrumental, Lokativ)

## 🎭 Priority 17: Extended Roleplay & AI Chat Scenarios
- [ ] **Deep Scenario Library (roleplay.js)**:
  - Add dozens of new specialized AI scenario prompts:
    - 🏨 Hotel Check-in & Room Service
    - ✈️ Airport Security & Customs
    - 🩺 Doctor's Office & Pharmacy
    - 🏢 Job Interview in Belgrade
    - 🍽️ Ordering at a Traditional Kafana with wine pairings
    - 🚨 Emergency / Lost Passport Assistance

## 📱 Priority 18: Progressive Web App (PWA) Offline Deployment
- [ ] **PWA Offline Support**:
  - Create `manifest.json` with app icons, theme colors, and standalone display mode.
  - Create `sw.js` (Service Worker) to cache all HTML, CSS, JS, audio, and database assets.
  - Enables "Add to Home Screen" installation on iOS & Android phones for 100% offline usage without App Stores.

## 🚀 Priority 19: Google Play Store & App Store Packaging (Capacitor)
- [ ] **Capacitor Integration**:
  - Initialize Capacitor: `com.serbolingo.app`
  - Add Android platform: `npx cap add android`
  - Sync web assets: `npx cap sync`
- [ ] **Native Google Sign-In Plugin**:
  - Google Cloud Console OAuth setup.
  - Capacitor Google Auth plugin for 1-tap Google login on physical phones.
- [ ] **Google Play Store Release ($25 one-time account fee)**:
  - Generate signed release Android App Bundle (AAB).
  - Create store listing, screenshots, feature graphics, and privacy policy.
  - Submit to Google Play Console.
  - Wrap the pure Vanilla HTML/JS codebase using a tool like Capacitor (by Ionic) to compile into native `.apk` / `.aab` (Android) and `.ipa` (iOS) files for wider reach.

## ✍️ Priority 20: Štampana i Pisana Slova (Printed vs. Cursive Script)
- [ ] **Display Option (Settings):**
  - Let the user choose how letters are visually displayed across the app:
    - Štampana slova (Printed/Block) — Default, standard screen fonts.
    - Pisana slova (Cursive/Handwritten) — Uses a Serbian cursive font for a handwritten look.
    - This applies to both Latin and Cyrillic independently (4 combinations total).
- [ ] **Dedicated Lessons:** Create lesson modules specifically for learning to read and recognize:
  - Latinica štampana slova (Printed Latin characters).
  - Latinica pisana slova (Cursive Latin characters).
  - Ćirilica štampana slova (Printed Cyrillic characters).
  - Ćirilica pisana slova (Cursive Cyrillic characters).

## 🚀 Priority 21: V3.0 Moonshot Features
- [ ] **Smartwatch Companion (Wear OS / Apple Watch)**:
  - A micro-app for the wrist that gives users a 60-second flashcard session, a "Word of the Day" notification, or lets them practice speaking into their watch while walking.
- [ ] **AR (Augmented Reality) Object Tagging**:
  - Instead of just translating text, the user points their phone camera at a physical object in their room (like a table, dog, or window), and the app uses AI image recognition to make the Serbian word float in 3D space over the object.
- [ ] **Home Screen Widgets**:
  - iOS and Android native widgets so the user can see their Streak, Daily XP goal, or a "Serbian Word of the Day" right on their phone's home screen without even opening the app.

---

## 🎮 Phase 8: Online Arena & Multiplayer (AFTER Play Store Launch)
> [!IMPORTANT]
> Do NOT start this phase until the app is published on the Google Play Store and has real users.
> The app must remain 100% offline-functional. Multiplayer is an ADDITIVE layer, not a replacement.

- [ ] **Global Leaderboards:**
  - Display top scores for Milioner, Speed Typer, and other Arcade games.
  - Sync high scores to a cloud database.
- [ ] **Real-Time PvP Duels:**
  - Head-to-head trivia and translation battles against real players with matchmaking.
  - Matchmaking lobby with ELO-style ranking.
- [ ] **Backend Server Setup / Recommended Options (Free Tier):**
  - **Firebase (Spark Plan):** Free Firestore real-time DB. Best for turn-based games (trivia duels, flashcard battles). Handles auth and user storage for free.
  - **Supabase (Free Plan):** Open-source Firebase alternative on Postgres. Built-in `Supabase Realtime` broadcasts player actions without needing a custom WebSocket server.
  - **Serv00:** Free permanent FreeBSD server (Polish hosting). Full SSH access, supports Node.js/Python, no forced sleep. Good for a custom WebSocket matchmaking server.
  - **Koyeb (Free Tier):** 512 MB RAM free web service. Good for lightweight socket servers without aggressive sleep.
  - **Apinator:** Free hosted WebSocket layer. Up to 500 concurrent connections and 500,000 messages/day. Frontend connects directly to their API.
- [ ] **Implementation Notes:**
  - Use Firebase/Supabase JS SDK via `<script>` tag (no build step needed, stays Vanilla JS).
  - All multiplayer features must gracefully degrade when offline (show cached leaderboard, disable PvP button).
  - Anti-cheat: Server-side score validation required for leaderboard integrity.
