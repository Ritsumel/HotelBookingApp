namespace HotelBookingApp.Api.Models;

public class Room
{
    public int Id { get; set; }
    public int HotelId { get; set; }
    public string Name { get; set; } = "";
    public string? RoomType { get; set; }

    public decimal PricePerNight { get; set; }

    public int Capacity { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;

    public Hotel? Hotel { get; set; }
}