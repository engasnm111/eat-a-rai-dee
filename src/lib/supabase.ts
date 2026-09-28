import { createClient } from '@supabase/supabase-js';

const url = import.meta.env['VITE_SUPABASE_URL']?.trim();
const publishableKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY']?.trim();

// The publishable key is intended for browser use. Never add a secret key here.
export const supabase =
  url && publishableKey ? createClient(url, publishableKey) : null;

export async function googleProviderEnabled(): Promise<boolean> {
  if (!url || !publishableKey) return false;

  const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/settings`, {
    headers: { apikey: publishableKey },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Could not read Supabase Auth settings');

  const settings: unknown = await response.json();
  if (!settings || typeof settings !== 'object' || !('external' in settings))
    throw new Error('Invalid Supabase Auth settings');

  const external = settings.external;
  return Boolean(
    external &&
    typeof external === 'object' &&
    'google' in external &&
    external.google === true,
  );
}
