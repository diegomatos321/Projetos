class ExplosionSFX extends GameObject{
    constructor(name, x, y, spriteSheetConfig) {
        super (name, x, y, spriteSheetConfig);

        galeria.audios.explosion_sound.currentTime = 0;
        galeria.audios.explosion_sound.volume = 0.7;
        galeria.audios.explosion_sound.play();
    }
    update(){

        this.playAnimation();
    }

    playAnimation() {
        this.spriteSheet.currentTime += deltaTime;
        if (this.spriteSheet.currentTime < this.spriteSheet.delay) { return; }

        this.spriteSheet.currentFrame += 1;

        if (this.spriteSheet.currentFrame < 0 || this.spriteSheet.currentFrame > 4) {
            this.isActive = false;
        }
        this.spriteSheet.originX = this.spriteSheet.frameWidth * this.spriteSheet.currentFrame;
        this.spriteSheet.currentTime = 0;
    }
}