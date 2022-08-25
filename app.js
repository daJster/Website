const container = document.querySelector(".container");
const portfolioItems = document.querySelectorAll(".portfolio-item-wrapper");
portfolioItems.forEach( (portfolioItem) => {
    portfolioItem.addEventListener("mouseover", () => {
        portfolioItem.childNodes[1].classList.remove("img-brighten");
        portfolioItem.childNodes[1].classList.add("img-darken");
    });
});

portfolioItems.forEach( (portfolioItem) => {
    portfolioItem.addEventListener("mouseout", () => {
        portfolioItem.childNodes[1].classList.add("img-brighten");
    });
});

const primaryNav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");

container.addEventListener('click', (e) => {
    if ( e.target.nodeName === "DIV"){
            primaryNav.setAttribute("data-visible", false);
            portfolioItems.forEach( (portfolioItem) => {
                portfolioItem.style.zIndex = "0";
            });
    }
});

navToggle.addEventListener("click", () => {
    const visiblilty = primaryNav.getAttribute("data-visible");
    if ( visiblilty === "false" ){
        primaryNav.setAttribute("data-visible", true);
        portfolioItems.forEach( (portfolioItem) => {
            portfolioItem.style.zIndex = "-1";
        });
    }
    else if ( visiblilty === "true"){
        primaryNav.setAttribute("data-visible", false);
        portfolioItems.forEach( (portfolioItem) => {
            portfolioItem.style.zIndex = "0";
        });
    }
});

const popUp = document.querySelector("#pop-up-container");
const touchButton = document.querySelector(".contact-us a");
const closeButton = document.querySelector(".pop-up-close");
const sendButton = document.querySelector(".form button");


popUp.addEventListener('click', (e) => {
    if ( e.target.nodeName === "DIV"){
        container.style.filter = "blur(0px)";
        popUp.setAttribute("open", false);
    }
});

touchButton.addEventListener('click', () => {
    const state = popUp.getAttribute("open");
    if ( state === "true" ){
        container.style.filter = "blur(0px)";
        popUp.setAttribute("open", false);
    }
    else if (state === "false"){
        popUp.setAttribute("open", true);
        container.style.filter = "blur(10px)";
    }
});

closeButton.addEventListener('click', () => {
    const state = popUp.getAttribute("open");
    if ( state === "true" ){
        container.style.filter = "blur(0px)";
        popUp.setAttribute("open", false);
    }
    else if (state === "false"){
        popUp.setAttribute("open", true);
        container.style.filter = "blur(10px)";
    }
});

sendButton.addEventListener('click', () => {
    const state = popUp.getAttribute("open");
    if ( state === "true" ){
        container.style.filter = "blur(0px)";
        popUp.setAttribute("open", false);
    }
    else if (state === "false"){
        popUp.setAttribute("open", true);
        container.style.filter = "blur(10px)";
    }
});

function sendEmail(){
    Email.send({
        Host : "smtp.gmail.com",
        Username : "elkarchiee@gmail.com",
        Password : "jijo12356kar",
        To : 'elkarchie2@wgmail.com',
        From : document.getElementById("email").value,
        Subject : "Website new contact",
        Body : "Name: " + document.getElementById("name").value
               + "<br> Email: " +  document.getElementById("email").value
               + "<br> Message: " + document.getElementById("message").value
    }).then(
    message => alert("Message sent successfully")
    );
}