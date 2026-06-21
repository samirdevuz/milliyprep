import { promises as fs } from "node:fs";
import path from "node:path";
import { randomInt, randomUUID } from "node:crypto";
import { formatSupabaseError, getSupabaseAdmin } from "./supabase";
import { requireLocalDataFallback } from "./config";

/**
 * Shared verification store used by:
 *  - email / phone OTP (register + login confirmation)
 *  - Telegram registration (bot writes phone+code, web reads it)
 *
 * Uses Supabase/Postgres when configured. In development it can fall back to a
 * local JSON file for zero-service setup.
 */

export type VerificationChannel = "email" | "phone" | "telegram";

export interface VerificationRecord {
  id: string;
  channel: VerificationChannel;
  /** email address, phone number, or phone for telegram. */
  contact: string;
  code: string;
  /** Telegram-only metadata. */
  telegramId?: number;
  telegramUsername?: string;
  /** Whether the code has been confirmed by the user on the website. */
  verified: boolean;
  attempts: number;
  createdAt: number;
  expiresAt: number;
}

interface SupabaseVerificationRow {
  id: string;
  channel: VerificationChannel;
  contact: string;
  contact_key: string;
  code: string;
  telegram_id: number | null;
  telegram_username: string | null;
  verified: boolean;
  attempts: number;
  created_at: string;
  expires_at: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "verifications.json");

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

async function ensure(): Promise<void> {
  requireLocalDataFallback("Local verification store");
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE);
  } catch {
    await fs.writeFile(FILE, "[]", "utf8");
  }
}

async function readAll(): Promise<VerificationRecord[]> {
  await ensure();
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const list = JSON.parse(raw) as VerificationRecord[];
    // Drop expired records opportunistically.
    const now = Date.now();
    return list.filter((r) => r.expiresAt > now - CODE_TTL_MS);
  } catch {
    return [];
  }
}

async function writeAll(list: VerificationRecord[]): Promise<void> {
  await ensure();
  await fs.writeFile(FILE, JSON.stringify(list, null, 2), "utf8");
}

function normalize(contact: string, channel: VerificationChannel): string {
  if (channel === "email") return contact.trim().toLowerCase();
  return contact.replace(/[^\d]/g, "");
}

function toRecord(row: SupabaseVerificationRow): VerificationRecord {
  return {
    id: row.id,
    channel: row.channel,
    contact: row.contact,
    code: row.code,
    telegramId: row.telegram_id ?? undefined,
    telegramUsername: row.telegram_username ?? undefined,
    verified: row.verified,
    attempts: row.attempts,
    createdAt: new Date(row.created_at).getTime(),
    expiresAt: new Date(row.expires_at).getTime(),
  };
}

