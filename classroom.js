// [SHIELD_DAEMON: VALIDATED] 🛡️
// classroom.js — Priority 54: "Učionica" Virtual School Syllabus & Homeroom Academy
// Standalone structured academic track alongside the casual Skill Tree
// 100% synchronized state: XP, Diamonds, streaks, and learned vocabulary sync between both modes

(function () {
    'use strict';

    // ─── SYLLABUS CURRICULUM ────────────────────────────────────────
    // Semesters -> 4-week thematic blocks -> 5 daily periods per week (Mon–Fri)
    // All categories verified against SEED_DATA (5,031 entries) & ALPHABET_DATA
    const SEMESTERS = [
        {
            id: 'sem1',
            name: 'Semestar 1: Osnovna Škola',
            nameEn: 'Semester 1: Elementary School',
            emoji: '🏫',
            weeks: [
                {
                    id: 'w1',
                    name: 'Zvuci i Pisma',
                    nameEn: 'Sounds & Alphabet',
                    emoji: '🔤',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Latinica: Osnove pisma (A–Z)', topicEn: 'Latin Alphabet Basics (A–Z)', categories: ['alphabet'], alphabetMode: 'alphabet_lat_print', focusType: 'alphabet', tipKey: 'alphabet_lat' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Ćirilica: Azbuka (А–Ш)', topicEn: 'Cyrillic Alphabet: Azbuka (А–Ш)', categories: ['alphabet'], alphabetMode: 'alphabet_cyr_print', focusType: 'alphabet', tipKey: 'alphabet_cyr' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Posebna slova: Č, Ć, Dž, Đ, Lj, Nj, Š, Ž', topicEn: 'Special Letters: Č, Ć, Dž, Đ, Lj, Nj, Š, Ž', categories: ['alphabet'], alphabetSpecial: true, alphabetMode: 'alphabet_lat_print', focusType: 'alphabet', tipKey: 'alphabet_special' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Izgovor slova i prvih reči', topicEn: 'Letter Sounds & First Words', categories: ['alphabet', 'basics'], alphabetMode: 'alphabet_lat_print', focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '📝 Nedeljni ispit: Zvuci i Pisma', topicEn: '📝 Weekly Exam: Sounds & Alphabet', categories: ['alphabet', 'basics'], alphabetMode: 'alphabet_cyr_print', isFriday: true, tipKey: 'exam' }
                    ]
                },
                {
                    id: 'w2',
                    name: 'Brojevi i Učtivost',
                    nameEn: 'Numbers & Politeness',
                    emoji: '🔢',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Brojevi 1–100', topicEn: 'Numbers 1–100', categories: ['numbers'], focusType: 'vocab', tipKey: 'numbers' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Vreme i osnovni pojmovi', topicEn: 'Time & Basic Expressions', categories: ['time', 'numbers'], focusType: 'vocab', tipKey: 'time' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Molim, Hvala, Izvinite', topicEn: 'Please, Thank You, Excuse Me', categories: ['phrases'], focusType: 'vocab', tipKey: 'politeness' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Pozdravi: Zdravo, Dobar dan, Ćao', topicEn: 'Greetings: Hello, Good Day, Bye', categories: ['phrases', 'basics'], focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '📝 Nedeljni ispit: Brojevi & Učtivost', topicEn: '📝 Weekly Exam: Numbers & Politeness', categories: ['numbers', 'phrases', 'basics', 'time'], isFriday: true, tipKey: 'exam' }
                    ]
                },
                {
                    id: 'w3',
                    name: 'Osnovne Imenice',
                    nameEn: 'Essential Nouns',
                    emoji: '📦',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Porodica: mama, otac, brat, sestra', topicEn: 'Family: Mom, Dad, Brother, Sister', categories: ['family'], focusType: 'vocab', tipKey: 'gender' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Hrana i Piće: hleb, voda, kafa', topicEn: 'Food & Drink: Bread, Water, Coffee', categories: ['food'], focusType: 'vocab', tipKey: 'gender' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Životinje: pas, mačka, ptica', topicEn: 'Animals: Dog, Cat, Bird', categories: ['animals'], focusType: 'vocab', tipKey: 'gender' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Kuća i Predmeti: sto, stolica, soba', topicEn: 'Home & Objects: Table, Chair, Room', categories: ['home', 'household'], focusType: 'vocab', tipKey: 'gender' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '📝 Nedeljni ispit: Osnovne Imenice', topicEn: '📝 Weekly Exam: Essential Nouns', categories: ['family', 'food', 'animals', 'home', 'household'], isFriday: true, tipKey: 'exam' }
                    ]
                },
                {
                    id: 'w4',
                    name: 'Rečenice i Glagol "Biti"',
                    nameEn: 'Sentences & Verb "To Be"',
                    emoji: '✍️',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Ja sam, Ti si, On/Ona je', topicEn: 'I am, You are, He/She is', categories: ['pronouns', 'basics'], focusType: 'grammar', tipKey: 'biti' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Pitanja: Ko? Šta? Gde? Da li?', topicEn: 'Questions: Who? What? Where? Do/Is?', categories: ['pronouns_interrogative', 'particles'], focusType: 'grammar', tipKey: 'questions' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Pridevi i Opisi: dobar, lep, velik', topicEn: 'Adjectives: Good, Nice, Big', categories: ['adjectives', 'basics'], focusType: 'grammar', tipKey: 'adjectives' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Prve cele rečenice u govoru', topicEn: 'First Full Spoken Sentences', categories: ['basics', 'phrases', 'pronouns'], focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '🎓 Završni ispit Semestra 1', topicEn: '🎓 Semester 1 Final Exam', categories: ['numbers', 'phrases', 'family', 'food', 'pronouns', 'basics'], isFriday: true, isFinal: true, tipKey: 'exam' }
                    ]
                }
            ]
        },
        {
            id: 'sem2',
            name: 'Semestar 2: Srednja Škola',
            nameEn: 'Semester 2: Intermediate Academy',
            emoji: '📚',
            weeks: [
                {
                    id: 'w5',
                    name: 'Boje, Dani i Vreme',
                    nameEn: 'Colors, Days & Weather',
                    emoji: '🌈',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Boje: crvena, plava, zelena', topicEn: 'Colors: Red, Blue, Green', categories: ['colors'], focusType: 'vocab', tipKey: 'adjectives' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Dani u nedelji i meseci', topicEn: 'Days of the Week & Months', categories: ['days', 'months'], focusType: 'vocab', tipKey: 'time' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Vremenska prognoza: sunce, kiša', topicEn: 'Weather: Sunny, Rain, Cold', categories: ['weather'], focusType: 'vocab', tipKey: 'vocab' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Razgovor o vremenu i planu dana', topicEn: 'Talking About Weather & Today', categories: ['weather', 'days', 'time'], focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '📝 Nedeljni ispit: Boje & Vreme', topicEn: '📝 Weekly Exam: Colors & Weather', categories: ['colors', 'days', 'months', 'weather'], isFriday: true, tipKey: 'exam' }
                    ]
                },
                {
                    id: 'w6',
                    name: 'Svakodnevni Glagoli',
                    nameEn: 'Everyday Verbs',
                    emoji: '🏃',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Osnovni glagoli: ići, jesti, piti', topicEn: 'Core Verbs: Go, Eat, Drink', categories: ['verbs'], focusType: 'vocab', tipKey: 'verbs' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Glagoli kretanja i dana', topicEn: 'Movement & Daily Action Verbs', categories: ['verbs_movement', 'verbs_daily'], focusType: 'vocab', tipKey: 'verbs' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Dnevna rutina i navike', topicEn: 'Daily Routine & Habits', categories: ['daily_routine', 'verbs'], focusType: 'grammar', tipKey: 'verbs' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Govorne rečenice sa glagolima', topicEn: 'Speaking Sentences with Verbs', categories: ['verbs', 'daily_routine'], focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '📝 Nedeljni ispit: Glagoli', topicEn: '📝 Weekly Exam: Everyday Verbs', categories: ['verbs', 'daily_routine', 'verbs_daily'], isFriday: true, tipKey: 'exam' }
                    ]
                },
                {
                    id: 'w7',
                    name: 'U Gradu i Prevoz',
                    nameEn: 'Around Town & Transport',
                    emoji: '🏙️',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Mesta: škola, grad, prodavnica', topicEn: 'Places: School, City, Shop', categories: ['places', 'city'], focusType: 'vocab', tipKey: 'vocab' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Prevoz i putovanja', topicEn: 'Transport & Travel', categories: ['transport', 'travel'], focusType: 'vocab', tipKey: 'vocab' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Pravci: levo, desno, pravo', topicEn: 'Directions: Left, Right, Straight', categories: ['directions', 'places'], focusType: 'grammar', tipKey: 'vocab' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Snalaženje u gradu (izgovor)', topicEn: 'City Navigation (Speaking)', categories: ['directions', 'transport', 'phrases'], focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '📝 Nedeljni ispit: U Gradu', topicEn: '📝 Weekly Exam: Around Town', categories: ['places', 'city', 'transport', 'directions'], isFriday: true, tipKey: 'exam' }
                    ]
                },
                {
                    id: 'w8',
                    name: 'Komunikacija i Život',
                    nameEn: 'Conversations & Life',
                    emoji: '💬',
                    days: [
                        { id: 'd1', name: 'Pon', nameEn: 'Mon', topic: 'Hrana i kupovina odeće', topicEn: 'Food & Clothing Basics', categories: ['food', 'clothing'], focusType: 'speaking', tipKey: 'vocab' },
                        { id: 'd2', name: 'Uto', nameEn: 'Tue', topic: 'Zdravlje i poseta lekaru', topicEn: 'Health & At the Doctor', categories: ['health', 'body'], focusType: 'vocab', tipKey: 'vocab' },
                        { id: 'd3', name: 'Sre', nameEn: 'Wed', topic: 'Posao, profesije i kancelarija', topicEn: 'Work, Professions & Office', categories: ['professions', 'office'], focusType: 'vocab', tipKey: 'vocab' },
                        { id: 'd4', name: 'Čet', nameEn: 'Thu', topic: 'Hobiji i svakodnevni izrazi', topicEn: 'Hobbies & Everyday Expressions', categories: ['hobbies', 'expressions'], focusType: 'speaking', tipKey: 'speaking' },
                        { id: 'd5', name: 'Pet', nameEn: 'Fri', topic: '🎓 Završni ispit Semestra 2', topicEn: '🎓 Semester 2 Final Exam', categories: ['food', 'health', 'professions', 'hobbies', 'places', 'verbs'], isFriday: true, isFinal: true, tipKey: 'exam' }
                    ]
                }
            ]
        }
    ];

    // ─── GRADE THRESHOLDS (Serbian 5–1 + US Letter A–F) ──────────────
    const GRADE_THRESHOLDS = [
        { min: 90, grade: '5', letter: 'A', label: 'Odličan', labelEn: 'Excellent', emoji: '⭐', color: 'text-yellow-500', bgBadge: 'bg-yellow-100 dark:bg-yellow-900/40 border-yellow-300 dark:border-yellow-700' },
        { min: 75, grade: '4', letter: 'B', label: 'Vrlo dobar', labelEn: 'Very Good', emoji: '👏', color: 'text-blue-500', bgBadge: 'bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700' },
        { min: 60, grade: '3', letter: 'C', label: 'Dobar', labelEn: 'Good', emoji: '👍', color: 'text-emerald-500', bgBadge: 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700' },
        { min: 45, grade: '2', letter: 'D', label: 'Dovoljan (Ponovi)', labelEn: 'Below Pass (Review)', emoji: '📝', color: 'text-orange-500', bgBadge: 'bg-orange-100 dark:bg-orange-900/40 border-orange-300 dark:border-orange-700' },
        { min: 0,  grade: '1', letter: 'F', label: 'Nedovoljan (Dopunska)', labelEn: 'Fail (Office Hours)', emoji: '📉', color: 'text-red-500', bgBadge: 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700' }
    ];

    // ─── TEACHER PERSONA (Profesorka Ana) ───────────────────────────
    const TEACHER = {
        name: 'Profesorka Ana',
        emoji: '👩‍🏫',
        greetingsSr: [
            'Dobrodošao/la na čas, {name}! Jesi li spreman/na?',
            'Zdravo, {name}! Hajde da danas napravimo odličan napredak.',
            'Lepo je videti te u klupi, {name}! Krećemo!',
            'Dobar dan, {name}! Otvaramo sveske i počinjemo čas.'
        ],
        greetingsEn: [
            'Welcome to class, {name}! Ready for today’s period?',
            'Hello, {name}! Let’s make solid progress today.',
            'Great to see you in homeroom, {name}! Let’s begin.',
            'Good day, {name}! Notebooks open — class is in session!'
        ],
        encouragementsSr: [
            'Odlično urađeno, {name}! Zaslužena ocena!',
            'Svaka čast, {name}! Lepo si savladao/la lekciju.',
            'Bravo, {name}! Iz časa u čas si sve sigurniji/ja.',
            'Fantastičan trud danas, {name}!'
        ],
        encouragementsEn: [
            'Well done, {name}! You earned a great mark today!',
            'Bravo, {name}! You mastered today’s material nicely.',
            'Great job, {name}! Your Serbian is getting stronger every class.',
            'Fantastic effort today, {name}!'
        ]
    };

    // Runtime-only ephemeral session state (never serialized into localStorage!)
    let _session = null;
    let _modalMode = null; // 'period' | 'summary'

    // ─── CORE STATE & ENVIRONMENT HELPERS ───────────────────────────
    const getAppState = () => {
        if (typeof state !== 'undefined') return state;
        if (typeof window !== 'undefined' && window.appState) return window.appState;
        return null;
    };

    const getState = () => {
        const st = getAppState();
        if (!st) {
            return {
                activeMode: false,
                completedDays: {},
                reportCards: {},
                diplomas: {},
                homeworkPacks: {},
                homeworkDone: {},
                officeHoursNeeded: {},
                officeHoursDone: {},
                fridayScores: {},
                audioSpeed: 1.0,
                totalClassroomXP: 0
            };
        }
        if (!st.classroom) {
            st.classroom = {
                activeMode: false,
                completedDays: {},
                reportCards: {},
                diplomas: {},
                homeworkPacks: {},
                homeworkDone: {},
                officeHoursNeeded: {},
                officeHoursDone: {},
                fridayScores: {},
                audioSpeed: 1.0,
                totalClassroomXP: 0
            };
        }
        const cs = st.classroom;
        if (!cs.completedDays) cs.completedDays = {};
        if (!cs.reportCards) cs.reportCards = {};
        if (!cs.diplomas) cs.diplomas = {};
        if (!cs.homeworkPacks) cs.homeworkPacks = {};
        if (!cs.homeworkDone) cs.homeworkDone = {};
        if (!cs.officeHoursNeeded) cs.officeHoursNeeded = {};
        if (!cs.officeHoursDone) cs.officeHoursDone = {};
        if (!cs.fridayScores) cs.fridayScores = {};
        if (typeof cs.audioSpeed !== 'number') cs.audioSpeed = 1.0;
        if (typeof cs.totalClassroomXP !== 'number') cs.totalClassroomXP = 0;
        return cs;
    };

    const isSerbianUI = () => {
        const st = getAppState();
        if (!st || !st.settings) return true;
        if (st.settings.hardcoreImmersion) return true;
        return st.settings.learningDirection !== 'en_to_sr';
    };

    const isCyrillicScript = () => {
        const st = getAppState();
        return !!(st && st.settings && (st.settings.script === 'cyrillic' || st.settings.appLanguage === 'sr_cyr'));
    };

    const localizeSr = (latText, cyrText) => {
        if (!isCyrillicScript()) return latText || '';
        if (cyrText) return cyrText;
        if (typeof window !== 'undefined' && window.app && typeof window.app.toCyrillic === 'function') {
            return window.app.toCyrillic(latText || '');
        }
        return latText || '';
    };

    const escHtml = (str) => String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const save = () => {
        if (typeof window !== 'undefined' && window.app && typeof window.app.saveStats === 'function') {
            window.app.saveStats();
        }
    };

    const getDayKey = (semIdx, weekIdx, dayIdx) => `sem${semIdx + 1}_w${weekIdx + 1}_d${dayIdx + 1}`;
    const getWeekKey = (semIdx, weekIdx) => `sem${semIdx + 1}_w${weekIdx + 1}`;

    const getStudentName = () => {
        const st = getAppState();
        if (st && st.user && st.user.name && st.user.name !== 'GUEST_USER') {
            return st.user.name;
        }
        return isSerbianUI() ? 'Učeniče' : 'Student';
    };

    const getGrade = (score) => {
        const s = Number(score) || 0;
        for (const g of GRADE_THRESHOLDS) {
            if (s >= g.min) return g;
        }
        return GRADE_THRESHOLDS[GRADE_THRESHOLDS.length - 1];
    };

    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const getPreviousDayMeta = (semIdx, weekIdx, dayIdx) => {
        if (dayIdx > 0) {
            return { semIdx, weekIdx, dayIdx: dayIdx - 1, day: SEMESTERS[semIdx].weeks[weekIdx].days[dayIdx - 1] };
        }
        if (weekIdx > 0) {
            const prevDays = SEMESTERS[semIdx].weeks[weekIdx - 1].days;
            return { semIdx, weekIdx: weekIdx - 1, dayIdx: prevDays.length - 1, day: prevDays[prevDays.length - 1] };
        }
        if (semIdx > 0) {
            const prevWeeks = SEMESTERS[semIdx - 1].weeks;
            const prevDays = prevWeeks[prevWeeks.length - 1].days;
            return { semIdx: semIdx - 1, weekIdx: prevWeeks.length - 1, dayIdx: prevDays.length - 1, day: prevDays[prevDays.length - 1] };
        }
        return null;
    };

    const isDayUnlocked = (semIdx, weekIdx, dayIdx) => {
        const cs = getState();
        if (semIdx === 0 && weekIdx === 0 && dayIdx === 0) return true;

        if (dayIdx > 0) {
            return !!cs.completedDays[getDayKey(semIdx, weekIdx, dayIdx - 1)];
        }
        if (weekIdx > 0) {
            const prevWeekKey = getWeekKey(semIdx, weekIdx - 1);
            const prevFridayKey = getDayKey(semIdx, weekIdx - 1, 4);
            if (!cs.completedDays[prevFridayKey]) return false;
            if (cs.officeHoursNeeded[prevWeekKey] && !cs.officeHoursDone[prevWeekKey]) return false;
            return true;
        }
        if (semIdx > 0) {
            const prevSem = SEMESTERS[semIdx - 1];
            const lastWeekIdx = prevSem.weeks.length - 1;
            const prevWeekKey = getWeekKey(semIdx - 1, lastWeekIdx);
            const prevFridayKey = getDayKey(semIdx - 1, lastWeekIdx, 4);
            if (!cs.completedDays[prevFridayKey]) return false;
            if (cs.officeHoursNeeded[prevWeekKey] && !cs.officeHoursDone[prevWeekKey]) return false;
            return true;
        }
        return false;
    };

    const countCompletedDays = () => Object.keys(getState().completedDays || {}).length;
    const countTotalDays = () => SEMESTERS.reduce((acc, s) => acc + s.weeks.reduce((wa, w) => wa + w.days.length, 0), 0);

    // ─── DATA & QUESTION BUILDING HELPERS ───────────────────────────
    const getSeedEntriesForCategories = (categories) => {
        const cats = Array.isArray(categories) ? categories.map(c => String(c).toLowerCase()) : ['basics'];
        const seedData = (typeof window !== 'undefined' && Array.isArray(window.SEED_DATA)) ? window.SEED_DATA : [];
        let list = seedData.filter(e => e && e.category && cats.includes(String(e.category).toLowerCase()));

        // Sort easiest difficulty first so classroom progression feels natural
        list = [...list].sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));

        // Merge BASICS_CATALOG fallback when querying 'basics' / 'phrases'
        if ((cats.includes('basics') || cats.includes('phrases')) && typeof window !== 'undefined' && Array.isArray(window.BASICS_CATALOG)) {
            const seen = new Set(list.map(e => (e.sr_lat || '').toLowerCase()));
            for (const b of window.BASICS_CATALOG) {
                const key = (b.sr_lat || '').toLowerCase();
                if (key && !seen.has(key)) {
                    seen.add(key);
                    list.push({
                        id: b.id,
                        en: b.en,
                        sr_lat: b.sr_lat,
                        sr_cyr: b.sr_cyr,
                        emoji: b.emoji,
                        phonetic: b.phonetic,
                        example_sr: b.sentence_sr,
                        example_en: b.sentence_en,
                        accepted_sr: b.accepted_sr,
                        accepted_en: b.accepted_en,
                        category: 'basics',
                        difficulty: 1
                    });
                }
            }
        }
        return list;
    };

    const getWhiteboardCardsForDay = (day, count = 6) => {
        const isSr = isSerbianUI();

        // Alphabet days: use authentic ALPHABET_DATA entries (Latin, Cyrillic, or 8 Special letters)
        if (day.focusType === 'alphabet' && typeof window !== 'undefined' && window.ALPHABET_DATA) {
            const isCyr = day.alphabetMode && day.alphabetMode.includes('cyr');
            const pool = isCyr ? window.ALPHABET_DATA.cyrillic : window.ALPHABET_DATA.latin;
            let chosen = pool;
            if (day.alphabetSpecial) {
                const specialSet = new Set(['Č', 'Ć', 'Dž', 'Đ', 'Lj', 'Nj', 'Š', 'Ž']);
                chosen = pool.filter(l => specialSet.has(l.upper));
            } else {
                // Pick representative starter + distinctive sounds (up to count)
                const picks = isCyr
                    ? ['А', 'Б', 'В', 'Ђ', 'Ж', 'Љ', 'Њ', 'Ћ', 'Џ', 'Ш']
                    : ['A', 'B', 'C', 'Č', 'Ć', 'D', 'Đ', 'J', 'Lj', 'Š'];
                chosen = picks.map(u => pool.find(l => l.upper === u)).filter(Boolean);
            }
            return chosen.slice(0, count).map(l => ({
                sr: `${l.upper} ${l.lower} — ${l.word}`,
                speakText: l.word,
                en: isSr ? `${l.en} • izgovor [${l.sound}]` : `${l.en} • sound [${l.sound}]`,
                phonetic: l.sound || '',
                emoji: l.emoji || '🔤',
                isAlphabet: true,
                badge: l.latinUpper ? `Ćir: ${l.upper} = Lat: ${l.latinUpper}` : `${l.upper} / ${l.lower}`
            }));
        }

        // Standard vocab / grammar / speaking day
        const entries = getSeedEntriesForCategories(day.categories);
        const step = Math.max(1, Math.floor(entries.length / Math.max(count * 2, 1)));
        const picked = [];
        for (let i = 0; i < entries.length && picked.length < count; i += Math.min(step, 2)) {
            picked.push(entries[i]);
        }
        // Fallback fill if step skipped too many
        if (picked.length < count) {
            for (const e of entries) {
                if (picked.length >= count) break;
                if (!picked.includes(e)) picked.push(e);
            }
        }

        return picked.map(e => ({
            id: e.id,
            sr: localizeSr(e.sr_lat || e.sr, e.sr_cyr),
            speakText: e.sr_lat || e.sr,
            en: e.en || '',
            phonetic: e.phonetic || '',
            emoji: e.emoji || '📝',
            example_sr: e.example_sr ? localizeSr(e.example_sr) : '',
            example_en: e.example_en || ''
        }));
    };

    const getGrammarCalloutHtml = (day, isSr) => {
        const key = day.tipKey || day.focusType || 'vocab';
        const tips = {
            alphabet_lat: {
                title: isSr ? 'Pravilo srpskog pisma' : 'Serbian Orthography Rule',
                body: isSr
                    ? '„Piši kao što govoriš“ — srpska latinica ima 30 slova i svako slovo uvek predstavlja tačno jedan glas!'
                    : '"Write as you speak" — Serbian Latin has 30 phonetic letters where every letter makes one consistent sound!'
            },
            alphabet_cyr: {
                title: isSr ? 'Azbuka (Ćirilica)' : 'Cyrillic Azbuka',
                body: isSr
                    ? 'Svako od 30 slova ćirilice ima 1-na-1 par u latinici. Obrati pažnju: В = V, Н = N, Р = R, С = S, Х = H!'
                    : 'All 30 Cyrillic letters map 1-to-1 to Latin. Watch look-alikes: В = V, Н = N, Р = R, С = S, Х = H!'
            },
            alphabet_special: {
                title: isSr ? 'Tvrdi vs. Meki glasovi' : 'Hard vs. Soft Digraphs & Diacritics',
                body: isSr
                    ? '<b>Č</b> (tvrdo) vs <b>Ć</b> (meko) • <b>Dž</b> (tvrdo) vs <b>Đ</b> (meko) • <b>Lj</b> i <b>Nj</b> su jedno slovo!'
                    : '<b>Č</b> (hard "ch") vs <b>Ć</b> (soft "ty") • <b>Dž</b> (hard "j") vs <b>Đ</b> (soft "dy") • <b>Lj</b> & <b>Nj</b> count as single letters!'
            },
            biti: {
                title: isSr ? 'Konjugacija glagola BITI (To Be)' : 'Conjugation of Verb BITI (To Be)',
                body: isSr
                    ? '<b>Ja sam</b> (I am) • <b>Ti si</b> (You are) • <b>On/Ona je</b> (He/She is) • <b>Mi smo</b> • <b>Vi ste</b> • <b>Oni su</b>'
                    : '<b>Ja sam</b> (I am) • <b>Ti si</b> (You are) • <b>On/Ona je</b> (He/She is) • <b>Mi smo</b> (We are) • <b>Vi ste</b> (You are) • <b>Oni su</b> (They are)'
            },
            questions: {
                title: isSr ? 'Postavljanje pitanja u srpskom' : 'Forming Questions in Serbian',
                body: isSr
                    ? 'Koristimo <b>„Da li...?”</b> na početku rečenice (npr. <i>Da li govoriš srpski?</i>) ili upitne reči <b>Ko, Šta, Gde, Kada</b>.'
                    : 'Start yes/no questions with <b>"Da li...?"</b> (e.g. <i>Da li govoriš srpski?</i>), or use <b>Ko</b> (Who), <b>Šta</b> (What), <b>Gde</b> (Where).'
            },
            adjectives: {
                title: isSr ? 'Slaganje prideva po rodu' : 'Adjective Gender Agreement',
                body: isSr
                    ? 'Pridevi prate rod imenice: <b>dobar</b> čovek (m), <b>dobra</b> žena (ž), <b>dobro</b> dete (s).'
                    : 'Adjectives match noun gender: <b>dobar</b> (masc.), <b>dobra</b> (fem. -a), <b>dobro</b> (neut. -o).'
            },
            gender: {
                title: isSr ? 'Tri roda imenica' : 'Three Noun Genders',
                body: isSr
                    ? 'Muški rod obično završava suglasnikom (<i>brat, sto</i>), ženski na <b>-a</b> (<i>kuća, mama</i>), srednji na <b>-o / -e</b> (<i>mleko, dete</i>).'
                    : 'Masculine usually ends in a consonant (<i>brat</i>), feminine in <b>-a</b> (<i>kuća</i>), neuter in <b>-o / -e</b> (<i>mleko, dete</i>).'
            },
            verbs: {
                title: isSr ? 'Sadašnje vreme glagola' : 'Present Tense Endings',
                body: isSr
                    ? 'U 1. licu jednine (Ja) glagoli obično završavaju na <b>-m</b>: <i>radim, učim, čitam, idem</i>!'
                    : 'First-person singular ("Ja" / I) almost always ends in <b>-m</b>: <i>radim, učim, čitam, idem</i> (no pronoun required)!'
            },
            politeness: {
                title: isSr ? 'Ti vs. Vi (Učtivost)' : 'Informal "Ti" vs. Formal "Vi"',
                body: isSr
                    ? 'Sa prijateljima i decom kažemo <b>Ti</b> (<i>Kako si?</i>), a starijima i u prodavnici <b>Vi</b> (<i>Kako ste? / Izvinite</i>).'
                    : 'Use <b>Ti</b> (<i>Kako si?</i>) with friends/peers, and <b>Vi</b> (<i>Kako ste? / Izvinite</i>) with elders or in shops.'
            },
            numbers: {
                title: isSr ? 'Brojevi i imenice' : 'Numbers & Noun Forms',
                body: isSr
                    ? 'Posle brojeva 2, 3, 4 ide genitiv jednine (<i>dva brata</i>), a od 5 nadalje genitiv množine (<i>pet prijatelja</i>).'
                    : 'After 2–4 nouns take genitive singular (<i>dva brata</i>); after 5+ they take genitive plural (<i>pet prijatelja</i>).'
            },
            speaking: {
                title: isSr ? 'Savet za izgovor' : 'Pronunciation Tip',
                body: isSr
                    ? 'Čitaj razgovetno sa čistim samoglasnicima (A, E, I, O, U se uvek čitaju isto bez gutanja glasova).'
                    : 'Pronounce every vowel cleanly (A=ah, E=eh, I=ee, O=oh, U=oo) without reducing unstressed syllables.'
            },
            exam: {
                title: isSr ? 'Pravila nedeljnog ispita' : 'Weekly Exam Rules',
                body: isSr
                    ? 'Pokaži sve što si naučio/la ove nedelje! Dijamantska pomoć (💡) je isključena. Prolaz: 60%+ (ocena 3/C+).'
                    : 'Demonstrate what you learned this week! Diamond hints (💡) are locked during exams. Passing score: 60%+ (C / 3).'
            },
            vocab: {
                title: isSr ? 'Aktivno pamćenje reči' : 'Active Vocabulary Strategy',
                body: isSr
                    ? 'Slušaj izgovor svake nove reči klikom na 🔊 i poveži je sa primerom rečenice!'
                    : 'Tap 🔊 on every card to hear native pronunciation and connect each word to a real sentence!'
            }
        };
        const t = tips[key] || tips.vocab;
        return `
            <div class="mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/70 rounded-xl p-3 text-left">
                <p class="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">💡 ${t.title}</p>
                <p class="text-xs font-medium text-amber-900 dark:text-amber-100 leading-relaxed">${t.body}</p>
            </div>`;
    };

    const buildLessonQuestions = async (day, count, options = {}) => {
        const qe = (typeof window !== 'undefined' && window.QuestionEngine) ? window.QuestionEngine : null;
        const db = (typeof window !== 'undefined' && window.appDb) ? window.appDb : null;
        const cats = day.categories || ['basics'];
        const allowVoice = options.allowVoice !== false;
        let questions = [];

        // 1. Alphabet-heavy days use QuestionEngine.generateAlphabetLesson
        if (day.alphabetMode && qe && typeof qe.generateAlphabetLesson === 'function') {
            try {
                let alphaQs = await qe.generateAlphabetLesson(day.alphabetMode, count + 3);
                // Replace raw alphabet_voice (which lacks quiet-mode skip button) with safe speaking or alphabet_listen
                alphaQs = alphaQs.map(q => {
                    if (q.type === 'alphabet_voice' && q.targetLetter) {
                        if (!allowVoice) return null;
                        return qe.generateSpeaking({
                            id: 'alpha_' + q.targetLetter.upper,
                            sr_lat: q.targetLetter.word,
                            en: q.targetLetter.en || q.targetLetter.word
                        });
                    }
                    return q;
                }).filter(Boolean);
                questions = questions.concat(alphaQs);
            } catch (e) { /* fall back below */ }
        }

        // 2. Pull standard category questions using QuestionEngine.generateLesson
        if (questions.length < count && qe && db) {
            const perCat = Math.max(3, Math.ceil((count - questions.length) / Math.max(cats.length, 1)) + 2);
            const qMode = (day.focusType === 'speaking' && allowVoice) ? 'speaking' : 'standard';
            for (const cat of cats) {
                if (cat === 'alphabet') continue; // handled above
                try {
                    const catQs = await qe.generateLesson(cat, db, perCat, qMode);
                    if (Array.isArray(catQs) && catQs.length) {
                        questions = questions.concat(catQs);
                    }
                } catch (e) { /* try next category */ }
            }
        }

        // 3. Filter voice if disallowed before filling remainder via SEED_DATA so exact count is preserved
        if (!allowVoice) {
            questions = questions.filter(q => q && q.type !== 'speaking' && q.type !== 'spelling_voice' && q.type !== 'alphabet_voice');
        }

        // 4. Direct SEED_DATA fallback using real QuestionEngine generators to reach exact count
        if (questions.length < count) {
            const entries = getSeedEntriesForCategories(cats);
            const fallbackPool = entries.length >= 4
                ? entries
                : ((typeof window !== 'undefined' && Array.isArray(window.SEED_DATA)) ? window.SEED_DATA : []);

            if (qe && fallbackPool.length >= 4) {
                const shuffled = qe.shuffle(fallbackPool);
                for (let i = 0; i < shuffled.length && questions.length < count; i++) {
                    const w = shuffled[i];
                    let q = null;
                    if (w.example_en && w.example_sr && i % 4 === 1) {
                        q = qe.generateWordOrder(w);
                    } else if (i % 4 === 2) {
                        q = qe.generateListening(w, fallbackPool);
                    } else if (i % 4 === 3 && w.emoji) {
                        q = qe.generatePictureChoice(w, fallbackPool);
                    }
                    if (!q) q = qe.generateMultipleChoice(w, fallbackPool);
                    if (q) {
                        q.wordId = q.wordId || w.id;
                        questions.push(q);
                    }
                }
            }
        }

        if (!allowVoice) {
            questions = questions.filter(q => q && q.type !== 'speaking' && q.type !== 'spelling_voice' && q.type !== 'alphabet_voice');
        }

        return (qe ? qe.shuffle(questions) : questions).slice(0, count);
    };

    const getDomainForQuestionType = (type) => {
        if (!type) return 'vocabulary';
        if (['speaking', 'listening', 'alphabet_voice', 'alphabet_listen', 'spelling_voice'].includes(type)) {
            return 'pronunciation';
        }
        if (['fill_blank', 'word_order', 'drag_punctuation'].includes(type)) {
            return 'grammar';
        }
        return 'vocabulary';
    };

    // ─── RENDER: UČIONICA HOME VIEW ─────────────────────────────────
    const renderClassroomView = () => {
        const container = document.getElementById('classroom-content');
        if (!container) return;

        const cs = getState();
        const isSr = isSerbianUI();
        const completed = countCompletedDays();
        const total = countTotalDays();
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Calculate overall GPA from earned report cards
        const reportEntries = Object.values(cs.reportCards || {});
        const avgOverall = reportEntries.length > 0
            ? Math.round(reportEntries.reduce((sum, rc) => sum + (rc.overall || 0), 0) / reportEntries.length)
            : null;
        const avgGrade = avgOverall !== null ? getGrade(avgOverall) : null;

        let html = '';

        // Teacher Homeroom Welcome Card
        const greeting = randomPick(isSr ? TEACHER.greetingsSr : TEACHER.greetingsEn).replace('{name}', escHtml(getStudentName()));
        html += `
        <div class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/40 border-2 border-indigo-200 dark:border-indigo-800/70 rounded-2xl p-4 mb-4 shadow-sm">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 shrink-0 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-3xl shadow-sm border border-indigo-200 dark:border-indigo-700">
                    ${TEACHER.emoji}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                        <p class="text-sm font-black text-indigo-900 dark:text-indigo-100 truncate">${TEACHER.name}</p>
                        ${avgGrade ? `<span class="shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${avgGrade.bgBadge} ${avgGrade.color}">${isSr ? 'Prosek' : 'GPA'}: ${avgGrade.grade} (${avgGrade.letter})</span>` : ''}
                    </div>
                    <p class="text-xs text-indigo-700 dark:text-indigo-300 font-medium mt-0.5">${greeting}</p>
                </div>
            </div>
            <div class="mt-3 pt-2.5 border-t border-indigo-200/70 dark:border-indigo-700/60">
                <div class="flex justify-between text-[11px] font-black text-indigo-700 dark:text-indigo-300 mb-1">
                    <span>${isSr ? 'Školski napredak' : 'Academic Progress'}</span>
                    <span>${completed}/${total} ${isSr ? 'časova' : 'periods'} (${pct}%)</span>
                </div>
                <div class="w-full h-2.5 bg-indigo-200/60 dark:bg-indigo-800/60 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                </div>
            </div>
        </div>`;

        // Semesters & Weeks Accordion
        SEMESTERS.forEach((sem, semIdx) => {
            const semDiploma = cs.diplomas && cs.diplomas[sem.id];
            html += `
            <div class="mb-5">
                <div class="flex items-center justify-between gap-2 mb-2.5 px-1">
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-xl shrink-0">${sem.emoji}</span>
                        <h3 class="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-wider truncate">${isSr ? sem.name : sem.nameEn}</h3>
                    </div>
                    ${semDiploma ? `<button onclick="ClassroomEngine.showDiplomaModal('${sem.id}')" class="shrink-0 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-[10px] uppercase tracking-wider shadow-sm active:scale-95 transition-transform cursor-pointer flex items-center gap-1"><span>🎓</span><span>${isSr ? 'Diploma' : 'Diploma'}</span></button>` : ''}
                </div>`;

            sem.weeks.forEach((week, weekIdx) => {
                const weekKey = getWeekKey(semIdx, weekIdx);
                const reportCard = cs.reportCards[weekKey];
                const needsOffice = !!(cs.officeHoursNeeded[weekKey] && !cs.officeHoursDone[weekKey]);
                const doneInWeek = week.days.filter((_, di) => !!cs.completedDays[getDayKey(semIdx, weekIdx, di)]).length;

                html += `
                <div class="bg-white dark:bg-slate-800 border-2 ${needsOffice ? 'border-amber-300 dark:border-amber-700' : 'border-slate-200 dark:border-slate-700'} rounded-2xl mb-3 overflow-hidden shadow-sm">
                    <div class="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between cursor-pointer select-none"
                         onclick="ClassroomEngine.toggleWeek('${weekKey}')">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <span class="text-lg shrink-0">${week.emoji}</span>
                            <div class="min-w-0">
                                <p class="text-[13px] font-black text-slate-800 dark:text-white truncate">${isSr ? week.name : week.nameEn}</p>
                                <p class="text-[10px] font-bold text-slate-400">${isSr ? `Nedelja ${weekIdx + 1}` : `Week ${weekIdx + 1}`} • ${doneInWeek}/5</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            ${reportCard ? `<span class="text-[11px] font-black px-2 py-0.5 rounded-lg border ${getGrade(reportCard.overall).bgBadge} ${getGrade(reportCard.overall).color}">${getGrade(reportCard.overall).grade}/${getGrade(reportCard.overall).letter}</span>` : ''}
                            <span id="week-chevron-${weekKey}" class="text-slate-400 text-xs transition-transform duration-200">▼</span>
                        </div>
                    </div>

                    <div id="week-body-${weekKey}" class="hidden divide-y divide-slate-100 dark:divide-slate-700/60">`;

                week.days.forEach((day, dayIdx) => {
                    const dayKey = getDayKey(semIdx, weekIdx, dayIdx);
                    const unlocked = isDayUnlocked(semIdx, weekIdx, dayIdx);
                    const completedInfo = cs.completedDays[dayKey];
                    const dayScore = completedInfo ? completedInfo.score : null;
                    const dayGrade = dayScore !== null ? getGrade(dayScore) : null;

                    const statusIcon = completedInfo
                        ? `<span class="text-base ${dayGrade.color}">${dayGrade.emoji}</span>`
                        : (unlocked ? '<span class="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">START</span>' : '<span class="text-sm">🔒</span>');
                    const rowStyle = unlocked
                        ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-slate-700/40 active:scale-[0.99]'
                        : 'opacity-50 cursor-not-allowed';
                    const clickHandler = unlocked
                        ? (completedInfo ? `onclick="ClassroomEngine.showDaySummary('${dayKey}', ${semIdx}, ${weekIdx}, ${dayIdx})"` : `onclick="ClassroomEngine.startDay(${semIdx}, ${weekIdx}, ${dayIdx})"`)
                        : '';

                    html += `
                        <div class="px-4 py-3 flex items-center gap-3 transition-all ${rowStyle}" ${clickHandler}>
                            <div class="w-9 h-9 shrink-0 rounded-xl ${day.isFriday ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} flex items-center justify-center text-xs font-black">
                                ${isSr ? day.name : day.nameEn}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">${isSr ? day.topic : day.topicEn}</p>
                                ${dayScore !== null
                                    ? `<p class="text-[10px] font-black ${dayGrade.color}">${isSr ? 'Ocena' : 'Grade'} ${dayGrade.grade}/${dayGrade.letter} (${dayScore}%)</p>`
                                    : `<p class="text-[10px] font-medium text-slate-400">${day.isFriday ? (isSr ? 'Nedeljni ispit (60%+ za prolaz)' : 'Cumulative Exam (60%+ pass)') : (isSr ? '5 faza • ~15 min' : '5-part period • ~15 min')}</p>`}
                            </div>
                            <div class="shrink-0">${statusIcon}</div>
                        </div>`;
                });

                // Office Hours (Dopunska Nastava) if Friday exam failed
                if (needsOffice) {
                    html += `
                        <div class="px-4 py-3 bg-amber-50 dark:bg-amber-950/40 flex items-center gap-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/50 active:scale-[0.99] transition-all"
                             onclick="ClassroomEngine.startOfficeHours(${semIdx}, ${weekIdx})">
                            <div class="w-9 h-9 shrink-0 rounded-xl bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-base">📖</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-black text-amber-800 dark:text-amber-200">${isSr ? 'Dopunska Nastava (Office Hours)' : 'Office Hours (Remedial Review)'}</p>
                                <p class="text-[10px] font-bold text-amber-600 dark:text-amber-400">${isSr ? 'Prijateljsko ponavljanje (5 min) da otključaš sledeći ponedeljak' : 'Friendly 5-min review to unlock next Monday'}</p>
                            </div>
                            <span class="text-xs font-black px-2 py-1 rounded-lg bg-amber-500 text-white">5 MIN</span>
                        </div>`;
                }

                // Pending Homework review rows for this week
                week.days.forEach((_, di) => {
                    const dk = getDayKey(semIdx, weekIdx, di);
                    if (cs.completedDays[dk] && Array.isArray(cs.homeworkPacks[dk]) && cs.homeworkPacks[dk].length > 0 && !cs.homeworkDone[dk]) {
                        const dLabel = isSr ? week.days[di].name : week.days[di].nameEn;
                        html += `
                        <div class="px-4 py-2.5 bg-purple-50 dark:bg-purple-950/30 flex items-center gap-3 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/40 active:scale-[0.99] transition-all"
                             onclick="ClassroomEngine.startHomework('${dk}')">
                            <div class="w-8 h-8 shrink-0 rounded-xl bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-sm">📓</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-xs font-black text-purple-700 dark:text-purple-300 truncate">${isSr ? `Domaći (${dLabel})` : `Homework (${dLabel})`}</p>
                                <p class="text-[10px] font-bold text-purple-500">${isSr ? '3 brze kartice za večernje utvrđivanje' : '3 quick cards for evening reinforcement'}</p>
                            </div>
                            <span class="text-xs font-black text-purple-600 dark:text-purple-300 animate-pulse">✏️ +5 XP</span>
                        </div>`;
                    }
                });

                html += `</div></div>`;
            });

            html += `</div>`;
        });

        // Dnevnik & Svedočanstvo (Report Card Section)
        html += renderReportCardSection();

        container.innerHTML = html;
        autoExpandCurrentWeek();
    };

    const autoExpandCurrentWeek = () => {
        const cs = getState();
        for (let si = 0; si < SEMESTERS.length; si++) {
            for (let wi = 0; wi < SEMESTERS[si].weeks.length; wi++) {
                const wk = getWeekKey(si, wi);
                const needsOffice = !!(cs.officeHoursNeeded[wk] && !cs.officeHoursDone[wk]);
                const hasIncomplete = SEMESTERS[si].weeks[wi].days.some((_, di) => !cs.completedDays[getDayKey(si, wi, di)]);
                if (needsOffice || hasIncomplete) {
                    const body = document.getElementById(`week-body-${wk}`);
                    const chevron = document.getElementById(`week-chevron-${wk}`);
                    if (body) body.classList.remove('hidden');
                    if (chevron) chevron.style.transform = 'rotate(180deg)';
                    return;
                }
            }
        }
    };

    const renderReportCardSection = () => {
        const cs = getState();
        const isSr = isSerbianUI();
        const cards = Object.entries(cs.reportCards || {});
        const diplomas = Object.values(cs.diplomas || {});
        if (cards.length === 0 && diplomas.length === 0) return '';

        let html = `<div class="mt-4 mb-6 space-y-4">`;

        if (diplomas.length > 0) {
            html += `
            <div>
                <h3 class="text-xs font-black text-amber-500 uppercase tracking-wider mb-2.5 flex items-center gap-2 px-1">
                    <span>🎓</span> ${isSr ? 'Zaslužene Diplome (Certificates)' : 'Earned Diplomas (Certificates)'}
                </h3>
                <div class="space-y-2">
                    ${diplomas.map(d => `
                        <div onclick="ClassroomEngine.showDiplomaModal('${escHtml(d.semesterId)}')"
                             class="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100/80 dark:from-amber-950/50 dark:via-yellow-950/30 dark:to-amber-900/40 border-2 border-amber-300 dark:border-amber-700/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm cursor-pointer active:scale-[0.99] transition-transform">
                            <div class="flex items-center gap-3 min-w-0">
                                <div class="w-10 h-10 shrink-0 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-2xl">🎓</div>
                                <div class="min-w-0">
                                    <p class="text-xs font-black text-amber-900 dark:text-amber-100 truncate">${escHtml(isSr ? d.name : d.nameEn)}</p>
                                    <p class="text-[10px] font-bold text-amber-700 dark:text-amber-300">${isSr ? 'Ocena' : 'Grade'} ${escHtml(d.grade)}/${escHtml(d.letter)} (${d.avgScore}%) • ${escHtml(d.date)}</p>
                                </div>
                            </div>
                            <span class="shrink-0 text-[10px] font-black px-2.5 py-1 rounded-xl bg-amber-500 text-white uppercase tracking-wider">${isSr ? 'Otvori' : 'View'}</span>
                        </div>`).join('')}
                </div>
            </div>`;
        }

        if (cards.length > 0) {
            html += `
            <div>
                <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2 px-1">
                    <span>📋</span> ${isSr ? 'Dnevnik & Svedočanstvo (Report Cards)' : 'Dnevnik & Report Cards'}
                </h3>
                <div class="space-y-2">`;

            cards.forEach(([weekKey, card]) => {
                const grade = getGrade(card.overall);
                const m = weekKey.match(/sem(\d+)_w(\d+)/);
                let weekName = weekKey;
                if (m) {
                    const si = parseInt(m[1], 10) - 1;
                    const wi = parseInt(m[2], 10) - 1;
                    if (SEMESTERS[si] && SEMESTERS[si].weeks[wi]) {
                        weekName = `${SEMESTERS[si].weeks[wi].emoji} ${isSr ? SEMESTERS[si].weeks[wi].name : SEMESTERS[si].weeks[wi].nameEn}`;
                    }
                }

                html += `
                    <div class="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
                        <div class="min-w-0 flex-1">
                            <p class="text-xs font-black text-slate-800 dark:text-white truncate">${weekName}</p>
                            <div class="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                <span>📖 ${isSr ? 'Vokabular' : 'Vocab'}: <strong class="text-slate-700 dark:text-slate-200">${card.vocab}%</strong></span>
                                <span>📝 ${isSr ? 'Gramatika' : 'Grammar'}: <strong class="text-slate-700 dark:text-slate-200">${card.grammar}%</strong></span>
                                <span>🎙️ ${isSr ? 'Izgovor' : 'Pronunciation'}: <strong class="text-slate-700 dark:text-slate-200">${card.pronunciation}%</strong></span>
                            </div>
                        </div>
                        <div class="text-center shrink-0 px-2.5 py-1 rounded-xl border ${grade.bgBadge}">
                            <div class="text-lg font-black leading-none ${grade.color}">${grade.grade} <span class="text-xs">(${grade.letter})</span></div>
                            <div class="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">${isSr ? grade.label : grade.labelEn}</div>
                        </div>
                    </div>`;
            });

            html += `</div></div>`;
        }

        html += `</div>`;
        return html;
    };

    const toggleWeek = (weekKey) => {
        const body = document.getElementById(`week-body-${weekKey}`);
        const chevron = document.getElementById(`week-chevron-${weekKey}`);
        if (!body) return;
        const wasHidden = body.classList.contains('hidden');
        body.classList.toggle('hidden');
        if (chevron) chevron.style.transform = wasHidden ? 'rotate(180deg)' : '';
    };

    // ─── 5-PART DAILY PERIOD FLOW ───────────────────────────────────
    const startDay = (semIdx, weekIdx, dayIdx, forceRetake = false) => {
        const cs = getState();
        const dayKey = getDayKey(semIdx, weekIdx, dayIdx);
        if (!isDayUnlocked(semIdx, weekIdx, dayIdx)) {
            if (window.app && window.app.showToast) {
                window.app.showToast(isSerbianUI() ? '🔒 Završi prethodni čas prvo!' : '🔒 Complete the previous class first!', 'error');
            }
            return;
        }
        if (cs.completedDays[dayKey] && !forceRetake) {
            showDaySummary(dayKey, semIdx, weekIdx, dayIdx);
            return;
        }

        const sem = SEMESTERS[semIdx];
        const week = sem.weeks[weekIdx];
        const day = week.days[dayIdx];
        const boardCards = getWhiteboardCardsForDay(day, 6);

        _modalMode = 'period';
        _session = {
            kind: 'day',
            semIdx,
            weekIdx,
            dayIdx,
            dayKey,
            day,
            week,
            sem,
            phase: 0, // 0=RollCall, 1=Whiteboard, 2=GuidedPractice, 3=PopQuiz/Exam, 4=HomeworkDismissal
            boardCards,
            practiceStats: { correct: 0, total: 0 },
            quizStats: { correct: 0, total: 0 },
            domains: {
                vocabulary: { c: 0, t: 0 },
                grammar: { c: 0, t: 0 },
                pronunciation: { c: 0, t: 0 }
            }
        };

        openClassroomModal();
        renderPhase();
    };

    const openClassroomModal = () => {
        const overlay = document.getElementById('classroom-lesson-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
    };

    const closeClassroomOverlay = () => {
        const overlay = document.getElementById('classroom-lesson-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
        }
        if (_modalMode === 'summary') {
            _modalMode = null;
        }
    };

    const getAudioSpeed = () => {
        const cs = getState();
        return cs.audioSpeed === 0.75 ? 0.75 : 1.0;
    };

    const toggleAudioSpeed = () => {
        const cs = getState();
        cs.audioSpeed = (cs.audioSpeed === 0.75) ? 1.0 : 0.75;
        save();
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');

        const isSlow = cs.audioSpeed === 0.75;
        const speedBtns = document.querySelectorAll('.classroom-speed-btn');
        speedBtns.forEach(btn => {
            btn.textContent = isSlow ? '🐢 0.75x' : '🐇 1.0x';
            btn.className = isSlow
                ? 'classroom-speed-btn px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-200 font-black text-[10px] tracking-wider active:scale-95 transition-all cursor-pointer'
                : 'classroom-speed-btn px-2.5 py-1 rounded-full bg-slate-600/60 border border-slate-500/60 text-slate-200 font-black text-[10px] tracking-wider active:scale-95 transition-all cursor-pointer';
        });
        const recapBtn = document.getElementById('classroom-recap-speed-btn');
        if (recapBtn) {
            recapBtn.textContent = isSlow ? '🐢 0.75x' : '🐇 1.0x';
        }
        if (window.app && window.app.showToast) {
            window.app.showToast(
                isSlow
                    ? (isSerbianUI() ? '🐢 Sporiji izgovor (0.75x)' : '🐢 Slow pronunciation (0.75x)')
                    : (isSerbianUI() ? '🐇 Normalna brzina (1.0x)' : '🐇 Normal speed (1.0x)'),
                'info'
            );
        }
        return cs.audioSpeed;
    };

    const speakFromEl = (btn) => {
        if (!btn) return;
        const phrase = btn.getAttribute('data-speak') || '';
        const lang = btn.getAttribute('data-lang') || 'sr-RS';
        if (!phrase || !window.app || typeof window.app.speakPhrase !== 'function') return;
        window.app.speakPhrase(phrase, lang, getAudioSpeed());
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
    };

    const renderPhase = () => {
        const content = document.getElementById('classroom-lesson-content');
        if (!content || !_session) return;

        const isSr = isSerbianUI();
        const day = _session.day;
        const phase = _session.phase;

        const phases = [
            { name: isSr ? '1. Prozivka' : '1. Roll Call', emoji: '📋', duration: '2 min', activeBg: 'bg-indigo-500 text-white animate-pulse', activeText: 'text-indigo-600 dark:text-indigo-400' },
            { name: isSr ? '2. Tabla' : '2. Whiteboard', emoji: '📖', duration: '4 min', activeBg: 'bg-blue-500 text-white animate-pulse', activeText: 'text-blue-600 dark:text-blue-400' },
            { name: isSr ? '3. Vežba' : '3. Practice', emoji: '✏️', duration: '5 min', activeBg: 'bg-emerald-500 text-white animate-pulse', activeText: 'text-emerald-600 dark:text-emerald-400' },
            { name: day.isFriday ? (isSr ? '4. Ispit' : '4. Exam') : (isSr ? '4. Kviz' : '4. Pop Quiz'), emoji: '🧪', duration: '5 min', activeBg: 'bg-amber-500 text-white animate-pulse', activeText: 'text-amber-600 dark:text-amber-400' },
            { name: isSr ? '5. Domaći' : '5. Homework', emoji: '📓', duration: '2 min', activeBg: 'bg-purple-500 text-white animate-pulse', activeText: 'text-purple-600 dark:text-purple-400' }
        ];

        const dotsHtml = phases.map((p, i) => {
            const done = i < phase;
            const active = i === phase;
            const dotCls = done
                ? 'bg-emerald-500 text-white'
                : (active ? p.activeBg : 'bg-slate-200 dark:bg-slate-700 text-slate-400');
            const lblCls = active ? p.activeText : 'text-slate-400';
            return `<div class="flex flex-col items-center gap-1 min-w-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${dotCls}">
                    ${done ? '✓' : p.emoji}
                </div>
                <span class="text-[8px] font-bold truncate ${lblCls}">${p.name.split('. ')[1]}</span>
            </div>`;
        }).join('<div class="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 self-start mt-4 mx-0.5"></div>');

        let phaseHtml = '';

        if (phase === 0) {
            // 1. ROLL CALL & WARM-UP + YESTERDAY RECALL
            const greeting = randomPick(isSr ? TEACHER.greetingsSr : TEACHER.greetingsEn).replace('{name}', escHtml(getStudentName()));
            const topicText = isSr ? day.topic : day.topicEn;
            const prevMeta = getPreviousDayMeta(_session.semIdx, _session.weekIdx, _session.dayIdx);
            let recallCardHtml = '';

            if (prevMeta && prevMeta.day) {
                const prevWords = getWhiteboardCardsForDay(prevMeta.day, 1);
                const sample = prevWords[0];
                recallCardHtml = `
                <div class="bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-left">
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">🔁 ${isSr ? 'Podsetnik sa jučerašnjeg časa' : "Yesterday's Recap"}</p>
                    <p class="text-xs font-bold text-slate-700 dark:text-slate-200">${escHtml(isSr ? prevMeta.day.topic : prevMeta.day.topicEn)}</p>
                    ${sample ? `
                    <div class="mt-2 flex items-center justify-between gap-2 bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 border border-slate-100 dark:border-slate-700">
                        <div class="text-xs truncate"><span class="font-black text-slate-800 dark:text-white">${escHtml(sample.sr)}</span> <span class="text-slate-400">→</span> <span class="text-blue-500 font-bold">${escHtml(sample.en)}</span></div>
                        <div class="flex items-center gap-1 shrink-0">
                            <button type="button" id="classroom-recap-speed-btn" onclick="ClassroomEngine.toggleAudioSpeed()" class="px-1.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-600 dark:text-slate-300 cursor-pointer" title="Brzina glasa / Audio speed">${getAudioSpeed() === 0.75 ? '🐢 0.75x' : '🐇 1.0x'}</button>
                            <button type="button" data-speak="${escHtml(sample.speakText)}" onclick="ClassroomEngine.speakFromEl(this)" class="w-7 h-7 shrink-0 rounded-lg bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-xs active:scale-90 cursor-pointer">🔊</button>
                        </div>
                    </div>` : ''}
                </div>`;
            }

            phaseHtml = `
                <div class="text-center space-y-4 py-3">
                    <div class="text-6xl">${TEACHER.emoji}</div>
                    <p class="text-base font-black text-slate-800 dark:text-white leading-snug">${greeting}</p>
                    ${recallCardHtml}
                    <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p class="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-1">${isSr ? 'Današnja tema časa' : "Today's Period Topic"}</p>
                        <p class="text-sm font-black text-blue-900 dark:text-blue-100">${escHtml(topicText)}</p>
                    </div>
                    <button onclick="ClassroomEngine.nextPhase()" class="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider text-sm cursor-pointer">
                        ${isSr ? '✋ Prisutan/na sam! Otvori Tablu →' : "✋ I'm Here! Open Whiteboard →"}
                    </button>
                </div>`;
        } else if (phase === 1) {
            // 2. WHITEBOARD / LECTURE
            const cards = _session.boardCards || [];
            const cardsHtml = cards.map(w => `
                <div class="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center gap-3 shadow-sm text-left">
                    <div class="w-10 h-10 shrink-0 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xl">${escHtml(w.emoji || '📝')}</div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-black text-slate-800 dark:text-white break-words">${escHtml(w.sr)}</p>
                        <p class="text-xs text-blue-600 dark:text-blue-400 font-bold break-words">${escHtml(w.en)}</p>
                        ${w.phonetic ? `<p class="text-[10px] text-slate-400 italic">[${escHtml(w.phonetic)}]</p>` : ''}
                        ${w.badge ? `<p class="text-[10px] font-bold text-indigo-500">${escHtml(w.badge)}</p>` : ''}
                    </div>
                    <button type="button" data-speak="${escHtml(w.speakText)}" onclick="ClassroomEngine.speakFromEl(this)" aria-label="Listen" class="w-9 h-9 shrink-0 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center text-base active:scale-90 transition-transform cursor-pointer">🔊</button>
                </div>
            `).join('');

            const isSlow = getAudioSpeed() === 0.75;
            const speedCls = isSlow
                ? 'classroom-speed-btn px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-200 font-black text-[10px] tracking-wider active:scale-95 transition-all cursor-pointer'
                : 'classroom-speed-btn px-2.5 py-1 rounded-full bg-slate-600/60 border border-slate-500/60 text-slate-200 font-black text-[10px] tracking-wider active:scale-95 transition-all cursor-pointer';

            phaseHtml = `
                <div class="bg-gradient-to-b from-slate-700 to-slate-800 dark:from-slate-900 dark:to-slate-950 rounded-2xl p-3.5 mb-4 border border-slate-600 dark:border-slate-700 shadow-inner">
                    <div class="flex items-center justify-between mb-2.5 gap-2">
                        <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest">📋 ${isSr ? 'Školska Tabla' : 'Classroom Whiteboard'}</p>
                        <button type="button" id="classroom-wb-speed-btn" onclick="ClassroomEngine.toggleAudioSpeed()" class="${speedCls}" title="${isSr ? 'Brzina izgovora (1.0x / 0.75x)' : 'Audio speed (1.0x / 0.75x)'}">
                            ${isSlow ? '🐢 0.75x' : '🐇 1.0x'}
                        </button>
                    </div>
                    <div class="space-y-2">${cardsHtml}</div>
                    ${getGrammarCalloutHtml(day, isSr)}
                </div>
                <button onclick="ClassroomEngine.startPracticePhase()" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider text-sm cursor-pointer">
                    ${isSr ? '✏️ Razumem! Pokreni Vođenu Vežbu (5) →' : '✏️ Got it! Start Guided Practice (5) →'}
                </button>`;
        } else if (phase === 2) {
            // Practice intro/retry fallback if reopened
            phaseHtml = `
                <div class="text-center space-y-4 py-4">
                    <div class="text-5xl">✏️</div>
                    <p class="text-base font-black text-slate-800 dark:text-white">${isSr ? 'Vođena Vežba' : 'Guided Practice'}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">${isSr ? 'Uradi 5 pitanja sa učiteljskim savetima. Možeš koristiti i 💡 Pomoć (-5 💎).' : 'Complete 5 coached questions. Teacher guidance & 💡 Hints are enabled!'}</p>
                    <button onclick="ClassroomEngine.startPracticePhase()" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider text-sm cursor-pointer">
                        ${isSr ? 'Započni Vežbu →' : 'Start Practice →'}
                    </button>
                </div>`;
        } else if (phase === 3) {
            // Pop Quiz / Friday Exam Bridge Screen
            const ps = _session.practiceStats;
            const pTotal = ps.total || 5;
            const pPct = Math.round((ps.correct / pTotal) * 100);
            const qCount = day.isFriday ? 10 : 5;
            phaseHtml = `
                <div class="text-center space-y-4 py-3">
                    <div class="text-5xl">${day.isFriday ? '📝' : '🧪'}</div>
                    <div>
                        <p class="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">✅ ${isSr ? `Vežba završena (${ps.correct}/${pTotal} • ${pPct}%)` : `Practice Done (${ps.correct}/${pTotal} • ${pPct}%)`}</p>
                        <h3 class="text-lg font-black text-slate-800 dark:text-white mt-1">${day.isFriday ? (isSr ? 'Vreme je za Nedeljni Ispit!' : 'Time for the Weekly Exam!') : (isSr ? 'Vreme je za Kratki Kviz!' : 'Time for the Pop Quiz!')}</h3>
                    </div>
                    <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3.5 text-left space-y-1">
                        <p class="text-xs font-black text-amber-700 dark:text-amber-300">🚫 ${isSr ? 'Samostalna provera bez pomoći' : 'Independent Check — No Hints'}</p>
                        <p class="text-xs text-amber-800 dark:text-amber-200">${isSr ? `Čeka te ${qCount} pitanja za ocenu u dnevniku.` : `${qCount} graded questions ahead for your report card.`}${day.isFriday ? (isSr ? ' Minimum za prolaz: 60%.' : ' Passing grade: 60%.') : ''}</p>
                    </div>
                    <button onclick="ClassroomEngine.startQuizPhase()" class="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider text-sm cursor-pointer">
                        ${day.isFriday ? (isSr ? `📝 Pokreni Ispit (${qCount} pitanja) →` : `📝 Start Exam (${qCount} Qs) →`) : (isSr ? `🧪 Pokreni Kviz (${qCount} pitanja) →` : `🧪 Start Pop Quiz (${qCount} Qs) →`)}
                    </button>
                </div>`;
        } else if (phase === 4) {
            // 5. HOMEWORK & DISMISSAL
            phaseHtml = renderHomeworkDismissal(isSr);
        }

        content.innerHTML = `
            <div class="flex items-center gap-0 px-1 mb-5">${dotsHtml}</div>
            <div class="flex items-center gap-2 mb-3 px-1">
                <span class="text-xl">${phases[phase].emoji}</span>
                <div>
                    <p class="text-sm font-black text-slate-800 dark:text-white">${phases[phase].name}</p>
                    <p class="text-[10px] font-bold text-slate-400">${phases[phase].duration}</p>
                </div>
            </div>
            ${phaseHtml}`;
    };

    const startPracticePhase = async () => {
        if (!_session) return;
        const day = _session.day;
        const isSr = isSerbianUI();

        try {
            const questions = await buildLessonQuestions(day, 5, { allowVoice: true });
            if (!questions || questions.length === 0) {
                // Skip straight to quiz if no questions could be built
                _session.phase = 3;
                renderPhase();
                return;
            }
            _session.phase = 2;
            closeClassroomOverlay();

            if (window.app && typeof window.app.startClassroomLesson === 'function') {
                window.app.startClassroomLesson(questions, {
                    mode: 'classroom_practice',
                    badge: isSr ? `🏫 Učionica • ✏️ Vežba` : `🏫 Classroom • ✏️ Guided Practice`
                });
            }
        } catch (e) {
            console.error('[Classroom] Practice phase error:', e);
            _session.phase = 3;
            openClassroomModal();
            renderPhase();
        }
    };

    const startQuizPhase = async () => {
        if (!_session) return;
        const day = _session.day;
        const isSr = isSerbianUI();
        const qCount = day.isFriday ? 10 : 5;
        const mode = day.isFriday ? 'classroom_exam' : 'classroom_quiz';

        try {
            const questions = await buildLessonQuestions(day, qCount, { allowVoice: false });
            if (!questions || questions.length === 0) {
                _session.phase = 4;
                renderPhase();
                return;
            }
            _session.phase = 3;
            closeClassroomOverlay();

            if (window.app && typeof window.app.startClassroomLesson === 'function') {
                window.app.startClassroomLesson(questions, {
                    mode,
                    badge: day.isFriday
                        ? (isSr ? `🏫 Učionica • 📝 Nedeljni Ispit` : `🏫 Classroom • 📝 Weekly Exam`)
                        : (isSr ? `🏫 Učionica • 🧪 Kviz (Bez pomoći)` : `🏫 Classroom • 🧪 Pop Quiz`)
                });
            }
        } catch (e) {
            console.error('[Classroom] Quiz phase error:', e);
            _session.phase = 4;
            openClassroomModal();
            renderPhase();
        }
    };

    const renderHomeworkDismissal = (isSr) => {
        if (!_session) return '';
        const cs = getState();
        const { dayKey, day, boardCards, practiceStats, quizStats } = _session;

        // Weighted score: quiz counts 70%, practice counts 30% (or 100% quiz on Friday Exam)
        const pPct = practiceStats.total > 0 ? Math.round((practiceStats.correct / practiceStats.total) * 100) : 75;
        const qPct = quizStats.total > 0 ? Math.round((quizStats.correct / quizStats.total) * 100) : pPct;
        const finalScore = day.isFriday ? qPct : Math.round((qPct * 0.7) + (pPct * 0.3));
        const grade = getGrade(finalScore);
        const bonusXp = Math.round(finalScore * 0.2) + (day.isFriday ? 15 : 5);

        // Save 3-card evening homework pack drawn from today's lecture cards
        const hwWords = (boardCards || []).slice(0, 3).map(c => ({
            sr: c.speakText || c.sr,
            en: c.en || '',
            emoji: c.emoji || '📝'
        }));
        if (hwWords.length > 0) {
            cs.homeworkPacks[dayKey] = hwWords;
            delete cs.homeworkDone[dayKey];
            save();
        }

        const enc = randomPick(isSr ? TEACHER.encouragementsSr : TEACHER.encouragementsEn).replace('{name}', escHtml(getStudentName()));
        const fridayFailed = !!(day.isFriday && finalScore < 60);

        return `
            <div class="text-center space-y-3.5 py-2">
                <div class="text-5xl">${grade.emoji}</div>
                <p class="text-base font-black text-slate-800 dark:text-white">${enc}</p>

                <div class="bg-slate-50 dark:bg-slate-900/70 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5">
                    <div class="grid grid-cols-3 gap-2">
                        <div class="text-center">
                            <div class="text-xl font-black ${grade.color}">${finalScore}%</div>
                            <div class="text-[10px] font-bold text-slate-400">${day.isFriday ? (isSr ? 'Ispit' : 'Exam') : (isSr ? 'Ukupno' : 'Score')}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-black text-blue-500">+${bonusXp}</div>
                            <div class="text-[10px] font-bold text-slate-400">${isSr ? 'Bonus XP' : 'Bonus XP'}</div>
                        </div>
                        <div class="text-center">
                            <div class="text-xl font-black ${grade.color}">${grade.grade}/${grade.letter}</div>
                            <div class="text-[10px] font-bold text-slate-400">${isSr ? 'Ocena' : 'Grade'}</div>
                        </div>
                    </div>
                </div>

                ${fridayFailed ? `
                <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl p-3 text-left">
                    <p class="text-xs font-black text-amber-800 dark:text-amber-200">📖 ${isSr ? 'Dopunska Nastava spremna!' : 'Office Hours Activated!'}</p>
                    <p class="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">${isSr ? 'Završi kratko 5-minutno ponavljanje pre sledećeg ponedeljka (potrebno 60%+).' : 'Complete the quick 5-min Office Hours review before unlocking next Monday (60%+ needed).'}</p>
                </div>` : ''}

                ${hwWords.length > 0 ? `
                <div class="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-xl p-3 text-left">
                    <p class="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2">📓 ${isSr ? 'Večernji Domaći (3 kartice sačuvane)' : 'Evening Homework (3 Cards Unlocked)'}</p>
                    <div class="space-y-1.5">
                        ${hwWords.map(w => `
                            <div class="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg p-2">
                                <span class="text-sm">${escHtml(w.emoji)}</span>
                                <span class="text-xs font-black text-slate-800 dark:text-white">${escHtml(w.sr)}</span>
                                <span class="text-xs text-slate-400">→</span>
                                <span class="text-xs font-bold text-blue-500 truncate">${escHtml(w.en)}</span>
                            </div>`).join('')}
                    </div>
                </div>` : ''}

                <button onclick="ClassroomEngine.finishDay(${finalScore})" class="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-black rounded-2xl shadow-lg active:scale-95 transition-transform uppercase tracking-wider text-sm cursor-pointer">
                    ${isSr ? '🏠 Završi Čas & Upiši Ocenu' : '🏠 End Class & Record Grade'}
                </button>
            </div>`;
    };

    const nextPhase = () => {
        if (!_session) return;
        _session.phase = (_session.phase || 0) + 1;
        renderPhase();
    };

    // ─── APP.JS LESSON LIFECYCLE CALLBACKS ──────────────────────────
    const recordAnswer = (questionObj, isCorrect) => {
        if (!_session) return;
        const st = getAppState();
        const mode = st ? st.lessonMode : '';

        if (mode === 'classroom_practice') {
            _session.practiceStats.total++;
            if (isCorrect) _session.practiceStats.correct++;
        } else if (mode === 'classroom_quiz' || mode === 'classroom_exam' || mode === 'classroom_office') {
            _session.quizStats.total++;
            if (isCorrect) _session.quizStats.correct++;
        } else if (mode === 'classroom_homework') {
            _session.quizStats.total++;
            if (isCorrect) _session.quizStats.correct++;
        }

        if (_session.domains) {
            const domain = getDomainForQuestionType(questionObj && questionObj.type);
            _session.domains[domain].t++;
            if (isCorrect) _session.domains[domain].c++;
        }
    };

    const handleAppLessonFinished = () => {
        const st = getAppState();
        const mode = st ? st.lessonMode : '';
        if (st) st.lessonMode = 'standard';

        if (!_session) {
            if (window.app) window.app.navigate('home');
            return;
        }

        if (mode === 'classroom_practice') {
            _session.phase = 3; // Advance to Pop Quiz / Exam Bridge
            if (window.app) window.app.navigate('home');
            openClassroomModal();
            renderPhase();
        } else if (mode === 'classroom_quiz' || mode === 'classroom_exam') {
            _session.phase = 4; // Advance to Homework & Dismissal
            if (window.app) window.app.navigate('home');
            openClassroomModal();
            renderPhase();
        } else if (mode === 'classroom_office') {
            const qs = _session.quizStats;
            const pct = qs.total > 0 ? Math.round((qs.correct / qs.total) * 100) : 0;
            onOfficeHoursComplete(pct);
        } else if (mode === 'classroom_homework') {
            onHomeworkComplete();
        } else {
            if (window.app) window.app.navigate('home');
        }
    };

    const abortActiveLesson = () => {
        _session = null;
        _modalMode = null;
        closeClassroomOverlay();
        const st = getAppState();
        if (st) {
            st.lessonMode = 'standard';
            st._classroomBadge = null;
        }
    };

    const finishDay = (score) => {
        if (!_session) return;
        const cs = getState();
        const st = getAppState();
        const { semIdx, weekIdx, dayKey, day, week, domains } = _session;
        const grade = getGrade(score);

        // Save best score if retaking, or initial completion
        const prev = cs.completedDays[dayKey];
        const recordedScore = prev ? Math.max(prev.score, score) : score;
        const recordedGrade = getGrade(recordedScore);

        // Domain accuracies for this period
        const domainPct = (d) => (domains[d] && domains[d].t > 0) ? Math.round((domains[d].c / domains[d].t) * 100) : score;

        cs.completedDays[dayKey] = {
            score: recordedScore,
            grade: recordedGrade.letter,
            date: new Date().toISOString().split('T')[0],
            vocab: domainPct('vocabulary'),
            grammar: domainPct('grammar'),
            pronunciation: domainPct('pronunciation')
        };

        // Award completion bonus XP & sync to daily history + League leaderboard
        const xpReward = Math.round(score * 0.2) + (day.isFriday ? 15 : 5);
        cs.totalClassroomXP += xpReward;
        if (st) {
            st.xp = (st.xp || 0) + xpReward;
            st.dailyXP = (st.dailyXP || 0) + xpReward;
            const today = new Date().toISOString().split('T')[0];
            if (!st.history) st.history = {};
            if (!st.history[today]) st.history[today] = { xp: 0, lessons: 0 };
            st.history[today].xp += xpReward;
            if (window.LeagueEngine && typeof window.LeagueEngine.recordUserXp === 'function') {
                window.LeagueEngine.recordUserXp(xpReward);
            }
        }

        // Friday Exam & Report Card generation
        if (day.isFriday) {
            const weekKey = getWeekKey(semIdx, weekIdx);
            cs.fridayScores[weekKey] = recordedScore;

            let vSum = 0, gSum = 0, pSum = 0, totalSum = 0, dCount = 0;
            week.days.forEach((_, di) => {
                const res = cs.completedDays[getDayKey(semIdx, weekIdx, di)];
                if (res) {
                    vSum += (typeof res.vocab === 'number' ? res.vocab : res.score);
                    gSum += (typeof res.grammar === 'number' ? res.grammar : res.score);
                    pSum += (typeof res.pronunciation === 'number' ? res.pronunciation : res.score);
                    totalSum += res.score;
                    dCount++;
                }
            });

            cs.reportCards[weekKey] = {
                vocab: dCount > 0 ? Math.round(vSum / dCount) : recordedScore,
                grammar: dCount > 0 ? Math.round(gSum / dCount) : recordedScore,
                pronunciation: dCount > 0 ? Math.round(pSum / dCount) : recordedScore,
                overall: dCount > 0 ? Math.round(totalSum / dCount) : recordedScore
            };

            if (recordedScore < 60 && !cs.officeHoursDone[weekKey]) {
                cs.officeHoursNeeded[weekKey] = true;
            } else if (recordedScore >= 60) {
                cs.officeHoursDone[weekKey] = true;
                delete cs.officeHoursNeeded[weekKey];
            }
        }

        const earnedDiplomaSemId = issueDiplomaIfEarned(semIdx, day.isFinal && recordedScore >= 60);

        _session = null;
        _modalMode = null;
        save();
        closeClassroomOverlay();

        if (window.app) {
            if ((grade.min >= 75 || earnedDiplomaSemId) && window.app.fireConfetti) window.app.fireConfetti();
            if (window.app.showToast) {
                window.app.showToast(`${grade.emoji} ${isSerbianUI() ? grade.label : grade.labelEn} (${grade.grade}/${grade.letter}) • +${xpReward} XP`, 'success');
            }
            if (window.app.updateStatsUI) window.app.updateStatsUI();
        }
        renderClassroomView();

        if (earnedDiplomaSemId) {
            setTimeout(() => showDiplomaModal(earnedDiplomaSemId), 320);
        }
    };

    // ─── DIPLOMA CERTIFICATES (SEMESTER GRADUATION) ─────────────────
    const issueDiplomaIfEarned = (semIdx, forceGrant = false) => {
        const cs = getState();
        const sem = SEMESTERS[semIdx];
        if (!sem) return null;

        const lastWeekIdx = sem.weeks.length - 1;
        const finalWeekKey = getWeekKey(semIdx, lastWeekIdx);
        const finalFriKey = getDayKey(semIdx, lastWeekIdx, 4);
        const finalFri = cs.completedDays[finalFriKey];

        const passedFinal = forceGrant || (finalFri && (finalFri.score >= 60 || cs.officeHoursDone[finalWeekKey]));
        if (!passedFinal) return null;

        // Calculate semester average from earned report cards (or final exam fallback)
        let scoreSum = 0;
        let count = 0;
        sem.weeks.forEach((_, wi) => {
            const rc = cs.reportCards[getWeekKey(semIdx, wi)];
            if (rc && typeof rc.overall === 'number') {
                scoreSum += rc.overall;
                count++;
            }
        });
        const avgScore = count > 0 ? Math.round(scoreSum / count) : (finalFri ? finalFri.score : 65);
        const gradeObj = getGrade(Math.max(60, avgScore));
        const alreadyEarned = !!cs.diplomas[sem.id];

        cs.diplomas[sem.id] = {
            semesterId: sem.id,
            name: sem.name,
            nameEn: sem.nameEn,
            student: getStudentName(),
            avgScore: Math.max(60, avgScore),
            grade: gradeObj.grade,
            letter: gradeObj.letter,
            label: gradeObj.label,
            labelEn: gradeObj.labelEn,
            date: (alreadyEarned && cs.diplomas[sem.id].date) ? cs.diplomas[sem.id].date : new Date().toISOString().split('T')[0]
        };

        return alreadyEarned ? null : sem.id;
    };

    const renderDiplomaCanvas = (diploma) => {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 700;
        const ctx = canvas.getContext && canvas.getContext('2d');
        if (!ctx) return null;

        // Warm parchment background
        const bgGrad = ctx.createLinearGradient(0, 0, 1000, 700);
        bgGrad.addColorStop(0, '#fffbeb');
        bgGrad.addColorStop(1, '#fef3c7');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1000, 700);

        // Ornamental double gold frame
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 10;
        ctx.strokeRect(24, 24, 952, 652);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(40, 40, 920, 620);

        // Top Serbian tricolor ribbon bar
        ctx.fillStyle = '#dc2626'; ctx.fillRect(42, 42, 916, 12);
        ctx.fillStyle = '#1d4ed8'; ctx.fillRect(42, 54, 916, 12);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(42, 66, 916, 10);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('SERBOLINGO AKADEMIJA • UČIONICA', 500, 130);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 54px serif';
        ctx.fillText('DIPLOMA', 500, 200);

        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 22px sans-serif';
        ctx.fillText('SERTIFIKAT O ZAVRŠENOM SEMESTRU / CERTIFICATE OF COMPLETION', 500, 240);

        ctx.fillStyle = '#475569';
        ctx.font = '24px sans-serif';
        ctx.fillText('Dodeljuje se učeniku / Awarded to:', 500, 310);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 48px serif';
        ctx.fillText(String(diploma.student || 'Učenik'), 500, 372);

        // Accent divider line
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(260, 395);
        ctx.lineTo(740, 395);
        ctx.stroke();

        ctx.fillStyle = '#1e3a8a';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(String(diploma.name || ''), 500, 445);

        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(`Ocena / Grade: ${diploma.grade} (${diploma.letter}) • ${diploma.avgScore}% — ${diploma.label}`, 500, 495);

        // Seal badge bottom right + signature bottom left
        ctx.textAlign = 'left';
        ctx.fillStyle = '#334155';
        ctx.font = 'italic 24px serif';
        ctx.fillText('Profesorka Ana', 120, 585);
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText('Odeljenjski starešina / Homeroom Teacher', 120, 610);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`Datum / Date: ${diploma.date || ''}`, 880, 585);
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#b45309';
        ctx.fillText('★ ZVANIČNI PEČAT SERBOLINGO ★', 880, 610);

        return canvas;
    };

    const showDiplomaModal = (semId) => {
        const cs = getState();
        const diploma = cs.diplomas && cs.diplomas[semId];
        if (!diploma) return;

        const content = document.getElementById('classroom-lesson-content');
        if (!content) return;

        const isSr = isSerbianUI();
        _modalMode = 'summary';
        openClassroomModal();

        content.innerHTML = `
            <div class="text-center space-y-4 py-2">
                <div class="relative rounded-2xl p-5 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 dark:from-amber-950/60 dark:via-slate-900 dark:to-amber-950/40 border-4 border-amber-400 dark:border-amber-600 shadow-lg overflow-hidden">
                    <div class="flex h-1.5 w-full rounded-full overflow-hidden mb-3">
                        <div class="flex-1 bg-red-600"></div>
                        <div class="flex-1 bg-blue-700"></div>
                        <div class="flex-1 bg-white"></div>
                    </div>
                    <p class="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">🏫 SerboLingo Akademija • Učionica</p>
                    <div class="text-5xl my-2">🎓</div>
                    <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">${isSr ? 'DIPLOMA SEMESTRA' : 'SEMESTER DIPLOMA'}</h3>
                    <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">${isSr ? 'Dodeljuje se učeniku:' : 'Awarded with honors to:'}</p>
                    <p class="text-xl font-black text-indigo-700 dark:text-indigo-300 mt-1">${escHtml(diploma.student)}</p>
                    <div class="my-3 py-2 px-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-amber-300 dark:border-amber-700/70">
                        <p class="text-xs font-black text-slate-800 dark:text-white">${escHtml(isSr ? diploma.name : diploma.nameEn)}</p>
                        <p class="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">${isSr ? 'Ocena' : 'Grade'}: ${escHtml(diploma.grade)} (${escHtml(diploma.letter)}) • ${diploma.avgScore}%</p>
                    </div>
                    <div class="flex justify-between items-center text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-1">
                        <span>👩‍🏫 Profesorka Ana</span>
                        <span>📅 ${escHtml(diploma.date)}</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2.5">
                    <button type="button" onclick="ClassroomEngine.downloadDiplomaPng('${escHtml(semId)}')" class="py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <span>🖼️</span> <span>${isSr ? 'Sačuvaj PNG' : 'Save PNG'}</span>
                    </button>
                    <button type="button" onclick="ClassroomEngine.shareDiploma('${escHtml(semId)}')" class="py-3 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5">
                        <span>📤</span> <span>${isSr ? 'Podeli' : 'Share'}</span>
                    </button>
                </div>

                <button type="button" onclick="ClassroomEngine.closeClassroomOverlay()" class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider active:scale-95 transition-transform cursor-pointer">
                    ${isSr ? 'Zatvori' : 'Close'}
                </button>
            </div>`;
    };

    const downloadDiplomaPng = (semId) => {
        const cs = getState();
        const diploma = cs.diplomas && cs.diplomas[semId];
        if (!diploma) return false;
        const canvas = renderDiplomaCanvas(diploma);
        if (!canvas || typeof document === 'undefined') return false;

        try {
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `serbolingo-diploma-${semId}.png`;
            if (document.body && document.body.appendChild) document.body.appendChild(a);
            a.click();
            if (a.remove) a.remove();
            if (window.app && window.app.showToast) {
                window.app.showToast(isSerbianUI() ? '🖼️ Diploma sačuvana kao PNG!' : '🖼️ Diploma saved as PNG!', 'success');
            }
            return true;
        } catch (e) {
            console.warn('[Classroom] Diploma PNG export note:', e);
            return false;
        }
    };

    const shareDiploma = async (semId) => {
        const cs = getState();
        const diploma = cs.diplomas && cs.diplomas[semId];
        if (!diploma) return false;

        const isSr = isSerbianUI();
        const text = isSr
            ? `🎓 Završio/la sam "${diploma.name}" u SerboLingo Učionici sa ocenom ${diploma.grade}/${diploma.letter} (${diploma.avgScore}%)! 🇷🇸`
            : `🎓 I graduated "${diploma.nameEn}" in SerboLingo Classroom with Grade ${diploma.grade}/${diploma.letter} (${diploma.avgScore}%)! 🇷🇸`;

        try {
            if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                await navigator.share({ title: 'SerboLingo Diploma', text });
                return true;
            }
        } catch (e) { /* fall back to clipboard */ }

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                if (window.app && window.app.showToast) {
                    window.app.showToast(isSr ? '📋 Tekst diplome kopiran!' : '📋 Diploma text copied!', 'success');
                }
                return true;
            }
        } catch (e) {}

        if (window.app && window.app.showToast) window.app.showToast(text, 'info');
        return true;
    };

    // ─── OFFICE HOURS (DOPUNSKA NASTAVA) ────────────────────────────
    const startOfficeHours = async (semIdx, weekIdx) => {
        const cs = getState();
        const weekKey = getWeekKey(semIdx, weekIdx);
        if (!cs.officeHoursNeeded[weekKey] || cs.officeHoursDone[weekKey]) return;

        const week = SEMESTERS[semIdx].weeks[weekIdx];
        const allCategories = [...new Set(week.days.flatMap(d => d.categories || []))];
        const isSr = isSerbianUI();

        _session = {
            kind: 'office',
            semIdx,
            weekIdx,
            weekKey,
            week,
            quizStats: { correct: 0, total: 0 }
        };

        try {
            const questions = await buildLessonQuestions({
                categories: allCategories.length ? allCategories : ['basics'],
                alphabetMode: week.id === 'w1' ? 'alphabet_lat_print' : null
            }, 5, { allowVoice: false });

            if (!questions || !questions.length) {
                onOfficeHoursComplete(100);
                return;
            }

            if (window.app && typeof window.app.startClassroomLesson === 'function') {
                window.app.startClassroomLesson(questions, {
                    mode: 'classroom_office',
                    badge: isSr ? '📖 Dopunska Nastava' : '📖 Office Hours'
                });
            }
        } catch (e) {
            console.error('[Classroom] Office hours error:', e);
        }
    };

    const onOfficeHoursComplete = (pct) => {
        const cs = getState();
        if (!_session) return;
        const { weekKey } = _session;
        const isSr = isSerbianUI();

        if (pct >= 60) {
            cs.officeHoursDone[weekKey] = true;
            delete cs.officeHoursNeeded[weekKey];
            // Lift the failing report card overall floor to passing C (65%) if deserved
            if (cs.reportCards[weekKey] && cs.reportCards[weekKey].overall < 60) {
                cs.reportCards[weekKey].overall = 65;
            }
            const earnedSem = (_session.weekIdx === SEMESTERS[_session.semIdx].weeks.length - 1)
                ? issueDiplomaIfEarned(_session.semIdx, true)
                : null;
            save();
            if (window.app && window.app.showToast) {
                window.app.showToast(isSr ? '✅ Dopunska nastava položena! Sledeća nedelja otključana!' : '✅ Office Hours passed! Next week unlocked!', 'success');
            }
            if (earnedSem) {
                setTimeout(() => showDiplomaModal(earnedSem), 350);
            }
        } else if (window.app && window.app.showToast) {
            window.app.showToast(isSr ? `📝 Rezultat ${pct}% — potrebno je 60%+ za prolaz. Pokušaj ponovo!` : `📝 Scored ${pct}% — need 60%+ to unlock next week. Try again!`, 'warning');
        }

        _session = null;
        if (window.app) window.app.navigate('home');
        renderClassroomView();
    };

    // ─── HOMEWORK REVIEW PACK ───────────────────────────────────────
    const startHomework = (dayKey) => {
        const cs = getState();
        const words = cs.homeworkPacks[dayKey];
        if (!Array.isArray(words) || !words.length || cs.homeworkDone[dayKey]) return;

        const qe = (typeof window !== 'undefined' && window.QuestionEngine) ? window.QuestionEngine : null;
        const seedData = (typeof window !== 'undefined' && Array.isArray(window.SEED_DATA)) ? window.SEED_DATA : [];
        const isSr = isSerbianUI();

        const questions = words.map(w => {
            if (qe && seedData.length >= 4) {
                return qe.generateMultipleChoice({
                    id: w.id || 'hw_' + w.sr,
                    sr_lat: w.sr,
                    en: w.en
                }, seedData);
            }
            return null;
        }).filter(Boolean);

        if (!questions.length) return;

        _session = {
            kind: 'homework',
            dayKey,
            quizStats: { correct: 0, total: 0 }
        };

        if (window.app && typeof window.app.startClassroomLesson === 'function') {
            window.app.startClassroomLesson(questions, {
                mode: 'classroom_homework',
                badge: isSr ? '📓 Domaći Zadatak' : '📓 Homework Review'
            });
        }
    };

    const onHomeworkComplete = () => {
        const cs = getState();
        const st = getAppState();
        const isSr = isSerbianUI();

        if (_session && _session.dayKey) {
            cs.homeworkDone[_session.dayKey] = true;
            if (st) {
                st.xp = (st.xp || 0) + 5;
                st.dailyXP = (st.dailyXP || 0) + 5;
                const today = new Date().toISOString().split('T')[0];
                if (!st.history) st.history = {};
                if (!st.history[today]) st.history[today] = { xp: 0, lessons: 0 };
                st.history[today].xp += 5;
            }
            save();
            if (window.app) {
                if (window.app.showToast) window.app.showToast(isSr ? '📓 Domaći zadatak završen! +5 XP' : '📓 Homework complete! +5 XP', 'success');
                if (window.app.updateStatsUI) window.app.updateStatsUI();
            }
        }
        _session = null;
        if (window.app) window.app.navigate('home');
        renderClassroomView();
    };

    // ─── COMPLETED DAY SUMMARY / RETAKE MODAL ───────────────────────
    const showDaySummary = (dayKey, semIdx, weekIdx, dayIdx) => {
        const cs = getState();
        const result = cs.completedDays[dayKey];
        if (!result) return;

        const sem = SEMESTERS[semIdx];
        const week = sem.weeks[weekIdx];
        const day = week.days[dayIdx];
        const grade = getGrade(result.score);
        const isSr = isSerbianUI();

        const content = document.getElementById('classroom-lesson-content');
        if (!content) return;

        _modalMode = 'summary';
        openClassroomModal();

        content.innerHTML = `
            <div class="text-center space-y-4 py-2">
                <div class="text-5xl">${grade.emoji}</div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-wider text-indigo-500">${escHtml(isSr ? week.name : week.nameEn)} • ${escHtml(isSr ? day.name : day.nameEn)}</p>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white mt-0.5">${escHtml(isSr ? day.topic : day.topicEn)}</h3>
                    <p class="text-[11px] font-bold text-slate-400 mt-1">${isSr ? 'Završeno:' : 'Completed:'} ${escHtml(result.date || '')}</p>
                </div>

                <div class="bg-slate-50 dark:bg-slate-900/70 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 grid grid-cols-2 gap-3">
                    <div>
                        <div class="text-2xl font-black ${grade.color}">${grade.grade} (${grade.letter})</div>
                        <div class="text-[10px] font-bold text-slate-400">${isSr ? grade.label : grade.labelEn}</div>
                    </div>
                    <div>
                        <div class="text-2xl font-black text-slate-800 dark:text-white">${result.score}%</div>
                        <div class="text-[10px] font-bold text-slate-400">${isSr ? 'Najbolji rezultat' : 'Best Score'}</div>
                    </div>
                </div>

                <div class="flex gap-2.5 pt-1">
                    <button onclick="ClassroomEngine.closeClassroomOverlay()" class="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs uppercase tracking-wider active:scale-95 transition-transform cursor-pointer">
                        ${isSr ? 'Zatvori' : 'Close'}
                    </button>
                    <button onclick="ClassroomEngine.startDay(${semIdx}, ${weekIdx}, ${dayIdx}, true)" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-transform cursor-pointer">
                        🔄 ${isSr ? 'Ponovi Čas' : 'Retake Class'}
                    </button>
                </div>
            </div>`;
    };

    // ─── MODE SWITCHER & HOME INTEGRATION ───────────────────────────
    const updateModeSwitcher = () => {
        const cs = getState();
        const isSr = isSerbianUI();
        const treeBtn = document.getElementById('mode-skill-tree');
        const classBtn = document.getElementById('mode-classroom');
        const treeLabel = document.getElementById('mode-skill-tree-label');
        const classLabel = document.getElementById('mode-classroom-label');

        if (treeLabel) treeLabel.textContent = isSr ? 'Stablo Veština' : 'Skill Tree';
        if (classLabel) classLabel.textContent = isSr ? 'Učionica' : 'Classroom';

        if (!treeBtn || !classBtn) return;

        if (cs.activeMode) {
            classBtn.classList.add('bg-indigo-500', 'text-white', 'shadow-md');
            classBtn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-500', 'dark:text-slate-400');
            treeBtn.classList.remove('bg-emerald-500', 'text-white', 'shadow-md');
            treeBtn.classList.add('bg-slate-100', 'dark:bg-slate-700', 'text-slate-500', 'dark:text-slate-400');
        } else {
            treeBtn.classList.add('bg-emerald-500', 'text-white', 'shadow-md');
            treeBtn.classList.remove('bg-slate-100', 'dark:bg-slate-700', 'text-slate-500', 'dark:text-slate-400');
            classBtn.classList.remove('bg-indigo-500', 'text-white', 'shadow-md');
            classBtn.classList.add('bg-slate-100', 'dark:bg-slate-700', 'text-slate-500', 'dark:text-slate-400');
        }
    };

    const renderHomeTrack = () => {
        const cs = getState();
        updateModeSwitcher();

        const treeContainer = document.getElementById('skill-tree-container');
        const classroomContainer = document.getElementById('classroom-content');
        const practiceRow = document.getElementById('practice-row');

        if (cs.activeMode) {
            if (treeContainer) treeContainer.classList.add('hidden');
            if (practiceRow) practiceRow.classList.add('hidden');
            if (classroomContainer) classroomContainer.classList.remove('hidden');
            renderClassroomView();
        } else {
            if (treeContainer) treeContainer.classList.remove('hidden');
            if (practiceRow) practiceRow.classList.remove('hidden');
            if (classroomContainer) classroomContainer.classList.add('hidden');
        }
    };

    const setMode = (mode) => {
        const cs = getState();
        cs.activeMode = (mode === 'classroom');
        save();
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        renderHomeTrack();
        if (!cs.activeMode && window.app && window.app.renderSkillTree) {
            window.app.renderSkillTree();
        }
    };

    const init = () => {
        renderHomeTrack();
    };

    window.ClassroomEngine = {
        init,
        renderHomeTrack,
        renderClassroomView,
        setMode,
        toggleWeek,
        startDay,
        startPracticePhase,
        startQuizPhase,
        nextPhase,
        finishDay,
        startOfficeHours,
        startHomework,
        showDaySummary,
        showDiplomaModal,
        downloadDiplomaPng,
        shareDiploma,
        toggleAudioSpeed,
        getAudioSpeed,
        closeClassroomOverlay,
        speakFromEl,
        recordAnswer,
        handleAppLessonFinished,
        abortActiveLesson,
        updateModeSwitcher,
        SEMESTERS,
        GRADE_THRESHOLDS,
        getState,
        isDayUnlocked,
        getGrade
    };
})();
