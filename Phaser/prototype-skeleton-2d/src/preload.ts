export default class Preload extends Phaser.Scene {
  constructor() {
    super({ key: "Preload" });
  }

  private preload = (): void => {
    this.load.atlas("loading", "./assets/animations/Bean Eater-1s-200px/loading-pacman.png", "./assets/animations/Bean Eater-1s-200px/loading-pacman.json")
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