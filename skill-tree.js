// [SHIELD_DAEMON: VALIDATED]
// Skill Tree Data Structure & Engine for SerboLingo
// Phase 3: Duolingo-style progression system

const SKILL_TREE = [
    // Slang Node inserted as an Optional fun path in TIER 1
    { id: 'slang', name: 'Ulični Srpski', nameEn: 'Street Slang', emoji: '🌶️', category: 'slang', prereqs: [], optional: true, difficulty: 2, guideHtml: `
<div class="space-y-5 text-slate-800 dark:text-slate-100">
    <div class="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border-2 border-orange-500/30 rounded-2xl p-4">
        <h3 class="text-base font-black text-orange-600 dark:text-orange-400 mb-1 flex items-center gap-2">
            <span>🌶️</span> Dobrodošli u Ulični Srpski!
        </h3>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Srpski jezik je čuven po bogatim, duhovitim i emotivnim izrekama koje se ne mogu doslovno prevesti. Ispod je tvoj vodič za autentične kulturne fraze, izraze nežnosti i beogradski žargon.
        </p>
    </div>

    <!-- Section 1: Narodne Izreke -->
    <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>👵</span> Narodne Izreke & Kulturne Fraze
        </h4>
        <div class="space-y-3">
            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <h5 class="text-base font-black text-slate-900 dark:text-white">Ljubi te baka sine</h5>
                            <span class="text-xs font-serif text-slate-400">(Љуби те бака сине)</span>
                        </div>
                        <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Bezgranična bakina ljubav i privrženost</span></p>
                        <p class="text-[11px] text-slate-400 italic">Doslovno: "Grandma kisses you, son"</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); SlangEngine.toggleStar('idm1', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-base text-slate-400 hover:text-yellow-400 bg-slate-100 dark:bg-slate-700 active:scale-90 transition-all" title="Dodaj u Flashcards">★</button>
                        <button onclick="event.stopPropagation(); SlangEngine.playAudio('ljubi te baka sine')" class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-blue-500 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 active:scale-90 transition-all">🔊</button>
                    </div>
                </div>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 KADA SE KORISTI:</span> Govore bake unucima i unukama (bez obzira na pol) dok ih nude sarmom, pitom ili štipaju za obraze.
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <h5 class="text-base font-black text-slate-900 dark:text-white">Bogu iza nogu</h5>
                            <span class="text-xs font-serif text-slate-400">(Богу иза ногу)</span>
                        </div>
                        <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Na kraju sveta / U teškoj nedođiji</span></p>
                        <p class="text-[11px] text-slate-400 italic">Doslovno: "Behind God's legs"</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); SlangEngine.toggleStar('idm2', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-base text-slate-400 hover:text-yellow-400 bg-slate-100 dark:bg-slate-700 active:scale-90 transition-all" title="Dodaj u Flashcards">★</button>
                        <button onclick="event.stopPropagation(); SlangEngine.playAudio('bogu iza nogu')" class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-blue-500 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 active:scale-90 transition-all">🔊</button>
                    </div>
                </div>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 KADA SE KORISTI:</span> Za mesta toliko izolovana i daleka da tamo jedva dopire signal ili civilizacija.
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <h5 class="text-base font-black text-slate-900 dark:text-white">Mlatiti praznu slamu</h5>
                            <span class="text-xs font-serif text-slate-400">(Млатити празну сламу)</span>
                        </div>
                        <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Pričati uprazno / Gubiti vreme</span></p>
                        <p class="text-[11px] text-slate-400 italic">Doslovno: "Thrashing empty straw"</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); SlangEngine.toggleStar('idm4', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-base text-slate-400 hover:text-yellow-400 bg-slate-100 dark:bg-slate-700 active:scale-90 transition-all" title="Dodaj u Flashcards">★</button>
                        <button onclick="event.stopPropagation(); SlangEngine.playAudio('mlatiti praznu slamu')" class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-blue-500 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 active:scale-90 transition-all">🔊</button>
                    </div>
                </div>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 KADA SE KORISTI:</span> Poljoprivredno poreklo: udaranje po slami bez zrna ne stvara hleb. Koristi se kada se vodi jalov razgovor bez ikakvih rezultata.
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <h5 class="text-base font-black text-slate-900 dark:text-white">Kad na vrbi rodi grožđe</h5>
                            <span class="text-xs font-serif text-slate-400">(Кад на врби роди грожђе)</span>
                        </div>
                        <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Nikada / Nemoguća misija</span></p>
                        <p class="text-[11px] text-slate-400 italic">Doslovno: "When grapes grow on a willow"</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); SlangEngine.toggleStar('idm5', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-base text-slate-400 hover:text-yellow-400 bg-slate-100 dark:bg-slate-700 active:scale-90 transition-all" title="Dodaj u Flashcards">★</button>
                        <button onclick="event.stopPropagation(); SlangEngine.playAudio('kad na vrbi rodi grožđe')" class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-blue-500 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 active:scale-90 transition-all">🔊</button>
                    </div>
                </div>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 KADA SE KORISTI:</span> Kada neko daje nerealna obećanja koja se sigurno nikad neće ostvariti.
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-baseline gap-2">
                            <h5 class="text-base font-black text-slate-900 dark:text-white">Košta ko svetog Petra kajgana</h5>
                            <span class="text-xs font-serif text-slate-400">(Кошта ко светог Петра кајгана)</span>
                        </div>
                        <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Preskupo / Paprena cena</span></p>
                        <p class="text-[11px] text-slate-400 italic">Doslovno: "Costs like St. Peter's scrambled eggs"</p>
                    </div>
                    <div class="flex items-center gap-1">
                        <button onclick="event.stopPropagation(); SlangEngine.toggleStar('idm9', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-base text-slate-400 hover:text-yellow-400 bg-slate-100 dark:bg-slate-700 active:scale-90 transition-all" title="Dodaj u Flashcards">★</button>
                        <button onclick="event.stopPropagation(); SlangEngine.playAudio('košta ko svetog Petra kajgana')" class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-blue-500 bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 active:scale-90 transition-all">🔊</button>
                    </div>
                </div>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 KADA SE KORISTI:</span> Šok kada stigne preteran račun u kafani ili majstorska tarifa.
                </div>
            </div>
        </div>
    </div>

    <!-- Section 2: Nežnost & Ljubav -->
    <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>❤️</span> Nežnost & Emotivni Izrazi
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <h5 class="text-sm font-black text-slate-900 dark:text-white">Dušo moja</h5>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">My soul / Darling</p>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('dušo moja')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <h5 class="text-sm font-black text-slate-900 dark:text-white">Srce moje</h5>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">My heart / Sweetheart</p>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('srce moje')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <h5 class="text-sm font-black text-slate-900 dark:text-white">Zlato moje</h5>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">My gold / Precious</p>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('zlato moje')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <h5 class="text-sm font-black text-slate-900 dark:text-white">Sunce moje</h5>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">My sunshine</p>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('sunce moje')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
        </div>
    </div>

    <!-- Section 3: Beogradski Žargon -->
    <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>🏙️</span> Beogradski Žargon
        </h4>
        <div class="space-y-2">
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <span class="font-black text-slate-900 dark:text-white text-sm">Brate</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">— Bro / Dude (Univerzalni poziv)</span>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('brate')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <span class="font-black text-slate-900 dark:text-white text-sm">Bleja</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">— Chilling / Druženje bez žurbe</span>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('bleja')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <span class="font-black text-slate-900 dark:text-white text-sm">Vrh</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">— Awesome / Vrhunski (Doslovno: peak)</span>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('vrh')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center shadow-sm">
                <div>
                    <span class="font-black text-slate-900 dark:text-white text-sm">Gas</span>
                    <span class="text-xs text-slate-500 dark:text-slate-400 ml-1">— Pun gas / Visoka energija / Hype</span>
                </div>
                <button onclick="event.stopPropagation(); SlangEngine.playAudio('gas')" class="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-slate-100 dark:bg-slate-700 text-blue-500 active:scale-90 transition-all">🔊</button>
            </div>
        </div>
    </div>

    <!-- SRS Flashcard Deck Banner -->
    <div class="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 p-3.5 rounded-2xl flex gap-3 items-center">
        <div class="text-2xl shrink-0">📱</div>
        <p class="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
            <b>Flashcards & SRS Integracija:</b> Svaka greška u lekciji "Ulični srpski" ili u Igraonici automatski se beleži u tvoj <b>Flashcard Deck</b> za ponavljanje! Takođe možeš tapnuti na zvezdicu (★) na bilo kom izrazu da ga sačuvaš.
        </p>
    </div>
</div>`, guideHtmlSr: `
<div class="space-y-5 text-slate-800 dark:text-slate-100">
    <div class="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 rounded-2xl p-4">
        <h3 class="text-base font-black text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-2">
            <span>🇬🇧</span> Engleske Idiomatske Fraze
        </h3>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Kao i u srpskom, engleski jezik ima idiome koje ne možete prevoditi reč-po-reč. Evo najvažnijih kulturnih izraza koje izvorni govornici koriste svakog dana:
        </p>
    </div>

    <div class="space-y-3">
        <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h5 class="text-sm font-black text-slate-900 dark:text-white">Bite the bullet</h5>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Stisnuti zube / Pregristi nešto neprijatno</span></p>
            <p class="text-[11px] text-slate-400 italic">Doslovno: "Zagristi metak"</p>
        </div>

        <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h5 class="text-sm font-black text-slate-900 dark:text-white">Break a leg!</h5>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Srećno! (Pozorišna tradicija za sreću)</span></p>
            <p class="text-[11px] text-slate-400 italic">Doslovno: "Slomi nogu!"</p>
        </div>

        <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h5 class="text-sm font-black text-slate-900 dark:text-white">Piece of cake</h5>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Prosto k'o pasulj / Dečja igra</span></p>
            <p class="text-[11px] text-slate-400 italic">Doslovno: "Komad torte"</p>
        </div>

        <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h5 class="text-sm font-black text-slate-900 dark:text-white">Spill the beans</h5>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Otkriti tajnu / Izlanuti se</span></p>
            <p class="text-[11px] text-slate-400 italic">Doslovno: "Prosuti pasulj"</p>
        </div>

        <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h5 class="text-sm font-black text-slate-900 dark:text-white">Cost an arm and a leg</h5>
            <p class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Košta ko svetog Petra kajgana</span></p>
            <p class="text-[11px] text-slate-400 italic">Doslovno: "Košta ruku i nogu"</p>
        </div>
    </div>
</div>` },

    // Priority 50: Cultural Etiquette & Slava Node
    { id: 'balkanski_bonton', name: 'Balkanski Bonton', nameEn: 'Balkan Etiquette & Slava', emoji: '🥂', category: 'customs', prereqs: [], optional: true, difficulty: 2, guideHtml: `
<div class="space-y-5 text-slate-800 dark:text-slate-100">
    <div class="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-4">
        <h3 class="text-base font-black text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-2">
            <span>🥂</span> Balkanski Bonton & Krsna Slava
        </h3>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Kultura u Srbiji i na Balkanu počiva na nepisanim pravilima gostoprimstva, toplini i poštovanju običaja. Ovaj vodič otkriva ti ključne rituale slave, nazdravljanja i kućnog bontona.
        </p>
    </div>

    <!-- Section 1: Krsna Slava -->
    <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>🕯️</span> Običaji Krsne Slave (UNESCO Baština)
        </h4>
        <div class="space-y-3">
            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex items-baseline justify-between">
                    <h5 class="text-base font-black text-slate-900 dark:text-white">Srećna slava, domaćine!</h5>
                    <span class="text-xs font-serif text-slate-400">(Срећна слава, домаћине!)</span>
                </div>
                <p class="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Glavni svečani pozdrav pri ulasku u kuću</span></p>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 OBIČAJ:</span> Domaćin dočekuje gosta na vratima sa osmehom i tri poljupca u obraz. Domaćin odgovara: <i>"Hvala, dobrodošli!"</i>.
                </div>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex items-baseline justify-between">
                    <h5 class="text-base font-black text-slate-900 dark:text-white">Slavski kolač & Žito (Koljivo)</h5>
                    <span class="text-xs font-serif text-slate-400">(Славски колач и жито)</span>
                </div>
                <p class="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">Značenje: <span class="font-medium text-slate-700 dark:text-slate-200">Sveti obredni hleb i kuvana pšenica sa medom</span></p>
                <div class="mt-2 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                    <span class="font-black text-amber-500">💡 RITUAL:</span> Po ulasku u kuću, svaki gost se prekrsti, uzme kašičicu žita (koljiva) iz posude i popije gutljaj vode u čast sveca zaštitnika.
                </div>
            </div>
        </div>
    </div>

    <!-- Section 2: Gostoprimstvo & Kafana -->
    <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>☕</span> Gostoprimstvo & Otimanje za račun
        </h4>
        <div class="space-y-3">
            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h5 class="text-base font-black text-slate-900 dark:text-white">Živeli u oči! (Gledanje u oči pri nazdravljanju)</h5>
                <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Pravilo: <span class="font-medium text-slate-700 dark:text-slate-200">Nikada ne skreći pogled dok kucaš čaše</span></p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Po starom balkanskom verovanju, ko ne gleda u oči sagovornika dok nazdravlja imaće 7 godina loše sreće. Uvek nazdravi uz čvrst pogled i osmeh.</p>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h5 class="text-base font-black text-slate-900 dark:text-white">Otimanje za račun u kafani</h5>
                <p class="text-xs font-bold text-rose-600 dark:text-rose-400 mt-0.5">Znak poštovanja: <span class="font-medium text-slate-700 dark:text-slate-200">Borba ko će pre da plati za celo društvo</span></p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Deljenje računa u dinar se smatra hladnim. Pravi domaćin ili prijatelj uvek teatralno otima račun od konobara govoreći: <i>"Skloni novčanik, ja sam zvao!"</i>.</p>
            </div>
        </div>
    </div>
</div>` },

    // Priority 50: Kafana Gastronomy Node
    { id: 'kafanska_trpeza', name: 'Kafanska Trpeza', nameEn: 'Kafana Gastronomy', emoji: '🍖', category: 'gastronomy', prereqs: ['balkanski_bonton'], optional: true, difficulty: 2, guideHtml: `
<div class="space-y-5 text-slate-800 dark:text-slate-100">
    <div class="bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 border-2 border-red-500/30 rounded-2xl p-4">
        <h3 class="text-base font-black text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
            <span>🍖</span> Tradicionalna Balkanska Trpeza
        </h3>
        <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Kafana je srce društvenog života na Balkanu. Ovde se poslovi sklapaju uz meze, muzika svira "na uvce", a roštilj i domaća jela pripremaju sa posebnom ljubavlju.
        </p>
    </div>

    <!-- Section 1: Ikonična Jela -->
    <div>
        <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>🍲</span> Glavna Kafanska Jela
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-2xl">🥩</span>
                    <h5 class="font-black text-slate-900 dark:text-white">Karađorđeva šnicla</h5>
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-[11px]">Pohovani odrezak punjen zrelim kajmakom, serviran sa tartar sosom. Čuveni srpski specijalitet.</p>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-2xl">🥬</span>
                    <h5 class="font-black text-slate-900 dark:text-white">Domaća Sarma</h5>
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-[11px]">Listovi kiselog kupusa punjeni mlevenim mesom i pirinčem, krčkani satima sa suvim mesom.</p>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-2xl">🍲</span>
                    <h5 class="font-black text-slate-900 dark:text-white">Prebranac</h5>
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-[11px]">Zapečeni beli pasulj sa slatkom alevom paprikom i karamelizovanim lukom u zemljanoj posudi.</p>
            </div>

            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-2xl">🍢</span>
                    <h5 class="font-black text-slate-900 dark:text-white">Ćevapi & Pljeskavica</h5>
                </div>
                <p class="text-slate-600 dark:text-slate-300 text-[11px]">Naručuje se kao <i>"deset upola s lukom"</i> (deset ćevapa u pola somuna) uz kajmak i urnebes.</p>
            </div>
        </div>
    </div>
</div>` },

    // --- TIER 1: FOUNDATION (all unlocked from start, paired layout) ---
    { id: 'alphabet', name: 'Azbuka', nameEn: 'Alphabet', emoji: '🔤', category: 'alphabet', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-6">
    <p>Serbian uses <b>two scripts</b> that map perfectly 1-to-1. Below are all 30 letters in both Printed and <span class="font-cursive text-xl">Cursive</span> formats.</p>
    
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
        <h4 class="font-black text-blue-600 dark:text-blue-400 text-lg mb-3">Latinica (Latin)</h4>
        <div class="flex flex-wrap gap-2">
            <!-- 30 Latin Letters -->
            ${'A B C Č Ć D Dž Đ E F G H I J K L Lj M N Nj O P R S Š T U V Z Ž'.split(' ').map(l => `<div class="flex flex-col items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-12"><div class="font-black text-xl text-slate-800 dark:text-slate-100">${l}</div><div class="font-cursive text-2xl text-blue-600 dark:text-blue-400 leading-none mt-1">${l}</div></div>`).join('')}
        </div>
    </div>

    <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-xl">
        <h4 class="font-black text-rose-600 dark:text-rose-400 text-lg mb-3">Ćirilica (Cyrillic)</h4>
        <div class="flex flex-wrap gap-2">
            <!-- 30 Cyrillic Letters -->
            ${'А Б В Г Д Ђ Е Ж З И Ј К Л Љ М Н Њ О П Р С Т Ћ У Ф Х Ц Ч Џ Ш'.split(' ').map(l => `<div class="flex flex-col items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-12"><div class="font-black text-xl text-slate-800 dark:text-slate-100">${l}</div><div class="font-cursive text-2xl text-rose-600 dark:text-rose-400 leading-none mt-1">${l}</div></div>`).join('')}
        </div>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-6">
    <p>Engleski alfabet ima <b>26 slova</b>. Nema posebnih slova (kvačica) kao u srpskom.</p>
    
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
        <h4 class="font-black text-blue-600 dark:text-blue-400 text-lg mb-3">Engleski Alfabet</h4>
        <div class="flex flex-wrap gap-2">
            ${'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ').map(l => `<div class="flex flex-col items-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 w-10"><div class="font-black text-xl text-slate-800 dark:text-slate-100">${l}</div><div class="font-bold text-slate-400 mt-1 lowercase">${l}</div></div>`).join('')}
        </div>
    </div>

    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-amber-700 dark:text-amber-400 text-sm">Ključna razlika:</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">U engleskom, slova se <b>NE čitaju</b> uvek onako kako se pišu! (Npr: "C" se čita kao /k/ u reči "cat", ali kao /s/ u "city").</p>
    </div>
    <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-rose-700 dark:text-rose-400 text-sm">Slova koja ne postoje u engleskom:</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Č, Ć, Ž, Š, Đ, Dž, Lj, Nj. Umesto njih engleski koristi kombinacije: CH, SH, ZH...</p>
    </div>
</div>` },
    { id: 'numbers', name: 'Brojevi', nameEn: 'Numbers', emoji: '🔢', category: 'numbers', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-4">
    <p>Numbers 1-10 are the foundation:</p>
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table class="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr><th class="px-2 py-2">#</th><th class="px-2 py-2">Serbian</th><th class="px-2 py-2">#</th><th class="px-2 py-2">Serbian</th></tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">1</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">jedan</td><td class="px-2 py-1.5 font-bold">6</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">šest</td></tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">2</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">dva</td><td class="px-2 py-1.5 font-bold">7</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">sedam</td></tr>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">3</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">tri</td><td class="px-2 py-1.5 font-bold">8</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">osam</td></tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">4</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">četiri</td><td class="px-2 py-1.5 font-bold">9</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">devet</td></tr>
                <tr class="bg-white dark:bg-slate-900"><td class="px-2 py-1.5 font-bold">5</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">pet</td><td class="px-2 py-1.5 font-bold">10</td><td class="px-2 py-1.5 text-blue-600 dark:text-blue-400 font-bold">deset</td></tr>
            </tbody>
        </table>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2 rounded-xl mt-2">
        <p class="text-xs text-amber-700 dark:text-amber-400"><b>Gender Change:</b> jedan/jedn<span class="text-rose-500 font-bold">a</span>/jedn<span class="text-amber-500 font-bold">o</span> &bull; dva/dv<span class="text-rose-500 font-bold">e</span></p>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Engleski brojevi su jednostavni - <b>ne menjaju se po rodu</b>!</p>
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl">
        <p class="text-sm text-slate-700 dark:text-slate-300">Za razliku od srpskog (jedan/jedna/jedno), u engleskom je uvek samo <b>"one"</b>.</p>
        <p class="text-xs text-slate-500 mt-2">One cat, one dog, one house - uvek isto!</p>
    </div>
</div>` },
    { id: 'colors', name: 'Boje', nameEn: 'Colors', emoji: '🎨', category: 'colors', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-4">
    <p>Colors are adjectives, meaning they must match the gender of the noun they describe!</p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-xl">
            <h4 class="font-black text-blue-600 dark:text-blue-400">Masculine</h4>
            <p class="text-sm mt-1">crven auto</p>
        </div>
        <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 rounded-xl">
            <h4 class="font-black text-rose-600 dark:text-rose-400">Feminine</h4>
            <p class="text-sm mt-1">crven<span class="font-bold text-rose-500">a</span> kuća</p>
        </div>
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl">
            <h4 class="font-black text-amber-600 dark:text-amber-400">Neuter</h4>
            <p class="text-sm mt-1">crven<span class="font-bold text-amber-500">o</span> nebo</p>
        </div>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Boje u engleskom jeziku su <b>nepromenljive</b>!</p>
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl">
        <p class="text-sm text-slate-700 dark:text-slate-300">Ne menjaju se po rodu, broju ni padežu.</p>
        <p class="text-xs text-slate-500 mt-2">Red car, red house, red sky - uvek "red"!</p>
    </div>
</div>` },
    { id: 'basics', name: 'Osnove', nameEn: 'Basics', emoji: '🌱', category: 'basics', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-4">
    <p>Welcome to Serbian! The verb <b>to be (biti)</b> is very important:</p>
    <div class="grid grid-cols-2 gap-2 mt-2">
        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-center">
            <p class="font-bold">Ja sam</p><p class="text-xs text-slate-500">I am</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-center">
            <p class="font-bold">Ti si</p><p class="text-xs text-slate-500">You are</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-center col-span-2">
            <p class="font-bold">On/Ona/Ono je</p><p class="text-xs text-slate-500">He/She/It is</p>
        </div>
    </div>
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-xl mt-2">
        <p class="text-sm text-slate-700 dark:text-slate-300"><b>No Articles!</b> Serbian doesn't use 'a', 'an', or 'the'. "A cat" and "the cat" are both just <b>mačka</b>.</p>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Dobrodošli u engleski! Glagol <b>to be (biti)</b> je osnova:</p>
    <div class="grid grid-cols-2 gap-2 mt-2">
        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-center">
            <p class="font-bold">I am</p><p class="text-xs text-slate-500">Ja sam</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-center">
            <p class="font-bold">You are</p><p class="text-xs text-slate-500">Ti si / Vi ste</p>
        </div>
        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-xl text-center col-span-2">
            <p class="font-bold">He/She/It is</p><p class="text-xs text-slate-500">On/Ona/Ono je</p>
        </div>
    </div>
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-amber-700 dark:text-amber-400 text-sm">Članovi (Articles):</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Engleski koristi članove <b>a, an, the</b> ispred imenica, za razliku od srpskog!</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li><b>A/An</b>: Bilo koja mačka (A cat)</li>
            <li><b>The</b>: Tačno ta mačka (The cat)</li>
        </ul>
    </div>
</div>` },
    { id: 'phrases', name: 'Fraze', nameEn: 'Phrases', emoji: '💬', category: 'phrases', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-4">
    <p>Essential survival phrases!</p>
    <div class="space-y-2">
        <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <span class="font-bold text-blue-700 dark:text-blue-300">Gde je...?</span>
            <span class="text-sm text-slate-500">Where is...?</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50">
            <span class="font-bold text-rose-700 dark:text-rose-300">Koliko košta?</span>
            <span class="text-sm text-slate-500">How much is it?</span>
        </div>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Osnovne fraze za preživljavanje!</p>
    <div class="space-y-2">
        <div class="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
            <span class="font-bold text-blue-700 dark:text-blue-300">Where is...?</span>
            <span class="text-sm text-slate-500">Gde je...?</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800/50">
            <span class="font-bold text-rose-700 dark:text-rose-300">How much is it?</span>
            <span class="text-sm text-slate-500">Koliko košta?</span>
        </div>
    </div>
</div>` },
    { id: 'verbs', name: 'Glagoli', nameEn: 'Verbs', emoji: '🏃', category: 'verbs', prereqs: [], optional: false, difficulty: 2, guideHtml: `
<div class="space-y-4">
    <p>Most verbs end in <b>-ti</b> or <b>-ći</b> in their infinitive form (e.g., raditi = to work).</p>
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2">
        <table class="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr><th class="px-2 py-2">Pronoun</th><th class="px-2 py-2">Present Tense (raditi)</th></tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">Ja</td><td class="px-2 py-1.5">radi<span class="font-black text-blue-500">m</span></td></tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">Ti</td><td class="px-2 py-1.5">radi<span class="font-black text-blue-500">š</span></td></tr>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700"><td class="px-2 py-1.5 font-bold">On/Ona</td><td class="px-2 py-1.5">radi</td></tr>
            </tbody>
        </table>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Glagoli u engleskom su mnogo jednostavniji!</p>
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-blue-700 dark:text-blue-400 text-sm">Pravilo za Present Simple:</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Glagol se ne menja, osim za <b>He/She/It</b> gde dobija nastavak <span class="font-bold text-blue-600">-s</span>.</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>I work, You work, We work, They work</li>
            <li>He work<span class="font-bold text-blue-600">s</span>, She work<span class="font-bold text-blue-600">s</span></li>
        </ul>
    </div>
</div>` },
    { id: 'pronouns', name: 'Zamenice', nameEn: 'Pronouns', emoji: '👈', category: 'pronouns', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-4">
    <p>Pronouns replace nouns. Here are the subject pronouns:</p>
    <div class="grid grid-cols-2 gap-2 mt-2">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2 rounded-xl text-center"><span class="font-bold">Ja</span> (I)</div>
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2 rounded-xl text-center"><span class="font-bold">Mi</span> (We)</div>
        <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-2 rounded-xl text-center"><span class="font-bold">Ti</span> (You)</div>
        <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-2 rounded-xl text-center"><span class="font-bold">Vi</span> (You all / Formal)</div>
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2 rounded-xl text-center"><span class="font-bold text-xs">On/Ona/Ono</span> (He/She/It)</div>
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2 rounded-xl text-center"><span class="font-bold">Oni/One/Ona</span> (They)</div>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Lične zamenice u engleskom:</p>
    <div class="grid grid-cols-2 gap-2 mt-2">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2 rounded-xl text-center"><span class="font-bold">I</span> (Ja)</div>
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-2 rounded-xl text-center"><span class="font-bold">We</span> (Mi)</div>
        <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-2 rounded-xl text-center"><span class="font-bold">You</span> (Ti / Vi)</div>
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2 rounded-xl text-center"><span class="font-bold text-xs">He/She/It</span> (On/Ona/Ono)</div>
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-2 rounded-xl text-center col-span-2"><span class="font-bold">They</span> (Oni/One/Ona)</div>
    </div>
    <p class="text-xs text-slate-500 mt-2">Napomena: Engleski uvek zahteva upotrebu zamenica uz glagol, dok ih srpski često izostavlja (npr. "I work" a ne samo "work").</p>
</div>` },
    { id: 'adjectives', name: 'Pridevi', nameEn: 'Adjectives', emoji: '✨', category: 'adjectives', prereqs: [], optional: false, difficulty: 2, guideHtml: `
<div class="space-y-4">
    <p>Adjectives describe nouns and <b>MUST</b> match their gender and case!</p>
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2">
        <table class="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr><th class="px-2 py-2">Gender</th><th class="px-2 py-2">Example (Good)</th></tr>
            </thead>
            <tbody>
                <tr class="bg-blue-50/50 dark:bg-blue-900/10 border-b dark:border-slate-700"><td class="px-2 py-2 font-bold text-blue-600 dark:text-blue-400">Masc</td><td class="px-2 py-2">Dobar dan (Good day)</td></tr>
                <tr class="bg-rose-50/50 dark:bg-rose-900/10 border-b dark:border-slate-700"><td class="px-2 py-2 font-bold text-rose-600 dark:text-rose-400">Fem</td><td class="px-2 py-2">Dobr<span class="font-bold text-rose-500">a</span> noć (Good night)</td></tr>
                <tr class="bg-amber-50/50 dark:bg-amber-900/10"><td class="px-2 py-2 font-bold text-amber-600 dark:text-amber-400">Neut</td><td class="px-2 py-2">Dobr<span class="font-bold text-amber-500">o</span> jutro (Good morning)</td></tr>
            </tbody>
        </table>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Pridevi u engleskom su <b>potpuno nepromenljivi</b>!</p>
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-green-700 dark:text-green-400 text-sm">Nema promene po rodu, broju i padežu!</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Reč <b>"Good"</b> (Dobar) uvek ostaje ista.</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>Good day (Dobar dan)</li>
            <li>Good night (Dobra noć)</li>
            <li>Good morning (Dobro jutro)</li>
            <li>Good boys (Dobri dečaci)</li>
        </ul>
    </div>
</div>` },
    { id: 'gender', name: 'Gramatika: Rod', nameEn: 'Grammar: Gender', emoji: '⚖️', category: 'gender', prereqs: [], optional: false, difficulty: 1, guideHtml: `
<div class="space-y-4">
    <p>In Serbian, every single noun belongs to one of three genders. You can usually guess the gender by looking at the <b>last letter</b>!</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-xl">
            <h4 class="font-black text-blue-600 dark:text-blue-400 flex items-center justify-between">Masc (Muški) <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded-lg">Consonant</span></h4>
            <ul class="mt-2 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>prozo<span class="font-bold text-blue-500">r</span> (window)</li>
                <li>pa<span class="font-bold text-blue-500">s</span> (dog)</li>
                <li>telefo<span class="font-bold text-blue-500">n</span> (phone)</li>
            </ul>
        </div>
        <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 rounded-xl">
            <h4 class="font-black text-rose-600 dark:text-rose-400 flex items-center justify-between">Fem (Ženski) <span class="text-xs px-2 py-1 bg-rose-100 dark:bg-rose-800 rounded-lg">Ends in -a</span></h4>
            <ul class="mt-2 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>žen<span class="font-bold text-rose-500">a</span> (woman)</li>
                <li>kuć<span class="font-bold text-rose-500">a</span> (house)</li>
                <li>mačk<span class="font-bold text-rose-500">a</span> (cat)</li>
            </ul>
        </div>
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-xl">
            <h4 class="font-black text-amber-600 dark:text-amber-400 flex items-center justify-between">Neut (Srednji) <span class="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-800 rounded-lg">-o or -e</span></h4>
            <ul class="mt-2 text-sm space-y-1 text-slate-700 dark:text-slate-300">
                <li>sel<span class="font-bold text-amber-500">o</span> (village)</li>
                <li>mor<span class="font-bold text-amber-500">e</span> (sea)</li>
                <li>srtrc<span class="font-bold text-amber-500">e</span> (heart)</li>
            </ul>
        </div>
    </div>
    <p class="text-xs text-slate-500 italic mt-2">Note: Adjectives and Verbs change their endings to match the noun they are attached to.</p>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>U engleskom jeziku imenice <b>NEMAJU ROD</b>!</p>
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl mt-2">
        <p class="text-sm text-slate-700 dark:text-slate-300">Ne postoji muški, ženski ili srednji rod za predmete (sto, stolica, drvo). Sve stvari su uvek <b>"It"</b>.</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>Where is the car? <b>It</b> is here. (Ne "He is here")</li>
            <li>Where is the house? <b>It</b> is big. (Ne "She is big")</li>
        </ul>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Jedini izuzetak su ljudi (He/She) i ponekad kućni ljubimci!</p>
    </div>
</div>` },

    // --- TIER 2: DAILY LIFE ---
    { id: 'food', name: 'Hrana', nameEn: 'Food & Drink', emoji: '🍽️', category: 'food', prereqs: ['alphabet', 'numbers', 'colors', 'basics', 'phrases', 'verbs', 'pronouns', 'adjectives', 'gender'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>When ordering food, use <b>"Molim vas..."</b> (Please...).</p><p>You can say <b>"Ja želim..."</b> (I want...).</p><p>Example: <i>Molim vas, jednu kafu!</i> (One coffee, please! - uses accusative case).</p></div>` },
    { id: 'cases_intro', name: 'Padeži (Uvod)', nameEn: 'Grammar: Cases (Intro)', emoji: '📐', category: 'cases_intro', prereqs: ['food'], optional: false, difficulty: 2, guideHtml: `
<div class="space-y-4">
    <p>Serbian has <b>7 grammatical cases</b> (padeži). They change the endings of words depending on their role in a sentence.</p>
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2">
        <table class="w-full text-sm text-left text-slate-600 dark:text-slate-300">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr><th class="px-3 py-2">Case</th><th class="px-3 py-2">Question</th><th class="px-3 py-2">Example (Dečak = Boy)</th></tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-3 py-2 font-black text-blue-500">1. Nominativ</td><td class="px-3 py-2 italic text-xs">Who/What?</td><td class="px-3 py-2">Ovo je <span class="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1 rounded font-bold">dečak</span></td>
                </tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-3 py-2 font-black text-purple-500">2. Genitiv</td><td class="px-3 py-2 italic text-xs">Of what/Whose?</td><td class="px-3 py-2">Nema <span class="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-1 rounded font-bold">dečak<span class="text-purple-900 dark:text-purple-100 underline decoration-2">a</span></span></td>
                </tr>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-3 py-2 font-black text-green-500">3. Dativ</td><td class="px-3 py-2 italic text-xs">To whom?</td><td class="px-3 py-2">Dajem <span class="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1 rounded font-bold">dečak<span class="text-green-900 dark:text-green-100 underline decoration-2">u</span></span></td>
                </tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-3 py-2 font-black text-rose-500">4. Akuzativ</td><td class="px-3 py-2 italic text-xs">Whom/What?</td><td class="px-3 py-2">Vidim <span class="bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 px-1 rounded font-bold">dečak<span class="text-rose-900 dark:text-rose-100 underline decoration-2">a</span></span></td>
                </tr>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-3 py-2 font-black text-amber-500">5. Vokativ</td><td class="px-3 py-2 italic text-xs">Hey!</td><td class="px-3 py-2">Hej, <span class="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1 rounded font-bold">dečač<span class="text-amber-900 dark:text-amber-100 underline decoration-2">e</span></span>!</td>
                </tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-3 py-2 font-black text-teal-500">6. Instrumental</td><td class="px-3 py-2 italic text-xs">With what?</td><td class="px-3 py-2">Sa <span class="bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 px-1 rounded font-bold">dečak<span class="text-teal-900 dark:text-teal-100 underline decoration-2">om</span></span></td>
                </tr>
                <tr class="bg-white dark:bg-slate-900">
                    <td class="px-3 py-2 font-black text-indigo-500">7. Lokativ</td><td class="px-3 py-2 italic text-xs">About/In?</td><td class="px-3 py-2">O <span class="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-1 rounded font-bold">dečak<span class="text-indigo-900 dark:text-indigo-100 underline decoration-2">u</span></span></td>
                </tr>
            </tbody>
        </table>
    </div>
    <p class="text-xs text-slate-500 italic mt-2">Don't panic! We'll learn them slowly one by one.</p>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Engleski jezik <b>NEMA PADEŽE</b>!</p>
    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-xl mt-2">
        <p class="text-sm text-slate-700 dark:text-slate-300">Ovo je najbolja vest za vas! Imenice se ne menjaju. Umesto padeža, engleski koristi <b>predloge</b> (in, on, at, to, from).</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>Ovo je <b>boy</b> (Nominativ)</li>
            <li>Vidim <b>boy</b> (Akuzativ)</li>
            <li>Dajem to the <b>boy</b> (Dativ)</li>
            <li>Idem sa the <b>boy</b> (Instrumental)</li>
        </ul>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Izuzetak: Zamenice (I ➡️ me, He ➡️ him) i genitiv sa apostrofom (boy's).</p>
    </div>
</div>` },
    { id: 'family', name: 'Porodica', nameEn: 'Family', emoji: '👪', category: 'family', prereqs: ['cases_intro'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Serbian family vocabulary is very specific.</p><p>For example, there are different words for uncle depending on the side of the family:</p><ul class="list-disc pl-5"><li><b>Stric</b> (father's brother)</li><li><b>Ujak</b> (mother's brother)</li><li><b>Teča</b> (aunt's husband)</li></ul></div>` },
    { id: 'household', name: 'Kuća', nameEn: 'Household', emoji: '🏠', category: 'household', prereqs: ['family'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Objects around the house. Pay attention to genders!</p><ul class="list-disc pl-5"><li>Sto (table) - Masculine</li><li>Stolica (chair) - Feminine</li><li>Kupatilo (bathroom) - Neuter</li></ul></div>` },
    { id: 'time', name: 'Vreme', nameEn: 'Time', emoji: '🕒', category: 'time', prereqs: ['household'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Time concepts. To ask the time, say: <b>Koliko je sati?</b></p></div>` },
    { id: 'days', name: 'Dani', nameEn: 'Days', emoji: '📅', category: 'days', prereqs: ['time'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Days of the week. Most end in -ak or -a.</p><ul class="list-disc pl-5"><li>Ponedeljak (Monday)</li><li>Sreda (Wednesday)</li><li>Petak (Friday)</li></ul></div>` },
    { id: 'months', name: 'Meseci', nameEn: 'Months', emoji: '🗓️', category: 'months', prereqs: ['days'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Months of the year are very similar to English!</p><p>Januar, Februar, Mart, April...</p></div>` },

    // --- TIER 3: SURVIVAL & SELF ---
    { id: 'directions', name: 'Pravci', nameEn: 'Directions', emoji: '🗺️', category: 'directions', prereqs: ['months'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Navigating the city.</p><ul class="list-disc pl-5"><li>Levo (Left)</li><li>Desno (Right)</li><li>Pravo (Straight)</li></ul></div>` },
    { id: 'prepositions', name: 'Predlozi', nameEn: 'Prepositions', emoji: '📍', category: 'prepositions', prereqs: ['directions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Prepositions tell you <b>where</b> and <b>when</b> things are. They always require a specific case!</p><ul class="list-disc pl-5"><li><b>u</b> (in) + Lokativ: u kući (in the house)</li><li><b>na</b> (on) + Lokativ: na stolu (on the table)</li><li><b>iz</b> (from) + Genitiv: iz škole (from school)</li><li><b>sa</b> (with) + Instrumental: sa bratom (with brother)</li><li><b>bez</b> (without) + Genitiv: bez vode (without water)</li></ul></div>` },
    { id: 'weather', name: 'Vreme', nameEn: 'Weather', emoji: '🌦️', category: 'weather', prereqs: ['prepositions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>The word <b>Vreme</b> means both 'Time' and 'Weather' in Serbian!</p><p>Example: <i>Kakvo je vreme danas?</i> (What is the weather like today?)</p></div>` },
    { id: 'body', name: 'Telo', nameEn: 'Body', emoji: '🗣️', category: 'body', prereqs: ['weather'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Parts of the human body.</p><p>If something hurts, you can say: <b>Boli me [body part]</b>.</p><p>Example: <i>Boli me glava</i> (My head hurts).</p></div>` },
    { id: 'health', name: 'Zdravlje', nameEn: 'Health', emoji: '🏥', category: 'health', prereqs: ['body'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Medical vocabulary. Essential for emergencies!</p><p><b>Hitna pomoć</b> means ambulance (literally: fast help).</p></div>` },
    { id: 'emotions', name: 'Osećanja', nameEn: 'Emotions', emoji: '😊', category: 'emotions', prereqs: ['health'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>To express feelings, you often use the verb <b>biti</b> (to be) + the adjective.</p><p>Example: <i>Ja sam srećan</i> (I am happy).</p></div>` },
    { id: 'conjunctions', name: 'Veznici', nameEn: 'Conjunctions', emoji: '🔗', category: 'conjunctions', prereqs: ['emotions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Conjunctions connect words and sentences together!</p><ul class="list-disc pl-5"><li><b>i</b> (and) - Ja i ti. (Me and you.)</li><li><b>ali</b> (but) - Lep ali skup. (Beautiful but expensive.)</li><li><b>ili</b> (or) - Kafa ili čaj? (Coffee or tea?)</li><li><b>jer</b> (because) - Idem jer moram. (I'm going because I must.)</li><li><b>da</b> (that/to) - Želim da jedem. (I want to eat.)</li><li><b>ako</b> (if) - Ako pada kiša... (If it rains...)</li></ul></div>` },

    // --- TIER 4: THE WORLD & LEISURE ---
    { id: 'travel', name: 'Putovanje', nameEn: 'Travel', emoji: '✈️', category: 'travel', prereqs: ['conjunctions'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Transportation and travel.</p><p>Example: <i>Gde je aerodrom?</i> (Where is the airport?)</p></div>` },
    { id: 'adverbs', name: 'Prilozi', nameEn: 'Adverbs', emoji: '⚡', category: 'adverbs', prereqs: ['travel'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Adverbs describe <b>how</b>, <b>when</b>, and <b>where</b> something happens. They never change form!</p><ul class="list-disc pl-5"><li><b>brzo</b> (quickly) - On trči brzo. (He runs quickly.)</li><li><b>polako</b> (slowly) - Govori polako. (Speak slowly.)</li><li><b>dobro</b> (well) - Ona peva dobro. (She sings well.)</li><li><b>uvek</b> (always) - Uvek kasnim. (I'm always late.)</li><li><b>nikad</b> (never) - Nikad ne laže. (He never lies.)</li></ul></div>` },
    { id: 'clothing', name: 'Odeća', nameEn: 'Clothing', emoji: '👕', category: 'clothing', prereqs: ['adverbs'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Combine clothes with colors!</p><p>Example: <i>Zelena majica</i> (Green t-shirt).</p></div>` },
    { id: 'comparatives', name: 'Poređenje', nameEn: 'Comparatives', emoji: '⚖️', category: 'comparatives', prereqs: ['clothing'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>English rules:</b></p><ul class="list-disc pl-5"><li>Short words: add <b>-er</b> / <b>-est</b> (fast, faster, fastest)</li><li>Long words: use <b>more</b> / <b>most</b> (beautiful, more beautiful)</li><li>Double consonant if short: big → bi<b>gg</b>er</li><li>Drop 'y' for 'i': happy → happ<b>i</b>er</li></ul><p><b>Serbian rules:</b></p><ul class="list-disc pl-5"><li>Add <b>-iji</b>, <b>-ji</b>, or <b>-ši</b> for comparatives (brz → brži)</li><li>Add the prefix <b>naj-</b> for superlatives (najbrži)</li></ul></div>` },
    { id: 'animals', name: 'Životinje', nameEn: 'Animals', emoji: '🐾', category: 'animals', prereqs: ['comparatives'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Notice that many animal names end in <b>-a</b>, making them feminine nouns (mačka, ptica, krava).</p><p>Masculine nouns usually end in a consonant (pas, medved).</p></div>` },
    { id: 'nature', name: 'Priroda', nameEn: 'Nature', emoji: '🌳', category: 'nature', prereqs: ['animals'], optional: false, difficulty: 1, guideHtml: `<div class="space-y-4"><p>Beautiful nature words!</p><p>Did you know? The word for 'earth' and 'country' is the same: <b>Zemlja</b>.</p></div>` },
    { id: 'sports', name: 'Sport', nameEn: 'Sports', emoji: '⚽', category: 'sports', prereqs: ['nature'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Serbia is very famous for sports!</p><p>Many sports words are borrowed: <i>fudbal, tenis, košarka</i>.</p></div>` },
    { id: 'past_tense', name: 'Prošlo vreme', nameEn: 'Past Tense', emoji: '⏪', category: 'past_tense', prereqs: ['sports'], optional: false, difficulty: 3, guideHtml: `
<div class="space-y-4">
    <p>The past tense is built like Lego: <b>To Be (am/are/is) + Past Participle</b>.</p>
    <p>The ending of the main verb changes based on <b>Gender</b>!</p>
    
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2">
        <table class="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                    <th class="px-2 py-2">Pronoun</th>
                    <th class="px-2 py-2">"To Be"</th>
                    <th class="px-2 py-2 text-blue-500">Masc (M)</th>
                    <th class="px-2 py-2 text-rose-500">Fem (F)</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">Ja (I)</td>
                    <td class="px-2 py-2 font-black text-amber-500">sam</td>
                    <td class="px-2 py-2 bg-blue-50/50 dark:bg-blue-900/10">radi<span class="font-black text-blue-600 dark:text-blue-400">o</span></td>
                    <td class="px-2 py-2 bg-rose-50/50 dark:bg-rose-900/10">radi<span class="font-black text-rose-600 dark:text-rose-400">la</span></td>
                </tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">Ti (You)</td>
                    <td class="px-2 py-2 font-black text-amber-500">si</td>
                    <td class="px-2 py-2 bg-blue-50/50 dark:bg-blue-900/10">radi<span class="font-black text-blue-600 dark:text-blue-400">o</span></td>
                    <td class="px-2 py-2 bg-rose-50/50 dark:bg-rose-900/10">radi<span class="font-black text-rose-600 dark:text-rose-400">la</span></td>
                </tr>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">On/Ona</td>
                    <td class="px-2 py-2 font-black text-amber-500">je</td>
                    <td class="px-2 py-2 bg-blue-50/50 dark:bg-blue-900/10">(On) radi<span class="font-black text-blue-600 dark:text-blue-400">o</span></td>
                    <td class="px-2 py-2 bg-rose-50/50 dark:bg-rose-900/10">(Ona) radi<span class="font-black text-rose-600 dark:text-rose-400">la</span></td>
                </tr>
                <tr class="bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">Mi (We)</td>
                    <td class="px-2 py-2 font-black text-amber-500">smo</td>
                    <td colspan="2" class="px-2 py-2 text-purple-600 dark:text-purple-400 font-bold bg-purple-50/50 dark:bg-purple-900/10">radi<span class="font-black">li</span> (Plural)</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Prošlo vreme (Past Simple) u engleskom:</p>
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-blue-700 dark:text-blue-400 text-sm">Pravilni glagoli (Regular Verbs)</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Samo dodajte <b>-ed</b> na kraj glagola! Ne menja se po licima.</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>I work<b>ed</b> (Ja sam radio/radila)</li>
            <li>He work<b>ed</b> (On je radio)</li>
            <li>They work<b>ed</b> (Oni su radili)</li>
        </ul>
    </div>
    <div class="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-rose-700 dark:text-rose-400 text-sm">Nepravilni glagoli (Irregular Verbs)</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Moraju se naučiti napamet.</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>Go ➡️ <b>Went</b> (Išao sam)</li>
            <li>See ➡️ <b>Saw</b> (Video sam)</li>
            <li>Eat ➡️ <b>Ate</b> (Jeo sam)</li>
        </ul>
    </div>
</div>` },

    // --- TIER 5: MODERN LIFE ---
    { id: 'education', name: 'Obrazovanje', nameEn: 'Education', emoji: '📚', category: 'education', prereqs: ['past_tense'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>School and learning vocabulary.</p><p>A student at university is a <b>student</b>, but a pupil in school is an <b>učenik</b>.</p></div>` },
    { id: 'technology', name: 'Tehnologija', nameEn: 'Technology', emoji: '💻', category: 'technology', prereqs: ['education'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Modern tech words. Many are English loanwords.</p><p>Kompjuter, internet, sajt, aplikacija...</p></div>` },
    { id: 'business', name: 'Posao', nameEn: 'Business', emoji: '💼', category: 'business', prereqs: ['technology'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Professional vocabulary for working in Serbia.</p><p>The word for job or work is <b>posao</b>.</p></div>` },
    { id: 'advanced_adj', name: 'Napredni pridevi', nameEn: 'Advanced Adjectives', emoji: '🎯', category: 'advanced_adj', prereqs: ['business'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>When stacking multiple adjectives, follow a specific order:</p><ol class="list-decimal pl-5"><li><b>Opinion:</b> lep (beautiful), ružan (ugly)</li><li><b>Size:</b> velik (big), mali (small)</li><li><b>Age:</b> star (old), nov (new)</li><li><b>Color:</b> crven (red), plav (blue)</li><li><b>Origin:</b> srpski (Serbian), nemački (German)</li><li><b>Material:</b> drven (wooden), metalni (metal)</li></ol><p>Example: <i>Lepa velika stara crvena srpska drvena kuća</i> (A beautiful big old red Serbian wooden house).</p></div>` },
    { id: 'punctuation', name: 'Interpunkcija', nameEn: 'Punctuation', emoji: '✍️', category: 'punctuation', prereqs: ['advanced_adj'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>Commas between adjectives:</b></p><ul class="list-disc pl-5"><li>Use a comma if they are from the same category (e.g. cold, windy day).</li><li>NO comma if they are from different categories (e.g. big red car).</li><li>NEVER put a comma right before the noun!</li></ul><p><b>Exclamations:</b></p><ul class="list-disc pl-5"><li>English: Use "What a..." (What a beautiful day!) or "How..." (How wonderful!)</li><li>Serbian: Use "Kakav/Kakva/Kakvo..." (Kakav lep dan!) or "Kako..." (Kako divno!)</li></ul></div>` },
    { id: 'future_tense', name: 'Buduće vreme', nameEn: 'Future Tense', emoji: '⏩', category: 'future_tense', prereqs: ['punctuation'], optional: false, difficulty: 3, guideHtml: `
<div class="space-y-4">
    <p>The Future Tense uses the helper word <b>Ću (Will)</b>. In everyday speech, it's followed by <b>Da + Present Tense</b>.</p>
    
    <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mt-2">
        <table class="w-full text-sm text-center text-slate-600 dark:text-slate-300">
            <thead class="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                    <th class="px-2 py-2">Pronoun</th>
                    <th class="px-2 py-2 text-blue-500">Will (Ćeti)</th>
                    <th class="px-2 py-2 text-rose-500">Connector</th>
                    <th class="px-2 py-2">Main Verb</th>
                </tr>
            </thead>
            <tbody>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">Ja (I)</td>
                    <td class="px-2 py-2 font-black text-blue-500 bg-blue-50/50 dark:bg-blue-900/10">ću</td>
                    <td class="px-2 py-2 font-black text-rose-500 bg-rose-50/50 dark:bg-rose-900/10">da</td>
                    <td class="px-2 py-2">radi<span class="font-bold">m</span></td>
                </tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">Ti (You)</td>
                    <td class="px-2 py-2 font-black text-blue-500 bg-blue-50/50 dark:bg-blue-900/10">ćeš</td>
                    <td class="px-2 py-2 font-black text-rose-500 bg-rose-50/50 dark:bg-rose-900/10">da</td>
                    <td class="px-2 py-2">radi<span class="font-bold">š</span></td>
                </tr>
                <tr class="bg-white border-b dark:bg-slate-900 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">On/Ona</td>
                    <td class="px-2 py-2 font-black text-blue-500 bg-blue-50/50 dark:bg-blue-900/10">će</td>
                    <td class="px-2 py-2 font-black text-rose-500 bg-rose-50/50 dark:bg-rose-900/10">da</td>
                    <td class="px-2 py-2">radi</td>
                </tr>
                <tr class="bg-slate-50 border-b dark:bg-slate-800/50 dark:border-slate-700">
                    <td class="px-2 py-2 font-bold">Mi (We)</td>
                    <td class="px-2 py-2 font-black text-blue-500 bg-blue-50/50 dark:bg-blue-900/10">ćemo</td>
                    <td class="px-2 py-2 font-black text-rose-500 bg-rose-50/50 dark:bg-rose-900/10">da</td>
                    <td class="px-2 py-2">radi<span class="font-bold">mo</span></td>
                </tr>
                <tr class="bg-white dark:bg-slate-900">
                    <td class="px-2 py-2 font-bold">Oni (They)</td>
                    <td class="px-2 py-2 font-black text-blue-500 bg-blue-50/50 dark:bg-blue-900/10">će</td>
                    <td class="px-2 py-2 font-black text-rose-500 bg-rose-50/50 dark:bg-rose-900/10">da</td>
                    <td class="px-2 py-2">rad<span class="font-bold">e</span></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>`,
guideHtmlSr: `
<div class="space-y-4">
    <p>Buduće vreme (Future Simple) u engleskom:</p>
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-xl mt-2">
        <p class="font-bold text-blue-700 dark:text-blue-400 text-sm">Will + Glagol</p>
        <p class="text-sm text-slate-700 dark:text-slate-300 mt-1">Najlakše vreme! Samo stavite reč <b>Will</b> (ću) ispred bilo kog glagola. Nema promena po licima!</p>
        <ul class="text-xs text-slate-600 dark:text-slate-400 list-disc pl-4 mt-1">
            <li>I <b>will</b> work (Ja ću raditi)</li>
            <li>You <b>will</b> work (Ti ćeš raditi)</li>
            <li>He <b>will</b> work (On će raditi)</li>
        </ul>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">Skraćeno: I'll, You'll, He'll</p>
    </div>
</div>` },

    // --- TIER 6: ADVANCED ---
    { id: 'dating', name: 'Ljubav', nameEn: 'Dating', emoji: '❤️', category: 'dating', prereqs: ['future_tense'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Romance and dating terms!</p><p><b>Volim te</b> means I love you.</p></div>` },
        { id: 'particles', name: 'Rečce i Uzvici', nameEn: 'Particles & Interjections', emoji: '💥', category: 'particles', prereqs: ['slang'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>Particles (Rečce)</b> are tiny words that add meaning or emphasis:</p><ul class="list-disc pl-5"><li><b>li</b> - question marker: Da <b>li</b> znaš? (Do you know?)</li><li><b>zar</b> - rhetorical: <b>Zar</b> ne? (Right? / Isn't it?)</li><li><b>baš</b> - emphasis: <b>Baš</b> lepo! (Really nice!)</li><li><b>čak</b> - even: <b>Čak</b> i on. (Even he.)</li></ul><p><b>Interjections (Uzvici)</b> express emotion:</p><ul class="list-disc pl-5"><li><b>Jao!</b> - Oh no! / Ouch!</li><li><b>Ej!</b> - Hey!</li><li><b>Bravo!</b> - Well done!</li><li><b>Uf!</b> - Phew!</li></ul></div>` },
    { id: 'spelling', name: 'Pravopis', nameEn: 'Spelling Traps', emoji: '✍️', category: 'spelling', prereqs: ['particles'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p><b>English Spelling Traps:</b></p><ul class="list-disc pl-5"><li>Drop 'y' for 'i' (happy ➡️ happier, heavy ➡️ heaviest)</li><li>Double consonant for short words (hot ➡️ hotter, big ➡️ biggest)</li></ul><p><b>Serbian Spelling Traps:</b></p><p>Pay close attention to similar-sounding letters:</p><ul class="list-disc pl-5"><li><b>Č</b> (hard ch) vs <b>Ć</b> (soft ch): čaj (tea) vs noć (night).</li><li><b>Dž</b> (hard j) vs <b>Đ</b> (soft j): džep (pocket) vs đak (student).</li></ul></div>` },

    // --- TIER 7: TRAVEL & NAVIGATION ---
    { id: 'airport', name: 'Aerodrom', nameEn: 'Airport', emoji: '✈️', category: 'airport', prereqs: ['spelling'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Essential airport and flying vocabulary.</p><p>A flight is <b>let</b>.</p></div>` },
    { id: 'directions', name: 'Pravci', nameEn: 'Directions', emoji: '🧭', category: 'directions', prereqs: ['airport'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Learn how to navigate!</p><ul class="list-disc pl-5"><li><b>Levo</b> - Left</li><li><b>Desno</b> - Right</li><li><b>Pravo</b> - Straight</li></ul></div>` },
    { id: 'transport', name: 'Prevoz', nameEn: 'Public Transport', emoji: '🚌', category: 'transport', prereqs: ['directions'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Buses, trains, and tickets.</p><p>A ticket is <b>karta</b>.</p></div>` },
    { id: 'driving', name: 'Vožnja', nameEn: 'Driving', emoji: '🚗', category: 'driving', prereqs: ['transport'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Cars, traffic, and roads.</p></div>` },
    { id: 'geography', name: 'Geografija', nameEn: 'Geography', emoji: '🗺️', category: 'geography', prereqs: ['driving'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Continents, countries, and landscapes.</p></div>` },

    // --- TIER 8: THE 7 SERBIAN CASES (CASES I) ---
    { id: 'nominative', name: 'Nominativ', nameEn: 'Nominative (Subject)', emoji: '1️⃣', category: 'nominative', prereqs: ['geography'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>The Nominative case answers <b>Ko?</b> (Who?) and <b>Šta?</b> (What?). It is the subject of the sentence.</p><p>Example: <i>Ovo je <b>kuća</b>.</i> (This is a house.)</p></div>` },
    { id: 'accusative', name: 'Akuzativ', nameEn: 'Accusative (Object)', emoji: '🎯', category: 'accusative', prereqs: ['nominative'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>The Accusative case answers <b>Koga?</b> (Whom?) and <b>Šta?</b> (What?). It is the direct object of an action.</p><p>Example: <i>Vidim <b>kuću</b>.</i> (I see the house.)</p></div>` },
    { id: 'genitive', name: 'Genitiv', nameEn: 'Genitive (Possession)', emoji: '📦', category: 'genitive', prereqs: ['accusative'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>The Genitive case shows possession, origin, or quantity. Answers <b>Koga?</b> and <b>Čega?</b> (Of whom/what?).</p><p>Example: <i>Čaša <b>vode</b>.</i> (A glass of water.)</p></div>` },

    // --- TIER 9: SOCIAL LIFE & LEISURE ---
    { id: 'hobbies', name: 'Hobiji', nameEn: 'Hobbies', emoji: '🎨', category: 'hobbies', prereqs: ['genitive'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>What do you do for fun?</p></div>` },
    { id: 'music', name: 'Muzika', nameEn: 'Music', emoji: '🎵', category: 'music', prereqs: ['hobbies'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Genres, instruments, and singing.</p></div>` },
    { id: 'movies', name: 'Filmovi', nameEn: 'Movies & TV', emoji: '🎬', category: 'movies', prereqs: ['music'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Cinemas, acting, and genres.</p></div>` },
    { id: 'arts', name: 'Umetnost', nameEn: 'Arts & Culture', emoji: '🎭', category: 'arts', prereqs: ['movies'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Painting, theater, and museums.</p></div>` },

    // --- TIER 10: THE 7 SERBIAN CASES (CASES II) ---
    { id: 'dative', name: 'Dativ', nameEn: 'Dative (Direction)', emoji: '📬', category: 'dative', prereqs: ['arts'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>The Dative answers <b>Kome?</b> (To whom?) and <b>Čemu?</b> (To what?).</p><p>Example: <i>Dajem knjigu <b>bratu</b>.</i> (I am giving the book to my brother.)</p></div>` },
    { id: 'locative', name: 'Lokativ', nameEn: 'Locative (Location)', emoji: '📍', category: 'locative', prereqs: ['dative'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>The Locative answers <b>O kome?</b> (About whom?) and <b>O čemu/Gde?</b> (About what/Where?).</p><p>Always used with prepositions like <b>u</b>, <b>na</b>, <b>o</b>, <b>po</b>.</p><p>Example: <i>Knjiga je na <b>stolu</b>.</i> (The book is on the table.)</p></div>` },
    { id: 'instrumental', name: 'Instrumental', nameEn: 'Instrumental (With/By)', emoji: '🛠️', category: 'instrumental', prereqs: ['locative'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>The Instrumental answers <b>S kim?</b> (With whom?) and <b>Čime?</b> (With what?).</p><p>Example: <i>Idem sa <b>prijateljem</b>.</i> (I am going with a friend.)</p></div>` },
    { id: 'vocative', name: 'Vokativ', nameEn: 'Vocative (Calling)', emoji: '🗣️', category: 'vocative', prereqs: ['instrumental'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>The Vocative is used for calling or addressing someone.</p><p>Example: <i>Gde si, <b>brate</b>?</i> (Where are you, brother?)</p></div>` },

    // --- TIER 11: ADVANCED VERBS & TENSES ---
    { id: 'imperative', name: 'Imperativ', nameEn: 'Imperative (Commands)', emoji: '❗️', category: 'imperative', prereqs: ['vocative'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Used to give commands or make requests.</p><p>Example: <i>Dođi!</i> (Come!) or <i>Sedi!</i> (Sit!)</p></div>` },
    { id: 'conditional', name: 'Potencijal', nameEn: 'Conditional (Would)', emoji: '💭', category: 'conditional', prereqs: ['imperative'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>The conditional mood translates to "would" in English. Used for wishes or hypotheticals.</p><p>Example: <i>Ja bih hteo...</i> (I would like...)</p></div>` },
    { id: 'future_2', name: 'Futur II', nameEn: 'Exact Future (Futur II)', emoji: '🔮', category: 'future_2', prereqs: ['conditional'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Futur II is used in dependent clauses for an action that will happen BEFORE another future action.</p><p>Example: <i>Ako budem imao vremena, doći ću.</i> (If I [will] have time, I will come.)</p></div>` },
    { id: 'aspects', name: 'Glagolski Vid', nameEn: 'Verb Aspects', emoji: '🔄', category: 'aspects', prereqs: ['future_2'], optional: false, difficulty: 5, guideHtml: `<div class="space-y-4"><p>Serbian verbs have aspects: <b>Perfective</b> (completed action) and <b>Imperfective</b> (ongoing action).</p><ul class="list-disc pl-5"><li><b>Čitati</b> (Imperfective): To read (in general/process)</li><li><b>Pročitati</b> (Perfective): To finish reading</li></ul></div>` },

    // --- TIER 12: WORK, OFFICE & PROFESSIONAL ---
    { id: 'office', name: 'Kancelarija', nameEn: 'The Office', emoji: '🏢', category: 'office', prereqs: ['aspects'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Workplace vocabulary and office supplies.</p></div>` },
    { id: 'professions_adv', name: 'Zanimanja 2', nameEn: 'Advanced Professions', emoji: '👔', category: 'professions_adv', prereqs: ['office'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>More complex job titles and careers.</p></div>` },
    { id: 'meetings', name: 'Sastanci', nameEn: 'Meetings', emoji: '🤝', category: 'meetings', prereqs: ['professions_adv'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Vocabulary for presentations, negotiations, and discussions.</p></div>` },
    { id: 'finance', name: 'Finansije', nameEn: 'Finance & Money', emoji: '💰', category: 'finance', prereqs: ['meetings'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Banking, investments, and economics.</p></div>` },
    { id: 'formal_register', name: 'Formalni govor', nameEn: 'Formal Register (Vi)', emoji: '🎩', category: 'formal_register', prereqs: ['finance'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Mastering polite speech. Always use the plural <b>Vi</b> when addressing someone formally.</p></div>` },

    // --- TIER 13: DAILY ROUTINE & LIFESTYLE ---
    { id: 'kitchen', name: 'Kuhinja', nameEn: 'The Kitchen', emoji: '🍳', category: 'kitchen', prereqs: ['formal_register'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Utensils, cooking methods, and appliances.</p></div>` },
    { id: 'furniture', name: 'Nameštaj', nameEn: 'Furniture', emoji: '🛋️', category: 'furniture', prereqs: ['kitchen'], optional: false, difficulty: 2, guideHtml: `<div class="space-y-4"><p>Household items and interior design.</p></div>` },
    { id: 'daily_routine', name: 'Dnevna rutina', nameEn: 'Daily Routine', emoji: '🌅', category: 'daily_routine', prereqs: ['furniture'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Reflexive verbs are very common here!</p><p>Example: <i>Ja se budim.</i> (I wake [myself] up.)</p></div>` },

    // --- TIER 14: SOCIETY, SCIENCE & MEDIA ---
    { id: 'science', name: 'Nauka', nameEn: 'Science', emoji: '🔬', category: 'science', prereqs: ['daily_routine'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Biology, chemistry, physics, and research.</p></div>` },
    { id: 'environment', name: 'Ekologija', nameEn: 'Environment', emoji: '🌍', category: 'environment', prereqs: ['science'], optional: false, difficulty: 3, guideHtml: `<div class="space-y-4"><p>Nature conservation and environmental terms.</p></div>` },
    { id: 'politics', name: 'Politika', nameEn: 'Politics', emoji: '🏛️', category: 'politics', prereqs: ['environment'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Government, elections, and civic duties.</p></div>` },
    { id: 'law', name: 'Zakon', nameEn: 'Law & Crime', emoji: '⚖️', category: 'law', prereqs: ['politics'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Legal terms, police, and justice system.</p></div>` },
    { id: 'news', name: 'Vesti', nameEn: 'News & Media', emoji: '📰', category: 'news', prereqs: ['law'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Journalism, broadcasting, and current events.</p></div>` },
    { id: 'history', name: 'Istorija', nameEn: 'History', emoji: '📜', category: 'history', prereqs: ['news'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Historical periods, events, and figures.</p></div>` },

    // --- TIER 15: C1/C2 MASTERY & NUANCE ---
    { id: 'phrasal_verbs', name: 'Frazalni glagoli', nameEn: 'Phrasal Equivalents', emoji: '🧩', category: 'phrasal_verbs', prereqs: ['history'], optional: false, difficulty: 5, guideHtml: `<div class="space-y-4"><p>How to express English phrasal verbs (like "give up", "look forward to") in Serbian.</p></div>` },
    { id: 'nuance', name: 'Nijanse', nameEn: 'Nuances & Synonyms', emoji: '🕵️', category: 'nuance', prereqs: ['phrasal_verbs'], optional: false, difficulty: 5, guideHtml: `<div class="space-y-4"><p>Understanding subtle differences between similar words.</p></div>` },
    { id: 'debate', name: 'Debata', nameEn: 'Debating & Arguing', emoji: '💬', category: 'debate', prereqs: ['nuance'], optional: false, difficulty: 5, guideHtml: `<div class="space-y-4"><p>How to defend an opinion, disagree politely, or argue effectively.</p></div>` },
    { id: 'idioms_1', name: 'Idiomi 1', nameEn: 'Idioms I', emoji: '💡', category: 'idioms_1', prereqs: ['debate'], optional: false, difficulty: 4, guideHtml: `<div class="space-y-4"><p>Common Serbian idioms and expressions.</p></div>` },
    { id: 'idioms_2', name: 'Idiomi 2', nameEn: 'Idioms II', emoji: '🧠', category: 'idioms_2', prereqs: ['idioms_1'], optional: false, difficulty: 5, guideHtml: `<div class="space-y-4"><p>Advanced idioms for C2 fluency.</p></div>` },
    { id: 'c2_mastery', name: 'C2 Majstorstvo', nameEn: 'C2 Mastery', emoji: '👑', category: 'c2_mastery', prereqs: ['idioms_2'], optional: false, difficulty: 5, guideHtml: `<div class="space-y-4"><p>The ultimate vocabulary test. Rare words, literature terms, and absolute fluency.</p></div>` }
];

// Crown levels: 0=not started, 1=started, 2=familiar, 3=good, 4=great, 5=mastered
const CROWN_COLORS = {
    0: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-400 dark:text-slate-500', border: 'border-slate-300 dark:border-slate-600', shadow: 'shadow-[0_4px_0_rgb(148,163,184)]' },
    1: { bg: 'bg-green-400', text: 'text-white', border: 'border-green-500', shadow: 'shadow-[0_4px_0_rgb(21,128,61)]' },
    2: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-600', shadow: 'shadow-[0_4px_0_rgb(21,128,61)]' },
    3: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-600', shadow: 'shadow-[0_4px_0_rgb(29,78,216)]' },
    4: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-600', shadow: 'shadow-[0_4px_0_rgb(126,34,206)]' },
    5: { bg: 'bg-yellow-400', text: 'text-yellow-900', border: 'border-yellow-500', shadow: 'shadow-[0_4px_0_rgb(161,98,7)]' },
};

const SkillTreeEngine = {
    _getKey() {
        const username = window.appState && window.appState.user ? window.appState.user.name : 'guest';
        return 'serbolingo_skill_progress_' + username;
    },
    getProgress() {
        const saved = localStorage.getItem(this._getKey());
        if (!saved && localStorage.getItem('serbolingo_skill_progress')) {
            const old = localStorage.getItem('serbolingo_skill_progress');
            localStorage.setItem(this._getKey(), old);
            localStorage.removeItem('serbolingo_skill_progress');
            return JSON.parse(old);
        }
        return saved ? JSON.parse(saved) : {};
    },
    
    saveProgress(progress) {
        localStorage.setItem(this._getKey(), JSON.stringify(progress));
    },
    
    getCrownLevel(skillId) {
        const progress = this.getProgress();
        return (progress[skillId] && progress[skillId].crown) || 0;
    },
    
    getLessonsCompleted(skillId) {
        const progress = this.getProgress();
        return (progress[skillId] && progress[skillId].lessonsInCrown) || 0;
    },
    
    getLessonsPerCrown() {
        return 3;
    },
    
    isUnlocked(skillId) {
        const skill = SKILL_TREE.find(s => s.id === skillId);
        if (!skill) return false;
        // Foundation items (no prereqs) are always unlocked
        if (skill.prereqs.length === 0) return true;
        // Everything else requires ALL prereqs to have at least crown level 1
        return skill.prereqs.every(prereqId => this.getCrownLevel(prereqId) >= 1);
    },
    
    recordLessonComplete(skillId, perfect) {
        const progress = this.getProgress();
        if (!progress[skillId]) {
            progress[skillId] = { crown: 0, lessonsInCrown: 0, totalLessons: 0, perfectLessons: 0 };
        }
        
        progress[skillId].totalLessons++;
        if (perfect) progress[skillId].perfectLessons++;
        progress[skillId].lessonsInCrown++;
        
        if (progress[skillId].lessonsInCrown >= this.getLessonsPerCrown() && progress[skillId].crown < 5) {
            progress[skillId].crown++;
            progress[skillId].lessonsInCrown = 0;
        }
        
        this.saveProgress(progress);
        return progress[skillId];
    },
    
    getSkillsWithStatus() {
        return SKILL_TREE.map(skill => ({
            ...skill,
            crown: this.getCrownLevel(skill.id),
            lessonsInCrown: this.getLessonsCompleted(skill.id),
            unlocked: this.isUnlocked(skill.id),
            locked: !this.isUnlocked(skill.id)
        }));
    }
};
