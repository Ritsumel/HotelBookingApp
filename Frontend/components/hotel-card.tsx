'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import type { Hotel, Room } from '@/lib/hotel-data';
import { createBooking } from '@/lib/hotel-data';

interface HotelCardProps {
  hotel: Hotel;
  rooms: Room[];
  checkIn: string;
  checkOut: string;
  guests: string;
}

export function HotelCard({
  hotel,
  rooms,
  checkIn,
  checkOut,
  guests,
}: HotelCardProps) {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    setIsLoggedIn(!!token);

    if (token && savedUser) {
      try {
        const user = JSON.parse(savedUser);

        const rawName = user.fullName || user.FullName || '';
        const email = user.email || user.Email || '';

        if (rawName) {
          const parts = rawName.trim().split(/\s+/);
          setFormData({
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            email: email,
            phone: '',
          });
        } else {
          setFormData((prev) => ({ ...prev, email: email }));
        }
      } catch (e) {
        console.error('Error parsing user info', e);
      }
    }
  }, [showBooking]);

  const isFormValid =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.email.includes('@') &&
    checkIn &&
    checkOut;

  async function handleBook() {
    if (!isFormValid || !selectedRoom) return;

    setIsBookingLoading(true);

    try {
      await createBooking({
        hotelId: hotel.id,
        roomId: selectedRoom.id,
        guestName: `${formData.firstName} ${formData.lastName}`,
        checkIn: checkIn!,
        checkOut: checkOut!,
        guests: parseInt(guests),
      });

      setIsBooked(true);
      setTimeout(() => {
        setShowBooking(false);
        setIsBooked(false);
        setSelectedRoom(null);
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
      }, 2500);
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'An error occurred during booking.');
    } finally {
      setIsBookingLoading(false);
    }
  }

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
            <div className='flex flex-col gap-3'>
              <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                Available Rooms
              </p>

              {rooms.length === 0 ? (
                <p className='text-sm text-muted-foreground'>
                  No rooms available for this hotel yet.
                </p>
              ) : (
                rooms
                  .filter((room) => room.isAvailable)
                  .map((room) => (
                    <div
                      key={room.id}
                      className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background p-3'
                    >
                      <div className='flex-1'>
                        <h4 className='text-sm font-semibold text-foreground'>
                          {room.name}
                        </h4>

                        <div className='mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground'>
                          {room.roomType && <span>{room.roomType}</span>}
                          <span className='flex items-center gap-1'>
                            <Users className='h-3 w-3' />
                            Up to {room.capacity}
                          </span>
                        </div>

                        {room.description && (
                          <p className='mt-1 text-xs text-muted-foreground'>
                            {room.description}
                          </p>
                        )}
                      </div>

                      <div className='flex items-center gap-4'>
                        <div className='text-right'>
                          <p className='text-lg font-bold text-foreground'>
                            {room.pricePerNight} SEK
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            per night
                          </p>
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
                  ))
              )}
            </div>
          </div>
        </div>
      </article>
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent
          className='sm:max-w-lg'
          onOpenAutoFocus={(e) => {
            e.preventDefault();

            const input = document.getElementById(
              'firstName',
            ) as HTMLInputElement;

            if (input) {
              input.focus();
              const length = input.value.length;
              input.setSelectionRange(length, length);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle className='font-serif text-xl'>
              Complete Your Reservation
            </DialogTitle>
            <DialogDescription>
              {hotel.name} &middot; {selectedRoom?.name}
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
                Your reservation has been received. Enjoy your stay!
              </p>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              <div className='rounded-lg bg-secondary p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-semibold text-foreground'>
                      {selectedRoom?.name}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {checkIn || 'Select dates'} — {checkOut || 'Select dates'}
                      {' · '} {guests}{' '}
                      {Number(guests) === 1 ? 'guest' : 'guests'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-lg font-bold text-foreground'>
                      {(selectedRoom?.pricePerNight ?? 0) * nights} SEK
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {nights} {nights === 1 ? 'night' : 'nights'}
                    </p>
                  </div>
                </div>

                {(!checkIn || !checkOut) && (
                  <p className='mt-2 text-xs font-medium text-destructive'>
                    Please select dates in the search bar first.
                  </p>
                )}
              </div>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='firstName' className='text-xs'>
                    First Name
                  </Label>
                  <Input
                    id='firstName'
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder='Erik'
                    disabled={isBookingLoading}
                  />
                </div>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='lastName' className='text-xs'>
                    Last Name
                  </Label>
                  <Input
                    id='lastName'
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder='Svensson'
                    disabled={isBookingLoading}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='email' className='text-xs'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder='erik@example.com'
                  disabled={isBookingLoading}
                />
              </div>

              <Button
                className='mt-2 w-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50'
                onClick={handleBook}
                disabled={!isFormValid || isBookingLoading}
              >
                {isBookingLoading
                  ? 'Processing...'
                  : !checkIn || !checkOut
                    ? 'Select Dates to Book'
                    : 'Confirm Reservation'}
              </Button>

              <p className='text-center text-xs text-muted-foreground'>
                {isLoggedIn
                  ? 'Logged in: This booking will be saved to your profile.'
                  : 'Booking as guest. No account required.'}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
