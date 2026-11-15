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
 * 6. Live Timed Subtitles: Line-by-line follower synced to video timestamp.
 * 7. Bidirectional Polyglot Learning: Auto-flips for EN -> SR or SR -> EN based on profile settings.
 */

(function () {
    'use strict';

    const SerboReels = {
        STORAGE_KEY: 'serbolingo_reels_data',

        // --- Curated Catalog of 12 Authentic Balkan Video Clips with Timed Lines ---
        CLIPS: [
            {
                id: 'reel_ko_to_tamo_peva',
                title: 'Ko to tamo peva (1980)',
                subtitle: 'Kultna jugoslovenska komedija',
                category: 'cinema',
                categoryLabel: '🎬 Kultni Film',
                ytId: 'PDtjBtuqoQA', // Centar Film - Za Beograd / Ko to tamo peva
                start: 0,
                duration: 22,
                poster: 'https://img.youtube.com/vi/PDtjBtuqoQA/hqdefault.jpg',
                author: 'Slobodan Šijan & Dušan Kovačević',
                subSrLat: 'Dobro je, samo kad izvukosmo živu glavu! I sad ćemo da se guramo sve do Beograda, a ova strana slobodna! Prednja guma je slaba!',
                subSrCyr: 'Добро је, само кад извукосмо живу главу! И сад ћемо да се гурамо све до Београда, а ова страна слободна! Предња гума је слаба!',
                subEn: 'It’s good, as long as we made it out alive! And now we’ll push each other all the way to Belgrade, while this side is empty! The front tire is weak!',
                culturalNote: 'Legendarna rasprava putnika u raspadnutom autobusu Krstić i sin. Izraz "izvući živu glavu" je čest balkanski idiom koji znači jedva preživeti veliku opasnost.',
                lines: [
                    {
                        start: 0,
                        end: 6,
                        subSrLat: 'Dobro je, samo kad izvukosmo živu glavu.',
                        subSrCyr: 'Добро је, само кад извукосмо живу главу.',
                        subEn: 'It’s good, as long as we made it out alive.',
                        keyWords: [
                            { word: 'izvukosmo', root: 'izvući', pos: 'glagol', caseTag: 'Aorist (prošlo vreme)', trans: 'we escaped / pulled out alive' },
                            { word: 'živu', root: 'živ', pos: 'pridev', caseTag: 'Akuzativ ženskog roda', trans: 'living / alive' },
                            { word: 'glavu', root: 'glava', pos: 'imenica', caseTag: 'Akuzativ jednine', trans: 'head (idiom: life)' }
                        ]
                    },
                    {
                        start: 6,
                        end: 14,
                        subSrLat: 'I sad ćemo da se guramo i gazimo sve do Beograda, a ova strana slobodna!',
                        subSrCyr: 'И сад ћемо да се гурамо и газимо све до Београда, а ова страна слободна!',
                        subEn: 'And now we’re gonna push and trample each other all the way to Belgrade, while this side is free!',
                        keyWords: [
                            { word: 'guramo', root: 'gurati se', pos: 'glagol', caseTag: 'Prezent (prvo lice množine)', trans: 'push / shove' },
                            { word: 'gazimo', root: 'gaziti', pos: 'glagol', caseTag: 'Prezent', trans: 'trample / step on' },
                            { word: 'Beograda', root: 'Beograd', pos: 'imenica', caseTag: 'Genitiv s predlogom DO', trans: 'Belgrade' },
                            { word: 'strana', root: 'strana', pos: 'imenica', caseTag: 'Nominativ', trans: 'side' },
                            { word: 'slobodna', root: 'slobodan', pos: 'pridev', caseTag: 'Nominativ ženskog roda', trans: 'free / empty' }
                        ]
                    },
                    {
                        start: 14,
                        end: 22,
                        subSrLat: 'Pa je l\' tebi bre ne vredi govoriti da je prednja guma slaba i da će eksplodirati!?',
                        subSrCyr: 'Па је л\' теби бре не вреди говорити да је предња гума слаба и да ће експлодирати!?',
                        subEn: 'Is it really no use telling you that the front tire is weak and will explode!?',
                        keyWords: [
                            { word: 'vredi', root: 'vredeti', pos: 'glagol', caseTag: 'Prezent', trans: 'worth / makes sense' },
                            { word: 'govoriti', root: 'govoriti', pos: 'glagol', caseTag: 'Infinitiv', trans: 'to speak / to tell' },
                            { word: 'prednja', root: 'prednji', pos: 'pridev', caseTag: 'Nominativ ženskog roda', trans: 'front' },
                            { word: 'guma', root: 'guma', pos: 'imenica', caseTag: 'Nominativ jednine', trans: 'tire' },
                            { word: 'slaba', root: 'slab', pos: 'pridev', caseTag: 'Nominativ', trans: 'weak' },
                            { word: 'eksplodirati', root: 'eksplodirati', pos: 'glagol', caseTag: 'Futur I sa glagolom HTETI', trans: 'to explode' }
                        ]
                    }
                ],
                keyWords: [
                    { word: 'izvukosmo', root: 'izvući', pos: 'glagol', caseTag: 'Aorist', trans: 'escaped alive' },
                    { word: 'glavu', root: 'glava', pos: 'imenica', caseTag: 'Akuzativ jednine', trans: 'head / life' },
                    { word: 'guramo', root: 'gurati se', pos: 'glagol', caseTag: 'Prezent', trans: 'pushing / shoving' },
                    { word: 'guma', root: 'guma', pos: 'imenica', caseTag: 'Nominativ jednine', trans: 'tire' },
                    { word: 'slaba', root: 'slab', pos: 'pridev', caseTag: 'Nominativ ženskog roda', trans: 'weak' }
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
                duration: 22,
                poster: 'https://img.youtube.com/vi/1x6bDQ0A-F4/hqdefault.jpg',
                author: 'Dušan Kovačević',
                subSrLat: 'Ala ga je opravio, svaka mu čast! Ostali samo dugmići.',
                subSrCyr: 'Ала га је оправио, свака му част! Остали само dugmići.',
                subEn: 'Boy did he fix it, hats off to him! Only the buttons are left.',
                culturalNote: 'Vrhunski primer balkanskog sarkazma. Kaže se kada neko nešto "popravi" tako temeljno da ga zapravo potpuno uništi.',
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Šta to radiš, Miško? Popravljaš li ti to mašinu?',
                        subSrCyr: 'Шта то радиш, Мишко? Поправљаш ли ти то машину?',
                        subEn: 'What are you doing, Miško? Are you fixing that machine?',
                        keyWords: [
                            { word: 'radiš', root: 'raditi', pos: 'glagol', caseTag: 'Prezent (drugo lice)', trans: 'are doing / you do' },
                            { word: 'mašinu', root: 'mašina', pos: 'imenica', caseTag: 'Akuzativ jednine', trans: 'machine / engine' }
                        ]
                    },
                    {
                        start: 7,
                        end: 14,
                        subSrLat: 'Ala ga je opravio, svaka mu čast!',
                        subSrCyr: 'Ала га је оправио, свака му част!',
                        subEn: 'Boy did he fix it, hats off to him!',
                        keyWords: [
                            { word: 'opravio', root: 'opraviti', pos: 'glagol', caseTag: 'Perfekat (muški rod)', trans: 'repaired / fixed' },
                            { word: 'čast', root: 'čast', pos: 'imenica', caseTag: 'Nominativ', trans: 'honor / respect' }
                        ]
                    },
                    {
                        start: 14,
                        end: 22,
                        subSrLat: 'Ostali samo dugmići! Ništa više ne radi!',
                        subSrCyr: 'Остали само дугмићи! Ништа више не ради!',
                        subEn: 'Only the buttons are left! Nothing works anymore!',
                        keyWords: [
                            { word: 'ostali', root: 'ostati', pos: 'glagol', caseTag: 'Prošlo vreme (množina)', trans: 'remained / left behind' },
                            { word: 'dugmići', root: 'dugme', pos: 'imenica', caseTag: 'Nominativ množine (deminutiv)', trans: 'little buttons' }
                        ]
                    }
                ],
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
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Nije naše, našli smo! Čim prođe trojka, žestoko mi pada koncentracija!',
                        subSrCyr: 'Није наше, нашли смо! Чим прође тројка, жестоко ми пада концентрација!',
                        subEn: 'It is not ours, we found it! As soon as tram 3 passes, my focus drops hard!',
                        keyWords: [
                            { word: 'našli', root: 'naći', pos: 'glagol', caseTag: 'Perfekat množina', trans: 'found / discovered' },
                            { word: 'koncentracija', root: 'koncentracija', pos: 'imenica', caseTag: 'Nominativ', trans: 'concentration / focus' }
                        ]
                    },
                    {
                        start: 7,
                        end: 14,
                        subSrLat: 'Brate, koja je uopšte poenta ovog našeg izlaska?',
                        subSrCyr: 'Брате, која је уопште поента овог нашег изласка?',
                        subEn: 'Bro, what is even the point of our night out?',
                        keyWords: [
                            { word: 'brate', root: 'brat', pos: 'imenica', caseTag: 'Vokativ (sleng)', trans: 'brother / bro' },
                            { word: 'poenta', root: 'poenta', pos: 'imenica', caseTag: 'Nominativ', trans: 'point / purpose' }
                        ]
                    },
                    {
                        start: 14,
                        end: 22,
                        subSrLat: 'Dolar u pezos, pezos u dinar, dinar u džep!',
                        subSrCyr: 'Долар у пезос, пезос у динар, динар у џеп!',
                        subEn: 'Dollar to peso, peso to dinar, dinar into the pocket!',
                        keyWords: [
                            { word: 'dolar', root: 'dolar', pos: 'imenica', caseTag: 'Nominativ', trans: 'dollar' },
                            { word: 'džep', root: 'džep', pos: 'imenica', caseTag: 'Akuzativ pravca', trans: 'pocket' }
                        ]
                    }
                ],
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
                duration: 20,
                poster: 'https://img.youtube.com/vi/0HaJzZ1XMCs/hqdefault.jpg',
                author: 'Srđan Dragojević',
                subSrLat: 'Kako je kod vas u Švedskoj? Ladno, al standard, jebi ga!',
                subSrCyr: 'Како је код вас у Шведској? Ладно, ал стандард, јеби га!',
                subEn: 'How is it over there in Sweden? Cold, but high standard of living, what can you do!',
                culturalNote: 'Humoristički osvrt na balkansku dijasporu. "Standard" označava dobar životni standard i visoke plate na Zapadu.',
                lines: [
                    {
                        start: 0,
                        end: 6,
                        subSrLat: 'Dobar dan, majstore! Kuda putuješ ovim kamionom?',
                        subSrCyr: 'Добар дан, мајсторе! Куда путујеш овим камионом?',
                        subEn: 'Good day, driver! Where are you traveling with this truck?',
                        keyWords: [
                            { word: 'majstore', root: 'majstor', pos: 'imenica', caseTag: 'Vokativ', trans: 'driver / master' },
                            { word: 'putuješ', root: 'putovati', pos: 'glagol', caseTag: 'Prezent (drugo lice)', trans: 'you travel' }
                        ]
                    },
                    {
                        start: 6,
                        end: 13,
                        subSrLat: 'Kako je uopšte kod vas gore u Švedskoj?',
                        subSrCyr: 'Како је уопште код вас горе у Шведској?',
                        subEn: 'How is it up there where you are in Sweden?',
                        keyWords: [
                            { word: 'Švedskoj', root: 'Švedska', pos: 'imenica', caseTag: 'Lokativ s predlogom U', trans: 'Sweden' }
                        ]
                    },
                    {
                        start: 13,
                        end: 20,
                        subSrLat: 'Ladno, al standard, jebi ga! Sve je čisto i uređeno.',
                        subSrCyr: 'Ладно, ал стандард, јеби га! Све је чисто и уређено.',
                        subEn: 'Cold, but high living standard! Everything is clean and orderly.',
                        keyWords: [
                            { word: 'ladno', root: 'hladno', pos: 'prilog', caseTag: 'Kolokvijalni oblik za hladno', trans: 'cold' },
                            { word: 'standard', root: 'standard', pos: 'imenica', caseTag: 'Nominativ', trans: 'living standard' }
                        ]
                    }
                ],
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
                duration: 18,
                poster: 'https://img.youtube.com/vi/5p2WQXc_ZL4/hqdefault.jpg',
                author: 'Srpska sinhronizacija (B92)',
                subSrLat: 'Ja sam spreman! Ja sam spreman za najbolji posao na svetu!',
                subSrCyr: 'Ја сам спреман! Ја сам спреман за најбољи посао на свету!',
                subEn: 'I am ready! I am ready for the best job in the world!',
                culturalNote: 'Srpska sinhronizacija Sunđer Boba ima kultni status zbog fantastične dikcije i glumačke izražajnosti. Savršeno za početnike!',
                lines: [
                    {
                        start: 0,
                        end: 6,
                        subSrLat: 'Danas je veliki dan za Kofa Krabu!',
                        subSrCyr: 'Данас је велики дан за Кофа Крабу!',
                        subEn: 'Today is the big day for the Krusty Krab!',
                        keyWords: [
                            { word: 'danas', root: 'danas', pos: 'prilog', caseTag: 'Vremenski prilog', trans: 'today' },
                            { word: 'veliki', root: 'veliki', pos: 'pridev', caseTag: 'Nominativ', trans: 'big / great' }
                        ]
                    },
                    {
                        start: 6,
                        end: 12,
                        subSrLat: 'Ja sam spreman! Ja sam spreman za najbolji posao na svetu!',
                        subSrCyr: 'Ја сам спреман! Ја сам спреман за најбољи посао на свету!',
                        subEn: 'I am ready! I am ready for the best job in the world!',
                        keyWords: [
                            { word: 'spreman', root: 'spreman', pos: 'pridev', caseTag: 'Nominativ jednine', trans: 'ready / prepared' },
                            { word: 'posao', root: 'posao', pos: 'imenica', caseTag: 'Akuzativ za neživo', trans: 'job / work' },
                            { word: 'svetu', root: 'svet', pos: 'imenica', caseTag: 'Lokativ s predlogom NA', trans: 'world' }
                        ]
                    },
                    {
                        start: 12,
                        end: 18,
                        subSrLat: 'Kragna zategnuta, osmeh na licu, krećem!',
                        subSrCyr: 'Крагна затегнута, осмех на лицу, крећем!',
                        subEn: 'Collar tight, smile on my face, here I go!',
                        keyWords: [
                            { word: 'osmeh', root: 'osmeh', pos: 'imenica', caseTag: 'Nominativ', trans: 'smile' },
                            { word: 'licu', root: 'lice', pos: 'imenica', caseTag: 'Lokativ s predlogom NA', trans: 'face' }
                        ]
                    }
                ],
                keyWords: [
                    { word: 'spreman', root: 'spreman', pos: 'pridev', caseTag: 'Nominativ jednine (muški rod)', trans: 'ready / prepared' },
                    { word: 'najbolji', root: 'dobar', pos: 'pridev', caseTag: 'Superlativ (naj + bolji)', trans: 'the best' },
                    { word: 'posao', root: 'posao', pos: 'imenica', caseTag: 'Akuzativ za neživo', trans: 'job / work' },
                    { word: 'svetu', root: 'svet', pos: 'imenica', caseTag: 'Lokativ s predlogom NA', trans: 'world' }
                ]
            },
            {
                id: 'reel_meda_padington',
                title: 'Meda Padington & Dizni',
                subtitle: 'Kulturni bonton i lepo ponašanje',
                category: 'cartoons',
                categoryLabel: '🧸 Sinhronizacija',
                ytId: 'P76gLIKntAc', // Dizni crtani filmovi sinhronizovano
                start: 0,
                duration: 20,
                poster: 'https://img.youtube.com/vi/P76gLIKntAc/hqdefault.jpg',
                author: 'Srpska sinhronizacija',
                subSrLat: 'Dobar dan, gospodine. Da li biste želeli jedan ukusan sendvič od marmelade?',
                subSrCyr: 'Добар дан, господине. Да ли бисте желели један укусан сендвич од мармеладе?',
                subEn: 'Good day, sir. Would you like a delicious marmalade sandwich?',
                culturalNote: 'Odličan primer učtivog obraćanja na srpskom jeziku (potencijal za želje: "Da li biste želeli" + Vokativ "gospodine").',
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Dobar dan, gospodine! Da li biste želeli jedan sendvič?',
                        subSrCyr: 'Добар дан, господине! Да ли бисте желели један сендвич?',
                        subEn: 'Good day, sir! Would you like a sandwich?',
                        keyWords: [
                            { word: 'gospodine', root: 'gospodin', pos: 'imenica', caseTag: 'Vokativ (učtivo)', trans: 'sir / gentleman' },
                            { word: 'želeli', root: 'želeti', pos: 'glagol', caseTag: 'Potencijal', trans: 'would like' }
                        ]
                    },
                    {
                        start: 7,
                        end: 14,
                        subSrLat: 'Sendvič od domaće marmelade je uvek u mom šeširu.',
                        subSrCyr: 'Сендвич од домаће мармеладе је увек у мом шеширу.',
                        subEn: 'A homemade marmalade sandwich is always in my hat.',
                        keyWords: [
                            { word: 'marmelade', root: 'marmelada', pos: 'imenica', caseTag: 'Genitiv porekla', trans: 'marmalade / jam' },
                            { word: 'šeširu', root: 'šešir', pos: 'imenica', caseTag: 'Lokativ mesta', trans: 'hat' }
                        ]
                    },
                    {
                        start: 14,
                        end: 20,
                        subSrLat: 'Lepo ponašanje i bonton otvaraju sva vrata na svetu!',
                        subSrCyr: 'Лепо понашање и бонтон отварају сва врата на свету!',
                        subEn: 'Good manners and etiquette open all doors in the world!',
                        keyWords: [
                            { word: 'ponašanje', root: 'ponašanje', pos: 'imenica', caseTag: 'Nominativ', trans: 'behavior / manners' },
                            { word: 'vrata', root: 'vrata', pos: 'imenica', caseTag: 'Akuzativ množine', trans: 'doors' }
                        ]
                    }
                ],
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
                duration: 22,
                poster: 'https://img.youtube.com/vi/If6z5ax6HOA/hqdefault.jpg',
                author: 'Disney Srbija (SlavicDubs)',
                subSrLat: 'Hakuna Matata znači: bez briga i bez problema do kraja života!',
                subSrCyr: 'Хакуна Матата значи: без брига и без проблема до краја живота!',
                subEn: 'Hakuna Matata means: no worries and no problems for the rest of your life!',
                culturalNote: 'Predlog "bez" uvek zahteva Genitiv (bez briga, bez problema). Odlična vežba za pamćenje pravila genitiva bez muke.',
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Hakuna Matata, ima čaroban zvuk!',
                        subSrCyr: 'Хакуна Матата, има чаробан звук!',
                        subEn: 'Hakuna Matata, has a magical sound!',
                        keyWords: [
                            { word: 'čaroban', root: 'čaroban', pos: 'pridev', caseTag: 'Akuzativ', trans: 'magical / wonderful' },
                            { word: 'zvuk', root: 'zvuk', pos: 'imenica', caseTag: 'Akuzativ za neživo', trans: 'sound' }
                        ]
                    },
                    {
                        start: 7,
                        end: 14,
                        subSrLat: 'Hakuna Matata, nije izraz puk!',
                        subSrCyr: 'Хакуна Матата, није израз пук!',
                        subEn: 'Hakuna Matata, ain’t no passing craze!',
                        keyWords: [
                            { word: 'izraz', root: 'izraz', pos: 'imenica', caseTag: 'Nominativ', trans: 'expression / phrase' }
                        ]
                    },
                    {
                        start: 14,
                        end: 22,
                        subSrLat: 'Bez briga i bez problema do kraja života!',
                        subSrCyr: 'Без брига и без проблема до краја живота!',
                        subEn: 'No worries and no problems for the rest of your life!',
                        keyWords: [
                            { word: 'briga', root: 'briga', pos: 'imenica', caseTag: 'Genitiv posle BEZ', trans: 'worries' },
                            { word: 'problema', root: 'problem', pos: 'imenica', caseTag: 'Genitiv posle BEZ', trans: 'problems' },
                            { word: 'života', root: 'život', pos: 'imenica', caseTag: 'Genitiv jednine', trans: 'life' }
                        ]
                    }
                ],
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
                duration: 20,
                poster: 'https://img.youtube.com/vi/gZKmCxuwWQ4/hqdefault.jpg',
                author: 'Go Speak Serbian',
                subSrLat: 'Daj mi, molim te, jednu produženu s toplim mlekom i čašu kisele vode.',
                subSrCyr: 'Дај ми, молим те, једну продужену с топлим млеком и чашу киселе воде.',
                subEn: 'Give me, please, an extended espresso with warm milk and a glass of sparkling water.',
                culturalNote: '"Produžena s mlekom" je najčešći način naručivanja kafe u Srbiji. "Kisela voda" je mineralna gazirana voda.',
                lines: [
                    {
                        start: 0,
                        end: 6,
                        subSrLat: 'Dobar dan! Mogu li da dobijem jedan slobodan sto za dvoje?',
                        subSrCyr: 'Добар дан! Могу ли да добијем један слободан сто за двоје?',
                        subEn: 'Good day! May I have a free table for two?',
                        keyWords: [
                            { word: 'sto', root: 'sto', pos: 'imenica', caseTag: 'Akuzativ jednine', trans: 'table' },
                            { word: 'dvoje', root: 'dvoje', pos: 'broj', caseTag: 'Zbirni broj', trans: 'two people' }
                        ]
                    },
                    {
                        start: 6,
                        end: 13,
                        subSrLat: 'Daj mi, molim te, jednu produženu kafu s toplim mlekom.',
                        subSrCyr: 'Дај ми, молим те, једну продужену кафу с топлим млеком.',
                        subEn: 'Give me, please, an extended espresso with warm milk.',
                        keyWords: [
                            { word: 'produženu', root: 'produžena kafa', pos: 'pridev', caseTag: 'Akuzativ', trans: 'extended espresso' },
                            { word: 'mlekom', root: 'mleko', pos: 'imenica', caseTag: 'Instrumental jednine', trans: 'milk' }
                        ]
                    },
                    {
                        start: 13,
                        end: 20,
                        subSrLat: 'I donesite mi jednu hladnu čašu kisele vode, hvala!',
                        subSrCyr: 'И донесите ми једну хладну чашу киселе воде, хвала!',
                        subEn: 'And bring me a cold glass of sparkling water, thank you!',
                        keyWords: [
                            { word: 'čašu', root: 'čaša', pos: 'imenica', caseTag: 'Akuzativ', trans: 'glass' },
                            { word: 'kisele', root: 'kiseo', pos: 'pridev', caseTag: 'Genitiv', trans: 'sparkling / sour' }
                        ]
                    }
                ],
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
                author: 'Unlock Your Serbian',
                subSrLat: 'Gde ćemo, šefe? Danas je neviđena gužva preko mosta Gazela!',
                subSrCyr: 'Где ћемо, шефе? Данас је невиђена гужва преко моста Газела!',
                subEn: 'Where are we heading, boss? Today there is unprecedented traffic across the Gazela bridge!',
                culturalNote: 'Taksisti u Beogradu često koriste reč "šefe" ili "majstore". Gazela je najprometniji most na reci Savi.',
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Dobar dan, šefe! Gde putujemo danas kroz grad?',
                        subSrCyr: 'Добар дан, шефе! Где путујемо данас кроз град?',
                        subEn: 'Good day, boss! Where are we driving through town today?',
                        keyWords: [
                            { word: 'šefe', root: 'šef', pos: 'imenica', caseTag: 'Vokativ', trans: 'boss / driver' },
                            { word: 'grad', root: 'grad', pos: 'imenica', caseTag: 'Akuzativ s predlogom KROZ', trans: 'city / town' }
                        ]
                    },
                    {
                        start: 7,
                        end: 14,
                        subSrLat: 'Danas je neviđena gužva preko mosta Gazela!',
                        subSrCyr: 'Данас је невиђена гужва преко моста Газела!',
                        subEn: 'Today there is crazy traffic over the Gazela bridge!',
                        keyWords: [
                            { word: 'gužva', root: 'gužva', pos: 'imenica', caseTag: 'Nominativ', trans: 'traffic jam / crowd' },
                            { word: 'mosta', root: 'most', pos: 'imenica', caseTag: 'Genitiv posle preko', trans: 'bridge' }
                        ]
                    },
                    {
                        start: 14,
                        end: 22,
                        subSrLat: 'Ne brini ništa, majstore, znam ja sve prečice kroz Vračar!',
                        subSrCyr: 'Не брини ништа, мајсторе, знам ја све пречице кроз Врачар!',
                        subEn: 'Don’t worry at all, master, I know all the shortcuts through Vračar!',
                        keyWords: [
                            { word: 'prečice', root: 'prečica', pos: 'imenica', caseTag: 'Akuzativ množine', trans: 'shortcuts' },
                            { word: 'znam', root: 'znati', pos: 'glagol', caseTag: 'Prezent', trans: 'I know' }
                        ]
                    }
                ],
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
                author: 'Beograd Srbija',
                subSrLat: 'Domaćine, koliko su ti ove sveže domaće jagode? Izmeri mi kilo i po!',
                subSrCyr: 'Домаћине, колико су ти ове свеже домаће јагоде? Измери ми кило и по!',
                subEn: 'Good host, how much are these fresh homegrown strawberries? Weigh me a kilo and a half!',
                culturalNote: 'Na balkanskim zelenim pijacama prodavcima se ljubazno obraća sa "domaćine" ili "komšija". Cenkanje je uvek prijateljsko.',
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Dobar dan, komšija! Koliko su ti ove domaće jagode?',
                        subSrCyr: 'Добар дан, комшија! Колико су ти ове домаће јагоде?',
                        subEn: 'Good day, neighbor! How much are these homegrown strawberries?',
                        keyWords: [
                            { word: 'komšija', root: 'komšija', pos: 'imenica', caseTag: 'Vokativ', trans: 'neighbor / friend' },
                            { word: 'jagode', root: 'jagoda', pos: 'imenica', caseTag: 'Nominativ množine', trans: 'strawberries' }
                        ]
                    },
                    {
                        start: 7,
                        end: 13,
                        subSrLat: 'Sveže su ubrane jutros, izmeri mi kilo i po!',
                        subSrCyr: 'Свеже су убране јутрос, измери ми кило и по!',
                        subEn: 'They were freshly picked this morning, weigh me a kilo and a half!',
                        keyWords: [
                            { word: 'sveže', root: 'svež', pos: 'pridev', caseTag: 'Nominativ množine', trans: 'fresh' },
                            { word: 'izmeri', root: 'izmeriti', pos: 'glagol', caseTag: 'Imperativ', trans: 'weigh / measure' }
                        ]
                    },
                    {
                        start: 13,
                        end: 20,
                        subSrLat: 'Dodaj mi još i malo mladog kajmaka za doručak!',
                        subSrCyr: 'Додај ми још и мало младог кајмака за доручак!',
                        subEn: 'Add me also some young kajmak for breakfast!',
                        keyWords: [
                            { word: 'kajmaka', root: 'kajmak', pos: 'imenica', caseTag: 'Genitiv količine', trans: 'kajmak (clotted cream cheese)' },
                            { word: 'doručak', root: 'doručak', pos: 'imenica', caseTag: 'Akuzativ', trans: 'breakfast' }
                        ]
                    }
                ],
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
                duration: 22,
                poster: 'https://img.youtube.com/vi/EMAr98ozug0/hqdefault.jpg',
                author: 'RTS Koncerti',
                subSrLat: 'Kad truba zasvira u Guči, celo selo zaigra u kolu do zore!',
                subSrCyr: 'Кад труба засвира у Гучи, цело село заигра у колу до зоре!',
                subEn: 'When the trumpet plays in Guča, the entire village dances in the circle until dawn!',
                culturalNote: 'Kolo je tradicionalna narodna igra u krugu, a Guča je svetski poznat festival trube koji se održava svakog avgusta u Dragačevu.',
                lines: [
                    {
                        start: 0,
                        end: 7,
                        subSrLat: 'Kad zlatna truba zasvira u Guči, celo selo zaigra!',
                        subSrCyr: 'Кад златна труба засвира у Гучи, цело село заигра!',
                        subEn: 'When the golden trumpet plays in Guča, the entire village dances!',
                        keyWords: [
                            { word: 'truba', root: 'truba', pos: 'imenica', caseTag: 'Nominativ', trans: 'trumpet / horn' },
                            { word: 'zasvira', root: 'zasvirati', pos: 'glagol', caseTag: 'Prezent', trans: 'starts playing' }
                        ]
                    },
                    {
                        start: 7,
                        end: 14,
                        subSrLat: 'Ljudi se hvataju pod ruku i igraju kolo do zore!',
                        subSrCyr: 'Људи се хватају под руку и играју коло до зоре!',
                        subEn: 'People link arms and dance the circle dance until dawn!',
                        keyWords: [
                            { word: 'kolo', root: 'kolo', pos: 'imenica', caseTag: 'Akuzativ', trans: 'traditional circle dance' },
                            { word: 'zore', root: 'zora', pos: 'imenica', caseTag: 'Genitiv posle DO', trans: 'dawn' }
                        ]
                    },
                    {
                        start: 14,
                        end: 22,
                        subSrLat: 'To je balkanski ritam i tradicija koja spaja ljude.',
                        subSrCyr: 'То је балкански ритам и традиција која спаја људе.',
                        subEn: 'That is the Balkan rhythm and tradition that unites people.',
                        keyWords: [
                            { word: 'ritam', root: 'ritam', pos: 'imenica', caseTag: 'Nominativ', trans: 'rhythm' },
                            { word: 'tradicija', root: 'tradicija', pos: 'imenica', caseTag: 'Nominativ', trans: 'tradition / heritage' }
                        ]
                    }
                ],
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
                duration: 20,
                poster: 'https://img.youtube.com/vi/xS-lEnNez1I/hqdefault.jpg',
                author: 'Kuvajte sa Stašom',
                subSrLat: 'Vruć burek sa sirom i hladan gusti jogurt — to je jedini pravi lek!',
                subSrCyr: 'Врућ бурек са сиром и хладан густи јогурт — то је једини прави лек!',
                subEn: 'Hot cheese burek and cold thick yogurt — that is the only true medicine!',
                culturalNote: 'Burek sa sirom ili mesom i čaša jogurta je neprevaziđeni doručak na celom Balkanu. Jede se rukama iz masnog papira.',
                lines: [
                    {
                        start: 0,
                        end: 6,
                        subSrLat: 'Rano ujutru u pekari miriše vruć burek sa sirom!',
                        subSrCyr: 'Рано ујутру у пекари мирише врућ бурек са сиром!',
                        subEn: 'Early in the morning the bakery smells of hot cheese burek!',
                        keyWords: [
                            { word: 'pekari', root: 'pekara', pos: 'imenica', caseTag: 'Lokativ mesta', trans: 'bakery' },
                            { word: 'vruć', root: 'vruć', pos: 'pridev', caseTag: 'Nominativ', trans: 'hot / fresh' }
                        ]
                    },
                    {
                        start: 6,
                        end: 13,
                        subSrLat: 'Isecite mi jednu četvrtinu na masni papir, molim vas!',
                        subSrCyr: 'Исеците ми једну четвртину на масни папир, молим вас!',
                        subEn: 'Cut me a quarter onto greasy paper, please!',
                        keyWords: [
                            { word: 'četvrtinu', root: 'četvrtina', pos: 'imenica', caseTag: 'Akuzativ', trans: 'one-fourth portion' },
                            { word: 'papir', root: 'papir', pos: 'imenica', caseTag: 'Akuzativ cilja', trans: 'paper wrapper' }
                        ]
                    },
                    {
                        start: 13,
                        end: 20,
                        subSrLat: 'Vruć burek i hladan gusti jogurt — to je jedini pravi lek!',
                        subSrCyr: 'Врућ бурек и хладан густи јогурт — то је једини прави лек!',
                        subEn: 'Hot burek and cold thick yogurt — that is the only true medicine!',
                        keyWords: [
                            { word: 'burek', root: 'burek', pos: 'imenica', caseTag: 'Nominativ', trans: 'flaky filled pastry' },
                            { word: 'jogurt', root: 'jogurt', pos: 'imenica', caseTag: 'Nominativ', trans: 'yogurt drink' },
                            { word: 'lek', root: 'lek', pos: 'imenica', caseTag: 'Nominativ', trans: 'medicine / remedy' }
                        ]
                    }
                ],
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
        activeDirection: null, // 'en_to_sr' | 'sr_to_en'
        activeLineIndex: 0,
        currentPlayTime: 0,
        playbackTimer: null,
        isPlaying: false,
        playbackSpeed: 1.0,
        completedCount: 0,
        _hasMessageListener: false,

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

        // --- Bidirectional Language Direction Handling ---
        getDirection: function () {
            if (this.activeDirection) return this.activeDirection;
            const appDir = window.app?.state?.settings?.learningDirection;
            return appDir || 'en_to_sr';
        },

        toggleDirection: function () {
            const cur = this.getDirection();
            this.activeDirection = (cur === 'sr_to_en') ? 'en_to_sr' : 'sr_to_en';

            if (window.app && typeof window.app.setLearningDirection === 'function') {
                window.app.setLearningDirection(this.activeDirection);
            }

            this.updateDirectionButton();
            this.renderSubtitles();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        updateDirectionButton: function () {
            const btn = document.getElementById('reels-dir-label');
            if (!btn) return;
            const isEnglish = (this.getDirection() === 'sr_to_en');
            btn.textContent = isEnglish ? '🇷🇸 ➡️ 🇬🇧' : '🇬🇧 ➡️ 🇷🇸';
            if (btn.parentElement) {
                btn.parentElement.title = isEnglish ? 'Učiš: Engleski (Prebaci na učenje srpskog)' : 'Learning: Serbian (Switch to learning English)';
            }
        },

        // --- YouTube Player postMessage Synchronization ---
        initMessageListener: function () {
            if (this._hasMessageListener) return;
            this._hasMessageListener = true;

            window.addEventListener('message', (event) => {
                if (!event.data) return;
                let data = event.data;
                if (typeof data === 'string') {
                    try { data = JSON.parse(data); } catch (e) { return; }
                }
                if (!data || typeof data !== 'object') return;

                // 1. YouTube onStateChange (1=PLAYING, 2=PAUSED, 0=ENDED)
                if (data.event === 'onStateChange') {
                    if (data.info === 1) {
                        this.isPlaying = true;
                        const ind = document.getElementById('reels-play-indicator');
                        if (ind) ind.classList.add('hidden');
                        this.startSubtitleTimer();
                    } else if (data.info === 2) {
                        this.isPlaying = false;
                        const ind = document.getElementById('reels-play-indicator');
                        if (ind) ind.classList.remove('hidden');
                        this.stopSubtitleTimer();
                    } else if (data.info === 0) {
                        this.activeLineIndex = 0;
                        this.currentPlayTime = 0;
                        this.renderSubtitles();
                    }
                }

                // 2. YouTube infoDelivery (real currentTime updates from player)
                if (data.event === 'infoDelivery' && data.info && typeof data.info.currentTime === 'number') {
                    this.onPlayerTimeUpdate(data.info.currentTime);
                }
            });
        },

        onPlayerTimeUpdate: function (ytTime) {
            const clips = this.getFilteredClips();
            if (!clips || clips.length === 0) return;
            const clip = clips[this.currentIndex];
            if (!clip) return;

            const lines = clip.lines || [];
            if (lines.length <= 1) return;

            const clipStart = clip.start || 0;
            const elapsed = Math.max(0, ytTime - clipStart);
            this.currentPlayTime = elapsed;

            const activeIdx = lines.findIndex(l => elapsed >= l.start && elapsed < l.end);
            if (activeIdx !== -1 && activeIdx !== this.activeLineIndex) {
                this.activeLineIndex = activeIdx;
                this.renderSubtitles();
            }
        },

        // --- Timed Subtitle Live Follower Engine ---
        startSubtitleTimer: function () {
            this.stopSubtitleTimer();
            this.playbackTimer = setInterval(() => {
                if (!this.isPlaying) return;

                const clips = this.getFilteredClips();
                if (!clips || clips.length === 0) return;
                const clip = clips[this.currentIndex];
                if (!clip) return;

                const lines = clip.lines || [];
                if (lines.length <= 1) return;

                this.currentPlayTime += 0.25;
                const totalDur = clip.duration || 20;

                if (this.currentPlayTime >= totalDur) {
                    this.currentPlayTime = 0;
                    if (this.activeLineIndex !== 0) {
                        this.activeLineIndex = 0;
                        this.renderSubtitles();
                    }
                    return;
                }

                // Find active line matching current elapsed time
                const activeIdx = lines.findIndex(l => this.currentPlayTime >= l.start && this.currentPlayTime < l.end);
                if (activeIdx !== -1 && activeIdx !== this.activeLineIndex) {
                    this.activeLineIndex = activeIdx;
                    this.renderSubtitles();
                }
            }, 250);
        },

        stopSubtitleTimer: function () {
            if (this.playbackTimer) {
                clearInterval(this.playbackTimer);
                this.playbackTimer = null;
            }
        },

        seekLine: function (idx) {
            const clips = this.getFilteredClips();
            const clip = clips[this.currentIndex];
            if (!clip || !clip.lines || !clip.lines[idx]) return;

            this.activeLineIndex = idx;
            this.currentPlayTime = clip.lines[idx].start;
            this.renderSubtitles();

            // Seek YouTube iframe to timestamp if supported
            const iframe = document.getElementById('reels-yt-iframe');
            if (iframe && iframe.contentWindow) {
                try {
                    const seekTarget = (clip.start || 0) + clip.lines[idx].start;
                    iframe.contentWindow.postMessage(JSON.stringify({
                        event: 'command',
                        func: 'seekTo',
                        args: [seekTarget, true]
                    }), '*');
                } catch(e) {}
            }
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
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

            this.initMessageListener();
            this.activeDirection = this.getDirection();
            this.currentPlayTime = 0;
            this.activeLineIndex = 0;
            this.isPlaying = false;
            this.updateDirectionButton();
            this.renderReel();

            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        closeFeed: function () {
            const modal = document.getElementById('serbo-reels-modal');
            if (modal) modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');

            this.stopSubtitleTimer();

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
            this.activeLineIndex = 0;
            this.currentPlayTime = 0;

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
            this.startSubtitleTimer();
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

            this.updateDirectionButton();

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

                const iframe = document.getElementById('reels-yt-iframe');
                if (iframe) {
                    iframe.addEventListener('load', () => {
                        try {
                            iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
                        } catch (e) {}
                    });
                }
            }

            // 3. Subtitles with Clickable Grammar Words & Live Line Following
            this.renderSubtitles();

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

        // --- Render Subtitle Card with Bidirectional Layout & Line Indicator ---
        renderSubtitles: function () {
            const subContainer = document.getElementById('reels-subtitles-box');
            if (!subContainer) return;

            const clips = this.getFilteredClips();
            if (!clips || clips.length === 0) return;
            const clip = clips[this.currentIndex];
            if (!clip) return;

            const lines = (clip.lines && clip.lines.length > 0) 
                ? clip.lines 
                : [{ start: 0, end: clip.duration || 20, subSrLat: clip.subSrLat, subSrCyr: clip.subSrCyr, subEn: clip.subEn, keyWords: clip.keyWords }];

            if (this.activeLineIndex >= lines.length) this.activeLineIndex = 0;
            const curLine = lines[this.activeLineIndex];
            const direction = this.getDirection(); // 'sr_to_en' | 'en_to_sr'
            const isLearningEnglish = (direction === 'sr_to_en');

            // Interactive top text and supporting bottom text
            let primaryHtml = '';
            let secondaryHtml = '';
            let dirBadge = '';

            if (isLearningEnglish) {
                // Serbian speaker learning English: English is PRIMARY (interactive)
                primaryHtml = this.tokenizeSubtitle(curLine.subEn, 'en');
                const srText = this.activeScript === 'sr_cyr' ? curLine.subSrCyr : curLine.subSrLat;
                secondaryHtml = srText;
                dirBadge = `<span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[9px] font-black uppercase tracking-wider">🇬🇧 Engleski (Cilj)</span>`;
            } else {
                // English speaker learning Serbian: Serbian is PRIMARY (interactive)
                const srText = this.activeScript === 'sr_cyr' ? curLine.subSrCyr : curLine.subSrLat;
                primaryHtml = this.tokenizeSubtitle(srText, 'sr');
                secondaryHtml = curLine.subEn;
                dirBadge = `<span class="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px] font-black uppercase tracking-wider">🇷🇸 Srpski (${this.activeScript === 'sr_cyr' ? 'Ћирилица' : 'Latinica'})</span>`;
            }

            // Line indicator dots (e.g. • 1 • 2 • 3)
            let lineDotsHtml = '';
            if (lines.length > 1) {
                lineDotsHtml = `
                <div class="flex items-center justify-center gap-1.5 pb-1">
                    ${lines.map((l, idx) => `
                        <button onclick="SerboReels.seekLine(${idx})" class="h-1.5 rounded-full transition-all ${idx === this.activeLineIndex ? 'w-6 bg-pink-500 shadow-sm' : 'w-2 bg-slate-700 hover:bg-slate-500'}" title="Prebaci na stih ${idx + 1} (${l.start}s - ${l.end}s)"></button>
                    `).join('')}
                    <span class="text-[9px] font-bold text-slate-400 ml-1.5">${this.activeLineIndex + 1}/${lines.length}</span>
                </div>`;
            }

            subContainer.innerHTML = `
            <div class="space-y-1.5 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-700/60 shadow-xl max-w-sm mx-auto transition-all">
                ${lineDotsHtml}
                <!-- Target Language Interactive Subtitle -->
                <div class="flex items-center justify-between pb-0.5 border-b border-slate-800/80">
                    ${dirBadge}
                    <span class="text-[9px] text-slate-400">💡 Tapni reč za analizu</span>
                </div>
                <div class="text-sm md:text-base font-black text-white leading-relaxed tracking-wide flex flex-wrap gap-1 items-center justify-center min-h-[2rem]">
                    ${primaryHtml}
                </div>
                <!-- Native Language Translation Subtitle -->
                <div class="text-[11px] md:text-xs font-bold text-yellow-300/90 text-center border-t border-slate-800/80 pt-1.5 leading-snug">
                    ${secondaryHtml}
                </div>
            </div>`;
        },

        // --- Subtitle Tokenizer: Wraps each word into an interactive tap target ---
        tokenizeSubtitle: function (text, lang = 'sr') {
            if (!text) return '';
            return text.split(/\s+/).map(token => {
                const cleanWord = token.replace(/^[.,?!":;()[\]{}«»„“"'\-*]+|[.,?!":;()[\]{}«»„“"'\-*]+$/g, '');
                if (!cleanWord) return token;

                const escapedClean = cleanWord.replace(/'/g, "\\'");
                const hoverStyle = lang === 'en' 
                    ? 'hover:bg-blue-500/30 active:bg-blue-500/50 hover:text-blue-300 hover:border-blue-400' 
                    : 'hover:bg-pink-500/30 active:bg-pink-500/50 hover:text-pink-300 hover:border-pink-400';

                return `<button onclick="SerboReels.inspectWord('${escapedClean}', '${lang}', this)" class="inline-block px-1 py-0.5 rounded-lg ${hoverStyle} transition-colors cursor-pointer border-b border-transparent font-black">${token}</button>`;
            }).join(' ');
        },

        // --- Next & Previous Navigation ---
        nextReel: function () {
            const clips = this.getFilteredClips();
            if (clips.length <= 1) return;
            this.currentIndex = (this.currentIndex + 1) % clips.length;
            this.activeLineIndex = 0;
            this.currentPlayTime = 0;
            this.isPlaying = false;
            this.stopSubtitleTimer();
            this.renderReel();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        prevReel: function () {
            const clips = this.getFilteredClips();
            if (clips.length <= 1) return;
            this.currentIndex = (this.currentIndex - 1 + clips.length) % clips.length;
            this.activeLineIndex = 0;
            this.currentPlayTime = 0;
            this.isPlaying = false;
            this.stopSubtitleTimer();
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
                iframe.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
            } catch (e) {
                console.log('IFrame message error:', e);
            }

            if (indicator) {
                if (!this.isPlaying) {
                    indicator.classList.remove('hidden');
                    this.stopSubtitleTimer();
                } else {
                    indicator.classList.add('hidden');
                    this.startSubtitleTimer();
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
            this.renderSubtitles();
            if (window.TouchHaptics) TouchHaptics.vibrate('tap');
        },

        // --- 1-Tap Word Inspector Drawer (Tap-to-Translate) ---
        inspectWord: function (rawWord, lang = 'sr', targetEl) {
            // Pause video during inspection
            if (this.isPlaying) this.togglePlayPause();

            const clips = this.getFilteredClips();
            const clip = clips[this.currentIndex];
            const lines = clip.lines || [];
            const curLine = lines[this.activeLineIndex] || clip;

            let info = null;
            const lower = rawWord.toLowerCase();

            // 1. Check in line keyWords or clip keyWords
            const pool = (curLine.keyWords || []).concat(clip.keyWords || []);
            info = pool.find(k => k.word.toLowerCase() === lower || (k.root && k.root.toLowerCase() === lower));

            // 2. If not found and it's Serbian: use GrammarEngine or seed dictionary
            if (!info && lang === 'sr') {
                if (window.GrammarEngine && window.GrammarEngine.analyzeWord) {
                    const gInfo = window.GrammarEngine.analyzeWord(rawWord);
                    if (gInfo) {
                        info = {
                            word: gInfo.originalWord || rawWord,
                            root: gInfo.root || rawWord,
                            pos: gInfo.pos || 'imenica',
                            caseTag: gInfo.caseTag || 'Osnovni oblik',
                            trans: gInfo.translation || 'Prevod dostupan u rečniku',
                            explanation: gInfo.explanation || null
                        };
                    }
                }
            }

            // 3. If English or not found: query Omni-Bar dictionary search!
            if (!info && window.app && window.app._fuzzySearchDictionary) {
                const searchRes = window.app._fuzzySearchDictionary(rawWord);
                if (searchRes && searchRes.results && searchRes.results.length > 0) {
                    const match = searchRes.results[0];
                    if (lang === 'en') {
                        info = {
                            word: rawWord,
                            root: match.en || rawWord,
                            pos: match.pos || 'noun / verb',
                            caseTag: 'English Vocabulary',
                            trans: `${match.sr_lat || ''} (${match.sr_cyr || ''})`
                        };
                    } else {
                        info = {
                            word: rawWord,
                            root: match.sr_lat || rawWord,
                            pos: match.pos || 'imenica',
                            caseTag: 'Rečnik',
                            trans: match.en || 'Prevod'
                        };
                    }
                }
            }

            // Fallback definition
            if (!info) {
                info = {
                    word: rawWord,
                    root: rawWord,
                    pos: lang === 'en' ? 'English Word' : 'Srpska Reč',
                    caseTag: lang === 'en' ? 'Vocabulary' : 'Kontekstna Analiza',
                    trans: lang === 'en' ? 'Engleski izraz u dijalogu' : 'Srpski izraz u dijalogu'
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
                    this.saveWordToSRS(info.root, info.trans, curLine.subSrLat || clip.subSrLat);
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

            const lines = clip.lines || [];
            const curLine = lines[this.activeLineIndex] || clip;
            const direction = this.getDirection();
            const isEnglish = (direction === 'sr_to_en');

            const text = isEnglish ? curLine.subEn : curLine.subSrLat;
            const langCode = isEnglish ? 'en-US' : 'sr-RS';
            const shortLang = isEnglish ? 'en' : 'sr';

            if (window.app && window.app.speak) {
                window.app.speak(text, shortLang);
            } else if ('speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(text);
                u.lang = langCode;
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