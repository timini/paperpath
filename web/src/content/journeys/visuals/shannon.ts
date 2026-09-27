import { area, arrow, axes, box, circ, diagram, line, plot, step, txt } from "../../diagram";

const letters: [string, number][] = [["E", 0.127], ["T", 0.091], ["A", 0.082], ["O", 0.075], ["Z", 0.001]];
const H2 = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));

export default {
  probability: {
    visual: diagram(
      "A source is a set of symbols with probabilities. Context changes those probabilities.",
      "Bar chart of how often E, T, A, O and Z appear in English, and a second chart showing that after Q the next letter is almost always U.",
      [
        ...letters.flatMap(([l, p], i) => {
          const h = Math.max(3, p * 1100);
          return [
            area(`b${i}`, 34 + i * 45, 190 - h, 32, h, { tone: "accent" }),
            txt(`l${i}`, 50 + i * 45, 207, l, { size: 13, bold: true }),
            txt(`v${i}`, 50 + i * 45, 184 - h, `${Math.round(p * 1000) / 10}%`, { size: 11, tone: "muted" }),
          ];
        }),
        txt("t1", 140, 232, "letters in English", { size: 12, tone: "muted" }),
        line("sep", [262, 20], [262, 215], { dashed: true, tone: "muted" }),
        area("u", 290, 30, 34, 160, { tone: "warn" }),
        txt("ul", 307, 207, "U", { size: 13, bold: true }),
        txt("uv", 307, 24, "≈99%", { size: 11, tone: "warn" }),
        area("o", 345, 187, 34, 3, { tone: "warn" }),
        txt("ol", 362, 207, "other", { size: 12 }),
        txt("t2", 330, 232, "the letter after a Q", { size: 12, tone: "warn" }),
      ],
      [
        step("Shannon treats a message as a sequence of random choices. English letters aren't equally likely: E is about 12%, Z about 0.1%.", ["b0", "b1", "b2", "b3", "b4", "l0", "l1", "l2", "l3", "l4", "t1"]),
        step("Those percentages form a probability distribution: all between 0 and 1, adding up to 1 across every symbol.", ["v0", "v1", "v2", "v3", "v4"]),
        step("But letters depend on each other. Given that the last letter was Q, the next is U almost every time: a conditional probability.", ["sep", "u", "ul", "uv", "o", "ol", "t2"], ["u"]),
        step("These dependencies make English predictable, and predictability is exactly what Shannon will measure.", [], ["u", "b0"]),
      ],
    ),
  },
  logs: {
    visual: diagram(
      "One of 8 equally likely cards takes exactly 3 yes-or-no questions: log₂ 8 = 3 bits.",
      "A tree halving 8 options into 4, 2 and then 1 with three questions.",
      [
        box("root", 200, 28, "8 possible cards", { w: 130, h: 32, tone: "accent" }),
        box("a", 110, 88, "4 left", { w: 80, h: 30 }), box("b", 290, 88, "4 left", { w: 80, h: 30 }),
        ...[60, 160, 240, 340].map((x, i) => box(`c${i}`, x, 148, "2 left", { w: 70, h: 28 })),
        ...Array.from({ length: 8 }, (_, i) => circ(`l${i}`, 35 + i * 47, 205, String(i + 1), { r: 14, tone: "good" })),
        arrow("ea", "root", "a"), arrow("eb", "root", "b"),
        arrow("e0", "a", "c0"), arrow("e1", "a", "c1"), arrow("e2", "b", "c2"), arrow("e3", "b", "c3"),
        ...Array.from({ length: 8 }, (_, i) => arrow(`f${i}`, `c${Math.floor(i / 2)}`, `l${i}`, { tone: "good" })),
        txt("q1", 8, 92, "Q1", { size: 13, anchor: "start", tone: "warn", bold: true }),
        txt("q2", 8, 152, "Q2", { size: 13, anchor: "start", tone: "warn", bold: true }),
        txt("q3", 8, 236, "Q3", { size: 13, anchor: "start", tone: "warn", bold: true }),
      ],
      [
        step("Someone picks one of 8 cards. You may only ask yes-or-no questions.", ["root"]),
        step("A good question splits the options in half: 8 becomes 4. That one binary choice is one bit.", ["a", "b", "ea", "eb", "q1"], ["q1"]),
        step("Ask again: 4 becomes 2.", ["c0", "c1", "c2", "c3", "e0", "e1", "e2", "e3", "q2"], ["q2"]),
        step("Once more and you've found the card. Three questions, because 2 × 2 × 2 = 8. In general, N choices take log₂ N bits.", ["l0", "l1", "l2", "l3", "l4", "l5", "l6", "l7", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "q3"], ["q3"]),
      ],
      [400, 250],
    ),
  },
  source: {
    visual: diagram(
      "Shannon's approximations to English: more structure, less uncertainty per letter.",
      "Three lines of machine-generated text of increasing realism, each with a bar showing roughly how many bits per letter it carries.",
      [
        ...[
          ["random letters", "XFOML RXKHRJFFJUJ ZLPWCFWKCYJ", 4.75],
          ["English letter frequencies", "OCRO HLI RGWR NMIELWIS EU LL", 4.1],
          ["each letter depends on the last", "ON IE ANTSOUTINYS ARE T INCTORE", 3.3],
        ].flatMap(([label, sample, bits], i) => {
          const y = 34 + i * 66;
          const w = ((bits as number) / 4.75) * 280;
          return [
            txt(`h${i}`, 14, y, label as string, { size: 12, anchor: "start", tone: "muted" }),
            txt(`s${i}`, 14, y + 20, sample as string, { size: 13, anchor: "start", bold: true }),
            area(`bar${i}`, 14, y + 30, w, 10, { tone: i === 2 ? "good" : "accent" }),
            txt(`n${i}`, 20 + w, y + 40, `about ${bits} bits`, { size: 11, anchor: "start", tone: i === 2 ? "good" : "accent" }),
          ];
        }),
        txt("red", 200, 234, "Real English: about half of it is predictable. That's redundancy.", { size: 12, tone: "warn" }),
      ],
      [
        step("Pick letters completely at random from 27 symbols: gibberish, with the maximum uncertainty, log₂ 27 ≈ 4.75 bits per letter.", ["h0", "s0", "bar0", "n0"]),
        step("Pick them with English frequencies (lots of E, few Z). Slightly more English-like, and a little more predictable.", ["h1", "s1", "bar1", "n1"]),
        step("Let each letter depend on the one before. Word-like fragments appear, and uncertainty per letter drops again.", ["h2", "s2", "bar2", "n2"], ["bar2"]),
        step("With all of English's long-range structure, Shannon estimates it's roughly 50% redundant: half of what we write is forced by the language.", ["red"], ["red"]),
      ],
    ),
  },
  coding: {
    visual: diagram(
      "Common symbols get short codes. On average you need exactly the entropy: 1.75 bits.",
      "A binary tree assigning A=0, B=10, C=110, D=111, and a bit stream 010110 decoded as A, B, C.",
      [
        circ("root", 200, 26, "", { r: 10 }),
        box("A", 110, 82, "A: 0", { w: 70, h: 32, sub: "½", tone: "good" }),
        circ("n1", 270, 82, "", { r: 10 }),
        box("B", 200, 142, "B: 10", { w: 70, h: 32, sub: "¼", tone: "good" }),
        circ("n2", 320, 142, "", { r: 10 }),
        box("C", 270, 200, "C: 110", { w: 76, h: 32, sub: "⅛", tone: "good" }),
        box("D", 360, 200, "D: 111", { w: 70, h: 32, sub: "⅛", tone: "good" }),
        arrow("e0", "root", "A", { label: "0" }), arrow("e1", "root", "n1", { label: "1" }),
        arrow("e10", "n1", "B", { label: "0" }), arrow("e11", "n1", "n2", { label: "1" }),
        arrow("e110", "n2", "C", { label: "0" }), arrow("e111", "n2", "D", { label: "1" }),
        txt("stream", 14, 186, "0 | 10 | 110", { size: 16, anchor: "start", bold: true, tone: "warn" }),
        txt("dec", 14, 210, "→ A  B  C", { size: 16, anchor: "start", bold: true, tone: "warn" }),
        txt("avg", 14, 240, "average: ½·1 + ¼·2 + ⅛·3 + ⅛·3 = 1.75 bits = H", { size: 12, anchor: "start", tone: "accent" }),
      ],
      [
        step("Four symbols: A half the time, B a quarter, C and D an eighth each. Build a tree: each branch is one bit.", ["root", "A", "n1", "e0", "e1"]),
        step("A, the most common, gets the one-bit code 0. B gets 10.", ["B", "n2", "e10", "e11"], ["A"]),
        step("The rare C and D get three bits each: 110 and 111. No code is the start of another.", ["C", "D", "e110", "e111"]),
        step("So a stream of bits splits itself up with no separators: 0|10|110 is A, B, C.", ["stream", "dec"], ["stream"]),
        step("The average length is 1.75 bits per symbol: exactly the entropy. Shannon proved you can't beat that.", ["avg"], ["avg"]),
      ],
      [400, 255],
    ),
  },
  capacity: {
    visual: diagram(
      "Every noisy channel has a speed limit, its capacity. Below it, errors can be made as rare as you like.",
      "Left: a binary channel where each bit flips with probability p. Right: the capacity 1 − H(p) plotted against p, dipping to zero at p = 0.5.",
      [
        circ("x0", 40, 60, "0", { r: 16 }), circ("x1", 40, 170, "1", { r: 16 }),
        circ("y0", 170, 60, "0", { r: 16 }), circ("y1", 170, 170, "1", { r: 16 }),
        txt("xs", 40, 26, "sent", { size: 12, tone: "muted" }), txt("ys", 170, 26, "received", { size: 12, tone: "muted" }),
        arrow("k0", "x0", "y0", { label: "1 − p", tone: "good" }),
        arrow("k1", "x1", "y1", { label: "1 − p", tone: "good" }),
        arrow("f0", "x0", "y1", { tone: "bad", dashed: true }),
        arrow("f1", "x1", "y0", { tone: "bad", dashed: true }),
        txt("pl", 105, 205, "flip with probability p", { size: 12, tone: "bad" }),
        ...axes("ax", [230, 30, 150, 150], "flip probability p", "capacity"),
        plot("cap", (p) => 1 - H2(p), 0.001, 0.999, [230, 30, 150, 150], 0, 1, { tone: "accent", width: 3 }),
        circ("pt", 230 + 0.11 * 150, 30 + 150 - 0.5 * 150, "", { r: 6, tone: "warn" }),
        txt("ptl", 250, 94, "half a bit per use", { size: 11, anchor: "start", tone: "warn" }),
      ],
      [
        step("The simplest noisy channel: each bit arrives correctly with probability 1 − p…", ["x0", "x1", "y0", "y1", "xs", "ys", "k0", "k1"]),
        step("…and flips with probability p. The receiver can't tell which bits flipped.", ["f0", "f1", "pl"], ["f0", "f1"]),
        step("Shannon's capacity for this channel is 1 − H(p) bits per use. No noise: 1 bit. Pure noise (p = ½): zero.", ["ax-x", "ax-y", "ax-xl", "ax-yl", "cap"], ["cap"]),
        step("With p = 0.11 the capacity is about 0.5. Send at any rate below that, with long enough codes, and errors become as rare as you like. Above it, impossible.", ["pt", "ptl"], ["pt"]),
      ],
    ),
  },
};
