// [SHIELD_DAEMON: VALIDATED]
// Priority 38: Smart Paced Story Mode ("Pametne Priče")
// Dynamically weaves the learner's weakest / due vocabulary into authentic Serbian cultural stories.
// Features dual-mode execution: Google Gemini API (model cascading) + 100% Offline Procedural Story Weaver.
// Automatically updates SuperMemo-2 SRS progress upon story completion.

const SmartStoryEngine = {
    currentTargetWords: [],
    currentStory: null,
    currentStepIndex: 0,
    isGenerating: false,
    quizAnswered: false,

    // Offline Cultural Story Templates (100% Offline-First Resilience)
    OFFLINE_TEMPLATES: [
        {
            id: 'template_kafana',
            title_sr: 'Veče u Tradicionalnoj Kafani',
            title_en: 'An Evening in a Traditional Kafana',
            icon: '🍲',
            location: 'Kafana "Znak Pitanja", Beograd',
            dialogues: [
                {
                    speaker: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr_lat: 'Dobro veče! Dobrodošli u našu staru kafanu. Imate li slobodno vreme za večeru?',
                    sr_cyr: 'Добро вече! Добродошли у нашу стару кафану. Имате ли слободно време за вечеру?',
                    en: 'Good evening! Welcome to our old kafana. Do you have time for dinner?'
                },
                {
                    speaker: 'Nikola',
                    speakerIcon: '👨',
                    sr_lat: 'Dobro veče! Naravno, tražimo sto pored prozora. Preporučite nam domaće specijalitete.',
                    sr_cyr: 'Добро вече! Наравно, тражимо сто поред прозора. Препоручите нам домаће специјалитете.',
                    en: 'Good evening! Of course, we are looking for a table by the window. Recommend us local specialties.'
                },
                {
                    speaker: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr_lat: 'Sa zadovoljstvom! Za početak predlažem domaću pogaču, kajmak i suvo meso.',
                    sr_cyr: 'Са задовољством! За почетак предлажем домаћу погачу, кајмак и суво месо.',
                    en: 'With pleasure! For starters I suggest homemade bread, kajmak, and cured meat.'
                },
                {
                    speaker: 'Nikola',
                    speakerIcon: '👨',
                    sr_lat: 'Zvuči odlično! Molim vas donesite nam i bokal domaće vode i mineralnu vodu.',
                    sr_cyr: 'Звучи одлично! Молим вас донесите нам и бокал домаће воде и минералну воду.',
                    en: 'Sounds great! Please bring us a pitcher of tap water and sparkling water.'
                },
                {
                    speaker: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr_lat: 'Stiže odmah za vaš sto. Uživajte u prijatnoj muzici starogradskih tamburaša!',
                    sr_cyr: 'Стиже одмах за ваш сто. Уживајте у пријатној музици староградских тамбураша!',
                    en: 'Coming right up for your table. Enjoy the pleasant old-town acoustic music!'
                }
            ],
            quiz: {
                question_sr: 'Gde se odvija ova kulturna priča?',
                question_en: 'Where does this cultural story take place?',
                options: ['U tradicionalnoj kafani u Beogradu', 'Na železničkoj stanici', 'U bioskopu'],
                correctIndex: 0,
                explanation: 'Priča se dešava u kultnoj beogradskoj kafani uz tamburaše i tradicionalnu hranu.'
            }
        },
        {
            id: 'template_pijaca',
            title_sr: 'Jutarnja Kupovina na Kalenić Pijaci',
            title_en: 'Morning Shopping at Kalenić Market',
            icon: '🍅',
            location: 'Kalenić Pijaca, Vračar',
            dialogues: [
                {
                    speaker: 'Baka Milica',
                    speakerIcon: '👵',
                    sr_lat: 'Dobro jutro komšija! Pogledajte ovaj svež paradajz i domaće jagode.',
                    sr_cyr: 'Добро јутро комшија! Погледајте овај свеж парадајз и домаће јагоде.',
                    en: 'Good morning neighbor! Look at these fresh tomatoes and homemade strawberries.'
                },
                {
                    speaker: 'Ana',
                    speakerIcon: '👩',
                    sr_lat: 'Dobro jutro! Sve izgleda prelepo i miriše na pravo domaće voće.',
                    sr_cyr: 'Добро јутро! Све изгледа прелепо и мирише на право домаће воће.',
                    en: 'Good morning! Everything looks beautiful and smells like real homegrown fruit.'
                },
                {
                    speaker: 'Baka Milica',
                    speakerIcon: '👵',
                    sr_lat: 'Sve je jutros ubrano u mojoj bašti. Probajte jedno zrno grožđa besplatno!',
                    sr_cyr: 'Све је јутрос убрано у мојој башти. Пробајте једно зрно грожђа бесплатно!',
                    en: 'Everything was picked this morning in my garden. Try one grape for free!'
                },
                {
                    speaker: 'Ana',
                    speakerIcon: '👩',
                    sr_lat: 'Hvala lepo, preukusno je! Uzeću dva kilograma paradajza i kilo sira.',
                    sr_cyr: 'Хвала лепо, преукусно је! Узећу два килограма парадајза и кило сира.',
                    en: 'Thank you very much, it is delicious! I will take two kilograms of tomatoes and a kilo of cheese.'
                },
                {
                    speaker: 'Baka Milica',
                    speakerIcon: '👵',
                    sr_lat: 'Izvolite i dođite nam opet! Prijatan dan i živeli!',
                    sr_cyr: 'Изволите и дођите нам опет! Пријатан дан и живели!',
                    en: 'Here you go and come visit us again! Have a pleasant day and cheers!'
                }
            ],
            quiz: {
                question_sr: 'Šta je Ana kupila kod bake na pijaci?',
                question_en: 'What did Ana buy from the grandmother at the market?',
                options: ['Paradajz i domaći sir', 'Samo kafu i čaj', 'Knjige i novine'],
                correctIndex: 0,
                explanation: 'Ana je kupila dva kilograma svežeg paradajza i domaći sir.'
            }
        },
        {
            id: 'template_knez',
            title_sr: 'Susret u Knez Mihailovoj Ulici',
            title_en: 'Meeting on Knez Mihailova Street',
            icon: '🏙️',
            location: 'Knez Mihailova & Trg Republike',
            dialogues: [
                {
                    speaker: 'Stefan',
                    speakerIcon: '🧔',
                    sr_lat: 'Zdravo Ana! Drago mi je što te vidim. Jesi li dugo čekala kod fontane?',
                    sr_cyr: 'Здраво Ана! Драго ми је што те видим. Јеси ли дуго чекала код фонтане?',
                    en: 'Hello Ana! Glad to see you. Have you been waiting long by the fountain?'
                },
                {
                    speaker: 'Ana',
                    speakerIcon: '👩',
                    sr_lat: 'Zdravo Stefane! Tek sam stigla. Gužva u centru je velika, ali je vreme divno.',
                    sr_cyr: 'Здраво Стефане! Тек сам стигла. Гужва у центру је велика, али је време дивно.',
                    en: 'Hello Stefan! I just arrived. The crowd downtown is big, but the weather is wonderful.'
                },
                {
                    speaker: 'Stefan',
                    speakerIcon: '🧔',
                    sr_lat: 'Hoćemo li do Kalemegdana na laganu šetnju pa na kafu sa pogledom na reku?',
                    sr_cyr: 'Хоћемо ли до Калемегдана на лагану шетњу па на кафу са погледом на реку?',
                    en: 'Shall we go to Kalemegdan for an easy walk and then coffee overlooking the river?'
                },
                {
                    speaker: 'Ana',
                    speakerIcon: '👩',
                    sr_lat: 'Odlična ideja! Kalemegdanska tvrđava je najlepša u ovo doba dana.',
                    sr_cyr: 'Одлична идеја! Калемегданска тврђава је најлепша у ово доба дана.',
                    en: 'Great idea! Kalemegdan fortress is the most beautiful at this time of day.'
                },
                {
                    speaker: 'Stefan',
                    speakerIcon: '🧔',
                    sr_lat: 'Onda idemo odmah! Povedi i mene stazom kroz park.',
                    sr_cyr: 'Онда идемо одмах! Поведи и мене стазом кроз парк.',
                    en: 'Then let us go right away! Lead the way through the park path.'
                }
            ],
            quiz: {
                question_sr: 'Kuda su Stefan i Ana odlučili da prošetaju?',
                question_en: 'Where did Stefan and Ana decide to take a walk?',
                options: ['Do Kalemegdanske tvrđave i parka', 'Na aerodrom', 'U tržni centar'],
                correctIndex: 0,
                explanation: 'Odlučili su da prošetaju Knez Mihailovom ulicom pravo do Kalemegdana.'
            }
        }
    ],

    // 1. Gather target words from Mistake Vault & SuperMemo-2 SRS Data
    getTargetWords: async function(limit = 5) {
        const mistakeLog = (window.state && window.state.mistakeLog) ? window.state.mistakeLog : {};
        const srsData = (window.state && window.state.srsData) ? window.state.srsData : {};

        const allIdsSet = new Set([...Object.keys(mistakeLog), ...Object.keys(srsData)]);
        const todayStr = new Date().toISOString().split('T')[0];

        const candidates = [];
        for (const id of allIdsSet) {
            const rec = window.SrsEngine ? window.SrsEngine.getWordRecord(id) : { repetitions: 0, strength: 30 };
            const retention = window.SrsEngine ? window.SrsEngine.getRetentionScore(rec) : 30;
            const isDue = rec.nextReview && rec.nextReview <= todayStr;
            const mistakes = mistakeLog[id] || 0;

            // Priority score: Due today gets huge boost, lower retention gets higher priority
            let priority = (100 - retention) + (mistakes * 10);
            if (isDue) priority += 200;

            candidates.push({ id, priority, retention, isDue, mistakes });
        }

        // Sort descending by priority (weakest & due first)
        candidates.sort((a, b) => b.priority - a.priority);
        const topCandidates = candidates.slice(0, limit);

        const targetWords = [];
        for (const c of topCandidates) {
            let wordData = null;
            if (window.appDb && typeof window.appDb.getWord === 'function') {
                try {
                    wordData = await window.appDb.getWord(c.id);
                } catch (e) {
                    console.warn('[SmartStory] DB fetch error for ID:', c.id);
                }
            }
            if (!wordData && window.SEED_DATA) {
                wordData = window.SEED_DATA.find(w => w.id === c.id);
            }
            if (!wordData && window.DICTIONARY) {
                wordData = window.DICTIONARY.find(w => w.id === c.id);
            }

            if (wordData) {
                targetWords.push({
                    id: c.id,
                    sr_lat: wordData.sr_lat || wordData.serbian || wordData.word || c.id,
                    sr_cyr: wordData.sr_cyr || (window.to_cyrillic ? window.to_cyrillic(wordData.sr_lat || wordData.serbian || c.id) : wordData.word),
                    en: wordData.en || wordData.english || wordData.translation || '',
                    phonetic: wordData.phonetic || '',
                    pos: wordData.pos || 'reč'
                });
            }
        }

        // Fallback if user has no mistakes recorded yet: Provide fundamental conversational words
        if (targetWords.length < 3) {
            const defaults = [
                { id: 'def_1', sr_lat: 'hvala', sr_cyr: 'хвала', en: 'thank you', phonetic: 'HVAH-lah', pos: 'uzvik' },
                { id: 'def_2', sr_lat: 'molim', sr_cyr: 'молим', en: 'please / you are welcome', phonetic: 'MOH-leem', pos: 'glagol' },
                { id: 'def_3', sr_lat: 'lepo', sr_cyr: 'лепо', en: 'nice / beautifully', phonetic: 'LEH-poh', pos: 'prilog' },
                { id: 'def_4', sr_lat: 'voda', sr_cyr: 'вода', en: 'water', phonetic: 'VOH-dah', pos: 'imenica' },
                { id: 'def_5', sr_lat: 'prijatelj', sr_cyr: 'пријатељ', en: 'friend', phonetic: 'pree-YAH-tehl', pos: 'imenica' }
            ];
            for (const d of defaults) {
                if (!targetWords.find(t => t.sr_lat.toLowerCase() === d.sr_lat.toLowerCase())) {
                    targetWords.push(d);
                    if (targetWords.length >= limit) break;
                }
            }
        }

        return targetWords;
    },

    // 2. Start Smart Story from Mistake Vault or Stories Menu
    startFromMistakes: async function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();

        this.currentTargetWords = await this.getTargetWords(5);
        this.currentStepIndex = 0;
        this.quizAnswered = false;

        // Show generation modal immediately
        this.renderLoadingModal();

        // Check for Gemini API key
        const apiKey = window.apiKey || (window.state && window.state.apiKey) || localStorage.getItem('serbolingo_api_key');
        let generatedStory = null;

        if (apiKey && navigator.onLine) {
            try {
                generatedStory = await this.generateWithGemini(this.currentTargetWords, apiKey);
            } catch (err) {
                console.warn('[SmartStory] AI generation failed or timed out, falling back to offline weaver:', err);
                generatedStory = null;
            }
        }

        // If no AI or AI failed, use procedural offline weaver
        if (!generatedStory) {
            generatedStory = this.weaveOfflineStory(this.currentTargetWords);
        }

        this.currentStory = generatedStory;
        this.renderStoryModal();
    },

    // 3. Online Generation using Google Gemini with Model Cascading
    generateWithGemini: async function(words, apiKey) {
        const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        const wordListStr = words.map(w => `"${w.sr_lat}" (${w.en})`).join(', ');

        const promptText = `You are a native Serbian author creating an authentic, immersive, and fun short language-learning story for a student learning Serbian.
The student recently made mistakes on these target words: ${wordListStr}.

Write a short engaging dialogue or mini-story (5 distinct dialogue turns) set in Belgrade or a famous Serbian cultural location (like a cafe, bakery, market, or Kalemegdan).
Naturally weave as many of these target words as possible into the Serbian sentences.

Return ONLY a valid JSON object with this exact structure:
{
  "title_sr": "Serbian title in Latin script",
  "title_en": "English translation of title",
  "icon": "A single representative emoji (e.g. ☕, 🥖, 🚆, 🌸)",
  "location": "Name of location in Serbia",
  "dialogues": [
    {
      "speaker": "Speaker Name (e.g. Marko or Prodavac)",
      "speakerIcon": "Single emoji avatar (e.g. 👨, 👩, 👴)",
      "sr_lat": "Natural conversational Serbian in Latin script with target words used naturally",
      "sr_cyr": "Exact same sentence in Serbian Cyrillic script",
      "en": "Natural English translation"
    }
  ],
  "quiz": {
    "question_sr": "Short comprehension question in Serbian about the story",
    "question_en": "Comprehension question in English",
    "options": ["Option A", "Option B", "Option C"],
    "correctIndex": 0,
    "explanation": "Brief explanation in Serbian why this is correct"
  }
}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout for snappy mobile response

        let lastError = null;
        for (const model of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    }),
                    signal: controller.signal
                });

                if (!response.ok) {
                    lastError = new Error(`HTTP ${response.status}`);
                    continue;
                }

                const data = await response.json();
                clearTimeout(timeoutId);

                const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!rawJson) throw new Error('Empty response');

                const parsed = JSON.parse(rawJson);
                if (parsed.dialogues && parsed.dialogues.length > 0) {
                    parsed.isAIGenerated = true;
                    return parsed;
                }
            } catch (err) {
                lastError = err;
                if (err.name === 'AbortError') break;
            }
        }

        clearTimeout(timeoutId);
        throw lastError || new Error('All Gemini models failed');
    },

    // 4. Procedural Offline Story Weaver
    weaveOfflineStory: function(words) {
        // Pick random template from the 3 curated offline templates
        const randIndex = Math.floor(Math.random() * this.OFFLINE_TEMPLATES.length);
        const template = JSON.parse(JSON.stringify(this.OFFLINE_TEMPLATES[randIndex]));

        // In the final dialogue turn, weave in a learning reminder with the target words
        const targetWordsPreview = words.slice(0, 3).map(w => w.sr_lat).join(', ');
        template.dialogues.push({
            speaker: 'Tvoj Rečnik',
            speakerIcon: '💡',
            sr_lat: `Odlično! Zapamti ove važne reči u priči: ${targetWordsPreview}. Svaka čast na vežbanju!`,
            sr_cyr: `Одлично! Запамти ове важне речи у причи: ${words.slice(0, 3).map(w => w.sr_cyr).join(', ')}. Свака част на вежбању!`,
            en: `Great job! Remember these key words from the story: ${words.slice(0, 3).map(w => `${w.sr_lat} (${w.en})`).join(', ')}. Excellent practice!`
        });

        template.isAIGenerated = false;
        return template;
    },

    // 5. Render Loading Screen Modal
    renderLoadingModal: function() {
        const existing = document.getElementById('smart-story-modal');
        if (existing) existing.remove();

        const wordsPills = this.currentTargetWords.map(w => 
            `<span class="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-300 dark:border-amber-700/50">✨ ${w.sr_lat}</span>`
        ).join(' ');

        const html = `
            <div id="smart-story-modal" class="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 fade-in">
                <div class="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl border-2 border-slate-100 dark:border-slate-700 text-center space-y-4">
                    <div class="w-16 h-16 bg-gradient-to-tr from-amber-400 to-rose-500 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30 animate-bounce">
                        📖
                    </div>
                    <div>
                        <h3 class="text-xl font-black text-slate-800 dark:text-white">Kreiramo Pametnu Priču...</h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Ubacujemo tvoje najslabije reči u autentičnu kulturnu priču</p>
                    </div>
                    <div class="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60">
                        <span class="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Ciljne Reči (Target Words):</span>
                        <div class="flex flex-wrap gap-1.5 justify-center">
                            ${wordsPills}
                        </div>
                    </div>
                    <div class="flex items-center justify-center gap-2 text-xs font-black text-amber-600 dark:text-amber-400">
                        <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                        <span>Priprema dijaloga i fonetike...</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    },

    // 6. Render Interactive Story Player Modal
    renderStoryModal: function() {
        const modal = document.getElementById('smart-story-modal');
        if (!modal) return;

        const story = this.currentStory;
        const isCyrillic = window.state && window.state.script === 'cyrillic';

        const wordsPills = this.currentTargetWords.map(w => {
            const displayWord = isCyrillic ? w.sr_cyr : w.sr_lat;
            return `<button onclick="SmartStoryEngine.inspectWord('${w.id}')" class="bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full text-xs font-black border border-amber-300 dark:border-amber-700/50 active:scale-95 transition-transform flex items-center gap-1">
                <span>✨ ${displayWord}</span>
                <span class="text-[10px] opacity-70">🔊</span>
            </button>`;
        }).join('');

        modal.innerHTML = `
            <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 fade-in">
                <div class="bg-white dark:bg-slate-900 w-full sm:max-w-lg h-[92vh] sm:h-[85vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    
                    <!-- Top Bar -->
                    <div class="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">${story.icon || '📖'}</span>
                            <div>
                                <h3 class="text-base font-black text-slate-800 dark:text-white leading-tight">${story.title_sr}</h3>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <span class="text-[11px] font-bold text-slate-400">${story.location || 'Kulturna Priča'}</span>
                                    <span class="text-[9px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-black uppercase">
                                        ${story.isAIGenerated ? '✨ AI Generisano' : '⚡ Offline Pripovedač'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onclick="SmartStoryEngine.closeModal()" class="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-transform">✕</button>
                    </div>

                    <!-- Target Words Bar -->
                    <div class="px-4 py-2.5 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200/50 dark:border-amber-800/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        <span class="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 shrink-0 mr-1">Tvoje Reči:</span>
                        ${wordsPills}
                    </div>

                    <!-- Chat Narrative Area -->
                    <div id="smart-story-dialogues" class="flex-1 overflow-y-auto p-4 space-y-4 pb-32 scroll-smooth">
                        <!-- Bubbles rendered step by step -->
                    </div>

                    <!-- Footer Controls -->
                    <div id="smart-story-footer" class="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 z-10">
                        <button id="smart-story-next-btn" onclick="SmartStoryEngine.nextStep()" class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                            <span>Nastavi Čitanje</span>
                            <span>➡️</span>
                        </button>
                    </div>

                </div>
            </div>
        `;

        this.renderCurrentStep();
    },

    // 7. Render Step in Story (Dialogue turn or Quiz)
    renderCurrentStep: function() {
        const container = document.getElementById('smart-story-dialogues');
        const nextBtn = document.getElementById('smart-story-next-btn');
        if (!container || !this.currentStory) return;

        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const dialogues = this.currentStory.dialogues || [];

        // If we are showing dialogues
        if (this.currentStepIndex < dialogues.length) {
            const d = dialogues[this.currentStepIndex];
            const textSr = isCyrillic ? (d.sr_cyr || d.sr_lat) : d.sr_lat;

            // Highlight target words in the text
            const highlightedTextSr = this.highlightTargetWords(textSr);

            const bubbleId = `story-bubble-${this.currentStepIndex}`;
            const bubbleHtml = `
                <div id="${bubbleId}" class="flex gap-3 items-start fade-in">
                    <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                        ${d.speakerIcon || '🗣️'}
                    </div>
                    <div class="flex-1 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-3.5 rounded-2xl rounded-tl-sm shadow-sm space-y-1.5">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-black text-slate-700 dark:text-slate-200">${d.speaker}</span>
                            <button onclick="SmartStoryEngine.speakPhrase('${textSr.replace(/'/g, "\\'")}')" class="text-xs text-blue-500 dark:text-blue-400 font-bold hover:underline flex items-center gap-1 active:scale-95 transition-transform" title="Slušaj izgovor">
                                <span>🔊 Slušaj</span>
                            </button>
                        </div>
                        <p class="text-sm font-bold text-slate-800 dark:text-white leading-relaxed select-text">${highlightedTextSr}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-200/60 dark:border-slate-700/60 pt-1.5 mt-1 select-text">${d.en}</p>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', bubbleHtml);

            // Auto-speak phrase gently
            this.speakPhrase(textSr);

            // Scroll to bottom
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 50);

            // Update button label
            if (this.currentStepIndex === dialogues.length - 1) {
                if (this.currentStory.quiz) {
                    nextBtn.innerHTML = `<span>Proveri Razumevanje (Quiz)</span> <span>🧠</span>`;
                } else {
                    nextBtn.innerHTML = `<span>🎉 Završi Priču & Snimi Napredak</span>`;
                }
            } else {
                nextBtn.innerHTML = `<span>Nastavi Čitanje (${this.currentStepIndex + 1}/${dialogues.length})</span> <span>➡️</span>`;
            }
        } 
        // If we reached the quiz checkpoint
        else if (this.currentStepIndex === dialogues.length && this.currentStory.quiz) {
            this.renderQuizCheckpoint(container, nextBtn);
        }
        // If everything is done -> Finish
        else {
            this.finishStory();
        }
    },

    // 8. Render Comprehension Quiz Checkpoint
    renderQuizCheckpoint: function(container, nextBtn) {
        const quiz = this.currentStory.quiz;
        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const qTitle = isCyrillic ? quiz.question_sr : quiz.question_sr;

        const optionsHtml = quiz.options.map((opt, idx) => `
            <button id="story-opt-${idx}" onclick="SmartStoryEngine.checkQuizAnswer(${idx})" class="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-slate-800 dark:text-white active:scale-95 transition-all flex items-center justify-between">
                <span>${opt}</span>
                <span id="story-opt-icon-${idx}" class="text-base">⚪</span>
            </button>
        `).join('');

        const quizHtml = `
            <div id="story-quiz-card" class="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-indigo-950/40 p-4 rounded-3xl border-2 border-indigo-200 dark:border-indigo-800 shadow-md space-y-3 fade-in mt-4">
                <div class="flex items-center gap-2">
                    <span class="text-xl">🧠</span>
                    <span class="text-xs font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Kulturna Provera Razumevanja:</span>
                </div>
                <h4 class="text-sm font-black text-slate-800 dark:text-white leading-snug">${qTitle}</h4>
                <p class="text-xs text-slate-500 dark:text-slate-400">${quiz.question_en}</p>
                <div class="space-y-2 pt-1">
                    ${optionsHtml}
                </div>
                <div id="story-quiz-feedback" class="hidden p-3 rounded-2xl text-xs font-bold mt-2"></div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', quizHtml);
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);

        nextBtn.innerHTML = `<span>Završi Priču & Osvoji XP</span> <span>🎉</span>`;
        nextBtn.disabled = true;
        nextBtn.classList.add('opacity-50', 'pointer-events-none');
    },

    // 9. Check Quiz Answer
    checkQuizAnswer: function(selectedIndex) {
        if (this.quizAnswered) return;
        this.quizAnswered = true;

        const quiz = this.currentStory.quiz;
        const feedbackEl = document.getElementById('story-quiz-feedback');
        const nextBtn = document.getElementById('smart-story-next-btn');
        const selectedBtn = document.getElementById(`story-opt-${selectedIndex}`);
        const selectedIcon = document.getElementById(`story-opt-icon-${selectedIndex}`);

        if (selectedIndex === quiz.correctIndex) {
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('correct');
            selectedBtn.classList.remove('border-slate-200', 'dark:border-slate-700');
            selectedBtn.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40');
            selectedIcon.textContent = '✅';

            feedbackEl.className = 'p-3 rounded-2xl text-xs font-bold mt-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 block';
            feedbackEl.innerHTML = `🎉 Tačno! ${quiz.explanation || 'Bravo na razumevanju kulturne priče!'}`;
        } else {
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('wrong');
            selectedBtn.classList.remove('border-slate-200', 'dark:border-slate-700');
            selectedBtn.classList.add('border-rose-500', 'bg-rose-50', 'dark:bg-rose-950/40');
            selectedIcon.textContent = '❌';

            const correctBtn = document.getElementById(`story-opt-${quiz.correctIndex}`);
            const correctIcon = document.getElementById(`story-opt-icon-${quiz.correctIndex}`);
            if (correctBtn) {
                correctBtn.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40');
                if (correctIcon) correctIcon.textContent = '✅';
            }

            feedbackEl.className = 'p-3 rounded-2xl text-xs font-bold mt-2 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 block';
            feedbackEl.innerHTML = `Tačan odgovor je: <strong>${quiz.options[quiz.correctIndex]}</strong>. ${quiz.explanation || ''}`;
        }

        nextBtn.disabled = false;
        nextBtn.classList.remove('opacity-50', 'pointer-events-none');
    },

    // 10. Advance to Next Step
    nextStep: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        this.currentStepIndex++;
        this.renderCurrentStep();
    },

    // 11. Highlight Target Words with Glowing Golden Pills
    highlightTargetWords: function(text) {
        let result = text;
        for (const w of this.currentTargetWords) {
            // Check both Latin and Cyrillic variants
            const patterns = [w.sr_lat, w.sr_cyr].filter(Boolean);
            for (const p of patterns) {
                if (!p || p.length < 2) continue;
                const regex = new RegExp(`(\\b${p}[a-zčćžšđа-ячћжшђ]*\\b)`, 'gi');
                result = result.replace(regex, `<span onclick="event.stopPropagation(); SmartStoryEngine.inspectWord('${w.id}')" class="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded-md font-black cursor-pointer hover:underline border border-amber-300/60 dark:border-amber-700/50">✨ $1</span>`);
            }
        }
        return result;
    },

    // 12. 1-Tap Word Inspector from Story Pill
    inspectWord: function(wordId) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const word = this.currentTargetWords.find(w => w.id === wordId);
        if (!word) return;

        const isCyrillic = window.state && window.state.script === 'cyrillic';
        const displayWord = isCyrillic ? word.sr_cyr : word.sr_lat;

        // Play audio
        this.speakPhrase(displayWord);

        // Show brief informative toast
        if (window.app && window.app.showToast) {
            window.app.showToast(`✨ ${displayWord} (${word.en}) [${word.pos || 'reč'}]`, 'info');
        }
    },

    // 13. Speak Serbian Phrase
    speakPhrase: function(text) {
        if (window.app && typeof window.app.speakPhrase === 'function') {
            window.app.speakPhrase(text, 'sr-RS');
        }
    },

    // 14. Finish Story & Synchronize SuperMemo-2 SRS Progress
    finishStory: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('fanfare');

        // 1. Award +25 XP
        if (window.app && typeof window.app.addXP === 'function') {
            window.app.addXP(25);
        }

        // 2. Update SuperMemo-2 SRS progress for all target words
        let updatedCount = 0;
        if (window.SrsEngine && typeof window.SrsEngine.recordReview === 'function') {
            for (const w of this.currentTargetWords) {
                // Quality rating 4 (Good review in contextual story reading)
                window.SrsEngine.recordReview(w.id, true, 4);
                updatedCount++;
            }
        }

        // 3. Trigger Confetti
        if (typeof confetti === 'function') {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }

        // 4. Update Mistake Vault Dashboard live if open
        if (window.app && typeof window.app.renderMistakes === 'function') {
            window.app.renderMistakes();
        }

        // 5. Replace Modal Content with Success Celebration Card
        const modal = document.getElementById('smart-story-modal');
        if (modal) {
            const wordBadges = this.currentTargetWords.map(w => 
                `<span class="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-black border border-emerald-300 dark:border-emerald-700/60">✅ ${w.sr_lat}</span>`
            ).join(' ');

            modal.innerHTML = `
                <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex items-center justify-center p-4 fade-in">
                    <div class="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border-2 border-slate-100 dark:border-slate-700 text-center space-y-4">
                        <div class="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 animate-bounce">
                            🎉
                        </div>
                        <div>
                            <h3 class="text-xl font-black text-slate-800 dark:text-white">Svaka Čast! Priča Završena!</h3>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Uspešno si uvežbao svoje reči u kontekstu priče</p>
                        </div>
                        <div class="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-left space-y-2">
                            <span class="block text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">Osvežene Reči u SRS Trezoru (+25 XP):</span>
                            <div class="flex flex-wrap gap-1.5">
                                ${wordBadges}
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Tvoj Ease Factor i interval ponavljanja su automatski poboljšani.</p>
                        <button onclick="SmartStoryEngine.closeModal()" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-sm uppercase tracking-wide">
                            Nastavi Dalje 🚀
                        </button>
                    </div>
                </div>
            `;
        }
    },

    // 15. Close Modal & Clean up
    closeModal: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();
        const modal = document.getElementById('smart-story-modal');
        if (modal) modal.remove();
        this.currentStory = null;
        this.currentTargetWords = [];
        this.currentStepIndex = 0;
        this.quizAnswered = false;
    }
};

window.SmartStoryEngine = SmartStoryEngine;
