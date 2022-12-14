"use strict";
window.addEventListener('scroll', () => {
    manageFade(window.scrollY);
});
const BORDER_MAX_X = 1380;
const BORDER_MIN_X = -100;
const VELOCITY = 1;
function manageFade(scroll) {
    if (scroll > 560) {
        document.querySelector('.resume-programing-languages')?.classList.add('isVisible');
        document.querySelector('.resume-education')?.classList.add('isVisible');
        document.querySelector('.return-overview')?.classList.add('isVisible');
    }
    if (scroll > 1050) {
        document.querySelector('.resume-expertise')?.classList.add('isVisible');
        document.querySelector('.resume-softwares-tools')?.classList.add('isVisible');
    }
    if (scroll > 1500) {
        document.querySelector('.resume-languages')?.classList.add('isVisible');
        document.querySelector('.resume-hobbies')?.classList.add('isVisible');
        document.querySelector('.widget-art')?.classList.add('isVisible');
        document.querySelector('.resume-achievements')?.classList.add('isVisible');
    }
    if (scroll > 1600) {
        document.querySelector('.resume-main-goals')?.classList.add('isVisible');
    }
    if (scroll > 2200) {
        document.querySelector('.resume-brief-paragraph')?.classList.add('isVisible');
    }
    if (scroll > 2360) {
        document.querySelector('.made-with-love')?.classList.add('isVisible');
    }
}
class SeaObject {
    constructor(positionX = 0, velocityX = 0, DOMelement = null, name = '') {
        this.positionX = positionX;
        this.velocityX = velocityX;
        this.DOMelement = DOMelement;
        this.direction = (this.velocityX > 0) ? 'left' : 'right';
        this.name = name;
    }
    update() {
        if (this.positionX < BORDER_MIN_X || this.positionX > BORDER_MAX_X) {
            this.flip();
        }
        this.positionX += this.velocityX;
        this.DOMelement.style.left = `${this.positionX}px`;
    }
    flip() {
        this.velocityX = -this.velocityX;
        this.direction = (this.velocityX > 0) ? 'left' : 'right';
        if (this.name === 'fish4' || this.name === 'rust')
            return;
        this.DOMelement.style.backgroundImage = "url('../images/index/" + this.name + "-" + this.direction + ".png')";
    }
}
let seaObjects = [];
seaObjects.push(new SeaObject(BORDER_MAX_X, -VELOCITY, document.querySelector('.fish1'), 'fish1'));
seaObjects.push(new SeaObject(BORDER_MIN_X, VELOCITY, document.querySelector('.fish2'), 'fish2'));
seaObjects.push(new SeaObject(BORDER_MAX_X, -VELOCITY, document.querySelector('.fish3'), 'fish3'));
seaObjects.push(new SeaObject(230, VELOCITY, document.querySelector('.fish4'), 'fish4'));
seaObjects.push(new SeaObject(BORDER_MIN_X, VELOCITY, document.querySelector('.fish5'), 'fish5'));
seaObjects.push(new SeaObject(1000, -VELOCITY, document.querySelector('.fish6'), 'fish6'));
seaObjects.push(new SeaObject(BORDER_MIN_X, VELOCITY, document.querySelector('.fish7'), 'fish7'));
seaObjects.push(new SeaObject(BORDER_MAX_X - 400, VELOCITY, document.querySelector('.fish8'), 'fish8'));
seaObjects.push(new SeaObject(230, VELOCITY, document.querySelector('.rust'), 'rust'));
seaObjects.push(new SeaObject(BORDER_MIN_X, VELOCITY, document.querySelector('.boat'), 'boat'));
for (let i = 0; i < seaObjects.length; i++) {
    seaObjects[i].DOMelement?.addEventListener('click', () => { console.log('check'); seaObjects[i].flip(); });
}
let frame = 0;
function animate() {
    requestAnimationFrame(animate);
    if (frame % 2 === 0) {
        seaObjects.forEach((seaObject) => {
            seaObject.update();
        });
    }
    frame++;
}
animate();
