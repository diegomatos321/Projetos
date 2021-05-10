import {CollisionHandler} from "./CollisionHandler.js";

export default class Brick
{
    constructor(game, position)
    {
        this.GAME_WIDTH = game.GAME_WIDTH;
        this.GAME_HEIGHT = game.GAME_HEIGHT;

        this.game = game;

        this.width = 80;
        this.height = 20;

        this.position = position;
        this.speed = 0;

        this.ATIVO = true;
    }
    
    draw(ctx)
    {
        ctx.fillStyle = "Peru";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "Brown";
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }
    
    update(deltaTime)
    {
        if(CollisionHandler(this.game.ball, this, deltaTime))
        {
            this.ATIVO = false;
            this.game.bricksInScene--;
        }
    }
}