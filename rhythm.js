// [SHIELD_DAEMON: VALIDATED]

// Global callback for YouTube API
function onYouTubeIframeAPIReady() {
    if (window.Rhythm) {
        window.Rhythm.onYTReady();
    }
}

window.Rhythm = (() => {
    'use strict';

    let currentTrack = null;
    let isPlaying = false;
    let recognition = null;
    let currentSentenceIndex = 0;
    let expectedWords = [];
    let currentWordIndex = 0; 
    let isMicActive = false;
    let ytPlayer = null;
    let ytReady = false;
    let currentTTSTarget = null;
    
    // Sample Music & Poetry Tracks
    const TRACKS = [
        {
            id: 'music_1',
            type: 'music',
            youtubeId: 'hTSg6S1h5V8', // Bajaga - Tišina (Topic)
            direction: 'en_to_sr',
            title_sr: 'Tišina',
            title_en: 'Silence (Pop/Rock)',
            level: 'B1',
            sentences: [
                { sr: 'Mrak se skupio u kap.', en: 'The dark has gathered into a drop.' },
                { sr: 'Rano jutro kao slap.', en: 'Early morning like a waterfall.' },
                { sr: 'Ulazi u sobu.', en: 'Enters the room.' },
                { sr: 'Dal si ikad pitala.', en: 'Did you ever ask.' },
                { sr: 'Tamne senke zidova.', en: 'The dark shadows of the walls.' },
                { sr: 'Ujutro gde odu.', en: 'Where they go in the morning.' }
            ]
        },
        {
            id: 'rap_1',
            type: 'music',
            youtubeId: 'CIDzkexjK2o', // Serbian Rap
            direction: 'en_to_sr',
            title_sr: 'Brate Minli',
            title_en: 'Brother Minli (Rap)',
            level: 'B2',
            sentences: [
                { sr: 'Znaš da letimo visoko.', en: 'You know we fly high.' },
                { sr: 'Uvek gledam te u oko.', en: 'I always look you in the eye.' },
                { sr: 'Nikad ne gledam u pod.', en: 'I never look at the floor.' },
                { sr: 'Zato imam dobar hod.', en: 'That is why I have a good walk.' },
                { sr: 'Svaki dan je nova borba.', en: 'Every day is a new struggle.' },
                { sr: 'Ovo nije prazna torba.', en: 'This is not an empty bag.' }
            ]
        },
        {
            id: 'poetry_1',
            type: 'poetry',
            youtubeId: null, // TTS will handle this
            direction: 'en_to_sr',
            title_sr: 'Krvava Bajka',
            title_en: 'A Bloody Fairy Tale (Poem)',
            level: 'C1',
            sentences: [
                { sr: 'Bilo je to u nekoj zemlji seljaka.', en: 'It happened in some land of peasants.' },
                { sr: 'Na brdovitom Balkanu.', en: 'In the mountainous Balkans.' },
                { sr: 'Umrla je mučeničkom smrću.', en: 'Died a martyr\'s death.' },
                { sr: 'Četa đaka.', en: 'A company of students.' },
                { sr: 'U jednom danu.', en: 'In a single day.' }
            ]
        }
    ];

    function initYTPlayer() {
        if (!ytReady || !window.YT) return;
        if (ytPlayer) {
            try { ytPlayer.destroy(); } catch(e) {}
            ytPlayer = null;
        }
        
        const container = document.getElementById('rhythm-video-container');
        container.innerHTML = '<div id="youtube-player" class="absolute inset-0 w-full h-full"></div>';
        
        ytPlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            videoId: currentTrack ? currentTrack.youtubeId : '',
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'rel': 0,
                'modestbranding': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    }

    function onPlayerReady(event) {
        // Player is ready
    }

    function onPlayerError(event) {
        // Error 150 & 153 = embedding disabled by video owner
        const container = document.getElementById('rhythm-video-container');
        if (container && currentTrack) {
            container.innerHTML = `
                <div class="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 rounded-2xl p-4 text-center">
                    <p class="text-white font-black text-lg mb-2">⚠️ Embedding blocked</p>
                    <p class="text-slate-400 text-xs mb-4">This video can't play inside the app.</p>
                    <a href="https://www.youtube.com/watch?v=${currentTrack.youtubeId}" target="_blank" rel="noopener" class="bg-red-500 text-white font-black px-6 py-3 rounded-xl active:scale-95 transition-transform shadow-lg">
                        ▶️ Watch on YouTube
                    </a>
                    <p class="text-slate-500 text-[10px] mt-3">Open the video, then come back here to sing along with the lyrics!</p>
                </div>
            `;
        }
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            // Video ended
            if (isPlaying) {
                togglePlay();
            }
        }
    }

    function initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('Speech Recognition not supported');
            return false;
        }
        
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = () => {
            isMicActive = true;
            updatePlayButton();
        };
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    processSpeech(event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (interimTranscript) {
                processSpeech(interimTranscript);
            }
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            isMicActive = false;
            if (event.error !== 'no-speech') {
                isPlaying = false;
                updatePlayButton();
                renderSentences();
            }
        };
        
        recognition.onend = () => {
            isMicActive = false;
            if (isPlaying) {
                try { recognition.start(); } catch(e){}
            } else {
                updatePlayButton();
            }
        };
        
        return true;
    }

    function cleanWord(word) {
        return word.toLowerCase().replace(/[.,!?]/g, '').trim();
    }

    function processSpeech(transcript) {
        if (!isPlaying || !currentTrack || expectedWords.length === 0) return;
        
        const spokenWords = transcript.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(w => w.length > 0);
        
        if (currentWordIndex < expectedWords.length) {
            const targetWord = expectedWords[currentWordIndex];
            const matched = spokenWords.some(sw => sw.includes(targetWord) || targetWord.includes(sw));
            
            if (matched) {
                currentWordIndex++;
                updateSentenceHighlighting();
                if (currentWordIndex >= expectedWords.length) {
                    sentenceComplete();
                }
            }
        }
    }

    function sentenceComplete() {
        if (app && app.playSound) app.playSound('correct');
        
        currentSentenceIndex++;
        if (currentSentenceIndex >= currentTrack.sentences.length) {
            if (app && app.playSound) setTimeout(() => app.playSound('level_up'), 500);
            isPlaying = false;
            if (recognition) recognition.stop();
            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
            renderSentences();
            updatePlayButton();
            if (app && app.showToast) app.showToast('Odlično! Track Completed!', 'success');
        } else {
            setupCurrentSentence();
            renderSentences();
            scrollToCurrent();
        }
    }

    function setupCurrentSentence() {
        if (!currentTrack || currentSentenceIndex >= currentTrack.sentences.length) return;
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const primaryText = isEnToSr ? currentTrack.sentences[currentSentenceIndex].sr : currentTrack.sentences[currentSentenceIndex].en;
        
        const words = primaryText.split(/\s+/);
        expectedWords = words.map(w => cleanWord(w)).filter(w => w.length > 0);
        currentWordIndex = 0;
        
        if (recognition) {
            recognition.lang = isEnToSr ? 'sr-RS' : 'en-US';
        }
    }

    function openMenu(type = 'music') {
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const availableTracks = TRACKS.filter(s => s.type === type);
        
        let html = `
            <div id="rhythm-menu-modal" class="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-[100] flex flex-col fade-in">
                <div class="p-4 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div>
                        <h2 class="text-xl font-black text-slate-800 dark:text-white">${type === 'poetry' ? '🎭 Speeches & Poetry' : '🎸 Music & Rhythm'}</h2>
                        <p class="text-xs text-slate-500 font-bold">${type === 'poetry' ? 'Recite epic monologues' : 'Sing along to tracks'}</p>
                    </div>
                    <button onclick="document.getElementById('rhythm-menu-modal').remove()" class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">❌</button>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
        `;
        
        availableTracks.forEach(s => {
            html += `
                <button onclick="document.getElementById('rhythm-menu-modal').remove(); Rhythm.open('${s.id}')" class="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md active:scale-95 transition-transform text-left flex items-center gap-4">
                    <div class="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center text-2xl shrink-0">${type === 'poetry' ? '📖' : '▶️'}</div>
                    <div>
                        <h3 class="font-black text-slate-800 dark:text-white">${isEnToSr ? s.title_sr : s.title_en}</h3>
                        <p class="text-xs font-bold text-slate-400">${isEnToSr ? s.title_en : s.title_sr}</p>
                    </div>
                    <div class="ml-auto text-xs font-black px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-md">${s.level}</div>
                </button>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    }

    function open(trackId) {
        if (!recognition && !initSpeechRecognition()) {
            if (app && app.showToast) app.showToast('Speech Recognition not supported in this browser.', 'error');
            return;
        }

        currentTrack = TRACKS.find(s => s.id === trackId);
        if (!currentTrack) return;
        
        currentSentenceIndex = 0;
        isPlaying = false;
        if (recognition) recognition.stop();
        
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        
        document.getElementById('rhythm-title').textContent = isEnToSr ? currentTrack.title_sr : currentTrack.title_en;
        document.getElementById('rhythm-desc').textContent = isEnToSr ? currentTrack.title_en : currentTrack.title_sr;
        
        const videoContainer = document.getElementById('rhythm-video-container');
        const ttsPlayBtn = document.getElementById('rhythm-play-tts-btn');

        if (currentTrack.youtubeId) {
            videoContainer.classList.remove('hidden');
            ttsPlayBtn.classList.add('hidden'); // Hide global TTS play button for YouTube songs
            initYTPlayer();
        } else {
            videoContainer.classList.add('hidden');
            ttsPlayBtn.classList.remove('hidden');
            if (ytPlayer) {
                ytPlayer.destroy();
                ytPlayer = null;
            }
        }

        setupCurrentSentence();
        renderSentences();
        updatePlayButton();
        
        if (app && app.navigate) {
            app.navigate('rhythm');
        }
    }

    function updateSentenceHighlighting() {
        const sentEl = document.getElementById('r-sent-' + currentSentenceIndex);
        if (!sentEl) return;
        
        const wordSpans = sentEl.querySelectorAll('.r-word');
        wordSpans.forEach((span, i) => {
            if (i < currentWordIndex) {
                span.classList.add('text-indigo-500', 'dark:text-indigo-400');
                span.classList.remove('text-slate-800', 'dark:text-white', 'text-slate-400');
            } else if (i === currentWordIndex) {
                span.classList.add('text-slate-800', 'dark:text-white', 'bg-yellow-100', 'dark:bg-yellow-900/40', 'px-1', 'rounded');
                span.classList.remove('text-indigo-500', 'dark:text-indigo-400', 'text-slate-400');
            } else {
                span.classList.add('text-slate-400', 'dark:text-slate-500');
                span.classList.remove('text-indigo-500', 'text-slate-800', 'dark:text-white', 'bg-yellow-100', 'px-1', 'rounded');
            }
        });
    }

    function renderSentences() {
        const container = document.getElementById('rhythm-text-container');
        if (!container || !currentTrack) return;
        
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const hasVideo = !!currentTrack.youtubeId;
        
        let html = '';
        currentTrack.sentences.forEach((sent, idx) => {
            const primary = isEnToSr ? sent.sr : sent.en;
            const secondary = isEnToSr ? sent.en : sent.sr;
            
            let wordsHtml = '';
            
            if (idx === currentSentenceIndex && isPlaying) {
                wordsHtml = primary.split(/\s+/).map((w, i) => {
                    const clean = w.replace(/[^a-zA-ZčćžšđČĆŽŠĐ]/g, '');
                    return `<span class="r-word inline-block transition-colors cursor-pointer hover:opacity-80" onclick="event.stopPropagation(); Rhythm.tapWord('${clean}')">${w}</span>`;
                }).join(' ');
            } else {
                wordsHtml = primary.split(/\s+/).map(w => {
                    const clean = w.replace(/[^a-zA-ZčćžšđČĆŽŠĐ]/g, '');
                    return `<span class="cursor-pointer hover:text-blue-500 transition-colors" onclick="event.stopPropagation(); Rhythm.tapWord('${clean}')">${w}</span>`;
                }).join(' ');
            }
            
            html += `<div id="r-sent-${idx}" class="relative p-4 rounded-2xl border-2 ${idx === currentSentenceIndex ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-md' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'} transition-all cursor-pointer" onclick="Rhythm.jumpTo(${idx})">
                <div class="text-xl font-black ${idx === currentSentenceIndex && isPlaying ? '' : 'text-slate-800 dark:text-white'} leading-relaxed pr-10">${wordsHtml}</div>
                <div class="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">${secondary}</div>
                ${!hasVideo ? `<button onclick="event.stopPropagation(); Rhythm.playSentenceTTS(${idx})" class="absolute top-4 right-4 w-8 h-8 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center hover:bg-purple-100 hover:text-purple-600 transition-colors" title="Listen to sentence">🔊</button>` : ''}
            </div>`;
        });
        
        container.innerHTML = html;
        if (isPlaying) updateSentenceHighlighting();
        scrollToCurrent();
    }

    function scrollToCurrent() {
        const el = document.getElementById('r-sent-' + currentSentenceIndex);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async function tapWord(wordRaw) {
        let word = wordRaw.toLowerCase().trim();
        if (!word) return;
        
        let results = [];
        if (window.appDb && window.appDb.searchWords) {
            results = await window.appDb.searchWords(word);
        }
        
        if (results.length === 0 && window.DICTIONARY) {
            results = window.DICTIONARY.filter(entry => 
                entry.en.toLowerCase() === word ||
                entry.sr_lat.toLowerCase() === word ||
                (entry.sr_cyr && entry.sr_cyr.toLowerCase() === word)
            );
        }

        if (results.length > 0) {
            showWordModal(results[0]);
        } else {
            if (app && app.showToast) app.showToast('No dictionary match found for: ' + wordRaw, 'error');
        }
    }

    function showWordModal(entry) {
        const existing = document.getElementById('rhythm-word-modal');
        if (existing) existing.remove();
        
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const primarySr = entry.sr_lat;
        const mainText = isEnToSr ? primarySr : entry.en;
        const subText1 = isEnToSr ? entry.en : primarySr;
        const subText2 = entry.sr_cyr && entry.sr_cyr !== primarySr ? entry.sr_cyr : '';

        const modalHtml = `
            <div id="rhythm-word-modal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm fade-in" onclick="this.remove()">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border-2 border-white dark:border-slate-700" onclick="event.stopPropagation()">
                    <div class="text-4xl mb-2">${entry.emoji || '📖'}</div>
                    <h3 class="text-xl font-black text-slate-800 dark:text-white">${mainText}</h3>
                    <button onclick="app.speakPhrase('${mainText.replace(/'/g, "\\'")}', '${isEnToSr ? 'sr-RS' : 'en-US'}')" class="w-10 h-10 mx-auto mt-2 mb-3 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center hover:bg-purple-200 transition-colors shadow-sm active:scale-95" title="Listen to word">🔊</button>
                    <p class="text-blue-500 font-bold mb-1">${subText1}</p>
                    ${subText2 ? `<p class="text-slate-400 dark:text-slate-500 font-bold text-[10px] mb-4">${subText2}</p>` : '<div class="mb-4"></div>'}
                    <div class="flex justify-center gap-2 mb-4">
                        <span class="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500">${entry.pos || 'reč'}</span>
                        ${entry.gender && entry.gender !== '-' ? `<span class="text-[10px] font-bold px-2 py-1 rounded-md bg-purple-100 text-purple-600">${entry.gender === 'm' ? 'muški' : entry.gender === 'z' ? 'ženski' : entry.gender === 's' ? 'srednji' : entry.gender}</span>` : ''}
                    </div>
                    <button onclick="app.toggleFlashcard('${entry.id}'); document.getElementById('rhythm-word-modal').remove()" class="w-full py-3 mb-2 rounded-xl font-black text-sm ${state && state.mistakeLog && state.mistakeLog[entry.id] ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-yellow-400 text-yellow-900 shadow-md'} active:scale-95 transition-transform flex justify-center items-center gap-2">
                        ⭐ ${state && state.mistakeLog && state.mistakeLog[entry.id] ? 'In Flashcards' : 'Add to Flashcards'}
                    </button>
                    <button onclick="document.getElementById('rhythm-word-modal').remove()" class="w-full py-3 rounded-xl font-black text-sm bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        if (app && app.speakPhrase) {
            app.speakPhrase(mainText, isEnToSr ? 'sr-RS' : 'en-US');
        }
    }

    function jumpTo(idx) {
        currentSentenceIndex = idx;
        setupCurrentSentence();
        renderSentences();
    }

    function togglePlay() {
        if (window.location.protocol === 'file:') {
            if (app && app.showToast) app.showToast('Microphone blocked on file:///!', 'error');
            alert("⚠️ SECURITY BLOCK ⚠️\n\nChrome blocks microphone access for local files (file:///).\n\nTo use Voice features, you must run the app through a local server.\n\nI have generated a 'start.bat' file in your folder. Please double-click it to start the app securely!");
            return;
        }

        if (!recognition && !initSpeechRecognition()) {
            if (app && app.showToast) app.showToast('Browser does not support Speech Recognition', 'error');
            return;
        }
        
        if (isPlaying) {
            recognition.stop();
            isPlaying = false;
            if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
        } else {
            isPlaying = true;
            if (currentSentenceIndex >= currentTrack.sentences.length) {
                currentSentenceIndex = 0;
                setupCurrentSentence();
            } else if (expectedWords.length === 0) {
                setupCurrentSentence();
            }
            try {
                recognition.start();
            } catch(e) {}
            
            if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
                ytPlayer.playVideo();
            }
        }
        renderSentences();
        updatePlayButton();
    }

    function playSentenceTTS(idx) {
        if (!currentTrack || !currentTrack.sentences[idx] || currentTrack.youtubeId) return;
        
        const targetId = 'rhythm_sent_' + idx;
        if (app && app.isSpeaking && app.isSpeaking() && currentTTSTarget === targetId) {
            if (app.stopSpeech) app.stopSpeech();
            currentTTSTarget = null;
            return;
        }

        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const text = isEnToSr ? currentTrack.sentences[idx].sr : currentTrack.sentences[idx].en;
        const lang = isEnToSr ? 'sr-RS' : 'en-US';
        
        if (app && app.speakPhrase) {
            currentTTSTarget = targetId;
            app.speakPhrase(text, lang);
        }
    }

    function playFullTextTTS() {
        if (!currentTrack || currentTrack.youtubeId) return;
        
        const targetId = 'rhythm_full';
        if (app && app.isSpeaking && app.isSpeaking() && currentTTSTarget === targetId) {
            if (app.stopSpeech) app.stopSpeech();
            currentTTSTarget = null;
            return;
        }

        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const lang = isEnToSr ? 'sr-RS' : 'en-US';
        const text = currentTrack.sentences.map(s => isEnToSr ? s.sr : s.en).join(' ');
        
        if (app && app.speakPhrase) {
            currentTTSTarget = targetId;
            app.speakPhrase(text, lang);
        }
    }

    function reset() {
        if (recognition) recognition.stop();
        if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
        if (app && app.stopSpeech) app.stopSpeech();
        currentSentenceIndex = 0;
        isPlaying = false;
        setupCurrentSentence();
        renderSentences();
        updatePlayButton();
    }

    function updatePlayButton() {
        const btn = document.getElementById('rhythm-play-btn');
        if (btn) {
            btn.innerHTML = isPlaying ? (isMicActive ? '🎙️ LISTENING...' : '🎙️ STARTING...') : '🎙️ START SINGING';
            if (isPlaying) {
                btn.className = 'w-48 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-red-500/30 active:scale-95 transition-all animate-pulse';
            } else {
                btn.className = 'w-48 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-red-500/30 active:scale-95 transition-all';
            }
        }
    }

    return {
        onYTReady: () => { ytReady = true; },
        openMenu: openMenu,
        open: open,
        togglePlay: togglePlay,
        reset: reset,
        tapWord: tapWord,
        jumpTo: jumpTo,
        playSentenceTTS: playSentenceTTS,
        playFullTextTTS: playFullTextTTS,
        TRACKS: TRACKS
    };
})();
