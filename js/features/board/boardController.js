import { listarTarefas } from "../../api/tarefasApi.js"
import { renderizarBoard } from "../../ui/boardView.js"
import { mostrarErro, limparMensagem } from "../../ui/feedback.js"
import { criarDragAndDrop } from "./dragAndDrop.js"
import { criarTaskActions } from "./taskActions.js"

export function criarBoardController(elements, modal) {
    let tarefas = []

    const dragAndDrop = criarDragAndDrop(elements.listas, function (tarefa) {
        actions.atualizar(tarefa)
    })

    const handlers = {
        onDragStart: dragAndDrop.iniciar,
        onDragEnd: dragAndDrop.finalizar,
        onStatusChange(tarefa) {
            actions.atualizar(tarefa)
        },
        onEdit(tarefa) {
            actions.atualizar(tarefa)
        },
        onDeleteRequest(tarefa) {
            modal.abrir(tarefa)
        }
    }

    function renderizar() {
        renderizarBoard(tarefas, elements, handlers)
    }

    const actions = criarTaskActions({
        getTarefas() {
            return tarefas
        },
        setTarefas(novasTarefas) {
            tarefas = novasTarefas
        },
        mensagem: elements.mensagem,
        renderizar
    })

    async function carregarTarefas() {
        try {
            tarefas = await listarTarefas()
            limparMensagem(elements.mensagem)
            renderizar()
        } catch {
            mostrarErro(elements.mensagem, "Nao foi possivel carregar as tarefas")
            renderizar()
        }
    }

    return {
        carregarTarefas,
        adicionarTarefa: actions.adicionar,
        confirmarExclusao: actions.excluir
    }
}
