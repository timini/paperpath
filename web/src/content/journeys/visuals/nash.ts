import { arrow, axes, box, circ, diagram, line, path, plot, step, txt } from "../../diagram";

const F: [number, number, number, number] = [60, 30, 290, 170]; // plot frame
const X = (p: number) => F[0] + p * F[2];
const Y = (v: number) => F[1] + F[3] - ((v + 1) / 2) * F[3]; // v in [-1, 1]

// The curve in the fixed-point picture, and where it crosses y = x (found by bisection).
const f = (x: number) => 0.25 + 0.5 * x + 0.12 * Math.sin(6 * x);
let lo = 0, hi = 1;
for (let i = 0; i < 40; i++) {
  const mid = (lo + hi) / 2;
  if (f(mid) - mid > 0) lo = mid;
  else hi = mid;
}
const FP = lo;

export default {
  minimax: {
    visual: diagram(
      "Von Neumann's idea: choose the mix that protects you against your opponent's best reply.",
      "Row's expected payoff in matching pennies against each of Column's choices, as lines crossing at a mix of one half, where the worst case is best.",
      [
        ...axes("ax", F, "Row plays Heads with probability p", "Row's payoff"),
        line("zero", [F[0], Y(0)], [F[0] + F[2], Y(0)], { dashed: true, tone: "muted" }),
        txt("z", F[0] - 6, Y(0) + 4, "0", { size: 11, anchor: "end", tone: "muted" }),
        plot("vh", (p) => 2 * p - 1, 0, 1, F, -1, 1, { tone: "accent", width: 2.5 }),
        txt("vhl", X(1) - 4, Y(0.9) + 30, "if Column plays Heads", { size: 11, anchor: "end", tone: "accent" }),
        plot("vt", (p) => 1 - 2 * p, 0, 1, F, -1, 1, { tone: "warn", width: 2.5 }),
        txt("vtl", X(0) + 6, Y(0.9) + 30, "if Column plays Tails", { size: 11, anchor: "start", tone: "warn" }),
        path("env", [[X(0), Y(-1)], [X(0.5), Y(0)], [X(1), Y(-1)]], { tone: "good", width: 5 }),
        circ("best", X(0.5), Y(0), "", { r: 7, tone: "good" }),
        txt("bl", X(0.5), Y(0) + 30, "best worst case: p = ½", { size: 12, tone: "good" }),
      ],
      [
        step("Matching pennies. Row picks Heads with probability p. How well Row does depends on what Column does.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "zero", "z"]),
        step("If Column plays Heads, Row's expected payoff rises with p: 2p − 1.", ["vh", "vhl"]),
        step("If Column plays Tails, it falls: 1 − 2p.", ["vt", "vtl"]),
        step("Column will pick whatever hurts Row most, so Row's guarantee is the lower line. That's highest where the lines cross: p = ½. Von Neumann proved such a value exists for every two-player zero-sum game.", ["env", "best", "bl"], ["best"]),
      ],
    ),
  },
  "fixed-point": {
    visual: diagram(
      "A continuous curve from the left edge to the right edge of a square must cross the diagonal.",
      "A unit square with the diagonal y = x, a curve starting above it and ending below it, and the point where they cross marked.",
      [
        path("box", [[110, 20], [310, 20], [310, 220], [110, 220]], { closed: true, tone: "muted" }),
        path("diag", [[110, 220], [310, 20]], { dashed: true, tone: "muted" }),
        txt("dl", 305, 36, "y = x", { size: 12, anchor: "end", tone: "muted" }),
        plot("f", f, 0, 1, [110, 20, 200, 200], 0, 1, { tone: "accent", width: 3 }),
        circ("s", 110, 220 - f(0) * 200, "", { r: 5, tone: "accent" }),
        txt("sl", 100, 220 - 0.25 * 200 + 4, "starts above", { size: 11, anchor: "end", tone: "accent" }),
        txt("el", 318, 220 - f(1) * 200 + 4, "ends below", { size: 11, anchor: "start", tone: "accent" }),
        circ("fp", 110 + FP * 200, 220 - FP * 200, "", { r: 7, tone: "warn" }),
        txt("fpl", 110 + FP * 200 + 12, 220 - FP * 200 + 22, "f(x) = x", { size: 13, anchor: "start", bold: true, tone: "warn" }),
      ],
      [
        step("Take the square from 0 to 1 and draw the diagonal, where output equals input.", ["box", "diag", "dl"]),
        step("Now any continuous function from [0, 1] to [0, 1]. At the left edge it's on or above the diagonal (it can't go below 0)…", ["s", "sl"]),
        step("…and at the right edge it's on or below (it can't go above 1). Draw it without lifting your pen.", ["f", "el"], ["f"]),
        step("It has to cross the diagonal somewhere. That crossing is a fixed point: f(x) = x. Brouwer's theorem says the same in any number of dimensions, and Kakutani's extends it to set-valued maps.", ["fp", "fpl"], ["fp"]),
      ],
    ),
  },
  existence: {
    visual: diagram(
      "Nash's proof in one loop: a strategy profile that is its own best response is an equilibrium.",
      "A loop from a strategy profile to everyone's best responses and back, with the fixed point labelled as the equilibrium.",
      [
        box("x", 80, 60, "a strategy profile: everyone's mix", { w: 130, h: 58 }),
        box("F", 320, 60, "everyone's best responses to it", { w: 130, h: 58, tone: "accent" }),
        arrow("go", "x", "F", { label: "map", curve: -18 }),
        arrow("back", "F", "x", { label: "compare", curve: -18, dashed: true }),
        box("k", 200, 150, "Kakutani: some profile maps into its own best responses", { w: 250, h: 46, tone: "warn" }),
        box("eq", 200, 215, "that profile is a Nash equilibrium", { w: 250, h: 38, tone: "good" }),
        arrow("ke", "k", "eq", { tone: "good" }),
      ],
      [
        step("Start with any strategy profile: one mixed strategy for each player.", ["x"]),
        step("Map it to the set of profiles where every player best-responds to it.", ["F", "go"], ["F"]),
        step("Is the starting profile among its own best responses? If so, nobody wants to change.", ["back"], ["back"]),
        step("Mixed strategies make the space convex and compact, and best responses convex, so Kakutani's theorem applies: such a profile must exist.", ["k"], ["k"]),
        step("That self-consistent profile is an equilibrium. Every finite game has one.", ["eq", "ke"], ["eq"]),
      ],
    ),
  },
};
