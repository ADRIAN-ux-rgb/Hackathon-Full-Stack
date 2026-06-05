export const elements = {
    menuItems: document.querySelectorAll("[data-view]"),
    views: document.querySelectorAll("[data-view-panel]"),
    sidebar: {
        container: document.getElementById("sidebar"),
        toggleButton: document.getElementById("sidebar-toggle")
    },
    exclusao: {
        modal: document.getElementById("modal-confirmacao"),
        btnCancelar: document.getElementById("btn-cancelar"),
        btnConfirmar: document.getElementById("btn-confirmar")
    },
    edicao: {
        modal: document.getElementById("modal-edicao"),
        input: document.getElementById("edit-task-input"),
        error: document.getElementById("edit-task-error"),
        btnCancelar: document.getElementById("btn-cancelar-edicao"),
        btnSalvar: document.getElementById("btn-salvar-edicao")
    },
    corda: document.getElementById("corda"),
    formularioTarefa: document.getElementById("formulario"),
    botaoAbrirFormulario: document.getElementById("btn-abrir-formulario"),
    botaoCancelarTarefa: document.getElementById("btn-cancelar-tarefa"),
    botaoAdicionar: document.getElementById("btn-adicionar"),
    inputTarefa: document.getElementById("input-tarefa"),
    inputTipo: document.getElementById("input-tipo"),
    inputPrioridade: document.getElementById("input-prioridade"),
    inputDataLimite: document.getElementById("input-data-limite"),
    mensagem: document.getElementById("mensagem"),
    filtros: {
        busca: document.getElementById("task-search-input"),
        statusOptions: document.querySelectorAll("[data-filter-status]"),
        limpar: document.getElementById("task-clear-filters")
    },
    listas: {
        todo: document.getElementById("lista-todo"),
        doing: document.getElementById("lista-doing"),
        done: document.getElementById("lista-done")
    },
    titulos: {
        todo: document.querySelector("#coluna-todo h2"),
        doing: document.querySelector("#coluna-doing h2"),
        done: document.querySelector("#coluna-done h2")
    },
    dashboard: {
        total: document.getElementById("dashboard-total"),
        todo: document.getElementById("dashboard-todo"),
        doing: document.getElementById("dashboard-doing"),
        done: document.getElementById("dashboard-done"),
        percent: document.getElementById("dashboard-percent"),
        progressBar: document.getElementById("dashboard-progress-bar"),
        progressLabel: document.getElementById("dashboard-progress-label"),
        chartLabel: document.getElementById("dashboard-chart-label"),
        pieChart: document.getElementById("dashboard-pie-chart"),
        pieTotal: document.getElementById("dashboard-pie-total"),
        pieSegments: {
            todo: document.getElementById("dashboard-pie-todo"),
            doing: document.getElementById("dashboard-pie-doing"),
            done: document.getElementById("dashboard-pie-done")
        },
        legend: {
            todo: document.getElementById("dashboard-legend-todo"),
            doing: document.getElementById("dashboard-legend-doing"),
            done: document.getElementById("dashboard-legend-done")
        },
        priorityBars: {
            alta: document.getElementById("dashboard-priority-high"),
            media: document.getElementById("dashboard-priority-medium"),
            baixa: document.getElementById("dashboard-priority-low")
        },
        priorityValues: {
            alta: document.getElementById("dashboard-priority-high-value"),
            media: document.getElementById("dashboard-priority-medium-value"),
            baixa: document.getElementById("dashboard-priority-low-value")
        },
        deadlinesList: document.getElementById("dashboard-deadlines-list"),
        typesList: document.getElementById("dashboard-types-list"),
        refreshButton: document.getElementById("dashboard-refresh"),
        message: document.getElementById("dashboard-message")
    },
    reports: {
        weekCreated: document.getElementById("reports-week-created"),
        weekDone: document.getElementById("reports-week-done"),
        weekOverdue: document.getElementById("reports-week-overdue"),
        monthCreated: document.getElementById("reports-month-created"),
        monthDone: document.getElementById("reports-month-done"),
        monthRate: document.getElementById("reports-month-rate"),
        typesList: document.getElementById("reports-types-list"),
        overdueList: document.getElementById("reports-overdue-list"),
        upcomingList: document.getElementById("reports-upcoming-list"),
        refreshButton: document.getElementById("reports-refresh"),
        message: document.getElementById("reports-message")
    },
    auth: {
        views: document.querySelectorAll("[data-auth-view]"),
        forms: document.querySelectorAll("[data-auth-form]"),
        switchButtons: document.querySelectorAll("[data-auth-target]"),
        feedbacks: {
            login: document.querySelector('[data-auth-feedback="login"]'),
            cadastro: document.querySelector('[data-auth-feedback="cadastro"]')
        }
    },
    profile: {
        mini: document.getElementById("profile-mini"),
        name: document.getElementById("profile-name"),
        email: document.getElementById("profile-email"),
        avatar: document.getElementById("profile-avatar"),
        pageAvatar: document.getElementById("profile-avatar-large"),
        pageName: document.getElementById("profile-page-name"),
        pageEmail: document.getElementById("profile-page-email"),
        total: document.getElementById("profile-total-tasks"),
        todo: document.getElementById("profile-todo-tasks"),
        doing: document.getElementById("profile-doing-tasks"),
        done: document.getElementById("profile-done-tasks"),
        logoutButton: document.getElementById("profile-logout")
    }
}
