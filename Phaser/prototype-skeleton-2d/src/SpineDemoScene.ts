export default class SpineDemoScene extends Phaser.Scene {
  constructor() {
    super({ key: "SpineDemo "});
  }

  private preload = (): void => {
    this.load.setPath("./");
    this.load.spine("spineboy", "spineboy.json", "spineboy.atlas");
  }

  private create = (): void => {
    this.add.spine(400, 600, "spineboy", "idle", true);
  }
}