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

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalHotels: number;
  totalCities: number;
  totalRooms: number;
  averageRating: number;
}

export interface CreateBookingPayload {
  hotelId: number;
  roomId: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface BookingResponse {
  id: number;
  hotelId: number;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<BookingResponse> {
  const token = localStorage.getItem('token');

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || 'Failed to create booking');
  }

  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function getHotels(params?: {
  cityId?: number;
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<Hotel>> {
  const query = new URLSearchParams();
  if (params?.cityId) query.set('cityId', String(params.cityId));
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const qs = query.toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels${qs ? `?${qs}` : ''}`,
  );
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

export async function getCities(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PagedResult<City>> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.pageSize) query.set('pageSize', String(params.pageSize));
  const qs = query.toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities${qs ? `?${qs}` : ''}`,
  );
  if (!res.ok) throw new Error('Failed to fetch cities');
  return res.json();
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels?slug=${slug}`
  );

  if (!res.ok) throw new Error("Failed to fetch hotel");

  const data: Hotel[] = await res.json();

  return data.length > 0 ? data[0] : null;
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities?slug=${slug}`
  );

  if (!res.ok) throw new Error("Failed to fetch city");

  const data: City[] = await res.json();

  return data.length > 0 ? data[0] : null;
}

export interface CreateCityPayload {
  name: string;
  image: string;
  urlSlug: string;
}

export interface UpdateCityPayload {
  name: string;
  image: string;
  urlSlug: string;
}

export interface CreateHotelPayload {
  name: string;
  description: string;
  pricePerNight: number;
  image: string;
  urlSlug: string;
  address: string;
  rating: number;
  reviewCount: number;
  amenities: string;
  cityId: number;
}

export interface UpdateHotelPayload {
  name: string;
  description: string;
  pricePerNight: number;
  image: string;
  urlSlug: string;
  address: string;
  rating: number;
  reviewCount: number;
  amenities: string;
  cityId: number;
}

export interface Room {
  id: number;
  hotelId: number;
  name: string;
  roomType?: string;
  pricePerNight: number;
  capacity: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CreateRoomPayload {
  hotelId: number;
  name: string;
  roomType?: string;
  pricePerNight: number;
  capacity: number;
  description?: string;
  imageUrl?: string;
  isAvailable: boolean;
}

export async function createCity(payload: CreateCityPayload): Promise<City> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function updateCity(
  id: number,
  payload: UpdateCityPayload,
): Promise<City> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function deleteCity(id: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/cities/${id}`,
    {
      method: 'DELETE',
    },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function createHotel(payload: CreateHotelPayload): Promise<Hotel> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function updateHotel(
  id: number,
  payload: UpdateHotelPayload,
): Promise<Hotel> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function deleteHotel(id: number): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/hotels/${id}`,
    {
      method: 'DELETE',
    },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function getRooms(): Promise<Room[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
}

export async function getRoomById(id: number): Promise<Room> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`);
  if (!res.ok) throw new Error('Failed to fetch room');
  return res.json();
}

export async function getRoomsByHotelId(hotelId: number): Promise<Room[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/hotel/${hotelId}`,
  );
  if (!res.ok) throw new Error('Failed to fetch rooms for hotel');
  return res.json();
}

export async function createRoom(payload: CreateRoomPayload): Promise<Room> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
