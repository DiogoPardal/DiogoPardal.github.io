let indiceCor = 0;
let contador = Number(localStorage.getItem('lab5-contador')) || 0;
let segundos = 0;
const cores = ['lightcoral', 'lightgreen', 'khaki', 'plum'];
const textoPassar = document.querySelector('#titulo-passar');
const textoPintar = document.querySelector('#titulo-pintar');
const campoEscrever = document.querySelector('#campo-escrever');
const campoCor = document.querySelector('#campo-cor');
const valorContador = document.querySelector('#valor-contador');
const formularioIdentificacao = document.querySelector('#formulario-identificacao');
const campoNome = document.querySelector('#campo-nome');
const campoIdade = document.querySelector('#campo-idade');
const mensagemIdentificacao = document.querySelector('#mensagem-identificacao');
const valorAutomatico = document.querySelector('#valor-automatico');

function agradecerVisita() {
    textoPassar.textContent = 'Obrigado por passares!';
}

function reporMensagem() {
    textoPassar.textContent = '1. Passa por aqui!';
}

function alternarCorAoEscrever() {
    campoEscrever.style.backgroundColor = cores[indiceCor];
    indiceCor = (indiceCor + 1) % cores.length;
}

function atualizarContador() {
    valorContador.textContent = contador;
    localStorage.setItem('lab5-contador', contador);
}

function incrementarContador() {
    contador++;
    atualizarContador();
}

function decrementarContador() {
    contador--;
    atualizarContador();
}

function resetarContador() {
    contador = 0;
    atualizarContador();
}

function contarSegundos() {
    segundos++;
    valorAutomatico.textContent = segundos;
}

textoPassar.addEventListener('mouseover', agradecerVisita);
textoPassar.addEventListener('mouseout', reporMensagem);
document.querySelectorAll('button.color').forEach((button) => {
    button.addEventListener('click', () => {
        textoPintar.style.color = button.dataset.color;
    });
});
campoEscrever.addEventListener('keyup', alternarCorAoEscrever);
campoCor.addEventListener('change', function () {
    document.body.style.backgroundColor = this.value;
    document.querySelector('main').style.backgroundColor = this.value;
});
document.querySelector('#seletor-flex').addEventListener('change', function () {
    document.querySelector('#flex-container').style.flexDirection = this.value;
});
document.querySelector('#botao-incrementar').addEventListener('click', incrementarContador);
document.querySelector('#botao-decrementar').addEventListener('click', decrementarContador);
document.querySelector('#botao-reset').addEventListener('click', resetarContador);
formularioIdentificacao.onsubmit = (evento) => {
    evento.preventDefault();
    mensagemIdentificacao.textContent = `Olá, o ${campoNome.value} tem ${campoIdade.value}!`;
};
atualizarContador();
window.setInterval(contarSegundos, 1000);
