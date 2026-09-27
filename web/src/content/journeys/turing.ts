import type { Journey } from "../schema";
import { withVisuals } from "../diagram";
import visuals from "./visuals/turing";

const turing: Journey = {
  id: "turing-1936",
  title: "What can a machine compute?",
  subtitle: "Turing defines computation and proves some problems can never be solved by any algorithm.",
  paper: {
    title: "On Computable Numbers, with an Application to the Entscheidungsproblem",
    authors: ["Alan M. Turing"],
    year: 1936,
    venue: "Proceedings of the London Mathematical Society",
    url: "https://doi.org/10.1112/plms/s2-42.1.230",
    doi: "10.1112/plms/s2-42.1.230",
  },
  field: "Computer science",
  accent: "#7c3aed",
  level: "intro",
  source: "curated",
  summary:
    "In 1936 nobody had a precise definition of an algorithm. Turing gave one: an imaginary machine that reads and writes symbols on a tape, one step at a time, following a finite table of rules. With that definition he showed that one machine can imitate every other, and that some questions about machines have no mechanical answer at all.",
  whyItMatters:
    "The universal machine is the idea behind every programmable computer. The proof that some problems are undecidable set permanent limits on what software can do, from program verification to antivirus scanning.",
  nodes: [
    {
      id: "algorithm",
      conceptId: "computation/effective-procedure",
      title: "What counts as an algorithm",
      kind: "concept",
      whyYouNeedThis:
        "The paper's title problem, the Entscheidungsproblem, asks whether an algorithm exists. You can't prove that none exists without first pinning down what an algorithm is.",
      lesson: [
        {
          heading: "Hilbert's question",
          body: "In 1928 David Hilbert and Wilhelm Ackermann asked for a **decision procedure** for logic: a method that takes any statement in first-order logic and, after finitely many steps, says whether it can be proved.\n\nIf such a method existed, huge parts of mathematics could in principle be settled mechanically. Before 1936 people could show a method *worked* by exhibiting it. To show that *no* method works, you need a definition covering every possible method.",
        },
        {
          heading: "What mathematicians meant",
          body: "Informally, an algorithm, or **effective procedure**, is a method that:\n\n- uses a finite set of exact instructions;\n- needs no insight or guessing, only following the rules;\n- works step by step, each step small and mechanical;\n- gives its answer after finitely many steps when it succeeds.\n\nThink of a clerk with pencil, paper and a rule book, who never gets tired and never runs out of paper. Turing's move was to analyse exactly what such a clerk does and turn it into a machine.",
        },
      ],
      whatWeSkip:
        "We skip the formal logic of the Hilbert programme and Gödel's incompleteness theorems. You only need the idea of a mechanical, rule-following procedure.",
      inThePaper: {
        text: "Section 9 argues that the machines capture everything a human computer can do by rote: finitely many states of mind, a finite alphabet, and attention to a few symbols at a time.",
        sections: ["§1", "§9"],
      },
      quiz: {
        passMark: 0.8,
        questions: [
          {
            id: "a1",
            type: "single",
            tag: "recall",
            prompt: "What did the Entscheidungsproblem ask for?",
            options: [
              { id: "a", text: "A method that decides, for any logical statement, whether it is provable", correct: true, feedback: "Yes. A general decision procedure for first-order logic." },
              { id: "b", text: "A proof that every true statement is provable", correct: false, feedback: "That is closer to completeness, which Gödel addressed. The Entscheidungsproblem asks for a mechanical method." },
              { id: "c", text: "A faster way to multiply large numbers", correct: false, feedback: "Nothing to do with speed of arithmetic." },
            ],
            explanation: "Hilbert and Ackermann asked for an effective method that would settle provability for any statement.",
          },
          {
            id: "a2",
            type: "single",
            tag: "application",
            prompt: "Why did proving 'no algorithm exists' need a precise definition of algorithm, while proving 'this algorithm works' did not?",
            options: [
              { id: "a", text: "To rule out every possible method you must know exactly what the set of methods is", correct: true, feedback: "Right. A negative result quantifies over all algorithms, so the class must be defined." },
              { id: "b", text: "Because algorithms were illegal to publish without a definition", correct: false, feedback: "No. The issue is logical, not legal." },
              { id: "c", text: "Because positive results are always easier to believe", correct: false, feedback: "Belief isn't the issue. A proof about all methods needs a definition of 'method'." },
            ],
            explanation: "Showing one method works only needs that method. Showing none can work means reasoning about all methods at once.",
          },
          {
            id: "a3",
            type: "multi",
            tag: "recall",
            prompt: "Which are features of an effective procedure?",
            options: [
              { id: "a", text: "A finite set of exact instructions", correct: true, feedback: "Yes." },
              { id: "b", text: "Occasional flashes of insight by the person following it", correct: false, feedback: "No. It must need no insight at all." },
              { id: "c", text: "Small mechanical steps", correct: true, feedback: "Yes." },
              { id: "d", text: "An answer after finitely many steps when it succeeds", correct: true, feedback: "Yes." },
            ],
            explanation: "The clerk follows fixed rules, step by step, with no creativity required.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "symbols",
      conceptId: "computation/encoding",
      title: "Everything as strings of symbols",
      kind: "concept",
      whyYouNeedThis:
        "Turing's machines only read and write symbols. To compute numbers, and later to feed one machine's description to another, everything must be written as a string over a small alphabet.",
      lesson: [
        {
          heading: "Binary numbers",
          body: "Any whole number can be written with just two symbols. In binary each position is a power of two: $1011_2 = 8 + 0 + 2 + 1 = 11$.\n\nA number between 0 and 1 can be written as an infinite binary fraction: $0.101_2 = \\tfrac12 + \\tfrac18 = 0.625$. Turing's machines compute real numbers by printing their binary digits one after another, forever if needed.",
        },
        {
          heading: "Encoding anything",
          body: "Symbols can stand for anything once you agree a code. Letters, rules, even a whole table of instructions can be written as a string. Turing turns each machine's rule table into a string of letters (its **standard description**) and then into a single whole number (its **description number**).\n\nThis is the step that makes programs into data: a machine can read another machine's description just as it reads a number.",
        },
      ],
      whatWeSkip: "We skip Turing's exact letter code (D, A, C, L, R, N and so on). The point is that such a code exists.",
      interactive: {
        widget: "turing-machine",
        params: {
          tape: "1011",
          blank: "_",
          start: "right",
          halt: ["done"],
          rules: [
            { state: "right", read: "0", write: "0", move: "R", next: "right" },
            { state: "right", read: "1", write: "1", move: "R", next: "right" },
            { state: "right", read: "_", write: "_", move: "L", next: "carry" },
            { state: "carry", read: "1", write: "0", move: "L", next: "carry" },
            { state: "carry", read: "0", write: "1", move: "N", next: "done" },
            { state: "carry", read: "_", write: "1", move: "N", next: "done" },
          ],
          maxSteps: 60,
        },
        caption: "A three-state rule table that adds 1 to a binary number. Step through it: the whole calculation is reading and writing symbols. Try it on 1011 (eleven).",
        altText: "A tape holding 1011 with a head that moves right to the end, then back left turning trailing 1s into 0s until it writes a 1, giving 1100.",
      },
      workedExample: {
        prompt: "What number is the binary fraction $0.011_2$?",
        steps: ["The first digit after the point is worth $\\tfrac12$, the second $\\tfrac14$, the third $\\tfrac18$.", "$0\\cdot\\tfrac12 + 1\\cdot\\tfrac14 + 1\\cdot\\tfrac18 = \\tfrac38$."],
        answer: "$\\tfrac38 = 0.375$",
      },
      inThePaper: {
        text: "Turing's machines print binary 'figures' (0 and 1) for the number and other symbols as scratch work. Section 5 codes each machine as a string and then as a description number, so machines can be listed and fed to other machines.",
        sections: ["§1", "§5"],
      },
      quiz: {
        passMark: 0.8,
        questions: [
          {
            id: "s1",
            type: "numeric",
            tag: "application",
            prompt: "What is $1101_2$ in ordinary decimal?",
            answer: 13,
            tolerance: 0,
            explanation: "$8 + 4 + 0 + 1 = 13$.",
          },
          {
            id: "s2",
            type: "numeric",
            tag: "application",
            prompt: "The adder machine starts on tape 111. What number (in decimal) is on the tape when it halts?",
            answer: 8,
            tolerance: 0,
            explanation: "$111_2 = 7$. Adding 1 turns every 1 into 0 and writes a new 1 at the front: $1000_2 = 8$.",
          },
          {
            id: "s3",
            type: "single",
            tag: "paper-link",
            prompt: "Why does Turing turn each machine's rule table into a number?",
            options: [
              { id: "a", text: "So machines can be listed, and one machine can take another's description as input", correct: true, feedback: "Yes. That is what makes the universal machine and the diagonal argument possible." },
              { id: "b", text: "To make the machines run faster", correct: false, feedback: "Speed plays no part in the paper." },
              { id: "c", text: "To hide how the machines work", correct: false, feedback: "The opposite: the code makes the machine's workings readable by other machines." },
            ],
            explanation: "Description numbers let Turing count machines and treat programs as data.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "machine",
      conceptId: "computation/turing-machine",
      title: "The Turing machine",
      kind: "concept",
      whyYouNeedThis: "Every result in the paper is about these machines. You need to read a rule table and follow a machine step by step.",
      lesson: [
        {
          heading: "The parts",
          body: "A Turing machine has:\n\n- a **tape** divided into squares, unlimited in length, each holding one symbol or blank;\n- a **head** that looks at one square at a time;\n- a finite set of **states** (Turing calls them m-configurations);\n- a **rule table**.\n\nEach rule says: *in this state, reading this symbol, write this symbol, move left, right or not at all, and switch to this state.*",
        },
        {
          heading: "Running it",
          body: "Start in the start state with the head on a given square. Look up the rule for the current state and symbol, apply it, repeat. That is all. There is no memory except the tape and the current state.\n\nDespite being so simple, these machines can carry out any calculation a person could do with pencil and paper, given enough tape and time. That claim is now called the **Church–Turing thesis**. It can't be proved, because 'what a person can compute' is informal, but no counterexample has ever been found.",
        },
      ],
      whatWeSkip: "We skip multi-tape machines and Turing's abbreviated tables (skeleton tables). They compute nothing extra.",
      interactive: {
        widget: "turing-machine",
        params: {
          tape: "_",
          blank: "_",
          start: "b",
          halt: ["never"],
          rules: [
            { state: "b", read: "_", write: "0", move: "R", next: "c" },
            { state: "c", read: "_", write: "_", move: "R", next: "e" },
            { state: "e", read: "_", write: "1", move: "R", next: "f" },
            { state: "f", read: "_", write: "_", move: "R", next: "b" },
          ],
          maxSteps: 24,
        },
        caption: "Turing's first example machine, with his state names b, c, e, f. It prints 0 and 1 on alternate squares forever. 'Run to end' stops after 24 steps; the real machine never stops.",
        altText: "A machine on a blank tape that prints 0, skips a square, prints 1, skips a square, and repeats forever.",
      },
      workedExample: {
        prompt: "Using the rule table in the widget, what is written on the tape after 4 steps, starting in state b on a blank tape?",
        steps: ["Step 1: state b reads blank, writes 0, moves right, goes to c.", "Step 2: c reads blank, writes blank, moves right, goes to e.", "Step 3: e writes 1, moves right, goes to f.", "Step 4: f moves right and returns to b."],
        answer: "0 _ 1 _ , and the machine is back in state b ready to repeat.",
      },
      inThePaper: {
        text: "Section 1 describes the machine as a model of a human computer. Section 3 gives the b, c, e, f machine above as the first example. Machines that print symbols without stopping are the normal case in this paper, because they compute infinite binary expansions.",
        sections: ["§1", "§2", "§3"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "m1",
            type: "multi",
            tag: "recall",
            prompt: "What does one rule of a Turing machine specify?",
            options: [
              { id: "a", text: "The symbol to write", correct: true, feedback: "Yes." },
              { id: "b", text: "Which way to move the head", correct: true, feedback: "Yes." },
              { id: "c", text: "The next state", correct: true, feedback: "Yes." },
              { id: "d", text: "How long to pause before the next step", correct: false, feedback: "No. Timing plays no part." },
            ],
            explanation: "Given the current state and symbol, a rule gives the symbol to write, the move and the next state.",
          },
          {
            id: "m2",
            type: "single",
            tag: "application",
            prompt: "A machine is in state q reading 1. Its table has no rule for (q, 1). What happens?",
            options: [
              { id: "a", text: "It stops", correct: true, feedback: "Yes. With no applicable rule the machine can't continue." },
              { id: "b", text: "It picks a rule at random", correct: false, feedback: "Turing machines are deterministic: no randomness." },
              { id: "c", text: "It moves right and tries again", correct: false, feedback: "Only a rule can tell it to move." },
            ],
            explanation: "A missing rule means the machine halts. In Turing's paper this is a failure for a number-printing machine, as the next node explains.",
          },
          {
            id: "m3",
            type: "single",
            tag: "recall",
            prompt: "The Church–Turing thesis says that",
            options: [
              { id: "a", text: "anything a person can compute by following rules, a Turing machine can compute", correct: true, feedback: "Yes. It links the informal idea to the formal machine." },
              { id: "b", text: "Turing machines are faster than people", correct: false, feedback: "Speed is irrelevant." },
              { id: "c", text: "every mathematical question can be answered by a machine", correct: false, feedback: "The paper proves the opposite." },
            ],
            explanation: "It is a thesis, not a theorem, because 'computable by a person' has no formal definition.",
          },
          {
            id: "m4",
            type: "numeric",
            tag: "paper-link",
            prompt: "Turing's b, c, e, f machine has run for 8 steps from a blank tape. How many 1s has it printed?",
            answer: 2,
            tolerance: 0,
            explanation: "Each cycle of 4 steps prints one 0 and one 1. Eight steps is two cycles: 0 _ 1 _ 0 _ 1 _.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "computable",
      conceptId: "computation/computable-numbers",
      title: "Computable numbers",
      kind: "concept",
      whyYouNeedThis: "The paper's headline notion. Turing defines computability for real numbers first, then transfers the results to logic.",
      lesson: [
        {
          heading: "Printing a number forever",
          body: "A real number like $\\pi - 3 = 0.14159\\ldots$ has infinitely many digits. No machine can finish writing it, but a machine can keep printing its binary digits one by one, getting every digit right eventually.\n\nTuring calls a real number **computable** if some machine prints its binary expansion in this way. $\\tfrac13$, $\\sqrt2$, $\\pi$ and $e$ are all computable.",
        },
        {
          heading: "Circle-free and circular",
          body: "A machine that keeps printing digits forever is **circle-free**. A machine that gets stuck, stops, or loops without ever printing another digit is **circular**: it only ever prints finitely many digits, so it doesn't define a number.\n\nThis is the reverse of the modern habit. Today we usually want a program to halt. In Turing's setting, a good machine never stops, and the dangerous question is whether a machine will keep producing digits.",
        },
      ],
      whatWeSkip: "We skip Turing's treatment of computable functions and sequences of computable numbers in §10.",
      inThePaper: {
        text: "Section 2 defines circle-free machines and computable sequences. The whole diagonal argument in section 8 turns on whether a machine is circle-free.",
        sections: ["§2", "§8"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "c1",
            type: "single",
            tag: "recall",
            prompt: "When is a real number computable in Turing's sense?",
            options: [
              { id: "a", text: "When some machine prints its binary digits one after another without end", correct: true, feedback: "Yes." },
              { id: "b", text: "When it has finitely many digits", correct: false, feedback: "Numbers with infinite expansions, like π, are computable too." },
              { id: "c", text: "When it is a whole number", correct: false, feedback: "Far too narrow." },
            ],
            explanation: "Computable means a machine eventually prints every digit.",
          },
          {
            id: "c2",
            type: "single",
            tag: "application",
            prompt: "A machine prints 0.0110 and then loops forever, moving right on blank tape and printing nothing. What kind of machine is it?",
            options: [
              { id: "a", text: "Circular: it never prints another digit, so it defines no number", correct: true, feedback: "Right. Running forever isn't enough; it must keep printing digits." },
              { id: "b", text: "Circle-free, because it never stops", correct: false, feedback: "Circle-free means it keeps printing digits, not merely that it keeps running." },
              { id: "c", text: "Universal", correct: false, feedback: "Universality is a different property." },
            ],
            explanation: "Circle-free machines print infinitely many digits. A machine that stalls, stops or spins uselessly is circular.",
          },
          {
            id: "c3",
            type: "single",
            tag: "paper-link",
            prompt: "In this paper, which machines are the 'good' ones?",
            options: [
              { id: "a", text: "Machines that never stop printing digits", correct: true, feedback: "Yes. Turing's good machines are circle-free." },
              { id: "b", text: "Machines that halt quickly", correct: false, feedback: "That's the modern convention, not Turing's." },
            ],
            explanation: "Turing's question is whether a machine is circle-free, not whether it halts. The modern halting problem is a later reformulation.",
          },
          {
            id: "c4",
            type: "multi",
            tag: "recall",
            prompt: "Which numbers are computable?",
            options: [
              { id: "a", text: "1/3", correct: true, feedback: "Yes: 0.0101…₂ repeating." },
              { id: "b", text: "√2", correct: true, feedback: "Yes: long division or Newton's method gives every digit." },
              { id: "c", text: "π", correct: true, feedback: "Yes: many series compute it." },
            ],
            explanation: "All the familiar constants are computable. The next nodes show most real numbers are not.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "countable",
      conceptId: "math/countability",
      title: "Countable and uncountable",
      kind: "concept",
      whyYouNeedThis: "Turing shows there are only countably many machines, so only countably many computable numbers, while there are uncountably many real numbers.",
      lesson: [
        {
          heading: "Counting infinite sets",
          body: "A set is **countable** if you can list its members as first, second, third and so on, with every member appearing somewhere in the list.\n\nThe whole numbers are countable. So are the fractions: list them by the sum of numerator and denominator. Surprisingly, so is the set of all finite strings over any finite alphabet: list them by length, then alphabetically.",
        },
        {
          heading: "Machines can be listed",
          body: "Every Turing machine has a finite rule table, which can be written as a finite string, which gives a description number. So the machines can be listed in order of description number. There are only countably many machines, and so only countably many computable numbers.\n\nCantor proved in 1891 that the real numbers are **not** countable. So almost every real number is uncomputable: no machine prints its digits.",
        },
      ],
      whatWeSkip: "We skip cardinal arithmetic beyond 'countable' and 'uncountable'.",
      inThePaper: {
        text: "The introduction states that computable numbers are enumerable (countable) while the real numbers are not. Section 5 builds the enumeration from description numbers.",
        sections: ["Introduction", "§5"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "n1",
            type: "single",
            tag: "recall",
            prompt: "Why are there only countably many Turing machines?",
            options: [
              { id: "a", text: "Each machine has a finite description, and finite strings can be listed", correct: true, feedback: "Yes." },
              { id: "b", text: "Because real machines wear out", correct: false, feedback: "These are mathematical machines." },
              { id: "c", text: "Because each machine uses only two symbols", correct: false, feedback: "Even with larger alphabets the descriptions are finite strings, so countable." },
            ],
            explanation: "Finite descriptions can be listed by length and then alphabetically.",
          },
          {
            id: "n2",
            type: "single",
            tag: "application",
            prompt: "What follows from 'countably many computable numbers' and 'uncountably many real numbers'?",
            options: [
              { id: "a", text: "Most real numbers are not computable", correct: true, feedback: "Yes. The computable ones are a tiny, countable sliver." },
              { id: "b", text: "Every real number is computable", correct: false, feedback: "That would need uncountably many machines." },
              { id: "c", text: "No real number is computable", correct: false, feedback: "π, e and √2 are computable." },
            ],
            explanation: "A countable set can't cover an uncountable one.",
          },
          {
            id: "n3",
            type: "multi",
            tag: "recall",
            prompt: "Which sets are countable?",
            options: [
              { id: "a", text: "All finite strings of 0s and 1s", correct: true, feedback: "Yes: list by length, then in order." },
              { id: "b", text: "All fractions", correct: true, feedback: "Yes." },
              { id: "c", text: "All real numbers between 0 and 1", correct: false, feedback: "No. This is Cantor's theorem, proved in the next node." },
              { id: "d", text: "All Turing machines", correct: true, feedback: "Yes, via description numbers." },
            ],
            explanation: "Finite objects can be listed; the reals can't.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "diagonal",
      conceptId: "math/diagonal-argument",
      title: "The diagonal argument",
      kind: "concept",
      whyYouNeedThis: "Section 8 is titled 'Application of the diagonal process'. It is the engine of the undecidability proof.",
      lesson: [
        {
          heading: "Cantor's trick",
          body: "Suppose someone claims to have listed every infinite binary sequence:\n\n- row 1: **0**110…\n- row 2: 1**0**01…\n- row 3: 11**1**0…\n- row 4: 010**1**…\n\nBuild a new sequence by taking the $n$-th digit of the $n$-th row (the diagonal, in bold: 0, 0, 1, 1) and flipping each one: 1, 1, 0, 0…\n\nThe new sequence differs from row 1 in digit 1, from row 2 in digit 2, and so on. It is on nobody's row. So the list was incomplete, whatever it was.",
        },
        {
          heading: "Why it matters here",
          body: "The same trick works whenever you have a list and a way to read off the $n$-th digit of the $n$-th item. Turing will list the computable sequences and build their diagonal. If that diagonal could be computed, it would have to appear in the list, which it can't. Something in the construction must be impossible, and pinning down what is the heart of the paper.",
        },
      ],
      whatWeSkip: "We skip the version for decimal expansions, where 0.0999… = 0.1000… needs care. Binary sequences avoid the issue.",
      workedExample: {
        prompt: "The list begins 1010…, 0000…, 1111…, 0110…. Give the first four digits of the flipped diagonal.",
        steps: ["Diagonal digits: 1st of row 1 is 1; 2nd of row 2 is 0; 3rd of row 3 is 1; 4th of row 4 is 0.", "Flip each: 0, 1, 0, 1."],
        answer: "0101…, which differs from every listed row.",
      },
      inThePaper: {
        text: "Section 8 opens by considering the obvious diagonal objection to listing computable sequences, then shows the real conclusion: no machine can decide whether a description number belongs to a circle-free machine.",
        sections: ["§8"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "d1",
            type: "single",
            tag: "application",
            prompt: "Rows: 0011…, 1011…, 0101…, 1101…. What are the first four digits of the flipped diagonal?",
            options: [
              { id: "a", text: "1110", correct: true, feedback: "Yes. The diagonal is 0001; flipping each digit gives 1110." },
              { id: "b", text: "0001", correct: false, feedback: "That is the diagonal itself. Now flip each digit." },
              { id: "c", text: "1111", correct: false, feedback: "Check the fourth digit of the fourth row: it is 1, so it flips to 0." },
            ],
            explanation: "Row 1 digit 1 is 0, row 2 digit 2 is 0, row 3 digit 3 is 0, row 4 digit 4 is 1. The diagonal is 0001; flipped, 1110.",
          },
          {
            id: "d2",
            type: "single",
            tag: "recall",
            prompt: "Why can't the flipped diagonal be row n of the list?",
            options: [
              { id: "a", text: "It differs from row n in the n-th digit", correct: true, feedback: "Yes, by construction." },
              { id: "b", text: "It is longer than every row", correct: false, feedback: "All the sequences are infinite." },
              { id: "c", text: "It has more 1s than any row", correct: false, feedback: "Not necessarily." },
            ],
            explanation: "The n-th digit was flipped from row n, so they disagree there.",
          },
          {
            id: "d3",
            type: "single",
            tag: "paper-link",
            prompt: "Computable sequences are countable, so they can be listed. Why doesn't Turing's diagonal show a contradiction in the list itself?",
            options: [
              { id: "a", text: "Because no machine can produce that list: telling circle-free machines from circular ones is not mechanical", correct: true, feedback: "Yes. The list exists, but it can't be computed, so its diagonal isn't computable." },
              { id: "b", text: "Because computable sequences are uncountable after all", correct: false, feedback: "They are countable; that isn't where the argument breaks." },
              { id: "c", text: "Because the diagonal argument only works for decimals", correct: false, feedback: "It works for binary sequences too." },
            ],
            explanation: "The flaw lies in assuming the list can be generated by a machine. That would need a machine to recognise circle-free descriptions.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "universal",
      conceptId: "computation/universal-machine",
      title: "The universal machine",
      kind: "concept",
      whyYouNeedThis: "The undecidability proof needs a machine that can simulate any other machine from its description.",
      lesson: [
        {
          heading: "One machine to run them all",
          body: "Turing builds a single machine $U$ that takes the description of any machine $M$ written on its tape and then prints exactly what $M$ would print.\n\n$U$ works like a very patient clerk: it keeps a record of $M$'s tape and state, looks up the matching rule in $M$'s description, applies it to the record, and repeats.",
        },
        {
          heading: "Programs are data",
          body: "Before $U$, a machine was built for one job. $U$ shows that a fixed machine becomes any machine you like when given the right description. This is the idea of the stored-program computer: hardware stays the same, software changes.\n\nIt also means questions about machines become questions about strings on a tape, which other machines could, in principle, read and answer. Section 8 asks which of those questions can actually be answered.",
        },
      ],
      whatWeSkip: "We skip section 7's detailed construction of U from skeleton tables. It is long and mechanical.",
      interactive: {
        widget: "turing-machine",
        params: {
          tape: "111+11",
          blank: "_",
          start: "find",
          halt: ["done"],
          rules: [
            { state: "find", read: "1", write: "1", move: "R", next: "find" },
            { state: "find", read: "+", write: "1", move: "R", next: "toend" },
            { state: "toend", read: "1", write: "1", move: "R", next: "toend" },
            { state: "toend", read: "_", write: "_", move: "L", next: "erase" },
            { state: "erase", read: "1", write: "_", move: "N", next: "done" },
          ],
          maxSteps: 40,
        },
        caption: "A machine that adds in unary: 111+11 becomes 11111. A universal machine could run this same table after reading it off its own tape.",
        altText: "A tape reading 111+11 is turned into 11111 by replacing the plus sign with 1 and erasing the final 1.",
      },
      inThePaper: {
        text: "Section 6 states the existence of the universal computing machine; section 7 constructs it in detail.",
        sections: ["§6", "§7"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "u1",
            type: "single",
            tag: "recall",
            prompt: "What does Turing's universal machine U do?",
            options: [
              { id: "a", text: "Given the description of any machine M, it prints what M would print", correct: true, feedback: "Yes." },
              { id: "b", text: "It decides whether any machine is circle-free", correct: false, feedback: "The paper proves no machine can do that." },
              { id: "c", text: "It computes every real number", correct: false, feedback: "Only countably many reals are computable." },
            ],
            explanation: "U simulates M from M's description.",
          },
          {
            id: "u2",
            type: "single",
            tag: "application",
            prompt: "Your laptop runs a spreadsheet, a game and a browser without new hardware. Which idea from the paper is this?",
            options: [
              { id: "a", text: "Universality: one machine runs any program given as data", correct: true, feedback: "Yes." },
              { id: "b", text: "The diagonal argument", correct: false, feedback: "That's about limits, not flexibility." },
              { id: "c", text: "Computable numbers", correct: false, feedback: "Related, but the key idea is universality." },
            ],
            explanation: "Stored programs are the practical form of U.",
          },
          {
            id: "u3",
            type: "numeric",
            tag: "application",
            prompt: "The unary adder in the widget starts on 1111+111. How many 1s are on the tape when it halts?",
            answer: 7,
            tolerance: 0,
            explanation: "4 + 3 = 7. The + becomes a 1 (giving 8 ones) and the last 1 is erased.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "undecidable",
      conceptId: "computation/undecidability",
      title: "Undecidable: the circle-free problem",
      kind: "concept",
      whyYouNeedThis: "This is the central theorem. The Entscheidungsproblem result in section 11 is derived from it.",
      lesson: [
        {
          heading: "The question no machine answers",
          body: "Is there a machine $D$ that, given any description number, decides whether that machine is circle-free?\n\nSuppose $D$ exists. Combine it with the universal machine to build $H$: $H$ runs through description numbers $1, 2, 3, \\ldots$, uses $D$ to skip circular machines, and for the $n$-th circle-free machine uses $U$ to find its $n$-th digit, then prints that digit. $H$ is circle-free, so it has its own description number $K$.",
        },
        {
          heading: "The contradiction",
          body: "What does $H$ do when it reaches its own number $K$? It must run itself to find its own $n$-th digit, where $n$ is its position among circle-free machines. That calculation needs the very digit it is trying to compute, so $H$ loops forever at that point and never prints it. But then $H$ is circular, contradicting that it is circle-free.\n\nSo $D$ can't exist. **Deciding circle-freeness is impossible for any machine.** Turing then shows that deciding whether a machine ever prints a given symbol is impossible too. Today the standard example is the **halting problem**, a reformulation made popular in the 1950s.",
        },
      ],
      whatWeSkip: "We skip the second argument in §8 about machines that ever print 0, beyond noting it exists.",
      inThePaper: {
        text: "Section 8 contains the argument above, with Turing's names D, H and K.",
        sections: ["§8"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "h1",
            type: "order",
            tag: "paper-link",
            prompt: "Put the steps of Turing's argument in order.",
            items: [
              { id: "a", text: "Assume a machine D decides whether any machine is circle-free" },
              { id: "b", text: "Build H from D and U to compute the diagonal of circle-free machines" },
              { id: "c", text: "H must be circle-free, so it has a description number K" },
              { id: "d", text: "At step K, H needs its own unfinished digit and gets stuck" },
              { id: "e", text: "So D cannot exist" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Assume, construct, locate the machine in its own list, derive the contradiction, reject the assumption.",
          },
          {
            id: "h2",
            type: "single",
            tag: "recall",
            prompt: "What is proved impossible in section 8?",
            options: [
              { id: "a", text: "A machine that decides, from a description number, whether that machine is circle-free", correct: true, feedback: "Yes." },
              { id: "b", text: "A universal machine", correct: false, feedback: "U exists; section 6 builds it." },
              { id: "c", text: "Computing π", correct: false, feedback: "π is computable." },
            ],
            explanation: "No algorithm separates circle-free from circular machines.",
          },
          {
            id: "h3",
            type: "single",
            tag: "application",
            prompt: "A company promises a tool that checks any program and reports whether it will ever get stuck in an infinite loop. What does Turing's result imply?",
            options: [
              { id: "a", text: "No tool can do this correctly for every program; it must sometimes be wrong or give no answer", correct: true, feedback: "Yes. Real checkers work on restricted programs or allow 'don't know'." },
              { id: "b", text: "The tool is fine if the computer is fast enough", correct: false, feedback: "Speed doesn't help; the limit is logical." },
              { id: "c", text: "The tool works as long as it is written in a modern language", correct: false, feedback: "Every general-purpose language is subject to the result." },
            ],
            explanation: "Undecidability applies to every general-purpose programming system.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "paper",
      conceptId: "paper/turing-1936",
      title: "The paper: no answer to the Entscheidungsproblem",
      kind: "paper",
      whyYouNeedThis: "You now have every idea the paper uses. This last node connects them to Turing's answer to Hilbert.",
      lesson: [
        {
          heading: "From machines to logic",
          body: "In section 11 Turing writes, for any machine $M$, a formula of first-order logic that is provable exactly when $M$ ever prints the symbol 0. If a decision procedure for provability existed, it would decide whether any machine ever prints 0, which section 8 showed impossible.\n\nSo **there is no general method for deciding provability in first-order logic**. The Entscheidungsproblem has a negative answer.",
        },
        {
          heading: "Church got there first, by a different road",
          body: "Alonzo Church reached the same conclusion months earlier using the lambda calculus. Turing added an appendix proving that his computable functions are the same as Church's λ-definable ones. The agreement of two very different definitions is strong evidence for the Church–Turing thesis.\n\nWhat made Turing's version last is the machine: a picture of computation concrete enough to build. Within a decade, stored-program computers based on the universal machine idea were running.",
        },
      ],
      whatWeSkip: "We skip the detailed logical formulas in section 11 and the corrections Turing published in 1937.",
      inThePaper: {
        text: "Read the introduction and sections 1 to 3 first; they will now read easily. Then section 6 (universal machine), section 8 (the diagonal process) and section 11 (the Entscheidungsproblem).",
        sections: ["Introduction", "§1–3", "§6", "§8", "§11", "Appendix"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "p1",
            type: "single",
            tag: "paper-link",
            prompt: "How does Turing get from machines to the Entscheidungsproblem?",
            options: [
              { id: "a", text: "He writes a logical formula that is provable exactly when a given machine ever prints 0", correct: true, feedback: "Yes. A provability decider would then decide an undecidable machine question." },
              { id: "b", text: "He builds a machine that proves every theorem", correct: false, feedback: "That would be a positive answer." },
              { id: "c", text: "He counts the number of logical formulas", correct: false, feedback: "Counting alone doesn't give undecidability." },
            ],
            explanation: "This is a reduction: a solution to the logic problem would give a solution to an impossible machine problem.",
          },
          {
            id: "p2",
            type: "order",
            tag: "paper-link",
            prompt: "Order the ideas as the paper builds them.",
            items: [
              { id: "a", text: "Define machines and computable numbers" },
              { id: "b", text: "Encode machines as description numbers" },
              { id: "c", text: "Build the universal machine" },
              { id: "d", text: "Diagonal argument: circle-freeness is undecidable" },
              { id: "e", text: "Reduce the Entscheidungsproblem to it" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Sections 1–3, 5, 6–7, 8, then 11.",
          },
          {
            id: "p3",
            type: "single",
            tag: "recall",
            prompt: "What did the appendix establish?",
            options: [
              { id: "a", text: "Turing-computable and Church's λ-definable functions are the same", correct: true, feedback: "Yes." },
              { id: "b", text: "The universal machine can be built from valves", correct: false, feedback: "No engineering in the paper." },
              { id: "c", text: "Hilbert's question has a positive answer", correct: false, feedback: "The answer is negative." },
            ],
            explanation: "Two independent definitions coincide, supporting the thesis that they capture computation itself.",
          },
          {
            id: "p4",
            type: "multi",
            tag: "application",
            prompt: "Which modern ideas trace back to this paper?",
            options: [
              { id: "a", text: "Stored-program computers", correct: true, feedback: "Yes, via the universal machine." },
              { id: "b", text: "Limits on automatic program analysis", correct: true, feedback: "Yes, via undecidability." },
              { id: "c", text: "The idea that programs are data", correct: true, feedback: "Yes, via description numbers." },
              { id: "d", text: "The transistor", correct: false, feedback: "That came from physics at Bell Labs in 1947." },
            ],
            explanation: "Universality and undecidability both run through modern computing.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
  ],
  edges: [
    { from: "algorithm", to: "machine" },
    { from: "symbols", to: "machine" },
    { from: "machine", to: "computable" },
    { from: "symbols", to: "countable" },
    { from: "countable", to: "diagonal" },
    { from: "machine", to: "universal" },
    { from: "computable", to: "undecidable" },
    { from: "diagonal", to: "undecidable" },
    { from: "universal", to: "undecidable" },
    { from: "undecidable", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Introduction and §1–3", focus: "Machines, computable numbers, and the b, c, e, f example you already stepped through.", conceptIds: ["machine", "computable"] },
    { section: "§5", focus: "How machines become description numbers. Skim the letter code.", conceptIds: ["symbols", "countable"] },
    { section: "§6", focus: "The statement of the universal machine. §7's construction can be skimmed.", conceptIds: ["universal"] },
    { section: "§8", focus: "The diagonal argument. Read slowly; it is two pages.", conceptIds: ["diagonal", "undecidable"] },
    { section: "§11 and Appendix", focus: "The reduction to logic, and the equivalence with Church's λ-definability.", conceptIds: ["paper"] },
  ],
};

export default withVisuals(turing, visuals);
