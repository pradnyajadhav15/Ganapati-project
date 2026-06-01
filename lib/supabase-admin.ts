import "server-only";
import { createClient } from "@supabase/supabase-js";

// Admin client — uses the SECRET service role key. The `server-only` import
// makes the build fail if this is ever imported into client code, so the key
// can never leak to the browser. Use only inside server actions / route handlers.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);
