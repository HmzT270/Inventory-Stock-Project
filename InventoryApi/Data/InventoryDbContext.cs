using Microsoft.EntityFrameworkCore;
using InventoryApi.Models;

namespace InventoryApi.Data
{
    public class InventoryDbContext : DbContext
    {
        public InventoryDbContext(DbContextOptions<InventoryDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<DeletedProduct> DeletedProducts { get; set; } // <-- EKLENDİ!
    }
}
