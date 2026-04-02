using Bogus;
using HotelBookingApp.Api.Models;

namespace HotelBookingApp.Api.Data;

public static class UserSeedData
{
    public static void Seed(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var userFaker = new Faker<User>("sv")
            .RuleFor(u => u.FullName, f => f.Name.FullName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FullName))
            .RuleFor(u => u.PasswordHash, f => "password123")
            .RuleFor(u => u.Role, f => "User");

        var users = userFaker.Generate(20);

        users.Add(new User { FullName = "Admin", Email = "admin@mmehotels.se", PasswordHash = "admin123", Role = "Admin" });

        context.Users.AddRange(users);
        context.SaveChanges();
    }
}