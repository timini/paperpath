import { Link, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import { useStore } from "./lib/store";
import Catalogue from "./pages/Catalogue";
import JourneyPage from "./pages/JourneyPage";
import Create from "./pages/Create";

// Lesson screens pull in the widget library; load them on demand.
const NodePage = lazy(() => import("./pages/NodePage"));
const Complete = lazy(() => import("./pages/Complete"));
const WidgetGallery = lazy(() => import("./pages/WidgetGallery"));
import NotFound from "./pages/NotFound";

function Account() {
  const store = useStore();
  const [open, setOpen] = useState(false);
  if (!store.user) return null;
  if (!store.signedIn) return <button className="btn small" onClick={() => store.signInWithGoogle().catch(() => {})}>Sign in</button>;
  const name = store.user.displayName ?? store.user.email ?? "Account";
  return (
    <div className="account">
      <button className="avatar" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={`Account: ${name}`}>
        {store.user.photoURL ? <img src={store.user.photoURL} alt="" referrerPolicy="no-referrer" /> : name.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <div className="account-menu" role="menu">
          <p className="note">{name}</p>
          <Link to="/create" role="menuitem" onClick={() => setOpen(false)}>Your requested journeys</Link>
          <button className="btn block small" role="menuitem" onClick={() => { setOpen(false); store.signOut(); }}>Sign out</button>
        </div>
      )}
    </div>
  );
}

function RedirectToJourney() {
  const { journeyId = "" } = useParams();
  return <Navigate to={`/j/${journeyId}`} replace />;
}

function Header() {
  const { profile } = useStore();
  return (
    <header className="topbar">
      <div className="wrap row">
        <Link to="/" className="brand" aria-label="PaperPath home">
          <span className="brand-mark" aria-hidden="true" />
          PaperPath
        </Link>
        <div className="meters">
          <span className="meter" title="Experience points">
            <span aria-hidden="true">★</span> {profile.xp} <span className="sr-only">XP</span>
          </span>
          <span className="meter" title="Days in a row with a mastered node">
            <span aria-hidden="true">🔥</span> {profile.streak.current} <span className="sr-only">day streak</span>
          </span>
          <Account />
        </div>
      </div>
    </header>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Suspense fallback={<div className="wrap narrow"><p className="note">Loading…</p></div>}>
        <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/j/:journeyId" element={<JourneyPage />} />
          <Route path="/j/:journeyId/n/:nodeId" element={<NodePage />} />
          <Route path="/j/:journeyId/done" element={<Complete />} />
          <Route path="/create" element={<Create />} />
          <Route path="/unlock/:journeyId" element={<RedirectToJourney />} />
          <Route path="/widgets" element={<WidgetGallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </main>
      <footer className="foot">
        <div className="wrap">
          PaperPath teaches the ideas behind a paper. The ten launch journeys are free. Paper links go to their publishers; we don't host papers.
        </div>
      </footer>
    </>
  );
}
