import { STORAGE_KEYS } from "../../utils/constants.js"

export function inicializarDarkMode(corda) {
    sincronizarBodyComTemaInicial()
    sincronizarControle(corda)

    corda.addEventListener("click", function () {
        const deveAtivarDark = !document.documentElement.classList.contains("dark")
        aplicarTema(deveAtivarDark)
        sincronizarControle(corda)
        localStorage.setItem(STORAGE_KEYS.theme, deveAtivarDark ? "dark" : "light")
    })
}

function sincronizarControle(corda) {
    const darkAtivo = document.documentElement.classList.contains("dark")
    corda.setAttribute("aria-pressed", String(darkAtivo))
    corda.title = darkAtivo ? "Ativar tema claro" : "Ativar tema escuro"
}

function sincronizarBodyComTemaInicial() {
    document.body.classList.toggle("dark", document.documentElement.classList.contains("dark"))
}

function aplicarTema(ativarDark) {
    document.documentElement.classList.toggle("dark", ativarDark)
    document.body.classList.toggle("dark", ativarDark)
}
