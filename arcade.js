// [SHIELD_DAEMON: VALIDATED]
const ArcadeEngine = {
    _timers: [],
    
    _getWords: function(count) {
        const dir = (window.appState?.settings?.learningDirection) || 'sr_to_en';
        const script = (window.appState?.settings?.script) || 'latin';
        const srKey = script === 'cyrillic' ? 'sr_cyr' : 'sr_lat';
        const pool = (typeof DICTIONARY !== 'undefined' ? DICTIONARY : (window.appDb?.getAllWords ? window.appDb.getAllWords() : [])).slice();
        
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        
        const words = pool.slice(0, Math.min(count, pool.length));
        return words.map(w => ({
            source: dir === 'sr_to_en' ? w[srKey] : w.en,
            target: dir === 'sr_to_en' ? w.en : w[srKey],
            emoji: w.emoji || '',
            original: w
        }));
    },

    _showOverlay: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        if (overlay) overlay.classList.remove('hidden');
    },

    _hideOverlay: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        if (overlay) {
            overlay.innerHTML = '';
            overlay.classList.add('hidden');
        }
        this._cleanup();
    },

    _cleanup: function() {
        this._timers.forEach(t => {
            clearTimeout(t);
            clearInterval(t);
        });
        this._timers = [];
        
        if (this._reqAnim) {
            cancelAnimationFrame(this._reqAnim);
            this._reqAnim = null;
        }
    },

    _awardXpBoost: function() {
        if (window.appState && window.appState.inventory) {
            window.appState.inventory.xpBoosts = (window.appState.inventory.xpBoosts || 0) + 1;
            if (window.app && window.app.saveStats) window.app.saveStats();
            if (window.app && window.app.showToast) window.app.showToast('XP Boost Awarded!', 'success');
        }
    },

    _renderHeader: function(title, level, maxLevel, lives, score) {
        let livesHtml = '';
        if (lives !== null) {
            livesHtml = `<div>Lives: ${'❤️'.repeat(lives)}</div>`;
        }
        let scoreHtml = score !== null ? `<div>Score: ${score}</div>` : '';
        let levelHtml = level !== null ? `<div>Level: ${level}${maxLevel ? '/' + maxLevel : ''}</div>` : '';
        
        let botHtml = '';
        if (ArcadeEngine.currentMode === 'bot' || ArcadeEngine.currentMode === 'ghost') {
            const activeGhost = window.GhostEngine ? window.GhostEngine.getActiveGhost() : { a: '🤖', u: 'Marko_Bot', acc: 75 };
            const label = (ArcadeEngine.currentMode === 'ghost' && activeGhost) 
                ? `${activeGhost.a || '👻'} ${activeGhost.u} (${activeGhost.acc}%)` 
                : `🤖 Marko_Bot`;
            botHtml = `
                <div class="flex-1 max-w-xs mx-4">
                    <div class="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden shadow-inner">
                        <div id="bot-progress" class="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)] transition-all duration-500 ease-linear" style="width: 0%"></div>
                    </div>
                    <div class="text-[10px] text-center text-red-400 mt-1 font-black uppercase tracking-wider" id="bot-name-label">${label}</div>
                </div>
            `;
        }

        return `
            <div class="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700 text-white w-full">
                <div class="font-black text-lg whitespace-nowrap">${title}</div>
                ${botHtml}
                <div class="flex space-x-4 text-sm font-bold text-gray-300 whitespace-nowrap">
                    ${levelHtml}
                    ${livesHtml}
                    ${scoreHtml}
                </div>
                <button onclick="ArcadeEngine._hideOverlay()" class="text-2xl font-bold hover:text-red-400 transition-colors ml-4">&times;</button>
            </div>
        `;
    },

    _renderGameOver: function(title, score, playAgainFnName) {
        return `
            <div class="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white p-6 text-center">
                <h2 class="text-4xl font-bold mb-4">Game Over</h2>
                <h3 class="text-2xl mb-8">${title}</h3>
                <p class="text-xl mb-8">Final Score: ${score}</p>
                <button onclick="ArcadeEngine.${playAgainFnName}()" class="px-6 py-3 bg-blue-600 rounded-lg text-xl mb-4 font-bold">Play Again</button>
                <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-600 rounded-lg text-xl font-bold">Back to Arcade</button>
            </div>
        `;
    },

    _renderLevelComplete: function(level, nextFnStr) {
        return `
            <div class="flex flex-col items-center justify-center h-full w-full bg-gray-900 text-white p-6 text-center">
                <h2 class="text-4xl font-bold mb-4 text-green-400">Level ${level} Complete!</h2>
                <button onclick="${nextFnStr}" class="px-6 py-3 bg-green-600 rounded-lg text-xl font-bold mt-8">Next Level</button>
            </div>
        `;
    },

    _playSound: function(type) {
        if (window.app && window.app.playSound) window.app.playSound(type);
    },

    _speak: function(text) {
        const lang = (window.appState?.settings?.learningDirection === 'sr_to_en') ? 'en-US' : 'sr-RS';
        if (window.app && window.app.speakPhrase) window.app.speakPhrase(text, lang);
    },

    startBotOpponent: function(customGhost) {
        let progress = 0;
        const ghost = customGhost || (window.GhostEngine ? window.GhostEngine.getActiveGhost() : { acc: 75, spd: 2.5, u: 'Marko_Bot' });
        const hitChance = Math.max(0.35, Math.min(0.95, (ghost.acc || 75) / 100));
        const speedFactor = Math.max(0.6, 2.5 / Math.max(1, ghost.spd || 2.5));

        const botTimer = setInterval(() => {
            if (Math.random() < hitChance) {
                progress += (Math.random() * 6 + 2) * speedFactor;
                if (progress > 100) progress = 100;
                
                const bar = document.getElementById('bot-progress');
                if (bar) bar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(botTimer);
                    if (window.GhostEngine && ghost.id) {
                        window.GhostEngine.recordMatchResult(ghost.id, false);
                    }
                    const overlay = document.getElementById('arcade-game-overlay');
                    if (overlay) {
                        ArcadeEngine._playSound('wrong');
                        overlay.innerHTML = ArcadeEngine._renderGameOver((ghost.u || 'Bot') + ' te je pobedio!', 0, 'startMillionaire');
                    }
                }
            }
        }, 1000);
        this._timers.push({ clear: () => clearInterval(botTimer) });
    },

    // 1. Millionaire
    startMillionaire: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let currentQuestion = 1;
        const totalQuestions = 15;
        let words = this._getWords(totalQuestions + 10);
        let usedFiftyFifty = false;
        
        const renderQuestion = () => {
            if (currentQuestion > totalQuestions) {
                this._awardXpBoost();
                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                        <h2 class="text-4xl font-bold text-yellow-400 mb-4">YOU ARE A MILLIONAIRE!</h2>
                        <p class="text-xl mb-8">XP Boost Awarded!</p>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-blue-600 rounded-lg text-xl font-bold">Awesome</button>
                    </div>
                `;
                return;
            }
            
            const targetWord = words[currentQuestion - 1];
            let options = this._getWords(4).filter(w => w.target !== targetWord.target).slice(0, 3);
            options.push(targetWord);
            options.sort(() => Math.random() - 0.5);
            
            window.millionaireAnswer = (idx) => {
                if (options[idx].target === targetWord.target) {
                    this._playSound('correct');
                    currentQuestion++;
                    renderQuestion();
                } else {
                    this._playSound('incorrect');
                    overlay.innerHTML = this._renderGameOver('Who Wants to Be a Millionaire', currentQuestion - 1, 'startMillionaire');
                }
            };
            
            window.millionaireFiftyFifty = () => {
                if (usedFiftyFifty) return;
                usedFiftyFifty = true;
                let removed = 0;
                options.forEach((opt, idx) => {
                    if (opt.target !== targetWord.target && removed < 2) {
                        document.getElementById('mil-opt-' + idx).style.visibility = 'hidden';
                        removed++;
                    }
                });
                document.getElementById('mil-btn-5050').classList.add('opacity-50', 'pointer-events-none');
            };
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-blue-900 text-white">
                    ${this._renderHeader('Millionaire', currentQuestion, totalQuestions, null, null)}
                    <div class="flex-grow flex flex-col p-4 items-center justify-center">
                        <div class="flex space-x-4 mb-8">
                            <button id="mil-btn-5050" onclick="millionaireFiftyFifty()" class="px-4 py-2 bg-yellow-600 rounded-full font-bold ${usedFiftyFifty ? 'opacity-50' : ''}">50:50</button>
                        </div>
                        <div class="bg-blue-800 p-6 rounded-xl w-full text-center text-2xl font-bold mb-8 border-2 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                            What is the translation of<br/>"${targetWord.source}" ${targetWord.emoji}?
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                            ${options.map((opt, i) => `
                                <button id="mil-opt-${i}" onclick="millionaireAnswer(${i})" class="bg-blue-700 hover:bg-blue-600 border border-yellow-500 rounded-full py-4 text-xl font-bold text-left px-6">
                                    <span class="text-yellow-500 mr-2">${String.fromCharCode(65+i)}:</span> ${opt.target}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        };
        
        renderQuestion();
    },

    // 2. Match Pairs
    startMatchPairs: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        const maxLevel = 10;
        
        window.matchPairsNext = () => {
            if (level > maxLevel) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Match Pairs', 'Won!', 'startMatchPairs');
                return;
            }
            
            const pairCount = Math.min(4 + Math.floor(level / 2), 8);
            const distractorCount = Math.floor(level / 2);
            let words = this._getWords(pairCount + distractorCount);
            let pairs = words.slice(0, pairCount);
            
            let sourceItems = pairs.map(p => ({ id: p.source, text: p.source, type: 'source' }));
            let targetItems = pairs.map(p => ({ id: p.source, text: p.target, type: 'target' }));
            
            sourceItems.sort(() => Math.random() - 0.5);
            targetItems.sort(() => Math.random() - 0.5);
            
            let selectedSource = null;
            let selectedTarget = null;
            let matched = 0;
            
            window.matchSelect = (type, idx, id) => {
                const el = document.getElementById(`mp-${type}-${idx}`);
                if (el.classList.contains('invisible')) return;
                
                if (type === 'source') {
                    if (selectedSource) document.getElementById(`mp-source-${selectedSource.idx}`).classList.remove('bg-blue-500');
                    selectedSource = {idx, id};
                    el.classList.add('bg-blue-500');
                } else {
                    if (selectedTarget) document.getElementById(`mp-target-${selectedTarget.idx}`).classList.remove('bg-blue-500');
                    selectedTarget = {idx, id};
                    el.classList.add('bg-blue-500');
                }
                
                if (selectedSource && selectedTarget) {
                    if (selectedSource.id === selectedTarget.id) {
                        this._playSound('correct');
                        document.getElementById(`mp-source-${selectedSource.idx}`).classList.add('invisible');
                        document.getElementById(`mp-target-${selectedTarget.idx}`).classList.add('invisible');
                        matched++;
                        selectedSource = null;
                        selectedTarget = null;
                        if (matched === pairCount) {
                            level++;
                            overlay.innerHTML = this._renderLevelComplete(level - 1, 'matchPairsNext()');
                        }
                    } else {
                        this._playSound('incorrect');
                        document.getElementById(`mp-source-${selectedSource.idx}`).classList.remove('bg-blue-500');
                        document.getElementById(`mp-target-${selectedTarget.idx}`).classList.remove('bg-blue-500');
                        document.getElementById(`mp-source-${selectedSource.idx}`).classList.add('bg-red-500');
                        document.getElementById(`mp-target-${selectedTarget.idx}`).classList.add('bg-red-500');
                        setTimeout(() => {
                            const sEl = document.getElementById(`mp-source-${selectedSource?.idx}`);
                            const tEl = document.getElementById(`mp-target-${selectedTarget?.idx}`);
                            if(sEl) sEl.classList.remove('bg-red-500');
                            if(tEl) tEl.classList.remove('bg-red-500');
                            selectedSource = null;
                            selectedTarget = null;
                        }, 500);
                    }
                }
            };
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-gray-900 text-white">
                    ${this._renderHeader('Match Pairs', level, maxLevel, null, null)}
                    <div class="flex-grow flex p-4 justify-center gap-4 max-w-lg mx-auto w-full">
                        <div class="flex flex-col gap-2 w-1/2">
                            ${sourceItems.map((item, i) => `
                                <div id="mp-source-${i}" onclick="matchSelect('source', ${i}, '${item.id}')" class="p-4 bg-gray-700 rounded-lg text-center font-bold cursor-pointer transition-colors select-none text-sm sm:text-base break-words flex items-center justify-center min-h-[60px]">${item.text}</div>
                            `).join('')}
                        </div>
                        <div class="flex flex-col gap-2 w-1/2">
                            ${targetItems.map((item, i) => `
                                <div id="mp-target-${i}" onclick="matchSelect('target', ${i}, '${item.id}')" class="p-4 bg-gray-700 rounded-lg text-center font-bold cursor-pointer transition-colors select-none text-sm sm:text-base break-words flex items-center justify-center min-h-[60px]">${item.text}</div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        };
        matchPairsNext();
    },

    // 3. Speed Typer
    startSpeedTyper: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        let lives = 3;
        let score = 0;
        let wordsMatched = 0;
        let activeWords = [];
        let spawnIntervalId = null;
        
        const nextLevel = () => {
            if (level >= 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Speed Typer', score, 'startSpeedTyper');
                return;
            }
            level++;
            startLevel();
        };
        
        const startLevel = () => {
            activeWords = [];
            wordsMatched = 0;
            const wordsToMatch = 5 + level * 2;
            const wordsPool = this._getWords(50);
            const fallDuration = Math.max(1.5, 4 - (level * 0.25));
            const spawnRate = Math.max(800, 2500 - (level * 150));
            
            if (!document.getElementById('style-speedtyper')) {
                const style = document.createElement('style');
                style.id = 'style-speedtyper';
                style.innerHTML = `
                    @keyframes fallDown {
                        from { top: 0px; }
                        to { top: 100%; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-gray-900 text-white relative overflow-hidden" id="speed-typer-container">
                    ${this._renderHeader('Speed Typer', level, 10, lives, score)}
                    <div id="game-area" class="flex-grow relative w-full h-full"></div>
                    <div class="p-4 bg-gray-800 z-10 relative">
                        <input type="text" id="typer-input" class="w-full p-4 rounded text-black font-bold text-xl" placeholder="Type translation here..." autocomplete="off">
                    </div>
                </div>
            `;
            
            const input = document.getElementById('typer-input');
            const gameArea = document.getElementById('game-area');
            if (input) input.focus();
            
            input.addEventListener('input', (e) => {
                const val = e.target.value.trim().toLowerCase();
                const matchedIdx = activeWords.findIndex(w => w.target.toLowerCase() === val && !w.matched);
                if (matchedIdx !== -1) {
                    const w = activeWords[matchedIdx];
                    w.matched = true;
                    w.el.remove();
                    e.target.value = '';
                    score += 10;
                    wordsMatched++;
                    this._playSound('correct');
                    updateHeader();
                    if (wordsMatched >= wordsToMatch) {
                        clearInterval(spawnIntervalId);
                        overlay.innerHTML = this._renderLevelComplete(level, 'ArcadeEngine.startSpeedTyper_next()');
                    }
                }
            });
            
            window.ArcadeEngine.startSpeedTyper_next = nextLevel;
            
            const spawnWord = () => {
                if (wordsMatched >= wordsToMatch) return;
                const w = wordsPool[Math.floor(Math.random() * wordsPool.length)];
                const el = document.createElement('div');
                el.className = 'absolute bg-blue-600 px-4 py-2 rounded shadow font-bold';
                el.textContent = w.source;
                el.style.left = Math.max(5, Math.random() * 70) + '%';
                el.style.animation = `fallDown ${fallDuration}s linear forwards`;
                
                const wordObj = { ...w, el, matched: false };
                activeWords.push(wordObj);
                gameArea.appendChild(el);
                
                el.addEventListener('animationend', () => {
                    if (!wordObj.matched) {
                        lives--;
                        this._playSound('incorrect');
                        el.remove();
                        updateHeader();
                        if (lives <= 0) {
                            clearInterval(spawnIntervalId);
                            overlay.innerHTML = this._renderGameOver('Speed Typer', score, 'startSpeedTyper');
                        }
                    }
                });
            };
            
            spawnIntervalId = setInterval(spawnWord, spawnRate);
            this._timers.push(spawnIntervalId);
        };
        
        const updateHeader = () => {
            const container = document.getElementById('speed-typer-container');
            if (container && container.firstElementChild) {
                container.firstElementChild.outerHTML = this._renderHeader('Speed Typer', level, 10, lives, score);
            }
        };
        
        startLevel();
    },

    // 4. Whack A Word
    startWhackAWord: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        let lives = 3;
        let score = 0;
        let currentTarget = null;
        let whackInterval = null;
        
        window.whackNextLevel = () => {
            if (level > 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Whack A Word', score, 'startWhackAWord');
                return;
            }
            startLevel();
        };
        
        const startLevel = () => {
            const words = this._getWords(20);
            currentTarget = words[Math.floor(Math.random() * words.length)];
            const flashDuration = Math.max(600, 1500 - (level * 90));
            let targetsHit = 0;
            const targetsNeeded = 5 + level;
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-green-900 text-white" id="whack-container">
                    ${this._renderHeader('Whack a Word', level, 10, lives, score)}
                    <div class="text-center p-4 bg-green-800 text-2xl font-bold">Target: ${currentTarget.source}</div>
                    <div class="flex-grow flex items-center justify-center p-4">
                        <div class="grid grid-cols-3 gap-2 w-full max-w-sm aspect-square" id="whack-grid">
                            ${Array(9).fill(0).map((_, i) => `<div id="whack-cell-${i}" class="bg-green-700 rounded-lg flex items-center justify-center text-center p-2 font-bold break-words cursor-pointer active:bg-green-600 overflow-hidden text-sm sm:text-base"></div>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            window.whackTap = (idx, isTarget) => {
                const cell = document.getElementById(`whack-cell-${idx}`);
                if (!cell.textContent) return;
                
                if (isTarget) {
                    this._playSound('correct');
                    score += 10;
                    targetsHit++;
                    cell.textContent = '';
                    cell.onclick = null;
                    cell.classList.replace('bg-blue-500', 'bg-green-700');
                    if (targetsHit >= targetsNeeded) {
                        clearInterval(whackInterval);
                        level++;
                        overlay.innerHTML = this._renderLevelComplete(level - 1, 'whackNextLevel()');
                    } else {
                        currentTarget = words[Math.floor(Math.random() * words.length)];
                        const tc = document.querySelector('#whack-container .text-center.p-4');
                        if (tc) tc.textContent = 'Target: ' + currentTarget.source;
                        updateHeader();
                    }
                } else {
                    this._playSound('incorrect');
                    lives--;
                    updateHeader();
                    if (lives <= 0) {
                        clearInterval(whackInterval);
                        overlay.innerHTML = this._renderGameOver('Whack A Word', score, 'startWhackAWord');
                    }
                }
            };
            
            const updateHeader = () => {
                const container = document.getElementById('whack-container');
                if (container && container.firstElementChild) {
                    container.firstElementChild.outerHTML = this._renderHeader('Whack a Word', level, 10, lives, score);
                }
            };
            
            const tick = () => {
                for(let i=0; i<9; i++) {
                    const c = document.getElementById(`whack-cell-${i}`);
                    if(c) {
                        c.textContent = '';
                        c.onclick = null;
                        c.classList.remove('bg-blue-500', 'bg-red-500');
                        c.classList.add('bg-green-700');
                    }
                }
                
                let cells = [0,1,2,3,4,5,6,7,8].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(level/3));
                let targetCell = cells[0];
                
                cells.forEach(idx => {
                    const c = document.getElementById(`whack-cell-${idx}`);
                    if (!c) return;
                    let isTarget = idx === targetCell;
                    let w = isTarget ? currentTarget : words[Math.floor(Math.random() * words.length)];
                    if(!isTarget && w.target === currentTarget.target) w = words.find(x => x.target !== currentTarget.target) || words[0];
                    
                    c.textContent = w.target;
                    c.classList.remove('bg-green-700');
                    c.classList.add(isTarget ? 'bg-blue-500' : 'bg-red-500');
                    c.onclick = () => whackTap(idx, isTarget);
                });
            };
            
            whackInterval = setInterval(tick, flashDuration);
            this._timers.push(whackInterval);
            tick();
        };
        
        startLevel();
    },

    // 5. Hangman
    startHangman: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        let words = this._getWords(20).sort((a,b) => a.target.length - b.target.length);
        
        window.hangmanNext = () => {
            if (level > 10 || level > words.length) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Hangman', 'Won!', 'startHangman');
                return;
            }
            
            let targetWord = words[level-1];
            let answer = targetWord.target.toUpperCase();
            let guessed = new Set();
            let wrong = 0;
            const maxWrong = 6;
            
            const isCyr = (window.appState?.settings?.script === 'cyrillic');
            const letters = isCyr ? 'АБВГДЂЕЖЗИЈКЛЉМНЊОПРСТЋУФХЦЧЏШ'.split('') : 'ABCDEFGHIJKLMNOPQRSTUVWXYZČĆŽŠĐ'.split('');
            
            const render = () => {
                let display = answer.split('').map(c => {
                    if(c === ' ') return '&nbsp;&nbsp;';
                    if(!c.match(/[A-ZČĆŽŠĐА-Ш]/i)) return c;
                    return guessed.has(c) ? c : '_';
                }).join(' ');
                
                let isWin = answer.split('').every(c => c === ' ' || !c.match(/[A-ZČĆŽŠĐА-Ш]/i) || guessed.has(c));
                
                if (isWin) {
                    this._playSound('correct');
                    level++;
                    overlay.innerHTML = this._renderLevelComplete(level - 1, 'hangmanNext()');
                    return;
                }
                if (wrong >= maxWrong) {
                    this._playSound('incorrect');
                    overlay.innerHTML = this._renderGameOver('Hangman', `Failed! Word was: ${answer}`, 'startHangman');
                    return;
                }
                
                window.hangmanGuess = (l) => {
                    if (guessed.has(l)) return;
                    guessed.add(l);
                    if (!answer.includes(l)) {
                        wrong++;
                    }
                    render();
                };
                
                overlay.innerHTML = `
                    <div class="flex flex-col h-full bg-gray-900 text-white">
                        ${this._renderHeader('Hangman', level, 10, null, null)}
                        <div class="flex-grow flex flex-col items-center justify-center p-4">
                            <div class="text-xl text-gray-400 mb-2">Translate:</div>
                            <div class="text-3xl font-bold mb-8 text-center text-blue-400">${targetWord.source}</div>
                            
                            <div class="w-32 h-32 border-2 border-gray-600 mb-8 flex items-center justify-center relative">
                                <div class="text-xs text-red-500 font-mono text-center">Parts drawn:<br/>${wrong}/${maxWrong}</div>
                            </div>
                            
                            <div class="text-4xl font-mono tracking-widest mb-12 text-center break-words w-full px-4">${display}</div>
                            
                            <div class="flex flex-wrap justify-center gap-2 max-w-2xl">
                                ${letters.map(l => `
                                    <button onclick="hangmanGuess('${l}')" class="w-10 h-10 rounded ${guessed.has(l) ? (answer.includes(l) ? 'bg-green-600' : 'bg-red-600 opacity-50') : 'bg-gray-700 hover:bg-gray-600'} font-bold">${l}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            };
            render();
        };
        hangmanNext();
    },

    // 6. Word Scramble
    startWordScramble: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        let level = 1;
        let words = this._getWords(20).filter(w => w.target.length > 3).sort((a,b) => a.target.length - b.target.length);
        let timerId = null;
        
        window.scrambleNext = () => {
            if (level > 10 || level > words.length) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Word Scramble', 'Won!', 'startWordScramble');
                return;
            }
            
            let targetWord = words[level-1];
            let answer = targetWord.target.toUpperCase().replace(/\s+/g, '');
            let scrambled = answer.split('').sort(() => Math.random() - 0.5);
            let selected = [];
            let timeLeft = 15;
            
            const checkAnswer = () => {
                if (selected.length === answer.length) {
                    if (selected.join('') === answer) {
                        this._playSound('correct');
                        clearInterval(timerId);
                        level++;
                        overlay.innerHTML = this._renderLevelComplete(level - 1, 'scrambleNext()');
                    } else {
                        selected = [];
                        render();
                    }
                }
            };
            
            window.scrambleTap = (idx) => {
                selected.push(scrambled[idx]);
                scrambled.splice(idx, 1);
                render();
                checkAnswer();
            };
            
            window.scrambleUndo = () => {
                if(selected.length > 0) {
                    scrambled.push(selected.pop());
                    render();
                }
            };
            
            const render = () => {
                const headerHtml = this._renderHeader('Word Scramble', level, 10, null, null);
                overlay.innerHTML = `
                    <div class="flex flex-col h-full bg-purple-900 text-white relative">
                        ${headerHtml}
                        <div class="absolute top-16 right-4 text-2xl font-bold text-yellow-400" id="scramble-timer">${timeLeft}s</div>
                        <div class="flex-grow flex flex-col items-center justify-center p-4">
                            <div class="text-xl text-gray-300 mb-2">What is:</div>
                            <div class="text-4xl font-bold mb-8 text-center">${targetWord.source} ${targetWord.emoji}</div>
                            
                            <div class="h-16 flex gap-2 mb-8 bg-purple-800 p-2 rounded min-w-[200px] justify-center items-center cursor-pointer" onclick="scrambleUndo()">
                                ${selected.map(l => `<div class="w-10 h-10 bg-purple-600 rounded flex items-center justify-center font-bold text-xl">${l}</div>`).join('')}
                                ${selected.length === 0 ? '<span class="text-gray-400 text-sm">Tap letters below (Tap here to undo)</span>' : ''}
                            </div>
                            
                            <div class="flex flex-wrap justify-center gap-3 max-w-lg">
                                ${scrambled.map((l, i) => `
                                    <button onclick="scrambleTap(${i})" class="w-12 h-12 bg-indigo-600 rounded-lg shadow-lg flex items-center justify-center font-bold text-2xl active:scale-95 transition-transform">${l}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            };
            
            clearInterval(timerId);
            timerId = setInterval(() => {
                timeLeft--;
                const tEl = document.getElementById('scramble-timer');
                if(tEl) tEl.textContent = timeLeft + 's';
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    this._playSound('incorrect');
                    overlay.innerHTML = this._renderGameOver('Word Scramble', `Timeout!`, 'startWordScramble');
                }
            }, 1000);
            this._timers.push(timerId);
            
            render();
        };
        scrambleNext();
    },

    // 7. Audio Survival
    startAudioSurvival: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        let lives = 3;
        let score = 0;
        let words = this._getWords(30);
        
        window.audioNext = () => {
            if (level > 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Audio Survival', score, 'startAudioSurvival');
                return;
            }
            
            let targetWord = words[level-1];
            let options = this._getWords(4).filter(w => w.target !== targetWord.target).slice(0, 3);
            options.push(targetWord);
            options.sort(() => Math.random() - 0.5);
            
            setTimeout(() => this._speak(targetWord.source), 500);
            
            window.audioReplay = () => this._speak(targetWord.source);
            
            window.audioAnswer = (idx) => {
                if (options[idx].target === targetWord.target) {
                    this._playSound('correct');
                    score += 100;
                    level++;
                    overlay.innerHTML = this._renderLevelComplete(level - 1, 'audioNext()');
                } else {
                    this._playSound('incorrect');
                    lives--;
                    if(lives <= 0) {
                        overlay.innerHTML = this._renderGameOver('Audio Survival', score, 'startAudioSurvival');
                    } else {
                        render();
                    }
                }
            };
            
            const render = () => {
                overlay.innerHTML = `
                    <div class="flex flex-col h-full bg-teal-900 text-white">
                        ${this._renderHeader('Audio Survival', level, 10, lives, score)}
                        <div class="flex-grow flex flex-col items-center justify-center p-4">
                            <button onclick="audioReplay()" class="w-32 h-32 bg-teal-600 rounded-full flex items-center justify-center mb-12 shadow-[0_0_20px_rgba(20,184,166,0.5)] active:bg-teal-500">
                                <span class="text-6xl">🔊</span>
                            </button>
                            <div class="text-xl mb-6">Select the translation:</div>
                            <div class="grid grid-cols-2 gap-4 w-full max-w-md">
                                ${options.map((opt, i) => `
                                    <button onclick="audioAnswer(${i})" class="bg-teal-700 p-4 rounded-lg text-xl font-bold break-words">${opt.target}</button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
            };
            render();
        };
        audioNext();
    },

    // 8. Memory Flip
    startMemoryFlip: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        
        window.memoryNext = () => {
            if (level > 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Memory Flip', 'Won!', 'startMemoryFlip');
                return;
            }
            
            let totalCards = 6;
            if(level >= 3) totalCards = 8;
            if(level >= 5) totalCards = 12;
            if(level >= 8) totalCards = 16;
            if(level >= 10) totalCards = 20;
            
            let pairs = totalCards / 2;
            let words = this._getWords(pairs);
            
            let cards = [];
            words.forEach((w, i) => {
                cards.push({ id: i, text: w.source, matchId: i, type: 'source' });
                cards.push({ id: i, text: w.target, matchId: i, type: 'target' });
            });
            cards.sort(() => Math.random() - 0.5);
            
            let flipped = [];
            let matched = 0;
            let canFlip = true;
            
            window.memoryFlip = (idx) => {
                if (!canFlip || flipped.includes(idx) || document.getElementById(`mem-card-${idx}`).classList.contains('invisible')) return;
                
                flipped.push(idx);
                renderCards();
                
                if (flipped.length === 2) {
                    canFlip = false;
                    const c1 = cards[flipped[0]];
                    const c2 = cards[flipped[1]];
                    
                    if (c1.matchId === c2.matchId && c1.type !== c2.type) {
                        setTimeout(() => {
                            this._playSound('correct');
                            document.getElementById(`mem-card-${flipped[0]}`).classList.add('invisible');
                            document.getElementById(`mem-card-${flipped[1]}`).classList.add('invisible');
                            flipped = [];
                            matched++;
                            canFlip = true;
                            if (matched === pairs) {
                                level++;
                                overlay.innerHTML = this._renderLevelComplete(level - 1, 'memoryNext()');
                            }
                        }, 500);
                    } else {
                        setTimeout(() => {
                            this._playSound('incorrect');
                            flipped = [];
                            canFlip = true;
                            renderCards();
                        }, 1000);
                    }
                }
            };
            
            const cols = totalCards <= 8 ? 2 : (totalCards <= 12 ? 3 : 4);
            
            const renderCards = () => {
                const container = document.getElementById('memory-grid');
                if(!container) return;
                container.innerHTML = cards.map((c, i) => {
                    const isFlipped = flipped.includes(i);
                    return `
                        <div id="mem-card-${i}" onclick="memoryFlip(${i})" class="bg-indigo-600 rounded-lg flex items-center justify-center p-2 text-center cursor-pointer select-none transition-transform transform ${isFlipped ? 'rotate-y-180 bg-indigo-500' : ''}" style="perspective: 1000px;">
                            <div class="font-bold text-sm sm:text-base break-words w-full h-full flex items-center justify-center">
                                ${isFlipped ? c.text : '❓'}
                            </div>
                        </div>
                    `;
                }).join('');
            };
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-gray-900 text-white">
                    ${this._renderHeader('Memory Flip', level, 10, null, null)}
                    <div class="flex-grow flex items-center justify-center p-4">
                        <div id="memory-grid" class="grid gap-2 w-full max-w-xl aspect-[3/4]" style="grid-template-columns: repeat(${cols}, minmax(0, 1fr)); grid-template-rows: repeat(${Math.ceil(totalCards/cols)}, minmax(0, 1fr));">
                        </div>
                    </div>
                </div>
            `;
            renderCards();
        };
        memoryNext();
    },

    // 9. Snake
    startSnake: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        let score = 0;
        let grid = 15;
        let snake = [{x: 7, y: 7}];
        let dx = 0;
        let dy = 0;
        let foods = [];
        let targetWord = null;
        let words = this._getWords(50);
        let loopTimer = null;
        
        const speed = 200;
        
        const spawnFoods = () => {
            targetWord = words[Math.floor(Math.random() * words.length)];
            let options = this._getWords(3).filter(w => w.target !== targetWord.target).slice(0, 2);
            options.push(targetWord);
            options.sort(() => Math.random() - 0.5);
            
            foods = options.map(opt => ({
                x: Math.floor(Math.random() * grid),
                y: Math.floor(Math.random() * (grid-2)) + 2,
                word: opt
            }));
            
            const tgtEl = document.getElementById('snake-target');
            if(tgtEl) tgtEl.textContent = `Target: ${targetWord.source}`;
        };
        
        const startLevel = () => {
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-black text-white touch-none" id="snake-container">
                    ${this._renderHeader('Snake', level, 10, null, score)}
                    <div id="snake-target" class="text-center p-2 bg-gray-800 font-bold text-xl text-yellow-400">Target: ...</div>
                    
                    <div class="flex-grow relative w-full flex items-center justify-center p-2">
                        <div id="snake-grid" class="relative bg-gray-900 border border-gray-700 w-full max-w-md aspect-square"></div>
                    </div>
                    
                    <div class="p-4 grid grid-cols-3 grid-rows-3 gap-2 w-48 mx-auto mb-4">
                        <div></div>
                        <button class="bg-gray-700 rounded-lg p-4 active:bg-gray-600" onclick="window.snakeDir(0, -1)">⬆️</button>
                        <div></div>
                        <button class="bg-gray-700 rounded-lg p-4 active:bg-gray-600" onclick="window.snakeDir(-1, 0)">⬅️</button>
                        <button class="bg-gray-700 rounded-lg p-4 active:bg-gray-600" onclick="window.snakeDir(0, 1)">⬇️</button>
                        <button class="bg-gray-700 rounded-lg p-4 active:bg-gray-600" onclick="window.snakeDir(1, 0)">➡️</button>
                    </div>
                </div>
            `;
            
            window.snakeDir = (ndx, ndy) => {
                if (dx === 0 && ndx !== 0) { dx = ndx; dy = 0; }
                else if (dy === 0 && ndy !== 0) { dx = 0; dy = ndy; }
            };
            
            document.addEventListener('keydown', handleKey);
            
            spawnFoods();
            loopTimer = setInterval(tick, Math.max(80, speed - level * 10));
            this._timers.push(loopTimer);
        };
        
        const handleKey = (e) => {
            if(e.key === 'ArrowUp') window.snakeDir(0, -1);
            if(e.key === 'ArrowDown') window.snakeDir(0, 1);
            if(e.key === 'ArrowLeft') window.snakeDir(-1, 0);
            if(e.key === 'ArrowRight') window.snakeDir(1, 0);
        };
        
        const tick = () => {
            if(dx === 0 && dy === 0) return;
            
            let head = {x: snake[0].x + dx, y: snake[0].y + dy};
            
            if(head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid) {
                gameOver();
                return;
            }
            
            if(snake.some(s => s.x === head.x && s.y === head.y)) {
                gameOver();
                return;
            }
            
            snake.unshift(head);
            
            let ate = -1;
            foods.forEach((f, i) => {
                if(f.x === head.x && f.y === head.y) ate = i;
            });
            
            if(ate !== -1) {
                if(foods[ate].word.target === targetWord.target) {
                    this._playSound('correct');
                    score += 10;
                    if(snake.length > 5 + level*2) {
                        clearInterval(loopTimer);
                        document.removeEventListener('keydown', handleKey);
                        level++;
                        if (level > 10) {
                            this._awardXpBoost();
                            overlay.innerHTML = this._renderGameOver('Snake', score, 'startSnake');
                        } else {
                            window.snakeNextLvl = () => { snake = [{x:7,y:7}]; dx=0; dy=0; startLevel(); };
                            overlay.innerHTML = this._renderLevelComplete(level - 1, 'snakeNextLvl()');
                        }
                        return;
                    } else {
                        spawnFoods();
                    }
                } else {
                    this._playSound('incorrect');
                    gameOver();
                    return;
                }
            } else {
                snake.pop();
            }
            
            draw();
        };
        
        const draw = () => {
            const container = document.getElementById('snake-grid');
            if(!container) return;
            
            let html = '';
            snake.forEach((s, i) => {
                html += `<div class="absolute bg-green-500 rounded-sm" style="left: ${(s.x/grid)*100}%; top: ${(s.y/grid)*100}%; width: ${100/grid}%; height: ${100/grid}%;"></div>`;
            });
            
            foods.forEach(f => {
                html += `<div class="absolute flex items-center justify-center text-xs font-bold text-white bg-red-600 rounded whitespace-nowrap overflow-hidden" style="left: ${(f.x/grid)*100}%; top: ${(f.y/grid)*100}%; width: ${100/grid * 3}%; height: ${100/grid}%; transform: translateX(-33%); z-index: 10;">${f.word.target}</div>`;
            });
            
            container.innerHTML = html;
        };
        
        const gameOver = () => {
            clearInterval(loopTimer);
            document.removeEventListener('keydown', handleKey);
            overlay.innerHTML = this._renderGameOver('Snake', score, 'startSnake');
        };
        
        startLevel();
    },

    // 10. Sudden Death
    startSuddenDeath: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let score = 0;
        let lives = 3;
        let timeLeft = 10;
        let timerId = null;
        let words = this._getWords(50);
        
        const nextQuestion = () => {
            if (lives <= 0) {
                let hs = parseInt(localStorage.getItem('suddenDeathHS') || '0');
                if (score > hs) localStorage.setItem('suddenDeathHS', score);
                overlay.innerHTML = this._renderGameOver('Sudden Death', score, 'startSuddenDeath');
                return;
            }
            
            timeLeft = Math.max(3, 10 - Math.floor(score / 50));
            
            let targetWord = words[Math.floor(Math.random() * words.length)];
            let options = this._getWords(4).filter(w => w.target !== targetWord.target).slice(0, 3);
            options.push(targetWord);
            options.sort(() => Math.random() - 0.5);
            
            window.sdAnswer = (idx) => {
                clearInterval(timerId);
                if (options[idx].target === targetWord.target) {
                    this._playSound('correct');
                    score += 10;
                    nextQuestion();
                } else {
                    this._playSound('incorrect');
                    lives--;
                    nextQuestion();
                }
            };
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-red-900 text-white">
                    ${this._renderHeader('Sudden Death', null, null, lives, score)}
                    <div class="flex-grow flex flex-col p-4 items-center justify-center">
                        <div class="text-6xl font-bold mb-4 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}" id="sd-timer">${timeLeft}</div>
                        <div class="bg-red-800 p-6 rounded-xl w-full text-center text-3xl font-bold mb-8 shadow-lg">
                            ${targetWord.source}
                        </div>
                        <div class="grid grid-cols-1 gap-4 w-full max-w-md">
                            ${options.map((opt, i) => `
                                <button onclick="sdAnswer(${i})" class="bg-red-700 hover:bg-red-600 rounded-lg py-4 text-xl font-bold">${opt.target}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            timerId = setInterval(() => {
                timeLeft--;
                const tEl = document.getElementById('sd-timer');
                if(tEl) {
                    tEl.textContent = timeLeft;
                    if(timeLeft <= 3) tEl.classList.add('text-red-500', 'animate-pulse');
                }
                if (timeLeft <= 0) {
                    clearInterval(timerId);
                    this._playSound('incorrect');
                    lives--;
                    nextQuestion();
                }
            }, 1000);
            this._timers.push(timerId);
        };
        
        nextQuestion();
    },

    // 11. Sentence Builder
    startSentenceBuilder: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        let level = 1;
        
        window.sbNext = () => {
            if (level > 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Sentence Builder', 'Won!', 'startSentenceBuilder');
                return;
            }
            
            const wordsNeeded = Math.min(2 + Math.floor(level/2), 5);
            let sentenceWords = this._getWords(wordsNeeded);
            let distractorWords = this._getWords(3 + level);
            
            let targetSentenceSource = sentenceWords.map(w => w.source).join(' ');
            let targetSentenceTarget = sentenceWords.map(w => w.target);
            
            let pool = [...targetSentenceTarget, ...distractorWords.map(w => w.target).slice(0, 3 + level)];
            pool.sort(() => Math.random() - 0.5);
            
            let selected = [];
            
            const render = () => {
                overlay.innerHTML = `
                    <div class="flex flex-col h-full bg-cyan-900 text-white">
                        ${this._renderHeader('Sentence Builder', level, 10, null, null)}
                        <div class="flex-grow flex flex-col p-4 items-center">
                            <div class="text-xl mb-2 text-cyan-200">Translate this:</div>
                            <div class="text-3xl font-bold mb-8 text-center">${targetSentenceSource}</div>
                            
                            <div class="w-full min-h-[100px] bg-cyan-800 rounded-lg p-4 flex flex-wrap gap-2 content-start border-2 border-cyan-600 mb-8 cursor-pointer" onclick="sbUndo()">
                                ${selected.map(w => `<div class="bg-cyan-600 px-4 py-2 rounded text-xl font-bold">${w}</div>`).join('')}
                                ${selected.length === 0 ? '<span class="text-cyan-600/50">Tap words below to build</span>' : ''}
                            </div>
                            
                            <div class="flex flex-wrap gap-3 justify-center max-w-2xl">
                                ${pool.map((w, i) => `
                                    <button onclick="sbTap(${i})" class="bg-cyan-700 px-4 py-2 rounded text-lg font-bold active:bg-cyan-500 hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-900/50">${w}</button>
                                `).join('')}
                            </div>
                            
                            <button onclick="sbCheck()" class="mt-auto mb-4 w-full max-w-md bg-green-600 text-white font-bold text-xl py-4 rounded-full shadow-lg active:scale-95 transition-transform">Check Answer</button>
                        </div>
                    </div>
                `;
            };
            
            window.sbTap = (idx) => {
                selected.push(pool[idx]);
                pool.splice(idx, 1);
                render();
            };
            
            window.sbUndo = () => {
                if (selected.length > 0) {
                    pool.push(selected.pop());
                    render();
                }
            };
            
            window.sbCheck = () => {
                if (selected.join(' ') === targetSentenceTarget.join(' ')) {
                    this._playSound('correct');
                    level++;
                    overlay.innerHTML = this._renderLevelComplete(level - 1, 'sbNext()');
                } else {
                    this._playSound('incorrect');
                    const box = document.querySelector('.border-cyan-600');
                    if (box) {
                        box.classList.replace('border-cyan-600', 'border-red-500');
                        box.classList.add('bg-red-900/50');
                        setTimeout(() => {
                            box.classList.replace('border-red-500', 'border-cyan-600');
                            box.classList.remove('bg-red-900/50');
                        }, 500);
                    }
                }
            };
            
            render();
        };
        sbNext();
    },

    // 12. Parrot
    startParrot: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (window.app && window.app.showToast) window.app.showToast('Speech recognition not supported on this device/browser.', 'error');
            setTimeout(() => this._hideOverlay(), 1000);
            return;
        }
        
        let level = 1;
        let words = this._getWords(10);
        
        window.parrotNext = () => {
            if (level > 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Parrot', 'Won!', 'startParrot');
                return;
            }
            
            let targetWord = words[level-1];
            let isListening = false;
            let recognition = new SpeechRecognition();
            recognition.lang = (window.appState?.settings?.learningDirection === 'sr_to_en') ? 'sr-RS' : 'en-US';
            recognition.interimResults = false;
            
            window.parrotPlay = () => this._speak(targetWord.source);
            
            window.parrotListen = () => {
                if (isListening) return;
                isListening = true;
                const btn = document.getElementById('parrot-mic-btn');
                if(btn) btn.classList.add('bg-red-600', 'animate-pulse');
                
                try {
                    recognition.start();
                } catch (e) {
                    isListening = false;
                    if(btn) btn.classList.remove('bg-red-600', 'animate-pulse');
                }
            };
            
            recognition.onresult = (event) => {
                isListening = false;
                const btn = document.getElementById('parrot-mic-btn');
                if(btn) btn.classList.remove('bg-red-600', 'animate-pulse');
                
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                const targetText = targetWord.source.toLowerCase().trim();
                
                const resEl = document.getElementById('parrot-result');
                if (transcript.includes(targetText) || targetText.includes(transcript)) {
                    this._playSound('correct');
                    if(resEl) resEl.innerHTML = '✅ <span class="text-green-400">Excellent!</span>';
                    setTimeout(() => {
                        level++;
                        overlay.innerHTML = this._renderLevelComplete(level - 1, 'parrotNext()');
                    }, 1500);
                } else {
                    this._playSound('incorrect');
                    if(resEl) resEl.innerHTML = `❌ <span class="text-red-400">Heard: "${transcript}"</span>`;
                }
            };
            
            recognition.onerror = () => {
                isListening = false;
                const btn = document.getElementById('parrot-mic-btn');
                if(btn) btn.classList.remove('bg-red-600', 'animate-pulse');
            };
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-orange-900 text-white">
                    ${this._renderHeader('Parrot', level, 10, null, null)}
                    <div class="flex-grow flex flex-col p-4 items-center justify-center">
                        <div class="text-xl mb-4">Listen and Repeat:</div>
                        <div class="text-4xl font-bold mb-8">${targetWord.source}</div>
                        
                        <button onclick="parrotPlay()" class="mb-12 p-4 bg-orange-700 rounded-full w-16 h-16 flex items-center justify-center shadow-lg active:bg-orange-600">
                            🔊
                        </button>
                        
                        <button id="parrot-mic-btn" onclick="parrotListen()" class="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-5xl shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-colors duration-300">
                            🎤
                        </button>
                        
                        <div id="parrot-result" class="mt-8 text-2xl font-bold h-10"></div>
                    </div>
                </div>
            `;
            
            setTimeout(() => this._speak(targetWord.source), 500);
        };
        parrotNext();
    },

    // 13. Voice Translator
    startVoiceTranslator: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (window.app && window.app.showToast) window.app.showToast('Speech recognition not supported.', 'error');
            setTimeout(() => this._hideOverlay(), 1000);
            return;
        }
        
        let level = 1;
        let words = this._getWords(10);
        
        window.vtNext = () => {
            if (level > 10) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Voice Translator', 'Won!', 'startVoiceTranslator');
                return;
            }
            
            let targetWord = words[level-1];
            let recognition = new SpeechRecognition();
            recognition.lang = (window.appState?.settings?.learningDirection === 'sr_to_en') ? 'en-US' : 'sr-RS';
            recognition.interimResults = false;
            
            let isListening = false;
            
            window.vtListen = () => {
                if (isListening) return;
                isListening = true;
                const btn = document.getElementById('vt-mic-btn');
                if(btn) btn.classList.add('bg-red-600', 'animate-pulse');
                
                try {
                    recognition.start();
                } catch(e) {
                    isListening = false;
                    if(btn) btn.classList.remove('bg-red-600', 'animate-pulse');
                }
            };
            
            recognition.onresult = (event) => {
                isListening = false;
                const btn = document.getElementById('vt-mic-btn');
                if(btn) btn.classList.remove('bg-red-600', 'animate-pulse');
                
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                const targetText = targetWord.target.toLowerCase().trim();
                
                const resEl = document.getElementById('vt-result');
                if (transcript.includes(targetText) || targetText.includes(transcript)) {
                    this._playSound('correct');
                    if(resEl) resEl.innerHTML = '✅ <span class="text-green-400">Correct!</span>';
                    setTimeout(() => {
                        level++;
                        overlay.innerHTML = this._renderLevelComplete(level - 1, 'vtNext()');
                    }, 1500);
                } else {
                    this._playSound('incorrect');
                    if(resEl) resEl.innerHTML = `❌ <span class="text-red-400">Heard "${transcript}", expected "${targetText}"</span>`;
                }
            };
            
            recognition.onerror = () => {
                isListening = false;
                const btn = document.getElementById('vt-mic-btn');
                if(btn) btn.classList.remove('bg-red-600', 'animate-pulse');
            };
            
            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-rose-900 text-white">
                    ${this._renderHeader('Voice Translator', level, 10, null, null)}
                    <div class="flex-grow flex flex-col p-4 items-center justify-center">
                        <div class="text-xl mb-4 text-rose-200">Say the translation:</div>
                        <div class="text-5xl font-bold mb-16 text-center">${targetWord.source}</div>
                        
                        <button id="vt-mic-btn" onclick="vtListen()" class="w-40 h-40 bg-rose-600 rounded-full flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(225,29,72,0.5)] transition-colors duration-300">
                            🎤
                        </button>
                        
                        <div id="vt-result" class="mt-8 text-xl font-bold h-12 text-center w-full px-4"></div>
                    </div>
                </div>
            `;
        };
        vtNext();
    },

    // ==========================================
    // 14. FREESTYLE RAP TRAINER (Rhyme Pairs)
    // ==========================================
    startFreestyleRap: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');

        // Serbian rhyme pair database
        const RHYME_PAIRS = [
            { a: 'kuća', a_en: 'house', b: 'tuča', b_en: 'hail/fight' },
            { a: 'brate', a_en: 'brother', b: 'zlate', b_en: 'gold (voc.)' },
            { a: 'noć', a_en: 'night', b: 'moć', b_en: 'power' },
            { a: 'dan', a_en: 'day', b: 'san', b_en: 'dream' },
            { a: 'srce', a_en: 'heart', b: 'sunce', b_en: 'sun' },
            { a: 'nebo', a_en: 'sky', b: 'hleb', b_en: 'bread' },
            { a: 'put', a_en: 'road', b: 'lut', b_en: 'crazy' },
            { a: 'voda', a_en: 'water', b: 'moda', b_en: 'fashion' },
            { a: 'grad', a_en: 'city', b: 'rad', b_en: 'work' },
            { a: 'sneg', a_en: 'snow', b: 'beg', b_en: 'escape' },
            { a: 'sreća', a_en: 'happiness', b: 'leća', b_en: 'lens/lentil' },
            { a: 'strah', a_en: 'fear', b: 'prah', b_en: 'dust' },
            { a: 'glava', a_en: 'head', b: 'slava', b_en: 'glory' },
            { a: 'duša', a_en: 'soul', b: 'suša', b_en: 'drought' },
            { a: 'more', a_en: 'sea', b: 'gore', b_en: 'above/burn' },
            { a: 'vreme', a_en: 'time', b: 'seme', b_en: 'seed' },
            { a: 'misao', a_en: 'thought', b: 'visao', b_en: 'hung (past)' },
            { a: 'život', a_en: 'life', b: 'pivot', b_en: 'pivot' },
            { a: 'pesma', a_en: 'song', b: 'vesma', b_en: 'very (archaic)' },
            { a: 'rima', a_en: 'rhyme', b: 'klima', b_en: 'climate' },
            { a: 'reč', a_en: 'word', b: 'peć', b_en: 'oven/stove' },
            { a: 'um', a_en: 'mind', b: 'šum', b_en: 'noise' },
            { a: 'plamen', a_en: 'flame', b: 'kamen', b_en: 'stone' },
            { a: 'zima', a_en: 'winter', b: 'rima', b_en: 'rhyme' },
            { a: 'zemlja', a_en: 'earth', b: 'nedelja', b_en: 'week/Sunday' },
            { a: 'selo', a_en: 'village', b: 'delo', b_en: 'deed/work' },
            { a: 'tama', a_en: 'darkness', b: 'drama', b_en: 'drama' },
            { a: 'krv', a_en: 'blood', b: 'crv', b_en: 'worm' },
            { a: 'smeh', a_en: 'laughter', b: 'greh', b_en: 'sin' },
            { a: 'oganj', a_en: 'fire', b: 'trkanj', b_en: 'running' }
        ];

        let level = 1;
        const maxLevel = 10;
        let score = 0;
        let lives = 3;
        const shuffled = [...RHYME_PAIRS].sort(() => Math.random() - 0.5);

        const nextLevel = () => {
            if (level > maxLevel) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Freestyle Rap', score, 'startFreestyleRap');
                return;
            }

            const pair = shuffled[(level - 1) % shuffled.length];
            // Get 3 wrong distractors
            const distractors = shuffled
                .filter(p => p.b !== pair.b && p.a !== pair.a)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(p => ({ text: p.b, en: p.b_en }));
            
            const options = [...distractors, { text: pair.b, en: pair.b_en }].sort(() => Math.random() - 0.5);

            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-gradient-to-b from-violet-900 to-slate-900 text-white">
                    ${this._renderHeader('Freestyle Rap 🎤', level, maxLevel, lives, score)}
                    <div class="flex-grow flex flex-col p-4 items-center justify-center gap-6">
                        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">What rhymes with...</p>
                        <div class="bg-violet-700/50 px-8 py-5 rounded-2xl border-2 border-violet-500 shadow-lg shadow-violet-500/30 text-center">
                            <p class="text-3xl font-black">${pair.a}</p>
                            <p class="text-sm text-violet-300 font-bold mt-1">(${pair.a_en})</p>
                        </div>
                        <div class="w-full grid grid-cols-2 gap-3 px-4">
                            ${options.map((opt, i) => `
                                <button id="fr-opt-${i}" onclick="freestyleCheck(${i}, '${opt.text.replace(/'/g, "\\'")}')" class="bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl p-4 transition-all active:scale-95 text-center">
                                    <p class="text-lg font-black">${opt.text}</p>
                                    <p class="text-[10px] text-slate-400 font-bold mt-1">${opt.en}</p>
                                </button>
                            `).join('')}
                        </div>
                        <div class="bg-slate-800/60 rounded-xl p-3 mt-2">
                            <p class="text-[10px] text-slate-400 text-center font-bold">💡 TIP: Words that end with the same sound rhyme!</p>
                        </div>
                    </div>
                </div>
            `;

            window.freestyleCheck = (idx, chosen) => {
                const correct = pair.b;
                const btn = document.getElementById('fr-opt-' + idx);
                if (chosen === correct) {
                    btn.classList.add('bg-green-500/50', 'border-green-400');
                    this._playSound('correct');
                    score += 10 + (level * 5);
                    level++;
                    setTimeout(() => nextLevel(), 800);
                } else {
                    btn.classList.add('bg-red-500/50', 'border-red-400');
                    this._playSound('incorrect');
                    lives--;
                    if (lives <= 0) {
                        setTimeout(() => {
                            overlay.innerHTML = this._renderGameOver('Freestyle Rap', score, 'startFreestyleRap');
                        }, 800);
                    } else {
                        // Highlight correct answer
                        options.forEach((o, j) => {
                            if (o.text === correct) {
                                document.getElementById('fr-opt-' + j).classList.add('bg-green-500/50', 'border-green-400');
                            }
                        });
                        setTimeout(() => nextLevel(), 1200);
                    }
                }
            };
        };
        nextLevel();
    },

    // ==========================================
    // 15. RAP BATTLES (Punchline Builder)
    // ==========================================
    startRapBattle: function() {
        this._cleanup();
        this._showOverlay();
        const overlay = document.getElementById('arcade-game-overlay');

        // Punchline construction challenges
        const BATTLES = [
            {
                setup: 'Moj flow je jak kao ___',
                setup_en: 'My flow is strong as ___',
                correct: 'plamen',
                correct_en: 'flame',
                options: ['plamen', 'kamen', 'voda', 'trava'],
                options_en: ['flame', 'stone', 'water', 'grass'],
                rhyme_with: 'Svi znaju moje ime',
                rhyme_en: 'Everyone knows my name',
                explanation: '"plamen" (flame) rhymes with "ime" (name) and fits the power metaphor!'
            },
            {
                setup: 'Na vrhu sam, gledam dole kao ___',
                setup_en: 'I\'m on top, looking down like a ___',
                correct: 'soko',
                correct_en: 'falcon',
                options: ['soko', 'mačka', 'riba', 'miš'],
                options_en: ['falcon', 'cat', 'fish', 'mouse'],
                rhyme_with: 'Letim visoko',
                rhyme_en: 'I fly high',
                explanation: '"soko" (falcon) rhymes with "visoko" (high) — double wordplay!'
            },
            {
                setup: 'Moje reči su oštre kao ___',
                setup_en: 'My words are sharp as ___',
                correct: 'mač',
                correct_en: 'sword',
                options: ['mač', 'hleb', 'san', 'cvet'],
                options_en: ['sword', 'bread', 'dream', 'flower'],
                rhyme_with: 'Svaki stih je tač',
                rhyme_en: 'Every verse is precise',
                explanation: '"mač" (sword) rhymes with "tač" (precise) — lethal bars!'
            },
            {
                setup: 'Idem napred, nikad ne stajem, brzinom ___',
                setup_en: 'Moving forward, never stopping, at the speed of ___',
                correct: 'svetlost',
                correct_en: 'light',
                options: ['svetlost', 'puž', 'vetar', 'oblak'],
                options_en: ['light', 'snail', 'wind', 'cloud'],
                rhyme_with: 'To je moja radost',
                rhyme_en: 'That is my joy',
                explanation: '"svetlost" (light) rhymes with "radost" (joy) — speed + happiness!'
            },
            {
                setup: 'Moj um je bistar kao ___',
                setup_en: 'My mind is clear as ___',
                correct: 'kristal',
                correct_en: 'crystal',
                options: ['kristal', 'blato', 'magla', 'dim'],
                options_en: ['crystal', 'mud', 'fog', 'smoke'],
                rhyme_with: 'Svaki plan je mistal',
                rhyme_en: 'Every plan is mystical',
                explanation: '"kristal" (crystal) sounds with "mistal" — clean and calculated!'
            },
            {
                setup: 'Oni pričaju, ali ja imam ___',
                setup_en: 'They talk, but I have ___',
                correct: 'delo',
                correct_en: 'deeds/work',
                options: ['delo', 'reči', 'ništa', 'strahu'],
                options_en: ['deeds', 'words', 'nothing', 'fear'],
                rhyme_with: 'Pokazujem celo selo',
                rhyme_en: 'I show the whole village',
                explanation: '"delo" (deeds) rhymes with "selo" (village) — actions speak louder!'
            },
            {
                setup: 'Tvoj rap je hladan kao ___',
                setup_en: 'Your rap is cold as ___',
                correct: 'led',
                correct_en: 'ice',
                options: ['led', 'oganj', 'sunce', 'lava'],
                options_en: ['ice', 'fire', 'sun', 'lava'],
                rhyme_with: 'A moj je svet',
                rhyme_en: 'And mine is the world',
                explanation: '"led" (ice) rhymes with "svet" (world) — cold diss + flex!'
            },
            {
                setup: 'Dizem se gore kao ___',
                setup_en: 'I rise up like ___',
                correct: 'dim',
                correct_en: 'smoke',
                options: ['dim', 'kamen', 'pesak', 'blato'],
                options_en: ['smoke', 'stone', 'sand', 'mud'],
                rhyme_with: 'Nedostižan sam, kao rim',
                rhyme_en: 'I\'m unreachable, like a rhyme',
                explanation: '"dim" (smoke) rhymes with "rim" (rhyme) — rising and untouchable!'
            },
            {
                setup: 'Moj stil je čist, bez ___',
                setup_en: 'My style is clean, without ___',
                correct: 'mrlje',
                correct_en: 'stains',
                options: ['mrlje', 'boje', 'zvuka', 'slike'],
                options_en: ['stains', 'colors', 'sound', 'pictures'],
                rhyme_with: 'Dok tvoji stihovi su srlje',
                rhyme_en: 'While your verses are a mess',
                explanation: '"mrlje" (stains) rhymes with "srlje" (rushing/mess) — clean roast!'
            },
            {
                setup: 'Kao lav, vladam sa ___',
                setup_en: 'Like a lion, I rule with ___',
                correct: 'snagom',
                correct_en: 'strength',
                options: ['snagom', 'strahom', 'tugom', 'slugom'],
                options_en: ['strength', 'fear', 'sadness', 'servant'],
                rhyme_with: 'Koračam za blagom',
                rhyme_en: 'I walk towards treasure',
                explanation: '"snagom" (strength) rhymes with "blagom" (treasure) — king energy!'
            }
        ];

        let level = 1;
        const maxLevel = Math.min(10, BATTLES.length);
        let score = 0;
        let lives = 3;
        const shuffledBattles = [...BATTLES].sort(() => Math.random() - 0.5);

        const nextRound = () => {
            if (level > maxLevel) {
                this._awardXpBoost();
                overlay.innerHTML = this._renderGameOver('Rap Battle', score, 'startRapBattle');
                return;
            }

            const battle = shuffledBattles[(level - 1) % shuffledBattles.length];
            const optionPairs = battle.options.map((opt, i) => ({ sr: opt, en: battle.options_en[i] }));

            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-gradient-to-b from-red-900 via-slate-900 to-slate-900 text-white">
                    ${this._renderHeader('Rap Battle ⚔️', level, maxLevel, lives, score)}
                    <div class="flex-grow flex flex-col p-4 items-center justify-center gap-4 overflow-y-auto">
                        <div class="text-center mb-2">
                            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">🎤 Complete the punchline</p>
                            <div class="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 mb-2">
                                <p class="text-lg font-black text-orange-400 italic">"${battle.rhyme_with}"</p>
                                <p class="text-[10px] text-slate-500 mt-1">${battle.rhyme_en}</p>
                            </div>
                            <div class="bg-red-900/30 rounded-2xl p-4 border-2 border-red-500/50 shadow-lg shadow-red-500/20">
                                <p class="text-xl font-black">${battle.setup.replace('___', '<span class="text-yellow-400 animate-pulse">___</span>')}</p>
                                <p class="text-xs text-slate-400 mt-1">${battle.setup_en}</p>
                            </div>
                        </div>
                        <div class="w-full grid grid-cols-2 gap-3 px-2">
                            ${optionPairs.map((opt, i) => `
                                <button id="rb-opt-${i}" onclick="rapBattleCheck(${i})" class="bg-white/10 hover:bg-white/20 border-2 border-white/20 rounded-xl p-3 transition-all active:scale-95 text-center">
                                    <p class="text-lg font-black">${opt.sr}</p>
                                    <p class="text-[10px] text-slate-400 font-bold">${opt.en}</p>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            window.rapBattleCheck = (idx) => {
                const chosen = battle.options[idx];
                const btn = document.getElementById('rb-opt-' + idx);

                if (chosen === battle.correct) {
                    btn.classList.add('bg-green-500/50', 'border-green-400');
                    this._playSound('correct');
                    score += 15 + (level * 5);
                    // Show explanation
                    const explDiv = document.createElement('div');
                    explDiv.className = 'fixed bottom-20 left-4 right-4 bg-green-900/90 text-green-100 rounded-2xl p-4 text-center z-50 border border-green-500 shadow-lg animate-bounce';
                    explDiv.innerHTML = `<p class="text-xs font-bold">🔥 ${battle.explanation}</p>`;
                    document.body.appendChild(explDiv);
                    level++;
                    setTimeout(() => { explDiv.remove(); nextRound(); }, 2000);
                } else {
                    btn.classList.add('bg-red-500/50', 'border-red-400');
                    this._playSound('incorrect');
                    lives--;
                    // Show correct answer
                    battle.options.forEach((o, j) => {
                        if (o === battle.correct) {
                            document.getElementById('rb-opt-' + j).classList.add('bg-green-500/50', 'border-green-400');
                        }
                    });
                    const explDiv = document.createElement('div');
                    explDiv.className = 'fixed bottom-20 left-4 right-4 bg-slate-800/90 text-slate-200 rounded-2xl p-4 text-center z-50 border border-slate-600 shadow-lg';
                    explDiv.innerHTML = `<p class="text-xs font-bold">💡 ${battle.explanation}</p>`;
                    document.body.appendChild(explDiv);
                    if (lives <= 0) {
                        setTimeout(() => { explDiv.remove(); overlay.innerHTML = this._renderGameOver('Rap Battle', score, 'startRapBattle'); }, 2000);
                    } else {
                        setTimeout(() => { explDiv.remove(); nextRound(); }, 2000);
                    }
                }
            };
        };
        nextRound();
    }
};

// 15. Speed True/False (Tačno/Netačno)
ArcadeEngine.startTrueFalse = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    let score = 0;
    let lives = 3;
    const totalRounds = 10;
    let round = 1;
    let currentTimer = null;

    const renderRound = () => {
        if (lives <= 0) {
            overlay.innerHTML = this._renderGameOver('Tačno/Netačno', score, '__original_startTrueFalse');
            return;
        }
        if (round > totalRounds) {
            this._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                    <h2 class="text-5xl font-black text-yellow-400 mb-4">🏆 SURVIVED!</h2>
                    <p class="text-2xl mb-2">Final Score: <span class="text-green-400 font-black">${score}</span></p>
                    <p class="text-sm text-gray-400 mb-8">${totalRounds} rounds completed</p>
                    <button onclick="ArcadeEngine.__original_startTrueFalse()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                </div>
            `;
            return;
        }

        const isCorrect = Math.random() > 0.5;
        const pair = this._getWords(2);
        if (!pair || pair.length < 2) { this._hideOverlay(); return; }
        const displayTarget = isCorrect ? pair[0].target : pair[1].target;

        overlay.innerHTML = `
            ${this._renderHeader('⚡ Tačno/Netačno', round, totalRounds, lives, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center relative overflow-hidden">
                <div id="tf-timer-bar" class="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-yellow-400 to-red-500 w-full rounded-full" style="transition: width 1.5s linear;"></div>
                
                <div class="text-7xl mb-6 animate-bounce">${pair[0].emoji || '⚡'}</div>
                <div class="text-4xl font-black mb-3 text-white">${pair[0].source}</div>
                <div class="text-2xl text-gray-400 font-medium mb-12">= <span class="text-blue-300 font-bold">${displayTarget}</span> ?</div>

                <div class="flex gap-4 w-full max-w-md">
                    <button id="btn-tacno" class="flex-1 p-6 bg-green-600 hover:bg-green-500 rounded-2xl active:scale-90 transition-all text-white font-black text-2xl shadow-lg shadow-green-600/30 border-b-4 border-green-800">
                        ✅ TAČNO
                    </button>
                    <button id="btn-netacno" class="flex-1 p-6 bg-red-600 hover:bg-red-500 rounded-2xl active:scale-90 transition-all text-white font-black text-2xl shadow-lg shadow-red-600/30 border-b-4 border-red-800">
                        ❌ NETAČNO
                    </button>
                </div>
            </div>
        `;

        // Wire up buttons with event listeners (more reliable than inline onclick)
        const btnTacno = document.getElementById('btn-tacno');
        const btnNetacno = document.getElementById('btn-netacno');
        
        const handleAnswer = (userGuessedTrue) => {
            if (currentTimer) { clearTimeout(currentTimer); currentTimer = null; }
            // Disable buttons immediately
            if (btnTacno) btnTacno.disabled = true;
            if (btnNetacno) btnNetacno.disabled = true;

            const correct = (isCorrect && userGuessedTrue) || (!isCorrect && !userGuessedTrue);
            if (correct) {
                this._playSound('correct');
                score += 100;
            } else {
                this._playSound('wrong');
                lives--;
            }
            round++;
            setTimeout(() => renderRound(), 400);
        };

        if (btnTacno) btnTacno.addEventListener('click', () => handleAnswer(true));
        if (btnNetacno) btnNetacno.addEventListener('click', () => handleAnswer(false));

        // Shrink timer bar
        requestAnimationFrame(() => {
            const bar = document.getElementById('tf-timer-bar');
            if (bar) bar.style.width = '0%';
        });

        // Auto-fail after 1.5s
        currentTimer = setTimeout(() => {
            currentTimer = null;
            lives--;
            this._playSound('wrong');
            round++;
            renderRound();
        }, 1500);
        this._timers.push(currentTimer);
    };

    renderRound();
};

// 16. Picture Match (Pogodi Sliku)
ArcadeEngine.startPictureMatch = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    let score = 0;
    let lives = 3;
    let round = 1;
    const totalRounds = 8;

    const renderRound = () => {
        if (lives <= 0) { overlay.innerHTML = this._renderGameOver('Pogodi Sliku', score, '__original_startPictureMatch'); return; }
        if (round > totalRounds) {
            this._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                    <h2 class="text-5xl font-black text-yellow-400 mb-4">🖼️ Perfect Eye!</h2>
                    <p class="text-2xl mb-8">Score: <span class="text-green-400 font-black">${score}</span></p>
                    <button onclick="ArcadeEngine.__original_startPictureMatch()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                </div>`;
            return;
        }

        const allWords = this._getWords(6);
        if (allWords.length < 4) { this._hideOverlay(); return; }
        const correct = allWords[0];
        const options = allWords.slice(0, 4).sort(() => Math.random() - 0.5);

        overlay.innerHTML = `
            ${this._renderHeader('🖼️ Pogodi Sliku', round, totalRounds, lives, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center">
                <p class="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Find the match for:</p>
                <div class="text-3xl font-black mb-8 text-blue-300">${correct.source}</div>
                <div class="grid grid-cols-2 gap-4 w-full max-w-sm" id="pm-grid"></div>
            </div>
        `;

        const grid = document.getElementById('pm-grid');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'p-6 bg-slate-800 rounded-2xl border-2 border-slate-700 hover:border-blue-400 active:scale-95 transition-all flex flex-col items-center gap-2';
            btn.innerHTML = `<span class="text-4xl">${opt.emoji || '❓'}</span><span class="text-sm font-black text-white">${opt.target}</span>`;
            btn.addEventListener('click', () => {
                grid.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === correct) {
                    btn.classList.add('border-green-400', 'bg-green-900/30');
                    this._playSound('correct');
                    score += 100;
                } else {
                    btn.classList.add('border-red-400', 'bg-red-900/30');
                    this._playSound('wrong');
                    lives--;
                }
                round++;
                setTimeout(() => renderRound(), 600);
            });
            grid.appendChild(btn);
        });
    };
    renderRound();
};

