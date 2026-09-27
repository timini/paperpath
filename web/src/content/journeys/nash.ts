import type { Journey } from "../schema";

const nash: Journey = {
  id: "nash-1950",
  title: "Where nobody wants to move",
  subtitle: "In two short pages, Nash proves every finite game has a stable point where no player gains by changing strategy.",
  paper: {
    title: "Equilibrium Points in n-Person Games",
    authors: ["John F. Nash Jr."],
    year: 1950,
    venue: "Proceedings of the National Academy of Sciences",
    url: "https://doi.org/10.1073/pnas.36.1.48",
    doi: "10.1073/pnas.36.1.48",
  },
  field: "Economics",
  accent: "#b45309",
  level: "intermediate",
  source: "curated",
  summary:
    "Von Neumann had solved two-player games where one player's gain is the other's loss. Most real situations aren't like that: firms, voters and nations can all win or all lose together. Nash, a 21-year-old graduate student, defined an equilibrium for any number of players with any payoffs, and proved one always exists if players can randomise.",
  whyItMatters:
    "Nash equilibrium became the basic tool for analysing strategic behaviour in economics, political science, biology and computer science, from auctions and price wars to evolution and network routing. It earned Nash a share of the 1994 Nobel memorial prize in economics.",
  nodes: [
    {
      id: "games",
      conceptId: "game-theory/normal-form-games",
      title: "Players, strategies, payoffs",
      kind: "concept",
      whyYouNeedThis: "The paper is about n-person games. You need the standard way of writing one down: who plays, what they can do, and what each outcome is worth to each player.",
      lesson: [
        {
          heading: "A game as a table",
          body: "A game in **normal form** has three ingredients:\n\n- **players**, say two firms or two suspects;\n- a set of **strategies** for each player, chosen at the same time without seeing the other's choice;\n- a **payoff** for every player for every combination of strategies.\n\nFor two players with two strategies each, this fits in a 2×2 table. Each cell holds two numbers: the row player's payoff, then the column player's.",
        },
        {
          heading: "The prisoner's dilemma",
          body: "Two partners can each Cooperate or Defect. Both cooperating pays 3 each. Both defecting pays 1 each. If one defects on a cooperator, the defector gets 5 and the cooperator 0.\n\nWhatever the other does, defecting pays more: 5 > 3 if they cooperate, 1 > 0 if they defect. So both defect and get 1, though both cooperating would give each 3. Individual reasoning leads to a collectively worse result. That tension is why game theory needs more than 'maximise your payoff'.",
        },
      ],
      whatWeSkip: "We skip games in extensive form (game trees) and games with incomplete information.",
      interactive: {
        widget: "payoff-matrix",
        params: {
          rowPlayer: "You", colPlayer: "Partner",
          rowLabels: ["Cooperate", "Defect"], colLabels: ["Cooperate", "Defect"],
          payoffs: [[[3, 3], [0, 5]], [[5, 0], [1, 1]]],
          showMixed: false,
        },
        caption: "The prisoner's dilemma. Show each player's best replies, then both, to find where neither wants to change.",
        altText: "A 2×2 payoff table for the prisoner's dilemma with buttons to highlight best replies and the equilibrium at Defect, Defect.",
      },
      inThePaper: {
        text: "The paper's first sentence defines an n-person game: each player has a finite set of pure strategies, and each player has a payoff function assigning a number to each combination.",
        sections: ["Opening definitions"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "g1",
            type: "multi",
            tag: "recall",
            prompt: "Which are part of a game in normal form?",
            options: [
              { id: "a", text: "A set of players", correct: true, feedback: "Yes." },
              { id: "b", text: "Each player's strategies", correct: true, feedback: "Yes." },
              { id: "c", text: "A payoff for each player in each outcome", correct: true, feedback: "Yes." },
              { id: "d", text: "The order in which players move", correct: false, feedback: "In normal form, players choose simultaneously." },
            ],
            explanation: "Players, strategies, payoffs.",
          },
          {
            id: "g2",
            type: "single",
            tag: "application",
            prompt: "In the prisoner's dilemma above, your partner will Cooperate. What should you do to maximise your own payoff?",
            options: [
              { id: "a", text: "Defect (5 beats 3)", correct: true, feedback: "Yes." },
              { id: "b", text: "Cooperate (3 beats 0)", correct: false, feedback: "You're comparing the wrong cells: compare your payoffs in the Cooperate column." },
            ],
            explanation: "Against Cooperate, Defect gives 5 and Cooperate gives 3.",
          },
          {
            id: "g3",
            type: "single",
            tag: "recall",
            prompt: "What makes the prisoner's dilemma a dilemma?",
            options: [
              { id: "a", text: "Each player's best choice leads to an outcome worse for both than mutual cooperation", correct: true, feedback: "Yes." },
              { id: "b", text: "There is no best choice", correct: false, feedback: "Defect is always best individually." },
              { id: "c", text: "The payoffs are random", correct: false, feedback: "They're fixed." },
            ],
            explanation: "Individually rational, collectively worse.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "best-response",
      conceptId: "game-theory/best-response",
      title: "Best responses",
      kind: "concept",
      whyYouNeedThis: "Nash's equilibrium is defined through best responses, and his proof works by mapping each strategy profile to players' best responses.",
      lesson: [
        {
          heading: "The best reply to a fixed choice",
          body: "Fix what everyone else does. Your **best response** is whichever of your strategies gives you the highest payoff against that fixed choice. There may be ties, in which case several strategies are best responses.\n\nIn a 2×2 table, find the row player's best response to each column by comparing the two numbers on the left of each cell in that column. For the column player, compare the right-hand numbers along each row.",
        },
        {
          heading: "Best responses depend on beliefs",
          body: "Your best response depends on what you think the others will do. In a **coordination game**, like two people choosing which café to meet at, your best response is to match the other person, whatever they choose.\n\nSometimes one strategy is a best response to everything the others could do. That's a **dominant strategy**, like Defect in the prisoner's dilemma. Most games have no dominant strategy, which is why a more general idea is needed.",
        },
      ],
      whatWeSkip: "We skip iterated elimination of dominated strategies.",
      interactive: {
        widget: "payoff-matrix",
        params: {
          rowPlayer: "Ana", colPlayer: "Ben",
          rowLabels: ["Stag", "Hare"], colLabels: ["Stag", "Hare"],
          payoffs: [[[4, 4], [0, 3]], [[3, 0], [3, 3]]],
          showMixed: false,
        },
        caption: "The stag hunt. Hunting stag pays off only if both do it. Show best replies: neither player has a dominant strategy.",
        altText: "A 2×2 stag hunt table where each player's best reply is to match the other.",
      },
      inThePaper: {
        text: "The paper defines a counter-strategy: a strategy of one player that gives the highest payoff against the others' strategies. An equilibrium is a strategy profile that counters itself.",
        sections: ["Definition of equilibrium point"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "br1",
            type: "single",
            tag: "application",
            prompt: "In the stag hunt, Ben plays Hare. What is Ana's best response?",
            options: [
              { id: "a", text: "Hare (3 beats 0)", correct: true, feedback: "Yes." },
              { id: "b", text: "Stag (4 is the biggest number)", correct: false, feedback: "4 only happens if Ben plays Stag. Against Hare, compare 0 and 3." },
            ],
            explanation: "Compare Ana's payoffs in Ben's Hare column: Stag 0, Hare 3.",
          },
          {
            id: "br2",
            type: "single",
            tag: "recall",
            prompt: "What is a dominant strategy?",
            options: [
              { id: "a", text: "A strategy that is a best response to every choice by the others", correct: true, feedback: "Yes." },
              { id: "b", text: "The strategy with the largest single payoff", correct: false, feedback: "A big payoff in one cell doesn't make it best everywhere." },
              { id: "c", text: "A strategy chosen by the stronger player", correct: false, feedback: "No." },
            ],
            explanation: "Best against everything.",
          },
          {
            id: "br3",
            type: "single",
            tag: "application",
            prompt: "Does either player in the stag hunt have a dominant strategy?",
            options: [
              { id: "a", text: "No: the best choice depends on what the other does", correct: true, feedback: "Yes." },
              { id: "b", text: "Yes: Stag", correct: false, feedback: "Stag is worse if the other plays Hare." },
              { id: "c", text: "Yes: Hare", correct: false, feedback: "Hare is worse if the other plays Stag." },
            ],
            explanation: "Coordination games have no dominant strategies.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "equilibrium",
      conceptId: "game-theory/nash-equilibrium",
      title: "Equilibrium: mutual best responses",
      kind: "concept",
      whyYouNeedThis: "This is the concept the paper defines. Everything else in the paper is about showing it exists.",
      lesson: [
        {
          heading: "The definition",
          body: "A combination of strategies, one per player, is an **equilibrium** if each player's strategy is a best response to the others'. Equivalently: no player can gain by changing strategy alone.\n\nIn a table, it's a cell where the row player's payoff is the best in its column and the column player's payoff is the best in its row.",
        },
        {
          heading: "What it is and isn't",
          body: "An equilibrium is stable, not necessarily good. The prisoner's dilemma's only equilibrium is mutual defection, which is worse for both than mutual cooperation.\n\nA game can have several equilibria. The stag hunt has two: both hunt stag (4, 4) and both hunt hare (3, 3). The theory tells you which outcomes are self-enforcing, not which one will happen.\n\nSome games have no equilibrium in pure strategies at all. That is the gap the next two nodes fill.",
        },
      ],
      whatWeSkip: "We skip refinements such as subgame perfection and evolutionary stability.",
      interactive: {
        widget: "payoff-matrix",
        params: {
          rowPlayer: "Ana", colPlayer: "Ben",
          rowLabels: ["Stag", "Hare"], colLabels: ["Stag", "Hare"],
          payoffs: [[[4, 4], [0, 3]], [[3, 0], [3, 3]]],
          showMixed: false,
        },
        caption: "Press 'Both: find equilibria'. The stag hunt has two pure equilibria.",
        altText: "A stag hunt table with the two equilibrium cells, Stag–Stag and Hare–Hare, highlighted.",
      },
      inThePaper: {
        text: "Nash defines an equilibrium point as an n-tuple of strategies such that each player's mixed strategy maximises their payoff when the others' strategies are held fixed.",
        sections: ["Definition of equilibrium point"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "eq1",
            type: "single",
            tag: "recall",
            prompt: "Which describes an equilibrium?",
            options: [
              { id: "a", text: "No player can gain by changing strategy while the others keep theirs", correct: true, feedback: "Yes." },
              { id: "b", text: "The outcome with the highest total payoff", correct: false, feedback: "Equilibria need not be efficient." },
              { id: "c", text: "An outcome both players agree to in advance", correct: false, feedback: "Nash's games are non-cooperative: no binding agreements." },
            ],
            explanation: "Mutual best responses: nobody wants to deviate alone.",
          },
          {
            id: "eq2",
            type: "numeric",
            tag: "application",
            prompt: "Payoffs (row, column): Top–Left (2, 1), Top–Right (0, 0), Bottom–Left (0, 0), Bottom–Right (1, 2). How many pure-strategy equilibria are there?",
            answer: 2,
            tolerance: 0,
            explanation: "Top–Left and Bottom–Right. At each, neither player gains by switching alone.",
          },
          {
            id: "eq3",
            type: "single",
            tag: "application",
            prompt: "Is (Cooperate, Cooperate) an equilibrium of the prisoner's dilemma?",
            options: [
              { id: "a", text: "No: either player gains by switching to Defect", correct: true, feedback: "Yes: 5 > 3." },
              { id: "b", text: "Yes: it has the highest total payoff", correct: false, feedback: "High payoff doesn't make it stable." },
            ],
            explanation: "Stability is about unilateral deviations.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "mixed",
      conceptId: "game-theory/mixed-strategies",
      title: "Mixed strategies",
      kind: "concept",
      whyYouNeedThis: "Nash's theorem guarantees an equilibrium only when players may randomise. Without mixed strategies some games have no equilibrium.",
      lesson: [
        {
          heading: "Matching pennies",
          body: "Two players each show a coin. If they match, Row wins a point from Column; if they differ, Column wins. Check every cell: someone always wants to switch. There is no pure equilibrium.\n\nBut if each player picks heads or tails with probability ½, neither can do better by changing, because any choice wins half the time. That's an equilibrium in **mixed strategies**.",
        },
        {
          heading: "Expected payoffs",
          body: "A **mixed strategy** is a probability distribution over your pure strategies. Your payoff becomes an **expected** payoff: the average, weighted by the probability of each cell.\n\nA key fact: in a mixed equilibrium, every pure strategy you use with positive probability must give you the same expected payoff. Otherwise you'd drop the worse one. So you find the opponent's mix by making *you* indifferent. That is how to compute mixed equilibria in small games.",
        },
      ],
      whatWeSkip: "We skip the geometry of the strategy simplex beyond noting mixed strategies are points in it.",
      interactive: {
        widget: "payoff-matrix",
        params: {
          rowPlayer: "Row", colPlayer: "Column",
          rowLabels: ["Heads", "Tails"], colLabels: ["Heads", "Tails"],
          payoffs: [[[1, -1], [-1, 1]], [[-1, 1], [1, -1]]],
          showMixed: true,
        },
        caption: "Matching pennies has no pure equilibrium. Move both sliders to 0.5 and check that neither player can gain by switching.",
        altText: "Matching pennies table with sliders for each player's probability of heads, and readouts of each player's expected payoffs.",
      },
      workedExample: {
        prompt: "In matching pennies, Column plays Heads with probability $q$. For which $q$ is Row indifferent between Heads and Tails?",
        steps: [
          "Row's expected payoff from Heads: $q(1) + (1-q)(-1) = 2q - 1$.",
          "From Tails: $q(-1) + (1-q)(1) = 1 - 2q$.",
          "Set equal: $2q - 1 = 1 - 2q$, so $q = \\tfrac12$.",
        ],
        answer: "$q = \\tfrac12$",
      },
      inThePaper: {
        text: "Nash works entirely with mixed strategies, written as points in a simplex, and payoffs as expected values that are linear in each player's probabilities.",
        sections: ["Definitions", "Proof"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "mx1",
            type: "numeric",
            tag: "application",
            prompt: "Column plays Heads with probability 0.7 in matching pennies. What is Row's expected payoff from playing Heads?",
            answer: 0.4,
            tolerance: 0.001,
            explanation: "$0.7(1) + 0.3(-1) = 0.4$.",
          },
          {
            id: "mx2",
            type: "single",
            tag: "recall",
            prompt: "In a mixed equilibrium, what is true of the pure strategies a player uses with positive probability?",
            options: [
              { id: "a", text: "They all give that player the same expected payoff", correct: true, feedback: "Yes. Otherwise the player would shift weight to the better one." },
              { id: "b", text: "They are each used with probability ½", correct: false, feedback: "Only in symmetric examples like matching pennies." },
              { id: "c", text: "One of them is dominant", correct: false, feedback: "No." },
            ],
            explanation: "Indifference is the key condition.",
          },
          {
            id: "mx3",
            type: "numeric",
            tag: "application",
            prompt: "Row gets 3 from Top if Column plays Left and 0 if Right; 1 from Bottom either way. With what probability of Left must Column play to make Row indifferent? (as a fraction to 3 decimal places)",
            answer: 0.333,
            tolerance: 0.002,
            explanation: "Top gives $3q$, Bottom gives 1. Setting $3q = 1$ gives $q = \\tfrac13$.",
          },
          {
            id: "mx4",
            type: "single",
            tag: "paper-link",
            prompt: "Why does Nash's theorem need mixed strategies?",
            options: [
              { id: "a", text: "Some games, like matching pennies, have no equilibrium in pure strategies", correct: true, feedback: "Yes." },
              { id: "b", text: "Because people always randomise", correct: false, feedback: "It's a mathematical requirement, not a psychological claim." },
              { id: "c", text: "To make payoffs bigger", correct: false, feedback: "No." },
            ],
            explanation: "Mixing fills the gaps where pure equilibria don't exist.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "minimax",
      conceptId: "game-theory/zero-sum-minimax",
      title: "Von Neumann's zero-sum games",
      kind: "concept",
      whyYouNeedThis: "Nash's result generalises von Neumann's minimax theorem. Knowing the earlier result shows what was new.",
      lesson: [
        {
          heading: "Zero-sum games",
          body: "In a **zero-sum** game, one player's gain is exactly the other's loss, as in matching pennies or poker between two people. John von Neumann proved in 1928 that every finite two-player zero-sum game has a **value**: Row has a mixed strategy that guarantees at least that value whatever Column does, and Column has one that holds Row to at most that value.\n\nThis is the **minimax theorem**. The paired optimal strategies are exactly an equilibrium.",
        },
        {
          heading: "The limit of the theory",
          body: "In 1944 von Neumann and Oskar Morgenstern built a whole theory of games on this, but beyond two-player zero-sum games they turned to coalitions: which groups of players form alliances and how they split the gains. Individual, non-cooperative play in general games had no satisfying solution.\n\nNash filled that gap. His equilibrium makes sense for any number of players and any payoffs, and it reduces to von Neumann's solution in the zero-sum case.",
        },
      ],
      whatWeSkip: "We skip the proof of the minimax theorem and linear programming duality.",
      inThePaper: {
        text: "The short PNAS note doesn't dwell on the zero-sum case, but its definition contains von Neumann's solution as a special case. Nash's fuller 1951 paper, 'Non-Cooperative Games', spells out the connection.",
        sections: ["Definition of equilibrium point"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "z1",
            type: "single",
            tag: "recall",
            prompt: "What does von Neumann's minimax theorem cover?",
            options: [
              { id: "a", text: "Finite two-player zero-sum games", correct: true, feedback: "Yes." },
              { id: "b", text: "All n-player games", correct: false, feedback: "That's Nash's generalisation." },
              { id: "c", text: "Only games with dominant strategies", correct: false, feedback: "No." },
            ],
            explanation: "Two players, strictly opposed interests.",
          },
          {
            id: "z2",
            type: "single",
            tag: "application",
            prompt: "Is the prisoner's dilemma zero-sum?",
            options: [
              { id: "a", text: "No: both players can gain or lose together", correct: true, feedback: "Yes. (3, 3) and (1, 1) have different totals." },
              { id: "b", text: "Yes: someone always loses", correct: false, feedback: "Check the totals across cells." },
            ],
            explanation: "Zero-sum means payoffs in every cell add to the same constant.",
          },
          {
            id: "z3",
            type: "single",
            tag: "recall",
            prompt: "How does Nash's equilibrium relate to von Neumann's solution?",
            options: [
              { id: "a", text: "In two-person zero-sum games, Nash equilibria are exactly von Neumann's optimal strategy pairs", correct: true, feedback: "Yes." },
              { id: "b", text: "They contradict each other", correct: false, feedback: "Nash's concept extends von Neumann's." },
              { id: "c", text: "They are unrelated", correct: false, feedback: "No." },
            ],
            explanation: "A strict generalisation.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "fixed-point",
      conceptId: "math/fixed-point-theorems",
      title: "Fixed-point theorems",
      kind: "concept",
      whyYouNeedThis: "The entire proof is one application of Kakutani's fixed-point theorem. You need to know what a fixed point is and why these theorems guarantee one.",
      lesson: [
        {
          heading: "Fixed points",
          body: "A **fixed point** of a function $f$ is a point with $f(x) = x$. Stir a cup of coffee: Brouwer's fixed-point theorem says at least one point of the liquid ends up exactly where it started (if the stirring is continuous and the coffee stays in the cup).\n\nFormally: every continuous function from a closed, bounded, convex set (like a disc or a triangle) into itself has a fixed point. You can see it in one dimension: a continuous $f$ from $[0,1]$ to $[0,1]$ must cross the line $y = x$.",
        },
        {
          heading: "Kakutani's version",
          body: "Sometimes each point maps to a *set* of points, not one point. That's a **correspondence**. Shizuo Kakutani proved in 1941 that a correspondence from a convex compact set into itself has a fixed point, $x \\in F(x)$, provided each $F(x)$ is non-empty and convex and the correspondence has a closed graph.\n\nBest responses are naturally a correspondence, because a player can have several equally good replies. That is why Kakutani's theorem fits Nash's problem.",
        },
      ],
      whatWeSkip: "We skip the proofs of Brouwer's and Kakutani's theorems.",
      workedExample: {
        prompt: "Find the fixed point of $f(x) = \\tfrac12 x + \\tfrac14$ on $[0, 1]$.",
        steps: ["Solve $x = \\tfrac12 x + \\tfrac14$.", "$\\tfrac12 x = \\tfrac14$, so $x = \\tfrac12$."],
        answer: "$x = \\tfrac12$",
      },
      inThePaper: {
        text: "The paper applies Kakutani's generalisation of Brouwer's theorem, and thanks David Gale for suggesting it.",
        sections: ["Proof of existence"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "fp1",
            type: "numeric",
            tag: "application",
            prompt: "Find the fixed point of $f(x) = 0.2x + 0.4$.",
            answer: 0.5,
            tolerance: 0.001,
            explanation: "$x = 0.2x + 0.4$ gives $0.8x = 0.4$, so $x = 0.5$.",
          },
          {
            id: "fp2",
            type: "single",
            tag: "recall",
            prompt: "Why does Nash need Kakutani's theorem rather than just Brouwer's?",
            options: [
              { id: "a", text: "Best responses can be sets, not single points, so the map is a correspondence", correct: true, feedback: "Yes." },
              { id: "b", text: "Brouwer's theorem only works in one dimension", correct: false, feedback: "Brouwer's works in any finite dimension." },
              { id: "c", text: "Kakutani's theorem is easier to state", correct: false, feedback: "Not the reason." },
            ],
            explanation: "Ties make best responses set-valued. (Nash's 1951 paper found a proof using Brouwer directly.)",
          },
          {
            id: "fp3",
            type: "single",
            tag: "application",
            prompt: "Which function from [0, 1] to [0, 1] must have a fixed point by Brouwer's theorem?",
            options: [
              { id: "a", text: "Any continuous one", correct: true, feedback: "Yes." },
              { id: "b", text: "Only increasing ones", correct: false, feedback: "Decreasing continuous functions also cross y = x." },
              { id: "c", text: "Only linear ones", correct: false, feedback: "Any continuous function works." },
            ],
            explanation: "Continuity plus mapping the interval into itself forces a crossing.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "existence",
      conceptId: "game-theory/equilibrium-existence",
      title: "Why an equilibrium always exists",
      kind: "concept",
      whyYouNeedThis: "This is the proof in the paper. With best responses, mixed strategies and Kakutani, it takes a few lines.",
      lesson: [
        {
          heading: "The map",
          body: "Take a **strategy profile**: one mixed strategy per player. Map it to the set of profiles in which every player is best-responding to the original profile. Call this correspondence $F$.\n\nA fixed point of $F$ is a profile that is a best response to itself, for every player at once. That's exactly an equilibrium.",
        },
        {
          heading: "Checking Kakutani's conditions",
          body: "- The set of profiles is convex and compact: each player's mixed strategies form a simplex, and a product of simplices is convex and compact.\n- Each $F(x)$ is non-empty: a continuous expected payoff on a compact set has a maximum.\n- Each $F(x)$ is convex: payoffs are linear in a player's own probabilities, so any mixture of best responses is a best response.\n- The graph is closed: payoffs are continuous.\n\nSo Kakutani applies, $F$ has a fixed point, and **every finite game has an equilibrium in mixed strategies**. The proof says nothing about how to find it; computing equilibria turned out to be hard in general.",
        },
      ],
      whatWeSkip: "We skip the formal verification of the closed graph and the computational complexity of finding equilibria.",
      inThePaper: {
        text: "The proof in the paper defines the counter correspondence from the product of simplices to itself and applies Kakutani's theorem directly.",
        sections: ["Proof of existence"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "ex1",
            type: "single",
            tag: "recall",
            prompt: "What is a fixed point of the best-response correspondence?",
            options: [
              { id: "a", text: "A strategy profile in which every player is best-responding to the others: an equilibrium", correct: true, feedback: "Yes." },
              { id: "b", text: "The strategy with the highest payoff", correct: false, feedback: "No." },
              { id: "c", text: "A profile where all players choose the same strategy", correct: false, feedback: "No." },
            ],
            explanation: "Self-consistent best responses.",
          },
          {
            id: "ex2",
            type: "single",
            tag: "application",
            prompt: "Why is each player's set of best responses convex?",
            options: [
              { id: "a", text: "Expected payoff is linear in the player's own probabilities, so mixing two best responses gives another", correct: true, feedback: "Yes." },
              { id: "b", text: "Because there is always exactly one best response", correct: false, feedback: "There can be many." },
              { id: "c", text: "Because payoffs are positive", correct: false, feedback: "Sign doesn't matter." },
            ],
            explanation: "Linearity in own strategy is the key.",
          },
          {
            id: "ex3",
            type: "single",
            tag: "paper-link",
            prompt: "What does Nash's theorem guarantee?",
            options: [
              { id: "a", text: "Every finite game has at least one equilibrium in mixed strategies", correct: true, feedback: "Yes." },
              { id: "b", text: "Every game has a unique equilibrium", correct: false, feedback: "The stag hunt has several." },
              { id: "c", text: "Every game has an equilibrium in pure strategies", correct: false, feedback: "Matching pennies has none." },
            ],
            explanation: "Existence, not uniqueness, and with mixing allowed.",
          },
          {
            id: "ex4",
            type: "order",
            tag: "paper-link",
            prompt: "Order the steps of the existence proof.",
            items: [
              { id: "a", text: "Represent strategy profiles as points in a product of simplices" },
              { id: "b", text: "Map each profile to the set of best-response profiles" },
              { id: "c", text: "Check the map satisfies Kakutani's conditions" },
              { id: "d", text: "Conclude a fixed point, an equilibrium, exists" },
            ],
            correctOrder: ["a", "b", "c", "d"],
            explanation: "Space, map, conditions, conclusion.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "paper",
      conceptId: "paper/nash-1950",
      title: "The paper: two pages, one idea",
      kind: "paper",
      whyYouNeedThis: "The paper fills less than two pages of PNAS. You now know every idea in it.",
      lesson: [
        {
          heading: "What's on the page",
          body: "The paper defines n-person games with mixed strategies, defines an equilibrium point as a self-countering profile, and proves existence with Kakutani's theorem, crediting David Gale with the suggestion. It was submitted in November 1949, when Nash was 21.\n\nA fuller version, 'Non-Cooperative Games', appeared in the Annals of Mathematics in 1951 with a proof based on Brouwer's theorem and a discussion of interpretation.",
        },
        {
          heading: "Why it spread",
          body: "The equilibrium concept asks for nothing but self-interest and consistency, so it applies wherever independent agents interact: oligopolies setting prices, bidders in auctions, animals competing for territory, packets routing through networks.\n\nIts limitations shaped later work: multiple equilibria (which one?), the assumption that players know the game, and the difficulty of computing equilibria.",
        },
      ],
      whatWeSkip: "We skip the 1951 Annals paper and the later literature on refinements and learning.",
      inThePaper: {
        text: "Read the whole page. Match each sentence to a node you've passed.",
        sections: ["Whole paper"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "np1",
            type: "order",
            tag: "paper-link",
            prompt: "Order the contents of the paper.",
            items: [
              { id: "a", text: "Define an n-person game and mixed strategies" },
              { id: "b", text: "Define an equilibrium point" },
              { id: "c", text: "Prove existence using Kakutani's theorem" },
              { id: "d", text: "Credit David Gale for suggesting Kakutani's theorem" },
            ],
            correctOrder: ["a", "b", "c", "d"],
            explanation: "Define the game, define the equilibrium, prove it exists, acknowledge the key suggestion.",
          },
          {
            id: "np2",
            type: "single",
            tag: "application",
            prompt: "Two petrol stations on the same road each choose a price. Why is Nash equilibrium a natural tool here?",
            options: [
              { id: "a", text: "Each firm chooses independently to maximise its own profit given the other's price", correct: true, feedback: "Yes. A non-cooperative, general-sum game." },
              { id: "b", text: "The game is zero-sum", correct: false, feedback: "Both can profit or lose together." },
              { id: "c", text: "Because the firms sign a binding contract", correct: false, feedback: "That would be a cooperative game." },
            ],
            explanation: "Independent self-interested choices in a general-sum game.",
          },
          {
            id: "np3",
            type: "multi",
            tag: "recall",
            prompt: "Which are true of Nash's result?",
            options: [
              { id: "a", text: "It holds for any finite number of players", correct: true, feedback: "Yes." },
              { id: "b", text: "It needs mixed strategies", correct: true, feedback: "Yes." },
              { id: "c", text: "It says which equilibrium will be played", correct: false, feedback: "It only guarantees one exists." },
              { id: "d", text: "It generalises von Neumann's minimax theorem", correct: true, feedback: "Yes." },
            ],
            explanation: "General, existential, and a generalisation of minimax.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
  ],
  edges: [
    { from: "games", to: "best-response" },
    { from: "best-response", to: "equilibrium" },
    { from: "best-response", to: "mixed" },
    { from: "mixed", to: "minimax" },
    { from: "equilibrium", to: "existence" },
    { from: "mixed", to: "existence" },
    { from: "fixed-point", to: "existence" },
    { from: "existence", to: "paper" },
    { from: "minimax", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Opening paragraph", focus: "The definition of an n-person game with mixed strategies.", conceptIds: ["games", "mixed"] },
    { section: "Equilibrium point", focus: "Counter-strategies and the self-countering profile.", conceptIds: ["best-response", "equilibrium"] },
    { section: "Existence", focus: "The Kakutani argument, in a few lines.", conceptIds: ["fixed-point", "existence"] },
    { section: "Afterwards", focus: "Nash's 1951 paper 'Non-Cooperative Games' for the Brouwer proof and the link to von Neumann's zero-sum theory.", conceptIds: ["minimax"] },
  ],
};

export default nash;
