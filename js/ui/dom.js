export const elements = {
    menuItems: document.querySelectorAll("[data-view]"),
    views: document.querySelectorAll("[data-view-panel]"),
    modal: document.getElementById("modal-confirmacao"),
    btnCancelar: document.getElementById("btn-cancelar"),
    btnConfirmar: document.getElementById("btn-confirmar"),
    corda: document.getElementById("corda"),
    botaoAdicionar: document.getElementById("btn-adicionar"),
    inputTarefa: document.getElementById("input-tarefa"),
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
        refreshButton: document.getElementById("dashboard-refresh"),
        message: document.getElementById("dashboard-message")
    }
}
