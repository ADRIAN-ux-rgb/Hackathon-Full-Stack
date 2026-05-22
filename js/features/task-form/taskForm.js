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
            status: TASK_STATUS.todo
        })

        if (adicionou) {
            elements.inputTarefa.value = ""
        }
    }

    elements.botaoAdicionar.addEventListener("click", adicionar)

    elements.inputTarefa.addEventListener("keydown", function (evento) {
        if (evento.key !== "Enter") {
            return
        }

        evento.preventDefault()
        adicionar()
    })
}
