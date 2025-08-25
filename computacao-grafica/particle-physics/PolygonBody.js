import Particle from "./Particle.js"
import LinearConstraint from "./LinearConstraint.js"
import Projection from "./Projection.js"

export default class PolygonBody {
    particles = []
    constraints = []
    NUM_ITERATIONS = 5
    isOverlapping = false

    constructor(gl, vertex_positions) {
        this.gl = gl

        this.particles = vertex_positions.map(v => {
            const p = new Particle(gl, twgl.v3.create(v[0], v[1]))
            // p.gravity = twgl.v3.create(0,0)
            return p
        })

        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            const p2 = this.particles[(i + 1) % this.particles.length]
            this.constraints.push(new LinearConstraint(gl, p1, p2))

            for (let j = i+2; j < this.particles.length-1; j++) {
                const crossP1 = this.particles[j]
                this.constraints.push(new LinearConstraint(gl, p1, crossP1))
            }
        }
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
            if (this.isOverlapping === true) {
                particle.color = [1, 0.2, 0.2, 1]
            } else {
                particle.color = [0, 0, 1, 1]
            }
            particle.draw();
        }

        for (const constraint of this.constraints) {
            constraint.draw();
        }
    }

    axes() {
        const axes = []
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i].position

            const nextIndex = i + 1 === this.particles.length ? 0 : i + 1
            const p2 = this.particles[nextIndex].position

            const edge = twgl.v3.subtract(p1, p2)
            const normal = twgl.v3.create(-edge[1], edge[0])
            axes.push(normal)
        }

        return axes
    }

    project(axis) {
        let min = twgl.v3.dot(axis, this.particles[0].position)
        let max = min

        for (let i = 1; i < this.particles.length; i++) {
            const proj = twgl.v3.dot(axis, this.particles[i].position)
            if (proj < min) {
                min = proj
            } else if (proj > max) {
                max = proj
            }
        }

        return new Projection(min, max)
    }

    // Centroid of a Polygon
    getCenter() {
        let area = 0;
        let cx = 0;
        let cy = 0;

        const n = this.particles.length;
        for (let i = 0; i < n; i++) {
            const [x0, y0] = this.particles[i].position;
            const [x1, y1] = this.particles[(i + 1) % n].position;

            const cross = x0 * y1 - x1 * y0;
            area += cross;
            cx += (x0 + x1) * cross;
            cy += (y0 + y1) * cross;
        }

        area *= 0.5;
        cx /= (6 * area);
        cy /= (6 * area);

        return [cx, cy, 0];
    }

    getFarthestPointInDirection(d) {
        let max = Number.NEGATIVE_INFINITY
        let best

        for (const particle of this.particles) {
            let candidate = twgl.v3.dot(d, particle.position)
            if (candidate > max) {
                max = candidate
                best = particle.position
            }
        }

        return best
    }
}