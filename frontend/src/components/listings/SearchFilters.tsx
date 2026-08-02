'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';

const AMENITIES = ['WiFi', 'Parking', 'Water Tank', 'Generator', 'Security', 'Elevator', 'Furnished'];

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  amenities: string[];
  verifiedLandlordOnly: boolean;
  availableFromDate?: string;
  minStay?: number;
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceMin: 1000,
    priceMax: 100000,
    amenities: [],
    verifiedLandlordOnly: false,
  });

  const handlePriceChange = (newPrice: number[], field: 'min' | 'max') => {
    const updated = {
      ...filters,
      [field === 'min' ? 'priceMin' : 'priceMax']: newPrice[0],
    };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = {
      ...filters,
      amenities: filters.amenities.includes(amenity)
        ? filters.amenities.filter(a => a !== amenity)
        : [...filters.amenities, amenity],
    };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleVerifiedToggle = () => {
    const updated = {
      ...filters,
      verifiedLandlordOnly: !filters.verifiedLandlordOnly,
    };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = {
      ...filters,
      availableFromDate: e.target.value,
    };
    setFilters(updated);
    onFilterChange(updated);
  };

  const handleMinStayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = {
      ...filters,
      minStay: parseInt(e.target.value) || undefined,
    };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      priceMin: 1000,
      priceMax: 100000,
      amenities: [],
      verifiedLandlordOnly: false,
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {(filters.amenities.length > 0 || filters.verifiedLandlordOnly || filters.availableFromDate) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Price Range: ETB {filters.priceMin.toLocaleString()} - {filters.priceMax.toLocaleString()}
          </label>
          <div className="space-y-2">
            <div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={filters.priceMin}
                onChange={(e) => handlePriceChange([parseInt(e.target.value)], 'min')}
                className="w-full"
              />
              <span className="text-xs text-gray-500">Min</span>
            </div>
            <div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={filters.priceMax}
                onChange={(e) => handlePriceChange([parseInt(e.target.value)], 'max')}
                className="w-full"
              />
              <span className="text-xs text-gray-500">Max</span>
            </div>
          </div>
        </div>

        {/* Available From Date */}
        <div>
          <label htmlFor="availableFrom" className="mb-2 block text-sm font-medium text-gray-700">
            Available From
          </label>
          <input
            id="availableFrom"
            type="date"
            value={filters.availableFromDate || ''}
            onChange={handleDateChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Minimum Stay */}
        <div>
          <label htmlFor="minStay" className="mb-2 block text-sm font-medium text-gray-700">
            Minimum Stay (months)
          </label>
          <input
            id="minStay"
            type="number"
            min="1"
            max="36"
            placeholder="Any"
            value={filters.minStay || ''}
            onChange={handleMinStayChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-700">Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {AMENITIES.map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Verified Landlord */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.verifiedLandlordOnly}
              onChange={handleVerifiedToggle}
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-gray-700">Verified Landlord Only</span>
          </label>
          <p className="mt-1 text-xs text-gray-500">Show only properties from KYC-verified landlords</p>
        </div>
      </div>
    </div>
  );
}
