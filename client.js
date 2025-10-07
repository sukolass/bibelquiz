document.addEventListener('DOMContentLoaded', () => {
    // KORREKTUR: Deklariere socket hier, damit es im ganzen Scope verfügbar ist.
    let socket;

    // KORREKTUR: Fange Fehler ab, falls socket.io nicht geladen werden kann (z.B. auf GitHub Pages)
    try {
        socket = io();
        window.socket = socket; // Mache den Socket global verfügbar für bibelquiz.js
    } catch (e) {
        console.warn("Socket.io konnte nicht initialisiert werden. Starte im Einzelspieler-Modus.", e.message);
        // Das Fehlen von `window.socket` signalisiert bibelquiz.js, den Einzelspieler-Modus zu starten.
        socket = null; // Setze es explizit auf null, um Fehler zu vermeiden.
    }

    // --- DOM-Elemente ---
    const loginView = document.getElementById('login-view');
    const lobbyView = document.getElementById('lobby-view');
    const bibleQuizView = document.getElementById('bible-quiz-view');
    const allViews = document.querySelectorAll('.view');

    const nameInput = document.getElementById('name-input');
    const loginButton = document.getElementById('login-button');
    const singlePlayerButton = document.getElementById('singleplayer-button');

    const playerList = document.getElementById('player-list');
    const startGameButton = document.getElementById('start-game-button');

    // --- Globale UI-Funktion ---
    window.showView = function(viewId) {
        allViews.forEach(view => {
            view.classList.remove('active');
        });
        const activeView = document.getElementById(viewId);
        if (activeView) {
            activeView.classList.add('active');
        }
    };

    // --- Event Listeners ---
    singlePlayerButton.addEventListener('click', () => {
        // Die Funktion wird in bibelquiz.js definiert
        if (window.startBibleQuizSinglePlayer) {
            window.startBibleQuizSinglePlayer();
        }
    });
    
    // KORREKTUR: Führe den Multiplayer-Code nur aus, wenn der Socket erfolgreich erstellt wurde.
    if (socket) {
        loginButton.addEventListener('click', () => {
            const name = nameInput.value.trim();
            if (name) {
                socket.emit('login', { name });
            }
        });

        startGameButton.addEventListener('click', () => {
            socket.emit('bibleQuiz:startGame');
        });

        // --- Socket-Events ---
        socket.on('loginSuccess', (data) => {
            console.log('Login erfolgreich. Betrete Lobby.');
            showView('lobby-view');
            // Rufe die Setup-Funktion in bibelquiz.js auf, um die spielspezifischen Listener zu registrieren
            if (window.setupBibleQuizMultiplayer) {
                window.setupBibleQuizMultiplayer();
            }
            // NEU: Nachdem alles eingerichtet ist, fordern wir die Host-Infos an.
            // Der Server sendet sie nur, wenn wir tatsächlich der Host sind.
            socket.emit('client:readyForHostInfo');

            updateLobby(data);
        });

        socket.on('updateLobby', (data) => {
            console.log('Lobby-Update erhalten:', data);
            updateLobby(data);
        });

        socket.on('disconnect', () => {
            console.log('Verbindung zum Server verloren.');
            alert('Die Verbindung zum Server wurde unterbrochen. Bitte lade die Seite neu.');
            showView('login-view');
        });

        // --- Hilfsfunktionen ---
        function updateLobby({ players }) {
            playerList.innerHTML = '';
            const sortedPlayers = Object.values(players).sort((a, b) => b.score - a.score);

            sortedPlayers.forEach(player => {
                const li = document.createElement('li');
                let content = player.name;
                if (player.isHost) {
                    content += ' (Host) 👑';
                }
                if (player.id === socket.id) {
                    content = `<strong>${content}</strong>`;
                }
                li.innerHTML = content;
                playerList.appendChild(li);
            });

            // Zeige den Start-Button nur für den Host in der Lobby an
            const me = players[socket.id];
            if (me && me.isHost) {
                startGameButton.classList.remove('hidden');
            } else {
                startGameButton.classList.add('hidden');
            }
        }
    }

    console.log('[Client] DOM vollständig geladen. Versuche, die Bibelquiz-App zu initialisieren...');

    // Sende ein Signal, dass das Haupt-Client-Skript bereit ist.
    // Andere Skripte wie bibelquiz.js können darauf warten.
    document.dispatchEvent(new CustomEvent('mainScriptReady'));
});