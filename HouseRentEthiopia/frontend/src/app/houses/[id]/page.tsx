'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface House {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  houseType: string;
  status: string;
  owner?: { id: string; name: string; phoneNumber?: string };
  images?: { url: string }[];
}

export default function HouseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .get(`/houses/${id}`)
      .then((res) => setHouse(res.data.house))
      .catch((e) => setError(e?.response?.data?.message || 'House not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mx-auto max-w-6xl px-4 py-16 text-zinc-500">Loading house…</p>;
  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="mt-4 inline-block text-emerald-700 hover:underline">
          ← Back to listings
        </Link>
      </div>
    );
  }
  if (!house) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/" className="text-sm text-emerald-700 hover:underline">
        ← Back to listings
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {house.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={house.images[0].url}
              alt={house.title}
              className="aspect-video w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-zinc-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
          </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold uppercase text-emerald-700">
              {house.status}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold uppercase text-zinc-600">
              {house.houseType}
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900">{house.title}</h1>
          <p className="mt-1 text-zinc-600">{house.address}, {house.city}</p>
          <p className="mt-3 text-3xl font-bold text-emerald-700">
            ETB {Number(house.price).toLocaleString()}
            <span className="text-lg font-normal text-zinc-500">/month</span>
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-zinc-50 p-3">
              <dt className="text-xs uppercase text-zinc-500">Bedrooms</dt>
              <dd className="text-lg font-semibold text-zinc-900">{house.bedrooms}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <dt className="text-xs uppercase text-zinc-500">Bathrooms</dt>
              <dd className="text-lg font-semibold text-zinc-900">{house.bathrooms}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3">
              <dt className="text-xs uppercase text-zinc-500">Location</dt>
              <dd className="text-lg font-semibold text-zinc-900">
                {house.latitude?.toFixed(3)}, {house.longitude?.toFixed(3)}
              </dd>
            </div>
          </dl>

          <p className="mt-6 whitespace-pre-line text-zinc-700">{house.description}</p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href={`/payment/${house.id}`}
              className="rounded-lg bg-emerald-600 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Rent this house — Pay via Chapa
            </Link>
            {house.owner?.phoneNumber && (
              <p className="text-center text-sm text-zinc-500">Contact owner: {house.owner.phoneNumber}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900">Exact location on the map</h2>
        <MapView
          houses={[{
            id: house.id,
            title: house.title,
            price: house.price,
            address: house.address,
            latitude: house.latitude,
            longitude: house.longitude,
          }]}
          center={[house.latitude, house.longitude]}
          zoom={16}
          height="400px"
        />
        <p className="mt-2 text-xs text-zinc-500">
          Unique property coordinates: {house.latitude?.toFixed(6)}, {house.longitude?.toFixed(6)} — verified on the map.
        </p>
      </div>
    </div>
  );
}