// 17. Word Search (Osmosmerka)
ArcadeEngine.startWordSearch = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    const words = this._getWords(4).map(w => w.target.toUpperCase().replace(/[^A-ZČĆŽŠĐА-Я]/gi, '').substring(0, 6));
    const validWords = words.filter(w => w.length >= 2 && w.length <= 6);
    if (validWords.length < 2) { this._hideOverlay(); return; }

    const gridSize = 8;
    const grid = [];
    const letters = 'ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ';
    
    // Fill grid with random letters
    for (let r = 0; r < gridSize; r++) {
        grid[r] = [];
        for (let c = 0; c < gridSize; c++) {
            grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
        }
    }

    // Place words horizontally or vertically
    const placedWords = [];
    validWords.forEach(word => {
        for (let attempt = 0; attempt < 20; attempt++) {
            const horizontal = Math.random() > 0.5;
            const r = Math.floor(Math.random() * (horizontal ? gridSize : gridSize - word.length));
            const c = Math.floor(Math.random() * (horizontal ? gridSize - word.length : gridSize));
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                const gr = horizontal ? r : r + i;
                const gc = horizontal ? c + i : c;
                if (grid[gr][gc] !== letters[0] && grid[gr][gc] !== word[i]) {
                    // Check if existing letter conflicts
                    const existingIsRandom = !placedWords.some(pw => pw.cells.some(pc => pc.r === gr && pc.c === gc));
                    if (!existingIsRandom) { canPlace = false; break; }
                }
            }
            if (canPlace) {
                const cells = [];
                for (let i = 0; i < word.length; i++) {
                    const gr = horizontal ? r : r + i;
                    const gc = horizontal ? c + i : c;
                    grid[gr][gc] = word[i];
                    cells.push({ r: gr, c: gc });
                }
                placedWords.push({ word, cells, found: false });
                break;
            }
        }
    });

    let foundCount = 0;
    const selectedCells = [];

    const render = () => {
        overlay.innerHTML = `
            ${this._renderHeader('🔍 Osmosmerka', foundCount, placedWords.length, null, null)}
            <div class="flex flex-col items-center flex-1 bg-gray-900 text-white p-4 w-full overflow-y-auto">
                <div class="flex flex-wrap gap-2 mb-4 justify-center">
                    ${placedWords.map(pw => `<span class="px-3 py-1 rounded-full text-xs font-black ${pw.found ? 'bg-green-600 line-through' : 'bg-slate-700'}">${pw.word}</span>`).join('')}
                </div>
                <div class="grid gap-1" style="grid-template-columns: repeat(${gridSize}, 1fr);" id="ws-grid"></div>
            </div>
        `;
        const wsGrid = document.getElementById('ws-grid');
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('button');
                cell.className = 'w-9 h-9 bg-slate-800 rounded-lg text-white font-black text-sm flex items-center justify-center hover:bg-slate-700 active:scale-90 transition-all border border-slate-700';
                cell.textContent = grid[r][c];
                cell.dataset.r = r;
                cell.dataset.c = c;

                // Check if this cell is part of a found word
                const isFound = placedWords.some(pw => pw.found && pw.cells.some(pc => pc.r === r && pc.c === c));
                if (isFound) cell.classList.add('bg-green-700', 'border-green-500');

                const isSel = selectedCells.some(sc => sc.r === r && sc.c === c);
                if (isSel) cell.classList.add('bg-blue-600', 'border-blue-400');

                cell.addEventListener('click', () => {
                    const exists = selectedCells.findIndex(sc => sc.r === r && sc.c === c);
                    if (exists >= 0) { selectedCells.splice(exists, 1); }
                    else { selectedCells.push({ r, c }); }

                    // Check if selected cells form a word
                    const selLetters = selectedCells.map(sc => grid[sc.r][sc.c]).join('');
                    const match = placedWords.find(pw => !pw.found && pw.word === selLetters);
                    if (match) {
                        match.found = true;
                        foundCount++;
                        selectedCells.length = 0;
                        this._playSound('correct');
                        if (foundCount === placedWords.length) {
                            this._awardXpBoost();
                            setTimeout(() => {
                                overlay.innerHTML = `
                                    <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                                        <h2 class="text-5xl font-black text-yellow-400 mb-4">🔍 All Found!</h2>
                                        <button onclick="ArcadeEngine.__original_startWordSearch()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                                    </div>`;
                            }, 500);
                        }
                    }
                    render();
                });
                wsGrid.appendChild(cell);
            }
        }
    };
    render();
};

