import { JOURNEYS } from "../src/content/journeys";
import { journeyProblems } from "../src/content/validate";

let failed = 0;
for (const j of JOURNEYS) {
  const problems = journeyProblems(j);
  const nodes = j.nodes.length;
  const qs = j.nodes.reduce((s, n) => s + n.quiz.questions.length, 0);
  if (problems.length) {
    failed++;
    console.error(`✗ ${j.id}`);
    for (const p of problems) console.error(`    ${p}`);
  } else console.log(`✓ ${j.id}: ${nodes} nodes, ${qs} questions`);
}
if (new Set(JOURNEYS.map((j) => j.id)).size !== JOURNEYS.length) {
  console.error("duplicate journey ids");
  failed++;
}
process.exit(failed ? 1 : 0);
