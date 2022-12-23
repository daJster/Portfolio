function rectangularCollision({ rectangle1, rectangle2 }) {
    return (rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height);
}



let audio = new Audio('./audios/samurai/ost.mp3');

let playedAudio = audio;

function sound(){
    if (document.getElementsByClassName("sound")[0].getAttribute("sound") === "off"){
        document.getElementsByClassName("sound")[0].setAttribute("sound", "on");
        document.getElementsByClassName("sound")[0].style.backgroundImage = "url('./assets/samurai/sound-icon.jpg')";
        playedAudio.play();
    } else{
        document.getElementsByClassName("sound")[0].setAttribute("sound", "off");
        document.getElementsByClassName("sound")[0].style.backgroundImage = "url('./assets/samurai/no-sound-icon.jpg')";
        playedAudio.pause();
    }
}

function refresh(){
    player.health = 100;
    enemy.health = 100;
    player.position.x = 250;
    player.position.y = 0;
    enemy.position.x = 850;
    enemy.position.y = 0;
    player.isAlive = true;
    enemy.isAlive = true;
    gsap.to('#playerHealth', {width : player.health + '%'});
    gsap.to('#enemyHealth', {width : player.health + '%'});
    document.querySelector("#displayText").innerHTML = '';
}

function determineWinner({player, enemy, timerId}){
    clearTimeout(timerId); 
    document.querySelector("#displayText").style.display = 'flex';
    if( player.health === enemy.health ){
        document.querySelector("#displayText").innerHTML = 'Tie';
    } else if (player.health > enemy.health){
        document.querySelector("#displayText").innerHTML = 'Player 1 Wins';    
    } else if (player.health < enemy.health){
        document.querySelector("#displayText").innerHTML = 'Player 2 Wins';    
    }
}

let timer = 90;
let timerId;
function decreaseTimer(){
    timerId = setTimeout(decreaseTimer, 1000)
    if (timer > 0){
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    }
    else{
        determineWinner({player, enemy, timerId});
    }
}