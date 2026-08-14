'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Eye, Edit2 } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { getListingImage } from '@/lib/listingImages';

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  houseType: string;
  images?: Array<{ url: string; id: string }>;
  createdAt: string;
}

export default function MyListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/listings/me/listings');
      
      if (response.data.success) {
        setListings(response.data.data.listings || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      setDeleting(id);
      const response = await api.delete(`/listings/${id}`);
      
      if (response.data.success) {
        toast.success('Listing deleted successfully');
        setListings(listings.filter(l => l.id !== id));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <p className="mt-2 text-gray-600">Manage your properties on MAKI</p>
        </div>
        <Button
          onClick={() => router.push('/my-listings/new')}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 py-12 text-center">
          <div className="mb-4 text-gray-400">
            <Eye className="mx-auto h-12 w-12" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-700">No listings yet</h3>
          <p className="mb-6 text-gray-600">Create your first property listing to get started</p>
          <Button
            onClick={() => router.push('/my-listings/new')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map(listing => (
            <div key={listing.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {listing.images && listing.images.length > 0 ? (
                  <Image
                    src={`http://localhost:5001${listing.images[0].url}`}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-300">
                    <Eye className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900">
                  {listing.title}
                </h3>

                <div className="mb-3 space-y-1 text-sm text-gray-600">
                  <p>📍 {listing.city}, {listing.address}</p>
                  <p>🏠 {listing.bedrooms} bed, {listing.bathrooms} bath</p>
                  <p className="text-lg font-bold text-emerald-600">ETB {listing.price.toLocaleString()}/month</p>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/listings/${listing.id}`)}
                    className="flex-1"
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/my-listings/${listing.id}/edit`)}
                    className="flex-1"
                  >
                    <Edit2 className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(listing.id)}
                    disabled={deleting === listing.id}
                    className="flex-1"
                  >
                    <Trash2 className="mr-1 h-4 w-4" />
                    {deleting === listing.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
