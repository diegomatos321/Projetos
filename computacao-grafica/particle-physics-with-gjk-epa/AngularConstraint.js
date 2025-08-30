export default class LinearConstraint {
    isActive = true

    constructor(gl, p0, p1, restitution = 0.5) {
        this.gl = gl
        this.p0 = p0
        this.p1 = p1
        this.restlength = twgl.v3.distance(p0.position, p1.position)
        this.restitution = restitution

        // const p1a = [this.p0.position[0], this.p0.position[1] + 1]
        // const p1b = [this.p0.position[0], this.p0.position[1] - 1]
        // const p2a = [this.p1.position[0], this.p1.position[1] + 1]
        // const p2b = [this.p1.position[0], this.p1.position[1] - 1]
        // this.bufferInfo = twgl.createBufferInfoFromArrays(gl, {
        //     a_position: {
        //         numComponents: 2,
        //         data: [
        //             ...p1a, ...p1b, ...p2a,
        //             ...p1b, ...p2b, ...p2a,
        //         ],
        //         drawType: gl.DYNAMIC_DRAW
        //     },
        // });

        // this.programInfo = twgl.createProgramInfo(gl, ["vs", "fs"]);

        this.relax()
    }

    relax() {
        if (this.isActive === false) return

        let delta = twgl.v3.subtract(this.p1.position, this.p0.position)
        let deltalength = twgl.v3.length(delta)
        if (deltalength > 30) {
            let diff = (deltalength - this.restlength) / (deltalength * (1 / this.p0.mass + 1 / this.p1.mass))
            this.p0.move(twgl.v3.add(this.p0.position, twgl.v3.mulScalar(delta, 1 / this.p0.mass * diff * this.restitution)))
            this.p1.move(twgl.v3.subtract(this.p1.position, twgl.v3.mulScalar(delta, 1 / this.p1.mass * diff * this.restitution)))    
        }
    }

    draw() {
        // if (this.isActive === false) return

        // const uniforms = {
        //     u_resolution: [this.gl.canvas.width, this.gl.canvas.height],
        //     u_color: [0, 0, 0, 1]
        //     // time: time * 0.001,
        // };

        // const p1a = [this.p0.position[0], this.p0.position[1] + 1]
        // const p1b = [this.p0.position[0], this.p0.position[1] - 1]
        // const p2a = [this.p1.position[0], this.p1.position[1] + 1]
        // const p2b = [this.p1.position[0], this.p1.position[1] - 1]

        // this.gl.useProgram(this.programInfo.program);
        // twgl.setAttribInfoBufferFromArray(this.gl, this.bufferInfo.attribs.a_position, [
        //     ...p1a, ...p1b, ...p2a,
        //     ...p1b, ...p2b, ...p2a,
        // ]);

        // twgl.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
        // twgl.setUniforms(this.programInfo, uniforms);
        // twgl.drawBufferInfo(this.gl, this.bufferInfo, this.gl.TRIANGLES);
    }
}