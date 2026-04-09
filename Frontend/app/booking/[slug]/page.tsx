'use client';

import { useEffect, useState } from "react";
import { getHotelBySlug, getRooms, type Hotel, type Room } from "@/lib/hotel-data";
import { HotelDetailsContent } from "@/components/hotel-details-content";
import { useParams } from "next/navigation";

export default function HotelPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  function handleBook() {
    setIsBooked(true);
    setTimeout(() => {
      setShowBooking(false);
      setIsBooked(false);
      setSelectedRoom(null);
    }, 2000);
  }

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
    return <div className="p-10">Loading...</div>;
  }

  if (!hotel) {
    return <div className="p-10">Hotel not found</div>;
  }

  return (
    <HotelDetailsContent
      hotel={hotel}
      rooms={rooms}
      selectedRoom={selectedRoom}
      setSelectedRoom={setSelectedRoom}
      showBooking={showBooking}
      setShowBooking={setShowBooking}
      isBooked={isBooked}
      handleBook={handleBook}
    />
  );
}