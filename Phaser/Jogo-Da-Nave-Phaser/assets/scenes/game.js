export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene")
    }

    init() {
        let { width, height } = this.sys.game.canvas;

        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
    }

    create() {
        // Fundo
        this.fundo = this.add.tileSprite(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT, "Fundo").setOrigin(0, 0);

        // Jogador
        this.jogador = this.physics.add.sprite(this.GAME_WIDTH / 2, this.GAME_HEIGHT - 100, "Jogador");
        this.jogador.stance = "Parado";
        this.jogador.play(this.jogador.stance);
        this.jogador.active = true;
        this.jogador.setCollideWorldBounds(true);

        // Cursor
        this.cursor = this.input.keyboard.createCursorKeys();
        let ctrlKey = this.input.keyboard.addKey('CTRL');  // Get key object
        ctrlKey.on('down', this.jogadorAtirar, this);

        // Grupos
        this.tiros = this.physics.add.group();
        this.inimigos = this.physics.add.group();

        // Timer
        this.timer = this.time.addEvent({
            delay: 2000, // Em milisegundos
            callback: this.adicionarInimigo,
            callbackScope: this,
            loop: true
        })

        // Audio
        this.tiroSound = this.sound.add("tiroSFX", {volume: 0.3});
        this.explosaoSound = this.sound.add("explosaoSFX", {volume: 0.3});

        // HUD
        this.txtGameOver = this.add.text(this.GAME_WIDTH/2, this.GAME_HEIGHT/2, "Game Over");
        this.txtGameOver.setOrigin(0.5);
        this.txtGameOver.setVisible(false);

        this.txtGameOverButton = this.add.text(this.GAME_WIDTH/2, this.GAME_HEIGHT/2 + 32, "Pressione ENTER para reiniciar");
        this.txtGameOverButton.setOrigin(0.5);
        this.txtGameOverButton.setVisible(false);

        this.vidas = 3;
        this.txtVida = this.add.text(10, 10, "Vidas: 3");

        this.pontuacao = 0;
        this.txtPontuacao = this.add.text(this.GAME_WIDTH - 10, 10, "Pontuacao: 0");
        this.txtPontuacao.setOrigin(1, 0);


        // Colisoes
        this.physics.add.overlap(this.tiros, this.inimigos, this.hitInimigo, null, this);
        this.physics.add.overlap(this.jogador, this.inimigos, this.hitPlayer, null, this);
    }

    update(time, deltaTime) {
        this.fundo.tilePositionY -= 0.1 * deltaTime;
        this.movimentacaoDoJogador();
        this.animacaoDoJogador();
        this.destruirObjetosForaDoTela();
    }

    movimentacaoDoJogador() {
        if (!this.jogador.active) return
        this.jogador.setVelocity(0);

        if (this.cursor.up.isDown) {
            this.jogador.setVelocityY(-250);
        }

        if (this.cursor.down.isDown) {
            this.jogador.setVelocityY(250);
        }

        if (this.cursor.left.isDown) {
            this.jogador.setVelocityX(-250);
            this.jogador.stance = "Esquerda";
            this.jogador.body.setSize(35, 40)
        }

        else if (this.cursor.right.isDown) {
            this.jogador.setVelocityX(250);
            this.jogador.stance = "Direita";
            this.jogador.body.setSize(26, 40)
        } else {
            this.jogador.stance = "Parado";
        }
    }

    animacaoDoJogador() {
        this.jogador.anims.play(this.jogador.stance, true);
        this.jogador.body.setSize()
    }

    jogadorAtirar() {
        let tiro = this.tiros.create(this.jogador.x, this.jogador.y - this.jogador.displayHeight / 2, "Tiro");
        this.tiroSound.play();
        tiro.setVelocityY(-1200);
    }

    destruirObjetosForaDoTela() {
        this.tiros.children.each((tiro) => {
            if (tiro.y + tiro.displayHeight / 2 < 0) {
                this.tiros.remove(tiro, true, true)
            }
        });

        this.inimigos.children.each((inimigo) => {
            if (inimigo.y - inimigo.displayHeight / 2 > this.GAME_HEIGHT) {
                this.inimigos.remove(inimigo, true, true)
            }
        });
    }

    adicionarInimigo(){
        let inimigo = this.physics.add.sprite(0, 0,"Inimigo");
        const randomX = Phaser.Math.Between(inimigo.displayWidth/2, this.GAME_WIDTH - inimigo.displayWidth/2);
        inimigo.x = randomX;
        inimigo.setScale(0.4);
        this.inimigos.add(inimigo, true);
        inimigo.setVelocityY(600);
    }

    hitInimigo(tiro, inimigo){
        this.tiros.remove(tiro, true, true);
        this.removerInimigo(inimigo);

        this.ganhouPontos(200);
        this.atualizarTextoDosPontos();
    }

    hitPlayer(jogador, inimigo){
        this.removerInimigo(inimigo);
        if(this.jogador.alpha == 0.5){ return}

        this.perdeuVida();
        this.atualizarTextoDaVida();

        this.jogador.disableBody(true, true);

        if(this.vidas <= 0) {
            this.gameOver();
        } else {
            this.time.addEvent({
                delay: 1000,
                callback: this.reposicionarOJogador,
                callbackScope: this,
                loop: false
            })
        }
    }

    gameOver(){
        this.jogador.disableBody(true, true);
        this.txtGameOver.setVisible(true);
        this.txtGameOverButton.setVisible(true);

        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.once("down", () =>{
            this.reiniciarJogo();
        })
    }

    reiniciarJogo(){
        this.txtGameOver.setVisible(false);
        this.txtGameOverButton.setVisible(false);
        this.vidas = 3;
        this.pontuacao = 0
        this.atualizarTextoDaVida();
        this.atualizarTextoDosPontos();
        this.jogador.enableBody(true, this.GAME_WIDTH/2, this.GAME_HEIGHT/2, true, true)
    }

    removerInimigo(inimigo){
        this.inimigos.remove(inimigo, true, true)
        this.criarExplosao(inimigo);
    }

    criarExplosao({x, y}){
        let explosao = this.add.sprite(x, y, "Explosion")
        explosao.setScale(2);
        explosao.anims.play("Explosao");
        this.explosaoSound.play();
    }

    perdeuVida(){
        this.vidas--;
    }
  
    atualizarTextoDaVida(){
        this.txtVida.setText(`Vidas: ${this.vidas}`)
    }

    ganhouPontos(pontos){
        this.pontuacao += pontos;
    }
  
    atualizarTextoDosPontos(){
        this.txtPontuacao.setText(`Pontuacao: ${this.pontuacao}`)
    }

    reposicionarOJogador(){
        this.jogador.enableBody(true, this.GAME_WIDTH/2, this.GAME_HEIGHT + this.jogador.displayHeight/2, true, true);

        this.jogador.stance = "Parado";
        this.jogador.alpha = 0.5;

        this.tweens.add({
            targets: this.jogador,
            y: this.GAME_HEIGHT/2,
            duration: 1000,
            onComplete: function (){
                this.jogador.alpha = 1;
            },
            callbackScope: this,
            repeat: 0
        })
    }
}