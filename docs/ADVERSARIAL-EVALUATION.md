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
| Minigame engagement | 15% | Is this a meaningful decision or merely busywork? Does the fiction change the way the mechanic feels? Is failure interesting? | Thirty-one registered minigames mix deduction, allocation, ethical choice, navigation and combat; failure changes difficulty or state instead of erasing story choices. |
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

## Act II complete release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.3 | Five additional state-setting interludes connect Cirene’s lost year to the Archive, the Gate record, Rao, Elara and TIRESIAS without requiring external lore. | Cold-player recall still needs observation rather than content counting. |
| Character connection | 9.2 | Elara gains her own voice and doubt; Rao makes one casualty personal; Vale and Morozova’s disagreement advances from guilt into command legitimacy. | Rao currently appears in one concentrated episode and needs later callback if preserved aboard. |
| Minigame clarity | 9.0 | Five new games expose goal, input, stakes and three live feedback channels; every task is explained by a character before interaction. | Completion times remain estimated until telemetry is available. |
| Minigame engagement | 8.9 | Shutdown ordering, causal evidence, memory recovery, honest signal reconstruction and constraint logic each perform different narrative work. | Message assembly is intentionally contemplative and should be tested for excessive simplicity. |
| Cinematic impact | 9.3 | Four new widescreen environments and two portraits move from black-hole scale to one intimate Earth carrier, then open into the probability observatory. | Still-image performance remains the production limitation. |
| Visual usability | 8.7 | New interfaces include short-height compression, responsive grids, explicit status panels and no hidden essential control. | Screenshot regression at target hardware remains unresolved. |
| Campaign momentum | 9.5 | Each recovered truth creates the next personal question, and TIRESIAS converts the investigation into an unavoidable Act III route. | Act III must immediately repay the Choir promise. |

**Weighted score: 9.15 / 10 — pass.** The complete Act II now contains nine beats, nine transition briefings and nine distinct playable frameworks, with the same executable quality contract used for Act I.

## Act III Slice I release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.0 | Four interludes carry the Archive prophecy through temptation, isolation and the impossible passage; both route choices now receive a causally different rescue briefing and aftermath. | Cold-player recall still needs observation rather than content counting. |
| Character connection | 9.1 | Every core officer names a distinct temptation, all six captives speak, and the bespoke aftermath preserves both the returned and abandoned name lists. | Later Helios dialogue must call back individual survivors instead of treating the ledger as a completed subplot. |
| Minigame clarity | 8.7 | Choir telemetry has a three-field rule; navigation uses physical evidence with changing answer positions; route extraction mixes sourced facts and temptations; power transfer explicitly names donor and destination. | First-time completion time and clue interpretation cannot yet be measured. |
| Minigame engagement | 8.6 | Failure is now fail-forward; the passage contains three finite-burn hazards; rescue order changes reachability through Sato, Amari and Vega, while delay damages hull and raises pursuit. | The intercept clock is operation-driven rather than real-time and should be compared with a timed variant during playtesting. |
| Cinematic impact | 9.0 | Four purpose-made environments, a dedicated transparent Scylla creature, route-specific combat copy and a human aftermath replace the incorrect capital-ship silhouette and abrupt completion card. | Performance remains still-image led rather than voiced or animated. |
| Visual usability | 8.1 | The Act III composition now enters compact mode at 850px, uses a three-by-two rescue grid at laptop width, scroll-safe game frames and a clearly styled protected combat target. | The cloud browser could not reach the local preview, so 1366×768 and mobile screenshot inspection remains a declared provisional limitation. |
| Campaign momentum | 9.2 | TIRESIAS’s warning is repaid immediately; contamination worsens the passage; the route choice changes the crisis; the rescue ledger flows directly into Helios. | Beat 22 must give the living sun enough calm before hunger corrupts the prohibition. |

**Weighted score: 8.84 / 10 — provisional pass.** This replaces the earlier 9.28 self-score, which the independent review found indefensible. Forty-two automated tests now include protected-objective logic, route divergence, rescue sequencing, exact aftermath callbacks, asset delivery and the short-laptop CSS contract. Publication still records rendered viewport inspection as an unresolved limitation rather than claiming it occurred.

## Act III Slice II red-team findings and corrections

