export default class LoadScene extends Phaser.Scene{
    constructor(){
        super("LoadScene")
    }

    preload(){
        this.canvas = this.sys.game.canvas;
        let loadingBar = this.add.image(this.canvas.width/2 - 100, this.canvas.height/2 - 21, "loadingBar").setOrigin(0);

        let txtLoadingPerc = this.add.text(loadingBar.x + 100, loadingBar.y + 20 , "0%").setOrigin(0.5)

        let txtLoadingFile = this.add.text(loadingBar.x, loadingBar.y + 42 , "0%")

        this.load.on("progress", function (value){
            const fixedValue = value.toFixed(4)
            console.log(fixedValue)
            loadingBar.displayWidth = loadingBar.width * value;
            txtLoadingPerc.setText(`${fixedValue*100} %`)
        })

        this.load.on("fileprogress", function (file){
            console.log("fileprogress: " + file.src)
            txtLoadingFile.setText(`Carregando: ${file.key}`)
        })

        this.load.on("complete", function (){
            console.log("complete")
            txtLoadingFile.setText(` Jogo Carregado \n Pressione Enter`)
        })

        // CARREGAMENTO DAS IMAGENS
        this.load.image("Fundo", "/assets/imagens/jogo-da-nave/background.webp")
        this.load.image("Tiro", "/assets/imagens/jogo-da-nave/tiro.webp")

        // CARREGAMENTO DOS SPRITE SHEETS
        this.load.spritesheet("Inimigo", "/assets/imagens/jogo-da-nave/inimigo.webp", {
            frameWidth: 92, frameHeight: 100
        })

        this.load.spritesheet("Jogador", "/assets/imagens/jogo-da-nave/player.webp", {
            frameWidth: 39, frameHeight: 43
        })

        this.load.spritesheet("Explosion", "/assets/imagens/jogo-da-nave/explosion.webp", {
            frameWidth: 16, frameHeight: 16
        })

        // CARREGAMENTO DOS AUDIOS
        this.load.audio("motorSFX", "/assets/audio/jogo-da-nave/engine_sound.mp3")
        this.load.audio("explosaoSFX", "/assets/audio/jogo-da-nave/explosion_sound.mp3")
        this.load.audio("tiroSFX", "/assets/audio/jogo-da-nave/shoot_sound.mp3")
        this.load.audio("startUpSFX", "/assets/audio/jogo-da-nave/start-up_sound.mp3")
    }

    create(){
        // CRIANDO ANIMAÇÕES

        this.anims.create({
            key: "Parado",
            frames: this.anims.generateFrameNumbers("Jogador", {start: 1, end: 2}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "Esquerda",
            frames: this.anims.generateFrameNumbers("Jogador", {start: 4, end: 5}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "Direita",
            frames: this.anims.generateFrameNumbers("Jogador", {start: 7, end: 8}),
            frameRate: 10,
            repeat: -1
        });

        let explosao = this.anims.create({
            key: "Explosao",
            frames: this.anims.generateFrameNumbers("Explosion", {start: 0, end: 4}),
            frameRate: 10,
            repeat: 0
        });

        explosao.on("complete", (currentAnim, currentFrame, sprite) =>{
            sprite.destroy()
        })

        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.once("down", () =>{
            this.scene.start("MenuScene"); // FECHA A CENA ATUAL E INICIA A PRÓXIMO
        })
    }
}