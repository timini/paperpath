import { Link } from "react-router-dom";
import { CATALOG } from "../content/catalog";
import { useStore } from "../lib/store";
import { PRICE } from "./Create";

export default function Catalogue() {
  const { progress } = useStore();
  return (
    <div className="wrap">
      <section className="hero">
        <h1>Understand the papers that changed the world</h1>
        <p>
          Each journey maps the ideas a landmark paper depends on, teaches only what that paper needs, and lets you
          prove it with a quiz before moving on. All ten journeys are free.
        </p>
        <ol className="how">
          <li><strong>Pick a paper.</strong> See the map of ideas behind it.</li>
          <li><strong>Learn one step at a time.</strong> Short lessons, each with a diagram or something to play with.</li>
          <li><strong>Pass the quiz</strong> to unlock what comes next, until the paper makes sense.</li>
        </ol>
        <Link to="/create" className="create-cta">
          <strong>Reading a different paper?</strong> Get a journey made for it: {PRICE} per paper →
        </Link>
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
                  {j.authors} · {j.nodeCount} steps · about {Math.round(j.minutes / 5) * 5} min
                </p>
                <div className="card-foot">
                  <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Journey progress"><span style={{ width: `${pct}%` }} /></div>
                  <span className="card-status">
                    {pct === 100 ? "Paper unlocked" : started ? `${pct}% done` : "Free"}
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
