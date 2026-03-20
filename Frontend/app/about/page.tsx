import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Award, Heart, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us | MME Hotels',
  description:
    'Learn about MME Hotels, a Scandinavian luxury hotel chain with locations across Sweden. Rooted in Nordic design and warm hospitality since 2008.',
};

const stats = [
  { value: '4', label: 'Locations across Sweden' },
  { value: '336', label: 'Rooms and suites' },
  { value: '18', label: 'Years of hospitality' },
  { value: '98%', label: 'Guest satisfaction rate' },
];

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description:
      'Every detail matters. From our handpicked furnishings to our seasonal menus, we pursue perfection in every aspect of your stay.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description:
      'We are committed to reducing our footprint. All our hotels use renewable energy, locally sourced ingredients, and eco-certified products.',
  },
  {
    icon: Heart,
    title: 'Warmth',
    description:
      'Nordic hospitality means making every guest feel at home. Our team is trained to anticipate your needs with genuine care.',
  },
  {
    icon: MapPin,
    title: 'Locality',
    description:
      'Each MME hotel reflects its city. We celebrate local art, culture, and cuisine to give guests an authentic Swedish experience.',
  },
];

const timeline = [
  {
    year: '2008',
    title: 'The Beginning',
    description:
      "MME Hotels was founded with a single property in Stockholm's Kungsgatan, born from a vision to redefine Scandinavian hospitality.",
  },
  {
    year: '2012',
    title: 'Gothenburg Opens',
    description:
      "Our waterfront property in Gothenburg brought MME's signature Nordic style to Sweden's west coast.",
  },
  {
    year: '2016',
    title: 'Malmo Joins the Family',
    description:
      'The Malmo Modern hotel brought a contemporary, art-forward approach to our growing brand.',
  },
  {
    year: '2020',
    title: 'Uppsala Heritage',
    description:
      'Our latest property, a lovingly restored heritage building near Uppsala Cathedral, completed the collection.',
  },
  {
    year: '2024',
    title: 'Sustainability Milestone',
    description:
      'All MME hotels achieved carbon-neutral certification, powered entirely by renewable energy sources.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className='relative flex min-h-[60vh] items-center justify-center overflow-hidden'>
        <div className='absolute inset-0'>
          <Image
            src='/images/hero-lobby.jpg'
            alt='MME Hotels interior'
            fill
            priority
            className='object-cover'
          />
          <div className='absolute inset-0 bg-foreground/60' />
        </div>
        <div className='relative z-10 mx-auto max-w-3xl px-6 pt-16 text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-accent'>
            Our Story
          </p>
          <h1 className='mt-4 font-serif text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl text-balance'>
            Rooted in Nordic tradition
          </h1>
          <p className='mx-auto mt-4 max-w-lg text-base leading-relaxed text-primary-foreground/80 md:text-lg'>
            Since 2008, MME Hotels has been crafting unforgettable stays that
            blend Scandinavian minimalism with heartfelt hospitality.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className='border-b border-border'>
        <div className='mx-auto grid max-w-7xl grid-cols-2 gap-px md:grid-cols-4'>
          {stats.map((stat) => (
            <div
              key={stat.label}
              className='flex flex-col items-center gap-1 px-6 py-10'
            >
              <p className='font-serif text-3xl font-bold text-foreground md:text-4xl'>
                {stat.value}
              </p>
              <p className='text-center text-sm text-muted-foreground'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className='mx-auto max-w-7xl px-6 py-24'>
        <div className='grid gap-16 lg:grid-cols-2'>
          <div>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
              Who We Are
            </p>
            <h2 className='mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
              A family of hotels united by design and warmth
            </h2>
            <p className='mt-4 text-base leading-relaxed text-muted-foreground'>
              MME Hotels began as a dream to create spaces where Nordic design
              and genuine hospitality coexist. Our founder, Margareta Engstrom,
              envisioned hotels that feel like a second home, where every
              surface, every flavor, and every interaction is thoughtfully
              crafted.
            </p>
            <p className='mt-4 text-base leading-relaxed text-muted-foreground'>
              Today, with four properties across Sweden, we continue to honor
              that vision. Each hotel is unique in character but united by a
              shared commitment to quality, sustainability, and the warm welcome
              that defines Swedish hospitality.
            </p>
            <Link href='/booking' className='mt-8 inline-block'>
              <Button className='gap-2 bg-foreground text-background hover:bg-foreground/90'>
                Explore Our Hotels
                <ArrowRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='overflow-hidden rounded-lg'>
              <Image
                src='/images/restaurant.jpg'
                alt='MME Hotels dining experience'
                width={400}
                height={500}
                className='h-full w-full object-cover'
              />
            </div>
            <div className='mt-8 overflow-hidden rounded-lg'>
              <Image
                src='/images/spa.jpg'
                alt='MME Hotels spa and wellness'
                width={400}
                height={500}
                className='h-full w-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className='bg-secondary'>
        <div className='mx-auto max-w-7xl px-6 py-24'>
          <div className='text-center'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
              Our Values
            </p>
            <h2 className='mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance'>
              What guides everything we do
            </h2>
          </div>

          <div className='mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
            {values.map((value) => (
              <div
                key={value.title}
                className='flex flex-col items-center gap-3 rounded-xl bg-card p-6 text-center'
              >
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-foreground'>
                  <value.icon className='h-5 w-5 text-primary-foreground' />
                </div>
                <h3 className='font-serif text-lg font-bold text-foreground'>
                  {value.title}
                </h3>
                <p className='text-sm leading-relaxed text-muted-foreground'>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className='mx-auto max-w-3xl px-6 py-24'>
        <div className='mb-12 text-center'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-accent'>
            Our Journey
          </p>
          <h2 className='mt-2 font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            A timeline of growth
          </h2>
        </div>

        <div className='relative flex flex-col gap-10'>
          <div
            className='absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2'
            aria-hidden='true'
          />

          {timeline.map((item, i) => (
            <div
              key={item.year}
              className={`relative flex flex-col gap-2 pl-14 md:w-1/2 md:pl-0 ${
                i % 2 === 0
                  ? 'md:pr-12 md:self-start md:text-right'
                  : 'md:pl-12 md:self-end'
              }`}
            >
              <div
                className={`absolute top-1 left-4 h-4 w-4 rounded-full border-2 border-accent bg-background md:left-auto ${
                  i % 2 === 0 ? 'md:right-2' : 'md:left-2'
                }`}
                aria-hidden='true'
              />
              <p className='text-xs font-semibold uppercase tracking-wider text-accent'>
                {item.year}
              </p>
              <h3 className='font-serif text-lg font-bold text-foreground'>
                {item.title}
              </h3>
              <p className='text-sm leading-relaxed text-muted-foreground'>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
