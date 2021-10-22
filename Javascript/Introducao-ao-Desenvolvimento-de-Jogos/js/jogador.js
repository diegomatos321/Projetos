import GameObject from "./gameObject.js"
import Vector from "./vector.js";
import Galeria from "./galeria.js"

export default class Jogador extends GameObject {
    constructor({initialX, initialY, width, height, image, scene}) {
        super({initialX, initialY, width, height, image, scene})
        this.nome = "Jogador"
        this._direction = new Vector(0, 0);
        this._canFire = true;

        // this._velocidadeMaxima = 300;
        this._aceleracao = new Vector(400, 0);
        this._empuxo = new Vector(100, 0);
    }

    get scene() {
        return this._scene;
    }

    get direcao() {
        return this._direction;
    }

    get hasFired() {
        return this._canFire;
    }

    set hasFired(value) {
        this._canFire = value;
    }

    set direcao(value) {
        this._direction.setAngle(value);
    }

    update(deltaTime, inputs) {
        let keysDown = inputs.getInputs()
        this.rotateToMouse(inputs.getMousePosition());
        this.desacelerar(deltaTime);

        if (keysDown.indexOf("KeyW") >= 0) {
            this.mirar()
            this.acelerar(deltaTime);
        }

        if (keysDown.indexOf("Click") >= 0) {
            if(this._canFire) { 
                this.createBullet();
                this.scene.createGameSound("shoot_sound");
                this._canFire = false;
            }
        } else{
            this._canFire = true;
        }

        this._position.addTo(this._velocity.multiply(deltaTime));
        this.collideWorldBounds();
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this._position.getX(), this._position.getY());
        ctx.rotate(this._direction.getAngle())
        ctx.drawImage(this.image, -this.width * this.origin.x, -this.height * this.origin.y, this.width, this.height);
        ctx.restore();
    }

    mirar(){
        this._aceleracao.setAngle(this._direction.getAngle())
    }

    acelerar(deltaTime){
        // if(this._velocity.getLength() >= this.velocidadeMaxima){
        //     return
        // }
        this._velocity.addTo(this.aceleracao.multiply(deltaTime))
    }

    desacelerar(deltaTime){
        if(this._velocity.getLength() <= 1){
            return
        }
        const direcao = this._velocity.multiply(-1).getAngle();
        this._empuxo.setAngle(direcao)
        this._velocity.addTo(this._empuxo.multiply(deltaTime));
    }

    rotateToMouse(mousePos) {
        let mousePosition = mousePos;
        mousePosition.subtractBy(this.scene.canvasPosition);

        this._direction = mousePosition.subtract(this._position);
    }

    createBullet() {
        const tiroProp = {initialX: this._position.getX(), initialY: this._position.getY(), width: 16, height: 9, image: Galeria.imagens.tiro_img, scene: this.scene, direction: this._direction}

        this.scene.createGameObject("Tiro", "Tiro", tiroProp);
    }

    resetAt(params){
        this.reset(params)
        this._direction.setLength(0);
        this._canFire = true;
    }
}