import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ekspor instance supabase jika variabel lingkungan tersedia, jika tidak ekspor null untuk fallback aman
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Ekspor utilitas pembantu untuk memeriksa status aktif Supabase
export const isSupabaseEnabled = () => {
  return supabase !== null;
};
