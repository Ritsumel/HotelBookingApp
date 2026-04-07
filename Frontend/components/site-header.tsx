'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/booking', label: 'Book a Stay' },
  { href: '/about', label: 'About Us' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      setIsLoggedIn(true);
      setRole(
        payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      );
    } catch {
      console.error('Invalid token');
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setRole(null);
    window.location.reload();
  }

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6'>
        <Link href='/' className='flex items-center gap-2'>
          <span className='font-serif text-2xl font-bold tracking-tight text-foreground'>
            MME
          </span>
          <span className='text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
            Hotels
          </span>
        </Link>

        <nav
          className='hidden items-center gap-8 md:flex'
          aria-label='Main navigation'
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          {/* Not logged in */}
          {!isLoggedIn && (
            <>
              <Link href='/login'>
                <Button variant='ghost' size='sm' className='gap-2'>
                  <User className='h-4 w-4' />
                  <span>Log in</span>
                </Button>
              </Link>

              <Link href='/login?mode=register'>
                <Button variant='ghost' size='sm' className='gap-2'>
                  <UserPlus className='h-4 w-4' />
                  <span>Register</span>
                </Button>
              </Link>

              <Link href='/booking'>
                <Button
                  size='sm'
                  className='bg-foreground text-background hover:bg-foreground/90'
                >
                  Reserve Now
                </Button>
              </Link>
            </>
          )}

          {/* Logged in admin */}
          {isLoggedIn && role === 'Admin' && (
            <>
              <Link href='/admin'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='gap-2 text-muted-foreground'
                >
                  <ShieldCheck className='h-4 w-4' />
                  <span>Admin Panel</span>
                </Button>
              </Link>

              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className='gap-2'
              >
                <User className='h-4 w-4' />
                <span>Logout</span>
              </Button>
            </>
          )}

          {/* Logged in user */}
          {isLoggedIn && role !== 'Admin' && (
            <>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                className='gap-2'
              >
                <User className='h-4 w-4' />
                <span>Logout</span>
              </Button>

              <Link href='/booking'>
                <Button
                  size='sm'
                  className='bg-foreground text-background hover:bg-foreground/90'
                >
                  Reserve Now
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className='flex items-center justify-center md:hidden'
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? (
            <X className='h-6 w-6 text-foreground' />
          ) : (
            <Menu className='h-6 w-6 text-foreground' />
          )}
        </button>
      </div>

      {isOpen && (
        <div className='border-t border-border bg-background md:hidden'>
          <nav
            className='flex flex-col px-6 py-4'
            aria-label='Mobile navigation'
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className='mt-3 flex flex-col gap-2 border-t border-border pt-4'>
              {/* Not logged in */}
              {!isLoggedIn && (
                <>
                  <Link href='/login' onClick={() => setIsOpen(false)}>
                    <Button variant='ghost' size='sm' className='w-full gap-2'>
                      <User className='h-4 w-4' />
                      <span>Log in</span>
                    </Button>
                  </Link>

                  <Link
                    href='/login?mode=register'
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant='ghost' size='sm' className='w-full gap-2'>
                      <UserPlus className='h-4 w-4' />
                      <span>Register</span>
                    </Button>
                  </Link>

                  <Link href='/booking' onClick={() => setIsOpen(false)}>
                    <Button
                      size='sm'
                      className='w-full bg-foreground text-background hover:bg-foreground/90'
                    >
                      Reserve Now
                    </Button>
                  </Link>
                </>
              )}

              {/* Logged in admin */}
              {isLoggedIn && role === 'Admin' && (
                <>
                  <Link href='/admin' onClick={() => setIsOpen(false)}>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-full gap-2 text-muted-foreground'
                    >
                      <ShieldCheck className='h-4 w-4' />
                      <span>Admin Panel</span>
                    </Button>
                  </Link>

                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className='w-full gap-2'
                  >
                    <User className='h-4 w-4' />
                    <span>Logout</span>
                  </Button>
                </>
              )}

              {/* Logged in normal user */}
              {isLoggedIn && role !== 'Admin' && (
                <>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className='w-full gap-2'
                  >
                    <User className='h-4 w-4' />
                    <span>Logout</span>
                  </Button>

                  <Link href='/booking' onClick={() => setIsOpen(false)}>
                    <Button
                      size='sm'
                      className='w-full bg-foreground text-background hover:bg-foreground/90'
                    >
                      Reserve Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
