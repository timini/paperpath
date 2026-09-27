import { arrow, box, circ, diagram, step, txt } from "../../diagram";

const cells = (prefix: string, digits: string[], y: number, x0: number, tone: "default" | "accent" | "good" | "bad" | "warn" = "default") =>
  digits.map((d, i) => box(`${prefix}${i}`, x0 + i * 38, y, d, { w: 32, h: 34, tone }));

export default {
  algorithm: {
    visual: diagram(
      "Hilbert asked for a machine-like method. First you have to say what 'machine-like' means.",
      "A statement goes into a procedure that answers provable or not provable. Below, a clerk loops through a rule book one small step at a time.",
      [
        box("in", 70, 50, "any statement in logic", { w: 120, h: 50 }),
        box("proc", 205, 50, "a procedure?", { w: 100, h: 44, tone: "accent" }),
        box("yes", 335, 25, "provable", { w: 100, h: 34, tone: "good" }),
        box("no", 335, 78, "not provable", { w: 100, h: 34, tone: "bad" }),
        arrow("a1", "in", "proc"),
        arrow("a2", "proc", "yes", { tone: "good" }),
        arrow("a3", "proc", "no", { tone: "bad" }),
        txt("q", 200, 124, "To prove no such procedure exists, you must define 'procedure'.", { size: 12, tone: "warn" }),
        box("rules", 75, 185, "finite rule book", { w: 110, h: 44 }),
        box("stepb", 205, 185, "one small step", { w: 110, h: 44, tone: "accent" }),
        box("done", 335, 185, "finished?", { w: 100, h: 44 }),
        arrow("b1", "rules", "stepb"),
        arrow("b2", "stepb", "done"),
        arrow("b3", "done", "stepb", { curve: 30, label: "no", tone: "warn" }),
      ],
      [
        step("Hilbert's question: is there a method that takes any logical statement…", ["in", "a1", "proc"]),
        step("…and always answers, mechanically, whether it can be proved?", ["yes", "no", "a2", "a3"], ["proc"]),
        step("Showing that no method works means ruling out every possible method. So first we need a precise idea of 'method'.", ["q"], ["q"]),
        step("The informal idea: a clerk with a finite rule book, taking one small, mindless step at a time…", ["rules", "stepb", "b1"]),
        step("…checking whether they're done, and if not, taking another step. Turing turns exactly this into a machine.", ["done", "b2", "b3"], ["b3"]),
      ],
    ),
  },
  computable: {
    visual: diagram(
      "A number is computable if a machine keeps printing its digits, forever.",
      "Top: a machine prints 0, 1, 0, 1 and keeps going. Bottom: another machine prints three digits and gets stuck, so it defines no number.",
      [
        txt("l1", 20, 36, "circle-free: prints 1/3 = 0.010101… (binary)", { size: 12, anchor: "start", tone: "good" }),
        ...cells("g", ["0", "1", "0", "1", "0", "1"], 70, 40, "good"),
        txt("more", 275, 75, "… forever", { size: 13, anchor: "start", tone: "good" }),
        txt("l2", 20, 136, "circular: prints a few digits, then nothing more", { size: 12, anchor: "start", tone: "bad" }),
        ...cells("b", ["1", "1", "0"], 170, 40, "bad"),
        box("stuck", 190, 170, "stuck", { w: 70, h: 34, tone: "bad" }),
        txt("verdict", 200, 222, "Only circle-free machines define numbers.", { size: 13, bold: true, tone: "warn" }),
      ],
      [
        step("Some machines print digits one after another and never stop. That's how a machine 'computes' an infinite number like 1/3.", ["l1", "g0", "g1"]),
        step("Every digit eventually appears. Turing calls such a machine circle-free.", ["g2", "g3", "g4", "g5", "more"], ["more"]),
        step("Other machines print a few digits, then stall or loop without printing more. They're circular.", ["l2", "b0", "b1", "b2", "stuck"], ["stuck"]),
        step("So in this paper the good machines are the ones that never stop, and the danger is getting stuck.", ["verdict"], ["verdict"]),
      ],
    ),
  },
  countable: {
    visual: diagram(
      "Anything you can write down in finitely many symbols can be put in a numbered list.",
      "Numbers 1 to 5 paired with the binary strings 0, 1, 00, 01, 10. On the right, a note that machines can be listed the same way.",
      [
        ...[1, 2, 3, 4, 5].map((n, i) => circ(`n${i}`, 50, 34 + i * 42, String(n), { r: 16, tone: "accent" })),
        ...["0", "1", "00", "01", "10"].map((st, i) => box(`s${i}`, 160, 34 + i * 42, st, { w: 70, h: 32 })),
        ...[0, 1, 2, 3, 4].map((i) => arrow(`p${i}`, `n${i}`, `s${i}`, { tone: "accent" })),
        txt("dots", 160, 232, "and so on: every string gets a number", { size: 12, tone: "muted" }),
        box("mach", 310, 90, "machine descriptions are finite strings too", { w: 150, h: 60, tone: "good" }),
        box("reals", 310, 180, "real numbers: no list can hold them all", { w: 150, h: 60, tone: "bad" }),
      ],
      [
        step("A set is countable if you can pair its members with 1, 2, 3, … so none is left out.", ["n0", "n1", "n2", "n3", "n4"]),
        step("Finite strings of 0s and 1s are countable: list the short ones first, then in order within each length.", ["s0", "s1", "s2", "s3", "s4", "p0", "p1", "p2", "p3", "p4", "dots"]),
        step("Every Turing machine is described by a finite string, so the machines can be listed too. There are only countably many.", ["mach"], ["mach"]),
        step("But Cantor proved the real numbers can't be listed. So most real numbers can't be computed by any machine.", ["reals"], ["reals"]),
      ],
    ),
  },
  diagonal: {
    visual: diagram(
      "Cantor's diagonal: build a sequence that differs from every row of any list.",
      "A four by four grid of binary digits with the diagonal highlighted. Below it, a new row made by flipping each diagonal digit.",
      [
        ...["0110", "1001", "1110", "0101"].flatMap((row, r) => [
          txt(`r${r}`, 60, 46 + r * 38, `row ${r + 1}`, { size: 12, anchor: "end", tone: "muted" }),
          ...row.split("").map((d, c) => box(`c${r}${c}`, 95 + c * 40, 42 + r * 38, d, { w: 34, h: 32 })),
        ]),
        txt("dots", 255, 100, "… the list goes on", { size: 12, anchor: "start", tone: "muted" }),
        txt("nl", 60, 212, "new", { size: 12, anchor: "end", tone: "good" }),
        ...["1", "1", "0", "0"].map((d, c) => box(`n${c}`, 95 + c * 40, 208, d, { w: 34, h: 32, tone: "good" })),
        txt("why", 255, 200, "differs from row n", { size: 12, anchor: "start", tone: "good" }),
        txt("why2", 255, 218, "at digit n", { size: 12, anchor: "start", tone: "good" }),
      ],
      [
        step("Suppose someone claims this list contains every infinite binary sequence.", ["r0", "r1", "r2", "r3", ...["0", "1", "2", "3"].flatMap((r) => ["0", "1", "2", "3"].map((c) => `c${r}${c}`)), "dots"]),
        step("Read down the diagonal: digit 1 of row 1, digit 2 of row 2, and so on. Here: 0, 0, 1, 1.", [], ["c00", "c11", "c22", "c33"]),
        step("Flip every one: 1, 1, 0, 0. That's a new sequence.", ["nl", "n0", "n1", "n2", "n3"], ["n0", "n1", "n2", "n3"]),
        step("It can't be row 1 (different first digit), or row 2 (different second digit)… or any row. The list was incomplete.", ["why", "why2"], ["c00", "n0", "c11", "n1"]),
      ],
    ),
  },
  undecidable: {
    visual: diagram(
      "Turing's proof: a machine that could spot circle-free machines would have to run itself and get stuck.",
      "Machines D and U feed into a machine H that walks a list of machines. When H reaches its own number K, it needs its own digit and gets stuck.",
      [
        box("D", 70, 50, "D: is machine n circle-free?", { w: 120, h: 54, tone: "muted" }),
        box("U", 70, 140, "U: run machine n", { w: 120, h: 44 }),
        box("H", 215, 95, "H", { w: 70, h: 50, tone: "accent" }),
        arrow("dh", "D", "H"),
        arrow("uh", "U", "H"),
        txt("list", 330, 22, "machines 1, 2, 3, …", { size: 12, tone: "muted" }),
        txt("task", 330, 38, "print digit n of", { size: 12, tone: "muted" }),
        txt("task2", 330, 54, "circle-free machine n", { size: 12, tone: "muted" }),
        circ("K", 330, 150, "K", { r: 20, tone: "warn" }),
        txt("kl", 330, 184, "H's own number", { size: 12, tone: "warn" }),
        arrow("self", "H", "K", { curve: 30, tone: "bad", label: "needs its own digit" }),
        box("contra", 200, 215, "stuck, so H isn't circle-free. D can't exist.", { w: 300, h: 34, tone: "bad" }),
      ],
      [
        step("Suppose a machine D could look at any machine's description and say whether it's circle-free.", ["D"], ["D"]),
        step("Add the universal machine U, which can run any machine from its description.", ["U"]),
        step("Combine them into H: go through the machines in order, skip the circular ones, and print digit n of the n-th circle-free one. This is the diagonal again.", ["H", "dh", "uh", "list", "task", "task2"], ["H"]),
        step("H would be circle-free, so it has its own number in the list, K.", ["K", "kl"], ["K"]),
        step("At step K, H must compute its own digit K, which is the very digit it's in the middle of computing. It never finishes. So H is circular after all: contradiction. D can't exist.", ["self", "contra"], ["self", "contra"]),
      ],
      [400, 240],
    ),
  },
};

