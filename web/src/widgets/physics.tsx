import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Controls, Readout, Slider, Stat, fmt, prefersReducedMotion, useAnimationFrame, useWidth } from "./common";

/* ---------- hubble-plot ---------- */

export const hubbleSchema = z.object({
  points: z.array(z.object({ name: z.string(), d: z.number(), v: z.number() })).min(3),
  distanceUnit: z.string(),
  velocityUnit: z.string(),
  initialSlope: z.number(),
});

export function HubblePlot({ params }: { params: z.infer<typeof hubbleSchema> }) {
  const [H, setH] = useState(params.initialSlope);
  const pts = params.points;
  const best = pts.reduce((s, p) => s + p.d * p.v, 0) / pts.reduce((s, p) => s + p.d * p.d, 0);
  const sse = pts.reduce((s, p) => s + (p.v - H * p.d) ** 2, 0);
  const maxD = Math.max(...pts.map((p) => p.d)) * 1.1;
  const vs = pts.map((p) => p.v);
  const minV = Math.min(0, ...vs) * 1.1;
  const maxV = Math.max(...vs, H * maxD) * 1.1;
  const X = (d: number) => 40 + (d / maxD) * 340;
  const Y = (v: number) => 190 - ((v - minV) / (maxV - minV)) * 170;
  return (
    <div>
      <svg viewBox="0 0 400 220" className="w-svg" role="img" aria-label={`Velocity against distance for ${pts.length} galaxies, with a straight line through the origin of slope ${fmt(H)}`}>
        <line x1={40} y1={Y(0)} x2={390} y2={Y(0)} className="w-axis" />
        <line x1={40} y1={10} x2={40} y2={200} className="w-axis" />
        <text x={210} y={215} className="w-axis-label">distance ({params.distanceUnit})</text>
        <text x={12} y={100} className="w-axis-label" transform="rotate(-90 12 100)">velocity ({params.velocityUnit})</text>
        {pts.map((p) => (
          <g key={p.name}>
            <line x1={X(p.d)} y1={Y(p.v)} x2={X(p.d)} y2={Y(H * p.d)} className="w-resid" />
            <circle cx={X(p.d)} cy={Y(p.v)} r={4} className="w-point" />
          </g>
        ))}
        <line x1={X(0)} y1={Y(0)} x2={X(maxD)} y2={Y(H * maxD)} className="w-fit" />
      </svg>
      <Controls>
        <Slider label="Slope K (the Hubble constant)" value={H} min={0} max={Math.ceil(best * 2)} step={Math.max(1, Math.round(best / 50))} onChange={setH} display={`${fmt(H)} ${params.velocityUnit}/${params.distanceUnit}`} />
        <button className="btn" onClick={() => setH(Number(best.toPrecision(3)))}>Best fit</button>
      </Controls>
      <Readout>
        <Stat label="Sum of squared misses" value={fmt(sse)} />
        <Stat label="Best-fit slope" value={`${fmt(best)} ${params.velocityUnit}/${params.distanceUnit}`} />
        <Stat label="Implied age 1/K" value={params.distanceUnit === "Mpc" && params.velocityUnit === "km/s" && H > 0 ? `${fmt(977.8 / H, 2)} billion years` : "–"} />
      </Readout>
    </div>
  );
}

/* ---------- redshift ---------- */

export const redshiftSchema = z.object({
  restWavelength: z.number().positive(),
  lineName: z.string(),
  maxVelocity: z.number().positive(),
});

export function Redshift({ params }: { params: z.infer<typeof redshiftSchema> }) {
  const [v, setV] = useState(0);
  const c = 299792.458;
  const lambda = params.restWavelength * (1 + v / c);
  const x = (l: number) => 20 + ((l - 380) / (750 - 380)) * 360;
  return (
    <div>
      <svg viewBox="0 0 400 90" className="w-svg" role="img" aria-label={`Spectrum with the ${params.lineName} line moved from ${fmt(params.restWavelength)} to ${fmt(lambda)} nanometres`}>
        <defs>
          <linearGradient id="spec" x1="0" x2="1">
            {["#7a00ff", "#0040ff", "#00c8ff", "#00ff60", "#ffee00", "#ff8a00", "#ff0000"].map((c2, i) => (
              <stop key={i} offset={i / 6} stopColor={c2} />
            ))}
          </linearGradient>
        </defs>
        <rect x={20} y={15} width={360} height={40} fill="url(#spec)" rx={4} />
        <line x1={x(params.restWavelength)} y1={10} x2={x(params.restWavelength)} y2={60} className="w-rest" />
        <line x1={x(Math.min(lambda, 750))} y1={15} x2={x(Math.min(lambda, 750))} y2={55} className="w-line" />
        <text x={x(params.restWavelength)} y={75} className="w-tiny">at rest</text>
        <text x={x(Math.min(lambda, 750))} y={88} className="w-tiny">observed</text>
      </svg>
      <Controls>
        <Slider label="Recession velocity" value={v} min={0} max={params.maxVelocity} step={params.maxVelocity / 200} onChange={setV} display={`${fmt(v)} km/s`} />
      </Controls>
      <Readout>
        <Stat label={`${params.lineName} observed at`} value={`${fmt(lambda, 4)} nm`} />
        <Stat label="Redshift z = Δλ/λ" value={fmt((lambda - params.restWavelength) / params.restWavelength)} />
        <Stat label="v ≈ cz" value={`${fmt(v)} km/s`} />
      </Readout>
    </div>
  );
}

