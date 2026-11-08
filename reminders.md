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
  - **Vocabulary Staged Milestones & Multi-Language Scaling Target**:
    - Current: ~3,000 core words & 6,000+ bilingual sentences (A1-B1 foundations).
    - Milestone 2: 5,000 words & phrases threshold (B2 working fluency).
    - Ultimate Goal: 15,000+ words, idioms, and sentences per language pack (~5-6 MB IndexedDB per language) for full C2 Native Mastery grade across any supported language.
- [x] Comprehensive parts of speech: Nouns, Verbs, Adjectives, Adverbs, Common Phrases & Idioms. (DONE - seed-data.js has all POS)
- [x] Include phonetic pronunciation helpers, grammatical gender flags, and usage examples. (DONE - every entry has phonetic, pos, example_en, example_sr)
- [x] **Omni-Bar "Fuzzy Search" & Typo Tolerance (DONE)**:
  - Space-optimized Levenshtein Distance and phonetic normalization (y <-> j, w <-> v, bald Latin, diacritics).
  - Renders a prominent "💡 Da li ste mislili / Did you mean: [Predlog]?" interactive suggestion banner when typing errors are made (e.g. typing "yabuka" auto-matches and suggests "jabuka").

## ✅ Priority 2: Giant Skill Tree Expansion
- [x] Sprawling Tree Structure (skill-tree.js): Expanded to 82 multi-unit nodes covering Beginner to Advanced mastery, including Travel, Business, Dating, Tenses, and all 7 Cases.
## ✅ Priority 3: Štampana i Pisana Slova (Printed vs. Cursive Script) (DONE)
- [x] **Dual Script & Cursive Support**: App features full 1-to-1 script parity (Latinica and Ćirilica) with cursive display overlays in the Alphabet Hub and lesson whiteboards.
- [x] **Dedicated Alphabet Lessons**: 30 Cyrillic and 30 Latin letters fully mapped with audio pronunciation, example words, and cursive comparisons.

## ✅ Priority 4: Cyrillic Script Handwriting & Finger Tracing (DONE)
- [x] **Interactive Canvas Whiteboard**: Built-in touch/mouse <canvas id="drawing-canvas"> with ruled guides, clear canvas, cursive stroke-matching preview, and self-grading feedback.

## ✅ Priority 5: Unit "Cheat Sheet" Grammar Notes (LingoDeer-Style)
- [x] Bite-Sized Grammar Guides: A quick "Guidebook / Tips" tab attached to each Skill Tree node via guideHtml. Visual charts breaking down grammatical shifts in simple explanations before lessons start.

## ✅ Priority 6: The Mistake Vault ("Moje Greške" / Smart Error Review) (DONE)
- [x] **1-Click Mistake Clearing**: Automatically captures any question or word answered incorrectly in lessons, skill tree, or minigames. Dedicated "Mistakes" review screen with SRS prioritization to clear weaknesses permanently.
- [x] **True SRS Algorithm (SuperMemo-2) (DONE)**:
  - [x] **Mathematical SM-2 Algorithm**: Implemented across all modules with repetition tracking, ease factors (EF 1.3 - 3.0), and interval spacing (1 day, 3 days, 7 days, 14 days, 30+ days).
  - [x] **Universal Review Hook**: Automatically updates both `state.srsData` and `state.mistakeLog` across standard lessons, practice, and Arcade Slang.
  - [x] **Due-Date Prioritization**: Mistake review lessons and Mistake Vault prioritize cards due today (`nextReview <= todayStr`) before memory decays.
  - [x] **Mistake Vault 2.0**: Live SRS metrics dashboard (Due Today, Average Retention %, Mastered Count), 4 filter tabs (Sve, 🔴 Za Danas, 🟡 U toku, 🟢 Savladano), dynamic retention progress bars (0-100%), and 1-tap audio pronunciation.

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
- [x] **UI Wired**: 
rhythm.js script tag added to index.html. Launch tile added in Arcade grid ("Muzika & Tekstovi").

## ✅ Priority 11: Interactive Stories Mode ("Serbian Stories / Priče")
- [x] Voiced Cultural Mini-Stories: Immersive dialogues and cultural tales (e.g., "A Night Out in Skadarlija", "Buying at Kalenić Pijaca", "The Lost Passport"). Native TTS audio narration with animated character bubbles. Interactive mid-story comprehension checkpoints (tap to continue, choose what happens next).
- [x] **UI Wired**: stories.js script tag added to index.html. Launch tile added in Arcade grid ("Priče").

