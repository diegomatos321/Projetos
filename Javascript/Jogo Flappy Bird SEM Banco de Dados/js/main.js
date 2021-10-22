import Galeria from "./galeria.js"
import Pool from "./pool.js"

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */
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

let GameScreen = window.document.getElementById("GameScreen");

// Variaveis responsáveis pela responsividade
let GAME_WIDTH = 320;
let GAME_HEIGHT = 480;

let ratio = 0, currentWidth = 0, currentHeight = 0;
let android = false, ios = false, userAgent;

// Variaveis GLOBAIS
let player = undefined, fundo = undefined;
let entityList = new Array();
let score = 0, highScore = 0;
let spawnTime = 1700; //ms
let tempoInicial, deltaTime = 0;


// Objeto game
let Game = {
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

        // Determina o width e o height do canvas atráves do CSS
        canvas.forEach(element => {
            element.width = GAME_WIDTH;
            element.height = GAME_HEIGHT;
        });

        ratio = GAME_WIDTH / GAME_HEIGHT;

        // Função Resize
        Game.Display.resize();

        // Carregando as imagens
        let imagens = [["background", "./assets/imagens/Background.png"], ["chao", "./assets/imagens/Floor.png"], ["pipeNorth_img", "./assets/imagens/PipeNorth.png"], ["pipeSouth_img", "./assets/imagens/PipeSouth.png"], ["bird_sprite", "./assets/imagens/BirdSprite.png"], ["coin_sprite", "./assets/imagens/CoinSprite.png"], ["enter_btn", "./assets/imagens/Enter_btn.png"], ["gameOverScreen", "./assets/imagens/GameOverScreen.png"], ["startMenuScreen", "./assets/imagens/StartMenu.png"]]
        let audios = [["fly_sfx", "./assets/sounds/fly.mp3"], ["score_sfx", "./assets/sounds/score.mp3"]]

        // Objeto Map -> A partir de uma array, cria um key -> value para cada 2 elementos
        imagens = new Map(imagens);
        audios = new Map(audios);

        imagens.forEach((value, key) => {
            Galeria.CarregarImagem(key, value, Game.start)
        });

        audios.forEach((value, key) => {
            Galeria.CarregarAudio(key, value, Game.start)
        });

    },

    // Inicio do jogo, chamado após carregar os arquivos ( imagens e audios )
    start: function () {
        // Remove o element responsável por aparecer loading ao usuário
        let divLoading = document.getElementById("loading-txt");
        window.document.body.removeChild(divLoading);

        // Recupera a pontuação maxima do navegador do cliente
        highScore = window.localStorage.getItem("javascript-flappy-bird-storage")

        // Se nao existir, cria um novo e determina como zero
        if (!highScore) {
            window.localStorage.setItem("javascript-flappy-bird-storage", "0")
            highScore = 0;
        }

        // Criando GameObjects

        player = Pool.get("Bird", "Bird", { sprite: "bird_sprite", x: GAME_WIDTH / 10 - 17, y: GAME_HEIGHT / 4, width: 34, height: 22.333, name: "Bird" });
        player.setSpriteSheetConfig(34, 67 / 3);
        player.addAnimation("Voo", [0, 1, 2], 80);
        player.playAnimation("Voo");

        fundo = Pool.get("Background", "Background", { x: 0, y: 0, name: "Background" });

        // Desenha o HUD
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
            // Para facilitar a lógica, decidi separar os objetos "player" e "background" dos canos (que pertencem a entityList)
            // porque seus comportamentos sao únicos, facilitando suas manipulações;

            if (Game.STATE.CURRENT != Game.STATE.RUNNING) { return; }

            fundo.update(deltaTime); // Atualiza o fundo

            player.update(deltaTime); // Atualiza o player    

            // Tela de GameOver se estiver fora do CANVAS

            if (player.position.getY() + player.height >= 382 || player.position.getY() <= 0) {
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

                let distance = entity.position.getX() - (player.position.getX() + player.width)
                let entityVelocity = entity.velocity.getX() * deltaTime;

                let maxDistance = entity.image.width + player.width + entityVelocity;

                // Verifica a colisao apenas dos canos próximos, para evitar loop/calculo desnecessários
                if (distance <= 0 && distance >= -maxDistance) {
                    if (player.position.getX() + player.width >= entity.position.getX() &&
                        player.position.getX() <= entity.position.getX() + entity.image.width &&
                        player.position.getY() <= entity.position.getY() + entity.image.height &&
                        player.position.getY() + player.height >= entity.position.getY()) {
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

            player.draw(ctx); // Desenha o jogador

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

                ctx[4].drawImage(Galeria.imagens.enter_btn, GAME_WIDTH / 2 - (Galeria.imagens.enter_btn.width / 2), GAME_HEIGHT / 3 - (Galeria.imagens.enter_btn.height / 2) + 100)

                // Desenha as moedas
                if (score < 50) {
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 46, 45, 46, 45, 72, 166, 46, 45);
                }
                else if (score < 100) {
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 46, 0, 46, 45, 72, 166, 46, 45);
                }
                else {
                    ctx[4].drawImage(Galeria.imagens.coin_sprite, 0, 45, 46, 45, 72, 166, 46, 45);
                }

                // Desenha os pontos
                ctx[4].font = "14px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "center"
                ctx[4].fillText(`${score}`, 230, 170);

                // HighScore
                ctx[4].font = "14px Arial";
                ctx[4].textAlign = "center";
                ctx[4].fillText(`${highScore}`, 232, 210);
            }

            if (hud == Game.STATE.RUNNING) {

                // Desenha os pontos
                ctx[4].font = "24px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "left"
                ctx[4].fillText(`${score}`, 20, 30);

                // Desenha o FPS
                ctx[4].font = "14px Arial";
                ctx[4].fillStyle = "black"
                ctx[4].textAlign = "right"
                let FPS = 1000 / (deltaTime * 1000);
                ctx[4].fillText(`FPS: ${FPS.toFixed(2)}`, GAME_WIDTH, 14);
            }
        },

        // Chamado quando a tela mudar de tamanho ou para redimensionar a tela
        resize: function () {
            if (android || ios) {
                // Certifica de manter as dimensoes retangulares, tanto com o celular na horizontal quanto na vertical
                if (window.innerHeight > window.innerWidth) {
                    ratio = window.innerWidth / window.innerHeight
                } else {
                    ratio = window.innerHeight / window.innerWidth
                }
            } else {
                ratio = GAME_WIDTH / GAME_HEIGHT
            }
            currentHeight = window.innerHeight;
            currentWidth = currentHeight * ratio;

            // Graficamente, por meio do css, redimensionamos o canvas.

            canvas.forEach(element => {
                element.style.width = currentWidth + 'px';
                element.style.height = currentHeight + 'px';
            });
        }
    }

}

