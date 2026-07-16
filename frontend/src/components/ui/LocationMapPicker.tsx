'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Dynamically import the map component to avoid SSR issues with Leaflet
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-md" />,
});

interface LocationMapPickerProps {
  position: { lat: number; lng: number } | null;
  onPositionSelect: (lat: number, lng: number) => void;
}

export function LocationMapPicker({ position, onPositionSelect }: LocationMapPickerProps) {
  return (
    <div className="h-[300px] w-full rounded-md border border-input overflow-hidden">
      <DynamicMap position={position} onPositionSelect={onPositionSelect} />
    </div>
  );
}
