'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Upload, X } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

const HOUSE_TYPES = ['APARTMENT', 'VILLA', 'CONDO', 'STUDIO', 'TOWNHOUSE'];
const CITIES = ['Addis Ababa', 'Dire Dawa', 'Adama', 'Hawassa', 'Mek\'ele', 'Bahir Dar', 'Jimma', 'Harar', 'Arba Minch', 'Dessie'];

export default function NewListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    houseType: 'APARTMENT',
    latitude: 9.0320,
    longitude: 38.7469,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' ? Number(value) : value,
    }));
  };

  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const MAX_DIM = 1600;
        const MAX_BYTES = 4 * 1024 * 1024;
        const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
        if (scale >= 1 && dataUrl.length <= MAX_BYTES * 1.4) {
          resolve(dataUrl);
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;
    const compressed: string[] = [];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(String(event.target?.result || ''));
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });
      compressed.push(await compressImage(dataUrl));
    }
    setImages(prev => [...prev, ...compressed]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData to send multipart/form-data with images
      const formDataToSend = new FormData();
      
      // Add listing fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', String(Number(formData.price)));
      formDataToSend.append('address', formData.address);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('bedrooms', String(Number(formData.bedrooms)));
      formDataToSend.append('bathrooms', String(Number(formData.bathrooms)));
      formDataToSend.append('houseType', formData.houseType);
      formDataToSend.append('latitude', String(formData.latitude));
      formDataToSend.append('longitude', String(formData.longitude));

      // Add images if any
      if (images.length > 0) {
        images.forEach((imageData, index) => {
          // Convert data URL back to file
          const arr = imageData.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          const n = bstr.length;
          const u8arr = new Uint8Array(n);
          for (let i = 0; i < n; i++) {
            u8arr[i] = bstr.charCodeAt(i);
          }
          const file = new File([u8arr], `property-${index}.jpg`, { type: mime });
          formDataToSend.append('images', file);
        });
      }

      const response = await api.post('/listings', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        toast.success('Property listed successfully!');
        router.push('/my-listings');
      }
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
      toast.error(message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List Your Property</h1>
        <p className="mt-2 text-gray-600">Fill in the details below to list your property on MAKI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-gray-200 p-6">
        {/* Basic Info */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Modern 3-Bedroom Apartment in Bole"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your property in detail..."
                value={formData.description}
                onChange={handleInputChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">Monthly Price (ETB) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="e.g., 45000"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="houseType">Property Type *</Label>
                <select
                  id="houseType"
                  name="houseType"
                  value={formData.houseType}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {HOUSE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Location</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Select a city</option>
                {CITIES.sort().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="e.g., Bole Road, Near Edna Mall"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="9.0320"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="0.0001"
                  placeholder="38.7469"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <p className="flex items-center gap-2 text-sm text-blue-700">
                <MapPin className="h-4 w-4" />
                📍 Pin your property location on the map (current: {formData.latitude}, {formData.longitude})
              </p>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Property Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                placeholder="3"
                value={formData.bedrooms}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                placeholder="2"
                value={formData.bathrooms}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Property Images</h2>
          <div className="space-y-4">
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (auto-compressed)</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-semibold text-gray-700">Uploaded Images ({images.length})</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Property ${index + 1}`} className="aspect-square rounded-lg object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? 'Publishing...' : 'Publish Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
