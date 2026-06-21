"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { isEmail, isPhone } from "@/lib/validation";
import { loginUser, sendOtp, verifyOtp } from "@/lib/auth-client";

type Stage = "password" | "otp-send" | "otp-verify";

export function LoginForm({
  method,
  nextPath = "/dashboard",
}: {
  method: "email" | "phone";
  nextPath?: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("password");

  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);

  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const contactLabel = method === "email" ? "Elektron pochta" : "Telefon raqami";

  const validContact = () =>
    method === "email" ? isEmail(contact) : isPhone(contact);

  /** Password login. */
  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    const next: Record<string, string> = {};
    if (!validContact())
      next.contact =
        method === "email"
          ? "To'g'ri elektron pochta kiriting."
          : "To'g'ri telefon raqamini kiriting.";
    if (password.length < 1) next.password = "Parolni kiriting.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const res = await loginUser({ method, contact: contact.trim(), password });
    setLoading(false);

    if (!res.ok) {
      setServerError(res.error ?? "Xatolik yuz berdi.");
      return;
    }
    router.push(nextPath);
    router.refresh();
  };

  /** Switch to code login: request an OTP. */
  const startOtp = async () => {
    setServerError("");
    setErrors({});
    if (!validContact()) {
      setErrors({
        contact:
          method === "email"
            ? "Avval elektron pochtangizni kiriting."
            : "Avval telefon raqamingizni kiriting.",
      });
      return;
    }
    setLoading(true);
    const res = await sendOtp({ channel: method, contact: contact.trim(), purpose: "login" });
    setLoading(false);
    if (!res.ok) {
      setServerError(res.error ?? "Kodni yuborib bo'lmadi.");
      return;
    }
    setDevCode(res.devCode);
    setCode("");
    setStage("otp-verify");
  };

  /** Verify the OTP and log in (no password). */
  const handleOtpVerify = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (code.length !== 6) {
      setServerError("6 xonali kodni to'liq kiriting.");
      return;
    }
    setLoading(true);
    const v = await verifyOtp({ channel: method, contact: contact.trim(), code });
    if (!v.ok) {
      setLoading(false);
      setServerError(v.error ?? "Kod noto'g'ri.");
      return;
    }
    // OTP login: confirm via dedicated endpoint.
    const res = await fetch("/api/auth/otp/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: method, contact: contact.trim(), code }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setServerError(data.error ?? "Kirib bo'lmadi.");
      return;
    }
    router.push(nextPath);
    router.refresh();
  };

  if (stage === "otp-verify") {
    return (
      <form className="space-y-4" onSubmit={handleOtpVerify} noValidate>
        <button
          type="button"
          onClick={() => setStage("password")}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Parol bilan kirish
        </button>

        <div>
          <h3 className="text-base font-semibold text-ink-900">Tasdiqlash kodi</h3>
          <p className="mt-1 text-sm text-ink-600">
            <span className="font-medium text-ink-800">{contact}</span> manziliga
            yuborilgan 6 xonali kodni kiriting.
          </p>
        </div>

        {devCode && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-100">
            Demo rejim: kodingiz <span className="font-bold">{devCode}</span>
          </p>
        )}
        {serverError && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
            {serverError}
          </p>
        )}

        <OtpInput value={code} onChange={setCode} invalid={Boolean(serverError)} />

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Kirish
        </Button>
        <button
          type="button"
          onClick={startOtp}
          className="mx-auto flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Kodni qayta yuborish
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handlePassword} noValidate>
      {serverError && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
          {serverError}
        </p>
      )}
      <Input
        label={contactLabel}
        name="contact"
        type={method === "email" ? "email" : "tel"}
        placeholder={method === "email" ? "example@mail.com" : "+998 90 123 45 67"}
        leadingIcon={
          method === "email" ? (
            <Mail className="h-4 w-4" />
          ) : (
            <Phone className="h-4 w-4" />
          )
        }
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        error={errors.contact}
        autoComplete={method === "email" ? "email" : "tel"}
      />
      <Input
        label="Parol"
        name="password"
        type={show ? "text" : "password"}
        placeholder="Parolni kiriting"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        autoComplete="current-password"
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

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-ink-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
          />
          Meni eslab qolish
        </label>
        <Link href="/forgot-password" className="font-semibold text-brand-600 hover:underline">
          Parolni unutdingizmi?
        </Link>
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Kirish
      </Button>

      <button
        type="button"
        onClick={startOtp}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition hover:bg-ink-50 disabled:opacity-50"
      >
        <ShieldCheck className="h-4 w-4 text-brand-500" />
        Bir martalik kod bilan kirish
      </button>
    </form>
  );
}
