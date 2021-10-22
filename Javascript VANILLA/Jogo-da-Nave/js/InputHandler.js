class InputHandler{
    constructor(){
        this.keyDown = {
                17: false,
                37: false,
                38: false,
                39: false,
                40: false
        };
        window.addEventListener("keydown", (e) =>{
            //console.log(e.keyCode)
            this.keyDown[e.keyCode] = true;
        })
        window.addEventListener("keyup", (e) =>{
            this.keyDown[e.keyCode] = false;
        })
    }

    get isDown(){
        let keysDown = [];
        if (this.keyDown["17"] == true){
            keysDown.push(17);
        } 
        if (this.keyDown["38"] == true){
            keysDown.push(38);
        }
        if (this.keyDown["40"] == true){
            keysDown.push(40);
        }
        if (this.keyDown["37"] == true){
            keysDown.push(37);
        }
        if (this.keyDown["39"] == true){
            keysDown.push(39);
        }
        //console.log(keysDown)
        return keysDown;
    }
}