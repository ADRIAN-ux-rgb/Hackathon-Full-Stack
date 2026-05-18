namespace KanbanApi.Models
{
    public static class TarefaStatus
    {
        public const string Todo = "todo";
        public const string Doing = "doing";
        public const string Done = "done";

        private static readonly HashSet<string> StatusPermitidos = new(StringComparer.OrdinalIgnoreCase)
        {
            Todo,
            Doing,
            Done
        };

        public static bool EhValido(string? status)
        {
            return !string.IsNullOrWhiteSpace(status) && StatusPermitidos.Contains(status);
        }

        public static string Normalizar(string status)
        {
            return status.Trim().ToLowerInvariant();
        }
    }
}
