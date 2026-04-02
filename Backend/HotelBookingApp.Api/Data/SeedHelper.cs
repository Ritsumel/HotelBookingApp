using System.Text.Json;

namespace HotelBookingApp.Api.Data;

public static class SeedHelper
{
    private static readonly HttpClient _http = new();

    public static async Task<string> FetchUnsplashImage(string query, string accessKey)
    {
        try
        {
            var url = $"https://api.unsplash.com/photos/random?query={Uri.EscapeDataString(query)}&orientation=landscape&client_id={accessKey}";
            var response = await _http.GetStringAsync(url);
            var json = JsonDocument.Parse(response);
            return json.RootElement.GetProperty("urls").GetProperty("regular").GetString() ?? "";
        }
        catch
        {
            // Fallback om API-nyckeln är ogiltig eller kvoten är nådd
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
        }
    }

    public static string ToSlug(string text)
    {
        return text.ToLower()
            .Replace("å", "a").Replace("ä", "a").Replace("ö", "o")
            .Replace(" ", "-");
    }
}