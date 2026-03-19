'use client';

/* Följande imports används av bortkommenterad kod — 
   aktiveras när POST /api/hotels och Room-model finns i backend */
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  LogOut,
  MapPin,
  Star,
  Hotel,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { getHotels, type Hotel as HotelType } from '@/lib/hotel-data';

export function AdminDashboard() {
  const router = useRouter();
  const [hotelList, setHotelList] = useState<HotelType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  /*   const [showAddDialog, setShowAddDialog] = useState(false); */
  const [deleteTarget, setDeleteTarget] = useState<HotelType | null>(null);
  const [expandedHotel, setExpandedHotel] = useState<number | null>(null);

  /* aktivera när POST /api/hotels finns i backend */
  // Form state for adding a new hotel
  /*  const [newHotel, setNewHotel] = useState({
    name: '',
    city: '',
    address: '',
    description: '',
    pricePerNight: '',
    rating: '',
    amenities: '',
  }); */

  useEffect(() => {
    getHotels().then(setHotelList);
  }, []);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role =
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      if (role !== 'Admin') {
        router.push('/');
      }
    } catch {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/');
  }

  /* handleDeleteHotel — behöver skrivas om när DELETE /api/hotels/{id} finns i backend.
   Ska skicka delete-request till API istället för att uppdatera local state */
  /*   function handleDeleteHotel() {
    if (!deleteTarget) return;
    setHotelList((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    setDeleteTarget(null);
  } */

  /* handleAddHotel — behöver skrivas om när POST /api/hotels finns i backend.
   Ska skicka data till API istället för att uppdatera local state */
  /*   function handleAddHotel(e: React.FormEvent) {
    e.preventDefault();

    const hotel: HotelType = {
      id: newHotel.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      name: newHotel.name,
      city: newHotel.city,
      address: newHotel.address,
      description: newHotel.description,
      pricePerNight: Number(newHotel.pricePerNight),
      rating: Number(newHotel.rating) || 4.5,
      reviewCount: 0,
      image: '/images/hotel-room.jpg',
      amenities: newHotel.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
      rooms: [
        {
          id: `${Date.now()}-std`,
          type: 'Standard Room',
          description: 'Comfortable room with Nordic design and city views.',
          pricePerNight: Number(newHotel.pricePerNight),
          capacity: 2,
          size: 24,
          amenities: ['Queen Bed', 'Wi-Fi', 'City View'],
        },
        {
          id: `${Date.now()}-sup`,
          type: 'Superior Room',
          description:
            'Spacious room with lounge area and premium furnishings.',
          pricePerNight: Math.round(Number(newHotel.pricePerNight) * 1.35),
          capacity: 2,
          size: 32,
          amenities: ['King Bed', 'Lounge Area', 'Nespresso'],
        },
        {
          id: `${Date.now()}-suite`,
          type: 'Suite',
          description:
            'Luxury suite with separate living area and premium amenities.',
          pricePerNight: Math.round(Number(newHotel.pricePerNight) * 2.2),
          capacity: 4,
          size: 50,
          amenities: ['King Bed', 'Living Room', 'Premium Mini Bar'],
        },
      ],
    };

    setHotelList((prev) => [...prev, hotel]);
    setNewHotel({
      name: '',
      city: '',
      address: '',
      description: '',
      pricePerNight: '',
      rating: '',
      amenities: '',
    });
    setShowAddDialog(false);
  } */

  const filteredHotels = hotelList.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.cityName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* Aktivera när Room-Model finns i backend */
  /*  const totalRooms = hotelList.reduce((sum, h) => sum + h.rooms.length, 0); */
  const totalRooms = 0;

  return (
    <div className='min-h-screen bg-background'>
      {/* Admin header */}
      <header className='fixed top-0 left-0 right-0 z-50 border-b border-border bg-foreground'>
        <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-6'>
          <div className='flex items-center gap-3'>
            <Link href='/' className='flex items-center gap-2'>
              <span className='font-serif text-xl font-bold text-primary-foreground'>
                MME
              </span>
              <span className='text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground/50'>
                Hotels
              </span>
            </Link>
            <Separator
              orientation='vertical'
              className='mx-1 h-5 bg-primary-foreground/20'
            />
            <span className='text-xs font-medium text-accent'>
              Admin Dashboard
            </span>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='gap-2 text-primary-foreground/60 hover:bg-primary-foreground/10 hover:text-primary-foreground'
            onClick={handleLogout}
          >
            <LogOut className='h-4 w-4' />
            <span className='hidden sm:inline'>Log out</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className='mx-auto max-w-7xl px-6 pt-24 pb-16'>
        {/* Stats bar */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Total Hotels
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {hotelList.length}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Cities
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {new Set(hotelList.map((h) => h.cityName)).size}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Total Rooms
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {totalRooms}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Avg. Rating
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {hotelList.length
                ? (
                    hotelList.reduce((s, h) => s + h.rating, 0) /
                    hotelList.length
                  ).toFixed(1)
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className='mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <h1 className='font-serif text-2xl font-bold text-foreground'>
              Hotel Management
            </h1>
            <p className='mt-1 text-sm text-muted-foreground'>
              Manage all MME Hotels properties across Sweden
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className='relative flex-1 md:w-64 md:flex-none'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                placeholder='Search hotels or cities...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9'
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  aria-label='Clear search'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              )}
            </div>

            {/* Add Hotel-knapp — aktivera när POST /api/hotels finns i backend */}

            {/*  <Button
              className='gap-2 bg-foreground text-background hover:bg-foreground/90'
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>Add Hotel</span>
            </Button>  */}
          </div>
        </div>

        {/* Hotel list */}
        <div className='mt-6 flex flex-col gap-4'>
          {filteredHotels.length === 0 ? (
            <div className='flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16'>
              <Hotel className='h-10 w-10 text-muted-foreground/40' />
              <p className='mt-3 font-serif text-lg font-bold text-foreground'>
                {searchQuery ? 'No hotels found' : 'No hotels yet'}
              </p>
              <p className='mt-1 text-sm text-muted-foreground'>
                {searchQuery
                  ? 'Try adjusting your search terms.'
                  : 'Add your first hotel property to get started.'}
              </p>
              {!searchQuery && (
                <Button
                  className='mt-4 gap-2 bg-foreground text-background hover:bg-foreground/90'
                  /*  onClick={() => setShowAddDialog(true)} */
                >
                  <Plus className='h-4 w-4' />
                  Add Hotel
                </Button>
              )}
            </div>
          ) : (
            filteredHotels.map((hotel) => (
              <article
                key={hotel.id}
                className='overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md'
              >
                <div className='grid lg:grid-cols-[220px_1fr]'>
                  <div className='relative aspect-16/10 lg:aspect-auto'>
                    <Image
                      src={hotel.image}
                      alt={`${hotel.name}`}
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex flex-col p-5'>
                    <div className='flex flex-wrap items-start justify-between gap-3'>
                      <div className='flex-1'>
                        <h3 className='font-serif text-lg font-bold text-foreground'>
                          {hotel.name}
                        </h3>
                        <p className='mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground'>
                          <MapPin className='h-3.5 w-3.5' />
                          {hotel.cityName} &mdash; {hotel.address}
                        </p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <div className='flex items-center gap-1 rounded-md bg-secondary px-2 py-1'>
                          <Star className='h-3 w-3 fill-accent text-accent' />
                          <span className='text-xs font-semibold text-foreground'>
                            {hotel.rating}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            ({hotel.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className='mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2'>
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

                    <div className='mt-4 flex items-center justify-between'>
                      <div className='flex items-center gap-4'>
                        <p className='text-sm text-muted-foreground'>
                          <span className='font-semibold text-foreground'>
                            {/* Aktivera när Room-Model finns i backend */}
                            {/* {hotel.rooms.length} */}
                          </span>{' '}
                          room types
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          from{' '}
                          <span className='font-semibold text-foreground'>
                            {hotel.pricePerNight} kr
                          </span>
                          /night
                        </p>
                      </div>

                      <div className='flex items-center gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='gap-1.5 text-muted-foreground'
                          onClick={() =>
                            setExpandedHotel(
                              expandedHotel === hotel.id ? null : hotel.id,
                            )
                          }
                        >
                          {expandedHotel === hotel.id ? (
                            <>
                              <ChevronUp className='h-4 w-4' />
                              <span className='hidden sm:inline'>Less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className='h-4 w-4' />
                              <span className='hidden sm:inline'>Rooms</span>
                            </>
                          )}
                        </Button>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive'
                          onClick={() => setDeleteTarget(hotel)}
                        >
                          <Trash2 className='h-4 w-4' />
                          <span className='hidden sm:inline'>Remove</span>
                        </Button>
                      </div>
                    </div>

                    {/* Expanded room details */}
                    {expandedHotel === hotel.id && (
                      <div className='mt-4 flex flex-col gap-2 border-t border-border pt-4'>
                        <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                          Room Types
                        </p>
                        {/* RoomDetails - aktivera närRoom-model och GET /api/rooms finns i backend */}
                        {/* {hotel.rooms.map((room) => (
                          <div
                            key={room.id}
                            className='flex flex-wrap items-center justify-between gap-2 rounded-lg bg-background p-3'
                          >
                            <div>
                              <p className='text-sm font-semibold text-foreground'>
                                {room.type}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {room.size}m2 &middot; Up to {room.capacity}{' '}
                                guests
                              </p>
                            </div>
                            <p className='text-sm font-bold text-foreground'>
                              {room.pricePerNight} kr
                              <span className='text-xs font-normal text-muted-foreground'>
                                /night
                              </span>
                            </p>
                          </div>
                        ))} */}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>

      {/* Add Hotel Dialog — aktivera när POST /api/hotels finns i backend */}
      {/*   <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='font-serif text-xl'>
              Add New Hotel
            </DialogTitle>
            <DialogDescription>
              Add a new MME Hotels property to the system.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddHotel} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='hotel-name' className='text-xs font-medium'>
                Hotel Name
              </Label>
              <Input
                id='hotel-name'
                placeholder='MME Visby Seaside'
                value={newHotel.name}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, name: e.target.value })
                }
                required
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='hotel-city' className='text-xs font-medium'>
                  City
                </Label>
                <Input
                  id='hotel-city'
                  placeholder='Visby'
                  value={newHotel.city}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, city: e.target.value })
                  }
                  required
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='hotel-price' className='text-xs font-medium'>
                  Starting Price (SEK/night)
                </Label>
                <Input
                  id='hotel-price'
                  type='number'
                  placeholder='1490'
                  value={newHotel.pricePerNight}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, pricePerNight: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='hotel-address' className='text-xs font-medium'>
                Address
              </Label>
              <Input
                id='hotel-address'
                placeholder='Strandgatan 12, 621 56 Visby'
                value={newHotel.address}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, address: e.target.value })
                }
                required
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label
                htmlFor='hotel-description'
                className='text-xs font-medium'
              >
                Description
              </Label>
              <Textarea
                id='hotel-description'
                placeholder='A seaside retreat on the stunning island of Gotland...'
                value={newHotel.description}
                onChange={(e) =>
                  setNewHotel({ ...newHotel, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='hotel-rating' className='text-xs font-medium'>
                  Rating (1-5)
                </Label>
                <Input
                  id='hotel-rating'
                  type='number'
                  step='0.1'
                  min='1'
                  max='5'
                  placeholder='4.5'
                  value={newHotel.rating}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, rating: e.target.value })
                  }
                />
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label
                  htmlFor='hotel-amenities'
                  className='text-xs font-medium'
                >
                  Amenities
                </Label>
                <Input
                  id='hotel-amenities'
                  placeholder='Spa, Restaurant, Wi-Fi'
                  value={newHotel.amenities}
                  onChange={(e) =>
                    setNewHotel({ ...newHotel, amenities: e.target.value })
                  }
                />
                <p className='text-[10px] text-muted-foreground'>
                  Comma-separated list
                </p>
              </div>
            </div>

            <Separator />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-foreground text-background hover:bg-foreground/90'
              >
                Add Hotel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog> */}

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='font-serif'>
              Remove Hotel
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{deleteTarget?.name}</strong> from the system? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              /*  onClick={handleDeleteHotel} */
              className='bg-destructive text-card hover:bg-destructive/90'
            >
              Remove Hotel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
