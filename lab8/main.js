const apiUrl = "https://deisishop.pw.deisi.ulusofona.pt";

const listaProdutos = document.querySelector("#produtos-list");
const estadoProdutos = document.querySelector("#estado-produtos");
const filtroCategoria = document.querySelector("#filtro-categoria");
const ordenacaoPreco = document.querySelector("#ordenacao-preco");
const pesquisaProduto = document.querySelector("#pesquisa-produto");
const formularioCheckout = document.querySelector("#form-checkout");
const estadoCheckout = document.querySelector("#estado-checkout");

const botaoCesto = document.querySelector("#botao-cesto");
const painelCesto = document.querySelector("#painel-cesto");
const botaoFecharCesto = document.querySelector("#botao-fechar-cesto");
const quantidadeCesto = document.querySelector("#quantidade-cesto");
const listaCesto = document.querySelector("#produtos-selecionados");
const totalCesto = document.querySelector("#total-cesto");

let produtos = [];
const produtosSelecionados = [];

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-PT", {
        style: "currency",
        currency: "EUR"
    });
}

function obterUrlImagem(produto) {
    const caminho = produto.image || produto.imageUrl || produto.image_url || produto.thumbnail;
    if (!caminho) {
        return "";
    }

    try {
        return new URL(caminho, apiUrl + "/").href;
    } catch (erro) {
        return "";
    }
}

function criarProduto(produto) {
    const artigo = document.createElement("article");
    const imagem = document.createElement("img");
    const titulo = document.createElement("h3");
    const preco = document.createElement("p");
    const descricao = document.createElement("p");
    const botao = document.createElement("button");

    imagem.src = obterUrlImagem(produto);
    imagem.alt = produto.title || produto.name || "Produto";
    imagem.loading = "lazy";
    titulo.textContent = produto.title || produto.name || "Produto sem nome";
    preco.className = "preco-produto";
    preco.textContent = formatarPreco(produto.price);
    descricao.textContent = produto.description || "";
    botao.type = "button";
    botao.textContent = "Adicionar ao cesto";
    botao.addEventListener("click", function () {
        produtosSelecionados.push(produto);
        atualizarCesto();
    });

    artigo.append(imagem, titulo, preco, descricao, botao);
    return artigo;
}

function mostrarProdutos() {
    const categoria = filtroCategoria.value;
    const pesquisa = pesquisaProduto.value.trim().toLocaleLowerCase("pt-PT");

    // Aplica os filtros antes de ordenar e apresentar os produtos.
    let produtosVisiveis = produtos.filter(function (produto) {
        const nome = (produto.title || produto.name || "").toLocaleLowerCase("pt-PT");
        return (!categoria || produto.category === categoria) && nome.includes(pesquisa);
    });

    if (ordenacaoPreco.value) {
        const direcao = ordenacaoPreco.value === "asc" ? 1 : -1;
        produtosVisiveis.sort(function (a, b) {
            return (Number(a.price) - Number(b.price)) * direcao;
        });
    }

    listaProdutos.replaceChildren();
    produtosVisiveis.forEach(function (produto) {
        listaProdutos.appendChild(criarProduto(produto));
    });
    estadoProdutos.textContent = produtosVisiveis.length + " produtos encontrados.";
}

function obterLista(dados, propriedade) {
    if (Array.isArray(dados)) {
        return dados;
    }

    if (Array.isArray(dados[propriedade])) {
        return dados[propriedade];
    }

    if (Array.isArray(dados.data)) {
        return dados.data;
    }

    if (dados.data && Array.isArray(dados.data[propriedade])) {
        return dados.data[propriedade];
    }

    return null;
}

function mostrarCategorias(categorias) {
    if (categorias.length === 0) {
        categorias = [...new Set(produtos.map(function (produto) {
            return produto.category;
        }).filter(Boolean))];
    }

    categorias.forEach(function (categoria) {
        const nome = typeof categoria === "string" ? categoria : categoria.name;
        if (!nome) {
            return;
        }

        const opcao = document.createElement("option");
        opcao.value = nome;
        opcao.textContent = nome;
        filtroCategoria.appendChild(opcao);
    });
}

