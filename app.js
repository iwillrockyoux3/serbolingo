const state = {
    user: null, xp: 0, dailyXP: 0, dailyGoal: 50, streak: 0, maxStreak: 0, hearts: 5, totalLessons: 0,
    correctAnswers: 0, totalAnswers: 0, chartPeriod: 'week', currentLevelKey: null, currentLessonIndex: 0,
    goalCelebrated: false,
    history: {}, // Format: "YYYY-MM-DD": { xp: 0, lessons: 0 }
    skills: { 'Slušanje': 50, 'Govor': 50, 'Čitanje': 50, 'Pisanje': 50, 'Gramatika': 50, 'Vokabular': 50 },
    settings: { darkMode: true, volume: { sfx: 1.0, tts: 1.0 }, textScale: 100, appLanguage: 'sr_lat', learningDirection: 'sr_to_en', hapticsEnabled: true, hardcoreImmersion: false },
    achievements: {},
    lastActiveDate: null,
    mistakeLog: {}, // New for Phase 4: Track missed words for SRS
    quests: [], // New for Phase 4: Daily quests array
    inventory: { xpBoosts: 0 }, // Arcade rewards
    gems: 50, // Priority 32: In-app currency
    unlockedAvatars: [],
    unlockedTitles: [],
    equippedTitle: null,
    earlyBirdClaimAvailable: false,
    earlyBirdEarnedDate: null
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
    nav_arcade: { en: 'Arcade', sr_lat: 'Igraonica', sr_cyr: 'Играоница' },
    nav_roleplay: { en: 'Chat', sr_lat: 'Razgovor', sr_cyr: 'Разговор' },
    nav_stats: { en: 'Stats', sr_lat: 'Statistika', sr_cyr: '\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430' },
    nav_profile: { en: 'Profile', sr_lat: 'Profil', sr_cyr: '\u041f\u0440\u043e\u0444\u0438\u043b' },
    nav_mistakes: { en: 'Mistakes', sr_lat: 'Gre\u0161ke', sr_cyr: '\u0413\u0440\u0435\u0448\u043a\u0435' },
    nav_explore: { en: 'Explore', sr_lat: 'Istraži', sr_cyr: 'Истражи' },
    
    // Explore View
    explore_title: { en: 'Explore', sr_lat: 'Istraži', sr_cyr: 'Истражи' },
    explore_desc: { en: 'Media & Culture Hub', sr_lat: 'Mediji & Kultura', sr_cyr: 'Медији & Култура' },
    explore_search_placeholder: { en: 'Search (e.g. \'Ordering food\')', sr_lat: 'Pretraži (npr. \'Naručivanje hrane\')', sr_cyr: 'Претражи (нпр. \'Наручивање хране\')' },
    explore_tab_video: { en: '📺 Video', sr_lat: '📺 Video', sr_cyr: '📺 Видео' },
    explore_tab_pictures: { en: '🖼️ Pictures', sr_lat: '🖼️ Slike', sr_cyr: '🖼️ Слике' },
    explore_tab_articles: { en: '📄 Text', sr_lat: '📄 Tekst', sr_cyr: '📄 Текст' },
    explore_tab_extra: { en: '🍿 Extra', sr_lat: '🍿 Extra', sr_cyr: '🍿 Екстра' },
    explore_btn_yt: { en: '🌐 YouTube', sr_lat: '🌐 YouTube', sr_cyr: '🌐 YouTube' },
    explore_btn_ai: { en: '✨ AI Generate', sr_lat: '✨ AI Generiši', sr_cyr: '✨ АИ Генериши' },
    explore_suggested: { en: '✨ Suggested for you this week', sr_lat: '✨ Predloženo za tebe ove nedelje', sr_cyr: '✨ Предложено за тебе ове недеље' },
    explore_results_for: { en: 'Results for', sr_lat: 'Rezultati za', sr_cyr: 'Резултати за' },
    explore_no_local_results: { en: 'No local results for', sr_lat: 'Nema lokalnih rezultata za', sr_cyr: 'Нема локалних резултата за' },
    explore_try_youtube_or_ai: { en: 'Try searching YouTube or generating an AI lesson!', sr_lat: 'Probajte sa YouTube pretragom ili AI generisanjem!', sr_cyr: 'Пробајте са YouTube претрагом или АИ генерисањем!' },
    explore_search_youtube_btn: { en: '🌐 Search YouTube', sr_lat: '🌐 Pretraži YouTube', sr_cyr: '🌐 Претражи YouTube' },
    explore_generate_ai_btn: { en: '✨ Generate AI Lesson', sr_lat: '✨ AI Generiši Lekciju', sr_cyr: '✨ АИ Генериши Лекцију' },
    explore_youtube_results_for: { en: '🌐 YouTube results for', sr_lat: '🌐 YouTube rezultati za', sr_cyr: '🌐 YouTube резултати за' },
    explore_ai_generating: { en: 'AI is generating a lesson...', sr_lat: 'AI generiše lekciju...', sr_cyr: 'АИ генерише лекцију...' },
    explore_ai_creating_about: { en: 'Creating a lesson about', sr_lat: 'Kreiranje lekcije o', sr_cyr: 'Креирање лекције о' },
    explore_back_to_list: { en: '← Back to list', sr_lat: '← Nazad na listu', sr_cyr: '← Назад на листу' },
    explore_ai_generated_lesson: { en: '✨ AI GENERATED LESSON', sr_lat: '✨ AI GENERISANA LEKCIJA', sr_cyr: '✨ АИ ГЕНЕРИСАНА ЛЕКЦИЈА' },
    explore_youtube_quota: { en: 'YouTube API quota exceeded', sr_lat: 'YouTube API kvota istekla', sr_cyr: 'YouTube API квота истекла' },
    explore_youtube_quota_desc: { en: 'Daily limit reached. Try again tomorrow or use AI generation.', sr_lat: 'Dnevni limit pretrage je dostignut. Pokušajte ponovo sutra ili koristite AI generisanje.', sr_cyr: 'Дневни лимит претраге је достигнут. Покушајте поново сутра или користите АИ генерисање.' },
    explore_search_error: { en: 'Search Error', sr_lat: 'Greška prilikom pretrage', sr_cyr: 'Грешка приликом претраге' },
    explore_check_api_key: { en: 'Check API key', sr_lat: 'Proverite API ključ', sr_cyr: 'Проверите API кључ' },
    explore_not_educational: { en: 'Content is not educational', sr_lat: 'Sadržaj nije edukativnog karaktera', sr_cyr: 'Садржај није едукативног карактера' },
    explore_not_educational_desc: { en: 'Search for educational topics only (language, grammar, culture...).', sr_lat: 'Pretražujte samo edukativne teme (jezik, gramatika, kultura...).', sr_cyr: 'Претражујте само едукативне теме (језик, граматика, култура...).' },
    explore_ai_not_educational_desc: { en: 'AI can only generate educational lessons.', sr_lat: 'AI može da generiše samo edukativne lekcije.', sr_cyr: 'АИ може да генерише само едукативне лекције.' },
    explore_no_yt_results_for: { en: 'No YouTube results for', sr_lat: 'Nema YouTube rezultata za', sr_cyr: 'Нема YouTube резултата за' },
    explore_generate_ai_instead: { en: '✨ Generate AI Lesson instead', sr_lat: '✨ AI Generiši Lekciju umesto toga', sr_cyr: '✨ АИ Генериши Лекцију уместо тога' },
    explore_generation_error: { en: 'Generation Error', sr_lat: 'Greška prilikom generisanja', sr_cyr: 'Грешка приликом генерисања' },
    explore_yt_key_title: { en: 'YouTube API Key', sr_lat: 'YouTube API Ključ', sr_cyr: 'YouTube API Кључ' },
    explore_yt_key_desc: { en: 'Enter a free YouTube Data API key to search millions of educational videos directly in the app.', sr_lat: 'Unesite besplatan YouTube Data API ključ da bi pretraživali milione edukativnih videa direktno u aplikaciji.', sr_cyr: 'Унесите бесплатан YouTube Data API кључ да би претраживали милионе едукативних видеа директно у апликацији.' },
    explore_yt_key_link: { en: '👉 Click here to get a free API key', sr_lat: '👉 Kliknite ovde da dobijete besplatan API ključ', sr_cyr: '👉 Кликните овде да добијете бесплатан API кључ' },
    explore_yt_key_save: { en: 'Save', sr_lat: 'Sačuvaj', sr_cyr: 'Сачувај' },
    explore_yt_key_cancel: { en: 'Cancel', sr_lat: 'Otkaži', sr_cyr: 'Откажи' },
    explore_yt_key_saved: { en: 'YouTube API key saved!', sr_lat: 'YouTube API ključ sačuvan!', sr_cyr: 'YouTube API кључ сачуван!' },
    explore_gemini_key_prompt: { en: 'Enter your Gemini API key for AI lesson generation.', sr_lat: 'Unesite Gemini API ključ za AI generisanje lekcija.', sr_cyr: 'Унесите Gemini API кључ за АИ генерисање лекција.' },
    // Mistake Vault View
    mistakes_title: { en: 'My Mistakes', sr_lat: 'Moje Gre\u0161ke', sr_cyr: '\u041c\u043e\u0458\u0435 \u0413\u0440\u0435\u0448\u043a\u0435' },
    mistakes_desc: { en: 'Mistake Vault', sr_lat: 'Trezor Gre\u0161aka', sr_cyr: '\u0422\u0440\u0435\u0437\u043e\u0440 \u0413\u0440\u0435\u0448\u0430\u043a\u0430' },
    mistakes_empty: { en: 'No mistakes!', sr_lat: 'Nema gre\u0161aka!', sr_cyr: '\u041d\u0435\u043c\u0430 \u0433\u0440\u0435\u0448\u0430\u043a\u0430!' },
    mistakes_empty_desc: { en: 'You have no words to review. Great job!', sr_lat: 'Trenutno nemate re\u010di za ponavljanje. Odli\u010dan posao!', sr_cyr: '\u0422\u0440\u0435\u043d\u0443\u0442\u043d\u043e \u043d\u0435\u043c\u0430\u0442\u0435 \u0440\u0435\u0447\u0438 \u0437\u0430 \u043f\u043e\u043d\u0430\u0432\u0459\u0430\u045a\u0435. \u041e\u0434\u043b\u0438\u0447\u0430\u043d \u043f\u043e\u0441\u0430\u043e!' },

    // Home View
    home_curriculum: { en: 'Curriculum', sr_lat: 'Kurikulum', sr_cyr: 'Курикулум' },
    home_curriculum_desc: { en: 'Choose a level or create an AI lesson.', sr_lat: 'Izaberite nivo ili kreirajte AI lekciju.', sr_cyr: 'Изаберите ниво или креирајте АИ лекцију.' },
    home_beginner_label: { en: '1. Beginner Level', sr_lat: '1. Početni nivo', sr_cyr: '1. Почетни ниво' },
    home_beginner_title: { en: 'Start Here!', sr_lat: 'Počni ovde!', sr_cyr: 'Почни овде!' },
    home_beginner_desc: { en: 'Learn greetings, basic nouns and simple present tense.', sr_lat: 'Nauči pozdrave, osnovne imenice i prosto sadašnje vreme.', sr_cyr: 'Научи поздраве, основне именице и просто садашње vreme.' },
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
    profile_text_size: { en: 'Text Size', sr_lat: 'Veličina teksta', sr_cyr: 'Величина текста' },
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
    // Immersion Mode (Priority 34)
    profile_immersion_title: { en: 'Hardcore Immersion', sr_lat: 'Hardcore Imerzija', sr_cyr: 'Хардкор Имерзија' },
    profile_immersion_desc: { en: 'Removes English from entire UI. 100% Serbian only.', sr_lat: 'Uklanja engleski iz interfejsa. Sve prelazi na čist srpski.', sr_cyr: 'Уклања енглески из интерфејса. Све прелази на чист српски.' },
    profile_immersion_btn: { en: '🎬 Native Speaker Clips', sr_lat: '🎬 Izvorni Govor & Klipovi', sr_cyr: '🎬 Изворни Говор & Клипови' },
};

