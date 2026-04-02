using HotelBookingApp.Api.Models;

namespace HotelBookingApp.Api.Data;

public static class RoomSeedData
{
    public static async Task Seed(AppDbContext context)
    {
        if (!context.Hotels.Any())
            return;

        var hotels = context.Hotels.ToList();

        foreach (var hotel in hotels)
        {
            var hasRooms = context.Rooms.Any(r => r.HotelId == hotel.Id);
            if (hasRooms)
                continue;



            var rooms = new List<Room>
            {
                new Room
                {
                    HotelId = hotel.Id,
                    Name = "Standard Room",
                    RoomType = "Standard",
                    PricePerNight = 800,
                    Capacity = 2,
                    Description = "Comfortable standard room.",
                    ImageUrl = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    IsAvailable = true
                },
                new Room
                {
                    HotelId = hotel.Id,
                    Name = "Deluxe Room",
                    RoomType = "Deluxe",
                    PricePerNight = 1200,
                    Capacity = 2,
                    Description = "Spacious deluxe room.",
                    ImageUrl = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    IsAvailable = true
                },
                new Room
                {
                    HotelId = hotel.Id,
                    Name = "Family Room",
                    RoomType = "Family",
                    PricePerNight = 1500,
                    Capacity = 4,
                    Description = "Perfect for families.",
                    ImageUrl = "https://images.unsplash.com/photo-1744187170998-368291b6e16e?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    IsAvailable = true
                }
            };

            context.Rooms.AddRange(rooms);
        }

        await context.SaveChangesAsync();
    }
}