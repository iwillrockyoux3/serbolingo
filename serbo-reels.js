/**
 * SerboLingo — SerboReels: Short-Form Video Immersion & Tap-to-Translate (Priority 45)
 * [SHIELD_DAEMON: VALIDATED]
 * 
 * Benchmark: Kiku, Migaku, Lingopie & TikTok
 * Features:
 * 1. Vertical short-form immersion feed (Cult Cinema, Dubbed Cartoons, Street Humor, Pop Culture).
 * 2. Synchronized interactive dual subtitles with Latin / Cyrillic script parity.
 * 3. 1-Tap Word Inspector: pauses clip, displays grammatical case (Padeži), lemma root & meaning.
 * 4. 1-Tap Save to SRS Flashcards (Tinder-style deck sync + XP reward).
 * 5. Habit Loop Gamification (+15 XP every 3 completed clips, likes, category filtering).
 */

(function () {
    'use strict';

    const SerboReels = {
        STORAGE_KEY: 'serbolingo_reels_data',

        // --- Curated Catalog of 12 Authentic Balkan Video Clips ---
        CLIPS: [
            {
                id: 'reel_ko_to_tamo_peva',
                title: 'Ko to tamo peva (1980)',
                subtitle: 'Kultna jugoslovenska komedija',
                category: 'cinema',
                categoryLabel: '🎬 Kultni Film',
                ytId: 'PDtjBtuqoQA', // Centar Film - Za Beograd / Ko to tamo peva
                start: 0,
                duration: 18,
                poster: 'https://img.youtube.com/vi/PDtjBtuqoQA/hqdefault.jpg',
                author: 'Slobodan Šijan & Dušan Kovačević',
                subSrLat: 'I tata bi, sine! Pa naravno da bi, ko ne bi želeo ovakvu priliku?',
                subSrCyr: 'И тата би, сине! Па наравно да би, ко не би желео овакву прилику?',
                subEn: 'Daddy would too, son! Well of course he would, who wouldn’t want such an opportunity?',
                culturalNote: 'Jedna od najcitiranijih replika u istoriji balkanske kinematografije. Koristi se u svakodnevnom govoru kao duhovita potvrda slaganja.',
                keyWords: [
                    { word: 'tata', root: 'otac / tata', pos: 'imenica', caseTag: 'Nominativ', trans: 'dad / father' },
                    { word: 'sine', root: 'sin', pos: 'imenica', caseTag: 'Vokativ (obraćanje)', trans: 'son (in direct address)' },
                    { word: 'želeo', root: 'želeti', pos: 'glagol', caseTag: 'Radni glagolski pridev (prošlo vreme)', trans: 'wanted / wished' },
                    { word: 'priliku', root: 'prilika', pos: 'imenica', caseTag: 'Akuzativ (objekat)', trans: 'opportunity / chance' }
                ]
            },
            {
                id: 'reel_maratonci',
                title: 'Maratonci trče počasni krug',
                subtitle: 'Porodica Topalović',
                category: 'cinema',
                categoryLabel: '🎬 Kultni Film',
                ytId: '1x6bDQ0A-F4', // Centar Film - Ostali samo dugmici / Maratonci
                start: 0,
                duration: 20,
                poster: 'https://img.youtube.com/vi/1x6bDQ0A-F4/hqdefault.jpg',
                author: 'Dušan Kovačević',
                subSrLat: 'Ala ga je opravio, svaka mu čast! Ostali samo dugmići.',
                subSrCyr: 'Ала га је оправио, свака му част! Остали само дугмићи.',
                subEn: 'Boy did he fix it, hats off to him! Only the buttons are left.',
                culturalNote: 'Vrhunski primer balkanskog sarkazma. Kaže se kada neko nešto "popravi" tako temeljno da ga zapravo potpuno uništi.',
                keyWords: [
                    { word: 'opravio', root: 'opraviti', pos: 'glagol', caseTag: 'Perfekat (muški rod)', trans: 'repaired / fixed' },
                    { word: 'čast', root: 'čast', pos: 'imenica', caseTag: 'Nominativ', trans: 'honor / respect' },
                    { word: 'ostali', root: 'ostati', pos: 'glagol', caseTag: 'Prošlo vreme (množina)', trans: 'remained / left behind' },
                    { word: 'dugmići', root: 'dugme', pos: 'imenica', caseTag: 'Nominativ množine (deminutiv)', trans: 'little buttons' }
                ]
            },
            {
                id: 'reel_munje',
                title: 'Munje! (2001)',
                subtitle: 'Beogradski noćni život i sleng',
                category: 'cinema',
                categoryLabel: '🎬 Kultni Film',
                ytId: 'b1W_EK5c270', // Munje - Kultna Komedija
                start: 5,
                duration: 22,
                poster: 'https://img.youtube.com/vi/b1W_EK5c270/hqdefault.jpg',
                author: 'Radivoje Andrić',
                subSrLat: 'Brate, koja je poenta? Dolar u pezos, pezos u dinar, dinar u džep!',
                subSrCyr: 'Брате, која је поента? Долар у пезос, пезос у динар, динар у џеп!',
                subEn: 'Bro, what is the point? Dollar to peso, peso to dinar, dinar into the pocket!',
                culturalNote: 'Ikonični beogradski urban dijalog sa početka 2000-ih. Reč "brate" je univerzalna poštapalica u neformalnom govoru.',
                keyWords: [
                    { word: 'brate', root: 'brat', pos: 'imenica', caseTag: 'Vokativ (sleng obraćanje)', trans: 'brother / bro' },
                    { word: 'poenta', root: 'poenta', pos: 'imenica', caseTag: 'Nominativ', trans: 'point / main idea' },
                    { word: 'džep', root: 'džep', pos: 'imenica', caseTag: 'Akuzativ s predlogom (pravac)', trans: 'pocket' }
                ]
            },
            {
                id: 'reel_lepa_sela',
                title: 'Lepa sela lepo gore (1996)',
                subtitle: 'Legendarni filmski dijalog',
                category: 'cinema',
                categoryLabel: '🎬 Kultni Film',
                ytId: '0HaJzZ1XMCs', // Lepa Sela Lepo Gore - Ladno al standard
                start: 0,
                duration: 19,
                poster: 'https://img.youtube.com/vi/0HaJzZ1XMCs/hqdefault.jpg',
                author: 'Srđan Dragojević',
                subSrLat: 'Kako je kod vas u Švedskoj? Ladno, al standard, jebi ga!',
                subSrCyr: 'Како је код вас у Шведској? Ладно, ал стандард, јеби га!',
                subEn: 'How is it over there in Sweden? Cold, but high standard of living, what can you do!',
                culturalNote: 'Humoristički osvrt na balkansku dijasporu. "Standard" označava dobar životni standard i visoke plate na Zapadu.',
                keyWords: [
                    { word: 'Švedskoj', root: 'Švedska', pos: 'imenica', caseTag: 'Lokativ s predlogom U', trans: 'Sweden' },
                    { word: 'ladno', root: 'hladno', pos: 'prilog', caseTag: 'Kolokvijalni oblik za hladno', trans: 'cold' },
                    { word: 'standard', root: 'standard', pos: 'imenica', caseTag: 'Nominativ', trans: 'living standard' }
                ]
            },
            {
                id: 'reel_sundjer_bob',
                title: 'Sunđer Bob Kockalone',
                subtitle: 'Sinhronizovano na srpski jezik',
                category: 'cartoons',
                categoryLabel: '🧸 Sinhronizacija',
                ytId: '5p2WQXc_ZL4', // Sundjer Bob Kockalone - Za pos'o sam spreman
                start: 2,
                duration: 17,
                poster: 'https://img.youtube.com/vi/5p2WQXc_ZL4/hqdefault.jpg',
                author: 'Srpska sinhronizacija (B92)',
                subSrLat: 'Ja sam spreman! Ja sam spreman za najbolji posao na svetu!',
                subSrCyr: 'Ја сам спреман! Ја сам спреман за најбољи посао на свету!',
                subEn: 'I am ready! I am ready for the best job in the world!',
                culturalNote: 'Srpska sinhronizacija Sunđer Boba ima kultni status zbog fantastične dikcije i glumačke izražajnosti. Savršeno za početnike!',
                keyWords: [
                    { word: 'spreman', root: 'spreman', pos: 'pridev', caseTag: 'Nominativ jednine (muški rod)', trans: 'ready / prepared' },
                    { word: 'najbolji', root: 'dobar', pos: 'pridev', caseTag: 'Superlativ (naj + bolji)', trans: 'the best' },
                    { word: 'posao', root: 'posao', pos: 'imenica', caseTag: 'Akuzativ za neživo', trans: 'job / work' },
                    { word: 'svetu', root: 'svet', pos: 'imenica', caseTag: 'Lokativ s predlogom NA', trans: 'world' }
                ]
            },
            {
                id: 'reel_meda_padington',
                title: 'Meda Padington',
                subtitle: 'Kulturni bonton i lepo ponašanje',
                category: 'cartoons',
                categoryLabel: '🧸 Sinhronizacija',
                ytId: 'P76gLIKntAc', // Dizni crtani filmovi sinhronizovano
                start: 0,
                duration: 21,
                poster: 'https://img.youtube.com/vi/P76gLIKntAc/hqdefault.jpg',
                author: 'Srpska sinhronizacija',
                subSrLat: 'Dobar dan, gospodine. Da li biste želeli jedan ukusan sendvič od marmelade?',
                subSrCyr: 'Добар дан, господине. Да ли бисте желели један укусан сендвич од мармеладе?',
                subEn: 'Good day, sir. Would you like a delicious marmalade sandwich?',
                culturalNote: 'Odličan primer učtivog obraćanja na srpskom jeziku (potencijal za želje: "Da li biste želeli" + Vokativ "gospodine").',
                keyWords: [
                    { word: 'gospodine', root: 'gospodin', pos: 'imenica', caseTag: 'Vokativ (učtivo)', trans: 'sir / mister' },
                    { word: 'ukusan', root: 'ukusan', pos: 'pridev', caseTag: 'Nominativ / Akuzativ', trans: 'tasty / delicious' },
                    { word: 'marmelade', root: 'marmelada', pos: 'imenica', caseTag: 'Genitiv s predlogom OD', trans: 'marmalade / jam' }
                ]
            },
            {
                id: 'reel_kralj_lavova',
                title: 'Kralj Lavova — Hakuna Matata',
                subtitle: 'Domaća muzička sinhronizacija',
                category: 'cartoons',
                categoryLabel: '🧸 Sinhronizacija',
                ytId: 'If6z5ax6HOA', // The Lion King - Hakuna Matata (Serbian)
                start: 10,
                duration: 24,
                poster: 'https://img.youtube.com/vi/If6z5ax6HOA/hqdefault.jpg',
                author: 'Disney Srbija',
                subSrLat: 'Hakuna Matata znači: bez briga i bez problema do kraja života!',
                subSrCyr: 'Хакуна Матата значи: без брига и без проблема до краја живота!',
                subEn: 'Hakuna Matata means: no worries and no problems for the rest of your life!',
                culturalNote: 'Predlog "bez" uvek zahteva Genitiv (bez briga, bez problema). Odlična vežba za pamćenje pravila genitiva bez muke.',
                keyWords: [
                    { word: 'briga', root: 'briga', pos: 'imenica', caseTag: 'Genitiv množine (posle bez)', trans: 'worries' },
                    { word: 'problema', root: 'problem', pos: 'imenica', caseTag: 'Genitiv množine (posle bez)', trans: 'problems' },
                    { word: 'kraja', root: 'kraj', pos: 'imenica', caseTag: 'Genitiv jednine (posle do)', trans: 'end' },
                    { word: 'života', root: 'život', pos: 'imenica', caseTag: 'Genitiv pripadnosti', trans: 'life' }
                ]
            },
            {
                id: 'reel_beogradski_kafic',
                title: 'Naručivanje u Kafiću',
                subtitle: 'Svakodnevni govor u Beogradu',
                category: 'street',
                categoryLabel: '☕ Ulica & Sleng',
                ytId: 'gZKmCxuwWQ4', // Learn Serbian - Dining Out in Cafe & Restaurant
                start: 0,
                duration: 18,
                poster: 'https://img.youtube.com/vi/gZKmCxuwWQ4/hqdefault.jpg',
                author: 'SerboLingo Real-Life Dialogue',
                subSrLat: 'Daj mi, molim te, jednu produženu s toplim mlekom i čašu kisele vode.',
                subSrCyr: 'Дај ми, молим те, једну продужену с топлим млеком и чашу киселе воде.',
                subEn: 'Give me, please, an extended espresso with warm milk and a glass of sparkling water.',
                culturalNote: '"Produžena s mlekom" je najčešći način naručivanja kafe u Srbiji. "Kisela voda" je mineralna gazirana voda.',
                keyWords: [
                    { word: 'produženu', root: 'produžena kafa', pos: 'pridev/imenica', caseTag: 'Akuzativ', trans: 'extended espresso' },
                    { word: 'toplim', root: 'topao', pos: 'pridev', caseTag: 'Instrumental s predlogom S', trans: 'warm' },
                    { word: 'mlekom', root: 'mleko', pos: 'imenica', caseTag: 'Instrumental jednine', trans: 'milk' },
                    { word: 'čašu', root: 'čaša', pos: 'imenica', caseTag: 'Akuzativ', trans: 'glass' },
                    { word: 'kisele', root: 'kiseo', pos: 'pridev', caseTag: 'Genitiv (količinski)', trans: 'sparkling / sour' }
                ]
            },
            {
                id: 'reel_balkanski_taksista',
                title: 'Balkanski Taksista',
                subtitle: 'Gradska gužva i razgovor',
                category: 'street',
                categoryLabel: '🚕 Ulica & Sleng',
                ytId: 'rq7gtbA2Thg', // Unlock your Serbian - Real Life Dialogue
                start: 0,
                duration: 22,
                poster: 'https://img.youtube.com/vi/rq7gtbA2Thg/hqdefault.jpg',
                author: 'Beogradska Priča',
                subSrLat: 'Gde ćemo, šefe? Danas je neviđena gužva preko mosta Gazela!',
                subSrCyr: 'Где ћемо, шефе? Данас је невиђена гужва преко моста Газела!',
                subEn: 'Where are we heading, boss? Today there is unprecedented traffic across the Gazela bridge!',
                culturalNote: 'Taksisti u Beogradu često koriste reč "šefe" ili "majstore". Gazela je najprometniji most na reci Savi.',
                keyWords: [
                    { word: 'šefe', root: 'šef', pos: 'imenica', caseTag: 'Vokativ', trans: 'boss / chief' },
                    { word: 'neviđena', root: 'neviđen', pos: 'pridev', caseTag: 'Nominativ (ženski rod)', trans: 'unprecedented / unseen' },
                    { word: 'gužva', root: 'gužva', pos: 'imenica', caseTag: 'Nominativ', trans: 'crowd / traffic jam' },
                    { word: 'mosta', root: 'most', pos: 'imenica', caseTag: 'Genitiv posle preko', trans: 'bridge' }
                ]
            },
            {
                id: 'reel_zelena_pijaca',
                title: 'Kupovina na Pijaci',
                subtitle: 'Kalenić pijaca u Beogradu',
                category: 'street',
                categoryLabel: '🍓 Ulica & Sleng',
                ytId: '9AaD9jwGlH8', // Kalenic Pijaca Vracar Beograd
                start: 0,
                duration: 20,
                poster: 'https://img.youtube.com/vi/9AaD9jwGlH8/hqdefault.jpg',
                author: 'Pijačni Razgovor',
                subSrLat: 'Domaćine, koliko su ti ove sveže domaće jagode? Izmeri mi kilo i po!',
                subSrCyr: 'Домаћине, колико су ти ове свеже домаће јагоде? Измери ми кило и по!',
                subEn: 'Good host, how much are these fresh homegrown strawberries? Weigh me a kilo and a half!',
                culturalNote: 'Na balkanskim zelenim pijacama prodavcima se ljubazno obraća sa "domaćine" ili "komšija". Cenkanje je uvek prijateljsko.',
                keyWords: [
                    { word: 'domaćine', root: 'domaćin', pos: 'imenica', caseTag: 'Vokativ', trans: 'host / master of house' },
                    { word: 'sveže', root: 'svež', pos: 'pridev', caseTag: 'Nominativ množine', trans: 'fresh' },
                    { word: 'jagode', root: 'jagoda', pos: 'imenica', caseTag: 'Nominativ množine', trans: 'strawberries' },
                    { word: 'izmeri', root: 'izmeriti', pos: 'glagol', caseTag: 'Imperativ (naredba)', trans: 'weigh / measure' }
                ]
            },
            {
                id: 'reel_guca_trubaci',
                title: 'Sabor Trubača u Guči',
                subtitle: 'Muzika, ritam i tradicija',
                category: 'culture',
                categoryLabel: '🎺 Kultura & Slavlje',
                ytId: 'EMAr98ozug0', // Dragacevski sabor u Guci - RTS Koncerti
                start: 0,
                duration: 24,
                poster: 'https://img.youtube.com/vi/EMAr98ozug0/hqdefault.jpg',
                author: 'Dragačevski Sabor',
                subSrLat: 'Kad truba zasvira u Guči, celo selo zaigra u kolu do zore!',
                subSrCyr: 'Кад труба засвира у Гучи, цело село заигра у колу до зоре!',
                subEn: 'When the trumpet plays in Guča, the entire village dances in the circle until dawn!',
                culturalNote: 'Kolo je tradicionalna narodna igra u krugu, a Guča je svetski poznat festival trube koji se održava svakog avgusta u Dragačevu.',
                keyWords: [
                    { word: 'truba', root: 'truba', pos: 'imenica', caseTag: 'Nominativ (subjekat)', trans: 'trumpet' },
                    { word: 'zasvira', root: 'zasvirati', pos: 'glagol', caseTag: 'Prezent (treće lice)', trans: 'starts playing' },
                    { word: 'kolu', root: 'kolo', pos: 'imenica', caseTag: 'Lokativ s predlogom U', trans: 'folk circle dance' },
                    { word: 'zore', root: 'zora', pos: 'imenica', caseTag: 'Genitiv posle predloga DO', trans: 'dawn' }
                ]
            },
            {
                id: 'reel_balkanski_dorucak',
                title: 'Balkanski Doručak',
                subtitle: 'Zlatni standard: Burek i Jogurt',
                category: 'culture',
                categoryLabel: '🥧 Kultura & Hrana',
                ytId: 'xS-lEnNez1I', // Burek sa sirom kao iz pekare
                start: 0,
                duration: 19,
                poster: 'https://img.youtube.com/vi/xS-lEnNez1I/hqdefault.jpg',
                author: 'Balkanski Gurman',
                subSrLat: 'Vruć burek sa sirom i hladan gusti jogurt — to je jedini pravi lek!',
                subSrCyr: 'Врућ бурек са сиром и хладан густи јогурт — то је једини прави лек!',
                subEn: 'Hot cheese burek and cold thick yogurt — that is the only true medicine!',
                culturalNote: 'Burek sa sirom ili mesom i čaša jogurta je neprevaziđeni doručak na celom Balkanu. Jede se rukama iz masnog papira.',
                keyWords: [
                    { word: 'vruć', root: 'vruć', pos: 'pridev', caseTag: 'Nominativ (muški rod)', trans: 'hot' },
                    { word: 'burek', root: 'burek', pos: 'imenica', caseTag: 'Nominativ', trans: 'burek (flaky pastry)' },
                    { word: 'sirom', root: 'sir', pos: 'imenica', caseTag: 'Instrumental posle predloga SA', trans: 'cheese' },
                    { word: 'jogurt', root: 'jogurt', pos: 'imenica', caseTag: 'Nominativ', trans: 'yogurt' },
                    { word: 'lek', root: 'lek', pos: 'imenica', caseTag: 'Nominativ (predikat)', trans: 'cure / medicine' }
                ]
            }
        ],

        // --- Active State ---
        currentIndex: 0,
        activeCategory: 'all',
        activeScript: 'sr_lat', // 'sr_lat' | 'sr_cyr'
        isPlaying: true,
        playbackSpeed: 1.0,
        completedCount: 0,

        // --- Local Storage Management ---
        getReelsData: function () {
            try {
                const raw = localStorage.getItem(this.STORAGE_KEY);
                if (raw) return JSON.parse(raw);
            } catch (e) {
                console.error('[SerboReels] Error reading state:', e);
            }
            return {
                likedClipIds: [],
                savedWordIds: [],
                watchedClipIds: [],
                totalReelsWatched: 0
            };
        },

        saveReelsData: function (data) {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('[SerboReels] Error saving state:', e);
            }
        },

        // --- Open & Close Feed Modal ---
        openFeed: function (startClipId) {
            const modal = document.getElementById('serbo-reels-modal');
            if (!modal) return;

            const filtered = this.getFilteredClips();
            if (startClipId) {
                const idx = filtered.findIndex(c => c.id === startClipId);
                if (idx !== -1) this.currentIndex = idx;
            } else {
                this.currentIndex = 0;
            }

            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');

            this.renderReel();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeFeed: function () {
            const modal = document.getElementById('serbo-reels-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');

            // Stop video
            const videoContainer = document.getElementById('reels-player-frame');
            if (videoContainer) videoContainer.innerHTML = '';

            this.closeWordInspector();
        },

        getFilteredClips: function () {
            if (this.activeCategory === 'all') return this.CLIPS;
            return this.CLIPS.filter(c => c.category === this.activeCategory);
        },

        filterCategory: function (cat) {
            this.activeCategory = cat;
            this.currentIndex = 0;

            // Update category button pills
            const buttons = document.querySelectorAll('.reels-cat-pill');
            buttons.forEach(btn => {
                const isSelected = btn.getAttribute('data-cat') === cat;
                if (isSelected) {
                    btn.className = 'reels-cat-pill px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-pink-500 text-white shadow-md active:scale-95 transition-all shrink-0';
                } else {
                    btn.className = 'reels-cat-pill px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all shrink-0';
                }
            });

            this.renderReel();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- Render Current Reel ---
        renderReel: function () {
            const clips = this.getFilteredClips();
            if (clips.length === 0) return;

            if (this.currentIndex >= clips.length) this.currentIndex = 0;
            if (this.currentIndex < 0) this.currentIndex = clips.length - 1;

            const clip = clips[this.currentIndex];
            const data = this.getReelsData();
            const isLiked = data.likedClipIds.includes(clip.id);

            // 1. Counter & Badge
            const counterEl = document.getElementById('reels-clip-counter');
            const catBadgeEl = document.getElementById('reels-current-cat');
            const titleEl = document.getElementById('reels-clip-title');
            const authorEl = document.getElementById('reels-clip-author');

            if (counterEl) counterEl.textContent = `${this.currentIndex + 1} / ${clips.length}`;
            if (catBadgeEl) catBadgeEl.textContent = clip.categoryLabel;
            if (titleEl) titleEl.textContent = clip.title;
            if (authorEl) authorEl.textContent = clip.author;

            // Direct external YouTube button
            const ytBtn = document.getElementById('reels-yt-external-btn');
            if (ytBtn) {
                ytBtn.href = `https://www.youtube.com/watch?v=${clip.ytId}`;
            }

            // 2. Video Player Frame
            const frameContainer = document.getElementById('reels-player-frame');
            if (frameContainer) {
                const originParam = (window.location.protocol.startsWith('http') && window.location.origin && window.location.origin !== 'null') 
                    ? `&origin=${encodeURIComponent(window.location.origin)}` 
                    : '';

                // Responsive embed using official YouTube embed with strict referrer policy
                frameContainer.innerHTML = `
                <div class="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                    <iframe 
                        id="reels-yt-iframe"
                        class="w-full h-full object-cover scale-[1.03]"
                        src="https://www.youtube.com/embed/${clip.ytId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=0&loop=1&playlist=${clip.ytId}&start=${clip.start || 0}&playsinline=1${originParam}"
                        title="${clip.title}"
                        frameborder="0"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen>
                    </iframe>
                    <!-- Invisible tap overlay to toggle play/pause -->
                    <div onclick="SerboReels.togglePlayPause()" class="absolute inset-0 z-10 cursor-pointer"></div>
                    <div id="reels-play-indicator" class="hidden absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none transition-opacity">
                        <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl text-white">▶</div>
                    </div>
                </div>`;
            }

            // 3. Subtitles with Clickable Grammar Words
            const subContainer = document.getElementById('reels-subtitles-box');
            if (subContainer) {
                const subText = this.activeScript === 'sr_cyr' ? clip.subSrCyr : clip.subSrLat;
                const tokenizedHtml = this.tokenizeSubtitle(subText);

                subContainer.innerHTML = `
                <div class="space-y-1.5 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 shadow-xl max-w-sm mx-auto">
                    <!-- Serbian Interactive Subtitle -->
                    <div class="text-sm md:text-base font-black text-white leading-relaxed tracking-wide flex flex-wrap gap-1 items-center justify-center">
                        ${tokenizedHtml}
                    </div>
                    <!-- English Translation Subtitle -->
                    <div class="text-[11px] md:text-xs font-bold text-yellow-300/90 text-center border-t border-slate-800/80 pt-1.5 leading-snug">
                        ${clip.subEn}
                    </div>
                </div>`;
            }

            // 4. Like Button State
            const likeBtn = document.getElementById('reels-like-btn');
            const likeIcon = document.getElementById('reels-like-icon');
            if (likeIcon) {
                likeIcon.textContent = isLiked ? '❤️' : '🤍';
                likeIcon.className = isLiked ? 'text-2xl text-rose-500 animate-pulse' : 'text-2xl text-white';
            }

            // 5. Track watch habit loop
            if (!data.watchedClipIds.includes(clip.id)) {
                data.watchedClipIds.push(clip.id);
                data.totalReelsWatched = (data.totalReelsWatched || 0) + 1;
                this.saveReelsData(data);
                this.completedCount++;

                // Award +15 XP every 3 completed clips
                if (this.completedCount % 3 === 0) {
                    this.awardWatchXp();
                }
            }

            this.closeWordInspector();
        },

        // --- Subtitle Tokenizer: Wraps each word into an interactive tap target ---
        tokenizeSubtitle: function (text) {
            if (!text) return '';
            // Tokenize by spaces and punctuation while keeping punctuation attached
            return text.split(/\s+/).map(token => {
                const cleanWord = token.replace(/^[.,?!":;()[\]{}«»„“"'\-*]+|[.,?!":;()[\]{}«»„“"'\-*]+$/g, '');
                if (!cleanWord) return token;

                const escapedClean = cleanWord.replace(/'/g, "\\'");
                return `<button onclick="SerboReels.inspectWord('${escapedClean}', this)" class="inline-block px-1 py-0.5 rounded-lg hover:bg-pink-500/30 active:bg-pink-500/50 hover:text-pink-300 transition-colors cursor-pointer border-b border-transparent hover:border-pink-400 font-black">${token}</button>`;
            }).join(' ');
        },

        // --- Next & Previous Navigation ---
        nextReel: function () {
            const clips = this.getFilteredClips();
            if (clips.length <= 1) return;
            this.currentIndex = (this.currentIndex + 1) % clips.length;
            this.renderReel();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        prevReel: function () {
            const clips = this.getFilteredClips();
            if (clips.length <= 1) return;
            this.currentIndex = (this.currentIndex - 1 + clips.length) % clips.length;
            this.renderReel();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- Play/Pause Toggle ---
        togglePlayPause: function () {
            const iframe = document.getElementById('reels-yt-iframe');
            const indicator = document.getElementById('reels-play-indicator');
            if (!iframe) return;

            this.isPlaying = !this.isPlaying;

            // Send postMessage to YouTube IFrame API
            const action = this.isPlaying ? 'playVideo' : 'pauseVideo';
            try {
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: action, args: [] }), '*');
            } catch (e) {
                console.log('IFrame message error:', e);
            }

            if (indicator) {
                if (!this.isPlaying) {
                    indicator.classList.remove('hidden');
                } else {
                    indicator.classList.add('hidden');
                }
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- Script Toggle (Latinica ↔ Ćirilica) ---
        toggleScript: function () {
            this.activeScript = this.activeScript === 'sr_lat' ? 'sr_cyr' : 'sr_lat';
            const btn = document.getElementById('reels-script-toggle-btn');
            if (btn) {
                btn.textContent = this.activeScript === 'sr_lat' ? 'ЋИР' : 'LAT';
                btn.title = this.activeScript === 'sr_lat' ? 'Prebaci na ćirilicu' : 'Prebaci na latinicu';
            }

            // Re-render subtitle without reloading video
            const clips = this.getFilteredClips();
            const clip = clips[this.currentIndex];
            const subContainer = document.getElementById('reels-subtitles-box');
            if (clip && subContainer) {
                const subText = this.activeScript === 'sr_cyr' ? clip.subSrCyr : clip.subSrLat;
                const tokenizedHtml = this.tokenizeSubtitle(subText);

                subContainer.innerHTML = `
                <div class="space-y-1.5 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/60 shadow-xl max-w-sm mx-auto">
                    <div class="text-sm md:text-base font-black text-white leading-relaxed tracking-wide flex flex-wrap gap-1 items-center justify-center">
                        ${tokenizedHtml}
                    </div>
                    <div class="text-[11px] md:text-xs font-bold text-yellow-300/90 text-center border-t border-slate-800/80 pt-1.5 leading-snug">
                        ${clip.subEn}
                    </div>
                </div>`;
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- 1-Tap Word Inspector Drawer (Tap-to-Translate) ---
        inspectWord: function (rawWord, targetEl) {
            // Pause video during inspection
            if (this.isPlaying) this.togglePlayPause();

            const clips = this.getFilteredClips();
            const clip = clips[this.currentIndex];

            // 1. Check if word is in curated clip keywords
            let info = null;
            if (clip && clip.keyWords) {
                const lower = rawWord.toLowerCase();
                info = clip.keyWords.find(k => k.word.toLowerCase() === lower || k.root.toLowerCase() === lower);
            }

            // 2. If not, analyze using GrammarEngine
            if (!info && window.GrammarEngine && window.GrammarEngine.analyzeWord) {
                const gInfo = window.GrammarEngine.analyzeWord(rawWord);
                if (gInfo) {
                    info = {
                        word: gInfo.originalWord || rawWord,
                        root: gInfo.root || rawWord,
                        pos: gInfo.pos || 'reč',
                        caseTag: gInfo.caseTag || 'Osnovni oblik',
                        trans: gInfo.translation || 'Prevod dostupan u rečniku',
                        explanation: gInfo.explanation || null
                    };
                }
            }

            // Fallback definition if unknown
            if (!info) {
                info = {
                    word: rawWord,
                    root: rawWord,
                    pos: 'reč',
                    caseTag: 'Padežna analiza',
                    trans: 'Srpska reč u kontekstu rečenice'
                };
            }

            const sheetEl = document.getElementById('reels-word-sheet');
            const wordEl = document.getElementById('reels-sheet-word');
            const rootEl = document.getElementById('reels-sheet-root');
            const tagEl = document.getElementById('reels-sheet-casetag');
            const transEl = document.getElementById('reels-sheet-trans');
            const saveBtn = document.getElementById('reels-sheet-save-btn');

            if (wordEl) wordEl.textContent = info.word;
            if (rootEl) rootEl.textContent = `Osnovni oblik (Lemma): ${info.root}`;
            if (tagEl) tagEl.textContent = info.caseTag;
            if (transEl) transEl.textContent = info.trans;

            if (saveBtn) {
                saveBtn.onclick = () => {
                    this.saveWordToSRS(info.root, info.trans, clip.subSrLat);
                };
            }

            if (sheetEl) {
                sheetEl.classList.remove('translate-y-full');
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeWordInspector: function () {
            const sheetEl = document.getElementById('reels-word-sheet');
            if (sheetEl) {
                sheetEl.classList.add('translate-y-full');
            }
        },

        // --- Save Word to Tinder-Style SRS Flashcard Deck ---
        saveWordToSRS: function (rootWord, translation, context) {
            const appState = window.appState || window.state;
            if (!appState) return;

            // Add to mistake/learning log and starred list
            if (!appState.starredWords) appState.starredWords = [];
            if (!appState.starredWords.includes(rootWord)) {
                appState.starredWords.push(rootWord);
            }

            if (window.SrsEngine && window.SrsEngine.addWord) {
                window.SrsEngine.addWord(rootWord, translation, context);
            } else if (window.app && window.app.toggleFlashcard) {
                window.app.toggleFlashcard(rootWord);
            }

            // Award +10 XP for expanding vocabulary
            if (window.app && window.app.addXP) {
                window.app.addXP(10);
            } else if (appState.xp) {
                appState.xp += 10;
                if (window.app && window.app.updateStatsUI) window.app.updateStatsUI();
            }

            if (window.app && window.app.showToast) {
                window.app.showToast(`⭐ "${rootWord}" dodato u Flashcards! (+10 XP)`, 'success');
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');

            this.closeWordInspector();
        },

        // --- Like Reel ---
        likeCurrentReel: function () {
            const clips = this.getFilteredClips();
            const clip = clips[this.currentIndex];
            if (!clip) return;

            const data = this.getReelsData();
            const idx = data.likedClipIds.indexOf(clip.id);
            const likeIcon = document.getElementById('reels-like-icon');

            if (idx === -1) {
                data.likedClipIds.push(clip.id);
                if (likeIcon) {
                    likeIcon.textContent = '❤️';
                    likeIcon.className = 'text-2xl text-rose-500 scale-125 transition-transform';
                    setTimeout(() => { likeIcon.className = 'text-2xl text-rose-500'; }, 300);
                }
                if (window.TouchHaptics) TouchHaptics.vibrate('tap');
            } else {
                data.likedClipIds.splice(idx, 1);
                if (likeIcon) {
                    likeIcon.textContent = '🤍';
                    likeIcon.className = 'text-2xl text-white';
                }
            }
            this.saveReelsData(data);
        },

        // --- Pronunciation Audio (TTS) ---
        pronounceCurrentSentence: function () {
            const clips = this.getFilteredClips();
            const clip = clips[this.currentIndex];
            if (!clip) return;

            const text = clip.subSrLat;
            if (window.app && window.app.speak) {
                window.app.speak(text, 'sr');
            } else if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'sr-RS';
                window.speechSynthesis.speak(u);
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- Habit Loop & Milestone XP Award ---
        awardWatchXp: function () {
            const appState = window.appState || window.state;
            if (appState) {
                appState.xp = (appState.xp || 0) + 15;
                appState.dailyXP = (appState.dailyXP || 0) + 15;
                if (window.app && window.app.saveStats) window.app.saveStats();
                if (window.app && window.app.updateStatsUI) window.app.updateStatsUI();
            }

            if (window.app && window.app.showToast) {
                window.app.showToast('🎉 +15 XP! Odgledana 3 SerboReels klipa zaredom!', 'success');
            }
            if (window.app && window.app.fireConfetti) window.app.fireConfetti();
            if (window.TouchHaptics) TouchHaptics.vibrate('celebrate');
        }
    };

    window.SerboReels = SerboReels;
})();
