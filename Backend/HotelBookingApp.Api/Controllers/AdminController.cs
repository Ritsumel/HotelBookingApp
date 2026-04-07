using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingApp.Api.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        try
        {
            var totalHotels = await _context.Hotels.CountAsync();
            var totalCities = await _context.Cities.CountAsync();

            // Fix: Kontrollera om det finns hotell innan vi kör Average
            double avgRating = 0;
            if (totalHotels > 0)
            {
                avgRating = await _context.Hotels.AverageAsync(h => h.Rating);
            }

            // Fix: Se till att Rooms-tabellen faktiskt finns i din DbContext
            var totalRooms = await _context.Rooms.CountAsync();

            return Ok(new DashboardStatsDto
            {
                TotalHotels = totalHotels,
                TotalCities = totalCities,
                AverageRating = Math.Round(avgRating, 1),
                TotalRooms = totalRooms
            });
        }
        catch (Exception ex)
        {
            // Detta skriver ut exakt vad som går fel i din C#-konsol
            Console.WriteLine($"Error in GetDashboardStats: {ex.Message}");
            return StatusCode(500, "Internal Server Error");
        }
    }

}