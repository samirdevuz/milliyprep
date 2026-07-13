# MilliyPrep Agent Notes

## Project Context

MilliyPrep is a Next.js 16 App Router application for Milliy Sertifikat preparation. The product scope is now focused on Milliy Sertifikat only: subject selection, 100-point scoring, mock practice, dashboard progress, and an AI tutor.

Do not reintroduce DTM flows, labels, metadata, or onboarding options.

## Common Commands

- `npm run dev` - start the local app on port 3000.
- `npm run typecheck` - run TypeScript checks.
- `npm run lint` - run ESLint.
- `npm run build` - production build.
- `npm test` - typecheck, lint, unit tests, and bot syntax checks.

## Current Implementation Status

Done:

- Landing, auth screens, dashboard shell, practice engine, AI chat UI/API, and onboarding exist.
- Onboarding has been rebuilt into an IELTS Nation-style, mascot-free Milliy Sertifikat flow:
  - name-only first step, then the learner's name is reused in later questions;
  - Milliy Sertifikat subject selection across language and general subjects;
  - current score status: has score, has not taken yet, or unknown;
  - target score on a 0-100 scale with grade-zone hints;
  - weekly study time and study days;
  - certificate purpose, trust/explanation screen, profile summary, referral source, reveal screen, and expectation timeline.
- Visible DTM references and old DTM onboarding keys have been removed from `src/`, `README.md`, and `docs/`.
- AI tutor context now uses Milliy Sertifikat fields such as `subjectId`, `subjectLabel`, `currentScore`, `targetScore`, and `resultStatus`.
- Registration visibly repeats the onboarding profile, and email, phone, Telegram, and Google registration preserve a server-validated profile.
- The plans page, Click/Payme checkout routes, and idempotent Pro subscription entitlement lifecycle exist.
- Practice submissions are scored from the active server question bank and protected by database integrity constraints.

Not Done Yet:

- Practice question content still uses the existing generic subject/topic catalog. It should be replaced or seeded with real Milliy Sertifikat language-skill content.
- Dashboard widgets still rely on generic progress metrics and subject terminology in some internal component APIs. User-facing DTM text is removed, but deeper data modeling should be renamed when the practice catalog is rebuilt.
- Production-grade Milliy Sertifikat question content still needs subject-matter review and expansion.
- Distributed rate limiting, observability, backup drills, full browser E2E coverage, and provider production approval remain roadmap items.
- Payment production keys and live callback certification still need to be supplied and verified.

## Browser Research Note

The requested `agent-browser` CLI was not available on PATH in this environment. The external onboarding page was inspected through network fetches of the rendered page and Next.js client chunks. The relevant IELTS Nation question categories were extracted from the bundled onboarding strings and adapted to Milliy Sertifikat.

## Editing Guidance

- Keep UI copy in Uzbek Latin unless a page already requires another language.
- Prefer existing components from `src/components/ui`.
- Keep changes scoped. Avoid broad visual rewrites unless the task is explicitly design-focused.
- Before finishing, run `npm run typecheck` and `npm run lint` when the change touches TypeScript or UI code.
