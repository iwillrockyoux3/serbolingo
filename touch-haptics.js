// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo — Native Touch Gestures, Haptic Vibrations & Accessibility (Priority 25 & Priority 35)
// Features:
// 1. Haptic Micro-Vibrations (tap, correct, wrong, celebrate, swipe, shop) with user toggle.
// 2. Swipe Physics: Pull down to dismiss on modals & bottom sheets with spring bounce.
// 3. Swipe-to-Navigate: Edge swipe right to go back to Home view.
// 4. Colorblind Mode: High-contrast patterns and symbols for accessible learning.
// 5. Tablet & Landscape UI safety.

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
                        navigator.vibrate(12);
                        break;
                    case 'correct':
                        navigator.vibrate(40);
                        break;
                    case 'wrong':
                        navigator.vibrate([60, 40, 60]);
                        break;
                    case 'swipe':
                        navigator.vibrate(18);
                        break;
                    case 'celebrate':
                        navigator.vibrate([40, 30, 40, 30, 70]);
                        break;
                    case 'shop':
                        navigator.vibrate([25, 20, 35]);
                        break;
                    default:
                        if (typeof type === 'number' || Array.isArray(type)) {
                            navigator.vibrate(type);
                        } else {
                            navigator.vibrate(15);
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

        // --- 2. ACCESSIBILITY & COLORBLIND CONTROLLER ---
        isColorblindMode: function () {
            if (typeof state !== 'undefined' && state.settings) {
                return !!state.settings.colorblindMode;
            }
            return localStorage.getItem('serbolingo_colorblind') === 'true';
        },

        toggleColorblind: function () {
            const current = this.isColorblindMode();
            const next = !current;
            if (typeof state !== 'undefined' && state.settings) {
                state.settings.colorblindMode = next;
                if (typeof app !== 'undefined' && app.saveStats) app.saveStats();
            }
            localStorage.setItem('serbolingo_colorblind', next ? 'true' : 'false');
            this.applyColorblindMode(next);
            this.updateSettingsUI();
            this.vibrate('tap');
            if (typeof app !== 'undefined' && app.showToast) {
                app.showToast(next ? '👁️ Režim za daltoniste uključen' : '👁️ Standardni režim boja', 'info');
            }
            return next;
        },

        applyColorblindMode: function (enable) {
            if (typeof document === 'undefined') return;
            if (enable) {
                document.body.classList.add('colorblind-mode');
            } else {
                document.body.classList.remove('colorblind-mode');
            }
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

            const cbBtn = document.getElementById('btn-colorblind');
            const cbKnob = document.getElementById('knob-colorblind');
            const cbActive = this.isColorblindMode();
            if (cbBtn && cbKnob) {
                if (cbActive) {
                    cbBtn.className = 'w-12 h-7 bg-blue-500 rounded-full relative transition-colors duration-300';
                    cbKnob.className = 'absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform translate-x-5';
                } else {
                    cbBtn.className = 'w-12 h-7 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors duration-300';
                    cbKnob.className = 'absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md transition-transform duration-300 transform translate-x-0';
                }
            }
        },

        // --- 3. SWIPE PULL-DOWN-TO-DISMISS CONTROLLER ---
        initSwipeDismiss: function () {
            const modals = [
                { id: 'shop-modal', closeFn: () => typeof ShopEngine !== 'undefined' && ShopEngine.closeShop ? ShopEngine.closeShop() : document.getElementById('shop-modal')?.classList.add('hidden') },
                { id: 'placement-modal', closeFn: () => typeof PlacementEngine !== 'undefined' && PlacementEngine.closeModal ? PlacementEngine.closeModal() : document.getElementById('placement-modal')?.classList.add('hidden') },
                { id: 'visual-lens-modal', closeFn: () => typeof VisualLens !== 'undefined' && VisualLens.closeModal ? VisualLens.closeModal() : document.getElementById('visual-lens-modal')?.classList.add('hidden') },
                { id: 'ghost-arena-modal', closeFn: () => typeof GhostEngine !== 'undefined' && GhostEngine.closeModal ? GhostEngine.closeModal() : document.getElementById('ghost-arena-modal')?.classList.add('hidden') },
                { id: 'guide-modal', closeFn: () => typeof SkillTree !== 'undefined' && SkillTree.closeGuideModal ? SkillTree.closeGuideModal() : document.getElementById('guide-modal')?.classList.add('hidden') },
                { id: 'grammar-tooltip', closeFn: () => typeof GrammarEngine !== 'undefined' && GrammarEngine.hideTooltip ? GrammarEngine.hideTooltip() : document.getElementById('grammar-tooltip')?.classList.add('hidden') }
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
            let currentY = 0;
            let isDragging = false;
            let targetCard = null;

            modalEl.addEventListener('touchstart', (e) => {
                if (modalEl.classList.contains('hidden')) return;
                const touch = e.touches[0];
                startY = touch.clientY;
                startX = touch.clientX;
                currentY = startY;

                // Target the modal inner card or the modal itself
                targetCard = modalEl.querySelector('.modal-card, .rounded-3xl, .rounded-2xl, div > div') || modalEl;

                // Don't drag if user is scrolling inside a scrollable container that is already scrolled down
                const scrollable = e.target.closest('.overflow-y-auto, [style*="overflow"]');
                if (scrollable && scrollable.scrollTop > 5) {
                    isDragging = false;
                    return;
                }

                isDragging = true;
                if (targetCard) {
                    targetCard.style.transition = 'none';
                }
            }, { passive: true });

            modalEl.addEventListener('touchmove', (e) => {
                if (!isDragging || !targetCard) return;
                const touch = e.touches[0];
                const deltaY = touch.clientY - startY;
                const deltaX = Math.abs(touch.clientX - startX);

                // Ignore horizontal swipes
                if (deltaX > Math.abs(deltaY) && Math.abs(deltaY) < 15) {
                    return;
                }

                if (deltaY > 0) {
                    // Pulling downward: apply drag transform
                    currentY = touch.clientY;
                    const dragDist = deltaY;
                    targetCard.style.transform = `translateY(${dragDist}px)`;
                    targetCard.style.opacity = `${Math.max(0.4, 1 - (dragDist / 400))}`;
                } else {
                    // Pulling upward: apply slight rubber band resistance
                    const resistanceDist = deltaY * 0.2;
                    targetCard.style.transform = `translateY(${resistanceDist}px)`;
                }
            }, { passive: true });

            const handleEnd = () => {
                if (!isDragging || !targetCard) return;
                isDragging = false;
                const deltaY = currentY - startY;

                if (deltaY > 85) {
                    // Dismiss threshold reached!
                    TouchHaptics.vibrate('swipe');
                    targetCard.style.transition = 'transform 0.22s ease-out, opacity 0.22s ease-out';
                    targetCard.style.transform = 'translateY(100vh)';
                    targetCard.style.opacity = '0';
                    setTimeout(() => {
                        targetCard.style.transform = '';
                        targetCard.style.opacity = '';
                        targetCard.style.transition = '';
                        if (closeCallback) closeCallback();
                    }, 220);
                } else {
                    // Snap back with subtle spring physics
                    targetCard.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s ease-out';
                    targetCard.style.transform = 'translateY(0px)';
                    targetCard.style.opacity = '1';
                    setTimeout(() => {
                        targetCard.style.transition = '';
                        targetCard.style.transform = '';
                    }, 260);
                }
            };

            modalEl.addEventListener('touchend', handleEnd, { passive: true });
            modalEl.addEventListener('touchcancel', handleEnd, { passive: true });
        },

        // --- 4. SWIPE-BACK NAVIGATION ---
        initSwipeBack: function () {
            let startX = 0;
            let startY = 0;
            let isEdgeSwipe = false;

            document.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                const touch = e.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;

                // Edge swipe: starts within 35px from left edge of screen
                if (startX <= 35) {
                    isEdgeSwipe = true;
                } else {
                    isEdgeSwipe = false;
                }
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                if (!isEdgeSwipe) return;
                isEdgeSwipe = false;
                const touch = e.changedTouches[0];
                const deltaX = touch.clientX - startX;
                const deltaY = Math.abs(touch.clientY - startY);

                // Clean rightward swipe with minimal vertical drift
                if (deltaX > 75 && deltaY < 80) {
                    if (typeof app !== 'undefined' && app.navigate) {
                        const currentView = state ? state.currentView : null;
                        if (currentView && currentView !== 'home' && currentView !== 'auth') {
                            TouchHaptics.vibrate('swipe');
                            app.navigate('home');
                        }
                    }
                }
            }, { passive: true });
        },

        // --- 5. GLOBAL CLICK TACTILE HAPTICS ATTACHMENT ---
        initButtonHaptics: function () {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button, .option-btn, [role="button"], .dir-btn, .nav-btn, .grammar-word');
                if (btn) {
                    TouchHaptics.vibrate('tap');
                }
            }, { passive: true });
        },

        // --- INITIALIZER ---
        init: function () {
            // Apply saved colorblind mode
            this.applyColorblindMode(this.isColorblindMode());

            // Initialize touch swipe dismiss on modals
            this.initSwipeDismiss();

            // Initialize edge swipe back
            this.initSwipeBack();

            // Initialize global button tap haptics
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

    // Expose to window
    window.TouchHaptics = TouchHaptics;
})();
