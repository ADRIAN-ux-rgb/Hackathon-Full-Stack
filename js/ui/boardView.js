import { TASK_STATUS, STATUS_EMPTY_MESSAGES, normalizarStatus } from "../utils/status.js"
import { criarTaskCard } from "./taskCard.js"

export function limparBoard(listas) {
    Object.values(listas).forEach(function (lista) {
        lista.innerHTML = ""
    })
}

export function atualizarContadores(tarefas, titulos) {
    const totais = Object.values(TASK_STATUS).reduce(function (acc, status) {
        acc[status] = tarefas.filter(function (tarefa) {
            return normalizarStatus(tarefa.status) === status
        }).length

        return acc
    }, {})

    atualizarTituloContador(titulos.todo, "A Fazer", totais.todo, "contador")
    atualizarTituloContador(titulos.doing, "Em Andamento", totais.doing, "contador contador-doing")
    atualizarTituloContador(titulos.done, "Concluido", totais.done, "contador contador-done")
}

export function renderizarBoard(tarefas, elements, handlers, options = {}) {
    limparBoard(elements.listas)

    tarefas.forEach(function (tarefa) {
        inserirTarefaNaLista(tarefa, elements.listas, handlers)
    })

    atualizarContadores(tarefas, elements.titulos)

    if (tarefas.length === 0 && options.filtroAtivo) {
        mostrarEstadoSemResultados(elements.listas)
        return
    }

    mostrarEstadosVazios(elements.listas)
}

export function inserirTarefaNaLista(tarefa, listas, handlers) {
    const status = normalizarStatus(tarefa.status)

    const lista = listas[status]

    if (!lista) {
        console.warn("Status inválido:", tarefa.status, tarefa)
        return
    }

    removerEstadoVazio(lista)

    lista.appendChild(
        criarTaskCard(
            { ...tarefa, status },
            handlers
        )
    )
}

export function mostrarEstadosVazios(listas) {
    Object.entries(listas).forEach(function ([status, lista]) {
        if (lista.querySelectorAll("li:not(.empty-state)").length > 0) {
            return
        }

        const empty = document.createElement("li")
        empty.classList.add("empty-state")
        empty.textContent = STATUS_EMPTY_MESSAGES[status]
        lista.appendChild(empty)
    })
}

export function mostrarEstadoSemResultados(listas) {
    Object.entries(listas).forEach(function ([status, lista], index) {
        const empty = document.createElement("li")
        empty.classList.add("empty-state", "empty-state-filter")
        empty.textContent = index === 0
            ? "Nenhuma tarefa encontrada para os filtros atuais"
            : STATUS_EMPTY_MESSAGES[status]

        lista.appendChild(empty)
    })
}

function removerEstadoVazio(lista) {
    const empty = lista.querySelector(".empty-state")

    if (empty !== null) {
        empty.remove()
    }
}

function atualizarTituloContador(titulo, label, total, classes) {
    const contadorAtual = titulo.querySelector(".contador")
    const totalAnterior = contadorAtual === null ? null : contadorAtual.textContent

    titulo.innerHTML = `${label} <span class="${classes}">${total}</span>`

    const novoContador = titulo.querySelector(".contador")

    if (totalAnterior !== null && totalAnterior !== String(total)) {
        novoContador.classList.add("counter-updated")
    }
}
