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
| Character connection | 20% | Can the player distinguish the cast without reading job titles? Does each person want something beyond explaining the plot? Does the game remember how Vale treated them? | Seven core companions have four-stage arcs in each playable act; choices alter trust; dialogue, private conversations and later lines reflect earlier decisions. |
| Minigame clarity | 15% | Is the goal visible? Are inputs obvious? Can the player understand progress and failure before committing? | Every minigame declares goal, input, stakes, three feedback modes and a concrete state consequence. Hidden arbitrary targets are prohibited. |
| Minigame engagement | 15% | Is this a meaningful decision or merely busywork? Does the fiction change the way the mechanic feels? Is failure interesting? | Fourteen mechanically distinct activities mix deduction, allocation, ethical choice, navigation and combat; failure changes difficulty or state instead of erasing story choices. |
| Cinematic impact | 15% | Does the sequence create anticipation, contrast, escalation and release? Are still images doing dramatic work rather than decorating text? | Purpose-made widescreen locations, recurring portraits, cutaways, quiet pre-action scenes, weapon effects, survival spectacle and consequence scenes. |
| Visual usability | 10% | What is the first thing the eye sees? Can a laptop player see the decision and context together? Are status, feedback and danger differentiated? | Height-aware portrait scaling, compact laptop rules, mobile collapse, consistent amber/cyan/red semantics and task-specific interfaces. |
| Campaign momentum | 5% | Does every payoff generate the next problem? Is there a compelling reason to continue? | Pride → wrath → fragile hope → betrayal becomes predation → uncertain identity → temptation → costly recovery, leading directly to the Archive of the dead. |

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
| The neural lock initially labelled the accountable answer as the “difficult detail,” making a supposed identity struggle a transparent morality quiz. | High | Replaced evaluative answer labels with neutral memory concepts; the rewrite result now appears only after commitment through the anchor rail and meter. |
| Identity forensics risked implying that a body classification could settle personhood. | High | The game now classifies continuity evidence only; the following scene explicitly separates biological origin, Cirene’s deception and each claimant’s worth. |
| Cirene could have become a conventional deceptive scientist whose offer no sensible player would accept. | High | Her treatment works, the refuge saves lives, boundaries can be honoured, and each companion names something real they would lose by leaving. |
| The harbour route risked being a cosmetic path picker before a fixed battle. | High | Every corridor carries visible hull risk and convoy capacity; route quality changes target health and firing rate, while convoy survival changes the aftermath. |
| A long refuge sequence could stall the campaign in exposition. | Medium | The explorable hub gives each companion a distinct private want, then the external clock turns rest into an irreversible thirteen-month consequence. |
| A refit after Act I could erase the meaning of the player’s accumulated damage. | High | Only three of six capabilities can be restored; unselected weaknesses remain and every repair installs a persistent Cirene-derived module. |
| Escaping Cirene through combat could falsely frame killing her as victory. | Medium | The optional battle targets capture ribbons, sensors and a docking seal; result text records that custodians were disabled and Cirene remains alive. |

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

## Act II Slice I release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.2 | Four full interludes connect the broken sphere to the harbour, the survivors to Cirene, the continuity audit to the bargain, and the refuge to the lost year. | Recall must still be measured with first-time players rather than inferred from text coverage. |
| Character connection | 9.0 | Seven continuing four-stage arcs, a second private-conversation hub, Cirene’s own coherent philosophy, and state-aware callbacks to mutiny, convoy, copies and alliance. | Named secondary survivors need portraits or recurring visual identifiers if they return later. |
| Minigame clarity | 8.9 | Four new goals declare inputs and stakes; route risk, convoy capacity, evidence layers, rewrite percentage and growth cycles remain visible throughout play. | Real completion-time telemetry is needed to tune clue density and route reading time. |
| Minigame engagement | 8.8 | Planning changes combat, forensics precedes moral judgment, the neural game attacks Vale’s actual arc, and refit choices preserve earlier damage. | Neural choices remain authored dilemmas rather than a systemic puzzle with emergent solutions. |
| Cinematic impact | 9.2 | Six purpose-built widescreen environments, Cirene’s recurring portrait, two combat silhouettes, strong palette contrast and quiet domestic refuge imagery. | Still-image staging cannot provide performance nuance equivalent to animation or voiced delivery. |
| Visual usability | 8.4 | New interfaces have explicit laptop-height compression, mobile collapse, scroll-safe cards and the established cyan/amber/red semantics. | The cloud preview could not reach the local development server; screenshot regression remains an explicit unresolved gate. |
| Campaign momentum | 9.3 | Each sanctuary solves the previous threat while creating a more intimate danger; the lost year converts comfort into urgency and points directly to the Mourning Archive. | Beat 13 must repay the promised descent with a mechanically distinct opening. |

**Weighted score: 8.98 / 10 — pass.** This matches or exceeds the internal Act I baseline. Twenty-eight automated tests cover campaign flow, asset delivery, server rendering, state-aware callbacks, narrative ladders, character arcs and minigame contracts. The score remains provisional until first-time player observation and rendered screenshot regression are available.
