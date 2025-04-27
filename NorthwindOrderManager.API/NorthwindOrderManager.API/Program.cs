using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

// Aquí configuramos el DbContext
builder.Services.AddDbContext<NorthwindDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NorthwindConnection")));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
