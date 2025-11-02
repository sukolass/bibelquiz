document.addEventListener('mainScriptReady', async () => {
    // =================================================================================
    // Haupt-App-Initialisierung
    // =================================================================================
    // KORREKTUR: Alle DOM-Elemente und globalen Variablen werden zuerst deklariert.
    // ---------------------------------------------------------------------------------
    // --- 1. DOM-Elemente und globale Variablen ---
        // NEU (Kapitel-Quiz): Elemente für die Spielmodus-Auswahl
        const gameModeSelection = document.getElementById('game-mode-selection');
        const gameModeRadios = document.querySelectorAll('input[name="game-mode"]');

        // ERSETZT (Übungsmodus -> Bereichsauswahl): Elemente für die Bereichsauswahl
        const scopeSelectionContainer = document.getElementById('scope-selection-container');
        const openScopeModalButton = document.getElementById('open-scope-modal-button');
        const scopeModal = document.getElementById('scope-modal');
        const closeScopeModalButton = document.getElementById('close-scope-modal-button');
        const scopeBookList = document.getElementById('scope-book-list');
        // NEU: Elemente für das Seed-Erklärungs-Modal
        const showSeedExplanationButton = document.getElementById('show-seed-explanation-button');
        const seedExplanationModal = document.getElementById('seed-explanation-modal');
        const closeSeedExplanationModalButton = document.getElementById('close-seed-explanation-modal-button');
        const seedExplanationContent = document.getElementById('seed-explanation-content');
        const seedContainer = document.getElementById('seed-container'); // KORREKTUR: Fehlende Variablendeklaration
        const mcOptionsContainer = document.getElementById('mc-options-container'); // NEU
        // NEU: Optionen für den MC-Modus (Reihenfolge)
        const seedInput = document.getElementById('seed-input'); // NEU für Seed
        const clearSeedButton = document.getElementById('clear-seed-button'); // NEU für Seed
        const mcQuizOptions = document.getElementById('mc-quiz-options');
        // NEU: Elemente für den Lese-Modus
        const readingOptionsContainer = document.getElementById('reading-options-container');
        const showSummariesCheckbox = document.getElementById('show-summaries-checkbox');
        const summaryPositionOptions = document.getElementById('summary-position-options');
        const readingNavTop = document.getElementById('reading-nav-top');
        const readingNavBottom = document.getElementById('reading-nav-bottom');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        // NEU: Zusätzliche UI-Elemente für die Suche (Checkboxen)
        const showSearchStatsCheckbox = document.getElementById('show-search-stats-checkbox');
        const searchScopeContainer = document.getElementById('search-scope-container'); // Container für den Button
        const openSearchScopeModalButton = document.getElementById('open-search-scope-modal-button');
        const partialWordSearchCheckbox = document.getElementById('partial-word-search-checkbox'); // NEU
        // NEU: Elemente für die "Gehe zu"-Funktion im Lesemodus
        const referenceInput = document.getElementById('reference-input');
        const gotoReferenceButton = document.getElementById('goto-reference-button');
        const randomChapterButton = document.getElementById('random-chapter-button');
        // NEU: Elemente für die Lückensuche
        const gapSearchContainer = document.getElementById('gap-search-container');
        const gapSearchInput = document.getElementById('gap-search-input');
        const gapSearchButton = document.getElementById('gap-search-button');

        const clearSearchButton = document.getElementById('clear-search-button');

        const applyScopeButton = document.getElementById('apply-scope-button');

        // Bestehende Elemente
        const bibleQuizView = document.getElementById('bible-quiz-view');
        const quizInputColumn = document.querySelector('.quiz-input-column'); // NEU
        const verseTextDisplay = document.getElementById('verse-text-display');
        const testamentRadios = document.querySelectorAll('input[name="testament"]');        
        // ZURÜCK ZUM DROPDOWN: Referenz für das Buch-Select-Element
        const bookSelect = document.getElementById('book-select');
        const chapterSelect = document.getElementById('chapter-select');
        const verseSelect = document.getElementById('verse-select');
        const positionInput = document.getElementById('position-input');
        const positionSlider = document.getElementById('position-slider');
        const bookSlider = document.getElementById('book-slider');
        const chapterSlider = document.getElementById('chapter-slider');
        const verseSlider = document.getElementById('verse-slider');
        const bookSliderOutput = document.getElementById('book-slider-output');
        const chapterSliderOutput = document.getElementById('chapter-slider-output');
        const verseSliderOutput = document.getElementById('verse-slider-output');
        const bookSliderMaxLabel = document.getElementById('book-slider-max');
        const chapterSliderMaxLabel = document.getElementById('chapter-slider-max');
        const verseSliderMaxLabel = document.getElementById('verse-slider-max');
        const totalVersesLabel = document.getElementById('total-verses-label');
        const guessButton = document.getElementById('guess-button');
        const newVerseButton = document.getElementById('new-verse-button'); // Wird in index.html definiert
        const feedbackMessage = document.getElementById('feedback-message');
        const feedbackCanvas = document.getElementById('feedback-canvas');
        const statsDisplay = document.getElementById('stats-display');
        const ctx = feedbackCanvas ? feedbackCanvas.getContext('2d') : null;
        const hostNextRoundButton = document.getElementById('host-next-round-button'); // NEU
        const hostResetGameButton = document.getElementById('host-reset-game-button'); // NEU
        
        // NEU: Elemente für Host-Info in der Lobby
        const hostInfoDiv = document.getElementById('host-info');
        const hostAddressesDiv = document.getElementById('host-addresses');
        // NEU: Elemente für die Kontextansicht
        // NEU: Elemente für die Seed-Navigation
        const seededNavContainer = document.getElementById('seeded-nav-container');
        const prevTaskButton = document.getElementById('prev-task-button');
        const nextTaskButton = document.getElementById('next-task-button');
        const seededCounter = document.getElementById('seeded-counter');
        const mcQuestionCounters = document.getElementById('mc-question-counters');
        const showContextButton = document.getElementById('show-context-button');
        const contextView = document.getElementById('context-view');
        const contextTitle = document.getElementById('context-title');
        const contextText = document.getElementById('context-text');
        const contextSummary = document.getElementById('context-summary'); // NEU
        const prevChapterButtons = document.querySelectorAll('.prev-chapter-button'); // NEU
        const nextChapterButtons = document.querySelectorAll('.next-chapter-button'); // NEU
        const closeContextButton = document.getElementById('close-context-button');
        // NEU: Elemente für den Aufgaben-Slider
        const taskSliderContainer = document.getElementById('task-slider-container');
        const taskSlider = document.getElementById('task-slider');
        const taskSliderOutput = document.getElementById('task-slider-output');

    // --- Bibelquiz State ---
    let allVerses = [];
    let allHeadings = []; // NEU (Kapitel-Quiz): Array für die Kapitelüberschriften
    let allSummaries = []; // NEU (Zusammenfassungs-Quiz): Array für die Kapitelzusammenfassungen
    let allMcQuestions = {}; // NEU (Multiple-Choice-Quiz): Objekt für die Fragen
    let currentVerse = null;
    let currentChapterHeadings = null; // NEU (Kapitel-Quiz): Das zu erratende Kapitel
    let currentSummary = null; // NEU (Zusammenfassungs-Quiz): Die zu erratende Zusammenfassung
    let currentMcQuestion = null; // NEU (Multiple-Choice-Quiz): Die aktuelle Frage
    let gameMode = 'singleplayer'; // 'singleplayer' oder 'multiplayer'
    // NEU: Zustand für den sequenziellen MC-Modus
    let mcQuestionQueue = [];
    let mcCurrentIndex = 0;
    let quizMode = 'guessVerse'; // 'guessVerse', 'guessChapter', 'guessSummary', 'multipleChoice'
    let players = {}; // Für den Mehrspielermodus
    let myPlayerId = null; // Eigene Spieler-ID 
    let isPracticeMode = false; // NEU (Übungsmodus): Flag für den Übungsmodus
    // NEU: Zustand für den benutzerdefinierten Bereich
    let customScope = {
        active: false,
        books: [], // Array der ausgewählten Buchnamen (wird jetzt aus `chapters` abgeleitet)
        // NEU: Kapitel-Filterung
        chapters: {} // z.B. { '1. Mose': [1, 2, 5], 'Apostelgeschichte': [] } (leeres Array = alle Kapitel)
    };
    let isUpdating = false; // Flag zur Verhinderung von Endlosschleifen
    let currentContext = { book: null, chapter: null }; // Zustand für die Kontextansicht
    let bookChapterStructure = []; // Struktur für die Kapitelnavigation
    let canonicalBookOrder = []; // NEU: Unveränderliche Liste der Bücher in biblischer Reihenfolge.
    // NEU: Promise, das signalisiert, wann die Verse fertig geladen und verarbeitet sind.
    let versesLoadedPromise;
    // NEU: Zustand für den Seed-basierten Zufallsgenerator
    let randomGenerator = Math.random; // Standardmäßig den normalen Zufallsgenerator verwenden
    let currentSeedString = '';

    // NEU: Zustand für den Seed-basierten sequenziellen Modus
    let seededQueue = [];
    let seededQueueIndex = 0;
    // NEU: Character-Counts für die Dichte-Sortierung
    let bookCharCounts = {};
    let chapterCharCounts = {};
    let searchRankVisibleCounts = { book: 10, chapter: 10, verse: 10 }; // NEU für "Mehr anzeigen"
    // NEU: Daten für die Statistik-Seite
    // NEU: Datenstruktur für Querverweise
    let manualCrossReferenceMap = {}; // Umbenannt für Klarheit
    // NEU: Datenstruktur für automatisch erkannte identische Verse
    let identicalVerseMap = {};
    let searchResultOffset = 0; // NEU für Paginierung der Suchergebnisliste


    // NEU: Definitionen für Buchgruppen
    const BOOK_GROUPS = {
        PENTATEUCH: ["1. Mose", "2. Mose", "3. Mose", "4. Mose", "5. Mose"],
        GOSPELS: ["Matthäus", "Markus", "Lukas", "Johannes"],
        PAULINE_EPISTLES: ["Römer", "1. Korinther", "2. Korinther", "Galater", "Epheser", "Philipper", "Kolosser", "1. Thessalonicher", "2. Thessalonicher", "1. Timotheus", "2. Timotheus", "Titus", "Philemon"],
        MAJOR_PROPHETS: ["Jesaja", "Jeremia", "Klagelieder", "Hesekiel", "Daniel"],
        MINOR_PROPHETS: ["Hosea", "Joel", "Amos", "Obadja", "Jona", "Micha", "Nahum", "Habakuk", "Zephanja", "Haggai", "Sacharja", "Maleachi"],
        PROPHETS: [], // Wird dynamisch gefüllt
        GENERAL_EPISTLES: ["Hebräer", "Jakobus", "1. Petrus", "2. Petrus", "1. Johannes", "2. Johannes", "3. Johannes", "Judas"],
        SAMUEL_KINGS_CHRONICLES: ["1. Samuel", "2. Samuel", "1. Könige", "2. Könige", "1. Chronik", "2. Chronik"],
        KINGS: ["1. Könige", "2. Könige"],
        CHRONICLES: ["1. Chronik", "2. Chronik"],
        AT: [], // Wird dynamisch gefüllt
        NT: []  // Wird dynamisch gefüllt
    };


    const DEBUG_SYNC = false; // NEU: Schalter für Debug-Logs der Synchronisation. Auf `true` setzen, um sie zu aktivieren.
    const NT_BOOKS = [
        "Matthäus", "Markus", "Lukas", "Johannes", "Apostelgeschichte", "Römer",
        "1. Korinther", "2. Korinther", "Galater", "Epheser", "Philipper", "Kolosser",
        "1. Thessalonicher", "2. Thessalonicher", "1. Timotheus", "2. Timotheus", "Titus",
        "1. Thessalonicher", "2. Thessalonicher", "1. Timotheus", "2. Timotheus", "Titus", // KORREKTUR: task-slider-output zu taskSliderOutput
        "Philemon", "Hebräer", "Jakobus", "1. Petrus", "2. Petrus", "1. Johannes",
        "2. Johannes", "3. Johannes", "Judas", "Offenbarung"
    ];
    if (!bibleQuizView || !bookSelect || !positionSlider || !ctx || !contextView || !showContextButton || !hostInfoDiv || !gameModeSelection || !scopeSelectionContainer || !quizInputColumn || !contextSummary || !searchInput || !referenceInput || !gotoReferenceButton || !randomChapterButton || !mcQuizOptions || !seedInput || !clearSeedButton || !seedExplanationModal || !seededNavContainer || !mcQuestionCounters || !taskSliderContainer || !taskSlider || !taskSliderOutput || !partialWordSearchCheckbox || !showSearchStatsCheckbox || !searchScopeContainer || !openSearchScopeModalButton || !seedContainer || !gapSearchContainer || !gapSearchInput || !gapSearchButton) {
        console.error('[FATAL] Ein oder mehrere kritische Bibelquiz-Elemente wurden im HTML nicht gefunden. Skript wird angehalten.', {bibleQuizView , bookSelect , positionSlider , ctx , contextView , showContextButton , hostInfoDiv , gameModeSelection , scopeSelectionContainer , quizInputColumn , contextSummary , searchInput , referenceInput , gotoReferenceButton , randomChapterButton , mcQuizOptions , seedInput , clearSeedButton , seedExplanationModal , seededNavContainer , mcQuestionCounters , taskSliderContainer , taskSlider , taskSliderOutput , partialWordSearchCheckbox , showSearchStatsCheckbox , searchScopeContainer , openSearchScopeModalButton , seedContainer , gapSearchContainer , gapSearchInput , gapSearchButton});
        return;
    }

    // ---------------------------------------------------------------------------------
    // --- 2. Funktionsdefinitionen ---
    // ---------------------------------------------------------------------------------
    // --- Seed-basierter Zufallsgenerator ---
    // Erzeugt eine Hash-Zahl aus einem String
    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return (h1^h2^h3^h4)>>>0;
    }

    // Mulberry32 PRNG
    function mulberry32(a) {
        return function() {
          a |= 0; a = a + 0x6D2B79F5 | 0;
          let t = Math.imul(a ^ a >>> 15, 1 | a);
          t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
          return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }
    // --- Datenverarbeitung ---
    async function loadAndParseVerses() {
        // NEU: Erstelle ein Promise, das von außen awaited werden kann.
        let resolveVersesLoaded;
        versesLoadedPromise = new Promise(resolve => {
            resolveVersesLoaded = resolve;
        });


        // NEU: Detaillierte Protokollierung für die Fehlersuche
        try {
            console.log('[Bibelquiz] Schritt 1: Starte das Laden von "verse.txt".');
            verseTextDisplay.textContent = "Lade Bibelverse...";
            // KORREKTUR (FINAL): Füge einen Cache-Buster hinzu, um sicherzustellen, dass immer die neueste Versliste geladen wird.
            const response = await fetch(`verse.txt?v=${Date.now()}`);
            console.log(`[Bibelquiz] Schritt 2: Antwort vom Server erhalten mit Status: ${response.status}`);
            if (!response.ok) {
                throw new Error(`HTTP-Fehler! Status: ${response.status}. Die Datei 'verse.txt' konnte nicht gefunden oder geladen werden.`);
            }
            verseTextDisplay.textContent = "Verarbeite Bibelverse...";
            const text = await response.text();
            console.log('[Bibelquiz] Schritt 3: Dateiinhalt wird gelesen. Starte Analyse...');
            verseTextDisplay.textContent = "Analysiere Bibelverse...";
            const lines = text.split(/\r?\n/);
            console.log(`[Bibelquiz] Schritt 4: ${lines.length} Zeilen gefunden. Verarbeite jede Zeile...`);

            allVerses = lines.map(line => {
                if (!line.trim()) return null;
                const parts = line.split(';');
                if (parts.length < 5) { // Es müssen mindestens 4 Trennzeichen vorhanden sein
                    console.warn(`[Bibelquiz] Zeile übersprungen (zu wenige Teile): "${line}"`);
                    return null;
                }

                const id = parseInt(parts[0], 10);
                const book = parts[1].trim();
                const chapter = parseInt(parts[2], 10);
                const verse_num = parseInt(parts[3], 10);
                const verseTextWithMarkers = parts.slice(4).join(';').trim(); // Der komplette Text inklusive [__ZAHL__]

                // --- Verarbeitung für manuelle Querverweise ---
                const crossRefRegex = /\[__(\d+)__\]/g;
                let manualMatch;
                while ((manualMatch = crossRefRegex.exec(verseTextWithMarkers)) !== null) {
                    const refId = manualMatch[1]; // KORREKTUR: `match` war ein Tippfehler, es muss `manualMatch` sein.
                    const uniqueRefKey = `${book}-${chapter}-${refId}`; // Eindeutiger Schlüssel für manuelle Verweise
                    if (!manualCrossReferenceMap[uniqueRefKey]) {
                        manualCrossReferenceMap[uniqueRefKey] = [];
                    }
                    manualCrossReferenceMap[uniqueRefKey].push(id);
                }

                // --- Verarbeitung für automatische Querverweise (identische Verse) ---
                // KORREKTUR: Der Text für den Vergleich wird von den Markern bereinigt.
                // Der Originaltext für die Anzeige (`verseTextWithMarkers`) bleibt aber erhalten.
                const verseTextForComparison = verseTextWithMarkers.replace(crossRefRegex, '').trim();
                const normalizedText = verseTextForComparison.toLowerCase().replace(/[.,;!?"]/g, '').replace(/\s+/g, ' ').trim(); // KORREKTUR: Doppelte Deklaration entfernt.
                if (normalizedText) {
                    if (!identicalVerseMap[normalizedText]) {
                        identicalVerseMap[normalizedText] = [];
                    }
                    identicalVerseMap[normalizedText].push(id);
                }

                if (isNaN(id) || !book || isNaN(chapter) || isNaN(verse_num) || !verseTextWithMarkers) {
                    console.warn(`[Bibelquiz] Zeile übersprungen (ungültige Daten): "${line}"`);
                    return null;
                }

                 return {
                    id, book, chapter, verse_num, text: verseTextWithMarkers, // KORREKTUR: Speichere den Text MIT Markern
                    testament: NT_BOOKS.includes(book) ? "NT" : "AT"
                };
            }).filter(Boolean);

            console.log(`[Bibelquiz] Schritt 5: Analyse abgeschlossen. ${allVerses.length} gültige Verse geladen.`);
            if (allVerses.length > 0) {
                const maxVerseId = allVerses.length;
                totalVersesLabel.textContent = maxVerseId;
                positionInput.max = maxVerseId;
                positionSlider.max = maxVerseId;
    
                console.log('[Bibelquiz] Schritt 6: Ladevorgang erfolgreich abgeschlossen.');

                // NEU: Erstelle die Buch-Kapitel-Struktur für die Navigation
                const books = [...new Set(allVerses.map(v => v.book))];
                // NEU: Fülle die einmalige, kanonische Buchreihenfolge. Diese wird nie wieder verändert.
                canonicalBookOrder = [...new Set(allVerses.map(v => v.book))];

                bookChapterStructure = books.map(book => {
                    const chapters = [...new Set(allVerses.filter(v => v.book === book).map(v => v.chapter))].sort((a, b) => a - b);
                    return {
                        // NEU: Testament-Info hinzufügen
                        testament: allVerses.find(v => v.book === book).testament,
                        book: book,
                        chapters: chapters
                    };
                }).sort((a, b) => canonicalBookOrder.indexOf(a.book) - canonicalBookOrder.indexOf(b.book)); // Sortiere die Struktur selbst auch kanonisch.
                console.log('[Bibelquiz] Buch-Kapitel-Struktur für Kontextnavigation erstellt.');

                resolveVersesLoaded(true); // Signalisiere, dass das Laden erfolgreich war.

                // NEU: Fülle die dynamischen Buchgruppen
                BOOK_GROUPS.AT = bookChapterStructure.filter(b => b.testament === 'AT').map(b => b.book);
                BOOK_GROUPS.NT = bookChapterStructure.filter(b => b.testament === 'NT').map(b => b.book);
                BOOK_GROUPS.PROPHETS = [...BOOK_GROUPS.MAJOR_PROPHETS, ...BOOK_GROUPS.MINOR_PROPHETS];
                populateScopeBookList(); // Fülle die UI für die Bereichsauswahl

                // NEU: Berechne die Zeichenanzahl für Bücher und Kapitel für die Dichte-Sortierung
                allVerses.forEach(verse => {
                    const book = verse.book;
                    const chapterRef = `${book} ${verse.chapter}`;
                    const verseLength = verse.text.length;

                    bookCharCounts[book] = (bookCharCounts[book] || 0) + verseLength;
                    chapterCharCounts[chapterRef] = (chapterCharCounts[chapterRef] || 0) + verseLength;
                });

                return true; // Signalisiert Erfolg
            } else {
                console.error('[Bibelquiz] FEHLER: Obwohl die Datei geladen wurde, konnten keine gültigen Verse extrahiert werden.');
                verseTextDisplay.textContent = "Fehler: Keine Bibelverse konnten geladen werden.";
                resolveVersesLoaded(false);
                return false; // Signalisiert Fehlschlag
            }
        } catch (error) {
            console.error("[FATAL] Kritischer Fehler beim Laden oder Verarbeiten der 'verse.txt':", error);
            verseTextDisplay.textContent = `Fehler: ${error.message}. Prüfe die Konsole (F12).`;
            resolveVersesLoaded(false); // KORREKTUR: Promise auch im Fehlerfall auflösen
            return false;
        }
    }

    // NEU (Kapitel-Quiz): Funktion zum Laden und Verarbeiten der Kapitelüberschriften
    async function loadAndParseHeadings() {
        try {
            console.log('[Kapitel-Quiz] Lade "headings.txt".');
            const response = await fetch(`headings.txt?v=${Date.now()}`);
            if (!response.ok) {
                // Dies ist kein fataler Fehler, da der andere Spielmodus noch funktionieren kann.
                console.warn(`[Kapitel-Quiz] Datei 'headings.txt' nicht gefunden (Status: ${response.status}). Der "Kapitel erraten"-Modus ist nicht verfügbar.`);
                return false;
            }
            const text = await response.text();
            const lines = text.split(/\r?\n/);

            allHeadings = lines.map((line, index) => {
                if (!line.trim()) return null;
                // KORREKTUR: Trenne nur die ersten beiden Teile (Buch;Kapitel) vom Rest (Überschriften)
                const parts = line.split(';', 3);
                if (parts.length !== 3) {
                    console.warn(`[Kapitel-Quiz] Zeile übersprungen (zu wenige Teile): "${line}"`);
                    return null;
                }

                const book = parts[0].trim();
                const chapter = parseInt(parts[1], 10);
                // KORREKTUR: Verwende "||" als Trennzeichen für die Überschriften
                const headingsText = parts[2];
                const headings = headingsText.split('||').map(h => h.trim()).filter(Boolean);

                if (!book || isNaN(chapter) || headings.length === 0) {
                    console.warn(`[Kapitel-Quiz] Zeile übersprungen (ungültige Daten): "${line}"`);
                    return null;
                }
                return { id: `${book}-${chapter}`, book, chapter, headings };
            }).filter(Boolean);

            console.log(`[Kapitel-Quiz] ${allHeadings.length} gültige Kapitel-Überschriften geladen.`);
            return allHeadings.length > 0;
        } catch (error) {
            console.error("[Kapitel-Quiz] Fehler beim Laden der 'headings.txt':", error);
            return false;
        }
    }

    // NEU (Zusammenfassungs-Quiz): Funktion zum Laden und Verarbeiten der Zusammenfassungen
    async function loadAndParseSummaries() {
        try {
            console.log('[Zusammenfassungs-Quiz] Lade "zusammenfassungen1.txt".');
            const response = await fetch(`zusammenfassungen1.txt?v=${Date.now()}`);
            if (!response.ok) {
                console.warn(`[Zusammenfassungs-Quiz] Datei 'zusammenfassungen1.txt' nicht gefunden (Status: ${response.status}). Der "Zusammenfassung erraten"-Modus ist nicht verfügbar.`);
                return false;
            }
            const text = await response.text();
            const lines = text.split(/\r?\n/);

            allSummaries = lines.map(line => {
                if (!line.trim()) return null;
                const parts = line.split(';');
                if (parts.length < 4) {
                    console.warn(`[Zusammenfassungs-Quiz] Zeile übersprungen (falsches Format): "${line}"`);
                    return null;
                }

                const book = parts[1].trim();
                const chapter = parseInt(parts[2], 10);
                const summaryText = parts.slice(3).join(';').trim();

                if (!book || isNaN(chapter) || !summaryText) {
                    console.warn(`[Zusammenfassungs-Quiz] Zeile übersprungen (ungültige Daten): "${line}"`);
                    return null;
                }
                return { id: `${book}-${chapter}`, book, chapter, summary: summaryText };
            }).filter(Boolean);

            console.log(`[Zusammenfassungs-Quiz] ${allSummaries.length} gültige Kapitel-Zusammenfassungen geladen.`);
            return allSummaries.length > 0;
        } catch (error) {
            console.error("[Zusammenfassungs-Quiz] Fehler beim Laden der 'zusammenfassungen1.txt':", error);
            return false;
        }
    }

    // NEU (Multiple-Choice-Quiz): Funktion zum Laden und Verarbeiten der Fragen
    async function loadAndParseMcQuestions() {
        try {
            console.log('[MC-Quiz] Lade "bibel_quiz_fragen.json".');
            const response = await fetch(`bibel_quiz_fragen.json?v=${Date.now()}`);
            if (!response.ok) {
                console.warn(`[MC-Quiz] Datei 'bibel_quiz_fragen.json' nicht gefunden (Status: ${response.status}). Der "Multiple-Choice"-Modus ist nicht verfügbar.`);
                return false;
            }
            const data = await response.json();
            allMcQuestions = data;

            // Zähle die geladenen Fragen
            let questionCount = 0;
            for (const book in allMcQuestions) {
                for (const chapter in allMcQuestions[book]) {
                    if (Array.isArray(allMcQuestions[book][chapter])) {
                        questionCount += allMcQuestions[book][chapter].length;
                    }
                }
            }

            if (questionCount > 0) {
                console.log(`[MC-Quiz] ${questionCount} gültige Multiple-Choice-Fragen geladen.`);
                return true;
            } else {
                console.warn('[MC-Quiz] "bibel_quiz_fragen.json" wurde geladen, enthält aber keine Fragen im erwarteten Format.');
                return false;
            }

        } catch (error) {
            console.error("[MC-Quiz] Fehler beim Laden der 'bibel_quiz_fragen.json':", error);
            return false;
        }
    }

    // --- UI-Logik ---
    function setInitialSelection() {
        // Setze auf AT, 1. Mose
        document.querySelector('input[name="testament"][value="AT"]').checked = true;
        updateBookDropdown();

        // Wir stellen sicher, dass die Auswahl korrekt ist, falls der Event-Handler sie überschreibt.
        bookSelect.value = "1. Mose";
        updateChapterDropdown();

        chapterSelect.value = "1";
        updateVerseDropdown();

        verseSelect.value = "1";
        syncSelectionToPosition();
    }

    // --- Spiellogik ---
    function startNewRound() {
        // NEU: Wenn ein Seed aktiv ist, navigiere in der Queue
        if (currentSeedString) {
            // Im Seed-Modus wird die nächste Aufgabe über die Navigationsbuttons gesteuert.
            // Der "Nächste Runde"-Button springt einfach zum nächsten Element.
            displayTaskFromSeededQueue(seededQueueIndex + 1);
        }
        else {
            // Alte Logik für den zufälligen Modus ohne Seed
            if (quizMode === 'guessVerse') {
                displayNewVerse();
            } else if (quizMode === 'guessChapter') {
                displayNewChapterHeadings();
            } else if (quizMode === 'guessSummary') {
                displayNewSummary();
            } else if (quizMode === 'multipleChoice') {
                displayNewMcQuestion();
            }
        }
    }

    // NEU: Funktion zum Filtern des Datenpools basierend auf dem customScope
    function filterPoolByScope(pool) {
        if (!customScope.active || customScope.books.length === 0) {
            return pool; // Kein Filter aktiv, gib den gesamten Pool zurück
        }

        const filtered = pool.filter(item => {
            const bookIsSelected = customScope.books.includes(item.book);
            if (!bookIsSelected) return false;

            const chapterSelection = customScope.chapters[item.book];
            return !chapterSelection || chapterSelection.length === 0 || chapterSelection.includes(item.chapter);
        });

        return filtered;
    }

    // NEU: Funktion zum Anzeigen einer Aufgabe aus der Seed-Queue
    function displayTaskFromSeededQueue(index) {
        if (index < 0 || index >= seededQueue.length) {
            console.warn(`[Seed-Modus] Ungültiger Index ${index} für die Aufgaben-Queue.`);
            return;
        }
        // KORREKTUR: Stelle sicher, dass der Index im gültigen Bereich bleibt
        if (index >= seededQueue.length) {
            index = 0; // Am Ende angekommen, fange von vorne an
        } else if (index < 0) {
            index = seededQueue.length - 1; // Vom Anfang zurück, gehe zum Ende
        }
        seededQueueIndex = index;
        const task = seededQueue[index];
    
        // Setze den internen Zustand basierend auf dem Aufgabentyp
        currentVerse = quizMode === 'guessVerse' ? task : null;
        currentChapterHeadings = quizMode === 'guessChapter' ? task : null;
        currentSummary = quizMode === 'guessSummary' ? task : null;
        currentMcQuestion = quizMode === 'multipleChoice' ? task : null;
    
        // Rufe die entsprechende Anzeigefunktion auf
        if (quizMode === 'guessVerse') displayVerseContent(task);
        if (quizMode === 'guessChapter') displayChapterHeadingsContent(task);
        if (quizMode === 'guessSummary') displaySummaryContent(task);
        if (quizMode === 'multipleChoice') displayMcQuestionContent(task);
    
        // Aktualisiere die Navigations-UI
        seededCounter.textContent = `Aufgabe ${index + 1} von ${seededQueue.length}`;
        prevTaskButton.disabled = index === 0;
        nextTaskButton.disabled = index >= seededQueue.length - 1;
        // NEU: Aufgaben-Slider aktualisieren
        taskSlider.max = seededQueue.length;
        taskSlider.value = index + 1;
        taskSliderOutput.textContent = `${index + 1} / ${seededQueue.length}`;
    }

    // NEU (Zusammenfassungs-Quiz): Funktion zum Anzeigen einer neuen Zusammenfassung
    function displayNewSummary() {
        let summaryPool = filterPoolByScope(allSummaries);

        if (summaryPool.length === 0) {
            if (customScope.active) {
                verseTextDisplay.textContent = `Für den ausgewählten Bereich wurden keine Zusammenfassungen gefunden. Bitte passe deine Auswahl an.`;
            } else {
                verseTextDisplay.textContent = 'Keine Zusammenfassungen geladen. Bitte erstelle eine "zusammenfassungen1.txt".';
            }
            return;
        }

        const summary = summaryPool[Math.floor(randomGenerator() * summaryPool.length)];
        displaySummaryContent(summary);
    }

    function displaySummaryContent(summary) {
        currentSummary = summary;
        verseTextDisplay.innerHTML = `<h3>Welches Kapitel wird hier zusammengefasst?</h3><p>${summary.summary}</p>`;
        resetFeedbackAndControls();
    }

    function displayNewChapterHeadings() {
        let chapterPool = filterPoolByScope(allHeadings);

        if (chapterPool.length === 0) {
            if (customScope.active) {
                verseTextDisplay.textContent = `Für den ausgewählten Bereich wurden keine Überschriften gefunden. Bitte passe deine Auswahl an.`;
            } else {
                verseTextDisplay.textContent = 'Keine Kapitel-Überschriften geladen. Bitte erstelle eine "headings.txt".';
            }
            return;
        }

        // Wähle ein zufälliges Kapitel aus dem (gefilterten) Pool
        const chapter = chapterPool[Math.floor(randomGenerator() * chapterPool.length)];
        displayChapterHeadingsContent(chapter);
    }

    function displayChapterHeadingsContent(chapter) {
        currentChapterHeadings = chapter;
        // Formatiere die Überschriften als Liste
        let headingsHtml = "<h3>Welches Kapitel hat diese Überschriften?</h3><ul>";
        chapter.headings.forEach(h => { headingsHtml += `<li>${h}</li>`; });
        headingsHtml += "</ul>";
        verseTextDisplay.innerHTML = headingsHtml;
        resetFeedbackAndControls();
    }

    // NEU (Multiple-Choice-Quiz): Funktion zum Anzeigen einer neuen Frage
    function displayNewMcQuestion() {
        // KORREKTUR: Die Logik zum Erstellen der Fragen-Warteschlange wird jetzt zentralisiert
        // und bei jedem Aufruf ausgeführt, um sicherzustellen, dass der Scope immer korrekt ist.
        const orderMode = document.querySelector('input[name="mc-order"]:checked').value;
        
        // --- Schritt 1: Baue die Fragenliste basierend auf dem Scope neu auf ---
        mcQuestionQueue = [];
        const allBooksWithQuestions = Object.keys(allMcQuestions);
        
        // Filtere zuerst die Bücher
        const booksInScope = customScope.active && customScope.books.length > 0
            ? allBooksWithQuestions.filter(book => customScope.books.includes(book))
            : allBooksWithQuestions;

        // Iteriere durch die gefilterten Bücher
        for (const book of booksInScope) {
            const allChaptersForBook = Object.keys(allMcQuestions[book] || {}).map(Number);
            
            // Filtere dann die Kapitel für jedes Buch
            const chaptersInScope = customScope.active && customScope.chapters[book]?.length > 0
                ? allChaptersForBook.filter(ch => customScope.chapters[book].includes(ch))
                : allChaptersForBook;

            // Sammle die Fragen aus den gefilterten Kapiteln
            for (const chapter of chaptersInScope) {
                if (allMcQuestions[book]?.[chapter]) {
                    allMcQuestions[book][chapter].forEach(q => {
                        mcQuestionQueue.push({ ...q, book, chapter: parseInt(chapter, 10) });
                    });
                }
            }
        }

        // --- Schritt 2: Sortiere die Liste, falls der Modus "Der Reihe nach" ist ---
        if (orderMode === 'sequential') {
            const canonicalBookOrder = bookChapterStructure.map(b => b.book);
            mcQuestionQueue.sort((a, b) => {
                const bookIndexA = canonicalBookOrder.indexOf(a.book);
                const bookIndexB = canonicalBookOrder.indexOf(b.book);
                if (bookIndexA !== bookIndexB) return (bookIndexA === -1 ? Infinity : bookIndexA) - (bookIndexB === -1 ? Infinity : bookIndexB);
                if (a.chapter !== b.chapter) return a.chapter - b.chapter;
                // Hier könnte eine Sortierung nach Frage-ID erfolgen, falls vorhanden
                return 0;
            });
        }

        // --- Schritt 3: Zeige die Frage an ---
        if (mcQuestionQueue.length === 0) {
            diagnoseMcQuestionIssue(allBooksWithQuestions, booksInScope);
            mcOptionsContainer.innerHTML = '';
            return;
        }

        if (orderMode === 'random') {
            const question = mcQuestionQueue[Math.floor(randomGenerator() * mcQuestionQueue.length)];
            displayMcQuestionContent(question);
        } else { // Sequential Mode
            // Wenn der Index zurückgesetzt werden muss (z.B. nach Scope-Änderung)
            if (mcCurrentIndex >= mcQuestionQueue.length) {
                mcCurrentIndex = 0;
            }

            if (mcCurrentIndex >= mcQuestionQueue.length) {
                verseTextDisplay.innerHTML = `<h3>Runde beendet!</h3><p>Alle ${mcQuestionQueue.length} Fragen aus dem ausgewählten Bereich wurden beantwortet. Klicke auf "Nächste Runde", um erneut zu beginnen.</p>`;
                mcOptionsContainer.innerHTML = '';
                guessButton.disabled = true;
                return;
            }
            const question = mcQuestionQueue[mcCurrentIndex];
            displayMcQuestionContent(question);
            mcCurrentIndex++;
        }
        console.log("[MC-Debug] displayNewMcQuestion - mcQuestionQueue Länge nach Aufbau:", mcQuestionQueue.length, "orderMode:", orderMode, "currentSeedString:", currentSeedString);
        // NEU: Aufgaben-Slider für den sequenziellen MC-Modus ohne Seed
        if (orderMode === 'sequential' && !currentSeedString && mcQuestionQueue.length > 0) {
            taskSlider.max = mcQuestionQueue.length;
            taskSlider.value = mcCurrentIndex; // mcCurrentIndex ist bereits um 1 erhöht
        } 

        // NEU: Diagnose-Funktion, um zu analysieren, warum keine Fragen gefunden wurden.
        function diagnoseMcQuestionIssue(allBooksFromJson, booksInCurrentScope) {
            console.warn("[MC-Diagnose] Keine Fragen für die Warteschlange gefunden. Starte Analyse...");
            let diagnosis = "Keine Multiple-Choice-Fragen für den ausgewählten Bereich gefunden.";

            if (Object.keys(allMcQuestions).length === 0) {
                diagnosis += "\n\nGrund: Die Fragendatei 'bibel_quiz_fragen.json' ist entweder leer oder konnte nicht korrekt geladen werden. Bitte prüfe die Browser-Konsole (F12) auf Ladefehler.";
                console.error("[MC-Diagnose] Fehler: `allMcQuestions` ist ein leeres Objekt.");
            } else if (customScope.active && customScope.books.length > 0 && booksInCurrentScope.length === 0) {
                diagnosis += `\n\nGrund: Der aktive Bereich enthält Bücher, für die in der Fragendatei keine Fragen existieren.`;
                diagnosis += `\n- Bücher im Bereich: [${customScope.books.join(', ')}]`;
                diagnosis += `\n- Bücher mit Fragen: [${allBooksFromJson.join(', ')}]`;
                console.warn("[MC-Diagnose] Der Schnitt zwischen den Büchern im Scope und den Büchern in der JSON ist leer.", {
                    scopeBooks: customScope.books,
                    jsonBooks: allBooksFromJson
                });
            } else if (customScope.active) {
                diagnosis += `\n\nGrund: Obwohl Bücher im Bereich ausgewählt sind, wurden für die spezifisch ausgewählten Kapitel keine Fragen gefunden.`;
                diagnosis += `\n- Bücher im Bereich: [${booksInCurrentScope.join(', ')}]`;
                diagnosis += `\n- Ausgewählte Kapitel: ${JSON.stringify(customScope.chapters, null, 2)}`;
                console.warn("[MC-Diagnose] Keine Fragen für die ausgewählten Kapitel gefunden. Überprüfe die Kapitel-Auswahl im Scope.", {
                    scope: customScope
                });
            } else {
                diagnosis += "\n\nGrund: Ein unerwarteter Fehler ist aufgetreten. Die Fragendatei scheint geladen, aber die Verarbeitung schlug fehl. Bitte prüfe die Konsolen-Logs.";
                console.error("[MC-Diagnose] Unerwarteter Zustand. `mcQuestionQueue` ist leer, obwohl es Fragen geben sollte.");
            }

            verseTextDisplay.innerHTML = `<div style="text-align: left; white-space: pre-wrap;">${diagnosis}</div>`;
        }
    }

    function displayMcQuestionContent(question) {
        currentMcQuestion = question;
        currentVerse = null;
        currentChapterHeadings = null;
        currentSummary = null;

        // NEU: Detaillierte Zähler berechnen und anzeigen
        const isSequential = document.querySelector('input[name="mc-order"]:checked').value === 'sequential';

        console.log("[MC-Debug] displayMcQuestionContent - isSequential:", isSequential, "currentSeedString:", currentSeedString, "mcQuestionQueue.length:", mcQuestionQueue.length, "seededQueue.length:", seededQueue.length);

        // KORREKTUR: Die Zähler sollen angezeigt werden, wenn die Reihenfolge deterministisch ist.
        // Das ist der Fall, wenn ein Seed aktiv ist ODER wenn der Modus "sequenziell" ohne Seed ist.
        if (currentSeedString || (isSequential && mcQuestionQueue.length > 0)) {
            const queue = currentSeedString ? seededQueue : mcQuestionQueue;
            const currentIndex = currentSeedString ? seededQueueIndex : (mcCurrentIndex > 0 ? mcCurrentIndex - 1 : 0);

            const totalInScope = queue.length;
            const testamentQueue = queue.filter(q => bookChapterStructure.find(b => b.book === q.book)?.testament === bookChapterStructure.find(b => b.book === currentMcQuestion.book)?.testament);
            const bookQueue = queue.filter(q => q.book === currentMcQuestion.book);
            const chapterQueue = bookQueue.filter(q => q.chapter === currentMcQuestion.chapter);

            const currentIndexInTestament = testamentQueue.findIndex(q => q.frage === currentMcQuestion.frage) + 1 || 1;
            const currentIndexInBook = bookQueue.findIndex(q => q.frage === currentMcQuestion.frage) + 1 || 1;
            const currentIndexInChapter = chapterQueue.findIndex(q => q.frage === currentMcQuestion.frage) + 1 || 1;
            console.log("[MC-Debug] displayMcQuestionContent - Zähler werden angezeigt.");
            
            // KORREKTUR: Aktualisiere den Haupt-Aufgabenzähler in der Navigationsleiste.
            seededCounter.textContent = `Aufgabe ${currentIndex + 1} von ${totalInScope}`;

            // KORREKTUR: Detailliertere Labels und visuelle Kreise hinzufügen
            const testamentName = bookChapterStructure.find(b => b.book === currentMcQuestion.book)?.testament || '';
            const bookName = currentMcQuestion.book;
            const chapterNum = currentMcQuestion.chapter;
 
            const progressTotal = (currentIndex + 1) / totalInScope;
            const progressTestament = currentIndexInTestament / testamentQueue.length;
            const progressBook = currentIndexInBook / bookQueue.length;
            const progressChapter = currentIndexInChapter / chapterQueue.length;
 
            let countersHtml = `
                <div class="mc-counter-item"><div class="progress-circle" style="--progress-angle: ${progressTotal * 360}deg"></div><span>Gesamt: <strong>${currentIndex + 1}/${totalInScope}</strong></span></div>
                <div class="mc-counter-item"><div class="progress-circle" style="--progress-angle: ${progressTestament * 360}deg"></div><span>${testamentName}: <strong>${currentIndexInTestament}/${testamentQueue.length}</strong></span></div>
                <div class="mc-counter-item"><div class="progress-circle" style="--progress-angle: ${progressBook * 360}deg"></div><span>${bookName}: <strong>${currentIndexInBook}/${bookQueue.length}</strong></span></div>
                <div class="mc-counter-item"><div class="progress-circle" style="--progress-angle: ${progressChapter * 360}deg"></div><span>Kapitel ${chapterNum}: <strong>${currentIndexInChapter}/${chapterQueue.length}</strong></span></div>
            `;
            mcQuestionCounters.innerHTML = countersHtml;
            mcQuestionCounters.style.display = 'flex';
        } else {
            console.log("[MC-Debug] displayMcQuestionContent - Zähler NICHT angezeigt.");
            mcQuestionCounters.style.display = 'none';
        }

        if (!currentMcQuestion) {
            verseTextDisplay.innerHTML = "Fehler: Keine Frage zum Anzeigen vorhanden.";
            return;
        }
        let questionHtml = `<h3>${currentMcQuestion.frage} <span class="mc-ref">(${currentMcQuestion.book} ${currentMcQuestion.chapter})</span></h3>`;
        if (currentMcQuestion.einleitung) {
            questionHtml = `<p><em>${currentMcQuestion.einleitung}</em></p>${questionHtml}`;
        }
        verseTextDisplay.innerHTML = questionHtml;

        // Mische die Antwortoptionen für jede Frage neu
        const options = [...currentMcQuestion.optionen];
        const correctOptionText = options[currentMcQuestion.korrekte_antwort_index];
        // Fisher-Yates Shuffle
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(randomGenerator() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        // Finde den neuen Index der korrekten Antwort
        const newCorrectIndex = options.findIndex(opt => opt === correctOptionText);

        mcOptionsContainer.innerHTML = '';
        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'mc-option-button';
            button.textContent = option;
            // Speichere, ob diese Option die richtige ist
            button.dataset.correct = (index === newCorrectIndex);
            mcOptionsContainer.appendChild(button);
        });

        resetFeedbackAndControls();
    }

    function displayNewVerse() {
        let versePool = filterPoolByScope(allVerses);

        if (versePool.length === 0) {
            verseTextDisplay.textContent = "Keine Verse im ausgewählten Bereich gefunden.";
            return;
        }

        // Wähle einen zufälligen Vers aus dem (gefilterten) Pool
        const verse = versePool[Math.floor(randomGenerator() * versePool.length)];
        displayVerseContent(verse);
    }

    function displayVerseContent(verse) {
        currentVerse = verse;
        let interactiveText = verse.text;
        // KORREKTUR: Der Text für den Vergleich wird hier erneut bereinigt.
        const verseTextForComparison = verse.text.replace(/\[__\d+__\]/g, '').trim();

        // NEU: Füge Links für automatisch gefundene identische Verse hinzu
        const normalizedText = verseTextForComparison.toLowerCase().replace(/[.,;!?"]/g, '').replace(/\s+/g, ' ').trim();
        const identicalVerses = identicalVerseMap[normalizedText] || [];
        if (normalizedText && identicalVerses.length > 1) {
            // Füge den Link für identische Verse hinzu
            interactiveText += ` <a href="#" class="identical-verse-link" data-text-key="${normalizedText}" title="Zeige identische Verse">[§]</a>`;
        }

        // NEU: Verwandle manuelle Querverweis-Marker in klickbare Links
        const manualCrossRefRegex = /\[__(\d+)__\]/g;
        interactiveText = interactiveText.replace(
            manualCrossRefRegex,
            (match, refId) => {
                const uniqueRefKey = `${verse.book}-${verse.chapter}-${refId}`;
                return `<a href="#" class="manual-cross-ref-link" data-ref-id="${uniqueRefKey}" title="Querverweise anzeigen">[§${refId}]</a>`;
            });

        currentChapterHeadings = null; // Sicherstellen, dass der alte Zustand gelöscht ist
        currentSummary = null;
        verseTextDisplay.innerHTML = interactiveText;
        resetFeedbackAndControls();
    }

    function resetFeedbackAndControls() {
        feedbackMessage.textContent = "";
        feedbackMessage.className = "";
        statsDisplay.textContent = "Mache einen Tipp, um die Entfernung zu sehen.";
        guessButton.disabled = false;
        clearCanvas();
        contextView.style.display = 'none';
        // setInitialSelection(); // KORREKTUR: Dieser Aufruf hat den Fehler verursacht und wird entfernt.
    }

    // NEU: Funktion für den Lese-Modus
    function displayReadingChapter(book, chapter, options = {}) {
        // NEU: Berücksichtige den Scope für die Anzeige
        const availableBooks = customScope.active ? bookChapterStructure.filter(b => customScope.books.includes(b.book)) : bookChapterStructure;
        if (availableBooks.length === 0) {
            // KORREKTUR: UI-Elemente für die Auswahl leeren/zurücksetzen
            populateSelect(bookSelect, [], "Buch");
            populateSelect(chapterSelect, [], "Kapitel");
            populateSelect(verseSelect, [], "Vers");
            verseTextDisplay.innerHTML = `<h2>Keine Kapitel im ausgewählten Bereich</h2>`;
            return;
        }

        const { highlightTerm = null, usePartialSearch = false } = options;

        if (!book || !chapter) {
            const firstBook = availableBooks[0] || bookChapterStructure[0];
            book = firstBook.book;
            chapter = firstBook.chapters[0];
        }

        // Stelle sicher, dass das angeforderte Kapitel im Scope liegt
        if (customScope.active && (!customScope.books.includes(book) || (customScope.chapters[book]?.length > 0 && !customScope.chapters[book].includes(parseInt(chapter, 10))))) {
             return; // Breche ab, wenn das Kapitel nicht im Scope ist
        }
        currentContext = { book, chapter: parseInt(chapter, 10) };

        const summaryPosition = document.querySelector('input[name="summary-pos"]:checked').value;
        const chapterVerses = allVerses.filter(v => v.book === book && v.chapter === parseInt(chapter, 10)).sort((a, b) => a.verse_num - b.verse_num);
        
        let chapterHtml = '';
        let summaryHtml = ''; 

        // Füge Zusammenfassung hinzu, wenn gewünscht
        if (showSummariesCheckbox.checked) {
            const summary = allSummaries.find(s => s.book === book && s.chapter === parseInt(chapter, 10)); 
            if (summary) {
                summaryHtml = `<p class="chapter-summary"><em>${summary.summary}</em></p>`;
            }
        }

        let verseHtml = `<h2>${book} ${chapter}</h2>`;
        
        let highlightRegex = null; // Initialisiere mit null
        if (highlightTerm && highlightTerm.length > 0) {
            // Stelle sicher, dass highlightTerm immer ein Array ist, um es konsistent zu verarbeiten
            let termsToHighlight = [];
            if (Array.isArray(highlightTerm)) {
                termsToHighlight = highlightTerm;
            } else if (typeof highlightTerm === 'string') { // KORREKTUR: Robuste String-Zerlegung
                if (highlightTerm.includes('++')) {
                    termsToHighlight = highlightTerm.split('++').map(t => t.trim()).filter(Boolean);
                } else if (highlightTerm.includes('+')) {
                    termsToHighlight = highlightTerm.split('+').map(t => t.trim()).filter(Boolean);
                } else {
                    // Fallback für falsch formatierte Strings (z.B. "a,il" aus altem Bug)
                    termsToHighlight = highlightTerm.split(',').map(t => t.trim()).filter(Boolean);
                }
            }
            // KORREKTUR: Erstelle ein Muster, das alle Suchbegriffe findet.
            const highlightPattern = termsToHighlight.map(term => {
                const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                return usePartialSearch ? escaped : `\\b${escaped}\\b`;
            }).join('|'); // Verbinde mehrere Begriffe mit ODER

            if (highlightPattern) {
                highlightRegex = new RegExp(highlightPattern, 'gi');
            }
        }

        chapterVerses.forEach(verse => {
            let verseText = verse.text;
            if (highlightRegex) {
                verseText = verseText.replace(highlightRegex, '<span class="highlight">$1</span>');
            }

            // KORREKTUR: Der Text für den Vergleich wird hier erneut bereinigt.
            const verseTextForComparison = verse.text.replace(/\[__\d+__\]/g, '').trim();

            // NEU: Füge Links für automatisch gefundene identische Verse hinzu
            const normalizedText = verseTextForComparison.toLowerCase().replace(/[.,;!?"]/g, '').replace(/\s+/g, ' ').trim();
            const identicalVerses = identicalVerseMap[normalizedText] || [];
            if (normalizedText && identicalVerses.length > 1) {
                verseText += ` <a href="#" class="identical-verse-link" data-text-key="${normalizedText}" title="Zeige identische Verse">[§]</a>`;
            }

            // NEU: Auch im Lesemodus die manuellen Querverweise interaktiv machen
            const manualCrossRefRegex = /\[__(\d+)__\]/g;
            verseText = verseText.replace(
                manualCrossRefRegex,
                (match, refId) => {
                    const uniqueRefKey = `${verse.book}-${verse.chapter}-${refId}`;
                    return `<a href="#" class="manual-cross-ref-link" data-ref-id="${uniqueRefKey}" title="Querverweise anzeigen">[§${refId}]</a>`;
                });

            verseHtml += `<p data-verse-num="${verse.verse_num}"><sup>${verse.verse_num}</sup> ${verseText}</p>`;
        });

        if (summaryPosition === 'above') {
            chapterHtml = `<div id="reading-content-wrapper" class="reading-wrapper above-summary">${summaryHtml}${verseHtml}</div>`;
        } else if (summaryPosition === 'left') {
            chapterHtml = `<div id="reading-content-wrapper" class="reading-wrapper left-summary">${summaryHtml}<div class="chapter-text">${verseHtml}</div></div>`;
        } else { // right
            chapterHtml = `<div id="reading-content-wrapper" class="reading-wrapper right-summary">${summaryHtml}<div class="chapter-text">${verseHtml}</div></div>`;
        }

        verseTextDisplay.innerHTML = chapterHtml;

        updateContextNavButtons(); // Aktualisiert die Navigations-Buttons

        // KORREKTUR: Synchronisiere die Dropdowns und Slider für den Lesemodus
        bookSelect.value = book;
        updateChapterDropdown();
        chapterSelect.value = chapter;
        updateVerseDropdown();
        syncSelectionToPosition(true); // `true` für Lesemodus-Verhalten
    }

    // NEU: Funktion zur Durchführung der Suche
    function performSearch(options = {}) {
        const { isPagination = false } = options;
        if (!isPagination) {
            searchResultOffset = 0; // Setze Offset bei jeder *neuen* Suche zurück
        }

        const searchInputText = searchInput.value.trim();
        const usePartialSearch = partialWordSearchCheckbox.checked;
        let searchTerms = [];
        let searchMode = 'OR'; // Standard ist ODER

        // NEU: Unterscheide zwischen UND (++) und ODER (+) Suche
        if (searchInputText.includes('++')) {
            searchTerms = searchInputText.split('++').map(t => t.trim()).filter(Boolean);
            searchMode = 'AND';
        } else {
            searchTerms = searchInputText.split('+').map(t => t.trim()).filter(Boolean);
            searchMode = 'OR';
        }

        if (searchTerms.length === 0) {
            alert("Bitte gib mindestens einen Suchbegriff ein.");
            return;
        }

        // KORREKTUR: Im Lesemodus immer ein Zeichen für die Suche erlauben,
        // unabhängig von der Teilwortsuche-Einstellung.
        const minLength = (quizMode === 'readMode') ? 1 : (usePartialSearch ? 1 : 2);

        if (searchTerms.some(term => term.length < minLength)) {
            alert(`Jeder Suchbegriff muss mindestens ${minLength} Zeichen lang sein.`);
            return;
        }

        const searchPool = filterPoolByScope(allVerses);

        const regexes = searchTerms.map(term => {
            const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return usePartialSearch ? new RegExp(escapedTerm, 'i') : new RegExp(`\\b${escapedTerm}\\b`, 'i');
        });

        let results;
        if (searchMode === 'AND') {
            // Finde alle Verse, die JEDE der Regexes erfüllen
            results = searchPool.filter(verse => 
                regexes.every(regex => regex.test(verse.text))
            );
        } else { // OR-Modus
            // Finde alle Verse, die MINDESTENS EINE der Regexes erfüllen
            results = searchPool.filter(verse => 
                regexes.some(regex => regex.test(verse.text))
            );
        }

        displaySearchResults(results, searchTerms, usePartialSearch, { searchMode, verseListOffset: searchResultOffset });
    }

    // NEU: Funktion zur Anzeige der Suchergebnisse
    function displaySearchResults(results, searchTerm, usePartialSearch, options = {}) {
        const { bookFilter = null, searchMode = 'OR', verseListOffset = 0 } = options;
        const WORKER_THRESHOLD = 5000; // Schwellenwert für die Nutzung des Web Workers

        // --- 1. Rangliste erstellen ---
        const bookCounts = {};
        const chapterCounts = {};
        const verseCounts = {}; // NEU: Zähler für Verse
        // NEU: Detaillierte Zähler für UND-Suche
        const bookDetailCounts = {};
        const chapterDetailCounts = {};
        const verseDetailCounts = {};

        // Setze die Zähler für die sichtbaren Elemente bei jeder neuen Suche zurück
        searchRankVisibleCounts = { book: 10, chapter: 10, verse: 10 };

        // KORREKTUR: Erstelle eine globale Regex für jeden Suchbegriff, um alle Vorkommen zu zählen
        
        // --- 2. Detaillierte Vers-Liste erstellen (wird für beide Pfade benötigt) ---
        let verseListHtml = '';
        const filteredResults = bookFilter ? results.filter(r => r.book === bookFilter) : results;

        // --- 3. Ranglisten-HTML und Vers-Listen-HTML generieren ---
        let rankHtml = '';

        const operator = searchMode === 'AND' ? ' ++ ' : ' + ';
        const searchTermStringForLinks = Array.isArray(searchTerm) ? searchTerm.join(operator) : searchTerm;

        const renderResults = (sortedBooks, sortedChapters, sortedVerses, finalResults) => {
             if (showSearchStatsCheckbox.checked && !bookFilter) {
                 // Tab-Buttons
                 rankHtml += `
                     <div class="search-stats-tabs">
                         <button class="tab-button active" data-table="book-rank-table">Bücher (${sortedBooks.length})</button>
                         <button class="tab-button" data-table="chapter-rank-table">Kapitel (${sortedChapters.length})</button>
                         <button class="tab-button" data-table="verse-rank-table">Verse (${sortedVerses.length})</button>
                     </div>
                 `;
 
                 // Helferfunktion zum Erstellen einer sortierbaren Tabelle
                 const createRankTable = (id, headers, data, type) => {
                     let tableHtml = `<table id="${id}" class="search-rank-table ${type === 'book' ? '' : 'hidden'}"><thead><tr>`;
                     headers.forEach(header => {
                         tableHtml += `<th data-sort-key="${header.key}" data-sort-type="${header.type}">${header.label}</th>`;
                     });
                     tableHtml += '</tr></thead><tbody>';
 
                     data.slice(0, 66).forEach((item, index) => {
                         const [key, count] = item;
                         let book, chapter, verseNum = 1;
                         let linkText = key;
 
                         if (type === 'book') {
                             book = key;
                             const bookInfo = bookChapterStructure.find(b => b.book === book);
                             chapter = bookInfo ? bookInfo.chapters[0] : 1;
                         } else if (type === 'chapter') {
                             const match = key.match(/^(.+?)\s(\d+)$/);
                             if (match) [_, book, chapter] = match;
                         } else if (type === 'verse') {
                             const match = key.match(/^(.+?)\s(\d+),(\d+)$/);
                             if (match) [_, book, chapter, verseNum] = match;
                         }
 
                         tableHtml += `
                             <tr>
                                 <td>${index + 1}</td>
                                 <td><a href="#" class="search-rank-link" data-book="${book}" data-chapter="${chapter}" data-verse="${verseNum}">${linkText}</a></td>
                                 <td>${count}</td>
                             </tr>
                         `;
                     });
 
                     tableHtml += '</tbody></table>';
                     return tableHtml;
                 };
 
                 // Tabelleninhalte erstellen
                 const bookTableHeaders = [
                     { label: 'Rang', key: 'rank', type: 'number' },
                     { label: 'Buch', key: 'name', type: 'string' },
                     { label: 'Treffer', key: 'count', type: 'number' }
                 ];
                 const chapterTableHeaders = [
                     { label: 'Rang', key: 'rank', type: 'number' },
                     { label: 'Kapitel', key: 'name', type: 'string' },
                     { label: 'Treffer', key: 'count', type: 'number' }
                 ];
                 const verseTableHeaders = [
                     { label: 'Rang', key: 'rank', type: 'number' },
                     { label: 'Vers', key: 'name', type: 'string' },
                     { label: 'Treffer', key: 'count', type: 'number' }
                 ];
 
                 rankHtml += createRankTable('book-rank-table', bookTableHeaders, sortedBooks, 'book');
                 rankHtml += createRankTable('chapter-rank-table', chapterTableHeaders, sortedChapters, 'chapter');
                 rankHtml += createRankTable('verse-rank-table', verseTableHeaders, sortedVerses, 'verse');
             }
 
            const operator = searchMode === 'AND' ? ' ++ ' : ' + ';
            const searchTermString = Array.isArray(searchTerm) ? searchTerm.join(operator) : searchTerm;
            const headerText = bookFilter ? `Alle ${finalResults.length} Vorkommen von "${searchTermString}" im Buch ${bookFilter}` : `Suchergebnisse für "${searchTermString}" (${finalResults.length} Treffer in Versen)`;
            verseListHtml += `<h3>${headerText}</h3>`;

             if (filteredResults.length === 0) {
                 verseListHtml += "<p>Keine Treffer gefunden.</p>";
             } else {
                 const RESULTS_PAGE_SIZE = 66;
 
                 const getVerseListPaginationHtml = (offset, total) => `
                     <div class="verse-list-pagination">
                         <button class="button" data-verse-page-offset="${Math.max(0, offset - RESULTS_PAGE_SIZE)}" ${offset === 0 ? 'disabled' : ''}>&laquo;</button>
                         <span>Seite ${Math.floor(offset / RESULTS_PAGE_SIZE) + 1} von ${Math.ceil(total / RESULTS_PAGE_SIZE)}</span>
                         <button class="button" data-verse-page-offset="${offset + RESULTS_PAGE_SIZE}" ${offset + RESULTS_PAGE_SIZE >= total ? 'disabled' : ''}>&raquo;</button>
                     </div>`;
                 
                 const termsToHighlight = Array.isArray(searchTerm) ? searchTerm : [searchTerm];
                 const highlightPattern = termsToHighlight.map(term => {
                     const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                     return usePartialSearch ? escaped : `\\b${escaped}\\b`;
                 }).join('|');
                 const highlightRegex = new RegExp(`(${highlightPattern})`, 'gi');
                 
                 verseListHtml += getVerseListPaginationHtml(verseListOffset, finalResults.length);
 
                 finalResults.slice(verseListOffset, verseListOffset + RESULTS_PAGE_SIZE).forEach(verse => {
                     const highlightedText = verse.text.replace(highlightRegex, '<span class="highlight">$1</span>');
                     verseListHtml += `
                         <div class="search-result-item" data-book="${verse.book}" data-chapter="${verse.chapter}" data-verse="${verse.verse_num}">
                             <a href="#" class="search-result-ref">${verse.book} ${verse.chapter},${verse.verse_num}</a>
                             <div class="search-result-preview">${highlightedText}</div>
                         </div>
                     `;
                 });
 
                 verseListHtml += getVerseListPaginationHtml(verseListOffset, finalResults.length);
             }

            verseTextDisplay.innerHTML = rankHtml + verseListHtml;

            // UI-Anpassungen für die Suchergebnisansicht
            readingNavTop.style.display = 'none';
            readingNavBottom.style.display = 'none';
            clearSearchButton.style.display = 'inline-block';

        };

        // --- 4. Entscheiden, ob der Worker genutzt wird ---
        if (results.length > WORKER_THRESHOLD && typeof(Worker) !== "undefined" && !bookFilter) {
            // Pfad 1: Web Worker für große Datenmengen nutzen
            const operator = searchMode === 'AND' ? ' ++ ' : ' + ';
            const searchTermString = Array.isArray(searchTerm) ? searchTerm.join(operator) : searchTerm;
            verseTextDisplay.innerHTML = `<h3>Suche nach "${searchTermString}"...</h3><p>Berechne Ranglisten für ${results.length} Treffer. Dies kann einen Moment dauern...</p>`;

            const worker = new Worker('search-worker.js');

            worker.onmessage = function(e) {
                const { sortedBooks, sortedChapters, sortedVerses, sortedResults, detailCounts } = e.data;
                // NEU: Übernehme die Detail-Counts vom Worker
                if (detailCounts) {
                    Object.assign(bookDetailCounts, detailCounts.book);
                    Object.assign(chapterDetailCounts, detailCounts.chapter);
                    Object.assign(verseDetailCounts, detailCounts.verse);
                }
                renderResults(sortedBooks, sortedChapters, sortedVerses, sortedResults); // Rufe renderResults auf, nachdem die Detail-Counts gesetzt sind
                worker.terminate(); // Worker nach getaner Arbeit beenden
            };

            worker.onerror = function(e) {
                console.error(`[Web Worker] Fehler: ${e.message}`);
                verseTextDisplay.innerHTML = `<p>Ein Fehler ist im Hintergrund-Prozess aufgetreten. Die Ergebnisse konnten nicht berechnet werden.</p>`;
                worker.terminate();
            };

            // Daten an den Worker senden
            worker.postMessage({ results, searchTerm, usePartialSearch, searchMode, bookChapterStructure });

        } else {
            // Pfad 2: Berechnung im Hauptthread für kleinere Datenmengen
            const regexes = Array.isArray(searchTerm) ? searchTerm.map(term => {
                const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                return usePartialSearch ? new RegExp(escapedTerm, 'gi') : new RegExp(`\\b${escapedTerm}\\b`, 'gi');
            }) : [usePartialSearch ? new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi') : new RegExp(`\\b${searchTerm}\\b`, 'gi')];

            results.forEach(verse => {
                const book = verse.book;
                const chapterRef = `${book} ${verse.chapter}`;
                const verseRef = `${chapterRef},${verse.verse_num}`;
                const countsPerTerm = regexes.map(regex => (verse.text.match(regex) || []).length);
                let matches;

                if (searchMode === 'AND') {
                    // KORREKTUR: Prüfe, ob *alle* Begriffe vorkommen (min > 0),
                    // aber zähle die *Summe* für die Rangliste.
                    if (Math.min(...countsPerTerm) > 0) {
                        matches = countsPerTerm.reduce((total, count) => total + count, 0);
                        searchTerm.forEach((term, index) => {
                            bookDetailCounts[book] = bookDetailCounts[book] || {};
                            bookDetailCounts[book][term] = (bookDetailCounts[book][term] || 0) + countsPerTerm[index];
                            chapterDetailCounts[chapterRef] = chapterDetailCounts[chapterRef] || {};
                            chapterDetailCounts[chapterRef][term] = (chapterDetailCounts[chapterRef][term] || 0) + countsPerTerm[index];
                            verseDetailCounts[verseRef] = verseDetailCounts[verseRef] || {};
                            verseDetailCounts[verseRef][term] = (verseDetailCounts[verseRef][term] || 0) + countsPerTerm[index];
                        });
                    } else {
                        matches = 0;
                    }
                } else {
                    matches = countsPerTerm.reduce((total, count) => total + count, 0);
                }

                if (matches > 0) {
                    bookCounts[book] = (bookCounts[book] || 0) + matches;
                    chapterCounts[chapterRef] = (chapterCounts[chapterRef] || 0) + matches;
                    verseCounts[verseRef] = (verseCounts[verseRef] || 0) + matches;
                }
            });
            const sortedBooks = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]);
            const sortedChapters = Object.entries(chapterCounts).sort((a, b) => b[1] - a[1]);
            const sortedVerses = Object.entries(verseCounts).sort((a, b) => b[1] - a[1]);

            // Sortiere die Ergebnisse hier im Hauptthread, da der Worker nicht genutzt wurde
            const canonicalBookOrder = bookChapterStructure.map(b => b.book);
            filteredResults.sort((a, b) => {
                const bookIndexA = canonicalBookOrder.indexOf(a.book);
                const bookIndexB = canonicalBookOrder.indexOf(b.book);
                if (bookIndexA !== bookIndexB) return (bookIndexA === -1 ? Infinity : bookIndexA) - (bookIndexB === -1 ? Infinity : bookIndexB);
                if (a.chapter !== b.chapter) return a.chapter - b.chapter;
                return a.verse_num - b.verse_num;
            });

            renderResults(sortedBooks, sortedChapters, sortedVerses, filteredResults);
        }
    }

    // NEU: Funktion zur Durchführung der Lückensuche
    function performGapSearch() {
        const gapInputText = gapSearchInput.value.trim();
        if (!gapInputText) {
            alert("Bitte gib mindestens einen Begriff für die Lückensuche ein.");
            return;
        }

        verseTextDisplay.innerHTML = `<h3>Suche nach Lücken für "${gapInputText}"...</h3><p>Dieser Vorgang kann einen Moment dauern.</p>`;

        // Führe die komplexe Berechnung mit einer leichten Verzögerung aus, damit die UI aktualisiert werden kann.
        setTimeout(() => {
            const searchTerms = gapInputText.split('++').map(t => t.trim().toLowerCase()).filter(Boolean);
            const usePartialSearch = partialWordSearchCheckbox.checked;

            // KORREKTUR: Berücksichtige den ausgewählten Such-Bereich.
            const versesInScope = filterPoolByScope(allVerses);
            
            // Schritt 1: Erstelle einen durchgehenden Text und eine Map, um Indizes zu Versen zuzuordnen.
            // KORREKTUR: Erstelle zwei Versionen: eine für die Suche (lowercase) und eine für die Anzeige (original case).
            let fullBibleTextLower = '';
            let fullBibleTextOriginal = '';
            const verseStartIndices = [];
            versesInScope.forEach(verse => {
                verseStartIndices.push({ verse, startIndex: fullBibleTextLower.length });
                const verseTextWithSpace = verse.text + ' ';
                fullBibleTextLower += verseTextWithSpace.toLowerCase();
                fullBibleTextOriginal += verseTextWithSpace;
            });

            // Schritt 2: Finde alle Vorkommen der Suchbegriffe.
            let matches = [];
            searchTerms.forEach(term => {
                const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                // KORREKTUR: Berücksichtige die Teilwort-Checkbox.
                // Suche immer nach Teilwörtern, wenn die Checkbox aktiv ist ODER wenn es nur ein einzelner Buchstabe ist.
                const pattern = (usePartialSearch || term.length === 1) ? escapedTerm : `\\b${escapedTerm}\\b`;
                const regex = new RegExp(pattern, 'g');
                let match;
                while ((match = regex.exec(fullBibleTextLower)) !== null) {
                    matches.push({ start: match.index, end: match.index + match[0].length });
                }
            });

            // Sortiere die Indizes und entferne Duplikate.
            matches.sort((a, b) => a.start - b.start);

            // Schritt 3: Finde die Lücken zwischen den Vorkommen.
            let gaps = [];
            let lastIndex = 0;
            matches.forEach(match => {
                if (match.start > lastIndex) {
                    gaps.push({ start: lastIndex, end: match.start, length: match.start - lastIndex });
                }
                lastIndex = match.end; // Setze den Start für die nächste Lücke auf das Ende des aktuellen Treffers.
            });
            // Füge die letzte Lücke vom letzten Vorkommen bis zum Ende des Textes hinzu.
            if (lastIndex < fullBibleTextLower.length) {
                gaps.push({ start: lastIndex, end: fullBibleTextLower.length, length: fullBibleTextLower.length - lastIndex });
            }

            // Schritt 4: Sortiere die Lücken nach Länge und nimm die Top 10.
            gaps.sort((a, b) => b.length - a.length);
            const top10Gaps = gaps.slice(0, 10);

            // Schritt 5: Zeige die Ergebnisse an.
            displayGapSearchResults(top10Gaps, fullBibleTextOriginal, verseStartIndices, gapInputText, searchTerms, usePartialSearch);
        }, 50);
    }

    // NEU: Funktion zur Anzeige der Lückensuch-Ergebnisse
    function displayGapSearchResults(gaps, fullText, verseMap, searchTerm, searchTerms, usePartialSearch) {
        let html = `<h3>Die 10 längsten Abschnitte ohne "${searchTerm}"</h3>`;
        if (gaps.length === 0) {
            html += "<p>Keine Ergebnisse gefunden. Möglicherweise kommt der Begriff überall vor.</p>";
            verseTextDisplay.innerHTML = html;
            return;
        }

        // Erstelle eine Regex, um die Kontext-Begriffe hervorzuheben
        const contextHighlightPattern = searchTerms.map(term => {
            const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            // Nutze dieselbe Logik wie bei der Suche
            return (usePartialSearch || term.length === 1) ? escaped : `\\b${escaped}\\b`;
        }).join('|');
        const contextHighlightRegex = new RegExp(`(${contextHighlightPattern})`, 'gi');

        // Hilfsfunktion, um einen Index im Gesamttext einer Bibelstelle zuzuordnen.
        const findVerseForIndex = (index) => {
            // Finde den letzten Vers, der vor oder an diesem Index beginnt.
            for (let i = verseMap.length - 1; i >= 0; i--) {
                if (verseMap[i].startIndex <= index) {
                    return verseMap[i].verse;
                }
            }
            return verseMap[0].verse; // Fallback
        };

        html += '<ol class="gap-search-results">';
        gaps.forEach(gap => {
            // KORREKTUR: Die Logik wurde komplett überarbeitet, um die Anzeige zu korrigieren.
            const startVerseInfo = verseMap.find(v => v.startIndex <= gap.start && (v.startIndex + v.verse.text.length + 1) > gap.start);
            const endVerseInfo = verseMap.find(v => v.startIndex <= gap.end && (v.startIndex + v.verse.text.length + 1) > gap.end);

            if (!startVerseInfo || !endVerseInfo) return;

            const startVerse = startVerseInfo.verse;
            const endVerse = endVerseInfo.verse;

            // 1. Extrahiere den gesamten Textblock vom Anfang des Start-Verses bis zum Ende des End-Verses.
            const blockStartIndex = startVerseInfo.startIndex;
            const blockEndIndex = endVerseInfo.startIndex + endVerseInfo.verse.text.length;
            const fullBlockText = fullText.substring(blockStartIndex, blockEndIndex);

            // 2. Berechne die relativen Positionen der Lücke innerhalb dieses Blocks.
            const relativeGapStart = gap.start - blockStartIndex;
            const relativeGapEnd = gap.end - blockStartIndex;

            // 3. Teile den Block in drei Teile: Kontext davor, Lücke, Kontext danach.
            const beforeGapText = fullBlockText.substring(0, relativeGapStart);
            const gapText = fullBlockText.substring(relativeGapStart, relativeGapEnd);
            const afterGapText = fullBlockText.substring(relativeGapEnd);

            let displayText;
            const maxLength = 2000; // Maximale Anzeigelänge
            const previewChunk = 1000; // Länge des Anfangs- und Endteils

            if (gapText.length < maxLength) {
                displayText = `${beforeGapText}<span class="gap-underline highlight-context">${gapText}</span>${afterGapText}`;
            } else {
                const startPart = gapText.substring(0, previewChunk);
                const endPart = gapText.substring(gapText.length - previewChunk);
                displayText = `${beforeGapText}<span class="gap-underline highlight-context">${startPart}</span><span class="gap-ellipsis">...</span><span class="gap-underline highlight-context">${endPart}</span>${afterGapText}`;
            }

            const startRef = `${startVerse.book} ${startVerse.chapter},${startVerse.verse_num}`;
            const endRef = `${endVerse.book} ${endVerse.chapter},${endVerse.verse_num}`;

            html += `<li><strong>Von ${startRef} bis ${endRef}</strong> (Länge: ${gap.length.toLocaleString('de-DE')} Zeichen)
                         <p class="gap-preview">${displayText}</p>
                     </li>`;
        });
        html += '</ol>';

        verseTextDisplay.innerHTML = html;
    }

    function makeGuess() {
        // Im Multiplayer-Modus wird der geheime Vers nicht auf dem Client gespeichert.
        if (gameMode === 'singleplayer' && !currentVerse && !currentChapterHeadings && !currentSummary) return;

        const guessedId = parseInt(positionInput.value, 10);
        if (isNaN(guessedId) || guessedId < 1 || guessedId > allVerses.length) {
            feedbackMessage.textContent = "Bitte wähle einen gültigen Vers über die Auswahl oder die Position.";
            feedbackMessage.className = "feedback-error";
            return;
        }

        if (gameMode === 'singleplayer') {
            if (quizMode === 'guessVerse') {
                const guessedVerse = allVerses.find(v => v.id === guessedId);
                const actualVerse = currentVerse;
                const isCorrect = (guessedId === actualVerse.id);
                const distance = Math.abs(actualVerse.id - guessedId);
                const totalVerses = allVerses.length;

                // Passe die Punkte an, wenn ein Bereich geübt wird
                const bookPoints = (customScope.active || guessedVerse.book !== actualVerse.book) ? 0 : 15;
                const testamentPoints = (customScope.active || guessedVerse.testament !== actualVerse.testament) ? 0 : 10;
                const chapterPoints = (customScope.active || guessedVerse.book !== actualVerse.book || guessedVerse.chapter !== actualVerse.chapter) ? 0 : 25;


                let points;
                if (distance === 0) {
                    points = 100;
                } else {
                    const percentageError = distance / totalVerses;
                    let distancePoints = Math.round(50 * (1 - Math.sqrt(percentageError)));
                    if (distancePoints < 0) distancePoints = 0;

                    // Passe die Punkteberechnung an
                    const contextPoints = testamentPoints + bookPoints + chapterPoints;
                    points = Math.round(distancePoints + contextPoints);
                    if (points > 99) points = 99; // Cap points for non-perfect guesses
                }

                feedbackMessage.textContent = isCorrect ? "Richtig!" : `Falsch. Die richtige Antwort war: ${actualVerse.book} ${actualVerse.chapter},${actualVerse.verse_num}`;
                feedbackMessage.className = isCorrect ? "feedback-success" : "feedback-error";
                statsDisplay.textContent = `Entfernung: ${distance} Verse. Punkte: ${points}.`;
                drawFeedback(guessedVerse, actualVerse); 
                showContextView(actualVerse.book, actualVerse.chapter, actualVerse.verse_num);
                // KORREKTUR: Setze den globalen Kontext für den "Kontext anzeigen"-Button
                currentContext = { book: actualVerse.book, chapter: actualVerse.chapter };
            } else if (quizMode === 'guessChapter') {
                // Auswertungslogik für den Kapitel-Modus
                const guessedInfo = allVerses.find(v => v.id === guessedId); // Wir brauchen den Vers für Buch/Kapitel
                const actual = currentChapterHeadings;
                
                const isCorrect = (guessedInfo.book === actual.book && guessedInfo.chapter === actual.chapter);
                
                feedbackMessage.textContent = isCorrect ? "Richtig!" : `Falsch. Die richtige Antwort war: ${actual.book} ${actual.chapter}`;
                feedbackMessage.className = isCorrect ? "feedback-success" : "feedback-error";

                let points = 0;
                let feedbackText = "";
                if (isCorrect) {
                    points = 100;
                    feedbackText = "Perfekt! 100 Punkte.";
                } else {
                    // NEUE LOGIK V4: Nähe + Bonus, dann Multiplikator und Aufrunden
                    const actualVerse = allVerses.find(v => v.book === actual.book && v.chapter === actual.chapter);
                    const distance = Math.abs(actualVerse.id - guessedInfo.id);
                    const totalVerses = allVerses.length;
                    const percentageError = distance / totalVerses;

                    // Schritt 1: Basispunkte für die Nähe (max. 50)
                    let proximityPoints = Math.round(50 * (1 - Math.sqrt(percentageError)));
                    if (proximityPoints < 0) proximityPoints = 0;
                    points = proximityPoints;

                    // Schritt 2: Bonuspunkte für Kontext (wenn kein benutzerdefinierter Bereich aktiv ist)
                    const testamentIsCorrect = guessedInfo.testament === actualVerse.testament;
                    const bookIsCorrect = guessedInfo.book === actual.book;

                    if (!customScope.active) {
                        if (testamentIsCorrect) {
                            points += 10; // +10 Punkte für das richtige Testament
                        }
                        if (bookIsCorrect) {
                            points += 20; // +20 Punkte für das richtige Buch
                        }
                    }
                    // Schritt 3: Multiplikator anwenden und aufrunden
                    points = Math.ceil(points * (5 / 4));

                    feedbackText = `Dein Tipp: ${guessedInfo.book} ${guessedInfo.chapter}. Punkte: ${Math.round(points)}.`;
                    if (points > 99) points = 99; // Maximal 99 Punkte für einen Fast-Treffer
                }
                statsDisplay.textContent = feedbackText;
                
                // Zeige den Kontext des richtigen Kapitels an
                // KORREKTUR: Setze nur den globalen Kontext, anstatt ihn sofort anzuzeigen.
                currentContext = { book: actual.book, chapter: actual.chapter };
                // Im Kapitel-Modus gibt es keine Visualisierung auf der Zeitleiste.
                clearCanvas();
            } else if (quizMode === 'guessSummary') {
                // NEU (Zusammenfassungs-Quiz): Auswertungslogik
                const guessedInfo = allVerses.find(v => v.id === guessedId);
                const actual = currentSummary;

                const isCorrect = (guessedInfo.book === actual.book && guessedInfo.chapter === actual.chapter);

                feedbackMessage.textContent = isCorrect ? "Richtig!" : `Falsch. Die richtige Antwort war: ${actual.book} ${actual.chapter}`;
                feedbackMessage.className = isCorrect ? "feedback-success" : "feedback-error";

                let points = 0;
                let feedbackText = "";
                if (isCorrect) {
                    points = 100;
                    feedbackText = "Perfekt! 100 Punkte.";
                } else {
                    // NEUE LOGIK V4: Nähe + Bonus, dann Multiplikator und Aufrunden (identisch zu 'guessChapter')
                    const actualVerse = allVerses.find(v => v.book === actual.book && v.chapter === actual.chapter);
                    const distance = Math.abs(actualVerse.id - guessedInfo.id);
                    const totalVerses = allVerses.length;
                    const percentageError = distance / totalVerses;

                    // Schritt 1: Basispunkte für die Nähe (max. 50)
                    let proximityPoints = Math.round(50 * (1 - Math.sqrt(percentageError)));
                    if (proximityPoints < 0) proximityPoints = 0;
                    points = proximityPoints;

                    // Schritt 2: Bonuspunkte für Kontext (wenn kein benutzerdefinierter Bereich aktiv ist)
                    const testamentIsCorrect = guessedInfo.testament === actualVerse.testament;
                    const bookIsCorrect = guessedInfo.book === actual.book;

                    if (!customScope.active) {
                        if (testamentIsCorrect) {
                            points += 10; // +10 Punkte für das richtige Testament
                        }
                        if (bookIsCorrect) {
                            points += 20; // +20 Punkte für das richtige Buch
                        }
                    }
                    // Schritt 3: Multiplikator anwenden und aufrunden
                    points = Math.ceil(points * (5 / 4));

                    feedbackText = `Dein Tipp: ${guessedInfo.book} ${guessedInfo.chapter}. Punkte: ${Math.round(points)}.`;
                    if (points > 99) points = 99; // Maximal 99 Punkte für einen Fast-Treffer
                }
                statsDisplay.textContent = feedbackText;
                // KORREKTUR: Setze nur den globalen Kontext, anstatt ihn sofort anzuzeigen.
                currentContext = { book: actual.book, chapter: actual.chapter };
                clearCanvas();
            } else if (quizMode === 'multipleChoice') {
                // Im Multiple-Choice-Modus wird die Auswertung über handleMcOptionClick gehandhabt.
                // Der "Tipp abgeben"-Button hat hier keine Funktion.
                return;
            }

            guessButton.disabled = true;
        }
    }

    // NEU (Multiple-Choice-Quiz): Auswertung beim Klick auf eine Option
    // KORREKTUR: Diese Funktion wurde aus `makeGuess` herausgezogen, um global verfügbar zu sein.
    function handleMcOptionClick(e) {
        if (e.target.tagName === 'BUTTON' && currentMcQuestion) {
            const correctIndex = currentMcQuestion.korrekte_antwort_index; // Index der korrekten Antwort aus den Original-Optionen
            const isCorrect = e.target.dataset.correct === 'true';

            const allButtons = mcOptionsContainer.querySelectorAll('button');
            allButtons.forEach(btn => btn.disabled = true); // Alle Buttons deaktivieren

            if (isCorrect) {
                e.target.classList.add('correct');
                feedbackMessage.textContent = "Richtig! " + (currentMcQuestion.aufloesung || "");
                feedbackMessage.className = "feedback-success";
            } else {
                e.target.classList.add('incorrect');
                mcOptionsContainer.querySelector('button[data-correct="true"]').classList.add('correct'); // Richtige Antwort hervorheben
                feedbackMessage.textContent = `Falsch. Die richtige Antwort war: ${currentMcQuestion.optionen[correctIndex]} (${currentMcQuestion.aufloesung || ""})`;
                feedbackMessage.className = "feedback-error";
            }
            // Die Auflösung wird jetzt direkt in der Feedback-Nachricht angezeigt.
            // statsDisplay.textContent = currentMcQuestion.aufloesung;
            guessButton.disabled = true; // Deaktiviert den "Tipp abgeben" Button, falls er sichtbar wäre
            // KORREKTUR: Setze den globalen Kontext, damit er nach der Antwort angezeigt werden kann.
            currentContext = { book: currentMcQuestion.book, chapter: currentMcQuestion.chapter };
        }
    }
    
    // NEU: Funktion zur Anzeige des Kapitelkontexts
    function showContextView(book, chapter, highlightedVerseNum) {
        // Verhindere das Anzeigen, wenn keine Kontextdaten vorhanden sind (z.B. vor der ersten Runde)
        if (!book || !chapter) return;

        currentContext = { book, chapter: parseInt(chapter, 10) };

        contextTitle.textContent = `${book} ${chapter}`;
        const chapterVerses = allVerses.filter(v => v.book === book && v.chapter === parseInt(chapter, 10)).sort((a, b) => a.verse_num - b.verse_num);
        
        let chapterHtml = '';
        chapterVerses.forEach(verse => {
            if (verse.verse_num === highlightedVerseNum) {
                chapterHtml += `<p><strong><sup class="highlighted-verse">${verse.verse_num}</sup><span class="highlighted-verse"><em> ${verse.text}</em></span></strong></p>`;
            } else {
                chapterHtml += `<p><sup>${verse.verse_num}</sup> ${verse.text}</p>`;
            }
        });
        contextText.innerHTML = chapterHtml;

        // NEU: Lade und zeige die Zusammenfassung an
        const summary = allSummaries.find(s => s.book === book && s.chapter === parseInt(chapter, 10));
        if (summary) {
            contextSummary.innerHTML = `<h3>Zusammenfassung</h3><p>${summary.summary}</p>`;
        } else {
            contextSummary.innerHTML = `<h3>Zusammenfassung</h3><p>Für dieses Kapitel ist keine Zusammenfassung verfügbar.</p>`;
        }


        // Scrollt zum hervorgehobenen Vers
        const highlightedElement = contextText.querySelector('.highlighted-verse');
        if (highlightedElement) {
            highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        updateContextNavButtons();
        contextView.style.display = 'block';
    }

    // NEU: Hilfsfunktion zur Navigation im Kontext
    function navigateContext(direction, isReadingMode = false) {
        const currentBookIndex = bookChapterStructure.findIndex(b => b.book === currentContext.book);
        if (currentBookIndex === -1) return;

        const currentBook = bookChapterStructure[currentBookIndex];
        const currentChapterIndex = currentBook.chapters.indexOf(currentContext.chapter);

        const displayFunction = isReadingMode ? displayReadingChapter : showContextView;

        if (direction === 'next') {
            if (currentChapterIndex < currentBook.chapters.length - 1) {
                displayFunction(currentBook.book, currentBook.chapters[currentChapterIndex + 1]);
            } else if (currentBookIndex < bookChapterStructure.length - 1) {
                const nextBook = bookChapterStructure[currentBookIndex + 1];
                displayFunction(nextBook.book, nextBook.chapters[0]);
            }
        } else if (direction === 'prev') {
            if (currentChapterIndex > 0) {
                displayFunction(currentBook.book, currentBook.chapters[currentChapterIndex - 1]);
            } else if (currentBookIndex > 0) {
                const prevBook = bookChapterStructure[currentBookIndex - 1];
                displayFunction(prevBook.book, prevBook.chapters[prevBook.chapters.length - 1]);
            }
        }
    }

    // NEU: Aktualisiert die Navigationsbuttons in der Kontextansicht
    function updateContextNavButtons() {
        const currentBookIndex = bookChapterStructure.findIndex(b => b.book === currentContext.book);
        const currentChapterIndex = bookChapterStructure[currentBookIndex].chapters.indexOf(currentContext.chapter);
        const isFirstChapter = (currentBookIndex === 0 && currentChapterIndex === 0);
        const isLastChapter = (currentBookIndex === bookChapterStructure.length - 1 && currentChapterIndex === bookChapterStructure[currentBookIndex].chapters.length - 1);
        
        // Deaktiviere alle "Zurück"- und "Weiter"-Buttons
        prevChapterButtons.forEach(btn => btn.disabled = isFirstChapter);
        nextChapterButtons.forEach(btn => btn.disabled = isLastChapter);
    }

    // KORREKTUR: Diese Funktion wird jetzt außerhalb von `drawFeedback` deklariert,
    // damit sie sowohl von `drawFeedback` als auch von `drawAllGuesses` verwendet werden kann.
    const drawMarker = (verse, color, label, y_offset, y_multiplier = 1) => {
        if (!verse) return;
        const width = feedbackCanvas.width;
        const height = feedbackCanvas.height;
        const total = allVerses.length;
        const y_base = height / 2;
        const x = 10 + (verse.id / total) * (width - 20);
        const y_text = y_base + (y_offset * y_multiplier);

        ctx.beginPath();
        ctx.moveTo(x, y_base + (y_offset > 0 ? 5 : -5)); // Start am Balken
        ctx.lineTo(x, y_text - (y_offset > 0 ? 5 : -12)); // Ende kurz vor dem Text
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = '12px Segoe UI';

        // KORREKTUR: Passe die Textausrichtung an, um ein Abschneiden am Rand zu verhindern.
        if (x < 50) {
            ctx.textAlign = 'left';
        } else if (x > width - 50) {
            ctx.textAlign = 'right';
        } else {
            ctx.textAlign = 'center';
        }

        ctx.fillText(label, x, y_text);
        ctx.fillText(`${verse.book} ${verse.chapter},${verse.verse_num}`, x, y_text + (y_offset > 0 ? 15 : -15));
    };

    // --- 4. Canvas-Zeichnung (wie update_guess_visualization in Python) ---
    function drawFeedback(guessed, actual) {
        clearCanvas();
        const width = feedbackCanvas.width;
        const height = feedbackCanvas.height;
        const total = allVerses.length;
        
        const y_base = height / 2;
        const y_offset_correct = 30; // Abstand für "Richtig" nach oben
        const y_offset_guess = 25;   // Abstand für "Dein Tipp" nach unten
        
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(10, y_base - 5, width - 20, 10); // Die Haupt-Zeitleiste

        // --- Kollisionserkennung ---
        // Berechne die horizontalen Positionen und die Breite der Labels im Voraus
        const actualX = 10 + (actual.id / total) * (width - 20);
        const actualLabel = `${actual.book} ${actual.chapter},${actual.verse_num}`;
        const actualLabelWidth = ctx.measureText(actualLabel).width;

        let guessX, guessLabel, guessLabelWidth;
        if (guessed && guessed.id !== actual.id) {
            guessX = 10 + (guessed.id / total) * (width - 20);
            guessLabel = `${guessed.book} ${guessed.chapter},${guessed.verse_num}`;
            guessLabelWidth = ctx.measureText(guessLabel).width;
        }

        // Prüfe auf Kollision
        let guessYOffsetMultiplier = 1; // Standard-Y-Position
        if (guessX && Math.abs(guessX - actualX) < (actualLabelWidth / 2 + guessLabelWidth / 2 + 10)) {
            // Kollision erkannt! Verschiebe das "Tipp"-Label nach unten.
            guessYOffsetMultiplier = 2;
        }

        drawMarker(actual, 'green', 'Richtig:', -y_offset_correct);
        if (guessed && guessed.id !== actual.id) {
            drawMarker(guessed, 'red', 'Dein Tipp:', y_offset_guess, guessYOffsetMultiplier);
        }
    }

    // NEU: Funktion zum Zeichnen aller Tipps am Rundenende
    function drawAllGuesses(results, actualVerse) {
        clearCanvas();
        const width = feedbackCanvas.width;
        const height = feedbackCanvas.height; 
        const total = allVerses.length;
        const y_base = height / 2;
        const colors = ['#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD', '#DAA520']; // Tomate, Stahlblau, Limonengrün, Gold, etc.

        // Zeichne die Zeitleiste
        ctx.fillStyle = 'lightblue';
        ctx.fillRect(10, y_base - 5, width - 20, 10);

        // Zeichne den Marker für die richtige Antwort
        drawMarker(actualVerse, 'green', 'Richtig:', -30);

        // Zeichne Marker für jeden Spieler-Tipp
        results.forEach((result, index) => {
            const player = players[result.playerId];
            const guessedVerse = allVerses.find(v => v.id === result.guessId);
            if (player && guessedVerse && guessedVerse.id !== actualVerse.id) {
                const color = (player.id === myPlayerId) ? 'red' : colors[index % colors.length];
                const label = (player.id === myPlayerId) ? 'Dein Tipp:' : `${player.name}:`;
                // Wechsle die Y-Position, um Überlappungen zu reduzieren
                const yOffset = (index % 2 === 0) ? 25 : 55;
                drawMarker(guessedVerse, color, label, yOffset);
            }
        });
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, feedbackCanvas.width, feedbackCanvas.height);
    }

    // --- Hilfsfunktionen für die UI-Logik ---
    function selectFirstAvailableOption(selectElement) {
        if (selectElement.options.length > 1) {
            selectElement.selectedIndex = 1; // Wähle die erste echte Option (nach dem Platzhalter)
            return true;
        }
        return false;
    }

    // --- UI-Update-Funktionen ---
    function updateBookDropdown() {
        if (DEBUG_SYNC) console.log('[SyncDebug] updateBookDropdown called.');
        // KORREKTUR: Entferne die Bedingung, die das Filtern im Lesemodus verhindert hat.
        // Das Buch-Dropdown sollte IMMER nach dem ausgewählten Testament gefiltert werden,
        // wenn der Testament-Schalter aktiv ist.
        // Die Initialisierung des Lesemodus wird nun in setQuizModeUI angepasst.
        const selectedTestament = document.querySelector('input[name="testament"]:checked').value;
        const books = [...new Set(allVerses.filter(v => v.testament === selectedTestament).map(v => v.book))];
        // KORREKTUR: Verwende die neue, unveränderliche `canonicalBookOrder` für die Sortierung.
        books.sort((a, b) => canonicalBookOrder.indexOf(a) - canonicalBookOrder.indexOf(b));
        populateSelect(bookSelect, books, "Buch");
        
        // Update für den Buch-Slider
        const maxBook = bookSelect.options.length - 1;
        bookSlider.max = maxBook;
        bookSliderMaxLabel.textContent = maxBook;
        updateSliderOutput(bookSlider, bookSliderOutput);
    }

    function updateChapterDropdown() {
        const selectedBook = bookSelect.value;
        const chapters = [...new Set(allVerses.filter(v => v.book === selectedBook).map(v => v.chapter))].sort((a, b) => a - b);
        populateSelect(chapterSelect, chapters, "Kapitel");
        
        // KORREKTUR: Dynamische Anpassung des Kapitel-Sliders
        // Setze den Maximalwert des Sliders auf die Anzahl der verfügbaren Kapitel.
        // Wenn keine Kapitel da sind (nur der Platzhalter), ist die Länge 1, also max = 0.
        // Wir setzen min auf 1, also ist der gültige Bereich 1-0, was den Slider deaktiviert.
        let maxChapter = chapterSelect.options.length - 1;
        if (maxChapter < 1) maxChapter = 1; // Verhindere max < min

        chapterSlider.max = maxChapter;
        chapterSliderMaxLabel.textContent = maxChapter;
        // Setze den Slider-Wert zurück, um ungültige Auswahl zu vermeiden
        chapterSlider.value = 1;
        updateSliderOutput(chapterSlider, chapterSliderOutput);

        // KORREKTUR: Stelle sicher, dass die Vers-Auswahl auch aktualisiert wird
        updateVerseDropdown();
    }

    function updateVerseDropdown() {
        const selectedBook = bookSelect.value;
        const selectedChapter = parseInt(chapterSelect.value, 10);
        const verses = [...new Set(allVerses.filter(v => v.book === selectedBook && v.chapter === selectedChapter).map(v => v.verse_num))].sort((a, b) => a - b);
        populateSelect(verseSelect, verses, "Vers");
        
        // KORREKTUR: Dynamische Anpassung des Vers-Sliders
        let maxVerse = verseSelect.options.length - 1;
        if (maxVerse < 1) maxVerse = 1;

        verseSlider.max = maxVerse;
        verseSliderMaxLabel.textContent = maxVerse;
        // Setze den Slider-Wert zurück, um ungültige Auswahl zu vermeiden
        verseSlider.value = 1;
        updateSliderOutput(verseSlider, verseSliderOutput); // Aktualisiert die Anzeige
    }

    // NEU: Funktion zur Aktualisierung der Slider-Anzeigen
    function updateAllSliderOutputs() {
        updateSliderOutput(bookSlider, bookSliderOutput);
        updateSliderOutput(chapterSlider, chapterSliderOutput);
        updateSliderOutput(verseSlider, verseSliderOutput);
    }

    // NEU: Synchronisiert die Dropdowns mit den Detail-Slidern
    function syncDropdownsToDetailSliders() {
        if (isUpdating) return;
        isUpdating = true;
        
        if (bookSelect.selectedIndex !== parseInt(bookSlider.value, 10)) {
            bookSelect.selectedIndex = bookSlider.value;
        }
        if (chapterSelect.selectedIndex !== parseInt(chapterSlider.value, 10)) {
            chapterSelect.selectedIndex = chapterSlider.value;
        }
        if (verseSelect.selectedIndex !== parseInt(verseSlider.value, 10)) {
            verseSelect.selectedIndex = verseSlider.value;
        }
        isUpdating = false;
    }

    function syncSelectionToPosition() {
        if (DEBUG_SYNC) console.log('[SyncDebug] syncSelectionToPosition called.');
        const book = bookSelect.value;
        const chapter = parseInt(chapterSelect.value, 10);
        const verse = parseInt(verseSelect.value, 10);
        if (DEBUG_SYNC) console.log(`[SyncDebug] -> Values: Book=${book}, Chapter=${chapter}, Verse=${verse}`);
        if (book && !isNaN(chapter) && !isNaN(verse)) {
            if (isUpdating) return;
            isUpdating = true;

            const foundVerse = allVerses.find(v => v.book === book && v.chapter === chapter && v.verse_num === verse);
            if (foundVerse) {
                if (positionInput.value != foundVerse.id) {
                    positionInput.value = foundVerse.id;
                }
                if (positionSlider.value != foundVerse.id) {
                    positionSlider.value = foundVerse.id;
                } 
                if (DEBUG_SYNC) console.log(`[SyncDebug] -> Position updated to ID: ${foundVerse.id}`);
            }
            bookSlider.value = bookSelect.selectedIndex;
            chapterSlider.value = chapterSelect.selectedIndex;
            verseSlider.value = verseSelect.selectedIndex;
            updateAllSliderOutputs();

            isUpdating = false;
        }
    }

    function syncPositionToSelection() {
        if (DEBUG_SYNC) console.log('[SyncDebug] syncPositionToSelection called.');
        if (isUpdating) return;
        isUpdating = true; // Verhindere Schleifen während der Synchronisation
        if (DEBUG_SYNC) console.log('[SyncDebug] syncPositionToSelection locked with isUpdating.');
        const id = parseInt(positionInput.value, 10);
        const verse = allVerses.find(v => v.id === id);

        if (verse) {
            const currentTestament = document.querySelector('input[name="testament"]:checked').value;
            let bookChanged = false;
            let chapterChanged = false;

            if (currentTestament !== verse.testament) {
                document.querySelector(`input[name="testament"][value="${verse.testament}"]`).checked = true;
                updateBookDropdown();
            }

            if (bookSelect.value !== verse.book) {
                bookSelect.value = verse.book;
                bookChanged = true;
                updateChapterDropdown(); // Kapitel-Dropdown für das neue Buch aktualisieren
            }

            if (chapterSelect.value != verse.chapter) {
                chapterSelect.value = verse.chapter;
                chapterChanged = true;
                updateVerseDropdown(); // Vers-Dropdown für das neue Kapitel aktualisieren
            }

            if (verseSelect.value != verse.verse_num) {
                verseSelect.value = verse.verse_num;
            }

            // NEU: Wenn im Lesemodus, aktualisiere die Ansicht
            if (quizMode === 'readMode') {
                // Rufe die Anzeige mit dem neuen Buch und Kapitel auf
                displayReadingChapter(verse.book, verse.chapter);
            }
        }
        // KORREKTUR: Synchronisiere die Detail-Slider mit den neuen Dropdown-Werten
        bookSlider.value = bookSelect.selectedIndex;
        chapterSlider.value = chapterSelect.selectedIndex;
        verseSlider.value = verseSelect.selectedIndex;
        updateAllSliderOutputs(); // Und aktualisiere ihre Anzeigen
        isUpdating = false;
        if (DEBUG_SYNC) console.log('[SyncDebug] syncPositionToSelection unlocked isUpdating.');
    }

    function populateSelect(selectElement, items, defaultOption) {
        const currentValue = selectElement.value;
        selectElement.innerHTML = `<option value="" disabled selected>${defaultOption}</option>`;
        items.forEach(item => {
            const option = document.createElement('option');
            // Der Wert der Option ist der Index + 1, da Index 0 der Platzhalter ist
            // KORREKTUR: Wir verwenden den Text als Wert, um die Logik einfach zu halten.
            option.value = item;
            option.textContent = item;
            selectElement.appendChild(option);
        });
        // Stelle sicher, dass der vorherige Wert wiederhergestellt wird, wenn er noch gültig ist
        if (currentValue && items.map(String).includes(String(currentValue))) {
            selectElement.value = currentValue;
        } else {
            // Wähle die erste echte Option, wenn der alte Wert ungültig ist
            if (selectElement.options.length > 1) {
                selectElement.selectedIndex = 1;
            }
        }
    }

    // NEU: Funktion zur Aktualisierung der Output-Anzeige über den Slidern
    function updateSliderOutput(slider, output) {
        const min = parseInt(slider.min, 10);
        const max = parseInt(slider.max, 10);
        const value = parseInt(slider.value, 10);

        // Text im Output-Element aktualisieren
        const selectedOption = slider.id.includes('book') ? bookSelect.options[value]?.text : (slider.id.includes('chapter') ? chapterSelect.options[value]?.text : verseSelect.options[value]?.text);
        output.textContent = selectedOption || value;

        // Position des Output-Elements anpassen
        const percent = (value - min) / (max - min);
        const thumbWidth = 16; // Geschätzte Breite des Slider-Daumens
        const newLeft = percent * (slider.offsetWidth - thumbWidth) + (thumbWidth / 2) - (output.offsetWidth / 2);
        output.style.left = `${newLeft}px`;

        // Min/Max Labels hervorheben
        slider.previousElementSibling.classList.toggle('active', value === min);
        slider.nextElementSibling.classList.toggle('active', value === max);
    }

    // NEU (Kapitel-Quiz): UI für den Spielmodus anpassen
    function setQuizModeUI(mode) {
        quizMode = mode;
        const isQuizActive = mode !== 'readMode';

        // NEU: Passe die Breite der Hauptansicht an
        bibleQuizView.style.maxWidth = (mode === 'multipleChoice') ? '800px' : '1200px';

        // Quiz-spezifische Elemente
        const isMcMode = mode === 'multipleChoice';
        const isSequentialMc = isMcMode && document.querySelector('input[name="mc-order"]:checked').value === 'sequential';
        // KORREKTUR: Die Eingabespalte (quizInputColumn) soll IMMER sichtbar sein, sowohl im Quiz- als auch im Lesemodus.
        quizInputColumn.style.display = 'flex';

        taskSliderContainer.style.display = (currentSeedString || isSequentialMc) ? 'block' : 'none';
        seedContainer.style.display = isQuizActive ? 'block' : 'none'; // KORREKTUR: Seed-Input anzeigen

        mcQuestionCounters.style.display = 'none'; // Standardmäßig ausblenden
        mcOptionsContainer.style.display = (mode === 'multipleChoice') ? 'flex' : 'none';
        mcQuizOptions.style.display = isMcMode ? 'block' : 'none';
        document.getElementById('show-context-button').style.display = isQuizActive ? 'inline-block' : 'none'; // KORREKTUR: Vereinfacht
        document.getElementById('verse-display-legend').textContent = isQuizActive ? 'Zu erratende Aufgabe' : 'Lese-Ansicht';

        // Lese-Modus-spezifische Elemente
        readingOptionsContainer.style.display = isQuizActive ? 'none' : 'block';
        summaryPositionOptions.style.display = (isQuizActive || !showSummariesCheckbox.checked) ? 'none' : 'block';
        // KORREKTUR: Bereichsauswahl für Suche nur im Lesemodus anzeigen
        searchScopeContainer.style.display = isQuizActive ? 'none' : 'block';
        gapSearchContainer.style.display = isQuizActive ? 'none' : 'block'; // NEU: Lückensuche im Lesemodus anzeigen
        readingNavTop.style.display = isQuizActive ? 'none' : 'block'; // KORREKTUR: Logik für Navigationsleisten vereinfacht
        readingNavBottom.style.display = isQuizActive ? 'none' : 'block'; // KORREKTUR: Logik für Navigationsleisten vereinfacht
        // KORREKTUR: Navigationsleiste anzeigen, wenn ein Seed aktiv ist ODER wenn der MC-Modus sequenziell ist.

        if (isQuizActive) { // Alle Quiz-Modi
            document.getElementById('guess-button').style.display = 'inline-block';
            document.getElementById('feedback-section').style.display = 'block';
            // "Nächste Runde"-Button nur anzeigen, wenn die Reihenfolge nicht deterministisch ist (kein Seed, kein sequenzieller MC).
            document.getElementById('new-verse-button').style.display = (!currentSeedString && !isSequentialMc) ? 'inline-block' : 'none';
            seededNavContainer.style.display = (currentSeedString || isSequentialMc) ? 'flex' : 'none';

            scopeSelectionContainer.style.display = 'block'; // KORREKTUR: Bereichsauswahl immer im Quiz-Modus anzeigen.
            document.getElementById('position-controls').style.display = 'block';
            document.getElementById('guess-controls').style.display = (mode === 'multipleChoice') ? 'none' : 'block';

            updateBookDropdown();
            rebuildSeededQueue();
            mcQuestionQueue = [];
        } else {
            // Setup für den Lese-Modus (readMode)
            document.getElementById('guess-button').style.display = 'none';
            document.getElementById('feedback-section').style.display = 'none';
            document.getElementById('new-verse-button').style.display = 'none';
            seededNavContainer.style.display = 'none';
            scopeSelectionContainer.style.display = 'none'; // Verstecke die Quiz-Bereichsauswahl
            document.getElementById('position-controls').style.display = 'block';
            document.getElementById('guess-controls').style.display = 'block';
            // KORREKTUR: Statt alle Bücher zu laden, aktualisiere das Buch-Dropdown basierend auf dem aktuellen Testament.
            // Dies stellt sicher, dass der Testament-Filter auch im Lesemodus korrekt angewendet wird.
            updateBookDropdown(); 
            displayReadingChapter(bookSelect.value, chapterSelect.value); // KORREKTUR: Explizite Übergabe der Werte
        }
    }

    // NEU: Funktionen für die Bereichsauswahl
    function populateScopeBookList() {
        scopeBookList.innerHTML = '';
        bookChapterStructure.forEach(({ book, testament, chapters }) => {
            const div = document.createElement('div');
            div.className = 'scope-book-item';

            const header = document.createElement('div');
            header.className = 'scope-book-header';

            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = book;
            checkbox.dataset.testament = testament;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${book}`));
            header.appendChild(label);

            const chapterToggleButton = document.createElement('button');
            chapterToggleButton.className = 'chapter-toggle-button';
            chapterToggleButton.dataset.book = book;
            chapterToggleButton.textContent = 'Kapitel';
            header.appendChild(chapterToggleButton);

            div.appendChild(header);
            div.appendChild(createChapterList(book, chapters));
            scopeBookList.appendChild(div);
        });
    }

    function selectScopeBooks(groupName) {
        const booksInGroup = BOOK_GROUPS[groupName] || [];
        if (booksInGroup.length === 0) return;

        const allBookCheckboxes = scopeBookList.querySelectorAll('.scope-book-header input[type="checkbox"]');
        const groupCheckboxes = Array.from(allBookCheckboxes).filter(cb => booksInGroup.includes(cb.value));

        // KORREKTUR: Prüfe, ob alle Bücher der Gruppe bereits ausgewählt sind.
        const areAllSelected = groupCheckboxes.length > 0 && groupCheckboxes.every(cb => cb.checked);

        // KORREKTUR: Setze den Zustand für alle Checkboxen der Gruppe auf den entgegengesetzten Wert.
        // Wenn alle ausgewählt waren, werden sie abgewählt. Wenn nicht, werden sie ausgewählt.
        groupCheckboxes.forEach(cb => {
            cb.checked = !areAllSelected;
        });

        // KORREKTUR: Aktualisiere den visuellen Zustand der Sammelbuttons.
        updateScopeGroupButtonsState(); // Stelle sicher, dass die Button-Farben sofort aktualisiert werden.
    }

    // NEU: Funktion zur Aktualisierung des visuellen Zustands der Sammelbuttons
    function updateScopeGroupButtonsState() {
        const selectedBooks = Array.from(scopeBookList.querySelectorAll('.scope-book-header input[type="checkbox"]:checked')).map(cb => cb.value);
        const groupButtons = document.querySelectorAll('#scope-filter-buttons button[data-group]');

        groupButtons.forEach(button => {
            const groupName = button.dataset.group;
            const booksInGroup = BOOK_GROUPS[groupName] || [];
            // Prüfe, ob ALLE Bücher der Gruppe in der aktuellen Auswahl enthalten sind.
            const isGroupActive = booksInGroup.length > 0 && booksInGroup.every(book => selectedBooks.includes(book));
            button.classList.toggle('active', isGroupActive);
        });
    }

    // NEU: Erstellt die (zunächst versteckte) Kapitelliste für ein Buch
    function createChapterList(book, chapters) {
        const listDiv = document.createElement('div');
        listDiv.className = 'scope-chapter-list';
        listDiv.id = `chapters-for-${book.replace(/\s/g, '-')}`;

        chapters.forEach(chapterNum => {
            const chapterLabel = document.createElement('label');
            const chapterCheckbox = document.createElement('input');
            chapterCheckbox.type = 'checkbox';
            chapterCheckbox.className = 'chapter-checkbox';
            chapterCheckbox.dataset.book = book;
            chapterCheckbox.value = chapterNum;
            chapterLabel.appendChild(chapterCheckbox);
            chapterLabel.appendChild(document.createTextNode(` ${chapterNum}`));
            listDiv.appendChild(chapterLabel);
        });
        return listDiv;
    }

    function applyCustomScope(isSearchScope) {
        const selectedCheckboxes = scopeBookList.querySelectorAll('input[type="checkbox"]:checked');
        const selectedBooks = Array.from(selectedCheckboxes)
            .filter(cb => !cb.classList.contains('chapter-checkbox')) // Nur Buch-Checkboxes
            .map(cb => cb.value);

        customScope.chapters = {};
        selectedBooks.forEach(book => {
            const chapterCheckboxes = scopeBookList.querySelectorAll(`.chapter-checkbox[data-book="${book}"]:checked`);
            customScope.chapters[book] = Array.from(chapterCheckboxes).map(cb => parseInt(cb.value, 10));
        });

        const buttonToUpdate = isSearchScope ? openSearchScopeModalButton : openScopeModalButton;
        const scopePrefix = isSearchScope ? 'Such-Bereich:' : 'Quiz-Bereich:';

        if (selectedBooks.length > 0) {
            customScope.active = true;
            customScope.books = Object.keys(customScope.chapters); // Aktualisiere die Buchliste
            buttonToUpdate.classList.add('active');
            buttonToUpdate.textContent = `${scopePrefix} aktiv (${selectedBooks.length} Bücher)`;
        } else {
            customScope.active = false;
            customScope.books = [];
            customScope.chapters = {};
            buttonToUpdate.classList.remove('active');
            buttonToUpdate.textContent = isSearchScope ? 'Bereich auswählen' : 'Quiz-Bereich: Bereich auswählen';
        }
        console.log('[Bereichsauswahl] Neuer Bereich angewendet:', customScope);
        scopeModal.style.display = 'none';

        // Starte nur dann eine neue Runde, wenn es sich um den Quiz-Scope handelt.
        if (!isSearchScope) {
            startNewRound();
        }
    }
    
    // Event-Listener für die Bereichsauswahl
    openScopeModalButton.addEventListener('click', () => {
        scopeModal.style.display = 'block';
        // Setze Haken basierend auf dem aktuellen Scope
        const allBookCheckboxes = scopeBookList.querySelectorAll('.scope-book-header input[type="checkbox"]');
        allBookCheckboxes.forEach(cb => {
            cb.checked = customScope.books.includes(cb.value);
        });

        // Setze auch die Kapitel-Haken
        const allChapterCheckboxes = scopeBookList.querySelectorAll('.chapter-checkbox');
        allChapterCheckboxes.forEach(cb => {
            const book = cb.dataset.book;
            const chapter = parseInt(cb.value, 10);
            cb.checked = customScope.chapters[book]?.includes(chapter) ?? false;
        });
    });
    // NEU: Event-Listener für die Such-Bereichsauswahl
    openSearchScopeModalButton.addEventListener('click', () => {
        scopeModal.style.display = 'block';
        // Setze Haken basierend auf dem aktuellen Scope
        const allBookCheckboxes = scopeBookList.querySelectorAll('.scope-book-header input[type="checkbox"]');
        allBookCheckboxes.forEach(cb => cb.checked = customScope.books.includes(cb.value));
        const allChapterCheckboxes = scopeBookList.querySelectorAll('.chapter-checkbox');
        allChapterCheckboxes.forEach(cb => {
            const book = cb.dataset.book;
            const chapter = parseInt(cb.value, 10);
            cb.checked = customScope.chapters[book]?.includes(chapter) ?? false;
        });
    });
    closeScopeModalButton.addEventListener('click', () => scopeModal.style.display = 'none');
    applyScopeButton.addEventListener('click', () => {
        const isSearchVisible = searchScopeContainer.style.display === 'block';
        applyCustomScope(isSearchVisible);
    });
    scopeBookList.addEventListener('click', (e) => {
        if (e.target.classList.contains('chapter-toggle-button')) {
            const bookName = e.target.dataset.book;
            const chapterList = document.getElementById(`chapters-for-${bookName.replace(/\s/g, '-')}`);
            const isVisible = chapterList.style.display === 'block';
            chapterList.style.display = isVisible ? 'none' : 'block';
            e.target.classList.toggle('open', !isVisible);
        }
        // KORREKTUR: Wenn eine einzelne Buch-Checkbox geändert wird, aktualisiere die Sammelbuttons.
        const checkbox = e.target.closest('.scope-book-header input[type="checkbox"]');
        if (checkbox) {
            updateScopeGroupButtonsState();
        }
    });
    document.getElementById('scope-filter-buttons').addEventListener('click', (e) => {
        if (e.target.dataset.group) {
            selectScopeBooks(e.target.dataset.group);
        } else if (e.target.id === 'scope-select-all') {
            scopeBookList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        } else if (e.target.id === 'scope-deselect-all') {
            scopeBookList.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        }
        updateScopeGroupButtonsState(); // KORREKTUR: Nach jeder Aktion den Zustand der Buttons aktualisieren.
    });

    // NEU: Funktion zum (Neu-)Aufbau der Seed-Queue
    function rebuildSeededQueue() {
        // KORREKTUR: Vereinfacht. Die UI-Logik wird jetzt zentral von setQuizModeUI gesteuert.
        // Diese Funktion ist nur noch für den Aufbau der Daten-Queue zuständig.
        if (!currentSeedString && !(quizMode === 'multipleChoice' && document.querySelector('input[name="mc-order"]:checked').value === 'sequential')) {
            seededQueue = [];
            return;
        }

        let pool;
        if (quizMode === 'guessVerse') pool = allVerses;
        else if (quizMode === 'guessChapter') pool = allHeadings;
        else if (quizMode === 'guessSummary') pool = allSummaries;
        else if (quizMode === 'multipleChoice') {
            // Für MC müssen wir die Fragen erst aus dem Objekt in ein Array umwandeln
            pool = [];
            for (const book in allMcQuestions) {
                for (const chapter in allMcQuestions[book]) {
                    allMcQuestions[book][chapter].forEach(q => {
                        pool.push({ ...q, book, chapter: parseInt(chapter, 10) });
                    });
                }
            }
        } else {
            pool = [];
        }

        const filteredPool = filterPoolByScope(pool);

        // KORREKTUR: Berücksichtige die MC-Sortierreihenfolge, bevor gemischt wird.
        const mcOrderMode = document.querySelector('input[name="mc-order"]:checked').value;

        // KORREKTUR: Wenn ein Seed aktiv ist, wird IMMER gemischt, um die deterministische Zufallsreihenfolge zu erhalten.
        // Nur wenn KEIN Seed aktiv ist UND der Modus "sequenziell" ist, wird kanonisch sortiert.
        if (quizMode === 'multipleChoice' && mcOrderMode === 'sequential' && !currentSeedString) {
            // Sortiere den Pool kanonisch (1. Mose -> Offb), da kein Seed aktiv ist.
            const canonicalBookOrder = bookChapterStructure.map(b => b.book);
            filteredPool.sort((a, b) => {
                const bookIndexA = canonicalBookOrder.indexOf(a.book);
                const bookIndexB = canonicalBookOrder.indexOf(b.book);
                if (bookIndexA !== bookIndexB) {
                    return (bookIndexA === -1 ? Infinity : bookIndexA) - (bookIndexB === -1 ? Infinity : bookIndexB);
                }
                if (a.chapter !== b.chapter) {
                    return a.chapter - b.chapter;
                }
                // Wenn Fragen eine eigene ID oder einen Index haben, hier weiter sortieren.
                // Ansonsten ist die Reihenfolge innerhalb eines Kapitels nicht garantiert.
                return 0;
            });
            seededQueue = filteredPool;
        } else {
            // Für alle anderen Modi, oder wenn MC-Zufall gewählt ist, oder wenn ein Seed aktiv ist, mische den Pool.
            // KORREKTUR: Stelle sicher, dass der *gefilterte* Pool gemischt wird, nicht der ursprüngliche.
            const tempGenerator = mulberry32(cyrb128(currentSeedString));
            for (let i = filteredPool.length - 1; i > 0; i--) {
                const j = Math.floor(tempGenerator() * (i + 1));
                [filteredPool[i], filteredPool[j]] = [filteredPool[j], filteredPool[i]];
            }
            seededQueue = filteredPool;
        }

        seededQueueIndex = -1; // Wird in startNewRound auf 0 gesetzt
    }

    // NEU: Event-Listener für das Seed-Eingabefeld
    function updateSeed() {
        const seedStr = seedInput.value.trim();
        currentSeedString = seedStr;
        rebuildAndStartFromSeed();
    }
    seedInput.addEventListener('change', updateSeed);
    clearSeedButton.addEventListener('click', () => {
        seedInput.value = '';
        updateSeed();
    });

    // NEU: Hilfsfunktion, um den Seed-Generator neu zu erstellen und eine neue Runde zu starten
    function rebuildAndStartFromSeed() {
        if (currentSeedString) {
            const seed = cyrb128(currentSeedString);
            randomGenerator = mulberry32(seed);
            console.log(`[Seed] Pseudozufallsgenerator initialisiert mit Seed: "${currentSeedString}" (Hash: ${seed})`);
            clearSeedButton.style.display = 'inline-block';
            seededNavContainer.style.display = 'flex';
        } else {
            randomGenerator = Math.random; // Zurück zum Standard-Zufallsgenerator
            console.log('[Seed] Seed entfernt. Standard-Zufallsgenerator (Math.random) wird verwendet.');
            clearSeedButton.style.display = 'none'; // UI wird von setQuizModeUI gesteuert
        }
        rebuildSeededQueue();
        // Starte die erste Aufgabe (Index 0) aus der neuen Queue
        displayTaskFromSeededQueue(0); 
    }

    // NEU: Event-Listener für den Aufgaben-Slider
    taskSlider.addEventListener('input', () => {
        const index = parseInt(taskSlider.value, 10) - 1;
        if (quizMode === 'multipleChoice' && document.querySelector('input[name="mc-order"]:checked').value === 'sequential' && !currentSeedString) {
            // KORREKTUR: Setze den Index und zeige die spezifische Frage an, anstatt die Sequenz neu zu starten.
            mcCurrentIndex = index; // Setzt den Index für den nächsten Klick auf "Nächste Runde"
            displayMcQuestionContent(mcQuestionQueue[index]);
        } else if (currentSeedString) {
            displayTaskFromSeededQueue(index);
        }
    });

    // NEU: Event-Listener und Funktion für das Seed-Erklärungs-Modal
    showSeedExplanationButton.addEventListener('click', displaySeedExplanation);
    closeSeedExplanationModalButton.addEventListener('click', () => {
        seedExplanationModal.style.display = 'none';
    });

    function displaySeedExplanation() {
        const seedStr = seedInput.value.trim();
        if (!seedStr) {
            seedExplanationContent.innerHTML = '<p style="font-family: sans-serif;">Bitte gib zuerst ein Wort (Seed) in das Eingabefeld ein, um die Berechnung zu sehen.</p>';
            seedExplanationModal.style.display = 'block';
            return;
        }

        let html = `<h3>Schritt-für-Schritt-Erklärung für Seed: "${seedStr}"</h3>`;

        // Schritt 1: cyrb128 Hash
        html += '<h4>Schritt 1: Erzeuge einen numerischen Startwert (Seed) aus dem Wort</h4>';
        html += '<p style="font-family: sans-serif;">Die Funktion <code>cyrb128</code> wandelt den Text in eine 32-bit Zahl um. Dies geschieht durch eine Reihe von Bit-Operationen, um eine gut verteilte, aber für denselben Text immer gleiche Zahl zu erhalten.</p>';
        
        let h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < seedStr.length; i++) {
            k = seedStr.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        const finalSeed = (h1^h2^h3^h4)>>>0;

        html += `<p>Ergebnis: <code>cyrb128("${seedStr}")</code> = <strong>${finalSeed}</strong></p>`;

        // Schritt 2: mulberry32 PRNG
        html += '<h4>Schritt 2: Erzeuge eine vorhersagbare Zufallszahlen-Sequenz</h4>';
        html += '<p style="font-family: sans-serif;">Die Funktion <code>mulberry32</code> nimmt den numerischen Seed und erzeugt bei jedem Aufruf eine neue, aber vorhersagbare "Zufallszahl" zwischen 0 und 1. Hier sind die ersten drei Zahlen, die generiert werden:</p>';
        const tempGenerator = mulberry32(finalSeed);
        html += `<p>1. Zufallszahl: ${tempGenerator()}</p>`;
        html += `<p>2. Zufallszahl: ${tempGenerator()}</p>`;
        html += `<p>3. Zufallszahl: ${tempGenerator()}</p>`;

        seedExplanationContent.innerHTML = html;
        seedExplanationModal.style.display = 'block';
    }

    // NEU: Event-Listener für den Lese-Modus
    showSummariesCheckbox.addEventListener('change', () => {
        summaryPositionOptions.style.display = showSummariesCheckbox.checked ? 'block' : 'none';
        displayReadingChapter(currentContext.book, currentContext.chapter);
    });
    summaryPositionOptions.addEventListener('change', () => {
        displayReadingChapter(currentContext.book, currentContext.chapter);
    });
    searchButton.addEventListener('click', () => performSearch({ isPagination: false }));
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch({ isPagination: false });
        }
    });
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchButton.style.display = 'none';
        setQuizModeUI('readMode'); // Setzt die Leseansicht zurück
    });

    // NEU: Event-Listener für die "Gehe zu"-Funktion
    gotoReferenceButton.addEventListener('click', parseAndGoToReference);
    referenceInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            parseAndGoToReference();
        }
    });

    // NEU: Event-Listener für die Lückensuche
    gapSearchButton.addEventListener('click', performGapSearch);
    gapSearchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performGapSearch();
        }
    });

    randomChapterButton.addEventListener('click', () => {
        // NEU: Berücksichtige den Scope
        const availableBooks = customScope.active ? bookChapterStructure.filter(b => customScope.books.includes(b.book)) : bookChapterStructure;
        if (availableBooks.length === 0) return;

        const randomBook = availableBooks[Math.floor(randomGenerator() * availableBooks.length)];
        const availableChapters = customScope.active && customScope.chapters[randomBook.book]?.length > 0
            ? customScope.chapters[randomBook.book]
            : randomBook.chapters;
        const randomChapter = availableChapters[Math.floor(randomGenerator() * availableChapters.length)];
        
        // KORREKTUR (FINAL V2): Die Reihenfolge und das Timing der UI-Updates sind kritisch.
        // Wir müssen sicherstellen, dass die Dropdowns den korrekten Inhalt haben, BEVOR die Slider synchronisiert werden.
        isUpdating = true;
        try {
            // Schritt 1: Setze den AT/NT-Schalter. Sein 'change'-Event wird durch isUpdating blockiert.
            document.querySelector(`input[name="testament"][value="${randomBook.testament}"]`).checked = true;
            
            // Schritt 2: Erzwinge das Neuladen des Buch-Dropdowns, auch im Lesemodus.
            // Wir umgehen die `if (quizMode === 'readMode')` Bedingung, indem wir den Modus kurz ändern.
            const originalQuizMode = quizMode;
            if (quizMode === 'readMode') quizMode = 'guessVerse'; // Temporär ändern
            updateBookDropdown(); // Wird jetzt IMMER filtern, da die Bedingung entfernt wurde.
            if (quizMode !== originalQuizMode) quizMode = originalQuizMode; // Zurücksetzen
            // Schritt 3: Setze die Dropdown-Werte auf das zufällige Buch und Kapitel.
            bookSelect.value = randomBook.book;
            updateChapterDropdown();
            chapterSelect.value = randomChapter;
            updateVerseDropdown();
        } finally {
            isUpdating = false;
        }

        // Schritt 4: Rufe die Anzeigefunktion auf, NACHDEM isUpdating wieder false ist.
        // Sie zeigt den Text an und synchronisiert die Slider basierend auf den jetzt korrekten Dropdown-Werten und Indizes.
        displayReadingChapter(randomBook.book, randomChapter);
    });

    // NEU: Funktion zum Parsen und Anzeigen einer Bibelstellen-Referenz
    function parseAndGoToReference() {
        const input = referenceInput.value.trim();
        if (!input) return;

        // Regex, um Buch, Kapitel und optional Vers zu extrahieren
        // Erlaubt z.B. "1. Mose 5,10", "Johannes 3 16", "Offenbarung 22"
        const match = input.match(/^(.+?)\s*(\d+)(?:[,\s:.]+(\d+))?$/);

        if (match) {
            const bookNamePart = match[1].trim();
            const chapter = parseInt(match[2], 10);
            const verse = match[3] ? parseInt(match[3], 10) : null;

            // Finde das passende Buch (Groß-/Kleinschreibung und Leerzeichen ignorieren)
            const foundBook = bookChapterStructure.find(b =>
                b.book.replace(/\s/g, '').toLowerCase() === bookNamePart.replace(/\s/g, '').toLowerCase()
            );

            if (foundBook) {
                displayReadingChapter(foundBook.book, chapter);
                // Synchronisiere die Dropdowns
                bookSelect.value = foundBook.book;
                updateChapterDropdown();
                chapterSelect.value = chapter;
            } else {
                alert(`Das Buch "${bookNamePart}" wurde nicht gefunden.`);
            }
        } else {
            alert('Ungültiges Format. Bitte verwenden Sie z.B. "Buch Kapitel" oder "Buch Kapitel,Vers".');
        }
    }

    // NEU: Event-Listener für beide Navigationsleisten (über Delegation)
    bibleQuizView.addEventListener('click', (e) => {
        if (e.target.classList.contains('reading-prev-chapter')) {
            navigateContext('prev', true);
        }
        if (e.target.classList.contains('reading-next-chapter')) {
            navigateContext('next', true);
        }

        // NEU: Klick auf ein Suchergebnis
        const searchItem = e.target.closest('.search-result-item');
        const searchRefLink = e.target.closest('.search-result-ref');
        if (searchRefLink) {
            e.preventDefault();
            const item = searchRefLink.closest('.search-result-item');
            toggleSearchResultDetail(item);
        }
        const contextButton = e.target.closest('.read-in-context-button');
        if (contextButton) {
            e.preventDefault();
            const book = contextButton.dataset.book;
            const chapter = contextButton.dataset.chapter;
            const verse = contextButton.dataset.verse;
            displayReadingChapter(book, chapter, { highlightTerm: verseTextDisplay.dataset.searchTerm.split('++'), usePartialSearch: verseTextDisplay.dataset.usePartialSearch === 'true', verseToScrollTo: verse });
        }

        // NEU: Klick auf einen Ranglisten-Link
        const rankLink = e.target.closest('a.search-rank-link'); // Klick auf einen Link in der Rangliste
        if (rankLink && rankLink.classList.contains('book-rank')) {
            // Klick auf einen BUCH-Link
            e.preventDefault();
            const book = rankLink.dataset.book;
            const searchTermString = rankLink.dataset.searchTerm;
            const isPartial = rankLink.dataset.partialSearch === 'true';
            
            // KORREKTUR: Rekonstruiere Suchbegriffe und Modus korrekt
            const isAndSearch = searchTermString.includes('++');
            const searchTerms = searchTermString.split(isAndSearch ? '++' : '+').map(t => t.trim()).filter(Boolean);

            const searchPool = filterPoolByScope(allVerses);
            const regexes = searchTerms.map(term => {
                const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                return isPartial ? new RegExp(escaped, 'i') : new RegExp(`\\b${escaped}\\b`, 'i');
            });

            let resultsInBook;
            if (isAndSearch) {
                resultsInBook = searchPool.filter(v => v.book === book && regexes.every(regex => regex.test(v.text)));
            } else {
                resultsInBook = searchPool.filter(v => v.book === book && regexes.some(regex => regex.test(v.text)));
            }

            // KORREKTUR: Übergebe das Array der Suchbegriffe, nicht den String
            displaySearchResults(resultsInBook, searchTerms, isPartial, { bookFilter: book, searchMode: isAndSearch ? 'AND' : 'OR' });
        } else if (rankLink) {
            // Klick auf einen KAPITEL- oder VERS-Link
            e.preventDefault();
            const book = rankLink.dataset.book;
            const chapter = rankLink.dataset.chapter || bookChapterStructure.find(b => b.book === book)?.chapters[0] || 1;
            const verse = rankLink.dataset.verse;
            const searchTermString = rankLink.dataset.searchTerm;
            const usePartialSearch = rankLink.dataset.partialSearch === 'true';

            // NEU: Suchbegriff aus dem Dataset in ein Array von einzelnen Begriffen zerlegen
            let termsToHighlight = [];
            if (searchTermString.includes('++')) { // UND-Suche
                termsToHighlight = searchTermString.split('++').map(t => t.trim()).filter(Boolean);
            } else if (searchTermString.includes('+')) { // ODER-Suche
                termsToHighlight = searchTermString.split('+').map(t => t.trim()).filter(Boolean);
            } else {
                termsToHighlight = [searchTermString.trim()].filter(Boolean);
            }

            displayReadingChapter(book, chapter, { highlightTerm: termsToHighlight, usePartialSearch: usePartialSearch, verseToScrollTo: verse });
            if (verse) {
                setTimeout(() => { // Kurze Verzögerung, damit der DOM aktualisiert ist
                    highlightAndScrollToVerse(verse, true);
                }, 100); // 100ms sollten reichen, damit der DOM gerendert ist
            }
        }

        // Klick auf einen Tab-Button in der Suchstatistik
        const tabButton = e.target.closest('.tab-button');
        if (tabButton) {
            e.preventDefault();
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabButton.classList.add('active');
            document.querySelectorAll('.search-rank-table').forEach(table => table.classList.add('hidden'));
            document.getElementById(tabButton.dataset.table).classList.remove('hidden');
        }

        // Klick auf einen sortierbaren Tabellenkopf
        const sortableHeader = e.target.closest('.search-rank-table th[data-sort-key]');
        if (sortableHeader) {
            e.preventDefault();
            const table = sortableHeader.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const sortKey = sortableHeader.dataset.sortKey;
            const sortType = sortableHeader.dataset.sortType;
            const currentOrder = sortableHeader.dataset.sortOrder || 'desc';
            const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';

            rows.sort((a, b) => {
                const valA = a.cells[sortKey === 'name' ? 1 : (sortKey === 'count' ? 2 : 0)].textContent;
                const valB = b.cells[sortKey === 'name' ? 1 : (sortKey === 'count' ? 2 : 0)].textContent;

                let comparison = 0;
                if (sortType === 'number') {
                    comparison = parseInt(valA, 10) - parseInt(valB, 10);
                } else {
                    comparison = valA.localeCompare(valB, 'de');
                }
                return newOrder === 'asc' ? comparison : -comparison;
            });

            table.querySelectorAll('th').forEach(th => th.removeAttribute('data-sort-order'));
            sortableHeader.dataset.sortOrder = newOrder;

            tbody.innerHTML = '';
            rows.forEach(row => tbody.appendChild(row));
        }
    });

    // NEU: Funktion zum Auf-/Zuklappen der Suchergebnis-Details
    function toggleSearchResultDetail(itemElement) {
        const existingDetail = itemElement.querySelector('.search-result-detail-content');
        if (existingDetail) {
            existingDetail.remove();
            return;
        }

        const book = itemElement.dataset.book;
        const chapter = itemElement.dataset.chapter;
        const verse = itemElement.dataset.verse;

        const searchTermString = verseTextDisplay.dataset.searchTerm;
        const usePartialSearch = verseTextDisplay.dataset.usePartialSearch === 'true';
        const searchTerms = searchTermString.split(searchTermString.includes('++') ? '++' : '+').map(t => t.trim()).filter(Boolean);

        const highlightPattern = searchTerms.map(term => {
            const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return usePartialSearch ? escaped : `\\b${escaped}\\b`;
        }).join('|');
        const highlightRegex = new RegExp(`(${highlightPattern})`, 'gi');

        const foundVerse = allVerses.find(v => v.book === book && v.chapter == chapter && v.verse_num == verse);
        if (!foundVerse) return;

        const highlightedText = foundVerse.text.replace(highlightRegex, '<span class="highlight">$1</span>');

        const detailDiv = document.createElement('div');
        detailDiv.className = 'search-result-detail-content';
        detailDiv.innerHTML = `
            <p>${highlightedText}</p>
            <button class="button read-in-context-button" data-book="${book}" data-chapter="${chapter}" data-verse="${verse}">Im Kontext lesen</button>
        `;
        itemElement.appendChild(detailDiv);
    }

    verseTextDisplay.addEventListener('click', (e) => {
        const showMoreButton = e.target.closest('button.show-more-rank');
        const versePageButton = e.target.closest('button[data-verse-page-offset]');

        if (versePageButton) {
            e.preventDefault();
            searchResultOffset = parseInt(versePageButton.dataset.versePageOffset, 10);
            performSearch({ isPagination: true }); // Führe die Suche mit dem neuen Offset erneut durch
        }

    });
    // KORREKTUR: Event-Listener für die On-Demand-Dichte-ANZEIGE
    verseTextDisplay.addEventListener('click', (e) => {
        const clickedDensityLink = e.target.closest('.density-link');
        if (clickedDensityLink && !clickedDensityLink.dataset.sorted) {
            e.preventDefault();
            const targetRank = clickedDensityLink.closest('li').dataset.rank;
            const parentList = clickedDensityLink.closest('ul');

            // 1. Sammle alle Elemente des gleichen Rangs
            const rankGroup = Array.from(parentList.querySelectorAll(`li[data-rank="${targetRank}"]`));
            
            // 2. Erstelle ein Array von Objekten mit den notwendigen Daten zum Sortieren
            const itemsToSort = rankGroup.map(li => {
                const link = li.querySelector('.density-link');
                const type = link.dataset.type;
                const key = link.dataset.key;
                const count = parseInt(link.dataset.count, 10);
                let totalChars = 1;
                if (type === 'book') totalChars = bookCharCounts[key] || 1;
                else if (type === 'chapter') totalChars = chapterCharCounts[key] || 1;
                else if (type === 'verse') {
                    const verse = allVerses.find(v => `${v.book} ${v.chapter},${v.verse_num}` === key);
                    totalChars = verse ? verse.text.length : 1;
                }
                const density = (count / totalChars) * 1000;
                return { li, density };
            });

            // 3. Sortiere die Gruppe nach Dichte (absteigend)
            itemsToSort.sort((a, b) => b.density - a.density);

            // 4. Aktualisiere das DOM
            itemsToSort.forEach((item, index) => {
                const { li, density } = item;
                // Aktualisiere die Rangnummer
                const rankNumberEl = li.querySelector('.rank-number');
                rankNumberEl.textContent = `${targetRank}.${index + 1}`;
                
                // Aktualisiere den Dichte-Link
                const densityLink = li.querySelector('.density-link');
                densityLink.textContent = `Dichte: ${density.toFixed(2)}`;
                densityLink.style.pointerEvents = 'none';
                densityLink.dataset.sorted = "true";

                // Füge das sortierte Element wieder in die Liste ein
                parentList.insertBefore(li, rankGroup[0]);
            });
        }
    });

    // --- 5. Event Listeners --- 
    testamentRadios.forEach(radio => radio.addEventListener('change', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Testament radio changed to ${radio.value}`);
        if (isUpdating) return;

        // KORREKTUR: Setze die Auswahl gezielt auf den Anfang des gewählten Testaments.
        const selectedTestament = document.querySelector('input[name="testament"]:checked').value;

        isUpdating = true;
        updateBookDropdown();

        if (selectedTestament === 'AT') {
            bookSelect.value = '1. Mose';
        } else { // NT
            bookSelect.value = 'Matthäus';
        }

        updateChapterDropdown();
        chapterSelect.value = '1';
        updateVerseDropdown();
        verseSelect.value = '1';

        isUpdating = false;
        syncSelectionToPosition();

        // Wenn im Lesemodus, aktualisiere die Ansicht auf das neue Kapitel.
        if (quizMode === 'readMode') {
            displayReadingChapter(bookSelect.value, chapterSelect.value);
        }
    }));

    bookSelect.addEventListener('change', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Book select changed to ${bookSelect.value}`);
        if (isUpdating) return; // Verhindert, dass eine externe Synchronisation diesen Listener erneut auslöst.

        if (quizMode === 'readMode') {
            // Im Lesemodus wird die Synchronisation über displayReadingChapter gehandhabt.
            displayReadingChapter(bookSelect.value, chapterSelect.value);
        } else {
            // KORREKTUR: Verfeinerte isUpdating-Logik, um die Synchronisationskette nicht zu unterbrechen.
            isUpdating = true; // Sperre setzen
            updateChapterDropdown();
            selectFirstAvailableOption(chapterSelect); // Wähle erstes Kapitel
            updateVerseDropdown();
            selectFirstAvailableOption(verseSelect); // Wähle ersten Vers
            isUpdating = false; // Sperre aufheben, BEVOR die finale Synchronisation erfolgt.
            syncSelectionToPosition();
        }
    });

    chapterSelect.addEventListener('change', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Chapter select changed to ${chapterSelect.value}`);
        if (isUpdating) return;
        if (quizMode === 'readMode') {
            displayReadingChapter(bookSelect.value, chapterSelect.value);
        } else {
            updateVerseDropdown();
            selectFirstAvailableOption(verseSelect); // Wähle ersten Vers
            syncSelectionToPosition();
        }
    });

    verseSelect.addEventListener('change', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Verse select changed to ${verseSelect.value}`);
        if (isUpdating) return;
        if (quizMode === 'readMode') {
            // NEU: Im Lesemodus nur den Vers hervorheben
            highlightAndScrollToVerse(verseSelect.value);
        } else {
            syncSelectionToPosition();
        }
    });

    positionInput.addEventListener('input', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Position input changed to ${positionInput.value}`);
        positionSlider.value = positionInput.value;
        syncPositionToSelection();
    });
    positionSlider.addEventListener('input', () => {
        positionInput.value = positionSlider.value;
        syncPositionToSelection();
    });

    // NEU: Event-Listener für die Detail-Slider
    bookSlider.addEventListener('input', () => {
        if (isUpdating) return;
        bookSelect.selectedIndex = bookSlider.value;
        updateSliderOutput(bookSlider, bookSliderOutput);
        bookSelect.dispatchEvent(new Event('change'));
    });

    chapterSlider.addEventListener('input', () => {
        if (isUpdating) return;
        chapterSelect.selectedIndex = chapterSlider.value;
        updateSliderOutput(chapterSlider, chapterSliderOutput);
        chapterSelect.dispatchEvent(new Event('change'));
    });

    // KORREKTUR: Scroll-Verhalten nur beim Loslassen des Sliders auslösen
    verseSlider.addEventListener('input', () => { // Feuert während des Ziehens
        if (isUpdating) return;
        verseSelect.selectedIndex = verseSlider.value;
        updateSliderOutput(verseSlider, verseSliderOutput);
    });

    verseSlider.addEventListener('change', () => { // Feuert nach dem Loslassen
        if (isUpdating) return;
        if (quizMode === 'readMode') {
            highlightAndScrollToVerse(verseSelect.value);
        } else {
            verseSelect.dispatchEvent(new Event('change')); // Löst syncSelectionToPosition aus
        }
    });

    // NEU: Hilfsfunktion zum Hervorheben eines Verses
    function highlightAndScrollToVerse(verseNum, isFromSearch = false) {
        // Entferne alte Highlights
        const oldHighlights = verseTextDisplay.querySelectorAll('.reading-highlight');
        oldHighlights.forEach(el => el.classList.remove('reading-highlight'));
        // Füge neues Highlight hinzu
        const verseElement = verseTextDisplay.querySelector(`p[data-verse-num="${verseNum}"]`);
        if (verseElement) { // KORREKTUR: Füge nur eine Klasse hinzu, anstatt den Inhalt zu ersetzen.
            verseElement.classList.add('reading-highlight');
            verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // NEU: Event-Listener für die Seed-Navigation
    prevTaskButton.addEventListener('click', () => {
        const isSequentialMc = (quizMode === 'multipleChoice' && document.querySelector('input[name="mc-order"]:checked').value === 'sequential');
        if (currentSeedString) {
            displayTaskFromSeededQueue(seededQueueIndex - 1);
        } else if (isSequentialMc) {
            // KORREKTUR: mcCurrentIndex zeigt auf die *nächste* Frage. Die aktuelle ist also index-1.
            const newIndex = mcCurrentIndex - 2;
            if (newIndex >= 0 && newIndex < mcQuestionQueue.length) {
                mcCurrentIndex = newIndex + 1; // Setze den Index für den nächsten Aufruf
                displayMcQuestionContent(mcQuestionQueue[newIndex]);
            }
        }
    });
    nextTaskButton.addEventListener('click', () => {
        const isSequentialMc = (quizMode === 'multipleChoice' && document.querySelector('input[name="mc-order"]:checked').value === 'sequential');
        if (currentSeedString) {
            displayTaskFromSeededQueue(seededQueueIndex + 1);
        } else if (isSequentialMc) {
            // KORREKTUR: mcCurrentIndex zeigt bereits auf die nächste Frage.
            startNewRound(); // Ruft einfach die Logik für die nächste Runde auf
        }
    });

    // NEU: Event-Listener für die Kontextansicht
    closeContextButton.addEventListener('click', () => contextView.style.display = 'none');
    // NEU: Event-Listener für alle Kontext-Navigationsbuttons (im Kontext-Fenster)
    contextView.addEventListener('click', (e) => {
        if (e.target.classList.contains('prev-chapter-button')) {
            navigateContext('prev', false);
        }
        if (e.target.classList.contains('next-chapter-button')) {
            navigateContext('next', false);
        }
    });

    showContextButton.addEventListener('click', () => {
        // Zeigt den Kontext für die *letzte* Runde erneut an
        showContextView(currentContext.book, currentContext.chapter, currentVerse?.verse_num);
    });

    // NEU (Kapitel-Quiz): Event-Listener für die Spielmodus-Auswahl
    gameModeRadios.forEach(radio => radio.addEventListener('change', (e) => {
        setQuizModeUI(e.target.value);
        // Wenn ein Seed aktiv ist, baue die Queue neu auf und starte bei 0.
        // Ansonsten starte eine normale, zufällige neue Runde.
        if (currentSeedString) rebuildAndStartFromSeed();
        else startNewRound();
    }));

    // NEU: Event-Listener für die MC-Reihenfolge-Optionen
    mcQuizOptions.addEventListener('change', () => {
        // KORREKTUR: Rufe setQuizModeUI auf, um die Button-Sichtbarkeit korrekt zu aktualisieren.
        setQuizModeUI(quizMode);
        startNewRound();
    });

    // NEU: Event-Listener für die Multiple-Choice-Optionen (über Delegation)
    mcOptionsContainer.addEventListener('click', handleMcOptionClick);

    // NEU: Funktion, um die Host-Informationen in der Lobby anzuzeigen
    function showHostInfo(data) {
        if (!hostInfoDiv || !data || !data.addresses || data.addresses.length === 0) {
            return;
        }

        // KORREKTUR: Ersetze den gesamten Inhalt der host-info-Box, um nur die Links anzuzeigen.
        let linksHtml = '';
        data.addresses.forEach(addr => {
            const link = `http://${addr}:${data.port}`;
            linksHtml += `<p><strong><a href="${link}" target="_blank">${link}</a></strong></p>`;
        });
        hostInfoDiv.innerHTML = linksHtml;
        hostInfoDiv.classList.remove('hidden');
    }


    guessButton.addEventListener('click', makeGuess);
    newVerseButton.addEventListener('click', startNewRound);

    // NEU: Event-Listener für "Nächste Runde"
    if (hostNextRoundButton) {
        hostNextRoundButton.addEventListener('click', () => {
            hostNextRoundButton.style.display = 'none'; // Verhindere Doppelklicks
            hostResetGameButton.style.display = 'none';
            // Sende Event ohne Passwort, um nur die nächste Runde zu starten
            window.socket.emit('bibleQuiz:nextRound');
        });
    }

    // NEU: Event-Listener für "Spiel Neustarten" (mit Passwort)
    if (hostResetGameButton) {
        hostResetGameButton.addEventListener('click', () => {
            const password = prompt("Bitte Host-Passwort eingeben, um das Spiel zurückzusetzen:");
            if (password) { // Nur senden, wenn ein Passwort eingegeben wurde
                hostNextRoundButton.style.display = 'none';
                hostResetGameButton.style.display = 'none';
                window.socket.emit('bibleQuiz:resetGame', { password });
            }
        });
    }


    // Globale Funktion zum Starten des Einzelspielermodus
    function startBibleQuizSinglePlayer() {
        gameMode = 'singleplayer';
        if (window.showView) window.showView('bible-quiz-view');
        // KORREKTUR: Host-Info ausblenden, wenn der Einzelspielermodus gestartet wird.
        if (hostInfoDiv) hostInfoDiv.classList.add('hidden');
        // NEU (Kapitel-Quiz): Zeige die Modus-Auswahl an
        if (gameModeSelection) gameModeSelection.style.display = 'block';
        // NEU (Bereichsauswahl): Zeige die Bereichsauswahl an
        if (scopeSelectionContainer) scopeSelectionContainer.style.display = 'block';
        // KORREKTUR: Beim Start immer den Lesemodus initialisieren.
        document.querySelector('input[name="game-mode"][value="readMode"]').checked = true;
        setQuizModeUI('readMode');
        setInitialSelection(); // Setzt die Auswahl auf 1. Mose 1,1
        displayReadingChapter('1. Mose', 1); // Zeigt das erste Kapitel an
    }

    // --- Multiplayer-Setup ---
    function setupMultiplayerListeners() {
        if (!window.socket) return;
        if (window.socket._hasBibleQuizListeners) return;

        // KORREKTUR: Host-Info standardmäßig ausblenden, wenn der MP-Modus betreten wird.
        // NEU (Kapitel-Quiz): Spielmodus-Auswahl im Multiplayer ausblenden (wird vom Host gesteuert)
        if (gameModeSelection) gameModeSelection.style.display = 'none';
        // NEU (Bereichsauswahl): Bereichsauswahl im Multiplayer ausblenden
        if (scopeSelectionContainer) scopeSelectionContainer.style.display = 'none';

        if (hostInfoDiv) hostInfoDiv.classList.add('hidden');

        // NEU: Event, das dem Client mitteilt, dass er der Host ist und die IP-Infos anzeigt
        window.socket.on('bibleQuiz:youAreHost', (data) => {
            console.log('[Bibelquiz] Du bist der Host. Zeige Verbindungs-Infos an.');
            showHostInfo(data);
        });

        // NEU: Event, um den Status von anderen Spielern zu aktualisieren (z.B. wer getippt hat)
        window.socket.on('bibleQuiz:updatePlayerStatus', (updatedPlayers) => {
            players = updatedPlayers;
            // Hier könnte man die Spielerliste neu zeichnen, um z.B. anzuzeigen, wer getippt hat
            // oder wer die Verbindung verloren hat.
            console.log('Spielerstatus aktualisiert:', players);
            // Beispiel: Aktualisiere die Anzeige, wer getippt hat.
            // Dies ist eine fortgeschrittene Funktion, die eine entsprechende UI erfordert.
        });


        // Server startet eine neue Runde
        window.socket.on('bibleQuiz:newRound', async (data) => {
            // NEU: Warte, bis die Verse geladen sind, bevor die Runde verarbeitet wird.
            await versesLoadedPromise;

            // DEBUG: Bestätige, dass der Client das Event empfängt.
            console.log(`[DEBUG] Event 'bibleQuiz:newRound' vom Server empfangen. Wechsle zur Spielansicht.`);

            gameMode = 'multiplayer';
            window.showView('bible-quiz-view'); // Zeige die Spielansicht, wenn die Runde startet
            myPlayerId = window.socket.id;
            players = data.players;
            
            // Der Server sendet den Text, aber nicht die ID des Verses
            verseTextDisplay.textContent = data.verseText;
            currentVerse = null; // Wichtig: Der Client kennt die Lösung nicht

            clearCanvas();
            feedbackMessage.textContent = "";
            let statsHtml = '<strong>Gesamtpunktestand:</strong><br><ul>';
            Object.values(players).sort((a, b) => b.score - a.score).forEach(p => {
                statsHtml += `<li>${p.name}: ${p.score}</li>`;
            });
            statsHtml += '</ul>';
            statsDisplay.innerHTML = statsHtml;
            guessButton.disabled = false;
            newVerseButton.style.display = 'none'; // Im MP-Modus steuert der Server
            
            if (hostNextRoundButton) hostNextRoundButton.style.display = 'none';
            if (hostResetGameButton) hostResetGameButton.style.display = 'none';
            
            // NEU: Kontextansicht ausblenden, wenn eine neue Runde beginnt
            contextView.style.display = 'none';

            // KORREKTUR: Host-Info aus der Lobby ausblenden, wenn das Spiel startet
            if (hostInfoDiv) hostInfoDiv.classList.add('hidden');

            const universalStartButton = document.getElementById('start-game-button');
            if (universalStartButton) {
                universalStartButton.classList.add('hidden');
            }
            setInitialSelection();
         });

        // Server beendet die Runde und sendet Ergebnisse
        window.socket.on('bibleQuiz:roundEnd', async (data) => {
            // NEU: Warte, bis die Verse geladen sind, bevor die Ergebnisse verarbeitet werden.
            await versesLoadedPromise;

            const { results, actualVerse } = data;
            players = data.players; // Update player scores

            // Finde den eigenen Tipp heraus
            feedbackMessage.textContent = `Runde beendet! Richtige Antwort: ${actualVerse.book} ${actualVerse.chapter},${actualVerse.verse_num}`;
            drawAllGuesses(results, actualVerse);

            results.sort((a, b) => b.points - a.points);

            // Baue die Punktetabelle mit den Tipps aller Spieler
            let statsHtml = '<strong>Ergebnisse dieser Runde:</strong><br><ul>';
            results.forEach(result => {
                const player = players[result.playerId];
                const guessedVerse = allVerses.find(v => v.id === parseInt(result.guessId, 10));
                if (player && guessedVerse) {
                    statsHtml += `<li>${player.name}: ${guessedVerse.book} ${guessedVerse.chapter},${guessedVerse.verse_num} <strong>(+${result.points} Pkt.)</strong></li>`;
                }
            });
            statsHtml += '</ul><strong>Gesamtpunktestand:</strong><br><ul>';
            const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);
            sortedPlayers.forEach(p => {
                statsHtml += `<li>${p.name}: ${p.score}</li>`;
            });
            statsHtml += '</ul>'; // KORREKTUR: Diese Zeile muss außerhalb der Schleife stehen.
            statsDisplay.innerHTML = statsHtml;

            const isHost = players[myPlayerId] && players[myPlayerId].isHost;
            if (isHost) {
                if (hostNextRoundButton) hostNextRoundButton.style.display = 'block';
                if (hostResetGameButton) hostResetGameButton.style.display = 'block';
            }

        // KORREKTUR: Kontextansicht nach der Runde immer anzeigen
        showContextView(actualVerse.book, actualVerse.chapter, actualVerse.verse_num);
        });

        window.socket.on('bibleQuiz:invalidPassword', () => {
            alert('Falsches Host-Passwort!');
        });

        // NEU: Behandelt den Fall, dass ein Spieler die Verbindung wiederherstellt.
        // Der Server sendet den aktuellen Spielzustand.
        window.socket.on('bibleQuiz:reconnect', async (data) => {
            // NEU: Warte, bis die Verse geladen sind, bevor der Zustand wiederhergestellt wird.
            await versesLoadedPromise;

            console.log('[DEBUG] Event "bibleQuiz:reconnect" empfangen. Stelle Spielzustand wieder her.');
            gameMode = 'multiplayer';
            myPlayerId = window.socket.id;
            players = data.players;

            window.showView('bible-quiz-view');

            if (data.state === 'guessing') {
                // Die Raterunde läuft noch
                verseTextDisplay.textContent = data.verseText;
                guessButton.disabled = data.hasGuessed; // Deaktiviere Button, wenn schon getippt wurde
                feedbackMessage.textContent = data.hasGuessed ? "Dein Tipp wurde bereits gespeichert." : "Runde läuft. Mache einen Tipp!";
            } else if (data.state === 'endOfRound') {
                // Die Runde ist bereits vorbei, zeige die Ergebnisse an
                drawAllGuesses(data.results, data.actualVerse);
                feedbackMessage.textContent = `Runde beendet! Richtige Antwort: ${data.actualVerse.book} ${data.actualVerse.chapter},${data.actualVerse.verse_num}`;
            }
        });

        window.socket._hasBibleQuizListeners = true;
    }

    // Mache Funktionen global verfügbar, damit andere Skripte sie aufrufen können.
    window.setupBibleQuizMultiplayer = setupMultiplayerListeners;
    window.startBibleQuizSinglePlayer = startBibleQuizSinglePlayer;

    // Logik für Einzelspieler vs. Mehrspieler
    if (gameMode === 'singleplayer') {
        newVerseButton.style.display = 'inline-block';
        if (hostNextRoundButton) hostNextRoundButton.style.display = 'none';
        if (hostResetGameButton) hostResetGameButton.style.display = 'none';
    } else { // multiplayer
        newVerseButton.style.display = 'none';
        if (hostNextRoundButton) hostNextRoundButton.style.display = 'none';
        if (hostResetGameButton) hostResetGameButton.style.display = 'none';
    }

    // Lade beide Datensätze parallel
    const [versesSuccess, headingsSuccess, summariesSuccess, mcQuestionsSuccess] = await Promise.all([
        loadAndParseVerses(),
        loadAndParseHeadings(),
        loadAndParseSummaries(), // NEU: Lade auch die Zusammenfassungen
        loadAndParseMcQuestions() // NEU: Lade die Multiple-Choice-Fragen

    ]);

    if (versesSuccess) {
        // Starte den Einzelspielermodus standardmäßig, wenn die Verse geladen sind.
        // Dies wird von client.js überschrieben, wenn der Multiplayer-Modus gewählt wird.
        startBibleQuizSinglePlayer(); // KORREKTUR: Starte das Spiel erst, nachdem alle Daten erfolgreich geladen wurden.
    } else {
        verseTextDisplay.textContent = "Fehler: Die Bibelverse konnten nicht geladen werden. Das Spiel kann nicht gestartet werden.";
    }

    // KORREKTUR: Event-Listener für das Popup muss außerhalb der if-Bedingung sein,
    // da er auch im Lesemodus funktionieren muss.
    // Der Event-Listener wird an ein übergeordnetes, immer vorhandenes Element gehängt.
    document.getElementById('bible-quiz-view').addEventListener('click', (e) => { // KORREKTUR: Ein einziger Event-Listener für die gesamte Ansicht
        // --- Event-Handler für manuelle Querverweis-Links ---
        const manualLink = e.target.closest('a.manual-cross-ref-link');
        const identicalLink = e.target.closest('a.identical-verse-link');
        if (!manualLink && !identicalLink) return;

        e.preventDefault();
        let verseIds = [];
        let popupTitle = '';

        // Entferne existierende Popups
        const existingPopup = document.querySelector('.cross-ref-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        // Erstelle das Popup
        const popup = document.createElement('div');
        popup.className = 'cross-ref-popup';

        if (manualLink) {
            const refId = manualLink.dataset.refId;
            verseIds = manualCrossReferenceMap[refId] || [];
            const displayRefId = refId.split('-').pop();
            popupTitle = `Manuelle Querverweise für [§${displayRefId}]`;
        } else if (identicalLink) {
            const textKey = identicalLink.dataset.textKey;
            verseIds = identicalVerseMap[textKey] || [];
            popupTitle = `Identische Verse`;
        }

        if (verseIds.length > 1) {
            let listHtml = `<h4>${popupTitle}</h4><ul>`;
            verseIds.forEach(id => {
                const verse = allVerses.find(v => v.id === id);
                if (verse) {
                    // Markiere den aktuellen Vers, falls er in der Liste ist
                    const isCurrent = currentVerse && currentVerse.id === id;
                    listHtml += `<li class="${isCurrent ? 'current' : ''}"><a href="#" class="popup-verse-link" data-book="${verse.book}" data-chapter="${verse.chapter}" data-verse="${verse.verse_num}">${verse.book} ${verse.chapter},${verse.verse_num}</a></li>`;
                }
            });
            listHtml += '</ul>';
            popup.innerHTML = listHtml;
        } else {
            popup.innerHTML = '<h4>Keine weiteren Querverweise gefunden.</h4>';
        }

        document.body.appendChild(popup);

        // Positioniere das Popup neben dem geklickten Link
        const rect = (manualLink || identicalLink).getBoundingClientRect();
        popup.style.left = `${window.scrollX + rect.left}px`;
        popup.style.top = `${window.scrollY + rect.bottom + 5}px`;

        // Klick-Handler für die Links im Popup
        popup.addEventListener('click', (popupEvent) => {
            const verseLink = popupEvent.target.closest('a.popup-verse-link');
            if (verseLink) {
                popupEvent.preventDefault();
                setQuizModeUI('readMode'); // Wechsle in den Lesemodus
                displayReadingChapter(verseLink.dataset.book, verseLink.dataset.chapter);
                setTimeout(() => highlightAndScrollToVerse(verseLink.dataset.verse), 100);
            }
            popup.remove(); // Schließe das Popup nach dem Klick
        });
        // Ende des Querverweis-Handlers
    });
});