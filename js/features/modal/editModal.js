export function criarEditModal(elements, onSave) {
    let tarefaSelecionada = null

    function abrir(tarefa) {
        tarefaSelecionada = tarefa
        elements.input.value = tarefa.nome
        elements.error.textContent = ""
        elements.modal.classList.remove("hidden")
        elements.input.focus()
        elements.input.select()
    }

    function fechar() {
        elements.modal.classList.add("hidden")
        elements.input.value = ""
        elements.error.textContent = ""
        tarefaSelecionada = null
    }

    async function salvar() {
        if (tarefaSelecionada === null) {
            return
        }

        const nome = elements.input.value.trim()

        if (nome === "") {
            elements.error.textContent = "Digite o nome da tarefa"
            elements.input.focus()
            return
        }

        const tarefa = {
            ...tarefaSelecionada,
            nome
        }

        fechar()
        await onSave(tarefa)
    }

    elements.btnCancelar.addEventListener("click", function (event) {
        event.preventDefault()
        fechar()
    })

    elements.btnSalvar.addEventListener("click", function (event) {
        event.preventDefault()
        salvar()
    })

    elements.input.addEventListener("input", function () {
        if (elements.input.value.trim() !== "") {
            elements.error.textContent = ""
        }
    })

    elements.input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault()
            salvar()
        }

        if (event.key === "Escape") {
            fechar()
        }
    })

    elements.modal.addEventListener("click", function (event) {
        if (event.target === elements.modal) {
            fechar()
        }
    })

    return {
        abrir,
        fechar
    }
}
