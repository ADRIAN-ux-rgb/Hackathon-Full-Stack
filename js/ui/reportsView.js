import { TASK_STATUS, normalizarStatus } from "../utils/status.js"
import { TASK_TYPE_VALUES, criarClasseTipoTarefa, normalizarTipoTarefa } from "../utils/taskTypes.js"

export function renderizarRelatorios(tarefas, elements) {
    const hoje = inicioDoDia(new Date())
    const inicioSemana = adicionarDias(hoje, -6)
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimProximos = adicionarDias(hoje, 7)

    const criadasSemana = tarefas.filter(tarefa => dataCriacaoValida(tarefa) >= inicioSemana)
    const criadasMes = tarefas.filter(tarefa => dataCriacaoValida(tarefa) >= inicioMes)
    const concluidasSemana = criadasSemana.filter(estaConcluida)
    const concluidasMes = criadasMes.filter(estaConcluida)
    const atrasadas = tarefas.filter(tarefa => estaPendente(tarefa) && dataLimiteValida(tarefa) < hoje)
    const atrasadasSemana = atrasadas.filter(tarefa => dataLimiteValida(tarefa) >= inicioSemana)
    const proximas = tarefas.filter(function (tarefa) {
        const limite = dataLimiteValida(tarefa)
        return estaPendente(tarefa) && limite >= hoje && limite <= fimProximos
    })

    elements.weekCreated.textContent = criadasSemana.length
    elements.weekDone.textContent = concluidasSemana.length
    elements.weekOverdue.textContent = atrasadasSemana.length
    elements.monthCreated.textContent = criadasMes.length
    elements.monthDone.textContent = concluidasMes.length
    elements.monthRate.textContent = criarTaxa(concluidasMes.length, criadasMes.length)

    renderizarTiposConcluidos(tarefas, elements.typesList)
    renderizarListaTarefas(atrasadas, elements.overdueList, "Nenhuma tarefa em atraso")
    renderizarListaTarefas(proximas, elements.upcomingList, "Nenhum vencimento nos próximos 7 dias")
}

function renderizarTiposConcluidos(tarefas, container) {
    const contadores = TASK_TYPE_VALUES.reduce(function (acc, tipo) {
        acc[tipo] = 0
        return acc
    }, {})

    tarefas.filter(estaConcluida).forEach(function (tarefa) {
        contadores[normalizarTipoTarefa(tarefa.tipo)] += 1
    })

    const labels = {
        BUG: "Bugs resolvidos",
        FEATURE: "Features entregues",
        REFACTOR: "Refactors concluídos",
        TEST: "Testes concluídos",
        DOC: "Documentações concluídas",
        DEPLOY: "Deploys realizados",
        HOTFIX: "Hotfixes concluídos"
    }

    container.innerHTML = ""

    TASK_TYPE_VALUES.forEach(function (tipo) {
        const item = document.createElement("article")
        item.classList.add("reports-type-item")

        const badge = document.createElement("span")
        badge.classList.add("task-type", criarClasseTipoTarefa(tipo))
        badge.textContent = tipo

        const copy = document.createElement("div")
        const label = document.createElement("span")
        label.textContent = labels[tipo]
        const total = document.createElement("strong")
        total.textContent = contadores[tipo]
        copy.appendChild(label)
        copy.appendChild(total)

        item.appendChild(badge)
        item.appendChild(copy)
        container.appendChild(item)
    })
}

function renderizarListaTarefas(tarefas, container, mensagemVazia) {
    container.innerHTML = ""

    if (tarefas.length === 0) {
        const empty = document.createElement("div")
        empty.classList.add("reports-empty")
        empty.textContent = mensagemVazia
        container.appendChild(empty)
        return
    }

    tarefas
        .slice()
        .sort((a, b) => dataLimiteValida(a) - dataLimiteValida(b))
        .forEach(function (tarefa) {
            const item = document.createElement("article")
            item.classList.add("reports-task-item")

            const copy = document.createElement("div")
            const nome = document.createElement("strong")
            nome.textContent = tarefa.nome
            const data = document.createElement("span")
            data.textContent = formatarData(tarefa.dataLimite)
            copy.appendChild(nome)
            copy.appendChild(data)

            const badge = document.createElement("span")
            const tipo = normalizarTipoTarefa(tarefa.tipo)
            badge.classList.add("task-type", criarClasseTipoTarefa(tipo))
            badge.textContent = tipo

            item.appendChild(copy)
            item.appendChild(badge)
            container.appendChild(item)
        })
}

function criarTaxa(concluidas, total) {
    return total === 0 ? "0%" : `${Math.round((concluidas / total) * 100)}%`
}

function estaConcluida(tarefa) {
    return normalizarStatus(tarefa.status) === TASK_STATUS.done
}

function estaPendente(tarefa) {
    return !estaConcluida(tarefa) && Number.isFinite(dataLimiteValida(tarefa).getTime())
}

function dataCriacaoValida(tarefa) {
    const data = new Date(tarefa.dataCriacao)
    return Number.isFinite(data.getTime()) ? inicioDoDia(data) : new Date(0)
}

function dataLimiteValida(tarefa) {
    const partes = String(tarefa.dataLimite || "").split("-").map(Number)

    if (partes.length !== 3 || partes.some(Number.isNaN)) {
        return new Date(Number.NaN)
    }

    return new Date(partes[0], partes[1] - 1, partes[2])
}

function inicioDoDia(data) {
    return new Date(data.getFullYear(), data.getMonth(), data.getDate())
}

function adicionarDias(data, dias) {
    const resultado = new Date(data)
    resultado.setDate(resultado.getDate() + dias)
    return resultado
}

function formatarData(dataLimite) {
    const partes = String(dataLimite || "").split("-")
    return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : "Sem prazo"
}
