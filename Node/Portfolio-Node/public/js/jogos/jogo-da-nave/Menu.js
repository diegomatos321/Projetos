export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene")
    }

    create() {
        this.canvas = this.sys.game.canvas;

        this.bg = this.add.image(0, 0, "Fundo");
        this.bg.setOrigin(0)

        this.jogador = this.add.sprite(this.canvas.width / 2, this.canvas.height - 40, "Jogador");

        this.anims.create(
            {
                key: "Parado",
                frames: this.anims.generateFrameNumbers("Jogador", { start: 1, end: 2 }),
                frameRate: 10,
                repeat: -1
            });

        this.jogador.anims.play("Parado", true);
        let musicConfig = {
            mute: false,
            volume: 0.8,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }
        this.engine = this.sound.add("engineSFX", musicConfig);
        this.engine.play();
        this.startUp = this.sound.add("startUpSFX");

        this.txtIniciar = this.add.text(this.canvas.width / 2, this.canvas.height / 2, "Pressione ENTER para começar !")
        this.txtIniciar.setOrigin(0.5);

        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.on('down', function () {
            this.startUp.play();
            this.engine.stop();
            this.startUp.once('complete', () => {
                this.scene.start("GameScene");
            });
        }, this);
    }
}