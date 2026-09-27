import { journeySchema, type Journey } from "./schema";
import { graphProblems } from "./graph";
import { quizProblems } from "./quiz";
import { WIDGETS } from "../widgets/registry";

/** Diagram steps and arrows must refer to shapes that exist. */
function diagramProblems(params: unknown): string[] {
  const d = params as { elements: { id: string; type: string; from?: unknown; to?: unknown }[]; steps: { show?: string[]; highlight?: string[]; hide?: string[]; move?: Record<string, unknown> }[] };
  const ids = new Set(d.elements.map((e) => e.id));
  const out: string[] = [];
  if (ids.size !== d.elements.length) out.push("duplicate element ids");
  for (const e of d.elements) {
    for (const end of [e.from, e.to]) if (typeof end === "string" && !ids.has(end)) out.push(`arrow ${e.id} points at unknown ${end}`);
  }
  d.steps.forEach((st, i) => {
    for (const id of [...(st.show ?? []), ...(st.highlight ?? []), ...(st.hide ?? []), ...Object.keys(st.move ?? {})]) {
      if (!ids.has(id)) out.push(`step ${i + 1} refers to unknown ${id}`);
    }
  });
  return out;
}

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
    // Every step needs something to look at (paper nodes get a generated argument map).
    if (n.kind === "concept" && !n.interactive && !n.lesson.some((l) => l.visual)) out.push(`${n.id}: no visual or interactive`);
    for (const [i, l] of n.lesson.entries()) {
      if (!l.visual) continue;
      const w = WIDGETS[l.visual.widget];
      const r = w?.schema.safeParse(l.visual.params);
      if (!w) out.push(`${n.id} lesson ${i}: unknown widget ${l.visual.widget}`);
      else if (!r!.success) out.push(`${n.id} lesson ${i}: ${l.visual.widget} params: ${r!.error.issues.map((x) => `${x.path.join(".")} ${x.message}`).join("; ")}`);
      else if (l.visual.widget === "diagram") out.push(...diagramProblems(l.visual.params).map((x) => `${n.id} lesson ${i} diagram: ${x}`));
    }
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
    if (n.kind === "concept" && words < 100) out.push(`${n.id}: lesson is only ${words} words`);
  }
  for (const r of j.readingPlan) {
    for (const c of r.conceptIds) if (!j.nodes.some((n) => n.id === c)) out.push(`reading plan refers to unknown node ${c}`);
  }
  return out;
}
