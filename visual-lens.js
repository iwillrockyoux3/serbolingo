// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — AI Visual Lens Engine ("Snap & Translate" / Camera Learning)
 * Priority 18 & 39: Multimodal Real-World Camera & OCR via Google Gemini Vision
 * 
 * Upgrades:
 *  - 📹 Live Camera Viewfinder with MediaDevices getUserMedia stream & canvas frame grabber
 *  - 🔘 Large tactile round shutter button with camera flip (front/back) & gallery fallback
 *  - 🔮 2-in-1 Unified AI Scanner: Merged Object & Text/OCR detection in a single pass
 *  - 📜 Touch-scrollable translation container (max-h-[60vh] overflow-y-auto)
 *  - 🧹 Auto-reset on modal close/reopen (stops camera tracks, purges cache & previews)
 *  - 🔊 Native Audio Pronunciation (TTS integration) & Cyrillic/Latin script toggle
 *  - ⭐ 1-Click Save to SRS Flashcards & Custom Decks
 *  - 🛡️ Zero-key Graceful Fallback with Interactive Offline Demo Mode
 */

(function () {
    'use strict';

    const VisualLens = {
        state: {
            stream: null,
            facingMode: 'environment', // 'environment' | 'user'
            isCameraRunning: false,
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
                sampleIcon: '🍎',
                extracted_sr: '',
                translated_en: '',
                vocabulary: []
            },
            coffee: {
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
                sampleIcon: '☕',
                extracted_sr: '',
                translated_en: '',
                vocabulary: []
            },
            menu: {
                title: 'Restoranski Meni (Restaurant Menu)',
                sr_lat: 'Jelovnik & Tradicionalna Jela',
                sr_cyr: 'Јеловник & Традиционална Јела',
                en: 'Menu & Traditional Balkan Dishes',
                gender: 'muški rod (masculine)',
                gender_short: 'm.r.',
                phonetic: 'YEH-lov-neek',
                example_sr: 'Konobar, možete li nam doneti jelovnik?',
                example_en: 'Waiter, could you please bring us the menu?',
                notes: 'Autentična kafanska jela i cene u dinarima (RSD).',
                extracted_sr: 'Domaća supa sa rezancima - 350 RSD\nĆevapi na kajmaku (10 kom) - 780 RSD\nŠopska salata sa sirom - 390 RSD\nBaklava sa orasima - 290 RSD',
                translated_en: 'Homemade noodle soup - 350 RSD\nCevapi with kajmak cream (10 pcs) - 780 RSD\nShopska salad with cheese - 390 RSD\nWalnut baklava - 290 RSD',
                vocabulary: [
                    { sr: 'Ćevapi', en: 'Grilled minced meat sausages' },
                    { sr: 'Kajmak', en: 'Traditional clotted cream spread' },
                    { sr: 'Šopska salata', en: 'Tomato, cucumber & feta cheese salad' },
                    { sr: 'Baklava', en: 'Sweet layered walnut pastry' }
                ],
                sampleIcon: '📋'
            }
        },

        init: function () {
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
                input.value = '';
            };
        },

        openModal: function () {
            const modal = document.getElementById('visual-lens-modal');
            if (!modal) return;
            this._setupFileInput();

            // Auto-reset previous captures
            this.state.imageSrc = null;
            this.state.base64Data = null;
            this.state.currentResult = null;
            this.state.isLoading = false;

            const resContainer = document.getElementById('visual-lens-results-container');
            if (resContainer) resContainer.innerHTML = '';

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');

            this.renderUI();
            this.startCamera();
        },

        closeModal: function () {
            this.stopCamera();
            const modal = document.getElementById('visual-lens-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
            document.body.classList.remove('overflow-hidden');

            // Purge state and memory buffers
            this.state.isLoading = false;
            this.state.imageSrc = null;
            this.state.base64Data = null;
            this.state.currentResult = null;

            const resContainer = document.getElementById('visual-lens-results-container');
            if (resContainer) resContainer.innerHTML = '';

            this.renderUI();
        },

        // --- Camera Lifecycle ---
        startCamera: async function () {
            const video = document.getElementById('lens-camera-video');
            const viewfinder = document.getElementById('lens-viewfinder-container');
            const fallback = document.getElementById('lens-fallback-box');

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                console.log('[VisualLens] getUserMedia not supported on this browser');
                this.state.isCameraRunning = false;
                if (viewfinder) viewfinder.classList.add('hidden');
                if (fallback) fallback.classList.remove('hidden');
                return;
            }

            this.stopCamera();

            try {
                const constraints = {
                    video: {
                        facingMode: { ideal: this.state.facingMode },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                this.state.stream = stream;
                this.state.isCameraRunning = true;

                if (video) {
                    video.srcObject = stream;
                    video.onloadedmetadata = () => {
                        video.play().catch(e => console.warn('[VisualLens] Play warning:', e));
                    };
                }

                if (viewfinder) viewfinder.classList.remove('hidden');
                if (fallback) fallback.classList.add('hidden');
            } catch (err) {
                console.warn('[VisualLens] Camera access denied or unavailable:', err);
                this.state.isCameraRunning = false;
                if (viewfinder) viewfinder.classList.add('hidden');
                if (fallback) fallback.classList.remove('hidden');
            }
        },

        stopCamera: function () {
            if (this.state.stream) {
                try {
                    this.state.stream.getTracks().forEach(track => track.stop());
                } catch (e) {
                    console.warn('[VisualLens] Track stop error:', e);
                }
                this.state.stream = null;
            }
            this.state.isCameraRunning = false;
            const video = document.getElementById('lens-camera-video');
            if (video) {
                video.srcObject = null;
            }
        },

        flipCamera: function () {
            this.state.facingMode = (this.state.facingMode === 'environment') ? 'user' : 'environment';
            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('tap');
            this.startCamera();
        },

        captureFrame: function () {
            const video = document.getElementById('lens-camera-video');
            if (!video || !this.state.isCameraRunning) {
                // If stream is not running, fallback to device file/camera picker
                this.triggerCameraInput();
                return;
            }

            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('success');

            const vw = video.videoWidth || 640;
            const vh = video.videoHeight || 480;

            const canvas = document.createElement('canvas');
            const maxDim = 1024;
            let w = vw;
            let h = vh;

            if (w > maxDim || h > maxDim) {
                if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                } else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
            }

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, w, h);

            const mime = 'image/jpeg';
            const compressedUrl = canvas.toDataURL(mime, 0.78);
            const base64Pure = compressedUrl.split(',')[1];

            // Stop camera to conserve battery & RAM during AI call
            this.stopCamera();

            this.state.imageSrc = compressedUrl;
            this.state.base64Data = base64Pure;
            this.state.mimeType = mime;
            this.state.currentResult = null;

            this.renderUI();
            this.analyzeImage();
        },

        retakePhoto: function () {
            this.state.imageSrc = null;
            this.state.base64Data = null;
            this.state.currentResult = null;
            this.state.isLoading = false;

            const resContainer = document.getElementById('visual-lens-results-container');
            if (resContainer) resContainer.innerHTML = '';

            this.renderUI();
            this.startCamera();
        },

        triggerCameraInput: function () {
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

            this.stopCamera();

            const reader = new FileReader();
            reader.onload = (e) => {
                const rawUrl = e.target.result;
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
                const compressedUrl = canvas.toDataURL(mime, 0.78);
                const base64Pure = compressedUrl.split(',')[1];
                callback(compressedUrl, base64Pure, mime);
            };
            img.src = dataUrl;
        },

        toggleScript: function () {
            this.state.scriptMode = (this.state.scriptMode === 'lat') ? 'cyr' : 'lat';
            this.renderResult();
        },

        loadDemo: function (demoKey) {
            const demo = this.DEMO_SAMPLES[demoKey];
            if (!demo) return;

            this.stopCamera();
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

            // Unified Prompt: detects real-world objects, text, signs, menus in one single pass
            const prompt = `You are an expert Serbian and English language tutor in the SerboLingo app.
Analyze this image. The image may contain real-world objects (food, animal, vehicle, tool, nature), text (signs, menus, documents, labels), or both.
Identify the primary object and also extract any visible text.
Return ONLY a valid JSON object without markdown, backticks, or code blocks matching this exact schema:
{
  "title": "Short descriptive title of the image",
  "sr_lat": "Primary Serbian word or title in Latin script (e.g. Jabuka or Restoranski meni)",
  "sr_cyr": "Primary Serbian word or title in Cyrillic script (e.g. Јабука or Ресторански мени)",
  "en": "English translation (e.g. Apple or Restaurant Menu)",
  "gender": "muški rod / ženski rod / srednji rod (if single noun)",
  "gender_short": "m.r. / ž.r. / s.r.",
  "phonetic": "English phonetic guide (e.g. YAH-boo-kah)",
  "example_sr": "A short, natural Serbian example sentence.",
  "example_en": "English translation of the example sentence.",
  "notes": "Brief grammatical, cultural, or real-life Balkan usage tip in 1-2 sentences.",
  "extracted_sr": "If visible text is present (signs/menu/book), full Serbian text extracted here; otherwise empty string",
  "translated_en": "English translation of extracted text; otherwise empty string",
  "vocabulary": [
    { "sr": "key Serbian word 1", "en": "English meaning 1" },
    { "sr": "key Serbian word 2", "en": "English meaning 2" }
  ],
  "sampleIcon": "🔍"
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
                    // Cascade to next model
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
                rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(rawText);
                this.state.currentResult = parsed;
                this.renderUI();
                this.renderResult();
            } catch (err) {
                console.error('[VisualLens] JSON parsing error:', err);
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
                        Za analizu novih fotografija kamerom u realnom vremenu potreban je besplatan Gemini API ključ.
                    </p>
                    <div class="flex flex-col gap-2 pt-2">
                        <button onclick="app.openApiKeyModal()" class="py-3 px-5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs active:scale-95 transition-transform shadow-lg shadow-blue-600/30">
                            ✨ Unesi Gemini API Ključ
                        </button>
                        <button onclick="VisualLens.loadDemo('apple')" class="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs transition-colors">
                            🧪 Isprobaj Demo Uzorak (Jabuka)
                        </button>
                    </div>
                </div>
            `;
        },

        renderUI: function () {
            const viewfinder = document.getElementById('lens-viewfinder-container');
            const previewContainer = document.getElementById('lens-preview-container');
            const previewImg = document.getElementById('lens-preview-img');
            const scanningOverlay = document.getElementById('lens-scanning-overlay');
            const fallback = document.getElementById('lens-fallback-box');

            if (this.state.imageSrc) {
                // Photo has been captured or loaded
                if (viewfinder) viewfinder.classList.add('hidden');
                if (fallback) fallback.classList.add('hidden');
                if (previewContainer) previewContainer.classList.remove('hidden');
                if (previewImg) previewImg.src = this.state.imageSrc;

                if (scanningOverlay) {
                    if (this.state.isLoading) scanningOverlay.classList.remove('hidden');
                    else scanningOverlay.classList.add('hidden');
                }
            } else {
                // No captured photo
                if (previewContainer) previewContainer.classList.add('hidden');
                if (scanningOverlay) scanningOverlay.classList.add('hidden');

                if (this.state.isCameraRunning) {
                    if (viewfinder) viewfinder.classList.remove('hidden');
                    if (fallback) fallback.classList.add('hidden');
                } else {
                    if (viewfinder) viewfinder.classList.add('hidden');
                    if (fallback) fallback.classList.remove('hidden');
                }
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
            const srDisplay = isCyr ? (res.sr_cyr || res.sr_lat) : res.sr_lat;

            const hasOcr = !!(res.extracted_sr && res.extracted_sr.trim().length > 0);
            const hasVocab = Array.isArray(res.vocabulary) && res.vocabulary.length > 0;

            container.innerHTML = `
                <div class="bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-4 fade-in max-h-[60vh] overflow-y-auto pr-1">
                    <!-- Top Bar: Detected Header & Script Switcher -->
                    <div class="flex items-start justify-between gap-3">
                        <div class="flex-1">
                            <div class="flex items-center gap-2">
                                <span class="text-xl">${res.sampleIcon || '📸'}</span>
                                ${res.gender ? `
                                    <span class="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                        ${res.gender || res.gender_short || 'Imenica'}
                                    </span>
                                ` : ''}
                            </div>
                            <h3 class="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-2.5 flex-wrap">
                                <span>${srDisplay || res.title || 'Prepoznato'}</span>
                                ${res.sr_lat ? `
                                    <button onclick="VisualLens.speakWord('${res.sr_lat}')" class="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white text-sm shadow-md active:scale-90 transition-transform shrink-0" title="Izgovori">
                                        🔊
                                    </button>
                                ` : ''}
                            </h3>
                            <p class="text-slate-400 font-bold text-sm mt-0.5">${res.en || ''}</p>
                        </div>
                        <button onclick="VisualLens.toggleScript()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-black text-cyan-400 transition-colors shrink-0">
                            ${isCyr ? 'ЋИР ➔ LAT' : 'LAT ➔ ЋИР'}
                        </button>
                    </div>

                    <!-- Phonetic Pronunciation Guide -->
                    ${res.phonetic ? `
                        <div class="px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
                            <span>🗣️ Izgovor:</span>
                            <span class="font-bold">${res.phonetic}</span>
                        </div>
                    ` : ''}

                    <!-- Example Sentence (Object / Context) -->
                    ${res.example_sr ? `
                        <div class="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                            <div class="flex items-center justify-between text-xs font-black text-slate-300">
                                <span>Primer upotrebe:</span>
                                <button onclick="VisualLens.speakWord('${res.example_sr}')" class="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                                    <span>🔊</span> <span>Čuj</span>
                                </button>
                            </div>
                            <p class="text-sm font-bold text-amber-300">${res.example_sr}</p>
                            <p class="text-xs text-slate-400">${res.example_en || ''}</p>
                        </div>
                    ` : ''}

                    <!-- Extracted Text (OCR / Signs / Menus) -->
                    ${hasOcr ? `
                        <div class="space-y-2.5 pt-1">
                            <div class="flex items-center justify-between text-xs font-black text-slate-400 uppercase tracking-wider">
                                <span>Prepoznat Tekst sa Slike:</span>
                                <button onclick="VisualLens.speakWord('${res.extracted_sr.replace(/\n/g, ' ')}')" class="text-blue-400 hover:text-blue-300 normal-case font-bold flex items-center gap-1">
                                    <span>🔊</span> <span>Pročitaj sve</span>
                                </button>
                            </div>
                            <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                <p class="text-[10px] font-black uppercase text-slate-500 mb-1">Srpski Original</p>
                                <p class="text-sm font-bold text-amber-300 whitespace-pre-line leading-relaxed">${res.extracted_sr}</p>
                            </div>
                            ${res.translated_en ? `
                                <div class="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                                    <p class="text-[10px] font-black uppercase text-slate-500 mb-1">Engleski Prevod</p>
                                    <p class="text-sm font-bold text-cyan-300 whitespace-pre-line leading-relaxed">${res.translated_en}</p>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <!-- Extracted Key Vocabulary Chips -->
                    ${hasVocab ? `
                        <div class="pt-1">
                            <p class="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ključne Reči iz Teksta:</p>
                            <div class="flex flex-wrap gap-2">
                                ${res.vocabulary.map(v => `
                                    <button onclick="VisualLens.speakWord('${v.sr}')" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-1.5 active:scale-95 transition-all" title="Klikni za izgovor">
                                        <span>🔊 ${v.sr}</span> <span class="text-slate-400 text-[10px]">(${v.en})</span>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Linguistic / Cultural Notes -->
                    ${res.notes ? `
                        <p class="text-[11px] text-slate-400 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">💡 ${res.notes}</p>
                    ` : ''}

                    <!-- Action Buttons -->
                    <div class="pt-3 flex flex-col sm:flex-row gap-2">
                        <button onclick="VisualLens.saveMainToFlashcards()" class="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                            <span>⭐</span> <span>Dodaj "${res.sr_lat || 'Reč'}" u Fleškartice (+10 XP)</span>
                        </button>
                        ${hasVocab ? `
                            <button onclick="VisualLens.saveAllVocabulary()" class="py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-900/40 active:scale-95 transition-all flex items-center justify-center gap-1.5">
                                <span>⭐</span> <span>Sačuvaj Sve (${res.vocabulary.length})</span>
                            </button>
                        ` : ''}
                        <button onclick="VisualLens.retakePhoto()" class="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold text-xs transition-colors active:scale-95 flex items-center justify-center gap-1">
                            <span>🔄</span> <span>Nova Slika</span>
                        </button>
                    </div>
                </div>
            `;
        },

        speakWord: function (text) {
            if (!text) return;
            if (window.app && typeof window.app.speakPhrase === 'function') {
                window.app.speakPhrase(text, 'sr');
            } else if (window.app && typeof window.app.speak === 'function') {
                window.app.speak(text, 'sr');
            } else if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'sr-RS';
                window.speechSynthesis.speak(utterance);
            }
        },

        saveMainToFlashcards: function () {
            const res = this.state.currentResult;
            if (!res || !res.sr_lat) return;
            this.saveToFlashcards(res.sr_lat, res.en, res.gender || '');
        },

        saveToFlashcards: function (srWord, enWord, gender) {
            if (!srWord) return;

            if (window.app && window.app.state) {
                if (!window.app.state.mistakeLog) {
                    window.app.state.mistakeLog = {};
                }
                const wordId = 'lens_' + srWord.toLowerCase().replace(/[^a-z0-9]/g, '_');
                window.app.state.mistakeLog[wordId] = (window.app.state.mistakeLog[wordId] || 0) + 1;

                if (window.SrsEngine && typeof window.SrsEngine.getWordRecord === 'function') {
                    const record = window.SrsEngine.getWordRecord(wordId);
                    record.sr = srWord;
                    record.en = enWord;
                    record.gender = gender || '';
                }

                if (typeof window.app.saveState === 'function') {
                    window.app.saveState();
                } else if (typeof window.app.saveStats === 'function') {
                    window.app.saveStats();
                }
            }

            if (typeof TouchHaptics !== 'undefined') TouchHaptics.vibrate('success');

            if (window.app && window.app.showToast) {
                window.app.showToast(`⭐ "${srWord}" sačuvana u fleškartice! (+10 XP)`, 'success');
            }
        },

        saveAllVocabulary: function () {
            const res = this.state.currentResult;
            if (!res || !res.vocabulary || !res.vocabulary.length) return;

            let added = 0;
            res.vocabulary.forEach(v => {
                if (v.sr && v.en) {
                    this.saveToFlashcards(v.sr, v.en, '');
                    added++;
                }
            });

            if (window.app && window.app.showToast) {
                window.app.showToast(`⭐ Sačuvano ${added} reči iz teksta u fleškartice!`, 'success');
            }
        }
    };

    window.VisualLens = VisualLens;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => VisualLens.init());
    } else {
        VisualLens.init();
    }
})();