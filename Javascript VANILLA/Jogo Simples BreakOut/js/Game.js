import Paddle from "./Paddle.js"
import Ball from "./Ball.js"
import InputHandler from "./InputHandler.js"

import {buildLevel, LEVEL1, LEVEL2} from "./Levels.js"

const GAME_STATE = 
{
    PAUSED: 0,
    RUNNING: 1,
    MENU: 2,
    GAME_OVER: 3,
    LOAD_LEVEL: 4
}

export default class Game
{
    constructor(GAME_WIDTH, GAME_HEIGHT)
    {
        this.GAME_WIDTH = GAME_WIDTH;
        this.GAME_HEIGHT = GAME_HEIGHT;
        
        this.gameState = GAME_STATE.MENU;

        this.paddle = new Paddle(this);
        this.ball = new Ball(this);

        this.levels = [LEVEL1, LEVEL2];
        this.currentLevel = 0;
        this.bricksInScene = -1;

        this.lives = 3;
        
        new InputHandler(this.paddle, this);
    }

    start()
    {
        if (this.gameState == GAME_STATE.RUNNING){ return;}

        this.reset();
        this.gameState = GAME_STATE.RUNNING;

        console.log(this.currentLevel);
        const bricks = buildLevel(this, this.levels[this.currentLevel]);
        this.bricksInScene = bricks.length;
        this.gameObjects = [this.paddle, this.ball, ...bricks];
    }

    update(deltaTime)
    {
        if (this.gameState != GAME_STATE.RUNNING){ return;}
        
        this.gameObjects = this.gameObjects.filter((gameObject) => { return gameObject.ATIVO == true});
        this.gameObjects.forEach((object) => object.update(deltaTime));

        if(this.lives <= 0)
        {
            this.gameState = GAME_STATE.GAME_OVER;
        }

        if(this.bricksInScene == 0)
        {
            this.loadLevel();
        }
    }

    draw(ctx)
    {    
        
        if(this.gameState == GAME_STATE.MENU)
        { 
            ctx.fillStyle = "rgba(0, 0, 0, 1)"
            ctx.fillRect(0,0, this.GAME_WIDTH, this.GAME_HEIGHT);

            ctx.font = "30px Arial";
            ctx.fillStyle = "white"
            ctx.textAlign = "center";
            ctx.fillText("Pressione ESPAÇO começar", this.GAME_WIDTH/2, this.GAME_HEIGHT/2);
            
            // Instruções

            ctx.font = "18px Arial";        
            ctx.fillText(`Como Jogar: `, 60, this.GAME_HEIGHT - 90);
            ctx.fillText(`=> Nao deixe a bolinha cair`, 120, this.GAME_HEIGHT - 72);
            ctx.fillText(`=> Mover para a esquerda: <LEFT ARROW>`, 191, this.GAME_HEIGHT - 54);
            ctx.fillText(`=> Mover para a direita: <RIGHT ARROW>`, 184, this.GAME_HEIGHT - 36);
            ctx.fillText(`=> Pausar: <P>`, 73, this.GAME_HEIGHT - 18);

            return;
        }

        this.gameObjects.forEach((object) => object.draw(ctx));
  
        if(this.gameState == GAME_STATE.PAUSED) 
        { 
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
            ctx.fillRect(0,0, this.GAME_WIDTH, this.GAME_HEIGHT);

            ctx.font = "30px Arial";
            ctx.fillStyle = "white"
            ctx.textAlign = "center";
            ctx.fillText("Jogo Pausado", this.GAME_WIDTH/2, this.GAME_HEIGHT/2);

            // Instruções

            ctx.font = "18px Arial";
            ctx.fillText(`Como Jogar: `, 60, this.GAME_HEIGHT - 90);
            ctx.fillText(`=> Nao deixe a bolinha cair`, 120, this.GAME_HEIGHT - 72);
            ctx.fillText(`=> Mover para a esquerda: <LEFT ARROW>`, 191, this.GAME_HEIGHT - 54);
            ctx.fillText(`=> Mover para a direita: <RIGHT ARROW>`, 184, this.GAME_HEIGHT - 36);
            ctx.fillText(`=> Pausar: <P>`, 73, this.GAME_HEIGHT - 18);

        }
              
        if(this.gameState == GAME_STATE.GAME_OVER) 
        { 
            ctx.fillStyle = "rgba(242, 38, 19, 0.8)"
            ctx.fillRect(0,0, this.GAME_WIDTH, this.GAME_HEIGHT);

            ctx.font = "30px Arial";
            ctx.fillStyle = "white"
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", this.GAME_WIDTH/2, this.GAME_HEIGHT/2);
            ctx.fillText("Pressione ESPAÇO Continuar", this.GAME_WIDTH/2, this.GAME_HEIGHT/2 + 30);

            // Instruções

            ctx.font = "18px Arial";
            ctx.fillText(`Como Jogar: `, 60, this.GAME_HEIGHT - 90);
            ctx.fillText(`=> Nao deixe a bolinha cair`, 120, this.GAME_HEIGHT - 72);
            ctx.fillText(`=> Mover para a esquerda: <LEFT ARROW>`, 191, this.GAME_HEIGHT - 54);
            ctx.fillText(`=> Mover para a direita: <RIGHT ARROW>`, 184, this.GAME_HEIGHT - 36);
            ctx.fillText(`=> Pausar: <P>`, 73, this.GAME_HEIGHT - 18);

            return
        }

        this.drawHUD(ctx);
    }

    tooglePause()
    {
        if(this.gameState == GAME_STATE.PAUSED)
        {
            this.gameState = GAME_STATE.RUNNING;
        }
        else if (this.gameState == GAME_STATE.RUNNING)
        {
            this.gameState = GAME_STATE.PAUSED;
        }
    }

    loadLevel()
    {
        this.gameState = GAME_STATE.LOAD_LEVEL;
        this.currentLevel++;

        //this.draw();
        this.start();
    }

    reset()
    {
        this.lives = 3;

        this.ball.position = {
            x: this.GAME_WIDTH / 2 - this.ball.size / 2,
            y: this.GAME_HEIGHT / 2 - this.ball.size / 2
        }
        this.ball.speed = 
        { 
            x: 120, 
            y: -80
        }
    }
    
    drawHUD(ctx)
    {
        ctx.font = "16px Arial";
        ctx.fillStyle = "black"
        ctx.textAlign = "center";
        ctx.fillText(`Vidas: ${this.lives}`, this.GAME_WIDTH - 40, 30);
    }
}