import { defineComponent } from './utils';
import * as THREE from 'three';

export default defineComponent((startPoints: THREE.Vector3[], axis = ['x', 'y']) => ({
    canvas: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,
    gridSize: 40,
    points: startPoints,

    axis,
    center: {x: 0, y: 0, z: 0},

    isDragging: false,
    dragIndex: -1,

    init()
    {
        this.canvas = this.$refs.canvas as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.center[axis[0]] = Math.floor(this.canvas.width / 2);
        this.center.y = Math.floor(this.canvas.height / 2)
        this.DrawGrid();
        this.PlotPoints();

        this.canvas.addEventListener('pointerdown', (event) => {
            if (this.canvas === null || this.ctx === null) return;

            const rect = this.canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left - this.center.x) / this.gridSize;
            const y = (event.clientY - rect.top - this.center.y) / this.gridSize;

            const hit = this.points.findIndex((point: THREE.Vector3) => {
                return Math.abs(point.x - x) < 5/this.gridSize && Math.abs(point.y - y) < 5/this.gridSize;
            });
            
            // console.log(hit);
            if (hit !== -1)
            {
                console.log("Start dragging");
                this.isDragging = true;
                this.dragIndex = hit;
                return;
            }
        });

        this.canvas.addEventListener('pointermove', (event) => {
            if (this.canvas === null || this.ctx === null) return;

            if (this.isDragging)
            {
                const rect = this.canvas.getBoundingClientRect();
                const x = (event.clientX - rect.left - this.center.x) / this.gridSize;
                const y = (event.clientY - rect.top - this.center.y) / this.gridSize;

                this.points[this.dragIndex].x = x;
                this.points[this.dragIndex].y = y;

                this.$dispatch('pointchange');
            }
        })

        this.canvas.addEventListener('pointerup', (event) => {
            this.isDragging = false;
            this.dragIndex = -1;
        })

        window.requestAnimationFrame(this.Update.bind(this));
    },

    Update(){
        if (this.canvas === null || this.ctx === null) return;
        window.requestAnimationFrame(this.Update.bind(this));

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.DrawGrid();
        this.PlotPoints();
    },

    DrawGrid()
    {
        if (this.canvas === null || this.ctx === null) return;

        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 0.5;

        for (let x = this.center.x; x < this.canvas.width; x += this.gridSize)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let x = this.center.x; x > 0; x -= this.gridSize)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = this.center.y; y < this.canvas.height; y += this.gridSize)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        for (let y = this.center.y; y > 0; y -= this.gridSize)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        this.ctx.fillText("x", this.canvas.width - 0.2 * this.gridSize, this.center.y - 0.2 * this.gridSize);
        this.ctx.fillText("y", this.center.x + 0.2 * this.gridSize, 0.2 * this.gridSize);
    },

    PlotPoints()
    {
        if (this.canvas === null || this.ctx === null) return;

        this.ctx.fillStyle = "black";
        this.points.forEach((point: THREE.Vector3) => {
            if (this.canvas === null || this.ctx === null) return;

            this.ctx.beginPath();
            this.ctx.arc(this.center.x + point.x * this.gridSize, this.center.y + point.y * this.gridSize, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}))
