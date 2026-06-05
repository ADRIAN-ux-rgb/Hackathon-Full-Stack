import { TASK_STATUS, STATUS_LABELS } from "../utils/status.js"
import { criarClasseTipoTarefa, normalizarTipoTarefa } from "../utils/taskTypes.js"

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
    botao.classList.add("task-icon-button", "btn-editar")
    botao.setAttribute("aria-label", `Editar ${tarefa.nome}`)
    botao.title = "Editar tarefa"
    botao.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 16.5V20h3.5L18 9.5 14.5 6 4 16.5Zm16.7-9.8a1 1 0 0 0 0-1.4l-2-2a1 1 0 0 0-1.4 0l-1.6 1.6 3.5 3.5 1.5-1.7Z"/></svg>'
    botao.addEventListener("click", function (event) {
        event.preventDefault()
        onEditRequest(tarefa)
    })

    return botao
}

function criarBotaoExcluir(tarefa, onDeleteRequest) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.classList.add("task-icon-button", "btn-excluir")
    botao.setAttribute("aria-label", `Excluir ${tarefa.nome}`)
    botao.title = "Excluir tarefa"
    botao.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 21a2 2 0 0 1-2-2V7h14v12a2 2 0 0 1-2 2H7Zm1-3h2V10H8v8Zm6 0h2V10h-2v8ZM4 6V4h5l1-1h4l1 1h5v2H4Z"/></svg>'
    botao.addEventListener("click", function (event) {
        event.preventDefault()
        onDeleteRequest(tarefa)
    })

    return botao
}

export function criarTaskCard(tarefa, handlers, options = {}) {
    const prioridadeNormalizada = normalizarPrioridade(tarefa.prioridade)
    const tipoNormalizado = normalizarTipoTarefa(tarefa.tipo)
    const dataLimite = formatarDataLimite(tarefa.dataLimite)
    const item = document.createElement("li")
    item.dataset.id = tarefa.id
    item.draggable = true
    item.classList.add("task-card")

    if (tarefa.status === TASK_STATUS.done) {
        item.classList.add("task-card-completed")
    }

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
    texto.classList.add("task-title")

    const topo = document.createElement("div")
    topo.classList.add("task-card-header")
    topo.appendChild(texto)

    const acoesRapidas = document.createElement("div")
    acoesRapidas.classList.add("task-quick-actions")
    acoesRapidas.appendChild(criarBotaoEditar(tarefa, handlers.onEditRequest))
    acoesRapidas.appendChild(criarBotaoExcluir(tarefa, handlers.onDeleteRequest))
    topo.appendChild(acoesRapidas)

    const info = document.createElement("div")
    info.classList.add("task-info")

    const tags = document.createElement("div")
    tags.classList.add("task-tags")

    const prioridade = document.createElement("small")
    prioridade.classList.add("task-priority", `task-priority-${prioridadeNormalizada.valor}`)
    prioridade.textContent = prioridadeNormalizada.label

    const tipo = document.createElement("small")
    tipo.classList.add("task-type", criarClasseTipoTarefa(tipoNormalizado))
    tipo.textContent = tipoNormalizado

    const data = document.createElement("small")
    data.classList.add("task-deadline")
    data.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11h2v2H7v-2Zm14-5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2v2h8V2h2v2h1a2 2 0 0 1 2 2ZM5 8h14V6H5v2Zm14 12V10H5v10h14Z"/></svg>'
    data.appendChild(document.createTextNode(dataLimite))

    tags.appendChild(tipo)
    tags.appendChild(prioridade)
    info.appendChild(tags)
    info.appendChild(data)

    const areaBotoes = document.createElement("div")
    areaBotoes.classList.add("area-botoes", "task-status-actions")

    Object.values(TASK_STATUS).forEach(function (status) {
        if (tarefa.status !== status) {
            areaBotoes.appendChild(criarBotaoStatus(tarefa, status, handlers.onStatusChange))
        }
    })

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
            icone: ""
        }
    }

    return {
        valor: "media",
        label: "Média",
        icone: ""
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
