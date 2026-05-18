using Microsoft.AspNetCore.Mvc;
using KanbanApi.DTOs;
using KanbanApi.Services;

namespace KanbanApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarefasController : ControllerBase
    {
        private readonly ITarefaService _tarefaService;

        public TarefasController(ITarefaService tarefaService)
        {
            _tarefaService = tarefaService;
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            var tarefas = await _tarefaService.ListarAsync();
            return Ok(tarefas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObterPorId(int id)
        {
            var tarefa = await _tarefaService.ObterPorIdAsync(id);

            if (tarefa == null)
            {
                return NotFound();
            }

            return Ok(tarefa);
        }

        [HttpPost]
        public async Task<IActionResult> Criar(CriarTarefaDto novaTarefa)
        {
            var tarefaCriada = await _tarefaService.CriarAsync(novaTarefa);
            return CreatedAtAction(nameof(ObterPorId), new { id = tarefaCriada.Id }, tarefaCriada);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, AtualizarTarefaDto tarefaAtualizada)
        {
            var tarefa = await _tarefaService.AtualizarAsync(id, tarefaAtualizada);

            if (tarefa == null)
            {
                return NotFound();
            }

            return Ok(tarefa);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deletar(int id)
        {
            var deletou = await _tarefaService.DeletarAsync(id);

            if (!deletou)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
