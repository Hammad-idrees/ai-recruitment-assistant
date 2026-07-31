// Server-only: uses SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix, so it's
// undefined in any client bundle). Never import this from a "use client" file.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const RESUMES_BUCKET = "resumes";

let client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServerClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  client = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}

export { RESUMES_BUCKET };
