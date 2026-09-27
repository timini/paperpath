# PaperPath implementation plan

This plan turns [SPEC.md](SPEC.md) into stages. Each stage is a GitHub epic. Epics 1 to 7 are the MVP; 8 to 10 are v1.

## MVP

### Epic 1: Project foundation and Firebase

Set up the app, the Firebase project and deployment.

- Vite, React and TypeScript app with routing, linting and tests.
- Firebase project with Hosting, Firestore and Auth (anonymous).
- `firebase.json`, Firestore rules and indexes in the repo.
- Environment config for the Firebase web app.
- npm scripts: `dev`, `build`, `test`, `validate:content`, `deploy`.

Done when: an empty app deploys to Firebase Hosting and signs in anonymously.

### Epic 2: Content schema and validation

Define the journey data structures once and use them everywhere.

- TypeScript types and runtime schemas (zod) for journeys, nodes, questions, interactives and user data, as in SPEC section 9.
- Graph checks: acyclic, every node reaches the paper node, edges reference real nodes, depth computed.
- Widget parameter schemas, one per widget.
- `validate:content` script that fails the build on any invalid journey.
- Seed script that mirrors journey JSON into Firestore.

Done when: invalid content fails CI with a readable message, and valid journeys load in the app.

### Epic 3: Learning UI

The screens a learner uses.

- Catalogue: journey cards with field, year, length and progress.
- Journey page: paper summary, why it matters, progress, and the journey map.
- Journey map: vertical level path on phones, graph view on wide screens; node states from SPEC 5.1.
- Node page: why you need this, lesson sections, interactive, worked example, in the paper, quiz.
- Quiz engine: single, multi, numeric and order questions; per-option feedback; pass mark; retry with reshuffle; test out.
- Paper node: reading plan and link to the paper.
- Completion screen.
- KaTeX rendering for maths in all text fields.

Done when: a learner can complete a full journey end to end on a phone.

### Epic 4: Interactive widget library

The vetted components from SPEC 5.4.

- Widget registry mapping names to components and parameter schemas.
- Seventeen MVP widgets, each touch-friendly, responsive and with alt text.
- Reduced-motion support.
- A dev gallery page that renders every widget with sample parameters.

Done when: every widget used by the ten journeys renders correctly at 360 px and on desktop.

### Epic 5: Progress, gating and freemium

- Progress stored per user and journey in Firestore, with a local fallback while offline or signed out.
- Unlock rules from SPEC 5.3.
- XP, first-try bonus and daily streak.
- Freemium: free preview of every journey's map and first node; one free journey claimed once; locked state and paywall for the rest.
- Paywall screen with pricing and "coming soon" purchase until Stripe lands in Epic 8.
- Firestore rules enforcing owner-only access, one-time free claim and no client entitlement writes, with rules unit tests.

Done when: rules tests pass, and a new user can claim exactly one free journey.

### Epic 6: Ten curated journeys

Author the launch content with Claude Code, following the same schema the generator will use.

- One journey per paper in SPEC section 10, 7 to 10 nodes each plus the paper node.
- Each node: lesson scoped to the paper, interactive, worked example, in-the-paper note, and 3 to 5 quiz questions with feedback on every option.
- Reading plan per journey.
- Review pass on facts, answer keys and paper references.

Done when: all ten validate, and a spot check of every quiz answer key passes.

### Epic 7: Mobile, accessibility, QA and launch

- Layout checks at 360, 390, 768 and 1280 px with no horizontal scroll.
- Keyboard and screen-reader pass on quiz and navigation.
- Lighthouse performance and accessibility at 90 or above on mobile.
- Playwright smoke tests: catalogue, open a journey, pass a node, unlock the next.
- Deploy to production on Firebase Hosting.

Done when: the live URL passes the smoke tests on mobile and desktop.

## v1

### Epic 8: Payments

- Google sign-in and anonymous-account upgrade.
- Stripe Checkout per journey; Cloud Function webhook writes entitlements.
- Receipts, refunds process and purchase history.

### Epic 9: Dynamic generation with the Claude Agent SDK

- Upload a PDF or paste an arXiv or DOI link.
- Cloud Run job running the PaperPath agent (SPEC 7.2) with tools for parsing, concept search, widget catalogue, schema validation and writing to the journey.
- Streaming writes so the first nodes appear early.
- Verification stage and flagging.
- Per-job cost budget and monitoring.

### Epic 10: Diagnostic and concept library

- Shared concept library with canonical IDs and cached core content.
- Diagnostic quiz at journey start that marks known nodes as tested out.
- Mastery transfer across journeys.
- Spaced review.
