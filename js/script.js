const botao = document.getElementById("btn-adicionar")
const input = document.getElementById("input-tarefa")

const listaTodo = document.getElementById("lista-todo")
const listaDoing = document.getElementById("lista-doing")
const listaDone = document.getElementById("lista-done")

let tarefas = []

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas))
}

function criarItemNaTela(tarefa) {
    const item = document.createElement("li")

    const texto = document.createElement("span")
    texto.textContent = tarefa.nome

    const botaoTodo = document.createElement("button")
    botaoTodo.textContent = "A Fazer"

    botaoTodo.addEventListener("click", function () {
        tarefa.status = "todo"
        salvarTarefas()
        carregarTarefas()
    })

    const botaoDoing = document.createElement("button")
    botaoDoing.textContent = "Em Andamento"

    botaoDoing.addEventListener("click", function () {
        tarefa.status = "doing"
        salvarTarefas()
        carregarTarefas()
    })

    const botaoDone = document.createElement("button")
    botaoDone.textContent = "Concluído"

    botaoDone.addEventListener("click", function () {
        tarefa.status = "done"
        salvarTarefas()
        carregarTarefas()
    })

    const botaoExcluir = document.createElement("button")
    botaoExcluir.textContent = "Excluir"

    botaoExcluir.addEventListener("click", function () {
        tarefas = tarefas.filter(function (item) {
            return item.id !== tarefa.id
        })

        salvarTarefas()
        carregarTarefas()
    })

    item.appendChild(texto)
    item.appendChild(botaoTodo)
    item.appendChild(botaoDoing)
    item.appendChild(botaoDone)
    item.appendChild(botaoExcluir)

    if (tarefa.status === "todo") {
        listaTodo.appendChild(item)
    }

    if (tarefa.status === "doing") {
        listaDoing.appendChild(item)
    }

    if (tarefa.status === "done") {
        listaDone.appendChild(item)
    }
}

function carregarTarefas() {
    listaTodo.innerHTML = ""
    listaDoing.innerHTML = ""
    listaDone.innerHTML = ""

    const tarefasSalvas = localStorage.getItem("tarefas")

    if (tarefasSalvas) {
        tarefas = JSON.parse(tarefasSalvas)
    }

    tarefas.forEach(function (tarefa) {
        criarItemNaTela(tarefa)
    })
}

botao.addEventListener("click", function () {
    const texto = input.value.trim()

    if (texto === "") {
        alert("Digite o nome da tarefa")
        return
    }

    const novaTarefa = {
        id: Date.now(),
        nome: texto,
        status: "todo"
    }

    tarefas.push(novaTarefa)

    salvarTarefas()
    carregarTarefas()

    input.value = ""
})

carregarTarefas()