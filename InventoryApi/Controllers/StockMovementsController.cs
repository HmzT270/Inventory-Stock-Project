using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockMovementsController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public StockMovementsController(InventoryDbContext context)
        {
            _context = context;
        }

        // ✅ Tüm stok hareketlerini getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StockMovement>>> GetStockMovements()
        {
            return await _context.StockMovements
                .Include(sm => sm.Product)
                .ToListAsync();
        }

        // ✅ Belirli bir stok hareketini getir
        [HttpGet("{id}")]
        public async Task<ActionResult<StockMovement>> GetStockMovement(int id)
        {
            var movement = await _context.StockMovements.FindAsync(id);
            if (movement == null)
                return NotFound();

            return movement;
        }

        // ✅ Yeni stok hareketi ekle
        [HttpPost]
        public async Task<ActionResult<StockMovement>> Create(StockMovement movement)
        {
            movement.MovementDate = DateTime.Now;

            _context.StockMovements.Add(movement);

            var product = await _context.Product.FindAsync(movement.ProductId);
            if (product != null)
            {
                if (movement.MovementType.ToLower() == "in")
                    product.Quantity += movement.Quantity;
                else if (movement.MovementType.ToLower() == "out")
                    product.Quantity -= movement.Quantity;
            }

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetStockMovement), new { id = movement.MovementId }, movement);
        }

        // ✅ Stok hareketini sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var movement = await _context.StockMovements.FindAsync(id);
            if (movement == null)
                return NotFound();

            _context.StockMovements.Remove(movement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Belirli ürüne ait tüm stok hareketlerini getir
        [HttpGet("Product/{productId:int}")]
        public async Task<ActionResult<IEnumerable<StockMovement>>> GetMovementsByProduct(int productId)
        {
            var movements = await _context.StockMovements
                .Where(sm => sm.ProductId == productId)
                .Include(sm => sm.Product)
                .ToListAsync();

            if (movements == null || !movements.Any())
            {
                return Ok(new List<StockMovement>()); // ❗Boş liste dön
            }

            return Ok(movements);
        }
    }
}
