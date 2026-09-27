import { useMemo, useState } from "react";
import type { Question } from "../content/schema";
import { isCorrect, score, shuffled, type Answer } from "../content/quiz";
import { Inline, RichText } from "./RichText";

export interface QuizResult {
  score: number;
  passed: boolean;
}

function QuestionView({ q, index, answer, onAnswer, checked }: { q: Question; index: number; answer: Answer; onAnswer: (a: Answer) => void; checked: boolean }) {
  const correct = checked && isCorrect(q, answer);
  const name = `q-${q.id}`;
  return (
    <fieldset className={`q ${checked ? (correct ? "right" : "wrong") : ""}`}>
      <legend>
        <span className="q-num">Question {index + 1}</span>
        <span className="q-prompt"><Inline text={q.prompt} /></span>
        {q.type === "multi" && <span className="q-hint">Select all that apply.</span>}
      </legend>

      {(q.type === "single" || q.type === "multi") && (
        <div className="options">
          {q.options.map((o) => {
            const chosen = q.type === "single" ? answer === o.id : Array.isArray(answer) && answer.includes(o.id);
            const mark = checked ? (o.correct ? "is-correct" : chosen ? "is-wrong" : "") : "";
            return (
              <label key={o.id} className={`option ${chosen ? "chosen" : ""} ${mark}`}>
                <input
                  type={q.type === "single" ? "radio" : "checkbox"}
                  name={name}
                  checked={chosen}
                  disabled={checked}
                  onChange={() => {
                    if (q.type === "single") onAnswer(o.id);
                    else {
                      const cur = Array.isArray(answer) ? answer : [];
                      onAnswer(cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id]);
                    }
                  }}
                />
                <span className="option-text"><Inline text={o.text} /></span>
                {checked && (chosen || o.correct) && (
                  <span className="option-feedback"><Inline text={o.feedback} /></span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {q.type === "numeric" && (
        <label className="numeric">
          <input
            type="number"
            inputMode="decimal"
            step="any"
            disabled={checked}
            value={typeof answer === "number" ? answer : ""}
            onChange={(e) => onAnswer(e.target.value === "" ? null : Number(e.target.value))}
            aria-label="Your answer"
          />
          {q.unit && <span>{q.unit}</span>}
        </label>
      )}

      {q.type === "order" && (
        <ol className="order">
          {(Array.isArray(answer) ? answer : q.items.map((i) => i.id)).map((id, i, arr) => {
            const item = q.items.find((x) => x.id === id)!;
            const move = (d: number) => {
              const next = [...arr];
              [next[i], next[i + d]] = [next[i + d], next[i]];
              onAnswer(next);
            };
            return (
              <li key={id}>
                <span><Inline text={item.text} /></span>
                <span className="order-btns">
                  <button type="button" className="btn icon" disabled={checked || i === 0} onClick={() => move(-1)} aria-label={`Move "${item.text}" up`}>↑</button>
                  <button type="button" className="btn icon" disabled={checked || i === arr.length - 1} onClick={() => move(1)} aria-label={`Move "${item.text}" down`}>↓</button>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {checked && (
        <div className="q-explain">
          <strong>{correct ? "Correct." : q.type === "numeric" ? `Not quite. The answer is ${q.answer}${q.unit ? " " + q.unit : ""}.` : "Not quite."}</strong>{" "}
          <RichText text={q.explanation} />
        </div>
      )}
    </fieldset>
  );
}

function QuizRound({ questions, passMark, onFinish, testOut, round, onRetry }: { questions: Question[]; passMark: number; onFinish: (r: QuizResult) => void; testOut: boolean; round: number; onRetry: () => void }) {
  const qs = useMemo(
    () =>
      shuffled(questions, round * 31).map((q) =>
        q.type === "single" || q.type === "multi" ? { ...q, options: shuffled(q.options, round * 17 + q.id.length) } : q,
      ),
    [questions, round],
  );
  const [answers, setAnswers] = useState<Record<string, Answer>>(() =>
    Object.fromEntries(qs.map((q) => [q.id, q.type === "order" ? shuffled(q.items.map((i) => i.id), round * 7 + 3) : null])),
  );
  const [result, setResult] = useState<QuizResult | null>(null);
  const need = Math.ceil(passMark * qs.length);
  const answered = qs.every((q) => {
    const a = answers[q.id];
    return a !== null && a !== undefined && (!Array.isArray(a) || a.length > 0);
  });

  const check = () => {
    const s = score(qs, answers);
    const r = { score: s, passed: Math.round(s * qs.length) >= need };
    setResult(r);
    onFinish(r);
  };

  return (
    <div className="quiz">
      <p className="note">
        {testOut ? "Test out: pass without the lesson to skip this node. " : ""}Get {need} of {qs.length} right to pass.
      </p>
      {qs.map((q, i) => (
        <QuestionView key={q.id} q={q} index={i} answer={answers[q.id] ?? null} checked={!!result}
          onAnswer={(a) => setAnswers((old) => ({ ...old, [q.id]: a }))} />
      ))}
      {!result ? (
        <button className="btn primary block" disabled={!answered} onClick={check}>
          {answered ? "Check answers" : "Answer every question to check"}
        </button>
      ) : (
        <div className={`result ${result.passed ? "pass" : "fail"}`} role="status">
          <strong>{Math.round(result.score * qs.length)} of {qs.length} correct.</strong>{" "}
          {result.passed ? "Node passed." : `You need ${need}. Read the feedback above, then try a fresh round.`}
          {!result.passed && <button className="btn block" onClick={onRetry}>Try again</button>}
        </div>
      )}
    </div>
  );
}

export default function Quiz(props: { questions: Question[]; passMark: number; onFinish: (r: QuizResult) => void; testOut: boolean }) {
  const [round, setRound] = useState(1);
  return <QuizRound key={round} {...props} round={round} onRetry={() => setRound((r) => r + 1)} />;
}
