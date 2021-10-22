import InputHandler from "./inputHandler.js"
import CollisionHandler from "./collisionHandler.js"
import Galeria from "./galeria.js"
import Vector from "./vector.js"
import Pool from "./pool.js"

export default class stage {
    constructor({ width: GAME_WIDTH, height: GAME_HEIGHT, parent }) {
        // GAME CONFIG   
        this.GAME_WIDTH = GAME_WIDTH;
        this.GAME_HEIGHT = GAME_HEIGHT;

        this.criarElementosHTML(parent);

        this.parentDimensions = parent.getBoundingClientRect();
        this.canvasPosition = new Vector(this.parentDimensions.x, this.parentDimensions.y)

        // Imagens
        Galeria.CarregarImagem("jogador_img", "./assets/imagens/player.png", this.init, this);
        Galeria.CarregarImagem("tiro_img", "./assets/imagens/tiro.png", this.init, this);
        Galeria.CarregarImagem("asteroide", "./assets/imagens/asteroide.png", this.init, this);

        // Audio
        Galeria.CarregarAudio("shoot_sound", "./assets/audios/shoot_sound.mp3", this.init, this);

    }

    init() {
        this.ratio = this.GAME_WIDTH / this.GAME_HEIGHT;
        this.redimensionar();

        // Variaveis
        this.vidas = 3;
        this.estadoDoJogo = {
            RUNNING: 0,
            GAME_OVER: 1
        }
        this.estadoAtual = this.estadoDoJogo.RUNNING;

        // HUD
        this.drawHUD("vida");

        // Handlers
        this.inputHandler = new InputHandler();

        // Entities
        this.entityList = [];

        const jogadorProp = { initialX: this.GAME_WIDTH / 2, initialY: this.GAME_HEIGHT / 2, width: 32, height: 32, image: Galeria.imagens.jogador_img, scene: this };
        this.player = Pool.get("Jogador", "Jogador", jogadorProp)
        this.entityList.push(this.player)

        window.setInterval(this.criarMeteoros.bind(this), 1000);

        this.listaDeColisoes = [];
        this.Colisao("Jogador", "Meteoro", this.atingiuJogador, this);
        this.Colisao("Meteoro", "Meteoro", this.separacao, this);
        this.Colisao("Tiro", "Meteoro", this.destruir, this);

        this.deltaTime = 0;
        this.tempoAnterior = 0;
        window.requestAnimationFrame(this.GameLoop.bind(this));
    }

    GameLoop(tempoPecorrido) {
        window.requestAnimationFrame(this.GameLoop.bind(this));

        tempoPecorrido /= 1000;
        this.deltaTime = tempoPecorrido - this.tempoAnterior;
        this.tempoAnterior = tempoPecorrido;

        console.log(Pool.stored)
        if (this.estadoAtual == this.estadoDoJogo.RUNNING) {
            this.update();
            this.draw();
        }
    }

    update() {
        this.entityList = this.entityList.filter(entity => {
            return entity.isActive;
        })

        if (this.listaDeColisoes.length > 0) {
            this.listaDeColisoes.forEach(colisao => {
                if (colisao.objeto1 == colisao.objeto2) {
                    let listaDeObjetos = this.entityList.filter(entity => {
                        return entity.nome == colisao.objeto1;
                    })

                    listaDeObjetos.forEach((entity1, index1) => {
                        listaDeObjetos.forEach((entity2, index2) => {
                            if (index1 >= index2) return
                            CollisionHandler(entity1, entity2, colisao.callback, colisao.contexto);
                        });
                    });

                    return
                }

                let listaDeObjetos1 = this.entityList.filter(entity => {
                    return entity.nome == colisao.objeto1;
                })

                let listaDeObjetos2 = this.entityList.filter(entity => {
                    return entity.nome == colisao.objeto2;
                })

                if (listaDeObjetos1.length == 0 || listaDeObjetos2.length == 0) { return }

                listaDeObjetos1.forEach(objeto1 => {
                    listaDeObjetos2.forEach(objeto2 => {
                        CollisionHandler(objeto1, objeto2, colisao.callback, colisao.contexto);
                    })
                })
            })
        }

        this.entityList.forEach(entity => {
            entity.update(this.deltaTime, this.inputHandler);
        });
    }

    draw() {
        this.ctx[0].clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        this.entityList.forEach(entity => {
            entity.draw(this.ctx[0]);
        });
    }

