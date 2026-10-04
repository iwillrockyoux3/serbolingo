// [SHIELD_DAEMON: VALIDATED]
// Priority 17: Hands-Free / Commute Audio Mode (Pimsleur-Style)
// Uses Google Translate TTS (GTX) for reliable audio.
// Persistent Mic session to avoid permission spam.

window.CommuteEngine = (function() {
    let playlist = [];
    let currentIndex = 0;
    let isPlaying = false;
    let pauseTime = 3000;
    let loopActive = false;
    
    // Voice Recognition state
    let micEnabled = false;
    let recognition = null;
    let currentExpectedAnswer = null;
    let listeningForAnswer = false; // flag to process or ignore mic data
    let answerFound = false;

    const el = (id) => document.getElementById(id);

    // ── Persistent Speech Recognition ──
    function initMic() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert('Speech Recognition not supported in this browser.');
            return false;
        }

        if (!recognition) {
            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRec();
            recognition.lang = 'sr-RS';
            recognition.continuous = true; // Keep alive to avoid permission spam
            recognition.interimResults = false;
            
            recognition.onresult = (e) => {
                if (!listeningForAnswer || !currentExpectedAnswer) return; // Ignore if TTS is speaking
                
                const results = [];
                for (let i = e.resultIndex; i < e.results.length; i++) {
                    results.push(e.results[i][0].transcript.toLowerCase().trim());
                }
                
                const expected = currentExpectedAnswer.toLowerCase().trim();
                const correct = results.some(r => r === expected || r.includes(expected) || expected.includes(r));

                if (correct) {
                    answerFound = true; // Tell the loop we got it!
                    const srEl = el('commute-current-sr');
                    srEl.classList.add('text-green-400');
                    setTimeout(() => srEl.classList.remove('text-green-400'), 1500);
                }
            };

            // Auto-restart if it dies while mic is supposed to be enabled
            recognition.onend = () => {
                if (micEnabled && isPlaying) {
                    try { recognition.start(); } catch(err) {}
                }
            };
            
            recognition.onerror = (e) => {
                console.log('Commute mic error:', e.error);
            };
        }
        return true;
    }

    // ── Reliable TTS via Google Translate Audio ──
    function speakGTX(text, lang) {
        return new Promise(resolve => {
            const gtLang = lang.startsWith('sr') ? 'sr' : 'en';
            const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${gtLang}&q=${encodeURIComponent(text)}`;
            const audio = new Audio(url);
            audio.volume = 1;

            audio.onended = () => resolve();
            audio.onerror = () => {
                console.warn('GTX TTS failed, trying native for:', text);
                speakNative(text, lang).then(resolve);
            };

            const pulse = el('commute-pulse');
            if (pulse) pulse.classList.add('opacity-100');
            audio.onended = () => { if (pulse) pulse.classList.remove('opacity-100'); resolve(); };

            audio.play().catch(() => speakNative(text, lang).then(resolve));
            setTimeout(resolve, 6000);
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

        playlist = [];

        if (cat === 'mistakes') {
            const mistakes = (window.state && window.state.mistakeLog) || {};
            playlist = allWords.filter(w => mistakes[w.id]);
        } else if (cat === 'favorites') {
            const favs = (window.state && window.state.favorites) || {};
            playlist = allWords.filter(w => favs[w.id]);
        } else if (cat === 'phrases') {
            playlist = allWords.filter(w => w.category === 'phrases' || ((w.sr || w.sr_lat) && (w.sr || w.sr_lat).includes(' ')));
        }

        if (playlist.length === 0) {
            playlist = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 50);
        }

        currentIndex = 0;
        updateDisplay();
    }

    function updateDisplay() {
        if (!playlist[currentIndex]) return;
        const word = playlist[currentIndex];
        el('commute-current-sr').innerText = (word.sr || word.sr_lat) || '—';
        el('commute-current-en').innerText = word.en || '—';
        el('commute-current-sr').classList.remove('opacity-30', 'text-green-400', 'text-red-400');
        el('commute-current-en').classList.remove('opacity-30');

        const counter = el('commute-counter');
        if (counter) counter.innerText = (currentIndex + 1) + " / " + playlist.length;
    }

    // ── Play Controls ──
    function togglePlay() {
        if (playlist.length === 0) {
            loadPlaylist().then(() => { if (playlist.length > 0) startPlaying(); });
            return;
        }
        isPlaying ? stopPlaying() : startPlaying();
    }

    function startPlaying() {
        isPlaying = true;
        loopActive = true;
        el('commute-play-icon').innerText = '⏸️';
        
        // Start persistent mic if enabled
        if (micEnabled && initMic()) {
            try { recognition.start(); } catch(e) {}
        }
        
        playLoop();
    }

    function stopPlaying() {
        isPlaying = false;
        loopActive = false;
        el('commute-play-icon').innerText = '▶️';
        el('commute-pulse').classList.remove('opacity-100');
        window.speechSynthesis.cancel();
        
        listeningForAnswer = false;
        if (recognition) {
            try { recognition.stop(); } catch(e) {}
        }
    }

    // ── Main Pimsleur Loop ──
    async function playLoop() {
        while (loopActive && playlist.length > 0) {
            const word = playlist[currentIndex];
            updateDisplay();

            // 1. Speak English
            listeningForAnswer = false; // Ignore mic while TTS speaks
            el('commute-current-sr').classList.add('opacity-30');
            el('commute-current-en').classList.remove('opacity-30');
            await speakGTX(word.en, 'en-US');
            if (!loopActive) break;

            // 2. Thinking pause (or mic listen)
            if (micEnabled) {
                el('commute-current-sr').innerText = '🎙️ Your turn...';
                
                // Unmute the processing logic
                currentExpectedAnswer = (word.sr || word.sr_lat);
                answerFound = false;
                listeningForAnswer = true;
                
                // Wait for answer OR timeout
                let elapsed = 0;
                while (elapsed < pauseTime) {
                    if (answerFound || !loopActive) break;
                    await wait(200);
                    elapsed += 200;
                }
                listeningForAnswer = false; // Mute mic processing again
                
                if (!answerFound && loopActive) {
                    const srEl = el('commute-current-sr');
                    srEl.classList.add('text-red-400');
                    setTimeout(() => srEl.classList.remove('text-red-400'), 1500);
                }
            } else {
                await wait(pauseTime);
            }
            
            if (!loopActive) break;

            // 3. Reveal & Speak Serbian answer
            el('commute-current-sr').innerText = (word.sr || word.sr_lat);
            el('commute-current-sr').classList.remove('opacity-30');
            el('commute-current-en').classList.add('opacity-30');
            await speakGTX((word.sr || word.sr_lat), 'sr-RS');
            if (!loopActive) break;

            // 4. Brief gap
            await wait(1200);
            if (!loopActive) break;

            currentIndex = (currentIndex + 1) % playlist.length;
        }
    }

    function next() {
        currentIndex = (currentIndex + 1) % playlist.length;
        updateDisplay();
        if (isPlaying) {
            loopActive = false;
            window.speechSynthesis.cancel();
            setTimeout(() => { loopActive = true; playLoop(); }, 150);
        }
    }

    function prev() {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        updateDisplay();
        if (isPlaying) {
            loopActive = false;
            window.speechSynthesis.cancel();
            setTimeout(() => { loopActive = true; playLoop(); }, 150);
        }
    }

    function updateSettings() {
        pauseTime = parseInt(el('commute-pause-time').value) || 3000;
    }

    function toggleMic() {
        micEnabled = !micEnabled;
        const btn = el('commute-mic-btn');
        if (btn) {
            btn.classList.toggle('bg-green-600', micEnabled);
            btn.classList.toggle('bg-slate-800', !micEnabled);
            btn.innerText = micEnabled ? '🎙️ Mic ON' : '🎙️ Mic OFF';
        }
        
        // If we are actively playing, start or stop the mic immediately
        if (isPlaying) {
            if (micEnabled) {
                if (initMic()) try { recognition.start(); } catch(e) {}
            } else {
                listeningForAnswer = false;
                if (recognition) try { recognition.stop(); } catch(e) {}
            }
        }
    }

    return {
        init: () => { loadPlaylist(); },
        togglePlay,
        next,
        prev,
        updateSettings,
        loadPlaylist,
        toggleMic
    };
})();
