import IEntity from "./IEntity"

export default class Pendulo implements IEntity {
    public length: number = 150;
    public theta0: number = 45; // Em radianos
    public gravidade: number = 9.8
        
    private omega: number = 0;
    private theta: number;

    constructor(
        public x: number,
        public y: number,
        public radius: number,
        public backgroundColor:string | null = null,
        public strokeColor: string | null = null,
    ) {
        this.theta = this.theta0 * (Math.PI / 180)
    }

    public update(deltaTime: number): void {
        this.omega += -this.gravidade * Math.sin(this.theta);
        this.theta += this.omega / this.length * deltaTime;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        // Corda
        ctx.beginPath();
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(
            this.x + this.length * Math.sin(this.theta), 
            this.y + this.length * Math.cos(this.theta)
            )
        ctx.stroke()
        ctx.closePath();

        // Esfera
        ctx.beginPath();
        ctx.arc(
            this.x + this.length * Math.sin(this.theta), 
            this.y + this.length * Math.cos(this.theta), 
            this.radius, 0, Math.PI * 2, true)

        if (this.backgroundColor !== null) {
            ctx.fillStyle = this.backgroundColor;
        }
        ctx.fill();

        if (this.strokeColor !== null) {
            ctx.fillStyle = this.strokeColor;
        }

        ctx.stroke()
        ctx.closePath()
    }

    public setTheta0(newValue: number): void {
        this.theta0 = newValue;
        this.theta = this.theta0 * (Math.PI / 180)
    }
}