import { useRef, useState } from "react";
import { z } from "zod";
import { Controls, Readout, Slider, Stat, fmt, svgPoint } from "./common";

export function softmax(xs: number[], T = 1): number[] {
  const m = Math.max(...xs.map((x) => x / T));
  const e = xs.map((x) => Math.exp(x / T - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((x) => x / s);
}

/* ---------- gradient-descent (1D) ---------- */

export const gradientDescentSchema = z.object({
  curve: z.enum(["bowl", "two-valleys"]),
  start: z.number(),
  learningRate: z.number().positive(),
});

const CURVES = {
  bowl: { f: (x: number) => 0.5 * x * x, df: (x: number) => x, lo: -4, hi: 4 },
  "two-valleys": { f: (x: number) => 0.1 * x ** 4 - 0.8 * x * x + 0.3 * x + 2, df: (x: number) => 0.4 * x ** 3 - 1.6 * x + 0.3, lo: -3.2, hi: 3.2 },
};

export function GradientDescent({ params }: { params: z.infer<typeof gradientDescentSchema> }) {
  const c = CURVES[params.curve];
  const [lr, setLr] = useState(params.learningRate);
  const [path, setPath] = useState<number[]>([params.start]);
  const x = path[path.length - 1];
  const samples = Array.from({ length: 81 }, (_, i) => c.lo + ((c.hi - c.lo) * i) / 80);
  const ys = samples.map(c.f);
  const [yMin, yMax] = [Math.min(...ys), Math.max(...ys)];
  const X = (v: number) => 20 + ((v - c.lo) / (c.hi - c.lo)) * 360;
  const Y = (v: number) => 180 - ((Math.min(Math.max(v, yMin), yMax) - yMin) / (yMax - yMin)) * 160;
  const diverged = !Number.isFinite(x) || Math.abs(x) > 1e3;
  const step = () => setPath((p) => [...p, p[p.length - 1] - lr * c.df(p[p.length - 1])]);
  return (
    <div>
      <svg viewBox="0 0 400 200" className="w-svg" role="img" aria-label={`Loss curve with the parameter at ${fmt(x)} after ${path.length - 1} steps`}>
        <polyline points={samples.map((s) => `${X(s)},${Y(c.f(s))}`).join(" ")} className="w-curve" />
        {path.slice(-12).map((p, i, arr) =>
          Math.abs(p) < 50 ? <circle key={i} cx={X(Math.max(c.lo, Math.min(c.hi, p)))} cy={Y(c.f(p))} r={i === arr.length - 1 ? 7 : 3} className={i === arr.length - 1 ? "w-ball" : "w-trail"} /> : null,
        )}
      </svg>
      <Controls>
        <Slider label="Learning rate η" value={lr} min={0.01} max={2.2} step={0.01} onChange={setLr} />
        <button className="btn" onClick={step} disabled={diverged}>Step</button>
        <button className="btn" onClick={() => { for (let i = 0; i < 10; i++) step(); }} disabled={diverged}>10 steps</button>
        <button className="btn ghost" onClick={() => setPath([params.start])}>Reset</button>
      </Controls>
      <Readout>
        <Stat label="Steps" value={path.length - 1} />
        <Stat label="Parameter" value={diverged ? "diverged" : fmt(x)} />
        <Stat label="Loss" value={diverged ? "–" : fmt(c.f(x))} />
        <Stat label="Slope here" value={diverged ? "–" : fmt(c.df(x))} />
      </Readout>
    </div>
  );
}

/* ---------- neuron ---------- */

export const neuronSchema = z.object({
  inputs: z.array(z.number()).min(1).max(4),
  weights: z.array(z.number()).min(1).max(4),
  bias: z.number(),
  activation: z.enum(["sigmoid", "step", "relu"]),
});

const ACT = {
  sigmoid: (z: number) => 1 / (1 + Math.exp(-z)),
  step: (z: number) => (z >= 0 ? 1 : 0),
  relu: (z: number) => Math.max(0, z),
};

export function Neuron({ params }: { params: z.infer<typeof neuronSchema> }) {
  const [w, setW] = useState(params.weights);
  const [b, setB] = useState(params.bias);
  const [act, setAct] = useState(params.activation);
  const zsum = params.inputs.reduce((s, x, i) => s + x * (w[i] ?? 0), 0) + b;
  const out = ACT[act](zsum);
  return (
    <div>
      <svg viewBox="0 0 400 180" className="w-svg" role="img" aria-label={`One unit: weighted sum ${fmt(zsum)}, output ${fmt(out)}`}>
        {params.inputs.map((x, i) => {
          const y = 30 + (i * 120) / Math.max(1, params.inputs.length - 1);
          return (
            <g key={i}>
              <line x1={60} y1={y} x2={220} y2={90} className="w-edge" strokeWidth={1 + Math.min(6, Math.abs(w[i]) * 2)} stroke={w[i] >= 0 ? "#2563eb" : "#e11d48"} />
              <circle cx={40} cy={y} r={18} className="w-node" />
              <text x={40} y={y + 4} className="w-node-val">{fmt(x, 2)}</text>
              <text x={130} y={(y + 90) / 2 - 6} className="w-tiny">w={fmt(w[i], 2)}</text>
            </g>
          );
        })}
        <circle cx={240} cy={90} r={30} className="w-node sel" />
        <text x={240} y={86} className="w-node-label">Σ + b</text>
        <text x={240} y={102} className="w-node-val">{fmt(zsum, 3)}</text>
        <line x1={270} y1={90} x2={330} y2={90} className="w-edge" />
        <text x={300} y={80} className="w-tiny">{act}</text>
        <circle cx={360} cy={90} r={22} className="w-node" />
        <text x={360} y={94} className="w-node-val">{fmt(out, 3)}</text>
      </svg>
      <Controls>
        {params.inputs.map((_, i) => (
          <Slider key={i} label={`Weight w${i + 1}`} value={w[i]} min={-3} max={3} step={0.1} onChange={(v) => setW((o) => o.map((x, j) => (j === i ? v : x)))} />
        ))}
        <Slider label="Bias b" value={b} min={-3} max={3} step={0.1} onChange={setB} />
        <div className="w-seg" role="group" aria-label="Activation">
          {(["step", "sigmoid", "relu"] as const).map((a) => (
            <button key={a} className={a === act ? "btn on" : "btn"} onClick={() => setAct(a)}>{a}</button>
          ))}
        </div>
      </Controls>
      <Readout>
        <Stat label="Weighted sum z = Σ wᵢxᵢ + b" value={fmt(zsum)} />
        <Stat label="Output" value={fmt(out)} />
      </Readout>
    </div>
  );
}

/* ---------- softmax ---------- */

export const softmaxSchema = z.object({
  labels: z.array(z.string()).min(2).max(6),
  scores: z.array(z.number()).min(2).max(6),
  temperature: z.number().positive().default(1),
});

export function Softmax({ params }: { params: z.infer<typeof softmaxSchema> }) {
  const [s, setS] = useState(params.scores);
  const [T, setT] = useState(params.temperature);
  const p = softmax(s, T);
  return (
    <div>
      <div className="w-bars" role="img" aria-label={`Probabilities: ${p.map((x, i) => `${params.labels[i]} ${fmt(x, 2)}`).join(", ")}`}>
        {p.map((x, i) => (
          <div key={i} className="w-bar">
            <div className="w-bar-fill" style={{ height: `${x * 100}%` }} />
            <span>{params.labels[i]}</span>
            <small>{fmt(x, 2)}</small>
          </div>
        ))}
      </div>
      <Controls>
        {s.map((x, i) => (
          <Slider key={i} label={`Score for ${params.labels[i]}`} value={x} min={-5} max={5} step={0.1} onChange={(v) => setS((o) => o.map((y, j) => (j === i ? v : y)))} />
        ))}
        <Slider label="Temperature" value={T} min={0.1} max={5} step={0.1} onChange={setT} />
      </Controls>
      <Readout>
        <Stat label="Sum of probabilities" value={fmt(p.reduce((a, b) => a + b, 0))} />
        <Stat label="Largest" value={`${params.labels[p.indexOf(Math.max(...p))]} (${fmt(Math.max(...p), 2)})`} />
      </Readout>
    </div>
  );
}

/* ---------- attention-heatmap ---------- */

export const attentionSchema = z.object({
  tokens: z.array(z.string()).min(2).max(8),
  // Two-dimensional query and key vectors per token keep the arithmetic visible.
  queries: z.array(z.tuple([z.number(), z.number()])),
  keys: z.array(z.tuple([z.number(), z.number()])),
  scale: z.boolean().default(true),
});

export function AttentionHeatmap({ params }: { params: z.infer<typeof attentionSchema> }) {
  const n = params.tokens.length;
  const [qi, setQi] = useState(0);
  const d = 2;
  const scores = (i: number) => params.keys.map((k) => (params.queries[i][0] * k[0] + params.queries[i][1] * k[1]) / (params.scale ? Math.sqrt(d) : 1));
  const W = Array.from({ length: n }, (_, i) => softmax(scores(i)));
  const cell = Math.min(40, 300 / n);
  return (
    <div>
      <div className="w-tokens" role="group" aria-label="Choose the token doing the looking">
        {params.tokens.map((t, i) => (
          <button key={i} className={i === qi ? "btn on" : "btn"} onClick={() => setQi(i)}>{t}</button>
        ))}
      </div>
      <svg viewBox={`0 0 ${70 + n * cell} ${40 + n * cell}`} className="w-svg" role="img" aria-label={`Attention weights. ${params.tokens[qi]} attends most to ${params.tokens[W[qi].indexOf(Math.max(...W[qi]))]}.`}>
        {params.tokens.map((t, j) => (
          <text key={`c${j}`} x={70 + j * cell + cell / 2} y={30} className="w-tiny">{t}</text>
        ))}
        {W.map((row, i) => (
          <g key={i}>
            <text x={62} y={40 + i * cell + cell / 2 + 3} className="w-tiny end">{params.tokens[i]}</text>
            {row.map((w, j) => (
              <rect key={j} x={70 + j * cell} y={40 + i * cell} width={cell - 2} height={cell - 2} rx={3}
                fill={`rgba(88, 196, 221, ${0.06 + 0.94 * w})`} className={i === qi ? "w-hm sel" : "w-hm"} onClick={() => setQi(i)} />
            ))}
          </g>
        ))}
      </svg>
      <Readout>
        {W[qi].map((w, j) => (
          <Stat key={j} label={`${params.tokens[qi]} → ${params.tokens[j]}`} value={`score ${fmt(scores(qi)[j], 2)}, weight ${fmt(w, 2)}`} />
        ))}
      </Readout>
    </div>
  );
}

/* ---------- vector-dot ---------- */

export const vectorDotSchema = z.object({
  a: z.tuple([z.number(), z.number()]),
  b: z.tuple([z.number(), z.number()]),
});

export function VectorDot({ params }: { params: z.infer<typeof vectorDotSchema> }) {
  const [a, setA] = useState<[number, number]>(params.a);
  const [b, setB] = useState<[number, number]>(params.b);
  const [drag, setDrag] = useState<"a" | "b" | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const S = 30; // pixels per unit
  const to = (v: [number, number]) => [150 + v[0] * S, 150 - v[1] * S];
  const move = (e: React.PointerEvent) => {
    if (!drag || !svg.current) return;
    const p = svgPoint(svg.current, e.clientX, e.clientY);
    const v: [number, number] = [Math.round(((p.x - 150) / S) * 2) / 2, Math.round(((150 - p.y) / S) * 2) / 2];
    const clamp = (x: number) => Math.max(-4.5, Math.min(4.5, x));
    (drag === "a" ? setA : setB)([clamp(v[0]), clamp(v[1])]);
  };
  const dot = a[0] * b[0] + a[1] * b[1];
  const la = Math.hypot(...a), lb = Math.hypot(...b);
  const cos = la && lb ? dot / (la * lb) : 0;
  const [ax, ay] = to(a), [bx, by] = to(b);
  return (
    <div>
      <svg ref={svg} viewBox="0 0 300 300" className="w-svg narrow touch" onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}
        role="img" aria-label={`Vector a (${a.join(", ")}) and vector b (${b.join(", ")}); dot product ${fmt(dot)}`}>
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i}>
            <line x1={0} y1={i * 30} x2={300} y2={i * 30} className="w-grid" />
            <line x1={i * 30} y1={0} x2={i * 30} y2={300} className="w-grid" />
          </g>
        ))}
        <line x1={150} y1={150} x2={ax} y2={ay} className="w-vec a" />
        <line x1={150} y1={150} x2={bx} y2={by} className="w-vec b" />
        <circle cx={ax} cy={ay} r={14} className="w-handle a" onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); setDrag("a"); }} />
        <circle cx={bx} cy={by} r={14} className="w-handle b" onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); setDrag("b"); }} />
        <text x={ax + 16} y={ay} className="w-tiny">a</text>
        <text x={bx + 16} y={by} className="w-tiny">b</text>
      </svg>
      <Readout>
        <Stat label="a · b = a₁b₁ + a₂b₂" value={fmt(dot)} />
        <Stat label="cos(angle)" value={fmt(cos)} />
        <Stat label="Angle" value={`${fmt((Math.acos(Math.max(-1, Math.min(1, cos))) * 180) / Math.PI, 3)}°`} />
      </Readout>
      <p className="w-hint">Drag the ends of the arrows.</p>
    </div>
  );
}
