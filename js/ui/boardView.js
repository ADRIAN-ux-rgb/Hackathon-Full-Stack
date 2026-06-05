import { TASK_STATUS, STATUS_EMPTY_MESSAGES, normalizarStatus } from "../utils/status.js"
import { criarTaskCard } from "./taskCard.js"

export function limparBoard(listas) {
    Object.values(listas).forEach(function (lista) {
        lista.innerHTML = ""
    })
}

export function mostrarSkeletonBoard(listas) {
    Object.values(listas).forEach(function (lista) {
        lista.innerHTML = ""

        for (let index = 0; index < 2; index += 1) {
            const skeleton = document.createElement("li")
            skeleton.classList.add("task-skeleton")
            skeleton.setAttribute("aria-hidden", "true")

            const title = document.createElement("span")
            title.classList.add("task-skeleton-line", "task-skeleton-title")

            const meta = document.createElement("span")
            meta.classList.add("task-skeleton-line", "task-skeleton-meta")

            skeleton.appendChild(title)
            skeleton.appendChild(meta)
            lista.appendChild(skeleton)
        }
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
    atualizarTituloContador(titulos.done, "Concluído", totais.done, "contador contador-done")
}

export function renderizarBoard(tarefas, elements, handlers, options = {}) {
    const posicoesAnteriores = capturarPosicoesCards(elements.listas)

    limparBoard(elements.listas)

    tarefas.forEach(function (tarefa) {
        inserirTarefaNaLista(tarefa, elements.listas, handlers, options)
    })

    atualizarContadores(tarefas, elements.titulos)

    if (tarefas.length === 0 && options.filtroAtivo) {
        mostrarEstadoSemResultados(elements.listas)
        return
    }

    mostrarEstadosVazios(elements.listas)
    animarMudancasLayout(elements.listas, posicoesAnteriores)
}

export function inserirTarefaNaLista(tarefa, listas, handlers, options = {}) {
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
            handlers,
            {
                animarEntrada: options.animarEntrada === true
            }
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

function capturarPosicoesCards(listas) {
    const posicoes = new Map()

    Object.values(listas).forEach(function (lista) {
        lista.querySelectorAll("li[data-id]").forEach(function (card) {
            posicoes.set(card.dataset.id, card.getBoundingClientRect())
        })
    })

    return posicoes
}

function animarMudancasLayout(listas, posicoesAnteriores) {
    Object.values(listas).forEach(function (lista) {
        lista.querySelectorAll("li[data-id]").forEach(function (card) {
            const posicaoAnterior = posicoesAnteriores.get(card.dataset.id)

            if (posicaoAnterior === undefined) {
                return
            }

            const posicaoAtual = card.getBoundingClientRect()
            const deslocamentoX = posicaoAnterior.left - posicaoAtual.left
            const deslocamentoY = posicaoAnterior.top - posicaoAtual.top

            if (deslocamentoX === 0 && deslocamentoY === 0) {
                return
            }

            card.classList.add("task-card-moving")
            card.style.transition = "none"
            card.style.transform = `translate(${deslocamentoX}px, ${deslocamentoY}px)`

            requestAnimationFrame(function () {
                card.style.transition = ""
                card.style.transform = ""
            })

            card.addEventListener("transitionend", function () {
                card.classList.remove("task-card-moving")
                card.style.transition = ""
                card.style.transform = ""
            }, { once: true })
        })
    })
}
