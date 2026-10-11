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
- [x] Massive Dictionary Engine (IndexedDB / SQLite): IndexedDB implemented in db.js. Dictionary loads from seed-data.js.
- [x] ⭐ Add to Flashcards from Omni-Bar: Star button on search results saves words to SRS deck via state.mistakeLog.

---

## 📚 Priority 1: Massive Vocabulary Database Expansion
- [ ] **Thousands of Categorized Words (seed-data.js & IndexedDB)**:
  - Expand database to reach **15,000+ words and phrases** (massive scaling goal).
- [x] Comprehensive parts of speech: Nouns, Verbs, Adjectives, Adverbs, Common Phrases & Idioms. (DONE - seed-data.js has all POS)
- [x] Include phonetic pronunciation helpers, grammatical gender flags, and usage examples. (DONE - every entry has phonetic, pos, example_en, example_sr)
- [ ] **Omni-Bar "Fuzzy Search" & Typo Tolerance**:
  - Implement a Levenshtein Distance (Fuzzy Search) algorithm so the search bar auto-corrects typos (e.g. typing "yabuka" instead of "jabuka") and handles missing Cyrillic characters gracefully.

## ✅ Priority 2: Giant Skill Tree Expansion
- [x] Sprawling Tree Structure (skill-tree.js): Expanded to 82 multi-unit nodes covering Beginner to Advanced mastery, including Travel, Business, Dating, Tenses, and all 7 Cases.
## ✍️ Priority 3: Štampana i Pisana Slova (Printed vs. Cursive Script)
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

## ✍️ Priority 4: Cyrillic Script Handwriting / Finger Tracing (Azbuka Tracing)
- [ ] **Interactive Letter Tracing (LingoDeer-Style)**:
  - Canvas-based or SVG touch-tracing engine for all 30 Serbian Cyrillic letters (А, Б, В, Г, Д, Ђ, Ж, З, И, Ј, К, Л, Љ, М, Н, Њ, О, П, Р, С, Т, Ћ, У, Ф, Х, Ц, Ч, Џ, Ш).
  - Stroke-order guidance, glowing trace path, and instant haptic/audio confirmation upon perfect letter formation.

## ✅ Priority 5: Unit "Cheat Sheet" Grammar Notes (LingoDeer-Style)
- [x] Bite-Sized Grammar Guides: A quick "Guidebook / Tips" tab attached to each Skill Tree node via guideHtml. Visual charts breaking down grammatical shifts in simple explanations before lessons start.
## ✅ Priority 6: The Mistake Vault ("Moje Greške" / Smart Error Review)
- [x] 1-Click Mistake Clearing: Automatically captures any question or word answered incorrectly in lessons, skill tree, or minigames. Dedicated "Mistakes" review screen with SRS prioritization to clear weaknesses permanently.
- [ ] **True SRS Algorithm (SuperMemo-2)** *(Pending Upgrade)*:
  - Implement the SM2 mathematical algorithm to properly space out reviews (1 day, 3 days, 10 days) for true long-term memory retention instead of just basic mistake logging.

