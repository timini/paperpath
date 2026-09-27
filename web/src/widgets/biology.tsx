import { useMemo, useState } from "react";
import { z } from "zod";
import { Controls, Readout, Slider, Stat, fmt } from "./common";

/* ---------- base-pairing ---------- */

export const basePairingSchema = z.object({
  strand: z.string().regex(/^[ACGT]+$/).max(12),
});

const PARTNER: Record<string, string> = { A: "T", T: "A", G: "C", C: "G" };
const BONDS: Record<string, number> = { A: 2, T: 2, G: 3, C: 3 };

export function BasePairing({ params }: { params: z.infer<typeof basePairingSchema> }) {
  const strand = params.strand.split("");
  const [picked, setPicked] = useState<(string | null)[]>(() => strand.map(() => null));
  const [active, setActive] = useState(0);
  const correct = picked.filter((b, i) => b === PARTNER[strand[i]]).length;
  const bonds = picked.reduce((s, b, i) => (b === PARTNER[strand[i]] ? s + BONDS[strand[i]] : s), 0);
  const gc = strand.filter((b) => b === "G" || b === "C").length;

  const choose = (b: string) => {
    setPicked((old) => old.map((o, i) => (i === active ? b : o)));
    setActive((i) => Math.min(strand.length - 1, i + 1));
  };

  return (
    <div>
      <div className="w-dna" role="list" aria-label="Two strands">
        {strand.map((b, i) => {
          const p = picked[i];
          const ok = p === PARTNER[b];
          return (
            <button key={i} role="listitem" className={`w-pair ${i === active ? "active" : ""} ${p ? (ok ? "ok" : "bad") : ""}`}
              onClick={() => setActive(i)} aria-label={`Position ${i + 1}: ${b} paired with ${p ?? "nothing yet"}`}>
              <span className={`w-base b-${b}`}>{b}</span>
              <span className="w-rung" aria-hidden="true">{p ? (ok ? (BONDS[b] === 3 ? "≡" : "=") : "✕") : "·"}</span>
              <span className={`w-base ${p ? `b-${p}` : "empty"}`}>{p ?? "?"}</span>
            </button>
          );
        })}
      </div>
      <Controls>
        <span className="w-hint">Pick the partner for position {active + 1}:</span>
        {["A", "T", "G", "C"].map((b) => (
          <button key={b} className={`btn base b-${b}`} onClick={() => choose(b)}>{b}</button>
        ))}
        <button className="btn ghost" onClick={() => { setPicked(strand.map(() => null)); setActive(0); }}>Reset</button>
      </Controls>
      <Readout>
        <Stat label="Correct pairs" value={`${correct} of ${strand.length}`} />
        <Stat label="Hydrogen bonds formed" value={bonds} />
        <Stat label="GC content" value={`${fmt((100 * gc) / strand.length, 2)}%`} />
      </Readout>
    </div>
  );
}

/* ---------- protein-contacts ---------- */

export const proteinContactsSchema = z.object({
  residues: z.string().min(4).max(30),
  coords: z.array(z.tuple([z.number(), z.number()])).min(4),
  threshold: z.number().positive(),
});

export function ProteinContacts({ params }: { params: z.infer<typeof proteinContactsSchema> }) {
  const [t, setT] = useState(params.threshold);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const n = Math.min(params.residues.length, params.coords.length);
  const d = useMemo(
    () => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => Math.hypot(params.coords[i][0] - params.coords[j][0], params.coords[i][1] - params.coords[j][1]))),
    [params.coords, n],
  );
  const contacts = [];
  for (let i = 0; i < n; i++) for (let j = i + 3; j < n; j++) if (d[i][j] <= t) contacts.push([i, j]);

  const xs = params.coords.map((c) => c[0]);
  const ys = params.coords.map((c) => c[1]);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const sc = (v: number, a: number, b: number) => 15 + ((v - a) / (b - a || 1)) * 170;
  const cell = 180 / n;

  return (
    <div className="w-two">
      <svg viewBox="0 0 200 200" className="w-svg" role="img" aria-label="Chain shape in two dimensions">
        {params.coords.slice(0, n - 1).map((c, i) => (
          <line key={i} x1={sc(c[0], minX, maxX)} y1={sc(c[1], minY, maxY)} x2={sc(params.coords[i + 1][0], minX, maxX)} y2={sc(params.coords[i + 1][1], minY, maxY)} className="w-edge" />
        ))}
        {contacts.map(([i, j]) => (
          <line key={`c${i}-${j}`} x1={sc(params.coords[i][0], minX, maxX)} y1={sc(params.coords[i][1], minY, maxY)} x2={sc(params.coords[j][0], minX, maxX)} y2={sc(params.coords[j][1], minY, maxY)} className={sel && sel[0] === i && sel[1] === j ? "w-contact sel" : "w-contact"} />
        ))}
        {params.coords.slice(0, n).map((c, i) => (
          <g key={i}>
            <circle cx={sc(c[0], minX, maxX)} cy={sc(c[1], minY, maxY)} r={6} className={sel && (sel[0] === i || sel[1] === i) ? "w-node sel" : "w-node"} />
            <text x={sc(c[0], minX, maxX)} y={sc(c[1], minY, maxY) + 3} className="w-tiny">{params.residues[i]}</text>
          </g>
        ))}
      </svg>
      <svg viewBox="0 0 200 200" className="w-svg" role="img" aria-label="Contact map: a filled square means the two residues are close">
        {Array.from({ length: n }, (_, i) =>
          Array.from({ length: n }, (_, j) => {
            const on = Math.abs(i - j) >= 3 && d[i][j] <= t;
            return (
              <rect key={`${i}-${j}`} x={10 + j * cell} y={10 + i * cell} width={cell - 1} height={cell - 1}
                className={on ? (sel && ((sel[0] === i && sel[1] === j) || (sel[0] === j && sel[1] === i)) ? "w-cm on sel" : "w-cm on") : i === j ? "w-cm diag" : "w-cm"}
                onClick={() => on && setSel([Math.min(i, j), Math.max(i, j)])} />
            );
          }),
        )}
      </svg>
      <Controls>
        <Slider label="Contact distance cutoff" value={t} min={1} max={Math.ceil(t * 3)} step={0.5} onChange={setT} display={`${fmt(t, 2)} Å`} />
      </Controls>
      <Readout>
        <Stat label="Contacts (3+ apart in sequence)" value={contacts.length} />
        <Stat label="Selected" value={sel ? `${params.residues[sel[0]]}${sel[0] + 1} – ${params.residues[sel[1]]}${sel[1] + 1}: ${fmt(d[sel[0]][sel[1]], 2)} Å` : "tap a filled square"} />
      </Readout>
    </div>
  );
}
