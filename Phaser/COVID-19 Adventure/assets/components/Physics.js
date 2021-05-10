
// You can write more code here

/* START OF COMPILED CODE */

class Physics {
	
	constructor(gameObject) {
		gameObject["__Physics"] = this;
		
		/** @type {Phaser.GameObjects.Sprite} */
		this.gameObject = gameObject;
		/** @type {boolean} */
		this.isCircle = false;
		/** @type {number} */
		this.proporcaoCaixaColisao = 1;
		
		/* START-USER-CTR-CODE */

		this.scene = gameObject.scene;
		this.scene.physics.add.existing(this.gameObject)

		// first time the scene is updated, call the `start` method
		this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);

		// each time the scene is updated, call the `update` method
		this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);

		// if the object is destroyed, call the `destroy` method
		gameObject.on(Phaser.GameObjects.Events.DESTROY, this.destroy, this);

		/* END-USER-CTR-CODE */
	}
	
	/** @returns {Physics} */
	static getComponent(gameObject) {
		return gameObject["__Physics"];
	}
	
	/* START-USER-CODE */

	start() {
		if (this.isCircle) {
			const raio = this.gameObject.width / 2
			const offset = 1 - this.proporcaoCaixaColisao
			this.gameObject.body.setCircle(raio * this.proporcaoCaixaColisao, raio * offset, raio * offset)
			// this.gameObject.refreshBody()
		}
	}

	update() {
		// to be overridden in derived classes
	}

	destroy() {
		// the object is destroyed, so we remove all the event handlers
		this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
		this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
