
// You can write more code here

/* START OF COMPILED CODE */

class Level extends Phaser.Scene {
	
	constructor() {
		super("Level");
		
		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}
	
	create() {
		
		// background
		const background = this.add.image(430, 299, "background");
		background.scaleX = 2;
		background.scaleY = 3;
		
		// player
		const player = new Player(this, 272, 352);
		this.add.existing(player);
	}
	
	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
