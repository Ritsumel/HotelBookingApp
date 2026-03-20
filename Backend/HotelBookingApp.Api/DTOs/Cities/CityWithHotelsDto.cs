using HotelBookingApp.Api.DTOs.Hotels;

namespace HotelBookingApp.Api.DTOs.Cities;

public class CityWithHotelsDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Image { get; set; } = "";
    public string UrlSlug { get; set; } = "";
    public List<HotelDto> Hotels { get; set; } = new();
}

