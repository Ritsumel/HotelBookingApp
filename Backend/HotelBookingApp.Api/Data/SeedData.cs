using Bogus;
using HotelBookingApp.Api.Models;
using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;


namespace HotelBookingApp.Api.Data;

public static class SeedData
{
    private static readonly HttpClient _http = new();
    public static async Task Initialize(AppDbContext context, IConfiguration config)
    {
        if (context.Users.Any() || context.Hotels.Any())
            return;

        var accessKey = config["Unsplash:AccessKey"];

        var userFaker = new Faker<User>("sv")
            .RuleFor(u => u.FullName, f => f.Name.FullName())
            .RuleFor(u => u.Email, (f, u) => f.Internet.Email(u.FullName))
            .RuleFor(User => User.PasswordHash, f => "password123")
            .RuleFor(User => User.Role, f =>"User");

        var users = userFaker.Generate(20);

        users.Add(new User
        {
            FullName = "Admin",
            Email = "admin@example.com",
            PasswordHash = "admin123",
            Role = "Admin"
        });

        context.Users.AddRange(users);
        context.SaveChanges();

        // För att prioritera stader efter storlek 
        var svenskaStäder = new[]

        
        {
            ("Stockholm", 15),
            ("Göteborg", 12),
            ("Malmö", 10),
            ("Uppsala", 4),
            ("Västerås", 3),
            ("Örebro", 3),
            ("Linköping", 3),
            ("Helsingborg", 3),
            ("Jönköping", 2),
            ("Norrköping", 2),
            ("Lund", 2),
            ("Umeå", 2),
            ("Gävle", 1),
            ("Borås", 1),
            ("Södertälje", 1),
            ("Eskilstuna", 1),
            ("Halmstad", 1),
            ("Växjö", 1),
            ("Karlstad", 1),
            ("Sundsvall", 1),
        };


        var cities = new List<City>();
        foreach (var s in svenskaStäder)
        {
            var image = await FetchUnsplashImage($"{s.Item1.Replace("å", "a").Replace("ä", "a").Replace("ö", "o")} city sweden", accessKey);
            cities.Add(new City
            {
                Name = s.Item1,
                Image = image,
                UrlSlug = s.Item1.ToLower().Replace("å", "a").Replace("ä", "a").Replace("ö", "o")
            });
        }

        context.Cities.AddRange(cities);
        context.SaveChanges();

        var viktadStadslista = svenskaStäder
            .SelectMany(s => Enumerable.Repeat(
                cities.First(c => c.Name == s.Item1), s.Item2))
            .ToList();

        var hotelTypes = new[] { "Hotel", "Resort", "Suites", "Inn", "Lodge" };
        var descriptions = new[]
        {
                "Ett modernt hotell med fantastisk utsikt och förstklassig service.",
                "Beläget i hjärtat av staden med spa, pool och gourmetrestaurang.",
                "Lyxigt boende med eleganta rum och personlig service dygnet runt.",
                "Familjevänligt hotell med aktiviteter för både stora och små.",
                "Boutique-hotell med unik karaktär och ombonad atmosfär."
        };

        var hotelImageUrls = new List<string>();
        for (int i = 0; i < 10; i++)
        {
            var img = await FetchUnsplashImage(
                i % 2 == 0 ? "hotel interior sweden" : "hotel lobby luxury",
                accessKey);
            hotelImageUrls.Add(img);
        }

        var faker = new Faker("sv");
        var hotels = new List<Hotel>();


        // Steg 1 — garantera minst 1 hotell per stad
        foreach (var city in cities)
        {
            hotels.Add(new Hotel
            {
                Name = city.Name + " " + faker.PickRandom(hotelTypes),
                Description = faker.PickRandom(descriptions),
                PricePerNight = Math.Round(faker.Random.Decimal(500, 4000) / 100) * 100,
                Image = faker.PickRandom(hotelImageUrls),
                UrlSlug = (city.Name + "-" + faker.PickRandom(hotelTypes)).ToLower().Replace(" ", "-"),
                CityId = city.Id,
                Address = faker.Address.StreetName() + " " + faker.Random.Int(1, 99),
                Rating = Math.Round(faker.Random.Double(3.5, 5.0), 1),
                ReviewCount = faker.Random.Int(50, 2000),
                Amenities = string.Join(", ", faker.PickRandom(
                ["Spa", "Restaurant", "Bar", "Gym", "Pool", "Wi-Fi",
                    "Parking", "Concierge", "Room Service", "Sauna" ],
                faker.Random.Int(3, 6)))
            });
        }

        // Steg 2 — fyll på med extra hotell viktade mot stora städer
        for (int i = 0; i < 20; i++)
        {
            var stad = faker.PickRandom(viktadStadslista);
            hotels.Add(new Hotel
            {
                Name = stad.Name + " " + faker.PickRandom(hotelTypes),
                Description = faker.PickRandom(descriptions),
                PricePerNight = Math.Round(faker.Random.Decimal(500, 4000) / 100) * 100,
                Image = faker.PickRandom(hotelImageUrls),
                UrlSlug = (stad.Name + "-" + faker.PickRandom(hotelTypes)).ToLower().Replace(" ", "-"),
                CityId = stad.Id,
                Address = faker.Address.StreetName() + " " + faker.Random.Int(1, 99),
                Rating = Math.Round(faker.Random.Double(3.5, 5.0), 1),
                ReviewCount = faker.Random.Int(50, 2000),
                Amenities = string.Join(", ", faker.PickRandom(
                [ "Spa", "Restaurant", "Bar", "Gym", "Pool", "Wi-Fi",
                    "Parking", "Concierge", "Room Service", "Sauna" ],
                faker.Random.Int(3, 6)))
            });
        }


        context.Hotels.AddRange(hotels);
        context.SaveChanges();
    }

    private static async Task<string> FetchUnsplashImage(string query, string accessKey)
    {
        try
        {
            var url = $"https://api.unsplash.com/photos/random?query={Uri.EscapeDataString(query)}&orientation=landscape&client_id={accessKey}";
            var response = await _http.GetStringAsync(url);
            var json = JsonDocument.Parse(response);
            return json.RootElement.GetProperty("urls").GetProperty("regular").GetString() ?? "";
        }
        catch
        {
            return "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
        }
    }
}
