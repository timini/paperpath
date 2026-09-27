import { area, arrow, box, circ, diagram, line, path, plot, step, txt } from "../../diagram";

const ys = [40, 80, 120, 160, 200];
const pairs = [["A", "T"], ["G", "C"], ["T", "A"], ["C", "G"], ["A", "T"]];

export default {
  bonds: {
    visual: diagram(
      "Strong links along each strand, weak links between strands: easy to unzip, hard to break.",
      "Two strands of beads. Solid lines join beads along each strand; dashed lines join the strands, and then the strands separate.",
      [
        ...ys.flatMap((y, i) => [circ(`l${i}`, 130, y, pairs[i][0], { r: 15, tone: "accent" }), circ(`r${i}`, 270, y, pairs[i][1], { r: 15, tone: "warn" })]),
        ...ys.slice(1).flatMap((_, i) => [line(`lc${i}`, `l${i}`, `l${i + 1}`, { tone: "accent" }), line(`rc${i}`, `r${i}`, `r${i + 1}`, { tone: "warn" })]),
        ...ys.map((_, i) => line(`h${i}`, `l${i}`, `r${i}`, { dashed: true, tone: "muted" })),
        txt("cl", 40, 120, "covalent:", { size: 12, tone: "accent" }), txt("cl2", 40, 136, "strong", { size: 12, tone: "accent" }),
        txt("hl", 200, 20, "hydrogen bonds: weak", { size: 12, tone: "muted" }),
        txt("sep", 200, 232, "heat or enzymes pull the strands apart; each strand stays whole", { size: 11, tone: "good" }),
      ],
      [
        step("One DNA strand: a chain held together by covalent bonds, shared electrons, which are strong.", ["l0", "l1", "l2", "l3", "l4", "lc0", "lc1", "lc2", "lc3", "cl", "cl2"]),
        step("A second strand, just as sturdy along its length.", ["r0", "r1", "r2", "r3", "r4", "rc0", "rc1", "rc2", "rc3"]),
        step("The two strands are joined by hydrogen bonds between facing bases: each one weak, but many together hold firmly.", ["h0", "h1", "h2", "h3", "h4", "hl"], ["h0", "h1", "h2", "h3", "h4"]),
        step("So the strands can be separated without breaking either one. That's what makes copying possible.", ["sep"], [], ["h0", "h1", "h2", "h3", "h4"], Object.fromEntries(ys.flatMap((y, i) => [[`l${i}`, [105, y]], [`r${i}`, [310, y]]])) as Record<string, [number, number]>),
      ],
    ),
  },
  nucleotides: {
    visual: diagram(
      "A nucleotide is a phosphate, a sugar and a base. Chain them and you have a strand.",
      "One nucleotide drawn as a phosphate circle, a sugar box and a base box; then three linked into a strand; then two-ring purines compared with one-ring pyrimidines.",
      [
        circ("p0", 50, 60, "P", { r: 16, tone: "warn" }), box("s0", 105, 60, "sugar", { w: 60, h: 32 }), box("b0", 180, 60, "base", { w: 60, h: 32, tone: "accent" }),
        line("ps0", "p0", "s0"), line("sb0", "s0", "b0"),
        circ("p1", 50, 120, "P", { r: 16, tone: "warn" }), box("s1", 105, 120, "sugar", { w: 60, h: 32 }), box("b1", 180, 120, "base", { w: 60, h: 32, tone: "accent" }),
        line("ps1", "p1", "s1"), line("sb1", "s1", "b1"), line("sp1", "s0", "p1", { tone: "warn" }),
        txt("bb", 30, 170, "backbone ↓", { size: 12, anchor: "start", tone: "warn" }),
        box("pur", 320, 60, "A, G: purines", { w: 136, h: 50, sub: "two rings, larger", tone: "accent" }),
        box("pyr", 320, 135, "C, T: pyrimidines", { w: 136, h: 50, sub: "one ring, smaller", tone: "good" }),
        txt("fit", 320, 192, "big + small = same width", { size: 12, tone: "warn" }),
      ],
      [
        step("The building block: a phosphate, a sugar called deoxyribose, and one of four bases.", ["p0", "s0", "b0", "ps0", "sb0"]),
        step("Link sugar to the next phosphate and repeat: a sugar–phosphate backbone with bases sticking out. It has a direction, like text.", ["p1", "s1", "b1", "ps1", "sb1", "sp1", "bb"], ["sp1"]),
        step("The four bases come in two sizes. Adenine and guanine are purines, with two rings.", ["pur"]),
        step("Cytosine and thymine are pyrimidines, with one. A big one paired with a small one always spans the same width. Remember that.", ["pyr", "fit"], ["fit"]),
      ],
    ),
  },
  chargaff: {
    visual: diagram(
      "Chargaff's puzzle: species differ, but A always matches T and G always matches C.",
      "Bar charts of A, T, G and C for two species. The compositions differ, but A equals T and G equals C in both.",
      [
        ...[
          [30, 30, 20, 20],
          [22, 22, 28, 28],
        ].flatMap((vals, g) =>
          vals.flatMap((v, i) => {
            const x = 30 + g * 190 + i * 40;
            const h = v * 4.4;
            const tone = i < 2 ? "accent" : "warn";
            return [
              area(`g${g}b${i}`, x, 190 - h, 30, h, { tone: tone as "accent" | "warn" }),
              txt(`g${g}l${i}`, x + 15, 207, "ATGC"[i], { size: 13, bold: true }),
              txt(`g${g}v${i}`, x + 15, 184 - h, `${v}%`, { size: 11, tone: "muted" }),
            ];
          }),
        ),
        txt("n0", 105, 230, "species 1", { size: 12, tone: "muted" }),
        txt("n1", 295, 230, "species 2", { size: 12, tone: "muted" }),
        line("eqa", [45, 34], [85, 34], { tone: "good" }),
        txt("rule", 200, 16, "A = T and G = C, whatever the mix", { size: 13, bold: true, tone: "good" }),
      ],
      [
        step("Chargaff measured the four bases in DNA from different species. Species 1: 30% A, 30% T, 20% G, 20% C.", ["g0b0", "g0b1", "g0b2", "g0b3", "g0l0", "g0l1", "g0l2", "g0l3", "g0v0", "g0v1", "g0v2", "g0v3", "n0"]),
        step("Species 2 is different: 22% A and T, 28% G and C. So DNA isn't a boring repeat.", ["g1b0", "g1b1", "g1b2", "g1b3", "g1l0", "g1l1", "g1l2", "g1l3", "g1v0", "g1v1", "g1v2", "g1v3", "n1"]),
        step("But look: in both, A equals T and G equals C.", ["rule"], ["g0b0", "g0b1", "g1b0", "g1b1"]),
        step("Equal amounts in every species suggests fixed partners: every A is paired with a T, every G with a C.", [], ["g0b2", "g0b3", "g1b2", "g1b3", "rule"]),
      ],
    ),
  },
  xray: {
    visual: diagram(
      "X-rays through a DNA fibre make a cross of spots: the signature of a helix.",
      "An X-ray beam passes through a helical fibre and scatters onto a screen, where spots form an X-shaped cross.",
      [
        box("src", 40, 120, "X-rays", { w: 64, h: 34, tone: "warn" }),
        arrow("beam", "src", [130, 120], { tone: "warn" }),
        plot("fib", (t) => Math.sin(t * 7), 0, 1, [140, 40, 30, 160], -1.3, 1.3, { tone: "accent", width: 3 }),
        txt("fl", 155, 220, "DNA fibre", { size: 12, tone: "accent" }),
        line("sc1", [185, 120], [300, 60], { dashed: true, tone: "muted" }),
        line("sc2", [185, 120], [300, 180], { dashed: true, tone: "muted" }),
        path("screen", [[310, 20], [390, 20], [390, 220], [310, 220]], { closed: true, tone: "muted" }),
        ...[-3, -2, -1, 1, 2, 3].flatMap((k) => [
          circ(`sa${k}`, 350 + k * 9, 120 + k * 22, "", { r: 4, tone: "warn" }),
          circ(`sb${k}`, 350 - k * 9, 120 + k * 22, "", { r: 4, tone: "warn" }),
        ]),
        txt("m1", 200, 238, "spacing of spots → 3.4 Å per step, 34 Å per turn: 10 steps a turn", { size: 11, tone: "good" }),
      ],
      [
        step("Fire X-rays at a stretched fibre of DNA.", ["src", "beam", "fib", "fl"]),
        step("The regularly repeating structure scatters them at particular angles.", ["sc1", "sc2"]),
        step("On the film, the spots form an X-shaped cross, the tell-tale pattern of a helix. Rosalind Franklin and Raymond Gosling's Photograph 51 showed exactly this.", ["screen", ...[-3, -2, -1, 1, 2, 3].flatMap((k) => [`sa${k}`, `sb${k}`])], ["screen"]),
        step("Measuring the spacing gives distances: bases stacked 3.4 Å apart, a full turn every 34 Å, a width of about 20 Å.", ["m1"], ["m1"]),
      ],
    ),
  },
  helix: {
    visual: diagram(
      "Two strands wind round one axis, running in opposite directions, with the bases on the inside.",
      "A side view of the double helix drawn as two wavy strands with rungs between them, arrows showing the strands run in opposite directions, and a turn measured as 34 ångströms.",
      [
        plot("s1", (t) => Math.sin(t), 0, 4 * Math.PI, [20, 60, 360, 110], -1.2, 1.2, { tone: "accent", width: 3 }),
        plot("s2", (t) => Math.sin(t + 2.2), 0, 4 * Math.PI, [20, 60, 360, 110], -1.2, 1.2, { tone: "warn", width: 3 }),
        ...Array.from({ length: 19 }, (_, i) => {
          const t = (i + 0.5) * ((4 * Math.PI) / 19);
          const x = 20 + (t / (4 * Math.PI)) * 360;
          const y1 = 60 + 110 - ((Math.sin(t) + 1.2) / 2.4) * 110;
          const y2 = 60 + 110 - ((Math.sin(t + 2.2) + 1.2) / 2.4) * 110;
          return line(`rung${i}`, [x, y1], [x, y2], { tone: "muted" });
        }),
        arrow("d1", [40, 36], [160, 36], { tone: "accent", label: "5′ → 3′" }),
        arrow("d2", [360, 196], [240, 196], { tone: "warn", label: "5′ → 3′" }),
        line("turn", [20, 222], [200, 222], { tone: "good" }),
        txt("tl", 110, 238, "one turn: 34 Å, 10 base pairs", { size: 12, tone: "good" }),
        txt("pl", 300, 30, "bases inside", { size: 11, tone: "muted" }),
      ],
      [
        step("One strand coils round an axis like a spiral staircase rail. It has a direction, 5′ to 3′.", ["s1", "d1"]),
        step("A second strand coils round the same axis, but runs the other way: antiparallel.", ["s2", "d2"], ["d2"]),
        step("The bases point inwards and meet in the middle as the steps of the staircase. The charged phosphates face outward, into water.", [...Array.from({ length: 19 }, (_, i) => `rung${i}`), "pl"]),
        step("Each turn is 34 Å long with 10 steps of 3.4 Å, and the helix is right-handed, matching the X-ray data.", ["turn", "tl"], ["turn"]),
      ],
    ),
  },
  copying: {
    visual: diagram(
      "Each strand is a template: unzip the helix and build a new partner for each half.",
      "A double strand of four base pairs splits in two, and each half gains a new complementary strand, giving two identical molecules.",
      [
        ...["A", "T", "G", "C"].flatMap((b, i) => [
          box(`t${i}`, 140 + i * 40, 36, b, { w: 32, h: 28 }),
          box(`u${i}`, 140 + i * 40, 70, { A: "T", T: "A", G: "C", C: "G" }[b]!, { w: 32, h: 28 }),
          box(`nu${i}`, 40 + i * 40, 190, { A: "T", T: "A", G: "C", C: "G" }[b]!, { w: 32, h: 28, tone: "good" }),
          box(`nt${i}`, 240 + i * 40, 156, b, { w: 32, h: 28, tone: "good" }),
        ]),
        txt("old", 200, 236, "grey: original strand   green: new strand", { size: 12, tone: "muted" }),
      ],
      [
        step("A stretch of double helix: ATGC paired with TACG.", ["t0", "t1", "t2", "t3", "u0", "u1", "u2", "u3"]),
        step("Unzip it. The two strands separate, each still intact.", [], [], [], {
          t0: [40, 156], t1: [80, 156], t2: [120, 156], t3: [160, 156],
          u0: [240, 190], u1: [280, 190], u2: [320, 190], u3: [360, 190],
        }),
        step("Each strand is a template: opposite every A goes a T, opposite every G a C. New partners are built.", ["nu0", "nu1", "nu2", "nu3", "nt0", "nt1", "nt2", "nt3"], ["nu0", "nu1", "nu2", "nu3", "nt0", "nt1", "nt2", "nt3"]),
        step("Two identical helices, each with one old strand and one new: semi-conservative copying, confirmed by Meselson and Stahl in 1958.", ["old"]),
      ],
    ),
  },
};

