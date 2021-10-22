class GameObject {
    constructor(name, x, y, spriteSheetConfig) {
        this.name = name;

        this.acceleration = new Vector(300, 0)  // PIXELS / 1000ms => 300px/1000ms => 0,3px/ms

        this.speed = new Vector(0, 0)

        this.visible = true;
        this.isActive = true;

        this.position = new Vector(x, y);

        this.scale = 1;

        if (spriteSheetConfig == undefined || spriteSheetConfig == null) {
            this.img = galeria.imagens[`${name}_img`];

            this.width = this.img.width * this.scale;
            this.height = this.img.height * this.scale;
        } else {
            this.spriteSheet = {
                img: spriteSheetConfig.img,
                width: spriteSheetConfig.width * this.scale,
                height: spriteSheetConfig.height * this.scale,
                frameWidth: spriteSheetConfig.width,
                frameHeight: spriteSheetConfig.height,
                currentFrame: 0,
                currentTime: 0,
                //frames: 9,
                delay: spriteSheetConfig.delay, // Em ms
                originX: 0,
                originY: 0
            }
            this.width = this.spriteSheet.width;
            this.height = this.spriteSheet.height;
        }
        
    }

    draw(){
        if(typeof(this.spriteSheet) == "object"){
            gameLayer_ctx.drawImage(this.spriteSheet.img, this.spriteSheet.originX, this.spriteSheet.originY, this.spriteSheet.frameWidth,
                this.spriteSheet.frameHeight, this.position.getX(), this.position.getY(), this.width, this.height);
        }else{
            gameLayer_ctx.drawImage(this.img, this.position.getX(), this.position.getY(), this.width, this.height)
        }
    }
    collideWorldBounds() {
        if (this.position.getX() < 0) {
            this.position.setX(0);
        }
        else if (this.position.getX() + this.width > GAME_WIDTH) {
            this.position.setX(GAME_WIDTH - this.width);
        }
        if (this.position.getY() < 0) {
            this.position.setY(0)
        }
        if (this.position.getY() + this.height > GAME_HEIGHT) {
            this.position.setY(GAME_HEIGHT - this.height);
        }
    }
    deactivateOutsideWorldBounds() {
        if (this.position.getX() + this.width < 0) {
            this.isActive = false;
        }
        else if (this.position.getX() > GAME_WIDTH) {
            this.isActive = false;
        }
        if (this.position.getY() + this.height < 0) {
            this.isActive = false;
        }
        if (this.position.getY() > GAME_HEIGHT) {
            this.isActive = false;
        }
    }
    setScale(newScale){
        if (newScale == undefined) { newScale = this.scale}

        this.width *= newScale;
        this.height *= newScale;

        if (this.spriteSheet == undefined || this.spriteSheet == null) { return;}

        this.spriteSheet.width *= newScale;
        this.spriteSheet.height *= newScale;
    }
}