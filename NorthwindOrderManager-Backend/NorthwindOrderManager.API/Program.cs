using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;
using NorthwindOrderManager.Application.Interfaces;
using NorthwindOrderManager.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Configurar CORS
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddSingleton<IPdfService, PdfService>();

builder.Services.AddDbContext<NorthwindDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NorthwindConnection"))
);

builder.Services.AddHttpClient();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var ironKey = builder.Configuration["IronPdf:LicenseKey"];
if (!string.IsNullOrEmpty(ironKey))
{
    IronPdf.License.LicenseKey = ironKey;
}


var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();
app.Run();
