import Sprite from "./sprite.js"
import Vector from "./vector.js"

export default class Pipe extends Sprite {
    constructor(parameters) {

        super(parameters.sprite, parameters.x, parameters.y, parameters.width, parameters.height, parameters.name)

        this.velocity = new Vector(-100, 0);
    }

    draw(ctx) {
        if (this.name === "Pipe North") {
            ctx[3].drawImage(this.image, this.position.getX(), this.position.getY())
        } else if (this.name === "Pipe South") { // Pipe south será desenhando atrás do chão
            ctx[1].drawImage(this.image, this.position.getX(), this.position.getY())
        }
    }
    update(deltaTime) {
        this.position.addTo(this.velocity.multiply(deltaTime));

        if (this.position.getX() + this.image.width < 0) {
            this.active = false;
        }
    }
    resetAt(parameters) {
        this.position.setX(parameters.x);
        this.position.setY(parameters.y);
        this.active = true;
    }
}