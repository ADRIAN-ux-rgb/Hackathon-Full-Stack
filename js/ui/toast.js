const TOAST_DURATION = 8000
const TOAST_EXIT_DURATION = 400

let container = null

export function toastSuccess(message) {
    criarToast({
        type: "success",
        title: "Sucesso",
        message
    })
}

export function toastError(message) {
    criarToast({
        type: "error",
        title: "Erro",
        message
    })
}

export function toastInfo(message) {
    criarToast({
        type: "info",
        title: "Atualização",
        message
    })
}

export function criarToast({ type = "info", title, message, duration = TOAST_DURATION }) {
    const toast = document.createElement("div")
    const indicator = document.createElement("span")
    const content = document.createElement("div")
    const titleElement = document.createElement("strong")
    const messageElement = document.createElement("small")
    const closeButton = document.createElement("button")

    toast.className = `toast toast-${type}`
    toast.setAttribute("role", type === "error" ? "alert" : "status")
    toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite")

    indicator.className = "toast-indicator"
    content.className = "toast-content"
    titleElement.textContent = title
    messageElement.textContent = message

    closeButton.type = "button"
    closeButton.className = "toast-close"
    closeButton.setAttribute("aria-label", "Fechar notificacao")
    closeButton.textContent = "x"

    content.appendChild(titleElement)
    content.appendChild(messageElement)
    toast.appendChild(indicator)
    toast.appendChild(content)
    toast.appendChild(closeButton)

    getToastContainer().appendChild(toast)

    const timeout = window.setTimeout(function () {
        removerToast(toast)
    }, duration)

    closeButton.addEventListener("click", function () {
        window.clearTimeout(timeout)
        removerToast(toast)
    })

   window.setTimeout(function () {
    toast.classList.add("toast-visible")
}, 50)

    return toast
}

function removerToast(toast) {
    if (toast.classList.contains("toast-exit")) {
        return
    }

    toast.classList.remove("toast-visible")
    toast.classList.add("toast-exit")

    window.setTimeout(function () {
        toast.remove()
    }, TOAST_EXIT_DURATION)
}

function getToastContainer() {
    if (container !== null && container.isConnected) {
        return container
    }

    container = document.querySelector(".toast-container")

    if (container === null) {
        container = document.createElement("div")
        container.className = "toast-container"
        container.setAttribute("aria-label", "Notificacoes")
    }

    document.body.appendChild(container)

    return container
}
