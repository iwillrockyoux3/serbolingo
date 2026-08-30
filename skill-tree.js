// [SHIELD_DAEMON: VALIDATED]
// Skill Tree Data Structure & Engine for SerboLingo
// Phase 3: Duolingo-style progression system

const SKILL_TREE = [
    // --- TIER 1: FOUNDATION ---
    { id: 'alphabet', name: 'Azbuka', nameEn: 'Alphabet', emoji: '🔤', category: 'alphabet', prereqs: [], optional: true, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Serbian can be written in two scripts: <b>Cyrillic</b> (ćirilica) and <b>Latin</b> (latinica). They map perfectly 1-to-1.</p>
        <p>Some unique letters: <b>Č, Ć, Ž, Š, Đ, Dž, Lj, Nj</b>.</p>
        <p>In Serbian, you read it exactly how you write it!</p>
    </div>` },
    { id: 'basics', name: 'Osnove', nameEn: 'Basics', emoji: '🌱', category: 'basics', prereqs: [], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Welcome to Serbian! The verb <b>to be (biti)</b> is very important:</p>
        <ul class="list-disc pl-5"><li>Ja sam (I am)</li><li>Ti si (You are)</li><li>On/Ona je (He/She is)</li></ul>
        <p>Serbian doesn't use articles (a/an/the). "A cat" and "the cat" are both just <b>mačka</b>.</p>
    </div>` },
    { id: 'phrases', name: 'Fraze', nameEn: 'Phrases', emoji: '💬', category: 'phrases', prereqs: ['basics'], optional: true, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Essential survival phrases!</p>
        <ul class="list-disc pl-5"><li><b>Gde je...?</b> (Where is...?)</li><li><b>Koliko košta?</b> (How much does it cost?)</li></ul>
    </div>` },
    { id: 'numbers', name: 'Brojevi', nameEn: 'Numbers', emoji: '🔢', category: 'numbers', prereqs: ['basics'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Numbers 1-10 are the foundation.</p>
        <ul class="list-disc pl-5"><li>1: jedan</li><li>2: dva</li><li>3: tri</li></ul>
        <p>Notice that numbers change form depending on gender, especially <b>jedan</b> (jedan/jedna/jedno) and <b>dva</b> (dva/dve).</p>
    </div>` },
    { id: 'colors', name: 'Boje', nameEn: 'Colors', emoji: '🎨', category: 'colors', prereqs: ['basics'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Colors are adjectives, meaning they must match the gender of the noun they describe!</p>
        <p>Example for 'crven' (red):</p>
        <ul class="list-disc pl-5"><li>crven auto (masculine)</li><li>crven<b>a</b> kuća (feminine)</li><li>crven<b>o</b> nebo (neuter)</li></ul>
    </div>` },

    // --- TIER 2: WORLD 1 ---
    { id: 'family', name: 'Porodica', nameEn: 'Family', emoji: '👪', category: 'family', prereqs: ['basics'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Serbian family vocabulary is very specific.</p>
        <p>For example, there are different words for uncle depending on the side of the family:</p>
        <ul class="list-disc pl-5"><li><b>Stric</b> (father's brother)</li><li><b>Ujak</b> (mother's brother)</li><li><b>Teča</b> (aunt's husband)</li></ul>
    </div>` },
    { id: 'household', name: 'Kuća', nameEn: 'Household', emoji: '🏠', category: 'household', prereqs: ['family'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Objects around the house. Pay attention to genders!</p>
        <ul class="list-disc pl-5"><li>Sto (table) - Masculine</li><li>Stolica (chair) - Feminine</li><li>Kupatilo (bathroom) - Neuter</li></ul>
    </div>` },
    { id: 'animals', name: 'Životinje', nameEn: 'Animals', emoji: '🐾', category: 'animals', prereqs: ['colors'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Notice that many animal names end in <b>-a</b>, making them feminine nouns (mačka, ptica, krava).</p>
        <p>Masculine nouns usually end in a consonant (pas, medved).</p>
    </div>` },
    { id: 'nature', name: 'Priroda', nameEn: 'Nature', emoji: '🌳', category: 'nature', prereqs: ['animals'], optional: true, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Beautiful nature words!</p>
        <p>Did you know? The word for 'earth' and 'country' is the same: <b>Zemlja</b>.</p>
    </div>` },
    { id: 'food', name: 'Hrana', nameEn: 'Food & Drink', emoji: '🍽️', category: 'food', prereqs: ['household', 'animals'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>When ordering food, use <b>"Molim vas..."</b> (Please...).</p>
        <p>You can say <b>"Ja želim..."</b> (I want...).</p>
        <p>Example: <i>Molim vas, jednu kafu!</i> (One coffee, please! - uses accusative case).</p>
    </div>` },

    // --- TIER 3: ACTION & DESCRIPTION ---
    { id: 'clothing', name: 'Odeća', nameEn: 'Clothing', emoji: '👕', category: 'clothing', prereqs: ['colors'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Combine clothes with colors!</p>
        <p>Example: <i>Zelena majica</i> (Green t-shirt).</p>
    </div>` },
    { id: 'verbs', name: 'Glagoli', nameEn: 'Verbs', emoji: '🏃', category: 'verbs', prereqs: ['food', 'clothing'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Most verbs end in <b>-ti</b> or <b>-ći</b> in their infinitive form (e.g., raditi, jesti).</p>
        <p>To make them present tense, drop the ending and add:</p>
        <ul class="list-disc pl-5"><li>Ja radi<b>m</b></li><li>Ti radi<b>š</b></li><li>On radi</li></ul>
    </div>` },
    { id: 'adjectives', name: 'Pridevi', nameEn: 'Adjectives', emoji: '✨', category: 'adjectives', prereqs: ['verbs'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Adjectives describe nouns and MUST match their gender and case!</p>
        <ul class="list-disc pl-5"><li>Dobar dan (Good day - Masc)</li><li>Dobra noć (Good night - Fem)</li><li>Dobro jutro (Good morning - Neut)</li></ul>
    </div>` },
    { id: 'emotions', name: 'Osećanja', nameEn: 'Emotions', emoji: '😊', category: 'emotions', prereqs: ['adjectives'], optional: true, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>To express feelings, you often use the verb <b>biti</b> (to be) + the adjective.</p>
        <p>Example: <i>Ja sam srećan</i> (I am happy).</p>
    </div>` },

    // --- TIER 4: SELF & HEALTH ---
    { id: 'body', name: 'Telo', nameEn: 'Body', emoji: '🗣️', category: 'body', prereqs: ['adjectives'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Parts of the human body.</p>
        <p>If something hurts, you can say: <b>Boli me [body part]</b>.</p>
        <p>Example: <i>Boli me glava</i> (My head hurts).</p>
    </div>` },
    { id: 'health', name: 'Zdravlje', nameEn: 'Health', emoji: '🏥', category: 'health', prereqs: ['body'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4">
        <p>Medical vocabulary. Essential for emergencies!</p>
        <p><b>Hitna pomoć</b> means ambulance (literally: fast help).</p>
    </div>` },
    { id: 'sports', name: 'Sport', nameEn: 'Sports', emoji: '⚽', category: 'sports', prereqs: ['body', 'verbs'], optional: true, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Serbia is very famous for sports!</p>
        <p>Many sports words are borrowed: <i>fudbal, tenis, košarka</i>.</p>
    </div>` },

    // --- TIER 5: TIME & WEATHER ---
    { id: 'time', name: 'Vreme', nameEn: 'Time', emoji: '🕒', category: 'time', prereqs: ['numbers', 'verbs'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Time concepts. To ask the time, say: <b>Koliko je sati?</b></p>
    </div>` },
    { id: 'days', name: 'Dani', nameEn: 'Days', emoji: '📅', category: 'days', prereqs: ['time'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Days of the week. Most end in -ak or -a.</p>
        <ul class="list-disc pl-5"><li>Ponedeljak (Monday)</li><li>Sreda (Wednesday)</li><li>Petak (Friday)</li></ul>
    </div>` },
    { id: 'months', name: 'Meseci', nameEn: 'Months', emoji: '🗓️', category: 'months', prereqs: ['days'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Months of the year are very similar to English!</p>
        <p>Januar, Februar, Mart, April...</p>
    </div>` },
    { id: 'weather', name: 'Vreme', nameEn: 'Weather', emoji: '🌦️', category: 'weather', prereqs: ['months', 'nature'], optional: true, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>The word <b>Vreme</b> means both 'Time' and 'Weather' in Serbian!</p>
        <p>Example: <i>Kakvo je vreme danas?</i> (What is the weather like today?)</p>
    </div>` },

    // --- TIER 6: WORLD 2 & NAVIGATION ---
    { id: 'directions', name: 'Pravci', nameEn: 'Directions', emoji: '🗺️', category: 'directions', prereqs: ['verbs'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Navigating the city.</p>
        <ul class="list-disc pl-5"><li>Levo (Left)</li><li>Desno (Right)</li><li>Pravo (Straight)</li></ul>
    </div>` },
    { id: 'travel', name: 'Putovanje', nameEn: 'Travel', emoji: '✈️', category: 'travel', prereqs: ['directions', 'time'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4">
        <p>Transportation and travel.</p>
        <p>Example: <i>Gde je aerodrom?</i> (Where is the airport?)</p>
    </div>` },
    { id: 'education', name: 'Obrazovanje', nameEn: 'Education', emoji: '📚', category: 'education', prereqs: ['verbs'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>School and learning vocabulary.</p>
        <p>A student at university is a <b>student</b>, but a pupil in school is an <b>učenik</b>.</p>
    </div>` },
    { id: 'technology', name: 'Tehnologija', nameEn: 'Technology', emoji: '💻', category: 'technology', prereqs: ['education'], optional: true, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Modern tech words. Many are English loanwords.</p>
        <p>Kompjuter, internet, sajt, aplikacija...</p>
    </div>` },
    { id: 'business', name: 'Posao', nameEn: 'Business', emoji: '💼', category: 'business', prereqs: ['technology', 'travel'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4">
        <p>Professional vocabulary for working in Serbia.</p>
        <p>The word for job or work is <b>posao</b>.</p>
    </div>` },

    // --- TIER 7: ADVANCED & SOCIAL ---
    { id: 'dating', name: 'Ljubav', nameEn: 'Dating', emoji: '❤️', category: 'dating', prereqs: ['emotions', 'body'], optional: true, difficulty: 3, guideHtml: `<div class="space-y-4">
        <p>Romance and dating terms!</p>
        <p><b>Volim te</b> means I love you.</p>
    </div>` },
    { id: 'slang', name: 'Sleng', nameEn: 'Slang', emoji: '😎', category: 'slang', prereqs: ['dating', 'phrases'], optional: true, difficulty: 4, guideHtml: `<div class="space-y-4">
        <p>Speak like a local!</p>
        <ul class="list-disc pl-5"><li><b>Brate</b> - Bro / Dude</li><li><b>Bleja</b> - Hanging out / Chilling</li><li><b>Vrh</b> - Awesome (literally: peak)</li></ul>
    </div>` }
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
        if (skill.optional) return true;
        if (skill.prereqs.length === 0) return true;
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
