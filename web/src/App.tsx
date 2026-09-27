import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useStore } from "./lib/store";
import Catalogue from "./pages/Catalogue";
import JourneyPage from "./pages/JourneyPage";
import NodePage from "./pages/NodePage";
import Paywall from "./pages/Paywall";
import Complete from "./pages/Complete";
import WidgetGallery from "./pages/WidgetGallery";
import NotFound from "./pages/NotFound";

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
        <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/j/:journeyId" element={<JourneyPage />} />
          <Route path="/j/:journeyId/n/:nodeId" element={<NodePage />} />
          <Route path="/j/:journeyId/done" element={<Complete />} />
          <Route path="/unlock/:journeyId" element={<Paywall />} />
          <Route path="/widgets" element={<WidgetGallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="foot">
        <div className="wrap">
          PaperPath teaches the ideas behind a paper. Paper links go to their publishers; we don't host papers.
        </div>
      </footer>
    </>
  );
}
