import GameObject from "./gameObject.js"

export default class Bullet extends GameObject{
    constructor({initialX, initialY, width, height, image, scene, direction}) {
        super({initialX, initialY, width, height, image, scene})
        this.nome = "Tiro";

        this._velocity.setLength(1200);
        this._velocity.setAngle(direction.getAngle());
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this._position.getX(), this._position.getY());
        ctx.rotate(this._velocity.getAngle())
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }

    update(deltaTime) {
        this._position.addTo(this._velocity.multiply(deltaTime));
        this.deactivateWorldBounds();
    }

    resetAt(params){
        this.reset(params)
        
        this._velocity.setLength(1200);
        this._velocity.setAngle(params.direction.getAngle());
    }
}