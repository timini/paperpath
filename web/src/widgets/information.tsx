import { useMemo, useState } from "react";
import { z } from "zod";
import { Controls, Readout, Slider, Stat, fmt } from "./common";

/* ---------- entropy-calculator ---------- */

export const entropySchema = z.object({
  labels: z.array(z.string()).min(2).max(6),
  weights: z.array(z.number().nonnegative()).min(2).max(6),
});

export function entropyBits(p: number[]): number {
  return -p.reduce((s, x) => (x > 0 ? s + x * Math.log2(x) : s), 0);
}

export function EntropyCalculator({ params }: { params: z.infer<typeof entropySchema> }) {
  const [w, setW] = useState(params.weights);
  const total = w.reduce((a, b) => a + b, 0) || 1;
  const p = w.map((x) => x / total);
  const H = entropyBits(p);
  const max = Math.log2(p.length);
  return (
    <div>
      <div className="w-bars" role="img" aria-label={`Probabilities ${p.map((x, i) => `${params.labels[i]} ${fmt(x, 2)}`).join(", ")}`}>
        {p.map((x, i) => (
          <div key={i} className="w-bar">
            <div className="w-bar-fill" style={{ height: `${x * 100}%` }} />
            <span>{params.labels[i]}</span>
            <small>{fmt(x, 2)}</small>
          </div>
        ))}
      </div>
      <Controls>
        {w.map((x, i) => (
          <Slider key={i} label={`Weight of ${params.labels[i]}`} value={x} min={0} max={10} step={0.1}
            onChange={(v) => setW((old) => old.map((o, j) => (j === i ? v : o)))} />
        ))}
      </Controls>
      <Readout>
        <Stat label="Entropy H" value={`${fmt(H)} bits`} />
        <Stat label="Maximum (all equal)" value={`${fmt(max)} bits`} />
      </Readout>
    </div>
  );
}

/* ---------- channel-noise ---------- */

export const channelSchema = z.object({
  message: z.string().regex(/^[01]+$/),
  flipProbability: z.number().min(0).max(0.5),
});

function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

export function ChannelNoise({ params }: { params: z.infer<typeof channelSchema> }) {
  const [p, setP] = useState(params.flipProbability);
  const [repeat, setRepeat] = useState(false);
  const [seed, setSeed] = useState(7);
  const bits = params.message.split("").map(Number);

  const sim = useMemo(() => {
    const r = rng(seed);
    const n = repeat ? 3 : 1;
    const received: number[] = [];
    const decoded = bits.map((b) => {
      const copies = Array.from({ length: n }, () => (r() < p ? 1 - b : b));
      received.push(...copies);
      return copies.reduce((a, c) => a + c, 0) * 2 > n ? 1 : 0;
    });
    const errors = decoded.filter((d, i) => d !== bits[i]).length;
    const theory = repeat ? 3 * p * p * (1 - p) + p ** 3 : p;
    return { received, decoded, errors, theory, sent: n * bits.length };
  }, [bits, p, repeat, seed]);

  const capacity = 1 - (p > 0 && p < 1 ? -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p)) : 0);

  return (
    <div>
      <div className="w-row-label">Sent</div>
      <div className="w-bits">{bits.map((b, i) => <span key={i} className="w-bit">{b}</span>)}</div>
      <div className="w-row-label">Received{repeat ? " (each bit sent 3 times)" : ""}</div>
      <div className="w-bits">
        {sim.received.map((b, i) => {
          const orig = bits[Math.floor(i / (repeat ? 3 : 1))];
          return <span key={i} className={b !== orig ? "w-bit flip" : "w-bit"}>{b}</span>;
        })}
      </div>
      {repeat && (
        <>
          <div className="w-row-label">Decoded by majority vote</div>
          <div className="w-bits">
            {sim.decoded.map((b, i) => <span key={i} className={b !== bits[i] ? "w-bit flip" : "w-bit"}>{b}</span>)}
          </div>
        </>
      )}
      <Controls>
        <Slider label="Flip probability p" value={p} min={0} max={0.5} step={0.01} onChange={setP} />
        <label className="w-check">
          <input type="checkbox" checked={repeat} onChange={(e) => setRepeat(e.target.checked)} /> Repetition code (send each bit 3 times)
        </label>
        <button className="btn ghost" onClick={() => setSeed((s) => s + 1)}>Send again</button>
      </Controls>
      <Readout>
        <Stat label="Wrong bits after decoding" value={`${sim.errors} of ${bits.length}`} />
        <Stat label="Expected error rate per bit" value={fmt(sim.theory, 2)} />
        <Stat label="Bits used per message bit" value={repeat ? "3" : "1"} />
        <Stat label="Channel capacity 1 − H(p)" value={`${fmt(capacity, 2)} bits per use`} />
      </Readout>
    </div>
  );
}
