using System;

namespace InventoryApi.Models
{
    public class DeletedProduct
    {
        public int DeletedProductId { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public int Quantity { get; set; }

        public DateTime DeletedAt { get; set; }

        public int? OriginalProductId { get; set; }

        public string? CategoryName { get; set; }

        public string? Brand { get; set; } // ✅ Marka bilgisi

        public string? DeletedBy { get; set; }  // Silen kullanıcı

        public string? CreatedBy { get; set; }  // ✅ Ekleyen kullanıcı (yeni)
    }
}
