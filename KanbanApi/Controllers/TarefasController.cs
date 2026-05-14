using Microsoft.AspNetCore.Mvc;

namespace KanbanApi.Controllers
{
     [ApiController]
     [Route ("api/[controller]")]
     public class TarefasController: ControllerBase
    {
        [HttpGet]
        public IActionResult Listar()
        {
             return Ok("Api funcionando ");
        }
        
    }
}