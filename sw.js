// [SHIELD_DAEMON: VALIDATED]
// SerboLingo Service Worker (v27) — Offline-First PWA Engine

const CACHE_NAME = 'serbolingo-app-v27';

// Core static assets required for 100% offline app operation
const PRECACHE_ASSETS = [
    './',
    './index.html',
    './styles.css',
    './manifest.json',
    './icon.svg',
    './icon-192.png',
    './icon-512.png',
    './icon-192-maskable.png',
    './icon-512-maskable.png',
    './seed-data.js?v=27',
    './basics-data.js?v=27',
    './db.js?v=27',
    './alphabet-data.js?v=27',
    './explore-hub.js?v=27',
    './karaoke.js?v=27',
    './question-engine.js?v=27',
    './skill-tree.js?v=27',
    './roleplay.js?v=27',
    './stories.js?v=27',
    './cloze.js?v=27',
    './slang.js?v=27',
    './pitch-accent.js?v=27',
    './rhythm.js?v=27',
    './ghost-arena.js?v=27',
    './arcade.js?v=27',
    './trophy-cabinet.js?v=27',
    './monty-winner.js?v=27',
    './visual-lens.js?v=27',
    './commute.js?v=27',
    './shop-engine.js?v=27',
    './hint-engine.js?v=27',
    './classroom.js?v=27',
    './placement-test.js?v=27',
    './league-system.js?v=27',
    './srs-engine.js?v=27',
    './touch-haptics.js?v=27',
    './grammar-tooltips.js?v=27',
    './grammar-sandbox.js?v=27',
    './immersion-clips.js?v=27',
    './streak-retention.js?v=27',
    './serbo-reels.js?v=27',
    './smart-story.js?v=27',
    './language-exchange.js?v=27',
    './community-forum.js?v=27',
    './bug-report.js?v=27',
    './app.js?v=27'
];

// 1. INSTALL EVENT — Pre-cache local app shell with instant skipWaiting
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching SerboLingo App Shell (v27)...');
            // Atomic caching with resilient error catch per asset
            return Promise.allSettled(
                PRECACHE_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW] Could not pre-cache asset:', url, err);
                    })
                )
            );
        })
    );
});

// Message listener for explicit SKIP_WAITING signals from app.js
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// 2. ACTIVATE EVENT — Clean up outdated caches & claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        console.log('[SW] Deleting legacy cache:', name);
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. FETCH EVENT — Intelligent Caching Strategies
self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // Bypass non-GET requests
    if (req.method !== 'GET') return;

    // Bypass live APIs & real-time streaming services (TTS, Lingva, Gemini, YouTube)
    if (
        url.hostname.includes('lingva') ||
        url.hostname.includes('translate.google') ||
        url.hostname.includes('translate.googleapis.com') ||
        url.hostname.includes('generativelanguage.googleapis.com') ||
        url.hostname.includes('youtube.com') ||
        url.hostname.includes('googlevideo.com')
    ) {
        return; // Always fetch direct from network
    }

    // A. Navigation requests (HTML document) — Stale-while-revalidate with offline fallback
    if (req.mode === 'navigate') {
        event.respondWith(
            fetch(req)
                .then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        const copy = networkRes.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    }
                    return networkRes;
                })
                .catch(() => {
                    return caches.match('./index.html') || caches.match('/');
                })
        );
        return;
    }

    // B. External CDN assets (Tailwind, Chart.js, Google Fonts) — Cache-First with runtime caching
    if (
        url.hostname.includes('cdn.tailwindcss.com') ||
        url.hostname.includes('cdn.jsdelivr.net') ||
        url.hostname.includes('fonts.googleapis.com') ||
        url.hostname.includes('fonts.gstatic.com')
    ) {
        event.respondWith(
            caches.match(req).then((cachedRes) => {
                if (cachedRes) return cachedRes;
                return fetch(req).then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        const copy = networkRes.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                    }
                    return networkRes;
                }).catch(() => cachedRes);
            })
        );
        return;
    }

    // C. Local App Shell & static assets — Cache-First with Network Fallback
    event.respondWith(
        caches.match(req, { ignoreSearch: false }).then((cachedRes) => {
            if (cachedRes) {
                // Fetch update in background for stale-while-revalidate
                fetch(req).then((networkRes) => {
                    if (networkRes && networkRes.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
                    }
                }).catch(() => {/* Offline, silent */});
                return cachedRes;
            }

            return fetch(req).then((networkRes) => {
                if (networkRes && networkRes.status === 200) {
                    const copy = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                }
                return networkRes;
            }).catch((err) => {
                // If requesting an image that failed, could return placeholder
                console.warn('[SW] Offline fetch failed for:', req.url);
            });
        })
    );
});
