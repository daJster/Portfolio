// GLOBAL AND GENERAL VARIABLES
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1133;
canvas.height = 600;

let level = 0;
let PNG = "./assets/space/spaceship"+level+".png";
let ALI = "./assets/space/invader"+level+".png";
const MAXLVL = 2;
const MAXHLTH = 2;
const pew = new Audio('./audios/space/pew.mp3');
const agh = new Audio('./audios/space/agh.mp3');
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class Player{
    constructor(){
    this.position = {
        x: canvas.width/2 - 40,
        y: canvas.height - 40  
    };  
    this.velocity = {
        x: 0,
        y: 0
    };

    this.speed = 8;
    this.rotation = 0;
    this.opacity = 1;
    this.score = 0;
    this.health = 2;

    const scale = 0.17;
    const image = new Image();
    image.src = PNG;
    image.onload = () => {
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
          
    }

    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.translate(player.position.x + player.width/2 , player.position.y + player.height/2);
        c.rotate(this.rotation);
        c.translate(- player.position.x - player.width/2 , - player.position.y - player.height/2);

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            );

        c.restore();
    }

    update(){
        if (this.image) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.draw();
        }
    }
}

class Invaders{
    constructor({position}){
    this.velocity = {
        x: 0,
        y: 0
    };

    this.position = {
        x: position.x,
        y: position.y  
    };

    const scale = 1;
    const image = new Image();
    image.src = ALI;
    image.onload = () => {
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
    }

    }

    shoot(invaderProjectiles){
        invaderProjectiles.push(new invaderProjectile({

        position:{
            x: this.position.x + this.width/2,
            y: this.position.y + this.height
        },

        velocity:{
            x: 0,
            y: 5
        }
        }));
    }

    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            );
    }

    update({velocity}){
        if (this.image) {
            this.position.x += velocity.x;
            this.position.y += velocity.y;
            this.draw();
        }
    }
}

class Grid{
    constructor(){
        this.position = {
            x: 0,
            y: 0
        };
        this.velocity = {
            x: 3,
            y: 0
        } 

        this.invaders = [];

        const rows = Math.floor(Math.random() * 6 + 1);
        const columns = Math.floor(Math.random() * 12 + 2);

        this.width = columns*30;
        this.height = rows*30;

        for( let i = 0; i < columns; i++){
            for (let j = 0; j < rows; j++){
                this.invaders.push(new Invaders({position: {
                    x: i * 30,
                    y: j * 30
                }}));   
            } 
        }
    }

    update(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.velocity.y = 0;

        if (this.position.x + this.width >= canvas.width || this.position.x <= 0){
            this.velocity.x = -this.velocity.x; 
            this.velocity.y = 20;
        }
    };
}

class Projectile{
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.radius = 3;
    }

    draw(){
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        c.fillStyle = 'orange';
        c.fill();
        c.closePath();
    }   

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 
    }
}

class Particle{
    constructor({position, velocity, radius, color, type = 'normal', fades = false}){
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = color;
        this.opacity = 1;
        this.fades = fades;
        this.type = type;
    }

    draw(){
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
        c.restore();
    }   

    update(){
        this.draw();
        if (this.fades){
            this.opacity -= 0.01;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 
    }
}

class Bonus{
    constructor({position, velocity, type, url, fades = false}){
    this.position = position;
    this.velocity = velocity;
    this.type = type;
    this.opacity = 1;
    this.fades = fades;

    const scale = this.type.scale;
    const image = new Image();
    image.src = url;
    image.onload = () => {
        this.image = image;
        this.width = image.width * scale;
        this.height = image.height * scale;
    }

    }

    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
            );
        c.closePath();
        c.restore();
    }

    update(){
        if (this.fades){
            this.opacity -= 0.03;
        }

        if (this.image) {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.draw();
        }
    }
}

class invaderProjectile{
    constructor({position, velocity}){
        this.position = position;
        this.velocity = velocity;
        this.height = 10;
        this.width = 2;
    }

