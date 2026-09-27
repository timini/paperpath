import { useEffect, useState } from "react";
import type { Journey } from "./schema";
import { CATALOG } from "./catalog";

export interface CatalogEntry {
  id: string;
  file: string;
  title: string;
  subtitle: string;
  field: string;
  year: number;
  authors: string;
  accent: string;
  nodeCount: number;
  minutes: number;
  previewNodeId: string;
}

// Each journey is its own chunk, loaded when first opened.
const modules = import.meta.glob<Journey>(["./journeys/*.ts", "!./journeys/index.ts"], { import: "default" });
const cache = new Map<string, Journey>();

export function catalogEntry(id: string): CatalogEntry | undefined {
  return CATALOG.find((c) => c.id === id);
}

export async function loadJourney(id: string): Promise<Journey | undefined> {
  const hit = cache.get(id);
  if (hit) return hit;
  const entry = catalogEntry(id);
  const load = entry && modules[`./journeys/${entry.file}.ts`];
  if (!load) return undefined;
  const j = await load();
  cache.set(id, j);
  return j;
}

export type JourneyState = { status: "loading" } | { status: "missing" } | { status: "ready"; journey: Journey };

export function useJourney(id: string): JourneyState {
  const cached = cache.get(id);
  const [state, setState] = useState<JourneyState>(cached ? { status: "ready", journey: cached } : catalogEntry(id) ? { status: "loading" } : { status: "missing" });
  useEffect(() => {
    let live = true;
    const c = cache.get(id);
    if (c) {
      setState({ status: "ready", journey: c });
      return;
    }
    if (!catalogEntry(id)) {
      setState({ status: "missing" });
      return;
    }
    setState({ status: "loading" });
    loadJourney(id).then((j) => live && setState(j ? { status: "ready", journey: j } : { status: "missing" }));
    return () => {
      live = false;
    };
  }, [id]);
  return state;
}