function atualizarCesto() {
    listaCesto.replaceChildren();
    quantidadeCesto.textContent = produtosSelecionados.length;
    const total = produtosSelecionados.reduce(function (soma, produto) {
        return soma + Number(produto.price);
    }, 0);
    totalCesto.textContent = formatarPreco(total);

    if (produtosSelecionados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.id = "cesto-vazio";
        mensagem.textContent = "O cesto está vazio.";
        listaCesto.appendChild(mensagem);
        return;
    }

    produtosSelecionados.forEach(function (produto, indice) {
        const artigo = document.createElement("article");
        const titulo = document.createElement("h3");
        const preco = document.createElement("p");
        const botao = document.createElement("button");

        titulo.textContent = produto.title || produto.name || "Produto";
        preco.textContent = formatarPreco(produto.price);
        botao.type = "button";
        botao.textContent = "Remover";
        botao.addEventListener("click", function () {
            produtosSelecionados.splice(indice, 1);
            atualizarCesto();
        });

        artigo.append(titulo, preco, botao);
        listaCesto.appendChild(artigo);
    });
}

async function carregarLoja() {
    try {
        estadoProdutos.textContent = "A carregar produtos...";
        const respostaProdutos = await fetch(apiUrl + "/products");
        if (!respostaProdutos.ok) {
            throw new Error("GET /products respondeu com HTTP " + respostaProdutos.status + ".");
        }

        const dadosProdutos = await respostaProdutos.json();
        produtos = obterLista(dadosProdutos, "products");
        if (!produtos) {
            throw new Error("A resposta de GET /products não contém uma lista de produtos.");
        }

        mostrarProdutos();

        let categorias = [];
        try {
            const respostaCategorias = await fetch(apiUrl + "/categories");
            if (respostaCategorias.ok) {
                const dadosCategorias = await respostaCategorias.json();
                categorias = obterLista(dadosCategorias, "categories") || [];
            }
        } catch {
            // Os produtos continuam disponíveis mesmo que as categorias falhem.
        }

        mostrarCategorias(categorias);
    } catch (erro) {
        estadoProdutos.textContent = "Não foi possível carregar os produtos. " + erro.message;
    }
}

async function comprar(evento) {
    evento.preventDefault();
    if (produtosSelecionados.length === 0) {
        estadoCheckout.textContent = "Adiciona produtos ao cesto antes de comprar.";
        return;
    }

    // O cesto é enviado à API num pedido POST em JSON.
    const dadosCompra = {
        products: produtosSelecionados.map(function (produto) {
            return { id: produto.id, quantity: 1 };
        }),
        student: document.querySelector("#estudante").checked,
        coupon: document.querySelector("#cupao").value.trim()
    };

    try {
        estadoCheckout.textContent = "A processar a compra...";
        const resposta = await fetch(apiUrl + "/buy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosCompra)
        });
        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.message || resultado.error || "A compra não foi aceite.");
        }

        const referencia = resultado.reference || resultado.paymentReference || resultado.payment_reference;
        const total = resultado.total ?? resultado.finalPrice ?? resultado.final_price;
        estadoCheckout.textContent = "Referência para pagamento: " + (referencia || "não indicada") +
            ". Total: " + (total === undefined ? "não indicado" : formatarPreco(total)) + ".";
        produtosSelecionados.length = 0;
        atualizarCesto();
    } catch (erro) {
        estadoCheckout.textContent = "Não foi possível concluir a compra. " + erro.message;
    }
}

filtroCategoria.addEventListener("change", mostrarProdutos);
ordenacaoPreco.addEventListener("change", mostrarProdutos);
pesquisaProduto.addEventListener("input", mostrarProdutos);
formularioCheckout.addEventListener("submit", comprar);

botaoCesto.addEventListener("click", function () {
    painelCesto.showModal();
    botaoCesto.setAttribute("aria-expanded", "true");
});
botaoFecharCesto.addEventListener("click", function () {
    painelCesto.close();
});
painelCesto.addEventListener("close", function () {
    botaoCesto.setAttribute("aria-expanded", "false");
});

atualizarCesto();
carregarLoja();
