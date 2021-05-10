/*
        PARTE 01: Crie uma função responsavel por realizar o sorteio de mega sena
*/

//Digite seu código aqui:

function sorteio(numeros)
{
    let mega = []; // Cria uma array responsável por guardar os numeros sorteados

    while (mega.length < numeros) // O loop roda enquando o tamanho/número de elementos forem menores que a quantidade pedide
    {
        let sorteio = Math.ceil(Math.random() * 60); // Sorteio números entre 0 e 59.99, entretanto arredonda o resultado para cima com o Math.Ceil, ou seja, de 1 ate 60
        
        if(mega.indexOf(sorteio) < 0) // Verdadeira se o número sorteado não estiver na nossa array
        {
            mega.push(sorteio) // Logo, adiciona o número sorteado no final
        } // Caso seja falso, ele volta ao loop e começa tudo de novo.
    }
    return mega; // Quando o loop retornar, retorna a array com os números
}

/*
        DESAFIO: Crie um programa que conte letras e palavras de uma frase
*/