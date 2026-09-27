import type { Journey } from "../schema";
import { withVisuals } from "../diagram";
import visuals from "./visuals/backprop";

const backprop: Journey = {
  id: "backprop-1986",
  title: "How neural networks learn",
  subtitle: "A four-page letter shows that hidden layers can learn useful internal features by passing errors backwards.",
  paper: {
    title: "Learning Representations by Back-propagating Errors",
    authors: ["David E. Rumelhart", "Geoffrey E. Hinton", "Ronald J. Williams"],
    year: 1986,
    venue: "Nature",
    url: "https://doi.org/10.1038/323533a0",
    doi: "10.1038/323533a0",
  },
  field: "Machine learning",
  accent: "#db2777",
  level: "intermediate",
  source: "curated",
  summary:
    "Networks of simple units had been studied since the 1940s, but nobody had a practical way to train the units in the middle, the ones not directly connected to inputs or outputs. This paper showed that gradient descent with errors passed backwards through the network trains them, and that the hidden units then discover meaningful features on their own.",
  whyItMatters:
    "Backpropagation is still how essentially every neural network is trained, from image classifiers to large language models. The paper's demonstration that networks learn their own internal representations set the agenda for deep learning.",
  nodes: [
    {
      id: "unit",
      conceptId: "ml/artificial-neuron",
      title: "A single unit",
      kind: "concept",
      whyYouNeedThis: "The paper's networks are built from units that weight their inputs, add them up and squash the result. Everything else is about adjusting those weights.",
      lesson: [
        {
          heading: "Weighted sum",
          body: "A unit takes inputs $x_1, \\ldots, x_n$, multiplies each by a **weight** $w_i$, adds a **bias** $b$, and gets its total input:\n\n$$z = \\sum_i w_i x_i + b$$\n\nPositive weights make an input push the unit on; negative weights push it off. Learning means finding good weights.",
        },
        {
          heading: "Activation",
          body: "The unit's output is a function of $z$. The paper uses the **logistic sigmoid**:\n\n$$y = \\frac{1}{1 + e^{-z}}$$\n\nIt runs smoothly from 0 to 1, passing 0.5 at $z = 0$. A hard step function would give 0 or 1 exactly, but the smooth version has a slope everywhere, which is what makes gradient-based learning possible. Its slope has a neat form: $dy/dz = y(1 - y)$.",
        },
      ],
      whatWeSkip: "We skip ReLU and other modern activations beyond a mention in the widget.",
      interactive: {
        widget: "neuron",
        params: { inputs: [1, 0.5], weights: [1.5, -2], bias: 0.5, activation: "sigmoid" },
        caption: "Change the weights and bias. The unit adds up weighted inputs and passes the total through the chosen activation.",
        altText: "A diagram of two inputs feeding a unit through weighted connections, with sliders for weights and bias and the resulting output.",
      },
      workedExample: {
        prompt: "Inputs $(1, 0.5)$, weights $(1.5, -2)$, bias $0.5$. What is $z$, and the sigmoid output?",
        steps: ["$z = 1.5(1) + (-2)(0.5) + 0.5 = 1$.", "$y = 1/(1 + e^{-1}) \\approx 0.731$."],
        answer: "$z = 1$, $y \\approx 0.73$",
      },
      inThePaper: {
        text: "The paper's units compute a linear total input and a non-linear output, using the logistic function in its equations (1) and (2).",
        sections: ["Equations 1–2"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "u1",
            type: "numeric",
            tag: "application",
            prompt: "Inputs (2, 1), weights (0.5, −1), bias 0.5. What is the total input z?",
            answer: 0.5,
            tolerance: 0.0001,
            explanation: "$0.5(2) - 1(1) + 0.5 = 0.5$.",
          },
          {
            id: "u2",
            type: "numeric",
            tag: "application",
            prompt: "What is the sigmoid's slope $y(1-y)$ at $z = 0$?",
            answer: 0.25,
            tolerance: 0.0001,
            explanation: "At $z = 0$, $y = 0.5$, so $0.5 \\times 0.5 = 0.25$.",
          },
          {
            id: "u3",
            type: "single",
            tag: "paper-link",
            prompt: "Why does the paper use a smooth sigmoid rather than a hard threshold?",
            options: [
              { id: "a", text: "It has a derivative everywhere, so gradients can be computed", correct: true, feedback: "Yes." },
              { id: "b", text: "It is faster to compute", correct: false, feedback: "The step is faster; smoothness is the point." },
              { id: "c", text: "It gives outputs above 1", correct: false, feedback: "Sigmoid stays between 0 and 1." },
            ],
            explanation: "A step function's slope is zero almost everywhere, giving no learning signal.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "hidden",
      conceptId: "ml/hidden-layers",
      title: "Hidden units and their limits",
      kind: "concept",
      whyYouNeedThis: "The paper's contribution is training units that are neither inputs nor outputs. You need to know why they're needed and why they were hard.",
      lesson: [
        {
          heading: "What one layer can't do",
          body: "A single unit with a threshold draws a straight line (a flat boundary) through its input space and answers yes on one side. So it can compute AND and OR, but not **XOR** (true when exactly one input is on): no single straight line separates (0,1) and (1,0) from (0,0) and (1,1).\n\nMarvin Minsky and Seymour Papert's 1969 book *Perceptrons* laid out such limits, and interest in networks declined.",
        },
        {
          heading: "Hidden units fix it, if you can train them",
          body: "Add a layer of **hidden units** between input and output. One hidden unit can compute OR, another AND, and the output can compute 'OR but not AND', which is XOR. Hidden layers let networks build intermediate features.\n\nThe old perceptron learning rule adjusts weights using each unit's own error, but a hidden unit has no target value, so its error is unknown. That was the **credit assignment problem**: which hidden weights are responsible for an output mistake?",
        },
      ],
      whatWeSkip: "We skip the perceptron convergence theorem and the formal definition of linear separability.",
      inThePaper: {
        text: "The opening paragraphs contrast the perceptron-convergence procedure, which can't adjust hidden units, with the new procedure, which makes hidden units represent important features of the task domain.",
        sections: ["Opening paragraphs"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "h1",
            type: "single",
            tag: "recall",
            prompt: "Why can't a single threshold unit compute XOR?",
            options: [
              { id: "a", text: "No single straight line separates XOR's true cases from its false cases", correct: true, feedback: "Yes." },
              { id: "b", text: "XOR needs more than two inputs", correct: false, feedback: "XOR has two inputs." },
              { id: "c", text: "The weights would have to be infinite", correct: false, feedback: "No finite or infinite weights help." },
            ],
            explanation: "XOR isn't linearly separable.",
          },
          {
            id: "h2",
            type: "single",
            tag: "recall",
            prompt: "What was the credit assignment problem?",
            options: [
              { id: "a", text: "Hidden units have no target, so it's unclear how to change their weights to reduce output error", correct: true, feedback: "Yes." },
              { id: "b", text: "Deciding which researcher gets credit", correct: false, feedback: "Not that kind of credit." },
              { id: "c", text: "Choosing the learning rate", correct: false, feedback: "A tuning question, not this problem." },
            ],
            explanation: "Blame has to be passed back to hidden weights.",
          },
          {
            id: "h3",
            type: "single",
            tag: "application",
            prompt: "Which hidden features let a network compute XOR of two inputs?",
            options: [
              { id: "a", text: "OR and AND, then output 'OR and not AND'", correct: true, feedback: "Yes." },
              { id: "b", text: "Two copies of the first input", correct: false, feedback: "That loses the second input." },
              { id: "c", text: "No hidden features can help", correct: false, feedback: "Hidden layers are exactly what help." },
            ],
            explanation: "XOR = OR ∧ ¬AND.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "loss",
      conceptId: "ml/loss-functions",
      title: "Measuring error",
      kind: "concept",
      whyYouNeedThis: "Learning in the paper means reducing a single number: the total squared error between what the network outputs and what it should output.",
      lesson: [
        {
          heading: "Squared error",
          body: "For each training case the network produces outputs $y_j$ and we know the desired outputs $d_j$. The paper's error measure is\n\n$$E = \\tfrac12 \\sum_{c} \\sum_{j} (y_{j,c} - d_{j,c})^2$$\n\nsumming over cases $c$ and output units $j$. Squaring makes every miss count positively and punishes big misses more. The $\\tfrac12$ just tidies the derivative.",
        },
        {
          heading: "Learning as minimising",
          body: "E depends on every weight in the network. Picture a landscape whose coordinates are the weights and whose height is E. Learning means walking downhill to a low point.\n\nThe landscape may have many valleys. The paper notes that getting stuck in a poor local minimum seldom happened in their experiments, though it can. Adding more connections tends to help by opening extra routes downhill.",
        },
      ],
      whatWeSkip: "We skip cross-entropy loss, the modern default for classification.",
      workedExample: {
        prompt: "Outputs $(0.8, 0.3)$, desired $(1, 0)$. What is E for this case?",
        steps: ["Misses: $-0.2$ and $0.3$.", "Squares: $0.04 + 0.09 = 0.13$.", "Half: $0.065$."],
        answer: "$E = 0.065$",
      },
      inThePaper: {
        text: "Equation (3) defines the total error E as half the sum of squared differences between actual and desired outputs over all cases and output units.",
        sections: ["Equation 3"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "l1",
            type: "numeric",
            tag: "application",
            prompt: "One output, desired 1, actual 0.6. What is $E = \\tfrac12(y - d)^2$?",
            answer: 0.08,
            tolerance: 0.0001,
            explanation: "$\\tfrac12(0.4)^2 = 0.08$.",
          },
          {
            id: "l2",
            type: "single",
            tag: "recall",
            prompt: "Why square the differences?",
            options: [
              { id: "a", text: "So all misses count positively and large misses count more", correct: true, feedback: "Yes." },
              { id: "b", text: "To make the error smaller", correct: false, feedback: "Squaring makes errors above 1 larger." },
              { id: "c", text: "Because outputs are always negative", correct: false, feedback: "No." },
            ],
            explanation: "Positive, smooth and emphasising big errors.",
          },
          {
            id: "l3",
            type: "single",
            tag: "paper-link",
            prompt: "What does the paper report about local minima?",
            options: [
              { id: "a", text: "They seldom caused problems in practice, and extra connections help avoid them", correct: true, feedback: "Yes." },
              { id: "b", text: "They make the method useless", correct: false, feedback: "No." },
              { id: "c", text: "They cannot occur", correct: false, feedback: "They can, and the paper says so." },
            ],
            explanation: "A practical observation, not a guarantee.",
          },
        ],
      },
      estimatedMinutes: 5,
    },
    {
      id: "descent",
      conceptId: "ml/gradient-descent",
      title: "Gradient descent",
      kind: "concept",
      whyYouNeedThis: "The weights are changed by stepping against the gradient of E. The paper's update rule is gradient descent with momentum.",
      lesson: [
        {
          heading: "Step downhill",
          body: "The **gradient** $\\partial E/\\partial w$ says how E changes when a weight changes a little. To reduce E, move each weight a small amount the other way:\n\n$$\\Delta w = -\\varepsilon \\frac{\\partial E}{\\partial w}$$\n\n$\\varepsilon$ is the **learning rate**. Too small and learning crawls; too big and each step overshoots the valley, sometimes wildly. Try it in the widget.",
        },
        {
          heading: "Momentum",
          body: "The paper adds **momentum**: each step also keeps a fraction $\\alpha$ of the previous step.\n\n$$\\Delta w(t) = -\\varepsilon \\frac{\\partial E}{\\partial w}(t) + \\alpha\\, \\Delta w(t-1)$$\n\nLike a ball rolling downhill, it builds up speed along consistent directions and damps zig-zags across narrow valleys. Momentum is still standard in modern optimisers.",
        },
      ],
      whatWeSkip: "We skip stochastic mini-batches and adaptive methods like Adam.",
      interactive: {
        widget: "gradient-descent",
        params: { curve: "bowl", start: 3.5, learningRate: 0.3 },
        caption: "Step down the loss curve. Raise the learning rate past 1 to see overshooting, and past 2 to see divergence.",
        altText: "A U-shaped loss curve with a ball that moves downhill in steps, and a learning-rate slider.",
      },
      workedExample: {
        prompt: "$E(w) = \\tfrac12 w^2$, so $\\partial E/\\partial w = w$. From $w = 2$ with $\\varepsilon = 0.5$, take two steps.",
        steps: ["Step 1: $w = 2 - 0.5(2) = 1$.", "Step 2: $w = 1 - 0.5(1) = 0.5$."],
        answer: "$w = 0.5$, halving each step towards the minimum at 0",
      },
      inThePaper: {
        text: "Equation (8) gives the simplest update, proportional to the accumulated $\\partial E/\\partial w$; equation (9) adds the momentum term with factor $\\alpha$.",
        sections: ["Equations 8–9"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "g1",
            type: "numeric",
            tag: "application",
            prompt: "$\\partial E/\\partial w = 4$, learning rate 0.1. What is $\\Delta w$ (no momentum)?",
            answer: -0.4,
            tolerance: 0.0001,
            explanation: "$-0.1 \\times 4 = -0.4$.",
          },
          {
            id: "g2",
            type: "numeric",
            tag: "application",
            prompt: "With momentum $\\alpha = 0.9$, previous step $-0.4$, current gradient 2 and learning rate 0.1, what is the new $\\Delta w$?",
            answer: -0.56,
            tolerance: 0.0001,
            explanation: "$-0.1(2) + 0.9(-0.4) = -0.2 - 0.36 = -0.56$.",
          },
          {
            id: "g3",
            type: "single",
            tag: "application",
            prompt: "In the widget's bowl, what happens with a learning rate above 2?",
            options: [
              { id: "a", text: "Each step overshoots further, and the parameter diverges", correct: true, feedback: "Yes." },
              { id: "b", text: "It converges faster", correct: false, feedback: "Try it: it blows up." },
              { id: "c", text: "Nothing changes", correct: false, feedback: "The learning rate matters a lot." },
            ],
            explanation: "For $E = \\tfrac12 w^2$, each step multiplies $w$ by $1 - \\varepsilon$; beyond 2 that has size above 1.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "chain",
      conceptId: "math/chain-rule",
      title: "The chain rule",
      kind: "concept",
      whyYouNeedThis: "Backpropagation is the chain rule applied systematically. You need to differentiate a function of a function.",
      lesson: [
        {
          heading: "Rates multiply along a chain",
          body: "If $y$ depends on $u$, and $u$ depends on $x$, then a small change in $x$ changes $u$, which changes $y$. The rates multiply:\n\n$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$\n\nIf $u$ changes 3 times as fast as $x$, and $y$ changes 2 times as fast as $u$, then $y$ changes 6 times as fast as $x$.",
        },
        {
          heading: "Longer chains and branches",
          body: "For a longer chain, multiply all the links. If a variable affects the output through several paths, add the contributions from each path.\n\nA network is a large chain: weight → total input → unit output → next unit's input → … → error. The chain rule gives the effect of any weight on the error as a product of local rates along the way, summed over paths.",
        },
      ],
      whatWeSkip: "We skip partial derivatives in full generality and Jacobian matrices.",
      workedExample: {
        prompt: "Find $dy/dx$ for $y = (3x + 1)^2$ at $x = 1$.",
        steps: ["Let $u = 3x + 1$, so $y = u^2$.", "$dy/du = 2u = 8$ at $x = 1$; $du/dx = 3$.", "Multiply: $8 \\times 3$."],
        answer: "24",
      },
      inThePaper: {
        text: "Equations (4) to (7) apply the chain rule to get the error derivative with respect to each unit's input, output and incoming weights.",
        sections: ["Equations 4–7"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "c1",
            type: "numeric",
            tag: "application",
            prompt: "$y = u^3$ and $u = 2x$. What is $dy/dx$ at $x = 1$?",
            answer: 24,
            tolerance: 0,
            explanation: "$u = 2$, $dy/du = 3u^2 = 12$, $du/dx = 2$, product 24.",
          },
          {
            id: "c2",
            type: "single",
            tag: "recall",
            prompt: "A variable affects the output through two separate paths. How do you combine them?",
            options: [
              { id: "a", text: "Add the contributions from each path", correct: true, feedback: "Yes." },
              { id: "b", text: "Multiply the two paths together", correct: false, feedback: "Multiply along a path; add across paths." },
              { id: "c", text: "Take the larger one", correct: false, feedback: "Both contribute." },
            ],
            explanation: "Multiply along, add across.",
          },
          {
            id: "c3",
            type: "numeric",
            tag: "paper-link",
            prompt: "A sigmoid unit has output $y = 0.8$ and $\\partial E/\\partial y = 0.5$. Using $dy/dz = y(1-y)$, what is $\\partial E/\\partial z$?",
            answer: 0.08,
            tolerance: 0.0001,
            explanation: "$0.5 \\times 0.8 \\times 0.2 = 0.08$. This is exactly the step in the paper's equation (5).",
          },
        ],
      },
      estimatedMinutes: 6,
    },
    {
      id: "backprop",
      conceptId: "ml/backpropagation",
      title: "Back-propagating the error",
      kind: "concept",
      whyYouNeedThis: "This is the procedure the paper introduces. It computes every weight's gradient in one backward sweep.",
      lesson: [
        {
          heading: "Forward, then backward",
          body: "**Forward pass**: feed an input through the network layer by layer, storing each unit's output.\n\n**Backward pass**: start at the output, where $\\partial E/\\partial y = y - d$. Use the chain rule to get $\\partial E/\\partial z$ for each output unit, then the gradient for each weight into it: $\\partial E/\\partial w_{ji} = \\partial E/\\partial z_j \\cdot y_i$. Pass the error back to the layer below: each lower unit's $\\partial E/\\partial y_i$ is the sum of $\\partial E/\\partial z_j \\cdot w_{ji}$ over the units it feeds. Repeat down to the inputs.",
        },
        {
          heading: "Why it's efficient",
          body: "Each weight's gradient reuses quantities already computed for the layer above, so the whole backward pass costs about the same as the forward pass. Computing each gradient separately would multiply the work by the number of weights.\n\nThe same idea, reverse-mode differentiation, had been described earlier by others, including Seppo Linnainmaa in 1970 and Paul Werbos in 1974. This paper's impact came from showing clearly what it could do for learning representations.",
        },
      ],
      whatWeSkip: "We skip the paper's extension to recurrent networks, where the network is unrolled over time steps.",
      interactive: {
        widget: "computation-graph",
        params: { x: 2, w: 0.5, b: 0, y: 3 },
        caption: "The loss $(wx + b - y)^2$ as a graph. Show the backward pass to see each node's gradient, then take gradient steps and watch the loss fall.",
        altText: "A computation graph from inputs x, w and b to a squared-error loss, with forward values and backward gradients.",
      },
      inThePaper: {
        text: "The backward pass is equations (4) to (7): compute $\\partial E/\\partial y$ at the outputs, convert to $\\partial E/\\partial x$ (total input), get weight derivatives, and propagate to the layer below.",
        sections: ["Equations 4–7"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "b1",
            type: "numeric",
            tag: "application",
            prompt: "In the widget's starting state (x = 2, w = 0.5, b = 0, y = 3), what is $\\partial L/\\partial w$?",
            answer: -8,
            tolerance: 0.001,
            explanation: "Prediction 1, error −2, $\\partial L/\\partial w = 2 \\times (-2) \\times 2 = -8$.",
          },
          {
            id: "b2",
            type: "order",
            tag: "paper-link",
            prompt: "Order one training step with backpropagation.",
            items: [
              { id: "a", text: "Forward pass: compute every unit's output" },
              { id: "b", text: "Compute the error derivative at the outputs" },
              { id: "c", text: "Propagate derivatives backwards layer by layer" },
              { id: "d", text: "Update each weight against its gradient" },
            ],
            correctOrder: ["a", "b", "c", "d"],
            explanation: "Forward, output error, backward, update.",
          },
          {
            id: "b3",
            type: "single",
            tag: "recall",
            prompt: "Why is backpropagation efficient?",
            options: [
              { id: "a", text: "It reuses each layer's derivatives for the layer below, so the backward pass costs about as much as the forward pass", correct: true, feedback: "Yes." },
              { id: "b", text: "It only updates the output layer", correct: false, feedback: "It updates all layers." },
              { id: "c", text: "It skips the chain rule", correct: false, feedback: "It is the chain rule, organised well." },
            ],
            explanation: "Shared intermediate results.",
          },
          {
            id: "b4",
            type: "single",
            tag: "recall",
            prompt: "Was this paper the first to describe reverse-mode differentiation?",
            options: [
              { id: "a", text: "No: Linnainmaa and Werbos described it earlier; this paper showed its power for learning representations", correct: true, feedback: "Yes." },
              { id: "b", text: "Yes, it was entirely new", correct: false, feedback: "Earlier work existed." },
            ],
            explanation: "Impact, not priority.",
          },
        ],
      },
      estimatedMinutes: 9,
    },
    {
      id: "representations",
      conceptId: "ml/learned-representations",
      title: "Networks learn their own features",
      kind: "concept",
      whyYouNeedThis: "The title says 'learning representations'. The paper's evidence is what the hidden units ended up encoding.",
      lesson: [
        {
          heading: "The family-tree network",
          body: "The paper trains a network on relationships in two family trees, one English and one Italian, with the same structure. Inputs are a person and a relationship ('Colin', 'aunt'); outputs are the people who fit.\n\nNobody told the network about nationality or generation. Yet after training, individual hidden units encoded exactly those: one unit distinguished English from Italian people, others encoded generation and which branch of the family someone belonged to. These features made the task easier, so learning found them.",
        },
        {
          heading: "Generalisation",
          body: "The network was trained on most of the relationship facts and tested on a few it had never seen. It answered the held-out cases correctly, because the features it learned captured the structure rather than memorising pairs.\n\nThe paper also shows a network detecting mirror symmetry in a row of inputs using just two hidden units with elegantly balanced weights. Both examples make the same point: backpropagation discovers internal representations tailored to the task.",
        },
      ],
      whatWeSkip: "We skip the exact architecture of the family-tree network and its training schedule.",
      inThePaper: {
        text: "Figures 2 to 4 show the family trees, the network and the weights of hidden units, labelled by what they turned out to represent. Figure 1 shows the symmetry-detecting network.",
        sections: ["Figures 1–4"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "rp1",
            type: "multi",
            tag: "paper-link",
            prompt: "Which features did hidden units discover in the family-tree task?",
            options: [
              { id: "a", text: "Nationality (English or Italian)", correct: true, feedback: "Yes." },
              { id: "b", text: "Generation", correct: true, feedback: "Yes." },
              { id: "c", text: "Branch of the family", correct: true, feedback: "Yes." },
              { id: "d", text: "Each person's birthday", correct: false, feedback: "Not in the data." },
            ],
            explanation: "Features that make relationships predictable.",
          },
          {
            id: "rp2",
            type: "single",
            tag: "recall",
            prompt: "Why is it significant that nobody specified these features?",
            options: [
              { id: "a", text: "It shows learning can discover useful representations automatically", correct: true, feedback: "Yes." },
              { id: "b", text: "It shows the network memorised the data", correct: false, feedback: "Generalisation shows it didn't just memorise." },
              { id: "c", text: "It isn't significant", correct: false, feedback: "It's the paper's main point." },
            ],
            explanation: "Representation learning.",
          },
          {
            id: "rp3",
            type: "single",
            tag: "application",
            prompt: "A network trained on photos has a hidden unit that responds to eyes, though no label mentioned eyes. Which idea from the paper is this?",
            options: [
              { id: "a", text: "Hidden units learning task-relevant features", correct: true, feedback: "Yes." },
              { id: "b", text: "Momentum", correct: false, feedback: "Momentum is about optimisation." },
              { id: "c", text: "Squared error", correct: false, feedback: "Not the key idea." },
            ],
            explanation: "The same effect, at scale.",
          },
        ],
      },
      estimatedMinutes: 7,
    },
    {
      id: "paper",
      conceptId: "paper/rumelhart-1986",
      title: "The paper: back-propagating errors",
      kind: "paper",
      whyYouNeedThis: "It's four pages. You now know every equation and figure.",
      lesson: [
        {
          heading: "Structure",
          body: "The letter sets up the problem (training hidden units), defines the units and the error, derives the backward pass (equations 4 to 7), gives the update rule with momentum (8 and 9), then shows the symmetry and family-tree examples and the extension to recurrent networks. It ends by admitting the procedure isn't a plausible model of learning in brains, and arguing that it's still worth studying for what it can do.",
        },
        {
          heading: "What happened next",
          body: "The paper, together with the book *Parallel Distributed Processing* from the same year, revived neural network research. Limited computers and data held progress back until the 2000s, when GPUs and large datasets arrived. Deep learning since then has run on the same algorithm. Geoffrey Hinton shared the 2018 Turing Award and the 2024 Nobel Prize in Physics for work on neural networks.",
        },
      ],
      whatWeSkip: "We skip the recurrent-network section in detail.",
      inThePaper: {
        text: "Read straight through. Pause at equations 4 to 7 and check each against the chain rule, then study the family-tree figures.",
        sections: ["Whole paper"],
      },
      quiz: {
        passMark: 0.75,
        questions: [
          {
            id: "bp1",
            type: "order",
            tag: "paper-link",
            prompt: "Order the paper's content.",
            items: [
              { id: "a", text: "The problem of training hidden units" },
              { id: "b", text: "Units and the error measure" },
              { id: "c", text: "The backward pass equations" },
              { id: "d", text: "Weight updates with momentum" },
              { id: "e", text: "Symmetry and family-tree examples" },
            ],
            correctOrder: ["a", "b", "c", "d", "e"],
            explanation: "Problem, model, method, update, demonstrations.",
          },
          {
            id: "bp2",
            type: "single",
            tag: "paper-link",
            prompt: "What does the paper say about backpropagation and the brain?",
            options: [
              { id: "a", text: "It doesn't claim the brain learns this way", correct: true, feedback: "Yes. It says the procedure is not a plausible model of learning in brains." },
              { id: "b", text: "It proves the brain uses backpropagation", correct: false, feedback: "No." },
            ],
            explanation: "An engineering result, not a neuroscience claim.",
          },
          {
            id: "bp3",
            type: "multi",
            tag: "recall",
            prompt: "What held neural networks back between 1986 and the 2000s?",
            options: [
              { id: "a", text: "Slow computers", correct: true, feedback: "Yes." },
              { id: "b", text: "Small datasets", correct: true, feedback: "Yes." },
              { id: "c", text: "Backpropagation not working", correct: false, feedback: "It worked; scale was missing." },
            ],
            explanation: "Compute and data, not the algorithm.",
          },
        ],
      },
      estimatedMinutes: 6,
    },
  ],
  edges: [
    { from: "unit", to: "hidden" },
    { from: "loss", to: "descent" },
    { from: "hidden", to: "backprop" },
    { from: "descent", to: "backprop" },
    { from: "chain", to: "backprop" },
    { from: "backprop", to: "representations" },
    { from: "representations", to: "paper" },
  ],
  paperNodeId: "paper",
  readingPlan: [
    { section: "Opening", focus: "Why hidden units matter and why the perceptron rule can't train them.", conceptIds: ["hidden"] },
    { section: "Equations 1–7", focus: "Units, error and the backward pass. Check each line with the chain rule.", conceptIds: ["unit", "loss", "chain", "backprop"] },
    { section: "Equations 8–9", focus: "Gradient descent and momentum.", conceptIds: ["descent"] },
    { section: "Figures 1–4", focus: "Symmetry detection and the family trees: what hidden units learned.", conceptIds: ["representations"] },
  ],
};

export default withVisuals(backprop, visuals);
