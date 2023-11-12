//import IEntity from "./objects/IEntity"
import Pendulo from "./objects/Pendulo.js";
var STATES;
(function (STATES) {
    STATES[STATES["Paused"] = 0] = "Paused";
    STATES[STATES["Playing"] = 1] = "Playing";
})(STATES || (STATES = {}));
export default class Main {
    constructor(WIDTH, HEIGHT, canvas_id) {
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.deltaTime = 0;
        this.lastTimeStamp = 0;
        this.currentState = STATES.Paused;
        this.AnimLoop = (timestamp) => {
            window.requestAnimationFrame(this.AnimLoop);
            timestamp /= 1000;
            this.deltaTime = timestamp - this.lastTimeStamp;
            this.lastTimeStamp = timestamp;
            const ctx = this.CANVAS.getContext("2d");
            ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            if (this.currentState === STATES.Playing) {
                this.pendulo.update(this.deltaTime);
                this.pendulo.draw(ctx);
            }
            else {
                this.pendulo.draw(ctx);
            }
            this.DrawHUD(ctx);
        };
        this.CANVAS = document.getElementById(canvas_id);
        this.pendulo = new Pendulo(this.WIDTH / 2, 0, 20);
        const thetaInput = document.getElementById('theta0');
        thetaInput.value = String(this.pendulo.theta0);
        thetaInput.addEventListener('blur', (event) => this.HandleTheta0Input(event));
        const lengthInput = document.getElementById('comprimento_corda');
        lengthInput.value = String(this.pendulo.length);
        const outputValue = lengthInput.nextElementSibling;
        outputValue.value = String(lengthInput.value);
        lengthInput.addEventListener('input', (event) => this.HandleLengthInput(event));
        const gravidadeInput = document.getElementById('gravidade');
        gravidadeInput.value = String(this.pendulo.gravidade);
        gravidadeInput.addEventListener('blur', (event) => this.HandleGravityInput(event));
        window.requestAnimationFrame(this.AnimLoop);
    }
    DrawHUD(ctx) {
        const fps = 1000 / (this.deltaTime * 1000);
        ctx.font = "24px serif";
        ctx.fillText(`${fps.toFixed(2)} FPS`, this.WIDTH - 24 * 5, 20);
    }
    TooglePlay() {
        const toogleBtn = document.getElementById('toogleBtn');
        if (this.currentState === STATES.Paused) {
            this.currentState = STATES.Playing;
            toogleBtn.textContent = 'Pausar';
        }
        else {
            this.currentState = STATES.Paused;
            toogleBtn.textContent = 'Iniciar';
        }
    }
    HandleTheta0Input(event) {
        const target = event.target;
        if (target.value === '') {
            target.value = String(this.pendulo.theta0);
            return;
        }
        this.pendulo.setTheta0(Number(target.value));
    }
    HandleLengthInput(event) {
        const target = event.target;
        if (target.value === '') {
            target.value = String(this.pendulo.length);
            return;
        }
        this.pendulo.length = Number(target.value);
        const outputValue = target.nextElementSibling;
        outputValue.value = String(target.value);
    }
    HandleGravityInput(event) {
        const target = event.target;
        if (target.value === '') {
            target.value = String(this.pendulo.gravidade);
            return;
        }
        this.pendulo.gravidade = Number(target.value);
    }
}
//# sourceMappingURL=Main.js.map