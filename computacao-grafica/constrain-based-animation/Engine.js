export default class Engine {
    inputs = { mousePosition: twgl.v3.create(400, 300, 0) };
    entities = []

    lastTime = 0

    constructor(gl) {
        this.gl = gl
    }

    start() {
        this.gl.canvas.addEventListener("pointerdown", (event) => {
            const rect = this.gl.canvas.getBoundingClientRect();
            this.inputs.mousePosition[0] = event.clientX - rect.left;
            this.inputs.mousePosition[1] = event.clientY - rect.top;
        });

        requestAnimationFrame(this.loop.bind(this))
    }

    loop(time = 0) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        twgl.resizeCanvasToDisplaySize(this.gl.canvas);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        this.entities.forEach(entity => {
            entity.Update(deltaTime);
            entity.Draw();
        });

        requestAnimationFrame(this.loop.bind(this))
    }
}