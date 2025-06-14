const kernels = {
    normal: [
        0, 0, 0,
        0, 1, 0,
        0, 0, 0
    ],
    gaussianBlur: [
        0.045, 0.122, 0.045,
        0.122, 0.332, 0.122,
        0.045, 0.122, 0.045
    ],
    gaussianBlur2: [
        1, 2, 1,
        2, 4, 2,
        1, 2, 1
    ],
    gaussianBlur3: [
        0, 1, 0,
        1, 1, 1,
        0, 1, 0
    ],
    unsharpen: [
        -1, -1, -1,
        -1, 9, -1,
        -1, -1, -1
    ],
    sharpness: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ],
    sharpen: [
        -1, -1, -1,
        -1, 16, -1,
        -1, -1, -1
    ],
    edgeDetect: [
        -0.125, -0.125, -0.125,
        -0.125, 1, -0.125,
        -0.125, -0.125, -0.125
    ],
    edgeDetect2: [
        -1, -1, -1,
        -1, 8, -1,
        -1, -1, -1
    ],
    edgeDetect3: [
        -5, 0, 0,
        0, 0, 0,
        0, 0, 5
    ],
    edgeDetect4: [
        -1, -1, -1,
        0, 0, 0,
        1, 1, 1
    ],
    edgeDetect5: [
        -1, -1, -1,
        2, 2, 2,
        -1, -1, -1
    ],
    edgeDetect6: [
        -5, -5, -5,
        -5, 39, -5,
        -5, -5, -5
    ],
    sobelHorizontal: [
        1, 2, 1,
        0, 0, 0,
        -1, -2, -1
    ],
    sobelVertical: [
        1, 0, -1,
        2, 0, -2,
        1, 0, -1
    ],
    previtHorizontal: [
        1, 1, 1,
        0, 0, 0,
        -1, -1, -1
    ],
    previtVertical: [
        1, 0, -1,
        1, 0, -1,
        1, 0, -1
    ],
    boxBlur: [
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111,
        0.111, 0.111, 0.111
    ],
    triangleBlur: [
        0.0625, 0.125, 0.0625,
        0.125, 0.25, 0.125,
        0.0625, 0.125, 0.0625
    ],
    emboss: [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ]
};
// List of effects to apply.
let effectsToApply = [];

window.addEventListener('DOMContentLoaded', () => {
    main()
})

