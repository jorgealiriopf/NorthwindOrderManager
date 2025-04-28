using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;

namespace NorthwindOrderManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShippersController : ControllerBase
    {
        private readonly NorthwindDbContext _context;

        public ShippersController(NorthwindDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetShippers()
        {
            var shippers = await _context.Shippers
                .Select(s => new
                {
                    s.ShipperId,
                    s.CompanyName
                })
                .ToListAsync();

            return Ok(shippers);
        }
    }
}
