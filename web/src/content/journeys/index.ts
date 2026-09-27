import type { Journey } from "../schema";
import turing from "./turing";
import shannon from "./shannon";
import watsonCrick from "./watson-crick";
import hubble from "./hubble";
import nash from "./nash";
import lorenz from "./lorenz";

export const JOURNEYS: Journey[] = [turing, hubble, shannon, nash, watsonCrick, lorenz];

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
