import type { Journey } from "../schema";
import { withVisuals } from "../diagram";
import visuals from "./visuals/shannon";

const shannon: Journey = {
  id: "shannon-1948",
  title: "How much can a message carry?",
  subtitle: "Shannon measures information in bits and finds the speed limit of every communication channel.",
  paper: {
    title: "A Mathematical Theory of Communication",
    authors: ["Claude E. Shannon"],
    year: 1948,
    venue: "Bell System Technical Journal",
    url: "https://doi.org/10.1002/j.1538-7305.1948.tb01338.x",
    doi: "10.1002/j.1538-7305.1948.tb01338.x",
  },
  field: "Information theory",
  accent: "#0891b2",
  level: "intermediate",
  source: "curated",
  summary:
    "Shannon separated the meaning of a message from the engineering problem of sending it. He treated messages as random choices, defined how much information a choice carries, and proved two limits: how far a message can be compressed, and how fast it can be sent through a noisy channel with as few errors as you like.",
  whyItMatters:
    "Every zip file, phone call, Wi-Fi link and deep-space probe works within the limits in this paper. It also gave us the word 'bit' in print and the idea that noise can be beaten by clever coding rather than more power.",
  nodes: [
    {
      id: "probability",
      conceptId: "math/probability-distributions",
      title: "Probability distributions",
      kind: "concept",
      whyYouNeedThis: "Shannon treats a message source as something that produces symbols at random with known probabilities. Every formula in the paper is built from those probabilities.",
      lesson: [
        {
          heading: "Outcomes and their chances",
          body: "A **probability distribution** lists the possible outcomes and how likely each is. The probabilities are between 0 and 1 and add up to 1.\n\nIn English text the letter E appears about 12% of the time and Z about 0.1%. So a source producing English letters has a very uneven distribution. A fair coin has the even distribution: heads 0.5, tails 0.5.",
        },
        {
          heading: "Independence and conditional probability",
          body: "Two events are **independent** when knowing one tells you nothing about the other. Then $P(A \\text{ and } B) = P(A)P(B)$.\n\nLetters in English are not independent: after Q, U is almost certain. The **conditional probability** $P(B \\mid A)$ is the chance of B given that A happened. Shannon uses conditional probabilities to describe both the structure of language and the effect of noise: the chance of receiving 1 given that 0 was sent.",
        },
      ],
      whatWeSkip: "We skip continuous distributions and probability densities, which Shannon needs only in Part III.",
      workedExample: {
        prompt: "A source sends A with probability 0.5, B with 0.25, C and D with 0.125 each. What is the chance of the two-symbol message AB if symbols are independent?",
        steps: ["Independence means multiply: $P(A)P(B)$.", "$0.5 \\times 0.25 = 0.125$."],
        answer: "0.125",
      },
      inThePaper: {
        text: "Part I models a source as a stochastic (random) process and gives a series of approximations to English, from independent random letters to letters chosen with the right conditional probabilities.",
        sections: ["§2", "§3"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "pr1",
            type: "numeric",
            tag: "application",
            prompt: "A source sends X with probability 0.6 and Y with 0.4, independently. What is the probability of the message XXY?",
            answer: 0.144,
            tolerance: 0.001,
            explanation: "$0.6 \\times 0.6 \\times 0.4 = 0.144$.",
          },
          {
            id: "pr2",
            type: "single",
            tag: "recall",
            prompt: "Which list could be a probability distribution over four symbols?",
            options: [
              { id: "a", text: "0.4, 0.3, 0.2, 0.1", correct: true, feedback: "Yes: all between 0 and 1, summing to 1." },
              { id: "b", text: "0.5, 0.5, 0.5, 0.5", correct: false, feedback: "These add up to 2." },
              { id: "c", text: "0.7, 0.4, −0.2, 0.1", correct: false, feedback: "Probabilities can't be negative." },
            ],
            explanation: "Each probability lies in [0, 1] and they sum to 1.",
          },
          {
            id: "pr3",
            type: "single",
            tag: "paper-link",
            prompt: "Why does Shannon model English as a random source?",
            options: [
              { id: "a", text: "Engineering only needs the statistics of the messages, not their meaning", correct: true, feedback: "Yes. He says the semantic aspects are irrelevant to the engineering problem." },
              { id: "b", text: "Because English sentences are truly random", correct: false, feedback: "They aren't; the model captures their statistics." },
              { id: "c", text: "Because telegraph operators typed randomly", correct: false, feedback: "No." },
            ],
            explanation: "A system must work for whatever message is chosen, so what matters is the set of possible messages and their probabilities.",
          },
          {
            id: "pr4",
            type: "single",
            tag: "application",
            prompt: "In English, P(U | previous letter is Q) is close to",
            options: [
              { id: "a", text: "1", correct: true, feedback: "Yes. U almost always follows Q." },
              { id: "b", text: "1/26", correct: false, feedback: "That would be true only if letters were independent and equally likely." },
              { id: "c", text: "0", correct: false, feedback: "The opposite." },
            ],
            explanation: "Conditional probabilities capture the structure that makes English predictable.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "logs",
      conceptId: "math/logarithms-base-2",
      title: "Logarithms and bits",
      kind: "concept",
      whyYouNeedThis: "Shannon measures information with logarithms. Using base 2 gives the unit he calls the bit.",
      lesson: [
        {
          heading: "Counting yes-or-no questions",
          body: "How many yes/no questions do you need to identify one of 8 equally likely cards? Halve the options each time: 8, 4, 2, 1. Three questions. That is $\\log_2 8 = 3$.\n\nIn general, picking one of $N$ equally likely options takes $\\log_2 N$ binary choices. One binary choice is one **bit**. Shannon credits the word to John Tukey.",
        },
        {
          heading: "Why a logarithm",
          body: "Two independent choices should carry the sum of their information. Choosing one of 8 cards and one of 4 coins gives $8 \\times 4 = 32$ combinations, and $\\log_2 32 = 5 = 3 + 2$. Logarithms turn products into sums, which is exactly the property wanted.\n\nUseful facts: $\\log_2 1 = 0$, $\\log_2 2 = 1$, $\\log_2 \\tfrac12 = -1$, and $\\log_2 x < 0$ when $x < 1$.",
        },
      ],
      whatWeSkip: "We skip other bases (natural logs give 'nats') beyond noting that they only change the unit.",
      workedExample: {
        prompt: "How many bits identify one of 1,024 equally likely messages?",
        steps: ["$1024 = 2^{10}$.", "$\\log_2 1024 = 10$."],
        answer: "10 bits",
      },
      inThePaper: {
        text: "Section 1 argues for the logarithm as the measure of information and introduces 'bits' (binary digits) as the unit when the base is 2.",
        sections: ["§1"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "l1",
            type: "numeric",
            tag: "application",
            prompt: "How many bits are needed to pick one of 64 equally likely options?",
            answer: 6,
            tolerance: 0,
            explanation: "$2^6 = 64$, so $\\log_2 64 = 6$.",
          },
          {
            id: "l2",
            type: "numeric",
            tag: "application",
            prompt: "What is $\\log_2 \\tfrac14$?",
            answer: -2,
            tolerance: 0,
            explanation: "$2^{-2} = \\tfrac14$.",
          },
          {
            id: "l3",
            type: "single",
            tag: "recall",
            prompt: "Why is a logarithm the right measure of information?",
            options: [
              { id: "a", text: "Information from independent choices adds, while the number of combinations multiplies", correct: true, feedback: "Yes. Logs turn multiplication into addition." },
              { id: "b", text: "Because computers use logarithm tables", correct: false, feedback: "No." },
              { id: "c", text: "Because it makes numbers smaller", correct: false, feedback: "That's a side effect, not the reason." },
            ],
            explanation: "Additivity for independent choices is the key property.",
          },
          {
            id: "l4",
            type: "single",
            tag: "paper-link",
            prompt: "Who does Shannon credit with the word 'bit'?",
            options: [
              { id: "a", text: "John Tukey", correct: true, feedback: "Yes." },
              { id: "b", text: "Alan Turing", correct: false, feedback: "No." },
              { id: "c", text: "Harry Nyquist", correct: false, feedback: "Nyquist and Hartley are cited for earlier work on information, not the word." },
            ],
            explanation: "Shannon notes the name 'bit' was suggested by J. W. Tukey.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "entropy",
      conceptId: "information/entropy",
      title: "Entropy: average surprise",
      kind: "concept",
      whyYouNeedThis: "Entropy is the central quantity of the paper. Both main theorems are stated in terms of it.",
      lesson: [
        {
          heading: "The formula",
          body: "An outcome with probability $p$ carries $\\log_2 \\tfrac1p$ bits of surprise. Rare events surprise you more. The **entropy** of a source is the average surprise over its outcomes:\n\n$$H = -\\sum_i p_i \\log_2 p_i$$\n\nFor a fair coin, $H = 1$ bit. For a coin that lands heads 90% of the time, $H \\approx 0.47$ bits: you can usually guess the result, so each toss tells you less.",
        },
        {
          heading: "Properties",
          body: "- $H = 0$ only when one outcome is certain.\n- For $n$ outcomes, $H$ is largest, $\\log_2 n$, when all are equally likely.\n- Entropies of independent sources add.\n\nShannon proves in Theorem 2 that this is the only formula, up to a choice of units, satisfying three natural requirements: continuity, growth with the number of equal options, and consistency when a choice is broken into stages.",
        },
      ],
      whatWeSkip: "We skip the proof of Theorem 2 in Appendix 2, and the link to entropy in thermodynamics beyond its name.",
      interactive: {
        widget: "entropy-calculator",
        params: { labels: ["A", "B", "C", "D"], weights: [4, 2, 1, 1] },
        caption: "Adjust how likely each symbol is. Entropy peaks at 2 bits when all four are equal and falls to 0 when one is certain.",
        altText: "A bar chart of four symbol probabilities with sliders, and a readout of the entropy in bits.",
      },
      workedExample: {
        prompt: "Find $H$ for probabilities $\\tfrac12, \\tfrac14, \\tfrac18, \\tfrac18$.",
        steps: [
          "Surprises: $\\log_2 2 = 1$, $\\log_2 4 = 2$, $\\log_2 8 = 3$, $3$.",
          "Weight by probability: $\\tfrac12(1) + \\tfrac14(2) + \\tfrac18(3) + \\tfrac18(3)$.",
          "$= 0.5 + 0.5 + 0.375 + 0.375$.",
        ],
        answer: "$H = 1.75$ bits per symbol",
      },
      inThePaper: {
        text: "Section 6, 'Choice, Uncertainty and Entropy', introduces $H$, proves its uniqueness (Theorem 2) and plots the entropy of a two-outcome source.",
        sections: ["§6", "Appendix 2"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "e1",
            type: "numeric",
            tag: "application",
            prompt: "What is the entropy, in bits, of a fair six-sided die? (2 decimal places)",
            answer: 2.585,
            tolerance: 0.01,
            explanation: "Six equally likely outcomes: $\\log_2 6 \\approx 2.585$ bits.",
          },
          {
            id: "e2",
            type: "single",
            tag: "recall",
            prompt: "When is the entropy of a source zero?",
            options: [
              { id: "a", text: "When one outcome is certain", correct: true, feedback: "Yes. No uncertainty, no information." },
              { id: "b", text: "When all outcomes are equally likely", correct: false, feedback: "That gives the maximum entropy." },
              { id: "c", text: "Never", correct: false, feedback: "A certain outcome has zero entropy." },
            ],
            explanation: "Entropy measures uncertainty; a certain outcome has none.",
          },
          {
            id: "e3",
            type: "single",
            tag: "application",
            prompt: "Source X has outcomes 0.25, 0.25, 0.25, 0.25. Source Y has 0.7, 0.1, 0.1, 0.1. Which has higher entropy?",
            options: [
              { id: "a", text: "X", correct: true, feedback: "Yes: 2 bits, the maximum for four outcomes." },
              { id: "b", text: "Y", correct: false, feedback: "Y is more predictable, so lower entropy (about 1.36 bits)." },
              { id: "c", text: "They are equal", correct: false, feedback: "Same number of outcomes, different spread." },
            ],
            explanation: "Even spread maximises entropy.",
          },
          {
            id: "e4",
            type: "single",
            tag: "paper-link",
            prompt: "What does Shannon's Theorem 2 show?",
            options: [
              { id: "a", text: "$-\\sum p \\log p$ is the only measure satisfying his three requirements, up to units", correct: true, feedback: "Yes." },
              { id: "b", text: "Every channel has infinite capacity", correct: false, feedback: "No." },
              { id: "c", text: "English has an entropy of exactly 1 bit per letter", correct: false, feedback: "He estimates English's redundancy, but that isn't Theorem 2." },
            ],
            explanation: "The formula is forced by the requirements, not chosen for convenience.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "source",
      conceptId: "information/sources-and-redundancy",
      title: "Sources, structure and redundancy",
      kind: "concept",
      whyYouNeedThis: "Shannon applies entropy to real sources like English, where each letter depends on the ones before. That structure is what compression removes.",
      lesson: [
        {
          heading: "Approximations to English",
          body: "Shannon generated text by chance at increasing levels of realism. Letters chosen independently and uniformly give gibberish. Letters chosen with English frequencies look slightly better. Choosing each letter based on the previous one or two (a **Markov source**) starts to produce word-like strings.\n\nEach step captures more of the structure of English, and each step lowers the entropy per letter, because the next letter becomes more predictable.",
        },
        {
          heading: "Redundancy",
          body: "With 27 symbols (26 letters and space) the maximum entropy is $\\log_2 27 \\approx 4.75$ bits per symbol. The actual entropy of English, accounting for long-range structure, is far lower. Shannon estimates English is roughly **50% redundant**: about half of what we write is determined by the structure of the language rather than chosen freely.\n\nRedundancy is waste for storage, but useful for error correction: you can read a sentence with missing letters.",
        },
      ],
      whatWeSkip: "We skip ergodic sources and the formal definition of entropy rate for a Markov process.",
      inThePaper: {
        text: "Section 3 gives the series of approximations to English. Section 7 defines the entropy of a source, and discusses the redundancy of English as roughly 50%.",
        sections: ["§3", "§7"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "so1",
            type: "single",
            tag: "recall",
            prompt: "Why does making each letter depend on previous letters lower the entropy per letter?",
            options: [
              { id: "a", text: "The next letter becomes more predictable", correct: true, feedback: "Yes." },
              { id: "b", text: "There are fewer letters in the alphabet", correct: false, feedback: "The alphabet is unchanged." },
              { id: "c", text: "Entropy only counts vowels", correct: false, feedback: "No." },
            ],
            explanation: "More context, less uncertainty.",
          },
          {
            id: "so2",
            type: "numeric",
            tag: "application",
            prompt: "A source has entropy 2 bits per symbol and could have 4 bits per symbol with the same alphabet if symbols were independent and equally likely. What fraction is redundant? (as a decimal)",
            answer: 0.5,
            tolerance: 0.001,
            explanation: "Redundancy $= 1 - H/H_{max} = 1 - 2/4 = 0.5$.",
          },
          {
            id: "so3",
            type: "single",
            tag: "paper-link",
            prompt: "Roughly how redundant does Shannon estimate English to be?",
            options: [
              { id: "a", text: "About 50%", correct: true, feedback: "Yes, for structure extending about eight letters." },
              { id: "b", text: "About 5%", correct: false, feedback: "Far too low." },
              { id: "c", text: "About 99%", correct: false, feedback: "Too high." },
            ],
            explanation: "Half of English text is determined by the language's statistics.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "coding",
      conceptId: "information/source-coding",
      title: "Compression down to the entropy",
      kind: "concept",
      whyYouNeedThis: "Shannon's first main theorem says a source can be encoded using about $H$ bits per symbol and no fewer.",
      lesson: [
        {
          heading: "Short codes for common symbols",
          body: "Morse code gives E a single dot because E is common. The same idea, done carefully, gives an optimal code. For probabilities $\\tfrac12, \\tfrac14, \\tfrac18, \\tfrac18$ use codewords 0, 10, 110, 111. No codeword starts another, so a string like 010110 splits uniquely into A, B, C.\n\nAverage length: $\\tfrac12(1) + \\tfrac14(2) + \\tfrac18(3) + \\tfrac18(3) = 1.75$ bits, exactly the entropy.",
        },
        {
          heading: "The noiseless coding theorem",
          body: "Shannon proves that for long messages you can encode a source using as close to $H$ bits per symbol as you like, and that no code can do better on average. Equivalently, over a channel carrying $C$ bits per second you can send about $C/H$ symbols per second, and no more.\n\nThis turns entropy from an abstract average into a hard number: the size of the best possible zip file.",
        },
      ],
      whatWeSkip: "We skip Huffman's 1952 algorithm, which finds the best symbol-by-symbol code, and Shannon–Fano coding details.",
      workedExample: {
        prompt: "Decode 1100100111 with the code A=0, B=10, C=110, D=111.",
        steps: ["110 → C", "0 → A", "10 → B", "0 → A", "111 → D"],
        answer: "CABAD",
      },
      inThePaper: {
        text: "Section 9, 'The Fundamental Theorem for a Noiseless Channel', states that a source can be sent at $C/H - \\epsilon$ symbols per second but not faster than $C/H$. The proof sketches a code built by ordering messages by probability.",
        sections: ["§9"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "co1",
            type: "numeric",
            tag: "application",
            prompt: "Symbols have probabilities 0.5, 0.5 and are coded as 0 and 1. What is the average code length in bits?",
            answer: 1,
            tolerance: 0,
            explanation: "Each symbol uses 1 bit, matching the entropy of 1 bit.",
          },
          {
            id: "co2",
            type: "single",
            tag: "recall",
            prompt: "What does the noiseless coding theorem say?",
            options: [
              { id: "a", text: "Long messages can be encoded in about H bits per symbol, and not fewer on average", correct: true, feedback: "Yes." },
              { id: "b", text: "Any message can be compressed to a single bit", correct: false, feedback: "Entropy is a hard lower limit." },
              { id: "c", text: "Compression always loses information", correct: false, feedback: "This theorem is about lossless coding." },
            ],
            explanation: "Entropy is the achievable limit of lossless compression.",
          },
          {
            id: "co3",
            type: "numeric",
            tag: "paper-link",
            prompt: "A channel carries 1,000 bits per second. A source has entropy 2 bits per symbol. About how many symbols per second can it carry at best?",
            answer: 500,
            tolerance: 1,
            explanation: "$C/H = 1000/2 = 500$ symbols per second.",
          },
          {
            id: "co4",
            type: "single",
            tag: "application",
            prompt: "Why must no codeword be the start of another (a prefix code)?",
            options: [
              { id: "a", text: "So a stream of bits can be split into symbols without separators", correct: true, feedback: "Yes." },
              { id: "b", text: "To make the code shorter", correct: false, feedback: "It's about unique decoding." },
              { id: "c", text: "Because channels can't send the same codeword twice", correct: false, feedback: "No." },
            ],
            explanation: "Prefix codes decode unambiguously as you read left to right.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "noise",
      conceptId: "information/noisy-channel",
      title: "Noisy channels",
      kind: "concept",
      whyYouNeedThis: "Part II of the paper is about channels that corrupt symbols. You need the simplest model of one: the binary symmetric channel.",
      lesson: [
        {
          heading: "The binary symmetric channel",
          body: "Send a bit. With probability $p$ the channel flips it; otherwise it arrives intact. That is the **binary symmetric channel**, the standard toy model of a noisy wire.\n\nWith $p = 0.01$, one bit in a hundred arrives wrong, at random positions. The receiver can't tell which.",
        },
        {
          heading: "The obvious fix, and its cost",
          body: "Send each bit three times and take a majority vote. A bit is now wrong only if two or three copies flip: probability $3p^2(1-p) + p^3$. For $p = 0.01$ that is about 0.0003, a big improvement.\n\nBut you now send three bits per message bit, so the rate drops to $\\tfrac13$. Making errors even rarer this way needs ever more repetition and ever lower rates. Before Shannon, engineers assumed this trade-off was unavoidable.",
        },
      ],
      whatWeSkip: "We skip channels with memory and continuous channels with Gaussian noise.",
      interactive: {
        widget: "channel-noise",
        params: { message: "1011001110100101", flipProbability: 0.1 },
        caption: "Send a message through a channel that flips bits with probability p. Turn on the repetition code to trade rate for reliability.",
        altText: "A row of sent bits, the received bits with flipped ones highlighted, and optional majority-vote decoding.",
      },
      inThePaper: {
        text: "Section 11 models a noisy channel by the probabilities of each received symbol given each sent symbol.",
        sections: ["§11"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "n1",
            type: "numeric",
            tag: "application",
            prompt: "A binary symmetric channel has flip probability 0.1. Using a 3-fold repetition code with majority vote, what is the probability a message bit is decoded wrongly? (3 decimal places)",
            answer: 0.028,
            tolerance: 0.001,
            explanation: "$3(0.1)^2(0.9) + (0.1)^3 = 0.027 + 0.001 = 0.028$.",
          },
          {
            id: "n2",
            type: "single",
            tag: "recall",
            prompt: "What is the cost of the 3-fold repetition code?",
            options: [
              { id: "a", text: "The rate drops to one third", correct: true, feedback: "Yes: three channel bits per message bit." },
              { id: "b", text: "Errors become more likely", correct: false, feedback: "Errors become less likely for small p." },
              { id: "c", text: "The receiver needs to know which bits flipped", correct: false, feedback: "Majority vote works without knowing." },
            ],
            explanation: "Reliability was bought with rate.",
          },
          {
            id: "n3",
            type: "single",
            tag: "paper-link",
            prompt: "Before Shannon, what did engineers assume about noise?",
            options: [
              { id: "a", text: "That reducing errors further always meant reducing the rate further", correct: true, feedback: "Yes. Shannon's theorem overturns this." },
              { id: "b", text: "That noise could be ignored", correct: false, feedback: "Noise was a central concern." },
              { id: "c", text: "That digital signals had no noise", correct: false, feedback: "No." },
            ],
            explanation: "The repetition trade-off seemed fundamental. The next node shows it isn't.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "capacity",
      conceptId: "information/channel-capacity",
      title: "Channel capacity",
      kind: "concept",
      whyYouNeedThis: "The paper's most famous result: every noisy channel has a capacity, and below it you can make errors as rare as you want without slowing down further.",
      lesson: [
        {
          heading: "Equivocation",
          body: "When you receive a noisy bit, some uncertainty about what was sent remains. Shannon calls this the **equivocation**, $H(x \\mid y)$: the entropy of the input given the output.\n\nThe useful information per symbol is what you started not knowing minus what you still don't know: $R = H(x) - H(x \\mid y)$. Shannon's example: send 1,000 bits per second with $p = 0.01$. The equivocation is about 81 bits per second, so the real rate is about **919 bits per second**, not 990.",
        },
        {
          heading: "The noisy coding theorem",
          body: "The **capacity** $C$ is the largest $R$ achievable by choosing the input distribution. For the binary symmetric channel, $C = 1 - H(p)$ bits per use, where $H(p) = -p\\log_2 p - (1-p)\\log_2(1-p)$.\n\nShannon's theorem: at any rate below $C$ there are codes whose error probability is as small as you like. Above $C$ it is impossible. The price is long blocks of data coded together, not lower rates. Finding practical codes that get close to $C$ took until the 1990s (turbo codes, then LDPC codes).",
        },
      ],
      whatWeSkip: "We skip mutual information in full generality and the random-coding proof in section 13.",
      workedExample: {
        prompt: "Find the capacity of a binary symmetric channel with $p = 0.11$.",
        steps: ["$H(0.11) = -0.11\\log_2 0.11 - 0.89\\log_2 0.89$.", "$\\approx 0.11(3.18) + 0.89(0.168) \\approx 0.35 + 0.15 = 0.50$.", "$C = 1 - 0.50$."],
        answer: "About 0.5 bits per use: half the raw rate, with errors as rare as you like.",
      },
      inThePaper: {
        text: "Section 12 defines equivocation and capacity, with the 1,000 bits per second example. Section 13, 'The Fundamental Theorem for a Discrete Channel with Noise', proves the coding theorem (Theorem 11).",
        sections: ["§12", "§13"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "cap1",
            type: "numeric",
            tag: "paper-link",
            prompt: "In Shannon's example, 1,000 bits per second are sent with flip probability 0.01. The equivocation is about 81 bits per second. What is the actual information rate in bits per second?",
            answer: 919,
            tolerance: 1,
            explanation: "$1000 - 81 = 919$ bits per second.",
          },
          {
            id: "cap2",
            type: "numeric",
            tag: "application",
            prompt: "What is the capacity, in bits per use, of a binary symmetric channel with p = 0.5?",
            answer: 0,
            tolerance: 0.001,
            explanation: "$H(0.5) = 1$, so $C = 0$. The output is independent of the input.",
          },
          {
            id: "cap3",
            type: "single",
            tag: "recall",
            prompt: "What does the noisy channel coding theorem promise below capacity?",
            options: [
              { id: "a", text: "Codes with error probability as small as you like, at that rate", correct: true, feedback: "Yes." },
              { id: "b", text: "Zero errors with no coding", correct: false, feedback: "Coding is essential." },
              { id: "c", text: "Faster transmission than the channel's raw bit rate", correct: false, feedback: "Capacity is at most the raw rate." },
            ],
            explanation: "Reliability without sacrificing rate, using long codes.",
          },
          {
            id: "cap4",
            type: "single",
            tag: "application",
            prompt: "A channel's capacity is 0.5 bits per use. Can a code send 0.6 bits per use with an error rate near zero?",
            options: [
              { id: "a", text: "No: above capacity reliable communication is impossible", correct: true, feedback: "Yes. That is the converse of the theorem." },
              { id: "b", text: "Yes, with a long enough code", correct: false, feedback: "Long codes only help below capacity." },
            ],
            explanation: "Capacity is a hard ceiling.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "paper",
      conceptId: "paper/shannon-1948",
      title: "The paper: a theory of communication",
      kind: "paper",
      whyYouNeedThis: "You now have every tool the paper uses. This node shows how they fit into Shannon's model of communication.",
      lesson: [
        {
          heading: "The five boxes",
          body: "Shannon's Figure 1 splits every communication system into an **information source**, a **transmitter** (encoder), a **channel** with a noise source, a **receiver** (decoder) and a **destination**.\n\nThe paper's two theorems describe the two jobs of the transmitter: remove redundancy to compress the source down to $H$, then add structured redundancy to protect it against noise, up to capacity $C$. This separation of source coding and channel coding is still how systems are designed.",
        },
        {
          heading: "What changed",
          body: "Before 1948 there were separate theories of telegraphy, telephony and radio. Shannon gave one theory for all of them, with a single currency, the bit, and hard limits that engineers could aim at. Most of the paper's claims were existence proofs: he showed good codes exist without showing how to build them. Engineers spent the next fifty years closing the gap.",
        },
      ],
      whatWeSkip: "We skip Part III on continuous channels, including the famous formula $C = W\\log_2(1 + P/N)$, which deserves its own journey.",
      inThePaper: {
        text: "Read the introduction with Figure 1, then sections 6, 7 and 9 of Part I, then sections 11 to 13 of Part II.",
        sections: ["Introduction", "§6–7", "§9", "§11–13"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "pp1",
            type: "order",
            tag: "paper-link",
            prompt: "Order the parts of Shannon's general communication system.",
            items: [
              { id: "a", text: "Information source" },
              { id: "b", text: "Transmitter" },
              { id: "c", text: "Channel (with noise)" },
              { id: "d", text: "Receiver" },
              { id: "e", text: "Destination" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Figure 1 of the paper.",
          },
          {
            id: "pp2",
            type: "multi",
            tag: "paper-link",
            prompt: "Which limits does the paper establish?",
            options: [
              { id: "a", text: "A source can't be losslessly compressed below H bits per symbol on average", correct: true, feedback: "Yes, Part I." },
              { id: "b", text: "Reliable communication is possible at any rate below capacity", correct: true, feedback: "Yes, Part II." },
              { id: "c", text: "No code can ever correct errors", correct: false, feedback: "The opposite." },
            ],
            explanation: "Source coding and channel coding theorems.",
          },
          {
            id: "pp3",
            type: "single",
            tag: "application",
            prompt: "A phone first compresses your voice, then adds error-correcting code before transmission. Which idea from the paper is this?",
            options: [
              { id: "a", text: "Separating source coding from channel coding", correct: true, feedback: "Yes." },
              { id: "b", text: "The Markov model of English", correct: false, feedback: "Related, but not the design principle here." },
              { id: "c", text: "Continuous channels", correct: false, feedback: "Not the key idea here." },
            ],
            explanation: "Compress, then protect: the two halves of the transmitter.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
  ],
  edges: [
    { from: "probability", to: "entropy" },
    { from: "logs", to: "entropy" },
    { from: "probability", to: "source" },
    { from: "entropy", to: "source" },
    { from: "source", to: "coding" },
    { from: "probability", to: "noise" },
    { from: "entropy", to: "capacity" },
    { from: "noise", to: "capacity" },
    { from: "coding", to: "paper" },
    { from: "capacity", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Introduction", focus: "The five-box model in Figure 1 and the claim that meaning is irrelevant to the engineering problem.", conceptIds: ["paper"] },
    { section: "§1–3", focus: "Why logarithms, and the series of approximations to English.", conceptIds: ["logs", "source"] },
    { section: "§6–7", focus: "Entropy, Theorem 2 and the redundancy of English.", conceptIds: ["entropy", "source"] },
    { section: "§9", focus: "The noiseless coding theorem.", conceptIds: ["coding"] },
    { section: "§11–13", focus: "Noisy channels, equivocation, capacity and the main theorem. Skim the proof.", conceptIds: ["noise", "capacity"] },
  ],
};

export default withVisuals(shannon, visuals);
