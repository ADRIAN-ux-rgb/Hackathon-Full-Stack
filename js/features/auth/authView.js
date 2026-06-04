import { STORAGE_KEYS } from "../../utils/constants.js"

export function inicializarAuthView(elements, options) {
    mostrarAuthView(elements, "login")

    elements.auth.forms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault()

            const tipo = form.dataset.authForm
            const resultado = validarFormulario(form, tipo)

            form.dataset.authValidated = "true"
            limparFeedbackFormulario(form)
            aplicarResultadoValidacao(form, resultado.erros)

            if (!resultado.valido) {
                return
            }

            if (tipo === "login") {
                const autenticacao = autenticarLogin(obterValores(form))

                if (!autenticacao.autenticado) {
                    aplicarErroCampo(form, autenticacao.campo, autenticacao.mensagem)
                    return
                }

                salvarUsuarioAtual(autenticacao.usuario)
                options.onLogin(autenticacao.usuario)
                return
            }

            const cadastro = cadastrarUsuario(obterValores(form))

            if (!cadastro.cadastrado) {
                aplicarErroCampo(form, cadastro.campo, cadastro.mensagem)
                return
            }

            form.reset()
            delete form.dataset.authValidated
            mostrarAuthView(elements, "login")
            preencherLoginDepoisDoCadastro(elements, cadastro.usuario.email)
            mostrarFeedback(elements, "login", "Cadastro criado. Digite sua senha para entrar.")
        })

        form.querySelectorAll("[data-auth-input]").forEach(function (input) {
            input.addEventListener("input", function () {
                const tipo = form.dataset.authForm
                const resultado = validarFormulario(form, tipo)
                const campo = input.dataset.authInput

                limparFeedbackFormulario(form)

                if (form.dataset.authValidated === "true") {
                    aplicarResultadoValidacao(form, resultado.erros)
                    return
                }

                limparErroCampo(form, campo)

                if (resultado.erros[campo] !== undefined) {
                    aplicarErroCampo(form, campo, resultado.erros[campo])
                }
            })
        })
    })

    elements.auth.switchButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            mostrarAuthView(elements, button.dataset.authTarget)
        })
    })
}

function mostrarAuthView(elements, view) {
    elements.auth.views.forEach(function (panel) {
        panel.classList.toggle("hidden", panel.dataset.authView !== view)
    })

    Object.values(elements.auth.feedbacks).forEach(function (feedback) {
        if (feedback !== null) {
            feedback.textContent = ""
        }
    })

    elements.auth.forms.forEach(function (form) {
        limparErrosFormulario(form)
    })
}

function mostrarFeedback(elements, tipo, mensagem) {
    const feedback = elements.auth.feedbacks[tipo]

    if (feedback !== null && feedback !== undefined) {
        feedback.textContent = mensagem
    }
}

function validarFormulario(form, tipo) {
    if (tipo === "login") {
        return validarLogin(obterValores(form))
    }

    return validarCadastro(obterValores(form))
}

function obterValores(form) {
    const valores = {}

    form.querySelectorAll("[data-auth-input]").forEach(function (input) {
        const campo = input.dataset.authInput

        valores[campo] = campo === "senha" || campo === "confirmarSenha"
            ? input.value
            : input.value.trim()
    })

    return valores
}

function validarLogin(valores) {
    const erros = {}

    validarEmail(valores.email, erros)
    validarSenhaBasica(valores.senha, erros)

    return criarResultado(erros)
}

function validarCadastro(valores) {
    const erros = {}

    if (!valores.nome) {
        erros.nome = "Nome obrigatorio."
    } else if (valores.nome.length < 3) {
        erros.nome = "Nome deve ter pelo menos 3 caracteres."
    }

    validarEmail(valores.email, erros)
    validarSenhaCadastro(valores.senha, erros)

    if (!valores.confirmarSenha) {
        erros.confirmarSenha = "Confirme sua senha."
    } else if (valores.confirmarSenha !== valores.senha) {
        erros.confirmarSenha = "As senhas precisam ser iguais."
    }

    return criarResultado(erros)
}

function validarEmail(email, erros) {
    if (!email) {
        erros.email = "Email obrigatorio."
        return
    }

    if (!emailValido(email)) {
        erros.email = "Digite um email valido com @ e dominio."
    }
}

