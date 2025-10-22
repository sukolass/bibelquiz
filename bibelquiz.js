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
        // NEU: Elemente für den Lese-Modus
        const readingOptionsContainer = document.getElementById('reading-options-container');
        const showSummariesCheckbox = document.getElementById('show-summaries-checkbox');
        const summaryPositionOptions = document.getElementById('summary-position-options');
        const readingNavTop = document.getElementById('reading-nav-top');
        const readingNavBottom = document.getElementById('reading-nav-bottom');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
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
        const showContextButton = document.getElementById('show-context-button');
        const contextView = document.getElementById('context-view');
        const contextTitle = document.getElementById('context-title');
        const contextText = document.getElementById('context-text');
        const contextSummary = document.getElementById('context-summary'); // NEU
        const prevChapterButtons = document.querySelectorAll('.prev-chapter-button'); // NEU
        const nextChapterButtons = document.querySelectorAll('.next-chapter-button'); // NEU
        const closeContextButton = document.getElementById('close-context-button');

    // --- Bibelquiz State ---
    let allVerses = [];
    let allHeadings = []; // NEU (Kapitel-Quiz): Array für die Kapitelüberschriften
    let allSummaries = []; // NEU (Zusammenfassungs-Quiz): Array für die Kapitelzusammenfassungen
    let currentVerse = null;
    let currentChapterHeadings = null; // NEU (Kapitel-Quiz): Das zu erratende Kapitel
    let currentSummary = null; // NEU (Zusammenfassungs-Quiz): Die zu erratende Zusammenfassung
    let gameMode = 'singleplayer'; // 'singleplayer' oder 'multiplayer'
    let quizMode = 'guessVerse'; // 'guessVerse', 'guessChapter' oder 'guessSummary'
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
    // NEU: Promise, das signalisiert, wann die Verse fertig geladen und verarbeitet sind.
    let versesLoadedPromise;

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
        "Philemon", "Hebräer", "Jakobus", "1. Petrus", "2. Petrus", "1. Johannes",
        "2. Johannes", "3. Johannes", "Judas", "Offenbarung"
    ];

    // DEBUG: Überprüfen, ob alle kritischen Elemente gefunden wurden
    if (!bibleQuizView || !bookSelect || !positionSlider || !ctx || !contextView || !showContextButton || !hostInfoDiv || !gameModeSelection || !scopeSelectionContainer || !quizInputColumn || !contextSummary || !searchInput) {
        console.error('[FATAL] Ein oder mehrere kritische Bibelquiz-Elemente wurden im HTML nicht gefunden. Skript wird angehalten.');
        return;
    }

    // ---------------------------------------------------------------------------------
    // --- 2. Funktionsdefinitionen ---
    // ---------------------------------------------------------------------------------
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
                const parts = line.split(';', 5);
                if (parts.length < 5) {
                    console.warn(`[Bibelquiz] Zeile übersprungen (zu wenige Teile): "${line}"`);
                    return null;
                }

                const id = parseInt(parts[0], 10);
                const book = parts[1].trim();
                const chapter = parseInt(parts[2], 10);
                const verse_num = parseInt(parts[3], 10);
                const verseText = parts[4].trim();

                if (isNaN(id) || !book || isNaN(chapter) || isNaN(verse_num) || !verseText) {
                    console.warn(`[Bibelquiz] Zeile übersprungen (ungültige Daten): "${line}"`);
                    return null;
                }

                return {
                    id, book, chapter, verse_num, text: verseText,
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
                const canonicalOrder = [...new Set(allVerses.map(v => v.book))];
                books.sort((a, b) => canonicalOrder.indexOf(a) - canonicalOrder.indexOf(b));

                bookChapterStructure = books.map(book => {
                    const chapters = [...new Set(allVerses.filter(v => v.book === book).map(v => v.chapter))].sort((a, b) => a - b);
                    return {
                        // NEU: Testament-Info hinzufügen
                        testament: allVerses.find(v => v.book === book).testament,
                        book: book,
                        chapters: chapters
                    };
                });
                console.log('[Bibelquiz] Buch-Kapitel-Struktur für Kontextnavigation erstellt.');

                resolveVersesLoaded(true); // Signalisiere, dass das Laden erfolgreich war.

                // NEU: Fülle die dynamischen Buchgruppen
                BOOK_GROUPS.AT = bookChapterStructure.filter(b => b.testament === 'AT').map(b => b.book);
                BOOK_GROUPS.NT = bookChapterStructure.filter(b => b.testament === 'NT').map(b => b.book);
                BOOK_GROUPS.PROPHETS = [...BOOK_GROUPS.MAJOR_PROPHETS, ...BOOK_GROUPS.MINOR_PROPHETS];
                populateScopeBookList(); // Fülle die UI für die Bereichsauswahl

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
        if (quizMode === 'guessVerse') {
            displayNewVerse();
        } else if (quizMode === 'guessChapter') {
            displayNewChapterHeadings();
        } else if (quizMode === 'guessSummary') {
            displayNewSummary();
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

        currentSummary = summaryPool[Math.floor(Math.random() * summaryPool.length)];
        currentVerse = null;
        currentChapterHeadings = null;

        verseTextDisplay.innerHTML = `<h3>Welches Kapitel wird hier zusammengefasst?</h3><p>${currentSummary.summary}</p>`;

        feedbackMessage.textContent = "";
        feedbackMessage.className = "";
        statsDisplay.textContent = "Mache einen Tipp, um die Entfernung zu sehen.";
        guessButton.disabled = false;
        clearCanvas();
        contextView.style.display = 'none';
        setInitialSelection();
    }

    function displayNewChapterHeadings() {
        let chapterPool = filterPoolByScope(allHeadings);

        if (chapterPool.length === 0) {
            if (customScope.active) {
                verseTextDisplay.textContent = `Für den ausgewählten Bereich wurden keine Überschriften gefunden. Bitte passe deine Auswahl an.`;
            } else {
                verseTextDisplay.textContent = 'Keine Kapitel-Überschriften geladen. Bitte erstelle eine "headings.txt".';
            }
            verseTextDisplay.textContent = 'Keine Kapitel-Überschriften geladen. Bitte erstelle eine "headings.txt".';
            return;
        }

        // Wähle ein zufälliges Kapitel aus dem (gefilterten) Pool
        currentChapterHeadings = chapterPool[Math.floor(Math.random() * chapterPool.length)];


        currentVerse = null; // Sicherstellen, dass der alte Zustand gelöscht ist
        currentSummary = null;

        // Formatiere die Überschriften als Liste
        let headingsHtml = "<h3>Welches Kapitel hat diese Überschriften?</h3><ul>";
        currentChapterHeadings.headings.forEach(h => { headingsHtml += `<li>${h}</li>`; });
        headingsHtml += "</ul>";
        verseTextDisplay.innerHTML = headingsHtml;

        feedbackMessage.textContent = "";
        feedbackMessage.className = "";
        statsDisplay.textContent = "Mache einen Tipp, um die Entfernung zu sehen.";
        guessButton.disabled = false;
        clearCanvas();
        
        // NEU: Kontextansicht ausblenden, wenn eine neue Runde beginnt
        contextView.style.display = 'none';

        // Setze die Auswahl-UI auf den Standardwert zurück
        setInitialSelection();
    }

    function displayNewVerse() {
        let versePool = filterPoolByScope(allVerses);

        if (versePool.length === 0) return;

        // Wähle einen zufälligen Vers aus dem (gefilterten) Pool
        currentVerse = versePool[Math.floor(Math.random() * versePool.length)];
        currentChapterHeadings = null; // Sicherstellen, dass der alte Zustand gelöscht ist
        currentSummary = null;
        verseTextDisplay.textContent = currentVerse.text;

        feedbackMessage.textContent = "";
        feedbackMessage.className = "";
        statsDisplay.textContent = "Mache einen Tipp, um die Entfernung zu sehen.";
        guessButton.disabled = false;
        clearCanvas();
        
        contextView.style.display = 'none';

        setInitialSelection();
    }

    // NEU: Funktion für den Lese-Modus
    function displayReadingChapter(book, chapter) {
        if (!book || !chapter) {
            const firstBook = bookChapterStructure[0];
            book = firstBook.book;
            chapter = firstBook.chapters[0];
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
        chapterVerses.forEach(verse => {
            verseHtml += `<p><sup>${verse.verse_num}</sup> ${verse.text}</p>`;
        });

        if (summaryPosition === 'above') {
            chapterHtml = `<div id="reading-content-wrapper" class="above-summary">${summaryHtml}${verseHtml}</div>`;
        } else if (summaryPosition === 'left') {
            chapterHtml = `<div id="reading-content-wrapper" class="left-summary">${summaryHtml}<div class="chapter-text">${verseHtml}</div></div>`;
        } else { // right
            chapterHtml = `<div id="reading-content-wrapper" class="right-summary">${summaryHtml}<div class="chapter-text">${verseHtml}</div></div>`;
        }

        verseTextDisplay.innerHTML = chapterHtml;

        updateContextNavButtons(); // Aktualisiert die Navigations-Buttons
    }

    // NEU: Funktion zur Durchführung der Suche
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length < 2) {
            alert("Bitte gib mindestens 2 Zeichen für die Suche ein.");
            return;
        }

        const results = allVerses.filter(verse => 
            verse.text.toLowerCase().includes(searchTerm.toLowerCase())
        );

        displaySearchResults(results, searchTerm);
    }

    // NEU: Funktion zur Anzeige der Suchergebnisse
    function displaySearchResults(results, searchTerm) {
        let resultsHtml = `<h3>Suchergebnisse für "${searchTerm}" (${results.length} Treffer)</h3>`;
        if (results.length === 0) {
            resultsHtml += "<p>Keine Treffer gefunden.</p>";
        } else {
            // Erstelle einen regulären Ausdruck, um den Suchbegriff (case-insensitive) zu finden
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            results.forEach(verse => {
                // Ersetze den Suchbegriff durch eine hervorgehobene Version
                const highlightedText = verse.text.replace(regex, '<span class="highlight">$1</span>');
                resultsHtml += `
                    <div class="search-result-item" data-book="${verse.book}" data-chapter="${verse.chapter}">
                        <span class="ref">${verse.book} ${verse.chapter},${verse.verse_num}</span>
                        <span class="text">${highlightedText}</span>
                    </div>
                `;
            });
        }
        verseTextDisplay.innerHTML = resultsHtml;
        
        // UI-Anpassungen für die Suchergebnisansicht
        readingNavTop.style.display = 'none';
        readingNavBottom.style.display = 'none';
        document.querySelector('.quiz-input-column').style.display = 'none'; // Linke Spalte ausblenden
        clearSearchButton.style.display = 'inline-block';
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
                    const bookIsCorrect = guessedInfo.book === actual.book;
                    if (bookIsCorrect && !customScope.active) {
                        points += 40; // Basispunkte für das richtige Buch
                    }

                    if (bookIsCorrect) {
                        const chapterDistance = Math.abs(guessedInfo.chapter - actual.chapter);
                        const maxDistance = bookChapterStructure.find(b => b.book === actual.book).chapters.length;
                        // Punkte basierend auf der Nähe, max. 50
                        let proximityPoints = Math.round(50 * (1 - (chapterDistance / maxDistance)));
                        if (proximityPoints < 0) proximityPoints = 0;
                        points += proximityPoints;
                    }
                    feedbackText = `Dein Tipp: ${guessedInfo.book} ${guessedInfo.chapter}. Punkte: ${Math.round(points)}.`;
                }
                statsDisplay.textContent = feedbackText;
                
                // Zeige den Kontext des richtigen Kapitels an
                showContextView(actual.book, actual.chapter);
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
                    const bookIsCorrect = guessedInfo.book === actual.book;
                    if (bookIsCorrect && !customScope.active) {
                        points += 40; // Basispunkte für das richtige Buch
                    }

                    if (bookIsCorrect) {
                        const chapterDistance = Math.abs(guessedInfo.chapter - actual.chapter);
                        const maxDistance = bookChapterStructure.find(b => b.book === actual.book).chapters.length;
                        let proximityPoints = Math.round(50 * (1 - (chapterDistance / maxDistance)));
                        if (proximityPoints < 0) proximityPoints = 0;
                        points += proximityPoints;
                    }
                    feedbackText = `Dein Tipp: ${guessedInfo.book} ${guessedInfo.chapter}. Punkte: ${Math.round(points)}.`;
                }
                statsDisplay.textContent = feedbackText;
                showContextView(actual.book, actual.chapter);
                clearCanvas();
            }

            guessButton.disabled = true;
        } else {
            // Im Mehrspielermodus den Tipp an den Server senden
            window.socket.emit('bibleQuiz:submitGuess', { guessId: guessedId });
            feedbackMessage.textContent = "Dein Tipp wurde gespeichert. Warte auf die anderen Spieler...";
            feedbackMessage.className = "";
            guessButton.disabled = true;
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
        // NEU: Im Lese-Modus wird das Dropdown nicht durch das Testament eingeschränkt
        if (quizMode === 'readMode') {
            return; // Die Buchliste ist bereits vollständig
        }
        const selectedTestament = document.querySelector('input[name="testament"]:checked').value;
        const books = [...new Set(allVerses.filter(v => v.testament === selectedTestament).map(v => v.book))];
        const canonicalOrder = [...new Set(allVerses.map(v => v.book))];
        books.sort((a, b) => canonicalOrder.indexOf(a) - canonicalOrder.indexOf(b));
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
        bibleQuizView.style.maxWidth = isQuizActive ? '900px' : '1200px';

        // Quiz-spezifische Elemente
        quizInputColumn.style.display = isQuizActive ? 'flex' : 'none'; // NEU
        document.getElementById('guess-controls').style.display = isQuizActive ? 'block' : 'none';
        document.getElementById('guess-button').style.display = isQuizActive ? 'inline-block' : 'none';
        document.getElementById('new-verse-button').style.display = isQuizActive ? 'inline-block' : 'none';
        document.getElementById('feedback-section').style.display = isQuizActive ? 'block' : 'none';
        document.getElementById('show-context-button').style.display = isQuizActive ? 'inline-block' : 'none';
        document.getElementById('verse-display-legend').textContent = isQuizActive ? 'Zu erratende Aufgabe' : 'Lese-Ansicht';

        // Lese-Modus-spezifische Elemente
        readingOptionsContainer.style.display = isQuizActive ? 'none' : 'block';
        summaryPositionOptions.style.display = (isQuizActive || !showSummariesCheckbox.checked) ? 'none' : 'block';
        readingNavTop.style.display = isQuizActive ? 'none' : 'block';
        readingNavBottom.style.display = isQuizActive ? 'none' : 'block';
        readingNavTop.style.display = isQuizActive ? 'none' : 'block';
        readingNavBottom.style.display = isQuizActive ? 'none' : 'block';

        if (isQuizActive) {
            const isVerseMode = mode === 'guessVerse';
            document.getElementById('verse-select-container').style.display = isVerseMode ? 'block' : 'none';
            document.getElementById('verse-slider-wrapper').style.display = isVerseMode ? 'block' : 'none';
            document.getElementById('position-controls').style.display = isVerseMode ? 'block' : 'none';
        } else {
            // Setup für den Lese-Modus
            populateSelect(bookSelect, bookChapterStructure.map(b => b.book), "Buch");
            updateChapterDropdown();
            displayReadingChapter();
        }

        // Steuerelemente für die Vers-Auswahl (nur im Vers-Modus sichtbar)
        // document.getElementById('verse-select-container').style.display = isVerseMode ? 'block' : 'none';
        // document.getElementById('verse-slider-wrapper').style.display = isVerseMode ? 'block' : 'none';
        // document.getElementById('position-controls').style.display = isVerseMode ? 'block' : 'none';
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
        const booksToSelect = BOOK_GROUPS[groupName] || [];
        const allCheckboxes = scopeBookList.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(cb => {
            cb.checked = booksToSelect.includes(cb.value);
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

    function applyCustomScope() {
        const selectedCheckboxes = scopeBookList.querySelectorAll('input[type="checkbox"]:checked');
        const selectedBooks = Array.from(selectedCheckboxes)
            .filter(cb => !cb.classList.contains('chapter-checkbox')) // Nur Buch-Checkboxes
            .map(cb => cb.value);

        customScope.chapters = {};
        selectedBooks.forEach(book => {
            const chapterCheckboxes = scopeBookList.querySelectorAll(`.chapter-checkbox[data-book="${book}"]:checked`);
            customScope.chapters[book] = Array.from(chapterCheckboxes).map(cb => parseInt(cb.value, 10));
        });

        if (selectedBooks.length > 0) {
            customScope.active = true;
            customScope.books = Object.keys(customScope.chapters); // Aktualisiere die Buchliste
            openScopeModalButton.classList.add('active');
            openScopeModalButton.textContent = `Bereich aktiv (${selectedBooks.length} Bücher)`;
        } else {
            customScope.active = false;
            customScope.books = [];
            customScope.chapters = {};
            openScopeModalButton.classList.remove('active');
            openScopeModalButton.textContent = 'Bereich auswählen';
        }
        console.log('[Bereichsauswahl] Neuer Bereich angewendet:', customScope);
        scopeModal.style.display = 'none';
        startNewRound();
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
    closeScopeModalButton.addEventListener('click', () => scopeModal.style.display = 'none');
    applyScopeButton.addEventListener('click', applyCustomScope);
    scopeBookList.addEventListener('click', (e) => {
        if (e.target.classList.contains('chapter-toggle-button')) {
            const bookName = e.target.dataset.book;
            const chapterList = document.getElementById(`chapters-for-${bookName.replace(/\s/g, '-')}`);
            const isVisible = chapterList.style.display === 'block';
            chapterList.style.display = isVisible ? 'none' : 'block';
            e.target.classList.toggle('open', !isVisible);
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
    });

    // NEU: Event-Listener für den Lese-Modus
    showSummariesCheckbox.addEventListener('change', () => {
        summaryPositionOptions.style.display = showSummariesCheckbox.checked ? 'block' : 'none';
        displayReadingChapter(currentContext.book, currentContext.chapter);
    });
    summaryPositionOptions.addEventListener('change', () => {
        displayReadingChapter(currentContext.book, currentContext.chapter);
    });
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchButton.style.display = 'none';
        setQuizModeUI('readMode'); // Setzt die Leseansicht zurück
    });

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
        if (searchItem) {
            displayReadingChapter(searchItem.dataset.book, searchItem.dataset.chapter);
        }
    });
    // --- 5. Event Listeners --- 
    testamentRadios.forEach(radio => radio.addEventListener('change', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Testament radio changed to ${radio.value}`);
        if (isUpdating) return;
        isUpdating = true;
        updateBookDropdown();
        // Setze die Auswahl explizit auf den Anfang des Testaments zurück.
        selectFirstAvailableOption(bookSelect);
        updateChapterDropdown();
        selectFirstAvailableOption(chapterSelect);
        updateVerseDropdown();
        selectFirstAvailableOption(verseSelect);
        isUpdating = false;
        // KORREKTUR: Nach der Aktualisierung der Dropdowns muss die Position synchronisiert werden.
        syncSelectionToPosition();
    }));

    bookSelect.addEventListener('change', () => {
        if (DEBUG_SYNC) console.log(`[SyncDebug] Event: Book select changed to ${bookSelect.value}`);
        if (isUpdating) return;
        isUpdating = true;
        updateChapterDropdown();
        if (quizMode === 'readMode') {
            displayReadingChapter(bookSelect.value, chapterSelect.value);
        } else {
            selectFirstAvailableOption(chapterSelect); // Wähle erstes Kapitel
            updateVerseDropdown();
            selectFirstAvailableOption(verseSelect); // Wähle ersten Vers
            syncSelectionToPosition();
        }
        isUpdating = false;
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
        syncSelectionToPosition();
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

    verseSlider.addEventListener('input', () => {
        if (isUpdating) return;
        verseSelect.selectedIndex = verseSlider.value;
        updateSliderOutput(verseSlider, verseSliderOutput);
        verseSelect.dispatchEvent(new Event('change'));
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
        // Starte direkt eine neue Runde im gewählten Modus
        startNewRound();
    }));

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
        setQuizModeUI(document.querySelector('input[name="game-mode"]:checked').value);
        startNewRound();
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
    const [versesSuccess, headingsSuccess] = await Promise.all([
        loadAndParseVerses(),
        loadAndParseHeadings(),
        loadAndParseSummaries() // NEU: Lade auch die Zusammenfassungen
    ]);

    if (versesSuccess) {
        // Starte den Einzelspielermodus standardmäßig, wenn die Verse geladen sind.
        // Dies wird von client.js überschrieben, wenn der Multiplayer-Modus gewählt wird.
        // KORREKTUR: Das 'clientIsReady' Event wird jetzt in client.js gesendet,
        // um die Logik sauber zu trennen. Hier wird nur noch der Standardmodus gestartet.
        startBibleQuizSinglePlayer();
    } else {
        verseTextDisplay.textContent = "Fehler: Die Bibelverse konnten nicht geladen werden. Das Spiel kann nicht gestartet werden.";
    }
});