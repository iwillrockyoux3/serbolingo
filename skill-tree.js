// [SHIELD_DAEMON: VALIDATED]
// Skill Tree Data Structure & Engine for SerboLingo
// Phase 3: Duolingo-style progression system

const SKILL_TREE = [
    // --- TIER 1: FOUNDATION (all unlocked from start, paired layout) ---
    { id: 'alphabet', name: 'Azbuka', nameEn: 'Alphabet', emoji: '🔤', category: 'alphabet', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Serbian can be written in two scripts: <b>Cyrillic</b> (ćirilica) and <b>Latin</b> (latinica). They map perfectly 1-to-1.</p><p>Some unique letters: <b>Č, Ć, Ž, Š, Đ, Dž, Lj, Nj</b>.</p><p>In Serbian, you read it exactly how you write it!</p></div>` },
    { id: 'numbers', name: 'Brojevi', nameEn: 'Numbers', emoji: '🔢', category: 'numbers', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Numbers 1-10 are the foundation.</p><ul class="list-disc pl-5"><li>1: jedan</li><li>2: dva</li><li>3: tri</li></ul><p>Notice that numbers change form depending on gender, especially <b>jedan</b> (jedan/jedna/jedno) and <b>dva</b> (dva/dve).</p></div>` },
    { id: 'colors', name: 'Boje', nameEn: 'Colors', emoji: '🎨', category: 'colors', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Colors are adjectives, meaning they must match the gender of the noun they describe!</p><p>Example for 'crven' (red):</p><ul class="list-disc pl-5"><li>crven auto (masculine)</li><li>crven<b>a</b> kuća (feminine)</li><li>crven<b>o</b> nebo (neuter)</li></ul></div>` },
    { id: 'basics', name: 'Osnove', nameEn: 'Basics', emoji: '🌱', category: 'basics', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Welcome to Serbian! The verb <b>to be (biti)</b> is very important:</p><ul class="list-disc pl-5"><li>Ja sam (I am)</li><li>Ti si (You are)</li><li>On/Ona je (He/She is)</li></ul><p>Serbian doesn't use articles (a/an/the). "A cat" and "the cat" are both just <b>mačka</b>.</p></div>` },
    { id: 'phrases', name: 'Fraze', nameEn: 'Phrases', emoji: '💬', category: 'phrases', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Essential survival phrases!</p><ul class="list-disc pl-5"><li><b>Gde je...?</b> (Where is...?)</li><li><b>Koliko košta?</b> (How much does it cost?)</li></ul></div>` },
    { id: 'verbs', name: 'Glagoli', nameEn: 'Verbs', emoji: '🏃', category: 'verbs', prereqs: [], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Most verbs end in <b>-ti</b> or <b>-ći</b> in their infinitive form (e.g., raditi, jesti).</p><p>To make them present tense, drop the ending and add:</p><ul class="list-disc pl-5"><li>Ja radi<b>m</b></li><li>Ti radi<b>š</b></li><li>On radi</li></ul></div>` },
    { id: 'pronouns', name: 'Zamenice', nameEn: 'Pronouns', emoji: '👈', category: 'pronouns', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Pronouns replace nouns. They are essential for making sentences!</p><ul class="list-disc pl-5"><li><b>Ja</b> (I), <b>Ti</b> (You)</li><li><b>On/Ona/Ono</b> (He/She/It)</li><li><b>Mi</b> (We), <b>Vi</b> (You all), <b>Oni</b> (They)</li></ul></div>` },
    { id: 'adjectives', name: 'Pridevi', nameEn: 'Adjectives', emoji: '✨', category: 'adjectives', prereqs: [], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Adjectives describe nouns and MUST match their gender and case!</p><ul class="list-disc pl-5"><li>Dobar dan (Good day - Masc)</li><li>Dobra noć (Good night - Fem)</li><li>Dobro jutro (Good morning - Neut)</li></ul></div>` },
    { id: 'gender', name: 'Gramatika: Rod', nameEn: 'Grammar: Gender', emoji: '⚖️', category: 'gender', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Masculine and feminine are not separate kinds of words. They are <b>grammatical categories of gender</b>.</p><p>For nouns, gender is a permanent property (e.g. prozor is masculine, žena is feminine). For adjectives, pronouns, and verbs, the gender changes to match the noun!</p><p>Example: <i>Taj srećan dečak</i> (That happy boy - Masc) vs <i>Ta srećna devojčica</i> (That happy girl - Fem).</p></div>` },

    // --- TIER 2: DAILY LIFE ---
    { id: 'food', name: 'Hrana', nameEn: 'Food & Drink', emoji: '🍽️', category: 'food', prereqs: ['alphabet', 'numbers', 'colors', 'basics', 'phrases', 'verbs', 'pronouns', 'adjectives', 'gender'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>When ordering food, use <b>"Molim vas..."</b> (Please...).</p><p>You can say <b>"Ja želim..."</b> (I want...).</p><p>Example: <i>Molim vas, jednu kafu!</i> (One coffee, please! - uses accusative case).</p></div>` },
    { id: 'cases_intro', name: 'Padeži (Uvod)', nameEn: 'Grammar: Cases (Intro)', emoji: '📐', category: 'cases_intro', prereqs: ['food'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Serbian has <b>7 grammatical cases</b> (padeži). They change the endings of nouns, adjectives, and pronouns depending on their role in a sentence.</p><ul class="list-disc pl-5"><li><b>Nominativ</b> (Who/What?) - Dečak čita. (The boy reads.)</li><li><b>Genitiv</b> (Whose/Of what?) - Knjiga dečak<b>a</b>. (The boy's book.)</li><li><b>Dativ</b> (To whom?) - Dajem dečak<b>u</b>. (I give to the boy.)</li><li><b>Akuzativ</b> (Whom/What?) - Vidim dečak<b>a</b>. (I see the boy.)</li><li><b>Vokativ</b> (Hey!) - Dečač<b>e</b>! (Hey boy!)</li><li><b>Instrumental</b> (With what?) - Sa dečak<b>om</b>. (With the boy.)</li><li><b>Lokativ</b> (About/In) - O dečak<b>u</b>. (About the boy.)</li></ul><p>Don't panic! You will learn them gradually through practice.</p></div>` },
    { id: 'family', name: 'Porodica', nameEn: 'Family', emoji: '👪', category: 'family', prereqs: ['cases_intro'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Serbian family vocabulary is very specific.</p><p>For example, there are different words for uncle depending on the side of the family:</p><ul class="list-disc pl-5"><li><b>Stric</b> (father's brother)</li><li><b>Ujak</b> (mother's brother)</li><li><b>Teča</b> (aunt's husband)</li></ul></div>` },
    { id: 'household', name: 'Kuća', nameEn: 'Household', emoji: '🏠', category: 'household', prereqs: ['family'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Objects around the house. Pay attention to genders!</p><ul class="list-disc pl-5"><li>Sto (table) - Masculine</li><li>Stolica (chair) - Feminine</li><li>Kupatilo (bathroom) - Neuter</li></ul></div>` },
    { id: 'time', name: 'Vreme', nameEn: 'Time', emoji: '🕒', category: 'time', prereqs: ['household'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Time concepts. To ask the time, say: <b>Koliko je sati?</b></p></div>` },
    { id: 'days', name: 'Dani', nameEn: 'Days', emoji: '📅', category: 'days', prereqs: ['time'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Days of the week. Most end in -ak or -a.</p><ul class="list-disc pl-5"><li>Ponedeljak (Monday)</li><li>Sreda (Wednesday)</li><li>Petak (Friday)</li></ul></div>` },
    { id: 'months', name: 'Meseci', nameEn: 'Months', emoji: '🗓️', category: 'months', prereqs: ['days'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Months of the year are very similar to English!</p><p>Januar, Februar, Mart, April...</p></div>` },

    // --- TIER 3: SURVIVAL & SELF ---
    { id: 'directions', name: 'Pravci', nameEn: 'Directions', emoji: '🗺️', category: 'directions', prereqs: ['months'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Navigating the city.</p><ul class="list-disc pl-5"><li>Levo (Left)</li><li>Desno (Right)</li><li>Pravo (Straight)</li></ul></div>` },
    { id: 'prepositions', name: 'Predlozi', nameEn: 'Prepositions', emoji: '📍', category: 'prepositions', prereqs: ['directions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Prepositions tell you <b>where</b> and <b>when</b> things are. They always require a specific case!</p><ul class="list-disc pl-5"><li><b>u</b> (in) + Lokativ: u kući (in the house)</li><li><b>na</b> (on) + Lokativ: na stolu (on the table)</li><li><b>iz</b> (from) + Genitiv: iz škole (from school)</li><li><b>sa</b> (with) + Instrumental: sa bratom (with brother)</li><li><b>bez</b> (without) + Genitiv: bez vode (without water)</li></ul></div>` },
    { id: 'weather', name: 'Vreme', nameEn: 'Weather', emoji: '🌦️', category: 'weather', prereqs: ['prepositions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>The word <b>Vreme</b> means both 'Time' and 'Weather' in Serbian!</p><p>Example: <i>Kakvo je vreme danas?</i> (What is the weather like today?)</p></div>` },
    { id: 'body', name: 'Telo', nameEn: 'Body', emoji: '🗣️', category: 'body', prereqs: ['weather'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Parts of the human body.</p><p>If something hurts, you can say: <b>Boli me [body part]</b>.</p><p>Example: <i>Boli me glava</i> (My head hurts).</p></div>` },
    { id: 'health', name: 'Zdravlje', nameEn: 'Health', emoji: '🏥', category: 'health', prereqs: ['body'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Medical vocabulary. Essential for emergencies!</p><p><b>Hitna pomoć</b> means ambulance (literally: fast help).</p></div>` },
    { id: 'emotions', name: 'Osećanja', nameEn: 'Emotions', emoji: '😊', category: 'emotions', prereqs: ['health'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>To express feelings, you often use the verb <b>biti</b> (to be) + the adjective.</p><p>Example: <i>Ja sam srećan</i> (I am happy).</p></div>` },
    { id: 'conjunctions', name: 'Veznici', nameEn: 'Conjunctions', emoji: '🔗', category: 'conjunctions', prereqs: ['emotions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Conjunctions connect words and sentences together!</p><ul class="list-disc pl-5"><li><b>i</b> (and) - Ja i ti. (Me and you.)</li><li><b>ali</b> (but) - Lep ali skup. (Beautiful but expensive.)</li><li><b>ili</b> (or) - Kafa ili čaj? (Coffee or tea?)</li><li><b>jer</b> (because) - Idem jer moram. (I'm going because I must.)</li><li><b>da</b> (that/to) - Želim da jedem. (I want to eat.)</li><li><b>ako</b> (if) - Ako pada kiša... (If it rains...)</li></ul></div>` },

    // --- TIER 4: THE WORLD & LEISURE ---
    { id: 'travel', name: 'Putovanje', nameEn: 'Travel', emoji: '✈️', category: 'travel', prereqs: ['conjunctions'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Transportation and travel.</p><p>Example: <i>Gde je aerodrom?</i> (Where is the airport?)</p></div>` },
    { id: 'adverbs', name: 'Prilozi', nameEn: 'Adverbs', emoji: '⚡', category: 'adverbs', prereqs: ['travel'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Adverbs describe <b>how</b>, <b>when</b>, and <b>where</b> something happens. They never change form!</p><ul class="list-disc pl-5"><li><b>brzo</b> (quickly) - On trči brzo. (He runs quickly.)</li><li><b>polako</b> (slowly) - Govori polako. (Speak slowly.)</li><li><b>dobro</b> (well) - Ona peva dobro. (She sings well.)</li><li><b>uvek</b> (always) - Uvek kasnim. (I'm always late.)</li><li><b>nikad</b> (never) - Nikad ne laže. (He never lies.)</li></ul></div>` },
    { id: 'clothing', name: 'Odeća', nameEn: 'Clothing', emoji: '👕', category: 'clothing', prereqs: ['adverbs'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Combine clothes with colors!</p><p>Example: <i>Zelena majica</i> (Green t-shirt).</p></div>` },
    { id: 'comparatives', name: 'Poređenje', nameEn: 'Comparatives', emoji: '⚖️', category: 'comparatives', prereqs: ['clothing'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>English rules:</b></p><ul class="list-disc pl-5"><li>Short words: add <b>-er</b> / <b>-est</b> (fast, faster, fastest)</li><li>Long words: use <b>more</b> / <b>most</b> (beautiful, more beautiful)</li><li>Double consonant if short: big → bi<b>gg</b>er</li><li>Drop 'y' for 'i': happy → happ<b>i</b>er</li></ul><p><b>Serbian rules:</b></p><ul class="list-disc pl-5"><li>Add <b>-iji</b>, <b>-ji</b>, or <b>-ši</b> for comparatives (brz → brži)</li><li>Add the prefix <b>naj-</b> for superlatives (najbrži)</li></ul></div>` },
    { id: 'animals', name: 'Životinje', nameEn: 'Animals', emoji: '🐾', category: 'animals', prereqs: ['comparatives'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Notice that many animal names end in <b>-a</b>, making them feminine nouns (mačka, ptica, krava).</p><p>Masculine nouns usually end in a consonant (pas, medved).</p></div>` },
    { id: 'nature', name: 'Priroda', nameEn: 'Nature', emoji: '🌳', category: 'nature', prereqs: ['animals'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Beautiful nature words!</p><p>Did you know? The word for 'earth' and 'country' is the same: <b>Zemlja</b>.</p></div>` },
    { id: 'sports', name: 'Sport', nameEn: 'Sports', emoji: '⚽', category: 'sports', prereqs: ['nature'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Serbia is very famous for sports!</p><p>Many sports words are borrowed: <i>fudbal, tenis, košarka</i>.</p></div>` },
    { id: 'past_tense', name: 'Prošlo vreme', nameEn: 'Past Tense', emoji: '⏪', category: 'past_tense', prereqs: ['sports'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>The past tense in Serbian is formed with the <b>auxiliary verb "to be"</b> + the <b>past participle</b> (radni glagolski pridev).</p><p>The past participle changes based on <b>gender</b>!</p><ul class="list-disc pl-5"><li>Ja <b>sam radio</b> (I worked - Masc)</li><li>Ja <b>sam radila</b> (I worked - Fem)</li><li>On <b>je čitao</b> (He read)</li><li>Ona <b>je čitala</b> (She read)</li><li>Mi <b>smo jeli</b> (We ate)</li></ul><p>Form: Take the infinitive, remove -ti, add: <b>-o/-la/-lo</b> (singular) or <b>-li/-le/-la</b> (plural).</p></div>` },

    // --- TIER 5: MODERN LIFE ---
    { id: 'education', name: 'Obrazovanje', nameEn: 'Education', emoji: '📚', category: 'education', prereqs: ['past_tense'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>School and learning vocabulary.</p><p>A student at university is a <b>student</b>, but a pupil in school is an <b>učenik</b>.</p></div>` },
    { id: 'technology', name: 'Tehnologija', nameEn: 'Technology', emoji: '💻', category: 'technology', prereqs: ['education'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Modern tech words. Many are English loanwords.</p><p>Kompjuter, internet, sajt, aplikacija...</p></div>` },
    { id: 'business', name: 'Posao', nameEn: 'Business', emoji: '💼', category: 'business', prereqs: ['technology'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Professional vocabulary for working in Serbia.</p><p>The word for job or work is <b>posao</b>.</p></div>` },
    { id: 'advanced_adj', name: 'Napredni pridevi', nameEn: 'Advanced Adjectives', emoji: '🎯', category: 'advanced_adj', prereqs: ['business'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>When stacking multiple adjectives, follow a specific order:</p><ol class="list-decimal pl-5"><li><b>Opinion:</b> lep (beautiful), ružan (ugly)</li><li><b>Size:</b> velik (big), mali (small)</li><li><b>Age:</b> star (old), nov (new)</li><li><b>Color:</b> crven (red), plav (blue)</li><li><b>Origin:</b> srpski (Serbian), nemački (German)</li><li><b>Material:</b> drven (wooden), metalni (metal)</li></ol><p>Example: <i>Lepa velika stara crvena srpska drvena kuća</i> (A beautiful big old red Serbian wooden house).</p></div>` },
    { id: 'punctuation', name: 'Interpunkcija', nameEn: 'Punctuation', emoji: '✍️', category: 'punctuation', prereqs: ['advanced_adj'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>Commas between adjectives:</b></p><ul class="list-disc pl-5"><li>Use a comma if they are from the same category (e.g. cold, windy day).</li><li>NO comma if they are from different categories (e.g. big red car).</li><li>NEVER put a comma right before the noun!</li></ul><p><b>Exclamations:</b></p><ul class="list-disc pl-5"><li>English: Use "What a..." (What a beautiful day!) or "How..." (How wonderful!)</li><li>Serbian: Use "Kakav/Kakva/Kakvo..." (Kakav lep dan!) or "Kako..." (Kako divno!)</li></ul></div>` },
    { id: 'future_tense', name: 'Buduće vreme', nameEn: 'Future Tense', emoji: '⏩', category: 'future_tense', prereqs: ['punctuation'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>The future tense in Serbian uses <b>"ću/ćeš/će/ćemo/ćete/će"</b> + the infinitive (or <b>da</b> + present).</p><ul class="list-disc pl-5"><li>Ja <b>ću raditi</b> / Ja <b>ću da radim</b> (I will work)</li><li>Ti <b>ćeš jesti</b> (You will eat)</li><li>On/Ona <b>će doći</b> (He/She will come)</li><li>Mi <b>ćemo ići</b> (We will go)</li><li>Oni <b>će spavati</b> (They will sleep)</li></ul><p>In everyday speech, Serbians almost always use <b>"ću da + present"</b> instead of the infinitive form.</p></div>` },

    // --- TIER 6: ADVANCED ---
    { id: 'dating', name: 'Ljubav', nameEn: 'Dating', emoji: '❤️', category: 'dating', prereqs: ['future_tense'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Romance and dating terms!</p><p><b>Volim te</b> means I love you.</p></div>` },
    { id: 'slang', name: 'Sleng', nameEn: 'Slang', emoji: '😎', category: 'slang', prereqs: ['dating'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Speak like a local!</p><ul class="list-disc pl-5"><li><b>Brate</b> - Bro / Dude</li><li><b>Bleja</b> - Hanging out / Chilling</li><li><b>Vrh</b> - Awesome (literally: peak)</li></ul></div>` },
    { id: 'particles', name: 'Rečce i Uzvici', nameEn: 'Particles & Interjections', emoji: '💥', category: 'particles', prereqs: ['slang'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>Particles (Rečce)</b> are tiny words that add meaning or emphasis:</p><ul class="list-disc pl-5"><li><b>li</b> - question marker: Da <b>li</b> znaš? (Do you know?)</li><li><b>zar</b> - rhetorical: <b>Zar</b> ne? (Right? / Isn't it?)</li><li><b>baš</b> - emphasis: <b>Baš</b> lepo! (Really nice!)</li><li><b>čak</b> - even: <b>Čak</b> i on. (Even he.)</li></ul><p><b>Interjections (Uzvici)</b> express emotion:</p><ul class="list-disc pl-5"><li><b>Jao!</b> - Oh no! / Ouch!</li><li><b>Ej!</b> - Hey!</li><li><b>Bravo!</b> - Well done!</li><li><b>Uf!</b> - Phew!</li></ul></div>` },
    { id: 'spelling', name: 'Pravopis', nameEn: 'Spelling Traps', emoji: '🔍', category: 'spelling', prereqs: ['particles'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>English Spelling Traps:</b></p><ul class="list-disc pl-5"><li>Drop 'y' for 'i' (happy → happier, heavy → heaviest)</li><li>Double consonant for short words (hot → hotter, big → biggest)</li></ul><p><b>Serbian Spelling Traps:</b></p><p>Pay close attention to similar-sounding letters:</p><ul class="list-disc pl-5"><li><b>Č</b> (hard ch) vs <b>Ć</b> (soft ch): čaj (tea) vs noć (night).</li><li><b>Dž</b> (hard j) vs <b>Đ</b> (soft j): džep (pocket) vs đak (student).</li></ul></div>` }
];

// Crown levels: 0=not started, 1=started, 2=familiar, 3=good, 4=great, 5=mastered
const CROWN_COLORS = {
    0: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-400 dark:text-slate-500', border: 'border-slate-300 dark:border-slate-600', shadow: 'shadow-[0_4px_0_rgb(148,163,184)]' },
    1: { bg: 'bg-green-400', text: 'text-white', border: 'border-green-500', shadow: 'shadow-[0_4px_0_rgb(21,128,61)]' },
    2: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600', shadow: 'shadow-[0_4px_0_rgb(21,128,61)]' },
    3: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', shadow: 'shadow-[0_4px_0_rgb(29,78,216)]' },
    4: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600', shadow: 'shadow-[0_4px_0_rgb(126,34,206)]' },
    5: { bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-500', shadow: 'shadow-[0_4px_0_rgb(161,98,7)]' },
};

const SkillTreeEngine = {
    _getKey() {
        const username = window.appState && window.appState.user ? window.appState.user.name : 'guest';
        return 'serbolingo_skill_progress_' + username;
    },
    getProgress() {
        const saved = localStorage.getItem(this._getKey());
        if (!saved && localStorage.getItem('serbolingo_skill_progress')) {
            const old = localStorage.getItem('serbolingo_skill_progress');
            localStorage.setItem(this._getKey(), old);
            localStorage.removeItem('serbolingo_skill_progress');
            return JSON.parse(old);
        }
        return saved ? JSON.parse(saved) : {};
    },
    
    saveProgress(progress) {
        localStorage.setItem(this._getKey(), JSON.stringify(progress));
    },
    
    getCrownLevel(skillId) {
        const progress = this.getProgress();
        return (progress[skillId] && progress[skillId].crown) || 0;
    },
    
    getLessonsCompleted(skillId) {
        const progress = this.getProgress();
        return (progress[skillId] && progress[skillId].lessonsInCrown) || 0;
    },
    
    getLessonsPerCrown() {
        return 3;
    },
    
    isUnlocked(skillId) {
        const skill = SKILL_TREE.find(s => s.id === skillId);
        if (!skill) return false;
        // Foundation items (no prereqs) are always unlocked
        if (skill.prereqs.length === 0) return true;
        // Everything else requires ALL prereqs to have at least crown level 1
        return skill.prereqs.every(prereqId => this.getCrownLevel(prereqId) >= 1);
    },
    
    recordLessonComplete(skillId, perfect) {
        const progress = this.getProgress();
        if (!progress[skillId]) {
            progress[skillId] = { crown: 0, lessonsInCrown: 0, totalLessons: 0, perfectLessons: 0 };
        }
        
        progress[skillId].totalLessons++;
        if (perfect) progress[skillId].perfectLessons++;
        progress[skillId].lessonsInCrown++;
        
        if (progress[skillId].lessonsInCrown >= this.getLessonsPerCrown() && progress[skillId].crown < 5) {
            progress[skillId].crown++;
            progress[skillId].lessonsInCrown = 0;
        }
        
        this.saveProgress(progress);
        return progress[skillId];
    },
    
    getSkillsWithStatus() {
        return SKILL_TREE.map(skill => ({
            ...skill,
            crown: this.getCrownLevel(skill.id),
            lessonsInCrown: this.getLessonsCompleted(skill.id),
            unlocked: this.isUnlocked(skill.id),
            locked: !this.isUnlocked(skill.id)
        }));
    }
};
