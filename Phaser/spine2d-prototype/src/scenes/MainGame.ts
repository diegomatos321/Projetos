import Player from "../characters/Player";

export default class MainGame extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;
  private player: Player;

  constructor() {
    super({ key: "MainGame"});
  }

  private init = () => {
    this.GAME_WIDTH = Number(this.game.config.width);
    this.GAME_HEIGHT = Number(this.game.config.width);
  }

  private create = (): void => {
    this.player = new Player(this, 250, 550);
    this.add.bitmapText(this.GAME_WIDTH / 2, 20, "typewrite", "Teste de Fonte").setOrigin(0.5).setFontSize(64);
  }

  update = (time: number, delta: number): void => {
    this.player.update(); 
  }
}