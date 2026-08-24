# Starship Ithaca

An authored, dialogue-led science-fiction odyssey about bringing a damaged ship home while confronting the crime that stranded it.

This repository is a clean rebuild. It does not inherit the procedural galaxy or random-campaign assumptions of `starship-explorer`.

## Playable vertical slice

The browser opens directly into a cinematic episode covering the first four sequential set pieces:

- cinematic dialogue with a consistent recurring cast;
- cinematic voyage interludes that recap consequences and establish the next objective;
- two real-time-with-pause ship combat encounters;
- weapon-specific projectiles, shield impacts, damage feedback and synthesized combat audio;
- visually distinct power routing, medical triage, memory reconstruction, navigation and circuit minigames;
- choices that persist in the deterministic campaign state;
- autosave and continue support in local storage;
- sixteen original, optimized backgrounds, portraits and combat assets.

## Run locally

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run build
```

## Foundation

The underlying typed foundation defines:

- the **CSV Ithaca** and a fixed recurring cast led by Captain Alexander Vale;
- 32 ordered campaign beats across four acts;
- typed dialogue, hub, minigame, combat and cutscene activities;
- mandatory and conditional authored ship battles;
- persistent story flags, individual relationships, crew status and ship damage;
- a deterministic, serializable reducer and action log;
- validation tests that protect campaign and canon from accidental drift.

## Documents

- [`docs/VERTICAL-SLICE.md`](docs/VERTICAL-SLICE.md) — the playable sequence, controls and visual direction
- [`docs/CANON.md`](docs/CANON.md) — names, characters and terminology that must remain consistent
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — boundaries between campaign content, rules, UI and assets
- [`docs/PART-1.md`](docs/PART-1.md) — foundation scope and acceptance criteria

## Stack

TypeScript · React · Vite · Vitest
