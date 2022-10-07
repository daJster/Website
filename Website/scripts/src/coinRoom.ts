
interface Position{
    x: number,
    y: number
}

const mapData : any = {
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
const playerColors: string[] = ["blue", "red", "orange", "yellow", "green", "purple"];

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

function isSolid(x: number, y: number) : boolean{
    const blockedSpace = mapData.blockedSpaces[getKeyString(x, y)];
    return (
      blockedSpace ||
      x >= mapData.maxX ||
      x < mapData.minX ||
      y >= mapData.maxY ||
      y < mapData.minY
    )
  }

  function getRandomSafeSpot() : Position{
    //We don't look things up by key here, so just return an x/y
    return randomFromArray([
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 6 },
      { x: 2, y: 8 },
      { x: 2, y: 9 },
      { x: 4, y: 8 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 10 },
      { x: 5, y: 11 },
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 13, y: 7 },
      { x: 13, y: 6 },
      { x: 13, y: 8 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
      { x: 10, y: 8 },
      { x: 8, y: 8 },
      { x: 11, y: 4 },
    ]);
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
    let players: any = {}
    let playerElements: any = {}
    let coins : any = {}
    let coinElements : any = {}


    const gameContainer: HTMLElement | any = document.querySelector('.game-container')
    const playerNameInput: HTMLElement | any = document.querySelector("#player-name")
    const playerColorButton: HTMLElement | any = document.querySelector("#player-color")
  

    function placeCoin(): void{
        const { x, y } = getRandomSafeSpot()
        const key: string= getKeyString(x, y)
        const coinREF: any = firebase.database().ref(`coins/${key}`)
        coinREF.set({
          x,
          y,
        })
    
        const coinTimeouts = [2000, 3000, 4000, 5000];
        setTimeout(() => {
          placeCoin();
        }, randomFromArray(coinTimeouts))
      }


      function attemptGrabCoin(x: number, y: number): void{
        const key: string = getKeyString(x, y)
        if (coins[key]) {
          // Remove this key from data, then uptick Player's coin count
          const coinREF: any = firebase.database().ref(`coins/${key}`)
          coinREF.remove()
          playerREF.update({
            coins: players[playerID].coins + 1,
          })
        }
      }

    function handleArrowPress(xChange: number = 0, yChange: number = 0): void{ // very interesting to reUse
        const newX: number = players[playerID].x + xChange
        const newY: number = players[playerID].y + yChange

        if (!isSolid(newX, newY)){
            // you can move there
            players[playerID].x = newX
            players[playerID].y = newY
            if (xChange === 1){
                players[playerID].direction = 'right'
            }
            if (xChange === -1){
                players[playerID].direction = 'left'
            }
            playerREF.set(players[playerID]) // updating the player in Firebase
            attemptGrabCoin(newX, newY)
        } else {
            // you can't move there

        }
    }

    function initGame(): void{

        new KeyPressListener('arrowUp', () => {
            handleArrowPress(0, -1)
         })
        
        new KeyPressListener('arrowDown', () => {
            handleArrowPress(0, 1)
        })
        
        new KeyPressListener('arrowLeft', () => {
            handleArrowPress(-1, 0)
        })
        
        new KeyPressListener('arrowRight', () => {
            handleArrowPress(1, 0)
        })

        const allPlayersREF : any = firebase.database().ref('players')


        //event listener everytime a new player joins/leaves/modifies the game there is a _snapshot_
        allPlayersREF.on('value', (snapshot: any) => {
            // fires whenever a change occurs
            players = snapshot.val() || {}
            Object.keys(players).forEach((key: any) => {
                const characterState = players[key]
                let el: HTMLElement | any = playerElements[key]
                el.querySelector('.Character_name').innerText = characterState.name
                el.querySelector('.Character_coins').innerText = characterState.coins
    
                el.setAttribute('data-color', characterState.color)
                el.setAttribute('data-direction', characterState.direction)

                const left: string = 16 * characterState.x + 'px'
                const top: string = 16 * characterState.y - 4 + 'px'
                
                el.style.transform = `translate3d(${left}, ${top}, 0)`


                let direction : string= el.getAttribute('data-direction')
                let color : string = el.getAttribute('data-color')
                let characterSpritePosition : string = el.querySelector(".Character_sprite").backgroundPositionY
                let characterSpriteMargin : string = el.querySelector(".Character_sprite").marginLeft

                switch(color){
                    case "orange":
                        characterSpritePosition = "-32px"
                        characterSpriteMargin = "-30px"
                        break
                    case "purple":
                        characterSpritePosition = "-80px"
                        break
                    case "red":
                        characterSpritePosition = "-16px"
                        characterSpriteMargin = "30px"
                        break
                    case "yellow":
                        characterSpritePosition = "-48px"
                        characterSpriteMargin = "30px"
                        break
                    case "green":
                        characterSpritePosition = "-64px"
                        characterSpriteMargin = "-30px"
                        break
                    default:
                        break
                }

                switch(direction){
                    case "right":
                        el.querySelector(".Character_sprite").backgroundPositionX = "16px"
                        break
                    default:
                        break
                }

            })
        })

        allPlayersREF.on('child_added', (snapshot: any) => {
            // fires whenever a new node is added to the tree

            const addedPlayer: Player = snapshot.val()
            const characterElement: HTMLElement | any = document.createElement('div')
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
            players[addedPlayer.id] = addedPlayer

            //Fill in some initial state
            characterElement.querySelector('.Character_name').innerText = addedPlayer.name
            characterElement.querySelector('.Character_coins').innerText = addedPlayer.coins

            characterElement.setAttribute('data-color', addedPlayer.color)
            characterElement.setAttribute('data-direction', addedPlayer.direction)

            const left: string = 16 * addedPlayer.x + 'px'
            const top: string = 16 * addedPlayer.y - 4 + 'px'
            
            characterElement.style.transform = `translate3d(${left}, ${top}, 0)`

            gameContainer.appendChild(characterElement)

        })

        // remove character DOM element after they log out
        allPlayersREF.on('child_removed', (snapshot: any) => {
            const removedKey: any = snapshot.val().id
            gameContainer.removeChild(playerElements[removedKey])
            delete playerElements[removedKey] 
        })



        const allCoinsREF : any = firebase.database().ref('coins')

        //This block will remove coins from local state when Firebase `coins` value updates
        allCoinsREF.on("value", (snapshot: any) => {
            coins = snapshot.val() || {};
          });
          //
      
        allCoinsREF.on("child_added", (snapshot : any) => {
            const coin = snapshot.val();
            const key = getKeyString(coin.x, coin.y);
            coins[key] = true;
    
            // Create the DOM Element
            const coinElement = document.createElement("div");
            coinElement.classList.add("Coin", "grid-cell");
            coinElement.innerHTML = `
                <div class="Coin_shadow grid-cell"></div>
                <div class="Coin_sprite grid-cell"></div>
            `;
    
            // Position the Element
            const left = 16 * coin.x + "px";
            const top = 16 * coin.y - 4 + "px";
            coinElement.style.transform = `translate3d(${left}, ${top}, 0)`;
    
            // Keep a reference for removal later and add to DOM
            coinElements[key] = coinElement;
            gameContainer.appendChild(coinElement);
        })
    
        allCoinsREF.on("child_removed", (snapshot: any) => {
            const {x,y} : Position = snapshot.val();
            const keyToRemove : string = getKeyString(x,y);
            gameContainer.removeChild(coinElements[keyToRemove]);
            delete coinElements[keyToRemove];
        })


        //Updates player name with text input
        playerNameInput.addEventListener("change", (e: any) => {
            const newName = e.target.value || createName();
            playerNameInput.value = newName;
            playerREF.update({
            name: newName
            })
        })
    
        //Update player color on button click
        playerColorButton.addEventListener("click", () => {
            const mySkinIndex = playerColors.indexOf(players[playerID].color);
            const nextColor = playerColors[mySkinIndex + 1] || playerColors[0];
            playerREF.update({
            color: nextColor
            })
        })
    
        //Place my first coin
        placeCoin();
    }


    firebase.auth().onAuthStateChanged((user: any) => {
        if (user){
            // you're logged in
            playerID = user.uid
            playerREF = firebase.database().ref(`players/${playerID}`)

            const name = createName()
            playerNameInput.value = name;

            const {x, y}: Position = getRandomSafeSpot();

            playerREF.set({
                id: playerID,
                name: name,
                direction: (Math.random() >= .5) ? 'left' : 'right',
                color: randomFromArray(playerColors),
                x: x,
                y: y,
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
        //...
        alert(`${errCode}\n${errMessage}`)
    })


})()