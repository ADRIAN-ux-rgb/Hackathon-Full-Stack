export function mostrarErro(elemento, mensagem) {
    elemento.textContent = mensagem
    elemento.classList.add("erro")
}

export function limparMensagem(elemento) {
    elemento.textContent = ""
    elemento.classList.remove("erro")
}
