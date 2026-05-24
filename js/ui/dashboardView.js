import { TASK_STATUS, normalizarStatus } from "../utils/status.js"

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

    return {
        total,
        todo: totais[TASK_STATUS.todo],
        doing: totais[TASK_STATUS.doing],
        done: totais[TASK_STATUS.done],
        percentualConcluido
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
