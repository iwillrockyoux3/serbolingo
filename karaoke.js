// [SHIELD_DAEMON: VALIDATED]
window.Karaoke = (() => {
    'use strict';

    let currentStory = null;
    let isPlaying = false;
    let recognition = null;
    let currentSentenceIndex = 0;
    let expectedWords = [];
    let currentWordIndex = 0; // index of the word we are currently waiting for the user to say
    let isMicActive = false;
    
    // Expanded Sample Stories
    const STORIES = [
        {
            id: 'story_1',
            direction: 'en_to_sr',
            title_sr: 'Tri Praseta',
            title_en: 'The Three Little Pigs',
            level: 'A1',
            sentences: [
                { sr: 'Bila su jednom tri praseta.', en: 'Once upon a time there were three little pigs.' },
                { sr: 'Prvo prase je napravilo kuću od slame.', en: 'The first pig built a house of straw.' },
                { sr: 'Drugo prase je napravilo kuću od drveta.', en: 'The second pig built a house of wood.' },
                { sr: 'Treće prase je bilo pametno i napravilo kuću od cigle.', en: 'The third pig was smart and built a house of bricks.' },
                { sr: 'Zli vuk je došao i oduvao prve dve kuće.', en: 'The big bad wolf came and blew down the first two houses.' },
                { sr: 'Ali nije mogao da oduva kuću od cigle.', en: 'But he could not blow down the brick house.' },
                { sr: 'Tri praseta su živela srećno do kraja života.', en: 'The three little pigs lived happily ever after.' }
            ]
        },
        {
            id: 'story_2',
            direction: 'en_to_sr',
            title_sr: 'U Restoranu',
            title_en: 'At the Restaurant',
            level: 'A2',
            sentences: [
                { sr: 'Dobar dan, imate li slobodan sto za dvoje?', en: 'Good afternoon, do you have a free table for two?' },
                { sr: 'Da, izvolite, ovde pored prozora.', en: 'Yes, here you go, by the window.' },
                { sr: 'Šta želite da popijete?', en: 'What would you like to drink?' },
                { sr: 'Ja ću jedno pivo, a ona će čašu vina.', en: 'I will have a beer, and she will have a glass of wine.' },
                { sr: 'Za jelo želimo ćevape i šopsku salatu.', en: 'For food we want cevapi and shopska salad.' },
                { sr: 'Hrana je veoma ukusna!', en: 'The food is very delicious!' },
                { sr: 'Možemo li dobiti račun, molim vas?', en: 'Can we get the bill, please?' }
            ]
        },
        {
            id: 'story_3',
            direction: 'en_to_sr',
            title_sr: 'Na Pijaci',
            title_en: 'At the Market',
            level: 'A1',
            sentences: [
                { sr: 'Volim da idem na pijacu subotom.', en: 'I like going to the market on Saturdays.' },
                { sr: 'Tamo kupujem sveže voće i povrće.', en: 'There I buy fresh fruit and vegetables.' },
                { sr: 'Koliko košta jedan kilogram jabuka?', en: 'How much is one kilogram of apples?' },
                { sr: 'Jabuke su sto dinara.', en: 'Apples are one hundred dinars.' },
                { sr: 'Daćete mi dva kilograma.', en: 'You will give me two kilograms.' },
                { sr: 'Hvala lepo i doviđenja.', en: 'Thank you very much and goodbye.' }
            ]
        },
        {
            id: 'story_4',
            direction: 'sr_to_en',
            title_sr: 'Upoznajte mog Psa',
            title_en: 'Meet my Dog',
            level: 'A1',
            sentences: [
                { sr: 'Ovo je moj pas. Zove se Maks.', en: 'This is my dog. His name is Max.' },
                { sr: 'On je veoma dobar i pametan pas.', en: 'He is a very good and smart dog.' },
                { sr: 'Maks voli da trči po parku.', en: 'Max likes to run in the park.' },
                { sr: 'Svaki dan idemo u šetnju.', en: 'Every day we go for a walk.' },
                { sr: 'Kada je gladan, on laje.', en: 'When he is hungry, he barks.' },
                { sr: 'Ja mnogo volim mog psa.', en: 'I love my dog very much.' }
            ]
        },
        {
            id: 'story_6',
            direction: 'en_to_sr',
            title_sr: 'Moj Vikend',
            title_en: 'My Weekend',
            level: 'A1',
            sentences: [
                { sr: 'Vikendom obicno spavam dugo.', en: 'On weekends I usually sleep long.' },
                { sr: 'Posle podne pijem kafu sa prijateljima.', en: 'In the afternoon I drink coffee with friends.' },
                { sr: 'Ponekad idemo u bioskop.', en: 'Sometimes we go to the cinema.' },
                { sr: 'Uvece gledam filmove kod kuce.', en: 'In the evening I watch movies at home.' },
                { sr: 'Volim vikend jer ne radim.', en: 'I like the weekend because I do not work.' }
            ]
        },
        {
            id: 'story_7',
            direction: 'en_to_sr',
            title_sr: 'Putovanje Vozom',
            title_en: 'Train Journey',
            level: 'A2',
            sentences: [
                { sr: 'Kupio sam kartu za voz do Novog Sada.', en: 'I bought a train ticket to Novi Sad.' },
                { sr: 'Voz krece u osam sati ujutru.', en: 'The train departs at eight in the morning.' },
                { sr: 'Putovanje traje oko sat vremena.', en: 'The journey takes about an hour.' },
                { sr: 'Kroz prozor gledam lepu prirodu.', en: 'Through the window I look at beautiful nature.' },
                { sr: 'Kondukter proverava karte.', en: 'The conductor is checking the tickets.' }
            ]
        },
        {
            id: 'story_8',
            direction: 'sr_to_en',
            title_sr: 'Ucenje Engleskog',
            title_en: 'Learning English',
            level: 'A1',
            sentences: [
                { sr: 'Ja ucim engleski jezik svaki dan.', en: 'I study English every day.' },
                { sr: 'Engleski nije mnogo tezak.', en: 'English is not very difficult.' },
                { sr: 'Slusam muziku i gledam filmove.', en: 'I listen to music and watch movies.' },
                { sr: 'Tako ucim nove reci lako.', en: 'That way I learn new words easily.' },
                { sr: 'Moj ucitelj je jako dobar.', en: 'My teacher is very good.' }
            ]
        },
        {
            id: 'story_9',
            direction: 'sr_to_en',
            title_sr: 'Novi Telefon',
            title_en: 'New Phone',
            level: 'A2',
            sentences: [
                { sr: 'Juce sam kupio novi mobilni telefon.', en: 'Yesterday I bought a new mobile phone.' },
                { sr: 'Ima veliku memoriju i dobru kameru.', en: 'It has a large memory and a good camera.' },
                { sr: 'Odmah sam skinuo omiljene aplikacije.', en: 'I immediately downloaded my favorite apps.' },
                { sr: 'Sada mogu da pravim odlicne fotografije.', en: 'Now I can take excellent photos.' },
                { sr: 'Telefon je bio skup, ali vredi.', en: 'The phone was expensive, but it is worth it.' }
            ]
        },
        {
            id: 'story_5',
            direction: 'sr_to_en',
            title_sr: 'Moj Posao',
            title_en: 'My Job',
            level: 'A2',
            sentences: [
                { sr: 'Ja sam programer.', en: 'I am a programmer.' },
                { sr: 'Radim u jednoj velikoj kompaniji.', en: 'I work in a large company.' },
                { sr: 'Moj posao je zanimljiv, ali nekad i težak.', en: 'My job is interesting, but sometimes also hard.' },
                { sr: 'Svaki dan pišem kod na kompjuteru.', en: 'Every day I write code on the computer.' },
                { sr: 'Imam mnogo kolega iz različitih zemalja.', en: 'I have many colleagues from different countries.' },
                { sr: 'Mi pričamo na engleskom jeziku.', en: 'We speak in English.' }
            ]
        }
    ];

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
            // dont turn off if it's just no speech
            if (event.error !== 'no-speech') {
                isPlaying = false;
                updatePlayButton();
                renderSentences();
            }
        };
        
        recognition.onend = () => {
            isMicActive = false;
            // Auto restart if it was supposed to be playing
            if (isPlaying) {
                try { recognition.start(); } catch(e){}
            } else {
                updatePlayButton();
            }
        };
        
        return true;
    }

    // Clean word for comparison (remove punctuation, lower case, normalize)
    function cleanWord(word) {
        return word.toLowerCase().replace(/[.,!?]/g, '').trim();
    }

    function processSpeech(transcript) {
        if (!isPlaying || !currentStory || expectedWords.length === 0) return;
        
        // Convert to array of words
        const spokenWords = transcript.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(w => w.length > 0);
        
        // We just check if the current expected word exists anywhere in the recent spoken transcript
        // This is fuzzy and tolerant of bad ordering or extra filler words
        if (currentWordIndex < expectedWords.length) {
            const targetWord = expectedWords[currentWordIndex];
            
            // Allow matching if spoken word contains target or target contains spoken (to handle morphology/accents)
            const matched = spokenWords.some(sw => sw.includes(targetWord) || targetWord.includes(sw));
            
            if (matched) {
                currentWordIndex++;
                updateSentenceHighlighting();
                
                // If sentence is complete!
                if (currentWordIndex >= expectedWords.length) {
                    sentenceComplete();
                }
            }
        }
    }

    function sentenceComplete() {
        if (app && app.playSound) app.playSound('correct');
        
        currentSentenceIndex++;
        if (currentSentenceIndex >= currentStory.sentences.length) {
            // Story complete
            if (app && app.playSound) setTimeout(() => app.playSound('level_up'), 500);
            isPlaying = false;
            if (recognition) recognition.stop();
            renderSentences();
            updatePlayButton();
            if (app && app.showToast) app.showToast('Odlično! Story Completed!', 'success');
        } else {
            // Next sentence
            setupCurrentSentence();
            renderSentences();
            scrollToCurrent();
        }
    }

    function setupCurrentSentence() {
        if (!currentStory || currentSentenceIndex >= currentStory.sentences.length) return;
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const primaryText = isEnToSr ? currentStory.sentences[currentSentenceIndex].sr : currentStory.sentences[currentSentenceIndex].en;
        
        const words = primaryText.split(/\s+/);
        expectedWords = words.map(w => cleanWord(w)).filter(w => w.length > 0);
        currentWordIndex = 0;
        
        if (recognition) {
            recognition.lang = isEnToSr ? 'sr-RS' : 'en-US';
        }
    }

    function openMenu() {
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const availableStories = STORIES.filter(s => s.direction === (isEnToSr ? 'en_to_sr' : 'sr_to_en'));
        
        let html = `
            <div id="karaoke-menu-modal" class="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-[100] flex flex-col fade-in">
                <div class="p-4 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div>
                        <h2 class="text-xl font-black text-slate-800 dark:text-white">🎤 Karaoke Reader</h2>
                        <p class="text-xs text-slate-500 font-bold">Read aloud & practice pronunciation</p>
                    </div>
                    <button onclick="document.getElementById('karaoke-menu-modal').remove()" class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">❌</button>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-3">
        `;
        
        availableStories.forEach(s => {
            html += `
                <button onclick="document.getElementById('karaoke-menu-modal').remove(); Karaoke.open('${s.id}')" class="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-md active:scale-95 transition-transform text-left flex items-center gap-4">
                    <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-2xl shrink-0">📖</div>
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

    function open(storyId) {
        if (!recognition && !initSpeechRecognition()) {
            if (app && app.showToast) app.showToast('Speech Recognition not supported in this browser.', 'error');
            return;
        }

        currentStory = STORIES.find(s => s.id === storyId);
        if (!currentStory) return;
        
        currentSentenceIndex = 0;
        isPlaying = false;
        if (recognition) recognition.stop();
        
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        
        document.getElementById('karaoke-title').textContent = isEnToSr ? currentStory.title_sr : currentStory.title_en;
        document.getElementById('karaoke-desc').textContent = isEnToSr ? currentStory.title_en : currentStory.title_sr;
        
        setupCurrentSentence();
        renderSentences();
        updatePlayButton();
        
        if (app && app.navigate) {
            app.navigate('karaoke');
        }
    }

    function updateSentenceHighlighting() {
        const sentEl = document.getElementById('k-sent-' + currentSentenceIndex);
        if (!sentEl) return;
        
        const wordSpans = sentEl.querySelectorAll('.k-word');
        wordSpans.forEach((span, i) => {
            if (i < currentWordIndex) {
                span.classList.add('text-emerald-500', 'dark:text-emerald-400');
                span.classList.remove('text-slate-800', 'dark:text-white', 'text-slate-400');
            } else if (i === currentWordIndex) {
                span.classList.add('text-slate-800', 'dark:text-white', 'bg-yellow-100', 'dark:bg-yellow-900/40', 'px-1', 'rounded');
                span.classList.remove('text-emerald-500', 'dark:text-emerald-400', 'text-slate-400');
            } else {
                span.classList.add('text-slate-400', 'dark:text-slate-500');
                span.classList.remove('text-emerald-500', 'text-slate-800', 'dark:text-white', 'bg-yellow-100', 'px-1', 'rounded');
            }
        });
    }

    function renderSentences() {
        const container = document.getElementById('karaoke-text-container');
        if (!container) return;
        
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        
        let html = '';
        currentStory.sentences.forEach((sent, idx) => {
            const primary = isEnToSr ? sent.sr : sent.en;
            const secondary = isEnToSr ? sent.en : sent.sr;
            
            let wordsHtml = '';
            
            if (idx === currentSentenceIndex && isPlaying) {
                // Active sentence - styled word by word
                wordsHtml = primary.split(/\s+/).map((w, i) => {
                    const clean = w.replace(/[^a-zA-ZčćžšđČĆŽŠĐ]/g, '');
                    return `<span class="k-word inline-block transition-colors cursor-pointer hover:opacity-80" onclick="event.stopPropagation(); Karaoke.tapWord('${clean}')">${w}</span>`;
                }).join(' ');
            } else {
                // Inactive sentence
                wordsHtml = primary.split(/\s+/).map(w => {
                    const clean = w.replace(/[^a-zA-ZčćžšđČĆŽŠĐ]/g, '');
                    return `<span class="cursor-pointer hover:text-blue-500 transition-colors" onclick="event.stopPropagation(); Karaoke.tapWord('${clean}')">${w}</span>`;
                }).join(' ');
            }
            
            html += `<div id="k-sent-${idx}" class="p-4 rounded-2xl border-2 ${idx === currentSentenceIndex ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 shadow-md' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'} transition-all cursor-pointer" onclick="Karaoke.jumpTo(${idx})">
                <div class="text-xl font-black ${idx === currentSentenceIndex && isPlaying ? '' : 'text-slate-800 dark:text-white'} leading-relaxed">${wordsHtml}</div>
                <div class="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">${secondary}</div>
            </div>`;
        });
        
        container.innerHTML = html;
        if (isPlaying) updateSentenceHighlighting();
        scrollToCurrent();
    }

    function scrollToCurrent() {
        const el = document.getElementById('k-sent-' + currentSentenceIndex);
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
        const existing = document.getElementById('karaoke-word-modal');
        if (existing) existing.remove();
        
        const isEnToSr = state && state.settings && state.settings.learningDirection === 'en_to_sr';
        const primarySr = entry.sr_lat;
        const mainText = isEnToSr ? primarySr : entry.en;
        const subText1 = isEnToSr ? entry.en : primarySr;
        const subText2 = entry.sr_cyr && entry.sr_cyr !== primarySr ? entry.sr_cyr : '';

        const modalHtml = `
            <div id="karaoke-word-modal" class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm fade-in" onclick="this.remove()">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border-2 border-white dark:border-slate-700" onclick="event.stopPropagation()">
                    <div class="text-4xl mb-2">${entry.emoji || '📖'}</div>
                    <h3 class="text-xl font-black text-slate-800 dark:text-white">${mainText}</h3>
                    <p class="text-blue-500 font-bold mb-1">${subText1}</p>
                    ${subText2 ? `<p class="text-slate-400 dark:text-slate-500 font-bold text-[10px] mb-4">${subText2}</p>` : '<div class="mb-4"></div>'}
                    <div class="flex justify-center gap-2 mb-4">
                        <span class="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500">${entry.pos || 'reč'}</span>
                        ${entry.gender && entry.gender !== '-' ? `<span class="text-[10px] font-bold px-2 py-1 rounded-md bg-purple-100 text-purple-600">${entry.gender === 'm' ? 'muški' : entry.gender === 'z' ? 'ženski' : entry.gender === 's' ? 'srednji' : entry.gender}</span>` : ''}
                    </div>
                    <button onclick="app.toggleFlashcard('${entry.id}'); document.getElementById('karaoke-word-modal').remove()" class="w-full py-3 mb-2 rounded-xl font-black text-sm ${state && state.mistakeLog && state.mistakeLog[entry.id] ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-yellow-400 text-yellow-900 shadow-md'} active:scale-95 transition-transform flex justify-center items-center gap-2">
                        ⭐ ${state && state.mistakeLog && state.mistakeLog[entry.id] ? 'In Flashcards' : 'Add to Flashcards'}
                    </button>
                    <button onclick="document.getElementById('karaoke-word-modal').remove()" class="w-full py-3 rounded-xl font-black text-sm bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform">
                        Close
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
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
        } else {
            isPlaying = true;
            if (currentSentenceIndex >= currentStory.sentences.length) {
                currentSentenceIndex = 0;
                setupCurrentSentence();
            } else if (expectedWords.length === 0) {
                setupCurrentSentence();
            }
            try {
                recognition.start();
            } catch(e) {
                // If already started
            }
        }
        renderSentences();
        updatePlayButton();
    }

    function reset() {
        if (recognition) recognition.stop();
        currentSentenceIndex = 0;
        isPlaying = false;
        setupCurrentSentence();
        renderSentences();
        updatePlayButton();
    }

    function updatePlayButton() {
        const btn = document.getElementById('karaoke-play-btn');
        if (btn) {
            btn.innerHTML = isPlaying ? (isMicActive ? '🎙️ LISTENING...' : '🎙️ STARTING...') : '🎙️ START READING';
            if (isPlaying) {
                btn.className = 'w-32 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-red-500/30 active:scale-95 transition-all animate-pulse';
            } else {
                btn.className = 'w-48 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-500/30 active:scale-95 transition-all';
            }
        }
    }

    return {
        openMenu: openMenu,
        open: open,
        togglePlay: togglePlay,
        reset: reset,
        tapWord: tapWord,
        jumpTo: jumpTo,
        STORIES: STORIES
    };
})();
