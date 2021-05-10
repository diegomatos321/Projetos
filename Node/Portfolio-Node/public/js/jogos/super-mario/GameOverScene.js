export default class GameOverScene extends Phaser.Scene{
    constructor(){
        super("GameOverScene");
    }

    init(parameters){
        const {width, height} = this.sys.game.canvas;
        this.GAME_WIDTH = width;
        this.GAME_HEIGHT = height;

        this.level = parameters.level;
        this.name = parameters.name;
    }
    create(){ 
        console.log(this.name);
        this.cameras.main.setBackgroundColor("black");
        this.txtLevel = this.add.text(this.GAME_WIDTH / 2, this.GAME_HEIGHT/3, `${this.name}`, { fontFamily: "Source Code Pro", fontSize: "12px" })
        this.txtLevel.setOrigin(0.5)

        this.time.addEvent({
            delay: 4000,                // ms
            callback: function (){
                this.scene.start(this.level)
            },
            //args: [],
            callbackScope: this
        });
    }
}