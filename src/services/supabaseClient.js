import { createClient } from "@supabase/supabase-js";

// Use import.meta.env to access environment variables in Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only log in development mode
if (import.meta.env.DEV) {
  console.log("SUPABASE URL:", supabaseUrl);
  console.log("SUPABASE KEY:", supabaseKey ? "Key exists" : "Key missing");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
