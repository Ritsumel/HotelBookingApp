using HotelBookingApp.Api.Data;
using HotelBookingApp.Api.DTOs.Auth;
using HotelBookingApp.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HotelBookingApp.Api.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest request)
    {
        var user = _context.Users
            .FirstOrDefault(u => u.Email == request.Email
                  && u.PasswordHash == request.Password); 

        if (user == null)
            return Unauthorized();

        
        var claims = new[]
        {
        new Claim(ClaimTypes.Name, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("ThisIsAReallyLongSecretKeyForJwtAuthentication12345"));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        return Ok(new
        {
            access_token = new JwtSecurityTokenHandler().WriteToken(token),
            token_type = "Bearer",
            expires_in = 3600,
            user = new
            {
                fullName = user.FullName,
                email = user.Email,
                role = user.Role
            }
        });
    }

    [HttpPost("register")]
    public IActionResult Register(RegisterRequest request)
    {
        var existingUser = _context.Users
            .FirstOrDefault(u => u.Email == request.Email);

        if (existingUser != null)
            return BadRequest("Email already registered.");

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = request.Password,
            Role = "User"
        };

        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok(new
        {
            message = "User created successfully"
        });
    }
}