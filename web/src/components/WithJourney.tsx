import type { ComponentType } from "react";
import { useParams } from "react-router-dom";
import { useJourney } from "../content/load";
import type { Journey } from "../content/schema";
import NotFound from "../pages/NotFound";

/** Load the route's journey, then render the page with it. */
export function withJourney(Page: ComponentType<{ journey: Journey }>) {
  return function JourneyRoute() {
    const { journeyId = "" } = useParams();
    const state = useJourney(journeyId);
    if (state.status === "missing") return <NotFound />;
    if (state.status === "loading") return <div className="wrap narrow"><p className="note">Loading…</p></div>;
    return <Page key={state.journey.id} journey={state.journey} />;
  };
}
