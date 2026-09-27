import { area, box, circ, diagram, line, path, step, txt } from "../../diagram";

export default {
  candles: {
    visual: diagram(
      "Why twice as far means a quarter as bright.",
      "A star at left sends light in a cone. At distance d it passes through a small patch; at 2d the same light covers a patch four times the area.",
      [
        circ("star", 50, 120, "L", { r: 18, tone: "warn" }),
        line("r1", [66, 114], [270, 50], { dashed: true, tone: "warn" }),
        line("r2", [66, 126], [270, 190], { dashed: true, tone: "warn" }),
        area("a1", 146, 88, 8, 64, { tone: "accent" }),
        txt("t1", 150, 78, "distance d", { size: 12 }),
        txt("b1", 150, 170, "brightness 1", { size: 12, tone: "accent" }),
        area("a2", 256, 53, 8, 134, { tone: "accent" }),
        txt("t2", 260, 42, "distance 2d", { size: 12 }),
        txt("b2", 260, 205, "¼ as bright", { size: 12, tone: "accent" }),
        txt("f", 200, 232, "b = L / (4π d²)", { size: 15, bold: true, tone: "warn" }),
      ],
      [
        step("A star pours out light at a fixed rate: its luminosity, L.", ["star"]),
        step("At distance d, that light passes through a patch of a certain size.", ["r1", "r2", "a1", "t1", "b1"], ["a1"]),
        step("Twice as far, the same light is spread over a patch twice as tall and twice as wide: four times the area. Each bit of it is a quarter as bright.", ["a2", "t2", "b2"], ["a2"]),
        step("So brightness falls with distance squared. Know L, measure b, and the distance d drops out.", ["f"], ["f"]),
      ],
    ),
  },
  cepheids: {
    visual: diagram(
      "Leavitt's rule: a Cepheid's rhythm gives away its true brightness.",
      "A plot of luminosity against pulse period for Cepheids, rising steadily. A dashed line reads off the luminosity for a 30-day Cepheid.",
      [
        line("ax", [50, 190], [360, 190]),
        line("ay", [50, 190], [50, 20]),
        txt("xl", 360, 208, "pulse period →", { size: 11, anchor: "end", tone: "muted" }),
        txt("yl", 56, 18, "true brightness", { size: 11, anchor: "start", tone: "muted" }),
        ...[[65, 170], [80, 155], [100, 138], [125, 120], [160, 98], [200, 78], [250, 52], [300, 32]].map(([x, y], i) => circ(`d${i}`, x, y, "", { r: 5, tone: "accent" })),
        path("trend", [[55, 178], [315, 26]], { tone: "warn", width: 2.5 }),
        line("q1", [200, 190], [200, 80], { dashed: true, tone: "good" }),
        line("q2", [200, 78], [52, 78], { dashed: true, tone: "good" }),
        txt("q3", 200, 206, "30 days", { size: 12, tone: "good" }),
        txt("q4", 58, 70, "so this bright", { size: 12, anchor: "start", tone: "good" }),
        box("res", 300, 150, "true brightness + how faint it looks = distance", { w: 150, h: 58, tone: "good" }),
      ],
      [
        step("In 1912 Henrietta Leavitt timed Cepheid stars in the Small Magellanic Cloud. All at about the same distance, so brighter-looking really meant brighter.", ["ax", "ay", "xl", "yl", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7"]),
        step("The pattern: the slower a Cepheid pulses, the more light it really gives off.", ["trend"], ["trend"]),
        step("Now spot a Cepheid in a distant galaxy. Time it: 30 days. Read off its true brightness.", ["q1", "q2", "q3", "q4"], ["q1", "q2"]),
        step("Compare with how faint it looks, and the inverse square law gives the distance to its whole galaxy.", ["res"], ["res"]),
      ],
    ),
  },
  galaxies: {
    visual: diagram(
      "The fuzzy spirals turned out to be whole other galaxies.",
      "The Milky Way on the left and a spiral nebula that first appears nearby, then is placed far away once Cepheids give its distance.",
      [
        box("mw", 80, 120, "Milky Way", { w: 120, h: 50, sub: "0.03 Mpc across" }),
        circ("sun", 40, 104, "", { r: 4, tone: "warn" }),
        box("neb", 185, 120, "spiral nebula", { w: 90, h: 40, tone: "muted" }),
        txt("q", 185, 88, "inside our galaxy?", { size: 12, tone: "muted" }),
        circ("ceph", 185, 150, "", { r: 6, tone: "warn" }),
        txt("ct", 185, 178, "a Cepheid!", { size: 12, tone: "warn" }),
        line("sc", [140, 205], [330, 205], { tone: "accent" }),
        txt("scl", 235, 225, "hundreds of thousands of parsecs", { size: 12, tone: "accent" }),
      ],
      [
        step("In 1920 astronomers argued: are the spiral nebulae clouds inside our galaxy, or galaxies in their own right?", ["mw", "sun", "neb", "q"]),
        step("In 1925 Hubble found Cepheids in the Andromeda nebula. Timing them gave their true brightness…", ["ceph", "ct"], ["ceph"]),
        step("…and they looked so faint that Andromeda had to be far outside the Milky Way.", ["sc", "scl"], ["neb"], ["q"], { neb: [340, 120], ceph: [340, 150], ct: [340, 178] }),
        step("The spirals were galaxies in their own right. Every object in Hubble's 1929 table is one of them.", [], ["neb", "mw"]),
      ],
    ),
  },
  expansion: {
    visual: diagram(
      "Raisin bread: why 'speed proportional to distance' means expansion.",
      "Three raisins in dough. When the dough doubles in size, the farther raisin moves farther in the same time.",
      [
        txt("now", 20, 74, "now", { size: 12, anchor: "start", tone: "muted" }),
        circ("A", 60, 90, "A", { r: 14, tone: "warn" }),
        circ("B", 110, 90, "B", { r: 14, tone: "accent" }),
        circ("C", 210, 90, "C", { r: 14, tone: "accent" }),
        txt("later", 20, 164, "an hour later: every distance doubled", { size: 12, anchor: "start", tone: "muted" }),
        txt("vb", 135, 125, "B moved 50", { size: 12, tone: "good" }),
        txt("vc", 285, 125, "C moved 150: three times as fast", { size: 12, tone: "good" }),
        txt("law", 200, 222, "speed grows with distance, from every raisin", { size: 14, bold: true, tone: "warn" }),
      ],
      [
        step("Three raisins in a loaf. B is 50 away from A, C is 150 away.", ["now", "A", "B", "C"]),
        step("The dough rises and every distance doubles in an hour. B is now 100 away, C is 300 away.", ["later"], [], [], { A: [60, 180], B: [160, 180], C: [360, 180] }),
        step("In that hour B moved 50 and C moved 150. The farther raisin moved faster, exactly in proportion to its distance.", ["vb", "vc"], ["C"]),
        step("Stand on any raisin and you'd see the same. That's Hubble's law, with no centre needed.", ["law"], ["law"]),
      ],
    ),
  },
};

