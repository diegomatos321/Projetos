import snake from "./snake.js"
import food from "./food.js"
import InputHandler from "./inputHandler.js";
import Menu from "./menu.js"

// CANVAS
let canvas = document.getElementById("GameScreen");
let ctx = canvas.getContext("2d");

// Carregando as imagens

let food_img = new Image();
food_img.src = "./imagens/apple.png";

// Variáveis globais

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

let foods = [];
let player, inputHandler;
let dificuldade = 1000;
let menu;

let tempoInicial = 0, tempoPercorrido;

let GAME_STATE = "MENU"
// Iniciar ao carregar

window.onload = () => {
    foods = [new food(GAME_WIDTH, GAME_HEIGHT, food_img)]; // Inicialmente teria varias comidas com o decorrer do jogo, mas eu fiquei com preguiça

    player = new snake(GAME_WIDTH, GAME_HEIGHT, foods); // Cria o jogador
    menu = new Menu(GAME_WIDTH, GAME_HEIGHT, dificuldade, GAME_STATE); // Cria uma instancia do menu

    inputHandler = new InputHandler(); // Cria um objeto responsável pelo Input

    startGame(); // Inicia o jogo
}

function startGame() {
    if (GAME_STATE == "RUNNING") {
        window.requestAnimationFrame(gameLoop)
    } else if (GAME_STATE == "MENU") {
        telaInicial();
    }
}

function gameLoop(tempoAtual) {
    let deltaTime = tempoAtual - tempoInicial;
    tempoInicial = tempoAtual;

    tempoPercorrido += deltaTime;

    if (tempoPercorrido < dificuldade) { 
        window.requestAnimationFrame(gameLoop)
        return;
    }
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (inputHandler.KeyDown == 80) {
        tooglePaused()
        inputHandler.keyDown = undefined;
    }
    if (GAME_STATE == "RUNNING") {
        player.update(inputHandler.KeyDown);
    }
    player.draw(ctx);

    foods.forEach(food => {
        food.draw(ctx);
    });

    if (GAME_STATE == "PAUSED") {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("JOGO PAUSADO", GAME_WIDTH / 2, GAME_HEIGHT / 2)
    }
    tempoPercorrido = 0;
    window.requestAnimationFrame(gameLoop)
}

let requestID;

function telaInicial() {
    requestID = window.requestAnimationFrame(telaInicial);

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    menu.update(inputHandler.KeyDown);

    if (inputHandler.KeyDown == 13) { // Apertou ENTER
        GAME_STATE = "RUNNING"; // Muda o GAME STATE
        dificuldade = menu.atribuirDificuldade; // Defini a dificuldade
        inputHandler.keyDown = undefined; // Redefini para undefined, para nao gerar problemas
        cancelAnimationFrame(requestID); // Para o loop telaInicial()
        startGame(); // Novamente chama a função startGame, dessa vez com novo GAME STATE
        return; // Voltar
    }

    inputHandler.keyDown = undefined;
    menu.draw(ctx);
}
function tooglePaused() {
    if (GAME_STATE == "RUNNING") {
        GAME_STATE = "PAUSED";
    } else if (GAME_STATE == "PAUSED") {
        GAME_STATE = "RUNNING";
    }
}