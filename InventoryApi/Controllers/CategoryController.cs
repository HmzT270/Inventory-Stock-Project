using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public CategoryController(InventoryDbContext context)
        {
            _context = context;
        }

        // Tüm kategorileri getir
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        // Belirli bir kategoriyi getir
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);

            if (category == null)
                return NotFound();

            return category;
        }

        // Yeni kategori ekle
        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory([FromBody] Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryId }, category);
        }

        // Kategori güncelle (tamamı)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, [FromBody] Category category)
        {
            if (id != category.CategoryId)
                return BadRequest();

            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Kategori adı değiştir (sadece ad)
        public class RenameCategoryDto
        {
            public string NewName { get; set; } = string.Empty;
        }

        [HttpPut("Rename/{id}")]
        public async Task<IActionResult> RenameCategory(int id, [FromBody] RenameCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.NewName))
                return BadRequest("Yeni kategori adı boş olamaz.");

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            category.Name = dto.NewName;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Kategori sil
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
