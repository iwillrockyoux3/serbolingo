// [SHIELD_DAEMON: VALIDATED]
// ======== EXPLORE HUB (Priority 8) — Complete Module ========
// Modes: Normal (local DB), YouTube API Search, AI Generate Lesson

window.ExploreHub = (() => {
    'use strict';

    // -- STATE --
    let currentTab = 'video';
    let searchMode = 'normal'; // 'normal' | 'youtube' | 'ai'
    let ytApiKey = localStorage.getItem('serbolingo_yt_api_key') || '';

    // -- EDUCATIONAL SAFETY FILTER --
    const BLACKLIST = [
        'porn','xxx','sex','nude','naked','hentai','erotic','fetish',
        'gameplay','gaming','gamer','fortnite','minecraft','valorant','csgo','cod',
        'hack','cheat','crack','pirate','torrent','keygen',
        'gore','murder','torture','drug','weed','cocaine',
        'how to build','diy','woodworking','plumbing','electrical wiring',
        'cooking recipe','workout','fitness routine','makeup tutorial'
    ];

    const EDU_BOOST_TERMS = ['lesson','tutorial','learn','education','language','grammar','vocabulary','course','beginner','intermediate','advanced','pronunciation','practice'];

    function isBlockedQuery(q) {
        const lower = q.toLowerCase().trim();
        return BLACKLIST.some(b => lower.includes(b));
    }

    function makeEducationalQuery(q) {
        const lower = q.toLowerCase();
        const alreadyEdu = EDU_BOOST_TERMS.some(t => lower.includes(t));
        if (alreadyEdu) return q;
        return q + ' language lesson tutorial';
    }

    // -- MASTER LIBRARY (50+ Curated Educational Items) --
    const LIBRARY_EN_TO_SR = {
        video: [
            { id:'v01_en', title:'Learn Serbian - Basic Phrases', desc:'Essential Everyday Phrases', icon:'\u{1F468}\u{200D}\u{1F3EB}', color:'bg-blue-500', yt:'QcTeOCn8E1M', tags:['grammar','serbian','lesson','phrases','beginner'] },
            { id:'v02_en', title:'Serbian Alphabet (Cyrillic)', desc:'Learn the Azbuka', icon:'\u{1F524}', color:'bg-indigo-500', yt:'nXVO433iNe8', tags:['alphabet','serbian','beginner','cyrillic','azbuka'] },
            { id:'v03_en', title:'Top 100 Serbian Words', desc:'Vocabulary Builder', icon:'\u{1F4AC}', color:'bg-green-500', yt:'WR3ioPNPzKY', tags:['vocabulary','serbian','beginner'] },
            { id:'v04_en', title:'Serbian Grammar Basics', desc:'Learn the Rules', icon:'\u{1F4D0}', color:'bg-purple-500', yt:'9ysLOUdFUbU', tags:['grammar','serbian','lesson'] },
            { id:'v05_en', title:'How to pronounce Serbian', desc:'Speaking Practice', icon:'\u{1F5E3}', color:'bg-sky-500', yt:'rq7gtbA2Thg', tags:['pronunciation','serbian','speaking'] },
            { id:'v06_en', title:'Serbian Cases (Padeži)', desc:'Advanced Grammar', icon:'\u{1F9E0}', color:'bg-rose-500', yt:'qOtgxpDyGPw', tags:['grammar','serbian','cases'] },
            { id:'v07_en', title:'Serbian Greetings', desc:'Say Hello in Serbian', icon:'\u{1F44B}', color:'bg-teal-500', yt:'mxKyqCfjUI0', tags:['greetings','serbian','phrases'] },
            { id:'v08_en', title:'Serbian vs Croatian', desc:'Language Comparison', icon:'\u{1F500}', color:'bg-orange-500', yt:'g8D48nV9cd8', tags:['comparison','balkan','languages'] },
        ],
        extra: [
            { id:'e01_en', title:'Sundjer Bob na srpskom', desc:'SpongeBob - Epizoda 1', icon:'\u{1F9FD}', color:'bg-yellow-400', yt:'I3yfbOm-Pvc', tags:['cartoon','serbian','beginner','fun'] },
            { id:'e02_en', title:'Pepa Prase - Blatnjave barice', desc:'Serbian Dubbed', icon:'\u{1F437}', color:'bg-pink-400', yt:'OeY1z__mGLs', tags:['cartoon','serbian','beginner','kids'] },
            { id:'e03_en', title:'Ko to tamo peva - Kultna Scena', desc:'Classic Cinema', icon:'\u{1F68C}', color:'bg-orange-500', yt:'k_v6n8_stzE', tags:['cinema','serbian','culture','classic'] },
            { id:'e04_en', title:'Juzni Vetar - Akciona Scena', desc:'Modern Serbian Cinema', icon:'\u{1F3AC}', color:'bg-red-600', yt:'hT8sRqjLsIQ', tags:['cinema','serbian','modern','action'] },
            { id:'e05_en', title:'Munje! - Kultna Komedija', desc:'Comedy Classic', icon:'\u{26A1}', color:'bg-amber-500', yt:'gBn0h3t3GX0', tags:['cinema','serbian','comedy','classic'] },
            { id:'e06_en', title:'Maratonci trce pocasni krug', desc:'Yugoslav Classic', icon:'\u{1F3C3}', color:'bg-emerald-600', yt:'HgPqk5qJm-Q', tags:['cinema','serbian','classic','comedy'] },
        ],
        pictures: [
            { id:'p01_en', title:'Padezi (The 7 Cases)', desc:'Grammar Table', icon:'\u{1F4CA}', color:'bg-purple-500', tags:['grammar','cases','padezi','table'],
              content:'<table class="w-full text-xs border-collapse"><thead><tr class="bg-purple-100 dark:bg-purple-900"><th class="p-2 text-left border border-purple-200 dark:border-purple-700">Padez</th><th class="p-2 border border-purple-200 dark:border-purple-700">Pitanje</th><th class="p-2 border border-purple-200 dark:border-purple-700">Primer (zena)</th></tr></thead><tbody><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Nominativ</td><td class="p-2 border border-slate-200 dark:border-slate-700">Ko? Sta?</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>a</b></td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Genitiv</td><td class="p-2 border border-slate-200 dark:border-slate-700">Koga? Cega?</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>e</b></td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Dativ</td><td class="p-2 border border-slate-200 dark:border-slate-700">Kome? Cemu?</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>i</b></td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Akuzativ</td><td class="p-2 border border-slate-200 dark:border-slate-700">Koga? Sta?</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>u</b></td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Vokativ</td><td class="p-2 border border-slate-200 dark:border-slate-700">Hej!</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>o</b>!</td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Instrumental</td><td class="p-2 border border-slate-200 dark:border-slate-700">S kim? Cim?</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>om</b></td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Lokativ</td><td class="p-2 border border-slate-200 dark:border-slate-700">O kome? O cemu?</td><td class="p-2 border border-slate-200 dark:border-slate-700">zen<b>i</b></td></tr></tbody></table>' },
            { id:'p02_en', title:'Porodica (Family Tree)', desc:'Vocabulary Map', icon:'\u{1F333}', color:'bg-green-500', tags:['vocabulary','family','porodica','beginner'],
              content:'<div class="grid grid-cols-2 gap-2 text-xs"><div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F474}</div><b>Deda</b><br>Grandfather</div><div class="bg-pink-50 dark:bg-pink-900/30 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F475}</div><b>Baba</b><br>Grandmother</div><div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F468}</div><b>Otac / Tata</b><br>Father / Dad</div><div class="bg-pink-50 dark:bg-pink-900/30 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F469}</div><b>Majka / Mama</b><br>Mother / Mom</div><div class="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F466}</div><b>Sin / Brat</b><br>Son / Brother</div><div class="bg-pink-50 dark:bg-pink-900/30 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F467}</div><b>Cerka / Sestra</b><br>Daughter / Sister</div></div>' }
        ],
        articles: [
            { id:'a01_en', title:'Narucivanje hrane (Ordering Food)', desc:'Dialogue & Vocabulary', icon:'\u{1F354}', color:'bg-orange-400', tags:['dialogue','food','ordering','restaurant','beginner'],
              content:'<div class="space-y-3 text-sm text-slate-700 dark:text-slate-300"><p class="font-bold text-slate-900 dark:text-white">Dijalog u restoranu:</p><div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl space-y-2"><p><b>Konobar:</b> Dobar dan! Sta zelite da narucite?</p><p class="text-xs text-slate-500">Waiter: Good day! What would you like to order?</p><p><b>Vi:</b> Zeleo/la bih jednu cevape i salatu, molim.</p><p class="text-xs text-slate-500">You: I would like one cevapi and salad, please.</p><p><b>Konobar:</b> Uz to pice?</p><p class="text-xs text-slate-500">Waiter: A drink with that?</p><p><b>Vi:</b> Da, jednu kafu, hvala.</p><p class="text-xs text-slate-500">You: Yes, one coffee, thank you.</p></div><p class="font-bold mt-2">Kljucne reci:</p><ul class="list-disc pl-5 space-y-1 text-xs"><li><b>Naruciti</b> - To order</li><li><b>Molim</b> - Please</li><li><b>Hvala</b> - Thank you</li><li><b>Racun</b> - The bill</li><li><b>Konobar</b> - Waiter</li></ul></div>' },
            { id:'a02_en', title:'Beograd Nocu (Belgrade Nightlife)', desc:'Cultural Article', icon:'\u{1F303}', color:'bg-indigo-600', tags:['culture','belgrade','nightlife','city','intermediate'],
              content:'<div class="space-y-3 text-sm text-slate-700 dark:text-slate-300"><h3 class="font-black text-lg text-slate-900 dark:text-white">Beograd - Grad koji nikad ne spava</h3><p>Beograd je poznat po svom <b>nocnom zivotu</b> (nightlife). Splavovi (floating clubs) na Savi i Dunavu su jedinstveni u svetu!</p><div class="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl"><p class="font-bold mb-2">Popularna mesta:</p><ul class="space-y-1 text-xs"><li><b>Splavovi</b> (River clubs) - Savamala area</li><li><b>Kalemegdan</b> - Ancient fortress park</li><li><b>Knez Mihailova</b> - Main pedestrian street</li><li><b>Skadarlija</b> - Bohemian quarter (kafane!)</li></ul></div></div>' }
        ]
    };

    const LIBRARY_SR_TO_EN = {
        video: [
            { id:'v01_sr', title:'Kako naučiti engleski (Osnove)', desc:'Prvi koraci', icon:'\u{1F1EC}\u{1F1E7}', color:'bg-blue-500', yt:'g1tubKfOiIo', tags:['grammar','english','lesson','phrases','beginner'] },
            { id:'v02_sr', title:'Engleska Gramatika', desc:'Osnovna Vremena', icon:'\u{1F4D0}', color:'bg-indigo-500', yt:'yoa0CFV2j8w', tags:['grammar','english','beginner','tenses'] },
            { id:'v03_sr', title:'Engleski Rečnik za Početnike', desc:'100 Najbitnijih Reči', icon:'\u{1F4AC}', color:'bg-green-500', yt:'ZVqFsGE39QA', tags:['vocabulary','english','beginner'] },
            { id:'v04_sr', title:'Engleski - Svakodnevne Fraze', desc:'Naučite da pričate', icon:'\u{1F5E3}', color:'bg-purple-500', yt:'zhOyrOTz0tY', tags:['phrases','english','speaking'] },
            { id:'v05_sr', title:'Pravilan Izgovor u Engleskom', desc:'Vežba Izgovora', icon:'\u{1F3A4}', color:'bg-sky-500', yt:'wdp0KfBkDMw', tags:['pronunciation','english','speaking'] },
            { id:'v06_sr', title:'Engleski Predlozi', desc:'In, On, At...', icon:'\u{1F9E0}', color:'bg-rose-500', yt:'chPhgujVNWw', tags:['grammar','english','prepositions'] },
            { id:'v07_sr', title:'Engleski za Putovanja', desc:'Snalaženje na aerodromu', icon:'\u{2708}\u{FE0F}', color:'bg-teal-500', yt:'SNFx4USneVo', tags:['travel','english','phrases'] },
            { id:'v08_sr', title:'Učenje Engleskog Kroz Filmove', desc:'Zabavno i lako', icon:'\u{1F3AC}', color:'bg-orange-500', yt:'BCbHqCR2bFY', tags:['movies','learning','english'] },
        ],
        extra: [
            { id:'e01_sr', title:'SpongeBob in English', desc:'Learn with SpongeBob', icon:'\u{1F9FD}', color:'bg-yellow-400', yt:'xRfwXBitjc8', tags:['cartoon','english','beginner','fun'] },
            { id:'e02_sr', title:'Peppa Pig - English Episodes', desc:'Muddy Puddles', icon:'\u{1F437}', color:'bg-pink-400', yt:'WOkE3j6p35Y', tags:['cartoon','english','beginner','kids'] },
            { id:'e03_sr', title:'Friends - Funny Scenes', desc:'Learn English with Friends', icon:'\u{1F4FA}', color:'bg-purple-600', yt:'Lhpu3GdlV3w', tags:['tv','english','culture','comedy'] },
            { id:'e04_sr', title:'The Office US - Best Moments', desc:'American Workplace English', icon:'\u{1F4BC}', color:'bg-blue-600', yt:'y5jchMm0Ae8', tags:['tv','english','modern','comedy'] },
            { id:'e05_sr', title:'English Movie Trailers', desc:'Listening Practice', icon:'\u{1F3AC}', color:'bg-red-600', yt:'A7lyvgnDuDE', tags:['cinema','english','listening'] },
        ],
        pictures: [
            { id:'p01_sr', title:'Engleska Vremena (English Tenses)', desc:'Pregled Vremena', icon:'\u{23F1}\u{FE0F}', color:'bg-blue-500', tags:['grammar','tenses','vremena','table'],
              content:'<table class="w-full text-xs border-collapse"><thead><tr class="bg-blue-100 dark:bg-blue-900"><th class="p-2 text-left border border-blue-200 dark:border-blue-700">Vreme</th><th class="p-2 border border-blue-200 dark:border-blue-700">Upotreba</th><th class="p-2 border border-blue-200 dark:border-blue-700">Primer</th></tr></thead><tbody><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Present Simple</td><td class="p-2 border border-slate-200 dark:border-slate-700">Navike, činjenice</td><td class="p-2 border border-slate-200 dark:border-slate-700">I <b>work</b> every day.</td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Present Continuous</td><td class="p-2 border border-slate-200 dark:border-slate-700">Radnja koja se dešava sada</td><td class="p-2 border border-slate-200 dark:border-slate-700">I <b>am working</b> right now.</td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Past Simple</td><td class="p-2 border border-slate-200 dark:border-slate-700">Završena radnja u prošlosti</td><td class="p-2 border border-slate-200 dark:border-slate-700">I <b>worked</b> yesterday.</td></tr><tr><td class="p-2 font-bold border border-slate-200 dark:border-slate-700">Future Simple</td><td class="p-2 border border-slate-200 dark:border-slate-700">Odluke, predviđanja</td><td class="p-2 border border-slate-200 dark:border-slate-700">I <b>will work</b> tomorrow.</td></tr></tbody></table>' },
            { id:'p02_sr', title:'Porodica (Family in English)', desc:'Rečnik', icon:'\u{1F46A}', color:'bg-green-500', tags:['vocabulary','family','porodica','beginner'],
              content:'<div class="grid grid-cols-2 gap-2 text-xs"><div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F474}</div><b>Grandfather</b><br>Deda</div><div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F475}</div><b>Grandmother</b><br>Baba</div><div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F468}</div><b>Father</b><br>Otac</div><div class="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl text-center"><div class="text-2xl">\u{1F469}</div><b>Mother</b><br>Majka</div></div>' }
        ],
        articles: [
            { id:'a01_sr', title:'U Restoranu (At the Restaurant)', desc:'Dijalog na engleskom', icon:'\u{1F37D}\u{FE0F}', color:'bg-orange-400', tags:['dialogue','food','ordering','restaurant','beginner'],
              content:'<div class="space-y-3 text-sm text-slate-700 dark:text-slate-300"><p class="font-bold text-slate-900 dark:text-white">Dialogue:</p><div class="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl space-y-2"><p><b>Waiter:</b> Good evening! Are you ready to order?</p><p class="text-xs text-slate-500">Konobar: Dobro vece! Da li ste spremni da narucite?</p><p><b>You:</b> Yes, I would like a burger and fries, please.</p><p class="text-xs text-slate-500">Vi: Da, zeleo bih burger i pomfrit, molim vas.</p><p><b>Waiter:</b> And to drink?</p><p class="text-xs text-slate-500">Konobar: A za pice?</p><p><b>You:</b> A glass of water, thanks.</p><p class="text-xs text-slate-500">Vi: Casu vode, hvala.</p></div></div>' }
        ]
    };

    function getCurrentLibrary() {
        if (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'sr_to_en') {
            return LIBRARY_SR_TO_EN;
        }
        return LIBRARY_EN_TO_SR;
    }

    // -- WEEKLY ROTATION --
    function getWeekNumber() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const diff = now - start;
        return Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    }

    function getWeeklySuggestions(tab) {
        const items = getCurrentLibrary()[tab];
        if (!items || items.length === 0) return [];
        const week = getWeekNumber();
        const shuffled = [...items].sort((a, b) => {
            const ha = (week * 31 + a.id.charCodeAt(1)) % 97;
            const hb = (week * 31 + b.id.charCodeAt(1)) % 97;
            return ha - hb;
        });
        return shuffled.slice(0, 8);
    }

    // -- RENDER: CARDS --
    function renderVideoCard(item) {
        const thumbUrl = item.yt ? 'https://img.youtube.com/vi/' + item.yt + '/mqdefault.jpg' : '';
        return '<div onclick="ExploreHub.openItem(\'' + item.id + '\')" class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border-2 border-transparent hover:border-blue-400 active:scale-[0.99] transition-all cursor-pointer">' +
            '<div class="w-full aspect-video ' + item.color + ' flex items-center justify-center relative">' +
            (thumbUrl ? '<img src="' + thumbUrl + '" class="w-full h-full object-cover" onerror="this.style.display=\'none\'" loading="lazy">' : '') +
            '<div class="absolute inset-0 flex items-center justify-center bg-black/20"><div class="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg"><span class="text-2xl ml-1">\u{25B6}</span></div></div>' +
            '</div><div class="p-3"><h3 class="font-black text-slate-800 dark:text-white text-sm leading-tight mb-1">' + item.title + '</h3><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">' + item.desc + '</p></div></div>';
    }

    function renderContentCard(item) {
        return '<div onclick="ExploreHub.openItem(\'' + item.id + '\')" class="flex items-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-400 active:scale-[0.98] transition-all cursor-pointer">' +
            '<div class="' + item.color + ' w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner shrink-0 text-white">' + item.icon + '</div>' +
            '<div class="ml-3 flex-1 min-w-0"><h3 class="font-black text-slate-800 dark:text-white text-sm leading-tight mb-1 truncate">' + item.title + '</h3><p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">' + item.desc + '</p></div>' +
            '<div class="text-slate-300 dark:text-slate-600 pl-2 shrink-0">\u{25B6}</div></div>';
    }

    function renderYTResult(item) {
        return '<div onclick="ExploreHub.playYTResult(\'' + item.videoId + '\')" class="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border-2 border-transparent hover:border-blue-400 active:scale-[0.99] transition-all cursor-pointer">' +
            '<div class="w-full aspect-video bg-slate-200 dark:bg-slate-700 relative">' +
            '<img src="https://img.youtube.com/vi/' + item.videoId + '/mqdefault.jpg" class="w-full h-full object-cover" loading="lazy">' +
            '<div class="absolute inset-0 flex items-center justify-center bg-black/20"><div class="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg"><span class="text-white text-2xl ml-1">\u{25B6}</span></div></div>' +
            '<div class="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">YouTube Live</div></div>' +
            '<div class="p-3"><h3 class="font-black text-slate-800 dark:text-white text-sm leading-tight mb-1">' + item.title + '</h3><p class="text-[10px] text-slate-500 font-medium">' + (item.channelTitle || 'YouTube') + '</p></div></div>';
    }

    // -- RENDER: FEED --
    function renderFeed(tab, query) {
        var area = document.getElementById('explore-content');
        if (!area) return;

        var q = (query || '').toLowerCase().trim();
        var items;

        if (q) {
            items = getCurrentLibrary()[tab].filter(function(i) {
                var haystack = (i.title + ' ' + i.desc + ' ' + (i.tags || []).join(' ')).toLowerCase();
                return q.split(/\s+/).every(function(word) { return haystack.includes(word); });
            });
        } else {
            items = getWeeklySuggestions(tab);
        }

        if (items.length === 0) {
            area.innerHTML = '<div class="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">' +
                '<div class="text-4xl mb-3">\u{1F50D}</div>' +
                '<div class="font-bold text-slate-600 dark:text-slate-300 mb-1">' + t('explore_no_local_results') + ' "' + q + '"</div>' +
                '<div class="text-xs text-slate-400 mb-4">' + t('explore_try_youtube_or_ai') + '</div>' +
                '<div class="flex gap-2 justify-center flex-wrap">' +
                '<button onclick="ExploreHub.setMode(\'youtube\'); ExploreHub.doSearch();" class="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-transform">' + t('explore_search_youtube_btn') + '</button>' +
                '<button onclick="ExploreHub.setMode(\'ai\'); ExploreHub.doSearch();" class="bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-transform">' + t('explore_generate_ai_btn') + '</button>' +
                '</div></div>';
            return;
        }

        var sectionLabel = q ? t('explore_results_for') + ' "' + q + '"' : t('explore_suggested');
        var html = '<div class="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">' + sectionLabel + '</div>';

        if (tab === 'video' || tab === 'extra') {
            html += items.map(function(i) { return renderVideoCard(i); }).join('');
        } else {
            html += items.map(function(i) { return renderContentCard(i); }).join('');
        }

        area.innerHTML = html;
    }

    // -- YOUTUBE API SEARCH --
    async function searchYouTube(query) {
        if (!ytApiKey) { showYTKeyModal(); return; }

        if (isBlockedQuery(query)) {
            var area = document.getElementById('explore-content');
            area.innerHTML = '<div class="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800"><div class="text-4xl mb-2">\u{1F6AB}</div><div class="font-bold text-red-600 dark:text-red-400">' + t('explore_not_educational') + '</div><div class="text-xs text-red-400 mt-1">' + t('explore_not_educational_desc') + '</div></div>';
            return;
        }

        var area = document.getElementById('explore-content');
        area.innerHTML = '<div class="text-center py-10"><div class="text-4xl animate-bounce mb-2">\u{1F4FA}</div><div class="text-sm font-bold text-slate-600 dark:text-slate-300">' + t('explore_search_youtube_btn') + '...</div></div>';

        var eduQuery = makeEducationalQuery(query);

        try {
            var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=' + encodeURIComponent(eduQuery) + '&type=video&videoCategoryId=27&relevanceLanguage=sr&safeSearch=strict&key=' + ytApiKey;
            var res = await fetch(url);
            var data = await res.json();

            if (data.error) {
                if (data.error.code === 403 || (data.error.message && data.error.message.includes('quota'))) {
                    area.innerHTML = '<div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 text-center"><div class="text-3xl mb-2">\u{26A0}</div><div class="font-bold text-yellow-700 dark:text-yellow-300">' + t('explore_youtube_quota') + '</div><p class="text-xs text-yellow-600 mt-1">' + t('explore_youtube_quota_desc') + '</p></div>';
                } else {
                    throw new Error(data.error.message);
                }
                return;
            }

            if (!data.items || data.items.length === 0) {
                area.innerHTML = '<div class="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700"><div class="text-4xl mb-2">\u{1F615}</div><div class="font-bold text-slate-500">' + t('explore_no_yt_results_for') + ' "' + query + '"</div><button onclick="ExploreHub.setMode(\'ai\'); ExploreHub.doSearch();" class="mt-4 bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">' + t('explore_generate_ai_instead') + '</button></div>';
                return;
            }

            var results = data.items.map(function(item) {
                return {
                    videoId: item.id.videoId,
                    title: item.snippet.title.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'"),
                    channelTitle: item.snippet.channelTitle
                };
            });

            var html = '<div class="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">' + t('explore_youtube_results_for') + ' "' + query + '"</div>';
            html += results.map(function(r) { return renderYTResult(r); }).join('');
            area.innerHTML = html;

        } catch (e) {
            console.error('YouTube Search Error:', e);
            area.innerHTML = '<div class="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl"><h3 class="font-bold">' + t('explore_search_error') + '</h3><p class="text-xs mt-1">' + e.message + '</p><button onclick="ExploreHub.showYTKeyModal()" class="mt-2 text-xs text-blue-500 underline">' + t('explore_check_api_key') + '</button></div>';
        }
    }

    // -- AI LESSON GENERATION --
    async function generateAILesson(query) {
        var geminiKey = localStorage.getItem('serbolingo_api_key') || '';
        if (!geminiKey) {
            if (typeof app !== 'undefined' && app.openApiKeyModal) {
                app.openApiKeyModal(t('explore_gemini_key_prompt'));
            }
            return;
        }

        if (isBlockedQuery(query)) {
            var area = document.getElementById('explore-content');
            area.innerHTML = '<div class="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border-2 border-red-200 dark:border-red-800"><div class="text-4xl mb-2">\u{1F6AB}</div><div class="font-bold text-red-600 dark:text-red-400">' + t('explore_not_educational') + '</div><div class="text-xs text-red-400 mt-1">' + t('explore_ai_not_educational_desc') + '</div></div>';
            return;
        }

        var area = document.getElementById('explore-content');
        area.innerHTML = '<div class="text-center py-10"><div class="text-4xl animate-bounce mb-2">\u{1F916}</div><div class="text-sm font-bold text-slate-600 dark:text-slate-300">' + t('explore_ai_generating') + '</div><p class="text-[10px] text-slate-400 mt-1">' + t('explore_ai_creating_about') + ' "' + query + '"</p></div>';

        try {
            var controller = new AbortController();
            var timeoutId = setTimeout(function() { controller.abort(); }, 20000);

            var isEnToSr = (typeof state !== 'undefined' && state.settings) ? state.settings.learningDirection === 'en_to_sr' : true;
            var expLang = isEnToSr ? 'English' : 'Serbian';
            var tgtLang = isEnToSr ? 'Serbian' : 'English';

            var prompt = 'You are a ' + tgtLang + '/' + expLang + ' language tutor. Write a short, engaging mini-lesson (200 words max) about the topic "' + query + '".\nExplain it in ' + expLang + '. If it involves ' + tgtLang + ' vocabulary or grammar, provide 4-5 key examples with translations in ' + expLang + '.\nFormat in markdown:\n### [Catchy Title]\n[Brief Explanation - 2-3 sentences]\n\n**Key Vocabulary / Examples:**\n- **[Word/Phrase in ' + tgtLang + ']** - [' + expLang + ' meaning]\n- **[Word/Phrase in ' + tgtLang + ']** - [' + expLang + ' meaning]\n- **[Word/Phrase in ' + tgtLang + ']** - [' + expLang + ' meaning]\n- **[Word/Phrase in ' + tgtLang + ']** - [' + expLang + ' meaning]\n\n**Tip:** [One practical tip for using this in real conversation]';

            var res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + geminiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            var d = await res.json();

            if (d.error) throw new Error(d.error.message);

            var md = d.candidates[0].content.parts[0].text;
            var formatted = md
                .replace(/### (.*?)(\n|$)/g, '<h3 class="font-black text-blue-600 dark:text-blue-400 text-lg mb-2">$1</h3>')
                .replace(/\*\*([^*]+)\*\*/g, '<span class="font-black text-slate-800 dark:text-white">$1</span>')
                .replace(/- (.*?)(\n|$)/g, '<li class="mb-1 text-sm text-slate-600 dark:text-slate-300">$1</li>')
                .replace(/\n\n/g, '<br><br>')
                .replace(/\n/g, '<br>');

            area.innerHTML = '<div class="space-y-3">' +
                '<button onclick="ExploreHub.resetFeed()" class="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors active:scale-95">' + t('explore_back_to_list') + '</button>' +
                '<div class="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border-2 border-purple-100 dark:border-slate-700">' +
                '<div class="text-[10px] uppercase font-black text-purple-500 mb-3 tracking-widest flex items-center gap-1">' + t('explore_ai_generated_lesson') + '</div>' +
                formatted + '</div></div>';

        } catch (e) {
            console.error('AI Generate Error:', e);
            area.innerHTML = '<div class="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl"><h3 class="font-bold">' + t('explore_generation_error') + '</h3><p class="text-xs mt-1">' + e.message + '</p></div>';
        }
    }

    // -- YT API KEY MODAL --
    function showYTKeyModal() {
        var existing = document.getElementById('yt-key-modal');
        if (existing) existing.remove();

        var modal = document.createElement('div');
        modal.id = 'yt-key-modal';
        modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm fade-in';
        modal.innerHTML = '<div class="bg-white dark:bg-slate-800 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl border-2 border-white dark:border-slate-700 space-y-4">' +
            '<div class="text-4xl">\u{1F511}</div>' +
            '<h3 class="font-black text-lg text-slate-800 dark:text-white">' + t('explore_yt_key_title') + '</h3>' +
            '<p class="text-xs text-slate-500">' + t('explore_yt_key_desc') + '</p>' +
            '<a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener" class="inline-block text-xs text-blue-500 underline font-bold hover:text-blue-700">' + t('explore_yt_key_link') + '</a>' +
            '<p class="text-[10px] text-slate-400">Open link > Create Credentials > API Key > Enable "YouTube Data API v3"</p>' +
            '<input type="text" id="yt-key-input" placeholder="Paste YouTube API key here..." class="w-full p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-400" value="' + ytApiKey + '">' +
            '<div class="flex gap-2">' +
            '<button onclick="ExploreHub.saveYTKey()" class="flex-1 py-3 bg-red-500 text-white font-black rounded-xl text-sm active:scale-95 transition-transform shadow-md">' + t('explore_yt_key_save') + '</button>' +
            '<button onclick="document.getElementById(\'yt-key-modal\').remove()" class="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-xl text-sm active:scale-95 transition-transform">' + t('explore_yt_key_cancel') + '</button>' +
            '</div></div>';
        document.body.appendChild(modal);
    }

    function saveYTKey() {
        var input = document.getElementById('yt-key-input');
        if (!input) return;
        var key = input.value.trim();
        if (key) {
            ytApiKey = key;
            localStorage.setItem('serbolingo_yt_api_key', key);
            document.getElementById('yt-key-modal').remove();
            if (typeof app !== 'undefined' && app.showToast) app.showToast(t('explore_yt_key_saved'), 'success');
            var q = document.getElementById('explore-search-input');
            if (q && q.value.trim()) { searchYouTube(q.value.trim()); }
        }
    }

    // -- PUBLIC API --
    function switchTab(tab) {
        currentTab = tab;
        ['video', 'extra', 'pictures', 'articles'].forEach(function(t) {
            var btn = document.getElementById('tab-' + t);
            if (!btn) return;
            if (t === tab) {
                btn.className = 'flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors bg-white dark:bg-slate-700 text-blue-600 shadow-sm';
            } else {
                btn.className = 'flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-700/50';
            }
        });
        var input = document.getElementById('explore-search-input');
        if (input) input.value = '';
        searchMode = 'normal';
        updateModeButtons();
        renderFeed(tab);
    }

    function setMode(mode) {
        searchMode = (searchMode === mode) ? 'normal' : mode;
        updateModeButtons();
    }

    function updateModeButtons() {
        var ytBtn = document.getElementById('explore-btn-yt');
        var aiBtn = document.getElementById('explore-btn-ai');
        if (ytBtn) {
            if (searchMode === 'youtube') {
                ytBtn.className = 'px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all bg-red-500 text-white shadow-md scale-105';
            } else {
                ytBtn.className = 'px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/30';
            }
        }
        if (aiBtn) {
            if (searchMode === 'ai') {
                aiBtn.className = 'px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all bg-purple-500 text-white shadow-md scale-105';
            } else {
                aiBtn.className = 'px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-purple-100 dark:hover:bg-purple-900/30';
            }
        }
    }

    function doSearch() {
        var input = document.getElementById('explore-search-input');
        var query = input ? input.value.trim() : '';

        if (!query) { renderFeed(currentTab); return; }

        if (searchMode === 'youtube') {
            searchYouTube(query);
        } else if (searchMode === 'ai') {
            generateAILesson(query);
        } else {
            renderFeed(currentTab, query);
        }
    }

    function openItem(id) {
        var area = document.getElementById('explore-content');
        if (!area) return;

        var item = null;
        var tabs = Object.values(getCurrentLibrary());
        for (var ti = 0; ti < tabs.length; ti++) {
            item = tabs[ti].find(function(i) { return i.id === id; });
            if (item) break;
        }
        if (!item) return;

        if (item.action === 'karaoke' && window.Karaoke) {
            window.Karaoke.open(item.storyId);
            return;
        }

        var innerHtml = '';

        if (item.yt) {
            innerHtml = '<div class="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black"><iframe src="https://www.youtube.com/embed/' + item.yt + '?autoplay=1&rel=0" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
        } else if (item.content) {
            innerHtml = '<div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700">' + item.content + '</div>';
        }

        area.innerHTML = '<div class="space-y-3">' +
            '<button onclick="ExploreHub.resetFeed()" class="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors active:scale-95">' + t('explore_back_to_list') + '</button>' +
            '<h2 class="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2"><span class="' + item.color + ' w-10 h-10 rounded-lg flex items-center justify-center text-xl text-white shadow-sm">' + item.icon + '</span>' + item.title + '</h2>' +
            '<p class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">' + item.desc + '</p>' +
            innerHtml + '</div>';
    }

    function playYTResult(videoId) {
        var area = document.getElementById('explore-content');
        if (!area) return;

        area.innerHTML = '<div class="space-y-3">' +
            '<button onclick="ExploreHub.resetFeed()" class="flex items-center gap-2 text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors active:scale-95">' + t('explore_back_to_list') + '</button>' +
            '<div class="w-full aspect-video rounded-xl overflow-hidden shadow-lg bg-black"><iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div></div>';
    }

    function resetFeed() {
        var input = document.getElementById('explore-search-input');
        if (input) input.value = '';
        searchMode = 'normal';
        updateModeButtons();
        renderFeed(currentTab);
    }

    function init() {
        if (typeof app !== 'undefined' && app.applyLanguage) app.applyLanguage();
        switchTab('video');
    }

    return {
        init: init,
        switchTab: switchTab,
        setMode: setMode,
        doSearch: doSearch,
        openItem: openItem,
        playYTResult: playYTResult,
        resetFeed: resetFeed,
        showYTKeyModal: showYTKeyModal,
        saveYTKey: saveYTKey,
        updateModeButtons: updateModeButtons,
        refresh: function() { if (currentTab) switchTab(currentTab); }
    };
})();
