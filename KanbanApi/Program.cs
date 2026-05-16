using System.Security.Authentication.ExtendedProtection;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(FileOptions =>
{
    FileOptions.AddPolicy("PermitirFrontend", policy =>
    {
         policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
        
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("PermitirFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();