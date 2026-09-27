import type { Journey } from "../schema";
import hubble from "./hubble";
import turing from "./turing";
import shannon from "./shannon";
import nash from "./nash";
import watsonCrick from "./watson-crick";
import lorenz from "./lorenz";
import diffieHellman from "./diffie-hellman";
import backprop from "./backprop";
import transformer from "./transformer";
import alphafold from "./alphafold";

/** The ten launch journeys (docs/SPEC.md section 10), in publication order. */
export const JOURNEYS: Journey[] = [hubble, turing, shannon, nash, watsonCrick, lorenz, diffieHellman, backprop, transformer, alphafold];

export function getJourney(id: string): Journey | undefined {
  return JOURNEYS.find((j) => j.id === id);
}
