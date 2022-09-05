
interface KeyPressListener{
    keydownFunction: Function | any
    keyupFunction: Function | any
}
class KeyPressListener{
    constructor( keyCode: any, callback: Function | any){
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

        document.addEventListener('keydown', this.keydownFunction)
        document.addEventListener('keyup', this.keyupFunction)
    }   

    unbind(): void{
        document.removeEventListener('keydown', this.keydownFunction)
        document.removeEventListener('keyup', this.keyupFunction)
    }
}