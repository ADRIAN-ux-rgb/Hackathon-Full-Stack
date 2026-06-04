import { STORAGE_KEYS } from "../../utils/constants.js"

export function inicializarDarkMode(corda) {
    sincronizarBodyComTemaInicial()

    corda.addEventListener("click", function () {
        const deveAtivarDark = !document.documentElement.classList.contains("dark")
        aplicarTema(deveAtivarDark)
        localStorage.setItem(STORAGE_KEYS.theme, deveAtivarDark ? "dark" : "light")
    })
}

function sincronizarBodyComTemaInicial() {
    document.body.classList.toggle("dark", document.documentElement.classList.contains("dark"))
}

function aplicarTema(ativarDark) {
    document.documentElement.classList.toggle("dark", ativarDark)
    document.body.classList.toggle("dark", ativarDark)
}