## ✅ Priority 12: Arcade Expansion (40 Total Minigames & Modes + Solo/Bot Mode)
- [x] Solo vs. AI Bot Mode Selector: Solo Mode (Levels 1-10) and Vs. AI Bot Mode (Marko Bot, Ana Bot) with live race progress bars.
- [x] **40 Total Minigames & Interactive Modes built & wired in Arcade Grid**: Karaoke Reader, Milioner, Spojnice, Kucanje, Udari Reč, Vešala, Slagalica, Slepi Miš, Zmija, Papagaj, Prevodilac, Memorija, Graditelj Rečenica, Tačno/Netačno, Pogodi Sliku, Osmosmerka, Ukrštenica, Rečko, Baloni, Razvrstaj, Freestyle Rap, Rep Bitka, Padajuće Reči, Ruski Rulet (Lockout), Bomba, Svemirski Osvajači, Simon Kaže, Kolo Sreće, Blokovi, Iznenadna Smrt, Priče, Popuni Prazninu, Sleng & Žargon, Akcenat, Muzika & Tekstovi, Brza Trka, Dvoboj, Pijaca, Pikado, Detektiv.
- [x] **Local Trophy Cabinet ("Vitrina sa Trofejima") (DONE)**:
  - [x] **High Score & Personal Bests Tracker**: Automatically records and updates high scores across all 40 Arcade minigames (`trophy-cabinet.js`).
  - [x] **Bot Win Streak Counter**: Tracks active & all-time record win streaks against bot opponents (Marko_Bot, Ana_Bot, Ghost bots).
  - [x] **20 Tiered Achievement Medals**: Bronze 🥉, Silver 🥈, Gold 🥇, and Diamond 💎 trophies awarding +15 to +200 bonus XP upon unlock.
  - [x] **Enhanced Game Over Screen**: Instant high score badges (`🌟 NOVI LIČNI REKORD!`), trophy unlock celebration banners, bot streak counters, and 1-tap "Vitrina sa Trofejima" launcher.
  - [x] **3D Showcase Shelf Modal**: Glassmorphism room with 4 tier filter tabs, live progress bars on locked achievements, and real-time trophy counter banner in `#view-arcade`.

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
- [ ] **Dual-Platform Monetization & In-App Purchases (RevenueCat Architecture)**:
  - **Google Play App (In-App Purchases / IAP)**: Google strictly requires Google Play Billing for digital goods (diamonds, gems, streak revivals) inside the Play Store APK. Google takes a 15% fee and pays monthly directly to developer bank account (IBAN/SWIFT).
  - **Web / Cloudflare Browser Version**: Free from Google restrictions. Uses Stripe / PayPal Checkout on PC and mobile browsers (Chrome/Safari) with standard ~2.9% fee deposited directly to developer account.
  - **Platform Auto-Detection**: Uses `Capacitor.isNativePlatform()` to automatically serve Google Play Billing inside the installed Android app and Stripe/PayPal inside web browsers, preventing any Google Play anti-steering policy violations.
  - **Unified Inventory via RevenueCat**: Implement RevenueCat SDK (`purchases-capacitor` + RevenueCat Web Pay) so users keep their purchased diamonds and VIP streak status synced seamlessly whether they purchase on the web or in the Android app.

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
  - [ ] **Friend Finder by Username / Display Name**:
    - Search for friends directly by typing their username or display name in the app (complementing the offline Friend Codes).
    - Send 1-tap friend requests and view friends' profiles, badges, and learning stats.
  - [ ] **Live Online Players List & Social Friend Hub**:
    - Real-time list of currently active/online players and friends.
    - Status indicators (in a match, studying, idle) and 1-click challenge invite buttons.
  - [ ] **Post-Match "Add Friend / Save Ghost" Prompt**:
    - Direct button on the Arcade Game Over screen after racing against another player/bot to add them as a friend or save their ghost profile to your roster with 1 tap.
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

## ✅ Priority 25: Native Mobile Touch Gestures & Swipe Physics (DONE)
- [x] **Haptic Sensory Vibrations (DONE)**: Tactile mechanical feedback for button taps (40ms), correct answers ([70, 40, 120]ms), wrong answers double-buzz ([120, 60, 180]ms), swipe feedback (50ms), and celebration fanfare. User toggleable in Profile settings.
- [x] **Mobile Browser vs. Native Google Play Touch Refinement (DONE)**:
- [x] Revisit modal swipe-down-to-dismiss across all 20 modals with inner scroll detection (.overflow-y-auto) and edge swipe navigation.
- [x] Fix mobile browser event interception (distinguishing between mobile web on Cloudflare vs. standalone APK/Google Play wrapper via TouchHaptics.isNativeApp(), overscroll-behavior-y: none;, and modal containment).
- [x] Add smooth bi-directional horizontal swiping between bottom navigation tabs (Home ↔ Arcade ↔ Explore ↔ Mistakes ↔ Stats ↔ Profile) with hardware-accelerated 60 FPS CSS slide transitions and tactile swipe haptics.

> [!NOTE] 🔄 **QA REVISIT**: Come back once we finish building everything to thoroughly test and verify that all Priority 25 touch mechanics work correctly on real devices (20-modal swipe-down-to-dismiss with inner scroll detection, edge swipe navigation, bi-directional bottom nav horizontal swiping, and mobile browser gesture shield).

## ✅ Priority 26: Gamification & Economy (Duolingo Hooks) (DONE)
- [x] **Streak Freezes & Shop**: In-app "Prodavnica" modal where users spend XP to buy Streak Freezes, Heart Refills, and Double XP power-ups.
- [x] **Daily Quests & Mystery Chests**: 3 specific daily goals with progress bars. Completing all 3 unlocks a Mystery Chest with bonus XP and confetti celebration.

## ✅ Priority 27: Learning Science & SRS (Anki Power) (DONE)
- [x] **Memory Heatmap (Brain Health)**: Visual 48-tile retention matrix and Brain Health Vitality gauge in the Stats tab with interactive word inspection and instant review CTA.
- [x] **Tinder-Style Swipe Reviews**: High-performance card stack with realistic tilt physics, green/red swipe stamps, 3D flip for translations/examples, native audio pronunciation, and +20 XP celebration rewards.

## ✅ Priority 28: Adaptive UX & Flow (DONE)
- [x] **Adaptive Placement Test**: 10-question multi-tier CEFR diagnostic quiz (A1 to B2) covering vocabulary, present tense, plurals, cases, past tense, and conditionals with automated Skill Tree unlocks and XP bonuses.
- [x] **Direction-Aware & Bilingual**: Separate question tracks for learning Serbian (en_to_sr) vs. learning English (sr_to_en), with full Cyrillic script parity.
- [x] **Dedicated UI**: Progress bar, clean prompt cards (no spoilers), tactile feedback, celebration screen, and home screen launcher banner.

