"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Phone,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OtpInput } from "@/components/auth/otp-input";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { isEmail, isPhone } from "@/lib/validation";
import { resetPassword, sendOtp, verifyOtp } from "@/lib/auth-client";

type Stage = "request" | "verify" | "reset";

function Flow({ method }: { method: "email" | "phone" }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("request");

  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | undefined>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const contactLabel = method === "email" ? "Elektron pochta" : "Telefon raqami";
  const validContact = () =>
    method === "email" ? isEmail(contact) : isPhone(contact);

  // Stage 1: request a code (purpose "login" => account must exist)
  const handleRequest = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validContact()) {
      setError(
        method === "email"
          ? "To'g'ri elektron pochta kiriting."
          : "To'g'ri telefon raqamini kiriting."
      );
      return;
    }
    setLoading(true);
    const res = await sendOtp({ channel: method, contact: contact.trim(), purpose: "login" });
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Kodni yuborib bo'lmadi.");
      return;
    }
    setDevCode(res.devCode);
    setCode("");
    setStage("verify");
  };

  // Stage 2: verify the code
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("6 xonali kodni to'liq kiriting.");
      return;
    }
    setLoading(true);
    const v = await verifyOtp({ channel: method, contact: contact.trim(), code });
    setLoading(false);
    if (!v.ok) {
      setError(v.error ?? "Kod noto'g'ri.");
      return;
    }
    setStage("reset");
  };

  // Stage 3: set a new password
  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lsin.");
      return;
    }
    if (password !== confirm) {
      setError("Parollar mos emas.");
      return;
    }
    setLoading(true);
    const res = await resetPassword({
      channel: method,
      contact: contact.trim(),
      code,
      password,
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Parolni yangilab bo'lmadi.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  const resend = async () => {
    setError("");
    const res = await sendOtp({ channel: method, contact: contact.trim(), purpose: "login" });
    if (res.ok) setDevCode(res.devCode);
    else setError(res.error ?? "Kodni qayta yuborib bo'lmadi.");
  };

  if (stage === "verify") {
    return (
      <form className="space-y-4" onSubmit={handleVerify} noValidate>
        <button
          type="button"
          onClick={() => setStage("request")}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Orqaga
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
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        )}
        <OtpInput value={code} onChange={setCode} invalid={Boolean(error)} />
        <Button type="submit" loading={loading} size="lg" className="w-full">
          Tasdiqlash
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

  if (stage === "reset") {
    return (
      <form className="space-y-4" onSubmit={handleReset} noValidate>
        <div>
          <h3 className="text-base font-semibold text-ink-900">Yangi parol</h3>
          <p className="mt-1 text-sm text-ink-600">
            Hisobingiz uchun yangi parol o&apos;rnating.
          </p>
        </div>
        {error && (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
            {error}
          </p>
        )}
        <Input
          label="Yangi parol"
          name="new-password"
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
        <Input
          label="Parolni tasdiqlang"
          name="confirm-password"
          type={show ? "text" : "password"}
          placeholder="Parolni qayta kiriting"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} size="lg" className="w-full">
          Parolni yangilash va kirish
        </Button>
      </form>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleRequest} noValidate>
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100">
          {error}
        </p>
      )}
      <p className="text-sm text-ink-600">
        Hisobingizga bog&apos;langan{" "}
        {method === "email" ? "elektron pochtangizni" : "telefon raqamingizni"}{" "}
        kiriting — tasdiqlash kodini yuboramiz.
      </p>
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
        autoComplete={method === "email" ? "email" : "tel"}
      />
      <Button type="submit" loading={loading} size="lg" className="w-full">
        Kod yuborish
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  return (
    <AuthTabs
      tabs={[
        { id: "email", label: "Elektron pochta", content: <Flow method="email" /> },
        { id: "phone", label: "Telefon raqami", content: <Flow method="phone" /> },
      ]}
    />
  );
}
