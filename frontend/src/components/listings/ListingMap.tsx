'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Dynamic import to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface ListingLocation {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  address: string;
}

interface ListingMapProps {
  listings: ListingLocation[];
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  height?: string;
}

export function ListingMap({ listings, center = [9.0320, 38.7469], zoom = 12, height = '400px' }: ListingMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let isActive = true;

    import('leaflet').then((L) => {
      if (!isActive) {
        return;
      }

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });

    setIsMounted(true);

    return () => {
      isActive = false;
    };
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-lg bg-gray-100 animate-pulse flex items-center justify-center"
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={[listing.latitude, listing.longitude]}
          >
            <Popup>
              <div className="w-48">
                <h3 className="font-semibold text-gray-900 mb-1">{listing.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{listing.address}</p>
                <p className="text-lg font-bold text-emerald-600">
                  ETB {listing.price.toLocaleString()}
                  <span className="text-xs text-gray-500"> /month</span>
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
