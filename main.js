// Leiam tudo isso se quiserem aprender ao invés de copiar código, copiar código o ChatGPT já faz, se não quiserem ser substituídos por uma IA, é bom tentarem aprender a base pra se virarem sozinhos, por isso tô comentando esse código.
// Dica: Caso se deparem com um termo que não entenderam, pesquisem sobre ele antes de prosseguirem ou ao menos anotem para estudar futuramente.

// JS tem tipagem fraca e dinâmica, isso quer dizer que não precisamos especificar o tipo de uma variável e ele pode ser alterado livremente. Esse modo de "tipar" pode parecer melhor num primeiro momento, mas ele aumenta as chances de gerar erros inesperados, inclusive foi pra isso que surgiu o TypeScript, ele funciona muito parecido com o JavaScript, mas tem tipagem forte e estática, ou seja, precisamos dizer o tipo da variável, o que reduz as chances de erro (ou deveria, dá pra burlar isso no TS). No C# ensinei vocês a usar tipagem forte e estática pra se habituarem com a existência de tipos, mas ele tem a opção de usar tipagem fraca e dinâmica também (C# é foda, tem as 4, mas é usado mais forte e estática).

// Existem três formas de declarar variáveis em JS:
//      const: cria uma constante, ela não muda de valor
//      let: cria o equivalente às variáveis comuns que viam no C#
//      var: também cria o equivalente ao que vocês conhecem, mas as variáveis são de escopo global e de função (recomendo que deem uma pesquisada sobre), esse jeito tem sido desencorajado pois pode aumentar o uso de memória e causar confusão ao repetir o mesmo nome mais de uma vez.
// nesse caso, usei const e salvei nessa variável o resultado da função document.querySelector() com um id ali dentro, essa função serve para procurar algo na árvore DOM (dentre outras coisas, a lista de elementos HTML da página), nesse caso eu selecionei o elemento HTML que tenha esse ID e salvei na constante formCep.
// Em outras palavras, eu salvei a tag <form> do HTML da tela de buscar CEP nessa constante.
// Lembrando que existem outras formas de buscar elementos na árvore DOM, mas esse é o mais recomendado hoje em dia junto com o querySelectorAll, que busca vários elementos ao invés de um só.
const formCep = document.querySelector("#form-cep");

