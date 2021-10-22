class Game{
    constructor(){
        
        this.GAME_STATE = {
            MENU: 0,
            PLAYING: 1,
            PAUSED: 2,
            GAME_OVER: 3
        }
        
        this.SCENES = [new LEVEL0(), new LEVEL1()];

        this.currentState = this.GAME_STATE.PLAYING;
        this.currentLevel = this.SCENES[1];
    }

    update(){
        this.currentLevel.update();
    }

    draw(){
        this.currentLevel.draw();
    }
}