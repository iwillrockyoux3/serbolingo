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
        
        return `
            <div class="flex justify-between items-center p-4 bg-gray-800 text-white w-full">
                <div class="font-bold">${title}</div>
                <div class="flex space-x-4 text-sm">
                    ${levelHtml}
                    ${livesHtml}
                    ${scoreHtml}
                </div>
                <button onclick="ArcadeEngine._hideOverlay()" class="text-2xl font-bold">&times;</button>
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

    startBotOpponent: function(containerId) {
        const container = document.getElementById(containerId);
        if(!container) return;
        
        let progress = 0;
        container.innerHTML = `
            <div class="w-full bg-gray-700 rounded h-4 mt-2">
                <div id="bot-progress" class="bg-red-500 h-4 rounded" style="width: 0%"></div>
            </div>
            <div class="text-xs text-center text-gray-400 mt-1">Marko_Bot</div>
        `;
        const bar = document.getElementById('bot-progress');
        
        const botTimer = setInterval(() => {
            if(Math.random() > 0.3) {
                progress += Math.random() * 15;
                if(progress > 100) progress = 100;
                if(bar) bar.style.width = progress + '%';
            }
        }, 1000);
        this._timers.push(botTimer);
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
    }
};
window.ArcadeEngine = ArcadeEngine;
