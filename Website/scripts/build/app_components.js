"use strict";
window.addEventListener('scroll', () => {
    manageFade(window.scrollY);
});
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
