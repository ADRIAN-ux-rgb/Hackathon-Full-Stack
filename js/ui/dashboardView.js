import { TASK_STATUS, normalizarStatus } from "../utils/status.js"
import { TASK_TYPE_VALUES, criarClasseTipoTarefa, normalizarTipoTarefa } from "../utils/taskTypes.js"

const PIE_CIRCUMFERENCE = 2 * Math.PI * 44
const PIE_SEGMENT_OVERLAP = 0.75
const CHART_STATUS = [
    TASK_STATUS.todo,
    TASK_STATUS.doing,
    TASK_STATUS.done
]

export function calcularMetricasDashboard(tarefas) {
    const totais = tarefas.reduce(function (acc, tarefa) {
        const status = normalizarStatus(tarefa.status)

        if (status !== null) {
            acc[status] += 1
        }

        return acc
    }, {
        [TASK_STATUS.todo]: 0,
        [TASK_STATUS.doing]: 0,
        [TASK_STATUS.done]: 0
    })

    const total = totais[TASK_STATUS.todo] + totais[TASK_STATUS.doing] + totais[TASK_STATUS.done]
    const percentualConcluido = total === 0
        ? 0
        : Math.round((totais[TASK_STATUS.done] / total) * 100)

    const prioridades = tarefas.reduce(function (acc, tarefa) {
        const prioridade = normalizarPrioridade(tarefa.prioridade)
        acc[prioridade] += 1
        return acc
    }, { alta: 0, media: 0, baixa: 0 })

    const tipos = tarefas.reduce(function (acc, tarefa) {
        acc[normalizarTipoTarefa(tarefa.tipo)] += 1
        return acc
    }, criarContadoresTipo())

    return {
        total,
        todo: totais[TASK_STATUS.todo],
        doing: totais[TASK_STATUS.doing],
        done: totais[TASK_STATUS.done],
        percentualConcluido,
        prioridades,
        tipos
    }
}

export function renderizarDashboard(tarefas, elements) {
    const metricas = calcularMetricasDashboard(tarefas)

    elements.total.textContent = metricas.total
    elements.todo.textContent = metricas.todo
    elements.doing.textContent = metricas.doing
    elements.done.textContent = metricas.done
    elements.percent.textContent = `${metricas.percentualConcluido}%`
    elements.progressBar.style.width = `${metricas.percentualConcluido}%`
    elements.progressLabel.textContent = criarLegendaProgresso(metricas)
    renderizarGraficoPizza(metricas, elements)
    renderizarGraficoPrioridades(metricas, elements)
    renderizarTipos(metricas.tipos, elements.typesList)
    renderizarPrazosProximos(tarefas, elements.deadlinesList)
}

function criarContadoresTipo() {
    return TASK_TYPE_VALUES.reduce(function (acc, tipo) {
        acc[tipo] = 0
        return acc
    }, {})
}

function renderizarTipos(tipos, container) {
    container.innerHTML = ""
    const maiorTotal = Math.max(1, ...Object.values(tipos))

    TASK_TYPE_VALUES.forEach(function (tipo) {
        const item = document.createElement("div")
        item.classList.add("dashboard-type-item")

        const badge = document.createElement("span")
        badge.classList.add("task-type", criarClasseTipoTarefa(tipo))
        badge.textContent = tipo

        const total = document.createElement("strong")
        total.textContent = tipos[tipo]

        const track = document.createElement("div")
        track.classList.add("dashboard-type-track")
        const bar = document.createElement("span")
        bar.classList.add(criarClasseTipoTarefa(tipo))
        bar.style.width = `${(tipos[tipo] / maiorTotal) * 100}%`
        track.appendChild(bar)

        item.appendChild(badge)
        item.appendChild(total)
        item.appendChild(track)
        container.appendChild(item)
    })
}

function normalizarPrioridade(prioridade) {
    const valor = String(prioridade || "media").toLowerCase()
    return ["alta", "media", "baixa"].includes(valor) ? valor : "media"
}

function renderizarGraficoPrioridades(metricas, elements) {
    const maiorValor = Math.max(1, ...Object.values(metricas.prioridades))

    Object.entries(metricas.prioridades).forEach(function ([prioridade, total]) {
        elements.priorityValues[prioridade].textContent = total
        elements.priorityBars[prioridade].style.width = `${(total / maiorValor) * 100}%`
    })
}

