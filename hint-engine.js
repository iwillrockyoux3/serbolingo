// [SHIELD_DAEMON: VALIDATED]
/**
 * SerboLingo — Tactical Diamond Hint Engine (Priority 52)
 *
 * Non-punitive in-lesson retrieval assistance powered by consumable Diamonds (5 💎):
 *  - Atomic gem spend via LeagueEngine (zero XP, streak, or heart penalty)
 *  - Double-tap debounce + single-use lock per active question
 *  - 50/50 option elimination (always preserves 1 correct + >=1 distractor)
 *  - Unicode-safe first-letter scaffolding (Latin diacritics + Cyrillic) for typing, cloze, speaking, word order & hangman
 */
(function () {
    'use strict';

    const HintEngine = {
        HINT_COST: 5,
        DEBOUNCE_MS: 350,

        activeQuestion: null,
        hintUsed: false,
        _lockedUntil: 0,

        _escapeHtml: function (str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        },

        _isSrToEn: function () {
            const st = window.appState || window.state;
            return !!(st && st.settings && st.settings.learningDirection === 'sr_to_en');
        },

        getUserGems: function () {
            if (window.LeagueEngine && typeof window.LeagueEngine.getUserGems === 'function') {
                return window.LeagueEngine.getUserGems();
            }
            const st = window.appState || window.state;
            if (st && typeof st.gems === 'number') return st.gems;
            return 50;
        },

        spendGems: function (amount, reason) {
            if (window.LeagueEngine && typeof window.LeagueEngine.spendGems === 'function') {
                const ok = window.LeagueEngine.spendGems(amount, reason);
                this.updateBalanceUI();
                return ok;
            }
            const st = window.appState || window.state;
            if (!st) return false;
            if (typeof st.gems !== 'number') st.gems = 50;
            if (st.gems < amount) return false;
            st.gems -= amount;
            if (window.app && typeof window.app.saveStats === 'function') {
                window.app.saveStats();
            }
            const el = document.getElementById('gems-display');
            if (el) el.textContent = st.gems.toLocaleString();
            this.updateBalanceUI();
            return true;
        },

        updateBalanceUI: function () {
            const gems = this.getUserGems();
            const balEl = document.getElementById('hint-gems-balance');
            if (balEl) balEl.textContent = `(${gems})`;

            const clozeBalEl = document.getElementById('cloze-hint-gems');
            if (clozeBalEl) clozeBalEl.textContent = `(${gems})`;

            const btn = document.getElementById('hint-btn');
            if (btn && !this.hintUsed) {
                if (gems < this.HINT_COST) {
                    btn.classList.add('opacity-70');
                } else {
                    btn.classList.remove('opacity-70');
                }
            }
        },

        supportsHint: function (q) {
            if (!q || !q.type) return false;
            const st = window.appState || window.state;
            // Priority 54: Pop Quizzes and Friday Cumulative Exams test without hints
            if (st && (st.lessonMode === 'classroom_quiz' || st.lessonMode === 'classroom_exam')) {
                return false;
            }
            const supported = new Set([
                'multiple_choice',
                'picture_choice',
                'listening',
                'dialogue',
                'fill_blank',
                'word_order',
                'hangman',
                'speaking',
                'spelling_voice',
                'alphabet_picture',
                'alphabet_listen'
            ]);
            return supported.has(q.type);
        },

        /**
         * Generates Unicode-safe first-letter scaffold (e.g. "Prijatelj" -> "P _ _ _ _ _ _ _ _").
         * Preserves Serbian diacritics (č, ć, ž, š, đ), Cyrillic graphemes, spaces, and punctuation.
         */
        formatFirstLetterScaffold: function (text) {
            if (!text || typeof text !== 'string') return '';
            const clean = text.trim();
            if (!clean) return '';

            return clean.split(/\s+/).map((token) => {
                const chars = Array.from(token);
                if (!chars.length) return '';

                let revealedLetter = false;
                let out = '';
                chars.forEach((ch, idx) => {
                    const isWordChar = /[a-zA-ZčćžšđČĆŽŠĐ\u0400-\u04FF0-9]/.test(ch);
                    if (!isWordChar) {
                        out += ch;
                        return;
                    }
                    const nextChar = !revealedLetter ? (revealedLetter = true, ch) : '_';
                    out += (out && /[a-zA-ZčćžšđČĆŽŠĐ\u0400-\u04FF0-9_]/.test(out[out.length - 1])) ? (' ' + nextChar) : nextChar;
                });
                return out;
            }).join('   ');
        },

        _showLessonHintBanner: function (htmlText) {
            const area = document.getElementById('lesson-content-area');
            if (!area) return;
            let banner = document.getElementById('lesson-hint-banner');
            if (!banner) {
                banner = document.createElement('div');
                banner.id = 'lesson-hint-banner';
                banner.className = 'w-full max-w-xs mx-auto mt-4 px-3.5 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-200 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.22)] animate-pulse break-words text-center';
                area.appendChild(banner);
            }
            banner.innerHTML = htmlText;
        },

        resetQuestionHint: function (questionObj) {
            this.activeQuestion = questionObj || null;
            this.hintUsed = false;
            this._lockedUntil = 0;

            const oldBanner = document.getElementById('lesson-hint-banner');
            if (oldBanner && oldBanner.parentNode) {
                oldBanner.parentNode.removeChild(oldBanner);
            }

            const btn = document.getElementById('hint-btn');
            if (!btn) return;

            const isSr = this._isSrToEn();
            const labelEl = document.getElementById('hint-btn-label');
            if (labelEl) labelEl.textContent = isSr ? 'Pomoć' : 'Hint';

            if (!questionObj || !this.supportsHint(questionObj)) {
                btn.classList.add('hidden');
                return;
            }

            btn.classList.remove('hidden', 'opacity-50', 'cursor-not-allowed', 'bg-slate-100', 'dark:bg-slate-800', 'text-slate-400', 'border-slate-200', 'dark:border-slate-700');
            btn.classList.add('bg-amber-50', 'hover:bg-amber-100', 'dark:bg-amber-950/60', 'dark:hover:bg-amber-900/70', 'text-amber-700', 'dark:text-amber-300', 'border-amber-300/80', 'dark:border-amber-700/70', 'shadow-[0_0_12px_rgba(245,158,11,0.25)]', 'cursor-pointer');
            btn.disabled = false;
            this.updateBalanceUI();
        },

        onQuestionAnswered: function () {
            const btn = document.getElementById('hint-btn');
            if (btn) btn.classList.add('hidden');
        },

        _markHintBtnUsed: function () {
            const btn = document.getElementById('hint-btn');
            if (!btn) return;
            const isSr = this._isSrToEn();
            const labelEl = document.getElementById('hint-btn-label');
            if (labelEl) labelEl.textContent = isSr ? 'Iskorišćeno' : 'Used';
            btn.disabled = true;
            btn.classList.remove('hover:bg-amber-100', 'dark:hover:bg-amber-900/70', 'shadow-[0_0_12px_rgba(245,158,11,0.25)]', 'cursor-pointer');
            btn.classList.add('opacity-50', 'cursor-not-allowed', 'bg-slate-100', 'dark:bg-slate-800', 'text-slate-400', 'border-slate-200', 'dark:border-slate-700');
        },

        _resetSelectedOptionIfEliminated: function () {
            const st = window.appState || window.state;
            if (st) st.userSelection = null;
            const checkBtn = document.getElementById('check-btn');
            if (checkBtn) {
                checkBtn.disabled = true;
                checkBtn.classList.remove('bg-blue-500', 'text-white');
                checkBtn.classList.add('bg-slate-200', 'text-slate-400', 'dark:bg-slate-800', 'dark:text-slate-600');
            }
        },

        /**
         * Eliminates up to `maxRemove` incorrect option buttons, always preserving at least
         * 1 correct answer + 1 plausible distractor (true 50/50 safeguard).
         */
        _applyFiftyFifty: function (l, isSrToEn) {
            const buttons = Array.from(document.querySelectorAll('#lesson-content-area .option-btn'))
                .filter(b => !b.disabled);
            if (buttons.length < 3) return false;

            let wrongBtns = [];
            if (l.type === 'alphabet_picture' || l.type === 'alphabet_listen') {
                const targetUpper = l.targetLetter && l.targetLetter.upper;
                wrongBtns = buttons.filter(b => (b.getAttribute('data-option') || '') !== targetUpper);
            } else if (window.app && typeof window.app.getAcceptedAnswers === 'function' && typeof window.app.evaluateAcceptedAnswer === 'function') {
                const acceptedList = window.app.getAcceptedAnswers(l, isSrToEn);
                wrongBtns = buttons.filter((b) => {
                    const text = b.getAttribute('data-option') || b.innerText.replace(/^💬\s*/, '').trim();
                    return !window.app.evaluateAcceptedAnswer(text, acceptedList, false).isCorrect;
                });
            } else {
                const target = ((isSrToEn && l.correct_rev) ? l.correct_rev : l.correct || '').trim().toLowerCase();
                wrongBtns = buttons.filter((b) => {
                    const text = (b.getAttribute('data-option') || b.innerText.replace(/^💬\s*/, '').trim()).toLowerCase();
                    return text !== target;
                });
            }

            if (wrongBtns.length < 2) return false;

            // Shuffle wrong options and remove up to 2 while keeping at least 1 wrong distractor
            for (let i = wrongBtns.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [wrongBtns[i], wrongBtns[j]] = [wrongBtns[j], wrongBtns[i]];
            }
            const removeCount = Math.min(2, wrongBtns.length - 1);
            const toRemove = wrongBtns.slice(0, removeCount);

            let clearedSelection = false;
            toRemove.forEach((btn) => {
                if (btn.classList.contains('selected')) {
                    btn.classList.remove('selected', 'bg-blue-50', 'border-blue-400', 'dark:bg-blue-900', 'dark:border-blue-500');
                    clearedSelection = true;
                }
                btn.disabled = true;
                btn.classList.add('opacity-35', 'line-through', 'cursor-not-allowed', 'grayscale', 'pointer-events-none');
            });

            if (clearedSelection) {
                this._resetSelectedOptionIfEliminated();
            }

            const msg = isSrToEn
                ? `💡 <b>50/50 Pomoć (-${this.HINT_COST} 💎):</b> Uklonjeno ${removeCount} netačn${removeCount === 1 ? 'a opcija' : 'e opcije'}!`
                : `💡 <b>50/50 Hint (-${this.HINT_COST} 💎):</b> Eliminated ${removeCount} wrong choice${removeCount === 1 ? '' : 's'}!`;
            this._showLessonHintBanner(msg);
            return true;
        },

        _applyTypingScaffold: function (l, isSrToEn) {
            const target = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
            const scaffold = this.formatFirstLetterScaffold(target);
            if (!scaffold) return false;

            const safeScaffold = this._escapeHtml(scaffold);
            const input = document.getElementById('fill-blank-input');
            if (input) {
                input.placeholder = `💡 ${scaffold}`;
                input.focus();
            }

            const label = isSrToEn ? 'Počinje na:' : 'Starts with:';
            this._showLessonHintBanner(`💡 ${label} <span class="font-mono tracking-wider font-black text-amber-900 dark:text-amber-100">${safeScaffold}</span>`);
            return true;
        },

        _applyWordOrderHint: function (l, isSrToEn) {
            const st = window.appState || window.state;
            const rawTarget = (isSrToEn && l.correct_rev) ? l.correct_rev : l.correct;
            const words = String(rawTarget || '').replace(/[.,!?]/g, '').trim().split(/\s+/).filter(Boolean);
            if (!words.length) return false;

            const placed = Array.isArray(st && st.userSelection) ? st.userSelection : [];
            let revealIdx = 0;
            while (revealIdx < placed.length && revealIdx < words.length) {
                if (placed[revealIdx].toLowerCase() !== words[revealIdx].toLowerCase()) break;
                revealIdx++;
            }
            if (revealIdx >= words.length) revealIdx = 0;
            const hintWord = words[revealIdx];

            const bankButtons = Array.from(document.querySelectorAll('#word-order-bank button'));
            const matchBtn = bankButtons.find(b => b.textContent.trim().toLowerCase() === hintWord.toLowerCase());
            if (matchBtn) {
                matchBtn.classList.add('ring-2', 'ring-amber-400', 'border-amber-400', 'bg-amber-50', 'dark:bg-amber-900/40');
            }

            const safeWord = this._escapeHtml(hintWord);
            const label = isSrToEn ? `Reč #${revealIdx + 1}:` : `Word #${revealIdx + 1}:`;
            this._showLessonHintBanner(`💡 ${label} <span class="font-black text-amber-900 dark:text-amber-100">"${safeWord}"</span>`);
            return true;
        },

        _applyHangmanHint: function () {
            const st = window.appState || window.state;
            if (!st || !st.hangmanState || !st.hangmanState.target) return false;

            const remaining = [...new Set(
                Array.from(st.hangmanState.target).filter(ch => ch !== ' ' && /[A-ZČĆŽŠĐ]/.test(ch) && !st.hangmanState.guesses.includes(ch))
            )];
            if (!remaining.length) return false;

            const pick = remaining[0];
            const keyButtons = Array.from(document.querySelectorAll('#hangman-keyboard button'));
            const keyBtn = keyButtons.find(b => !b.disabled && b.textContent.trim().toUpperCase() === pick);
            if (!keyBtn || !window.app || typeof window.app.guessHangmanLetter !== 'function') return false;

            window.app.guessHangmanLetter(keyBtn, pick);
            this._showLessonHintBanner(`💡 ${this._isSrToEn() ? 'Otkriveno slovo:' : 'Revealed letter:'} <span class="font-black text-amber-900 dark:text-amber-100">"${this._escapeHtml(pick)}"</span>`);
            return true;
        },

        useHint: function () {
            const now = Date.now();
            if (now < this._lockedUntil || this.hintUsed) return false;
            this._lockedUntil = now + this.DEBOUNCE_MS;

            const l = this.activeQuestion || (window.app && typeof window.app.getActiveQuestion === 'function' ? window.app.getActiveQuestion() : null);
            if (!l || !this.supportsHint(l)) return false;

            const isSr = this._isSrToEn();
            const gems = this.getUserGems();
            if (gems < this.HINT_COST) {
                if (window.TouchHaptics) window.TouchHaptics.vibrate('tap');
                if (window.app && window.app.showToast) {
                    window.app.showToast(
                        isSr ? `Nedovoljno dijamanata! Treba ti ${this.HINT_COST} 💎 (Imaš ${gems})` : `Not enough diamonds! Need ${this.HINT_COST} 💎 (Have ${gems})`,
                        'warning'
                    );
                }
                return false;
            }

            // Prepare & execute mode-specific action ONLY if applicable before spending gems?
            // Check preconditions for option elimination / hangman so user is never charged on a no-op
            if (l.type === 'hangman') {
                const st = window.appState || window.state;
                const rem = st && st.hangmanState ? Array.from(st.hangmanState.target).filter(ch => ch !== ' ' && /[A-ZČĆŽŠĐ]/.test(ch) && !st.hangmanState.guesses.includes(ch)) : [];
                if (!rem.length) return false;
            } else if (l.type === 'multiple_choice' || l.type === 'picture_choice' || l.type === 'listening' || l.type === 'dialogue' || l.type === 'alphabet_picture' || l.type === 'alphabet_listen') {
                const btns = document.querySelectorAll('#lesson-content-area .option-btn:not([disabled])');
                if (btns.length < 3) return false;
            }

            if (!this.spendGems(this.HINT_COST, isSr ? 'Pomoć u lekciji' : 'Lesson Hint')) {
                return false;
            }

            this.hintUsed = true;
            this._markHintBtnUsed();
            if (window.TouchHaptics) window.TouchHaptics.vibrate('tap');

            if (l.type === 'fill_blank' || l.type === 'speaking' || l.type === 'spelling_voice') {
                this._applyTypingScaffold(l, isSr);
            } else if (l.type === 'word_order') {
                this._applyWordOrderHint(l, isSr);
            } else if (l.type === 'hangman') {
                this._applyHangmanHint();
            } else {
                this._applyFiftyFifty(l, isSr);
            }

            return true;
        },

        // Priority 52 integration for Cloze Mastery ("Popuni Prazninu")
        useClozeHint: function () {
            const now = Date.now();
            if (now < this._lockedUntil) return false;
            this._lockedUntil = now + this.DEBOUNCE_MS;

            const ce = window.ClozeEngine;
            const sess = ce && ce.currentSession;
            if (!sess || !sess.sentences || !sess.sentences[sess.idx]) return false;
            if (sess._hintUsedIdx === sess.idx) return false;

            const s = sess.sentences[sess.idx];
            const isSr = !!s.isSr;
            const isCyr = ce.currentScript === 'cyrillic';
            const targetAnswer = (isSr && isCyr && typeof ce.toCyrillic === 'function')
                ? ce.toCyrillic(s.answer)
                : s.answer;

            const scaffold = this.formatFirstLetterScaffold(targetAnswer);
            if (!scaffold) return false;

            const gems = this.getUserGems();
            if (gems < this.HINT_COST) {
                if (window.TouchHaptics) window.TouchHaptics.vibrate('tap');
                if (window.app && window.app.showToast) {
                    window.app.showToast(`Nedovoljno dijamanata! Treba ti ${this.HINT_COST} 💎 (Imaš ${gems})`, 'warning');
                }
                return false;
            }

            if (!this.spendGems(this.HINT_COST, 'Pomoć (Popuni Prazninu)')) {
                return false;
            }

            sess._hintUsedIdx = sess.idx;
            if (window.TouchHaptics) window.TouchHaptics.vibrate('tap');
            this.updateBalanceUI();

            const btn = document.getElementById('cloze-hint-btn');
            if (btn) {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            }

            const input = document.getElementById('cloze-input');
            if (input) {
                input.placeholder = `💡 ${scaffold}`;
                input.focus();
            }

            const feedback = document.getElementById('cloze-feedback');
            if (feedback) {
                feedback.className = 'min-h-[28px] text-sm font-bold text-amber-300 transition-all';
                feedback.innerHTML = `💡 Pomoć (-${this.HINT_COST} 💎): <span class="font-mono tracking-widest text-amber-200 font-black">${this._escapeHtml(scaffold)}</span>`;
            }

            return true;
        }
    };

    window.HintEngine = HintEngine;
})();
