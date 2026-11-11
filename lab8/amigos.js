const urlApi = "https://amigos.pw.deisi.ulusofona.pt";
const formulario = document.querySelector("#form-pedido");
const respostaApi = document.querySelector("#resposta-api");

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const metodo = document.querySelector("#metodo").value;
    const endpoint = document.querySelector("#endpoint").value.trim();
    const corpo = document.querySelector("#corpo").value.trim();
    const opcoes = { method: metodo };

    if (metodo === "POST" || metodo === "PUT") {
        try {
            opcoes.headers = { "Content-Type": "application/json" };
            opcoes.body = JSON.stringify(JSON.parse(corpo));
        } catch {
            respostaApi.textContent = "O corpo tem de ser JSON válido.";
            return;
        }
    }

    try {
        const resposta = await fetch(urlApi + endpoint, opcoes);
        const texto = await resposta.text();
        respostaApi.textContent = "HTTP " + resposta.status + "\n" + texto;
    } catch (erro) {
        respostaApi.textContent = "O pedido falhou: " + erro.message;
    }
});
