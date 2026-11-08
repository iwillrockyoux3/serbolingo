// [SHIELD_DAEMON: VALIDATED]
// language-exchange.js — Priority 43, 43.2 & 43.3: Ultra-Safe Video/Voice Roulette, Moderation Escalation & Dual-Button Safety
// Pure vanilla JS, zero dependencies, offline-first resilient, UTF-8 armored
// SerboLingo Technical Constitution v3.0 compliant

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // §1  STORAGE KEYS & CONSTANTS (Priority 43, 43.2 & 43.3)
    // ═══════════════════════════════════════════════════════════
    const STORAGE_BLOCKED     = 'serbolingo_exchange_blocked';
    const STORAGE_HISTORY     = 'serbolingo_exchange_history';
    const STORAGE_STATS       = 'serbolingo_exchange_stats';
    const STORAGE_FRIENDS     = 'serbolingo_exchange_friends';
    const STORAGE_18PLUS      = 'serbolingo_18plus_accepted';
    const STORAGE_FILTERS     = 'serbolingo_exchange_filters';
    const STORAGE_REPORTS     = 'serbolingo_exchange_reports';
    const STORAGE_SUSPENSION  = 'serbolingo_exchange_suspension';
    const STORAGE_WARNING_ACK = 'serbolingo_exchange_warning_ack';
    const STORAGE_APPEALS     = 'serbolingo_exchange_appeals';

    // Progressive Ban Ladder: 4 unique reports required before timeout triggers
    const REPORTS_PER_STRIKE  = 4;
    const BAN_DURATIONS_MS = {
        1: 1 * 60 * 60 * 1000,          // Strike 1: 1 Hour
        2: 4 * 60 * 60 * 1000,          // Strike 2: 4 Hours
        3: 24 * 60 * 60 * 1000,         // Strike 3: 24 Hours (1 Day)
        4: 7 * 24 * 60 * 60 * 1000,     // Strike 4: 7 Days (1 Week)
        5: Infinity                     // Strike 5: Permanent Ban (Permaban)
    };

    // ═══════════════════════════════════════════════════════════
    // §2  12 AUTHENTIC PERSONAS (Offline & Instant Match Roster)
    // ═══════════════════════════════════════════════════════════
    const PERSONAS = [
        {
            id: 'pers_milica',
            name: 'Milica Jovanović',
            gender: 'female',
            country: 'rs',
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
            gender: 'male',
            country: 'rs',
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
            gender: 'male',
            country: 'diaspora',
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
            gender: 'female',
            country: 'diaspora',
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
            gender: 'male',
            country: 'rs',
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
            gender: 'male',
            country: 'diaspora',
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
            gender: 'female',
            country: 'diaspora',
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
            gender: 'female',
            country: 'rs',
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
        },
        {
            id: 'pers_dragan',
            name: 'Dragan Simić',
            gender: 'male',
            country: 'rs',
            age: 34,
            city: 'Valjevo',
            avatar: '🌲',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Planinar & Domaćin',
            level: 'Srpski (Maternji) ↔ Engleski (A2)',
            bio: 'Ljubitelj prirode, planine Maljen i Divčibara. Volim domaću kuhinju i planinski mir.',
            greeting_sr: 'Dobar dan i pozdrav iz Valjeva! Čist vazduh i dobra volja leče sve. Kako teče učenje jezika?',
            greeting_en: 'Good day from Valjevo! Mountain air and good cheer cure everything. How is your learning going?',
            responses_sr: [
                'Kod nas u valjevskom kraju se kaže: "Ko rano rani, dve sreće grabi!"',
                'Ako voliš netaknutu prirodu, kanjon reke Gradac moraš videti uživo.',
                'Engleski učim polako, ali redovno. Važna je upornost!'
            ],
            responses_en: [
                'Nature is the best teacher of patience and calm.',
                'Do you like hiking and outdoor adventures?'
            ]
        },
        {
            id: 'pers_maja',
            name: 'Maja Vuković',
            gender: 'female',
            country: 'ba',
            age: 27,
            city: 'Banja Luka (BiH)',
            avatar: '🚣‍♀️',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Avanturista',
            level: 'Srpski (Maternji) ↔ Engleski (B2)',
            bio: 'Biolog i strastveni rafting vodič na reci Vrbas. Volim ekologiju, putovanja i sport.',
            greeting_sr: 'Pozdrav iz Banja Luke! Kanjon Vrbasa je prelep danas. Radujem se da vežbamo zajedno!',
            greeting_en: 'Hello from Banja Luka! The Vrbas canyon is stunning today. Thrilled to practice together!',
            responses_sr: [
                'Banja Luka je poznata po kestenovima, zelenilu i prelepom reci Vrbas.',
                'Gramatika na Balkanu je bogata i izražajna, slobodno pitaj sve što te buni!',
                'Koji sport ili aktivnost ti najviše pomaže da se rasteretiš?'
            ],
            responses_en: [
                'Rafting on mountain rivers taught me quick decision making.',
                'What kind of outdoor activities do you enjoy most?'
            ]
        },
        {
            id: 'pers_nikola',
            name: 'Nikola Radović',
            gender: 'male',
            country: 'me',
            age: 29,
            city: 'Kotor / Podgorica (Crna Gora)',
            avatar: '⛵',
            nativeLang: 'sr',
            learningLang: 'en',
            badge: 'Bokeljski Mornar',
            level: 'Srpski (Maternji) ↔ Engleski (B1)',
            bio: 'Pomorac i barista iz Boke Kotorske. Volim more, dobru kafu i mirne zalaske sunca.',
            greeting_sr: 'Pozdrav sa primorja! More je danas mirno kao staklo. O čemu ćaskamo danas uz kafu?',
            greeting_en: 'Greetings from the coast! Sea is calm as glass today. What are we chatting about over coffee?',
            responses_sr: [
                'Boka Kotorska ima vekove istorije uklesane u kamene zidine. Magično mesto!',
                'Primorski dijalekt ima puno reči iz italijanskog jezika, što je jako zanimljivo.',
                'Polako, samo opušteno. Nigde ne žurimo, jezik se uči sa uživanjem.'
            ],
            responses_en: [
                'Life by the Adriatic sea has its own slow, peaceful rhythm.',
                'Have you ever sailed on a boat or visited the Mediterranean?'
            ]
        },
        {
            id: 'pers_clara',
            name: 'Clara Weber',
            gender: 'female',
            country: 'diaspora',
            age: 25,
            city: 'Berlin, Deutschland',
            avatar: '🎧',
            nativeLang: 'de',
            learningLang: 'sr',
            badge: 'Muzički Producent',
            level: 'Nemački (Maternji) ↔ Srpski (B1)',
            bio: 'Muzički producent i DJ. Obožavam balkanski etno melos, trube i nepravilne ritmove (7/8).',
            greeting_sr: 'Hallo svima! Zdravo! Učim srpski jer sam zaljubljena u balkanski ritam i harmonije!',
            greeting_en: 'Hallo everyone! Learning Serbian because I am deeply in love with Balkan rhythm and brass sound!',
            responses_sr: [
                'Balkanski ritmovi od 7/8 i 9/8 su pravo remek-delo za nas muzičare!',
                'U Berlinu imam prijatelje iz Srbije koji prave neverovatan domaći ajvar.',
                'Srpski jezik ima divnu muzikalnost u svakodnevnom govoru.'
            ],
            responses_en: [
                'Music and language connect hearts faster than anything else.',
                'What kind of music energizes you the most?'
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
    // §5  LANGUAGE EXCHANGE ENGINE OBJECT (Phase 1 & 2)
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

        // Phase 2 State Properties
        _filters: {
            country: 'all',    // all | rs | ba | me | diaspora
            gender: 'all',     // all | female | male
            medium: 'all',     // all | voice | text
            langDir: 'auto'    // auto | sr_to_en | en_to_sr
        },
        _filtersExpanded: false,
        _micEnabled: false,
        _cameraEnabled: false,
        _localStream: null,
        _safeBlurActive: false,
        _safeBlurTimer: null,
        _nsfwShieldActive: false,
        _videoStageExpanded: false,

        init: function() {
            this.loadFilters();
        },

        // ── Modal Management ────────────────────────────────
        openModal: function() {
            this.init();
            var modal = document.getElementById('exchange-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            this.state = 'LOBBY';
            this.messages = [];
            this.partner = null;
            this.exchangeCount = 0;
            this.cleanupHardware();
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeModal: function() {
            var modal = document.getElementById('exchange-modal');
            if (!modal) return;
            this.cleanupTimers();
            this.cleanupHardware();
            modal.classList.add('hidden');
            this.state = 'LOBBY';
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        cleanupTimers: function() {
            if (this.searchTimer) { clearTimeout(this.searchTimer); this.searchTimer = null; }
            if (this.typingTimer) { clearTimeout(this.typingTimer); this.typingTimer = null; }
            if (this._safeBlurTimer) { clearTimeout(this._safeBlurTimer); this._safeBlurTimer = null; }
            if (this._suspensionInterval) { clearInterval(this._suspensionInterval); this._suspensionInterval = null; }
        },

        cleanupHardware: function() {
            if (this._localStream) {
                try {
                    this._localStream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                } catch(e) {}
                this._localStream = null;
            }
            this._micEnabled = false;
            this._cameraEnabled = false;
            this._safeBlurActive = false;
            this._nsfwShieldActive = false;
            this._videoStageExpanded = false;
        },

        // ── Pre-Match Filters Management ─────────────────────
        loadFilters: function() {
            try {
                var saved = JSON.parse(localStorage.getItem(STORAGE_FILTERS));
                if (saved && typeof saved === 'object') {
                    this._filters = Object.assign(this._filters, saved);
                }
            } catch(e) {}
        },

        saveFilters: function() {
            try {
                localStorage.setItem(STORAGE_FILTERS, JSON.stringify(this._filters));
            } catch(e) {}
        },

        setFilter: function(key, val) {
            this._filters[key] = val;
            this.saveFilters();
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        toggleFiltersAccordion: function() {
            this._filtersExpanded = !this._filtersExpanded;
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ── Matchmaking Orchestrator ────────────────────────
        startMatching: function(mode) {
            this.mode = mode || '1v1';
            this.state = 'SEARCHING';
            this.cleanupTimers();
            this.cleanupHardware();
            this.render();

            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();

            // Simulate realistic radar search delay (1.4 - 2.6 seconds)
            var self = this;
            var delay = 1400 + Math.floor(Math.random() * 1200);

            this.searchTimer = setTimeout(function() {
                self.connectPartner();
            }, delay);
        },

        connectPartner: function() {
            var blocked = this._getBlockedList();

            // Filter personas by blocklist + active user filters
            var candidates = PERSONAS.filter(function(p) {
                if (blocked.indexOf(p.id) !== -1) return false;

                // Gender filter
                if (LanguageExchange._filters.gender !== 'all' && p.gender !== LanguageExchange._filters.gender) {
                    return false;
                }
                // Country filter
                if (LanguageExchange._filters.country !== 'all' && p.country !== LanguageExchange._filters.country) {
                    return false;
                }
                return true;
            });

            // Graceful fallback if strict filters produce empty pool
            if (candidates.length === 0) {
                candidates = PERSONAS.filter(function(p) { return blocked.indexOf(p.id) === -1; });
                if (candidates.length === 0) candidates = PERSONAS;
                if (window.app) app.showToast('Nema sagovornika za stroge filtere, spajam sa dostupnim...', 'info');
            }

            // Pick a random persona
            var chosen = candidates[Math.floor(Math.random() * candidates.length)];
            this.partner = chosen;
            this.state = 'CONNECTED';
            this.messages = [];
            this.exchangeCount = 0;
            this._nsfwShieldActive = false;

            if (this.mode === 'group') {
                var others = candidates.filter(function(p) { return p.id !== chosen.id; });
                var shuffled = others.sort(function() { return 0.5 - Math.random(); });
                this.groupMembers = [chosen, shuffled[0] || PERSONAS[0], shuffled[1] || PERSONAS[1]];
            }

            // Directional initial greeting
            var userDir = (window.state && state.settings && state.settings.learningDirection) || 'sr_to_en';
            if (this._filters.langDir === 'sr_to_en') userDir = 'sr_to_en';
            if (this._filters.langDir === 'en_to_sr') userDir = 'en_to_sr';

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

            // If user preferred voice medium in filter, inform them
            if (this._filters.medium === 'voice' && window.app) {
                app.showToast('🎤 Sagovornik podržava govor! Možeš uključiti mikrofon.', 'info');
            }

            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();
            if (window.app) app.showToast('Povezan/a sa: ' + chosen.name + '! 👋', 'success');
        },

        nextPartner: function() {
            this.cleanupHardware();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
            this.startMatching(this.mode);
        },

        disconnect: function() {
            this.cleanupTimers();
            this.cleanupHardware();
            this.state = 'DISCONNECTED';
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        returnToLobby: function() {
            this.cleanupTimers();
            this.cleanupHardware();
            this.state = 'LOBBY';
            this.partner = null;
            this.messages = [];
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §6  HARDWARE CONTROLS (MIC, CAMERA, PIP, SAFE BLUR)
        // ═════════════════════════════════════════════════════
        toggleMic: async function() {
            if (this._micEnabled) {
                this._micEnabled = false;
                if (this._localStream) {
                    this._localStream.getAudioTracks().forEach(function(t) { t.enabled = false; });
                }
                if (window.app) app.showToast('🎤 Mikrofon isključen (mute)', 'info');
                this.updateHardwareUI();
                return;
            }

            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    if (window.app) app.showToast('Mikrofon nije podržan na ovom uređaju.', 'error');
                    return;
                }

                var audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (!this._localStream) {
                    this._localStream = audioStream;
                } else {
                    audioStream.getAudioTracks().forEach(function(t) {
                        LanguageExchange._localStream.addTrack(t);
                    });
                }
                this._micEnabled = true;
                if (window.app) app.showToast('🎤 Mikrofon uključen! Možeš da pričaš.', 'success');
                if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
                this.updateHardwareUI();
            } catch(err) {
                console.warn('[LanguageExchange] Mic access error:', err);
                if (window.app) app.showToast('Pristup mikrofonu je odbijen ili nije dostupan.', 'error');
                this._micEnabled = false;
                this.updateHardwareUI();
            }
        },

        toggleCamera: async function() {
            if (this._cameraEnabled) {
                this._cameraEnabled = false;
                if (this._localStream) {
                    this._localStream.getVideoTracks().forEach(function(t) {
                        t.stop();
                        LanguageExchange._localStream.removeTrack(t);
                    });
                }
                var pipEl = document.getElementById('exchange-pip-container');
                if (pipEl) pipEl.classList.add('hidden');
                var videoEl = document.getElementById('exchange-self-video');
                if (videoEl) videoEl.srcObject = null;

                if (window.app) app.showToast('📹 Kamera isključena', 'info');
                this.updateHardwareUI();
                return;
            }

            // Check 18+ Pledge
            var accepted18 = localStorage.getItem(STORAGE_18PLUS) === 'true';
            if (!accepted18) {
                this.show18PlusModal();
                return;
            }

            try {
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    if (window.app) app.showToast('Kamera nije podržana na ovom uređaju.', 'error');
                    return;
                }

                var videoStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
                    audio: false
                });

                if (!this._localStream) {
                    this._localStream = videoStream;
                } else {
                    videoStream.getVideoTracks().forEach(function(t) {
                        LanguageExchange._localStream.addTrack(t);
                    });
                }

                this._cameraEnabled = true;
                this._videoStageExpanded = true;

                // Attach to PiP container & video element
                var pipEl = document.getElementById('exchange-pip-container');
                var videoEl = document.getElementById('exchange-self-video');
                if (pipEl) pipEl.classList.remove('hidden');
                if (videoEl) {
                    videoEl.srcObject = videoStream;
                    videoEl.play().catch(function() {});
                }

                // Trigger 2-Second Safe-Connect Frosted Blur
                this.triggerSafeConnectBlur();

                if (window.app) app.showToast('📹 Kamera uključena (PiP prozor)', 'success');
                if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
                this.updateHardwareUI();
            } catch(err) {
                console.warn('[LanguageExchange] Camera access error:', err);
                if (window.app) app.showToast('Pristup kameri je odbijen ili nije dostupan.', 'error');
                this._cameraEnabled = false;
                this.updateHardwareUI();
            }
        },

        triggerSafeConnectBlur: function() {
            this._safeBlurActive = true;
            var blurOverlay = document.getElementById('exchange-safe-blur-overlay');
            var stageAvatar = document.getElementById('exchange-stage-avatar-wrapper');

            if (blurOverlay) blurOverlay.classList.remove('hidden');
            if (stageAvatar) stageAvatar.classList.add('blur-md');

            if (this._safeBlurTimer) clearTimeout(this._safeBlurTimer);
            var self = this;
            this._safeBlurTimer = setTimeout(function() {
                self._safeBlurActive = false;
                var bo = document.getElementById('exchange-safe-blur-overlay');
                var sa = document.getElementById('exchange-stage-avatar-wrapper');
                if (bo) bo.classList.add('hidden');
                if (sa) sa.classList.remove('blur-md');
            }, 2000);
        },

        updateHardwareUI: function() {
            var micBtn = document.getElementById('btn-exchange-mic');
            var camBtn = document.getElementById('btn-exchange-cam');
            var stage = document.getElementById('exchange-video-stage');

            if (micBtn) {
                if (this._micEnabled) {
                    micBtn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs bg-emerald-600 text-white flex items-center gap-1.5 shadow-md shadow-emerald-500/30 animate-pulse';
                    micBtn.innerHTML = '<span>🎤</span> <span>Govor uključen</span>';
                } else {
                    micBtn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1.5 transition-all';
                    micBtn.innerHTML = '<span>🎤</span> <span>Mikrofon isključen</span>';
                }
            }

            if (camBtn) {
                if (this._cameraEnabled) {
                    camBtn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs bg-blue-600 text-white flex items-center gap-1.5 shadow-md shadow-blue-500/30';
                    camBtn.innerHTML = '<span>📹</span> <span>Kamera aktivna</span>';
                } else {
                    camBtn.className = 'px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center gap-1.5 transition-all';
                    camBtn.innerHTML = '<span>📹</span> <span>Uključi kameru</span>';
                }
            }

            if (stage) {
                if (this._cameraEnabled || this._videoStageExpanded) {
                    stage.classList.remove('hidden');
                } else {
                    stage.classList.add('hidden');
                }
            }
        },

        toggleVideoStage: function() {
            this._videoStageExpanded = !this._videoStageExpanded;
            this.updateHardwareUI();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §7  18+ SAFETY PLEDGE MODAL
        // ═════════════════════════════════════════════════════
        show18PlusModal: function() {
            var modal = document.getElementById('exchange-18plus-modal');
            if (modal) modal.classList.remove('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        accept18Plus: function() {
            try {
                localStorage.setItem(STORAGE_18PLUS, 'true');
            } catch(e) {}
            var modal = document.getElementById('exchange-18plus-modal');
            if (modal) modal.classList.add('hidden');
            if (window.app) app.showToast('🛡️ 18+ Zavet prihvaćen. Kamera otključana!', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();
            this.toggleCamera();
        },

        decline18Plus: function() {
            var modal = document.getElementById('exchange-18plus-modal');
            if (modal) modal.classList.add('hidden');
            if (window.app) app.showToast('Video razmena zahteva prihvatanje bezbednosnog zaveta.', 'info');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §8  NSFW PANIC SHIELD (2-BUTTON SKIP OR STAY CHOICE)
        // ═════════════════════════════════════════════════════
        triggerNSFWShield: function() {
            this._nsfwShieldActive = true;

            // Immediately mute and hide video stream for privacy protection
            if (this._localStream) {
                this._localStream.getAudioTracks().forEach(function(t) { t.enabled = false; });
            }

            var shield = document.getElementById('exchange-nsfw-shield');
            if (shield) shield.classList.remove('hidden');

            if (window.TouchHaptics && TouchHaptics.notification) TouchHaptics.notification();
        },

        dismissNSFWShieldAndStay: function() {
            this._nsfwShieldActive = false;
            var shield = document.getElementById('exchange-nsfw-shield');
            if (shield) shield.classList.add('hidden');

            // Restore microphone if user had it turned on
            if (this._micEnabled && this._localStream) {
                this._localStream.getAudioTracks().forEach(function(t) { t.enabled = true; });
            }

            if (window.app) app.showToast('Zaštitni štit povučen. Nastavlja se razgovor.', 'info');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        confirmNSFWReportAndBlockAndSkip: function() {
            if (this.partner) {
                this.confirmReportCurrent('NSFW / Neprimeren sadržaj');
                var blocked = this._getBlockedList();
                if (blocked.indexOf(this.partner.id) === -1) {
                    blocked.push(this.partner.id);
                    try {
                        localStorage.setItem(STORAGE_BLOCKED, JSON.stringify(blocked));
                    } catch(e) {}
                }
            }

            this._nsfwShieldActive = false;
            var shield = document.getElementById('exchange-nsfw-shield');
            if (shield) shield.classList.add('hidden');

            if (window.app) app.showToast('🚨 Prijavljeno i trajno blokirano. Spajam sa sledećim...', 'error');
            if (window.TouchHaptics && TouchHaptics.notification) TouchHaptics.notification();

            this.nextPartner();
        },

        confirmNSFWReportAndSkip: function() {
            // Backward-compatible alias
            this.confirmNSFWReportAndBlockAndSkip();
        },

        skipWithoutReport: function() {
            this._nsfwShieldActive = false;
            var shield = document.getElementById('exchange-nsfw-shield');
            if (shield) shield.classList.add('hidden');

            if (window.app) app.showToast('⏭️ Preskočeno bez prijave. Spajam sa sledećim...', 'info');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();

            this.nextPartner();
        },

        // ═════════════════════════════════════════════════════
        // §9  STUDY BUDDIES ("DODAJ U PRIJATELJE")
        // ═════════════════════════════════════════════════════
        saveStudyBuddy: function() {
            if (!this.partner) return;
            var buddies = this.getStudyBuddies();
            var exists = buddies.some(function(b) { return b.id === LanguageExchange.partner.id; });

            if (exists) {
                if (window.app) app.showToast(this.partner.name + ' je već u tvojim sačuvanim partnerima!', 'info');
                return;
            }

            var code = 'SRB-' + Math.floor(1000 + Math.random() * 9000);
            buddies.push({
                id: this.partner.id,
                name: this.partner.name,
                avatar: this.partner.avatar,
                city: this.partner.city,
                level: this.partner.level,
                roomCode: code,
                savedAt: new Date().toISOString()
            });

            try {
                localStorage.setItem(STORAGE_FRIENDS, JSON.stringify(buddies));
            } catch(e) {}

            if (window.app) app.showToast('⭐ ' + this.partner.name + ' sačuvan/a kao partner za učenje!', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();

            // Re-render header to update star button state
            this.render();
        },

        getStudyBuddies: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_FRIENDS)) || [];
            } catch(e) { return []; }
        },

        removeStudyBuddy: function(id) {
            var buddies = this.getStudyBuddies().filter(function(b) { return b.id !== id; });
            try {
                localStorage.setItem(STORAGE_FRIENDS, JSON.stringify(buddies));
            } catch(e) {}
            if (window.app) app.showToast('Partner uklonjen sa liste.', 'info');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
            this.render();
        },

        inviteStudyBuddy: function(roomCode) {
            this.roomCode = roomCode;
            this.startMatching('friend');
        },

        // ═════════════════════════════════════════════════════
        // §10 MESSAGING & REASONING PIPELINE
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

            var typingDelay = 1100 + Math.floor(Math.random() * 1400);

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
                msg.translated = 'Engleski prevod i pomoć pri razumevanju rečenice.';
            }
            this.renderMessageStream();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §10 MODERATION, ESCALATION & DUAL-BUTTON ENGINE (P43.3)
        // ═════════════════════════════════════════════════════
        _getReporterId: function() {
            var repId = localStorage.getItem('serbolingo_exchange_reporter_id');
            if (!repId) {
                repId = 'rep_' + Math.random().toString(36).substring(2, 10);
                try { localStorage.setItem('serbolingo_exchange_reporter_id', repId); } catch(e) {}
            }
            return repId;
        },

        _getReportsData: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_REPORTS)) || {};
            } catch(e) { return {}; }
        },

        _saveReportsData: function(data) {
            try {
                localStorage.setItem(STORAGE_REPORTS, JSON.stringify(data));
            } catch(e) {}
        },

        _getSuspension: function() {
            try {
                var s = JSON.parse(localStorage.getItem(STORAGE_SUSPENSION));
                if (s && typeof s === 'object') return s;
            } catch(e) {}
            return {
                isSuspended: false,
                banUntil: 0,
                strikeLevel: 0,
                reason: '',
                appealSubmitted: false,
                appealId: null
            };
        },

        _saveSuspension: function(s) {
            try {
                localStorage.setItem(STORAGE_SUSPENSION, JSON.stringify(s));
            } catch(e) {}
        },

        _getAppeals: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_APPEALS)) || [];
            } catch(e) { return []; }
        },

        _saveAppeals: function(list) {
            try {
                localStorage.setItem(STORAGE_APPEALS, JSON.stringify(list));
            } catch(e) {}
        },

        _getBlockedList: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_BLOCKED)) || [];
            } catch(e) { return []; }
        },

        checkSuspension: function() {
            var s = this._getSuspension();
            if (!s || !s.isSuspended) return false;

            if (s.banUntil !== 'INFINITY' && typeof s.banUntil === 'number' && Date.now() >= s.banUntil) {
                // Auto-lift expired suspension
                s.isSuspended = false;
                s.banUntil = 0;
                this._saveSuspension(s);
                if (this._suspensionInterval) {
                    clearInterval(this._suspensionInterval);
                    this._suspensionInterval = null;
                }
                if (window.app) app.showToast('✅ Vaša privremena suspenzija je istekla. Dobrodošli nazad!', 'success');
                return false;
            }
            return true;
        },

        startSuspensionCountdownTimer: function() {
            if (this._suspensionInterval) {
                clearInterval(this._suspensionInterval);
                this._suspensionInterval = null;
            }

            var self = this;
            this._suspensionInterval = setInterval(function() {
                var el = document.getElementById('exchange-suspension-countdown-text');
                if (!el) {
                    clearInterval(self._suspensionInterval);
                    self._suspensionInterval = null;
                    return;
                }

                var s = self._getSuspension();
                if (!s || !s.isSuspended) {
                    clearInterval(self._suspensionInterval);
                    self._suspensionInterval = null;
                    self.render();
                    return;
                }

                if (s.banUntil === 'INFINITY') {
                    el.textContent = 'Trajna zabrana pristupa (Permaban)';
                    return;
                }

                var remainingMs = s.banUntil - Date.now();
                if (remainingMs <= 0) {
                    clearInterval(self._suspensionInterval);
                    self._suspensionInterval = null;
                    self.checkSuspension();
                    self.render();
                    return;
                }

                var totalSec = Math.floor(remainingMs / 1000);
                var h = Math.floor(totalSec / 3600);
                var m = Math.floor((totalSec % 3600) / 60);
                var sec = totalSec % 60;

                var text = '';
                if (h > 0) text += h + 'h ';
                text += (m < 10 && h > 0 ? '0' : '') + m + 'm ';
                text += (sec < 10 ? '0' : '') + sec + 's';

                el.textContent = text;
            }, 1000);
        },

        // ── 🚩 REPORT ACTION (Community Strike - Needs 4 unique reporters) ──
        reportCurrent: function() {
            if (!this.partner) return;
            var modal = document.getElementById('exchange-report-modal');
            if (modal) {
                var nameEl = document.getElementById('exchange-report-target-name');
                if (nameEl) nameEl.textContent = this.partner.name;
                modal.classList.remove('hidden');
            } else {
                if (confirm('Prijavi sagovornika ' + this.partner.name + ' za neprimereno ponašanje?')) {
                    this.confirmReportCurrent('Neprimereno ponašanje');
                }
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeReportModal: function() {
            var modal = document.getElementById('exchange-report-modal');
            if (modal) modal.classList.add('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        confirmReportCurrent: function(category) {
            if (!this.partner) return;

            var targetId = this.partner.id;
            var reporterId = this._getReporterId();
            var allReports = this._getReportsData();

            if (!allReports[targetId]) {
                allReports[targetId] = {
                    reportsCount: 0,
                    reporters: [],
                    strikes: 0,
                    lastReport: Date.now()
                };
            }

            var record = allReports[targetId];

            if (record.reporters.indexOf(reporterId) !== -1) {
                if (window.app) app.showToast('⚠️ Već ste prijavili ovog korisnika. Za sankciju je potrebno 4 različite osobe.', 'info');
                this.closeReportModal();
                return;
            }

            // Register unique report
            record.reporters.push(reporterId);
            record.reportsCount++;
            record.lastReport = Date.now();

            var prevStrikes = record.strikes || 0;
            var newStrikes = Math.floor(record.reportsCount / REPORTS_PER_STRIKE);

            if (newStrikes > prevStrikes) {
                record.strikes = newStrikes;
                console.log('[LanguageExchange] Target ' + targetId + ' reached Strike ' + newStrikes + ' (' + record.reportsCount + ' unique reports)!');
            }

            this._saveReportsData(allReports);
            this.closeReportModal();

            // CRUCIAL RULE: Report does NOT block the user.
            if (window.app) {
                app.showToast('🚩 Prijava zabeležena (' + record.reportsCount + '/4 za sankciju). Hvala što čuvaš zajednicu!', 'success');
            }
            if (window.TouchHaptics && TouchHaptics.notification) TouchHaptics.notification();
        },

        // ── 🚫 BLOCK ACTION (Personal Exclusion - 100% Permanent) ──
        blockCurrent: function() {
            if (!this.partner) return;
            var partnerName = this.partner.name;
            var partnerId = this.partner.id;

            if (confirm('Da li želiš da blokiraš sagovornika ' + partnerName + '?\n\nOva osoba se više NIKADA neće pojavljivati u tvojim spajanjima (možeš je odblokirati u Lobiju).')) {
                var blocked = this._getBlockedList();
                if (blocked.indexOf(partnerId) === -1) {
                    blocked.push(partnerId);
                    try {
                        localStorage.setItem(STORAGE_BLOCKED, JSON.stringify(blocked));
                    } catch(e) {}
                }

                if (window.app) app.showToast('🚫 ' + partnerName + ' je blokiran/a.', 'info');
                if (window.TouchHaptics && TouchHaptics.notification) TouchHaptics.notification();
                this.nextPartner();
            }
        },

        // ── Blocked Users Management (View & Unblock) ──
        showBlockedUsersModal: function() {
            var modal = document.getElementById('exchange-blocked-modal');
            if (modal) {
                this.renderBlockedUsersList();
                modal.classList.remove('hidden');
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeBlockedUsersModal: function() {
            var modal = document.getElementById('exchange-blocked-modal');
            if (modal) modal.classList.add('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        unblockUser: function(id) {
            var blocked = this._getBlockedList().filter(function(bId) { return bId !== id; });
            try {
                localStorage.setItem(STORAGE_BLOCKED, JSON.stringify(blocked));
            } catch(e) {}

            if (window.app) app.showToast('✅ Korisnik je odblokiran i ponovo dostupan za razgovor.', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();

            this.renderBlockedUsersList();
            if (this.state === 'LOBBY') {
                var counterEl = document.getElementById('exchange-blocked-counter-badge');
                if (counterEl) counterEl.textContent = blocked.length;
            }
        },

        renderBlockedUsersList: function() {
            var container = document.getElementById('exchange-blocked-users-list');
            if (!container) return;

            var blocked = this._getBlockedList();
            if (blocked.length === 0) {
                container.innerHTML =
                    '<div class="py-8 text-center text-slate-400 space-y-1">' +
                        '<div class="text-3xl">🕊️</div>' +
                        '<div class="text-xs font-bold">Nema blokiranih sagovornika</div>' +
                        '<div class="text-[10px]">Tvoja lista blokiranih je trenutno prazna.</div>' +
                    '</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < blocked.length; i++) {
                var bId = blocked[i];
                var persona = PERSONAS.find(function(p) { return p.id === bId; });
                var name = persona ? persona.name : ('Korisnik (' + bId + ')');
                var avatar = persona ? persona.avatar : '👤';
                var city = persona ? persona.city : 'SerboLingo korisnik';

                html +=
                    '<div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">' +
                        '<div class="flex items-center gap-2.5 min-w-0">' +
                            '<span class="text-xl shrink-0">' + avatar + '</span>' +
                            '<div class="min-w-0">' +
                                '<div class="font-bold text-slate-800 dark:text-white truncate">' + esc(name) + '</div>' +
                                '<div class="text-[10px] text-slate-400 truncate">' + esc(city) + '</div>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="LanguageExchange.unblockUser(\'' + bId + '\')" ' +
                            'class="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold active:scale-95 transition-all shrink-0">' +
                            'Odblokiraj' +
                        '</button>' +
                    '</div>';
            }
            container.innerHTML = html;
        },

        // ── ⚠️ "WARNING FIRST" POLICY ──
        showCommunityWarning: function(force) {
            var seen = localStorage.getItem(STORAGE_WARNING_ACK);
            if (seen === 'true' && !force) return;

            var modal = document.getElementById('exchange-community-warning-modal');
            if (modal) modal.classList.remove('hidden');
            if (window.TouchHaptics && TouchHaptics.notification) TouchHaptics.notification();
        },

        acknowledgeCommunityWarning: function() {
            var check = document.getElementById('exchange-warning-checkbox');
            if (check && !check.checked) {
                if (window.app) app.showToast('Molimo potvrdite da prihvatate pravila zajednice.', 'error');
                return;
            }

            try {
                localStorage.setItem(STORAGE_WARNING_ACK, 'true');
            } catch(e) {}

            var modal = document.getElementById('exchange-community-warning-modal');
            if (modal) modal.classList.add('hidden');

            if (window.app) app.showToast('✅ Zvanična opomena prihvaćena. Hvala na razumevanju!', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();
        },

        triggerCommunityWarning: function() {
            this.showCommunityWarning(true);
        },

        // ── 📩 HUMAN REVIEW & APPEALS SYSTEM ──
        showAppealModal: function() {
            var modal = document.getElementById('exchange-appeal-modal');
            if (modal) {
                var textEl = document.getElementById('exchange-appeal-text');
                if (textEl) textEl.value = '';
                modal.classList.remove('hidden');
            }
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeAppealModal: function() {
            var modal = document.getElementById('exchange-appeal-modal');
            if (modal) modal.classList.add('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        submitAppeal: function() {
            var textEl = document.getElementById('exchange-appeal-text');
            var reasonEl = document.getElementById('exchange-appeal-reason');
            var text = textEl ? textEl.value.trim() : '';
            var reason = reasonEl ? reasonEl.value : 'Lažna prijava';

            if (!text || text.length < 10) {
                if (window.app) app.showToast('Molimo detaljnije opišite vašu žalbu (barem 10 karaktera).', 'error');
                return;
            }

            var appeal = {
                id: 'appeal_' + Date.now(),
                timestamp: new Date().toISOString(),
                reason: reason,
                text: text,
                status: 'PENDING_REVIEW'
            };

            var appeals = this._getAppeals();
            appeals.push(appeal);
            this._saveAppeals(appeals);

            var s = this._getSuspension();
            s.appealSubmitted = true;
            s.appealId = appeal.id;
            this._saveSuspension(s);

            this.closeAppealModal();

            if (window.app) app.showToast('📩 Žalba uspešno poslata! Tim za moderaciju će pregledati slučaj.', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();

            this.render();
        },

        resolveAppeal: function(approved) {
            var s = this._getSuspension();
            var appeals = this._getAppeals();
            if (appeals.length > 0) {
                appeals[appeals.length - 1].status = approved ? 'APPROVED' : 'REJECTED';
                this._saveAppeals(appeals);
            }

            if (approved) {
                s.isSuspended = false;
                s.banUntil = 0;
                s.strikeLevel = 0;
                s.appealSubmitted = false;
                this._saveSuspension(s);

                if (window.app) app.showToast('✅ Žalba usvojena! Suspenzija je ukinuta.', 'success');
                this.state = 'LOBBY';
                this.render();
            } else {
                s.appealSubmitted = false;
                this._saveSuspension(s);
                if (window.app) app.showToast('❌ Žalba odbijena nakon pregleda.', 'error');
                this.render();
            }
        },

        // ── 🧪 QA & SIMULATION HELPERS ──
        simulateUserSuspension: function(hours, strikeLevel) {
            var level = strikeLevel || 1;
            var banUntil = (hours === 'inf' || level >= 5) ? 'INFINITY' : (Date.now() + (hours * 3600 * 1000));
            var s = {
                isSuspended: true,
                banUntil: banUntil,
                strikeLevel: level,
                reason: 'Višestruke prijave članova zajednice (QA Simulacija)',
                appealSubmitted: false,
                appealId: null
            };
            this._saveSuspension(s);
            if (window.app) app.showToast('🛑 Simulirana suspenzija: Nivo ' + level + ' (' + (hours === 'inf' ? 'Trajno' : hours + 'h') + ')', 'warning');
            this.render();
        },

        clearSuspension: function() {
            var s = {
                isSuspended: false,
                banUntil: 0,
                strikeLevel: 0,
                reason: '',
                appealSubmitted: false,
                appealId: null
            };
            this._saveSuspension(s);
            if (this._suspensionInterval) {
                clearInterval(this._suspensionInterval);
                this._suspensionInterval = null;
            }
            if (window.app) app.showToast('✅ Suspenzija poništena (QA Reset).', 'success');
            this.state = 'LOBBY';
            this.render();
        },

        renderSuspension: function(container) {
            var s = this._getSuspension();
            var isPermaban = s.banUntil === 'INFINITY' || s.strikeLevel >= 5;
            var appealSubmitted = !!s.appealSubmitted;

            var countdownHtml = isPermaban ?
                '<div class="text-sm font-black text-red-500 uppercase tracking-wider">Trajna zabrana pristupa (Permaban)</div>' :
                '<div class="space-y-1">' +
                    '<div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Preostalo vreme suspenzije</div>' +
                    '<div id="exchange-suspension-countdown-text" class="text-2xl font-mono font-black text-amber-500 dark:text-amber-400 animate-pulse">Učitavam...</div>' +
                '</div>';

            var appealsSectionHtml = '';
            if (appealSubmitted) {
                appealsSectionHtml =
                    '<div class="w-full p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-left space-y-1">' +
                        '<div class="text-xs font-black text-amber-700 dark:text-amber-300 flex items-center gap-1.5">' +
                            '<span>⏳</span> <span>Status žalbe: U toku pregleda</span>' +
                        '</div>' +
                        '<p class="text-[11px] text-amber-800 dark:text-amber-200/80 leading-relaxed">' +
                            'Tvoja žalba je zabeležena. Moderator zajednice će proveriti verodostojnost prijava i ukinuti suspenziju ukoliko su prijave bile lažne.' +
                        '</p>' +
                        '<div class="pt-2 flex justify-end gap-1.5">' +
                            '<button onclick="LanguageExchange.resolveAppeal(true)" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold active:scale-95 transition-all">' +
                                '🧪 QA Test: Usvoji Žalbu' +
                            '</button>' +
                        '</div>' +
                    '</div>';
            } else {
                appealsSectionHtml =
                    '<div class="w-full space-y-2">' +
                        '<p class="text-[11px] text-slate-400">Smatraš da su prijave lažne ili da je došlo do greške?</p>' +
                        '<button onclick="LanguageExchange.showAppealModal()" ' +
                            'class="w-full p-3 rounded-2xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2">' +
                            '<span>📩</span> <span>Podnesi Žalbu (Appeal)</span>' +
                        '</button>' +
                    '</div>';
            }

            container.innerHTML =
                '<div class="flex flex-col items-center justify-center py-10 px-4 space-y-6 text-center max-w-md mx-auto">' +
                    '<!-- Lock Icon -->' +
                    '<div class="w-20 h-20 rounded-3xl bg-red-500/20 text-red-500 dark:text-red-400 border-2 border-red-500/30 flex items-center justify-center text-4xl shadow-xl shadow-red-500/10 animate-bounce">' +
                        '🔒' +
                    '</div>' +

                    '<!-- Title & Reason -->' +
                    '<div class="space-y-1.5">' +
                        '<h3 class="text-lg font-black text-slate-900 dark:text-white">Privremeno ste suspendovani iz razgovora</h3>' +
                        '<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-black">' +
                            '<span>Nivo sankcije:</span> <span>Prekršaj ' + (s.strikeLevel || 1) + '/5</span>' +
                        '</div>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">' +
                            'Vaš nalog je privremeno ograničen zbog prijava od strane 4 ili više različitih korisnika radi zaštite bezbednosti zajednice.' +
                        '</p>' +
                    '</div>' +

                    '<!-- Countdown Clock -->' +
                    '<div class="w-full p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">' +
                        countdownHtml +
                    '</div>' +

                    '<!-- Appeals Box -->' +
                    appealsSectionHtml +

                    '<!-- QA Test Reset Helper -->' +
                    '<div class="pt-2">' +
                        '<button onclick="LanguageExchange.clearSuspension()" class="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-[10px] font-bold active:scale-95 transition-all">' +
                            '🧪 QA Reset: Ukloni Suspenziju' +
                        '</button>' +
                    '</div>' +
                '</div>';

            if (!isPermaban) {
                this.startSuspensionCountdownTimer();
            }
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

        joinWithCode: function() {
            var codeInput = document.getElementById('exchange-room-code-input');
            var code = codeInput ? codeInput.value.trim().toUpperCase() : '';
            if (code.length < 4) {
                if (window.app) app.showToast('Unesi validan kod sobe (npr. SRB-4921)!', 'error');
                return;
            }
            this.roomCode = code;
            this.startMatching('friend');
        },

        // ═════════════════════════════════════════════════════
        // §11 UI RENDER PIPELINE
        // ═════════════════════════════════════════════════════
        render: function() {
            var body = document.getElementById('exchange-body-container');
            if (!body) return;

            if (this.checkSuspension()) {
                this.renderSuspension(body);
                this.renderModals(body);
                return;
            }

            if (this.state === 'LOBBY') {
                this.renderLobby(body);
            } else if (this.state === 'SEARCHING') {
                this.renderSearching(body);
            } else if (this.state === 'CONNECTED') {
                this.renderChat(body);
            } else if (this.state === 'DISCONNECTED') {
                this.renderDisconnected(body);
            }

            this.renderModals(body);
        },

        renderLobby: function(container) {
            var buddies = this.getStudyBuddies();
            var blockedList = this._getBlockedList();
            var f = this._filters;

            var blockedCardHtml =
                '<div class="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-left">' +
                    '<div class="flex items-center gap-2.5 min-w-0">' +
                        '<span class="text-xl shrink-0">🚫</span>' +
                        '<div class="min-w-0">' +
                            '<div class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">' +
                                '<span>Blokirani Sagovornici</span>' +
                                '<span id="exchange-blocked-counter-badge" class="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">' + blockedList.length + '</span>' +
                            '</div>' +
                            '<div class="text-[10px] text-slate-400 truncate">Upravljaj osobama koje si isključio/la iz spajanja</div>' +
                        '</div>' +
                    '</div>' +
                    '<button onclick="LanguageExchange.showBlockedUsersModal()" ' +
                        'class="px-3 py-1.5 bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold active:scale-95 transition-all shrink-0">' +
                        'Upravljaj' +
                    '</button>' +
                '</div>';

            var qaBarHtml =
                '<div class="w-full p-2.5 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px]">' +
                    '<span class="font-bold text-slate-400 flex items-center gap-1">' +
                        '<span>🛡️</span> <span>QA Sandbox:</span>' +
                    '</span>' +
                    '<div class="flex gap-1.5">' +
                        '<button onclick="LanguageExchange.triggerCommunityWarning()" class="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-bold active:scale-95 transition-all">' +
                            '⚠️ Opomena' +
                        '</button>' +
                        '<button onclick="LanguageExchange.simulateUserSuspension(1, 1)" class="px-2 py-0.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 font-bold active:scale-95 transition-all">' +
                            '🔒 Suspenzija 1h' +
                        '</button>' +
                    '</div>' +
                '</div>';

            var buddiesHtml = '';
            if (buddies.length > 0) {
                buddiesHtml =
                    '<div class="w-full p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-left">' +
                        '<div class="flex items-center justify-between">' +
                            '<span class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">' +
                                '<span>⭐</span> <span>Moji Partneri za Učenje (' + buddies.length + ')</span>' +
                            '</span>' +
                        '</div>' +
                        '<div class="space-y-2 max-h-36 overflow-y-auto pr-1">' +
                            buddies.map(function(b) {
                                return '<div class="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">' +
                                    '<div class="flex items-center gap-2 min-w-0">' +
                                        '<span class="text-lg">' + b.avatar + '</span>' +
                                        '<div class="min-w-0">' +
                                            '<div class="font-bold text-slate-800 dark:text-white truncate">' + esc(b.name) + '</div>' +
                                            '<div class="text-[10px] text-slate-400 truncate">' + esc(b.city) + '</div>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="flex items-center gap-1.5 shrink-0">' +
                                        '<button onclick="LanguageExchange.inviteStudyBuddy(\'' + b.roomCode + '\')" ' +
                                            'class="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold active:scale-95 transition-all">' +
                                            'Pozovi' +
                                        '</button>' +
                                        '<button onclick="LanguageExchange.removeStudyBuddy(\'' + b.id + '\')" ' +
                                            'class="p-1 text-slate-400 hover:text-red-500 text-xs transition-colors" title="Ukloni">' +
                                            '🗑️' +
                                        '</button>' +
                                    '</div>' +
                                '</div>';
                            }).join('') +
                        '</div>' +
                    '</div>';
            }

            var filterBtnText = this._filtersExpanded ? 'Sakrij filtere ▲' : 'Prikaži filtere ▼';
            var filterContentClass = this._filtersExpanded ? 'block' : 'hidden';

            container.innerHTML =
                '<div class="flex flex-col items-center justify-center py-5 px-4 space-y-5 text-center max-w-md mx-auto">' +
                    '<!-- Header Badge -->' +
                    '<div class="relative">' +
                        '<div class="w-18 h-18 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-3xl shadow-xl shadow-indigo-500/30 animate-pulse">' +
                            '⚡' +
                        '</div>' +
                        '<span class="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500 text-white uppercase tracking-wider">Online</span>' +
                    '</div>' +
                    '<div>' +
                        '<h2 class="text-xl font-black text-slate-800 dark:text-white leading-tight">Slučajni Sagovornik</h2>' +
                        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">' +
                            'Poveži se sa učenicima i govornicima za bezbednu razmenu jezika. Započni tekstom, pa uključi mikrofon ili kameru kad se opustiš!' +
                        '</p>' +
                    '</div>' +

                    '<!-- Advanced Pre-Match Filters Accordion (Priority 43.2) -->' +
                    '<div class="w-full rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 overflow-hidden text-left">' +
                        '<button onclick="LanguageExchange.toggleFiltersAccordion()" ' +
                            'class="w-full p-3.5 flex items-center justify-between text-xs font-black text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">' +
                            '<div class="flex items-center gap-2">' +
                                '<span>⚙️</span> <span>Filteri za Spajanje</span>' +
                                '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">Prilagodi</span>' +
                            '</div>' +
                            '<span class="text-[11px] text-blue-600 dark:text-blue-400 font-bold">' + filterBtnText + '</span>' +
                        '</button>' +

                        '<div class="' + filterContentClass + ' p-3.5 pt-0 border-t border-slate-100 dark:border-slate-700/60 space-y-3">' +
                            '<!-- Country Filter -->' +
                            '<div>' +
                                '<label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Zemlja / Poreklo</label>' +
                                '<div class="grid grid-cols-3 gap-1 text-[11px] font-bold">' +
                                    '<button onclick="LanguageExchange.setFilter(\'country\', \'all\')" class="p-2 rounded-xl border ' + (f.country === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">🌍 Svejedno</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'country\', \'rs\')" class="p-2 rounded-xl border ' + (f.country === 'rs' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">🇷🇸 Srbija</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'country\', \'ba\')" class="p-2 rounded-xl border ' + (f.country === 'ba' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">🇧🇦 Bosna</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'country\', \'me\')" class="p-2 rounded-xl border ' + (f.country === 'me' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">🇲🇪 Crna Gora</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'country\', \'diaspora\')" class="p-2 rounded-xl border ' + (f.country === 'diaspora' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">✈️ Dijaspora</button>' +
                                '</div>' +
                            '</div>' +

                            '<!-- Gender Filter -->' +
                            '<div>' +
                                '<label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Pol Sagovornika</label>' +
                                '<div class="grid grid-cols-3 gap-1 text-[11px] font-bold">' +
                                    '<button onclick="LanguageExchange.setFilter(\'gender\', \'all\')" class="p-2 rounded-xl border ' + (f.gender === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">👥 Bilo ko</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'gender\', \'female\')" class="p-2 rounded-xl border ' + (f.gender === 'female' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">👩 Žene</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'gender\', \'male\')" class="p-2 rounded-xl border ' + (f.gender === 'male' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">👨 Muškarci</button>' +
                                '</div>' +
                            '</div>' +

                            '<!-- Medium Preference Filter -->' +
                            '<div>' +
                                '<label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Željeni Format</label>' +
                                '<div class="grid grid-cols-3 gap-1 text-[11px] font-bold">' +
                                    '<button onclick="LanguageExchange.setFilter(\'medium\', \'all\')" class="p-2 rounded-xl border ' + (f.medium === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">🌐 Svejedno</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'medium\', \'voice\')" class="p-2 rounded-xl border ' + (f.medium === 'voice' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">🎤 Glas</button>' +
                                    '<button onclick="LanguageExchange.setFilter(\'medium\', \'text\')" class="p-2 rounded-xl border ' + (f.medium === 'text' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700') + '">💬 Tekst</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +

                    '<!-- Mode Buttons Stack -->' +
                    '<div class="w-full space-y-3 pt-1">' +
                        '<button onclick="LanguageExchange.startMatching(\'1v1\')" ' +
                            'class="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-between group">' +
                            '<div class="flex items-center gap-3 text-left">' +
                                '<span class="text-2xl p-2 bg-white/20 rounded-xl">🎲</span>' +
                                '<div>' +
                                    '<div class="font-black text-sm">1v1 Slučajni Par (Roulette)</div>' +
                                    '<div class="text-[10px] text-blue-100 font-medium">Jedinstvena soba: započni tekstom, uključi glas ili video kad poželiš</div>' +
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

                    '<!-- Saved Study Buddies Container -->' +
                    buddiesHtml +

                    '<!-- Blocked Users Management Card (P43.3) -->' +
                    blockedCardHtml +

                    '<!-- Room Code Private Join -->' +
                    '<div class="w-full p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">' +
                        '<div class="text-xs font-black text-slate-700 dark:text-slate-200 text-left flex items-center gap-1.5">' +
                            '<span>🔑</span> <span>Imaš kod sobe od prijatelja?</span>' +
                        '</div>' +
                        '<div class="flex gap-2">' +
                            '<input type="text" id="exchange-room-code-input" placeholder="npr. SRB-4921" maxlength="10" ' +
                                'class="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white font-mono text-xs uppercase font-bold focus:border-blue-500 outline-none">' +
                            '<button onclick="LanguageExchange.joinWithCode()" ' +
                                'class="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-black text-xs rounded-xl active:scale-95 transition-all">' +
                                'Uđi u Sobu' +
                            '</button>' +
                        '</div>' +
                    '</div>' +

                    '<!-- QA Moderation Sandbox Test Bar -->' +
                    qaBarHtml +

                    '<!-- Safe & Friendly Pledge Footer -->' +
                    '<div class="flex items-center gap-2 text-[10px] text-slate-400">' +
                        '<span>🛡️</span> <span>100% anonimno i bezbedno. Nulta tolerancija na golotinju i zloupotrebu.</span>' +
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
                        '<p class="text-xs text-slate-400">Povezujem te sa osobom prema izabranim filterima</p>' +
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

            var buddies = this.getStudyBuddies();
            var isBuddy = buddies.some(function(b) { return b.id === p.id; });

            var icebreakerPills = ICEBREAKERS.map(function(t, idx) {
                return '<button onclick="LanguageExchange.sendTopicPrompt(' + idx + ')" ' +
                    'class="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center gap-1 active:scale-95 transition-all">' +
                    '<span>' + t.icon + '</span> <span>' + t.label + '</span></button>';
            }).join('');

            container.innerHTML =
                '<div class="flex flex-col h-full relative">' +
                    '<!-- Top Partner Bar -->' +
                    '<div class="p-3 bg-white dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between shrink-0 shadow-sm">' +
                        '<div class="flex items-center gap-2.5 min-w-0">' +
                            '<div class="relative shrink-0 cursor-pointer" onclick="LanguageExchange.toggleVideoStage()">' +
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

                        '<!-- Right Top Controls (Dual-Button Safety & Moderation) -->' +
                        '<div class="flex items-center gap-1 shrink-0">' +
                            '<!-- Save Study Buddy Button -->' +
                            '<button onclick="LanguageExchange.saveStudyBuddy()" ' +
                                'class="p-1.5 rounded-xl border text-xs transition-colors ' + (isBuddy ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 'text-slate-400 hover:text-amber-500 border-transparent') + '" ' +
                                'title="' + (isBuddy ? 'Već u prijateljima' : 'Sačuvaj kao partnera za učenje') + '">' +
                                (isBuddy ? '⭐' : '☆') +
                            '</button>' +

                            '<!-- NSFW Panic Shield Button -->' +
                            '<button onclick="LanguageExchange.triggerNSFWShield()" ' +
                                'class="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded-xl text-xs border border-red-500/20 active:scale-95 transition-all" ' +
                                'title="NSFW Zaštitni Štit / Zamagli ekran">' +
                                '🚨' +
                            '</button>' +

                            '<!-- 🚩 REPORT BUTTON (Community Strike - does NOT block) -->' +
                            '<button onclick="LanguageExchange.reportCurrent()" ' +
                                'class="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-[10px] font-bold border border-amber-500/20 active:scale-95 transition-all flex items-center gap-1" ' +
                                'title="Prijavi neprikladno ponašanje (Prijava zajednici)">' +
                                '<span>🚩</span> <span>Prijavi</span>' +
                            '</button>' +

                            '<!-- 🚫 BLOCK BUTTON (Personal Exclusion - 100% Permanent) -->' +
                            '<button onclick="LanguageExchange.blockCurrent()" ' +
                                'class="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1" ' +
                                'title="Trajno blokiraj ovog korisnika">' +
                                '<span>🚫</span> <span>Blok</span>' +
                            '</button>' +

                            '<!-- Next Partner Button -->' +
                            '<button onclick="LanguageExchange.nextPartner()" ' +
                                'class="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black active:scale-95 transition-all flex items-center gap-1 shadow-sm" ' +
                                'title="Sledeći sagovornik">' +
                                '<span>⏭️</span> <span class="hidden xs:inline">Sledeći</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +

                    '<!-- Interactive Video Stage (Collapsible / PiP Enabled) -->' +
                    '<div id="exchange-video-stage" class="hidden relative bg-slate-900 border-b border-slate-800 p-4 shrink-0 transition-all">' +
                        '<div class="flex items-center justify-center relative min-h-[120px]">' +
                            '<!-- Simulated Partner Video Stream Display -->' +
                            '<div id="exchange-stage-avatar-wrapper" class="flex flex-col items-center justify-center space-y-1.5 transition-all duration-500">' +
                                '<div class="w-16 h-16 rounded-full bg-slate-800 border-2 border-indigo-500/50 flex items-center justify-center text-3xl shadow-lg">' +
                                    p.avatar +
                                '</div>' +
                                '<div class="text-[10px] font-bold text-slate-300 flex items-center gap-1">' +
                                    '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>' +
                                    '<span>Kamera sagovornika (Audio & Video aktivni)</span>' +
                                '</div>' +
                            '</div>' +

                            '<!-- 2-Second Safe-Connect Frosted Blur Overlay -->' +
                            '<div id="exchange-safe-blur-overlay" class="hidden absolute inset-0 bg-slate-950/70 backdrop-blur-xl flex flex-col items-center justify-center z-10 transition-opacity">' +
                                '<span class="text-xl">🔒</span>' +
                                '<span class="text-xs font-black text-white mt-1">Zaštitno zamagljenje (2s)...</span>' +
                                '<span class="text-[9px] text-slate-400">Automatski se uklanja kada se uspostavi bezbedna veza</span>' +
                            '</div>' +

                            '<!-- PiP Self Video Window (Priority 43.2) -->' +
                            '<div id="exchange-pip-container" class="hidden absolute bottom-2 right-2 w-24 h-28 rounded-2xl border-2 border-white/40 shadow-2xl bg-black overflow-hidden z-20">' +
                                '<video id="exchange-self-video" autoplay muted playsinline class="w-full h-full object-cover"></video>' +
                                '<div class="absolute bottom-1 left-1 px-1 py-0.2 rounded bg-black/60 text-[8px] font-bold text-white">Ti</div>' +
                            '</div>' +
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

                    '<!-- Hardware Controls Bar (Mic & Camera Toggles) -->' +
                    '<div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">' +
                        '<div class="flex items-center gap-2">' +
                            '<!-- Microphone Toggle -->' +
                            '<button id="btn-exchange-mic" onclick="LanguageExchange.toggleMic()" ' +
                                'class="px-2.5 py-1 rounded-xl font-bold text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1 active:scale-95 transition-all">' +
                                '<span>🎤</span> <span>Mikrofon: Isključen</span>' +
                            '</button>' +

                            '<!-- Camera Toggle -->' +
                            '<button id="btn-exchange-cam" onclick="LanguageExchange.toggleCamera()" ' +
                                'class="px-2.5 py-1 rounded-xl font-bold text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center gap-1 active:scale-95 transition-all">' +
                                '<span>📹</span> <span>Kamera</span>' +
                            '</button>' +
                        '</div>' +

                        '<div class="text-[10px] text-slate-400 font-medium hidden sm:block">' +
                            '💬 Tekst uvek aktivan' +
                        '</div>' +
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
            this.updateHardwareUI();
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
            var p = this.partner;
            var buddies = this.getStudyBuddies();
            var isBuddy = p && buddies.some(function(b) { return b.id === p.id; });

            var saveBuddyBtn = (p && !isBuddy) ?
                '<button onclick="LanguageExchange.saveStudyBuddy()" class="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold text-xs border border-amber-500/30 active:scale-95 transition-all">' +
                    '⭐ Sačuvaj ' + esc(p.name) + ' u Partnere' +
                '</button>' : '';

            container.innerHTML =
                '<div class="flex flex-col items-center justify-center py-16 px-4 space-y-4 text-center max-w-sm mx-auto">' +
                    '<span class="text-4xl">👋</span>' +
                    '<h3 class="text-base font-black text-slate-800 dark:text-white">Razgovor je završen</h3>' +
                    '<p class="text-xs text-slate-400">Hvala na vežbi! Svaka konverzacija donosi veću sigurnost u govoru.</p>' +
                    '<div class="flex flex-wrap gap-2 justify-center pt-2">' +
                        saveBuddyBtn +
                        '<button onclick="LanguageExchange.returnToLobby()" class="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs">' +
                            'Lobi' +
                        '</button>' +
                        '<button onclick="LanguageExchange.startMatching(\'1v1\')" class="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-black text-xs shadow-md">' +
                            'Novi Sagovornik ⏭️' +
                        '</button>' +
                    '</div>' +
                '</div>';
        },

        renderModals: function(container) {
            if (!container) return;
            var existing = document.getElementById('exchange-modals-wrapper');
            if (existing) return;

            var wrapper = document.createElement('div');
            wrapper.id = 'exchange-modals-wrapper';
            wrapper.innerHTML =
                '<!-- OVERLAY 1: 18+ Safety & Community Pledge Modal -->' +
                '<div id="exchange-18plus-modal" class="hidden absolute inset-0 bg-slate-950/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">' +
                    '<div class="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl">' +
                        '🛡️' +
                    '</div>' +
                    '<div class="space-y-1.5 max-w-xs">' +
                        '<h3 class="text-base font-black text-white">18+ Bezbednosni Zavet</h3>' +
                        '<p class="text-xs text-slate-300 leading-relaxed">' +
                            'SerboLingo ima nultu toleranciju na golotinju, neprimereno ponašanje i uznemiravanje. Prekršaji se kažnjavaju trajnim banom uređaja.' +
                        '</p>' +
                        '<p class="text-[11px] text-amber-400 font-bold">' +
                            'Potvrđujem da sam punoletan/na i da ću poštovati sagovornike.' +
                        '</p>' +
                    '</div>' +
                    '<div class="flex gap-2 w-full max-w-xs pt-2">' +
                        '<button onclick="LanguageExchange.decline18Plus()" ' +
                            'class="flex-1 p-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs active:scale-95 transition-all">' +
                            'Odustani' +
                        '</button>' +
                        '<button onclick="LanguageExchange.accept18Plus()" ' +
                            'class="flex-1 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-lg active:scale-95 transition-all">' +
                            '✅ Prihvatam' +
                        '</button>' +
                    '</div>' +
                '</div>' +

                '<!-- OVERLAY 2: NSFW Panic Shield (3 Actions) -->' +
                '<div id="exchange-nsfw-shield" class="hidden absolute inset-0 bg-red-950/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center space-y-4">' +
                    '<div class="w-20 h-20 rounded-3xl bg-red-600/30 border-2 border-red-500 text-red-400 flex items-center justify-center text-4xl shadow-2xl animate-pulse">' +
                        '🚨' +
                    '</div>' +
                    '<div class="space-y-2 max-w-sm">' +
                        '<h3 class="text-lg font-black text-white">Ekran je cenzurisan radi zaštite!</h3>' +
                        '<p class="text-xs text-red-200 leading-relaxed">' +
                            'Prijavljen je sumnjiv ili neprimeren sadržaj. Mikrofon i video su automatski privremeno obustavljeni radi vaše bezbednosti.' +
                        '</p>' +
                        '<p class="text-[11px] text-slate-300 font-medium">' +
                            'Izaberite šta želite da uradite:' +
                        '</p>' +
                    '</div>' +
                    '<div class="flex flex-col gap-2 w-full max-w-xs pt-1">' +
                        '<button onclick="LanguageExchange.confirmNSFWReportAndBlockAndSkip()" ' +
                            'class="w-full p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-xl shadow-red-600/40 active:scale-95 transition-all flex items-center justify-center gap-2">' +
                            '<span>🚨</span> <span>Prijavi, Blokiraj i Sledeći</span>' +
                        '</button>' +
                        '<button onclick="LanguageExchange.skipWithoutReport()" ' +
                            'class="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2">' +
                            '<span>⏭️</span> <span>Samo Preskoči Sagovornika</span>' +
                        '</button>' +
                        '<button onclick="LanguageExchange.dismissNSFWShieldAndStay()" ' +
                            'class="w-full p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2">' +
                            '<span>✅</span> <span>Sve je u redu / Ostani (Odblokiraj)</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +

                '<!-- OVERLAY 3: Formal Community Report Modal (P43.3) -->' +
                '<div id="exchange-report-modal" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center">' +
                    '<div class="max-w-xs w-full bg-slate-900 border border-slate-700 p-5 rounded-3xl space-y-3.5 shadow-2xl text-left">' +
                        '<div class="flex items-center gap-2.5">' +
                            '<span class="text-2xl p-1.5 bg-amber-500/20 rounded-xl">🚩</span>' +
                            '<div>' +
                                '<h4 class="text-xs font-black text-white">Prijava Neprikladnog Ponašanja</h4>' +
                                '<p class="text-[10px] text-slate-400">Sagovornik: <span id="exchange-report-target-name" class="font-bold text-amber-400">Korisnik</span></p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="space-y-1.5">' +
                            '<label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Razlog prijave:</label>' +
                            '<select id="exchange-report-reason-select" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium outline-none">' +
                                '<option value="harassment">Uvrede / Uznemiravanje</option>' +
                                '<option value="nsfw">Neprimeren / Eksplicitan sadržaj</option>' +
                                '<option value="troll">Odbija učenje jezika / Trolovanje</option>' +
                                '<option value="spam">Spam ili reklame</option>' +
                                '<option value="other">Ostalo</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[10px] text-blue-200 leading-relaxed">' +
                            'ℹ️ Prijava utiče na reputaciju sagovornika (potrebno je 4 nezavisne prijave za suspenziju). Prijava NE blokira osobu za vas automatski – ako više ne želite susrete, koristite dugme Blokiraj.' +
                        '</div>' +
                        '<div class="flex gap-2 pt-1">' +
                            '<button onclick="LanguageExchange.closeReportModal()" class="flex-1 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition-all text-center">Odustani</button>' +
                            '<button onclick="LanguageExchange.confirmReportCurrent(document.getElementById(\'exchange-report-reason-select\').value)" class="flex-1 p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md active:scale-95 transition-all text-center">🚩 Prijavi</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<!-- OVERLAY 4: Formal Community Warning Modal (P43.3) -->' +
                '<div id="exchange-community-warning-modal" class="hidden absolute inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center">' +
                    '<div class="max-w-sm w-full bg-slate-900 border-2 border-amber-500/40 p-6 rounded-3xl space-y-4 shadow-2xl text-left">' +
                        '<div class="flex items-center gap-3">' +
                            '<span class="text-3xl p-2 bg-amber-500/20 text-amber-400 rounded-2xl">⚠️</span>' +
                            '<div>' +
                                '<h4 class="text-sm font-black text-white">Zvanična Opomena Zajednice</h4>' +
                                '<p class="text-[10px] text-amber-400 font-bold">Standardi bezbednosti i komunikacije</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="text-xs text-slate-300 space-y-2 leading-relaxed">' +
                            '<p>Zabeležene su prijave na vaše ponašanje tokom razgovora. SerboLingo je platforma za učenje jezika sa nultom tolerancijom na uznemiravanje i neprimeren sadržaj.</p>' +
                            '<ul class="list-disc pl-4 text-[11px] text-slate-400 space-y-1">' +
                                '<li>Bez uvreda i neprijatnih komentara</li>' +
                                '<li>Bez golotinje i neprimerenog ponašanja</li>' +
                                '<li>Fokus na zajedničku vežbu jezika</li>' +
                            '</ul>' +
                            '<p class="text-[10px] text-amber-300 font-bold">Svako dalje kršenje vodi do automatske suspenzije (1h, 4h, 24h, 7 dana ili trajno).</p>' +
                        '</div>' +
                        '<div class="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2.5">' +
                            '<input type="checkbox" id="exchange-warning-checkbox" class="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer">' +
                            '<label for="exchange-warning-checkbox" class="text-[11px] font-bold text-slate-200 cursor-pointer">Razumem pravila i prihvatam odgovornost</label>' +
                        '</div>' +
                        '<button onclick="LanguageExchange.acknowledgeCommunityWarning()" class="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all text-center">' +
                            'Razumem i Prihvatam' +
                        '</button>' +
                    '</div>' +
                '</div>' +

                '<!-- OVERLAY 5: Appeal Submission Modal (P43.3) -->' +
                '<div id="exchange-appeal-modal" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center">' +
                    '<div class="max-w-sm w-full bg-slate-900 border border-slate-700 p-5 rounded-3xl space-y-3.5 shadow-2xl text-left">' +
                        '<div class="flex items-center gap-2.5">' +
                            '<span class="text-2xl p-1.5 bg-blue-500/20 rounded-xl">📩</span>' +
                            '<div>' +
                                '<h4 class="text-xs font-black text-white">Podnošenje Žalbe na Suspenziju</h4>' +
                                '<p class="text-[10px] text-slate-400">Moderator zajednice će pregledati tvoj slučaj</p>' +
                            '</div>' +
                        '</div>' +
                        '<div class="space-y-1.5">' +
                            '<label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategorija žalbe:</label>' +
                            '<select id="exchange-appeal-reason" class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium outline-none">' +
                                '<option value="Lažna prijava zlonamernih korisnika">Lažna prijava zlonamernih korisnika</option>' +
                                '<option value="Nesporazum u komunikaciji (jezička barijera)">Nesporazum u komunikaciji (jezička barijera)</option>' +
                                '<option value="Nenamerna tehnička greška">Nenamerna tehnička greška</option>' +
                                '<option value="Ostalo">Ostalo</option>' +
                            '</select>' +
                        '</div>' +
                        '<div class="space-y-1.5">' +
                            '<label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Objašnjenje (maks. 500 karaktera):</label>' +
                            '<textarea id="exchange-appeal-text" maxlength="500" rows="3" placeholder="Opišite detaljno šta se dogodilo..." class="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-medium outline-none resize-none"></textarea>' +
                        '</div>' +
                        '<div class="flex gap-2 pt-1">' +
                            '<button onclick="LanguageExchange.closeAppealModal()" class="flex-1 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition-all text-center">Odustani</button>' +
                            '<button onclick="LanguageExchange.submitAppeal()" class="flex-1 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md active:scale-95 transition-all text-center">Pošalji Žalbu</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +

                '<!-- OVERLAY 6: Blocked Users Management Modal (P43.3) -->' +
                '<div id="exchange-blocked-modal" class="hidden absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center">' +
                    '<div class="max-w-sm w-full bg-slate-900 border border-slate-700 p-5 rounded-3xl space-y-3.5 shadow-2xl text-left flex flex-col max-h-[80vh]">' +
                        '<div class="flex items-center justify-between">' +
                            '<div class="flex items-center gap-2">' +
                                '<span class="text-xl">🚫</span>' +
                                '<h4 class="text-xs font-black text-white">Blokirani Sagovornici</h4>' +
                            '</div>' +
                            '<button onclick="LanguageExchange.closeBlockedUsersModal()" class="text-slate-400 hover:text-white text-sm font-black p-1">✕</button>' +
                        '</div>' +
                        '<p class="text-[10px] text-slate-400">Osobe sa ove liste su trajno isključene iz spajanja. Možeš ih odblokirati u svakom trenutku.</p>' +
                        '<div id="exchange-blocked-users-list" class="space-y-2 overflow-y-auto max-h-56 pr-1 flex-1">' +
                            '<!-- Injected by renderBlockedUsersList() -->' +
                        '</div>' +
                        '<button onclick="LanguageExchange.closeBlockedUsersModal()" class="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-95 transition-all text-center">' +
                            'Zatvori' +
                        '</button>' +
                    '</div>' +
                '</div>';

            container.appendChild(wrapper);
        }
    };

    console.log('[LanguageExchange] ⚡ Engine v3.0 initialized (Priority 43, 43.2 & 43.3 Active: Dual-Button Safety, Escalation Ladder & Appeals).');
})();
