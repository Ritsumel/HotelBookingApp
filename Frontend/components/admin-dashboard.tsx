'use client';

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
import { PaginationControlled } from '@/components/pagination';
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
  getRooms,
  createHotel,
  updateHotel,
  deleteHotel,
  getDashboardStats,
  type Hotel as HotelType,
  type City,
  type Room,
  type DashboardStats,
} from '@/lib/hotel-data';

export function AdminDashboard() {
  const router = useRouter();

  const [hotelList, setHotelList] = useState<HotelType[]>([]);
  const [cityList, setCityList] = useState<City[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteRoomTarget, setDeleteRoomTarget] = useState<Room | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingHotel, setEditingHotel] = useState<HotelType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HotelType | null>(null);
  const [expandedHotel, setExpandedHotel] = useState<number | null>(null);

  const [showAddRoomDialog, setShowAddRoomDialog] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);

  // pagination + stats (from main)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const [totalCitiesCount, setTotalCitiesCount] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const pageSize = 10;

  // room form (your logic)
  const [newRoomForm, setNewRoomForm] = useState({
    name: '',
    roomType: '',
    pricePerNight: '',
    capacity: '',
    description: '',
    imageUrl: '',
  });

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

  // room edit form
  const [editRoomForm, setEditRoomForm] = useState({
    name: '',
    roomType: '',
    pricePerNight: '',
    capacity: '',
    description: '',
    imageUrl: '',
  });

  function openEditRoom(room: Room) {
    setEditingRoom(room);

    setEditRoomForm({
      name: room.name || '',
      roomType: room.roomType || '',
      pricePerNight: String(room.pricePerNight),
      capacity: String(room.capacity),
      description: room.description || '',
      imageUrl: room.imageUrl || '',
    });
  }

  // stats (from main)
  const fetchStats = useCallback(async () => {
    try {
      const s = await getDashboardStats();
      setStats(s);
      setTotalHotels(s.totalHotels);
      setTotalCitiesCount(s.totalCities);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  }, []);

  // Hämta hotell-listan när sidan ändras
  useEffect(() => {
    getHotels({ page: currentPage, pageSize: 10 }).then((r) => {
      setHotelList(r.items);
      setTotalPages(r.totalPages);
    });
  }, [currentPage]);

  // Hämta stats EN gång när komponenten startar
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    getCities({ pageSize: 100 }).then((r) => setCityList(r.items));
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
      fetchStats();
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
      fetchStats();

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
          hotel.id === editingHotel.id ? updatedHotel : hotel,
        ),
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

  const totalRooms = rooms.length;

  useEffect(() => {
    getRooms().then(setRooms);
  }, []);

  async function handleDeleteRoom(roomId: number) {
    try {
      await fetch(`http://localhost:8000/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.error('Failed to delete room', err);
    }
  }

  async function handleEditRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!editingRoom) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/rooms/${editingRoom.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editRoomForm.name,
            roomType: editRoomForm.roomType,
            pricePerNight: Number(editRoomForm.pricePerNight),
            capacity: Number(editRoomForm.capacity),
            description: editRoomForm.description,
            imageUrl: editRoomForm.imageUrl,
            hotelId: editingRoom.hotelId,
            isAvailable: true,
          }),
        },
      );

      const updated = await res.json();

      setRooms((prev) =>
        prev.map((r) => (r.id === editingRoom.id ? updated : r)),
      );

      setEditingRoom(null);
    } catch (err) {
      console.error('Failed to update room', err);
    }
  }

  async function handleAddRoom(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedHotelId) return;

    try {
      const res = await fetch('http://localhost:8000/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newRoomForm.name,
          roomType: newRoomForm.roomType,
          pricePerNight: Number(newRoomForm.pricePerNight),
          capacity: Number(newRoomForm.capacity),
          description: newRoomForm.description,
          imageUrl: newRoomForm.imageUrl,
          hotelId: selectedHotelId,
          isAvailable: true,
        }),
      });

      const created = await res.json();

      setRooms((prev) => [...prev, created]);

      setShowAddRoomDialog(false);
      setSelectedHotelId(null);

      setNewRoomForm({
        name: '',
        roomType: '',
        pricePerNight: '',
        capacity: '',
        description: '',
        imageUrl: '',
      });
    } catch (err) {
      console.error('Failed to add room', err);
    }
  }

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
              {stats?.totalHotels ?? 0}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Cities
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {stats?.totalCities ?? 0}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Total Rooms
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {stats?.totalRooms ?? 0}
            </p>
          </div>
          <div className='rounded-xl border border-border bg-card p-4'>
            <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Avg. Rating
            </p>
            <p className='mt-1 font-serif text-2xl font-bold text-foreground'>
              {stats?.averageRating ? stats.averageRating.toFixed(1) : 'N/A'}
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

            {/* Add Hotel-knapp */}
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
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalHotels}
          onPageChange={setCurrentPage}
        />
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
            filteredHotels.map((hotel) => {
              const hotelRooms = rooms.filter(
                (r) => r.hotelId === hotel.id && r.isAvailable,
              );

              const lowestPrice =
                hotelRooms.length > 0
                  ? Math.min(...hotelRooms.map((r) => r.pricePerNight))
                  : hotel.pricePerNight;

              return (
                <article
                  key={hotel.id}
                  className='overflow-hidden rounded-xl border border-border bg-card transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-md'
                >
                  <div className='grid lg:grid-cols-[220px_1fr] items-stretch transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]'>
                    <div className='relative w-full h-[200px] lg:h-auto lg:w-[220px]'>
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className='object-cover transition-transform duration-300 ease-in-out'
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
                              {hotelRooms.length}
                            </span>{' '}
                            room types
                          </p>
                          <p className='text-sm text-muted-foreground'>
                            from{' '}
                            <span className='font-semibold text-foreground'>
                              {lowestPrice} kr
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
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          expandedHotel === hotel.id
                            ? 'max-h-65 opacity-100 mt-4 pt-4 border-t border-border'
                            : 'max-h-0 opacity-0 mt-0 pt-0 border-t border-transparent'
                        }`}
                      >
                        <div className='flex flex-col gap-2 max-h-60 overflow-y-auto pr-1'>
                          <div className='flex items-center justify-between'>
                            <p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                              Room Types
                            </p>

                            <Button
                              size='sm'
                              variant='ghost'
                              className='h-7 px-2 text-xs transition-colors hover:bg-black hover:text-white'
                              onClick={() => {
                                setSelectedHotelId(hotel.id);
                                setShowAddRoomDialog(true);
                              }}
                            >
                              + Add Room
                            </Button>
                          </div>

                          {hotelRooms.length === 0 && (
                            <p className='text-xs text-muted-foreground'>
                              No rooms yet
                            </p>
                          )}

                          {hotelRooms.map((room) => (
                            <div
                              key={room.id}
                              className='flex items-center justify-between rounded-lg bg-background p-3'
                            >
                              <div>
                                <p className='text-sm font-semibold'>
                                  {room.name}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                  {room.roomType} · {room.capacity} guests
                                </p>
                              </div>

                              <div className='flex items-center gap-3'>
                                <p className='text-sm font-bold'>
                                  {room.pricePerNight} kr
                                </p>

                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => openEditRoom(room)}
                                >
                                  Edit
                                </Button>

                                <Button
                                  size='sm'
                                  variant='ghost'
                                  className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                                  onClick={() => setDeleteRoomTarget(room)}
                                >
                                  <Trash2 className='h-4 w-4' />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalHotels}
          onPageChange={setCurrentPage}
        />
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
            <DialogTitle className='font-serif text-xl'>Edit Hotel</DialogTitle>
            <DialogDescription>Update hotel information.</DialogDescription>
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
                  setEditHotelForm({
                    ...editHotelForm,
                    address: e.target.value,
                  })
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
                  setEditHotelForm({
                    ...editHotelForm,
                    description: e.target.value,
                  })
                }
                rows={3}
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
                  setEditHotelForm({
                    ...editHotelForm,
                    rating: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='edit-hotel-amenities'>Amenities</Label>
              <Input
                id='edit-hotel-amenities'
                value={editHotelForm.amenities}
                onChange={(e) =>
                  setEditHotelForm({
                    ...editHotelForm,
                    amenities: e.target.value,
                  })
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
                  setEditHotelForm({
                    ...editHotelForm,
                    urlSlug: e.target.value,
                  })
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

      <Dialog
        open={!!editingRoom}
        onOpenChange={(open) => {
          if (!open) setEditingRoom(null);
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='font-serif text-xl'>Edit Room</DialogTitle>
            <DialogDescription>Update room details.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditRoom} className='flex flex-col gap-4'>
            {/* NAME */}
            <div className='flex flex-col gap-1.5'>
              <Label>Room Name</Label>
              <Input
                value={editRoomForm.name}
                onChange={(e) =>
                  setEditRoomForm({ ...editRoomForm, name: e.target.value })
                }
                required
              />
            </div>

            {/* TYPE */}
            <div className='flex flex-col gap-1.5'>
              <Label>Room Type</Label>
              <Input
                value={editRoomForm.roomType}
                onChange={(e) =>
                  setEditRoomForm({ ...editRoomForm, roomType: e.target.value })
                }
              />
            </div>

            {/* PRICE + CAPACITY */}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-1.5'>
                <Label>Price Per Night</Label>
                <Input
                  type='number'
                  value={editRoomForm.pricePerNight}
                  onChange={(e) =>
                    setEditRoomForm({
                      ...editRoomForm,
                      pricePerNight: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className='flex flex-col gap-1.5'>
                <Label>Capacity</Label>
                <Input
                  type='number'
                  value={editRoomForm.capacity}
                  onChange={(e) =>
                    setEditRoomForm({
                      ...editRoomForm,
                      capacity: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className='flex flex-col gap-1.5'>
              <Label>Description</Label>
              <Textarea
                value={editRoomForm.description}
                onChange={(e) =>
                  setEditRoomForm({
                    ...editRoomForm,
                    description: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            {/* IMAGE */}
            <div className='flex flex-col gap-1.5'>
              <Label>Image URL</Label>
              <Input
                value={editRoomForm.imageUrl}
                onChange={(e) =>
                  setEditRoomForm({
                    ...editRoomForm,
                    imageUrl: e.target.value,
                  })
                }
              />
            </div>

            {/* ACTIONS */}
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setEditingRoom(null)}
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

      <Dialog
        open={showAddRoomDialog}
        onOpenChange={(open) => {
          setShowAddRoomDialog(open);
          if (!open) setSelectedHotelId(null);
        }}
      >
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle>Add Room</DialogTitle>
            <DialogDescription>Add a new room to this hotel.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoom} className='flex flex-col gap-4'>
            <Input
              placeholder='Room name'
              value={newRoomForm.name}
              onChange={(e) =>
                setNewRoomForm({ ...newRoomForm, name: e.target.value })
              }
              required
            />

            <Input
              placeholder='Room type'
              value={newRoomForm.roomType}
              onChange={(e) =>
                setNewRoomForm({ ...newRoomForm, roomType: e.target.value })
              }
            />

            <Input
              type='number'
              placeholder='Price'
              value={newRoomForm.pricePerNight}
              onChange={(e) =>
                setNewRoomForm({
                  ...newRoomForm,
                  pricePerNight: e.target.value,
                })
              }
              required
            />

            <Input
              type='number'
              placeholder='Capacity'
              value={newRoomForm.capacity}
              onChange={(e) =>
                setNewRoomForm({
                  ...newRoomForm,
                  capacity: e.target.value,
                })
              }
              required
            />

            <Textarea
              placeholder='Description'
              value={newRoomForm.description}
              onChange={(e) =>
                setNewRoomForm({
                  ...newRoomForm,
                  description: e.target.value,
                })
              }
            />

            <Input
              placeholder='Image URL'
              value={newRoomForm.imageUrl}
              onChange={(e) =>
                setNewRoomForm({
                  ...newRoomForm,
                  imageUrl: e.target.value,
                })
              }
            />

            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setShowAddRoomDialog(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Add Room</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Hotel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <span className='font-semibold'>{deleteTarget?.name}</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-white hover:bg-destructive/90'
              onClick={handleDeleteHotel}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteRoomTarget}
        onOpenChange={(open) => !open && setDeleteRoomTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='font-serif'>
              Remove Room
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{' '}
              <strong>{deleteRoomTarget?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={() => {
                if (deleteRoomTarget) {
                  handleDeleteRoom(deleteRoomTarget.id);
                  setDeleteRoomTarget(null);
                }
              }}
              className='bg-destructive text-card hover:bg-destructive/90'
            >
              Remove Room
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
