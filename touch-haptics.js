// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo — Native Touch Gestures & Haptic Vibrations (Priority 25 & Priority 35)
// Features:
// 1. Noticeable, punchy haptic vibrations (tap, correct, wrong, celebrate, swipe, shop) with user toggle.
// 2. High-performance modal pull-down dismiss with spring physics and backdrop dismissal.
// 3. Smooth rightward swipe-to-go-back to Home from any secondary view.
// 4. Mobile browser gesture shield (prevents native pull-to-refresh conflicts).

(function () {
    'use strict';

    const TouchHaptics = {
        // --- 1. HAPTIC VIBRATION CONTROLLER ---
        isSupported: typeof navigator !== 'undefined' && 'vibrate' in navigator,

        isEnabled: function () {
            if (!this.isSupported) return false;
            if (typeof state !== 'undefined' && state.settings) {
                return state.settings.hapticsEnabled !== false;
            }
            const stored = localStorage.getItem('serbolingo_haptics');
            return stored === null || stored === 'true';
        },

        vibrate: function (type) {
            if (!this.isEnabled()) return;
            try {
                switch (type) {
                    case 'tap':
                        // Noticeable, tactile click on interactive elements (40ms)
                        navigator.vibrate(40);
                        break;
                    case 'correct':
                        // Rewarding, distinct double pulse for correct answers
                        navigator.vibrate([70, 40, 120]);
                        break;
                    case 'wrong':
                        // Strong, unmistakable double warning buzz
                        navigator.vibrate([120, 60, 180]);
                        break;
                    case 'swipe':
                        // Snappy confirmation on gesture
                        navigator.vibrate(50);
                        break;
                    case 'celebrate':
                        // Rich fanfare rhythmic buzz for milestones & completions
                        navigator.vibrate([80, 40, 80, 40, 180]);
                        break;
                    case 'shop':
                        // Satisfying cash register reward vibration
                        navigator.vibrate([60, 40, 100]);
                        break;
                    default:
                        if (typeof type === 'number' || Array.isArray(type)) {
                            navigator.vibrate(type);
                        } else {
                            navigator.vibrate(40);
                        }
                }
            } catch (e) {
                // Ignore silent browser vibration rejection
            }
        },

        toggleHaptics: function () {
            const current = this.isEnabled();
            const next = !current;
            if (typeof state !== 'undefined' && state.settings) {
                state.settings.hapticsEnabled = next;
                if (typeof app !== 'undefined' && app.saveStats) app.saveStats();
            }
            localStorage.setItem('serbolingo_haptics', next ? 'true' : 'false');
            this.updateSettingsUI();
            if (next) this.vibrate('tap');
            if (typeof app !== 'undefined' && app.showToast) {
                app.showToast(next ? '📳 Haptička vibracija uključena' : '📴 Haptička vibracija isključena', 'info');
            }
            return next;
        },

        // Update Settings UI toggle switches in view-profile
        updateSettingsUI: function () {
            const hapticBtn = document.getElementById('btn-haptics');
            const hapticKnob = document.getElementById('knob-haptics');
            const hapticsActive = this.isEnabled();
            if (hapticBtn && hapticKnob) {
                if (hapticsActive) {
                    hapticBtn.className = 'w-12 h-7 bg-blue-500 rounded-full relative transition-colors duration-300';
                    hapticKnob.className = 'absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform translate-x-5';
                } else {
                    hapticBtn.className = 'w-12 h-7 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors duration-300';
                    hapticKnob.className = 'absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform translate-x-0';
                }
            }
        },

        // --- 2. SWIPE PULL-DOWN-TO-DISMISS MODALS ---
        initSwipeDismiss: function () {
            const modals = [
                { id: 'shop-modal', closeFn: () => typeof ShopEngine !== 'undefined' && ShopEngine.closeShop ? ShopEngine.closeShop() : document.getElementById('shop-modal')?.classList.add('hidden') },
                { id: 'placement-modal', closeFn: () => typeof PlacementEngine !== 'undefined' && PlacementEngine.closeModal ? PlacementEngine.closeModal() : document.getElementById('placement-modal')?.classList.add('hidden') },
                { id: 'visual-lens-modal', closeFn: () => typeof VisualLens !== 'undefined' && VisualLens.closeModal ? VisualLens.closeModal() : document.getElementById('visual-lens-modal')?.classList.add('hidden') },
                { id: 'ghost-arena-modal', closeFn: () => typeof GhostEngine !== 'undefined' && GhostEngine.closeModal ? GhostEngine.closeModal() : document.getElementById('ghost-arena-modal')?.classList.add('hidden') },
                { id: 'guide-modal', closeFn: () => typeof SkillTree !== 'undefined' && SkillTree.closeGuideModal ? SkillTree.closeGuideModal() : document.getElementById('guide-modal')?.classList.add('hidden') }
            ];

            modals.forEach(m => {
                const el = document.getElementById(m.id);
                if (!el) return;
                this.attachModalSwipe(el, m.closeFn);
            });
        },

        attachModalSwipe: function (modalEl, closeCallback) {
            let startY = 0;
            let startX = 0;
            let startTime = 0;
            let isDragging = false;
            let targetCard = null;

            // Target the inner modal card
            targetCard = modalEl.querySelector('.modal-card, .rounded-3xl, .rounded-2xl, div > div') || modalEl;

            const onTouchStart = (e) => {
                if (modalEl.classList.contains('hidden')) return;
                const touch = e.touches[0];
                startY = touch.clientY;
                startX = touch.clientX;
                startTime = Date.now();

                // If user touches inside a scrolled element with scrollTop > 5, allow native scroll
                if (modalEl.scrollTop > 5) {
                    isDragging = false;
                    return;
                }

                isDragging = true;
                if (targetCard) {
                    targetCard.style.transition = 'none';
                }
            };

            const onTouchMove = (e) => {
                if (!isDragging || !targetCard) return;
                const touch = e.touches[0];
                const deltaY = touch.clientY - startY;
                const deltaX = Math.abs(touch.clientX - startX);

                // Ignore if mainly horizontal movement
                if (deltaX > Math.abs(deltaY) && Math.abs(deltaY) < 15) {
                    return;
                }

                if (deltaY > 0) {
                    // Pulling downward: prevent browser scroll/refresh to ensure butter-smooth drag
                    if (e.cancelable) e.preventDefault();
                    targetCard.style.transform = `translateY(${deltaY}px)`;
                    targetCard.style.opacity = `${Math.max(0.3, 1 - (deltaY / 380))}`;
                } else {
                    // Pulling upward: slight rubber band resistance
                    const resistanceDist = deltaY * 0.15;
                    targetCard.style.transform = `translateY(${resistanceDist}px)`;
                }
            };

            const onTouchEnd = (e) => {
                if (!isDragging || !targetCard) return;
                isDragging = false;
                const touch = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
                const endY = touch ? touch.clientY : startY;
                const deltaY = endY - startY;
                const dt = Math.max(1, Date.now() - startTime);
                const velocity = deltaY / dt; // px per millisecond

                // Dismiss threshold: dragged > 60px OR fast downward flick (>25px with velocity > 0.38)
                if (deltaY > 60 || (velocity > 0.38 && deltaY > 25)) {
                    TouchHaptics.vibrate('swipe');
                    targetCard.style.transition = 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.22s ease-out';
                    targetCard.style.transform = 'translateY(100vh)';
                    targetCard.style.opacity = '0';
                    setTimeout(() => {
                        targetCard.style.transform = '';
                        targetCard.style.opacity = '';
                        targetCard.style.transition = '';
                        if (closeCallback) closeCallback();
                    }, 220);
                } else {
                    // Snap back with spring physics
                    targetCard.style.transition = 'transform 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out';
                    targetCard.style.transform = 'translateY(0px)';
                    targetCard.style.opacity = '1';
                    setTimeout(() => {
                        targetCard.style.transition = '';
                        targetCard.style.transform = '';
                    }, 280);
                }
            };

            // Non-passive touchmove listener to allow e.preventDefault() during downward drag
            modalEl.addEventListener('touchstart', onTouchStart, { passive: true });
            modalEl.addEventListener('touchmove', onTouchMove, { passive: false });
            modalEl.addEventListener('touchend', onTouchEnd, { passive: true });
            modalEl.addEventListener('touchcancel', onTouchEnd, { passive: true });

            // Backdrop click dismissal (tapping outside the card)
            modalEl.addEventListener('click', (e) => {
                if (e.target === modalEl) {
                    TouchHaptics.vibrate('tap');
                    if (closeCallback) closeCallback();
                }
            });
        },

        // --- 3. SWIPE-BACK NAVIGATION TO HOME ---
        initSwipeBack: function () {
            let startX = 0;
            let startY = 0;
            let startTime = 0;
            let isValidSwipe = false;

            document.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
                startTime = Date.now();

                // If any modal is currently visible, don't trigger view swipe back
                const openModal = document.querySelector('#shop-modal:not(.hidden), #placement-modal:not(.hidden), #ghost-arena-modal:not(.hidden), #visual-lens-modal:not(.hidden), #guide-modal:not(.hidden)');
                if (openModal) {
                    isValidSwipe = false;
                    return;
                }

                // Check active visible views
                const homeView = document.getElementById('view-home');
                const lessonView = document.getElementById('view-lesson');
                const authView = document.getElementById('view-auth');

                const isHome = homeView && !homeView.classList.contains('hidden');
                const isLesson = lessonView && !lessonView.classList.contains('hidden');
                const isAuth = authView && !authView.classList.contains('hidden');

                // Don't swipe back if already on Home, inside a Lesson (avoid accidental forfeit), or on Auth screen
                if (isHome || isLesson || isAuth) {
                    isValidSwipe = false;
                    return;
                }

                // Allow swipe starting on the left 40% of the screen or within 80px
                const screenWidth = window.innerWidth || 360;
                if (startX <= Math.max(80, screenWidth * 0.4)) {
                    isValidSwipe = true;
                } else {
                    isValidSwipe = false;
                }
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                if (!isValidSwipe) return;
                isValidSwipe = false;
                const touch = e.changedTouches && e.changedTouches[0];
                if (!touch) return;

                const deltaX = touch.clientX - startX;
                const deltaY = Math.abs(touch.clientY - startY);
                const dt = Math.max(1, Date.now() - startTime);

                // Rightward swipe: deltaX > 60px, primarily horizontal (deltaX > deltaY * 1.4), and reasonable speed
                if (deltaX > 60 && deltaY < 65 && (deltaX / dt) > 0.22) {
                    TouchHaptics.vibrate('swipe');
                    if (typeof app !== 'undefined' && app.navigate) {
                        app.navigate('home');
                    }
                }
            }, { passive: true });
        },

        // --- 4. GLOBAL TACTILE BUTTON HAPTICS ---
        initButtonHaptics: function () {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button, .option-btn, [role="button"], .dir-btn, .nav-btn, .grammar-word, .modal-drag-handle');
                if (btn) {
                    TouchHaptics.vibrate('tap');
                }
            }, { passive: true });
        },

        // --- INITIALIZER ---
        init: function () {
            // Initialize touch swipe dismiss on modals
            this.initSwipeDismiss();

            // Initialize edge swipe back to Home
            this.initSwipeBack();

            // Initialize global button tap tactile feedback
            this.initButtonHaptics();

            // Sync settings UI once DOM ready
            setTimeout(() => {
                this.updateSettingsUI();
            }, 100);
        }
    };

    // Auto-init on DOMContentLoaded or immediate
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TouchHaptics.init());
    } else {
        TouchHaptics.init();
    }

    // Expose globally
    window.TouchHaptics = TouchHaptics;
})();
