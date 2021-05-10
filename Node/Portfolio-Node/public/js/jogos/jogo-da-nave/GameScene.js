export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene")
    }

    preload(){
        this.canvas = this.sys.game.canvas;
    }
    create() {
        //Fundo

        this.fundo = this.add.tileSprite(0, 0, this.canvas.width, this.canvas.height, "Fundo").setOrigin(0, 0);

        //Jogador

        this.jogador = this.physics.add.sprite(this.canvas.width / 2, this.canvas.height - 40, "Jogador");
        this.jogador.setCollideWorldBounds(true);
        this.jogador.stance = "Parado";

        //Animações do jogador
        
        this.anims.create(
            {
                key: "Esquerda",
                frames: this.anims.generateFrameNumbers("Jogador", { start: 4, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Direita",
                frames: this.anims.generateFrameNumbers("Jogador", { start: 7, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
        let Explosao = this.anims.create(
            {
                key: "Explosao",
                frames: this.anims.generateFrameNumbers("ExplosaoSFX"),
                frameRate: 10,
                repeat: 0
            });
        Explosao.on("complete", function (currentAnim, currentFrame, sprite) {
            sprite.destroy();
        });

        // Audio

        this.shootSound = this.sound.add("shootSFX");
        this.explosionSound = this.sound.add("explosionSFX");
        this.startUp = this.sound.add("startUpSFX");

        //Cursor

        this.cursor = this.input.keyboard.createCursorKeys();

        let ctrlKey = this.input.keyboard.addKey("CTRL");
        ctrlKey.on('down', this.fire, this);

        //Grupos
        this.inimigos = this.physics.add.group();
        this.bullets = this.physics.add.group();

        //Criando os inimigos
        this.timer = this.time.addEvent({
            delay: 2000,                // ms
            callback: this.addEnemies,
            //args: [],
            callbackScope: this,
            loop: true
        });

        //HUD

        this.score = 0;
        this.txtScore = this.add.text(10, 10, `Pontuação: ${this.score}`);
        this.txtScore.setOrigin(0);

        this.maxVida = 3;
        this.vidas = this.maxVida;
        this.txtVidas = this.add.text(this.canvas.width - 80, 10, `Vidas: ${this.vidas}`);
        this.txtVidas.setOrigin(0);

        this.txtGameOver = this.add.text(this.canvas.width / 2, this.canvas.height / 2, "GAME OVER")
        this.txtGameOver.setOrigin(0.5)
        this.txtGameOver.setVisible(false)

        this.txtRestart = this.add.text(this.canvas.width / 2, this.canvas.height / 2 + 20, "Pressione ENTER para reiniciar")
        this.txtRestart.setOrigin(0.5)
        this.txtRestart.setVisible(false)

        //Colisoies
        this.physics.add.overlap(this.inimigos, this.bullets, this.hitEnemy, null, this);
        this.physics.add.overlap(this.jogador, this.inimigos, this.hitPlayer, null, this);
    }

    update() {
        this.fundo.tilePositionY -= 0.5; // Parallax
        this.movePlayer();

        this.inimigos.children.each((inimigo) => {
            if(inimigo.y > this.canvas.height){
                this.inimigos.remove(inimigo, true, true);
            }
        })
    }

    movePlayer() {
        if (!this.jogador.active) { return; }
        this.jogador.setVelocity(0);
        this.jogador.stance = "Parado";

        if (this.cursor.up.isDown) {
            this.jogador.setVelocityY(-500);
            this.jogador.stance = "Cima"
        }
        else if (this.cursor.down.isDown) {
            this.jogador.setVelocityY(500);
            this.jogador.stance = "Baixo"
        }

        if (this.cursor.right.isDown) {
            this.jogador.setVelocityX(500);
            this.jogador.stance = "Direita"
        }
        else if (this.cursor.left.isDown) {
            this.jogador.setVelocityX(-500);
            this.jogador.stance = "Esquerda"
        }

        this.playerAnimation();
    }

    fire() {
        if (!this.jogador.active) { return; }
        this.shootSound.play();
        let tiro = this.bullets.create(this.jogador.x, this.jogador.y, "Tiro");
        tiro.setVelocityY(-1500);

    }

    addEnemies() {
        let randomX = Math.ceil(Math.random() * this.canvas.width);
        let inimigo = this.inimigos.create(randomX, 0, "Inimigo");
        inimigo.setVelocityY(500)
        inimigo.setScale(0.4);
    }

    playerAnimation() {
        switch (this.jogador.stance) {
            case "Direita":
                this.jogador.anims.play("Direita", true);
                break;
            case "Esquerda":
                this.jogador.anims.play("Esquerda", true);
                break;
            case "Cima":
            case "Baixo":
                this.jogador.anims.play("Parado", true);
                break;
        }

        if (this.jogador.body.velocity.x == 0 & this.jogador.body.velocity.y == 0) {
            this.jogador.anims.play("Parado", true);
        }
    }

    removeEnemy(inimigo) {
        let explosao = this.add.sprite(inimigo.x, inimigo.y, "ExplosaoSFX");
        this.explosionSound.play();
        explosao.setScale(2);
        explosao.play("Explosao");

        this.inimigos.remove(inimigo, true, true);
    }

    hitEnemy(inimigo, bullet) {
        this.removeEnemy(inimigo);

        this.bullets.remove(bullet, true, true);

        this.addPoints();
    }

    hitPlayer(jogador, inimigo) {
        this.removeEnemy(inimigo);

        if (jogador.alpha == 0.5) {
            this.addPoints();
            return;
        }

        this.explosionSound.play();
        this.vidas--;
        this.txtVidas.setText(`Vidas: ${this.vidas}`)
        jogador.disableBody(true, true);

        if (this.vidas <= 0) {
            this.drawGameOverScreen();
            return;
        }
        else {
            this.time.addEvent({
                delay: 1000,                // ms
                callback: this.resetPlayer,
                //args: [],
                callbackScope: this,
                loop: false
            });
        }
    }

    resetPlayer() {
        this.jogador.enableBody(true, this.canvas.width / 2, this.canvas.height, true, true);
        this.jogador.alpha = 0.5;

        this.tweens.add({
            targets: this.jogador,
            y: this.canvas.height - 200,
            ease: 'Power1',
            duration: 1000,
            repeat: 0,
            onComplete: function () {
                this.jogador.alpha = 1;
            },
            callbackScope: this
        });
    }

    addPoints() {
        this.score += 5;
        this.txtScore.setText(`Pontuação: ${this.score}`)
    }

    drawGameOverScreen() {
        this.txtGameOver.setVisible(true)
        this.txtRestart.setVisible(true)

        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.on('down', function () {
            if (this.jogador.active) { return; }

            this.restartGame();
        }, this);
    }

    restartGame() {
        this.startUp.play();
        this.startUp.once('complete', () => {
            this.score = 0;
            this.txtScore.setText(`Pontuação: ${this.score}`)

            this.vidas = this.maxVida;
            this.txtVidas.setText(`Vidas: ${this.vidas}`)

            this.txtGameOver.setVisible(false)
            this.txtRestart.setVisible(false)

            this.resetPlayer();
        });
    }
}