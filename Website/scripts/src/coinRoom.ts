function randomFromArray(arr: any[]): any{ // function that returns a random value from an array
    return arr[Math.floor(Math.random()* arr.length)]
}

function getKeyString(x: number, y: number): string{ 
    return `${x}x${y}`
}

declare var firebase: any


(function (): void{

    firebase.auth().signInAnonymously()


})()