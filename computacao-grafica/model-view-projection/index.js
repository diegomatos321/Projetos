import MatrixProjectionTab from './MatrixProjectionTab.js'
import MatrixModelTab from './MatrixModelTab.js'
import MatrixViewTab from './MatrixViewTab.js'
import geometries from './geometries.js'

document.addEventListener('alpine:init', () => {
    Alpine.data('MatrixProjectionTab', MatrixProjectionTab)
    Alpine.data('MatrixModelTab', MatrixModelTab)
    Alpine.data('MatrixViewTab', MatrixViewTab)
    Alpine.data('InteractApp', Main)
})

function Main() {
    return {
        // Overwritten by child component MatrixModelTab
        matrixModel: glMatrix.mat4.create(),

        selectedTab: 1,

        init() {           
            const regl = createREGL(this.$refs.canvas);
            const box = geometries.boxGeometry();

            const drawBox = regl({
                frag: `
                    precision mediump float;
                    uniform vec4 color;
                    varying vec3 vertex_normal;
                    uniform vec3 light_dir;
                    
                    void main () {
                        gl_FragColor = vec4(clamp(color.xyz*dot(vertex_normal,light_dir),0.0,1.0),1.0);
                        //gl_FragColor = vec4(vec3(gl_FragCoord.z),1.0);
                    }
                `,
                vert: `
                    attribute vec3 position;
                    attribute vec3 normal;
                    varying vec3 vertex_normal;
                    uniform mat4 modelview;
                    uniform mat4 projection;
                    
                    void main () {
                        vec4 worldpos = modelview*vec4(position, 1.0);
                        gl_Position = projection*worldpos;
                        vertex_normal = (modelview*vec4(normal,0.0)).xyz;
                    }
                `,
                attributes: {
                    position: box.positions,
                    normal: box.normals
                },

                uniforms: {
                    color: [1, 1, 1, 1],
                    light_dir: glMatrix.vec3.normalize([], glMatrix.vec3.set([], 1, 1, 1)),
                    modelview: regl.prop('modelview'),
                    projection: regl.prop('projection')
                },

                // The depth buffer
                depth: {
                    enable: true,
                    func: '<',
                    mask: true,
                },

                count: box.positions.length / 3
            })

            regl.frame(({ time }) => {
                // First clear the frame buffer
                regl.clear({
                    color: [0.8, 0.8, 1.0, 1],
                    depth: 1
                })

                // console.dir(this.matrixModel)
                drawBox({                    
                    modelview: glMatrix.mat4.mul([], glMatrix.mat4.create(), this.matrixModel),
                    projection: glMatrix.mat4.create(),
                });
            })
        }

    }
}
