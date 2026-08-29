// [SHIELD_DAEMON: VALIDATED]
// Roleplay Engine - Phase 7 (Arcade Chat Refactor)
// Now works as an open-ended AI chatbot inside the Arcade overlay.
const RoleplayEngine = {
    RANDOM_TOPICS: [
        'Zombie apocalypse in Belgrade', 'Ordering pizza at 3am', 'Lost in the mountains',
        'A day at the beach', 'Job interview at a tech company', 'Buying a car',
        'At the dentist', 'Planning a birthday party', 'Cooking traditional Serbian food',
        'Asking for directions in a new city', 'Meeting your partner\'s parents',
        'Arguing about football', 'At the veterinarian with your pet', 'Renting an apartment',
        'Complaining at a restaurant', 'At the gym asking for help', 'Haggling at a market',
        'Stuck in traffic', 'Booking a hotel room', 'At the pharmacy buying medicine',
        'Describing your dream house', 'Talking about your favorite movie',
        'Making plans for the weekend', 'Reporting a problem to your landlord',
        'At the airport going through customs', 'Returning a broken product to a store',
        'Asking a stranger for the time', 'Talking about the weather', 'At a music festival',
        'Visiting a museum', 'At a wedding reception', 'Emergency room visit',
        'Enrolling in a language school', 'Talking to a police officer', 'At the post office',
        'Calling tech support', 'First day at a new job', 'Debating politics at dinner',
        'Explaining your hobby to someone', 'Catching up with an old school friend',
        'Negotiating a salary raise', 'Describing a painting', 'At a book club meeting',
        'Planning a road trip', 'Talking about childhood memories', 'At the barbershop',
        'Helping a tourist find their way', 'Discussing your favorite recipe',
        'Preparing for an exam', 'Adopting a pet from a shelter'
    ],

    state: {
        activeTopic: null,
        activeGreeting: null,
        history: [],
        isLoading: false,
        aiLang: 'Serbian',
        userLang: 'Serbian',
        nativeLang: 'English',
        aiTtsLang: 'sr-RS',
        role: ''
    },

    _getLangConfig: function() {
        const dir = (window.appState && window.appState.settings && window.appState.settings.learningDirection) || 'sr_to_en';
        const isLearningEnglish = (dir === 'sr_to_en');
        return {
            aiLang: isLearningEnglish ? 'English' : 'Serbian',
            userLang: isLearningEnglish ? 'English' : 'Serbian',
            nativeLang: isLearningEnglish ? 'Serbian' : 'English',
            aiTtsLang: isLearningEnglish ? 'en-US' : 'sr-RS'
        };
    },

    getEffectiveKey: function() {
        let ttsKey = '';
        if (window.appState && window.appState.settings) {
            ttsKey = window.appState.settings.ttsApiKey;
        }
        return ttsKey || window.apiKey || localStorage.getItem('serbolingo_api_key');
    },

    // Start with a specific topic string (e.g. "Ordering coffee at a cafe")
    startScenario: function(topicStr) {
        if (!this.getEffectiveKey()) {
            if (window.app && window.app.showToast) {
                window.app.showToast("Please enter an API Key in the Profile tab first.", "error");
                window.app.navigate('profile');
            }
            return;
        }

        const lang = this._getLangConfig();
        Object.assign(this.state, lang);
        this.state.activeTopic = topicStr;
        this.state.role = `You are role-playing the scenario: "${topicStr}". Act as a realistic character in this situation.`;
        this.state.history = [];

        const greeting = lang.aiLang === 'English'
            ? `Hello! Let's practice the scenario: "${topicStr}". I'll start. How can I help you?`
            : `Zdravo! Hajde da vežbamo situaciju: "${topicStr}". Ja počinjem. Kako mogu da vam pomognem?`;

        this.state.activeGreeting = greeting;
        this.state.history.push({ role: 'model', text: greeting });

        this._showOverlay(`🎭 ${topicStr}`);
        this.renderChat();

        if (window.app && window.app.speakPhrase) {
            setTimeout(() => window.app.speakPhrase(greeting, lang.aiTtsLang), 500);
        }
    },

    // Free chat - no scenario, just talk
    startFreeChat: function() {
        if (!this.getEffectiveKey()) {
            if (window.app && window.app.showToast) {
                window.app.showToast("Please enter an API Key in the Profile tab first.", "error");
                window.app.navigate('profile');
            }
            return;
        }

        const lang = this._getLangConfig();
        Object.assign(this.state, lang);
        this.state.activeTopic = '__free_chat__';
        this.state.role = `You are a friendly conversational partner. Talk naturally about anything the user brings up.`;
        this.state.history = [];

        const greeting = lang.aiLang === 'English'
            ? `Hey there! I'm your language buddy. Talk to me about anything you want – I'm all ears! 😊`
            : `Ćao! Ja sam tvoj jezički prijatelj. Pričaj sa mnom o čemu god želiš – slušam te! 😊`;

        this.state.activeGreeting = greeting;
        this.state.history.push({ role: 'model', text: greeting });

        this._showOverlay('🗣️ Free Chat');
        this.renderChat();

        if (window.app && window.app.speakPhrase) {
            setTimeout(() => window.app.speakPhrase(greeting, lang.aiTtsLang), 500);
        }
    },

    // Random topic
    startRandom: function() {
        const topic = this.RANDOM_TOPICS[Math.floor(Math.random() * this.RANDOM_TOPICS.length)];
        this.startScenario(topic);
    },

    // Close the chat overlay and go back to the arcade grid
    quitChat: function() {
        this.state.history = [];
        this.state.activeTopic = null;
        this.state.isLoading = false;
        const overlay = document.getElementById('arcade-chat-overlay');
        if (overlay) overlay.classList.add('hidden');
    },

    _showOverlay: function(title) {
        const overlay = document.getElementById('arcade-chat-overlay');
        if (overlay) overlay.classList.remove('hidden');

        const titleEl = document.getElementById('arcade-chat-title');
        if (titleEl) titleEl.textContent = title;

        const input = document.getElementById('arcade-chat-input');
        if (input) {
            input.value = '';
            input.placeholder = this.state.aiLang === 'English' ? 'Type in English...' : 'Kucaj na srpskom...';
            setTimeout(() => input.focus(), 300);
        }
    },

    sendMessage: async function(text) {
        if (!text || !text.trim() || this.state.isLoading) return;

        const apiKey = this.getEffectiveKey();
        if (!apiKey) {
            if (window.app && window.app.showToast) {
                window.app.showToast("Please enter an API Key in the Profile tab first.", "error");
                window.app.navigate('profile');
            }
            return;
        }

        this.state.history.push({ role: 'user', text: text.trim() });
        this.state.isLoading = true;
        this.renderChat();

        try {
            const contents = this.state.history.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            const systemInstruction = `You are a native ${this.state.aiLang} speaker. ${this.state.role}
The user is a beginner learning ${this.state.aiLang}. 
Rules:
1. Speak ONLY in ${this.state.aiLang}.
2. Keep your responses short and natural (1-3 sentences max).
3. If the user makes a grammatical error or uses the wrong word, you MUST start your response with a ${this.state.nativeLang} correction in brackets like this: [Correction: In ${this.state.aiLang}, you should say X instead of Y]. Then continue your response in ${this.state.aiLang}. If there is no error, do not include brackets.`;

            const payload = {
                system_instruction: { parts: [{ text: systemInstruction }] },
                contents: contents,
                generationConfig: { temperature: 0.7 }
            };

            let response = null;
            let success = false;
            const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash'];

            for (const model of models) {
                try {
                    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (response.ok) { success = true; break; }
                } catch(e) { /* Try next model */ }
            }

            if (!success || !response) throw new Error('Could not connect to any model');

            const data = await response.json();
            let aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

            let correction = null;
            const correctionMatch = aiResponse.match(/\[Correction:(.*?)\]/i);
            if (correctionMatch) {
                correction = correctionMatch[1].trim();
                aiResponse = aiResponse.replace(/\[Correction:.*?\]/i, '').trim();
            }

            this.state.history.push({ role: 'model', text: aiResponse, correction: correction });
            this.state.isLoading = false;
            this.renderChat();

            if (window.app && window.app.speakPhrase && aiResponse) {
                window.app.speakPhrase(aiResponse, this.state.aiTtsLang);
            }

        } catch (error) {
            console.error('Chat API Error:', error);
            this.state.isLoading = false;
            if (window.app) window.app.showToast('Greška u konekciji. (Network Error)', 'error');
            this.state.history.pop();
            this.renderChat();
        }
    },

    renderChat: function() {
        const container = document.getElementById('arcade-chat-history');
        if (!container) return;

        const aiTtsLang = this.state.aiTtsLang || 'sr-RS';
        let html = '';

        this.state.history.forEach(msg => {
            if (msg.role === 'model') {
                const safeText = msg.text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                html += `
                    <div class="flex flex-col items-start max-w-[85%] self-start mb-4">
                        ${msg.correction ? `<div class="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 text-[10px] font-bold px-3 py-1.5 rounded-t-xl rounded-br-xl mb-1 border border-yellow-200 dark:border-yellow-700/50 flex items-center gap-1"><span class="text-xs">💡</span> ${msg.correction}</div>` : ''}
                        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 p-3 rounded-2xl rounded-tl-sm shadow-sm relative group">
                            <span class="text-[15px] font-medium leading-snug">${msg.text}</span>
                            <button onclick="app.speakPhrase('${safeText}', '${aiTtsLang}')" class="absolute -right-10 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">🔊</button>
                        </div>
                    </div>`;
            } else {
                html += `
                    <div class="flex flex-col items-end max-w-[85%] self-end mb-4">
                        <div class="bg-blue-500 text-white p-3 rounded-2xl rounded-tr-sm shadow-md">
                            <span class="text-[15px] font-medium leading-snug">${msg.text}</span>
                        </div>
                    </div>`;
            }
        });

        if (this.state.isLoading) {
            html += `
                <div class="flex flex-col items-start max-w-[85%] self-start mb-4">
                    <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1">
                        <div class="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>`;
        }

        container.innerHTML = html;

        setTimeout(() => {
            const wrapper = document.getElementById('arcade-chat-wrapper');
            if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
        }, 50);

        const input = document.getElementById('arcade-chat-input');
        if (input && !this.state.isLoading) {
            input.value = '';
            input.focus();
        }
    },

    handleInputKeypress: function(e) {
        if (e.key === 'Enter') {
            const input = document.getElementById('arcade-chat-input');
            if (input) this.sendMessage(input.value);
        }
    }
};

window.RoleplayEngine = RoleplayEngine;
