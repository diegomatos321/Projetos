export default () => ({
    projection: 'perspective',
    
    // Perspective attributes
    fovy: 40,
    aspect: 1,
    near: 0.1,
    far: 10,

    // Ortho attributes
    left: -1,
    right: 1,
    bottom: -1,
    top: 1,
    nearOrtho: 0.1,
    farOrtho: 10,

    latex: '',

    init() {
        this.UpdateMatrix()
    },

    UpdateMatrix() {
        if (this.projection === 'perspective') {
            // Attribute from parent Component
            this.matrixProjection = glMatrix.mat4.perspective([], this.fovy * Math.PI / 180, this.aspect, this.near, this.far)
            this.toLatex()
        } else if (this.projection === 'ortho') {
            // Attribute from parent Component
            this.matrixProjection = glMatrix.mat4.ortho([], this.left, this.right, this.bottom, this.top, this.nearOrtho, this.farOrtho)
            this.toLatex()
        }
    },

    toLatex() {
        // matrixToLatex's Method from parent Component
        const result = this.matrixToLatex(this.matrixProjection)
        this.latex = `$$ ${result} $$`
        this.$nextTick(() => MathJax.typeset())
    },
    
    Reset(){
        this.fovy = 40
        this.aspect = 1
        this.near = 0.1
        this.far = 10
        this.UpdateMatrix()
    }
})