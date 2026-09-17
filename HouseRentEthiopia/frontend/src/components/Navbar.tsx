'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { appUser, signOut, supabaseUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isOwner = appUser?.role === 'OWNER' || appUser?.role === 'ADMIN';

  return (
    <nav className="sticky top-0 z-10 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-emerald-700">
          HouseRent<span className="text-zinc-900">Ethiopia</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:block">
            Browse
          </Link>
          {isOwner && (
            <Link
              href="/houses/new"
              className="hidden rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 sm:block"
            >
              + List a House
            </Link>
          )}

          {supabaseUser ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                <span className="h-7 w-7 rounded-full bg-emerald-600 text-xs font-semibold text-white inline-flex items-center justify-center">
                  {appUser?.name?.[0]?.toUpperCase() ?? supabaseUser.email?.[0]?.toUpperCase()}
                </span>
                <span className="hidden sm:inline">{appUser?.name?.split(' ')[0] ?? 'Account'}</span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
                  <div className="border-b border-zinc-100 px-3 py-2">
                    <p className="truncate text-sm font-medium text-zinc-900">{appUser?.name ?? 'User'}</p>
                    <p className="truncate text-xs text-zinc-500">{supabaseUser.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      {appUser?.role ?? '…'}
                    </span>
                  </div>
                  {isOwner && (
                    <Link
                      href="/houses/new"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 sm:hidden"
                    >
                      + List a House
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setMenuOpen(false);
                      await signOut();
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}