'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { errorMessage } from '@/lib/api';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'RENTER' | 'OWNER'>('RENTER');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const hasSession = await signUp(email, password, name, role, phoneNumber);
      if (!hasSession) {
        // Supabase is sending a confirmation email; no session yet.
        setInfo('Account created! Check your email to confirm your account, then log in.');
        return;
      }
      if (role === 'OWNER') {
        router.push('/houses/new');
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      setError(errorMessage(err, 'Sign up failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-2xl font-bold text-zinc-900">Create your account</h1>
      <p className="mt-1 text-sm text-zinc-600">Join HouseRent Ethiopia as a renter or homeowner.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Full name
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal focus:border-emerald-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-zinc-700">
          Phone number (optional)
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+251 9…"
            className="rounded-lg border border-zinc-300 px-3 py-2 font-normal focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-zinc-700">I am a…</legend>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="radio" checked={role === 'RENTER'} onChange={() => setRole('RENTER')} />
            Renter — I want to find a house
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="radio" checked={role === 'OWNER'} onChange={() => setRole('OWNER')} />
            Owner — I want to list my house
          </label>
        </fieldset>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {info && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-emerald-700 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}