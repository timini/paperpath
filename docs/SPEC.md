# PaperPath product spec

Version 0.1, September 2026.

## 1. Summary

PaperPath turns a research paper into a learning journey. You give it a paper; it builds a dependency graph of the ideas you need to understand that paper, then teaches each idea only as far as the paper needs it. Every node has a short lesson, an interactive visual and a quiz. You pass a node's quiz to unlock the nodes that depend on it. The last node is the paper itself.

The product is a mobile-friendly web app on Firebase. Journeys are generated on the backend by an agent built on the Claude Agent SDK. The MVP ships the data model, the full learning UI and ten hand-built journeys for landmark papers, so the learning experience can be tuned before dynamic generation is switched on.

## 2. Problem

Reading a paper outside your field fails in a predictable way. You hit a term, an equation or a method you don't know, go looking for it, and land in a course or textbook that covers ten times more than you need, in different notation. Most people give up or skim.

Existing tools help at the edges:

- Paper explainers (chat with a PDF) answer questions but don't tell you what you are missing or in what order to learn it.
- Courses (Brilliant, Khan Academy, Coursera) teach whole subjects, not the slice a paper uses.
- PDF-to-knowledge-graph tools (CortexOS, PaperQuest) map the document's own structure. They don't scope teaching to the paper's use of each idea, don't adapt the graph to what the reader already knows, and don't gate progress.

## 3. Users

Primary: people who need to read a specific paper and lack some of its background.

- Researchers crossing fields, such as ML engineers reading biology papers or biologists reading ML papers.
- Graduate and advanced undergraduate students given a paper to present.
- Engineers and technical managers evaluating a method.
- Curious readers who want to understand a famous paper properly.

Not the target: people who want a full course in a subject, and people preparing for a standardised exam.

## 4. Product principles

1. Just enough. Every lesson states what it covers and what it leaves out, and ends by connecting back to the paper.
2. The paper's own terms. Examples use the paper's notation, quantities and setting.
3. Earned progress. A node is mastered when you pass its quiz. The graph opens up as you go.
4. Short sessions. A node takes 5 to 10 minutes on a phone.
5. Honest content. Generated material is verified before it is shown, and every quiz answer is checked.

## 5. Core experience

### 5.1 Journey map

The home of a journey is its graph: nodes are concepts, edges point from prerequisite to dependant. The paper is the final node at the top.

Node states:

| State | Meaning | Visual |
|---|---|---|
| Locked | At least one prerequisite is not mastered | Greyed, padlock |
| Available | All prerequisites mastered, not yet passed | Highlighted, pulsing ring |
| In progress | Lesson opened, quiz not yet passed | Partial ring |
| Mastered | Quiz passed | Filled, tick |
| Tested out | Skipped by passing the quiz without the lesson | Filled, lightning mark |

On a phone the map is shown as a vertical path of levels (grouped by depth), with an optional zoomable graph view. On desktop the graph is primary.

### 5.2 Node

Each node has, in order:

1. Why you need this: one or two sentences tying the concept to a specific place in the paper.
2. Lesson: 150 to 400 words in two or three short sections, scoped to the paper. Includes a "What we skip" note.
3. Interactive: one visual the learner manipulates (see 5.4).
4. Worked example: in the paper's notation.
5. In the paper: where and how the paper uses the idea, with section references.
6. Quiz: 3 to 5 questions.

### 5.3 Quiz and gating

- Question types: multiple choice, multiple select, numeric answer with tolerance, and ordering.
- Every option carries feedback. Wrong options explain the misconception behind them.
- Pass mark: 80%, rounded up, and at least one question must be the application or paper-link type.
- Retry: allowed immediately. The MVP reshuffles questions and options; v1 draws from a larger bank.
- Test out: a learner can take the quiz before the lesson. Passing marks the node as tested out.
- Unlock rule: a node becomes available when every prerequisite is mastered or tested out.

### 5.4 Interactives

Interactives are built from a vetted library of React components, not generated code. The generator chooses a component and supplies its parameters as data. This keeps visuals safe, accessible and mobile-friendly, and lets the library grow as new journeys need new widgets.

MVP library of 17 widgets (each is a component with a typed parameter schema):

| Widget | Used for |
|---|---|
| `turing-machine` | Stepping a machine over a tape |
| `entropy-calculator` | Adjusting probabilities and watching entropy change |
| `channel-noise` | Sending bits through a noisy channel |
| `base-pairing` | Pairing bases and seeing the double helix constraint |
| `hubble-plot` | Fitting a line to distance and velocity data |
| `redshift` | Shifting a spectral line with recession velocity |
| `payoff-matrix` | Finding best responses and equilibria in a 2x2 game |
| `lorenz-attractor` | Running the Lorenz system and comparing nearby starts |
| `modular-arithmetic` | Clock arithmetic and modular exponentiation |
| `key-exchange` | Walking through Diffie-Hellman with small numbers |
| `gradient-descent` | Stepping down a loss surface with a learning rate |
| `neuron` | Weighted sum, bias and activation for one unit |
| `computation-graph` | Forward and backward passes through a small loss |
| `softmax` | Turning scores into probabilities, with temperature |
| `attention-heatmap` | Query-key scores over a short sentence |
| `vector-dot` | Dragging two vectors and reading their dot product |
| `protein-contacts` | Residue distances as a contact map |

