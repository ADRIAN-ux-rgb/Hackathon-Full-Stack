// ELEMENTOS HTML
const modal = document.getElementById("modal-confirmacao")
const btnCancelar = document.getElementById("btn-cancelar")
const btnConfirmar = document.getElementById("btn-confirmar")

const corda = document.getElementById("corda")
const botao = document.getElementById("btn-adicionar")
console.log("Botão encontrado:", botao)

const input = document.getElementById("input-tarefa")
const mensagem = document.getElementById("mensagem")

const listaTodo = document.getElementById("lista-todo")
const listaDoing = document.getElementById("lista-doing")
const listaDone = document.getElementById("lista-done")

const tituloTodo = document.querySelector("#coluna-todo h2")
const tituloDoing = document.querySelector("#coluna-doing h2")
const tituloDone = document.querySelector("#coluna-done h2")

const API_URL = "http://localhost:5088/api/tarefas"

// DADOS
let tarefas = []
let tarefaArrastada = null
let tarefaParaExcluir = null

// FUNÇÕES
function atualizarContadores() {
    const totalTodo = tarefas.filter(tarefa => tarefa.status === "todo").length
    const totalDoing = tarefas.filter(tarefa => tarefa.status === "doing").length
    const totalDone = tarefas.filter(tarefa => tarefa.status === "done").length

    tituloTodo.innerHTML = `A Fazer <span class="contador">${totalTodo}</span>`
    tituloDoing.innerHTML = `Em Andamento <span class="contador contador-doing">${totalDoing}</span>`
    tituloDone.innerHTML = `Concluído <span class="contador contador-done">${totalDone}</span>`
}

function criarItemNaTela(tarefa) {
    const item = document.createElement("li")
    item.dataset.id = tarefa.id
    item.draggable = true

    item.addEventListener("dragstart", function () {
        tarefaArrastada = tarefa
    })

    item.addEventListener("dragend", function () {
        tarefaArrastada = null
    })

    const texto = document.createElement("span")
    texto.textContent = tarefa.nome

    const info = document.createElement("div")
    info.classList.add("task-info")

    const prioridade = document.createElement("small")
    prioridade.textContent = "Alta prioridade"

    const data = document.createElement("small")
    data.textContent = "Hoje"

    info.appendChild(prioridade)
    info.appendChild(data)

    const botaoTodo = document.createElement("button")
    botaoTodo.textContent = "A Fazer"
    botaoTodo.classList.add("btn-status")
    botaoTodo.addEventListener("click", function () {
        tarefa.status = "todo"
        atualizarTarefa(tarefa)
    })

    const botaoDoing = document.createElement("button")
    botaoDoing.textContent = "Em Andamento"
    botaoDoing.classList.add("btn-status")
    botaoDoing.addEventListener("click", function () {
        tarefa.status = "doing"
        atualizarTarefa(tarefa)
    })

    const botaoDone = document.createElement("button")
    botaoDone.textContent = "Concluído"
    botaoDone.classList.add("btn-status")
    botaoDone.addEventListener("click", function () {
        tarefa.status = "done"
        atualizarTarefa(tarefa)
    })

    const botaoEditar = document.createElement("button")
    botaoEditar.textContent = "Editar"
    botaoEditar.classList.add("btn-editar")
    botaoEditar.addEventListener("click", function () {
        const novoTexto = prompt("Editar tarefa:", tarefa.nome)

        if (novoTexto === null || novoTexto.trim() === "") {
            return
        }

        tarefa.nome = novoTexto.trim()
        atualizarTarefa(tarefa)
    })

    const botaoExcluir = document.createElement("button")
    botaoExcluir.textContent = "Excluir"
    botaoExcluir.classList.add("btn-excluir")
    botaoExcluir.addEventListener("click", function () {
        tarefaParaExcluir = {
            id: tarefa.id,
            elemento: item
        }

        modal.classList.remove("hidden")
    })

    const areaBotoes = document.createElement("div")
    areaBotoes.classList.add("area-botoes")

    const topo = document.createElement("div")
    topo.style.display = "flex"
    topo.style.justifyContent = "space-between"
    topo.style.alignItems = "center"
    topo.style.gap = "10px"

    topo.appendChild(texto)


    item.appendChild(topo)
    item.appendChild(info)

    if (tarefa.status !== "todo") {
        areaBotoes.appendChild(botaoTodo)
    }

    if (tarefa.status !== "doing") {
        areaBotoes.appendChild(botaoDoing)
    }

    if (tarefa.status !== "done") {
        areaBotoes.appendChild(botaoDone)
    }

    areaBotoes.appendChild(botaoEditar)
    areaBotoes.appendChild(botaoExcluir)

    item.appendChild(areaBotoes)

    if (tarefa.status === "todo") {
        listaTodo.appendChild(item)
    }

    if (tarefa.status === "doing") {
        listaDoing.appendChild(item)
    }

    if (tarefa.status === "done") {
        listaDone.appendChild(item)
    }

    atualizarContadores()
}

function removerItemDaTela(id) {
    const item = document.querySelector(`li[data-id="${id}"]`)

    if (item !== null) {
        item.remove()
    }
}

