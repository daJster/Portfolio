const canvas = document.querySelector("canvas");

const c = canvas.getContext('2d');

const gravity = 0.7;

canvas.width = 1233;
canvas.height = 600;

c.fillRect(0, 0, canvas.width, canvas.height);

const background = new Sprite({
    position:{
        x: 0,
        y: 0
    },
    imageSrc: './assets/samurai/background.png'
}); 

const shop = new Sprite({
    position:{
        x: 750,
        y: 160
    },
    imageSrc: './assets/samurai/shop.png',
    scale: 2.9, 
    framesMax: 6
}); 


const player = new Fighter({
    position: {
        x: 250, 
        y: 0
    },
    velocity: {
        x: 0, 
        y: 0
    }, 
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/samurai/Mack/left-side-sprite/Idle.png',
    scale: 2.5,
    framesMax: 8,
    offset: {
        x: 215,
        y: 155
    },
    sprites: {
        idle: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/takehit-none.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samurai/Mack/left-side-sprite/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 60,
            y: 0
        },
        width: 190,
        height: 120
    },
    damage: 17,
    speed: 7,
    side: 'left',
    name: "Mack"
});

const enemy = new Fighter({
    position: {
        x: 850, 
        y: 0
        },
    velocity: {
        x: 0, 
        y: 0
        },
    color: 'red',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/samurai/kenji/right-side-sprite/Idle.png',
    scale: 2.5,
    framesMax: 4,
    offset: {
        x: 215,
        y: 169
    },
    sprites: {
        idle: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/takehit-none.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/samurai/kenji/right-side-sprite/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 0
        },
        width: 160,
        height: 120
    },
    damage: 7,
    speed: 9,
    side: 'right',
    name: "kenji"
});

const keys ={
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
};

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba( 255, 255, 255, 0.08)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update();
    enemy.update();
    
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // #player movement
    if (player.isAlive || enemy.isAlive){
        if (player.isAlive){
            if (keys.q.pressed && player.lastKey === 'q'){
                player.velocity.x = -player.speed;
                player.switchSprite('run');
            } else if (keys.d.pressed && player.lastKey === 'd'){
                player.velocity.x = player.speed;
                player.switchSprite('run');
            } else{
                player.switchSprite('idle');
            }

            if (player.velocity.y < 0){
                player.switchSprite('jump');
            } else if (player.velocity.y > 0){
                player.switchSprite('fall');  
            }

            if(player.isAttacking && rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.framesCurrent === 4){
                player.isAttacking = false;
                if (enemy.health > 0){
                    enemy.takeHit(player.damage);
                }
                gsap.to('#enemyHealth', {
                    width : enemy.health + '%'
                });
            }
            // # if player misses 
        
            if (player.isAttacking && player.framesCurrent === 4){
                player.isAttacking = false;
            }

        } else {
            player.switchSprite('death');   
        }
        // #enemy movement
        if (enemy.isAlive){
            if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
                enemy.velocity.x = -enemy.speed;
                enemy.switchSprite('run');
            } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
                enemy.velocity.x = enemy.speed;
                enemy.switchSprite('run');
            } else {
                enemy.switchSprite('idle');
            }

            if (enemy.velocity.y < 0){
                enemy.switchSprite('jump');
            } else if (enemy.velocity.y > 0){
                enemy.switchSprite('fall');  
            }

            // # detect collision

            if(enemy.isAttacking && rectangularCollision({rectangle1: enemy, rectangle2: player})){ // && enemy.framesCurrent === 2
                enemy.isAttacking = false;
                if (player.health > 0) {
                    player.takeHit(enemy.damage);
                }
                gsap.to('#playerHealth', {
                    width : player.health + '%'
                });
            }

            if (enemy.isAttacking && enemy.framesCurrent === 2){
                enemy.isAttacking = false;
            }

        } else{
            enemy.switchSprite('death');
        }
        // # death scene 
        if (enemy.health <= 0){
            enemy.isAlive = false;
        }

        if (player.health <= 0){
            player.isAlive = false;
        }  

        // # end game based on health
        if (enemy.health <= 0 || player.health <= 0){
            determineWinner({player, enemy, timerId});
        }
    }
    else{
        if (player.isAlive){
            enemy.switchSprite('death')
        }
        else
            player.switchSprite('death');
    }
}


animate();


window.addEventListener('keydown', (event) => {

    if (player.isAlive){
        switch (event.key){
            case 'd':
                    keys.d.pressed = true;
                    player.lastKey = 'd';
                break;
            case 'q':
                    keys.q.pressed = true;
                    player.lastKey = 'q';
                break;
            case 'z':
                    player.velocity.y = -23;
                break;
             case 's':
                    player.attack();    
                break;
            default: 
                break;
        }
    }

    if (enemy.isAlive){
        switch (event.key){
            case 'ArrowRight':
                    keys.ArrowRight.pressed = true;
                    enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true;
                    enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                    enemy.velocity.y = -23;
                break;
            case 'ArrowDown':
                    enemy.attack();
                break;
            default:
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'q':
            keys.q.pressed = false;
            break;
        default:
            break;
    }

    switch (event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        default:
             break;
        }
});