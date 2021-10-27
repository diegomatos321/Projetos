export default class Menu extends Phaser.Scene{
    constructor(){
        super("MenuScene")
    }

    init(){
        let {width, height} = this.sys.game.canvas;

        this.largura = width;
        this.altura = height;
    }
    create(){
        this.fundo = this.add.image(0, 0, "Fundo").setOrigin(0);
        this.jogador = this.add.sprite(this.largura / 2, this.altura - 100, "Jogador");
        this.jogador.anims.play("Parado");

        this.somDoMotor = this.sound.add("motorSFX", {
            loop: true,
            volume: 0.5
        });
        this.somDoMotor.play();

        this.somStartUp = this.sound.add("startUpSFX");

        this.txtIniciar = this.add.text(this.largura/2, this.altura/2 , "Pressione Enter para iniciar").setOrigin(0.5)

        let enterKey = this.input.keyboard.addKey("ENTER");
        enterKey.once("down", () =>{
            console.log("IGNIÇÃO !!");
            this.somDoMotor.stop();
            this.somStartUp.play();

            this.somStartUp.once("complete", ()=>{
                this.scene.start("GameScene")
            })
        })
    }
}