function substituirItemNaTela(tarefa) {
    removerItemDaTela(tarefa.id)
    criarItemNaTela(tarefa)
}

async function buscarTarefas() {
    const resposta = await fetch(API_URL)

    if (!resposta.ok) {
        mensagem.textContent = "Não foi possível carregar as tarefas"
        mensagem.classList.add("erro")
        return
    }

    const dados = await resposta.json()

    mensagem.textContent = ""
    mensagem.classList.remove("erro")

    tarefas = dados

    listaTodo.innerHTML = ""
    listaDoing.innerHTML = ""
    listaDone.innerHTML = ""

    tarefas.forEach(function (tarefa) {
        criarItemNaTela(tarefa)
    })

    atualizarContadores()

    mostrarEstadoVazio()

    function mostrarEstadoVazio() {
    verificarListaVazia(listaTodo, "Nenhuma tarefa a fazer")
    verificarListaVazia(listaDoing, "Nada em andamento")
    verificarListaVazia(listaDone, "Nenhuma tarefa concluída")
}

function verificarListaVazia(lista, texto) {

    const itensReais = lista.querySelectorAll("li")

    if (itensReais.length === 0) {

        const empty = document.createElement("li")

        empty.classList.add("empty-state")

        empty.textContent = texto

        lista.appendChild(empty)
    }
}
}



async function atualizarTarefa(tarefa) {
    const resposta = await fetch(`${API_URL}/${tarefa.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })

    if (!resposta.ok) {
        mensagem.textContent = "Não foi possível atualizar a tarefa"
        mensagem.classList.add("erro")
        return
    }

    const tarefaAtualizada = await resposta.json()

    tarefas = tarefas.map(function (item) {
        if (item.id === tarefaAtualizada.id) {
            return tarefaAtualizada
        }

        return item
    })

    substituirItemNaTela(tarefaAtualizada)
}

async function excluirTarefa(id) {
    const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })

    if (!resposta.ok) {
        mensagem.textContent = "Não foi possível excluir a tarefa"
        mensagem.classList.add("erro")
        return false
    }

    tarefas = tarefas.filter(function (tarefa) {
        return tarefa.id !== id
    })

    atualizarContadores()

    return true
}

async function adicionarTarefa() {
    const texto = input.value.trim()

    if (texto === "") {
        mensagem.textContent = "Digite o nome da tarefa"
        mensagem.classList.add("erro")
        return
    }

    const novaTarefa = {
        nome: texto,
        status: "todo"
    }

    const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novaTarefa)
    })

    if (!resposta.ok) {
        mensagem.textContent = "Não foi possível adicionar a tarefa"
        mensagem.classList.add("erro")
        return
    }

    const tarefaCriada = await resposta.json()

    tarefas.push(tarefaCriada)
    criarItemNaTela(tarefaCriada)

    input.value = ""
    mensagem.textContent = ""
    mensagem.classList.remove("erro")
}

// EVENTOS
corda.addEventListener("click", function () {
    document.body.classList.toggle("dark")
    document.documentElement.classList.toggle("dark")

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark")
    } else {
        localStorage.setItem("tema", "light")
    }
})

botao.addEventListener("click", async function () {
    await adicionarTarefa()
})

input.addEventListener("keydown", async function (evento) {
    if (evento.key === "Enter") {
        evento.preventDefault()
        await adicionarTarefa()
    }
})

listaTodo.addEventListener("dragover", function (evento) {
    evento.preventDefault()
})

listaDoing.addEventListener("dragover", function (evento) {
    evento.preventDefault()
})

listaDone.addEventListener("dragover", function (evento) {
    evento.preventDefault()
})

listaTodo.addEventListener("drop", function () {
    if (tarefaArrastada === null) return

    tarefaArrastada.status = "todo"
    atualizarTarefa(tarefaArrastada)
})

listaDoing.addEventListener("drop", function () {
    if (tarefaArrastada === null) return

    tarefaArrastada.status = "doing"
    atualizarTarefa(tarefaArrastada)
})

listaDone.addEventListener("drop", function () {
    if (tarefaArrastada === null) return

    tarefaArrastada.status = "done"
    atualizarTarefa(tarefaArrastada)
})

btnCancelar.addEventListener("click", function () {
    modal.classList.add("hidden")
    tarefaParaExcluir = null
})

btnConfirmar.addEventListener("click", async function () {
    if (tarefaParaExcluir === null) {
        return
    }

    const idParaExcluir = tarefaParaExcluir.id
    const elementoParaRemover = tarefaParaExcluir.elemento

    modal.classList.add("hidden")
    tarefaParaExcluir = null

    elementoParaRemover.remove()

    const excluiu = await excluirTarefa(idParaExcluir)

    if (!excluiu) {
        buscarTarefas()
    }
})

// INICIALIZAÇÃO
const temaSalvo = localStorage.getItem("tema")

if (temaSalvo === "dark") {
    document.body.classList.add("dark")
    document.documentElement.classList.add("dark")
}

buscarTarefas()