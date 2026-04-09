'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Check, Star, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { Hotel, Room } from '@/lib/hotel-data';

export function HotelDetailsContent({
  hotel,
  rooms,
  selectedRoom,
  setSelectedRoom,
  showBooking,
  setShowBooking,
  isBooked,
  handleBook,
}: {
  hotel: Hotel;
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;
  showBooking: boolean;
  setShowBooking: (value: boolean) => void;
  isBooked: boolean;
  handleBook: () => void;
}) {
  const hotelRooms = rooms.filter(
    (r) => r.hotelId === hotel.id
  );

  const lowestPrice =
  hotelRooms.length > 0
    ? Math.min(...hotelRooms.map((r) => r.pricePerNight))
    : hotel.pricePerNight;

  const fakeReviews = [
    {
      name: "Anna",
      rating: 5,
      text: "Amazing stay, very clean and great service!",
    },
    {
      name: "Erik",
      rating: 4,
      text: "Great location and comfortable rooms.",
    },
    {
      name: "Sofia",
      rating: 5,
      text: "Loved it! Would definitely come back.",
    },
  ];

  const [selectedImage, setSelectedImage] = useState<string>(hotel.image);

  const galleryImages: string[] = [
    hotel.image,
    ...hotelRooms
      .map((r) => r.imageUrl)
      .filter((img): img is string => !!img)
      .slice(0, 5),
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pb-15 pt-28">

      {/* HOTEL INFO */}
      <div className="grid gap-8 lg:grid-cols-2 items-stretch">

      {/* IMAGE */}
      <div className="w-full h-[420px]">
        <img
          src={selectedImage}
          alt={hotel.name}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>

      {/* INFO */}
      <div className="flex flex-col justify-between h-full">

      {/* TITLE */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">{hotel.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {hotel.cityName} — {hotel.address}
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="text-sm font-semibold text-primary-foreground">
            {hotel.rating}
          </span>
          <span className="text-xs text-primary-foreground/60">
            ({hotel.reviewCount})
          </span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="text-muted-foreground">
        {hotel.description}
      </p>

      {/* PRICE CARD */}
      <div>
        <p className="text-sm text-muted-foreground">Starting from</p>
        <p className="text-2xl font-bold">
          {lowestPrice} kr
          <span className="text-sm font-normal text-muted-foreground">
            {" "} / night
          </span>
        </p>
      </div>

      {/* AMENITIES */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Amenities
        </p>

        <div className="flex flex-wrap gap-2">
          {hotel.amenities.split(", ").map((a) => (
            <span
              key={a}
              className="text-xs bg-muted px-2 py-1 rounded-md"
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Gallery
        </p>

        <div className="flex gap-2 flex-wrap">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="relative cursor-pointer group"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                className={`h-16 w-24 object-cover rounded-md transition ${
                  selectedImage === img
                    ? "brightness-100"
                    : "brightness-75"
                }`}
              />

              {/* DARK OVERLAY */}
              {selectedImage !== img && (
                <div className="absolute inset-0 bg-black/10 rounded-md transition" />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>

      </div>

      {/* ROOMS SECTION */}
      <div className="mt-10 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available Rooms
        </p>

        {hotelRooms.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rooms available for this hotel yet.
          </p>
        ) : (
          hotelRooms.map((room) => (
            <div
              key={room.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {room.name}
                </h4>

                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  {room.roomType && <span>{room.roomType}</span>}
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Up to {room.capacity}
                  </span>
                </div>

                {room.description && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {room.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {room.pricePerNight} SEK
                  </p>
                  <p className="text-xs text-muted-foreground">
                    per night
                  </p>
                </div>

                <Button
                  size="sm"
                  className="bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowBooking(true);
                  }}
                >
                  Reserve
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* REVIEWS SECTION */}
      <div className="mt-10 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Guest Reviews</p>

        <div className="grid gap-6 md:grid-cols-3">
          {fakeReviews.map((review, i) => (
            <div
              key={i}
              className="bg-muted/50 border border-border/50 p-5 rounded-xl flex flex-col gap-3"
            >
              {/* HEADER */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-sm">⭐ {review.rating}</p>
              </div>

              {/* QUOTE */}
              <p className="text-2xl leading-none text-muted-foreground/40">“</p>

              {/* TEXT */}
              <p className="text-sm italic text-muted-foreground">
                {review.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      <Dialog open={showBooking} onOpenChange={setShowBooking}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Complete Your Reservation
            </DialogTitle>
            <DialogDescription>
              {hotel.name} · {selectedRoom?.name}
            </DialogDescription>
          </DialogHeader>

          {isBooked ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
                <Check className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Booking Confirmed</h3>
              <p className="text-sm text-muted-foreground text-center">
                A confirmation email has been sent.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
              <Input placeholder="Email" />
              <Input placeholder="Phone" />

              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                onClick={handleBook}
              >
                Confirm Reservation
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Free cancellation up to 48 hours before check-in
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}