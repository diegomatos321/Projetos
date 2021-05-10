export default class BootScene extends Phaser.Scene{
    constructor(){
        super("BootScene")
    }

    preload(){
        this.load.image("loadingBar", "/uploads/assets/super-mario/imagens/loadingBar.webp")
    }

    create(){
        this.scene.start("LoadScene");
    }
}