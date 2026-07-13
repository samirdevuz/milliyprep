"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Mail, Phone, RefreshCw, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { isEmail, isPhone } from "@/lib/validation";
import { registerUser, sendOtp } from "@/lib/auth-client";

type Stage = "details" | "verify";

export function RegisterForm({
  method,
  nextPath = "/dashboard",
}: {
  method: "email" | "phone";
  nextPath?: string;
}) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("details");

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [show, setShow] = useState(false);

  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const contactLabel = method === "email" ? "Elektron pochta" : "Telefon raqami";

  /** Step 1 — validate details and request an OTP. */
  const handleDetails = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Ismingizni kiriting.";
    if (method === "email" && !isEmail(contact))
      next.contact = "To'g'ri elektron pochta kiriting.";
    if (method === "phone" && !isPhone(contact))
      next.contact = "To'g'ri telefon raqamini kiriting.";
    if (password.length < 8)
      next.password = "Kamida 8 ta belgidan iborat bo'lsin.";
    if (password !== confirm) next.confirm = "Parollar mos emas.";
    if (!agreed) next.agreed = "Foydalanish shartlariga rozilik bering.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    const res = await sendOtp({ channel: method, contact: contact.trim(), purpose: "register" });
    setLoading(false);

    if (!res.ok) {
      setServerError(res.error ?? "Xatolik yuz berdi.");
      return;
    }
    setDevCode(res.devCode);
    setCode("");
    setStage("verify");
  };

  /** Step 2 — verify the OTP, then create the account. */
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (code.length !== 6) {
      setServerError("6 xonali kodni to'liq kiriting.");
      return;
    }

    setLoading(true);
    const reg = await registerUser({
      name: name.trim(),
      method,
      contact: contact.trim(),
      code,
      password,
    });
    setLoading(false);

    if (!reg.ok) {
      setServerError(reg.error ?? "Xatolik yuz berdi.");
      return;
    }
    router.push(nextPath);
    router.refresh();
  };

  const resend = async () => {
    setServerError("");
    const res = await sendOtp({ channel: method, contact: contact.trim(), purpose: "register" });
    if (res.ok) setDevCode(res.devCode);
    else setServerError(res.error ?? "Kodni qayta yuborib bo'lmadi.");
  };

  if (stage === "verify") {
    return (
      <form className="space-y-4" onSubmit={handleVerify} noValidate>
        <button
          type="button"
          onClick={() => setStage("details")}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
        </button>

        <div>
          <h3 className="text-base font-semibold text-ink-900">
            Tasdiqlash kodi
          </h3>
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
          Tasdiqlash va davom etish
        </Button>

        <button
          type="button"
          onClick={resend}
          className="mx-auto flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Kodni qayta yuborish
        </button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleDetails} noValidate>
      {serverError && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
          {serverError}
        </p>
      )}
      <Input
        label="Ism"
        name="name"
        placeholder="Ismingizni kiriting"
        leadingIcon={<User className="h-4 w-4" />}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoComplete="name"
      />
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
        placeholder="Kamida 8 ta belgi"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
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
      <Input
        label="Parolni tasdiqlang"
        name="confirm"
        type={show ? "text" : "password"}
        placeholder="Parolni qayta kiriting"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        autoComplete="new-password"
      />

      <label className="flex items-start gap-2 text-xs text-ink-600">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
        />
        <span>
          Men{" "}
          <Link href="/terms" className="text-brand-600 hover:underline">
            foydalanish shartlari
          </Link>{" "}
          va{" "}
          <Link href="/privacy" className="text-brand-600 hover:underline">
            maxfiylik siyosati
          </Link>
          ga roziman.
        </span>
      </label>
      {errors.agreed && <p className="text-xs text-rose-600">{errors.agreed}</p>}

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Davom etish
      </Button>
    </form>
  );
}
