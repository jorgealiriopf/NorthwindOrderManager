using System.Threading.Tasks;
using NorthwindOrderManager.Application.Models;

namespace NorthwindOrderManager.Application.Interfaces
{
    public interface IPdfService
    {
        Task<byte[]> GenerateOrderPdfAsync(OrderPdfModel model);
    }
}