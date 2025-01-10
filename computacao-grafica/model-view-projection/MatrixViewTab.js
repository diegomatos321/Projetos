export default () => ({
    projection: 'perspective',
    eye: [0, 0, 5],
    center: [0, 0, 0],
    up: [0, 1, 0],
    latex: '',

    init() {
        this.UpdateMatrix()
    },

    UpdateMatrix() {
        // Attribute from parent Component
        this.matrixView = glMatrix.mat4.lookAt([], this.eye, this.center, this.up)
        this.toLatex()
    },

    Reset() {
        this.eye = [0, 0, 5]
        this.center = [0, 0, 0]
        this.up = [0, 1, 0]
        this.UpdateMatrix()
    },

    toLatex() {
        // matrixToLatex's Method from parent Component
        const result = this.matrixToLatex(this.matrixView)
        this.latex = `$$ ${result} $$`
        this.$nextTick(() => MathJax.typeset())
    },
})