using KanbanApi.DTOs;
using KanbanApi.Models;

namespace KanbanApi.Services
{
    public interface ITarefaService
    {
        Task<List<Tarefa>> ListarAsync();
        Task<Tarefa?> ObterPorIdAsync(int id);
        Task<Tarefa> CriarAsync(CriarTarefaDto novaTarefa);
        Task<Tarefa?> AtualizarAsync(int id, AtualizarTarefaDto tarefaAtualizada);
        Task<bool> DeletarAsync(int id);
    }
}
