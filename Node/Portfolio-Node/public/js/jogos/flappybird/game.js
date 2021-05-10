import Pool from "./pool.js"
import Galeria from "./galeria.js"

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Canvas e Layers
let canvas = [
    window.document.getElementById("background-layer"),
    window.document.getElementById("pipeSouth-layer"),
    window.document.getElementById("ground-layer"),
    window.document.getElementById("game-layer"),
    window.document.getElementById("hud-layer")
]

// ATENÇÃO: POSIÇÃO DOS ELEMENTOS NA ARRAY ESTAO EM ORDEM DE PROFUNDIDADE
// DEFINIDO VIA CSS
let ctx = [
    canvas[0].getContext("2d"), // Z=0
    canvas[1].getContext("2d"), // Z=1
    canvas[2].getContext("2d"), // Z=2
    canvas[3].getContext("2d"), // Z=3
    canvas[4].getContext("2d")  // Z=4
]

let GameScreen = window.document.getElementById("game-screen");

// Variaveis responsáveis pela responsividade
let GAME_WIDTH = 320;
let GAME_HEIGHT = 480;

let ratio = 0, currentWidth = 0, currentHeight = 0;
let android = false, ios = false, userAgent;

// Variaveis GLOBAIS
export let jogador = {
    body: undefined,
    nome: "",
    score: 0,
    highScore: 0
}

let fundo = undefined;
let entityList = new Array();
let spawnTime = 1700; //ms
let tempoInicial, deltaTime = 0;

