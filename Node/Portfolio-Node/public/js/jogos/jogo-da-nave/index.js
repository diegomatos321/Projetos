import BootScene from "./Boot.js"
import LoadScene from "./Load.js"
import MenuScene from "./Menu.js"
import GameScene from "./GameScene.js"

let config = {
    width: 320,
    height: 480,
    type: Phaser.AUTO,
    physics: {
        default: "arcade"
    },
    parent: "jogo-container",
    scene: [BootScene, LoadScene, MenuScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT ,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true
}

let game = new Phaser.Game(config);