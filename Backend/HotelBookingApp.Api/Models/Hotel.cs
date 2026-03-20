namespace HotelBookingApp.Api.Models;

public class Hotel
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal PricePerNight { get; set; }
    public string Image { get; set; } = "";
    public string UrlSlug { get; set; } = "";

    public ICollection<Room> Rooms { get; set; } = new List<Room>(); //lista av rum

    public int CityId { get; set; }
    public City? City { get; set; }
}