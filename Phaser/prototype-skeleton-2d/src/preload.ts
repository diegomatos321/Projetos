export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload" });
  }

  private preload = (): void => {
    this.load.atlas("loading", "./assets/animations/Bean Eater-1s-200px/loading-pacman.png", "./assets/animations/Bean Eater-1s-200px/loading-pacman.json");
    this.load.spine("spineboy", "./assets/characters/player/spineboy.json", "./assets/characters/player/spineboy.atlas");
    this.load.bitmapFont("typewrite", "./assets/fonts/mainfont_0.png", "./assets/fonts/mainfont.xml") 
  }

  private create = (): void => {
    this.anims.create({
      key: "loading_animation",
      frames: "loading",
      frameRate: 30,
      repeat: -1
    });

    this.scene.start("Menu");
  }
}