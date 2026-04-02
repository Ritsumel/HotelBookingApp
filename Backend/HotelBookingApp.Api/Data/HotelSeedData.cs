using Bogus;
using HotelBookingApp.Api.Models;

namespace HotelBookingApp.Api.Data;

public static class HotelSeedData
{
    public static async Task<List<Hotel>> Seed(
        AppDbContext context,
        string accessKey,
        List<City> cities,
        (string Name, int Weight)[] cityWeights)
    {
        if (context.Hotels.Any()) return context.Hotels.ToList();

        // 1. Förbered viktad lista för extra hotell
        var viktadStadslista = cityWeights
            .SelectMany(s => Enumerable.Repeat(
                cities.First(c => c.Name == s.Name), s.Weight))
            .ToList();

        // 2. Metadata för fejk-data
        var hotelTypes = new[] { "Hotel", "Resort", "Suites", "Inn", "Lodge" };
        var descriptions = new[]
        {
            "Ett modernt hotell med fantastisk utsikt och förstklassig service.",
            "Beläget i hjärtat av staden med spa, pool och gourmetrestaurang.",
            "Lyxigt boende med eleganta rum och personlig service dygnet runt.",
            "Familjevänligt hotell med aktiviteter för både stora och små.",
            "Boutique-hotell med unik karaktär och ombonad atmosfär."
        };

        // 3. Hämta hotellbilder (Samma logik som förut, men via din nya Helper)
        var hotelImageUrls = new List<string>();
        for (int i = 0; i < 10; i++)
        {
            var img = await SeedHelper.FetchUnsplashImage(
                i % 2 == 0 ? "hotel interior sweden" : "hotel lobby luxury",
                accessKey);
            hotelImageUrls.Add(img);
        }

        var faker = new Faker("sv");
        var hotels = new List<Hotel>();

        // Steg 1 — Garantera minst 1 hotell per stad
        foreach (var city in cities)
        {
            hotels.Add(CreateFakeHotel(city, faker, hotelTypes, descriptions, hotelImageUrls));
        }

        // Steg 2 — Fyll på med 20 extra hotell viktade mot stora städer
        for (int i = 0; i < 20; i++)
        {
            var stad = faker.PickRandom(viktadStadslista);
            hotels.Add(CreateFakeHotel(stad, faker, hotelTypes, descriptions, hotelImageUrls));
        }

        context.Hotels.AddRange(hotels);
        context.SaveChanges();

        return hotels;
    }

    // En privat hjälpmetod för att slippa duplicera "new Hotel"-koden
    private static Hotel CreateFakeHotel(City city, Faker faker, string[] types, string[] desc, List<string> images)
    {
        var type = faker.PickRandom(types);
        return new Hotel
        {
            Name = $"{city.Name} {type}",
            Description = faker.PickRandom(desc),
            PricePerNight = Math.Round(faker.Random.Decimal(500, 4000) / 100) * 100,
            Image = faker.PickRandom(images),
            UrlSlug = SeedHelper.ToSlug($"{city.Name}-{type}-{faker.Random.Int(1, 999)}"),
            CityId = city.Id,
            Address = $"{faker.Address.StreetName()} {faker.Random.Int(1, 99)}",
            Rating = Math.Round(faker.Random.Double(3.5, 5.0), 1),
            ReviewCount = faker.Random.Int(50, 2000),
            Amenities = string.Join(", ", faker.PickRandom(
                ["Spa", "Restaurant", "Bar", "Gym", "Pool", "Wi-Fi", "Parking", "Concierge", "Room Service", "Sauna"],
                faker.Random.Int(3, 6)))
        };
    }
}