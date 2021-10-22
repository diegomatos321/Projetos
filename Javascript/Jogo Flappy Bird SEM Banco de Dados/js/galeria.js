// Galeria de imagens e audios
let totalDeArquivos = 0, arquivosCarregados = 0;
let divLoading = document.getElementById("loading-txt");

let Galeria =
{
    // As imagens ficarão guardadas aqui
    imagens: {},
    audio: {},

    // Função responsável por carregar a imagem
    CarregarImagem: function (nome, source, callback) {
        console.log(`Carregando: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `)
        totalDeArquivos++;

        divLoading.textContent = `Carregando: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `;

        // Cria uma propriedade dentro de imagens com o mesmo nome recebido, essa propriedade
        // é um objeto "Image"
        Galeria.imagens[nome] = new Image();

        // Ao ser carregado, chama uma função anônima
        Galeria.imagens[nome].addEventListener("load", function () {
            arquivosCarregados++;
            console.log(`CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `);

            divLoading.textContent = `CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `;

            if (arquivosCarregados == totalDeArquivos) callback();
        })

        // Atribui a source da imagem para o objeto
        Galeria.imagens[nome].src = source;
    },

    CarregarAudio: function (nome, source) {
        totalDeArquivos++;
        arquivosCarregados++;
        Galeria.audio[nome] = new Audio();
        Galeria.audio[nome].src = source;

        console.log(`CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `)
        divLoading.textContent = `CARREGADO: ${nome} (${arquivosCarregados}/${totalDeArquivos}) `;
    }
}

export default Galeria;