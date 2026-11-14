// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo — SRS Brain Health Heatmap & Tinder-Style Flashcard Swipes (Priority 27)
// Features:
// 1. SuperMemo-2 / Leitner hybrid Spaced Repetition System (SRS).
// 2. Tinder-style card swipe reviews with realistic tilt, physics, stamps, and touch/mouse controls.
// 3. 3D card flipping, audio pronunciation, Cyrillic/Latin script parity, and bilingual example sentences.
// 4. Memory Retention Heatmap and Brain Health Vitality score for the Stats tab.

(function () {
    'use strict';

    const SrsEngine = {
        deck: [],
        currentIndex: 0,
        knownCount: 0,
        reviewCount: 0,
        isFlipped: false,
        isDragging: false,
        startX: 0,
        startY: 0,
        currentDeltaX: 0,
        activeCardEl: null,

        // --- 1. DATA & ALGORITHM GOVERNANCE ---
        getSrsData: function () {
            if (typeof state !== 'undefined') {
                if (!state.srsData) state.srsData = {};
                return state.srsData;
            }
            return {};
        },

        getWordRecord: function (wordId) {
            const srs = this.getSrsData();
            if (!srs[wordId]) {
                srs[wordId] = {
                    repetitions: 0,
                    interval: 0,
                    easeFactor: 2.5,
                    lastReviewed: null,
                    nextReview: new Date().toISOString().split('T')[0],
                    strength: 30
                };
            }
            return srs[wordId];
        },

        recordReview: function (wordId, isKnown, quality = null) {
            const srs = this.getSrsData();
            const record = this.getWordRecord(wordId);
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];

            record.lastReviewed = todayStr;

            // Default quality score if not provided:
            // 5 = clean correct, 3 = correct with minor typo, 1 = failed
            const q = (quality !== null && quality !== undefined)
                ? Math.max(0, Math.min(5, Number(quality)))
                : (isKnown ? 4 : 1);

            if (isKnown && q >= 3) {
                // Successful review (q = 3, 4, 5)
                if (record.repetitions === 0) {
                    record.interval = 1;
                } else if (record.repetitions === 1) {
                    record.interval = 3;
                } else {
                    record.interval = Math.min(60, Math.round((record.interval || 3) * (record.easeFactor || 2.5)));
                }
                record.repetitions = (record.repetitions || 0) + 1;

                // Classic SuperMemo-2 Ease Factor formula:
                // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
                const efDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
                record.easeFactor = Math.min(3.0, Math.max(1.3, parseFloat(((record.easeFactor || 2.5) + efDelta).toFixed(2))));

                // Memory strength boosts with successful repetitions (capped at 100)
                record.strength = Math.min(100, Math.max(50, 40 + (record.repetitions * 15)));

                // Decrement mistake weight in legacy mistakeLog
                if (typeof state !== 'undefined' && state.mistakeLog && state.mistakeLog[wordId]) {
                    state.mistakeLog[wordId] = Math.max(0, state.mistakeLog[wordId] - 1);
                    if (state.mistakeLog[wordId] === 0) delete state.mistakeLog[wordId];
                }
            } else {
                // Failed review (q < 3 or isKnown is false)
                record.repetitions = 0;
                record.interval = 1;
                record.easeFactor = Math.max(1.3, parseFloat(((record.easeFactor || 2.5) - 0.2).toFixed(2)));
                record.strength = Math.max(15, (record.strength || 40) - 25);

                // Increment in mistakeLog
                if (typeof state !== 'undefined' && state.mistakeLog) {
                    state.mistakeLog[wordId] = (state.mistakeLog[wordId] || 0) + 1;
                }
            }

            // Calculate next review date based on interval
            const nextDate = new Date(today);
            nextDate.setDate(nextDate.getDate() + (record.interval || 1));
            record.nextReview = nextDate.toISOString().split('T')[0];

            if (typeof app !== 'undefined' && app.saveStats) {
                app.saveStats();
            }
        },

        getRetentionScore: function (record) {
            if (!record) return 30;
            const base = record.strength || 30;
            if (!record.lastReviewed) return base;

            const last = new Date(record.lastReviewed);
            const now = new Date();
            const elapsedDays = Math.max(0, Math.round((now - last) / (1000 * 60 * 60 * 24)));
            const interval = Math.max(1, record.interval || 1);

            // Ebbinghaus forgetting curve decay: R = base * e^(-0.35 * t / I)
            const decayed = base * Math.exp(-0.35 * (elapsedDays / interval));
            return Math.min(100, Math.max(10, Math.round(decayed)));
        },

        getCardStage: function (record) {
            const todayStr = new Date().toISOString().split('T')[0];
            if (!record || record.repetitions === 0 || (record.nextReview && record.nextReview <= todayStr)) {
                return 'critical'; // 🔴 Due today or 0 repetitions
            }
            if (record.repetitions < 4 || (record.interval || 0) < 14) {
                return 'learning'; // 🟡 Active repetition phase
            }
            return 'mastered'; // 🟢 Mastered (4+ reps, >= 14d)
        },

        getTimeUntilReview: function (record) {
            if (!record || !record.nextReview) return 'Danas!';
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const next = new Date(record.nextReview);
            next.setHours(0, 0, 0, 0);
            const diffDays = Math.round((next - today) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) return `Kasni ${Math.abs(diffDays)}d!`;
            if (diffDays === 0) return 'Danas!';
            if (diffDays === 1) return 'Sutra';
            return `za ${diffDays} dana`;
        },

        getDueWords: function () {
            const srs = this.getSrsData();
            const mistakeLog = (typeof state !== 'undefined' && state.mistakeLog) ? state.mistakeLog : {};
            const todayStr = new Date().toISOString().split('T')[0];

            const dueIds = new Set();
            Object.keys(mistakeLog).forEach(id => dueIds.add(id));
            Object.keys(srs).forEach(id => {
                const r = srs[id];
                if (r.nextReview && r.nextReview <= todayStr) {
                    dueIds.add(id);
                }
            });
            return Array.from(dueIds);
        },

        calculateBrainHealth: function () {
            const srs = this.getSrsData();
            const keys = Object.keys(srs);
            if (keys.length === 0) {
                return { score: 100, mastered: 0, learning: 0, critical: 0, total: 0 };
            }

            let totalStrength = 0;
            let mastered = 0;
            let learning = 0;
            let critical = 0;

            keys.forEach(k => {
                const r = srs[k];
                const strength = this.getRetentionScore(r);
                totalStrength += strength;

                const stage = this.getCardStage(r);
                if (stage === 'critical') {
                    critical++;
                } else if (stage === 'mastered') {
                    mastered++;
                } else {
                    learning++;
                }
            });

            const score = Math.round(totalStrength / keys.length);
            return {
                score: Math.min(100, Math.max(10, score)),
                mastered: mastered,
                learning: learning,
                critical: critical,
                total: keys.length
            };
        },

        // --- 2. DECK BUILDER ---
        buildDeck: function () {
            const seedData = window.SEED_DATA || [];
            if (!seedData.length) return [];

            const srs = this.getSrsData();
            const mistakeLog = (typeof state !== 'undefined' && state.mistakeLog) ? state.mistakeLog : {};
            const todayStr = new Date().toISOString().split('T')[0];

            let candidates = [];

            // 1. First priority: Words due for review or in mistakeLog
            const dueOrMistakeIds = new Set([
                ...Object.keys(mistakeLog),
                ...Object.keys(srs).filter(k => srs[k].nextReview && srs[k].nextReview <= todayStr)
            ]);

            dueOrMistakeIds.forEach(id => {
                const found = seedData.find(w => w.id === id);
                if (found) candidates.push(found);
            });

            // 2. Second priority: If fewer than 10 words, add recently unlocked/relevant words
            if (candidates.length < 12) {
                const needed = 12 - candidates.length;
                const available = seedData.filter(w => !dueOrMistakeIds.has(w.id));
                const shuffled = available.sort(() => 0.5 - Math.random());
                candidates = candidates.concat(shuffled.slice(0, needed));
            }

            // Shuffle final deck and limit to 12 cards for a punchy session
            return candidates.sort(() => 0.5 - Math.random()).slice(0, 12);
        },

        // --- 3. MODAL & DECK ORCHESTRATION ---
        openSwipeSession: function () {
            this.deck = this.buildDeck();
            this.currentIndex = 0;
            this.knownCount = 0;
            this.reviewCount = 0;
            this.isFlipped = false;

            if (this.deck.length === 0) {
                if (typeof app !== 'undefined' && app.showToast) {
                    app.showToast("Nema reči za ponavljanje! Odličan posao! 🏆", "success");
                }
                return;
            }

            const modal = document.getElementById('flashcard-swipe-modal');
            if (!modal) return;

            modal.classList.remove('hidden');
            this.renderCardStack();
            this.updateProgressBar();

            if (typeof TouchHaptics !== 'undefined') {
                TouchHaptics.vibrate('tap');
            }
        },

        closeModal: function () {
            const modal = document.getElementById('flashcard-swipe-modal');
            if (modal) modal.classList.add('hidden');
            this.renderHeatmap();
        },

        renderCardStack: function () {
            const container = document.getElementById('srs-card-container');
            if (!container) return;

            if (this.currentIndex >= this.deck.length) {
                this.renderSessionSummary(container);
                return;
            }

            const currentWord = this.deck[this.currentIndex];
            const nextWord = this.deck[this.currentIndex + 1];
            const isSrToEn = typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'sr_to_en';
            const isCyrillic = typeof state !== 'undefined' && state.settings && state.settings.appLanguage === 'sr_cyr';

            // Primary display word vs target translation
            const frontWord = isSrToEn 
                ? (isCyrillic && typeof toCyrillic === 'function' ? toCyrillic(currentWord.sr_lat) : currentWord.sr_lat)
                : currentWord.en;
            const backWord = isSrToEn
                ? currentWord.en
                : (isCyrillic && typeof toCyrillic === 'function' ? toCyrillic(currentWord.sr_lat) : currentWord.sr_lat);

            const frontAlt = isSrToEn
                ? (typeof toCyrillic === 'function' ? toCyrillic(currentWord.sr_lat) : currentWord.sr_lat)
                : currentWord.sr_lat;

            const posName = currentWord.pos || 'reč';
            const phonetic = currentWord.phonetic ? `/${currentWord.phonetic}/` : '';
            const examplePrimary = isSrToEn ? currentWord.example_sr : currentWord.example_en;
            const exampleSecondary = isSrToEn ? currentWord.example_en : currentWord.example_sr;

            // HTML Structure for active card with front & back faces
            container.innerHTML = `
                <!-- Stack Shadow Card Behind -->
                ${nextWord ? `
                <div class="absolute inset-0 bg-slate-800/80 border-2 border-slate-700 rounded-3xl shadow-xl transform scale-[0.93] translate-y-3 opacity-60 pointer-events-none transition-transform duration-300">
                    <div class="p-6 flex flex-col justify-between h-full text-center">
                        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">${nextWord.category || 'Rečnik'}</span>
                        <h4 class="text-2xl font-black text-slate-400 opacity-40">${nextWord.sr_lat}</h4>
                        <div class="h-6"></div>
                    </div>
                </div>` : ''}

                <!-- Active Top Card -->
                <div id="srs-active-card" class="relative w-full h-[360px] md:h-[400px] bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none transition-transform duration-200 ease-out z-10 flex flex-col">
                    
                    <!-- Swipe Stamp Badges -->
                    <div id="stamp-known" class="absolute top-5 right-5 border-4 border-emerald-500 text-emerald-500 font-black text-xl px-3 py-1 rounded-2xl transform rotate-12 opacity-0 pointer-events-none shadow-lg z-30 tracking-wider">
                        ✅ ZNAM
                    </div>
                    <div id="stamp-review" class="absolute top-5 left-5 border-4 border-red-500 text-red-500 font-black text-xl px-3 py-1 rounded-2xl transform -rotate-12 opacity-0 pointer-events-none shadow-lg z-30 tracking-wider">
                        ❌ UČIM
                    </div>

                    <!-- Front Face -->
                    <div id="card-face-front" class="p-6 flex flex-col justify-between h-full ${this.isFlipped ? 'hidden' : 'flex'}">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full border border-blue-200 dark:border-blue-800">
                                ${currentWord.category || 'Rečnik'} • ${posName}
                            </span>
                            <button onclick="event.stopPropagation(); SrsEngine.playAudio('${currentWord.sr_lat}')" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-blue-500 flex items-center justify-center text-lg active:scale-90 transition-transform shadow-sm">
                                🔊
                            </button>
                        </div>

                        <div class="text-center my-auto space-y-2 py-4">
                            <h3 class="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight break-words">
                                ${frontWord}
                            </h3>
                            ${frontAlt && frontAlt !== frontWord ? `<p class="text-xs font-bold text-slate-400 dark:text-slate-500">${frontAlt}</p>` : ''}
                            ${phonetic ? `<p class="text-xs font-mono font-medium text-blue-500">${phonetic}</p>` : ''}
                        </div>

                        <div class="text-center border-t border-slate-100 dark:border-slate-800/80 pt-3">
                            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 animate-pulse">
                                <span>👆</span> <span>Dodirni karticu za prevod i primer</span>
                            </p>
                        </div>
                    </div>

                    <!-- Back Face (Revealed on Tap) -->
                    <div id="card-face-back" class="p-6 flex flex-col justify-between h-full bg-slate-50/70 dark:bg-slate-800/50 ${this.isFlipped ? 'flex' : 'hidden'}">
                        <div class="flex items-center justify-between">
                            <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-800">
                                ✨ Prevod & Značenje
                            </span>
                            <button onclick="event.stopPropagation(); SrsEngine.playAudio('${currentWord.sr_lat}')" class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-blue-500 flex items-center justify-center text-lg active:scale-90 transition-transform shadow-sm">
                                🔊
                            </button>
                        </div>

                        <div class="text-center my-auto space-y-3 py-2">
                            <h3 class="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight break-words">
                                ${backWord}
                            </h3>
                            ${examplePrimary ? `
                            <div class="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-1">
                                <p class="text-xs font-bold text-slate-700 dark:text-slate-200">"${examplePrimary}"</p>
                                ${exampleSecondary ? `<p class="text-[11px] text-slate-400 dark:text-slate-500 italic font-medium">${exampleSecondary}</p>` : ''}
                            </div>` : ''}
                        </div>

                        <div class="text-center border-t border-slate-200 dark:border-slate-700/80 pt-3">
                            <p class="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                                👈 Prevucite levo (Učim) ili desno (Znam) 👉
                            </p>
                        </div>
                    </div>
                </div>
            `;

            this.activeCardEl = document.getElementById('srs-active-card');
            this.attachSwipePhysics(this.activeCardEl);
        },

        toggleCardFlip: function () {
            this.isFlipped = !this.isFlipped;
            const front = document.getElementById('card-face-front');
            const back = document.getElementById('card-face-back');
            if (front && back) {
                if (this.isFlipped) {
                    front.classList.add('hidden');
                    front.classList.remove('flex');
                    back.classList.remove('hidden');
                    back.classList.add('flex');
                } else {
                    back.classList.add('hidden');
                    back.classList.remove('flex');
                    front.classList.remove('hidden');
                    front.classList.add('flex');
                }
            }
            if (typeof TouchHaptics !== 'undefined') {
                TouchHaptics.vibrate('tap');
            }
        },

        playAudio: function (text) {
            if (!text || typeof text !== 'string') return;
            text = text.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\/.*?\//g, '').trim();
            if (!text) return;
            if (typeof app !== 'undefined' && app.speakPhrase) {
                app.speakPhrase(text, 'sr-RS');
            } else if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'sr-RS';
                speechSynthesis.speak(u);
            }
            if (typeof TouchHaptics !== 'undefined') {
                TouchHaptics.vibrate('tap');
            }
        },

        // --- 4. TOUCH & MOUSE TINDER SWIPE PHYSICS ---
        attachSwipePhysics: function (cardEl) {
            if (!cardEl) return;

            let startX = 0;
            let startY = 0;
            let deltaX = 0;
            let deltaY = 0;
            let isDragging = false;
            let hasMoved = false;

            const stampKnown = document.getElementById('stamp-known');
            const stampReview = document.getElementById('stamp-review');

            const onStart = (clientX, clientY) => {
                startX = clientX;
                startY = clientY;
                deltaX = 0;
                deltaY = 0;
                isDragging = true;
                hasMoved = false;
                cardEl.style.transition = 'none';
            };

            const onMove = (clientX, clientY, e) => {
                if (!isDragging) return;
                deltaX = clientX - startX;
                deltaY = clientY - startY;

                if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
                    hasMoved = true;
                    if (e && e.cancelable) e.preventDefault();
                }

                // Tilt angle proportional to horizontal drag
                const rotation = deltaX * 0.08;
                cardEl.style.transform = `translate(${deltaX}px, ${deltaY * 0.25}px) rotate(${rotation}deg)`;

                // Opacity of stamp badges
                if (deltaX > 20) {
                    const norm = Math.min(1, (deltaX - 20) / 75);
                    if (stampKnown) stampKnown.style.opacity = `${norm}`;
                    if (stampReview) stampReview.style.opacity = '0';
                    cardEl.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                } else if (deltaX < -20) {
                    const norm = Math.min(1, (-deltaX - 20) / 75);
                    if (stampReview) stampReview.style.opacity = `${norm}`;
                    if (stampKnown) stampKnown.style.opacity = '0';
                    cardEl.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                } else {
                    if (stampKnown) stampKnown.style.opacity = '0';
                    if (stampReview) stampReview.style.opacity = '0';
                    cardEl.style.borderColor = '';
                }
            };

            const onEnd = () => {
                if (!isDragging) return;
                isDragging = false;

                // Tap detection (minimal movement) -> Flip card!
                if (!hasMoved) {
                    SrsEngine.toggleCardFlip();
                    return;
                }

                // Check swipe completion threshold (>75px)
                if (deltaX > 75) {
                    SrsEngine.executeSwipe('right');
                } else if (deltaX < -75) {
                    SrsEngine.executeSwipe('left');
                } else {
                    // Snap back with spring
                    cardEl.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s';
                    cardEl.style.transform = 'translate(0px, 0px) rotate(0deg)';
                    cardEl.style.borderColor = '';
                    if (stampKnown) stampKnown.style.opacity = '0';
                    if (stampReview) stampReview.style.opacity = '0';
                    setTimeout(() => {
                        cardEl.style.transition = '';
                    }, 280);
                }
            };

            // Touch events
            cardEl.addEventListener('touchstart', (e) => {
                const t = e.touches[0];
                onStart(t.clientX, t.clientY);
            }, { passive: true });

            cardEl.addEventListener('touchmove', (e) => {
                const t = e.touches[0];
                onMove(t.clientX, t.clientY, e);
            }, { passive: false });

            cardEl.addEventListener('touchend', onEnd, { passive: true });
            cardEl.addEventListener('touchcancel', onEnd, { passive: true });

            // Desktop Mouse drag events
            cardEl.addEventListener('mousedown', (e) => {
                onStart(e.clientX, e.clientY);
                const onMouseMove = (ev) => onMove(ev.clientX, ev.clientY, ev);
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    onEnd();
                };
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        },

        executeSwipe: function (direction) {
            const cardEl = this.activeCardEl;
            const currentWord = this.deck[this.currentIndex];
            if (!currentWord) return;

            const isKnown = direction === 'right';

            if (cardEl) {
                cardEl.style.transition = 'transform 0.24s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.24s ease-out';
                const offscreenX = isKnown ? '130vw' : '-130vw';
                const offscreenRotate = isKnown ? '35deg' : '-35deg';
                cardEl.style.transform = `translate(${offscreenX}, 30px) rotate(${offscreenRotate})`;
                cardEl.style.opacity = '0';
            }

            // Haptic feedback & SRS record
            if (isKnown) {
                this.knownCount++;
                this.recordReview(currentWord.id, true);
                if (typeof TouchHaptics !== 'undefined') {
                    TouchHaptics.vibrate('correct');
                }
            } else {
                this.reviewCount++;
                this.recordReview(currentWord.id, false);
                if (typeof TouchHaptics !== 'undefined') {
                    TouchHaptics.vibrate('wrong');
                }
            }

            setTimeout(() => {
                this.currentIndex++;
                this.isFlipped = false;
                this.updateProgressBar();
                this.renderCardStack();
            }, 240);
        },

        updateProgressBar: function () {
            const bar = document.getElementById('srs-progress-bar');
            const label = document.getElementById('srs-progress-label');
            const total = this.deck.length || 1;
            const progress = Math.min(100, Math.round((this.currentIndex / total) * 100));

            if (bar) bar.style.width = `${progress}%`;
            if (label) label.innerText = `${Math.min(this.currentIndex + 1, total)} / ${total}`;
        },

        // --- 5. SESSION COMPLETION SUMMARY ---
        renderSessionSummary: function (container) {
            const total = this.deck.length;
            const accuracy = total > 0 ? Math.round((this.knownCount / total) * 100) : 100;
            const xpEarned = 20;

            // Award XP to user profile
            if (typeof state !== 'undefined' && state.user) {
                state.user.xp = (state.user.xp || 0) + xpEarned;
                if (typeof app !== 'undefined' && app.saveStats) app.saveStats();
                if (typeof app !== 'undefined' && app.updateProfileUI) app.updateProfileUI();
            }

            if (typeof app !== 'undefined' && app.fireConfetti) {
                app.fireConfetti();
            }
            if (typeof TouchHaptics !== 'undefined') {
                TouchHaptics.vibrate('celebrate');
            }

            container.innerHTML = `
                <div class="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-2xl text-center space-y-5 animate-scale-up">
                    <div class="text-6xl animate-bounce">🧠</div>
                    <div>
                        <h3 class="text-2xl font-black text-slate-800 dark:text-white">Ponavljanje Završeno!</h3>
                        <p class="text-xs font-bold text-slate-400 dark:text-slate-400 mt-1">Vaša memorija je uspešno osvežena</p>
                    </div>

                    <div class="grid grid-cols-3 gap-2 py-2">
                        <div class="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                            <span class="text-xs font-black text-emerald-500 uppercase">Znam</span>
                            <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${this.knownCount}</p>
                        </div>
                        <div class="bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl border border-red-200 dark:border-red-800">
                            <span class="text-xs font-black text-red-500 uppercase">Učim</span>
                            <p class="text-2xl font-black text-red-600 dark:text-red-400">${this.reviewCount}</p>
                        </div>
                        <div class="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-blue-200 dark:border-blue-800">
                            <span class="text-xs font-black text-blue-500 uppercase">Tačnost</span>
                            <p class="text-2xl font-black text-blue-600 dark:text-blue-400">${accuracy}%</p>
                        </div>
                    </div>

                    <div class="bg-yellow-400/10 dark:bg-yellow-400/20 border border-yellow-400/40 p-3 rounded-2xl flex items-center justify-center gap-2">
                        <span class="text-xl">⚡</span>
                        <span class="text-sm font-black text-yellow-600 dark:text-yellow-400">+${xpEarned} XP Nagrada za memoriju</span>
                    </div>

                    <div class="flex gap-3 pt-2">
                        <button onclick="SrsEngine.openSwipeSession()" class="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-black rounded-2xl text-xs active:scale-95 transition-transform">
                            🔄 Još 1 Runda
                        </button>
                        <button onclick="SrsEngine.closeModal()" class="flex-1 py-3.5 bg-blue-500 text-white font-black rounded-2xl text-xs shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
                            Gotovo
                        </button>
                    </div>
                </div>
            `;
        },

        // --- 6. STATS TAB MEMORY HEATMAP ---
        renderHeatmap: function () {
            const container = document.getElementById('memory-heatmap-container');
            if (!container) return;

            const health = this.calculateBrainHealth();
            const seedData = window.SEED_DATA || [];
            const srs = this.getSrsData();
            const todayStr = new Date().toISOString().split('T')[0];

            // Build 48 tiles representing vocabulary status
            let tilesHtml = '';
            const totalTiles = 48;
            const trackedKeys = Object.keys(srs);

            for (let i = 0; i < totalTiles; i++) {
                let colorClass = 'bg-slate-200 dark:bg-slate-700/60'; // untracked
                let wordLabel = 'Neotkrivena reč';
                let strengthLabel = '0%';

                if (i < trackedKeys.length) {
                    const key = trackedKeys[i];
                    const rec = srs[key];
                    const found = seedData.find(w => w.id === key);
                    wordLabel = found ? found.sr_lat : key;
                    const str = rec.strength || 30;
                    strengthLabel = `${str}%`;

                    if (rec.nextReview && rec.nextReview <= todayStr) {
                        colorClass = 'bg-red-500 shadow-sm shadow-red-500/40 animate-pulse'; // due
                    } else if (str >= 80) {
                        colorClass = 'bg-emerald-500 shadow-sm shadow-emerald-500/30'; // mastered
                    } else if (str >= 55) {
                        colorClass = 'bg-emerald-400'; // strong
                    } else {
                        colorClass = 'bg-amber-400'; // learning
                    }
                } else if (i < trackedKeys.length + 8 && seedData[i]) {
                    // Available soon
                    colorClass = 'bg-blue-400/30';
                    wordLabel = seedData[i].sr_lat;
                    strengthLabel = 'Spremno';
                }

                tilesHtml += `
                    <div title="${wordLabel} (${strengthLabel})" 
                         onclick="SrsEngine.showTileDetail('${wordLabel}', '${strengthLabel}')"
                         class="w-full aspect-square rounded-md ${colorClass} hover:scale-125 transition-transform cursor-pointer">
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-xl p-1.5 bg-indigo-500/10 rounded-xl">🧠</span>
                            <div>
                                <h3 class="font-black text-slate-800 dark:text-white text-sm">Zdravlje Memorije</h3>
                                <p class="text-[10px] font-bold text-slate-400">Spaced Repetition (SRS) Analiza</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-base font-black text-indigo-500">${health.score}%</span>
                            <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Vitalnost</p>
                        </div>
                    </div>

                    <!-- Retention Matrix Heatmap Grid -->
                    <div class="space-y-1.5">
                        <div class="grid grid-cols-12 gap-1.5 p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
                            ${tilesHtml}
                        </div>
                        <div id="srs-tile-preview" class="text-[10px] font-bold text-slate-400 text-center h-4">
                            Dodirnite kockicu za detalje reči
                        </div>
                    </div>

                    <!-- Legend -->
                    <div class="flex items-center justify-between text-[9px] font-bold text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700/60 px-1">
                        <div class="flex items-center gap-1.5">
                            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                            <span>Savladano (${health.mastered})</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                            <span>U toku (${health.learning})</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            <div class="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <span>Osvežiti (${health.critical})</span>
                        </div>
                    </div>

                    <!-- Launch Flashcard Swipe CTA -->
                    <button onclick="SrsEngine.openSwipeSession()" class="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <span>⚡</span>
                        <span>Pokreni Flashcard Ponavljanje (${health.critical > 0 ? health.critical + ' za danas' : 'Brzi Swipe'})</span>
                    </button>
                </div>
            `;
        },

        showTileDetail: function (word, strength) {
            const preview = document.getElementById('srs-tile-preview');
            if (preview) {
                preview.innerHTML = `🔍 <span class="font-black text-slate-700 dark:text-white">${word}</span> — Jačina memorije: <span class="text-blue-500 font-bold">${strength}</span>`;
            }
            if (typeof TouchHaptics !== 'undefined') {
                TouchHaptics.vibrate('tap');
            }
        },

        // --- 7. CUSTOM COMMUNITY DECKS & FOLDERS (Priority 40) ---
        CUSTOM_DECKS_STORAGE: 'serbolingo_custom_decks',
        _selectedDeckEmoji: '🍽️',

        getDefaultDecks: function () {
            return [
                {
                    id: 'deck_food',
                    name: 'Hrana & Kafana',
                    emoji: '🍽️',
                    createdAt: '2026-11-10',
                    words: [
                        { id: 'w_cevapi', sr: 'Ćevapi', sr_lat: 'Ćevapi', en: 'Grilled meat sausages', pos: 'imenica (m.r.)', example_sr: 'Deset ćevapa sa lukom i kajmakom.', example_en: 'Ten cevapi with onion and clotted cream.' },
                        { id: 'w_kajmak', sr: 'Kajmak', sr_lat: 'Kajmak', en: 'Clotted cream spread', pos: 'imenica (m.r.)', example_sr: 'Vruća lepinja sa kajmakom je najbolja.', example_en: 'Hot flatbread with kajmak is the best.' },
                        { id: 'w_rakija', sr: 'Rakija', sr_lat: 'Rakija', en: 'Fruit brandy', pos: 'imenica (ž.r.)', example_sr: 'Domaća šljivovica se pije za zdravlje.', example_en: 'Homemade plum brandy is drank for health.' },
                        { id: 'w_racun', sr: 'Račun', sr_lat: 'Račun', en: 'Bill / Check', pos: 'imenica (m.r.)', example_sr: 'Konobar, račun molim!', example_en: 'Waiter, check please!' }
                    ]
                },
                {
                    id: 'deck_travel',
                    name: 'Putovanja & Prevoz',
                    emoji: '✈️',
                    createdAt: '2026-11-10',
                    words: [
                        { id: 'w_karta', sr: 'Karta', sr_lat: 'Karta', en: 'Ticket', pos: 'imenica (ž.r.)', example_sr: 'Jedna povratna karta za Beograd.', example_en: 'One return ticket for Belgrade.' },
                        { id: 'w_stanica', sr: 'Stanica', sr_lat: 'Stanica', en: 'Station', pos: 'imenica (ž.r.)', example_sr: 'Autobuska stanica je blizu centra.', example_en: 'The bus station is near the center.' },
                        { id: 'w_pasos', sr: 'Pasoš', sr_lat: 'Pasoš', en: 'Passport', pos: 'imenica (m.r.)', example_sr: 'Pripremite pasoš za pasošku kontrolu.', example_en: 'Prepare your passport for passport control.' },
                        { id: 'w_aerodrom', sr: 'Aerodrom', sr_lat: 'Aerodrom', en: 'Airport', pos: 'imenica (m.r.)', example_sr: 'Aerodrom Nikola Tesla se nalazi u Surčinu.', example_en: 'Nikola Tesla Airport is located in Surcin.' }
                    ]
                }
            ];
        },

        getCustomDecks: function () {
            try {
                const raw = localStorage.getItem(this.CUSTOM_DECKS_STORAGE);
                if (raw) return JSON.parse(raw);
            } catch (e) {
                console.warn('[SrsEngine] Failed to read custom decks:', e);
            }
            const defaults = this.getDefaultDecks();
            this.saveCustomDecks(defaults);
            return defaults;
        },

        saveCustomDecks: function (decks) {
            try {
                localStorage.setItem(this.CUSTOM_DECKS_STORAGE, JSON.stringify(decks));
            } catch (e) {
                console.error('[SrsEngine] Failed to save custom decks:', e);
            }
        },

        renderCustomDecks: function () {
            const listEl = document.getElementById('custom-decks-list');
            if (!listEl) return;

            const decks = this.getCustomDecks();
            if (!decks || decks.length === 0) {
                listEl.innerHTML = `
                    <div class="text-xs text-slate-400 py-2 italic">
                        Nemate kreiranih špilova. Kliknite na "➕ Novi Špil" da napravite prvi!
                    </div>
                `;
                return;
            }

            listEl.innerHTML = decks.map(d => {
                const count = (d.words && d.words.length) || 0;
                return `
                    <div class="shrink-0 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700/80 rounded-2xl p-2.5 flex items-center gap-2 shadow-sm hover:border-blue-500/50 transition-all group">
                        <button onclick="SrsEngine.openDeckSwipeSession('${d.id}')" class="flex items-center gap-2 text-left active:scale-95 transition-transform" title="Pokreni swipe vežbu za ovaj špil">
                            <span class="text-2xl">${d.emoji || '📁'}</span>
                            <div>
                                <h5 class="text-xs font-black text-slate-800 dark:text-white leading-tight">${d.name}</h5>
                                <span class="text-[10px] font-bold text-blue-500">${count} ${count === 1 ? 'reč' : 'reči'}</span>
                            </div>
                        </button>
                        <div class="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-800 ml-1">
                            <button onclick="SrsEngine.shareDeckMessaging('${d.id}')" class="p-1 text-slate-400 hover:text-green-500 text-xs active:scale-90 transition-transform" title="Podeli špil (WhatsApp / Viber)">
                                💬
                            </button>
                            <button onclick="SrsEngine.exportDeckJson('${d.id}')" class="p-1 text-slate-400 hover:text-blue-500 text-xs active:scale-90 transition-transform" title="Izvezi špil kao JSON fajl">
                                📤
                            </button>
                            <button onclick="SrsEngine.deleteCustomDeck('${d.id}')" class="p-1 text-slate-400 hover:text-red-500 text-xs active:scale-90 transition-transform" title="Obriši špil">
                                ✕
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        },

        openCreateDeckModal: function () {
            const modal = document.getElementById('custom-deck-modal');
            if (modal) modal.classList.remove('hidden');
            const input = document.getElementById('new-deck-name-input');
            if (input) {
                input.value = '';
                setTimeout(() => input.focus(), 100);
            }
            this._selectedDeckEmoji = '🍽️';
        },

        closeCreateDeckModal: function () {
            const modal = document.getElementById('custom-deck-modal');
            if (modal) modal.classList.add('hidden');
        },

        selectDeckEmoji: function (emoji) {
            this._selectedDeckEmoji = emoji;
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
            if (window.app && window.app.showToast) {
                window.app.showToast(`Izabran emoji: ${emoji}`, 'info');
            }
        },

        confirmCreateDeck: function () {
            const input = document.getElementById('new-deck-name-input');
            const name = input ? input.value.trim() : '';
            if (!name) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('Unesite naziv špila!', 'error');
                }
                return;
            }

            const decks = this.getCustomDecks();
            const newDeck = {
                id: 'deck_' + Date.now(),
                name: name,
                emoji: this._selectedDeckEmoji || '📁',
                createdAt: new Date().toISOString().split('T')[0],
                words: []
            };

            decks.push(newDeck);
            this.saveCustomDecks(decks);
            this.closeCreateDeckModal();
            this.renderCustomDecks();

            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('success');
            if (window.app && window.app.showToast) {
                window.app.showToast(`🎉 Špil "${name}" je uspešno kreiran!`, 'success');
            }
        },

        deleteCustomDeck: function (deckId) {
            if (!confirm('Da li ste sigurni da želite da obrišete ovaj špil?')) return;
            let decks = this.getCustomDecks();
            decks = decks.filter(d => d.id !== deckId);
            this.saveCustomDecks(decks);
            this.renderCustomDecks();
            if (window.app && window.app.showToast) {
                window.app.showToast('Špil je uklonjen.', 'info');
            }
        },

        shareDeckMessaging: async function (deckId) {
            const decks = this.getCustomDecks();
            const deck = decks.find(d => d.id === deckId);
            if (!deck) return;
            const count = (deck.wordIds || []).length;
            const shareText = `📚 Vežbaj sa mnom špil "${deck.name}" (${count} reči) na SerboLingo!\nUvezi ovaj špil ili poseti SerboLingo! 🇷🇸`;

            if (navigator.share) {
                try {
                    const jsonStr = JSON.stringify(deck, null, 2);
                    const blob = new Blob([jsonStr], { type: 'application/json' });
                    const file = new File([blob], `serbolingo-deck-${deck.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`, { type: 'application/json' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({
                            title: `SerboLingo Špil: ${deck.name}`,
                            text: shareText,
                            files: [file]
                        });
                        if (window.app && window.app.showToast) window.app.showToast('💬 Špil uspešno podeljen!', 'success');
                        return;
                    }
                    await navigator.share({
                        title: `SerboLingo Špil: ${deck.name}`,
                        text: shareText
                    });
                    if (window.app && window.app.showToast) window.app.showToast('💬 Špil uspešno podeljen!', 'success');
                    return;
                } catch (e) {
                    /* user cancelled */
                }
            } else {
                // WhatsApp Web fallback
                const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
                window.open(waUrl, '_blank');
            }
        },

        exportDeckJson: function (deckId) {
            const decks = this.getCustomDecks();
            const deck = decks.find(d => d.id === deckId);
            if (!deck) return;

            const jsonStr = JSON.stringify(deck, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `serbolingo-deck-${deck.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (window.app && window.app.showToast) {
                window.app.showToast(`📤 Špil "${deck.name}" je sačuvan kao fajl!`, 'success');
            }
        },

        triggerDeckImport: function () {
            const input = document.getElementById('custom-deck-import-input');
            if (input) input.click();
        },

        handleDeckImportFile: function (event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (!imported || !imported.name) {
                        throw new Error('Nevalidan format špila');
                    }

                    const decks = this.getCustomDecks();
                    const newId = 'deck_' + Date.now();
                    imported.id = newId;
                    if (!imported.words) imported.words = [];

                    decks.push(imported);
                    this.saveCustomDecks(decks);
                    this.renderCustomDecks();

                    if (window.app && window.app.showToast) {
                        window.app.showToast(`📥 Uvezen špil "${imported.name}" sa ${imported.words.length} reči!`, 'success');
                    }
                } catch (err) {
                    console.error('[SrsEngine] Import failed:', err);
                    if (window.app && window.app.showToast) {
                        window.app.showToast('Greška pri uvozu: fajl nije validan JSON špil.', 'error');
                    }
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        },

        openDeckSwipeSession: function (deckId) {
            const decks = this.getCustomDecks();
            const deck = decks.find(d => d.id === deckId);
            if (!deck || !deck.words || deck.words.length === 0) {
                if (window.app && window.app.showToast) {
                    window.app.showToast(`Špil "${deck ? deck.name : ''}" je prazan. Dodajte reči pre ponavljanja!`, 'info');
                }
                return;
            }

            this.deck = deck.words.map((w, idx) => ({
                id: w.id || ('cw_' + idx),
                sr_lat: w.sr || w.sr_lat || 'Reč',
                en: w.en || '',
                category: deck.name,
                pos: w.pos || 'reč',
                example_sr: w.example_sr || '',
                example_en: w.example_en || ''
            }));

            this.currentIndex = 0;
            this.knownCount = 0;
            this.reviewCount = 0;
            this.isFlipped = false;

            const modal = document.getElementById('flashcard-swipe-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            this.renderCardStack();
            this.updateProgressBar();

            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        }
    };

    // Auto-hook into page ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            SrsEngine.renderHeatmap();
            SrsEngine.renderCustomDecks();
        });
    } else {
        setTimeout(() => {
            SrsEngine.renderHeatmap();
            SrsEngine.renderCustomDecks();
        }, 200);
    }

    // Expose globally
    window.SrsEngine = SrsEngine;
})();
