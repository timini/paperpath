import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { JourneyProgress, NodeProgress } from "../content/schema";
import { auth, db } from "./firebase";

// Learner state (SPEC 9.2). Always kept in localStorage so the app works signed out or
// offline; mirrored to Firestore when an anonymous or signed-in account is available.

export interface Profile {
  freeJourneyId?: string;
  xp: number;
  streak: { current: number; lastDay?: string };
}

interface Saved {
  profile: Profile;
  progress: Record<string, JourneyProgress>;
}

export const XP = { mastered: 100, firstTryBonus: 50, testedOut: 60 };

const EMPTY: Saved = { profile: { xp: 0, streak: { current: 0 } }, progress: {} };
const KEY = "paperpath:v1";

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function nextStreak(s: Profile["streak"]): Profile["streak"] {
  const t = today();
  if (s.lastDay === t) return s;
  const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  return { current: s.lastDay === y ? s.current + 1 : 1, lastDay: t };
}

interface Store extends Saved {
  user: User | null;
  synced: boolean;
  entitlements: Set<string>;
  hasAccess: (journeyId: string) => boolean;
  claimFree: (journeyId: string) => Promise<void>;
  openNode: (journeyId: string, nodeId: string) => void;
  recordQuiz: (journeyId: string, nodeId: string, score: number, passed: boolean, testOut: boolean, isPaper: boolean) => number;
  reset: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Saved>(load);
  const [user, setUser] = useState<User | null>(null);
  const [synced, setSynced] = useState(false);
  const [entitlements, setEntitlements] = useState<Set<string>>(new Set());
  const pending = useRef<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  // Sign in anonymously; merge any remote state with local state.
  useEffect(() => {
    const off = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        signInAnonymously(auth).catch(() => setSynced(false));
        return;
      }
      try {
        const [profileSnap, progressSnap, entSnap] = await Promise.all([
          getDoc(doc(db, "users", u.uid)),
          getDocs(collection(db, "users", u.uid, "progress")),
          getDocs(collection(db, "users", u.uid, "entitlements")),
        ]);
        setEntitlements(new Set(entSnap.docs.map((d) => d.id)));
        setSaved((local) => {
          const remote = profileSnap.data() as Partial<Profile> | undefined;
          const progress = { ...local.progress };
          progressSnap.forEach((d) => {
            const r = d.data() as JourneyProgress;
            const l = progress[d.id];
            progress[d.id] = !l || (r.updatedAt ?? 0) > l.updatedAt ? r : l;
          });
          return {
            profile: {
              freeJourneyId: remote?.freeJourneyId ?? local.profile.freeJourneyId,
              xp: Math.max(remote?.xp ?? 0, local.profile.xp),
              streak: remote?.streak ?? local.profile.streak,
            },
            progress,
          };
        });
        setSynced(true);
      } catch {
        setSynced(false);
      }
    });
    return off;
  }, []);

  // Push local changes to Firestore once signed in.
  const push = useCallback(
    async (s: Saved, journeyIds: string[]) => {
      if (!user || !synced) return;
      const ref = doc(db, "users", user.uid);
      const exists = (await getDoc(ref)).exists();
      await setDoc(
        ref,
        {
          xp: s.profile.xp,
          streak: s.profile.streak,
          ...(s.profile.freeJourneyId ? { freeJourneyId: s.profile.freeJourneyId } : {}),
          ...(exists ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true },
      );
      await Promise.all(journeyIds.map((j) => s.progress[j] && setDoc(doc(db, "users", user.uid, "progress", j), s.progress[j])));
    },
    [user, synced],
  );

  useEffect(() => {
    if (!synced || !pending.current.size) return;
    const ids = [...pending.current];
    pending.current.clear();
    push(saved, ids).catch(() => ids.forEach((i) => pending.current.add(i)));
  }, [saved, synced, push]);

  const update = (journeyId: string, fn: (s: Saved) => Saved) => {
    pending.current.add(journeyId);
    setSaved(fn);
  };

  const hasAccess = useCallback(
    (journeyId: string) => saved.profile.freeJourneyId === journeyId || entitlements.has(journeyId),
    [saved.profile.freeJourneyId, entitlements],
  );

  const claimFree = async (journeyId: string) => {
    if (saved.profile.freeJourneyId) return;
    update(journeyId, (s) => ({
      ...s,
      profile: { ...s.profile, freeJourneyId: journeyId },
      progress: { ...s.progress, [journeyId]: s.progress[journeyId] ?? { startedAt: Date.now(), updatedAt: Date.now(), nodes: {} } },
    }));
  };

  const openNode = (journeyId: string, nodeId: string) => {
    update(journeyId, (s) => {
      const jp = s.progress[journeyId] ?? { startedAt: Date.now(), updatedAt: Date.now(), nodes: {} };
      if (jp.nodes[nodeId]) return s;
      const nodes = { ...jp.nodes, [nodeId]: { state: "in-progress", bestScore: 0, attempts: 0 } as NodeProgress };
      return { ...s, progress: { ...s.progress, [journeyId]: { ...jp, nodes, updatedAt: Date.now() } } };
    });
  };

  /** Record a quiz attempt. Returns the XP earned. */
  const recordQuiz = (journeyId: string, nodeId: string, score: number, passed: boolean, testOut: boolean, isPaper: boolean) => {
    const before = saved.progress[journeyId]?.nodes[nodeId];
    const alreadyDone = before?.state === "mastered" || before?.state === "tested-out";
    const earned = passed && !alreadyDone ? (testOut ? XP.testedOut : XP.mastered + ((before?.attempts ?? 0) === 0 ? XP.firstTryBonus : 0)) : 0;
    update(journeyId, (s) => {
      const jp = s.progress[journeyId] ?? { startedAt: Date.now(), updatedAt: Date.now(), nodes: {} };
      const prev = jp.nodes[nodeId];
      const done = prev?.state === "mastered" || prev?.state === "tested-out";
      const node: NodeProgress = {
        state: done ? prev.state : passed ? (testOut ? "tested-out" : "mastered") : "in-progress",
        bestScore: Math.max(prev?.bestScore ?? 0, score),
        attempts: (prev?.attempts ?? 0) + 1,
        ...(passed && !done ? { masteredAt: Date.now() } : prev?.masteredAt ? { masteredAt: prev.masteredAt } : {}),
      };
      return {
        profile: { ...s.profile, xp: s.profile.xp + earned, streak: passed ? nextStreak(s.profile.streak) : s.profile.streak },
        progress: {
          ...s.progress,
          [journeyId]: { ...jp, nodes: { ...jp.nodes, [nodeId]: node }, updatedAt: Date.now(), ...(passed && isPaper && !jp.completedAt ? { completedAt: Date.now() } : {}) },
        },
      };
    });
    return earned;
  };

  const reset = () => setSaved({ ...EMPTY, profile: { ...EMPTY.profile, freeJourneyId: saved.profile.freeJourneyId } });

  const value = useMemo<Store>(
    () => ({ ...saved, user, synced, entitlements, hasAccess, claimFree, openNode, recordQuiz, reset }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [saved, user, synced, entitlements, hasAccess],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}
