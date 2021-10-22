//import { tiro_img } from "./main.js"

class Bullet extends GameObject{
    constructor(name, shipX, shipY, spriteSheetConfig){
        super(name, shipX, shipY, spriteSheetConfig);

        this.MAXSPEED = new Vector(1000, 0)  // Vf = PIXELS / 1000ms => Vf = 1200px/ 1000ms => V = 1.2px/ms

    }

    update(){

        //this.speed.x = this.MAXSPEED.x * deltaTime;
        this.speed.setLength(this.MAXSPEED.getLength());
        this.speed.setAngle(Math.PI / 180 * 270)


        //this.position.x += this.speed.x;
        this.position.addTo(this.speed.multiply(deltaTime));
 
        this.deactivateOutsideWorldBounds();
    }
}