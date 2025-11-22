// Supabase Client for Frontend
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// NOTE: Supabase Anon Key is PUBLIC and safe to expose in frontend code
// It only allows authenticated operations defined in your Row Level Security policies
// For production deployment, set SUPABASE_URL and SUPABASE_ANON_KEY in Netlify environment variables

const SUPABASE_URL = 'https://oekreylufrqvuzgoyxye.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI3NzEwNzQsImV4cCI6MjA0ODM0NzA3NH0.s1wKSM7hfRCH3Y7cVVE-8xO2qx8l-V9gTNu-SQTF-tY';

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
  const { data: { session }, error } = await supabase.auth.getSession();
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
