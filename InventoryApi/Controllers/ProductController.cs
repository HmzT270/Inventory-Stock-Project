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

        public class ProductCreateDto
        {
            public string Name { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public int CategoryId { get; set; }
            public int? BrandId { get; set; }
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProducts()
        {
            var products = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.Brand)
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
                Brand = p.Brand?.Name,
                BrandId = p.BrandId, // <-- Bunu ekle!
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        [HttpGet("Sorted")]
        public async Task<ActionResult<IEnumerable<object>>> GetSortedProducts([FromQuery] string orderBy = "serialnumber", [FromQuery] string direction = "asc")
        {
            var products = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.StockMovements)
                .ToListAsync();

            var sorted = products.Select((p, i) => new
            {
                SerialNumber = i + 1,
                p.ProductId,
                p.Name,
                p.Quantity,
                p.CategoryId,
                p.Description,
                p.CreatedAt,
                p.CriticalStockLevel,
                Category = p.Category?.Name ?? "",
                Brand = p.Brand?.Name ?? "",
                BrandId = p.BrandId, // <-- Bunu ekle!
                StockMovementCount = p.StockMovements?.Count ?? 0
            });

            sorted = (orderBy.ToLower(), direction.ToLower()) switch
            {
                ("name", "asc") => sorted.OrderBy(p => p.Name),
                ("name", "desc") => sorted.OrderByDescending(p => p.Name),
                ("serialnumber", "asc") => sorted.OrderBy(p => p.SerialNumber),
                ("serialnumber", "desc") => sorted.OrderByDescending(p => p.SerialNumber),
                ("quantity", "asc") => sorted.OrderBy(p => p.Quantity),
                ("quantity", "desc") => sorted.OrderByDescending(p => p.Quantity),
                ("category", "asc") => sorted.OrderBy(p => p.Category),
                ("category", "desc") => sorted.OrderByDescending(p => p.Category),
                ("brand", "asc") => sorted.OrderBy(p => p.Brand),
                ("brand", "desc") => sorted.OrderByDescending(p => p.Brand),
                ("createdat", "asc") => sorted.OrderBy(p => p.CreatedAt),
                ("createdat", "desc") => sorted.OrderByDescending(p => p.CreatedAt),
                _ => sorted.OrderBy(p => p.SerialNumber)
            };

            return Ok(sorted.ToList());
        }

        [HttpPost]
        public async Task<ActionResult<Product>> CreateProduct(ProductCreateDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Quantity = dto.Quantity,
                CategoryId = dto.CategoryId,
                BrandId = dto.BrandId,
                Description = dto.Description,
                CriticalStockLevel = dto.CriticalStockLevel == 0 ? 10 : dto.CriticalStockLevel
            };

            _context.Product.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.ProductId }, product);
        }

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

        [HttpPut("UpdateStock/{id}")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] int newStock)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Quantity = newStock;
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return NotFound();

            _context.DeletedProducts.Add(new DeletedProduct
            {
                Name = product.Name,
                Quantity = product.Quantity,
                Description = product.Description,
                DeletedAt = DateTime.Now,
                CategoryName = product.Category?.Name,
                Brand = product.Brand?.Name,
                OriginalProductId = product.ProductId
            });

            _context.Product.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("ByCategory/{categoryId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductsByCategory(int categoryId)
        {
            var products = await _context.Product
                .Where(p => p.CategoryId == categoryId)
                .Include(p => p.Category)
                .Include(p => p.Brand)
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
                Brand = p.Brand?.Name,
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        [HttpGet("SearchByName/{query}")]
        public async Task<ActionResult<IEnumerable<object>>> SearchByName(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Arama parametresi boş olamaz.");

            var lowered = query.ToLower();

            var results = await _context.Product
                .Where(p => p.Name.ToLower().Contains(lowered))
                .Include(p => p.Category)
                .Include(p => p.Brand)
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
                Brand = p.Brand?.Name,
                BrandId = p.BrandId, // <-- Bunu ekle!
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

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
                    d.DeletedAt,
                    d.Brand
                })
                .ToListAsync();

            return Ok(deleted);
        }

        [HttpPut("UpdateAllCriticalStockLevel/{newLevel}")]
        public async Task<IActionResult> UpdateAllCriticalStockLevel(int newLevel)
        {
            if (newLevel < 0)
                return BadRequest("Kritik seviye negatif olamaz.");

            var allProducts = await _context.Product.ToListAsync();

            foreach (var product in allProducts)
            {
                product.CriticalStockLevel = newLevel;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = $"Tüm ürünlerin kritik seviyesi {newLevel} olarak güncellendi." });
        }

        [HttpGet("Any")]
        public async Task<ActionResult<object>> GetAnyProduct()
        {
            var product = await _context.Product
                .Include(p => p.Brand)
                .OrderBy(p => p.ProductId)
                .FirstOrDefaultAsync();

            if (product == null) return NotFound();

            return Ok(new
            {
                product.ProductId,
                product.Name,
                product.CriticalStockLevel,
                Brand = product.Brand?.Name
            });
        }

        [HttpPost("Restore/{originalProductId}")]
        public async Task<IActionResult> RestoreProduct(int originalProductId)
        {
            var deleted = await _context.DeletedProducts
                .FirstOrDefaultAsync(d => d.OriginalProductId == originalProductId);

            if (deleted == null) return NotFound("Silinen ürün bulunamadı.");

            var categoryId = await _context.Categories
                .Where(c => c.Name == deleted.CategoryName)
                .Select(c => c.CategoryId)
                .FirstOrDefaultAsync();

            if (categoryId == 0) return BadRequest("Kategori bulunamadı.");

            var restoredProduct = new Product
            {
                Name = deleted.Name,
                Quantity = deleted.Quantity,
                Description = deleted.Description,
                CreatedAt = DateTime.Now,
                CategoryId = categoryId,
                CriticalStockLevel = 10
            };

            _context.Product.Add(restoredProduct);
            _context.DeletedProducts.Remove(deleted);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ürün başarıyla geri yüklendi." });
        }
    }
}
