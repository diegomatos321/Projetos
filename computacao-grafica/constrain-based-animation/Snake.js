export default class Snake {
    spine = { joints: [] };
    angleConstrain = Math.cos(Math.PI / 4);
    distanceConstrain = 12;

    velocity = 100
    angularVelocity = 0.1;

    constructor(engine, position, segments) {
        this.engine = engine;

        const origin = twgl.v3.create(position.x, position.y, 0);
        for (let i = 0; i < segments; i++) {
            const position = twgl.v3.create(origin[0] - i * this.distanceConstrain, origin[1], 0);
            this.spine.joints.push(position);
        }

        this.programInfo = twgl.createProgramInfo(this.engine.gl, ["vs", "fs"]);
    }

    Update(deltaTime) {
        for (let i = 2; i < this.spine.joints.length; i++) {
            const a = this.spine.joints[i - 2];
            const b = this.spine.joints[i - 1];
            const c = this.spine.joints[i];

            const u = twgl.v3.subtract(b, a);
            const v = twgl.v3.subtract(c, a);

            const dot = twgl.v3.dot(u, v)
            const uLengh = twgl.v3.length(u);
            const vLengh = twgl.v3.length(v);
            const angle = dot / (uLengh * vLengh);

            if (angle <= this.maxAngle) {
                // Determine rotation direction using cross product
                const cross = u[0] * v[1] - u[1] * v[0];
                const sign = cross < 0 ? -1 : 1;

                const rotationMatrix = twgl.m4.rotationZ(sign * (angle - this.maxAngle))
                const relativePos = twgl.v3.subtract(c, b);
                const rotated = twgl.m4.transformDirection(rotationMatrix, relativePos);
                const newPos = twgl.v3.add(b, rotated);

                // Smoothing rotation with euler Integration
                const direction = twgl.v3.normalize(twgl.v3.subtract(newPos, c));
                const velocity = twgl.v3.mulScalar(direction, this.angularVelocity * deltaTime / 1000);
                const tmp = twgl.v3.add(c, velocity);
                c[0] = tmp[0];
                c[1] = tmp[1];
            }
        }

        const head = this.spine.joints[0]
        let direction = twgl.v3.subtract(this.engine.inputs.mousePosition, head)
        if (twgl.v3.length(direction) > 10) {
            // Smoothing head movement with euler Integration
            direction = twgl.v3.normalize(direction);
            const velocity = twgl.v3.mulScalar(direction, this.velocity * deltaTime / 1000);
            const tmp = twgl.v3.add(head, velocity);
            head[0] = tmp[0];
            head[1] = tmp[1];
        }

        for (let i = 1; i < this.spine.joints.length; i++) {
            let link = this.spine.joints[i];
            const prevLink = this.spine.joints[i - 1];

            let newPos = this.ConstrainDistance(link, prevLink)
            link[0] = newPos[0];
            link[1] = newPos[1];
        }
    }

    Draw() {
        const rightPolygons = this.GetRightSide();
        const head = this.GetHead();
        const leftPolygons = this.GetLeftSide();
        const bottomPoint = this.GetBottom();

        const polygonVertices = rightPolygons.concat(head)
            .concat(leftPolygons.reverse())
            .concat(bottomPoint);
        const indices = earcut.default(polygonVertices);

        this.engine.gl.useProgram(this.programInfo.program);

        twgl.setUniforms(this.programInfo, {
            u_resolution: [this.engine.gl.canvas.width, this.engine.gl.canvas.height],
            u_color: [1, 0.2, 0.2, 1],
        });

        // for (let i = 0; i < rightPolygons.length; i += 2) {
        //     const x = rightPolygons[i];
        //     const y = rightPolygons[i+1];
        //     const bufferInfo = twgl.createBufferInfoFromArrays(this.engine.gl, {
        //         a_position: {
        //             data: this.CircleVertices(x, y, 5, 8),
        //             numComponents: 2,
        //             drawType: this.engine.gl.STATIC_DRAW
        //         },
        //     });

        //     twgl.setBuffersAndAttributes(this.engine.gl, this.programInfo, bufferInfo);
        //     twgl.drawBufferInfo(this.engine.gl, bufferInfo, this.engine.gl.TRIANGLE_FAN);
        // }

        const bufferInfo = twgl.createBufferInfoFromArrays(this.engine.gl, {
            a_position: {
                data: polygonVertices,
                numComponents: 2,
                drawType: this.engine.gl.STATIC_DRAW
            },
            indices: {
                data: indices,
                numComponents: 1,
                drawType: this.engine.gl.STATIC_DRAW
            }
        });
        twgl.setBuffersAndAttributes(this.engine.gl, this.programInfo, bufferInfo);
        twgl.drawBufferInfo(this.engine.gl, bufferInfo, this.engine.gl.TRIANGLES);
    }

    // Right side of the snake, points is created from last bottom to top
    GetRightSide() {
        const result = [];
        for (let i = this.spine.joints.length - 2; i > 0; i--) {
            const origin = this.spine.joints[i];
            const leftJoint = this.spine.joints[i - 1];
            // const size = this.spine.sizes[i];
            const size = 24

            const baseX = twgl.v3.normalize(twgl.v3.subtract(leftJoint, origin));
            const baseY = twgl.v3.create(-baseX[1], baseX[0], 0);

            let base = twgl.m4.create();
            base = twgl.m4.setAxis(base, baseX, 0);
            base = twgl.m4.setAxis(base, baseY, 1);
            base = twgl.m4.setTranslation(base, origin);

            let point = twgl.v3.create(Math.cos(Math.PI / 2) * size, Math.sin(Math.PI / 2) * size, 0);
            point = twgl.m4.transformPoint(base, point);
            result.push(point[0], point[1]);
        }

        return result;
    }

    // Left side of the snake, points is created from bottom to top
    GetLeftSide() {
        const result = [];
        for (let i = this.spine.joints.length - 2; i > 0; i--) {
            const origin = this.spine.joints[i];
            const leftJoint = this.spine.joints[i - 1];
            // const size = this.spine.sizes[i];
            const size = 24

            const baseX = twgl.v3.normalize(twgl.v3.subtract(leftJoint, origin));
            const baseY = twgl.v3.create(-baseX[1], baseX[0], 0);

            let base = twgl.m4.create();
            base = twgl.m4.setAxis(base, baseX, 0);
            base = twgl.m4.setAxis(base, baseY, 1);
            base = twgl.m4.setTranslation(base, origin);

            let point = twgl.v3.create(Math.cos(-Math.PI / 2) * size, Math.sin(-Math.PI / 2) * size, 0);
            point = twgl.m4.transformPoint(base, point);
            result.push(point[1], point[0]); // Will reverse the order to maintain correct indices for earcut
        }
        return result;
    }

    GetBottom() {
        const result = [];
        const i = this.spine.joints.length - 1;
        const origin = this.spine.joints[i];
        const leftJoint = this.spine.joints[i - 1];
        // const size = this.spine.sizes[i];
        const size = 24

        const baseX = twgl.v3.normalize(twgl.v3.subtract(leftJoint, origin));
        const baseY = twgl.v3.create(-baseX[1], baseX[0], 0);

        let base = twgl.m4.create();
        base = twgl.m4.setAxis(base, baseX, 0);
        base = twgl.m4.setAxis(base, baseY, 1);
        base = twgl.m4.setTranslation(base, origin);

        let point = twgl.v3.create(Math.cos(Math.PI + Math.PI / 4) * size, Math.sin(Math.PI + Math.PI / 4) * size, 0);
        point = twgl.m4.transformPoint(base, point);
        result.push(point[0], point[1]);

        point = twgl.v3.create(Math.cos(Math.PI) * size, Math.sin(Math.PI) * size, 0);
        point = twgl.m4.transformPoint(base, point);
        result.push(point[0], point[1]);

        point = twgl.v3.create(Math.cos(Math.PI - Math.PI / 4) * size, Math.sin(Math.PI - Math.PI / 4) * size, 0);
        point = twgl.m4.transformPoint(base, point);
        result.push(point[0], point[1]);
        return result;
    }

    GetHead() {
        const result = [];
        const i = 0;
        const origin = this.spine.joints[i];
        const leftJoint = this.engine.inputs.mousePosition;
        // const size = this.spine.sizes[i];
        const size = 24

        const baseX = twgl.v3.normalize(twgl.v3.subtract(leftJoint, origin));
        const baseY = twgl.v3.create(-baseX[1], baseX[0], 0);

        let base = twgl.m4.create();
        base = twgl.m4.setAxis(base, baseX, 0);
        base = twgl.m4.setAxis(base, baseY, 1);
        base = twgl.m4.setTranslation(base, origin);

        let point = twgl.v3.create(Math.cos(Math.PI / 6) * size, Math.sin(Math.PI / 6) * size, 0);
        point = twgl.m4.transformPoint(base, point);
        result.push(point[0], point[1]);

        point = twgl.v3.create(Math.cos(0) * size, Math.sin(0) * size, 0);
        point = twgl.m4.transformPoint(base, point);
        result.push(point[0], point[1]);

        point = twgl.v3.create(Math.cos(-Math.PI / 6) * size, Math.sin(-Math.PI / 6) * size, 0);
        point = twgl.m4.transformPoint(base, point);
        result.push(point[0], point[1]);
        return result;
    }

    ConstrainDistance(point, anchor) {
        let result = twgl.v3.subtract(point, anchor);
        result = twgl.v3.normalize(result);
        result = twgl.v3.mulScalar(result, this.distanceConstrain);
        return twgl.v3.add(anchor, result);
    }

    CircleVertices(x, y, radius, numSegments) {
        const points = [];
        for (let i = 0; i <= numSegments; i++) {
            const angle = (i / numSegments) * Math.PI * 2;

            points.push(x + Math.cos(angle) * radius);
            points.push(y + Math.sin(angle) * radius);
        }
        return points;
    }
}
