# Part 1 — canon and architecture

## Delivered

- Clean Vite, React and TypeScript project.
- Canonical ship, cast, factions and terminology.
- All 32 campaign beats represented as typed content data.
- Typed reusable minigame templates and combat objectives.
- Nine mandatory and four conditional battle definitions.
- Persistent story flags and individual relationships.
- Persistent character, ship, evidence and pursuit state.
- Deterministic reducer with sequential beat enforcement and action replay.
- Architecture viewer and validation status screen.
- Canon, campaign and state tests.

## Acceptance criteria

- `npm test` passes.
- `npm run build` passes.
- Canon and campaign validators report no errors.
- Starting the campaign selects beat 1.
- The reducer rejects skipping a beat.
- The reducer rejects completing a beat while mandatory activities remain.
- Typed effects survive deterministic replay.
- No code or assets are copied from `starship-explorer`.

## Deliberately deferred

- Finished visual assets and the asset manifest.
- Save storage and migrations beyond schema version 1.
- Dialogue node scripting and authored choices.
- Functional minigames.
- FTL-style battle simulation.
- Audio.
- The playable beats 1–4 vertical slice.

