import * as Phaser from "phaser";
import "phaser/plugins/spine/dist/SpinePlugin";
import Preload from "./preload";
import Menu from "./scenes/Menu";
import MainGame from "./scenes/MainGame";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1024,
	height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
	physics: {
		default: 'arcade',
		arcade: {
      debug: true,
      gravity: { y: 1200 }
		}
	},
	scene: [Preload, Menu, MainGame],
	plugins: {
		scene: [
			{ key: 'SpinePlugin', plugin: window.SpinePlugin, mapping: 'spine' }
		]
	}
}

const game: Phaser.Game = new Phaser.Game(config);