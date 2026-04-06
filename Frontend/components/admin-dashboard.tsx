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
import { 
  getHotels, 
  getCities, 
  createHotel, 
  updateHotel, 
  deleteHotel, 
  type Hotel as HotelType,
  type City,
} from '@/lib/hotel-data';

export function AdminDashboard(){
  const router = useRouter();

const [hotelList, setHotelList] = useState<HotelType[]>([]);
const [cityList, setCityList] = useState<City[]>([]);
const [searchQuery, setSearchQuery] = useState('');
const [showAddDialog, setShowAddDialog] = useState(false);
const [showEditDialog, setShowEditDialog] = useState(false);
const [editingHotel, setEditingHotel] = useState<HotelType | null>(null);
const [deleteTarget, setDeleteTarget] = useState<HotelType | null>(null);
const [expandedHotel, setExpandedHotel] = useState<number | null>(null);

const [newHotel, setNewHotel] = useState({
  name: '',
  cityId: '',
  address: '',
  description: '',
  pricePerNight: '',
  rating: '',
  amenities: '',
  image: '',
  urlSlug: '',
  reviewCount: '0',
});

const [editHotelForm, setEditHotelForm] = useState({
  name: '',
  cityId: '',
  address: '',
  description: '',
  pricePerNight: '',
  rating: '',
  amenities: '',
  image: '',
  urlSlug: '',
  reviewCount: '0',
});


  useEffect(() => {
    getHotels().then(setHotelList);
  }, []);

  useEffect(() => {
  getCities().then(setCityList);
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

  function openEditHotelDialog(hotel: HotelType) {
  setEditingHotel(hotel);

  const matchedCity = cityList.find((city) => city.name === hotel.cityName);

  setEditHotelForm({
    name: hotel.name,
    cityId: matchedCity ? String(matchedCity.id) : '',
    address: hotel.address,
    description: hotel.description,
    pricePerNight: String(hotel.pricePerNight),
    rating: String(hotel.rating),
    amenities: hotel.amenities,
    image: hotel.image,
    urlSlug: hotel.urlSlug,
    reviewCount: String(hotel.reviewCount),
  });

  setShowEditDialog(true);
}

  async function handleDeleteHotel() {
  if (!deleteTarget) return;

  try {
    await deleteHotel(deleteTarget.id);
    setHotelList((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    setDeleteTarget(null);
  } catch (error) {
    console.error('Failed to delete hotel:', error);
  }
}


async function handleAddHotel(e: React.FormEvent) {
  e.preventDefault();

  try {
    const createdHotel = await createHotel({
      name: newHotel.name,
      description: newHotel.description,
      pricePerNight: Number(newHotel.pricePerNight),
      image: newHotel.image,
      urlSlug: newHotel.urlSlug,
      address: newHotel.address,
      rating: Number(newHotel.rating),
      reviewCount: Number(newHotel.reviewCount),
      amenities: newHotel.amenities,
      cityId: Number(newHotel.cityId),
    });

    setHotelList((prev) => [...prev, createdHotel]);

    setNewHotel({
      name: '',
      cityId: '',
      address: '',
      description: '',
      pricePerNight: '',
      rating: '',
      amenities: '',
      image: '',
      urlSlug: '',
      reviewCount: '0',
    });

    setShowAddDialog(false);
  } catch (error) {
    console.error('Failed to create hotel:', error);
  }
}

async function handleEditHotel(e: React.FormEvent) {
  e.preventDefault();
  if (!editingHotel) return;

  try {
    const updatedHotel = await updateHotel(editingHotel.id, {
      name: editHotelForm.name,
      description: editHotelForm.description,
      pricePerNight: Number(editHotelForm.pricePerNight),
      image: editHotelForm.image,
      urlSlug: editHotelForm.urlSlug,
      address: editHotelForm.address,
      rating: Number(editHotelForm.rating),
      reviewCount: Number(editHotelForm.reviewCount),
      amenities: editHotelForm.amenities,
      cityId: Number(editHotelForm.cityId),
    });

    setHotelList((prev) =>
      prev.map((hotel) =>
        hotel.id === editingHotel.id ? updatedHotel : hotel
      )
    );

    setShowEditDialog(false);
    setEditingHotel(null);
  } catch (error) {
    console.error('Failed to update hotel:', error);
  }
}


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

            <Button
            className='gap-2 bg-foreground text-background hover:bg-foreground/90'
            onClick={() => setShowAddDialog(true)}
>
            <Plus className='h-4 w-4' />
            <span className='hidden sm:inline'>Add Hotel</span>
            </Button>
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
                  onClick={() => setShowAddDialog(true)}
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
                         className='gap-1.5'
                         onClick={() => openEditHotelDialog(hotel)}
                        >
                          Edit
                        </Button>

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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
        <Label htmlFor='hotel-name'>Hotel Name</Label>
        <Input
          id='hotel-name'
          value={newHotel.name}
          onChange={(e) =>
            setNewHotel({ ...newHotel, name: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='hotel-city'>City</Label>
        <select
          id='hotel-city'
          className='rounded-md border border-border bg-background px-3 py-2 text-sm'
          value={newHotel.cityId}
          onChange={(e) =>
            setNewHotel({ ...newHotel, cityId: e.target.value })
          }
          required
        >
          <option value=''>Select city</option>
          {cityList.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='hotel-address'>Address</Label>
        <Input
          id='hotel-address'
          value={newHotel.address}
          onChange={(e) =>
            setNewHotel({ ...newHotel, address: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='hotel-description'>Description</Label>
        <Textarea
          id='hotel-description'
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
          <Label htmlFor='hotel-price'>Price Per Night</Label>
          <Input
            id='hotel-price'
            type='number'
            value={newHotel.pricePerNight}
            onChange={(e) =>
              setNewHotel({ ...newHotel, pricePerNight: e.target.value })
            }
            required
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='hotel-rating'>Rating</Label>
          <Input
            id='hotel-rating'
            type='number'
            step='0.1'
            value={newHotel.rating}
            onChange={(e) =>
              setNewHotel({ ...newHotel, rating: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='hotel-amenities'>Amenities</Label>
        <Input
          id='hotel-amenities'
          value={newHotel.amenities}
          onChange={(e) =>
            setNewHotel({ ...newHotel, amenities: e.target.value })
          }
          placeholder='Spa, Restaurant, Wi-Fi'
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='hotel-image'>Image URL</Label>
        <Input
          id='hotel-image'
          value={newHotel.image}
          onChange={(e) =>
            setNewHotel({ ...newHotel, image: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='hotel-slug'>Url Slug</Label>
        <Input
          id='hotel-slug'
          value={newHotel.urlSlug}
          onChange={(e) =>
            setNewHotel({ ...newHotel, urlSlug: e.target.value })
          }
          required
        />
      </div>

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
</Dialog>

<Dialog
  open={showEditDialog}
  onOpenChange={(open) => {
    setShowEditDialog(open);
    if (!open) setEditingHotel(null);
  }}
>
  <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
    <DialogHeader>
      <DialogTitle className='font-serif text-xl'>
        Edit Hotel
      </DialogTitle>
      <DialogDescription>
        Update hotel information.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleEditHotel} className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-name'>Hotel Name</Label>
        <Input
          id='edit-hotel-name'
          value={editHotelForm.name}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, name: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-city'>City</Label>
        <select
          id='edit-hotel-city'
          className='rounded-md border border-border bg-background px-3 py-2 text-sm'
          value={editHotelForm.cityId}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, cityId: e.target.value })
          }
          required
        >
          <option value=''>Select city</option>
          {cityList.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-address'>Address</Label>
        <Input
          id='edit-hotel-address'
          value={editHotelForm.address}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, address: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-description'>Description</Label>
        <Textarea
          id='edit-hotel-description'
          value={editHotelForm.description}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, description: e.target.value })
          }
          rows={3}
          required
        />
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='edit-hotel-price'>Price Per Night</Label>
          <Input
            id='edit-hotel-price'
            type='number'
            value={editHotelForm.pricePerNight}
            onChange={(e) =>
              setEditHotelForm({
                ...editHotelForm,
                pricePerNight: e.target.value,
              })
            }
            required
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <Label htmlFor='edit-hotel-rating'>Rating</Label>
          <Input
            id='edit-hotel-rating'
            type='number'
            step='0.1'
            value={editHotelForm.rating}
            onChange={(e) =>
              setEditHotelForm({ ...editHotelForm, rating: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-amenities'>Amenities</Label>
        <Input
          id='edit-hotel-amenities'
          value={editHotelForm.amenities}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, amenities: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-image'>Image URL</Label>
        <Input
          id='edit-hotel-image'
          value={editHotelForm.image}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, image: e.target.value })
          }
          required
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <Label htmlFor='edit-hotel-slug'>Url Slug</Label>
        <Input
          id='edit-hotel-slug'
          value={editHotelForm.urlSlug}
          onChange={(e) =>
            setEditHotelForm({ ...editHotelForm, urlSlug: e.target.value })
          }
          required
        />
      </div>

      <div className='flex justify-end gap-2'>
        <Button
          type='button'
          variant='ghost'
          onClick={() => {
            setShowEditDialog(false);
            setEditingHotel(null);
          }}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='bg-foreground text-background hover:bg-foreground/90'
        >
          Save Changes
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

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
              onClick={handleDeleteHotel} 
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
