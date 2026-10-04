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

    let micEnabled = false;
    let isMicRecording = false;
    let recognition = null;
    let currentExpectedAnswer = null;
    let listeningForAnswer = false;
    let answerFound = false;
    let currentAudio = null;

    const el = (id) => document.getElementById(id);

    // ── Persistent Speech Recognition ──
    function initMic() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            if (window.app) window.app.showToast('Speech Recognition not supported in this browser.', 'error');
            return false;
        }

        if (!recognition) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRec();
            recognition.lang = 'sr-RS';
            recognition.continuous = true;
            recognition.interimResults = false;
            
            recognition.onstart = () => { isMicRecording = true; };

            recognition.onresult = (e) => {
                if (!listeningForAnswer || !currentExpectedAnswer) return;
                
                const results = [];
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    results.push(e.results[i][0].transcript.toLowerCase().trim());
                }
                
                const expected = currentExpectedAnswer.toLowerCase().trim();
                const correct = results.some(r => r === expected || r.includes(expected) || expected.includes(r));

                if (correct) {
                    answerFound = true;
                    if (window.app && window.app.playSound) window.app.playSound('correct');
                    const srEl = el('commute-current-sr');
                    srEl.classList.add('text-green-400');
                    setTimeout(() => srEl.classList.remove('text-green-400'), 1500);
                } else {
                    // Help user debug what was heard
                    if (window.app && window.app.showToast) window.app.showToast('Mic heard: ' + results[0], 'info');
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
            const url = 'https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=' + gtLang + '&q=' + encodeURIComponent(text); 
            const audio = new Audio(url);
            currentAudio = audio;
            audio.volume = 1;

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
            const mistakes = (window.state && window.state.mistakeLog) || {};
            basePool = allWords.filter(w => mistakes[w.id]);
        } else if (cat === 'favorites') {
            const favs = (window.state && window.state.favorites) || {};
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
        
        el('commute-current-sr').innerText = (word.sr || word.sr_lat) || '—';
        el('commute-current-en').innerText = word.en || '—';
        
        el('commute-current-sr').classList.remove('opacity-30', 'text-green-400', 'text-red-400');
        el('commute-current-en').classList.remove('opacity-30');

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
            
            updateDisplay();

            // 1. Speak English
            listeningForAnswer = false; 
            el('commute-current-sr').classList.add('opacity-30');
            el('commute-current-en').classList.remove('opacity-30');
            await speakGTX(word.en, 'en-US');
            
            if (!loopActive || myId !== loopId) break;

            // 2. Thinking pause (or mic listen)
            if (micEnabled) {
                el('commute-current-sr').innerText = '🎙️ Vaš red (Your turn)...';
                
                // Force start mic if it crashed
                if (!isMicRecording && initMic()) {
                     try { recognition.start(); } catch(e){}
                }
                
                currentExpectedAnswer = (word.sr || word.sr_lat);
                answerFound = false;
                listeningForAnswer = true;
                
                let elapsed = 0;
                while (elapsed < pauseTime) {
                    if (answerFound || !loopActive || myId !== loopId) break;
                    await wait(100);
                    elapsed += 100;
                }
                listeningForAnswer = false;
                
                if (!answerFound && loopActive && myId === loopId) {
                    if (window.app && window.app.playSound) window.app.playSound('incorrect');
                    const srEl = el('commute-current-sr');
                    srEl.classList.add('text-red-400');
                    setTimeout(() => srEl.classList.remove('text-red-400'), 1500);
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

            // 3. Reveal & Speak Serbian answer
            el('commute-current-sr').innerText = (word.sr || word.sr_lat);
            el('commute-current-sr').classList.remove('opacity-30');
            el('commute-current-en').classList.add('opacity-30');
            await speakGTX((word.sr || word.sr_lat), 'sr-RS');
            
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
                    el('commute-current-sr').innerText = '🎉 Gotovo! (Finished)';
                    el('commute-current-en').innerText = 'Press Play to start again.';
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
