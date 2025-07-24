namespace InventoryApi.Models
{
    public class Category
    {
        public int CategoryId { get; set; }

        public string Name { get; set; } = string.Empty; // CS8618 uyarısını önler

        public List<Product> Products { get; set; } = new List<Product>(); // Zaten doğru
    }
}
