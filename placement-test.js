// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — Adaptive Placement Test Engine (Priority 28)
 *
 * 10-Question CEFR Diagnostic Quiz (A1 to B2)
 * Automatically evaluates learner proficiency and auto-unlocks corresponding
 * Skill Tree tiers (A1, A2, B1, B2) with XP bonuses and celebration.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'serbolingo_placement_result';

    const QUESTIONS = [
        // --- A1 BEGINNER (Q1 - Q3) ---
        {
            level: 'A1',
            levelLabel: 'A1 Početnik',
            q: 'Kako se kaže "Thank you" na srpskom?',
            qEn: 'How do you say "Thank you" in Serbian?',
            options: ['Molim', 'Hvala', 'Dobar dan', 'Izvini'],
            correct: 1,
            explain: '"Hvala" znači "Thank you". "Molim" znači "Please / You\'re welcome".'
        },
        {
            level: 'A1',
            levelLabel: 'A1 Početnik',
            q: 'Koji je tačan prevod za reč "Kuća"?',
            qEn: 'What is the correct translation for "Kuća"?',
            options: ['Car', 'Tree', 'House', 'Street'],
            correct: 2,
            explain: '"Kuća" znači "House".'
        },
        {
            level: 'A1',
            levelLabel: 'A1 Početnik',
            q: 'Šta znači pozdrav "Dobro jutro"?',
            qEn: 'What does "Dobro jutro" mean?',
            options: ['Good evening', 'Good afternoon', 'Good night', 'Good morning'],
            correct: 3,
            explain: '"Dobro jutro" se koristi ujutru (Good morning).'
        },

        // --- A2 ELEMENTARY (Q4 - Q6) ---
        {
            level: 'A2',
            levelLabel: 'A2 Osnovni',
            q: 'Dopuni rečenicu: "Oni sada ____ u Beogradu."',
            qEn: 'Complete the sentence: "Oni sada ____ u Beogradu." (They live in Belgrade now)',
            options: ['živim', 'živiš', 'žive', 'živimo'],
            correct: 2,
            explain: 'Za treće lice množine ("Oni") nastavak je "-e": Oni žive.'
        },
        {
            level: 'A2',
            levelLabel: 'A2 Osnovni',
            q: 'Koji je pravilan oblik množine za reč "Grad" (City)?',
            qEn: 'What is the correct plural form for "Grad" (City)?',
            options: ['Gradovi', 'Gradi', 'Gradove', 'Gradim'],
            correct: 0,
            explain: 'Jednosložne imenice muškog roda dobijaju proširenje "-ovi": Grad -> Gradovi.'
        },
        {
            level: 'A2',
            levelLabel: 'A2 Osnovni',
            q: 'Dopuni Akuzativ pravca: "Svaki dan idem u ____."',
            qEn: 'Complete the sentence: "Svaki dan idem u ____." (I go to school every day)',
            options: ['škola', 'školi', 'školu', 'školom'],
            correct: 2,
            explain: 'Kada se krećemo ka nečemu (kuda?), ženski rod u Akuzativu dobija nastavak "-u": u školu.'
        },

        // --- B1 INTERMEDIATE (Q7 - Q8) ---
        {
            level: 'B1',
            levelLabel: 'B1 Srednji',
            q: 'Izaberi tačan Perfekat (prošlo vreme): "Juče smo ____ film."',
            qEn: 'Choose the correct Past Tense: "Juče smo ____ film." (Yesterday we watched a movie)',
            options: ['gledao', 'gledali', 'gledala', 'gledati'],
            correct: 1,
            explain: 'Za subjekat "Mi" (muški ili mešoviti rod), radni glagolski pridev je "-li": gledali smo.'
        },
        {
            level: 'B1',
            levelLabel: 'B1 Srednji',
            q: 'Dopuni Genitiv odricanja: "U frižideru nema ____."',
            qEn: 'Complete with the Genitive of negation: "U frižideru nema ____." (There is no milk in the fridge)',
            options: ['mleko', 'mleka', 'mleku', 'mlekom'],
            correct: 1,
            explain: 'Posle reči "nema" obavezno dolazi Genitiv: nema mleka.'
        },

        // --- B2 ADVANCED (Q9 - Q10) ---
        {
            level: 'B2',
            levelLabel: 'B2 Napredni',
            q: 'Koji je pravilan oblik Potencijala (Kondicionala): "Ja ____ rado došao."',
            qEn: 'Choose the correct Conditional form: "Ja ____ rado došao." (I would gladly come)',
            options: ['bi', 'bih', 'bismo', 'biste'],
            correct: 1,
            explain: 'Za prvo lice jednine ("Ja"), aorist pomoćnog glagola biti je "bih": Ja bih.'
        },
        {
            level: 'B2',
            levelLabel: 'B2 Napredni',
            q: 'Izaberi svršeni glagolski vid (completed action) za nesvršeni glagol "Čitati":',
            qEn: 'Select the perfective verb aspect for "Čitati" (To read):',
            options: ['Čituckati', 'Iščitavati', 'Pročitati', 'Počitati'],
            correct: 2,
            explain: '"Čitati" označava proces (nesvršeni), a "Pročitati" označava završenu radnju (svršeni vid).'
        }
    ];

    const PlacementEngine = {
        currentIndex: 0,
        score: 0,
        answers: [],
        isActive: false,

        getSavedResult: function () {
            try {
                const s = localStorage.getItem(STORAGE_KEY);
                return s ? JSON.parse(s) : null;
            } catch (e) {
                return null;
            }
        },

        saveResult: function (data) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e) {}
        },

        startTest: function () {
            this.currentIndex = 0;
            this.score = 0;
            this.answers = [];
            this.isActive = true;

            const modal = document.getElementById('placement-modal');
            if (modal) {
                modal.classList.remove('hidden');
                document.body.classList.add('overflow-hidden');
            }
            this.renderQuestion();
        },

        closeModal: function () {
            this.isActive = false;
            const modal = document.getElementById('placement-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        selectOption: function (idx) {
            if (!this.isActive) return;
            const q = QUESTIONS[this.currentIndex];
            const isCorrect = idx === q.correct;
            if (isCorrect) this.score++;
            this.answers.push({ question: q.q, selected: idx, isCorrect });

            if (window.app && window.app.playSound) {
                window.app.playSound(isCorrect ? 'correct' : 'incorrect');
            }

            // Tactile delay before next question
            this.currentIndex++;
            if (this.currentIndex < QUESTIONS.length) {
                setTimeout(() => this.renderQuestion(), 250);
            } else {
                setTimeout(() => this.finishTest(), 300);
            }
        },

        renderQuestion: function () {
            const container = document.getElementById('placement-content');
            if (!container) return;

            const q = QUESTIONS[this.currentIndex];
            const pct = Math.round(((this.currentIndex) / QUESTIONS.length) * 100);
            const appState = window.appState || window.state;
            const isSrToEn = appState?.settings?.learningDirection === 'sr_to_en';

            container.innerHTML = `
                <!-- Progress Header -->
                <div class="space-y-2 mb-6">
                    <div class="flex justify-between items-center text-xs font-black text-slate-400">
                        <span>Pitanje ${this.currentIndex + 1} od ${QUESTIONS.length}</span>
                        <span class="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold">${q.levelLabel}</span>
                    </div>
                    <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>

                <!-- Question Prompt -->
                <div class="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-5 mb-5 shadow-inner">
                    <span class="text-3xl block mb-2">🎯</span>
                    <h3 class="text-lg font-black text-white leading-snug">${q.q}</h3>
                    <p class="text-xs font-bold text-slate-400 mt-1">${q.qEn}</p>
                </div>

                <!-- Answer Choices -->
                <div class="grid grid-cols-1 gap-2.5">
                    ${q.options.map((opt, i) => `
                        <button onclick="PlacementEngine.selectOption(${i})" class="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-indigo-500 text-left font-bold text-white text-sm rounded-2xl active:scale-[0.98] transition-all flex items-center justify-between group shadow-sm">
                            <span>${opt}</span>
                            <span class="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-indigo-400 flex items-center justify-center text-xs text-slate-400 group-hover:text-indigo-400 font-black">
                                ${['A', 'B', 'C', 'D'][i]}
                            </span>
                        </button>
                    `).join('')}
                </div>
            `;
        },

        finishTest: function () {
            this.isActive = false;
            const s = this.score;
            let level = 'A1';
            let levelTitle = 'A1 Početnik';
            let tierToUnlock = 1;
            let bonusXP = 50;
            let description = 'Tvoj srpski je na početnom nivou. Nastavi sa osnovnim lekcijama!';

            if (s >= 9) {
                level = 'B2';
                levelTitle = 'B2 Napredni (Fluent)';
                tierToUnlock = 12;
                bonusXP = 500;
                description = 'Izvanredno! Poznaješ padeže, glagolske vidove i kondicional. Otključani su svi napredni nivoi!';
            } else if (s >= 7) {
                level = 'B1';
                levelTitle = 'B1 Srednji (Intermediate)';
                tierToUnlock = 8;
                bonusXP = 300;
                description = 'Odličan rezultat! Poznaješ prošla vremena i osnovne padeže. Otključani su nivoi do B1!';
            } else if (s >= 4) {
                level = 'A2';
                levelTitle = 'A2 Osnovni (Elementary)';
                tierToUnlock = 4;
                bonusXP = 150;
                description = 'Dobar rad! Razumeš osnove i prezent. Otključani su nivoi 1 do 4!';
            }

            // Record Result
            const resultData = {
                level,
                levelTitle,
                score: s,
                total: QUESTIONS.length,
                bonusXP,
                tierUnlocked: tierToUnlock,
                completedAt: new Date().toISOString()
            };
            this.saveResult(resultData);

            // Apply Skill Tree Tier Unlocks
            this._applySkillTreeUnlocks(tierToUnlock);

            // Award Bonus XP
            const appState = window.appState || window.state;
            if (appState) {
                appState.xp = (appState.xp || 0) + bonusXP;
                appState.dailyXP = (appState.dailyXP || 0) + bonusXP;
                appState.placementTest = resultData;
                if (window.app && window.app.saveState) window.app.saveState();
                if (window.app && window.app.updateProfileUI) window.app.updateProfileUI();
                if (window.app && window.app.renderSkillTree) window.app.renderSkillTree();
            }

            // Confetti celebration
            if (window.app && window.app.fireConfetti) {
                setTimeout(() => window.app.fireConfetti(), 200);
            }

            this.renderResult(resultData);
        },

        _applySkillTreeUnlocks: function (tierLimit) {
            if (typeof window.SKILL_TREE === 'undefined' || typeof window.SkillTreeEngine === 'undefined') return;

            // Map tier limits to milestone node IDs
            const milestoneNodes = [
                // Tier 1-4 nodes
                'alphabet', 'basics_1', 'phrases', 'food_1', 'animals_1', 'colors', 'clothing',
                'plurals_1', 'questions_1', 'numbers_1', 'verbs_pres_1', 'food_2', 'home_1',
                'family_1', 'nature_1', 'places_1', 'occupations_1', 'adjectives_1',
                // Tier 5-8 nodes
                'travel_transport', 'directions', 'dining_out', 'hotel_lodging', 'sightseeing',
                'shopping_market', 'tenses_past', 'tenses_future', 'cases_intro', 'accusative',
                'genitive', 'body_health', 'feelings', 'weather', 'calendar_time',
                // Tier 9-12 nodes
                'business_intro', 'office', 'dating_social', 'emergency', 'technology',
                'entertainment', 'movies', 'arts', 'dative', 'locative', 'instrumental',
                'vocative', 'imperative', 'conditional', 'future_2', 'aspects'
            ];

            let nodesToGrant = [];
            if (tierLimit >= 12) {
                nodesToGrant = milestoneNodes; // All up to Tier 12
            } else if (tierLimit >= 8) {
                nodesToGrant = milestoneNodes.slice(0, 34); // Tiers 1-8
            } else if (tierLimit >= 4) {
                nodesToGrant = milestoneNodes.slice(0, 19); // Tiers 1-4
            }

            const progress = window.SkillTreeEngine.getProgress();
            nodesToGrant.forEach(nodeId => {
                if (!progress[nodeId] || (progress[nodeId].crown || 0) < 1) {
                    progress[nodeId] = {
                        crown: 1,
                        lessonsInCrown: 3,
                        totalLessons: 3,
                        perfectLessons: 2
                    };
                }
            });
            window.SkillTreeEngine.saveProgress(progress);
        },

        renderResult: function (res) {
            const container = document.getElementById('placement-content');
            if (!container) return;

            container.innerHTML = `
                <div class="text-center py-4 space-y-4 fade-in">
                    <span class="text-5xl block animate-bounce">🏆</span>
                    
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full">
                            Rezultat Testiranja
                        </span>
                        <h2 class="text-2xl font-black text-white mt-2">${res.levelTitle}</h2>
                        <p class="text-xs text-slate-300 font-bold mt-1 px-4">${res.score} / ${res.total} tačnih odgovora</p>
                    </div>

                    <div class="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-2 border-indigo-500/40 rounded-2xl p-4 text-left shadow-lg">
                        <div class="flex items-center justify-between mb-2 pb-2 border-b border-indigo-800/40">
                            <span class="text-xs font-bold text-slate-300">⚡ Bonus Nagrada:</span>
                            <span class="text-sm font-black text-yellow-400">+${res.bonusXP} XP</span>
                        </div>
                        <div class="flex items-center justify-between mb-2 pb-2 border-b border-indigo-800/40">
                            <span class="text-xs font-bold text-slate-300">🔓 Otključani nivoi:</span>
                            <span class="text-sm font-black text-emerald-400">Do Nivoa ${res.tierUnlocked}</span>
                        </div>
                        <p class="text-[11px] font-bold text-slate-400 leading-relaxed mt-2">
                            ${res.score >= 4 ? '✨ Preskočio si osnovne lekcije! Tvoje drvo znanja je ažurirano i otključano.' : '🎯 Tvoje drvo znanja je spremno za učenje od osnova!'}
                        </p>
                    </div>

                    <div class="pt-2">
                        <button onclick="PlacementEngine.closeModal()" class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 transition-all">
                            Pređi na Drvo Znanja 🚀
                        </button>
                    </div>
                </div>
            `;
        },

        renderHomeBanner: function () {
            const container = document.getElementById('placement-home-banner');
            if (!container) return;

            const res = this.getSavedResult();
            if (res) {
                container.innerHTML = `
                <div class="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl p-2 bg-indigo-500/20 rounded-xl">🎯</span>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-xs font-black text-white">${res.levelTitle}</span>
                                <span class="text-[9px] font-bold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-md">Završeno</span>
                            </div>
                            <p class="text-[10px] font-bold text-slate-400">${res.score}/${res.total} tačno • Nivo ${res.tierUnlocked} otključan</p>
                        </div>
                    </div>
                    <button onclick="PlacementEngine.startTest()" class="text-xs font-black text-indigo-400 hover:text-indigo-300 underline py-1 px-2">
                        Ponovi
                    </button>
                </div>`;
            } else {
                container.innerHTML = `
                <div class="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-2 border-indigo-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl p-2 bg-indigo-500/20 rounded-xl">🎯</span>
                        <div>
                            <h4 class="text-xs font-black text-white">Već znaš srpski?</h4>
                            <p class="text-[10px] font-bold text-slate-400">Uradi test za 3 min i preskoči lekcije</p>
                        </div>
                    </div>
                    <button onclick="PlacementEngine.startTest()" class="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl active:scale-95 transition-transform shadow-md">
                        Testiraj se
                    </button>
                </div>`;
            }
        }
    };

    window.PlacementEngine = PlacementEngine;
})();