| Finding | Severity | Correction |
| --- | --- | --- |
| The first ecology draft labelled observations as birth, feeder, consumer and protector, reducing inference to copying the labels. | High | Replaced the labels with population-change telemetry; the player must infer the causal order, while two non-living decoys remain plausible until the evidence is read. |
| The first coronal hazard asked only for a path below 60 MK, but two paths satisfied that rule. | High | Added the second necessary constraint—outside a living migration—and exposed both temperature and population telemetry before commitment. |
| A mutiny allocation could be misread as saving the captured organism. | High | The briefing, interface and confrontation all state that the first extraction already killed it; cradle isolation only stops the second cycle and preserves a remnant. |
| The six-person Scylla ledger risked becoming an emotional callback with no mechanical force. | High | Sato, Rao and Amari reduce battle pressure; Vega absorbs one routing error; Tamsin changes clinic cost and the post-battle casualty scene. Exact rescue evidence drives every assist. |
| Helios’s nursery could become another objective in a visually busy battle. | High | Added a protected, disabled nursery target, explicit preserve copy and an objective-completion test that ignores protected life. |
| Relationship history could invisibly select the dying companion and make the player feel manipulated by an undisclosed formula. | High | Every qualified human volunteer appears with trust, skill and the exact human loss; the player confirms the lethal assignment explicitly before the first drive input. |
| ELIAS initially appeared as a sacrifice candidate, breaking his established Argos function in the homecoming. | High | Removed him from the candidates and gave him an explicit line explaining why synthetic control cannot survive the Gate scar. |
| The first memorial draft allowed Morozova or Corelli to speak after being selected as the dead companion. | Critical | Memorial witnesses now branch around the actual death; the selected character appears only in the recorded final transmission and is marked dead in state. |
| The companion death could collapse directly into a completion card and convert grief into progression UI. | High | Added a separate five-line memorial scene, empty-place cutaway and forty-seven seconds of recorded silence before the Calypso hook. |

## Act III Slice II release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.2 | Four full interludes establish rescue debt, the six-day recharge, the already-fatal extraction, two accusers and the mechanical cause of the final sacrifice. | Cold-player recall still needs observation rather than content inspection. |
| Character connection | 9.3 | Five transparent companion outcomes, relationship-specific final words, state-aware memorial witnesses, and named lower-deck responsibility prevent the arc becoming abstract tragedy. | Future beats must adapt every scene to the selected death rather than quietly restoring the full cast. |
| Minigame clarity | 9.0 | Causal telemetry, visible collection harm, override budgets, path requirements and drive tradeoffs expose goal, input, progress and cost before commitment. | Real first-attempt completion time remains unmeasured. |
| Minigame engagement | 8.9 | Ecology inference becomes ethical extraction; rescue order changes mutiny and battle; the control grid has no cost-free route; the final game balances stability against testimony after a certain death. | The mutiny remains turn-based allocation and should be compared with a more spatial network presentation in player tests. |
| Cinematic impact | 9.3 | Six purpose-built widescreen states and an astronomical Helios portrait create wonder, confinement, three-sided catastrophe, lethal distance and quiet mourning. | Performance is still portrait-and-still-image cinema rather than voiced or animated acting. |
| Visual usability | 8.2 | Gold/red/cyan semantics, three-by-two short-laptop volunteer cards, 100dvh scrolling, mobile collapse and protected-target styling have executable CSS gates. | The cloud browser could not reach the local preview before publication, so rendered 1366×768 and 390×844 inspection remains provisional until the deployed build is available. |
| Campaign momentum | 9.4 | Rescue debt materially changes Helios; understanding becomes prohibition, deprivation becomes mutiny, mutiny awakens judgment, and survival creates the personal death that opens directly onto Calypso’s impossible shore. | Beats 26–27 must allow grief to remain present inside paradise instead of treating Calypso as a reset. |

**Weighted score: 9.07 / 10 — provisional pass.** Fifty-three automated tests cover all twenty-five playable beats, twenty-eight minigame contracts, server rendering of every new interaction, causal ecology, non-lethal recharge reachability, unavoidable mutiny cost, survivor payoffs, protected battle objectives, explicit sacrifice selection, relationship-specific last words, death-safe aftermath dialogue, asset delivery and short-laptop layout rules. The visual score remains deliberately constrained until a rendered deployed build can be inspected.

## Calypso and Hospitality red-team findings and corrections

