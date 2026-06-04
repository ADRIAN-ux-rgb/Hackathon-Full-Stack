import { STORAGE_KEYS } from "../utils/constants.js"

export function listarTarefasUsuario(usuario) {
    return carregarTarefas(usuario.email)
}

export function criarTarefaUsuario(usuario, tarefa) {
    const tarefas = carregarTarefas(usuario.email)
    const novaTarefa = normalizarTarefa({
        ...tarefa,
        id: criarId(),
        usuarioEmail: normalizarEmail(usuario.email)
    })

    salvarTarefas(usuario.email, [...tarefas, novaTarefa])

    return novaTarefa
}

export function atualizarTarefaUsuario(usuario, tarefa) {
    const tarefas = carregarTarefas(usuario.email)
    const tarefaAtualizada = normalizarTarefa({
        ...tarefa,
        usuarioEmail: normalizarEmail(usuario.email)
    })

    salvarTarefas(
        usuario.email,
        tarefas.map(function (item) {
            return item.id === tarefaAtualizada.id ? tarefaAtualizada : item
        })
    )

    return tarefaAtualizada
}

export function excluirTarefaUsuario(usuario, id) {
    salvarTarefas(
        usuario.email,
        carregarTarefas(usuario.email).filter(function (tarefa) {
            return tarefa.id !== id
        })
    )

    return true
}

function carregarTarefas(email) {
    try {
        const tarefas = JSON.parse(localStorage.getItem(criarChaveUsuario(email)))
        return Array.isArray(tarefas) ? tarefas.map(normalizarTarefa) : []
    } catch {
        return []
    }
}

export function carregarTarefasPorEmail(email) {
    return carregarTarefas(email)
}

export function criarChaveTarefasUsuario(email) {
    return criarChaveUsuario(email)
}

function salvarTarefas(email, tarefas) {
    localStorage.setItem(criarChaveUsuario(email), JSON.stringify(tarefas))
}

function criarChaveUsuario(email) {
    return `${STORAGE_KEYS.userTasks}:${normalizarEmail(email)}`
}

function criarId() {
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizarTarefa(tarefa) {
    return {
        id: tarefa.id,
        nome: tarefa.nome || "",
        status: tarefa.status || "todo",
        prioridade: tarefa.prioridade || "media",
        dataCriacao: tarefa.dataCriacao || new Date().toISOString(),
        dataLimite: tarefa.dataLimite || null,
        usuarioEmail: tarefa.usuarioEmail || null
    }
}

function normalizarEmail(email) {
    return String(email || "").trim().toLowerCase()
}
