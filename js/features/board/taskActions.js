import { criarTarefa, atualizarTarefaApi, excluirTarefaApi } from "../../api/tarefasApi.js"
import { mostrarErro, limparMensagem } from "../../ui/feedback.js"
import { toastError, toastInfo, toastSuccess } from "../../ui/toast.js"
import { normalizarStatus } from "../../utils/status.js"

export function criarTaskActions({ getTarefas, setTarefas, mensagem, renderizar }) {
    async function adicionar(tarefa) {
        if (tarefa === null) {
            mostrarErro(mensagem, "Digite o nome da tarefa")
            return false
        }

        try {
            const tarefaCriada = await criarTarefa(tarefa)
            setTarefas([...getTarefas(), tarefaCriada])
            limparMensagem(mensagem)
            renderizar()
            toastSuccess("Tarefa criada com sucesso.")
            return true
        } catch {
            mostrarErro(mensagem, "Nao foi possivel adicionar a tarefa")
            toastError("Erro de API ao criar tarefa.")
            return false
        }
    }

    async function atualizar(tarefa) {
        try {
            const tarefaAnterior = getTarefas().find(function (item) {
                return item.id === tarefa.id
            })
            const tarefaAtualizada = await atualizarTarefaApi(tarefa)

            setTarefas(getTarefas().map(function (item) {
                return item.id === tarefaAtualizada.id ? tarefaAtualizada : item
            }))
            limparMensagem(mensagem)
            renderizar()
            mostrarToastAtualizacao(tarefaAnterior, tarefaAtualizada)
        } catch {
            mostrarErro(mensagem, "Nao foi possivel atualizar a tarefa")
            toastError("Erro de API ao atualizar tarefa.")
        }
    }

    async function excluir(tarefa) {
        const tarefasAtuais = getTarefas()
        setTarefas(tarefasAtuais.filter(function (item) {
            return item.id !== tarefa.id
        }))
        renderizar()

        try {
            await excluirTarefaApi(tarefa.id)
            limparMensagem(mensagem)
            toastSuccess("Tarefa excluida com sucesso.")
        } catch {
            setTarefas(tarefasAtuais)
            mostrarErro(mensagem, "Nao foi possivel excluir a tarefa")
            toastError("Erro de API ao excluir tarefa.")
            renderizar()
        }
    }

    return {
        adicionar,
        atualizar,
        excluir
    }
}

function mostrarToastAtualizacao(tarefaAnterior, tarefaAtualizada) {
    if (tarefaAnterior === undefined) {
        toastInfo("Tarefa atualizada.")
        return
    }

    const statusAnterior = normalizarStatus(tarefaAnterior.status)
    const statusAtual = normalizarStatus(tarefaAtualizada.status)

    if (statusAnterior !== statusAtual) {
        toastInfo("Tarefa movida entre colunas.")
        return
    }

    if (tarefaAnterior.nome !== tarefaAtualizada.nome) {
        toastSuccess("Tarefa editada com sucesso.")
        return
    }

    toastInfo("Tarefa atualizada.")
}
