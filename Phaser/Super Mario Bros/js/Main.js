import BootScene from "./Boot.js"
import LoadScene from "./Load.js"
import MenuScene from "./Menu.js"
import Level1 from "./Level1.js"
import GameOverScene from "./GameOverScene.js"

let config = {
    width: 240,
    height: 240,
    type: Phaser.AUTO,
    physics: {
        default: "arcade",
        arcade:{
            gravity:{y: 0},
            debug: false
        }
    },
    backgroundColor: "#5c94fc",
    pixelArt: true,
    scene: [BootScene, LoadScene, MenuScene, Level1, GameOverScene],
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

let game = new Phaser.Game(config);