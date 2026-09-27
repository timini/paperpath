import { area, arrow, axes, box, circ, diagram, line, path, step, txt } from "../../diagram";

type Pt = [number, number];
const seq = "MKTAYIAKQR".split("");
const straight: Pt[] = seq.map((_, i) => [30 + i * 38, 70]);
// Nine residues curl round a pocket; the tenth trails off.
const folded: Pt[] = [
  ...Array.from({ length: 9 }, (_, i) => {
    const a = ((200 + i * 38) * Math.PI) / 180;
    return [Math.round(170 + 54 * Math.cos(a)), Math.round(158 + 50 * Math.sin(a))] as Pt;
  }),
  [262, 118],
];

export default {
  "amino-acids": {
    visual: diagram(
      "A protein is a string of amino acids that folds into a shape. The shape does the work.",
      "Ten beads labelled with amino-acid letters in a line, then glided into a folded compact shape with a pocket.",
      [
        ...seq.map((a, i) => circ(`a${i}`, straight[i][0], straight[i][1], a, { r: 14, tone: i % 3 === 0 ? "warn" : i % 3 === 1 ? "accent" : "good" })),
        ...seq.slice(1).map((_, i) => line(`b${i}`, `a${i}`, `a${i + 1}`, { tone: "muted" })),
        txt("s", 200, 30, "sequence: M K T A Y I A K Q R …", { size: 13, bold: true }),
        txt("sc", 200, 110, "20 kinds of side chain: oily, charged, small, bulky…", { size: 12, tone: "muted" }),
        area("pocket", 150, 140, 40, 36, { tone: "good" }),
        txt("pk", 300, 228, "a pocket where a molecule binds", { size: 12, tone: "good" }),
      ],
      [
        step("A protein is a chain of amino acids, written as letters. Sequencing gives us this string cheaply.", ["s", ...seq.map((_, i) => `a${i}`), ...seq.slice(1).map((_, i) => `b${i}`)]),
        step("Each amino acid has a different side chain: some oily, some charged, some small, some bulky.", ["sc"]),
        step("In water the chain folds into a specific 3D shape: oily parts tucked inside, charged parts outside.", [], [], ["sc"], Object.fromEntries(folded.map((p, i) => [`a${i}`, p]))),
        step("The shape is what matters: pockets, grooves and surfaces that bind other molecules. Predicting it from the string is the problem AlphaFold tackles.", ["pocket", "pk"], ["pocket"]),
      ],
    ),
  },
  folding: {
    visual: diagram(
      "Folding as a funnel: countless loose shapes, one low-energy native shape.",
      "An energy funnel: many unfolded states at the wide top, narrowing down to the single folded state at the bottom, with the count of possible shapes noted.",
      [
        path("funnel", [[40, 30], [120, 80], [175, 150], [200, 210], [225, 150], [280, 80], [360, 30]], { smooth: true, tone: "accent", width: 3 }),
        ...[60, 110, 160, 240, 290, 340].map((x, i) => circ(`u${i}`, x, 40 + (i % 2) * 10, "", { r: 6, tone: "muted" })),
        txt("top", 200, 22, "unfolded: astronomically many shapes", { size: 12, tone: "muted" }),
        circ("nat", 200, 200, "", { r: 9, tone: "good" }),
        txt("natl", 270, 214, "native fold", { size: 12, anchor: "start", tone: "good" }),
        txt("count", 200, 96, "~10⁴⁷ shapes", { size: 13, bold: true, tone: "warn" }),
        txt("anf", 200, 236, "Anfinsen: the sequence alone decides the bottom", { size: 12, tone: "good" }),
      ],
      [
        step("An unfolded chain can take an astronomical number of shapes.", ["u0", "u1", "u2", "u3", "u4", "u5", "top"]),
        step("Levinthal's point: even at 3 twists per residue, 100 residues give about 10⁴⁷ shapes. No protein tries them all.", ["count"], ["count"]),
        step("Instead, energy slopes downhill like a funnel, guiding the chain towards one shape.", ["funnel"], ["funnel"]),
        step("At the bottom is the native fold. Anfinsen showed the sequence alone determines it, so in principle it can be predicted.", ["nat", "natl", "anf"], ["nat"], [], { u2: [185, 170], u3: [215, 170] }),
      ],
    ),
  },
  experiment: {
    visual: diagram(
      "Measuring a structure takes months or years. Fifty years of them trained AlphaFold.",
      "Two routes from purified protein to structure, X-ray crystallography and cryo-electron microscopy, both feeding the Protein Data Bank.",
      [
        box("prot", 60, 120, "purified protein", { w: 100, h: 40 }),
        box("xtal", 190, 60, "grow a crystal, fire X-rays", { w: 130, h: 44, tone: "accent" }),
        box("em", 190, 180, "freeze, image with electrons", { w: 130, h: 44, tone: "warn" }),
        box("model", 330, 120, "atomic model", { w: 100, h: 40, tone: "good" }),
        arrow("p1", "prot", "xtal"), arrow("p2", "prot", "em"),
        arrow("x1", "xtal", "model", { tone: "accent" }), arrow("e1", "em", "model", { tone: "warn" }),
        txt("time", 200, 120, "months to years each", { size: 12, tone: "bad" }),
        txt("pdb", 330, 166, "Protein Data Bank:", { size: 12, tone: "good" }),
        txt("pdb2", 330, 182, "~200,000 structures", { size: 12, tone: "good" }),
        txt("rmsd", 200, 236, "accuracy: RMSD in ångströms; ~1 Å is near atomic detail", { size: 11, tone: "muted" }),
      ],
      [
        step("Start with a purified protein.", ["prot"]),
        step("Route one: coax it into a crystal and read the X-ray diffraction pattern, the same idea that revealed DNA.", ["xtal", "p1", "x1", "model"]),
        step("Route two: freeze many copies and image them with electrons, then average.", ["em", "p2", "e1", "time"], ["time"]),
        step("Every solved structure goes into the Protein Data Bank: AlphaFold's training data. Predictions are scored by how many ångströms atoms are off.", ["pdb", "pdb2", "rmsd"], ["model"]),
      ],
    ),
  },
  coevolution: {
    visual: diagram(
      "Residues that touch tend to mutate together. Alignments across species reveal them.",
      "An alignment of five species' sequences where columns 3 and 7 swap K and E together, and the inference that those two positions touch in 3D.",
      [
        ...["LKAQRVEG", "LKAHRVEG", "LEAQRVKG", "LKSQRIEG", "LEAQRLKG"].flatMap((s, r) =>
          s.split("").map((a, c) => box(`m${r}${c}`, 40 + c * 34, 30 + r * 34, a, { w: 28, h: 28, tone: c === 1 || c === 6 ? "default" : "muted" })),
        ),
        ...[0, 1, 2, 3, 4].map((r) => txt(`sp${r}`, 318, 35 + r * 34, `species ${r + 1}`, { size: 11, anchor: "start", tone: "muted" })),
        area("col1", 57 - 17 + 34 - 17, 14, 34, 170, { tone: "warn" }),
        area("col6", 40 + 6 * 34 - 17, 14, 34, 170, { tone: "warn" }),
        circ("r2", 120, 214, "2", { r: 13, tone: "warn" }),
        circ("r7", 200, 214, "7", { r: 13, tone: "warn" }),
        line("touch", "r2", "r7", { tone: "good" }),
        txt("tl", 300, 218, "probably in contact", { size: 12, tone: "good" }),
      ],
      [
        step("Line up the same protein from many species so matching positions sit in columns: a multiple sequence alignment.", ["sp0", "sp1", "sp2", "sp3", "sp4", ...[0, 1, 2, 3, 4].flatMap((r) => [0, 1, 2, 3, 4, 5, 6, 7].map((c) => `m${r}${c}`))]),
        step("Most columns barely change. But look at positions 2 and 7.", ["col1", "col6"], ["col1", "col6"]),
        step("Where position 2 is K (positive), 7 is E (negative), and when one flips the other flips too. The attraction between them is kept.", [], ["m01", "m06", "m21", "m26", "m41", "m46"]),
        step("Columns that change together suggest residues that touch in the folded protein. AlphaFold learns to read signals like this.", ["r2", "r7", "touch", "tl"], ["touch"]),
      ],
    ),
  },
  architecture: {
    visual: diagram(
      "AlphaFold: an alignment and a map of residue pairs refine each other, then become 3D coordinates.",
      "The sequence feeds an MSA representation and a pair representation, which exchange information through 48 Evoformer blocks, then a structure module builds 3D coordinates with a confidence score, and the result recycles.",
      [
        box("seq", 60, 40, "sequence", { w: 90, h: 32 }),
        box("msa", 70, 120, "alignment (MSA) view", { w: 120, h: 46, tone: "accent" }),
        box("pair", 70, 200, "residue-pair view", { w: 120, h: 46, tone: "warn" }),
        arrow("s1", "seq", "msa"), arrow("s2", "seq", "pair", { curve: 50 }),
        box("evo", 215, 160, "Evoformer × 48", { w: 100, h: 100, sub: "triangle updates", tone: "good" }),
        arrow("m1", "msa", "evo", { tone: "accent" }), arrow("p1", "pair", "evo", { tone: "warn" }),
        box("sm", 335, 110, "structure module", { w: 100, h: 44, tone: "good" }),
        box("xyz", 335, 200, "3D structure + pLDDT", { w: 100, h: 46, tone: "good" }),
        arrow("e1", "evo", "sm", { tone: "good" }), arrow("x1", "sm", "xyz", { tone: "good" }),
        arrow("rec", "xyz", "seq", { curve: 60, dashed: true, tone: "muted", label: "recycle" }),
      ],
      [
        step("From the sequence, AlphaFold builds two views: an alignment of related sequences, and a table with a slot for every pair of residues.", ["seq", "msa", "pair", "s1", "s2"]),
        step("48 Evoformer blocks pass information back and forth. Triangle updates keep pair distances consistent: if A is near B and B near C, A can't be far from C.", ["evo", "m1", "p1"], ["evo"]),
        step("The structure module turns this into atoms, moving each residue as a rigid piece in 3D.", ["sm", "e1"], ["sm"]),
        step("Out comes a structure with a per-residue confidence score, pLDDT. Then the whole thing runs again, feeding its output back in.", ["xyz", "x1", "rec"], ["xyz"]),
      ],
      [400, 240],
    ),
  },
  casp: {
    visual: diagram(
      "CASP14: a blind test, and AlphaFold's errors were about a third of the next best.",
      "A timeline of the blind CASP test, then a bar chart of median backbone error: AlphaFold 0.96 ångströms, next best 2.8.",
      [
        box("solve", 60, 50, "structure solved, kept secret", { w: 110, h: 50 }),
        box("pred", 200, 50, "teams predict it", { w: 100, h: 50, tone: "accent" }),
        box("rel", 335, 50, "released and compared", { w: 110, h: 50, tone: "good" }),
        arrow("t1", "solve", "pred"), arrow("t2", "pred", "rel"),
        ...axes("ax", [80, 100, 280, 110], "", "median error (Å)"),
        area("af", 130, 210 - 0.96 * 30, 60, 0.96 * 30, { tone: "good" }),
        area("nb", 250, 210 - 2.8 * 30, 60, 2.8 * 30, { tone: "bad" }),
        txt("afl", 160, 226, "AlphaFold: 0.96 Å", { size: 12, tone: "good" }),
        txt("nbl", 280, 226, "next best: 2.8 Å", { size: 12, tone: "bad" }),
        txt("atom", 200, 252, "a carbon atom is about 1.5 Å across", { size: 11, tone: "muted" }),
      ],
      [
        step("CASP organisers collect structures that have been solved but not yet published.", ["solve"]),
        step("Teams predict them blind. Nobody can tune to answers they haven't seen.", ["pred", "t1"]),
        step("Then the real structures are released and assessors measure how far each prediction is off.", ["rel", "t2"]),
        step("In CASP14 (2020), AlphaFold's median backbone error was 0.96 Å; the next best method's was 2.8 Å.", ["ax-y", "ax-yl", "ax-x", "af", "nb", "afl", "nbl", "atom"], ["af"]),
      ],
      [400, 262],
    ),
  },
};
