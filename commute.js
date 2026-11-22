// [SHIELD_DAEMON: VALIDATED]
// Priority 17: Hands-Free / Commute Audio Mode (Pimsleur-Style)

window.CommuteEngine = (function() {
    let basePool = [];
    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;
    let pauseTime = 3000;
    let loopActive = false;
    let loopId = 0; // Unique ID to prevent ghost loops
    let nextPrevTimeout = null;
    
    // Session State
    let sessionMode = 'listen'; // 'listen' or 'answer'
    let isInfinite = false;
    let quantity = 50;

    function getDirection() {
        if (window.appState && window.appState.settings && window.appState.settings.learningDirection) {
            // 'en_to_sr' (Native English, learning Serbian) -> Prompt: English, Answer: Serbian ('en-sr')
            // 'sr_to_en' (Native Serbian, learning English) -> Prompt: Serbian, Answer: English ('sr-en')
            return window.appState.settings.learningDirection === 'en_to_sr' ? 'en-sr' : 'sr-en';
        }
        return 'en-sr';
    }

    let micEnabled = false;
    let isMicRecording = false;
    let recognition = null;
    let currentExpectedAnswer = null;
    let listeningForAnswer = false;
    let answerFound = false;
    let currentAudio = null;

    const el = (id) => document.getElementById(id);

    let lastHeardTranscript = "";

    function normalizeText(str) {
        let s = str.toLowerCase();
        const map = {'а':'a', 'б':'b', 'в':'v', 'г':'g', 'д':'d', 'ђ':'đ', 'е':'e', 'ж':'ž', 'з':'z', 'и':'i', 'ј':'j', 'к':'k', 'л':'l', 'љ':'lj', 'м':'m', 'н':'n', 'њ':'nj', 'о':'o', 'п':'p', 'р':'r', 'с':'s', 'т':'t', 'ћ':'ć', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c', 'ч':'č', 'џ':'dž', 'ш':'š'};
        s = s.split('').map(c => map[c] || c).join('');
        return s.replace(/[.,?!()]/g, '').replace(/\s+/g, ' ').trim();
    }

    // ── Persistent Speech Recognition ──
    function initMic() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            if (window.app) window.app.showToast('Speech Recognition not supported in this browser.', 'error');
            return false;
        }

        const currentDir = getDirection();
        const targetLang = (currentDir === 'sr-en') ? 'en-US' : 'sr-RS';

        // Destroy if language has changed globally
        if (recognition && recognition.lang !== targetLang) {
            try { recognition.stop(); } catch(e) {}
            recognition = null;
        }

        if (!recognition) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRec();
            recognition.lang = targetLang;
            recognition.continuous = true;
            recognition.interimResults = true; // MUST BE TRUE for fast response
            
            recognition.onstart = () => { isMicRecording = true; };

            recognition.onresult = (e) => {
                if (!listeningForAnswer || !currentExpectedAnswer) return;
                
                const expectedClean = normalizeText(currentExpectedAnswer);
                let matched = false;
                
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    const raw = e.results[i][0].transcript;
                    if (!raw) continue;
                    
                    lastHeardTranscript = raw; 
                    
                    // Show live text so user knows it's working in the Answer slot
                    const answerEl = el('commute-current-en'); // Bottom slot
                    answerEl.innerText = "🎙️ " + raw;
                    
                    const r = normalizeText(raw);
                    if (!r) continue; 
                    
                    const regex = new RegExp(`(?:^|\\s)${expectedClean}(?:\\s|$)`);
                    if (r === expectedClean || regex.test(r)) {
                        matched = true;
                        break;
                    }
                }

                if (matched) {
                    answerFound = true;
                    if (window.app && window.app.playSound) window.app.playSound('correct');
                    const promptEl = el('commute-current-sr'); // Top slot gets the green flash
                    promptEl.classList.add('text-green-400');
                    setTimeout(() => promptEl.classList.remove('text-green-400'), 1500);
                }
            };

            recognition.onend = () => {
                isMicRecording = false;
                if (micEnabled && isPlaying) {
                    try { recognition.start(); } catch(err) {}
                }
            };
            
            recognition.onerror = (e) => {
                console.log('Commute mic error:', e.error);
                isMicRecording = false;
            };
        }
        return true;
    }

    // ── Reliable TTS via Google Translate Audio ──
    function speakGTX(text, lang) {
        return new Promise(resolve => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }

            const gtLang = lang.startsWith('sr') ? 'sr' : 'en';
            let cleanText = text ? text.trim() : '';
            if (gtLang === 'sr' && cleanText && !/[.!?,\-:;]$/.test(cleanText)) {
                cleanText += '.';
            }
            const textForGoogle = (gtLang === 'sr' && window.app && window.app.toCyrillic) ? window.app.toCyrillic(cleanText) : cleanText;
            const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=' + gtLang + '&q=' + encodeURIComponent(textForGoogle) + '&_t=' + Date.now(); 
            const audio = new Audio();
            audio.referrerPolicy = "no-referrer";
            audio.preload = "auto";
            // Set playbackRate after metadata loads for reliability
            if (gtLang === 'sr') {
                audio.onloadedmetadata = function() { audio.playbackRate = 0.85; };
            }
            currentAudio = audio;
            audio.volume = 1;
            audio.src = url;

            const cleanup = () => {
                const pulse = el('commute-pulse');
                if (pulse) pulse.classList.remove('opacity-100');
                if (currentAudio === audio) currentAudio = null;
                resolve();
            };

            audio.onended = cleanup;
            audio.onerror = () => {
                console.warn('GTX TTS failed, trying native for:', text);
                currentAudio = null;
                speakNative(text, lang).then(resolve);
            };

            const pulse = el('commute-pulse');
            if (pulse) pulse.classList.add('opacity-100');
            
            audio.play().catch(() => {
                currentAudio = null;
                speakNative(text, lang).then(resolve);
            });
            setTimeout(cleanup, 6000); // Safety timeout
        });
    }

    function speakNative(text, lang) {
        return new Promise(resolve => {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang;
            u.volume = 1;
            if (lang.startsWith('sr')) u.rate = 0.85;

            u.onend = resolve;
            u.onerror = resolve;
            window.speechSynthesisUtteranceStorage = u;
            window.speechSynthesis.speak(u);
            setTimeout(resolve, 5000);
        });
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ── Playlist Loading ──
    async function loadPlaylist() {
        const cat = el('commute-category').value;
        let allWords = [];

        try {
            if (window.appDb && window.appDb._db) {
                allWords = await window.appDb.getAllWords();
            }
        } catch (e) {
            console.warn('CommuteEngine: IndexedDB failed.', e);
        }

        if (allWords.length === 0 && window.SEED_DATA) {
            allWords = window.SEED_DATA;
        }

        if (allWords.length === 0) {
            el('commute-current-sr').innerText = 'Nema reči!';
            el('commute-current-en').innerText = 'No words loaded.';
            return;
        }

        basePool = [];

        if (cat === 'mistakes') {
            const mistakes = (window.appState && window.appState.mistakeLog) || {};
            basePool = allWords.filter(w => mistakes[w.id]);
        } else if (cat === 'favorites') {
            const favs = (window.appState && window.appState.favorites) || {};
            basePool = allWords.filter(w => favs[w.id]);
        } else if (cat === 'phrases') {
            basePool = allWords.filter(w => w.category === 'phrases' || ((w.sr || w.sr_lat) && (w.sr || w.sr_lat).includes(' ')));
        } else {
            basePool = [...allWords];
        }

        if (basePool.length === 0) {
            basePool = [...allWords];
        }

        // Shuffle base pool permanently for this session
        basePool.sort(() => 0.5 - Math.random());
        applyQuantity();

        currentIndex = 0;
        updateDisplay();
    }

    function applyQuantity() {
        if (basePool.length === 0) return;
        if (isInfinite) {
            playlist = basePool;
        } else {
            playlist = basePool.slice(0, quantity);
        }
    }

    function updateDisplay() {
        if (!playlist[currentIndex]) return;
        const word = playlist[currentIndex];
        
        const currentDir = getDirection();
        const srText = (word.sr || word.sr_lat) || '—';
        const enText = word.en || '—';
        
        const promptText = (currentDir === 'en-sr') ? enText : srText;
        const answerText = (currentDir === 'en-sr') ? srText : enText;
        
        // Use slots purely for visual hierarchy: sr=top (big), en=bottom (small)
        const promptEl = el('commute-current-sr');
        const answerEl = el('commute-current-en');
        
        promptEl.innerText = promptText;
        answerEl.innerText = answerText;
        
        promptEl.classList.remove('opacity-30', 'text-green-400', 'text-red-400');
        answerEl.classList.remove('opacity-30', 'text-red-400');

        const counter = el('commute-counter');
        if (counter) {
            if (isInfinite) {
                counter.innerText = '∞ Infinity Mode (' + (currentIndex + 1) + ')';
            } else {
                counter.innerText = (currentIndex + 1) + ' / ' + playlist.length;
            }
        }
    }

    // ── Mode & Settings ──
    function setMode(mode) {
        sessionMode = mode;
        micEnabled = (mode === 'answer');

        const tabL = el('commute-tab-listen');
        const tabA = el('commute-tab-answer');
        
        if (mode === 'listen') {
            tabL.className = "flex-1 py-2 rounded-lg font-bold text-sm bg-blue-500 text-white shadow-sm transition-all";
            tabA.className = "flex-1 py-2 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition-all";
            listeningForAnswer = false;
            if (recognition) { try { recognition.stop(); } catch(e) {} }
        } else {
            tabA.className = "flex-1 py-2 rounded-lg font-bold text-sm bg-blue-500 text-white shadow-sm transition-all";
            tabL.className = "flex-1 py-2 rounded-lg font-bold text-sm text-slate-400 hover:text-white transition-all";
            if (isPlaying && initMic()) {
                try { recognition.start(); } catch(e) {}
            }
        }
    }

    function toggleInfinity() {
        isInfinite = !isInfinite;
        const btn = el('commute-infinity-btn');
        if (isInfinite) {
            btn.innerHTML = '<span class="text-lg leading-none">∞</span> ON';
            btn.classList.add('bg-purple-600', 'text-white', 'border-purple-500');
            btn.classList.remove('bg-slate-800', 'text-slate-400', 'border-slate-600');
            el('commute-quantity').disabled = true;
            el('commute-quantity').classList.add('opacity-50');
        } else {
            btn.innerHTML = '<span class="text-lg leading-none">∞</span> OFF';
            btn.classList.remove('bg-purple-600', 'text-white', 'border-purple-500');
            btn.classList.add('bg-slate-800', 'text-slate-400', 'border-slate-600');
            el('commute-quantity').disabled = false;
            el('commute-quantity').classList.remove('opacity-50');
        }
        applyQuantity();
        updateDisplay();
    }

    function updateSettings() {
        pauseTime = parseInt(el('commute-pause-time').value) || 3000;
        quantity = parseInt(el('commute-quantity').value) || 50;
        
        // Update live
        applyQuantity();
        updateDisplay();
    }

    // ── Play Controls ──
    function togglePlay() {
        if (playlist.length === 0) {
            loadPlaylist().then(() => { if (playlist.length > 0) startPlaying(); });
            return;
        }
        if (currentIndex >= playlist.length) {
            currentIndex = 0;
            updateDisplay();
            startPlaying();
            return;
        }
        isPlaying ? stopPlaying() : startPlaying();
    }

    function startPlaying() {
        isPlaying = true;
        loopActive = true;
        loopId++; // Generate new unique loop ID
        el('commute-play-icon').innerText = '⏸️';
        
        if (micEnabled && initMic()) {
            try { recognition.start(); } catch(e) {}
        }
        
        playLoop(loopId);
    }

    function stopPlaying() {
        isPlaying = false;
        loopActive = false;
        loopId++; // Kills any active loop immediately
        
        el('commute-play-icon').innerText = '▶️';
        el('commute-pulse').classList.remove('opacity-100');
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        window.speechSynthesis.cancel();
        
        listeningForAnswer = false;
        if (recognition) {
            try { recognition.stop(); } catch(e) {}
        }
    }

    // ── Main Pimsleur Loop ──
    async function playLoop(myId) {
        while (loopActive && playlist.length > 0 && myId === loopId) {
            const word = playlist[currentIndex];
            if (!word) break;
            
            const currentDir = getDirection();
            const srText = (word.sr || word.sr_lat) || '';
            const enText = word.en || '';
            
            // Determine prompt (what we show/speak first) and answer (what user must produce)
            const promptText = (currentDir === 'en-sr') ? enText : srText;
            const answerText = (currentDir === 'en-sr') ? srText : enText;
            const promptLang = (currentDir === 'en-sr') ? 'en-US' : 'sr-RS';
            const answerLang = (currentDir === 'en-sr') ? 'sr-RS' : 'en-US';
            
            // Re-use HTML slots purely for visual hierarchy (top/big vs bottom/small)
            const promptEl = el('commute-current-sr');
            const answerEl = el('commute-current-en');
            
            // Update display: Prompt always on top
            promptEl.innerText = promptText;
            promptEl.classList.remove('opacity-30', 'text-red-400');
            
            if (micEnabled) {
                answerEl.innerText = '???'; // Hide answer in Answer mode
                answerEl.classList.add('opacity-30');
            } else {
                answerEl.innerText = answerText;
                answerEl.classList.add('opacity-30');
            }
            
            // Update counter
            const counter = el('commute-counter');
            if (counter) {
                if (isInfinite) {
                    counter.innerText = '∞ Infinity Mode (' + (currentIndex + 1) + ')';
                } else {
                    counter.innerText = (currentIndex + 1) + ' / ' + playlist.length;
                }
            }

            // 1. Speak the PROMPT word
            listeningForAnswer = false; 
            await speakGTX(promptText, promptLang);
            
            if (!loopActive || myId !== loopId) break;

            // 2. Thinking pause (or mic listen)
            if (micEnabled) {
                answerEl.innerText = (currentDir === 'en-sr') ? '🎙️ Vaš red (Your turn)...' : '🎙️ Your turn...';
                answerEl.classList.remove('opacity-30');
                
                // Force start mic if it crashed
                if (!isMicRecording && initMic()) {
                     try { recognition.start(); } catch(e){}
                }
                
                currentExpectedAnswer = answerText;
                answerFound = false;
                listeningForAnswer = true;
                lastHeardTranscript = "";
                
                let elapsed = 0;
                while (elapsed < pauseTime) {
                    if (answerFound || !loopActive || myId !== loopId) break;
                    await wait(100);
                    elapsed += 100;
                }
                listeningForAnswer = false;
                
                if (!answerFound && loopActive && myId === loopId) {
                    if (window.app && window.app.playSound) window.app.playSound('incorrect');
                    
                    // Show the answer they missed in red in the answer slot
                    answerEl.innerText = answerText;
                    answerEl.classList.add('text-red-400');
                    promptEl.classList.add('text-red-400'); // Flash both red
                    
                    if (lastHeardTranscript && window.app && window.app.showToast) {
                        window.app.showToast('Mic heard: ' + lastHeardTranscript, 'info');
                    }
                    setTimeout(() => {
                        answerEl.classList.remove('text-red-400');
                        promptEl.classList.remove('text-red-400');
                    }, 1500);
                }
            } else {
                let elapsed = 0;
                while (elapsed < pauseTime) {
                    if (!loopActive || myId !== loopId) break;
                    await wait(100);
                    elapsed += 100;
                }
            }
            
            if (!loopActive || myId !== loopId) break;

            // 3. Reveal & Speak the ANSWER
            answerEl.innerText = answerText;
            answerEl.classList.remove('opacity-30', 'text-red-400');
            promptEl.classList.add('opacity-30');
            
            await speakGTX(answerText, answerLang);
            
            if (!loopActive || myId !== loopId) break;

            // 4. Brief gap
            await wait(1200);
            if (!loopActive || myId !== loopId) break;

            currentIndex++;

            // Handle end of list / infinity
            if (currentIndex >= playlist.length) {
                if (isInfinite) {
                    currentIndex = 0;
                    basePool.sort(() => 0.5 - Math.random()); // reshuffle base pool
                    applyQuantity(); // rebuild playlist
                } else {
                    stopPlaying();
                    currentIndex = 0;
                    promptEl.innerText = '🎉 Gotovo! (Finished)';
                    answerEl.innerText = 'Press Play to start again.';
                    break;
                }
            }
        }
    }

    function next() {
        if (nextPrevTimeout) clearTimeout(nextPrevTimeout);
        const wasPlaying = isPlaying;
        stopPlaying();
        
        currentIndex = (currentIndex + 1) % playlist.length;
        updateDisplay();
        
        if (wasPlaying) {
            nextPrevTimeout = setTimeout(() => { startPlaying(); }, 150);
        }
    }

    function prev() {
        if (nextPrevTimeout) clearTimeout(nextPrevTimeout);
        const wasPlaying = isPlaying;
        stopPlaying();
        
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        updateDisplay();
        
        if (wasPlaying) {
            nextPrevTimeout = setTimeout(() => { startPlaying(); }, 150);
        }
    }

    // Monitor tab visibility
    setTimeout(() => {
        const viewCommute = el('view-audio-commute');
        if (viewCommute) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        if (viewCommute.classList.contains('hidden') && isPlaying) {
                            stopPlaying();
                        }
                    }
                });
            });
            observer.observe(viewCommute, { attributes: true });
        }
    }, 1000);

    return {
        init: () => { 
            document.getElementById('commute-category').addEventListener('change', loadPlaylist);
            loadPlaylist(); 
        },
        togglePlay,
        next,
        prev,
        updateSettings,
        loadPlaylist,
        setMode,
        toggleInfinity
    };
})();
