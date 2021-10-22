export default class Snake {
    constructor(GAME_WIDTH, GAME_HEIGHT, foods) {

        this.linha = GAME_WIDTH / 20;
        this.coluna = GAME_HEIGHT / 20;

        this.width = GAME_WIDTH / 20;
        this.height = GAME_HEIGHT / 20;

        this.GAME_WIDTH = GAME_WIDTH;
        this.GAME_HEIGHT = GAME_HEIGHT;

        this.foods = foods;

        this.active = true;

        this.tail = [
            {
                x: this.linha * 5,
                y: this.coluna * 5,
                previousPosition: 0,
                color: "white"
            }
        ]

        this.speed = {
            x: 0,
            y: 0
        }

        this.directions = {
            ESQUERDA: 37,
            CIMA: 38,
            DIREITA: 39,
            BAIXO: 40
        };

        this.facing = "direita";
    }

    draw(ctx) {
        // Desenha cada posição do corpo

        this.tail.forEach(body => {
            ctx.fillStyle = body.color;
            ctx.fillRect(body.x, body.y, this.width, this.height);
        });
    }

    update(inputHandler) {
        this.changeDirection(inputHandler);
        this.changeSpeed();

        // Atualiza cada posição do corpo
        this.tail.forEach((body, index) => {
            if (index == 0) { // Cabeça
                // Antiga Posição
                body.previousPosition = {x: body.x, y: body.y}
                body.color = "Red";

                // Está dentro do CANVAS ?
                if(body.x + this.width + this.speed.x > this.GAME_WIDTH)
                {
                    body.x = 0;
                }
                else if(body.x + this.speed.x < 0)
                {
                    body.x = this.GAME_WIDTH - this.width;
                }
                else if(body.y + this.speed.y < 0)
                {
                    body.y = this.GAME_HEIGHT - this.height;
                }
                else if(body.y + this.height + this.speed.y > this.GAME_HEIGHT)
                {
                    body.y = 0;
                }else{
                    body.x += this.speed.x,
                    body.y += this.speed.y
                }
            }
            // Corpo
            else{
                body.color = "White"
                // Cabeça colidiu no corpo ?
                if(this.tail[0].x == body.x && this.tail[0].y == body.y){
                    console.log("GameOver")
                    location.reload();
                }

                // Antiga Posição
                body.previousPosition = {x: body.x, y: body.y}

                // Posiciona na antiga posição do bloco à sua frente

                body.x = this.tail[index - 1].previousPosition.x;
                body.y = this.tail[index - 1].previousPosition.y;
            }
            if(index == this.tail.length-1 && index != 0){
                body.color = "Purple"
            }
        });

        this.foods.forEach(food => {
            // Cabeça colidiu com a comida ?
            if(this.tail[0].x == food.position.x && this.tail[0].y == food.position.y)
            {
                // Adiciona um corpo no final da tail

                let newPosX = this.tail[this.tail.length - 1].previousPosition.x;
                let newPosY = this.tail[this.tail.length - 1].previousPosition.y;

                this.tail.push({x: newPosX, y: newPosY, previousPosition: 0, color: "white"})

                // Muda a posição da comida
                food.changePosition(this.tail);

                //food.active = false;
            }
        });
    }

    changeDirection(dir) {
        if (dir == this.directions.DIREITA && this.facing != "esquerda") {
            this.facing = "direita";
        }
        if (dir == this.directions.ESQUERDA && this.facing != "direita") {
            this.facing = "esquerda";
        }
        else if (dir == this.directions.CIMA && this.facing != "baixo") {
            this.facing = "cima";
        }
        else if (dir == this.directions.BAIXO && this.facing != "cima") {
            this.facing = "baixo";
        }
    }

    changeSpeed() {
        switch (this.facing) {
            case "direita":
                this.speed.x = this.linha;
                this.speed.y = 0;
                break;
            case "esquerda":
                this.speed.x = -this.linha;
                this.speed.y = 0;
                break;
            case "cima":
                this.speed.x = 0;
                this.speed.y = -this.coluna;
                break;
            case "baixo":
                this.speed.x = 0;
                this.speed.y = this.coluna;
                break;
        }
    }
}