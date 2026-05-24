import { TASK_STATUS, STATUS_LABELS } from "../utils/status.js"

function criarBotaoStatus(tarefa, status, onStatusChange) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = STATUS_LABELS[status]
    botao.classList.add("btn-status")
    botao.addEventListener("click", function () {
        onStatusChange({
            ...tarefa,
            status
        })
    })

    return botao
}

function criarBotaoEditar(tarefa, onEdit) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = "Editar"
    botao.classList.add("btn-editar")
    botao.addEventListener("click", function () {
        const novoTexto = prompt("Editar tarefa:", tarefa.nome)

        if (novoTexto === null || novoTexto.trim() === "") {
            return
        }

        onEdit({
            ...tarefa,
            nome: novoTexto.trim()
        })
    })

    return botao
}

function criarBotaoExcluir(tarefa, onDeleteRequest) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = "Excluir"
    botao.classList.add("btn-excluir")
    botao.addEventListener("click", function () {
        onDeleteRequest(tarefa)
    })

    return botao
}

export function criarTaskCard(tarefa, handlers) {
    const item = document.createElement("li")
    item.classList.add("task-card-enter")
    item.dataset.id = tarefa.id
    item.draggable = true

    item.addEventListener("animationend", function () {
        item.classList.remove("task-card-enter")
    }, { once: true })

    item.addEventListener("dragstart", function () {
        item.classList.add("task-dragging")
        handlers.onDragStart(tarefa)
    })

    item.addEventListener("dragend", function () {
        item.classList.remove("task-dragging")
        handlers.onDragEnd()
    })

    const texto = document.createElement("span")
    texto.textContent = tarefa.nome

    const topo = document.createElement("div")
    topo.classList.add("task-card-header")
    topo.appendChild(texto)

    const info = document.createElement("div")
    info.classList.add("task-info")

    const prioridade = document.createElement("small")
    prioridade.textContent = "Alta prioridade"

    const data = document.createElement("small")
    data.textContent = "Hoje"

    info.appendChild(prioridade)
    info.appendChild(data)

    const areaBotoes = document.createElement("div")
    areaBotoes.classList.add("area-botoes")

    Object.values(TASK_STATUS).forEach(function (status) {
        if (tarefa.status !== status) {
            areaBotoes.appendChild(criarBotaoStatus(tarefa, status, handlers.onStatusChange))
        }
    })

    areaBotoes.appendChild(criarBotaoEditar(tarefa, handlers.onEdit))
    areaBotoes.appendChild(criarBotaoExcluir(tarefa, handlers.onDeleteRequest))

    item.appendChild(topo)
    item.appendChild(info)
    item.appendChild(areaBotoes)

    return item
}
