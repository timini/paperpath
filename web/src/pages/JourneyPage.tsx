import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { withJourney } from "../components/WithJourney";
import { completion, levels, nodeStates, prerequisites, recommendedOrder } from "../content/graph";
import type { Journey, JourneyNode, NodeState } from "../content/schema";
import { useStore } from "../lib/store";
import { Inline, RichText } from "../components/RichText";

const STATE_LABEL: Record<NodeState, string> = {
  locked: "Locked",
  available: "Ready",
  "in-progress": "In progress",
  mastered: "Mastered",
  "tested-out": "Tested out",
};
const ICON: Record<NodeState, string> = { locked: "🔒", available: "●", "in-progress": "◐", mastered: "✓", "tested-out": "⚡" };

function PathView({ journey, states, order, next }: { journey: Journey; states: Map<string, NodeState>; order: JourneyNode[]; next?: string }) {
  const stepOf = new Map(order.map((n, i) => [n.id, i + 1]));
  const pre = prerequisites(journey);
  return (
    <ol className="steps">
      {order.map((n, i) => {
        const st = states.get(n.id)!;
        const waiting = (pre.get(n.id) ?? []).filter((p) => !["mastered", "tested-out"].includes(states.get(p)!)).map((p) => stepOf.get(p));
        const isNext = n.id === next;
        return (
          <li key={n.id} className={`step s-${st} ${isNext ? "next" : ""} ${n.kind === "paper" ? "paper" : ""}`}>
            <span className="step-num" aria-hidden="true">{st === "mastered" || st === "tested-out" ? "✓" : i + 1}</span>
            <Link to={st === "locked" ? "#" : `/j/${journey.id}/n/${n.id}`} onClick={(e) => st === "locked" && e.preventDefault()} aria-disabled={st === "locked"} className="step-card">
              {isNext && <span className="step-next">Next up</span>}
              <span className="step-title"><span className="sr-only">Step {i + 1}: </span>{n.title}</span>
              <span className="step-meta">
                {STATE_LABEL[st]}
                {st === "locked" && waiting.length ? ` · after step${waiting.length > 1 ? "s" : ""} ${waiting.join(" and ")}` : ""}
                {" · "}{n.estimatedMinutes} min
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function GraphView({ journey, states, order, onOpen }: { journey: Journey; states: Map<string, NodeState>; order: JourneyNode[]; onOpen: (id: string) => void }) {
  const stepOf = new Map(order.map((n, i) => [n.id, i + 1]));
  const lv = levels(journey);
  const W = 190, H = 96, gapX = 24, gapY = 56;
  const widest = Math.max(...lv.map((l) => l.length));
  const width = widest * (W + gapX) + gapX;
  const height = lv.length * (H + gapY) + gapY;
  const pos = new Map<string, { x: number; y: number }>();
  lv.forEach((level, li) => {
    const offset = (width - level.length * (W + gapX) + gapX) / 2;
    level.forEach((n, i) => pos.set(n.id, { x: offset + i * (W + gapX), y: height - (li + 1) * (H + gapY) }));
  });
  const words = (t: string) => {
    const out: string[] = [""];
    for (const w of t.split(" ")) {
      if ((out[out.length - 1] + " " + w).trim().length > 22 && out.length < 3) out.push(w);
      else out[out.length - 1] = (out[out.length - 1] + " " + w).trim();
    }
    return out;
  };
  return (
    <div className="graph-scroll">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} className="graph" role="img" aria-label={`Graph of ${journey.nodes.length} ideas leading to the paper`}>
        {journey.edges.map((e) => {
          const a = pos.get(e.from)!, b = pos.get(e.to)!;
          const x1 = a.x + W / 2, y1 = a.y, x2 = b.x + W / 2, y2 = b.y + H;
          return <path key={e.from + e.to} d={`M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`} className="g-edge" />;
        })}
        {journey.nodes.map((n) => {
          const p = pos.get(n.id)!;
          const st = states.get(n.id)!;
          return (
            <g key={n.id} className={st === "locked" ? "g-link locked" : "g-link"} role="link" tabIndex={st === "locked" ? -1 : 0}
              aria-label={`${n.title}: ${STATE_LABEL[st]}`}
              onClick={() => st !== "locked" && onOpen(n.id)}
              onKeyDown={(e) => e.key === "Enter" && st !== "locked" && onOpen(n.id)}>
              <rect x={p.x} y={p.y} width={W} height={H} rx={14} className={`g-node s-${st} ${n.kind}`} />
              {words(n.title).map((w, i) => (
                <text key={i} x={p.x + W / 2} y={p.y + 30 + i * 18} className="g-title">{w}</text>
              ))}
              <text x={p.x + W / 2} y={p.y + H - 12} className="g-state">Step {stepOf.get(n.id)} · {ICON[st]} {STATE_LABEL[st]}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function JourneyPage({ journey }: { journey: Journey }) {
  const store = useStore();
  const nav = useNavigate();
  const [view, setView] = useState<"path" | "graph">("path");

  const progress = store.progress[journey.id];
  const states = nodeStates(journey, progress);
  const order = recommendedOrder(journey);
  const pct = Math.round(completion(journey, progress) * 100);
  const next = order.find((n) => states.get(n.id) === "in-progress") ?? order.find((n) => states.get(n.id) === "available");
  const minutes = journey.nodes.reduce((s, n) => s + n.estimatedMinutes, 0);
  const nextStep = next ? order.indexOf(next) + 1 : 0;

  return (
    <div className="wrap" style={{ "--accent": journey.accent } as React.CSSProperties}>
      <nav className="crumbs"><Link to="/">All papers</Link></nav>
      <header className="j-head">
        <span className="chip">{journey.field} · {journey.paper.year} · free</span>
        <h1>{journey.title}</h1>
        <p className="j-sub">{journey.subtitle}</p>
        <p className="j-paper">
          <a href={journey.paper.url} target="_blank" rel="noreferrer">{journey.paper.title}</a>. {journey.paper.authors.join(", ")}. <em>{journey.paper.venue}</em>, {journey.paper.year}.
        </p>
      </header>

      <section className="j-summary">
        <RichText text={journey.summary} />
        <h2>Why it matters</h2>
        <RichText text={journey.whyItMatters} />
      </section>

      <section className="j-progress">
        <div className="progress big" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Journey progress"><span style={{ width: `${pct}%` }} /></div>
        <p>{pct}% · {journey.nodes.length} steps · about {Math.round(minutes / 5) * 5} minutes</p>
        {next ? (
          <button className="btn primary block" onClick={() => nav(`/j/${journey.id}/n/${next.id}`)}>
            {pct === 0 ? "Start with step 1" : `Continue with step ${nextStep}: ${next.title}`}
          </button>
        ) : (
          <button className="btn primary block" onClick={() => nav(`/j/${journey.id}/done`)}>Paper unlocked: see your reading plan</button>
        )}
      </section>

      <section className="j-map">
        <div className="row between">
          <h2>The map</h2>
          <div className="seg" role="tablist" aria-label="Map view">
            <button role="tab" aria-selected={view === "path"} className={view === "path" ? "on" : ""} onClick={() => setView("path")}>Path</button>
            <button role="tab" aria-selected={view === "graph"} className={view === "graph" ? "on" : ""} onClick={() => setView("graph")}>Graph</button>
          </div>
        </div>
        <p className="note">Work through the steps in order. Passing a step's quiz unlocks the steps that build on it; the graph shows how the ideas connect.</p>
        {view === "path" ? <PathView journey={journey} states={states} order={order} next={next?.id} /> : <GraphView journey={journey} states={states} order={order} onOpen={(id) => nav(`/j/${journey.id}/n/${id}`)} />}
      </section>

      <section className="j-plan">
        <h2>Reading plan for the paper</h2>
        <ol>
          {journey.readingPlan.map((r, i) => (
            <li key={i}>
              <strong>{r.section}.</strong> <Inline text={r.focus} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

export default withJourney(JourneyPage);
