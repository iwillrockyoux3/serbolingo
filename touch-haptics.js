// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo — Native Touch Gestures & Haptic Vibrations (Priority 25 & Priority 35)
// Features:
// 1. Noticeable, punchy haptic vibrations (tap, correct, wrong, celebrate, swipe, shop) with user toggle.
// 2. High-performance modal pull-down dismiss with spring physics, inner scroll detection, and backdrop dismissal.
// 3. Smooth bi-directional horizontal swipe between bottom navigation tabs (Home ↔ Arcade ↔ Explore ↔ Mistakes ↔ Stats ↔ Profile).
// 4. Edge swipe-to-go-back to Home from secondary views.
// 5. Mobile browser gesture shield & standalone app detection (Cloudflare web vs. Google Play wrapper).

(function () {
    'use strict';

    const NAV_TABS = ['home', 'arcade', 'explore', 'mistakes', 'stats', 'profile'];

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

        // --- PLATFORM & STATE HELPERS ---
        isNativeApp: function () {
            return !!(
                (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) ||
                (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
                (typeof navigator !== 'undefined' && navigator.standalone === true) ||
                (typeof document !== 'undefined' && document.referrer && document.referrer.startsWith('android-app://'))
            );
        },

        isModalOpen: function () {
            return !!document.querySelector('[id$="-modal"]:not(.hidden), #classroom-lesson-overlay:not(.hidden), .celebration-overlay:not(.hidden)');
        },

        getActiveNavTab: function () {
            for (let i = 0; i < NAV_TABS.length; i++) {
                const el = document.getElementById('view-' + NAV_TABS[i]);
                if (el && !el.classList.contains('hidden')) {
                    return NAV_TABS[i];
                }
            }
            return null;
        },

        // --- 2. SWIPE PULL-DOWN-TO-DISMISS MODALS ---
        initSwipeDismiss: function () {
            const modals = [
                // Core Gamification & Shop
                { id: 'shop-modal', closeFn: () => typeof ShopEngine !== 'undefined' && ShopEngine.closeShop ? ShopEngine.closeShop() : document.getElementById('shop-modal')?.classList.add('hidden') },
                { id: 'placement-modal', closeFn: () => typeof PlacementEngine !== 'undefined' && PlacementEngine.closeModal ? PlacementEngine.closeModal() : document.getElementById('placement-modal')?.classList.add('hidden') },
                { id: 'visual-lens-modal', closeFn: () => typeof VisualLens !== 'undefined' && VisualLens.closeModal ? VisualLens.closeModal() : document.getElementById('visual-lens-modal')?.classList.add('hidden') },
                { id: 'ghost-arena-modal', closeFn: () => typeof GhostEngine !== 'undefined' && GhostEngine.closeModal ? GhostEngine.closeModal() : document.getElementById('ghost-arena-modal')?.classList.add('hidden') },
                { id: 'flashcard-swipe-modal', closeFn: () => typeof SrsEngine !== 'undefined' && SrsEngine.closeModal ? SrsEngine.closeModal() : document.getElementById('flashcard-swipe-modal')?.classList.add('hidden') },
                
                // Ranked Leagues & Locker
                { id: 'league-modal', closeFn: () => typeof LeagueEngine !== 'undefined' && LeagueEngine.closeLeagueModal ? LeagueEngine.closeLeagueModal() : document.getElementById('league-modal')?.classList.add('hidden') },
                { id: 'league-results-modal', closeFn: () => typeof LeagueEngine !== 'undefined' && LeagueEngine.closeResultsModal ? LeagueEngine.closeResultsModal() : document.getElementById('league-results-modal')?.classList.add('hidden') },
                { id: 'locker-modal', closeFn: () => typeof LeagueEngine !== 'undefined' && LeagueEngine.closeLockerModal ? LeagueEngine.closeLockerModal() : document.getElementById('locker-modal')?.classList.add('hidden') },
                
                // Guides & Alphabets
                { id: 'guide-modal', closeFn: () => typeof app !== 'undefined' && app.closeGuide ? app.closeGuide() : document.getElementById('guide-modal')?.classList.add('hidden') },
                { id: 'alphabet-selection-modal', closeFn: () => typeof app !== 'undefined' && app.closeAlphabetModal ? app.closeAlphabetModal() : document.getElementById('alphabet-selection-modal')?.classList.add('hidden') },
                { id: 'basics-hub-modal', closeFn: () => typeof app !== 'undefined' && app.closeBasicsHub ? app.closeBasicsHub() : document.getElementById('basics-hub-modal')?.classList.add('hidden') },
                { id: 'goal-modal', closeFn: () => typeof app !== 'undefined' && app.closeGoalModal ? app.closeGoalModal() : document.getElementById('goal-modal')?.classList.add('hidden') },

                // Immersion & SerboReels
                { id: 'immersion-modal', closeFn: () => typeof ImmersionClips !== 'undefined' && ImmersionClips.closeModal ? ImmersionClips.closeModal() : document.getElementById('immersion-modal')?.classList.add('hidden') },
                { id: 'serbo-reels-modal', closeFn: () => typeof SerboReels !== 'undefined' && SerboReels.closeFeed ? SerboReels.closeFeed() : document.getElementById('serbo-reels-modal')?.classList.add('hidden') },

                // Streak Retention Engine (Priority 37)
                { id: 'streak-hub-modal', closeFn: () => typeof StreakEngine !== 'undefined' && StreakEngine.closeStreakModal ? StreakEngine.closeStreakModal() : document.getElementById('streak-hub-modal')?.classList.add('hidden') },
                { id: 'streak-repair-modal', closeFn: () => typeof StreakEngine !== 'undefined' && StreakEngine.closeRepairModal ? StreakEngine.closeRepairModal() : document.getElementById('streak-repair-modal')?.classList.add('hidden') },
                { id: 'streak-challenge-modal', closeFn: () => typeof StreakEngine !== 'undefined' && StreakEngine.closeChallengeModal ? StreakEngine.closeChallengeModal() : document.getElementById('streak-challenge-modal')?.classList.add('hidden') },
                { id: 'streak-milestone-modal', closeFn: () => typeof StreakEngine !== 'undefined' && StreakEngine.closeMilestoneModal ? StreakEngine.closeMilestoneModal() : document.getElementById('streak-milestone-modal')?.classList.add('hidden') },

                // Utility & API Keys
                { id: 'api-key-modal', closeFn: () => typeof app !== 'undefined' && app.closeApiKeyModal ? app.closeApiKeyModal() : document.getElementById('api-key-modal')?.classList.add('hidden') },
                { id: 'voice-recommendation-modal', closeFn: () => document.getElementById('voice-recommendation-modal')?.classList.add('hidden') },
                { id: 'yt-key-modal', closeFn: () => document.getElementById('yt-key-modal')?.classList.add('hidden') },

                // Social Profile Sharing & Spectator
                { id: 'share-profile-modal', closeFn: () => typeof app !== 'undefined' && app.closeShareProfileModal ? app.closeShareProfileModal() : document.getElementById('share-profile-modal')?.classList.add('hidden') },
                { id: 'spectator-profile-modal', closeFn: () => typeof app !== 'undefined' && app.closeSpectatorModal ? app.closeSpectatorModal() : document.getElementById('spectator-profile-modal')?.classList.add('hidden') }
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

            // Target the inner modal card (including bottom sheets with rounded-t-3xl)
            targetCard = modalEl.querySelector('#alphabet-modal-content, .modal-card, .rounded-3xl, .rounded-2xl, .rounded-t-3xl, .rounded-t-[2.5rem], .rounded-[2.5rem], div > div') || modalEl;

            const onTouchStart = (e) => {
                if (modalEl.classList.contains('hidden')) return;
                if (e.touches.length !== 1) return;

                const touch = e.touches[0];
                startY = touch.clientY;
                startX = touch.clientX;
                startTime = Date.now();

                // If user touches inside a scrolled inner element with scrollTop > 5, allow native inner scroll
                const scrollableInner = e.target.closest('.overflow-y-auto, [class*="overflow-y"]');
                if (scrollableInner && scrollableInner.scrollTop > 5) {
                    isDragging = false;
                    return;
                }

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

                // If inner scrollable is still scrolled, don't drag modal down
                const scrollableInner = e.target.closest('.overflow-y-auto, [class*="overflow-y"]');
                if (scrollableInner && scrollableInner.scrollTop > 0 && deltaY > 0) {
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

        // --- 3. BI-DIRECTIONAL HORIZONTAL SWIPE BETWEEN BOTTOM NAV TABS ---
        switchNavTab: function (tabName, dir) {
            if (typeof app === 'undefined' || !app.navigate) return;

            const targetEl = document.getElementById('view-' + tabName);
            if (targetEl) {
                targetEl.classList.remove('view-slide-in-right', 'view-slide-in-left');
                void targetEl.offsetWidth; // Force CSS reflow
                targetEl.classList.add(dir === 'next' ? 'view-slide-in-right' : 'view-slide-in-left');
                setTimeout(() => {
                    targetEl.classList.remove('view-slide-in-right', 'view-slide-in-left');
                }, 260);
            }

            app.navigate(tabName);
        },

        initNavSwipe: function () {
            let startX = 0;
            let startY = 0;
            let startTime = 0;
            let isSwipeActive = false;
            let isHorizLocked = false;
            let isVertLocked = false;

            document.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;

                // Don't swipe tabs if any modal or celebration is open
                if (TouchHaptics.isModalOpen()) return;

                // Don't swipe tabs if inside special views (lesson, karaoke, commute, auth)
                const blocked = ['view-lesson', 'view-karaoke', 'view-audio-commute', 'view-auth'];
                for (let i = 0; i < blocked.length; i++) {
                    const el = document.getElementById(blocked[i]);
                    if (el && !el.classList.contains('hidden')) return;
                }

                // Don't swipe tabs if user touched an interactive control, canvas, game, or slider
                if (e.target.closest('canvas, input, textarea, select, #arcade-game-container, .no-swipe, [data-no-swipe]')) {
                    return;
                }

                const currentTab = TouchHaptics.getActiveNavTab();
                if (!currentTab) return;

                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startTime = Date.now();
                isSwipeActive = true;
                isHorizLocked = false;
                isVertLocked = false;
            }, { passive: true });

            document.addEventListener('touchmove', (e) => {
                if (!isSwipeActive) return;

                const touch = e.touches[0];
                const dx = touch.clientX - startX;
                const dy = touch.clientY - startY;

                // Lock direction on initial 12px move
                if (!isHorizLocked && !isVertLocked) {
                    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) {
                        isVertLocked = true;
                        isSwipeActive = false; // User is scrolling vertically
                        return;
                    }
                    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
                        isHorizLocked = true;
                    }
                }
            }, { passive: true });

            document.addEventListener('touchend', (e) => {
                if (!isSwipeActive || !isHorizLocked) {
                    isSwipeActive = false;
                    isHorizLocked = false;
                    isVertLocked = false;
                    return;
                }

                isSwipeActive = false;
                isHorizLocked = false;
                isVertLocked = false;

                const touch = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
                if (!touch) return;

                const deltaX = touch.clientX - startX;
                const deltaY = Math.abs(touch.clientY - startY);
                const dt = Math.max(1, Date.now() - startTime);
                const velocity = Math.abs(deltaX) / dt;

                // Swipe gesture thresholds
                const isFastSwipe = velocity > 0.28 && Math.abs(deltaX) > 45;
                const isLongSwipe = Math.abs(deltaX) > 85;
                const isDominated = Math.abs(deltaX) > deltaY * 1.35;

                if ((isFastSwipe || isLongSwipe) && isDominated) {
                    const currentTab = TouchHaptics.getActiveNavTab();
                    const currentIndex = NAV_TABS.indexOf(currentTab);
                    if (currentIndex === -1) return;

                    let targetIndex = -1;
                    let dir = '';

                    if (deltaX < 0) {
                        // Swiped Left -> Move to Next Tab
                        targetIndex = currentIndex + 1;
                        dir = 'next';
                    } else {
                        // Swiped Right -> Move to Previous Tab
                        targetIndex = currentIndex - 1;
                        dir = 'prev';
                    }

                    if (targetIndex >= 0 && targetIndex < NAV_TABS.length) {
                        const nextTab = NAV_TABS[targetIndex];
                        TouchHaptics.vibrate('swipe');
                        TouchHaptics.switchNavTab(nextTab, dir);
                    }
                }
            }, { passive: true });
        },

        // --- 4. SWIPE-BACK NAVIGATION (EDGE SWIPE FALLBACK) ---
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
                if (TouchHaptics.isModalOpen()) {
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

                // Don't swipe back if already on Home, inside a Lesson, or on Auth screen
                if (isHome || isLesson || isAuth) {
                    isValidSwipe = false;
                    return;
                }

                // Allow swipe starting on the left 30% of the screen or within 80px
                const screenWidth = window.innerWidth || 360;
                if (startX <= Math.max(80, screenWidth * 0.3)) {
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

                // Rightward swipe from edge: deltaX > 60px, primarily horizontal
                if (deltaX > 60 && deltaY < 65 && (deltaX / dt) > 0.22) {
                    TouchHaptics.vibrate('swipe');
                    if (typeof app !== 'undefined' && app.navigate) {
                        app.navigate('home');
                    }
                }
            }, { passive: true });
        },

        // --- 5. GLOBAL TACTILE BUTTON HAPTICS ---
        initButtonHaptics: function () {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button, .option-btn, [role="button"], .dir-btn, .nav-btn, .grammar-word, .modal-drag-handle, .category-chip');
                if (btn) {
                    TouchHaptics.vibrate('tap');
                }
            }, { passive: true });
        },

        // --- INITIALIZER ---
        init: function () {
            // 1. Initialize touch swipe dismiss on all 20 modals
            this.initSwipeDismiss();

            // 2. Initialize bi-directional horizontal swipe between bottom nav tabs
            this.initNavSwipe();

            // 3. Initialize edge swipe back fallback to Home
            this.initSwipeBack();

            // 4. Initialize global button tap tactile feedback
            this.initButtonHaptics();

            // 5. Sync settings UI once DOM ready
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
