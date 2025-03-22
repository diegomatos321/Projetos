import Game from './Game';
import WebGL from 'three/addons/capabilities/WebGL.js';

window.addEventListener('DOMContentLoaded', () => {
    if (WebGL.isWebGL2Available()) {
        const game = new Game();
        game.Start();
    } else {
        const warning = WebGL.getWebGL2ErrorMessage();
        document.getElementById('container')?.appendChild(warning);
    }
})
