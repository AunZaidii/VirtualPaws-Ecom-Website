// Auth Guard - Use this on pages that require authentication
import { supabase, getCurrentSession } from './supabaseClient.js';
import { apiClient } from './apiClient.js';

export async function requireAuth(redirectUrl = '/Authentication/login.html') {
  try {
    // Get session from Supabase
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
