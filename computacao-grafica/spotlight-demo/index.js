document.addEventListener('alpine:init', () => {
    Alpine.data('App', Main)
})

function Main()
{
    return {
        selectedTab: 0,
        light: {
            dir: [1, 1, 1],
            color: '#000000'
        },
        object: {
            mesh: 'bunny',
            position: [1, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: '#000000',
            emission: 0,
            ambient: 0,
            diffuse: 0,
            specular: 0,
            shininess: 0
        },
        
        init() {
            const regl = createREGL(this.$refs.canvas);

            regl.frame(({ time }) => {
                // First clear the frame buffer
                regl.clear({
                    color: [0.8, 0.8, 1.0, 1],
                    depth: 1
                })

                // console.dir(this.matrixModel)
                /* drawBox({                    
                    modelview: glMatrix.mat4.mul([], this.matrixView, this.matrixModel),
                    projection: this.matrixProjection,
                }); */
            })
        }
    }
}
