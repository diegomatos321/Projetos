let bgMusic = new Audio("./sound/BackgroundMusic.mp4");

window.onload = function Carregar () //Executa quando a pagina carregar
{
    let fotos = document.getElementsByName("foto");
    let butao = document.getElementById("button");
    let radButtons = document.getElementsByName("radSex");

    fotos.forEach((foto) =>  //Cria os event listeners para cada imagem
    {
        foto.addEventListener("mouseenter", ChangeColor),
        foto.addEventListener("mouseout", ChangeColor),
        foto.addEventListener("click", AtribuirClasse)
    });
    
    butao.addEventListener("click", Confirmar);

    radButtons.forEach((rad) => 
    {
        rad.addEventListener("click", ChangeRad)
    });

    window.addEventListener("click", () => // O audio nao pode ser iniciado junto com o navegador, entao
    {                                          // quando o usario interagir com ele, a musica de fundo começará a tocar
        console.log("Playing Music");
        bgMusic.loop = true;
        bgMusic.volume = 0.2;
        bgMusic.play();
    })
}

let nomeJogador, sexo, raca, classe = "";
let cardClicked;

let videoSources = {
    Guerreiro : "https://www.youtube.com/embed/nVReBH3QYD0",
    Bardo: "https://www.youtube.com/embed/qiHXxrCB5yk?list=PLDnRMnDDjAzK5uZLidDUtHtD1iN06Qe0G",
    Druida: "https://www.youtube.com/embed/WMo_gCRMSfA?list=PLDnRMnDDjAzK5uZLidDUtHtD1iN06Qe0G",
    Mago: "https://www.youtube.com/embed/U1Gs8WTddI4?list=PLDnRMnDDjAzK5uZLidDUtHtD1iN06Qe0G"
}

function Confirmar() //Executa quando o butao "confimar" for clicado
{
    AtribuirValores(); //Atribui os valores as variaveis
    if (!Verificar()){ return; } //Verifica se os todos valores foram preenchidos corretamente
    let player = new Jogador(nomeJogador, sexo, raca, classe); //Cria o objeto "Jogador"
    console.log(player);
    let primeiroNome = nomeJogador.split(" ")[0]; //Retorna o primeiro nome
    alert(`Ora... temos aqui um ${raca} ${sexo}... Seja Bem vindo ${primeiroNome} a nossa guilda! Você aparenta ser um ${classe} muito habilidoso !`)
}
function AtribuirValores()
    {
        nomeJogador = document.getElementById("txtNome").value;
        sexo = document.getElementsByName("radSex");
        raca = document.getElementById("raca").value;

        if (sexo[0].checked ? sexo = "Homem" : sexo = "Mulher");
    }
function Verificar()
{
    if(nomeJogador.trim().length == 0)
    {
        alert("Campo Texto Vazio");
        return false;
    }
    if(raca.trim().length == 0)
    {
        alert("Campo Raça Vazio");
        return false;
    } 
    if(classe.trim().length == 0)
    {
        alert("Campo Classe Vazio");
        return false;
    }
    return true;
}
function ChangeRad() //Verifica se o input do tipo "radio" foi mudado
{
    sexo = document.getElementsByName("radSex");

    if (sexo[0].checked ? MudarImagem("01") : MudarImagem("02")); //Muda as Imagens das classes para o Masculino ou Feminino
}
function MudarImagem(sexo)
{    
    let fotos = document.getElementsByName("foto");

    for (let i = 0; i < 4; i++)
    {
        const foto = fotos[i];

        let rawSrc = foto.src;
        rawSrc = rawSrc.split("_")[0]; //O split separa a string source em uma array, usando o "_" como separador// retornar a primeira parte da array
        
        let newSrc = `${rawSrc}_${sexo}.png`;  //Concatena à primeira parte o sexo
        
        fotos[i].src = newSrc; //Atribui a imagem a nova source
    }
}
function ChangeColor() //Muda a cor da borda quando o mouse passar por cima ou sair
{
    let isYellow = this.style.borderColor == "gold"; //Retorna "true" se a borda for amarela e "false" se nao for
    if (isYellow) //Se a função for chamada e a cor amarela, significa que esta saindo, ou seja, muda para preto
    {
        this.style.borderColor = "black"; //normal
    }
    else //Se a função for chamada e a cor NAO for amarela, significa que esta entrando, ou seja, muda para amarelo
    {
        this.style.borderColor = "gold"; //Mouse por cima
    }
}
function AtribuirClasse() //Quando o imagem for clicada, a nova classe será atribuida 
{
    //console.log(cardClicked);
    if (cardClicked == undefined) //É a primeira vez que seleciona uma classe
    {
        cardClicked = this; //Atribui a nova carta clicada
        this.style.boxShadow = "0 0 10px yellow"; //Atribui uma shadowBox para indicar que foi clicada
    }
    else //Mesma ideia
    {
        cardClicked.style.boxShadow = ""; //A imagem anterior volta ao normal
        cardClicked = this; //Atribui a nova carta clicada
        this.style.boxShadow = "0 0 10px yellow"; //Atribui uma shadowBox
    }
    classe = this.title; //Atribui uma nova classe

    MudarVideo();
}

function MudarVideo(){
    let video = document.getElementById("video");
    video.src = videoSources[`${classe}`]
}
