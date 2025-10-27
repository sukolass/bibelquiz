// search-worker.js

self.onmessage = function(e) {
    const { results, searchTerm, usePartialSearch, searchMode, bookChapterStructure } = e.data;

    // Erstelle die Regexes für die Zählung
    const regexes = Array.isArray(searchTerm) ? searchTerm.map(term => {
        const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        return usePartialSearch ? new RegExp(escapedTerm, 'gi') : new RegExp(`\\b${escapedTerm}\\b`, 'gi');
    }) : [usePartialSearch ? new RegExp(searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi') : new RegExp(`\\b${searchTerm}\\b`, 'gi')];

    const bookCounts = {};
    const chapterCounts = {};
    const verseCounts = {};
    // NEU: Detaillierte Zähler für UND-Suche
    const bookDetailCounts = {};
    const chapterDetailCounts = {};
    const verseDetailCounts = {};

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
            matches = regexes.reduce((total, regex) => total + (verse.text.match(regex) || []).length, 0);
        }

        if (matches > 0) {
            bookCounts[book] = (bookCounts[book] || 0) + matches;
            chapterCounts[chapterRef] = (chapterCounts[chapterRef] || 0) + matches;
            verseCounts[verseRef] = (verseCounts[verseRef] || 0) + matches;
        }
    });

    // Sortiere die Ergebnisse
    const sortedBooks = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]);
    const sortedChapters = Object.entries(chapterCounts).sort((a, b) => b[1] - a[1]);
    const sortedVerses = Object.entries(verseCounts).sort((a, b) => b[1] - a[1]);

    // NEU: Sortiere auch die komplette Ergebnisliste kanonisch
    const canonicalBookOrder = bookChapterStructure.map(b => b.book);
    results.sort((a, b) => {
        const bookIndexA = canonicalBookOrder.indexOf(a.book);
        const bookIndexB = canonicalBookOrder.indexOf(b.book);
        if (bookIndexA !== bookIndexB) return (bookIndexA === -1 ? Infinity : bookIndexA) - (bookIndexB === -1 ? Infinity : bookIndexB);
        if (a.chapter !== b.chapter) return a.chapter - b.chapter;
        return a.verse_num - b.verse_num;
    });

    // Sende die fertigen Daten zurück an den Hauptthread
    self.postMessage({
        sortedBooks,
        sortedChapters,
        sortedVerses,
        sortedResults: results, // NEU: Sende die sortierten Ergebnisse zurück
        // NEU: Sende die Detail-Counts zurück, falls es eine UND-Suche war
        detailCounts: searchMode === 'AND' ? {
            book: bookDetailCounts,
            chapter: chapterDetailCounts,
            verse: verseDetailCounts
        } : null
    });
};
