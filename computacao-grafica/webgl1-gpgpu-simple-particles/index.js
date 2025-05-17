const dstWidth = 3;
const dstHeight = 2;

window.document.addEventListener('DOMContentLoaded', () => {
    main()
})

async function main() {
    // make a 3x2 canvas for 6 results
    const canvas = document.createElement('canvas');
    canvas.width = dstWidth;
    canvas.height = dstHeight;

    const gl = canvas.getContext('webgl');
    if (!gl) {
        throw new Error('WebGL not supported');
    }

    // check we can use floating point textures
    const ext1 = gl.getExtension('OES_texture_float');
    if (!ext1) {
        alert('Need OES_texture_float');
        return;
    }
    // check we can render to floating point textures
    const ext2 = gl.getExtension('WEBGL_color_buffer_float');
    if (!ext2) {
        alert('Need WEBGL_color_buffer_float');
        return;
    }
    // check we can use textures in a vertex shader
    if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 1) {
        alert('Can not use textures in vertex shaders');
        return;
    }

    const program = await CreateProgramFromScript(gl, ['vertex-shader-2d', 'fragment-shader-2d'])
    const positionLoc = gl.getAttribLocation(program, 'position');
    const srcTexLoc = gl.getUniformLocation(program, 'srcTex');
    const srcDimensionsLoc = gl.getUniformLocation(program, 'srcDimensions');

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
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); // see https://webglfundamentals.org/webgl/lessons/webgl-data-textures.html
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,                // mip level
        gl.LUMINANCE,     // internal format
        srcWidth,
        srcHeight,
        0,                // border
        gl.LUMINANCE,     // format
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
    gl.uniform2f(srcDimensionsLoc, srcWidth, srcHeight);

    gl.drawArrays(gl.TRIANGLES, 0, 6);  // draw 2 triangles (6 vertices)

    // get the result
    const results = new Uint8Array(dstWidth * dstHeight * 4);
    gl.readPixels(0, 0, dstWidth, dstHeight, gl.RGBA, gl.UNSIGNED_BYTE, results);

    // print the results
    for (let i = 0; i < dstWidth * dstHeight; ++i) {
        console.log(results[i * 4]);
    }
}

function CreateProgramFromScript(gl, shaderIds) {
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
