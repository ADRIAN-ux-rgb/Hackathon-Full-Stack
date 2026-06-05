import { criarTarefaUsuario, atualizarTarefaUsuario, excluirTarefaUsuario } from "../../api/tarefasLocalApi.js"
import { mostrarErro, limparMensagem } from "../../ui/feedback.js"
import { toastError, toastInfo, toastSuccess } from "../../ui/toast.js"
import { normalizarStatus } from "../../utils/status.js"

export function criarTaskActions({ getTarefas, setTarefas, getUsuarioAtual, mensagem, renderizar }) {
    async function adicionar(tarefa) {
        if (tarefa === null) {
            mostrarErro(mensagem, "Digite o nome da tarefa")
            return false
        }

        const usuario = getUsuarioAtual()

        if (usuario === null) {
            mostrarErro(mensagem, "Faça login para adicionar tarefas")
            return false
        }

        try {
            const tarefaCriada = criarTarefaUsuario(usuario, tarefa)
            setTarefas([...getTarefas(), tarefaCriada])
            limparMensagem(mensagem)
            renderizar()
            toastSuccess("Tarefa criada com sucesso.")
            return true
        } catch {
            mostrarErro(mensagem, "Não foi possível adicionar a tarefa")
            toastError("Erro de API ao criar tarefa.")
            return false
        }
    }

    async function atualizar(tarefa) {
        const usuario = getUsuarioAtual()

        if (usuario === null) {
            mostrarErro(mensagem, "Faça login para atualizar tarefas")
            toastError("Sessão não encontrada.")
            return
        }

        const tarefasAtuais = getTarefas()
        const tarefaAnterior = tarefasAtuais.find(function (item) {
            return item.id === tarefa.id
        })

        setTarefas(tarefasAtuais.map(function (item) {
            return item.id === tarefa.id ? tarefa : item
        }))
        limparMensagem(mensagem)
        renderizar()

        try {
            const tarefaAtualizada = atualizarTarefaUsuario(usuario, tarefa)

            setTarefas(getTarefas().map(function (item) {
                return item.id === tarefaAtualizada.id ? tarefaAtualizada : item
            }))
            limparMensagem(mensagem)
            renderizar()
            mostrarToastAtualizacao(tarefaAnterior, tarefaAtualizada)
        } catch {
            setTarefas(tarefasAtuais)
            mostrarErro(mensagem, "Não foi possível atualizar a tarefa")
            toastError("Erro de API ao atualizar tarefa.")
            renderizar()
        }
    }

    async function excluir(tarefa) {
        const usuario = getUsuarioAtual()

        if (usuario === null) {
            mostrarErro(mensagem, "Faça login para excluir tarefas")
            toastError("Sessão não encontrada.")
            return
        }

        const tarefasAtuais = getTarefas()
        setTarefas(tarefasAtuais.filter(function (item) {
            return item.id !== tarefa.id
        }))
        renderizar()

        try {
            excluirTarefaUsuario(usuario, tarefa.id)
            limparMensagem(mensagem)
            toastSuccess("Tarefa excluída com sucesso.")
        } catch {
            setTarefas(tarefasAtuais)
            mostrarErro(mensagem, "Não foi possível excluir a tarefa")
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
