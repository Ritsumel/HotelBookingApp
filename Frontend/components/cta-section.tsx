import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <Image
          src='/images/spa.jpg'
          alt='MME Hotels spa and wellness'
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-foreground/70' />
      </div>

      <div className='relative mx-auto max-w-7xl px-6 py-32 text-center'>
        <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
          Your Next Escape
        </p>
        <h2 className='mx-auto mt-3 max-w-2xl font-serif text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl text-balance'>
          Begin your Scandinavian journey today
        </h2>
        <p className='mx-auto mt-4 max-w-lg text-base leading-relaxed text-primary-foreground/70'>
          Whether you are traveling for business or leisure, MME Hotels offers
          an experience rooted in Nordic tradition and modern comfort.
        </p>
        <div className='mt-8 flex items-center justify-center gap-4'>
          <Link href='/booking'>
            <Button
              size='lg'
              className='gap-2 bg-primary-foreground text-foreground hover:bg-primary-foreground/90'
            >
              Book Now
              <ArrowRight className='h-4 w-4' />
            </Button>
          </Link>
          <Link href='/about'>
            <Button
              size='lg'
              variant='outline'
              className='border-primary-foreground/30 hover:bg-primary-foreground/10 hover:text-primary-foreground'
            >
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
