export default class MainGame extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;

  private Player: SpineGameObject;

  constructor() {
    super({ key: "MainGame"});
  }

  private init = () => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.width);
  }

  private preload = (): void => {
    this.load.spine("spineboy", "./assets/characters/player/spineboy.json", "./assets/characters/player/spineboy.atlas");
  }

  private create = (): void => {
    this.Player = this.add.spine(400, 600, "spineboy", "idle", true).setScale(0.5);
    this.add.bitmapText(this.GAME_WIDTH / 2, 20, "typewrite", "Teste de Fonte").setOrigin(0.5).setFontSize(64);
  }
}