// 18. Mini Crossword (Ukrštenica)
ArcadeEngine.startCrossword = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    const words = this._getWords(3);
    if (words.length < 3) { this._hideOverlay(); return; }
    
    let currentClue = 0;
    let score = 0;

    const renderClue = () => {
        if (currentClue >= words.length) {
            this._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                    <h2 class="text-5xl font-black text-yellow-400 mb-4">📰 Solved!</h2>
                    <p class="text-2xl mb-8">Score: <span class="text-green-400 font-black">${score}</span></p>
                    <button onclick="ArcadeEngine.__original_startCrossword()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                </div>`;
            return;
        }

        const w = words[currentClue];
        const answer = w.target.toUpperCase();
        const cells = answer.split('').map(() => '');

        overlay.innerHTML = `
            ${this._renderHeader('📰 Ukrštenica', currentClue + 1, words.length, null, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center">
                <p class="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Clue:</p>
                <div class="text-3xl font-black mb-2 text-blue-300">${w.source}</div>
                <p class="text-xs text-gray-500 mb-8">${answer.length} letters</p>
                <div class="flex gap-2 mb-8 justify-center flex-wrap" id="cw-cells">
                    ${answer.split('').map((_, i) => `<input type="text" maxlength="1" data-idx="${i}" class="w-12 h-14 bg-slate-800 border-2 border-slate-600 rounded-xl text-center text-2xl font-black text-white focus:border-blue-400 focus:outline-none uppercase cw-input" autocomplete="off">`).join('')}
                </div>
                <button id="cw-submit" class="px-8 py-3 bg-green-600 rounded-xl text-xl font-black active:scale-95 transition-transform shadow-lg shadow-green-600/30">Check</button>
            </div>
        `;

        // Auto-focus & auto-advance
        const inputs = document.querySelectorAll('.cw-input');
        if (inputs.length > 0) inputs[0].focus();
        inputs.forEach((inp, i) => {
            inp.addEventListener('input', () => {
                if (inp.value && i < inputs.length - 1) inputs[i + 1].focus();
            });
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
            });
        });

        document.getElementById('cw-submit').addEventListener('click', () => {
            const guess = Array.from(inputs).map(inp => inp.value.toUpperCase()).join('');
            if (guess === answer) {
                this._playSound('correct');
                score += 150;
                currentClue++;
                renderClue();
            } else {
                this._playSound('wrong');
                inputs.forEach((inp, i) => {
                    if (inp.value.toUpperCase() !== answer[i]) {
                        inp.classList.add('border-red-500', 'bg-red-900/30');
                    } else {
                        inp.classList.add('border-green-500', 'bg-green-900/30');
                    }
                });
            }
        });
    };
    renderClue();
};

