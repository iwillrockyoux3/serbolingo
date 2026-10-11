// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — Ghost Arena & Offline Multiplayer Engine (Priority 21 - Part 1)
 * 
 * Features:
 *  - Player Ghost Profile generator (accuracy %, answer speed, avatar, total XP)
 *  - Compact Base64 Friend Code serialization (`SL-GHOST-...`)
 *  - Friend Ghost import, storage, and validation
 *  - Head-to-head match simulation and win/loss tracking against friends' ghosts
 *  - UI Modal for managing Friend Codes and challenging Ghost Bots
 */

(function () {
    'use strict';

    const GhostEngine = {
        STORAGE_KEY: 'serbolingo_ghost_roster',
        ACTIVE_GHOST_KEY: 'serbolingo_active_ghost',

        // Built-in starter ghosts so users immediately have someone to race against
        DEFAULT_GHOSTS: [
            {
                id: 'ghost_starter_luka',
                u: 'Luka',
                a: '🐣',
                acc: 65,
                spd: 3.2,
                xp: 420,
                wins: 0,
                losses: 0,
                isStarter: true
            },
            {
                id: 'ghost_starter_milica',
                u: 'Milica',
                a: '🦊',
                acc: 88,
                spd: 1.9,
                xp: 2850,
                wins: 0,
                losses: 0,
                isStarter: true
            }
        ],

        getRoster: function () {
            try {
                const stored = localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    return JSON.parse(stored);
                }
            } catch (e) {}
            // Seed with default ghosts
            this.saveRoster(this.DEFAULT_GHOSTS);
            return [...this.DEFAULT_GHOSTS];
        },

        saveRoster: function (roster) {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(roster));
            } catch (e) {}
        },

        getMyGhostProfile: function () {
            const appState = window.appState || window.app?.state || {};
            const stats = appState.stats || {};
            
            // Calculate accuracy from app state if available
            const total = stats.totalAnswers || (stats.correctAnswers ? stats.correctAnswers + 10 : 30);
            const correct = stats.correctAnswers || 24;
            const accuracy = Math.min(99, Math.max(50, Math.round((correct / Math.max(1, total)) * 100)));

            const username = appState.profile?.username || 'Igrač';
            const avatar = appState.profile?.avatar || '🦁';
            const xp = appState.xp || 100;

            return {
                u: username,
                a: avatar,
                acc: accuracy,
                spd: 2.2,
                xp: xp,
                v: 1
            };
        },

        generateFriendCode: function () {
            const myProfile = this.getMyGhostProfile();
            const jsonStr = JSON.stringify(myProfile);
            // UTF-8 safe base64 encoding
            const b64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode('0x' + p1);
            }));
            return `SL-GHOST-${b64}`;
        },

        decodeFriendCode: function (code) {
            if (!code || typeof code !== 'string') return null;
            const clean = code.trim();
            if (!clean.startsWith('SL-GHOST-')) return null;

            try {
                const b64 = clean.substring(9);
                const jsonStr = decodeURIComponent(Array.prototype.map.call(atob(b64), (c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const parsed = JSON.parse(jsonStr);
                if (parsed.u && parsed.acc) {
                    return {
                        id: 'ghost_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                        u: parsed.u.substring(0, 16),
                        a: parsed.a || '👻',
                        acc: Math.min(99, Math.max(30, Number(parsed.acc) || 75)),
                        spd: Number(parsed.spd) || 2.5,
                        xp: Number(parsed.xp) || 0,
                        wins: 0,
                        losses: 0,
                        importedAt: Date.now()
                    };
                }
            } catch (err) {
                console.error('Invalid Friend Code', err);
            }
            return null;
        },

        importCode: function (code) {
            const ghost = this.decodeFriendCode(code);
            if (!ghost) {
                return { success: false, message: 'Nevažeći Kod Prijatelja. Proverite format (npr. SL-GHOST-...).' };
            }

            const roster = this.getRoster();
            // Check if already in roster
            const exists = roster.some(g => g.u.toLowerCase() === ghost.u.toLowerCase() && g.acc === ghost.acc);
            if (exists) {
                return { success: false, message: `Duh "${ghost.u}" već postoji u vašoj listi!` };
            }

            roster.unshift(ghost);
            this.saveRoster(roster);
            return { success: true, ghost: ghost };
        },

        deleteGhost: function (ghostId) {
            let roster = this.getRoster().filter(g => g.id !== ghostId);
            this.saveRoster(roster);
            this.renderModal();
        },

        recordMatchResult: function (ghostId, userWon) {
            if (!ghostId) return;
            const roster = this.getRoster();
            const g = roster.find(x => x.id === ghostId);
            if (g) {
                if (userWon) g.losses = (g.losses || 0) + 1;
                else g.wins = (g.wins || 0) + 1;
                this.saveRoster(roster);
            }
        },

        getActiveGhost: function () {
            const ghostId = localStorage.getItem(this.ACTIVE_GHOST_KEY);
            const roster = this.getRoster();
            if (ghostId) {
                const found = roster.find(g => g.id === ghostId);
                if (found) return found;
            }
            // Default to first ghost in roster
            return roster[0] || { id: 'marko_bot', u: 'Marko_Bot', a: '🤖', acc: 75, spd: 2.5 };
        },

        setActiveGhost: function (ghostId) {
            localStorage.setItem(this.ACTIVE_GHOST_KEY, ghostId);
        },

        openModal: function () {
            const modal = document.getElementById('ghost-arena-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            this.renderModal();
        },

        closeModal: function () {
            const modal = document.getElementById('ghost-arena-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        },

        copyMyCode: function () {
            const code = this.generateFriendCode();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code).then(() => {
                    if (window.app && window.app.showToast) {
                        window.app.showToast('📋 Tvoj Kod Prijatelja je kopiran!', 'success');
                    }
                }).catch(() => {
                    this._fallbackCopy(code);
                });
            } else {
                this._fallbackCopy(code);
            }
        },

        _fallbackCopy: function (text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            if (window.app && window.app.showToast) {
                window.app.showToast('📋 Tvoj Kod Prijatelja je kopiran!', 'success');
            }
        },

        submitImport: function () {
            const input = document.getElementById('ghost-import-input');
            if (!input) return;
            const res = this.importCode(input.value);
            if (res.success) {
                input.value = '';
                if (window.app && window.app.showToast) {
                    window.app.showToast(`🎉 Duh "${res.ghost.u}" (${res.ghost.acc}% preciznost) je dodat!`, 'success');
                }
                this.renderModal();
            } else {
                if (window.app && window.app.showToast) {
                    window.app.showToast(res.message, 'error');
                }
            }
        },

        challengeGhost: function (ghostId) {
            this.setActiveGhost(ghostId);
            this.closeModal();
            if (window.app && window.app.navigate) window.app.navigate('arcade');
            if (window.ArcadeEngine && typeof window.ArcadeEngine.preLaunch === 'function') {
                window.ArcadeEngine.preLaunch('startMillionaire');
            }
        },

        renderModal: function () {
            const myGhost = this.getMyGhostProfile();
            const myCode = this.generateFriendCode();
            const roster = this.getRoster();
            const activeGhost = this.getActiveGhost();

            const myContainer = document.getElementById('ghost-my-profile-container');
            if (myContainer) {
                myContainer.innerHTML = `
                    <div class="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-3xl shadow-inner">
                                ${myGhost.a}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2">
                                    <h4 class="text-xl font-black text-white truncate">${myGhost.u}</h4>
                                    <span class="px-2 py-0.5 bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase rounded-md border border-indigo-400/30">Tvoj Duh</span>
                                </div>
                                <div class="flex items-center gap-3 mt-1.5 text-xs font-bold text-slate-300">
                                    <span class="text-amber-400">⚡ ${myGhost.xp} XP</span>
                                    <span class="text-emerald-400">🎯 ${myGhost.acc}% Preciznost</span>
                                </div>
                            </div>
                        </div>

                        <!-- Share Box -->
                        <div class="mt-4 pt-4 border-t border-indigo-500/20 flex flex-col sm:flex-row items-center gap-2">
                            <input readonly type="text" value="${myCode}" class="w-full bg-slate-950/80 border border-indigo-500/30 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 select-all truncate focus:outline-none">
                            <button onclick="GhostEngine.copyMyCode()" class="w-full sm:w-auto shrink-0 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                                <span>📋</span> <span>Kopiraj Kod</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            const rosterContainer = document.getElementById('ghost-roster-list');
            if (rosterContainer) {
                if (roster.length === 0) {
                    rosterContainer.innerHTML = `
                        <div class="p-6 text-center text-slate-500 text-xs font-bold bg-slate-900/50 rounded-2xl border border-slate-800">
                            Nema uvezenih prijatelja. Unesi kod prijatelja iznad!
                        </div>
                    `;
                } else {
                    rosterContainer.innerHTML = roster.map(g => {
                        const isSelected = activeGhost && activeGhost.id === g.id;
                        return `
                            <div class="p-3.5 bg-slate-900 border-2 ${isSelected ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800 hover:border-slate-700'} rounded-2xl flex items-center justify-between gap-3 transition-all">
                                <div class="flex items-center gap-3 min-w-0">
                                    <span class="text-2xl w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">${g.a || '👻'}</span>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-1.5">
                                            <h5 class="text-sm font-black text-white truncate">${g.u}</h5>
                                            ${g.isStarter ? '<span class="text-[9px] px-1.5 bg-slate-800 text-slate-400 rounded font-bold">Starter</span>' : ''}
                                        </div>
                                        <div class="text-[11px] font-bold text-slate-400 flex items-center gap-2 mt-0.5">
                                            <span class="text-cyan-400">🎯 ${g.acc}% preciznost</span>
                                            <span>•</span>
                                            <span class="text-slate-400">Duel: <b class="text-green-400">${g.losses || 0}W</b> - <b class="text-red-400">${g.wins || 0}L</b></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex items-center gap-1.5 shrink-0">
                                    <button onclick="GhostEngine.challengeGhost('${g.id}')" class="py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-md active:scale-95 transition-transform flex items-center gap-1">
                                        <span>⚔️</span> <span>Duel</span>
                                    </button>
                                    ${!g.isStarter ? `
                                        <button onclick="GhostEngine.deleteGhost('${g.id}')" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-500 flex items-center justify-center text-xs transition-colors">
                                            🗑️
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }
        }
    };

    window.GhostEngine = GhostEngine;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GhostEngine.getRoster());
    } else {
        GhostEngine.getRoster();
    }
})();
