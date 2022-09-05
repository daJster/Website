"use strict";
const mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,
    blockedSpaces: {
        "7x4": true,
        "1x11": true,
        "12x10": true,
        "4x7": true,
        "5x7": true,
        "6x7": true,
        "8x6": true,
        "9x6": true,
        "10x6": true,
        "7x9": true,
        "8x9": true,
        "9x9": true,
    },
};
// Options for Player Colors... these are in the same order as our sprite sheet
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple"];
function createName() {
    const prefix = randomFromArray([
        "COOL",
        "SUPER",
        "HIP",
        "SMUG",
        "COOL",
        "SILKY",
        "GOOD",
        "SAFE",
        "DEAR",
        "DAMP",
        "WARM",
        "RICH",
        "LONG",
        "DARK",
        "SOFT",
        "BUFF",
        "DOPE",
    ]);
    const animal = randomFromArray([
        "BEAR",
        "DOG",
        "CAT",
        "FOX",
        "LAMB",
        "LION",
        "BOAR",
        "GOAT",
        "VOLE",
        "SEAL",
        "PUMA",
        "MULE",
        "BULL",
        "BIRD",
        "BUG",
    ]);
    return `${prefix} ${animal}`;
}
function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function getKeyString(x, y) {
    return `${x}x${y}`;
}
(function () {
    let playerID;
    let playerREF;
    let playerElements = {};
    const gameContainer = document.querySelector('.game-container');
    function initGame() {
        const allPlayersREF = firebase.database().ref('players');
        const allCoinsREF = firebase.database().ref('coins');
        //event listener everytime a new player joins/leaves/modifies the game there is a _snapshot_
        allPlayersREF.on('value', (snapshot) => {
            // fires whenever a change occurs
        });
        allPlayersREF.on('child_added', (snapshot) => {
            // fires whenever a new node is added to the tree
            const addedPlayer = snapshot.val();
            const characterElement = document.createElement('div');
            characterElement.classList.add('character', 'grid-cell');
            if (addedPlayer.id === playerID) {
                characterElement.classList.add('you');
            }
            characterElement.innerHTML = (`
                <div class="Character_shadow grid-cell"></div>

                <div class="Character_sprite grid-cell"></div>

                <div class="Character_name-container">
                    <span class="Character_name"></span>
                    <span class="Character_coins">0</span>
                </div>

                <div class="Character_you-arrow"></div>
            `);
            playerElements[addedPlayer.id] = characterElement;
            //Fill in some initial state
            characterElement.querySelector('.character_name').innerHTML = addedPlayer.name;
            characterElement.querySelector('.character_coins').innerHTML = `${addedPlayer.coins}`;
            characterElement.setAttribute('data-color', addedPlayer.color);
            characterElement.setAttribute('data-direction', addedPlayer.direction);
            const left = 16 * addedPlayer.x + 'px';
            const top = 16 * addedPlayer.y - 4 + 'px';
            characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
            gameContainer.appendChild(characterElement);
        });
    }
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // you're logged in
            playerID = user.uid;
            playerREF = firebase.database().ref(`players/${playerID}`);
            const name = createName();
            playerREF.set({
                id: playerID,
                name: name,
                direction: (Math.random() > .5) ? 'left' : 'right',
                color: randomFromArray(playerColors),
                x: 4,
                y: 4,
                coins: 0
            });
            //Remove player from Firebase when he diconnects
            playerREF.onDisconnect().remove();
            // Begin game now that we're signed in
            initGame();
        }
        else {
            // you're logged out
        }
    });
    firebase.auth().signInAnonymously().catch((err) => {
        var errCode = err.code;
        var errMessage = err.message;
        alert(`${errCode}\n${errMessage}`);
    });
})();
