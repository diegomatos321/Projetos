// Importe aqui todas os objetos de seu jogo
import Jogador from "./jogador.js"
import Meteoro from "./meteoro.js"
import Tiro from "./Bullet.js"
import Galeria from "./galeria.js"

/* Object Pool
    O objeto "Pool" é responsável por controlar os objetos. A array de objetos (entityList) guarda todos
    os objetos sendo usados em cena, e o "Pool" guarda todos os objetos que não estao sendo usados. Por guardar 
    os objetos que seriam inicialmente deletados, nós podemos reutilizá-los ao invés de criar totalmente novas 
    instancias com o operador "new". Reciclar objetos salva memória ! 
*/

let Pool = {

    // Declarando as classes

    Jogador: Jogador,

    Meteoro: Meteoro,

    Tiro: Tiro,

    stored: new Array(),

    // Tenta pegar um objeto armazenado
    get: function (className, nome, parameters) {
        let index = -1;

        // Percorre a array e verifica se o objeto requisitado já existe
        for (let i = 0; i < this.stored.length; i++) {
            const element = this.stored[i];
            if (element.nome == nome) {
                index = i;
                // Se sim, termina o loop
                break;
            }
        }

        // Objeto requisitado existe
        if (index >= 0) {
            let GAMEOBJECT = this.stored[index];

            // Retira o objeto requisitado da array
            this.stored.splice(index, 1)

            // Reseta o GAMEOBJECT
            GAMEOBJECT.resetAt(parameters);

            // Retorna o objeto requisitado
            return GAMEOBJECT;
        }

        // Objeto ainda nao foi armazenado, retornar um novo
        return this.create(className, nome, parameters);
    },

    // Cria um novo objeto / classe
    create: function (className, nome, parameters){
        let myObj;
        if (className == "Audio") {
            myObj = Galeria.audio[nome].cloneNode(true); // Cria um clone do elemento Audio armazenado anteriormente
            myObj.nome = nome; // Atribui um nome à ele, para futura requisição da Pool
            myObj.resetAt = function (params) { // Atribui a função resetAt, para futura requisição da Pool
                this.currentTime = 0; 
            }
            myObj.addEventListener("ended", (myMusic) => { // Event listener, ao terminar de tocar o audio, adicionar para Pool
                Pool.add(myObj);
            })
        } else {
            myObj = new this[className](parameters);
        }

        // retorna o novo Objeto
        return myObj;
    },

    // Adiciona um novo objeto a pool
    add: function (GameObject) {
        // Posso passar como parametro uma array de objetos
        if (GameObject.length > 0) {
            GameObject.forEach(element => {
                this.stored.push(element);
            });
        }
        // Ou apenas um objeto
        else {
            this.stored.push(GameObject);
        }
    }
}

export default Pool;