import { elements } from "./ui/dom.js"
import { criarConfirmModal } from "./features/modal/confirmModal.js"
import { inicializarDarkMode } from "./features/theme/darkMode.js"
import { inicializarTaskForm } from "./features/task-form/taskForm.js"
import { criarBoardController } from "./features/board/boardController.js"
import { criarDashboardController } from "./features/dashboard/dashboardController.js"

function inicializarAplicacao() {
    inicializarDarkMode(elements.corda)

    let boardController

    const modal = criarConfirmModal(elements, async function (tarefa) {
        await boardController.confirmarExclusao(tarefa)
    })

    boardController = criarBoardController(elements, modal)
    const dashboardController = criarDashboardController(elements)

    inicializarTaskForm(elements, boardController.adicionarTarefa)
    inicializarNavegacao(elements, dashboardController)
    boardController.carregarTarefas()
}

function inicializarNavegacao(elements, dashboardController) {
    elements.menuItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const view = item.dataset.view

            ativarView(elements, view)

            if (view === "dashboard") {
                dashboardController.carregarDashboard()
            }
        })
    })
}

function ativarView(elements, view) {
    elements.menuItems.forEach(function (item) {
        item.classList.toggle("ativo", item.dataset.view === view)
    })

    elements.views.forEach(function (panel) {
        panel.classList.toggle("hidden", panel.dataset.viewPanel !== view)
    })
}

inicializarAplicacao()
