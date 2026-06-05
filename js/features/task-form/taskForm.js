import { TASK_STATUS } from "../../utils/status.js"
import { TASK_TYPES, normalizarTipoTarefa } from "../../utils/taskTypes.js"

export function inicializarTaskForm(elements, onSubmit) {
    const dateField = elements.inputDataLimite.closest("[data-date-picker]")
    const priorityField = elements.inputPrioridade.closest(".task-priority-field")
    const composer = elements.formularioTarefa.closest(".task-composer")
    const filters = document.querySelector(".task-filters")

    if (composer && filters) {
        filters.insertAdjacentElement("afterend", composer)
    }

    function aplicarEstadoPainel(aberto) {
        elements.formularioTarefa.classList.toggle("task-form-open", aberto)
        composer?.classList.toggle("task-composer-open", aberto)
        elements.formularioTarefa.setAttribute("aria-hidden", String(!aberto))
        elements.botaoAbrirFormulario.setAttribute("aria-expanded", String(aberto))
        elements.botaoAbrirFormulario.classList.toggle("hidden", aberto)

        if (aberto) {
            requestAnimationFrame(function () {
                elements.inputTarefa.focus()
            })
        }
    }

    function limparFormulario() {
        elements.inputTarefa.value = ""
        elements.inputTipo.value = TASK_TYPES.feature
        elements.inputPrioridade.value = "media"
        elements.inputDataLimite.value = ""
        atualizarEstiloPrioridade()
    }

    function fecharFormulario(limpar = false) {
        if (limpar) {
            limparFormulario()
        }

        aplicarEstadoPainel(false)
    }

    function atualizarEstiloPrioridade() {
        if (priorityField !== null) {
            priorityField.dataset.priority = elements.inputPrioridade.value
        }
    }

    function abrirSeletorData() {
        elements.inputDataLimite.focus({ preventScroll: true })

        if (typeof elements.inputDataLimite.showPicker === "function") {
            try {
                elements.inputDataLimite.showPicker()
            } catch {
                return
            }
        }
    }

    if (dateField !== null) {
        dateField.addEventListener("click", function (evento) {
            if (evento.target !== elements.inputDataLimite) {
                abrirSeletorData()
            }
        })

        dateField.addEventListener("keydown", function (evento) {
            if (evento.key !== "Enter" && evento.key !== " ") {
                return
            }

            evento.preventDefault()
            abrirSeletorData()
        })
    }

    elements.inputPrioridade.addEventListener("change", atualizarEstiloPrioridade)
    atualizarEstiloPrioridade()

    elements.botaoAbrirFormulario.addEventListener("click", function () {
        aplicarEstadoPainel(true)
    })

    elements.botaoCancelarTarefa.addEventListener("click", function () {
        fecharFormulario(true)
    })

    async function adicionar() {
        const texto = elements.inputTarefa.value.trim()

        if (texto === "") {
            await onSubmit(null)
            return
        }

        const adicionou = await onSubmit({
            nome: texto,
            status: TASK_STATUS.todo,
            tipo: normalizarTipoTarefa(elements.inputTipo.value),
            prioridade: elements.inputPrioridade.value,
            dataCriacao: new Date().toISOString(),
            dataLimite: elements.inputDataLimite.value || null
        })

        if (adicionou) {
            limparFormulario()
            fecharFormulario()
        }
    }

    elements.botaoAdicionar.addEventListener("click", function (evento) {
        evento.preventDefault()
        adicionar()
    })

    elements.inputTarefa.addEventListener("keydown", function (evento) {
        if (evento.key !== "Enter") {
            return
        }

        evento.preventDefault()
        adicionar()
    })

    elements.formularioTarefa.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape") {
            fecharFormulario()
            elements.botaoAbrirFormulario.focus()
        }
    })

    aplicarEstadoPainel(false)
}
