import { normalizarStatus } from "../../utils/status.js"

const STATUS_TODOS = "all"

export function criarTaskFilters(elements, onChange) {
    const estado = {
        busca: "",
        status: STATUS_TODOS
    }

    elements.filtros.busca.addEventListener("input", function () {
        estado.busca = elements.filtros.busca.value.trim().toLowerCase()
        onChange()
    })

    elements.filtros.statusOptions.forEach(function (option) {
        option.addEventListener("click", function () {
            estado.status = option.dataset.filterStatus
            atualizarStatusAtivo(elements, estado.status)
            onChange()
        })
    })

    elements.filtros.limpar.addEventListener("click", function () {
        estado.busca = ""
        estado.status = STATUS_TODOS
        elements.filtros.busca.value = ""
        atualizarStatusAtivo(elements, estado.status)
        onChange()
    })

    return {
        filtrar(tarefas) {
            return filtrarTarefas(tarefas, estado)
        },
        getEstado() {
            return { ...estado }
        },
        temFiltroAtivo() {
            return estado.busca !== "" || estado.status !== STATUS_TODOS
        }
    }
}

export function filtrarTarefas(tarefas, filtros) {
    return tarefas.filter(function (tarefa) {
        const nome = String(tarefa.nome || "").toLowerCase()
        const status = normalizarStatus(tarefa.status)
        const passaBusca = filtros.busca === "" || nome.includes(filtros.busca)
        const passaStatus = filtros.status === STATUS_TODOS || status === filtros.status

        return passaBusca && passaStatus
    })
}

function atualizarStatusAtivo(elements, statusAtivo) {
    elements.filtros.statusOptions.forEach(function (option) {
        option.classList.toggle("ativo", option.dataset.filterStatus === statusAtivo)
    })
}
