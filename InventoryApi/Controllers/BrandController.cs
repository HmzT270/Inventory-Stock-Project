using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public BrandController(InventoryDbContext context)
        {
            _context = context;
        }

        public class BrandControllerDto
        {
            public string NewName { get; set; } = string.Empty;
        }

        // Tüm markaları getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Brand>>> GetBrands()
        {
            return await _context.Brands.ToListAsync();
        }

        // Belirli bir markayı getir
        [HttpGet("{id}")]
        public async Task<ActionResult<Brand>> GetBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);

            if (brand == null)
                return NotFound();

            return brand;
        }

        // Yeni marka ekle
        [HttpPost]
        public async Task<ActionResult<Brand>> PostBrand([FromBody] Brand brand)
        {
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBrand), new { id = brand.BrandId }, brand);
        }

        // Marka güncelle
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBrand(int id, [FromBody] Brand brand)
        {
            if (id != brand.BrandId)
                return BadRequest();

            _context.Entry(brand).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Marka adı değiştir
        [HttpPut("Rename/{id}")]
        public async Task<IActionResult> RenameBrand(int id, [FromBody] BrandControllerDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewName))
                return BadRequest("Yeni marka adı boş olamaz.");

            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            brand.Name = dto.NewName;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Marka sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound();

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
