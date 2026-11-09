/**
 * SerboLingo — Streak Retention & Duolingo Addiction Engine (Priority 37)
 * [SHIELD_DAEMON: VALIDATED]
 * 
 * Features:
 * 1. Streak-at-Risk Visual Alarm (Pulsating fire & countdown to 00:00)
 * 2. Spasi Svoj Niz (Streak Repair Modal: 150 Gems OR 5-Question Blitz Recovery)
 * 3. Društvo Niza (Streak Society VIP Tiers: 7, 14, 30, 50+ Days)
 * 4. Deljive Milestone Kartice (Instagram Story / WhatsApp shareable card)
 * 5. Interactive Streak Hub Modal (Header flame tap inspection)
 * 6. Web Notifications API (19:00 Evening habit reminder)
 */

(function () {
    'use strict';

    const StreakEngine = {
        STORAGE_KEY: 'serbolingo_streak_retention',
        REPAIR_COST_GEMS: 150,

        // --- Streak Society VIP Tiers ---
        SOCIETY_TIERS: [
            {
                id: 'bronze',
                minDays: 7,
                name: 'Bronzani Plamen',
                nameEn: 'Bronze Flame',
                icon: '🔥🥉',
                flameIcon: '🥉',
                badgeClass: 'streak-society-bronze',
                textColor: 'text-amber-400',
                border: 'border-amber-500/50',
                perk: '+1 Besplatan Štit za Niz (Automatski dodeljen)',
                perkEn: '+1 Free Streak Freeze (Auto awarded)'
            },
            {
                id: 'silver',
                minDays: 14,
                name: 'Srebrni Plamen',
                nameEn: 'Silver Flame',
                icon: '🔥🥈',
                flameIcon: '🥈',
                badgeClass: 'streak-society-silver',
                textColor: 'text-slate-300',
                border: 'border-slate-400/50',
                perk: 'VIP Srebrni Bedž i Okvir Profila',
                perkEn: 'VIP Silver Badge and Profile Frame'
            },
            {
                id: 'gold',
                minDays: 30,
                name: 'Zlatni Plamen',
                nameEn: 'Golden Flame',
                icon: '🔥🥇',
                flameIcon: '🥇',
                badgeClass: 'streak-society-gold',
                textColor: 'text-yellow-400',
                border: 'border-yellow-400/60',
                perk: 'Zlatni Sjaj u Tabeli Lige + Titula "Vitez Niza"',
                perkEn: 'Golden League Glow + "Streak Knight" Title'
            },
            {
                id: 'obsidian',
                minDays: 50,
                name: 'Opsidijanski Plamen',
                nameEn: 'Obsidian Flame',
                icon: '🔥👑',
                flameIcon: '👑',
                badgeClass: 'streak-society-obsidian',
                textColor: 'text-purple-300',
                border: 'border-purple-400/60',
                perk: 'Aura Opsidijana (+1.25x XP) + VIP Status',
                perkEn: 'Obsidian Aura (+1.25x XP) + VIP Status'
            }
        ],

        // --- 10 Curated Recovery Challenge Questions ---
        RECOVERY_QUESTIONS: [
            {
                q: 'Kako se na srpskom kaže "Good morning"?',
                qEn: 'How do you say "Good morning" in Serbian?',
                options: ['Dobro jutro', 'Dobar dan', 'Laku noć', 'Doviđenja'],
                correct: 0,
                tip: 'Jutro = Morning'
            },
            {
                q: 'Prevedi: "Hvala vam puno!"',
                qEn: 'Translate: "Hvala vam puno!"',
                options: ['Thank you very much!', 'You are welcome!', 'Please help me!', 'Good evening!'],
                correct: 0,
                tip: 'Hvala = Thank you'
            },
            {
                q: 'Koje je pravilno ćirilično pismo za "BEOGRAD"?',
                qEn: 'What is the correct Cyrillic for "BEOGRAD"?',
                options: ['БЕОГРАД', 'БЕОГРАЂ', 'ПЕОГРАД', 'ВЕОГРАД'],
                correct: 0,
                tip: 'Б = B, Г = G, Д = D'
            },
            {
                q: 'Dopuni rečenicu: "Ja _____ kafu svakog jutra."',
                qEn: 'Fill in: "Ja _____ kafu svakog jutra." (I drink coffee every morning)',
                options: ['pijem', 'jede', 'spava', 'učim'],
                correct: 0,
                tip: 'Ja pijem (Glagol piti)'
            },
            {
                q: 'Šta znači izreka: "Nema na čemu"?',
                qEn: 'What does "Nema na čemu" mean?',
                options: ["You're welcome", 'There is nothing', 'No problem at all', 'I am sorry'],
                correct: 0,
                tip: 'Standardni odgovor na "Hvala"'
            },
            {
                q: 'Koja reč označava "kuću"?',
                qEn: 'Which word means "house / home"?',
                options: ['Kuća', 'Zgrada', 'Ulica', 'Most'],
                correct: 0,
                tip: 'Kuća = House'
            },
            {
                q: 'Prevedi: "Drago mi je."',
                qEn: 'Translate: "Drago mi je."',
                options: ['Nice to meet you / My pleasure', 'I am sad', 'Good luck', 'See you soon'],
                correct: 0,
                tip: 'Drago mi je = Pleased to meet you'
            },
            {
                q: 'Kako se kaže broj "10" na srpskom?',
                qEn: 'How do you say number "10" in Serbian?',
                options: ['Deset', 'Devet', 'Osam', 'Jedan'],
                correct: 0,
                tip: '10 = Deset'
            },
            {
                q: 'Izaberi tačan oblik: "Ja govorim _____."',
                qEn: 'Select the correct form: "I speak Serbian."',
                options: ['srpski', 'srpskom', 'srpskog', 'srpska'],
                correct: 0,
                tip: 'Govoriti + jezik u prilogu (srpski)'
            },
            {
                q: 'Šta znači "Doviđenja"?',
                qEn: 'What does "Doviđenja" mean?',
                options: ['Goodbye', 'Good day', 'Hello', 'Please'],
                correct: 0,
                tip: 'Do viđenja = Until we see each other again'
            }
        ],

        // --- Active Challenge State ---
        activeChallenge: null,

        // --- Data Persistence ---
        getRetentionData: function () {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (!parsed.reminderTime) parsed.reminderTime = '19:00';
                    if (parsed.reminderNote === undefined) parsed.reminderNote = '';
                    return parsed;
                }
            } catch (e) {
                console.error('[StreakEngine] Failed to read retention data:', e);
            }
            return {
                notificationsEnabled: false,
                lastNotificationDate: null,
                celebratedMilestones: [],
                reminderTime: '19:00',
                reminderNote: ''
            };
        },

        saveRetentionData: function (data) {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('[StreakEngine] Failed to save retention data:', e);
            }
        },

        // --- Initialization ---
        init: function () {
            this.updateHeaderUI();
            this.renderHomeBanner();
            this.checkBrokenStreak();
            this.checkStreakSocietyMilestone();

            // Periodic 60s ticker for countdown and risk alerts
            if (!this._tickerInterval) {
                this._tickerInterval = setInterval(() => {
                    this.checkStreakRisk();
                    this.updateHeaderUI();
                    this.renderHomeBanner();
                    this.checkAndFireNotification();
                }, 60000);
            }

            // Sync notification toggle UI in profile if present
            this.updateProfileNotificationUI();
        },

        // --- Time & Risk Calculations ---
        isLessonDoneToday: function () {
            const today = new Date().toISOString().split('T')[0];
            const appState = window.appState || window.state;
            return !!(appState && appState.lastActiveDate === today);
        },

        getTimeUntilMidnight: function () {
            const now = new Date();
            const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
            const diffMs = Math.max(0, midnight - now);
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

            return {
                hours,
                minutes,
                seconds,
                diffMs,
                formatted: `${hours}h ${minutes}m`
            };
        },

        isStreakAtRisk: function () {
            const appState = window.appState || window.state;
            if (!appState || (appState.streak || 0) <= 0) return false;
            if (this.isLessonDoneToday()) return false;

            const now = new Date();
            const hour = now.getHours();
            // At risk if after 16:00 (4 PM) or less than 8 hours remain
            return hour >= 16;
        },

        checkStreakRisk: function () {
            return this.isStreakAtRisk();
        },

        // --- Header Flame UI Sync ---
        updateHeaderUI: function () {
            const appState = window.appState || window.state;
            const streak = appState ? (appState.streak || 0) : 0;
            const streakDisplay = document.getElementById('streak-display');
            const headerBtn = document.getElementById('header-streak-btn');
            const flameEl = document.getElementById('header-streak-flame');

            if (streakDisplay) streakDisplay.textContent = streak;

            if (!headerBtn) return;

            const isDone = this.isLessonDoneToday();
            const atRisk = this.isStreakAtRisk();

            // Clear previous risk classes
            headerBtn.classList.remove('streak-risk-alarm', 'bg-red-500/20', 'border-red-500/60', 'text-red-400', 'bg-orange-500/10', 'border-orange-500/20', 'text-orange-500', 'bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-400');
            if (flameEl) flameEl.classList.remove('flame-active-glow');

            if (atRisk) {
                // High urgency alert!
                const timeLeft = this.getTimeUntilMidnight().formatted;
                headerBtn.classList.add('streak-risk-alarm', 'bg-red-500/20', 'border-red-500/60', 'text-red-400');
                headerBtn.setAttribute('title', `⚠️ Tvoj niz je u opasnosti! Ističe za ${timeLeft}. Klikni za pregled.`);
            } else if (isDone && streak > 0) {
                // Safe for today!
                headerBtn.classList.add('bg-emerald-500/20', 'border-emerald-500/40', 'text-emerald-400');
                if (flameEl) flameEl.classList.add('flame-active-glow');
                headerBtn.setAttribute('title', `✅ Niz je bezbedan za danas! (${streak} dana)`);
            } else {
                // Neutral
                headerBtn.classList.add('bg-orange-500/10', 'border-orange-500/20', 'text-orange-500');
                headerBtn.setAttribute('title', `🔥 Tvoj niz: ${streak} dana. Klikni za detalje.`);
            }
        },

        // --- Home View Risk & Retention Banner ---
        renderHomeBanner: function () {
            const bannerContainer = document.getElementById('streak-risk-home-banner');
            if (!bannerContainer) return;

            const appState = window.appState || window.state;
            const streak = appState ? (appState.streak || 0) : 0;
            const broken = appState ? appState.brokenStreak : null;
            const isDone = this.isLessonDoneToday();
            const atRisk = this.isStreakAtRisk();
            const timeObj = this.getTimeUntilMidnight();

            // 1. Broken Streak Rescue Banner
            if (broken && broken.expiresAt > Date.now()) {
                const hoursLeft = Math.max(1, Math.round((broken.expiresAt - Date.now()) / (1000 * 60 * 60)));
                bannerContainer.innerHTML = `
                <div class="p-4 rounded-2xl bg-gradient-to-r from-red-950 via-rose-900 to-amber-950 border-2 border-red-500/70 shadow-xl flex items-center justify-between gap-3 animate-pulse">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="text-3xl shrink-0">💔</span>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-xs font-black text-white uppercase tracking-tight">Tvoj niz od ${broken.streak} dana je ugašen!</h3>
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500 text-white uppercase">Još ${hoursLeft}h</span>
                            </div>
                            <p class="text-[11px] font-bold text-red-200 truncate mt-0.5">Spasi ga sa 150 💎 ili besplatnim izazovom od 5 pitanja!</p>
                        </div>
                    </div>
                    <button onclick="StreakEngine.openRepairModal()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shrink-0 shadow-md active:scale-95 transition-transform flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>Spasi Niz</span>
                    </button>
                </div>`;
                bannerContainer.classList.remove('hidden');
                return;
            }

            // 2. Streak at Risk (Urgent countdown before midnight)
            if (atRisk) {
                bannerContainer.innerHTML = `
                <div class="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-red-950/80 to-slate-900 border-2 border-amber-500/70 shadow-lg flex items-center justify-between gap-3 streak-risk-alarm">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="text-3xl shrink-0 animate-bounce">⚠️</span>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="text-xs font-black text-white uppercase tracking-tight">Tvoj niz ističe za ${timeObj.formatted}!</h3>
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 uppercase">🔥 ${streak} Dana</span>
                            </div>
                            <p class="text-[11px] font-bold text-amber-200/90 truncate mt-0.5">Uradi samo 1 brzu lekciju sada da ga ne izgubiš!</p>
                        </div>
                    </div>
                    <button onclick="app.startDailyPractice ? app.startDailyPractice() : StreakEngine.openStreakModal()" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-black text-xs uppercase tracking-wider shrink-0 shadow-md active:scale-95 transition-transform flex items-center gap-1">
                        <span>🚀</span>
                        <span>Vežbaj</span>
                    </button>
                </div>`;
                bannerContainer.classList.remove('hidden');
                return;
            }

            // 3. Safe for today milestone celebration
            if (isDone && streak >= 3) {
                const tier = this.getSocietyTier(streak);
                bannerContainer.innerHTML = `
                <div class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 border border-emerald-500/40 shadow-sm flex items-center justify-between gap-3">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <span class="text-2xl shrink-0">${tier ? tier.flameIcon : '🔥'}</span>
                        <div class="min-w-0">
                            <div class="text-xs font-black text-white flex items-center gap-1.5">
                                <span>Niz sačuvan za danas!</span>
                                <span class="text-[10px] font-black text-emerald-400">✅ (${streak} dana)</span>
                            </div>
                            <p class="text-[10px] font-bold text-slate-400 truncate mt-0.5">${tier ? tier.name + ' • ' + tier.perk : 'Nastavi ovako sutra za sledeći nivo!'}</p>
                        </div>
                    </div>
                    <button onclick="StreakEngine.openStreakModal()" class="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] shrink-0 active:scale-95 transition-transform flex items-center gap-1">
                        <span>📊</span>
                        <span>Detalji</span>
                    </button>
                </div>`;
                bannerContainer.classList.remove('hidden');
                return;
            }

            // Hide banner when not needed
            bannerContainer.innerHTML = '';
            bannerContainer.classList.add('hidden');
        },

        // --- Društvo Niza (Streak Society Tiers) ---
        getSocietyTier: function (days) {
            const streak = typeof days === 'number' ? days : ((window.appState || window.state)?.streak || 0);
            for (let i = this.SOCIETY_TIERS.length - 1; i >= 0; i--) {
                if (streak >= this.SOCIETY_TIERS[i].minDays) {
                    return this.SOCIETY_TIERS[i];
                }
            }
            return null;
        },

        getNextSocietyTier: function (days) {
            const streak = typeof days === 'number' ? days : ((window.appState || window.state)?.streak || 0);
            for (let i = 0; i < this.SOCIETY_TIERS.length; i++) {
                if (streak < this.SOCIETY_TIERS[i].minDays) {
                    return this.SOCIETY_TIERS[i];
                }
            }
            return null; // Top tier reached
        },

        checkStreakSocietyMilestone: function () {
            const appState = window.appState || window.state;
            if (!appState) return;
            const streak = appState.streak || 0;
            const data = this.getRetentionData();

            // Reward +1 Streak Freeze when entering Bronze (7 days) for the first time
            if (streak >= 7 && !data.celebratedMilestones.includes(7)) {
                if (window.ShopEngine) {
                    const shopData = window.ShopEngine.getShopData();
                    if (shopData.streakFreezes < 3) {
                        shopData.streakFreezes += 1;
                        window.ShopEngine.saveShopData(shopData);
                    }
                }
                data.celebratedMilestones.push(7);
                this.saveRetentionData(data);
                setTimeout(() => this.openMilestoneCard(7), 1000);
            }
        },

        onStreakAdvanced: function (newStreak) {
            this.updateHeaderUI();
            this.renderHomeBanner();

            const milestones = [3, 7, 14, 30, 50, 100];
            const data = this.getRetentionData();

            if (milestones.includes(newStreak) && !data.celebratedMilestones.includes(newStreak)) {
                data.celebratedMilestones.push(newStreak);
                this.saveRetentionData(data);

                // Give bonus reward
                if (newStreak === 7 && window.ShopEngine) {
                    const sData = window.ShopEngine.getShopData();
                    if (sData.streakFreezes < 3) {
                        sData.streakFreezes += 1;
                        window.ShopEngine.saveShopData(sData);
                    }
                }

                setTimeout(() => {
                    this.openMilestoneCard(newStreak);
                }, 800);
            }
        },

        // --- Interactive Streak Hub Modal ---
        openStreakModal: function () {
            const modal = document.getElementById('streak-hub-modal');
            if (!modal) return;

            const appState = window.appState || window.state;
            const streak = appState ? (appState.streak || 0) : 0;
            const maxStreak = appState ? (appState.maxStreak || 0) : streak;
            const isDone = this.isLessonDoneToday();
            const atRisk = this.isStreakAtRisk();
            const timeObj = this.getTimeUntilMidnight();
            const currentTier = this.getSocietyTier(streak);
            const nextTier = this.getNextSocietyTier(streak);

            // 1. Header Numbers
            const numEl = document.getElementById('streak-hub-number');
            const maxEl = document.getElementById('streak-hub-max');
            const statusEl = document.getElementById('streak-hub-status');
            const flameEl = document.getElementById('streak-hub-flame');

            if (numEl) numEl.textContent = streak;
            if (maxEl) maxEl.textContent = maxStreak;

            if (statusEl) {
                if (isDone) {
                    statusEl.innerHTML = `<span class="text-emerald-400 font-bold">✅ Sačuvano za danas!</span>`;
                } else if (atRisk) {
                    statusEl.innerHTML = `<span class="text-rose-400 font-bold animate-pulse">⚠️ Ističe za ${timeObj.formatted}!</span>`;
                } else {
                    statusEl.innerHTML = `<span class="text-amber-300 font-bold">⏳ Uradi lekciju pre ponoći (${timeObj.formatted})</span>`;
                }
            }

            if (flameEl) {
                flameEl.className = `text-6xl mx-auto transition-transform ${isDone ? 'flame-active-glow' : atRisk ? 'streak-risk-alarm' : ''}`;
            }

            // 2. Shield (Freeze) Inventory Status
            const shieldEl = document.getElementById('streak-hub-shields');
            if (shieldEl && window.ShopEngine) {
                const freezeCount = window.ShopEngine.getShopData().streakFreezes || 0;
                shieldEl.innerHTML = `
                <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🛡️</span>
                        <div>
                            <div class="text-xs font-black text-white">Štitovi za Niz (Streak Freeze)</div>
                            <div class="text-[10px] font-bold ${freezeCount > 0 ? 'text-cyan-400' : 'text-slate-400'}">
                                ${freezeCount > 0 ? `Aktivno: ${freezeCount}/3 štita na raspolaganju` : 'Nemaš aktivnih štitova! Kupi u prodavnici.'}
                            </div>
                        </div>
                    </div>
                    <button onclick="StreakEngine.closeStreakModal(); ShopEngine.openShop();" class="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 active:scale-95 text-white font-black text-[11px] rounded-xl transition-transform shrink-0">
                        ${freezeCount >= 3 ? 'Puni' : 'Kupi'}
                    </button>
                </div>`;
            }

            // 3. Društvo Niza (Streak Society) Roadmap
            const societyListEl = document.getElementById('streak-hub-society-list');
            if (societyListEl) {
                societyListEl.innerHTML = this.SOCIETY_TIERS.map(t => {
                    const isUnlocked = streak >= t.minDays;
                    const isCurrent = currentTier && currentTier.id === t.id;
                    return `
                    <div class="p-3 rounded-2xl border ${isUnlocked ? t.badgeClass + ' border-2 shadow-sm' : 'bg-slate-800/40 border-slate-700/40 opacity-70'} flex items-center justify-between gap-3">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="text-2xl shrink-0">${t.icon}</span>
                            <div class="min-w-0">
                                <div class="flex items-center gap-2">
                                    <span class="text-xs font-black ${isUnlocked ? t.textColor : 'text-slate-300'} truncate">${t.name}</span>
                                    <span class="text-[9px] font-black px-1.5 py-0.2 rounded ${isUnlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-400'}">${t.minDays}+ dana</span>
                                    ${isCurrent ? '<span class="text-[8px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-black uppercase">Tvoj Nivo</span>' : ''}
                                </div>
                                <div class="text-[10px] font-bold text-slate-400 truncate mt-0.5">${t.perk}</div>
                            </div>
                        </div>
                        <span class="text-lg shrink-0">${isUnlocked ? '✅' : '🔒'}</span>
                    </div>`;
                }).join('');
            }

            // 4. Notifications Toggle Status
            const notifEl = document.getElementById('streak-hub-notif-btn');
            const data = this.getRetentionData();
            if (notifEl) {
                notifEl.textContent = data.notificationsEnabled ? '🔔 Podsetnici: Uključeni' : '🔕 Podsetnici: Isključeni';
                notifEl.className = `w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all ${data.notificationsEnabled ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'}`;
            }

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeStreakModal: function () {
            const modal = document.getElementById('streak-hub-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        // --- Broken Streak & Streak Repair (Spasi Svoj Niz) ---
        checkBrokenStreak: function () {
            const appState = window.appState || window.state;
            if (!appState || !appState.brokenStreak) return;

            const broken = appState.brokenStreak;
            if (broken.expiresAt > Date.now()) {
                // Open recovery modal with a gentle delay after launch
                setTimeout(() => {
                    this.openRepairModal();
                }, 900);
            } else {
                // Expired after 24 hours -> clear
                appState.brokenStreak = null;
                if (window.app && window.app.saveStats) window.app.saveStats();
            }
        },

        openRepairModal: function () {
            const modal = document.getElementById('streak-repair-modal');
            if (!modal) return;

            const appState = window.appState || window.state;
            const broken = appState ? appState.brokenStreak : null;
            if (!broken) return;

            const daysLost = broken.streak || 1;
            const userGems = window.LeagueEngine ? window.LeagueEngine.getUserGems() : (appState.gems || 0);
            const canAfford = userGems >= this.REPAIR_COST_GEMS;

            const countEl = document.getElementById('streak-repair-count');
            const gemsBtn = document.getElementById('streak-repair-gems-btn');
            const gemsBalEl = document.getElementById('streak-repair-gems-balance');

            if (countEl) countEl.textContent = daysLost;
            if (gemsBalEl) gemsBalEl.textContent = userGems.toLocaleString();

            if (gemsBtn) {
                if (canAfford) {
                    gemsBtn.disabled = false;
                    gemsBtn.className = 'w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2';
                    gemsBtn.innerHTML = `<span>💎</span><span>Spasi za ${this.REPAIR_COST_GEMS} Dijamanata</span>`;
                } else {
                    gemsBtn.disabled = true;
                    gemsBtn.className = 'w-full py-3.5 bg-slate-800 text-slate-500 font-black text-xs uppercase tracking-wider rounded-2xl border border-slate-700/60 cursor-not-allowed flex items-center justify-center gap-2 opacity-60';
                    gemsBtn.innerHTML = `<span>💎</span><span>Treba ti ${this.REPAIR_COST_GEMS} 💎 (Imaš ${userGems})</span>`;
                }
            }

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (window.TouchHaptics) TouchHaptics.vibrate('error');
        },

        closeRepairModal: function () {
            const modal = document.getElementById('streak-repair-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        dismissBrokenStreak: function () {
            const appState = window.appState || window.state;
            if (appState) {
                appState.brokenStreak = null;
                if (window.app && window.app.saveStats) window.app.saveStats();
            }
            this.closeRepairModal();
            this.renderHomeBanner();
            if (window.app && window.app.showToast) {
                window.app.showToast('Novi niz započinje danas! Uradi lekciju. 🔥', 'info');
            }
        },

        repairWithGems: function () {
            const appState = window.appState || window.state;
            if (!appState || !appState.brokenStreak) return;

            if (!window.LeagueEngine || !window.LeagueEngine.spendGems(this.REPAIR_COST_GEMS, 'Spasavanje Niza')) {
                if (window.app && window.app.showToast) {
                    window.app.showToast(`Nedovoljno dijamanata! Potrebno: ${this.REPAIR_COST_GEMS} 💎`, 'error');
                }
                return;
            }

            // Streak restored + 1!
            const restoredStreak = (appState.brokenStreak.streak || 1) + 1;
            appState.streak = restoredStreak;
            if (restoredStreak > (appState.maxStreak || 0)) appState.maxStreak = restoredStreak;
            appState.lastActiveDate = new Date().toISOString().split('T')[0];
            appState.brokenStreak = null;

            if (window.app && window.app.saveStats) window.app.saveStats();

            this.closeRepairModal();
            this.updateHeaderUI();
            this.renderHomeBanner();

            if (window.app && window.app.fireConfetti) window.app.fireConfetti();
            if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
            if (window.app && window.app.showToast) {
                window.app.showToast(`🔥 NIZ JE SPASEN! Sada imaš ${restoredStreak} dana zaredom!`, 'success');
            }
        },

        // --- 5-Question Blitz Recovery Challenge ---
        startRecoveryChallenge: function () {
            this.closeRepairModal();

            // Shuffle and pick 5 questions
            const pool = [...this.RECOVERY_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
            this.activeChallenge = {
                questions: pool,
                currentIndex: 0,
                score: 0
            };

            const modal = document.getElementById('streak-challenge-modal');
            if (!modal) return;

            this.renderChallengeQuestion();
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeChallengeModal: function () {
            const modal = document.getElementById('streak-challenge-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            this.activeChallenge = null;
        },

        renderChallengeQuestion: function () {
            if (!this.activeChallenge) return;
            const c = this.activeChallenge;
            const q = c.questions[c.currentIndex];

            const stepEl = document.getElementById('streak-challenge-step');
            const progBar = document.getElementById('streak-challenge-progress-bar');
            const textEl = document.getElementById('streak-challenge-text');
            const optionsEl = document.getElementById('streak-challenge-options');
            const feedbackEl = document.getElementById('streak-challenge-feedback');

            if (stepEl) stepEl.textContent = `Pitanje ${c.currentIndex + 1} od 5`;
            if (progBar) progBar.style.width = `${((c.currentIndex) / 5) * 100}%`;
            if (textEl) textEl.textContent = q.q;
            if (feedbackEl) feedbackEl.innerHTML = '';

            if (optionsEl) {
                optionsEl.innerHTML = q.options.map((opt, idx) => `
                <button onclick="StreakEngine.answerChallenge(${idx})" class="w-full p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 active:scale-98 border-2 border-slate-700/80 text-white font-bold text-sm text-left transition-all flex items-center justify-between">
                    <span>${opt}</span>
                    <span class="text-xs text-slate-500 font-mono">${['A', 'B', 'C', 'D'][idx]}</span>
                </button>
                `).join('');
            }
        },

        answerChallenge: function (selectedIndex) {
            if (!this.activeChallenge) return;
            const c = this.activeChallenge;
            const q = c.questions[c.currentIndex];
            const isCorrect = selectedIndex === q.correct;

            if (isCorrect) {
                c.score++;
                if (window.TouchHaptics) TouchHaptics.vibrate('correct');
            } else {
                if (window.TouchHaptics) TouchHaptics.vibrate('error');
            }

            const feedbackEl = document.getElementById('streak-challenge-feedback');
            if (feedbackEl) {
                feedbackEl.innerHTML = `
                <div class="p-3 rounded-2xl text-center text-xs font-black ${isCorrect ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300' : 'bg-rose-950/60 border border-rose-500/50 text-rose-300'} animate-fade-in">
                    ${isCorrect ? '✅ Tačno!' : `❌ Netačno! Tačan odgovor: ${q.options[q.correct]}`}
                </div>`;
            }

            // Advance after 700ms
            setTimeout(() => {
                c.currentIndex++;
                if (c.currentIndex < 5) {
                    this.renderChallengeQuestion();
                } else {
                    this.finishChallenge();
                }
            }, 750);
        },

        finishChallenge: function () {
            if (!this.activeChallenge) return;
            const c = this.activeChallenge;
            const passed = c.score >= 4; // 4 or 5 out of 5 required

            const optionsEl = document.getElementById('streak-challenge-options');
            const textEl = document.getElementById('streak-challenge-text');
            const stepEl = document.getElementById('streak-challenge-step');
            const feedbackEl = document.getElementById('streak-challenge-feedback');

            if (stepEl) stepEl.textContent = 'Kraj Izazova!';
            if (feedbackEl) feedbackEl.innerHTML = '';

            if (passed) {
                // Restore streak!
                const appState = window.appState || window.state;
                const restoredStreak = (appState?.brokenStreak?.streak || 1) + 1;
                if (appState) {
                    appState.streak = restoredStreak;
                    if (restoredStreak > (appState.maxStreak || 0)) appState.maxStreak = restoredStreak;
                    appState.lastActiveDate = new Date().toISOString().split('T')[0];
                    appState.brokenStreak = null;
                    if (window.app && window.app.saveStats) window.app.saveStats();
                }

                if (textEl) textEl.textContent = '🎉 BRAVO! SPASIO SI SVOJ NIZ!';
                if (optionsEl) {
                    optionsEl.innerHTML = `
                    <div class="text-center space-y-4 py-2">
                        <div class="text-5xl animate-bounce">🔥</div>
                        <p class="text-xs font-bold text-slate-300">
                            Odgovorio si tačno na ${c.score}/5 pitanja. Tvoj niz je nastavljen i sada iznosi <span class="text-amber-400 font-black">${restoredStreak} dana</span>!
                        </p>
                        <button onclick="StreakEngine.closeChallengeModal()" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg active:scale-95 transition-transform">
                            Nastavi Učenje! 🚀
                        </button>
                    </div>`;
                }

                this.updateHeaderUI();
                this.renderHomeBanner();
                if (window.app && window.app.fireConfetti) window.app.fireConfetti();
                if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
            } else {
                if (textEl) textEl.textContent = '💔 Nisi uspeo ovaj put';
                if (optionsEl) {
                    optionsEl.innerHTML = `
                    <div class="text-center space-y-4 py-2">
                        <div class="text-5xl">🛡️</div>
                        <p class="text-xs font-bold text-slate-300">
                            Imao si ${c.score}/5 tačnih (potrebno 4/5). Možeš još uvek da spasiš niz sa 150 💎 dijamanata pre isteka roka!
                        </p>
                        <div class="flex gap-2">
                            <button onclick="StreakEngine.closeChallengeModal(); StreakEngine.openRepairModal();" class="flex-1 py-3 bg-cyan-600 text-white font-black text-xs uppercase rounded-2xl active:scale-95 transition-transform">
                                💎 Spasi Dijamantima
                            </button>
                            <button onclick="StreakEngine.closeChallengeModal()" class="flex-1 py-3 bg-slate-800 text-slate-300 font-black text-xs uppercase rounded-2xl active:scale-95 transition-transform">
                                Zatvori
                            </button>
                        </div>
                    </div>`;
                }
            }
        },

        // --- Deljive Milestone Kartice (Instagram Story / WhatsApp) ---
        openMilestoneCard: function (days) {
            const streak = typeof days === 'number' ? days : ((window.appState || window.state)?.streak || 1);
            const modal = document.getElementById('streak-milestone-modal');
            if (!modal) return;

            const appState = window.appState || window.state;
            const userName = appState?.user?.name || 'SerboLingo Učenik';
            const userAvatar = appState?.equippedAvatarIcon || '👤';
            const tier = this.getSocietyTier(streak);

            const quotes = [
                'Navika jača od čelika! 🇷🇸',
                'Svakog dana korak bliže tečnom govoru! ⚡',
                'Balkanski duh i nepobediva disciplina! 🏆',
                'Znanje se gradi dan po dan! 📚'
            ];
            const quote = quotes[streak % quotes.length];

            const countEl = document.getElementById('streak-card-days');
            const userEl = document.getElementById('streak-card-user');
            const avatarEl = document.getElementById('streak-card-avatar');
            const tierEl = document.getElementById('streak-card-tier');
            const quoteEl = document.getElementById('streak-card-quote');

            if (countEl) countEl.textContent = streak;
            if (userEl) userEl.textContent = userName;
            if (avatarEl) avatarEl.textContent = userAvatar;
            if (quoteEl) quoteEl.textContent = quote;
            if (tierEl) {
                tierEl.textContent = tier ? tier.name : 'Učenik u Usponu';
            }

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            if (window.app && window.app.fireConfetti) window.app.fireConfetti();
            if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
        },

        closeMilestoneModal: function () {
            const modal = document.getElementById('streak-milestone-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        shareMilestone: async function () {
            const appState = window.appState || window.state;
            const streak = appState ? (appState.streak || 1) : 1;
            const text = `🔥 Upravo sam dostigao ${streak} dana niza na SerboLingu! Učim srpski svakog dana bez pauze! 🇷🇸 #SerboLingo #Streak`;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `🔥 Moj SerboLingo Niz: ${streak} Dana!`,
                        text: text,
                        url: window.location.href
                    });
                    if (window.app && window.app.showToast) {
                        window.app.showToast('Uspešno podeljeno! 🎉', 'success');
                    }
                    return;
                } catch (e) {
                    console.log('Share dismissed or failed:', e);
                }
            }

            // Clipboard fallback
            try {
                await navigator.clipboard.writeText(text);
                if (window.app && window.app.showToast) {
                    window.app.showToast('📋 Tekst je kopiran! Spreman za Story ili poruku.', 'success');
                }
            } catch (err) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('🔥 Čestitamo na dostignuću!', 'info');
                }
            }
        },

        // --- Web Notifications API (Evening Habit Reminder) ---
        toggleNotifications: function () {
            const data = this.getRetentionData();
            if (data.notificationsEnabled) {
                data.notificationsEnabled = false;
                this.saveRetentionData(data);
                this.updateProfileNotificationUI();
                const btn = document.getElementById('streak-hub-notif-btn');
                if (btn) {
                    btn.textContent = '🔕 Podsetnici: Isključeni';
                    btn.className = 'w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all bg-slate-800 text-slate-300 border border-slate-700';
                }
                if (window.app && window.app.showToast) {
                    window.app.showToast('Podsetnici za niz su isključeni.', 'info');
                }
            } else {
                this.requestNotificationPermission();
            }
        },

        requestNotificationPermission: async function () {
            if (!('Notification' in window)) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('Obaveštenja nisu podržana u ovom pregledaču.', 'error');
                }
                return;
            }

            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    const data = this.getRetentionData();
                    data.notificationsEnabled = true;
                    this.saveRetentionData(data);
                    this.updateProfileNotificationUI();

                    const btn = document.getElementById('streak-hub-notif-btn');
                    if (btn) {
                        btn.textContent = '🔔 Podsetnici: Uključeni';
                        btn.className = 'w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all bg-emerald-600/20 text-emerald-300 border border-emerald-500/40';
                    }

                    // Welcome test notification
                    try {
                        new Notification('🔥 SerboLingo Niz Aktivan!', {
                            body: 'Podsetnici su uključeni. Dobićeš nežno upozorenje u 19:00 ako tvoj niz bude u opasnosti!',
                            icon: 'icons/icon-192.png'
                        });
                    } catch (e) {
                        // Ignore notification spawn issue on some mobile browsers
                    }

                    if (window.app && window.app.showToast) {
                        window.app.showToast('🔔 Podsetnici za niz su uspešno uključeni!', 'success');
                    }
                } else {
                    if (window.app && window.app.showToast) {
                        window.app.showToast('Dozvola za obaveštenja nije data.', 'info');
                    }
                }
            } catch (err) {
                console.error('Error requesting notification permission:', err);
            }
        },

        updateReminderTime: function (timeStr) {
            if (!timeStr) return;
            const data = this.getRetentionData();
            data.reminderTime = timeStr;
            this.saveRetentionData(data);
            if (window.app && window.app.showToast) {
                window.app.showToast(`⏰ Vreme podsetnika postavljeno na ${timeStr}!`, 'info');
            }
        },

        updateReminderNote: function (noteStr) {
            const data = this.getRetentionData();
            data.reminderNote = noteStr ? noteStr.trim() : '';
            this.saveRetentionData(data);
        },

        testNotification: function () {
            const data = this.getRetentionData();
            const note = data.reminderNote ? `\n📝 "${data.reminderNote}"` : '';
            const appState = window.appState || window.state;
            const streak = appState ? (appState.streak || 0) : 0;
            const bodyText = (streak > 0
                ? `Ostalo je još par sati do ponoći! Uradi 1 brzu lekciju da ne izgubiš niz od ${streak} dana! 🔥`
                : 'Ne zaboravi svoju današnju lekciju srpskog jezika! 🚀') + note;

            if (!('Notification' in window)) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('Obaveštenja nisu podržana u ovom pregledaču.', 'info');
                }
                return;
            }

            if (Notification.permission === 'granted') {
                try {
                    new Notification('⚠️ SerboLingo Podsetnik (Test)', {
                        body: bodyText,
                        icon: 'icons/icon-192.png'
                    });
                    if (window.app && window.app.showToast) {
                        window.app.showToast('🔔 Test obaveštenje uspešno poslato!', 'success');
                    }
                } catch (e) {
                    console.log('Test notification error:', e);
                }
            } else {
                Notification.requestPermission().then(perm => {
                    if (perm === 'granted') {
                        try {
                            new Notification('⚠️ SerboLingo Podsetnik (Test)', {
                                body: bodyText,
                                icon: 'icons/icon-192.png'
                            });
                            if (window.app && window.app.showToast) {
                                window.app.showToast('🔔 Test obaveštenje uspešno poslato!', 'success');
                            }
                        } catch (e) {}
                    } else {
                        if (window.app && window.app.showToast) {
                            window.app.showToast('Dozvola za obaveštenja nije data.', 'info');
                        }
                    }
                });
            }
        },

        checkAndFireNotification: function () {
            const data = this.getRetentionData();
            if (!data.notificationsEnabled) return;
            if (!('Notification' in window) || Notification.permission !== 'granted') return;

            const today = new Date().toISOString().split('T')[0];
            if (data.lastNotificationDate === today) return; // Already fired today

            const now = new Date();
            const currentHour = now.getHours();
            const currentMin = now.getMinutes();

            const timeParts = (data.reminderTime || '19:00').split(':');
            const targetHour = parseInt(timeParts[0], 10) || 19;
            const targetMin = parseInt(timeParts[1], 10) || 0;

            const isTime = (currentHour === targetHour && currentMin >= targetMin) || (currentHour > targetHour && currentHour <= 23);

            if (isTime && !this.isLessonDoneToday()) {
                const appState = window.appState || window.state;
                const streak = appState ? (appState.streak || 0) : 0;
                const note = data.reminderNote ? `\n📝 "${data.reminderNote}"` : '';

                try {
                    new Notification('⚠️ Tvoj SerboLingo niz je u opasnosti!', {
                        body: (streak > 0
                            ? `Ostalo je još par sati do ponoći! Uradi 1 brzu lekciju da ne izgubiš niz od ${streak} dana! 🔥`
                            : 'Ne zaboravi svoju današnju lekciju srpskog jezika! 🚀') + note,
                        icon: 'icons/icon-192.png'
                    });
                    data.lastNotificationDate = today;
                    this.saveRetentionData(data);
                } catch (e) {
                    console.log('Notification trigger error:', e);
                }
            }
        },

        updateProfileNotificationUI: function () {
            const btn = document.getElementById('btn-streak-notif');
            const knob = document.getElementById('knob-streak-notif');
            const timeInput = document.getElementById('streak-reminder-time');
            const noteInput = document.getElementById('streak-reminder-note');
            const container = document.getElementById('streak-reminder-settings-box');

            const data = this.getRetentionData();
            const enabled = data.notificationsEnabled;

            if (btn && knob) {
                if (enabled) {
                    btn.className = 'w-12 h-7 bg-blue-500 rounded-full relative transition-colors duration-300';
                    knob.className = 'absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform translate-x-5';
                    if (container) container.classList.remove('hidden');
                } else {
                    btn.className = 'w-12 h-7 bg-slate-300 dark:bg-slate-700 rounded-full relative transition-colors duration-300';
                    knob.className = 'absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform translate-x-0';
                    if (container) container.classList.add('hidden');
                }
            }

            if (timeInput && data.reminderTime) {
                timeInput.value = data.reminderTime;
            }
            if (noteInput && data.reminderNote !== undefined) {
                noteInput.value = data.reminderNote;
            }
        }
    };

    window.StreakEngine = StreakEngine;
})();
