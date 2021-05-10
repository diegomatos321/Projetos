/* ====== PARTE 01 ======

import Paddle from "./Paddle.js"
import Ball from "./Ball.js"
import InputHandler from "./input.js"

let canvas = document.getElementById("GameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 640;
const GAME_HEIGHT = 600;

let paddle = new Paddle(GAME_WIDTH, GAME_HEIGHT);
paddle.draw(ctx);

let ball = new Ball(GAME_WIDTH, GAME_HEIGHT, [paddle]);
ball.draw(ctx);

new InputHandler(paddle);
let lastTime = 0;

function gameLoop(timeStamp)
{
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT);

    paddle.update(deltaTime);
    paddle.draw(ctx);

    ball.update(deltaTime);
    ball.draw(ctx);

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop); // Olhar API

*/

// ====== PARTE 02 ======
import Game from "./Game.js"

let canvas = document.getElementById("GameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 640;
const GAME_HEIGHT = 600;

let lastTime = 0;

// CARREGANDO AS IMAGENS

export let ball_img = new Image();
ball_img.src = "./imagens/ball.png";

let game = new Game (GAME_WIDTH, GAME_HEIGHT);

window.onload = () => {window.requestAnimationFrame(gameLoop);}

function gameLoop(timeStamp)
{
    window.requestAnimationFrame(gameLoop);

    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;

    ctx.clearRect(0,0, GAME_WIDTH, GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);

}


