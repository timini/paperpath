import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { withJourney } from "../components/WithJourney";
import { completion, depths, levels, nodeStates, previewNodeId } from "../content/graph";
import type { Journey, NodeState } from "../content/schema";
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

function PathView({ journey, states, access, preview }: { journey: Journey; states: Map<string, NodeState>; access: boolean; preview: string }) {
  const lv = levels(journey);
  return (
    <ol className="path">
      {lv.map((level, i) => (
        <li key={i} className="level">
          <div className="level-label">{i === lv.length - 1 ? "Goal" : `Level ${i + 1}`}</div>
          <div className="level-nodes">
            {level.map((n) => {
              const st = states.get(n.id)!;
              const reachable = access || n.id === preview;
              const locked = st === "locked" || !reachable;
              return (
                <Link key={n.id} to={locked && st === "locked" ? "#" : `/j/${journey.id}/n/${n.id}`}
                  onClick={(e) => st === "locked" && e.preventDefault()}
                  className={`pnode s-${st} ${n.kind === "paper" ? "paper" : ""} ${!reachable && st !== "locked" ? "paywalled" : ""}`}
                  aria-disabled={st === "locked"}>
                  <span className="pnode-icon" aria-hidden="true">{ICON[st]}</span>
                  <span className="pnode-body">
                    <span className="pnode-title">{n.title}</span>
                    <span className="pnode-state">
                      {STATE_LABEL[st]}
                      {n.id === preview && !access ? " · free preview" : ""}
                      {!reachable && st !== "locked" ? " · unlock journey" : ""}
                      {" · "}{n.estimatedMinutes} min
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </li>
      ))}
    </ol>
  );
}

function GraphView({ journey, states, onOpen }: { journey: Journey; states: Map<string, NodeState>; onOpen: (id: string) => void }) {
  const d = depths(journey);
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
              <text x={p.x + W / 2} y={p.y + H - 12} className="g-state">{ICON[st]} {STATE_LABEL[st]} · level {d.get(n.id)! + 1}</text>
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
  const [view, setView] = useState<"path" | "graph">(() => (window.innerWidth >= 900 ? "graph" : "path"));
  const [confirm, setConfirm] = useState(false);

  const progress = store.progress[journey.id];
  const states = nodeStates(journey, progress);
  const access = store.hasAccess(journey.id);
  const preview = previewNodeId(journey);
  const pct = Math.round(completion(journey, progress) * 100);
  const next = journey.nodes.find((n) => states.get(n.id) === "in-progress") ?? journey.nodes.find((n) => states.get(n.id) === "available");
  const minutes = journey.nodes.reduce((s, n) => s + n.estimatedMinutes, 0);

  const start = () => {
    if (access) return nav(`/j/${journey.id}/n/${next?.id ?? preview}`);
    if (!store.profile.freeJourneyId) return setConfirm(true);
    nav(`/unlock/${journey.id}`);
  };

  return (
    <div className="wrap" style={{ "--accent": journey.accent } as React.CSSProperties}>
      <nav className="crumbs"><Link to="/">All papers</Link></nav>
      <header className="j-head">
        <span className="chip">{journey.field} · {journey.paper.year}</span>
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
        <p>{pct}% · {journey.nodes.length} nodes · about {Math.round(minutes / 5) * 5} minutes</p>
        <button className="btn primary block" onClick={start}>
          {access ? (pct === 0 ? "Start the journey" : pct === 100 ? "Review" : `Continue: ${next?.title ?? ""}`) : store.profile.freeJourneyId ? "Unlock this journey" : "Start as your free journey"}
        </button>
        {!access && (
          <p className="note">Try the first node, “{journey.nodes.find((n) => n.id === preview)!.title}”, free before you choose.</p>
        )}
      </section>

      {confirm && (
        <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="claim-title">
          <div className="dialog-box">
            <h2 id="claim-title">Make this your free journey?</h2>
            <p>You get one journey free. Further journeys are paid. You can't swap your free journey later.</p>
            <div className="row gap">
              <button className="btn primary" onClick={async () => { await store.claimFree(journey.id); setConfirm(false); nav(`/j/${journey.id}/n/${preview}`); }}>Yes, start it</button>
              <button className="btn ghost" onClick={() => setConfirm(false)}>Not yet</button>
            </div>
          </div>
        </div>
      )}

      <section className="j-map">
        <div className="row between">
          <h2>The map</h2>
          <div className="seg" role="tablist" aria-label="Map view">
            <button role="tab" aria-selected={view === "path"} className={view === "path" ? "on" : ""} onClick={() => setView("path")}>Path</button>
            <button role="tab" aria-selected={view === "graph"} className={view === "graph" ? "on" : ""} onClick={() => setView("graph")}>Graph</button>
          </div>
        </div>
        <p className="note">Pass a node's quiz to unlock the ideas that build on it.</p>
        {view === "path" ? <PathView journey={journey} states={states} access={access} preview={preview} /> : <GraphView journey={journey} states={states} onOpen={(id) => nav(`/j/${journey.id}/n/${id}`)} />}
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
