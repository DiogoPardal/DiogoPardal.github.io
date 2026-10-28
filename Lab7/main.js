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
const totalCesto = document.querySelector('#total-cesto');



////////////////////////////////
//// B. Funções utilitárias ////
////////////////////////////////

function criarProduto(produto) {
    const artigo = document.createElement("article");

    const imagem = document.createElement('img');
    imagem.src = produto.image;
    imagem.alt = produto.title;
    imagem.loading = 'lazy';
    artigo.appendChild(imagem);

    const titulo = document.createElement('h2');
    titulo.textContent = produto.title;
    artigo.appendChild(titulo);

    const avaliacao = document.createElement('p');
    avaliacao.className = 'avaliacao-produto';

    const estrela = document.createElement('span');
    estrela.setAttribute('aria-hidden', 'true');
    estrela.textContent = '★';

    const detalhesAvaliacao = document.createElement('span');
    detalhesAvaliacao.textContent = `${produto.rating.rate}/5 · ${produto.rating.count} avaliações`;

    avaliacao.append(estrela, detalhesAvaliacao);
    artigo.appendChild(avaliacao);

    const preco = document.createElement('p');
    preco.className = 'preco-produto';
    preco.textContent = Number(produto.price).toLocaleString('pt-PT', {
        style: 'currency',
        currency: 'EUR'
    });
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
    const total = produtosSelecionados.reduce(function(soma, produto) {
        return soma + Number(produto.price);
    }, 0);

    totalCesto.textContent = total.toLocaleString('pt-PT', {
        style: 'currency',
        currency: 'EUR'
    });

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
