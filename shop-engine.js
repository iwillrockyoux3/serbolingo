// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — Gamification Economy Engine (Priority 7 & 26)
 *
 * Features:
 *  - Streak Freeze ("Štit za Niz") — protects streak if user misses a day
 *  - XP Shop ("Prodavnica") — spend earned XP on power-ups and items
 *  - Daily Quests Enhancement — Mystery Chest reward on all-complete
 *  - Gems (Dijamanti) as premium currency earned from quests & arcade
 */

(function () {
    'use strict';

    const ShopEngine = {
        STORAGE_KEY: 'serbolingo_shop',

        // --- Shop Items Catalog ---
        ITEMS: [
            {
                id: 'streak_freeze',
                name: 'Štit za Niz',
                nameEn: 'Streak Freeze',
                desc: 'Zaštiti svoj niz ako propustiš 1 dan',
                descEn: 'Protects your streak if you miss 1 day',
                icon: '🛡️',
                cost: 200,
                currency: 'xp',
                max: 3,
                category: 'power'
            },
            {
                id: 'double_xp',
                name: 'Dupli XP (1h)',
                nameEn: 'Double XP (1h)',
                desc: 'Dupli XP za sledeći 1 sat',
                descEn: 'Double XP for the next 1 hour',
                icon: '⚡',
                cost: 150,
                currency: 'xp',
                max: 5,
                category: 'power'
            },
            {
                id: 'heart_refill',
                name: 'Punjenje Srca',
                nameEn: 'Heart Refill',
                desc: 'Odmah napuni svih 5 srca',
                descEn: 'Instantly refill all 5 hearts',
                icon: '❤️',
                iconHtml: '<span class="relative inline-flex items-center justify-center w-full h-full"><span class="text-2xl">❤️</span><span class="absolute -bottom-1 -right-1 text-xs drop-shadow-md">🩹</span></span>',
                cost: 100,
                currency: 'xp',
                max: 99,
                category: 'power'
            },
            {
                id: 'mystery_chest',
                name: 'Tajanstvena Kutija',
                nameEn: 'Mystery Chest',
                desc: 'Nasumični bonus: XP, Štit, ili Dupli XP',
                descEn: 'Random bonus: XP, Shield, or Double XP',
                icon: '🎁',
                cost: 300,
                currency: 'xp',
                max: 99,
                category: 'special'
            }
        ],

        // --- Daily Quest Definitions (expanded, picks 3 per day) ---
        ALL_QUEST_TYPES: [
            { id: 'grinder', text: 'Zasluži 50 XP danas', textEn: 'Earn 50 XP today', target: 50, icon: '⚡', reward: 15 },
            { id: 'perfect_scholar', text: 'Završi 2 savršene lekcije', textEn: 'Complete 2 Perfect Lessons', target: 2, icon: '🌟', reward: 20 },
            { id: 'speaker', text: 'Pogodi 3 govorna pitanja', textEn: 'Get 3 Speaking questions right', target: 3, icon: '🎙️', reward: 15 },
            { id: 'reviewer', text: 'Završi 1 Vežbu', textEn: 'Complete 1 Practice lesson', target: 1, icon: '🔄', reward: 10 },
            { id: 'arcade_player', text: 'Igraj 2 Arcade igre', textEn: 'Play 2 Arcade games', target: 2, icon: '🕹️', reward: 15 },
            { id: 'mistake_clearer', text: 'Pregledaj 5 grešaka', textEn: 'Review 5 mistakes', target: 5, icon: '🧹', reward: 15 },
            { id: 'word_learner', text: 'Nauči 5 novih reči', textEn: 'Learn 5 new words', target: 5, icon: '📚', reward: 10 },
            { id: 'streak_keeper', text: 'Zadrži svoj niz danas', textEn: 'Keep your streak today', target: 1, icon: '🔥', reward: 10 },
        ],

        getShopData: function () {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) return JSON.parse(stored);
            } catch (e) {}
            return {
                streakFreezes: 0,
                doubleXpUntil: 0,
                totalSpent: 0,
                purchaseHistory: []
            };
        },

        saveShopData: function (data) {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            } catch (e) {}
        },

        // --- Streak Freeze Logic (integrates with app.js daily reset) ---
        hasStreakFreeze: function () {
            return this.getShopData().streakFreezes > 0;
        },

        useStreakFreeze: function () {
            const data = this.getShopData();
            if (data.streakFreezes > 0) {
                data.streakFreezes -= 1;
                this.saveShopData(data);
                return true;
            }
            return false;
        },

        // --- Double XP Logic ---
        isDoubleXpActive: function () {
            return Date.now() < (this.getShopData().doubleXpUntil || 0);
        },

        getXpMultiplier: function () {
            return this.isDoubleXpActive() ? 2 : 1;
        },

        // --- Purchase Logic ---
        purchaseItem: function (itemId) {
            const item = this.ITEMS.find(i => i.id === itemId);
            if (!item) return { success: false, msg: 'Artikal nije pronađen.' };

            const appState = window.appState || window.state;
            if (!appState) return { success: false, msg: 'Stanje nije dostupno.' };

            const data = this.getShopData();

            // Check cost
            if ((appState.xp || 0) < item.cost) {
                return { success: false, msg: `Nedovoljno XP! Trebaš ${item.cost} XP.` };
            }

            // Check max stacking
            if (itemId === 'streak_freeze' && data.streakFreezes >= item.max) {
                return { success: false, msg: `Već imaš maksimum (${item.max}) Štitova!` };
            }

            // Deduct XP
            appState.xp -= item.cost;
            data.totalSpent += item.cost;

            // Apply item effect
            switch (itemId) {
                case 'streak_freeze':
                    data.streakFreezes += 1;
                    break;
                case 'double_xp':
                    data.doubleXpUntil = Date.now() + (60 * 60 * 1000); // 1 hour
                    break;
                case 'heart_refill':
                    appState.hearts = 5;
                    break;
                case 'mystery_chest':
                    return this._openMysteryChest(appState, data);
            }

            data.purchaseHistory.push({ itemId, date: Date.now() });
            this.saveShopData(data);
            if (window.app && window.app.saveState) window.app.saveState();
            if (window.app && window.app.updateProfileUI) window.app.updateProfileUI();

            return { success: true, msg: `${item.icon} ${item.name} je kupljen!` };
        },

        _openMysteryChest: function (appState, data) {
            const roll = Math.random();
            let reward;
            if (roll < 0.35) {
                // XP Bonus (50-150)
                const bonus = Math.floor(Math.random() * 100 + 50);
                appState.xp += bonus;
                reward = `⚡ +${bonus} XP!`;
            } else if (roll < 0.6) {
                // Streak Freeze
                data.streakFreezes = Math.min((data.streakFreezes || 0) + 1, 3);
                reward = '🛡️ +1 Štit za Niz!';
            } else if (roll < 0.8) {
                // Double XP 30min
                data.doubleXpUntil = Date.now() + (30 * 60 * 1000);
                reward = '⚡ Dupli XP (30 min)!';
            } else {
                // XP Boost for Arcade
                if (!appState.inventory) appState.inventory = { xpBoosts: 0 };
                appState.inventory.xpBoosts += 2;
                reward = '🚀 +2 Arcade XP Boost!';
            }

            data.purchaseHistory.push({ itemId: 'mystery_chest', date: Date.now() });
            this.saveShopData(data);
            if (window.app && window.app.saveState) window.app.saveState();
            if (window.app && window.app.updateProfileUI) window.app.updateProfileUI();

            return { success: true, msg: `🎁 Tajanstvena Kutija: ${reward}`, isChest: true, chestReward: reward };
        },

        // --- Enhanced Daily Quest Generator (picks 3 random from pool) ---
        generateDailyQuests: function () {
            const pool = [...this.ALL_QUEST_TYPES];
            const picked = [];
            for (let i = 0; i < 3 && pool.length > 0; i++) {
                const idx = Math.floor(Math.random() * pool.length);
                const q = pool.splice(idx, 1)[0];
                picked.push({
                    ...q,
                    progress: 0,
                    completed: false,
                    claimed: false
                });
            }
            return picked;
        },

        // --- Check All Quests Complete → Mystery Chest Celebration ---
        checkAllQuestsComplete: function () {
            const appState = window.appState || window.state;
            if (!appState || !appState.quests) return false;

            const allDone = appState.quests.every(q => q.completed);
            if (allDone && !appState.questChestClaimed) {
                appState.questChestClaimed = true;
                // Bonus reward for completing all 3
                appState.xp += 30;
                appState.dailyXP += 30;
                if (window.app) {
                    window.app.saveState();
                    window.app.updateProfileUI();
                    window.app.showToast('🎉 Sve misije završene! +30 bonus XP!', 'success');
                    setTimeout(() => {
                        if (window.app.fireConfetti) window.app.fireConfetti();
                    }, 300);
                }
                return true;
            }
            return false;
        },

        // --- Render Enhanced Quests with Claim Button ---
        renderQuests: function () {
            const container = document.getElementById('quests-container');
            const appState = window.appState || window.state;
            if (!container || !appState || !appState.quests) return;

            const isSrToEn = appState.settings?.learningDirection === 'sr_to_en';
            const allDone = appState.quests.every(q => q.completed);

            container.innerHTML = appState.quests.map(q => {
                const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
                const text = isSrToEn ? (q.text || q.textEn) : (q.textEn || q.text);
                const rewardText = q.reward ? `+${q.reward} XP` : '';

                return `
                <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl shadow-sm border-2 ${q.completed ? 'border-yellow-400/60 bg-yellow-50/50 dark:bg-yellow-900/10' : 'border-slate-100 dark:border-slate-700'} flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="text-2xl shrink-0">${q.icon}</div>
                        <div class="min-w-0">
                            <div class="font-bold text-slate-800 dark:text-white text-sm truncate">${text}</div>
                            <div class="flex items-center gap-2 mt-1">
                                <div class="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div class="h-full ${q.completed ? 'bg-yellow-400' : 'bg-blue-500'} transition-all rounded-full" style="width: ${pct}%"></div>
                                </div>
                                <span class="text-[10px] font-black ${q.completed ? 'text-yellow-500' : 'text-slate-400'}">${q.completed ? '✅' : q.progress + '/' + q.target}</span>
                            </div>
                        </div>
                    </div>
                    <div class="shrink-0 text-right">
                        ${q.completed ? `<span class="text-[10px] font-black text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">${rewardText}</span>` : `<span class="text-[10px] font-bold text-slate-400">${rewardText}</span>`}
                    </div>
                </div>`;
            }).join('');

            // All-complete celebration banner
            if (allDone) {
                const chestClaimed = appState.questChestClaimed;
                container.innerHTML += `
                <div class="mt-2 p-3.5 rounded-2xl border-2 ${chestClaimed ? 'border-emerald-400/40 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20'} flex items-center justify-between gap-3 shadow-sm">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">${chestClaimed ? '✅' : '🎁'}</span>
                        <div>
                            <div class="text-sm font-black ${chestClaimed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}">
                                ${chestClaimed ? 'Sve Misije Završene!' : 'Tajanstvena Kutija Čeka!'}
                            </div>
                            <div class="text-[10px] font-bold text-slate-500">${chestClaimed ? 'Bonus +30 XP primljen' : 'Završi sve misije za nagradu!'}</div>
                        </div>
                    </div>
                    ${!chestClaimed ? `<button onclick="ShopEngine.checkAllQuestsComplete(); ShopEngine.renderQuests();" class="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-white text-xs font-black rounded-xl active:scale-95 transition-transform shadow-md">Otvori!</button>` : ''}
                </div>`;
            }
        },

        // --- Shop Modal UI ---
        openShop: function () {
            const modal = document.getElementById('shop-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            this.renderShop();
        },

        closeShop: function () {
            const modal = document.getElementById('shop-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        renderShop: function () {
            const appState = window.appState || window.state;
            const data = this.getShopData();
            const isSrToEn = appState?.settings?.learningDirection === 'sr_to_en';
            const itemsContainer = document.getElementById('shop-items-container');
            const balanceEl = document.getElementById('shop-xp-balance');

            if (balanceEl) {
                balanceEl.textContent = (appState?.xp || 0).toLocaleString();
            }

            // Streak freeze badge
            const freezeCountEl = document.getElementById('shop-freeze-count');
            if (freezeCountEl) {
                freezeCountEl.textContent = data.streakFreezes || 0;
            }

            // Double XP status
            const dxpEl = document.getElementById('shop-dxp-status');
            if (dxpEl) {
                if (this.isDoubleXpActive()) {
                    const mins = Math.round((data.doubleXpUntil - Date.now()) / 60000);
                    dxpEl.textContent = `⚡ Aktivan (${mins} min)`;
                    dxpEl.classList.remove('hidden');
                } else {
                    dxpEl.classList.add('hidden');
                }
            }

            if (!itemsContainer) return;

            itemsContainer.innerHTML = this.ITEMS.map(item => {
                const name = isSrToEn ? item.name : item.nameEn;
                const desc = isSrToEn ? item.desc : item.descEn;
                const canAfford = (appState?.xp || 0) >= item.cost;

                return `
                <div class="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-3 hover:border-slate-600 transition-colors">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="text-3xl shrink-0 w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">${item.iconHtml || item.icon}</span>
                        <div class="min-w-0">
                            <h4 class="text-sm font-black text-white truncate">${name}</h4>
                            <p class="text-[10px] font-bold text-slate-400 truncate">${desc}</p>
                        </div>
                    </div>
                    <button onclick="ShopEngine.buyItem('${item.id}')" class="shrink-0 py-2 px-3 ${canAfford ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'} font-black text-xs rounded-xl active:scale-95 transition-transform shadow-md flex items-center gap-1.5" ${canAfford ? '' : 'disabled'}>
                        <span>⚡</span> <span>${item.cost}</span>
                    </button>
                </div>`;
            }).join('');
        },

        buyItem: function (itemId) {
            const result = this.purchaseItem(itemId);
            if (result.success) {
                if (window.app && window.app.showToast) {
                    window.app.showToast(result.msg, 'success');
                }
                if (result.isChest && window.app && window.app.fireConfetti) {
                    setTimeout(() => window.app.fireConfetti(), 300);
                }
                if (window.app && window.app.playSound) {
                    window.app.playSound('level_up');
                }
            } else {
                if (window.app && window.app.showToast) {
                    window.app.showToast(result.msg, 'error');
                }
            }
            this.renderShop();
        }
    };

    window.ShopEngine = ShopEngine;
})();
