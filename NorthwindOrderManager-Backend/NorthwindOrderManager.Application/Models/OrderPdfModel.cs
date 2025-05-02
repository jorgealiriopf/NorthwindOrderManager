using NorthwindOrderManager.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

// NorthwindOrderManager.Application/Models/OrderPdfModel.cs
// NorthwindOrderManager.Application/Models/OrderPdfModel.cs
// NorthwindOrderManager.Application/Models/OrderPdfModel.cs
namespace NorthwindOrderManager.Application.Models
{
    public class OrderPdfModel
    {
        public required NorthwindOrderManager.Domain.Entities.Order Order { get; set; }
        public required string OrderDateStr { get; set; }
        public required string StaticMapUrl { get; set; }
        public required string Coordinates { get; set; }

        // Estas cinco propiedades vienen del Geocoding
        public required string Street { get; set; }
        public required string PostalCode { get; set; }
        public required string City { get; set; }
        public required string State { get; set; }
        public required string Country { get; set; }
    }
}



