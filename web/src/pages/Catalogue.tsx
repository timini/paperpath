import { Link } from "react-router-dom";
import { JOURNEYS } from "../content/journeys";
import { completion } from "../content/graph";
import { useStore } from "../lib/store";
import { PRICE } from "./Paywall";

export default function Catalogue() {
  const { progress, profile, hasAccess } = useStore();
  const minutes = (id: string) => JOURNEYS.find((j) => j.id === id)!.nodes.reduce((s, n) => s + n.estimatedMinutes, 0);
  return (
    <div className="wrap">
      <section className="hero">
        <h1>Understand the papers that changed the world</h1>
        <p>
          Each journey maps the ideas a landmark paper depends on, teaches only what that paper needs, and lets you
          prove it with a quiz before moving on. Your first journey is free.
        </p>
        <ol className="how">
          <li><strong>Pick a paper.</strong> See the map of ideas behind it.</li>
          <li><strong>Learn one node at a time.</strong> Short lessons with something to play with.</li>
          <li><strong>Pass the quiz</strong> to unlock what comes next, until the paper makes sense.</li>
        </ol>
        {profile.freeJourneyId ? (
          <p className="note">Your free journey: <Link to={`/j/${profile.freeJourneyId}`}>{JOURNEYS.find((j) => j.id === profile.freeJourneyId)?.title}</Link>. Further journeys cost {PRICE} each.</p>
        ) : null}
      </section>
      <ul className="cards">
        {JOURNEYS.map((j) => {
          const pct = Math.round(completion(j, progress[j.id]) * 100);
          const started = !!progress[j.id];
          return (
            <li key={j.id}>
              <Link to={`/j/${j.id}`} className="card" style={{ "--accent": j.accent } as React.CSSProperties}>
                <div className="card-top">
                  <span className="chip">{j.field}</span>
                  <span className="year">{j.paper.year}</span>
                </div>
                <h2>{j.title}</h2>
                <p className="card-sub">{j.subtitle}</p>
                <p className="card-meta">
                  {j.paper.authors.length > 2 ? `${j.paper.authors[0]} et al.` : j.paper.authors.join(" and ")} · {j.nodes.length} nodes · about {Math.round(minutes(j.id) / 5) * 5} min
                </p>
                <div className="card-foot">
                  <div className="progress" aria-label={`${pct}% complete`}><span style={{ width: `${pct}%` }} /></div>
                  <span className="card-status">
                    {hasAccess(j.id) ? (pct === 100 ? "Paper unlocked" : started ? `${pct}% done` : "Unlocked") : profile.freeJourneyId ? PRICE : "Free to start"}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
