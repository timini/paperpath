import { area, arrow, axes, circ, diagram, line, path, plot, step, txt } from "../../diagram";

type Pt = [number, number];

// Cooling tea: T(t) = 20 + 60 e^{-0.1 t}, drawn in the frame [60, 30, 300, 160] for t in 0..30.
const T = (t: number) => 20 + 60 * Math.exp(-0.1 * t);
const tx = (t: number) => 60 + t * 10;
const ty = (v: number) => 190 - ((v - 20) / 60) * 160;
const tangent = (t: number, half: number): [Pt, Pt] => {
  const slope = -0.1 * (T(t) - 20);
  return [[tx(t - half), ty(T(t) - slope * half)], [tx(t + half), ty(T(t) + slope * half)]];
};

// Euler versus the true solution of x' = -x, x(0) = 2, in the frame [60, 30, 300, 160], t in 0..3.
const ex = (t: number) => 60 + (t / 3) * 300;
const ey = (v: number) => 190 - (v / 2) * 160;
const euler = (h: number): Pt[] => Array.from({ length: Math.round(3 / h) + 1 }, (_, i) => [ex(i * h), ey(2 * (1 - h) ** i)] as Pt);

// Tent map cobweb, frame [80, 16, 240, 200].
const mx = (v: number) => 80 + v * 240;
const my = (v: number) => 216 - v * 200;
const tent = (v: number) => (v < 0.5 ? 2 * v : 2 * (1 - v));
const cobweb = (x0: number, n: number): Pt[] => {
  const pts: Pt[] = [[mx(x0), my(0)]];
  let x = x0;
  for (let i = 0; i < n; i++) {
    const y = tent(x);
    pts.push([mx(x), my(y)], [mx(y), my(y)]);
    x = y;
  }
  return pts;
};

