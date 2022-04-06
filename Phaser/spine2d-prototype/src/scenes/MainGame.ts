export default class MainGame extends Phaser.Scene {
  private GAME_WIDTH: number;
  private GAME_HEIGHT: number;
  private player: SpineGameObject;
  private ONE_KEY: Phaser.Input.Keyboard.Key;
  private TWO_KEY: Phaser.Input.Keyboard.Key;
  private THREE_KEY: Phaser.Input.Keyboard.Key;
  private FOUR_KEY: Phaser.Input.Keyboard.Key;
  private FIVE_KEY: Phaser.Input.Keyboard.Key;
  private LEFT_KEY: Phaser.Input.Keyboard.Key;
  private RIGHT_KEY: Phaser.Input.Keyboard.Key;
  private UP_KEY: Phaser.Input.Keyboard.Key;
  private overrideDefault: boolean = false;
  private playerContainer: Phaser.GameObjects.Container;

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
    this.player = this.add.spine(0, 0, "spineboy", "idle", true);
    this.player.stateData.defaultMix = 0.250;
    // console.dir(this.player.skeleton)
    this.playerContainer = this.add.container(250, 550, this.player);
    this.physics.add.existing(this.playerContainer);
    
    let body = this.playerContainer.body as Phaser.Physics.Arcade.Body;
    let width = this.player.getBounds().size.x, height = this.player.getBounds().size.y;
    body.setOffset(width * -0.5, -height);
    body.setSize(width, height);
    body.setCollideWorldBounds(true);
    
    this.playerContainer.setScale(0.5);
    console.log(this.player.getAnimationList())

    this.add.bitmapText(this.GAME_WIDTH / 2, 20, "typewrite", "Teste de Fonte").setOrigin(0.5).setFontSize(64);

    this.ONE_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    this.TWO_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    this.THREE_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    this.FOUR_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
    this.FIVE_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
    this.LEFT_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.RIGHT_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.UP_KEY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
  }

  update = (): void => {
    if (Phaser.Input.Keyboard.JustDown(this.ONE_KEY)) {
      this.player.play("idle", true);
      this.overrideDefault = true;
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.TWO_KEY)) {
      this.player.play("run", true);
      this.overrideDefault = true;
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.THREE_KEY)) {
      this.player.play("hit");
      this.overrideDefault = true;
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.FOUR_KEY)) {
      this.player.play("jump");
      this.overrideDefault = true;
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.FIVE_KEY)) {
      this.player.play("death");
      this.overrideDefault = true;
      return;
    }

    if (this.input.keyboard.checkDown(this.RIGHT_KEY)) {
      const containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
      containerBody.setVelocityX(100);
      this.player.scaleX = 1;
      this.player.play("run", true, true);
      this.overrideDefault = false;
    } else if (this.input.keyboard.checkDown(this.LEFT_KEY)) {
      const containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
      this.player.scaleX = -1;
      containerBody.setVelocityX(-100);
      this.player.play("run", true, true);
      this.overrideDefault = false;
    } else if (this.overrideDefault === false) {
      const containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;
      containerBody.setVelocityX(0);
      this.player.play("idle", true, true);
    }
  }
}