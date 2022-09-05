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
    let players = {};
    let playerElements = {};
    const gameContainer = document.querySelector('.game-container');
    function handleArrowPress(xChange, yChange) {
        const newX = players[playerID].x + xChange;
        const newY = players[playerID].y + yChange;
        if (true) {
            // you can move there
            players[playerID].x = newX;
            players[playerID].y = newY;
            if (xChange === 1) {
                players[playerID].direction = 'right';
            }
            if (xChange === -1) {
                players[playerID].direction = 'left';
            }
            playerREF.set(players[playerID]); // updating the player in Firebase
        }
        else {
            // you can't move there
        }
    }
    function initGame() {
        new KeyPressListener('arrowUp', () => handleArrowPress(0, -1));
        new KeyPressListener('arrowDown', () => handleArrowPress(0, 1));
        new KeyPressListener('arrowLeft', () => handleArrowPress(-1, 0));
        new KeyPressListener('arrowRight', () => handleArrowPress(1, 0));
        const allPlayersREF = firebase.database().ref('players');
        const allCoinsREF = firebase.database().ref('coins');
        //event listener everytime a new player joins/leaves/modifies the game there is a _snapshot_
        allPlayersREF.on('value', (snapshot) => {
            // fires whenever a change occurs
            players = snapshot.val() || {};
            Object.keys(players).forEach((key) => {
                const characterState = players[key];
                let el = playerElements[key];
                el.querySelector('.Character_name').innerHTML = characterState.name;
                el.querySelector('.Character_coins').innerHTML = `${characterState.coins}`;
                el.setAttribute('data-color', characterState.color);
                el.setAttribute('data-direction', characterState.direction);
                const left = 16 * characterState.x + 'px';
                const top = 16 * characterState.y - 4 + 'px';
                el.style.transform = `translate3d(${left}, ${top}, 0)`;
            });
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
            characterElement.querySelector('.Character_name').innerHTML = addedPlayer.name;
            characterElement.querySelector('.Character_coins').innerHTML = `${addedPlayer.coins}`;
            characterElement.setAttribute('data-color', addedPlayer.color);
            characterElement.setAttribute('data-direction', addedPlayer.direction);
            const left = 16 * addedPlayer.x + 'px';
            const top = 16 * addedPlayer.y - 4 + 'px';
            characterElement.style.transform = `translate3d(${left}, ${top}, 0)`;
            gameContainer.appendChild(characterElement);
        });
        // remove character DOM element after they log out
        allPlayersREF.on('child_removed', (snapshot) => {
            const removedKey = snapshot.val().id;
            gameContainer.removeChild(playerElements[removedKey]);
            delete playerElements[removedKey];
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
                direction: (Math.random() >= .5) ? 'left' : 'right',
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
