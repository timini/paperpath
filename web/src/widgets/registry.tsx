import type { ComponentType } from "react";
import type { ZodType } from "zod";
import { BasePairing, ProteinContacts, basePairingSchema, proteinContactsSchema } from "./biology";
import { ComputationGraph, TuringMachine, computationGraphSchema, turingSchema } from "./computation";
import { KeyExchange, ModularArithmetic, keyExchangeSchema, modularSchema } from "./crypto";
import { PayoffMatrix, payoffSchema } from "./games";
import { ChannelNoise, EntropyCalculator, channelSchema, entropySchema } from "./information";
import { AttentionHeatmap, GradientDescent, Neuron, Softmax, VectorDot, attentionSchema, gradientDescentSchema, neuronSchema, softmaxSchema, vectorDotSchema } from "./ml";
import { HubblePlot, LorenzAttractor, Redshift, hubbleSchema, lorenzSchema, redshiftSchema } from "./physics";

interface WidgetDef {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<{ params: any }>;
  schema: ZodType;
  title: string;
}

/**
 * The vetted widget library (SPEC 5.4). Journeys name a widget and supply parameters; the
 * parameters are validated against the widget's schema before rendering, so generated content
 * can only choose from these components.
 */
export const WIDGETS: Record<string, WidgetDef> = {
  "turing-machine": { component: TuringMachine, schema: turingSchema, title: "Turing machine" },
  "computation-graph": { component: ComputationGraph, schema: computationGraphSchema, title: "Computation graph" },
  "entropy-calculator": { component: EntropyCalculator, schema: entropySchema, title: "Entropy calculator" },
  "channel-noise": { component: ChannelNoise, schema: channelSchema, title: "Noisy channel" },
  "base-pairing": { component: BasePairing, schema: basePairingSchema, title: "Base pairing" },
  "protein-contacts": { component: ProteinContacts, schema: proteinContactsSchema, title: "Contact map" },
  "hubble-plot": { component: HubblePlot, schema: hubbleSchema, title: "Distance and velocity" },
  redshift: { component: Redshift, schema: redshiftSchema, title: "Redshift" },
  "lorenz-attractor": { component: LorenzAttractor, schema: lorenzSchema, title: "Lorenz system" },
  "payoff-matrix": { component: PayoffMatrix, schema: payoffSchema, title: "Payoff matrix" },
  "modular-arithmetic": { component: ModularArithmetic, schema: modularSchema, title: "Clock arithmetic" },
  "key-exchange": { component: KeyExchange, schema: keyExchangeSchema, title: "Key exchange" },
  "gradient-descent": { component: GradientDescent, schema: gradientDescentSchema, title: "Gradient descent" },
  neuron: { component: Neuron, schema: neuronSchema, title: "Single unit" },
  softmax: { component: Softmax, schema: softmaxSchema, title: "Softmax" },
  "attention-heatmap": { component: AttentionHeatmap, schema: attentionSchema, title: "Attention weights" },
  "vector-dot": { component: VectorDot, schema: vectorDotSchema, title: "Dot product" },
};

export function parseWidget(widget: string, params: unknown) {
  const def = WIDGETS[widget];
  if (!def) return { ok: false as const, error: `unknown widget "${widget}"` };
  const r = def.schema.safeParse(params);
  return r.success ? { ok: true as const, def, params: r.data } : { ok: false as const, error: r.error.message };
}
