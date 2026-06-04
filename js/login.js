import { inicializarAuthView } from "./features/auth/authView.js"

const elements = {
    auth: {
        views: document.querySelectorAll("[data-auth-view]"),
        forms: document.querySelectorAll("[data-auth-form]"),
        switchButtons: document.querySelectorAll("[data-auth-target]"),
        feedbacks: {
            login: document.querySelector('[data-auth-feedback="login"]'),
            cadastro: document.querySelector('[data-auth-feedback="cadastro"]')
        }
    }
}

inicializarAuthView(elements, {
    onLogin() {
        window.location.href = "index.html"
    }
})
