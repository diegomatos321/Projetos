export default class Menu{
    constructor(GAME_WIDTH, GAME_HEIGHT){
        this.GAME_WIDTH = GAME_WIDTH;
        this.GAME_HEIGHT = GAME_HEIGHT;

        this.dificuldade = 500,

        this.options = {
            FACIL: 0,
            MEDIO: 1,
            DIFICIL: 2
        }

        this.arrow = {
            x: this.GAME_WIDTH / 2 - 170,
            y: this.GAME_HEIGHT/2,
            selected: 0
        }
    }

    update(keyPress){
        if (keyPress == 37){
            this.arrow.selected -= 1;
        }
        if (keyPress == 38){
            this.arrow.selected = 0;
        }
        if (keyPress == 39){
            this.arrow.selected += 1;
        }
        if (keyPress == 40){
            this.arrow.selected = 3;
        }

        if (this.arrow.selected < 0){
            this.arrow.selected = 2;
        }
        if (this.arrow.selected > 3){
            this.arrow.selected = 0;
        }

        if (this.arrow.selected == this.options.FACIL){
            this.arrow.x = this.GAME_WIDTH / 2 - 170;
            this.arrow.y = this.GAME_HEIGHT/2;
            this.dificuldade = 500;
        }

        if (this.arrow.selected == this.options.MEDIO){
            this.arrow.x = this.GAME_WIDTH / 2 - 50;
            this.arrow.y = this.GAME_HEIGHT/2;
            this.dificuldade = 300;
        }
        
        if (this.arrow.selected == this.options.DIFICIL){
            this.arrow.x = this.GAME_WIDTH / 2 + 70;
            this.arrow.y = this.GAME_HEIGHT/2;
            this.dificuldade = 100;
        }

    }

    draw(ctx){
        ctx.fillStyle = "Green";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("=>", this.arrow.x, this.arrow.y);

        ctx.fillStyle = "Yellow";
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SNAKE GAME", this.GAME_WIDTH / 2, 60);

        ctx.fillStyle = "White";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("FÁCIL", this.GAME_WIDTH / 2 - 120, this.GAME_HEIGHT/2);
        ctx.fillText("MÉDIO", this.GAME_WIDTH / 2 , this.GAME_HEIGHT/2);
        ctx.fillText("DIFÍCIL", this.GAME_WIDTH / 2 + 120 , this.GAME_HEIGHT/2);
    }

    get atribuirDificuldade(){
        return this.dificuldade;
    }
}