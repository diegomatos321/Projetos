
// You can write more code here

/* START OF COMPILED CODE */

class Player extends Phaser.GameObjects.Sprite {
	
	constructor(scene, x, y, texture, frame) {
		super(scene, x, y, texture || "player", frame);
		
		this.scaleX = 0.2;
		this.scaleY = 0.2;
		
		// this (components)
		const thisPhysics = new Physics(this);
		thisPhysics.isCircle = true;
		thisPhysics.proporcaoCaixaColisao = 0.75;
		new PlayerMovement(this);
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
