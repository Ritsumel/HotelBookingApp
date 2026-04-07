namespace HotelBookingApp.Api.DTOs.Bookings;

public class CreateBookingDto
{
    public int HotelId { get; set; }

    public string GuestName { get; set; } = "";

    public DateTime CheckIn { get; set; }

    public DateTime CheckOut { get; set; }

    public int Guests { get; set; }

    public int RoomId { get; set; }
}