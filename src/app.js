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
    setTimeout( () => {
        gameJam.classList.add("isActive");
        portfolio.classList.remove("isActive");
        controlnav(disable);
    }, 550)
}

function closeGJ(){
    document.querySelector("body").style.overflowY = "scroll";
    document.location.href = "#";
    gameJam.classList.remove("isActive");
    portfolio.classList.add("isActive");
    controlnav(enable);
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