using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace InventoryApi.Models
{
    public class StockMovement
    {
        [Key]
        public int MovementId { get; set; } // Primary Key

        [ForeignKey("Product")]
        public int ProductId { get; set; } // Foreign Key

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
