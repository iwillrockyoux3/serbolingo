// [SHIELD_DAEMON: VALIDATED] 🛡️
// Priority 13: Cloze Mastery Engine (Fill-in-the-Blank Context Trainer)
// Connected directly to window.SEED_DATA (5,031 words & 4,600+ bilingual sentences across 14 thematic channels)

const ClozeEngine = {
    // Preserved 40-sentence offline fallback bank
    SENTENCES: [
        { sr: 'Ja pijem ___ ujutru.', en: 'I drink ___ in the morning.', blank_sr: 'kafu', blank_en: 'coffee', hint: '☕', category: 'daily', base_sr: 'kafa', base_en: 'coffee' },
        { sr: 'On čita ___ svaki dan.', en: 'He reads a ___ every day.', blank_sr: 'knjigu', blank_en: 'book', hint: '📖', category: 'daily', base_sr: 'knjiga', base_en: 'book' },
        { sr: 'Ona ide u ___ autobusom.', en: 'She goes to ___ by bus.', blank_sr: 'školu', blank_en: 'school', hint: '🏫', category: 'daily', base_sr: 'škola', base_en: 'school' },
        { sr: 'Mi živimo u ___.', en: 'We live in ___.', blank_sr: 'Beogradu', blank_en: 'Belgrade', hint: '🏙️', category: 'travel', base_sr: 'Beograd', base_en: 'Belgrade' },
        { sr: 'Voda je vrlo ___.', en: 'The water is very ___.', blank_sr: 'hladna', blank_en: 'cold', hint: '🥶', category: 'nature', base_sr: 'hladan', base_en: 'cold' },
        { sr: 'Danas je ___ dan.', en: 'Today is a ___ day.', blank_sr: 'lep', blank_en: 'beautiful', hint: '☀️', category: 'nature', base_sr: 'lep', base_en: 'beautiful' },
        { sr: 'Kupio sam ___ na pijaci.', en: 'I bought ___ at the market.', blank_sr: 'jabuke', blank_en: 'apples', hint: '🍎', category: 'food', base_sr: 'jabuka', base_en: 'apple' },
        { sr: 'Moj ___ je učitelj.', en: 'My ___ is a teacher.', blank_sr: 'otac', blank_en: 'father', hint: '👨', category: 'daily', base_sr: 'otac', base_en: 'father' },
        { sr: 'Želim da naučim ___.', en: 'I want to learn ___.', blank_sr: 'srpski', blank_en: 'Serbian', hint: '🇷🇸', category: 'culture', base_sr: 'srpski', base_en: 'Serbian' },
        { sr: 'Koliko ___ ovo?', en: 'How much does this ___?', blank_sr: 'košta', blank_en: 'cost', hint: '💰', category: 'business', base_sr: 'koštati', base_en: 'cost' },
        { sr: 'Imam dvoje ___.', en: 'I have two ___.', blank_sr: 'dece', blank_en: 'children', hint: '👧', category: 'daily', base_sr: 'dete', base_en: 'child' },
        { sr: 'Volim da ___ muziku.', en: 'I love to ___ to music.', blank_sr: 'slušam', blank_en: 'listen', hint: '🎵', category: 'culture', base_sr: 'slušati', base_en: 'listen' },
        { sr: 'Sutra idem na ___.', en: 'Tomorrow I go to ___.', blank_sr: 'posao', blank_en: 'work', hint: '💼', category: 'business', base_sr: 'posao', base_en: 'work' },
        { sr: 'Mogu li da dobijem ___?', en: 'Can I get the ___?', blank_sr: 'račun', blank_en: 'bill', hint: '🧾', category: 'business', base_sr: 'račun', base_en: 'bill' },
        { sr: '___ je moja omiljena hrana.', en: '___ is my favorite food.', blank_sr: 'Ćevapi', blank_en: 'Cevapi', hint: '🥩', category: 'food', base_sr: 'ćevapi', base_en: 'cevapi' },
        { sr: 'Gde je najbliža ___?', en: 'Where is the nearest ___?', blank_sr: 'apoteka', blank_en: 'pharmacy', hint: '💊', category: 'medical', base_sr: 'apoteka', base_en: 'pharmacy' },
        { sr: 'Treba mi ___ za sobu.', en: 'I need a ___ for the room.', blank_sr: 'ključ', blank_en: 'key', hint: '🔑', category: 'daily', base_sr: 'ključ', base_en: 'key' },
        { sr: 'Hoćeš li ___ sa mnom?', en: 'Will you ___ with me?', blank_sr: 'plesati', blank_en: 'dance', hint: '💃', category: 'culture', base_sr: 'plesati', base_en: 'dance' },
        { sr: 'Mačka ___ na kauču.', en: 'The cat is ___ on the couch.', blank_sr: 'spava', blank_en: 'sleeping', hint: '🐱', category: 'nature', base_sr: 'spavati', base_en: 'sleep' },
        { sr: '___ pada napolju.', en: 'It is ___ outside.', blank_sr: 'Kiša', blank_en: 'Raining', hint: '🌧️', category: 'nature', base_sr: 'kiša', base_en: 'rain' },
        { sr: 'Ovo je moja ___.', en: 'This is my ___.', blank_sr: 'kuća', blank_en: 'house', hint: '🏠', category: 'daily', base_sr: 'kuća', base_en: 'house' },
        { sr: 'Idemo na ___ večeras.', en: 'Let\'s go to a ___ tonight.', blank_sr: 'koncert', blank_en: 'concert', hint: '🎤', category: 'culture', base_sr: 'koncert', base_en: 'concert' },
        { sr: 'Nemam dovoljno ___.', en: 'I don\'t have enough ___.', blank_sr: 'novca', blank_en: 'money', hint: '💵', category: 'business', base_sr: 'novac', base_en: 'money' },
        { sr: 'Ona nosi ___ haljinu.', en: 'She is wearing a ___ dress.', blank_sr: 'crvenu', blank_en: 'red', hint: '🔴', category: 'daily', base_sr: 'crven', base_en: 'red' },
        { sr: 'Jesi li ___ za kafu?', en: 'Are you ___ for coffee?', blank_sr: 'spreman', blank_en: 'ready', hint: '☕', category: 'daily', base_sr: 'spreman', base_en: 'ready' },
        { sr: 'Auto je parkiran ___.', en: 'The car is parked ___.', blank_sr: 'ispred', blank_en: 'in front', hint: '🚗', category: 'travel', base_sr: 'ispred', base_en: 'in front' },
        { sr: 'Hvala na ___ pomoći.', en: 'Thank you for your ___.', blank_sr: 'velikoj', blank_en: 'great', hint: '🙏', category: 'daily', base_sr: 'veliki', base_en: 'great' },
        { sr: 'Putujemo ___ u julu.', en: 'We travel to ___ in July.', blank_sr: 'Grčku', blank_en: 'Greece', hint: '🇬🇷', category: 'travel', base_sr: 'Grčka', base_en: 'Greece' },
        { sr: 'Daj mi ___, molim te.', en: 'Give me ___, please.', blank_sr: 'hleb', blank_en: 'bread', hint: '🍞', category: 'food', base_sr: 'hleb', base_en: 'bread' },
        { sr: 'Restoran se ___ u osam.', en: 'The restaurant ___ at eight.', blank_sr: 'zatvara', blank_en: 'closes', hint: '🍽️', category: 'food', base_sr: 'zatvarati', base_en: 'close' },
        { sr: 'Tvoj ___ je veoma dobar.', en: 'Your ___ is very good.', blank_sr: 'engleski', blank_en: 'English', hint: '🇬🇧', category: 'culture', base_sr: 'engleski', base_en: 'English' },
        { sr: 'Trebam ___ za telefon.', en: 'I need a ___ for my phone.', blank_sr: 'punjač', blank_en: 'charger', hint: '🔌', category: 'technology', base_sr: 'punjač', base_en: 'charger' },
        { sr: 'Hajde da ___ film.', en: 'Let\'s ___ a movie.', blank_sr: 'gledamo', blank_en: 'watch', hint: '🎬', category: 'culture', base_sr: 'gledati', base_en: 'watch' },
        { sr: 'On je moj najbolji ___.', en: 'He is my best ___.', blank_sr: 'prijatelj', blank_en: 'friend', hint: '🤝', category: 'emotions', base_sr: 'prijatelj', base_en: 'friend' },
        { sr: 'Psi ___ u parku.', en: 'Dogs are ___ in the park.', blank_sr: 'trče', blank_en: 'running', hint: '🐕', category: 'nature', base_sr: 'trčati', base_en: 'run' },
        { sr: 'Ovo ___ je ukusno!', en: 'This ___ is delicious!', blank_sr: 'jelo', blank_en: 'dish', hint: '😋', category: 'food', base_sr: 'jelo', base_en: 'dish' },
        { sr: 'Beograd je ___ Srbije.', en: 'Belgrade is the ___ of Serbia.', blank_sr: 'glavni grad', blank_en: 'capital', hint: '🏛️', category: 'travel', base_sr: 'glavni grad', base_en: 'capital' },
        { sr: 'Imaš li ___?', en: 'Do you have a ___?', blank_sr: 'pitanje', blank_en: 'question', hint: '❓', category: 'daily', base_sr: 'pitanje', base_en: 'question' },
        { sr: 'Sunce ___ rano leti.', en: 'The sun ___ early in summer.', blank_sr: 'izlazi', blank_en: 'rises', hint: '🌅', category: 'nature', base_sr: 'izlaziti', base_en: 'rise' },
        { sr: 'Smem li da ___ ovde?', en: 'May I ___ here?', blank_sr: 'sednem', blank_en: 'sit', hint: '💺', category: 'daily', base_sr: 'sesti', base_en: 'sit' },
    ],

    // 14 Thematic Channels grouping 20+ specialized B2 and core categories
    THEMES: {
        'all': { key: 'all', icon: '✨', sr: 'Sve Teme / All Topics', en: 'All Topics', countDesc: '4,400+ rečenica', cats: null },
        'medical': { key: 'medical', icon: '🏥', sr: 'Medicina & Zdravlje', en: 'Health & Medical', countDesc: '~200 rečenica', cats: ['medical', 'health', 'body'] },
        'business': { key: 'business', icon: '💼', sr: 'Biznis & Finansije', en: 'Business & Finance', countDesc: '~460 rečenica', cats: ['business', 'workplace', 'finance', 'finance_banking', 'office', 'meetings', 'formal_register'] },
        'law': { key: 'law', icon: '⚖️', sr: 'Pravo & Zakoni', en: 'Law & Justice', countDesc: '~130 rečenica', cats: ['law', 'politics'] },
        'technology': { key: 'technology', icon: '💻', sr: 'Tehnologija & IT', en: 'Technology & IT', countDesc: '~140 rečenica', cats: ['technology', 'tech'] },
        'travel': { key: 'travel', icon: '✈️', sr: 'Putovanja & Prevoz', en: 'Travel & Transport', countDesc: '~410 rečenica', cats: ['travel', 'travel_advanced', 'airport', 'transport', 'driving', 'city', 'places', 'geography', 'directions'] },
        'food': { key: 'food', icon: '🍽️', sr: 'Hrana & Kafana', en: 'Food & Dining', countDesc: '~240 rečenica', cats: ['culinary', 'food', 'food_1', 'gastronomy', 'kitchen'] },
        'emotions': { key: 'emotions', icon: '💖', sr: 'Emocije & Ljubav', en: 'Emotions & Romance', countDesc: '~260 rečenica', cats: ['emotions', 'emotions_mind', 'dating', 'dating_romance', 'adjectives_feelings', 'verbs_emotion'] },
        'culture': { key: 'culture', icon: '🎭', sr: 'Kultura & Umetnost', en: 'Culture & Arts', countDesc: '~250 rečenica', cats: ['arts_culture', 'arts', 'music', 'movies', 'history', 'customs', 'culture'] },
        'slang': { key: 'slang', icon: '🗯️', sr: 'Sleng & Izreke', en: 'Slang & Idioms', countDesc: '~220 rečenica', cats: ['slang', 'phrases_idioms', 'idioms_1', 'idioms_2', 'dialects', 'expressions'] },
        'cases': { key: 'cases', icon: '🧩', sr: 'Padeži u Kontekstu', en: 'Cases in Context', countDesc: '~190 rečenica', cats: ['nominative', 'accusative', 'genitive', 'dative', 'locative', 'instrumental', 'vocative', 'cases_intro'] },
        'verbs': { key: 'verbs', icon: '⚡', sr: 'Glagoli & Vremena', en: 'Verbs & Action', countDesc: '~320 rečenica', cats: ['verbs', 'verbs_b2', 'verbs_movement', 'verbs_communication', 'verbs_thought', 'verbs_daily', 'verbs_senses', 'aspects', 'imperative', 'past_tense', 'future_tense', 'future_2', 'conditional'] },
        'nature': { key: 'nature', icon: '🌿', sr: 'Priroda & Nauka', en: 'Nature & Science', countDesc: '~260 rečenica', cats: ['science_nature', 'nature', 'science', 'environment', 'animals', 'animals_1', 'weather'] },
        'daily': { key: 'daily', icon: '🏠', sr: 'Svakodnevni Život', en: 'Daily Life & Home', countDesc: '~300 rečenica', cats: ['daily_routine', 'home_living', 'household', 'home', 'clothing', 'furniture'] }
    },

    // In-memory memoization cache for rapid sub-millisecond pool retrieval
    _poolCache: {},

    // Active Engine State
    currentTheme: 'all',
    currentDirection: 'sr_to_en', // 'sr_to_en' (type Serbian in Serbian sentence) or 'en_to_sr' (type English in English sentence)
    currentScript: 'latin',       // 'latin' or 'cyrillic'
    currentSession: null,

    // Helper: string cleaning & regex escaping
    _cleanStr: function(s) {
        if (!s) return '';
        return s.replace(/\([^)]*\)/g, '').replace(/^[^\wčćžšđČĆŽŠĐ]+|[^\wčćžšđČĆŽŠĐ]+$/g, '').trim();
    },

    _escapeRegex: function(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    // Vuk Karadžić 1:1 Transliteration
    toCyrillic: function(text) {
        if (!text || typeof text !== 'string') return '';
        if (window.app && typeof window.app.toCyrillic === 'function') {
            return window.app.toCyrillic(text);
        }
        const digraphs = {
            'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
            'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
            'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ'
        };
        let res = text;
        for (const [lat, cyr] of Object.entries(digraphs)) {
            res = res.split(lat).join(cyr);
        }
        const singles = {
            'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
            'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
            'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'ć': 'ћ',
            'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'š': 'ш',
            'A': 'А', 'B': 'Б', 'V': 'В', 'G': 'Г', 'D': 'Д', 'Đ': 'Ђ', 'E': 'Е',
            'Ž': 'Ж', 'Z': 'З', 'I': 'И', 'J': 'Ј', 'K': 'К', 'L': 'Л', 'M': 'М',
            'N': 'Н', 'O': 'О', 'P': 'П', 'R': 'Р', 'S': 'С', 'T': 'Т', 'Ć': 'Ћ',
            'U': 'У', 'F': 'Ф', 'H': 'Х', 'C': 'Ц', 'Č': 'Ч', 'Š': 'Ш'
        };
        return res.split('').map(ch => singles[ch] || ch).join('');
    },

    toLatin: function(text) {
        if (!text || typeof text !== 'string') return '';
        const cyrToLat = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e',
            'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj',
            'м': 'm', 'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
            'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č',
            'џ': 'dž', 'ш': 'š',
            'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Ђ': 'Đ', 'Е': 'E',
            'Ж': 'Ž', 'З': 'Z', 'И': 'I', 'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj',
            'М': 'M', 'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S',
            'Т': 'T', 'Ћ': 'Ć', 'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Č',
            'Џ': 'Dž', 'Ш': 'Š'
        };
        return text.split('').map(ch => cyrToLat[ch] || ch).join('');
    },

    // Extract dynamic blank token and sentence from seed data entry
    _extractBlankItem: function(item, isSrTarget) {
        if (!item || !item.example_sr || !item.example_en) return null;

        const exSr = item.example_sr.trim();
        const exEn = item.example_en.trim();

        if (isSrTarget) {
            // Target is Serbian word inside Serbian example sentence
            const cleanSr = this._cleanStr(item.sr_lat);
            if (!cleanSr) return null;

            // 1. Exact token match
            let match = exSr.match(new RegExp('\\b' + this._escapeRegex(cleanSr) + '\\b', 'i'));
            if (!match && cleanSr.length >= 3) {
                // 2. Stem match for inflected case endings (e.g., jabuka -> jabuku)
                const first = cleanSr.split(/\s+/)[0];
                const stem = first.length >= 5 ? first.slice(0, 4) : first.slice(0, 3);
                match = exSr.match(new RegExp('\\b' + this._escapeRegex(stem) + '[a-zA-ZčćžšđČĆŽŠĐ]*\\b', 'i'));
            }

            if (!match) return null;
            const token = match[0];
            const blankSentence = exSr.slice(0, match.index) + '____' + exSr.slice(match.index + token.length);

            return {
                id: item.id,
                category: item.category || 'general',
                pos: item.pos || '',
                phonetic: item.phonetic || '',
                displaySentence: blankSentence,
                fullSentence: exSr,
                hintSentence: exEn,
                answer: token,
                baseWord: item.sr_lat,
                altWord: item.sr_cyr || this.toCyrillic(item.sr_lat),
                isSr: true
            };
        } else {
            // Target is English word inside English example sentence
            const cleanEn = this._cleanStr(item.en);
            if (!cleanEn) return null;

            let match = exEn.match(new RegExp('\\b' + this._escapeRegex(cleanEn) + '\\b', 'i'));
            if (!match && cleanEn.length >= 3) {
                const first = cleanEn.split(/\s+/)[0];
                const stem = first.length >= 5 ? first.slice(0, 4) : first.slice(0, 3);
                match = exEn.match(new RegExp('\\b' + this._escapeRegex(stem) + '[a-zA-Z]*\\b', 'i'));
            }

            if (!match) return null;
            const token = match[0];
            const blankSentence = exEn.slice(0, match.index) + '____' + exEn.slice(match.index + token.length);

            return {
                id: item.id,
                category: item.category || 'general',
                pos: item.pos || '',
                phonetic: item.phonetic || '',
                displaySentence: blankSentence,
                fullSentence: exEn,
                hintSentence: exSr,
                answer: token,
                baseWord: item.en,
                altWord: '',
                isSr: false
            };
        }
    },

    // Build or retrieve cached pool for theme and direction
    getPool: function(themeKey = 'all', isSrTarget = true) {
        const cacheKey = `${themeKey}_${isSrTarget ? 'sr' : 'en'}`;
        if (this._poolCache[cacheKey]) {
            return this._poolCache[cacheKey];
        }

        const pool = [];
        const rawData = (typeof window !== 'undefined' && window.SEED_DATA && Array.isArray(window.SEED_DATA)) ? window.SEED_DATA : null;

        if (rawData && rawData.length > 0) {
            const themeConfig = this.THEMES[themeKey] || this.THEMES['all'];
            const allowedCats = themeConfig.cats ? new Set(themeConfig.cats) : null;

            for (let i = 0; i < rawData.length; i++) {
                const item = rawData[i];
                if (allowedCats && !allowedCats.has(item.category)) continue;

                const extracted = this._extractBlankItem(item, isSrTarget);
                if (extracted) {
                    pool.push(extracted);
                }
            }
        }

        // Offline fallback if seed data did not yield items
        if (pool.length === 0) {
            for (let i = 0; i < this.SENTENCES.length; i++) {
                const s = this.SENTENCES[i];
                if (isSrTarget) {
                    pool.push({
                        id: `fb_sr_${i}`,
                        category: s.category || 'daily',
                        pos: '',
                        phonetic: '',
                        displaySentence: s.sr,
                        fullSentence: s.sr.replace('___', s.blank_sr),
                        hintSentence: s.en,
                        answer: s.blank_sr,
                        baseWord: s.base_sr || s.blank_sr,
                        altWord: this.toCyrillic(s.blank_sr),
                        isSr: true
                    });
                } else {
                    pool.push({
                        id: `fb_en_${i}`,
                        category: s.category || 'daily',
                        pos: '',
                        phonetic: '',
                        displaySentence: s.en,
                        fullSentence: s.en.replace('___', s.blank_en),
                        hintSentence: s.sr,
                        answer: s.blank_en,
                        baseWord: s.base_en || s.blank_en,
                        altWord: '',
                        isSr: false
                    });
                }
            }
        }

        this._poolCache[cacheKey] = pool;
        return pool;
    },

    // Unified Normalization & Typo Tolerance
    _normalize: function(str) {
        if (!str || typeof str !== 'string') return '';
        if (window.app && typeof window.app._phoneticNormalize === 'function') {
            return window.app._phoneticNormalize(str);
        }
        let s = str.toLowerCase().trim();
        s = s.replace(/y/g, 'j').replace(/w/g, 'v');
        s = s.replace(/đ/g, 'dj').replace(/dž/g, 'dz');
        s = s.replace(/č/g, 'c').replace(/ć/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z');
        return s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').trim();
    },

    _levenshtein: function(a, b) {
        if (window.app && typeof window.app._levenshtein === 'function') {
            return window.app._levenshtein(a, b);
        }
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    },

    // Multi-tier answer matching: Exact, Script Parity, Bald Latin, Typo, and Base Form
    checkMatch: function(userGuess, targetAnswer, baseWord, isSr) {
        const rawGuess = (userGuess || '').trim();
        const rawTarget = (targetAnswer || '').trim();
        const rawBase = (baseWord || '').trim();

        if (!rawGuess) return { isCorrect: false };

        // 1. Direct case-insensitive equality
        if (rawGuess.toLowerCase() === rawTarget.toLowerCase()) {
            return { isCorrect: true, isExact: true, message: '🎯 Savršeno tačno!' };
        }

        // 2. Cross-script check (Latin ↔ Cyrillic)
        if (isSr) {
            const guessInLat = this.toLatin(rawGuess).toLowerCase();
            const targetInLat = this.toLatin(rawTarget).toLowerCase();
            const baseInLat = this.toLatin(rawBase).toLowerCase();

            if (guessInLat === targetInLat) {
                return { isCorrect: true, isExact: true, message: '🎯 Tačno preko pisama!' };
            }
            if (rawBase && guessInLat === baseInLat) {
                return { isCorrect: true, isBaseWord: true, message: `💡 Tačno! (Padežni oblik: "${rawTarget}")` };
            }
        }

        // 3. Normalized phonetic & bald Latin comparison
        const normGuess = this._normalize(rawGuess);
        const normTarget = this._normalize(rawTarget);
        const normBase = rawBase ? this._normalize(rawBase) : '';

        if (normGuess === normTarget) {
            return { isCorrect: true, isBaldLatin: true, message: '💡 Tačno! (Pripazi na kvačice: č, ć, ž, š, đ)' };
        }
        if (normBase && normGuess === normBase) {
            return { isCorrect: true, isBaseWord: true, message: `💡 Tačno! (U rečenici: "${rawTarget}")` };
        }

        // 4. Typo tolerance: 1-character Levenshtein distance on words with length >= 4
        if (normTarget.length >= 4 && this._levenshtein(normGuess, normTarget) <= 1) {
            return { isCorrect: true, isTypo: true, message: '💡 Skoro savršeno! (Mala greška u kucanju)' };
        }

        return { isCorrect: false };
    },

    // Open Interactive Setup & Category Filter Menu
    openMenu: function() {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();

        // Sync settings from global state if available
        if (window.appState && window.appState.settings) {
            if (window.appState.settings.learningDirection) {
                this.currentDirection = window.appState.settings.learningDirection;
            }
            if (window.appState.settings.script === 'cyrillic' || window.appState.settings.appLanguage === 'sr_cyr') {
                this.currentScript = 'cyrillic';
            }
        }

        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');

        const isSr = this.currentDirection === 'sr_to_en';
        const dirLabel = isSr ? '🇷🇸 Srpski (Popuni na srpskom)' : '🇬🇧 Engleski (Popuni na engleskom)';
        const poolCount = this.getPool(this.currentTheme, isSr).length;

        // Build category options HTML
        const categoryOptionsHtml = Object.values(this.THEMES).map(t => {
            const selected = t.key === this.currentTheme ? 'selected' : '';
            return `<option value="${t.key}" ${selected}>${t.icon} ${t.sr} (${t.countDesc})</option>`;
        }).join('');

        overlay.innerHTML = `
            <div class="flex flex-col items-center justify-start h-full bg-slate-900 p-6 w-full fade-in overflow-y-auto">
                <div class="w-full max-w-md my-auto flex flex-col items-center">
                    <div class="text-6xl mb-3 animate-bounce">🧩</div>
                    <h2 class="text-3xl font-black text-white mb-1 text-center tracking-tight">Popuni Prazninu</h2>
                    <p class="text-xs uppercase tracking-widest text-blue-400 font-bold mb-4">Cloze Context Mastery • 4,400+ Rečenica</p>

                    <!-- Control Panel (Direction & Script) -->
                    <div class="w-full bg-slate-800/80 border border-slate-700 rounded-2xl p-4 mb-4 flex flex-col gap-3 shadow-xl">
                        <!-- Direction Switcher -->
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-300">Smer Učenja:</span>
                            <button onclick="ClozeEngine.toggleDirection()" class="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 rounded-xl text-xs font-black text-blue-300 active:scale-95 transition-all">
                                ${this.currentDirection === 'sr_to_en' ? '🇷🇸 ➡️ 🇬🇧 Srpski' : '🇬🇧 ➡️ 🇷🇸 Engleski'} 🔄
                            </button>
                        </div>

                        <!-- Script Switcher -->
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-slate-300">Pismo Rečenica:</span>
                            <button onclick="ClozeEngine.toggleScript()" class="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 rounded-xl text-xs font-black text-purple-300 active:scale-95 transition-all">
                                ${this.currentScript === 'cyrillic' ? 'Ћирилица 🇷🇸' : 'Latinica 🔤'} 🔄
                            </button>
                        </div>

                        <!-- Thematic Category Selector -->
                        <div class="flex flex-col gap-1.5">
                            <label for="cloze-theme-select" class="text-xs font-bold text-slate-300">Tematska Oblast / Kategorija:</label>
                            <select id="cloze-theme-select" onchange="ClozeEngine.setTheme(this.value)" class="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold text-sm focus:border-blue-400 focus:outline-none">
                                ${categoryOptionsHtml}
                            </select>
                        </div>
                    </div>

                    <!-- Available sentences count banner -->
                    <div class="w-full text-center mb-5">
                        <span id="cloze-pool-counter" class="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-400">
                            ✨ Dostupno rečenica u ovoj temi: ${poolCount}
                        </span>
                    </div>

                    <!-- Session Mode Launch Buttons -->
                    <div class="flex flex-col gap-3 w-full">
                        <button onclick="ClozeEngine.startSession(10)" class="p-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-2xl active:scale-95 transition-all text-white font-black text-lg shadow-lg shadow-green-600/30 flex items-center justify-between px-6">
                            <span>⚡ Brza Seansa (10)</span>
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">+25 XP</span>
                        </button>

                        <button onclick="ClozeEngine.startSession(25)" class="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl active:scale-95 transition-all text-white font-black text-lg shadow-lg shadow-blue-600/30 flex items-center justify-between px-6">
                            <span>📚 Standardna (25)</span>
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">+60 XP</span>
                        </button>

                        <button onclick="ClozeEngine.startSession(50)" class="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl active:scale-95 transition-all text-white font-black text-lg shadow-lg shadow-purple-600/30 flex items-center justify-between px-6">
                            <span>🔥 Maraton (50)</span>
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">+150 XP</span>
                        </button>

                        <button onclick="ClozeEngine.startSession(0)" class="p-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-2xl active:scale-95 transition-all text-white font-black text-lg shadow-lg shadow-orange-600/30 flex items-center justify-between px-6">
                            <span>♾️ Beskonačni Trening</span>
                            <span class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-bold">Endless</span>
                        </button>

                        <button onclick="ArcadeEngine._hideOverlay()" class="mt-2 p-3 text-slate-400 font-bold hover:text-white transition-colors text-center text-sm">
                            Odustani / Nazad
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Toggles direction and refreshes menu
    toggleDirection: function() {
        this.currentDirection = this.currentDirection === 'sr_to_en' ? 'en_to_sr' : 'sr_to_en';
        this.openMenu();
    },

    // Toggles script and refreshes menu
    toggleScript: function() {
        this.currentScript = this.currentScript === 'cyrillic' ? 'latin' : 'cyrillic';
        this.openMenu();
    },

    // Sets category theme and updates pool counter
    setTheme: function(themeKey) {
        this.currentTheme = themeKey;
        const isSr = this.currentDirection === 'sr_to_en';
        const poolCount = this.getPool(themeKey, isSr).length;
        const counterEl = document.getElementById('cloze-pool-counter');
        if (counterEl) {
            counterEl.textContent = `✨ Dostupno rečenica u ovoj temi: ${poolCount}`;
        }
    },

    // Start practice session (count === 0 means infinite mode)
    startSession: function(count = 25) {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        const isInfinite = count === 0;
        const isSr = this.currentDirection === 'sr_to_en';
        const rawPool = this.getPool(this.currentTheme, isSr);

        if (!rawPool || rawPool.length === 0) {
            alert('Nema dostupnih rečenica za izabranu temu.');
            return;
        }

        // Shuffle pool using Fisher-Yates
        const shuffled = [...rawPool];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        const sentences = isInfinite ? shuffled : shuffled.slice(0, Math.min(count, shuffled.length));

        this.currentSession = {
            count: isInfinite ? 0 : sentences.length,
            isInfinite: isInfinite,
            sentences: sentences,
            idx: 0,
            score: 0,
            streak: 0,
            bestStreak: 0,
            correctCount: 0,
            wrongCount: 0
        };

        this.renderQuestion();
    },

    // Render active question in session
    renderQuestion: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        const sess = this.currentSession;
        if (!overlay || !sess) return;

        // Check completion condition
        if (!sess.isInfinite && sess.idx >= sess.sentences.length) {
            this.renderCompleteScreen();
            return;
        }

        // In infinite mode, loop through replenished shuffled pool when exhausted
        if (sess.isInfinite && sess.idx >= sess.sentences.length) {
            const isSr = this.currentDirection === 'sr_to_en';
            const fresh = [...this.getPool(this.currentTheme, isSr)].sort(() => Math.random() - 0.5);
            sess.sentences = sess.sentences.concat(fresh);
        }

        const s = sess.sentences[sess.idx];
        const isSr = s.isSr;
        const isCyr = this.currentScript === 'cyrillic';

        // Prepare displayed sentence with blank
        let displaySentence = s.displaySentence;
        let hintSentence = s.hintSentence;
        let answer = s.answer;

        // Apply Cyrillic script transliteration if target is Serbian and Cyrillic is active
        if (isSr && isCyr) {
            displaySentence = this.toCyrillic(displaySentence);
            answer = this.toCyrillic(answer);
        } else if (!isSr && isCyr) {
            hintSentence = this.toCyrillic(hintSentence);
        }

        // Animated highlighted blank
        const blankReplacement = `<span class="inline-block text-yellow-400 border-b-4 border-yellow-400 px-3 py-0.5 mx-1 font-black animate-pulse rounded bg-yellow-400/10">____</span>`;
        const renderedSentence = displaySentence.replace(/____|___/, blankReplacement);

        // Header progress and counter
        const progressPercent = sess.isInfinite ? 100 : Math.round((sess.idx / sess.count) * 100);
        const counterText = sess.isInfinite ? `♾️ #${sess.idx + 1}` : `${sess.idx + 1}/${sess.count}`;
        const themeInfo = this.THEMES[this.currentTheme] || this.THEMES['all'];

        overlay.innerHTML = `
            <div class="flex flex-col h-full bg-slate-900 text-white w-full select-none">
                <!-- Top Header Bar -->
                <div class="flex justify-between items-center px-4 py-3 bg-slate-800/90 border-b border-slate-700/80 shadow-md">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">🧩</span>
                        <div>
                            <span class="font-black text-sm tracking-tight text-white block">Popuni Prazninu</span>
                            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">${themeInfo.icon} ${themeInfo.sr}</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-3 text-xs font-black">
                        <span class="px-2 py-1 bg-slate-700/80 rounded-lg text-slate-300">${counterText}</span>
                        <span class="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">${sess.score} pts</span>
                        <span class="text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">${sess.streak}🔥</span>
                    </div>

                    <div class="flex items-center gap-2">
                        <!-- Script Quick Toggle -->
                        <button onclick="ClozeEngine.toggleInGameScript()" title="Promeni pismo (Latinica / Ћирилица)" class="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-black text-purple-300 transition-colors">
                            ${this.currentScript === 'cyrillic' ? 'Ћир' : 'Lat'}
                        </button>
                        <!-- Close button -->
                        <button onclick="ClozeEngine.promptExit()" class="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-700/60 hover:bg-red-600/80 text-lg font-black text-slate-300 hover:text-white transition-all">&times;</button>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-slate-800 h-1.5 overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-1.5 transition-all duration-300" style="width: ${progressPercent}%"></div>
                </div>

                <!-- Main Content Area -->
                <div class="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 text-center overflow-y-auto max-w-xl mx-auto w-full">
                    <!-- Category Badge & Star Button -->
                    <div class="flex items-center justify-between w-full mb-3 px-2">
                        <span class="text-[11px] font-black uppercase tracking-wider text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            ${themeInfo.icon} ${s.category || 'Reč'} ${s.pos ? `• ${s.pos}` : ''}
                        </span>
                        
                        <div class="flex items-center gap-1.5">
                            <!-- Native Audio Speaker Button -->
                            <button onclick="ClozeEngine.speakSentence()" title="Poslušaj rečenicu" class="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 active:scale-95 transition-all text-sm">
                                🔊
                            </button>
                            <!-- Star Flashcard Bookmark -->
                            <button id="cloze-star-btn" onclick="ClozeEngine.toggleStar('${s.id}')" title="Sačuvaj u Flashcards" class="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-400 border border-amber-500/30 active:scale-95 transition-all text-sm">
                                ★
                            </button>
                        </div>
                    </div>

                    <!-- Sentence Card -->
                    <div class="w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl mb-4 backdrop-blur-sm">
                        <div class="text-xl sm:text-2xl font-black mb-3 leading-relaxed text-white">
                            ${renderedSentence}
                        </div>
                        <div class="text-sm sm:text-base text-slate-400 font-medium italic mb-2">
                            "${hintSentence}"
                        </div>
                        ${s.phonetic ? `<div class="text-xs text-blue-400/80 font-mono mt-1">${s.phonetic}</div>` : ''}
                    </div>

                    <!-- Input & Action Area -->
                    <div class="w-full max-w-md flex flex-col gap-3">
                        <input type="text" id="cloze-input" autocomplete="off" autocapitalize="off" spellcheck="false"
                            class="w-full p-4 bg-slate-800 border-2 border-slate-600 rounded-2xl text-center text-xl sm:text-2xl font-black text-white focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20 transition-all shadow-inner"
                            placeholder="${isSr ? 'Upiši reč koja nedostaje...' : 'Type the missing word...'}">

                        <!-- Mobile Diacritic Keyboard Bar (for Serbian typing) -->
                        <div class="flex justify-center flex-wrap gap-1.5 w-full">
                            ${['č', 'ć', 'ž', 'š', 'đ', 'dž', 'lj', 'nj'].map(char => {
                                const displayChar = (isSr && isCyr) ? this.toCyrillic(char) : char;
                                return `
                                    <button onclick="ClozeEngine.insertChar('${displayChar}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-blue-600 active:text-white border border-slate-700 rounded-xl text-sm font-black text-slate-200 transition-all shadow-sm">
                                        ${displayChar}
                                    </button>
                                `;
                            }).join('')}
                        </div>

                        <!-- Submit Button -->
                        <button id="cloze-submit" onclick="ClozeEngine.submitAnswer()" class="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-lg font-black text-white active:scale-95 transition-all shadow-lg shadow-blue-600/30 mt-1">
                            Proveri Odgovor ✓
                        </button>
                        
                        <!-- Dynamic Result / Hint Notice -->
                        <div id="cloze-feedback" class="min-h-[28px] text-sm font-bold transition-all"></div>
                    </div>
                </div>
            </div>
        `;

        const input = document.getElementById('cloze-input');
        if (input) {
            setTimeout(() => input.focus(), 50);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') ClozeEngine.submitAnswer();
            });
        }
    },

    // Insert diacritic character at cursor position in input
    insertChar: function(char) {
        const input = document.getElementById('cloze-input');
        if (!input) return;
        const start = input.selectionStart || input.value.length;
        const end = input.selectionEnd || input.value.length;
        const val = input.value;
        input.value = val.slice(0, start) + char + val.slice(end);
        input.focus();
        input.setSelectionRange(start + char.length, start + char.length);
    },

    // In-game quick script toggle
    toggleInGameScript: function() {
        this.currentScript = this.currentScript === 'cyrillic' ? 'latin' : 'cyrillic';
        this.renderQuestion();
    },

    // Pronounce current sentence via multi-tier TTS
    speakSentence: function() {
        const sess = this.currentSession;
        if (!sess || !sess.sentences[sess.idx]) return;
        const s = sess.sentences[sess.idx];
        const isSr = s.isSr;
        const text = isSr ? s.fullSentence : s.fullSentence;
        const lang = isSr ? 'sr-RS' : 'en-US';

        if (window.app && typeof window.app.speakPhrase === 'function') {
            window.app.speakPhrase(text, lang);
        } else if ('speechSynthesis' in window) {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang;
            window.speechSynthesis.speak(u);
        }
    },

    // Toggle flashcard bookmark on active word
    toggleStar: function(wordId) {
        if (window.app && typeof window.app.toggleFlashcard === 'function') {
            window.app.toggleFlashcard(wordId);
            const btn = document.getElementById('cloze-star-btn');
            if (btn) {
                btn.classList.toggle('text-yellow-300');
                btn.classList.toggle('bg-yellow-400/40');
            }
        }
    },

    // Grade and check submitted answer
    submitAnswer: function() {
        const input = document.getElementById('cloze-input');
        const submitBtn = document.getElementById('cloze-submit');
        const feedback = document.getElementById('cloze-feedback');
        const sess = this.currentSession;

        if (!input || !submitBtn || !sess) return;
        const guess = input.value.trim();
        if (!guess) return;

        const s = sess.sentences[sess.idx];
        const isSr = s.isSr;
        const isCyr = this.currentScript === 'cyrillic';
        const targetAnswer = (isSr && isCyr) ? this.toCyrillic(s.answer) : s.answer;

        input.disabled = true;
        submitBtn.disabled = true;

        const result = this.checkMatch(guess, targetAnswer, s.baseWord, isSr);

        if (result.isCorrect) {
            // Correct Answer handling
            sess.streak++;
            if (sess.streak > sess.bestStreak) sess.bestStreak = sess.streak;
            sess.correctCount++;

            // Score formula: 100 base + streak bonus
            const streakBonus = Math.min(sess.streak * 10, 100);
            sess.score += 100 + streakBonus;

            if (window.app && window.app.playSound) window.app.playSound('correct');

            input.classList.remove('border-slate-600');
            input.classList.add('border-emerald-400', 'bg-emerald-950/40', 'text-emerald-300');

            if (feedback) {
                feedback.className = 'text-emerald-400 font-black text-sm animate-pulse';
                feedback.textContent = result.message || '🎯 Savršeno tačno!';
            }

            // Sync with SRS Engine if available (high quality recall)
            if (window.SRSEngine && typeof window.SRSEngine.processReview === 'function') {
                window.SRSEngine.processReview(s.id, 4);
            }

            sess.idx++;
            setTimeout(() => this.renderQuestion(), 1100);
        } else {
            // Incorrect Answer handling
            sess.streak = 0;
            sess.wrongCount++;

            if (window.app && window.app.playSound) window.app.playSound('wrong');

            input.classList.remove('border-slate-600');
            input.classList.add('border-rose-500', 'bg-rose-950/40', 'text-rose-300');

            if (feedback) {
                feedback.className = 'text-rose-400 font-bold text-sm';
                feedback.innerHTML = `❌ Netačno! Tačan odgovor: <strong class="text-white underline">${targetAnswer}</strong> ${s.baseWord && s.baseWord !== targetAnswer ? `(osnovni oblik: ${s.baseWord})` : ''}`;
            }

            // Record to Mistake Vault & Spaced Repetition queue
            if (window.state && window.state.mistakeLog) {
                window.state.mistakeLog[s.id] = (window.state.mistakeLog[s.id] || 0) + 1;
            }
            if (window.SRSEngine && typeof window.SRSEngine.processReview === 'function') {
                window.SRSEngine.processReview(s.id, 1);
            }

            sess.idx++;
            setTimeout(() => this.renderQuestion(), 2200);
        }
    },

    // Session completion celebration modal
    renderCompleteScreen: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        const sess = this.currentSession;
        if (!overlay || !sess) return;

        const totalAnswered = sess.correctCount + sess.wrongCount;
        const accuracy = totalAnswered > 0 ? Math.round((sess.correctCount / totalAnswered) * 100) : 100;
        const xpEarned = Math.max(10, Math.floor(sess.score / 10));

        // Award XP to user's profile
        if (window.app && typeof window.app.addXP === 'function') {
            window.app.addXP(xpEarned);
        }

        // Trigger confetti celebration on solid performance
        if (accuracy >= 70 && window.app && typeof window.app.confettiBurst === 'function') {
            window.app.confettiBurst();
        }

        overlay.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center select-none fade-in">
                <div class="w-full max-w-sm flex flex-col items-center">
                    <div class="text-6xl mb-4 animate-bounce">🏆</div>
                    <h2 class="text-3xl font-black text-yellow-400 mb-1">Seansa Završena!</h2>
                    <p class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-6">Cloze Context Mastery Rezultati</p>

                    <!-- Scoreboard Grid -->
                    <div class="grid grid-cols-2 gap-3 mb-6 w-full">
                        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center shadow-lg">
                            <span class="text-2xl font-black text-emerald-400">${sess.score}</span>
                            <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">UKUPNO BODOVA</span>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center shadow-lg">
                            <span class="text-2xl font-black text-amber-400">${sess.bestStreak}🔥</span>
                            <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">NAJVEĆI NIZ</span>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center shadow-lg">
                            <span class="text-2xl font-black text-blue-400">${accuracy}%</span>
                            <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">TAČNOST</span>
                        </div>
                        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col items-center shadow-lg">
                            <span class="text-2xl font-black text-purple-400">+${xpEarned} XP</span>
                            <span class="text-[10px] text-slate-400 font-black uppercase tracking-wider">NAGRADA</span>
                        </div>
                    </div>

                    <!-- Navigation Action Buttons -->
                    <div class="flex flex-col gap-3 w-full">
                        <button onclick="ClozeEngine.startSession(${sess.count})" class="w-full p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl text-lg font-black text-white active:scale-95 transition-all shadow-lg shadow-blue-600/30">
                            Igraj Ponovo 🔄
                        </button>
                        <button onclick="ClozeEngine.openMenu()" class="w-full p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-base font-black text-slate-200 active:scale-95 transition-all">
                            Izaberi Drugu Temu 🧩
                        </button>
                        <button onclick="ArcadeEngine._hideOverlay()" class="w-full p-3 text-slate-400 font-bold hover:text-white transition-colors text-sm">
                            Nazad u Arkadu
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Confirm session exit if streak active
    promptExit: function() {
        const sess = this.currentSession;
        if (sess && sess.isInfinite && sess.correctCount > 0) {
            this.renderCompleteScreen();
            return;
        }
        if (sess && sess.streak >= 5) {
            if (confirm('Imaš aktivan niz od ' + sess.streak + '🔥! Da li sigurno želiš da prekineš seansu?')) {
                this.renderCompleteScreen();
            }
        } else {
            ArcadeEngine._hideOverlay();
        }
    }
};

window.ClozeEngine = ClozeEngine;
