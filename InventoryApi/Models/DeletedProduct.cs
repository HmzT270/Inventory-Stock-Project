using System;

namespace InventoryApi.Models
{
    public class DeletedProduct
    {
        public int DeletedProductId { get; set; }

        public string Name { get; set; } = string.Empty; // Null hatası önlendi

        public string? Description { get; set; }

        public int Quantity { get; set; }

        public DateTime DeletedAt { get; set; }

        public int? OriginalProductId { get; set; }

        public string? CategoryName { get; set; }  // Opsiyonel alan
    }
}
