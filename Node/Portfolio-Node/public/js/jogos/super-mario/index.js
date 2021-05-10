import BootScene from "./Boot.js"
import LoadScene from "./Load.js"
import MenuScene from "./Menu.js"
import GameOverScene from "./GameOverScene.js"
import Level1 from "./Level1.js"

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
    parent: "jogo-container",
    backgroundColor: "#5c94fc",
    pixelArt: true,
    scene: [BootScene, LoadScene, MenuScene, GameOverScene, Level1],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
}

let game = new Phaser.Game(config);