import * as mainGame from "./game.js"
import Galeria from "./galeria.js"

let hasSubmited = false;

const formularioContainer = document.getElementById("formulario-container");
formularioContainer.classList.toggle("hidden");
const formulario = document.getElementById("game-formulario");

const fatherContainer = document.getElementById("jogo-container");
const gameScreen = document.getElementById("game-screen");
gameScreen.classList.toggle("hidden");

const site = document.getElementById("site");

formulario.onsubmit = async function (e) {
    e.preventDefault();
    const body = validateForm(formulario)
    removerTodasAsMensagens();

    // if (hasSubmited || !body.validate) return
    if (hasSubmited) return

    try {
        let response = await fetch("./flappybird", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        })

        let data = await response.json();

        if(response.status === 400){
            apresentarMensagensDeError(data);
        } else{
            iniciarOJogo(data);
        }
    } catch (error) {
        console.log(error)
    }
}

function validateForm(form){
    const tempForm = new FormData(form);
    const body = {};

    tempForm.forEach((value, key) => {
        body[key] = value;
    })

    // if(body.nome.length > 10){
    //     alert("Nickname precisa ser menor que 10 digitos")
    //     body.validate = false;
    // }
    // else{
    //     body.validate = true;
    // }

    return body;
}

// Carregando as imagens e sons
function carregarArquivos() {

    let imagens = [["background", "/uploads/assets/flappybird/imagens/Background.webp"], ["chao", "/uploads/assets/flappybird/imagens/Floor.webp"], ["pipeNorth_img", "/uploads/assets/flappybird/imagens/PipeNorth.webp"], ["pipeSouth_img", "/uploads/assets/flappybird/imagens/PipeSouth.webp"], ["bird_sprite", "/uploads/assets/flappybird/imagens/BirdSprite.webp"], ["coin_sprite", "/uploads/assets/flappybird/imagens/CoinSprite.webp"], ["enter_btn", "/uploads/assets/flappybird/imagens/Enter_btn.webp"], ["gameOverScreen", "/uploads/assets/flappybird/imagens/GameOverScreen.webp"], ["startMenuScreen", "/uploads/assets/flappybird/imagens/StartMenu.webp"]]
    let audios = [["fly_sfx", "/uploads/assets/flappybird/sounds/fly.mp3"], ["score_sfx", "/uploads/assets/flappybird/sounds/score.mp3"]]

    // Objeto Map -> A partir de uma array, cria um key -> value para cada 2 elementos
    imagens = new Map(imagens);
    audios = new Map(audios);

    imagens.forEach((value, key) => {
        Galeria.CarregarImagem(key, value, function () {
            formularioContainer.classList.toggle("hidden");
            console.log("show")

            // Remove o element responsável por aparecer loading ao usuário
            let divLoading = document.getElementById("loading-txt");
            fatherContainer.removeChild(divLoading);
        })
    });

    audios.forEach((value, key) => {
        Galeria.CarregarAudio(key, value, function () {
            formularioContainer.classList.toggle("hidden");

            // Remove o element responsável por aparecer loading ao usuário

            let divLoading = document.getElementById("loading-txt");
            fatherContainer.removeChild(divLoading);
        })
    });
}

function removerTodasAsMensagens(){
    const mensagens = document.getElementsByClassName("mensagem");
    for (let i = 0; i < mensagens.length; i++) {
        const mensagem = mensagens[i];
        site.removeChild(mensagem);
    }
}

function apresentarMensagensDeError(data){
    site.scrollIntoView(true);    
    let divMsg = document.createElement('div');
    divMsg.classList.add('mensagem');
    for (let i = 0; i < data.length; i++) {
        const msg = data[i].msg || data[i];

        let divErr = document.createElement('div');
        divErr.classList.add('error');

        let p = document.createElement('p');
        p.textContent = msg;

        divErr.appendChild(p);
        divMsg.appendChild(divErr);
    }

    site.appendChild(divMsg);
}

function iniciarOJogo(data){
    hasSubmited = true;
    fatherContainer.scrollIntoView(true);    

    mainGame.jogador.score = data.score;
    mainGame.jogador.highScore = data.highScore;
    mainGame.jogador.nome = data.nome;

    formularioContainer.classList.toggle("hidden");
    gameScreen.classList.toggle("hidden");
    mainGame.Game.init();    
}

carregarArquivos();