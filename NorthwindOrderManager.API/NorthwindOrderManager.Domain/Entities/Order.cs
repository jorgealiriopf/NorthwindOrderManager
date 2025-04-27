using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NorthwindOrderManager.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }
        public string CustomerId { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? OrderDate { get; set; }
        public string ShipAddress { get; set; }
        public int? ShipperId { get; set; }

        // Relaciones
        public Customer Customer { get; set; }
        public Employee Employee { get; set; }
        public Shipper Shipper { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
