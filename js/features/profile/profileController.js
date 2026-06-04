import { carregarTarefasPorEmail } from "../../api/tarefasLocalApi.js"
import { STORAGE_KEYS } from "../../utils/constants.js"
import { TASK_STATUS, normalizarStatus } from "../../utils/status.js"

export function criarProfileController(elements, getUsuarioAtual) {
    function carregarPerfil() {
        const usuario = getUsuarioAtual()

        if (usuario === null) {
            redirecionarLogin()
            return
        }

        renderizarPerfil(elements.profile, usuario, calcularMetricas(usuario.email))
    }

    function carregarResumoSidebar() {
        const usuario = getUsuarioAtual()

        if (usuario !== null) {
            renderizarPerfil(elements.profile, usuario, calcularMetricas(usuario.email))
        }
    }

    elements.profile.logoutButton.addEventListener("click", function () {
        localStorage.removeItem(STORAGE_KEYS.authCurrentUser)
        redirecionarLogin()
    })

    return {
        carregarPerfil,
        carregarResumoSidebar
    }
}

export function carregarUsuarioLogado() {
    try {
        const usuario = JSON.parse(localStorage.getItem(STORAGE_KEYS.authCurrentUser))

        if (usuario !== null && typeof usuario === "object" && usuario.email) {
            return usuario
        }
    } catch {
        return null
    }

    return null
}

function renderizarPerfil(elements, usuario, metricas) {
    const nome = usuario.nome || usuario.email || ""
    const iniciais = criarIniciais(nome, usuario.email)

    elements.name.textContent = nome
    elements.email.textContent = usuario.email
    elements.avatar.textContent = iniciais
    elements.pageAvatar.textContent = iniciais
    elements.pageName.textContent = nome
    elements.pageEmail.textContent = usuario.email
    elements.total.textContent = metricas.total
    elements.todo.textContent = metricas.todo
    elements.doing.textContent = metricas.doing
    elements.done.textContent = metricas.done
}

function criarIniciais(nome, email) {
    const partes = String(nome || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)

    if (partes.length >= 2) {
        return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase()
    }

    if (partes.length === 1 && partes[0].length >= 2) {
        return partes[0].slice(0, 2).toUpperCase()
    }

    return String(email || "US").slice(0, 2).toUpperCase()
}

function calcularMetricas(email) {
    return carregarTarefasPorEmail(email).reduce(function (metricas, tarefa) {
        const status = normalizarStatus(tarefa.status)

        metricas.total += 1

        if (status === TASK_STATUS.todo) {
            metricas.todo += 1
        }

        if (status === TASK_STATUS.doing) {
            metricas.doing += 1
        }

        if (status === TASK_STATUS.done) {
            metricas.done += 1
        }

        return metricas
    }, {
        total: 0,
        todo: 0,
        doing: 0,
        done: 0
    })
}

function redirecionarLogin() {
    window.location.href = "login.html"
}
