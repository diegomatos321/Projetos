import GameObject from "./gameObject.js"

export default class Meteoro extends GameObject {
    constructor({initialX, initialY, width, height, image, scene}) {
        super({initialX, initialY, width, height, image, scene})
        this.nome = "Meteoro"
        this._velocity.setLength(200);
        this.mirarNoJogador();
    }

    get scene(){
        return this._scene;
    }

    update(deltaTime) {
        this.deactivateWorldBounds();
        this._position.addTo(this._velocity.multiply(deltaTime))
    }

    mirarNoJogador(){
        const direcao = this.scene.player._position.subtract(this._position).getAngle();

        this._velocity.setAngle(direcao);
    }

    resetAt(params){
        this.reset(params)
        
        this._velocity.setLength(200);
        this.mirarNoJogador();
    }
}