// 19. Rečko (Serbian Wordle)
ArcadeEngine.startRecko = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    const allWords = this._getWords(20);
    const fiveLetterWords = allWords.filter(w => w.target.length === 5);
    if (fiveLetterWords.length === 0) {
        // Fallback: pick any word and pad/trim to 5
        const fallback = allWords[0];
        fiveLetterWords.push({ ...fallback, target: (fallback.target + 'XXXXX').substring(0, 5) });
    }
    const target = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
    const answer = target.target.toUpperCase();

    let guesses = [];
    const maxGuesses = 6;
    let currentGuess = '';
    let gameOver = false;

    const render = () => {
        overlay.innerHTML = `
            ${this._renderHeader('🟩 Rečko', guesses.length, maxGuesses, null, null)}
            <div class="flex flex-col items-center flex-1 bg-gray-900 text-white p-4 w-full overflow-y-auto">
                <p class="text-xs text-gray-400 mb-4 font-bold">Guess the 5-letter word. Hint: <span class="text-blue-300">${target.source}</span></p>
                <div class="space-y-2 mb-6 w-full max-w-xs" id="rk-board"></div>
                ${gameOver ? '' : `<div class="flex gap-1 mb-4" id="rk-input"></div><div id="rk-keyboard" class="w-full max-w-md"></div>`}
            </div>
        `;

        const board = document.getElementById('rk-board');
        // Render past guesses
        guesses.forEach(g => {
            const row = document.createElement('div');
            row.className = 'flex gap-2 justify-center';
            g.letters.forEach(l => {
                const cell = document.createElement('div');
                cell.className = `w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl text-white border-2 ${l.status === 'correct' ? 'bg-green-600 border-green-500' : l.status === 'present' ? 'bg-yellow-600 border-yellow-500' : 'bg-slate-700 border-slate-600'}`;
                cell.textContent = l.char;
                row.appendChild(cell);
            });
            board.appendChild(row);
        });

        // Render empty rows
        for (let i = guesses.length; i < maxGuesses; i++) {
            const row = document.createElement('div');
            row.className = 'flex gap-2 justify-center';
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                const char = (i === guesses.length && j < currentGuess.length) ? currentGuess[j] : '';
                cell.className = 'w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl text-white border-2 border-slate-700 bg-slate-800';
                cell.textContent = char;
                row.appendChild(cell);
            }
            board.appendChild(row);
        }

        if (!gameOver) {
            // Keyboard
            const kb = document.getElementById('rk-keyboard');
            const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
            rows.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'flex gap-1 justify-center mb-1';
                if (row === 'ZXCVBNM') {
                    const enterBtn = document.createElement('button');
                    enterBtn.className = 'px-3 py-3 bg-green-600 rounded-lg text-xs font-black text-white active:scale-90 transition-transform';
                    enterBtn.textContent = '✓';
                    enterBtn.addEventListener('click', () => submitGuess());
                    rowDiv.appendChild(enterBtn);
                }
                row.split('').forEach(letter => {
                    const btn = document.createElement('button');
                    btn.className = 'w-8 h-10 bg-slate-700 rounded-lg text-white font-bold text-sm hover:bg-slate-600 active:scale-90 transition-all';
                    btn.textContent = letter;
                    btn.addEventListener('click', () => {
                        if (currentGuess.length < 5) { currentGuess += letter; render(); }
                    });
                    rowDiv.appendChild(btn);
                });
                if (row === 'ZXCVBNM') {
                    const delBtn = document.createElement('button');
                    delBtn.className = 'px-3 py-3 bg-red-600 rounded-lg text-xs font-black text-white active:scale-90 transition-transform';
                    delBtn.textContent = '⌫';
                    delBtn.addEventListener('click', () => { currentGuess = currentGuess.slice(0, -1); render(); });
                    rowDiv.appendChild(delBtn);
                }
                kb.appendChild(rowDiv);
            });
        }
    };

    const submitGuess = () => {
        if (currentGuess.length !== 5) return;
        const guess = currentGuess.toUpperCase();
        const letters = guess.split('').map((char, i) => {
            if (char === answer[i]) return { char, status: 'correct' };
            if (answer.includes(char)) return { char, status: 'present' };
            return { char, status: 'absent' };
        });
        guesses.push({ letters });
        currentGuess = '';

        if (guess === answer) {
            gameOver = true;
            this._playSound('correct');
            this._awardXpBoost();
            render();
            setTimeout(() => {
                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                        <h2 class="text-5xl font-black text-green-400 mb-4">🟩 Bravo!</h2>
                        <p class="text-xl mb-8">You got it in ${guesses.length} guess${guesses.length > 1 ? 'es' : ''}!</p>
                        <button onclick="ArcadeEngine.__original_startRecko()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                    </div>`;
            }, 1000);
        } else if (guesses.length >= maxGuesses) {
            gameOver = true;
            this._playSound('wrong');
            render();
            setTimeout(() => {
                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                        <h2 class="text-4xl font-black text-red-400 mb-4">Game Over</h2>
                        <p class="text-xl mb-2">The word was:</p>
                        <p class="text-3xl font-black text-green-400 mb-8">${answer}</p>
                        <button onclick="ArcadeEngine.__original_startRecko()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                    </div>`;
            }, 1000);
        } else {
            render();
        }
    };
    render();
};

