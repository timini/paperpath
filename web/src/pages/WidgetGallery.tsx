import { useEffect, useState } from "react";
import { CATALOG } from "../content/catalog";
import { loadJourney } from "../content/load";
import type { Journey } from "../content/schema";
import Widget from "../components/Widget";
import { argumentMap } from "../content/diagram";
import { WIDGETS } from "../widgets/registry";

/** Development page: every widget used in the catalogue, with its real parameters. */
export default function WidgetGallery() {
  const [journeys, setJourneys] = useState<Journey[] | null>(null);
  useEffect(() => {
    const only = new URLSearchParams(location.search).get("journey");
    Promise.all(CATALOG.filter((c) => !only || c.id === only).map((c) => loadJourney(c.id))).then((js) => setJourneys(js.filter((j): j is Journey => !!j)));
  }, []);
  if (!journeys) return <div className="wrap narrow"><p className="note">Loading…</p></div>;
  const used = journeys.flatMap((j) =>
    j.nodes.flatMap((n) => [
      ...n.lesson.filter((l) => l.visual).map((l) => ({ j, n, spec: l.visual! })),
      ...(n.interactive ? [{ j, n, spec: n.interactive }] : []),
      ...(n.kind === "paper" ? [{ j, n, spec: argumentMap(j) }] : []),
    ]),
  );
  const unused = Object.keys(WIDGETS).filter((w) => !used.some((u) => u.spec.widget === w));
  return (
    <div className="wrap narrow">
      <h1>Widget gallery</h1>
      <p className="note">{used.length} visuals across {journeys.length} journeys. Unused widgets: {unused.join(", ") || "none"}.</p>
      {used.map(({ j, n, spec }, i) => (
        <section key={j.id + n.id + i} className="lesson" data-node={`${j.id}/${n.id}`}>
          <h2>{WIDGETS[spec.widget]?.title ?? spec.widget}: {n.title}</h2>
          <p className="note">{j.title}</p>
          <Widget spec={spec} />
        </section>
      ))}
    </div>
  );
}
