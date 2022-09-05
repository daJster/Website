
interface KeyPressListener{
    keydownFunction: Function
    keyupFunction: Function
}
class KeyPressListener{
    constructor( keyCode: any, callback: Function){
        let keySafe = true
        this.keydownFunction = function (event: any){
            if (event.code === keyCode){
                if (keySafe){
                    keySafe = false
                    callback()
                }
            }
        }

        this.keyupFunction = function (event: any): void{
            if (event.code === keyCode){
                keySafe = true
            }
        }

        document.addEventListener('keydown', (event) => this.keydownFunction(event))
        document.addEventListener('keyup', (event) => this.keyupFunction(event))
    }   

    unbind(): void{
        document.removeEventListener('keydown', (event) => this.keydownFunction(event))
        document.removeEventListener('keyup', (event) => this.keyupFunction(event))
    }
}