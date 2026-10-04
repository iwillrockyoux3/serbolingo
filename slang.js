// [SHIELD_DAEMON: VALIDATED]
// Priority 15: Authentic Serbian Slang & Žargon Module
const SlangEngine = {
    // Slang database organized by dialect/region
    slangData: {
        'beograd': [
            { slang: 'Brate', meaning: 'Bro / Dude', literal: 'Brother', usage: 'Brate, šta ima?', tag: 'bg' },
            { slang: 'Bleja', meaning: 'Chilling / Hanging out', literal: 'Bleating (like a sheep)', usage: 'Idemo na bleju večeras.', tag: 'bg' },
            { slang: 'Šta ima?', meaning: 'What\'s up?', literal: 'What has?', usage: 'Šta ima, brate?', tag: 'bg' },
            { slang: 'Gajba', meaning: 'Apartment / House', literal: 'Crate', usage: 'Idemo kod mene na gajbu.', tag: 'bg' },
            { slang: 'Kinta', meaning: 'Money / Cash', literal: 'Money', usage: 'Nemam ni kintu.', tag: 'bg' },
            { slang: 'Smarati', meaning: 'To bore / annoy someone', literal: 'To smother', usage: 'Ne smaraj me više.', tag: 'bg' },
            { slang: 'Vrh', meaning: 'Awesome / Top', literal: 'Peak', usage: 'Bilo je vrh na žurci.', tag: 'bg' },
            { slang: 'Cimanje', meaning: 'Hassle / Bother', literal: 'Jerking/Pulling', usage: 'To mi je preveliko cimanje.', tag: 'bg' },
            { slang: 'Fazon', meaning: 'Style / Vibe / Trick', literal: 'Fashion', usage: 'Nije to moj fazon.', tag: 'bg' },
            { slang: 'Loma', meaning: 'A little bit (Malo)', literal: '(Satravački for Malo)', usage: 'Daj loma kikirikija.', tag: 'bg' },
        ],
        'juzni': [ // Southern (Niš/Vranje)
            { slang: 'Be', meaning: 'Used for emphasis (like "man" or "yo")', literal: 'None', usage: 'Gde si be, brate?', tag: 'južni' },
            { slang: 'Lele', meaning: 'Oh my god / Wow', literal: 'Oh', usage: 'Lele, šta uradi?!', tag: 'južni' },
            { slang: 'Merak', meaning: 'Soulful pleasure / Enjoyment', literal: 'Pleasure', usage: 'Pijem kafu s merakom.', tag: 'južni' },
            { slang: 'Zajeb', meaning: 'A big mistake / screw up', literal: 'Fuck up', usage: 'Koji zajeb be!', tag: 'južni' },
            { slang: 'Tepati', meaning: 'To beat / hit', literal: 'To hit', usage: 'Ima te tepam.', tag: 'južni' },
        ],
        'kafana': [
            { slang: 'Tura', meaning: 'Round of drinks', literal: 'Round', usage: 'Sledeća tura je na mene!', tag: 'kafana' },
            { slang: 'Živeli!', meaning: 'Cheers!', literal: 'Live long!', usage: 'Živeli, braćo!', tag: 'kafana' },
            { slang: 'Meze', meaning: 'Appetizers / Cold cuts with alcohol', literal: 'Snacks', usage: 'Donesi neko meze uz rakiju.', tag: 'kafana' },
            { slang: 'Pijanka', meaning: 'Heavy drinking session', literal: 'Drinking party', usage: 'Bila je opasna pijanka sinoć.', tag: 'kafana' },
            { slang: 'Mamurluk', meaning: 'Hangover', literal: 'Hangover', usage: 'Ubi me mamurluk.', tag: 'kafana' }
        ]
    },

    currentTab: 'beograd',

    openMenu: function() {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();

        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');

        this.renderView(overlay);
    },

    renderView: function(overlay) {
        let activeData = this.slangData[this.currentTab] || [];
        
        let tabClass = (tab) => this.currentTab === tab 
            ? 'px-4 py-2 bg-blue-600 text-white rounded-lg font-black text-xs shadow-md' 
            : 'px-4 py-2 bg-slate-800 text-slate-400 rounded-lg font-bold text-xs hover:bg-slate-700';

        overlay.innerHTML = `
            <div class="flex flex-col h-full bg-slate-900 text-white w-full">
                <!-- Header -->
                <div class="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700 shadow-md">
                    <div class="font-black text-xl flex items-center gap-2">
                        <span>🌶️</span> 
                        <span class="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Ulični Srpski</span>
                    </div>
                    <button onclick="ArcadeEngine._hideOverlay()" class="text-3xl font-black hover:text-red-400 transition-colors">&times;</button>
                </div>
                
                <!-- Dialect Tabs -->
                <div class="flex p-4 gap-2 overflow-x-auto border-b border-slate-800 shrink-0">
                    <button onclick="SlangEngine.switchTab('beograd')" class="${tabClass('beograd')}">🏙️ Beograd</button>
                    <button onclick="SlangEngine.switchTab('juzni')" class="${tabClass('juzni')}">🌶️ Južni / Niš</button>
                    <button onclick="SlangEngine.switchTab('kafana')" class="${tabClass('kafana')}">🍷 Kafana & Kafa</button>
                </div>

                <!-- Content Feed -->
                <div class="flex-1 p-4 overflow-y-auto space-y-4 pb-20">
                    <p class="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">${this.currentTab.toUpperCase()} ŽARGON / SLANG</p>
                    
                    ${activeData.map((item, idx) => `
                        <div class="bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 hover:border-blue-500 transition-colors group cursor-pointer" onclick="SlangEngine.playAudio('${item.slang}')">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">${item.slang}</h3>
                                <span class="bg-slate-700 text-slate-300 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider">${item.tag}</span>
                            </div>
                            <div class="space-y-1 mb-3">
                                <p class="text-sm font-bold text-green-400">Meaning: <span class="text-white font-medium">${item.meaning}</span></p>
                                <p class="text-xs font-medium text-slate-400">Literal: "${item.literal}"</p>
                            </div>
                            <div class="bg-slate-900 rounded-xl p-3 flex gap-3 items-center">
                                <div class="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0">
                                    <span class="text-sm">🗣️</span>
                                </div>
                                <p class="text-sm font-medium text-slate-300 italic">"${item.usage}"</p>
                            </div>
                        </div>
                    `).join('')}
                    
                    <!-- Trainer Launch -->
                    <div class="mt-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-center shadow-lg shadow-blue-500/20">
                        <h4 class="text-lg font-black mb-2 text-white">Ready to test your slang?</h4>
                        <p class="text-xs text-blue-100 mb-4 font-medium">Take a rapid-fire quiz on ${this.currentTab} expressions.</p>
                        <button onclick="SlangEngine.startQuiz()" class="bg-white text-blue-900 px-6 py-3 rounded-xl font-black text-sm active:scale-95 transition-transform w-full shadow-lg">Start Slang Quiz ⚡</button>
                    </div>
                </div>
            </div>
        `;
    },

    switchTab: function(tab) {
        this.currentTab = tab;
        const overlay = document.getElementById('arcade-game-overlay');
        if (overlay) this.renderView(overlay);
    },

    playAudio: function(text) {
        if (window.app && window.app.speakPhrase) {
            window.app.speakPhrase(text, 'sr-RS');
        }
    },

    startQuiz: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        let activeData = this.slangData[this.currentTab] || [];
        if (activeData.length < 3) return;

        // Shuffle questions
        const questions = [...activeData].sort(() => Math.random() - 0.5);
        let currentQ = 0;
        let score = 0;

        const renderQ = () => {
            if (currentQ >= questions.length) {
                // Game over
                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                        <h2 class="text-4xl font-black text-green-400 mb-2">Street Cred: ${score}/${questions.length}</h2>
                        <p class="text-slate-400 mb-8">You survived the streets of ${this.currentTab}.</p>
                        <button onclick="SlangEngine.renderView(document.getElementById('arcade-game-overlay'))" class="px-6 py-3 bg-blue-600 rounded-xl font-black active:scale-95 transition-transform w-full max-w-xs mb-3 shadow-lg shadow-blue-600/30">Back to Dictionary</button>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3 bg-slate-700 rounded-xl font-black active:scale-95 transition-transform w-full max-w-xs">Exit</button>
                    </div>
                `;
                return;
            }

            const q = questions[currentQ];
            // Generate wrong answers from ANY tab to make it harder
            let allSlangs = [];
            Object.values(this.slangData).forEach(arr => allSlangs.push(...arr));
            
            let wrongOptions = allSlangs.filter(item => item.slang !== q.slang).sort(() => Math.random() - 0.5).slice(0, 3);
            let options = [q, ...wrongOptions].sort(() => Math.random() - 0.5);

            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-slate-900 text-white w-full">
                    <div class="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700">
                        <div class="font-black">⚡ Slang Quiz</div>
                        <div class="font-bold text-sm text-slate-400">${currentQ + 1}/${questions.length}</div>
                    </div>
                    
                    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <p class="text-slate-400 font-bold mb-2 uppercase tracking-widest text-xs">What does this mean?</p>
                        <h2 class="text-5xl font-black text-yellow-400 mb-8 drop-shadow-md">"${q.slang}"</h2>
                        
                        <div class="flex flex-col gap-3 w-full max-w-sm">
                            ${options.map(opt => `
                                <button class="slang-btn p-4 bg-slate-800 border-2 border-slate-700 rounded-xl font-bold text-sm active:scale-95 transition-all text-left flex items-center justify-between group" data-is-correct="${opt.slang === q.slang}">
                                    <span class="text-white group-hover:text-blue-400 transition-colors">${opt.meaning}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;

            document.querySelectorAll('.slang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const isCorrect = btn.getAttribute('data-is-correct') === 'true';
                    document.querySelectorAll('.slang-btn').forEach(b => b.disabled = true);
                    
                    if (isCorrect) {
                        btn.classList.add('border-green-500', 'bg-green-900/30');
                        if (window.app && window.app.playSound) window.app.playSound('correct');
                        score++;
                    } else {
                        btn.classList.add('border-red-500', 'bg-red-900/30');
                        if (window.app && window.app.playSound) window.app.playSound('wrong');
                        // Highlight correct
                        document.querySelector('.slang-btn[data-is-correct="true"]').classList.add('border-green-500', 'bg-green-900/30');
                    }
                    
                    currentQ++;
                    setTimeout(() => renderQ(), 1000);
                });
            });
        };

        renderQ();
    }
};

window.SlangEngine = SlangEngine;
