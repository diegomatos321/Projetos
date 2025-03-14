import Vector from "./vector.js"

export default class GameObject{
    constructor({initialX, initialY, width, height, image, scene}){
        this.nome = "GameObject";

        if (image){
            this._image = image;
        }

        this._width = width || this.image.width;
        this._height = height || this.image.height;

        this._origin = {
            x: 0.5,
            y: 0.5
        };

        this._position = new Vector(initialX, initialY);
        this._velocity = new Vector(0, 0);

        this._isActive = true;
        this._color = "Black"

        this._scene = scene;
        
    }

    get width(){
        return this._width;
    }

    set width(value){
        this._width = value
    }

    get height(){
        return this._height;
    }

    set height(value){
        this._height = value
    }

    get color(){
        return this._color;
    }

    get aceleracao() {
        return this._aceleracao;
    }

    get velocidadeMaxima() {
        return this._velocidadeMaxima;
    }

    set color(value){
        this._color = value
    }

    get isActive(){
        return this._isActive;
    }

    set isActive(value){
        this._isActive = value;
    }

    get image(){
        return this._image;
    }

    set image(value){
        this._image = value
    }

    get GAME_WIDTH(){
        return this._scene.GAME_WIDTH;
    }

    get GAME_HEIGHT(){
        return this._scene.GAME_HEIGHT;
    }

    get origin(){
        return this._origin;
    }

    set origin(value){
        this._origin.x = value;
        this._origin.y = value;
    }

    set aceleracao(value) {
        this._aceleracao = value;
    }

    setOriginX(value){
        this._origin.x = value;
    }

    setOriginY(value){
        this._origin.y = value;
    }

    update(deltaTime){
        if(this._velocity.getLength() <= this._velocidadeMaxima){
            this._velocity.addTo(this.aceleracao*deltaTime)
        }

        this._position.addTo(this._velocity.multiply(deltaTime))
    }

    draw(ctx){
        if(this.image){
            ctx.drawImage(this.image, this._position.getX() - (this._origin.x*this._width), this._position.getY() - (this._origin.y*this._height), this._width, this._height);
            return;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this._position.getX(), this._position.getY(), this._width, this._height);
    }

    collideWorldBounds(){
        if (this._position.getX() + this.width*this._origin.x >= this.GAME_WIDTH) {
            // this._position.setX(this.GAME_WIDTH - 32);
            this._velocity.setLength(0);
        }
        if (this._position.getX() - this.width*this._origin.x <= 0) {
            // this._position.setX(0);
            this._velocity.setLength(0);
        }

        if (this._position.getY() + this.height*this._origin.y >= this.GAME_HEIGHT) {
            // this._position.setY(this.GAME_HEIGHT - 32);
            this._velocity.setLength(0);
        }
        if (this._position.getY() - this.height*this._origin.y <= 0) {
            // this._position.setY(0);
            this._velocity.setLength(0);
        }
    }

    deactivateWorldBounds(){
        if (this._position.getX() - this.width*this._origin.x >= this.GAME_WIDTH || 
        this._position.getX() + this.width*this._origin.x <= 0 || 
        this._position.getY() - this.height*this._origin.x >= this.GAME_HEIGHT || 
        this._position.getY() + this.height*this._origin.x <= 0) {
                this.isActive = false;
        }
    }

    reset({initialX: x, initialY: y, width: largura, height: altura, image: imagem, scene}){
        
        this._width = largura || this._imagem.width;
        this._height = altura || this._imagem.height;

        this._position.setXY(x, y);
        this._velocity.setXY(0, 0);

        this._isActive = true;
        this._color = "Black"

        this._scene = scene;
        
    }
}