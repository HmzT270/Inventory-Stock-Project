using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public ProductController(InventoryDbContext context)
        {
            _context = context;
        }

        // DTO’lar
        public class ProductCreateDto
        {
            public string Name { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public int CategoryId { get; set; }
            public string? Description { get; set; }
            public int CriticalStockLevel { get; set; }
        }

        public class UpdateDescriptionDto
        {
            public string NewDescription { get; set; } = string.Empty;
        }

        public class RenameProductDto
        {
            public string NewName { get; set; } = string.Empty;
        }

        public class ChangeCategoryDto
        {
            public int CategoryId { get; set; }
        }

        // Tüm ürünleri sırayla getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProducts()
        {
            var products = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.StockMovements)
                .OrderBy(p => p.ProductId)
                .ToListAsync();

            return Ok(products.Select((p, i) => new
            {
                SerialNumber = i + 1,
                p.ProductId,
                p.Name,
                p.Quantity,
                p.CategoryId,
                p.Description,
                p.CreatedAt,
                p.CriticalStockLevel,
                Category = p.Category?.Name,
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        // Ürün ekle
        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Quantity = dto.Quantity,
                CategoryId = dto.CategoryId,
                Description = dto.Description,
                CriticalStockLevel = dto.CriticalStockLevel == 0 ? 10 : dto.CriticalStockLevel
            };

            _context.Product.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.ProductId }, product);
        }

        // Ürün adını değiştir
        [HttpPut("Rename/{id}")]
        public async Task<IActionResult> RenameProduct(int id, [FromBody] RenameProductDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewName)) return BadRequest("Yeni ürün adı boş olamaz.");

            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.NewName;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Ürünün kategorisini değiştir
        [HttpPut("{id}/ChangeCategory")]
        public async Task<IActionResult> ChangeCategory(int id, [FromBody] ChangeCategoryDto dto)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            if (product.CategoryId == dto.CategoryId)
                return BadRequest("Kategori zaten bu.");

            product.CategoryId = dto.CategoryId;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Açıklamayı güncelle
        [HttpPut("{id}/UpdateDescription")]
        public async Task<IActionResult> UpdateDescription(int id, [FromBody] UpdateDescriptionDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewDescription)) return BadRequest("Açıklama boş olamaz.");

            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Description = dto.NewDescription;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Stoğu güncelle
        [HttpPut("UpdateStock/{id}")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] int newStock)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Quantity = newStock;
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // Ürünü sil ve DeletedProducts tablosuna ekle
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Product
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return NotFound();

            _context.DeletedProducts.Add(new DeletedProduct
            {
                Name = product.Name,
                Quantity = product.Quantity,
                Description = product.Description,
                DeletedAt = DateTime.Now,
                CategoryName = product.Category?.Name,
                OriginalProductId = product.ProductId
            });

            _context.Product.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Kategoriye göre ürünleri getir
        [HttpGet("ByCategory/{categoryId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductsByCategory(int categoryId)
        {
            var products = await _context.Product
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Category)
                .Include(p => p.StockMovements)
                .ToListAsync();

            return Ok(products.Select(p => new
            {
                p.ProductId,
                p.Name,
                p.Quantity,
                p.Description,
                p.CreatedAt,
                p.CriticalStockLevel,
                Category = p.Category?.Name,
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        // Ada göre arama yap
        [HttpGet("SearchByName/{query}")]
        public async Task<ActionResult<IEnumerable<object>>> SearchByName(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Arama parametresi boş olamaz.");

            var lowered = query.ToLower();

            var results = await _context.Product
                .Where(p => p.Name.ToLower().Contains(lowered))
                .Include(p => p.Category)
                .Include(p => p.StockMovements)
                .OrderBy(p => p.Name)
                .Take(20)
                .ToListAsync();

            return Ok(results.Select(p => new
            {
                p.ProductId,
                p.Name,
                p.Quantity,
                p.Description,
                p.CreatedAt,
                p.CriticalStockLevel,
                Category = p.Category?.Name,
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        // Son 10 silinen ürünü getir
        [HttpGet("Last10Deleted")]
        public async Task<ActionResult<IEnumerable<object>>> GetLast10DeletedProducts()
        {
            var deleted = await _context.DeletedProducts
                .OrderByDescending(d => d.DeletedAt)
                .Take(10)
                .Select(d => new
                {
                    d.Name,
                    d.Quantity,
                    d.CategoryName,
                    d.OriginalProductId,
                    d.Description,
                    d.DeletedAt
                })
                .ToListAsync();

            return Ok(deleted);
        }
    }
}
