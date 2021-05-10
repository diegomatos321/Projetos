
// You can write more code here

/* START OF COMPILED CODE */

class PlayerMovement {

	constructor(gameObject) {
		gameObject["__PlayerMovement"] = this;

		/** @type {Phaser.GameObjects.Image} */
		this.gameObject = gameObject;

		/* START-USER-CTR-CODE */
		this.scene = gameObject.scene;

		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);

		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

		gameObject.on(Phaser.GameObjects.Events.DESTROY, this.destroy, this);
		/* END-USER-CTR-CODE */
	}

	/** @returns {PlayerMovement} */
	static getComponent(gameObject) {
		return gameObject["__PlayerMovement"];
	}
	
	start() {
		this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.mirarEmDirecaoAoPonteiro, this )
	}

	update() {
		// to be overridden in derived classes
	}

	mirarEmDirecaoAoPonteiro(pointer) {
		// console.dir(pointer)
		const pointerVec = new Phaser.Math.Vector2(pointer.x, pointer.y)
		let playerVec = new Phaser.Math.Vector2(this.gameObject.x, this.gameObject.y)

		const vecDiff = pointerVec.subtract(playerVec);
		const radAngle = vecDiff.angle()

		this.gameObject.angle = Phaser.Math.RadToDeg(radAngle)
		// playerVec.setAngle(radAngle)
	}

	destroy() {
		// the object is destroyed, so we remove all the event handlers
		this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
		this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
		this.scene.events.off(Phaser.Input.Events.POINTER_MOVE, this.mirarEmDirecaoAoPonteiro, this);
	}
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
