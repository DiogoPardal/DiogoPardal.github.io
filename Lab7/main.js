// A. Estado e variáveis com referência de elementos do DOM
var lista_produtos = document.querySelector("#produtos-list"); 

// B. Funções utilitárias
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

    return artigo;
}

// C. Event handlers
function renderizarProdutos(produtos) {
    produtos.forEach(function(produto) {
        const artigo = criarProduto(produto);
        lista_produtos.appendChild(artigo);
    })
}


// D. Event Listeners


// E. Inicialização
renderizarProdutos(produtos);