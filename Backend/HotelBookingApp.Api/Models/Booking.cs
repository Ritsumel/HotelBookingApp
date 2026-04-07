using HotelBookingApp.Api.Models;

public class Booking
{
    public int Id { get; set; }

    public int HotelId { get; set; }
    public Hotel? Hotel { get; set; }

    public int? UserId { get; set; }
    public User? User { get; set; }

    public string GuestName { get; set; } = "";

    public DateTime CheckIn { get; set; }
    public DateTime CheckOut { get; set; }

    public int Guests { get; set; }

    public bool IsCancelled { get; set; } = false;

    public int RoomId { get; set; }
}