/* ---------- lorenz-attractor ---------- */

export const lorenzSchema = z.object({
  sigma: z.number(),
  rho: z.number(),
  beta: z.number(),
  delta: z.number().positive(),
});

type P3 = [number, number, number];

function lorenzStep([x, y, z]: P3, s: number, r: number, b: number, h: number): P3 {
  const f = ([a, c, e]: P3): P3 => [s * (c - a), a * (r - e) - c, a * c - b * e];
  const add = (p: P3, q: P3, k: number): P3 => [p[0] + k * q[0], p[1] + k * q[1], p[2] + k * q[2]];
  const p = [x, y, z] as P3;
  const k1 = f(p), k2 = f(add(p, k1, h / 2)), k3 = f(add(p, k2, h / 2)), k4 = f(add(p, k3, h));
  return [0, 1, 2].map((i) => p[i] + (h / 6) * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) as P3;
}

export function LorenzAttractor({ params }: { params: z.infer<typeof lorenzSchema> }) {
  const [rho, setRho] = useState(params.rho);
  const [running, setRunning] = useState(!prefersReducedMotion());
  const [t, setT] = useState(0);
  const [sep, setSep] = useState(params.delta);
  const fresh = () => ({ a: [1, 1, 1] as P3, b: [1 + params.delta, 1, 1] as P3, trailA: [] as P3[], trailB: [] as P3[] });
  const state = useRef(fresh());
  const reset = () => {
    state.current = fresh();
    setT(0);
    setSep(params.delta);
  };
  useEffect(() => {
    state.current = fresh();
    setT(0);
    setSep(params.delta);
  }, [rho, params.delta]); // eslint-disable-line react-hooks/exhaustive-deps
  const [wrap, w] = useWidth<HTMLDivElement>();
  const canvas = useRef<HTMLCanvasElement>(null);
  const h = Math.round(w * 0.6);

  const advance = (dt: number) => {
    const s = state.current;
    const steps = Math.max(1, Math.round(dt / 0.005));
    for (let i = 0; i < steps; i++) {
      s.a = lorenzStep(s.a, params.sigma, rho, params.beta, 0.005);
      s.b = lorenzStep(s.b, params.sigma, rho, params.beta, 0.005);
    }
    s.trailA.push(s.a);
    s.trailB.push(s.b);
    if (s.trailA.length > 600) { s.trailA.shift(); s.trailB.shift(); }
    setSep(Math.hypot(s.a[0] - s.b[0], s.a[1] - s.b[1], s.a[2] - s.b[2]));
    setT((x) => x + steps * 0.005);
  };
  useAnimationFrame(advance, running);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx || !state.current) return;
    const s = state.current;
    ctx.clearRect(0, 0, w, h);
    const X = (p: P3) => w / 2 + p[0] * (w / 60);
    const Y = (p: P3) => h - 10 - p[2] * (h / 55);
    const draw = (trail: P3[], colour: string) => {
      ctx.strokeStyle = colour;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      trail.forEach((p, i) => (i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p))));
      ctx.stroke();
    };
    draw(s.trailA, "#58c4dd");
    draw(s.trailB, "#f7d96f");
  }, [t, w, h]);

  return (
    <div ref={wrap}>
      <canvas ref={canvas} width={w} height={h} className="w-canvas" role="img"
        aria-label={`Two Lorenz trajectories, blue and yellow, starting ${params.delta} apart. Current separation ${fmt(sep, 2)}.`} />
      <Controls>
        <Slider label="ρ (heating strength)" value={rho} min={0} max={40} step={0.5} onChange={setRho} />
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? "Pause" : "Run"}</button>
        {!running && <button className="btn" onClick={() => advance(0.05)}>Step</button>}
        <button className="btn ghost" onClick={reset}>Restart</button>
      </Controls>
      <Readout>
        <Stat label="Time" value={fmt(t, 3)} />
        <Stat label="Start difference" value={fmt(params.delta)} />
        <Stat label="Separation now" value={fmt(sep, 3)} />
      </Readout>
    </div>
  );
}
