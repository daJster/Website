const Background = document.querySelector('.error-background');
const HEIGHT = 390; // pixels
const WIDTH = 590; // pixels
const SHAPES = [
    {
        type: 'rectangle',
        quantity: 30
    },
    {
        type: 'triangle',
        quantity: 40
    },
    {
        type: 'circle',
        quantity: 40
    }
];
let startPoint = false;


document.querySelector('.loader-wrapper').classList.add('isActive');
window.onload = () => {
    
    document.querySelector('.loader-wrapper').classList.remove('isActive');
    document.querySelector('.error-container').classList.add('isVisible');
    setTimeout(() =>{
        document.querySelector('.error-image').classList.add('isVisible');
        startPoint = true;
    }, 1200);
};


class mesh{
    constructor(type = '', size = 5, position = {x: 0, y: 0}, velocity = {x: 0, y:0}){

        this.DOMelement;
        this.position = position;
        this.height = size;
        this.width = size;
        this.velocity = velocity;

        let div; 

        switch(type){ // configurating the shapes
            case 'triangle':
                this.DOMelement = document.createElement('div');
                this.DOMelement.className = type;

                for (let i = 0; i < 3; i++){
                    div = document.createElement('div');
                    div.className = `line${i + 1}`;
                    this.DOMelement.appendChild(div);
                }
                
                break;

            case 'rectangle':
                this.DOMelement = document.createElement('div');
                this.DOMelement.className = type;
                break;

            case 'circle':
                this.DOMelement = document.createElement('div');
                this.DOMelement.className = type;
                break;

            default:
                break;
        }
    
        if (this.DOMelement !== undefined ){
            this.DOMelement.style.left = `${this.position.x}px`;
            this.DOMelement.style.top = `${this.position.y}px`;
            this.DOMelement.style.height = `${this.height}px`;
            this.DOMelement.style.width = `${this.width}px`;
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

function createShapes(type, quantity, acc){
    let randomShape = null;
    let randomSize = 0;
    let randomPosition = {x: 0, y: 0}; //default for random values

    for (let i = 0; i < quantity; i++){
        randomSize = Math.floor(Math.random()*5) + 5;
        randomPosition = {
            x: Math.floor(Math.random()*WIDTH),
            y: Math.floor(Math.random()*HEIGHT)
        }
        randomShape = new mesh(type, randomSize);
        randomShape.setPosition(randomPosition);

        acc.push(randomShape);
    }
}

function createSetOfShapes(acc = []){

    SHAPES.forEach( (shape) => {
        createShapes(shape.type, shape.quantity, acc);
    });
    
    return acc;
}


const setOfShapes = createSetOfShapes();


function DisplaySetOfShapes( setOfShapes ){
    setOfShapes.forEach( (shape) => {
        Background.appendChild(shape.DOMelement);
    });
}

DisplaySetOfShapes(setOfShapes);

function animate(){
    requestAnimationFrame(animate);
}

animate();