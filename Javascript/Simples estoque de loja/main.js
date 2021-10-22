/* 
        PARTE 01: Crie uma array "estoque", adicione, pelo menos, 4 elementos e crie uma variavel "item"
*/ 

// Declare aqui as variaveis
let estoque = ["Arroz", "Feijao", "Batata"];
let item;

// Verifique a array "estoque" com um "console.log"
console.log("Estoque: " + estoque);
// Adicione um "item" no final da array "estoque" e verifique
estoque.push("Cenoura");
console.log(estoque);
// Use o comando splice, guarde o retorno no "item", e verifique o "estoque" e o "item"
item = estoque.splice(0,2);
console.log(estoque);
console.log(item);
// Adicione o "item" no inicio da array
estoque.unshift(item);
console.log(estoque);

/*
         PARTE 02: Crie uma variavel com seu nome
*/

// Declare aqui as variaveis
let nome = "Diego Vasconcelos Schardosim de Matos";

//Verifique a posição 0 da string nome
console.log(nome.charAt(0));
//Verifique a posição 5 da string nome
console.log(nome.charAt(5));
//Use substr para retornar os caracters de um intervalo
console.log(nome.substr(0,5));

//Crie a variavel salario, e substitua o ponto pela virgula
let salario = 2400.50
console.log(salario.toString().replace(".", ","));

//Template String
console.log(`O meu nome é ${nome}, tenho um estoque de ${estoque} e um salario de ${salario}`);