const dstWidth = 3;
const dstHeight = 2;

window.document.addEventListener('DOMContentLoaded', () => {
    main()
})

function main() {
    const dstWidth = 3;
    const dstHeight = 2;

    // make a 3x2 canvas for 6 results
    const canvas = document.createElement('canvas');
    canvas.width = dstWidth;
    canvas.height = dstHeight;

    const gl = canvas.getContext('webgl2');

    const program = CreateProgramFromSources(gl, ['vertex-shader-2d', 'fragment-shader-2d']);
    const positionLoc = gl.getAttribLocation(program, 'position');
    const srcTexLoc = gl.getUniformLocation(program, 'srcTex');

    // setup a full canvas clip space quad
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ]), gl.STATIC_DRAW);

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // setup our attributes to tell WebGL how to pull
    // the data from the buffer above to the position attribute
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(
        positionLoc,
        2,         // size (num components)
        gl.FLOAT,  // type of data in buffer
        false,     // normalize
        0,         // stride (0 = auto)
        0,         // offset
    );

    // create our source texture
    const srcWidth = 3;
    const srcHeight = 2;
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); // see https://webgl2fundamentals.org/webgl/lessons/webgl-data-textures.html
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                // mip level
        gl.R8,            // internal format
        srcWidth,
        srcHeight,
        0,                // border
        gl.RED,           // format
        gl.UNSIGNED_BYTE, // type
        new Uint8Array([
            1, 2, 3,
            4, 5, 6,
        ]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.useProgram(program);
    gl.uniform1i(srcTexLoc, 0);  // tell the shader the src texture is on texture unit 0

    gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)

    // get the result
    const results = new Uint8Array(dstWidth * dstHeight * 4);
    gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);

    // print the results
    for (let i = 0; i < dstWidth * dstHeight; ++i) {
        log(results[i * 4]);
    }

    function log(...args) {
        const elem = document.createElement('pre');
        elem.textContent = args.join(' ');
        document.getElementById('main').appendChild(elem);
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
