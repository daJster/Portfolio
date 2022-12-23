class Sprite{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}, isAlive = true}) {
        this.position = position;
        this.offset = offset;
        this.height = 150;
        this.width = 50; 
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.isAlive = isAlive;
    }

    animateFrames(){
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) 
                this.framesCurrent++;
            else if (this.isAlive === false)
                this.framesCurrent = this.framesMax - 1;
            else 
                this.framesCurrent = 0; 
        }
    }
    
    draw() {
        c.drawImage(this.image, 
            this.framesCurrent * this.image.width / this.framesMax, // the crop location 
            0, 
            this.image.width / this.framesMax, // the crop width/height
            this.image.height, 
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            this.image.width*this.scale / this.framesMax, // scaling
            this.image.height*this.scale);
    }

    update(){
        this.draw(); 
        this.animateFrames();
        }
    }

class Fighter extends Sprite{
    constructor({position,
         velocity,
          color,
           imageSrc,
           scale = 1,
           framesMax = 1,
           offset = {x: 0, y: 0} ,
           sprites,
           isAlive = true,
           attackBox = { offset: {}, width: undefined, height: undefined},
            damage,
            speed, 
            name
            }) {
        super({
            imageSrc,
            scale,
            framesMax,
            position,
            offset,
            isAlive
        });

        this.name = name;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.color = color;
        this.attackBox = {
            position: {x: this.position.x, y: this.position.y},
            width: attackBox.width ,
            height: attackBox.height,
            offset: attackBox.offset
        };
        this.isAttacking;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        
        this.damage = damage;
        this.speed = speed;
        this.health = 100;

        for (const sprite in sprites){
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }

    }  

    update(){
        this.draw();
        this.animateFrames();

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        // # left and right borders
        if (this.position.x <= 5 ){
            this.velocity.x = 0;
            this.position.x = 10; 
        }
        else if (this.position.x + this.width >= canvas.width){
            this.velocity.x = 0;
            this.position.x = canvas.width - 57;
        }
        // # roof border 

        if (this.position.y < -90 ){
            this.velocity.y = 0;
            this.position.y = -80;
        }

        // # gravity function 
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 66){
            this.velocity.y = 0;
            this.position.y = 384;
        }
        else{
            this.velocity.y += gravity;
        }

    }

    switchSprite(sprite){
        // # overriding all other animations (attack)
        if ( this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return;

        // # overriding all other animations (taking a hit)
        if ( this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;
        
        // # overriding all other animations (death)
        if ( this.image === this.sprites.death.image && this.framesCurrent < this.sprites.death.framesMax - 1) return;

        switch(sprite) {
            case 'idle':
                if ( this.image !== this.sprites.idle.image ){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0; 
                }
                break;
            case 'run':
                if ( this.image !== this.sprites.run.image ){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0; 
                }
                break;
            case 'jump':
                if ( this.image !== this.sprites.jump.image ){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;                
                }
                break;
            case 'fall':
                if ( this.image !== this.sprites.fall.image ){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;                
                }
                break;
            case 'attack1':
                if ( this.image !== this.sprites.attack1.image ){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;                
                }
                break;
            case 'takeHit':
                if ( this.image !== this.sprites.takeHit.image ){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;                
                }
                break;
            case 'death':
                if ( this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;                
                }
                break;
            default:
                break;
        }
    }

    takeHit(damage){
        this.switchSprite('takeHit');
        this.health -= damage;
    }
    
    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true;
    }
}