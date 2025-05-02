using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class GeocodeController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _http;

    public GeocodeController(IConfiguration config, IHttpClientFactory httpFactory)
    {
        _config = config;
        _http = httpFactory.CreateClient();
    }

    [HttpGet]
    public async Task<IActionResult> Get(string address)
    {
        var key = _config["GoogleMaps:ApiKey"];
        var url = $"https://maps.googleapis.com/maps/api/geocode/json?address={Uri.EscapeDataString(address)}&key={key}";
        var resp = await _http.GetAsync(url);
        var json = await resp.Content.ReadAsStringAsync();
        return Content(json, "application/json");
    }
}