function renderizarPrazosProximos(tarefas, container) {
    const hoje = criarDataLocal(new Date())
    const proximas = tarefas
        .filter(function (tarefa) {
            if (normalizarStatus(tarefa.status) === TASK_STATUS.done || !tarefa.dataLimite) {
                return false
            }

            const dias = calcularDiferencaDias(hoje, tarefa.dataLimite)
            return dias >= 0 && dias <= 3
        })
        .sort(function (a, b) {
            return String(a.dataLimite).localeCompare(String(b.dataLimite))
        })

    container.innerHTML = ""

    if (proximas.length === 0) {
        const empty = document.createElement("div")
        empty.classList.add("dashboard-deadlines-empty")
        empty.innerHTML = "<strong>Nenhum prazo próximo</strong><span>Não há tarefas pendentes vencendo nos próximos 3 dias.</span>"
        container.appendChild(empty)
        return
    }

    proximas.forEach(function (tarefa) {
        const prioridade = normalizarPrioridade(tarefa.prioridade)
        const dias = calcularDiferencaDias(hoje, tarefa.dataLimite)
        const item = document.createElement("article")
        item.classList.add("dashboard-deadline-item")

        const conteudo = document.createElement("div")
        conteudo.classList.add("dashboard-deadline-copy")
        const nome = document.createElement("strong")
        nome.textContent = tarefa.nome
        const data = document.createElement("span")
        data.textContent = formatarData(tarefa.dataLimite)
        conteudo.appendChild(nome)
        conteudo.appendChild(data)

        const badges = document.createElement("div")
        badges.classList.add("dashboard-deadline-badges")
        const prioridadeBadge = document.createElement("span")
        prioridadeBadge.classList.add("task-priority", `task-priority-${prioridade}`)
        prioridadeBadge.textContent = prioridade === "media" ? "Média" : capitalizar(prioridade)
        const urgencia = document.createElement("span")
        urgencia.classList.add("deadline-urgency", `deadline-urgency-${dias}`)
        urgencia.textContent = criarLabelUrgencia(dias)
        badges.appendChild(prioridadeBadge)
        badges.appendChild(urgencia)

        item.appendChild(conteudo)
        item.appendChild(badges)
        container.appendChild(item)
    })
}

function criarDataLocal(data) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate())
}

function calcularDiferencaDias(hoje, dataLimite) {
    const partes = String(dataLimite).split("-").map(Number)

    if (partes.length !== 3 || partes.some(Number.isNaN)) {
        return Number.POSITIVE_INFINITY
    }

    const limite = new Date(partes[0], partes[1] - 1, partes[2])
    return Math.round((limite - hoje) / 86400000)
}

function formatarData(dataLimite) {
    const partes = String(dataLimite).split("-")
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : "Sem prazo"
}

function criarLabelUrgencia(dias) {
    return ["Vence hoje", "Amanhã", "Em 2 dias", "Em 3 dias"][dias]
}

function capitalizar(valor) {
    return `${valor.charAt(0).toUpperCase()}${valor.slice(1)}`
}

function criarLegendaProgresso(metricas) {
    if (metricas.total === 0) {
        return "Nenhuma tarefa cadastrada ainda"
    }

    if (metricas.done === 0) {
        return "Nenhuma tarefa concluída ainda"
    }

    return `${metricas.done} de ${metricas.total} tarefas concluídas`
}

function renderizarGraficoPizza(metricas, elements) {
    const segmentos = criarSegmentosGrafico(metricas)

    segmentos.forEach(function (segmento) {
        const segment = elements.pieSegments[segmento.status]

        segment.style.strokeDasharray = `${segmento.length} ${PIE_CIRCUMFERENCE - segmento.length}`
        segment.style.strokeDashoffset = -segmento.offset
    })

    elements.pieTotal.textContent = metricas.total
    elements.legend.todo.textContent = metricas.todo
    elements.legend.doing.textContent = metricas.doing
    elements.legend.done.textContent = metricas.done
    elements.chartLabel.textContent = criarLegendaGrafico(metricas)
    elements.pieChart.setAttribute("aria-label", criarDescricaoGrafico(metricas))
}

function criarSegmentosGrafico(metricas) {
    if (metricas.total === 0) {
        return CHART_STATUS.map(function (status) {
            return {
                status,
                length: 0,
                offset: 0
            }
        })
    }

    const statusVisiveis = CHART_STATUS.filter(function (status) {
        return metricas[status] > 0
    })

    if (statusVisiveis.length === 1) {
        return CHART_STATUS.map(function (status) {
            return {
                status,
                length: status === statusVisiveis[0] ? PIE_CIRCUMFERENCE : 0,
                offset: 0
            }
        })
    }

    const comprimentos = calcularComprimentosExatos(metricas, statusVisiveis)
    let offset = 0

    return CHART_STATUS.map(function (status) {
        const length = comprimentos[status] || 0
        const segmentOffset = offset

        offset += length

        return {
            status,
            length: length === 0 ? 0 : Math.min(PIE_CIRCUMFERENCE, length + PIE_SEGMENT_OVERLAP),
            offset: segmentOffset
        }
    })
}

function calcularComprimentosExatos(metricas, statusVisiveis) {
    const comprimentos = {}
    let acumulado = 0

    statusVisiveis.forEach(function (status, index) {
        const isUltimo = index === statusVisiveis.length - 1
        const length = isUltimo
            ? PIE_CIRCUMFERENCE - acumulado
            : (metricas[status] / metricas.total) * PIE_CIRCUMFERENCE

        comprimentos[status] = length
        acumulado += length
    })

    return comprimentos
}

function criarLegendaGrafico(metricas) {
    if (metricas.total === 0) {
        return "Nenhuma tarefa cadastrada ainda"
    }

    return `${metricas.total} tarefas distribuídas no quadro`
}

function criarDescricaoGrafico(metricas) {
    return `Distribuição das tarefas por status: ${metricas.todo} a fazer, ${metricas.doing} em andamento, ${metricas.done} concluídas.`
}
