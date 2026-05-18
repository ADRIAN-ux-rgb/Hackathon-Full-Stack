using System.ComponentModel.DataAnnotations;
using KanbanApi.Models;

namespace KanbanApi.DTOs
{
    public class CriarTarefaDto : IValidatableObject
    {
        [Required(ErrorMessage = "O nome da tarefa e obrigatorio.")]
        public string Nome { get; set; } = string.Empty;

        public string Status { get; set; } = TarefaStatus.Todo;

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (string.IsNullOrWhiteSpace(Nome))
            {
                yield return new ValidationResult("O nome da tarefa e obrigatorio.", new[] { nameof(Nome) });
            }

            if (!TarefaStatus.EhValido(Status))
            {
                yield return new ValidationResult("O status deve ser todo, doing ou done.", new[] { nameof(Status) });
            }
        }
    }
}
