import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = import.meta.env.SSR
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createBrowserClient(supabaseUrl, supabaseAnonKey);
