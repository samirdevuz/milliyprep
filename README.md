# MilliyPrep

Milliy Sertifikatga tayyorlanish platformasi. Shaxsiy profil, mavzuli
Matematika Milliy Sertifikati uchun spetsifikatsiyaga mos original mashqlar,
pilot sinovlar, progress tahlili va AI ustoz — bir joyda. Qolgan fanlar ekspert
tekshiruvidan keyin bosqichma-bosqich qo'shiladi.

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
npm test
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

- [x] Landing, onboarding, auth va dashboard oqimlari
- [x] 45-topshiriqli, 150-daqiqalik mock runner va 100 xom ballik hisob
- [x] Qoralama → ekspert tekshiruvi → nashr savol lifecycle’i
- [x] AI tutor UI/API va onboarding konteksti
- [x] Click/Payme orderlari va Pro entitlement lifecycle
- [ ] Review navbatidagi 25 ta Matematika topshirig‘ini tashqi ekspert tasdiqlashi
- [ ] E2E testlar, distributed rate limit va observability
- [ ] Production provider tasdiqlari, backup drill va launch QA

Batafsil reja: [`docs/production-roadmap.md`](docs/production-roadmap.md).
Operatsion runbook: [`docs/operations-runbook.md`](docs/operations-runbook.md).

## Brand

| Token        | Hex       | Qaerda |
|--------------|-----------|--------|
| brand-500    | `#5b6cf5` | Asosiy CTA |
| brand-700    | `#3f47bd` | Primary text aksenti |
| accent-500   | `#10b981` | Logo gradient + success |
| ink-900      | `#0f172a` | Asosiy matn |
| ink-100      | `#f1f5f9` | Soft surface |
