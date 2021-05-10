// Game Layers

let uiLayer = document.getElementById("ui-layer");
let uiLayer_ctx = uiLayer.getContext("2d");

let gameLayer = document.getElementById("game-layer");
let gameLayer_ctx = gameLayer.getContext("2d");

// Declarando as variáveis globais

let galeria = {
    imagens: {},
    spriteSheets: {},
    audios: {}
}

// Outras Variaveis

let Input = new InputHandler();
let tempoInicial, deltaTime, game;

let totalDeArquivos = 0;

const GAME_WIDTH = gameLayer.width;
const GAME_HEIGHT = gameLayer.height;

// Carregando as imagens

function init() {
    let imagens = [["background_img", "./assets/imagens/background.png"], ["tiro_img", "./assets/imagens/tiro.png"]];
    imagens = new Map(imagens);

    let spriteSheets = [["jogador_sprite", "./assets/imagens/player.png"], ["inimigo01_sprite", "./assets/imagens/ship.png"], ["explosion_sprite", "./assets/imagens/explosion.png"]]
    spriteSheets = new Map(spriteSheets);

    let audios = [["engine_sound", "./assets/audio/engine_sound.mp3"], ["explosion_sound", "./assets/audio/explosion_sound.mp3"], ["shoot_sound", "./assets/audio/shoot_sound.mp3"], ["start-up_sound", "./assets/audio/start-up_sound.mp3"]]
    audios = new Map(audios);

    imagens.forEach((value, key) => {
        CarregarArquivo(key, value, startGame)
    });

    spriteSheets.forEach((value, key) => {
        CarregarArquivo(key, value, startGame)
    });

    audios.forEach((value, key) => {
        CarregarArquivo(key, value, startGame)
    });
}

function startGame() {
    window.requestAnimationFrame(gameLoop);
    tempoInicial = 0;
    game = new Game();
}

function gameLoop(tempoAtual) {
    window.requestAnimationFrame(gameLoop);

    tempoAtual /= 1000;
    deltaTime = tempoAtual - tempoInicial;
    tempoInicial = tempoAtual;

    gameLayer_ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    game.update();
    game.draw();
}

init();