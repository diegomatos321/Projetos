export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    init() {
        const { width, height } = this.sys.game.canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;
    }

    create() {
        this.map = this.add.tilemap("menu");
        this.tileset = this.map.addTilesetImage('mariotileset', 'tileset');

        this.fundo = this.map.createStaticLayer("mundo", this.tileset);
        this.jogador = this.add.sprite(48, 200, "Mario Pequeno");

        this.banner = this.add.image(this.GAME_WIDTH / 2, this.GAME_HEIGHT / 4, "menuBanner");
        this.banner.setScale(0.23)

        this.marioOpcao = this.add.text(this.GAME_WIDTH / 2 - 30,  this.GAME_HEIGHT / 2, "Jogar com o Mario", { fontFamily: "Source Code Pro", fontSize: "12px" });
        this.marioOpcao.setOrigin(0, 0.5)

        this.luigiOpcao = this.add.text(this.GAME_WIDTH / 2 - 30,  this.GAME_HEIGHT / 2 + 16, "Jogar com o Luigi", { fontFamily: "Source Code Pro", fontSize: "12px" });
        this.luigiOpcao.setOrigin(0, 0.5)

        this.ponteiro = this.add.image(this.marioOpcao.x - 8, this.marioOpcao.y, "menuPonteiro");
        this.ponteiro.setScale(0.3);
        this.ponteiro.current = "Mario";

        let downKey = this.input.keyboard.addKey('DOWN');
        downKey.on('down', function () {
            if(this.ponteiro.current == "Mario"){
                this.ponteiro.y = this.luigiOpcao.y;
                this.ponteiro.current = "Luigi";
            }
        }, this);

        let upKey = this.input.keyboard.addKey('UP');
        upKey.on('down', function () {
            if(this.ponteiro.current == "Luigi"){
                this.ponteiro.y = this.marioOpcao.y;
                this.ponteiro.current = "Mario";
            }
        }, this);

        let enterKey = this.input.keyboard.addKey('ENTER');
        enterKey.on('down', function () {
            const data = {
                jogadorEscolhido : {
                    current: this.ponteiro.current,
                    tamanho: "Pequeno"
                }
            }

            this.scene.start("Level1", data);
        }, this);
    }
}