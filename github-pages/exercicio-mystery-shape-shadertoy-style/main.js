var shapeValue = 'box';
var coloringValue = 'plainColor';
var offsetValue = 0;
var shadersOptions = {
    vertex: "\n        attribute vec4 position;\n        void main() {\n            gl_Position = position; // Vertex position\n        }\n    ",
    circle: "\n        // Distance from p to a circle of radius 0.7\n        float signedDistance (in vec2 p) {\n            return sdCircle (p, 0.7);\n        }\n    ",
    box: "\n        // Distance from p to a box 1.5 units wide and 1 units high\n        float signedDistance (in vec2 p) {\n            return sdBox(p, vec2(0.75, 0.5));\n        }\n    ",
    boxAndCircle: "\n        // Distance from p to the intersection between a box 1.5 units wide and 1 units high\n        // and a circle of radius 0.7\n        float signedDistance (in vec2 p) {\n            return max(sdBox(p, vec2(0.75, 0.5)), sdCircle(p,0.7));\n        }\n    ",
    boxOrCircle: "\n        // Distance from p to the union between a box 1.5 units wide and 1 units high\n        // and a circle of radius 0.7\n        float signedDistance (in vec2 p) {\n            return min(sdBox(p, vec2(0.75, 0.5)), sdCircle(p,0.7));\n        }\n    ",
    boxMinusCircle: "\n        // Distance from p to the difference between a box 1.5 units wide and 1 units high\n        // and a circle of radius 0.7\n        float signedDistance (in vec2 p) {\n            return max(sdBox(p, vec2(0.75, 0.5)), -sdCircle(p,0.7));\n        }\n    ",
    circleMinusBox: "\n        // Distance from p to the difference between a circle of radius 0.7\n        // and a box 1.5 units wide and 1 units high\n        float signedDistance (in vec2 p) {\n            return max(-sdBox(p, vec2(0.75, 0.5)), sdCircle(p,0.7));\n        }\n    ",
    plainColoring: "\n        // Simple coloring scheme for distance d: white inside\n        // and orange outside\n        vec3 color (in float d) {\n            return vec3(1.0) - sign(d)*vec3(0.1,0.4,0.7);\n        }\n    ",
    mystery: "\n        float roundedLineShape (in vec2 p1, in vec2 p2, in vec2 p3) {\n            float thickness = 0.2;\n            vec2 line = p2 - p1;\n            \n            vec2 proj = normalize(line) * dot(p3, normalize(line));\n\n            float circleP1 = sdCircle(p3 + p1, thickness);\n            float circleP2 = sdCircle(p3 + p2, thickness);\n\n            // Clamp the line to a segment line with Thickness\n            if (length(proj - p1) <= length(line) && length(proj - p2) <= length(line)) {\n                float clampedLineWithThickness = length(p3 - proj) - thickness;\n\n                return clampedLineWithThickness;\n            }\n\n            return min(circleP1, circleP2);\n        }\n\n        float ringShape (in vec2 p) {\n            float outerRadius = 0.7;\n            float innerRadius = 0.6;\n\n            float distToOuter = sdCircle(p, outerRadius);\n            float distToInner = sdCircle(p, innerRadius);\n\n            return max(distToOuter, -distToInner);\n        }\n\n        float signedDistance(in vec2 p) {\n            float segment1 = roundedLineShape(vec2(-0.5, 0.5), vec2(0.5, -0.5), p);\n            float segment2 = roundedLineShape(vec2(0.5, 0.5), vec2(-0.5, -0.5), p);\n            float cross = min(segment1, segment2);\n\n            return max(cross, -ringShape(p));\n        }\n    ",
    iqColoring: "\n        // Inigo Quilez's coloring scheme for a distance function. Draws isolines\n        // and highlights the region close to the border. Nice!\n        vec3 color (in float d) {\n            vec3 col = vec3(1.0) - sign(d)*vec3(0.1,0.4,0.7);\n            col *= 1.0 - exp(-3.0*abs(d));\n            float c = cos(150.0*d);\n            col *= 0.8 + 0.2*c*c*c;\n            col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.01,abs(d)) );\n            return col;\n        }\n    ",
    fragment: function (distanceFunc, colorFunc) {
        return "\n            precision mediump float;\n            uniform vec3 iResolution; // Size of the viewport in pixels\n            uniform float distanceOffset; // Offset value to be added to distance function\n        \n            //\n            // Signed distance from point 'p' to a circle of radius 'r' centered at the origin \n            //\n            float sdCircle( in vec2 p, in float r )   \n            {\n                return length(p)-r;\n            }\n        \n            //\n            // Signed distance from point 'p' to an axes-aligned rectangle centered at the origin and \n            // having width and height equal to b.x/2 and b.y/2, respectively.\n            //\n            float sdBox( in vec2 p, in vec2 b )\n            {\n                vec2 d = abs(p)-b;\n                return length(max(d,0.0)) + min(max(d.x,d.y),0.0);\n            }\n\n            ".concat(distanceFunc, "\n            ").concat(colorFunc, "\n\n            void main() {\n                // Translate coordinates to center of screen and normalize to range [-1..1]\n                vec2 p = (2.0*gl_FragCoord.xy-iResolution.xy)/iResolution.y;\n            \n                // Compute signed distance to the shape and offset it\n                float d = signedDistance(p) + distanceOffset;\n            \n                // Coloring\n                vec3 col = color(d);\n            \n                gl_FragColor = vec4(col,1.0); \n            }\n      ");
    }
};
document.addEventListener("DOMContentLoaded", main);
function main() {
    AttachToInputElements();
    Render();
}
function Render() {
    var canvas = document.getElementById("canvas");
    if (canvas === null) {
        throw new Error("Canvas elements not found");
    }
    var gl = canvas.getContext("webgl");
    if (gl === null) {
        throw new Error("Webgl not supported, try of latest browser");
    }
    var shaderProgram = initShaderProgram(gl, shadersOptions.vertex, shadersOptions.fragment(shadersOptions[shapeValue], shadersOptions[coloringValue]));
    var buffers = initBuffers(gl);
    var programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "position"),
        },
        uniformLocations: {
            resolution: gl.getUniformLocation(shaderProgram, "iResolution"),
            distanceOffset: gl.getUniformLocation(shaderProgram, "distanceOffset")
        }
    };
    drawScene(gl, programInfo, buffers);
}
function AttachToInputElements() {
    var shapeInput = document.getElementById("shape");
    if (shapeInput !== null) {
        shapeValue = shapeInput.value;
        shapeInput.addEventListener("change", function (e) {
            var target = e.target;
            shapeValue = target.value;
            Render();
        });
    }
    var coloringInput = document.getElementById("coloring");
    if (coloringInput !== null) {
        coloringValue = coloringInput.value;
        coloringInput.addEventListener("change", function (e) {
            var target = e.target;
            coloringValue = target.value;
            Render();
        });
    }
    var offsetInput = document.getElementById("offset");
    if (offsetInput !== null) {
        offsetValue = Number(offsetInput.value);
        offsetInput.addEventListener("input", function (e) {
            var target = e.target;
            offsetValue = Number(target.value);
            var label = target.nextElementSibling;
            if (label !== null) {
                label.textContent = String(offsetValue);
            }
            Render();
        });
    }
}
function initShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    var success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (success === false) {
        throw new Error("Unable to initialize the shader program: ".concat(gl.getProgramInfoLog(shaderProgram)));
    }
    return shaderProgram;
}
function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success === false) {
        // gl.deleteShader(shader);
        throw new Error("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
    }
    return shader;
}
function initBuffers(gl) {
    var positionBuffer = initPositionBuffer(gl);
    // const colorBuffer = initColorBuffer(gl);
    return {
        position: positionBuffer,
        // color: colorBuffer,
    };
}
function initPositionBuffer(gl) {
    // Create a buffer for the square's positions.
    var positionBuffer = gl.createBuffer();
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    //Two triangles covering the whole viewport
    var positions = [
        -1, 1, -1, -1, 1, 1,
        1, 1, -1, -1, 1, -1
    ];
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;
}
function initColorBuffer(gl) {
    var colors = [
        1.0,
        1.0,
        1.0,
        1.0, // white
        1.0,
        0.0,
        0.0,
        1.0, // red
        0.0,
        1.0,
        0.0,
        1.0, // green
        0.0,
        0.0,
        1.0,
        1.0, // blue
    ];
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    return colorBuffer;
}
function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Opaque black
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(programInfo.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.uniform3fv(programInfo.uniformLocations.resolution, [gl.canvas.width, gl.canvas.height, 1]);
    gl.uniform1f(programInfo.uniformLocations.distanceOffset, offsetValue);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
