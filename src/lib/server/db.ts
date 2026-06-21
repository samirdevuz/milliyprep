import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  isSupabaseConnectionError,
} from "./supabase";
import { requireLocalDataFallback } from "./config";

/**
 * User store abstraction. Uses Supabase/Postgres when SUPABASE_URL +
 * SUPABASE_SECRET_KEY are configured. In development it can fall back to a
 * local JSON file so the MVP remains runnable without external services.
 */
export interface UserRecord {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  /** Empty for OAuth/Telegram-only accounts that have no password. */
  passwordHash: string;
  provider: "email" | "phone" | "telegram" | "google";
  /** Provider-specific external id (Google sub / Telegram user id). */
  externalId?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  /** Raw onboarding answers captured at signup (optional). */
  onboarding?: Record<string, unknown>;
}

interface SupabaseUserRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  password_hash: string;
  provider: UserRecord["provider"];
  external_id: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  onboarding: Record<string, unknown> | null;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureFile(): Promise<void> {
  requireLocalDataFallback("Local user store");
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<UserRecord[]> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  try {
    return JSON.parse(raw) as UserRecord[];
  } catch {
    return [];
  }
}

async function writeAll(users: UserRecord[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function norm(s: string): string {
  return s.trim().toLowerCase();
}

function phoneKey(s: string): string {
  return s.replace(/\D/g, "");
}

function toUser(row: SupabaseUserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    passwordHash: row.password_hash,
    provider: row.provider,
    externalId: row.external_id ?? undefined,
    emailVerified: row.email_verified,
    phoneVerified: row.phone_verified,
    createdAt: row.created_at,
    onboarding: row.onboarding ?? undefined,
  };
}

function toInsert(data: Omit<UserRecord, "id" | "createdAt">) {
  return {
    id: randomUUID(),
    name: data.name,
    email: data.email ? norm(data.email) : null,
    phone: data.phone ? phoneKey(data.phone) : null,
    password_hash: data.passwordHash,
    provider: data.provider,
    external_id: data.externalId ?? null,
    email_verified: Boolean(data.emailVerified),
    phone_verified: Boolean(data.phoneVerified),
    onboarding: data.onboarding ?? null,
  };
}

function toPatch(patch: Partial<Omit<UserRecord, "id" | "createdAt">>) {
  const row: Partial<Omit<SupabaseUserRow, "id" | "created_at">> = {};
  if ("name" in patch) row.name = patch.name;
  if ("email" in patch) row.email = patch.email ? norm(patch.email) : null;
  if ("phone" in patch) row.phone = patch.phone ? phoneKey(patch.phone) : null;
  if ("passwordHash" in patch) row.password_hash = patch.passwordHash;
  if ("provider" in patch) row.provider = patch.provider;
  if ("externalId" in patch) row.external_id = patch.externalId ?? null;
  if ("emailVerified" in patch) row.email_verified = Boolean(patch.emailVerified);
  if ("phoneVerified" in patch) row.phone_verified = Boolean(patch.phoneVerified);
  if ("onboarding" in patch) row.onboarding = patch.onboarding ?? null;
  return row;
}

export const userStore = {
  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", norm(email))
        .maybeSingle();
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("findByEmail", error.message);
        }
      } else {
        return data ? toUser(data as SupabaseUserRow) : undefined;
      }
    }

    const users = await readAll();
    return users.find((u) => u.email && norm(u.email) === norm(email));
  },

  async findByPhone(phone: string): Promise<UserRecord | undefined> {
    const supabase = getSupabaseAdmin();
    const p = phoneKey(phone);
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone", p)
        .maybeSingle();
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("findByPhone", error.message);
        }
      } else {
        return data ? toUser(data as SupabaseUserRow) : undefined;
      }
    }

    const users = await readAll();
    return users.find((u) => u.phone && phoneKey(u.phone) === p);
  },

  async findByProvider(
    provider: UserRecord["provider"],
    externalId: string
  ): Promise<UserRecord | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("provider", provider)
        .eq("external_id", externalId)
        .maybeSingle();
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("findByProvider", error.message);
        }
      } else {
        return data ? toUser(data as SupabaseUserRow) : undefined;
      }
    }

    const users = await readAll();
    return users.find(
      (u) => u.provider === provider && u.externalId === externalId
    );
  },

  async update(
    id: string,
    patch: Partial<Omit<UserRecord, "id" | "createdAt">>
  ): Promise<UserRecord | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .update(toPatch(patch))
        .eq("id", id)
        .select("*")
        .maybeSingle();
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("update", error.message);
        }
      } else {
        return data ? toUser(data as SupabaseUserRow) : undefined;
      }
    }

    const users = await readAll();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    users[idx] = { ...users[idx], ...patch };
    await writeAll(users);
    return users[idx];
  },

  async getById(id: string): Promise<UserRecord | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("getById", error.message);
        }
      } else {
        return data ? toUser(data as SupabaseUserRow) : undefined;
      }
    }

    const users = await readAll();
    return users.find((u) => u.id === id);
  },

  async create(
    data: Omit<UserRecord, "id" | "createdAt">
  ): Promise<UserRecord> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data: row, error } = await supabase
        .from("users")
        .insert(toInsert(data))
        .select("*")
        .single();
      if (error) {
        if (!isSupabaseConnectionError(error.message)) {
          throw formatSupabaseError("create", error.message);
        }
      } else {
        return toUser(row as SupabaseUserRow);
      }
    }

    const users = await readAll();
    const record: UserRecord = {
      ...data,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    if (record.email) record.email = norm(record.email);
    if (record.phone) record.phone = phoneKey(record.phone);
    users.push(record);
    await writeAll(users);
    return record;
  },
};
