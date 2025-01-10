export default () => ({
    projection: 'perspective',
    fovy: 40,
    aspect: 1,
    near: 0.1,
    far: 10,
    latex: '',

    init() {
        this.UpdateMatrix()
    },

    UpdateMatrix() {
        // Attribute from parent Component
        this.matrixProjection = glMatrix.mat4.perspective([], this.fovy * Math.PI / 180, this.aspect, this.near, this.far)
        this.toLatex()
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