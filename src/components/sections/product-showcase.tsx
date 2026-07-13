import { Reveal } from "@/components/motion/reveal";
import {
  CheckCircle2,
  ClipboardCheck,
  Layers,
  Repeat2,
  Timer,
  Waypoints,
} from "lucide-react";
import { IconChip } from "@/components/ui/icon-chip";

export function ProductShowcase() {
  return (
    <section
      id="kurslar"
      className="relative overflow-hidden border-y border-ink-100 bg-ink-50/50 py-20 lg:py-28"
    >
      <div className="container-page space-y-16 lg:space-y-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="pill">Aniqlik bilan natija</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Sizga kerakli ball uchun <span className="accent-word text-[1.1em]">maxsus</span> qurilgan
            </h2>
            <p className="mt-3 text-ink-600">
              Reja, mashq va savol banki — har biri sizning natijangiz uchun
              birgalikda ishlaydi.
            </p>
          </div>
        </Reveal>

        <ShowcaseRow
          eyebrow="Shaxsiy reja"
          title="Natijaga qarab tartiblanadigan o'quv reja"
          description="Maqsad ballingiz va haftalik vaqtingiz profilda saqlanadi. Mashq natijalari pastroq mavzularni tavsiya etilgan navbatda yuqoriga chiqaradi."
          bullets={[
            "Mavzular kesimida aniqlik ko'rsatkichi",
            "Haftalik bajarilgan mashqlar soni",
            "Zaifroq mavzular uchun tavsiya navbati",
          ]}
          visual={<PlanVisual />}
        />

        <ShowcaseRow
          flip
          eyebrow="Mock testlar"
          title="Fanlar aralashmasidan tuzilgan mock testlar"
          description="Savol bankidagi faol fan va mavzulardan test shakllanadi. Javoblar serverda tekshiriladi, natija tarixga yoziladi va har bir savol uchun izoh ko'rsatiladi."
          bullets={[
            "Vaqt hisoblagichi va test navigatsiyasi",
            "Avtomatik baholash, batafsil sharh",
            "Natija va javoblar tarixi",
          ]}
          visual={<MockVisual />}
        />

        <ShowcaseRow
          eyebrow="Savol banki"
          title="Mavzular bo'yicha tartiblangan savol banki"
          description="Savollar fan va mavzu bo'yicha guruhlanadi. Har bir urinishdan keyin mavzu aniqligi yangilanib, qaysi bo'limga qaytish kerakligi ko'rinadi."
          bullets={[
            "Fan va mavzu bo'yicha katalog",
            "Urinishlar soni va aniqlik foizi",
            "Admin orqali savol qo'shish va tahrirlash",
          ]}
          visual={<QuestionBankVisual />}
        />
      </div>
    </section>
  );
}

interface ShowcaseRowProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  visual: React.ReactNode;
  flip?: boolean;
}

function ShowcaseRow({
  eyebrow,
  title,
  description,
  bullets,
  visual,
  flip,
}: ShowcaseRowProps) {
  return (
    <div
      className={[
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        flip ? "lg:[&>*:first-child]:order-2" : "",
      ].join(" ")}
    >
      <Reveal from={flip ? "right" : "left"}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
            {eyebrow}
          </p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink-900 sm:text-3xl">
            {title}
          </h3>
          <p className="mt-3 max-w-lg text-ink-600">{description}</p>
          <ul className="mt-5 space-y-2 text-sm text-ink-700">
            {bullets.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal from={flip ? "left" : "right"} delay={120}>
        {visual}
      </Reveal>
    </div>
  );
}

/* -------- Visuals -------- */

function PlanVisual() {
  const days = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"];
  return (
    <div className="card relative p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Bu hafta · 5/7 bajarildi
        </p>
        <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-semibold text-accent-700">
          +1 daraja
        </span>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {days.map((d, i) => (
          <div
            key={d}
            className={[
              "flex flex-col items-center rounded-xl border py-2 text-xs",
              i < 5
                ? "border-accent-200 bg-accent-50 text-accent-700"
                : "border-ink-100 bg-white text-ink-400",
            ].join(" ")}
          >
            <span className="font-medium">{d}</span>
            <span className="mt-1 text-[10px]">{i < 5 ? "✓" : "—"}</span>
          </div>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {[
          {
            icon: Waypoints,
            label: "Razminka · Lug'at va grammatika",
            time: "10 min",
            tone: "brand" as const,
          },
          {
            icon: Repeat2,
            label: "Asosiy · Reading · matn tahlili",
            time: "25 min",
            tone: "violet" as const,
          },
          {
            icon: ClipboardCheck,
            label: "Mini-test · 12 savol",
            time: "15 min",
            tone: "accent" as const,
          },
        ].map(({ icon: Icon, label, time, tone }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-xl bg-ink-50 p-3"
          >
            <IconChip tone={tone} size="sm">
              <Icon strokeWidth={2.5} />
            </IconChip>
            <span className="flex-1 text-sm font-medium text-ink-800">
              {label}
            </span>
            <span className="text-xs font-semibold text-ink-500">{time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MockVisual() {
  return (
    <div className="card relative space-y-3 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
          Milliy Sertifikat Mock · Fanlar aralashmasi · 10 savol
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          <Timer className="h-3 w-3" />
          24:18
        </span>
      </div>
      <div className="rounded-xl border border-ink-100 p-4 text-sm text-ink-800">
        <p className="font-semibold">12-savol</p>
        <p className="mt-2">
          The word &quot;however&quot; in the passage usually signals what relationship?
        </p>
        <ul className="mt-3 space-y-1.5 text-sm">
          {["A) Cause", "B) Contrast", "C) Example", "D) Sequence"].map((opt, i) => (
            <li
              key={opt}
              className={[
                "flex items-center gap-2 rounded-lg border px-3 py-2",
                i === 1
                  ? "border-brand-300 bg-brand-50 font-semibold text-brand-700"
                  : "border-ink-100 hover:bg-ink-50",
              ].join(" ")}
            >
              {opt}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-accent-50 p-2 text-accent-700">
          <p className="text-base font-bold">26</p>
          <p>To&apos;g&apos;ri</p>
        </div>
        <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
          <p className="text-base font-bold">3</p>
          <p>Xato</p>
        </div>
        <div className="rounded-lg bg-ink-100 p-2 text-ink-700">
          <p className="text-base font-bold">1</p>
          <p>Tashlangan</p>
        </div>
      </div>
    </div>
  );
}

function QuestionBankVisual() {
  const items = [
    { topic: "Listening · asosiy fikr", missed: 8, total: 12, color: "bg-rose-500" },
    { topic: "Reading · dalil va detal", missed: 5, total: 14, color: "bg-amber-500" },
    { topic: "Writing · bog'lovchilar", missed: 3, total: 18, color: "bg-brand-500" },
    { topic: "Speaking · javob tuzish", missed: 1, total: 22, color: "bg-accent-500" },
  ];
  return (
    <div className="card p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">
        Sizning zaif mavzularingiz
      </p>
      <ul className="mt-4 space-y-3">
        {items.map((it) => {
          const acc = Math.round(((it.total - it.missed) / it.total) * 100);
          return (
            <li
              key={it.topic}
              className="rounded-xl bg-ink-50 p-3 ring-1 ring-ink-100"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-800">{it.topic}</span>
                <span className="font-mono text-xs text-ink-600">
                  {it.total - it.missed}/{it.total}
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-200">
                <span
                  className={`block h-full ${it.color}`}
                  style={{ width: `${acc}%` }}
                />
              </div>
              <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-500">
                <Layers className="h-3 w-3" />
                {it.missed} ta savolni takrorlash kerak
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