## ⚙️ Priority 29: Technical Power-Ups
- [ ] **Offline Audio Bundles**: Add "Download Offline Audio Pack" to save pre-generated MP3s for 1,000 common words into IndexedDB for airplane mode.
- [ ] **Peer-to-Peer Friend Codes**: Let users generate a code to share stats and compete on a mini-leaderboard without a massive cloud backend.

## ✅🎭 Priority 30: "Untranslatable" Cultural Idioms & Slang (DONE)
- [x] **Idioms & Terms of Endearment (DONE)**: Expanded with 50+ authentic cultural idioms and expressions across 5 curated categories: Beograd urban slang, Narodne izreke ("ljubi te baka sine", "bogu iza nogu", "puna kapa", "mlatiti praznu slamu", "kad na vrbi rodi grožđe", "košta ko svetog Petra kajgana"), Nežnost & ljubav ("dušo moja", "srce moje", "zlato moje", "sunce moje"), Kafanski život, and Južni govor.
- [x] **Cultural Context Notes (DONE)**: Every idiom features a dedicated "Kada se koristi" note detailing the real cultural meaning, emotional nuance, and social etiquette, plus literal translations and authentic example sentences.
- [x] **Strict Two-Location Placement (DONE)**: Added strictly to (1) the Skill Tree under the "Ulični srpski" node (interactive cheat-sheet guide + 10-question practice lessons) and (2) the Arcade under "Street Slang & Idioms" (`SlangEngine`).
- [x] **Learning Engine, mistakeLog & SRS Flashcard Integration (DONE)**: All idioms feature unique word IDs (`idm1`-`idm25`, `sl11`-`sl20`, `end1`-`end10`, `kaf1`-`kaf7`, `juz1`-`juz6`). Any incorrect answers in lessons or the Arcade Slang Quiz automatically record to `state.mistakeLog`, show in the Mistakes tab, and schedule into the Tinder-style SRS Flashcard deck (`srs-engine.js`). Interactive Star (★) buttons allow instant manual saving into flashcards from both places.
- [ ] **Future Expansion & Revisit Note**: Come back to Priority 30 to add even more authentic Serbian slang, regional jargon (e.g., Vojvodina, Šumadija, Krajiški), and cultural idioms to the curriculum and Arcade quiz.

## ✅⌨️ Priority 31: Keyboard Tolerance & Diacritic Normalization (DONE)
- [x] **Bald Latin (Ošišana latinica) Support**: Native engine automatically normalizes š->s, č/ć->c, ž->z, and đ->dj during answer checking. (ALREADY IMPLEMENTED in app.js checkAnswer normalize())
- [x] **Gentle Typo Feedback (DONE)**: Pops up a gentle educational warning ("⚠️ Tačno sa greškom! Obrati pažnju: pravilno se piše [Tačno]") when the user relies on Bald Latin or makes a minor spelling discrepancy.

## ✅🏆 Priority 32: Advanced Gamification & Social (The League System) (DONE)
- [x] **Ranked Leagues (DONE)**: Bronze, Silver, Gold, Diamond, and Obsidian leagues. Users are grouped with 30 random people weekly. Top 10 advance, bottom 5 demote.
- [x] **Timed XP Boosts (DONE)**: "Early Bird" (practice before 9 AM) grants a 15-minute 2x XP boost to use later that evening, building a twice-a-day habit.
- [x] **Profile Avatars & Titles (DONE)**: Unlockable animated avatars and titles (e.g., "Kafana Legend", "Grammar Nerd") bought with in-app gems.
- [x] **Leaderboard Table Polish & Docked User Card (DONE)**: Fixed the leaderboard in "Statistika" -> "Prikaži celu tabelu" (`#league-modal`): eliminated sticky rank floating occlusion. Added persistent bottom user dock with rank status, zone indicator (`🟢 Napreduje` / `⚪ Ostaje` / `🔴 Ispada`), and 1-click "📍 Moj Rang" smooth scroll button.
- [x] **Diamond Shop Catalog Expansion (DONE)**: Added 7 new animated avatars (Lion of Kalemegdan, Balkan Bear, Golden Striker, Guča Trumpeter, Balkan Vampire, Cosmic Polyglot, Clever Fox) and 8 new profile titles (Kralj Sabora, Derbi Fanatik, Kafedžija, Balkanski Šef, Brzi Prsti, Hodajući Rečnik, Snajper za Padeže, SerboLingo Zvezda) to spend diamonds on.

## ✅🤖 Priority 33: "Explain My Mistake" AI Tutor (Partially DONE)
- [x] **Gemini Grammar Breakdown**: When a user gets a question wrong, an "Explain Why" button appears. The AI briefly explains the grammar rule (gender/case) based on the exact mistake made. (ALREADY BUILT in app.js lines 3260-3330, Gemini model cascade with offline fallback.)
- [ ] **AI Accent Coach** *(Pending - Build Later)*: Give a 0-100% pronunciation score comparing the user's voice pitch to a native Belgrade speaker.

## ✅📺 Priority 34: Real-World Native Media & Hardcore Immersion Mode (DONE)
- [x] **Native Speaker Clips**: 16 curated acoustic immersion clips with looping playback, speed controls (1.0x / 0.75x), script switching (Latin / Cyrillic / Hidden), voice shadowing test, and 1-click SRS Flashcard deck synchronization (`immersion-clips.js`).
- [x] **Hardcore Immersion Mode**: Profile settings toggle that switches 100% of the UI into pure Serbian (`sr_lat`), stripping English labels and adding a header `100% RS` badge. Cyrillic script toggle dropped from general UI (kept only in Alphabet Hub for cultural study).

