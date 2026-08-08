const state = {
    user: null, xp: 0, dailyXP: 0, dailyGoal: 50, streak: 0, maxStreak: 0, hearts: 5, totalLessons: 0,
    correctAnswers: 0, totalAnswers: 0, chartPeriod: 'week', currentLevelKey: null, currentLessonIndex: 0,
    goalCelebrated: false,
    history: {}, // Format: "YYYY-MM-DD": { xp: 0, lessons: 0 }
    skills: { 'Slušanje': 50, 'Govor': 50, 'Čitanje': 50, 'Pisanje': 50, 'Gramatika': 50, 'Vokabular': 50 },
    settings: { darkMode: true, volume: { sfx: 1.0, tts: 1.0 }, appLanguage: 'sr_lat', learningDirection: 'sr_to_en' },
    achievements: {},
    lastActiveDate: null
};
let apiKey = "";

// [SHIELD_DAEMON: VALIDATED] — UI Localization Strings (en, sr_lat, sr_cyr)
const UI_STRINGS = {
    // Auth Screen
    auth_title_login: { en: 'Log In', sr_lat: 'Prijavite se', sr_cyr: 'Пријавите се' },
    auth_title_register: { en: 'Create Account', sr_lat: 'Napravite nalog', sr_cyr: 'Направите налог' },
    auth_username: { en: 'Username', sr_lat: 'Korisničko ime', sr_cyr: 'Корисничко име' },
    auth_password: { en: 'Password', sr_lat: 'Lozinka', sr_cyr: 'Лозинка' },
    auth_remember: { en: 'Stay logged in', sr_lat: 'Ostanite prijavljeni', sr_cyr: 'Останите пријављени' },
    auth_login_btn: { en: 'Log In', sr_lat: 'Prijavi se', sr_cyr: 'Пријави се' },
    auth_register_btn: { en: 'Create Account', sr_lat: 'Napravi nalog', sr_cyr: 'Направи налог' },
    auth_toggle_to_register: { en: "Don't have an account? Create one", sr_lat: 'Nemate nalog? Napravite ga', sr_cyr: 'Немате налог? Направите га' },
    auth_toggle_to_login: { en: 'Already have an account? Log in', sr_lat: 'Već imate nalog? Prijavite se', sr_cyr: 'Већ имате налог? Пријавите се' },
    auth_or: { en: 'or', sr_lat: 'ili', sr_cyr: 'или' },
    auth_guest: { en: 'Try for free (Guest)', sr_lat: 'Probaj besplatno (Gost)', sr_cyr: 'Пробај бесплатно (Гост)' },

    // Header & Nav
    nav_learn: { en: 'Learn', sr_lat: 'Uči', sr_cyr: 'Учи' },
    nav_stats: { en: 'Stats', sr_lat: 'Statistika', sr_cyr: 'Статистика' },
    nav_profile: { en: 'Profile', sr_lat: 'Profil', sr_cyr: 'Профил' },

    // Home View
    home_curriculum: { en: 'Curriculum', sr_lat: 'Kurikulum', sr_cyr: 'Курикулум' },
    home_curriculum_desc: { en: 'Choose a level or create an AI lesson.', sr_lat: 'Izaberite nivo ili kreirajte AI lekciju.', sr_cyr: 'Изаберите ниво или креирајте АИ лекцију.' },
    home_beginner_label: { en: '1. Beginner Level', sr_lat: '1. Početni nivo', sr_cyr: '1. Почетни ниво' },
    home_beginner_title: { en: 'Start Here!', sr_lat: 'Počni ovde!', sr_cyr: 'Почни овде!' },
    home_beginner_desc: { en: 'Learn greetings, basic nouns and simple present tense.', sr_lat: 'Nauči pozdrave, osnovne imenice i prosto sadašnje vreme.', sr_cyr: 'Научи поздраве, основне именице и просто садашње време.' },
    home_intermediate_label: { en: '2. Intermediate Level', sr_lat: '2. Srednji nivo', sr_cyr: '2. Средњи ниво' },
    home_intermediate_title: { en: 'Master Sentences', sr_lat: 'Savlada rečenice', sr_cyr: 'Савлада реченице' },
    home_intermediate_desc: { en: 'Master complex sentences (and, but, or) and past tense.', sr_lat: 'Savladaj složene rečenice (i, ali, ili) i prošlo vreme.', sr_cyr: 'Савладај сложене реченице (и, али, или) и прошло време.' },
    home_advanced_label: { en: '3. Advanced Level', sr_lat: '3. Napredni nivo', sr_cyr: '3. Напредни ниво' },
    home_advanced_title: { en: 'Fluent Speech', sr_lat: 'Tečan razgovor', sr_cyr: 'Течан разговор' },
    home_advanced_desc: { en: 'Complex grammar, business terms and fluent speech.', sr_lat: 'Složena gramatika, poslovni termini i brz tečan govor.', sr_cyr: 'Сложена граматика, пословни термини и брз течан говор.' },

    // Stats View
    stats_title: { en: 'Statistics', sr_lat: 'Statistika', sr_cyr: 'Статистика' },
    stats_activity: { en: 'Activity', sr_lat: 'Aktivnost', sr_cyr: 'Активност' },
    stats_week: { en: 'Week', sr_lat: 'Nedelja', sr_cyr: 'Недеља' },
    stats_month: { en: 'Month', sr_lat: 'Mesec', sr_cyr: 'Месец' },
    stats_select_day: { en: 'Select a day on the chart', sr_lat: 'Izaberi dan na grafikonu', sr_cyr: 'Изабери дан на графикону' },
    stats_lessons: { en: 'Lessons', sr_lat: 'Lekcije', sr_cyr: 'Лекције' },
    stats_time: { en: 'Time', sr_lat: 'Vreme', sr_cyr: 'Време' },
    stats_skills: { en: 'Skills Analysis', sr_lat: 'Analiza Veština', sr_cyr: 'Анализа Вештина' },
    stats_daily_goal: { en: 'Daily Goal', sr_lat: 'Dnevni cilj', sr_cyr: 'Дневни циљ' },
    stats_loading: { en: 'Loading...', sr_lat: 'Učitavam...', sr_cyr: 'Учитавам...' },
    stats_xp_left: { en: 'XP Remaining', sr_lat: 'Preostalo XP', sr_cyr: 'Преостало XP' },
    stats_lesson_left: { en: 'Lessons', sr_lat: 'Lekcija', sr_cyr: 'Лекција' },
    stats_total_xp: { en: 'Total XP', sr_lat: 'Ukupni XP', sr_cyr: 'Укупни XP' },
    stats_current: { en: 'Current', sr_lat: 'Trenutno', sr_cyr: 'Тренутно' },
    stats_best: { en: 'Best', sr_lat: 'Najbolje', sr_cyr: 'Најбоље' },
    stats_streak: { en: 'Day Streak', sr_lat: 'Niz dana', sr_cyr: 'Низ дана' },
    stats_accuracy: { en: 'Accuracy', sr_lat: 'Tačnost', sr_cyr: 'Тачност' },

    // Profile View
    profile_member_since: { en: 'Member since:', sr_lat: 'Član od:', sr_cyr: 'Члан од:' },
    profile_achievements: { en: 'Achievements', sr_lat: 'Dostignuća', sr_cyr: 'Достигнућа' },
    profile_settings: { en: 'Settings', sr_lat: 'Opcije', sr_cyr: 'Опције' },
    profile_dark_mode: { en: 'Dark Mode', sr_lat: 'Tamni režim', sr_cyr: 'Тамни режим' },
    profile_sounds: { en: 'Sounds', sr_lat: 'Zvukovi', sr_cyr: 'Звукови' },
    profile_tts: { en: 'Pronunciation (AI)', sr_lat: 'Izgovor (AI)', sr_cyr: 'Изговор (AI)' },
    profile_logout: { en: 'Log Out', sr_lat: 'Odjavi se', sr_cyr: 'Одјави се' },
    profile_language: { en: 'App Language', sr_lat: 'Jezik aplikacije', sr_cyr: 'Језик апликације' },
    profile_direction: { en: 'Learning Direction', sr_lat: 'Smer učenja', sr_cyr: 'Смер учења' },
    profile_direction_sr_en: { en: 'Serbian → English', sr_lat: 'Srpski → Engleski', sr_cyr: 'Српски → Енглески' },
    profile_direction_en_sr: { en: 'English → Serbian', sr_lat: 'Engleski → Srpski', sr_cyr: 'Енглески → Српски' },

    // Lesson View
    lesson_check: { en: 'Check', sr_lat: 'Proveri', sr_cyr: 'Провери' },
    lesson_continue: { en: 'Continue', sr_lat: 'Nastavi', sr_cyr: 'Настави' },
    lesson_explain: { en: 'EXPLAIN THIS', sr_lat: 'OBJASNI MI OVO', sr_cyr: 'ОБЈАСНИ МИ ОВО' },
    lesson_ai_explain: { en: 'AI EXPLANATION', sr_lat: 'AI OBJAŠNJENJE', sr_cyr: 'АИ ОБЈАШЊЕЊЕ' },
    lesson_back: { en: '⬅ Back', sr_lat: '⬅ Nazad', sr_cyr: '⬅ Назад' },
    lesson_quit: { en: 'Leave lesson?', sr_lat: 'Napustiti lekciju?', sr_cyr: 'Напустити лекцију?' },
    lesson_explain_offline: { en: 'EXPLAIN THIS', sr_lat: 'OBJASNI MI OVO', sr_cyr: 'ОБЈАСНИ МИ ОВО' },
    lesson_explain_ai: { en: 'AI EXPLANATION', sr_lat: 'AI OBJAŠNJENJE', sr_cyr: 'АИ ОБЈАШЊЕЊЕ' },

    // Goal Modal
    goal_title: { en: 'Goal Achieved!', sr_lat: 'Cilj Ostvaren!', sr_cyr: 'Циљ Остварен!' },
    goal_msg: { en: 'Bravo! You reached your goal today. Keep it up! 🚀', sr_lat: 'Bravo! Danas si dostigao svoj cilj. Samo tako nastavi! 🚀', sr_cyr: 'Браво! Данас си достигао свој циљ. Само тако настави! 🚀' },
    goal_continue: { en: 'Continue!', sr_lat: 'Nastavi!', sr_cyr: 'Настави!' },

    // API Key Modal
    api_title: { en: 'API Key Required', sr_lat: 'Potreban API Ključ', sr_cyr: 'Потребан API Кључ' },
    api_desc: { en: 'For AI features (online) to work, a free Google Gemini API key is needed.', sr_lat: 'Da bi AI funkcije (online) radile, potreban je besplatan Google Gemini API ključ.', sr_cyr: 'Да би АИ функције (онлајн) радиле, потребан је бесплатан Google Gemini API кључ.' },
    api_get_key: { en: '👉 Get key here', sr_lat: '👉 Preuzmi ključ ovde', sr_cyr: '👉 Преузми кључ овде' },
    api_placeholder: { en: 'Paste key here (AIz...)', sr_lat: 'Ovde nalepi ključ (AIz...)', sr_cyr: 'Овде налепи кључ (AIz...)' },
    api_later: { en: 'Later', sr_lat: 'Kasnije', sr_cyr: 'Касније' },
    api_save: { en: 'Save', sr_lat: 'Sačuvaj', sr_cyr: 'Сачувај' },

    // Omni-Bar
    omni_placeholder: { en: 'Search (e.g. House, Dog)', sr_lat: 'Traži / Search (npr. Kuća, Dog)', sr_cyr: 'Тражи / Search (нпр. Кућа, Dog)' },
    omni_no_results: { en: 'No results for', sr_lat: 'Nema rezultata za', sr_cyr: 'Нема резултата за' },

    // Toast messages
    toast_guest_level: { en: 'Create an account to unlock all levels!', sr_lat: 'Napravi nalog da bi otključao sve nivoe!', sr_cyr: 'Направи налог да би откључао све нивое!' },
    toast_guest_ai: { en: 'Create an account to use AI lessons!', sr_lat: 'Napravi nalog da bi koristio AI lekcije!', sr_cyr: 'Направи налог да би користио АИ лекције!' },
    toast_guest_finish: { en: 'Great job! Create an account to save your XP and start your streak.', sr_lat: 'Odličan posao! Napravi nalog da bi sačuvao XP i započeo niz dana.', sr_cyr: 'Одличан посао! Направи налог да би сачувао XP и започео низ дана.' },
};

