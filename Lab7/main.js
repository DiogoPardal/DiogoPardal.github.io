//////////////////////////////// /////////////////////////////////
//// A. Estado e variáveis com referência de elementos do DOM ////
//////////////////////////////////////////////////////////////////

const listaProdutos = document.querySelector("#produtos-list"); 
const botaoCesto = document.querySelector("#botao-cesto");
const painelCesto = document.querySelector("#painel-cesto");
const botaoFecharCesto = document.querySelector("#botao-fechar-cesto");
let IsCestoOpen = false;

const chaveCesto = "produtos-selecionados"
const dadosCesto = localStorage.getItem(chaveCesto);
let produtosSelecionados = dadosCesto === null ? [] : JSON.parse(dadosCesto);

if(dadosCesto === null) {
    localStorage.setItem(chaveCesto, JSON.stringify(produtosSelecionados));
}

const quantidadeCesto = document.querySelector("#quantidade-cesto");
quantidadeCesto.textContent = produtosSelecionados.length;

const listaCesto = document.querySelector("#produtos-selecionados");
const mensagemCestoVazio = document.querySelector("#cesto-vazio");




////////////////////////////////
//// B. Funções utilitárias ////
////////////////////////////////

function criarProduto(produto) {
    const artigo = document.createElement("article");

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;
    artigo.appendChild(titulo);

    const preco = document.createElement('p');
    preco.textContent = "Preço: " + produto.price;
    artigo.appendChild(preco);

    const descricao = document.createElement('p');
    descricao.textContent = "Descrição: " + produto.description;
    artigo.appendChild(descricao);

    const botaoAdicionar = document.createElement('button');
    botaoAdicionar.textContent = "Adicionar ao cesto";
    artigo.appendChild(botaoAdicionar);

    botaoAdicionar.addEventListener("click", function(){
        produtosSelecionados.push(produto);
        localStorage.setItem(chaveCesto, JSON.stringify(produtosSelecionados));
        quantidadeCesto.textContent = produtosSelecionados.length;
        atualizarCesto();
    })

    return artigo;
}

function criaProdutoCesto(produto) {
    const artigo = document.createElement("article");

     const titulo = document.createElement('h2');
    titulo.textContent = produto.title;
    artigo.appendChild(titulo);

    const preco = document.createElement('p');
    preco.textContent = "Preço: " + produto.price;
    artigo.appendChild(preco);

    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = "🗑️";
    artigo.appendChild(botaoRemover);

    botaoRemover.addEventListener("click", function(){
        const indice = produtosSelecionados.findIndex(function(item) {
            return item.id === produto.id;
    });

        if (indice !== -1) {
            produtosSelecionados.splice(indice, 1);
            localStorage.setItem(chaveCesto, JSON.stringify(produtosSelecionados));
            quantidadeCesto.textContent = produtosSelecionados.length;
            atualizarCesto();
        }
    });

    return artigo;
}

function atualizarCesto() {
    listaCesto.replaceChildren();

    if (produtosSelecionados.length === 0) {
        mensagemCestoVazio.style.display = "block";
        listaCesto.appendChild(mensagemCestoVazio);
        return;
    }

    produtosSelecionados.forEach(function(produto) {
        const artigo = criaProdutoCesto(produto);
        listaCesto.appendChild(artigo);
    });

    if (produtosSelecionados.length === 0) {
        mensagemCestoVazio.style.display = "block";
    } else {
        mensagemCestoVazio.style.display = "none";
    }
}





///////////////////////////
//// C. Event handlers ////
//////////////////////////

function renderizarProdutos(produtos) {
    produtos.forEach(function(produto) {
        const artigo = criarProduto(produto);
        listaProdutos.appendChild(artigo);
    })
}

function toggleCesto() {

    if (IsCestoOpen) {
        painelCesto.close();
        botaoCesto.setAttribute("aria-expanded", "false");

    } else {
        painelCesto.showModal();
        botaoCesto.setAttribute("aria-expanded", "true");
    }
    IsCestoOpen = !IsCestoOpen;
}




////////////////////////////
//// D. Event Listeners ////
////////////////////////////
botaoCesto.addEventListener("click", toggleCesto);
botaoFecharCesto.addEventListener("click", toggleCesto);




//////////////////////////
//// E. Inicialização ////
//////////////////////////
renderizarProdutos(produtos);
atualizarCesto();