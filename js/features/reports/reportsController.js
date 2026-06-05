import { listarTarefasUsuario } from "../../api/tarefasLocalApi.js"
import { limparMensagem, mostrarErro } from "../../ui/feedback.js"
import { renderizarRelatorios } from "../../ui/reportsView.js"
import { toastError } from "../../ui/toast.js"

export function criarReportsController(elements, getUsuarioAtual) {
    let carregando = false

    function carregarRelatorios() {
        if (carregando) {
            return
        }

        const usuario = getUsuarioAtual()

        if (usuario === null) {
            renderizarRelatorios([], elements.reports)
            return
        }

        carregando = true
        elements.reports.refreshButton.disabled = true
        elements.reports.refreshButton.textContent = "Atualizando..."

        try {
            renderizarRelatorios(listarTarefasUsuario(usuario), elements.reports)
            limparMensagem(elements.reports.message)
        } catch {
            mostrarErro(elements.reports.message, "Não foi possível carregar os relatórios")
            toastError("Erro ao carregar os relatórios.")
        } finally {
            carregando = false
            elements.reports.refreshButton.disabled = false
            elements.reports.refreshButton.textContent = "Atualizar"
        }
    }

    elements.reports.refreshButton.addEventListener("click", carregarRelatorios)

    return { carregarRelatorios }
}
