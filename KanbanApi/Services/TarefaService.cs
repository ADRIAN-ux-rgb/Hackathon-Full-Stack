using Microsoft.EntityFrameworkCore;
using KanbanApi.Data;
using KanbanApi.DTOs;
using KanbanApi.Models;

namespace KanbanApi.Services
{
    public class TarefaService : ITarefaService
    {
        private readonly AppDbContext _context;

        public TarefaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tarefa>> ListarAsync()
        {
            return await _context.Tarefas.ToListAsync();
        }

        public async Task<Tarefa?> ObterPorIdAsync(int id)
        {
            return await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Tarefa> CriarAsync(CriarTarefaDto novaTarefa)
        {
            var tarefa = new Tarefa
            {
                Nome = novaTarefa.Nome.Trim(),
                Status = TarefaStatus.Normalizar(novaTarefa.Status)
            };

            _context.Tarefas.Add(tarefa);
            await _context.SaveChangesAsync();

            return tarefa;
        }

        public async Task<Tarefa?> AtualizarAsync(int id, AtualizarTarefaDto tarefaAtualizada)
        {
            var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);

            if (tarefa == null)
            {
                return null;
            }

            tarefa.Nome = tarefaAtualizada.Nome.Trim();
            tarefa.Status = TarefaStatus.Normalizar(tarefaAtualizada.Status);

            await _context.SaveChangesAsync();

            return tarefa;
        }

        public async Task<bool> DeletarAsync(int id)
        {
            var tarefa = await _context.Tarefas.FirstOrDefaultAsync(t => t.Id == id);

            if (tarefa == null)
            {
                return false;
            }

            _context.Tarefas.Remove(tarefa);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
