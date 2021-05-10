window.addEventListener('load', function () {

	const config = {
		width: 800,
		height: 600,
		type: Phaser.AUTO,
		physics: {
			default : "arcade",
			arcade : {
				gravity : 0,
				debug : true
			}
		},
        backgroundColor: "#882122",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		}
	}

	var game = new Phaser.Game(config);
	
	game.scene.add("Boot", Boot, true);

});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/asset-pack.json");
	}

	create() {
		
		this.scene.start("Level");
	}

}