| Finding | Severity | Correction |
| --- | --- | --- |
| An early false-home structure allowed “that is not how Vale remembers it” to function as proof, even though Calypso owns the same unreliable memory. | High | Every correct observation is now independently repeatable: fixed shadows against elapsed clock time, an unanswered adult transmission and an exactly repeating chaotic wave. Memory-only objections fail forward with an explanation. |
| Failed paradise tests initially had no cost beyond a lower score. | High | Every failed test adds four external years. The exact elapsed total is repeated in the next dialogue, interlude record and Act IV completion card. |
| Accepting one final day with the reconstructed family described additional lost time but did not change state. | High | The choice now records four further external years and changes Elara trust; all time displays combine the investigation and voluntary delay. |
| Calypso’s consciousness copy could be misread as avoidable if the player chose the “correct” exit. | High | The copy is inevitable and always receives campaign state. Identity performance changes fidelity; departure choices control its first moral inheritance, future contact or hostility. |
| A dead Beat 25 companion could reappear as the crew witness in the Phaeacian chamber. | Critical | Witness selection checks live character state and falls through the surviving cast to ELIAS; the dead person appears only as a preserved or fragmented record. |
| The Phaeacian account risked becoming four generic morality choices disconnected from twenty-five earlier beats. | High | Each testimony chapter is generated from actual Gate evidence, Scylla names, mutiny casualties, Helios remnant state, the selected dead companion and final-record quality. |
| Tying Phaeacian sanctuary to truthfulness would contradict the civilisation’s defining ethic. | High | Shelter and passage remain unconditional. Candour changes witness credibility, escort groups and battle assistance—not whether the stranger is protected. |
| A crippled zero-hull Ithaca could enter an unwinnable convoy battle immediately after being rescued. | High | Completing testimony applies explicit Phaeacian emergency hull and shield repair before combat; this is shelter made mechanically real rather than a silent difficulty floor. |
| The civilian sanctuary vessel could become another target in a visually crowded encounter. | High | It is a disabled protected target excluded from objective completion. Tests prove combat can end only by disabling the three Eidolon marking systems. |
| The interlude route and voyage HUD treated Beat 28 as Act III, erasing the structural homecoming threshold. | Medium | Beat 28 now begins a five-beat Act IV route, and the title, HUD and completion language all identify the transition. |

## Calypso and Hospitality release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.3 | Three causal interludes distinguish death, reconstruction, lost external time, identity exit, testimony and convoy defence; every revelation arrives before its choice. | First-time recall must still be observed rather than inferred from content coverage. |
| Character connection | 9.4 | The chosen dead companion shapes paradise and the maze without returning as a speaker; adult Elara’s uncertainty becomes the reason to leave; a living witness contests Vale’s Phaeacian account. | Beat 29 must repay Elara’s accumulated trust and elapsed years from her own playable perspective. |
| Minigame clarity | 9.1 | Physical tests, outward identity anchors, candour, coherence and escort forecasts are visible before commitment, with specific success and failure explanations. | Real completion time and misread telemetry require player observation. |
| Minigame engagement | 9.0 | Investigation distinguishes evidence from memory, identity choices build an autonomous rival, testimony remixes campaign state and the final account alters combat. | These are deliberately reflective games; pacing should be tested against players who prefer the combat loop. |
| Cinematic impact | 9.5 | Seven purpose-built widescreen environments, two recurring alien portraits, six additional cutaways and a shelter-versus-pursuit battle create a strong visual and emotional reversal. | Performance remains still-image and portrait-led rather than voiced or fully animated. |
| Visual usability | 8.3 | Every new surface server-renders with goal and feedback, has two compact-height tiers, collapses to mobile and uses consistent cyan/amber/red semantics. | The cloud browser cannot reach the local preview and the deployed project is access-protected, so screenshot regression remains explicitly provisional. |
| Campaign momentum | 9.6 | Grief creates paradise; paradise creates an identity rival; refusal creates testimony; testimony makes hospitality materially dangerous; the convoy points directly to playable Elara on Earth. | Beat 29 must immediately transfer agency to Elara rather than delay the promised home perspective. |

**Weighted score: 9.19 / 10 — provisional pass.** Sixty-six automated tests now cover twenty-eight playable beats, thirty-one minigame contracts, state-built testimony, repeatable paradise evidence, fail-forward external time, copy inevitability, death-safe witness selection, unconditional sanctuary, variable escort assistance, protected civilians, all sixty-one assets and both short-laptop breakpoints. The visual score remains constrained until rendered target-viewport inspection is available.

## Complete Act IV red-team findings and corrections

