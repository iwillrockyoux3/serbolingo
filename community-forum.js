// [SHIELD_DAEMON: VALIDATED]
// community-forum.js — Priority 47: Global Community Forum & Discussion Hub ("Forum Zajednice")
// Pure vanilla JS, zero dependencies, offline-first localStorage, UTF-8 armored
// SerboLingo Technical Constitution v3.0 compliant

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════
    // §1  STORAGE KEYS & CONSTANTS
    // ═══════════════════════════════════════════════════════════
    const STORAGE_THREADS    = 'serbolingo_forum_threads_v1';
    const STORAGE_UPVOTES    = 'serbolingo_forum_user_upvotes';
    const STORAGE_FLAGS      = 'serbolingo_forum_flagged_posts';
    const STORAGE_REP        = 'serbolingo_forum_user_reputation';

    const CATEGORIES = [
        { id: 'all',     icon: '💬', label: 'Sve Teme' },
        { id: 'grammar', icon: '📚', label: 'Gramatika & Padeži' },
        { id: 'culture', icon: '🎬', label: 'Kultura & Film' },
        { id: 'buddy',   icon: '🤝', label: 'Partner za Učenje' },
        { id: 'ideas',   icon: '💡', label: 'Predlozi & Ankete' }
    ];

    // ═══════════════════════════════════════════════════════════
    // §2  AUTHENTIC SEED THREADS (Pre-Populated Knowledge Base)
    // ═══════════════════════════════════════════════════════════
    const SEED_THREADS = [
        {
            id: 'th_dativ_lokativ',
            category: 'grammar',
            categoryLabel: 'Gramatika & Padeži',
            categoryIcon: '📚',
            title: 'Kako najlakše razlikovati Dativ i Lokativ u praksi?',
            content: 'Zdravo svima! Učim padeže već nekoliko nedelja i stalno se zbunjujem između Dativa i Lokativa jer imaju iste nastavke za imenice. Znam da Dativ označava pravac kretanja, a Lokativ mirovanje, ali ima li neko jednostavno pravilo ili mnemotehniku?',
            author: 'Sarah_Polyglot',
            authorAvatar: '👩',
            authorBadge: 'Učenik A2',
            tags: ['#padezi', '#dativ', '#lokativ', '#saveti'],
            upvotes: 18,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            replies: [
                {
                    id: 'rep_dl_1',
                    author: 'Marko_BG',
                    authorAvatar: '👨‍🏫',
                    authorBadge: 'Domaći Govornik',
                    content: 'Najlakše zlatno pravilo je: **Lokativ NIKADA ne ide bez predloga!** (Uvek su tu: o, u, na, po, pri). Ako nema predloga, ili ako je pitanje "Kome? Čemu?" i radnja ide prema nekome (npr. "Dajem knjigu Marku"), to je 100% Dativ. Ako je "Gde si?" (npr. "U školi", "Na stolu"), to je Lokativ sa predlogom mirovanja.',
                    upvotes: 12,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 1.8).toISOString()
                },
                {
                    id: 'rep_dl_2',
                    author: 'Elena_Ru',
                    authorAvatar: '👱‍♀️',
                    authorBadge: 'Aktivni Član',
                    content: 'Meni je pomogla formula: Dativ = Kuda ideš? (Idem ka kući), Lokativ = Gde se nalaziš? (Nalazim se u kući). Super savet Marko!',
                    upvotes: 5,
                    isAccepted: false,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 1.2).toISOString()
                }
            ]
        },
        {
            id: 'th_domaci_filmovi',
            category: 'culture',
            categoryLabel: 'Kultura & Film',
            categoryIcon: '🎬',
            title: 'Koji su najbolji domaći filmovi za učenje svakodnevnog slenga?',
            content: 'Gledao sam isečke u SerboReels sekciji i film "Ko to tamo peva" me je oduševio! Koji su još kultni filmovi sa dobrim humorom i realnim govorom koje preporučujete za gledanje za vikend?',
            author: 'David_London',
            authorAvatar: '🧔',
            authorBadge: 'Film Lover',
            tags: ['#filmovi', '#sleng', '#kultura', '#preporuke'],
            upvotes: 24,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            replies: [
                {
                    id: 'rep_df_1',
                    author: 'Nikola_Zemun',
                    authorAvatar: '😎',
                    authorBadge: 'Balkanski Šef',
                    content: 'Obavezna lektira: \n1. **"Maratonci trče počasni krug"** — apsolutni vrhunac crnog humora.\n2. **"Munje!"** — beogradski urbani sleng iz dvehiljaditih.\n3. **"Lepa sela lepo gore"** — teška drama, ali kultne replike.\n4. **"Crna mačka, beli mačor"** (Kusturica) — fantastična energija i muzika!',
                    upvotes: 16,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 2.5).toISOString()
                }
            ]
        },
        {
            id: 'th_svoj_moj',
            category: 'grammar',
            categoryLabel: 'Gramatika & Padeži',
            categoryIcon: '📚',
            title: 'Kada se koristi "svoj", a kada "moj/tvoj/njegov"?',
            content: 'Često čujem rečenice poput "On voli svoju ženu" umesto "On voli njegovu ženu". Zašto je velika greška reći "njegovu ženu"? Može li neko da pojasni pravilo o povratno-prisvojnoj zamenici?',
            author: 'Lucas_SP',
            authorAvatar: '👨',
            authorBadge: 'Grammar Nerd',
            tags: ['#zamenice', '#svoj', '#sintaksa'],
            upvotes: 31,
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
            replies: [
                {
                    id: 'rep_sm_1',
                    author: 'Milica_NoviSad',
                    authorAvatar: '👩‍🏫',
                    authorBadge: 'Gramatički Guru',
                    content: 'Hahaha, odlično pitanje! Ako kažeš "On voli njegovu ženu", to znači da on voli ženu nekog DRUGOG čoveka! 😂\n\nZamenica **"svoj"** se koristi kada subjekat poseduje objekat (vršilac radnje poseduje to o čemu se priča). Dakle:\n• Ja volim **svoju** majku (ne moju).\n• On čita **svoju** knjigu (ne njegovu).\n• Pravilo: Kad subjekat označava vlasnika, uvek ide SVOJ!',
                    upvotes: 27,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 3.7).toISOString()
                }
            ]
        },
        {
            id: 'th_study_buddy_a2',
            category: 'buddy',
            categoryLabel: 'Partner za Učenje',
            categoryIcon: '🤝',
            title: 'Tražim partnera za 15-minutnu svakodnevnu konverzaciju (A2 nivo)',
            content: 'Ćao svima! Učim srpski već 4 meseca i voleo bih da vežbam jednostavne razgovore (naručivanje u restoranu, prepričavanje dana, hobiji). Moj maternji je engleski, pa možemo raditi 50/50 razmenu (engleski ↔ srpski). Dostupan sam uveče po srednjoevropskom vremenu!',
            author: 'Alex_USA',
            authorAvatar: '🤠',
            authorBadge: 'Language Partner',
            tags: ['#tandem', '#engleski', '#razmena', '#a2'],
            upvotes: 14,
            createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
            replies: [
                {
                    id: 'rep_sb_1',
                    author: 'Stefan_Kragujevac',
                    authorAvatar: '🙋‍♂️',
                    authorBadge: 'Aktivni Član',
                    content: 'Ćao Alex! Ja spremam IELTS ispit iz engleskog i rado bih vežbao sa tobom. Pustiću ti poruku kad se pokrene Omegle Language Hub (Priority 43) ili možemo preko Discorda!',
                    upvotes: 6,
                    isAccepted: false,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 0.8).toISOString()
                }
            ]
        },
        {
            id: 'th_bogu_iza_nogu',
            category: 'culture',
            categoryLabel: 'Kultura & Film',
            categoryIcon: '🎬',
            title: 'Šta zapravo znači izraz "Bogu iza nogu" i odakle potiče?',
            content: 'Učio sam narodne fraze u Uličnom srpskom i naišao na "Bogu iza nogu". Znam da znači "veoma daleko", ali ima li neka anegdota ili narodno verovanje odakle potiče ovaj smešan izraz?',
            author: 'Chloe_Paris',
            authorAvatar: '👩‍🎨',
            authorBadge: 'Slang Hunter',
            tags: ['#izreke', '#etimologija', '#sleng'],
            upvotes: 19,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            replies: [
                {
                    id: 'rep_bn_1',
                    author: 'Deda_Vule',
                    authorAvatar: '👴',
                    authorBadge: 'Balkanski Domaćin',
                    content: 'Stari narodni izraz! Zamišlja se da je Bog na nebesima i sve vidi ispred sebe. Mesto koje je "Bogu iza nogu" je toliko zabačeno i zatureno da čak ni Bog, kad sedi na nebeskom prestolu, ne može da ga vidi jer mu je iza peta! Koristi se za sela bez puta, zabačene vikendice i slično.',
                    upvotes: 18,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 4.6).toISOString()
                }
            ]
        },
        {
            id: 'th_glagolski_vid',
            category: 'grammar',
            categoryLabel: 'Gramatika & Padeži',
            categoryIcon: '📚',
            title: 'Glagolski vid: Kako prepoznati svršeni i nesvršeni glagol?',
            content: 'U čemu je ključna razlika između parova kao što su: pisati / napisati, gledati / pogledati, učiti / naučiti? Da li uvek prefiks pravi svršeni glagol?',
            author: 'Hans_Munich',
            authorAvatar: '👨‍💼',
            authorBadge: 'Grammar Nerd',
            tags: ['#glagoli', '#glagolskivid', '#prefiksi'],
            upvotes: 22,
            createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
            replies: [
                {
                    id: 'rep_gv_1',
                    author: 'Milica_NoviSad',
                    authorAvatar: '👩‍🏫',
                    authorBadge: 'Gramatički Guru',
                    content: 'Prefiksi (na-, po-, o-, do-, iz-) skoro uvek pretvaraju nesvršeni glagol (proces koji traje) u svršeni (radnja je završena ili ima rezultat). \n\nPrimer:\n• "Pisao sam pismo 2 sata" (proces, nesvršeni — ne znamo da li je završeno).\n• "Napisao sam pismo" (rezultat, svršeni — pismo je gotovo i u koverti!).',
                    upvotes: 15,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 5.4).toISOString()
                }
            ]
        },
        {
            id: 'th_kafana_bonton',
            category: 'culture',
            categoryLabel: 'Kultura & Film',
            categoryIcon: '🎬',
            title: 'Kafanski bonton: Šta naručiti i koja su nepisana pravila?',
            content: 'Putujem u Beograd sledećeg meseca i želim da doživim pravu starogradsku kafanu u Skadarliji. Koja pića i meze su obavezni, i kako se pravilno nazdravlja rakijom?',
            author: 'Matteo_Rome',
            authorAvatar: '🍕',
            authorBadge: 'Traveler',
            tags: ['#kafana', '#skadarlija', '#rakija', '#bonton'],
            upvotes: 35,
            createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
            replies: [
                {
                    id: 'rep_kb_1',
                    author: 'Nikola_Zemun',
                    authorAvatar: '😎',
                    authorBadge: 'Balkanski Šef',
                    content: 'Tri sveta pravila kafane:\n1. **Gledanje u oči dok se kuca čašicama!** Ako ne gledaš sagovornika u oči dok kažeš "Živeli!", smatra se lošim manirima.\n2. **Naručivanje:** Domaća šljivovica ili dunja za početak, a od klope: kajmak, pršuta, vruća lepinja i mešano meso ili ćevapi na ovalu.\n3. **Muzika:** Kad tamburaši priđu stolu, nemoj snimati telefonom — naruči omiljenu pesmu i uživaj u trenutku!',
                    upvotes: 28,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 6.5).toISOString()
                }
            ]
        },
        {
            id: 'th_ideas_spanish',
            category: 'ideas',
            categoryLabel: 'Predlozi & Ankete',
            categoryIcon: '💡',
            title: 'Predlog: Da li možemo dodati španski i nemački jezik u aplikaciju?',
            content: 'Vidim da SerboLingo ima savršen SuperMemo-2 SRS i čak 40 Arcade igrica koji su genijalni. Da li je u planu da se isti ovaj endžin upotrebi i za učenje španskog ili nemačkog jezika za nas sa Balkana?',
            author: 'Bojan_Subotica',
            authorAvatar: '🚀',
            authorBadge: 'Polyglot Hopeful',
            tags: ['#predlog', '#jezici', '#spanski', '#nemacki'],
            upvotes: 42,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            replies: [
                {
                    id: 'rep_is_1',
                    author: 'Antigravity_Team',
                    authorAvatar: '🛡️',
                    authorBadge: 'Lead Architect',
                    content: 'Apsolutno da! U planu je **Priority 48: The Global Polyglot Ecosystem ("Svet Jezika")**. Naš kompletan endžin (SRS rečnik, 40 minigames, SerboReels, Lego Sandbox i Pametne Priče) je već modularan i proširiće se na španski, nemački, francuski i japanski sa Master Concept ID bazom!',
                    upvotes: 33,
                    isAccepted: true,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString()
                }
            ]
        },
        {
            id: 'th_buddy_b1_group',
            category: 'buddy',
            categoryLabel: 'Partner za Učenje',
            categoryIcon: '🤝',
            title: 'B1 Reading & Discussion Club (Nedeljom ujutru)',
            content: 'Organizujemo malu grupu od 4-5 učenika koji su na B1 nivou da zajedno čitamo kratke priče i novinske članke iz SerboLingo Istraži sekcije. Ko je zainteresovan neka ostavi komentar!',
            author: 'Emma_Toronto',
            authorAvatar: '📖',
            authorBadge: 'Bookworm',
            tags: ['#reading', '#b1', '#knjige', '#grupa'],
            upvotes: 11,
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            replies: []
        },
        {
            id: 'th_ideas_darkmode',
            category: 'ideas',
            categoryLabel: 'Predlozi & Ankete',
            categoryIcon: '💡',
            title: 'Anketa: Koja vam je omiljena Arcade minigra u SerboLingo?',
            content: 'Lično obožavam "Padeži Lovac" i "Graditelj Rečenica" sa novim Lego blokovima. Šta vi najviše igrate za brzo sakupljanje XP-a i dragulja?',
            author: 'Igor_Nis',
            authorAvatar: '🎮',
            authorBadge: 'Arcade Master',
            tags: ['#arcade', '#anketa', '#minigames', '#xp'],
            upvotes: 29,
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
            replies: [
                {
                    id: 'rep_id_1',
                    author: 'Sara_Beograd',
                    authorAvatar: '⚡',
                    authorBadge: 'Diamond League',
                    content: 'Sudden Death i Milioner! Kad krene tajmer na Sudden Death adrenalin skoči na 100%, a Milioner je fantastičan jer ima prave džinglove.',
                    upvotes: 14,
                    isAccepted: false,
                    isAI: false,
                    createdAt: new Date(Date.now() - 86400000 * 3.5).toISOString()
                }
            ]
        }
    ];

    // ═══════════════════════════════════════════════════════════
    // §3  UTILITY HELPERS (Escaping, Relative Dates, Storage)
    // ═══════════════════════════════════════════════════════════
    function esc(text) {
        var d = document.createElement('div');
        d.textContent = text || '';
        return d.innerHTML;
    }

    function timeAgo(iso) {
        try {
            var diff = Date.now() - new Date(iso).getTime();
            var mins = Math.floor(diff / 60000);
            if (mins < 1) return 'upravo';
            if (mins < 60) return mins + ' min';
            var hours = Math.floor(mins / 60);
            if (hours < 24) return hours + ' h';
            var days = Math.floor(hours / 24);
            if (days === 1) return 'juče';
            if (days < 7) return days + ' d';
            return new Date(iso).toLocaleDateString('sr-RS', { day: 'numeric', month: 'short' });
        } catch(e) {
            return 'nedavno';
        }
    }

    // ═══════════════════════════════════════════════════════════
    // §4  COMMUNITY FORUM ENGINE OBJECT
    // ═══════════════════════════════════════════════════════════
    window.CommunityForum = {
        _currentCat: 'all',
        _searchQuery: '',
        _activeThreadId: null,

        // ── Initialization & Storage ────────────────────────
        _initStorage: function() {
            var existing = localStorage.getItem(STORAGE_THREADS);
            if (!existing) {
                localStorage.setItem(STORAGE_THREADS, JSON.stringify(SEED_THREADS));
            }
        },

        _getThreads: function() {
            this._initStorage();
            try {
                return JSON.parse(localStorage.getItem(STORAGE_THREADS)) || [];
            } catch(e) {
                return SEED_THREADS;
            }
        },

        _saveThreads: function(threads) {
            try {
                localStorage.setItem(STORAGE_THREADS, JSON.stringify(threads));
            } catch(e) {
                console.error('[CommunityForum] Failed to save threads:', e);
            }
        },

        _getUserUpvotes: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_UPVOTES)) || {};
            } catch(e) {
                return {};
            }
        },

        _saveUserUpvotes: function(upvotes) {
            try {
                localStorage.setItem(STORAGE_UPVOTES, JSON.stringify(upvotes));
            } catch(e) {}
        },

        _getFlagged: function() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_FLAGS)) || [];
            } catch(e) {
                return [];
            }
        },

        _saveFlagged: function(flags) {
            try {
                localStorage.setItem(STORAGE_FLAGS, JSON.stringify(flags));
            } catch(e) {}
        },

        // ── Modal Open / Close ──────────────────────────────
        openForum: function() {
            var modal = document.getElementById('forum-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            this._initStorage();
            this._activeThreadId = null;
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeForum: function() {
            var modal = document.getElementById('forum-modal');
            if (!modal) return;
            modal.classList.add('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ── Filter & Search ─────────────────────────────────
        setCategory: function(catId) {
            this._currentCat = catId;
            this._activeThreadId = null;
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        setSearchQuery: function(query) {
            this._searchQuery = (query || '').toLowerCase().trim();
            this.renderThreadList();
        },

        // ── Navigation between List & Thread Detail ─────────
        openThread: function(threadId) {
            this._activeThreadId = threadId;
            this.renderThreadDetail();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        backToList: function() {
            this._activeThreadId = null;
            this.render();
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        // ═════════════════════════════════════════════════════
        // §5  MAIN RENDER ORCHESTRATION
        // ═════════════════════════════════════════════════════
        render: function() {
            var container = document.getElementById('forum-body-container');
            if (!container) return;

            if (this._activeThreadId) {
                this.renderThreadDetail();
                return;
            }

            var catPills = CATEGORIES.map(function(c) {
                var isActive = window.CommunityForum._currentCat === c.id;
                var activeCls = 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105';
                var inactiveCls = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
                return '<button onclick="CommunityForum.setCategory(\'' + c.id + '\')" ' +
                    'class="px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ' + (isActive ? activeCls : inactiveCls) + '">' +
                    '<span>' + c.icon + '</span> <span>' + c.label + '</span></button>';
            }).join('');

            container.innerHTML =
                '<!-- Header & Controls -->' +
                '<div class="space-y-3 pb-3 border-b border-slate-200 dark:border-slate-800">' +
                    '<div class="flex items-center gap-2">' +
                        '<div class="relative flex-1">' +
                            '<input type="text" id="forum-search-input" value="' + esc(this._searchQuery) + '" ' +
                                'oninput="CommunityForum.setSearchQuery(this.value)" ' +
                                'placeholder="Pretraži teme (npr. #padezi, filmovi)..." ' +
                                'class="w-full py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white font-medium text-xs focus:border-blue-500 outline-none">' +
                            '<span class="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>' +
                        '</div>' +
                        '<button onclick="CommunityForum.openNewThreadModal()" ' +
                            'class="px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5 shrink-0">' +
                            '<span>➕</span> <span>Nova Tema</span>' +
                        '</button>' +
                    '</div>' +
                    '<!-- Categories Scroll Bar -->' +
                    '<div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">' +
                        catPills +
                    '</div>' +
                '</div>' +
                '<!-- Thread Cards Feed -->' +
                '<div id="forum-threads-list" class="space-y-3 pt-3">' +
                '</div>';

            this.renderThreadList();
        },

        renderThreadList: function() {
            var listC = document.getElementById('forum-threads-list');
            if (!listC) return;

            var threads = this._getThreads();
            var flags = this._getFlagged();
            var upvotesMap = this._getUserUpvotes();
            var cat = this._currentCat;
            var q = this._searchQuery;

            var filtered = threads.filter(function(t) {
                if (flags.indexOf(t.id) !== -1) return false;
                if (cat !== 'all' && t.category !== cat) return false;
                if (q) {
                    var matchTitle = (t.title || '').toLowerCase().indexOf(q) !== -1;
                    var matchContent = (t.content || '').toLowerCase().indexOf(q) !== -1;
                    var matchTags = (t.tags || []).some(function(tag) { return tag.toLowerCase().indexOf(q) !== -1; });
                    if (!matchTitle && !matchContent && !matchTags) return false;
                }
                return true;
            });

            if (filtered.length === 0) {
                listC.innerHTML =
                    '<div class="flex flex-col items-center justify-center py-12 text-center space-y-2">' +
                        '<span class="text-4xl">💬</span>' +
                        '<h4 class="font-black text-sm text-slate-700 dark:text-slate-200">Nema pronađenih tema</h4>' +
                        '<p class="text-xs text-slate-400 max-w-xs">Budi prvi koji će pokrenuti diskusiju u ovoj kategoriji!</p>' +
                        '<button onclick="CommunityForum.openNewThreadModal()" class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-transform">➕ Pokreni Temu</button>' +
                    '</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < filtered.length; i++) {
                var t = filtered[i];
                var replyCount = (t.replies || []).length;
                var hasAccepted = (t.replies || []).some(function(r) { return r.isAccepted; });
                var hasAI = (t.replies || []).some(function(r) { return r.isAI; });
                var isUpvoted = !!upvotesMap['th_' + t.id];

                var tagsHtml = (t.tags || []).map(function(tag) {
                    return '<span class="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md">' + esc(tag) + '</span>';
                }).join(' ');

                html +=
                    '<div class="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group space-y-2.5" ' +
                        'onclick="CommunityForum.openThread(\'' + t.id + '\')">' +
                        '<div class="flex items-center justify-between text-[11px]">' +
                            '<div class="flex items-center gap-2">' +
                                '<span class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-sm">' + t.authorAvatar + '</span>' +
                                '<span class="font-black text-slate-700 dark:text-slate-200">' + esc(t.author) + '</span>' +
                                (t.authorBadge ? '<span class="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold">' + esc(t.authorBadge) + '</span>' : '') +
                            '</div>' +
                            '<span class="text-slate-400 text-[10px]">' + timeAgo(t.createdAt) + '</span>' +
                        '</div>' +
                        '<div>' +
                            '<div class="flex items-center gap-1.5 mb-1">' +
                                '<span class="text-xs">' + t.categoryIcon + '</span>' +
                                '<span class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">' + esc(t.categoryLabel) + '</span>' +
                            '</div>' +
                            '<h3 class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors leading-snug">' + esc(t.title) + '</h3>' +
                            '<p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">' + esc(t.content) + '</p>' +
                        '</div>' +
                        (tagsHtml ? '<div class="flex flex-wrap gap-1.5 pt-0.5">' + tagsHtml + '</div>' : '') +
                        '<div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs font-bold">' +
                            '<div class="flex items-center gap-3">' +
                                '<button onclick="event.stopPropagation(); CommunityForum.toggleUpvote(\'thread\', \'' + t.id + '\')" ' +
                                    'class="flex items-center gap-1 px-2.5 py-1 rounded-lg border ' + (isUpvoted ? 'border-amber-400 bg-amber-500/20 text-amber-500 font-black' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500') + ' active:scale-90 transition-all">' +
                                    '<span>▲</span> <span>' + t.upvotes + '</span>' +
                                '</button>' +
                                '<span class="flex items-center gap-1 text-slate-400 text-xs">' +
                                    '<span>💬</span> <span>' + replyCount + '</span>' +
                                '</span>' +
                            '</div>' +
                            '<div class="flex items-center gap-1.5">' +
                                (hasAccepted ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">✓ Rešeno</span>' : '') +
                                (hasAI ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-500/15 text-purple-400 border border-purple-500/30">🤖 AI Odgovor</span>' : '') +
                            '</div>' +
                        '</div>' +
                    '</div>';
            }
            listC.innerHTML = html;
        },

        // ═════════════════════════════════════════════════════
        // §6  THREAD DETAIL & COMMENTS VIEW
        // ═════════════════════════════════════════════════════
        renderThreadDetail: function() {
            var container = document.getElementById('forum-body-container');
            if (!container) return;

            var threads = this._getThreads();
            var targetId = this._activeThreadId;
            var t = null;
            for (var i = 0; i < threads.length; i++) {
                if (threads[i].id === targetId) { t = threads[i]; break; }
            }

            if (!t) {
                this.backToList();
                return;
            }

            var upvotesMap = this._getUserUpvotes();
            var flags = this._getFlagged();
            var isThreadUpvoted = !!upvotesMap['th_' + t.id];

            var tagsHtml = (t.tags || []).map(function(tag) {
                return '<span class="text-[10px] font-bold text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">' + esc(tag) + '</span>';
            }).join(' ');

            // Render comments list
            var replies = t.replies || [];
            var repliesHtml = '';

            if (replies.length === 0) {
                repliesHtml =
                    '<div class="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 text-center space-y-2 border border-slate-200 dark:border-slate-700/60">' +
                        '<span class="text-3xl">💡</span>' +
                        '<p class="text-xs font-bold text-slate-600 dark:text-slate-300">Još uvek nema odgovora na ovu temu.</p>' +
                        '<p class="text-[11px] text-slate-400">Podeli svoje znanje i zaradi +15 XP ili pitaj AI Tutora za trenutno objašnjenje!</p>' +
                    '</div>';
            } else {
                for (var r = 0; r < replies.length; r++) {
                    var rep = replies[r];
                    if (flags.indexOf(rep.id) !== -1) continue;
                    var isRepUpvoted = !!upvotesMap['rep_' + rep.id];

                    var borderCls = rep.isAccepted ? 'border-2 border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20' :
                                    rep.isAI ? 'border-2 border-purple-500/50 bg-purple-50/30 dark:bg-purple-950/20' :
                                    'border border-slate-200 dark:border-slate-700/70 bg-white dark:bg-slate-800/90';

                    repliesHtml +=
                        '<div class="' + borderCls + ' rounded-2xl p-3.5 space-y-2 shadow-sm transition-all">' +
                            '<div class="flex items-center justify-between text-xs">' +
                                '<div class="flex items-center gap-2">' +
                                    '<span class="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">' + rep.authorAvatar + '</span>' +
                                    '<span class="font-black text-slate-800 dark:text-white">' + esc(rep.author) + '</span>' +
                                    (rep.isAI ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-500 text-white">AI Mentor</span>' :
                                     rep.authorBadge ? '<span class="text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold">' + esc(rep.authorBadge) + '</span>' : '') +
                                '</div>' +
                                '<div class="flex items-center gap-2">' +
                                    (rep.isAccepted ? '<span class="text-[9px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><span>✓</span> <span>Prihvaćen odgovor</span></span>' : '') +
                                    '<span class="text-[10px] text-slate-400">' + timeAgo(rep.createdAt) + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<div class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line">' + esc(rep.content) + '</div>' +
                            '<div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/60 text-xs">' +
                                '<button onclick="CommunityForum.toggleUpvote(\'reply\', \'' + t.id + '\', \'' + rep.id + '\')" ' +
                                    'class="flex items-center gap-1 px-2.5 py-1 rounded-lg border ' + (isRepUpvoted ? 'border-amber-400 bg-amber-500/20 text-amber-500 font-black' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500') + ' active:scale-90 transition-all text-xs">' +
                                    '<span>▲ Korisno</span> <span>(' + rep.upvotes + ')</span>' +
                                '</button>' +
                                '<button onclick="CommunityForum.reportItem(\'reply\', \'' + rep.id + '\')" class="text-[10px] text-slate-400 hover:text-red-400 transition-colors">🚩 Prijavi</button>' +
                            '</div>' +
                        '</div>';
                }
            }

            container.innerHTML =
                '<div class="space-y-4">' +
                    '<!-- Top Back Bar -->' +
                    '<div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">' +
                        '<button onclick="CommunityForum.backToList()" class="flex items-center gap-1.5 text-xs font-black text-blue-500 hover:text-blue-600 active:scale-95 transition-all">' +
                            '<span>←</span> <span>Nazad na Teme</span>' +
                        '</button>' +
                        '<div class="flex items-center gap-2">' +
                            '<span class="text-xs">' + t.categoryIcon + '</span>' +
                            '<span class="text-xs font-black text-slate-400 uppercase tracking-wider">' + esc(t.categoryLabel) + '</span>' +
                            '<button onclick="CommunityForum.reportItem(\'thread\', \'' + t.id + '\')" class="ml-2 text-xs text-slate-400 hover:text-red-400 transition-colors" title="Prijavi temu">🚩</button>' +
                        '</div>' +
                    '</div>' +

                    '<!-- Original Thread Post -->' +
                    '<div class="bg-white dark:bg-slate-800/95 border-2 border-blue-500/20 rounded-2xl p-4 shadow-md space-y-3">' +
                        '<div class="flex items-center justify-between text-xs">' +
                            '<div class="flex items-center gap-2">' +
                                '<span class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-base">' + t.authorAvatar + '</span>' +
                                '<div>' +
                                    '<h4 class="font-black text-slate-800 dark:text-white leading-tight">' + esc(t.author) + '</h4>' +
                                    '<span class="text-[10px] text-slate-400">' + (t.authorBadge || 'Član') + ' • ' + timeAgo(t.createdAt) + '</span>' +
                                '</div>' +
                            '</div>' +
                            '<button onclick="CommunityForum.toggleUpvote(\'thread\', \'' + t.id + '\')" ' +
                                'class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ' + (isThreadUpvoted ? 'border-amber-400 bg-amber-500/20 text-amber-500 font-black' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-amber-400') + ' active:scale-90 transition-all font-bold text-xs">' +
                                '<span>▲</span> <span>' + t.upvotes + '</span>' +
                            '</button>' +
                        '</div>' +
                        '<h2 class="text-base font-black text-slate-900 dark:text-white leading-snug">' + esc(t.title) + '</h2>' +
                        '<p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">' + esc(t.content) + '</p>' +
                        (tagsHtml ? '<div class="flex flex-wrap gap-1.5 pt-1">' + tagsHtml + '</div>' : '') +
                    '</div>' +

                    '<!-- AI Tutor Prompt Banner -->' +
                    '<div class="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/40 rounded-2xl p-3 flex items-center justify-between gap-2">' +
                        '<div class="flex items-center gap-2.5">' +
                            '<span class="text-2xl p-1 bg-purple-500/20 rounded-xl">🤖</span>' +
                            '<div>' +
                                '<h4 class="text-xs font-black text-purple-300">Želiš stručno AI objašnjenje?</h4>' +
                                '<p class="text-[10px] text-slate-400">Generiši trenutnu lingvističku analizu za ovu temu</p>' +
                            '</div>' +
                        '</div>' +
                        '<button id="btn-ask-ai" onclick="CommunityForum.askAITutor(\'' + t.id + '\')" ' +
                            'class="px-3 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform shrink-0 flex items-center gap-1">' +
                            '<span>✨</span> <span>Pitaj AI</span>' +
                        '</button>' +
                    '</div>' +

                    '<!-- Replies Header -->' +
                    '<div class="flex items-center justify-between pt-2">' +
                        '<h3 class="text-xs font-black uppercase tracking-wider text-slate-400">Odgovori Zajednice (' + replies.length + ')</h3>' +
                        '<span class="text-[10px] font-bold text-amber-500 dark:text-amber-400">+15 XP za odgovor</span>' +
                    '</div>' +

                    '<!-- Replies List Stack -->' +
                    '<div class="space-y-3">' +
                        repliesHtml +
                    '</div>' +

                    '<!-- Post a Reply Input Box -->' +
                    '<div class="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 space-y-3 shadow-md">' +
                        '<h4 class="text-xs font-black text-slate-800 dark:text-white flex items-center gap-1.5">' +
                            '<span>✍️</span> <span>Tvoj Odgovor</span>' +
                        '</h4>' +
                        '<textarea id="forum-reply-input" ' +
                            'placeholder="Napiši koristan odgovor ili objašnjenje (podeli svoje iskustvo)..." ' +
                            'class="w-full h-24 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white text-xs font-medium resize-none focus:border-blue-500 outline-none"></textarea>' +
                        '<div class="flex items-center justify-between">' +
                            '<span class="text-[10px] text-slate-400">Budi ljubazan i konstruktivan</span>' +
                            '<button onclick="CommunityForum.submitReply(\'' + t.id + '\')" ' +
                                'class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5">' +
                                '<span>🚀</span> <span>Objavi (+15 XP)</span>' +
                            '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        },

        // ═════════════════════════════════════════════════════
        // §7  UPVOTE & XP MECHANICS
        // ═════════════════════════════════════════════════════
        toggleUpvote: function(type, threadId, replyId) {
            var threads = this._getThreads();
            var upvotesMap = this._getUserUpvotes();
            var key = type === 'thread' ? 'th_' + threadId : 'rep_' + replyId;
            var isUpvoted = !!upvotesMap[key];

            var t = null;
            for (var i = 0; i < threads.length; i++) {
                if (threads[i].id === threadId) { t = threads[i]; break; }
            }
            if (!t) return;

            if (type === 'thread') {
                t.upvotes = Math.max(0, (t.upvotes || 0) + (isUpvoted ? -1 : 1));
            } else {
                var replies = t.replies || [];
                for (var r = 0; r < replies.length; r++) {
                    if (replies[r].id === replyId) {
                        replies[r].upvotes = Math.max(0, (replies[r].upvotes || 0) + (isUpvoted ? -1 : 1));
                        break;
                    }
                }
            }

            if (isUpvoted) {
                delete upvotesMap[key];
            } else {
                upvotesMap[key] = true;
            }

            this._saveThreads(threads);
            this._saveUserUpvotes(upvotesMap);

            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();

            if (this._activeThreadId) {
                this.renderThreadDetail();
            } else {
                this.renderThreadList();
            }
        },

        // ═════════════════════════════════════════════════════
        // §8  SUBMIT NEW REPLY & XP REWARD
        // ═════════════════════════════════════════════════════
        submitReply: function(threadId) {
            var input = document.getElementById('forum-reply-input');
            var text = input ? input.value.trim() : '';

            if (text.length < 5) {
                if (window.app) app.showToast('Odgovor mora imati bar 5 karaktera.', 'error');
                return;
            }

            var threads = this._getThreads();
            var t = null;
            for (var i = 0; i < threads.length; i++) {
                if (threads[i].id === threadId) { t = threads[i]; break; }
            }
            if (!t) return;

            var userName = (window.state && state.user && state.user.name) ? state.user.name : 'Korisnik';
            var userAvatar = (window.state && state.user && state.user.avatar) ? state.user.avatar : '👤';

            var newReply = {
                id: 'rep_' + Date.now().toString(36),
                author: userName,
                authorAvatar: userAvatar,
                authorBadge: 'Član Zajednice',
                content: text,
                upvotes: 0,
                isAccepted: false,
                isAI: false,
                createdAt: new Date().toISOString()
            };

            if (!t.replies) t.replies = [];
            t.replies.push(newReply);
            this._saveThreads(threads);

            // Award +15 XP
            if (window.state) {
                state.xp = (state.xp || 0) + 15;
                state.dailyXP = (state.dailyXP || 0) + 15;
                if (window.app) {
                    app.saveState();
                    if (app.updateProfileUI) app.updateProfileUI();
                    app.showToast('Odgovor objavljen! +15 XP 🌟', 'success');
                }
            }

            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();

            this.renderThreadDetail();
        },

        // ═════════════════════════════════════════════════════
        // §9  NEW THREAD MODAL & CREATION
        // ═════════════════════════════════════════════════════
        openNewThreadModal: function() {
            var modal = document.getElementById('forum-new-thread-modal');
            if (!modal) return;
            modal.classList.remove('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        closeNewThreadModal: function() {
            var modal = document.getElementById('forum-new-thread-modal');
            if (!modal) return;
            modal.classList.add('hidden');
            if (window.TouchHaptics && TouchHaptics.tap) TouchHaptics.tap();
        },

        submitNewThread: function() {
            var titleEl = document.getElementById('new-thread-title');
            var catEl = document.getElementById('new-thread-category');
            var contentEl = document.getElementById('new-thread-content');
            var tagsEl = document.getElementById('new-thread-tags');

            var title = titleEl ? titleEl.value.trim() : '';
            var catId = catEl ? catEl.value : 'grammar';
            var content = contentEl ? contentEl.value.trim() : '';
            var rawTags = tagsEl ? tagsEl.value.trim() : '';

            if (title.length < 8) {
                if (window.app) app.showToast('Naslov mora imati bar 8 karaktera.', 'error');
                return;
            }
            if (content.length < 15) {
                if (window.app) app.showToast('Tekst teme mora imati bar 15 karaktera.', 'error');
                return;
            }

            var catObj = null;
            for (var i = 0; i < CATEGORIES.length; i++) {
                if (CATEGORIES[i].id === catId) { catObj = CATEGORIES[i]; break; }
            }
            if (!catObj) catObj = CATEGORIES[1];

            var tags = [];
            if (rawTags) {
                tags = rawTags.split(/[,\s]+/).map(function(t) {
                    var clean = t.trim();
                    if (!clean) return '';
                    return clean.startsWith('#') ? clean : '#' + clean;
                }).filter(Boolean);
            }
            if (tags.length === 0) {
                tags = ['#' + catId];
            }

            var userName = (window.state && state.user && state.user.name) ? state.user.name : 'Korisnik';
            var userAvatar = (window.state && state.user && state.user.avatar) ? state.user.avatar : '👤';

            var newThread = {
                id: 'th_' + Date.now().toString(36),
                category: catObj.id,
                categoryLabel: catObj.label,
                categoryIcon: catObj.icon,
                title: title,
                content: content,
                author: userName,
                authorAvatar: userAvatar,
                authorBadge: 'Pokretač Teme',
                tags: tags,
                upvotes: 1,
                createdAt: new Date().toISOString(),
                replies: []
            };

            var threads = this._getThreads();
            threads.unshift(newThread);
            this._saveThreads(threads);

            // Award +5 XP for starting discussion
            if (window.state) {
                state.xp = (state.xp || 0) + 5;
                state.dailyXP = (state.dailyXP || 0) + 5;
                if (window.app) {
                    app.saveState();
                    if (app.updateProfileUI) app.updateProfileUI();
                    app.showToast('Nova tema objavljena! +5 XP 🚀', 'success');
                }
            }

            // Clear inputs & close modal
            if (titleEl) titleEl.value = '';
            if (contentEl) contentEl.value = '';
            if (tagsEl) tagsEl.value = '';

            this.closeNewThreadModal();
            this.openThread(newThread.id);
        },

        // ═════════════════════════════════════════════════════
        // §10 🤖 AI TUTOR RESPONSE GENERATOR
        // ═════════════════════════════════════════════════════
        askAITutor: async function(threadId) {
            var btn = document.getElementById('btn-ask-ai');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<span class="animate-spin">⏳</span> Razmišljam...';
            }

            var threads = this._getThreads();
            var t = null;
            for (var i = 0; i < threads.length; i++) {
                if (threads[i].id === threadId) { t = threads[i]; break; }
            }
            if (!t) return;

            var aiResponseText = '';

            // Check for Gemini API key
            var apiKey = (window.state && state.apiKey) ||
                         localStorage.getItem('serbolingo_gemini_key') ||
                         localStorage.getItem('gemini_api_key') ||
                         localStorage.getItem('serbolingo_tts_key');

            if (apiKey) {
                try {
                    var promptText =
                        'Ti si stručni i izuzetno prijateljski lingvistički AI mentor za srpski jezik unutar edukativne aplikacije SerboLingo. ' +
                        'Korisnik je postavio pitanje na forumu zajednice:\n' +
                        'Naslov: "' + t.title + '"\n' +
                        'Opis: "' + t.content + '"\n\n' +
                        'ZADATAK:\n' +
                        '1. Daj kratak, kristalno jasan i tačan pedagoški odgovor (maksimalno 2-3 kratka pasusa ili pregledne tačke).\n' +
                        '2. Uključi 2-3 autentična primera sa prevodom na engleski u zagradama.\n' +
                        '3. Budi ohrabrujuć i napiši odgovor na srpskom jeziku (latinica sa punim dijakritičkim znacima č, ć, ž, š, đ).\n' +
                        '4. Nemoj koristiti reč "hrvatski" već isključivo "srpski jezik".';

                    var models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
                    var fetched = false;

                    for (var m = 0; m < models.length; m++) {
                        try {
                            var resp = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + models[m] + ':generateContent?key=' + apiKey, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
                            });
                            if (resp.ok) {
                                var data = await resp.json();
                                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                                    aiResponseText = data.candidates[0].content.parts[0].text;
                                    fetched = true;
                                    break;
                                }
                            }
                        } catch(err) {
                            console.warn('[CommunityForum] Model fallback:', models[m], err);
                        }
                    }
                    if (!fetched) throw new Error('Models offline');
                } catch(e) {
                    console.warn('[CommunityForum] AI fetch failed, using offline pedagogical fallback:', e);
                }
            }

            // High-quality offline fallback pedagogical synthesis
            if (!aiResponseText) {
                if (t.category === 'grammar') {
                    aiResponseText = '🤖 **AI Tutor Objašnjenje:**\n\nOdlično pitanje za razumevanje srpske gramatike! Kod ove jezičke nedoumice, ključ je u razlikovanju svrhe rečenice:\n\n' +
                        '• **Fokus na radnju/pravac:** Obrati pažnju na predloge koji zahtevaju određeni padež i glagole kretanja.\n' +
                        '• **Primeri:**\n' +
                        '  - *"Idem u Beograd"* (Akuzativ cilja / kretanje)\n' +
                        '  - *"Živim u Beogradu"* (Lokativ mesta / mirovanje)\n\n' +
                        '💡 *Mali savet:* Uvek posmatraj da li subjekat vrši radnju ili samo opisuje stanje u prostoru!';
                } else {
                    aiResponseText = '🤖 **AI Tutor Objašnjenje:**\n\nOva tema je sjajan primer žive balkanske kulture i svakodnevnog jezika! U praksi, govornici u Beogradu i regionu često koriste ove fraze kako bi razgovoru dali toplinu i neposrednost. Slobodno vežbaj ove izraze u svakodnevnoj komunikaciji jer domaći govornici uvek izuzetno cene kada stranac pokaže poznavanje kulturnog konteksta! ✨';
                }
            }

            var aiReply = {
                id: 'rep_ai_' + Date.now().toString(36),
                author: 'SerboLingo AI Mentor',
                authorAvatar: '🤖',
                authorBadge: 'AI Tutor',
                content: aiResponseText,
                upvotes: 4,
                isAccepted: true,
                isAI: true,
                createdAt: new Date().toISOString()
            };

            if (!t.replies) t.replies = [];
            t.replies.push(aiReply);
            this._saveThreads(threads);

            if (window.app) app.showToast('🤖 AI Tutor je odgovorio na temu!', 'success');
            if (window.TouchHaptics && TouchHaptics.correctAnswer) TouchHaptics.correctAnswer();

            this.renderThreadDetail();
        },

        // ═════════════════════════════════════════════════════
        // §11 MODERATION & SAFETY
        // ═════════════════════════════════════════════════════
        reportItem: function(type, id) {
            if (confirm('Da li želiš da prijaviš ovaj sadržaj moderatoru? Sadržaj će biti privremeno sakriven.')) {
                var flags = this._getFlagged();
                flags.push(id);
                this._saveFlagged(flags);

                if (window.app) app.showToast('Hvala na prijavi! Sadržaj je sakriven.', 'info');
                if (type === 'thread') {
                    this.backToList();
                } else {
                    this.renderThreadDetail();
                }
            }
        }
    };

    console.log('[CommunityForum] 💬 Engine initialized. 10 seed discussions ready.');
})();