> [!NOTE] Future Multi-Language Immersion Architecture Note:
> When expanding to other languages (Spanish, German, Japanese, etc.), replicate the Hardcore Immersion Mode pattern for each:
> - `100% ES` badge for full Spanish UI, `100% DE` for German, `100% JP` for Japanese, etc.
> - Dynamic UI label switching per language using the same `sr_lat` architecture pattern with new locale keys.
> - Each language pack inherits the same profile toggle, header badge, and immersion clip infrastructure.

## ✅ Priority 35: Sensory Feedback & Responsive Layout (DONE)
- [x] **Punchy Haptic Feedback**: Noticeable, tactile navigator.vibrate pulses for button taps (40ms), firm double-pulse on correct answers ([70, 40, 120]ms), authoritative warning buzz on wrong answers ([120, 60, 180]ms), and celebration fanfare rhythm. User toggleable in Profile settings.
- [x] **Landscape & Tablet Optimization**: Centered 680px container layout on tablets for header, navigation, and views; compact scroll-safe lesson layout on landscape phones.
## ✅🏗️ Priority 36: Infrastructure & Code Architecture Upgrades (DONE)
- [x] **Database Migration Engine (DONE)**: Version-controlled automated migration and upsert system for `IndexedDB` (`db.js` v7 + `SEED_DATA_VERSION` governance). Non-destructive schema upgrades with indexes for category, pos, and difficulty. Chunked background batch upserts (250 words/batch) yielding execution for silky 60 FPS on low-end mobile hardware. Zero data loss guarantee: user flashcard decks, SRS intervals, and mistake logs are 100% preserved. Includes `getMigrationStatus()` diagnostics and `forceSync()` developer tooling.
- [x] **Data Chunking (Lazy Loading) (DONE)**: db.js already has processChunk() and loadChunk() methods for background dictionary injection via script tags.

## ✅🔔 Priority 37: Retention & Habit Building (The Ultimate Addiction Engine) (DONE)
- [x] **Web Notifications API (DONE)**: Opt-in evening habit reminder that fires a native push notification to device at 19:00 if the daily streak hasn't been saved yet.
- [x] **Streak-at-Risk Visual Alarm (DONE)**: Top bar flame icon transforms into a pulsating urgent alert (`.streak-risk-alarm`) and home view risk banner countdown to midnight ("⚠️ Tvoj niz ističe za Xh Ym! Uradi lekciju odmah").
- [x] **Spasi Svoj Niz (Streak Repair Modal) (DONE)**: When a streak is broken without freeze shields, user gets a 24h recovery window to rescue it using 150 💎 Dijamanata or by beating a 5-Question Blitz Recovery Challenge for free.
- [x] **Društvo Niza (Streak Society VIP Tiers) (DONE)**: 4-tier milestone VIP progression (Bronzani 7d, Srebrni 14d, Zlatni 30d, Opsidijanski 50d) with auto-awarded free streak freezes, exclusive profile frames, and league glows.
- [x] **Deljive Milestone Kartice (DONE)**: High-res Instagram Story / WhatsApp shareable bragging cards generated at 3, 7, 14, 30, 50, 100 days with 1-click native share API or clipboard copy.
- [x] **Interactive Streak Hub Modal (DONE)**: Header flame button opens full streak analytics, current vs best record, freeze shield inventory, and society progression roadmap.
- [x] **PWA & Home Screen Widgets (DONE)**: Fully integrated with Service Worker (`sw.js`), `manifest.json`, and dynamic browser prompt for 1-tap installation directly to mobile/desktop home screen.
- [ ] **Pending Final Sweep & QA Note**: Once all priorities and full app development are completed, revisit Priority 37 to thoroughly test and verify all streak retention mechanics on real devices (Web Notifications at 19:00, midnight risk countdown, 150 💎 gem repair & 5-question recovery challenge, Streak Society tier perks, and Instagram/WhatsApp card sharing).

## ✅📚 Priority 38: Smart Paced Story Mode ("Pametne Priče") (DONE)
- [x] **Dynamic Contextual Bedtime & Cultural Stories (DONE)**:
  - [x] **Weakness-Targeted Story Weaver**: Dynamically extracts the user's due/weakest vocabulary from `state.mistakeLog` and `state.srsData` and weaves them into engaging cultural Serbian narratives (`smart-story.js`).
  - [x] **Dual AI & 100% Offline Generator**: Online Gemini model cascading (`gemini-2.5-flash` → `2.0-flash` → `1.5-flash`) paired with 3 rich offline cultural templates (Kafana "Znak Pitanja", Kalenić Pijaca, Knez Mihailova) for zero-latency airplane mode play.
  - [x] **Interactive Story Reader**: Full-screen mobile dialogue bubbles with dual-script parity (Latinica / Ćirilica), glowing target-word pills (`✨ [reč]`), 1-tap word inspector, and native audio pronunciation (`app.speakPhrase`).
  - [x] **Comprehension Checkpoint & SRS Progress Sync**: In-story comprehension quiz, +25 XP reward, and automated SuperMemo-2 SRS status updates (`SrsEngine.recordReview(wordId, true, 4)`) that immediately boost memory retention in the Mistake Vault!
  - [x] **Seamless Entry Points**: 1-tap launcher banner in `#view-mistakes` ("📖 Pametna Priča") and hero banner in the Stories menu (`stories.js`).

## 📷 Priority 39: Optical Character Recognition (AI Visual Lens)
- [ ] **Camera Translation**: Tap a camera icon, point the phone at a real Serbian restaurant menu or street sign, and the app reads the text, translates it, and adds the new words directly to your Flashcard deck.