// Translation helper — returns string for current app language
const t = (key) => {
    let lang = state.settings.appLanguage || 'sr_lat';
    if (state.settings && state.settings.hardcoreImmersion) {
        lang = lang === 'sr_cyr' ? 'sr_cyr' : 'sr_lat';
    }
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

// Legacy CURRICULUM removed — now powered by SkillTreeEngine + QuestionEngine
const CURRICULUM = { BEGINNER: { skill: 'Vokabular', lessons: [] }, PRACTICE: { skill: 'Vežba', lessons: [] } };

// [SHIELD_DAEMON: VALIDATED] — Dynamic lesson data powered by IndexedDB + QuestionEngine
let ACTIVE_LESSON = [];
let _searchDebounceTimer = null;

// Omni-Bar Dictionary fallback for search (will query IndexedDB when available)
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

// Phase 4: Quests logic
const QUEST_TYPES = [
    { id: 'perfect_scholar', text: 'Complete 2 Perfect Lessons', target: 2, icon: '🌟' },
    { id: 'speaker', text: 'Get 3 Speaking questions right', target: 3, icon: '🎙️' },
    { id: 'grinder', text: 'Earn 50 XP today', target: 50, icon: '⚡' },
    { id: 'reviewer', text: 'Complete 1 Practice mode lesson', target: 1, icon: '🔄' },
];

const generateDailyQuests = () => {
    return QUEST_TYPES.map(q => ({
        ...q,
        progress: 0,
        completed: false
    }));
};

const app = {
    init: async () => {
        // Initialize IndexedDB - wrapped in try-catch so app works even if DB fails
        try {
            if (window.appDb) await window.appDb.init();
        } catch (e) {
            console.warn("IndexedDB init failed (app will use fallback):", e);
        }
        let sAuth = sessionStorage.getItem('serbolingo_auth');
        if (!sAuth) sAuth = localStorage.getItem('serbolingo_auth');

        if (sAuth) {
            state.user = JSON.parse(sAuth);
            // Default join date if missing
            if (!state.user.joinedDate) state.user.joinedDate = new Date().toISOString().split('T')[0];
        }

        const username = state.user ? state.user.name : 'guest';
        let sStats = localStorage.getItem('serbolingo_stats_' + username);
        
        // Migration from global stats to namespaced stats
        if (!sStats && localStorage.getItem('serbolingo_stats')) {
            sStats = localStorage.getItem('serbolingo_stats');
            localStorage.setItem('serbolingo_stats_' + username, sStats);
            localStorage.removeItem('serbolingo_stats');
        }

        // Restore API Key if present
        const savedKey = localStorage.getItem('serbolingo_api_key');
        if (savedKey) {
            apiKey = savedKey;
            console.log("API Key restored from storage.");
        }

        if (sStats) {
            const parsed = JSON.parse(sStats);
            const currentUser = state.user; // preserve auth user
            Object.assign(state, parsed);
            if (currentUser) state.user = currentUser; // restore auth user

            // Migrate legacy state or ensure settings exist
            if (!state.settings) state.settings = { darkMode: true, volume: { sfx: 1.0, tts: 1.0 } };
            if (!state.settings.volume) state.settings.volume = { sfx: 1.0, tts: 1.0 };
            if (state.settings.volume.tts === undefined) state.settings.volume.tts = 1.0;
            if (state.settings.volume.sfx === undefined) state.settings.volume.sfx = 1.0;
            if (!state.settings.appLanguage) state.settings.appLanguage = 'sr_lat';
            if (!state.settings.learningDirection) state.settings.learningDirection = 'sr_to_en';
            if (state.settings.hardcoreImmersion === undefined) state.settings.hardcoreImmersion = false;
            if (!state.achievements) state.achievements = {};
            // Fix missing history
            if (!state.history) state.history = {};
            // Phase 4 Defaults
            if (!state.mistakeLog) state.mistakeLog = {};
            if (!state.badges) state.badges = [];
            if (!state.quests || state.quests.length === 0) state.quests = generateDailyQuests();
            // Phase 6 Arcade Defaults
            if (!state.inventory) state.inventory = { xpBoosts: 0 };
            // Priority 32 Defaults
            if (typeof state.gems !== 'number') state.gems = 50;
            if (!state.unlockedAvatars) state.unlockedAvatars = [];
            if (!state.unlockedTitles) state.unlockedTitles = [];
            if (state.equippedTitle === undefined) state.equippedTitle = null;
        } else {
            // Apply defaults if no stats exist
            if (!state.settings) state.settings = { darkMode: true, volume: { sfx: 1.0, tts: 1.0 }, appLanguage: 'sr_lat', learningDirection: 'sr_to_en' };
            state.quests = generateDailyQuests();
            state.mistakeLog = {};
            state.badges = [];
            state.inventory = { xpBoosts: 0 };
            state.gems = 50;
            state.unlockedAvatars = [];
            state.unlockedTitles = [];
            state.equippedTitle = null;
        }

        // DAILY RESET LOGIC
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate !== today) {
            if (state.lastActiveDate) {
                const lastDate = new Date(state.lastActiveDate);
                const currentDate = new Date(today);
                const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
                if (diffDays > 1) {
                    if (diffDays === 2 && window.ShopEngine && window.ShopEngine.hasStreakFreeze()) {
                        window.ShopEngine.useStreakFreeze();
                        setTimeout(() => {
                            if (window.app && window.app.showToast) {
                                window.app.showToast('🛡️ Štit za Niz je sačuvao tvoj niz!', 'success');
                            }
                        }, 1200);
                    } else {
                        state.streak = 0; // Lost streak
                    }
                }
            }
            state.dailyXP = 0;
            state.goalCelebrated = false;
            state.questChestClaimed = false;
            state.hearts = 5; // Refill hearts daily
            state.quests = (window.ShopEngine && window.ShopEngine.generateDailyQuests)
                ? window.ShopEngine.generateDailyQuests()
                : generateDailyQuests(); // Reset quests daily
            
            if (state.user) {
                localStorage.setItem('serbolingo_stats_' + (state.user ? state.user.name : 'guest'), JSON.stringify(state));
            }
        }

        app.applyDarkMode();
        app.applyTextScale();
        // Learning Direction now controls both lesson direction AND app UI language
        app.setLearningDirection(state.settings.learningDirection || 'sr_to_en');
        app.updateProfileUI(); // Update UI with latest values
        if (window.LeagueEngine) {
            window.LeagueEngine.updateGemsHeaderUI();
            window.LeagueEngine.updateHeaderBoostUI();
            window.LeagueEngine.renderHomeBanner();
        }

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
    applyTextScale: () => {
        const scale = state.settings.textScale || 100;
        document.documentElement.style.fontSize = scale + '%';
    },
    setTextScale: (val) => {
        state.settings.textScale = parseInt(val);
        document.getElementById('text-scale-val').innerText = val + '%';
        app.applyTextScale();
        app.saveStats();
    },
    setVolume: (type, val) => {
        state.settings.volume[type] = parseFloat(val);
        document.getElementById(`vol-${type}-val`).innerText = Math.round(state.settings.volume[type] * 100) + '%';
        app.saveStats();
    },
    setTtsApiKey: (val) => {
        state.settings.ttsApiKey = val.trim();
        app.saveStats();
        app.updateTtsInputUI();
        if (val.trim()) {
            app.showToast('Premium AI Voice Key Saved!', 'success');
        }
    },
    setTtsProvider: (val) => {
        state.settings.ttsProvider = val;
        app.saveStats();
        
        const linkGcp = document.getElementById('link-gcp');
        const linkOai = document.getElementById('link-oai');
        const linkGem = document.getElementById('link-gem');
        if (linkGcp && linkOai && linkGem) {
            linkGcp.classList.add('hidden');
            linkOai.classList.add('hidden');
            linkGem.classList.add('hidden');
            if (val === 'google') linkGcp.classList.remove('hidden');
            else if (val === 'openai') linkOai.classList.remove('hidden');
            else if (val === 'gemini') linkGem.classList.remove('hidden');
        }
        app.updateTtsInputUI();
    },
    updateTtsInputUI: () => {
        const ttsInput = document.getElementById('tts-api-key');
        if (!ttsInput) return;
        
        const provider = state.settings.ttsProvider || 'none';
        const hasTtsKey = !!state.settings.ttsApiKey;
        const hasGlobalKey = !!(window.apiKey || localStorage.getItem('serbolingo_api_key'));
        
        if (hasTtsKey) {
            ttsInput.value = '';
            ttsInput.placeholder = "✅ Key is good, go ahead!";
            ttsInput.classList.add('border-green-400', 'dark:border-green-500', 'bg-green-50', 'dark:bg-green-900/30', 'placeholder-green-700', 'dark:placeholder-green-400');
            ttsInput.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-900');
        } else if (provider === 'gemini' && hasGlobalKey) {
            ttsInput.value = '';
            ttsInput.placeholder = "✅ Using your saved Gemini key!";
            ttsInput.classList.add('border-green-400', 'dark:border-green-500', 'bg-green-50', 'dark:bg-green-900/30', 'placeholder-green-700', 'dark:placeholder-green-400');
            ttsInput.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-900');
        } else {
            ttsInput.value = '';
            ttsInput.placeholder = "Paste API key here...";
            ttsInput.classList.remove('border-green-400', 'dark:border-green-500', 'bg-green-50', 'dark:bg-green-900/30', 'placeholder-green-700', 'dark:placeholder-green-400');
            ttsInput.classList.add('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-900');
        }
    },
    updateProfileUI: () => {
        if (!state.user) return;
        
        // Fix for corrupted avatars saved during encoding issue
        if (state.user.avatar && state.user.avatar.length > 3) {
            state.user.avatar = '👤';
            app.saveStats();
        }

        // Header
        const isEnToSr = state.settings.learningDirection === 'en_to_sr';
        const displayName = state.user.name === "GUEST_USER" ? (isEnToSr ? "Guest" : "Gost") : state.user.name;
        document.getElementById('profile-name').innerText = displayName;
        document.getElementById('profile-avatar').innerText = state.user.avatar || '👤';
        document.getElementById('profile-joined').innerText = `Član od: ${state.user.joinedDate}`;

        // Migrate legacy key if present
        if (state.settings.googleTtsApiKey && !state.settings.ttsApiKey) {
            state.settings.ttsApiKey = state.settings.googleTtsApiKey;
            state.settings.ttsProvider = 'google';
            delete state.settings.googleTtsApiKey;
        }

        // Settings Controls
        document.getElementById('text-scale').value = state.settings.textScale || 100;
        document.getElementById('text-scale-val').innerText = (state.settings.textScale || 100) + '%';
        document.getElementById('vol-sfx').value = state.settings.volume.sfx;
        document.getElementById('vol-sfx-val').innerText = Math.round(state.settings.volume.sfx * 100) + '%';
        document.getElementById('vol-tts').value = state.settings.volume.tts;
        document.getElementById('vol-tts-val').innerText = Math.round(state.settings.volume.tts * 100) + '%';
        
        const ttsInput = document.getElementById('tts-api-key');
        
        const ttsSelect = document.getElementById('tts-provider');
        if (ttsSelect) {
            ttsSelect.value = state.settings.ttsProvider || 'none';
            app.setTtsProvider(ttsSelect.value); // Trigger link UI update
        }
        
        app.updateTtsInputUI();

        // Avatar Picker
        const avatars = ['👤', '👨‍🎓', '👩‍🎓', '🦄', '🦁', '🦉', '🐶', '🤖', '👻', '🐸', '🐨', '🐼'];
        const picker = document.getElementById('avatar-picker');
        picker.innerHTML = avatars.map(a =>
            `<button onclick="app.selectAvatar('${a}')" class="text-2xl p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${state.user.avatar === a ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' : ''}">${a}</button>`
        ).join('');

        app.renderBadges();
        app.renderAchievements();
        app.updateImmersionUI();
        if (window.LeagueEngine && window.LeagueEngine.updateProfileHeader) {
            window.LeagueEngine.updateProfileHeader();
        }
    },
    renderBadges: () => {
        const container = document.getElementById('badges-list');
        if (!container) return;
        
        if (!state.badges || state.badges.length === 0) {
            container.innerHTML = '<div class="col-span-4 text-center text-slate-400 text-xs py-4 italic">No badges yet. Master a skill to earn one!</div>';
            return;
        }

        container.innerHTML = state.badges.map(b => `
            <div class="bg-white dark:bg-slate-800 p-2 rounded-2xl border-2 border-yellow-400 shadow-sm flex flex-col items-center justify-center text-center">
                <div class="text-3xl drop-shadow-md mb-1">${b.icon}</div>
                <div class="text-[9px] font-black leading-tight text-slate-800 dark:text-slate-200 uppercase tracking-tighter">${b.name}</div>
            </div>
        `).join('');
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
    authMode: 'login',
    toggleAuthMode: () => {
        app.authMode = app.authMode === 'login' ? 'register' : 'login';
        const submitBtn = document.getElementById('auth-submit-btn');
        const toggleBtn = document.getElementById('auth-toggle-mode');
        const title = document.getElementById('auth-title');
        
        if (app.authMode === 'login') {
            title.innerText = "Login / Prijavite se";
            submitBtn.innerText = "Login / Prijavi se";
            toggleBtn.innerText = "Don't have an account? Create one / Nemate nalog? Napravite ga";
        } else {
            title.innerText = "Register / Registrujte se";
            submitBtn.innerText = "Create Account / Napravi nalog";
            toggleBtn.innerText = "Already have an account? Login / Već imate nalog? Prijavite se";
        }
    },
    handleAuth: () => {
        const u = document.getElementById('auth-username').value;
        const p = document.getElementById('auth-password').value;
        
        if (!u || !p) {
            if (window.app && window.app.showToast) {
                app.showToast("Please enter username and password / Unesite ime i lozinku", "error");
            } else {
                alert("Please enter username and password.");
            }
            return;
        }

        const usersDb = JSON.parse(localStorage.getItem('serbolingo_users_db') || '{}');

        if (app.authMode === 'register') {
            if (usersDb[u]) {
                app.showToast("Username already exists! / Korisničko ime već postoji!", "error");
                return;
            }
            usersDb[u] = { password: p };
            localStorage.setItem('serbolingo_users_db', JSON.stringify(usersDb));
        } else {
            if (!usersDb[u]) {
                app.showToast("Account not found. Please create an account first / Nalog ne postoji. Molimo napravite nalog prvo.", "error");
                return;
            }
            if (usersDb[u].password !== p) {
                app.showToast("Invalid password! / Pogrešna lozinka!", "error");
                return;
            }
        }

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

        // Reload to let app.init load the user's namespaced local storage
        location.reload();
    },

    handleGuest: () => {
        state.user = {
            name: "GUEST_USER",
            joinedDate: new Date().toISOString().split('T')[0],
            avatar: "👤",
            isGuest: true
        };
        sessionStorage.setItem('serbolingo_auth', JSON.stringify(state.user));
        location.reload();
    },
    saveState: () => {
        const u = state.user ? state.user.name : 'guest';
        localStorage.setItem('serbolingo_stats_' + u, JSON.stringify(state));
    },
    updateQuestProgress: (questId, amount) => {
        const quest = state.quests.find(q => q.id === questId);
        if (quest && !quest.completed) {
            quest.progress += amount;
            if (quest.progress >= quest.target) {
                quest.progress = quest.target;
                quest.completed = true;
                const reward = quest.reward || 15;
                state.xp += reward;
                state.dailyXP += reward;
                app.playSound('level_up');
                app.showToast(`Quest Completed! +${reward} XP 🌟`);
                app.updateProfileUI(); // Update XP
                if (window.ShopEngine && window.ShopEngine.checkAllQuestsComplete) {
                    window.ShopEngine.checkAllQuestsComplete();
                }
            }
            app.saveState();
            app.renderQuests(); 
        }
    },
    renderQuests: () => {
        if (window.ShopEngine && window.ShopEngine.renderQuests) {
            window.ShopEngine.renderQuests();
            return;
        }
        const container = document.getElementById('quests-container');
        if (!container) return;
        
        container.innerHTML = state.quests.map(q => `
            <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-2 ${q.completed ? 'border-yellow-400' : 'border-slate-100 dark:border-slate-700'} mb-2 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="text-2xl">${q.icon}</div>
                    <div>
                        <div class="font-bold text-slate-800 dark:text-white text-sm">${q.text}</div>
                        <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            ${q.completed ? 'COMPLETED' : `${q.progress} / ${q.target}`}
                        </div>
                    </div>
                </div>
                ${q.completed ? '<div class="text-yellow-500 font-bold">✓</div>' : `
                    <div class="w-16 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 transition-all" style="width: ${(q.progress / q.target) * 100}%"></div>
                    </div>
                `}
            </div>
        `).join('');
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
        ['view-home', 'view-lesson', 'view-stats', 'view-profile', 'view-arcade', 'view-mistakes', 'view-explore', 'view-karaoke', 'view-audio-commute'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
        document.getElementById(`view-${vid}`).classList.remove('hidden');

        const navBar = document.getElementById('main-nav');
        const appContainer = document.getElementById('app-container');
        if (vid === 'lesson' || vid === 'karaoke') {
            if (navBar) navBar.classList.add('hidden');
            if (appContainer) appContainer.style.paddingBottom = '0px';
        } else {
            if (navBar) navBar.classList.remove('hidden');
            if (appContainer) appContainer.style.paddingBottom = '';
        }

        if (vid === 'explore') {
            if (window.ExploreHub) ExploreHub.init();
        }

        if (vid === 'home') {
            app.renderSkillTree();
            app.renderQuests();
            if (window.PlacementEngine && window.PlacementEngine.renderHomeBanner) {
                window.PlacementEngine.renderHomeBanner();
            }
            if (window.LeagueEngine) {
                if (window.LeagueEngine.renderHomeBanner) window.LeagueEngine.renderHomeBanner();
                if (window.LeagueEngine.updateHeaderBoostUI) window.LeagueEngine.updateHeaderBoostUI();
            }
        }
        if (vid === 'stats') {
            app.resetDetailBox();
            app.renderChart();
            app.renderRadar();
            app.updateStatsUI();
            app.updateGoalUI();
            if (window.SrsEngine && window.SrsEngine.renderHeatmap) {
                window.SrsEngine.renderHeatmap();
            }
            if (window.LeagueEngine && window.LeagueEngine.renderStatsCard) {
                window.LeagueEngine.renderStatsCard();
            }
        }
        if (vid === 'profile') {
            app.updateProfileUI();
            if (window.LeagueEngine && window.LeagueEngine.updateProfileHeader) {
                window.LeagueEngine.updateProfileHeader();
            }
        }
        if (vid === 'arcade') {
            const boostEl = document.getElementById('xp-boost-count');
            if (boostEl && state.inventory) {
                boostEl.textContent = state.inventory.xpBoosts || 0;
            }
        }
        if (vid === 'mistakes') {
            app.renderMistakes();
        }

        document.querySelectorAll('.nav-btn').forEach(b => b.classList.replace('text-blue-500', 'text-slate-400'));
        const navBtn = document.getElementById(`nav-${vid}`);
        if (navBtn) navBtn.classList.replace('text-slate-400', 'text-blue-500');
    },
    startLevel: async (k) => {
        if (state.user && state.user.isGuest && k !== 'BEGINNER') {
            app.showToast(t('toast_guest_level'), 'error');
            return;
        }
        
        try {
            // Map generic levels to categories for now
            const categoryMap = { 'BEGINNER': 'basics', 'INTERMEDIATE': 'animals', 'ADVANCED': 'food' };
            const category = categoryMap[k] || 'basics';
            
            // Generate lesson from DB
            ACTIVE_LESSON = await window.QuestionEngine.generateLesson(category, window.appDb, 10);
            
            if (!ACTIVE_LESSON || ACTIVE_LESSON.length === 0) {
                alert("Nema dovoljno reči u bazi za ovu lekciju.");
                return;
            }

            state.currentLevelKey = k;
            state.currentLessonIndex = 0;
            state.lastLessonMistakes = 0;
            state.currentLessonXpEarned = 0;
            
            app.saveStats();
            app.navigate('lesson');
            app.renderQuestion();
        } catch (e) {
            console.error("Error starting level:", e);
            app.navigate('home');
        }
    },
    renderSkillTree: () => {
        const container = document.getElementById('skill-tree-container');
        if (!container) return;
        const skills = SkillTreeEngine.getSkillsWithStatus();
        const isSrToEn = state.settings.learningDirection === 'sr_to_en';

        const renderNode = (skill, isRowItem = false) => {
            if (!skill) return '';
            const colors = CROWN_COLORS[skill.crown] || CROWN_COLORS[0];
            const isLocked = skill.locked;
            const crownLabel = skill.crown > 0 ? '\u{1F451}'.repeat(Math.min(skill.crown, 5)) : '';
            const optionalBadge = skill.optional ? '<span class="text-[8px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-400 px-1 py-0.5 rounded-md uppercase">Opt</span>' : '';
            
            const displayName = isSrToEn ? skill.name : skill.nameEn;
            const widthClass = isRowItem ? 'flex-1 w-full min-w-0 relative' : 'w-full max-w-xs relative';
            
            const guideBtn = skill.guideHtml ? `<button onclick="app.showGuide('${skill.id}'); event.stopPropagation();" class="text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full px-2 py-1 absolute -top-2 -right-2 border-2 border-white dark:border-slate-900 z-10 shadow-sm transition-colors">\u{1F4A1} TIPS</button>` : '';
            
            if (isLocked) {
                return `<div class="${widthClass} opacity-50 cursor-not-allowed"><div class="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 h-full"><div class="w-12 h-12 flex-shrink-0 ${colors.bg} rounded-2xl flex items-center justify-center text-xl ${colors.shadow}">\u{1F512}</div><div class="flex-1 min-w-0"><div class="flex items-center gap-1"><p class="font-black text-slate-400 dark:text-slate-500 text-[13px] truncate">${displayName}</p></div><div class="mt-0.5">${optionalBadge}</div></div></div></div>`;
            }
            return `<div class="${widthClass} cursor-pointer group" onclick="app.startSkillLesson('${skill.id}')">${guideBtn}<div class="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm group-hover:border-blue-400 dark:group-hover:border-blue-500 active:scale-[0.97] transition-all h-full"><div class="w-12 h-12 flex-shrink-0 ${colors.bg} rounded-2xl flex items-center justify-center text-xl ${colors.text} ${colors.shadow} transition-colors">${skill.emoji}</div><div class="flex-1 min-w-0"><div class="flex items-center gap-1"><p class="font-black text-slate-800 dark:text-slate-100 text-[13px] truncate">${displayName}</p></div><div class="flex items-center gap-1 mt-0.5">${optionalBadge} <span class="text-[9px] tracking-tighter">${crownLabel}</span></div><div class="mt-1.5 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden w-full"><div class="h-full ${skill.crown >= 5 ? 'bg-yellow-400' : 'bg-green-400'} rounded-full transition-all" style="width: ${skill.crown >= 5 ? 100 : (skill.lessonsInCrown / SkillTreeEngine.getLessonsPerCrown()) * 100}%"></div></div></div></div></div>`;
        };

        const tiers = [
            { label: 'Foundation', labelEn: 'Foundation', ids: ['alphabet', 'numbers', 'colors', 'basics', 'phrases', 'verbs', 'pronouns', 'adjectives', 'gender'] },
            { label: 'Daily Life', labelEn: 'Daily Life', ids: ['food', 'cases_intro', 'family', 'household', 'time', 'days', 'months'] },
            { label: 'Survival & Self', labelEn: 'Survival & Self', ids: ['directions', 'prepositions', 'weather', 'body', 'health', 'emotions', 'conjunctions'] },
            { label: 'The World', labelEn: 'The World', ids: ['travel', 'adverbs', 'clothing', 'comparatives', 'animals', 'nature', 'sports', 'past_tense'] },
            { label: 'Modern Life', labelEn: 'Modern Life', ids: ['education', 'technology', 'business', 'advanced_adj', 'punctuation', 'future_tense'] },
            { label: 'Advanced', labelEn: 'Advanced', ids: ['dating', 'slang', 'particles', 'spelling'] }
        ];

        let html = '';

        tiers.forEach((tier, tierIndex) => {
            const tierSkills = tier.ids.map(id => skills.find(s => s.id === id)).filter(Boolean);
            if (tierSkills.length === 0) return;

            // Check if any skill in tier is unlocked for visual styling
            const anyUnlocked = tierSkills.some(s => !s.locked);
            const tierOpacity = anyUnlocked ? '' : 'opacity-60';

            // Tier connector (dotted line between tiers)
            if (tierIndex > 0) {
                html += `<div class="flex flex-col items-center my-1">
                    <div class="w-0.5 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                    <div class="w-0.5 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mt-1"></div>
                    <div class="w-0.5 h-3 bg-slate-300 dark:bg-slate-600 rounded-full mt-1"></div>
                </div>`;
            }

            // Tier header label
            const tierLabel = isSrToEn ? tier.label : tier.labelEn;
            html += `<div class="w-full max-w-xs ${tierOpacity}">
                <div class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center mb-2 mt-1">${tierLabel}</div>`;

            // Custom rendering for Foundation vs the rest
            if (tier.labelEn === 'Foundation') {
                // Render all as pairs
                for (let i = 0; i < tierSkills.length; i += 2) {
                    if (i > 0) {
                        html += `<div class="flex justify-center w-full"><div class="w-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full my-0.5"></div></div>`;
                    }
                    html += `<div class="flex justify-center gap-2 w-full mb-1">
                        ${renderNode(tierSkills[i], true)}`;
                    if (tierSkills[i+1]) {
                        html += renderNode(tierSkills[i+1], true);
                    } else {
                        html += `<div class="flex-1 w-full min-w-0"></div>`; // spacer
                    }
                    html += `</div>`;
                }
            } else {
                // Render all sequentially (single column)
                for (let i = 0; i < tierSkills.length; i++) {
                    if (i > 0) {
                        html += `<div class="flex flex-col items-center w-full"><div class="w-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full my-0.5"></div></div>`;
                    }
                    html += `<div class="flex flex-col items-center w-full">${renderNode(tierSkills[i], false)}</div>`;
                }
            }

            html += `</div>`; // Close tier wrapper
        });

        container.innerHTML = html;
    },
    startSkillLesson: async (skillId) => {
        if (skillId === 'alphabet') {
            app.showAlphabetModal();
            return;
        }
        const skill = SKILL_TREE.find(s => s.id === skillId);
        if (!skill) return;
        if (!SkillTreeEngine.isUnlocked(skillId)) {
            app.showToast('\u{1F512} ZavrÅ¡i prethodne lekcije prvo!', 'error');
            return;
        }
        const guestAllowed = ['basics', 'alphabet', 'numbers', 'colors', 'phrases'];
        if (state.user && state.user.isGuest && !guestAllowed.includes(skillId)) {
            app.showToast(t('toast_guest_level'), 'error');
            return;
        }
        try {
            ACTIVE_LESSON = await window.QuestionEngine.generateLesson(skill.category, window.appDb, 10);
            if (!ACTIVE_LESSON || ACTIVE_LESSON.length === 0) {
                app.showToast('Nema dovoljno reÄi u bazi za ovu lekciju.', 'error');
                return;
            }
            state.currentLevelKey = skillId;
            state.currentSkillId = skillId;
            state.currentLessonIndex = 0;
            state.lastLessonMistakes = 0;
            app.saveStats();
            app.navigate('lesson');
            
            // Tutorial popup for specialized lessons (first time only)
            const tutorialMessages = {
                'spelling': { title: '\u{1F50D} Spelling Training', body: 'In this lesson you will spell words letter-by-letter! Type them out or use the mic to spell out loud. If you make a mistake, tap "Hear Spelling" to hear the correct answer.' },
                'punctuation': { title: '\u{270D}\u{FE0F} Punctuation Training', body: 'Tap a punctuation mark from the bank below, then tap the empty slot in the sentence where it belongs. Fill all slots to check your answer!' },
                'comparatives': { title: '\u{2696}\u{FE0F} Grammar Training', body: 'In this lesson you will fill in blanks and speak full sentences to practice comparatives and superlatives. No multiple choice here!' }
            };
            const tut = tutorialMessages[skill.category];
            if (tut) {
                const tutKey = `tutorial_seen_${skill.category}`;
                if (!localStorage.getItem(tutKey)) {
                    localStorage.setItem(tutKey, 'true');
                    // Show a simple overlay
                    const overlay = document.createElement('div');
                    overlay.className = 'fixed inset-0 bg-black/60 z-[300] flex items-center justify-center p-6 fade-in';
                    overlay.innerHTML = `
                        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-2 border-white dark:border-slate-700">
                            <h2 class="text-xl font-black text-slate-800 dark:text-white mb-3">${tut.title}</h2>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">${tut.body}</p>
                            <button onclick="this.closest('.fixed').remove()" class="w-full py-3 bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_4px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 transition-all">Got it!</button>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                }
            }
            
            app.renderQuestion();
        } catch (e) {
            console.error('Error starting skill lesson:', e);
            app.navigate('home');
        }
    },
    startPractice: async () => {
        const unlockedSkills = SKILL_TREE.filter(s => SkillTreeEngine.isUnlocked(s.id) && SkillTreeEngine.getCrownLevel(s.id) >= 1);
        if (unlockedSkills.length === 0) {
            app.showToast('ZavrÅ¡i bar jednu lekciju prvo! / Complete at least one lesson first!', 'error');
            return;
        }
        
        try {
            const unlockedCategories = unlockedSkills.map(s => s.category);
            ACTIVE_LESSON = await window.QuestionEngine.generatePracticeLesson(unlockedCategories, window.appDb, state.mistakeLog, 10);
            
            if (!ACTIVE_LESSON || ACTIVE_LESSON.length === 0) {
                app.showToast('Nema reÄi za veÅ¾bu.', 'error');
                return;
            }
            state.currentLevelKey = 'PRACTICE';
            state.currentSkillId = unlockedSkills[0].id;
            state.currentLessonIndex = 0;
            state.lastLessonMistakes = 0;
            app.saveStats();
            app.navigate('lesson');
            app.renderQuestion();
        } catch (e) {
            console.error('Error starting practice:', e);
            app.navigate('home');
        }
    },
    renderMistakes: async () => {
        const listEl = document.getElementById('mistakes-list');
        const emptyEl = document.getElementById('mistakes-empty-state');
        const btnEl = document.getElementById('mistakes-review-btn');
        const badgeEl = document.getElementById('mistakes-count-badge');
        
        listEl.innerHTML = '';
        
        const mistakeIds = Object.keys(state.mistakeLog || {});
        if (mistakeIds.length === 0) {
            emptyEl.classList.remove('hidden');
            btnEl.classList.add('hidden');
            return;
        }
        
        emptyEl.classList.add('hidden');
        btnEl.classList.remove('hidden');
        badgeEl.textContent = mistakeIds.length;
        
        mistakeIds.sort((a, b) => state.mistakeLog[b] - state.mistakeLog[a]);
        
        const displayIds = mistakeIds.slice(0, 50);
        
        for (const id of displayIds) {
            const word = await window.appDb.getWord(id);
            if (!word) continue;
            const weight = state.mistakeLog[id];
            
            const isToEn = state.settings.learningDirection === 'sr_to_en';
            const primary = isToEn ? word.en : word.sr;
            const secondary = isToEn ? word.sr : word.en;
            
            const item = document.createElement('div');
            item.className = 'bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 flex justify-between items-center transition-all hover:border-blue-200 dark:hover:border-blue-800';
            
            item.innerHTML = `
                <div>
                    <h4 class="font-black text-slate-800 dark:text-white text-lg">${primary}</h4>
                    <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">${secondary}</p>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">Weight: ${weight}</span>
                    <button onclick="app.toggleFlashcard('${id}'); setTimeout(() => app.renderMistakes(), 100);" class="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Ukloni ✖</button>
                </div>
            `;
            listEl.appendChild(item);
        }
    },
    startMistakeReview: async () => {
        const mistakeIds = Object.keys(state.mistakeLog || {});
        if (mistakeIds.length === 0) return;
        
        try {
            ACTIVE_LESSON = await window.QuestionEngine.generateMistakeReviewLesson(window.appDb, state.mistakeLog, 10);
            
            if (!ACTIVE_LESSON || ACTIVE_LESSON.length === 0) {
                app.showToast('Greška pri kreiranju lekcije.', 'error');
                return;
            }
            state.currentLevelKey = 'PRACTICE';
            state.currentSkillId = 'mistakes'; // Special flag
            state.currentLessonIndex = 0;
            state.lastLessonMistakes = 0;
            app.saveStats();
            app.navigate('lesson');
            app.renderQuestion();
        } catch (e) {
            console.error('Error starting mistake review:', e);
            app.navigate('mistakes');
        }
    },
    formatQuestionText: (text) => {
        if (!text) return '';
        if (typeof GrammarEngine !== 'undefined' && GrammarEngine.wrapInteractiveWords) {
            return GrammarEngine.wrapInteractiveWords(text);
        }
        return text;
    },
    renderQuestion: () => {
        if (typeof GrammarEngine !== 'undefined') {
            if (GrammarEngine.setAnswered) GrammarEngine.setAnswered(false);
            if (GrammarEngine.hideTooltip) GrammarEngine.hideTooltip();
        }
        if (!ACTIVE_LESSON || ACTIVE_LESSON.length === 0) {
            alert("Lesson data missing. Returning to home.");
            app.navigate('home');
            return;
        }

        state.currentLessonIndex = Number(state.currentLessonIndex) || 0;
        if (state.currentLessonIndex < 0) state.currentLessonIndex = 0;
        if (state.currentLessonIndex >= ACTIVE_LESSON.length) state.currentLessonIndex = 0;

        const l = ACTIVE_LESSON[state.currentLessonIndex];
        const area = document.getElementById('lesson-content-area');
        document.getElementById('lesson-progress-bar').style.width = `${(state.currentLessonIndex / ACTIVE_LESSON.length) * 100}%`;

        // Reset UI state for new question
        document.getElementById('check-btn').classList.remove('hidden');
        document.getElementById('next-btn').classList.add('hidden');
        document.getElementById('feedback-area').classList.add('hidden');

        // Reset button state
        document.getElementById('check-btn').disabled = true;
        document.getElementById('check-btn').classList.replace('bg-blue-500', 'bg-slate-200');
        document.getElementById('check-btn').classList.replace('text-white', 'text-slate-400');

        state.userSelection = null;

        if (l.type === 'speaking') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            // Note: The UI shows the source word to the user, and they must speak the TARGET translation.
            const speakQuestion = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const speakCorrect = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
            const targetLang = (isSrToEn && l.targetLang_rev) ? l.targetLang_rev : l.targetLang;
            
            // Format question text nicely
            const qParts = speakQuestion.split('\n');
            const qHeader = qParts[0];
            const qWord = qParts[1] || '';
            const qSub = qParts[2] || '';
            
            area.innerHTML = `
                <div class="text-center w-full max-w-xs">
                    <h2 class="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">${qHeader}</h2>
                    <div class="text-2xl font-black text-slate-800 dark:text-white mb-6">${app.formatQuestionText(qWord)}</div>
                    
                    <div class="flex flex-col items-center gap-6">
                        <button id="mic-btn" onclick="app.startMicRecognition('${targetLang}')" class="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 border-4 border-blue-200 dark:border-blue-700 flex items-center justify-center text-4xl shadow-md transition-all active:scale-95">
                            🎙️
                        </button>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${qSub}</p>
                        
                        <div id="transcription-box" class="min-h-[80px] w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center">
                            <p class="text-xs font-bold text-slate-400 uppercase mb-1 hidden" id="transcription-label">Rekli ste:</p>
                            <p id="transcription-text" class="text-lg font-black text-slate-700 dark:text-white">...</p>
                        </div>
                    </div>
                </div>
            `;
        } else if (l.type === 'fill_blank') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            
            // Format the question: Split by \n\n to show the translation on top, and the blanked sentence below
            const parts = questionText.split('\n\n');
            const mainText = parts[0];
            const blankText = parts[1] || "";
            
            area.innerHTML = `
                <h2 class="text-xl font-black mb-2 text-slate-700 dark:text-slate-100">${app.formatQuestionText(mainText)}</h2>
                <div class="text-lg font-bold text-slate-500 mb-8">${app.formatQuestionText(blankText)}</div>
                <div class="w-full max-w-xs">
                    <input type="text" id="fill-blank-input" placeholder="Type the missing word..." 
                           class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center font-bold text-lg focus:outline-none focus:border-blue-500 transition-colors"
                           oninput="state.userSelection = this.value.trim(); if(this.value.trim().length > 0) app.enableCheckBtn(); else document.getElementById('check-btn').disabled = true;" />
                </div>
            `;
            setTimeout(() => document.getElementById('fill-blank-input').focus(), 100);

        } else if (l.type === 'word_order') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const scrambled = (isSrToEn && l.scrambled_rev) ? l.scrambled_rev : l.scrambled;
            
            // We need a drop zone and a word bank
            state.userSelection = []; // it will be an array of words
            area.innerHTML = `
                <h2 class="text-xl font-black mb-8 text-slate-700 dark:text-slate-100">${app.formatQuestionText(questionText)}</h2>
                <div class="w-full max-w-md flex flex-col gap-6">
                    <div id="word-order-answer" class="min-h-[60px] p-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 flex flex-wrap gap-2 items-center justify-center">
                        <!-- Words move here when clicked -->
                    </div>
                    <div id="word-order-bank" class="flex flex-wrap gap-2 justify-center">
                        ${scrambled.map((w, i) => `<button id="word-tile-${i}" onclick="app.moveWordOrderTile(this, '${w}')" class="px-4 py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-transform">${w}</button>`).join('')}
                    </div>
                </div>
            `;
        } else if (l.type.startsWith('alphabet_')) {
            const fontClass = l.isCursive ? 'font-cursive' : '';
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const txt = {
                whichWord: isSrToEn ? 'Koja slika predstavlja ovo slovo?' : 'Which picture does this letter represent?',
                whichLetter: isSrToEn ? 'Koje slovo čuješ?' : 'Which letter do you hear?',
                sayWord: isSrToEn ? 'Izgovori reč' : 'Say the word',
                youSaid: isSrToEn ? 'Rekli ste:' : 'You said:',
                matchPairs: isSrToEn ? 'Poveži slova sa slikama' : 'Match letters to pictures'
            };
            if (l.type === 'alphabet_picture') {
                area.innerHTML = `
                    <div class="text-center w-full max-w-xs flex flex-col items-center">
                        <div class="text-[120px] leading-none text-slate-800 dark:text-white mb-2 ${fontClass}">${l.targetLetter.upper}</div>
                        <h2 class="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">${txt.whichWord}</h2>
                        <div class="grid grid-cols-2 gap-3 w-full">
                            ${l.options.map((opt, i) => `
                                <button onclick="app.selectOption(this, '${opt.upper}')" id="opt-${i}"
                                    class="option-btn p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-center active:scale-95 transition-all hover:border-blue-400 flex items-center justify-center">
                                    <div class="text-6xl">${opt.emoji}</div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            } else if (l.type === 'alphabet_listen') {
                area.innerHTML = `
                    <div class="text-center w-full max-w-xs flex flex-col items-center">
                        <div class="w-32 h-32 mb-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-7xl shadow-inner border-4 border-white dark:border-slate-800">${l.targetLetter.emoji}</div>
                        <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-widest">${txt.whichLetter}</h3>
                        <div class="grid grid-cols-2 gap-3 w-full">
                            ${l.options.map((opt, i) => `
                                <button onclick="app.selectOption(this, '${opt.upper}')" id="opt-${i}"
                                    class="option-btn p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-center active:scale-95 transition-all hover:border-blue-400 flex items-center justify-center">
                                    <div class="text-5xl font-black text-slate-800 dark:text-white ${fontClass}">${opt.upper}</div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
                // Play audio automatically
                setTimeout(() => app.speakPhrase(l.targetLetter.word, 'sr-RS'), 300);
            } else if (l.type === 'alphabet_voice') {
                area.innerHTML = `
                    <div class="text-center w-full max-w-xs flex flex-col items-center">
                        <div class="text-[120px] leading-none text-slate-800 dark:text-white mb-2 ${fontClass}">${l.targetLetter.upper}</div>
                        <div class="flex items-center gap-2 mb-8 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full border-2 border-slate-200 dark:border-slate-700">
                            <span class="text-2xl">${l.targetLetter.emoji}</span>
                            <span class="text-xl font-black text-slate-700 dark:text-slate-200">${l.targetLetter.word}</span>
                        </div>
                        <h2 class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-widest">${txt.sayWord}</h2>
                        
                        <button id="mic-btn" onclick="app.startMicRecognition('sr-RS')" class="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 border-4 border-blue-200 dark:border-blue-700 flex items-center justify-center text-4xl shadow-md transition-all active:scale-95">
                            🎙️
                        </button>
                        
                        <div id="transcription-box" class="mt-6 min-h-[60px] w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center">
                            <p class="text-xs font-bold text-slate-400 uppercase mb-1 hidden" id="transcription-label">${txt.youSaid}</p>
                            <p id="transcription-text" class="text-lg font-black text-slate-700 dark:text-white">...</p>
                        </div>
                    </div>
                `;
            } else if (l.type === 'alphabet_match') {
                state.matchingState = {
                    selectedLeft: null,
                    selectedRight: null,
                    matched: 0,
                    totalPairs: l.pairsData.length
                };
                
                const leftCol = [...l.pairsData].sort(() => 0.5 - Math.random());
                const rightCol = [...l.pairsData].sort(() => 0.5 - Math.random());
                
                area.innerHTML = `
                    <h2 class="text-xl font-black mb-6 text-slate-700 dark:text-slate-100 text-center">${txt.matchPairs}</h2>
                    <div class="flex gap-4 w-full max-w-sm">
                        <div class="flex-1 flex flex-col gap-3">
                            ${leftCol.map((d, i) => `<button id="match-l-${d.upper}" onclick="app.selectMatchingPair(this, '${d.upper}', 'left')" class="w-full py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-4xl text-slate-800 dark:text-white shadow-sm transition-all ${fontClass}">${d.upper}</button>`).join('')}
                        </div>
                        <div class="flex-1 flex flex-col gap-3">
                            ${rightCol.map((d, i) => `<button id="match-r-${d.upper}" onclick="app.selectMatchingPair(this, '${d.upper}', 'right')" class="w-full py-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm transition-all flex items-center justify-center"><span class="text-5xl">${d.emoji}</span></button>`).join('')}
                        </div>
                    </div>
                `;
                document.getElementById('check-btn').classList.add('hidden');
            }
        } else if (l.type === 'whiteboard') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            // Bilingual text
            const txt = {
                clear: isSrToEn ? 'Obriši' : 'Clear',
                good: isSrToEn ? 'Dobro je!' : 'I got it right!',
                bad: isSrToEn ? 'Pogrešio sam' : 'I messed up'
            };
            
            // Set up prompt and target text based on question context
            let targetText = l.target;
            let promptText = l.q;
            let subText = l.q_sub || '';
            let fontClass = l.isCursive ? 'font-cursive' : '';
            
            if (isSrToEn && l.target_rev) {
                targetText = l.target_rev;
                promptText = l.q_rev;
                subText = l.q_sub_rev || '';
            }

            // For full sentences, scale down the font size of the overlay
            let textSizeClass = targetText.length > 5 ? 'text-5xl' : 'text-[120px]';

            area.innerHTML = `
                <div class="text-center w-full max-w-sm flex flex-col items-center">
                    <h2 class="text-xl font-black text-slate-700 dark:text-slate-100 mb-1">${promptText}</h2>
                    ${subText ? `<p class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">${subText}</p>` : ''}
                    
                    <div class="relative w-full h-64 bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm mb-4" id="canvas-container">
                        <!-- Grid background for writing practice -->
                        <div class="absolute inset-0 flex flex-col justify-evenly pointer-events-none opacity-20">
                            <div class="w-full h-[2px] bg-blue-500 border-dashed"></div>
                            <div class="w-full h-[2px] bg-red-500"></div>
                            <div class="w-full h-[2px] bg-blue-500 border-dashed"></div>
                        </div>
                        
                        <!-- The overlay that shows the perfect text after check -->
                        <div id="whiteboard-overlay" class="absolute inset-0 flex items-center justify-center ${textSizeClass} text-center leading-tight font-black text-green-500 opacity-0 pointer-events-none transition-opacity duration-700 ${fontClass} drop-shadow-md px-4" style="z-index: 10;">
                            ${targetText}
                        </div>
                        <canvas id="drawing-canvas" class="w-full h-full cursor-crosshair touch-none" style="z-index: 5; position: relative;"></canvas>
                    </div>
                    
                    <button id="clear-canvas-btn" onclick="app.clearCanvas()" class="px-6 py-2 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold active:scale-95 mb-4 shadow-sm transition-transform">${txt.clear}</button>
                    
                    <div id="self-grade-btns" class="hidden w-full gap-4">
                        <button onclick="app.selfGradeWhiteboard(true)" class="flex-1 py-4 bg-green-500 text-white rounded-xl font-black text-lg active:scale-95 shadow-lg flex justify-center items-center gap-2">🟢 ${txt.good}</button>
                        <button onclick="app.selfGradeWhiteboard(false)" class="flex-1 py-4 bg-red-500 text-white rounded-xl font-black text-lg active:scale-95 shadow-lg flex justify-center items-center gap-2">🔴 ${txt.bad}</button>
                    </div>
                </div>
            `;
            
            // Auto-enable check button because user might not draw anything or we just trust them to hit check when ready
            app.enableCheckBtn();
            
            // Play audio if provided
            if (l.audioWord) {
                 setTimeout(() => app.speakPhrase(l.audioWord, l.audioLang), 300);
            }
            
            // Init canvas
            setTimeout(() => app.initCanvas(), 50);
        } else if (l.type === 'hangman') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
            
            state.hangmanState = {
                target: correctText.toUpperCase(),
                guesses: [],
                mistakes: 0
            };

            const keyboard = "QWERTYUIOPASDFGHJKLZXCVBNMČĆŽŠĐ".split('');
            // Only show Serbian letters if learning Serbian
            const keys = (isSrToEn) ? "QWERTYUIOPASDFGHJKLZXCVBNM".split('') : keyboard;

            area.innerHTML = `
                <h2 class="text-xl font-black mb-4 text-slate-700 dark:text-slate-100">${questionText}</h2>
                <div class="w-full max-w-sm flex flex-col gap-6 items-center">
                    <div id="hangman-figure" class="text-4xl h-16 flex items-center justify-center font-black text-red-500"></div>
                    <div id="hangman-word" class="flex gap-2 flex-wrap justify-center font-black text-2xl text-slate-800 dark:text-slate-100">
                        ${state.hangmanState.target.split('').map(char => char === ' ' ? '<span class="w-4"></span>' : `<span class="border-b-4 border-slate-400 w-8 text-center uppercase hangman-letter" data-char="${char}">_</span>`).join('')}
                    </div>
                    <div class="flex flex-wrap justify-center gap-2 mt-4" id="hangman-keyboard">
                        ${keys.map(k => `<button onclick="app.guessHangmanLetter(this, '${k}')" class="w-10 h-12 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-black text-slate-700 dark:text-slate-200 active:scale-95 transition-transform uppercase">${k}</button>`).join('')}
                    </div>
                </div>
            `;
            // Auto-enable check button because hangman doesn't use the check button, it auto-checks
            document.getElementById('check-btn').classList.add('hidden');
        } else if (l.type === 'matching_pairs') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            
            state.matchingState = {
                selectedLeft: null,
                selectedRight: null,
                matched: 0,
                totalPairs: l.pairs
            };

            area.innerHTML = `
                <h2 class="text-xl font-black mb-6 text-slate-700 dark:text-slate-100">${questionText}</h2>
                <div class="flex gap-4 w-full max-w-sm">
                    <div class="flex flex-col gap-3 w-1/2">
                        ${l.leftCol.map(item => `<button id="match-l-${item.id}" onclick="app.selectMatchingPair(this, '${item.id}', 'left')" class="p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all text-center break-words">${item.text}</button>`).join('')}
                    </div>
                    <div class="flex flex-col gap-3 w-1/2">
                        ${l.rightCol.map(item => `<button id="match-r-${item.id}" onclick="app.selectMatchingPair(this, '${item.id}', 'right')" class="p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all text-center break-words">${item.text}</button>`).join('')}
                    </div>
                </div>
            `;
            document.getElementById('check-btn').classList.add('hidden'); // auto-checks
        } else if (l.type === 'picture_choice') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const optionsArray = (isSrToEn && l.options_rev) ? l.options_rev : l.options;

            area.innerHTML = `
                <div class="text-center w-full max-w-sm">
                    <p class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Which picture is...</p>
                    <h2 class="text-2xl font-black mb-8 text-slate-800 dark:text-white">"${questionText}"</h2>
                    <div class="grid grid-cols-2 gap-4">
                        ${optionsArray.map(opt => `
                            <button onclick="app.selectOption(this, '${opt.text.replace(/'/g, "\\'")}')" 
                                class="option-btn flex flex-col items-center justify-center gap-2 p-6 bg-white dark:bg-slate-800 border-3 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm active:scale-95 transition-all hover:border-blue-400 dark:hover:border-blue-500">
                                <span class="text-5xl">${opt.emoji}</span>
                                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">${opt.text}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (l.type === 'listening') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const audioWord = (isSrToEn && l.q_audio_rev) ? l.q_audio_rev : l.q_audio;
            const audioLang = (isSrToEn && l.audioLang_rev) ? l.audioLang_rev : l.audioLang;
            const optionsArray = (isSrToEn && l.options_rev) ? l.options_rev : l.options;

            area.innerHTML = `
                <div class="text-center w-full max-w-sm">
                    <p class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">What do you hear?</p>
                    <button onclick="app.speakPhrase('${audioWord.replace(/'/g, "\\'")}', '${audioLang}')" 
                        class="w-24 h-24 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/50 border-4 border-blue-200 dark:border-blue-700 flex items-center justify-center text-5xl shadow-md transition-all active:scale-95 hover:bg-blue-200 dark:hover:bg-blue-800 mb-8">
                        🔊
                    </button>
                    <div class="grid w-full gap-3">
                        ${optionsArray.map(o => `<button onclick="app.selectOption(this, '${o.replace(/'/g, "\\'")}')" class="option-btn py-3 rounded-xl border-2 font-black text-xs text-slate-700 border-slate-200 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800">${o}</button>`).join('')}
                    </div>
                </div>
            `;
            // Auto-play the audio once when the question loads
            setTimeout(() => app.speakPhrase(audioWord, audioLang), 400);
        } else if (l.type === 'dialogue') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const npcMsg = (isSrToEn && l.npcMessage_rev) ? l.npcMessage_rev : l.npcMessage;
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const optionsArray = (isSrToEn && l.options_rev) ? l.options_rev : l.options;

            area.innerHTML = `
                <div class="w-full max-w-sm flex flex-col gap-4">
                    <!-- NPC Chat Bubble -->
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0">AI</div>
                        <div class="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-md p-4 max-w-[80%] shadow-sm">
                            <p class="font-bold text-slate-700 dark:text-slate-200 text-sm">${npcMsg}</p>
                        </div>
                    </div>

                    <!-- Question Prompt -->
                    <p class="text-sm font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-widest mt-2">${questionText}</p>

                    <!-- Reply Options -->
                    <div class="grid w-full gap-3 mt-2">
                        ${optionsArray.map(o => `
                            <button onclick="app.selectOption(this, '${o.replace(/'/g, "\\'")}')" 
                                class="option-btn py-3 px-4 rounded-2xl border-2 font-bold text-xs text-left text-slate-700 border-slate-200 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800 transition-all">
                                💬 ${o}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (l.type === 'spelling_voice') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const speakQuestion = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
            const targetLang = (isSrToEn && l.targetLang_rev) ? l.targetLang_rev : l.targetLang;
            
            const qParts = speakQuestion.split('\n');
            const qHeader = qParts[0];
            const qWord = qParts[1] || '';
            const qSub = qParts[2] || '';

            // Build letter display
            const letters = correctText.split('');
            const letterDisplay = letters.map((ch, i) => `<span class="inline-block w-8 h-10 mx-0.5 border-b-4 border-slate-300 dark:border-slate-600 text-center text-xl font-black text-transparent spelling-letter" data-idx="${i}">${ch}</span>`).join('');

            area.innerHTML = `
                <div class="text-center w-full max-w-xs">
                    <h2 class="text-lg font-bold text-slate-500 dark:text-slate-400 mb-2">${qHeader}</h2>
                    <div class="text-2xl font-black text-slate-800 dark:text-white mb-4">${qWord}</div>
                    
                    <div class="flex flex-wrap justify-center mb-6" id="spelling-letter-display">
                        ${letterDisplay}
                    </div>

                    <div class="flex flex-col items-center gap-4">
                        <button id="mic-btn" onclick="app.startMicRecognition('${targetLang}')" class="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900 border-4 border-blue-200 dark:border-blue-700 flex items-center justify-center text-3xl shadow-md transition-all active:scale-95">
                            \u{1F3A4}
                        </button>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${qSub}</p>
                        
                        <div id="transcription-box" class="min-h-[60px] w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 text-center flex flex-col items-center justify-center">
                            <p class="text-xs font-bold text-slate-400 uppercase mb-1 hidden" id="transcription-label">You said:</p>
                            <p id="transcription-text" class="text-lg font-black text-slate-700 dark:text-white">...</p>
                        </div>

                        <button onclick="app.playSpelledOut('${correctText.replace(/'/g, "\\'")}', '${targetLang}')" class="px-4 py-2 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-xl text-xs font-bold border-2 border-amber-200 dark:border-amber-700 active:scale-95 transition-transform">
                            \u{1F50A} Hear Spelling
                        </button>
                    </div>
                </div>
            `;
        } else if (l.type === 'drag_punctuation') {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const sentence = (isSrToEn && l.sentence_rev) ? l.sentence_rev : l.sentence;
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const marks = (isSrToEn && l.marks_rev) ? l.marks_rev : l.marks;
            
            // Available punctuation marks to drag
            const allPunc = ['.', '?', '!', ',', ':', ';'];
            // Include marks that are correct + some distractors
            const distractors = allPunc.filter(p => !marks.includes(p)).slice(0, 2);
            const puncBank = QuestionEngine.shuffle([...marks, ...distractors]);

            // Build the sentence with clickable slots
            let slotIndex = 0;
            const sentenceHtml = sentence.replace(/<span class="punc-slot[^"]*"><\/span>/g, () => {
                const idx = slotIndex++;
                return `<span class="punc-slot inline-block w-8 h-8 mx-1 border-b-2 border-dashed border-blue-400 dark:border-blue-500 text-center text-lg font-black text-blue-600 dark:text-blue-400 cursor-pointer rounded bg-blue-50 dark:bg-blue-900/30 align-bottom" data-slot="${idx}" onclick="app.placePunctuation(${idx})"></span>`;
            });

            state.puncState = {
                selectedMark: null,
                placed: new Array(marks.length).fill(''),
                correct: marks
            };

            area.innerHTML = `
                <div class="text-center w-full max-w-sm">
                    <h2 class="text-lg font-black mb-2 text-slate-700 dark:text-slate-100">${questionText}</h2>
                    <p class="text-xs text-slate-400 dark:text-slate-500 mb-6">Tap a mark, then tap the slot</p>
                    
                    <div class="text-xl font-bold text-slate-800 dark:text-white leading-relaxed mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700" id="punc-sentence">
                        ${sentenceHtml}
                    </div>
                    
                    <div class="flex flex-wrap gap-3 justify-center" id="punc-bank">
                        ${puncBank.map((p, i) => `<button id="punc-mark-${i}" onclick="app.selectPuncMark(this, '${p}')" class="w-14 h-14 bg-white dark:bg-slate-800 border-3 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-2xl text-slate-700 dark:text-slate-200 shadow-sm active:scale-95 transition-all hover:border-blue-400">${p}</button>`).join('')}
                    </div>
                </div>
            `;
        } else {
            // Apply bidirectional learning for standard questions (multiple_choice)
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const questionText = (isSrToEn && l.q_rev) ? l.q_rev : l.q;
            const optionsArray = (isSrToEn && l.options_rev) ? l.options_rev : l.options;

            area.innerHTML = `<h2 class="text-xl font-black mb-8 text-slate-700 dark:text-slate-100">${app.formatQuestionText(questionText)}</h2><div class="grid w-full max-w-xs gap-3">` +
                optionsArray.map(o => `<button onclick="app.selectOption(this, '${o}')" class="option-btn py-3 rounded-xl border-2 font-black text-xs text-slate-700 border-slate-200 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800">${o}</button>`).join('') + `</div>`;
        }
    },
    moveWordOrderTile: (btn, word) => {
        const answerArea = document.getElementById('word-order-answer');
        const bankArea = document.getElementById('word-order-bank');
        
        if (btn.parentElement.id === 'word-order-bank') {
            // Move to answer area
            answerArea.appendChild(btn);
            state.userSelection.push(word);
        } else {
            // Move back to bank
            bankArea.appendChild(btn);
            const index = state.userSelection.indexOf(word);
            if (index > -1) {
                state.userSelection.splice(index, 1);
            }
        }
        
        // Enable check button if all words are placed (or at least one)
        if (bankArea.children.length === 0) {
            app.enableCheckBtn();
        } else {
            document.getElementById('check-btn').disabled = true;
            document.getElementById('check-btn').classList.replace('bg-blue-500', 'bg-slate-200');
            document.getElementById('check-btn').classList.replace('text-white', 'text-slate-400');
        }
    },
    guessHangmanLetter: (btn, letter) => {
        if (btn.disabled) return;
        btn.disabled = true;
        
        state.hangmanState.guesses.push(letter);
        
        const target = state.hangmanState.target;
        if (target.includes(letter)) {
            btn.classList.replace('bg-slate-100', 'bg-green-100');
            btn.classList.replace('dark:bg-slate-800', 'dark:bg-green-900');
            btn.classList.replace('text-slate-700', 'text-green-700');
            app.playSound('correct');
            
            // Update blanks
            const spans = document.querySelectorAll('.hangman-letter');
            let isComplete = true;
            let idx = 0;
            for(let i = 0; i < target.length; i++) {
                if (target[i] === ' ') continue;
                if (state.hangmanState.guesses.includes(target[i])) {
                    spans[idx].innerText = target[i];
                    spans[idx].classList.remove('border-b-4');
                } else {
                    isComplete = false;
                }
                idx++;
            }
            
            if (isComplete) {
                state.userSelection = target; // simulate correct guess
                // Mock the correct logic flow
                document.getElementById('check-btn').classList.remove('hidden');
                document.getElementById('check-btn').disabled = false;
                app.checkAnswer(); // Trigger grade
            }
        } else {
            btn.classList.replace('bg-slate-100', 'bg-red-100');
            btn.classList.replace('dark:bg-slate-800', 'dark:bg-red-900');
            btn.classList.replace('text-slate-700', 'text-red-700');
            app.playSound('incorrect');
            
            state.hangmanState.mistakes++;
            
            const figure = document.getElementById('hangman-figure');
            const parts = ["O", "O<br/>|", "O<br/>/|", "O<br/>/|\\", "O<br/>/|\\<br/>/", "O<br/>/|\\<br/>/ \\"];
            figure.innerHTML = parts[state.hangmanState.mistakes - 1] || "💀";
            
            if (state.hangmanState.mistakes >= 6) {
                state.userSelection = "FAILED"; 
                document.getElementById('check-btn').classList.remove('hidden');
                document.getElementById('check-btn').disabled = false;
                app.checkAnswer(); // Trigger grade (will fail)
            }
        }
    },
    // --- PUNCTUATION DRAG & DROP HELPERS ---
    selectPuncMark: (btn, mark) => {
        // Deselect all
        document.querySelectorAll('#punc-bank button').forEach(b => {
            b.classList.remove('border-blue-500', 'bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
            b.classList.add('border-slate-200', 'dark:border-slate-700');
        });
        // Select this one
        btn.classList.remove('border-slate-200', 'dark:border-slate-700');
        btn.classList.add('border-blue-500', 'bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
        state.puncState.selectedMark = mark;
    },
    placePunctuation: (slotIdx) => {
        if (!state.puncState.selectedMark) {
            app.showToast('Tap a punctuation mark first!', 'error');
            return;
        }
        const slot = document.querySelector(`[data-slot="${slotIdx}"]`);
        if (!slot) return;

        state.puncState.placed[slotIdx] = state.puncState.selectedMark;
        slot.textContent = state.puncState.selectedMark;
        slot.classList.remove('border-dashed', 'border-blue-400', 'dark:border-blue-500');
        slot.classList.add('border-solid', 'border-green-400', 'dark:border-green-500', 'bg-green-50', 'dark:bg-green-900/30');

        // Check if all slots are filled
        const allFilled = state.puncState.placed.every(p => p !== '');
        if (allFilled) {
            app.enableCheckBtn();
        }
    },
    // --- AUDIO SPELLED OUT HELPER ---
    playSpelledOut: (word, lang) => {
        // Spell out the word letter by letter, then say the whole word
        const letters = word.split('');
        let delay = 0;
        letters.forEach((ch, i) => {
            setTimeout(() => {
                app.speakPhrase(ch, lang);
                // Reveal the letter in the display
                const span = document.querySelector(`.spelling-letter[data-idx="${i}"]`);
                if (span) {
                    span.classList.remove('text-transparent');
                    span.classList.add('text-green-600', 'dark:text-green-400');
                }
            }, delay);
            delay += 700;
        });
        // Say the full word at the end
        setTimeout(() => {
            app.speakPhrase(word, lang);
        }, delay + 300);
    },
    selectMatchingPair: (btn, id, side) => {
        if (btn.disabled) return;
        
        // Helper to reset a button's visual state
        const resetBtn = (b) => {
            b.classList.remove('bg-blue-100', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-500', 'bg-red-100', 'border-red-500', 'dark:bg-red-900', 'dark:border-red-500', 'text-red-700', 'dark:text-red-200');
            b.classList.add('bg-white', 'border-slate-200', 'dark:bg-slate-800', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-200');
        };

        // Helper to set selected state
        const selectBtn = (b) => {
            b.classList.remove('bg-white', 'border-slate-200', 'dark:bg-slate-800', 'dark:border-slate-700');
            b.classList.add('bg-blue-100', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-500');
        };

        // Visual selection
        selectBtn(btn);
        
        if (side === 'left') {
            if (state.matchingState.selectedLeft && state.matchingState.selectedLeft !== id) {
                resetBtn(document.getElementById(`match-l-${state.matchingState.selectedLeft}`));
            }
            state.matchingState.selectedLeft = id;
        } else {
            if (state.matchingState.selectedRight && state.matchingState.selectedRight !== id) {
                resetBtn(document.getElementById(`match-r-${state.matchingState.selectedRight}`));
            }
            state.matchingState.selectedRight = id;
        }
        
        // If both selected, evaluate
        if (state.matchingState.selectedLeft && state.matchingState.selectedRight) {
            const leftId = state.matchingState.selectedLeft;
            const rightId = state.matchingState.selectedRight;
            const leftBtn = document.getElementById(`match-l-${leftId}`);
            const rightBtn = document.getElementById(`match-r-${rightId}`);
            
            if (leftId === rightId) {
                // Match!
                app.playSound('correct');
                leftBtn.classList.remove('bg-blue-100', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-500', 'text-slate-700', 'dark:text-slate-200');
                leftBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-500', 'dark:text-green-200');
                
                rightBtn.classList.remove('bg-blue-100', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-500', 'text-slate-700', 'dark:text-slate-200');
                rightBtn.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-500', 'dark:text-green-200');
                
                leftBtn.disabled = true;
                rightBtn.disabled = true;
                
                setTimeout(() => {
                    leftBtn.style.opacity = '0';
                    rightBtn.style.opacity = '0';
                }, 300);
                
                state.matchingState.matched++;
                
                if (state.matchingState.matched >= state.matchingState.totalPairs) {
                    // Won
                    state.userSelection = "MATCHED";
                    document.getElementById('check-btn').classList.remove('hidden');
                    document.getElementById('check-btn').disabled = false;
                    app.checkAnswer(); 
                }
            } else {
                // Mismatch
                app.playSound('incorrect');
                leftBtn.classList.remove('bg-blue-100', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-500', 'text-slate-700', 'dark:text-slate-200');
                leftBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-500', 'dark:text-red-200');
                
                rightBtn.classList.remove('bg-blue-100', 'border-blue-500', 'dark:bg-blue-900', 'dark:border-blue-500', 'text-slate-700', 'dark:text-slate-200');
                rightBtn.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-500', 'dark:text-red-200');
                
                // We don't fail the whole question, just clear selection
                setTimeout(() => {
                    resetBtn(leftBtn);
                    resetBtn(rightBtn);
                }, 400);
            }
            
            state.matchingState.selectedLeft = null;
            state.matchingState.selectedRight = null;
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
    
    // ======== WHITEBOARD CANVAS ENGINE (Priority 7) ========
    initCanvas: () => {
        const canvas = document.getElementById('drawing-canvas');
        if (!canvas) return;
        const container = document.getElementById('canvas-container');
        
        // Set actual pixel dimensions to match CSS layout
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#1e293b';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        let drawing = false;
        
        const getPos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            if (e.touches) {
                return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
            }
            return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
        };
        
        const startDraw = (e) => {
            e.preventDefault();
            drawing = true;
            const pos = getPos(e);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        };
        
        const draw = (e) => {
            e.preventDefault();
            if (!drawing) return;
            const pos = getPos(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        };
        
        const stopDraw = (e) => {
            if (e) e.preventDefault();
            drawing = false;
        };
        
        // Mouse events
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDraw);
        canvas.addEventListener('mouseleave', stopDraw);
        
        // Touch events (mobile)
        canvas.addEventListener('touchstart', startDraw, { passive: false });
        canvas.addEventListener('touchmove', draw, { passive: false });
        canvas.addEventListener('touchend', stopDraw, { passive: false });
        canvas.addEventListener('touchcancel', stopDraw, { passive: false });
        
        // Store ctx reference for clearCanvas
        state.canvasCtx = ctx;
    },
    
    clearCanvas: () => {
        const canvas = document.getElementById('drawing-canvas');
        if (!canvas || !state.canvasCtx) return;
        state.canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    },
    
    selfGradeWhiteboard: (correct) => {
        state.userSelection = correct;
        app.checkAnswer();
    },
    // ======== END WHITEBOARD ENGINE ========

    pcmToWavBlob: (base64Pcm, sampleRate = 24000) => {
        try {
            const binaryStr = atob(base64Pcm);
            const pcmLength = binaryStr.length;
            const wavBuffer = new ArrayBuffer(44 + pcmLength);
            const view = new DataView(wavBuffer);

            const writeString = (offset, str) => {
                for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset + i, str.charCodeAt(i));
                }
            };

            writeString(0, 'RIFF');
            view.setUint32(4, 36 + pcmLength, true);
            writeString(8, 'WAVE');
            writeString(12, 'fmt ');
            view.setUint32(16, 16, true);
            view.setUint16(20, 1, true); // PCM format
            view.setUint16(22, 1, true); // Mono
            view.setUint32(24, sampleRate, true);
            view.setUint32(28, sampleRate * 2, true); // Byte rate (sampleRate * 1 * 16/8)
            view.setUint16(32, 2, true); // Block align (1 * 16/8)
            view.setUint16(34, 16, true); // 16 bits per sample
            writeString(36, 'data');
            view.setUint32(40, pcmLength, true);

            const pcmView = new Uint8Array(wavBuffer, 44);
            for (let i = 0; i < pcmLength; i++) {
                pcmView[i] = binaryStr.charCodeAt(i);
            }

            return new Blob([wavBuffer], { type: 'audio/wav' });
        } catch (e) {
            console.error("pcmToWavBlob error:", e);
            return null;
        }
    },

    speakPhrase: (text, lang = 'en-US') => {
        if (!text || typeof text !== 'string') return;
        // Universal Audio Sanitizer: strip phonetic guides [like-this], (/like-this/), and notes
        text = text.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').replace(/\/.*?\//g, '').trim();
        if (!text) return;
        try {
            window.speechSynthesis.cancel();
            if (state.currentAudio) {
                state.currentAudio.pause();
                state.currentAudio = null;
            }

            const tryEmergencyFallback = () => app.fallbackSpeech(text, lang, true);

            const tryGTX = () => {
                if (!navigator.onLine) return tryEmergencyFallback();
                if (window.app && window.app.showToast) {
                    app.showToast(`🌐 Falling back to GTX network voice...`, 'info');
                }
                const gtLang = lang.split('-')[0];
                const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=${gtLang}&q=${encodeURIComponent(text)}`;
                
                const audio = new Audio(url);
                audio.volume = state.settings.volume.tts !== undefined ? state.settings.volume.tts : 1;
                
                let fallbackTriggered = false;
                const triggerFallback = (reason) => {
                    if (fallbackTriggered) return;
                    fallbackTriggered = true;
                    console.warn(`GT TTS failed (${reason}), cascading down...`);
                    tryEmergencyFallback();
                };

                audio.onerror = () => triggerFallback('onerror');
                audio.play().catch(e => triggerFallback(`play rejected`));
                state.currentAudio = audio;
            };

            const tryCloudTTS = async () => {
                const ttsKey = state.settings.ttsApiKey;
                const provider = state.settings.ttsProvider || 'none';
                // For Gemini: use dedicated TTS key, or fall back to the existing grammar Gemini key
                const effectiveKey = (provider === 'gemini') ? (ttsKey || window.apiKey || localStorage.getItem('serbolingo_api_key')) : ttsKey;

                if (effectiveKey && navigator.onLine) {
                    try {
                        let audioUrl = null;

                        if (provider === 'gemini') {
                            // Gemini 2.0 Flash Audio output (native audio response modality)
                            const ttsModels = ['gemini-2.0-flash', 'gemini-2.0-flash-exp'];
                            let geminiSuccess = false;
                            let audioData = null;
                            let audioMime = null;
                            
                            const promptText = lang.startsWith('sr')
                                ? `Pronounce the following text clearly and authentically in Serbian. Only speak the phrase aloud, do not add any explanation or greeting: "${text}"`
                                : `Pronounce the following text clearly and authentically in English. Only speak the phrase aloud, do not add any explanation or greeting: "${text}"`;

                            for (const model of ttsModels) {
                                try {
                                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${effectiveKey}`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            contents: [{
                                                parts: [{ text: promptText }]
                                            }],
                                            generationConfig: {
                                                responseModalities: ["AUDIO"],
                                                speechConfig: {
                                                    voiceConfig: {
                                                        prebuiltVoiceConfig: {
                                                            voiceName: "Kore"
                                                        }
                                                    }
                                                }
                                            }
                                        })
                                    });

                                    if (!response.ok) {
                                        const err = await response.text();
                                        console.warn(`Gemini TTS (${model}) HTTP ${response.status}: ${err.substring(0, 100)}`);
                                        continue;
                                    }

                                    const data = await response.json();
                                    
                                    // Extract audio from candidates -> parts -> inlineData
                                    const parts = data?.candidates?.[0]?.content?.parts;
                                    if (parts) {
                                        for (const part of parts) {
                                            if (part.inlineData && part.inlineData.data) {
                                                audioData = part.inlineData.data;
                                                audioMime = part.inlineData.mimeType || 'audio/pcm;rate=24000';
                                                geminiSuccess = true;
                                                break;
                                            }
                                        }
                                    }
                                    
                                    if (geminiSuccess) break;
                                } catch (modelErr) {
                                    console.warn(`Gemini TTS model ${model} failed:`, modelErr.message);
                                }
                            }
                            
                            if (!geminiSuccess || !audioData) {
                                throw new Error('Gemini TTS: No audio returned from Gemini 2.0 Flash');
                            }
                            
                            // Check if audio is PCM and convert to WAV blob for seamless browser playback
                            if (audioMime.includes('pcm')) {
                                const rateMatch = audioMime.match(/rate=(\d+)/);
                                const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
                                const wavBlob = app.pcmToWavBlob(audioData, sampleRate);
                                if (wavBlob) {
                                    audioUrl = URL.createObjectURL(wavBlob);
                                } else {
                                    audioUrl = `data:${audioMime};base64,${audioData}`;
                                }
                            } else {
                                audioUrl = `data:${audioMime};base64,${audioData}`;
                            }

                        } else if (provider === 'openai') {
                            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${effectiveKey}`,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    model: 'tts-1',
                                    input: text,
                                    voice: 'nova'
                                })
                            });
                            
                            if (!response.ok) {
                                const err = await response.text();
                                throw new Error(`OpenAI API Error: ${response.status} - ${err.substring(0, 50)}...`);
                            }
                            const blob = await response.blob();
                            audioUrl = URL.createObjectURL(blob);
                            
                        } else {
                            // Default to Google Cloud
                            const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${effectiveKey}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    input: { text: text },
                                    voice: { languageCode: lang.startsWith('sr') ? 'sr-RS' : 'en-US', name: lang.startsWith('sr') ? 'sr-RS-Standard-A' : 'en-US-Neural2-F' },
                                    audioConfig: { audioEncoding: 'MP3' }
                                })
                            });
                            
                            if (!response.ok) {
                                const err = await response.text();
                                throw new Error(`Google Cloud API Error: ${response.status} - ${err.substring(0, 50)}...`);
                            }
                            
                            const data = await response.json();
                            if (!data.audioContent) throw new Error('No audio content');
                            audioUrl = "data:audio/mp3;base64," + data.audioContent;
                        }
                        
                        const audio = new Audio(audioUrl);
                        audio.volume = state.settings.volume.tts !== undefined ? state.settings.volume.tts : 1;
                        
                        if (window.app && window.app.showToast) {
                            const names = { gemini: 'Gemini 2.0 Flash AI', openai: 'OpenAI', google: 'Google Cloud' };
                            app.showToast(`🔊 Playing ${names[provider] || provider}...`, 'info');
                        }
                        
                        const cleanup = () => {
                            if (audioUrl.startsWith('blob:')) {
                                URL.revokeObjectURL(audioUrl);
                            }
                        };

                        audio.onended = cleanup;
                        audio.onerror = () => {
                            cleanup();
                            tryNativeWebSpeech();
                        };
                        audio.play().catch(e => {
                            cleanup();
                            tryNativeWebSpeech();
                        });
                        state.currentAudio = audio;
                    } catch (e) {
                        console.warn('Premium AI TTS Error, cascading down...', e);
                        if (window.app && window.app.showToast) {
                            app.showToast(`🚨 ${e.message}`, 'error');
                        }
                        tryNativeWebSpeech();
                    }
                } else {
                    tryNativeWebSpeech();
                }
            };

            const tryNativeWebSpeech = () => {
                const voices = window.speechSynthesis.getVoices();
                const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
                const googleVoice = langVoices.find(v => v.name.includes('Google'));
                
                if (googleVoice) {
                    const u = new SpeechSynthesisUtterance(text);
                    u.lang = lang;
                    u.voice = googleVoice;
                    u.volume = state.settings.volume.tts !== undefined ? state.settings.volume.tts : 1;
                    if (lang.startsWith('sr')) u.rate = 0.85; 
                    
                    window.speechSynthesisUtteranceStorage = u;
                    if (window.app && window.app.showToast) {
                        app.showToast(`🔊 Playing native Google voice...`, 'info');
                    }
                    window.speechSynthesis.speak(u);
                } else {
                    tryGTX();
                }
            };
            
            // Priority Check
            const provider = state.settings.ttsProvider || 'none';
            if (provider !== 'none') {
                // Explicit AI selected -> Priority 1
                tryCloudTTS();
            } else {
                // No AI selected -> Native Priority 1
                tryNativeWebSpeech();
            }
        } catch (e) {
            console.error("speakPhrase error:", e);
            app.fallbackSpeech(text, lang, true);
        }
    },
    fallbackSpeech: (text, lang, isEmergency = false) => {
        try {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = lang;
            u.volume = state.settings.volume.tts !== undefined ? state.settings.volume.tts : 1;
            
            const voices = window.speechSynthesis.getVoices();
            const langVoices = voices.filter(v => v.lang.startsWith(lang.split('-')[0]));
            if (langVoices.length > 0) {
                u.voice = langVoices[0]; // Grab whatever is available
            }
            
            if (lang.startsWith('sr')) {
                u.rate = 0.85; 
            }
            
            window.speechSynthesisUtteranceStorage = u;
            
            if (isEmergency && window.app) {
                if (window.app.showToast) {
                    app.showToast(`🔊 Playing emergency backup voice...`, 'info');
                }
                if (lang.startsWith('sr') && !localStorage.getItem('serbolingo_voice_recommendation_shown')) {
                    const modal = document.getElementById('voice-recommendation-modal');
                    if (modal) {
                        modal.classList.remove('hidden');
                        localStorage.setItem('serbolingo_voice_recommendation_shown', 'true');
                    }
                }
            }
            
            window.speechSynthesis.speak(u);
        } catch (e) {
            console.error("fallbackSpeech error:", e);
        }
    },
    startMicRecognition: (targetLang = 'en-US') => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Vaš pretraživač ne podržava prepoznavanje govora. / Your browser does not support speech recognition.");
            return;
        }

        // Stop any existing recognition instance to prevent duplicates
        if (app.activeRecognition) {
            try { app.activeRecognition.stop(); } catch(e) {}
        }

        const recognition = new SpeechRecognition();
        app.activeRecognition = recognition;
        
        recognition.lang = targetLang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        const micBtn = document.getElementById('mic-btn');
        const resetMicUI = () => {
            if (micBtn) micBtn.classList.remove('animate-pulse', 'bg-red-100', 'dark:bg-red-900', 'border-red-400', 'text-red-500');
        };

        if (micBtn) micBtn.classList.add('animate-pulse', 'bg-red-100', 'dark:bg-red-900', 'border-red-400', 'text-red-500');

        try {
            recognition.start();
        } catch(e) {
            console.error("Speech recognition already started", e);
            resetMicUI();
        }

        recognition.onresult = (event) => {
            let transcript = event.results[0][0].transcript.trim();
            
            // Fix double-word bug if user repeats themselves out of impatience
            const words = transcript.split(' ');
            if (words.length === 2 && words[0].toLowerCase() === words[1].toLowerCase()) {
                transcript = words[0]; // "jabuka jabuka" -> "jabuka"
            }
            
            const label = document.getElementById('transcription-label');
            if (label) label.classList.remove('hidden');
            
            const textEl = document.getElementById('transcription-text');
            if (textEl) textEl.innerText = transcript;
            
            state.userSelection = transcript;
            app.enableCheckBtn();
            resetMicUI();
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            resetMicUI();
            if (event.error === 'not-allowed') {
                alert("Please allow microphone permissions in your browser to use speaking lessons.");
            }
        };

        recognition.onspeechend = () => {
            recognition.stop();
            resetMicUI();
        };
        
        recognition.onend = () => {
            resetMicUI();
        };
    },
    checkAnswer: () => {
        try {
            const l = ACTIVE_LESSON[state.currentLessonIndex];
            let isC = false;

            const normalize = (s) => {
                let str = s.toLowerCase();
                // Normalize Serbian specific letters for flexible typing
                // đ -> dj, dž -> dz
                str = str.replace(/đ/g, "dj");
                str = str.replace(/dž/g, "dz");
                // Remove diacritics
                str = str.replace(/č/g, "c").replace(/ć/g, "c").replace(/š/g, "s").replace(/ž/g, "z");
                // Strip punctuation
                return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
            };

            if (l.type.startsWith('alphabet_')) {
                if (l.type === 'alphabet_match') {
                    isC = true; // Auto-checked in matching
                } else if (l.type === 'alphabet_voice') {
                    const expectedWord = normalize(l.targetLetter.word);
                    const userSaid = normalize(state.userSelection || "");
                    // They might say the letter and then the word, e.g. "d delfin". We just check if the anchor word is inside.
                    isC = userSaid.includes(expectedWord);
                } else {
                    isC = state.userSelection === l.targetLetter.upper;
                }
            } else if (l.type === 'whiteboard') {
                if (state.userSelection === null || state.userSelection === undefined) {
                    // Phase 1: Reveal overlay and prompt self-grade
                    document.getElementById('whiteboard-overlay').classList.remove('opacity-0');
                    document.getElementById('check-btn').classList.add('hidden');
                    document.getElementById('clear-canvas-btn').classList.add('hidden');
                    
                    const gradeBtns = document.getElementById('self-grade-btns');
                    gradeBtns.classList.remove('hidden');
                    gradeBtns.classList.add('flex');
                    return; // Stop here, wait for selfGradeWhiteboard
                } else {
                    // Phase 2: Grading complete
                    isC = !!state.userSelection;
                }
            } else if (l.type === 'speaking') {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                isC = normalize(state.userSelection || "") === normalize(correctText);
                
                const inputElement = document.getElementById('fill-blank-input');
                if (inputElement) {
                    inputElement.disabled = true;
                    if (isC) {
                        inputElement.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
                    } else {
                        inputElement.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
                    }
                }
            } else if (l.type === 'word_order') {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                
                // state.userSelection is an array of words
                const userSentence = (state.userSelection || []).join(' ');
                isC = normalize(userSentence) === normalize(correctText);
                
                // Lock buttons
                document.querySelectorAll('#word-order-answer button').forEach(btn => {
                    btn.disabled = true;
                    if (isC) {
                        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700');
                    } else {
                        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700');
                    }
                });
            } else if (l.type === 'hangman') {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                // In hangman, userSelection is either the target word (if won) or "FAILED" (if lost)
                isC = state.userSelection === correctText.toUpperCase();
                
                // Disable all remaining keys
                document.querySelectorAll('#hangman-keyboard button').forEach(b => b.disabled = true);
            } else if (l.type === 'matching_pairs') {
                // If it reached checkAnswer, it means they matched everything successfully
                isC = true;
            } else if (l.type === 'spelling_voice') {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                const targetLang = (isSrToEn && l.targetLang_rev) ? l.targetLang_rev : l.targetLang;
                
                let userS = normalize(state.userSelection || "");
                let cText = normalize(correctText);
                
                // Allow exact match, or if they spelled it out then said the word (kucakuca)
                isC = (userS === cText) || (userS === cText + cText) || userS.endsWith(cText);
                
                // Reveal all letters on check
                document.querySelectorAll('.spelling-letter').forEach(span => {
                    span.classList.remove('text-transparent');
                    if (isC) {
                        span.classList.add('text-green-600', 'dark:text-green-400');
                    } else {
                        span.classList.add('text-red-600', 'dark:text-red-400');
                    }
                });
                
                // If wrong, auto-play the correct spelling so user can hear it
                if (!isC) {
                    setTimeout(() => app.playSpelledOut(correctText, targetLang), 500);
                }
            } else if (l.type === 'drag_punctuation') {
                // Compare the placed marks array against the correct marks array
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctMarks = (isSrToEn && l.marks_rev) ? l.marks_rev : l.marks;
                const placed = state.puncState.placed;
                
                isC = placed.length === correctMarks.length && placed.every((p, i) => p === correctMarks[i]);
                
                // Color the slots
                document.querySelectorAll('.punc-slot').forEach((slot, i) => {
                    if (placed[i] === correctMarks[i]) {
                        slot.classList.add('text-green-600', 'bg-green-50', 'dark:text-green-400', 'dark:bg-green-900/30');
                    } else {
                        slot.textContent = correctMarks[i] || '?';
                        slot.classList.add('text-red-600', 'bg-red-50', 'dark:text-red-400', 'dark:bg-red-900/30');
                    }
                });
                
                // Disable the bank
                document.querySelectorAll('#punc-bank button').forEach(b => b.disabled = true);
            } else if (l.type === 'picture_choice' || l.type === 'listening' || l.type === 'dialogue') {
                // These all use selectOption, same pattern as multiple_choice
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                isC = normalize(state.userSelection || "") === normalize(correctText);
                // Lock and highlight all option buttons
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    // Highlight the correct answer green
                    const btnText = btn.innerText.replace(/^💬\s*/, '').trim(); // Strip dialogue emoji prefix
                    if (normalize(btnText) === normalize(correctText)) {
                        btn.classList.remove('opacity-50');
                        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-500', 'dark:text-green-300');
                    } else if (btn.classList.contains('selected') && !isC) {
                        btn.classList.remove('opacity-50');
                        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-500', 'dark:text-red-300');
                    }
                });
            } else {
                const isSrToEn = state.settings.learningDirection === 'sr_to_en';
                const correctText = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
                isC = state.userSelection === correctText;
                // Lock answers for multiple choice
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                    if (btn.innerText === correctText) { // Fixed: compare to correctText to support reverse direction correctly
                        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-700', 'dark:bg-green-900', 'dark:border-green-500', 'dark:text-green-300');
                    } else if (btn.classList.contains('selected') && !isC) {
                        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-700', 'dark:bg-red-900', 'dark:border-red-500', 'dark:text-red-300');
                    }
                });
            }

            state.totalAnswers++;

            if (isC) {
                app.playSound('correct');
                const xpMult = (window.ShopEngine && window.ShopEngine.isDoubleXpActive()) ? 2 : 1;
                const earnedXp = 10 * xpMult;
                state.xp += earnedXp;
                if (!state.currentLessonXpEarned) state.currentLessonXpEarned = 0;
                state.currentLessonXpEarned += earnedXp;
                if (window.LeagueEngine && window.LeagueEngine.recordUserXp) {
                    window.LeagueEngine.recordUserXp(earnedXp);
                }
                
                // Phase 4: SRS Logic - decay mistake
                if (l.wordId && state.mistakeLog[l.wordId]) {
                    state.mistakeLog[l.wordId]--;
                    if (state.mistakeLog[l.wordId] <= 0) delete state.mistakeLog[l.wordId];
                }
                
                // Phase 4: Quest logic
                app.updateQuestProgress('grinder', 10);
                if (l.type === 'speaking') {
                    app.updateQuestProgress('speaker', 1);
                }
                
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
                            if (diffDays === 2 && window.ShopEngine && window.ShopEngine.hasStreakFreeze()) {
                                window.ShopEngine.useStreakFreeze();
                                state.streak += 1;
                                app.showToast('🛡️ Štit za Niz je iskorišćen! Tvoj niz je nastavljen!', 'success');
                            } else {
                                state.streak = 1;
                            }
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
                const skillNode = SKILL_TREE.find(s => s.id === state.currentSkillId);
                const skill = skillNode ? skillNode.name : 'Vokabular';
                if (state.skills[skill] < 100) state.skills[skill] += 2;
            } else {
                app.playSound('incorrect');
                state.hearts--;
                state.lastLessonMistakes = (state.lastLessonMistakes || 0) + 1;
                
                // Phase 4: SRS Logic - log mistake
                if (l.wordId) {
                    state.mistakeLog[l.wordId] = (state.mistakeLog[l.wordId] || 0) + 1;
                }
            }

            const fb = document.getElementById('feedback-area');
            fb.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'dark:bg-green-900/40', 'dark:bg-red-900/40');

            fb.classList.add(isC ? 'bg-green-100' : 'bg-red-100');
            // Add dark mode support to feedback logic handled via classes above directly

            let displayCorrect = l.correct;
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            if (l.type.startsWith('alphabet_') && l.targetLetter) {
                displayCorrect = l.targetLetter.upper;
            } else if (l.type === 'whiteboard') {
                displayCorrect = (isSrToEn && l.target_rev) ? l.target_rev : l.target;
            } else if (isSrToEn && l.correct_rev) {
                displayCorrect = l.correct_rev;
            }

            // Priority 31: Gentle Typo Feedback detection
            let hasTypoWarning = false;
            if (isC && state.userSelection && typeof state.userSelection === 'string' && displayCorrect) {
                const uRaw = state.userSelection.trim();
                const cRaw = displayCorrect.trim();
                if (uRaw.toLowerCase() !== cRaw.toLowerCase()) {
                    hasTypoWarning = true;
                }
            }

            // Activate smart grammar word inspection now that the user has submitted their answer!
            if (typeof GrammarEngine !== 'undefined' && GrammarEngine.setAnswered) {
                GrammarEngine.setAnswered(true);
            }

            if (isC) {
                if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('correct');
                if (hasTypoWarning) {
                    document.getElementById('feedback-title').innerText = "Tačno sa greškom!";
                    document.getElementById('feedback-title').className = "font-black text-sm text-amber-600 dark:text-amber-400";
                    document.getElementById('feedback-msg').innerHTML = `⚠️ Obrati pažnju: pravilno se piše "${displayCorrect}"<p class="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-normal">💡 Dodirni reči gore u pitanju za gramatičko objašnjenje</p>`;
                    document.getElementById('feedback-msg').className = "text-[11px] font-bold text-amber-700 dark:text-amber-300";
                    document.getElementById('feedback-icon').innerText = "⚠️";
                    app.showToast(`Pazi na pravopis: ${displayCorrect}`, "warning");
                } else {
                    document.getElementById('feedback-title').innerText = "Bravo!";
                    document.getElementById('feedback-title').className = "font-black text-sm text-green-700 dark:text-green-400";
                    document.getElementById('feedback-msg').innerHTML = `+10 XP <span class="text-slate-500 dark:text-slate-400 font-normal">("${displayCorrect}")</span><p class="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-normal">💡 Dodirni reči gore u pitanju za gramatičko objašnjenje</p>`;
                    document.getElementById('feedback-msg').className = "text-[11px] font-bold text-green-600 dark:text-green-300";
                    document.getElementById('feedback-icon').innerText = "✅";
                }
            } else {
                if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('wrong');
                document.getElementById('feedback-title').innerText = "Netačno";
                document.getElementById('feedback-title').className = "font-black text-sm text-red-700 dark:text-red-400";
                document.getElementById('feedback-msg').innerHTML = `Tačno: <span class="font-black text-slate-800 dark:text-white">${displayCorrect}</span><p class="text-[10px] text-slate-400 dark:text-slate-400 mt-1 font-normal">💡 Dodirni reči gore u pitanju za gramatičko objašnjenje</p>`;
                document.getElementById('feedback-msg').className = "text-[11px] font-bold text-red-600 dark:text-red-300";
                document.getElementById('feedback-icon').innerText = "❌";
            }

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
        if (typeof GrammarEngine !== 'undefined' && GrammarEngine.hideTooltip) {
            GrammarEngine.hideTooltip();
        }
        state.currentLessonIndex++;
        app.saveStats(); // Save immediately
        if (state.currentLessonIndex < ACTIVE_LESSON.length) {
            app.renderQuestion();
        } else {
            app.finishLesson();
        }
    },
    finishLesson: () => {
        if (typeof GrammarEngine !== 'undefined' && GrammarEngine.hideTooltip) {
            GrammarEngine.hideTooltip();
        }
        state.totalLessons++;
        const today = new Date().toISOString().split('T')[0];
        if (!state.history[today]) state.history[today] = { xp: 0, lessons: 0 };
        state.history[today].lessons += 1;

        // Apply XP Boost if available
        if (state.inventory && state.inventory.xpBoosts > 0 && state.currentLessonXpEarned > 0) {
            state.inventory.xpBoosts--;
            state.xp += state.currentLessonXpEarned;
            state.dailyXP += state.currentLessonXpEarned;
            state.history[today].xp += state.currentLessonXpEarned;
            setTimeout(() => {
                app.showToast(`🚀 Double XP Boost Used! +${state.currentLessonXpEarned} Bonus XP!`, 'success');
            }, 1500); // Show after standard toasts
        }
        state.currentLessonXpEarned = 0;

        if (!state.lastLessonMistakes) {
            state.lastLessonPerfect = true;
            app.updateQuestProgress('perfect_scholar', 1); // Phase 4
        } else {
            state.lastLessonPerfect = false;
        }

        if (state.currentLevelKey === 'PRACTICE') {
            app.updateQuestProgress('reviewer', 1); // Phase 4
        }

        // Record skill tree progress
        if (state.currentSkillId && state.currentLevelKey !== 'PRACTICE') {
            const result = SkillTreeEngine.recordLessonComplete(state.currentSkillId, state.lastLessonPerfect);
            if (result && result.lessonsInCrown === 0 && result.crown > 0) {
                // Crown leveled up!
                const skillNode = SKILL_TREE.find(s => s.id === state.currentSkillId);
                app.showToast(`👑 Crown Level Up! ${skillNode ? skillNode.name : ''} → Level ${result.crown}`, 'success');
                setTimeout(() => app.fireConfetti(), 300);
                
                // Phase 4: Badges for mastering a skill (Crown 5)
                if (result.crown === 5) {
                    const badgeId = `${state.currentSkillId}_master`;
                    if (!state.badges.find(b => b.id === badgeId)) {
                        state.badges.push({
                            id: badgeId,
                            name: `${skillNode.name} Master`,
                            icon: skillNode.emoji,
                            date: new Date().toISOString()
                        });
                        setTimeout(() => app.showToast(`🏅 Badge Unlocked: ${skillNode.name} Master!`, 'success'), 2000);
                    }
                }
            }
        }

        app.checkAchievements();
        app.saveStats();
        
        if (state.user && state.user.isGuest) {
            app.showToast(t('toast_guest_finish'), 'success');
        }
        
        // Priority 32: Award Gems for Lesson Completion (+2 gems, +1 bonus for perfect lesson)
        if (window.LeagueEngine) {
            const lessonGems = state.lastLessonPerfect ? 3 : 2;
            window.LeagueEngine.addGems(lessonGems, state.lastLessonPerfect ? 'Savršena lekcija' : 'Završena lekcija');
            window.LeagueEngine.checkEarlyBirdOnLessonComplete();
            window.LeagueEngine.updateHeaderBoostUI();
        }
        
        if (state.currentSkillId === 'mistakes') {
            app.navigate('mistakes');
        } else {
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
    showAlphabetModal: () => {
        const modal = document.getElementById('alphabet-selection-modal');
        const content = document.getElementById('alphabet-modal-content');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('translate-y-full');
        });
    },
    closeAlphabetModal: () => {
        const modal = document.getElementById('alphabet-selection-modal');
        const content = document.getElementById('alphabet-modal-content');
        
        modal.classList.add('opacity-0');
        content.classList.add('translate-y-full');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    },
    startAlphabetMode: async (modeKey) => {
        app.closeAlphabetModal();
        // Fallback to start the normal 'alphabet' lesson for now. 
        // We will build the dedicated cursive logic and data next.
        // But we store the chosen mode to apply the specific fonts and filtering.
        state.alphabetMode = modeKey; 
        
        try {
            ACTIVE_LESSON = await window.QuestionEngine.generateAlphabetLesson(modeKey, 10);
            if (!ACTIVE_LESSON || ACTIVE_LESSON.length === 0) {
                app.showToast('Nema dovoljno reči u bazi za ovu lekciju.', 'error');
                return;
            }
            state.currentLevelKey = 'alphabet';
            state.currentSkillId = 'alphabet';
            state.currentLessonIndex = 0;
            state.lastLessonMistakes = 0;
            app.saveStats();
            app.navigate('lesson');
            app.renderQuestion();
        } catch (e) {
            console.error(e);
            app.showToast('Greška!', 'error');
        }
    },
    showGuide: (skillId) => {
        const skill = SKILL_TREE.find(s => s.id === skillId);
        if (!skill) return;
        
        // Pick the correct guide based on learning direction
        const dir = state.settings.learningDirection || 'en_to_sr';
        const guideContent = (dir === 'sr_to_en' && skill.guideHtmlSr) ? skill.guideHtmlSr : skill.guideHtml;
        if (!guideContent) return;

        const modal = document.getElementById('guide-modal');
        document.getElementById('guide-modal-title').innerText = `\u{1F4A1} ${skill.name} / ${skill.nameEn}`;
        document.getElementById('guide-modal-content').innerHTML = guideContent;
        
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        // Small delay to allow display:flex to apply before transition
        setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('translate-y-full');
        }, 10);
    },
    closeGuide: () => {
        const modal = document.getElementById('guide-modal');
        modal.classList.add('opacity-0');
        modal.querySelector('div').classList.add('translate-y-full');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.style.display = '';
        }, 300);
    },
    showGoalModal: () => {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('celebrate');
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
        
        // Update header XP boost badge
        const headerBoostContainer = document.getElementById('header-xp-boost-container');
        const headerBoostCount = document.getElementById('header-xp-boost-count');
        if (headerBoostContainer && headerBoostCount) {
            headerBoostCount.innerText = (state.inventory && state.inventory.xpBoosts) || 0;
            headerBoostContainer.classList.remove('hidden'); // Always visible
            // Add or remove glow based on > 0
            if (state.inventory && state.inventory.xpBoosts > 0) {
                headerBoostContainer.classList.add('arcade-glow');
            } else {
                headerBoostContainer.classList.remove('arcade-glow');
            }
        }
        
        // Update arcade view XP boost badge if it exists
        const arcadeBoostCount = document.getElementById('xp-boost-count');
        if (arcadeBoostCount && state.inventory) {
            arcadeBoostCount.innerText = state.inventory.xpBoosts || 0;
            arcadeBoostCount.parentElement.classList.remove('hidden'); // Always visible
        }
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
        if (state.streak > state.maxStreak) state.maxStreak = state.streak; 
        localStorage.setItem('serbolingo_stats_' + (state.user ? state.user.name : 'guest'), JSON.stringify(state)); 
    },
    toastQueue: [],
    isToastPlaying: false,
    showToast: (msg, type = 'info') => {
        app.toastQueue.push({msg, type});
        if (!app.isToastPlaying) {
            app.playNextToast();
        }
    },
    playNextToast: () => {
        if (app.toastQueue.length === 0) {
            app.isToastPlaying = false;
            return;
        }
        app.isToastPlaying = true;
        const {msg, type} = app.toastQueue.shift();
        
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        
        let bgColor = 'bg-blue-500';
        let icon = 'ℹ️';
        if (type === 'success') { bgColor = 'bg-green-500'; icon = '✅'; }
        if (type === 'error') { bgColor = 'bg-red-500'; icon = '❌'; }
        
        // Highly compact styling changed to wrap text vertically and fit perfectly between header elements
        toast.className = `${bgColor} text-white px-2 py-1.5 rounded-lg shadow-md font-bold text-[10px] flex items-center justify-center gap-1 transform transition-all duration-300 translate-y-[-10px] opacity-0 pointer-events-auto w-[140px] text-center leading-tight break-words`;
        toast.innerHTML = `<span>${icon}</span> <span>${msg}</span>`;
        
        container.innerHTML = '';
        container.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.remove('translate-y-[-10px]', 'opacity-0');
            });
        });
        
        // Remove after 3.5 seconds, then trigger next
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-[-10px]');
            setTimeout(() => {
                if (toast.parentNode) toast.remove();
                app.playNextToast();
            }, 300);
        }, 3500);
    },
    // ─── FUZZY SEARCH & TYPO TOLERANCE ENGINE (Priority 1 & 31) ───
    _levenshtein: (a, b) => {
        if (a === b) return 0;
        if (!a || !a.length) return b ? b.length : 0;
        if (!b || !b.length) return a.length;
        let v0 = new Int16Array(b.length + 1);
        let v1 = new Int16Array(b.length + 1);
        for (let i = 0; i <= b.length; i++) v0[i] = i;
        for (let i = 0; i < a.length; i++) {
            v1[0] = i + 1;
            const aCode = a.charCodeAt(i);
            for (let j = 0; j < b.length; j++) {
                const cost = aCode === b.charCodeAt(j) ? 0 : 1;
                v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
            }
            for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
        }
        return v1[b.length];
    },

    _phoneticNormalize: (str) => {
        if (!str) return "";
        let s = str.toLowerCase();
        s = s.replace(/y/g, 'j');
        s = s.replace(/w/g, 'v');
        s = s.replace(/x/g, 'ks');
        s = s.replace(/q/g, 'k');
        s = s.replace(/sh/g, 's').replace(/ch/g, 'c').replace(/zh/g, 'z').replace(/dj/g, 'dj');
        s = s.replace(/č/g, 'c').replace(/ć/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'dj');
        return s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
    },

    _fuzzySearchDictionary: (query) => {
        const qRaw = query.trim().toLowerCase();
        const qPhon = app._phoneticNormalize(qRaw);
        if (!qRaw) return { results: [], suggestion: null, isFuzzy: false };

        // 1. Tier 1: Exact Substring matches
        const exactMatches = [];
        for (let i = 0; i < DICTIONARY.length; i++) {
            const entry = DICTIONARY[i];
            const enL = entry.en.toLowerCase();
            const latL = entry.sr_lat.toLowerCase();
            const cyrL = entry.sr_cyr.toLowerCase();
            if (enL.includes(qRaw) || latL.includes(qRaw) || cyrL.includes(qRaw)) {
                exactMatches.push(entry);
                if (exactMatches.length >= 10) break;
            }
        }

        if (exactMatches.length > 0) {
            return { results: exactMatches, suggestion: null, isFuzzy: false };
        }

        // 2. Tier 2: Phonetic normalized matches (e.g. 'yabuka' -> matches 'jabuka')
        const phoneticMatches = [];
        let bestSuggestion = null;

        for (let i = 0; i < DICTIONARY.length; i++) {
            const entry = DICTIONARY[i];
            const enPhon = app._phoneticNormalize(entry.en);
            const latPhon = app._phoneticNormalize(entry.sr_lat);
            if (enPhon.includes(qPhon) || latPhon.includes(qPhon)) {
                phoneticMatches.push(entry);
                if (!bestSuggestion) {
                    bestSuggestion = latPhon.includes(qPhon) ? entry.sr_lat : entry.en;
                }
                if (phoneticMatches.length >= 10) break;
            }
        }

        if (phoneticMatches.length > 0) {
            return { results: phoneticMatches, suggestion: bestSuggestion, isFuzzy: true };
        }

        // 3. Tier 3: Levenshtein distance matching (typo tolerance)
        const scored = [];
        const maxDist = qRaw.length <= 4 ? 1 : 2;

        for (let i = 0; i < DICTIONARY.length; i++) {
            const entry = DICTIONARY[i];
            const enWords = entry.en.toLowerCase().split(/\s+/);
            const latWords = entry.sr_lat.toLowerCase().split(/\s+/);
            
            let minD = 99;
            let matchedWord = null;

            for (const w of latWords) {
                const d = app._levenshtein(qPhon, app._phoneticNormalize(w));
                if (d < minD) { minD = d; matchedWord = entry.sr_lat; }
            }
            for (const w of enWords) {
                const d = app._levenshtein(qRaw, w);
                if (d < minD) { minD = d; matchedWord = entry.en; }
            }

            if (minD <= maxDist) {
                scored.push({ entry, dist: minD, matchedWord });
            }
        }

        if (scored.length > 0) {
            scored.sort((a, b) => a.dist - b.dist);
            const results = scored.slice(0, 10).map(s => s.entry);
            const suggestion = scored[0].matchedWord;
            return { results, suggestion, isFuzzy: true };
        }

        return { results: [], suggestion: null, isFuzzy: false };
    },

    // ─── OMNI-BAR SEARCH ENGINE ───
    handleSearch: (query) => {
        const clearBtn = document.getElementById('omni-clear');
        if (clearBtn) clearBtn.classList.toggle('hidden', !query);

        clearTimeout(_searchDebounceTimer);
        if (!query || query.trim().length < 1) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }
        // 300ms debounce — UI Freeze Prevention (Section 1)
        _searchDebounceTimer = setTimeout(() => {
            const searchData = app._fuzzySearchDictionary(query);
            app.renderSearchResults(searchData.results, query.trim(), searchData.suggestion, searchData.isFuzzy);
        }, 300);
    },
    setSearchQuery: (word) => {
        const input = document.getElementById('omni-search');
        if (input) {
            input.value = word;
            app.handleSearch(word);
        }
    },
    renderSearchResults: (results, query, suggestion, isFuzzy) => {
        const container = document.getElementById('search-results');
        if (!results.length) {
            container.innerHTML = `
                <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-5 text-center shadow-lg">
                    <span class="text-3xl block mb-2">🤷</span>
                    <p class="font-bold text-slate-500 dark:text-slate-400 text-xs">${t('omni_no_results')} "${query}"</p>
                </div>`;
            return;
        }

        let suggestionHtml = '';
        if (isFuzzy && suggestion) {
            const safeSuggestion = suggestion.replace(/'/g, "\\'");
            suggestionHtml = `
            <div class="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl p-3.5 mb-3 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2.5">
                    <span class="text-xl">💡</span>
                    <div>
                        <p class="text-xs font-bold text-amber-900 dark:text-amber-200">
                            Da li ste mislili: <button onclick="app.setSearchQuery('${safeSuggestion}')" class="font-black underline text-amber-600 dark:text-amber-400 hover:text-amber-500">${suggestion}</button>?
                        </p>
                        <p class="text-[10px] text-amber-700 dark:text-amber-400">
                            Prikazujemo rezultate za slične reči (ispravljeno sa "${query}").
                        </p>
                    </div>
                </div>
            </div>`;
        }

        container.innerHTML = suggestionHtml + results.map(entry => {
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
            <div class="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-4 shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer active:scale-[0.98] mb-2" onclick="app.playSound('correct')">
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
                    <button onclick="event.stopPropagation(); app.toggleFlashcard('${entry.id}')" class="w-10 h-10 flex items-center justify-center rounded-xl transition-all ${state.mistakeLog[entry.id] ? 'text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}">
                        <span class="text-xl">★</span>
                    </button>
                </div>
            </div>`;
        }).join('');
    },
    clearSearch: () => {
        document.getElementById('omni-search').value = '';
        document.getElementById('search-results').innerHTML = '';
        document.getElementById('omni-clear').classList.add('hidden');
    },
    toggleFlashcard: (id) => {
        if (!state.mistakeLog) state.mistakeLog = {};
        if (state.mistakeLog[id]) {
            delete state.mistakeLog[id];
            app.showToast("Uklonjeno iz rečnika / Removed from flashcards", "info");
        } else {
            state.mistakeLog[id] = 5; // Give it high weight so it appears in Practice mode
            app.showToast("Dodato u rečnik / Added to flashcards!", "success");
        }
        app.saveStats();
        // Re-render search results to update star color
        const query = document.getElementById('omni-search').value;
        if (query) app.handleSearch(query);
    },
    editProfileName: () => {
        if (!state.user) return;
        const newName = prompt("Enter your new display name / Unesite novo ime:", state.user.name === "GUEST_USER" ? "Gost" : state.user.name);
        if (newName && newName.trim() !== "") {
            state.user.name = newName.trim();
            localStorage.setItem('serbolingo_stats_' + (state.user ? state.user.name : 'guest'), JSON.stringify(state)); 
            
            // If they are in the auth object, update it so it survives reloads
            const authStr = localStorage.getItem('serbolingo_auth');
            if (authStr) {
                try {
                    const authObj = JSON.parse(authStr);
                    authObj.name = state.user.name;
                    localStorage.setItem('serbolingo_auth', JSON.stringify(authObj));
                } catch (e) {}
            }
            app.updateProfileUI();
            app.showToast("Name updated successfully!", "success");
        }
    },
    logout: () => { 
        localStorage.removeItem('serbolingo_auth');
        // Do not clear serbolingo_stats so it remembers user progress
        sessionStorage.clear(); 
        location.reload(); 
    },
    exportSaveData: () => {
        try {
            const username = state.user ? state.user.name : 'guest';
            const shopData = window.ShopEngine ? window.ShopEngine.getShopData() : {};
            const ghosts = window.GhostEngine ? window.GhostEngine.getRoster() : [];

            const backup = {
                version: '3.0',
                app: 'SerboLingo',
                exportedAt: new Date().toISOString(),
                username: username,
                state: state,
                shop: shopData,
                ghosts: ghosts
            };

            const jsonStr = JSON.stringify(backup, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const dlAnchor = document.createElement('a');
            const dateStr = new Date().toISOString().split('T')[0];
            dlAnchor.href = url;
            dlAnchor.download = `serbolingo-backup-${username}-${dateStr}.json`;
            document.body.appendChild(dlAnchor);
            dlAnchor.click();
            document.body.removeChild(dlAnchor);
            URL.revokeObjectURL(url);

            app.showToast('💾 Rezervna kopija je uspešno preuzeta!', 'success');
        } catch (err) {
            console.error('Export failed:', err);
            app.showToast('Greška prilikom izvoza podataka.', 'error');
        }
    },
    importSaveData: (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (!parsed.state || !parsed.app) {
                    throw new Error('Nevažeći format SerboLingo fajla.');
                }

                const u = parsed.username || 'Igrač';
                if (!confirm(`Da li želiš da vratiš podatke za profil "${u}"? Trenutni nesačuvani podaci biće zamenjeni.`)) {
                    return;
                }

                // Restore state
                Object.assign(state, parsed.state);

                // Restore shop if present
                if (parsed.shop && window.ShopEngine) {
                    window.ShopEngine.saveShopData(parsed.shop);
                }

                // Restore ghosts if present
                if (parsed.ghosts && window.GhostEngine) {
                    window.GhostEngine.saveRoster(parsed.ghosts);
                }

                // Save restored state to localStorage
                app.saveState();
                app.applyDarkMode();
                app.applyTextScale();
                app.setLearningDirection(state.settings?.learningDirection || 'sr_to_en');
                app.updateProfileUI();

                app.showToast('🎉 Podaci su uspešno vraćeni!', 'success');
                setTimeout(() => location.reload(), 1200);
            } catch (err) {
                console.error('Import error:', err);
                app.showToast('Nevažeći rezervni fajl: ' + err.message, 'error');
            }
        };
        reader.readAsText(file);
    },
    endLesson: () => { 
        if (typeof GrammarEngine !== 'undefined' && GrammarEngine.hideTooltip) {
            GrammarEngine.hideTooltip();
        }
        if (confirm(t('lesson_quit'))) app.navigate(state.currentSkillId === 'mistakes' ? 'mistakes' : 'home'); 
    },
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
        if (window.PlacementEngine && typeof window.PlacementEngine.renderHomeBanner === 'function') {
            window.PlacementEngine.renderHomeBanner();
        }
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
        
        // Refresh placement test banner
        if (window.PlacementEngine && typeof window.PlacementEngine.renderHomeBanner === 'function') {
            window.PlacementEngine.renderHomeBanner();
        }
        
        // Refresh roleplay list if we are currently looking at it
        if (window.RoleplayEngine && typeof window.RoleplayEngine.renderScenarioList === 'function') {
            window.RoleplayEngine.renderScenarioList();
        }
        
        // Refresh Explore Hub to load the correct library
        if (window.ExploreHub && typeof window.ExploreHub.refresh === 'function') {
            window.ExploreHub.refresh();
        }
    },
    // ─── HARDCORE IMMERSION ENGINE (Priority 34) ───
    toggleHardcoreImmersion: () => {
        state.settings.hardcoreImmersion = !state.settings.hardcoreImmersion;
        app.saveStats();
        app.applyLanguage();
        app.updateImmersionUI();
        app.updateProfileUI();
        const isCyr = state.settings.appLanguage === 'sr_cyr';
        if (state.settings.hardcoreImmersion) {
            const msg = isCyr ? '🇷🇸 Имерзија активна! 100% српски интерфејс.' : '🇷🇸 Imerzija aktivna! 100% srpski interfejs.';
            app.showToast(msg, 'success');
        } else {
            const msg = isCyr ? 'Имерзија искључена.' : 'Hardcore Imerzija isključena.';
            app.showToast(msg, 'info');
        }
    },
    updateImmersionUI: () => {
        const isImmersion = !!(state.settings && state.settings.hardcoreImmersion);
        const btn = document.getElementById('btn-immersion');
        const knob = document.getElementById('knob-immersion');
        if (btn && knob) {
            if (isImmersion) {
                btn.classList.remove('bg-slate-200', 'dark:bg-slate-700');
                btn.classList.add('bg-red-500');
                knob.classList.add('translate-x-5');
            } else {
                btn.classList.remove('bg-red-500');
                btn.classList.add('bg-slate-200', 'dark:bg-slate-700');
                knob.classList.remove('translate-x-5');
            }
        }
        const badge = document.getElementById('header-immersion-badge');
        if (badge) {
            if (isImmersion) {
                badge.classList.remove('hidden');
                badge.classList.add('inline-flex');
            } else {
                badge.classList.add('hidden');
                badge.classList.remove('inline-flex');
            }
        }
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
        const l = ACTIVE_LESSON[state.currentLessonIndex];
        const expText = document.getElementById('explanation-text');
        
        let text = null;
        if (l.explanation) {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            text = (isSrToEn && l.explanation_rev) ? l.explanation_rev : l.explanation;
        } else if (l.guide) {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const guideObj = (isSrToEn && l.guide_rev) ? l.guide_rev : l.guide;
            if (guideObj[state.userSelection]) {
                text = guideObj[state.userSelection];
                if (isSrToEn) text = text.replace(/ means /g, ' znači ');
                else text = text.replace(/ znači /g, ' means ');
            }
        }
        
        if (!text && (l.type.startsWith('alphabet_') || l.type === 'whiteboard')) {
            const isSrToEn = state.settings.learningDirection === 'sr_to_en';
            const tgt = l.targetLetter || l;
            if (tgt.word && tgt.word.en) {
                // it's a standard word object
                text = isSrToEn 
                    ? `Slovo predstavlja reč "${tgt.word.sr}" (${tgt.word.en}).` 
                    : `The letter stands for the word "${tgt.word.sr}" (${tgt.word.en}).`;
            } else if (tgt.upper) {
                // it's from ALPHABET_DATA directly
                text = isSrToEn
                    ? `Ovo slovo predstavlja reč "${tgt.word}" (${tgt.en}).`
                    : `This letter stands for the word "${tgt.word}" (${tgt.en}).`;
            } else if (l.audioWord) {
                text = isSrToEn
                    ? `Tražena reč je bila "${l.audioWord}".`
                    : `The required word was "${l.audioWord}".`;
            }
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
            const l = ACTIVE_LESSON[state.currentLessonIndex];
            const isEnToSr = state.settings.learningDirection === 'en_to_sr';
            const lang = isEnToSr ? "English" : "Serbian";
            
            // Reconstruct the exact question text the user saw
            let questionText = (state.settings.learningDirection === 'sr_to_en' && l.q_rev) ? l.q_rev : l.q;
            let correctText = (state.settings.learningDirection === 'sr_to_en' && l.correct_rev) ? l.correct_rev : l.correct;
            
            if (l.type && l.type.startsWith('alphabet_') && l.targetLetter) {
                correctText = l.targetLetter.upper;
                if (!questionText) questionText = l.targetLetter.word;
            } else if (l.type === 'whiteboard') {
                correctText = (state.settings.learningDirection === 'sr_to_en' && l.target_rev) ? l.target_rev : l.target;
            }
            
            let promptText = "";
            if (l.type === 'multiple_choice' || !l.type) {
                const optionsText = (state.settings.learningDirection === 'sr_to_en' && l.options_rev) ? l.options_rev.join(', ') : (l.options ? l.options.join(', ') : "");
                promptText = `Explain in ${lang} why '${state.userSelection}' is incorrect for the question '${questionText}' (correct answer is '${correctText}'). Also, briefly explain all 3 options: [${optionsText}].`;
            } else {
                promptText = `Explain in ${lang} why '${state.userSelection}' is incorrect for the question '${questionText}' (correct answer is '${correctText}'). Briefly explain why the correct answer is what it is.`;
            }

            promptText += ` 
CRITICAL CONSTRAINTS:
1. Be extremely concise and punchy. Do NOT write a long essay or intro/outro paragraphs. 
2. Use exactly one short bullet point per option to explain what it means.
3. The language is SERBIAN (srpski). NEVER use the word 'Croatian' or 'hrvatski'. Always say 'Serbian' or 'srpski'.`;

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
    },

};
window.app = app;
window.appState = state;
window.onload = app.init;
