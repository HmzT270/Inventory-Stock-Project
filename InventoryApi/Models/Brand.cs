using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace InventoryApi.Models
{
    public class Brand
    {
        public int BrandId { get; set; }

        [Required(ErrorMessage = "Marka adı boş bırakılamaz")]
        public string Name { get; set; } = string.Empty;

        // Marka ile ilişkili ürünler
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
