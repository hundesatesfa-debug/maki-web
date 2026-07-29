'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in leaflet with Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapProps {
  position: { lat: number; lng: number } | null;
  onPositionSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onPositionSelect }: MapProps) {
  useMapEvents({
    click(e) {
      onPositionSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function Map({ position, onPositionSelect }: MapProps) {
  // Default to Addis Ababa
  const defaultCenter: [number, number] = [9.03, 38.74];

  useEffect(() => {
    // This is needed to ensure leaflet's CSS gets properly applied in some edge cases
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('resize'));
    }
  }, []);

  return (
    <MapContainer
      center={position ? [position.lat, position.lng] : defaultCenter}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onPositionSelect={onPositionSelect} />
    </MapContainer>
  );
}
