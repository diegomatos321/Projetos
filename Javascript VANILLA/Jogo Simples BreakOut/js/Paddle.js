export default class Paddle
{
    constructor(game)
    {
        this.width = 150;
        this.height = 30;

        this.GAME_WIDTH = game.GAME_WIDTH;
        this.GAME_HEIGHT = game.GAME_HEIGHT;

        this.maxSpeed = 160;
        this.speed = 0;

        this.ATIVO = true;
        
        this.position = {
            x: this.GAME_WIDTH / 2 - this.width / 2,
            y: this.GAME_HEIGHT - this.height - 10
        }
    }           

    move(dir)
    {
        switch(dir)
        {
            case "Parar":
                this.speed = 0;
                break;
            case "Esquerda": 
                this.speed = -this.maxSpeed;
                break;
            case "Direita": 
                this.speed = this.maxSpeed;
                break;        
        }
    }

    draw(ctx)
    {
        ctx.fillStyle = "Green";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.position.x, this.position.y, this.width, this.height);
    }

    update(deltaTime)
    {
        this.position.x += this.speed / deltaTime;

        if (this.position.x <= 0)
        {
            this.position.x = 0;
        }
        if(this.position.x + this.width >= this.GAME_WIDTH)
        {
            this.position.x =  this.GAME_WIDTH - this.width;
        }

    }
}