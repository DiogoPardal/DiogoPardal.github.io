// A. declaração de variáveis
const nodeInputNumero = document.querySelector('#colecao ~ section input[type="number"]');
const nodeInputSubmit = document.querySelector('#colecao ~ section input[type="submit"]');
const nodeUlColecao = document.querySelector('#colecao ul');
const nodeTotalColecao = document.querySelector('#colecao h3 span');
const nodeUlRepetidos = document.querySelector('#colecao ~ #repetidos ul');
const nodeTotalRepetidos = document.querySelector('#colecao ~ #repetidos h3 span');
const form = document.querySelector('#colecao ~ section form');
const colecao = JSON.parse(localStorage.getItem('colecao')) || [];
const repetidos = JSON.parse(localStorage.getItem('repetidos')) || [];

// B. event handlers
function guardaCarta() {
    const numero = Number(nodeInputNumero.value);

    if (colecao.includes(numero)) {
        repetidos.push(numero);
        repetidos.sort((numeroA, numeroB) => numeroA - numeroB);
        atualizaLista(repetidos, nodeUlRepetidos, nodeTotalRepetidos);
    } else {
        colecao.push(numero);
        colecao.sort((numeroA, numeroB) => numeroA - numeroB);
        atualizaLista(colecao, nodeUlColecao, nodeTotalColecao);
    }

    guardaDados();
    nodeInputNumero.value = '';
    nodeInputNumero.focus();
}

function guardaDados() {
    localStorage.setItem('colecao', JSON.stringify(colecao));
    localStorage.setItem('repetidos', JSON.stringify(repetidos));
}

function atualizaLista(lista, nodeUl, nodeTotal) {
    nodeUl.innerHTML = '';

    lista.forEach((numero, indice) => {
        const nodeLista = document.createElement('li');

        if (lista === repetidos) {
            nodeLista.innerHTML = `Cromo nº ${numero} <button type="button" class="eliminar-repetido" data-indice="${indice}">Eliminar</button>`;
        } else {
            nodeLista.textContent = `Cromo nº ${numero}`;
        }

        nodeUl.append(nodeLista);
    });

    nodeTotal.textContent = lista.length;

    if (lista === repetidos) {
        associaEventosEliminar();
    }
}

// C. event listeners
function associaEventosEliminar() {
    const nodeBotoesEliminar = document.querySelectorAll('#colecao ~ #repetidos button.eliminar-repetido');

    nodeBotoesEliminar.forEach((nodeBotao) => {
        nodeBotao.addEventListener('click', () => {
            const indice = Number(nodeBotao.dataset.indice);
            repetidos.splice(indice, 1);
            atualizaLista(repetidos, nodeUlRepetidos, nodeTotalRepetidos);
            guardaDados();
        });
    });
}

form.onsubmit = (event) => {
    event.preventDefault();
    guardaCarta();
};

atualizaLista(colecao, nodeUlColecao, nodeTotalColecao);
atualizaLista(repetidos, nodeUlRepetidos, nodeTotalRepetidos);
