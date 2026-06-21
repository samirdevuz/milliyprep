import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;
let unavailableUntil = 0;
const UNAVAILABLE_RETRY_MS = 60_000;

function supabaseKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && supabaseKey());
}

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = supabaseKey();

  if (!url || !key) return null;
  if (Date.now() < unavailableUntil) return null;

  if (!adminClient) {
    adminClient = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return adminClient;
}

export function formatSupabaseError(action: string, message: string): Error {
  return new Error(`Supabase ${action} xatosi: ${message}`);
}

export function isSupabaseConnectionError(message: string): boolean {
  const normalized = message.toLowerCase();
  const isConnectionError =
    normalized.includes("fetch failed") ||
    normalized.includes("failed to fetch") ||
    normalized.includes("networkerror") ||
    normalized.includes("network error") ||
    normalized.includes("econnrefused") ||
    normalized.includes("enotfound") ||
    normalized.includes("etimedout");

  if (isConnectionError) {
    unavailableUntil = Date.now() + UNAVAILABLE_RETRY_MS;
  }

  return isConnectionError;
}
