// [SHIELD_DAEMON: VALIDATED]
// SerboLingo Service Worker (v12) — Offline-First PWA Engine

const CACHE_NAME = 'serbolingo-app-v12';

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
    './seed-data.js?v=12',
    './db.js?v=12',
    './alphabet-data.js?v=12',
    './explore-hub.js?v=12',
    './karaoke.js?v=12',
    './question-engine.js?v=12',
    './skill-tree.js?v=12',
    './roleplay.js?v=12',
    './stories.js?v=12',
    './cloze.js?v=12',
    './slang.js?v=12',
    './pitch-accent.js?v=12',
    './rhythm.js?v=12',
    './ghost-arena.js?v=12',
    './arcade.js?v=12',
    './visual-lens.js?v=12',
    './commute.js?v=12',
    './shop-engine.js?v=12',
    './placement-test.js?v=12',
    './league-system.js?v=12',
    './srs-engine.js?v=12',
    './touch-haptics.js?v=12',
    './grammar-tooltips.js?v=12',
    './immersion-clips.js?v=12',
    './app.js?v=12'
];

// 1. INSTALL EVENT — Pre-cache local app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching SerboLingo App Shell...');
            // Atomic caching with resilient error catch per asset
            return Promise.allSettled(
                PRECACHE_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW] Could not pre-cache asset:', url, err);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

// 2. ACTIVATE EVENT — Clean up outdated caches & claim clients immediately
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name.startsWith('serbolingo-') && name !== CACHE_NAME) {
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

    // Bypass live APIs & real-time streaming services (TTS, Gemini, YouTube)
    if (
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
