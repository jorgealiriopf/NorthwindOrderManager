using System.Collections.Generic;

namespace NorthwindOrderManager.Domain.Entities
{
    public class Product
    {
        public int ProductId { get; set; }          // ID del producto (clave primaria)
        public string? ProductName { get; set; }     // Nombre del producto
        public decimal? UnitPrice { get; set; }      // Precio unitario

        // Relaciones
        public ICollection<OrderDetail>? OrderDetails { get; set; }
    }
}
