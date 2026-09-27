import { describe, expect, it } from "vitest";
import { JOURNEYS, getJourney } from "../content/journeys";
import { journeyProblems } from "../content/validate";
import { graphProblems, nodeStates, previewNodeId, completion } from "../content/graph";
import { isCorrect, score, shuffled } from "../content/quiz";
import type { Journey, Question } from "../content/schema";
import { entropyBits } from "../widgets/information";
import { modPow } from "../widgets/crypto";
import { pureEquilibria } from "../widgets/games";
import { softmax } from "../widgets/ml";

/** Find a question by journey, node and question id. */
function q(journeyId: string, nodeId: string, qid: string): Question {
  const node = getJourney(journeyId)!.nodes.find((n) => n.id === nodeId)!;
  return node.quiz.questions.find((x) => x.id === qid)!;
}
function numericAnswer(journeyId: string, nodeId: string, qid: string): number {
  const x = q(journeyId, nodeId, qid);
  if (x.type !== "numeric") throw new Error(`${qid} is not numeric`);
  return x.answer;
}

/** Minimal Turing machine runner with the same semantics as the widget. */
function runTM(tape: string, rules: { state: string; read: string; write: string; move: string; next: string }[], start: string, halt: string[], maxSteps: number, blank = "_") {
  let t = tape.split("");
  let head = 0;
  let state = start;
  for (let i = 0; i < maxSteps && !halt.includes(state); i++) {
    if (head < 0) { t.unshift(blank); head = 0; }
    if (head >= t.length) t.push(blank);
    const r = rules.find((x) => x.state === state && x.read === t[head]);
    if (!r) break;
    t[head] = r.write;
    head += r.move === "L" ? -1 : r.move === "R" ? 1 : 0;
    state = r.next;
  }
  if (head < 0) t = [blank, ...t];
  return t.join("").replace(/_/g, "");
}
function tmParams(journeyId: string, nodeId: string) {
  return getJourney(journeyId)!.nodes.find((n) => n.id === nodeId)!.interactive!.params as never as {
    rules: { state: string; read: string; write: string; move: string; next: string }[]; start: string; halt: string[];
  };
}

describe("launch content", () => {
  it("has ten valid journeys with no content problems", () => {
    expect(JOURNEYS).toHaveLength(10);
    for (const j of JOURNEYS) expect(journeyProblems(j), j.id).toEqual([]);
  });
  it("offers a free preview node with no prerequisites in every journey", () => {
    for (const j of JOURNEYS) {
      const states = nodeStates(j, undefined);
      expect(states.get(previewNodeId(j)), j.id).toBe("available");
    }
  });
});

describe("graph rules", () => {
  const tiny: Journey = {
    ...JOURNEYS[0],
    nodes: JOURNEYS[0].nodes.slice(0, 3).map((n, i) => ({ ...n, id: ["a", "b", "p"][i], kind: i === 2 ? "paper" : "concept" })),
    edges: [{ from: "a", to: "b" }, { from: "b", to: "p" }],
    paperNodeId: "p",
  };
  it("detects cycles and dangling edges", () => {
    expect(graphProblems({ ...tiny, edges: [...tiny.edges, { from: "p", to: "a" }] })).toContain("graph has a cycle");
    expect(graphProblems({ ...tiny, edges: [{ from: "a", to: "zzz" }] }).join()).toMatch(/unknown node zzz/);
  });
  it("unlocks a node only when all prerequisites are done", () => {
    const now = Date.now();
    expect(nodeStates(tiny, undefined).get("b")).toBe("locked");
    const p = { startedAt: now, updatedAt: now, nodes: { a: { state: "mastered" as const, bestScore: 1, attempts: 1 } } };
    expect(nodeStates(tiny, p).get("b")).toBe("available");
    expect(nodeStates(tiny, p).get("p")).toBe("locked");
    const p2 = { ...p, nodes: { ...p.nodes, b: { state: "tested-out" as const, bestScore: 1, attempts: 1 } } };
    expect(nodeStates(tiny, p2).get("p")).toBe("available");
    expect(completion(tiny, p2)).toBeCloseTo(2 / 3);
  });
});

describe("quiz grading", () => {
  it("grades each question type", () => {
    const single = q("turing-1936", "algorithm", "a1");
    expect(isCorrect(single, "a")).toBe(true);
    expect(isCorrect(single, "b")).toBe(false);
    const multi = q("turing-1936", "algorithm", "a3");
    expect(isCorrect(multi, ["a", "c", "d"])).toBe(true);
    expect(isCorrect(multi, ["a", "c"])).toBe(false);
    const numeric = q("shannon-1948", "entropy", "e1");
    expect(isCorrect(numeric, 2.59)).toBe(true);
    expect(isCorrect(numeric, 2.4)).toBe(false);
    const order = q("turing-1936", "undecidable", "h1");
    expect(isCorrect(order, ["a", "b", "c", "d", "e"])).toBe(true);
    expect(isCorrect(order, ["b", "a", "c", "d", "e"])).toBe(false);
    expect(score([single, multi], { a1: "a", a3: ["a"] })).toBe(0.5);
  });
  it("shuffles deterministically and keeps every item", () => {
    const xs = [1, 2, 3, 4, 5, 6];
    expect(shuffled(xs, 5)).toEqual(shuffled(xs, 5));
    expect([...shuffled(xs, 5)].sort()).toEqual(xs);
  });
});

