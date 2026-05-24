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

const STATUS_ALIASES = {
    todo: TASK_STATUS.todo,
    "a fazer": TASK_STATUS.todo,
    afazer: TASK_STATUS.todo,
    fazer: TASK_STATUS.todo,
    doing: TASK_STATUS.doing,
    "em andamento": TASK_STATUS.doing,
    andamento: TASK_STATUS.doing,
    done: TASK_STATUS.done,
    concluido: TASK_STATUS.done,
    concluida: TASK_STATUS.done,
    concluidas: TASK_STATUS.done
}

export function normalizarStatus(status) {
    const chave = String(status || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

    return STATUS_ALIASES[chave] || null
}