## 🗂️ Priority 40: Custom Community Decks
- [ ] **User-Created Vocab Lists**: Allow users to build custom folders (e.g., "Medical Terms", "Football Vocabulary") and share them with other users via a generated link.

## ✅🧱 Priority 41: Interactive Grammar Sandbox & 2-in-1 Sentence Hub (DONE)
- [x] **2-in-1 Sentence Builder Hub & Lego Sandbox (DONE)**:
  - [x] **2-in-1 Hub Mode Selector**: Housed cleanly inside the existing "Graditelj Rečenica" Arcade tile, preserving the exact 40-game grid symmetry without dangling cards.
  - [x] **Polished Word-by-Word Trainer (Mode 1)**: Replaced random dictionary concatenation with a curated database of 50+ real conversational sentences (A1-B2), native audio pronunciation, lives system (❤️❤️❤️), and XP rewards.
  - [x] **Color-Coded Lego Grammar Blocks (Mode 2)**: Blue (Nouns / Imenice), Red (Verbs / Glagoli), Green (Adjectives / Pridevi), Purple (Prepositions / Predlozi), and Orange (Adverbs / Prilozi).
  - [x] **Puzzle Challenges & Free Laboratory**: 12 SVO progressive blueprint puzzles + Free Sandbox exploration with real-time syntactic structure analysis and TTS narration.
  - [x] **Dual-Script & Audio Parity**: Full support for Latinica & Ćirilica with instant word/phrase pronunciation and haptic feedback.

## 🌐 Priority 42: Cloudflare Free Plan for Online Services
- [ ] **Cloudflare Infrastructure**: Use Cloudflare's free plan for CDN, DNS, DDoS protection, and caching when the app goes live with online services (leaderboards, multiplayer, friend finder).

## ✅⚡ Priority 43: Omegle-Style Language Exchange Hub ("Slučajni Sagovornik") (Phase 1 DONE / Phase 2 Planned)

<span style="color:#888">

- [x] **1v1 Language Roulette Matchmaking (DONE)**: Instant pairing matching Serbian learners with native Serbian speakers learning English, and vice versa. Realistic radar search animation with haptic connection vibration (`language-exchange.js`).
- [x] **12 Diverse Simulated Personas + Gemini Online AI (DONE)**: Hybrid dual-tier conversational engine. 100% offline-ready with 12 authentic personas (Milica from Belgrade, Liam from London, Carlos from Madrid, Sakura from Tokyo, Dragan from Valjevo) with natural typing delays (`...`) and cultural personalities, plus online Gemini cascade for dynamic human-level chat.
- [x] **Private Friend Room Codes & Group Tables (DONE)**: Direct pairing with study buddies from the Forum via 6-digit room codes (e.g., `BG-4921`) and 4-person group study tables.
- [x] **In-Chat Pedagogical Power Tools (DONE)**: Tap-to-translate gloss on partner bubbles, 🪄 "Ispravi moju gramatiku" one-tap AI grammar assistant before sending, and 💡 Icebreaker prompt cards (Kafana talk, Travel, Food, Grammar challenges).
- [x] **Voice Audio TTS & Web Speech Input (DONE)**: Native TTS voice playback of partner messages and speech-to-text voice input.
- [x] **Safety & Moderation Shield (DONE)**: Instant skip (`⏭️ Sledeći`), block (`🚫 Blokiraj`), and report (`🚩 Prijavi`) controls with local blocklist persistence.
- [x] **XP Rewards & Profile Integration (DONE)**: Awards `+10 XP` for every 3 exchanges with progress celebration, accessible via Profile community card and dedicated `#exchange-modal`.

</span>

### ✅ Priority 43.2: Ultra-Safe Video/Voice Roulette & Match Filters (Phase 2 DONE)

<span style="color:#888">

- [x] **Unified All-in-One Room & Hardware Controls (DONE)**:
  - [x] Single matchmaking pool (no queue splitting) ensuring fast connections without dividing active users.
  - [x] Default privacy mode: Rooms start with text chat active while **Microphone and Camera are MUTED by default**.
  - [x] Live in-call tactile toggles: 💬 Tekstualni Čet (always available for notes & translation), 🎤 Mikrofon (tap to unmute and speak), 📹 Kamera (tap to turn on video when comfortable).
  - [x] Picture-in-Picture (PiP) video layout: Main viewport displays partner's video stream (or avatar if video is off), with a floating self-camera preview box in the bottom corner.
- [x] **Advanced Pre-Match Filters (Lobby Modal) (DONE)**:
  - [x] **Automatic Language Alignment (Default)**: Automatically pairs users based on their active Profile learning direction (`sr_to_en` vs `en_to_sr`).
  - [x] **Country / Region Selector**: Filter by specific regions (*Svejedno / Srbija / Bosna i Hercegovina / Crna Gora / Dijaspora*).
  - [x] **Gender Preference**: Optional filter (*Bilo ko / Samo Žene / Samo Muškarci*).
  - [x] **Medium Filter**: Optional preference (*Svejedno / Želim razgovor glasom / Samo kuckanje tekstom*).
- [x] **Safety, Anti-NSFW Moderation & Legal Protection Shield (DONE)**:
  - [x] **🔞 18+ Safety & Community Pledge**: Mandatory one-time confirmation modal before unlocking camera/video access for legal and app store compliance ("Nulta tolerancija na neprimereno ponašanje i golotinju. Trajni ban prekršiocima").
  - [x] **🛡️ 2-Second "Safe-Connect" Initial Frosted Blur**: New video streams start with a gentle frosted blur for 2 seconds to eliminate sudden jump-scares, lifting automatically once safe.
  - [x] **⚠️ NSFW Panic Shield (2-Button Choice)**: 1-click `🚨 Štit / Prijavi` button instantly blacks out / blurs the screen with an authoritative warning overlay, auto-mutes, and gives the user two explicit choices: `⏭️ Sledeći Sagovornik (Preporučeno & Trajni Ban)` or `✅ Sve je u redu / Ostani (Odblokiraj ekran)`.
  - [x] Quick-action `⏭️ Sledeći Sagovornik` (Skip) and `🚫 Blokiraj` buttons always accessible.