// Objeto game
export let Game = {
    // Todos os estados do jogo
    STATE:
    {
        RUNNING: 0,
        MENU: 1,
        PAUSED: 2,
        GAME_OVER: 3,
        CURRENT: 1
    },

    // Primeira função a ser executado do game
    init: function () {

        // Verifica que tipo de dispositivo é
        userAgent = navigator.userAgent.toLocaleLowerCase();
        android = userAgent.indexOf('android') > -1 ? true : false;
        ios = (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) ? true : false;

        // Determina o width e o height do canvas

        canvas.forEach(element => {
            element.width = GAME_WIDTH;
            element.height = GAME_HEIGHT;
        });
        ratio = GAME_WIDTH / GAME_HEIGHT;

        // Resize
        Game.Display.resize();
        window.addEventListener("resize", Game.Display.resize, false);

        Game.start();
    },

    // Inicio do jogo, chamado após carregar os arquivos ( imagens e audios )
    start: function () {

        // Criando GameObjects
        jogador.body = Pool.get("Bird", "Bird", { sprite: "bird_sprite", x: GAME_WIDTH / 10 - 17, y: GAME_HEIGHT / 4, width: 34, height: 22.333, name: "Bird" });
        jogador.body.setSpriteSheetConfig(34, 67 / 3);
        jogador.body.addAnimation("Voo", [0, 1, 2], 80);
        jogador.body.playAnimation("Voo");

        fundo = Pool.get("Background", "Background", { x: 0, y: 0, name: "Background" });

        Game.Display.drawHUD(Game.STATE.MENU, 0);

        // Cria interatividade com a janela
        if (android || ios) {
            GameScreen.addEventListener("touchstart", inputBehavior, { passive: false })
            GameScreen.addEventListener("touchmove", null, { passive: false })
            GameScreen.addEventListener("touchend", null, { passive: false })
            GameScreen.addEventListener("touchcancel", null, { passive: false })
        } else {
            GameScreen.addEventListener('click', inputBehavior, { passive: false });
        }


        // A cada spawnTime (em ms) a função addPipe é acionada
        window.setInterval(addPipe, spawnTime);

        // Chamando o GameLoop
        requestAnimFrame(Game.Engine.GameLoop);
    },

    // Responsável pela lógica do jogo
    Engine: {
        // Responsável pelo Gameloop
        GameLoop: function (tempoAtual) {

            // Responsável por chamar o GameLoop
            requestAnimFrame(Game.Engine.GameLoop);

            // Transforma o tempo para segundos (ex: 16.666ms para 0.01666s)
            tempoAtual = tempoAtual / 1000;

            deltaTime = tempoAtual - tempoInicial;
            tempoInicial = tempoAtual;

            // Atualiza
            Game.Engine.update();

            // Desenha
            Game.Display.render();
        },

        update: function () {
            // Para facilitar a lógica, decidir separar os objetos "player" e "background" dos canos (que pertencem a entityList)
            // porque seus comportamentos sao únicos, facilitando suas manipulações;
            if (Game.STATE.CURRENT != Game.STATE.RUNNING) { return; }

            fundo.update(deltaTime); // Atualiza o fundo

            jogador.body.update(deltaTime); // Atualiza o player    

            // Tela de GameOver se estiver fora do CANVAS
            if (jogador.body.position.getY() + jogador.body.height >= 382 || jogador.body.position.getY() <= 0) {
                gameOver();
            }

            let recycle = entityList.filter((entity) => { // Filtra apenas os objetos inativos (OBS: Apenas os canos estão na entityList)
                return entity.active == false;
            })

            // Caso tenha items para serem recilados, chama o objeto Pool
            if (recycle.length > 0) {
                Pool.add(recycle);
            }

            // Retira da array os objetos desativados (OBS: Apenas os canos estão na entityList)
            entityList = entityList.filter((entity) => { // Filtra apenas os objetos ativos
                return entity.active == true;
            })

            // Atualiza os objetos e verifica colisao (OBS: Apenas os canos estão na entityList)
            entityList.forEach(entity => {
                entity.update(deltaTime)

                let distance = entity.position.getX() - (jogador.body.position.getX() + jogador.body.width)
                let entityVelocity = entity.velocity.getX() * deltaTime;

                let maxDistance = entity.image.width + jogador.body.width + entityVelocity;
                // Verifica a colisao apenas nos canos próximos, para evitar loop/calculo desnecessários
                // "100 * deltaTime" é a velocidade do cano
                if (distance <= 0 && distance >= -maxDistance) {
                    if (jogador.body.position.getX() + jogador.body.width >= entity.position.getX() &&
                        jogador.body.position.getX() <= entity.position.getX() + entity.image.width &&
                        jogador.body.position.getY() <= entity.position.getY() + entity.image.height &&
                        jogador.body.position.getY() + jogador.body.height >= entity.position.getY()) {
                        gameOver();
                    }
                    if (entity.name == "Pipe North" &&
                        distance + entityVelocity <= -maxDistance) {
                        addScore();
                    }
                }
            });
        }
    },

    // Tela do jogo
    Display: {
        // Desenha
        render: function () {

            ctx.forEach((element, index) => {
                if (index == 4) { return; } // Posição 3 da array está relacionada ao HUD, cujo nao iremos ficar redesenhando/limpando a todo momento, apenas qnd necessario
                element.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Limpa o canvas
            });

            fundo.draw(ctx);  // Desenha o fundo

            jogador.body.draw(ctx); // Desenha o jogador

            // Desenha os objetos da entityList (OBS: Apenas os canos estão na entityList)
            entityList.forEach(entity => {
                entity.draw(ctx)
            });

            // Desenha o HUD
            if (Game.STATE.CURRENT == Game.STATE.RUNNING) {
                ctx[4].clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                Game.Display.drawHUD(Game.STATE.RUNNING, deltaTime);
            }
        },

        drawHUD: function (hud, deltaTime) {
            if (hud == Game.STATE.MENU) {
                // MENU
                ctx[4].drawImage(Galeria.imagens.startMenuScreen, GAME_WIDTH / 2 - (Galeria.imagens.startMenuScreen.width / 2), GAME_HEIGHT / 3 - (Galeria.imagens.startMenuScreen.height / 2))
                ctx[4].font = "24px Source Code Pro";
                ctx[4].textAlign = "center";
                ctx[4].fillStyle = "white";
                ctx[4].fillText("Clone do Flappy Bird", GAME_WIDTH / 2, GAME_HEIGHT - 48);
                ctx[4].fillText("Por Diego Matos", GAME_WIDTH / 2, GAME_HEIGHT - 24);
            }

            if (hud == Game.STATE.PAUSED) {
                // PAUSADO
                ctx[4].fillStyle = "rgba(0, 0, 0, 0.5)"
                ctx[4].fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
                ctx[4].font = "26px Arial";
                ctx[4].textAlign = "center";
                ctx[4].fillStyle = "white";
                ctx[4].fillText("PAUSADO", GAME_WIDTH / 2, GAME_HEIGHT / 2);
            }

            if (hud == Game.STATE.GAME_OVER) {
                // GAME OVER
                ctx[4].drawImage(Galeria.imagens.gameOverScreen, GAME_WIDTH / 2 - (Galeria.imagens.gameOverScreen.width / 2), GAME_HEIGHT / 3 - (Galeria.imagens.gameOverScreen.height / 2))

                const buttonX = GAME_WIDTH / 2 - (Galeria.imagens.enter_btn.width / 2)

                const buttonY = GAME_HEIGHT / 3 - (Galeria.imagens.enter_btn.height / 2) + 100

                ctx[4].drawImage(Galeria.imagens.enter_btn, buttonX, buttonY)

                // Desenha as moedas
                if (jogador.score < 50) {
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 46, 45, 46, 45, 72, 166, 46, 45);
                }
                else if (jogador.score < 100) {
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 46, 0, 46, 45, 72, 166, 46, 45);
                }
                else {
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 0, 45, 46, 45, 72, 166, 46, 45);
                }

                // Desenha os pontos
                ctx[4].font = "14px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "center"
                ctx[4].fillText(`${jogador.score}`, 230, 170);

                // HighScore
                ctx[4].font = "14px Arial";
                ctx[4].textAlign = "center";
                ctx[4].fillText(`${jogador.highScore}`, 232, 210);

                // DESENHA O RANKING DE JOGADORES
                showRanking()
            }

            if (hud == Game.STATE.RUNNING) {

                // Desenha os pontos
                ctx[4].font = "24px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "left"
                ctx[4].fillText(`${jogador.score}`, 20, 30);

                // Desenha o FPS
                ctx[4].font = "14px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "right"
                let FPS = 1000 / (deltaTime * 1000);
                ctx[4].fillText(`FPS: ${FPS.toFixed(2)}`, GAME_WIDTH, 14);
            }
        },

        // Chamado quando a tela mudar de tamanho / para redimensionar a tela
        resize: function () {
            const clientWidth = window.screen.width;
            const clientHeight = window.screen.height;
            const parentDiv = document.getElementById("jogo-container");

            if (android || ios) {
                // Certifica de manter as dimensoes retangulares, tanto com o celular na horizontal quanto na vertical
                if (clientHeight > clientWidth) {
                    ratio = clientWidth / clientHeight;
                } else {
                    ratio = clientHeight / clientWidth;
                }
            } else {
                ratio = GAME_WIDTH / GAME_HEIGHT
            }

            if(clientWidth <= 768){
                currentHeight = 0.85*clientHeight;
            }
            else{
                currentHeight = 0.8*clientHeight;
            }

            currentWidth = currentHeight * ratio;
            GameScreen.style.width = currentWidth + "px";
            GameScreen.style.height = currentHeight + "px";

            parentDiv.style.border = "2px solid black";
            parentDiv.style.width = currentWidth + "px";
            parentDiv.style.height = currentHeight + "px";

            // Graficamente, por meio do css, redimensionamos o canvas.

            canvas.forEach(element => {
                element.style.width = currentWidth + "px";
                element.style.height = currentHeight + "px";
            });
        }
    }

}

