using Microsoft.EntityFrameworkCore;
using NorthwindOrderManager.Domain.Entities;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace NorthwindOrderManager.Infrastructure.Data
{
    public class NorthwindDbContext : DbContext
    {
        public NorthwindDbContext(DbContextOptions<NorthwindDbContext> options)
            : base(options)
        {
        }

        // DbSets: representan las tablas de la base de datos
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Shipper> Shippers { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Order>(entity =>
            {
                // Indica que en SQL es un 'date' puro
                entity.Property(o => o.OrderDate)
                    .HasColumnType("date")
                    .HasConversion(
                        // De DateOnly a DateTime (para el driver)
                        d => d.ToDateTime(TimeOnly.MinValue),
                        // De DateTime a DateOnly (cuando lee)
                        dt => DateOnly.FromDateTime(dt)
                    );
            

                // Configuraciones de relaciones
                modelBuilder.Entity<Order>()
                .HasOne(o => o.Customer)
                .WithMany()
                .HasForeignKey(o => o.CustomerId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Employee)
                .WithMany()
                .HasForeignKey(o => o.EmployeeId);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Shipper)
                .WithMany()
                .HasForeignKey(o => o.ShipVia);

            modelBuilder.Entity<Order>()
                .Property(o => o.OrderDate)
                .HasColumnType("date");

            modelBuilder.Entity<OrderDetail>()
                .ToTable("Order Details")
                .HasKey(od => new { od.OrderId, od.ProductId });

            modelBuilder.Entity<OrderDetail>()
                .ToTable("Order Details")
                .HasOne(od => od.Order)
                .WithMany(o => o.OrderDetails)
                .HasForeignKey(od => od.OrderId);

            modelBuilder.Entity<Order>(entity =>
            {
                entity.Property(o => o.ShipCity)
                      .HasMaxLength(15)
                      .HasColumnName("ShipCity");
                entity.Property(o => o.ShipRegion)
                      .HasMaxLength(15)
                      .HasColumnName("ShipRegion");
                entity.Property(o => o.ShipPostalCode)
                      .HasMaxLength(10)
                      .HasColumnName("ShipPostalCode");
                entity.Property(o => o.ShipCountry)
                      .HasMaxLength(15)
                      .HasColumnName("ShipCountry");
            });

            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
            });

            });
        }
    }
}
