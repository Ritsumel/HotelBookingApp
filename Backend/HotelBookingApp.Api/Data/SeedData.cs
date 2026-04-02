namespace HotelBookingApp.Api.Data;

public static class SeedData
{
    public static async Task Initialize(AppDbContext context, IConfiguration config)
    {

        var accessKey = config["Unsplash:AccessKey"] ?? "";

        // 1. Definiera städerna med deras viktning (Används av både City- och HotelSeed)
        var svenskaStäder = new[]
        {
            ("Stockholm", 15), ("Göteborg", 12), ("Malmö", 10), ("Uppsala", 4),
            ("Västerås", 3), ("Örebro", 3), ("Linköping", 3), ("Helsingborg", 3),
            ("Jönköping", 2), ("Norrköping", 2), ("Lund", 2), ("Umeå", 2),
            ("Gävle", 1), ("Borås", 1), ("Södertälje", 1), ("Eskilstuna", 1),
            ("Halmstad", 1), ("Växjö", 1), ("Karlstad", 1), ("Sundsvall", 1)
        };

        // 2. Användare
        UserSeedData.Seed(context);

        // 3. Städer
        var cities = await CitySeedData.Seed(context, accessKey, svenskaStäder);

        // 4. Hotell
        var hotels = await HotelSeedData.Seed(context, accessKey, cities, svenskaStäder);

        // 5. Rum (Din kollegas klass)
        // OBS: Kontrollera att hennes metod heter 'Seed' och tar emot 'hotels'
        await RoomSeedData.Seed(context);
    }
}