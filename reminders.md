# 📌 SerboLingo Project Reminders & Future Roadmap

This file contains tasks, ideas, and upgrades to be implemented once the core web application is fully built and polished.

## 🚀 Deployment & Distribution

- [ ] **Create a Progressive Web App (PWA):**
  - Add a `manifest.json` file.
  - Create a Service Worker (`sw.js`) for offline caching of the UI and core assets.
  - Add appropriate meta tags to `index.html` (e.g., `theme-color`, `apple-mobile-web-app-capable`).
  - *Goal:* Allow users to "Add to Home Screen" directly from their mobile browser (Chrome/Safari) to get a native app feel instantly.

- [ ] **App Store & Google Play Packaging:**
  - Wrap the pure Vanilla HTML/JS codebase using a tool like **Capacitor** (by Ionic).
  - This allows us to take the exact same web code and compile it into native `.apk` / `.aab` (Android) and `.ipa` (iOS) files.
  - *Goal:* Submit the app to the official Google Play Store and Apple App Store for wider reach.

## 💡 Future Features (Add more here as we go)

- [ ] **Massive Dictionary Engine (IndexedDB / SQLite):**
  - Replace the in-memory `DICTIONARY` mock array with a robust offline database (IndexedDB or WebAssembly SQLite).
  - *Goal:* Support Duolingo-scale content (100,000+ words, grammar rules) without consuming active RAM or causing UI stutter on budget smartphones.


- [ ] **Štampana i Pisana Slova (Printed vs. Cursive Script):**
  - **Display Option (Settings):** Let the user choose how letters are visually displayed across the app:
    - Štampana slova (Printed/Block) — Default, standard screen fonts.
    - Pisana slova (Cursive/Handwritten) — Uses a Serbian cursive font for a handwritten look.
    - This applies to both Latin and Cyrillic independently (4 combinations total).
  - **Dedicated Lessons:** Create lesson modules specifically for learning to read and recognize:
    - Latinica štampana slova (Printed Latin characters).
    - Latinica pisana slova (Cursive Latin characters).
    - Ćirilica štampana slova (Printed Cyrillic characters).
    - Ćirilica pisana slova (Cursive Cyrillic characters).
  - *Goal:* Differentiate SerboLingo from every other language app by teaching the full range of Serbian script forms, not just typed text.

- [ ] **⭐ Add to Flashcards from Omni-Bar:**
  - Add a star/bookmark button on each Omni-Bar search result card.
  - Clicking it saves the word to the user's personal Flashcard/SRS deck.
  - Follows Section 7 of the Constitution: Synchronized Progress — one source of truth.
