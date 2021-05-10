import Sprite from "./sprite.js"
import Vector from "./vector.js"

const GRAVIDADE = new Vector(0, 1400);

export default class Bird extends Sprite {
    constructor(parameters) {

        super(parameters.sprite, parameters.x, parameters.y, parameters.width, parameters.height, parameters.name)

        this.angle = 0;
        this.ANGULAR_VELOCITY = 45;

        this.FORCE_JUMP = new Vector(0, -350);
    }

    draw(ctx) {
        // Salva o contexto atual
        ctx[3].save();

        // Reposiciona o contexto para o centro do nosso jogador
        ctx[3].translate(this.position.getX() + this.width / 2, this.position.getY() + this.height / 2);

        // Rotaciona o contexto, dando uma ILUSAO que o jogador rotacionou
        ctx[3].rotate(this.angle);

        // Desenha nosso jogador
        if (this.anims.isPlaying) {
            ctx[3].drawImage(this.image, this.anims.current.originX, this.anims.current.originY, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height);
        } else if (!this.anims.isPlaying) {
            ctx[3].drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        // Restaura o contexto para o salvo previamente
        ctx[3].restore();
    }
    update(deltaTime) {
        // Velocity aumenta com a gravidade
        // Gravidade multiplicado pelo nosso delta time
        this.velocity.addTo(GRAVIDADE.multiply(deltaTime))

        // Os quadrantes do circulo trigonométrico no canvas é diferente do tradicional, nele o 1º Quadrante é
        // equivalente ao 4º Quadrante do tradicional
        // Como eu quero que o personagem "olhe para cima" quando voar e "olha para baixo" quando estiver caindo
        // defini que o angulo máximo é:
        //      Circulo tradicional : - Máximo 20°
        //                            - Minimo 340°
        //      No canvas           : - Máximo 340°
        //                            - Minimo 20°
        // Ou seja, ele tem que ser MENOR que 20° OU MAIOR que 340°, fora disso, nao mudo seu angulo
        if (this.angle < Math.PI / 180 * 20 || this.angle >= Math.PI / 180 * 340) {
            // Aumenta pela queda
            this.addAngle(Math.PI / 180 * this.ANGULAR_VELOCITY * deltaTime)
        }

        // A posição no eixo Y aumenta pela speedY, dando o efeito de queda
        // Velocidade multiplicado pelo nosso delta time
        this.position.addTo(this.velocity.multiply(deltaTime));

        // Animação
        if (this.anims.isPlaying) {
            this.processAnimation(deltaTime);
        }
    }

    addAngle(angle) {
        this.angle += angle;
    }

    setAngle(newAngle) {
        this.angle = newAngle;
    }

    moveUp() {
        // "Voo"

        this.velocity.setY(this.FORCE_JUMP.getY());

        this.setAngle(Math.PI / 180 * 340)
    }

    reset() {
        this.angle = 0;

        this.velocity.setLength(0);

        this.position.setXY(this.initialPosition.x, this.initialPosition.y)
    }
}