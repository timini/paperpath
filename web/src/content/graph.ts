import type { Journey, JourneyNode, JourneyProgress, NodeState } from "./schema";

/** Prerequisites of each node: edges point from prerequisite to dependant. */
export function prerequisites(journey: Journey): Map<string, string[]> {
  const pre = new Map<string, string[]>(journey.nodes.map((n) => [n.id, []]));
  for (const e of journey.edges) pre.get(e.to)?.push(e.from);
  return pre;
}

/** Depth of each node: 0 for nodes without prerequisites, else 1 + deepest prerequisite. */
export function depths(journey: Journey): Map<string, number> {
  const pre = prerequisites(journey);
  const memo = new Map<string, number>();
  const visit = (id: string): number => {
    const known = memo.get(id);
    if (known !== undefined) return known;
    const ps = pre.get(id) ?? [];
    const d = ps.length ? 1 + Math.max(...ps.map(visit)) : 0;
    memo.set(id, d);
    return d;
  };
  journey.nodes.forEach((n) => visit(n.id));
  return memo;
}

/** Nodes grouped by depth, shallowest first, in the journey's authored order within a level. */
export function levels(journey: Journey): JourneyNode[][] {
  const d = depths(journey);
  const out: JourneyNode[][] = [];
  for (const n of journey.nodes) (out[d.get(n.id)!] ??= []).push(n);
  return out.filter(Boolean);
}

/** Structural problems with a journey graph. An empty list means the graph is usable. */
export function graphProblems(journey: Journey): string[] {
  const problems: string[] = [];
  const ids = new Set(journey.nodes.map((n) => n.id));
  if (ids.size !== journey.nodes.length) problems.push("duplicate node ids");
  if (!ids.has(journey.paperNodeId)) problems.push(`paper node ${journey.paperNodeId} is missing`);
  for (const e of journey.edges) {
    if (!ids.has(e.from)) problems.push(`edge from unknown node ${e.from}`);
    if (!ids.has(e.to)) problems.push(`edge to unknown node ${e.to}`);
    if (e.from === e.to) problems.push(`self edge on ${e.from}`);
  }
  if (problems.length) return problems;

  // Cycle check (depth-first, three colours).
  const pre = prerequisites(journey);
  const colour = new Map<string, 0 | 1 | 2>();
  const cyclic = (id: string): boolean => {
    if (colour.get(id) === 1) return true;
    if (colour.get(id) === 2) return false;
    colour.set(id, 1);
    const hit = (pre.get(id) ?? []).some(cyclic);
    colour.set(id, 2);
    return hit;
  };
  if (journey.nodes.some((n) => cyclic(n.id))) problems.push("graph has a cycle");

  // Every node must lead to the paper node.
  const dependants = new Map<string, string[]>(journey.nodes.map((n) => [n.id, []]));
  for (const e of journey.edges) dependants.get(e.from)!.push(e.to);
  const reachesPaper = (id: string, seen = new Set<string>()): boolean => {
    if (id === journey.paperNodeId) return true;
    if (seen.has(id)) return false;
    seen.add(id);
    return dependants.get(id)!.some((d) => reachesPaper(d, seen));
  };
  for (const n of journey.nodes) {
    if (!reachesPaper(n.id)) problems.push(`node ${n.id} does not lead to the paper`);
  }
  const paper = journey.nodes.find((n) => n.id === journey.paperNodeId)!;
  if (paper.kind !== "paper") problems.push("paper node must have kind 'paper'");
  if (journey.nodes.filter((n) => n.kind === "paper").length !== 1) problems.push("exactly one paper node is required");
  return problems;
}

const DONE: NodeState[] = ["mastered", "tested-out"];

export function isDone(state: NodeState): boolean {
  return DONE.includes(state);
}

/** Current state of every node for a learner, applying the unlock rule in SPEC 5.3. */
export function nodeStates(journey: Journey, progress: JourneyProgress | undefined): Map<string, NodeState> {
  const pre = prerequisites(journey);
  const states = new Map<string, NodeState>();
  for (const n of journey.nodes) {
    const saved = progress?.nodes[n.id]?.state;
    if (saved && DONE.includes(saved)) {
      states.set(n.id, saved);
      continue;
    }
    const unlocked = (pre.get(n.id) ?? []).every((p) => {
      const s = progress?.nodes[p]?.state;
      return s !== undefined && DONE.includes(s);
    });
    states.set(n.id, !unlocked ? "locked" : saved === "in-progress" ? "in-progress" : "available");
  }
  return states;
}

/** The node offered free to anyone, so they can judge a journey before choosing it. */
export function previewNodeId(journey: Journey): string {
  const d = depths(journey);
  return journey.nodes.find((n) => d.get(n.id) === 0)!.id;
}

export function completion(journey: Journey, progress: JourneyProgress | undefined): number {
  const states = nodeStates(journey, progress);
  const done = journey.nodes.filter((n) => isDone(states.get(n.id)!)).length;
  return done / journey.nodes.length;
}

/**
 * A single recommended order through the graph: every node comes after its prerequisites, and
 * among nodes that are ready at the same time the authored order wins. Learners see this as
 * numbered steps.
 */
export function recommendedOrder(journey: Journey): JourneyNode[] {
  const pre = prerequisites(journey);
  const done = new Set<string>();
  const out: JourneyNode[] = [];
  while (out.length < journey.nodes.length) {
    const next = journey.nodes.find((n) => !done.has(n.id) && (pre.get(n.id) ?? []).every((p) => done.has(p)));
    if (!next) break; // cycle; graphProblems reports it
    done.add(next.id);
    out.push(next);
  }
  return out;
}
