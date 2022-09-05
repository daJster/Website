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
const playerColors:string[] = ["blue", "red", "orange", "yellow", "green", "purple"];

function createName():string {
    const prefix: string[] = randomFromArray([
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
    const animal:string[] = randomFromArray([
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

function randomFromArray(arr: any[]): any{ // function that returns a random value from an array
    return arr[Math.floor(Math.random()* arr.length)]
}

function getKeyString(x: number, y: number): string{ 
    return `${x}x${y}`
}

declare var firebase: any

interface Player {
    name: string,
    id: string,
    coins: number,
    x: number,
    y: number,
    color: string,
    direction: string
}


(function (): void{


    let playerID: any
    let playerREF: any
    let playerElements: any = {}


    const gameContainer: HTMLElement | any = document.querySelector('.game-container')


    function initGame(){
        const allPlayersREF = firebase.database().ref('players')
        const allCoinsREF = firebase.database().ref('coins')

        //event listener everytime a new player joins/leaves/modifies the game there is a _snapshot_
        allPlayersREF.on('value', (snapshot: any) => {
            // fires whenever a change occurs

        })

        allPlayersREF.on('child-added', (snapshot: any) => {
            // fires whenever a new node is added to the tree

            const addedPlayer: Player = snapshot.val()
            const characterElement = document.createElement('div')
            characterElement.classList.add('character', 'grid-cell')
            if (addedPlayer.id === playerID){
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
            playerElements[addedPlayer.id] = characterElement

            //Fill in some initial state
            characterElement.querySelector('.character_name')!.innerHTML = addedPlayer.name
            characterElement.querySelector('.character_coins')!.innerHTML = `${addedPlayer.coins}`

            characterElement.setAttribute('data-color', addedPlayer.color)
            characterElement.setAttribute('data-direction', addedPlayer.direction)

            const left: string = 16 * addedPlayer.x + 'px'
            const top: string = 16 * addedPlayer.y - 4 + 'px'
            
            characterElement.style.transform = `translate3d(${left}, ${top}, 0)`

            gameContainer.appendChild(characterElement)

        })
    }

    firebase.auth().onAuthStateChanged((user: any) => {
        if (user){
            // you're logged in
            playerID = user.uid
            playerREF = firebase.database().ref(`players/${playerID}`)

            const name = createName()

            playerREF.set({
                id: playerID,
                name: name,
                direction: (Math.random() > .5) ? 'left' : 'right',
                color: randomFromArray(playerColors),
                x: 4,
                y: 4,
                coins: 0
            })

            //Remove player from Firebase when he diconnects
            playerREF.onDisconnect().remove();

            // Begin game now that we're signed in
            initGame()

        } else {
            // you're logged out
        }
    })


    firebase.auth().signInAnonymously().catch((err: any) => {
        var errCode = err.code
        var errMessage = err.message
        alert(`${errCode}\n${errMessage}`)
    })


})()