| Finding | Severity | Correction |
| --- | --- | --- |
| Elara could become a second Vale-shaped dialogue proxy instead of a distinct playable protagonist. | Critical | Beat 29 transfers control immediately. Her investigation begins with independently dated evidence and her chase rewards civilian restraint, not Vale’s combat instincts. |
| A successful shuttle escape initially set `elara-trusts-vale`, confusing piloting competence with a personal judgment. | High | Escape now records shuttle damage and slightly changes relationship pressure only. Trust is set or cleared solely by the developed reunion choice. |
| Private recognition, biometric authentication and moral authority risked collapsing into the same proof. | Critical | ELIAS proves one unnetworked embodied habit; the chair proves continuity through scars and contradiction; Elara and the public trial decide what authority follows. |
| Calypso’s second Vale makes a unique neural imprint insufficient identity proof. | High | The resonance puzzle explicitly rejects archived biometrics and command codes, and requires consent to release the public record before authority can wake. |
| A dead Beat 25 companion could return as live trial testimony. | Critical | Trial witness selection checks character state and falls through the surviving crew. The dead appear only through preserved records. |
| The full Gate reveal could absolve Vale by making the falsified intelligence the final answer. | Critical | The trial holds two facts in the same sentence: intelligence removed gestational evidence and Vale still fired before resolving the living signal. |
| Early final-combat copy described opening a memory aperture by shooting it. | High | Combat now disables separate bridge locks while the aperture, civilian ring and Phaeacian witness ship are protected non-targets. |
| Emergency combat hull floors silently created ship integrity. | High | Invisible floors were removed. Earth’s explicit eighteen-point repair occurs after the trial and is named in the final interlude. |
| Rapid one-click final puzzles moved before the player could understand results. | High | Shuttle, resonance, citadel and shared-memory phases now reveal the causal answer, update live state and require deliberate acknowledgement before advancing. |
| Endings could appear as hidden morality thresholds. | High | Every locked ending shows its exact requirement. Vengeance and exile remain available; atonement, reconciliation and succession require public truth, preserved life, a stable bridge or earned Elara trust. |

## Complete campaign release-candidate scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.5 | Thirty-one causal interludes connect every transition; Act IV explicitly separates return signal, occupation, recognition, authentication, testimony, battle and resolution. | First-time comprehension still needs observation with players who begin after long pauses. |
| Character connection | 9.6 | Elara becomes playable before meeting Vale; ELIAS refuses to overclaim recognition; the actual dead companion remains in the trial record; surviving crew testimony branches around death state. | Voice performance and facial-expression variants would raise emotional specificity beyond text and still portraits. |
| Minigame clarity | 9.4 | All thirty-seven contracts expose goal, input, stakes, feedback and persistent consequence; final activities now reveal causal results before advancing. | Real completion-time telemetry is not yet available. |
| Minigame engagement | 9.2 | The final act alternates deduction, navigation, infiltration, resonance, protected combat, network control, moral synthesis and ending strategy. | Long-session fatigue and replay pacing need external player data. |
| Cinematic impact | 9.6 | Six new purpose-built 16:9 frames give Earth, ELIAS, the trial, siege, shared memory and epilogue a coherent steel/amber/bone visual convergence. | The production remains still-image and synthesized-audio cinema rather than voiced, motion-captured performance. |
| Visual usability | 8.7 | Laptop-height tiers, mobile collapse, scroll-safe surfaces, disabled-target styling, reduced motion and server-render checks cover every new interface. | Browser access restrictions prevented final deployed 1366×768 and 390×844 screenshot regression, so this score remains provisional. |
| Campaign momentum | 9.7 | Phaeacian shelter transfers agency to Elara immediately; investigation creates infiltration; recognition creates trial; trial creates a protected record; tactical victory creates—not replaces—the final moral choice. | External playtesting must confirm the full-campaign session rhythm. |

**Weighted score: 9.39 / 10 — provisional release pass.** Seventy-seven automated tests cover all thirty-two beats, thirty-seven minigame contracts, the complete deterministic path, all five ending gates, death-safe witnesses, protected objectives, six final cinematic assets, mobile/short-laptop rules and server rendering of every new interaction. “Provisional” applies only to live target-device observation; no screenshot inspection is being claimed where access was unavailable.

## Dialogue and performance red-team pass

This pass attacked the complete campaign as drama rather than counting scenes. The evaluator looked for interchangeable voices, polished thesis statements, choices delayed until after a speech, invisible relationship arithmetic, forgotten callbacks, emotionally static portraits, session-reentry confusion and combat-audio fatigue.

