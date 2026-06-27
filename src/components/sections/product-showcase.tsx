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
          title="Har hafta o'zgaradigan o'quv reja"
          description="Imtihon sanasi va maqsadli ballingizni aytasiz, biz haftalik mashg'ulot jadvalini tuzamiz. Har bir mock natijangiz keyingi haftani avtomatik muvozanatlaydi: nimani yo'qotsangiz — ko'proq mashq, nimani egallasangiz — kamroq."
          bullets={[
            "Aniq mavzu va qiyinlik darajasi tahlili",
            "Har kuni qisqa, aniq mashqlar",
            "Ko'rsatkichlar haftalik hisobotda",
          ]}
          visual={<PlanVisual />}
        />

        <ShowcaseRow
          flip
          eyebrow="Mock testlar"
          title="Milliy Sertifikat formatidagi mock testlar"
          description="Real imtihon vaqti, CEFR ko'nikmalari va rasmiy formatga yaqin tuzilma. Test qismlari avtomatik baholanadi, har bir xato uchun esa qadam-baqadam tushuntirish beriladi."
          bullets={[
            "Vaqt cheklovi va imtihon kabi tuzilma",
            "Avtomatik baholash, batafsil sharh",
            "Har bir xato uchun aniq tuzatish taklifi",
          ]}
          visual={<MockVisual />}
        />

        <ShowcaseRow
          eyebrow="Savol banki"
          title="Eng ko'p adashgan savollaringiz birinchi turadi"
          description="Har bir noto'g'ri javob mavzu va savol turi bo'yicha teglanadi. Bank tasodifiy emas — sizning aniq zaif tomonlaringizni ustuvor qiladi."
          bullets={[
            "Mavzular bo'yicha tartiblangan minglab savol",
            "Sizning tarixingizga moslab tartib",
            "Filtrlash: qiyinlik, fan, mavzu",
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
          Milliy Sertifikat Mock · Ingliz tili · 30 savol
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          <Timer className="h-3 w-3" />
          24:18
        </span>
      </div>
      <div className="rounded-xl border border-ink-100 p-4 text-sm text-ink-800">
        <p className="font-semibold">34-savol</p>
        <p className="mt-2">
          Agar AB ⊥ BD va ∠DBC = 118° bo&apos;lsa, ∠ABC ni toping.
        </p>
        <AngleDiagram />
        <ul className="mt-3 space-y-1.5 text-sm">
          {["A) 162°", "B) 152°", "C) 157°", "D) 147°"].map((opt, i) => (
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

function AngleDiagram() {
  return (
    <svg
      viewBox="0 0 240 150"
      className="mx-auto mt-3 h-auto w-full max-w-[260px]"
      role="img"
      aria-label="Burchak masalasi chizmasi: AB perpendikulyar BD, DBC burchagi 118 daraja"
    >
      {/* Rays from B (120,80) */}
      <line x1="120" y1="80" x2="55" y2="30" stroke="#475569" strokeWidth="2" />
      <line x1="120" y1="80" x2="205" y2="40" stroke="#475569" strokeWidth="2" />
      <line x1="120" y1="80" x2="100" y2="140" stroke="#475569" strokeWidth="2" />
      {/* Right-angle marker between BA and BD */}
      <path
        d="M101 64 L113 55 L122 67"
        fill="none"
        stroke="#ec4899"
        strokeWidth="2"
      />
      {/* Angle arc for DBC */}
      <path
        d="M150 67 A 34 34 0 0 1 132 113"
        fill="rgba(16,185,129,0.18)"
        stroke="#10b981"
        strokeWidth="1.5"
      />
      {/* Labels */}
      <text x="44" y="26" className="fill-ink-700" fontSize="13" fontWeight="700">A</text>
      <text x="210" y="40" className="fill-ink-700" fontSize="13" fontWeight="700">D</text>
      <text x="92" y="148" className="fill-ink-700" fontSize="13" fontWeight="700">C</text>
      <text x="106" y="86" className="fill-ink-900" fontSize="12" fontWeight="700">B</text>
      <text x="150" y="100" className="fill-ink-500" fontSize="11">118°</text>
    </svg>
  );
}

function QuestionBankVisual() {
  const items = [
    { topic: "Trigonometriya · Sin/Cos", missed: 8, total: 12, color: "bg-rose-500" },
    { topic: "Algebra · Tenglamalar", missed: 5, total: 14, color: "bg-amber-500" },
    { topic: "Geometriya · Ko'pburchaklar", missed: 3, total: 18, color: "bg-brand-500" },
    { topic: "Arifmetika · Foiz", missed: 1, total: 22, color: "bg-accent-500" },
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
