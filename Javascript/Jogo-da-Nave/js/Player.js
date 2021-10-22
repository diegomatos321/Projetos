class Player extends GameObject {
    constructor(name, x, y, spriteSheetConfig, level) {
        super(name, x, y, spriteSheetConfig);

        this.level = level;

        this.friction = new Vector(200, 0)
        this.direction = "cima";

        this.canShoot = true;

    }
    update() {

        this.behavior(Input.isDown);
        this.animation(this.direction);

        this.position.addTo(this.speed.multiply(deltaTime))

        this.collideWorldBounds()
    }

    behavior(key) {

        this.direction = "cima";

        if(key.length == 0 || key.length == 1 && key[0] == 17){
            if(this.speed.getLength() > 0){
                this.friction.setAngle(this.speed.getAngle())
                this.speed.subtractBy(this.friction.multiply(deltaTime));
            }else{
                this.speed.setLength(0);
            }
        }
        if (key.indexOf(17) >= 0 && this.canShoot) {
            this.shoot();
            this.canShoot = false;
        }

        if (key.indexOf(38) >= 0) {
            this.direction = "cima";

            let newForce = this.acceleration;
            newForce.setAngle(Math.PI / 180 * 270)
            
            this.speed.addTo(newForce.multiply(deltaTime));
        }
        else if (key.indexOf(40) >= 0) {
            let newForce = this.acceleration;
            newForce.setAngle(Math.PI / 180 * 90)

            this.speed.addTo(newForce.multiply(deltaTime));
        }

        if (key.indexOf(37) >= 0) {
            this.direction = "esquerda";

            let newForce = this.acceleration;
            newForce.setAngle(Math.PI / 180 * 180)

            this.speed.addTo(newForce.multiply(deltaTime));

        }

        else if (key.indexOf(39) >= 0) {
            this.direction = "direita";

            let newForce = this.acceleration;
            newForce.setAngle(0)

            this.speed.addTo(newForce.multiply(deltaTime));

        }

        if (key.indexOf(17) < 0) { this.canShoot = true; }
    }

    shoot() {
        let newPosX = this.position.getX() + this.width / 2 - 5.5;
        let newPosY = this.position.getY() - 43;

        galeria.audios.shoot_sound.currentTime = 0;
        galeria.audios.shoot_sound.play();

        let tiro = new Bullet("tiro", newPosX, newPosY, null);
        tiro.setScale(0.8);

        this.level.createGameObject(tiro);
    }
    animation(stance) {
        switch (stance) {
            case "cima":
                this.playAnimation("cima", deltaTime);
                break;
            case "esquerda":
                this.playAnimation("esquerda", deltaTime);
                break;
            case "direita":
                this.playAnimation("direita", deltaTime);
                break;
        }
    }

    playAnimation(animation) {
        this.spriteSheet.currentTime += deltaTime;
        if (this.spriteSheet.currentTime < this.spriteSheet.delay) { return; }
        if (animation == "cima") {
            if (this.spriteSheet.currentFrame != 1 && this.spriteSheet.currentFrame != 2) {
                this.spriteSheet.currentFrame = 1;
            }
            else {
                this.spriteSheet.currentFrame += 1;
            }
            this.spriteSheet.originY = this.spriteSheet.frameHeight * 0
            //console.log(animation)
        }

        if (animation == "esquerda") {
            if (this.spriteSheet.currentFrame != 4 && this.spriteSheet.currentFrame != 5) {
                this.spriteSheet.currentFrame = 4;
            }
            else {
                this.spriteSheet.currentFrame += 1;
            }
            this.spriteSheet.originY = this.spriteSheet.frameHeight * 1;
            //console.log(animation)
        }

        else if (animation == "direita") {
            if (this.spriteSheet.currentFrame != 7 && this.spriteSheet.currentFrame != 8) {
                this.spriteSheet.currentFrame = 7;
            }
            else {
                this.spriteSheet.currentFrame += 1;
            }
            this.spriteSheet.originY = this.spriteSheet.frameHeight * 2;

            // console.log(animation)
        }
        if (this.spriteSheet.currentFrame == 1 || this.spriteSheet.currentFrame == 4 || this.spriteSheet.currentFrame == 7) {
            this.spriteSheet.originX = this.spriteSheet.frameWidth * 1;
        }
        if (this.spriteSheet.currentFrame == 2 || this.spriteSheet.currentFrame == 5 || this.spriteSheet.currentFrame == 8) {
            this.spriteSheet.originX = this.spriteSheet.frameWidth * 2;
        }
        this.spriteSheet.currentTime = 0;
    }
}