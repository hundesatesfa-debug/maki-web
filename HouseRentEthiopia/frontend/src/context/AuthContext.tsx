'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Session, type User } from '@/lib/supabase';
import { setApiToken } from '@/lib/api';
import api from '@/lib/api';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'OWNER' | 'RENTER';
  phoneNumber?: string | null;
  profilePicture?: string | null;
}

interface AuthContextValue {
  session: Session | null;
  supabaseUser: User | null;
  appUser: AppUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name: string, role: string, phoneNumber?: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncSession = useCallback(async (sess: Session | null) => {
    setSession(sess);
    setSupabaseUser(sess?.user ?? null);
    setApiToken(sess?.access_token ?? null);

    if (sess?.access_token) {
      // Sync / fetch the app-level profile from the backend.
      try {
        const { data } = await api.get('/auth/me');
        if (data?.user) {
          setAppUser(data.user);
          router.refresh();
        }
      } catch {
        // Profile not created yet — sign-up flow will do it.
      }
    } else {
      setAppUser(null);
    }
  }, [router]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      syncSession(sess);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      syncSession(sess);
    });

    return () => listener.subscription.unsubscribe();
  }, [syncSession]);

  const signUp = async (email: string, password: string, name: string, role: string, phoneNumber?: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role } } });
    if (error) throw new Error(error.message);

    if (data.session) {
      // Email confirmation may be disabled — if we already have a session, sync the profile.
      setApiToken(data.session.access_token);
      await api.post('/auth/register', { name, role, phoneNumber });
      await syncSession(data.session);
      return true;
    }
    return false;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    await syncSession(data.session);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setApiToken(null);
    setSession(null);
    setSupabaseUser(null);
    setAppUser(null);
    router.push('/');
  };

  const refreshProfile = async () => {
    if (session?.access_token) {
      const { data } = await api.get('/auth/me');
      if (data?.user) setAppUser(data.user);
    }
  };

  return (
    <AuthContext.Provider value={{ session, supabaseUser, appUser, isLoading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};