import { TASK_STATUS, STATUS_EMPTY_MESSAGES } from "../utils/status.js"
import { criarTaskCard } from "./taskCard.js"

export function limparBoard(listas) {
    Object.values(listas).forEach(function (lista) {
        lista.innerHTML = ""
    })
}

export function atualizarContadores(tarefas, titulos) {
    const totais = Object.values(TASK_STATUS).reduce(function (acc, status) {
        acc[status] = tarefas.filter(function (tarefa) {
            return tarefa.status === status
        }).length

        return acc
    }, {})

    titulos.todo.innerHTML = `A Fazer <span class="contador">${totais.todo}</span>`
    titulos.doing.innerHTML = `Em Andamento <span class="contador contador-doing">${totais.doing}</span>`
    titulos.done.innerHTML = `Concluido <span class="contador contador-done">${totais.done}</span>`
}

export function renderizarBoard(tarefas, elements, handlers) {
    limparBoard(elements.listas)

    tarefas.forEach(function (tarefa) {
        inserirTarefaNaLista(tarefa, elements.listas, handlers)
    })

    atualizarContadores(tarefas, elements.titulos)
    mostrarEstadosVazios(elements.listas)
}

export function inserirTarefaNaLista(tarefa, listas, handlers) {
    removerEstadoVazio(listas[tarefa.status])
    listas[tarefa.status].appendChild(criarTaskCard(tarefa, handlers))
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

function removerEstadoVazio(lista) {
    const empty = lista.querySelector(".empty-state")

    if (empty !== null) {
        empty.remove()
    }
}
