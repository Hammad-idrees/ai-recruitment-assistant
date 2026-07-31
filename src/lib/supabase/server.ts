// Server-only: uses SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix, so it's
// undefined in any client bundle). Never import this from a "use client" file.
import { createClient } from "@supabase/supabase-js";

const RESUMES_BUCKET = "resumes";

// Not using createClient<Database>: supabase-js's generic expects an exact
// internal shape (Relationships, etc.) beyond a hand-written Row/Insert/
// Update type, and even a bare untyped client resolves query results to
// `never` without it. Row shapes in ./types annotate results manually at
// each call site instead, so the client itself is intentionally untyped.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any = null;

export function getSupabaseServerClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}

export { RESUMES_BUCKET };
