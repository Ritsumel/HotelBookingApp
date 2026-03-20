'use client';

import Image from 'next/image';
import { HeroSearch } from '@/components/hero-search';
import { DestinationsGrid } from '@/components/destinations-grid';
import { FeaturesSection } from '@/components/features-section';
import { CTASection } from '@/components/cta-section';

export default function HomePage() {
  return (
    <>
      <section className='relative flex min-h-[90vh] items-center justify-center overflow-hidden'>
        <div className='absolute inset-0'>
          <Image
            src='/images/hero-lobby.jpg'
            alt='MME Hotels luxury Scandinavian lobby'
            fill
            priority
            className='object-cover'
          />
          <div className='absolute inset-0 bg-foreground/50' />
        </div>

        <div className='relative z-10 mx-auto w-full max-w-7xl px-6 pt-16'>
          <div className='mx-auto max-w-3xl text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.25em] text-accent'>
              Scandinavian Luxury
            </p>
            <h1 className='mt-4 font-serif text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl lg:text-7xl text-balance'>
              A refined stay across Sweden
            </h1>
            <p className='mx-auto mt-4 max-w-lg text-base leading-relaxed text-primary-foreground/80 md:text-lg'>
              MME Hotels brings Nordic elegance and warm hospitality to
              Stockholm, Gothenburg, Malmo, and Uppsala.
            </p>
          </div>

          <div className='mx-auto mt-10 max-w-4xl'>
            <HeroSearch />
          </div>
        </div>
      </section>

      <DestinationsGrid />
      <FeaturesSection />
      <CTASection />
    </>
  );
}
