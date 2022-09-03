const Background = document.querySelector('.error-background');
console.log(window.innerWidth)
const HEIGHT = Math.floor(380*window.innerHeight/663);
const WIDTH = Math.floor(580*window.innerWidth/1366); 
const OFFSET = 7; // pixels
const SHAPES = [
    {
        type: 'rectangle',
        quantity: 10
    },
    {
        type: 'triangle',
        quantity: 20
    },
    {
        type: 'circle',
        quantity: 20
    }
];


if (window.innerWidth <= 980) {
    alert("you're using a phone, please switch to a laptop/Desktop.");
    window.stop();
}

document.querySelector('.loader-wrapper').classList.add('isActive');
window.onload = () => {
    
    document.querySelector('.loader-wrapper').classList.remove('isActive');
    document.querySelector('.error-container').classList.add('isVisible');
};


class mesh{
    constructor(type = '', size = 5, position = {x: 0, y: 0}, velocity = {x: 0, y:0}, angle = 0, angularVelocity = { x: 0, y: 0}){

        this.DOMelement;
        this.position = position;
        this.height = size;
        this.width = size;
        this.velocity = velocity;
        this.angle = angle;
        this.angularVelocity = angularVelocity;

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

    setAngle(angle){
        this.angle = angle;
        this.DOMelement.style.transform = `rotate(${angle}deg)`;
    }

    setVelocity(velocity){
        this.velocity = velocity;
    }

    setAngularVelocity(angularVelocity){
        this.angularVelocity = angularVelocity;
    }

    detectCollision(){
        if (this.position.y - this.height < - OFFSET){
            return 'up';
        } else if (this.position.y + this.height > HEIGHT + OFFSET){
            return 'down';
        } else if (this.position.x - this.width < - OFFSET){
            return 'left';
        } else if (this.position.x + this.width > WIDTH + OFFSET){
            return 'right';
        } else {
            return '';
        }
    }
    
    update(){
        
        switch(this.detectCollision()){ // invert velocity at borders
            case 'up':
                this.velocity.y = -this.velocity.y;
                break;
            case 'down':
                this.velocity.y = -this.velocity.y;
                break;
            case 'left':
                this.velocity.x = -this.velocity.x;
                break;
            case 'right':
                this.velocity.x = -this.velocity.x;
                break;
            default:
                break;
        }

        this.setPosition({
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y
        });

        if ( this.DOMelement.className === 'circle') return;
        this.setAngle(this.angle + this.angularVelocity);
    }

}

function createShapes(type, quantity, acc){
    let randomShape = null;
    let randomSize = 0;
    let randomVelocity = {x: 0, y: 0};
    let randomAngularVelocity = {x: 0, y: 0};
    let randomPosition = {x: 0, y: 0}; //default for random values

    for (let i = 0; i < quantity; i++){
        randomSize = Math.floor(Math.random()*5) + 5;
        randomPosition = {
            x: Math.floor(Math.random()*WIDTH),
            y: Math.floor(Math.random()*HEIGHT)
        };

        randomVelocity = {
            x: (Math.floor(Math.random()*100)%2 === 0) ? -1 : 1 ,
            y:  (Math.floor(Math.random()*100)%2 === 0) ? -1 : 1
        };
        
        randomAngularVelocity = (Math.floor(Math.random()*100)%2 === 0) ? -Math.floor(Math.random()*5) - 1 : Math.floor(Math.random()*5) + 1;

        randomShape = new mesh(type, randomSize);
        randomShape.setPosition(randomPosition);
        randomShape.setVelocity(randomVelocity);
        randomShape.setAngularVelocity(randomAngularVelocity);

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

    setOfShapes.forEach((shape) => {
        shape.update();
    });

}


animate();