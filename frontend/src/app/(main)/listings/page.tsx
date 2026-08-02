'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingMap } from '@/components/listings/ListingMap';
import { SearchFilters, FilterState } from '@/components/listings/SearchFilters';
import { Listing } from '@/types/listing';
import { api } from '@/lib/axios';
import { X } from 'lucide-react';

const CITIES = ['Addis Ababa', 'Dire Dawa', 'Adama', 'Hawassa', 'Mek\'ele', 'Bahir Dar', 'Jimma', 'Harar', 'Arba Minch', 'Dessie'];

function ListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>(searchParams.get('city') || '');
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 1000,
    priceMax: 100000,
    amenities: [],
    verifiedLandlordOnly: false,
  });
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'newest' | 'rating'>('newest');

  useEffect(() => {
    fetchListings(selectedCity);
  }, [selectedCity]);

  // Apply filters and sorting
  useEffect(() => {
    let result = listings.filter(listing => {
      // City filter
      if (selectedCity && listing.city !== selectedCity) return false;
      
      // Price filter
      if (listing.price < filters.priceMin || listing.price > filters.priceMax) return false;
      
      // Amenities filter (simplified - would need amenities field in Listing)
      // if (filters.amenities.length > 0) {
      //   const listingAmenities = listing.amenities || [];
      //   if (!filters.amenities.every(a => listingAmenities.includes(a))) return false;
      // }
      
      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        // Would need rating field: result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    setFilteredListings(result);
  }, [listings, filters, selectedCity, sortBy]);

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

  const handleClearFilter = () => {
    setSelectedCity('');
    router.push('');
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
          {filteredListings.length} properties available {selectedCity ? `in ${selectedCity}` : 'across Ethiopia'}
        </p>
      </div>

      {/* Filters and City Selection */}
      <div className="mb-8 grid gap-6 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <SearchFilters onFilterChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* City Filter and Sort */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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

            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-gray-700">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {selectedCity && (
              <div className="flex items-end">
                <button
                  onClick={() => handleClearFilter()}
                  className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                >
                  <X className="h-4 w-4" />
                  Clear Filter
                </button>
              </div>
            )}
          </div>

          {/* Active Filter Badge */}
          {selectedCity && (
            <div className="inline-block rounded-full bg-emerald-100 px-4 py-2 text-sm text-emerald-700">
              📍 Showing properties in <strong>{selectedCity}</strong>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
              <p className="text-gray-600">No properties found {selectedCity ? `in ${selectedCity}` : 'at this moment'}.</p>
              {selectedCity && (
                <button
                  onClick={() => handleClearFilter()}
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
                  listings={filteredListings.map(listing => ({
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
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent mx-auto"></div>
              <p className="text-gray-600">Loading properties...</p>
            </div>
          </div>
        </div>
      }
    >
      <ListingsContent />
    </Suspense>
  );
}
