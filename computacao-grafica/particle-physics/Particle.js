export default class Particle {
    mass = 1;
    pinned = false;
    gravity = twgl.v3.create(0, 98, 0);
    // color = [1, 0.2, 0.2, 1]
    color = [0, 0, 1, 1]

    constructor(gl, position = twgl.v3.create()) {
        this.gl = gl
        this.position = position;
        this.previousPosition = twgl.v3.copy(position);

        this.bufferInfo = twgl.createBufferInfoFromArrays(gl, {
            a_position: {
                numComponents: 2,
                data: [position[0], position[1]],
                drawType: gl.DYNAMIC_DRAW
            },
        });

        this.programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);
    }

    update(dt) {
        if (this.pinned) return;

        let tmp = twgl.v3.copy(this.position);
        this.position[0] = 2 * this.position[0] - this.previousPosition[0]
        this.position[1] = 2 * this.position[1] - this.previousPosition[1] + this.gravity[1] * Math.pow(dt, 2)
        this.previousPosition = tmp;
    }

    move(newPosition) {
        if (this.pinned) return

        this.position[0] = newPosition[0];
        this.position[1] = newPosition[1];
    }

    draw() {
        const uniforms = {
            u_resolution: [this.gl.canvas.width, this.gl.canvas.height],
            u_color: this.color
            // time: time * 0.001,
        };

        this.gl.useProgram(this.programInfo.program);
        twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.a_position, [this.position[0], this.position[1]]);

        twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        twgl.setUniforms(this.programInfo, uniforms);
        twgl.drawBufferInfo(this.gl, this.bufferInfo, this.gl.POINTS);
    }
}