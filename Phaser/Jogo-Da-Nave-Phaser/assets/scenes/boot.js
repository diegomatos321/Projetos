export default class Boot extends Phaser.Scene{
    constructor(){
        super("BootScene")
    }

    preload(){
        this.load.image("loadingBar", "./assets/imagens/loadingBar.webp")
    }

    create(){
        this.scene.start("LoadScene");
    }
}

