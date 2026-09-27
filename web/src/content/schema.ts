import { z } from "zod";

// Content data model. Mirrors docs/SPEC.md section 9.1. Curated journeys and, later,
// generated journeys must both pass these schemas before they reach a learner.

const text = z.string().min(1);

export const optionSchema = z.object({
  id: text,
  text: text,
  correct: z.boolean(),
  feedback: text,
});

const questionBase = {
  id: text,
  prompt: text,
  explanation: text,
  tag: z.enum(["recall", "application", "paper-link"]),
};

export const questionSchema = z.discriminatedUnion("type", [
  z.object({ ...questionBase, type: z.literal("single"), options: z.array(optionSchema).min(2) }),
  z.object({ ...questionBase, type: z.literal("multi"), options: z.array(optionSchema).min(3) }),
  z.object({
    ...questionBase,
    type: z.literal("numeric"),
    answer: z.number(),
    tolerance: z.number().min(0),
    unit: z.string().optional(),
  }),
  z.object({
    ...questionBase,
    type: z.literal("order"),
    items: z.array(z.object({ id: text, text: text })).min(3),
    correctOrder: z.array(text),
  }),
]);

export const interactiveSchema = z.object({
  widget: text,
  params: z.record(z.string(), z.unknown()),
  caption: text,
  altText: text,
});

export const nodeSchema = z.object({
  id: text,
  conceptId: text,
  title: text,
  kind: z.enum(["concept", "paper"]),
  whyYouNeedThis: text,
  lesson: z.array(z.object({ heading: text, body: text, visual: interactiveSchema.optional() })).min(1),
  whatWeSkip: z.string(),
  interactive: interactiveSchema.optional(),
  workedExample: z
    .object({ prompt: text, steps: z.array(text).min(1), answer: text })
    .optional(),
  inThePaper: z.object({ text: text, sections: z.array(z.string()) }),
  quiz: z.object({
    passMark: z.number().min(0.5).max(1),
    questions: z.array(questionSchema).min(3).max(6),
  }),
  estimatedMinutes: z.number().int().positive(),
});

export const journeySchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: text,
  subtitle: text,
  paper: z.object({
    title: text,
    authors: z.array(text).min(1),
    year: z.number().int(),
    venue: text,
    url: z.string().url(),
    doi: z.string().optional(),
  }),
  field: text,
  summary: text,
  whyItMatters: text,
  level: z.enum(["intro", "intermediate", "advanced"]),
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  nodes: z.array(nodeSchema).min(4),
  edges: z.array(z.object({ from: text, to: text })),
  paperNodeId: text,
  readingPlan: z.array(z.object({ section: text, focus: text, conceptIds: z.array(text) })).min(1),
  source: z.enum(["curated", "generated"]),
});

export type Option = z.infer<typeof optionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Interactive = z.infer<typeof interactiveSchema>;
export type JourneyNode = z.infer<typeof nodeSchema>;
export type Journey = z.infer<typeof journeySchema>;

// User progress (docs/SPEC.md section 9.2).
export type NodeState = "locked" | "available" | "in-progress" | "mastered" | "tested-out";

export interface NodeProgress {
  state: Exclude<NodeState, "locked" | "available">;
  bestScore: number;
  attempts: number;
  masteredAt?: number;
}

export interface JourneyProgress {
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
  nodes: Record<string, NodeProgress>;
}
