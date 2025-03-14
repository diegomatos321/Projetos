document.addEventListener('DOMContentLoaded', () => {
    new NCirclesProblem()
})

class NCirclesProblem {
    ncircles = 1;
    canvas;

    constructor() {
        const ncirclesInput = document.getElementById("ncircles_input")
        this.ncircles = Number(ncirclesInput.value)
        ncirclesInput.addEventListener('input', (event) => {
            this.ncircles = Number(event.target.value)
            this.Solve()
        })

        this.canvas = document.getElementById('canvas')
        this.Solve()
    }

    Solve() {
        const ctx = this.canvas.getContext("2d")

        let foundBest = false, stateControl = 0, nCols = 1, nRows = 1
        while (foundBest === false) {
            if (nRows * nCols < this.ncircles) {
                // Alterno entre coluna ou linha
                if (stateControl % 2 === 0) {
                    nCols++
                } else {
                    nRows++
                }

                stateControl++
            } else {
                foundBest = true
            }
        }

        let squareSide = Math.min(this.canvas.width / nCols, this.canvas.height / nRows)

        // My solution is identical to the code below...
        // let perRow = Math.floor(this.canvas.width / squareSide)
        let circleRadius = squareSide / 4;
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "gray";
        
        for (let i = 0; i < this.ncircles; i++) {
            let row = Math.floor(i / nCols);
            let col = i % nCols;
            
            let x = circleRadius * 2 + circleRadius * 4 * col;
            let y = circleRadius * 2 + circleRadius * 4 * row;
            
            ctx.beginPath();
            ctx.arc(x, y, circleRadius, 0, Math.PI * 2)
            ctx.fill()
            ctx.beginPath();
            
            ctx.moveTo(x - squareSide / 2, y - squareSide / 2);
            ctx.lineTo(x - squareSide / 2, y + squareSide / 2);
            ctx.lineTo(x + squareSide / 2, y + squareSide / 2);
            ctx.lineTo(x + squareSide / 2, y - squareSide / 2);
            ctx.closePath();
            ctx.stroke()
        }
    }
}