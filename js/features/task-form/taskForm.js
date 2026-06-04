import { TASK_STATUS } from "../../utils/status.js"

export function inicializarTaskForm(elements, onSubmit) {
    async function adicionar() {
        const texto = elements.inputTarefa.value.trim()

        if (texto === "") {
            await onSubmit(null)
            return
        }

        const adicionou = await onSubmit({
            nome: texto,
            status: TASK_STATUS.todo,
            prioridade: elements.inputPrioridade.value,
            dataCriacao: new Date().toISOString(),
            dataLimite: elements.inputDataLimite.value || null
        })

        if (adicionou) {
            elements.inputTarefa.value = ""
            elements.inputPrioridade.value = "media"
            elements.inputDataLimite.value = ""
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
}