- [x] **⭐ "Dodaj u Prijatelje" (Save as Study Buddy) (DONE)**: 1-click button at the top of the chat or disconnect screen to save partner to `serbolingo_exchange_friends` with generated room code, with saved buddy list and 1-click invite in the lobby.

</span>

### 🛡️ Priority 43.3: Community Moderation, Dual-Button Safety & Appeals Architecture (Client-Side Done, Cloud Next)

<span style="color:#888">

- [x] **Dual-Button Architecture (Separation of Report vs. Block) (DONE)**:
  - [x] **🚩 Prijavi (Report - Community Strike) (DONE)**:
    - Adds +1 strike to the reported user's community record.
    - Requires **4 unique reports from 4 distinct users** before any global timeout/ban triggers (prevents trolling, accidental clicks, and griefing).
    - **Crucial Rule**: Reporting does **NOT** automatically block the user for the reporter. Unless the reporter also clicks "Blokiraj", they remain eligible to match in the future.
  - [x] **🚫 Blokiraj (Block - Personal Exclusion) (DONE)**:
    - 100% personal exclusion. Immediately excludes the user from the reporter's matchmaking pool forever.
    - Persisted in `serbolingo_exchange_blocked` and manageable in Lobby ("Upravljaj blokiranim korisnicima").
    - Users can view their blocked list and click `Odblokiraj` anytime to restore them.
- [x] **Progressive Escalation Ban Ladder (Escalating Timeouts) (DONE)**:
  - [x] **Strike 1** (4 unique reports): **1-Hour Timeout** (cooldown period).
  - [x] **Strike 2** (+4 unique reports): **4-Hour Suspension**.
  - [x] **Strike 3** (+4 unique reports): **24-Hour Suspension** (1 Full Day).
  - [x] **Strike 4** (+4 unique reports): **7-Day Lockout** (1 Full Week).
  - [x] **Strike 5** (+4 unique reports): **Permanent Ban (Permaban)**.
  - [x] **Active Suspension Display (DONE)**: Banned users see a locked matching button with live countdown timer (*"Privremeno ste suspendovani iz razgovora. Preostalo vreme: 38m 12s"*).
- [x] **"Warning First" Policy (No Sudden Instant Bans Even for Emergencies) (DONE)**:
  - [x] Even for emergency triggers or severe complaints, users receive a prominent **Formal Community Warning (`⚠️ Zvanična Opomena Zajednice`)** first rather than an instant ban.
  - [x] User must click *"Razumem i Prihvatam"* before joining further sessions. Progressive bans apply only if violations continue.
- [x] **Human Review & Appeals System (`📩 Podnesi Žalbu / Appeal`) (DONE)**:
  - [x] Suspended users receive an in-app `[Podnesi Žalbu]` button to explain their case (e.g., false report by a troll).
  - [x] Human moderator review logs & simulation hooks (`resolveAppeal`). If the report was false or malicious, the strike is revoked immediately, user is reinstated.

</span>

- [ ] **Real-People Cloud Backend & WebRTC P2P Signaling (Phase 3 Integration - Future)**:
  - [ ] Free Supabase / Firebase Realtime queue for real device-to-device matchmaking without expensive Node backends.
  - [ ] WebRTC Peer-to-Peer direct connection via free public Google STUN servers (`stun.l.google.com:19302`) for low-latency live microphone voice calls and video feeds.
  - [ ] **Hybrid Fallback Guarantee**: If the real human queue is empty (e.g. 3 AM scenario), automatically pairs with the 12 AI Personas so learners never experience dead waiting screens.

> [!NOTE] ðŸŒ **Multi-Language Scaling**: Persona definitions and matchmaking direction logic are modular (sr_en, es_en, de_en, etc.), ready to inherit new language pairs in Priority 48.

## ✅ Priority 44: Smart Grammar Tooltips & Interactive Word Inspector (DONE)
- [x] **Smart Grammar Tooltips**: Tapping any word in lessons or feedback prompts shows instant morphology, Serbian case tags (Akuzativ, Genitiv, Dativ/Lokativ, Instrumental, Množina), verb tenses, root lemma, translation, audio pronunciation, and 1-tap Flashcard saving.

## ✅📱🎬 Priority 45: SerboReels — Short-Form Video Immersion & Tap-to-Translate (DONE)
> **Status**: Completed (Benchmark from Kiku, Migaku & Lingopie)  
> **Concept**: Learn Serbian & English through a high-dopamine vertical swipeable feed of short, authentic cultural video clips (similar to TikTok, Reels, or Kiku) paired with interactive bilingual subtitles and automated SRS flashcard extraction.

- [x] ⚫ **1. Short-Form Immersion ("TikTok / Reels" Habit Loop) (DONE)**:
  - ⚫ Vertical feed of 10–30 second real video clips turning language learning into passive entertainment with full mobile viewport ratio.
  - ⚫ Zero lag on low-end mobile phones with clean play/pause tap overlay, audio pronunciation toggle, and clip switching.
  - ⚫ Explore View placement positioned directly above "Izvorni Govor" for instant discovery.
