'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    checkIn !== '' &&
    checkOut !== '';

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
      <Link href={`/booking/${hotel.urlSlug}`}>
        <article className='overflow-hidden rounded-xl border border-border bg-card'>
          <div className='grid lg:grid-cols-[320px_1fr]'>
            <div className='relative aspect-4/3 lg:aspect-auto'>
              <Image
                src={
                  hotel.image && hotel.image.startsWith('http')
                    ? hotel.image
                    : '/hotel.jpg'
                }
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
            </div>
          </div>
        </article>
      </Link>
    </>
  );
}