// Translation helper — returns string for current app language
const t = (key) => {
    const lang = state.settings.appLanguage || 'sr_lat';
    const entry = UI_STRINGS[key];
    if (!entry) return key;
    return entry[lang] || entry['sr_lat'] || key;
};

const ACHIEVEMENTS_DATA = [
    { id: 'first_lesson', icon: '🌱', title: 'Prvi Koraci', title_en: 'First Steps', desc: 'Završi prvu lekciju', desc_en: 'Complete your first lesson', condition: (s) => s.totalLessons >= 1 },
    { id: 'streak_3', icon: '🔥', title: 'Zagrevanje', title_en: 'Warming Up', desc: 'Dostigni niz od 3 dana', desc_en: 'Reach a 3 day streak', condition: (s) => s.streak >= 3 },
    { id: 'streak_7', icon: '🏺', title: 'Nedelja Dana', title_en: 'A Whole Week', desc: 'Dostigni niz od 7 dana', desc_en: 'Reach a 7 day streak', condition: (s) => s.streak >= 7 },
    { id: 'perfect_lesson', icon: '🎯', title: 'Savršenstvo', title_en: 'Perfection', desc: 'Završi lekciju bez greške', desc_en: 'Finish a lesson flawlessly', condition: (s) => s.lastLessonPerfect === true },
    { id: 'xp_1000', icon: '⚡', title: 'Energičan', title_en: 'Energetic', desc: 'Sakupi ukupno 1000 XP', desc_en: 'Collect 1000 XP in total', condition: (s) => s.xp >= 1000 },
    { id: 'early_bird', icon: '🌅', title: 'Ranoranilac', title_en: 'Early Bird', desc: 'Vežbaj pre 9 ujutru', desc_en: 'Practice before 9 AM', condition: (s) => new Date().getHours() < 9 && s.dailyXP > 0 }
];

