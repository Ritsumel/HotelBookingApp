'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, MapPin, Users, Maximize, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Hotel } from '@/lib/hotel-data';

interface HotelCardProps {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  guests: string;
}

export function HotelCard({
  hotel,
  checkIn,
  checkOut,
  guests,
}: HotelCardProps) {
  /* Aktivera när Room-Model finns i backend */
  /*const [selectedRoom, setSelectedRoom] = useState<Room | null>(null); 
    const [showBooking, setShowBooking] = useState(false);
    const [isBooked, setIsBooked] = useState(false); */

  const nights =
    checkIn && checkOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

  /* Lägg till när Room-Model finns i backend */
  /*   function handleBook() {
    setIsBooked(true);
    setTimeout(() => {
      setShowBooking(false);
      setIsBooked(false);
      setSelectedRoom(null);
    }, 2000);
  } */

  return (
    <>
      <article className='overflow-hidden rounded-xl border border-border bg-card'>
        <div className='grid lg:grid-cols-[320px_1fr]'>
          <div className='relative aspect-4/3 lg:aspect-auto'>
            <Image
              src={hotel.image}
              alt={`${hotel.name} exterior`}
              fill
              className='object-cover'
            />
          </div>

          <div className='flex flex-col p-6'>
            <div className='flex flex-wrap items-start justify-between gap-2'>
              <div>
                <h3 className='font-serif text-xl font-bold text-foreground'>
                  {hotel.name}
                </h3>
                <p className='mt-1 flex items-center gap-1.5 text-sm text-muted-foreground'>
                  <MapPin className='h-3.5 w-3.5' />
                  {hotel.address}
                </p>
              </div>
              <div className='flex items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1'>
                <Star className='h-3.5 w-3.5 fill-accent text-accent' />
                <span className='text-sm font-semibold text-primary-foreground'>
                  {hotel.rating}
                </span>
                <span className='text-xs text-primary-foreground/60'>
                  ({hotel.reviewCount})
                </span>
              </div>
            </div>

            <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
              {hotel.description}
            </p>

            <div className='mt-3 flex flex-wrap gap-1.5'>
              {hotel.amenities.split(', ').map((amenity) => (
                <Badge
                  key={amenity}
                  variant='secondary'
                  className='text-xs font-normal'
                >
                  {amenity}
                </Badge>
              ))}
            </div>

            <Separator className='my-4' />

            {/* Rumssektion — aktivera när Room-model finns i backend */}
            {/*  <div className='flex flex-col gap-3'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Available Rooms
              </p>
              {hotel.rooms.map((room) => (
                <div
                  key={room.id}
                  className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-3'
                >
                  <div className='flex-1'>
                    <h4 className='text-sm font-semibold text-foreground'>
                      {room.type}
                    </h4>
                    <div className='mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Users className='h-3 w-3' />
                        Up to {room.capacity}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Maximize className='h-3 w-3' />
                        {room.size} m2
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='text-right'>
                      <p className='text-lg font-bold text-foreground'>
                        {room.pricePerNight} kr
                      </p>
                      <p className='text-xs text-muted-foreground'>per night</p>
                    </div>
                    <Button
                      size='sm'
                      className='bg-foreground text-background hover:bg-foreground/90'
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowBooking(true);
                      }}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>  */}
          </div>
        </div>
      </article>

      {/* Bokningsmodul - aktivera när Room-model finns i backend */}
      {/*  <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='font-serif text-xl'>
              Complete Your Reservation
            </DialogTitle>
            <DialogDescription>
              {hotel.name} &middot; {{selectedRoom?.type}}
            </DialogDescription>
          </DialogHeader>

          {isBooked ? (
            <div className='flex flex-col items-center gap-3 py-8'>
              <div className='flex h-14 w-14 items-center justify-center rounded-full bg-foreground'>
                <Check className='h-7 w-7 text-primary-foreground' />
              </div>
              <h3 className='font-serif text-xl font-bold text-foreground'>
                Booking Confirmed
              </h3>
              <p className='text-center text-sm text-muted-foreground'>
                A confirmation email has been sent to your inbox.
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='rounded-lg bg-secondary p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>
                      {{selectedRoom?.type}}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {checkIn || 'Select dates'} {' - '}{' '}
                      {checkOut || 'Select dates'} &middot; {guests}{' '}
                      {Number(guests) === 1 ? 'guest' : 'guests'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-foreground'>
                      {(selectedRoom?.pricePerNight ?? 0) * nights} kr
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {nights} {nights === 1 ? 'night' : 'nights'}
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='firstName' className='text-xs'>
                    First Name
                  </Label>
                  <Input id='firstName' placeholder='Erik' />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='lastName' className='text-xs'>
                    Last Name
                  </Label>
                  <Input id='lastName' placeholder='Svensson' />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='email' className='text-xs'>
                  Email
                </Label>
                <Input id='email' type='email' placeholder='erik@example.com' />
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='phone' className='text-xs'>
                  Phone
                </Label>
                <Input id='phone' type='tel' placeholder='+46 70 123 45 67' />
              </div>

              <Button
                className='mt-2 w-full bg-foreground text-background hover:bg-foreground/90'
                onClick={handleBook}
              >
                Confirm Reservation
              </Button>

              <p className='text-center text-xs text-muted-foreground'>
                Free cancellation up to 48 hours before check-in
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </>
  );
}
