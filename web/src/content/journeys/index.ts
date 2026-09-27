import type { Journey } from "../schema";
import turing from "./turing";

export const JOURNEYS: Journey[] = [turing];

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
