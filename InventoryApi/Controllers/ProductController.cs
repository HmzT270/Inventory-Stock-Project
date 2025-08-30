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

        // DTO
        public class ProductCreateDto
        {
            public string Name { get; set; } = string.Empty;
            public int Quantity { get; set; }
            public int CategoryId { get; set; }
            public string? Description { get; set; }
            public int CriticalStockLevel { get; set; }
            public string NewDescription { get; set; } = string.Empty;
            public string NewName { get; set; } = string.Empty;
            public int? BrandId { get; set; }
            public string? CreatedBy { get; set; }
            public string? DeletedBy { get; set; }
        }

        // Tüm ürünleri sıra numarası ile getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProducts()
        {
            var products = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.StockMovements)
                .OrderBy(p => p.ProductId)
                .ToListAsync();

            // SerialNumber ekle
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
                p.BrandId,
                p.CreatedBy,
                Category = p.Category?.Name,
                StockMovementCount = p.StockMovements?.Count ?? 0,
                Brand = p.Brand?.Name
            }));
        }

        // Ürünleri sırala
        [HttpGet("Sorted")]
        public async Task<ActionResult<IEnumerable<object>>> GetSortedProducts(
            [FromQuery] string orderBy = "serialnumber",
            [FromQuery] string direction = "asc",
            [FromQuery] string userId = ""
        )
        {
            // Tüm ürünleri ilişkileriyle birlikte çek
            var products = await _context.Product
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Include(p => p.StockMovements)
                .ToListAsync();

            // Kullanıcıya ait favori ürünleri tek seferde al
            var userFavorites = _context.ProductFavorites
                .Where(f => f.UserId == userId)
                .Select(f => f.ProductId)
                .ToHashSet();

            // Ürünleri map'le ve kullanıcıya özel IsFavorite ekle
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
                p.CreatedBy,

                // Kullanıcıya özel favori bilgisi
                IsFavorite = userFavorites.Contains(p.ProductId),

                Category = p.Category?.Name ?? "",
                StockMovementCount = p.StockMovements?.Count ?? 0,
                Brand = p.Brand?.Name ?? "",
                p.BrandId
            });

            // Sıralama
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

        // Ürün ekle
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
                CriticalStockLevel = dto.CriticalStockLevel == 0 ? 10 : dto.CriticalStockLevel,
                CreatedBy = dto.CreatedBy
            };

            _context.Product.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducts), new { id = product.ProductId }, product);
        }

        // Ürün adını değiştir
        [HttpPut("Rename/{id}")]
        public async Task<IActionResult> RenameProduct(int id, [FromBody] ProductCreateDto dto) {
            if (string.IsNullOrWhiteSpace(dto.NewName)) return BadRequest("Yeni ürün adı boş olamaz.");

            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = dto.NewName;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Ürün açıklamasını değiştir
        [HttpPut("{id}/UpdateDescription")] public async Task<IActionResult>
        UpdateDescription(int id, [FromBody] ProductCreateDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewDescription)) return BadRequest("Açıklama boş olamaz.");

            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Description = dto.NewDescription;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Ürün kategorisini değiştir
        [HttpPut("{id}/ChangeCategory")]
        public async Task<IActionResult> ChangeCategory(int id, [FromBody] ProductCreateDto dto)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            if (product.CategoryId == dto.CategoryId)
                return BadRequest("Kategori zaten bu.");

            product.CategoryId = dto.CategoryId;
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // Stok miktarını güncelle
        [HttpPut("UpdateStock/{id}")]
        public async Task<IActionResult> UpdateStock(int id, [FromBody] int newStock)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound();

            product.Quantity = newStock;
            await _context.SaveChangesAsync();

            return Ok(product);
        }

        // Silinen ürünü kaydet
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id, [FromBody] ProductCreateDto dto)
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
                OriginalProductId = product.ProductId,
                DeletedBy = dto.DeletedBy,
                CreatedBy = product.CreatedBy
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
                p.CreatedBy,
                Category = p.Category?.Name,
                Brand = p.Brand?.Name,
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        // Belirli bir markaya ait tüm ürünleri getir
        [HttpGet("ByBrand/{brandId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductsByBrand(int brandId)
        {
            var products = await _context.Product
                .Where(p => p.BrandId == brandId)
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
                p.CreatedBy,
                Category = p.Category?.Name,
                Brand = p.Brand?.Name,
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
                p.CreatedBy,
                Category = p.Category?.Name,
                Brand = p.Brand?.Name,
                p.BrandId,
                StockMovementCount = p.StockMovements?.Count ?? 0
            }));
        }

        // Son silinen 10 ürünü getir
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
                    d.Brand,
                    d.DeletedBy,
                    d.CreatedBy
                })
                .ToListAsync();

            return Ok(deleted);
        }

        // Tüm ürünlerin kriitk stok seviyesini güncelle
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

        // Herhangi bir ürünü getir
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
                product.CreatedBy,
                Brand = product.Brand?.Name
            });
        }

        // Silinen ürünü geri yükle
        [HttpPost("Restore/{originalProductId}")]
        public async Task<IActionResult> RestoreProduct(int originalProductId)
        {
            var deleted = await _context.DeletedProducts
                .FirstOrDefaultAsync(d => d.OriginalProductId == originalProductId);

            if (deleted == null) return NotFound("Silinen ürün bulunamadı.");

            // Kategori kontrolü
            var categoryId = await _context.Categories
                .Where(c => c.Name == deleted.CategoryName)
                .Select(c => c.CategoryId)
                .FirstOrDefaultAsync();

            if (categoryId == 0)
                return BadRequest("Kurtarılamadı: Ürünün bağlı olduğu kategori artık mevcut değil.");

            // Marka kontrolü
            int? brandId = null;
            if (!string.IsNullOrEmpty(deleted.Brand))
            {
                brandId = await _context.Brands
                    .Where(b => b.Name == deleted.Brand)
                    .Select(b => b.BrandId)
                    .FirstOrDefaultAsync();

                if (brandId == 0)
                    return BadRequest("Kurtarılamadı: Ürünün bağlı olduğu marka artık mevcut değil.");

                // brandId = 0 döndüyse null yap
                if (brandId == 0) brandId = null;
            }

            var restoredProduct = new Product
            {
                Name = deleted.Name,
                Quantity = deleted.Quantity,
                Description = deleted.Description,
                CreatedAt = DateTime.Now,
                CategoryId = categoryId,
                BrandId = brandId,
                CriticalStockLevel = 10,
                CreatedBy = deleted.CreatedBy
            };

            _context.Product.Add(restoredProduct);
            _context.DeletedProducts.Remove(deleted);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ürün başarıyla geri yüklendi." });
        }

        // Favori durumunu değiştirme (toggle)
        [HttpPut("ToggleFavorite/{id}")]
        public async Task<IActionResult> ToggleFavorite(int id, [FromQuery] string userId)
        {
            Console.WriteLine($"ToggleFavorite => ProductId: {id}, UserId: {userId}");

            // ❌ Kullanıcı boş, whitespace veya "null" string ise favori kaydı oluşturma
            if (string.IsNullOrWhiteSpace(userId) || userId.Trim().ToLower() == "null")
            {
                return BadRequest(new { success = false, message = "Kullanıcı bulunamadı." });
            }

            // Kullanıcıya özel favori kaydı kontrolü
            var favorite = await _context.ProductFavorites
                .FirstOrDefaultAsync(f => f.ProductId == id && f.UserId == userId);

            if (favorite == null)
            {
                // Favori ekle
                _context.ProductFavorites.Add(new ProductFavorite
                {
                    ProductId = id,
                    UserId = userId
                });
                await _context.SaveChangesAsync();

                return Ok(new { success = true, isFavorite = true });
            }
            else
            {
                // Favori kaldır
                _context.ProductFavorites.Remove(favorite);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, isFavorite = false });
            }
        }

        // Kullanıcının favorilerini temizle
        [HttpDelete("ClearFavorites")]
        public async Task<IActionResult> ClearFavorites([FromQuery] string userId)
        {
            // Bu kullanıcının tüm favorilerini bul
            var favorites = _context.ProductFavorites
                .Where(f => f.UserId == userId);

            if (!favorites.Any())
            {
                return Ok(new { success = false, message = "Bu kullanıcının favorisi yok." });
            }

            _context.ProductFavorites.RemoveRange(favorites);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Tüm favoriler kaldırıldı." });
        }
    }
}