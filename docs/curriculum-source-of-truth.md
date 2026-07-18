# MilliyPrep curriculum source of truth

`src/content/curriculum.ts` is the canonical product catalog for subjects,
official references, topic blueprints and availability. The exact 45-position
Matematika mock blueprint and its local fallback items live in
`src/content/math-mock.ts`.

## Runtime rules

- Only subjects with `availability: "live"` may appear as selectable or in the
  practice catalog.
- A topic must reference a published subject and an official curriculum source.
- A question must reference a real topic, match its blueprint position, include
  scoring metadata and have `reviewStatus: "published"` before learners can see
  it.
- New and edited questions start as `draft`, move to `review`, and become learner
  visible only after an admin expert explicitly sets them to `published`.
- Official samples are alignment references. MilliyPrep questions are original;
  official questions must not be copied into the product without explicit
  permission and provenance.
- `supabase/migrations/007_curriculum_source_of_truth.sql` archives the old demo
  catalog. `20260713144358_mock_exam_review_workflow.sql` upgrades the database
  to curriculum version `2026.07.2`, seeds the full blueprint and adds expert
  review plus structured-answer scoring.

## Current launch scope

- Live: Matematika.
- Blueprint: 7 official content sections, 45 tasks and 150 minutes.
- Item types: 32 single-choice Y-1, 3 matching Y-2 and 10 two-part short-answer
  O tasks.
- Raw mock scoring totals 100 points. It is a practice score and is not presented
  as the official certificate score, which is calculated with the Rasch model.
- Review state: 20 original tasks published for the pilot, 25 queued for an
  external mathematics expert.
- Planned: the remaining general and language subjects.

## Primary references

- [UZBMB Matematika spetsifikatsiyasi](https://www.uzbmb.uz/upload/file/pdf/mtt/spetsifikatsiya/Matematika_2024.pdf)
- [UZBMB Matematika namunaviy topshiriqlari](https://www.uzbmb.uz/upload/file/pdf/milliytest/matem.pdf)

## Publishing checklist

1. Confirm the skill and item format against the current official specification.
2. Write an original question and a concise worked explanation.
3. Verify the correct option independently and check that distractors are valid.
4. Review Uzbek spelling, mathematical notation and mobile readability.
5. Save as draft and send to review with a concrete expert note when needed.
6. Publish only after independent answer, notation, spelling and distractor
   checks pass.
7. Run `npm test` and verify practice, full mock and admin review in a real
   browser.

The full runner and publishing workflow are structurally ready. The remaining 25
items deliberately stay out of the learner-facing bank until external expert
approval.
