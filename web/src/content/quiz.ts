import type { Question } from "./schema";

export type Answer = string | string[] | number | null;

export function isCorrect(q: Question, a: Answer): boolean {
  switch (q.type) {
    case "single":
      return typeof a === "string" && q.options.some((o) => o.id === a && o.correct);
    case "multi": {
      if (!Array.isArray(a)) return false;
      const want = q.options.filter((o) => o.correct).map((o) => o.id).sort();
      return JSON.stringify([...a].sort()) === JSON.stringify(want);
    }
    case "numeric":
      return typeof a === "number" && Number.isFinite(a) && Math.abs(a - q.answer) <= q.tolerance;
    case "order":
      return Array.isArray(a) && JSON.stringify(a) === JSON.stringify(q.correctOrder);
  }
}

export function score(questions: Question[], answers: Record<string, Answer>): number {
  if (!questions.length) return 0;
  return questions.filter((q) => isCorrect(q, answers[q.id] ?? null)).length / questions.length;
}

/** Deterministic shuffle so a retry reorders questions and options without randomness in tests. */
export function shuffled<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed || 1;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Content rules for quizzes beyond the schema (SPEC 5.3). */
export function quizProblems(questions: Question[]): string[] {
  const problems: string[] = [];
  if (!questions.some((q) => q.tag !== "recall")) {
    problems.push("needs at least one application or paper-link question");
  }
  for (const q of questions) {
    if (q.type === "single" && q.options.filter((o) => o.correct).length !== 1) {
      problems.push(`${q.id}: single-choice needs exactly one correct option`);
    }
    if (q.type === "multi" && q.options.filter((o) => o.correct).length < 1) {
      problems.push(`${q.id}: multi-select needs a correct option`);
    }
    if (q.type === "order") {
      const ids = q.items.map((i) => i.id).sort().join();
      if (ids !== [...q.correctOrder].sort().join()) problems.push(`${q.id}: correctOrder must use every item once`);
    }
    if ((q.type === "single" || q.type === "multi") && new Set(q.options.map((o) => o.id)).size !== q.options.length) {
      problems.push(`${q.id}: duplicate option ids`);
    }
  }
  if (new Set(questions.map((q) => q.id)).size !== questions.length) problems.push("duplicate question ids");
  return problems;
}
