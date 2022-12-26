// all elment content DOMS, and all element cursor DOMS
const allElementContent = document.querySelectorAll(".element.content");
const allElementCursor = document.querySelectorAll(".element.cursor");
const gameJam = document.querySelector(".gamejam-page");
const portfolio = document.querySelector(".portfolio");
const Links = document.querySelectorAll(".nav-link");
const dropdownMenu = document.querySelector(".dropdown-menu");
const navbarCollapse = document.querySelector(".navbar-collapse")
const [enable, disable] = [true, false];

function launchGJ(){
    document.querySelector("body").style.overflowY = "hidden";
    dropdownMenu.classList.remove("show");
    navbarCollapse.classList.remove("show");
    document.location.href = "#";
    document.location.href = "#gamejam";
    gameJam.classList.remove("d-none");
    setTimeout( () => {
        gameJam.classList.add("isActive");
        portfolio.classList.remove("isActive");
        controlnav(disable);
    }, 550);
}

function closeGJ(){
    document.querySelector("body").style.overflowY = "scroll";
    document.location.href = "#";
    gameJam.classList.remove("isActive");
    portfolio.classList.add("isActive");
    controlnav(enable);
    setTimeout( () => {
        gameJam.classList.add("d-none");
    }, 750);
}


function controlnav(enable=true){
    Object.keys(Links).forEach( (key) => {
        const link = Links[key];
        if (enable){
            link.classList.remove("disabled");
        } else {
            link.classList.add("disabled");
        }
    });
}

function UIAction(field, action){
    const elementContents = document.querySelectorAll(`.element.content.${field}`);
    const elementCursors = document.querySelectorAll(`.element.cursor.${field}`);
    const length = elementContents.length;
    let index = 0;
    Object.keys(elementContents).forEach( (key) => {
        const elementContent = elementContents[key];
        const elementCursor = elementCursors[key];
        if (!elementContent.classList.contains("d-none")){
            elementContent.classList.add("d-none");
            index = Number(key); 
        }

        if (elementCursor.classList.contains("bg-secondary")){
            elementCursor.classList.remove("bg-secondary");
            elementCursor.classList.add("bg-light");
        }
    });

    index = action === NEXT ? modulo(index + NEXT, length) : modulo(index + PREV, length);

    console.log(elementCursors[`${index}`]);

    elementContents[`${index}`].classList.remove("d-none");
    elementCursors[`${index}`].classList.remove("bg-light");
    elementCursors[`${index}`].classList.add("bg-secondary");

}

function modulo(a , b){
    if (a < 0){
        return modulo( a + b, b);
    } else {
        return a%b;
    }
}


// OLD APP CODE

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


if (popUp){
    popUp.addEventListener('click', (e) => {
        if ( e.target.nodeName === "DIV"){
            container.style.filter = "blur(0px)";
            popUp.setAttribute("open", false);
        }
    });
}

if (touchButton){
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
}

if (closeButton){
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
}

if (sendButton){
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
}
