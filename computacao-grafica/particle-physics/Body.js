import Projection from "./Projection.js"

export default class Body {
    particles = []
    constraints = []
    NUM_ITERATIONS = 4
    isOverlapping = false

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

    getCenter() {
        const A = twgl.v3.mulScalar(this.particles[0].position, 1 / 3)
        const B = twgl.v3.mulScalar(this.particles[1].position, 1 / 3)
        const C = twgl.v3.mulScalar(this.particles[2].position, 1 / 3)

        return twgl.v3.add(A, twgl.v3.add(B, C))
    }

    getFarthestPointInDirection(d) {
        let maxIndex = 0
        let n = this.particles.length
        let max = twgl.v3.dot(d, this.particles[0].position)

        let candidateMax = twgl.v3.dot(d, this.particles[1].position)

        if (max < candidateMax) {
            // Search to the right
            while (true) {
                max = candidateMax
                maxIndex++

                if (maxIndex + 1 < n) {
                    candidateMax = twgl.v3.dot(d, this.particles[maxIndex + 1].position)
                    if (max >= candidateMax) {
                        break
                    }
                } else {
                    break
                }
            }
        } else {
            candidateMax = twgl.v3.dot(d, this.particles[n - 1].position)

            if (max < candidateMax) {
                maxIndex = n

                // Search to the right
                while (true) {
                    max = candidateMax
                    maxIndex--

                    if (maxIndex - 1 > 0) {
                        candidateMax = twgl.v3.dot(d, this.particles[maxIndex - 1].position)
                        if (max > candidateMax) {
                            break
                        }
                    } else {
                        break
                    }
                }
            }
        }
        // if neither of the above conditions is met, then the initial index is the maximum

        return this.particles[maxIndex].position
    }
}