// 20. Baloni (Bubble Pop)
ArcadeEngine.startBubblePop = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    let score = 0;
    let lives = 3;
    let round = 1;
    const totalRounds = 10;

    const renderRound = () => {
        if (lives <= 0) { overlay.innerHTML = this._renderGameOver('Baloni', score, '__original_startBubblePop'); return; }
        if (round > totalRounds) {
            this._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                    <h2 class="text-5xl font-black text-yellow-400 mb-4">🎈 All Popped!</h2>
                    <p class="text-2xl mb-8">Score: <span class="text-green-400 font-black">${score}</span></p>
                    <button onclick="ArcadeEngine.__original_startBubblePop()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                </div>`;
            return;
        }

        const allWords = this._getWords(5);
        if (allWords.length < 4) { this._hideOverlay(); return; }
        const correct = allWords[0];
        const bubbles = allWords.slice(0, 4).sort(() => Math.random() - 0.5);
        const colors = ['from-red-400 to-pink-500', 'from-blue-400 to-cyan-500', 'from-green-400 to-emerald-500', 'from-purple-400 to-violet-500', 'from-yellow-400 to-orange-500'];

        overlay.innerHTML = `
            ${this._renderHeader('🎈 Baloni', round, totalRounds, lives, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center relative overflow-hidden">
                <p class="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Pop the correct bubble!</p>
                <div class="text-3xl font-black mb-8 text-blue-300">${correct.source}</div>
                <div class="grid grid-cols-2 gap-4 w-full max-w-sm" id="bp-grid"></div>
            </div>
        `;

        const grid = document.getElementById('bp-grid');
        bubbles.forEach((opt, i) => {
            const btn = document.createElement('button');
            const color = colors[i % colors.length];
            btn.className = `p-6 bg-gradient-to-br ${color} rounded-full active:scale-75 transition-all flex flex-col items-center justify-center shadow-xl hover:shadow-2xl aspect-square`;
            btn.innerHTML = `<span class="text-2xl font-black text-white drop-shadow-md">${opt.target}</span>`;
            btn.style.animation = `float ${2 + Math.random() * 2}s ease-in-out infinite alternate`;
            btn.addEventListener('click', () => {
                grid.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === correct) {
                    btn.style.transform = 'scale(1.5)';
                    btn.style.opacity = '0';
                    this._playSound('correct');
                    score += 100;
                } else {
                    btn.style.transform = 'scale(0.5)';
                    this._playSound('wrong');
                    lives--;
                }
                round++;
                setTimeout(() => renderRound(), 600);
            });
            grid.appendChild(btn);
        });
    };
    renderRound();
};

