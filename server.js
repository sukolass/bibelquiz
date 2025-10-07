const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const os = require('os'); // NEU: Wird benötigt, um Netzwerk-Interfaces abzufragen

const app = express();
const server = http.createServer(app); 
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const HOST_PASSWORD = "4505"; // Ändere dies für dein Spiel

// --- Statische Dateien bereitstellen ---
app.use(express.static(path.join(__dirname)));

// --- Spielstatus ---
let players = {};
let allVerses = [];
let gameState = {
    state: 'lobby', // lobby, guessing, endOfRound
    currentVerse: null,
    roundResults: [],
};

// --- Hilfsfunktionen ---
function loadVerses() {
    try {
        const filePath = path.join(__dirname, 'verse.txt');
        const text = fs.readFileSync(filePath, 'utf-8');
        const lines = text.split(/\r?\n/);

        allVerses = lines.map(line => {
            if (!line.trim()) return null;
            const parts = line.split(';', 5);
            if (parts.length < 5) return null;

            const id = parseInt(parts[0], 10);
            const book = parts[1].trim();
            const chapter = parseInt(parts[2], 10);
            const verse_num = parseInt(parts[3], 10);
            const verseText = parts[4].trim();

            if (isNaN(id) || !book || isNaN(chapter) || isNaN(verse_num) || !verseText) return null;

            return { id, book, chapter, verse_num, text: verseText };
        }).filter(Boolean);

        console.log(`${allVerses.length} Verse erfolgreich geladen.`);
    } catch (error) {
        console.error("FATAL: Konnte 'verse.txt' nicht laden. Der Server kann nicht starten.", error);
        process.exit(1);
    }
}

// NEU: Funktion zum Ermitteln der lokalen IP-Adressen
function getLocalIpAddresses() {
    const networkInterfaces = os.networkInterfaces();
    const addresses = [];
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            // Nur IPv4 und keine internen Adressen (wie 127.0.0.1)
            const isIPv4 = net.family === 'IPv4';
            const isNotInternal = !net.internal;
            // KORREKTUR: Filtere gängige IP-Bereiche von virtuellen Adaptern (Docker, WSL, etc.) heraus.
            // Diese beginnen oft mit 172.16.x.x bis 172.31.x.x.
            // Wir lassen 192.168.x.x und 10.x.x.x durch, die für Heimnetzwerke üblich sind.
            const isLikelyVirtual = net.address.startsWith('172.');

            if (isIPv4 && isNotInternal && !isLikelyVirtual) {
                 addresses.push(net.address);
            }
        }
    }
    return addresses;
}

function updatePlayerList() {
    io.emit('updateLobby', { players });
}

function assignNewHost() {
    const playerIds = Object.keys(players);
    if (playerIds.length > 0) {
        const newHostId = playerIds[0];
        players[newHostId].isHost = true;
        console.log(`Neuer Host zugewiesen: ${players[newHostId].name}`);

        // NEU: Dem neuen Host seine IP-Adressen mitteilen
        const newHostSocket = io.sockets.sockets.get(newHostId);
        if (newHostSocket) {
            // KORREKTUR: Sende die Info nicht mehr automatisch, warte auf Anfrage vom Client.
            // newHostSocket.emit('bibleQuiz:youAreHost', { addresses: getLocalIpAddresses(), port: PORT });
        }
        updatePlayerList();
    }
}

function calculatePoints(guessedVerse, actualVerse) {
    const distance = Math.abs(actualVerse.id - guessedVerse.id);
    const totalVerses = allVerses.length;

    if (distance === 0) return 100;

    const percentageError = distance / totalVerses;
    let distancePoints = Math.round(50 * (1 - Math.sqrt(percentageError)));
    if (distancePoints < 0) distancePoints = 0;

    let contextPoints = 0;
    // Die Testament-Logik aus bibelquiz.js ist hier nicht direkt verfügbar,
    // wir vereinfachen die Punktevergabe serverseitig.
    if (guessedVerse.book === actualVerse.book) {
        contextPoints += 25; // Vereinfacht: 25 Punkte für das richtige Buch
        if (guessedVerse.chapter === actualVerse.chapter) {
            contextPoints += 25; // Weitere 25 für das richtige Kapitel
        }
    }
    return distancePoints + contextPoints;
}

function endRound() {
    console.log("Runde wird beendet. Berechne Ergebnisse.");
    gameState.state = 'endOfRound';

    gameState.roundResults.forEach(result => {
        const guessedVerse = allVerses.find(v => v.id === result.guessId);
        if (guessedVerse) {
            result.points = calculatePoints(guessedVerse, gameState.currentVerse);
            players[result.playerId].score += result.points;
        }
    });

    io.emit('bibleQuiz:roundEnd', {
        results: gameState.roundResults,
        actualVerse: gameState.currentVerse,
        players: players
    });
}

