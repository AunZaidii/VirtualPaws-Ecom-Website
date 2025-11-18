// Supabase Initialization File

// Your Supabase Project URL
const SUPABASE_URL = "https://oekreylufrqvuzgoyxye.supabase.co";

// Your Supabase Public ANON Key
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9la3JleWx1ZnJxdnV6Z295eHllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNzk1NTYsImV4cCI6MjA3Nzc1NTU1Nn0.t02ttVCOwxMdBdyyp467HNjh9xzE7rw2YxehYpZrC_8";

// Create a Supabase client instance
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export (optional)
window.supabaseClient = supabaseClient;

console.log("Supabase initialized successfully!");