- [x] ⚫ **2. Authentic Balkan Pop Culture & Media Curation (DONE)**:
  - ⚫ **Cult Serbian Cinema**: Iconic 15-second scenes from legendary movies (*"Ko to tamo peva"*, *"Maratonci trče počasni krug"*, *"Munje!"*, *"Lepa sela lepo gore"*).
  - ⚫ **Dubbed Cartoons**: Nostalgic clips like *Sunđer Bob* (SpongeBob in Serbian), *Meda Padington*, and *Kralj Lavova*.
  - ⚫ **Street Humor & Real-Life Dialogues**: Belgrade cafe ordering, taxi ride chats, market negotiations (*Kafić*, *Taksista*, *Kalenić pijaca*, *Guča trubači*, *Burek i jogurt*).
- [x] ⚫ **3. Deep Learning Engine & Flashcard Integration (DONE)**:
  - ⚫ **Tap-to-Translate Subtitles**: Built directly on our interactive word inspector. Clicking any subtitle word in the video instantly pauses the clip, reveals the translation + case/grammar breakdown, root lemma, and audio pronunciation.
  - ⚫ **Auto-Save to SRS Flashcards**: One tap on the star (★) immediately adds the word into the Tinder-style SRS Flashcard deck in `srs-engine.js` with +10 XP bonus.
  - ⚫ **Dual Subtitles & Script Parity**: Interactive dual subtitles with live Latin / Cyrillic script toggle (`LAT` / `ЋИР`) + English translation below it.
  - ⚫ **Habit Loop Gamification**: Watching 3 reels awards +15 XP and triggers fanfare/confetti celebration.

> [!NOTE] 🔄 **QA REVISIT**: Come back once we finish building everything to:
> 1. Test all SerboReels features end-to-end on real devices (play/pause, subtitles, word inspector, XP awards).
> 2. Fix any bugs or UI overflow issues found during testing.
> 3. Upgrade SerboReels to work with **other languages** beyond Serbian ↔ English (multi-language clip support).

## ✅🐛 Priority 46: In-App Bug, Error & Feedback Reporting System ("Prijavi Problem") (DONE)
- [x] **In-App Report Modal (DONE)**: Accessible from Profile/Settings via a "Prijavi Problem" button. Clean 2-tab modal (Novi Izveštaj / Istorija). Users select a category (Bug, UI Greška, Pogrešan Prevod, Predlog, Ostalo) and describe the issue with tactile haptics.
- [x] **Automatic Diagnostic Snapshot (DONE)**: On submit, the engine silently captures device tier (FLAGSHIP / MID / BUDGET), cores, RAM, browser/OS, viewport and screen resolution, pixel ratio, current view, dark mode state, app version (v13), PWA standalone status, localStorage size, and buffer of the last 10 JavaScript errors and unhandled promise rejections.
- [x] **Webhook Delivery (DONE)**: Direct Discord webhook payload with color-coded embed, device diagnostic grid, error traces, and timestamp. Works with any custom webhook endpoint; configurable in-app via collapsible advanced settings.
- [x] **Bug Hunter XP Reward (DONE)**: Users earn +25 XP and a celebration toast for their first 3 submitted reports, with progress tracking towards "Bug Hunter Veteran" milestone.
- [x] **Report History & Local Persistence (DONE)**: 100% offline-resilient local persistence in `localStorage` (`serbolingo_bug_reports`). Users can review all past submissions, status badges (Poslato, Primljeno, U obradi, Rešeno), IDs, and timestamps, with an option to clear history.

> [!NOTE] 🌐 **Multi-Language Scaling**: This system is completely language-agnostic — it works identically for Spanish, German, Japanese, or any future language pack.
## ✅💬 Priority 47: Global Community Forum & Discussion Hub ("Forum Zajednice") (DONE)
- [x] **Grammar Q&A Board (DONE)**: Structured channel for grammar dilemmas (Dativ vs. Lokativ, reflexive pronouns, verb aspects). Supports rich formatting, tags (`#padezi`, `#glagoli`), accepted answer badges (`✓ Rešeno`), and instant "🤖 Pitaj AI Tutora" pedagogical generator (`community-forum.js`).
- [x] **Culture & Media Discussions (DONE)**: Curated threads for Balkan movies (*Ko to tamo peva*, *Maratonci*, *Munje*), kafana traditions, music recommendations, and travel tips.
- [x] **Study Buddy Finder (DONE)**: Language exchange hub for finding tandem partners (A1–B1) with timezone and practice goals.
- [x] **Upvote & Reputation System (DONE)**: Tactile haptic upvoting on threads and replies with live counters. Gamified rewards: `+5 XP` for new discussions, `+15 XP` for helpful answers, and `+25 XP` bonus for 3+ upvotes.
- [x] **10 Authentic Pre-Populated Seed Discussions (DONE)**: High-quality linguistic and cultural threads ready to explore on day one.
- [x] **Moderation & Safety (DONE)**: 1-click report flag (`🚩 Prijavi`) hides inappropriate content locally. Full author deletion controls for own posts.
- [x] **Seamless Profile & Community Hub Integration (DONE)**: High-visibility card in Profile view (`view-profile`) alongside bug reporting, and dedicated modal `#forum-modal`.

