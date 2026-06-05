export const TASK_TYPES = Object.freeze({
    bug: "BUG",
    feature: "FEATURE",
    refactor: "REFACTOR",
    test: "TEST",
    doc: "DOC",
    deploy: "DEPLOY",
    hotfix: "HOTFIX"
})

export const TASK_TYPE_VALUES = Object.freeze(Object.values(TASK_TYPES))

export function normalizarTipoTarefa(tipo) {
    const valor = String(tipo || "").trim().toUpperCase()
    return TASK_TYPE_VALUES.includes(valor) ? valor : TASK_TYPES.feature
}

export function criarClasseTipoTarefa(tipo) {
    return `task-type-${normalizarTipoTarefa(tipo).toLowerCase()}`
}
