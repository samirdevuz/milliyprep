# MilliyPrep

Milliy Sertifikatga aqlli tayyorlanish platformasi. Sun'iy intellekt
asosida shaxsiy o'quv reja, minglab mashqlar va real imtihon formatidagi
testlar — bir joyda.

## Texnologiyalar

- **Next.js 16** (App Router) + React 19
- **TypeScript** strict
- **Tailwind CSS 3** (custom brand tokens)
- **lucide-react** (ikonlar)
- **clsx + tailwind-merge** (class utility)

## Boshlash

```bash
npm install
npm run dev
# http://localhost:3000
```

Build qilish:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Production sozlash uchun: [`docs/production-setup.md`](docs/production-setup.md).

## Loyiha tuzilmasi

```
src/
├─ app/
│  ├─ layout.tsx        # Root layout, Inter font, metadata
│  ├─ page.tsx          # Landing
│  └─ globals.css       # Tailwind + dizayn tokenlari
├─ components/
│  ├─ brand/
│  │  └─ logo.tsx       # MilliyPrep logo (gradient M)
│  ├─ layout/
│  │  ├─ nav.tsx        # Top navigation
│  │  └─ footer.tsx
│  └─ sections/
│     ├─ hero.tsx
│     ├─ dashboard-preview.tsx
│     ├─ features.tsx
│     ├─ how-it-works.tsx
│     ├─ testimonials.tsx
│     ├─ faq.tsx
│     └─ cta.tsx
└─ lib/
   └─ cn.ts             # clsx + tailwind-merge yordamchi
```

## Yo'l xaritasi

- [x] **1-sprint** — Landing page (Hero, Features, How it works, Testimonials, FAQ, CTA)
- [x] **2-sprint** — Auth oqimi (Email + telefon + Google + Telegram), form primitivlari
- [x] **3-sprint** — 6 qadamli onboarding (Tanishuv → CEFR maqsad → Ko'nikmalar → Sabablar → Vaqt → Profil)
- [~] **4-sprint** — Dashboard qobig'i (Bugungi reja, Statistika, Streak, Imtihonga countdown); real data wiring keyingi bosqichda
- [ ] **5-sprint** — Mashqlar va testlar oqimi (savol bank, javob baholash)
- [x] **6-sprint** — AI tutor chat UI/API (OpenAI-compatible provider, dashboard streaming chat, mock fallback)
- [ ] **7-sprint** — Backend (Postgres/Supabase, RLS), to'lov, production observability

## Brand

| Token        | Hex       | Qaerda |
|--------------|-----------|--------|
| brand-500    | `#5b6cf5` | Asosiy CTA |
| brand-700    | `#3f47bd` | Primary text aksenti |
| accent-500   | `#10b981` | Logo gradient + success |
| ink-900      | `#0f172a` | Asosiy matn |
| ink-100      | `#f1f5f9` | Soft surface |
