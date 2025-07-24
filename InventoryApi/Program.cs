using InventoryApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Veritabanı bağlantısı
builder.Services.AddDbContext<InventoryDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS ayarı — 🔽 burayı EKLEDİK
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // React uygulamasının adresi
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Servisleri ekle
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Uygulama pipeline'ı
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// CORS middleware — 🔽 burayı EKLEDİK
app.UseCors("AllowReactApp");

// 🔽 HTTPS yönlendirme kaldırıldı
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
