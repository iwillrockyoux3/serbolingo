const QuestionEngine = {
    // Utility to shuffle an array
    shuffle(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Get N random elements from array excluding target and avoiding duplicate meanings
    getRandomDistractors(array, target, count) {
        const targetId = typeof target === 'object' && target ? target.id : target;
        const targetWord = typeof target === 'object' && target ? target : (array || []).find(w => w.id === targetId);

        const targetEn = targetWord && targetWord.en ? targetWord.en.trim().toLowerCase() : '';
        const targetSr = targetWord && targetWord.sr_lat ? targetWord.sr_lat.trim().toLowerCase() : '';

        const seenEn = new Set(targetEn ? [targetEn] : []);
        const seenSr = new Set(targetSr ? [targetSr] : []);
        const distractors = [];

        // 1. Pass 1: Gather distinct distractors from the current category array
        const shuffled = this.shuffle(array || []);
        for (const w of shuffled) {
            if (!w || w.id === targetId) continue;
            const wEn = (w.en || '').trim().toLowerCase();
            const wSr = (w.sr_lat || '').trim().toLowerCase();
            if (!wEn || !wSr) continue;
            if (seenEn.has(wEn) || seenSr.has(wSr)) continue;

            seenEn.add(wEn);
            seenSr.add(wSr);
            distractors.push(w);
            if (distractors.length >= count) break;
        }

        // 2. Pass 2 (Fallback): If category array has fewer unique words, borrow unique distractors from global dictionary
        if (distractors.length < count) {
            const globalPool = (typeof window !== 'undefined' && window.SEED_DATA && Array.isArray(window.SEED_DATA))
                ? window.SEED_DATA
                : (typeof DICTIONARY !== 'undefined' && Array.isArray(DICTIONARY) ? DICTIONARY : []);

            if (globalPool.length > 0) {
                const globalShuffled = this.shuffle(globalPool);
                for (const w of globalShuffled) {
                    if (!w || w.id === targetId) continue;
                    const wEn = (w.en || '').trim().toLowerCase();
                    const wSr = (w.sr_lat || '').trim().toLowerCase();
                    if (!wEn || !wSr) continue;
                    if (seenEn.has(wEn) || seenSr.has(wSr)) continue;

                    seenEn.add(wEn);
                    seenSr.add(wSr);
                    distractors.push(w);
                    if (distractors.length >= count) break;
                }
            }
        }

        return distractors;
    },

    // Generates a single Multiple Choice question object that matches the legacy CURRICULUM format
    generateMultipleChoice(word, allWordsInCategory) {
        const distractors = this.getRandomDistractors(allWordsInCategory, word, 2);
        if (!distractors || distractors.length < 2) return null;
        
        // English to Serbian direction (Default)
        const q_enToSr = `Translate: "${word.en}"`;
        const options_enToSr = this.shuffle([
            word.sr_lat,
            distractors[0].sr_lat,
            distractors[1].sr_lat
        ]);
        const correct_enToSr = word.sr_lat;
        
        const guide_enToSr = {};
        distractors.forEach(d => {
            // In EN->SR, the user picks a Serbian word. The guide tells them what it actually means in English.
            guide_enToSr[d.sr_lat] = `❌ "${d.sr_lat}" means "${d.en}".`;
        });

        // Serbian to English direction (Reversed)
        const q_srToEn = `Kako se kaže "${word.sr_lat}"?`;
        const options_srToEn = this.shuffle([
            word.en,
            distractors[0].en,
            distractors[1].en
        ]);
        const correct_srToEn = word.en;
        
        const guide_srToEn = {};
        distractors.forEach(d => {
            // In SR->EN, the user picks an English word. The guide tells them what it actually means in Serbian.
            guide_srToEn[d.en] = `❌ "${d.en}" znači "${d.sr_lat}".`;
        });

        return {
            type: 'multiple_choice',
            q: q_enToSr,
            q_rev: q_srToEn,
            options: options_enToSr,
            options_rev: options_srToEn,
            correct: correct_enToSr,
            correct_rev: correct_srToEn,
            guide: guide_enToSr,
            guide_rev: guide_srToEn,
            explanation: `<div class="flex flex-col gap-1 text-sm mt-1">
                <div>✅ <b>"${word.sr_lat}"</b> means "${word.en}".</div>
                <div>❌ <b>"${distractors[0].sr_lat}"</b> means "${distractors[0].en}".</div>
                <div>❌ <b>"${distractors[1].sr_lat}"</b> means "${distractors[1].en}".</div>
            </div>`,
            explanation_rev: `<div class="flex flex-col gap-1 text-sm mt-1">
                <div>✅ <b>"${word.en}"</b> znači "${word.sr_lat}".</div>
                <div>❌ <b>"${distractors[0].en}"</b> znači "${distractors[0].sr_lat}".</div>
                <div>❌ <b>"${distractors[1].en}"</b> znači "${distractors[1].sr_lat}".</div>
            </div>`
        };
    },

    // Generates a Speaking question
    generateSpeaking(word) {
        return {
            type: 'speaking',
            q: `How do you say this in Serbian?\n"${word.en}"\n(Tap mic to speak)`,
            q_rev: `Kako se ovo kaže na engleskom?\n"${word.sr_lat}"\n(Tap mic to speak)`,
            correct: word.sr_lat,
            correct_rev: word.en,
            // Voice targets
            targetLang: 'sr-RS',
            targetLang_rev: 'en-US'
        };
    },

    // Generates a Speaking question for full sentences (e.g. grammar)
    generateSpeakingSentence(word) {
        if (!word.example_en || !word.example_sr) return null;
        return {
            type: 'speaking',
            q: `Say this sentence in Serbian:\n"${word.example_en}"\n(Tap mic to speak)`,
            q_rev: `Say this sentence in English:\n"${word.example_sr}"\n(Tap mic to speak)`,
            correct: word.example_sr,
            correct_rev: word.example_en,
            targetLang: 'sr-RS',
            targetLang_rev: 'en-US'
        };
    },

    // Generates a Picture Choice question (Emoji Choice)
    generatePictureChoice(word, allWords) {
        // Needs 3 distractors with emojis, strictly deduplicated by text
        const targetEn = (word.en || '').trim().toLowerCase();
        const targetSr = (word.sr_lat || '').trim().toLowerCase();
        const seenEn = new Set([targetEn]);
        const seenSr = new Set([targetSr]);
        const distractors = [];

        const pool = (allWords || []).filter(w => w.id !== word.id && w.emoji);
        const shuffled = this.shuffle(pool);
        for (const w of shuffled) {
            const wEn = (w.en || '').trim().toLowerCase();
            const wSr = (w.sr_lat || '').trim().toLowerCase();
            if (!wEn || !wSr || seenEn.has(wEn) || seenSr.has(wSr)) continue;
            seenEn.add(wEn);
            seenSr.add(wSr);
            distractors.push(w);
            if (distractors.length >= 3) break;
        }
        
        // If we don't have enough distinct distractors with emojis, fallback to standard multiple choice structure
        if (distractors.length < 3) {
            return this.generateMultipleChoice(word, allWords);
        }
        
        let options = this.shuffle([word, ...distractors]);
        
        return {
            type: 'picture_choice',
            q: word.en,
            q_rev: word.sr_lat,
            // The options are objects with text and emoji
            options: options.map(o => ({ text: o.sr_lat, emoji: o.emoji })),
            options_rev: options.map(o => ({ text: o.en, emoji: o.emoji })),
            correct: word.sr_lat,
            correct_rev: word.en,
        };
    },

    // Generates a Listening question (Audio -> Translate/Select)
    generateListening(word, allWords) {
        // Must have 3 strictly deduplicated distractors so options have NO duplicates
        const distractors = this.getRandomDistractors(allWords, word, 3);
        if (!distractors || distractors.length < 3) {
            return this.generateMultipleChoice(word, allWords);
        }
        
        // For listening:
        // When learning Serbian (en_to_sr): Audio is Serbian (word.sr_lat), options are English meanings (word.en)
        // When learning English (sr_to_en): Audio is Serbian (word.sr_lat), options are English meanings (word.en)
        let options_enToSr = this.shuffle([word.en, ...distractors.map(d => d.en)]);
        let options_srToEn = this.shuffle([word.en, ...distractors.map(d => d.en)]);

        return {
            type: 'listening',
            q_audio: word.sr_lat, // Hear Serbian word
            q_audio_rev: word.sr_lat, // Hear Serbian word
            
            // Audio targets for Voice Synthesis: Always authentic Serbian
            audioLang: 'sr-RS',
            audioLang_rev: 'sr-RS',

            options: options_enToSr,
            options_rev: options_srToEn,
            correct: word.en,
            correct_rev: word.en,
        };
    },

    // Generates a Fill-in-the-blank question object
    generateFillBlank(word) {
        // We need example sentences to do this properly
        if (!word.example_en || !word.example_sr) {
            return null; // Fallback to multiple choice if no sentence exists
        }

        const cleanStr = (s) => (s || '').replace(/\([^)]*\)/g, '').replace(/^[^\wčćžšđČĆŽŠĐ]+|[^\wčćžšđČĆŽŠĐ]+$/g, '').trim();
        const esc = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

        // Extract Serbian blank token & sentence (stem-aware for inflected cases)
        let srBlankSentence = null;
        let srAnswer = word.sr_lat;
        const cleanSr = cleanStr(word.sr_lat);
        if (cleanSr) {
            const exactM = word.example_sr.match(new RegExp('\\b' + esc(cleanSr) + '\\b', 'i'));
            if (exactM) {
                srAnswer = exactM[0];
                srBlankSentence = word.example_sr.slice(0, exactM.index) + '____' + word.example_sr.slice(exactM.index + exactM[0].length);
            } else if (cleanSr.length >= 3) {
                const first = cleanSr.split(/\s+/)[0];
                const stem = first.length >= 5 ? first.slice(0, 4) : first.slice(0, 3);
                const stemM = word.example_sr.match(new RegExp('\\b' + esc(stem) + '[a-zA-ZčćžšđČĆŽŠĐ]*\\b', 'i'));
                if (stemM) {
                    srAnswer = stemM[0];
                    srBlankSentence = word.example_sr.slice(0, stemM.index) + '____' + word.example_sr.slice(stemM.index + stemM[0].length);
                }
            }
        }
        if (!srBlankSentence) {
            srBlankSentence = word.example_sr.replace(new RegExp('\\b' + esc(word.sr_lat) + '\\b', 'i'), '____');
        }

        // Extract English blank token & sentence
        let enBlankSentence = null;
        let enAnswer = word.en;
        const cleanEn = cleanStr(word.en);
        if (cleanEn) {
            const exactM = word.example_en.match(new RegExp('\\b' + esc(cleanEn) + '\\b', 'i'));
            if (exactM) {
                enAnswer = exactM[0];
                enBlankSentence = word.example_en.slice(0, exactM.index) + '____' + word.example_en.slice(exactM.index + exactM[0].length);
            } else if (cleanEn.length >= 3) {
                const first = cleanEn.split(/\s+/)[0];
                const stem = first.length >= 5 ? first.slice(0, 4) : first.slice(0, 3);
                const stemM = word.example_en.match(new RegExp('\\b' + esc(stem) + '[a-zA-Z]*\\b', 'i'));
                if (stemM) {
                    enAnswer = stemM[0];
                    enBlankSentence = word.example_en.slice(0, stemM.index) + '____' + word.example_en.slice(stemM.index + stemM[0].length);
                }
            }
        }
        if (!enBlankSentence) {
            enBlankSentence = word.example_en.replace(new RegExp('\\b' + esc(word.en) + '\\b', 'i'), '____');
        }

        // EN to SR: Show English sentence, show Serbian sentence with target word blanked out
        // E.g., "I have one car" -> "Imam ____ auto", user types "jedan"
        let q_enToSr = `Translate: "${word.example_en}"\n\n${srBlankSentence}`;
        let correct_enToSr = srAnswer;

        // SR to EN: Show Serbian sentence, show English sentence with target word blanked out
        let q_srToEn = `Prevedi: "${word.example_sr}"\n\n${enBlankSentence}`;
        let correct_srToEn = enAnswer;

        return {
            type: 'fill_blank',
            q: q_enToSr,
            q_rev: q_srToEn,
            correct: correct_enToSr,
            correct_rev: correct_srToEn,
            alt_correct: word.sr_lat,
            alt_correct_rev: word.en,
            explanation: `💡 The missing word was "${correct_enToSr}" (${word.en}).`,
            explanation_rev: `💡 The missing word was "${correct_srToEn}" (${word.sr_lat}).`
        };
    },

    // Generates a Word Order (Scrambled Sentence) question object
    generateWordOrder(word) {
        if (!word.example_en || !word.example_sr) {
            return null;
        }

        // We scramble the target sentence
        const scramble = (sentence) => this.shuffle(sentence.replace(/[.,!?]/g, '').split(' '));

        return {
            type: 'word_order',
            q: `Arrange: "${word.example_en}"`,
            q_rev: `Složi rečenicu: "${word.example_sr}"`,
            scrambled: scramble(word.example_sr),
            scrambled_rev: scramble(word.example_en),
            correct: word.example_sr.replace(/[.,!?]/g, ''),
            correct_rev: word.example_en.replace(/[.,!?]/g, ''),
            explanation: `💡 The correct order is: "${word.example_sr}"`,
            explanation_rev: `💡 The correct order is: "${word.example_en}"`
        };
    },

    // Generates a Spelling Voice question object
    generateSpellingVoice(word) {
        return {
            type: 'spelling_voice',
            q: `Spell out loud:\n"${word.en}"\n(Tap mic)`,
            q_rev: `Slovkaj naglas:\n"${word.sr_lat}"\n(Tap mic)`,
            correct: word.sr_lat,
            correct_rev: word.en,
            targetLang: 'sr-RS',
            targetLang_rev: 'en-US',
            explanation: `💡 Listen to the correct spelling!`,
            explanation_rev: `💡 Slušaj pravilno sricanje!`
        };
    },

    // Generates a Drag Punctuation question object
    generateDragPunctuation(word) {
        // Find punctuation marks in the sentence and replace them with ___
        const extractPunctuation = (text) => {
            const puncRegex = /([.,!?;:])/g;
            let stripped = text;
            let puncMarks = [];
            let match;
            while ((match = puncRegex.exec(text)) !== null) {
                puncMarks.push(match[1]);
            }
            // Replace with a span slot we can target
            stripped = text.replace(puncRegex, '<span class="punc-slot inline-block w-8 h-8 mx-1 border-b-2 border-dashed border-slate-400"></span>');
            return { text: stripped, marks: puncMarks, original: text };
        };

        const enData = extractPunctuation(word.example_en || word.en);
        const srData = extractPunctuation(word.example_sr || word.sr_lat);

        return {
            type: 'drag_punctuation',
            q: `Add punctuation:`,
            q_rev: `Dodaj interpunkciju:`,
            sentence: enData.text,
            sentence_rev: srData.text,
            marks: enData.marks,
            marks_rev: srData.marks,
            correct: enData.original,
            correct_rev: srData.original,
            explanation: `💡 Correct: ${enData.original}`,
            explanation_rev: `💡 Tačno: ${srData.original}`
        };
    },

    // Generates a Hangman question object
    generateHangman(word) {
        const cleanSr = (word.sr_lat || '').replace(/[^a-zA-ZčćžšđČĆŽŠĐ\s]/g, '').replace(/\s+/g, ' ').trim();
        const cleanEn = (word.en || '').replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, ' ').trim();
        if (!cleanSr || !cleanEn) return null;

        return {
            type: 'hangman',
            q: `Spell: "${word.en}"`,
            q_rev: `Napiši: "${word.sr_lat}"`,
            correct: cleanSr,
            correct_rev: cleanEn,
            explanation: `💡 The correct spelling is "${word.sr_lat}".`,
            explanation_rev: `💡 The correct spelling is "${word.en}".`
        };
    },

    // Generates a Matching Pairs question object
    // Takes an array of words and selects up to 4 strictly unique pairs (no duplicate text)
    generateMatchingPairs(words) {
        if (!words || words.length < 2) return null;
        
        const seenEn = new Set();
        const seenSr = new Set();
        const pairWords = [];

        const shuffled = this.shuffle(words);
        for (const w of shuffled) {
            const wEn = (w.en || '').trim().toLowerCase();
            const wSr = (w.sr_lat || '').trim().toLowerCase();
            if (!wEn || !wSr || seenEn.has(wEn) || seenSr.has(wSr)) continue;
            seenEn.add(wEn);
            seenSr.add(wSr);
            pairWords.push(w);
            if (pairWords.length >= 4) break;
        }

        if (pairWords.length < 2) return null;
        
        const leftCol = this.shuffle(pairWords.map(w => ({ id: w.id, text: w.en, type: 'en', sr_lat: w.sr_lat })));
        const rightCol = this.shuffle(pairWords.map(w => ({ id: w.id, text: w.sr_lat, type: 'sr', en: w.en })));

        return {
            type: 'matching_pairs',
            q: `Match the pairs`,
            q_rev: `Spoj parove`,
            pairs: pairWords.length,
            leftCol,
            rightCol,
            explanation: `💡 Keep practicing to recognize these pairs faster!`,
            explanation_rev: `💡 Vežbaj da brže prepoznaješ parove!`
        };
    },

    // Generates a Dialogue / Story question
    // An AI character sends a message and the user picks the correct reply
    generateDialogue(word, allWords) {
        // Build a mini dialogue scenario based on the word
        const dialogues = {
            'basics': [
                { npc: 'Zdravo! Kako si?', npc_en: 'Hello! How are you?', reply: 'Dobro sam, hvala!', reply_en: 'I\'m fine, thank you!' },
                { npc: 'Dobar dan! Drago mi je.', npc_en: 'Good day! Nice to meet you.', reply: 'I meni je drago!', reply_en: 'Nice to meet you too!' },
                { npc: 'Kako se zoveš?', npc_en: 'What\'s your name?', reply: 'Zovem se Ana.', reply_en: 'My name is Ana.' },
            ],
            'food': [
                { npc: 'Šta želiš za doručak?', npc_en: 'What do you want for breakfast?', reply: 'Želim hleb i kafu.', reply_en: 'I want bread and coffee.' },
                { npc: 'Da li si gladan?', npc_en: 'Are you hungry?', reply: 'Da, veoma sam gladan!', reply_en: 'Yes, I\'m very hungry!' },
                { npc: 'Hoćeš li vode?', npc_en: 'Would you like water?', reply: 'Da, molim te.', reply_en: 'Yes, please.' },
            ],
            'family': [
                { npc: 'Imaš li braću?', npc_en: 'Do you have siblings?', reply: 'Da, imam jednog brata.', reply_en: 'Yes, I have one brother.' },
                { npc: 'Gde živi tvoja majka?', npc_en: 'Where does your mother live?', reply: 'Ona živi u Beogradu.', reply_en: 'She lives in Belgrade.' },
            ],
            'animals': [
                { npc: 'Imaš li kućnog ljubimca?', npc_en: 'Do you have a pet?', reply: 'Da, imam psa.', reply_en: 'Yes, I have a dog.' },
                { npc: 'Koja je tvoja omiljena životinja?', npc_en: 'What is your favorite animal?', reply: 'Volim mačke.', reply_en: 'I love cats.' },
            ],
            'colors': [
                { npc: 'Koja je tvoja omiljena boja?', npc_en: 'What is your favorite color?', reply: 'Volim plavu boju.', reply_en: 'I love the color blue.' },
            ],
        };

        // Try to get a dialogue from this word's category, else fall back to basics
        const category = word.category || 'basics';
        const pool = dialogues[category] || dialogues['basics'];
        const scene = pool[Math.floor(Math.random() * pool.length)];

        // Build wrong replies from other categories with distinct replies
        const allDialogues = Object.values(dialogues).flat();
        const seenReplies = new Set([scene.reply.toLowerCase()]);
        const wrongReplies = [];
        for (const d of this.shuffle(allDialogues)) {
            const rL = (d.reply || '').toLowerCase();
            if (seenReplies.has(rL)) continue;
            seenReplies.add(rL);
            wrongReplies.push(d);
            if (wrongReplies.length >= 2) break;
        }

        // EN->SR: NPC speaks English, user picks Serbian reply
        const options_enToSr = this.shuffle([scene.reply, ...wrongReplies.map(w => w.reply)]);
        // SR->EN: NPC speaks Serbian, user picks English reply
        const options_srToEn = this.shuffle([scene.reply_en, ...wrongReplies.map(w => w.reply_en)]);

        return {
            type: 'dialogue',
            npcMessage: scene.npc_en,
            npcMessage_rev: scene.npc,
            q: `Reply to the message:`,
            q_rev: `Odgovori na poruku:`,
            options: options_enToSr,
            options_rev: options_srToEn,
            correct: scene.reply,
            correct_rev: scene.reply_en,
        };
    },

    // Generates a set of questions for a category, mixing types based on mode:
    // mode = 'standard' (Default: 100% text-friendly, quiet-safe, zero surprise audio/mic requirements)
    // mode = 'listening' (Dedicated Ear Training Lab: 100% audio recognition & comprehension)
    // mode = 'speaking' (Dedicated Speaking Lab: 100% microphone pronunciation)
    async generateLesson(categoryName, dbInstance, count = 10, mode = 'standard') {
        const allWords = await dbInstance.getWordsByCategory(categoryName);
        if (!allWords || allWords.length < 4) {
            console.error(`Not enough words in category ${categoryName} to generate a full lesson.`);
            return [];
        }

        let selectedWords = this.shuffle(allWords).slice(0, count);
        
        // Sort by difficulty (progression: easy to hard)
        selectedWords.sort((a, b) => (a.difficulty || 1) - (b.difficulty || 1));
        
        // SPECIALIZED TRAINING MECHANICS
        if (categoryName === 'spelling') {
            return selectedWords.map((word, i) => {
                if (mode === 'speaking') {
                    return this.generateSpellingVoice(word);
                }
                return this.generateHangman(word); // Standard text spelling
            }).filter(q => q !== null).map(q => { q.wordId = q.wordId || selectedWords.find(w=>w.sr_lat === q.correct || w.en === q.correct_rev)?.id; return q; });
        }
        
        if (categoryName === 'punctuation') {
            return selectedWords.map(word => {
                let q = this.generateDragPunctuation(word);
                q.wordId = word.id;
                return q;
            });
        }
        
        if (categoryName === 'comparatives') {
            return selectedWords.map((word, i) => {
                let q;
                if (mode === 'speaking' && word.example_en && word.example_sr) {
                    q = this.generateSpeakingSentence(word);
                } else if (i % 2 === 0 && word.example_en && word.example_sr) {
                    q = this.generateFillBlank(word);
                } else if (word.example_en && word.example_sr) {
                    q = this.generateWordOrder(word);
                }
                
                // Fallbacks if example sentences are missing
                if (!q) {
                    q = (mode === 'speaking') ? this.generateSpeaking(word) : (this.generateWordOrder(word) || this.generateMultipleChoice(word, allWords));
                }
                if (q) q.wordId = word.id;
                return q;
            });
        }

        // Matching pairs only in standard or listening modes
        const injectMatching = (mode !== 'speaking') && (Math.random() < 0.4);
        // Dialogue only in standard or listening modes
        const injectDialogue = (mode !== 'speaking') && (Math.random() < 0.35);
        let matchingIncluded = false;
        
        const lessonQuestions = selectedWords.map((word, index) => {
            if (injectMatching && !matchingIncluded && index >= selectedWords.length - 4) {
                return null;
            }

            const rand = Math.random();
            let q = null;
            
            if (mode === 'speaking') {
                // Dedicated Speaking Lab
                if (word.example_en && word.example_sr && rand < 0.45) {
                    q = this.generateSpeakingSentence(word);
                } else {
                    q = this.generateSpeaking(word);
                }
            } else if (mode === 'listening') {
                // Dedicated Ear Training Lab
                q = this.generateListening(word, allWords);
            } else {
                // Standard Option B: Rich variety with Sentence, Hangman, Speaking, Listening, Picture, and MCQ
                // Paired with 1-tap "Can't speak now" / "Can't listen now" safety bypass buttons
                if (word.example_en && word.example_sr) {
                    if (rand < 0.20) q = this.generateFillBlank(word);
                    else if (rand < 0.40) q = this.generateWordOrder(word);
                }
                
                if (!q) {
                    if (rand > 0.88) q = this.generateHangman(word);
                    else if (rand > 0.74) q = this.generateSpeaking(word);
                    else if (rand > 0.60 && word.emoji) q = this.generatePictureChoice(word, allWords);
                    else if (rand > 0.46) q = this.generateListening(word, allWords);
                    else q = this.generateMultipleChoice(word, allWords);
                }
            }
            
            if (q) q.wordId = word.id;
            return q;
        }).filter(q => q !== null);
        
        // Inject matching pairs
        if (injectMatching) {
            const matchingQ = this.generateMatchingPairs(this.shuffle(allWords));
            if (matchingQ) {
                const insertIndex = Math.floor(Math.random() * lessonQuestions.length);
                lessonQuestions.splice(insertIndex, 0, matchingQ);
            }
        }

        // Inject dialogue
        if (injectDialogue) {
            const dialogueQ = this.generateDialogue(selectedWords[0], allWords);
            if (dialogueQ) {
                dialogueQ.wordId = selectedWords[0].id;
                const insertIndex = Math.floor(Math.random() * lessonQuestions.length);
                lessonQuestions.splice(insertIndex, 0, dialogueQ);
            }
        }
        
        // Trim to exactly 'count' questions if extras were added
        return lessonQuestions.slice(0, count);
    },

    // Dedicated Ear Training Lab Generator
    async generateListeningLesson(categoryName, dbInstance, count = 10) {
        return this.generateLesson(categoryName, dbInstance, count, 'listening');
    },

    // Dedicated Pronunciation / Speaking Lab Generator
    async generateSpeakingLesson(categoryName, dbInstance, count = 10) {
        return this.generateLesson(categoryName, dbInstance, count, 'speaking');
    },

    // Generates a dedicated batch of questions from a provided list of words and distractor pool
    generateQuestionsFromWords(words, mode = 'listening', pool = []) {
        if (!words || !words.length) return [];
        const fullPool = (pool && pool.length >= 4) ? pool : words;
        return words.map(word => {
            let q = null;
            if (mode === 'speaking') {
                if (word.example_en && word.example_sr && Math.random() < 0.45) {
                    q = this.generateSpeakingSentence(word);
                } else {
                    q = this.generateSpeaking(word);
                }
            } else {
                // Listening mode
                q = this.generateListening(word, fullPool);
            }
            if (q) q.wordId = word.id;
            return q;
        }).filter(q => q !== null);
    },

    // Phase 4: Smart Practice (Spaced Repetition)
    async generatePracticeLesson(categories, dbInstance, mistakeLog, count = 10) {
        let allWords = [];
        for (const cat of categories) {
            const catWords = await dbInstance.getWordsByCategory(cat);
            if (catWords) allWords = allWords.concat(catWords);
        }

        if (allWords.length === 0) return [];

        // Sort words by mistake count (descending)
        allWords.sort((a, b) => {
            const aMistakes = mistakeLog[a.id] || 0;
            const bMistakes = mistakeLog[b.id] || 0;
            return bMistakes - aMistakes;
        });

        // Take top 6 mistakes (if any) and 4 random words to fill out 10
        const topMistakes = allWords.slice(0, Math.min(6, allWords.length));
        const remaining = this.shuffle(allWords.slice(topMistakes.length));
        
        let selectedWords = topMistakes.concat(remaining).slice(0, count);
        selectedWords = this.shuffle(selectedWords);

        const lessonQuestions = selectedWords.map((word) => {
            const rand = Math.random();
            let q = null;
            
            if (word.example_en && word.example_sr) {
                if (rand < 0.15) q = this.generateFillBlank(word);
                else if (rand < 0.30) q = this.generateWordOrder(word);
            }
            
            if (!q) {
                if (rand > 0.90) q = this.generateHangman(word);
                else if (rand > 0.78) q = this.generateSpeaking(word);
                else if (rand > 0.65 && word.emoji) q = this.generatePictureChoice(word, allWords);
                else if (rand > 0.50) q = this.generateListening(word, allWords);
                else q = this.generateMultipleChoice(word, allWords);
            }
            
            if (q) q.wordId = word.id;
            return q;
        }).filter(q => q !== null);
        
        return lessonQuestions.slice(0, count);
    },

    async generateMistakeReviewLesson(dbInstance, mistakeLog, count = 10) {
        const allWords = await dbInstance.getAllWords();
        if (!allWords || allWords.length === 0) return [];
        
        const srsData = (typeof state !== 'undefined' && state.srsData) ? state.srsData : {};
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Gather all candidate IDs from mistakeLog or srsData
        const candidateSet = new Set();
        Object.keys(mistakeLog || {}).forEach(id => candidateSet.add(id));
        Object.keys(srsData).forEach(id => {
            const r = srsData[id];
            if (r.nextReview && r.nextReview <= todayStr) candidateSet.add(id);
        });

        let mistakeIds = Array.from(candidateSet);
        if (mistakeIds.length === 0) return [];
        
        // Priority 6: Sort IDs by True SuperMemo-2 Spaced Repetition Urgency:
        // 1. Overdue or due today first
        // 2. Lowest repetition count (0 reps = unlearned/failed)
        // 3. Lowest easeFactor / highest error weight
        mistakeIds.sort((a, b) => {
            const rA = srsData[a] || { repetitions: 0, nextReview: todayStr, easeFactor: 2.5 };
            const rB = srsData[b] || { repetitions: 0, nextReview: todayStr, easeFactor: 2.5 };
            const isDueA = (rA.nextReview || '') <= todayStr ? 1 : 0;
            const isDueB = (rB.nextReview || '') <= todayStr ? 1 : 0;
            if (isDueA !== isDueB) return isDueB - isDueA;
            if (rA.repetitions !== rB.repetitions) return rA.repetitions - rB.repetitions;
            const wA = (mistakeLog && mistakeLog[a]) || 0;
            const wB = (mistakeLog && mistakeLog[b]) || 0;
            return wB - wA;
        });

        const selectedIds = mistakeIds.slice(0, count);
        
        let selectedWords = allWords.filter(w => selectedIds.includes(w.id));
        selectedWords = this.shuffle(selectedWords);

        const lessonQuestions = selectedWords.map((word) => {
            const rand = Math.random();
            let q = null;
            
            if (word.example_en && word.example_sr) {
                if (rand < 0.15) q = this.generateFillBlank(word);
                else if (rand < 0.30) q = this.generateWordOrder(word);
            }
            
            if (!q) {
                if (rand > 0.90) q = this.generateHangman(word);
                else if (rand > 0.78) q = this.generateSpeaking(word);
                else if (rand > 0.65 && word.emoji) q = this.generatePictureChoice(word, allWords);
                else if (rand > 0.50) q = this.generateListening(word, allWords);
                else q = this.generateMultipleChoice(word, allWords);
            }
            
            if (q) q.wordId = word.id;
            return q;
        }).filter(q => q !== null);
        
        return lessonQuestions.slice(0, count);
    },

    // Priority 6: Dedicated Alphabet Lesson Generator
    generateAlphabetLesson: async function (mode, count = 10) {
        // mode: 'alphabet_lat_print', 'alphabet_lat_cur', 'alphabet_cyr_print', 'alphabet_cyr_cur'
        const isCyrillic = mode.includes('cyr');
        const isCursive = mode.includes('cur');
        
        const dataSet = isCyrillic ? window.ALPHABET_DATA.cyrillic : window.ALPHABET_DATA.latin;
        
        // Shuffle and pick letters for the lesson
        let shuffledSet = [...dataSet].sort(() => 0.5 - Math.random());
        let lessonLetters = shuffledSet.slice(0, count);
        
        let questions = [];
        
        lessonLetters.forEach(letter => {
            const r = Math.random();
            let type = '';
            if (r < 0.25) {
                type = 'alphabet_picture';
            } else if (r < 0.45) {
                type = 'alphabet_voice';
            } else if (r < 0.65) {
                type = 'alphabet_listen';
            } else if (r < 0.8) {
                type = 'whiteboard';
            } else {
                type = 'alphabet_match';
            }
            
            // Generate distractor options
            let options = [];
            while(options.length < 3) {
                let distractor = dataSet[Math.floor(Math.random() * dataSet.length)];
                if (distractor.upper !== letter.upper && !options.find(o => o.upper === distractor.upper)) {
                    options.push(distractor);
                }
            }
            options.push(letter);
            options.sort(() => 0.5 - Math.random());
            
            let q = {
                type: type,
                targetLetter: letter,
                options: options,
                isCyrillic: isCyrillic,
                isCursive: isCursive,
                // Pass standard word object fields for compatibility with existing render functions where possible
                word: {
                    sr: letter.upper + letter.lower, 
                    en: letter.word + ' ' + letter.emoji,
                    category: 'alphabet'
                }
            };
            
            if (type === 'alphabet_match') {
                // Generate 4 pairs for a matching question
                let used = [letter];
                while(used.length < 4) {
                    let d = dataSet[Math.floor(Math.random() * dataSet.length)];
                    if (!used.find(u => u.upper === d.upper)) {
                        used.push(d);
                    }
                }
                q.pairsData = used;
            }
            
            if (type === 'whiteboard') {
                // Randomly decide: draw the letter OR draw the whole word
                const drawWord = Math.random() < 0.4;
                
                if (drawWord) {
                    // Draw the full word (e.g., "Delfin")
                    q.target = letter.word;
                    q.target_rev = letter.en || letter.word;
                    q.q = letter.emoji;
                    q.q_rev = letter.emoji;
                    q.q_sub = isCyrillic ? 'Napišite reč' : 'Napišite reč';
                    q.q_sub_rev = 'Write the word';
                    q.audioWord = letter.word;
                    q.audioLang = 'sr-RS';
                } else {
                    // Draw the single letter (e.g., "D")
                    q.target = letter.upper;
                    q.target_rev = letter.upper;
                    q.q = letter.emoji;
                    q.q_rev = letter.emoji;
                    q.q_sub = isCyrillic ? 'Napišite slovo' : 'Napišite slovo';
                    q.q_sub_rev = 'Write the letter';
                    q.audioWord = letter.word;
                    q.audioLang = 'sr-RS';
                }
            }
            
            questions.push(q);
        });
        
        return questions;
    }
};

window.QuestionEngine = QuestionEngine;
