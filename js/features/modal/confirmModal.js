export function criarConfirmModal(elements, onConfirm) {
    let tarefaSelecionada = null

    function abrir(tarefa) {
        tarefaSelecionada = tarefa
        elements.modal.classList.remove("hidden")
    }

    function fechar() {
        elements.modal.classList.add("hidden")
        tarefaSelecionada = null
    }

    elements.btnCancelar.addEventListener("click", function (event) {
        event.preventDefault()
        fechar()
    })

    elements.btnConfirmar.addEventListener("click", async function (event) {
        event.preventDefault()

        if (tarefaSelecionada === null) {
            return
        }

        const tarefa = tarefaSelecionada
        fechar()
        await onConfirm(tarefa)
    })

    return {
        abrir,
        fechar
    }
}
