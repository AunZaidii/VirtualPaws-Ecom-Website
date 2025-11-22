// Supabase Client for Frontend
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// NOTE: Supabase Anon Key is PUBLIC and safe to expose in frontend code
// It only allows authenticated operations defined in your Row Level Security policies
// For production deployment, set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify environment variables

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
    storageKey: 'supabase.auth.session'
  }
});

// Helper function to get current session
export async function getCurrentSession() {
  const instance = await initSupabase();
  const { data: { session }, error } = await instance.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
}

// Helper function to get current user
export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user || null;
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const session = await getCurrentSession();
  return !!session;
}
