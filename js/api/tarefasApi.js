import { API_URL } from "../utils/constants.js"

async function request(endpoint = "", options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        },
        ...options
    })

    if (!response.ok) {
        throw new Error(`Erro na API de tarefas: ${response.status}`)
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}

export function listarTarefas() {
    return request()
}

export function criarTarefa(tarefa) {
    return request("", {
        method: "POST",
        body: JSON.stringify(tarefa)
    })
}

export function atualizarTarefaApi(tarefa) {
    return request(`/${tarefa.id}`, {
        method: "PUT",
        body: JSON.stringify(tarefa)
    })
}

export async function excluirTarefaApi(id) {
    await request(`/${id}`, {
        method: "DELETE"
    })

    return true
}
