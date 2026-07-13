-- Align practice identifiers with onboarding and harden scoring integrity.
-- Run after 002_practice_engine.sql.

-- The original seed used `mathematics`, while onboarding and the application
-- use `math`. Copy the subject first so foreign keys can be moved safely.
insert into public.subjects (
  id,
  name,
  description,
  color,
  exam_weight,
  position
)
select
  'math',
  name,
  description,
  color,
  exam_weight,
  position
from public.subjects
where id = 'mathematics'
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  color = excluded.color,
  exam_weight = excluded.exam_weight,
  position = excluded.position;

update public.topics
set subject_id = 'math'
where subject_id = 'mathematics';

update public.questions
set subject_id = 'math'
where subject_id = 'mathematics';

update public.practice_attempts
set subject_id = 'math'
where subject_id = 'mathematics';

delete from public.subjects
where id = 'mathematics';

-- A question may occur only once inside an attempt. This mirrors the API
-- validation and protects historical data from direct/internal writes.
create unique index if not exists practice_answers_attempt_question_unique
  on public.practice_attempt_answers (attempt_id, question_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'questions_correct_index_in_options'
  ) then
    alter table public.questions
      add constraint questions_correct_index_in_options
      check (correct_index < jsonb_array_length(options));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'practice_attempts_correct_within_total'
  ) then
    alter table public.practice_attempts
      add constraint practice_attempts_correct_within_total
      check (correct_count <= total);
  end if;
end
$$;