Every widget must work with touch, fit a 360 px wide screen, and provide a text alternative.

### 5.5 Diagnostic (v1)

Before a generated journey starts, a 3 to 5 minute diagnostic samples questions from leaf and mid-level nodes. Nodes the learner answers correctly are marked tested out, so the graph shrinks to their gaps. The MVP offers per-node test out instead.

### 5.6 Progress and motivation

- XP per node mastered, with a bonus for passing first time.
- Daily streak.
- Journey progress bar towards "Paper unlocked".
- Completion screen with a shareable summary card (v1).
- Spaced review of mastered concepts that are reused across journeys (v1).

### 5.7 Reading the paper

The final node links to the paper (arXiv, DOI or publisher) and gives a guided reading plan: which sections to read in which order, and which concept each difficult passage depends on. PaperPath does not host paper PDFs it has no right to redistribute.

## 6. Freemium model

- Every signed-in user can start one journey free. They choose which.
- Each further journey is a one-off purchase. Launch price: £4.99 per journey (to be tested).
- A journey the user has started or bought stays available permanently.
- Browsing the catalogue, viewing a journey map and opening the first node of any journey is free without purchase, so users can judge quality before choosing.
- Uploading your own paper (v1) creates a new journey and counts as one journey.

Enforcement:

- The free choice is recorded once on the user document. Firestore rules allow it to be set only when absent.
- Paid entitlements are written only by the backend after a verified Stripe webhook. Clients can read but never write entitlements.
- Anonymous sign-in lets people try the app with no friction. Upgrading to Google sign-in keeps their progress. Purchases require a non-anonymous account.

## 7. Dynamic generation (v1)

### 7.1 Flow

1. User uploads a PDF or pastes an arXiv or DOI link.
2. Backend checks entitlement (free journey unused, or payment completed).
3. A generation job runs the PaperPath agent on the Claude Agent SDK in a Cloud Run job.
4. The job writes the journey to Firestore stage by stage, so the map and first nodes appear within about a minute while the rest fills in.
5. The user is notified when the journey is complete.

### 7.2 Agent pipeline

| Stage | Output | Checks |
|---|---|---|
| Parse | Structured text with equations as LaTeX, section map | Section count, equation count, reading-order sanity |
| Extract | Concepts the reader must know, each with where and why the paper uses it | Every concept cites at least one location |
| Canonicalise | Match to the shared concept library by embedding plus LLM check | No duplicate concepts in the journey |
| Build graph | Prerequisite edges, depth cap at a foundation level | Acyclic, connected to the paper node, transitive edges pruned, 8 to 20 nodes |
| Author nodes | Lesson, worked example, paper link, quiz, widget choice and parameters | Word counts, widget parameters validate against the widget schema |
| Verify | Independent check of facts, quiz answer keys and paper references | Low-confidence nodes are regenerated or flagged, never shown unverified |

The agent's tools: PDF parse, section and equation lookup, concept library search, widget catalogue with schemas, schema validator, and a write-to-journey tool that only accepts schema-valid documents.

### 7.3 Shared concept library

Concepts have canonical IDs shared across journeys (for example `linear-algebra/dot-product`). The general core of a lesson is cached per concept; the paper-specific layer (why you need it, worked example, in the paper, paper-link question) is generated per journey. Mastery transfers across journeys for the same concept, which also makes later journeys shorter and cheaper.

### 7.4 Cost control

- Cache general concept content.
- Cap nodes per journey at 20.
- Use a smaller model for parsing and canonicalisation, a larger one for authoring and verification.
- Per-journey cost budget. Generation stops and flags the job if exceeded.

## 8. Architecture

| Layer | Choice |
|---|---|
| Front end | React, TypeScript, Vite; React Router; KaTeX for maths |
| Hosting | Firebase Hosting |
| Auth | Firebase Auth: anonymous, then Google |
| Database | Cloud Firestore |
| Backend (v1) | Cloud Functions for entitlement and Stripe webhooks; Cloud Run job for generation with the Claude Agent SDK |
| Payments (v1) | Stripe Checkout; webhook writes entitlements |
| Storage (v1) | Cloud Storage for uploaded PDFs, private per user |
| Analytics | Firebase Analytics events for funnel and learning metrics |

MVP content is shipped as validated JSON files in the app and mirrored to Firestore by a seed script. The app reads journeys through one data-access module, so switching to Firestore-only content in v1 changes one module.

## 9. Data model

### 9.1 Content (read-only to clients)