const CURRICULUM = {
    BEGINNER: {
        skill: 'Vokabular',
        lessons: [
            {
                q: 'Translate: "Thank you"',
                q_rev: 'Kako se kaže "Hvala"?',
                options: ['Molim', 'Hvala', 'Izvini'],
                options_rev: ['Please', 'Thank you', 'Sorry'],
                correct: 'Hvala',
                correct_rev: 'Thank you',
                guide: {
                    'Molim': '❌ "Molim" znači "Please".',
                    'Izvini': '❌ "Izvini" znači "Sorry".'
                },
                guide_rev: {
                    'Please': '❌ "Please" means "Molim".',
                    'Sorry': '❌ "Sorry" means "Izvini".'
                }
            },
            {
                q: 'Translate: "Friend"',
                q_rev: 'Prevedi reč: "Prijatelj"',
                options: ['Prijatelj', 'Neprijatelj', 'Pas'],
                options_rev: ['Friend', 'Enemy', 'Dog'],
                correct: 'Prijatelj',
                correct_rev: 'Friend',
                guide: {
                    'Neprijatelj': '❌ "Neprijatelj" znači "Enemy".',
                    'Pas': '❌ "Pas" znači "Dog".'
                },
                guide_rev: {
                    'Enemy': '❌ "Enemy" means "Neprijatelj".',
                    'Dog': '❌ "Dog" means "Pas".'
                }
            },
            { type: 'speak', q: 'Say: "Dobro jutro"', correct: 'Dobro jutro', q_rev: 'Reci: "Good morning"', correct_rev: 'Good morning', explanation: '🗣️ Izgovori frazu.', explanation_rev: '🗣️ Speak the phrase.' },
            {
                q: 'Translate: "Goodbye"',
                q_rev: 'Kako se kaže "Doviđenja"?',
                options: ['Zdravo', 'Doviđenja', 'Laku noć'],
                options_rev: ['Hello', 'Goodbye', 'Good night'],
                correct: 'Doviđenja',
                correct_rev: 'Goodbye',
                guide: {
                    'Zdravo': '❌ "Zdravo" znači "Hello".',
                    'Laku noć': '❌ "Laku noć" znači "Good night".'
                },
                guide_rev: {
                    'Hello': '❌ "Hello" means "Zdravo".',
                    'Good night': '❌ "Good night" means "Laku noć".'
                }
            },
            {
                q: 'Translate: "House"',
                q_rev: 'Prevedi reč: "Kuća"',
                options: ['Kuća', 'Zgrada', 'Stan'],
                options_rev: ['House', 'Building', 'Apartment'],
                correct: 'Kuća',
                correct_rev: 'House',
                guide: {
                    'Zgrada': '❌ "Zgrada" znači "Building".',
                    'Stan': '❌ "Stan" znači "Apartment/Flat".'
                },
                guide_rev: {
                    'Building': '❌ "Building" means "Zgrada".',
                    'Apartment': '❌ "Apartment" means "Stan".'
                }
            },
            { type: 'speak', q: 'Say: "Hvala"', correct: 'Hvala', q_rev: 'Reci: "Thank you"', correct_rev: 'Thank you', explanation: '🗣️ Izgovori reč.', explanation_rev: '🗣️ Speak the word.' },
            {
                q: 'Translate: "Love"',
                q_rev: 'Prevedi reč: "Ljubav"',
                options: ['Ljubav', 'Mržnja', 'Sreća'],
                options_rev: ['Love', 'Hate', 'Happiness'],
                correct: 'Ljubav',
                correct_rev: 'Love',
                guide: {
                    'Mržnja': '❌ "Mržnja" znači "Hate".',
                    'Sreća': '❌ "Sreća" znači "Happiness".'
                },
                guide_rev: {
                    'Hate': '❌ "Hate" means "Mržnja".',
                    'Happiness': '❌ "Happiness" means "Sreća".'
                }
            },
            {
                q: 'Translate: "Please"',
                q_rev: 'Kako se kaže "Molim"?',
                options: ['Molim', 'Hvala', 'Ne'],
                options_rev: ['Please', 'Thanks', 'No'],
                correct: 'Molim',
                correct_rev: 'Please',
                guide: {
                    'Hvala': '❌ "Hvala" znači "Thanks".',
                    'Ne': '❌ "Ne" znači "No".'
                },
                guide_rev: {
                    'Thanks': '❌ "Thanks" means "Hvala".',
                    'No': '❌ "No" means "Ne".'
                }
            },
            {
                q: 'Translate: "Cat"',
                q_rev: 'Prevedi reč: "Mačka"',
                options: ['Pas', 'Mačka', 'Ptica'],
                options_rev: ['Dog', 'Cat', 'Bird'],
                correct: 'Mačka',
                correct_rev: 'Cat',
                guide: {
                    'Pas': '❌ "Pas" znači "Dog".',
                    'Ptica': '❌ "Ptica" znači "Bird".'
                },
                guide_rev: {
                    'Dog': '❌ "Dog" means "Pas".',
                    'Bird': '❌ "Bird" means "Ptica".'
                }
            }
        ]
    },
    INTERMEDIATE: {
        skill: 'Gramatika',
        lessons: [
            {
                q: 'Translate: "I am learning"',
                q_rev: 'Prevedi: "Učim"',
                options: ['Učim', 'Učio sam', 'Znam'],
                options_rev: ['I am learning', 'I learned', 'I know'],
                correct: 'Učim',
                correct_rev: 'I am learning',
                explanation: '✅ "**Učim**" je present continuous ("I am learning").',
                explanation_rev: '✅ "**I am learning**" is present continuous.'
            },
            { type: 'speak', q: 'Say: "Kako si"', correct: 'Kako si', q_rev: 'Reci: "How are you"', correct_rev: 'How are you', explanation: '🗣️ Fraza za pozdrav.', explanation_rev: '🗣️ Phrase for greeting.' },
            {
                q: 'Translate: "I went to the store"',
                q_rev: 'Prevedi: "Otišao sam u prodavnicu"',
                options: ['Idem u prodavnicu', 'Otišao sam u prodavnicu', 'Ići ću u prodavnicu'],
                options_rev: ['I am going to the store', 'I went to the store', 'I will go to the store'],
                correct: 'Otišao sam u prodavnicu',
                correct_rev: 'I went to the store',
                explanation: '✅ "**I went**" je prošlo vreme od "Go".',
                explanation_rev: '✅ "**Otišao sam**" is past tense of "Ići".'
            },
            {
                q: 'Translate: "She is reading a book"',
                q_rev: 'Prevedi: "Ona čita knjigu"',
                options: ['Ona čita knjigu', 'Ona je čitala knjigu', 'Ona će čitati knjigu'],
                options_rev: ['She is reading a book', 'She was reading a book', 'She will read a book'],
                correct: 'Ona čita knjigu',
                correct_rev: 'She is reading a book',
                explanation: '✅ "**She is reading**" znači da ona to radi **upravo sada**.',
                explanation_rev: '✅ "**Ona čita**" means she is doing it **right now**.'
            },
            { type: 'speak', q: 'Say: "Volim da učim"', correct: 'Volim da učim', q_rev: 'Reci: "I love learning"', correct_rev: 'I love learning', explanation: '🗣️', explanation_rev: '🗣️' },
            {
                q: 'Translate: "We are happy"',
                q_rev: 'Prevedi: "Mi smo srećni"',
                options: ['Mi smo srećni', 'Oni su srećni', 'Vi ste srećni'],
                options_rev: ['We are happy', 'They are happy', 'You are happy'],
                correct: 'Mi smo srećni',
                correct_rev: 'We are happy',
                explanation: '✅ "**We**" znači "**Mi**".',
                explanation_rev: '✅ "**Mi**" means "**We**".'
            }
        ]
    },
    ADVANCED: {
        skill: 'Čitanje',
        lessons: [
            {
                q: 'Translate: "Good morning"',
                q_rev: 'Odaberi formalni pozdrav:',
                options: ['Šta ima', 'Dobro jutro', 'Brate'],
                options_rev: ['What up', 'Good morning', 'Yo'],
                correct: 'Dobro jutro',
                correct_rev: 'Good morning',
                explanation: '✅ "**Good morning**" / "**Dobro jutro**" je ljubazan i formalan pozdrav.',
                explanation_rev: '✅ "**Dobro jutro**" / "**Good morning**" is a polite and formal greeting.'
            },
            {
                q: 'Translate idiom: "Break a leg"',
                q_rev: 'Prevedi idiom: "Srećno"',
                options: ['Slomi nogu', 'Srećno', 'Boli me noga'],
                options_rev: ['Break a leg', 'Good luck', 'My leg hurts'],
                correct: 'Srećno',
                correct_rev: 'Break a leg',
                explanation: '✅ "**Break a leg**" je pozorišni idiom koji znači "**Srećno!**".',
                explanation_rev: '✅ "**Break a leg**" is a theatrical idiom that means "**Good luck!**".'
            },
            { type: 'speak', q: 'Say: "Razumem sve"', correct: 'Razumem sve', q_rev: 'Reci: "I understand everything"', correct_rev: 'I understand everything', explanation: '🗣️', explanation_rev: '🗣️' },
            {
                q: 'Translate business term: "Invoice"',
                q_rev: 'Odaberi poslovni termin: "Faktura"',
                options: ['Račun', 'Faktura', 'Novac'],
                options_rev: ['Bill', 'Invoice', 'Money'],
                correct: 'Faktura',
                correct_rev: 'Invoice',
                explanation: '✅ "**Invoice**" je "**Faktura**" (za plaćanje robe/usluga).',
                explanation_rev: '✅ "**Faktura**" is "**Invoice**" (for paying goods/services).'
            },
            {
                q: 'Translate: "Despite the rain, we went out."',
                q_rev: 'Prevedi: "Uprkos kiši, izašli smo."',
                options: ['Zbog kiše smo izašli', 'Uprkos kiši, izašli smo', 'Kada padne kiša, izlazimo'],
                options_rev: ['Because of the rain, we went out', 'Despite the rain, we went out', 'When it rains, we go out'],
                correct: 'Uprkos kiši, izašli smo',
                correct_rev: 'Despite the rain, we went out',
                explanation: '✅ "**Despite**" znači "**Uprkos**".',
                explanation_rev: '✅ "**Uprkos**" means "**Despite**".'
            },
            { type: 'speak', q: 'Say: "Uspeh je putovanje"', correct: 'Uspeh je putovanje', q_rev: 'Reci: "Success is a journey"', correct_rev: 'Success is a journey', explanation: '🗣️', explanation_rev: '🗣️' }
        ]
    }
};

