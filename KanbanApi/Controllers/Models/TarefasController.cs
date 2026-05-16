using Microsoft.AspNetCore.Mvc;
using KanbanApi.Models;

namespace KanbanApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarefasController : ControllerBase
    {
        private static List<Tarefa> tarefas = new List<Tarefa>
        {
            new Tarefa
            {
                Id = 1,
                Nome = "Estudar ASP.NET",
                Status = "todo"
            }
        };

        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(tarefas);
        }

        [HttpPost]
        public IActionResult Criar(Tarefa novaTarefa)
        {
            novaTarefa.Id = tarefas.Count + 1;
            tarefas.Add(novaTarefa);

            return Created("", novaTarefa);
        }

        [HttpPut("{id}")]
        public IActionResult Atualizar(int id, Tarefa tarefaAtualizada)
        {
            var tarefa = tarefas.FirstOrDefault(t => t.Id == id);

            if (tarefa == null)
            {
                return NotFound();
            }

            tarefa.Nome = tarefaAtualizada.Nome;
            tarefa.Status = tarefaAtualizada.Status;

            return Ok(tarefa);
        }

        [HttpDelete("{id}")]
        public IActionResult Deletar(int id)
        {
            var tarefa = tarefas.FirstOrDefault(t => t.Id == id);

            if (tarefa == null)
            {
                return NotFound();
            }

            tarefas.Remove(tarefa);

            return NoContent();
        }
    }
}