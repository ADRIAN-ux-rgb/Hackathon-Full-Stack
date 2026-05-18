using Microsoft.EntityFrameworkCore;
using KanbanApi.Models;

namespace KanbanApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        public DbSet<Tarefa> Tarefas { get; set; }
    }
}