function validarSenhaBasica(senha, erros) {
    if (!senha) {
        erros.senha = "Senha obrigatoria."
        return
    }

    if (senha.length < 6) {
        erros.senha = "Senha deve ter pelo menos 6 caracteres."
    }
}

function validarSenhaCadastro(senha, erros) {
    validarSenhaBasica(senha, erros)

    if (erros.senha !== undefined) {
        return
    }

    if (!/[a-zA-Z]/.test(senha) || !/[0-9]/.test(senha)) {
        erros.senha = "Senha deve ter pelo menos 1 letra e 1 numero."
    }
}

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function criarResultado(erros) {
    return {
        valido: Object.keys(erros).length === 0,
        erros
    }
}

function cadastrarUsuario(valores) {
    const usuarios = carregarUsuarios()
    const email = normalizarEmail(valores.email)

    if (usuarios.some(function (usuario) {
        return normalizarEmail(usuario.email) === email
    })) {
        return {
            cadastrado: false,
            campo: "email",
            mensagem: "Email ja cadastrado."
        }
    }

    usuarios.push({
        nome: valores.nome,
        email,
        senha: valores.senha
    })

    salvarUsuarios(usuarios)

    return {
        cadastrado: true,
        usuario: {
            nome: valores.nome,
            email
        }
    }
}

function preencherLoginDepoisDoCadastro(elements, email) {
    const loginForm = Array.from(elements.auth.forms).find(function (form) {
        return form.dataset.authForm === "login"
    })

    if (loginForm === undefined) {
        return
    }

    const emailInput = loginForm.querySelector('[data-auth-input="email"]')
    const senhaInput = loginForm.querySelector('[data-auth-input="senha"]')

    if (emailInput !== null) {
        emailInput.value = email
    }

    if (senhaInput !== null) {
        senhaInput.value = ""
        senhaInput.focus()
    }
}

function autenticarLogin(valores) {
    const usuario = carregarUsuarios().find(function (item) {
        return normalizarEmail(item.email) === normalizarEmail(valores.email)
    })

    if (usuario === undefined) {
        return {
            autenticado: false,
            campo: "email",
            mensagem: "Usuário não encontrado"
        }
    }

    if (usuario.senha !== valores.senha) {
        return {
            autenticado: false,
            campo: "senha",
            mensagem: "Senha incorreta"
        }
    }

    return {
        autenticado: true,
        usuario
    }
}

function carregarUsuarios() {
    try {
        const dados = JSON.parse(localStorage.getItem(STORAGE_KEYS.authUsers))
        return Array.isArray(dados) ? dados : []
    } catch {
        return []
    }
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_KEYS.authUsers, JSON.stringify(usuarios))
}

function salvarUsuarioAtual(usuario) {
    localStorage.setItem(STORAGE_KEYS.authCurrentUser, JSON.stringify({
        nome: usuario.nome,
        email: usuario.email
    }))
}

function normalizarEmail(email) {
    return String(email || "").trim().toLowerCase()
}

function aplicarResultadoValidacao(form, erros) {
    limparErrosFormulario(form, false)

    Object.entries(erros).forEach(function ([campo, mensagem]) {
        aplicarErroCampo(form, campo, mensagem)
    })
}

function aplicarErroCampo(form, campo, mensagem) {
    const input = form.querySelector(`[data-auth-input="${campo}"]`)
    const erro = form.querySelector(`[data-auth-error="${campo}"]`)

    if (input !== null) {
        input.classList.add("auth-input-invalid")
        input.setAttribute("aria-invalid", "true")
    }

    if (erro !== null) {
        erro.textContent = mensagem
    }
}

function limparErroCampo(form, campo) {
    const input = form.querySelector(`[data-auth-input="${campo}"]`)
    const erro = form.querySelector(`[data-auth-error="${campo}"]`)

    if (input !== null) {
        input.classList.remove("auth-input-invalid")
        input.removeAttribute("aria-invalid")
    }

    if (erro !== null) {
        erro.textContent = ""
    }
}

function limparErrosFormulario(form, resetarValidacao = true) {
    if (resetarValidacao) {
        delete form.dataset.authValidated
    }

    limparFeedbackFormulario(form)

    form.querySelectorAll("[data-auth-input]").forEach(function (input) {
        limparErroCampo(form, input.dataset.authInput)
    })
}

function limparFeedbackFormulario(form) {
    const feedback = form.querySelector(".auth-feedback")

    if (feedback !== null) {
        feedback.textContent = ""
    }
}
