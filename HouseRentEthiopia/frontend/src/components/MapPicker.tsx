'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Default marker icons are broken with bundlers; provide a stable URL.
const markerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Re-center the map when the value changes externally.
function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  // Only re-center when a coordinate pair (e.g. geolocation result) is set.
  useEffect(() => {
    if (lat !== 0 && lng !== 0) map.flyTo([lat, lng], 16, { duration: 1.5 });
  }, [lat, lng, map]);
  return null;
}

function ClickPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export interface LeafletMapHandle {
  lat: number;
  lng: number;
}

interface MapPickerProps {
  lat: number;
  lng: number;
  onPick: (lat: number, lng: number) => void;
  height?: string;
}

export default function MapPicker({ lat, lng, onPick, height = '400px' }: MapPickerProps) {
  const [center] = useState<[number, number]>([lat || 9.0275, lng || 38.7362]); // Default: Addis Ababa

  return (
    <MapContainer
      center={center}
      zoom={lat && lng ? 16 : 13}
      style={{ height, width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={lat} lng={lng} />
      <ClickPicker
        onPick={(la, ln) => {
          onPick(la, ln);
        }}
      />
      {lat !== 0 && lng !== 0 && (
        <Marker position={[lat, lng]} icon={markerIcon}>
          <Popup>
            Your house location
            <br />
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}