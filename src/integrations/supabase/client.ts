import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Supports both Vite env vars (for local dev / Vercel) and hardcoded fallbacks
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://ydnmypbesgzfcedjaryj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlkbm15cGJlc2d6ZmNlZGphcnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDIyMDIsImV4cCI6MjA4NzU3ODIwMn0.-KplDq2TVqJrhDWuC06vzl8jjW0EzUEGvVAjLTEQTio";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});