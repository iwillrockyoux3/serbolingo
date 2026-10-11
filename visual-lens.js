// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — AI Visual Lens Engine ("Snap & Translate" / Camera Learning)
 * Priority 18: Multimodal Real-World Camera & Image Recognition via Google Gemini Vision
 * 
 * Features:
 *  - 🍏 Object Mode: Detects real-world items, gives Serbian (Latin + Cyrillic), gender, phonetic, example sentence
 *  - 📄 Text / OCR Mode: Scans signs, menus, book pages, labels with dual-language translation
 *  - 🔊 Native Audio Pronunciation (TTS integration)
 *  - ⭐ 1-Click Save to SRS Flashcard Deck (IndexedDB & state.mistakeLog)
 *  - 📱 Mobile Rear Camera Integration (capture="environment") & Gallery Upload
 *  - 🛡️ Zero-key Graceful Fallback with Interactive Offline Demo Mode
 */

(function () {
    'use strict';

    const VisualLens = {
        state: {
            mode: 'object', // 'object' | 'ocr'
            imageSrc: null,
            base64Data: null,
            mimeType: 'image/jpeg',
            isLoading: false,
            currentResult: null,
            scriptMode: 'lat' // 'lat' | 'cyr'
        },

        // Offline pre-cached demo samples for instant zero-key testing
        DEMO_SAMPLES: {
            apple: {
                mode: 'object',
                title: 'Jabuka / Јабука (Apple)',
                sr_lat: 'Jabuka',
                sr_cyr: 'Јабука',
                en: 'Apple',
                gender: 'ženski rod (feminine)',
                gender_short: 'ž.r.',
                phonetic: 'YAH-boo-kah',
                example_sr: 'Pojedi jednu svežu jabuku svakog jutra.',
                example_en: 'Eat a fresh apple every morning.',
                notes: 'Uobičajena voćka u Srbiji, osnovna reč u kurikulumu.',
                sampleIcon: '🍎'
            },
            coffee: {
                mode: 'object',
                title: 'Kafa / Кафа (Coffee)',
                sr_lat: 'Domaća kafa',
                sr_cyr: 'Домаћа кафа',
                en: 'Domestic / Turkish Coffee',
                gender: 'ženski rod (feminine)',
                gender_short: 'ž.r.',
                phonetic: 'DOH-mah-chah KAH-fah',
                example_sr: 'Popijmo jednu tursku kafu sa prijateljima.',
                example_en: 'Let\'s have a Turkish coffee with friends.',
                notes: 'Simbol balkanskog gostoprimstva i kafanske kulture.',
                sampleIcon: '☕'
            },
            menu: {
                mode: 'ocr',
                title: 'Jelovnik / Restoranski meni',
                extracted_sr: 'Domaća supa sa rezancima - 350 RSD\nĆevapi na kajmaku (10 kom) - 780 RSD\nŠopska salata sa sirom - 390 RSD\nBaklava sa orasima - 290 RSD',
                translated_en: 'Homemade noodle soup - 350 RSD\nCevapi with kajmak cream (10 pcs) - 780 RSD\nShopska salad with cheese - 390 RSD\nWalnut baklava - 290 RSD',
                vocabulary: [
                    { sr: 'Ćevapi', en: 'Grilled minced meat sausages' },
                    { sr: 'Kajmak', en: 'Clotted cream dairy spread' },
                    { sr: 'Šopska salata', en: 'Tomato, cucumber & cheese salad' },
                    { sr: 'Baklava', en: 'Sweet layered walnut pastry' }
                ],
                sampleIcon: '📋'
            }
        },

        init: function () {
            // Attach hidden file input listener if already in DOM
            this._setupFileInput();
        },

        _setupFileInput: function () {
            let input = document.getElementById('visual-lens-file-input');
            if (!input) return;
            input.onchange = (e) => {
                const file = e.target.files && e.target.files[0];
                if (file) {
                    this.handleFile(file);
                }
                // Reset input value so same photo can be re-selected if desired
                input.value = '';
            };
        },

        openModal: function () {
            const modal = document.getElementById('visual-lens-modal');
            if (!modal) return;
            this._setupFileInput();
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
            this.renderUI();
        },

        closeModal: function () {
            const modal = document.getElementById('visual-lens-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            document.body.classList.remove('overflow-hidden');
            this.state.isLoading = false;
        },

        setMode: function (newMode) {
            this.state.mode = newMode;
            this.state.currentResult = null;
            this.renderUI();
            if (this.state.imageSrc) {
                this.analyzeImage();
            }
        },

        toggleScript: function () {
            this.state.scriptMode = (this.state.scriptMode === 'lat') ? 'cyr' : 'lat';
            this.renderResult();
        },

        triggerCamera: function () {
            const input = document.getElementById('visual-lens-file-input');
            if (input) {
                input.setAttribute('capture', 'environment');
                input.click();
            }
        },

        triggerGallery: function () {
            const input = document.getElementById('visual-lens-file-input');
            if (input) {
                input.removeAttribute('capture');
                input.click();
            }
        },

        handleFile: function (file) {
            if (!file.type.startsWith('image/')) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('Molimo izaberite sliku (JPG, PNG).', 'error');
                }
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const rawUrl = e.target.result;
                // Compress & downsample image via canvas to preserve mobile RAM (<1024px)
                this._compressImage(rawUrl, (compressedDataUrl, base64Pure, mime) => {
                    this.state.imageSrc = compressedDataUrl;
                    this.state.base64Data = base64Pure;
                    this.state.mimeType = mime;
                    this.state.currentResult = null;
                    this.renderUI();
                    this.analyzeImage();
                });
            };
            reader.readAsDataURL(file);
        },

        _compressImage: function (dataUrl, callback) {
            const img = new Image();
            img.onload = () => {
                const maxDim = 1024;
                let w = img.width;
                let h = img.height;

                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = Math.round((h * maxDim) / w);
                        w = maxDim;
                    } else {
                        w = Math.round((w * maxDim) / h);
                        h = maxDim;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, w, h);

                const mime = 'image/jpeg';
                const compressedUrl = canvas.toDataURL(mime, 0.75);
                const base64Pure = compressedUrl.split(',')[1];
                callback(compressedUrl, base64Pure, mime);
            };
            img.src = dataUrl;
        },

        loadDemo: function (demoKey) {
            const demo = this.DEMO_SAMPLES[demoKey];
            if (!demo) return;

            this.state.mode = demo.mode;
            this.state.imageSrc = null;
            this.state.base64Data = null;
            this.state.currentResult = demo;
            this.state.isLoading = false;
            this.renderUI();
            this.renderResult();
        },

        analyzeImage: async function () {
            if (!this.state.base64Data) return;

            const apiKey = window.apiKey || localStorage.getItem('serbolingo_api_key');
            if (!apiKey) {
                this._showNoApiKeyWarning();
                return;
            }

            this.state.isLoading = true;
            this.renderUI();

            const isObject = (this.state.mode === 'object');
            const prompt = isObject
                ? `You are an expert Serbian and English language tutor in the SerboLingo app. 
Analyze this photo and identify the main real-world object.
Return ONLY a valid JSON object without markdown, backticks, or code blocks matching this exact schema:
{
  "identified": true,
  "sr_lat": "Serbian word in Latin script (e.g. Jabuka)",
  "sr_cyr": "Serbian word in Cyrillic script (e.g. Јабука)",
  "en": "English translation (e.g. Apple)",
  "gender": "muški rod / ženski rod / srednji rod",
  "gender_short": "m.r. / ž.r. / s.r.",
  "phonetic": "English phonetic guide (e.g. YAH-boo-kah)",
  "example_sr": "A short, natural Serbian example sentence using this word.",
  "example_en": "English translation of the example sentence.",
  "notes": "Brief grammatical or cultural context tip in 1-2 sentences."
}`
                : `You are an expert Serbian and English OCR and translation tutor in the SerboLingo app.
Scan and extract all Serbian or English text in this image (e.g. from signs, menus, labels, books).
Translate accurately between Serbian and English.
Return ONLY a valid JSON object without markdown, backticks, or code blocks matching this exact schema:
{
  "extracted_sr": "Original or Serbian text extracted from image",
  "translated_en": "English translation of the extracted text",
  "vocabulary": [
    { "sr": "key Serbian word 1", "en": "English meaning 1" },
    { "sr": "key Serbian word 2", "en": "English meaning 2" },
    { "sr": "key Serbian word 3", "en": "English meaning 3" }
  ],
  "sampleIcon": "📋"
}`;

            const payload = {
                contents: [
                    {
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: this.state.mimeType,
                                    data: this.state.base64Data
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.2
                }
            };

            const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
            let response = null;
            let success = false;

            for (const model of models) {
                try {
                    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (response.ok) {
                        success = true;
                        break;
                    }
                } catch (e) {
                    // Try next model in cascade
                }
            }

            this.state.isLoading = false;

            if (!success || !response) {
                if (window.app && window.app.showToast) {
                    window.app.showToast('Greška pri AI analizi slike. Proverite internet ili API ključ.', 'error');
                }
                this.renderUI();
                return;
            }

            try {
                const data = await response.json();
                let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                // Clean markdown code blocks if model wrapped it
                rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(rawText);
                this.state.currentResult = parsed;
                this.renderUI();
                this.renderResult();
            } catch (err) {
                console.error('VisualLens JSON parsing error:', err);
                if (window.app && window.app.showToast) {
                    window.app.showToast('Nije uspelo prepoznavanje. Pokušajte ponovo sa jasnijom slikom.', 'error');
                }
                this.renderUI();
            }
        },

        _showNoApiKeyWarning: function () {
            const container = document.getElementById('visual-lens-results-container');
            if (!container) return;
            container.innerHTML = `
                <div class="p-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl text-center space-y-4">
                    <div class="text-5xl">🔑</div>
                    <h4 class="text-lg font-black text-amber-400">Potreban je Google Gemini API ključ</h4>
                    <p class="text-xs text-slate-300 leading-relaxed">
                        Za analizu novih fotografija u realnom vremenu potreban je besplatan Gemini API ključ.
                    </p>
                    <div class="flex flex-col gap-2 pt-2">
                        <button onclick="app.openApiKeyModal()" class="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs active:scale-95 transition-transform shadow-lg shadow-blue-600/30">
                            ✨ Unesi Gemini API Ključ
                        </button>
                        <button onclick="VisualLens.loadDemo('apple')" class="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-colors">
                            🧪 Ili isprobaj besplatnu Demo analizu (Jabuka)
                        </button>
                    </div>
                </div>
            `;
        },

        renderUI: function () {
            const modeObjectBtn = document.getElementById('lens-mode-object');
            const modeOcrBtn = document.getElementById('lens-mode-ocr');
            if (modeObjectBtn && modeOcrBtn) {
                if (this.state.mode === 'object') {
                    modeObjectBtn.className = 'flex-1 py-2.5 text-xs font-black rounded-xl bg-blue-600 text-white shadow-md transition-all flex items-center justify-center gap-1.5';
                    modeOcrBtn.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5';
                } else {
                    modeObjectBtn.className = 'flex-1 py-2.5 text-xs font-bold rounded-xl text-slate-400 hover:text-white transition-all flex items-center justify-center gap-1.5';
                    modeOcrBtn.className = 'flex-1 py-2.5 text-xs font-black rounded-xl bg-purple-600 text-white shadow-md transition-all flex items-center justify-center gap-1.5';
                }
            }

            const previewContainer = document.getElementById('lens-preview-container');
            const placeholderContainer = document.getElementById('lens-placeholder-container');
            const previewImg = document.getElementById('lens-preview-img');
            const scanningOverlay = document.getElementById('lens-scanning-overlay');

            if (this.state.imageSrc) {
                if (placeholderContainer) placeholderContainer.classList.add('hidden');
                if (previewContainer) previewContainer.classList.remove('hidden');
                if (previewImg) previewImg.src = this.state.imageSrc;
                if (scanningOverlay) {
                    if (this.state.isLoading) scanningOverlay.classList.remove('hidden');
                    else scanningOverlay.classList.add('hidden');
                }
            } else {
                if (placeholderContainer) placeholderContainer.classList.remove('hidden');
                if (previewContainer) previewContainer.classList.add('hidden');
                if (scanningOverlay) scanningOverlay.classList.add('hidden');
            }
        },

        renderResult: function () {
            const container = document.getElementById('visual-lens-results-container');
            if (!container) return;

            const res = this.state.currentResult;
            if (!res) {
                container.innerHTML = '';
                return;
            }

            const isCyr = (this.state.scriptMode === 'cyr');

            if (this.state.mode === 'object' && res.sr_lat) {
                const srWord = isCyr ? (res.sr_cyr || res.sr_lat) : res.sr_lat;
                container.innerHTML = `
                    <div class="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 fade-in">
                        <!-- Top Header -->
                        <div class="flex items-start justify-between">
                            <div>
                                <span class="px-2.5 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    ${res.gender || res.gender_short || 'Imenica'}
                                </span>
                                <h3 class="text-3xl font-black text-white mt-2 flex items-center gap-3">
                                    <span>${srWord}</span>
                                    <button onclick="VisualLens.speakWord('${res.sr_lat}')" class="w-9 h-9 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white text-base shadow-md active:scale-90 transition-transform">
                                        🔊
                                    </button>
                                </h3>
                                <p class="text-slate-400 font-bold text-sm mt-0.5">${res.en}</p>
                            </div>
                            <button onclick="VisualLens.toggleScript()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-black text-cyan-400 transition-colors">
                                ${isCyr ? 'ЋИР ➔ LAT' : 'LAT ➔ ЋИР'}
                            </button>
                        </div>

                        <!-- Phonetic guide -->
                        ${res.phonetic ? `
                            <div class="px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                                🗣️ Izgovor: <span class="font-bold">${res.phonetic}</span>
                            </div>
                        ` : ''}

                        <!-- Example Sentence -->
                        <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                            <p class="text-xs font-black text-slate-300 flex items-center justify-between">
                                <span>Primer upotrebe:</span>
                                <button onclick="VisualLens.speakWord('${res.example_sr}')" class="text-blue-400 hover:text-blue-300 text-xs">
                                    🔊 Čuj
                                </button>
                            </p>
                            <p class="text-sm font-bold text-amber-300">${res.example_sr}</p>
                            <p class="text-xs text-slate-400">${res.example_en}</p>
                        </div>

                        ${res.notes ? `
                            <p class="text-[11px] text-slate-400 italic">💡 ${res.notes}</p>
                        ` : ''}

                        <!-- Action Buttons -->
                        <div class="pt-2 flex gap-2">
                            <button onclick="VisualLens.saveToFlashcards('${res.sr_lat}', '${res.en}', '${res.gender || ''}')" class="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                                <span>⭐</span> <span>Dodaj u Fleškartice</span>
                            </button>
                            <button onclick="VisualLens.triggerCamera()" class="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs transition-colors">
                                🔄 Ponovo
                            </button>
                        </div>
                    </div>
                `;
            } else if (this.state.mode === 'ocr' && res.extracted_sr) {
                container.innerHTML = `
                    <div class="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 fade-in">
                        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${res.sampleIcon || '📄'}</span>
                                <h4 class="text-base font-black text-white">Prepoznat Tekst</h4>
                            </div>
                            <button onclick="VisualLens.speakWord('${res.extracted_sr.replace(/\n/g, ' ')}')" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black text-white flex items-center gap-1">
                                🔊 Pročitaj
                            </button>
                        </div>

                        <!-- Side by Side OCR -->
                        <div class="space-y-3">
                            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                <p class="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Srpski (Original)</p>
                                <p class="text-sm font-bold text-amber-300 whitespace-pre-line leading-relaxed">${res.extracted_sr}</p>
                            </div>
                            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                <p class="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Engleski Prevod</p>
                                <p class="text-sm font-bold text-cyan-300 whitespace-pre-line leading-relaxed">${res.translated_en}</p>
                            </div>
                        </div>

                        <!-- Extracted Vocabulary Chips -->
                        ${res.vocabulary && res.vocabulary.length ? `
                            <div>
                                <p class="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ključne Reči:</p>
                                <div class="flex flex-wrap gap-2">
                                    ${res.vocabulary.map(v => `
                                        <button onclick="VisualLens.speakWord('${v.sr}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 active:scale-95 transition-all">
                                            <span>🔊 ${v.sr}</span> <span class="text-slate-400 text-[10px]">(${v.en})</span>
                                        </button>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Action -->
                        <div class="pt-2 flex gap-2">
                            <button onclick="VisualLens.saveOcrVocabulary()" class="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                                <span>⭐</span> <span>Sačuvaj Ključne Reči</span>
                            </button>
                            <button onclick="VisualLens.triggerCamera()" class="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs transition-colors">
                                🔄 Skeniraj Drugo
                            </button>
                        </div>
                    </div>
                `;
            }
        },

        speakWord: function (text) {
            if (!text) return;
            if (window.app && typeof window.app.speak === 'function') {
                window.app.speak(text, 'sr');
            } else if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'sr-RS';
                window.speechSynthesis.speak(utterance);
            }
        },

        saveToFlashcards: function (srWord, enWord, gender) {
            if (!srWord) return;

            // Save to appState mistakeLog & local deck
            if (window.app && window.app.state) {
                if (!window.app.state.mistakeLog) {
                    window.app.state.mistakeLog = [];
                }
                const exists = window.app.state.mistakeLog.some(m => (m.sr || m.source) === srWord);
                if (!exists) {
                    window.app.state.mistakeLog.push({
                        id: 'lens_' + Date.now(),
                        sr: srWord,
                        en: enWord,
                        source: srWord,
                        target: enWord,
                        gender: gender || '',
                        timestamp: Date.now(),
                        wrongCount: 1
                    });
                    if (typeof window.app.saveState === 'function') {
                        window.app.saveState();
                    }
                }
            }

            if (window.app && window.app.showToast) {
                window.app.showToast(`⭐ "${srWord}" sačuvana u rečnik za ponavljanje!`, 'success');
            }
        },

        saveOcrVocabulary: function () {
            const res = this.state.currentResult;
            if (!res || !res.vocabulary) return;

            let count = 0;
            res.vocabulary.forEach(v => {
                if (window.app && window.app.state) {
                    if (!window.app.state.mistakeLog) window.app.state.mistakeLog = [];
                    const exists = window.app.state.mistakeLog.some(m => (m.sr || m.source) === v.sr);
                    if (!exists) {
                        window.app.state.mistakeLog.push({
                            id: 'lens_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
                            sr: v.sr,
                            en: v.en,
                            source: v.sr,
                            target: v.en,
                            timestamp: Date.now(),
                            wrongCount: 1
                        });
                        count++;
                    }
                }
            });

            if (window.app && typeof window.app.saveState === 'function') {
                window.app.saveState();
            }

            if (window.app && window.app.showToast) {
                window.app.showToast(`⭐ Sačuvano ${count || res.vocabulary.length} novih reči u fleškartice!`, 'success');
            }
        }
    };

    window.VisualLens = VisualLens;

    // Auto-init on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VisualLens.init());
    } else {
        VisualLens.init();
    }
})();