// [SHIELD_DAEMON: VALIDATED] — Omni-Bar Dictionary (Mock — will be replaced with IndexedDB later)
const DICTIONARY = [
    { en: 'Dog', sr_lat: 'Pas', sr_cyr: 'Пас', gender: 'm', pos: 'imenica', emoji: '🐕' },
    { en: 'Cat', sr_lat: 'Mačka', sr_cyr: 'Мачка', gender: 'ž', pos: 'imenica', emoji: '🐈' },
    { en: 'House', sr_lat: 'Kuća', sr_cyr: 'Кућа', gender: 'ž', pos: 'imenica', emoji: '🏠' },
    { en: 'Water', sr_lat: 'Voda', sr_cyr: 'Вода', gender: 'ž', pos: 'imenica', emoji: '💧' },
    { en: 'Book', sr_lat: 'Knjiga', sr_cyr: 'Књига', gender: 'ž', pos: 'imenica', emoji: '📖' },
    { en: 'Friend', sr_lat: 'Prijatelj', sr_cyr: 'Пријатељ', gender: 'm', pos: 'imenica', emoji: '🤝' },
    { en: 'Love', sr_lat: 'Ljubav', sr_cyr: 'Љубав', gender: 'ž', pos: 'imenica', emoji: '❤️' },
    { en: 'Sun', sr_lat: 'Sunce', sr_cyr: 'Сунце', gender: 's', pos: 'imenica', emoji: '☀️' },
    { en: 'Moon', sr_lat: 'Mesec', sr_cyr: 'Месец', gender: 'm', pos: 'imenica', emoji: '🌙' },
    { en: 'Food', sr_lat: 'Hrana', sr_cyr: 'Храна', gender: 'ž', pos: 'imenica', emoji: '🍽️' },
    { en: 'School', sr_lat: 'Škola', sr_cyr: 'Школа', gender: 'ž', pos: 'imenica', emoji: '🏫' },
    { en: 'Child', sr_lat: 'Dete', sr_cyr: 'Дете', gender: 's', pos: 'imenica', emoji: '👶' },
    { en: 'Mother', sr_lat: 'Majka', sr_cyr: 'Мајка', gender: 'ž', pos: 'imenica', emoji: '👩' },
    { en: 'Father', sr_lat: 'Otac', sr_cyr: 'Отац', gender: 'm', pos: 'imenica', emoji: '👨' },
    { en: 'Tree', sr_lat: 'Drvo', sr_cyr: 'Дрво', gender: 's', pos: 'imenica', emoji: '🌳' },
    { en: 'Car', sr_lat: 'Auto', sr_cyr: 'Ауто', gender: 's', pos: 'imenica', emoji: '🚗' },
    { en: 'City', sr_lat: 'Grad', sr_cyr: 'Град', gender: 'm', pos: 'imenica', emoji: '🏙️' },
    { en: 'Bird', sr_lat: 'Ptica', sr_cyr: 'Птица', gender: 'ž', pos: 'imenica', emoji: '🐦' },
    { en: 'Thank you', sr_lat: 'Hvala', sr_cyr: 'Хвала', gender: '-', pos: 'fraza', emoji: '🙏' },
    { en: 'Goodbye', sr_lat: 'Doviđenja', sr_cyr: 'Довиђења', gender: '-', pos: 'fraza', emoji: '👋' },
    { en: 'Hello', sr_lat: 'Zdravo', sr_cyr: 'Здраво', gender: '-', pos: 'fraza', emoji: '👋' },
    { en: 'Please', sr_lat: 'Molim', sr_cyr: 'Молим', gender: '-', pos: 'fraza', emoji: '🤲' },
    { en: 'Yes', sr_lat: 'Da', sr_cyr: 'Да', gender: '-', pos: 'rečca', emoji: '✅' },
    { en: 'No', sr_lat: 'Ne', sr_cyr: 'Не', gender: '-', pos: 'rečca', emoji: '❌' },
    { en: 'Good', sr_lat: 'Dobro', sr_cyr: 'Добро', gender: 's', pos: 'pridev', emoji: '👍' },
];

let _searchDebounceTimer = null;

