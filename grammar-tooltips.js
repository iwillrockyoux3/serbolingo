// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo — Smart Grammar Tooltips & Interactive Word Inspector (Priority 44)
// Allows tapping any word in lesson sentences to reveal morphology, Serbian case tags,
// verb tenses, dictionary roots, instant translation, audio, and 1-tap Flashcard saving.

(function () {
    'use strict';

    // Transliteration Tables
    const CYR_TO_LAT = {
        'џ': 'dž', 'Џ': 'Dž',
        'љ': 'lj', 'Љ': 'Lj',
        'њ': 'nj', 'Њ': 'Nj',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e',
        'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 't': 't', 'ћ': 'ć',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č', 'ш': 'š'
    };

    const LAT_TO_CYR = {
        'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
        'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ',
        'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
        'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
        'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'ć': 'ћ',
        'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'š': 'ш'
    };

    function toLatin(text) {
        if (!text) return '';
        let res = text;
        for (const [cyr, lat] of Object.entries(CYR_TO_LAT)) {
            res = res.split(cyr).join(lat);
            res = res.split(cyr.toUpperCase()).join(lat.charAt(0).toUpperCase() + lat.slice(1));
        }
        return res;
    }

    function toCyrillic(text) {
        if (!text) return '';
        let res = text;
        for (const [lat, cyr] of Object.entries(LAT_TO_CYR)) {
            if (lat.length > 1) res = res.split(lat).join(cyr);
        }
        for (const [lat, cyr] of Object.entries(LAT_TO_CYR)) {
            if (lat.length === 1) {
                res = res.split(lat).join(cyr);
                res = res.split(lat.toUpperCase()).join(cyr.toUpperCase());
            }
        }
        return res;
    }

    // Common English Irregular Verbs & Nouns
    const EN_IRREGULARS = {
        'went': { root: 'go', tag: 'Past Simple (Prošlo vreme)', trans: 'išao / otišao' },
        'gone': { root: 'go', tag: 'Past Participle (Prošli particip)', trans: 'otišao' },
        'had': { root: 'have', tag: 'Past Simple (Prošlo vreme)', trans: 'imao' },
        'did': { root: 'do', tag: 'Past Simple (Prošlo vreme)', trans: 'uradio' },
        'saw': { root: 'see', tag: 'Past Simple (Prošlo vreme)', trans: 'video' },
        'seen': { root: 'see', tag: 'Past Participle (Prošli particip)', trans: 'viđen' },
        'bought': { root: 'buy', tag: 'Past Simple (Prošlo vreme)', trans: 'kupio' },
        'came': { root: 'come', tag: 'Past Simple (Prošlo vreme)', trans: 'došao' },
        'took': { root: 'take', tag: 'Past Simple (Prošlo vreme)', trans: 'uzeo' },
        'gave': { root: 'give', tag: 'Past Simple (Prošlo vreme)', trans: 'dao' },
        'spoke': { root: 'speak', tag: 'Past Simple (Prošlo vreme)', trans: 'govorio' },
        'ate': { root: 'eat', tag: 'Past Simple (Prošlo vreme)', trans: 'jeo' },
        'drank': { root: 'drink', tag: 'Past Simple (Prošlo vreme)', trans: 'pio' },
        'wrote': { root: 'write', tag: 'Past Simple (Prošlo vreme)', trans: 'pisao' },
        'children': { root: 'child', tag: 'Nepravilna množina (Plural)', trans: 'deca' },
        'men': { root: 'man', tag: 'Nepravilna množina (Plural)', trans: 'ljudi / muškarci' },
        'women': { root: 'woman', tag: 'Nepravilna množina (Plural)', trans: 'žene' },
        'teeth': { root: 'tooth', tag: 'Nepravilna množina (Plural)', trans: 'zubi' },
        'feet': { root: 'foot', tag: 'Nepravilna množina (Plural)', trans: 'stopala' }
    };

    const GrammarEngine = {
        _dictIndex: null,
        activeWordEl: null,
        isAnswered: false, // Anti-cheat guard: Only allowed AFTER user submits their answer

        // Activate or deactivate word inspection mode
        setAnswered: function (answered) {
            this.isAnswered = !!answered;
            const words = document.querySelectorAll('.grammar-word');
            words.forEach(el => {
                if (this.isAnswered) {
                    el.classList.add('cursor-pointer', 'underline', 'decoration-dotted', 'decoration-indigo-400', 'hover:text-indigo-400', 'active:scale-95');
                    el.classList.remove('cursor-default');
                } else {
                    el.classList.remove('cursor-pointer', 'underline', 'decoration-dotted', 'decoration-indigo-400', 'hover:text-indigo-400', 'active:scale-95');
                    el.classList.add('cursor-default');
                }
            });
            if (!this.isAnswered) {
                this.hideTooltip();
            }
        },

        // Build fast in-memory dictionary lookup index
        initIndex: function () {
            if (this._dictIndex) return;
            this._dictIndex = {
                srMap: new Map(),
                enMap: new Map()
            };

            const dict = (typeof DICTIONARY !== 'undefined' && Array.isArray(DICTIONARY))
                ? DICTIONARY
                : ((typeof window !== 'undefined' && Array.isArray(window.DICTIONARY)) ? window.DICTIONARY : []);

            for (let i = 0; i < dict.length; i++) {
                const item = dict[i];
                if (item.sr_lat) {
                    const srLower = item.sr_lat.toLowerCase().trim();
                    if (!this._dictIndex.srMap.has(srLower)) {
                        this._dictIndex.srMap.set(srLower, item);
                    }
                }
                if (item.en) {
                    const enLower = item.en.toLowerCase().trim();
                    if (!this._dictIndex.enMap.has(enLower)) {
                        this._dictIndex.enMap.set(enLower, item);
                    }
                }
            }
        },

        // Wrap words inside a sentence with interactive spans (clickable ONLY after answering)
        wrapInteractiveWords: function (text) {
            if (!text || typeof text !== 'string') return text;

            // Regex matches words (both Latin with diacritics and Cyrillic) and keeps whitespace/punctuation
            const tokenRegex = /([a-zA-ZčćžšđČĆŽŠĐ\u0400-\u04FF]+)/g;
            const dynamicClasses = this.isAnswered
                ? 'cursor-pointer underline decoration-dotted decoration-indigo-400 hover:text-indigo-400 font-bold transition-all px-0.5 rounded hover:bg-indigo-50/70 dark:hover:bg-indigo-900/30 active:scale-95'
                : 'cursor-default font-bold';

            return text.replace(tokenRegex, (word) => {
                const clean = word.replace(/'/g, "\\'");
                return `<span class="grammar-word ${dynamicClasses}" onclick="GrammarEngine.showTooltip(this, '${clean}')" data-word="${clean}">${word}</span>`;
            });
        },

        // Analyze tapped word for dictionary definition, case, gender, and verb tense
        analyzeWord: function (rawWord) {
            this.initIndex();

            const cleaned = rawWord.trim().replace(/^[.,?!":;()[\]{}«»„“"'\-*]+|[.,?!":;()[\]{}«»„“"'\-*]+$/g, '');
            const lowerWord = cleaned.toLowerCase();
            const isCyrillic = /[\u0400-\u04FF]/.test(cleaned);
            const latWord = isCyrillic ? toLatin(cleaned).toLowerCase() : lowerWord;

            const isSrToEn = (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'sr_to_en');

            // 1. Check English irregulars first
            if (EN_IRREGULARS[lowerWord]) {
                const irr = EN_IRREGULARS[lowerWord];
                return {
                    originalWord: cleaned,
                    root: irr.root,
                    pos: 'verb / noun',
                    gender: null,
                    translation: irr.trans,
                    caseTag: irr.tag,
                    explanation: `Nepravilan oblik u engleskom jeziku od osnovne reči "${irr.root}".`,
                    example: null,
                    audioWord: lowerWord,
                    isEnglish: true
                };
            }

            // 2. Direct match in dictionary (Serbian)
            if (this._dictIndex.srMap.has(latWord)) {
                const item = this._dictIndex.srMap.get(latWord);
                return {
                    originalWord: cleaned,
                    root: item.sr_lat,
                    pos: item.pos || 'reč',
                    gender: item.gender || null,
                    translation: item.en || '',
                    caseTag: 'Osnovni oblik (Nominativ / Rječnik)',
                    explanation: `Osnovni oblik reči (rečnik).`,
                    example: item.example_sr || null,
                    exampleEn: item.example_en || null,
                    audioWord: item.sr_lat,
                    isEnglish: false
                };
            }

            // 3. Direct match in dictionary (English)
            if (this._dictIndex.enMap.has(lowerWord)) {
                const item = this._dictIndex.enMap.get(lowerWord);
                return {
                    originalWord: cleaned,
                    root: item.en,
                    pos: item.pos || 'word',
                    gender: null,
                    translation: item.sr_lat || '',
                    caseTag: 'Base Form / Lemma',
                    explanation: `Base dictionary form.`,
                    example: item.example_en || null,
                    exampleEn: item.example_sr || null,
                    audioWord: item.en,
                    isEnglish: true
                };
            }

            // 4. Morphological Analysis: Serbian Case & Verb Endings
            const morph = this._detectSerbianMorphology(latWord);
            if (morph) {
                return {
                    originalWord: cleaned,
                    root: morph.root,
                    pos: morph.pos,
                    gender: morph.gender,
                    translation: morph.translation,
                    caseTag: morph.caseTag,
                    explanation: morph.explanation,
                    example: morph.example,
                    exampleEn: morph.exampleEn,
                    audioWord: morph.root,
                    isEnglish: false
                };
            }

            // 5. Morphological Analysis: English Endings (-ed, -ing, -s)
            const enMorph = this._detectEnglishMorphology(lowerWord);
            if (enMorph) {
                return enMorph;
            }

            // 6. Fallback: Fuzzy or partial match
            return {
                originalWord: cleaned,
                root: cleaned,
                pos: 'izraz',
                gender: null,
                translation: isSrToEn ? 'reč u rečenici' : 'word in context',
                caseTag: 'Tekstualni kontekst',
                explanation: `Reč u rečenici.`,
                example: null,
                audioWord: cleaned,
                isEnglish: false
            };
        },

        // Serbian declension and conjugation pattern engine
        _detectSerbianMorphology: function (word) {
            const len = word.length;
            if (len < 3) return null;

            // --- A. AKUZATIV (Feminine nouns: -u -> -a) ---
            // e.g. školu -> škola, knjigu -> knjiga, kuću -> kuća, kafu -> kafa, vodu -> voda
            if (word.endsWith('u')) {
                const cand = word.slice(0, -1) + 'a';
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Akuzativ (Pravac ili objekat / Accusative)',
                        explanation: `Imenica ženskog roda u akuzativu (koga/šta? kuda?). Koristi se za cilj kretanja ("u školu") ili direktan objekat radnje.`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- B. GENITIV (Feminine: -e -> -a; Masculine/Neuter: -a -> consonant/-o) ---
            // Feminine: škole -> škola, kuće -> kuća, vode -> voda
            if (word.endsWith('e')) {
                const cand = word.slice(0, -1) + 'a';
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Genitiv / Množina (Genitive / Plural)',
                        explanation: `Imenica ženskog roda u genitivu (koga/čega?) ili nominativu množine (npr. "kuće", "knjige").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // Masculine/Neuter Genitive: hleba -> hleb, mleka -> mleko, grada -> grad
            if (word.endsWith('a')) {
                // Drop 'a' for masculine
                const candMasc = word.slice(0, -1);
                if (this._dictIndex.srMap.has(candMasc)) {
                    const item = this._dictIndex.srMap.get(candMasc);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en,
                        caseTag: 'Genitiv (Količina ili odricanje / Genitive)',
                        explanation: `Genitiv muškog roda (koga/čega?). Označava količinu ili negaciju (npr. "nema hleba").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
                // Replace 'a' with 'o' for neuter
                const candNeut = word.slice(0, -1) + 'o';
                if (this._dictIndex.srMap.has(candNeut)) {
                    const item = this._dictIndex.srMap.get(candNeut);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 's',
                        translation: item.en,
                        caseTag: 'Genitiv (Količina ili negacija / Genitive)',
                        explanation: `Genitiv srednjeg roda (koga/čega?). Često se koristi uz reč "nema" (npr. "nema mleka").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- C. DATIV / LOKATIV (Feminine: -i -> -a; Masculine: -u -> cons) ---
            // e.g. školi -> škola, kući -> kuća
            if (word.endsWith('i')) {
                const cand = word.slice(0, -1) + 'a';
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Dativ / Lokativ (Namena ili lokacija)',
                        explanation: `Dativ/Lokativ ženskog roda (kome/čemu? gde?). Označava lokaciju (npr. "u školi") ili primaoca radnje.`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- D. INSTRUMENTAL (-om / -em) ---
            // e.g. školom -> škola, knjigom -> knjiga, autom -> auto, prijateljem -> prijatelj
            if (word.endsWith('om')) {
                const candFem = word.slice(0, -2) + 'a';
                if (this._dictIndex.srMap.has(candFem)) {
                    const item = this._dictIndex.srMap.get(candFem);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Instrumental (Društvo ili sredstvo)',
                        explanation: `Instrumental ženskog roda (s kim/čim?). Označava sredstvo ili društvo (npr. "sa školom", "knjigom").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
                const candMasc = word.slice(0, -2);
                if (this._dictIndex.srMap.has(candMasc)) {
                    const item = this._dictIndex.srMap.get(candMasc);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en,
                        caseTag: 'Instrumental (Sredstvo ili prevoz)',
                        explanation: `Instrumental muškog roda (čime?). Označava prevozno sredstvo ili oruđe (npr. "autom", "vozom").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }
            if (word.endsWith('em')) {
                const candMasc = word.slice(0, -2);
                if (this._dictIndex.srMap.has(candMasc)) {
                    const item = this._dictIndex.srMap.get(candMasc);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en,
                        caseTag: 'Instrumental (Društvo / Companion)',
                        explanation: `Instrumental muškog roda sa mekim suglasnikom (s kim/čim? npr. "sa prijateljem").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- E. PLURAL (-ovi / -evi) ---
            // e.g. gradovi -> grad, sinovi -> sin, brojevi -> broj
            if (word.endsWith('ovi')) {
                const cand = word.slice(0, -3);
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en + ' (plural)',
                        caseTag: 'Množina (Nominativ Množine / Plural)',
                        explanation: `Množina jednosložnih imenica muškog roda sa umetnutim nastavkom -ov- (npr. grad -> gradovi).`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- F. VERB CONJUGATIONS (Prezent: -m, -š, -mo, -te, -e) ---
            // e.g. živim -> živeti, radim -> raditi, volim -> voleti, idemo -> ići, gledaju -> gledati
            const verbEndings = [
                { end: 'mo', person: '1. lice množine: "Mi" (We)', strip: 2 },
                { end: 'te', person: '2. lice množine: "Vi" (You all)', strip: 2 },
                { end: 'm', person: '1. lice jednine: "Ja" (I)', strip: 1 },
                { end: 'š', person: '2. lice jednine: "Ti" (You)', strip: 1 }
            ];

            for (const v of verbEndings) {
                if (word.endsWith(v.end)) {
                    const baseStem = word.slice(0, -v.strip);
                    const infinitiveCandidates = [
                        baseStem + 'ti',
                        baseStem + 'eti',
                        baseStem.slice(0, -1) + 'eti',
                        baseStem.slice(0, -1) + 'ati'
                    ];
                    for (const inf of infinitiveCandidates) {
                        if (this._dictIndex.srMap.has(inf)) {
                            const item = this._dictIndex.srMap.get(inf);
                            return {
                                root: item.sr_lat,
                                pos: 'glagol',
                                gender: null,
                                translation: item.en,
                                caseTag: `Prezent (${v.person})`,
                                explanation: `Sadašnje vreme (Prezent) glagola "${item.sr_lat}" (${item.en}).`,
                                example: item.example_sr,
                                exampleEn: item.example_en
                            };
                        }
                    }
                }
            }

            // --- G. PERFEKAT (Past Participle: -ao, -la, -lo, -li) ---
            // e.g. gledao/gledali -> gledati, išao/išli -> ići
            if (word.endsWith('li') || word.endsWith('ao') || word.endsWith('la')) {
                const stem = word.endsWith('ao') ? word.slice(0, -2) : word.slice(0, -2);
                const infCandidates = [stem + 'ti', stem + 'ati', stem + 'eti'];
                for (const inf of infCandidates) {
                    if (this._dictIndex.srMap.has(inf)) {
                        const item = this._dictIndex.srMap.get(inf);
                        return {
                            root: item.sr_lat,
                            pos: 'glagol',
                            gender: null,
                            translation: item.en + ' (past tense)',
                            caseTag: 'Perfekat (Prošlo vreme / Past Tense)',
                            explanation: `Glagolski oblik za prošlo vreme (Perfekat) od "${item.sr_lat}".`,
                            example: item.example_sr,
                            exampleEn: item.example_en
                        };
                    }
                }
            }

            return null;
        },

        // English morphology detection
        _detectEnglishMorphology: function (word) {
            if (word.endsWith('ed') && word.length > 4) {
                const stem = word.slice(0, -2);
                const cand = this._dictIndex.enMap.has(stem) ? stem : (this._dictIndex.enMap.has(stem + 'e') ? stem + 'e' : null);
                if (cand) {
                    const item = this._dictIndex.enMap.get(cand);
                    return {
                        originalWord: word,
                        root: item.en,
                        pos: 'verb',
                        gender: null,
                        translation: item.sr_lat + ' (prošlost)',
                        caseTag: 'Past Simple (Prošlo vreme)',
                        explanation: `Regular past tense ending (-ed) of verb "${item.en}".`,
                        example: item.example_en,
                        audioWord: item.en,
                        isEnglish: true
                    };
                }
            }

            if (word.endsWith('ing') && word.length > 5) {
                const stem = word.slice(0, -3);
                const cand = this._dictIndex.enMap.has(stem) ? stem : (this._dictIndex.enMap.has(stem + 'e') ? stem + 'e' : null);
                if (cand) {
                    const item = this._dictIndex.enMap.get(cand);
                    return {
                        originalWord: word,
                        root: item.en,
                        pos: 'verb',
                        gender: null,
                        translation: item.sr_lat + ' (trajanje)',
                        caseTag: 'Present Continuous / Gerund',
                        explanation: `Continuous verb form ending (-ing) of "${item.en}".`,
                        example: item.example_en,
                        audioWord: item.en,
                        isEnglish: true
                    };
                }
            }

            return null;
        },

        // Open floating tooltip near tapped element
        showTooltip: function (targetEl, rawWord) {
            // Anti-cheat guard: Only allow word inspection AFTER question is answered
            if (!this.isAnswered) return;
            if (!targetEl || !rawWord) return;
            const tooltip = document.getElementById('grammar-tooltip');
            if (!tooltip) return;

            const info = this.analyzeWord(rawWord);
            this.renderTooltipContent(tooltip, info);

            tooltip.classList.remove('hidden');

            // Tactile audio click
            if (typeof app !== 'undefined' && app.playSound) {
                app.playSound('click');
            }

            // Mobile viewport positioning & clamping
            const rect = targetEl.getBoundingClientRect();
            const tooltipWidth = 320;
            const tooltipHeight = 240;

            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            const minLeft = 10;
            const maxLeft = window.innerWidth - tooltipWidth - 10;
            left = Math.max(minLeft, Math.min(left, maxLeft));

            let top = rect.top - tooltipHeight - 12;
            if (top < 12) {
                top = rect.bottom + 12; // place below if no room above
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            this.activeWordEl = targetEl;
        },

        hideTooltip: function () {
            const tooltip = document.getElementById('grammar-tooltip');
            if (tooltip) {
                tooltip.classList.add('hidden');
            }
            this.activeWordEl = null;
        },

        renderTooltipContent: function (container, info) {
            const isLearnSr = (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'en_to_sr');
            const isCyrillicMode = (typeof state !== 'undefined' && state.settings && state.settings.script === 'cyrillic');

            const displayWord = isCyrillicMode && !info.isEnglish ? toCyrillic(info.originalWord) : info.originalWord;
            const displayRoot = isCyrillicMode && !info.isEnglish ? toCyrillic(info.root) : info.root;

            const genderBadge = info.gender ? (
                info.gender === 'ž' ? '<span class="px-2 py-0.5 rounded-lg bg-pink-500/20 text-pink-300 font-bold text-[10px]">♀ Ženski rod</span>' :
                info.gender === 'm' ? '<span class="px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 font-bold text-[10px]">♂ Muški rod</span>' :
                '<span class="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-[10px]">⚪ Srednji rod</span>'
            ) : '';

            const exampleHtml = info.example ? `
                <div class="mt-2.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                    <p class="font-bold text-white">💬 "${info.example}"</p>
                    ${info.exampleEn ? `<p class="text-slate-400 text-[10px] mt-0.5">"${info.exampleEn}"</p>` : ''}
                </div>
            ` : '';

            container.innerHTML = `
                <!-- Top Header -->
                <div class="flex items-start justify-between mb-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-black text-white leading-tight">${displayWord}</span>
                        ${displayRoot && displayRoot.toLowerCase() !== displayWord.toLowerCase() ? `<span class="text-xs font-bold text-slate-400">(${displayRoot})</span>` : ''}
                        <button onclick="GrammarEngine.playWordAudio('${info.audioWord}')" class="w-7 h-7 rounded-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs active:scale-90 transition-transform" title="Hear Audio">
                            🔊
                        </button>
                    </div>
                    <button onclick="GrammarEngine.hideTooltip()" class="text-slate-400 hover:text-white font-black text-xs w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
                        ✕
                    </button>
                </div>

                <!-- Translation Banner -->
                <div class="py-1.5 px-3 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-black text-sm mb-2.5 flex items-center justify-between">
                    <span>${info.translation}</span>
                    <span class="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">${info.pos}</span>
                </div>

                <!-- Smart Case / Tense Tag -->
                <div class="flex flex-wrap items-center gap-1.5 mb-2">
                    <span class="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                        🏷️ ${info.caseTag}
                    </span>
                    ${genderBadge}
                </div>

                <!-- Morphological Explanation -->
                <p class="text-xs text-slate-300 leading-relaxed font-medium">
                    ${info.explanation}
                </p>

                <!-- Context Example -->
                ${exampleHtml}

                <!-- Bottom Quick Actions -->
                <div class="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2">
                    <button onclick="GrammarEngine.addToFlashcards('${info.root}', '${info.translation}')" class="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-left font-bold text-[11px] text-amber-300 flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-sm">
                        ⭐ Dodaj u Flashcards
                    </button>
                    <button onclick="GrammarEngine.hideTooltip()" class="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold text-[11px] text-slate-300 active:scale-95 transition-transform">
                        Zatvori
                    </button>
                </div>
            `;
        },

        playWordAudio: function (word) {
            if (!word) return;
            if (typeof app !== 'undefined' && app.speakWord) {
                const isEnglish = (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'sr_to_en');
                app.speakWord(word, isEnglish ? 'en-US' : 'sr-RS');
            } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(word);
                u.lang = 'sr-RS';
                window.speechSynthesis.speak(u);
            }
        },

        addToFlashcards: function (rootWord, translation) {
            if (typeof app !== 'undefined' && app.toggleFlashcard) {
                app.toggleFlashcard(rootWord);
            } else if (typeof state !== 'undefined') {
                if (!state.mistakeLog) state.mistakeLog = [];
                if (!state.mistakeLog.includes(rootWord)) {
                    state.mistakeLog.push(rootWord);
                    if (typeof app !== 'undefined' && app.saveStats) app.saveStats();
                }
            }
            if (typeof app !== 'undefined' && app.showToast) {
                app.showToast(`⭐ "${rootWord}" dodato u Flashcards!`, 'success');
            }
            this.hideTooltip();
        }
    };

    // Auto-dismiss tooltip when clicking outside
    document.addEventListener('click', function (e) {
        const tooltip = document.getElementById('grammar-tooltip');
        if (!tooltip || tooltip.classList.contains('hidden')) return;

        if (tooltip.contains(e.target) || e.target.classList.contains('grammar-word')) {
            return;
        }
        GrammarEngine.hideTooltip();
    });

    window.addEventListener('resize', function () {
        GrammarEngine.hideTooltip();
    });

    // Expose to window
    window.GrammarEngine = GrammarEngine;

})();
