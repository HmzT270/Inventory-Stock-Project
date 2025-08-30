using System.ComponentModel.DataAnnotations;

namespace InventoryApi.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }  // Primary Key

        public string Name { get; set; } = string.Empty;

        public List<Product> Products { get; set; } = new List<Product>();
    }
}
