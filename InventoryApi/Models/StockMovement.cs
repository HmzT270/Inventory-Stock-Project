using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace InventoryApi.Models
{
    public class StockMovement
    {
        [Key]
        public int MovementId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        [RegularExpression("^(in|out)$", ErrorMessage = "MovementType sadece 'in' veya 'out' olabilir")]
        public string MovementType { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Hareket miktarı en az 1 olmalı")]
        public int Quantity { get; set; }

        public DateTime MovementDate { get; set; }

        [ValidateNever]
        public Product Product { get; set; } = null!;
    }
}