export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export const verificationStore = {
  /**
   * Create or replace a verification record for a contact+channel.
   * Returns the created record (including the code).
   */
  async upsert(input: {
    channel: VerificationChannel;
    contact: string;
    code?: string;
    telegramId?: number;
    telegramUsername?: string;
  }): Promise<VerificationRecord> {
    const supabase = getSupabaseAdmin();
    const key = normalize(input.contact, input.channel);
    const now = Date.now();
    const record: VerificationRecord = {
      id: randomUUID(),
      channel: input.channel,
      contact: input.contact,
      code: input.code ?? generateCode(),
      telegramId: input.telegramId,
      telegramUsername: input.telegramUsername,
      verified: false,
      attempts: 0,
      createdAt: now,
      expiresAt: now + CODE_TTL_MS,
    };

    if (supabase) {
      const { error: deleteError } = await supabase
        .from("verifications")
        .delete()
        .eq("channel", input.channel)
        .eq("contact_key", key);
      if (deleteError) {
        throw formatSupabaseError("verification upsert cleanup", deleteError.message);
      }

      const { data, error } = await supabase
        .from("verifications")
        .insert({
          id: record.id,
          channel: record.channel,
          contact: record.contact,
          contact_key: key,
          code: record.code,
          telegram_id: record.telegramId ?? null,
          telegram_username: record.telegramUsername ?? null,
          verified: record.verified,
          attempts: record.attempts,
          created_at: new Date(record.createdAt).toISOString(),
          expires_at: new Date(record.expiresAt).toISOString(),
        })
        .select("*")
        .single();
      if (error) throw formatSupabaseError("verification upsert", error.message);
      return toRecord(data as SupabaseVerificationRow);
    }

    const list = await readAll();
    const filtered = list.filter(
      (r) => !(r.channel === input.channel && normalize(r.contact, r.channel) === key)
    );
    filtered.push(record);
    await writeAll(filtered);
    return record;
  },

  /** Find the latest active record for a Telegram-issued code. */
  async findTelegramByCode(code: string): Promise<VerificationRecord | undefined> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .eq("channel", "telegram")
        .eq("code", code)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw formatSupabaseError("findTelegramByCode", error.message);
      return data ? toRecord(data as SupabaseVerificationRow) : undefined;
    }

    const list = await readAll();
    return list.find(
      (r) => r.channel === "telegram" && r.code === code && r.expiresAt > Date.now()
    );
  },

  /**
   * Check a code against the latest record for contact+channel.
   * On success marks the record verified and returns it.
   */
  async check(
    channel: VerificationChannel,
    contact: string,
    code: string
  ): Promise<
    | { ok: true; record: VerificationRecord }
    | { ok: false; error: string }
  > {
    const supabase = getSupabaseAdmin();
    const key = normalize(contact, channel);
    if (supabase) {
      const { data, error } = await supabase
        .from("verifications")
        .select("*")
        .eq("channel", channel)
        .eq("contact_key", key)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw formatSupabaseError("verification check", error.message);
      if (!data) {
        return { ok: false, error: "Kod topilmadi. Qaytadan urinib ko'ring." };
      }

      const rec = data as SupabaseVerificationRow;
      if (new Date(rec.expires_at).getTime() < Date.now()) {
        return { ok: false, error: "Kod muddati tugagan. Yangi kod so'rang." };
      }
      if (rec.attempts >= MAX_ATTEMPTS) {
        return { ok: false, error: "Juda ko'p urinish. Yangi kod so'rang." };
      }
      if (rec.code !== code) {
        const { error: updateError } = await supabase
          .from("verifications")
          .update({ attempts: rec.attempts + 1 })
          .eq("id", rec.id);
        if (updateError) {
          throw formatSupabaseError("verification attempts", updateError.message);
        }
        return { ok: false, error: "Kod noto'g'ri." };
      }

      const { data: updated, error: updateError } = await supabase
        .from("verifications")
        .update({ verified: true })
        .eq("id", rec.id)
        .select("*")
        .single();
      if (updateError) {
        throw formatSupabaseError("verification success", updateError.message);
      }
      return { ok: true, record: toRecord(updated as SupabaseVerificationRow) };
    }

    const list = await readAll();
    const idx = list.findIndex(
      (r) => r.channel === channel && normalize(r.contact, r.channel) === key
    );
    if (idx === -1) {
      return { ok: false, error: "Kod topilmadi. Qaytadan urinib ko'ring." };
    }
    const rec = list[idx];
    if (rec.expiresAt < Date.now()) {
      return { ok: false, error: "Kod muddati tugagan. Yangi kod so'rang." };
    }
    if (rec.attempts >= MAX_ATTEMPTS) {
      return { ok: false, error: "Juda ko'p urinish. Yangi kod so'rang." };
    }
    if (rec.code !== code) {
      rec.attempts += 1;
      list[idx] = rec;
      await writeAll(list);
      return { ok: false, error: "Kod noto'g'ri." };
    }
    rec.verified = true;
    list[idx] = rec;
    await writeAll(list);
    return { ok: true, record: rec };
  },

  /** Mark a telegram record verified (used after website code entry). */
  async markVerified(id: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from("verifications")
        .update({ verified: true })
        .eq("id", id);
      if (error) throw formatSupabaseError("markVerified", error.message);
      return;
    }

    const list = await readAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx].verified = true;
      await writeAll(list);
    }
  },

  async remove(id: string): Promise<void> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase
        .from("verifications")
        .delete()
        .eq("id", id);
      if (error) throw formatSupabaseError("verification remove", error.message);
      return;
    }

    const list = await readAll();
    await writeAll(list.filter((r) => r.id !== id));
  },
};
