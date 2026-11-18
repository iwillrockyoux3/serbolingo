// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — Ranked League System, Timed XP Boosts & Profile Locker (Priority 32)
 *
 * Features:
 *  1. Ranked Leagues (Bronzana, Srebrna, Zlatna, Dijamantska, Opsidijanska):
 *     - 30-player weekly cohorts (user + 29 dynamic ghost bot learners)
 *     - Top 10 advance / promote ⬆️, Middle 15 retain ➡️, Bottom 5 demote ⬇️
 *     - Top 3 weekly finishers earn bonus Gems (50, 30, 20)
 *     - Sunday 23:59 / 7-day weekly reset with celebration/demotion modal
 *  2. Timed XP Boosts (Early Bird / Ranoranilac):
 *     - Practice before 09:00 AM grants 15-minute 2x XP boost for evening (18:00 - 23:59)
 *     - Live double XP countdown timer in header & home view
 *  3. Profile Avatars & Titles Locker (In-App Gems Economy):
 *     - Gems (Dijamanti 💎) currency earned from lessons, quests & league podiums
 *     - Unlockable animated avatars with CSS glowing/floating/shimmer effects
 *     - Unlockable titles displayed under user name across profile, leagues & ghost arena
 */

(function () {
    'use strict';

    const LeagueEngine = {
        STORAGE_KEY: 'serbolingo_league',
        MS_IN_DAY: 24 * 60 * 60 * 1000,
        MS_IN_WEEK: 7 * 24 * 60 * 60 * 1000,

        // --- 1. LEAGUE TIERS ---
        TIERS: {
            bronze: {
                id: 'bronze',
                name: 'Bronzana',
                nameEn: 'Bronze',
                icon: '🥉',
                bgGradient: 'from-amber-700 via-amber-800 to-amber-950',
                border: 'border-amber-600',
                accentColor: 'text-amber-400',
                badgeBg: 'bg-amber-900/60 text-amber-300 border-amber-600/50',
                minXp: 20,
                maxXp: 180
            },
            silver: {
                id: 'silver',
                name: 'Srebrna',
                nameEn: 'Silver',
                icon: '🥈',
                bgGradient: 'from-slate-400 via-slate-600 to-slate-800',
                border: 'border-slate-300',
                accentColor: 'text-slate-200',
                badgeBg: 'bg-slate-700/60 text-slate-200 border-slate-400/50',
                minXp: 150,
                maxXp: 450
            },
            gold: {
                id: 'gold',
                name: 'Zlatna',
                nameEn: 'Gold',
                icon: '🥇',
                bgGradient: 'from-yellow-500 via-amber-600 to-amber-900',
                border: 'border-yellow-400',
                accentColor: 'text-yellow-300',
                badgeBg: 'bg-yellow-900/60 text-yellow-300 border-yellow-400/50',
                minXp: 400,
                maxXp: 950
            },
            diamond: {
                id: 'diamond',
                name: 'Dijamantska',
                nameEn: 'Diamond',
                icon: '💎',
                bgGradient: 'from-cyan-500 via-blue-700 to-indigo-950',
                border: 'border-cyan-400',
                accentColor: 'text-cyan-300',
                badgeBg: 'bg-cyan-900/60 text-cyan-300 border-cyan-400/50',
                minXp: 850,
                maxXp: 2000
            },
            obsidian: {
                id: 'obsidian',
                name: 'Opsidijanska',
                nameEn: 'Obsidian',
                icon: '🔮',
                bgGradient: 'from-purple-900 via-fuchsia-950 to-black',
                border: 'border-purple-500',
                accentColor: 'text-purple-300',
                badgeBg: 'bg-purple-950/80 text-purple-200 border-purple-500/50',
                minXp: 1800,
                maxXp: 4500
            }
        },

        TIER_ORDER: ['bronze', 'silver', 'gold', 'diamond', 'obsidian'],

        // --- 2. UNLOCKABLE ANIMATED AVATARS CATALOG ---
        AVATARS_CATALOG: [
            {
                id: 'king',
                icon: '👑',
                animClass: 'avatar-glow-gold',
                name: 'Kralj',
                nameEn: 'King',
                cost: 50,
                desc: 'Zlatna aura pobednika',
                descEn: 'Golden aura of victory'
            },
            {
                id: 'wolf',
                icon: '🐺',
                animClass: 'avatar-pulse-shadow',
                name: 'Balkanski Vuk',
                nameEn: 'Balkan Wolf',
                cost: 75,
                desc: 'Divlji i neustrašivi duh',
                descEn: 'Wild and fearless spirit'
            },
            {
                id: 'eagle',
                icon: '🦅',
                animClass: 'avatar-float-wing',
                name: 'Beli Orao',
                nameEn: 'White Eagle',
                cost: 100,
                desc: 'Ponosno lebdi iznad oblaka',
                descEn: 'Proudly soaring high'
            },
            {
                id: 'tesla',
                icon: '⚡',
                animClass: 'avatar-shimmer-spark',
                name: 'Nikola Tesla',
                nameEn: 'Nikola Tesla',
                cost: 125,
                desc: 'Električna genijalnost učenja',
                descEn: 'Electric genius of learning'
            },
            {
                id: 'wizard',
                icon: '🧙‍♂️',
                animClass: 'avatar-magic-stars',
                name: 'Gramatički Mag',
                nameEn: 'Grammar Wizard',
                cost: 150,
                desc: 'Gospodar svih 7 padeža',
                descEn: 'Master of all 7 cases'
            },
            {
                id: 'cosmonaut',
                icon: '🚀',
                animClass: 'avatar-zero-gravity',
                name: 'Kosmonaut',
                nameEn: 'Cosmonaut',
                cost: 175,
                desc: 'Nulta gravitacija znanja',
                descEn: 'Zero-gravity knowledge'
            },
            {
                id: 'dragon',
                icon: '🐲',
                animClass: 'avatar-flame-ember',
                name: 'Zmaj',
                nameEn: 'Dragon',
                cost: 200,
                desc: 'Vatreni dah drevnih legendi',
                descEn: 'Fire breath of ancient legends'
            },
            {
                id: 'lion',
                icon: '🦁',
                animClass: 'avatar-glow-gold',
                name: 'Lav sa Kalemegdana',
                nameEn: 'Belgrade Fortress Lion',
                cost: 85,
                desc: 'Ponosni čuvar beogradske tvrđave',
                descEn: 'Proud guardian of the Belgrade fortress'
            },
            {
                id: 'bear',
                icon: '🐻',
                animClass: 'avatar-pulse-shadow',
                name: 'Balkanski Medved',
                nameEn: 'Balkan Bear',
                cost: 95,
                desc: 'Moćna snaga planine Tare',
                descEn: 'Mighty strength of Tara mountain'
            },
            {
                id: 'striker',
                icon: '⚽',
                animClass: 'avatar-shimmer-spark',
                name: 'Zlatni Golgeter',
                nameEn: 'Golden Striker',
                cost: 110,
                desc: 'Precizni šut u rašlje znanja',
                descEn: 'Precision shot into the top corner of knowledge'
            },
            {
                id: 'trumpeter',
                icon: '🎺',
                animClass: 'avatar-magic-stars',
                name: 'Trubač iz Guče',
                nameEn: 'Guča Trumpeter',
                cost: 130,
                desc: 'Ritam i duša balkanskog slavlja',
                descEn: 'Rhythm and soul of Balkan celebrations'
            },
            {
                id: 'vampire',
                icon: '🧛',
                animClass: 'avatar-pulse-shadow',
                name: 'Balkanski Vampir',
                nameEn: 'Balkan Vampire',
                cost: 145,
                desc: 'Legenda Save Savanovića i vodenice',
                descEn: 'Legend of Sava Savanović & the watermill'
            },
            {
                id: 'alien',
                icon: '🛸',
                animClass: 'avatar-zero-gravity',
                name: 'Kosmički Poliglota',
                nameEn: 'Cosmic Polyglot',
                cost: 160,
                desc: 'Učenje jezika brzinom svetlosti',
                descEn: 'Language learning at the speed of light'
            },
            {
                id: 'fox',
                icon: '🦊',
                animClass: 'avatar-flame-ember',
                name: 'Lukava Lisica',
                nameEn: 'Clever Fox',
                cost: 120,
                desc: 'Mudrost i snalažljivost u svakom razgovoru',
                descEn: 'Wisdom and cleverness in every conversation'
            }
        ],

        // --- 3. UNLOCKABLE PROFILE TITLES CATALOG ---
        TITLES_CATALOG: [
            {
                id: 'kafana_legend',
                title: 'Kafanska Legenda',
                titleEn: 'Kafana Legend',
                icon: '☕',
                cost: 40,
                textColor: 'text-amber-500 dark:text-amber-400',
                border: 'border-amber-400/40 bg-amber-500/10'
            },
            {
                id: 'grammar_nerd',
                title: 'Gramatički Štreber',
                titleEn: 'Grammar Nerd',
                icon: '🤓',
                cost: 40,
                textColor: 'text-emerald-500 dark:text-emerald-400',
                border: 'border-emerald-400/40 bg-emerald-500/10'
            },
            {
                id: 'rakija_connoisseur',
                title: 'Poznavalac Rakije',
                titleEn: 'Rakija Connoisseur',
                icon: '🥃',
                cost: 50,
                textColor: 'text-orange-500 dark:text-orange-400',
                border: 'border-orange-400/40 bg-orange-500/10'
            },
            {
                id: 'cyrillic_master',
                title: 'Majstor Ćirilice',
                titleEn: 'Cyrillic Master',
                icon: '📜',
                cost: 60,
                textColor: 'text-blue-500 dark:text-blue-400',
                border: 'border-blue-400/40 bg-blue-500/10'
            },
            {
                id: 'case_survivor',
                title: 'Padež Preživljavač',
                titleEn: 'Case Survivor',
                icon: '🛡️',
                cost: 60,
                textColor: 'text-rose-500 dark:text-rose-400',
                border: 'border-rose-400/40 bg-rose-500/10'
            },
            {
                id: 'night_owl',
                title: 'Noćna Ptica',
                titleEn: 'Night Owl',
                icon: '🦉',
                cost: 40,
                textColor: 'text-indigo-400 dark:text-indigo-300',
                border: 'border-indigo-400/40 bg-indigo-500/10'
            },
            {
                id: 'rising_polyglot',
                title: 'Polyglot u Nastajanju',
                titleEn: 'Rising Polyglot',
                icon: '🌍',
                cost: 75,
                textColor: 'text-teal-400 dark:text-teal-300',
                border: 'border-teal-400/40 bg-teal-500/10'
            },
            {
                id: 'obsidian_champ',
                title: 'Obsidian Šampion',
                titleEn: 'Obsidian Champion',
                icon: '🔮',
                cost: 100,
                textColor: 'text-purple-400 dark:text-purple-300',
                border: 'border-purple-400/40 bg-purple-500/10'
            },
            {
                id: 'sabor_king',
                title: 'Kralj Sabora',
                titleEn: 'Festival King',
                icon: '🎺',
                cost: 50,
                textColor: 'text-amber-400 dark:text-amber-300',
                border: 'border-amber-400/40 bg-amber-500/10'
            },
            {
                id: 'derby_fan',
                title: 'Derbi Fanatik',
                titleEn: 'Derby Fanatic',
                icon: '⚽',
                cost: 50,
                textColor: 'text-rose-500 dark:text-rose-400',
                border: 'border-rose-400/40 bg-rose-500/10'
            },
            {
                id: 'barista',
                title: 'Kafedžija',
                titleEn: 'Master Barista',
                icon: '🫖',
                cost: 45,
                textColor: 'text-yellow-600 dark:text-yellow-500',
                border: 'border-yellow-500/40 bg-yellow-500/10'
            },
            {
                id: 'balkan_boss',
                title: 'Balkanski Šef',
                titleEn: 'The Balkan Boss',
                icon: '👑',
                cost: 90,
                textColor: 'text-amber-300 dark:text-amber-200',
                border: 'border-amber-300/50 bg-amber-500/15'
            },
            {
                id: 'fast_fingers',
                title: 'Brzi Prsti',
                titleEn: 'Fast Fingers',
                icon: '⚡',
                cost: 55,
                textColor: 'text-cyan-400 dark:text-cyan-300',
                border: 'border-cyan-400/40 bg-cyan-500/10'
            },
            {
                id: 'walking_dict',
                title: 'Hodajući Rečnik',
                titleEn: 'Walking Dictionary',
                icon: '🧠',
                cost: 80,
                textColor: 'text-purple-400 dark:text-purple-300',
                border: 'border-purple-400/40 bg-purple-500/10'
            },
            {
                id: 'case_sniper',
                title: 'Snajperista Padeža',
                titleEn: 'Case Sniper',
                icon: '🎯',
                cost: 70,
                textColor: 'text-emerald-400 dark:text-emerald-300',
                border: 'border-emerald-400/40 bg-emerald-500/10'
            },
            {
                id: 'serbolingo_star',
                title: 'SerboLingo Zvezda',
                titleEn: 'SerboLingo Star',
                icon: '🌟',
                cost: 100,
                textColor: 'text-yellow-300 dark:text-yellow-200',
                border: 'border-yellow-400/50 bg-yellow-400/15'
            }
        ],

        // 40+ realistic learner bot profiles
        BOT_NAMES: [
            'Nikola B.', 'Jelena M.', 'Stefan K.', 'Milica P.', 'Marko D.',
            'Ana V.', 'Dušan S.', 'Teodora J.', 'Luka T.', 'Jovana R.',
            'Miloš N.', 'Sara I.', 'Vuk O.', 'Katarina L.', 'Nemanja G.',
            'Dunja B.', 'Filip Z.', 'Marija C.', 'Ognjen V.', 'Sofija M.',
            'Bogdan E.', 'Anja K.', 'Mihailo S.', 'Elena T.', 'Danilo P.',
            'Tara J.', 'Strahinja D.', 'Mina R.', 'Uroš B.', 'Iva N.',
            'David H.', 'Emma W.', 'Lucas M.', 'Sophie C.', 'Liam D.',
            'Oliver S.', 'Chloe T.', 'Noah W.', 'Mia B.', 'Alex J.'
        ],

        BOT_AVATARS: ['🦊', '🦁', '🦉', '🐱', '🐼', '🐨', '🐯', '🐸', '🐵', '🦄', '🐝', '🐧', '🐻', '🐺', '🐰', '🐙', '🦅', '🐬', '🦔', '🐲'],

        // --- 4. DATA INITIALIZATION & LOCAL STORAGE ---
        getLeagueData: function () {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed && parsed.tier && parsed.bots && parsed.bots.length === 29) {
                        return parsed;
                    }
                }
            } catch (e) {}

            // Seed fresh initial league cohort
            const newCohort = this.generateNewCohort('bronze');
            this.saveLeagueData(newCohort);
            return newCohort;
        },

        saveLeagueData: function (data) {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            } catch (e) {}
        },

        generateNewCohort: function (tierId) {
            const validTier = this.TIERS[tierId] ? tierId : 'bronze';
            const tierConfig = this.TIERS[validTier];

            // Calculate next Sunday 23:59:59
            const now = new Date();
            const daysUntilSunday = (7 - now.getDay()) % 7;
            const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilSunday, 23, 59, 59, 999);
            // If today is Sunday evening, roll to next Sunday
            let weekEndDate = sunday.getTime();
            if (weekEndDate - now.getTime() < 4 * 60 * 60 * 1000) {
                weekEndDate += this.MS_IN_WEEK;
            }

            // Shuffle and pick 29 distinct bot names
            const shuffledNames = [...this.BOT_NAMES].sort(() => Math.random() - 0.5).slice(0, 29);
            const bots = [];

            const minXp = tierConfig.minXp;
            const maxXp = tierConfig.maxXp;
            const range = maxXp - minXp;

            for (let i = 0; i < 29; i++) {
                const name = shuffledNames[i] || `Learner ${i + 1}`;
                const avatar = this.BOT_AVATARS[Math.floor(Math.random() * this.BOT_AVATARS.length)];
                
                // Realistic tiered distribution (some grinders at top, bell curve in middle)
                const rankFactor = 1 - (i / 29);
                const randomVariance = (Math.random() * 0.3) - 0.15;
                const scoreFactor = Math.max(0.05, Math.min(1.1, rankFactor + randomVariance));
                const xp = Math.round(minXp + (range * scoreFactor));

                // Occasional bot titles
                let title = null;
                if (Math.random() < 0.4) {
                    const t = this.TITLES_CATALOG[Math.floor(Math.random() * this.TITLES_CATALOG.length)];
                    title = t.title;
                }

                bots.push({
                    id: `bot_${i}_${Date.now()}`,
                    name: name,
                    avatar: avatar,
                    title: title,
                    xp: xp,
                    rate: Math.random() * 12 + 4 // Dynamic growth rate per day
                });
            }

            // Sort bots initially descending by XP
            bots.sort((a, b) => b.xp - a.xp);

            return {
                tier: validTier,
                weekStartDate: now.getTime(),
                weekEndDate: weekEndDate,
                userWeeklyXp: 0,
                bots: bots,
                lastCheckedTime: now.getTime()
            };
        },

        // --- 5. PROGRESSION & GHOST BOT SIMULATION ---
        syncLeagueProgress: function () {
            const data = this.getLeagueData();
            const now = Date.now();

            // 1. Check if week has expired -> trigger weekly evaluation!
            if (now >= data.weekEndDate) {
                this._evaluateWeekEnd(data);
                return;
            }

            // 2. Simulate realistic minor bot progression based on elapsed time (up to 4 times a day)
            const hoursSinceLast = (now - (data.lastCheckedTime || data.weekStartDate)) / (1000 * 60 * 60);
            if (hoursSinceLast > 2) {
                const step = Math.min(hoursSinceLast, 24);
                data.bots.forEach(bot => {
                    if (Math.random() < 0.65) {
                        const gain = Math.round(bot.rate * (step / 6) * (Math.random() * 0.8 + 0.6));
                        bot.xp += gain;
                    }
                });
                data.lastCheckedTime = now;
                this.saveLeagueData(data);
            }
        },

        // Award XP to the user's weekly league score
        recordUserXp: function (xpAmount) {
            if (!xpAmount || xpAmount <= 0) return;
            const data = this.getLeagueData();
            data.userWeeklyXp = (data.userWeeklyXp || 0) + xpAmount;
            this.saveLeagueData(data);
            this.renderStatsCard();
        },

        // Evaluate week end: Promotion, Demotion, Gems, and Reset
        _evaluateWeekEnd: function (data) {
            const leaderboard = this.getLeaderboard();
            const userIndex = leaderboard.findIndex(p => p.isUser);
            const userRank = userIndex !== -1 ? userIndex + 1 : 15;

            const currentTier = data.tier || 'bronze';
            const tierIdx = this.TIER_ORDER.indexOf(currentTier);

            let outcome = 'retained'; // 'promoted', 'demoted', 'retained', 'champion'
            let newTier = currentTier;
            let gemsEarned = 0;

            // Top 3 Podium Gems
            if (userRank === 1) gemsEarned = 50;
            else if (userRank === 2) gemsEarned = 30;
            else if (userRank === 3) gemsEarned = 20;

            if (userRank <= 10) {
                // Top 10 = Promotion Zone
                if (tierIdx < this.TIER_ORDER.length - 1) {
                    newTier = this.TIER_ORDER[tierIdx + 1];
                    outcome = 'promoted';
                } else {
                    outcome = 'champion'; // Obsidian champions stay in Obsidian with glory
                }
            } else if (userRank >= 26) {
                // Bottom 5 = Demotion Zone
                if (tierIdx > 0) {
                    newTier = this.TIER_ORDER[tierIdx - 1];
                    outcome = 'demoted';
                } else {
                    outcome = 'retained'; // Bronze can't demote
                }
            } else {
                outcome = 'retained';
            }

            // Award podium gems to user state if applicable
            if (gemsEarned > 0) {
                this.addGems(gemsEarned, `Top 3 League Podium (#${userRank})`);
            }

            // Store results to display celebration/demotion modal on next view
            const resultSummary = {
                prevTier: currentTier,
                newTier: newTier,
                userRank: userRank,
                outcome: outcome,
                gemsEarned: gemsEarned,
                finalXp: data.userWeeklyXp || 0,
                timestamp: Date.now()
            };

            // Seed fresh cohort with newTier
            const newCohort = this.generateNewCohort(newTier);
            this.saveLeagueData(newCohort);

            // Trigger Results Modal
            this.showResultsModal(resultSummary);
        },

        // --- 6. LEADERBOARD COMPILATION ---
        getLeaderboard: function () {
            const data = this.getLeagueData();
            const appState = window.appState || window.state || {};
            const userName = (appState.user && appState.user.name && appState.user.name !== 'GUEST_USER')
                ? appState.user.name
                : 'Ti (Korisnik)';
            const userAvatar = (appState.user && appState.user.avatar) ? appState.user.avatar : '👤';
            const userTitle = appState.equippedTitle || null;

            // Build full list of 30
            const fullList = [
                ...data.bots.map(b => ({ ...b, isUser: false })),
                {
                    id: 'user_player',
                    name: userName,
                    avatar: userAvatar,
                    title: userTitle,
                    xp: data.userWeeklyXp || 0,
                    isUser: true
                }
            ];

            // Sort strictly descending by XP
            fullList.sort((a, b) => b.xp - a.xp);

            return fullList;
        },

        // --- 7. TIMED XP BOOSTS (EARLY BIRD / RANORANILAC) ---
        // Checks if current time is before 09:00 AM
        isMorningEarlyBirdTime: function () {
            const now = new Date();
            const hour = now.getHours();
            return hour < 9;
        },

        // Checks if current time is between 18:00 (6 PM) and 23:59
        isEveningClaimTime: function () {
            const now = new Date();
            const hour = now.getHours();
            return hour >= 18 && hour <= 23;
        },

        // Called when a user completes a lesson/quiz in app.js
        checkEarlyBirdOnLessonComplete: function () {
            const today = new Date().toISOString().split('T')[0];
            const appState = window.appState || window.state;
            if (!appState) return;

            if (this.isMorningEarlyBirdTime()) {
                if (appState.earlyBirdEarnedDate !== today) {
                    appState.earlyBirdEarnedDate = today;
                    appState.earlyBirdClaimAvailable = true;
                    if (window.app && window.app.saveStats) window.app.saveStats();
                    if (window.app && window.app.showToast) {
                        window.app.showToast('🌅 Ranoranilac aktiviran! Večeras od 18:00 te čeka 15 min 2x XP!', 'success');
                    }
                    if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
                    this.renderHomeBanner();
                }
            }
        },

        // Claim and activate the 15-minute 2x XP boost
        claimEarlyBirdBoost: function () {
            const appState = window.appState || window.state;
            const today = new Date().toISOString().split('T')[0];
            if (!appState) return;

            if (!appState.earlyBirdClaimAvailable || appState.earlyBirdEarnedDate !== today) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('🌅 Ranoranilac nije spreman za preuzimanje.', 'info');
                }
                return;
            }

            if (!this.isEveningClaimTime()) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('🌅 Ranoranilac se otključava večeras u 18:00!', 'info');
                }
                return;
            }

            // Activate 15 minutes of double XP in ShopEngine
            const boostMs = 15 * 60 * 1000;
            if (window.ShopEngine) {
                const shopData = window.ShopEngine.getShopData();
                shopData.doubleXpUntil = Math.max(shopData.doubleXpUntil || 0, Date.now()) + boostMs;
                window.ShopEngine.saveShopData(shopData);
            }

            appState.earlyBirdClaimAvailable = false;
            appState.earlyBirdClaimedDate = today;
            if (window.app && window.app.saveStats) window.app.saveStats();

            if (window.app && window.app.showToast) {
                window.app.showToast('⚡ 15 Minuta Dupli XP je AKTIVIRAN! Svaka tačna donosi 20 XP!', 'success');
            }
            if (window.app && window.app.fireConfetti) window.app.fireConfetti();
            if (window.TouchHaptics) TouchHaptics.vibrate('shop');

            this.renderHomeBanner();
            this.updateHeaderBoostUI();
        },

        // --- 8. GEMS CURRENCY & LOCKER INVENTORY ---
        getUserGems: function () {
            const appState = window.appState || window.state;
            if (appState && typeof appState.gems === 'number') {
                return appState.gems;
            }
            return 50; // Starter gift
        },

        addGems: function (amount, reason) {
            const appState = window.appState || window.state;
            if (!appState) return;
            if (typeof appState.gems !== 'number') appState.gems = 50;
            appState.gems += amount;

            if (window.app && window.app.saveStats) window.app.saveStats();
            this.updateGemsHeaderUI();

            if (window.app && window.app.showToast) {
                window.app.showToast(`💎 +${amount} Dijamanata! (${reason || 'Nagrada'})`, 'success');
            }
        },

        spendGems: function (amount, reason) {
            const appState = window.appState || window.state;
            if (!appState) return false;
            if (typeof appState.gems !== 'number') appState.gems = 50;
            if (appState.gems < amount) return false;
            appState.gems -= amount;

            if (window.app && window.app.saveStats) window.app.saveStats();
            this.updateGemsHeaderUI();

            if (window.app && window.app.showToast) {
                window.app.showToast(`💎 -${amount} Dijamanata (${reason || 'Potrošeno'})`, 'info');
            }
            return true;
        },

        updateGemsHeaderUI: function () {
            const el = document.getElementById('gems-display');
            if (el) {
                el.textContent = this.getUserGems().toLocaleString();
            }
        },

        updateHeaderBoostUI: function () {
            const headerContainer = document.getElementById('header-xp-boost-container');
            const boostCountEl = document.getElementById('header-xp-boost-count');
            if (!headerContainer || !boostCountEl) return;

            const isDoubleActive = window.ShopEngine && window.ShopEngine.isDoubleXpActive();
            if (isDoubleActive) {
                const shopData = window.ShopEngine.getShopData();
                const remainingSecs = Math.max(0, Math.round((shopData.doubleXpUntil - Date.now()) / 1000));
                const mins = Math.floor(remainingSecs / 60);
                const secs = (remainingSecs % 60).toString().padStart(2, '0');
                boostCountEl.textContent = `2x (${mins}:${secs})`;
                headerContainer.classList.remove('bg-yellow-400', 'text-yellow-900');
                headerContainer.classList.add('bg-gradient-to-r', 'from-amber-500', 'to-orange-500', 'text-white', 'animate-pulse');
            } else {
                const appState = window.appState || window.state;
                const arcadeBoosts = (appState && appState.inventory && appState.inventory.xpBoosts) || 0;
                boostCountEl.textContent = arcadeBoosts;
                headerContainer.classList.remove('bg-gradient-to-r', 'from-amber-500', 'to-orange-500', 'text-white', 'animate-pulse');
                headerContainer.classList.add('bg-yellow-400', 'text-yellow-900');
            }
        },

        // Purchase & Equip Avatar
        buyAvatar: function (avatarId) {
            const avatar = this.AVATARS_CATALOG.find(a => a.id === avatarId);
            if (!avatar) return;

            const appState = window.appState || window.state;
            if (!appState) return;
            if (!appState.unlockedAvatars) appState.unlockedAvatars = [];

            if (appState.unlockedAvatars.includes(avatarId)) {
                this.equipAvatar(avatarId);
                return;
            }

            const gems = this.getUserGems();
            if (gems < avatar.cost) {
                if (window.app && window.app.showToast) {
                    window.app.showToast(`💎 Nedovoljno dijamanata! Potrebno: ${avatar.cost} 💎 (Imaš: ${gems})`, 'error');
                }
                return;
            }

            // Deduct gems and unlock
            appState.gems -= avatar.cost;
            appState.unlockedAvatars.push(avatarId);
            this.equipAvatar(avatarId);

            if (window.app && window.app.saveStats) window.app.saveStats();
            if (window.app && window.app.showToast) {
                window.app.showToast(`✨ Otključan avatar: ${avatar.icon} ${avatar.name}!`, 'success');
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('shop');
            if (window.app && window.app.fireConfetti) window.app.fireConfetti();

            this.updateGemsHeaderUI();
            this.renderLockerModal();
        },

        equipAvatar: function (avatarId) {
            const avatar = this.AVATARS_CATALOG.find(a => a.id === avatarId);
            if (!avatar) return;

            const appState = window.appState || window.state;
            if (!appState) return;

            if (appState.user) {
                appState.user.avatar = avatar.icon;
                appState.equippedAvatarAnim = avatar.animClass;
                localStorage.setItem('serbolingo_auth', JSON.stringify(appState.user));
            }

            if (window.app && window.app.saveStats) window.app.saveStats();
            if (window.app && window.app.updateProfileUI) window.app.updateProfileUI();
            this.renderLockerModal();
            this.renderStatsCard();
        },

        // Purchase & Equip Title
        buyTitle: function (titleId) {
            const titleObj = this.TITLES_CATALOG.find(t => t.id === titleId);
            if (!titleObj) return;

            const appState = window.appState || window.state;
            if (!appState) return;
            if (!appState.unlockedTitles) appState.unlockedTitles = [];

            if (appState.unlockedTitles.includes(titleId)) {
                this.equipTitle(titleId);
                return;
            }

            const gems = this.getUserGems();
            if (gems < titleObj.cost) {
                if (window.app && window.app.showToast) {
                    window.app.showToast(`💎 Nedovoljno dijamanata! Potrebno: ${titleObj.cost} 💎 (Imaš: ${gems})`, 'error');
                }
                return;
            }

            // Deduct gems and unlock
            appState.gems -= titleObj.cost;
            appState.unlockedTitles.push(titleId);
            this.equipTitle(titleId);

            if (window.app && window.app.saveStats) window.app.saveStats();
            if (window.app && window.app.showToast) {
                window.app.showToast(`🏷️ Otključana titula: "${titleObj.title}"!`, 'success');
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('shop');

            this.updateGemsHeaderUI();
            this.renderLockerModal();
        },

        equipTitle: function (titleId) {
            const titleObj = this.TITLES_CATALOG.find(t => t.id === titleId);
            if (!titleObj) return;

            const appState = window.appState || window.state;
            if (!appState) return;

            appState.equippedTitle = titleObj.title;
            appState.equippedTitleId = titleObj.id;

            if (window.app && window.app.saveStats) window.app.saveStats();
            if (window.app && window.app.updateProfileUI) window.app.updateProfileUI();
            this.renderLockerModal();
            this.renderStatsCard();
        },

        unequipTitle: function () {
            const appState = window.appState || window.state;
            if (!appState) return;
            appState.equippedTitle = null;
            appState.equippedTitleId = null;
            if (window.app && window.app.saveStats) window.app.saveStats();
            if (window.app && window.app.updateProfileUI) window.app.updateProfileUI();
            this.renderLockerModal();
            this.renderStatsCard();
        },

        // --- 9. UI RENDERING: HOME BANNER & STATS CARD ---
        // Renders Early Bird Status on Home Screen
        renderHomeBanner: function () {
            const container = document.getElementById('early-bird-home-banner');
            if (!container) return;

            const appState = window.appState || window.state || {};
            const today = new Date().toISOString().split('T')[0];
            const isDoubleActive = window.ShopEngine && window.ShopEngine.isDoubleXpActive();

            if (isDoubleActive) {
                const shopData = window.ShopEngine.getShopData();
                const mins = Math.max(1, Math.round((shopData.doubleXpUntil - Date.now()) / 60000));
                container.innerHTML = `
                <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-3.5 rounded-2xl text-white shadow-md flex items-center justify-between gap-3 animate-pulse">
                    <div class="flex items-center gap-2.5">
                        <span class="text-2xl">⚡</span>
                        <div>
                            <div class="text-xs font-black uppercase tracking-wider">DUPLI XP JE AKTIVAN!</div>
                            <div class="text-[10px] font-bold text-amber-100">Još ${mins} min • Svaka lekcija vredi 20 XP!</div>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-black">2x XP</span>
                </div>`;
                return;
            }

            const earnedToday = appState.earlyBirdEarnedDate === today && appState.earlyBirdClaimAvailable;
            const eveningNow = this.isEveningClaimTime();

            if (earnedToday && eveningNow) {
                // Claimable now!
                container.innerHTML = `
                <div class="bg-gradient-to-r from-indigo-900 to-purple-900 border-2 border-indigo-500/50 p-3.5 rounded-2xl text-white shadow-lg flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <span class="text-2xl shrink-0">🌅</span>
                        <div class="min-w-0">
                            <div class="text-xs font-black text-amber-300 truncate">Ranoranilac Bonus je Spreman!</div>
                            <div class="text-[10px] font-bold text-slate-300 truncate">Iskoristi svojih 15 minuta 2x XP!</div>
                        </div>
                    </div>
                    <button onclick="LeagueEngine.claimEarlyBirdBoost()" class="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-900 font-black text-xs rounded-xl active:scale-95 transition-transform shadow-md shrink-0">
                        Aktiviraj! ⚡
                    </button>
                </div>`;
            } else if (earnedToday && !eveningNow) {
                // Earned in morning, waiting for 18:00
                container.innerHTML = `
                <div class="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl text-white flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                        <span class="text-xl">🌅</span>
                        <div>
                            <div class="text-xs font-black text-emerald-400">Ranoranilac Otključan!</div>
                            <div class="text-[10px] font-bold text-slate-400">Vrati se večeras od 18:00 za 15 min 2x XP.</div>
                        </div>
                    </div>
                    <span class="text-xs font-black text-slate-400 bg-slate-700/60 px-2 py-1 rounded-lg">18:00 🔒</span>
                </div>`;
            } else if (this.isMorningEarlyBirdTime()) {
                // Morning prompt
                container.innerHTML = `
                <div class="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 p-3 rounded-2xl text-slate-800 dark:text-white flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5">
                        <span class="text-xl">🌅</span>
                        <div>
                            <div class="text-xs font-black text-amber-700 dark:text-amber-300">Jutarnji Ranoranilac Izazov</div>
                            <div class="text-[10px] font-bold text-slate-500 dark:text-slate-400">Završi lekciju pre 09:00 za večernji 2x XP!</div>
                        </div>
                    </div>
                    <span class="text-xs font-black text-amber-500">Do 09:00</span>
                </div>`;
            } else {
                container.innerHTML = '';
            }
        },

        // Renders Ranked League card in view-stats
        renderStatsCard: function () {
            const container = document.getElementById('league-stats-card-container');
            if (!container) return;

            this.syncLeagueProgress();
            const data = this.getLeagueData();
            const tier = this.TIERS[data.tier] || this.TIERS.bronze;
            const leaderboard = this.getLeaderboard();
            const userIndex = leaderboard.findIndex(p => p.isUser);
            const userRank = userIndex !== -1 ? userIndex + 1 : 15;

            // Determine zone status
            let zoneBadge = '';
            let zoneText = '';
            if (userRank <= 10) {
                zoneBadge = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
                zoneText = '🟢 Zona za Napredovanje (Top 10)';
            } else if (userRank >= 26) {
                zoneBadge = 'bg-rose-500/20 text-rose-400 border border-rose-500/40';
                zoneText = '🔴 Zona za Ispadanje (Dno 5)';
            } else {
                zoneBadge = 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
                zoneText = '⚪ Sigurna Zona (11-25)';
            }

            // Remaining time calculation
            const remainingMs = Math.max(0, data.weekEndDate - Date.now());
            const daysLeft = Math.floor(remainingMs / this.MS_IN_DAY);
            const hoursLeft = Math.floor((remainingMs % this.MS_IN_DAY) / (1000 * 60 * 60));
            const timeString = `${daysLeft}d ${hoursLeft}h`;

            container.innerHTML = `
            <div class="bg-gradient-to-br ${tier.bgGradient} p-5 rounded-3xl border-2 ${tier.border} shadow-xl text-white relative overflow-hidden">
                <!-- Background ambient glow -->
                <div class="absolute -right-8 -bottom-8 text-8xl opacity-15 pointer-events-none select-none">${tier.icon}</div>

                <div class="flex justify-between items-start mb-3 relative z-10">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl filter drop-shadow-md">${tier.icon}</span>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-lg font-black tracking-tight text-white">${tier.name} Liga</h3>
                                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${tier.badgeBg} border">30 Igrača</span>
                            </div>
                            <p class="text-[11px] font-bold text-slate-300">Nedeljno rangiranje</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Završava se za</span>
                        <span class="text-xs font-black text-amber-300">⏳ ${timeString}</span>
                    </div>
                </div>

                <!-- User rank and points -->
                <div class="bg-black/30 backdrop-blur-sm rounded-2xl p-3 mb-3.5 flex items-center justify-between border border-white/10 relative z-10">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-base text-yellow-300 border border-white/15">
                            #${userRank}
                        </div>
                        <div>
                            <div class="text-xs font-black text-white">Tvoj trenutni rang</div>
                            <div class="text-[10px] font-bold ${zoneBadge.includes('emerald') ? 'text-emerald-300' : (zoneBadge.includes('rose') ? 'text-rose-300' : 'text-slate-300')}">
                                ${zoneText}
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-black text-blue-300">⚡ ${data.userWeeklyXp || 0} XP</span>
                        <span class="text-[9px] font-bold text-slate-400 block">ove nedelje</span>
                    </div>
                </div>

                <!-- Action Button -->
                <button onclick="LeagueEngine.openLeagueModal()" class="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-98 transition-transform flex items-center justify-center gap-2 relative z-10">
                    <span>🏆</span> <span>Prikaži Celu Tabelu (30)</span>
                </button>
            </div>`;
        },

        // --- 10. LEAGUE LEADERBOARD MODAL ---
        openLeagueModal: function () {
            this.syncLeagueProgress();
            const modal = document.getElementById('league-modal');
            if (!modal) return;
            this.renderLeaderboardModal();
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeLeagueModal: function () {
            const modal = document.getElementById('league-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        renderLeaderboardModal: function () {
            const data = this.getLeagueData();
            const tier = this.TIERS[data.tier] || this.TIERS.bronze;
            const leaderboard = this.getLeaderboard();

            // Header elements
            const tierTitle = document.getElementById('league-modal-tier-title');
            const tierIcon = document.getElementById('league-modal-tier-icon');
            const timerEl = document.getElementById('league-modal-timer');
            const listEl = document.getElementById('league-leaderboard-list');

            if (tierTitle) tierTitle.textContent = `${tier.name} Liga`;
            if (tierIcon) tierIcon.textContent = tier.icon;

            const remainingMs = Math.max(0, data.weekEndDate - Date.now());
            const daysLeft = Math.floor(remainingMs / this.MS_IN_DAY);
            const hoursLeft = Math.floor((remainingMs % this.MS_IN_DAY) / (1000 * 60 * 60));
            if (timerEl) timerEl.textContent = `⏳ ${daysLeft}d ${hoursLeft}h do kraja nedelje`;

            if (!listEl) return;

            listEl.innerHTML = leaderboard.map((player, index) => {
                const rank = index + 1;
                const isUser = player.isUser;

                // Zone indicators
                let rowBg = 'bg-slate-800/80 border-slate-700/60';
                let rankBadge = `<span class="w-7 text-center font-black text-sm text-slate-400">#${rank}</span>`;

                if (rank === 1) {
                    rankBadge = `<span class="w-7 text-center text-lg">🥇</span>`;
                    rowBg = 'bg-yellow-950/30 border-yellow-500/40 shadow-sm';
                } else if (rank === 2) {
                    rankBadge = `<span class="w-7 text-center text-lg">🥈</span>`;
                    rowBg = 'bg-slate-700/40 border-slate-400/40 shadow-sm';
                } else if (rank === 3) {
                    rankBadge = `<span class="w-7 text-center text-lg">🥉</span>`;
                    rowBg = 'bg-amber-950/30 border-amber-600/40 shadow-sm';
                }

                if (isUser) {
                    rowBg = 'bg-blue-600/20 border-blue-400 ring-2 ring-blue-500/50';
                }

                const titleHtml = player.title ? `<span class="text-[9px] font-black text-amber-400 block truncate">${player.title}</span>` : '';

                let dividerHtml = '';
                if (rank === 10) {
                    dividerHtml = `
                    <div class="my-2 py-1 px-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-center">
                        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">⬆️ Zona Napredovanja (Top 10 ide u sledeću ligu)</span>
                    </div>`;
                } else if (rank === 25) {
                    dividerHtml = `
                    <div class="my-2 py-1 px-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-center">
                        <span class="text-[10px] font-black text-rose-400 uppercase tracking-widest">⬇️ Zona Ispadanja (Dno 5 prelazi u nižu ligu)</span>
                    </div>`;
                }

                return `
                <div ${isUser ? 'id="league-user-row"' : ''} class="flex items-center justify-between p-3 rounded-2xl border ${rowBg} transition-all">
                    <div class="flex items-center gap-3 min-w-0">
                        ${rankBadge}
                        <span class="text-2xl shrink-0">${player.avatar}</span>
                        <div class="min-w-0">
                            <div class="text-xs font-black ${isUser ? 'text-blue-400' : 'text-white'} truncate flex items-center gap-1.5">
                                <span>${player.name}</span>
                                ${isUser ? '<span class="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">Ti</span>' : ''}
                                ${rank === 1 ? '<button onclick="MontyWinner.triggerCelebration()" class="text-[9px] bg-gradient-to-r from-yellow-400 to-amber-500 text-yellow-950 font-black px-1.5 py-0.5 rounded-full cursor-pointer hover:scale-105 transition-transform flex items-center gap-0.5 shadow-sm" title="Pogledaj Monty Winner Studio"><span>👑</span><span>MONTY</span></button>' : ''}
                            </div>
                            ${titleHtml}
                        </div>
                    </div>
                    <div class="text-right shrink-0">
                        <span class="text-xs font-black text-amber-300">⚡ ${player.xp} XP</span>
                    </div>
                </div>
                ${dividerHtml}`;
            }).join('');

            // Render persistent user summary dock (Priority 32 Revisit)
            const userDockEl = document.getElementById('league-user-dock');
            const userIndex = leaderboard.findIndex(p => p.isUser);
            if (userDockEl && userIndex !== -1) {
                const userPlayer = leaderboard[userIndex];
                const userRank = userIndex + 1;

                let userRankBadge = `<span class="w-7 text-center font-black text-sm text-blue-400">#${userRank}</span>`;
                if (userRank === 1) userRankBadge = `<span class="w-7 text-center text-lg">🥇</span>`;
                else if (userRank === 2) userRankBadge = `<span class="w-7 text-center text-lg">🥈</span>`;
                else if (userRank === 3) userRankBadge = `<span class="w-7 text-center text-lg">🥉</span>`;

                let zonePill = '';
                if (userRank <= 10) {
                    zonePill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">🟢 Napreduje</span>';
                } else if (userRank > 25) {
                    zonePill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">🔴 Ispada</span>';
                } else {
                    zonePill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-700/60 text-slate-300 border border-slate-600/40">⚪ Ostaje</span>';
                }

                userDockEl.innerHTML = `
                <div class="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/50 shadow-lg">
                    <div class="flex items-center gap-2.5 min-w-0">
                        ${userRankBadge}
                        <span class="text-2xl shrink-0">${userPlayer.avatar || '👤'}</span>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5">
                                <span class="text-xs font-black text-white truncate">${userPlayer.name}</span>
                                <span class="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">Ti</span>
                            </div>
                            <div class="flex items-center gap-2 mt-0.5">
                                ${zonePill}
                                <span class="text-[10px] font-bold text-amber-300">⚡ ${userPlayer.xp} XP</span>
                            </div>
                        </div>
                    </div>
                    <button onclick="LeagueEngine.scrollToUserRank()" class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-[11px] font-black rounded-xl transition-transform shrink-0 flex items-center gap-1 shadow-sm">
                        <span>📍</span>
                        <span>Moj Rang</span>
                    </button>
                </div>`;
            }
        },

        // Scroll to user rank row inside leaderboard list with highlight animation
        scrollToUserRank: function () {
            const row = document.getElementById('league-user-row');
            if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                row.classList.add('ring-4', 'ring-yellow-400', 'bg-blue-600/40');
                setTimeout(() => {
                    row.classList.remove('ring-4', 'ring-yellow-400', 'bg-blue-600/40');
                }, 1500);
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- 11. WEEKLY RESULTS CELEBRATION MODAL ---
        showResultsModal: function (summary) {
            const modal = document.getElementById('league-results-modal');
            if (!modal) return;

            const iconEl = document.getElementById('league-results-icon');
            const titleEl = document.getElementById('league-results-title');
            const subtitleEl = document.getElementById('league-results-subtitle');
            const detailsEl = document.getElementById('league-results-details');

            const prevTierObj = this.TIERS[summary.prevTier] || this.TIERS.bronze;
            const newTierObj = this.TIERS[summary.newTier] || this.TIERS.bronze;

            if (summary.outcome === 'promoted') {
                if (iconEl) iconEl.textContent = '🎉';
                if (titleEl) titleEl.textContent = 'ČESTITAMO! NAPREDOVANJE!';
                if (subtitleEl) subtitleEl.textContent = `Završio si na #${summary.userRank} mestu sa ${summary.finalXp} XP i prelaziš u ${newTierObj.name} Ligu!`;
            } else if (summary.outcome === 'champion') {
                if (iconEl) iconEl.textContent = '👑';
                if (titleEl) titleEl.textContent = 'OPSIDIJAN ŠAMPION!';
                if (subtitleEl) subtitleEl.textContent = `Završio si na #${summary.userRank} mestu među najboljima!`;
            } else if (summary.outcome === 'demoted') {
                if (iconEl) iconEl.textContent = '🛡️';
                if (titleEl) titleEl.textContent = 'RELEGACIJA U NIŽU LIGU';
                if (subtitleEl) subtitleEl.textContent = `Završio si na #${summary.userRank} mestu. Sledeće nedelje igraš u ${newTierObj.name} Ligi. Možeš ti to!`;
            } else {
                if (iconEl) iconEl.textContent = '✅';
                if (titleEl) titleEl.textContent = 'ZADRŽAN STATUS!';
                if (subtitleEl) subtitleEl.textContent = `Završio si na #${summary.userRank} mestu i ostaješ u ${newTierObj.name} Ligi.`;
            }

            if (detailsEl) {
                let rewardText = '';
                if (summary.gemsEarned > 0) {
                    rewardText = `<div class="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-2xl text-center text-xs font-black text-cyan-300">💎 Osvojio si +${summary.gemsEarned} Dijamanata za Top 3 Podijum!</div>`;
                }
                detailsEl.innerHTML = rewardText;
            }

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');

            if (summary.outcome === 'promoted' || summary.outcome === 'champion') {
                if (window.app && window.app.fireConfetti) window.app.fireConfetti();
                if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
                if (summary.userRank === 1 && typeof MontyWinner !== 'undefined') {
                    setTimeout(() => {
                        MontyWinner.triggerCelebration({
                            title: 'POBEDNIK LIGE! 🥇',
                            subtitle: `Osvojio si 1. mesto i postao zvanični Monty Winner!`,
                            gems: 100,
                            xp: 250
                        });
                    }, 800);
                }
            }
        },

        closeResultsModal: function () {
            const modal = document.getElementById('league-results-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            this.renderStatsCard();
        },

        // --- 12. PROFILE LOCKER & TITLES SHOP MODAL ---
        openLockerModal: function () {
            const modal = document.getElementById('locker-modal');
            if (!modal) return;
            this.renderLockerModal();
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeLockerModal: function () {
            const modal = document.getElementById('locker-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        renderLockerModal: function () {
            const appState = window.appState || window.state || {};
            const gems = this.getUserGems();
            const unlockedAvatars = appState.unlockedAvatars || [];
            const unlockedTitles = appState.unlockedTitles || [];
            const equippedTitle = appState.equippedTitle;

            const balanceEl = document.getElementById('locker-gems-balance');
            if (balanceEl) balanceEl.textContent = gems.toLocaleString();

            // 1. Render Avatars
            const avatarsContainer = document.getElementById('locker-avatars-grid');
            if (avatarsContainer) {
                avatarsContainer.innerHTML = this.AVATARS_CATALOG.map(item => {
                    const isUnlocked = unlockedAvatars.includes(item.id);
                    const isEquipped = appState.user && appState.user.avatar === item.icon;
                    const canAfford = gems >= item.cost;

                    let btnHtml = '';
                    if (isEquipped) {
                        btnHtml = `<span class="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-black rounded-xl">Opremljeno</span>`;
                    } else if (isUnlocked) {
                        btnHtml = `<button onclick="LeagueEngine.equipAvatar('${item.id}')" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-black rounded-xl active:scale-95 transition-transform">Opremi</button>`;
                    } else {
                        btnHtml = `
                        <button onclick="LeagueEngine.buyAvatar('${item.id}')" class="px-3 py-1.5 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} text-[10px] rounded-xl flex items-center gap-1 active:scale-95 transition-transform" ${canAfford ? '' : 'disabled'}>
                            <span>💎</span> <span>${item.cost}</span>
                        </button>`;
                    }

                    return `
                    <div class="bg-slate-800 border-2 ${isEquipped ? 'border-blue-500 shadow-md shadow-blue-500/20' : 'border-slate-700'} p-3 rounded-2xl flex flex-col items-center text-center">
                        <div class="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-3xl mb-2 relative ${item.animClass}">
                            <span>${item.icon}</span>
                        </div>
                        <div class="text-xs font-black text-white truncate w-full">${item.name}</div>
                        <div class="text-[9px] text-slate-400 truncate w-full mb-3">${item.desc}</div>
                        ${btnHtml}
                    </div>`;
                }).join('');
            }

            // 2. Render Titles
            const titlesContainer = document.getElementById('locker-titles-grid');
            if (titlesContainer) {
                titlesContainer.innerHTML = this.TITLES_CATALOG.map(t => {
                    const isUnlocked = unlockedTitles.includes(t.id);
                    const isEquipped = equippedTitle === t.title;
                    const canAfford = gems >= t.cost;

                    let btnHtml = '';
                    if (isEquipped) {
                        btnHtml = `<button onclick="LeagueEngine.unequipTitle()" class="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600 text-rose-300 text-[10px] font-black rounded-xl active:scale-95 transition-transform">Skini</button>`;
                    } else if (isUnlocked) {
                        btnHtml = `<button onclick="LeagueEngine.equipTitle('${t.id}')" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-black rounded-xl active:scale-95 transition-transform">Opremi</button>`;
                    } else {
                        btnHtml = `
                        <button onclick="LeagueEngine.buyTitle('${t.id}')" class="px-3 py-1.5 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-500 cursor-not-allowed'} text-[10px] rounded-xl flex items-center gap-1 active:scale-95 transition-transform" ${canAfford ? '' : 'disabled'}>
                            <span>💎</span> <span>${t.cost}</span>
                        </button>`;
                    }

                    return `
                    <div class="bg-slate-800 border-2 ${isEquipped ? 'border-amber-400 shadow-md shadow-amber-500/20' : 'border-slate-700'} p-3 rounded-2xl flex items-center justify-between gap-3">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="text-2xl">${t.icon}</span>
                            <div class="min-w-0">
                                <div class="text-xs font-black ${t.textColor} truncate">${t.title}</div>
                                <div class="text-[9px] text-slate-400">Titula za profil i lige</div>
                            </div>
                        </div>
                        ${btnHtml}
                    </div>`;
                }).join('');
            }
        },

        // Update profile header badge with equipped title
        updateProfileHeader: function () {
            const titleEl = document.getElementById('profile-equipped-title');
            const appState = window.appState || window.state;
            if (!titleEl || !appState) return;

            if (appState.equippedTitle) {
                titleEl.textContent = `✨ ${appState.equippedTitle} ✨`;
                titleEl.classList.remove('hidden');
            } else {
                titleEl.classList.add('hidden');
            }
        }
    };

    window.LeagueEngine = LeagueEngine;
})();
