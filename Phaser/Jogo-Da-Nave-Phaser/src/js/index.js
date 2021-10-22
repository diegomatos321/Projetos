// SOLID
// 1º Principio: Princípio de única responsabilidade
import BootScene from "./boot.js"
import LoadScene from "./load.js"
import MenuScene from "./menu.js"
import GameScene from "./game.js"

let config = {
    width: 320,
    height: 480,
    type: Phaser.AUTO,
    physics: {
        default: "arcade"
    },
    scene: [BootScene, LoadScene, MenuScene, GameScene],
    parent: "jogo-container",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    pixelArt: true
}

let game = new Phaser.Game(config)