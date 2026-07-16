import Link from 'next/link';
import { Search, Shield, MessageSquare, Building2, CheckCircle2 } from 'lucide-react';
import { getListings } from '@/lib/listings';
import { ListingCard } from '@/components/listings/ListingCard';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

export default async function HomePage() {
  const listings = await getListings();
  const premiumListings = listings.filter((l) => l.isPremium);
  const featured = premiumListings.length ? premiumListings : listings.slice(0, 2);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggIGQ9Ik0zNiAzNGg0djRoLTR6TTAgMzRoNHY0SDB6TTAgMGg0djRoLTR6TTM2IDBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-emerald-100">
              Ethiopia&apos;s #1 Rental Platform
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect Home in Ethiopia
            </h1>
            <p className="mt-4 text-lg text-emerald-50">
              Browse apartments, villas, condos and more across Addis Ababa, Hawassa, and beyond.
              Connect directly with verified property owners.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={ROUTES.LISTINGS}
                className={cn(buttonVariants({ size: 'lg' }), 'bg-white text-emerald-700 hover:bg-emerald-50')}
              >
                <Search className="mr-2 h-5 w-5" />
                Browse {listings.length} Listings
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'border-white/30 bg-white/10 text-white hover:bg-white/20'
                )}
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b bg-amber-50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="font-semibold text-amber-800">What&apos;s working now:</span>
            {['User login & register', 'JWT authentication', 'Listings browse', 'Listing details'].map((item) => (
              <span key={item} className="flex items-center gap-1 text-amber-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </span>
            ))}
            <span className="text-amber-600">| Coming soon: messaging, favorites, admin dashboard</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Building2,
              title: 'Verified Listings',
              desc: 'Browse real properties from trusted owners across Ethiopia.',
            },
            {
              icon: Shield,
              title: 'Secure Platform',
              desc: 'JWT auth, encrypted passwords, and role-based access control.',
            },
            {
              icon: MessageSquare,
              title: 'Direct Messaging',
              desc: 'Chat with owners about listings - UI coming soon.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-1 text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
              <p className="mt-1 text-gray-500">Premium listings from our database</p>
            </div>
            <Link href={ROUTES.LISTINGS} className={buttonVariants({ variant: 'outline' })}>
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">All Available Listings</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </>
  );
}
