using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.DTOs;
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
    public async Task<IActionResult> GetAll(
        [FromQuery] int? cityId = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Hotels.Include(h => h.City).AsQueryable();

        if (cityId.HasValue)
            query = query.Where(h => h.CityId == cityId.Value);

        var totalCount = await query.CountAsync();

        var hotels = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
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
            .ToListAsync();

        var result = new PagedResult<HotelDto>
        {
            Items = hotels,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var hotel = await _context.Hotels
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
            .FirstOrDefaultAsync();

        if (hotel == null)
            return NotFound();

        return Ok(hotel);
    }

    [HttpPost] //Hotels POST
    public async Task<IActionResult> Create(CreateHotelDto dto)
    {
    if (string.IsNullOrWhiteSpace(dto.Name))
        return BadRequest("Hotel name is required.");

    if (string.IsNullOrWhiteSpace(dto.UrlSlug))
        return BadRequest("UrlSlug is required.");

    var city = await _context.Cities.FindAsync(dto.CityId);
    if (city == null)
        return BadRequest("Invalid CityId. City does not exist.");

    var slugExists = await _context.Hotels.AnyAsync(h => h.UrlSlug == dto.UrlSlug);
    if (slugExists)
        return BadRequest("A hotel with this UrlSlug already exists.");

    var hotel = new Models.Hotel
    {
        Name = dto.Name,
        Description = dto.Description,
        PricePerNight = dto.PricePerNight,
        Image = dto.Image,
        UrlSlug = dto.UrlSlug,
        Address = dto.Address,
        Rating = dto.Rating,
        ReviewCount = dto.ReviewCount,
        Amenities = dto.Amenities,
        CityId = dto.CityId
    };

    _context.Hotels.Add(hotel);
    await _context.SaveChangesAsync();

    var result = new HotelDto
    {
        Id = hotel.Id,
        Name = hotel.Name,
        Description = hotel.Description,
        PricePerNight = (int)hotel.PricePerNight,
        Image = hotel.Image,
        UrlSlug = hotel.UrlSlug,
        CityName = city.Name,
        Address = hotel.Address,
        Rating = hotel.Rating,
        ReviewCount = hotel.ReviewCount,
        Amenities = hotel.Amenities
    };

    return CreatedAtAction(nameof(GetById), new { id = hotel.Id }, result);
    }

    [HttpPatch("{id}")] //Hotels UPDATE
    public async Task<IActionResult> Update(int id, UpdateHotelDto dto)
    {
    var hotel = await _context.Hotels.FindAsync(id);
    if (hotel == null)
        return NotFound("Hotel not found.");

    if (string.IsNullOrWhiteSpace(dto.Name))
        return BadRequest("Hotel name is required.");

    if (string.IsNullOrWhiteSpace(dto.UrlSlug))
        return BadRequest("UrlSlug is required.");

    var city = await _context.Cities.FindAsync(dto.CityId);
    if (city == null)
        return BadRequest("Invalid CityId. City does not exist.");

    var slugExists = await _context.Hotels.AnyAsync(h => h.UrlSlug == dto.UrlSlug && h.Id != id);
    if (slugExists)
        return BadRequest("Another hotel with this UrlSlug already exists.");

    hotel.Name = dto.Name;
    hotel.Description = dto.Description;
    hotel.PricePerNight = dto.PricePerNight;
    hotel.Image = dto.Image;
    hotel.UrlSlug = dto.UrlSlug;
    hotel.Address = dto.Address;
    hotel.Rating = dto.Rating;
    hotel.ReviewCount = dto.ReviewCount;
    hotel.Amenities = dto.Amenities;
    hotel.CityId = dto.CityId;

    await _context.SaveChangesAsync();

    var result = new HotelDto
    {
        Id = hotel.Id,
        Name = hotel.Name,
        Description = hotel.Description,
        PricePerNight = (int)hotel.PricePerNight,
        Image = hotel.Image,
        UrlSlug = hotel.UrlSlug,
        CityName = city.Name,
        Address = hotel.Address,
        Rating = hotel.Rating,
        ReviewCount = hotel.ReviewCount,
        Amenities = hotel.Amenities
    };

    return Ok(result);
    }

    [HttpDelete("{id}")] //Hotels DELETE
    public async Task<IActionResult> Delete(int id)
    {
    var hotel = await _context.Hotels.FindAsync(id);
    if (hotel == null)
        return NotFound("Hotel not found.");

    _context.Hotels.Remove(hotel);
    await _context.SaveChangesAsync();

    return NoContent();
    }

}