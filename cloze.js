// [SHIELD_DAEMON: VALIDATED]
// Priority 13: Cloze Mastery Engine (Fill-in-the-Blank Context Trainer)
const ClozeEngine = {
    // Sentence bank: each has sr (Serbian), en (English), blank_sr (key word), blank_en (key word)
    SENTENCES: [
        { sr: 'Ja pijem ___ ujutru.', en: 'I drink ___ in the morning.', blank_sr: 'kafu', blank_en: 'coffee', hint: '☕' },
        { sr: 'On čita ___ svaki dan.', en: 'He reads a ___ every day.', blank_sr: 'knjigu', blank_en: 'book', hint: '📖' },
        { sr: 'Ona ide u ___ autobusom.', en: 'She goes to ___ by bus.', blank_sr: 'školu', blank_en: 'school', hint: '🏫' },
        { sr: 'Mi živimo u ___.', en: 'We live in ___.', blank_sr: 'Beogradu', blank_en: 'Belgrade', hint: '🏙️' },
        { sr: 'Voda je vrlo ___.', en: 'The water is very ___.', blank_sr: 'hladna', blank_en: 'cold', hint: '🥶' },
        { sr: 'Danas je ___ dan.', en: 'Today is a ___ day.', blank_sr: 'lep', blank_en: 'beautiful', hint: '☀️' },
        { sr: 'Kupio sam ___ na pijaci.', en: 'I bought ___ at the market.', blank_sr: 'jabuke', blank_en: 'apples', hint: '🍎' },
        { sr: 'Moj ___ je učitelj.', en: 'My ___ is a teacher.', blank_sr: 'otac', blank_en: 'father', hint: '👨' },
        { sr: 'Želim da naučim ___.', en: 'I want to learn ___.', blank_sr: 'srpski', blank_en: 'Serbian', hint: '🇷🇸' },
        { sr: 'Koliko ___ ovo?', en: 'How much does this ___?', blank_sr: 'košta', blank_en: 'cost', hint: '💰' },
        { sr: 'Imam dvoje ___.', en: 'I have two ___.', blank_sr: 'dece', blank_en: 'children', hint: '👧' },
        { sr: 'Volim da ___ muziku.', en: 'I love to ___ to music.', blank_sr: 'slušam', blank_en: 'listen', hint: '🎵' },
        { sr: 'Sutra idem na ___.', en: 'Tomorrow I go to ___.', blank_sr: 'posao', blank_en: 'work', hint: '💼' },
        { sr: 'Mogu li da dobijem ___?', en: 'Can I get the ___?', blank_sr: 'račun', blank_en: 'bill', hint: '🧾' },
        { sr: '___ je moja omiljena hrana.', en: '___ is my favorite food.', blank_sr: 'Ćevapi', blank_en: 'Cevapi', hint: '🥩' },
        { sr: 'Gde je najbliža ___?', en: 'Where is the nearest ___?', blank_sr: 'apoteka', blank_en: 'pharmacy', hint: '💊' },
        { sr: 'Treba mi ___ za sobu.', en: 'I need a ___ for the room.', blank_sr: 'ključ', blank_en: 'key', hint: '🔑' },
        { sr: 'Hoćeš li ___ sa mnom?', en: 'Will you ___ with me?', blank_sr: 'plesati', blank_en: 'dance', hint: '💃' },
        { sr: 'Mačka ___ na kauču.', en: 'The cat is ___ on the couch.', blank_sr: 'spava', blank_en: 'sleeping', hint: '🐱' },
        { sr: '___ pada napolju.', en: 'It is ___ outside.', blank_sr: 'Kiša', blank_en: 'Raining', hint: '🌧️' },
        { sr: 'Ovo je moja ___.', en: 'This is my ___.', blank_sr: 'kuća', blank_en: 'house', hint: '🏠' },
        { sr: 'Idemo na ___ večeras.', en: 'Let\'s go to a ___ tonight.', blank_sr: 'koncert', blank_en: 'concert', hint: '🎤' },
        { sr: 'Nemam dovoljno ___.', en: 'I don\'t have enough ___.', blank_sr: 'novca', blank_en: 'money', hint: '💵' },
        { sr: 'Ona nosi ___ haljinu.', en: 'She is wearing a ___ dress.', blank_sr: 'crvenu', blank_en: 'red', hint: '🔴' },
        { sr: 'Jesi li ___ za kafu?', en: 'Are you ___ for coffee?', blank_sr: 'spreman', blank_en: 'ready', hint: '☕' },
        { sr: 'Auto je parkiran ___.', en: 'The car is parked ___.', blank_sr: 'ispred', blank_en: 'in front', hint: '🚗' },
        { sr: 'Hvala na ___ pomoći.', en: 'Thank you for your ___.', blank_sr: 'velikoj', blank_en: 'great', hint: '🙏' },
        { sr: 'Putujemo ___ u julu.', en: 'We travel to ___ in July.', blank_sr: 'Grčku', blank_en: 'Greece', hint: '🇬🇷' },
        { sr: 'Daj mi ___, molim te.', en: 'Give me ___, please.', blank_sr: 'hleb', blank_en: 'bread', hint: '🍞' },
        { sr: 'Restoran se ___ u osam.', en: 'The restaurant ___ at eight.', blank_sr: 'zatvara', blank_en: 'closes', hint: '🍽️' },
        { sr: 'Tvoj ___ je veoma dobar.', en: 'Your ___ is very good.', blank_sr: 'engleski', blank_en: 'English', hint: '🇬🇧' },
        { sr: 'Trebam ___ za telefon.', en: 'I need a ___ for my phone.', blank_sr: 'punjač', blank_en: 'charger', hint: '🔌' },
        { sr: 'Hajde da ___ film.', en: 'Let\'s ___ a movie.', blank_sr: 'gledamo', blank_en: 'watch', hint: '🎬' },
        { sr: 'On je moj najbolji ___.', en: 'He is my best ___.', blank_sr: 'prijatelj', blank_en: 'friend', hint: '🤝' },
        { sr: 'Psi ___ u parku.', en: 'Dogs are ___ in the park.', blank_sr: 'trče', blank_en: 'running', hint: '🐕' },
        { sr: 'Ovo ___ je ukusno!', en: 'This ___ is delicious!', blank_sr: 'jelo', blank_en: 'dish', hint: '😋' },
        { sr: 'Beograd je ___ Srbije.', en: 'Belgrade is the ___ of Serbia.', blank_sr: 'glavni grad', blank_en: 'capital', hint: '🏛️' },
        { sr: 'Imaš li ___?', en: 'Do you have a ___?', blank_sr: 'pitanje', blank_en: 'question', hint: '❓' },
        { sr: 'Sunce ___ rano leti.', en: 'The sun ___ early in summer.', blank_sr: 'izlazi', blank_en: 'rises', hint: '🌅' },
        { sr: 'Smem li da ___ ovde?', en: 'May I ___ here?', blank_sr: 'sednem', blank_en: 'sit', hint: '💺' },
    ],

    currentSession: null,

    openMenu: function() {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();

        const dir = (window.appState && window.appState.settings && window.appState.settings.learningDirection) || 'sr_to_en';
        const modeLabel = dir === 'sr_to_en' ? 'Serbian → English' : 'English → Serbian';

        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');

        overlay.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full bg-slate-900 p-6 w-full fade-in">
                <div class="text-6xl mb-4">🧩</div>
                <h2 class="text-3xl font-black text-white mb-2 text-center">Cloze Mastery</h2>
                <p class="text-slate-400 mb-2 text-center text-sm font-medium">Fill in the missing word</p>
                <p class="text-xs text-blue-400 font-bold mb-8">${modeLabel}</p>
                
                <div class="flex flex-col gap-4 w-full max-w-sm">
                    <button onclick="ClozeEngine.startSession(10)" class="p-5 bg-green-600 hover:bg-green-500 rounded-2xl active:scale-95 transition-all text-white font-black text-xl shadow-lg shadow-green-600/30 text-center">
                        ⚡ Quick (10 sentences)
                    </button>
                    <button onclick="ClozeEngine.startSession(25)" class="p-5 bg-blue-600 hover:bg-blue-500 rounded-2xl active:scale-95 transition-all text-white font-black text-xl shadow-lg shadow-blue-600/30 text-center">
                        📚 Standard (25 sentences)
                    </button>
                    <button onclick="ClozeEngine.startSession(40)" class="p-5 bg-purple-600 hover:bg-purple-500 rounded-2xl active:scale-95 transition-all text-white font-black text-xl shadow-lg shadow-purple-600/30 text-center">
                        🔥 Marathon (40 sentences)
                    </button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="mt-2 p-4 text-slate-500 font-bold hover:text-white transition-colors text-center">Cancel</button>
                </div>
            </div>
        `;
    },

    startSession: function(count) {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        const dir = (window.appState && window.appState.settings && window.appState.settings.learningDirection) || 'sr_to_en';

        // Shuffle and pick sentences
        const shuffled = [...this.SENTENCES].sort(() => Math.random() - 0.5);
        const sentences = shuffled.slice(0, Math.min(count, shuffled.length));

        let idx = 0;
        let score = 0;
        let streak = 0;
        let bestStreak = 0;

        const renderSentence = () => {
            if (idx >= sentences.length) {
                // Session complete
                if (window.app && window.app.addXP) window.app.addXP(Math.floor(score / 10));
                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                        <h2 class="text-5xl font-black text-yellow-400 mb-4">🧩 Session Complete!</h2>
                        <div class="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
                            <div class="bg-slate-800 rounded-2xl p-4">
                                <p class="text-3xl font-black text-green-400">${score}</p>
                                <p class="text-xs text-slate-400 font-bold">SCORE</p>
                            </div>
                            <div class="bg-slate-800 rounded-2xl p-4">
                                <p class="text-3xl font-black text-orange-400">${bestStreak}🔥</p>
                                <p class="text-xs text-slate-400 font-bold">BEST STREAK</p>
                            </div>
                        </div>
                        <button onclick="ClozeEngine.openMenu()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                    </div>
                `;
                return;
            }

            const s = sentences[idx];
            // Determine which sentence to show with blank, and what the answer is
            let displaySentence, answer, fullSentence;
            if (dir === 'sr_to_en') {
                // Show Serbian sentence with blank, user types Serbian word
                displaySentence = s.sr;
                answer = s.blank_sr;
                fullSentence = s.en;
            } else {
                // Show English sentence with blank, user types English word
                displaySentence = s.en;
                answer = s.blank_en;
                fullSentence = s.sr;
            }

            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-gray-900 text-white w-full">
                    <!-- Header -->
                    <div class="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
                        <div class="font-black text-lg">🧩 Cloze</div>
                        <div class="flex items-center gap-4 text-sm font-bold text-gray-300">
                            <span>${idx + 1}/${sentences.length}</span>
                            <span class="text-green-400">${score}pts</span>
                            <span class="text-orange-400">${streak}🔥</span>
                        </div>
                        <button onclick="ArcadeEngine._hideOverlay()" class="text-2xl font-bold hover:text-red-400 transition-colors">&times;</button>
                    </div>
                    
                    <!-- Progress bar -->
                    <div class="w-full bg-gray-800 h-1.5">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 transition-all duration-300" style="width: ${((idx) / sentences.length) * 100}%"></div>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div class="text-5xl mb-6">${s.hint}</div>
                        <div class="text-2xl font-bold mb-2 leading-relaxed px-4">${displaySentence.replace('___', '<span class="text-yellow-400 border-b-4 border-yellow-400 px-4 py-1 mx-1 animate-pulse">____</span>')}</div>
                        <div class="text-sm text-gray-500 mb-8 italic">${fullSentence}</div>

                        <div class="w-full max-w-sm">
                            <input type="text" id="cloze-input" autocomplete="off" autocapitalize="off" spellcheck="false"
                                class="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-2xl text-center text-2xl font-black text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 mb-4"
                                placeholder="Type the missing word...">
                            <button id="cloze-submit" class="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xl font-black text-white active:scale-95 transition-all shadow-lg shadow-blue-600/30">
                                Check ✓
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const input = document.getElementById('cloze-input');
            const submit = document.getElementById('cloze-submit');
            if (input) {
                input.focus();
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') checkAnswer();
                });
            }
            if (submit) submit.addEventListener('click', checkAnswer);

            function checkAnswer() {
                if (!input) return;
                const guess = input.value.trim().toLowerCase();
                const correct = answer.toLowerCase();
                
                // Flexible matching: exact match or close enough (strip diacritics for leniency)
                const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const isCorrect = guess === correct || normalize(guess) === normalize(correct);

                submit.disabled = true;
                input.disabled = true;

                if (isCorrect) {
                    if (window.app && window.app.playSound) window.app.playSound('correct');
                    streak++;
                    if (streak > bestStreak) bestStreak = streak;
                    const bonus = streak >= 3 ? 50 : 0;
                    score += 100 + bonus;
                    input.classList.add('border-green-400', 'bg-green-900/30');
                    input.value = answer;
                } else {
                    if (window.app && window.app.playSound) window.app.playSound('wrong');
                    streak = 0;
                    input.classList.add('border-red-400', 'bg-red-900/30');
                    // Show correct answer
                    const correction = document.createElement('div');
                    correction.className = 'text-center mt-2 text-green-400 font-black text-lg';
                    correction.textContent = `→ ${answer}`;
                    input.parentElement.appendChild(correction);
                }

                idx++;
                setTimeout(() => renderSentence(), 1200);
            }
        };

        renderSentence();
    }
};

window.ClozeEngine = ClozeEngine;
