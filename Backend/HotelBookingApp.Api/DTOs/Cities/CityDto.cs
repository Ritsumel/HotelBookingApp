using System.Runtime.CompilerServices;

namespace HotelBookingApp.Api.DTOs.Cities;

public class CityDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Image { get; set; } = "";
    public string UrlSlug { get; set; } = "";
}

