//import { inimigos_img } from "./main.js"

class Inimigo extends GameObject {
    constructor(name, x, y, spriteSheetConfig){
        super(name, x, y, spriteSheetConfig);

        this.MAXSPEED = new Vector(0, 300);

        this.width = this.spriteSheet.width;
        this.height = this.spriteSheet.height;
    }

    update() {

        this.playAnimation();

        this.speed.setLength(this.MAXSPEED.getLength())
        this.speed.setAngle(Math.PI / 180 * 90)
        
        this.position.addTo(this.speed.multiply(deltaTime))

        this.deactivateOutsideWorldBounds();
    }

    playAnimation() {
        this.spriteSheet.currentTime += deltaTime;
        if (this.spriteSheet.currentTime < this.spriteSheet.delay) { return; }

        this.spriteSheet.currentFrame += 1;

        if (this.spriteSheet.currentFrame < 0 || this.spriteSheet.currentFrame > 1) {
            this.spriteSheet.currentFrame = 0;
        }
        this.spriteSheet.originX = this.spriteSheet.frameWidth * this.spriteSheet.currentFrame;
        this.spriteSheet.currentTime = 0;
    }
}