export default class food{
    constructor(GAME_WIDTH, GAME_HEIGHT, food_img){
        this.img = food_img;

        this.linha = GAME_WIDTH / 20;
        this.coluna = GAME_HEIGHT / 20;

        this.width = GAME_WIDTH / 20;
        this.height = GAME_HEIGHT / 20;

        this.position = {
            x: this.linha * 15,
            y: this.coluna * 11
        }

        this.active = true;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
    }

    changePosition(snakeTail){
        let posicionou = false

        while (posicionou == false){
            let newPosX = Math.floor(Math.random() * 20) * this.linha
            let newPosY = Math.floor(Math.random() * 20) * this.coluna 

            let overlapping = snakeTail.filter((tail) => {
                return tail.x == newPosX && tail.y == newPosY;
            })
            console.log(overlapping)
            if (overlapping.length == 0){
                this.position.x = newPosX;
                this.position.y = newPosY;
                posicionou = true;
            }
        }
        
    }
}