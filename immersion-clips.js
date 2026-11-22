// [SHIELD_DAEMON: VALIDATED]
// ======== NATIVE SPEAKER IMMERSION & CLIPS ENGINE (Priority 34) ========
// Interactive Audio Loops, Tricky Consonant Acoustics, Shadowing & Belgrade Street Speech

window.ImmersionClips = (() => {
    'use strict';

    // ─── 1. CURATED IMMERSION DATABASE (16 Native Clips) ───
    const CLIPS_DATABASE = [
        // Category 1: Glasovi & Akustika (Č/Ć, Dž/Đ, R, Lj/Nj, Ž/Š)
        {
            id: 'clip_sounds_01',
            category: 'sounds',
            categoryLabel: 'Glasovi Č i Ć',
            badgeColor: 'bg-rose-500',
            speakerIcon: '🧑‍🏫',
            speakerTitle: 'Jezički Instruktor (Beograd)',
            sr_lat: 'Čaša čaja na ćošku stola.',
            sr_cyr: 'Чаша чаја на ћошку стола.',
            phonetic: '[CHAH-shah CHAH-yah nah CHOHSH-koo STOH-lah]',
            en: 'A cup of tea on the corner of the table.',
            acousticTip: 'Č (tvrdo) se izgovara sa vrhom jezika iza gornjih zuba. Ć (meko) je nežno, jezik je prislonjen uz nepce.',
            context: 'Najbolja vežba za razlikovanje tvrdog Č i mekog Ć u istoj rečenici.'
        },
        {
            id: 'clip_sounds_02',
            category: 'sounds',
            categoryLabel: 'Glasovi Dž i Đ',
            badgeColor: 'bg-purple-600',
            speakerIcon: '🎙️',
            speakerTitle: 'Radio Spiker (Novi Sad)',
            sr_lat: 'Džepni sat nosi đak prvak.',
            sr_cyr: 'Џепни сат носи ђак првак.',
            phonetic: '[DZEHP-nee saht NOH-see GYAHK PR-vahk]',
            en: 'The pocket watch is carried by the first grader.',
            acousticTip: 'Dž je tvrdo kao "j" u "jump". Đ je meko zvučno suglasnik, slično engleskom "schedule" na britanskom.',
            context: 'Paralela suglasnika: Dž odgovara tvrdom Č, a Đ odgovara mekom Ć.'
        },
        {
            id: 'clip_sounds_03',
            category: 'sounds',
            categoryLabel: 'Kotrljajuće R (Trilled R)',
            badgeColor: 'bg-emerald-600',
            speakerIcon: '🗣️',
            speakerTitle: 'Izvorni Govornik (Kragujevac)',
            sr_lat: 'Riba ribi grize rep, ruka ruku mije.',
            sr_cyr: 'Риба риби гризе реп, рука руку мије.',
            phonetic: '[REE-bah REE-bee GREE-zeh rehp, ROO-kah ROO-koo MEE-yeh]',
            en: 'Fish bites fish\'s tail, one hand washes the other.',
            acousticTip: 'Srpsko R je sonant sa vibracijom vrha jezika. Može biti i nosilac sloga (npr. "prvak", "prst").',
            context: 'Kultna govorna vežba koja opušta jezik za savršen akcenat.'
        },
        {
            id: 'clip_sounds_04',
            category: 'sounds',
            categoryLabel: 'Meki Suglasnici Lj i Nj',
            badgeColor: 'bg-sky-600',
            speakerIcon: '👩‍🏫',
            speakerTitle: 'Lektorka (Niš)',
            sr_lat: 'Ljubav prema novoj knjizi i letnjem danu.',
            sr_cyr: 'Љубав према новој књизи и летњем дану.',
            phonetic: '[LYOO-bahv PREH-mah NOH-voy KNYEE-zee ee LEHT-nyem DAH-noo]',
            en: 'Love for a new book and a summer day.',
            acousticTip: 'Lj i Nj su posebna slova u azbuci (Љ, Њ). Izgovaraju se kao jedan stopljeni mekani glas.',
            context: 'Ključno za topli, melodični ritam srpskog jezika.'
        },
        {
            id: 'clip_sounds_05',
            category: 'sounds',
            categoryLabel: 'Glasovi Ž i Š',
            badgeColor: 'bg-amber-600',
            speakerIcon: '🧑‍🌾',
            speakerTitle: 'Lokalac (Šumadija)',
            sr_lat: 'Život u šumi je tih i svež.',
            sr_cyr: 'Живот у шуми је тих и свеж.',
            phonetic: '[ZHEE-voht oo SHOO-mee yeh teekh ee svehzh]',
            en: 'Life in the forest is quiet and fresh.',
            acousticTip: 'Ž zvuči kao "s" u engleskom "pleasure". Š je standardno "sh" u "shoe".',
            context: 'Česti šuštavi suglasnici koji daju prepoznatljiv zvuk balkanskim jezicima.'
        },

        // Category 2: Ulica & Beogradski Sleng
        {
            id: 'clip_street_01',
            category: 'street',
            categoryLabel: 'Beogradski Pozdrav',
            badgeColor: 'bg-blue-600',
            speakerIcon: '🧢',
            speakerTitle: 'Beograđanin sa Dorćola',
            sr_lat: 'Gde si bre brate, šta ima novog kod tebe?',
            sr_cyr: 'Где си бре брате, шта има новог код тебе?',
            phonetic: '[GDEH see breh BRAH-teh, SHTAH EE-mah NOH-vohg kohd TEH-beh?]',
            en: 'Where you at bro, what\'s new with you?',
            acousticTip: 'Reč "bre" se izgovara kratko i ekspresivno na kraju ili početku rečenice za naglašavanje bliskosti.',
            context: 'Najčešći neformalni pozdrav među prijateljima i mladima u Srbiji.'
        },
        {
            id: 'clip_street_02',
            category: 'street',
            categoryLabel: 'Neverica & Šala',
            badgeColor: 'bg-indigo-600',
            speakerIcon: '😎',
            speakerTitle: 'Student (Vračar)',
            sr_lat: 'Ma nemoj da me zezaš, stvarno se to desilo?',
            sr_cyr: 'Ма немој да ме зезаш, стварно се то десило?',
            phonetic: '[Mah NEH-moy dah meh ZEH-zahsh, STVAHR-noh seh toh DEH-see-loh?]',
            en: 'Come on, stop kidding me, did that really happen?',
            acousticTip: '"Zezati" je ulični glagol za "šaliti se" ili "zafrkavati". Intonacija raste na kraju.',
            context: 'Kada čujete neverovatnu vest ili trač od prijatelja.'
        },
        {
            id: 'clip_street_03',
            category: 'street',
            categoryLabel: 'Odlazak na Kafu',
            badgeColor: 'bg-teal-600',
            speakerIcon: '☕',
            speakerTitle: 'Drugari u prolazu',
            sr_lat: 'Ajmo na jednu brzu kaficu u baštu.',
            sr_cyr: 'Ајмо на једну брзу кафицу у башту.',
            phonetic: '[EYE-moh nah YEH-dnoo BR-zoo KAH-fee-tsoo oo BAHSH-too]',
            en: 'Let\'s go for a quick coffee out in the garden patio.',
            acousticTip: '"Ajmo" je skraćeno od "hajdemo" (let\'s go). U Srbiji "brza kafa" uvek traje bar sat i po.',
            context: 'Srpska kultura ispijanja kafe je osnov društvenog života.'
        },
        {
            id: 'clip_street_04',
            category: 'street',
            categoryLabel: 'Naručivanje u Kafiću',
            badgeColor: 'bg-orange-600',
            speakerIcon: '🤵',
            speakerTitle: 'Konobar u Knez Mihailovoj',
            sr_lat: 'Daj mi jedan produženi espreso sa hladnim mlekom.',
            sr_cyr: 'Дај ми један продужени еспресо са хладним млеком.',
            phonetic: '[DYE mee YEH-dahn proh-DOO-zheh-nee eh-SPREH-soh sah HLAHD-neem MLEH-kohm]',
            en: 'Give me a lungo espresso with cold milk.',
            acousticTip: 'U Srbiji se u kafiću često naručuje direktno sa "Daj mi" ili "Može jedan", uvek uz osmeh.',
            context: 'Standardna porudžbina u bilo kom beogradskom ili novosadskom kafiću.'
        },
        {
            id: 'clip_street_05',
            category: 'street',
            categoryLabel: 'Oduševljenje',
            badgeColor: 'bg-red-600',
            speakerIcon: '🔥',
            speakerTitle: 'Mladi iz publike',
            sr_lat: 'Brate, ovo grmi koliko je dobro!',
            sr_cyr: 'Брате, ово грми колико је добро!',
            phonetic: '[BRAH-teh, OH-voh GR-mee KOH-lee-koh yeh DOH-broh!]',
            en: 'Bro, this is thunderously amazing!',
            acousticTip: '"Grmi" (doslovno grmljavina) je moderni beogradski sleng za nešto vrhunskog kvaliteta.',
            context: 'Koristi se za odličnu muziku, hranu ili uzbudljiv događaj.'
        },

        // Category 3: Kafana, Porodica & Balkanski Mentalitet
        {
            id: 'clip_culture_01',
            category: 'culture',
            categoryLabel: 'Bakin Zagrljaj',
            badgeColor: 'bg-pink-600',
            speakerIcon: '👵',
            speakerTitle: 'Baka iz Šumadije',
            sr_lat: 'Ljubi te baka, jesi li gladan zlato moje?',
            sr_cyr: 'Љуби те бака, јеси ли гладан злато моје?',
            phonetic: '[LYOO-bee teh BAH-kah, YEH-see lee GLAH-dahn ZLAH-toh MOH-yeh?]',
            en: 'Grandma kisses you, are you hungry my sweetheart?',
            acousticTip: '"Ljubi te baka" izražava bezuslovnu toplinu i ljubav starijih prema unucima.',
            context: 'Prva rečenica koju čujete kada zakoračite u kuću bilo koje bake na Balkanu.'
        },
        {
            id: 'clip_culture_02',
            category: 'culture',
            categoryLabel: 'Kafanska Zdravica',
            badgeColor: 'bg-amber-700',
            speakerIcon: '🍻',
            speakerTitle: 'Domaćin za stolom (Skadarlija)',
            sr_lat: 'Živeli, u zdravlje, da smo živi i zdravi!',
            sr_cyr: 'Живели, у здравље, да смо живи и здрави!',
            phonetic: '[ZHEE-veh-lee, oo ZDRAHV-lyeh, dah smoh ZHEE-vee ee ZDRAH-vee!]',
            en: 'Cheers, to health, may we be alive and healthy!',
            acousticTip: 'Kada se kuca čašama, obavezno gledajte sagovornika u oči (balkanski bonton).',
            context: 'Univerzalna srpska zdravica uz domaću rakiju ili vino.'
        },
        {
            id: 'clip_culture_03',
            category: 'culture',
            categoryLabel: 'Balkansko Strpljenje',
            badgeColor: 'bg-teal-700',
            speakerIcon: '🧘‍♂️',
            speakerTitle: 'Filozof sa klupe',
            sr_lat: 'Polako, nema sekiracije, sve ćemo stići na vreme.',
            sr_cyr: 'Полако, нема секирације, све ћемо стићи на време.',
            phonetic: '[POH-lah-koh, NEH-mah seh-kee-RAH-tsee-yeh, SVEH CHEH-moh STEE-chee nah VREH-meh]',
            en: 'Take it easy, no worries, we will make it all on time.',
            acousticTip: '"Sekiracija" označava stres ili nepotrebnu brigu. "Polako" je ključna reč balkanskog spokoja.',
            context: 'Suština opuštenog načina života gde kafa i druženje uvek imaju prednost nad žurbom.'
        },
        {
            id: 'clip_culture_04',
            category: 'culture',
            categoryLabel: 'Gostoprimstvo za Ručkom',
            badgeColor: 'bg-emerald-700',
            speakerIcon: '🍲',
            speakerTitle: 'Domaćica kuće',
            sr_lat: 'Prijatno i uzdravlje, uzmi još malo sarme!',
            sr_cyr: 'Пријатно и уздравље, узми још мало сарме!',
            phonetic: '[PREE-yaht-noh ee oo-ZDRAHV-lyeh, OOZ-mee yohsh MAH-loh SAHR-meh!]',
            en: 'Bon appétit and cheers, take a bit more sarma!',
            acousticTip: 'Odbijanje drugog tanjira hrane u srpskoj kući se smatra nemogućom misijom.',
            context: 'Toplo gostoprimstvo gde se ljubav prema gostu meri količinom domaće hrane.'
        },
        {
            id: 'clip_culture_05',
            category: 'culture',
            categoryLabel: 'Iskrena Zahvalnost',
            badgeColor: 'bg-violet-700',
            speakerIcon: '🤝',
            speakerTitle: 'Komšija iz zgrade',
            sr_lat: 'Hvala ti puno od srca, svaka ti čast!',
            sr_cyr: 'Хвала ти пуно од срца, свака ти част!',
            phonetic: '[HVAH-lah tee POO-noh ohd SR-tsah, SVAH-kah tee CHAHST!]',
            en: 'Thank you very much from the heart, kudos to you!',
            acousticTip: '"Svaka čast" se koristi kao izraz velikog poštovanja i divljenja za nečiji trud.',
            context: 'Kada vam neko učini veliku uslugu ili pokaže izuzetnu ljudskost.'
        },
        {
            id: 'clip_culture_06',
            category: 'culture',
            categoryLabel: 'Optimizam & Nada',
            badgeColor: 'bg-blue-700',
            speakerIcon: '🌅',
            speakerTitle: 'Stariji Prijatelj',
            sr_lat: 'Sutra je novi dan, sve će leći na svoje mesto.',
            sr_cyr: 'Сутра је нови дан, све ће лећи на своје место.',
            phonetic: '[SOO-trah yeh NOH-vee dahn, SVEH CHEH LEH-chee nah SVOH-yeh MEH-stoh]',
            en: 'Tomorrow is a new day, everything will fall into its right place.',
            acousticTip: 'Melodična rečenica sa dugouzlaznim akcentom na "sutra" i mirnim padom na kraju.',
            context: 'Reči utehe i podrške koje prijatelji upućuju jedni drugima posle teškog dana.'
        }
    ];

    // ─── 2. ENGINE STATE ───
    let currentCategory = 'all';
    let filteredClips = [...CLIPS_DATABASE];
    let currentIndex = 0;
    let playbackSpeed = 1.0; // 1.0x or 0.75x
    let isLooping = false;
    let subtitleMode = 'latin'; // 'latin' | 'cyrillic' | 'hidden'
    let isPlaying = false;
    let loopTimeoutId = null;
    let currentAudio = null;

    // ─── 3. CORE CONTROLLERS ───
    function openModal() {
        const modal = document.getElementById('immersion-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        filterCategory('all');
        renderCurrentClip();
        if (window.TouchHaptics) TouchHaptics.vibrate('tap');
    }

    function closeModal() {
        stopAudio();
        const modal = document.getElementById('immersion-modal');
        if (modal) modal.classList.add('hidden');
    }

    function filterCategory(cat) {
        currentCategory = cat;
        if (cat === 'all') {
            filteredClips = [...CLIPS_DATABASE];
        } else {
            filteredClips = CLIPS_DATABASE.filter(c => c.category === cat);
        }
        currentIndex = 0;

        // Update category tab button active states
        const catBtns = ['all', 'sounds', 'street', 'culture'];
        catBtns.forEach(c => {
            const btn = document.getElementById('imm-cat-' + c);
            if (btn) {
                if (c === cat) {
                    btn.classList.remove('bg-slate-800', 'text-slate-300');
                    btn.classList.add('bg-red-600', 'text-white');
                } else {
                    btn.classList.remove('bg-red-600', 'text-white');
                    btn.classList.add('bg-slate-800', 'text-slate-300');
                }
            }
        });

        renderCurrentClip();
    }

    function prevClip() {
        stopAudio();
        currentIndex = (currentIndex - 1 + filteredClips.length) % filteredClips.length;
        renderCurrentClip();
        if (window.TouchHaptics) TouchHaptics.vibrate('tap');
    }

    function nextClip() {
        stopAudio();
        currentIndex = (currentIndex + 1) % filteredClips.length;
        renderCurrentClip();
        if (window.TouchHaptics) TouchHaptics.vibrate('tap');
    }

    function toggleSpeed() {
        playbackSpeed = playbackSpeed === 1.0 ? 0.75 : 1.0;
        const btn = document.getElementById('imm-speed-toggle');
        if (btn) {
            btn.innerText = playbackSpeed === 1.0 ? '1.0x (Normalno)' : '0.75x (Usporeno)';
            btn.classList.toggle('text-amber-400', playbackSpeed === 0.75);
            btn.classList.toggle('text-white', playbackSpeed === 1.0);
        }
        if (window.TouchHaptics) TouchHaptics.vibrate('tap');
    }

    function cycleSubtitleMode() {
        if (subtitleMode === 'latin') {
            subtitleMode = 'cyrillic';
        } else if (subtitleMode === 'cyrillic') {
            subtitleMode = 'hidden';
        } else {
            subtitleMode = 'latin';
        }
        renderCurrentClip();
        if (window.TouchHaptics) TouchHaptics.vibrate('tap');
    }

    function toggleLoop() {
        isLooping = !isLooping;
        const btn = document.getElementById('imm-loop-btn');
        if (btn) {
            if (isLooping) {
                btn.classList.remove('bg-slate-800', 'text-slate-300');
                btn.classList.add('bg-amber-500', 'text-slate-950', 'ring-2', 'ring-amber-300');
            } else {
                btn.classList.remove('bg-amber-500', 'text-slate-950', 'ring-2', 'ring-amber-300');
                btn.classList.add('bg-slate-800', 'text-slate-300');
            }
        }
        if (isLooping) {
            playAudio();
            if (window.app && window.app.showToast) {
                window.app.showToast('🔁 Audio Loop uključen (ponavljanje na svake 2.5s)', 'info');
            }
        } else {
            stopAudio();
        }
        if (window.TouchHaptics) TouchHaptics.vibrate('tap');
    }

    // ─── 4. AUDIO PLAYBACK & EQUALIZER ───
    function playAudio() {
        if (filteredClips.length === 0) return;
        const clip = filteredClips[currentIndex];
        if (!clip) return;

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        isPlaying = true;
        updateVisualizer(true);

        // ALWAYS sanitize: strip bracketed phonetics, notes, and extra whitespace
        const rawText = clip.sr_lat || '';
        const textToSpeak = rawText.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\/.*?\//g, '').trim();
        if (!textToSpeak) return;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'sr-RS';
        utterance.rate = 0.85 * playbackSpeed;
        utterance.volume = (typeof state !== 'undefined' && state.settings && state.settings.volume && state.settings.volume.tts !== undefined) 
            ? state.settings.volume.tts 
            : 1.0;

        // Try selecting Serbian voice if available
        const voices = window.speechSynthesis.getVoices();
        const srVoice = voices.find(v => v.lang.startsWith('sr'));
        if (srVoice) {
            utterance.voice = srVoice;
        } else {
            playGtxAudio(textToSpeak);
            return;
        }

        utterance.onend = () => {
            isPlaying = false;
            updateVisualizer(false);

            if (isLooping) {
                loopTimeoutId = setTimeout(() => {
                    const modal = document.getElementById('immersion-modal');
                    if (modal && !modal.classList.contains('hidden') && isLooping) {
                        playAudio();
                    }
                }, 2000);
            }
        };

        utterance.onerror = (e) => {
            console.warn("Immersion TTS error:", e);
            isPlaying = false;
            updateVisualizer(false);
            if (window.app && window.app.fallbackSpeech) {
                window.app.fallbackSpeech(textToSpeak, 'sr-RS');
            }
        };

        window.speechSynthesis.speak(utterance);
    }

    function playGtxAudio(text) {
        try {
            let cleanText = text ? text.trim() : '';
            if (cleanText && !/[.!?,\-:;]$/.test(cleanText)) {
                cleanText += '.';
            }
            const textForGoogle = (window.app && window.app.toCyrillic) ? window.app.toCyrillic(cleanText) : cleanText;
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=sr&q=${encodeURIComponent(textForGoogle)}&_t=${Date.now()}`;
            const audio = new Audio();
            audio.referrerPolicy = "no-referrer";
            audio.preload = "auto";
            audio.volume = (typeof state !== 'undefined' && state.settings && state.settings.volume && state.settings.volume.tts !== undefined) 
                ? state.settings.volume.tts 
                : 1.0;
            // Set playbackRate after metadata loads for reliability
            audio.onloadedmetadata = () => { audio.playbackRate = playbackSpeed; };
            audio.src = url;

            audio.onended = () => {
                isPlaying = false;
                updateVisualizer(false);
                if (isLooping) {
                    loopTimeoutId = setTimeout(() => {
                        const modal = document.getElementById('immersion-modal');
                        if (modal && !modal.classList.contains('hidden') && isLooping) {
                            playAudio();
                        }
                    }, 2000);
                }
            };

            audio.onerror = () => {
                isPlaying = false;
                updateVisualizer(false);
                if (window.app && window.app.fallbackSpeech) {
                    window.app.fallbackSpeech(text, 'sr-RS');
                }
            };

            currentAudio = audio;
            audio.play().catch(e => {
                if (e.name === 'AbortError' || e.name === 'NotAllowedError') return;
                console.warn("Audio play rejected, falling back:", e);
                isPlaying = false;
                updateVisualizer(false);
                if (window.app && window.app.fallbackSpeech) {
                    window.app.fallbackSpeech(text, 'sr-RS');
                }
            });
        } catch (e) {
            console.warn("playGtxAudio error:", e);
            isPlaying = false;
            updateVisualizer(false);
        }
    }

    function stopAudio() {
        isPlaying = false;
        if (loopTimeoutId) {
            clearTimeout(loopTimeoutId);
            loopTimeoutId = null;
        }
        if (currentAudio) {
            currentAudio.onerror = null;
            currentAudio.onended = null;
            currentAudio.pause();
            currentAudio = null;
        }
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        updateVisualizer(false);
    }

    function updateVisualizer(playing) {
        const visualizer = document.getElementById('imm-visualizer');
        const playBtn = document.getElementById('imm-play-btn');
        if (playBtn) {
            playBtn.innerHTML = playing ? '<span>⏸️</span> <span>Pauziraj</span>' : '<span>▶️</span> <span>Slušaj</span>';
            playBtn.classList.toggle('bg-red-700', playing);
            playBtn.classList.toggle('bg-red-600', !playing);
        }
        if (visualizer) {
            const bars = visualizer.querySelectorAll('.eq-bar');
            bars.forEach((bar, idx) => {
                if (playing) {
                    bar.style.animation = `pulse ${0.3 + (idx * 0.15)}s infinite alternate ease-in-out`;
                    bar.classList.add('bg-amber-400');
                    bar.classList.remove('bg-slate-600');
                } else {
                    bar.style.animation = 'none';
                    bar.classList.remove('bg-amber-400');
                    bar.classList.add('bg-slate-600');
                }
            });
        }
    }

    // ─── 5. SRS FLASHCARD INTEGRATION & SHADOWING ───
    function starToFlashcards() {
        const clip = filteredClips[currentIndex];
        if (!clip) return;

        // Synchronize with state.srsData and state.mistakeLog (Section 7 Synchronized Progress)
        if (typeof state !== 'undefined') {
            if (!state.srsData) state.srsData = {};
            state.srsData[clip.id] = {
                wordId: clip.id,
                sr_lat: clip.sr_lat,
                sr_cyr: clip.sr_cyr,
                en: clip.en,
                category: 'Native Immersion',
                repetitions: 0,
                interval: 0,
                easeFactor: 2.5,
                lastReviewed: null,
                nextReview: new Date().toISOString().split('T')[0],
                strength: 20
            };

            if (!state.mistakeLog) state.mistakeLog = {};
            state.mistakeLog[clip.id] = (state.mistakeLog[clip.id] || 0) + 1;

            if (window.app && window.app.saveStats) {
                window.app.saveStats();
            }
        }

        if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
        if (window.app && window.app.showToast) {
            window.app.showToast(`⭐ "${clip.sr_lat.slice(0, 24)}..." dodato u Flashcard špil!`, 'success');
        }

        const starBtn = document.getElementById('imm-star-btn');
        if (starBtn) {
            starBtn.innerHTML = '<span>★</span> <span>Sačuvano!</span>';
            starBtn.classList.remove('text-slate-400', 'bg-slate-800');
            starBtn.classList.add('text-amber-400', 'bg-amber-950/40', 'border-amber-500/50');
        }
    }

    function practiceShadowing() {
        const clip = filteredClips[currentIndex];
        if (!clip) return;

        const micBtn = document.getElementById('imm-shadow-btn');
        if (!micBtn) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            if (window.app && window.app.showToast) {
                window.app.showToast('🎙️ Prepoznavanje govora nije podržano u ovom pregledaču. Ponovite naglas uz loop!', 'info');
            }
            playAudio();
            return;
        }

        micBtn.innerHTML = '<span>🔴</span> <span>Slušam te... Govori!</span>';
        micBtn.classList.add('bg-red-500', 'animate-pulse');

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = 'sr-RS';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                const userSpeech = event.results[0][0].transcript;
                micBtn.innerHTML = '<span>🎙️</span> <span>Vežbaj Shadowing</span>';
                micBtn.classList.remove('bg-red-500', 'animate-pulse');

                if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
                if (window.app && window.app.showToast) {
                    window.app.showToast(`👏 Rekli ste: "${userSpeech}" — Bravo za hrabrost!`, 'success');
                }
            };

            recognition.onerror = () => {
                micBtn.innerHTML = '<span>🎙️</span> <span>Vežbaj Shadowing</span>';
                micBtn.classList.remove('bg-red-500', 'animate-pulse');
                if (window.app && window.app.showToast) {
                    window.app.showToast('Nismo čuli jasno, probaj ponovo!', 'info');
                }
            };

            recognition.onend = () => {
                micBtn.innerHTML = '<span>🎙️</span> <span>Vežbaj Shadowing</span>';
                micBtn.classList.remove('bg-red-500', 'animate-pulse');
            };

            recognition.start();
        } catch (e) {
            console.warn("Shadowing recognition error:", e);
            micBtn.innerHTML = '<span>🎙️</span> <span>Vežbaj Shadowing</span>';
            micBtn.classList.remove('bg-red-500', 'animate-pulse');
        }
    }

    // ─── 6. DYNAMIC UI RENDERING ───
    function renderCurrentClip() {
        const container = document.getElementById('immersion-player-container');
        const counter = document.getElementById('immersion-clip-counter');
        if (!container) return;

        if (filteredClips.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-slate-400">
                    <div class="text-4xl mb-2">🔍</div>
                    <p class="font-bold text-sm">Nema pronađenih klipova u ovoj kategoriji.</p>
                </div>
            `;
            if (counter) counter.innerText = '0 / 0';
            return;
        }

        const clip = filteredClips[currentIndex];
        if (counter) counter.innerText = `${currentIndex + 1} / ${filteredClips.length}`;

        // Subtitle rendering logic
        let displaySerbian = clip.sr_lat;
        let scriptLabel = 'Latinica';
        if (subtitleMode === 'cyrillic') {
            displaySerbian = clip.sr_cyr;
            scriptLabel = 'Ćirilica';
        } else if (subtitleMode === 'hidden') {
            displaySerbian = '•••••••••••••••••••••';
            scriptLabel = 'Skriveno (Blind Test)';
        }

        const isHardcoreImmersion = typeof state !== 'undefined' && state.settings && state.settings.hardcoreImmersion;
        const englishDisplay = isHardcoreImmersion ? '' : `
            <div class="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span class="font-medium italic">"${clip.en}"</span>
                <span class="text-[9px] font-black uppercase text-slate-500 tracking-wider">Prevod</span>
            </div>
        `;

        container.innerHTML = `
            <!-- Player Card -->
            <div class="bg-slate-800/80 border-2 border-slate-700/80 rounded-2xl p-4 shadow-xl space-y-4 relative overflow-hidden">
                
                <!-- Speaker Header & Acoustic Equalizer -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl shadow-inner">
                            ${clip.speakerIcon}
                        </div>
                        <div>
                            <span class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-white ${clip.badgeColor}">
                                ${clip.categoryLabel}
                            </span>
                            <h4 class="text-xs font-bold text-slate-300 mt-0.5">${clip.speakerTitle}</h4>
                        </div>
                    </div>

                    <!-- Acoustic Sound Wave Equalizer Bars -->
                    <div id="imm-visualizer" class="flex items-end gap-1 h-6 px-2 py-1 bg-slate-900/60 rounded-lg border border-slate-700/60">
                        <div class="eq-bar w-1 bg-slate-600 rounded-full h-2 transition-all"></div>
                        <div class="eq-bar w-1 bg-slate-600 rounded-full h-4 transition-all"></div>
                        <div class="eq-bar w-1 bg-slate-600 rounded-full h-5 transition-all"></div>
                        <div class="eq-bar w-1 bg-slate-600 rounded-full h-3 transition-all"></div>
                        <div class="eq-bar w-1 bg-slate-600 rounded-full h-4 transition-all"></div>
                    </div>
                </div>

                <!-- Primary Serbian Phrase Display -->
                <div class="bg-slate-900/90 rounded-2xl p-4 border border-slate-700/60 space-y-2 text-center">
                    <div class="text-xl md:text-2xl font-black text-white leading-snug tracking-tight">
                        ${displaySerbian}
                    </div>

                    ${subtitleMode !== 'hidden' ? `
                        <div class="text-[11px] font-mono font-bold text-amber-300/90 tracking-wide">
                            ${clip.phonetic}
                        </div>
                    ` : `
                        <button onclick="ImmersionClips.cycleSubtitleMode()" class="text-[10px] font-black text-blue-400 uppercase tracking-wider underline hover:text-blue-300">
                            👁️ Prikaži Tekst & Izgovor
                        </button>
                    `}

                    ${englishDisplay}
                </div>

                <!-- Linguistic & Acoustic Tip Card -->
                <div class="bg-slate-900/50 rounded-xl p-3 border border-slate-700/40 space-y-1.5 text-left">
                    <div class="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400 tracking-wider">
                        <span>💡</span> <span>Savet za Izgovor:</span>
                    </div>
                    <p class="text-xs text-slate-300 leading-relaxed font-medium">
                        ${clip.acousticTip}
                    </p>
                    <div class="pt-1 text-[10px] text-slate-400 italic">
                        📍 <b>Situacija:</b> ${clip.context}
                    </div>
                </div>

                <!-- Interactive Utility Controls Row -->
                <div class="grid grid-cols-2 gap-2 pt-1">
                    <button onclick="ImmersionClips.toggleSpeed()" id="imm-speed-toggle"
                        class="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-black transition-all flex items-center justify-center gap-1.5 ${playbackSpeed === 0.75 ? 'text-amber-400' : 'text-white'}">
                        <span>⚡</span> <span>${playbackSpeed === 1.0 ? '1.0x (Normalno)' : '0.75x (Usporeno)'}</span>
                    </button>

                    <button onclick="ImmersionClips.cycleSubtitleMode()"
                        class="py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-black text-white transition-all flex items-center justify-center gap-1.5">
                        <span>👁️</span> <span>${scriptLabel}</span>
                    </button>
                </div>

                <!-- Main Action Buttons -->
                <div class="flex gap-2 pt-1">
                    <button onclick="ImmersionClips.playAudio()" id="imm-play-btn"
                        class="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-red-600/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span>▶️</span> <span>Slušaj</span>
                    </button>

                    <button onclick="ImmersionClips.toggleLoop()" id="imm-loop-btn"
                        class="py-3 px-3.5 rounded-xl border border-slate-700 font-black text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 ${isLooping ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-slate-800 text-slate-300'}">
                        <span>🔁</span> <span>Loop</span>
                    </button>
                </div>

                <!-- Practice & Flashcard Secondary Actions -->
                <div class="flex gap-2 pt-1">
                    <button onclick="ImmersionClips.practiceShadowing()" id="imm-shadow-btn"
                        class="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5">
                        <span>🎙️</span> <span>Vežbaj Shadowing</span>
                    </button>

                    <button onclick="ImmersionClips.starToFlashcards()" id="imm-star-btn"
                        class="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-400 font-bold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5">
                        <span>★</span> <span>Sačuvaj</span>
                    </button>
                </div>

            </div>
        `;
    }

    // ─── 7. PUBLIC API EXPORTS ───
    return {
        openModal,
        closeModal,
        filterCategory,
        prevClip,
        nextClip,
        toggleSpeed,
        cycleSubtitleMode,
        toggleLoop,
        playAudio,
        stopAudio,
        starToFlashcards,
        practiceShadowing,
        renderCurrentClip
    };
})();
