import type { Journey } from "../schema";
import { withVisuals } from "../diagram";
import visuals from "./visuals/lorenz";

const lorenz: Journey = {
  id: "lorenz-1963",
  title: "Why weather can't be forecast for ever",
  subtitle: "Three simple equations produce motion that never repeats and magnifies the tiniest error.",
  paper: {
    title: "Deterministic Nonperiodic Flow",
    authors: ["Edward N. Lorenz"],
    year: 1963,
    venue: "Journal of the Atmospheric Sciences",
    url: "https://doi.org/10.1175/1520-0469(1963)020%3C0130:DNF%3E2.0.CO;2",
    doi: "10.1175/1520-0469(1963)020<0130:DNF>2.0.CO;2",
  },
  field: "Chaos, climate",
  accent: "#be123c",
  level: "intermediate",
  source: "curated",
  summary:
    "Lorenz, a meteorologist at MIT, cut a model of convection down to three variables and solved it on an early computer. The solution never settled down or repeated, and two runs that started almost identically soon bore no resemblance to each other. Nothing random was involved: the equations are fully deterministic.",
  whyItMatters:
    "The paper founded chaos theory. It explained why detailed weather forecasts lose skill after a week or two however good the model, and changed how forecasters work: today they run ensembles of slightly different starts and forecast probabilities.",
  nodes: [
    {
      id: "rates",
      conceptId: "math/derivatives-as-rates",
      title: "Rates of change",
      kind: "concept",
      whyYouNeedThis: "Lorenz's model is written as three rates of change. You need to read $dX/dt$ as 'how fast X is changing right now'.",
      lesson: [
        {
          heading: "The derivative as a rate",
          body: "If $X(t)$ is a quantity that changes with time, its **derivative** $dX/dt$ is its rate of change at an instant: the slope of the graph of $X$ against $t$.\n\nIf $dX/dt = 3$, then over a short time $\\Delta t$, $X$ increases by about $3\\,\\Delta t$. If $dX/dt$ is negative, $X$ is falling. If it's zero, $X$ is momentarily not changing.",
        },
        {
          heading: "Rates that depend on the state",
          body: "In physics the rate often depends on the quantity itself. Newton's law of cooling says a cup of tea cools faster when it's much hotter than the room:\n\n$$\\frac{dT}{dt} = -k\\,(T - T_{room})$$\n\nThis is a **differential equation**: it tells you the rate, and from the rate you can reconstruct the whole future, step by step, once you know where you start. That's exactly how Lorenz's model is used.",
        },
      ],
      whatWeSkip: "We skip the formal limit definition of the derivative and rules for differentiating functions.",
      workedExample: {
        prompt: "Tea is at 80 °C in a 20 °C room, with $k = 0.1$ per minute. How fast is it cooling right now?",
        steps: ["$dT/dt = -0.1 \\times (80 - 20)$.", "$= -6$ °C per minute."],
        answer: "Falling at about 6 °C per minute (slowing as it cools).",
      },
      inThePaper: {
        text: "The paper opens with the general form of a system of equations giving each variable's rate of change in terms of all the variables.",
        sections: ["Introduction"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "r1",
            type: "numeric",
            tag: "application",
            prompt: "If $dX/dt = -2$ and $X = 10$ now, about what is $X$ after 0.1 time units?",
            answer: 9.8,
            tolerance: 0.001,
            explanation: "$10 + (-2)(0.1) = 9.8$.",
          },
          {
            id: "r2",
            type: "single",
            tag: "recall",
            prompt: "What does $dX/dt = 0$ mean?",
            options: [
              { id: "a", text: "X is not changing at that instant", correct: true, feedback: "Yes." },
              { id: "b", text: "X is zero", correct: false, feedback: "The value can be anything; its rate is zero." },
              { id: "c", text: "Time has stopped", correct: false, feedback: "No." },
            ],
            explanation: "Zero rate, not zero value.",
          },
          {
            id: "r3",
            type: "single",
            tag: "paper-link",
            prompt: "What do you need, besides the equations, to compute a future state of Lorenz's system?",
            options: [
              { id: "a", text: "The starting values of the variables", correct: true, feedback: "Yes: the initial condition." },
              { id: "b", text: "A random number generator", correct: false, feedback: "The system is deterministic." },
              { id: "c", text: "Observations of the future", correct: false, feedback: "No." },
            ],
            explanation: "Equations plus initial conditions determine everything.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "state-space",
      conceptId: "math/phase-space",
      title: "State space and trajectories",
      kind: "concept",
      whyYouNeedThis: "Lorenz reasons about the paths his solution traces through a three-dimensional space of states. The paper's key pictures are projections of such a path.",
      lesson: [
        {
          heading: "A point for every state",
          body: "If a system is described by three numbers $X$, $Y$, $Z$, its whole state at one moment is a point in three-dimensional **state space** (also called phase space). As time passes, the point moves, tracing a **trajectory**.\n\nThe differential equations say which way the point moves from anywhere in the space, like arrows on a map. Two trajectories can never cross, because from any given point the future is unique.",
        },
        {
          heading: "Where trajectories go",
          body: "Over a long time a trajectory might:\n\n- settle at a **fixed point**, where all rates are zero;\n- settle into a **periodic orbit**, a closed loop repeated for ever;\n- do something else: wander for ever without repeating, yet stay in a bounded region.\n\nBefore 1963, the third option was known mathematically but was widely treated as exotic. Lorenz found it in a simple physical model.",
        },
      ],
      whatWeSkip: "We skip quasi-periodic motion on tori and the formal classification of attractors.",
      inThePaper: {
        text: "Lorenz describes solutions as trajectories in phase space, and classifies them as steady, periodic or nonperiodic.",
        sections: ["Introduction", "Discussion of solutions"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "s1",
            type: "single",
            tag: "recall",
            prompt: "Why can't two trajectories of a deterministic system cross?",
            options: [
              { id: "a", text: "From any state the future is unique, so two paths through the same point are the same path", correct: true, feedback: "Yes." },
              { id: "b", text: "Because space is three-dimensional", correct: false, feedback: "Dimension isn't the reason." },
              { id: "c", text: "They can cross whenever they like", correct: false, feedback: "Not in a deterministic system." },
            ],
            explanation: "Determinism means one future per state.",
          },
          {
            id: "s2",
            type: "multi",
            tag: "recall",
            prompt: "Which long-term behaviours can a bounded trajectory show?",
            options: [
              { id: "a", text: "Settling at a fixed point", correct: true, feedback: "Yes." },
              { id: "b", text: "A repeating closed loop", correct: true, feedback: "Yes." },
              { id: "c", text: "Wandering for ever without repeating", correct: true, feedback: "Yes. This is what Lorenz found." },
            ],
            explanation: "All three are possible; the third is chaos.",
          },
          {
            id: "s3",
            type: "numeric",
            tag: "application",
            prompt: "A system is described by temperature, pressure, wind speed and humidity. How many dimensions does its state space have?",
            answer: 4,
            tolerance: 0,
            explanation: "One dimension per variable.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "numerics",
      conceptId: "math/numerical-integration",
      title: "Solving equations by stepping",
      kind: "concept",
      whyYouNeedThis: "Lorenz's equations can't be solved with a formula. He computed solutions step by step on a small computer, and the paper's results come from those computations.",
      lesson: [
        {
          heading: "Euler's method",
          body: "Given $dX/dt = f(X)$ and a starting value, take a small step $\\Delta t$:\n\n$$X_{new} = X + f(X)\\,\\Delta t$$\n\nRepeat thousands of times to trace the solution. Smaller steps are more accurate but take longer. Better methods evaluate the rate at more than one point per step, reducing the error a lot for little extra work.",
        },
        {
          heading: "Numbers on a machine",
          body: "Lorenz used a Royal McBee LGP-30, a desk-sized computer that performed roughly 60 multiplications a second. In the paper he integrates with a time step of 0.01 using a two-stage scheme.\n\nComputers store numbers to a fixed precision, so every step carries a tiny rounding error. For most equations that doesn't matter. For Lorenz's, it does: by his own account, he discovered the effect in 1961 when he restarted a run from printed numbers rounded to three decimal places and got a completely different result.",
        },
      ],
      whatWeSkip: "We skip error analysis of numerical methods and Runge–Kutta schemes.",
      workedExample: {
        prompt: "Apply one Euler step to $dX/dt = -X$ with $X = 2$ and $\\Delta t = 0.1$.",
        steps: ["$f(X) = -2$.", "$X_{new} = 2 + (-2)(0.1) = 1.8$."],
        answer: "1.8 (the exact value is $2e^{-0.1} \\approx 1.810$)",
      },
      inThePaper: {
        text: "The paper describes its numerical integration scheme and time step, then presents the computed values of X, Y and Z over thousands of steps.",
        sections: ["Numerical integration"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "n1",
            type: "numeric",
            tag: "application",
            prompt: "One Euler step for $dX/dt = 3X$ with $X = 1$ and $\\Delta t = 0.01$. What is the new X?",
            answer: 1.03,
            tolerance: 0.0001,
            explanation: "$1 + 3(1)(0.01) = 1.03$.",
          },
          {
            id: "n2",
            type: "single",
            tag: "recall",
            prompt: "What is the trade-off in choosing the step size?",
            options: [
              { id: "a", text: "Smaller steps are more accurate but need more computation", correct: true, feedback: "Yes." },
              { id: "b", text: "Bigger steps are always more accurate", correct: false, feedback: "The opposite." },
              { id: "c", text: "Step size doesn't matter", correct: false, feedback: "It matters a great deal." },
            ],
            explanation: "Accuracy versus cost.",
          },
          {
            id: "n3",
            type: "single",
            tag: "paper-link",
            prompt: "Why do tiny rounding errors matter so much for Lorenz's equations?",
            options: [
              { id: "a", text: "The system amplifies small differences until they dominate", correct: true, feedback: "Yes. That's the paper's main discovery." },
              { id: "b", text: "The LGP-30 was faulty", correct: false, feedback: "The computer worked as designed." },
              { id: "c", text: "Rounding makes the equations random", correct: false, feedback: "The equations stay deterministic." },
            ],
            explanation: "Sensitive dependence turns rounding errors into large differences.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "convection",
      conceptId: "physics/rayleigh-benard-convection",
      title: "Convection: heated from below",
      kind: "concept",
      whyYouNeedThis: "Lorenz's three equations are a stripped-down model of convection. The variables and parameters only make sense with the physical picture.",
      lesson: [
        {
          heading: "Rolls of rising and sinking fluid",
          body: "Heat a thin layer of fluid from below. Warm fluid at the bottom is lighter and wants to rise; cool fluid on top wants to sink. If the heating is gentle, heat simply conducts upward and nothing moves. Past a threshold, the fluid overturns into **convection rolls**: rising on one side, sinking on the other.\n\nThe strength of heating relative to the fluid's damping is measured by the **Rayleigh number**. Convection starts when it exceeds a critical value.",
        },
        {
          heading: "Saltzman's model, cut to three",
          body: "Barry Saltzman had written the convection equations as a set of interacting modes. Lorenz noticed that in some runs all but three modes died away, and kept only those three:\n\n- $X$: the strength of the convective motion (the speed of the rolls);\n- $Y$: the temperature difference between rising and sinking fluid;\n- $Z$: how far the vertical temperature profile departs from a straight line.\n\nThe real atmosphere has vastly more variables. The point was to find the simplest system that behaves in a surprising way.",
        },
      ],
      whatWeSkip: "We skip the Boussinesq equations and the Fourier-mode truncation that produces the three-variable system.",
      inThePaper: {
        text: "The paper derives its model from Saltzman's convection equations, keeping three coefficients, and explains what X, Y and Z represent physically.",
        sections: ["The convection equations"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "cv1",
            type: "single",
            tag: "recall",
            prompt: "What starts convection in a fluid layer heated from below?",
            options: [
              { id: "a", text: "Heating strong enough that buoyancy beats damping (a high enough Rayleigh number)", correct: true, feedback: "Yes." },
              { id: "b", text: "Any heating at all", correct: false, feedback: "Gentle heating only conducts." },
              { id: "c", text: "Cooling from below", correct: false, feedback: "That's stable: cool, dense fluid stays at the bottom." },
            ],
            explanation: "A threshold is needed.",
          },
          {
            id: "cv2",
            type: "single",
            tag: "paper-link",
            prompt: "In Lorenz's model, what does X represent?",
            options: [
              { id: "a", text: "The intensity of the convective motion", correct: true, feedback: "Yes." },
              { id: "b", text: "The air pressure", correct: false, feedback: "No." },
              { id: "c", text: "The time of day", correct: false, feedback: "No." },
            ],
            explanation: "X is the speed of the rolls; its sign gives the direction of rotation.",
          },
          {
            id: "cv3",
            type: "single",
            tag: "application",
            prompt: "Why did Lorenz use only three variables when the atmosphere has millions?",
            options: [
              { id: "a", text: "To find the simplest system showing the behaviour, so it couldn't be blamed on complexity", correct: true, feedback: "Yes." },
              { id: "b", text: "Because the atmosphere really has three variables", correct: false, feedback: "No." },
              { id: "c", text: "Because more variables can't be computed", correct: false, feedback: "They can; weather models use many more." },
            ],
            explanation: "A minimal model makes the result unarguable.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "equations",
      conceptId: "chaos/lorenz-equations",
      title: "The Lorenz equations",
      kind: "concept",
      whyYouNeedThis: "These three lines are the heart of the paper. You should be able to read them and know what each term does.",
      lesson: [
        {
          heading: "The system",
          body: "$$\\frac{dX}{dt} = \\sigma (Y - X)$$\n\n$$\\frac{dY}{dt} = rX - Y - XZ$$\n\n$$\\frac{dZ}{dt} = XY - bZ$$\n\nLorenz used $\\sigma = 10$ (the Prandtl number, a property of the fluid), $b = 8/3$ (set by the geometry of the rolls) and $r = 28$ (the heating, as a multiple of the critical value for convection).",
        },
        {
          heading: "What the terms do",
          body: "- $\\sigma(Y - X)$: the motion $X$ is driven toward the temperature difference $Y$.\n- $rX$: stronger motion carries more heat and builds the temperature difference, driven by the heating $r$.\n- $-Y$, $-bZ$: damping, pulling things back toward rest.\n- $-XZ$ and $XY$: the only **nonlinear** terms. They are products of variables, so effects don't simply add. Without them the system could be solved with a formula.\n\nTry the widget: for small $r$ the motion settles; at $r = 28$ it never does.",
        },
      ],
      whatWeSkip: "We skip deriving the equations from the fluid dynamics.",
      interactive: {
        widget: "lorenz-attractor",
        params: { sigma: 10, rho: 28, beta: 2.6667, delta: 0.00001 },
        caption: "The Lorenz system, projected onto X (across) and Z (up). Lower ρ below about 24.7 and the path settles to a steady state; at 28 it loops for ever between two wings.",
        altText: "An animated butterfly-shaped curve traced by the Lorenz equations, with a slider for the heating parameter.",
      },
      inThePaper: {
        text: "The three-variable system appears in the section deriving the model from Saltzman's equations, followed by the parameter values used for the numerical runs.",
        sections: ["The convection equations"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "le1",
            type: "numeric",
            tag: "application",
            prompt: "At $X = 1, Y = 2, Z = 3$ with $\\sigma = 10$, what is $dX/dt$?",
            answer: 10,
            tolerance: 0,
            explanation: "$10 \\times (2 - 1) = 10$.",
          },
          {
            id: "le2",
            type: "numeric",
            tag: "application",
            prompt: "At $X = 1, Y = 2, Z = 3$ with $r = 28$, what is $dY/dt$?",
            answer: 23,
            tolerance: 0,
            explanation: "$28(1) - 2 - (1)(3) = 23$.",
          },
          {
            id: "le3",
            type: "multi",
            tag: "recall",
            prompt: "Which terms are nonlinear?",
            options: [
              { id: "a", text: "$XZ$", correct: true, feedback: "Yes: a product of variables." },
              { id: "b", text: "$XY$", correct: true, feedback: "Yes." },
              { id: "c", text: "$\\sigma X$", correct: false, feedback: "A constant times a variable is linear." },
              { id: "d", text: "$bZ$", correct: false, feedback: "Linear." },
            ],
            explanation: "Products of variables make the system nonlinear.",
          },
          {
            id: "le4",
            type: "single",
            tag: "paper-link",
            prompt: "Which parameter values did Lorenz use?",
            options: [
              { id: "a", text: "σ = 10, b = 8/3, r = 28", correct: true, feedback: "Yes." },
              { id: "b", text: "σ = 1, b = 1, r = 1", correct: false, feedback: "No." },
              { id: "c", text: "σ = 28, b = 10, r = 8/3", correct: false, feedback: "Right numbers, wrong places." },
            ],
            explanation: "These values are now standard.",
          },
        ],
      },
      estimatedMinutes: 8,
    },
    {
      id: "stability",
      conceptId: "chaos/fixed-points-and-stability",
      title: "Steady states and their stability",
      kind: "concept",
      whyYouNeedThis: "Lorenz first finds the steady solutions and shows that at $r = 28$ all of them are unstable. That is why the motion can't settle.",
      lesson: [
        {
          heading: "Where the motion could rest",
          body: "Set every rate to zero. The Lorenz equations then have:\n\n- the origin $X = Y = Z = 0$: no convection;\n- for $r > 1$, two more: $X = Y = \\pm\\sqrt{b(r-1)}$, $Z = r - 1$: steady rolls turning one way or the other.\n\nWith $b = 8/3$ and $r = 28$: $\\sqrt{72} \\approx 8.49$, so the steady rolls sit at $(\\pm 8.49, \\pm 8.49, 27)$.",
        },
        {
          heading: "Stable or unstable",
          body: "A fixed point is **stable** if a small nudge dies away and **unstable** if it grows. For the Lorenz system the origin is stable only while $r < 1$. The two steady-roll states stay stable until\n\n$$r = \\frac{\\sigma(\\sigma + b + 3)}{\\sigma - b - 1} \\approx 24.74$$\n\nAt $r = 28$ every steady state is unstable, so the trajectory can't settle anywhere. And Lorenz shows the motion stays bounded, so it can't escape either. It must keep moving for ever in a limited region.",
        },
      ],
      whatWeSkip: "We skip linearisation and the eigenvalue calculation behind the stability threshold.",
      workedExample: {
        prompt: "Find the steady-roll fixed points for $r = 10$, $b = 8/3$.",
        steps: ["$b(r - 1) = \\tfrac83 \\times 9 = 24$.", "$X = Y = \\pm\\sqrt{24} \\approx \\pm 4.90$.", "$Z = r - 1 = 9$."],
        answer: "$(\\pm 4.90, \\pm 4.90, 9)$. Since $10 < 24.74$ these are stable.",
      },
      inThePaper: {
        text: "The paper finds the three steady states, derives the critical value of r for their instability, and shows that all trajectories eventually stay inside a bounded region.",
        sections: ["The convection equations", "Numerical integration"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "st1",
            type: "numeric",
            tag: "application",
            prompt: "With $b = 8/3$ and $r = 28$, what is Z at the steady-roll fixed points?",
            answer: 27,
            tolerance: 0,
            explanation: "$Z = r - 1 = 27$.",
          },
          {
            id: "st2",
            type: "single",
            tag: "recall",
            prompt: "What does it mean for a fixed point to be unstable?",
            options: [
              { id: "a", text: "Small nudges away from it grow", correct: true, feedback: "Yes." },
              { id: "b", text: "The equations don't allow it", correct: false, feedback: "It exists; the system just can't stay near it." },
              { id: "c", text: "It moves over time", correct: false, feedback: "Fixed points don't move." },
            ],
            explanation: "Unstable: disturbances grow.",
          },
          {
            id: "st3",
            type: "single",
            tag: "paper-link",
            prompt: "Why must the motion at r = 28 keep going for ever without settling?",
            options: [
              { id: "a", text: "All steady states are unstable, and trajectories stay bounded", correct: true, feedback: "Yes. It can neither settle nor escape." },
              { id: "b", text: "Because friction is zero", correct: false, feedback: "The damping terms are present." },
              { id: "c", text: "Because the computer never stops", correct: false, feedback: "The conclusion comes from the mathematics." },
            ],
            explanation: "No stable resting point, no escape.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "sensitivity",
      conceptId: "chaos/sensitive-dependence",
      title: "Sensitive dependence on initial conditions",
      kind: "concept",
      whyYouNeedThis: "This is the discovery the paper is remembered for, and the reason long-range weather forecasting has a limit.",
      lesson: [
        {
          heading: "Tiny differences grow",
          body: "Start two runs of the Lorenz system from states differing by one part in a hundred thousand. For a while they track each other perfectly. Then the gap starts growing, roughly doubling at a steady rate, until the two runs are as different as two randomly chosen states.\n\nThis is **sensitive dependence on initial conditions**. The system is completely deterministic, yet in practice unpredictable beyond a certain time, because no measurement is perfect.",
        },
        {
          heading: "The predictability horizon",
          body: "If errors double every fixed interval, then improving your starting measurement tenfold only buys a few more doubling times of useful forecast. Accuracy gets expensive quickly.\n\nLorenz concluded that if the real atmosphere behaves like his model, very long-range forecasting of the weather's details is impossible. Later work put the horizon for day-to-day weather at roughly two weeks. His 1972 talk title, asking whether a butterfly flapping in Brazil could set off a tornado in Texas, gave the idea its popular name.",
        },
      ],
      whatWeSkip: "We skip Lyapunov exponents, the formal measure of how fast nearby trajectories separate.",
      interactive: {
        widget: "lorenz-attractor",
        params: { sigma: 10, rho: 28, beta: 2.6667, delta: 0.00001 },
        caption: "Two runs, blue and yellow, start 0.00001 apart. Watch the separation readout: nothing for a while, then sudden divergence.",
        altText: "Two Lorenz trajectories that overlap at first and then separate completely, with a readout of their separation.",
      },
      inThePaper: {
        text: "The paper shows that slightly different initial states evolve into considerably different states, and draws the implication for very-long-range weather prediction in its closing section.",
        sections: ["Numerical integration", "Conclusion"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "sd1",
            type: "numeric",
            tag: "application",
            prompt: "An error doubles every 2 days. Starting at 0.1 °C, how big is it after 10 days, in °C?",
            answer: 3.2,
            tolerance: 0.001,
            explanation: "Five doublings: $0.1 \\times 2^5 = 3.2$.",
          },
          {
            id: "sd2",
            type: "single",
            tag: "application",
            prompt: "Errors double every 2 days. You improve your measurements 8 times. How many extra days of equally good forecast do you gain?",
            options: [
              { id: "a", text: "6 days", correct: true, feedback: "Yes: 8 = 2³, three doublings of 2 days each." },
              { id: "b", text: "16 days", correct: false, feedback: "Improvement buys time logarithmically, not linearly." },
              { id: "c", text: "An unlimited amount", correct: false, feedback: "No." },
            ],
            explanation: "Each factor of 2 in accuracy buys one doubling time.",
          },
          {
            id: "sd3",
            type: "single",
            tag: "recall",
            prompt: "Is the Lorenz system random?",
            options: [
              { id: "a", text: "No: it's deterministic, yet practically unpredictable", correct: true, feedback: "Yes. That's the paradox in the title." },
              { id: "b", text: "Yes: the terms include noise", correct: false, feedback: "There's no noise term." },
            ],
            explanation: "Deterministic nonperiodic flow.",
          },
          {
            id: "sd4",
            type: "single",
            tag: "paper-link",
            prompt: "What did Lorenz conclude about weather prediction?",
            options: [
              { id: "a", text: "If the atmosphere behaves like the model, very long-range forecasts of detail are impossible", correct: true, feedback: "Yes." },
              { id: "b", text: "Better computers will eventually forecast weather months ahead", correct: false, feedback: "He argued the opposite." },
              { id: "c", text: "Weather is fully random", correct: false, feedback: "No." },
            ],
            explanation: "A limit on detailed predictability.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "return-map",
      conceptId: "chaos/return-maps",
      title: "Order in the chaos",
      kind: "concept",
      whyYouNeedThis: "The paper's most elegant argument turns the three-dimensional flow into a one-dimensional rule by looking at successive peaks of Z.",
      lesson: [
        {
          heading: "Successive maxima",
          body: "Watch $Z$ over time: it rises and falls, with peaks of different heights. Call the $n$-th peak $M_n$. Lorenz plotted each peak against the next: $M_{n+1}$ against $M_n$.\n\nThe points fall almost exactly on a single curve shaped like an upside-down V. So the next peak is (nearly) a function of the current one. The complicated flow hides a simple rule.",
        },
        {
          heading: "Why it can't repeat",
          body: "The curve's slope is steeper than 1 everywhere. So any difference between two peaks gets stretched at every step, which is sensitive dependence again, now in one dimension.\n\nLorenz used this to argue that periodic solutions, if any exist, must be unstable, so a typical trajectory never settles into repetition. Maps like this, where stretching and folding happen at every step, became a central tool of chaos theory.",
        },
      ],
      whatWeSkip: "We skip the tent map's formal analysis and the fractal structure of the attractor.",
      workedExample: {
        prompt: "Use the tent map $M_{n+1} = 2M_n$ if $M_n < \\tfrac12$, else $2(1 - M_n)$, starting from $M_0 = 0.3$.",
        steps: ["$M_1 = 0.6$.", "$M_2 = 2(1 - 0.6) = 0.8$.", "$M_3 = 2(1 - 0.8) = 0.4$.", "$M_4 = 0.8$."],
        answer: "0.3, 0.6, 0.8, 0.4, 0.8, … A start of 0.3001 would diverge from this after a few dozen steps.",
      },
      inThePaper: {
        text: "Figure 4 of the paper plots each maximum of Z against the previous one, and the argument about unstable periodic solutions follows from the steep slopes of that curve.",
        sections: ["Numerical integration", "Figure 4"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "rm1",
            type: "numeric",
            tag: "application",
            prompt: "With the tent map above, what is $M_1$ if $M_0 = 0.7$?",
            answer: 0.6,
            tolerance: 0.0001,
            explanation: "$0.7 \\ge \\tfrac12$, so $2(1 - 0.7) = 0.6$.",
          },
          {
            id: "rm2",
            type: "single",
            tag: "recall",
            prompt: "What does Lorenz plot in his return map?",
            options: [
              { id: "a", text: "Each maximum of Z against the next maximum", correct: true, feedback: "Yes." },
              { id: "b", text: "X against Y", correct: false, feedback: "That's a projection of the trajectory, not the return map." },
              { id: "c", text: "Temperature against time", correct: false, feedback: "No." },
            ],
            explanation: "Successive peaks, $M_{n+1}$ against $M_n$.",
          },
          {
            id: "rm3",
            type: "single",
            tag: "paper-link",
            prompt: "Why does a slope steeper than 1 in the return map rule out stable periodic behaviour?",
            options: [
              { id: "a", text: "Small differences are stretched at every step, so any periodic cycle is unstable", correct: true, feedback: "Yes." },
              { id: "b", text: "Steep curves can't be plotted", correct: false, feedback: "No." },
              { id: "c", text: "It means Z is always increasing", correct: false, feedback: "Z rises and falls." },
            ],
            explanation: "Stretching everywhere means no stable cycle.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "paper",
      conceptId: "paper/lorenz-1963",
      title: "The paper: deterministic nonperiodic flow",
      kind: "paper",
      whyYouNeedThis: "You now have the pieces. Read how Lorenz fits them into an argument about the atmosphere.",
      lesson: [
        {
          heading: "The shape of the argument",
          body: "The paper begins in general: bounded deterministic systems, and when their solutions can be nonperiodic. It then derives the three-variable convection model, finds its steady states and their instability, shows solutions stay bounded, and presents the numerical solution: the famous two-lobed trajectory and the return map of Z's maxima. It closes by asking what this means for forecasting.\n\nThe paper is twelve pages and mostly readable without heavy mathematics.",
        },
        {
          heading: "Its slow fuse",
          body: "Few people outside meteorology read it for about a decade. Mathematicians studying 'strange attractors' in the 1970s rediscovered it, and it became one of the most cited papers in physics. Weather services adopted **ensemble forecasting** in the 1990s: run the model many times from slightly different starts and report the spread as a probability. That is Lorenz's insight put to work.",
        },
      ],
      whatWeSkip: "We skip the general theorems in the opening sections, which can be skimmed on a first read.",
      inThePaper: {
        text: "Skim the introduction, then read the convection equations section, the numerical results with Figures 1 to 4, and the concluding remarks on prediction.",
        sections: ["Introduction", "The convection equations", "Numerical integration", "Conclusion"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "lp1",
            type: "order",
            tag: "paper-link",
            prompt: "Order the paper's steps.",
            items: [
              { id: "a", text: "General theory of bounded deterministic flows" },
              { id: "b", text: "Derive the three-variable convection model" },
              { id: "c", text: "Find steady states and their instability" },
              { id: "d", text: "Compute and display nonperiodic solutions" },
              { id: "e", text: "Draw conclusions for weather forecasting" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Theory, model, analysis, computation, implications.",
          },
          {
            id: "lp2",
            type: "single",
            tag: "application",
            prompt: "A weather service runs its model 50 times from slightly different starts and reports a 70% chance of rain. Which idea from the paper is behind this?",
            options: [
              { id: "a", text: "Sensitive dependence: one run can't be trusted far ahead, so forecast the spread", correct: true, feedback: "Yes. Ensemble forecasting." },
              { id: "b", text: "The weather is random", correct: false, feedback: "The model is deterministic; uncertainty comes from initial conditions." },
              { id: "c", text: "Convection only happens 70% of the time", correct: false, feedback: "No." },
            ],
            explanation: "Uncertainty in the start becomes uncertainty in the forecast.",
          },
          {
            id: "lp3",
            type: "multi",
            tag: "paper-link",
            prompt: "Which does the paper show for r = 28?",
            options: [
              { id: "a", text: "All steady states are unstable", correct: true, feedback: "Yes." },
              { id: "b", text: "Solutions remain bounded", correct: true, feedback: "Yes." },
              { id: "c", text: "Nearby starts diverge", correct: true, feedback: "Yes." },
              { id: "d", text: "The solution eventually repeats exactly", correct: false, feedback: "It is nonperiodic." },
            ],
            explanation: "Unstable, bounded, sensitive, nonperiodic.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
  ],
  edges: [
    { from: "rates", to: "state-space" },
    { from: "state-space", to: "numerics" },
    { from: "state-space", to: "equations" },
    { from: "convection", to: "equations" },
    { from: "equations", to: "stability" },
    { from: "numerics", to: "sensitivity" },
    { from: "stability", to: "sensitivity" },
    { from: "sensitivity", to: "return-map" },
    { from: "return-map", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Introduction", focus: "Skim: deterministic flows and why nonperiodic ones matter for weather.", conceptIds: ["state-space"] },
    { section: "The convection equations", focus: "The three-variable model, what X, Y, Z mean, and the steady states.", conceptIds: ["convection", "equations", "stability"] },
    { section: "Numerical integration", focus: "The computed trajectory, the divergence of nearby starts, and Figure 4's return map.", conceptIds: ["numerics", "sensitivity", "return-map"] },
    { section: "Conclusion", focus: "The implications for long-range forecasting.", conceptIds: ["paper"] },
  ],
};

export default withVisuals(lorenz, visuals);
