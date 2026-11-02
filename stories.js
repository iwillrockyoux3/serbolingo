// Priority 11: Interactive Stories Mode
const StoriesEngine = {
    currentStory: null,
    currentNodeId: null,
    
    // Master Database of Stories
    STORIES: [
        {
            id: 'story_skadarlija',
            title_sr: 'Noć u Skadarliji',
            title_en: 'A Night Out in Skadarlija',
            desc: 'Navigate a traditional Serbian restaurant, order food, and chat with the waiter.',
            level: 'Beginner',
            icon: '🍲',
            nodes: {
                'start': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Dobro veče! Izvolite, slobodan sto za dvoje.',
                    en: 'Good evening! Here you go, a free table for two.',
                    choices: [
                        { text_sr: 'Dobro veče. Hvala lepo.', text_en: 'Good evening. Thank you very much.', next: 'menu' },
                        { text_sr: 'Imate li jelovnik?', text_en: 'Do you have a menu?', next: 'menu_ask' }
                    ]
                },
                'menu': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Izvolite jelovnik. Šta želite za piće?',
                    en: 'Here is the menu. What would you like to drink?',
                    choices: [
                        { text_sr: 'Dve rakije, molim vas.', text_en: 'Two rakijas, please.', next: 'rakija' },
                        { text_sr: 'Samo vodu.', text_en: 'Just water.', next: 'voda' }
                    ]
                },
                'menu_ask': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Naravno, evo jelovnika. Želite li nešto da popijete dok gledate?',
                    en: 'Of course, here is the menu. Would you like something to drink while looking?',
                    choices: [
                        { text_sr: 'Dve rakije, molim vas.', text_en: 'Two rakijas, please.', next: 'rakija' },
                        { text_sr: 'Samo vodu.', text_en: 'Just water.', next: 'voda' }
                    ]
                },
                'rakija': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Odličan izbor! Imamo domaću šljivovicu i dunjevaču.',
                    en: 'Excellent choice! We have homemade plum and quince brandy.',
                    choices: [
                        { text_sr: 'Dve dunje!', text_en: 'Two quinces!', next: 'food' },
                        { text_sr: 'Šljivu za mene.', text_en: 'Plum for me.', next: 'food' }
                    ]
                },
                'voda': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Razumem. Obična ili kisela?',
                    en: 'Understood. Still or sparkling?',
                    choices: [
                        { text_sr: 'Obična, hvala.', text_en: 'Still, thanks.', next: 'food' }
                    ]
                },
                'food': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'A za jelo? Preporučujem ćevape sa lukom.',
                    en: 'And for food? I recommend cevapi with onions.',
                    choices: [
                        { text_sr: 'Može! To zvuči sjajno.', text_en: 'Sure! That sounds great.', next: 'end_good' },
                        { text_sr: 'Imate li nešto bez mesa?', text_en: 'Do you have something without meat?', next: 'end_veg' }
                    ]
                },
                'end_good': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Stiže odmah! Uživajte uz muziku.',
                    en: 'Coming right up! Enjoy the music.',
                    isEnd: true
                },
                'end_veg': {
                    speakerName: 'Konobar',
                    speakerIcon: '👨‍🍳',
                    sr: 'Naravno, imamo odličan prebranac i šopsku salatu.',
                    en: 'Of course, we have excellent baked beans and Shopska salad.',
                    isEnd: true
                }
            }
        },
        {
            id: 'story_market',
            title_sr: 'Na Kalenić Pijaci',
            title_en: 'Buying at Kalenić Market',
            desc: 'Bargain with a local vendor for fresh tomatoes and cheese.',
            level: 'Beginner',
            icon: '🍅',
            nodes: {
                'start': {
                    speakerName: 'Prodavac',
                    speakerIcon: '👴',
                    sr: 'Izvoli komšija! Sveže jabuke, domaći paradajz!',
                    en: 'Here you go neighbor! Fresh apples, homemade tomatoes!',
                    choices: [
                        { text_sr: 'Pošto je paradajz?', text_en: 'How much are the tomatoes?', next: 'price' }
                    ]
                },
                'price': {
                    speakerName: 'Prodavac',
                    speakerIcon: '👴',
                    sr: 'Dvesta dinara kilo. Sladak kao med!',
                    en: '200 dinars a kilo. Sweet as honey!',
                    choices: [
                        { text_sr: 'Može, dajte mi jedan kilogram.', text_en: 'Sure, give me one kilogram.', next: 'end' },
                        { text_sr: 'Malo je skupo...', text_en: 'It\'s a bit expensive...', next: 'haggle' }
                    ]
                },
                'haggle': {
                    speakerName: 'Prodavac',
                    speakerIcon: '👴',
                    sr: 'Ajde za tebe sto osamdeset, ali da kupiš i sir!',
                    en: 'Alright, for you 180, but you have to buy cheese too!',
                    choices: [
                        { text_sr: 'Dogovoreno!', text_en: 'Deal!', next: 'end' }
                    ]
                },
                'end': {
                    speakerName: 'Prodavac',
                    speakerIcon: '👴',
                    sr: 'Hvala puno! Vidimo se sledeće nedelje.',
                    en: 'Thank you very much! See you next week.',
                    isEnd: true
                }
            }
        }
    ],

    openMenu: function() {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();
        
        let html = `
            <div id="stories-menu-modal" class="fixed inset-0 bg-slate-50 dark:bg-slate-900 z-[100] flex flex-col fade-in">
                <div class="p-4 flex items-center justify-between border-b-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10">
                    <div>
                        <h2 class="text-xl font-black text-slate-800 dark:text-white">📖 ${typeof t !== 'undefined' ? t('arcade_btn_stories') : 'Serbian Stories'}</h2>
                        <p class="text-xs text-slate-500 font-bold">${typeof t !== 'undefined' ? t('arcade_btn_stories_desc') : 'Interactive dialogues'}</p>
                    </div>
                    <button onclick="document.getElementById('stories-menu-modal').remove()" class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">❌</button>
                </div>
                <div class="flex-1 overflow-y-auto p-4 space-y-4">
                    <!-- Featured: Smart Paced Story Mode (Priority 38) -->
                    <button onclick="document.getElementById('stories-menu-modal')?.remove(); if (window.SmartStoryEngine) SmartStoryEngine.startFromMistakes();" class="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-5 rounded-3xl border-2 border-amber-300 text-white shadow-xl shadow-orange-500/20 active:scale-95 transition-transform text-left flex flex-col relative overflow-hidden group">
                        <div class="absolute -right-3 -bottom-3 text-7xl opacity-20 group-hover:scale-110 transition-transform">✨</div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-white/25 text-white px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider">🌟 DINAMIČKI AI & OFFLINE</span>
                            <span class="bg-black/20 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold">SM-2 Spaced Repetition</span>
                        </div>
                        <h3 class="text-xl font-black text-white mb-1 relative z-10">📖 Pametna Priča (Tvoje Greške)</h3>
                        <p class="text-xs font-bold text-amber-100 mb-2 relative z-10">Smart Paced Story from Your Weak Words</p>
                        <p class="text-xs text-white/95 relative z-10 leading-relaxed font-medium">Ubacujemo reči koje si pogrešio direktno u zabavan kulturni dijalog uz proveru razumevanja i +25 XP!</p>
                    </button>
        `;
        
        this.STORIES.forEach(story => {
            html += `
                <button onclick="StoriesEngine.startStory('${story.id}')" class="w-full bg-white dark:bg-slate-800 p-4 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-md active:scale-95 transition-transform text-left flex flex-col relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform">${story.icon}</div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">${story.level}</span>
                    </div>
                    <h3 class="text-lg font-black text-slate-800 dark:text-white mb-1 relative z-10">${story.icon} ${story.title_sr}</h3>
                    <p class="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 relative z-10">${story.title_en}</p>
                    <p class="text-[11px] text-slate-600 dark:text-slate-300 relative z-10 leading-relaxed">${story.desc}</p>
                </button>
            `;
        });

        html += `
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
    },

    startStory: function(storyId) {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();
        
        this.currentStory = this.STORIES.find(s => s.id === storyId);
        if (!this.currentStory) return;
        
        this.currentNodeId = 'start';
        
        // Remove menu
        const menu = document.getElementById('stories-menu-modal');
        if (menu) menu.remove();
        
        // Create player view
        let html = `
            <div id="story-player-modal" class="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-[110] flex flex-col fade-in">
                <!-- Header -->
                <div class="p-4 flex items-center justify-between bg-white dark:bg-slate-800 border-b-2 border-slate-200 dark:border-slate-700 shadow-sm z-20">
                    <div class="flex items-center gap-3">
                        <div class="text-2xl">${this.currentStory.icon}</div>
                        <div>
                            <h2 class="text-sm font-black text-slate-800 dark:text-white">${this.currentStory.title_sr}</h2>
                        </div>
                    </div>
                    <button onclick="StoriesEngine.quitStory()" class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 active:scale-95 transition-transform">❌</button>
                </div>
                
                <!-- Chat Area -->
                <div id="story-chat-area" class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 pb-48 scroll-smooth">
                    <!-- Bubbles injected here -->
                </div>

                <!-- Choices Footer -->
                <div id="story-choices-area" class="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-20 transition-transform duration-300 translate-y-full">
                    <div id="choices-container" class="flex flex-col gap-2"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Start node
        setTimeout(() => {
            this.renderNode(this.currentNodeId);
        }, 300);
    },

    quitStory: function() {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();
        const player = document.getElementById('story-player-modal');
        if (player) player.remove();
        this.currentStory = null;
    },

    renderNode: function(nodeId) {
        this.currentNodeId = nodeId;
        const node = this.currentStory.nodes[nodeId];
        if (!node) return;

        const chatArea = document.getElementById('story-chat-area');
        const choicesArea = document.getElementById('story-choices-area');
        const choicesContainer = document.getElementById('choices-container');
        
        // Hide choices initially
        choicesArea.classList.add('translate-y-full');
        
        // Create chat bubble
        const bubbleId = 'bubble-' + Date.now();
        const bubbleHtml = `
            <div id="${bubbleId}" class="flex gap-3 opacity-0 translate-y-4 transition-all duration-500 ease-out max-w-[90%]">
                <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-sm border-2 border-white dark:border-slate-600">
                    ${node.speakerIcon}
                </div>
                <div class="flex flex-col items-start">
                    <span class="text-[10px] font-black text-slate-500 mb-1 ml-1 tracking-wider uppercase">${node.speakerName}</span>
                    <div class="bg-blue-500 text-white p-4 rounded-2xl rounded-tl-sm shadow-md cursor-pointer active:scale-95 transition-transform" onclick="StoriesEngine.replayAudio('${node.sr.replace(/'/g, "\\'")}')">
                        <p class="font-black text-base leading-snug">${node.sr}</p>
                        <p class="text-[11px] text-blue-100 font-medium mt-2 border-t border-blue-400/50 pt-2">${node.en}</p>
                    </div>
                </div>
            </div>
        `;
        
        chatArea.insertAdjacentHTML('beforeend', bubbleHtml);
        
        // Animate bubble in
        setTimeout(() => {
            const el = document.getElementById(bubbleId);
            if(el) {
                el.classList.remove('opacity-0', 'translate-y-4');
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        }, 50);

        // Play audio
        this.replayAudio(node.sr);

        // Show choices after a delay (simulating reading time)
        setTimeout(() => {
            if (node.isEnd) {
                choicesContainer.innerHTML = `
                    <button onclick="StoriesEngine.finishStory()" class="w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl font-black text-lg active:scale-95 transition-all shadow-lg shadow-green-500/30">
                        🎉 ZAVRŠI (Finish)
                    </button>
                `;
                choicesArea.classList.remove('translate-y-full');
            } else if (node.choices && node.choices.length > 0) {
                choicesContainer.innerHTML = node.choices.map((c, i) => `
                    <button onclick="StoriesEngine.handleChoice('${c.next}', '${c.text_sr.replace(/'/g, "\\'")}', '${c.text_en.replace(/'/g, "\\'")}')" class="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 p-4 rounded-xl text-left active:scale-95 transition-all border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-500">
                        <p class="font-black text-slate-800 dark:text-white">${c.text_sr}</p>
                        <p class="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">${c.text_en}</p>
                    </button>
                `).join('');
                choicesArea.classList.remove('translate-y-full');
            }
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 1500);
    },

    replayAudio: function(text) {
        if (window.app && window.app.speakPhrase) {
            window.app.speakPhrase(text, 'sr-RS');
        }
    },

    handleChoice: function(nextNodeId, text_sr, text_en) {
        const chatArea = document.getElementById('story-chat-area');
        const choicesArea = document.getElementById('story-choices-area');
        
        // Hide choices
        choicesArea.classList.add('translate-y-full');
        
        // Render user's choice as a bubble on the right
        const bubbleId = 'bubble-' + Date.now();
        const bubbleHtml = `
            <div id="${bubbleId}" class="flex gap-3 opacity-0 translate-y-4 transition-all duration-500 ease-out self-end max-w-[90%] flex-row-reverse">
                <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-2xl shrink-0 shadow-sm border-2 border-white dark:border-slate-600">
                    👤
                </div>
                <div class="flex flex-col items-end">
                    <span class="text-[10px] font-black text-slate-500 mb-1 mr-1 tracking-wider uppercase">Ti (You)</span>
                    <div class="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-800 p-4 rounded-2xl rounded-tr-sm shadow-md">
                        <p class="font-black text-base leading-snug">${text_sr}</p>
                        <p class="text-[11px] text-slate-300 dark:text-slate-500 font-medium mt-2 border-t border-slate-600 dark:border-slate-300 pt-2">${text_en}</p>
                    </div>
                </div>
            </div>
        `;
        
        chatArea.insertAdjacentHTML('beforeend', bubbleHtml);
        
        // Animate user bubble
        setTimeout(() => {
            const el = document.getElementById(bubbleId);
            if(el) {
                el.classList.remove('opacity-0', 'translate-y-4');
                chatArea.scrollTop = chatArea.scrollHeight;
            }
        }, 50);

        // Proceed to next node after a short delay
        setTimeout(() => {
            this.renderNode(nextNodeId);
        }, 1000);
    },

    finishStory: function() {
        if (window.app && window.app.addXP) {
            window.app.addXP(20);
        }
        if (window.app && window.app.showToast) {
            window.app.showToast('Odlično! Priča završena!', 'success');
        }
        this.quitStory();
    }
};

window.StoriesEngine = StoriesEngine;
