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
        public string Name { get; set; } = string.Empty; // Null hatasını önler

        [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı negatif olamaz")]
        public int Quantity { get; set; }

        public int CategoryId { get; set; }

        // Description alanı zorunlu değil, null olabilir
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; }

        // Kritik stok seviyesi alanı, varsayılan 10 olarak ayarlandı
        public int CriticalStockLevel { get; set; } = 10;

        [ValidateNever]
        public Category Category { get; set; } = null!; // EF Core tarafından sonradan set edilecek

        [ValidateNever]
        public List<StockMovement> StockMovements { get; set; } = new(); // Boş liste ile başlatılır

        // *** GÜNCELLENEN KISIM: Otomatik createdAt ataması ***
        public Product()
        {
            CreatedAt = DateTime.Now;
        }
    }
}
