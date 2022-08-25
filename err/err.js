let start = false;
const Background = document.querySelector('.error-background');
document.querySelector('.loader-wrapper').classList.add('isActive');
window.onload = () => {
    
    document.querySelector('.loader-wrapper').classList.remove('isActive');
    document.querySelector('.error-container').classList.add('isVisible');
    setTimeout(() =>{
        document.querySelector('.error-image').classList.add('isVisible');
        start = true;
    }, 1200);
};


class mesh{
    constructor(shape = '', size = 5, position = {x: 0, y: 0}, velocity = {x: 0, y:0}){

        this.DOMelement;
        this.position = position;
        this.height = size;
        this.width = size;
        this.velocity = velocity;

        let lines = [];
        switch(shape){ // configurating the shapes
            case 'triangle':
                this.DOMelement = document.createElement(shape);
                lines = [document.createElement('line1'), document.createElement('line2'), document.createElement('line3')];
                lines.forEach((line) => {
                    this.DOMelement.appendChild(line);
                });

                break;

            case 'big-triangle':
                this.DOMelement = document.createElement(shape);
                lines = [document.createElement('big-line1'), document.createElement('big-line2'), document.createElement('big-line3')];
                lines.forEach((line) => {
                    this.DOMelement.appendChild(line);
                });
                break;

            case 'rectangle':
                this.DOMelement = document.createElement(shape);
                break;

            case 'circle':
                this.DOMelement = document.createElement(shape);
                break;

            default:
                break;
        }
    
        if (this.DOMelement){
            this.DOMelement.style.left = `${position.x}px`;
            this.DOMelement.style.top = `${position.y}px`;
        }

    }

    setPosition(position){
        this.position = position;
        this.DOMelement.style.left = `${position.x}px`;
        this.DOMelement.style.top = `${position.y}px`;
    }

    setVelocity(velocity){
        this.velocity = velocity;
    }

}

function createShapes(acc = []){
    for (let i = 0; i < 15; i++){
    }

    for (let i = 0; i < 10; i++){        
    }

    for (let i = 0; i < 7; i++){
    }

    for (let i = 0; i < 8; i++){
    }

    return acc;
}


const shapes = createShapes();

let test = new mesh('circle', 20);

Background.appendChild(test.DOMelement);