//import {background} from "./main.js"
//import Player from "./player.js"
//import Inimigo from "./enemy.js"

class LEVEL1 {
    constructor() {

        this.background_img = galeria.imagens.background_img;

        this.entityList = new Array();

        let jogadorSpriteSheetConfig = {
            img: galeria.spriteSheets.jogador_sprite,
            width: 39,
            height: 43,
            delay: 0.06 // Em ms
        }

        let jogador = new Player("Jogador", GAME_WIDTH/2 - 19.5, GAME_HEIGHT - 50, jogadorSpriteSheetConfig, this);
        jogador.setScale(0.8);

        this.createGameObject(jogador);

        this.pontos = 0;

        this.spawnDelay = 2; // em s
        this.currentTime = 0;

        this.drawHUD("Pontuação")
    }

    update() {
        this.currentTime += deltaTime;

        if (this.currentTime > this.spawnDelay) {
            this.createRandomEnemy();
        }

        this.checkForCollisions();

        this.entityList = this.entityList.filter(entity => {
            return entity.isActive;
        })

        this.entityList.forEach(entity => {
            entity.update();
        });
    }

    draw() {
        gameLayer_ctx.drawImage(this.background_img, 0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.entityList.forEach(entity => {
            entity.draw();
        });
    }

    createGameObject(gameObject) {
        this.entityList.push(gameObject);
    }

    createRandomEnemy() {
        let randomPosX = Math.round(Math.random() * (GAME_HEIGHT - 100))

        //let randomImg = Math.floor(Math.random() * spriteSheets.inimigos_sprite.length);

        let inimigoConfig = {
            img: galeria.spriteSheets.inimigo01_sprite,
            width: galeria.spriteSheets.inimigo01_sprite.width / 2,
            height: galeria.spriteSheets.inimigo01_sprite.height,
            delay: 0.06 // Em ms
        }

        let inimigo = new Inimigo("Inimigo", randomPosX, -20, inimigoConfig, this);
        inimigo.setScale(0.4);

        this.createGameObject(inimigo);
        this.currentTime = 0;

        this.spawnDelay = Math.ceil(Math.random() * 2);
    }

    checkForCollisions() {
        this.entityList.forEach(entity => {
            this.entityList.forEach(entity1 => {
                if (entity == entity1 || entity.name == "Explosao" || entity1.name == "Explosao") { return };

                if (CollisionHandler(entity, entity1)) {
                    entity.isActive = false;
                    entity1.isActive = false;

                    this.pontos+=5;

                    this.drawHUD("Pontuação")

                    this.createExplosionSFX(entity, entity1);
                }
            })
        });
    }

    createExplosionSFX(entity, entity1) {
        let elementos = [entity, entity1]
        for (let i = 0; i < 2; i++) {
            const element = elementos[i];
            if (element.name != "Inimigo" && element.name != "Jogador") { return; }// Cria a explosao apenas quando for inimigo ou o jogador
            
            let explosionSpriteSheetConfig = {
                img: galeria.spriteSheets.explosion_sprite,
                width: 16,
                height: 16,
                delay: 0.06 // Em ms
            }

            let explosao = new ExplosionSFX("Explosao", element.position.getX(), element.position.getY(), explosionSpriteSheetConfig, this);
            explosao.setScale(2);

            setTimeout( () => {this.createGameObject(explosao)}, deltaTime);
        }
    }

    drawHUD(HUD){
        if (HUD == "Pontuação"){
            uiLayer_ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

            uiLayer_ctx.font = "14px Arial";
            uiLayer_ctx.textAlign = "left";
            uiLayer_ctx.fillStyle = "white";
            uiLayer_ctx.fillText(`Pontuação: ${this.pontos}`, 10 , 15);
        }
        if(HUD == "Vidas"){

        }
    }
}