"use client";

import { useState } from "react";
import { Reveal } from "@/components/motion/reveal";
import { CheckCircle2, FileText, Mic, Sparkles } from "lucide-react";

const TABS = [
  { id: "writing", label: "Yozma", icon: FileText },
  { id: "speaking", label: "Og'zaki", icon: Mic },
] as const;

// Demo feedback for language-subject constructed responses.
const FEEDBACK = [
  { name: "Vazifa bajarilishi", pct: 78, note: "Aniq fikr, asosiy g'oya rivojlangan." },
  {
    name: "Bog'lamlilik",
    pct: 64,
    note: "Ikkinchi paragrafda \"Moreover\" so'zi uch marta takrorlangan.",
  },
  {
    name: "Lug'at boyligi",
    pct: 80,
    note: "Yuqori darajadagi leksika to'g'ri o'rinda ishlatilgan.",
  },
  {
    name: "Grammatika",
    pct: 75,
    note: "Murakkab tuzilmalar, kichik artikl xatolari.",
  },
];

export function AutoGrading() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("writing");

  return (
    <section className="relative overflow-hidden border-t border-ink-100 bg-ink-50/40 py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill">Milliy sertifikat · Til imtihonlari</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Yozma va og&apos;zaki ishlaringiz <span className="accent-word text-[1.1em]">soniyalarda</span> baholanadi
            </h2>
            <p className="mt-3 text-ink-600">
              Ingliz va boshqa til imtihonlari uchun. Har bir mezon foizda
              baholanadi, taxminiy natija chiqariladi, har bir xato uchun aniq
              tuzatish taklif etiladi.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-ink-100">
            <div className="flex border-b border-ink-100 bg-ink-50/60 p-2">
              {TABS.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTab(id)}
                    className={[
                      "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition",
                      active
                        ? "bg-white text-brand-700 shadow-soft"
                        : "text-ink-500 hover:text-ink-700",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-ink-100 bg-ink-50/40 p-5">
                {tab === "writing" ? (
                  <article className="space-y-3 text-sm text-ink-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Milliy sertifikat · Ingliz tili · Yozma topshiriq, 250 so&apos;z
                    </p>
                    <p>
                      In recent years, technology has fundamentally reshaped how
                      students learn. This shift is{" "}
                      <span className="rounded bg-accent-100 px-0.5 text-accent-800">
                        comprehensive
                      </span>{" "}
                      across many countries and has prompted heated debate.
                    </p>
                    <p>
                      <span className="rounded bg-amber-100 px-0.5 text-amber-800">
                        Moreover
                      </span>
                      , some argue that reliance on devices weakens memory and
                      concentration. Digital tools can also distract students
                      from focused study.
                    </p>
                    <p>
                      <span className="rounded bg-amber-100 px-0.5 text-amber-800">
                        Moreover
                      </span>
                      , on balance, I believe the benefits outweigh these
                      concerns, provided that schools teach digital discipline
                      alongside literacy.
                    </p>
                  </article>
                ) : (
                  <div className="space-y-3 text-sm text-ink-700">
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                      Milliy sertifikat · Og&apos;zaki · 2-qism
                    </p>
                    <div className="rounded-xl bg-white p-4 ring-1 ring-ink-100">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
                          <Mic className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <div className="flex items-end gap-0.5">
                            {[3, 6, 8, 5, 9, 7, 4, 6, 8, 5, 7, 9, 6, 4, 7].map(
                              (h, i) => (
                                <span
                                  key={i}
                                  style={{ height: `${h * 3}px` }}
                                  className="w-1 rounded-sm bg-brand-400"
                                />
                              )
                            )}
                          </div>
                          <p className="mt-1 text-xs text-ink-500">
                            01:42 · 4.2 MB
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="rounded-xl bg-white p-4 text-sm leading-relaxed ring-1 ring-ink-100">
                      “I would like to talk about my hometown, Tashkent.{" "}
                      <span className="rounded bg-amber-100 px-0.5 text-amber-800">
                        Em
                      </span>
                      , it is a very big city with{" "}
                      <span className="rounded bg-rose-100 px-0.5 text-rose-700">
                        much
                      </span>{" "}
                      green parks…”
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-brand-gradient p-5 text-white shadow-soft">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                    Taxminiy daraja
                  </p>
                  <p className="mt-2 text-5xl font-extrabold leading-none">B2</p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-white/85">
                    <Sparkles className="h-3.5 w-3.5" />
                    Tuzatishlar bilan C1 imkoni bor
                  </p>
                </div>
                <ul className="space-y-2.5">
                  {FEEDBACK.map((f) => (
                    <li
                      key={f.name}
                      className="rounded-xl bg-white p-3 ring-1 ring-ink-100"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-ink-500">
                          {f.name}
                        </span>
                        <span
                          className={[
                            "rounded-md px-2 py-0.5 text-xs font-bold",
                            f.pct >= 75
                              ? "bg-accent-100 text-accent-700"
                              : "bg-amber-100 text-amber-700",
                          ].join(" ")}
                        >
                          {f.pct}%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-600">{f.note}</p>
                    </li>
                  ))}
                </ul>
                <div className="rounded-xl bg-accent-50 p-3 text-xs text-accent-800 ring-1 ring-accent-100">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Keyingi haftaga qo&apos;shildi
                  </p>
                  <p className="mt-1 text-accent-700">
                    Bog&apos;lovchi so&apos;zlar mashqi + artikllar uchun mini
                    test (15 daqiqa)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
