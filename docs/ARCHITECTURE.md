# Architecture

## Purpose

Story Mode is a deterministic authored campaign. The same initial state plus the same serialised action log must always produce the same result.

## Boundaries

### `src/canon`

Stable identities and terms: characters, ship, factions and asset keys. Other layers import these IDs; they do not duplicate names.

### `src/campaign`

Authored content metadata. A beat contains a cast, a location and ordered activities. Activities are dialogue, hub scenes, minigames, combat or cutscenes.

The campaign layer describes an objective. It does not implement combat, puzzle rules or React components.

### `src/state`

Pure serialisable game state and reducer. It owns persistent facts:

- campaign position;
- completed activities;
- named story flags;
- individual relationships;
- character status;
- ship integrity, modules and scars;
- pursuit pressure;
- evidence and ending eligibility;
- replayable actions.

The reducer has no DOM, audio, timers or unseeded randomness.

### `src/ui`

Presentation only. The Part 1 screen exposes the registries and validation state. Later screens will translate engine state into dialogue, hub, minigame and combat views.

### `public/assets` (Part 2 onward)

All visual references will resolve through an asset manifest. Character IDs must never point directly to arbitrary generated filenames inside scene code.

### `src/audio`

`tracks.ts` is the manifest: the four music compositions, the combat samples and the battle effect frames. Nothing else in the codebase names an audio file.

A single director owns playback. Screens never choose a track — they claim a **scene** (`title`, `voyage`, `alien` or `combat`) for as long as they are mounted, and the director crossfades between compositions. Claims are coalesced to the end of the React commit, so unmounting one screen and mounting the next never audibly bounces through the default theme. The alien scene is derived from content rather than a screen list: any dialogue in which an Eidolon or encounter character speaks is scored as an encounter, including scenes built from campaign state.

Audio is a progressive enhancement throughout. Blocked autoplay, an unavailable `Audio` constructor and unwritable storage each degrade to a silent but fully playable game, and none of it runs during server rendering.

## Activity lifecycle

1. The current beat selects an authored activity.
2. The appropriate UI runs it.
3. The result returns a choice ID and typed effects.
4. The reducer applies and records those effects.
5. Combat or a minigame resumes the dialogue that launched it.
6. A beat completes only after every mandatory activity has resolved.

## Failure policy

Minigame failure normally creates a consequence, harder combat or lost opportunity. It should not reload the puzzle. Combat defeat may end the campaign, but objective failure may also create retreat, casualties or a worse subsequent beat.

## Invariants

- Exactly 32 ordered beats across acts of 8, 9, 10 and 5 beats.
- Nine mandatory and four conditional battles in the campaign registry.
- Every cast member and combat opponent resolves to a canonical ID.
- Activity IDs are unique within a beat.
- A beat cannot be skipped or completed with mandatory activities unresolved.
- Relationships and integrity values are clamped at reducer boundaries.
- Accepted actions are serialisable and replayable.

