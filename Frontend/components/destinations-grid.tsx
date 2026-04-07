import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getCities } from '@/lib/hotel-data';

const cityImages: Record<string, string> = {
  Stockholm: '/images/stockholm.jpg',
  Göteborg: '/images/gothenburg.jpg',
  Malmö: '/images/malmo.jpg',
  Uppsala: '/images/uppsala.jpg',
};

export function DestinationsGrid() {
  const [destinations, setDestinations] = useState<
    { name: string; image: string }[]
  >([]);

  useEffect(() => {
    getCities({ pageSize: 4 }).then((data) => {
      const top4 = data.items.map((c) => ({
        name: c.name,
        image: cityImages[c.name] ?? c.image,
      }));
      setDestinations(top4);
    });
  }, []);

  return (
    <section className='mx-auto max-w-7xl px-6 py-24'>
      <div className='mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
            Our Locations
          </p>
          <h2 className='mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
            Discover Sweden with MME Hotels
          </h2>
        </div>
        <Link
          href='/booking'
          className='flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent'
        >
          View all destinations
          <ArrowRight className='h-4 w-4' />
        </Link>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {destinations.map((dest) => (
          <Link
            key={dest.name}
            href={`/booking?city=${dest.name}`}
            className='group relative overflow-hidden rounded-lg'
          >
            <div className='aspect-3/4 overflow-hidden'>
              <Image
                src={dest.image}
                alt={`MME Hotels ${dest.name} location`}
                width={400}
                height={533}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              />
            </div>
            <div className='absolute inset-0 bg-linear-to-t from-foreground/80 via-foreground/20 to-transparent' />
            <div className='absolute bottom-0 left-0 right-0 p-5'>
              <h3 className='mt-1 font-serif text-xl font-bold text-primary-foreground'>
                {dest.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