## ✅ Priority 7: Streak Freeze & Daily Quests Shop (DONE)
- [x] **Gamification Expansion**:
  - [x] **Streak Freeze (Štit za Niz)**: Purchase shields with XP in Shop modal; automatically protects user streak if a day is missed.
  - [x] **Daily Quests (Dnevne Misije)**: 3 daily missions generated from dynamic quest pool with progress bars, rewards (+10-20 XP), and Mystery Chest all-complete celebration.
  - [x] **In-App XP Shop (#shop-modal)**: Spend earned XP on Streak Freezes (200 XP), Double XP 1h (150 XP), Heart Refills (100 XP), and Mystery Chest rolls (300 XP).

## ✅ Priority 8: Istraži / Web & Media Learning Hub (Pop Culture & 3-Tab Explorer)
- [x] Dedicated External Learning Search Engine: Search any Serbian/English topic. Categorized into 3 Interactive Tabs: 🎬 Video Tab (embedded YouTube lessons), 🖼️ Pictures / Infographics Tab (grammar charts, case tables), 📄 Text & Articles Tab (Serbian news, blog posts, reading passages with tap-to-translate).
- [ ] **🍿 Pop Culture & Entertainment Immersion** *(content expansion still TODO)*:
  - 🎨 **Crtaći & Anime (Serbian Dubbed Cartoons & Anime)**: Learn with clear cartoon voice acting (SpongeBob, Disney, anime in Serbian).
  - 🍿 **Kultne Scene (Iconic Yugoslav & Serbian Cinema)**: Clips from "Ko to tamo peva", "Maratonci", "Munje", and "Južni vetar" with dual-language subtitles.
  - 📖 **Stripovi & Comics**: Interactive Balkan comic panels (e.g., Alan Ford, Zagor, webcomics) with tap-to-translate dialogue bubbles.
  - 🎬 **Serijske Drame (TV Show Clips)**: Real conversational drama and comedic dialogue clips.

## ✅ Priority 9: Bilingual Karaoke Reader (Karaoke Mode #1: Dual-Text & Audio)
- [x] LingQ & Beelinguapp Style Dual Reader: Serbian folk tales, short modern stories, and cultural news with synchronized side-by-side English translations. Karaoke text highlighting matching the spoken audio. Tap any individual word to see definition, case, gender, and save to flashcards.
## ✅ Priority 10: Muzika & Tekstovi (Karaoke Modes #2 & #3: Music & Live Singing)
- [x] Karaoke Mode #2 — Song Lyrics Rhythm Trainer: Learn language through classic Serbian rock (Bajaga, Riblja Čorba, Bijelo Dugme), pop (Zdravko Čolić), and traditional folk classics (Tamo Daleko). Interactive lyrics trainer: fill in missing lyric blocks in real-time as the song plays.
- [x] Karaoke Mode #3 — Live Sing-Along Microphone Scoring (Karaoke Bar Mode): Full sing-along mode with Web Speech API and Web Audio analyzer to grade Serbian pronunciation, pitch accuracy, and rhythm, awarding stars and XP!
- [x] **UI Wired**: rhythm.js script tag added to index.html. Launch tile added in Arcade grid ("Muzika & Tekstovi").

## ✅ Priority 11: Interactive Stories Mode ("Serbian Stories / Priče")
- [x] Voiced Cultural Mini-Stories: Immersive dialogues and cultural tales (e.g., "A Night Out in Skadarlija", "Buying at Kalenić Pijaca", "The Lost Passport"). Native TTS audio narration with animated character bubbles. Interactive mid-story comprehension checkpoints (tap to continue, choose what happens next).
- [x] **UI Wired**: stories.js script tag added to index.html. Launch tile added in Arcade grid ("Priče").

## ✅ Priority 12: Arcade Expansion (40 Total Minigames & Modes + Solo/Bot Mode)
- [x] Solo vs. AI Bot Mode Selector: Solo Mode (Levels 1-10) and Vs. AI Bot Mode (Marko Bot, Ana Bot) with live race progress bars.
- [x] **40 Total Minigames & Interactive Modes built & wired in Arcade Grid**: Karaoke Reader, Milioner, Spojnice, Kucanje, Udari Reč, Vešala, Slagalica, Slepi Miš, Zmija, Papagaj, Prevodilac, Memorija, Graditelj Rečenica, Tačno/Netačno, Pogodi Sliku, Osmosmerka, Ukrštenica, Rečko, Baloni, Razvrstaj, Freestyle Rap, Rep Bitka, Padajuće Reči, Ruski Rulet (Lockout), Bomba, Svemirski Osvajači, Simon Kaže, Kolo Sreće, Blokovi, Iznenadna Smrt, Priče, Popuni Prazninu, Sleng & Žargon, Akcenat, Muzika & Tekstovi, Brza Trka, Dvoboj, Pijaca, Pikado, Detektiv.
<!-- -->
- [ ] **Local Trophy Cabinet** *(Pending Upgrade)*:
  - Build a showcase room tracking high scores, win streaks against the Bots, and awarding Bronze/Silver/Gold medals for minigames.

## ✅ Priority 13: Cloze Mastery (Fill-in-the-Blank Context Engine)
- [x] Busuu / Clozemaster Context Trainer: 5,000+ real conversational Serbian sentences with 1 key missing word. Rapid-fire contextual fill-in-the-blank practice to build natural language instincts.
- [x] **UI Wired**: cloze.js script tag added to index.html. Launch tile added in Arcade grid ("Popuni Prazninu").

## ✅ Priority 14: Extended Roleplay & AI Chat Scenarios
- [x] Deep Scenario Library (roleplay.js): Dozens of specialized AI scenario prompts — 🏨 Hotel Check-in & Room Service · ✈️ Airport Security & Customs · 🩺 Doctor's Office & Pharmacy · 🏢 Job Interview in Belgrade · 🍽️ Ordering at a Traditional Kafana with wine pairings · 🚨 Emergency / Lost Passport Assistance
- [x] **UI Wired**: All 6 specialized scenario buttons added to the "AI Razgovor" banner in Arcade view (index.html).

## ✅ Priority 15: Authentic Serbian Slang & Žargon Module
- [x] Real Street Serbian & Dialects: Dedicated modules for Belgrade slang ("Brate", "Bleja", "Šta ima"), coffee culture expressions, and Balkan idioms. Dialect toggle notes: Belgrade (Šumadijsko-vojvođanski) vs. Niš / Southern Serbian vs. Western / Diaspora expressions.
- [x] **UI Wired**: slang.js script tag added to index.html. Launch tile added in Arcade grid ("Sleng & Žargon").

## ✅ Priority 16: Serbian Pitch-Accent & Melodic Pronunciation Guide
- [x] Visual Pitch Waveform & Intonation: Educational guide and audio trainer for the 4 Serbian vowel accents (Kratkosilazni, Dugo-silazni, Kratkouzlazni, Dugouzlazni). Visual intonation curves showing native speaker melody vs. flat robotic speech. Voice Pitch-Waveform Visualizer: visual sound-wave of user's voice layered on top of native speaker's sound-wave.
- [x] **UI Wired**: pitch-accent.js script tag added to index.html. Launch tile added in Arcade grid ("Akcenat").

## ✅ Priority 17: Hands-Free / Commute Audio Mode (DONE)
- [x] Screen-Locked Audio Trainer (Pimsleur-Style)
- [x] Audio-only lesson flow designed for driving, walking, or working out.
- [x] Prompts the user with English/Serbian audio cue, gives a thinking pause, plays native response audio.
- [x] Background audio playback support.
- [x] Bidirectional learning tied to profile language direction setting.

## ✅ Priority 18: AI Visual Lens ("Snap & Translate" / Camera Learning)
- [x] **Camera / Image Recognition (Gemini Vision API)**:
  - [x] Add a Camera icon button in the Omni-Bar / Home View (#omni-camera launches Visual Lens modal).
  - [x] Allows user to take a photo or upload an image using phone camera (capture="environment" for rear camera).
  - [x] **Object Mode**: Identifies objects in real life (e.g. Jabuka / Apple, gender [ž.r.], phonetic, pronunciation audio, example sentence).
  - [x] **Text / OCR Mode**: Reads real-world signs, restaurant menus, book pages, or labels and provides instant Serbian ↔ English translation.
  - [x] **1-Click Save**: Add any scanned object or translated text directly into user's Flashcards & Spaced Repetition deck.
  - [x] **Zero-Key Offline Demo**: Instant sample testing for Jabuka, Kafa, and Restoranski meni without needing an active API key.
<!-- -->
- [ ] **Pending Polish & Camera Refinements** *(To be built in return pass)*:
  - [ ] **Live Camera Viewfinder / WebRTC Stream**: Add direct live webcam / phone camera video feed (`navigator.mediaDevices.getUserMedia`) with a snap shutter button when pressing "Uslikaj kamerom" on PC/phone instead of file prompt.
  - [ ] **Scrollable OCR Output Container**: Make large/long translated OCR text passages smoothly scrollable with max-h and touch overflow-y scrolling so lengthy menus or book pages don't overflow the viewport.
  - [ ] **Auto-Reset on Modal Exit**: Automatically reset and clear the image preview, base64 cache, and previous analysis results when the user closes (closeModal()) and re-enters the Visual Lens modal, starting with a fresh clean viewfinder.

## 📱 Priority 19: Progressive Web App (PWA) Offline Deployment
- [ ] **PWA Offline Support**:
  - Create `manifest.json` with app icons, theme colors, and standalone display mode.
  - Create `sw.js` (Service Worker) to cache all HTML, CSS, JS, audio, and database assets.
  - Enables "Add to Home Screen" installation on iOS & Android phones for 100% offline usage without App Stores.

## 🚀 Priority 20: Google Play Store & App Store Packaging (Capacitor)
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

## 🎮 Priority 21: Online Arena & Multiplayer (AFTER Play Store Launch)
> [!IMPORTANT]
> Do NOT start this phase until the app is published on the Google Play Store and has real users.
> The app must remain 100% offline-functional. Multiplayer is an ADDITIVE layer, not a replacement.

- [x] **Offline "Ghost Bots" (Friend Codes) — (PART 1 COMPLETE)**:
  - [x] Generate a short "Friend Code" from a user's stats (correctAnswers, 	otalAnswers, speed).
  - [x] Users can input a code to download a friend's "Bot Profile" (GhostEngine.importCode).
  - [x] Play offline against your friend's ghost! The bot simulates their exact accuracy (e.g. 68%) and speed in Arcade races.
  - [x] Ghost Arena modal (#ghost-arena-modal) with 1-click Friend Code copying, starter ghosts (Luka, Milica), and Head-to-Head win/loss tracking.
- [ ] **Part 2: Cloud Backend & Online Multiplayer (AFTER Play Store Launch & All Priorities)**:
  - [ ] **Global Leaderboards**: Display top scores for Milioner, Speed Typer, and other Arcade games synced to cloud.
  - [ ] **Real-Time PvP Duels**: Head-to-head live battles with matchmaking lobby.
  - [ ] **Backend Server Setup / Recommended Options (Free Tier)**:
    - **Firebase (Spark Plan)**: Free Firestore real-time DB. Best for async ghost data storage, leaderboards, and turn-based games. Handles auth and user storage for free.
    - **Supabase (Free Plan)**: Open-source Firebase alternative on Postgres. Built-in Supabase Realtime broadcasts player actions without needing a custom WebSocket server.
    - **Serv00**: Free permanent FreeBSD server (Polish hosting). Full SSH access, supports Node.js/Python, no forced sleep. Good for a custom WebSocket matchmaking server if doing live PvP.
    - **Koyeb (Free Tier)**: 512 MB RAM free web service. Good for lightweight socket servers without aggressive sleep.
    - **Apinator**: Free hosted WebSocket layer. Up to 500 concurrent connections and 500,000 messages/day. Frontend connects directly to their API.
  - [ ] **Implementation Notes**:
    - Use Firebase/Supabase JS SDK via <script> tag (no build step needed, stays Vanilla JS).
    - All multiplayer features must gracefully degrade when offline (show cached leaderboard, disable PvP button).
    - Anti-cheat: Server-side score validation required for leaderboard integrity.

## 🚀 Priority 22: V3.0 Moonshot Features
- [ ] **Smartwatch Companion (Wear OS / Apple Watch)**:
  - A micro-app for the wrist that gives users a 60-second flashcard session, a "Word of the Day" notification, or lets them practice speaking into their watch while walking.
- [ ] **AR (Augmented Reality) Object Tagging**:
  - Instead of just translating text, the user points their phone camera at a physical object in their room (like a table, dog, or window), and the app uses AI image recognition to make the Serbian word float in 3D space over the object.
- [ ] **Home Screen Widgets**:
  - iOS and Android native widgets so the user can see their Streak, Daily XP goal, or a "Serbian Word of the Day" right on their phone's home screen without even opening the app.


## 🌍 Priority 23: The "Ultimate Learning App" Expansion (Multi-Language Ecosystem)
- [ ] **Universal Language Engine (Central Concept Schema)**:
  - Transition the database from a simple bilingual list to a "Master Concept ID" system. (e.g., Concept #0001 contains translations for English, Serbian, Spanish, Japanese, etc. in a single row).
  - Allow users to pair *any* two languages they want (e.g., learn Japanese from Spanish). Flashcards, Arcade games, and Skill Trees automatically adapt to the chosen pair.
- [ ] **Massive Offline Text Scaling (IndexedDB)**:
  - Safely scale to 10+ languages. 15,000 words per language is highly optimized text data (<100MB total), ensuring it runs lightning-fast on budget devices without crashing the active RAM.
- [ ] **Modular Audio Language Packs**:
  - To prevent app bloat from massive audio files, implement downloadable offline "Audio Packs" (e.g., "Download Spanish Voice Pack - 150MB").
  - Fall back to lightweight native device Text-to-Speech (TTS) for users who don't want to download large MP3 packs.


## ✅ Priority 24: Save Data Sync System (Data Backup & Restore) (DONE)
- [x] **Local Progress Export**:
  - [x] Add a button in Settings that lets users export their profile, XP, streaks, settings, shop items, and ghost roster to a .json file (pp.exportSaveData).
  - [x] Add an import function to allow users to move their progress to another device, protecting their local data from accidental cache clears (pp.importSaveData).
  - [x] 100% offline client-side Blob generation and FileReader rehydration with schema validation and confirmation safety.

## 👆 Priority 25: Native Mobile Touch Gestures
- [ ] **Swipe Physics (Touch API)**:
  - Add native-feeling swipe-to-go-back and swipe-down-to-dismiss gestures for UI injections and bottom sheets.
  - Make the SPA feel like a real downloaded app rather than a rigid website.

## ✅ Priority 26: Gamification & Economy (Duolingo Hooks) (DONE)
- [x] **Streak Freezes & Shop**: In-app "Prodavnica" modal where users spend XP to buy Streak Freezes, Heart Refills, and Double XP power-ups.
- [x] **Daily Quests & Mystery Chests**: 3 specific daily goals with progress bars. Completing all 3 unlocks a Mystery Chest with bonus XP and confetti celebration.

## 🧠 Priority 27: Learning Science & SRS (Anki Power)
- [ ] **Memory Heatmap (Brain Health)**: Upgrade the Stats tab to include a visual heatmap showing which words are fading and need review.
- [ ] **Tinder-Style Swipe Reviews**: Offer a quick "Flashcard Swipe" mode before hardcore lessons. Swipe right if known, left if not.

## 📱 Priority 28: Adaptive UX & Flow
- [ ] **Adaptive Placement Test**: Build a 3-minute test for new users that fires increasing difficulty questions to auto-unlock skill tree tiers.
- [ ] **Smart Grammar Tooltips**: Tapping a word (e.g. "školu") shows a smart tag like "Accusative Case (Direction) of 'škola'" instead of just translation.

## ⚙️ Priority 29: Technical Power-Ups
- [ ] **Offline Audio Bundles**: Add "Download Offline Audio Pack" to save pre-generated MP3s for 1,000 common words into IndexedDB for airplane mode.
- [ ] **Peer-to-Peer Friend Codes**: Let users generate a code to share stats and compete on a mini-leaderboard without a massive cloud backend.

## 🎭 Priority 30: "Untranslatable" Cultural Idioms & Slang
- [ ] **Idioms & Terms of Endearment**: Expand slang curriculum with phrases like "ljubi te baka sine" or "Dušo moja".
- [ ] **Cultural Context Notes**: Teach not just the literal translation, but exactly when and to whom these emotional phrases are used.

## ⌨️ Priority 31: Keyboard Tolerance & Diacritic Normalization
- [x] **Bald Latin (Ošišana latinica) Support**: Native engine automatically normalizes š->s, č/ć->c, ž->z, and đ->dj during answer checking. (ALREADY IMPLEMENTED in app.js checkAnswer normalize())
- [ ] **Gentle Typo Feedback**: Pop up a gentle tip (e.g., "Correct! But watch out, the proper spelling has a š") when the user relies on Bald Latin shortcuts.

## 🏆 Priority 32: Advanced Gamification & Social (The League System)
- [ ] **Ranked Leagues**: Bronze, Silver, Gold, Diamond, and Obsidian leagues. Users are grouped with 30 random people weekly. Top 10 advance, bottom 5 demote.
- [ ] **Timed XP Boosts**: "Early Bird" (practice before 9 AM) grants a 15-minute 2x XP boost to use later that evening, building a twice-a-day habit.
- [ ] **Profile Avatars & Titles**: Unlockable animated avatars and titles (e.g., "Kafana Legend", "Grammar Nerd") bought with in-app gems.

## 🤖 Priority 33: "Explain My Mistake" AI Tutor
- [ ] **Gemini Grammar Breakdown**: When a user gets a question wrong (e.g., typing "Ja sam dobar" instead of "Ja sam dobra"), add an "Explain Why" button. The AI briefly explains the grammar rule (gender/case) based on the exact mistake made.
- [ ] **AI Accent Coach**: Give a 0-100% pronunciation score comparing the user's voice pitch to a native Belgrade speaker.

## 📺 Priority 34: Real-World Native Media & Immersion
- [ ] **Native Speaker Clips**: Short 3-second looping video/audio clips of actual locals pronouncing difficult words or slang on the street.
- [ ] **Hardcore Immersion Mode**: A toggle in settings that turns the *entire app UI* into Serbian. Zero English is allowed. Good for advanced learners.

## 📳 Priority 35: Accessibility & Sensory Feedback
- [ ] **Haptic Feedback**: Use `navigator.vibrate` to trigger tiny micro-vibrations on the phone when tapping keys, and a heavier double-buzz when answering wrong.
- [ ] **Colorblind Mode**: Add visual textures/patterns to buttons so users don't have to rely purely on Green (Correct) and Red (Wrong).
- [ ] **Landscape Mode Optimization**: Adjust the Flexbox layout so the app looks beautiful on horizontal tablets and iPads, not just vertical phones.

## 🏗️ Priority 36: Infrastructure & Code Architecture Upgrades
- [ ] **Database Migration Engine**: Script a version-control system for `IndexedDB`. When we push a new `seed-data.js` with 10,000 new words, the app must safely merge it without deleting the user's saved flashcard progress.
- [x] **Data Chunking (Lazy Loading)**: db.js already has processChunk() and loadChunk() methods for background dictionary injection via script tags. (DONE)

## 🔔 Priority 37: Retention & Habit Building
- [ ] **Web Push Notifications**: Ask for notification permission to send a daily reminder: *"Your 5-day streak is in danger! Practice now."*
- [ ] **PWA & Home Screen Widgets**: Add a `manifest.json` so users can install it as a native app, and create an Android/iOS Widget that displays their Daily Streak right on their phone's home screen.

## 📚 Priority 38: Smart Paced Story Mode
- [ ] **Dynamic Bedtime Stories**: Instead of static stories, the app uses AI to generate a unique short story containing *only* the specific 20 words the user struggled with most that week.

## 📷 Priority 39: Optical Character Recognition (AI Visual Lens)
- [ ] **Camera Translation**: Tap a camera icon, point the phone at a real Serbian restaurant menu or street sign, and the app reads the text, translates it, and adds the new words directly to your Flashcard deck.

## 🗂️ Priority 40: Custom Community Decks
- [ ] **User-Created Vocab Lists**: Allow users to build custom folders (e.g., "Medical Terms", "Football Vocabulary") and share them with other users via a generated link.

## 🧩 Priority 41: Interactive Grammar Sandbox
- [ ] **Visual Sentence Builder**: Instead of typing, users drag and drop "Lego blocks" of words. Noun blocks are blue, Verb blocks are red. It visually teaches sentence structure (SVO).








