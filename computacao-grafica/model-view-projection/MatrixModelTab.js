export default () => ({
    orderedTransformations: [],
    deg: Math.PI / 180,
    latex: ``,

    init() {
        this.toLatex()
    },

    OnAddTranslate() {
        const translationMatrix = {
            type: 'translation',
            data: [0, 0, 0]
        }
        this.orderedTransformations.push(translationMatrix)
        this.toLatex()
    },

    OnAddScale() {
        const scalingMatrix = {
            type: 'scaling',
            data: [1, 1, 1]
        }
        this.orderedTransformations.push(scalingMatrix)
        this.toLatex()
    },

    OnAddRotate() {
        const rotationMatrix = {
            type: 'rotation',
            data: [0, 0, 0]
        }
        this.orderedTransformations.push(rotationMatrix)
        this.toLatex()
    },

    UpdateMatrix() {
        this.matrixModel = this.orderedTransformations.reduce((a, b) => {
            let result = glMatrix.mat4.create()
            switch (b.type) {
                case 'translation':
                    const translationMatrix = glMatrix.mat4.fromTranslation([], b.data)
                    result = glMatrix.mat4.mul([], a, translationMatrix)
                    break;

                case 'scaling':
                    const scalingMatrix = glMatrix.mat4.fromScaling([], b.data)
                    result = glMatrix.mat4.mul([], a, scalingMatrix)
                    break;

                case 'rotation':
                    let rotation = glMatrix.mat4.fromZRotation([], b.data[2] * this.deg)
                    rotation = glMatrix.mat4.rotateY([], rotation, b.data[1] * this.deg)
                    rotation = glMatrix.mat4.rotateX([], rotation, b.data[0] * this.deg)
                    result = glMatrix.mat4.mul([], a, rotation)
                    break;

                default:
                    break;
            }

            return result
        }, glMatrix.mat4.create())

        this.toLatex()
    },

    matrixToLatex(m) {
        let fmt = (x) => x.toFixed(4) == x ? x : x.toFixed(4);

        return `
        \\begin{bmatrix}
            ${fmt(m[0])} & ${fmt(m[4])} & ${fmt(m[8])}& ${fmt(m[12])} \\\\
            ${fmt(m[1])} & ${fmt(m[5])} & ${fmt(m[9])}& ${fmt(m[13])} \\\\
            ${fmt(m[2])} & ${fmt(m[6])} & ${fmt(m[10])}& ${fmt(m[14])} \\\\
            ${fmt(m[3])} & ${fmt(m[7])} & ${fmt(m[11])}& ${fmt(m[15])} 
        \\end{bmatrix}
        `
    },

    toLatex() {
        if (this.orderedTransformations.length < 2) {
            const result = this.matrixToLatex(this.matrixModel)
            this.latex = `$$ ${result} $$`
            this.$nextTick(() => MathJax.typeset())
            return
        }

        const result = this.orderedTransformations
            .map((transformation) => {
                switch (transformation.type) {
                    case 'translation':
                        return this.matrixToLatex(glMatrix.mat4.fromTranslation([], transformation.data))
                        break;
                    case 'scaling':
                        return this.matrixToLatex(glMatrix.mat4.fromScaling([], transformation.data))
                        break;
                    case 'rotation':
                        let rotation = glMatrix.mat4.fromZRotation([], transformation.data[2] * this.deg)
                        rotation = glMatrix.mat4.rotateY([], rotation, transformation.data[1] * this.deg)
                        rotation = glMatrix.mat4.rotateX([], rotation, transformation.data[0] * this.deg)
                        
                        return this.matrixToLatex(rotation)
                        break;
                    default:
                        break;
                }
            })
            .join("\\times")
            + "=" +
            this.matrixToLatex(this.matrixModel)

        this.latex = `$$ ${result} $$`
        this.$nextTick(() => MathJax.typeset())
    }
})