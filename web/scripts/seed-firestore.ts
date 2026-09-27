// Mirror the validated journeys into Firestore (docs/SPEC.md section 8).
//
// Clients can't write journey content (see firestore.rules), so this runs with a project
// owner's OAuth access token, which Firestore authorises through IAM rather than rules:
//
//   FIRESTORE_TOKEN=$(gcloud auth print-access-token) npx tsx scripts/seed-firestore.ts
//
// Journeys become journeys/{id}; nodes become journeys/{id}/nodes/{nodeId}.
import { JOURNEYS } from "../src/content/journeys";
import { journeyProblems } from "../src/content/validate";

const PROJECT = process.env.FIREBASE_PROJECT ?? "paperpath-learn";
const TOKEN = process.env.FIRESTORE_TOKEN;
if (!TOKEN) {
  console.error("Set FIRESTORE_TOKEN to an OAuth access token for a project owner.");
  process.exit(1);
}

type Value = Record<string, unknown>;
function toValue(v: unknown): Value {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  return { mapValue: { fields: toFields(v as Record<string, unknown>) } };
}
function toFields(o: Record<string, unknown>): Record<string, Value> {
  return Object.fromEntries(Object.entries(o).filter(([, x]) => x !== undefined).map(([k, x]) => [k, toValue(x)]));
}

const root = `projects/${PROJECT}/databases/(default)/documents`;
const writes: unknown[] = [];
for (const j of JOURNEYS) {
  const problems = journeyProblems(j);
  if (problems.length) throw new Error(`${j.id} is invalid: ${problems.join("; ")}`);
  const { nodes, ...meta } = j;
  writes.push({
    update: { name: `${root}/journeys/${j.id}`, fields: toFields({ ...meta, nodeIds: nodes.map((n) => n.id), status: "published", seededAt: new Date().toISOString() }) },
  });
  nodes.forEach((n, order) => {
    // Firestore can't store arrays inside arrays (payoff matrices, coordinates), so widget
    // parameters are kept as a JSON string.
    const interactive = n.interactive && { widget: n.interactive.widget, caption: n.interactive.caption, altText: n.interactive.altText, paramsJson: JSON.stringify(n.interactive.params) };
    writes.push({ update: { name: `${root}/journeys/${j.id}/nodes/${n.id}`, fields: toFields({ ...n, interactive, order }) } });
  });
}

const res = await fetch(`https://firestore.googleapis.com/v1/${root}:commit`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "x-goog-user-project": PROJECT },
  body: JSON.stringify({ writes }),
});
if (!res.ok) {
  console.error(`Seed failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log(`Seeded ${JOURNEYS.length} journeys and ${writes.length - JOURNEYS.length} nodes into ${PROJECT}.`);
