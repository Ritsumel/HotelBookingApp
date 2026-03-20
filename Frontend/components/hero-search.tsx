'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CalendarDays, Users } from 'lucide-react';
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
import { getCities } from '@/lib/hotel-data';

export function HeroSearch() {
  const router = useRouter();
  const [city, setCity] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [cities, setCities] = useState<string[]>([]);

  function handleSearch() {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    router.push(`/booking?${params.toString()}`);
  }

  useEffect(() => {
    getCities().then((data) => {
      setCities(data.map((c) => c.name));
    });
  }, []);

  return (
    <div className='w-full rounded-xl border border-border bg-card p-4 shadow-lg md:p-6'>
      <div className='grid gap-4 md:grid-cols-4 md:gap-3'>
        <div className='flex flex-col gap-1.5'>
          <Label
            htmlFor='city'
            className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'
          >
            <Search className='h-3.5 w-3.5' />
            Destination
          </Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger id='city' className='bg-background'>
              <SelectValue placeholder='Choose a city' />
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
          <Label
            htmlFor='check-in'
            className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'
          >
            <CalendarDays className='h-3.5 w-3.5' />
            Check in
          </Label>
          <Input
            id='check-in'
            type='date'
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className='bg-background'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label
            htmlFor='check-out'
            className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'
          >
            <CalendarDays className='h-3.5 w-3.5' />
            Check out
          </Label>
          <Input
            id='check-out'
            type='date'
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className='bg-background'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label
            htmlFor='guests'
            className='flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground'
          >
            <Users className='h-3.5 w-3.5' />
            Guests
          </Label>
          <div className='flex gap-2'>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger id='guests' className='bg-background'>
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
            <Button
              onClick={handleSearch}
              className='shrink-0 bg-foreground text-background hover:bg-foreground/90'
              aria-label='Search hotels'
            >
              <Search className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
