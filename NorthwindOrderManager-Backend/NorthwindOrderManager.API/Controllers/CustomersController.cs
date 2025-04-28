using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;

namespace NorthwindOrderManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly NorthwindDbContext _context;

        public CustomersController(NorthwindDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Customers
                .Select(c => new
                {
                    c.CustomerId,
                    c.CompanyName
                })
                .ToListAsync();

            return Ok(customers);
        }
    }
}
