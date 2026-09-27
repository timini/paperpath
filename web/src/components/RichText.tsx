import katex from "katex";
import { Fragment, type ReactNode } from "react";

// Lesson text format: paragraphs separated by blank lines; lines starting "- " form a list;
// inline **bold**, *italic*, `code`, $inline maths$ and $$display maths$$ (KaTeX).

function renderMath(tex: string, display: boolean, key: string) {
  const html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: "ignore" });
  return display ? (
    <div key={key} className="math-display" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span key={key} dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\$\$([^$]+)\$\$|\$([^$]+)\$|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `i${i++}`;
    if (m[1] !== undefined) out.push(renderMath(m[1], true, k));
    else if (m[2] !== undefined) out.push(renderMath(m[2], false, k));
    else if (m[3] !== undefined) out.push(<strong key={k}>{m[3]}</strong>);
    else if (m[4] !== undefined) out.push(<em key={k}>{m[4]}</em>);
    else if (m[5] !== undefined) out.push(<code key={k}>{m[5]}</code>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}><Inline text={l.trim().slice(2)} /></li>
              ))}
            </ul>
          );
        }
        if (/^\$\$[\s\S]+\$\$$/.test(b.trim())) {
          return <Fragment key={i}>{renderMath(b.trim().slice(2, -2), true, `d${i}`)}</Fragment>;
        }
        return <p key={i}><Inline text={b.replace(/\n/g, " ")} /></p>;
      })}
    </>
  );
}
