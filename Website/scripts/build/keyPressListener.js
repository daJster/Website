"use strict";
class KeyPressListener {
    constructor(keyCode, callback) {
        let keySafe = true;
        this.keydownFunction = function (event) {
            if (event.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        };
        this.keyupFunction = function (event) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        };
        document.addEventListener('keydown', (event) => this.keydownFunction(event));
        document.addEventListener('keyup', (event) => this.keyupFunction(event));
    }
    unbind() {
        document.removeEventListener('keydown', (event) => this.keydownFunction(event));
        document.removeEventListener('keyup', (event) => this.keyupFunction(event));
    }
}