describe("numeric answer keys, recomputed independently", () => {
  it("Turing machines", () => {
    const adder = tmParams("turing-1936", "symbols");
    expect(parseInt(runTM("111", adder.rules, adder.start, adder.halt, 100), 2)).toBe(numericAnswer("turing-1936", "symbols", "s2"));
    const unary = tmParams("turing-1936", "universal");
    expect(runTM("1111+111", unary.rules, unary.start, unary.halt, 100).length).toBe(numericAnswer("turing-1936", "universal", "u3"));
    const bcef = tmParams("turing-1936", "machine");
    expect([...runTM("_", bcef.rules, bcef.start, bcef.halt, 8)].filter((c) => c === "1").length).toBe(numericAnswer("turing-1936", "machine", "m4"));
    expect(parseInt("1101", 2)).toBe(numericAnswer("turing-1936", "symbols", "s1"));
  });
  it("information theory", () => {
    expect(entropyBits([1, 1, 1, 1, 1, 1].map((x) => x / 6))).toBeCloseTo(numericAnswer("shannon-1948", "entropy", "e1"), 2);
    expect(entropyBits([0.5, 0.25, 0.125, 0.125])).toBeCloseTo(1.75, 10);
    const p = 0.1;
    expect(3 * p * p * (1 - p) + p ** 3).toBeCloseTo(numericAnswer("shannon-1948", "noise", "n1"), 3);
    expect(1 - entropyBits([0.5, 0.5])).toBeCloseTo(numericAnswer("shannon-1948", "capacity", "cap2"), 6);
    // Shannon's own example: equivocation for p = 0.01 at 1000 bits/s.
    expect(1000 * (1 - entropyBits([0.99, 0.01]))).toBeCloseTo(numericAnswer("shannon-1948", "capacity", "cap1"), -1);
    expect(0.6 * 0.6 * 0.4).toBeCloseTo(numericAnswer("shannon-1948", "probability", "pr1"), 6);
  });
  it("modular arithmetic and key exchange", () => {
    expect(modPow(5, 3, 13)).toBe(numericAnswer("diffie-hellman-1976", "modular", "m1"));
    expect(modPow(2, 10, 11)).toBe(numericAnswer("diffie-hellman-1976", "modular", "m2"));
    expect(modPow(5, 3, 23)).toBe(numericAnswer("diffie-hellman-1976", "exchange", "k1"));
    const x = numericAnswer("diffie-hellman-1976", "one-way", "o1");
    expect(modPow(5, x, 23)).toBe(8);
    expect(Array.from({ length: 22 }, (_, i) => i + 1).filter((k) => modPow(5, k, 23) === 8)).toEqual([x]);
    const [A, B] = [modPow(5, 6, 23), modPow(5, 15, 23)];
    expect([A, B, modPow(B, 6, 23), modPow(A, 15, 23)]).toEqual([8, 19, 2, 2]);
  });
  it("game theory", () => {
    const eqs = pureEquilibria([[[2, 1], [0, 0]], [[0, 0], [1, 2]]]);
    expect(eqs.length).toBe(numericAnswer("nash-1950", "equilibrium", "eq2"));
    expect(pureEquilibria([[[3, 3], [0, 5]], [[5, 0], [1, 1]]])).toEqual([[1, 1]]);
    expect(pureEquilibria([[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]])).toEqual([]);
    expect(0.7 * 1 + 0.3 * -1).toBeCloseTo(numericAnswer("nash-1950", "mixed", "mx1"), 6);
  });
  it("machine learning", () => {
    expect(softmax([3, 1])[0]).toBeCloseTo(numericAnswer("transformer-2017", "softmax", "s2"), 3);
    expect(2 * 4 + 3 * -1).toBe(numericAnswer("transformer-2017", "dot", "d1"));
    // Computation-graph widget start: x=2, w=0.5, b=0, y=3; dL/dw = 2(wx+b-y)x.
    expect(2 * (0.5 * 2 + 0 - 3) * 2).toBe(numericAnswer("backprop-1986", "backprop", "b1"));
    expect(-0.1 * 2 + 0.9 * -0.4).toBeCloseTo(numericAnswer("backprop-1986", "descent", "g2"), 6);
    expect(0.5 * 0.8 * 0.2).toBeCloseTo(numericAnswer("backprop-1986", "chain", "c3"), 6);
  });
  it("science journeys", () => {
    expect(28 * 1 - 2 - 1 * 3).toBe(numericAnswer("lorenz-1963", "equations", "le2"));
    expect(0.1 * 2 ** 5).toBeCloseTo(numericAnswer("lorenz-1963", "sensitivity", "sd1"), 6);
    expect(Math.floor(100 * Math.log10(3))).toBe(numericAnswer("alphafold-2021", "folding", "f3"));
    expect(Math.sqrt((1 + 1 + 1 + 9) / 4)).toBeCloseTo(numericAnswer("alphafold-2021", "experiment", "x1"), 2);
    expect((1 * 300 + 3 * 1000) / (1 + 9)).toBe(numericAnswer("hubble-1929", "fitting", "f1"));
    expect(150 * 3.4 / 10).toBeCloseTo(numericAnswer("watson-crick-1953", "helix", "hx3"), 6);
    expect(6 * 2 + 4 * 3).toBe(numericAnswer("watson-crick-1953", "pairing", "bp3"));
  });
});
