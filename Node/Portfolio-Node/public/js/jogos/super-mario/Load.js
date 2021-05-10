export default class LoadScene extends Phaser.Scene {
    constructor() {
        super("LoadScene")
    }

    init() {
        const { width, height } = this.sys.game.canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
    }

    preload() {
        let loadingBar = this.add.image(this.GAME_WIDTH / 2 - 100, this.GAME_HEIGHT / 2, "loadingBar")
        loadingBar.setOrigin(0);

        let txtLoading = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + 24, "Loading...:")
        txtLoading.setOrigin(0.5);
        let txtLoadingPerc = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, "0%")
        txtLoadingPerc.setOrigin(0.5);

        this.load.on('progress', function (value) {
            console.log(value);
            loadingBar.displayWidth = loadingBar.width * value
            txtLoadingPerc.setText(`${value.toFixed(2) * 100}%`)
        });

        this.load.on('fileprogress', function (file) {
            txtLoading.setText(`Loading...: ${file.key}`)
            console.log(file.src);
        });

        this.load.on('complete', function () {
            txtLoading.setText(`Loading...: Completed !`);
            console.log('complete');
        });

        // SPRITE SHEETS

        this.load.spritesheet("Mario Pequeno", "/uploads/assets/super-mario/imagens/Mario-Pequeno.webp", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("Mario Grande", "/uploads/assets/super-mario/imagens/Mario-Grande.webp", {
            frameWidth: 16, frameHeight: 32
        })

        this.load.spritesheet("Luigi Pequeno", "/uploads/assets/super-mario/imagens/Luigi-Pequeno.webp", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("Luigi Grande", "/uploads/assets/super-mario/imagens/Luigi-Grande.webp", {
            frameWidth: 16, frameHeight: 32
        })

        this.load.spritesheet("LittleGomba", "/uploads/assets/super-mario/imagens/Little-Gomba.webp", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("surpriseBlock", "/uploads/assets/super-mario/imagens/surpriseBlock.webp", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("coin", "/uploads/assets/super-mario/imagens/coin.webp", {
            frameWidth: 16, frameHeight: 16
        })

        this.load.spritesheet("KoopaTroopa", "/uploads/assets/super-mario/imagens/Koopa-Troopa.webp", {
            frameWidth: 16, frameHeight: 24
        })

        // IMAGENS PNG
        this.load.image("brick", "/uploads/assets/super-mario/imagens/brick.webp");
        this.load.image("magicMushroom", "/uploads/assets/super-mario/imagens/MagicMushroom.webp");
        this.load.image("mushroom", "/uploads/assets/super-mario/imagens/Mushroom.webp");
        this.load.image("starMan", "/uploads/assets/super-mario/imagens/Starman.webp");
        this.load.image("menuBanner", "/uploads/assets/super-mario/imagens/menu-banner.webp");
        this.load.image("menuPonteiro", "/uploads/assets/super-mario/imagens/menu-ponteiro.webp");
        this.load.image("brickParticle", "/uploads/assets/super-mario/imagens/brick-particle.webp");

        // TILEMAP

        this.load.tilemapTiledJSON("world-1-1", "/uploads/assets/super-mario/tilemap/world1-1.json");
        this.load.tilemapTiledJSON("menu", "/uploads/assets/super-mario/tilemap/menu.json");

        // TILESET  

        this.load.image("tileset", "/uploads/assets/super-mario/tilemap/tileset.webp")

        // AUDIO FILES

        this.load.audio("jumpSmallSFX", "/uploads/assets/super-mario/audio/smb_jump-small.mp3");
        this.load.audio("jumpSuperSFX", "/uploads/assets/super-mario/audio/smb_jump-super.mp3");
        this.load.audio("powerupAppearsSFX", "/uploads/assets/super-mario/audio/smb_powerup_appears.mp3");
        this.load.audio("powerUpSFX", "/uploads/assets/super-mario/audio/smb_powerup.mp3");
        this.load.audio("coinSFX", "/uploads/assets/super-mario/audio/smb_coin.mp3");
        this.load.audio("bumpSFX", "/uploads/assets/super-mario/audio/smb_bump.mp3");
        this.load.audio("backgroundMusic", "/uploads/assets/super-mario/audio/BackgroundMusic.mp3")
        this.load.audio("gameOverSFX", "/uploads/assets/super-mario/audio/smb_gameover.mp3");
        this.load.audio("breakBlockSFX", "/uploads/assets/super-mario/audio/smb_breakblock.mp3");
        this.load.audio("world_clear", "/uploads/assets/super-mario/audio/smb_world_clear.mp3");
    }

    create() {
        // ANIMAÇÕES DO JOGADOR

        this.criarAnimacaoDoMario();
        this.criarAnimacaoDoLuigi();

        // BLOCOS INTERATIVOS

        this.anims.create(
            {
                key: "Surprise Block Ativo",
                frames: this.anims.generateFrameNumbers("surpriseBlock", { start: 0, end: 3 }),
                frameRate: 7,
                repeat: -1,
                repeatDelay: 10
            });

        // INIMIGOS

        this.anims.create(
            {
                key: "Surprise Block Inativo",
                frames: [{ key: "surpriseBlock", frame: 4 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Little Gomba Walking",
                frames: this.anims.generateFrameNumbers("LittleGomba", { start: 0, end: 1 }),
                frameRate: 8,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Little Gomba Dead",
                frames: [{ key: "LittleGomba", frame: 2 }],
                duration: 500,
                repeat: 0
            });
        this.anims.create(
            {
                key: "Koopa Troopa Walking",
                frames: this.anims.generateFrameNumbers("KoopaTroopa", { start: 0, end: 1 }),
                frameRate: 8,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Koopa Troopa Defend",
                frames: [{ key: "KoopaTroopa", frame: 2 }],
                duration: 500,
                repeat: 0
            });

        // HUD

        this.anims.create(
            {
                key: "Coin 1",
                frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 2 }),
                frameRate: 6,
                repeat: -1
            });

        this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2 + 48, "Pressione ENTER").setOrigin(0.5);
        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.on('down', function () {
            this.scene.start("MenuScene")
        }, this)
    }

    criarAnimacaoDoMario() {
        // MARIO
        this.anims.create(
            {
                key: "Mario Pequeno Walking",
                frames: this.anims.generateFrameNumbers("Mario Pequeno", { start: 6, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Pequeno Jump",
                frames: [{ key: "Mario Pequeno", frame: 1 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Pequeno Idle",
                frames: [{ key: "Mario Pequeno", frame: 0 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Pequeno Changing Direction",
                frames: [{ key: "Mario Pequeno", frame: 5 }],
                frameRate: 10,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Mario Pequeno Dead",
                frames: [{ key: "Mario Pequeno", frame: 2 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Grande Walking",
                frames: this.anims.generateFrameNumbers("Mario Grande", { start: 7, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Grande Jump",
                frames: [{ key: "Mario Grande", frame: 1 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Grande Idle",
                frames: [{ key: "Mario Grande", frame: 0 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Mario Grande Changing Direction",
                frames: [{ key: "Mario Grande", frame: 6 }],
                frameRate: 10,
                repeat: -1
            });
    }

    criarAnimacaoDoLuigi() {
        // LUIGI
        this.anims.create(
            {
                key: "Luigi Pequeno Idle",
                frames: [{ key: "Luigi Pequeno", frame: 0 }],
                frameRate: 10,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Luigi Pequeno Jump",
                frames: [{ key: "Luigi Pequeno", frame: 1 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Luigi Pequeno Dead",
                frames: [{ key: "Luigi Pequeno", frame: 2 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Luigi Pequeno Walking",
                frames: this.anims.generateFrameNumbers("Luigi Pequeno", { start: 6, end: 7 }),
                frameRate: 10,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Luigi Pequeno Changing Direction",
                frames: [{ key: "Luigi Pequeno", frame: 5 }],
                frameRate: 10,
                repeat: -1
            });

        this.anims.create(
            {
                key: "Luigi Grande Walking",
                frames: this.anims.generateFrameNumbers("Luigi Grande", { start: 7, end: 9 }),
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Luigi Grande Jump",
                frames: [{ key: "Luigi Grande", frame: 1 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Luigi Grande Idle",
                frames: [{ key: "Luigi Grande", frame: 0 }],
                frameRate: 10,
                repeat: -1
            });
        this.anims.create(
            {
                key: "Luigi Grande Changing Direction",
                frames: [{ key: "Luigi Grande", frame: 6 }],
                frameRate: 10,
                repeat: -1
            });


    }
}