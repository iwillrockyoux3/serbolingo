// [SHIELD_DAEMON: VALIDATED]
// 🛡️ SerboLingo — Smart Grammar Tooltips & Interactive Word Inspector (Priority 44)
// Allows tapping any word in lesson sentences to reveal morphology, Serbian case tags,
// verb tenses, dictionary roots, instant translation, audio, and 1-tap Flashcard saving.

(function () {
    'use strict';

    // Transliteration Tables
    const CYR_TO_LAT = {
        'џ': 'dž', 'Џ': 'Dž',
        'љ': 'lj', 'Љ': 'Lj',
        'њ': 'nj', 'Њ': 'Nj',
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'ђ': 'đ', 'е': 'e',
        'ж': 'ž', 'з': 'z', 'и': 'i', 'ј': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 't': 't', 'ћ': 'ć',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'č', 'ш': 'š'
    };

    const LAT_TO_CYR = {
        'dž': 'џ', 'Dž': 'Џ', 'DŽ': 'Џ',
        'lj': 'љ', 'Lj': 'Љ', 'LJ': 'Љ',
        'nj': 'њ', 'Nj': 'Њ', 'NJ': 'Њ',
        'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'đ': 'ђ', 'e': 'е',
        'ž': 'ж', 'z': 'з', 'i': 'и', 'j': 'ј', 'k': 'к', 'l': 'л', 'm': 'м',
        'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'ć': 'ћ',
        'u': 'у', 'f': 'ф', 'h': 'х', 'c': 'ц', 'č': 'ч', 'š': 'ш'
    };

    function toLatin(text) {
        if (!text) return '';
        let res = text;
        for (const [cyr, lat] of Object.entries(CYR_TO_LAT)) {
            res = res.split(cyr).join(lat);
            res = res.split(cyr.toUpperCase()).join(lat.charAt(0).toUpperCase() + lat.slice(1));
        }
        return res;
    }

    function toCyrillic(text) {
        if (!text) return '';
        let res = text;
        for (const [lat, cyr] of Object.entries(LAT_TO_CYR)) {
            if (lat.length > 1) res = res.split(lat).join(cyr);
        }
        for (const [lat, cyr] of Object.entries(LAT_TO_CYR)) {
            if (lat.length === 1) {
                res = res.split(lat).join(cyr);
                res = res.split(lat.toUpperCase()).join(cyr.toUpperCase());
            }
        }
        return res;
    }

    // Common English Irregular Verbs & Nouns
    const EN_IRREGULARS = {
        'went': { root: 'go', tag: 'Past Simple (Prošlo vreme)', trans: 'išao / otišao' },
        'gone': { root: 'go', tag: 'Past Participle (Prošli particip)', trans: 'otišao' },
        'had': { root: 'have', tag: 'Past Simple (Prošlo vreme)', trans: 'imao' },
        'did': { root: 'do', tag: 'Past Simple (Prošlo vreme)', trans: 'uradio' },
        'saw': { root: 'see', tag: 'Past Simple (Prošlo vreme)', trans: 'video' },
        'seen': { root: 'see', tag: 'Past Participle (Prošli particip)', trans: 'viđen' },
        'bought': { root: 'buy', tag: 'Past Simple (Prošlo vreme)', trans: 'kupio' },
        'came': { root: 'come', tag: 'Past Simple (Prošlo vreme)', trans: 'došao' },
        'took': { root: 'take', tag: 'Past Simple (Prošlo vreme)', trans: 'uzeo' },
        'gave': { root: 'give', tag: 'Past Simple (Prošlo vreme)', trans: 'dao' },
        'spoke': { root: 'speak', tag: 'Past Simple (Prošlo vreme)', trans: 'govorio' },
        'ate': { root: 'eat', tag: 'Past Simple (Prošlo vreme)', trans: 'jeo' },
        'drank': { root: 'drink', tag: 'Past Simple (Prošlo vreme)', trans: 'pio' },
        'wrote': { root: 'write', tag: 'Past Simple (Prošlo vreme)', trans: 'pisao' },
        'children': { root: 'child', tag: 'Nepravilna množina (Plural)', trans: 'deca' },
        'men': { root: 'man', tag: 'Nepravilna množina (Plural)', trans: 'ljudi / muškarci' },
        'women': { root: 'woman', tag: 'Nepravilna množina (Plural)', trans: 'žene' },
        'teeth': { root: 'tooth', tag: 'Nepravilna množina (Plural)', trans: 'zubi' },
        'feet': { root: 'foot', tag: 'Nepravilna množina (Plural)', trans: 'stopala' }
    };

    // Deep Linguistic Knowledge Base for Serbian Function Words, Verbs, Nouns & Greetings
    const SR_CORE_GRAMMAR = {
        'kako': {
            root: 'kako', pos: 'upitni prilog', translation: 'how / in what way',
            gender: null, tense: null, caseTag: 'Upitna reč za način',
            explanation: 'Upitni prilog za način (kako?). Koristi se za postavljanje pitanja o stanju, načinu ili izgovoru.',
            example: 'Kako se kaže ova reč?', exampleEn: 'How do you say this word?',
            collocations: 'kako se kaže (how do you say), kako si (how are you), kako ide (how goes it)',
            syntaxNote: 'Uz rečcu "se" formira bezličnu frazu "kako se kaže..." (kako se prevodi ili izgovara).'
        },
        'se': {
            root: 'sebe', pos: 'povratna rečca', translation: 'oneself / reflexive marker',
            gender: null, tense: null, caseTag: 'Povratna rečca / Pasiv',
            explanation: 'Kratki oblik povratne zamenice. Uz glagole tvori povratne glagole ("smejati se") ili bezlično/pasivno značenje ("kaže se" = uopšteno se govori).',
            example: 'Kako se zoveš?', exampleEn: 'What is your name?',
            collocations: 'kaže se (it is said), zove se (his/her name is), nalazi se (is located)',
            syntaxNote: 'Zauzima enklitičku (drugu) poziciju u rečenici, odmah iza prve naglašene celine.'
        },
        'kaže': {
            root: 'kazati', pos: 'glagol', translation: 'says / tells / is said',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 3. lice jednine ("On/Ona/Ono")',
            explanation: 'Sadašnje vreme glagola "kazati". U frazi "kako se kaže" koristi se pasivno za prevod ili izgovor.',
            example: 'On kaže da dolazi sutra.', exampleEn: 'He says he is coming tomorrow.',
            collocations: 'kako se kaže (how do you say), šta kažeš (what do you say), tako se kaže (that is how it is said)',
            syntaxNote: 'Za prošlost se koristi perfekat: "rekao je" (muški rod) / "rekla je" (ženski rod).'
        },
        'kaze': {
            root: 'kazati', pos: 'glagol', translation: 'says / tells / is said',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 3. lice jednine',
            explanation: 'Sadašnje vreme glagola "kazati" (pisano bez dijakritika: kaže).',
            example: 'Kako se kaže "jutro"?', exampleEn: 'How do you say "morning"?',
            collocations: 'kako se kaže (how do you say), šta kažeš (what do you say)',
            syntaxNote: 'Pravilno se piše sa dijakritikom: "kaže".'
        },
        'kažem': {
            root: 'kazati', pos: 'glagol', translation: 'I say / I tell',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 1. lice jednine ("Ja")',
            explanation: '1. lice jednine prezenta glagola "kazati".',
            example: 'Kažem ti istinu.', exampleEn: 'I am telling you the truth.',
            collocations: 'ja kažem (I say), kažem ti (I tell you)'
        },
        'kažeš': {
            root: 'kazati', pos: 'glagol', translation: 'you say',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 2. lice jednine ("Ti")',
            explanation: '2. lice jednine prezenta glagola "kazati".',
            example: 'Šta kažeš na ovo?', exampleEn: 'What do you say to this?',
            collocations: 'šta kažeš (what do you say), kako ti kažeš (as you say)'
        },
        'rekao': {
            root: 'reći', pos: 'glagol', translation: 'said / told (masculine)',
            gender: 'm', tense: 'Perfekat (Prošlo vreme)', caseTag: 'Prošlo vreme — muški rod jednine',
            explanation: 'Glagolski pridev radni muškog roda za prošlo vreme (Perfekat) od "reći".',
            example: 'On je to rekao juče.', exampleEn: 'He said that yesterday.',
            collocations: 'rekao je (he said), ja sam rekao (I said masc)'
        },
        'rekla': {
            root: 'reći', pos: 'glagol', translation: 'said / told (feminine)',
            gender: 'ž', tense: 'Perfekat (Prošlo vreme)', caseTag: 'Prošlo vreme — ženski rod jednine',
            explanation: 'Glagolski pridev radni ženskog roda za prošlo vreme (Perfekat) od "reći".',
            example: 'Ona je rekla istinu.', exampleEn: 'She told the truth.',
            collocations: 'rekla je (she said), ja sam rekla (I said fem)'
        },
        'dobro': {
            root: 'dobar', pos: 'pridev / prilog', translation: 'good / well / fine',
            gender: 's', tense: null, caseTag: 'Srednji rod — Nominativ/Akuzativ jednine',
            explanation: 'Pridev "dobar" za srednji rod ("dobro jutro", "dobro dete") ili prilog za način ("on dobro radi").',
            example: 'Dobro jutro, kako si?', exampleEn: 'Good morning, how are you?',
            collocations: 'dobro jutro (good morning), dobar dan (good afternoon), dobro veče (good evening), sve je dobro (all is good)',
            syntaxNote: 'Pridev se slaže sa imenicom u rodu: dobar dan (m), dobra vest (ž), dobro jutro (s).'
        },
        'dobar': {
            root: 'dobar', pos: 'pridev', translation: 'good / kind',
            gender: 'm', tense: null, caseTag: 'Muški rod — Nominativ jednine',
            explanation: 'Osnovni oblik prideva za muški rod jednine.',
            example: 'On je dobar prijatelj.', exampleEn: 'He is a good friend.',
            collocations: 'dobar dan (good afternoon), dobar posao (good job), dobar čovek (good man)'
        },
        'dobra': {
            root: 'dobar', pos: 'pridev', translation: 'good',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Oblik prideva "dobar" za ženski rod jednine ili nominativ množine srednjeg roda.',
            example: 'Ovo je dobra knjiga.', exampleEn: 'This is a good book.',
            collocations: 'dobra noć / laku noć (good night), dobra ideja (good idea)'
        },
        'jutro': {
            root: 'jutro', pos: 'imenica', translation: 'morning',
            gender: 's', tense: null, caseTag: 'Srednji rod — Nominativ/Akuzativ jednine',
            explanation: 'Imenica srednjeg roda sa završetkom na -o. Koristi se u tradicionalnom pozdravu "Dobro jutro!".',
            example: 'Svako jutro pijem kafu.', exampleEn: 'Every morning I drink coffee.',
            collocations: 'dobro jutro (good morning), svako jutro (every morning), rano ujutru (early in the morning)',
            syntaxNote: 'Za radnju koja se odvija u toku jutra koristi se priloški oblik "ujutru" ("ujutru ustajem").'
        },
        'dan': {
            root: 'dan', pos: 'imenica', translation: 'day',
            gender: 'm', tense: null, caseTag: 'Muški rod — Nominativ jednine',
            explanation: 'Imenica muškog roda. Standardan pozdrav tokom dana: "Dobar dan!". Množina glasi "dani".',
            example: 'Dobar dan, gospodine!', exampleEn: 'Good day, sir!',
            collocations: 'dobar dan (good afternoon), svaki dan (every day), lep dan (nice day)'
        },
        'veče': {
            root: 'veče', pos: 'imenica', translation: 'evening',
            gender: 's', tense: null, caseTag: 'Srednji rod — Nominativ jednine',
            explanation: 'Imenica srednjeg roda. Standardan večernji pozdrav: "Dobro veče!".',
            example: 'Dobro veče, dobrodošli!', exampleEn: 'Good evening, welcome!',
            collocations: 'dobro veče (good evening), svako veče (every evening), uveče (in the evening)',
            syntaxNote: 'Prilog za vreme radnje tokom večeri glasi "uveče" ("uveče čitam knjigu").'
        },
        'noć': {
            root: 'noć', pos: 'imenica', translation: 'night',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Imenica ženskog roda (i-deklinacija). Pozdrav za laku noć: "Laku noć!" (akuzativ).',
            example: 'Laku noć i lepo spavaj.', exampleEn: 'Good night and sleep well.',
            collocations: 'laku noć (good night), noćas (tonight), po noći (at night)',
            syntaxNote: 'U pozdravu "Laku noć", oba elementa su u akuzativu (koga/šta želim? -> laku noć).'
        },
        'hvala': {
            root: 'hvala', pos: 'rečca / imenica', translation: 'thank you / thanks',
            gender: null, tense: null, caseTag: 'Usklik zahvalnosti',
            explanation: 'Glavni izraz zahvalnosti u srpskom jeziku.',
            example: 'Hvala ti puno na pomoći!', exampleEn: 'Thank you very much for your help!',
            collocations: 'hvala lepo (thank you kindly), hvala puno (thanks a lot), veliko hvala (big thanks)'
        },
        'molim': {
            root: 'moliti', pos: 'glagol / rečca', translation: 'please / you are welcome',
            gender: null, tense: 'Prezent — 1. lice jednine', caseTag: 'Učtiva rečca / Prezent ("Ja")',
            explanation: 'Učtiva reč: molba ("molim vas"), odgovor na hvala ("molim / nema na čemu"), ili odziv na poziv.',
            example: 'Jednu kafu, molim.', exampleEn: 'One coffee, please.',
            collocations: 'molim vas (please formal), molim te (please informal), nema na čemu / molim (you are welcome)'
        },
        'zdravo': {
            root: 'zdravo', pos: 'pozdrav', translation: 'hello / hi / healthy',
            gender: null, tense: null, caseTag: 'Prijateljski pozdrav',
            explanation: 'Univerzalan prijateljski pozdrav u svako doba dana. Nastao od reči za dobro zdravlje.',
            example: 'Zdravo, kako si danas?', exampleEn: 'Hello, how are you today?',
            collocations: 'zdravo svima (hello everyone), budi zdravo (stay healthy)'
        },
        'ćao': {
            root: 'ćao', pos: 'pozdrav', translation: 'hi / bye',
            gender: null, tense: null, caseTag: 'Neformalni pozdrav',
            explanation: 'Neformalan pozdrav pri susretu i pri rastanku sa prijateljima.',
            example: 'Ćao! Vidimo se sutra.', exampleEn: 'Bye! See you tomorrow.'
        },
        'cao': {
            root: 'ćao', pos: 'pozdrav', translation: 'hi / bye',
            gender: null, tense: null, caseTag: 'Neformalni pozdrav',
            explanation: 'Neformalan pozdrav pri susretu i pri rastanku (ćao).',
            example: 'Ćao! Vidimo se.', exampleEn: 'Bye! See you.'
        },
        'doviđenja': {
            root: 'doviđenja', pos: 'pozdrav', translation: 'goodbye / until next time',
            gender: null, tense: null, caseTag: 'Formalni pozdrav pri rastanku',
            explanation: 'Standardan formalni pozdrav pri rastanku (doslovno: "do ponovnog viđenja").',
            example: 'Hvala i doviđenja!', exampleEn: 'Thank you and goodbye!'
        },
        'šta': {
            root: 'šta', pos: 'upitna zamenica', translation: 'what',
            gender: null, tense: null, caseTag: 'Upitna zamenica (Nominativ/Akuzativ)',
            explanation: 'Upitna zamenica za stvari, radnje i pojmove.',
            example: 'Šta radiš večeras?', exampleEn: 'What are you doing tonight?',
            collocations: 'šta je ovo (what is this), šta ima (what is up), šta želiš (what do you want)'
        },
        'sta': {
            root: 'šta', pos: 'upitna zamenica', translation: 'what',
            gender: null, tense: null, caseTag: 'Upitna zamenica (šta)',
            explanation: 'Upitna zamenica za stvari i pojmove (pravilno se piše: "šta").',
            example: 'Šta radiš?', exampleEn: 'What are you doing?'
        },
        'ko': {
            root: 'ko', pos: 'upitna zamenica', translation: 'who',
            gender: null, tense: null, caseTag: 'Upitna zamenica za lica (Nominativ)',
            explanation: 'Upitna zamenica za osobe. U genitivu i akuzativu glasi "koga".',
            example: 'Ko je tvoj najbolji prijatelj?', exampleEn: 'Who is your best friend?',
            collocations: 'ko je to (who is that), ko dolazi (who is coming)'
        },
        'gde': {
            root: 'gde', pos: 'upitni prilog', translation: 'where',
            gender: null, tense: null, caseTag: 'Prilog za mesto',
            explanation: 'Postavlja pitanje o lokaciji ili odredištu.',
            example: 'Gde se nalazi škola?', exampleEn: 'Where is the school located?',
            collocations: 'gde je (where is), gde si (where are you), gde živiš (where do you live)'
        },
        'kada': {
            root: 'kada', pos: 'upitni prilog', translation: 'when',
            gender: null, tense: null, caseTag: 'Prilog za vreme',
            explanation: 'Postavlja pitanje o vremenu odigravanja radnje.',
            example: 'Kada polazi voz?', exampleEn: 'When does the train leave?'
        },
        'kad': {
            root: 'kada', pos: 'upitni prilog', translation: 'when',
            gender: null, tense: null, caseTag: 'Prilog za vreme (kraći oblik)',
            explanation: 'Kraći oblik priloga "kada".',
            example: 'Kad se vidimo?', exampleEn: 'When do we meet?'
        },
        'zašto': {
            root: 'zašto', pos: 'upitni prilog', translation: 'why',
            gender: null, tense: null, caseTag: 'Prilog za uzrok',
            explanation: 'Postavlja pitanje o razlogu ili svrsi radnje.',
            example: 'Zašto učiš srpski?', exampleEn: 'Why are you learning Serbian?'
        },
        'koliko': {
            root: 'koliko', pos: 'prilog za količinu', translation: 'how much / how many',
            gender: null, tense: null, caseTag: 'Količinski prilog',
            explanation: 'Označava meru ili cenu. Imenice uz njega stoje u genitivu (koga/čega?).',
            example: 'Koliko ovo košta?', exampleEn: 'How much does this cost?'
        },
        'da': {
            root: 'da', pos: 'rečca / veznik', translation: 'yes / that / to',
            gender: null, tense: null, caseTag: 'Potvrdna rečca / Veznik',
            explanation: 'Kao rečca znači "da" (yes). Kao veznik povezuje rečenice: "Želim da idem" (I want to go).',
            example: 'Da, razumem.', exampleEn: 'Yes, I understand.'
        },
        'ne': {
            root: 'ne', pos: 'odrična rečca', translation: 'no / not',
            gender: null, tense: null, caseTag: 'Odrična rečca',
            explanation: 'Negacija u odgovoru ("Ne") ili negacija ispred glagola ("ne znam" = I do not know).',
            example: 'Ne, hvala.', exampleEn: 'No, thank you.'
        },
        'je': {
            root: 'biti', pos: 'pomoćni glagol', translation: 'is',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 3. lice jednine ("On/Ona/Ono")',
            explanation: 'Nenaglašeni (kratki) oblik glagola "biti" za sadašnje vreme.',
            example: 'Ovo je moja kuća.', exampleEn: 'This is my house.',
            collocations: 'on je (he is), ona je (she is), to je (that is)'
        },
        'sam': {
            root: 'biti', pos: 'pomoćni glagol', translation: 'am',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 1. lice jednine ("Ja")',
            explanation: 'Kratki oblik glagola "biti" u prezentu za prvo lice jednine.',
            example: 'Ja sam učenik.', exampleEn: 'I am a student.',
            collocations: 'ja sam (I am), bio sam (I was masc), radila sam (I worked fem)'
        },
        'si': {
            root: 'biti', pos: 'pomoćni glagol', translation: 'are',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 2. lice jednine ("Ti")',
            explanation: 'Kratki oblik glagola "biti" za drugo lice jednine.',
            example: 'Ti si moj prijatelj.', exampleEn: 'You are my friend.',
            collocations: 'ti si (you are), gde si (where are you)'
        },
        'smo': {
            root: 'biti', pos: 'pomoćni glagol', translation: 'are',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 1. lice množine ("Mi")',
            explanation: 'Kratki oblik glagola "biti" za prvo lice množine.',
            example: 'Mi smo spremni.', exampleEn: 'We are ready.'
        },
        'ste': {
            root: 'biti', pos: 'pomoćni glagol', translation: 'are',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 2. lice množine / persiranje ("Vi")',
            explanation: 'Kratki oblik glagola "biti" za drugo lice množine ili učtivo obraćanje jednoj osobi.',
            example: 'Kako ste danas?', exampleEn: 'How are you today?'
        },
        'su': {
            root: 'biti', pos: 'pomoćni glagol', translation: 'are',
            gender: null, tense: 'Prezent (Sadašnje vreme)', caseTag: 'Prezent — 3. lice množine ("Oni/One/Ona")',
            explanation: 'Kratki oblik glagola "biti" za treće lice množine.',
            example: 'Oni su kod kuće.', exampleEn: 'They are at home.'
        },
        'bio': {
            root: 'biti', pos: 'glagol', translation: 'was (masculine)',
            gender: 'm', tense: 'Perfekat (Prošlo vreme)', caseTag: 'Prošlo vreme — muški rod jednine',
            explanation: 'Glagolski pridev radni muškog roda glagola "biti".',
            example: 'Bio sam u školi.', exampleEn: 'I was at school.'
        },
        'bila': {
            root: 'biti', pos: 'glagol', translation: 'was (feminine)',
            gender: 'ž', tense: 'Perfekat (Prošlo vreme)', caseTag: 'Prošlo vreme — ženski rod jednine',
            explanation: 'Glagolski pridev radni ženskog roda glagola "biti".',
            example: 'Ona je bila srećna.', exampleEn: 'She was happy.'
        },
        'bilo': {
            root: 'biti', pos: 'glagol', translation: 'was (neuter)',
            gender: 's', tense: 'Perfekat (Prošlo vreme)', caseTag: 'Prošlo vreme — srednji rod jednine',
            explanation: 'Glagolski pridev radni srednjeg roda glagola "biti".',
            example: 'Bilo je odlično.', exampleEn: 'It was great.'
        },
        'bili': {
            root: 'biti', pos: 'glagol', translation: 'were (plural)',
            gender: 'm', tense: 'Perfekat (Prošlo vreme)', caseTag: 'Prošlo vreme — množina',
            explanation: 'Glagolski pridev radni množine glagola "biti".',
            example: 'Mi smo bili tamo.', exampleEn: 'We were there.'
        },
        'škola': {
            root: 'škola', pos: 'imenica', translation: 'school',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Imenica ženskog roda sa završetkom na -a.',
            example: 'Moja škola je velika.', exampleEn: 'My school is big.',
            collocations: 'ići u školu (go to school), osnovna škola (elementary school)'
        },
        'školu': {
            root: 'škola', pos: 'imenica', translation: 'school (accusative)',
            gender: 'ž', tense: null, caseTag: 'Akuzativ (Pravac ili objekat / Accusative)',
            explanation: 'Imenica ženskog roda "škola" u akuzativu (kuda ideš? -> u školu). Nastavak -u označava cilj kretanja ili objekat.',
            example: 'Idem u školu svakog jutra.', exampleEn: 'I go to school every morning.',
            collocations: 'u školu (to school)'
        },
        'knjiga': {
            root: 'knjiga', pos: 'imenica', translation: 'book',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Imenica ženskog roda na -a.',
            example: 'Ovo je zanimljiva knjiga.', exampleEn: 'This is an interesting book.'
        },
        'knjigu': {
            root: 'knjiga', pos: 'imenica', translation: 'book (accusative)',
            gender: 'ž', tense: null, caseTag: 'Akuzativ (Direktan objekat / Accusative)',
            explanation: 'Imenica "knjiga" u akuzativu sa nastavkom -u (šta čitaš? -> knjigu).',
            example: 'Čitam dobru knjigu.', exampleEn: 'I am reading a good book.'
        },
        'kuća': {
            root: 'kuća', pos: 'imenica', translation: 'house / home',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Imenica ženskog roda na -a.',
            example: 'Naša kuća ima baštu.', exampleEn: 'Our house has a garden.',
            collocations: 'kod kuće (at home), ići kući (go home)'
        },
        'kuca': {
            root: 'kuća', pos: 'imenica', translation: 'house / home',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine (kuća)',
            explanation: 'Imenica ženskog roda (kuća, pisano bez dijakritika).',
            example: 'Idem kući.', exampleEn: 'I am going home.'
        },
        'voda': {
            root: 'voda', pos: 'imenica', translation: 'water',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Imenica ženskog roda na -a.',
            example: 'Hladna voda osvežava.', exampleEn: 'Cold water is refreshing.',
            collocations: 'čaša vode (glass of water), piti vodu (drink water)'
        },
        'vodu': {
            root: 'voda', pos: 'imenica', translation: 'water (accusative)',
            gender: 'ž', tense: null, caseTag: 'Akuzativ (Objekat / Accusative)',
            explanation: 'Imenica "voda" u akuzativu sa nastavkom -u.',
            example: 'Pijem svežu vodu.', exampleEn: 'I drink fresh water.'
        },
        'kafa': {
            root: 'kafa', pos: 'imenica', translation: 'coffee',
            gender: 'ž', tense: null, caseTag: 'Ženski rod — Nominativ jednine',
            explanation: 'Imenica ženskog roda.',
            example: 'Kafa lepo miriše.', exampleEn: 'Coffee smells nice.',
            collocations: 'piti kafu (drink coffee), domaća kafa (domestic coffee)'
        },
        'kafu': {
            root: 'kafa', pos: 'imenica', translation: 'coffee (accusative)',
            gender: 'ž', tense: null, caseTag: 'Akuzativ (Objekat / Accusative)',
            explanation: 'Imenica "kafa" u akuzativu sa nastavkom -u.',
            example: 'Pijem jutarnju kafu.', exampleEn: 'I drink morning coffee.'
        }
    };

    // Core English Words with Rich Explanations & Serbian Equivalents
    const EN_CORE_GRAMMAR = {
        'good': {
            root: 'good', pos: 'adjective', translation: 'dobar (m) / dobra (ž) / dobro (s)',
            gender: null, tense: null, caseTag: 'Adjective (Pridev)',
            explanation: 'Standard positive English adjective. In Serbian, adjectives agree in gender and case with the noun: dobar dan (m), dobra noć (f), dobro jutro (n).',
            example: 'Good morning! Have a great day.', exampleEn: 'Dobro jutro! Želim ti lep dan.',
            collocations: 'good morning (dobro jutro), good afternoon (dobar dan), good night (laku noć), good job (dobar posao)'
        },
        'morning': {
            root: 'morning', pos: 'noun', translation: 'jutro (srednji rod)',
            gender: 's', tense: null, caseTag: 'Noun (Imenica srednjeg roda)',
            explanation: 'Period between sunrise and noon. In Serbian: "jutro" (neuter gender, ending in -o).',
            example: 'Every morning I drink coffee.', exampleEn: 'Svako jutro pijem kafu.',
            collocations: 'good morning (dobro jutro), this morning (jutros), early morning (rano jutro)'
        },
        'yes': {
            root: 'yes', pos: 'particle', translation: 'da',
            gender: null, tense: null, caseTag: 'Affirmative Particle (Potvrdna rečca)',
            explanation: 'Standard English affirmative response.',
            example: 'Yes, of course!', exampleEn: 'Da, naravno!'
        },
        'no': {
            root: 'no', pos: 'particle', translation: 'ne',
            gender: null, tense: null, caseTag: 'Negative Particle (Odrična rečca)',
            explanation: 'Standard English negative response.',
            example: 'No, thank you.', exampleEn: 'Ne, hvala.'
        },
        'hello': {
            root: 'hello', pos: 'greeting', translation: 'zdravo / pozdrav',
            gender: null, tense: null, caseTag: 'Greeting (Pozdrav)',
            explanation: 'Universal friendly greeting.',
            example: 'Hello, how are you?', exampleEn: 'Zdravo, kako si?'
        },
        'please': {
            root: 'please', pos: 'polite particle', translation: 'molim / izvolite',
            gender: null, tense: null, caseTag: 'Polite Request (Učtiva rečca)',
            explanation: 'Used to make polite requests or offer something.',
            example: 'One tea, please.', exampleEn: 'Jedan čaj, molim.'
        },
        'thank': {
            root: 'thank', pos: 'verb', translation: 'hvala / zahvaliti',
            gender: null, tense: null, caseTag: 'Expression of Gratitude',
            explanation: 'Used to express thanks.',
            example: 'Thank you for your help.', exampleEn: 'Hvala ti na pomoći.',
            collocations: 'thank you (hvala vam / hvala ti), thanks a lot (hvala puno)'
        },
        'day': {
            root: 'day', pos: 'noun', translation: 'dan (muški rod)',
            gender: 'm', tense: null, caseTag: 'Noun (Imenica muškog roda)',
            explanation: 'Period of 24 hours or daytime. In Serbian: "dan" (masculine).',
            example: 'Have a nice day!', exampleEn: 'Prijatan dan!',
            collocations: 'good day (dobar dan), every day (svaki dan), all day (ceo dan)'
        },
        'night': {
            root: 'night', pos: 'noun', translation: 'noć (ženski rod)',
            gender: 'ž', tense: null, caseTag: 'Noun (Imenica ženskog roda)',
            explanation: 'Period of darkness between sunset and sunrise. In Serbian: "noć" (feminine).',
            example: 'Good night, sleep well.', exampleEn: 'Laku noć, lepo spavaj.',
            collocations: 'good night (laku noć), tonight (noćas)'
        }
    };

    const GrammarEngine = {
        _dictIndex: null,
        activeWordEl: null,
        isAnswered: false, // Anti-cheat guard: Only allowed AFTER user submits their answer

        // Activate or deactivate word inspection mode
        setAnswered: function (answered) {
            this.isAnswered = !!answered;
            const words = document.querySelectorAll('.grammar-word');
            words.forEach(el => {
                if (this.isAnswered) {
                    el.classList.add('cursor-pointer', 'underline', 'decoration-dotted', 'decoration-indigo-400', 'hover:text-indigo-400', 'active:scale-95');
                    el.classList.remove('cursor-default');
                } else {
                    el.classList.remove('cursor-pointer', 'underline', 'decoration-dotted', 'decoration-indigo-400', 'hover:text-indigo-400', 'active:scale-95');
                    el.classList.add('cursor-default');
                }
            });
            if (!this.isAnswered) {
                this.hideTooltip();
            }
        },

        _guessGender: function (word) {
            if (!word || typeof word !== 'string') return null;
            const w = word.toLowerCase().trim();
            if (w.endsWith('a')) return 'ž';
            if (w.endsWith('o') || w.endsWith('e')) return 's';
            return 'm';
        },

        // Build fast in-memory dictionary lookup index
        initIndex: function () {
            if (this._dictIndex) return;
            this._dictIndex = {
                srMap: new Map(),
                enMap: new Map()
            };

            // 1. Index SR_CORE_GRAMMAR (High Priority Curated Serbian Grammar Data)
            for (const [key, item] of Object.entries(SR_CORE_GRAMMAR)) {
                this._dictIndex.srMap.set(key.toLowerCase(), {
                    ...item,
                    audioWord: item.root || key,
                    isEnglish: false
                });
            }

            // 2. Index EN_CORE_GRAMMAR (High Priority Curated English Data)
            for (const [key, item] of Object.entries(EN_CORE_GRAMMAR)) {
                this._dictIndex.enMap.set(key.toLowerCase(), {
                    ...item,
                    audioWord: key,
                    isEnglish: true
                });
            }

            // 3. Index window.SEED_DATA (Over 3,000 SerboLingo Words, Sentences & Grammatical Cases)
            const seed = (typeof window !== 'undefined' && Array.isArray(window.SEED_DATA)) ? window.SEED_DATA : [];
            for (let i = 0; i < seed.length; i++) {
                const item = seed[i];
                if (item.sr_lat) {
                    const srRaw = item.sr_lat.replace(/^[.,?!":;()[\]{}«»„“"'\-*]+|[.,?!":;()[\]{}«»„“"'\-*]+$/g, '').toLowerCase().trim();
                    if (srRaw && !this._dictIndex.srMap.has(srRaw)) {
                        this._dictIndex.srMap.set(srRaw, {
                            root: item.sr_lat,
                            pos: item.pos || 'reč',
                            gender: item.gender && item.gender !== '-' ? item.gender : (item.pos === 'noun' ? this._guessGender(srRaw) : null),
                            tense: item.category === 'past_tense' ? 'Perfekat (Prošlo vreme)' : null,
                            translation: item.en || '',
                            caseTag: item.category ? `Kategorija: ${item.category}` : 'Rečnik',
                            explanation: `Reč iz SerboLingo rečnika (${item.category || item.pos || 'vokabular'}).`,
                            example: item.example_sr || null,
                            exampleEn: item.example_en || null,
                            phonetic: item.phonetic || null,
                            audioWord: item.sr_lat,
                            isEnglish: false
                        });
                    }
                }
                if (item.en) {
                    const enRaw = item.en.replace(/^[.,?!":;()[\]{}«»„“"'\-*]+|[.,?!":;()[\]{}«»„“"'\-*]+$/g, '').toLowerCase().trim();
                    if (enRaw && !this._dictIndex.enMap.has(enRaw)) {
                        this._dictIndex.enMap.set(enRaw, {
                            root: item.en,
                            pos: item.pos || 'word',
                            gender: null,
                            translation: item.sr_lat || '',
                            caseTag: 'Vocabulary',
                            explanation: `SerboLingo vocabulary entry (${item.category || item.pos || 'word'}).`,
                            example: item.example_en || null,
                            exampleEn: item.example_sr || null,
                            audioWord: item.en,
                            isEnglish: true
                        });
                    }
                }
            }

            // 4. Index DICTIONARY fallback
            const dict = (typeof DICTIONARY !== 'undefined' && Array.isArray(DICTIONARY))
                ? DICTIONARY
                : ((typeof window !== 'undefined' && Array.isArray(window.DICTIONARY)) ? window.DICTIONARY : []);

            for (let i = 0; i < dict.length; i++) {
                const item = dict[i];
                if (item.sr_lat) {
                    const srLower = item.sr_lat.toLowerCase().trim();
                    if (!this._dictIndex.srMap.has(srLower)) {
                        this._dictIndex.srMap.set(srLower, {
                            root: item.sr_lat,
                            pos: item.pos || 'reč',
                            gender: item.gender && item.gender !== '-' ? item.gender : this._guessGender(srLower),
                            translation: item.en || '',
                            caseTag: 'Osnovni oblik (Rečnik)',
                            explanation: `Osnovni oblik reči iz rečnika.`,
                            example: item.example_sr || null,
                            exampleEn: item.example_en || null,
                            audioWord: item.sr_lat,
                            isEnglish: false
                        });
                    }
                }
                if (item.en) {
                    const enLower = item.en.toLowerCase().trim();
                    if (!this._dictIndex.enMap.has(enLower)) {
                        this._dictIndex.enMap.set(enLower, {
                            root: item.en,
                            pos: item.pos || 'word',
                            gender: null,
                            translation: item.sr_lat || '',
                            caseTag: 'Base Form',
                            explanation: `Base vocabulary form.`,
                            example: item.example_en || null,
                            exampleEn: item.example_sr || null,
                            audioWord: item.en,
                            isEnglish: true
                        });
                    }
                }
            }
        },

        // Wrap ONLY target words/phrases inside a question with interactive spans (clickable ONLY after answering).
        // Instruction prefixes (e.g. "Translate:", "Prevedi:", "Kako se kaže") remain plain, non-pressable text.
        wrapInteractiveWords: function (text) {
            if (!text || typeof text !== 'string') return text;

            // Regex matches words (both Latin with diacritics and Cyrillic) and keeps whitespace/punctuation
            const tokenRegex = /([a-zA-ZčćžšđČĆŽŠĐ\u0400-\u04FF]+)/g;
            const dynamicClasses = this.isAnswered
                ? 'cursor-pointer underline decoration-dotted decoration-indigo-400 hover:text-indigo-400 font-bold transition-all px-0.5 rounded hover:bg-indigo-50/70 dark:hover:bg-indigo-900/30 active:scale-95'
                : 'cursor-default font-bold';

            const wrapSegment = (seg) => seg.replace(tokenRegex, (word) => {
                const clean = word.replace(/'/g, "\\'");
                return `<span class="grammar-word ${dynamicClasses}" onclick="GrammarEngine.showTooltip(this, '${clean}')" data-word="${clean}">${word}</span>`;
            });

            // 1. Quoted target segments (e.g. Translate: "to be", Kako se kaže "mačka"?):
            //    only the text inside quotes becomes inspectable; prompt instructions stay static.
            const quoteRegex = /"([^"]+)"|„([^“]+)[“"]|“([^”]+)”/g;
            if (quoteRegex.test(text)) {
                quoteRegex.lastIndex = 0;
                let out = '';
                let lastIdx = 0;
                let m;
                while ((m = quoteRegex.exec(text)) !== null) {
                    out += text.slice(lastIdx, m.index);
                    const fullMatch = m[0];
                    const inner = m[1] || m[2] || m[3] || '';
                    const openQ = fullMatch[0];
                    const closeQ = fullMatch[fullMatch.length - 1];
                    out += openQ + wrapSegment(inner) + closeQ;
                    lastIdx = m.index + fullMatch.length;
                }
                out += text.slice(lastIdx);
                return out;
            }

            // 2. Unquoted prompts starting with a known instruction prefix + ":" (e.g. AI-generated "Translate: apple")
            const prefixMatch = text.match(/^((?:Translate(?:\s+(?:phrase|sentence|word))?|Prevedi(?:\s+(?:frazu|rečenicu|reč))?|Arrange|Složi\s+rečenicu|Spell|Napiši|Say(?:\s+this(?:\s+sentence)?)?(?:\s+in\s+\w+)?|What\s+is|Šta\s+je|Which\s+picture\s+is|Koja\s+slika\s+je|Add\s+punctuation|Dodaj\s+interpunkciju)\s*:\s*)(.+)$/is);
            if (prefixMatch) {
                return prefixMatch[1] + wrapSegment(prefixMatch[2]);
            }

            // 3. Bare target word or sentence (e.g. fill-blank sentence or picture_choice word)
            return wrapSegment(text);
        },

        // Analyze tapped word for dictionary definition, case, gender, and verb tense
        analyzeWord: function (rawWord) {
            this.initIndex();

            const cleaned = rawWord.trim().replace(/^[.,?!":;()[\]{}«»„“"'\-*]+|[.,?!":;()[\]{}«»„“"'\-*]+$/g, '');
            const lowerWord = cleaned.toLowerCase();
            const isCyrillic = /[\u0400-\u04FF]/.test(cleaned);
            const latWord = isCyrillic ? toLatin(cleaned).toLowerCase() : lowerWord;

            const isSrToEn = (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'sr_to_en');

            // 1. Direct match in curated SR_CORE_GRAMMAR (Highest precision for question words & greetings)
            if (SR_CORE_GRAMMAR[latWord]) {
                const core = SR_CORE_GRAMMAR[latWord];
                return {
                    originalWord: cleaned,
                    root: core.root || cleaned,
                    pos: core.pos || 'reč',
                    gender: core.gender || null,
                    tense: core.tense || null,
                    caseTag: core.caseTag || 'Osnovni oblik',
                    translation: core.translation,
                    explanation: core.explanation,
                    example: core.example || null,
                    exampleEn: core.exampleEn || null,
                    collocations: core.collocations || null,
                    syntaxNote: core.syntaxNote || null,
                    audioWord: core.root || latWord,
                    isEnglish: false
                };
            }

            // 2. Check English irregulars
            if (EN_IRREGULARS[lowerWord]) {
                const irr = EN_IRREGULARS[lowerWord];
                return {
                    originalWord: cleaned,
                    root: irr.root,
                    pos: 'verb / noun',
                    gender: null,
                    tense: irr.tag.includes('Past') ? 'Past Simple (Prošlo vreme)' : null,
                    translation: irr.trans,
                    caseTag: irr.tag,
                    explanation: `Nepravilan oblik u engleskom jeziku od osnovne reči "${irr.root}".`,
                    example: null,
                    audioWord: lowerWord,
                    isEnglish: true
                };
            }

            // 3. Check curated EN_CORE_GRAMMAR
            if (EN_CORE_GRAMMAR[lowerWord]) {
                const core = EN_CORE_GRAMMAR[lowerWord];
                return {
                    originalWord: cleaned,
                    root: core.root || cleaned,
                    pos: core.pos || 'word',
                    gender: core.gender || null,
                    tense: core.tense || null,
                    caseTag: core.caseTag || 'Vocabulary',
                    translation: core.translation,
                    explanation: core.explanation,
                    example: core.example || null,
                    exampleEn: core.exampleEn || null,
                    collocations: core.collocations || null,
                    syntaxNote: core.syntaxNote || null,
                    audioWord: core.root || lowerWord,
                    isEnglish: true
                };
            }

            // 4. Direct match in Serbian dictionary index (from SEED_DATA + DICTIONARY)
            if (this._dictIndex.srMap.has(latWord)) {
                const item = this._dictIndex.srMap.get(latWord);
                return {
                    originalWord: cleaned,
                    root: item.root || item.sr_lat || cleaned,
                    pos: item.pos || 'reč',
                    gender: item.gender || (item.pos === 'noun' ? this._guessGender(latWord) : null),
                    tense: item.tense || null,
                    translation: item.translation || item.en || '',
                    caseTag: item.caseTag || 'Nominativ / Osnovni oblik',
                    explanation: item.explanation || `Reč iz SerboLingo baze vokabulara.`,
                    example: item.example || item.example_sr || null,
                    exampleEn: item.exampleEn || item.example_en || null,
                    collocations: item.collocations || null,
                    syntaxNote: item.syntaxNote || null,
                    audioWord: item.audioWord || item.sr_lat || latWord,
                    isEnglish: false
                };
            }

            // 5. Direct match in English dictionary index
            if (this._dictIndex.enMap.has(lowerWord)) {
                const item = this._dictIndex.enMap.get(lowerWord);
                return {
                    originalWord: cleaned,
                    root: item.root || item.en || cleaned,
                    pos: item.pos || 'word',
                    gender: null,
                    tense: item.tense || null,
                    translation: item.translation || item.sr_lat || '',
                    caseTag: item.caseTag || 'Base Form / Lemma',
                    explanation: item.explanation || `Base dictionary form.`,
                    example: item.example || item.example_en || null,
                    exampleEn: item.exampleEn || item.example_sr || null,
                    collocations: item.collocations || null,
                    syntaxNote: item.syntaxNote || null,
                    audioWord: item.audioWord || item.en || lowerWord,
                    isEnglish: true
                };
            }

            // 6. Morphological Analysis: Serbian Case & Verb Endings
            const morph = this._detectSerbianMorphology(latWord);
            if (morph) {
                return {
                    originalWord: cleaned,
                    root: morph.root,
                    pos: morph.pos,
                    gender: morph.gender,
                    tense: morph.tense || null,
                    translation: morph.translation,
                    caseTag: morph.caseTag,
                    explanation: morph.explanation,
                    example: morph.example,
                    exampleEn: morph.exampleEn,
                    collocations: morph.collocations || null,
                    syntaxNote: morph.syntaxNote || null,
                    audioWord: morph.root,
                    isEnglish: false
                };
            }

            // 7. Morphological Analysis: English Endings (-ed, -ing, -s)
            const enMorph = this._detectEnglishMorphology(lowerWord);
            if (enMorph) {
                return enMorph;
            }

            // 8. Smart Linguistic Deduction (Fallback)
            const guessedGender = this._guessGender(latWord);
            let guessedPos = 'reč';
            let guessedExplanation = `Reč u rečenici.`;
            let guessedTense = null;
            let guessedCase = 'Tekstualni kontekst';

            if (latWord.endsWith('ti') || latWord.endsWith('ći') || latWord.endsWith('ci')) {
                guessedPos = 'glagol';
                guessedExplanation = `Glagol u neodređenom obliku (Infinitiv).`;
            } else if (latWord.endsWith('ao') || latWord.endsWith('la') || latWord.endsWith('lo') || latWord.endsWith('li')) {
                guessedPos = 'glagol';
                guessedTense = 'Perfekat (Prošlo vreme)';
                guessedExplanation = `Glagolski oblik za prošlo vreme (Perfekat).`;
            } else if (latWord.endsWith('m') || latWord.endsWith('š') || latWord.endsWith('mo') || latWord.endsWith('te')) {
                guessedPos = 'glagol';
                guessedTense = 'Prezent (Sadašnje vreme)';
                guessedExplanation = `Glagolski oblik u sadašnjem vremenu (Prezent).`;
            } else {
                guessedPos = 'imenica / izraz';
                guessedCase = 'Nominativ ili kontekstualni padež';
                guessedExplanation = `Imenica ili izraz u rečenici (${guessedGender === 'ž' ? 'verovatno ženski rod' : (guessedGender === 's' ? 'verovatno srednji rod' : 'verovatno muški rod')}).`;
            }

            return {
                originalWord: cleaned,
                root: cleaned,
                pos: guessedPos,
                gender: guessedGender,
                tense: guessedTense,
                translation: isSrToEn ? 'reč u rečenici' : 'word in context',
                caseTag: guessedCase,
                explanation: guessedExplanation,
                example: null,
                audioWord: cleaned,
                isEnglish: false
            };
        },

        // Serbian declension and conjugation pattern engine
        _detectSerbianMorphology: function (word) {
            const len = word.length;
            if (len < 3) return null;

            // --- A. AKUZATIV (Feminine nouns: -u -> -a) ---
            // e.g. školu -> škola, knjigu -> knjiga, kuću -> kuća, kafu -> kafa, vodu -> voda
            if (word.endsWith('u')) {
                const cand = word.slice(0, -1) + 'a';
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Akuzativ (Pravac ili objekat / Accusative)',
                        explanation: `Imenica ženskog roda u akuzativu (koga/šta? kuda?). Koristi se za cilj kretanja ("u školu") ili direktan objekat radnje.`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- B. GENITIV (Feminine: -e -> -a; Masculine/Neuter: -a -> consonant/-o) ---
            // Feminine: škole -> škola, kuće -> kuća, vode -> voda
            if (word.endsWith('e')) {
                const cand = word.slice(0, -1) + 'a';
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Genitiv / Množina (Genitive / Plural)',
                        explanation: `Imenica ženskog roda u genitivu (koga/čega?) ili nominativu množine (npr. "kuće", "knjige").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // Masculine/Neuter Genitive: hleba -> hleb, mleka -> mleko, grada -> grad
            if (word.endsWith('a')) {
                // Drop 'a' for masculine
                const candMasc = word.slice(0, -1);
                if (this._dictIndex.srMap.has(candMasc)) {
                    const item = this._dictIndex.srMap.get(candMasc);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en,
                        caseTag: 'Genitiv (Količina ili odricanje / Genitive)',
                        explanation: `Genitiv muškog roda (koga/čega?). Označava količinu ili negaciju (npr. "nema hleba").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
                // Replace 'a' with 'o' for neuter
                const candNeut = word.slice(0, -1) + 'o';
                if (this._dictIndex.srMap.has(candNeut)) {
                    const item = this._dictIndex.srMap.get(candNeut);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 's',
                        translation: item.en,
                        caseTag: 'Genitiv (Količina ili negacija / Genitive)',
                        explanation: `Genitiv srednjeg roda (koga/čega?). Često se koristi uz reč "nema" (npr. "nema mleka").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- C. DATIV / LOKATIV (Feminine: -i -> -a; Masculine: -u -> cons) ---
            // e.g. školi -> škola, kući -> kuća
            if (word.endsWith('i')) {
                const cand = word.slice(0, -1) + 'a';
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Dativ / Lokativ (Namena ili lokacija)',
                        explanation: `Dativ/Lokativ ženskog roda (kome/čemu? gde?). Označava lokaciju (npr. "u školi") ili primaoca radnje.`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- D. INSTRUMENTAL (-om / -em) ---
            // e.g. školom -> škola, knjigom -> knjiga, autom -> auto, prijateljem -> prijatelj
            if (word.endsWith('om')) {
                const candFem = word.slice(0, -2) + 'a';
                if (this._dictIndex.srMap.has(candFem)) {
                    const item = this._dictIndex.srMap.get(candFem);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'ž',
                        translation: item.en,
                        caseTag: 'Instrumental (Društvo ili sredstvo)',
                        explanation: `Instrumental ženskog roda (s kim/čim?). Označava sredstvo ili društvo (npr. "sa školom", "knjigom").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
                const candMasc = word.slice(0, -2);
                if (this._dictIndex.srMap.has(candMasc)) {
                    const item = this._dictIndex.srMap.get(candMasc);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en,
                        caseTag: 'Instrumental (Sredstvo ili prevoz)',
                        explanation: `Instrumental muškog roda (čime?). Označava prevozno sredstvo ili oruđe (npr. "autom", "vozom").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }
            if (word.endsWith('em')) {
                const candMasc = word.slice(0, -2);
                if (this._dictIndex.srMap.has(candMasc)) {
                    const item = this._dictIndex.srMap.get(candMasc);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en,
                        caseTag: 'Instrumental (Društvo / Companion)',
                        explanation: `Instrumental muškog roda sa mekim suglasnikom (s kim/čim? npr. "sa prijateljem").`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- E. PLURAL (-ovi / -evi) ---
            // e.g. gradovi -> grad, sinovi -> sin, brojevi -> broj
            if (word.endsWith('ovi')) {
                const cand = word.slice(0, -3);
                if (this._dictIndex.srMap.has(cand)) {
                    const item = this._dictIndex.srMap.get(cand);
                    return {
                        root: item.sr_lat,
                        pos: item.pos || 'imenica',
                        gender: 'm',
                        translation: item.en + ' (plural)',
                        caseTag: 'Množina (Nominativ Množine / Plural)',
                        explanation: `Množina jednosložnih imenica muškog roda sa umetnutim nastavkom -ov- (npr. grad -> gradovi).`,
                        example: item.example_sr,
                        exampleEn: item.example_en
                    };
                }
            }

            // --- F. VERB CONJUGATIONS (Prezent: -m, -š, -mo, -te, -e) ---
            // e.g. živim -> živeti, radim -> raditi, volim -> voleti, idemo -> ići, gledaju -> gledati
            const verbEndings = [
                { end: 'mo', person: '1. lice množine: "Mi" (We)', strip: 2 },
                { end: 'te', person: '2. lice množine: "Vi" (You all)', strip: 2 },
                { end: 'm', person: '1. lice jednine: "Ja" (I)', strip: 1 },
                { end: 'š', person: '2. lice jednine: "Ti" (You)', strip: 1 }
            ];

            for (const v of verbEndings) {
                if (word.endsWith(v.end)) {
                    const baseStem = word.slice(0, -v.strip);
                    const infinitiveCandidates = [
                        baseStem + 'ti',
                        baseStem + 'eti',
                        baseStem.slice(0, -1) + 'eti',
                        baseStem.slice(0, -1) + 'ati'
                    ];
                    for (const inf of infinitiveCandidates) {
                        if (this._dictIndex.srMap.has(inf)) {
                            const item = this._dictIndex.srMap.get(inf);
                            return {
                                root: item.sr_lat,
                                pos: 'glagol',
                                gender: null,
                                translation: item.en,
                                caseTag: `Prezent (${v.person})`,
                                explanation: `Sadašnje vreme (Prezent) glagola "${item.sr_lat}" (${item.en}).`,
                                example: item.example_sr,
                                exampleEn: item.example_en
                            };
                        }
                    }
                }
            }

            // --- G. PERFEKAT (Past Participle: -ao, -la, -lo, -li) ---
            // e.g. gledao/gledali -> gledati, išao/išli -> ići
            if (word.endsWith('li') || word.endsWith('ao') || word.endsWith('la')) {
                const stem = word.endsWith('ao') ? word.slice(0, -2) : word.slice(0, -2);
                const infCandidates = [stem + 'ti', stem + 'ati', stem + 'eti'];
                for (const inf of infCandidates) {
                    if (this._dictIndex.srMap.has(inf)) {
                        const item = this._dictIndex.srMap.get(inf);
                        return {
                            root: item.sr_lat,
                            pos: 'glagol',
                            gender: null,
                            translation: item.en + ' (past tense)',
                            caseTag: 'Perfekat (Prošlo vreme / Past Tense)',
                            explanation: `Glagolski oblik za prošlo vreme (Perfekat) od "${item.sr_lat}".`,
                            example: item.example_sr,
                            exampleEn: item.example_en
                        };
                    }
                }
            }

            return null;
        },

        // English morphology detection
        _detectEnglishMorphology: function (word) {
            if (word.endsWith('ed') && word.length > 4) {
                const stem = word.slice(0, -2);
                const cand = this._dictIndex.enMap.has(stem) ? stem : (this._dictIndex.enMap.has(stem + 'e') ? stem + 'e' : null);
                if (cand) {
                    const item = this._dictIndex.enMap.get(cand);
                    return {
                        originalWord: word,
                        root: item.en,
                        pos: 'verb',
                        gender: null,
                        translation: item.sr_lat + ' (prošlost)',
                        caseTag: 'Past Simple (Prošlo vreme)',
                        explanation: `Regular past tense ending (-ed) of verb "${item.en}".`,
                        example: item.example_en,
                        audioWord: item.en,
                        isEnglish: true
                    };
                }
            }

            if (word.endsWith('ing') && word.length > 5) {
                const stem = word.slice(0, -3);
                const cand = this._dictIndex.enMap.has(stem) ? stem : (this._dictIndex.enMap.has(stem + 'e') ? stem + 'e' : null);
                if (cand) {
                    const item = this._dictIndex.enMap.get(cand);
                    return {
                        originalWord: word,
                        root: item.en,
                        pos: 'verb',
                        gender: null,
                        translation: item.sr_lat + ' (trajanje)',
                        caseTag: 'Present Continuous / Gerund',
                        explanation: `Continuous verb form ending (-ing) of "${item.en}".`,
                        example: item.example_en,
                        audioWord: item.en,
                        isEnglish: true
                    };
                }
            }

            return null;
        },

        // Open floating tooltip near tapped element
        showTooltip: function (targetEl, rawWord) {
            // Anti-cheat guard: Only allow word inspection AFTER question is answered
            if (!this.isAnswered) return;
            if (!targetEl || !rawWord) return;
            const tooltip = document.getElementById('grammar-tooltip');
            if (!tooltip) return;

            const info = this.analyzeWord(rawWord);
            this.renderTooltipContent(tooltip, info);

            tooltip.classList.remove('hidden');

            // Tactile audio click
            if (typeof app !== 'undefined' && app.playSound) {
                app.playSound('click');
            }

            // Mobile viewport positioning & clamping
            const rect = targetEl.getBoundingClientRect();
            const tooltipWidth = Math.min(340, window.innerWidth - 20);
            const estimatedHeight = 320;

            let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
            const minLeft = 10;
            const maxLeft = window.innerWidth - tooltipWidth - 10;
            left = Math.max(minLeft, Math.min(left, maxLeft));

            let top = rect.top - estimatedHeight - 12;
            if (top < 12) {
                top = rect.bottom + 12; // place below if no room above
            }
            if (top + estimatedHeight > window.innerHeight - 10) {
                top = Math.max(12, window.innerHeight - estimatedHeight - 12);
            }

            tooltip.style.width = `${tooltipWidth}px`;
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            this.activeWordEl = targetEl;
        },

        hideTooltip: function () {
            const tooltip = document.getElementById('grammar-tooltip');
            if (tooltip) {
                tooltip.classList.add('hidden');
            }
            this.activeWordEl = null;
        },

        renderTooltipContent: function (container, info) {
            const isLearnSr = (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'en_to_sr');
            const isCyrillicMode = (typeof state !== 'undefined' && state.settings && state.settings.script === 'cyrillic');

            const displayWord = isCyrillicMode && !info.isEnglish ? toCyrillic(info.originalWord) : info.originalWord;
            const displayRoot = isCyrillicMode && !info.isEnglish ? toCyrillic(info.root) : info.root;

            const genderBadge = info.gender ? (
                info.gender === 'ž' ? '<span class="px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-300 font-bold text-[11px] border border-pink-500/30 flex items-center gap-1">♀ Ženski rod</span>' :
                info.gender === 'm' ? '<span class="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-300 font-bold text-[11px] border border-blue-500/30 flex items-center gap-1">♂ Muški rod</span>' :
                '<span class="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30 flex items-center gap-1">⚪ Srednji rod</span>'
            ) : '';

            const tenseBadge = info.tense ? `
                <span class="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 flex items-center gap-1">
                    ⏳ ${info.tense}
                </span>
            ` : '';

            const caseBadge = info.caseTag ? `
                <span class="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 flex items-center gap-1">
                    🏷️ ${info.caseTag}
                </span>
            ` : '';

            const collocationsHtml = (info.collocations || info.syntaxNote) ? `
                <div class="mt-2.5 p-2.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-[11px]">
                    ${info.collocations ? `<p class="font-bold text-indigo-200 mb-1">🔗 <span class="text-white">Česte fraze i slaganje:</span> <span class="italic text-indigo-300">${info.collocations}</span></p>` : ''}
                    ${info.syntaxNote ? `<p class="text-slate-300 text-[10.5px] leading-relaxed mt-1">💡 ${info.syntaxNote}</p>` : ''}
                </div>
            ` : '';

            const exampleHtml = info.example ? `
                <div class="mt-2.5 p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300">
                    <div class="flex items-center justify-between">
                        <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Primer u rečenici:</span>
                        <button onclick="GrammarEngine.playWordAudio('${info.example.replace(/'/g, "\\'")}')" class="text-indigo-400 hover:text-indigo-200 text-xs flex items-center gap-1 font-bold">
                            🔊 Slušaj
                        </button>
                    </div>
                    <p class="font-bold text-white mt-1 text-xs">💬 "${info.example}"</p>
                    ${info.exampleEn ? `<p class="text-slate-400 text-[11px] mt-0.5">"${info.exampleEn}"</p>` : ''}
                </div>
            ` : '';

            container.innerHTML = `
                <!-- Top Header -->
                <div class="flex items-start justify-between mb-2 pb-2 border-b border-slate-700/60">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-2xl font-black text-white leading-tight tracking-wide">${displayWord}</span>
                        ${displayRoot && displayRoot.toLowerCase() !== displayWord.toLowerCase() ? `<span class="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">koren: ${displayRoot}</span>` : ''}
                        <button onclick="GrammarEngine.playWordAudio('${info.audioWord}')" class="w-8 h-8 rounded-full bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 flex items-center justify-center text-sm active:scale-90 transition-transform shadow-sm" title="Hear Audio">
                            🔊
                        </button>
                    </div>
                    <button onclick="GrammarEngine.hideTooltip()" class="text-slate-400 hover:text-white font-black text-xs w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors">
                        ✕
                    </button>
                </div>

                <!-- Translation Banner -->
                <div class="py-2 px-3 rounded-2xl bg-gradient-to-r from-indigo-500/25 to-blue-500/25 border border-indigo-500/40 text-indigo-200 font-black text-base mb-2.5 flex items-center justify-between shadow-inner">
                    <span class="tracking-wide">${info.translation}</span>
                    <span class="text-[10px] text-indigo-300 uppercase tracking-widest font-black px-2 py-0.5 rounded-lg bg-indigo-500/30 border border-indigo-400/20">${info.pos}</span>
                </div>

                <!-- Badges (Gender, Tense, Case, Category) -->
                <div class="flex flex-wrap items-center gap-1.5 mb-2.5">
                    ${genderBadge}
                    ${tenseBadge}
                    ${caseBadge}
                </div>

                <!-- Morphological / Grammatical Explanation -->
                <p class="text-xs text-slate-200 leading-relaxed font-medium bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/60 shadow-sm">
                    ${info.explanation}
                </p>

                <!-- Usage & Collocations (How it connects with other words) -->
                ${collocationsHtml}

                <!-- Context Example -->
                ${exampleHtml}

                <!-- Bottom Quick Actions -->
                <div class="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between gap-2">
                    <button onclick="GrammarEngine.addToFlashcards('${info.root}', '${info.translation}')" class="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-left font-bold text-[11px] text-amber-300 flex items-center justify-center gap-1.5 active:scale-95 transition-transform shadow-sm">
                        ⭐ Dodaj u Flashcards
                    </button>
                    <button onclick="GrammarEngine.hideTooltip()" class="py-2 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold text-[11px] text-slate-300 active:scale-95 transition-transform">
                        Zatvori
                    </button>
                </div>
            `;
        },

        playWordAudio: function (word) {
            if (!word) return;
            if (typeof app !== 'undefined' && app.speakWord) {
                const isEnglish = (typeof state !== 'undefined' && state.settings && state.settings.learningDirection === 'sr_to_en');
                app.speakWord(word, isEnglish ? 'en-US' : 'sr-RS');
            } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                const u = new SpeechSynthesisUtterance(word);
                u.lang = 'sr-RS';
                window.speechSynthesis.speak(u);
            }
        },

        addToFlashcards: function (rootWord, translation) {
            if (typeof app !== 'undefined' && app.toggleFlashcard) {
                app.toggleFlashcard(rootWord);
            } else if (typeof state !== 'undefined') {
                if (!state.mistakeLog) state.mistakeLog = [];
                if (!state.mistakeLog.includes(rootWord)) {
                    state.mistakeLog.push(rootWord);
                    if (typeof app !== 'undefined' && app.saveStats) app.saveStats();
                }
            }
            if (typeof app !== 'undefined' && app.showToast) {
                app.showToast(`⭐ "${rootWord}" dodato u Flashcards!`, 'success');
            }
            this.hideTooltip();
        }
    };

    // Auto-dismiss tooltip when clicking outside
    document.addEventListener('click', function (e) {
        const tooltip = document.getElementById('grammar-tooltip');
        if (!tooltip || tooltip.classList.contains('hidden')) return;

        if (tooltip.contains(e.target) || e.target.classList.contains('grammar-word')) {
            return;
        }
        GrammarEngine.hideTooltip();
    });

    window.addEventListener('resize', function () {
        GrammarEngine.hideTooltip();
    });

    // Expose to window
    window.GrammarEngine = GrammarEngine;

})();
