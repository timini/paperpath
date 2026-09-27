import { JOURNEYS } from "../content/journeys";
import Widget from "../components/Widget";
import { WIDGETS } from "../widgets/registry";

/** Development page: every widget used in the catalogue, with its real parameters. */
export default function WidgetGallery() {
  const used = JOURNEYS.flatMap((j) => j.nodes.filter((n) => n.interactive).map((n) => ({ j, n })));
  const unused = Object.keys(WIDGETS).filter((w) => !used.some((u) => u.n.interactive!.widget === w));
  return (
    <div className="wrap narrow">
      <h1>Widget gallery</h1>
      <p className="note">{used.length} interactives across {JOURNEYS.length} journeys. Unused widgets: {unused.join(", ") || "none"}.</p>
      {used.map(({ j, n }) => (
        <section key={j.id + n.id} className="lesson">
          <h2>{WIDGETS[n.interactive!.widget]?.title ?? n.interactive!.widget}: {n.title}</h2>
          <p className="note">{j.title}</p>
          <Widget spec={n.interactive!} />
        </section>
      ))}
    </div>
  );
}
