export default class Pendulo {
    constructor(x, y, radius, backgroundColor = null, strokeColor = null) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.backgroundColor = backgroundColor;
        this.strokeColor = strokeColor;
        this.length = 150;
        this.theta0 = 45; // Em radianos
        this.gravidade = 9.8;
        this.omega = 0;
        this.theta = this.theta0 * (Math.PI / 180);
    }
    update(deltaTime) {
        this.omega += -this.gravidade * Math.sin(this.theta);
        this.theta += this.omega / this.length * deltaTime;
    }
    draw(ctx) {
        // Corda
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.length * Math.sin(this.theta), this.y + this.length * Math.cos(this.theta));
        ctx.stroke();
        ctx.closePath();
        // Esfera
        ctx.beginPath();
        ctx.arc(this.x + this.length * Math.sin(this.theta), this.y + this.length * Math.cos(this.theta), this.radius, 0, Math.PI * 2, true);
        if (this.backgroundColor !== null) {
            ctx.fillStyle = this.backgroundColor;
        }
        ctx.fill();
        if (this.strokeColor !== null) {
            ctx.fillStyle = this.strokeColor;
        }
        ctx.stroke();
        ctx.closePath();
    }
    setTheta0(newValue) {
        this.theta0 = newValue;
        this.theta = this.theta0 * (Math.PI / 180);
    }
}
//# sourceMappingURL=Pendulo.js.map