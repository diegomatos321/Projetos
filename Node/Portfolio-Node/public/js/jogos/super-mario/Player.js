export default class Jogador extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, { current, tamanho }) {
        super(scene, x, y, texture)

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);
        this.body.setMaxVelocity(100, 420)
        this.setGravity(0, 1000);
        this.jumpTime = 0;
        this.hasJumped = false;
        this.canJump = true;
        this.setDepth(3);

        this.aceleracao = {
            x: 350,
            y: 210
        };
        this.atrito = 200;

        this.current = current;
        this.tamanho = tamanho;
        this.canWalk = true;
        this.stance = "Idle"
    }

    update(cursor, deltaTime, posicaoRelativaDoJogador) {
        // Anima Jogador
        this.animacaoDoJogador();

        if (!this.active) { return; }
        

        if (posicaoRelativaDoJogador >= 0 && this.canWalk) {
            // Movimenta o Jogador
            this.movimentacaoDoJogador(cursor, deltaTime)
        }else if (this.canWalk){
            this.setAccelerationX(this.aceleracao.x*2);
        }
    }

    movimentacaoDoJogador(cursor, deltaTime) {
        if (!cursor.right.isDown && !cursor.left.isDown) {
            this.setAccelerationX(0);
            this.setDragX(this.atrito);
        }

        if ((this.body.velocity.x == 0 && this.body.velocity.y == 0) && (this.body.touching.down || this.body.onFloor())) {
            this.stance = "Idle"
        }

        if (cursor.right.isDown) {
            this.flipX = false;
            this.setAccelerationX(this.aceleracao.x);

            if (this.body.velocity.x < 0 && (this.body.touching.down || this.body.onFloor())) {
                this.stance = "Changing Direction";
            }
            else if (this.body.touching.down || this.body.onFloor()) {
                this.stance = "Walking";
            }
        }
        else if (cursor.left.isDown) {
            this.flipX = true;
            this.setAccelerationX(-this.aceleracao.x);

            if (this.body.velocity.x > 0 && (this.body.touching.down || this.body.onFloor())) {
                this.stance = "Changing Direction";
            }
            else if (this.body.touching.down || this.body.onFloor()) {
                this.stance = "Walking"
            }
        }

        if (cursor.up.isDown) {
            if ((this.body.touching.down || this.body.onFloor()) && !this.hasJumped && this.canJump) {
                if(this.tamanho === "Pequeno") { this.scene.jumpSmallSFX.play()}
                else if (this.tamanho === "Grande") { this.scene.jumpSuperSFX.play()}
                this.jumpTime = 0;

                this.stance = "Jump";
                this.hasJumped = true;
                this.canJump = false;
            }

            if (this.hasJumped) {
                this.jumpTime += deltaTime;
                if (this.jumpTime > 280) {
                    return;
                }
                this.setVelocityY(-this.aceleracao.y)
            }
        }
        if (cursor.up.isUp) {
            this.canJump = true;
            this.jumpTime = 0;
            this.hasJumped = false;
        }
    }

    animacaoDoJogador() {
        console.log(`${this.current} ${this.tamanho} ${this.stance}`)
        this.anims.play(`${this.current} ${this.tamanho} ${this.stance}`, true);
        this.body.setSize();
    }

    fim(){
        this.canWalk = false;
        this.flipX = false;
        this.stance = "Walking"
        this.setAccelerationX(0);
        this.setDragX(0);
        this.setVelocityX(45);
    }
}