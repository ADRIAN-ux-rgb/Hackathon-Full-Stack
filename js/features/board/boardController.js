import { listarTarefasUsuario } from "../../api/tarefasLocalApi.js"
import { mostrarSkeletonBoard, renderizarBoard } from "../../ui/boardView.js"
import { mostrarErro, limparMensagem } from "../../ui/feedback.js"
import { toastError } from "../../ui/toast.js"
import { criarDragAndDrop } from "./dragAndDrop.js"
import { criarTaskActions } from "./taskActions.js"
import { criarTaskFilters } from "./taskFilters.js"

export function criarBoardController(elements, modals) {
    let tarefas = []
    let usuarioAtual = null
    let filtros

    const dragAndDrop = criarDragAndDrop(elements.listas, function (tarefa) {
        actions.atualizar(tarefa)
    })

    const handlers = {
        onDragStart: dragAndDrop.iniciar,
        onDragEnd: dragAndDrop.finalizar,
        onStatusChange(tarefa) {
            actions.atualizar(tarefa)
        },
        onEditRequest(tarefa) {
            modals.edicao.abrir(tarefa)
        },
        onDeleteRequest(tarefa) {
            modals.exclusao.abrir(tarefa)
        }
    }

    function renderizar() {
        const tarefasVisiveis = filtros === undefined
            ? tarefas
            : filtros.filtrar(tarefas)

        renderizarBoard(tarefasVisiveis, elements, handlers, {
            filtroAtivo: filtros !== undefined && filtros.temFiltroAtivo()
        })
    }

    filtros = criarTaskFilters(elements, renderizar)

    const actions = criarTaskActions({
        getTarefas() {
            return tarefas
        },
        setTarefas(novasTarefas) {
            tarefas = novasTarefas
        },
        getUsuarioAtual() {
            return usuarioAtual
        },
        mensagem: elements.mensagem,
        renderizar
    })

    async function carregarTarefas(usuario) {
        usuarioAtual = usuario || usuarioAtual

        if (usuarioAtual === null) {
            tarefas = []
            renderizar()
            return
        }

        mostrarSkeletonBoard(elements.listas)

        try {
            tarefas = listarTarefasUsuario(usuarioAtual)
            limparMensagem(elements.mensagem)
            renderizar()
        } catch {
            mostrarErro(elements.mensagem, "Não foi possível carregar as tarefas")
            toastError("Erro ao carregar tarefas.")
            renderizar()
        }
    }

    return {
        carregarTarefas,
        adicionarTarefa: actions.adicionar,
        editarTarefa: actions.atualizar,
        confirmarExclusao: actions.excluir
    }
}
