'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api, { errorMessage } from '@/lib/api';

interface House {
  id: string;
  title: string;
  price: number;
  address: string;
  city: string;
}

export default function PaymentPage() {
  const params = useParams<{ houseId: string }>();
  const houseId = params?.houseId;
  const { appUser, supabaseUser } = useAuth();

  const [house, setHouse] = useState<House | null>(null);
  const [method, setMethod] = useState<'CHAPA' | 'CBE_BIRR' | 'TELEBIRR'>('CHAPA');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!houseId) return;
    api
      .get(`/houses/${houseId}`)
      .then((res) => setHouse(res.data.house))
      .catch((err: unknown) => setError(errorMessage(err, 'House not found')))
      .finally(() => setLoading(false));
  }, [houseId]);

  const payWithChapa = async () => {
    setError('');
    try {
      const { data } = await api.post('/payments/checkout', {
        houseId,
        amount: house?.price,
        method: 'CHAPA',
        email: supabaseUser?.email,
        first_name: appUser?.name?.split(' ')[0],
        last_name: appUser?.name?.split(' ')[1],
        phone: appUser?.phoneNumber,
      });
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setError('Chapa did not return a checkout URL.');
      }
    } catch (err: unknown) {
      setError(errorMessage(err, 'Could not start payment'));
    }
  };

  const recordManual = async () => {
    setError('');
    try {
      const ref = window.prompt('Enter your payment reference number (from your bank / Telebirr app):');
      if (!ref) return;
      await api.post('/payments/manual', {
        houseId,
        amount: house?.price,
        method,
        reference: ref,
      });
      alert('Payment reference recorded! The owner will confirm it.');
    } catch (err: unknown) {
      setError(errorMessage(err, 'Could not record payment'));
    }
  };

  if (loading) return <p className="mx-auto max-w-2xl px-4 py-16 text-zinc-500">Loading payment…</p>;
  if (error && !house) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="mt-4 inline-block text-emerald-700 hover:underline">← Back</Link>
      </div>
    );
  }
  if (!house) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/houses/${house.id}`} className="text-sm text-emerald-700 hover:underline">
        ← Back to house
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-zinc-900">Pay rent for this house</h1>
      <p className="mt-1 text-zinc-600">{house.address}, {house.city}</p>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-sm text-zinc-500">Monthly rent</p>
        <p className="text-3xl font-bold text-zinc-900">ETB {Number(house.price).toLocaleString()}</p>
      </div>

      <fieldset className="mt-6 flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-zinc-700">Choose payment method</legend>
        {(['CHAPA', 'CBE_BIRR', 'TELEBIRR'] as const).map((m) => (
          <label
            key={m}
            className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
              method === m ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-200'
            }`}
          >
            <input
              type="radio"
              checked={method === m}
              onChange={() => setMethod(m)}
              className="accent-emerald-600"
            />
            <span className="font-medium">{m.replace('_', ' ')}</span>
            <span className="ml-auto text-xs text-zinc-500">
              {m === 'CHAPA' ? 'Card / bank / USSD — instant' : 'Manual reference'}
            </span>
          </label>
        ))}
      </fieldset>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 flex flex-col gap-3">
        {method === 'CHAPA' ? (
          <button
            onClick={payWithChapa}
            className="rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Proceed to secure Chapa checkout
          </button>
        ) : (
          <button
            onClick={recordManual}
            className="rounded-lg bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            I already paid via {method.replace('_', ' ')} — record reference
          </button>
        )}
        <p className="text-center text-xs text-zinc-400">
          Powered by Teza&apos;s Chapa integration. No card details are stored on our servers.
        </p>
      </div>
    </div>
  );
}