import { useMemo, useState } from "react";
import { z } from "zod";
import { Controls, Readout, Stat, fmt } from "./common";

/* ---------- turing-machine ---------- */

export const turingSchema = z.object({
  tape: z.string().min(1),
  blank: z.string().length(1).default("_"),
  start: z.string(),
  halt: z.array(z.string()).min(1),
  rules: z
    .array(z.object({ state: z.string(), read: z.string().length(1), write: z.string().length(1), move: z.enum(["L", "R", "N"]), next: z.string() }))
    .min(1),
  maxSteps: z.number().int().positive().default(200),
});

export function TuringMachine({ params }: { params: z.infer<typeof turingSchema> }) {
  const init = () => ({ tape: params.tape.split(""), head: 0, state: params.start, steps: 0, stuck: false });
  const [m, setM] = useState(init);
  const halted = params.halt.includes(m.state) || m.stuck;

  const step = () =>
    setM((s) => {
      if (params.halt.includes(s.state) || s.stuck || s.steps >= params.maxSteps) return s;
      const tape = [...s.tape];
      let head = s.head;
      if (head < 0) {
        tape.unshift(params.blank);
        head = 0;
      }
      if (head >= tape.length) tape.push(params.blank);
      const read = tape[head];
      const rule = params.rules.find((r) => r.state === s.state && r.read === read);
      if (!rule) return { ...s, stuck: true };
      tape[head] = rule.write;
      head += rule.move === "L" ? -1 : rule.move === "R" ? 1 : 0;
      if (head < 0) {
        tape.unshift(params.blank);
        head = 0;
      }
      if (head >= tape.length) tape.push(params.blank);
      return { tape, head, state: rule.next, steps: s.steps + 1, stuck: false };
    });

  const run = () => {
    for (let i = 0; i < params.maxSteps; i++) step();
  };
  const current = params.rules.find((r) => r.state === m.state && r.read === m.tape[m.head]);

  return (
    <div className="w-turing">
      <div className="w-tape" role="list" aria-label="Tape">
        {m.tape.map((c, i) => (
          <span key={i} role="listitem" className={i === m.head ? "w-cell head" : "w-cell"}>
            {c}
          </span>
        ))}
      </div>
      <Readout>
        <Stat label="State" value={m.state} />
        <Stat label="Steps" value={m.steps} />
        <Stat
          label="Next rule"
          value={halted ? (m.stuck ? "no rule: stops" : "halted") : current ? `write ${current.write}, move ${current.move}, go to ${current.next}` : "none"}
        />
      </Readout>
      <details className="w-rules">
        <summary>Rule table ({params.rules.length} rules)</summary>
        <table>
          <thead>
            <tr><th>State</th><th>Read</th><th>Write</th><th>Move</th><th>Next</th></tr>
          </thead>
          <tbody>
            {params.rules.map((r, i) => (
              <tr key={i} className={r === current && !halted ? "active" : ""}>
                <td>{r.state}</td><td>{r.read}</td><td>{r.write}</td><td>{r.move}</td><td>{r.next}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <Controls>
        <button className="btn" onClick={step} disabled={halted}>Step</button>
        <button className="btn" onClick={run} disabled={halted}>Run to end</button>
        <button className="btn ghost" onClick={() => setM(init())}>Reset</button>
      </Controls>
    </div>
  );
}

/* ---------- computation-graph (forward and backward pass through f = (w*x + b - y)^2) ---------- */

export const computationGraphSchema = z.object({
  x: z.number(),
  w: z.number(),
  b: z.number(),
  y: z.number(),
});

export function ComputationGraph({ params }: { params: z.infer<typeof computationGraphSchema> }) {
  const [w, setW] = useState(params.w);
  const [b, setB] = useState(params.b);
  const [showBackward, setShowBackward] = useState(false);
  const { x, y } = params;
  const v = useMemo(() => {
    const z1 = w * x;
    const z2 = z1 + b;
    const e = z2 - y;
    const L = e * e;
    const dL_de = 2 * e;
    const dL_dz2 = dL_de;
    const dL_dz1 = dL_dz2;
    return { z1, z2, e, L, dL_de, dL_dw: dL_dz1 * x, dL_db: dL_dz2 };
  }, [w, b, x, y]);

  const nodes: { id: string; label: string; val: string; grad?: string; cx: number; cy: number }[] = [
    { id: "x", label: "x", val: fmt(x), cx: 40, cy: 40 },
    { id: "w", label: "w", val: fmt(w), grad: fmt(v.dL_dw), cx: 40, cy: 120 },
    { id: "mul", label: "×", val: fmt(v.z1), grad: fmt(v.dL_de), cx: 130, cy: 80 },
    { id: "b", label: "b", val: fmt(b), grad: fmt(v.dL_db), cx: 130, cy: 170 },
    { id: "add", label: "+", val: fmt(v.z2), grad: fmt(v.dL_de), cx: 220, cy: 120 },
    { id: "sub", label: "− y", val: fmt(v.e), grad: fmt(v.dL_de), cx: 300, cy: 120 },
    { id: "sq", label: "( )²", val: fmt(v.L), grad: "1", cx: 380, cy: 120 },
  ];
  const edges = [["x", "mul"], ["w", "mul"], ["mul", "add"], ["b", "add"], ["add", "sub"], ["sub", "sq"]];
  const pos = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const step = () => {
    setW((w0) => w0 - 0.05 * v.dL_dw);
    setB((b0) => b0 - 0.05 * v.dL_db);
  };

  return (
    <div>
      <svg viewBox="0 0 420 210" className="w-svg" role="img" aria-label="Computation graph for the squared error of a single linear unit">
        {edges.map(([a, c]) => (
          <line key={a + c} x1={pos[a].cx} y1={pos[a].cy} x2={pos[c].cx} y2={pos[c].cy} className="w-edge" />
        ))}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.cx} cy={n.cy} r={24} className="w-node" />
            <text x={n.cx} y={n.cy - 2} className="w-node-label">{n.label}</text>
            <text x={n.cx} y={n.cy + 12} className="w-node-val">{n.val}</text>
            {showBackward && n.grad && (
              <text x={n.cx} y={n.cy + 40} className="w-grad">∂L = {n.grad}</text>
            )}
          </g>
        ))}
      </svg>
      <Readout>
        <Stat label="Loss L" value={fmt(v.L)} />
        <Stat label="∂L/∂w" value={fmt(v.dL_dw)} />
        <Stat label="∂L/∂b" value={fmt(v.dL_db)} />
      </Readout>
      <Controls>
        <button className="btn" onClick={() => setShowBackward((s) => !s)}>
          {showBackward ? "Hide" : "Show"} backward pass
        </button>
        <button className="btn" onClick={step}>Gradient step (η = 0.05)</button>
        <button className="btn ghost" onClick={() => { setW(params.w); setB(params.b); }}>Reset</button>
      </Controls>
    </div>
  );
}
