using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;
using NorthwindOrderManager.Domain.Entities;

namespace NorthwindOrderManager.API.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly NorthwindDbContext _context;

        public ProductsController(NorthwindDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }
    }
}
