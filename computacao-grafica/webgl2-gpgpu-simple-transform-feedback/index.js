const dstWidth = 3;
const dstHeight = 2;

window.document.addEventListener('DOMContentLoaded', () => {
    main()
})

function main() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');

    // const program = CreateProgramFromSources(gl, ['vertex-shader-2d', 'fragment-shader-2d']);
    const vertexShader = CreateShaderFromScript(gl, 'vertex-shader-2d')
    const fragmentShader = CreateShaderFromScript(gl, 'fragment-shader-2d')

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.transformFeedbackVaryings(
        program,
        ['sum', 'difference', 'product'],
        gl.SEPARATE_ATTRIBS,
    );
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramParameter(program));
    }

    const aLoc = gl.getAttribLocation(program, 'a');
    const bLoc = gl.getAttribLocation(program, 'b');
    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    function makeBuffer(gl, sizeOrData) {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, gl.STATIC_DRAW);
        return buf;
    }

    function makeBufferAndSetAttribute(gl, data, loc) {
        const buf = makeBuffer(gl, data);
        // setup our attributes to tell WebGL how to pull
        // the data from the buffer above to the attribute
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(
            loc,
            1,         // size (num components)
            gl.FLOAT,  // type of data in buffer
            false,     // normalize
            0,         // stride (0 = auto)
            0,         // offset
        );
    }

    const a = [1, 2, 3, 4, 5, 6];
    const b = [3, 6, 9, 12, 15, 18];

    // put data in buffers
    const aBuffer = makeBufferAndSetAttribute(gl, new Float32Array(a), aLoc);
    const bBuffer = makeBufferAndSetAttribute(gl, new Float32Array(b), bLoc);

    // Create and fill out a transform feedback
    const tf = gl.createTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);

    // make buffers for output
    const sumBuffer = makeBuffer(gl, a.length * 4);
    const differenceBuffer = makeBuffer(gl, a.length * 4);
    const productBuffer = makeBuffer(gl, a.length * 4);

    // bind the buffers to the transform feedback
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, sumBuffer);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 1, differenceBuffer);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 2, productBuffer);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // buffer's we are writing to can not be bound else where
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  // productBuffer was still bound to ARRAY_BUFFER so unbind it

    // above this line is setup
    // ---------------------------------
    // below this line is "render" time

    gl.useProgram(program);

    // bind our input attribute state for the a and b buffers
    gl.bindVertexArray(vao);

    // no need to call the fragment shader
    gl.enable(gl.RASTERIZER_DISCARD);

    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, tf);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, a.length);
    gl.endTransformFeedback();
    gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);

    // turn on using fragment shaders again
    gl.disable(gl.RASTERIZER_DISCARD);

    log(`a: ${a}`);
    log(`b: ${b}`);

    printResults(gl, sumBuffer, 'sums');
    printResults(gl, differenceBuffer, 'differences');
    printResults(gl, productBuffer, 'products');

    function printResults(gl, buffer, label) {
        const results = new Float32Array(a.length);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.getBufferSubData(
            gl.ARRAY_BUFFER,
            0,    // byte offset into GPU buffer,
            results,
        );
        // print the results
        log(`${label}: ${results}`);
    }

    function log(...args) {
        const elem = document.createElement('pre');
        elem.textContent = args.join(' ');
        document.body.appendChild(elem);
    }
}

function CreateProgramFromSources(gl, shaderIds) {
    const vertexShader = CreateShaderFromScript(gl, shaderIds[0])
    const fragmentShader = CreateShaderFromScript(gl, shaderIds[1])
    return CreateProgram(gl, vertexShader, fragmentShader)
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
 * @returns {WebGLProgram}
 */
function CreateProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
        throw ("Program failed to link: " + gl.getProgramInfoLog(program))
    }

    return program
}
