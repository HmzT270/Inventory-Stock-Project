using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace InventoryApi.Models
{
    public class Product
    {
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Ürün adı boş bırakılamaz")]
        public string Name { get; set; } = string.Empty;

        [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı negatif olamaz")]
        public int Quantity { get; set; }

        public int CategoryId { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        public int CriticalStockLevel { get; set; } = 10;

        public int? BrandId { get; set; }  // Marka foreign key (nullable)

        [ValidateNever]
        public Brand? Brand { get; set; }  // Marka navigation (nullable)

        [ValidateNever]
        public Category Category { get; set; } = null!;

        [ValidateNever]
        public List<StockMovement> StockMovements { get; set; } = new();

        public string? CreatedBy { get; set; }

        public Product()
        {
            CreatedAt = DateTime.Now;
        }
    }
}
