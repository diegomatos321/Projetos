import Main from "./Main.js"

document.addEventListener('DOMContentLoaded', () => {
    const toogleBtn: HTMLButtonElement = document.getElementById('toogleBtn') as HTMLButtonElement
    const form: HTMLFormElement = document.getElementById('form') as HTMLFormElement

    const anim = new Main(640, 640, 'canvas');

    toogleBtn.addEventListener('click', () => anim.TooglePlay());
    form.addEventListener('submit', (event: SubmitEvent) => event.preventDefault())
})