function addPipe() {
    if (Game.STATE.CURRENT != Game.STATE.RUNNING) { return; } // Retornar se NAO estiver jogando/RUNNING

    let newPosY = Math.round(Math.random() * -233); // Criar uma posição y randômica entre 0 (topo do cano) e -185 (subir o cano até 185px)
    let GAP = Galeria.imagens.pipeNorth_img.height + 100 // Distancia de um cano ao outro

    let northPipe = Pool.get("Pipe", "Pipe North", { sprite: "pipeNorth_img", x: GAME_WIDTH, y: newPosY, name: "Pipe North" });
    let southPipe = Pool.get("Pipe", "Pipe South", { sprite: "pipeSouth_img", x: GAME_WIDTH, y: newPosY + GAP, name: "Pipe South" });

    entityList.push(northPipe);
    entityList.push(southPipe);
}

function startGame() {
    if (Game.STATE.CURRENT == Game.STATE.MENU || Game.STATE.CURRENT == Game.STATE.GAME_OVER) {

        ctx[4].clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Limpa o HUD

        jogador.body.reset();

        jogador.score = 0;

        let recycle = entityList.filter((entity) => { // Filtra apenas os objetos inativos (OBS: Apenas os canos estão na entityList)
            return entity.name == "Pipe North" || "Pipe South";
        })
        if (recycle.length > 0) {
            Pool.add(recycle)
        }
        entityList.length = 0; // Limpa a array

        Game.STATE.CURRENT = Game.STATE.RUNNING; // Volta a jogar
    }
}

