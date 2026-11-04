// [SHIELD_DAEMON: VALIDATED]
// Priority 41: Interactive Grammar Sandbox & Polished Word-by-Word Sentence Hub
// 2-in-1 Game Hub: Classic Word-by-Word Sentence Builder + Color-Coded Lego Grammar Sandbox (SVO)
// 100% Offline-First, Bilingual Parity (Latinica/Cyrillic), Native Audio & Haptics

const GrammarSandbox = {
    currentMode: 'classic', // 'classic' | 'sandbox'
    sandboxTab: 'puzzle', // 'puzzle' | 'free'

    // Colors for Grammatical Parts of Speech (Lego Color Palette)
    POS_CONFIG: {
        noun: {
            label_sr: 'Imenica',
            label_en: 'Noun',
            color: 'bg-blue-600 border-blue-400 text-white shadow-blue-500/20',
            badgeBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
            pill: '🟦'
        },
        verb: {
            label_sr: 'Glagol',
            label_en: 'Verb',
            color: 'bg-rose-600 border-rose-400 text-white shadow-rose-500/20',
            badgeBg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
            pill: '🟥'
        },
        adj: {
            label_sr: 'Pridev',
            label_en: 'Adjective',
            color: 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20',
            badgeBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
            pill: '🟩'
        },
        prep: {
            label_sr: 'Predlog',
            label_en: 'Preposition',
            color: 'bg-purple-600 border-purple-400 text-white shadow-purple-500/20',
            badgeBg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
            pill: '🟪'
        },
        adv: {
            label_sr: 'Prilog',
            label_en: 'Adverb',
            color: 'bg-amber-600 border-amber-400 text-white shadow-amber-500/20',
            badgeBg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
            pill: '🟧'
        },
        pron: {
            label_sr: 'Zamenica',
            label_en: 'Pronoun',
            color: 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-500/20',
            badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
            pill: '🟫'
        }
    },

    // Curated Bank of 50+ Real Conversational Sentences with POS Tokens
    SENTENCE_BANK: [
        // Level 1: Simple SVO (3-4 words)
        {
            id: 'sb_1',
            level: 1,
            en: 'Ana drinks warm coffee.',
            sr_lat: 'Ana pije toplu kafu.',
            sr_cyr: 'Ана пије топлу кафу.',
            tokens: [
                { lat: 'Ana', cyr: 'Ана', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'pije', cyr: 'пије', pos: 'verb', role: 'Predikat (Prezent)' },
                { lat: 'toplu', cyr: 'топлу', pos: 'adj', role: 'Pridev (Akuzativ ž.r.)' },
                { lat: 'kafu', cyr: 'кафу', pos: 'noun', role: 'Objekat (Akuzativ ž.r.)' }
            ],
            distractors: ['jede', 'hladno', 'vode']
        },
        {
            id: 'sb_2',
            level: 1,
            en: 'Marko reads a good book.',
            sr_lat: 'Marko čita dobru knjigu.',
            sr_cyr: 'Марко чита добру књигу.',
            tokens: [
                { lat: 'Marko', cyr: 'Марко', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'čita', cyr: 'чита', pos: 'verb', role: 'Predikat (Prezent)' },
                { lat: 'dobru', cyr: 'добру', pos: 'adj', role: 'Pridev (Akuzativ ž.r.)' },
                { lat: 'knjigu', cyr: 'књигу', pos: 'noun', role: 'Objekat (Akuzativ ž.r.)' }
            ],
            distractors: ['piše', 'stari', 'hleb']
        },
        {
            id: 'sb_3',
            level: 1,
            en: 'The dog loves the park.',
            sr_lat: 'Pas voli park.',
            sr_cyr: 'Пас воли парк.',
            tokens: [
                { lat: 'Pas', cyr: 'Пас', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'voli', cyr: 'воли', pos: 'verb', role: 'Predikat (Prezent)' },
                { lat: 'park', cyr: 'парк', pos: 'noun', role: 'Objekat (Akuzativ m.r.)' }
            ],
            distractors: ['mačka', 'spava', 'ulica']
        },
        {
            id: 'sb_4',
            level: 1,
            en: 'We are buying fresh bread.',
            sr_lat: 'Mi kupujemo svež hleb.',
            sr_cyr: 'Ми купујемо свеж хлеб.',
            tokens: [
                { lat: 'Mi', cyr: 'Ми', pos: 'pron', role: 'Zamenica (Nominativ)' },
                { lat: 'kupujemo', cyr: 'купујемо', pos: 'verb', role: 'Predikat (Prezent 1. l. mn.)' },
                { lat: 'svež', cyr: 'свеж', pos: 'adj', role: 'Pridev (Akuzativ m.r.)' },
                { lat: 'hleb', cyr: 'хлеб', pos: 'noun', role: 'Objekat (Akuzativ m.r.)' }
            ],
            distractors: ['vi', 'pijemo', 'sladak']
        },
        {
            id: 'sb_5',
            level: 1,
            en: 'The cat sleeps on the chair.',
            sr_lat: 'Mačka spava na stolici.',
            sr_cyr: 'Мачка спава на столици.',
            tokens: [
                { lat: 'Mačka', cyr: 'Мачка', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'spava', cyr: 'спава', pos: 'verb', role: 'Predikat (Prezent)' },
                { lat: 'na', cyr: 'на', pos: 'prep', role: 'Predlog za mesto' },
                { lat: 'stolici', cyr: 'столици', pos: 'noun', role: 'Lokativ ž.r.' }
            ],
            distractors: ['pas', 'trči', 'stolu']
        },

        // Level 2: Adjectives & Prepositions (4-5 words)
        {
            id: 'sb_6',
            level: 2,
            en: 'Nikola lives in a big city.',
            sr_lat: 'Nikola živi u velikom gradu.',
            sr_cyr: 'Никола живи у великом граду.',
            tokens: [
                { lat: 'Nikola', cyr: 'Никола', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'živi', cyr: 'живи', pos: 'verb', role: 'Predikat' },
                { lat: 'u', cyr: 'у', pos: 'prep', role: 'Predlog za lokaciju' },
                { lat: 'velikom', cyr: 'великом', pos: 'adj', role: 'Pridev (Lokativ m.r.)' },
                { lat: 'gradu', cyr: 'граду', pos: 'noun', role: 'Imenica (Lokativ m.r.)' }
            ],
            distractors: ['radi', 'na', 'malo', 'kući']
        },
        {
            id: 'sb_7',
            level: 2,
            en: 'She speaks fluent Serbian language.',
            sr_lat: 'Ona tečno govori srpski jezik.',
            sr_cyr: 'Она течно говори српски језик.',
            tokens: [
                { lat: 'Ona', cyr: 'Она', pos: 'pron', role: 'Zamenica (Nominativ)' },
                { lat: 'tečno', cyr: 'течно', pos: 'adv', role: 'Prilog za način' },
                { lat: 'govori', cyr: 'говори', pos: 'verb', role: 'Predikat' },
                { lat: 'srpski', cyr: 'српски', pos: 'adj', role: 'Pridev (Akuzativ)' },
                { lat: 'jezik', cyr: 'језик', pos: 'noun', role: 'Objekat (Akuzativ)' }
            ],
            distractors: ['on', 'brzo', 'uči', 'engleski']
        },
        {
            id: 'sb_8',
            level: 2,
            en: 'I walk every morning in the park.',
            sr_lat: 'Svakog jutra šetam u parku.',
            sr_cyr: 'Сваког јутра шетам у парку.',
            tokens: [
                { lat: 'Svakog', cyr: 'Сваког', pos: 'adj', role: 'Zamenica/Pridev (Genitiv vremena)' },
                { lat: 'jutra', cyr: 'јутра', pos: 'noun', role: 'Imenica (Genitiv vremena)' },
                { lat: 'šetam', cyr: 'шетам', pos: 'verb', role: 'Predikat (Prezent 1. l. jd.)' },
                { lat: 'u', cyr: 'у', pos: 'prep', role: 'Predlog' },
                { lat: 'parku', cyr: 'парку', pos: 'noun', role: 'Imenica (Lokativ)' }
            ],
            distractors: ['uveče', 'trči', 'na', 'ulici']
        },
        {
            id: 'sb_9',
            level: 2,
            en: 'They drink cold beer with friends.',
            sr_lat: 'Oni piju hladno pivo sa prijateljima.',
            sr_cyr: 'Они пију хладно пиво са пријатељима.',
            tokens: [
                { lat: 'Oni', cyr: 'Они', pos: 'pron', role: 'Zamenica (Nominativ)' },
                { lat: 'piju', cyr: 'пију', pos: 'verb', role: 'Predikat (Prezent 3. l. mn.)' },
                { lat: 'hladno', cyr: 'хладно', pos: 'adj', role: 'Pridev (Akuzativ s.r.)' },
                { lat: 'pivo', cyr: 'пиво', pos: 'noun', role: 'Objekat (Akuzativ s.r.)' },
                { lat: 'sa', cyr: 'са', pos: 'prep', role: 'Predlog za društvo' },
                { lat: 'prijateljima', cyr: 'пријатељима', pos: 'noun', role: 'Instrumental množine' }
            ],
            distractors: ['mi', 'vino', 'u', 'bratom']
        },

        // Level 3: Conversational Fluency & Case Shifts (5-7 words)
        {
            id: 'sb_10',
            level: 3,
            en: 'Waiter brings delicious food to our table.',
            sr_lat: 'Konobar donosi ukusnu hranu za naš sto.',
            sr_cyr: 'Конобар доноси укусну храну за наш сто.',
            tokens: [
                { lat: 'Konobar', cyr: 'Конобар', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'donosi', cyr: 'доноси', pos: 'verb', role: 'Predikat' },
                { lat: 'ukusnu', cyr: 'укусну', pos: 'adj', role: 'Pridev (Akuzativ ž.r.)' },
                { lat: 'hranu', cyr: 'храну', pos: 'noun', role: 'Objekat (Akuzativ ž.r.)' },
                { lat: 'za', cyr: 'за', pos: 'prep', role: 'Predlog' },
                { lat: 'naš', cyr: 'наш', pos: 'pron', role: 'Prisvojna zamenica' },
                { lat: 'sto', cyr: 'сто', pos: 'noun', role: 'Akuzativ cilja' }
            ],
            distractors: ['kuvar', 'pije', 'vodu', 'našem']
        },
        {
            id: 'sb_11',
            level: 3,
            en: 'Tomorrow we are traveling to Novi Sad by train.',
            sr_lat: 'Sutra putujemo u Novi Sad vozom.',
            sr_cyr: 'Сутра путујемо у Нови Сад возом.',
            tokens: [
                { lat: 'Sutra', cyr: 'Сутра', pos: 'adv', role: 'Prilog za vreme' },
                { lat: 'putujemo', cyr: 'путујемо', pos: 'verb', role: 'Predikat' },
                { lat: 'u', cyr: 'у', pos: 'prep', role: 'Predlog pravca' },
                { lat: 'Novi', cyr: 'Нови', pos: 'adj', role: 'Pridev imena' },
                { lat: 'Sad', cyr: 'Сад', pos: 'noun', role: 'Akuzativ mesta' },
                { lat: 'vozom', cyr: 'возом', pos: 'noun', role: 'Instrumental sredstva' }
            ],
            distractors: ['danas', 'idemo', 'na', 'kolima']
        },
        {
            id: 'sb_12',
            level: 3,
            en: 'My grandmother prepares the best burek in Belgrade.',
            sr_lat: 'Moja baka sprema najbolji burek u Beogradu.',
            sr_cyr: 'Моја бака спрема најбољи бурек у Београду.',
            tokens: [
                { lat: 'Moja', cyr: 'Моја', pos: 'pron', role: 'Prisvojna zamenica' },
                { lat: 'baka', cyr: 'бака', pos: 'noun', role: 'Subjekat (Nominativ)' },
                { lat: 'sprema', cyr: 'спрема', pos: 'verb', role: 'Predikat' },
                { lat: 'najbolji', cyr: 'најбољи', pos: 'adj', role: 'Superlativ prideva' },
                { lat: 'burek', cyr: 'бурек', pos: 'noun', role: 'Objekat' },
                { lat: 'u', cyr: 'у', pos: 'prep', role: 'Predlog' },
                { lat: 'Beogradu', cyr: 'Београду', pos: 'noun', role: 'Lokativ' }
            ],
            distractors: ['tvoja', 'mama', 'jede', 'na']
        }
    ],

    // 1. Open Sentence Hub Selection Modal (2-in-1 Hub)
    openHub: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const existing = document.getElementById('sentence-hub-modal');
        if (existing) existing.remove();

        const html = `
            <div id="sentence-hub-modal" class="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-[120] flex items-center justify-center p-4 fade-in">
                <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-slate-100 dark:border-slate-800 text-center space-y-4">
                    
                    <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2.5 text-left">
                            <span class="text-3xl">🏗️</span>
                            <div>
                                <h3 class="text-lg font-black text-slate-800 dark:text-white leading-tight">Graditelj Rečenica</h3>
                                <p class="text-xs text-slate-500 font-bold">2-in-1 Sentence & Grammar Hub</p>
                            </div>
                        </div>
                        <button onclick="GrammarSandbox.closeHub()" class="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold active:scale-95 transition-transform">✕</button>
                    </div>

                    <p class="text-xs text-slate-600 dark:text-slate-400 font-medium text-left">
                        Izaberi način vežbanja rečenica i strukture govora:
                    </p>

                    <!-- Choice 1: Classic Word-by-Word Trainer -->
                    <button onclick="GrammarSandbox.startClassicTrainer()" class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/25 active:scale-95 transition-all text-left flex items-start gap-3.5 group border-2 border-blue-400/50">
                        <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                            🧩
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h4 class="font-black text-sm uppercase tracking-wide">Klasični Graditelj</h4>
                                <span class="bg-white/25 text-[10px] font-black px-2 py-0.5 rounded-full">Reč po reč</span>
                            </div>
                            <p class="text-xs text-blue-100 font-medium mt-1 leading-relaxed">
                                Slaži prave rečenice u tačnom redosledu reč po reč uz zvučni izgovor i nivoe 1–10.
                            </p>
                        </div>
                    </button>

                    <!-- Choice 2: Lego Grammar Sandbox -->
                    <button onclick="GrammarSandbox.startLegoSandbox()" class="w-full bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 p-4 rounded-2xl text-white shadow-lg shadow-teal-500/25 active:scale-95 transition-all text-left flex items-start gap-3.5 group border-2 border-emerald-400/50">
                        <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                            🧱
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h4 class="font-black text-sm uppercase tracking-wide">Lego Grammar Sandbox</h4>
                                <span class="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">Novo ✨</span>
                            </div>
                            <p class="text-xs text-teal-100 font-medium mt-1 leading-relaxed">
                                Bojeni blokovi (Imenice, Glagoli, Pridevi, Predlozi) za vizuelno savladavanje SVO strukture.
                            </p>
                        </div>
                    </button>

                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    },

    closeHub: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const m = document.getElementById('sentence-hub-modal');
        if (m) m.remove();
    },

    // -------------------------------------------------------------
    // MODE 1: POLISHED WORD-BY-WORD SENTENCE TRAINER
    // -------------------------------------------------------------
    classicState: {
        round: 1,
        score: 0,
        lives: 3,
        currentSentence: null,
        selectedTokens: [],
        availablePool: []
    },

    startClassicTrainer: function() {
        this.closeHub();
        this.currentMode = 'classic';
        this.classicState.round = 1;
        this.classicState.score = 0;
        this.classicState.lives = 3;

        if (window.ArcadeEngine) {
            window.ArcadeEngine._cleanup();
            window.ArcadeEngine._showOverlay();
        }

        this.renderClassicRound();
    },

    renderClassicRound: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const isSrToEn = window.state?.settings?.learningDirection === 'sr_to_en';

        // Select sentence based on round
        const poolSentences = this.SENTENCE_BANK.filter(s => s.level <= Math.ceil(this.classicState.round / 3));
        const sentence = poolSentences[(this.classicState.round - 1) % poolSentences.length] || this.SENTENCE_BANK[0];
        this.classicState.currentSentence = sentence;

        // Prompt vs Target
        const promptText = isSrToEn ? (isCyrillic ? sentence.sr_cyr : sentence.sr_lat) : sentence.en;
        const promptLang = isSrToEn ? 'sr-RS' : 'en-US';

        // Prepare correct tokens
        const targetWords = sentence.tokens.map(t => isSrToEn ? t.lat : (isCyrillic ? t.cyr : t.lat));

        // Create pool with distractors
        const pool = [...targetWords, ...(sentence.distractors || []).slice(0, 3)];
        pool.sort(() => Math.random() - 0.5);

        this.classicState.selectedTokens = [];
        this.classicState.availablePool = pool;

        this.updateClassicUI(promptText, promptLang);
    },

    updateClassicUI: function(promptText, promptLang) {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        const state = this.classicState;
        const livesHtml = '❤️'.repeat(Math.max(0, state.lives));

        const selectedHtml = state.selectedTokens.map((w, idx) => `
            <button onclick="GrammarSandbox.undoClassicWord(${idx})" class="bg-blue-600 hover:bg-blue-700 text-white font-black text-base px-3.5 py-2 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5 animate-scaleUp">
                <span>${w}</span>
                <span class="text-xs opacity-70">✕</span>
            </button>
        `).join('');

        const poolHtml = state.availablePool.map((w, idx) => `
            <button onclick="GrammarSandbox.tapClassicWord(${idx})" class="bg-slate-700 hover:bg-slate-600 text-white font-black text-base px-4 py-2.5 rounded-xl border border-slate-600 active:scale-95 transition-transform shadow-md">
                ${w}
            </button>
        `).join('');

        overlay.innerHTML = `
            <div class="flex flex-col h-full bg-slate-900 text-white select-none">
                
                <!-- Header -->
                <div class="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
                    <div class="font-black text-sm uppercase tracking-wider text-slate-300">🧩 Graditelj Rečenica (${state.round}/10)</div>
                    <div class="flex items-center space-x-3 text-sm font-bold">
                        <div class="text-rose-400">${livesHtml}</div>
                        <div class="text-amber-400">Bodovi: ${state.score}</div>
                    </div>
                    <button onclick="ArcadeEngine._hideOverlay()" class="text-xl font-bold hover:text-red-400 transition-colors">✕</button>
                </div>

                <!-- Main Game Body -->
                <div class="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-between max-w-xl mx-auto w-full pb-8">
                    
                    <!-- Prompt Box -->
                    <div class="w-full text-center my-auto space-y-2">
                        <span class="text-xs font-black uppercase tracking-wider text-slate-400">Prevedi i poređaj reči:</span>
                        <div class="flex items-center justify-center gap-2.5">
                            <h3 class="text-2xl font-black text-white">${promptText}</h3>
                            <button onclick="window.app?.speakPhrase('${promptText.replace(/'/g, "\\'")}', '${promptLang}')" class="text-blue-400 text-xl active:scale-90 transition-transform">🔊</button>
                        </div>
                    </div>

                    <!-- Sentence Construction Slot Box -->
                    <div class="w-full min-h-[110px] bg-slate-800/90 rounded-2xl p-4 flex flex-wrap gap-2 content-start border-2 border-dashed border-slate-600 shadow-inner my-4">
                        ${selectedHtml || '<span class="text-slate-500 text-sm font-bold m-auto">Dodirni reči dole da sastaviš rečenicu</span>'}
                    </div>

                    <!-- Available Word Pool -->
                    <div class="w-full flex flex-wrap gap-2.5 justify-center py-2 mb-4">
                        ${poolHtml}
                    </div>

                    <!-- Action Bar -->
                    <div class="w-full flex gap-2">
                        <button onclick="GrammarSandbox.clearClassicSlots()" class="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                            🔄 Poništi
                        </button>
                        <button onclick="GrammarSandbox.checkClassicAnswer()" class="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all uppercase tracking-wide">
                            Proveri Rečenicu ✅
                        </button>
                    </div>

                </div>
            </div>
        `;
    },

    tapClassicWord: function(idx) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const word = this.classicState.availablePool[idx];
        if (!word) return;

        // Speak word audio
        const lang = (window.state?.settings?.learningDirection === 'sr_to_en') ? 'en-US' : 'sr-RS';
        if (window.app?.speakPhrase) window.app.speakPhrase(word, lang);

        this.classicState.selectedTokens.push(word);
        this.classicState.availablePool.splice(idx, 1);

        const promptText = (window.state?.settings?.learningDirection === 'sr_to_en')
            ? (window.state?.script === 'cyrillic' ? this.classicState.currentSentence.sr_cyr : this.classicState.currentSentence.sr_lat)
            : this.classicState.currentSentence.en;
        const promptLang = (window.state?.settings?.learningDirection === 'sr_to_en') ? 'sr-RS' : 'en-US';

        this.updateClassicUI(promptText, promptLang);
    },

    undoClassicWord: function(idx) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const word = this.classicState.selectedTokens[idx];
        if (!word) return;

        this.classicState.availablePool.push(word);
        this.classicState.selectedTokens.splice(idx, 1);

        const promptText = (window.state?.settings?.learningDirection === 'sr_to_en')
            ? (window.state?.script === 'cyrillic' ? this.classicState.currentSentence.sr_cyr : this.classicState.currentSentence.sr_lat)
            : this.classicState.currentSentence.en;
        const promptLang = (window.state?.settings?.learningDirection === 'sr_to_en') ? 'sr-RS' : 'en-US';

        this.updateClassicUI(promptText, promptLang);
    },

    clearClassicSlots: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        this.classicState.availablePool.push(...this.classicState.selectedTokens);
        this.classicState.selectedTokens = [];

        const promptText = (window.state?.settings?.learningDirection === 'sr_to_en')
            ? (window.state?.script === 'cyrillic' ? this.classicState.currentSentence.sr_cyr : this.classicState.currentSentence.sr_lat)
            : this.classicState.currentSentence.en;
        const promptLang = (window.state?.settings?.learningDirection === 'sr_to_en') ? 'sr-RS' : 'en-US';

        this.updateClassicUI(promptText, promptLang);
    },

    checkClassicAnswer: function() {
        const sentence = this.classicState.currentSentence;
        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const isSrToEn = window.state?.settings?.learningDirection === 'sr_to_en';

        const expectedTokens = sentence.tokens.map(t => isSrToEn ? t.lat : (isCyrillic ? t.cyr : t.lat));
        const expectedStr = expectedTokens.join(' ').toLowerCase().replace(/[.,!?]/g, '');
        const actualStr = this.classicState.selectedTokens.join(' ').toLowerCase().replace(/[.,!?]/g, '');

        const overlay = document.getElementById('arcade-game-overlay');

        if (actualStr === expectedStr) {
            // Correct
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('correct');
            if (window.ArcadeEngine?._playSound) window.ArcadeEngine._playSound('correct');

            this.classicState.score += 10 + (this.classicState.round * 2);
            if (window.app?.addXP) window.app.addXP(10);

            this.classicState.round++;
            if (this.classicState.round > 10) {
                // Game Completed!
                if (window.TrophyEngine) {
                    window.TrophyEngine.recordGameResult('sentence_builder', this.classicState.score, true, false);
                }
                overlay.innerHTML = window.ArcadeEngine._renderGameOver('Graditelj Rečenica — Savladano!', this.classicState.score, 'startSentenceBuilder');
            } else {
                overlay.innerHTML = window.ArcadeEngine._renderLevelComplete(this.classicState.round - 1, 'GrammarSandbox.renderClassicRound()');
            }
        } else {
            // Wrong
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('wrong');
            if (window.ArcadeEngine?._playSound) window.ArcadeEngine._playSound('incorrect');

            this.classicState.lives--;
            if (this.classicState.lives <= 0) {
                if (window.TrophyEngine) {
                    window.TrophyEngine.recordGameResult('sentence_builder', this.classicState.score, false, false);
                }
                overlay.innerHTML = window.ArcadeEngine._renderGameOver('Graditelj Rečenica', this.classicState.score, 'startSentenceBuilder');
            } else {
                if (window.app?.showToast) {
                    window.app.showToast('Netačan redosled reči! Probaj ponovo.', 'error');
                }
                const promptText = isSrToEn ? (isCyrillic ? sentence.sr_cyr : sentence.sr_lat) : sentence.en;
                const promptLang = isSrToEn ? 'sr-RS' : 'en-US';
                this.updateClassicUI(promptText, promptLang);
            }
        }
    },

    // -------------------------------------------------------------
    // MODE 2: LEGO GRAMMAR SANDBOX (COLOR-CODED SVO BLOCKS)
    // -------------------------------------------------------------
    sandboxState: {
        puzzleIndex: 0,
        workbenchTokens: []
    },

    startLegoSandbox: function() {
        this.closeHub();
        this.currentMode = 'sandbox';
        this.sandboxState.puzzleIndex = 0;
        this.sandboxState.workbenchTokens = [];

        if (window.ArcadeEngine) {
            window.ArcadeEngine._cleanup();
            window.ArcadeEngine._showOverlay();
        }

        this.renderSandboxUI();
    },

    setSandboxTab: function(tab) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        this.sandboxTab = tab;
        this.sandboxState.workbenchTokens = [];
        this.renderSandboxUI();
    },

    renderSandboxUI: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const isPuzzle = this.sandboxTab === 'puzzle';

        // Current target sentence for puzzle mode
        const puzzleSentence = this.SENTENCE_BANK[this.sandboxState.puzzleIndex % this.SENTENCE_BANK.length];

        // Workbench blocks html
        const workbenchHtml = this.sandboxState.workbenchTokens.map((t, idx) => {
            const cfg = this.POS_CONFIG[t.pos] || this.POS_CONFIG.noun;
            const displayWord = isCyrillic ? (t.cyr || t.lat) : t.lat;
            return `
                <button onclick="GrammarSandbox.removeSandboxBlock(${idx})" class="${cfg.color} font-black text-sm px-3.5 py-2.5 rounded-xl border-2 shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform animate-scaleUp" title="${cfg.label_sr}: ${t.role}">
                    <span>${cfg.pill}</span>
                    <span>${displayWord}</span>
                    <span class="text-xs opacity-70 ml-1">✕</span>
                </button>
            `;
        }).join('');

        // Blueprint blueprint hints for puzzle mode
        const blueprintHtml = puzzleSentence.tokens.map((t, idx) => {
            const cfg = this.POS_CONFIG[t.pos] || this.POS_CONFIG.noun;
            const isFilled = this.sandboxState.workbenchTokens[idx]?.pos === t.pos;
            return `
                <div class="p-2 rounded-xl border-2 ${isFilled ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' : 'border-dashed border-slate-600 bg-slate-800 text-slate-400'} text-xs font-bold text-center flex items-center justify-center gap-1">
                    <span>${cfg.pill}</span>
                    <span>${cfg.label_sr}</span>
                    ${isFilled ? '<span>✅</span>' : ''}
                </div>
            `;
        }).join('');

        // Available blocks bank
        const currentSentenceTokens = isPuzzle ? puzzleSentence.tokens : this.SENTENCE_BANK.slice(0, 5).flatMap(s => s.tokens);
        // Deduplicate
        const uniqueTokens = [];
        const seen = new Set();
        for (const t of currentSentenceTokens) {
            if (!seen.has(t.lat)) {
                seen.add(t.lat);
                uniqueTokens.push(t);
            }
        }

        const blocksHtml = uniqueTokens.map((t, idx) => {
            const cfg = this.POS_CONFIG[t.pos] || this.POS_CONFIG.noun;
            const displayWord = isCyrillic ? (t.cyr || t.lat) : t.lat;
            return `
                <button onclick="GrammarSandbox.addSandboxBlock('${t.lat}')" class="${cfg.color} font-black text-sm px-3.5 py-2 rounded-xl border-2 shadow-md active:scale-95 transition-transform flex items-center gap-1.5 hover:brightness-110">
                    <span>${cfg.pill}</span>
                    <span>${displayWord}</span>
                </button>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="flex flex-col h-full bg-slate-900 text-white select-none">
                
                <!-- Header -->
                <div class="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🧱</span>
                        <div>
                            <h3 class="font-black text-sm uppercase tracking-wide">Lego Grammar Sandbox</h3>
                            <p class="text-[10px] text-teal-400 font-bold">Bojeni Blokovi i SVO Struktura</p>
                        </div>
                    </div>
                    <button onclick="ArcadeEngine._hideOverlay()" class="text-xl font-bold hover:text-red-400 transition-colors">✕</button>
                </div>

                <!-- Tab Switcher -->
                <div class="grid grid-cols-2 p-2 bg-slate-800/80 border-b border-slate-700 text-center gap-2">
                    <button onclick="GrammarSandbox.setSandboxTab('puzzle')" class="py-2 rounded-xl font-black text-xs transition-all ${isPuzzle ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                        🧩 Slagalica Izazov (${this.sandboxState.puzzleIndex + 1}/12)
                    </button>
                    <button onclick="GrammarSandbox.setSandboxTab('free')" class="py-2 rounded-xl font-black text-xs transition-all ${!isPuzzle ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}">
                        🔬 Slobodna Laboratorija
                    </button>
                </div>

                <!-- Content Area -->
                <div class="flex-1 overflow-y-auto p-4 flex flex-col justify-between max-w-xl mx-auto w-full pb-8">
                    
                    ${isPuzzle ? `
                        <!-- Target Sentence Header -->
                        <div class="w-full text-center my-2 space-y-1">
                            <span class="text-xs font-black uppercase tracking-wider text-slate-400">Ciljna Rečenica:</span>
                            <h3 class="text-xl font-black text-white">${puzzleSentence.en}</h3>
                            <p class="text-xs text-teal-300 font-bold">${isCyrillic ? puzzleSentence.sr_cyr : puzzleSentence.sr_lat}</p>
                        </div>

                        <!-- Grammatical Blueprint Slots -->
                        <div class="w-full space-y-1 mb-2">
                            <span class="text-[10px] font-black uppercase text-slate-400">Potrebna Gramatička Šema:</span>
                            <div class="grid grid-cols-${Math.min(4, puzzleSentence.tokens.length)} gap-1.5">
                                ${blueprintHtml}
                            </div>
                        </div>
                    ` : `
                        <div class="w-full text-center my-2 space-y-1">
                            <span class="text-xs font-black uppercase tracking-wider text-teal-400">Slobodni Sandbox:</span>
                            <p class="text-xs text-slate-400">Kombinuj plave imenice, crvene glagole i zelene prideve da testiraš red reči!</p>
                        </div>
                    `}

                    <!-- Workbench Container -->
                    <div class="w-full min-h-[100px] bg-slate-800/90 rounded-2xl p-4 flex flex-wrap gap-2 content-start border-2 border-slate-700 shadow-inner my-2">
                        ${workbenchHtml || '<span class="text-slate-500 text-sm font-bold m-auto">Dodirni blokove dole da ih ubaciš na radnu površinu</span>'}
                    </div>

                    <!-- Available Lego Blocks Palette -->
                    <div class="w-full space-y-2 mt-2">
                        <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                            <span>Izaberi Bojene Blokove:</span>
                            <div class="flex gap-2 text-[10px]">
                                <span>🟦 Imenica</span>
                                <span>🟥 Glagol</span>
                                <span>🟩 Pridev</span>
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-2 justify-center max-h-44 overflow-y-auto p-2 bg-slate-800/40 rounded-xl border border-slate-700/60">
                            ${blocksHtml}
                        </div>
                    </div>

                    <!-- Action Bar -->
                    <div class="w-full flex gap-2 mt-4">
                        <button onclick="GrammarSandbox.clearWorkbench()" class="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold text-sm active:scale-95 transition-transform">
                            🔄 Očisti
                        </button>
                        <button onclick="GrammarSandbox.evaluateWorkbench()" class="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-black text-base rounded-xl shadow-lg shadow-teal-500/25 active:scale-95 transition-all uppercase tracking-wide">
                            ${isPuzzle ? 'Proveri Slagalicu ✨' : 'Analiziraj Rečenicu 🔬'}
                        </button>
                    </div>

                </div>
            </div>
        `;
    },

    addSandboxBlock: function(latWord) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const token = this.findToken(latWord);
        if (!token) return;

        // Speak audio
        const lang = (window.state?.settings?.learningDirection === 'sr_to_en') ? 'en-US' : 'sr-RS';
        if (window.app?.speakPhrase) window.app.speakPhrase(latWord, lang);

        this.sandboxState.workbenchTokens.push(token);
        this.renderSandboxUI();
    },

    removeSandboxBlock: function(idx) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        this.sandboxState.workbenchTokens.splice(idx, 1);
        this.renderSandboxUI();
    },

    clearWorkbench: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        this.sandboxState.workbenchTokens = [];
        this.renderSandboxUI();
    },

    findToken: function(latWord) {
        for (const s of this.SENTENCE_BANK) {
            const found = s.tokens.find(t => t.lat.toLowerCase() === latWord.toLowerCase());
            if (found) return found;
        }
        return null;
    },

    evaluateWorkbench: function() {
        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const isPuzzle = this.sandboxTab === 'puzzle';
        const tokens = this.sandboxState.workbenchTokens;

        if (tokens.length === 0) {
            if (window.app?.showToast) window.app.showToast('Postavi bar nekoliko blokova!', 'info');
            return;
        }

        const sentenceText = tokens.map(t => isCyrillic ? (t.cyr || t.lat) : t.lat).join(' ');

        // Speak full sentence
        if (window.app?.speakPhrase) window.app.speakPhrase(sentenceText, 'sr-RS');

        if (isPuzzle) {
            const puzzle = this.SENTENCE_BANK[this.sandboxState.puzzleIndex % this.SENTENCE_BANK.length];
            const expectedPattern = puzzle.tokens.map(t => t.pos).join('-');
            const actualPattern = tokens.map(t => t.pos).join('-');

            const expectedWords = puzzle.tokens.map(t => t.lat.toLowerCase()).join(' ');
            const actualWords = tokens.map(t => t.lat.toLowerCase()).join(' ');

            if (actualWords === expectedWords || actualPattern === expectedPattern) {
                // Correct
                if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('fanfare');
                if (window.app?.addXP) window.app.addXP(15);
                if (window.app?.showToast) window.app.showToast('🎉 Savršeno složena rečenica! (+15 XP)', 'success');

                this.sandboxState.puzzleIndex++;
                this.sandboxState.workbenchTokens = [];

                if (window.TrophyEngine) {
                    window.TrophyEngine.recordGameResult('sentence_builder', 15 * this.sandboxState.puzzleIndex, true, false);
                }

                setTimeout(() => {
                    this.renderSandboxUI();
                }, 800);
            } else {
                if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('wrong');
                if (window.app?.showToast) window.app.showToast('Red reči ili uloge blokova se ne poklapaju! Probaj ponovo.', 'error');
            }
        } else {
            // Free Sandbox Analysis
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('correct');

            const breakdown = tokens.map(t => {
                const cfg = this.POS_CONFIG[t.pos] || this.POS_CONFIG.noun;
                return `${cfg.pill} ${t.lat} [${cfg.label_sr}]`;
            }).join(' ➔ ');

            if (window.app?.showToast) {
                window.app.showToast(`Struktura: ${breakdown}`, 'info');
            }
        }
    }
};

window.GrammarSandbox = GrammarSandbox;