function startNewRound() {
    console.log("Neue Runde wird gestartet.");
    gameState.state = 'guessing';
    gameState.currentVerse = allVerses[Math.floor(Math.random() * allVerses.length)];
    gameState.roundResults = [];

    // Setze den "hasGuessed"-Status für alle Spieler zurück
    Object.values(players).forEach(p => p.hasGuessed = false);

    io.emit('bibleQuiz:newRound', {
        verseText: gameState.currentVerse.text,
        players: players
    });
}


// --- Socket.IO Verbindungshandler ---
io.on('connection', (socket) => {
    console.log(`Ein Benutzer hat sich verbunden: ${socket.id}`);

    socket.on('login', ({ name }) => {
        players[socket.id] = {
            id: socket.id,
            name: name || `Spieler_${socket.id.substring(0, 4)}`,
            score: 0,
            isHost: Object.keys(players).length === 0,
            hasGuessed: false,
        };
        console.log(`Spieler ${players[socket.id].name} ist beigetreten.`);
        socket.emit('loginSuccess', { id: socket.id, players });

        updatePlayerList();
    });

    socket.on('bibleQuiz:clientReady', () => {
        // Wenn ein Spieler (wieder)verbindet, sende ihm den aktuellen Zustand
        if (gameState.state === 'lobby') {
            updatePlayerList();
        } else {
            console.log(`Sende Reconnect-Daten an ${players[socket.id]?.name}`);
            socket.emit('bibleQuiz:reconnect', {
                state: gameState.state,
                verseText: gameState.currentVerse?.text,
                actualVerse: gameState.state === 'endOfRound' ? gameState.currentVerse : null,
                results: gameState.state === 'endOfRound' ? gameState.roundResults : [],
                players: players,
                hasGuessed: players[socket.id]?.hasGuessed || false,
            });
        }
    });

    // NEU: Client ist bereit und fordert Host-Infos an (falls er der Host ist)
    socket.on('client:readyForHostInfo', () => {
        const player = players[socket.id];
        if (player && player.isHost) {
            console.log(`Sende Host-Infos an ${player.name} auf Anfrage.`);
            socket.emit('bibleQuiz:youAreHost', { addresses: getLocalIpAddresses(), port: PORT });
        }
    });

    socket.on('bibleQuiz:startGame', () => {
        if (players[socket.id] && players[socket.id].isHost) {
            startNewRound();
        }
    });

    socket.on('bibleQuiz:nextRound', () => {
        if (players[socket.id] && players[socket.id].isHost) {
            startNewRound();
        }
    });

    socket.on('bibleQuiz:resetGame', ({ password }) => {
        if (password !== HOST_PASSWORD) {
            socket.emit('bibleQuiz:invalidPassword');
            return;
        }
        if (!players[socket.id] || !players[socket.id].isHost) {
            // Optional: Informiere den Client, dass er kein Host ist.
            return;
        }
        console.log("Spiel wird vom Host zurückgesetzt.");
        Object.values(players).forEach(p => p.score = 0);
        startNewRound();
    });

    socket.on('bibleQuiz:submitGuess', ({ guessId }) => {
        if (gameState.state !== 'guessing' || !players[socket.id] || players[socket.id].hasGuessed) {
            return; // Tipp ignorieren
        }
        console.log(`Tipp von ${players[socket.id].name} erhalten: ${guessId}`);
        players[socket.id].hasGuessed = true;
        gameState.roundResults.push({ playerId: socket.id, guessId: guessId, points: 0 });

        // Informiere alle, dass ein Spieler getippt hat (optional)
        io.emit('bibleQuiz:updatePlayerStatus', players);

        // Prüfen, ob alle getippt haben
        const allGuessed = Object.values(players).every(p => p.hasGuessed);
        if (allGuessed) {
            endRound();
        }
    });

    socket.on('disconnect', () => {
        const player = players[socket.id];
        if (player) {
            console.log(`Spieler ${player.name} hat die Verbindung getrennt.`);
            const wasHost = player.isHost;
            delete players[socket.id];

            if (wasHost) {
                console.log("Der Host hat die Verbindung getrennt. Wähle neuen Host.");
                assignNewHost();
            }

            // Wenn ein Spieler geht und danach alle verbleibenden getippt haben, Runde beenden.
            if (gameState.state === 'guessing' && Object.values(players).length > 0 && Object.values(players).every(p => p.hasGuessed)) {
                endRound();
            }
        } else {
            console.log(`Ein anonymer Benutzer hat die Verbindung getrennt: ${socket.id}`);
        }
    });
});

// --- Serverstart ---
server.listen(PORT, '0.0.0.0', () => { // KORREKTUR: Auf 0.0.0.0 lauschen, um Verbindungen im LAN zu erlauben
    console.log(`Bibelquiz-Server läuft auf Port ${PORT}`);
    loadVerses();
    const addresses = getLocalIpAddresses();
    if (addresses.length > 0) {
        console.log('================================================================');
        console.log('SPIELER IM LOKALEN NETZWERK (WLAN/Hotspot) KÖNNEN SICH VERBINDEN ÜBER:');
        addresses.forEach(addr => {
            console.log(`http://${addr}:${PORT}`);
        });
        console.log('================================================================');
    }
});