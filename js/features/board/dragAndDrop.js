export function criarDragAndDrop(listas, onDropStatus) {
    let tarefaArrastada = null

    Object.entries(listas).forEach(function ([status, lista]) {
        lista.addEventListener("dragover", function (evento) {
            evento.preventDefault()
        })

        lista.addEventListener("drop", function () {
            if (tarefaArrastada === null) {
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
            tarefaArrastada = null
        }
    }
}
