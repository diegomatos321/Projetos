import Vector from "./vector.js"
import Galeria from "./galeria.js"

export default class Background {
    constructor(parameters) {
        this.name = parameters.name;

        // POSIÇÃO PAR NA ARRAY -> CHAO
        // POSIÇÃO IMPAR NA ARRAY -> FUNDO
        this.imagens = [Galeria.imagens.chao, Galeria.imagens.background]

        this.velocity = [new Vector(-100, 0), new Vector(-10, 0)]; // CHAO ACOMPANHA OS CANOS

        this.active = true;

        // Dois fundos ( BACKGROUND E CHAO ), quatro posições ( DOIS PARA CADA )
        // Irei apenas reposicionar as imagens dando efeito de loop, logo qnd uma sair de tela irá para tras
        // de sua correspondente.
        // O problema é que tanto o fundo como o chao se movimentam, o que deixa um pouco confuso...
        this.positions =
            [
                new Vector(parameters.x, parameters.y + 382), // CHAO
                new Vector(parameters.x, parameters.y + 273), // BACKGROUND
                new Vector(parameters.x + this.imagens[0].width, parameters.y + 382),  // CHAO
                new Vector(parameters.x + this.imagens[1].width, parameters.y + 273) // BACKGROUND
            ]
    }

    draw(ctx) {

        // Desenha o background Parallax
        this.positions.forEach((position, index) => {
            let i = index % 2 // PAR OU IMPAR

            if (i === 0) { // PAR = CHAO ; IMPAR = BACKGROUND
                //Contexto de z-index/depth= 02
                ctx[2].drawImage(this.imagens[0], position.getX(), position.getY());
            } else if (i === 1) {
                //Contexto de z-index/depth= 02
                ctx[0].drawImage(this.imagens[1], position.getX(), position.getY());
            }
        });
    }

    update(deltaTime) {
        // Dentro do loop, Reposiciona o ELEMENTO da esquerda para o final, dando o efeito de looping
        this.positions.forEach((position, index) => {
            let i = index % 2;

            if (i === 0) { // PAR = CHAO
                if (position.getX() + this.imagens[0].width < 0) {
                    if (index === 0) {
                        position.setX(this.positions[2].getX() + this.imagens[0].width);
                    } else if (index === 2) {
                        position.setX(this.positions[0].getX() + this.imagens[0].width);
                    }
                }
            } else if (i === 1) { // IMPAR = BACKGROUND
                if (position.getX() + this.imagens[1].width < 0) {
                    if (index === 1) {
                        position.setX(this.positions[3].getX() + this.imagens[1].width);
                    } else if (index === 3) {
                        position.setX(this.positions[1].getX() + this.imagens[1].width);
                    }
                }
            }

            // Efeito parallax
            position.addTo(this.velocity[i].multiply(deltaTime));
        });
    }
}