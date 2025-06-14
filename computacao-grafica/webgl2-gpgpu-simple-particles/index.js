const dstWidth = 3;
const dstHeight = 2;

window.document.addEventListener('DOMContentLoaded', () => {
    main()
})

function main() {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }

    const updatePositionProgram = CreateProgramFromSources(gl, ['compute-shader-vs', 'compute-shader-fs'], ['newPosition']);
    const drawParticlesProgram = CreateProgramFromSources(gl, ['draw-particles-vs', 'draw-particles-fs']);

    const updatePositionPrgLocs = {
        oldPosition: gl.getAttribLocation(updatePositionProgram, 'oldPosition'),
        velocity: gl.getAttribLocation(updatePositionProgram, 'velocity'),
        canvasDimensions: gl.getUniformLocation(updatePositionProgram, 'canvasDimensions'),
        deltaTime: gl.getUniformLocation(updatePositionProgram, 'deltaTime'),
    };

    const drawParticlesProgLocs = {
        position: gl.getAttribLocation(drawParticlesProgram, 'position'),
        matrix: gl.getUniformLocation(drawParticlesProgram, 'matrix'),
    };

    // create random positions and velocities.
    const rand = (min, max) => {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.random() * (max - min) + min;
    };
    const numParticles = 200;
    const createPoints = (num, ranges) =>
        new Array(num).fill(0).map(_ => ranges.map(range => rand(...range))).flat();
    const positions = new Float32Array(createPoints(numParticles, [[canvas.width], [canvas.height]]));
    const velocities = new Float32Array(createPoints(numParticles, [[-300, 300], [-300, 300]]));

    function makeBuffer(gl, sizeOrData, usage) {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
        return buf;
    }

    const position1Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
    const position2Buffer = makeBuffer(gl, positions, gl.DYNAMIC_DRAW);
    const velocityBuffer = makeBuffer(gl, velocities, gl.STATIC_DRAW);

    function makeVertexArray(gl, bufLocPairs) {
        const va = gl.createVertexArray();
        gl.bindVertexArray(va);
        for (const [buffer, loc] of bufLocPairs) {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(
                loc,      // attribute location
                2,        // number of elements
                gl.FLOAT, // type of data
                false,    // normalize
                0,        // stride (0 = auto)
                0,        // offset
            );
        }
        return va;
    }

    const updatePositionVA1 = makeVertexArray(gl, [
        [position1Buffer, updatePositionPrgLocs.oldPosition],
        [velocityBuffer, updatePositionPrgLocs.velocity],
    ]);
    const updatePositionVA2 = makeVertexArray(gl, [
        [position2Buffer, updatePositionPrgLocs.oldPosition],
        [velocityBuffer, updatePositionPrgLocs.velocity],
    ]);

    const drawVA1 = makeVertexArray(
        gl, [[position1Buffer, drawParticlesProgLocs.position]]);
    const drawVA2 = makeVertexArray(
        gl, [[position2Buffer, drawParticlesProgLocs.position]]);

    function makeTransformFeedback(gl, buffer) {
        const tf = gl.createTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);
        return tf;
    }

    const tf1 = makeTransformFeedback(gl, position1Buffer);
    const tf2 = makeTransformFeedback(gl, position2Buffer);

    // unbind left over stuff
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);

    let current = {
        updateVA: updatePositionVA1,  // read from position1
        tf: tf2,                      // write to position2
        drawVA: drawVA2,              // draw with position2
    };
    let next = {
        updateVA: updatePositionVA2,  // read from position2
        tf: tf1,                      // write to position1
        drawVA: drawVA1,              // draw with position1
    };

    let then = 0;
    function render(time) {
        // convert to seconds
        time *= 0.001;
        // Subtract the previous time from the current time
        const deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;

        gl.clear(gl.COLOR_BUFFER_BIT);

        // compute the new positions
        gl.useProgram(updatePositionProgram);
        gl.bindVertexArray(current.updateVA);
        gl.uniform2f(updatePositionPrgLocs.canvasDimensions, gl.canvas.width, gl.canvas.height);
        gl.uniform1f(updatePositionPrgLocs.deltaTime, deltaTime);

        gl.enable(gl.RASTERIZER_DISCARD);

        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, current.tf);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, numParticles);
        gl.endTransformFeedback();
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

        // turn on using fragment shaders again
        gl.disable(gl.RASTERIZER_DISCARD);

        // now draw the particles.
        gl.useProgram(drawParticlesProgram);
        gl.bindVertexArray(current.drawVA);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniformMatrix4fv(
            drawParticlesProgLocs.matrix,
            false,
            m4.orthographic(0, gl.canvas.width, 0, gl.canvas.height, -1, 1));
        gl.drawArrays(gl.POINTS, 0, numParticles);

        // swap which buffer we will read from
        // and which one we will write to
        {
            const temp = current;
            current = next;
            next = temp;
        }

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string[]} shaderIds
 * @param {string[] | undefined} transformFeedbackVaryings
 * @returns {WebGLProgram}
 */
function CreateProgramFromSources(gl, shaderIds, transformFeedbackVaryings) {
    const vertexShader = CreateShaderFromScript(gl, shaderIds[0])
    const fragmentShader = CreateShaderFromScript(gl, shaderIds[1])
    return CreateProgram(gl, vertexShader, fragmentShader, transformFeedbackVaryings)
}


/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} scriptId 
 * @returns {WebGLShader}
 */
function CreateShaderFromScript(gl, scriptId) {
    const shaderScript = document.getElementById(scriptId)
    if (shaderScript === null) {
        throw (`Unknown script element: ${scriptId}`)
    }

    const shaderSource = shaderScript.text

    if (shaderScript.type === 'x-shader/x-vertex') {
        return CompileShader(gl, shaderSource, gl.VERTEX_SHADER)
    }

    return CompileShader(gl, shaderSource, gl.FRAGMENT_SHADER)
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string} scriptId 
 * @returns {WebGLShader}
 */
function CompileShader(gl, source, type) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
        throw ("Shader compilation failed: " + gl.getShaderInfoLog(shader))
    }

    return shader
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLShader} vertexShader 
 * @param {WebGLShader} fragmentShader 
 * @param {string[] | undefined} transformFeedbackVaryings
 * @returns {WebGLProgram}
 */
function CreateProgram(gl, vertexShader, fragmentShader, transformFeedbackVaryings) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    if (transformFeedbackVaryings !== undefined) {
        gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS)
    }

    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
        throw ("Program failed to link: " + gl.getProgramInfoLog(program))
    }

    return program
}
