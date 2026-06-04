import { elements } from "./ui/dom.js"
import { criarConfirmModal } from "./features/modal/confirmModal.js"
import { criarEditModal } from "./features/modal/editModal.js"
import { inicializarDarkMode } from "./features/theme/darkMode.js"
import { inicializarTaskForm } from "./features/task-form/taskForm.js"
import { criarBoardController } from "./features/board/boardController.js"
import { criarDashboardController } from "./features/dashboard/dashboardController.js"
import { carregarUsuarioLogado, criarProfileController } from "./features/profile/profileController.js"

function inicializarAplicacao() {
    const usuarioLogado = carregarUsuarioLogado()

    if (usuarioLogado === null) {
        window.location.href = "login.html"
        return
    }

    inicializarDarkMode(elements.corda)
    inicializarSidebarRecolhivel(elements.sidebar)

    let boardController

    const modalExclusao = criarConfirmModal(elements.exclusao, async function (tarefa) {
        await boardController.confirmarExclusao(tarefa)
    })

    const modalEdicao = criarEditModal(elements.edicao, async function (tarefa) {
        await boardController.editarTarefa(tarefa)
    })

    boardController = criarBoardController(elements, {
        exclusao: modalExclusao,
        edicao: modalEdicao
    })
    const dashboardController = criarDashboardController(elements, function () {
        return usuarioLogado
    })
    const profileController = criarProfileController(elements, function () {
        return usuarioLogado
    })

    inicializarTaskForm(elements, boardController.adicionarTarefa)
    inicializarNavegacao(elements, {
        dashboard: dashboardController,
        profile: profileController
    })
    abrirAppAutenticado(usuarioLogado, boardController, profileController)
}

function iniciarModoApp() {
    document.body.classList.remove("auth-mode")
}

function inicializarSidebarRecolhivel(sidebar) {
    const storageKey = "kanban_sidebar_collapsed"

    if (sidebar.container === null || sidebar.toggleButton === null) {
        return
    }

    function estaRecolhida() {
        return document.body.classList.contains("sidebar-collapsed")
    }

    function aplicarEstado(recolhida) {
        document.body.classList.toggle("sidebar-collapsed", recolhida)
        sidebar.toggleButton.setAttribute("aria-expanded", String(!recolhida))
        sidebar.toggleButton.setAttribute("aria-label", recolhida ? "Expandir sidebar" : "Recolher sidebar")

        try {
            localStorage.setItem(storageKey, String(recolhida))
        } catch {
            return
        }
    }

    try {
        aplicarEstado(localStorage.getItem(storageKey) === "true")
    } catch {
        aplicarEstado(false)
    }

    sidebar.toggleButton.addEventListener("click", function (event) {
        event.stopPropagation()
        aplicarEstado(!estaRecolhida())
    })

    sidebar.container.addEventListener("click", function () {
        if (estaRecolhida()) {
            aplicarEstado(false)
        }
    })
}

function abrirAppAutenticado(usuario, boardController, profileController) {
    profileController.carregarResumoSidebar()
    iniciarModoApp()
    ativarView(elements, "tarefas")
    boardController.carregarTarefas(usuario)
}

function inicializarNavegacao(elements, controllers) {
    elements.menuItems.forEach(function (item) {
        item.addEventListener("click", function () {
            const view = item.dataset.view

            ativarView(elements, view)
            ativarMiniPerfil(false)

            if (view === "dashboard") {
                controllers.dashboard.carregarDashboard()
            }
        })
    })

    elements.profile.mini.addEventListener("click", function () {
        abrirPerfil(elements, controllers.profile)
    })

    elements.profile.mini.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault()
            abrirPerfil(elements, controllers.profile)
        }
    })
}

function abrirPerfil(elements, profileController) {
    ativarView(elements, "profile")
    ativarMiniPerfil(true)
    profileController.carregarPerfil()
}

function ativarMiniPerfil(ativo) {
    elements.profile.mini.classList.toggle("ativo", ativo)
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
