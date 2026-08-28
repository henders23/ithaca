# Starship Ithaca

An authored, dialogue-led science-fiction odyssey about bringing a damaged ship home while confronting the crime that stranded it.

This repository is a clean rebuild. It does not inherit the procedural galaxy or random-campaign assumptions of `starship-explorer`.

## Playable campaign

The browser opens directly into the complete thirty-two-beat cinematic campaign across all four acts:

- cinematic dialogue with a consistent recurring cast;
- cinematic voyage interludes that recap consequences and establish the next objective;
- objective, survival, boss-passage and protected-target ship combat encounters with persistent damage;
- weapon-specific projectiles, shield impacts, damage feedback and synthesized combat audio;
- thirty-seven registered puzzles and action minigames, plus explorable character hubs;
- choices that persist in the deterministic campaign state;
- autosave and continue support in local storage;
- sixty-seven original, optimized backgrounds, portraits and combat assets.

The second playable slice completes Act I across Beats 05–08: Vale chooses the identity sent into the dark, survives the Tidefather’s first wrath, bargains for a spatial current in the Aeolian cloud cities, and judges the conspiracy that destroys the apparent route home.

The first Act II slice covers Beats 09–12: the Ithaca runs a harbour that consumes its guests, confronts duplicate personhood in Doctor Cirene’s Palace of New Flesh, defends Vale’s memory from a compassionate rewrite, and spends forty-seven days in a refuge while thirteen months pass outside.

The second Act II slice covers Beats 13–17: the ship enters the Mourning Archive as a corpse, reconstructs the falsified Gate record, answers Rao’s unburied consciousness, receives Elara’s challenge from Earth and derives the Act III route from TIRESIAS.

Act III covers Beats 18–27: the crew resists the Choir, crosses between Scylla and Charybdis, carries an exact rescue ledger into the living Helios system, breaks under hunger, survives two claims of vengeance, loses one relationship-defined companion and then refuses Calypso’s perfect reconstruction of Earth.

Act IV covers Beats 28–32: Vale gives a state-built account to the Phaeacians; control passes to Elara for an occupation investigation and shuttle escape; Vale infiltrates his altered home; ELIAS recognizes private continuity without granting moral authority; the command-chair trial exposes the Tide Gate as a cradle; and a three-front finale resolves through five campaign-earned endings.

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
