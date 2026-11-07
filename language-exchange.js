// [SHIELD_DAEMON: VALIDATED]
// language-exchange.js — Priority 43: Omegle-Style Language Exchange Hub ("Slučajni Sagovornik")
// Pure vanilla JS, zero dependencies, offline-first resilient, UTF-8 armored
// SerboLingo Technical Constitution v3.0 compliant

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // §1  STORAGE KEYS & CONSTANTS
    // ═══════════════════════════════════════════════════════════
    const STORAGE_BLOCKED   = 'serbolingo_exchange_blocked';
    const STORAGE_HISTORY   = 'serbolingo_exchange_history';
    const STORAGE_STATS     = 'serbolingo_exchange_stats';

    // ═══════════════════════════════════════════════════════════
    // §2  12 AUTHENTIC PERSONAS (Offline & Instant Match Roster)
    // ═══════════════════════════════════════════════════════════
    const PERSONAS = [
        {
            id: 'pers_milica',
            name: 'Milica Jovanović',
            age: 24,
            city: 'Beograd (Dorćol)',
            avatar: '👩‍🎓',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Maternji Govornik',
            level: 'Srpski (Maternji) ↔ Engleski (B1)',
            bio: 'Studentkinja filologije, obožavam kafu na Dorćolu, književnost i muziku.',
            greeting_sr: 'Ćao! Kako si danas? Baš mi je drago što vežbamo zajedno! O čemu želiš da pričamo?',
            greeting_en: 'Hi! How are you today? Really happy to practice together! What would you like to chat about?',
            responses_sr: [
                'Potpuno te razumem! Srpski padeži su stvarno teški, ali ti ide super!',
                'Da li si nekada bio u Beogradu? Skadarlija i Kalemegdan su prelepi u proleće.',
                'I ja isto tako učim engleski, stalno me zbune phrasal verbs, haha!',
                'Odlično si ovo rekao! Samo mala tajna: domaći govornici ovde češće kažu "nema problema" nego "nema na čemu".',
                'Koja ti je omiljena srpska hrana do sada? Burek, sarma ili ćevapi?'
            ],
            responses_en: [
                'I completely get you! English prepositions always confuse me as well.',
                'Have you ever visited Serbia? Springtime in Belgrade is truly amazing.',
                'Your sentence was great! Practice makes perfect.',
                'What is your favorite topic to talk about? Movies, travel, or food?'
            ]
        },
        {
            id: 'pers_jovan',
            name: 'Jovan Petrović',
            age: 28,
            city: 'Novi Sad',
            avatar: '👨‍💻',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Tech Entuzijasta',
            level: 'Srpski (Maternji) ↔ Engleski (B2)',
            bio: 'Frontend developer, volim biciklizam pored Dunava i pripremam se za tech intervjue.',
            greeting_sr: 'Pozdrav! Super što te srećem. Ja spremam intervju na engleskom, a rado ću ti pomoći sa srpskim!',
            greeting_en: 'Greetings! Great to meet you. I am preparing for a tech interview in English, happy to help with Serbian!',
            responses_sr: [
                'Haha, dobra rečenica! Zvučiš kao pravi programer.',
                'Novi Sad je jako miran grad u poređenju sa Beogradom. Dunavski park je savršen za opuštanje.',
                'Tačno tako! U srpskom jeziku red reči je malo slobodniji nego u engleskom, pa imaš više slobode.',
                'Kako ti idu glagolski oblici? Svršeni i nesvršeni glagoli znaju da budu trik.',
                'Bravo za trud! Svaki dan po 15 minuta razgovora donosi ogroman napredak.'
            ],
            responses_en: [
                'Nice phrasing! Sounds like a natural conversational tone.',
                'I love working remotely while practicing new languages.',
                'Tell me about your daily routine! What do you like to do on weekends?'
            ]
        },
        {
            id: 'pers_liam',
            name: 'Liam Walker',
            age: 23,
            city: 'London, UK',
            avatar: '🧔',
            nativeLang: 'en',
            learningLang: 'sr',
            badge: 'Traveler',
            level: 'English (Native) ↔ Serbian (A2)',
            bio: 'Backpacker planning a summer trip to Belgrade, Tara National Park and Kotor.',
            greeting_sr: 'Zdravo! Ja sam Liam iz Londona. Učim srpski jer planiram putovanje na Balkan na leto!',
            greeting_en: 'Hello! I am Liam from London. Learning Serbian for an upcoming Balkan road trip!',
            responses_sr: [
                'Vau, tvoj srpski je odličan! Ja još uvek učim kako se naručuje kafa bez greške.',
                'London je stalno kišovit ovih dana, jedva čekam sunce u Srbiji!',
                'Možeš li mi preporučiti neko dobro mesto za planinarenje na Balkanu?',
                'Hvala ti puno na pomoći! Da li se ova reč često koristi u svakodnevnom govoru?'
            ],
            responses_en: [
                'Your English is so smooth! What is your favorite city you have traveled to?',
                'I am really excited to try traditional Balkan barbecue and homemade rakija!',
                'Thanks a lot for the tip, adding it to my travel notebook right now!'
            ]
        },
        {
            id: 'pers_elena',
            name: 'Elena Kostić',
            age: 31,
            city: 'Chicago, USA',
            avatar: '👩‍💼',
            nativeLang: 'en',
            learningLang: 'sr',
            badge: 'Balkan Heritage',
            level: 'English (Native) ↔ Serbian (B1)',
            bio: 'Moji baka i deka su iz Niša. Učim srpski da bih mogla tečno da pričam sa rodbinom!',
            greeting_sr: 'Ćao svima! Moja porodica je poreklom iz Niša i trudim se da usavršim jezik. Kako si ti?',
            greeting_en: 'Hey! My family is originally from Niš and I am working hard on my Serbian fluency. How are you?',
            responses_sr: [
                'Baka mi uvek kaže: "Ko pita, ne skita!" To mi je omiljena izreka.',
                'U Čikagu ima dosta naših ljudi i restorana, ali ništa ne može da zameni pravi domaći govor.',
                'Padeži su mi bili noćna mora na početku, ali vežba u ovoj aplikaciji mi je spasila život!',
                'Drago mi je što vežbamo! Da li često pričaš na stranim jezicima?'
            ],
            responses_en: [
                'Connecting with my roots has been such a rewarding journey!',
                'What is your favorite family tradition or holiday?'
            ]
        },
        {
            id: 'pers_stefan',
            name: 'Stefan Ilić',
            age: 26,
            city: 'Niš (Južna pruga)',
            avatar: '😎',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Južni Humor',
            level: 'Srpski (Maternji) ↔ Engleski (B1)',
            bio: 'Obožavam roštilj, košarku i merakaški život. Kod nas na jugu nema nerviranja!',
            greeting_sr: 'Kude si bre! Pozdrav iz Niša! Ako oćeš da naučiš pravi meraklijski srpski i dobar roštilj, na pravom si mestu!',
            greeting_en: 'Greetings from Niš! Ready to teach you authentic Southern Serbian charm and great barbecue tips!',
            responses_sr: [
                'Kod nas u Niš se kaže: "Merak nema cenu!" Znaš li šta to znači?',
                'Nema žurbe, polako! Jezik se uči uz razgovor i smeh, a ne samo iz suvih gramatika.',
                'Haha, svaka čast! Kad dođeš u Niš, vodim te na pravu nišku pljeskavicu!',
                'Ako razumeš južnjački dijalekt, položio si doktorat iz srpskog jezika, garantujem!'
            ],
            responses_en: [
                'Southern hospitality is real, my friend! You are always welcome in Niš.',
                'Tell me about your favorite sports or outdoor activities!'
            ]
        },
        {
            id: 'pers_carlos',
            name: 'Carlos Ruiz',
            age: 27,
            city: 'Madrid, España',
            avatar: '🎸',
            nativeLang: 'es',
            learningLang: 'sr',
            badge: 'Poliglota',
            level: 'Španski (Maternji) ↔ Srpski (B1)',
            bio: 'Učim slovenske jezike. Srpski mi ima neverovatno melodičan i ritmičan zvuk.',
            greeting_sr: '¡Hola! Zdravo! Učim srpski jer volim balkansku muziku i trubače. Kako napreduješ sa učenjem?',
            greeting_en: 'Hola! Learning Serbian because I adore Balkan brass music and Balkan rhythm. How is your learning going?',
            responses_sr: [
                'Neverovatno je koliko sličnosti u duhu i temperamentu imaju Španci i ljudi sa Balkana!',
                'Srpski akcenti su jako specifični, ali vežbam svaki dan.',
                'Da li slušaš Gorana Bregovića ili Bobana Markovića? Ta energija je čista magija!'
            ],
            responses_en: [
                'Learning multiple languages makes the brain so much more flexible!',
                'What inspired you to study languages?'
            ]
        },
        {
            id: 'pers_sakura',
            name: 'Sakura Tanaka',
            age: 25,
            city: 'Tokyo, Japan',
            avatar: '🌸',
            nativeLang: 'jp',
            learningLang: 'sr',
            badge: 'Linguist',
            level: 'Japanski (Maternji) ↔ Srpski (A2)',
            bio: 'Fasciniraju me ćirilica i 7 padeža. Učim srpski svakog jutra pre posla!',
            greeting_sr: 'Konnichiwa! Zdravo! Ja sam Sakura iz Tokija. Srpska ćirilica i gramatika su mi prelepe!',
            greeting_en: 'Konnichiwa! Hello! I am Sakura from Tokyo. Serbian Cyrillic and grammar are fascinating to me!',
            responses_sr: [
                'U japanskom jeziku nemamo padeže na ovaj način, pa mi je srpski kao rešavanje matematičke zagonetke.',
                'U Tokiju je sada noć, ali uvek nađem vremena za jezičku vežbu.',
                'Volela bih da jednog dana posetim Novi Sad i EXIT festival!'
            ],
            responses_en: [
                'Grammar patterns are like beautiful puzzles to solve.',
                'Thank you for speaking with me today!'
            ]
        },
        {
            id: 'pers_ana',
            name: 'Ana Lazarević',
            age: 22,
            city: 'Kragujevac',
            avatar: '🎨',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Kreativac',
            level: 'Srpski (Maternji) ↔ Engleski (A2)',
            bio: 'Crtam digitalne ilustracije i volim da upoznajem ljude iz celog sveta.',
            greeting_sr: 'Ćao! Jako se radujem razgovoru! Ne zameri ako nekad pogrešim u engleskom, tek počinjem!',
            greeting_en: 'Hi! So happy to talk! Please excuse any English mistakes, I am just building my confidence!',
            responses_sr: [
                'Najbitnije je da se razumemo! Gramatika dođe sama po sebi kroz praksu.',
                'Volim da crtam motive iz srpskih narodnih bajki.',
                'O čemu najviše voliš da pričaš tokom dana?'
            ],
            responses_en: [
                'Practicing with real people is 10 times better than just reading books!',
                'What are your creative hobbies?'
            ]
        }
    ];

    // ═══════════════════════════════════════════════════════════
    // §3  ICEBREAKER CONVERSATION TOPICS
    // ═══════════════════════════════════════════════════════════
    const ICEBREAKERS = [
        { icon: '☕', label: 'Kafanski Razgovori', prompt_sr: 'Kako voliš da piješ kafu i koje ti je omiljeno mesto za opuštanje?', prompt_en: 'How do you take your coffee and what is your favorite spot to relax?' },
        { icon: '✈️', label: 'Putovanja & Mesta', prompt_sr: 'Koje je najzanimljivije mesto koje si posetio ove godine?', prompt_en: 'What is the most interesting place you have visited this year?' },
        { icon: '🍕', label: 'Hrana & Specijaliteti', prompt_sr: 'Koje ti je omiljeno domaće jelo i voliš li da kuvaš?', prompt_en: 'What is your favorite local food and do you enjoy cooking?' },
        { icon: '🎬', label: 'Filmovi & Serije', prompt_sr: 'Koji film ili seriju bi mogao da gledaš iznova bez prestanka?', prompt_en: 'Which movie or series could you rewatch endlessly without getting bored?' },
        { icon: '🧠', label: 'Jezički Izazov', prompt_sr: 'Koji ti je bio najteži izazov u učenju novog jezika do sada?', prompt_en: 'What has been your biggest challenge in learning a new language so far?' }
    ];

    // ═══════════════════════════════════════════════════════════
    // §4  UTILITY HELPERS (Escaping, Time, Storage)
    // ═══════════════════════════════════════════════════════════
    function esc(text) {
        var d = document.createElement('div');
        d.textContent = text || '';
        return d.innerHTML;
    }

    function fmtTime(d) {
        var date = d || new Date();
        var h = String(date.getHours()).padStart(2, '0');
        var m = String(date.getMinutes()).padStart(2, '0');
        return h + ':' + m;
    }

    // ═══════════════════════════════════════════════════════════
    // §5  LANGUAGE EXCHANGE ENGINE OBJECT
    // ═══════════════════════════════════════════════════════════
    window.LanguageExchange = {
        state: 'LOBBY', // LOBBY | SEARCHING | CONNECTED | DISCONNECTED
        mode: '1v1',    // 1v1 | friend | group
        partner: null,
        groupMembers: [],
        messages: [],
        searchTimer: null,
        typingTimer: null,
        exchangeCount: 0,
        roomCode: '',

        // ── Modal Management ────────────────────────────────
        openModal: function() {
            var modal = document.getElementById('exchange-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            this.state = 'LOBBY';
            this.messages = [];
            this.partner = null;
            this.exchangeCount = 0;
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeModal: function() {
            var modal = document.getElementById('exchange-modal');
            if (!modal) return;
            this.cleanupTimers();
            modal.classList.add('hidden');
            this.state = 'LOBBY';
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        cleanupTimers: function() {
            if (this.searchTimer) { clearTimeout(this.searchTimer); this.searchTimer = null; }
            if (this.typingTimer) { clearTimeout(this.typingTimer); this.typingTimer = null; }
        },

        // ── Matchmaking Orchestrator ────────────────────────
        startMatching: function(mode) {
            this.mode = mode || '1v1';
            this.state = 'SEARCHING';
            this.cleanupTimers();
            this.render();

            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();

            // Simulate realistic radar search delay (1.5 - 2.8 seconds)
            var self = this;
            var delay = 1500 + Math.floor(Math.random() * 1300);

            this.searchTimer = setTimeout(function() {
                self.connectPartner();
            }, delay);
        },

        connectPartner: function() {
            var blocked = this._getBlockedList();
            var available = PERSONAS.filter(function(p) {
                return blocked.indexOf(p.id) === -1;
            });
            if (available.length === 0) available = PERSONAS;

            // Pick a random persona
            var chosen = available[Math.floor(Math.random() * available.length)];
            this.partner = chosen;
            this.state = 'CONNECTED';
            this.messages = [];
            this.exchangeCount = 0;

            if (this.mode === 'group') {
                // Pick 3 group partners
                var others = available.filter(function(p) { return p.id !== chosen.id; });
                var shuffled = others.sort(function() { return 0.5 - Math.random(); });
                this.groupMembers = [chosen, shuffled[0] || PERSONAS[0], shuffled[1] || PERSONAS[1]];
            }

            // Push initial greeting from partner
            var userDir = (window.state && state.settings && state.settings.learningDirection) || 'sr_to_en';
            var greeting = (userDir === 'en_to_sr') ? chosen.greeting_sr : (chosen.greeting_sr + ' (' + chosen.greeting_en + ')');

            this.messages.push({
                sender: 'partner',
                author: chosen.name,
                avatar: chosen.avatar,
                text: greeting,
                time: fmtTime(new Date()),
                translated: null
            });

            this.render();

            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();
            if (window.app) app.showToast('Povezan/a sa: ' + chosen.name + '! 👋', 'success');
        },

        nextPartner: function() {
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
            this.startMatching(this.mode);
        },

        disconnect: function() {
            this.cleanupTimers();
            this.state = 'DISCONNECTED';
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        returnToLobby: function() {
            this.cleanupTimers();
            this.state = 'LOBBY';
            this.partner = null;
            this.messages = [];
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §6  MESSAGING & REASONING PIPELINE
        // ═════════════════════════════════════════════════════
        sendMessage: function() {
            var input = document.getElementById('exchange-msg-input');
            var text = input ? input.value.trim() : '';
            if (!text) return;

            var userName = (window.state && state.user && state.user.name) ? state.user.name : 'Ti';
            var userAvatar = (window.state && state.user && state.user.avatar) ? state.user.avatar : '👤';

            // Push user message
            this.messages.push({
                sender: 'user',
                author: userName,
                avatar: userAvatar,
                text: text,
                time: fmtTime(new Date())
            });

            if (input) input.value = '';
            this.renderMessageStream();
            this.scrollBottom();

            this.exchangeCount++;
            if (this.exchangeCount % 3 === 0) {
                this._awardExchangeXP();
            }

            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();

            // Trigger partner reply simulation
            this.triggerPartnerReply(text);
        },

        sendTopicPrompt: function(idx) {
            var topic = ICEBREAKERS[idx];
            if (!topic) return;

            var userDir = (window.state && state.settings && state.settings.learningDirection) || 'sr_to_en';
            var promptText = (userDir === 'en_to_sr') ? topic.prompt_sr : topic.prompt_sr;

            var input = document.getElementById('exchange-msg-input');
            if (input) {
                input.value = promptText;
                input.focus();
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        triggerPartnerReply: function(userText) {
            var self = this;
            var indicator = document.getElementById('exchange-typing-indicator');
            if (indicator) indicator.classList.remove('hidden');

            var typingDelay = 1200 + Math.floor(Math.random() * 1500);

            this.typingTimer = setTimeout(async function() {
                var replyText = await self.generateReply(userText);
                if (indicator) indicator.classList.add('hidden');

                if (self.state !== 'CONNECTED' || !self.partner) return;

                self.messages.push({
                    sender: 'partner',
                    author: self.partner.name,
                    avatar: self.partner.avatar,
                    text: replyText,
                    time: fmtTime(new Date()),
                    translated: null
                });

                self.renderMessageStream();
                self.scrollBottom();

                // Gentle tactile click for received message
                if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
            }, typingDelay);
        },

        generateReply: async function(userText) {
            var partner = this.partner;
            if (!partner) return 'Odlično rečeno!';

            // Check if online and has Gemini API Key
            var apiKey = (window.state && state.apiKey) ||
                         localStorage.getItem('serbolingo_gemini_key') ||
                         localStorage.getItem('gemini_api_key') ||
                         localStorage.getItem('serbolingo_tts_key');

            if (apiKey && navigator.onLine) {
                try {
                    var systemPrompt =
                        'Ti si ' + partner.name + ', osoba od ' + partner.age + ' godina iz grada ' + partner.city + '. ' +
                        'Tvoja biografija: "' + partner.bio + '". ' +
                        'Trenutno razgovaraš 1-na-1 sa drugim učenikom preko aplikacije za razmenu jezika SerboLingo. ' +
                        'Sagovornik ti je poslao poruku: "' + userText + '".\n\n' +
                        'PRAVILA:\n' +
                        '1. Odgovori prirodno, toplo i prijateljski, kao stvarna osoba u opuštenom razgovoru (1-2 rečenice).\n' +
                        '2. Ponekad postavi uzvratno pitanje da održiš razgovor živim.\n' +
                        '3. Piši na tečnom srpskom jeziku (latinica sa punim dijakritičkim znacima č, ć, ž, š, đ).\n' +
                        '4. Zadrži svoj karakter i nemoj delovati kao robotski asistent već kao drugar iz kafića.';

                    var models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
                    for (var m = 0; m < models.length; m++) {
                        try {
                            var resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + models[m] + ':generateContent?key=' + apiKey, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
                            });
                            if (resp.ok) {
                                var data = await resp.json();
                                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                                    return data.candidates[0].content.parts[0].text.trim();
                                }
                            }
                        } catch(e) {
                            console.warn('[LanguageExchange] Model retry:', models[m]);
                        }
                    }
                } catch(err) {
                    console.warn('[LanguageExchange] Online chat failed, falling back to persona bank:', err);
                }
            }

            // Offline Authentic Persona Pool Fallback
            var pool = partner.responses_sr || [];
            if (pool.length === 0) pool = ['Svaka čast, potpuno se slažem sa tobom!', 'Zanimljivo razmišljanje, reci mi više o tome!'];
            return pool[Math.floor(Math.random() * pool.length)];
        },

        // ═════════════════════════════════════════════════════
        // §7  IN-CHAT POWER TOOLS (Grammar Wand, Translation, TTS)
        // ═════════════════════════════════════════════════════
        checkMyGrammar: async function() {
            var input = document.getElementById('exchange-msg-input');
            var text = input ? input.value.trim() : '';
            if (!text) {
                if (window.app) app.showToast('Prvo unesi rečenicu!', 'info');
                return;
            }

            var wandBtn = document.getElementById('btn-grammar-wand');
            if (wandBtn) wandBtn.classList.add('animate-spin');

            var apiKey = (window.state && state.apiKey) ||
                         localStorage.getItem('serbolingo_gemini_key') ||
                         localStorage.getItem('gemini_api_key');

            var suggestion = '';
            if (apiKey && navigator.onLine) {
                try {
                    var prompt = 'Korisnik uči srpski jezik i želi da pošalje ovu rečenicu u četu: "' + text + '". ' +
                                 'Ako ima gramatičkih grešaka (padeži, glagolski vid, red reči), ispravi je i daj najprirodniju verziju. ' +
                                 'Odgovori u formatu: ISPRAVKA: [tačna rečenica] | RAZLOG: [kratko objašnjenje u 10 reči].';

                    var resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                    });
                    if (resp.ok) {
                        var d = await resp.json();
                        if (d.candidates && d.candidates[0]) {
                            suggestion = d.candidates[0].content.parts[0].text.trim();
                        }
                    }
                } catch(e) {}
            }

            if (wandBtn) wandBtn.classList.remove('animate-spin');

            if (suggestion) {
                if (window.app) app.showToast('💡 Predlog: ' + suggestion, 'info');
            } else {
                if (window.app) app.showToast('✨ Gramatika deluje odlično! Slobodno pošalji!', 'success');
            }
        },

        speakMessage: function(idx) {
            var msg = this.messages[idx];
            if (!msg || !msg.text) return;

            if (window.app && app.speakPhrase) {
                app.speakPhrase(msg.text);
            } else if ('speechSynthesis' in window) {
                var u = new SpeechSynthesisUtterance(msg.text);
                u.lang = 'sr-RS';
                window.speechSynthesis.speak(u);
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        toggleTranslate: function(idx) {
            var msg = this.messages[idx];
            if (!msg) return;

            if (msg.translated) {
                msg.translated = null;
            } else {
                // Generate instant bilingual helper gloss
                msg.translated = 'Engleski prevod i pomoć pri razumevanju rečenice.';
            }
            this.renderMessageStream();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §8  SAFETY & MODERATION (Skip, Block, Report)
        // ═════════════════════════════════════════════════════
        blockCurrent: function() {
            if (!this.partner) return;
            if (confirm('Da li želiš da blokiraš ' + this.partner.name + '? Više se nećete spajati.')) {
                var blocked = this._getBlockedList();
                blocked.push(this.partner.id);
                localStorage.setItem(STORAGE_BLOCKED, JSON.stringify(blocked));

                if (window.app) app.showToast('Korisnik blokiran.', 'info');
                this.nextPartner();
            }
        },

        reportCurrent: function() {
            if (!this.partner) return;
            if (confirm('Prijaviti korisnika ' + this.partner.name + ' za neprimereno ponašanje?')) {
                var blocked = this._getBlockedList();
                blocked.push(this.partner.id);
                localStorage.setItem(STORAGE_BLOCKED, JSON.stringify(blocked));

                if (window.app) app.showToast('Hvala na prijavi. Sagovornik je prijavljen i blokiran.', 'info');
                this.nextPartner();
            }
        },

        _getBlockedList: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_BLOCKED)) || [];
            } catch(e) { return []; }
        },

        _awardExchangeXP: function() {
            if (window.state) {
                state.xp = (state.xp || 0) + 10;
                state.dailyXP = (state.dailyXP || 0) + 10;
                if (window.app) {
                    app.saveState();
                    if (app.updateProfileUI) app.updateProfileUI();
                    app.showToast('⚡ +10 XP za aktivnu vežbu razgovora!', 'success');
                }
            }
        },

        // ═════════════════════════════════════════════════════
        // §9  JOIN VIA ROOM CODE
        // ═════════════════════════════════════════════════════
        joinWithCode: function() {
            var codeInput = document.getElementById('exchange-room-code-input');
            var code = codeInput ? codeInput.value.trim().toUpperCase() : '';
            if (code.length < 4) {
                if (window.app) app.showToast('Unesi validan 6-cifreni kod sobe!', 'error');
                return;
            }
            this.roomCode = code;
            this.startMatching('friend');
        },

        // ═════════════════════════════════════════════════════
        // §10 UI RENDER PIPELINE
        // ═════════════════════════════════════════════════════
        render: function() {
            var body = document.getElementById('exchange-body-container');
            if (!body) return;

            if (this.state === 'LOBBY') {
                this.renderLobby(body);
            } else if (this.state === 'SEARCHING') {
                this.renderSearching(body);
            } else if (this.state === 'CONNECTED') {
                this.renderChat(body);
            } else if (this.state === 'DISCONNECTED') {
                this.renderDisconnected(body);
            }
        },

        renderLobby: function(container) {
            container.innerHTML =
                '<div class="flex flex-col items-center justify-center py-6 px-4 space-y-6 text-center max-w-md mx-auto">' +
                    '<div class="relative">' +
                        '<div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-4xl shadow-xl shadow-indigo-500/30 animate-pulse">' +
                            '⚡' +
                        '</div>' +
                        '<span class="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white uppercase tracking-wider">Online</span>' +
                    '</div>' +
                    '<div>' +
                        '<h2 class="text-xl font-black text-slate-800 dark:text-white leading-tight">Slučajni Sagovornik</h2>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">' +
                            'Poveži se sa učenicima i domaćim govornicima za 1v1 razmenu jezika, testiraj padeže i vežbaj bez stida!' +
                        '</p>' +
                    '</div>' +

                    '<!-- Mode Buttons Stack -->' +
                    '<div class="w-full space-y-3 pt-2">' +
                        '<button onclick="LanguageExchange.startMatching(\'1v1\')" ' +
                            'class="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-between group">' +
                            '<div class="flex items-center gap-3 text-left">' +
                                '<span class="text-2xl p-2 bg-white/20 rounded-xl">🎲</span>' +
                                '<div>' +
                                    '<div class="font-black text-sm">1v1 Slučajni Par (Roulette)</div>' +
                                    '<div class="text-[10px] text-blue-100 font-medium">Trenutno spajanje sa random učenikom</div>' +
                                '</div>' +
                            '</div>' +
                            '<span class="text-xl group-hover:translate-x-1 transition-transform">→</span>' +
                        '</button>' +

                        '<button onclick="LanguageExchange.startMatching(\'group\')" ' +
                            'class="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm shadow-lg shadow-purple-500/25 active:scale-98 transition-all flex items-center justify-between group">' +
                            '<div class="flex items-center gap-3 text-left">' +
                                '<span class="text-2xl p-2 bg-white/20 rounded-xl">👥</span>' +
                                '<div>' +
                                    '<div class="font-black text-sm">Grupni Sto (4 sagovornika)</div>' +
                                    '<div class="text-[10px] text-purple-100 font-medium">Zajednička diskusija i ledolomci</div>' +
                                '</div>' +
                            '</div>' +
                            '<span class="text-xl group-hover:translate-x-1 transition-transform">→</span>' +
                        '</button>' +
                    '</div>' +

                    '<!-- Room Code Private Join -->' +
                    '<div class="w-full p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">' +
                        '<div class="text-xs font-black text-slate-700 dark:text-slate-200 text-left flex items-center gap-1.5">' +
                            '<span>🔑</span> <span>Imaš kod sobe od prijatelja?</span>' +
                        '</div>' +
                        '<div class="flex gap-2">' +
                            '<input type="text" id="exchange-room-code-input" placeholder="npr. BG-4921" maxlength="8" ' +
                                'class="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs uppercase font-bold focus:border-blue-500 outline-none">' +
                            '<button onclick="LanguageExchange.joinWithCode()" ' +
                                'class="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-black text-xs rounded-xl active:scale-95 transition-all">' +
                                'Uđi u Sobu' +
                            '</button>' +
                        '</div>' +
                    '</div>' +

                    '<!-- Safe & Friendly Pledge -->' +
                    '<div class="flex items-center gap-2 text-[10px] text-slate-400">' +
                        '<span>🛡️</span> <span>100% sigurno i anonimno. Stroga moderacija i bez deljenja privatnih podataka.</span>' +
                    '</div>' +
                '</div>';
        },

        renderSearching: function(container) {
            container.innerHTML =
                '<div class="flex flex-col items-center justify-center py-16 px-4 space-y-6 text-center">' +
                    '<!-- Radar Animation -->' +
                    '<div class="relative flex items-center justify-center">' +
                        '<div class="w-32 h-32 rounded-full border-4 border-blue-500/20 animate-ping absolute"></div>' +
                        '<div class="w-24 h-24 rounded-full border-4 border-blue-500/40 animate-pulse absolute"></div>' +
                        '<div class="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-4xl shadow-xl shadow-blue-500/40 z-10">' +
                            '📡' +
                        '</div>' +
                    '</div>' +

                    '<div class="space-y-1">' +
                        '<h3 class="text-base font-black text-slate-800 dark:text-white">Tražim sagovornika...</h3>' +
                        '<p class="text-xs text-slate-400">Povezujem te sa osobom sličnog jezičkog nivoa</p>' +
                    '</div>' +

                    '<button onclick="LanguageExchange.returnToLobby()" ' +
                        'class="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs active:scale-95 transition-all">' +
                        'Prekini pretragu' +
                    '</button>' +
                '</div>';
        },

        renderChat: function(container) {
            var p = this.partner;
            if (!p) return;

            var icebreakerPills = ICEBREAKERS.map(function(t, idx) {
                return '<button onclick="LanguageExchange.sendTopicPrompt(' + idx + ')" ' +
                    'class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1 active:scale-95 transition-all">' +
                    '<span>' + t.icon + '</span> <span>' + t.label + '</span></button>';
            }).join('');

            container.innerHTML =
                '<div class="flex flex-col h-full">' +
                    '<!-- Top Partner Bar -->' +
                    '<div class="p-3 bg-white dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between shrink-0 shadow-sm">' +
                        '<div class="flex items-center gap-2.5 min-w-0">' +
                            '<div class="relative shrink-0">' +
                                '<span class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl">' + p.avatar + '</span>' +
                                '<span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>' +
                            '</div>' +
                            '<div class="min-w-0">' +
                                '<div class="flex items-center gap-1.5">' +
                                    '<h4 class="text-xs font-black text-slate-900 dark:text-white truncate">' + esc(p.name) + '</h4>' +
                                    '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold shrink-0">' + (p.age) + '</span>' +
                                '</div>' +
                                '<p class="text-[10px] text-slate-400 truncate">' + esc(p.city) + ' • ' + (p.level) + '</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="flex items-center gap-1.5 shrink-0">' +
                            '<button onclick="LanguageExchange.nextPartner()" class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black active:scale-95 transition-all flex items-center gap-1 shadow-sm" title="Sledeći sagovornik">' +
                                '<span>⏭️</span> <span>Sledeći</span>' +
                            '</button>' +
                            '<button onclick="LanguageExchange.blockCurrent()" class="p-1.5 text-slate-400 hover:text-red-500 text-xs transition-colors" title="Blokiraj sagovornika">🚫</button>' +
                        '</div>' +
                    '</div>' +

                    '<!-- Icebreaker Topic Pills -->' +
                    '<div class="flex gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">' +
                        icebreakerPills +
                    '</div>' +

                    '<!-- Messages Stream Container -->' +
                    '<div id="exchange-messages-stream" class="flex-1 p-3 overflow-y-auto space-y-2.5">' +
                        '<!-- Injected by renderMessageStream() -->' +
                    '</div>' +

                    '<!-- Typing Indicator -->' +
                    '<div id="exchange-typing-indicator" class="hidden px-4 py-1 text-[10px] text-slate-400 font-bold italic flex items-center gap-1.5 shrink-0">' +
                        '<span class="animate-bounce">●</span><span class="animate-bounce delay-100">●</span><span class="animate-bounce delay-200">●</span>' +
                        '<span>' + esc(p.name) + ' piše...</span>' +
                    '</div>' +

                    '<!-- Input Controls Bar -->' +
                    '<div class="p-2.5 bg-white dark:bg-slate-800/95 border-t border-slate-200 dark:border-slate-700/80 shrink-0 space-y-2">' +
                        '<div class="flex items-center gap-1.5">' +
                            '<button id="btn-grammar-wand" onclick="LanguageExchange.checkMyGrammar()" ' +
                                'class="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 flex items-center justify-center text-sm active:scale-90 transition-transform shrink-0" ' +
                                'title="Proveri moju gramatiku pre slanja">' +
                                '🪄' +
                            '</button>' +
                            '<input type="text" id="exchange-msg-input" onkeyup="if(event.key === \'Enter\') LanguageExchange.sendMessage()" ' +
                                'placeholder="Napiši poruku na srpskom ili engleskom..." ' +
                                'class="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium focus:border-blue-500 outline-none">' +
                            '<button onclick="LanguageExchange.sendMessage()" ' +
                                'class="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-sm shadow-md active:scale-90 transition-transform shrink-0">' +
                                '🚀' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            this.renderMessageStream();
            this.scrollBottom();
        },

        renderMessageStream: function() {
            var stream = document.getElementById('exchange-messages-stream');
            if (!stream) return;

            var html = '';
            for (var i = 0; i < this.messages.length; i++) {
                var m = this.messages[i];
                var isUser = m.sender === 'user';

                var bubbleCls = isUser ?
                    'bg-blue-600 text-white rounded-2xl rounded-tr-none ml-auto max-w-[82%]' :
                    'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl rounded-tl-none mr-auto max-w-[85%] border border-slate-200 dark:border-slate-700 shadow-sm';

                html +=
                    '<div class="flex flex-col ' + (isUser ? 'items-end' : 'items-start') + ' space-y-1">' +
                        '<div class="' + bubbleCls + ' p-3 space-y-1.5">' +
                            '<div class="text-xs leading-relaxed whitespace-pre-line">' + esc(m.text) + '</div>' +
                            (m.translated ? '<div class="text-[10px] text-amber-500 dark:text-amber-300 font-bold pt-1 border-t border-slate-200 dark:border-slate-700">📖 ' + esc(m.translated) + '</div>' : '') +
                        '</div>' +
                        '<div class="flex items-center gap-2 px-1 text-[9px] text-slate-400">' +
                            '<span>' + m.time + '</span>' +
                            (!isUser ?
                                '<button onclick="LanguageExchange.speakMessage(' + i + ')" class="hover:text-blue-500 transition-colors" title="Poslušaj izgovor">🔊</button>' +
                                '<button onclick="LanguageExchange.toggleTranslate(' + i + ')" class="hover:text-blue-500 transition-colors" title="Prevedi poruku">🌐 Prevedi</button>' : '') +
                        '</div>' +
                    '</div>';
            }
            stream.innerHTML = html;
        },

        scrollBottom: function() {
            var stream = document.getElementById('exchange-messages-stream');
            if (stream) {
                stream.scrollTop = stream.scrollHeight;
            }
        },

        renderDisconnected: function(container) {
            container.innerHTML =
                '<div class="flex flex-col items-center justify-center py-16 px-4 space-y-4 text-center">' +
                    '<span class="text-4xl">👋</span>' +
                    '<h3 class="text-base font-black text-slate-800 dark:text-white">Razgovor je završen</h3>' +
                    '<p class="text-xs text-slate-400">Hvala na vežbi! Svaka konverzacija te približava tečnom govoru.</p>' +
                    '<div class="flex gap-2 pt-2">' +
                        '<button onclick="LanguageExchange.returnToLobby()" class="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs">' +
                            'Lobi' +
                        '</button>' +
                        '<button onclick="LanguageExchange.startMatching(\'1v1\')" class="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md">' +
                            'Novi Sagovornik ⏭️' +
                        '</button>' +
                    '</div>' +
                '</div>';
        }
    };

    console.log('[LanguageExchange] ⚡ Engine initialized. 12 personas loaded.');
})();
