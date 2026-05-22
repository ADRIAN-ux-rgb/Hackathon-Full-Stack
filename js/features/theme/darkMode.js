import { STORAGE_KEYS } from "../../utils/constants.js"

export function inicializarDarkMode(corda) {
    const temaSalvo = localStorage.getItem(STORAGE_KEYS.theme)

    if (temaSalvo === "dark") {
        aplicarTema(true)
    }

    corda.addEventListener("click", function () {
        const deveAtivarDark = !document.body.classList.contains("dark")
        aplicarTema(deveAtivarDark)
        localStorage.setItem(STORAGE_KEYS.theme, deveAtivarDark ? "dark" : "light")
    })
}

function aplicarTema(ativarDark) {
    document.body.classList.toggle("dark", ativarDark)
    document.documentElement.classList.toggle("dark", ativarDark)
}
