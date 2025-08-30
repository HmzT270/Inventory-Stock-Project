using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace InventoryApi.Models {
    public class Product {
        [Key]
        public int ProductId { get; set; } // Primary Key

        [Required(ErrorMessage = "Ürün adi boş birakilamaz")]
        public string Name { get; set; } = string.Empty;

        [Range(0, int.MaxValue, ErrorMessage = "Stok miktari negatif olamaz")]
        public int Quantity { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; } // Kategori Foreign Key

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int CriticalStockLevel { get; set; } = 10;

        [ValidateNever]
        public Category Category { get; set; } = null!;

        [ValidateNever]
        public List<StockMovement> StockMovements { get; set; } = new();

         public int? BrandId { get; set; }  // Marka foreign key (nullable)

        [ValidateNever]
        public Brand? Brand { get; set; }  // Marka navigation (nullable)

        public string? CreatedBy { get; set; } // Ürünü ekleyen kullanıcı
    }
}

