// [SHIELD_DAEMON: VALIDATED] 🛡️
// SerboLingo — "Monty Winner" Complete Victory Celebration Studio & Multimedia Flex (Priority 12.2)
// 5s Selfie Video Loop, Camera/Upload Photo Editor, Bilingual Safety Shield, 7-Day Frequency Cap & Social Share Grid.

const MontyWinner = {
    STORAGE_KEY: 'serbolingo_monty_winner',
    POPUP_DISMISS_KEY: 'serbolingo_monty_popup_dismissed',
    REPORTED_KEY: 'serbolingo_monty_reported',

    DEFAULT_QUOTES: [
        "Brate, padeži su mačji kašalj! 🦁",
        "Ko to tamo uči? Ja! 🚌",
        "Nema predaje, samo pobeda! ⚡",
        "Idemo bre do vrha! 🎺",
        "Srpski tečno, kafanski lagano! ☕"
    ],

    // Profanity blacklist (Serbian + English vulgarities & slurs)
    PROFANITY_LIST: [
        'jeb', 'jebem', 'jebi', 'jebote', 'kurac', 'kurca', 'kurcina', 'picka', 'pička',
        'picko', 'govno', 'govna', 'sranje', 'drkanje', 'drkaj', 'dupe', 'pedercina',
        'peder', 'cigani', 'siptar', 'šiptar', 'ustasa', 'ustaša', 'cetnik', 'četnik',
        'fuck', 'fucking', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'nigger', 'nigga', 'faggot'
    ],

    // Recording & Camera State
    mediaStream: null,
    mediaRecorder: null,
    videoChunks: [],
    audioChunks: [],
    audioCtx: null,
    recordTimer: null,

    // 1. Data Store
    getData: function() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            hasWon: false,
            title: 'Šampion Znanja',
            quote: this.DEFAULT_QUOTES[0],
            isAnonymous: false,
            mediaType: 'avatar', // 'avatar' | 'video' | 'camera' | 'upload'
            videoBase64: null,
            photoBase64: null,
            photoRotation: 0,
            photoFilter: 'gold', // 'normal' | 'gold' | 'retro' | 'bw'
            voicePreset: 'trumpet', // 'trumpet' | 'cheer' | 'tts' | 'recorded'
            recordedAudioBase64: null,
            optInSizzle: true,
            safetyPledgeAgreed: false,
            totalWins: 0,
            lastWinDate: null,
            monthYear: new Date().toLocaleDateString('sr-RS', { month: 'long', year: 'numeric' })
        };
    },

    saveData: function(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    },

    // 2. Bilingual Profanity & Safety Validation
    validateQuote: function(text) {
        if (!text || !text.trim()) return { isValid: false, error: 'Poruka ne može biti prazna.' };
        const clean = text.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/g, ' ');

        for (const bad of this.PROFANITY_LIST) {
            if (clean.includes(bad)) {
                return {
                    isValid: false,
                    error: '⚠️ Nije dozvoljen neprimeren rečnik. Molimo unesite prikladnu poruku za zajednicu.'
                };
            }
        }
        return { isValid: true, cleaned: text.trim().slice(0, 100) };
    },

    // 3. Web Audio Fanfares
    playFanfare: function(type = 'trumpet') {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!this.audioCtx) this.audioCtx = new AudioContext();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

            const ctx = this.audioCtx;
            const now = ctx.currentTime;

            if (type === 'trumpet' || type === 'fanfare') {
                const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
                const timings = [0, 0.15, 0.30, 0.45, 0.70];
                const durations = [0.12, 0.12, 0.12, 0.20, 0.80];

                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now + timings[i]);

                    gain.gain.setValueAtTime(0, now + timings[i]);
                    gain.gain.linearRampToValueAtTime(0.3, now + timings[i] + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + timings[i] + durations[i]);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(now + timings[i]);
                    osc.stop(now + timings[i] + durations[i] + 0.1);
                });
            } else if (type === 'cheer') {
                const bufferSize = ctx.sampleRate * 1.5;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.value = 1000;
                filter.Q.value = 1.5;

                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);
                noise.start(now);
            }
        } catch (e) {
            console.warn('[MontyWinner] Fanfare error:', e);
        }
    },

    spawnConfetti: function() {
        const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
        const container = document.getElementById('monty-confetti-container');
        if (!container) return;

        for (let i = 0; i < 60; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.left = `${Math.random() * 100}%`;
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animationDelay = `${Math.random() * 2}s`;
            conf.style.animationDuration = `${2.5 + Math.random() * 2}s`;
            conf.style.transform = `scale(${0.6 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`;
            container.appendChild(conf);
            setTimeout(() => conf.remove(), 5000);
        }
    },

    // 4. Trigger Full-Screen Celebration Pop-Up
    triggerCelebration: function(opts = {}) {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('fanfare');

        const title = opts.title || 'MONTY WINNER 🌟';
        const subtitle = opts.subtitle || 'Pobednik Meseca & Šampion Igraonice!';
        const rewardGems = opts.gems || 100;
        const rewardXp = opts.xp || 250;

        const d = this.getData();
        d.hasWon = true;
        d.totalWins = (d.totalWins || 0) + 1;
        d.lastWinDate = new Date().toLocaleDateString('sr-RS');
        this.saveData(d);

        if (window.state && window.state.user) {
            window.state.user.gems = (window.state.user.gems || 0) + rewardGems;
            window.state.user.xp = (window.state.user.xp || 0) + rewardXp;
            if (typeof app !== 'undefined' && app.saveUserData) app.saveUserData();
            if (typeof app !== 'undefined' && app.updateTopBar) app.updateTopBar();
        }

        this.playFanfare('trumpet');
        this.renderCelebrationModal({ title, subtitle, rewardGems, rewardXp });
        this.spawnConfetti();
    },

    // 5. Celebration & Creator Studio Modal DOM
    renderCelebrationModal: function(config) {
        let existing = document.getElementById('monty-winner-modal');
        if (existing) existing.remove();

        const user = window.state?.user || { name: 'Šampion', avatar: '🦁' };
        const data = this.getData();

        const modal = document.createElement('div');
        modal.id = 'monty-winner-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in';
        modal.innerHTML = `
            <div id="monty-confetti-container" class="absolute inset-0 pointer-events-none overflow-hidden"></div>
            
            <div class="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-yellow-400/80 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-yellow-500/30 text-white my-auto max-h-[94vh] overflow-y-auto no-scrollbar">
                
                <button onclick="MontyWinner.closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-black transition-colors z-20">
                    ✕
                </button>

                <!-- Header -->
                <div class="text-center relative pt-2">
                    <div class="inline-flex relative items-center justify-center mb-2">
                        <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center text-4xl sm:text-5xl shadow-lg shadow-yellow-500/40 animate-pulse">
                            🏆
                        </div>
                        <span class="absolute -top-3 -right-2 text-2xl animate-bounce">👑</span>
                    </div>

                    <div class="inline-block px-3 py-1 bg-yellow-400/20 border border-yellow-300/40 rounded-full text-yellow-300 font-black text-[11px] uppercase tracking-widest mb-1.5">
                        ${config.title}
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-r from-yellow-200 via-amber-300 to-yellow-500">
                        ČESTITAMO! TI SI POBEDNIK!
                    </h2>
                    <p class="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                        ${config.subtitle}
                    </p>
                </div>

                <!-- Reward Badges -->
                <div class="grid grid-cols-2 gap-3 my-4">
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-yellow-400/40 flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-xl bg-yellow-400/30 flex items-center justify-center text-2xl shrink-0">
                            💎
                        </div>
                        <div>
                            <div class="text-[10px] text-yellow-200 font-bold uppercase tracking-wider">Nagrada</div>
                            <div class="text-base sm:text-lg font-black text-white">+${config.rewardGems} Dijamanata</div>
                        </div>
                    </div>
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-400/40 flex items-center gap-2.5">
                        <div class="w-10 h-10 rounded-xl bg-blue-400/30 flex items-center justify-center text-2xl shrink-0">
                            ⚡
                        </div>
                        <div>
                            <div class="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Iskustvo</div>
                            <div class="text-base sm:text-lg font-black text-white">+${config.rewardXp} XP</div>
                        </div>
                    </div>
                </div>

                <!-- Creator Studio Box -->
                <div class="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-4">
                    
                    <div class="flex items-center justify-between border-b border-slate-700 pb-2">
                        <h3 class="text-xs font-black uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
                            <span>🎨</span> <span>Studio Šampiona: Izaberi Svoj Flex</span>
                        </h3>
                        <label class="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 cursor-pointer">
                            <input type="checkbox" id="monty-anon-toggle" ${data.isAnonymous ? 'checked' : ''} onchange="MontyWinner.toggleAnonymous(this.checked)" class="rounded text-yellow-500 focus:ring-yellow-400">
                            <span>Anonimno 🎭</span>
                        </label>
                    </div>

                    <!-- 1. Media Type Selector -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1.5">
                            🎬 Izaberi Vizuelni Format:
                        </label>
                        <div class="grid grid-cols-4 gap-2 text-center">
                            <button onclick="MontyWinner.setMediaType('avatar')" id="monty-media-avatar" class="p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${data.mediaType === 'avatar' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span class="text-base">🎭</span> <span class="text-[10px]">Avatar</span>
                            </button>
                            <button onclick="MontyWinner.setMediaType('video')" id="monty-media-video" class="p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${data.mediaType === 'video' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span class="text-base">📹</span> <span class="text-[10px]">Video (5s)</span>
                            </button>
                            <button onclick="MontyWinner.setMediaType('camera')" id="monty-media-camera" class="p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${data.mediaType === 'camera' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span class="text-base">📸</span> <span class="text-[10px]">Selfi</span>
                            </button>
                            <button onclick="MontyWinner.setMediaType('upload')" id="monty-media-upload" class="p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${data.mediaType === 'upload' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span class="text-base">📁</span> <span class="text-[10px]">Uvezi Sliku</span>
                            </button>
                        </div>
                    </div>

                    <!-- Media Interactive Viewport (Preview & Controls) -->
                    <div id="monty-media-viewport" class="p-4 rounded-2xl bg-slate-950/60 border border-slate-700/60 flex flex-col items-center justify-center min-h-[140px] relative">
                        <!-- Populated by updateMediaViewport() -->
                    </div>

                    <!-- 2. Victory Quote & Profanity Shield -->
                    <div>
                        <div class="flex items-center justify-between mb-1.5">
                            <label class="text-[11px] font-bold text-slate-300">
                                💬 Tvoja Pobednička Poruka (Victory Quote):
                            </label>
                            <span id="monty-quote-len" class="text-[10px] text-slate-400 font-bold">0/100</span>
                        </div>
                        <input id="monty-input-quote" type="text" maxlength="100" value="${data.quote || this.DEFAULT_QUOTES[0]}" oninput="MontyWinner.onQuoteInput(this.value)" class="w-full bg-slate-900 border border-slate-600 focus:border-yellow-400 text-white rounded-xl px-3 py-2 text-xs font-medium outline-none transition-colors" placeholder="Upiši svoju pobedničku izjavu...">
                        <div id="monty-quote-error" class="hidden text-[10px] text-rose-400 font-bold mt-1"></div>
                        
                        <!-- Quick Pick Chips -->
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            ${this.DEFAULT_QUOTES.map(q => `
                                <button onclick="MontyWinner.setQuickQuote('${q.replace(/'/g, "\\'")}')" class="text-[10px] bg-slate-700/60 hover:bg-yellow-400/20 hover:text-yellow-200 text-slate-300 px-2 py-1 rounded-lg transition-colors border border-slate-600/50">
                                    ${q}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 3. Voice Audio Flex -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1.5">
                            🎺 Tvoj Pobednički Zvuk (Audio Flex):
                        </label>
                        <div class="grid grid-cols-4 gap-2">
                            <button onclick="MontyWinner.selectVoicePreset('trumpet')" id="monty-voice-trumpet" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'trumpet' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span>🎺</span> <span class="text-[10px]">Trubači</span>
                            </button>
                            <button onclick="MontyWinner.selectVoicePreset('cheer')" id="monty-voice-cheer" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'cheer' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span>👏</span> <span class="text-[10px]">Ovacije</span>
                            </button>
                            <button onclick="MontyWinner.selectVoicePreset('tts')" id="monty-voice-tts" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'tts' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span>🗣️</span> <span class="text-[10px]">Govor</span>
                            </button>
                            <button onclick="MontyWinner.startVoiceRecording()" id="monty-voice-record" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'recorded' ? 'bg-red-500/20 border-red-400 text-red-300' : 'bg-slate-900/60 border-slate-700 text-slate-400'}">
                                <span id="monty-record-icon">🎙️</span> <span id="monty-record-label" class="text-[10px]">Snimi Glas</span>
                            </button>
                        </div>
                    </div>

                    <!-- 4. Community Sizzle Reel -->
                    <div class="pt-2 border-t border-slate-700/60">
                        <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                            <input type="checkbox" id="monty-optin-sizzle" ${data.optInSizzle ? 'checked' : ''} onchange="MontyWinner.toggleOptIn(this.checked)" class="mt-0.5 rounded text-yellow-500 focus:ring-yellow-400 w-4 h-4">
                            <span class="text-[11px] leading-tight">
                                ⭐ <strong>Community Sizzle Reel:</strong> Dozvoli prikazivanje mog šampionskog posta na tabli pobednika meseca.
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Action Buttons: Share & Download -->
                <div class="mt-5 space-y-2.5">
                    <button onclick="MontyWinner.openShareSheet()" id="monty-btn-share" class="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-yellow-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span>📤</span> <span>Podeli Pobedu na Društvenim Mrežama</span>
                    </button>
                    
                    <button onclick="MontyWinner.exportVictoryCard()" class="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-yellow-300 font-bold text-xs rounded-xl border border-yellow-400/30 flex items-center justify-center gap-1.5">
                        <span>💾</span> <span>Preuzmi HD Pobedničku Karticu (PNG)</span>
                    </button>
                    
                    <button onclick="MontyWinner.closeModal()" class="w-full py-2 px-4 bg-transparent hover:bg-slate-800/50 text-slate-400 font-bold text-xs rounded-xl transition-colors">
                        Zatvori Studio
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.updateMediaViewport();
        this.onQuoteInput(data.quote || this.DEFAULT_QUOTES[0]);
    },

    // 6. Media Viewport Manager (Avatar / Video / Camera / Upload)
    setMediaType: function(type) {
        const d = this.getData();
        if (type === 'video' || type === 'camera' || type === 'upload') {
            if (!d.safetyPledgeAgreed) {
                this.showSafetyPledge(() => {
                    d.safetyPledgeAgreed = true;
                    d.mediaType = type;
                    this.saveData(d);
                    this.updateMediaViewport();
                });
                return;
            }
        }
        d.mediaType = type;
        this.saveData(d);
        this.updateMediaViewport();
    },

    showSafetyPledge: function(onAccept) {
        let existing = document.getElementById('monty-safety-modal');
        if (existing) existing.remove();

        const pledge = document.createElement('div');
        pledge.id = 'monty-safety-modal';
        pledge.className = 'fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
        pledge.innerHTML = `
            <div class="bg-slate-900 border-2 border-yellow-500/80 rounded-2xl p-5 max-w-sm text-center text-white shadow-2xl space-y-4">
                <div class="text-3xl">🔞 🛡️</div>
                <h3 class="text-base font-black text-yellow-300">Sigurnosni Zavet Zajednice</h3>
                <p class="text-xs text-slate-300 leading-relaxed text-left bg-slate-800 p-3 rounded-xl border border-slate-700">
                    Kao Monty Šampion, tvoj sadržaj vide drugi učenici. Strogo je zabranjeno objavljivanje vulgarnosti, psovki, neprikladnih gestikulacija i golotinje. Prekršioci gube nalog i status šampiona.
                </p>
                <div class="space-y-2">
                    <button id="monty-pledge-accept" class="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95">
                        Razumem i Prihvatam Pravila
                    </button>
                    <button onclick="document.getElementById('monty-safety-modal').remove()" class="w-full py-2 px-4 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl">
                        Otkaži (Ostani na Avataru)
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(pledge);

        document.getElementById('monty-pledge-accept').onclick = () => {
            pledge.remove();
            if (onAccept) onAccept();
        };
    },

    updateMediaViewport: function() {
        const vp = document.getElementById('monty-media-viewport');
        if (!vp) return;
        const d = this.getData();
        const user = window.state?.user || { avatar: '🦁', name: 'Šampion' };

        // Highlight tab buttons
        ['avatar', 'video', 'camera', 'upload'].forEach(t => {
            const btn = document.getElementById(`monty-media-${t}`);
            if (btn) {
                if (t === d.mediaType) {
                    btn.className = 'p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm';
                } else {
                    btn.className = 'p-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 bg-slate-900/60 border-slate-700 text-slate-400';
                }
            }
        });

        // 1. AVATAR MODE
        if (d.mediaType === 'avatar' || d.isAnonymous) {
            vp.innerHTML = `
                <div class="w-24 h-24 rounded-full border-4 border-yellow-400 bg-slate-900 flex items-center justify-center text-5xl shadow-lg shadow-yellow-500/30 relative">
                    ${d.isAnonymous ? '🎭' : (user.avatar || '🦁')}
                    <span class="absolute -top-2 -right-1 text-xl">👑</span>
                </div>
                <p class="text-[11px] font-bold text-slate-300 mt-2">
                    ${d.isAnonymous ? 'Anonimni Šampion 🎭' : user.name}
                </p>
                <span class="text-[10px] text-slate-500">Mascot Avatar na Monty Tabli</span>
            `;
            return;
        }

        // 2. VIDEO MODE (5s Loop)
        if (d.mediaType === 'video') {
            if (d.videoBase64) {
                vp.innerHTML = `
                    <div class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl shadow-yellow-500/40">
                        <video src="${d.videoBase64}" autoplay loop muted playsinline class="w-full h-full object-cover"></video>
                        <span class="absolute top-1 right-2 text-sm">👑</span>
                    </div>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="MontyWinner.startVideoRecording()" class="text-[10px] bg-slate-800 hover:bg-slate-700 text-yellow-300 px-2.5 py-1 rounded-lg border border-yellow-500/40">
                            🔄 Ponovo Snimi
                        </button>
                        <button onclick="MontyWinner.clearVideo()" class="text-[10px] bg-slate-800 hover:bg-rose-900/40 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/40">
                            🗑️ Obriši
                        </button>
                    </div>
                `;
            } else {
                vp.innerHTML = `
                    <div id="monty-video-container" class="w-28 h-28 rounded-full border-4 border-dashed border-yellow-400/60 bg-slate-900/80 flex flex-col items-center justify-center text-center p-2">
                        <span class="text-2xl mb-1">📹</span>
                        <span class="text-[9px] font-bold text-yellow-300">5-Sec Video</span>
                    </div>
                    <button onclick="MontyWinner.startVideoRecording()" class="mt-2.5 py-1.5 px-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 flex items-center gap-1.5">
                        <span>🔴</span> <span>Pokreni Kameru (5s)</span>
                    </button>
                    <span id="monty-video-timer" class="text-[10px] text-slate-400 mt-1">Snimi kratku pobedničku reakciju</span>
                `;
            }
            return;
        }

        // 3. CAMERA / UPLOAD PHOTO MODE
        if (d.mediaType === 'camera' || d.mediaType === 'upload') {
            const photoSrc = d.photoBase64;
            if (photoSrc) {
                const filterClass = d.photoFilter === 'gold' ? 'filter-gold-glow' :
                                    d.photoFilter === 'retro' ? 'sepia contrast-125' :
                                    d.photoFilter === 'bw' ? 'grayscale' : '';
                vp.innerHTML = `
                    <div class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl shadow-yellow-500/40">
                        <img id="monty-photo-img" src="${photoSrc}" style="transform: rotate(${d.photoRotation}deg);" class="w-full h-full object-cover ${filterClass}">
                        <span class="absolute top-1 right-2 text-sm">👑</span>
                    </div>
                    <!-- Photo Tools -->
                    <div class="flex items-center gap-1.5 mt-2.5">
                        <button onclick="MontyWinner.rotatePhoto()" class="text-[10px] bg-slate-800 text-slate-200 px-2 py-1 rounded-lg border border-slate-700" title="Rotiraj">
                            🔄 90°
                        </button>
                        <button onclick="MontyWinner.cycleFilter()" class="text-[10px] bg-slate-800 text-yellow-300 px-2 py-1 rounded-lg border border-slate-700">
                            ✨ Filter: ${d.photoFilter}
                        </button>
                        <button onclick="MontyWinner.clearPhoto()" class="text-[10px] bg-slate-800 text-rose-300 px-2 py-1 rounded-lg border border-slate-700">
                            🗑️
                        </button>
                    </div>
                `;
            } else if (d.mediaType === 'camera') {
                vp.innerHTML = `
                    <div id="monty-camera-preview" class="w-28 h-28 rounded-full border-4 border-dashed border-yellow-400/60 bg-slate-900/80 flex flex-col items-center justify-center text-center p-2">
                        <span class="text-2xl mb-1">📸</span>
                        <span class="text-[9px] font-bold text-yellow-300">Selfi Foto</span>
                    </div>
                    <button onclick="MontyWinner.captureSelfie()" class="mt-2.5 py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 flex items-center gap-1.5">
                        <span>📸</span> <span>Uslikaj se</span>
                    </button>
                `;
            } else if (d.mediaType === 'upload') {
                vp.innerHTML = `
                    <input type="file" id="monty-file-input" accept="image/*" onchange="MontyWinner.onFileSelected(this.files[0])" class="hidden">
                    <div class="w-28 h-28 rounded-full border-4 border-dashed border-yellow-400/60 bg-slate-900/80 flex flex-col items-center justify-center text-center p-2 cursor-pointer hover:border-yellow-300 transition-colors" onclick="document.getElementById('monty-file-input').click()">
                        <span class="text-2xl mb-1">📁</span>
                        <span class="text-[9px] font-bold text-yellow-300">Uvezi Sliku</span>
                    </div>
                    <button onclick="document.getElementById('monty-file-input').click()" class="mt-2.5 py-1.5 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 flex items-center gap-1.5">
                        <span>📁</span> <span>Izaberi fajl</span>
                    </button>
                `;
            }
        }
    },

    // 7. 5-Second Video Reaction Recorder
    startVideoRecording: async function() {
        const vp = document.getElementById('monty-media-viewport');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 320, facingMode: 'user' }, audio: true });
            this.mediaStream = stream;

            vp.innerHTML = `
                <div class="relative w-28 h-28 rounded-full overflow-hidden border-4 border-red-500 shadow-xl shadow-red-500/40">
                    <video id="monty-live-video" autoplay playsinline muted class="w-full h-full object-cover"></video>
                    <div id="monty-countdown-badge" class="absolute inset-0 bg-black/40 flex items-center justify-center text-3xl font-black text-white animate-pulse">
                        5
                    </div>
                </div>
                <div class="text-[10px] text-red-400 font-bold mt-2 animate-pulse">
                    🔴 Snimanje reakcije u toku (Govori i nasmej se)...
                </div>
            `;

            const vid = document.getElementById('monty-live-video');
            vid.srcObject = stream;

            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            this.videoChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.videoChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.videoChunks, { type: 'video/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const d = this.getData();
                    d.videoBase64 = reader.result;
                    this.saveData(d);
                    this.updateMediaViewport();
                    if (typeof app !== 'undefined' && app.showToast) app.showToast('✅ Pobednički video sačuvan!', 'success');
                };
                reader.readAsDataURL(blob);

                stream.getTracks().forEach(t => t.stop());
            };

            this.mediaRecorder.start();

            let sec = 5;
            const badge = document.getElementById('monty-countdown-badge');
            this.recordTimer = setInterval(() => {
                sec--;
                if (badge) badge.innerText = sec;
                if (sec <= 0) {
                    clearInterval(this.recordTimer);
                    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                        this.mediaRecorder.stop();
                    }
                }
            }, 1000);

        } catch (err) {
            console.warn('[MontyWinner] Video camera access error:', err);
            alert('Kamera nije dostupna ili dozvola nije data. Možete izabrati sliku ili avatar.');
            this.setMediaType('avatar');
        }
    },

    clearVideo: function() {
        const d = this.getData();
        d.videoBase64 = null;
        this.saveData(d);
        this.updateMediaViewport();
    },

    // 8. Selfie Capture
    captureSelfie: async function() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480, facingMode: 'user' } });
            const vid = document.createElement('video');
            vid.autoplay = true;
            vid.playsInline = true;
            vid.srcObject = stream;

            await new Promise(r => vid.onloadedmetadata = r);
            const canvas = document.createElement('canvas');
            canvas.width = 480;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(vid, 0, 0, 480, 480);
            stream.getTracks().forEach(t => t.stop());

            const base64 = canvas.toDataURL('image/jpeg', 0.85);
            const d = this.getData();
            d.photoBase64 = base64;
            d.photoRotation = 0;
            this.saveData(d);
            this.updateMediaViewport();
        } catch (e) {
            alert('Kamera nije dostupna. Možete uvesti sliku iz galerije.');
            this.setMediaType('upload');
        }
    },

    onFileSelected: function(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const d = this.getData();
            d.photoBase64 = e.target.result;
            d.photoRotation = 0;
            this.saveData(d);
            this.updateMediaViewport();
        };
        reader.readAsDataURL(file);
    },

    rotatePhoto: function() {
        const d = this.getData();
        d.photoRotation = (d.photoRotation + 90) % 360;
        this.saveData(d);
        const img = document.getElementById('monty-photo-img');
        if (img) img.style.transform = `rotate(${d.photoRotation}deg)`;
    },

    cycleFilter: function() {
        const filters = ['normal', 'gold', 'retro', 'bw'];
        const d = this.getData();
        const next = filters[(filters.indexOf(d.photoFilter) + 1) % filters.length];
        d.photoFilter = next;
        this.saveData(d);
        this.updateMediaViewport();
    },

    clearPhoto: function() {
        const d = this.getData();
        d.photoBase64 = null;
        this.saveData(d);
        this.updateMediaViewport();
    },

    toggleAnonymous: function(val) {
        const d = this.getData();
        d.isAnonymous = val;
        this.saveData(d);
        this.updateMediaViewport();
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(val ? '🎭 Anonimni mod aktiviran!' : 'Prikazuje se tvoj stvarni profil.', 'info');
        }
    },

    // 9. Quote Input Handler with Validation
    onQuoteInput: function(val) {
        const counter = document.getElementById('monty-quote-len');
        const errEl = document.getElementById('monty-quote-error');
        const shareBtn = document.getElementById('monty-btn-share');

        if (counter) counter.innerText = `${val.length}/100`;

        const check = this.validateQuote(val);
        if (!check.isValid) {
            if (errEl) {
                errEl.innerText = check.error;
                errEl.classList.remove('hidden');
            }
            if (shareBtn) shareBtn.disabled = true;
        } else {
            if (errEl) errEl.classList.add('hidden');
            if (shareBtn) shareBtn.disabled = false;
            const d = this.getData();
            d.quote = val;
            this.saveData(d);
        }
    },

    setQuickQuote: function(q) {
        const inp = document.getElementById('monty-input-quote');
        if (inp) inp.value = q;
        this.onQuoteInput(q);
    },

    selectVoicePreset: function(type) {
        const d = this.getData();
        d.voicePreset = type;
        this.saveData(d);

        ['trumpet', 'cheer', 'tts', 'recorded'].forEach(p => {
            const btn = document.getElementById(`monty-voice-${p}`);
            if (btn) {
                if (p === type) {
                    btn.className = 'p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm';
                } else {
                    btn.className = 'p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 bg-slate-900/60 border-slate-700 text-slate-400';
                }
            }
        });

        if (type === 'trumpet') this.playFanfare('trumpet');
        else if (type === 'cheer') this.playFanfare('cheer');
        else if (type === 'tts' && typeof app !== 'undefined' && app.speakPhrase) {
            app.speakPhrase(d.quote || 'Tako se to radi!');
        }
    },

    startVoiceRecording: async function() {
        const iconEl = document.getElementById('monty-record-icon');
        const labelEl = document.getElementById('monty-record-label');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream);
            const chunks = [];

            mr.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
            mr.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    const d = this.getData();
                    d.voicePreset = 'recorded';
                    d.recordedAudioBase64 = reader.result;
                    this.saveData(d);
                    this.selectVoicePreset('recorded');
                    if (labelEl) labelEl.innerText = 'Preslušaj';
                    if (iconEl) iconEl.innerText = '▶️';
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(t => t.stop());
            };

            mr.start();
            if (iconEl) iconEl.innerText = '⏹️';
            if (labelEl) labelEl.innerText = 'Snima se...';
            setTimeout(() => { if (mr.state === 'recording') mr.stop(); }, 4000);
        } catch (e) {
            alert('Mikrofon nije dostupan.');
            this.selectVoicePreset('trumpet');
        }
    },

    toggleOptIn: function(checked) {
        const d = this.getData();
        d.optInSizzle = checked;
        this.saveData(d);
    },

    // 10. Expanded Quick-Share Social Grid Sheet
    openShareSheet: function() {
        const d = this.getData();
        const user = window.state?.user || { name: 'Šampion' };
        const shareName = d.isAnonymous ? 'Anonimni Šampion' : user.name;
        const shareText = `🏆 Postao sam Monty Šampion Meseca u SerboLingo aplikaciji! Moja poruka: "${d.quote || this.DEFAULT_QUOTES[0]}" — Uči besplatno srpski i engleski:`;
        const appUrl = 'https://iwillrockyoux3.github.io/serbolingo/';

        let existing = document.getElementById('monty-share-sheet');
        if (existing) existing.remove();

        const sheet = document.createElement('div');
        sheet.id = 'monty-share-sheet';
        sheet.className = 'fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in';
        sheet.innerHTML = `
            <div class="bg-slate-900 border-2 border-yellow-400 rounded-3xl p-5 max-w-sm w-full text-white shadow-2xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">📤</span>
                        <h3 class="font-black text-sm text-yellow-300">Podeli Pobednički Post</h3>
                    </div>
                    <button onclick="document.getElementById('monty-share-sheet').remove()" class="text-slate-400 hover:text-white font-black">✕</button>
                </div>

                <div class="grid grid-cols-4 gap-2.5 text-center">
                    <!-- WhatsApp -->
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + appUrl)}" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex flex-col items-center gap-1 transition-all">
                        <span class="text-2xl">🟢</span>
                        <span class="text-[9px] font-bold">WhatsApp</span>
                    </a>
                    <!-- Viber -->
                    <a href="viber://forward?text=${encodeURIComponent(shareText + ' ' + appUrl)}" class="p-2.5 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 flex flex-col items-center gap-1 transition-all">
                        <span class="text-2xl">🟣</span>
                        <span class="text-[9px] font-bold">Viber</span>
                    </a>
                    <!-- Telegram -->
                    <a href="https://t.me/share/url?url=${encodeURIComponent(appUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 flex flex-col items-center gap-1 transition-all">
                        <span class="text-2xl">✈️</span>
                        <span class="text-[9px] font-bold">Telegram</span>
                    </a>
                    <!-- X / Twitter -->
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}" target="_blank" rel="noopener noreferrer" class="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 flex flex-col items-center gap-1 transition-all">
                        <span class="text-2xl">🐦</span>
                        <span class="text-[9px] font-bold">X (Twitter)</span>
                    </a>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-800">
                    ${navigator.share ? `
                        <button onclick="navigator.share({ title: 'SerboLingo Monty Šampion', text: '${shareText.replace(/'/g, "\\'")}', url: '${appUrl}' })" class="w-full py-2.5 px-3 bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 font-bold text-xs rounded-xl border border-blue-500/40 flex items-center justify-center gap-1.5">
                            <span>📲</span> <span>Sistemsko Deljenje (Sve Aplikacije)</span>
                        </button>
                    ` : ''}
                    <button onclick="MontyWinner.exportVictoryCard(); document.getElementById('monty-share-sheet').remove();" class="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5">
                        <span>📸</span> <span>Preuzmi Sliku za Instagram Story</span>
                    </button>
                    <button onclick="MontyWinner.copyShareText('${shareText.replace(/'/g, "\\'")} ${appUrl}')" class="w-full py-2 px-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5">
                        <span>📋</span> <span>Kopiraj Tekst i Link</span>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(sheet);
    },

    copyShareText: function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
            if (typeof app !== 'undefined' && app.showToast) app.showToast('📋 Tekst je kopiran u clipboard!', 'success');
        }
    },

    // 11. 7-Day Frequency-Capped Community Greeting Popup
    checkCommunityPopup: function() {
        try {
            if (localStorage.getItem(this.REPORTED_KEY) === 'true') return;

            const dismissedAt = localStorage.getItem(this.POPUP_DISMISS_KEY);
            if (dismissedAt) {
                const elapsed = Date.now() - parseInt(dismissedAt);
                if (elapsed < (7 * 24 * 60 * 60 * 1000)) return;
            }

            setTimeout(() => {
                this.openChampionCard(false);
            }, 2500);

        } catch (e) {}
    },

    dismissCommunityPopup: function() {
        const modal = document.getElementById('monty-community-popup');
        if (modal) modal.remove();
        try {
            localStorage.setItem(this.POPUP_DISMISS_KEY, Date.now().toString());
        } catch (e) {}
    },

    reportWinner: function() {
        if (confirm('Da li želite da prijavite ovaj sadržaj kao neprimeren? Ovaj post će odmah biti sakriven za vas.')) {
            try {
                localStorage.setItem(this.REPORTED_KEY, 'true');
                const modal = document.getElementById('monty-community-popup');
                if (modal) modal.remove();
                if (typeof app !== 'undefined' && app.showToast) {
                    app.showToast('🚩 Hvala na prijavi. Sadržaj je uklonjen.', 'info');
                }
            } catch (e) {}
        }
    },

    // 12. Open Monthly Champion Spotlight Card (Pinned #1)
    openChampionCard: function(isManual = true) {
        let existing = document.getElementById('monty-community-popup');
        if (existing) existing.remove();

        const d = this.getData();
        const user = window.state?.user || { name: 'Šampion Meseca', avatar: '🦁' };
        const name = d.isAnonymous ? 'Anonimni Šampion 🎭' : user.name;
        const avatar = d.isAnonymous ? '🎭' : user.avatar;

        const popup = document.createElement('div');
        popup.id = 'monty-community-popup';
        popup.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in';
        popup.innerHTML = `
            <div class="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-yellow-400 rounded-3xl p-5 text-white shadow-2xl text-center space-y-4">
                
                <button onclick="${isManual ? 'document.getElementById(\'monty-community-popup\').remove()' : 'MontyWinner.dismissCommunityPopup()'}" class="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                    ✕
                </button>

                <div class="inline-block px-3 py-1 bg-yellow-400/20 border border-yellow-300/40 rounded-full text-yellow-300 font-black text-[10px] uppercase tracking-widest">
                    👑 POBEDNIK MESECA (${d.monthYear || 'Novembar 2026'})
                </div>

                <!-- Winner Media Loop -->
                <div class="flex justify-center">
                    ${d.videoBase64 && !d.isAnonymous ? `
                        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl shadow-yellow-500/40 relative">
                            <video src="${d.videoBase64}" autoplay loop muted playsinline class="w-full h-full object-cover"></video>
                            <span class="absolute top-1 right-2 text-base">👑</span>
                        </div>
                    ` : d.photoBase64 && !d.isAnonymous ? `
                        <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl shadow-yellow-500/40 relative">
                            <img src="${d.photoBase64}" style="transform: rotate(${d.photoRotation}deg);" class="w-full h-full object-cover ${d.photoFilter === 'gold' ? 'filter-gold-glow' : d.photoFilter === 'retro' ? 'sepia' : d.photoFilter === 'bw' ? 'grayscale' : ''}">
                            <span class="absolute top-1 right-2 text-base">👑</span>
                        </div>
                    ` : `
                        <div class="w-28 h-28 rounded-full border-4 border-yellow-400 bg-slate-900 flex items-center justify-center text-5xl shadow-xl shadow-yellow-500/30 relative">
                            ${avatar}
                            <span class="absolute -top-2 -right-1 text-2xl">👑</span>
                        </div>
                    `}
                </div>

                <div>
                    <h3 class="text-xl font-black text-white">${name}</h3>
                    <p class="text-xs text-yellow-300 font-bold">#1 na Rang Listi Meseca</p>
                </div>

                <!-- Quote Box -->
                <div class="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs italic text-slate-200 leading-relaxed relative">
                    <span class="text-yellow-400 font-black text-base mr-1">“</span>${d.quote || this.DEFAULT_QUOTES[0]}<span class="text-yellow-400 font-black text-base ml-1">”</span>
                </div>

                <!-- Audio Playback Button -->
                <button onclick="MontyWinner.playWinnerAudio()" class="w-full py-2.5 px-4 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/50 text-yellow-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                    <span>🔊</span> <span>Pusti Pobednički Zvuk</span>
                </button>

                <!-- Actions: Enter Studio or Report -->
                <div class="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <button onclick="MontyWinner.reportWinner()" class="text-slate-500 hover:text-rose-400 font-semibold flex items-center gap-1">
                        <span>🚩</span> <span>Prijavi</span>
                    </button>
                    <button onclick="document.getElementById('monty-community-popup').remove(); MontyWinner.triggerCelebration();" class="text-amber-400 hover:underline font-bold">
                        Otvori Svoj Studio →
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
    },

    playWinnerAudio: function() {
        const d = this.getData();
        if (d.voicePreset === 'recorded' && d.recordedAudioBase64) {
            const audio = new Audio(d.recordedAudioBase64);
            audio.play();
        } else {
            this.playFanfare(d.voicePreset || 'trumpet');
        }
    },

    // 13. Canvas Brag Card Generator
    exportVictoryCard: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const d = this.getData();
        const user = window.state?.user || { name: 'Šampion', avatar: '🦁', xp: 500 };
        const name = d.isAnonymous ? 'Anonimni Šampion' : user.name;
        const avatar = d.isAnonymous ? '🎭' : (user.avatar || '🦁');

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext('2d');

        const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1350);

        const radial = ctx.createRadialGradient(540, 420, 50, 540, 420, 480);
        radial.addColorStop(0, 'rgba(234, 179, 8, 0.35)');
        radial.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, 1080, 1350);

        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 14;
        ctx.strokeRect(40, 40, 1000, 1270);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SERBOLINGO 🇷🇸 ŠAMPIONAT', 540, 130);

        ctx.font = '140px sans-serif';
        ctx.fillText('🏆', 540, 310);

        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 68px sans-serif';
        ctx.fillText('MONTY WINNER', 540, 420);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 28px sans-serif';
        ctx.fillText('Zvanični Pobednik Meseca & Šampion Igraonice', 540, 470);

        // Avatar Circle
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(540, 620, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.font = '90px sans-serif';
        ctx.fillText(avatar, 540, 650);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 52px sans-serif';
        ctx.fillText(name, 540, 780);

        // Quote Box
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        this.roundRect(ctx, 100, 830, 880, 240, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 48px sans-serif';
        ctx.fillText('“', 160, 890);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'italic 700 36px sans-serif';
        const quoteText = d.quote || this.DEFAULT_QUOTES[0];
        ctx.fillText(quoteText, 540, 940);

        // Stats Footer
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 32px sans-serif';
        ctx.fillText(`⚡ ${user.xp || 500} XP`, 300, 1150);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '900 32px sans-serif';
        ctx.fillText(`💎 +100 DIJAMANATA`, 780, 1150);

        ctx.fillStyle = '#64748b';
        ctx.font = '600 24px sans-serif';
        ctx.fillText('Uči srpski i engleski 100% besplatno na serbolingo.com', 540, 1240);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `serbolingo-monty-winner-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();

        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast('🎉 Pobednička kartica je preuzeta!', 'success');
        }
    },

    roundRect: function(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    closeModal: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
            this.mediaStream = null;
        }
        if (this.recordTimer) clearInterval(this.recordTimer);
        const m = document.getElementById('monty-winner-modal');
        if (m) m.remove();
    }
};

window.MontyWinner = MontyWinner;
