'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  Clock3,
  Heart,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageCircle,
  UserPlus,
  Settings,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useLanguageStore } from '@/hooks/useLanguage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useState } from 'react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();
  const { language, setLanguage, t } = useLanguageStore();
  const [showMenu, setShowMenu] = useState(false);

  const navLinks = [
    { href: ROUTES.HOME, label: t('nav.home'), icon: Home },
    { href: ROUTES.LISTINGS, label: t('nav.browse'), icon: Building2 },
    { href: ROUTES.FAVORITES, label: t('nav.favorites'), icon: Heart },
    { href: ROUTES.CHAT, label: t('nav.messages'), icon: MessageCircle },
  ];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    router.push(ROUTES.HOME);
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-emerald-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold text-lg shadow-lg">
            M
          </div>
          <span className="hidden text-lg sm:inline bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black tracking-tight">MAKI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
          
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.firstName}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.firstName.charAt(0)}
                  </div>
                )}
                <span className="hidden sm:inline">{user.firstName}</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-emerald-600 mt-1 font-medium">{user.role}</p>
                  </div>
                  <nav className="py-2">
                    {user.role === 'ADMIN' && (
                      <Link
                        href={ROUTES.ADMIN_DASHBOARD}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setShowMenu(false)}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    {user.role === 'OWNER' && (
                      <Link
                        href={ROUTES.MY_LISTINGS}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setShowMenu(false)}
                      >
                        <Building2 className="h-4 w-4" />
                        My Listings
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      disabled={logoutMutation.isPending}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-t text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'hidden sm:inline-flex')}
              >
                <LogIn className="mr-1.5 h-4 w-4" />
                {t('nav.signIn')}
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className={cn(buttonVariants({ size: 'sm' }), 'bg-emerald-600 hover:bg-emerald-700')}
              >
                <UserPlus className="mr-1.5 h-4 w-4" />
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-emerald-700">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold shadow-lg">
                M
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-black">MAKI</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Find and rent homes across Ethiopia. Connect directly with property owners.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Explore</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              <li>
                <Link href={ROUTES.LISTINGS} className="hover:text-emerald-600">
                  Browse listings
                </Link>
              </li>
              <li>
                <Link href={ROUTES.LOGIN} className="hover:text-emerald-600">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href={ROUTES.REGISTER} className="hover:text-emerald-600">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Status</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Auth system working
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Listings browse with filters
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Direct messaging enabled
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Property owner listing
              </li>
              <li className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-amber-600" />
                Favorites & admin panel
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-400">
          Copyright {new Date().getFullYear()} MAKI - Premium Property Rentals
        </p>
      </div>
    </footer>
  );
}
