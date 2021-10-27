// SOLID
// 1º Principio: Princípio de única responsabilidade
import BootScene from "./assets/scenes/boot.js"
import LoadScene from "./assets/scenes/load.js"
import MenuScene from "./assets/scenes/menu.js"
import GameScene from "./assets/scenes/game.js"

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