async function main() {
    const sortableList = document.getElementById('sortable-list');
    for (const kernel in kernels) {
        const wrapper = document.createElement('div')

        const icon = document.createElement('span')
        icon.style.width = '24px'
        icon.style.height = '24px'
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="white"></rect> <circle cx="9.5" cy="6" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="9.5" cy="10" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="9.5" cy="14" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="9.5" cy="18" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="14.5" cy="6" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="14.5" cy="10" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="14.5" cy="14" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> <circle cx="14.5" cy="18" r="0.5" stroke="#000000" stroke-linecap="round" stroke-linejoin="round"></circle> </g></svg>'
        wrapper.append(icon)
        
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.addEventListener('change', OnSortableChange)
        wrapper.appendChild(checkbox)
        
        const text = document.createElement('p')
        text.textContent = kernel
        wrapper.appendChild(text)

        wrapper.className = 'sortable-item flex gap-2 text-sm'
        sortableList.appendChild(wrapper)
    }

    new Sortable(sortableList, {
        animation: 150,

        // Event triggered after sorting
        onEnd: OnSortableChange
    });

    function OnSortableChange() {
        const items = sortableList.querySelectorAll('.sortable-item');
        const checked = Array.from(items).filter(item => {
            const checkbox = item.querySelector('input[type=checkbox]')
            return checkbox.checked
        });
        effectsToApply = Array.from(checked).map(item => item.textContent.trim())
        console.dir(effectsToApply)
        draw()
    }

    const image = await LoadImage('leaves.jpg')

    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas')
    const gl = canvas.getContext('webgl')
    if (gl === null) {
        throw ("Webgl not supported")
    }

    const program = await CreateProgramFromScript(gl, ['vertex-shader-2d', 'fragment-shader-2d'])

    const positionLocation = gl.getAttribLocation(program, 'a_position')
    const texcoordLocation = gl.getAttribLocation(program, 'a_texCoord')
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
    const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize')
    const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
    const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
    const flipYLocation = gl.getUniformLocation(program, "u_flipY");

    // Rectangle
    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        image.width, 0,
        0, image.height,
        0, image.height,
        image.width, 0,
        image.width, image.height
    ]), gl.STATIC_DRAW)

    const texcoordBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]), gl.STATIC_DRAW)

    // Create a texture and put the image in it.
    const originalImageTexture = CreateAndSetupTexture(gl);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // create 2 textures and attach them to framebuffers.
    const textures = [];
    const framebuffers = [];
    for (let ii = 0; ii < 2; ++ii) {
        var texture = CreateAndSetupTexture(gl);
        textures.push(texture);

        // make the texture the same size as the image
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0,
            gl.RGBA, gl.UNSIGNED_BYTE, null);

        // Create a framebuffer
        let fbo = gl.createFramebuffer();
        framebuffers.push(fbo);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // Attach a texture to it.
        gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    }

    draw()

    function draw() {
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.useProgram(program)

        // Turn on the position attribute
        gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

        // Turn on the texcoord attribute
        gl.enableVertexAttribArray(texcoordLocation);

        // bind the texcoord buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

        // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

        gl.uniform2f(textureSizeLocation, image.width, image.height);

        // start with the original image
        gl.bindTexture(gl.TEXTURE_2D, originalImageTexture);

        // don't y flip images while drawing to the textures
        gl.uniform1f(flipYLocation, 1);

        // loop through each effect we want to apply.
        var count = 0;
        for (const effect of effectsToApply) {
            // Setup to draw into one of the framebuffers.
            setFramebuffer(framebuffers[count % 2], image.width, image.height);

            drawWithKernel(effect);

            // for the next draw, use the texture we just rendered to.
            gl.bindTexture(gl.TEXTURE_2D, textures[count % 2]);

            // increment count so we use the other texture next time.
            ++count;
        }

        // finally draw the result to the canvas.
        gl.uniform1f(flipYLocation, -1);  // need to y flip for canvas
        setFramebuffer(null, gl.canvas.width, gl.canvas.height);
        drawWithKernel("normal");

        // gl.uniform1fv(kernelLocation, kernels[initialSelection]);
        // gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[initialSelection]));

        // // Draw the rectangle.
        // var primitiveType = gl.TRIANGLES;
        // var offset = 0;
        // var count = 6;
        // gl.drawArrays(primitiveType, offset, count);
    }

    function drawWithKernel(name) {
        // set the kernel and it's weight
        gl.uniform1fv(kernelLocation, kernels[name]);
        gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels[name]));

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    function setFramebuffer(fbo, width, height) {
        // make this the framebuffer we are rendering to.
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

        // Tell the shader the resolution of the framebuffer.
        gl.uniform2f(resolutionLocation, width, height);

        // Tell webgl the viewport setting needed for framebuffer.
        gl.viewport(0, 0, width, height);
    }
}

/**
 * 
 * @param {string} imgSrc 
 * @returns {Promise<Image>}
 */
async function LoadImage(imgSrc) {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imgSrc
        image.addEventListener('load', () => resolve(image))
    })
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {string[]} shaderIds 
 * @returns {WebGLProgram}
 */
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

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @returns {WebGLTexture}
 */
function CreateAndSetupTexture(gl) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set up texture so we can render any size image and so we are
    // working with pixels.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}

function computeKernelWeight(kernel) {
    const weight = kernel.reduce(function (prev, curr) {
        return prev + curr;
    });
    return weight <= 0 ? 1 : weight;
}