> [!NOTE] 🌐 **Multi-Language Scaling**: Forum category tags (`langPair`) auto-expand per language (e.g. Spanish Grammar, German Culture, Japanese Exchange) when new language packs are unlocked in Priority 48.
## 🌍 Priority 48: The Global Polyglot Ecosystem ("Svet Jezika")
- [ ] **Master Concept ID Schema**: Transition the database to a universal concept-based architecture where each entry (e.g., Concept #0001 = "water") contains translations for English, Serbian, Spanish, German, French, Japanese, etc.
- [ ] **Language Pack Scaling**:
  - [ ] 3,000 words per pack for A1-B1 foundations.
  - [ ] 5,000 words per pack for B2 working fluency.
  - [ ] 15,000 words per pack for C2 native mastery.
- [ ] **Target Languages**: Spanish (ES), German (DE), French (FR), Japanese (JP), and English for native Serbian speakers (RS to EN).
- [ ] **Modular Voice Packs**: Downloadable offline audio packs per language (~150MB each) with fallback to native device TTS.
- [ ] **Full Engine Inheritance**: Every language pack automatically inherits all existing systems — SuperMemo-2 SRS, Mistake Vault, Tinder Swipe Reviews, Arcade with 40 minigames, Grammar Sandbox, SerboReels, Smart Stories, Trophy Cabinet, Streak Society, Leagues, and Hardcore Immersion Mode.
- [ ] **Dynamic Language Switcher**: Profile setting to swap active language pair without losing progress. All XP, streaks, and SRS data tracked independently per language.

> [!NOTE] Key Architectural Insight: The core engines (SM-2, IndexedDB chunking, Arcade, Reels, Stories, Sandbox, Trophy Cabinet) are already fully decoupled from language strings. Expansion requires only new concept datasets and audio packs — zero engine rewrites.

## ✅🎯 Priority 49: AI Accent Coach & Waveform Pitch Matcher (DONE)

<span style="color:#888">

- [x] **Real-Time Voice Pitch Overlay (DONE)**: Uses Web Audio API (`AudioContext` & `AnalyserNode`) to capture the user's spoken Serbian and plots their real-time pitch waveform on an HTML5 `<canvas id="pitch-canvas">` against native melodic contours (`pitch-accent.js`).
- [x] **4 Melodic Pitch Accents (DONE)**: Fully maps Kratkosilazni, Dugosilazni, Kratkouzlazni, and Dugouzlazni with visual SVG curves, audio pronunciation samples, and phonetic guides.
- [x] **0-100% Pronunciation Score (DONE)**: Real-time algorithmic comparison of user pitch frequency against target contours with visual percentage match display (`#match-score`).
- [x] **Arcade Integration (DONE)**: Dedicated Arcade tile ("Pitch Accent") launching interactive visualizer and recording suite.

</span>

> [!NOTE] 🔍 **QA REVISIT**: Come back once we finish building everything to thoroughly test real microphone input, canvas waveform rendering, and match accuracy percentages across physical mobile (iOS Safari / Android Chrome) and desktop devices.

## 🏺🍽️ Priority 50: Authentic Serbian Customs, Cultural Etiquette & Kafana Food/Dialects ("Balkanski Običaji & Gastronomija")
> **Status**: Planned (High Cultural Value / Immersion)  
> **Concept**: A rich cultural immersion module teaching authentic Balkan customs, unspoken social rules, table etiquette, traditional gastronomy, and regional dialect nuances. Spread across dedicated lesson tooltips, slang expansions, and a dedicated cultural guide hub.

- [ ] **1. Cultural Etiquette & Unspoken Social Rules ("Balkanski Bonton")**:
  - [ ] **The Sacred Toast ("Živeli!")**: Looking directly into the partner's eyes when clinking glasses (and the humorous cultural superstition that not looking brings 7 years of bad luck).
  - [ ] **Krsna Slava Customs**: Full ritual walkthrough — Slavski kolač, Koljivo/Žito, sveća, vino, patron saint traditions, and how a guest greets the host (*"Srećna slava, domaćine!"*).
  - [ ] **Guest Etiquette in Balkan Homes**: The tradition of taking off shoes, accepting coffee and slatko or homemade juice, bringing gift bags (coffee, Turkish delight/ratluk, chocolate, wine), and never refusing offered food.
  - [ ] **Hospitality & Taboo Breakers**: How bills are settled in kafanas ("otimanje za račun"), how neighbors greet, and respectful forms of address (*"Čika", "Teta", "Brate", "Kume"*).

- [ ] **2. Gastronomy & Kafana Culture ("Kafanski Rečnik & Trpeza")**:
  - [ ] **Iconic Balkan Dishes Database**: Deep vocabulary and audio for Kajmak, Ajvar, Prebranac, Sarma, Karađorđeva šnicla, Domaća pogača, Pečenje (jagnjeće/praseće), Burek sa sirom/mesom, and Meze.
  - [ ] **Kafana Ordering Dialogues**: Authentic ordering phrases, communicating with the konobar, ordering by the 10-piece (*"deset upola sa lukom"*), and requesting songs from the tamburaši.

- [ ] **3. Regional Dialects & Accent Variations ("Kako Priča Balkan")**:
  - [ ] **Niš & Southern Serbian**: Distinct grammatical features, dropping cases playfully, signature words (*"kude si", "nemoj se jediš", "ću dođem", "merak", "lele"*).
  - [ ] **Vojvodina & Novi Sad**: Relaxed, melodic cadence, signature phrases (*"ta nemoj kasti", "gari", "bata", "dunje"*).
  - [ ] **Montenegrin Coast & Primorje**: Mediterranean rhythm, Italian loanwords (*"pomalo", "fešta", "gušt", "ura"*).

- [ ] **4. Multi-Touchpoint Integration Architecture**:
  - [ ] Expand into [`slang.js`](file:///c:/Users/iwillrockyouxD/Downloads/serbolingo%20app/slang.js) for quick idiom and slang quiz cards.
  - [ ] Inject contextual "Bonton & Običaji" tooltips inside Skill Tree lessons.
  - [ ] Dedicated "Kultura & Običaji" explorer tab or guide inside the app.


