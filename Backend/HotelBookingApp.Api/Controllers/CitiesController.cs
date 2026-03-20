using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.DTOs.Cities;
using HotelBookingApp.Api.DTOs.Hotels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingApp.Api.Controllers;

[ApiController]
[Route("api/cities")]
public class CitiesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CitiesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var cities = _context.Cities
            .Select(c => new CityDto
            {
                Id = c.Id,
                Name = c.Name,
                Image = c.Image,
                UrlSlug = c.UrlSlug
            })
            .ToList();
        return Ok(cities);
    }

    [HttpGet("{Id}")]
    public IActionResult GetById(int id)
    {
        var city = _context.Cities
            .Include(c => c.Hotels)
            .Where(c => c.Id == id)
            .Select(c => new CityWithHotelsDto
            {
                Id = c.Id,
                Name = c.Name,
                Image = c.Image,
                UrlSlug= c.UrlSlug,
                Hotels = c.Hotels.Select(h => new HotelDto
                {
                    Id = h.Id,
                    Name = h.Name,
                    Description = h.Description,
                    PricePerNight = (int)h.PricePerNight,
                    Image = h.Image,
                    UrlSlug = h.UrlSlug,
                    CityName = c.Name,
                    Address = h.Address,
                    Rating = h.Rating,
                    ReviewCount = h.ReviewCount,
                    Amenities = h.Amenities
                }).ToList()
            })
            .FirstOrDefault();
        if (city == null)
            return NotFound();

        return Ok(city);
    }
}

