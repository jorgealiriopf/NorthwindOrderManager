using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Infrastructure.Data;
using NorthwindOrderManager.Domain.Entities;
using NorthwindOrderManager.Application.DTOs;

namespace NorthwindOrderManager.API.Controllers
{
    [Route("api/orders/{orderId}/details")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly NorthwindDbContext _context;

        public OrderDetailsController(NorthwindDbContext context)
        {
            _context = context;
        }

        // GET: api/orders/{orderId}/details
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetailDto>>> GetOrderDetails(int orderId)
        {
            var orderDetails = await _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .Include(od => od.Product)
                .Select(od => new OrderDetailDto
                {
                    OrderId = od.OrderId,
                    ProductId = od.ProductId,
                    ProductName = od.Product.ProductName,
                    UnitPrice = od.UnitPrice ?? 0,
                    Quantity = od.Quantity ?? 0,
                    Discount = od.Discount ?? 0

                })
                .ToListAsync();

            return orderDetails;
        }


        // POST: api/orders/{orderId}/details
        [HttpPost]
        public async Task<IActionResult> CreateOrderDetail(int orderId, [FromBody] OrderDetail detail)
        {
            detail.OrderId = orderId;
            _context.OrderDetails.Add(detail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderDetails), new { orderId = detail.OrderId }, detail);
        }

        // PUT: api/orders/{orderId}/details/{productId}
        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateOrderDetail(int orderId, int productId, [FromBody] OrderDetail updatedDetail)
        {
            if (orderId != updatedDetail.OrderId || productId != updatedDetail.ProductId)
            {
                return BadRequest("Mismatch between route and body data.");
            }

            var existingDetail = await _context.OrderDetails.FindAsync(orderId, productId);

            if (existingDetail == null)
            {
                return NotFound();
            }

            existingDetail.Quantity = updatedDetail.Quantity;
            existingDetail.UnitPrice = updatedDetail.UnitPrice;
            existingDetail.Discount = updatedDetail.Discount;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/orders/{orderId}/details/{productId}
        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteOrderDetail(int orderId, int productId)
        {
            var detail = await _context.OrderDetails.FindAsync(orderId, productId);
            if (detail == null)
            {
                return NotFound();
            }

            _context.OrderDetails.Remove(detail);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
