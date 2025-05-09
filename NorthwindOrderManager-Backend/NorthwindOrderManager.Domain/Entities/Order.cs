﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// NorthwindOrderManager.Domain/Entities/Order.cs
namespace NorthwindOrderManager.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }

        public string? CustomerId { get; set; }    // si tu FK CustomerID admite NULL
        public int? EmployeeId { get; set; }    // si EmployeeID admite NULL

        public DateOnly OrderDate { get; set; }
        public DateTime? RequiredDate { get; set; }
        public DateTime? ShippedDate { get; set; }

        public int? ShipVia { get; set; }
        public decimal? Freight { get; set; }

        public string? ShipName { get; set; }
        public string? ShipAddress { get; set; }
        public string? ShipCity { get; set; }
        public string? ShipRegion { get; set; }
        public string? ShipPostalCode { get; set; }
        public string? ShipCountry { get; set; }

        // Navegaciones
        public Customer? Customer { get; set; }
        public Employee? Employee { get; set; }
        public Shipper? Shipper { get; set; }

        // Aseguramos que la colección no sea null para ThenInclude
        public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
    }
}




