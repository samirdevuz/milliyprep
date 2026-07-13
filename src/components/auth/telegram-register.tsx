"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Send, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { registerTelegram } from "@/lib/auth-client";

const BOT_USERNAME = "MilliyPrepBot";

const STEPS = [
  "Quyidagi tugma orqali @" + BOT_USERNAME + " botini oching.",
  "Botda /start buyrug'ini yuboring.",
  "Telefon raqamingizni ulashing — bot 6 xonali kod beradi.",
  "Kodni quyiga kiriting, so'ng login va parol o'rnating.",
];

export function TelegramRegister({
  onBack,
  nextPath = "/dashboard",
}: {
  onBack: () => void;
  nextPath?: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("6 xonali kodni to'liq kiriting.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Login kiriting (kamida 2 ta belgi).");
      return;
    }
    if (password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lsin.");
      return;
    }

    setLoading(true);
    const result = await registerTelegram({ code, name: name.trim(), password });
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Xatolik yuz berdi.");
      return;
    }
    router.push(nextPath);
    router.refresh();
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Orqaga
      </button>

      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-[0_8px_20px_-8px_rgba(14,165,233,0.55)]">
          <Send className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink-900">
            Telegram orqali ro&apos;yxatdan o&apos;tish
          </h2>
          <p className="text-xs text-ink-500">Tez va parolsiz boshlanadi</p>
        </div>
      </div>

      {/* Steps */}
      <ol className="space-y-2.5">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
              {i + 1}
            </span>
            <span className="text-sm text-ink-700">{step}</span>
          </li>
        ))}
      </ol>

      <a
        href={`https://t.me/${BOT_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
      >
        <Send className="h-4 w-4" />
        @{BOT_USERNAME} ni ochish
      </a>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800">
            Botdan olingan kod
          </label>
          <OtpInput value={code} onChange={setCode} invalid={Boolean(error) && code.length !== 6} />
        </div>

        <Input
          label="Login"
          name="tg-name"
          placeholder="Foydalanuvchi nomi"
          leadingIcon={<User className="h-4 w-4" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="username"
        />

        <Input
          label="Parol"
          name="tg-password"
          type={show ? "text" : "password"}
          placeholder="Kamida 8 ta belgi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          trailingIcon={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="text-ink-500 hover:text-ink-700"
              aria-label={show ? "Parolni yashirish" : "Parolni ko'rsatish"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Ro&apos;yxatdan o&apos;tishni yakunlash
        </Button>
      </form>
    </div>
  );
}
