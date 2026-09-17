'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// No localStorage: sessions live in memory only (persistSession: false),
// so nothing is ever written to the browser's storage.
const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
};

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: memoryStorage,
  },
});

export const HOUSE_IMAGES_BUCKET = 'house-images';

export type { Session, User } from '@supabase/supabase-js';

/**
 * Uploads a house photo to Supabase Storage and returns its public URL.
 * Creates the bucket on first use if the anon role has permission.
 */
export async function uploadHouseImage(file: File): Promise<string> {
  const path = `houses/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

  const { error: selectBucketError } = await supabase.storage.getBucket(HOUSE_IMAGES_BUCKET);
  if (selectBucketError) {
    await supabase.storage.createBucket(HOUSE_IMAGES_BUCKET, { public: true });
  }

  const { error } = await supabase.storage.from(HOUSE_IMAGES_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(HOUSE_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}