    draw(){
        c.fillStyle = 'white';
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }   

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y; 
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PRE ANIMATE VARIABLES

const player = new Player();
const projectiles = [];
const grids = [new Grid()];
const invaderProjectiles = []; 
const particles = [];
const particlesBG = [];
const types = [//{ type: 'SHLD', scale: 0.07},
//{ type: 'UPGRD', scale: 0.05},
{ type: 'HLTH', scale: 0.7},
{ type: 'NUKE', scale: 0.009},
{ type: 'UPGRD', scale: 0.05}];

let playerIsProtected = false; 

const bonus = [];

let game = {
    over: false,
    active: true
}

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    space: {
        pressed: false
    },
    up: {
        pressed: false
    },
    down: {
        pressed: false
    }
};

let frames = 0;
let count = 0;
let acc = 0;
let randomInterval = Math.floor(Math.random()*500) + 200;
let chosenType = 0;
const scoreValue = document.getElementsByClassName('score-value')[0];
const healthHeart = document.getElementsByClassName('heart');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function updateAssets(){
    PNG = "./assets/space/spaceship"+level+".png";
    ALI = "./assets/space/invader"+level+".png";
}

function createParticles({object, color, number, coeff}){
    // create new   particle
    for ( let i = 0; i < number; i++) {
        particles.push(new Particle({
            position:{
                x: object.position.x + object.width/2,
                y: object.position.y
            },
            velocity:{
                x: (Math.random() - 0.5)*coeff,
                y: (Math.random() - 0.5)*coeff
            },
            radius: Math.random()*3,
            color: color,
            fades: true
        }));
    }
}

function explodeInvader(invader, grid, invaderIndex, projectileIndex = null){
    player.score += 20;
    agh.play();
    createParticles({object: invader, color:'#BAA0DE', number: 5, coeff: 5});
    bonus.push(new Bonus(
        {
            position: invader.position,
            velocity: {x: 0, y: -0.6},
            type:  {type: 'PopUp', scale: 0.7},
            url: './assets/space/20pts.png',
            fades: true
        }));

    grid.invaders.splice(invaderIndex, 1);


    if (Math.random()*Math.random()*Math.random()*5/4 >= 0.75){  
        chosenType = Math.abs(Math.floor(Math.random()*(types.length - 1) - chosenType));
        bonus.push(new Bonus(
            {
                position: invader.position,
                velocity: {x: invader.velocity.x, y: 1},
                type:  types[chosenType],
                url: './assets/space/'+types[chosenType].type+'.png'
            }));
    }


    if (projectileIndex !== null) {
        projectiles.splice(projectileIndex, 1);
    }
}

function explodeGrid(grid, gridIndex){
    player.score += 100;
    bonus.push(new Bonus(
        {
            position: grid.position,
            velocity: {x: 0, y: -0.6},
            type: {type: 'PopUp', scale: 0.7},
            url: './assets/space/100pts.png',
            fades: true
        }));

    grids.splice(gridIndex, 1);
}

function explodePlayer(invaderProjectileIndex = null){
    createParticles({object: player, color: 'white', number: 20, coeff: 8});    
    setTimeout(() => {
        if ( invaderProjectileIndex !== null) {
            invaderProjectiles.splice(invaderProjectileIndex, 1);
        }
        player.opacity = 0;
        game.over = true;
    }, 0);
        
    setTimeout( () => {
        game.active = false;
    }, 2000); 
}

function invader_projectile_hitbox(projectile, invader){
    return projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
    projectile.position.x + projectile.radius >= invader.position.x && 
    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
    projectile.position.y + projectile.radius >= invader.position.y;
}

function invaderProjectile_player_hitbox(invaderProjectile){
    return invaderProjectile.position.y + invaderProjectile.height >= player.position.y + player.height/2 && 
    invaderProjectile.position.y + invaderProjectile.height <= player.position.y + player.height &&
    invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
    invaderProjectile.position.x <= player.position.x + player.width;
}

