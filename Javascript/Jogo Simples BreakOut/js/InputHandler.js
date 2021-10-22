export default class InputHandler
{
    constructor(paddle, game)
    {
        document.addEventListener("keydown", (e) =>{

            switch(e.keyCode)
            {
                case 39: 
                    paddle.move("Direita");
                    break;
                case 37: 
                    paddle.move("Esquerda");
                    break;
                case 80:
                    game.tooglePause();
                    break;
                case 32:
                    game.start();
                    break;
            }
        });
        document.addEventListener("keyup", (e) =>{
            switch(e.keyCode)
            {
                case 39: 
                    if (paddle.speed > 0 ) paddle.move("Parar");
                    break;
                case 37: 
                    if (paddle.speed < 0 ) paddle.move("Parar");
                    break;
            }
        });
    }
}