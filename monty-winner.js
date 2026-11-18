// [SHIELD_DAEMON: VALIDATED] 🛡️
// SerboLingo — "Monty Winner" Victory Celebration Studio & Multimedia Flex (Priority 12.2)
// High-energy milestone celebration, Victory Quote, Audio Voice Line, Selfie Flex & Canvas Brag Card.

const MontyWinner = {
    STORAGE_KEY: 'serbolingo_monty_winner',
    DEFAULT_QUOTES: [
        "Brate, padeži su mačji kašalj! 🦁",
        "Ko to tamo uči? Ja! 🚌",
        "Nema predaje, samo pobeda! ⚡",
        "Idemo bre do vrha! 🎺",
        "Srpski tečno, kafanski lagano! ☕"
    ],

    // Audio recording state
    mediaRecorder: null,
    audioChunks: [],
    recordedAudioUrl: null,
    recordedBlob: null,
    audioCtx: null,

    // 1. Get Saved Winner Profile
    getData: function() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {}
        return {
            hasWon: false,
            title: 'Šampion Znanja',
            quote: this.DEFAULT_QUOTES[0],
            voicePreset: 'trumpet', // 'trumpet' | 'cheer' | 'tts' | 'recorded'
            recordedAudioBase64: null,
            selfieBase64: null,
            optInSizzle: true,
            totalWins: 0,
            lastWinDate: null
        };
    },

    saveData: function(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    },

    // 2. Play Web Audio Celebration Fanfare
    playFanfare: function(type = 'trumpet') {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            if (!this.audioCtx) this.audioCtx = new AudioContext();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

            const ctx = this.audioCtx;
            const now = ctx.currentTime;

            if (type === 'trumpet' || type === 'fanfare') {
                // Brass fanfare notes (C4, G4, C5, E5, G5)
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
                // Stadium crowd noise simulation
                const bufferSize = ctx.sampleRate * 1.5;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
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
            console.warn('[MontyWinner] WebAudio fanfare fallback:', e);
        }
    },

    // 3. Falling Confetti FX
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

        // Reward User
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

        // Play Trumpet Fanfare
        this.playFanfare('trumpet');

        // Render Celebration Modal
        this.renderCelebrationModal({ title, subtitle, rewardGems, rewardXp });
        this.spawnConfetti();
    },

    // 5. Celebration Modal DOM
    renderCelebrationModal: function(config) {
        let existing = document.getElementById('monty-winner-modal');
        if (existing) existing.remove();

        const user = window.state?.user || { name: 'Šampion', avatar: '🦁' };
        const data = this.getData();

        const modal = document.createElement('div');
        modal.id = 'monty-winner-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in';
        modal.innerHTML = `
            <div id="monty-confetti-container" class="absolute inset-0 pointer-events-none overflow-hidden"></div>
            
            <div class="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-yellow-400/80 rounded-3xl p-6 shadow-2xl shadow-yellow-500/30 text-white my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
                
                <!-- Close Button -->
                <button onclick="MontyWinner.closeModal()" class="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-black transition-colors z-20">
                    ✕
                </button>

                <!-- Crown & Banner Header -->
                <div class="text-center relative pt-2">
                    <div class="inline-flex relative items-center justify-center mb-2">
                        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center text-5xl shadow-lg shadow-yellow-500/40 animate-pulse">
                            🏆
                        </div>
                        <span class="absolute -top-3 -right-2 text-2xl animate-bounce">👑</span>
                    </div>

                    <div class="inline-block px-3 py-1 bg-yellow-400/20 border border-yellow-300/40 rounded-full text-yellow-300 font-black text-[11px] uppercase tracking-widest mb-1.5">
                        ${config.title}
                    </div>
                    <h2 class="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500">
                        ČESTITAMO! TI SI POBEDNIK!
                    </h2>
                    <p class="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                        ${config.subtitle}
                    </p>
                </div>

                <!-- Instant Reward Badges -->
                <div class="grid grid-cols-2 gap-3 my-5">
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-yellow-400/40 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-yellow-400/30 flex items-center justify-center text-2xl shrink-0">
                            💎
                        </div>
                        <div>
                            <div class="text-[10px] text-yellow-200 font-bold uppercase tracking-wider">Nagrada</div>
                            <div class="text-lg font-black text-white">+${config.rewardGems} Dijamanata</div>
                        </div>
                    </div>
                    <div class="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-400/40 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-blue-400/30 flex items-center justify-center text-2xl shrink-0">
                            ⚡
                        </div>
                        <div>
                            <div class="text-[10px] text-blue-200 font-bold uppercase tracking-wider">Iskustvo</div>
                            <div class="text-lg font-black text-white">+${config.rewardXp} XP</div>
                        </div>
                    </div>
                </div>

                <!-- Studio Interactive Customization Section -->
                <div class="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-4">
                    <div class="flex items-center justify-between border-b border-slate-700 pb-2">
                        <h3 class="text-xs font-black uppercase tracking-wider text-yellow-300 flex items-center gap-1.5">
                            <span>🎨</span> <span>Studio: Prilagodi Svoj Pobednički Flex</span>
                        </h3>
                        <span class="text-[10px] text-slate-400 font-medium">Uživo pregled</span>
                    </div>

                    <!-- 1. Victory Quote Picker -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1.5">
                            💬 Tvoja Pobednička Poruka (Victory Quote):
                        </label>
                        <input id="monty-input-quote" type="text" maxlength="80" value="${data.quote || this.DEFAULT_QUOTES[0]}" oninput="MontyWinner.onQuoteChange(this.value)" class="w-full bg-slate-900 border border-slate-600 focus:border-yellow-400 text-white rounded-xl px-3 py-2 text-xs font-medium outline-none transition-colors" placeholder="Upiši svoju pobedničku izjavu...">
                        
                        <!-- Quick Pick Chips -->
                        <div class="flex flex-wrap gap-1.5 mt-2">
                            ${this.DEFAULT_QUOTES.map(q => `
                                <button onclick="MontyWinner.setQuickQuote('${q.replace(/'/g, "\\'")}')" class="text-[10px] bg-slate-700/60 hover:bg-yellow-400/20 hover:text-yellow-200 text-slate-300 px-2 py-1 rounded-lg transition-colors border border-slate-600/50">
                                    ${q}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 2. Voice Audio Line / Shout -->
                    <div>
                        <label class="block text-[11px] font-bold text-slate-300 mb-1.5">
                            🎺 Tvoj Pobednički Zvuk (Voice / Audio Flex):
                        </label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <button onclick="MontyWinner.selectVoicePreset('trumpet')" id="monty-voice-trumpet" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'trumpet' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm' : 'bg-slate-900/60 border-slate-700 text-slate-300'}">
                                <span>🎺</span>
                                <span class="text-[10px]">Trubači</span>
                            </button>
                            <button onclick="MontyWinner.selectVoicePreset('cheer')" id="monty-voice-cheer" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'cheer' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm' : 'bg-slate-900/60 border-slate-700 text-slate-300'}">
                                <span>👏</span>
                                <span class="text-[10px]">Ovacije</span>
                            </button>
                            <button onclick="MontyWinner.selectVoicePreset('tts')" id="monty-voice-tts" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'tts' ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm' : 'bg-slate-900/60 border-slate-700 text-slate-300'}">
                                <span>🗣️</span>
                                <span class="text-[10px]">Govor</span>
                            </button>
                            <button onclick="MontyWinner.startVoiceRecording()" id="monty-voice-record" class="p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 ${data.voicePreset === 'recorded' ? 'bg-red-500/20 border-red-400 text-red-300 shadow-sm' : 'bg-slate-900/60 border-slate-700 text-slate-300'}">
                                <span id="monty-record-icon">🎙️</span>
                                <span id="monty-record-label" class="text-[10px]">Snimi Glas</span>
                            </button>
                        </div>
                        <div id="monty-voice-status" class="text-[10px] text-slate-400 mt-1 italic">
                            ${data.voicePreset === 'recorded' ? '✅ Tvoj glasovni snimak je sačuvan!' : 'Izaberi zvuk koji prati tvoj pobednički post.'}
                        </div>
                    </div>

                    <!-- 3. Opt-In Sizzle Reel Permission -->
                    <div class="pt-2 border-t border-slate-700/60">
                        <label class="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                            <input type="checkbox" id="monty-optin-sizzle" ${data.optInSizzle ? 'checked' : ''} onchange="MontyWinner.toggleOptIn(this.checked)" class="mt-0.5 rounded text-yellow-500 focus:ring-yellow-400 w-4 h-4">
                            <span class="text-[11px] leading-tight">
                                ⭐ <strong>Community Sizzle Reel:</strong> Dozvoli prikazivanje mog imena i citata u uvodnoj špici aplikacije i na tabli pobednika meseca.
                            </span>
                        </label>
                    </div>
                </div>

                <!-- Live Card Preview & Share Buttons -->
                <div class="mt-5 space-y-3">
                    <button onclick="MontyWinner.exportVictoryCard()" class="w-full py-3.5 px-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-yellow-500/30 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <span>📤</span> <span>Sačuvaj & Podeli Pobedničku Karticu</span>
                    </button>
                    
                    <button onclick="MontyWinner.closeModal()" class="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors">
                        Zatvori Studio
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    },

    // 6. Studio Actions
    setQuickQuote: function(q) {
        const inp = document.getElementById('monty-input-quote');
        if (inp) inp.value = q;
        this.onQuoteChange(q);
    },

    onQuoteChange: function(val) {
        const d = this.getData();
        d.quote = val;
        this.saveData(d);
    },

    selectVoicePreset: function(type) {
        const d = this.getData();
        d.voicePreset = type;
        this.saveData(d);

        // Update UI
        ['trumpet', 'cheer', 'tts', 'recorded'].forEach(p => {
            const btn = document.getElementById(`monty-voice-${p}`);
            if (btn) {
                if (p === type) {
                    btn.className = 'p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-sm';
                } else {
                    btn.className = 'p-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center gap-1 bg-slate-900/60 border-slate-700 text-slate-300';
                }
            }
        });

        // Test play
        if (type === 'trumpet') this.playFanfare('trumpet');
        else if (type === 'cheer') this.playFanfare('cheer');
        else if (type === 'tts') {
            if (typeof app !== 'undefined' && app.speakPhrase) {
                app.speakPhrase(d.quote || 'Tako se to radi!');
            }
        }
    },

    // 7. Micro-Recording Studio (5s max)
    startVoiceRecording: async function() {
        const statusEl = document.getElementById('monty-voice-status');
        const iconEl = document.getElementById('monty-record-icon');
        const labelEl = document.getElementById('monty-record-label');

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) this.audioChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
                this.recordedBlob = blob;
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result;
                    const d = this.getData();
                    d.voicePreset = 'recorded';
                    d.recordedAudioBase64 = base64;
                    this.saveData(d);

                    if (statusEl) statusEl.innerHTML = '✅ <span class="text-emerald-400 font-bold">Glas uspešno snimljen! Klikni da preslušaš.</span>';
                    if (iconEl) iconEl.innerText = '▶️';
                    if (labelEl) labelEl.innerText = 'Preslušaj';

                    // Switch preset UI
                    this.selectVoicePreset('recorded');
                };
                reader.readAsDataURL(blob);

                // Stop tracks
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            if (statusEl) statusEl.innerHTML = '🔴 <span class="text-red-400 font-bold animate-pulse">Snimanje u toku (Govori)... 4s</span>';
            if (iconEl) iconEl.innerText = '⏹️';
            if (labelEl) labelEl.innerText = 'Snima se...';

            setTimeout(() => {
                if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    this.mediaRecorder.stop();
                }
            }, 4000);

        } catch (err) {
            console.warn('[MontyWinner] Microphone permission error:', err);
            if (statusEl) statusEl.innerText = '⚠️ Mikrofon nije dostupan. Izaberi gotov zvuk.';
            this.selectVoicePreset('trumpet');
        }
    },

    toggleOptIn: function(checked) {
        const d = this.getData();
        d.optInSizzle = checked;
        this.saveData(d);
        if (typeof app !== 'undefined' && app.showToast) {
            app.showToast(checked ? '✅ Dodato u Community Sizzle Reel!' : 'Podešavanje ažurirano.', 'info');
        }
    },

    // 8. Generate & Export HD Bragging Card
    exportVictoryCard: function() {
        if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
        const d = this.getData();
        const user = window.state?.user || { name: 'Šampion', avatar: '🦁', xp: 500 };

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1350;
        const ctx = canvas.getContext('2d');

        // Dark Luxury Gradient Background
        const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(0.5, '#0f172a');
        grad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1350);

        // Gold Radial Glow Behind Trophy
        const radial = ctx.createRadialGradient(540, 420, 50, 540, 420, 480);
        radial.addColorStop(0, 'rgba(234, 179, 8, 0.35)');
        radial.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, 1080, 1350);

        // Outer Gold Border Frame
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 14;
        ctx.strokeRect(40, 40, 1000, 1270);

        // Top App Header
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 42px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SERBOLINGO 🇷🇸 ŠAMPIONAT', 540, 130);

        // Trophy Emoji
        ctx.font = '140px sans-serif';
        ctx.fillText('🏆', 540, 310);

        // Title
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 68px sans-serif';
        ctx.fillText('MONTY WINNER', 540, 420);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '700 28px sans-serif';
        ctx.fillText('Zvanični Pobednik Meseca & Šampion Igraonice', 540, 470);

        // User Avatar Circle
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(540, 620, 90, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.font = '90px sans-serif';
        ctx.fillText(user.avatar || '🦁', 540, 650);

        // User Name
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 52px sans-serif';
        ctx.fillText(user.name || 'Šampion', 540, 780);

        // Victory Quote Card Container
        ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        this.roundRect(ctx, 100, 830, 880, 240, 24);
        ctx.fill();
        ctx.stroke();

        // Quotation mark
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 48px sans-serif';
        ctx.fillText('“', 160, 890);

        // Quote Text (wrapped)
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'italic 700 36px sans-serif';
        const quoteText = d.quote || this.DEFAULT_QUOTES[0];
        ctx.fillText(quoteText, 540, 940);

        // Stats Footer Grid
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 32px sans-serif';
        ctx.fillText(`⚡ ${user.xp || 500} XP`, 300, 1150);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '900 32px sans-serif';
        ctx.fillText(`💎 +100 DIJAMANATA`, 780, 1150);

        // Bottom CTA
        ctx.fillStyle = '#64748b';
        ctx.font = '600 24px sans-serif';
        ctx.fillText('Uči srpski i engleski 100% besplatno na serbolingo.com', 540, 1240);

        // Convert to Download / Share
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
        const m = document.getElementById('monty-winner-modal');
        if (m) m.remove();
    }
};

window.MontyWinner = MontyWinner;
