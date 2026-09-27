import { useEffect, useRef, useState, type ReactNode } from "react";

export function fmt(x: number, digits = 3): string {
  if (!Number.isFinite(x)) return "∞";
  const r = Number(x.toPrecision(digits));
  return Math.abs(r) >= 1e5 || (Math.abs(r) < 1e-3 && r !== 0) ? r.toExponential(2) : String(r);
}

export function Slider(props: {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display?: string;
}) {
  return (
    <label className="w-slider">
      <span className="w-slider-label">
        {props.label}
        <output>{props.display ?? fmt(props.value)}</output>
      </span>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Controls({ children }: { children: ReactNode }) {
  return <div className="w-controls">{children}</div>;
}

export function Readout({ children }: { children: ReactNode }) {
  return (
    <div className="w-readout" aria-live="polite">
      {children}
    </div>
  );
}

export function Stat({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="w-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

/** Convert a pointer event to SVG user-space coordinates. */
export function svgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const m = svg.getScreenCTM();
  return m ? pt.matrixTransform(m.inverse()) : pt;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

/** requestAnimationFrame loop that stops when unmounted or paused. */
export function useAnimationFrame(callback: (dt: number) => void, running: boolean) {
  const cb = useRef(callback);
  cb.current = callback;
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    let id = requestAnimationFrame(function tick(now) {
      cb.current(Math.min(0.05, (now - last) / 1000));
      last = now;
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [running]);
}

/** Width of an element, kept current on resize, for canvas widgets. */
export function useWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [w, setW] = useState(320);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(200, Math.floor(e.contentRect.width))));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}
