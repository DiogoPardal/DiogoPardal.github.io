let contador = 0;
let coresAlternadas = false;
const botaoContador = document.querySelector('#botao-contador');
const valorContador = document.querySelector('#valor-contador');
const destaque = document.querySelector('#destaque');
const figuraCidade = document.querySelector('#figura-cidade');
const imagemCidade = figuraCidade.querySelector('img');
const legendaFoto = document.querySelector('#legenda-foto');
const mensagemCidade = document.querySelector('#mensagem-cidade');
const botaoCor = document.querySelector('#botao-cor');
const convite = document.querySelector('#convite');

function contarClique() {
    contador++;
    valorContador.textContent = contador;
}

function realcarFotografia() {
    imagemCidade.style.filter = 'saturate(1.3) brightness(1.08)';
    legendaFoto.textContent = 'As luzes de Times Square estão ainda mais vivas!';
}

function restaurarFotografia() {
    imagemCidade.style.filter = 'none';
    imagemCidade.style.transform = 'scale(1)';
    legendaFoto.textContent = 'Times Square, Nova Iorque';
}

function acompanharRato(evento) {
    const limites = figuraCidade.getBoundingClientRect();
    const posicao = (evento.clientX - limites.left) / limites.width;
    imagemCidade.style.transform = `scale(${1 + posicao * 0.06})`;
    mensagemCidade.textContent = posicao > 0.5
        ? 'À direita, os néons contam histórias pela noite dentro.'
        : 'À esquerda, a cidade começa a ganhar vida.';
}

function mudarCores() {
    coresAlternadas = !coresAlternadas;
    destaque.style.backgroundColor = coresAlternadas ? '#dbeafe' : '#fff';
    destaque.style.color = coresAlternadas ? '#12314a' : '#1f2937';
    botaoCor.textContent = coresAlternadas ? 'Repor as cores' : 'Mudar as cores';
}

function iluminarCartao() {
    if (!convite.classList.contains('fixo')) {
        convite.classList.add('aceso');
    }
}

function apagarCartao() {
    if (!convite.classList.contains('fixo')) {
        convite.classList.remove('aceso');
    }
}

function alternarCoresDuploClique() {
    convite.classList.toggle('fixo');
    convite.classList.toggle('aceso', convite.classList.contains('fixo'));
}

botaoContador.addEventListener('click', contarClique);
figuraCidade.addEventListener('mouseover', realcarFotografia);
figuraCidade.addEventListener('mouseout', restaurarFotografia);
figuraCidade.addEventListener('mousemove', acompanharRato);
botaoCor.addEventListener('click', mudarCores);
convite.addEventListener('dblclick', alternarCoresDuploClique);
convite.addEventListener('mouseover', iluminarCartao);
convite.addEventListener('mouseout', apagarCartao);
