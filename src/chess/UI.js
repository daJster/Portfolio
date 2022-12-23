let player1 = ""; // player names
let player2 = "";
const UI_screen = document.querySelector('.UI-screen');
const UI_start = document.querySelector('.UI-start');
const startChessAudio = new Audio('./audios/chess/startChess.m4a');
const score = {'W' : document.querySelector('.W-score'), 'B': document.querySelector('.B-score')};

setTimeout( () => {
    UI_start.classList.add('isActive');
}, 300);

function removeUI(){
    startChessAudio.play();
    player1 = document.querySelector('#name1').value;
    player2 = document.querySelector('#name2').value;
    UI_start.classList.remove('isActive');
    UI_screen.classList.add('isNotActive');
}

function createScore(){
    let random = Math.random();
    let Bplayer = (random*10 > 5) ? player1 : player2;
    let Wplayer = (random*10 > 5) ? player2 : player1;
    document.querySelector('.B-name').innerHTML = Bplayer;
    document.querySelector('.W-name').innerHTML = Wplayer;
    document.querySelector('.table-score').classList.add('isActive'); 
}