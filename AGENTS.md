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
- `src/content/curriculum.ts` is the canonical subject/source catalog, while `src/content/math-mock.ts` owns the exact 45-position Matematika blueprint and local fallback bank.
- Matematika is the only live launch subject. The dashboard, practice, onboarding, landing preview, and SEO copy now use the same launch scope.
- The generic multilingual demo bank has been replaced by a 45-task Matematika blueprint: 32 Y-1, 3 Y-2 and 10 two-part open tasks. Twenty pilot tasks are published and twenty-five remain in expert review.
- The full mock runner uses 150 minutes and 100 raw points, and explicitly avoids presenting its practice score as the official Rasch-model certificate score.
- Admin questions follow a draft → review → published lifecycle. Migration `20260713144358_mock_exam_review_workflow.sql` seeds the blueprint and structured scoring fields.
- Registration visibly repeats the onboarding profile, and email, phone, Telegram, and Google registration preserve a server-validated profile.
- The plans page, Click/Payme checkout routes, and idempotent Pro subscription entitlement lifecycle exist.
- Practice submissions are scored from the active server question bank and protected by database integrity constraints.

Not Done Yet:

- The 25 review-state Matematika tasks still need independent subject-matter expert approval before the full mock opens to learners.
- Planned subjects must not be switched to `live` until their official blueprint, reviewed bank, dashboard mapping, and mock format are complete.
- Additional full mock variants still need original, independently reviewed question banks.
- Distributed rate limiting, observability, backup drills, full browser E2E coverage, and provider production approval remain roadmap items.
- Payment production keys and live callback certification still need to be supplied and verified.

## Browser Research Note

The requested `agent-browser` CLI was not available on PATH in this environment. The external onboarding page was inspected through network fetches of the rendered page and Next.js client chunks. The relevant IELTS Nation question categories were extracted from the bundled onboarding strings and adapted to Milliy Sertifikat.

## Editing Guidance

- Keep UI copy in Uzbek Latin unless a page already requires another language.
- Prefer existing components from `src/components/ui`.
- Keep changes scoped. Avoid broad visual rewrites unless the task is explicitly design-focused.
- Before finishing, run `npm run typecheck` and `npm run lint` when the change touches TypeScript or UI code.