const app = {
    init: () => {
        let sAuth = sessionStorage.getItem('serbolingo_auth');
        if (!sAuth) sAuth = localStorage.getItem('serbolingo_auth');

        const sStats = localStorage.getItem('serbolingo_stats');

        if (sAuth) {
            state.user = JSON.parse(sAuth);
            // Default join date if missing
            if (!state.user.joinedDate) state.user.joinedDate = new Date().toISOString().split('T')[0];
        }

        // Restore API Key if present
        const savedKey = localStorage.getItem('serbolingo_api_key');
        if (savedKey) {
            apiKey = savedKey;
            console.log("API Key restored from storage.");
        }

        if (sStats) {
            const parsed = JSON.parse(sStats);
            Object.assign(state, parsed);

            // Migrate legacy state or ensure settings exist
            if (!state.settings) state.settings = { darkMode: true, volume: { sfx: 1.0, tts: 1.0 } };
            if (!state.settings.appLanguage) state.settings.appLanguage = 'sr_lat';
            if (!state.settings.learningDirection) state.settings.learningDirection = 'sr_to_en';
            if (!state.achievements) state.achievements = {};
            // Fix missing history
            if (!state.history) state.history = {};
        } else {
            // Apply defaults if no stats exist
            if (!state.settings) state.settings = { darkMode: true, volume: { sfx: 1.0, tts: 1.0 }, appLanguage: 'sr_lat', learningDirection: 'sr_to_en' };
        }

        // DAILY RESET LOGIC
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate !== today) {
            if (state.lastActiveDate) {
                const lastDate = new Date(state.lastActiveDate);
                const currentDate = new Date(today);
                const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                if (diffDays > 1) {
                    state.streak = 0; // Lost streak
                }
            }
            state.dailyXP = 0;
            state.goalCelebrated = false;
            state.hearts = 5; // Refill hearts daily
            if (state.user) {
                localStorage.setItem('serbolingo_stats', JSON.stringify(state));
            }
        }

        app.applyDarkMode();
        // Learning Direction now controls both lesson direction AND app UI language
        app.setLearningDirection(state.settings.learningDirection || 'sr_to_en');
        app.updateProfileUI(); // Update UI with latest values

        if (state.user) {
            app.showMainApp();
        }
    },
    applyDarkMode: () => {
        const html = document.documentElement;
        if (state.settings.darkMode) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        // Update button visual state if exists
        const btn = document.getElementById('btn-dark-mode');
        if (btn) {
            if (state.settings.darkMode) {
                btn.classList.replace('bg-slate-200', 'bg-blue-500');
                btn.children[0].classList.add('translate-x-5');
            } else {
                btn.classList.replace('bg-blue-500', 'bg-slate-200');
                btn.children[0].classList.remove('translate-x-5');
            }
        }
    },
    toggleDarkMode: () => {
        state.settings.darkMode = !state.settings.darkMode;
        app.applyDarkMode();
        app.saveStats();
    },
    setVolume: (type, val) => {
        state.settings.volume[type] = parseFloat(val);
        document.getElementById(`vol-${type}-val`).innerText = Math.round(state.settings.volume[type] * 100) + '%';
        app.saveStats();
        // Test sound
        if (type === 'sfx' && state.settings.volume.sfx > 0) {
            // Play a short silent blip or re-use correct sound but very quiet/short just for feedback? 
            // Better not to annoy user, just update UI.
        }
    },
    updateProfileUI: () => {
        if (!state.user) return;

        // Header
        document.getElementById('profile-name').innerText = state.user.name;
        document.getElementById('profile-avatar').innerText = state.user.avatar || '👤';
        document.getElementById('profile-joined').innerText = `Član od: ${state.user.joinedDate}`;

        // Settings Controls
        document.getElementById('vol-sfx').value = state.settings.volume.sfx;
        document.getElementById('vol-sfx-val').innerText = Math.round(state.settings.volume.sfx * 100) + '%';
        document.getElementById('vol-tts').value = state.settings.volume.tts;
        document.getElementById('vol-tts-val').innerText = Math.round(state.settings.volume.tts * 100) + '%';

        // Avatar Picker
        const avatars = ['👤', '👨‍🎓', '👩‍🎓', '🦄', '🦁', '🦉', '🐶', '🤖', '👻', '🐸', '🐨', '🐼'];
        const picker = document.getElementById('avatar-picker');
        picker.innerHTML = avatars.map(a =>
            `<button onclick="app.selectAvatar('${a}')" class="text-2xl p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${state.user.avatar === a ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : ''}">${a}</button>`
        ).join('');

        app.renderAchievements();
    },
    toggleAvatarPicker: () => {
        document.getElementById('avatar-picker').classList.toggle('hidden');
    },
    selectAvatar: (avatar) => {
        state.user.avatar = avatar;
        localStorage.setItem('serbolingo_auth', JSON.stringify(state.user));
        app.updateProfileUI();
        document.getElementById('avatar-picker').classList.add('hidden');
    },
    renderAchievements: () => {
        const list = document.getElementById('achievements-list');
        const isEn = state.settings.appLanguage === 'en';
        list.innerHTML = ACHIEVEMENTS_DATA.map(a => {
            const unlocked = state.achievements[a.id];
            const title = isEn ? a.title_en : a.title;
            const desc = isEn ? a.desc_en : a.desc;
            return `
            <div class="flex items-center gap-3 p-3 rounded-xl border-2 ${unlocked ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-900/30' : 'bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 grayscale opacity-70'}">
                <div class="text-2xl ${unlocked ? 'animate-bounce' : ''}">${a.icon}</div>
                <div class="flex-1">
                    <h4 class="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">${title}</h4>
                    <p class="text-[10px] font-bold text-slate-400 leading-tight">${desc}</p>
                </div>
                ${unlocked ? '<span class="text-green-500 text-lg">✓</span>' : '<span class="text-slate-300 text-lg">🔒</span>'}
            </div>`;
        }).join('');
    },
    handleAuth: () => {
        const u = document.getElementById('auth-username').value;
        if (!u) return;
        state.user = {
            name: u,
            joinedDate: new Date().toISOString().split('T')[0],
            avatar: '👤',
            isGuest: false
        };
        
        const remember = document.getElementById('auth-remember').checked;
        if (remember) {
            localStorage.setItem('serbolingo_auth', JSON.stringify(state.user));
        } else {
            sessionStorage.setItem('serbolingo_auth', JSON.stringify(state.user));
        }

        // Reset state for new user
        state.xp = 0; state.dailyXP = 0; state.streak = 0; state.maxStreak = 0; state.hearts = 5;
        state.history = {}; state.achievements = {}; state.lastActiveDate = null;
        state.totalLessons = 0; state.correctAnswers = 0; state.totalAnswers = 0;

        app.showMainApp();
    },
    handleGuest: () => {
        state.user = {
            name: "Gost",
            joinedDate: new Date().toISOString().split('T')[0],
            avatar: "👤",
            isGuest: true
        };
        // Reset state for guest
        state.xp = 0; state.dailyXP = 0; state.streak = 0; state.maxStreak = 0; state.hearts = 5;
        state.history = {}; state.achievements = {}; state.lastActiveDate = null;
        state.totalLessons = 0; state.correctAnswers = 0; state.totalAnswers = 0;

        app.showMainApp();
    },
    showMainApp: () => {
        document.getElementById('view-auth').classList.add('hidden');
        document.getElementById('main-header').classList.remove('hidden');
        document.getElementById('app-container').classList.remove('hidden');
        document.getElementById('main-nav').classList.remove('hidden');

        app.applyLanguage();
        app.updateProfileUI();
        app.updateStatsUI();
        app.navigate('home');
    },
    resetDetailBox: () => {
        const l = document.getElementById('line-lesson-container');
        const t = document.getElementById('line-time-container');
        const vl = document.getElementById('val-lesson');
        const vt = document.getElementById('val-time');
        if (l && t && vl && vt) {
            l.classList.remove('hidden');
            t.classList.remove('hidden');
            vl.classList.add('hidden');
            vt.classList.add('hidden');
        }
    },
    navigate: (vid) => {
        ['view-home', 'view-lesson', 'view-stats', 'view-profile'].forEach(id => document.getElementById(id).classList.add('hidden'));
        document.getElementById(`view-${vid}`).classList.remove('hidden');

        if (vid === 'stats') {
            app.resetDetailBox();
            app.renderChart();
            app.renderRadar();
            app.updateStatsUI();
            app.updateGoalUI();
        }
        if (vid === 'profile') {
            app.updateProfileUI();
        }

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.replace('text-blue-500', 'text-slate-400'));
        const navBtn = document.getElementById(`nav-${vid}`);
        if (navBtn) navBtn.classList.replace('text-slate-400', 'text-blue-500');
    },
    startLevel: (k) => {
        if (state.user && state.user.isGuest && k !== 'BEGINNER') {
            app.showToast(t('toast_guest_level'), 'error');
            return;
        }
        try {
            // Resume logic: if same level, keep index. Else reset.
            if (state.currentLevelKey !== k) {
                state.currentLevelKey = k;
                state.currentLessonIndex = 0;
            } else {
                // Check if we are at the end of the lesson (completed)
                const level = CURRICULUM[k];
                if (level && level.lessons && state.currentLessonIndex >= level.lessons.length) {
                    state.currentLessonIndex = 0; // Restart if finished
                }
            }
            state.lastLessonMistakes = 0; // Reset mistakes counter for achievements
            app.saveStats(); // Save immediately
            app.navigate('lesson');
            app.renderQuestion();
        } catch (e) {
            console.error("Error starting level:", e);
            // Fallback: Reset and try again
            state.currentLevelKey = k;
            state.currentLessonIndex = 0;
            app.saveStats();
            app.navigate('lesson');
            app.renderQuestion();
        }
    },
    renderQuestion: () => {
        // Safety check for missing curriculum (e.g. AI lesson lost on reload)
        if (!CURRICULUM[state.currentLevelKey] || !CURRICULUM[state.currentLevelKey].lessons) {
            alert("Lesson data missing. Returning to home.");
            app.navigate('home');
            return;
        }

        // Ensure index is a number and valid
        state.currentLessonIndex = Number(state.currentLessonIndex) || 0;
        if (state.currentLessonIndex < 0) state.currentLessonIndex = 0;

        const lessons = CURRICULUM[state.currentLevelKey].lessons;
        if (lessons.length === 0) {
            alert("No lessons available.");
            app.navigate('home');
            return;
        }

        // If index is out of bounds, reset to 0
        if (state.currentLessonIndex >= lessons.length) {
            state.currentLessonIndex = 0;
        }

        const l = lessons[state.currentLessonIndex];
        const area = document.getElementById('lesson-content-area');
        document.getElementById('lesson-progress-bar').style.width = `${(state.currentLessonIndex / lessons.length) * 100}%`;

        // Reset UI state for new question
        document.getElementById('check-btn').classList.remove('hidden');
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('feedback-area').classList.add('hidden');

        // Reset button state
        document.getElementById('check-btn').disabled = true;
        document.getElementById('check-btn').classList.replace('bg-blue-500', 'bg-slate-200');
        document.getElementById('check-btn').classList.replace('text-white', 'text-slate-400');

        state.userSelection = null;

        if (l.type === 'speak') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const speakQuestion = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const speakCorrect = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
            
            area.innerHTML = `
                <h2 class="text-xl font-black mb-4 text-slate-700 dark:text-slate-100">${speakQuestion}</h2>
                <div class="flex flex-col items-center gap-6 w-full max-w-xs">
                    <button onclick="app.speakPhrase('${speakCorrect}')" class="flex items-center gap-2 px-6 py-3 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 rounded-2xl font-bold shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        <span>🔊</span> Slušaj
                    </button>
                    
                    <button id="mic-btn" onclick="app.startMicRecognition()" class="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-slate-200 dark:border-slate-600 flex items-center justify-center text-3xl shadow-sm transition-all active:scale-95">
                        🎙️
                    </button>
                    
                    <div id="transcription-box" class="min-h-[60px] w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-center">
                        <p class="text-xs font-bold text-slate-400 uppercase mb-1">Rekli ste:</p>
                        <p id="transcription-text" class="text-lg font-black text-slate-700 dark:text-white">...</p>
                    </div>
                </div>
            `;
        } else {
            // Apply bidirectional learning for standard questions
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const optionsArray = (isSrToEn && l.options_rev) ? l.options_rev : l.options;

            area.innerHTML = `<h2 class="text-xl font-black mb-8 text-slate-700 dark:text-slate-100">${questionText}</h2><div class="grid w-full max-w-xs gap-3">` +
                optionsArray.map(o => `<button onclick="app.selectOption(this, '${o}')" class="option-btn py-3 rounded-xl border-2 font-black text-xs text-slate-700 border-slate-200 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800">${o}</button>`).join('') + `</div>`;
        }
    },
    selectOption: (btn, v) => {
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected', 'bg-blue-50', 'border-blue-400', 'dark:bg-blue-900', 'dark:border-blue-500'));
        btn.classList.add('selected', 'bg-blue-50', 'border-blue-400', 'dark:bg-blue-900', 'dark:border-blue-500');
        state.userSelection = v;
        app.enableCheckBtn();
    },
    enableCheckBtn: () => {
        const btn = document.getElementById('check-btn');
        btn.disabled = false;
        btn.classList.replace('bg-slate-200', 'bg-blue-500');
        btn.classList.replace('text-slate-400', 'text-white');

        // Add dark mode support logic for classes if needed, 
        // but utility classes in HTML usually handle the rest.
        // The check-btn starts as bg-slate-200 dark:bg-slate-800.
        // When enabled, it switches to bg-blue-500.
        btn.classList.remove('dark:bg-slate-800', 'dark:text-slate-600');
    },
    speakPhrase: (text) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        u.volume = state.settings.volume.tts;
        window.speechSynthesis.speak(u);
    },
    startMicRecognition: () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Vaš pretraživač ne podržava prepoznavanje govora.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        const micBtn = document.getElementById('mic-btn');
        micBtn.classList.add('animate-pulse', 'bg-red-50', 'border-red-400', 'text-red-500');

        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('transcription-text').innerText = transcript;
            state.userSelection = transcript;
            app.enableCheckBtn();

            micBtn.classList.remove('animate-pulse', 'bg-red-50', 'border-red-400', 'text-red-500');
        };

        recognition.onspeechend = () => {
            recognition.stop();
            micBtn.classList.remove('animate-pulse', 'bg-red-50', 'border-red-400', 'text-red-500');
        };
    },
    checkAnswer: () => {
        try {
            const l = CURRICULUM[state.currentLevelKey].lessons[state.currentLessonIndex];
            let isC = false;

            if (l.type === 'speak') {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                // Normalize both strings: remove punctuation, lowercase, trim
                const normalize = (s) => s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
                isC = normalize(state.userSelection || "") === normalize(correctText);
            } else {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                isC = state.userSelection === correctText;
                // Lock answers for multiple choice
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    if (btn.innerText === l.correct) {
                        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-500', 'dark:text-green-300');
                    } else if (btn.classList.contains('selected') && !isC) {
                        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-500', 'dark:text-red-300');
                    }
                });
            }

            state.totalAnswers++;

            if (isC) {
                app.playSound('correct');
                state.xp += 10;
                
                // STREAK AND DAILY ACTIVE LOGIC
                const today = new Date().toISOString().split('T')[0];
                if (state.lastActiveDate !== today) {
                    if (state.lastActiveDate) {
                        const lastDate = new Date(state.lastActiveDate);
                        const currentDate = new Date(today);
                        const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                        if (diffDays === 1) {
                            state.streak += 1;
                        } else if (diffDays > 1) {
                            state.streak = 1;
                        }
                    } else {
                        state.streak = 1;
                    }
                    state.lastActiveDate = today;
                    if (state.streak > state.maxStreak) state.maxStreak = state.streak;
                }

                state.dailyXP += 10;
                state.correctAnswers++;

                // Update History
                if (!state.history[today]) state.history[today] = { xp: 0, lessons: 0 };
                state.history[today].xp += 10;

                // Update Skills
                const skill = CURRICULUM[state.currentLevelKey].skill || 'Vokabular';
                if (state.skills[skill] < 100) state.skills[skill] += 2;
            } else {
                app.playSound('incorrect');
                state.hearts--;
                state.lastLessonMistakes = (state.lastLessonMistakes || 0) + 1;
            }

            const fb = document.getElementById('feedback-area');
            fb.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'dark:bg-green-900/40', 'dark:bg-red-900/40');

            fb.classList.add(isC ? 'bg-green-100' : 'bg-red-100');
            // Add dark mode support to feedback logic handled via classes above directly

            document.getElementById('feedback-title').innerText = isC ? "Bravo!" : "Netačno";
            document.getElementById('feedback-title').className = `font-black text-sm ${isC ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`;

            document.getElementById('feedback-msg').innerText = isC ? "+10 XP" : `Tačno: ${l.correct}`;
            document.getElementById('feedback-msg').className = `text-[11px] font-bold ${isC ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'}`;

            document.getElementById('feedback-icon').innerText = isC ? "✅" : "❌";

            const expContainer = document.getElementById('feedback-explanation-container');
            const expText = document.getElementById('explanation-text');
            const expButtons = document.getElementById('explanation-buttons');

            if (isC) {
                expContainer.classList.add('hidden');
            } else {
                expContainer.classList.remove('hidden');
                expButtons.classList.remove('hidden');
                expText.classList.add('hidden');
                expText.innerText = "";
            }

            app.updateStatsUI(); app.saveStats();
            document.getElementById('check-btn').classList.add('hidden');
            document.getElementById('next-btn').classList.remove('hidden');

            if (state.dailyXP >= state.dailyGoal && !state.goalCelebrated) {
                state.goalCelebrated = true;
                setTimeout(app.showGoalModal, 500);
            }
        } catch (e) {
            console.error("Error in checkAnswer:", e);
            alert("Something went wrong. Please try reloading.");
        }
    },
    nextQuestion: () => {
        state.currentLessonIndex++;
        app.saveStats(); // Save immediately
        if (state.currentLessonIndex < CURRICULUM[state.currentLevelKey].lessons.length) app.renderQuestion();
        else {
            state.totalLessons++;
            const today = new Date().toISOString().split('T')[0];
            if (!state.history[today]) state.history[today] = { xp: 0, lessons: 0 };
            state.history[today].lessons += 1;

            // Check for perfect lesson
            if (!state.lastLessonMistakes) state.lastLessonPerfect = true;
            else state.lastLessonPerfect = false;

            app.checkAchievements();
            app.saveStats();
            
            if (state.user && state.user.isGuest) {
                app.showToast(t('toast_guest_finish'), 'success');
            }
            
            app.navigate('home');
        }
    },
    checkAchievements: () => {
        let newUnlock = false;
        ACHIEVEMENTS_DATA.forEach(a => {
            if (!state.achievements[a.id] && a.condition(state)) {
                state.achievements[a.id] = true;
                newUnlock = true;
            }
        });
        if (newUnlock) {
            app.saveStats();
        }
    },
    showGoalModal: () => {
        document.getElementById('goal-modal').classList.remove('hidden');
        app.fireConfetti();
        const icon = document.getElementById('goal-icon');
        if (icon) icon.innerText = "🥳";
    },
    closeGoalModal: () => document.getElementById('goal-modal').classList.add('hidden'),
    fireConfetti: () => {
        const container = document.getElementById('confetti-container');
        const colors = ['#3b82f6', '#fb923c', '#ef4444', '#10b981'];
        for (let i = 0; i < 40; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(c);
            setTimeout(() => c.remove(), 4000);
        }
    },
    updateStatsUI: () => {
        document.getElementById('xp-display').innerText = state.xp;
        document.getElementById('hearts-display').innerText = state.hearts;
        document.getElementById('streak-display').innerText = state.streak;
        document.getElementById('stat-total-xp').innerText = state.xp;
        document.getElementById('stat-current-streak').innerText = state.streak;
        document.getElementById('stat-best-streak').innerText = state.maxStreak;
        document.getElementById('stat-total-lessons').innerText = state.totalLessons;
        const acc = state.totalAnswers > 0 ? Math.round((state.correctAnswers / state.totalAnswers) * 100) : 0;
        document.getElementById('stat-accuracy').innerText = `${acc}%`;
    },
    updateGoalUI: () => {
        const perc = Math.min(100, (state.dailyXP / state.dailyGoal) * 100);
        document.getElementById('goal-ring').style.strokeDashoffset = 125.6 - (perc / 100 * 125.6);
        document.getElementById('goal-percent').innerText = `${Math.round(perc)}%`;
        const xpLeft = Math.max(0, state.dailyGoal - state.dailyXP);
        document.getElementById('goal-xp-left').innerText = xpLeft;
        const lessonsLeft = Math.ceil(xpLeft / 20);
        document.getElementById('goal-lessons-left').innerText = `~${lessonsLeft}`;

        const goalText = document.getElementById('goal-text');
        const goalIcon = document.getElementById('goal-icon');
        const isEn = state.settings.appLanguage === 'en';
        if (perc >= 100) { 
            goalText.innerText = isEn ? "Goal reached! Great job!" : "Cilj ostvaren! Odličan posao!"; 
            goalIcon.innerText = "🥳"; 
        } else { 
            goalText.innerText = isEn ? `${xpLeft} more XP to goal` : `Još ${xpLeft} XP do cilja`; 
            goalIcon.innerText = "🏆"; 
        }
    },
    toggleChart: (p) => {
        state.chartPeriod = p;
        document.querySelectorAll('.chart-toggle-btn').forEach(btn => btn.classList.remove('active', 'bg-blue-500', 'text-white'));

        const btn = document.getElementById(`btn-${p}`);
        btn.classList.add('active');

        document.querySelectorAll('.chart-toggle-btn').forEach(b => {
            if (b.id === `btn-${p}`) {
                b.classList.add('bg-blue-500', 'text-white');
                b.classList.remove('bg-slate-100', 'text-slate-500', 'dark:bg-slate-700', 'dark:text-slate-400');
            } else {
                b.classList.remove('bg-blue-500', 'text-white');
                b.classList.add('bg-slate-100', 'text-slate-500', 'dark:bg-slate-700', 'dark:text-slate-400');
            }
        })

        app.resetDetailBox();
        app.renderChart();
    },
    renderChart: () => {
        const ctx = document.getElementById('xpChart').getContext('2d');
        if (app.chartInstance) app.chartInstance.destroy();

        const isW = state.chartPeriod === 'week';
        const labels = [];
        const chartData = [];

        // Generate last 7 or 30 days
        const days = isW ? 7 : 30;
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // Label
            if (isW) {
                const dayNames = ['N', 'P', 'U', 'S', 'Č', 'P', 'S'];
                labels.push(dayNames[d.getDay()]);
            } else {
                labels.push(d.getDate());
            }

            // Data
            const dayData = state.history[dateStr];
            chartData.push(dayData ? dayData.lessons : 0);
        }

        // Dark mode colors
        const isDark = state.settings.darkMode;
        const barColor = isDark ? '#3b82f6' : '#3b82f6';
        const tickColor = isDark ? '#94a3b8' : '#64748b';

        app.chartInstance = new Chart(ctx, {
            type: 'bar', data: { labels, datasets: [{ data: chartData, backgroundColor: barColor, borderRadius: 4 }] },
            options: {
                maintainAspectRatio: false, plugins: { legend: false, tooltip: { enabled: false } },
                onClick: (e, items) => {
                    if (items.length > 0) {
                        const idx = items[0].index;
                        document.getElementById('line-lesson-container').classList.add('hidden');
                        document.getElementById('line-time-container').classList.add('hidden');
                        const vLesson = document.getElementById('val-lesson');
                        const vTime = document.getElementById('val-time');
                        vLesson.classList.remove('hidden'); vLesson.innerText = chartData[idx];
                        vTime.classList.remove('hidden'); vTime.innerText = `${chartData[idx] * 3}m`;
                    }
                },
                scales: {
                    y: { display: false, beginAtZero: true },
                    x: { grid: { display: false }, ticks: { font: { size: 9, weight: 'bold' }, color: tickColor } }
                }
            }
        });
    },
    renderRadar: () => {
        const ctx = document.getElementById('skillsRadarChart').getContext('2d');
        if (app.radarInstance) app.radarInstance.destroy();

        const isDark = state.settings.darkMode;
        const pointLabelColor = isDark ? '#94a3b8' : '#64748b';
        const gridColor = isDark ? '#334155' : '#f1f5f9';

        const isEn = state.settings.appLanguage === 'en';
        const labels = Object.keys(state.skills).map(k => {
            if (!isEn) return k;
            const t = { 'Slušanje': 'Listening', 'Govor': 'Speaking', 'Čitanje': 'Reading', 'Pisanje': 'Writing', 'Gramatika': 'Grammar', 'Vokabular': 'Vocabulary' };
            return t[k] || k;
        });

        app.radarInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    data: Object.values(state.skills),
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    borderColor: '#3b82f6',
                    pointBackgroundColor: '#3b82f6',
                    datalabels: {
                        align: 'top',
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        font: { weight: 'bold', size: 10 },
                        padding: 4
                    }
                }]
            },
            plugins: [ChartDataLabels],
            options: {
                maintainAspectRatio: false,
                plugins: { legend: false },
                scales: {
                    r: {
                        min: 0, max: 120, // Raised max to give space for labels
                        ticks: { display: false },
                        pointLabels: { font: { size: 8, weight: '800' }, color: pointLabelColor },
                        grid: { color: gridColor },
                        angleLines: { color: gridColor }
                    }
                }
            }
        });
    },
    generateAILesson: async () => {
        if (state.user && state.user.isGuest) {
            app.showToast(t('toast_guest_ai'), 'error');
            return;
        }
        const btn = document.getElementById('ai-gen-btn');
        const originalText = "✨";
        btn.innerText = "⏳";

        // 1. Check for API Key immediately
        if (!apiKey) {
            app.openApiKeyModal();
            btn.innerText = originalText;
            return;
        }

        // 2. Prepare for API Call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        try {
            const isEnToSr = state.settings.learningDirection === 'en_to_sr';
            let promptText = "Generate 5 English vocabulary or grammar questions for a Serbian student learning English. Do not include literal translations in brackets in the question. Return ONLY a valid JSON array of 5 objects: [{ \"q\": \"Prevedi: [Serbian word]\", \"options\": [\"[English option 1]\", \"[English option 2]\", \"[English option 3]\"], \"correct\": \"[exact correct English option string]\", \"explanation\": \"Objašnjenje na srpskom zašto je to tačno.\" }]";
            
            if (isEnToSr) {
                promptText = "Generate 5 Serbian vocabulary or grammar questions for an English student learning Serbian. Do not include literal translations in brackets in the question. Return ONLY a valid JSON array of 5 objects: [{ \"q\": \"Translate: [English word]\", \"options\": [\"[Serbian option 1]\", \"[Serbian option 2]\", \"[Serbian option 3]\"], \"correct\": \"[exact correct Serbian option string]\", \"explanation\": \"Explanation in English why this is correct.\" }]";
            }
            // Updated models list for 2026 compatibility
            const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
            let resp;
            let errors = [];

            // 3. Loop through models
            for (const model of models) {
                try {
                    const fetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { responseMimeType: "application/json" } }),
                        signal: controller.signal
                    });

                    resp = await fetchPromise;

                    if (!resp.ok) {
                        errors.push(`${model}: ${resp.status} ${resp.statusText}`);
                        continue;
                    }
                    break; // Success
                } catch (e) {
                    errors.push(`${model}: ${e.message}`);
                    if (e.name === 'AbortError') throw e;
                }
            }

            clearTimeout(timeoutId);

            // 4. Handle No Success
            if (!resp || !resp.ok) {
                throw new Error("Svi modeli neuspešni: " + errors.join(", "));
            }

            const d = await resp.json();
            if (d.error) throw new Error(d.error.message);

            if (!d.candidates || !d.candidates[0] || !d.candidates[0].content) {
                throw new Error("Invalid response format from AI");
            }

            let jsonString = d.candidates[0].content.parts[0].text;
            jsonString = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
            
            let lessonData = JSON.parse(jsonString);
            if (!Array.isArray(lessonData)) {
                lessonData = [lessonData]; // Fallback in case AI returns a single object
            }
            
            CURRICULUM.AI = { lessons: lessonData };
            app.startLevel('AI');
            btn.innerText = originalText;

        } catch (e) {
            console.error("AI Lesson Error:", e);
            btn.innerText = originalText;
            
            // Extract the real error message
            let msg = e.message;
            if (e.name === 'SyntaxError') msg = "Invalid JSON from AI: " + e.message;
            if (e.message === 'Hard Timeout' || e.name === 'AbortError') msg = "Network timeout.";
            
            // Show exact error in a toast
            app.showToast("Greška: " + msg, "error");
            
            // Only pop the modal if it's explicitly a 400 or 403 API Key error
            if (msg.includes("400") || msg.includes("403") || msg.includes("API_KEY_INVALID")) {
                app.openApiKeyModal("Nevažeći API ključ (400/403). Proveri ključ.");
            }
        }
    },
    saveStats: () => { 
        if (state.user && state.user.isGuest) return;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak; 
        localStorage.setItem('serbolingo_stats', JSON.stringify(state)); 
    },
    showToast: (msg, type = 'info') => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        let bgColor = 'bg-blue-500';
        let icon = 'ℹ️';
        if (type === 'success') { bgColor = 'bg-green-500'; icon = '✅'; }
        if (type === 'error') { bgColor = 'bg-red-500'; icon = '🔒'; }
        
        toast.className = `${bgColor} text-white px-4 py-3 rounded-xl shadow-lg font-bold text-[11px] flex items-center gap-2 transform transition-all duration-300 translate-y-full opacity-0 pointer-events-auto max-w-full mx-4`;
        toast.innerHTML = `<span class="text-lg">${icon}</span> <span class="flex-1">${msg}</span>`;
        
        container.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-full', 'opacity-0');
        });
        
        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },
    // ─── OMNI-BAR SEARCH ENGINE ───
    handleSearch: (query) => {
        const clearBtn = document.getElementById('omni-clear');
        clearBtn.classList.toggle('hidden', !query);

        clearTimeout(_searchDebounceTimer);
        if (!query || query.trim().length < 1) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }
        // 300ms debounce — UI Freeze Prevention (Section 1)
        _searchDebounceTimer = setTimeout(() => {
            const q = query.trim().toLowerCase();
            const results = DICTIONARY.filter(entry =>
                entry.en.toLowerCase().includes(q) ||
                entry.sr_lat.toLowerCase().includes(q) ||
                entry.sr_cyr.toLowerCase().includes(q)
            ).slice(0, 10); // Safety limit
            app.renderSearchResults(results, query.trim());
        }, 300);
    },
    renderSearchResults: (results, query) => {
        const container = document.getElementById('search-results');
        if (!results.length) {
            container.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-5 text-center shadow-lg">
                    <span class="text-3xl block mb-2">🤷</span>
                    <p class="font-bold text-slate-500 dark:text-slate-400 text-xs">${t('omni_no_results')} "${query}"</p>
                </div>`;
            return;
        }
        container.innerHTML = results.map(entry => {
            const genderBadge = entry.gender !== '-' ? `<span class="text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                entry.gender === 'm' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' :
                entry.gender === 'ž' ? 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400' :
                'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400'
            }">${entry.gender === 'm' ? t('gender_m') || 'muški' : entry.gender === 'ž' ? t('gender_f') || 'ženski' : t('gender_n') || 'srednji'}</span>` : '';

            const isEnToSr = state.settings.learningDirection === 'en_to_sr';
            const showCyrillic = state.settings.appLanguage === 'sr_cyr';
            const primarySr = showCyrillic ? entry.sr_cyr : entry.sr_lat;
            const secondarySr = showCyrillic ? entry.sr_lat : entry.sr_cyr;
            
            const mainText = isEnToSr ? primarySr : entry.en;
            const subText1 = isEnToSr ? entry.en : primarySr;
            const subText2 = secondarySr;

            return `
            <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-4 shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer active:scale-[0.98]" onclick="app.playSound('correct')">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${entry.emoji}</span>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <p class="font-black text-slate-800 dark:text-white text-sm">${mainText}</p>
                            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">${entry.pos}</span>
                            ${genderBadge}
                        </div>
                        <p class="text-blue-500 font-bold text-xs">${subText1}</p>
                        <p class="text-slate-400 dark:text-slate-500 font-bold text-[10px]">${subText2}</p>
                    </div>
                    <span class="text-slate-300 dark:text-slate-600 text-lg">›</span>
                </div>
            </div>`;
        }).join('');
    },
    clearSearch: () => {
        document.getElementById('omni-search').value = '';
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('omni-clear').classList.add('hidden');
    },
    logout: () => { localStorage.clear(); sessionStorage.clear(); location.reload(); },
    endLesson: () => { if (confirm(t('lesson_quit'))) app.navigate('home'); },
    // ─── LOCALIZATION ENGINE ───
    applyLanguage: () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const target = el.getAttribute('data-i18n-attr');
            if (target === 'placeholder') {
                el.placeholder = t(key);
            } else {
                el.innerText = t(key);
            }
        });
    },
    setAppLanguage: (lang) => {
        state.settings.appLanguage = lang;
        app.applyLanguage();
        app.saveStats();
        // Update the language selector active states
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30');
            if (btn.dataset.lang === lang) {
                btn.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30');
            }
        });
    },
    setLearningDirection: (dir) => {
        state.settings.learningDirection = dir;
        // Auto-set app language based on direction
        // en_to_sr = user speaks English, learning Serbian → app UI in English
        // sr_to_en = user speaks Serbian, learning English → app UI in Serbian (Latinica)
        state.settings.appLanguage = (dir === 'en_to_sr') ? 'en' : 'sr_lat';
        app.saveStats();
        // Update active state on direction buttons
        document.querySelectorAll('.dir-btn').forEach(btn => {
            btn.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30');
            if (btn.dataset.dir === dir) {
                btn.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30');
            }
        });
        app.applyLanguage();
        app.updateProfileUI();
        app.updateStatsUI();
    },
    playSound: (type) => {
        if (!app.audioCtx) app.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const vol = state.settings.volume.sfx;
        if (vol <= 0) return;
        if (app.audioCtx.state === 'suspended') app.audioCtx.resume();
        const ctx = app.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'correct') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1 * vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } else if (type === 'incorrect') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.1 * vol, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01 * vol, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
        }
    },
    openApiKeyModal: (msg) => {
        document.getElementById('api-key-modal').classList.remove('hidden');
        document.getElementById('api-key-input').focus();
        const err = document.getElementById('api-modal-error');
        if (msg) {
            err.innerText = msg;
            err.classList.remove('hidden');
        } else {
            err.classList.add('hidden');
        }
    },
    closeApiKeyModal: () => {
        document.getElementById('api-key-modal').classList.add('hidden');
    },
    saveApiKeyFromModal: () => {
        const input = document.getElementById('api-key-input');
        const val = input.value.trim();
        if (!val) {
            const err = document.getElementById('api-modal-error');
            err.innerText = "Molimo unesite ključ.";
            err.classList.remove('hidden');
            return;
        }
        apiKey = val;
        localStorage.setItem('serbolingo_api_key', apiKey);
        app.closeApiKeyModal();
        alert("Ključ sačuvan! Pokušajte ponovo funkciju.");
    },

    showExplanation: () => {
        document.getElementById('explanation-buttons').classList.add('hidden');
        document.getElementById('explanation-content').classList.remove('hidden');
        document.getElementById('explanation-text').classList.remove('hidden');
        const l = CURRICULUM[state.currentLevelKey].lessons[state.currentLessonIndex];
        const expText = document.getElementById('explanation-text');
        
        let text = null;
        if (l.guide) {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const guideObj = (isSrToEn && l.guide_rev) ? l.guide_rev : l.guide;
            if (guideObj[state.userSelection]) {
                text = guideObj[state.userSelection];
                // Dynamic fix for legacy strings: ensure Serbian users see 'znači' and English users see 'means'
                if (isSrToEn) text = text.replace(/ means /g, ' znači ');
                else text = text.replace(/ znači /g, ' means ');
            }
        } else if (l.explanation) {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            text = (isSrToEn && l.explanation_rev) ? l.explanation_rev : l.explanation;
            if (isSrToEn) text = text.replace(/ means /g, ' znači ');
            else text = text.replace(/ znači /g, ' means ');
        }
        
        const finalText = text || (state.settings.appLanguage === 'en' ? "No explanation available." : "Nema dodatnog objašnjenja.");
        const headerText = state.settings.appLanguage === 'en' ? "💡 Offline Explanation (Prepared)" : "💡 Offline Objašnjenje (Pripremljeno)";
        
        expText.innerHTML = `<span class="block mb-2 text-[10px] font-black text-purple-500 uppercase tracking-widest border-b border-purple-100 pb-1">${headerText}</span>${finalText}`;
    },
    showAIExplanation: async () => {
        const expText = document.getElementById('explanation-text');
        document.getElementById('explanation-buttons').classList.add('hidden');
        document.getElementById('explanation-content').classList.remove('hidden');
        expText.classList.remove('hidden');
        expText.innerHTML = '<span class="animate-pulse">🤖 Generisanje objašnjenja...</span>';

        // 1. Check API Key
        if (!apiKey) {
            expText.innerHTML = `
                <div class="p-2">
                    <p class="text-xs text-slate-500 mb-2">Za AI objašnjenje potreban je Google Gemini API ključ.</p>
                    <button onclick="app.openApiKeyModal()" class="text-xs bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition-colors">
                        🔑 Unesi Ključ
                    </button>
                    <button onclick="app.resetExplanationUI()" class="ml-2 text-xs text-blue-500 underline">Nazad</button>
                </div>
            `;
            return;
        }

        // 2. Prepare API Call
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s

        try {
            const l = CURRICULUM[state.currentLevelKey].lessons[state.currentLessonIndex];
            const isEnToSr = state.settings.learningDirection === 'en_to_sr';
            const lang = isEnToSr ? "English" : "Serbian";
            
            // Reconstruct the exact question text the user saw
            const questionText = (state.settings.learningDirection === 'sr_to_en' && l.q_rev) ? l.q_rev : l.q;
            const correctText = (state.settings.learningDirection === 'sr_to_en' && l.correct_rev) ? l.correct_rev : l.correct;
            
            const promptText = `Explain in ${lang} why '${state.userSelection}' is incorrect for the question '${questionText}' (correct answer is '${correctText}'). Keep it short, encouraging, and helpful for a language learner. CRITICAL: The language is SERBIAN (srpski). NEVER use the word 'Croatian' or 'hrvatski'. Always say 'Serbian' or 'srpski'.`;

            // Updated models list for 2026 compatibility
            const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
            let resp;
            let errors = [];

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Hard Timeout')), 12000)
            );

            // 3. Loop through models
            for (const model of models) {
                try {
                    const fetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] }),
                        signal: controller.signal
                    });

                    resp = await Promise.race([fetchPromise, timeoutPromise]);

                    if (!resp.ok) {
                        errors.push(`${model}: ${resp.status}`);
                        continue;
                    }
                    break;
                } catch (e) {
                    errors.push(`${model}: ${e.message}`);
                    if (e.message === 'Hard Timeout' || e.name === 'AbortError') throw e;
                }
            }

            clearTimeout(timeoutId);

            // 4. Handle Failure
            if (!resp || !resp.ok) {
                throw new Error("Svi modeli neuspešni: " + errors.join(", "));
            }

            const d = await resp.json();
            if (d.error) throw new Error(d.error.message || "API Error");
            if (!d.candidates || !d.candidates[0] || !d.candidates[0].content) throw new Error("Prazan odgovor od servera.");

            // 5. Success Display
            expText.innerText = d.candidates[0].content.parts[0].text;

        } catch (e) {
            console.error("AI Error:", e);
            let msg = e.message;
            if (e.message === 'Hard Timeout' || e.name === 'AbortError') msg = "Isteklo vreme.";

            expText.innerHTML = `
                <div class="text-red-500 font-bold text-xs mb-2">Greška: ${msg}</div>
                <div class="flex gap-2">
                    <button class="text-blue-500 underline text-xs" onclick="app.showAIExplanation()">Probaj ponovo</button>
                    <button class="text-blue-500 underline text-xs" onclick="app.openApiKeyModal('Proveri svoj API key.')">Proveri API key</button>
                    <button class="text-slate-400 underline text-xs" onclick="app.resetExplanationUI()">Zatvori</button>
                </div>
            `;
        }
    },
    clearKey: () => {
        localStorage.removeItem('serbolingo_api_key');
        apiKey = "";
        app.resetExplanationUI();
        alert("API Ključ obrisan. Pokušajte ponovo.");
    },
    resetExplanationUI: () => {
        document.getElementById('explanation-content').classList.add('hidden');
        document.getElementById('explanation-buttons').classList.remove('hidden');
    }
};
window.onload = app.init;