function bonus_player_hitbox(bonuses){
    return bonuses.position.y + bonuses.height >= player.position.y + player.height/2 && 
    bonuses.position.y + bonuses.height <= player.position.y + player.height &&
    bonuses.position.x + bonuses.width >= player.position.x &&
    bonuses.position.x <= player.position.x + player.width
}

function invader_player_hitbox(invader){
    return invader.position.y + invader.height >= player.position.y + player.height/2 && 
    invader.position.y + invader.height <= player.position.y + player.height &&
    invader.position.x + invader.width >= player.position.x &&
    invader.position.x <= player.position.x + player.width;
}

function playerMovementControl(){
    if ( keys.right.pressed &&  player.position.x +player.width + 5 <= canvas.width ){
        player.velocity.x = player.speed;
        player.rotation = .15;
    } else if ( keys.left.pressed && player.position.x >= 0 ){
        player.velocity.x = -player.speed;
        player.rotation = -.15;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }

    if (keys.up.pressed && player.position.y >= (canvas.height/2 + 50) ){
        player.velocity.y = -player.speed;
    } else if (keys.down.pressed && player.position.y + player.height + 5 <= canvas.height){
        player.velocity.y = player.speed;
    } else{
        player.velocity.y = 0;
    }
}

function SpawnInvaders(){
    if (frames % randomInterval === 0){
        grids.push(new Grid());
        randomInterval = Math.floor(Math.random()*500) + 100;
        frames = 0;
    }
}

function createBackground(){
    // create background
    for ( let i = 0; i < 300; i++) {
        particlesBG.push(new Particle({
            position:{
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height
            },
            velocity:{
                x: player.velocity.x,
                y: 0.3 + player.velocity.y 
            },
            radius: Math.random()*2,
            color: 'grey',
            fades: false
        }));
    }
}

function applyHealthBonus(){
    if (player.health < 2){
        healthHeart[MAXHLTH - player.health - 1].style.opacity = 1;
        player.health++;
    }
}

function applyUpgradeBonus(){
    return;
}

function applyShieldBonus(){
    playerIsProtected = true;
    const spaceshipProtect = new Image();
    spaceshipProtect.src = './assets/space/spaceshipProtect.png';
    spaceshipProtect.onload = () => {
        player.image = spaceshipProtect;
        player.height = spaceshipProtect.height * 0.05;
        player.width = spaceshipProtect.width * 0.05;
    };
}

