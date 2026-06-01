import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Cookie-aware client for server components & server actions.
// Reads the logged-in user's session from cookies.
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // In server components cookie writes throw — that's expected and safe
          // to ignore because the middleware refreshes the session instead.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            /* called from a server component — ignore */
          }
        },
      },
    }
  );
}