import { criarTarefa, atualizarTarefaApi, excluirTarefaApi } from "../../api/tarefasApi.js"
import { mostrarErro, limparMensagem } from "../../ui/feedback.js"

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
            return true
        } catch {
            mostrarErro(mensagem, "Nao foi possivel adicionar a tarefa")
            return false
        }
    }

    async function atualizar(tarefa) {
        try {
            const tarefaAtualizada = await atualizarTarefaApi(tarefa)
            setTarefas(getTarefas().map(function (item) {
                return item.id === tarefaAtualizada.id ? tarefaAtualizada : item
            }))
            limparMensagem(mensagem)
            renderizar()
        } catch {
            mostrarErro(mensagem, "Nao foi possivel atualizar a tarefa")
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
        } catch {
            setTarefas(tarefasAtuais)
            mostrarErro(mensagem, "Nao foi possivel excluir a tarefa")
            renderizar()
        }
    }

    return {
        adicionar,
        atualizar,
        excluir
    }
}
