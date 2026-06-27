"use client";

import { Calendar, CheckCircle2, MapPin, ShieldCheck, Sparkles, User } from "lucide-react";
import { useOnboarding } from "@/lib/onboarding/store";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { REGIONS } from "@/lib/onboarding/types";
import { OptionCard } from "@/components/ui/option-card";

interface Props {
  errors: Partial<Record<string, string>>;
}

export function StepBasics({ errors }: Props) {
  const { state, set } = useOnboarding();

  return (
    <div className="space-y-5">
      <header>
        <h2 className="text-2xl font-bold text-ink-900">
          Avvalo tanishib olaylik
        </h2>
        <p className="mt-1 text-sm text-ink-600">
          Shaxsiy Milliy Sertifikat rejangizni tuzish uchun asosiy
          ma&apos;lumotlarni kiriting.
        </p>
      </header>

      <Input
        label="Ism va familiyangiz"
        name="fullName"
        placeholder="Masalan, Jasurbek Ergashev"
        leadingIcon={<User className="h-4 w-4" />}
        value={state.fullName ?? ""}
        onChange={(e) => set("fullName", e.target.value)}
        error={errors.fullName}
        autoComplete="name"
      />

      <Input
        label="Yoshingiz"
        name="age"
        type="number"
        min={10}
        max={60}
        placeholder="Masalan, 18"
        leadingIcon={<Calendar className="h-4 w-4" />}
        value={state.age ?? ""}
        onChange={(e) =>
          set("age", e.target.value ? Number(e.target.value) : undefined)
        }
        error={errors.age}
      />

      <Select
        label="Hududingiz"
        name="region"
        placeholder="Viloyatni tanlang"
        leadingIcon={<MapPin className="h-4 w-4" />}
        options={REGIONS}
        value={state.region ?? ""}
        onChange={(e) => set("region", e.target.value)}
        error={errors.region}
      />

      <div>
        <p className="mb-2 text-sm font-medium text-ink-800">
          Avval Milliy Sertifikat topshirganmisiz?
        </p>
        <div className="grid gap-2">
          <OptionCard
            selected={state.hasTakenCertificate === "yes"}
            onSelect={() => set("hasTakenCertificate", "yes")}
            icon={<CheckCircle2 strokeWidth={2.25} />}
            tone="brand"
            title="Ha, natijam bor"
            description="Hozirgi CEFR darajamni bilaman."
          />
          <OptionCard
            selected={state.hasTakenCertificate === "studying"}
            onSelect={() => set("hasTakenCertificate", "studying")}
            icon={<Sparkles strokeWidth={2.25} />}
            tone="accent"
            title="Yo'q, lekin tayyorlanyapman"
            description="Imtihonga tayyorgarlik jarayonidaman."
          />
          <OptionCard
            selected={state.hasTakenCertificate === "no"}
            onSelect={() => set("hasTakenCertificate", "no")}
            icon={<ShieldCheck strokeWidth={2.25} />}
            tone="violet"
            title="Hali topshirmaganman"
            description="Noldan aniq yo'l xaritasi kerak."
          />
        </div>
        {errors.hasTakenCertificate && (
          <p className="mt-2 text-xs text-rose-600">
            {errors.hasTakenCertificate}
          </p>
        )}
      </div>

      <p className="flex items-start gap-2 rounded-xl bg-brand-50/60 p-3 text-xs text-brand-700">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Ma&apos;lumotlaringiz xavfsizligini ta&apos;minlaymiz.
      </p>
    </div>
  );
}
