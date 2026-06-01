import { createClient } from "@supabase/supabase-js";

// Public client — uses the anon key. Safe to use in server components for reads.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
