namespace InventoryApi.Models
{
    public class ProductFavorite
    {
        public int ProductFavoriteId { get; set; }

        public int ProductId { get; set; }

        public string UserId { get; set; } = string.Empty; // Kullanıcıyı ayırmak için

        // Navigation Property (Opsiyonel)
        public Product? Product { get; set; }
    }
}