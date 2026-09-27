import { arrow, axes, box, circ, diagram, line, plot, step, txt } from "../../diagram";

const words = ["The", "animal", "didn't", "cross", "the", "road", "because", "it", "was", "tired"];
// Place words by their length so none run together.
const wx = (() => {
  const w = words.map((x) => x.length * 6.4 + 10);
  const total = w.reduce((a, b) => a + b, 0);
  let x = (400 - total) / 2;
  const centres = w.map((wi) => {
    const c = x + wi / 2;
    x += wi;
    return c;
  });
  return (i: number) => centres[i];
})();

export default {
  embeddings: {
    visual: diagram(
      "Words become points in space, and similar words end up close together.",
      "A plane with animal words clustered together and city words clustered elsewhere. The word bank appears twice, pulled towards river or money by context.",
      [
        ...axes("ax", [30, 20, 340, 200]),
        ...([["cat", 90, 70], ["dog", 120, 90], ["lion", 80, 105]] as const).map(([w, x, y]) => circ(`a${w}`, x, y, w, { r: 20, tone: "accent" })),
        ...([["Paris", 285, 70], ["London", 345, 85], ["Rome", 295, 125]] as const).map(([w, x, y]) => circ(`c${w}`, x, y, w, { r: 24, tone: "warn" })),
        txt("al", 95, 40, "animals", { size: 12, tone: "accent" }),
        txt("cl", 320, 40, "cities", { size: 12, tone: "warn" }),
        circ("bank", 200, 190, "bank", { r: 22 }),
        box("river", 110, 200, "river bank", { w: 80, h: 30, tone: "good" }),
        box("money", 300, 200, "bank loan", { w: 80, h: 30, tone: "good" }),
        txt("ctx", 200, 234, "the layers move each word according to its context", { size: 12, tone: "good" }),
      ],
      [
        step("Every token starts as a list of numbers, a point in space. We'll draw just two of the 512 dimensions.", ["ax-x", "ax-y", "acat", "adog", "alion", "al"]),
        step("Training arranges the points so that words used in similar ways land near each other.", ["cParis", "cLondon", "cRome", "cl"]),
        step("But one fixed point per word can't handle 'bank', which means different things in different sentences.", ["bank"], ["bank"]),
        step("The Transformer's layers fix that: each updates every word's point using the words around it. That mixing is done by attention.", ["river", "money", "ctx"], ["bank"], [], { bank: [110, 170] }),
      ],
    ),
  },
  rnns: {
    visual: diagram(
      "Recurrent networks read one word at a time. Attention looks at all of them at once.",
      "A chain of five hidden states, each depending on the previous one, with a long path from the first word to the last; then attention arrows linking the last word directly to every word.",
      [
        ...[0, 1, 2, 3, 4].flatMap((i) => [
          box(`x${i}`, 50 + i * 75, 190, `word ${i + 1}`, { w: 60, h: 30 }),
          circ(`h${i}`, 50 + i * 75, 120, `h${i + 1}`, { r: 18, tone: "accent" }),
          arrow(`xh${i}`, `x${i}`, `h${i}`, { tone: "muted" }),
        ]),
        ...[0, 1, 2, 3].map((i) => arrow(`hh${i}`, `h${i}`, `h${i + 1}`, { tone: "accent" })),
        txt("seq", 200, 80, "each step waits for the previous one", { size: 12, tone: "accent" }),
        txt("path", 200, 60, "word 1 reaches word 5 only after 4 steps", { size: 12, tone: "bad" }),
        ...[0, 1, 2, 3].map((i) => arrow(`att${i}`, `x${i}`, "x4", { curve: 40 + i * 6, tone: "warn" })),
        txt("attl", 200, 232, "attention: one step between any two words, all in parallel", { size: 12, tone: "warn" }),
      ],
      [
        step("A recurrent network reads word 1, updates its memory h₁, then reads word 2, and so on.", ["x0", "x1", "x2", "x3", "x4", "h0", "h1", "h2", "h3", "h4", "xh0", "xh1", "xh2", "xh3", "xh4", "hh0", "hh1", "hh2", "hh3"]),
        step("Every step waits for the one before, so a GPU can't work on all the words at once.", ["seq"], ["hh0", "hh1", "hh2", "hh3"]),
        step("And information from word 1 has to survive four updates to reach word 5. Long-range links fade.", ["path"], ["h0", "h4"]),
        step("Attention lets any word look directly at any other: one step, and every word in parallel. The Transformer uses only this.", ["att0", "att1", "att2", "att3", "attl"], ["att0", "att1", "att2", "att3"], ["h0", "h1", "h2", "h3", "h4", "xh0", "xh1", "xh2", "xh3", "xh4", "hh0", "hh1", "hh2", "hh3", "seq", "path"]),
      ],
    ),
  },
  "multi-head": {
    visual: diagram(
      "Different heads look for different things.",
      "The sentence 'The animal didn't cross the road because it was tired' with one head linking cross to animal and another linking it to animal.",
      [
        ...words.map((w, i) => txt(`w${i}`, wx(i), 130, w, { size: 10 })),
        arrow("h1", [wx(3), 118], [wx(1), 118], { curve: 40, tone: "accent", label: "head 1: who did it?" }),
        arrow("h2", [wx(7), 142], [wx(1), 142], { curve: -50, tone: "warn", label: "head 2: what is 'it'?" }),
        arrow("h3", [wx(9), 118], [wx(7), 118], { curve: 30, tone: "good", label: "head 3" }),
        box("cat", 200, 222, "8 heads' results joined, then mixed", { w: 260, h: 32, tone: "accent" }),
      ],
      [
        step("Self-attention runs over one sentence: every word can attend to every other.", words.map((_, i) => `w${i}`)),
        step("One head might learn to link a verb to its subject: 'cross' looks at 'animal'.", ["h1"], ["h1"]),
        step("Another might resolve pronouns: 'it' looks back at 'animal', not 'road'.", ["h2"], ["h2"]),
        step("The paper runs 8 heads side by side, each on a 64-number slice of the vectors, then joins and mixes their results.", ["h3", "cat"], ["cat"]),
      ],
    ),
  },
  positions: {
    visual: diagram(
      "Attention alone can't tell word order, so each position gets its own wave pattern.",
      "Two sentences with the same words in different orders look identical to attention. Then sine waves of different speeds give each position a unique pattern.",
      [
        ...["dog", "bites", "man"].map((w, i) => box(`a${i}`, 60 + i * 70, 40, w, { w: 60, h: 30 })),
        ...["man", "bites", "dog"].map((w, i) => box(`b${i}`, 60 + i * 70, 85, w, { w: 60, h: 30, tone: "bad" })),
        txt("same", 300, 66, "same words:", { size: 12, anchor: "start", tone: "bad" }),
        txt("same2", 300, 82, "same to attention", { size: 12, anchor: "start", tone: "bad" }),
        ...axes("ax", [40, 120, 340, 100]),
        plot("fast", (p) => Math.sin(p * 1.2), 0, 8, [40, 125, 340, 90], -1.2, 1.2, { tone: "accent", width: 2.5 }),
        plot("slow", (p) => Math.cos(p * 0.35), 0, 8, [40, 125, 340, 90], -1.2, 1.2, { tone: "warn", width: 2.5 }),
        ...[1, 3, 5, 7].map((p) => line(`m${p}`, [40 + (p / 8) * 340, 125], [40 + (p / 8) * 340, 215], { dashed: true, tone: "muted" })),
        txt("uniq", 210, 238, "each position: a unique mix of fast and slow waves, added to the word", { size: 11, tone: "good" }),
      ],
      [
        step("'Dog bites man'…", ["a0", "a1", "a2"]),
        step("…and 'man bites dog' contain the same words. Attention compares words, not places, so on its own it can't tell them apart.", ["b0", "b1", "b2", "same", "same2"], ["b0", "b2"]),
        step("The fix: add a position signal to each word's vector. The paper uses waves: some dimensions oscillate quickly with position…", ["ax-x", "fast"], ["fast"]),
        step("…others slowly. Read the waves at any position and you get a pattern no other position has.", ["slow", "m1", "m3", "m5", "m7", "uniq"], ["m1", "m3", "m5", "m7"]),
      ],
    ),
  },
  architecture: {
    visual: diagram(
      "The whole Transformer: an encoder reads the source, a decoder writes the translation word by word.",
      "Two stacks side by side. Source words enter six encoder layers; the decoder uses masked self-attention, attends to the encoder, and outputs the next word through softmax, which is appended and fed back.",
      [
        box("src", 95, 222, "source + positions", { w: 150, h: 32 }),
        box("enc", 95, 135, "encoder × 6", { w: 150, h: 80, sub: "attention, feed-forward", tone: "accent" }),
        box("tgt", 305, 222, "output so far", { w: 150, h: 32 }),
        box("dec", 305, 135, "decoder × 6", { w: 150, h: 80, sub: "masked attn, cross-attn, FF", tone: "warn" }),
        box("out", 305, 38, "softmax: next word", { w: 150, h: 34, tone: "good" }),
        arrow("s1", "src", "enc"),
        arrow("t1", "tgt", "dec"),
        arrow("cross", "enc", "dec", { tone: "accent" }),
        arrow("o1", "dec", "out", { tone: "good" }),
        arrow("loop", [382, 38], [382, 222], { curve: -12, dashed: true, tone: "good" }),
        txt("res", 95, 70, "shortcut around every block", { size: 11, tone: "muted" }),
      ],
      [
        step("The source sentence is embedded, positions are added, and it enters the encoder.", ["src", "s1", "enc"]),
        step("Six identical encoder layers, each self-attention then a small feed-forward network, with a shortcut around every block.", ["res"], ["enc"]),
        step("The decoder starts from the translation so far. Its self-attention is masked, so no word can peek ahead.", ["tgt", "t1", "dec"], ["dec"]),
        step("In between, the decoder attends to the encoder's output: that's where the source sentence comes in.", ["cross"], ["cross"]),
        step("A final softmax picks the next word. Append it to the output and go again, one word at a time.", ["out", "o1", "loop"], ["out"]),
      ],
      [400, 245],
    ),
  },
};