/*function tooglePaused() {
    if (player.GAME_STATE == Game.STATE.PAUSED) {
        startGame();
    }
    else if (player.GAME_STATE == Game.STATE.RUNNING) {
        Game.STATE.CURRENT = Game.STATE.PAUSED;
    }
}*/

function playSound(sound) {
    let mySound = Pool.get("Audio", sound, { name: sound })
    mySound.play();
}

function inputBehavior(e) {
    e.preventDefault();
    if (Game.STATE.CURRENT == Game.STATE.RUNNING) {
        jogador.body.moveUp();
        playSound("fly_sfx");
    } else if (Game.STATE.CURRENT == Game.STATE.MENU) {
        startGame();
    }
    else if (Game.STATE.CURRENT == Game.STATE.GAME_OVER) {
        // Realiza um calculo para saber as dimensoes do botao START
        let buttonWidth = (Galeria.imagens.enter_btn.width * currentWidth) / GAME_WIDTH;
        let buttonHeight = (Galeria.imagens.enter_btn.height * currentHeight) / GAME_HEIGHT;

        const canvasButtonX = GAME_WIDTH / 2 - (Galeria.imagens.enter_btn.width / 2)
        const canvasButtonY = GAME_HEIGHT / 3 - (Galeria.imagens.enter_btn.height / 2) + 100

        const buttonX = (currentWidth * canvasButtonX) / GAME_WIDTH;
        const buttonY = (currentHeight * canvasButtonY) / GAME_HEIGHT;

        let parentDimensions = GameScreen.getBoundingClientRect();
        let inputPosX = (e.clientX - parentDimensions.x) || (e.touches[0].clientX - parentDimensions.x); // Clique ou Touch
        let inputPosY = (e.clientY - parentDimensions.y) || (e.touches[0].clientY - parentDimensions.y); // Clique ou Touch

        if (inputPosX >= buttonX && inputPosX <= buttonX + buttonWidth &&
            inputPosY >= buttonY && inputPosY <= buttonY + buttonHeight) {
            startGame();
        }
    }
}

function addScore() {
    playSound("score_sfx")
    jogador.score++;
}

async function gameOver() {
    Game.STATE.CURRENT = Game.STATE.GAME_OVER;
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    if (jogador.score > jogador.highScore) {
        jogador.highScore = jogador.score;

        try {
            let response = await fetch("./flappybird/editar", {
                credentials: 'same-origin', // <-- includes cookies in the request
                headers: { 
                    'Content-Type': 'application/json',
                    'CSRF-Token': token // <-- is the csrf token as a header
                },
                method: 'PATCH',
                body: JSON.stringify(jogador)
            })

            let data = await response.json();
            console.log(data)
            Game.Display.drawHUD(Game.STATE.GAME_OVER, 0)
        } catch (error) {
            console.log(error)
        }

        return;
    }

    Game.Display.drawHUD(Game.STATE.GAME_OVER, 0)
}

async function showRanking() {
    try {
        let response = await fetch("./flappybird/jogadores/10");
        let data = await response.json();

        ctx[4].font = "16px Arial";
        ctx[4].fillStyle = "black";
        ctx[4].textAlign = "center";
        ctx[4].fillText("Os 10 melhores são: ", GAME_WIDTH / 2, GAME_HEIGHT - 184);
        ctx[4].fillText("Jogador", GAME_WIDTH / 2 - 50, GAME_HEIGHT - 165);
        ctx[4].fillText("Pontuação", GAME_WIDTH / 2 + 50, GAME_HEIGHT - 165);

        data.forEach((jogador, index) => {
            ctx[4].fillText(`${jogador.nome}`, GAME_WIDTH / 2 - 50, GAME_HEIGHT - 146 + (16 * index));
            ctx[4].fillText(`${jogador.highScore}`, GAME_WIDTH / 2 + 50, GAME_HEIGHT - 146 + (16 * index));
        });
    } catch (error) {
        console.log(error)
    }
}

