// [SHIELD_DAEMON: VALIDATED]
// Skill Tree Data Structure & Engine for SerboLingo
// Phase 3: Duolingo-style progression system

const SKILL_TREE = [
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
    { id: 'numbers', name: 'Brojevi', nameEn: 'Numbers', emoji: '🔢', category: 'numbers', prereqs: [], optional: true, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Numbers 1-10 are the foundation.</p>
        <ul class="list-disc pl-5"><li>1: jedan</li><li>2: dva</li><li>3: tri</li></ul>
        <p>Notice that numbers change form depending on gender, especially <b>jedan</b> (jedan/jedna/jedno) and <b>dva</b> (dva/dve).</p>
    </div>` },
    { id: 'colors', name: 'Boje', nameEn: 'Colors', emoji: '🎨', category: 'colors', prereqs: ['basics'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Colors are adjectives, meaning they must match the gender of the noun they describe!</p>
        <p>Example for 'crven' (red):</p>
        <ul class="list-disc pl-5"><li>crven auto (masculine)</li><li>crven<b>a</b> kuća (feminine)</li><li>crven<b>o</b> nebo (neuter)</li></ul>
    </div>` },
    { id: 'family', name: 'Porodica', nameEn: 'Family', emoji: '👪', category: 'family', prereqs: ['basics'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Serbian family vocabulary is very specific.</p>
        <p>For example, there are different words for uncle depending on the side of the family:</p>
        <ul class="list-disc pl-5"><li><b>Stric</b> (father's brother)</li><li><b>Ujak</b> (mother's brother)</li><li><b>Teča</b> (aunt's husband)</li></ul>
    </div>` },
    { id: 'animals', name: 'Životinje', nameEn: 'Animals', emoji: '🐾', category: 'animals', prereqs: ['colors'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4">
        <p>Notice that many animal names end in <b>-a</b>, making them feminine nouns (mačka, ptica, krava).</p>
        <p>Masculine nouns usually end in a consonant (pas, medved).</p>
    </div>` },
    { id: 'food', name: 'Hrana', nameEn: 'Food & Drink', emoji: '🍽️', category: 'food', prereqs: ['family'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>When ordering food, use <b>"Molim vas..."</b> (Please...).</p>
        <p>You can say <b>"Ja želim..."</b> (I want...).</p>
        <p>Example: <i>Molim vas, jednu kafu!</i> (One coffee, please! - uses accusative case).</p>
    </div>` },
    { id: 'verbs', name: 'Glagoli', nameEn: 'Verbs', emoji: '🏃', category: 'verbs', prereqs: ['animals', 'food'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4">
        <p>Most verbs end in <b>-ti</b> or <b>-ći</b> in their infinitive form (e.g., raditi, jesti).</p>
        <p>To make them present tense, drop the ending and add:</p>
        <ul class="list-disc pl-5"><li>Ja radi<b>m</b></li><li>Ti radi<b>š</b></li><li>On radi</li></ul>
    </div>` },
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
