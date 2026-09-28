import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { googleProviderEnabled, supabase } from '../../lib/supabase';

type AuthError = 'providerDisabled' | 'signInFailed' | 'signOutFailed' | null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AuthError>(null);

  useEffect(() => {
    if (!supabase) return;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = async () => {
    if (!supabase) return;
    setBusy(true);
    setError(null);

    try {
      if (!(await googleProviderEnabled())) {
        setError('providerDisabled');
        return;
      }
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
        },
      });
      if (authError) setError('signInFailed');
    } catch {
      setError('signInFailed');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (!supabase) return;
    setBusy(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signOut();
      if (authError) setError('signOutFailed');
    } catch {
      setError('signOutFailed');
    } finally {
      setBusy(false);
    }
  };

  return {
    user,
    ready,
    busy,
    error,
    configured: Boolean(supabase),
    signIn,
    signOut,
  };
}

export type AuthState = ReturnType<typeof useAuth>;
