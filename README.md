# Starship Ithaca

An authored, dialogue-led science-fiction odyssey about bringing a damaged ship home while confronting the crime that stranded it.

This repository is a clean rebuild. It does not inherit the procedural galaxy or random-campaign assumptions of `starship-explorer`.

## Playable vertical slice

The browser opens directly into a cinematic Act I covering the first eight sequential set pieces:

- cinematic dialogue with a consistent recurring cast;
- cinematic voyage interludes that recap consequences and establish the next objective;
- three real-time-with-pause ship combat encounters, including a timed survival battle against an unbeatable pursuer;
- weapon-specific projectiles, shield impacts, damage feedback and synthesized combat audio;
- ten visually distinct puzzles and action minigames, plus an explorable crew-rumour hub;
- choices that persist in the deterministic campaign state;
- autosave and continue support in local storage;
- twenty-five original, optimized backgrounds, portraits and combat assets.

The second playable slice completes Act I across Beats 05–08: Vale chooses the identity sent into the dark, survives the Tidefather’s first wrath, bargains for a spatial current in the Aeolian cloud cities, and judges the conspiracy that destroys the apparent route home.

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
- [`docs/ADVERSARIAL-EVALUATION.md`](docs/ADVERSARIAL-EVALUATION.md) — hostile release rubric and executable experience-quality gates
- [`docs/PART-1.md`](docs/PART-1.md) — foundation scope and acceptance criteria

## Stack

TypeScript · React · Vite · Vitest
