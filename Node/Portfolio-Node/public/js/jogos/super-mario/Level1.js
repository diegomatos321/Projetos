import Enemy from "./Enemy.js";
import Jogador from "./Player.js"
import Item from "./Item.js"

export default class Level1 extends Phaser.Scene {
    constructor() {
        super("Level1");
    }

    init(data) {
        const { width, height } = this.sys.game.canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;

        this.jogadorEscolhido = data.jogadorEscolhido;
    }

    create() {
        this.anims.resumeAll();

        // Audio
        this.backgroundMusic = this.sound.add("backgroundMusic", {
            volume: 0.1,
            loop: true
        })

        this.backgroundMusic.play();
        this.jumpSmallSFX = this.sound.add("jumpSmallSFX", {volume : 0.3});
        this.jumpSuperSFX = this.sound.add("jumpSuperSFX", {volume : 0.3});
        this.powerupAppearsSFX = this.sound.add("powerupAppearsSFX", {volume : 0.3});
        this.powerUpSFX = this.sound.add("powerUpSFX", {volume : 0.3});
        this.bumpSFX = this.sound.add("bumpSFX", {volume : 0.3});
        this.coinSFX = this.sound.add("coinSFX", {volume : 0.3});
        this.breakBlockSFX = this.sound.add("breakBlockSFX", {volume : 0.3});
        this.gameOverSFX = this.sound.add("gameOverSFX");
        this.worldClear = this.sound.add("world_clear", {volume : 0.3});

        // Variaveis
        this.GameOver = false;

        // TILEMAP
        this.physics.world.setBounds(0, 0, 3584, 288);

        this.map = this.add.tilemap("world-1-1");
        this.tileset = this.map.addTilesetImage('mariotileset', 'tileset');

        this.background = this.map.createDynamicLayer("fundo", this.tileset);

        this.world = this.map.createDynamicLayer("world", this.tileset);
        this.world.setCollisionByProperty({ collide: true });

        // JOGADOR
        this.jogador = new Jogador(this, 48, 200, `${this.jogadorEscolhido.current} ${this.jogadorEscolhido.tamanho}`, this.jogadorEscolhido);
        this.gameCompleted = false;

        // BLOCOS INTERATIVOS
        this.bricks = this.add.group();
        this.surpriseBricks = this.add.group();

        this.world.forEachTile(tile => {
            if (tile.index === 2) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let brick = this.physics.add.sprite(x, y, "brick");
                brick.setDepth(2);
                brick.setImmovable();
                this.bricks.add(brick);

                this.world.removeTileAt(tile.x, tile.y);
            }
            if (tile.index === 25) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let surpriseBricks = this.physics.add.sprite(x, y, "surpriseBlock");
                surpriseBricks.anims.play("Surprise Block Ativo");
                surpriseBricks.setDepth(2);
                surpriseBricks.setImmovable();
                surpriseBricks.canDrop = true;
                this.surpriseBricks.add(surpriseBricks);

                this.world.removeTileAt(tile.x, tile.y);
            }
        });

        // INIMIGOS
        this.inimigos = this.add.group();

        this.world.forEachTile(tile => {
            if (tile.index === 64) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let littleGomba = new Enemy(this, x, y - 20, "LittleGomba");
                littleGomba.setGravity(0, 1000);
                littleGomba.anims.play("Little Gomba Walking", true);
                littleGomba.name = "Little Gomba";
                this.inimigos.add(littleGomba);

                this.world.removeTileAt(tile.x, tile.y);
            }
            if (tile.index === 65) {
                const x = tile.getCenterX();
                const y = tile.getCenterY();

                let koopaTroopa = new Enemy(this, x, y - 20, "KoopaTroopa");
                koopaTroopa.anims.play("Koopa Troopa Walking", true);
                koopaTroopa.name = "Koopa Troopa";
                koopaTroopa.wasHit = false;
                koopaTroopa.setGravity(0, 1000);
                this.inimigos.add(koopaTroopa);

                this.world.removeTileAt(tile.x, tile.y);
            }
        });
        // ITEMS
        this.items = this.add.group();

        this.cursor = this.input.keyboard.createCursorKeys();

        // HUD
        this.hudScore = 0;
        this.hudCoins = 0;
        this.hudTime = 240;

        this.txtMARIO = this.add.text(25, 5, "MARIO", { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtMARIO.setScrollFactor(0);
        this.txtScore = this.add.text(45, 25, `${this.hudScore}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtScore.setOrigin(0.5);
        this.txtScore.setScrollFactor(0);

        this.hudCoin = this.add.sprite(80, 20, "coin");
        this.hudCoin.setScale(0.7)
        this.hudCoin.setOrigin(0, 0);
        this.hudCoin.setScrollFactor(0);
        this.hudCoin.anims.play("Coin 1")
        this.txtCoins = this.add.text(98, 24, `x ${this.hudCoins}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtCoins.setOrigin(0.5);
        this.txtCoins.setScrollFactor(0);

        this.txtWorldLevel = this.add.text(130, 5, `MUNDO`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtWorldLevel.setScrollFactor(0);
        this.txtLevel = this.add.text(152, 25, `1-1`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtLevel.setOrigin(0.5);
        this.txtLevel.setScrollFactor(0);

        this.txtTimeLevel = this.add.text(190, 5, `TEMPO`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtTimeLevel.setScrollFactor(0);
        this.txtTime = this.add.text(210, 25, `${this.hudTime}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtTime.setOrigin(0.5);
        this.txtTime.setScrollFactor(0);
        this.hudTimer = this.time.addEvent({
            delay: 1000,                // ms
            callback: function () {
                this.hudTime--;
                this.txtTime.text = `${this.hudTime}`;
                if (this.hudTime == 0) {
                    this.gameOver("Inimigo");
                }
            },
            args: [],
            callbackScope: this,
            loop: true,
            timeScale: 1,
        });

        // FISICA
        this.objectWorldCollider = this.physics.add.collider(this.jogador, this.world);
        this.physics.add.collider(this.jogador, this.bricks, this.playerHitBrick, null, this);
        this.physics.add.collider(this.jogador, this.surpriseBricks, this.playerHitSurpriseBrick, null, this);
        this.physics.add.overlap(this.jogador, this.items, this.collectItem, null, this);

        this.physics.add.collider(this.inimigos, this.world);
        this.physics.add.collider(this.inimigos, this.surpriseBricks);
        this.physics.add.collider(this.inimigos, this.bricks);
        this.physics.add.overlap(this.inimigos, this.inimigos, this.enemyOverlap, null, this);

        this.physics.add.collider(this.items, this.world);
        this.physics.add.collider(this.items, this.bricks);
        this.physics.add.collider(this.items, this.surpriseBricks);

        this.physics.add.collider(this.jogador, this.inimigos, this.enemyCollision, null, this);

        this.cameras.main.setBounds(0, 0, 3584, 240).setName('main');
    }

    update(time, deltaTime) {
        const { x: viewPortPosX } = this.cameras.main.worldView;
        const posicaoRelativaDoJogador = this.jogador.x - viewPortPosX;

        this.jogador.update(this.cursor, deltaTime, posicaoRelativaDoJogador);
        if(this.jogador.x >= 3064 && !this.gameCompleted){
            this.finalizarFase();
        }

        // Atualização do Inimigo
        this.inimigos.children.each((inimigo) => {
            inimigo.update();
        })

        // Atualização dos items
        this.items.children.each((item) => {
            if (item.name == "Mushroom" && item.body.onWall() && (item.body.touching.down || item.body.onFloor())) {
                item.direcao *= -1;
            }

            item.update();
        })

        // Fim de jogo ao cair
        if (this.jogador.y >= 275 && !this.GameOver) {
            this.gameOver("Bordas do Mundo");
        }

        // Camera segue o jogaodr
        if (posicaoRelativaDoJogador > this.GAME_WIDTH / 2) {
            this.cameras.main.startFollow(this.jogador, true, 0.01, 0.01);
        } else {
            this.cameras.main.stopFollow();
        }
    }

    enemyCollision(jogador, inimigo) {
        if (jogador.y + jogador.body.halfHeight <= inimigo.y - inimigo.body.halfHeight) {
            let newScore;
            jogador.setVelocityY(-130);
            jogador.stance = "Jump";
            jogador.canJump = false;
            this.bumpSFX.play();

            if (inimigo.name === "Little Gomba") {
                newScore = this.littleGombaColisao(jogador, inimigo);
            }

            else if (inimigo.name === "Koopa Troopa") {
                newScore = this.koopaTroopaColisao(jogador, inimigo, true);
                if (!newScore) return;
            }

            this.addScore(newScore);

            // Adiciona um texto que anima em cima do inimigo, indicando a quantidade de pontos
            this.motionText(inimigo, newScore)
        } else if (inimigo.name == "Koopa Troopa" && !inimigo.canWalk) {
            this.koopaTroopaColisao(jogador, inimigo);
        } else if (jogador.tamanho == "Pequeno") {
            this.gameOver("Inimigo");
        } else if (jogador.tamanho == "Grande") {
            if (jogador.x > inimigo.x) {
                jogador.body.setVelocity(200, -200)
            } else {
                jogador.body.setVelocity(-200, -200)
            }
            jogador.tamanho = "Pequeno";
            if(inimigo.name == "Koopa Troopa"){
                inimigo.canWalk = false;
                inimigo.setVelocityX(0);
            }
        }
    }

    littleGombaColisao(jogador, inimigo) {
        let newScore;
        inimigo.anims.play("Little Gomba Dead")
        inimigo.alive = false;
        inimigo.disableBody(true);
        inimigo.setVelocityX(0);

        this.time.addEvent({
            delay: 300,                // ms
            callback: function () {
                this.inimigos.remove(inimigo, true, true);
            },
            //args: [],
            callbackScope: this
        });

        return newScore = 200;
    }

    koopaTroopaColisao(jogador, inimigo) {
        let newScore;
        if (!inimigo.wasHit) {
            inimigo.anims.play("Koopa Troopa Defend");
            inimigo.canWalk = false;
            inimigo.wasHit = true;
            inimigo.setVelocityX(0);
            newScore = 200;
        } else if (inimigo.wasHit) {
            if (!inimigo.canWalk) {
                inimigo.canWalk = true;
                inimigo.maxVelocity = 250;
                if (jogador.x < inimigo.x) {
                    inimigo.direcao = 1;
                } else if (jogador.x > inimigo.x) {
                    inimigo.direcao = -1;
                }
            } else {
                inimigo.setVelocityX(5);
                inimigo.direcao *= -1;
                newScore = 400;
                inimigo.canWalk = false;
            }
        }
        return newScore;
    }

    enemyOverlap(inimigoA, inimigoB) {
        if (inimigoA.name == "Koopa Troopa") {
            this.inimigos.remove(inimigoB, true, true);
        }
    }

    playerHitBrick(jogador, brick) {
        if (Math.ceil(jogador.y - jogador.body.halfHeight) == Math.ceil(brick.y + brick.body.halfHeight)) {
            if (jogador.tamanho == "Pequeno") {
                jogador.jumpTime = 500;
                jogador.setVelocityY(0);

                this.tweens.add({
                    targets: brick,
                    y: brick.y - brick.body.halfHeight,
                    ease: 'Circ',
                    duration: 100,
                    repeat: 0,
                    yoyo: true
                });
            } else if (jogador.tamanho == "Grande") {
                jogador.jumpTime = 500;
                jogador.setVelocityY(0);
                this.breakBlockSFX.play();

                let particles = this.add.particles('brickParticle');

                particles.createEmitter({
                    speed: { min: 100, max: 130 },
                    accelerationY: 300,
                    quantity: 20,  
                    lifespan: {min: 600, max: 1000},
                    maxParticles: 20,
                    x: brick.x,
                    y: brick.y,
                    // emitZone: {
                    //     type: 'random',    // 'random', or 'edge'
                    //     source: "Circle",      // Geom like Circle, or a Path or Curve
                    // },
                });

                brick.destroy();
            }
        }
    }

    playerHitSurpriseBrick(jogador, brick) {
        if (Math.ceil(jogador.y - jogador.body.halfHeight) == Math.ceil(brick.y + brick.body.halfHeight)) {
            if (!brick.canDrop) { return; }

            brick.canDrop = false;
            brick.anims.play("Surprise Block Inativo");

            if (jogador.tamanho === "Pequeno") {
                this.tweens.add({
                    targets: brick,
                    y: brick.y - brick.body.halfHeight,
                    ease: 'Circ',
                    duration: 100,
                    repeat: 0,
                    yoyo: true
                });
            }

            let itemProb = Math.round(Math.random() * 100);
            let item;
            jogador.jumpTime = 500;
            jogador.setVelocityY(0);

            if (itemProb <= 90) {
                item = this.spawnCoin(brick);
            } else  {
                item = this.spawnMushroom(brick);
            } 
            // else if (itemProb <= 95) {
            //     item = this.spawnMagicMushroom(brick);
            // } else {
            //     item = this.spawnStarMan(brick);
            // }

            item.setVelocityY(-250);
            item.setGravity(0, 1000);
            item.setDepth(1);
            this.items.add(item);
        }
    }

    spawnCoin(brick) {
        this.coinSFX.play();
        let item = this.physics.add.sprite(brick.x, brick.y - brick.body.height, "coin");
        item.name = "Coin"
        this.time.addEvent({
            delay: 500,                // ms
            callback: function () {
                this.collectItem(this.jogador, item);
            },
            args: [],
            callbackScope: this,
            loop: false,
            timeScale: 1,
        });
        return item;
    }

    spawnMushroom(brick) {
        this.powerupAppearsSFX.play();
        let item = new Item(this, brick.x, brick.y - brick.body.height, "mushroom")
        item.name = "Mushroom"
        return item;
    }

    spawnMagicMushroom(brick) {
        let item = this.physics.add.sprite(brick.x, brick.y - brick.body.height, "magicMushroom");
        item.name = "Magic Mushroom"
        return item;
    }

    spawnStarMan(brick) {
        let item = this.physics.add.sprite(brick.x, brick.y - brick.body.height, "starMan");
        item.name = "Star Man"
        return item;
    }

    collectItem(jogador, item) {
        if (item.name === "Coin") {
            this.items.remove(item, true, true)

            this.addScore(200);
            this.addCoin();
        }
        if (item.name === "Mushroom") {
            this.items.remove(item, true, true)
            this.powerUpSFX.play();
            // this.jogador.setOrigin(0.5, 1)
            if(this.jogador.tamanho === "Pequeno"){
                this.jogador.setVelocityY(-160);
            }
            this.jogador.tamanho = "Grande";
        }
        if (item.name === "Magic Mushroom") {
            this.items.remove(item, true, true)
        }
        if (item.name === "Star Man") {
            this.items.remove(item, true, true)
        }
    }

    addScore(score) {
        this.hudScore += score;
        this.txtScore.text = this.hudScore;
    }

    addCoin() {
        this.hudCoins++;
        this.txtCoins.text = `x ${this.hudCoins}`;
    }

    motionText(target, texto) {
        let txtScore = this.add.text(target.x, target.y - target.body.halfHeight, `${texto}`, { fontFamily: "Source Code Pro", fontSize: "8px" })
        txtScore.setOrigin(0.5);
        txtScore.setDepth(5);

        this.tweens.add({
            targets: txtScore,
            y: target.y - (target.body.height * 3.5),
            ease: 'Circ',
            duration: 400,
            repeat: 0,
            yoyo: false,
            onComplete: function () {
                txtScore.destroy()
            },
            onCompleteScope: this
        });
    }

    gameOver(origem) {
        if (this.jogador.active == false) { return; }

        this.GameOver = true;
        this.stopAll();

        this.jogador.setActive(false);
        this.jogador.stance = "Dead";
        this.gameOverSFX.play();

        if (origem == "Inimigo") {
            this.physics.world.colliders.destroy();
            this.tweens.add({
                targets: this.jogador,
                y: this.jogador.y - (this.jogador.body.halfHeight * 3),
                ease: 'Circ',
                duration: 700,
                repeat: 0,
                yoyo: false
            });
        }

        this.gameOverSFX.once('complete', (music) => {
            this.scene.start("GameOverScene", { level: "Level1", name: "World 1-1" })
        });
    }

    stopAll() {
        this.anims.pauseAll();
        this.sound.pauseAll();
        this.cameras.main.stopFollow();
        this.hudTimer.destroy();

        this.jogador.setVelocity(0);
        this.jogador.setAcceleration(0);

        this.items.children.iterate((item, index) => {
            item.setVelocity(0, 0);
            item.disableBody(true);
            item.body.setAllowGravity(false);
        })

        this.inimigos.children.iterate((inimigo, index) => {
            inimigo.setVelocity(0, 0);
            inimigo.disableBody(true);
            inimigo.body.setAllowGravity(false);
        })

    }

    finalizarFase(){
        this.backgroundMusic.stop();
        this.worldClear.play();

        this.worldClear.once('complete', (music) => {
            this.scene.start("GameOverScene", { level: "Level1", name: "World 1-1" })
        });

        this.gameCompleted = true;
        this.jogador.fim();
    }
}