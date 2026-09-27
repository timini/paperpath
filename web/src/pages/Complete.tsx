import { Link } from "react-router-dom";
import { withJourney } from "../components/WithJourney";
import type { Journey } from "../content/schema";
import { completion } from "../content/graph";
import { useStore } from "../lib/store";
import { Inline } from "../components/RichText";

function Complete({ journey }: { journey: Journey }) {
  const { progress } = useStore();
  const p = progress[journey.id];
  const pct = Math.round(completion(journey, p) * 100);
  const firstTry = journey.nodes.filter((n) => p?.nodes[n.id]?.attempts === 1 && ["mastered", "tested-out"].includes(p.nodes[n.id].state)).length;
  return (
    <div className="wrap narrow center" style={{ "--accent": journey.accent } as React.CSSProperties}>
      <div className="trophy" aria-hidden="true">🏆</div>
      <h1>{pct === 100 ? "Paper unlocked" : "Nearly there"}</h1>
      <p>
        {pct === 100
          ? `You've worked through every idea behind "${journey.paper.title}".`
          : `You've completed ${pct}% of this journey.`}
      </p>
      <p>{firstTry} of {journey.nodes.length} nodes passed first time.</p>
      <h2>Now read it</h2>
      <ol className="left">
        {journey.readingPlan.map((r, i) => (
          <li key={i}><strong>{r.section}.</strong> <Inline text={r.focus} /></li>
        ))}
      </ol>
      <a className="btn primary block" href={journey.paper.url} target="_blank" rel="noreferrer">Open the paper</a>
      <Link className="btn block" to="/">Choose another paper</Link>
    </div>
  );
}

export default withJourney(Complete);
