import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { withJourney } from "../components/WithJourney";
import type { Journey } from "../content/schema";
import { nodeStates, prerequisites, previewNodeId } from "../content/graph";
import { useStore } from "../lib/store";
import { RichText, Inline } from "../components/RichText";
import Quiz from "../components/Quiz";
import Widget from "../components/Widget";
import NotFound from "./NotFound";

function NodePage({ journey }: { journey: Journey }) {
  const { nodeId = "" } = useParams();
  const journeyId = journey.id;
  const node = journey.nodes.find((n) => n.id === nodeId);
  const store = useStore();
  const nav = useNavigate();
  const [mode, setMode] = useState<"learn" | "testout">("learn");
  const [earned, setEarned] = useState<number | null>(null);
  const access = store.hasAccess(journey.id);
  const isPreview = previewNodeId(journey) === nodeId;
  const states = nodeStates(journey, store.progress[journey.id]);
  const state = states.get(nodeId);

  useEffect(() => {
    if (node && (access || isPreview) && state !== "locked") store.openNode(journey.id, node.id);
    setEarned(null);
    setMode("learn");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journeyId, nodeId]);

  if (!node) return <NotFound />;
  if (!access && !isPreview) return <Navigate to={`/unlock/${journey.id}`} replace />;
  if (state === "locked") {
    const missing = (prerequisites(journey).get(node.id) ?? []).filter((p) => !["mastered", "tested-out"].includes(states.get(p) ?? "locked"));
    return (
      <div className="wrap narrow">
        <nav className="crumbs"><Link to={`/j/${journey.id}`}>← {journey.title}</Link></nav>
        <h1>{node.title} is locked</h1>
        <p>Pass these first:</p>
        <ul>{missing.map((m) => <li key={m}><Link to={`/j/${journey.id}/n/${m}`}>{journey.nodes.find((n) => n.id === m)!.title}</Link></li>)}</ul>
      </div>
    );
  }

  const done = state === "mastered" || state === "tested-out";
  const dependants = journey.edges.filter((e) => e.from === node.id).map((e) => journey.nodes.find((n) => n.id === e.to)!);
  const afterStates = nodeStates(journey, store.progress[journey.id]);
  const unlockedNow = dependants.filter((d) => afterStates.get(d.id) !== "locked");

  return (
    <article className="wrap narrow node" style={{ "--accent": journey.accent } as React.CSSProperties}>
      <nav className="crumbs"><Link to={`/j/${journey.id}`}>← {journey.title}</Link></nav>
      <header className="n-head">
        <span className="chip">{node.kind === "paper" ? "The paper" : "Concept"} · {node.estimatedMinutes} min{done ? ` · ${state === "tested-out" ? "tested out" : "mastered"}` : ""}</span>
        <h1>{node.title}</h1>
        <div className="why"><strong>Why you need this.</strong> <Inline text={node.whyYouNeedThis} /></div>
        {!done && node.kind !== "paper" && (
          <button className="btn ghost small" onClick={() => { setMode("testout"); setTimeout(() => document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" }), 0); }}>
            Already know this? Test out
          </button>
        )}
      </header>

      {mode === "learn" && (
        <>
          {node.lesson.map((s, i) => (
            <section key={i} className="lesson">
              <h2>{s.heading}</h2>
              <RichText text={s.body} />
            </section>
          ))}

          {node.interactive && (
            <section className="lesson">
              <h2>Try it</h2>
              <Widget spec={node.interactive} />
            </section>
          )}

          {node.workedExample && (
            <section className="lesson worked">
              <h2>Worked example</h2>
              <RichText text={node.workedExample.prompt} />
              <ol>{node.workedExample.steps.map((s, i) => <li key={i}><Inline text={s} /></li>)}</ol>
              <p className="answer"><strong>Answer:</strong> <Inline text={node.workedExample.answer} /></p>
            </section>
          )}

          <section className="lesson in-paper">
            <h2>In the paper</h2>
            <RichText text={node.inThePaper.text} />
            {node.inThePaper.sections.length > 0 && <p className="note">Where: {node.inThePaper.sections.join(", ")}</p>}
          </section>

          {node.whatWeSkip && (
            <section className="lesson skip">
              <h2>What we skip</h2>
              <RichText text={node.whatWeSkip} />
            </section>
          )}
        </>
      )}

      <section className="lesson" id="quiz">
        <h2>{node.kind === "paper" ? "Final check" : "Quiz"}</h2>
        <Quiz key={`${node.id}-${mode}`} questions={node.quiz.questions} passMark={node.quiz.passMark} testOut={mode === "testout"}
          onFinish={(r) => setEarned(store.recordQuiz(journey.id, node.id, r.score, r.passed, mode === "testout", node.kind === "paper") || (r.passed ? 0 : null))} />
      </section>

      {(done || earned !== null) && (
        <section className="next">
          {earned ? <p className="xp">+{earned} XP</p> : null}
          {node.kind === "paper" ? (
            <button className="btn primary block" onClick={() => nav(`/j/${journey.id}/done`)}>Finish the journey</button>
          ) : (
            <>
              {unlockedNow.length > 0 && <h2>Unlocked next</h2>}
              {unlockedNow.map((d) => (
                <Link key={d.id} className="btn primary block" to={access ? `/j/${journey.id}/n/${d.id}` : `/unlock/${journey.id}`}>{d.title} →</Link>
              ))}
              <Link className="btn block" to={`/j/${journey.id}`}>Back to the map</Link>
            </>
          )}
        </section>
      )}
    </article>
  );
}

export default withJourney(NodePage);
