namespace HotelBookingApp.Api.DTOs;

public class DashboardStatsDto
{
    public int TotalHotels { get; set; }
    public int TotalCities { get; set; }
    public double AverageRating { get; set; }
    public int TotalRooms { get; set; }
}