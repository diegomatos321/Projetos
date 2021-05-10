export default class InputHandler{
    constructor(){
        document.addEventListener("keydown", (e) => {
            this.keyDown = e.keyCode;
        })
        /*document.addEventListener("keypress", (e) => {
            console.log(e)
            this.keyPress = e.keyCode;
        })*/
    }
    get KeyDown(){
        return this.keyDown;
    }

    /*get KeyPress(){
        return this.keyPress;
    }*/
}