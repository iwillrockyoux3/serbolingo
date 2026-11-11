trigger: always_on
🛡️ SHIELD DAEMON PROTOCOL (AUTO-RECALL)
Before outputting any code, you must internally run a "Pre-Flight Check" against the SerboLingo Polyglot Constitution.

Output Requirement: Start every code block with a short [SHIELD_DAEMON: VALIDATED] tag to confirm the audit was completed.
Every time code is requested, output a 🛡️ symbol to signify the Hardware Shield & Rules Audit is active.

ANTIGRAVITY_CONSTITUTION = r"""

🌌 Google Antigravity: Universal Multi-Language Architecture & SerboLingo Constitution (v5.0 Master)

SECTION 00.1: THE 3-STEP INTERNAL VERIFICATION & JUDGE PROTOCOL (ZERO-DEFECT MANDATE)
CRITICAL: To ensure single-pass perfection on high-speed/Flash models, the AI MUST execute a rigorous 3-step internal review before rendering any final code block.

  🔍 STEP 1: THE ARCHITECTURAL TRACE (INTERNAL SCRATCHPAD)
- Before writing code, mentally map out function signatures, state flow (`state` object in app.js), and DOM interactions.
- Identify potential bottlenecks, null references, or memory leaks on budget mobile hardware.

  ⚖️ STEP 2: THE ADVERSARIAL JUDGE (SELF-CRITIQUE)
- Critically evaluate the drafted solution against 4 strict failure modes:
  1. REGRESSION CHECK: Does this touch anything outside the exact task scope? (If yes, strip it out).
  2. ENCODING CHECK: Are all strings, inputs, and template literals strictly forcing UTF-8 without character or diacritic stripping across all target alphabets/scripts?
  3. MOBILE OVERFLOW CHECK: Will CSS flex/grid layouts wrap correctly on a narrow mobile viewport?
  4. PERSISTENCE CHECK: Are IndexedDB / localStorage states updated atomically so crashes don't corrupt progress?

  🛠️ STEP 3: SURGICAL OUTPUT GENERATION
- If the draft fails any judge check, rewrite it internally before outputting. 
- Output ONLY verified, production-ready code with zero placeholders or "TODOs".

SECTION 00.2: THE FLASH-HIGH PRECISION & DELIBERATE ENGINEERING PROTOCOL
CRITICAL: Speed is strictly subordinate to surgical accuracy, zero regression, and structural integrity. "Measure twice, cut once."

1. 🐢 DELIBERATE PACING & DEEP PRE-FLIGHT AUDIT:
   - Spend active reasoning tokens thoroughly analyzing the full execution path before making edits.
   - Zero-defect precision on the very first attempt is the only standard. Inspect surrounding code, data structures, and event listeners first.

2. 🚫 STRICT ANTI-REGRESSION & NO DRIVE-BY REFACTORING:
   - Touch ONLY the exact lines and functions required for the specific task at hand.
   - FORBIDDEN from altering or "beautifying" working components outside task scope.

3. 🛡️ WINDOWS UTF-8 & ENCODING ARMOR (NO MOJIBAKE):
   - NEVER use default shell text commands or pipelines that strip UTF-8 encodings or mangle non-ASCII characters, diacritics (č, ć, ž, š, đ, џ, љ, њ), special scripts (Cyrillic, Kanji, Kana, Arabic), and emojis.
   - Enforce pure UTF-8 without BOM for all file I/O operations.

4. 🔍 MANDATORY POST-EDIT SELF-AUDIT:
   - Review exact diff and verify file integrity on disk before reporting back. Self-heal any unintended changes immediately.

SECTION 0: THE PRIME DIRECTIVE (NON-DESTRUCTIVE INTEGRATION)
🚫 BLIND OVERWRITE FORBIDDEN: The AI is FORBIDDEN from using Overwrite: True on any existing file containing logic, database schemas, or UI layouts without performing a full view_file scan first.
Even if a file seems redundant, prioritize "Merging" or "Combining" code over "Replacing" it to ensure legacy logic, tracking modules, and vocabulary data are NEVER lost.
Always append new endpoints or UI components cleanly and merge state/component arrays carefully.

SECTION 1: SUPREME COMMAND, HARDWARE OPTIMIZATION & PERFORMANCE GUARDRAILS
CRITICAL: The app runtime MUST target and run flawlessly on low-end consumer mobile devices. Optimizing for a budget smartphone to have zero lag automatically guarantees it flies on a PC.

🏗️ ZERO-BUILD PHILOSOPHY: The app must remain a pure Vanilla HTML, CSS, and JavaScript application. No Node.js backends, no React/Vue frameworks, and no build tools (Webpack/Vite).
📄 SINGLE-PAGE APPLICATION (SPA): All 12+ views live in `index.html` and toggle via JavaScript (`classList.add('hidden')`).
💾 LOCAL PERSISTENCE FIRST: User data (XP, streaks, history, settings) tracks locally via `localStorage` and `IndexedDB` (`db.js`).

⚡ PERFORMANCE AUDIT: Every response MUST begin with an internal 'Performance Audit' check.
🚫 BUILD GATING: NO automatic build commands. Explicitly ask: "Is it safe to run the compiler/migration?"
🧵 WORKER LOCKDOWN: Offload heavy background tasks (audio decoding, local indexing, dictionary syncing) to Web Workers or background threads to keep main UI thread locked at 60+ FPS.
💾 OFFLINE-FIRST ARCHITECTURE: Dictionaries (~3,500+ baseline entries, scaling up to 15,000+ per pack) and Audio/TTS pack into local IndexedDB (`SerboLingoDB` v7) to prevent RAM bloat on limited devices.

⚖️ DUAL-TIER EXECUTION (SCALABLE ARCHITECTURE):
📱 BUDGET MOBILE MODE (Baseline): Rely on strict algorithmic regex, lightweight SQLite/IndexedDB indexing, pre-cached audio, and chunked DB queries (250 items/batch). NEVER load uncapped datasets into active RAM.
🚀 FLAGSHIP / PC MODE (Dynamic): Automatically unlock real-time local LLM grammar explanations, neural TTS, and heavy ML/AI translation models if device has sufficient RAM (>4GB) and CPU cores. Fall back to Budget Mode instantly if memory drops.

⏳ DEBOUNCE & UI FREEZE PREVENTION: Search queries, input handlers, or audio loads taking > 30ms MUST be debounced or run on background worker threads so typing never stutters.
📈 PROGRESS INDICATORS: Long background tasks (syncing DBs, downloading packs) report progress silently via a status bar.

SECTION 2: MULTI-LANGUAGE & UNIVERSAL UI/UX ARCHITECTURE (THE POLYGLOT MANDATE)
🌐 UNIVERSAL CONCEPT SCHEMA: The core engine MUST structure entries around a Master Concept ID system (e.g., Concept #0001 = "water"), decoupling language pairs from core app logic. Any two language packs (EN, SR, ES, DE, FR, JP) can be paired dynamically.
🔤 SCRIPT & DIACRITIC PARITY: The search and rendering engines must treat all scripts (Latin, Cyrillic, Kanji, Kana, Cyrillic cursive) and diacritics with 1-to-1 parity. Switching scripts or target languages must require zero UI re-architecture.

🚫 NO DEEP MENUS: Core tools (Translate, Flashcards, Grammar) must never be hidden behind complex hamburger menus.
🖱️ THE 3-CLICK RULE: No primary learning action (checking a word, adding to favorites, hearing pronunciation) should be deeper than 3 clicks/taps.
🧠 COGNITIVE LOAD REDUCTION: Hide complex grammatical breakdowns by default. Use Conditional Visibility (Hover/Expanders/Tooltips) to reveal target language case declensions, verb tenses/aspects, or phrasal rules.

🎨 NATIVE AESTHETIC & PREMIUM UI CONSTRAINTS: Mobile-first paradigms with rich TailwindCSS styling, rounded corners (`rounded-xl` or `rounded-2xl`), and subtle drop shadows. Source language bolded, target language clear, secondary metadata subtle. Elements must be touch-friendly.
🌙 DARK MODE COMPLIANCE: Every single UI element must support both Light and Dark modes seamlessly (using Tailwind `dark:` classes).
✨ MICRO-ANIMATIONS: Tactile button clicks (`active:translate-y-1` with bottom borders), fade-in transitions, and pulse effects for active states.
♿ ACCESSIBILITY (A11y) MANDATE: Interactive elements MUST have proper `aria-label` attributes and support keyboard navigation.

SECTION 3: THE ARCHITECT'S AUDIT (ANTI-DUPLICATION PROTOCOL)
🔍 MANDATORY PRE-FLIGHT SCAN: Before proposing ANY feature, the AI MUST use file search or list tools to audit existing codebase files in `manifest.md`.
🧠 CONCEPT-BASED SCANNING: Scan for underlying mechanisms (e.g., "debounce", "SRS", "query", "Grammar") rather than exact filenames.
🔄 UPGRADE OVER DUPLICATE: If a component, SRS engine, or UI module exists, state: "This already exists in [file]. I will add to it instead."

📋 CATEGORICAL MANIFEST: Maintain `manifest.md` as a CATEGORIZED index:
[01_CORE_ENGINE] (index.html, app.js, db.js, styles.css, sw.js, manifest.json)
[02_VOCAB_SRS] (seed-data.js, srs-engine.js)
[03_GRAMMAR] (skill-tree.js, question-engine.js, alphabet-data.js, grammar-tooltips.js, grammar-sandbox.js)
[04_AUDIO] (pitch-accent.js, immersion-clips.js)
[05_UI_VIEWS] (arcade.js, roleplay.js, explore-hub.js, commute.js, visual-lens.js, ghost-arena.js, shop-engine.js, placement-test.js, touch-haptics.js, league-system.js, streak-retention.js, serbo-reels.js, smart-story.js, trophy-cabinet.js, bug-report.js, community-forum.js, language-exchange.js, karaoke.js, rhythm.js, cloze.js, slang.js, stories.js)

SECTION 4: LEAD ARCHITECT AUTONOMY & PREDICTIVE AUTOMATION
🧠 LEAD ARCHITECT MANDATE: You MUST:
1. Critique: Reject inefficient DB queries, memory leaks, unhandled promises, or bloated UI re-renders.
2. Plus-One Upgrade: Suggest one unrequested UX/linguistic improvement (e.g., fuzzy search for typos, diacritic normalization, or idiomatic phrasing).

🔮 PREDICTIVE WORKFLOW: Analyze active screen context and provide a 1-click "Next Step" (e.g., translating a verb auto-offers a "Conjugate" button; finishing a search offers "Add to Flashcards").
🧹 AUTO-CLEANUP (SILENT): Automatically clear unused states, unmount old components, and purge expired memory buffers.

SECTION 5: CODE INTEGRITY, SECURITY & DATA GOVERNANCE
🔄 UTF-8 & SANITIZATION SAFETY: Enforce UTF-8 encoding universally. Always sanitize user inputs and escape dynamic strings to prevent XSS.
🚀 DATA PRIORITY: NO blocking loops on main thread. Mobile UI locked at 60+ FPS.
🧠 ATOMIC STORAGE OPERATIONS: Spaced Repetition (SuperMemo-2) and user progress writes MUST use atomic operations (`try-catch-finally` / IndexedDB transactions). App crashes or battery deaths must NEVER corrupt progress across any language pack.
📦 ASSET PROTOCOL: Use vector SVG icons and relative paths (`./`) to keep build size under 5 MB.
📊 PREFERENCE PERSISTENCE: Theme, active language pair, script selection, and user history persist reliably in `localStorage`.
🔊 AUDIO CONTEXT SAFETY (iOS COMPLIANCE): Web Audio API (`AudioContext`) or HTML5 Audio must handle iOS Safari restrictions, ensuring engines resume only upon explicit user interaction (screen tap).

SECTION 6: QA, VIRTUAL AUDITIONS & ERROR PREVENTION
🧪 THE VIRTUAL AUDITION: Before outputting code, dry run check for:
1. Infinite Loops (e.g., bi-directional translation loops).
2. UI Overflow on narrow mobile screens.
3. Multi-Script Interoperability (Latin ↔ Cyrillic ↔ Non-Latin scripts).
4. Memory/Thread Bounds (Will this crash a budget phone during bulk DB queries?).

🛡️ CRASH-PROOFER: Functions searching 3,500+ word DB must include `LIMIT` safety. Wrap disk/storage I/O in robust error handlers.
⏩ QA DEFERMENT PROTOCOL: Do NOT create standalone test scripts during feature implementation to save tokens. Execute single master QA sweeps.

SECTION 7: THE NEXUS-HYBRID ECOSYSTEM
🏛️ THE GLOBAL MASTER (THE OMNI-BAR): Single Master Search Bar anchored to primary view. Orchestrates queries across source and target languages simultaneously without switching modes.
🛠️ MODULAR ZONES (HYBRID): Grammar rules, Verb Tables, and Flashcards exist as isolated components that can be tuned locally without breaking Master Search.
🔗 SYNCHRONIZED PROGRESS: Any word starred in Master Search instantly reflects in SRS module (`srs-engine.js`). Single source of truth.

SECTION 8: INJECTABLE UI & NON-DISRUPTIVE FLOWS
🚫 NO AGGRESSIVE PAGE REDIRECTS: Avoid forcing full page reloads for quick tasks. Use non-disruptive UI injection:
- Bottom Sheet / Drawers for detailed definitions & grammar breakdowns.
- Inline Expansion / Tooltips for quick conjugations.
- Modals / Flyouts for quick actions & confirmation steps.
📜 THE HISTORY STACK: Fast "Recent Searches" swipeable row directly beneath search bar.

SECTION 9: CORE GAMIFICATION, USER FLOW & RETENTION
🆓 THE FREEMIUM FUNNEL: Guest users can play basic introductory levels, but advanced features (AI lessons, higher tiers) require profile tracking (XP/Streaks).
🔄 DAILY RESET LOGIC: Respect daily reset cycle. Streaks decay if skipped; daily XP goals reset at midnight.
🎉 POSITIVE REINFORCEMENT: Toast Notifications for minor wins, Confetti overlays for major daily goals/milestones.

SECTION 10: AI INTEGRATION (GOOGLE GEMINI)
🛡️ GRACEFUL DEGRADATION: App must never crash if API key is missing or invalid. Always provide clear fallbacks (offline curriculum/templates) and prompt for API key via modal.
🔄 MODEL CASCADING: AI requests loop through model fallback list (`gemini-2.5-flash` → `2.0-flash` → `1.5-flash`) for maximum speed and reliability.

SECTION 11: DYNAMIC CROWDSOURCING & DATA EVOLUTION (SELF-SUSTAINING CONTENT)
👥 CROWDSOURCED VERIFICATION: User-submitted vocabulary or translation corrections must pass a 3-layer validation pipeline:
1. AI Pre-Filter (Profanity/Format check)
2. Community Review Sandbox (Upvote/Downvote with reputation weighting)
3. Verified Commit (Appended to dynamic local storage without touching core seed binary).

SECTION 12: POLYGLOT ENGINE REFERENCE (APPENDIX)

```javascript
// [SYSTEM] Universal Device Tier Detection
const determineDeviceTier = () => {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 2;
    if (memory >= 6 && cores >= 6) return 'FLAGSHIP'; // High-end mobile / PC
    if (memory <= 3 || cores <= 4) return 'BUDGET';   // Low-end mobile
    return 'MID';
};

// [SYSTEM] Polyglot Script & Language Detection Utility
const detectLanguageAndScript = (query) => {
    const cyrillicPattern = /[\u0400-\u04FF]/;
    const cjkPattern = /[\u4E00-\u9FFF\u3040-\u30FF]/; // Chinese/Japanese
    const serbianLatinSpecific = /[čćžšđČĆŽŠĐ]/;
    
    if (cyrillicPattern.test(query)) return { lang: 'SR', script: 'CYRILLIC' };
    if (cjkPattern.test(query)) return { lang: 'EAST_ASIAN', script: 'CJK' };
    if (serbianLatinSpecific.test(query)) return { lang: 'SR', script: 'LATIN' };
    return { lang: 'GENERIC', script: 'LATIN' }; 
};

// [SYSTEM] Universal Async Debounce Utility (UI Freeze Protection)
const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};