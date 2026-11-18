// [SHIELD_DAEMON: VALIDATED]
// Priority 12 Upgrade: Local Trophy Cabinet ("Vitrina sa Trofejima")
// Personal Bests, Bot Duel Win Streaks, 20 Tiered Achievement Medals, and 3D Showcase Room.

const TrophyEngine = {
    activeFilter: 'all',

    // 20 Curated Achievement Medals across Bronze, Silver, Gold, and Diamond tiers
    MEDALS: [
        // 🥉 Bronze Tier (5 Medals)
        {
            id: 'first_win',
            tier: 'bronze',
            title_sr: 'Prva Pobeda',
            title_en: 'First Victory',
            desc_sr: 'Pobedi u bilo kojoj igrici u Igraonici.',
            desc_en: 'Win any minigame in the Arcade.',
            icon: '🥉',
            badgeBg: 'from-amber-600 to-amber-800',
            xp: 15,
            check: (s) => (s.totalWins || 0) >= 1,
            progress: (s) => `${Math.min(1, s.totalWins || 0)}/1`
        },
        {
            id: 'bot_slayer',
            tier: 'bronze',
            title_sr: 'Bot Rival',
            title_en: 'Bot Slayer',
            desc_sr: 'Pobedi bota u trci znanja.',
            desc_en: 'Defeat a bot in a knowledge race.',
            icon: '🤖',
            badgeBg: 'from-amber-600 to-amber-800',
            xp: 20,
            check: (s) => (s.botStreaks?.wins || 0) >= 1,
            progress: (s) => `${Math.min(1, s.botStreaks?.wins || 0)}/1`
        },
        {
            id: 'typer_bronze',
            tier: 'bronze',
            title_sr: 'Brzi Prsti',
            title_en: 'Quick Fingers',
            desc_sr: 'Ostvari rezultat 5+ u igrici Kucanje (Speed Typer).',
            desc_en: 'Score 5+ points in Speed Typer.',
            icon: '⌨️',
            badgeBg: 'from-amber-600 to-amber-800',
            xp: 15,
            check: (s) => (s.highScores?.speed_typer || 0) >= 5,
            progress: (s) => `${Math.min(5, s.highScores?.speed_typer || 0)}/5`
        },
        {
            id: 'million_bronze',
            tier: 'bronze',
            title_sr: 'Znanje na Startu',
            title_en: 'Milioner Kickoff',
            desc_sr: 'Dostigni 5. pitanje u kvizu Milioner.',
            desc_en: 'Reach Question 5 in Milioner.',
            icon: '💰',
            badgeBg: 'from-amber-600 to-amber-800',
            xp: 15,
            check: (s) => (s.highScores?.milioner || 0) >= 5,
            progress: (s) => `${Math.min(5, s.highScores?.milioner || 0)}/5`
        },
        {
            id: 'arcade_scout',
            tier: 'bronze',
            title_sr: 'Istraživač Arkade',
            title_en: 'Arcade Scout',
            desc_sr: 'Odigraj bar 5 različitih igrica.',
            desc_en: 'Play at least 5 different minigames.',
            icon: '🕹️',
            badgeBg: 'from-amber-600 to-amber-800',
            xp: 20,
            check: (s) => Object.keys(s.gamesPlayed || {}).length >= 5,
            progress: (s) => `${Math.min(5, Object.keys(s.gamesPlayed || {}).length)}/5`
        },

        // 🥈 Silver Tier (5 Medals)
        {
            id: 'bot_streak_3',
            tier: 'silver',
            title_sr: 'Trn u Oku Botova',
            title_en: 'Bot Nemesis',
            desc_sr: 'Pobedi bota 3 puta zaredom bez poraza.',
            desc_en: 'Win 3 bot races in a row.',
            icon: '⚔️',
            badgeBg: 'from-slate-400 to-slate-600',
            xp: 35,
            check: (s) => (s.botStreaks?.max || 0) >= 3,
            progress: (s) => `${Math.min(3, s.botStreaks?.max || 0)}/3 niz`
        },
        {
            id: 'million_silver',
            tier: 'silver',
            title_sr: 'Polovina Miliona',
            title_en: 'Halfway to Million',
            desc_sr: 'Dostigni 10. pitanje u kvizu Milioner.',
            desc_en: 'Reach Question 10 in Milioner.',
            icon: '💵',
            badgeBg: 'from-slate-400 to-slate-600',
            xp: 35,
            check: (s) => (s.highScores?.milioner || 0) >= 10,
            progress: (s) => `${Math.min(10, s.highScores?.milioner || 0)}/10`
        },
        {
            id: 'typer_silver',
            tier: 'silver',
            title_sr: 'Daktilograf',
            title_en: 'Skilled Typist',
            desc_sr: 'Ostvari rezultat 15+ u igrici Kucanje.',
            desc_en: 'Score 15+ points in Speed Typer.',
            icon: '⚡',
            badgeBg: 'from-slate-400 to-slate-600',
            xp: 30,
            check: (s) => (s.highScores?.speed_typer || 0) >= 15,
            progress: (s) => `${Math.min(15, s.highScores?.speed_typer || 0)}/15`
        },
        {
            id: 'whack_silver',
            tier: 'silver',
            title_sr: 'Oštro Oko',
            title_en: 'Sharp Reflexes',
            desc_sr: 'Ostvari rezultat 10+ u igrici Udari Reč.',
            desc_en: 'Score 10+ in Whack A Word.',
            icon: '🎯',
            badgeBg: 'from-slate-400 to-slate-600',
            xp: 30,
            check: (s) => (s.highScores?.whack_a_word || 0) >= 10,
            progress: (s) => `${Math.min(10, s.highScores?.whack_a_word || 0)}/10`
        },
        {
            id: 'arcade_enthusiast',
            tier: 'silver',
            title_sr: 'Majstor Raznovrsnosti',
            title_en: 'Variety Master',
            desc_sr: 'Odigraj bar 12 različitih igrica.',
            desc_en: 'Play at least 12 different minigames.',
            icon: '🎪',
            badgeBg: 'from-slate-400 to-slate-600',
            xp: 40,
            check: (s) => Object.keys(s.gamesPlayed || {}).length >= 12,
            progress: (s) => `${Math.min(12, Object.keys(s.gamesPlayed || {}).length)}/12`
        },

        // 🥇 Gold Tier (5 Medals)
        {
            id: 'million_gold',
            tier: 'gold',
            title_sr: 'Pravi Milioner',
            title_en: 'True Millionaire',
            desc_sr: 'Pobedi u Milioneru i odgovori na svih 15 pitanja!',
            desc_en: 'Answer all 15 questions in Milioner correctly!',
            icon: '👑',
            badgeBg: 'from-yellow-400 to-amber-500',
            xp: 75,
            check: (s) => (s.highScores?.milioner || 0) >= 15,
            progress: (s) => `${Math.min(15, s.highScores?.milioner || 0)}/15`
        },
        {
            id: 'bot_streak_5',
            tier: 'gold',
            title_sr: 'Gospodar Botova',
            title_en: 'Bot Overlord',
            desc_sr: 'Pobedi bota 5 puta zaredom.',
            desc_en: 'Win 5 bot races in a row.',
            icon: '🔥',
            badgeBg: 'from-yellow-400 to-amber-500',
            xp: 70,
            check: (s) => (s.botStreaks?.max || 0) >= 5,
            progress: (s) => `${Math.min(5, s.botStreaks?.max || 0)}/5 niz`
        },
        {
            id: 'typer_gold',
            tier: 'gold',
            title_sr: 'Munjeviti Prsti',
            title_en: 'Lightning Typist',
            desc_sr: 'Ostvari rezultat 25+ u igrici Kucanje.',
            desc_en: 'Score 25+ points in Speed Typer.',
            icon: '⚡',
            badgeBg: 'from-yellow-400 to-amber-500',
            xp: 60,
            check: (s) => (s.highScores?.speed_typer || 0) >= 25,
            progress: (s) => `${Math.min(25, s.highScores?.speed_typer || 0)}/25`
        },
        {
            id: 'snake_gold',
            tier: 'gold',
            title_sr: 'Zmijski Kralj',
            title_en: 'Snake Master',
            desc_sr: 'Ostvari rezultat 12+ u igrici Zmija (Snake).',
            desc_en: 'Score 12+ in Snake minigame.',
            icon: '🐍',
            badgeBg: 'from-yellow-400 to-amber-500',
            xp: 50,
            check: (s) => (s.highScores?.snake || 0) >= 12,
            progress: (s) => `${Math.min(12, s.highScores?.snake || 0)}/12`
        },
        {
            id: 'arcade_veteran',
            tier: 'gold',
            title_sr: 'Veteran Igraonice',
            title_en: 'Arcade Veteran',
            desc_sr: 'Ostvari 25 ukupnih pobeda u igricama.',
            desc_en: 'Achieve 25 total minigame victories.',
            icon: '🎖️',
            badgeBg: 'from-yellow-400 to-amber-500',
            xp: 80,
            check: (s) => (s.totalWins || 0) >= 25,
            progress: (s) => `${Math.min(25, s.totalWins || 0)}/25`
        },

        // 💎 Diamond Tier (5 Medals)
        {
            id: 'bot_streak_10',
            tier: 'diamond',
            title_sr: 'Legenda Balkana',
            title_en: 'Balkan Legend',
            desc_sr: 'Pobedi bota čak 10 puta zaredom bez ijednog poraza!',
            desc_en: 'Win 10 bot races in a row without a single loss!',
            icon: '🌟',
            badgeBg: 'from-cyan-400 to-blue-600',
            xp: 150,
            check: (s) => (s.botStreaks?.max || 0) >= 10,
            progress: (s) => `${Math.min(10, s.botStreaks?.max || 0)}/10 niz`
        },
        {
            id: 'speed_demon',
            tier: 'diamond',
            title_sr: 'Brzina Zvuka',
            title_en: 'Speed of Sound',
            desc_sr: 'Ostvari neverovatnih 35+ u igrici Kucanje!',
            desc_en: 'Score an incredible 35+ in Speed Typer!',
            icon: '🚀',
            badgeBg: 'from-cyan-400 to-blue-600',
            xp: 120,
            check: (s) => (s.highScores?.speed_typer || 0) >= 35,
            progress: (s) => `${Math.min(35, s.highScores?.speed_typer || 0)}/35`
        },
        {
            id: 'trophy_collector',
            tier: 'diamond',
            title_sr: 'Zlatna Vitrina',
            title_en: 'Trophy Hoarder',
            desc_sr: 'Otključaj najmanje 12 trofeja u vitrini.',
            desc_en: 'Unlock at least 12 medals in your cabinet.',
            icon: '🏆',
            badgeBg: 'from-cyan-400 to-blue-600',
            xp: 150,
            check: (s) => Object.keys(s.unlockedMedals || {}).length >= 12,
            progress: (s) => `${Math.min(12, Object.keys(s.unlockedMedals || {}).length)}/12`
        },
        {
            id: 'century_player',
            tier: 'diamond',
            title_sr: 'Klub 100',
            title_en: 'Centurion',
            desc_sr: 'Odigraj 50 ukupnih partija u Igraonici.',
            desc_en: 'Play 50 total matches in the Arcade.',
            icon: '💯',
            badgeBg: 'from-cyan-400 to-blue-600',
            xp: 150,
            check: (s) => (s.totalGamesPlayed || 0) >= 50,
            progress: (s) => `${Math.min(50, s.totalGamesPlayed || 0)}/50`
        },
        {
            id: 'arcade_champion',
            tier: 'diamond',
            title_sr: 'Apsolutni Šampion',
            title_en: 'Grand Champion',
            desc_sr: 'Pobedi u 50 ukupnih partija u Igraonici.',
            desc_en: 'Win 50 total minigames in the Arcade.',
            icon: '🪐',
            badgeBg: 'from-cyan-400 to-blue-600',
            xp: 200,
            check: (s) => (s.totalWins || 0) >= 50,
            progress: (s) => `${Math.min(50, s.totalWins || 0)}/50`
        }
    ],

    // 1. Get state safely with default structure
    getState: function() {
        if (!window.state) window.state = {};
        if (!window.state.trophies) {
            const saved = localStorage.getItem('serbolingo_trophies');
            if (saved) {
                try {
                    window.state.trophies = JSON.parse(saved);
                } catch (e) {
                    window.state.trophies = null;
                }
            }
            if (!window.state.trophies) {
                window.state.trophies = {
                    highScores: {},
                    gamesPlayed: {},
                    totalGamesPlayed: 0,
                    totalWins: 0,
                    botStreaks: { current: 0, max: 0, wins: 0, losses: 0 },
                    unlockedMedals: {}
                };
            }
        }
        return window.state.trophies;
    },

    saveState: function() {
        const s = this.getState();
        localStorage.setItem('serbolingo_trophies', JSON.stringify(s));
        if (window.app && typeof window.app.saveStats === 'function') {
            window.app.saveStats();
        }
        this.updateArcadeBanner();
    },

    // 2. Universal game recording hook
    recordGameResult: function(gameId, rawScore, isWin = false, isBotGame = false) {
        const s = this.getState();
        const score = typeof rawScore === 'number' ? rawScore : (isWin ? 1 : 0);

        // Normalize game key
        const key = this.normalizeGameKey(gameId);

        // Track games played
        s.totalGamesPlayed = (s.totalGamesPlayed || 0) + 1;
        if (!s.gamesPlayed) s.gamesPlayed = {};
        s.gamesPlayed[key] = (s.gamesPlayed[key] || 0) + 1;

        if (isWin) {
            s.totalWins = (s.totalWins || 0) + 1;
        }

        // Track High Scores
        if (!s.highScores) s.highScores = {};
        const oldHigh = s.highScores[key] || 0;
        let isNewHigh = false;
        if (score > oldHigh) {
            s.highScores[key] = score;
            isNewHigh = true;
        }

        // Track Bot Duels
        if (!s.botStreaks) s.botStreaks = { current: 0, max: 0, wins: 0, losses: 0 };
        if (isBotGame) {
            if (isWin) {
                s.botStreaks.wins = (s.botStreaks.wins || 0) + 1;
                s.botStreaks.current = (s.botStreaks.current || 0) + 1;
                if (s.botStreaks.current > (s.botStreaks.max || 0)) {
                    s.botStreaks.max = s.botStreaks.current;
                }
            } else {
                s.botStreaks.losses = (s.botStreaks.losses || 0) + 1;
                s.botStreaks.current = 0; // reset active streak on loss
            }
        }

        // Evaluate all medals
        const newlyUnlocked = this.evaluateMedals(s);

        // Save atomically
        this.saveState();

        return {
            isNewHigh,
            score,
            oldHigh,
            bestScore: Math.max(score, oldHigh),
            newlyUnlocked,
            currentBotStreak: s.botStreaks.current,
            maxBotStreak: s.botStreaks.max
        };
    },

    // 3. Evaluate medals criteria
    evaluateMedals: function(s) {
        if (!s.unlockedMedals) s.unlockedMedals = {};
        const newlyUnlocked = [];
        const todayStr = new Date().toISOString().split('T')[0];

        for (const m of this.MEDALS) {
            if (!s.unlockedMedals[m.id]) {
                try {
                    if (m.check(s)) {
                        s.unlockedMedals[m.id] = {
                            unlockedAt: todayStr,
                            tier: m.tier
                        };
                        newlyUnlocked.push(m);

                        // Award bonus XP
                        if (window.app && typeof window.app.addXP === 'function') {
                            window.app.addXP(m.xp);
                        }
                    }
                } catch (e) {
                    console.warn('[TrophyEngine] Error checking medal:', m.id, e);
                }
            }
        }

        // If medals unlocked, celebrate with haptic & sound
        if (newlyUnlocked.length > 0) {
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('fanfare');
            if (typeof confetti === 'function') {
                confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
            }

            // Priority 12.2: Trigger Monty Winner celebration on major Gold / Diamond unlocks
            if (newlyUnlocked.some(m => m.tier === 'diamond' || m.tier === 'gold')) {
                setTimeout(() => {
                    if (typeof MontyWinner !== 'undefined') {
                        MontyWinner.triggerCelebration({
                            title: 'NOVI VELIKI TROFEJ! 🌟',
                            subtitle: 'Čestitamo! Otključao si elitni trofej u Vitrini!',
                            gems: 100,
                            xp: 250
                        });
                    }
                }, 800);
            }
        }

        return newlyUnlocked;
    },

    // 4. Map game titles/functions to canonical keys
    normalizeGameKey: function(name) {
        if (!name) return 'general';
        const str = String(name).toLowerCase();
        if (str.includes('million') || str.includes('milioner')) return 'milioner';
        if (str.includes('typer') || str.includes('kucanje')) return 'speed_typer';
        if (str.includes('match') || str.includes('spojnice')) return 'match_pairs';
        if (str.includes('whack') || str.includes('udari')) return 'whack_a_word';
        if (str.includes('hangman') || str.includes('vešala') || str.includes('vesala')) return 'hangman';
        if (str.includes('scramble') || str.includes('slagalica')) return 'word_scramble';
        if (str.includes('survival') || str.includes('slepi')) return 'audio_survival';
        if (str.includes('snake') || str.includes('zmija')) return 'snake';
        if (str.includes('memory') || str.includes('memorija')) return 'memory_flip';
        if (str.includes('sudden') || str.includes('smrt')) return 'sudden_death';
        if (str.includes('cloze') || str.includes('popuni')) return 'cloze';
        if (str.includes('slang') || str.includes('sleng')) return 'slang';
        return str.replace(/[^a-z0-9]/g, '_');
    },

    // 5. Open Trophy Cabinet Modal
    openCabinetModal: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const existing = document.getElementById('trophy-cabinet-modal');
        if (existing) existing.remove();

        const s = this.getState();
        const unlockedCount = Object.keys(s.unlockedMedals || {}).length;
        const totalCount = this.MEDALS.length;
        const botStreak = s.botStreaks?.current || 0;
        const maxBotStreak = s.botStreaks?.max || 0;

        // Count per tier
        let bronzeCount = 0, silverCount = 0, goldCount = 0, diamondCount = 0;
        for (const m of this.MEDALS) {
            if (s.unlockedMedals?.[m.id]) {
                if (m.tier === 'bronze') bronzeCount++;
                else if (m.tier === 'silver') silverCount++;
                else if (m.tier === 'gold') goldCount++;
                else if (m.tier === 'diamond') diamondCount++;
            }
        }

        const html = `
            <div id="trophy-cabinet-modal" class="fixed inset-0 bg-slate-900/85 backdrop-blur-md z-[130] flex flex-col justify-end sm:justify-center sm:items-center sm:p-4 fade-in">
                <div class="bg-white dark:bg-slate-900 w-full sm:max-w-lg h-[92vh] sm:h-[85vh] sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                    
                    <!-- Header -->
                    <div class="p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10 flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <span class="text-3xl">🏆</span>
                            <div>
                                <h3 class="text-lg font-black text-slate-800 dark:text-white leading-tight">Vitrina sa Trofejima</h3>
                                <p class="text-xs text-slate-500 font-bold">Trophy Cabinet & Game Achievements</p>
                            </div>
                        </div>
                        <button onclick="TrophyEngine.closeCabinetModal()" class="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-transform">✕</button>
                    </div>

                    <!-- Stats Overview Banner -->
                    <div class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800/80 dark:to-amber-950/20 border-b border-amber-200/50 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                        <div class="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-amber-200/60 dark:border-slate-700">
                            <span class="block text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">Trofeji</span>
                            <span class="text-lg font-black text-slate-800 dark:text-white">${unlockedCount}/${totalCount}</span>
                        </div>
                        <div class="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-amber-200/60 dark:border-slate-700">
                            <span class="block text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">Bot Niz</span>
                            <span class="text-lg font-black text-slate-800 dark:text-white">🔥 ${botStreak}</span>
                        </div>
                        <div class="bg-white/80 dark:bg-slate-800/80 p-2.5 rounded-2xl border border-amber-200/60 dark:border-slate-700">
                            <span class="block text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Max Niz</span>
                            <span class="text-lg font-black text-slate-800 dark:text-white">⭐ ${maxBotStreak}</span>
                        </div>
                    </div>

                    <!-- Monty Winner Studio Launcher -->
                    <div class="px-4 py-2.5 bg-gradient-to-r from-yellow-500/15 via-amber-500/20 to-orange-500/15 border-b border-yellow-500/30 flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="text-xl animate-bounce">👑</span>
                            <div class="text-[11px] font-black text-slate-800 dark:text-yellow-200 leading-tight">
                                Monty Winner Studio & Brag Card
                            </div>
                        </div>
                        <button onclick="MontyWinner.triggerCelebration()" class="py-1 px-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-yellow-950 font-black text-[11px] rounded-xl shadow-sm active:scale-95 transition-transform flex items-center gap-1 shrink-0">
                            <span>🏆</span> <span>Otvori Studio</span>
                        </button>
                    </div>

                    <!-- Filter Chips -->
                    <div class="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-slate-50 dark:bg-slate-900/60">
                        <button id="trophy-chip-all" onclick="TrophyEngine.setFilter('all')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-amber-500 text-white shadow-sm active:scale-95">Svi (${unlockedCount})</button>
                        <button id="trophy-chip-bronze" onclick="TrophyEngine.setFilter('bronze')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95">🥉 Bronza (${bronzeCount}/5)</button>
                        <button id="trophy-chip-silver" onclick="TrophyEngine.setFilter('silver')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95">🥈 Srebro (${silverCount}/5)</button>
                        <button id="trophy-chip-gold" onclick="TrophyEngine.setFilter('gold')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95">🥇 Zlato (${goldCount}/5)</button>
                        <button id="trophy-chip-diamond" onclick="TrophyEngine.setFilter('diamond')" class="px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95">💎 Dijamant (${diamondCount}/5)</button>
                    </div>

                    <!-- Medals Shelf Grid -->
                    <div id="trophy-cabinet-list" class="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                        <!-- Rendered by renderMedalsList() -->
                    </div>

                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.renderMedalsList();
    },

    setFilter: function(filter) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        this.activeFilter = filter;

        ['all', 'bronze', 'silver', 'gold', 'diamond'].forEach(f => {
            const btn = document.getElementById(`trophy-chip-${f}`);
            if (btn) {
                if (f === filter) {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-amber-500 text-white shadow-sm active:scale-95';
                } else {
                    btn.className = 'px-3 py-1.5 rounded-xl text-xs font-black transition-all bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 active:scale-95';
                }
            }
        });

        this.renderMedalsList();
    },

    renderMedalsList: function() {
        const listEl = document.getElementById('trophy-cabinet-list');
        if (!listEl) return;

        const s = this.getState();
        const isCyrillic = window.state && window.state.script === 'cyrillic';

        const filtered = this.MEDALS.filter(m => {
            if (this.activeFilter === 'all') return true;
            return m.tier === this.activeFilter;
        });

        let html = '';
        for (const m of filtered) {
            const isUnlocked = !!s.unlockedMedals?.[m.id];
            const unlockedData = s.unlockedMedals?.[m.id];
            const title = isCyrillic ? (window.to_cyrillic ? window.to_cyrillic(m.title_sr) : m.title_sr) : m.title_sr;
            const desc = isCyrillic ? (window.to_cyrillic ? window.to_cyrillic(m.desc_sr) : m.desc_sr) : m.desc_sr;
            const progressStr = m.progress ? m.progress(s) : '';

            if (isUnlocked) {
                html += `
                    <div class="bg-gradient-to-r from-white to-amber-50/50 dark:from-slate-800 dark:to-slate-800/80 p-4 rounded-2xl border-2 border-amber-300/80 dark:border-amber-500/40 shadow-md flex items-center gap-3.5 fade-in">
                        <div class="w-13 h-13 rounded-2xl bg-gradient-to-tr ${m.badgeBg} flex items-center justify-center text-3xl shrink-0 shadow-md shadow-amber-500/20">
                            ${m.icon}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-1">
                                <h4 class="font-black text-sm text-slate-800 dark:text-white truncate">${title}</h4>
                                <span class="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-full font-black shrink-0">
                                    ✅ Otključano
                                </span>
                            </div>
                            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">${desc}</p>
                            <div class="flex items-center gap-2 mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                <span>+${m.xp} XP</span>
                                <span>•</span>
                                <span>${unlockedData.unlockedAt || 'Aktivno'}</span>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                html += `
                    <div class="bg-slate-100/70 dark:bg-slate-800/40 p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700/60 flex items-center gap-3.5 opacity-70">
                        <div class="w-13 h-13 rounded-2xl bg-slate-200 dark:bg-slate-700/60 flex items-center justify-center text-3xl shrink-0 grayscale opacity-40">
                            ${m.icon}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center justify-between gap-1">
                                <h4 class="font-black text-sm text-slate-600 dark:text-slate-400 truncate">${title}</h4>
                                <span class="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold shrink-0">
                                    🔒 Zaključano
                                </span>
                            </div>
                            <p class="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">${desc}</p>
                            <div class="flex items-center justify-between gap-2 mt-2 text-[10px] font-bold text-slate-400">
                                <span>Nagrada: +${m.xp} XP</span>
                                ${progressStr ? `<span class="text-amber-600 dark:text-amber-400 font-black">Napredak: ${progressStr}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        listEl.innerHTML = html;
    },

    closeCabinetModal: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const m = document.getElementById('trophy-cabinet-modal');
        if (m) m.remove();
    },

    // 6. Update Arcade Home Banner with real-time stats
    updateArcadeBanner: function() {
        const s = this.getState();
        const unlockedCount = Object.keys(s.unlockedMedals || {}).length;
        const totalCount = this.MEDALS.length;
        const botStreak = s.botStreaks?.current || 0;

        const countEl = document.getElementById('arcade-trophy-count');
        if (countEl) countEl.textContent = `${unlockedCount}/${totalCount}`;

        const streakEl = document.getElementById('arcade-bot-streak-count');
        if (streakEl) streakEl.textContent = botStreak;
    }
};

window.TrophyEngine = TrophyEngine;
