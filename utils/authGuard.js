// Auth Guard - Use this on pages that require authentication
import { getSupabase, getCurrentSession } from './supabaseClient.js';
import { apiClient } from './apiClient.js';

export async function requireAuth(redirectUrl = '/Authentication/login.html') {
  try {
    // Check localStorage first for immediate access
    const localSession = localStorage.getItem('supabase.auth.session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        if (parsed.access_token && parsed.user) {
          apiClient.setAuthSession(parsed);
          console.log('Auth guard: Session found in localStorage');
          return parsed.user;
        }
      } catch (e) {
        console.error('Failed to parse localStorage session');
      }
    }

    // Get session from Supabase
    const supabase = await getSupabase();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth check error:', error);
      window.location.href = redirectUrl;
      return null;
    }

    if (!session) {
      console.log('No session found, redirecting to login');
      window.location.href = redirectUrl;
      return null;
    }

    // Store session in localStorage for apiClient compatibility
    apiClient.setAuthSession(session);
    
    return session.user;
  } catch (err) {
    console.error('Auth guard error:', err);
    window.location.href = redirectUrl;
    return null;
  }
}

// Optional: Check if user is authenticated without redirecting
export async function checkAuth() {
  try {
    // Check localStorage first
    const localSession = localStorage.getItem('supabase.auth.session');
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        if (parsed.access_token && parsed.user) {
          apiClient.setAuthSession(parsed);
          return parsed.user;
        }
      } catch (e) {
        console.error('Failed to parse localStorage session');
      }
    }

    const supabase = await getSupabase();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      apiClient.setAuthSession(session);
      return session.user;
    }
    return null;
  } catch (err) {
    console.error('Check auth error:', err);
    return null;
  }
}
