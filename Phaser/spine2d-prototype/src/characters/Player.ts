export default class Player extends Phaser.GameObjects.Container {
  private skeleton: SpineGameObject;
  private LEFT_KEY: Phaser.Input.Keyboard.Key;
  private RIGHT_KEY: Phaser.Input.Keyboard.Key;
  private UP_KEY: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.skeleton = this.scene.add.spine(0, 0, "spineboy", "idle", true);
    this.skeleton.stateData.defaultMix = 0.250;

    let body = this.body as Phaser.Physics.Arcade.Body;
    let width = this.skeleton.getBounds().size.x, height = this.skeleton.getBounds().size.y;
    body.setOffset(width * -0.5, -height);
    body.setSize(width, height);
    body.setCollideWorldBounds(true);

    this.add(this.skeleton);

    this.setScale(0.5);

    this.LEFT_KEY = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.RIGHT_KEY = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.UP_KEY = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  update = (): void => {
    const containerBody = this.body as Phaser.Physics.Arcade.Body;
    containerBody.setVelocityX(0);
    this.skeleton.play("idle", true, true);

    if (this.scene.input.keyboard.checkDown(this.RIGHT_KEY)) {
      containerBody.setVelocityX(100);
      this.skeleton.scaleX = 1;
      this.skeleton.play("run", true, true);
    } else if (this.scene.input.keyboard.checkDown(this.LEFT_KEY)) {
      this.skeleton.scaleX = -1;
      containerBody.setVelocityX(-100);
      this.skeleton.play("run", true, true);
    }

    if (Phaser.Input.Keyboard.JustDown(this.UP_KEY)) {
      containerBody.setVelocityY(-1500);
      this.skeleton.play("jump", false, true);
    }
  }
}