```
journeys/{journeyId}
  title, subtitle, paper { title, authors[], year, venue, url, doi? }
  field, summary, whyItMatters, estimatedMinutes, level
  status: draft | published
  nodeIds[], edges[{ from, to }], paperNodeId
  readingPlan[{ section, focus, conceptIds[] }]
  source: curated | generated, generatedBy?, verifiedAt?

journeys/{journeyId}/nodes/{nodeId}
  conceptId, title, kind: concept | paper
  whyYouNeedThis, lesson[{ heading, body }], whatWeSkip
  interactive { widget, params, caption, altText }
  workedExample { prompt, steps[], answer }
  inThePaper { text, sections[] }
  quiz { passMark, questions[] }
  estimatedMinutes, depth

question
  id, type: single | multi | numeric | order
  prompt, options[{ id, text, correct, feedback }]      (single, multi)
  answer, tolerance, unit?, feedback { correct, incorrect }   (numeric)
  items[], correctOrder[]                               (order)
  explanation, tag: recall | application | paper-link

concepts/{conceptId}          (v1 shared library)
  title, field, summary, prerequisites[], cachedCore
```

### 9.2 User data (owner-only)

```
users/{uid}
  displayName?, createdAt, freeJourneyId?, xp, streak { current, lastDay }

users/{uid}/progress/{journeyId}
  startedAt, updatedAt, completedAt?
  nodes { [nodeId]: { state, bestScore, attempts, masteredAt? } }

users/{uid}/entitlements/{journeyId}      (written by backend only)
  source: free | purchase | grant, grantedAt, stripeSessionId?

users/{uid}/attempts/{attemptId}          (v1 analytics)
  journeyId, nodeId, score, answers, at
```

### 9.3 Security rules summary

- `journeys/**`: public read, no client writes.
- `users/{uid}`: owner read; owner create; owner update allowed except that `freeJourneyId` can only change from absent to a value, and `xp` can only increase.
- `users/{uid}/progress/**`: owner read and write.
- `users/{uid}/entitlements/**`: owner read; no client writes.

## 10. The ten launch journeys

"The ten most important papers of the last 100 years" has no single right answer. The launch set aims for papers that changed what later science could do, span fields, and can be taught through interactive visuals.

| # | Paper | Year | Field |
|---|---|---|---|
| 1 | Turing, "On Computable Numbers, with an Application to the Entscheidungsproblem" | 1936 | Computer science |
| 2 | Shannon, "A Mathematical Theory of Communication" | 1948 | Information theory |
| 3 | Watson and Crick, "Molecular Structure of Nucleic Acids" | 1953 | Molecular biology |
| 4 | Hubble, "A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae" | 1929 | Cosmology |
| 5 | Nash, "Equilibrium Points in n-Person Games" | 1950 | Economics, game theory |
| 6 | Lorenz, "Deterministic Nonperiodic Flow" | 1963 | Chaos, climate |
| 7 | Diffie and Hellman, "New Directions in Cryptography" | 1976 | Cryptography |
| 8 | Rumelhart, Hinton and Williams, "Learning Representations by Back-propagating Errors" | 1986 | Machine learning |
| 9 | Vaswani et al., "Attention Is All You Need" | 2017 | Machine learning |
| 10 | Jumper et al., "Highly Accurate Protein Structure Prediction with AlphaFold" | 2021 | Structural biology |

## 11. Mobile requirements

- Designed at 360 px first; no horizontal page scroll.
- Tap targets at least 44 px.
- Journey map as a vertical path on narrow screens.
- Lessons in short sections with sticky "Continue" button.
- Interactives respond to touch and pointer, and resize to their container.
- Works offline for a journey already opened (v1, service worker).

## 12. Accessibility

- WCAG 2.2 AA contrast and focus states.
- Every interactive has a text alternative describing what it shows.
- Quizzes fully operable by keyboard and screen reader.
- Motion reduced when the user prefers reduced motion.

## 13. Metrics

| Metric | Definition |
|---|---|
| Activation | Share of new users who master their first node |
| Journey completion | Share of started journeys that reach the paper node |
| Conversion | Share of users with a free journey who buy a second |
| First-try pass rate | Per node; very low means content or quiz problems |
| Time to first node (v1) | From upload to first node available |
| Content error reports | Per 1,000 node views |

## 14. Risks

| Risk | Mitigation |
|---|---|
| Wrong or hallucinated teaching | Verification stage, answer-key checks, report-a-problem button, curated launch set |
| Graphs too deep or too wide | Depth cap, node cap, diagnostic |
| Generation cost per journey | Concept cache, model tiering, budget per job |
| Copyright | Link to papers; do not host PDFs; short attributed quotes only; user uploads private |
| Payment abuse of the free journey | Free journey tied to account; anonymous users must sign in to claim; rules prevent reset |
| Weak interactives for some topics | Widget library grows with demand; fallback to a static diagram with alt text |

## 15. Roadmap

| Stage | Scope |
|---|---|
| MVP | Data model, learning UI, gating, progress, freemium entitlement model, ten curated journeys, deployed on Firebase |
| v1 | Stripe payments, Google sign-in upgrade, upload a paper, Claude Agent SDK generation, diagnostic, concept library |
| v2 | Spaced review, shared progress across journeys, study groups, more widgets, offline mode |

## 16. Open questions

1. Final price per journey, and whether to offer a bundle.
2. Whether generated journeys are private to the buyer or published to the catalogue.
3. Whether to allow users to edit or rate nodes.
4. Which verification threshold blocks a node from being shown.
