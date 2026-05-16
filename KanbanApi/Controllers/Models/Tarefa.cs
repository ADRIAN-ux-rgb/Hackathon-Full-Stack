namespace KanbanApi.Models
{
    public class Tarefa
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string Status { get; set; } = "todo";
    }
}