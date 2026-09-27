import type { User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { JourneyProgress, NodeProgress } from "../content/schema";
import { firebase } from "./firebase";

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

/** Marker in the pending set meaning "save the profile even if no journey changed". */
const PROFILE = "__profile__";

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
  /** Signed in with a real account (not anonymous). */
  signedIn: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
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
    let off = () => {};
    let cancelled = false;
    firebase().then(({ auth, db, authMod, fsMod }) => {
      if (cancelled) return;
      const { onAuthStateChanged, signInAnonymously } = authMod;
      const { collection, doc, getDoc, getDocs } = fsMod;
      off = onAuthStateChanged(auth, async (u) => {
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
          const remoteIds = new Set<string>();
          progressSnap.forEach((d) => {
            remoteIds.add(d.id);
            const r = d.data() as JourneyProgress;
            const l = progress[d.id];
            if (!l || (r.updatedAt ?? 0) >= l.updatedAt) progress[d.id] = r;
            else pending.current.add(d.id); // local is newer: save it
          });
          // Local progress that never reached the server (for example, the tab closed mid-save).
          for (const id of Object.keys(local.progress)) if (!remoteIds.has(id)) pending.current.add(id);
          const profile: Profile = {
            freeJourneyId: remote?.freeJourneyId ?? local.profile.freeJourneyId,
            xp: Math.max(remote?.xp ?? 0, local.profile.xp),
            streak: (remote?.streak?.lastDay ?? "") >= (local.profile.streak.lastDay ?? "") ? remote?.streak ?? local.profile.streak : local.profile.streak,
          };
          if (!remote || profile.xp !== remote.xp || profile.freeJourneyId !== remote.freeJourneyId) pending.current.add(PROFILE);
          return { profile, progress };
        });
        setSynced(true);
      } catch (e) {
        console.warn("PaperPath: could not load saved progress; working offline.", e);
        setSynced(false);
      }
      });
    });
    return () => {
      cancelled = true;
      off();
    };
  }, []);

  // Push local changes to Firestore once signed in.
  const push = useCallback(
    async (s: Saved, journeyIds: string[]) => {
      if (!user || !synced) return;
      const { db, fsMod } = await firebase();
      const { doc, getDoc, serverTimestamp, setDoc } = fsMod;
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
      await Promise.all(
        journeyIds.filter((j) => j !== PROFILE && s.progress[j]).map((j) => setDoc(doc(db, "users", user.uid, "progress", j), s.progress[j])),
      );
    },
    [user, synced],
  );

  useEffect(() => {
    if (!synced || !pending.current.size) return;
    const ids = [...pending.current];
    pending.current.clear();
    push(saved, ids).catch((e) => {
      console.warn("PaperPath: could not save progress; will retry.", e);
      ids.forEach((i) => pending.current.add(i));
    });
  }, [saved, synced, push]);

  const update = (journeyId: string, fn: (s: Saved) => Saved) => {
    pending.current.add(journeyId);
    setSaved(fn);
  };

  // Every existing journey is free to read (SPEC section 6); only generating a new one is paid.
  const hasAccess = useCallback((journeyId: string) => journeyId.length > 0, []);

  /**
   * Google sign-in. An anonymous learner's account is upgraded in place, so their progress
   * keeps its owner. If that Google account already exists, sign into it instead; local
   * progress is merged into it on load.
   */
  const signInWithGoogle = async () => {
    const { auth, authMod } = await firebase();
    const provider = new authMod.GoogleAuthProvider();
    const current = auth.currentUser;
    try {
      if (current?.isAnonymous) {
        const cred = await authMod.linkWithPopup(current, provider);
        setUser(cred.user);
        await cred.user.reload();
      } else await authMod.signInWithPopup(auth, provider);
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/credential-already-in-use" || code === "auth/email-already-in-use") {
        const cred = authMod.GoogleAuthProvider.credentialFromError(e as never);
        if (cred) {
          pending.current.add(PROFILE);
          Object.keys(saved.progress).forEach((j) => pending.current.add(j));
          await authMod.signInWithCredential(auth, cred);
          return;
        }
      }
      if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
        if (current?.isAnonymous) await authMod.linkWithRedirect(current, provider);
        else await authMod.signInWithRedirect(auth, provider);
        return;
      }
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") throw e;
    }
  };

  const signOut = async () => {
    const { auth, authMod } = await firebase();
    await authMod.signOut(auth);
    // A fresh anonymous session starts with empty local progress.
    setSaved(EMPTY);
    setEntitlements(new Set());
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
    () => ({ ...saved, user, synced, entitlements, hasAccess, signedIn: !!user && !user.isAnonymous, signInWithGoogle, signOut, openNode, recordQuiz, reset }),
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
