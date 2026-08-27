# Adversarial experience evaluation

This is a release gate, not a celebration of completed work. The evaluator must assume the player is impatient, has forgotten names, does not understand the interface, and will stop playing as soon as the game asks for attention it has not earned.

## Release rule

Score every category from 1–10 using the observable evidence below. A build fails when:

- any category scores below 8;
- the weighted score is below 8.5;
- a minigame cannot be explained after ten seconds of looking at it;
- a player cannot state why the current beat follows the previous one;
- a major choice changes state but receives no visible narrative acknowledgement;
- essential controls or decisions are outside a 1366×768 viewport without an obvious scroll affordance;
- a new character appears only to deliver exposition and has no distinct want, fear or judgment.

## Rubric

| Category | Weight | Hostile questions | Passing evidence |
| --- | ---: | --- | --- |
| Story clarity | 20% | Why are we here? What just changed? What is Vale trying to achieve? What remains uncertain? | Each beat has an interlude, gradual reveal ladder, explicit objective, competing interpretations and an aftermath. |
| Character connection | 20% | Can the player distinguish the cast without reading job titles? Does each person want something beyond explaining the plot? Does the game remember how Vale treated them? | Seven core companions have four-stage Act I arcs; choices alter trust; dialogue, private conversations and later lines reflect earlier decisions. |
| Minigame clarity | 15% | Is the goal visible? Are inputs obvious? Can the player understand progress and failure before committing? | Every minigame declares goal, input, stakes, three feedback modes and a concrete state consequence. Hidden arbitrary targets are prohibited. |
| Minigame engagement | 15% | Is this a meaningful decision or merely busywork? Does the fiction change the way the mechanic feels? Is failure interesting? | Ten mechanically distinct activities mix deduction, allocation, ethical choice, navigation and combat; failure changes difficulty or state instead of erasing story choices. |
| Cinematic impact | 15% | Does the sequence create anticipation, contrast, escalation and release? Are still images doing dramatic work rather than decorating text? | Purpose-made widescreen locations, recurring portraits, cutaways, quiet pre-action scenes, weapon effects, survival spectacle and consequence scenes. |
| Visual usability | 10% | What is the first thing the eye sees? Can a laptop player see the decision and context together? Are status, feedback and danger differentiated? | Height-aware portrait scaling, compact laptop rules, mobile collapse, consistent amber/cyan/red semantics and task-specific interfaces. |
| Campaign momentum | 5% | Does every payoff generate the next problem? Is there a compelling reason to continue? | Pride → wrath → fragile hope → betrayal completes Act I and points directly at the Devouring Harbour. |

## Minigame interrogation

For every minigame, the evaluator answers these before allowing release:

1. State the goal in one sentence without quoting the instruction text.
2. Identify the input and at least two live feedback channels.
3. Predict what failure will change in the story or next encounter.
4. Explain why this mechanic belongs in this exact beat.
5. Name the point at which repetition becomes frustration.
6. Check that retry, reset or fail-forward behavior is proportionate to the mistake.

The executable contract lives in `src/slice/experienceManifest.ts`; `tests/experience-quality.test.ts` rejects activities without goals, stakes, feedback, narrative function or consequences.

## Narrative interrogation

At each beat boundary, ask a cold reader to answer:

- What did the Ithaca just survive?
- What persistent consequence came with it?
- Why is this next location or threat reachable now?
- Which characters disagree, and why?
- What is known, suspected and deliberately concealed?
- What emotional question should the player carry into the next action?

If the answer requires external lore, the beat fails. If every character agrees, the scene fails. If the full truth is stated before the player has acted, the reveal structure fails.

## Current red-team findings and corrections

| Finding | Severity | Correction |
| --- | --- | --- |
| Transponder phases were arbitrary and only reported exact matches. | High | Added continuous echo-correlation feedback per identity layer, visible null locks and an injection-risk counter. |
| Spatial-current vane targets were arbitrary. | High | Added advance/retard drift cues, stable-vane count and vessel-stress feedback. |
| Access-log fragments displayed chronological timestamps while claiming timestamps were stripped. | High | Replaced timestamps with untimed fragments whose causal dependencies must be read; added free chain reset. |
| System sacrifice risked feeling like a menu rather than loss. | High | Added a live response from the officer whose people and work are being cut away, followed by two-stage confirmation and an authored aftermath. |
| Identity, rumour and sacrifice choices existed in state but could feel invisible. | High | Tidefather’s greeting, the near-home crew record, interludes and aftermath dialogue now branch on those choices. |
| The pursuer could become another destroy-all boss. | High | The Tidefather encounter is a timed survival objective with regenerating living subsystems; victory language explicitly says the enemy was not defeated. |
| The four-beat slice ended before its thematic promise paid off. | Medium | Beats 05–08 now complete Act I with wrath, refuge, hope, betrayal and the first mutiny. |

## Required evaluation artifacts

- deterministic campaign/state tests;
- asset presence and compression tests;
- narrative pacing, character arc and minigame quality-contract tests;
- TypeScript and production build;
- laptop-height CSS audit at 1366×768 and compact-height audit below 700px;
- mobile CSS audit at 390×844;
- final scorecard with evidence and remaining limitations.

The rubric should become stricter as the game grows. Passing once does not exempt later slices: every new beat must add its minigames and reveal ladder to the executable contract.

## Act I release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.2 | Seven state-aware interludes, eight reveal ladders, explicit objectives, pre-choice disagreement and post-choice aftermaths. | Future testing should measure player recall without prompting. |
| Character connection | 8.7 | Seven four-stage companion arcs, recurring portraits, the crew-deck hub and dialogue that reflects identity, sacrifice and rumour choices. | Elara is deliberately distant in Act I and needs substantial playable presence later. |
| Minigame clarity | 9.0 | Ten goals, visible inputs, at least three feedback modes each, non-arbitrary puzzle cues and readable consequences. | First-time completion time requires real-player telemetry. |
| Minigame engagement | 8.5 | Ethical allocation, deduction, navigation, containment, evidence ordering and three combats all express the fiction differently. | The puzzles are intentionally compact; later slices need deeper mastery and mechanic remixing. |
| Cinematic impact | 9.0 | Five new set-piece backgrounds, three new recurring portraits, a capital ship, cutaways, survival combat, contrast beats and authored aftermaths. | Dialogue remains still-image cinema rather than full character animation. |
| Visual usability | 8.4 | Width and height breakpoints, laptop portrait reductions, scroll-safe minigames, compact combat HUD and mobile collapse rules. | Add screenshot regression tests when the preview environment supports reliable viewport capture. |
| Campaign momentum | 9.3 | Every apparent solution creates the next danger; Act I closes on lost home, damaged trust and a concrete Act II threat. | The Act II opener must repay the Devouring Harbour promise immediately. |

**Weighted score: 8.86 / 10 — pass.** There are no categories below 8 and all automated release gates pass. This is an internal expert score, not a substitute for observation of first-time players; the unresolved telemetry and screenshot-regression items stay on the rubric rather than being treated as completed.
