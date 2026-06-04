export function criarDragAndDrop(listas, onDropStatus) {
    let tarefaArrastada = null

    Object.entries(listas).forEach(function ([status, lista]) {
        lista.addEventListener("dragover", function (evento) {
            evento.preventDefault()
            evento.dataTransfer.dropEffect = "move"
            lista.parentElement.classList.add("kanban-drop-active")
        })

        lista.addEventListener("dragleave", function (evento) {
            if (!lista.contains(evento.relatedTarget)) {
                lista.parentElement.classList.remove("kanban-drop-active")
            }
        })

        lista.addEventListener("drop", function () {
            lista.parentElement.classList.remove("kanban-drop-active")

            if (tarefaArrastada === null) {
                return
            }

            if (tarefaArrastada.status === status) {
                return
            }

            onDropStatus({
                ...tarefaArrastada,
                status
            })
        })
    })

    return {
        iniciar(tarefa) {
            tarefaArrastada = tarefa
        },
        finalizar() {
            Object.values(listas).forEach(function (lista) {
                lista.parentElement.classList.remove("kanban-drop-active")
            })

            tarefaArrastada = null
        }
    }
}
