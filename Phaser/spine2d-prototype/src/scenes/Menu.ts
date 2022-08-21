export default class Preload extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;
  private character: SpineGameObject;
  private startText: Phaser.GameObjects.BitmapText;

  constructor() {
    super({ key: "Menu" });
  }

  private init = (): void => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.height);
  }

  private preload = (): void => {
  }

  private create = (): void => {
    this.character = this.add.spine(-80, this.GAME_HEIGHT / 2 + 50, "spineboy", "run", true).setScale(0.5).setData({
      onScreen: false,
      isTrasitionToMainGame: false
    }).setMix("run", "idle", .250).setMix("idle", "run", .250);
    this.showcharacter();

    this.startText = this.add.bitmapText(this.GAME_WIDTH / 2, this.character.y + 50, "typewrite", "Clique na tela para começar").setOrigin(0.5).setVisible(false);

    this.input.addListener(Phaser.Input.Events.POINTER_DOWN, this.tryGoToMainGame);
    this.events.addListener(Phaser.Scenes.Events.SHUTDOWN, this.cleanEvents);
  }

  private showcharacter = (): void => {
    this.tweens.add({
      targets: this.character,
      x: this.GAME_WIDTH / 2,
      ease: Phaser.Math.Easing.Cubic.In,
      duration: 1000,
      onComplete: (tween: Phaser.Types.Tweens.TweenBuilderConfig, targets: Array<SpineGameObject>): void => {
        let character: SpineGameObject = targets[0];
        this.startText.setVisible(true);
        character.setData("onScreen", true);
        character.play("idle", true);
      }
    })
  }

  private tryGoToMainGame = () => {
    if (this.character.getData("onScreen") === false || this.character.getData("isTrasitionToMainGame") === true) return;

    this.character.setData("isTrasitionToMainGame", true);
    this.character.play("run");
    this.startText.setVisible(false);

    this.tweens.add({
      targets: this.character,
      x: this.GAME_WIDTH + this.character.displayWidth,
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