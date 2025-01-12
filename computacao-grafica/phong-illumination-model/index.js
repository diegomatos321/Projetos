document.addEventListener('alpine:init', () => {
    Alpine.data('App', Main)
})

function Main()
{
    console.log('Foi')
    return {
        selectedTab: 0,
        lightDir: [1, 1, 1],

        init() {
            const regl = createREGL(this.$refs.canvas);

            regl.frame(({ time }) => {
                // First clear the frame buffer
                regl.clear({
                    color: [0.8, 0.8, 1.0, 1],
                    depth: 1
                })

                // console.dir(this.matrixModel)
                drawBox({                    
                    modelview: glMatrix.mat4.mul([], this.matrixView, this.matrixModel),
                    projection: this.matrixProjection,
                });
            })
        }
    }
}
