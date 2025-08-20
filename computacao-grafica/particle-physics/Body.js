import Projection from "./Projection.js"

export default class Body {
    particles = []
    constraints = []
    NUM_ITERATIONS = 4

    constructor(gl, particles, constraints) {
        this.gl = gl
        this.particles = particles;
        this.constraints = constraints;
    }

    update(dt) {
        for (const particle of this.particles) {
            particle.update(dt)
        }

        for (let i = 0; i < this.NUM_ITERATIONS; i++) {
            for (const particle of this.particles) {
                let x = Math.max(Math.min(particle.position[0], this.gl.canvas.width), 0);
                let y = Math.max(Math.min(particle.position[1], this.gl.canvas.height), 0);
                particle.move(twgl.v3.create(x, y));

                // particle.move(twgl.v3.create(
                //     particle.position[0] * (1 - 0.5) + x * 0.5,
                //     particle.position[1] * (1 - 0.5) + y * 0.5,
                // ))
            }

            for (const constraint of this.constraints) {
                constraint.relax();
            }
        }
    }

    draw() {
        for (const particle of this.particles) {
            particle.draw();
        }

        for (const constraint of this.constraints) {
            constraint.draw();
        }
    }

    axes() {
        const axes = []
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i]

            const nextIndex = i + 1 === this.particles.length ? 0 : 1
            const p2 = this.particles[nextIndex]

            const edge = twgl.v3.subtract(p1, p2)
            const normal = twgl.v3.create(-edge[1], edge[0])
            axes.push(normal)
        }

        return axes
    }

    project(axis) {
        let min = twgl.v3.dot(this.particles[0], axis)
        let max = min

        for (let i = 1; i < this.particles.length; i++) {
            const proj = twgl.v3.dot(this.particles[i], axis)
            if (proj < min) {
                min = proj
            } else if (proj > max) {
                max = proj
            }
        }

        return new Projection(min, max)
    }
}