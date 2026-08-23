# Starship Ithaca

An authored, dialogue-led science-fiction odyssey about bringing a damaged ship home while confronting the crime that stranded it.

This repository is a clean rebuild. It does not inherit the procedural galaxy or random-campaign assumptions of `starship-explorer`.

## Part 1 — canon and architecture

The first foundation establishes:

- the **CSV Ithaca** and a fixed recurring cast led by Captain Alexander Vale;
- 32 ordered campaign beats across four acts;
- typed dialogue, hub, minigame, combat and cutscene activities;
- nine mandatory and four conditional authored ship battles;
- persistent story flags, individual relationships, crew status and ship damage;
- a deterministic, serialisable reducer and action log;
- validation tests that protect the campaign and canon from accidental drift.

The current web screen is an architecture viewer, not the first playable episode. Part 2 will turn beats 1–4 into the vertical slice.

## Run locally

```bash
npm install
npm run dev
npm test
npm run build
```

## Documents

- [`docs/CANON.md`](docs/CANON.md) — names, characters and terminology that must remain consistent
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — boundaries between campaign content, rules, UI and assets
- [`docs/PART-1.md`](docs/PART-1.md) — scope and acceptance criteria for this foundation

## Stack

TypeScript · React · Vite · Vitest

