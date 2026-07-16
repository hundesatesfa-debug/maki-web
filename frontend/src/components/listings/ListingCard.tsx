import Link from 'next/link';
import { Bed, Bath, MapPin, Star } from 'lucide-react';
import { Listing } from '@/types/listing';
import { ROUTES } from '@/constants/routes';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatHouseType, formatPrice, getListingImage } from '@/lib/listingImages';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const imageUrl = getListingImage(listing.houseType, listing.images[0]?.url);

  return (
    <Link href={ROUTES.LISTING_DETAIL(listing.id)}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[16/10] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {listing.isPremium && (
            <Badge className="absolute left-3 top-3 bg-amber-500 text-white hover:bg-amber-500">
              <Star className="mr-1 h-3 w-3 fill-current" />
              Premium
            </Badge>
          )}
          <Badge variant="secondary" className="absolute right-3 top-3 bg-white/90">
            {formatHouseType(listing.houseType)}
          </Badge>
        </div>
        <CardContent className="space-y-2 pt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-emerald-700">
              {listing.title}
            </h3>
            <p className="shrink-0 font-bold text-emerald-700">{formatPrice(listing.price)}</p>
          </div>
          <p className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {listing.city}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {listing.bedrooms} bed
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {listing.bathrooms} bath
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
