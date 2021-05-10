function CarregarArquivo(nome, source, callback) {
    if (nome.split("_")[1] == "sound") {
        galeria.audios[nome] = new Audio();
        galeria.audios[nome].src = source;
        return;
    }
    if (nome.split("_")[1] == "img") {
        galeria.imagens[nome] = new Image();
        let novaImagem = new Image();
        novaImagem.onload = function () {
            galeria.imagens[nome].src = source;
            if (--totalDeArquivos == 0) { callback(); }
        }
        novaImagem.src = source;
    } else if (nome.split("_")[1] == "sprite") {
        galeria.spriteSheets[nome] = new Image();
        let novaSpriteSheet = new Image();
        novaSpriteSheet.onload = function () {
            galeria.spriteSheets[nome].src = source;
            if (--totalDeArquivos == 0) { callback(); }
        }
        novaSpriteSheet.src = source;
    }
    totalDeArquivos++;
}