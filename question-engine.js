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

    // Get N random elements from array excluding target
    getRandomDistractors(array, targetId, count) {
        const filtered = array.filter(w => w.id !== targetId);
        const shuffled = this.shuffle(filtered);
        return shuffled.slice(0, count);
    },

    // Generates a single Multiple Choice question object that matches the legacy CURRICULUM format
    generateMultipleChoice(word, allWordsInCategory) {
        const distractors = this.getRandomDistractors(allWordsInCategory, word.id, 2);
        
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

    // Generates a Picture Choice question (Emoji Choice)
    generatePictureChoice(word, allWords) {
        // Needs 3 distractors with emojis
        let pool = allWords.filter(w => w.id !== word.id && w.emoji);
        let distractors = this.shuffle(pool).slice(0, 3);
        
        // If we don't have enough distractors with emojis, just fallback to standard multiple choice structure
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
        let pool = allWords.filter(w => w.id !== word.id);
        let distractors = this.shuffle(pool).slice(0, 3);
        
        // For listening, the question IS the audio. We'll store what to speak.
        // We'll also provide options to choose from.
        let options_enToSr = this.shuffle([word.sr_lat, ...distractors.map(d => d.sr_lat)]);
        let options_srToEn = this.shuffle([word.en, ...distractors.map(d => d.en)]);

        return {
            type: 'listening',
            q_audio: word.en, // App will speak this if learning EN->SR
            q_audio_rev: word.sr_lat, // App will speak this if learning SR->EN
            
            // Audio targets for Voice Synthesis
            audioLang: 'en-US',
            audioLang_rev: 'sr-RS',

            options: options_enToSr,
            options_rev: options_srToEn,
            correct: word.sr_lat,
            correct_rev: word.en,
        };
    },

    // Generates a Fill-in-the-blank question object
    generateFillBlank(word) {
        // We need example sentences to do this properly
        if (!word.example_en || !word.example_sr) {
            return null; // Fallback to multiple choice if no sentence exists
        }

        // EN to SR: Show English sentence, show Serbian sentence with target word blanked out
        // E.g., "I have one car" -> "Imam ____ auto", user types "jedan"
        let q_enToSr = `Translate: "${word.example_en}"\n\n${word.example_sr.replace(new RegExp(`\\b${word.sr_lat}\\b`, 'i'), '____')}`;
        let correct_enToSr = word.sr_lat;

        // SR to EN: Show Serbian sentence, show English sentence with target word blanked out
        let q_srToEn = `Prevedi: "${word.example_sr}"\n\n${word.example_en.replace(new RegExp(`\\b${word.en}\\b`, 'i'), '____')}`;
        let correct_srToEn = word.en;

        return {
            type: 'fill_blank',
            q: q_enToSr,
            q_rev: q_srToEn,
            correct: correct_enToSr,
            correct_rev: correct_srToEn,
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

    // Generates a Hangman question object
    generateHangman(word) {
        return {
            type: 'hangman',
            q: `Spell: "${word.en}"`,
            q_rev: `Napiši: "${word.sr_lat}"`,
            correct: word.sr_lat,
            correct_rev: word.en,
            explanation: `💡 The correct spelling is "${word.sr_lat}".`,
            explanation_rev: `💡 The correct spelling is "${word.en}".`
        };
    },

    // Generates a Matching Pairs question object
    // Takes an array of up to 4 words
    generateMatchingPairs(words) {
        if (!words || words.length < 2) return null;
        
        // Take up to 4 words
        const pairWords = words.slice(0, 4);
        
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

        // Build wrong replies from other categories
        const allDialogues = Object.values(dialogues).flat();
        const wrongReplies = this.shuffle(allDialogues.filter(d => d.reply !== scene.reply)).slice(0, 2);

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

    // Generates a set of questions for a category, mixing all types
    async generateLesson(categoryName, dbInstance, count = 10) {
        const allWords = await dbInstance.getWordsByCategory(categoryName);
        if (!allWords || allWords.length < 4) {
            console.error(`Not enough words in category ${categoryName} to generate a full lesson.`);
            return [];
        }

        const selectedWords = this.shuffle(allWords).slice(0, count);
        
        // Sometimes inject a matching pairs question (takes 4 words)
        const injectMatching = Math.random() < 0.4;
        // Sometimes inject a dialogue question
        const injectDialogue = Math.random() < 0.35;
        let matchingIncluded = false;
        
        const lessonQuestions = selectedWords.map((word, index) => {
            if (injectMatching && !matchingIncluded && index >= selectedWords.length - 4) {
                // Ignore the individual word mapping if we are in the last 4 and want matching
                return null;
            }

            const rand = Math.random();
            let q = null;
            
            // If the word has examples, randomly choose sentence game type
            if (word.example_en && word.example_sr) {
                if (rand < 0.15) q = this.generateFillBlank(word);
                else if (rand < 0.30) q = this.generateWordOrder(word);
            }
            
            if (!q) {
                // Distribute across all game types
                if (rand > 0.90) q = this.generateHangman(word);
                else if (rand > 0.78) q = this.generateSpeaking(word);
                else if (rand > 0.65 && word.emoji) q = this.generatePictureChoice(word, allWords);
                else if (rand > 0.50) q = this.generateListening(word, allWords);
                else q = this.generateMultipleChoice(word, allWords);
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
    }
};

window.QuestionEngine = QuestionEngine;
