import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://htynaxsqqzspuklhozmt.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0eW5heHNxcXpzcHVrbGhvem10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzcyMjEsImV4cCI6MjA4OTMxMzIyMX0.s_XzHlMgE32aMVmwm_qdGWw4Riey-tqSsXAxRMczO7c";

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn("Supabase URL or Key is missing. Check your .env.local file.");
}

export { supabase };
