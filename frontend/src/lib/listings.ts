import { Listing } from '@/types/listing';
import { MOCK_LISTINGS } from '@/data/mockListings';
import api from './axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1').replace(
  'localhost:5000',
  'localhost:5001'
);

async function fetchFromApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as T;
  } catch {
    return null;
  }
}

export async function getListings(city?: string): Promise<Listing[]> {
  const query = city ? `?city=${encodeURIComponent(city)}` : '';
  const data = await fetchFromApi<{ listings: Listing[] }>(`/listings${query}`);
  if (data?.listings?.length) return data.listings;
  return MOCK_LISTINGS;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const data = await fetchFromApi<{ listing: Listing }>(`/listings/${id}`);
  if (data?.listing) return data.listing;
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}

export async function createListing(data: Partial<Listing>) {
  const response = await api.post('/listings', data);
  return response.data;
}

export async function getMyListings(): Promise<Listing[]> {
  const response = await api.get('/listings/me/listings');
  return response.data?.data?.listings || [];
}
