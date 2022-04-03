export default class Preload extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;
  private pacMan: Phaser.GameObjects.Sprite;

  constructor() {
    super({ key: "Menu" });
  }

  private init = (): void => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);
  }

  private preload = (): void => {
    this.pacMan = this.add.sprite(-100, this.GAME_HEIGHT / 2 - 150, "loading").setData({
      onScreen: false,
      isTrasitionToMainGame: false
    });
    this.pacMan.play("loading_animation");
    this.showPacMan();

    this.load.bitmapFont("typewrite", "./assets/fonts/mainfont_0.png", "./assets/fonts/mainfont.xml") 
  }

  private create = (): void => {    
    this.input.addListener(Phaser.Input.Events.POINTER_DOWN, this.tryGoToMainGame);
    this.events.addListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  private showPacMan = (): void => {
    this.tweens.add({
      targets: this.pacMan,
      x: this.GAME_WIDTH / 2,
      ease: Phaser.Math.Easing.Cubic.In,
      duration: 1000,
      completeDelay: 300,
      onComplete: (tween: Phaser.Types.Tweens.TweenBuilderConfig, targets: Array<Phaser.GameObjects.Sprite>): void => {
        this.add.bitmapText(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2, "typewrite", "Clique na tela para começar").setOrigin(0.5);
        targets[0].setData("onScreen", true);
      }
    })
  }

  private tryGoToMainGame = () => {
    if (this.pacMan.getData("onScreen") === false || this.pacMan.getData("isTrasitionToMainGame") === true) return;

    this.pacMan.setData("isTrasitionToMainGame", true);

    this.tweens.add({
      targets: this.pacMan,
      x: this.GAME_WIDTH + this.pacMan.width,
      ease: Phaser.Math.Easing.Cubic.In,
      duration: 1000,
      completeDelay: 500,
      onComplete: this.goToMainScene
    })
  }

  private goToMainScene = () => {
    this.scene.start("MainGame")
  }

  private cleanEvents = () => {
    this.input.removeListener(Phaser.Input.Events.POINTER_DOWN, this.tryGoToMainGame);
    this.events.removeListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }
}