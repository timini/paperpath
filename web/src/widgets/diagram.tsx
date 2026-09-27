import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { prefersReducedMotion } from "./common";

/*
 * Step-through explanatory diagram. Content supplies shapes and a sequence of steps; each step
 * reveals shapes, highlights some, and shows a caption. Declarative, so authors (and later the
 * generator) describe a picture as data rather than code.
 */

const tone = z.enum(["default", "accent", "muted", "good", "bad", "warn"]).default("default");
const point = z.tuple([z.number(), z.number()]);

const element = z.discriminatedUnion("type", [
  z.object({ type: z.literal("box"), id: z.string(), x: z.number(), y: z.number(), w: z.number().default(110), h: z.number().default(44), label: z.string(), sub: z.string().optional(), tone }),
  z.object({ type: z.literal("circle"), id: z.string(), x: z.number(), y: z.number(), r: z.number().default(22), label: z.string().default(""), tone }),
  z.object({ type: z.literal("text"), id: z.string(), x: z.number(), y: z.number(), label: z.string(), size: z.number().default(13), anchor: z.enum(["start", "middle", "end"]).default("middle"), bold: z.boolean().default(false), tone }),
  z.object({ type: z.literal("arrow"), id: z.string(), from: z.union([z.string(), point]), to: z.union([z.string(), point]), label: z.string().optional(), curve: z.number().default(0), dashed: z.boolean().default(false), head: z.boolean().default(true), tone }),
  z.object({ type: z.literal("path"), id: z.string(), points: z.array(point).min(2), smooth: z.boolean().default(false), closed: z.boolean().default(false), fill: z.boolean().default(false), dashed: z.boolean().default(false), width: z.number().default(2), tone }),
  z.object({ type: z.literal("rect"), id: z.string(), x: z.number(), y: z.number(), w: z.number(), h: z.number(), fill: z.boolean().default(true), tone }),
]);

export const diagramSchema = z.object({
  width: z.number().default(400),
  height: z.number().default(240),
  elements: z.array(element).min(1),
  steps: z
    .array(
      z.object({
        caption: z.string(),
        show: z.array(z.string()).default([]),
        highlight: z.array(z.string()).default([]),
        hide: z.array(z.string()).default([]),
        // Glide boxes, circles, text and areas to new positions (by id) at this step.
        move: z.record(z.string(), point).default({}),
      }),
    )
    .min(1),
});

type El = z.infer<typeof element>;
type Params = z.infer<typeof diagramSchema>;

function centre(e: El | undefined): [number, number] | null {
  if (!e) return null;
  if (e.type === "box" || e.type === "circle" || e.type === "text") return [e.x, e.y];
  if (e.type === "rect") return [e.x + e.w / 2, e.y + e.h / 2];
  return null;
}

/** Point on the edge of an element in the direction of (tx, ty), so arrows stop at borders. */
function edge(e: El | undefined, p: [number, number], tx: number, ty: number): [number, number] {
  if (!e) return p;
  const dx = tx - p[0], dy = ty - p[1];
  const len = Math.hypot(dx, dy) || 1;
  if (e.type === "circle") return [p[0] + (dx / len) * (e.r + 3), p[1] + (dy / len) * (e.r + 3)];
  if (e.type === "box" || e.type === "rect") {
    const hw = e.w / 2 + 3, hh = e.h / 2 + 3;
    const s = Math.min(hw / Math.abs(dx || 1e-9), hh / Math.abs(dy || 1e-9));
    return [p[0] + dx * s, p[1] + dy * s];
  }
  if (e.type === "text") return [p[0] + (dx / len) * 12, p[1] + (dy / len) * 12];
  return p;
}

function wrap(label: string, max: number): string[] {
  const words = label.split(" ");
  const lines: string[] = [""];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if (cur && (cur + " " + w).length > max) lines.push(w);
    else lines[lines.length - 1] = cur ? cur + " " + w : w;
  }
  return lines;
}