// 21. Razvrstaj (Gender & Case Sorter)
ArcadeEngine.startSorter = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    let score = 0;
    let round = 1;
    const totalRounds = 10;
    let lives = 3;

    const genders = [
        { label: 'Muški (M)', key: 'm', color: 'blue' },
        { label: 'Ženski (Ž)', key: 'f', color: 'pink' },
        { label: 'Srednji (S)', key: 'n', color: 'green' }
    ];

    // Generate fake gendered words
    const generateWord = () => {
        const words = this._getWords(1);
        if (!words.length) return null;
        const w = words[0];
        // Simple heuristic for Serbian gender based on ending
        const target = w.target || w.source;
        let gender;
        const lastChar = target.slice(-1).toLowerCase();
        if (['a', 'а'].includes(lastChar)) gender = 'f';
        else if (['o', 'e', 'о', 'е'].includes(lastChar)) gender = 'n';
        else gender = 'm';
        return { word: target, source: w.source, gender };
    };

    const renderRound = () => {
        if (lives <= 0) { overlay.innerHTML = this._renderGameOver('Razvrstaj', score, '__original_startSorter'); return; }
        if (round > totalRounds) {
            this._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                    <h2 class="text-5xl font-black text-yellow-400 mb-4">🧺 Sorted!</h2>
                    <p class="text-2xl mb-8">Score: <span class="text-green-400 font-black">${score}</span></p>
                    <button onclick="ArcadeEngine.__original_startSorter()" class="px-6 py-3 bg-blue-600 rounded-xl text-xl mb-4 font-bold active:scale-95 transition-transform">Play Again</button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                </div>`;
            return;
        }

        const wordData = generateWord();
        if (!wordData) { this._hideOverlay(); return; }

        overlay.innerHTML = `
            ${this._renderHeader('🧺 Razvrstaj', round, totalRounds, lives, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center">
                <p class="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Sort this word by gender:</p>
                <div class="text-4xl font-black mb-3 text-white">${wordData.word}</div>
                <div class="text-lg text-gray-500 mb-8">${wordData.source}</div>
                <div class="flex gap-3 w-full max-w-md" id="sort-btns"></div>
            </div>
        `;

        const container = document.getElementById('sort-btns');
        genders.forEach(g => {
            const btn = document.createElement('button');
            const colorMap = { blue: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30', pink: 'bg-pink-600 hover:bg-pink-500 shadow-pink-600/30', green: 'bg-green-600 hover:bg-green-500 shadow-green-600/30' };
            btn.className = `flex-1 p-5 ${colorMap[g.color]} rounded-2xl active:scale-90 transition-all text-white font-black text-lg shadow-lg`;
            btn.textContent = g.label;
            btn.addEventListener('click', () => {
                container.querySelectorAll('button').forEach(b => b.disabled = true);
                if (g.key === wordData.gender) {
                    this._playSound('correct');
                    score += 100;
                } else {
                    this._playSound('wrong');
                    lives--;
                }
                round++;
                setTimeout(() => renderRound(), 500);
            });
            container.appendChild(btn);
        });
    };
    renderRound();
};

// Mode Interceptor logic
ArcadeEngine.currentMode = 'solo';
ArcadeEngine.preLaunch = function(gameFnName) {
    const overlay = document.getElementById('arcade-game-overlay');
    if (!overlay) return;
    
    const activeGhost = window.GhostEngine ? window.GhostEngine.getActiveGhost() : null;
    const ghostLabel = activeGhost ? `${activeGhost.a || '👻'} ${activeGhost.u} (${activeGhost.acc}%)` : 'Duh Prijatelja';

    overlay.classList.remove('hidden');
    overlay.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full bg-slate-900 p-6 w-full fade-in">
            <h2 class="text-3xl font-black text-white mb-2 text-center">Izaberi Režim Igre</h2>
            <p class="text-slate-400 mb-6 text-center text-sm font-medium">Kako želiš da igraš?</p>
            
            <div class="flex flex-col gap-3.5 w-full max-w-sm">
                <button onclick="ArcadeEngine._launchGame('${gameFnName}', 'solo')" class="p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-left hover:border-blue-500 hover:bg-slate-700 active:scale-95 transition-all group">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl group-hover:scale-110 transition-transform">👤</div>
                        <div>
                            <h3 class="text-white font-black text-lg">Solo Režim</h3>
                            <p class="text-slate-400 text-xs font-bold mt-0.5">Igraj samostalno za bodove</p>
                        </div>
                    </div>
                </button>

                <button onclick="ArcadeEngine._launchGame('${gameFnName}', 'bot')" class="p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-left hover:border-red-500 hover:bg-slate-700 active:scale-95 transition-all group relative overflow-hidden">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl group-hover:scale-110 transition-transform">🤖</div>
                        <div>
                            <h3 class="text-white font-black text-lg">Vs. Marko Bot</h3>
                            <p class="text-slate-400 text-xs font-bold mt-0.5">Standardni AI protivnik (75%)</p>
                        </div>
                    </div>
                </button>

                <button onclick="ArcadeEngine._launchGame('${gameFnName}', 'ghost')" class="p-5 bg-gradient-to-r from-indigo-950 to-purple-950 border-2 border-indigo-500/60 rounded-2xl text-left hover:border-indigo-400 active:scale-95 transition-all group relative overflow-hidden shadow-lg shadow-indigo-950/40">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl group-hover:scale-110 transition-transform">👻</div>
                        <div>
                            <h3 class="text-white font-black text-lg">Duel: ${ghostLabel}</h3>
                            <p class="text-indigo-300 text-xs font-bold mt-0.5">Simulira preciznost i brzinu prijatelja</p>
                        </div>
                    </div>
                </button>
                
                <div class="flex justify-between items-center pt-2">
                    <button onclick="GhostEngine.openModal()" class="text-xs text-indigo-400 hover:text-indigo-300 font-black flex items-center gap-1 p-2">
                        <span>⚙️ Promeni Duha / Unesi Kod</span>
                    </button>
                    <button onclick="ArcadeEngine._hideOverlay()" class="text-xs text-slate-500 hover:text-white font-bold p-2">Otkaži</button>
                </div>
            </div>
        </div>
    `;
};

ArcadeEngine._launchGame = function(gameFnName, mode) {
    ArcadeEngine.currentMode = mode;
    // Actually call the original game function
    if (typeof ArcadeEngine['__original_' + gameFnName] === 'function') {
        ArcadeEngine['__original_' + gameFnName]();
    } else {
        ArcadeEngine[gameFnName]();
    }
    
    if (mode === 'bot') {
        ArcadeEngine.startBotOpponent();
    } else if (mode === 'ghost') {
        const ghost = window.GhostEngine ? window.GhostEngine.getActiveGhost() : null;
        ArcadeEngine.startBotOpponent(ghost);
    }
};

// 22. Padajuće Reči (Falling Words)
ArcadeEngine.startFallingWords = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');

    let score = 0;
    let lives = 3;
    let level = 1;
    let speed = 2200; // ms per fall cycle
    let spawnRate = 2500;
    let activeWords = [];
    let gameOver = false;
    let spawnTimer = null;
    let frameId = null;
    const maxActive = 5;
    const self = this;

    const allWords = this._getWords(80);
    if (allWords.length < 5) { this._hideOverlay(); return; }
    let wordIdx = 0;

    overlay.innerHTML = `
        ${this._renderHeader('🌧️ Padajuće Reči', level, 5, lives, score)}
        <div class="flex flex-col h-full bg-gray-900 relative overflow-hidden" style="min-height:400px;">
            <div id="fw-arena" class="flex-1 relative w-full overflow-hidden" style="min-height:320px;"></div>
            <div class="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
                <input id="fw-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"
                    class="flex-1 bg-gray-700 text-white text-lg font-bold px-4 py-3 rounded-xl border-2 border-gray-600 focus:border-blue-500 focus:outline-none"
                    placeholder="Type the translation...">
                <button id="fw-submit" class="bg-blue-600 hover:bg-blue-500 text-white font-black px-5 py-3 rounded-xl active:scale-95 transition-transform text-lg">⏎</button>
            </div>
        </div>
    `;

    const arena = document.getElementById('fw-arena');
    const input = document.getElementById('fw-input');
    const submitBtn = document.getElementById('fw-submit');
    input.focus();

    function normalizeAnswer(s) {
        return s.toLowerCase().replace(/[čć]/g,'c').replace(/š/g,'s').replace(/ž/g,'z').replace(/đ/g,'dj').replace(/[.,!?'"]/g,'').trim();
    }

    function spawnWord() {
        if (gameOver || activeWords.length >= maxActive) return;
        if (wordIdx >= allWords.length) wordIdx = 0;
        const w = allWords[wordIdx++];

        const el = document.createElement('div');
        const xPos = 10 + Math.random() * 70; // 10%-80% left
        el.className = 'absolute text-center transition-none pointer-events-none';
        el.style.left = xPos + '%';
        el.style.top = '-40px';
        el.style.zIndex = '10';
        el.innerHTML = `
            <div class="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-black text-base px-4 py-2 rounded-xl shadow-lg shadow-blue-500/40 whitespace-nowrap">
                ${w.source}
            </div>
        `;
        arena.appendChild(el);

        const wordObj = {
            el: el,
            source: w.source,
            target: w.target,
            y: -40,
            startTime: Date.now()
        };
        activeWords.push(wordObj);
    }

    function checkAnswer() {
        const val = normalizeAnswer(input.value);
        if (!val) return;

        let found = -1;
        for (let i = 0; i < activeWords.length; i++) {
            if (normalizeAnswer(activeWords[i].target) === val) {
                found = i;
                break;
            }
        }

        if (found >= 0) {
            const w = activeWords[found];
            // Explode animation
            w.el.innerHTML = `<div class="text-green-400 font-black text-2xl animate-ping">✓</div>`;
            setTimeout(() => { if (w.el.parentNode) w.el.parentNode.removeChild(w.el); }, 400);
            activeWords.splice(found, 1);
            score += 10 * level;
            self._playSound('correct');
            updateHeader();

            // Level up every 5 correct
            if (score > 0 && score % 50 === 0 && level < 5) {
                level++;
                speed = Math.max(800, speed - 300);
                spawnRate = Math.max(1200, spawnRate - 300);
                clearInterval(spawnTimer);
                spawnTimer = setInterval(spawnWord, spawnRate);
                updateHeader();
            }
        }
        input.value = '';
        input.focus();
    }

    function updateHeader() {
        const headerEl = overlay.querySelector('.flex.items-center');
        if (!headerEl) return;
        // Re-render header inline
        const h = overlay.firstElementChild;
        if (h) h.outerHTML = self._renderHeader('🌧️ Padajuće Reči', level, 5, lives, score);
    }

    function gameLoop() {
        if (gameOver) return;
        const arenaH = arena.clientHeight || 320;

        for (let i = activeWords.length - 1; i >= 0; i--) {
            const w = activeWords[i];
            const elapsed = Date.now() - w.startTime;
            const progress = elapsed / speed;
            w.y = -40 + (arenaH + 60) * progress;
            w.el.style.top = w.y + 'px';

            // Hit the bottom
            if (w.y >= arenaH - 20) {
                w.el.innerHTML = `<div class="text-red-400 font-black text-xs">${w.target}</div>`;
                setTimeout(() => { if (w.el.parentNode) w.el.parentNode.removeChild(w.el); }, 800);
                activeWords.splice(i, 1);
                lives--;
                self._playSound('incorrect');
                updateHeader();

                if (lives <= 0) {
                    gameOver = true;
                    clearInterval(spawnTimer);
                    overlay.innerHTML = self._renderGameOver('Padajuće Reči', score, '__original_startFallingWords');
                    return;
                }
            }
        }
        frameId = requestAnimationFrame(gameLoop);
    }

    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') checkAnswer(); });
    submitBtn.addEventListener('click', checkAnswer);

    // Start spawning & game loop
    spawnWord();
    spawnTimer = setInterval(spawnWord, spawnRate);
    frameId = requestAnimationFrame(gameLoop);

    // Cleanup on hide
    this._timers.push({ clear: () => {
        gameOver = true;
        clearInterval(spawnTimer);
        cancelAnimationFrame(frameId);
    }});
};

// 25. Ruski Rulet (Daily Deathmatch / Lockout)
ArcadeEngine.startLockout = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    const lockTime = localStorage.getItem('serbolingo_lockout');
    if (lockTime && Date.now() < parseInt(lockTime)) {
        const remaining = Math.ceil((parseInt(lockTime) - Date.now()) / (1000 * 60 * 60));
        overlay.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full bg-red-950 text-white p-6 text-center">
                <div class="text-7xl mb-6">&#x1F512;</div>
                <h2 class="text-5xl font-black text-red-500 mb-4">LOCKED</h2>
                <p class="text-xl mb-8 text-red-200">You failed the Deathmatch. Locked for ${remaining} more hour(s).</p>
                <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-red-600 rounded-xl text-xl font-bold active:scale-95 transition-transform shadow-lg shadow-red-900">Return</button>
            </div>`;
        return;
    } else if (lockTime) { localStorage.removeItem('serbolingo_lockout'); }
    let score = 0, round = 1, fails = 0;
    const maxFails = 5, totalRounds = 10, self = this;
    const renderRound = () => {
        if (fails >= maxFails) {
            const unlockAt = Date.now() + (24 * 60 * 60 * 1000);
            localStorage.setItem('serbolingo_lockout', unlockAt.toString());
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-red-950 text-white p-6 text-center animate-pulse">
                    <div class="text-8xl mb-6">&#x2620;&#xFE0F;</div>
                    <h2 class="text-5xl font-black text-red-500 mb-4">GAME OVER</h2>
                    <p class="text-xl mb-8 text-red-200">You failed ${maxFails} times. Locked out for 24 hours.</p>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-red-600 rounded-xl text-xl font-bold active:scale-95 transition-transform">Accept Fate</button>
                </div>`;
            return;
        }
        if (round > totalRounds) {
            self._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center">
                    <h2 class="text-5xl font-black text-green-400 mb-4">&#x1F3C6; SURVIVED!</h2>
                    <p class="text-2xl mb-8">You survived the Deathmatch.</p>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform">Back to Arcade</button>
                </div>`;
            return;
        }
        const allWords = self._getWords(5);
        if (allWords.length < 4) { self._hideOverlay(); return; }
        const correct = allWords[0];
        const options = allWords.slice(0, 4).sort(() => Math.random() - 0.5);
        overlay.innerHTML = `
            ${self._renderHeader('Dnevni Izazov', round, totalRounds, maxFails - fails, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-950 text-white p-6 w-full text-center">
                <div class="text-red-500 font-bold mb-2 animate-pulse text-sm">SURVIVAL MODE (FAILS: ${fails}/${maxFails})</div>
                <div class="text-4xl font-black mb-8">${correct.source}</div>
                <div class="grid grid-cols-1 gap-4 w-full max-w-sm" id="dm-grid"></div>
            </div>`;
        const grid = document.getElementById('dm-grid');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'p-4 bg-gray-800 border-2 border-gray-700 rounded-xl text-xl font-bold active:scale-95 transition-transform hover:bg-gray-700';
            btn.innerText = opt.target;
            btn.onclick = () => {
                grid.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === correct) { btn.classList.add('bg-green-600','border-green-500'); score += 100; self._playSound('correct'); }
                else { btn.classList.add('bg-red-600','border-red-500'); fails++; self._playSound('incorrect'); }
                setTimeout(() => { round++; renderRound(); }, 1000);
            };
            grid.appendChild(btn);
        });
    };
    renderRound();
};

// 26. Bomba (Bomb Defusal)
ArcadeEngine.startBombDefusal = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let score = 0, round = 1, timer = null, timeLeft = 10;
    const self = this;
    const renderRound = () => {
        timeLeft = Math.max(3, 10 - Math.floor(round / 2));
        const allWords = self._getWords(5);
        if (allWords.length < 4) { self._hideOverlay(); return; }
        const correct = allWords[0];
        const options = allWords.slice(0, 4).sort(() => Math.random() - 0.5);
        const wireColors = ['bg-red-600','bg-blue-600','bg-green-600','bg-yellow-500'];
        overlay.innerHTML = `
            ${self._renderHeader('Bomba', round, '?', '1', score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center relative overflow-hidden">
                <div id="bomb-timer" class="text-6xl font-black mb-2 text-red-500 font-mono tracking-tighter">00:${timeLeft.toString().padStart(2,'0')}</div>
                <div class="text-3xl font-black mb-8">${correct.source}</div>
                <div class="flex flex-col gap-2 w-full max-w-sm" id="wire-grid"></div>
            </div>`;
        const grid = document.getElementById('wire-grid');
        options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            const color = wireColors[idx % 4];
            btn.className = 'p-4 ' + color + ' rounded-md text-xl font-bold active:scale-95 transition-transform flex items-center justify-between hover:brightness-110 shadow-[0_5px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 mb-2';
            btn.innerHTML = '<span>&#x2702;&#xFE0F;</span> <span>' + opt.target + '</span> <span></span>';
            btn.onclick = () => {
                clearInterval(timer);
                grid.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === correct) { btn.classList.add('opacity-50'); score += timeLeft * 10; self._playSound('correct'); setTimeout(() => { round++; renderRound(); }, 800); }
                else { explode(); }
            };
            grid.appendChild(btn);
        });
        const timerEl = document.getElementById('bomb-timer');
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 3) timerEl.classList.add('animate-pulse','text-red-400');
            timerEl.innerText = '00:' + timeLeft.toString().padStart(2,'0');
            if (timeLeft <= 0) { clearInterval(timer); explode(); }
        }, 1000);
    };
    const explode = () => {
        clearInterval(timer);
        self._playSound('incorrect');
        overlay.innerHTML = '<div class="flex items-center justify-center h-full bg-white animate-ping"><div class="text-9xl">&#x1F4A5;</div></div>';
        setTimeout(() => { overlay.innerHTML = self._renderGameOver('Bomba', score, '__original_startBombDefusal'); }, 1000);
    };
    renderRound();
    this._timers.push({ clear: () => clearInterval(timer) });
};

// 27. Svemirski Osvajaci (Space Invaders)
ArcadeEngine.startSpaceInvaders = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let score = 0, lives = 3, gameOver = false, frameId = null, spawnTimer = null, speed = 2500, activeAsteroids = [];
    const self = this;
    const allWords = this._getWords(50);
    if (allWords.length < 4) { this._hideOverlay(); return; }
    const currentTargets = [allWords[0], allWords[1], allWords[2]];
    overlay.innerHTML = `
        ${this._renderHeader('Svemirski Osvajaci', 1, '?', lives, score)}
        <div class="flex flex-col h-full bg-gray-950 relative overflow-hidden" style="min-height:400px;">
            <div id="si-arena" class="flex-1 relative w-full overflow-hidden" style="background: radial-gradient(circle, #1a1a2e 0%, #000000 100%);"></div>
            <div class="p-4 bg-gray-900 border-t-2 border-gray-800 grid grid-cols-3 gap-2" id="si-buttons"></div>
        </div>`;
    const arena = document.getElementById('si-arena');
    const btns = document.getElementById('si-buttons');
    const renderButtons = () => {
        btns.innerHTML = '';
        currentTargets.forEach(t => {
            const btn = document.createElement('button');
            btn.className = 'bg-blue-900 hover:bg-blue-700 text-blue-100 p-3 rounded-xl font-bold text-sm h-16 active:bg-blue-500 transition-colors border-b-4 border-blue-950 flex items-center justify-center overflow-hidden';
            const sp = document.createElement('span'); sp.className = 'truncate px-1'; sp.textContent = t.target;
            btn.appendChild(sp);
            btn.onclick = () => fireLaser(t.source);
            btns.appendChild(btn);
        });
    };
    renderButtons();
    function spawnAsteroid() {
        if (gameOver) return;
        const targetObj = currentTargets[Math.floor(Math.random() * currentTargets.length)];
        const el = document.createElement('div');
        const xPos = 10 + Math.random() * 60;
        el.className = 'absolute text-center transition-none pointer-events-none rounded-full flex items-center justify-center text-xs font-black p-2';
        el.style.cssText = 'left:' + xPos + '%;top:-50px;width:70px;height:70px;background-image:radial-gradient(circle at 30% 30%,#555,#222);color:white;box-shadow:inset -5px -5px 15px rgba(0,0,0,0.8)';
        el.textContent = targetObj.source;
        arena.appendChild(el);
        activeAsteroids.push({ el, source: targetObj.source, y: -50, startTime: Date.now() });
    }
    function fireLaser(sourceMatched) {
        let lowestIdx = -1, maxProgress = -1;
        for (let i = 0; i < activeAsteroids.length; i++) {
            if (activeAsteroids[i].source === sourceMatched) {
                const elapsed = Date.now() - activeAsteroids[i].startTime;
                if (elapsed > maxProgress) { maxProgress = elapsed; lowestIdx = i; }
            }
        }
        if (lowestIdx >= 0) {
            const ast = activeAsteroids[lowestIdx];
            ast.el.textContent = ''; ast.el.innerHTML = '&#x1F4A5;'; ast.el.style.background = 'transparent'; ast.el.style.boxShadow = 'none';
            setTimeout(() => { if (ast.el.parentNode) ast.el.parentNode.removeChild(ast.el); }, 200);
            activeAsteroids.splice(lowestIdx, 1); score += 15; self._playSound('correct'); updateHeader();
        } else { self._playSound('incorrect'); score = Math.max(0, score - 5); updateHeader(); }
    }
    function updateHeader() { const h = overlay.firstElementChild; if (h) h.outerHTML = self._renderHeader('Svemirski Osvajaci', 1, '?', lives, score); }
    function gameLoop() {
        if (gameOver) return;
        const arenaH = arena.clientHeight || 320;
        for (let i = activeAsteroids.length - 1; i >= 0; i--) {
            const ast = activeAsteroids[i];
            const elapsed = Date.now() - ast.startTime;
            const progress = elapsed / speed;
            ast.y = -50 + (arenaH + 50) * progress;
            ast.el.style.top = ast.y + 'px';
            if (ast.y >= arenaH - 20) {
                ast.el.innerHTML = '&#x1F4A5;';
                setTimeout(() => { if (ast.el.parentNode) ast.el.parentNode.removeChild(ast.el); }, 200);
                activeAsteroids.splice(i, 1); lives--; self._playSound('incorrect'); updateHeader();
                if (lives <= 0) { gameOver = true; clearInterval(spawnTimer); overlay.innerHTML = self._renderGameOver('Svemirski Osvajaci', score, '__original_startSpaceInvaders'); return; }
            }
        }
        frameId = requestAnimationFrame(gameLoop);
    }
    spawnAsteroid();
    spawnTimer = setInterval(spawnAsteroid, 1500);
    frameId = requestAnimationFrame(gameLoop);
    this._timers.push({ clear: () => { gameOver = true; clearInterval(spawnTimer); cancelAnimationFrame(frameId); } });
};

// 28. Simon Kaze (Simon Says / Audio Memory)
ArcadeEngine.startSimonSays = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let score = 0, sequence = [], playerStep = 0, isPlaying = false;
    const self = this;
    const allWords = this._getWords(9);
    if (allWords.length < 4) { this._hideOverlay(); return; }
    const gridWords = allWords.slice(0, 4);
    const colors = ['bg-red-500','bg-blue-500','bg-yellow-500','bg-green-500'];
    const hoverColors = ['hover:bg-red-400','hover:bg-blue-400','hover:bg-yellow-400','hover:bg-green-400'];
    const activeColors = ['bg-red-300','bg-blue-300','bg-yellow-300','bg-green-300'];
    overlay.innerHTML = `
        ${this._renderHeader('Simon Kaze', 1, '?', '1', score)}
        <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center">
            <p id="simon-status" class="text-xl font-bold mb-6 h-8 text-gray-300">Listen...</p>
            <div class="grid grid-cols-2 gap-4 w-full max-w-[280px]" id="simon-grid"></div>
        </div>`;
    const grid = document.getElementById('simon-grid');
    const status = document.getElementById('simon-status');
    const buttons = [];
    gridWords.forEach((w, i) => {
        const btn = document.createElement('button');
        btn.className = 'aspect-square rounded-2xl shadow-lg transition-all transform flex flex-col items-center justify-center p-4 ' + colors[i] + ' ' + hoverColors[i];
        const emoji = document.createElement('span'); emoji.className = 'text-3xl mb-2'; emoji.textContent = w.emoji || '&#x1F508;';
        const label = document.createElement('span'); label.className = 'font-black text-white drop-shadow-md text-sm truncate w-full text-center'; label.textContent = w.target;
        btn.appendChild(emoji); btn.appendChild(label);
        btn.onclick = () => {
            if (isPlaying) return;
            flashButton(i);
            self._speak(w.source);
            if (sequence[playerStep] === i) {
                playerStep++;
                if (playerStep === sequence.length) { score += 10 * sequence.length; self._playSound('correct'); updateHeader(); setTimeout(nextRound, 1000); }
            } else { self._playSound('incorrect'); overlay.innerHTML = self._renderGameOver('Simon Kaze', score, '__original_startSimonSays'); }
        };
        grid.appendChild(btn); buttons.push(btn);
    });
    const flashButton = (idx) => {
        const b = buttons[idx];
        b.classList.remove(colors[idx]); b.classList.add(activeColors[idx], 'scale-105');
        setTimeout(() => { b.classList.remove(activeColors[idx], 'scale-105'); b.classList.add(colors[idx]); }, 400);
    };
    const playSequence = async () => {
        isPlaying = true; status.innerText = "Listen...";
        for (let i = 0; i < sequence.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            flashButton(sequence[i]); self._speak(gridWords[sequence[i]].source);
        }
        status.innerText = "Your turn!"; isPlaying = false; playerStep = 0;
    };
    const nextRound = () => { sequence.push(Math.floor(Math.random() * 4)); playSequence(); };
    function updateHeader() { const h = overlay.firstElementChild; if (h) h.outerHTML = self._renderHeader('Simon Kaze', sequence.length, '?', '1', score); }
    setTimeout(nextRound, 1000);
};

// 29. Kolo Srece (Missing Vowels)
ArcadeEngine.startMissingVowels = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let score = 0, round = 1, timer = null, timeLeft = 15;
    const totalRounds = 10, self = this;
    const vowels = ['a','e','i','o','u'];
    const renderRound = () => {
        if (round > totalRounds) {
            self._awardXpBoost();
            overlay.innerHTML = '<div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center"><h2 class="text-5xl font-black text-yellow-400 mb-4">&#x1F3C6; Bravo!</h2><button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl text-xl font-bold mt-8 active:scale-95 transition-transform">Back to Arcade</button></div>';
            return;
        }
        const allWords = self._getWords(5).filter(w => w.source.length >= 4);
        if (allWords.length === 0) { self._hideOverlay(); return; }
        const w = allWords[0];
        let displayStr = '', missingChars = [];
        for (let i = 0; i < w.source.length; i++) {
            const char = w.source[i].toLowerCase();
            if (vowels.includes(char)) { displayStr += '_'; missingChars.push(char); }
            else { displayStr += w.source[i]; }
        }
        if (missingChars.length === 0) { round++; renderRound(); return; }
        timeLeft = 15;
        let currentIndex = 0;
        let vowelBtnsHtml = '';
        vowels.forEach(v => { vowelBtnsHtml += '<button class="mv-btn bg-white/10 hover:bg-white/20 p-4 rounded-xl text-2xl font-bold uppercase border-2 border-white/20 active:scale-95 transition-transform" data-val="' + v + '">' + v + '</button>'; });
        overlay.innerHTML = `
            ${self._renderHeader('Kolo Srece', round, totalRounds, '1', score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gradient-to-b from-purple-900 to-indigo-900 text-white p-6 w-full text-center">
                <div class="text-gray-400 font-bold mb-4 uppercase text-xs tracking-widest text-center">${w.target}</div>
                <div id="mv-timer" class="text-xl font-bold mb-8 text-yellow-300">&#x23F1; ${timeLeft}s</div>
                <div id="mv-display" class="text-5xl font-black tracking-[0.3em] mb-12 font-mono break-all px-4">${displayStr.toUpperCase()}</div>
                <div class="grid grid-cols-5 gap-2 w-full max-w-sm">${vowelBtnsHtml}</div>
            </div>`;
        const displayEl = document.getElementById('mv-display');
        const timerEl = document.getElementById('mv-timer');
        clearInterval(timer);
        timer = setInterval(() => {
            timeLeft--;
            timerEl.innerHTML = '&#x23F1; ' + timeLeft + 's';
            if (timeLeft <= 0) { clearInterval(timer); self._playSound('incorrect'); overlay.innerHTML = self._renderGameOver('Kolo Srece', score, '__original_startMissingVowels'); }
        }, 1000);
        const updateDisplay = () => {
            let tempStr = '', vIdx = 0;
            for (let i = 0; i < w.source.length; i++) {
                const char = w.source[i].toLowerCase();
                if (vowels.includes(char)) { if (vIdx < currentIndex) tempStr += w.source[i]; else tempStr += '_'; vIdx++; }
                else { tempStr += w.source[i]; }
            }
            displayEl.innerText = tempStr.toUpperCase();
        };
        document.querySelectorAll('.mv-btn').forEach(btn => {
            btn.onclick = () => {
                const val = btn.getAttribute('data-val');
                if (val === missingChars[currentIndex]) {
                    currentIndex++; self._playSound('correct'); updateDisplay();
                    if (currentIndex >= missingChars.length) { clearInterval(timer); score += 50 + (timeLeft * 2); setTimeout(() => { round++; renderRound(); }, 800); }
                } else {
                    self._playSound('incorrect'); timeLeft = Math.max(0, timeLeft - 3);
                    btn.classList.add('bg-red-500/50','border-red-500');
                    setTimeout(() => btn.classList.remove('bg-red-500/50','border-red-500'), 300);
                }
            };
        });
    };
    renderRound();
    this._timers.push({ clear: () => clearInterval(timer) });
};

// 30. Graditelj Reci (Syllable Smash)
ArcadeEngine.startSyllableSmash = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let score = 0, round = 1, lives = 3;
    const totalRounds = 10, self = this;
    const splitIntoSyllables = (word) => {
        const parts = []; let curr = '';
        for (let i = 0; i < word.length; i++) { curr += word[i]; if (i > 0 && i % 3 === 0 && i < word.length - 2) { parts.push(curr); curr = ''; } }
        if (curr) parts.push(curr);
        return parts.length > 1 ? parts : [word.substring(0, Math.floor(word.length/2)), word.substring(Math.floor(word.length/2))];
    };
    const renderRound = () => {
        if (lives <= 0) { overlay.innerHTML = self._renderGameOver('Graditelj Reci', score, '__original_startSyllableSmash'); return; }
        if (round > totalRounds) {
            self._awardXpBoost();
            overlay.innerHTML = '<div class="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-6 text-center"><h2 class="text-5xl font-black text-green-400 mb-4">&#x1F3C6; Gotovo!</h2><button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-gray-700 rounded-xl mt-8 font-bold">Back</button></div>';
            return;
        }
        const allWords = self._getWords(10).filter(w => w.source.length > 5 && !w.source.includes(' '));
        if (allWords.length === 0) { self._hideOverlay(); return; }
        const w = allWords[0];
        let originalBlocks = splitIntoSyllables(w.source);
        let shuffledBlocks = [...originalBlocks].sort(() => Math.random() - 0.5);
        let selectedBlocks = [];
        overlay.innerHTML = `
            ${self._renderHeader('Graditelj', round, totalRounds, lives, score)}
            <div class="flex flex-col items-center justify-center flex-1 bg-gray-900 text-white p-6 w-full text-center">
                <p class="text-lg text-gray-400 font-bold mb-8 text-center">${w.target}</p>
                <div id="ss-slots" class="flex flex-wrap gap-2 justify-center min-h-[60px] mb-12 w-full p-4 bg-gray-800 rounded-xl border-2 border-dashed border-gray-600"></div>
                <div id="ss-pool" class="flex flex-wrap gap-3 justify-center w-full"></div>
            </div>`;
        const slots = document.getElementById('ss-slots');
        const pool = document.getElementById('ss-pool');
        const checkWin = () => {
            const currentStr = selectedBlocks.join('');
            if (selectedBlocks.length === originalBlocks.length) {
                if (currentStr === w.source) { score += 50; self._playSound('correct'); slots.classList.add('bg-green-900','border-green-500'); setTimeout(() => { round++; renderRound(); }, 800); }
                else { lives--; self._playSound('incorrect'); slots.classList.add('bg-red-900','border-red-500'); setTimeout(() => { if (lives > 0) { round++; renderRound(); } else { renderRound(); } }, 800); }
            }
        };
        const renderBlocks = () => {
            let slotsHtml = '';
            selectedBlocks.forEach((blk, i) => { slotsHtml += '<div class="bg-indigo-600 text-white px-5 py-3 rounded-xl font-black text-2xl shadow-md cursor-pointer hover:bg-red-500 transition-colors" onclick="window.ssRemove(' + i + ')">' + blk + '</div>'; });
            slots.innerHTML = slotsHtml;
            let poolHtml = '';
            shuffledBlocks.forEach((blk, i) => {
                if (blk === null) { poolHtml += '<div class="w-16 h-12"></div>'; }
                else { poolHtml += '<button class="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-black text-2xl shadow-lg shadow-blue-900 active:scale-95 transition-transform" onclick="window.ssAdd(' + i + ')">' + blk + '</button>'; }
            });
            pool.innerHTML = poolHtml;
        };
        window.ssAdd = (i) => { selectedBlocks.push(shuffledBlocks[i]); shuffledBlocks[i] = null; renderBlocks(); checkWin(); };
        window.ssRemove = (i) => { const blk = selectedBlocks[i]; selectedBlocks.splice(i, 1); const emptyIdx = shuffledBlocks.indexOf(null); shuffledBlocks[emptyIdx] = blk; renderBlocks(); };
        renderBlocks();
    };
    renderRound();
};

// 31. Brza Trka (Verb Racer / Conjugation Drag Race)
ArcadeEngine.startVerbRacer = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let playerPos = 0, botPos = 0, round = 1, score = 0;
    const totalDist = 100, finishLine = 100;
    const self = this;
    let botInterval = null;

    const verbs = [
        { inf: 'Biti (to be)', pronoun: 'Ja', correct: 'sam', wrong: ['si', 'smo'] },
        { inf: 'Biti (to be)', pronoun: 'Oni', correct: 'su', wrong: ['smo', 'ste'] },
        { inf: 'Ići (to go)', pronoun: 'Mi', correct: 'idemo', wrong: ['ideš', 'idu'] },
        { inf: 'Ići (to go)', pronoun: 'Ti', correct: 'ideš', wrong: ['idem', 'idete'] },
        { inf: 'Raditi (to work)', pronoun: 'Ja', correct: 'radim', wrong: ['radi', 'radimo'] },
        { inf: 'Raditi (to work)', pronoun: 'Oni', correct: 'rade', wrong: ['radite', 'radimo'] },
        { inf: 'Gledati (to watch)', pronoun: 'Mi', correct: 'gledamo', wrong: ['gleda', 'gledaju'] },
        { inf: 'Piti (to drink)', pronoun: 'Vi', correct: 'pijete', wrong: ['pijem', 'pijemo'] },
        { inf: 'Jesti (to eat)', pronoun: 'Ona', correct: 'jede', wrong: ['jedem', 'jedu'] },
        { inf: 'Živeti (to live)', pronoun: 'Ja', correct: 'živim', wrong: ['živi', 'živimo'] },
        { inf: 'Voleti (to love)', pronoun: 'Ti', correct: 'voliš', wrong: ['voli', 'volimo'] },
        { inf: 'Govoriti (to speak)', pronoun: 'Oni', correct: 'govore', wrong: ['govori', 'govorite'] }
    ].sort(() => Math.random() - 0.5);

    let vIdx = 0;

    const renderTrack = () => {
        if (playerPos >= finishLine || botPos >= finishLine) {
            clearInterval(botInterval);
            if (playerPos >= finishLine) {
                self._awardXpBoost();
                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                        <div class="text-7xl mb-4 animate-bounce">🏎️ 🏆</div>
                        <h2 class="text-4xl font-black text-amber-400 mb-2">POBEDA!</h2>
                        <p class="text-slate-300 text-lg mb-6">Pobedio si Marka u trci konjugacija!</p>
                        <p class="text-2xl font-black text-green-400 mb-8">+${score} XP</p>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl shadow-lg active:scale-95 transition-transform text-lg">Nazad u Arkadu</button>
                    </div>`;
            } else {
                overlay.innerHTML = self._renderGameOver('Brza Trka', score, '__original_startVerbRacer');
            }
            return;
        }

        const currentV = verbs[vIdx % verbs.length];
        const options = [currentV.correct, ...currentV.wrong].sort(() => Math.random() - 0.5);

        overlay.innerHTML = `
            ${self._renderHeader('Brza Trka', round, '10', '🏎️', score)}
            <div class="flex flex-col flex-1 bg-slate-950 text-white p-4 justify-between">
                <!-- Racetrack -->
                <div class="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
                    <div>
                        <div class="flex justify-between text-xs font-bold text-blue-400 mb-1">
                            <span>🏎️ TI</span><span>${playerPos}%</span>
                        </div>
                        <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300" style="width: ${playerPos}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-bold text-red-400 mb-1">
                            <span>🚗 MARKO BOT</span><span>${botPos}%</span>
                        </div>
                        <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <div class="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-300" style="width: ${botPos}%"></div>
                        </div>
                    </div>
                </div>

                <!-- Verb Prompt -->
                <div class="text-center my-4">
                    <p class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Konjuguj glagol</p>
                    <h3 class="text-2xl font-black text-amber-400 mb-2">${currentV.inf}</h3>
                    <div class="inline-block px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xl font-black text-white">
                        ${currentV.pronoun} + <span class="text-cyan-400">___ ?</span>
                    </div>
                </div>

                <!-- Nitro Options -->
                <div class="grid grid-cols-3 gap-2 w-full max-w-md mx-auto" id="racer-opts"></div>
            </div>`;

        const optsContainer = document.getElementById('racer-opts');
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'py-4 px-2 bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 active:border-cyan-400 rounded-2xl font-black text-lg text-white shadow-md active:scale-95 transition-all text-center';
            btn.innerText = opt;
            btn.onclick = () => {
                optsContainer.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === currentV.correct) {
                    btn.classList.add('bg-green-600', 'border-green-400');
                    playerPos = Math.min(100, playerPos + 25);
                    score += 50;
                    self._playSound('correct');
                } else {
                    btn.classList.add('bg-red-600', 'border-red-400');
                    self._playSound('incorrect');
                }
                setTimeout(() => {
                    round++;
                    vIdx++;
                    renderTrack();
                }, 400);
            };
            optsContainer.appendChild(btn);
        });
    };

    renderTrack();
    botInterval = setInterval(() => {
        botPos = Math.min(100, botPos + 6);
        const botBar = overlay.querySelector('.bg-gradient-to-r.from-red-500');
        if (botBar) botBar.style.width = botPos + '%';
        if (botPos >= finishLine) renderTrack();
    }, 1800);

    this._timers.push({ clear: () => clearInterval(botInterval) });
};

// 32. Dvoboj (Quick-Draw Reflex Duel)
ArcadeEngine.startDuel = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let round = 1, lives = 3, score = 0;
    const maxRounds = 5, self = this;
    let duelTimeout = null, countdownInterval = null;

    const renderRound = () => {
        if (lives <= 0) {
            overlay.innerHTML = self._renderGameOver('Dvoboj', score, '__original_startDuel');
            return;
        }
        if (round > maxRounds) {
            self._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                    <div class="text-7xl mb-4 animate-bounce">🤠 🏆</div>
                    <h2 class="text-4xl font-black text-amber-400 mb-2">NEPOBEĐENI REVOLVERAŠ!</h2>
                    <p class="text-slate-300 text-lg mb-6">Pobedio si u svim rundama brze reakcije!</p>
                    <p class="text-2xl font-black text-green-400 mb-8">+${score} XP</p>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black rounded-2xl shadow-lg active:scale-95 transition-transform text-lg">Nazad u Arkadu</button>
                </div>`;
            return;
        }

        const words = self._getWords(4);
        if (words.length < 2) { self._hideOverlay(); return; }
        const targetWord = words[0];
        const distractor = words[1];
        const options = [targetWord, distractor].sort(() => Math.random() - 0.5);

        overlay.innerHTML = `
            ${self._renderHeader('Dvoboj', round, maxRounds, lives, score)}
            <div class="flex flex-col flex-1 bg-amber-950/40 text-white p-6 justify-between items-center text-center">
                <div class="w-full flex justify-between items-center px-4 pt-2">
                    <div class="text-left"><span class="text-3xl">🤠</span><p class="text-xs font-bold text-amber-300">TI</p></div>
                    <div class="text-xl font-black text-red-400">VS</div>
                    <div class="text-right"><span class="text-3xl">🦹</span><p class="text-xs font-bold text-amber-300">ODMETNIK</p></div>
                </div>

                <!-- Signal Box -->
                <div id="duel-box" class="p-6 bg-slate-900/90 rounded-3xl border-2 border-amber-600/50 shadow-2xl w-full max-w-xs transition-all">
                    <div id="duel-status" class="text-amber-400 font-black text-2xl mb-2 animate-pulse">Spremi se...</div>
                    <div id="duel-word" class="text-3xl font-black text-white hidden">???</div>
                </div>

                <!-- Action Buttons -->
                <div id="duel-actions" class="grid grid-cols-2 gap-3 w-full max-w-sm opacity-20 pointer-events-none transition-opacity"></div>
            </div>`;

        const box = document.getElementById('duel-box');
        const statusEl = document.getElementById('duel-status');
        const wordEl = document.getElementById('duel-word');
        const actions = document.getElementById('duel-actions');

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'py-4 px-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-lg active:scale-95 transition-all';
            btn.innerText = opt.target;
            btn.onclick = () => {
                clearTimeout(duelTimeout);
                actions.querySelectorAll('button').forEach(b => b.disabled = true);
                if (opt === targetWord) {
                    btn.classList.add('bg-green-500');
                    score += 100;
                    self._playSound('correct');
                    statusEl.innerText = '🎯 POGODAK!';
                    statusEl.className = 'text-green-400 font-black text-3xl animate-bounce';
                } else {
                    btn.classList.add('bg-red-500');
                    lives--;
                    self._playSound('incorrect');
                    statusEl.innerText = '💥 PROMAŠAJ!';
                    statusEl.className = 'text-red-500 font-black text-3xl animate-pulse';
                }
                setTimeout(() => { round++; renderRound(); }, 900);
            };
            actions.appendChild(btn);
        });

        // Countdown delay between 1.5s to 3s before signal
        const drawDelay = 1500 + Math.random() * 1500;
        duelTimeout = setTimeout(() => {
            statusEl.innerText = 'PALI! (DRAW!)';
            statusEl.className = 'text-red-500 font-black text-3xl animate-ping';
            wordEl.innerText = targetWord.source;
            wordEl.classList.remove('hidden');
            actions.classList.remove('opacity-20', 'pointer-events-none');

            // 1.8 second reaction window
            duelTimeout = setTimeout(() => {
                actions.querySelectorAll('button').forEach(b => b.disabled = true);
                lives--;
                self._playSound('incorrect');
                statusEl.innerText = '💀 PREKASNO!';
                statusEl.className = 'text-red-500 font-black text-3xl animate-pulse';
                setTimeout(() => { round++; renderRound(); }, 900);
            }, 1800);
        }, drawDelay);
    };

    renderRound();
    this._timers.push({ clear: () => clearTimeout(duelTimeout) });
};

// 33. Pijaca / Korpa (Balkan Market Basket Run)
ArcadeEngine.startMarketRun = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let round = 1, lives = 3, score = 0;
    const maxRounds = 5, self = this;

    const groceries = [
        { sr: 'Jabuka', en: 'Apple', icon: '🍎' },
        { sr: 'Hleb', en: 'Bread', icon: '🍞' },
        { sr: 'Mleko', en: 'Milk', icon: '🥛' },
        { sr: 'Sir', en: 'Cheese', icon: '🧀' },
        { sr: 'Kafa', en: 'Coffee', icon: '☕' },
        { sr: 'Meso', en: 'Meat', icon: '🥩' },
        { sr: 'Riba', en: 'Fish', icon: '🐟' },
        { sr: 'Paradajz', en: 'Tomato', icon: '🍅' },
        { sr: 'Krompir', en: 'Potato', icon: '🥔' },
        { sr: 'Jaje', en: 'Egg', icon: '🥚' },
        { sr: 'Voda', en: 'Water', icon: '💧' },
        { sr: 'Grožđe', en: 'Grapes', icon: '🍇' }
    ];

    const renderRound = () => {
        if (lives <= 0) {
            overlay.innerHTML = self._renderGameOver('Pijaca', score, '__original_startMarketRun');
            return;
        }
        if (round > maxRounds) {
            self._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                    <div class="text-7xl mb-4 animate-bounce">🧺 🏆</div>
                    <h2 class="text-4xl font-black text-amber-400 mb-2">PUNA KORPA!</h2>
                    <p class="text-slate-300 text-lg mb-6">Uspešno si kupio sve sa spiska na Kalenić pijaci!</p>
                    <p class="text-2xl font-black text-green-400 mb-8">+${score} XP</p>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black rounded-2xl shadow-lg active:scale-95 transition-transform text-lg">Nazad u Arkadu</button>
                </div>`;
            return;
        }

        const shuffled = [...groceries].sort(() => Math.random() - 0.5);
        const needed = shuffled.slice(0, 3);
        const extras = shuffled.slice(3, 8);
        const marketItems = [...needed, ...extras].sort(() => Math.random() - 0.5);
        let collected = [];

        overlay.innerHTML = `
            ${self._renderHeader('Pijaca', round, maxRounds, lives, score)}
            <div class="flex flex-col flex-1 bg-slate-950 text-white p-4 justify-between">
                <!-- Shopping List -->
                <div class="bg-amber-900/40 border-2 border-amber-600/40 rounded-2xl p-4 text-center shadow-lg">
                    <p class="text-xs uppercase tracking-widest text-amber-300 font-bold mb-2">📜 Spisak za kupovinu (Shopping List)</p>
                    <div class="flex justify-center gap-3" id="shopping-targets">
                        ${needed.map(item => `
                            <div class="target-item px-3 py-1.5 bg-slate-900/90 rounded-xl border border-amber-500/50 text-sm font-bold flex items-center gap-1.5" id="target-${item.sr}">
                                <span>${item.icon}</span> <span>${item.en}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Market Stall Items -->
                <div class="my-auto">
                    <p class="text-center text-xs text-slate-400 font-bold mb-3">Dodirni samo namirnice sa spiska (na srpskom):</p>
                    <div class="grid grid-cols-4 gap-2.5 max-w-md mx-auto" id="stall-grid">
                        ${marketItems.map(item => `
                            <button class="stall-item p-3 bg-slate-800 hover:bg-slate-700 active:scale-90 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-center transition-all shadow-md group" data-sr="${item.sr}">
                                <span class="text-3xl mb-1 group-hover:scale-110 transition-transform">${item.icon}</span>
                                <span class="text-xs font-black text-slate-200 truncate w-full text-center">${item.sr}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="text-center text-xs text-slate-500 font-bold">Korpa: <span id="cart-count">0</span> / 3 kupljeno</div>
            </div>`;

        const stallBtns = overlay.querySelectorAll('.stall-item');
        const cartCount = document.getElementById('cart-count');

        stallBtns.forEach(btn => {
            btn.onclick = () => {
                const srName = btn.getAttribute('data-sr');
                const isNeeded = needed.some(n => n.sr === srName);

                if (isNeeded && !collected.includes(srName)) {
                    collected.push(srName);
                    btn.classList.add('bg-green-600', 'border-green-400', 'opacity-40');
                    btn.disabled = true;
                    self._playSound('correct');
                    score += 30;

                    const targetBadge = document.getElementById('target-' + srName);
                    if (targetBadge) targetBadge.classList.add('bg-green-900', 'line-through', 'text-green-300');
                    cartCount.innerText = collected.length;

                    if (collected.length === needed.length) {
                        score += 50;
                        setTimeout(() => { round++; renderRound(); }, 600);
                    }
                } else {
                    lives--;
                    btn.classList.add('bg-red-600', 'border-red-400');
                    self._playSound('incorrect');
                    setTimeout(() => btn.classList.remove('bg-red-600', 'border-red-400'), 400);
                    if (lives <= 0) setTimeout(() => renderRound(), 400);
                }
            };
        });
    };

    renderRound();
};

// 34. Pikado (Word Darts / Target Meaning)
ArcadeEngine.startWordDarts = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let round = 1, lives = 3, score = 0;
    const maxRounds = 8, self = this;

    const renderRound = () => {
        if (lives <= 0) {
            overlay.innerHTML = self._renderGameOver('Pikado', score, '__original_startWordDarts');
            return;
        }
        if (round > maxRounds) {
            self._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                    <div class="text-7xl mb-4 animate-bounce">🎯 🏆</div>
                    <h2 class="text-4xl font-black text-amber-400 mb-2">PRAVO U METU!</h2>
                    <p class="text-slate-300 text-lg mb-6">Pogodio si sve mete tačnim prevodima!</p>
                    <p class="text-2xl font-black text-green-400 mb-8">+${score} XP</p>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform text-lg">Nazad u Arkadu</button>
                </div>`;
            return;
        }

        const words = self._getWords(5);
        if (words.length < 4) { self._hideOverlay(); return; }
        const correct = words[0];
        const targets = words.slice(0, 4).sort(() => Math.random() - 0.5);

        overlay.innerHTML = `
            ${self._renderHeader('Pikado', round, maxRounds, lives, score)}
            <div class="flex flex-col flex-1 bg-slate-950 text-white p-4 justify-between items-center text-center">
                <!-- Target Prompt -->
                <div class="mt-2">
                    <p class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Pogodi metu za reč:</p>
                    <div class="px-6 py-3 bg-slate-900 border-2 border-red-500/50 rounded-2xl inline-block shadow-lg">
                        <span class="text-2xl font-black text-amber-400">${correct.target}</span>
                    </div>
                </div>

                <!-- Dartboard Targets -->
                <div class="grid grid-cols-2 gap-4 w-full max-w-sm my-auto" id="dart-grid">
                    ${targets.map((t, idx) => `
                        <button class="dart-target p-5 bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 hover:border-red-500 rounded-3xl flex flex-col items-center justify-center active:scale-95 transition-all shadow-xl group relative overflow-hidden" data-sr="${t.source}">
                            <div class="w-10 h-10 rounded-full border-2 border-dashed border-red-500/40 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <span class="text-lg font-black text-red-400">${idx + 1}</span>
                            </div>
                            <span class="text-lg font-black text-white group-hover:text-amber-300 transition-colors">${t.source}</span>
                            <span class="text-[10px] text-slate-500 font-bold uppercase mt-1">META</span>
                        </button>
                    `).join('')}
                </div>

                <div class="text-xs text-slate-500 font-bold mb-2">🎯 Dodirni tačnu metu da baciš strelicu!</div>
            </div>`;

        const targetBtns = overlay.querySelectorAll('.dart-target');
        targetBtns.forEach(btn => {
            btn.onclick = () => {
                targetBtns.forEach(b => b.disabled = true);
                const chosen = btn.getAttribute('data-sr');
                if (chosen === correct.source) {
                    btn.classList.add('bg-green-600', 'border-green-400');
                    btn.innerHTML = `<span class="text-4xl animate-bounce">🎯</span><span class="font-black text-white text-lg">POGODAK!</span>`;
                    score += 80;
                    self._playSound('correct');
                    setTimeout(() => { round++; renderRound(); }, 700);
                } else {
                    btn.classList.add('bg-red-600', 'border-red-400');
                    btn.innerHTML = `<span class="text-4xl">❌</span><span class="font-black text-white text-lg">PROMAŠAJ!</span>`;
                    lives--;
                    self._playSound('incorrect');
                    setTimeout(() => { round++; renderRound(); }, 700);
                }
            };
        });
    };

    renderRound();
};

// 35. Detektiv (Padeži / Case Detective)
ArcadeEngine.startDetective = function() {
    this._cleanup();
    this._showOverlay();
    const overlay = document.getElementById('arcade-game-overlay');
    let round = 1, lives = 3, score = 0;
    const maxRounds = 7, self = this;

    const cases = [
        { sentence: 'Idem u ___ sutra ujutru.', base: 'Beograd', clue: 'Gde ideš? [Akuzativ za pravac]', correct: 'Beograd', options: ['Beograd', 'Beogradu', 'Beograda'] },
        { sentence: 'Razgovaramo o novoj ___.', base: 'Knjiga', clue: 'O kome/čemu? [Lokativ]', correct: 'knjizi', options: ['knjizi', 'knjigu', 'knjigom'] },
        { sentence: 'Molim te, daj mi malo ___.', base: 'Voda', clue: 'Koga/čega? [Genitiv / Količina]', correct: 'vode', options: ['vode', 'vodu', 'vodi'] },
        { sentence: 'Idem u bioskop sa ___.', base: 'Marko', clue: 'S kim ideš? [Instrumental]', correct: 'Markom', options: ['Markom', 'Marka', 'Marku'] },
        { sentence: 'Kupio sam poklon svojoj ___.', base: 'Mama', clue: 'Kome daješ? [Dativ]', correct: 'mami', options: ['mami', 'mamu', 'mame'] },
        { sentence: 'U dvorištu vidim velikog ___.', base: 'Pas', clue: 'Koga/šta vidiš? [Akuzativ za živo biće]', correct: 'psa', options: ['psa', 'pas', 'psu'] },
        { sentence: 'Oni već tri godine žive u ___.', base: 'Novi Sad', clue: 'Gde se nalaze? [Lokativ za mesto]', correct: 'Novom Sadu', options: ['Novom Sadu', 'Novi Sad', 'Novog Sada'] }
    ].sort(() => Math.random() - 0.5);

    const renderRound = () => {
        if (lives <= 0) {
            overlay.innerHTML = self._renderGameOver('Detektiv', score, '__original_startDetective');
            return;
        }
        if (round > maxRounds) {
            self._awardXpBoost();
            overlay.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                    <div class="text-7xl mb-4 animate-bounce">🕵️ 🏆</div>
                    <h2 class="text-4xl font-black text-amber-400 mb-2">SLUČAJ REŠEN!</h2>
                    <p class="text-slate-300 text-lg mb-6">Majstorski si prepoznao sve padeže i rešio misteriju!</p>
                    <p class="text-2xl font-black text-green-400 mb-8">+${score} XP</p>
                    <button onclick="ArcadeEngine._hideOverlay()" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform text-lg">Nazad u Arkadu</button>
                </div>`;
            return;
        }

        const currentCase = cases[round - 1];
        const shuffledOpts = [...currentCase.options].sort(() => Math.random() - 0.5);

        overlay.innerHTML = `
            ${self._renderHeader('Detektiv', round, maxRounds, lives, score)}
            <div class="flex flex-col flex-1 bg-slate-950 text-white p-5 justify-between">
                <!-- Case File Header -->
                <div class="bg-indigo-950/50 border-2 border-indigo-700/50 rounded-2xl p-4 text-center shadow-lg">
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <span class="text-2xl">🕵️</span>
                        <span class="text-xs uppercase tracking-widest text-indigo-300 font-black">Dosije #${round}: Misterija Padeža</span>
                    </div>
                    <p class="text-xs font-bold text-amber-300 mb-3 bg-indigo-900/40 py-1 px-3 rounded-lg inline-block">${currentCase.clue}</p>
                    
                    <div class="p-3 bg-slate-900 rounded-xl border border-slate-700 text-lg font-black text-white">
                        "${currentCase.sentence.replace('___', '<span class="text-amber-400 underline font-black">___</span>')}"
                    </div>
                    <p class="text-xs text-slate-400 mt-2">Osnovna reč: <span class="text-cyan-300 font-bold">${currentCase.base}</span></p>
                </div>

                <!-- Clue Options -->
                <div class="space-y-2.5 my-auto max-w-sm mx-auto w-full" id="detective-opts">
                    ${shuffledOpts.map(opt => `
                        <button class="case-opt w-full py-4 px-4 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 rounded-2xl text-lg font-black text-white flex items-center justify-between active:scale-95 transition-all shadow-md group" data-val="${opt}">
                            <span class="flex items-center gap-2"><span class="text-indigo-400 group-hover:translate-x-1 transition-transform">🔍</span> <span>${opt}</span></span>
                            <span class="text-[10px] text-slate-500 font-bold uppercase group-hover:text-indigo-300 transition-colors">IZABERI</span>
                        </button>
                    `).join('')}
                </div>

                <div class="text-center text-xs text-slate-500 font-bold">Pronađi tačan oblik reči za dati padež!</div>
            </div>`;

        const optBtns = overlay.querySelectorAll('.case-opt');
        optBtns.forEach(btn => {
            btn.onclick = () => {
                optBtns.forEach(b => b.disabled = true);
                const val = btn.getAttribute('data-val');
                if (val === currentCase.correct) {
                    btn.classList.add('bg-green-600', 'border-green-400');
                    score += 100;
                    self._playSound('correct');
                    setTimeout(() => { round++; renderRound(); }, 700);
                } else {
                    btn.classList.add('bg-red-600', 'border-red-400');
                    lives--;
                    self._playSound('incorrect');
                    setTimeout(() => { round++; renderRound(); }, 700);
                }
            };
        });
    };

    renderRound();
};

// Monkey-patch all startXXX functions to redirect to preLaunch automatically
Object.keys(ArcadeEngine).forEach(key => {
    if (key.startsWith('start') && typeof ArcadeEngine[key] === 'function' && key !== 'startBotOpponent') {
        const originalFn = ArcadeEngine[key];
        ArcadeEngine['__original_' + key] = originalFn.bind(ArcadeEngine);
        ArcadeEngine[key] = function() {
            ArcadeEngine.preLaunch(key);
        };
    }
});

window.ArcadeEngine = ArcadeEngine;
