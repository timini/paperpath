import { Component, type ReactNode } from "react";
import type { Interactive } from "../content/schema";
import { parseWidget } from "../widgets/registry";
import { Inline } from "./RichText";

class Boundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Widget({ spec, className = "" }: { spec: Interactive; className?: string }) {
  const parsed = parseWidget(spec.widget, spec.params);
  const fallback = <p className="note">{spec.altText}</p>;
  return (
    <figure className={`widget ${className}`}>
      {parsed.ok ? (
        <Boundary fallback={fallback}>
          <parsed.def.component params={parsed.params} />
        </Boundary>
      ) : (
        fallback
      )}
      <figcaption><Inline text={spec.caption} /></figcaption>
      <p className="sr-only">{spec.altText}</p>
    </figure>
  );
}