export function Diagram({ params }: { params: Params }) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = params.steps.length - 1;
  const ref = useRef<HTMLDivElement>(null);

  // Start playing the first time the diagram scrolls into view, like a video that begins
  // when you reach it. Reduced-motion users step manually.
  useEffect(() => {
    const el = ref.current;
    if (!el || last === 0 || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPlaying(true);
        io.disconnect();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [last]);

  // Positions after applying every move up to this step.
  const moved = new Map<string, [number, number]>();
  for (let i = 0; i <= step; i++) for (const [id, p] of Object.entries(params.steps[i].move)) moved.set(id, p);
  const byId = new Map(
    params.elements.map((e) => {
      const m = moved.get(e.id);
      return [e.id, m && "x" in e ? ({ ...e, x: m[0], y: m[1] } as El) : e];
    }),
  );

  // Everything shown up to and including this step, minus anything hidden since.
  const visible = new Set<string>();
  for (let i = 0; i <= step; i++) {
    params.steps[i].show.forEach((id) => visible.add(id));
    params.steps[i].hide.forEach((id) => visible.delete(id));
  }
  // Elements never mentioned in any step are always visible (background).
  const mentioned = new Set(params.steps.flatMap((s) => [...s.show, ...s.hide]));
  params.elements.forEach((e) => !mentioned.has(e.id) && visible.add(e.id));
  const hi = new Set(params.steps[step].highlight);
  const fresh = new Set(params.steps[step].show);

  useEffect(() => {
    if (!playing) return;
    if (step >= last) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => Math.min(last, s + 1)), prefersReducedMotion() ? 3000 : 2400);
    return () => clearTimeout(t);
  }, [playing, step, last]);

  const cls = (e: El) =>
    `dg dg-${e.type} t-${e.tone} ${visible.has(e.id) ? "on" : "off"} ${hi.has(e.id) ? "hi" : ""} ${fresh.has(e.id) && step > 0 ? "fresh" : ""}`;

  const render = (e0: El) => {
    const e = byId.get(e0.id)!;
    const at = (x: number, y: number, children: React.ReactNode) => (
      <g key={e.id} className="dg-pos" style={{ transform: `translate(${x}px, ${y}px)` }}>
        <g className={cls(e)}>{children}</g>
      </g>
    );
    switch (e.type) {
      case "rect":
        return at(e.x, e.y, <rect className={e.fill ? "" : "nofill"} x={0} y={0} width={e.w} height={e.h} rx={8} />);
      case "box": {
        const lines = wrap(e.label, Math.max(6, Math.floor(e.w / 7.5)));
        const top = -((lines.length - 1) * 15) / 2 - (e.sub ? 7 : 0);
        return at(
          e.x,
          e.y,
          <>
            <rect x={-e.w / 2} y={-e.h / 2} width={e.w} height={e.h} rx={10} />
            {lines.map((l, i) => <text key={i} x={0} y={top + i * 15 + 4.5} className="dg-label">{l}</text>)}
            {e.sub && <text x={0} y={top + lines.length * 15 + 3} className="dg-sub">{e.sub}</text>}
          </>,
        );
      }
      case "circle":
        return at(
          e.x,
          e.y,
          <>
            <circle cx={0} cy={0} r={e.r} />
            {e.label && <text x={0} y={4.5} className="dg-label">{e.label}</text>}
          </>,
        );
      case "text":
        return at(
          e.x,
          e.y,
          <text className="dg-textfill" x={0} y={0} textAnchor={e.anchor} style={{ fontSize: e.size * 1.12, fontWeight: e.bold ? 700 : 500 }}>
            {e.label}
          </text>,
        );
      case "path": {
        const pts = e.points;
        const d = e.smooth && pts.length > 2
          ? pts.reduce((acc, p, i) => {
              if (i === 0) return `M${p[0]},${p[1]}`;
              const prev = pts[i - 1];
              const mx = (prev[0] + p[0]) / 2;
              return `${acc} C${mx},${prev[1]} ${mx},${p[1]} ${p[0]},${p[1]}`;
            }, "")
          : `M${pts.map((p) => p.join(",")).join(" L")}${e.closed ? " Z" : ""}`;
        return <path key={e.id} className={cls(e) + (e.fill ? " filled" : "") + (e.dashed ? " dashed" : "")} d={d} style={{ strokeWidth: e.width }} />;
      }
      case "arrow": {
        const fromEl = typeof e.from === "string" ? byId.get(e.from) : undefined;
        const toEl = typeof e.to === "string" ? byId.get(e.to) : undefined;
        const a = typeof e.from === "string" ? centre(fromEl) : e.from;
        const b = typeof e.to === "string" ? centre(toEl) : e.to;
        if (!a || !b) return null;
        const s = edge(fromEl, a, b[0], b[1]);
        const t = edge(toEl, b, a[0], a[1]);
        const mx = (s[0] + t[0]) / 2, my = (s[1] + t[1]) / 2;
        const nx = -(t[1] - s[1]), ny = t[0] - s[0];
        const nl = Math.hypot(nx, ny) || 1;
        const cx = mx + (nx / nl) * e.curve, cy = my + (ny / nl) * e.curve;
        const d = e.curve ? `M${s[0]},${s[1]} Q${cx},${cy} ${t[0]},${t[1]}` : `M${s[0]},${s[1]} L${t[0]},${t[1]}`;
        const lx = e.curve ? (s[0] + 2 * cx + t[0]) / 4 : mx, ly = e.curve ? (s[1] + 2 * cy + t[1]) / 4 : my;
        return (
          <g key={e.id} className={cls(e)}>
            <path d={d} className={e.dashed ? "dashed" : ""} style={{ d: `path("${d}")` } as React.CSSProperties} markerEnd={e.head ? `url(#dg-head-${e.tone})` : undefined} />
            {e.label && <text x={lx} y={ly - 6} className="dg-arrow-label">{e.label}</text>}
          </g>
        );
      }
    }
  };

  // Draw areas and paths first, then arrows, then shapes and text on top.
  const order = (e: El) => (e.type === "rect" ? 0 : e.type === "path" ? 1 : e.type === "arrow" ? 2 : 3);
  const sorted = [...params.elements].sort((a, b) => order(a) - order(b));

  return (
    <div className="dg-wrap" ref={ref}>
      <svg viewBox={`0 0 ${params.width} ${params.height}`} className="w-svg dg-svg" role="img" aria-label={params.steps[step].caption}>
        <defs>
          {(["default", "accent", "muted", "good", "bad", "warn"] as const).map((t) => (
            <marker key={t} id={`dg-head-${t}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" className={`dg-headfill t-${t}`} />
            </marker>
          ))}
        </defs>
        {sorted.map(render)}
      </svg>
      <p className="dg-caption" aria-live="polite">
        {params.steps.length > 1 && <span className="dg-count">{step + 1}/{params.steps.length}</span>}
        {params.steps[step].caption}
      </p>
      {params.steps.length > 1 && (
        <div className="dg-controls">
          <button className="btn" onClick={() => { setPlaying(false); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0} aria-label="Previous step">←</button>
          <div className="dg-dots" role="tablist" aria-label="Steps">
            {params.steps.map((_, i) => (
              <button key={i} role="tab" aria-selected={i === step} aria-label={`Step ${i + 1}`} className={i === step ? "on" : i < step ? "done" : ""} onClick={() => { setPlaying(false); setStep(i); }} />
            ))}
          </div>
          <button className="btn primary" onClick={() => { setPlaying(false); setStep((s) => Math.min(last, s + 1)); }} disabled={step === last} aria-label="Next step">→</button>
          <button className="btn ghost" onClick={() => { if (step === last) setStep(0); setPlaying((p) => !p || step === last); }}>
            {playing ? "Pause" : step === last ? "Replay" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
}
