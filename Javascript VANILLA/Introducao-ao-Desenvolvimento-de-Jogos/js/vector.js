export default class Vector {
    constructor(x, y) {
        this.nome = "Vetor";
        this._x = x;
        this._y = y;
    }

    setX(value) {
        this._x = value;
    }

    setY(value) {
        this._y = value;
    }

    setXY(x, y) {
        this._x = x;
        this._y = y;
    }

    setTo(vector) {
        // console.log(vector)
        this._x = vector.x;
        this._y = vector.y;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    setAngle(angle) {
        let length = this.getLength();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    getAngle() {
        return Math.atan2(this._y, this._x);
    }

    setLength(length) {
        let angle = this.getAngle();
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    getLength() {
        return Math.sqrt(this._x ** 2 + this._y ** 2);
    }

    add(value) {
        return new Vector(this._x + value.getX(), this._y + value.getY());
    }

    addTo(value) {
        this._x += value.getX();
        this._y += value.getY();
        return
    }

    subtract(value) {
        return new Vector(this._x - value.getX(), this._y - value.getY());
    }

    subtractBy(value) {
        this._x -= value.getX();
        this._y -= value.getY();
        return
    }

    multiply(value) {
        return new Vector(this._x * value, this._y * value);
    }

    multiplyBy(value) {
        this._x *= value;
        this._y *= value;
    }
}