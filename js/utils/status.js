export const TASK_STATUS = {
    todo: "todo",
    doing: "doing",
    done: "done"
}

export const STATUS_LABELS = {
    [TASK_STATUS.todo]: "A Fazer",
    [TASK_STATUS.doing]: "Em Andamento",
    [TASK_STATUS.done]: "Concluido"
}

export const STATUS_EMPTY_MESSAGES = {
    [TASK_STATUS.todo]: "Nenhuma tarefa a fazer",
    [TASK_STATUS.doing]: "Nada em andamento",
    [TASK_STATUS.done]: "Nenhuma tarefa concluida"
}