// Aqui estou adicionando um ouvinte de evento, isso quer dizer que agora o JS vai ficar esperando que alguma coisa específica aconteça com o formulário (com a variável formCep), nesse caso, a primeira coisa que especifiquei foi o tipo de evento (submit).
// Depois disso criei uma arrow function (função sem nome que eu crio diretamente onde vou usá-la com =>, por isso arrow) que vai ser focada em pegar os dados da API do ViaCEP e mostrar na tela. Essa função só roda quando o formulário sofre o evento "submit" (quando ele é enviado), isso só acontece quando eu clico no botão de Verificar.
formCep.addEventListener("submit", (e) => {
  // Aqui eu to pegando aquele (e), que é um atributo da função anônima e usando nele a função preventDefault(), aquele 'e' na verdade é a variável que guarda o evento em si que a gente tava ouvindo, eu salvei ele na variável 'e' automaticamente.
  // Lembra que quando a gente usava um try {} catch(Exception ex) {}, o parâmetro 'ex' era automaticamente preenchido com a exceção em C#? Então, agora é parecido, é preenchido automaticamente com o evento que eu tava ouvindo.
  // A função preventDefault() serve para impedir que o evento faça o que ele faria normalmente, que é enviar os dados do formulário pra algum lugar e depois apagar tudo que tá preenchido nos inputs, to fazendo isso pois, primeiro, não quero enviar o cep agora pra algum lugar e segundo, não quero que ele apague o que tem nos inputs.
  e.preventDefault();

  // To selecionando a tag <input> (pelo id dela) que foi usada pra preencher o CEP, mas não só isso, na verdade eu não tô salvando nessa variável a tag <input> igual eu tava fazendo antes com a tag <form>, eu to colocando o .value que serve para pegar o valor que tem dentro do input, ou seja, eu não to salvando na constante "cep" a tag <input>, eu to salvando o que foi digitado dentro da caixa do input, nesse caso, o usuário vai ter digitado o CEP, essa vai ser a variável que a gente mais vai usar, eu não usei "const" pra criar ela pois daqui a pouco vamos alterar o valor dela pra remover o hífen (-) antes de enviar pra API (caso alguém tenha digitado com hífen).
  let cepInputValue = document.querySelector("#cep-input").value;

  // Aqui eu selecionei a <div> onde o input tá e na linha seguinte eu selecionei o <input> em si, os dois foram selecionados basicamente pra estilizar através do JS aquele contorno vermelho e aquele texto "Digite um CEP válido" de quando você escreve o CEP errado.
  const cepInputDiv = document.querySelector("#cep-input-div");
  const cepInput = document.querySelector("#cep-input");

  // Aqui eu to selecionando a tag onde o resultado da consulta vai ser mostrado, é a <section> logo abaixo do <form>, se vocês notarem, ela está vazia no documento original, isso porque iremos adicionar o HTML dentro dela de forma dinâmica usando o JS (lá no final vocês vão ver).
  const responseContainer = document.querySelector("#response-container");
  // Aqui eu tô usando a propriedade innerHTML (HTML interno) pra remover tudo que tenha dentro dessa <section>, é preciso fazer isso porque se o usuário ficar apertando várias vezes o botão de Verificar, o resultado fica aparecendo várias vezes uma debaixo da outra (você pode testar tirar essa linha se quiser).
  responseContainer.innerHTML = "";

  // Essas duas variáveis que tô criando e que tem um código bizarro na verdade são um negócio muito interessante chamado Expressão Regular, que em inglês é Regular Expression, que abreviado vira RegEx/RegExp, essas expressõess regulares são uma padronização de textos, deixa eu explicar cada item:
  /*
   / demarca o que é a RegEx
   ^ demarca que a partir dali o texto que vai ser verificado começa
   [0-9] Logo depois do começo, vai ter um número de 0 a 9
   {8} Na verdade, a última coisa que apareceu, no caso o [0-9] pode acontecer 8 vezes, em outras palavras, podem aparecer 8 números logo no começo do texto
   $ Marca o final do texto
  */ 
  let regexSemHifen = /^[0-9]{8}$/;
  /*
  Nesse caso a única coisa que muda é que na verdade podem ter 5 números, depois um hífen [-] e depois mais três números, essa nova regex serve pois CEPs na verdade têm esse hífen, então precisamos resolver caso o usuário digite com eles
  */
  let regexComHifen = /^[0-9]{5}[-][0-9]{3}$/;

  // Aqui estamos verificando usando a função .test se o texto que o usuário digitou (cepInputValue) que salvamos lá em cima se encaixa na regex com hífen ou na regex sem hífen, se ele se encaixar em alguma delas, então o usuário digitou um texto no formato de um CEP, caso não tenha, vocês verifiquem o que tem no else.
  if (regexComHifen.test(cepInputValue) || regexSemHifen.test(cepInputValue)) {
    // Aqui to conferindo de novo se o texto se encaixa na versão com hífen, isso porque precisamos remover esse hífen antes de enviar pro ViaCEP
    if (regexComHifen.test(cepInputValue)) {
      // Se o texto que o usuário digitou tiver hífen, ele será removido, o replace serve para substituir um caractere por outro, nesse caso o hífen por nada.
      /* 
      Antes:
      01001-000
      Depois:
      01001000
      */
      cepInputValue = cepInputValue.replace("-", "");
    }

    // Essa função fetch é muito importante, ela é a função usada para fazer requisições HTTP usando JS puro, por enquanto vamos trabalhar com a forma mais simplificada dela (caso tenham interesse na forma mais avançada usada em outros verbos HTTP além do GET, pesquisem sobre objeto Request para fetch, um bom vídeo é esse aqui https://youtu.be/ubw2hdQIl4E?si=I_mAvy6bz-51BO6K), nessa versão temos que passar como parâmetro primeiramente a URL onde queremos fazer a requisição.
    // O próprio ViaCep fala na documentação dele em https://viacep.com.br/ que o link para as requisições é esse, a questão é que é preciso passar o cep que deseja-se verificar dentro da URL, para isso fiz algo que vocês já viram em C#, a interpolação, que é aquele processo de inserir uma variável dentro de uma string, nesse caso eu adicionei a variável que contém o cep ali dentro, caso não lembre, essa variável é a primeira que eu salvei nessa função, alguns detalhes importantes:
    // 1. Quando vamos fazer interpolação, usamos a crase ao invés das aspas (em JS especificamente);
    // 2. No C# para fazer interpolação, colocavamos o $ antes de abrir as aspas, no JS colocamos antes da chave que vai ter uma variável dentro;
    // 3. Se quiserem pesquisar mais sobre interpolação em JS, outro nome usado é Template Literals: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals .
     fetch(`https://viacep.com.br/ws/${cepInputValue}/json/`)
      // Fazer requisições HTTP é uma coisa demorada, isso porque é preciso enviar uma mensagem para o Back-end (nesse caso, o back-end é do próprio ViaCEP), esperar ele buscar os dados que pedimos, enviar de volta e aí sim receber. Por causa disso, fazer uma função comum não seria legal, pois assim que essa função começasse a rodar, o site iria travar até ela terminar, o que é péssimo.
      // Por causa disso, o JS faz com que essa função seja assíncrona, isso quer dizer que é uma função que sabe que vai demorar, então não para o resto do JS até terminar, nesses casos, precisamos tratar os resultados de uma forma um pouco diferente (caso tenham interesse, fica como extra darem uma olhada no conceito de Threads, mas é algo um pouquinho mais avançado que não é o foco por enquanto)
      // É preciso, nesse caso usar a função 'then' para pegar a resposta da requisição que a função fetch fez (then significa "então", no sentido de "terminou? então faça isso"), para fazer isso, podemos usar uma arrow function para pegar essa resposta e converter ela para JSON (aquele formato de documentos usado nessas requisições), arrow functions são meio difíceis de entender de primeira, vou ensinar elas na aula com mais detalhes, mas vocês podem dar uma olhada nesse link: https://diegomariano.com/arrow-functions/#:~:text=O%20que%20%C3%A9%20arrow%20function,fun%C3%A7%C3%B5es%20de%20forma%20mais%20condensada
      .then((response) => response.json())
      // A questão é que essa função .json() TAMBÉM é mais demorada, portanto assíncrona, ou seja, eu tenho que usar outro 'then' para esperar converter para JSON, esse segundo é onde vou fazer todo o restante da lógica de inserir os dados.
      .then((data) => {
        // Na documentação do ViaCEP, eles explicam que quando você busca um CEP e eles não encontram, ao invés de retornarem um JSON com os dados, retornam um simplesmente dizendo erro: true, então aqui eu to verificando se NÃO tem erro (repare no !), se não tiver, eu faço toda a lógica de mostrar os dados, se tiver, vou pro else.
        if (!("erro" in data)) {
          /* Aqui eu to criando um objeto, objetos são basicamente listas, mas ao invés de ser tipo:
          [valor 1, valor 2, valor 3, valor 4], é mais tipo:
          {chave 1: valor 1, chave 2: valor 2, chave 3: valor 3}
          Isso quer dizer que ao invés de ter vários valores soltos, eu tenho um vínculo entre duas coisas, uma chave e um valor, por que fiz isso? Pois o ViaCEP retorna um monte de dados que não tem porquê exibir, tipo vários códigos de IBGE e outras instituições, então pra filtrar o que eu quero exibir, fiz esse objeto onde as chaves estão escritas exatamente como elas vêm no JSON (que pasmem, também funciona num esquema de chave e valor); já o valor que eu coloquei é como eu quero que esse dado específico seja exibido no site, eu não quero que o cep seja exibido só como 'cep', mas sim do jeito certo (CEP), por isso os valores do lado das chaves.
          */
          const listaExibicao = {
            cep: "CEP",
            logradouro: "Logradouro",
            complemento: "Complemento",
            bairro: "Bairro",
            localidade: "Município",
            estado: "Unidade Federativa",
            ddd: "DDD",
          };
          // Aqui eu to percorrendo os dados (data) que o ViaCEP retornou e toda vez que eu passo numa chave, uma variável pega o valor dela (é tipo um foreach), essa variável se chama chave (eu quis usar esse nome pra ser intuitivo pra vocês que ela sempre recebe a chave do JSON que veio para nós);
          for (let chave in data) {
            // Aqui eu to checando se o dado do JSON que tá sendo percorrido agora faz parte da lista de dados que eu quero mostrar, se não fizer, eu só ignoro ele, se fizer, eu vou acrescentar ele na página
            if (!data[chave] == "" && listaExibicao[chave]) {
              // Caso tenham esquecido, responseContainer é a <section> até então vazia que vamos usar para exibir os dados da busca, a propriedade innerHTML se refere "ao HTML que tem dentro dessa <section>", ao usarmos o +=, estamos dizendo que vamos adicionar mais HTML dentro da <section>, depois especificamos que HTML vamos adicionar, vamos usar as crases das Template Literals pois queremos fazer uma string com mais de uma linha e também porque queremos adicionar variáveis dentro dessa string do HTML, vamos tentar entender esse código:
              /*
                A primeira interpolação ainda na <div> é para adicionar uma classe chamada div-cep, div-logradouro ou qualquer outro nome dependendo de que div estamos criando (lembrando que estamos dentro de um 'for', então esse código vai ser adicionado mais de uma vez);
                A segunda interpolação também tem uma função similar, adicionar um id chamado <dado>-title, tipo cep-title;
                A terceira é o que de fato vai aparecer na página como título daquele dado específico, nesse caso, usei a lista de exibição que criei mais em cima (que na verdade é um objeto) para pegar o valor em questão (se ficar difícil, relaxa, essa é provavelmente a parte mais difícil de entender do código, mas tenta dar uma lida até entender);
                A quarta interpolação tem a mesma função da primeira e segunda, adicionar um id/class com o nome do dado que tô exibindo;
                A quinta exibe o dado em si, nesse caso to especificando que quero que apareça, para isso, digo que quero pegar o valor dentro do JSON (data) que esteja na chave que eu passar, se a variável chave estiver valendo 'cep', ele vai procurar qual é o valor no JSON que esteja vinculado à chave 'cep'.
              */
              responseContainer.innerHTML += `
                <div class="div-${chave}">
                  <h4 class="h5 title" id="${chave}-title">${listaExibicao[chave]}</h4>
                  <p id="${chave}-content" class="text-light">${data[chave]}</p>
                </div>
              `;
            }
          }
          // Aqui eu to removendo a classe que faze o contorno vermelho e a mensagem de erro, isso porque se ela estava aparecendo, mas o código JS chegou até aqui, é porque deu certo, então na verdade não precisa ter o contorno e a mensagem de erro.
          cepInput.classList.remove("is-invalid");
          cepInputDiv.classList.remove("is-invalid");
          // Se tiver erro, simplesmente adiciona as classes que expliquei no próximo comentário grande, servem pra estética do site
        } else {
          cepInput.classList.add("is-invalid");
          cepInputDiv.classList.add("is-invalid");
        }
      });
    // Caso o usuário digite um valor que não tem o formato de CEP, adicionamos a classe is-invalid, essa classe serve para fazer o contorno vermelho no <input> e o texto vermelho "Digite um CEP válido" aparecerem, adicionamos ela tanto no input quanto na div ao redor dele porque a estrutura que a gente montou no input misturou o negócio da label flutuante, do botão grudado e agora esse de validar, então o Bootstrap ficou maluco tentando entender, mas relaxem que é assim mesmo
  } else {
    cepInput.classList.add("is-invalid");
    cepInputDiv.classList.add("is-invalid");
  }
});