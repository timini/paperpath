import { area, arrow, axes, box, circ, diagram, line, plot, step, txt } from "../../diagram";

const px = (v: number) => 60 + v * 150;
const py = (v: number) => 190 - v * 150;

export default {
  hidden: {
    visual: diagram(
      "XOR can't be split by one straight line. Two hidden units, each drawing a line, can do it.",
      "Four points of the XOR problem on a square, a failed single line, then two lines from hidden units that fence off the true cases, beside a small network diagram.",
      [
        ...axes("ax", [60, 40, 150, 150], "input 1", "input 2"),
        circ("p00", px(0), py(0), "", { r: 9, tone: "bad" }), circ("p11", px(1), py(1), "", { r: 9, tone: "bad" }),
        circ("p01", px(0), py(1), "", { r: 9, tone: "good" }), circ("p10", px(1), py(0), "", { r: 9, tone: "good" }),
        txt("key", 135, 228, "green: XOR true   red: false", { size: 11, tone: "muted" }),
        line("try", [px(-0.2), py(0.3)], [px(1.2), py(0.9)], { tone: "bad", dashed: true }),
        txt("tryl", 135, 24, "one line always misclassifies", { size: 12, tone: "bad" }),
        line("h1", [px(-0.2), py(0.7)], [px(0.7), py(-0.2)], { tone: "accent" }),
        line("h2", [px(0.3), py(1.2)], [px(1.2), py(0.3)], { tone: "warn" }),
        circ("x1", 270, 80, "x₁", { r: 15 }), circ("x2", 270, 160, "x₂", { r: 15 }),
        circ("or", 330, 80, "OR", { r: 18, tone: "accent" }), circ("and", 330, 160, "AND", { r: 18, tone: "warn" }),
        circ("out", 385, 120, "out", { r: 16, tone: "good" }),
        ...["or", "and"].flatMap((h) => [line(`i1${h}`, "x1", h), line(`i2${h}`, "x2", h)]),
        arrow("o1", "or", "out", { tone: "good" }), arrow("o2", "and", "out", { tone: "good" }),
        txt("hl", 330, 212, "hidden units", { size: 12, tone: "warn" }),
      ],
      [
        step("XOR is true when exactly one input is on: the green points, not the red ones.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "p00", "p11", "p01", "p10", "key"]),
        step("A single unit draws one straight line and says yes on one side. No line puts both greens on one side and both reds on the other.", ["try", "tryl"], ["try"]),
        step("Add hidden units. One draws the OR line, another the AND line. Between them lies exactly the XOR region.", ["h1", "h2", "x1", "x2", "or", "and", "i1or", "i2or", "i1and", "i2and", "hl"], ["h1", "h2"], ["try", "tryl"]),
        step("The output unit combines them: OR but not AND. The catch: nobody tells the hidden units what to be. How do you train them?", ["out", "o1", "o2"], ["out"]),
      ],
    ),
  },
  loss: {
    visual: diagram(
      "One number measures how wrong the network is. Learning means pushing it down.",
      "Bars of network outputs against targets with the misses marked, then the total squared error drawn as a landscape over one weight, with a ball rolling downhill.",
      [
        ...[[0.8, 1], [0.3, 0]].flatMap(([y, d], i) => [
          area(`o${i}`, 40 + i * 70, 190 - y * 140, 24, y * 140, { tone: "accent" }),
          area(`d${i}`, 66 + i * 70, 190 - d * 140 - 2, 24, d * 140 + 2, { tone: "good" }),
          line(`m${i}`, [52 + i * 70, 190 - y * 140], [52 + i * 70, 190 - d * 140], { tone: "bad" }),
        ]),
        txt("k", 90, 212, "blue: output   green: target", { size: 11, tone: "muted" }),
        txt("e", 90, 232, "E = ½(0.2² + 0.3²) = 0.065", { size: 12, tone: "bad", bold: true }),
        ...axes("ax", [220, 30, 160, 160], "a weight w", "E"),
        plot("bowl", (w) => (w - 0.6) ** 2 * 3 + 0.08, 0, 1, [220, 30, 160, 160], 0, 1.3, { tone: "accent", width: 3 }),
        circ("ball", 220 + 0.1 * 160, 30 + 160 - ((0.1 - 0.6) ** 2 * 3 + 0.08) / 1.3 * 160, "", { r: 8, tone: "warn" }),
        txt("down", 300, 22, "learning = walking downhill", { size: 12, tone: "warn" }),
      ],
      [
        step("For each training case, compare the network's outputs (blue) with what they should be (green).", ["o0", "o1", "d0", "d1", "k"]),
        step("The misses, 0.2 and 0.3, are squared and added, then halved. Big misses count much more than small ones.", ["m0", "m1", "e"], ["m0", "m1"]),
        step("E depends on every weight. Picture it as a landscape: change a weight and you move across it.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "bowl", "ball"]),
        step("Learning means finding weights at the bottom of the landscape, where the error is smallest.", ["down"], ["ball"], [], { ball: [220 + 0.6 * 160, 30 + 160 - (0.08 / 1.3) * 160 - 8] }),
      ],
    ),
  },
  chain: {
    visual: diagram(
      "The chain rule: rates multiply along a chain.",
      "Three boxes x, u, y linked by arrows labelled times 3 and times 2, giving times 6 overall; then a longer chain from a weight to the error.",
      [
        box("x", 60, 60, "x", { w: 56, h: 40, tone: "accent" }),
        box("u", 200, 60, "u", { w: 56, h: 40 }),
        box("y", 340, 60, "y", { w: 56, h: 40, tone: "warn" }),
        arrow("xu", "x", "u", { label: "× 3" }),
        arrow("uy", "u", "y", { label: "× 2" }),
        arrow("xy", "x", "y", { curve: -40, tone: "good", label: "× 6 overall" }),
        ...["w", "z", "out", "E"].map((l, i) => box(`c${i}`, 50 + i * 100, 170, l, { w: 56, h: 34, tone: i === 0 ? "accent" : i === 3 ? "bad" : "default" })),
        arrow("c01", "c0", "c1"), arrow("c12", "c1", "c2"), arrow("c23", "c2", "c3"),
        txt("r01", 100, 205, "× input", { size: 12, tone: "warn" }), txt("r12", 200, 205, "× y(1 − y)", { size: 12, tone: "warn" }), txt("r23", 300, 205, "× (y − d)", { size: 12, tone: "warn" }),
        txt("net", 200, 232, "a weight's effect on the error: multiply the local rates", { size: 12, tone: "good" }),
      ],
      [
        step("If u changes 3 times as fast as x…", ["x", "u", "xu"]),
        step("…and y changes 2 times as fast as u…", ["y", "uy"]),
        step("…then y changes 3 × 2 = 6 times as fast as x. That's the chain rule.", ["xy"], ["xy"]),
        step("In a network, a weight affects the unit's input, which affects its output, which affects the error. Multiply the three local rates and you have the weight's gradient.", ["c0", "c1", "c2", "c3", "c01", "c12", "c23", "r01", "r12", "r23", "net"], ["c0", "c3"]),
      ],
      [400, 245],
    ),
  },
  representations: {
    visual: diagram(
      "Nobody told the hidden units about nationality or generation. They worked it out.",
      "A network from a person and a relationship through hidden units to the answer; three hidden units light up with the labels nationality, generation and family branch.",
      [
        box("p", 60, 70, "person: Colin", { w: 100, h: 36, tone: "accent" }),
        box("r", 60, 150, "relation: aunt", { w: 100, h: 36, tone: "accent" }),
        ...[0, 1, 2, 3, 4].map((i) => circ(`h${i}`, 200, 40 + i * 40, "", { r: 12 })),
        box("o", 345, 110, "answer: Jennifer, Margaret", { w: 100, h: 60, tone: "good" }),
        ...["p", "r"].flatMap((s) => [0, 1, 2, 3, 4].map((i) => line(`${s}h${i}`, s, `h${i}`, { tone: "muted" }))),
        ...[0, 1, 2, 3, 4].map((i) => line(`ho${i}`, `h${i}`, "o", { tone: "muted" })),
        txt("f1", 216, 44, "nationality", { size: 11, anchor: "start", tone: "warn" }),
        txt("f2", 216, 124, "generation", { size: 11, anchor: "start", tone: "warn" }),
        txt("f3", 216, 204, "branch", { size: 11, anchor: "start", tone: "warn" }),
      ],
      [
        step("The task: given a person and a relationship, name who fits. The data are two family trees, one English, one Italian.", ["p", "r", "o"]),
        step("In between sit hidden units. Training by backpropagation adjusts every connection.", ["h0", "h1", "h2", "h3", "h4", ...["p", "r"].flatMap((s) => [0, 1, 2, 3, 4].map((i) => `${s}h${i}`)), ...[0, 1, 2, 3, 4].map((i) => `ho${i}`)]),
        step("After training, one hidden unit turned out to separate English people from Italians.", ["f1"], ["h0"]),
        step("Others encoded generation and family branch. Features nobody specified, discovered because they make the task easier: learned representations.", ["f2", "f3"], ["h2", "h4"]),
      ],
    ),
  },
};
