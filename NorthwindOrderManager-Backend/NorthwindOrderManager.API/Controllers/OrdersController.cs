using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NorthwindOrderManager.Domain.Entities;
using NorthwindOrderManager.Infrastructure.Data;
using NorthwindOrderManager.Application.Interfaces;
using NorthwindOrderManager.Application.Models;
using System.Globalization;

namespace NorthwindOrderManager.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly NorthwindDbContext _context;
        private readonly IPdfService _pdfService;
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpFactory;

        public OrdersController(
            NorthwindDbContext context,
            IPdfService pdfService,
            IConfiguration config,
            IHttpClientFactory httpFactory)
        {
            _context = context;
            _pdfService = pdfService;
            _config = config;
            _httpFactory = httpFactory;
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
            if (order == null) return BadRequest();
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetOrders), new { id = order.OrderId }, order);
        }

        // PUT: api/orders/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] Order updatedOrder)
        {
            if (id != updatedOrder.OrderId)
                return BadRequest("Order ID mismatch.");

            var existing = await _context.Orders.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.CustomerId = updatedOrder.CustomerId;
            existing.EmployeeId = updatedOrder.EmployeeId;
            existing.OrderDate = updatedOrder.OrderDate;
            existing.ShipAddress = updatedOrder.ShipAddress;
            existing.ShipVia = updatedOrder.ShipVia;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                return NotFound();

            // 🔥 Elimina los detalles primero
            _context.OrderDetails.RemoveRange(order.OrderDetails);

            // Luego elimina la orden
            _context.Orders.Remove(order);

            await _context.SaveChangesAsync();

            return NoContent();
        }


        // GET: api/orders/export
        [HttpGet("export")]
        public async Task<IActionResult> ExportOrdersToPdf()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Employee)
                .Include(o => o.Shipper)
                .ToListAsync();

            var html = new StringBuilder();
            html.Append("<h1>Orders Report</h1>")
                .Append("<table border='1' cellpadding='5' cellspacing='0'>")
                .Append("<thead><tr>")
                .Append("<th>Order ID</th><th>Customer</th><th>Employee</th><th>Order Date</th><th>Ship Address</th>")
                .Append("</tr></thead><tbody>");

            foreach (var o in orders)
            {
                html.Append("<tr>")
                    .Append($"<td>{o.OrderId}</td>")
                    .Append($"<td>{o.Customer?.CompanyName ?? "N/A"}</td>")
                    .Append($"<td>{o.Employee?.FirstName} {o.Employee?.LastName}</td>")
                    .Append($"<td>{o.OrderDate:yyyy-MM-dd}</td>")
                    .Append($"<td>{o.ShipAddress}</td>")
                    .Append("</tr>");
            }

            html.Append("</tbody></table>");

            var renderer = new ChromePdfRenderer();
            var pdfDoc = renderer.RenderHtmlAsPdf(html.ToString());
            return File(pdfDoc.BinaryData, "application/pdf", "OrdersReport.pdf");
        }

        [HttpGet("{id}/pdf")]
        public async Task<IActionResult> GetPdf(int id)
        {
            // 1) Carga la orden con detalles
            var order = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.Employee)
                .Include(o => o.Shipper)
                .Include(o => o.OrderDetails)
                    .ThenInclude(d => d.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
                return NotFound($"Order {id} not found.");

            string dbDateStr;
            var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = @"
            SELECT CONVERT(varchar(10), OrderDate, 23)
              FROM Orders
             WHERE OrderId = @orderId";
                var p = cmd.CreateParameter();
                p.ParameterName = "@orderId";
                p.Value = id;
                cmd.Parameters.Add(p);

                var scalar = await cmd.ExecuteScalarAsync();
                dbDateStr = scalar as string ?? "";
            }
                // 2) Llama a Geocoding API
                var address = order.ShipAddress;
            var key = _config["GoogleMaps:ApiKey"];
            var client = _httpFactory.CreateClient();
            var geoUrl = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={key}";
            var geoJson = await client.GetStringAsync(geoUrl);

            using var doc = JsonDocument.Parse(geoJson);
            var result = doc.RootElement.GetProperty("results")[0];

            // Helper para extraer componente
            string GetComp(string type) =>
                result.GetProperty("address_components")
                      .EnumerateArray()
                      .FirstOrDefault(c =>
                          c.GetProperty("types")
                           .EnumerateArray()
                           .Any(t => t.GetString() == type))
                      .GetProperty("long_name")
                      .GetString() ?? "";

            var street = GetComp("route");
            var postalCode = GetComp("postal_code");
            var city = GetComp("locality");
            var state = GetComp("administrative_area_level_1");
            var country = GetComp("country");

            // 3) Coordenadas
            var loc = result.GetProperty("geometry").GetProperty("location");
            var lat = loc.GetProperty("lat").GetDouble();
            var lng = loc.GetProperty("lng").GetDouble();
            var coords = $"{lat}, {lng}";

            // 4) Static Maps URL
            var staticMapUrl =
                $"https://maps.googleapis.com/maps/api/staticmap?" +
                $"center={lat},{lng}&zoom=15&size=600x300" +
                $"&markers=color:red%7C{lat},{lng}&key={key}";

            // 1) Obten la fecha directamente de la entidad
            var rawDate = order.OrderDate;
            // 2) Forzamos sólo la parte de fecha, sin hora

            var orderDateStr = order.OrderDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

            // 5) Prepara el modelo
            var model = new OrderPdfModel
            {
                Order = order,
                StaticMapUrl = staticMapUrl,
                OrderDateStr = orderDateStr,
                Coordinates = coords,
                Street = street,
                PostalCode = postalCode,
                City = city,
                State = state,
                Country = country
            };

            // 6) Genera y devuelve el PDF
            var pdfBytes = await _pdfService.GenerateOrderPdfAsync(model);
            return File(pdfBytes, "application/pdf", $"order_{id}.pdf");
        }
    }

}

