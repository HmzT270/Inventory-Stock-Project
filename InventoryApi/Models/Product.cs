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

        [ValidateNever]
        public Category Category { get; set; } = null!;

        [ValidateNever]
        public List<StockMovement> StockMovements { get; set; } = new();

        public Product()
        {
            CreatedAt = DateTime.Now;
        }
    }
}
