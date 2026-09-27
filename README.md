# PaperPath

Learn exactly what you need to understand a research paper. PaperPath turns a paper into a map of the ideas it depends on, teaches each idea only as far as the paper needs it, and gates progress with a quiz on every node.

Live: https://paperpath-learn.web.app

- Product spec: [docs/SPEC.md](docs/SPEC.md)
- Implementation plan: [docs/PLAN.md](docs/PLAN.md), tracked as epics in GitHub issues

## Status

Live with ten free journeys for landmark papers, from Hubble (1929) to AlphaFold (2021): 83 steps and 269 quiz questions. Every step has a visual: 57 animated step-through diagrams in a 3Blue1Brown-style dark stage, plus 26 hands-on interactives from a library of 18 widgets. Reading is free; generating a journey for your own paper is £5 (requests are recorded now; generation with the Claude Agent SDK and Stripe payments are epics 8 and 9). Sign-in is Firebase Auth: anonymous by default, with Google sign-in that keeps your progress.

## Layout

```
docs/                 spec and plan
firebase.json         hosting, Firestore and auth config
firestore.rules       security rules (owner-only user data, one-time free journey, no client entitlements)
web/                  the app (React, TypeScript, Vite)
  src/content/        schema, graph rules, quiz grading, validator, and the ten journeys
  src/widgets/        the vetted interactive widget library and its registry
  src/pages/          catalogue, journey map, node, paywall, completion, widget gallery
  src/lib/            Firebase client and the learner store (localStorage plus Firestore sync)
  scripts/            content validator and Firestore seed script
  e2e/                live smoke test and security-rules test
```

## Commands

Run from `web/`:

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Validate content, typecheck and build to `web/dist` |
| `npm test` | Unit tests, including independent recomputation of numeric answer keys |
| `npm run validate:content` | Check every journey: schema, graph, quiz rules, widget parameters |
| `npm run test:e2e` | Phone-sized smoke test against the live site (`BASE_URL` to override; needs Chrome) |
| `npm run test:rules` | Check Firestore rules against the live project with throwaway anonymous accounts |
| `npm run seed` | Mirror journeys into Firestore (`FIRESTORE_TOKEN` must be a project owner's access token) |

Deploy from the repo root: `firebase deploy --only hosting,firestore,auth`.

## Adding a journey

1. Write `web/src/content/journeys/<id>.ts` following the `Journey` type in `src/content/schema.ts`, and its diagrams in `journeys/visuals/<id>.ts` using the helpers in `src/content/diagram.ts`. Every step needs a visual; use only widgets registered in `src/widgets/registry.tsx`.
2. Add it to `src/content/journeys/index.ts`.
3. Run `npm run validate:content` and `npm test`. Check its visuals at `/widgets?journey=<id>`.

Generated journeys (v1) will use the same schema and validator.