    drawHUD(hud) {
        this.ctx[1].clearRect(0, 0, this.GAME_WIDTH, this.GAME_HEIGHT);

        this.ctx[1].font = "20px Arial";
        this.ctx[1].fillStyle = "black";

        if (hud == "vida") {
            this.ctx[1].textAlign = "left";
            this.ctx[1].fillStyle = "black";
            this.ctx[1].fillText(`Vidas: ${this.vidas}`, 10, 30);
        }

        if (hud == "Game Over") {
            this.ctx[1].textAlign = "center";
            this.ctx[1].fillText("Você Morreu !", this.GAME_WIDTH / 2, this.GAME_HEIGHT / 2);
        }
    }

    createGameObject(classe, nome, params) {
        const novoObjeto = Pool.get(classe, nome, params)
        this.entityList.push(novoObjeto);
    }

    createGameSound(nome, params){
        const novoSom = Pool.get("Audio", nome, params)
        novoSom.play()
    }

    Colisao(Objeto1, Objeto2, callback, contexto) {
        let novaColisao = {
            objeto1: Objeto1,
            objeto2: Objeto2,
            callback: callback,
            contexto: contexto
        }

        this.listaDeColisoes.push(novaColisao);
    }

    atingiuJogador(jogador, meteoro) {
        this.separacao(jogador, meteoro);
        this.vidas--;
        this.drawHUD("vida");

        if (this.vidas <= 0) {
            this.gameOver();
        }
    }

    separacao(entity1, entity2) {
        let velocidade1 = {};
        let velocidade2 = {};

        velocidade1.x = entity1._velocity.getX();
        velocidade1.y = entity1._velocity.getY();

        velocidade2.x = entity2._velocity.getX();
        velocidade2.y = entity2._velocity.getY();

        entity1._velocity.setXY(velocidade2.x, velocidade2.y);
        entity2._velocity.setXY(velocidade1.x, velocidade1.y);

    }

    destruir(tiro, meteoro) {
        Pool.add([tiro, meteoro]);

        tiro.isActive = false;
        meteoro.isActive = false;
    }

    criarMeteoros() {
        let randomX, randomY;
        const spawn = Math.ceil(Math.random() * 4);
        if (spawn == 1) { // cima
            randomX = Math.random() * this.GAME_WIDTH;
            randomY = 0;
        }

        if (spawn == 2) { // direita
            randomX = this.GAME_WIDTH;
            randomY = Math.random() * this.GAME_HEIGHT;
        }

        if (spawn == 3) { // baixo
            randomX = Math.random() * this.GAME_WIDTH;
            randomY = this.GAME_HEIGHT;
        }

        if (spawn == 4) { // esquerda
            randomX = 0;
            randomY = Math.random() * this.GAME_HEIGHT;
        }

        const meteoroProp = { initialX: randomX, initialY: randomY, width: 32, height: 32, image: Galeria.imagens["asteroide"], scene: this };
        this.createGameObject("Meteoro", "Meteoro", meteoroProp);
    }

    criarElementosHTML(parent) {
        let layerDoMundo = document.createElement("canvas");
        parent.appendChild(layerDoMundo)
        layerDoMundo.style.zIndex = 0;

        let layerDoHUD = document.createElement("canvas");
        parent.appendChild(layerDoHUD);
        layerDoHUD.style.zIndex = 1;


        this.canvas = [
            layerDoMundo, // 0
            layerDoHUD // 1
        ]

        this.canvas.forEach(element => {
            element.width = this.GAME_WIDTH;
            element.height = this.GAME_HEIGHT;
        });

        this.ctx = [
            this.canvas[0].getContext("2d"), // 0
            this.canvas[1].getContext("2d") // 1
        ]
    }

    redimensionar() {
        const larguraPai = this.parentDimensions.width;
        const alturaPai = this.parentDimensions.height;

        const novaLargura = larguraPai * this.ratio;
        const novaAltura = alturaPai;

        this.canvas.forEach(element => {
            element.style.width = novaLargura + "px";
            element.style.height = novaAltura + "px";
        });
    }

    gameOver() {
        this.estadoAtual = this.estadoDoJogo.GAME_OVER;
        this.drawHUD("Game Over");

        window.setTimeout(this.reiniciarJogo.bind(this), 2000)
    }

    reiniciarJogo() {
        this.tempoAnterior += 2000;
        Pool.add(this.entityList);
        this.entityList.length = 0; // Infelizmente a gente limpa o jogador tbm

        const jogadorProp = { initialX: this.GAME_WIDTH / 2, initialY: this.GAME_HEIGHT / 2, width: 32, height: 32, image: Galeria.imagens.jogador_img, scene: this };
        this.player = Pool.get("Jogador", "Jogador", jogadorProp) // Mas aí é so resgatar ele na Pool :D
        this.entityList.push(this.player)

        this.vidas = 3;
        this.drawHUD("vida")
        this.estadoAtual = this.estadoDoJogo.RUNNING;
    }
}