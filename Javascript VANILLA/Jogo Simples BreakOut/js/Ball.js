import {CollisionHandler} from "./CollisionHandler.js";
import {ball_img} from "./main.js";

export default class Ball
{
    constructor(game)
    {
        this.img = ball_img;

        this.GAME_WIDTH = game.GAME_WIDTH;
        this.GAME_HEIGHT = game.GAME_HEIGHT;

        this.game = game;

        this.size = 32;

        this.ATIVO = true;

        this.speed = { x: 120, y: -80}
        this.maxSpeed = {x: 120, y: -80}

        this.position = {
            x: this.GAME_WIDTH / 2 - this.size / 2,
            y: this.GAME_HEIGHT / 2 - this.size / 2
        }

    }

    draw(ctx)
    {     
        ctx.drawImage(this.img, this.position.x, this.position.y, this.size, this.size)
    }

    update(deltaTime)
    {       
        // Bola e Paddle

        CollisionHandler(this, this.game.paddle, deltaTime);

        // Modifica a posição
        this.position.x += this.speed.x / deltaTime;
        this.position.y += this.speed.y / deltaTime;
        
        // Manter na tela
        
        this.ClampOnTheWindow();
    }
    
    ClampOnTheWindow()
    {
        // Parede à esquerda ou direita

        if (this.position.x <= 0 )
        {
            this.position.x = 0;
            this.speed.x = -this.speed.x;
        }
        if (this.position.x + this.size >= this.GAME_WIDTH)
        {
            this.position.x = this.GAME_WIDTH - this.size;
            this.speed.x = -this.speed.x;
        }

        // Parede em cima ou embaixo
        if (this.position.y <= 0)
        {
            this.position.y = 0;
            this.speed.y = -this.speed.y;
        }
        if (this.position.y + this.size >= this.GAME_HEIGHT)
        {
            this.position.y = this.GAME_HEIGHT - this.size;
            this.speed.y = -this.speed.y;

            this.game.lives--;

            this.resetPosition();
        }
    }

    resetPosition()
    {
        this.position = 
        {
            x: this.GAME_WIDTH / 2 - this.size / 2,
            y: this.GAME_HEIGHT / 2 - this.size / 2
        }
    }

}
