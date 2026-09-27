import { Link } from "react-router-dom";
import { CATALOG } from "../content/catalog";
import { useStore } from "../lib/store";
import { PRICE } from "./Paywall";

export default function Catalogue() {
  const { progress, profile, hasAccess } = useStore();
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
          <p className="note">Your free journey: <Link to={`/j/${profile.freeJourneyId}`}>{CATALOG.find((j) => j.id === profile.freeJourneyId)?.title}</Link>. Further journeys cost {PRICE} each.</p>
        ) : null}
      </section>
      <ul className="cards">
        {CATALOG.map((j) => {
          const done = Object.values(progress[j.id]?.nodes ?? {}).filter((n) => n.state === "mastered" || n.state === "tested-out").length;
          const pct = Math.round((done / j.nodeCount) * 100);
          const started = !!progress[j.id];
          return (
            <li key={j.id}>
              <Link to={`/j/${j.id}`} className="card" style={{ "--accent": j.accent } as React.CSSProperties}>
                <div className="card-top">
                  <span className="chip">{j.field}</span>
                  <span className="year">{j.year}</span>
                </div>
                <h2>{j.title}</h2>
                <p className="card-sub">{j.subtitle}</p>
                <p className="card-meta">
                  {j.authors} · {j.nodeCount} nodes · about {Math.round(j.minutes / 5) * 5} min
                </p>
                <div className="card-foot">
                  <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Journey progress"><span style={{ width: `${pct}%` }} /></div>
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
