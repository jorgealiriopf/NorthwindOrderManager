using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;
using NorthwindOrderManager.Domain.Entities;

namespace NorthwindOrderManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly NorthwindDbContext _context;

        public OrdersController(NorthwindDbContext context)
        {
            _context = context;
        }

        // GET: api/orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Employee)
                .Include(o => o.Shipper)
                .ToListAsync();

            return Ok(orders);
        }
        // POST: api/orders
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder([FromBody] Order order)
        {
            if (order == null)
            {
                return BadRequest();
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Devuelve 201 Created y la orden creada
            return CreatedAtAction(nameof(GetOrders), new { id = order.OrderId }, order);
        }
        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order updatedOrder)
        {
            if (id != updatedOrder.OrderId)
            {
                return BadRequest("Order ID mismatch.");
            }

            var existingOrder = await _context.Orders.FindAsync(id);
            if (existingOrder == null)
            {
                return NotFound();
            }

            // Actualizar campos (manual para mayor control)
            existingOrder.CustomerId = updatedOrder.CustomerId;
            existingOrder.EmployeeId = updatedOrder.EmployeeId;
            existingOrder.OrderDate = updatedOrder.OrderDate;
            existingOrder.ShipAddress = updatedOrder.ShipAddress;
            existingOrder.ShipVia = updatedOrder.ShipVia;

            await _context.SaveChangesAsync();

            return NoContent();
        }
        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

    }
}
