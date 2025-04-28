using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindOrderManager.Domain.Entities
{
    public class OrderDetail
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public decimal? UnitPrice { get; set; }
        public short? Quantity { get; set; }
        public float? Discount { get; set; }

        // Relación con Order (opcional, si quieres hacer Include del Order también)
        public Order? Order { get; set; }

        // Relación con Product (lo importante ahora)
        public Product? Product { get; set; }
    }

}

