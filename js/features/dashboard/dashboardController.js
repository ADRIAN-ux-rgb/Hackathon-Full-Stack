import { listarTarefas } from "../../api/tarefasApi.js"
import { renderizarDashboard } from "../../ui/dashboardView.js"
import { mostrarErro, limparMensagem } from "../../ui/feedback.js"
import { toastError } from "../../ui/toast.js"

export function criarDashboardController(elements) {
    let carregando = false

    async function carregarDashboard() {
        if (carregando) {
            return
        }

        carregando = true
        elements.dashboard.refreshButton.disabled = true
        elements.dashboard.refreshButton.textContent = "Atualizando..."

        try {
            const tarefas = await listarTarefas()
            renderizarDashboard(tarefas, elements.dashboard)
            limparMensagem(elements.dashboard.message)
        } catch {
            mostrarErro(elements.dashboard.message, "Nao foi possivel carregar o dashboard")
            toastError("Erro de API ao carregar o dashboard.")
        } finally {
            carregando = false
            elements.dashboard.refreshButton.disabled = false
            elements.dashboard.refreshButton.textContent = "Atualizar"
        }
    }

    elements.dashboard.refreshButton.addEventListener("click", carregarDashboard)

    return {
        carregarDashboard
    }
}
