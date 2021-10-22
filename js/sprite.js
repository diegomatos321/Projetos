import Vector from "./vector.js"
import Galeria from "./galeria.js"

export default class Sprite {
    constructor(sprite, x, y, width, height, name) {
        this.name = name;

        this.image = Galeria.imagens[sprite];

        this.width = width || Galeria.imagens[sprite].width;
        this.height = height || Galeria.imagens[sprite].height;

        this.velocity = new Vector(0, 0);

        this.initialPosition = {
            x: x,
            y: y
        }
        this.position = new Vector(x, y);

        this.active = true;

        this.anims = {
            isPlaying: false
        }
    }

    draw(ctx) {
        if (this.anims.isPlaying) {
            ctx[3].drawImage(this.image, this.anims.current.originX, this.anims.current.originY, this.width, this.height, this.position.getX(), this.position.getY(), this.width, this.height);
        } else if (!this.anims.isPlaying) {
            ctx[3].drawImage(this.image, this.position.getX(), this.position.getY(), this.width, this.height);
        }
    }
    update(deltaTime) {
        if (this.anims.isPlaying) {
            this.processAnimation(deltaTime);
        }
    }
    setSpriteSheetConfig(frameWidth, frameHeight) {
        this.anims.config = {
            frameWidth: frameWidth,
            frameHeight: frameHeight,
            rowNumber: Math.round(this.image.height / frameHeight),
            columnNumber: Math.round(this.image.width / frameWidth)
        }
    }

    addAnimation(name, frames, delay) {
        this.anims[name] = {
            frames: frames,
            originX: 0,
            originY: 0,
            currentTime: 0,
            currentFrame: frames[0],
            delay: delay // Em ms
        }
    }

    playAnimation(name) {
        this.anims.current = this.anims[name]; // Define a animação atual em "current"
        this.anims.isPlaying = true;
    }

    processAnimation(deltaTime) {
        this.anims.current.currentTime += deltaTime * 1000; // Transforma o tempo em milisegundos ( tranformado em segundos 
                                                            // em Game.Engine.GameLoop )
        if (this.anims.current.currentTime < this.anims.current.delay) { return; }

        let frames = this.anims.current.frames; // Pega os frames da animação atual
        let currentFrame = this.anims.current.currentFrame; // Pega o frame atual da animação atual
        let linhas = this.anims.config.rowNumber; // Pega o numero de linhas animação atual
        let colunas = this.anims.config.columnNumber; // Pega o numero de colunas animação atual
        let stoped = false;

        if (frames.indexOf(currentFrame) === -1) { // Caso o frame atual nao exista dentra da array de frames, eu defino ele como sendo
                                                  // o primeiro da array
            currentFrame = frames[0];
            this.anims.current.currentFrame = frames[0];
        }
        
        // Em nosso sprite sheet, a posição do primeiro frame é 0, seguido de linha: 0 e coluna: 0,
        // logo, iremos em cada linha pecorrer as colunas em busca dos frames de nossa animação.
        // Em seguida defineremos a origen X e Y da seguinte forma: o numero de linhas necessarios
        // para achar o frame é equivalente ao numero de "passos" no eixo X necessario para acha-lo, e 
        // seu valor em pixels é igual ao tamanho da largura de nosso frame.
        // E o numero de colunas é equivalente ao numero de "passos" no eixo Y necessario para acha-lo,
        // seu valor em pixels é igual ao tamanho da altura de nosso frame.
        // A interseção dos dois é a posição de nosso frame e onde o canvas deve começar a desenhar.
        let contador = 0; // Mantem rastro do frame que está sendo percorrido

        for (let linha = 0; linha < linhas && !stoped; linha++) {
            for (let coluna = 0; coluna < colunas; coluna++) {
                // SE O FRAME EM QUE ESTOU PERCORRENDO É IGUAL AO MEU FRAME ATUAL
                // Definir sua posição no sprite sheet
                if (contador === currentFrame) {
                    this.anims.current.originY = linha * this.anims.config.frameHeight;
                    this.anims.current.originX = coluna * this.anims.config.frameWidth;

                    // Definir o proximo frame
                    let proximoFrame = frames[frames.indexOf(currentFrame) + 1]
                    this.anims.current.currentFrame = proximoFrame;

                    this.anims.current.currentTime = 0;
                    stoped = true; // Para o primeiro loop
                    break; // Para o segundo loop
                }
                contador++;
            }
        }
    }
}