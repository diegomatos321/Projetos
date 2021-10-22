import * as mainGame from "./game.js"
import Galeria from "./galeria.js"

let hasSubmited = false;

const formularioContainer = document.getElementById("formulario-container");
const formulario = document.getElementById("game-formulario");

const fatherContainer = document.getElementById("jogo-container");
const gameScreen = document.getElementById("game-screen");

const site = document.getElementById("site");

formulario.onsubmit = async function (e) {
    e.preventDefault();
    const body = getFormData(formulario);
    removerTodasAsMensagens();

    // if (hasSubmited || !body.validate) return
    if (hasSubmited) return
    hasSubmited=true;

    try {
        const baseURL = window.location.href;
        let response = await fetch(baseURL, {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        })

        let data = await response.json();

        if (response.status === 400) {
            hasSubmited=false;
            apresentarMensagensDeError(data);
        } else {
            iniciarOJogo(data);
        }
    } catch (error) {
        console.log(error)
    }
}

function getFormData(form) {
    const formData = new FormData(form);
    const body = {};

    formData.forEach((value, key) => {
        body[key] = value;
    })

    return body;
}

// Carregando as imagens e sons
function carregarArquivos() {

    let imagens = [["background", "/assets/imagens/Background.webp"], ["chao", "/assets/imagens/Floor.webp"], ["pipeNorth_img", "/assets/imagens/PipeNorth.webp"], ["pipeSouth_img", "/assets/imagens/PipeSouth.webp"], ["bird_sprite", "/assets/imagens/BirdSprite.webp"], ["coin_sprite", "/assets/imagens/CoinSprite.webp"], ["enter_btn", "/assets/imagens/Enter_btn.webp"], ["gameOverScreen", "/assets/imagens/GameOverScreen.webp"], ["startMenuScreen", "/assets/imagens/StartMenu.webp"]]
    let audios = [["fly_sfx", "/assets/audio/fly.mp3"], ["score_sfx", "/assets/audio/score.mp3"]]

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


function removerTodasAsMensagens() {
    const mensagens = document.getElementsByClassName("mensagem");
    for (let i = 0; i < mensagens.length; i++) {
        const mensagem = mensagens[i];
        site.removeChild(mensagem);
    }
}

function apresentarMensagensDeError(data) {
    site.scrollIntoView();
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

function iniciarOJogo(data) {
    fatherContainer.scrollIntoView(true);

    mainGame.jogador.score = data.score;
    mainGame.jogador.highScore = data.highScore;
    mainGame.jogador.nome = data.nome;

    formularioContainer.classList.toggle("hidden");
    gameScreen.classList.toggle("hidden");
    mainGame.Game.init();
}

carregarArquivos();