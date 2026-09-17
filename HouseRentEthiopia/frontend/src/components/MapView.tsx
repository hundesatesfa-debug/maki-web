'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export interface MapHouse {
  id: string;
  title: string;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  status?: string;
  images?: { url: string }[];
}

interface MapViewProps {
  houses: MapHouse[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapView({ houses, center, zoom = 12, height = '500px' }: MapViewProps) {
  const mapCenter: [number, number] = center ?? [9.0275, 38.7362];

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      style={{ height, width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {houses.map((house) =>
        house.latitude && house.longitude ? (
          <Marker key={house.id} position={[house.latitude, house.longitude]} icon={markerIcon}>
            <Popup>
              <div className="flex flex-col gap-1 text-sm min-w-[180px]">
                <span className="font-semibold">{house.title}</span>
                <span className="text-emerald-600 font-medium">ETB {Number(house.price).toLocaleString()}/mo</span>
                <span className="text-zinc-500 truncate">{house.address}</span>
                <Link
                  href={`/houses/${house.id}`}
                  className="mt-1 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  View details
                </Link>
              </div>
            </Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}