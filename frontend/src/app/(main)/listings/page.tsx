'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingMap } from '@/components/listings/ListingMap';
import { Listing } from '@/types/listing';
import { api } from '@/lib/axios';
import { X } from 'lucide-react';

const CITIES = ['Addis Ababa', 'Dire Dawa', 'Adama', 'Hawassa', 'Mek\'ele', 'Bahir Dar', 'Jimma', 'Harar', 'Arba Minch', 'Dessie'];

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || '');

  useEffect(() => {
    fetchListings(selectedCity);
  }, [selectedCity]);

  const fetchListings = async (city?: string) => {
    try {
      setLoading(true);
      const query = city ? `?city=${encodeURIComponent(city)}` : '';
      const response = await api.get(`/listings${query}`);
      
      if (response.data.success) {
        setListings(response.data.data.listings || []);
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    // Update URL
    if (city) {
      router.push(`?city=${encodeURIComponent(city)}`);
    } else {
      router.push('');
    }
  };

  const handleClearFilter = () => {
    setSelectedCity('');
    router.push('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Properties</h1>
        <p className="mt-2 text-gray-500">
          {listings.length} properties available {selectedCity ? `in ${selectedCity}` : 'across Ethiopia'}
        </p>
      </div>

      {/* City Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-gray-700">Filter by City</label>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Cities</option>
            {CITIES.sort().map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {selectedCity && (
          <button
            onClick={handleClearFilter}
            className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
          >
            <X className="h-4 w-4" />
            Clear Filter
          </button>
        )}
      </div>

      {/* Active Filter Badge */}
      {selectedCity && (
        <div className="mb-6 inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
          📍 Showing properties in <strong>{selectedCity}</strong>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
          <p className="text-gray-600">No properties found {selectedCity ? `in ${selectedCity}` : 'at this moment'}.</p>
          {selectedCity && (
            <button
              onClick={handleClearFilter}
              className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View all properties
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Map Section */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Properties on Map</h2>
            <ListingMap
              listings={listings.map(listing => ({
                id: listing.id,
                title: listing.title,
                latitude: listing.latitude,
                longitude: listing.longitude,
                price: listing.price,
                address: listing.address,
              }))}
              center={[9.0320, 38.7469]}
              zoom={11}
              height="500px"
            />
          </div>

          {/* Listings Grid */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              All Properties {selectedCity && `in ${selectedCity}`}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
