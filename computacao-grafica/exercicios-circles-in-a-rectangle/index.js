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
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height)

        let ratio = this.canvas.width / this.canvas.height
        let perCols = Math.sqrt(ratio * this.ncircles)
        let perRow = perCols / ratio
        let squareSide = Math.min(this.canvas.width / perCols, this.canvas.height / perRow)

        perCols = Math.ceil(perCols)
        perRow = Math.ceil(perRow)

        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'gray';

        for (let index = 0; index < this.ncircles; index++) {
            let row = Math.floor(index/perRow)
            let col = index % perCols;
            let x = col * squareSide + squareSide /2
            let y = row * squareSide + squareSide / 2

            // Circulo
            ctx.beginPath();
            ctx.arc(x,y, squareSide / 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()

            // Contorno da área do quadrado
            ctx.beginPath ();
            ctx.moveTo(x-squareSide/2,y-squareSide/2);
            ctx.lineTo(x-squareSide/2,y+squareSide/2);
            ctx.lineTo(x+squareSide/2,y+squareSide/2);
            ctx.lineTo(x+squareSide/2,y-squareSide/2);
            ctx.closePath();
            ctx.stroke()
        }
    }
}