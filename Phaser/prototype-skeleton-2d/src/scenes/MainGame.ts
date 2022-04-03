export default class MainGame extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;

  private player: SpineGameObject;

  constructor() {
    super({ key: "MainGame"});
  }

  private init = () => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.width);
  }

  private preload = (): void => {
    
  }

  private create = (): void => {
    this.player = this.add.spine(250, 550, "spineboy", "idle", true).setScale(0.3);

    this.physics.add.existing(this.player);
    
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setCollideWorldBounds(true);

    this.add.bitmapText(this.GAME_WIDTH / 2, 20, "typewrite", "Teste de Fonte").setOrigin(0.5).setFontSize(64);
  }
}