| Finding | Severity | Correction |
| --- | --- | --- |
| Vale, Morozova and Cross could all sound like the same careful moral essayist. | Critical | Added an executable voice bible for nine principal characters: rhythm, pressure behavior, humour, evasions, concrete lexicon, forbidden phrasing and private need. Signature scenes were rewritten against it. |
| Important conversations made the player listen to a complete argument before responding. | Critical | Added ten mid-scene relationship moments with three meaningfully different responses each and an immediate performed reply before the scene continues. |
| One scalar “relationship” score could not distinguish affection, confidence, professional respect and accumulated anger. | High | Added separate trust, intimacy, respect and resentment axes while retaining migration support for existing campaign effects. |
| Dialogue choices changed state but later scenes recalled only broad flags. | High | Added deterministic dialogue memories. Elara’s Archive message changes the reunion; the reunion changes the final contact; the journey log preserves the player’s exact remembered words. |
| Portrait-led scenes could not show anger, fear, exhaustion or grief without naming the feeling in text. | High | Added seven identity-locked performance portraits and shot, reaction, pause and music-ducking direction. Side-by-side visual inspection confirmed face, costume and lighting continuity. |
| Long-session players could not reread a line or recover context after returning to a save. | High | Added Back and Transcript controls, state-aware resume briefings, a qualitative journey log and adjustable dialogue text size. Version-one saves migrate to the new relationship and memory schema. |
| The journey log claimed “people, not points” and then exposed numerical relationship scores. | Medium | Replaced numbers with qualitative states such as guarded, opening, entrusted, distant, personal, strained and raw. |
| Short-laptop rules hid mid-scene choice detail and system-sacrifice descriptions. | Critical | Replaced both `display:none` rules with compact two-line clamps, preserving motive and human cost inside the target viewport. |
| “Reporting damage” voice samples could fire every few seconds and become comic through repetition. | High | Removed both audio binaries, source IDs, preloads and call sites. Combat now uses three sparse, threshold-triggered text barks that each fire at most once per encounter. |
| Several late lines declared the theme as polished “not X, but Y” aphorisms. | High | Rewrote the Garden, Archive, Helios, Calypso and Phaeacian confrontation lines as remembered names, measurements, actions and sensory threats specific to the speaker. |

### Performance-pass scorecard

| Category | Score | Evidence | Remaining pressure |
| --- | ---: | --- | --- |
| Story clarity | 9.5 | Thirty-one interludes remain intact; resume briefing, scene orientation, transcript and journey log now support re-entry and recall. | Comprehension still needs observation with first-time players after a multi-day break. |
| Character connection | 9.6 | Nine enforceable voice profiles, ten interruptible private moments, four relationship axes, exact callbacks, a multi-question crew hub and seven emotional portraits. | The complete campaign does not yet have expression variants for every character and every scene. |
| Dialogue humanity | 9.4 | Short replies, unfinished personal questions, jokes, evasions, silence, reaction shots and concrete nouns replace the key thesis exchanges. | External table reads would expose cadence problems static inspection cannot hear. |
| Minigame clarity | 9.5 | All thirty-seven contracts still pass; the adversarial laptop correction keeps relational and sacrifice costs visible instead of hiding them for fit. | First-attempt timing and misclick telemetry remain unavailable. |
| Cinematic impact | 9.4 | Staged scene headings, close/wide/reaction framing, emotional portraits, cutaways, held silence, music ducking and sparse combat barks create editorial rhythm. | This remains still-image cinema without full voice acting or character animation. |
| Visual usability | 8.9 | 85–130% text scaling, transcript, laptop-height clamps, mobile collapse, reduced motion and qualitative relationship language have executable gates. | The cloud browser could not reach the private local preview, so no target-device screenshot pass is claimed. |
| Audio discipline | 9.3 | Music remains scene-specific; effects retain weapon identity; repetitive damage dialogue is absent from source, manifest and disk. | A future mix pass should add intentional silence and more location-specific ambience. |

**Weighted performance score: 9.37 / 10 — provisional pass.** Ninety automated tests pass across deterministic state, all campaign beats, thirty-seven minigame contracts, audio delivery, save migration, dialogue performance, callbacks, asset continuity and laptop/mobile rules. Strict TypeScript and the production build pass. The production bundle is 621.7 KB minified / 186.6 KB gzip; route-level code splitting remains a documented optimization rather than a release blocker.
