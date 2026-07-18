import assert from "node:assert/strict";
import test from "node:test";
import {
  CURRICULUM_QUESTIONS,
  CURRICULUM_SOURCES,
  CURRICULUM_SUBJECTS,
  CURRICULUM_TOPICS,
  LIVE_CURRICULUM_SUBJECTS,
} from "../src/content/curriculum.ts";
import {
  MATH_MOCK_BLUEPRINT,
  MATH_MOCK_DURATION_MINUTES,
  MATH_MOCK_MAX_POINTS,
  MATH_MOCK_QUESTION_COUNT,
} from "../src/content/math-mock.ts";

test("only launch-ready subjects are exposed as live", () => {
  assert.deepEqual(
    LIVE_CURRICULUM_SUBJECTS.map((subject) => subject.id),
    ["math"]
  );
  assert.equal(
    CURRICULUM_SUBJECTS.find((subject) => subject.id === "english")
      ?.availability,
    "planned"
  );
});

test("math mock follows the official 45-question and 150-minute blueprint", () => {
  assert.equal(MATH_MOCK_DURATION_MINUTES, 150);
  assert.equal(MATH_MOCK_QUESTION_COUNT, 45);
  assert.equal(CURRICULUM_QUESTIONS.length, 45);
  assert.equal(
    CURRICULUM_QUESTIONS.filter(
      (question) => question.type === "single_choice"
    ).length,
    32
  );
  assert.equal(
    CURRICULUM_QUESTIONS.filter((question) => question.type === "matching")
      .length,
    3
  );
  assert.equal(
    CURRICULUM_QUESTIONS.filter(
      (question) => question.type === "short_answer"
    ).length,
    10
  );
  assert.equal(
    Number(
      CURRICULUM_QUESTIONS.reduce(
        (sum, question) => sum + question.points,
        0
      ).toFixed(1)
    ),
    MATH_MOCK_MAX_POINTS
  );
  assert.deepEqual(
    CURRICULUM_QUESTIONS.map((question) => question.position),
    Array.from({ length: 45 }, (_, index) => index + 1)
  );
});

test("curriculum topics and questions remain internally consistent", () => {
  const topicIds = new Set(CURRICULUM_TOPICS.map((topic) => topic.id));
  const sourceIds = new Set(CURRICULUM_SOURCES.map((source) => source.id));

  assert.equal(CURRICULUM_TOPICS.length, 7);
  assert.equal(MATH_MOCK_BLUEPRINT.length, 7);
  assert.equal(
    CURRICULUM_TOPICS.reduce((sum, topic) => sum + topic.examShare, 0),
    100
  );

  for (const topic of CURRICULUM_TOPICS) {
    assert.equal(topic.subjectId, "math");
    assert.ok(sourceIds.has(topic.sourceId));
    assert.ok(
      CURRICULUM_QUESTIONS.some((question) => question.topicId === topic.id)
    );
  }

  for (const question of CURRICULUM_QUESTIONS) {
    assert.ok(topicIds.has(question.topicId));
    assert.ok(question.sourceId && sourceIds.has(question.sourceId));
    assert.ok(
      question.reviewStatus === "published" ||
        question.reviewStatus === "review"
    );
    assert.equal(question.origin, "original");
    assert.ok(question.explanation.trim().length > 10);

    if (question.type === "short_answer") {
      assert.equal(question.parts?.length, 2);
      assert.equal(
        Number(
          (question.parts ?? [])
            .reduce((sum, part) => sum + part.points, 0)
            .toFixed(1)
        ),
        question.points
      );
    } else {
      assert.ok(question.correctIndex >= 0);
      assert.ok(question.correctIndex < question.options.length);
    }
  }
});

test("only externally reviewable questions stay outside the public bank", () => {
  assert.equal(
    CURRICULUM_QUESTIONS.filter(
      (question) => question.reviewStatus === "published"
    ).length,
    20
  );
  assert.equal(
    CURRICULUM_QUESTIONS.filter(
      (question) => question.reviewStatus === "review"
    ).length,
    25
  );
});

test("curriculum identifiers are unique", () => {
  const ids = [
    ...CURRICULUM_SUBJECTS.map((item) => `subject:${item.id}`),
    ...CURRICULUM_TOPICS.map((item) => `topic:${item.id}`),
    ...CURRICULUM_QUESTIONS.map((item) => `question:${item.id}`),
    ...CURRICULUM_SOURCES.map((item) => `source:${item.id}`),
  ];

  assert.equal(new Set(ids).size, ids.length);
});
