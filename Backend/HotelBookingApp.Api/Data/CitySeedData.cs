using HotelBookingApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingApp.Api.Data;

public static class CitySeedData
{
    // Vi tar emot listan via parametern 'svenskaStäder'
    public static async Task<List<City>> Seed(AppDbContext context, string accessKey, (string Name, int Weight)[] svenskaStäder)
    {
        // Om städer redan finns, hämta dem från DB och returnera så att HotelSeedData kan använda dem
        if (context.Cities.Any())
            return await context.Cities.ToListAsync();

        var cities = new List<City>();

        foreach (var s in svenskaStäder)
        {
            // Vi använder s.Name (från parametern) istället för en lokal lista
            var image = await SeedHelper.FetchUnsplashImage($"{s.Name} city sweden", accessKey);

            cities.Add(new City
            {
                Name = s.Name,
                Image = image,
                UrlSlug = SeedHelper.ToSlug(s.Name)
            });
        }

        context.Cities.AddRange(cities);
        await context.SaveChangesAsync();

        return cities;
    }
}