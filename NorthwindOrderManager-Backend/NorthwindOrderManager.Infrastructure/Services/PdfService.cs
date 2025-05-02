using System.IO;
using System.Threading.Tasks;
using IronPdf;
using IronPdf.Rendering;
using RazorLight;
using NorthwindOrderManager.Application.Interfaces;
using NorthwindOrderManager.Application.Models;

namespace NorthwindOrderManager.Infrastructure.Services
{
    public class PdfService : IPdfService
    {
        private readonly RazorLightEngine _razor;

        public PdfService()
        {
            _razor = new RazorLightEngineBuilder()
                .UseFileSystemProject(Path.Combine(Directory.GetCurrentDirectory(), "Templates"))
                .UseMemoryCachingProvider()
                .Build();
        }

        public async Task<byte[]> GenerateOrderPdfAsync(OrderPdfModel model)
        {
            // 1) Renderizar Razor a HTML
            string html = await _razor.CompileRenderAsync("OrderPdf.cshtml", model);

            // 2) Generar el PDF con ChromePdfRenderer
            var renderer = new ChromePdfRenderer();
            renderer.RenderingOptions.PaperSize = PdfPaperSize.A4;
            renderer.RenderingOptions.MarginTop = 10;
            renderer.RenderingOptions.MarginBottom = 10;
            renderer.RenderingOptions.MarginLeft = 10;
            renderer.RenderingOptions.MarginRight = 10;

            PdfDocument pdf = await renderer.RenderHtmlAsPdfAsync(html);
            return pdf.BinaryData;
        }
    }
}
