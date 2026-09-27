import type { Journey } from "../schema";
import turing from "./turing";
import shannon from "./shannon";
import watsonCrick from "./watson-crick";
import hubble from "./hubble";

export const JOURNEYS: Journey[] = [turing, hubble, shannon, watsonCrick];

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
