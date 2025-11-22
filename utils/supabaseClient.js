// Supabase Client for Frontend
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Fetch config from Netlify function
let supabaseInstance = null;
let configPromise = null;

async function fetchConfig() {
  const response = await fetch('/.netlify/functions/getConfig');
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}

async function initSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!configPromise) {
    configPromise = fetchConfig();
  }

  const config = await configPromise;
  
  supabaseInstance = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: localStorage,
      storageKey: 'supabase.auth.session'
    }
  });

  return supabaseInstance;
}

// Export function to get initialized supabase client
export async function getSupabase() {
  return await initSupabase();
}

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
