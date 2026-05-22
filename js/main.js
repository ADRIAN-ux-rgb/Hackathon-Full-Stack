import { elements } from "./ui/dom.js"
import { criarConfirmModal } from "./features/modal/confirmModal.js"
import { inicializarDarkMode } from "./features/theme/darkMode.js"
import { inicializarTaskForm } from "./features/task-form/taskForm.js"
import { criarBoardController } from "./features/board/boardController.js"

function inicializarAplicacao() {
    inicializarDarkMode(elements.corda)

    let boardController

    const modal = criarConfirmModal(elements, async function (tarefa) {
        await boardController.confirmarExclusao(tarefa)
    })

    boardController = criarBoardController(elements, modal)

    inicializarTaskForm(elements, boardController.adicionarTarefa)
    boardController.carregarTarefas()
}

inicializarAplicacao()
