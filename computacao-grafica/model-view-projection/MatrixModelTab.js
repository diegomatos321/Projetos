export default () => ({
    orderedTransformations: [],

    OnAddTranslate() 
    {
        const translationMatrix = {
            type: 'translation',
            data: [0,0,0]
        }
        this.orderedTransformations.push(translationMatrix)
    },

    OnAddScale() 
    {
        const scalingMatrix = {
            type: 'scaling',
            data: [1,1,1]
        }
        this.orderedTransformations.push(scalingMatrix)
    },
    
    ComputeNewTranslation(i, j, value)
    {
        this.orderedTransformations[i].data[j] = value
        this.matrixModel = this.orderedTransformations.reduce(this.HandleMatricesTransformations, glMatrix.mat4.create())
    },

    ComputeNewScale(i, j, value)
    {
        this.orderedTransformations[i].data[j] = value
        this.matrixModel = this.orderedTransformations.reduce(this.HandleMatricesTransformations, glMatrix.mat4.create())
    },

    HandleMatricesTransformations(a, b) {
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
                default:
                    break;
            }

            return result
    }
})