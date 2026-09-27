import type { Interactive, Journey } from "./schema";

// Shorthand for authoring step-through diagrams (the `diagram` widget). Coordinates are in a
// 400 × 240 box unless a size is given; boxes, circles and text are positioned by their centre.

type Tone = "default" | "accent" | "muted" | "good" | "bad" | "warn";
type Pt = [number, number];
type El = Record<string, unknown> & { id: string; type: string };

export const box = (id: string, x: number, y: number, label: string, o: { w?: number; h?: number; sub?: string; tone?: Tone } = {}): El => ({ type: "box", id, x, y, label, ...o });
export const circ = (id: string, x: number, y: number, label = "", o: { r?: number; tone?: Tone } = {}): El => ({ type: "circle", id, x, y, label, ...o });
export const txt = (id: string, x: number, y: number, label: string, o: { size?: number; anchor?: "start" | "middle" | "end"; bold?: boolean; tone?: Tone } = {}): El => ({ type: "text", id, x, y, label, ...o });
export const arrow = (id: string, from: string | Pt, to: string | Pt, o: { label?: string; curve?: number; dashed?: boolean; head?: boolean; tone?: Tone } = {}): El => ({ type: "arrow", id, from, to, ...o });
export const line = (id: string, from: string | Pt, to: string | Pt, o: { label?: string; curve?: number; dashed?: boolean; tone?: Tone } = {}): El => ({ type: "arrow", id, from, to, head: false, ...o });
export const path = (id: string, points: Pt[], o: { smooth?: boolean; closed?: boolean; fill?: boolean; dashed?: boolean; width?: number; tone?: Tone } = {}): El => ({ type: "path", id, points, ...o });
export const area = (id: string, x: number, y: number, w: number, h: number, o: { fill?: boolean; tone?: Tone } = {}): El => ({ type: "rect", id, x, y, w, h, ...o });

/** A function curve drawn inside the box [x, y, w, h], for x-values lo..hi and y-values yLo..yHi. */
export function plot(id: string, f: (x: number) => number, lo: number, hi: number, frame: [number, number, number, number], yLo: number, yHi: number, o: { tone?: Tone; width?: number; dashed?: boolean } = {}): El {
  const [x, y, w, h] = frame;
  const pts: Pt[] = Array.from({ length: 49 }, (_, i) => {
    const t = lo + ((hi - lo) * i) / 48;
    const v = Math.max(yLo, Math.min(yHi, f(t)));
    return [Math.round((x + ((t - lo) / (hi - lo)) * w) * 10) / 10, Math.round((y + h - ((v - yLo) / (yHi - yLo)) * h) * 10) / 10];
  });
  return path(id, pts, o);
}

/** Axes for a plot frame, with optional labels. */
export function axes(id: string, frame: [number, number, number, number], xLabel = "", yLabel = ""): El[] {
  const [x, y, w, h] = frame;
  const out = [line(`${id}-x`, [x, y + h], [x + w, y + h]), line(`${id}-y`, [x, y + h], [x, y])];
  if (xLabel) out.push(txt(`${id}-xl`, x + w, y + h + 16, xLabel, { size: 11, anchor: "end", tone: "muted" }));
  if (yLabel) out.push(txt(`${id}-yl`, x - 4, y - 6, yLabel, { size: 11, anchor: "start", tone: "muted" }));
  return out;
}

/** One frame: reveal `show`, highlight `highlight`, remove `hide`, and glide elements to `move` positions. */
export const step = (caption: string, show: string[] = [], highlight: string[] = [], hide: string[] = [], move: Record<string, Pt> = {}) => ({ caption, show, highlight, hide, move });

export function diagram(caption: string, altText: string, elements: El[], steps: ReturnType<typeof step>[], size: [number, number] = [400, 240]): Interactive {
  return { widget: "diagram", caption, altText, params: { width: size[0], height: size[1], elements, steps } };
}

/** The paper node's visual: how the paper builds its argument, section by section. */
export function argumentMap(j: Journey): Interactive {
  const plan = j.readingPlan;
  const rowH = 58;
  const height = 30 + plan.length * rowH;
  const els: El[] = [];
  const steps = plan.map((r, i) => {
    const y = 34 + i * rowH;
    const concepts = r.conceptIds.map((c) => j.nodes.find((n) => n.id === c)?.title).filter(Boolean) as string[];
    els.push(box(`s${i}`, 88, y, r.section, { w: 150, h: 40, tone: i === plan.length - 1 ? "accent" : "default" }));
    const label = concepts.join(" · ");
    els.push(txt(`c${i}`, 172, y + 4, label.length > 38 ? label.slice(0, 36) + "…" : label, { size: 11, anchor: "start", tone: "muted" }));
    if (i > 0) els.push(arrow(`a${i}`, `s${i - 1}`, `s${i}`));
    return step(`${r.section}: ${r.focus.replace(/[*$`]/g, "")}`, i > 0 ? [`s${i}`, `c${i}`, `a${i}`] : [`s${i}`, `c${i}`], [`s${i}`]);
  });
  return diagram(
    "How the paper builds its argument. Step through it, then read the paper in this order.",
    `A chain of ${plan.length} sections of the paper, each labelled with the ideas it uses.`,
    els,
    steps,
    [400, height],
  );
}

/** Attach visuals to lesson sections: { nodeId: { section, visual } }. */
export function withVisuals(j: Journey, visuals: Record<string, { section?: number; visual: Interactive }>): Journey {
  for (const id of Object.keys(visuals)) if (!j.nodes.some((n) => n.id === id)) throw new Error(`${j.id}: visual for unknown node ${id}`);
  return {
    ...j,
    nodes: j.nodes.map((n) => {
      const v = visuals[n.id];
      if (!v) return n;
      const at = v.section ?? 0;
      return { ...n, lesson: n.lesson.map((l, i) => (i === at ? { ...l, visual: v.visual } : l)) };
    }),
  };
}
