import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { firebase } from "../lib/firebase";

export const PRICE = "£5";

interface Request {
  id: string;
  source: string;
  status: string;
  createdAt?: { seconds: number };
}

/** "Generate a journey for your own paper" (SPEC section 6). Payments and generation are v1. */
export default function Create() {
  const store = useStore();
  const [source, setSource] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<Request[]>([]);
  const uid = store.user?.uid;

  const refresh = async () => {
    if (!uid || !store.signedIn) return;
    const { db, fsMod } = await firebase();
    const snap = await fsMod.getDocs(fsMod.query(fsMod.collection(db, "journeyRequests"), fsMod.where("uid", "==", uid)));
    setRequests(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Request, "id">) })).sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)));
  };
  useEffect(() => {
    refresh().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, store.signedIn]);

  const valid = /^(https?:\/\/\S+|10\.\d{4,}\/\S+|\d{4}\.\d{4,5}(v\d+)?)$/i.test(source.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || !uid) return;
    setBusy(true);
    setError("");
    try {
      const { db, fsMod } = await firebase();
      await fsMod.addDoc(fsMod.collection(db, "journeyRequests"), {
        uid,
        source: source.trim(),
        note: note.trim().slice(0, 500),
        status: "requested",
        createdAt: fsMod.serverTimestamp(),
      });
      setSource("");
      setNote("");
      await refresh();
    } catch {
      setError("We couldn't save your request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="wrap narrow">
      <nav className="crumbs"><Link to="/">All papers</Link></nav>
      <h1>A journey for any paper</h1>
      <p>
        Give us a paper you're reading and PaperPath builds a journey like the free ones: a map of the ideas it depends on,
        short visual lessons scoped to the paper, and a quiz on every step.
      </p>
      <div className="price-card">
        <p className="price">{PRICE}</p>
        <p>per paper, one-off. Yours to keep.</p>
        <p className="note">
          Automatic generation and payments are being built. Until then, requests are saved and you won't be charged;
          we'll let you know when yours can be generated.
        </p>
      </div>

      {!store.signedIn ? (
        <div className="lesson">
          <h2>Sign in to request a journey</h2>
          <p>Your request and your progress are saved to your Google account.</p>
          <button className="btn primary block" onClick={() => store.signInWithGoogle().catch(() => setError("Sign-in failed. Please try again."))}>
            Sign in with Google
          </button>
          {error && <p className="note" role="alert">{error}</p>}
        </div>
      ) : (
        <form className="lesson create-form" onSubmit={submit}>
          <h2>Which paper?</h2>
          <label>
            arXiv link, DOI or paper URL
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="https://arxiv.org/abs/1706.03762" inputMode="url" autoComplete="off" required />
          </label>
          {source && !valid && <p className="note">Paste a link (https://…), a DOI (10.…) or an arXiv ID (2106.01234).</p>}
          <label>
            What do you want to get out of it? (optional)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={500} placeholder="For example: I know biology but not machine learning" />
          </label>
          <button className="btn primary block" disabled={!valid || busy}>{busy ? "Saving…" : `Request this journey (${PRICE} when payments open)`}</button>
          {error && <p className="note" role="alert">{error}</p>}
        </form>
      )}

      {requests.length > 0 && (
        <section className="lesson">
          <h2>Your requests</h2>
          <ul className="requests">
            {requests.map((r) => (
              <li key={r.id}><span className="req-source">{r.source}</span> <span className="chip">{r.status}</span></li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
