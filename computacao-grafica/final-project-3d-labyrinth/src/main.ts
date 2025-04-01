import Game from './Game';
import WebGL from 'three/addons/capabilities/WebGL.js';
import MazeLevelScene from './Scenes/MazeLevelScene';
import MenuScene from './Scenes/MenuScene';
import LevelFinishedScene from './Scenes/LevelFinishedScene';

window.addEventListener('DOMContentLoaded', () => {
    if (WebGL.isWebGL2Available()) {
        new Game([
            new MenuScene(),
            new MazeLevelScene(),
            new LevelFinishedScene(),
        ]);
    } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById('container')?.appendChild(warning);
    }
})
