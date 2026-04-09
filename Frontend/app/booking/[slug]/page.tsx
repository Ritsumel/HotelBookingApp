'use client';

import { useEffect, useState } from 'react';
import {
  getHotelBySlug,
  getRooms,
  type Hotel,
  type Room,
} from '@/lib/hotel-data';
import { HotelDetailsContent } from '@/components/hotel-details-content';
import { useParams, useSearchParams } from 'next/navigation';

export default function HotelPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  const urlCheckIn = searchParams.get('checkIn');
  const urlCheckOut = searchParams.get('checkOut');

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(urlCheckIn || today);
  const [checkOut, setCheckOut] = useState(urlCheckOut || tomorrowStr);

  useEffect(() => {
    async function fetchData() {
      try {
        const hotelData = await getHotelBySlug(slug);
        const roomData = await getRooms();

        setHotel(hotelData);
        setRooms(roomData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className='p-10'>Loading...</div>;
  }

  if (!hotel) {
    return <div className='p-10'>Hotel not found</div>;
  }

  return (
    <>
      <div className='mx-auto max-w-7xl px-6 pt-28 pb-4 flex gap-4'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            Check in
          </label>
          <input
            type='date'
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className='rounded-md border border-border bg-background px-3 py-2 text-sm'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            Check out
          </label>
          <input
            type='date'
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className='rounded-md border border-border bg-background px-3 py-2 text-sm'
          />
        </div>
      </div>
      <HotelDetailsContent
        hotel={hotel}
        rooms={rooms}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        showBooking={showBooking}
        setShowBooking={setShowBooking}
        checkIn={checkIn}
        checkOut={checkOut}
      />
    </>
  );
}
