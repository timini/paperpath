import { journeySchema, type Journey } from "./schema";
import { graphProblems } from "./graph";
import { quizProblems } from "./quiz";
import { WIDGETS } from "../widgets/registry";

/** Every problem with a journey, as readable strings. Empty means it can be shown to learners. */
export function journeyProblems(j: Journey): string[] {
  const out: string[] = [];
  const parsed = journeySchema.safeParse(j);
  if (!parsed.success) {
    for (const i of parsed.error.issues) out.push(`schema: ${i.path.join(".")}: ${i.message}`);
    return out;
  }
  out.push(...graphProblems(j).map((p) => `graph: ${p}`));
  for (const n of j.nodes) {
    out.push(...quizProblems(n.quiz.questions).map((p) => `${n.id} quiz: ${p}`));
    if (n.interactive) {
      const w = WIDGETS[n.interactive.widget];
      if (!w) out.push(`${n.id}: unknown widget ${n.interactive.widget}`);
      else {
        const r = w.schema.safeParse(n.interactive.params);
        if (!r.success) out.push(`${n.id}: widget ${n.interactive.widget} params: ${r.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
      }
    }
    const words = n.lesson.reduce((s, l) => s + l.body.split(/\s+/).length, 0);
    if (n.kind === "concept" && words < 120) out.push(`${n.id}: lesson is only ${words} words`);
  }
  for (const r of j.readingPlan) {
    for (const c of r.conceptIds) if (!j.nodes.some((n) => n.id === c)) out.push(`reading plan refers to unknown node ${c}`);
  }
  return out;
}