export default {
  rates: {
    visual: diagram(
      "A derivative is a slope: how fast something is changing right now.",
      "A cooling curve for a cup of tea falling from 80 to 20 degrees, with a steep tangent line at the start and a shallow one later.",
      [
        ...axes("ax", [60, 30, 300, 160], "minutes", "°C"),
        line("room", [60, ty(20)], [360, ty(20)], { dashed: true, tone: "muted" }),
        txt("rl", 210, ty(20) - 8, "room temperature: 20 °C", { size: 11, tone: "muted" }),
        plot("curve", T, 0, 30, [60, 30, 300, 160], 20, 80, { tone: "accent", width: 3 }),
        line("t0", [tx(0), ty(80)], [tx(4), ty(80 - 24)], { tone: "warn" }),
        txt("t0l", 104, 60, "−6 °C per minute", { size: 12, anchor: "start", tone: "warn" }),
        line("t1", ...tangent(15, 5), { tone: "good" }),
        txt("t1l", 210, 128, "−1.3 °C per minute", { size: 12, anchor: "start", tone: "good" }),
        txt("law", 210, 18, "dT/dt = −0.1 (T − 20)", { size: 13, bold: true, tone: "warn" }),
      ],
      [
        step("Hot tea at 80 °C in a 20 °C room. Its temperature falls over time.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "curve", "room", "rl"]),
        step("The derivative dT/dt is the slope of this curve at a moment. At the start it's steep: about −6 °C per minute.", ["t0", "t0l"], ["t0"]),
        step("Fifteen minutes later the tea is cooler and cools more slowly: about −1.3 °C per minute.", ["t1", "t1l"], ["t1"]),
        step("The rule 'rate depends on the current value' is a differential equation. Know the rule and the start, and you can trace the whole future. Lorenz's model is three of these at once.", ["law"], ["law"]),
      ],
    ),
  },
  "state-space": {
    visual: diagram(
      "The whole state of a system is one point. As time passes, the point traces a path.",
      "A plane with axes X and Z. One path spirals into a resting point, one loops round forever, and one wanders without repeating.",
      [
        ...axes("ax", [40, 20, 330, 200], "X", "Z"),
        circ("pt", 110, 60, "", { r: 6, tone: "warn" }),
        txt("ptl", 110, 44, "the state now", { size: 12, tone: "warn" }),
        path("spiral", [[110, 60], [150, 110], [120, 150], [95, 120], [115, 100], [128, 118], [116, 126], [112, 116]], { smooth: true, tone: "accent", width: 2.5 }),
        circ("fix", 114, 118, "", { r: 5, tone: "good" }),
        txt("fixl", 114, 172, "settles: fixed point", { size: 12, tone: "good" }),
        path("loop", [[250, 70], [300, 90], [305, 140], [260, 160], [220, 130], [225, 85], [250, 70]], { smooth: true, tone: "good", width: 2.5 }),
        txt("loopl", 262, 190, "repeats: periodic orbit", { size: 12, tone: "good" }),
        path("wander", [[190, 40], [230, 55], [210, 95], [175, 70], [215, 45], [255, 60], [235, 110], [190, 100], [240, 50]], { smooth: true, tone: "bad", width: 2 }),
        txt("wl", 330, 36, "neither: never repeats", { size: 12, anchor: "end", tone: "bad" }),
      ],
      [
        step("Describe the system by a few numbers, here X and Z. Then its entire state is a single point.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "pt", "ptl"], ["pt"]),
        step("The equations say which way the point moves from anywhere. This one spirals in and settles at a fixed point.", ["spiral", "fix", "fixl"], ["spiral"]),
        step("Another path might loop round the same closed curve forever: a periodic orbit.", ["loop", "loopl"], ["loop"]),
        step("Or a path can stay in a bounded region yet never settle and never repeat. Lorenz found exactly this in a simple weather model.", ["wander", "wl"], ["wander"]),
      ],
    ),
  },
  numerics: {
    visual: diagram(
      "Computers solve these equations by taking many small straight steps along the slope.",
      "The true curve of exponential decay, with Euler's method approximating it by straight steps; smaller steps track the curve more closely.",
      [
        ...axes("ax", [60, 30, 300, 160], "time", "x"),
        plot("true", (t) => 2 * Math.exp(-t), 0, 3, [60, 30, 300, 160], 0, 2, { tone: "accent", width: 3 }),
        txt("tl", 150, 60, "true solution", { size: 12, anchor: "start", tone: "accent" }),
        path("e1", euler(0.5).slice(0, 2), { tone: "warn", width: 2.5 }),
        ...euler(0.5).map((p, i) => circ(`d${i}`, p[0], p[1], "", { r: 4, tone: "warn" })),
        path("eall", euler(0.5), { tone: "warn", width: 2.5 }),
        txt("el", 220, 90, "big steps: off the curve", { size: 12, anchor: "start", tone: "warn" }),
        path("small", euler(0.1), { tone: "good", width: 2 }),
        txt("sl", 220, 110, "small steps: much closer", { size: 12, anchor: "start", tone: "good" }),
      ],
      [
        step("The exact solution of a simple equation, dx/dt = −x, starting at 2.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "true", "tl"]),
        step("Euler's method: from where you are, follow the current slope in a straight line for a short time.", ["e1", "d0", "d1"], ["e1"]),
        step("Repeat. Each step lands slightly off the true curve, and the errors pile up.", ["eall", "d2", "d3", "d4", "d5", "d6", "el"]),
        step("Smaller steps follow the curve more closely but take more work. Lorenz stepped his equations by 0.01, thousands of times, on a desk-sized computer.", ["small", "sl"], ["small"]),
      ],
    ),
  },
  convection: {
    visual: diagram(
      "Heat a fluid from below hard enough and it starts to roll.",
      "A tank of fluid, hot at the bottom and cool at the top. Gentle heating only conducts; stronger heating sets up two circulating rolls.",
      [
        area("tank", 60, 40, 280, 150, { fill: false }),
        area("hot", 60, 186, 280, 8, { tone: "bad" }),
        txt("hotl", 200, 212, "heated from below", { size: 12, tone: "bad" }),
        area("cool", 60, 36, 280, 6, { tone: "accent" }),
        txt("cooll", 200, 26, "cooler on top", { size: 12, tone: "accent" }),
        ...[110, 200, 290].map((x, i) => arrow(`c${i}`, [x, 170], [x, 60], { dashed: true, tone: "muted" })),
        txt("condl", 200, 116, "gentle: heat just conducts upward", { size: 12, tone: "muted" }),
        arrow("roll1", [80, 170], [80, 60], { curve: -60, tone: "warn" }),
        arrow("roll1b", [190, 60], [190, 170], { curve: -60, tone: "warn" }),
        arrow("roll2", [210, 170], [210, 60], { curve: -60, tone: "good" }),
        arrow("roll2b", [320, 60], [320, 170], { curve: -60, tone: "good" }),
        txt("x", 200, 236, "X: how fast the rolls turn   Y: hot-cold difference   Z: temperature profile", { size: 11, tone: "muted" }),
      ],
      [
        step("A thin layer of fluid, heated from below and cooled from above.", ["tank", "hot", "hotl", "cool", "cooll"]),
        step("With gentle heating, nothing moves: heat simply conducts upward through the still fluid.", ["c0", "c1", "c2", "condl"]),
        step("Heat it harder and warm fluid rises while cool fluid sinks: the layer overturns into rolls.", ["roll1", "roll1b", "roll2", "roll2b"], ["roll1", "roll2"], ["c0", "c1", "c2", "condl"]),
        step("Lorenz kept just three numbers to describe this: X, how fast the rolls turn; Y, the temperature difference between rising and sinking fluid; Z, how the vertical temperature profile is distorted.", ["x"], ["x"]),
      ],
    ),
  },
  stability: {
    visual: diagram(
      "Stable resting points pull you back; unstable ones push you away. At r = 28 every resting point is unstable.",
      "A ball in a valley returns after a nudge; a ball on a hilltop rolls away. Then Lorenz's three resting points are shown, all marked unstable.",
      [
        path("valley", [[20, 70], [70, 120], [110, 70]], { smooth: true, tone: "muted", width: 3 }),
        circ("b1", 70, 108, "", { r: 9, tone: "good" }),
        txt("v1", 65, 145, "valley: stable", { size: 12, tone: "good" }),
        path("hill", [[150, 120], [200, 70], [250, 120]], { smooth: true, tone: "muted", width: 3 }),
        circ("b2", 200, 60, "", { r: 9, tone: "bad" }),
        txt("h1", 200, 145, "hilltop: unstable", { size: 12, tone: "bad" }),
        line("xa", [20, 200], [380, 200], { tone: "muted" }),
        ...[
          ["o", 200, "no rolls"],
          ["cp", 320, "rolls one way"],
          ["cm", 80, "rolls the other way"],
        ].flatMap(([id, x, label]) => [circ(id as string, x as number, 200, "", { r: 8, tone: "warn" }), txt(`${id}l`, x as number, 226, label as string, { size: 11, tone: "warn" })]),
        txt("r28", 200, 178, "at r = 28: all three unstable, yet motion stays bounded", { size: 12, tone: "bad", bold: true }),
      ],
      [
        step("A ball resting in a valley: nudge it and it rolls back. That resting point is stable.", ["valley", "b1", "v1"]),
        step("A ball balanced on a hilltop: the tiniest nudge and it rolls away. Unstable.", ["hill", "b2", "h1"], [], [], { b2: [236, 104] }),
        step("Lorenz's equations have three resting points: no convection, and steady rolls turning one way or the other.", ["xa", "o", "ol", "cp", "cpl", "cm", "cml"]),
        step("Past r ≈ 24.74 all three are hilltops. The motion can't settle, and it can't escape either. It has to keep moving forever.", ["r28"], ["o", "cp", "cm"]),
      ],
    ),
  },
  "return-map": {
    visual: diagram(
      "Hidden order: each peak of Z decides the next, through a simple tent-shaped rule.",
      "A tent-shaped curve of next peak against current peak, with the diagonal, and a cobweb path bouncing between them that never settles.",
      [
        ...axes("ax", [80, 16, 240, 200], "this peak", "next peak"),
        path("tent", [[mx(0), my(0)], [mx(0.5), my(1)], [mx(1), my(0)]], { tone: "accent", width: 3 }),
        path("diag", [[mx(0), my(0)], [mx(1), my(1)]], { dashed: true, tone: "muted" }),
        path("cw1", cobweb(0.3, 2), { tone: "warn", width: 2 }),
        path("cw2", cobweb(0.3, 6), { tone: "warn", width: 2 }),
        path("cw3", cobweb(0.3001 + 0.02, 6), { tone: "good", width: 1.5 }),
        txt("s", 352, 160, "slope steeper", { size: 12, tone: "accent" }),
        txt("s2", 352, 176, "than 1", { size: 12, tone: "accent" }),
      ],
      [
        step("Record each peak of Z and plot it against the next peak. Lorenz found the points fall on a single tent-shaped curve.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "tent"], ["tent"]),
        step("Draw the diagonal. To follow the sequence: go up to the curve for the next peak, then across to the diagonal to make it the current one.", ["diag", "cw1"], ["cw1"]),
        step("Keep going and the path bounces around without ever settling into a repeat.", ["cw2"], ["cw2"], ["cw1"]),
        step("The tent is steeper than 1 everywhere, so nearby starts (green) get pulled apart at every step. That's why no stable cycle can exist.", ["cw3", "s", "s2"], ["cw3"]),
      ],
    ),
  },
};