function addPipe() {
    if (Game.STATE.CURRENT != Game.STATE.RUNNING) { return; } // Retornar se NAO estiver jogando/RUNNING

    let newPosY = Math.round(Math.random() * -233); // Criar uma posição y randômica entre 0 (topo do cano) e -233 (subir o cano até 185px)
    let GAP = Galeria.imagens.pipeNorth_img.height + 100 // Distancia de um cano ao outro

    let northPipe = Pool.get("Pipe", "Pipe North", { sprite: "pipeNorth_img", x: GAME_WIDTH, y: newPosY, name: "Pipe North" });
    let southPipe = Pool.get("Pipe", "Pipe South", { sprite: "pipeSouth_img", x: GAME_WIDTH, y: newPosY + GAP, name: "Pipe South" });

    entityList.push(northPipe);
    entityList.push(southPipe);
}

function startGame() {
    if (Game.STATE.CURRENT == Game.STATE.MENU || Game.STATE.CURRENT == Game.STATE.GAME_OVER) {

        ctx[4].clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT); // Limpa o HUD

        player.reset();

        score = 0;

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

function tooglePaused() {
    if (player.GAME_STATE == Game.STATE.PAUSED) {
        startGame();
    }
    else if (player.GAME_STATE == Game.STATE.RUNNING) {
        Game.STATE.CURRENT = Game.STATE.PAUSED;
    }
}

function playSound(sound) {
    let mySound = Pool.get("Audio", sound, { name: sound })
    mySound.play();
}

function inputBehavior(e) {
    if (Game.STATE.CURRENT == Game.STATE.RUNNING) {
        player.moveUp();
        playSound("fly_sfx");
    } else if (Game.STATE.CURRENT == Game.STATE.MENU) {
        startGame();
    }
    else if (Game.STATE.CURRENT == Game.STATE.GAME_OVER) {
        // Realiza um calculo para saber as coordenadas e dimensoes do botao START para o cliente
        // Pois ele é redimensionado via CSS
        let buttonWidth = (Galeria.imagens.enter_btn.width * currentWidth) / GAME_WIDTH;
        let buttonHeight = (Galeria.imagens.enter_btn.height * currentHeight) / GAME_HEIGHT;
        let buttonX = currentWidth / 2 - (buttonWidth / 2);
        let buttonY = currentHeight / 3 - (buttonHeight / 2) + ((100 * currentHeight) / GAME_HEIGHT);

        let inputPosX = e.x || e.touches[0].pageX; // Clique ou Touch
        let inputPosY = e.y || e.touches[0].pageY; // Clique ou Touch

        if (inputPosX >= buttonX && inputPosX <= buttonX + buttonWidth &&
            inputPosY >= buttonY && inputPosY <= buttonY + buttonHeight) {
            startGame();
        }
    }
}

function addScore() {
    playSound("score_sfx")
    score++;
}

function gameOver() {
    if (score > highScore) {
        highScore = score;
        window.localStorage.setItem("javascript-flappy-bird-storage", highScore)
    }
    Game.STATE.CURRENT = Game.STATE.GAME_OVER;

    Game.Display.drawHUD(Game.STATE.GAME_OVER, 0)
}

window.addEventListener("load", Game.init, false);
window.addEventListener("resize", Game.Display.resize, false);

