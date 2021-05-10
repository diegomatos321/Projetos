const imgs = ["gai.png", "kakashi.png", "naruto.png", "sasuke.png", "sakura.png", "madara.png"]; // Array das imagens disponiveis
let imgsPosicao = []; // Array responsavel por guardar as posições das imagens

let primeiroClique = "", segundoClique = "";
let active = true;

let pontos = 0, txtPontos, txtMoves;
let segundos, minutos, timer, moves, cartasCorretas = 0;

let bgMusic = new Audio("./sound/BackgroundSound.mp3");
let toCertoAudio = new Audio("./sound/tocerto.m4a"); // Toca quando encontrar duas cartas iguais
toCertoAudio.volume = 0.2;

window.onload = Carregar();

function Carregar()
{ 
    txtMoves = document.getElementById("moves");
    txtPontos = document.getElementById("pontos");
    timer = document.getElementById("timer");

    ResetVariables();

    let cartas = document.getElementsByName("carta");
    let id = 0;

    Embaralhar(cartas.length);
    console.log(imgsPosicao);

    cartas.forEach(carta => {
        carta.addEventListener("click", Clique, {passive:false}),
        carta.id = id;
        carta.src = "./imagens/back_face.png"
        id++;
    });

    let button = document.getElementById("btn");
    button.addEventListener("click", Carregar, {passive:false}); // Quando clicar no butao embaralhar, reseta e embaralha tudo de novo


    document.addEventListener("click", () => // Nao é possivel executar uma musica no navegador assim que ele carregar
    {                                       // Entao, quando o usuario interagir com ele, a musica começa
        if(bgMusic.currentTime != 0){ return;} // Verifica se ela já nao esta tocando
        console.log("Playing Music");
        bgMusic.volume = 0.16;
        bgMusic.loop = true;
        bgMusic.play();
        Timer(); //Timer começa qnd interagir com o jogo
    }, {passive:false})
}

function Embaralhar(numCartas)
{
    imgsPosicao = [];
    
    while(imgsPosicao.length != numCartas)
    {
        let sorteio = Math.floor(Math.random() * imgs.length);// Sorteia um numero entre 0 e o tamanho da array da imagem, no nosso caso, 6
        const filter = imgsPosicao.filter((item) => {return item == imgs[sorteio]}); // Retorna uma nova array com todos items iguais ao sorteio

        if(filter.length < 2)// So podem ser sorteados dois numeros iguais
        {
            imgsPosicao.push(imgs[sorteio]);
        }// O loop irá repertir até que tenham duas cartas de cada imagem
    }
}
function Clique()
{
    console.log(active)
    if (!active || this == primeiroClique) {return;}// Retorna caso as cartas estejam desativadas ou tenha clicado duas vezes na mesma carta

    if(primeiroClique == "")//Primeiro clique
    {
        primeiroClique = this;

        this.src = `./imagens/${imgsPosicao[this.id]}`; //Mostra a carta
        return; //Deve retornar, pois essa nao foi a segunda carta clicada
        /*
        if (segundoClique == "")//Literalmente o primeiro clique kkkkk
        {
            this.src = `./imagens/${imgsPosicao[this.id]}`;//Mostra a carta
            return;//Deve retornar, pois essa nao foi a segunda carta clicada
        }*/
    }
    else if(segundoClique == "")//Segunda vez
    {
        segundoClique = this;
    }

    this.src = `./imagens/${imgsPosicao[this.id]}`;

    CheckForMatch();
    CheckForGameOver();
}
function CheckForMatch()
{
    let isMatch = primeiroClique.src == segundoClique.src;// Sao iguais ?
    isMatch ? DisableCard() : UnFlipCards();
}
function DisableCard()// Sim
{
    moves += 2;
    txtMoves.innerHTML = `Moves Left: ${moves}`;
   
    cartasCorretas++;

    toCertoAudio.play();

    primeiroClique.removeEventListener("click", Clique);
    segundoClique.removeEventListener("click", Clique);

    AddPontos();

    primeiroClique = "";
    segundoClique = "";
}
function UnFlipCards()// Nao
{
    moves -= 2;
    if (moves == 0) return
    txtMoves.innerHTML = `Moves Left: ${moves}`;

    active = false;
    setTimeout(() =>
    {
        primeiroClique.src = `./imagens/back_face.png`,
        segundoClique.src = `./imagens/back_face.png`,

        primeiroClique = "",
        segundoClique = "",

        active = true;
    }, 1000);
}
function AddPontos()
{
    pontos ++;
    txtPontos.innerHTML = `Pontuacao: ${pontos}`;
}
function Timer()
{
    setInterval(() => {
        if(timer.innerHTML == ""){ return;}
        segundos++;
        if (segundos == 60)
        {
            minutos++;
            segundos = 0
        }
        timer.innerHTML = `Tempo: ${minutos}m e ${segundos}s`
    }, 1000);
}
function CheckForGameOver()
{
    console.log(cartasCorretas);
    if (moves == 0 || cartasCorretas == imgs.length)
    {
        active = false;   
        txtMoves.innerHTML = "Game Over";

        setTimeout(() => {
            Carregar();
        }, 3000);
    }
}
function ResetVariables()
{
    segundos = 0;
    minutos = 0;
    moves = 6;
    cartasCorretas = 0;
    active = true;

    txtMoves.innerHTML = `Moves Left: ${moves}`;
}