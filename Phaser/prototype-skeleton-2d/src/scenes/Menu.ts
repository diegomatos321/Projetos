export default class Preload extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;
  private PAC_MAN: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "Menu" });
  }

  private init = (): void => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);
  }

  private create = (): void => {    
    this.PAC_MAN = this.add.sprite(-100, this.GAME_HEIGHT / 2 - 150, "loading");
    this.PAC_MAN.play("loading_animation");
    this.showPacMan();
  }

  private showPacMan = (): void => {
    this.tweens.add({
      targets: this.PAC_MAN,
      x: this.GAME_WIDTH / 2,
      ease: Phaser.Math.Easing.Cubic.Out,
      duration: 1000
    })
  }
}