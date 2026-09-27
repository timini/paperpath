import { useState } from "react";
import { z } from "zod";
import { Controls, Readout, Slider, Stat } from "./common";

export function modPow(base: number, exp: number, mod: number): number {
  let r = 1n;
  let b = BigInt(base) % BigInt(mod);
  let e = BigInt(exp);
  const m = BigInt(mod);
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(r);
}

/* ---------- modular-arithmetic ---------- */

export const modularSchema = z.object({
  modulus: z.number().int().min(3).max(30),
  base: z.number().int().min(2),
});

export function ModularArithmetic({ params }: { params: z.infer<typeof modularSchema> }) {
  const [n, setN] = useState(params.modulus);
  const [g, setG] = useState(params.base);
  const [k, setK] = useState(1);
  const seq = Array.from({ length: n - 1 }, (_, i) => modPow(g, i + 1, n));
  const cur = modPow(g, k, n);
  const distinct = new Set(seq).size;
  const R = 80;
  const pt = (v: number) => {
    const a = (2 * Math.PI * v) / n - Math.PI / 2;
    return [100 + R * Math.cos(a), 100 + R * Math.sin(a)];
  };
  const path = seq.slice(0, k).map(pt);
  return (
    <div>
      <svg viewBox="0 0 200 200" className="w-svg narrow" role="img" aria-label={`Clock with ${n} positions. ${g} to the power ${k} lands on ${cur}.`}>
        <circle cx={100} cy={100} r={R} className="w-clock" />
        {path.length > 1 && <polyline points={path.map((p) => p.join(",")).join(" ")} className="w-path" />}
        {Array.from({ length: n }, (_, v) => {
          const [x, y] = pt(v);
          return (
            <g key={v}>
              <circle cx={x} cy={y} r={v === cur ? 9 : 6} className={v === cur ? "w-node sel" : "w-node"} />
              <text x={x} y={y + 3} className="w-tiny">{v}</text>
            </g>
          );
        })}
      </svg>
      <Controls>
        <Slider label="Modulus n (a prime works best)" value={n} min={3} max={30} step={1} onChange={(v) => { setN(v); setK(1); }} />
        <Slider label="Base g" value={g} min={2} max={n - 1} step={1} onChange={setG} />
        <Slider label="Exponent k" value={k} min={1} max={n - 1} step={1} onChange={setK} />
      </Controls>
      <Readout>
        <Stat label={`${g}^${k} mod ${n}`} value={cur} />
        <Stat label={`Powers of ${g}`} value={seq.join(", ")} />
        <Stat label="Different values reached" value={`${distinct} of ${n - 1}`} />
      </Readout>
    </div>
  );
}

/* ---------- key-exchange ---------- */

export const keyExchangeSchema = z.object({
  p: z.number().int().min(5),
  g: z.number().int().min(2),
  a: z.number().int().min(1),
  b: z.number().int().min(1),
});

export function KeyExchange({ params }: { params: z.infer<typeof keyExchangeSchema> }) {
  const [a, setA] = useState(params.a);
  const [b, setB] = useState(params.b);
  const [stage, setStage] = useState(0);
  const { p, g } = params;
  const A = modPow(g, a, p);
  const B = modPow(g, b, p);
  const kA = modPow(B, a, p);
  const kB = modPow(A, b, p);
  const steps = [
    `Everyone, including Eve, knows the public numbers p = ${p} and g = ${g}.`,
    `Alice picks a secret a = ${a} and sends A = g^a mod p = ${A}.`,
    `Bob picks a secret b = ${b} and sends B = g^b mod p = ${B}.`,
    `Alice computes B^a mod p = ${kA}. Bob computes A^b mod p = ${kB}. They match.`,
  ];
  let eveGuess = -1;
  for (let x = 1; x < p && stage >= 3; x++) if (modPow(g, x, p) === A) { eveGuess = x; break; }
  return (
    <div>
      <div className="w-kx">
        <div className="w-party"><h4>Alice</h4><p>secret a = {a}</p>{stage >= 1 && <p>sends A = {A}</p>}{stage >= 3 && <p className="key">key = {kA}</p>}</div>
        <div className="w-party eve"><h4>Eve (listening)</h4><p>sees p = {p}, g = {g}</p>{stage >= 1 && <p>sees A = {A}</p>}{stage >= 2 && <p>sees B = {B}</p>}{stage >= 3 && <p>to find the key she must recover a from A{eveGuess > 0 ? `: trying every value finds a = ${eveGuess} here, but not when p has hundreds of digits` : ""}</p>}</div>
        <div className="w-party"><h4>Bob</h4><p>secret b = {b}</p>{stage >= 2 && <p>sends B = {B}</p>}{stage >= 3 && <p className="key">key = {kB}</p>}</div>
      </div>
      <Readout><span>{steps[stage]}</span></Readout>
      <Controls>
        <button className="btn" onClick={() => setStage((s) => Math.min(3, s + 1))} disabled={stage === 3}>Next step</button>
        <button className="btn ghost" onClick={() => setStage(0)}>Start again</button>
        <Slider label="Alice's secret a" value={a} min={1} max={p - 2} step={1} onChange={setA} />
        <Slider label="Bob's secret b" value={b} min={1} max={p - 2} step={1} onChange={setB} />
      </Controls>
    </div>
  );
}