function applyNukeBonus(){
    grids.forEach( (grid, gridIndex) =>{
        grid.invaders.forEach( (invader, invaderIndex) => {
            explodeInvader(invader, grid, invaderIndex);
        });
        explodeGrid(grid, gridIndex);
    });
    return;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

createBackground();

function animate(){
    if (!game.active) return;

    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    scoreValue.innerHTML = player.score;

    grids.forEach((grid, gridIndex) => {
        grid.update();

        //spawn invader projectiles
        if ( frames % 100 === 0 && grid.invaders.length > 0){
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles);
        }

        grid.invaders.forEach((invader, invaderIndex) => {
            invader.update({velocity: grid.velocity});
            // hit enemy 
            projectiles.forEach((projectile, projectileIndex) => {
                if (invader_projectile_hitbox(projectile, invader)){
                    setTimeout(() =>{

                        const invaderFound = grid.invaders.find( (invaderCheck) => {
                            return invaderCheck === invader;
                        });

                        const projectileFound = projectiles.find( (projectileCheck) =>{
                            return projectileCheck === projectile;
                        });

                        //remove a projectile or a invader
                        if (invaderFound && projectileFound){
                            explodeInvader(invader, grid, invaderIndex, projectileIndex);
                            
                            if (grid.invaders.length > 0){
                                // reshape the grid
                                const firstInvader = grid.invaders[0];
                                const lastInvader = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                                grid.position.x = firstInvader.position.x;
                            } else {
                                explodeGrid(grid, gridIndex);
                            }
                        }
                    }, 0);
                }

                if (invader_player_hitbox(invader)){
                    explodePlayer();
                    explodeInvader(invader, grid, invaderIndex);
                }
            });
        });
    });
    player.update();


    level = Math.floor(player.score/2000)%(MAXLVL+1);
    updateAssets();

    particles.forEach( (particle, particleIndex) => {

        if (particle.opacity <= 0){
            setTimeout(() => {
                particles.splice(particleIndex, 1);
            }, 0);
        } else {
            particle.update();
        }
    });

    particlesBG.forEach( (particleBG) => {
        particleBG.velocity.x = player.velocity.x*15/100;
        particleBG.velocity.y = 0.3 + player.velocity.y*15/100;
        if (particleBG.position.y - particleBG.radius >= canvas.height){
            particleBG.position.x = Math.random()*canvas.width;
            particleBG.position.y = 0;
        } else {
            particleBG.update();
        }
    });

    invaderProjectiles.forEach( (invaderProjectile, invaderProjectileIndex) =>{
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
            setTimeout(() => {
                invaderProjectiles.splice(invaderProjectileIndex, 1)
            },0);
        } else {
            invaderProjectile.update();
        }

        if (invaderProjectile_player_hitbox(invaderProjectile)){

            healthHeart[MAXHLTH - player.health].style.opacity = 0;

            if (player.health === 0){
                explodePlayer(invaderProjectileIndex);   
            } else {
                //decrease health bar
                setTimeout(() => {
                    invaderProjectiles.splice(invaderProjectileIndex, 1);
                }, 0);
                player.health -= 1;
                player.image.src = "./assets/space/spaceshipDamage.png";
                count = 0;
            }
        }
    });

    projectiles.forEach((projectile, index) => {
        if ( projectile.position.y + projectile.position.radius <= 0){
            setTimeout(() => {
                projectiles.splice(index, 1);

            }, 0);

        } else {
            projectile.update();
        }
    });


    if (bonus.length > 0){
        bonus.forEach( (bonuses, index) => {
            bonuses.update();
            if (bonuses.opacity <= 0.1){
                setTimeout(() => {
                    bonus.splice(index, 1);
                }, 0);
            }

            if ( bonuses.position.y >= canvas.height + bonuses.height){
                setTimeout(() => {
                    bonus.splice(index, 1);
                }, 0);

            } else if (bonus_player_hitbox(bonuses)){
                switch (bonuses.type.type){
                    case 'HLTH':
                        applyHealthBonus();
                        break;
                    
                    case 'UPRGD':
                        //applyUpgradeBonus(); 
                        break;
                    
                    case 'SHLD':
                        //applyShieldBonus();
                        break;
                    
                    case 'NUKE':
                        applyNukeBonus();
                        break;
                }

                setTimeout(() => {
                    bonus.splice(index, 1);
                }, 0);

            } else {
                bonuses.update();
            }
        });
    }

    playerMovementControl();
    
    SpawnInvaders();

    if (count > 10 && !playerIsProtected){
        player.image.src = PNG;
    }

    frames++;
    count++;
}


animate();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// EVENT LISTENERS
addEventListener('keydown', ({ key }) => {
    if ( game.over === false){
        switch(key) {
            case 'ArrowRight':
                keys.right.pressed = true;
                break;

            case 'ArrowLeft':
                keys.left.pressed = true;
                break;

            case ' ':
                keys.space.pressed = true;
                projectiles.push(new Projectile({
                    position: {
                        x: player.position.x + player.width/2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -25
                    }
                })
                )
                pew.play();
                break;

            case 'ArrowUp' : 
                keys.up.pressed = true;
                break;

            case 'ArrowDown':
                keys.down.pressed = true;
                break;
        }
    }
});

addEventListener('keyup', ({ key }) => {
    switch(key) {
        case 'ArrowRight':
            keys.right.pressed = false;
            break;

        case 'ArrowLeft':
            keys.left.pressed = false;
            break;

        case ' ':
            keys.space.pressed = false;
            break;

        case 'ArrowUp':
            keys.up.pressed = false;
            break;

        case 'ArrowDown':
            keys.down.pressed = false;
            break;
        }
});

window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);