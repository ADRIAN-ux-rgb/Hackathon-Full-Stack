import { TASK_STATUS, STATUS_LABELS } from "../utils/status.js"

function criarBotaoStatus(tarefa, status, onStatusChange) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = STATUS_LABELS[status]
    botao.classList.add("btn-status")
    botao.addEventListener("click", function (event) {
        event.preventDefault()
        onStatusChange({
            ...tarefa,
            status
        })
    })

    return botao
}

function criarBotaoEditar(tarefa, onEditRequest) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = "Editar"
    botao.classList.add("btn-editar")
    botao.addEventListener("click", function (event) {
        event.preventDefault()
        onEditRequest(tarefa)
    })

    return botao
}

function criarBotaoExcluir(tarefa, onDeleteRequest) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = "Excluir"
    botao.classList.add("btn-excluir")
    botao.addEventListener("click", function (event) {
        event.preventDefault()
        onDeleteRequest(tarefa)
    })

    return botao
}

export function criarTaskCard(tarefa, handlers, options = {}) {
    const prioridadeNormalizada = normalizarPrioridade(tarefa.prioridade)
    const dataLimite = formatarDataLimite(tarefa.dataLimite)
    const item = document.createElement("li")
    item.dataset.id = tarefa.id
    item.draggable = true

    if (options.animarEntrada === true) {
        item.classList.add("task-card-enter")
        item.addEventListener("animationend", function () {
            item.classList.remove("task-card-enter")
        }, { once: true })
    }

    item.addEventListener("dragstart", function (event) {
        item.classList.add("task-dragging")
        event.dataTransfer.effectAllowed = "move"
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
    prioridade.classList.add("task-priority", `task-priority-${prioridadeNormalizada.valor}`)
    prioridade.textContent = prioridadeNormalizada.icone === ""
        ? `${prioridadeNormalizada.label} prioridade`
        : `${prioridadeNormalizada.icone} ${prioridadeNormalizada.label} prioridade`

    const data = document.createElement("small")
    data.classList.add("task-deadline")
    data.textContent = dataLimite

    info.appendChild(prioridade)
    info.appendChild(data)

    const areaBotoes = document.createElement("div")
    areaBotoes.classList.add("area-botoes")

    Object.values(TASK_STATUS).forEach(function (status) {
        if (tarefa.status !== status) {
            areaBotoes.appendChild(criarBotaoStatus(tarefa, status, handlers.onStatusChange))
        }
    })

    areaBotoes.appendChild(criarBotaoEditar(tarefa, handlers.onEditRequest))
    areaBotoes.appendChild(criarBotaoExcluir(tarefa, handlers.onDeleteRequest))

    item.appendChild(topo)
    item.appendChild(info)
    item.appendChild(areaBotoes)

    return item
}

function normalizarPrioridade(prioridade) {
    const valor = String(prioridade || "media").toLowerCase()

    if (valor === "alta") {
        return {
            valor: "alta",
            label: "Alta",
            icone: ""
        }
    }

    if (valor === "baixa") {
        return {
            valor: "baixa",
            label: "Baixa",
            icone: "\u2705"
        }
    }

    return {
        valor: "media",
        label: "Média",
        icone: "\u26A0\uFE0F"
    }
}

function formatarDataLimite(dataLimite) {
    if (!dataLimite) {
        return "Sem prazo"
    }

    const partes = String(dataLimite).split("-")

    if (partes.length !== 3) {
        return "Sem prazo"
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`
}
