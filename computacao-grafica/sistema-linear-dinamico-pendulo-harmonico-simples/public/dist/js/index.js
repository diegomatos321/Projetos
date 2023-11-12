import Main from "./Main.js";
document.addEventListener('DOMContentLoaded', () => {
    const toogleBtn = document.getElementById('toogleBtn');
    const form = document.getElementById('form');
    const anim = new Main(640, 640, 'canvas');
    toogleBtn.addEventListener('click', () => anim.TooglePlay());
    form.addEventListener('submit', (event) => event.preventDefault());
});
//# sourceMappingURL=index.js.map