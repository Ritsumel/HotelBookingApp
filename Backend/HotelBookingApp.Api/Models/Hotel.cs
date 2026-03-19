namespace HotelBookingApp.Api.Models;

public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal PricePerNight { get; set; }
    public string Image { get; set; } = "";
    public string UrlSlug { get; set; } = "";
    public string Address { get; set; } = "";
    public double Rating { get; set; }
    public int ReviewCount { get; set; }
    public string Amenities { get; set; } = "";

    public int CityId { get; set; }
    public City? City { get; set; }
}