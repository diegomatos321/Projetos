import * as Phaser from "phaser";
import "phaser/plugins/spine/dist/SpinePlugin";
import SpineDemoScene from "./SpineDemoScene";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	/* physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 }
		}
	}, */
	scene: [SpineDemoScene],
	plugins: {
		scene: [
			{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
		]
	}
}

const game: Phaser.Game = new Phaser.Game(config);