import { useState } from "react";
import { z } from "zod";
import { Controls, Readout, Stat, Slider, fmt } from "./common";

/* ---------- payoff-matrix ---------- */

export const payoffSchema = z.object({
  rowPlayer: z.string(),
  colPlayer: z.string(),
  rowLabels: z.tuple([z.string(), z.string()]),
  colLabels: z.tuple([z.string(), z.string()]),
  // payoffs[r][c] = [row player's payoff, column player's payoff]
  payoffs: z.tuple([
    z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
    z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])]),
  ]),
  showMixed: z.boolean().default(false),
});

export function pureEquilibria(P: number[][][]): [number, number][] {
  const out: [number, number][] = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 2; c++) {
      const rowBest = P[r][c][0] >= P[1 - r][c][0];
      const colBest = P[r][c][1] >= P[r][1 - c][1];
      if (rowBest && colBest) out.push([r, c]);
    }
  return out;
}

export function PayoffMatrix({ params }: { params: z.infer<typeof payoffSchema> }) {
  const P = params.payoffs as unknown as number[][][];
  const [show, setShow] = useState<"none" | "row" | "col" | "both">("none");
  const [p, setP] = useState(0.5); // probability the row player plays row 0
  const [q, setQ] = useState(0.5); // probability the column player plays column 0
  const eq = pureEquilibria(P);
  const rowBR = (c: number) => (P[0][c][0] >= P[1][c][0] ? [0] : []).concat(P[1][c][0] >= P[0][c][0] ? [1] : []);
  const colBR = (r: number) => (P[r][0][1] >= P[r][1][1] ? [0] : []).concat(P[r][1][1] >= P[r][0][1] ? [1] : []);
  const expRow = (r: number) => q * P[r][0][0] + (1 - q) * P[r][1][0];
  const expCol = (c: number) => p * P[0][c][1] + (1 - p) * P[1][c][1];

  return (
    <div>
      <table className="w-payoff">
        <thead>
          <tr>
            <th className="corner">{params.rowPlayer} ↓ / {params.colPlayer} →</th>
            {params.colLabels.map((c) => <th key={c}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((r) => (
            <tr key={r}>
              <th>{params.rowLabels[r]}</th>
              {[0, 1].map((c) => {
                const isEq = eq.some(([a, b]) => a === r && b === c);
                const rBest = (show === "row" || show === "both") && rowBR(c).includes(r);
                const cBest = (show === "col" || show === "both") && colBR(r).includes(c);
                return (
                  <td key={c} className={show === "both" && isEq ? "eq" : ""}>
                    <span className={rBest ? "best row" : ""}>{P[r][c][0]}</span>,{" "}
                    <span className={cBest ? "best col" : ""}>{P[r][c][1]}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <Controls>
        <button className="btn" onClick={() => setShow("row")}>{params.rowPlayer}'s best replies</button>
        <button className="btn" onClick={() => setShow("col")}>{params.colPlayer}'s best replies</button>
        <button className="btn" onClick={() => setShow("both")}>Both: find equilibria</button>
      </Controls>
      <Readout>
        <Stat label="Pure-strategy equilibria" value={show === "both" ? (eq.length ? eq.map(([r, c]) => `(${params.rowLabels[r]}, ${params.colLabels[c]})`).join(", ") : "none") : "?"} />
      </Readout>
      {params.showMixed && (
        <>
          <Controls>
            <Slider label={`${params.rowPlayer} plays ${params.rowLabels[0]} with probability`} value={p} min={0} max={1} step={0.01} onChange={setP} />
            <Slider label={`${params.colPlayer} plays ${params.colLabels[0]} with probability`} value={q} min={0} max={1} step={0.01} onChange={setQ} />
          </Controls>
          <Readout>
            <Stat label={`${params.rowPlayer}: ${params.rowLabels[0]} vs ${params.rowLabels[1]}`} value={`${fmt(expRow(0), 3)} vs ${fmt(expRow(1), 3)}`} />
            <Stat label={`${params.colPlayer}: ${params.colLabels[0]} vs ${params.colLabels[1]}`} value={`${fmt(expCol(0), 3)} vs ${fmt(expCol(1), 3)}`} />
            <Stat label="Nobody gains by switching?" value={Math.abs(expRow(0) - expRow(1)) < 0.02 && Math.abs(expCol(0) - expCol(1)) < 0.02 ? "Yes: mixed equilibrium" : "No"} />
          </Readout>
        </>
      )}
    </div>
  );
}
