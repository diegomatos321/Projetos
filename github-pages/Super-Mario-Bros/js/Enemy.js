export default class Enemy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture){
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.direcao = -1;
        this.canWalk = false;
        this.inSight = false;
        this.maxVelocity = 30;
    }

    update(){
        //if(this.scene.jogador.isAlive == false){ return;}
        
        if(this.scene.jogador.x > this.x - 150 && this.scene.jogador.x < this.x  && !this.inSight ||
            this.scene.jogador.x < this.x + 150 && this.scene.jogador.x > this.x && !this.inSight ){
            this.canWalk = true;
            this.inSight = true;
        }
        
        if(this.canWalk){
            if(this.direcao == 1){
                this.setVelocityX(this.maxVelocity);
            } else if(this.direcao == -1){
                this.setVelocityX(-this.maxVelocity);
            }

        }
        if((this.body.touching.down || this.body.onFloor()) && this.body.onWall() && this.canWalk){
            this.direcao *= -1;
            
            if(this.direcao == 1){
                this.setVelocityX(this.maxVelocity);
            } else if(this.direcao == -1){
                this.setVelocityX(-this.maxVelocity);
            }
        }
    }
}