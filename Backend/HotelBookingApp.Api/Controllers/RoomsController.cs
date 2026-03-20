using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")] // api/rooms
public class RoomsController : ControllerBase
{
    private readonly AppDbContext _context;

    public RoomsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        var rooms = await _context.Rooms
            .Include(r => r.Hotel)
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpGet("{id}")] //hämtar room via id.
    public async Task<ActionResult<Room>> GetRoom(int id)
    {
        var room = await _context.Rooms
            .Include(r => r.Hotel)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (room == null)
        {
            return NotFound();
        }

        return Ok(room);
    }

    [HttpGet("hotel/{hotelId}")] //hämtar rum som tillhör hotell med specifikt id.
    public async Task<ActionResult<IEnumerable<Room>>> GetRoomsByHotel(int hotelId)
    {
        var rooms = await _context.Rooms
            .Where(r => r.HotelId == hotelId)
            .ToListAsync();

        return Ok(rooms);
    }

    [HttpPost]
    public async Task<ActionResult<Room>> CreateRoom(Room room) //POST för att skapa nytt rum
    {
        var hotelExists = await _context.Hotels.AnyAsync(h => h.Id == room.HotelId);

        if (!hotelExists)
        {
            return BadRequest("HotelId does not exist.");
        }

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, room);
    }
}