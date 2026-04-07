'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, CalendarDays, Users, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HotelCard } from '@/components/hotel-card';
import {
  getHotels,
  getCities,
  getRooms,
  type Hotel,
  type Room,
  type City,
} from '@/lib/hotel-data';

export function BookingContent() {
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || 'All Cities');
  const [cities, setCities] = useState<string[]>(['All Cities']);
  const [cityObjects, setCityObjects] = useState<City[]>([]);
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');
  const [sortBy, setSortBy] = useState('recommended');
  const [hotelList, setHotelList] = useState<Hotel[]>([]);
  const [roomList, setRoomList] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getRooms().then(setRoomList).catch(console.error);
  }, []);

  useEffect(() => {
    getCities({ pageSize: 100 }).then((data) => {
      setCityObjects(data.items);
      setCities(['All Cities', ...data.items.map((c) => c.name)]);
    });
  }, []);

  useEffect(() => {
    const selectedCity = cityObjects.find((c) => c.name === city);
    const params = {
      ...(selectedCity && { cityId: selectedCity.id }),
      page: currentPage,
      pageSize: pageSize,
    };

    getHotels(params).then((response) => {
      setHotelList(response.items);
      setTotalPages(response.totalPages);
    });
  }, [city, cityObjects, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [city]);

  const filteredHotels = hotelList.sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerNight - b.pricePerNight;
    if (sortBy === 'price-high') return b.pricePerNight - a.pricePerNight;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className='mx-auto max-w-7xl px-6 pb-24 pt-28'>
      <div className='mb-8'>
        <h1 className='font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
          Find Your Stay
        </h1>
        <p className='mt-2 text-base text-muted-foreground'>
          Browse our hotels across Sweden and book your perfect room.
        </p>
      </div>

      <div className='mb-8 rounded-xl border border-border bg-card p-4'>
        <div className='grid gap-3 md:grid-cols-5'>
          <div className='flex flex-col gap-1.5'>
            <Label className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              <Search className='h-3.5 w-3.5' />
              City
            </Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className='bg-background'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              <CalendarDays className='h-3.5 w-3.5' />
              Check in
            </Label>
            <Input
              type='date'
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className='bg-background'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              <CalendarDays className='h-3.5 w-3.5' />
              Check out
            </Label>
            <Input
              type='date'
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className='bg-background'
            />
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              <Users className='h-3.5 w-3.5' />
              Guests
            </Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className='bg-background'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-1.5'>
            <Label className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              <SlidersHorizontal className='h-3.5 w-3.5' />
              Sort by
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='bg-background'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='recommended'>Recommended</SelectItem>
                <SelectItem value='price-low'>Price: Low to High</SelectItem>
                <SelectItem value='price-high'>Price: High to Low</SelectItem>
                <SelectItem value='rating'>Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className='mb-6 flex items-center justify-between border-b border-border pb-4'>
        {/* Vänster: Info */}
        <div className='flex flex-col'>
          <p className='text-sm font-medium text-foreground'>
            {hotelList.length > 0
              ? `${filteredHotels.length} hotels found`
              : 'Searching...'}
            {city !== 'All Cities' && (
              <span className='text-muted-foreground'> in {city}</span>
            )}
          </p>
          <p className='text-xs text-muted-foreground'>
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Höger: Kontroller */}
        {totalPages > 1 && (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className='h-8 w-8 p-0' // Gör dem kvadratiska och kompakta uppe
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className='sr-only'>Previous</span>
              {/* Lägg gärna in en lucide-react ikon här, t.ex. <ChevronLeft /> */}
              {'<'}
            </Button>

            <span className='text-xs font-medium px-2'>
              {currentPage} / {totalPages}
            </span>

            <Button
              variant='outline'
              size='sm'
              className='h-8 w-8 p-0'
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <span className='sr-only'>Next</span>
              {'>'}
            </Button>
          </div>
        )}
      </div>
      <div className='flex flex-col gap-6'>
        {filteredHotels.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20'>
            <p className='font-serif text-xl font-bold text-foreground'>
              No hotels found
            </p>
            <p className='mt-2 text-sm text-muted-foreground'>
              Try adjusting your search filters.
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => setCity('All Cities')}
            >
              Show all hotels
            </Button>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              rooms={roomList.filter((room) => room.hotelId === hotel.id)}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
            />
          ))
        )}

        {/* Paginering-kontroller */}
        {hotelList.length > 0 && (
          <div className='mt-12 flex items-center justify-center gap-4'>
            <Button
              variant='outline'
              size='sm'
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Previous
            </Button>

            <span className='text-sm font-medium'>
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant='outline'
              size='sm'
              disabled={currentPage >= totalPages}
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Next
            </Button>
          </div>
        )}
        <p className='text-xs text-muted-foreground'>
          Showing page {currentPage} of {totalPages}
        </p>
      </div>
    </div>
  );
}
