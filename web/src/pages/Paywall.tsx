import { Link, useParams } from "react-router-dom";
import { getJourney } from "../content/journeys";
import { previewNodeId } from "../content/graph";
import { useStore } from "../lib/store";
import NotFound from "./NotFound";

export const PRICE = "£4.99";

export default function Paywall() {
  const { journeyId = "" } = useParams();
  const journey = getJourney(journeyId);
  const { profile, hasAccess } = useStore();
  if (!journey) return <NotFound />;
  const free = profile.freeJourneyId ? getJourney(profile.freeJourneyId) : undefined;
  return (
    <div className="wrap narrow" style={{ "--accent": journey.accent } as React.CSSProperties}>
      <nav className="crumbs"><Link to={`/j/${journey.id}`}>← {journey.title}</Link></nav>
      <h1>Unlock {journey.title}</h1>
      {hasAccess(journey.id) ? (
        <p>You already have this journey. <Link to={`/j/${journey.id}`}>Go to the map</Link>.</p>
      ) : (
        <>
          <div className="price-card">
            <p className="price">{PRICE}</p>
            <p>One-off payment. Every node, quiz and interactive in this journey, yours to keep.</p>
            <button className="btn primary block" disabled>Payments open soon</button>
          </div>
          {free ? (
            <p>Your free journey is <Link to={`/j/${free.id}`}>{free.title}</Link>.</p>
          ) : (
            <p>You haven't used your free journey yet. <Link to={`/j/${journey.id}`}>Start this one free</Link>.</p>
          )}
          <p className="note">
            You can still try <Link to={`/j/${journey.id}/n/${previewNodeId(journey)}`}>the first node</Link> of this journey for free.
          </p>
        </>
      )}
    </div>
  );
}
