import Vector from "./vector.js"

export default class InputHandler{
    constructor(){
        this.inputs = {
            KeyW: false,
            Click: false
        }

        this.mousePosition = new Vector(0, 0);

        window.addEventListener("keydown", (e) => {
            if(this.inputs.hasOwnProperty(e.code)){
                this.inputs[e.code] = true;
            }
        })
        
        window.addEventListener("keyup", (e) => {
            if(this.inputs.hasOwnProperty(e.code)){
                this.inputs[e.code] = false;
            }
        })

        window.addEventListener("mousedown", (e)=>{
            this.inputs.Click = true;
        })

        window.addEventListener("mouseup", (e)=>{
            this.inputs.Click = false;
        })

        window.addEventListener("mousemove", (e)=>{
            this.mousePosition.setX(e.clientX)
            this.mousePosition.setY(e.clientY)
        })
    }

    getInputs(){
        let keys = [];

        for (const key in this.inputs) {
            if (this.inputs[key]) {
                keys.push(key);
            }
        }

        return keys;
    }

    getMousePosition(){
        return new Vector(this.mousePosition.getX(), this.mousePosition.getY());
    }
}