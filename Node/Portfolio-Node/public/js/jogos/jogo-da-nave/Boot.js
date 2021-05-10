export default class BootScene extends Phaser.Scene{
    constructor(){
        super("BootScene")
    }

    preload(){
        this.load.image("loadingBar", "/uploads/assets/jogo-da-nave/imagens/loadingBar.webp")
    }

    create(){
        this.scene.start("LoadScene");
    }
}