export interface Hotel {
  id: number;
  name: string;
  cityName: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  pricePerNight: number;
  amenities: string;
  urlSlug: string;
}

export interface City {
  id: number;
  name: string;
  image: string;
  urlSlug: string;
}

export async function getHotels(): Promise<Hotel[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels`);
  if (!res.ok) throw new Error('Failed to fetch hotels');
  return res.json();
}

export async function getHotelById(id: number): Promise<Hotel> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/${id}`,
  );
  if (!res.ok) throw new Error('Failed to fetch hotel');
  return res.json();
}

export async function getCities(): Promise<City[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`);
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}
