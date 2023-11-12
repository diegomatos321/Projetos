//import IEntity from "./objects/IEntity"
import Pendulo from "./objects/Pendulo.js"

enum STATES {
    Paused = 0,
    Playing = 1,
}

export default class Main {
    public deltaTime: number = 0;

    protected CANVAS: HTMLCanvasElement;
    protected lastTimeStamp = 0;

    private pendulo: Pendulo;
    private currentState: STATES = STATES.Paused;

    constructor(
        protected WIDTH: number,
        protected HEIGHT: number,
        canvas_id: string,
    ) {
        this.CANVAS = document.getElementById(canvas_id) as HTMLCanvasElement;

        this.pendulo = new Pendulo(
            this.WIDTH / 2,
            0,
            20
        )

        const thetaInput: HTMLInputElement = document.getElementById('theta0') as HTMLInputElement;
        thetaInput.value = String(this.pendulo.theta0);
        thetaInput.addEventListener('blur', (event) => this.HandleTheta0Input(event))

        const lengthInput: HTMLInputElement = document.getElementById('comprimento_corda') as HTMLInputElement;
        lengthInput.value = String(this.pendulo.length);
        const outputValue: HTMLInputElement = lengthInput.nextElementSibling as HTMLInputElement
        outputValue.value = String(lengthInput.value)
        lengthInput.addEventListener('input', (event) => this.HandleLengthInput(event))

        const gravidadeInput: HTMLInputElement = document.getElementById('gravidade') as HTMLInputElement;
        gravidadeInput.value = String(this.pendulo.gravidade);
        gravidadeInput.addEventListener('blur', (event) => this.HandleGravityInput(event))

        window.requestAnimationFrame(this.AnimLoop);
    }

    public AnimLoop = (timestamp: DOMHighResTimeStamp): void => {
        window.requestAnimationFrame(this.AnimLoop);

        timestamp /= 1000;
        this.deltaTime = timestamp - this.lastTimeStamp;
        this.lastTimeStamp = timestamp;

        const ctx: CanvasRenderingContext2D = this.CANVAS.getContext("2d") as CanvasRenderingContext2D
        ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        if (this.currentState === STATES.Playing) {
            this.pendulo.update(this.deltaTime)
            this.pendulo.draw(ctx);
        } else {
            this.pendulo.draw(ctx);
        }

        this.DrawHUD(ctx);
    }

    private DrawHUD(ctx: CanvasRenderingContext2D): void {
        const fps = 1000 / (this.deltaTime * 1000);
        ctx.font = "24px serif";
        ctx.fillText(`${fps.toFixed(2)} FPS`, this.WIDTH - 24*5, 20);
    }

    public TooglePlay(): void {
        const toogleBtn: HTMLButtonElement = document.getElementById('toogleBtn') as HTMLButtonElement

        if (this.currentState === STATES.Paused) {
            this.currentState = STATES.Playing
            toogleBtn.textContent = 'Pausar'
        } else {
            this.currentState = STATES.Paused
            toogleBtn.textContent = 'Iniciar'
        }
    }

    private HandleTheta0Input(event: FocusEvent): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (target.value === '') {
            target.value = String(this.pendulo.theta0)
            return
        }

        this.pendulo.setTheta0(Number(target.value))
    }

    private HandleLengthInput(event: Event): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (target.value === '') {
            target.value = String(this.pendulo.length)
            return;
        }

        this.pendulo.length = Number(target.value)

        const outputValue: HTMLInputElement = target.nextElementSibling as HTMLInputElement
        outputValue.value = String(target.value)
    }

    private HandleGravityInput(event: FocusEvent): void {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        if (target.value === '') {
            target.value = String(this.pendulo.gravidade)
            return;
        }

        this.pendulo.gravidade = Number(target.value)
    }
}