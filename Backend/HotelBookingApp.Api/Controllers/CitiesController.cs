using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.DTOs;
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
    public async Task<IActionResult> Get(
    [FromQuery] string? slug,
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10)
    {
        var query = _context.Cities.AsQueryable();

        if (!string.IsNullOrEmpty(slug))
        {
            query = query.Where(c => c.UrlSlug == slug);
        }

        var totalCount = await query.CountAsync();

        var cities = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(c => new CityDto
            {
                Id = c.Id,
                Name = c.Name,
                Image = c.Image,
                UrlSlug = c.UrlSlug
            })
            .ToListAsync();

        var result = new PagedResult<CityDto>
        {
            Items = cities,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };

        return Ok(result);
    }

    [HttpGet("{Id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var city = await _context.Cities
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
            .FirstOrDefaultAsync();

        if (city == null)
            return NotFound();

        return Ok(city);
    }


    [HttpPost] //City POST
    public async Task<IActionResult> Create(CreateCityDto dto)
    {
    if (string.IsNullOrWhiteSpace(dto.Name))
        return BadRequest("City name is required.");

    if (string.IsNullOrWhiteSpace(dto.UrlSlug))
        return BadRequest("UrlSlug is required.");

    var slugExists = await _context.Cities.AnyAsync(c => c.UrlSlug == dto.UrlSlug);
    if (slugExists)
        return BadRequest("A city with this UrlSlug already exists.");

    var city = new Models.City
    {
        Name = dto.Name,
        Image = dto.Image,
        UrlSlug = dto.UrlSlug
    };

    _context.Cities.Add(city);
    await _context.SaveChangesAsync();

    var result = new CityDto
    {
        Id = city.Id,
        Name = city.Name,
        Image = city.Image,
        UrlSlug = city.UrlSlug
    };

    return CreatedAtAction(nameof(GetById), new { id = city.Id }, result);
    }



    [HttpPatch("{id}")] //City UPDATE
public async Task<IActionResult> Update(int id, UpdateCityDto dto)
{
    var city = await _context.Cities.FindAsync(id);
    if (city == null)
        return NotFound("City not found.");

    if (string.IsNullOrWhiteSpace(dto.Name))
        return BadRequest("City name is required.");

    if (string.IsNullOrWhiteSpace(dto.UrlSlug))
        return BadRequest("UrlSlug is required.");

    var slugExists = await _context.Cities.AnyAsync(c => c.UrlSlug == dto.UrlSlug && c.Id != id);
    if (slugExists)
        return BadRequest("Another city with this UrlSlug already exists.");

    city.Name = dto.Name;
    city.Image = dto.Image;
    city.UrlSlug = dto.UrlSlug;

    await _context.SaveChangesAsync();

    var result = new CityDto
    {
        Id = city.Id,
        Name = city.Name,
        Image = city.Image,
        UrlSlug = city.UrlSlug
    };

    return Ok(result);
    }


    [HttpDelete("{id}")] //City DELETE (blockeras om en stad är kopplat till ett hotell)
public async Task<IActionResult> Delete(int id)
{
    var city = await _context.Cities.FindAsync(id);
    if (city == null)
        return NotFound("City not found.");

    var hasHotels = await _context.Hotels.AnyAsync(h => h.CityId == id);
    if (hasHotels)
        return BadRequest("Cannot delete city because it has hotels linked to it.");

    _context.Cities.Remove(city);
    await _context.SaveChangesAsync();

    return NoContent();
}

[HttpDelete("{cityId}/hotels/{hotelId}")] //DELETE /api/categories/{categoryID}/products/{productId}
public async Task<IActionResult> DeleteHotelFromCity(int cityId, int hotelId)
{
    var hotel = await _context.Hotels
        .FirstOrDefaultAsync(h => h.Id == hotelId && h.CityId == cityId);

    if (hotel == null)
        return NotFound("Hotel not found for this city.");

    _context.Hotels.Remove(hotel);
    await _context.SaveChangesAsync();

    return NoContent();
}

}

