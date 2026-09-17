'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api, { errorMessage } from '@/lib/api';
import { uploadHouseImage } from '@/lib/supabase';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const DEFAULT_LAT = 9.0275; // Addis Ababa
const DEFAULT_LNG = 38.7362;

type HouseType = 'APARTMENT' | 'VILLA' | 'CONDOMINIUM' | 'STUDIO' | 'TOWNHOUSE';

export default function NewHousePage() {
  const { appUser } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [bedrooms, setBedrooms] = useState('2');
  const [bathrooms, setBathrooms] = useState('1');
  const [houseType, setHouseType] = useState<HouseType>('APARTMENT');
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  // Get visitor's current location as a handy starting pin.
  const pickMyLocation = () => {
    if (!navigator.geolocation) {
      setLat(DEFAULT_LAT);
      setLng(DEFAULT_LNG);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => {
        setLat(DEFAULT_LAT);
        setLng(DEFAULT_LNG);
      }
    );
  };

  if (appUser && appUser.role === 'RENTER') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Owners only</h1>
        <p className="mt-2 text-zinc-600">This page lets homeowners list a house on the map.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setPhotoError('');
    if (!lat || !lng) {
      setSubmitError('Please drop a pin on the map to mark your house location.');
      return;
    }
    setLoading(true);
    try {
      // Upload house photos to Supabase Storage before creating the listing.
      const urls: string[] = [];
      for (const file of photos) {
        urls.push(await uploadHouseImage(file));
      }

      const payload = {
        title,
        description,
        price: Number(price),
        address,
        city,
        latitude: lat,
        longitude: lng,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        houseType,
        imageUrls: urls.length ? urls : undefined,
      };
      const { data } = await api.post('/houses', payload);
      router.push(`/houses/${data.house.id}`);
    } catch (err: unknown) {
      setSubmitError(errorMessage(err, 'Could not create listing'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhotos = (files: FileList | null) => {
    setPhotoError('');
    if (!files) return;
    const next = [...photos];
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError(`${file.name} is larger than 5MB.`);
        continue;
      }
      next.push(file);
    }
    setPhotos(next);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="text-sm text-emerald-700 hover:underline">
        ← Back to listings
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-zinc-900">List your house on the map</h1>
      <p className="mt-1 text-zinc-600">
        Drop a pin on the map to mark the exact location. Your house is identified by these coordinates —
        no two houses can share the same spot.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">Title</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Modern 2-bedroom apartment in Bole"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">Monthly price (ETB)</span>
            <input
              required
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25000"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">City</span>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Address</span>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Bole, Atlas, near Friendship Park, Addis Ababa"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-700">Description</span>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the house, neighborhood, amenities…"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-3 gap-5">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">Bedrooms</span>
            <input
              type="number"
              min={0}
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">Bathrooms</span>
            <input
              type="number"
              min={0}
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-700">House type</span>
            <select
              value={houseType}
              onChange={(e) => setHouseType(e.target.value as HouseType)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            >
              {['APARTMENT', 'VILLA', 'CONDOMINIUM', 'STUDIO', 'TOWNHOUSE'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-700">House location</span>
            <button
              type="button"
              onClick={pickMyLocation}
              className="rounded-lg border border-emerald-600 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Use my location
            </button>
          </div>
          <MapPicker lat={lat} lng={lng} onPick={(la, ln) => { setLat(la); setLng(ln); }} />
          <p className="mt-2 text-xs text-zinc-500">
            Latitude: <span className="font-mono">{lat ? lat.toFixed(6) : '—'}</span> · Longitude:{' '}
            <span className="font-mono">{lng ? lng.toFixed(6) : '—'}</span>
            {lat && lng && (
              <span className="ml-2 text-emerald-600">✓ Location pinned</span>
            )}
          </p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-zinc-700">Photos</span>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center hover:border-emerald-500 hover:bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <span className="mt-2 text-sm font-medium text-zinc-700">Click to add photos (up to 5MB each)</span>
            <span className="text-xs text-zinc-500">Stored securely in Supabase Storage</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleAddPhotos(e.target.files)}
            />
          </label>
          {photoError && <p className="mt-2 text-xs text-red-600">{photoError}</p>}
          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((file, i) => (
                <div key={`${file.name}-${i}`} className="group relative overflow-hidden rounded-lg border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt={file.name} className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-bold text-white hover:bg-red-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {submitError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Creating your listing…' : 'Publish house on the map'}
        </button>
      </form>
    </div>
  );
}