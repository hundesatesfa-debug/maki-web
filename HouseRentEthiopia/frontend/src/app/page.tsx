'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import api, { errorMessage } from '@/lib/api';
import type { MapHouse } from '@/components/MapView';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface House extends MapHouse {
  description: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  houseType: string;
  createdAt: string;
  owner?: { id: string; name: string; phoneNumber?: string };
}

export default function HomePage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [houseType, setHouseType] = useState('');

  useEffect(() => {
    api
      .get('/houses')
      .then(({ data }) => {
        setHouses(data.houses ?? []);
        setError('');
      })
      .catch((err: unknown) => setError(errorMessage(err, 'Could not load listings')))
      .finally(() => setLoading(false));
  }, []);

  const fetchHouses = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (city) params.city = city;
    if (houseType) params.houseType = houseType;
    api
      .get('/houses', { params })
      .then(({ data }) => {
        setHouses(data.houses ?? []);
        setError('');
      })
      .catch((err: unknown) => setError(errorMessage(err, 'Could not load listings')))
      .finally(() => setLoading(false));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Find your next home in Ethiopia
        </h1>
        <p className="mt-2 text-zinc-600">
          Every listing is pinned to its exact location on the map.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City (e.g. Addis Ababa)"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <select
          value={houseType}
          onChange={(e) => setHouseType(e.target.value)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          <option value="">All types</option>
          <option>APARTMENT</option>
          <option>VILLA</option>
          <option>CONDOMINIUM</option>
          <option>STUDIO</option>
          <option>TOWNHOUSE</option>
        </select>
        <button
          onClick={fetchHouses}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Search
        </button>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <p className="text-zinc-500">Loading listings…</p>
      ) : (
        <>
          <div className="mb-8 rounded-xl border border-zinc-200 overflow-hidden">
            <MapView houses={houses} />
          </div>

          {houses.length === 0 ? (
            <p className="py-12 text-center text-zinc-500">No houses found. Check back soon!</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {houses.map((house) => (
                <Link
                  key={house.id}
                  href={`/houses/${house.id}`}
                  className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="aspect-video w-full bg-zinc-100">
                    {house.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={house.images[0].url}
                        alt={house.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-700">{house.title}</h3>
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold uppercase text-emerald-700">
                        {house.status}
                      </span>
                    </div>
                    <p className="mt-1 text-lg font-bold text-emerald-700">
                      ETB {Number(house.price).toLocaleString()}
                      <span className="text-sm font-normal text-zinc-500">/month</span>
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      {house.bedrooms} bed · {house.bathrooms} bath · {house.houseType.toLowerCase()}
                    </p>
                    <p className="mt-1 truncate text-sm text-zinc-500">{house.address}, {house.city}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}