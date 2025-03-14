export default class Item extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.direcao = Math.random() <= 0.5 ?  -1 : 1
    }

    update(){
        //if(this.scene.jogador.isAlive == false){ return;}

        if(this.body.touching.down || this.body.onFloor()){
            if(this.direcao == 1){
                this.setVelocityX(50)
            } else {
                this.setVelocityX(-50)
            }
        }
    }
}