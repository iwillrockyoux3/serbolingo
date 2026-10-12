// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — Bilingual Adaptive Placement Test Engine (Priority 28)
 *
 * 10-Question CEFR Diagnostic Quiz (A1 to B2)
 * Fully bilingual & direction-aware:
 *  - en_to_sr: Tests Serbian grammar, cases, and vocabulary (English UI)
 *  - sr_to_en: Tests English grammar, tenses, and vocabulary (Serbian UI)
 * Supports Latin and Cyrillic scripts dynamically.
 * Auto-unlocks Skill Tree tiers (A1, A2, B1, B2) with XP bonuses and celebration.
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'serbolingo_placement_result';

    // Transliteration helper for Cyrillic script parity (Constitution Section 11)
    function toCyrillic(text) {
        if (!text) return "";
        const latToCyr = {
            'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
            'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
            'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ',
            'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
            'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
            'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'ć': 'ћ',
            'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'š': 'ш'
        };
        let res = text;
        for (let lat in latToCyr) {
            if (lat.length > 1) res = res.split(lat).join(latToCyr[lat]);
        }
        for (let lat in latToCyr) {
            if (lat.length === 1) {
                res = res.split(lat).join(latToCyr[lat]);
                res = res.split(lat.toUpperCase()).join(latToCyr[lat].toUpperCase());
            }
        }
        return res;
    }

    // Helper to format Serbian text based on active script
    function formatSrText(text) {
        const appState = window.appState || window.state;
        const isCyr = appState?.settings?.appLanguage === 'sr_cyr';
        return isCyr ? toCyrillic(text) : text;
    }

    // --- TRACK 1: Testing Serbian (For English speakers: en_to_sr) ---
    const QUESTIONS_LEARN_SR = [
        // A1 Beginner
        {
            level: 'A1',
            levelLabel: 'A1 Beginner',
            q: 'How do you say "Thank you" in Serbian?',
            options: ['Molim', 'Hvala', 'Dobar dan', 'Izvini'],
            correct: 1,
            explain: '"Hvala" means "Thank you". "Molim" means "Please / You\'re welcome".'
        },
        {
            level: 'A1',
            levelLabel: 'A1 Beginner',
            q: 'What is the Serbian word for "House"?',
            options: ['Auto', 'Drvo', 'Kuća', 'Ulica'],
            correct: 2,
            explain: '"Kuća" means "House".'
        },
        {
            level: 'A1',
            levelLabel: 'A1 Beginner',
            q: 'What does the Serbian greeting "Dobro jutro" mean?',
            options: ['Good evening', 'Good afternoon', 'Good night', 'Good morning'],
            correct: 3,
            explain: '"Dobro jutro" is used in the morning (Good morning).'
        },
        // A2 Elementary
        {
            level: 'A2',
            levelLabel: 'A2 Elementary',
            q: 'Complete the sentence: "Oni sada ____ u Beogradu."',
            options: ['živim', 'živiš', 'žive', 'živimo'],
            correct: 2,
            explain: 'For 3rd person plural ("Oni" / They), the ending is "-e": Oni žive.'
        },
        {
            level: 'A2',
            levelLabel: 'A2 Elementary',
            q: 'What is the correct plural form for "Grad" (City)?',
            options: ['Gradovi', 'Gradi', 'Gradove', 'Gradim'],
            correct: 0,
            explain: 'Monosyllabic masculine nouns take the "-ovi" suffix: Grad -> Gradovi.'
        },
        {
            level: 'A2',
            levelLabel: 'A2 Elementary',
            q: 'Choose the Accusative of destination: "Idem u ____."',
            options: ['škola', 'školi', 'školu', 'školom'],
            correct: 2,
            explain: 'When moving towards a destination, feminine nouns take "-u" in the Accusative: u školu.'
        },
        // B1 Intermediate
        {
            level: 'B1',
            levelLabel: 'B1 Intermediate',
            q: 'Choose the correct Past Tense (Perfekat): "Juče smo ____ film."',
            options: ['gledao', 'gledali', 'gledala', 'gledati'],
            correct: 1,
            explain: 'For plural subject "Mi", the active verbal participle is "-li": gledali smo.'
        },
        {
            level: 'B1',
            levelLabel: 'B1 Intermediate',
            q: 'Complete with the Genitive of negation: "U frižideru nema ____."',
            options: ['mleko', 'mleka', 'mleku', 'mlekom'],
            correct: 1,
            explain: 'After the word "nema" (there is no), nouns must be in the Genitive case: nema mleka.'
        },
        // B2 Advanced
        {
            level: 'B2',
            levelLabel: 'B2 Advanced',
            q: 'Choose the correct Conditional form: "Ja ____ rado došao."',
            options: ['bi', 'bih', 'bismo', 'biste'],
            correct: 1,
            explain: 'For 1st person singular ("Ja"), the conditional auxiliary is "bih": Ja bih.'
        },
        {
            level: 'B2',
            levelLabel: 'B2 Advanced',
            q: 'Select the perfective verb aspect (completed action) for "Čitati":',
            options: ['Čituckati', 'Iščitavati', 'Pročitati', 'Počitati'],
            correct: 2,
            explain: '"Čitati" indicates ongoing reading, while "Pročitati" indicates completing the reading.'
        }
    ];

    // --- TRACK 2: Testing English (For Serbian speakers: sr_to_en) ---
    const QUESTIONS_LEARN_EN = [
        // A1 Beginner
        {
            level: 'A1',
            levelLabel: 'A1 Početnik',
            q: 'Kako se na engleskom kaže "Hvala"?',
            options: ['Please', 'Thank you', 'Goodbye', 'Excuse me'],
            correct: 1,
            explain: '"Thank you" znači "Hvala". "Please" znači "Molim".'
        },
        {
            level: 'A1',
            levelLabel: 'A1 Početnik',
            q: 'Koji je tačan prevod za reč "Pas" na engleskom?',
            options: ['Cat', 'Bird', 'Dog', 'Fish'],
            correct: 2,
            explain: '"Dog" znači "Pas".'
        },
        {
            level: 'A1',
            levelLabel: 'A1 Početnik',
            q: 'Šta znači engleski pozdrav "Good evening"?',
            options: ['Dobro jutro', 'Dobar dan', 'Laku noć', 'Dobro veče'],
            correct: 3,
            explain: '"Good evening" se koristi uveče (Dobro veče).'
        },
        // A2 Elementary
        {
            level: 'A2',
            levelLabel: 'A2 Osnovni',
            q: 'Dopuni rečenicu (Present Simple): "She ____ in London."',
            options: ['live', 'living', 'lives', 'lived'],
            correct: 2,
            explain: 'U Present Simple vremenu, za 3. lice jednine (He/She/It) dodaje se nastavak "-s": She lives.'
        },
        {
            level: 'A2',
            levelLabel: 'A2 Osnovni',
            q: 'Koja je nepravilna množina za reč "Child" (dete)?',
            options: ['Children', 'Childs', 'Childes', 'Childrens'],
            correct: 0,
            explain: '"Child" ima nepravilnu množinu: "Children".'
        },
        {
            level: 'A2',
            levelLabel: 'A2 Osnovni',
            q: 'Izaberi tačan predlog za lokaciju: "I am waiting ____ the bus stop."',
            options: ['in', 'on', 'at', 'to'],
            correct: 2,
            explain: 'Za tačnu lokaciju ili stanicu koristi se predlog "at": at the bus stop.'
        },
        // B1 Intermediate
        {
            level: 'B1',
            levelLabel: 'B1 Srednji',
            q: 'Prevedi u prošlo vreme (Past Simple): "Yesterday they ____ to Paris."',
            options: ['goed', 'went', 'gone', 'going'],
            correct: 1,
            explain: 'Past Simple oblik glagola "go" je "went".'
        },
        {
            level: 'B1',
            levelLabel: 'B1 Srednji',
            q: 'Dopuni rečenicu (Present Perfect): "I have already ____ my homework."',
            options: ['finish', 'finished', 'finishing', 'finishes'],
            correct: 1,
            explain: 'U Present Perfect vremenu koristi se Past Participle (treća kolona): have finished.'
        },
        // B2 Advanced
        {
            level: 'B2',
            levelLabel: 'B2 Napredni',
            q: 'Dopuni kondicional (Second Conditional): "If I had money, I ____ travel the world."',
            options: ['will', 'would', 'can', 'shall'],
            correct: 1,
            explain: 'U Second Conditional rečenicama koristi se "would + infinitive": I would travel.'
        },
        {
            level: 'B2',
            levelLabel: 'B2 Napredni',
            q: 'Koji frazalni glagol znači "Odustati" ili "Predati se"?',
            options: ['Give in', 'Give up', 'Take up', 'Look up'],
            correct: 1,
            explain: '"Give up" znači "Odustati / Predati se".'
        }
    ];

    const PlacementEngine = {
        currentIndex: 0,
        score: 0,
        answers: [],
        isActive: false,

        isLearnSr: function () {
            const appState = window.appState || window.state;
            return appState?.settings?.learningDirection === 'en_to_sr';
        },

        getQuestions: function () {
            return this.isLearnSr() ? QUESTIONS_LEARN_SR : QUESTIONS_LEARN_EN;
        },

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

            // Update modal title dynamically according to language
            this._updateModalHeader();
            this.renderQuestion();
        },

        _updateModalHeader: function () {
            const titleEl = document.getElementById('placement-modal-title');
            const descEl = document.getElementById('placement-modal-desc');
            const isLearnSr = this.isLearnSr();

            if (titleEl) {
                titleEl.textContent = isLearnSr 
                    ? 'Placement Test (Diagnostic)' 
                    : formatSrText('Test Nivoa Znanja');
            }
            if (descEl) {
                descEl.textContent = isLearnSr 
                    ? 'Skip beginner lessons & jump ahead' 
                    : formatSrText('Prilagodi nivo i preskoči gradivo');
            }
        },

        closeModal: function () {
            this.isActive = false;
            const modal = document.getElementById('placement-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        selectOption: function (idx) {
            if (!this.isActive) return;
            const questions = this.getQuestions();
            const q = questions[this.currentIndex];
            const isCorrect = idx === q.correct;
            if (isCorrect) this.score++;
            this.answers.push({ question: q.q, selected: idx, isCorrect });

            if (window.app && window.app.playSound) {
                window.app.playSound(isCorrect ? 'correct' : 'incorrect');
            }

            this.currentIndex++;
            if (this.currentIndex < questions.length) {
                setTimeout(() => this.renderQuestion(), 250);
            } else {
                setTimeout(() => this.finishTest(), 300);
            }
        },

        renderQuestion: function () {
            const container = document.getElementById('placement-content');
            if (!container) return;

            const questions = this.getQuestions();
            const q = questions[this.currentIndex];
            const pct = Math.round(((this.currentIndex) / questions.length) * 100);
            const isLearnSr = this.isLearnSr();

            const questionCountText = isLearnSr
                ? `Question ${this.currentIndex + 1} of ${questions.length}`
                : formatSrText(`Pitanje ${this.currentIndex + 1} od ${questions.length}`);

            const displayLevelLabel = isLearnSr ? q.levelLabel : formatSrText(q.levelLabel);
            const displayQ = isLearnSr ? q.q : formatSrText(q.q);

            container.innerHTML = `
                <!-- Progress Header -->
                <div class="space-y-2 mb-6">
                    <div class="flex justify-between items-center text-xs font-black text-slate-400">
                        <span>${questionCountText}</span>
                        <span class="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold">${displayLevelLabel}</span>
                    </div>
                    <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full" style="width: ${pct}%"></div>
                    </div>
                </div>

                <!-- Question Prompt -->
                <div class="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-5 mb-5 shadow-inner">
                    <span class="text-3xl block mb-2">🎯</span>
                    <h3 class="text-lg font-black text-white leading-snug">${displayQ}</h3>
                </div>

                <!-- Answer Choices -->
                <div class="grid grid-cols-1 gap-2.5">
                    ${q.options.map((opt, i) => {
                        const optText = isLearnSr ? opt : formatSrText(opt);
                        return `
                        <button onclick="PlacementEngine.selectOption(${i})" class="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 hover:border-indigo-500 text-left font-bold text-white text-sm rounded-2xl active:scale-[0.98] transition-all flex items-center justify-between group shadow-sm">
                            <span>${optText}</span>
                            <span class="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-indigo-400 flex items-center justify-center text-xs text-slate-400 group-hover:text-indigo-400 font-black">
                                ${['A', 'B', 'C', 'D'][i]}
                            </span>
                        </button>`;
                    }).join('')}
                </div>
            `;
        },

        finishTest: function () {
            this.isActive = false;
            const s = this.score;
            const isLearnSr = this.isLearnSr();
            const total = this.getQuestions().length;

            let level = 'A1';
            let levelTitle = isLearnSr ? 'A1 Beginner' : formatSrText('A1 Početnik');
            let tierToUnlock = 1;
            let bonusXP = 50;
            let description = isLearnSr
                ? 'Your Serbian is at the beginner stage. Continue with foundation lessons!'
                : formatSrText('Tvoj engleski je na početnom nivou. Nastavi sa osnovnim lekcijama!');

            if (s >= 9) {
                level = 'B2';
                levelTitle = isLearnSr ? 'B2 Advanced (Fluent)' : formatSrText('B2 Napredni');
                tierToUnlock = 12;
                bonusXP = 500;
                description = isLearnSr
                    ? 'Outstanding! You mastered complex cases, conditionals, and verb aspects. Advanced tiers unlocked!'
                    : formatSrText('Izvanredno! Poznaješ složenu gramatiku, frazale i kondicionale. Otključani su svi napredni nivoi!');
            } else if (s >= 7) {
                level = 'B1';
                levelTitle = isLearnSr ? 'B1 Intermediate' : formatSrText('B1 Srednji');
                tierToUnlock = 8;
                bonusXP = 300;
                description = isLearnSr
                    ? 'Great work! You understand past tenses and primary cases. Tiers up to B1 are unlocked!'
                    : formatSrText('Odličan rezultat! Poznaješ prošla vremena i složene rečenice. Otključani su nivoi do B1!');
            } else if (s >= 4) {
                level = 'A2';
                levelTitle = isLearnSr ? 'A2 Elementary' : formatSrText('A2 Osnovni');
                tierToUnlock = 4;
                bonusXP = 150;
                description = isLearnSr
                    ? 'Good job! You understand everyday present tense and plurals. Tiers 1 to 4 are unlocked!'
                    : formatSrText('Dobar rad! Razumeš osnove i prezent. Otključani su nivoi 1 do 4!');
            }

            const resultData = {
                level,
                levelTitle,
                score: s,
                total: total,
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

            if (window.app && window.app.fireConfetti) {
                setTimeout(() => window.app.fireConfetti(), 200);
            }

            this.renderResult(resultData);
        },

        _applySkillTreeUnlocks: function (tierLimit) {
            if (typeof window.SKILL_TREE === 'undefined' || typeof window.SkillTreeEngine === 'undefined') return;

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
                nodesToGrant = milestoneNodes;
            } else if (tierLimit >= 8) {
                nodesToGrant = milestoneNodes.slice(0, 34);
            } else if (tierLimit >= 4) {
                nodesToGrant = milestoneNodes.slice(0, 19);
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
            const isLearnSr = this.isLearnSr();

            const badgeText = isLearnSr ? 'Diagnostic Result' : formatSrText('Rezultat Testiranja');
            const scoreText = isLearnSr 
                ? `${res.score} / ${res.total} correct answers`
                : formatSrText(`${res.score} / ${res.total} tačnih odgovora`);
            const bonusLabel = isLearnSr ? '⚡ Bonus Reward:' : formatSrText('⚡ Bonus Nagrada:');
            const unlockedLabel = isLearnSr ? '🔓 Unlocked Levels:' : formatSrText('🔓 Otključani nivoi:');
            const unlockedVal = isLearnSr ? `Up to Level ${res.tierUnlocked}` : formatSrText(`Do Nivoa ${res.tierUnlocked}`);
            const descMsg = res.score >= 4
                ? (isLearnSr ? '✨ You skipped beginner lessons! Your skill tree is updated and unlocked.' : formatSrText('✨ Preskočio si osnovne lekcije! Tvoje drvo znanja je ažurirano i otključano.'))
                : (isLearnSr ? '🎯 Your skill tree is ready for starting from the foundations!' : formatSrText('🎯 Tvoje drvo znanja je spremno za učenje od osnova!'));
            const btnText = isLearnSr ? 'Go to Skill Tree 🚀' : formatSrText('Pređi na Drvo Znanja 🚀');

            container.innerHTML = `
                <div class="text-center py-4 space-y-4 fade-in">
                    <span class="text-5xl block animate-bounce">🏆</span>
                    
                    <div>
                        <span class="text-[10px] font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/20 px-3 py-1 rounded-full">
                            ${badgeText}
                        </span>
                        <h2 class="text-2xl font-black text-white mt-2">${res.levelTitle}</h2>
                        <p class="text-xs text-slate-300 font-bold mt-1 px-4">${scoreText}</p>
                    </div>

                    <div class="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-2 border-indigo-500/40 rounded-2xl p-4 text-left shadow-lg">
                        <div class="flex items-center justify-between mb-2 pb-2 border-b border-indigo-800/40">
                            <span class="text-xs font-bold text-slate-300">${bonusLabel}</span>
                            <span class="text-sm font-black text-yellow-400">+${res.bonusXP} XP</span>
                        </div>
                        <div class="flex items-center justify-between mb-2 pb-2 border-b border-indigo-800/40">
                            <span class="text-xs font-bold text-slate-300">${unlockedLabel}</span>
                            <span class="text-sm font-black text-emerald-400">${unlockedVal}</span>
                        </div>
                        <p class="text-[11px] font-bold text-slate-400 leading-relaxed mt-2">
                            ${descMsg}
                        </p>
                    </div>

                    <div class="pt-2">
                        <button onclick="PlacementEngine.closeModal()" class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg active:scale-95 transition-all">
                            ${btnText}
                        </button>
                    </div>
                </div>
            `;
        },

        renderHomeBanner: function () {
            const container = document.getElementById('placement-home-banner');
            if (!container) return;

            const res = this.getSavedResult();
            const isLearnSr = this.isLearnSr();

            if (res) {
                const completedBadge = isLearnSr ? 'Completed' : formatSrText('Završeno');
                const infoText = isLearnSr 
                    ? `${res.score}/${res.total} correct • Level ${res.tierUnlocked} unlocked` 
                    : formatSrText(`${res.score}/${res.total} tačno • Nivo ${res.tierUnlocked} otključan`);
                const retakeBtn = isLearnSr ? 'Retake' : formatSrText('Ponovi');

                container.innerHTML = `
                <div class="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl p-2 bg-indigo-500/20 rounded-xl">🎯</span>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-xs font-black text-white">${res.levelTitle}</span>
                                <span class="text-[9px] font-bold bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-md">${completedBadge}</span>
                            </div>
                            <p class="text-[10px] font-bold text-slate-400">${infoText}</p>
                        </div>
                    </div>
                    <button onclick="PlacementEngine.startTest()" class="text-xs font-black text-indigo-400 hover:text-indigo-300 underline py-1 px-2">
                        ${retakeBtn}
                    </button>
                </div>`;
            } else {
                const bannerTitle = isLearnSr ? 'Already know Serbian?' : formatSrText('Već znaš engleski?');
                const bannerDesc = isLearnSr ? 'Take a 3-min quiz to skip beginner lessons' : formatSrText('Uradi test za 3 min i preskoči lekcije');
                const bannerBtn = isLearnSr ? 'Take Test' : formatSrText('Testiraj se');

                container.innerHTML = `
                <div class="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-2 border-indigo-500/40 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl p-2 bg-indigo-500/20 rounded-xl">🎯</span>
                        <div>
                            <h4 class="text-xs font-black text-white">${bannerTitle}</h4>
                            <p class="text-[10px] font-bold text-slate-400">${bannerDesc}</p>
                        </div>
                    </div>
                    <button onclick="PlacementEngine.startTest()" class="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl active:scale-95 transition-transform shadow-md">
                        ${bannerBtn}
                    </button>
                </div>`;
            }
        }
    };

    window.PlacementEngine = PlacementEngine;
})();
