using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.DTOs.Hotels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingApp.Api.Controllers;

[ApiController]
[Route("api/hotels")]
public class HotelsController : ControllerBase
{
    private readonly AppDbContext _context;

    public HotelsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var hotels = _context.Hotels
            .Include(h => h.City)
            .Select(h => new HotelDto
            {
                Id = h.Id,
                Name = h.Name,
                Description = h.Description,
                PricePerNight = (int)h.PricePerNight,
                Image = h.Image,
                UrlSlug = h.UrlSlug,
                CityName = h.City!.Name,
                Address = h.Address,
                Rating = h.Rating,
                ReviewCount = h.ReviewCount,
                Amenities = h.Amenities
            })
            .ToList();

        return Ok(hotels);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var hotel = _context.Hotels
            .Include(h => h.City)
            .Where(h => h.Id == id)
            .Select(h => new HotelDto
            {
                Id = h.Id,
                Name = h.Name,
                Description = h.Description,
                PricePerNight = (int)h.PricePerNight,
                Image = h.Image,
                UrlSlug = h.UrlSlug,
                CityName = h.City!.Name,
                Address = h.Address,
                Rating = h.Rating,
                ReviewCount = h.ReviewCount,
                Amenities = h.Amenities
            })
            .FirstOrDefault();

        if (hotel == null)
            return NotFound();

        return Ok(hotel);
    }
}