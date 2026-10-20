// [SHIELD_DAEMON: VALIDATED]
// Priority 15 & Priority 30: Authentic Serbian Cultural Idioms, Slang & Žargon Module
const SlangEngine = {
    // Master database organized by cultural themes and regions
    slangData: {
        'beograd': [
            { id: 'sl1', slang: 'Brate', sr_cyr: 'Брате', meaning: 'Bro / Dude', literal: 'Brother', cultural_note: 'Used in almost every sentence by youth in Belgrade. Works for friends, strangers, and even frustration.', usage: 'Brate, šta ima novo?', tag: 'bg' },
            { id: 'sl2', slang: 'Bleja', sr_cyr: 'Блеја', meaning: 'Chilling / Hanging out', literal: 'Bleating (like sheep)', cultural_note: 'Pure relaxation with friends without any set agenda or schedule.', usage: 'Idemo na bleju u park večeras.', tag: 'bg' },
            { id: 'sl3', slang: 'Vrh', sr_cyr: 'Врх', meaning: 'Awesome / Peak / Top tier', literal: 'Mountain peak', cultural_note: 'Universal adjective for anything exceptionally cool, delicious, or fun.', usage: 'Bilo je vrh na koncertu sinoć.', tag: 'bg' },
            { id: 'sl4', slang: 'Šta ima?', sr_cyr: 'Шта има?', meaning: 'What\'s up? / How is it going?', literal: 'What has?', cultural_note: 'The most casual and common street greeting across all of Serbia.', usage: 'Šta ima brate, kako si?', tag: 'bg' },
            { id: 'sl11', slang: 'Gas', sr_cyr: 'Гас', meaning: 'Hype / Excitement / Full throttle', literal: 'Gasoline / Throttle', cultural_note: 'Modern youth slang for going all out or living fast ("dati pun gas").', usage: 'Večeras samo pun gas!', tag: 'bg' },
            { id: 'sl12', slang: 'Loženje', sr_cyr: 'Ложење', meaning: 'Getting overly hyped / Baited', literal: 'Stoking the stove fire', cultural_note: 'Getting baited into an argument or acting excessively boastful.', usage: 'Nemoj bez veze da se ložiš.', tag: 'bg' },
            { id: 'sl13', slang: 'Krš', sr_cyr: 'Крш', meaning: 'Total wreck / Garbage / Broken', literal: 'Craggy rock / Rubble', cultural_note: 'Used for broken appliances, bad cars, awful films, or bad situations.', usage: 'Ovaj stari laptop je totalni krš.', tag: 'bg' },
            { id: 'sl14', slang: 'Ekipa', sr_cyr: 'Екипа', meaning: 'The squad / Crew / Close friends', literal: 'Team / Crew', cultural_note: 'Your loyal circle of companions who navigate the city together.', usage: 'Čeka me cela ekipa ispred zgrade.', tag: 'bg' },
            { id: 'sl15', slang: 'Riba', sr_cyr: 'Риба', meaning: 'Attractive girl / Hottie', literal: 'Fish', cultural_note: 'Classic Belgrade urban slang for an attractive woman ("dobra riba").', usage: 'Ona je baš dobra riba.', tag: 'bg' },
            { id: 'sl16', slang: 'Lik', sr_cyr: 'Лик', meaning: 'Guy / Dude / Character', literal: 'Figure / Face', cultural_note: 'Universal term for an individual male or colorful character.', usage: 'Taj lik stvarno odlično svira gitaru.', tag: 'bg' },
            { id: 'sl17', slang: 'Boli me uvo', sr_cyr: 'Боли ме уво', meaning: 'I couldn\'t care less / Don\'t care', literal: 'My ear aches', cultural_note: 'Gentle, polite street way to express complete indifference or apathy.', usage: 'Boli me uvo šta pričaju o meni.', tag: 'bg' },
            { id: 'sl18', slang: 'Ispaliti', sr_cyr: 'Испалити', meaning: 'To stand someone up / Flake', literal: 'To fire a shot', cultural_note: 'Canceling a meetup at the very last minute or simply not showing up.', usage: 'Ispalio nas je sinoć za bioskop.', tag: 'bg' },
            { id: 'sl19', slang: 'Frka', sr_cyr: 'Фрка', meaning: 'Panic / Mess / Stressful rush', literal: 'Commotion', cultural_note: 'High-stress crunch time or unexpected sudden trouble.', usage: 'Nema frke, sve ćemo stići na vreme.', tag: 'bg' },
            { id: 'sl20', slang: 'Odlepiti', sr_cyr: 'Одлепити', meaning: 'To lose one\'s mind / Go crazy', literal: 'To unglue / peel off', cultural_note: 'Can mean going crazy from stress or being wildly in love with someone.', usage: 'Skroz sam odlepio za tom novom pesmom.', tag: 'bg' }
        ],
        'izreke': [
            { id: 'idm1', slang: 'Ljubi te baka sine', sr_cyr: 'Љуби те бака сине', meaning: 'Grandma loves you so much (unconditional blessing)', literal: 'Grandma kisses you, son', cultural_note: 'Spoken by grandmothers to grandchildren of ANY gender while feeding them heaps of sarma or pinching cheeks.', usage: 'Uzmi još malo pite, ljubi te baka sine!', tag: 'izreka' },
            { id: 'idm2', slang: 'Bogu iza nogu', sr_cyr: 'Богу иза ногу', meaning: 'In the middle of nowhere / In the boonies', literal: 'Behind God\'s legs', cultural_note: 'A place so impossibly distant and remote that civilization barely reaches it.', usage: 'Njegova nova vikendica je bogu iza nogu.', tag: 'izreka' },
            { id: 'idm3', slang: 'Puna kapa', sr_cyr: 'Пуна капа', meaning: 'More than enough / Completely plenty', literal: 'A full cap', cultural_note: 'Expresses hearty satisfaction with what you received; no more is needed.', usage: 'Dve hiljade dinara mi je puna kapa za večeras.', tag: 'izreka' },
            { id: 'idm4', slang: 'Mlatiti praznu slamu', sr_cyr: 'Млатити празну сламу', meaning: 'Talking useless nonsense / Wasting time', literal: 'Thrashing empty straw', cultural_note: 'Originates from beating grainless straw which yields zero bread. Pointless chatter.', usage: 'Dosta smo mlatili praznu slamu, idemo na posao.', tag: 'izreka' },
            { id: 'idm5', slang: 'Kad na vrbi rodi grožđe', sr_cyr: 'Кад на врби роди грожђе', meaning: 'When pigs fly / Never in a million years', literal: 'When grapes grow on a willow tree', cultural_note: 'An impossible agricultural event used to firmly reject unlikely promises.', usage: 'Vratiće ti pare kad na vrbi rodi grožđe.', tag: 'izreka' },
            { id: 'idm6', slang: 'Pljuni pa zalepi', sr_cyr: 'Пљуни па залепи', meaning: 'Spitting image / Improvised fix', literal: 'Spit and stick', cultural_note: 'Used when someone is an exact clone of a parent, or for a comical quick repair.', usage: 'Isti otac, pljuni pa zalepi!', tag: 'izreka' },
            { id: 'idm7', slang: 'Pao s kruške', sr_cyr: 'Пао с крушке', meaning: 'Naive / Born yesterday / Clueless', literal: 'Fallen from a pear tree', cultural_note: 'Ancient Slavic belief that evil spirits inhabited pear trees. "Did I fall from a pear tree?" = "Do you think I\'m stupid?"', usage: 'Nisam pao s kruške da poverujem u to.', tag: 'izreka' },
            { id: 'idm8', slang: 'Obrati zelen bostan', sr_cyr: 'Обрати зелен бостан', meaning: 'To be in deep trouble / Totally screwed', literal: 'To harvest unripe watermelons', cultural_note: 'Harvesting unripe melons ruins the entire year\'s crop, bringing financial ruin.', usage: 'Ako zakasnimo na sastanak, obrali smo zelen bostan.', tag: 'izreka' },
            { id: 'idm9', slang: 'Košta ko svetog Petra kajgana', sr_cyr: 'Кошта ко светог Петра кајгана', meaning: 'Outrageously expensive / Costs a fortune', literal: 'Costs like St. Peter\'s scrambled eggs', cultural_note: 'Folklore tale where St. Peter was beaten until he paid an exorbitant bill for eggs.', usage: 'Cene u tom kafiću koštaju ko svetog Petra kajgana.', tag: 'izreka' },
            { id: 'idm10', slang: 'Nemoj da mi soliš pamet', sr_cyr: 'Немој да ми солиш памет', meaning: 'Don\'t lecture or patronize me', literal: 'Don\'t salt my brain', cultural_note: 'Sharp defense against someone trying to teach you things you already know.', usage: 'Znam dobro šta radim, nemoj da mi soliš pamet.', tag: 'izreka' },
            { id: 'idm11', slang: 'Nema leba bez motike', sr_cyr: 'Нема леба без мотике', meaning: 'No gain without hard honest work', literal: 'There is no bread without a hoe', cultural_note: 'The bedrock Balkan proverb celebrating sweat, discipline, and honest labour.', usage: 'Uči i radi vredno, jer nema leba bez motike.', tag: 'izreka' },
            { id: 'idm12', slang: 'Baciti oko', sr_cyr: 'Бацити око', meaning: 'To keep an eye on / Check someone out', literal: 'To throw an eye', cultural_note: 'Watching luggage for a friend, or secretly checking out someone handsome across the café.', usage: 'Baci oko na moj sto dok odem do toaleta.', tag: 'izreka' },
            { id: 'idm13', slang: 'Držati fige', sr_cyr: 'Држати фиге', meaning: 'Cross fingers for good luck', literal: 'To hold figs', cultural_note: 'The Serbian gesture for wishing someone great fortune before an exam or interview.', usage: 'Držim ti fige sutra za važan razgovor!', tag: 'izreka' },
            { id: 'idm14', slang: 'Medveđa usluga', sr_cyr: 'Медвеђа услуга', meaning: 'Harmful favor / Good intention that backfires', literal: 'A bear\'s service', cultural_note: 'From the fable where a pet bear crushed his sleeping master\'s nose trying to swat a fly.', usage: 'Tvojim mešanjem napravio si mu medveđu uslugu.', tag: 'izreka' },
            { id: 'idm15', slang: 'Kupiti mačku u džaku', sr_cyr: 'Купити мачку у џаку', meaning: 'Buy a pig in a poke / Buy blindly', literal: 'To buy a cat in a sack', cultural_note: 'Purchasing an item without opening the packaging or checking its true quality.', usage: 'Uvek probaj pre kupovine, nemoj kupovati mačku u džaku.', tag: 'izreka' },
            { id: 'idm16', slang: 'Trn u oku', sr_cyr: 'Трн у оку', meaning: 'Thorn in someone\'s side / Persistent annoyance', literal: 'A thorn in the eye', cultural_note: 'An individual whose success, talent, or presence irritates rivals constantly.', usage: 'Naša pobeda im je već godinama trn u oku.', tag: 'izreka' },
            { id: 'idm17', slang: 'Sedeti na dve stolice', sr_cyr: 'Седети на две столице', meaning: 'Sitting on two chairs / Playing both sides', literal: 'Sitting on two chairs', cultural_note: 'Trying to please two opposing factions instead of taking a brave, clear stance.', usage: 'Ne možeš večno sedeti na dve stolice.', tag: 'izreka' },
            { id: 'idm18', slang: 'Lupati glavu', sr_cyr: 'Лупати главу', meaning: 'Racking one\'s brain intensely', literal: 'Banging the head', cultural_note: 'Struggling endlessly to crack a difficult riddle, dilemma, or math problem.', usage: 'Danima lupam glavu oko ove odluke.', tag: 'izreka' },
            { id: 'idm19', slang: 'Pasti s nogu', sr_cyr: 'Пасти с ногу', meaning: 'Exhausted / Dead tired after exertion', literal: 'To fall off one\'s feet', cultural_note: 'Said at the end of an exhausting work shift or a 15-kilometer walk around town.', usage: 'Danas sam pala s nogu od posla.', tag: 'izreka' },
            { id: 'idm20', slang: 'Hvatati zjale', sr_cyr: 'Хватати зјале', meaning: 'Daydreaming / Slacking off / Doing nothing', literal: 'Catching gaping voids', cultural_note: 'Staring aimlessly into space with your mouth half-open instead of studying.', usage: 'Dosta si hvatao zjale celog popodneva!', tag: 'izreka' }
        ],
        'neznost': [
            { id: 'end1', slang: 'Dušo moja', sr_cyr: 'Душо моја', meaning: 'My soul / Darling / Sweetheart', literal: 'My soul', cultural_note: 'Deep Slavic tenderness expressing that the other person is your inner soul.', usage: 'Laku noć i lepo spavaj, dušo moja.', tag: 'nežnost' },
            { id: 'end2', slang: 'Srce moje', sr_cyr: 'Срце моје', meaning: 'My sweetheart / My heart', literal: 'My heart', cultural_note: 'Universally used across generations between partners, parents, and children.', usage: 'Dođi kod mene, srce moje malo.', tag: 'nežnost' },
            { id: 'end3', slang: 'Zlato moje', sr_cyr: 'Злато моје', meaning: 'My precious / My treasure', literal: 'My gold', cultural_note: 'Signifies someone cherished above all worldly possessions and money.', usage: 'Ti si zlato moje najlepše na svetu.', tag: 'nežnost' },
            { id: 'end4', slang: 'Mišu mali', sr_cyr: 'Мишу мали', meaning: 'Cute little mouse (pet name)', literal: 'Little mouse', cultural_note: 'Playful, endearing pet name for children, babies, or adorable partners.', usage: 'Lepo sanjaj večeras, mišu mali.', tag: 'nežnost' },
            { id: 'end5', slang: 'Sunce moje', sr_cyr: 'Сунце моје', meaning: 'My sunshine / Light of my life', literal: 'My sun', cultural_note: 'Given to someone whose cheerful presence brightens your entire day.', usage: 'Dobro jutro, sunce moje sjajno!', tag: 'nežnost' },
            { id: 'end6', slang: 'Živote moj', sr_cyr: 'Животе мој', meaning: 'My whole life / You are my world', literal: 'My life', cultural_note: 'Dramatic, profoundly passionate expression of unconditional love.', usage: 'Najviše na svetu te volim, živote moj.', tag: 'nežnost' },
            { id: 'end7', slang: 'Oko moje', sr_cyr: 'Око моје', meaning: 'Apple of my eye / Cherished sight', literal: 'My eye', cultural_note: 'Ancient poetic expression comparing someone\'s worth to one\'s eyesight.', usage: 'Nemoj da plačeš, oko moje lepo.', tag: 'nežnost' },
            { id: 'end8', slang: 'Lutko moja', sr_cyr: 'Лутко моја', meaning: 'My doll / Gorgeous darling', literal: 'My doll', cultural_note: 'Affectionate compliment used for daughters or beloved partners.', usage: 'Predivna si večeras, lutko moja.', tag: 'nežnost' },
            { id: 'end9', slang: 'Anđele moj', sr_cyr: 'Анђеле мој', meaning: 'My angel / Pure soul', literal: 'My angel', cultural_note: 'Said with immense gratitude to someone who protects or helps you selflessly.', usage: 'Hvala ti na svemu, anđele moj.', tag: 'nežnost' },
            { id: 'end10', slang: 'Ljubavi moja', sr_cyr: 'Љубави моја', meaning: 'My love / True love', literal: 'My love', cultural_note: 'The timeless, classic romantic address in Serbian literature and daily life.', usage: 'Srećan rođendan, ljubavi moja jedina.', tag: 'nežnost' }
        ],
        'kafana': [
            { id: 'kaf1', slang: 'Sledeća tura na mene', sr_cyr: 'Следећа тура на мене', meaning: 'Next round of drinks is on me', literal: 'Next round on me', cultural_note: 'Sacred kafana etiquette. Never let a friend pay two rounds in a row.', usage: 'Sklonite novčanike, sledeća tura je na mene!', tag: 'kafana' },
            { id: 'kaf2', slang: 'Živeli braćo', sr_cyr: 'Живели браћо', meaning: 'Cheers brothers / To our health', literal: 'Live long, brothers', cultural_note: 'Always maintain firm eye contact when clinking glasses of rakija or beer.', usage: 'Živeli braćo, neka nam je sa srećom!', tag: 'kafana' },
            { id: 'kaf3', slang: 'Meze uz rakiju', sr_cyr: 'Мезе уз ракију', meaning: 'Snacks and cold cuts with brandy', literal: 'Appetizers alongside rakija', cultural_note: 'Essential accompaniment: prosciutto, homemade cheese, kajmak, and pickled peppers.', usage: 'Donesite nam lepo domaće meze uz rakiju.', tag: 'kafana' },
            { id: 'kaf4', slang: 'Častiti turu', sr_cyr: 'Частити туру', meaning: 'To treat the whole table / Buy a round', literal: 'To honor with a round', cultural_note: 'Balkan hospitality benchmark: buying for others elevates your social standing and warmth.', usage: 'Danas slavim unapređenje, častim celo društvo!', tag: 'kafana' },
            { id: 'kaf5', slang: 'Domaća kafa', sr_cyr: 'Домаћа кафа', meaning: 'Domestic Turkish boiled coffee', literal: 'Domestic homemade coffee', cultural_note: 'Boiled in a traditional copper dzezva and served with Turkish delight (ratluk).', usage: 'Skuvaj nam dve jake domaće kafe s ratlukom.', tag: 'kafana' },
            { id: 'kaf6', slang: 'Bakšiš za konobara', sr_cyr: 'Бакшиш за конобара', meaning: 'Tip for the waiter', literal: 'Baksheesh for the waiter', cultural_note: 'Leaving 10% or rounding up the bill is standard manners for attentive kafana service.', usage: 'Uvek ostavi pošten bakšiš za konobara.', tag: 'kafana' },
            { id: 'kaf7', slang: 'Produžena s mlekom', sr_cyr: 'Продужена с млеком', meaning: 'Long espresso with warm milk', literal: 'Lengthened with milk', cultural_note: 'The undisputed national café order on sunny Belgrade outdoor terraces.', usage: 'Jedan espreso i jedna produžena s toplim mlekom.', tag: 'kafana' }
        ],
        'juzni': [
            { id: 'juz1', slang: 'Gde si be', sr_cyr: 'Где си бе', meaning: 'What\'s up man! (Southern emphasis)', literal: 'Where are you "be"', cultural_note: '"Be" is the legendary marker in Niš and Vranje added to greetings, questions, and sighs.', usage: 'Gde si be brate, nema te sto godina!', tag: 'južni' },
            { id: 'juz2', slang: 'Lele šta uradi', sr_cyr: 'Леле шта уради', meaning: 'Oh my god what did you do?!', literal: 'Lele what did you do', cultural_note: '"Lele" expresses deep tragicomic shock, astonishment, or disbelief.', usage: 'Lele šta uradi, polomi celu čašu!', tag: 'južni' },
            { id: 'juz3', slang: 'S merakom', sr_cyr: 'С мераком', meaning: 'With transcendent soulful pleasure', literal: 'With merak', cultural_note: 'The untranslatable Balkan state of slow, soulful enjoyment of coffee, music, and life.', usage: 'Pijem jutarnju kafu polako i s merakom.', tag: 'južni' },
            { id: 'juz4', slang: 'Koji zajeb', sr_cyr: 'Који зајеб', meaning: 'What a massive mistake / Screw up', literal: 'What a fuck up', cultural_note: 'Raw southern exclamation after realizing a huge tactical blunder.', usage: 'Koji zajeb napraviše s tim dogovorom be!', tag: 'južni' },
            { id: 'juz5', slang: 'Ću te izejem', sr_cyr: 'Ћу те изејем', meaning: 'You\'re so cute I will eat you up', literal: 'I will eat you', cultural_note: 'Torlak dialect affection spoken by southern grandmothers and aunts to adorable babies.', usage: 'Dođi vamo kod bake, ću te izejem koliko si sladak!', tag: 'južni' },
            { id: 'juz6', slang: 'Kude si pošao', sr_cyr: 'Куде си пошао', meaning: 'Where are you off to?', literal: 'Whither have you set out', cultural_note: '"Kude" is the authentic southern dialect form of standard Serbian "gde".', usage: 'Kude si pošao po ovoj velikoj kiši?', tag: 'južni' }
        ]
    },

    currentTab: 'izreke',

    openMenu: function() {
        if (window.app && window.app.stopSpeech) window.app.stopSpeech();

        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');

        this.renderView(overlay);
    },

    renderView: function(overlay) {
        let activeData = this.slangData[this.currentTab] || [];
        
        let tabClass = (tab) => this.currentTab === tab 
            ? 'px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-xs shadow-md shadow-blue-600/30 shrink-0 border border-blue-400' 
            : 'px-4 py-2.5 bg-slate-800 text-slate-400 rounded-xl font-bold text-xs hover:bg-slate-700 shrink-0 border border-slate-700';

        const categoryTitles = {
            'izreke': '👵 NARODNE IZREKE & KULTURNE FRAZE',
            'beograd': '🏙️ BEOGRADSKI SLENG & ŽARGON',
            'neznost': '❤️ NEŽNOST & EMOTIVNI IZRAZI',
            'kafana': '🍷 KAFANA & BALKANSKI RITUALI',
            'juzni': '🌶️ JUŽNI GOVOR (NIŠ & VRANJE)'
        };

        overlay.innerHTML = `
            <div class="flex flex-col h-full bg-slate-900 text-white w-full">
                <!-- Header -->
                <div class="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700 shadow-md shrink-0">
                    <div class="font-black text-lg sm:text-xl flex items-center gap-2">
                        <span class="text-2xl">🌶️</span> 
                        <span class="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">Ulični Srpski & Izreke</span>
                    </div>
                    <button onclick="ArcadeEngine._hideOverlay()" class="text-3xl font-black hover:text-red-400 transition-colors px-2">&times;</button>
                </div>
                
                <!-- Category Tabs -->
                <div class="flex p-3 gap-2 overflow-x-auto border-b border-slate-800 shrink-0 scrollbar-none">
                    <button onclick="SlangEngine.switchTab('izreke')" class="${tabClass('izreke')}">👵 Izreke</button>
                    <button onclick="SlangEngine.switchTab('beograd')" class="${tabClass('beograd')}">🏙️ Beograd</button>
                    <button onclick="SlangEngine.switchTab('neznost')" class="${tabClass('neznost')}">❤️ Nežnost</button>
                    <button onclick="SlangEngine.switchTab('kafana')" class="${tabClass('kafana')}">🍷 Kafana</button>
                    <button onclick="SlangEngine.switchTab('juzni')" class="${tabClass('juzni')}">🌶️ Južni</button>
                </div>

                <!-- Content Feed -->
                <div class="flex-1 p-4 overflow-y-auto space-y-4 pb-24">
                    <div class="flex justify-between items-center mb-2">
                        <p class="text-[11px] font-black uppercase tracking-widest text-slate-400">${categoryTitles[this.currentTab] || 'SLENG'}</p>
                        <span class="text-[10px] font-bold bg-slate-800 text-blue-400 px-2.5 py-1 rounded-full border border-slate-700">${activeData.length} izraza</span>
                    </div>
                    
                    ${activeData.map((item) => {
                        const isStarred = !!(window.state && window.state.mistakeLog && window.state.mistakeLog[item.id]);
                        return `
                        <div class="bg-slate-800 border-2 border-slate-700/80 rounded-2xl p-4 hover:border-blue-500/80 transition-all shadow-md group">
                            <!-- Title & Controls -->
                            <div class="flex justify-between items-start mb-2 gap-2">
                                <div class="flex-1">
                                    <div class="flex items-baseline gap-2 flex-wrap">
                                        <h3 class="text-xl font-black text-white group-hover:text-blue-400 transition-colors">${item.slang}</h3>
                                        ${item.sr_cyr ? `<span class="text-xs font-bold text-slate-400 font-serif">(${item.sr_cyr})</span>` : ''}
                                    </div>
                                    <p class="text-xs font-bold text-emerald-400 mt-1">Meaning: <span class="text-white font-medium">${item.meaning}</span></p>
                                    <p class="text-[11px] font-medium text-slate-400 italic mt-0.5">Literal: "${item.literal}"</p>
                                </div>
                                <div class="flex items-center gap-1.5 shrink-0">
                                    <!-- Star / Flashcard toggle button -->
                                    <button onclick="SlangEngine.toggleStar('${item.id}', this)" class="w-8 h-8 rounded-full flex items-center justify-center text-lg ${isStarred ? 'text-yellow-400 bg-yellow-400/20' : 'text-slate-400 hover:text-yellow-400 bg-slate-900'} active:scale-90 transition-all border border-slate-700" title="Dodaj u SRS Flashcards kartice">
                                        ${isStarred ? '★' : '☆'}
                                    </button>
                                    <!-- Pronounce button -->
                                    <button onclick="SlangEngine.playAudio('${item.slang}')" class="w-8 h-8 rounded-full flex items-center justify-center text-sm text-blue-400 hover:text-white bg-slate-900 hover:bg-blue-600 active:scale-90 transition-all border border-slate-700" title="Poslušaj izgovor">
                                        🔊
                                    </button>
                                </div>
                            </div>

                            <!-- Cultural Context Note -->
                            ${item.cultural_note ? `
                            <div class="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 mb-2.5 mt-2">
                                <div class="flex items-center gap-1.5 mb-1 text-[10px] font-black uppercase tracking-wider text-amber-400">
                                    <span>💡</span> KADA SE KORISTI
                                </div>
                                <p class="text-xs text-slate-300 leading-relaxed font-normal">${item.cultural_note}</p>
                            </div>
                            ` : ''}

                            <!-- Example Usage -->
                            <div class="bg-slate-900 rounded-xl p-3 flex gap-2.5 items-center border border-slate-700/40">
                                <span class="text-base shrink-0">🗣️</span>
                                <p class="text-xs font-medium text-slate-300 italic">"${item.usage}"</p>
                            </div>
                        </div>
                        `;
                    }).join('')}
                    
                    <!-- Trainer Launch Banner -->
                    <div class="mt-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 text-center shadow-xl shadow-blue-500/20 border border-blue-400/30">
                        <div class="w-12 h-12 rounded-2xl bg-white/10 mx-auto flex items-center justify-center text-2xl mb-2 backdrop-blur-sm">⚡</div>
                        <h4 class="text-lg font-black mb-1 text-white">Spremi se za Sleng Kviz!</h4>
                        <p class="text-xs text-blue-100 mb-4 font-medium max-w-sm mx-auto">Pogodi pravo kulturno značenje. Sve greške automatski idu u tvoj <span class="font-bold underline">Flashcard deck</span> za vežbu!</p>
                        <button onclick="SlangEngine.startQuiz()" class="bg-white text-blue-900 px-6 py-3.5 rounded-xl font-black text-sm active:scale-95 transition-transform w-full shadow-lg hover:bg-blue-50">Započni Kviz ⚡</button>
                    </div>
                </div>
            </div>
        `;
    },

    switchTab: function(tab) {
        this.currentTab = tab;
        const overlay = document.getElementById('arcade-game-overlay');
        if (overlay) this.renderView(overlay);
    },

    playAudio: function(text) {
        if (window.app && window.app.speakPhrase) {
            window.app.speakPhrase(text, 'sr-RS');
        }
    },

    toggleStar: function(id, btnEl) {
        if (!window.state) return;
        if (!window.state.mistakeLog) window.state.mistakeLog = {};

        const isCurrentlySaved = !!window.state.mistakeLog[id];
        if (isCurrentlySaved) {
            delete window.state.mistakeLog[id];
        } else {
            window.state.mistakeLog[id] = 5; // Priority weight for SRS Flashcards
        }

        if (window.app && window.app.saveStats) window.app.saveStats();

        // Update button UI
        const nowSaved = !isCurrentlySaved;
        if (btnEl) {
            btnEl.innerHTML = nowSaved ? '★' : '☆';
            btnEl.className = nowSaved 
                ? 'w-8 h-8 rounded-full flex items-center justify-center text-lg text-yellow-400 bg-yellow-400/20 active:scale-90 transition-all border border-slate-700'
                : 'w-8 h-8 rounded-full flex items-center justify-center text-lg text-slate-400 hover:text-yellow-400 bg-slate-900 active:scale-90 transition-all border border-slate-700';
        }

        if (window.app && window.app.showToast) {
            window.app.showToast(nowSaved ? '⭐ Dodato u tvoje SRS Flashcard kartice!' : 'Uklonjeno iz kartica.', nowSaved ? 'success' : 'info');
        }
    },

    startQuiz: function() {
        const overlay = document.getElementById('arcade-game-overlay');
        if (!overlay) return;

        // Collect all pool items across active category and others
        let activeData = this.slangData[this.currentTab] || [];
        let allSlangs = [];
        Object.values(this.slangData).forEach(arr => allSlangs.push(...arr));

        if (activeData.length < 3) activeData = allSlangs;

        // Pick 10 random questions
        const questions = [...activeData].sort(() => Math.random() - 0.5).slice(0, 10);
        let currentQ = 0;
        let score = 0;
        let mistakesMade = 0;

        const renderQ = () => {
            if (currentQ >= questions.length) {
                // Game over summary screen
                const isPassed = score >= Math.ceil(questions.length * 0.7);
                if (isPassed && window.app && window.app.addXP) {
                    window.app.addXP(15);
                }

                overlay.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full bg-slate-900 text-white p-6 text-center">
                        <div class="text-6xl mb-4">${isPassed ? '🏆' : '💪'}</div>
                        <h2 class="text-3xl font-black ${isPassed ? 'text-green-400' : 'text-amber-400'} mb-2">
                            Ulični Rejting: ${score}/${questions.length}
                        </h2>
                        <p class="text-slate-300 text-sm mb-4 max-w-xs">
                            ${isPassed 
                                ? 'Svaka čast! Govoriš kao pravi beogradski lokalac i poznaješ izreke!' 
                                : 'Dobar pokušaj! Vežba stvara majstora — ponovi kartice.'}
                        </p>
                        ${mistakesMade > 0 ? `
                        <div class="bg-amber-950/40 border border-amber-600/50 rounded-2xl p-3.5 mb-6 max-w-xs text-xs text-amber-200">
                            💡 Propušteni izrazi (${mistakesMade}) su automatski zabeleženi u tvoj <b>Flashcard Deck</b> za ponavljanje!
                        </div>
                        ` : ''}
                        <button onclick="SlangEngine.renderView(document.getElementById('arcade-game-overlay'))" class="px-6 py-3.5 bg-blue-600 rounded-xl font-black text-sm active:scale-95 transition-transform w-full max-w-xs mb-3 shadow-lg shadow-blue-600/30">
                            Nazad u Rečnik 📖
                        </button>
                        <button onclick="ArcadeEngine._hideOverlay()" class="px-6 py-3.5 bg-slate-800 text-slate-300 rounded-xl font-bold text-sm active:scale-95 transition-transform w-full max-w-xs border border-slate-700">
                            Izađi
                        </button>
                    </div>
                `;
                return;
            }

            const q = questions[currentQ];

            // Generate wrong distractors
            let wrongOptions = allSlangs
                .filter(item => item.id !== q.id && item.meaning !== q.meaning)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            // Sometimes use the literal meaning as a funny distractor if available!
            let distractorChoices = wrongOptions.map(opt => ({ text: opt.meaning, isCorrect: false }));
            if (q.literal && Math.random() < 0.5 && !q.literal.toLowerCase().includes(q.meaning.toLowerCase())) {
                distractorChoices[0] = { text: `"${q.literal}" (Doslovno)`, isCorrect: false };
            }

            let options = this._shuffle([
                { text: q.meaning, isCorrect: true },
                ...distractorChoices
            ]);

            overlay.innerHTML = `
                <div class="flex flex-col h-full bg-slate-900 text-white w-full">
                    <!-- Top Bar -->
                    <div class="flex justify-between items-center p-4 bg-slate-800 border-b border-slate-700 shrink-0">
                        <div class="font-black flex items-center gap-2">
                            <span>⚡</span> Sleng & Izreke Kviz
                        </div>
                        <div class="font-bold text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">
                            ${currentQ + 1} / ${questions.length}
                        </div>
                    </div>
                    
                    <!-- Question Area -->
                    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto w-full overflow-y-auto">
                        <p class="text-slate-400 font-bold mb-2 uppercase tracking-widest text-[11px]">Šta zapravo znači ovaj izraz?</p>
                        
                        <div class="flex items-center justify-center gap-3 mb-6">
                            <h2 class="text-3xl sm:text-4xl font-black text-amber-300 drop-shadow-md">
                                "${q.slang}"
                            </h2>
                            <button onclick="SlangEngine.playAudio('${q.slang}')" class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg hover:bg-blue-600 transition-colors" title="Poslušaj">
                                🔊
                            </button>
                        </div>

                        ${q.sr_cyr ? `<p class="text-slate-400 text-sm font-serif -mt-4 mb-6">(${q.sr_cyr})</p>` : ''}
                        
                        <!-- Options Grid -->
                        <div class="flex flex-col gap-3 w-full" id="slang-quiz-options">
                            ${options.map((opt, idx) => `
                                <button class="slang-btn p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all text-left flex items-center justify-between group hover:border-blue-400 shadow-sm" data-is-correct="${opt.isCorrect}">
                                    <span class="text-white group-hover:text-blue-300 transition-colors">${opt.text}</span>
                                    <span class="text-slate-500 text-xs font-mono">0${idx + 1}</span>
                                </button>
                            `).join('')}
                        </div>

                        <!-- Feedback Panel (hidden initially) -->
                        <div id="slang-quiz-feedback" class="hidden mt-4 p-4 rounded-2xl w-full text-left transition-all"></div>
                    </div>
                </div>
            `;

            document.querySelectorAll('.slang-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const isCorrect = btn.getAttribute('data-is-correct') === 'true';
                    document.querySelectorAll('.slang-btn').forEach(b => b.disabled = true);
                    const feedback = document.getElementById('slang-quiz-feedback');
                    
                    if (isCorrect) {
                        btn.classList.add('border-emerald-500', 'bg-emerald-950/40');
                        if (window.app && window.app.playSound) window.app.playSound('correct');
                        score++;

                        // Decrement mistake weight if present
                        if (window.state && window.state.mistakeLog && window.state.mistakeLog[q.id]) {
                            window.state.mistakeLog[q.id]--;
                            if (window.state.mistakeLog[q.id] <= 0) delete window.state.mistakeLog[q.id];
                            if (window.app && window.app.saveStats) window.app.saveStats();
                        }

                        currentQ++;
                        setTimeout(() => renderQ(), 900);
                    } else {
                        btn.classList.add('border-rose-500', 'bg-rose-950/40');
                        if (window.app && window.app.playSound) window.app.playSound('wrong');
                        mistakesMade++;

                        // LOG MISTAKE TO STATE.MISTAKELOG FOR SRS FLASHCARDS!
                        if (window.state) {
                            if (!window.state.mistakeLog) window.state.mistakeLog = {};
                            window.state.mistakeLog[q.id] = (window.state.mistakeLog[q.id] || 0) + 1;
                            if (window.app && window.app.saveStats) window.app.saveStats();
                        }

                        // Highlight correct button
                        const correctBtn = document.querySelector('.slang-btn[data-is-correct="true"]');
                        if (correctBtn) correctBtn.classList.add('border-emerald-500', 'bg-emerald-950/40');

                        // Show educational feedback card
                        if (feedback) {
                            feedback.classList.remove('hidden');
                            feedback.className = 'mt-4 p-4 bg-slate-800 border-2 border-amber-500/60 rounded-2xl text-left w-full';
                            feedback.innerHTML = `
                                <div class="flex items-center gap-1.5 text-xs font-black text-amber-400 mb-1">
                                    <span>💡</span> KULTURNA ZABELEŠKA
                                </div>
                                <p class="text-xs text-white mb-1"><b>Tačno:</b> ${q.meaning}</p>
                                <p class="text-[11px] text-slate-300 italic mb-2">Doslovno: "${q.literal}"</p>
                                <p class="text-[11px] text-slate-400">${q.cultural_note || ''}</p>
                            `;
                        }

                        currentQ++;
                        setTimeout(() => renderQ(), 2200);
                    }
                });
            });
        };

        renderQ();
    },

    _shuffle: function(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }
};

window.SlangEngine = SlangEngine;
