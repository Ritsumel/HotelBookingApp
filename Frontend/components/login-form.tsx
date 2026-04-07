'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const params = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(params.get('mode') === 'register');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    try {
      const endpoint = isSignUp
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;

      const body = isSignUp
        ? {
            fullName: name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setErrorMessage(data.message || 'Something went wrong.');
        return;
      }

      if (isSignUp) {
        setSuccessMessage(
          'Account created successfully! Redirecting to sign in...',
        );

        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage('');
        }, 2000);

        return;
      }

      localStorage.setItem('token', data.access_token);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        localStorage.setItem('user', JSON.stringify({ email: email }));
      }

      router.push('/');
    } catch (err) {
      setErrorMessage('Unable to connect to the server.');
    }
  }

  return (
    <div className='flex min-h-screen'>
      {/* Left panel - Image */}
      <div className='relative hidden w-1/2 lg:block'>
        <Image
          src='/images/hotel-room.jpg'
          alt='MME Hotels luxury room'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-foreground/40' />
        <div className='absolute bottom-0 left-0 right-0 p-12'>
          <Link href='/' className='inline-block'>
            <span className='font-serif text-3xl font-bold text-primary-foreground'>
              MME
            </span>
            <span className='ml-2 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground/60'>
              Hotels
            </span>
          </Link>
          <p className='mt-3 max-w-md text-base leading-relaxed text-primary-foreground/80'>
            Sign in to manage your reservations, earn loyalty rewards, and
            access exclusive member rates across all MME Hotels.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className='flex w-full items-center justify-center px-6 pt-24 pb-12 lg:w-1/2'>
        <div className='w-full max-w-md'>
          {/* Mobile logo */}
          <div className='mb-8 lg:hidden'>
            <Link href='/'>
              <span className='font-serif text-2xl font-bold text-foreground'>
                MME
              </span>
              <span className='ml-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground'>
                Hotels
              </span>
            </Link>
          </div>

          <h1 className='font-serif text-2xl font-bold tracking-tight text-foreground md:text-3xl'>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className='mt-2 text-sm text-muted-foreground'>
            {isSignUp
              ? 'Join MME Hotels and unlock exclusive member benefits.'
              : 'Sign in to your MME Hotels account.'}
          </p>

          {successMessage && (
            <div className='mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700'>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className='mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-4'>
            {isSignUp && (
              <div className='flex flex-col gap-1.5'>
                <Label htmlFor='name' className='text-xs font-medium'>
                  Full Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  placeholder='Erik Svensson'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='email' className='text-xs font-medium'>
                Email
              </Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='email'
                  type='email'
                  placeholder='erik@example.com'
                  className='pl-9'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className='flex flex-col gap-1.5'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-xs font-medium'>
                  Password
                </Label>
                {!isSignUp && (
                  <Link
                    href='#'
                    className='text-xs font-medium text-accent hover:underline'
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  className='pl-9 pr-10'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>

            <Button
              type='submit'
              className='mt-2 w-full bg-foreground text-background hover:bg-foreground/90'
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <div className='my-6 flex items-center gap-3'>
            <Separator className='flex-1' />
            <span className='text-xs text-muted-foreground'>or</span>
            <Separator className='flex-1' />
          </div>

          <Button variant='outline' className='w-full'>
            Continue with Google
          </Button>

          <p className='mt-6 text-center text-sm text-muted-foreground'>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type='button'
              className='font-medium text-foreground hover:underline'
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
