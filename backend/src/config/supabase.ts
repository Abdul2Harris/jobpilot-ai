import { createClient } from "@supabase/supabase-js";
import { env } from "./env.js";


// Public client - uses anon key, respects RLS
export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey
);

// Admin client - bypasses RLS, use only in trusted server-side logic
export const supabaseAdmin = createClient(
  env.supabase.url,
  env.supabase.serviceRoleKey
);